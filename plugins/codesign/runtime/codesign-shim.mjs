#!/usr/bin/env node
import { runtimeHome, runtimePaths } from "./codesign-shim/codesign-router/paths.mjs";
import { socketAnswers } from "./codesign-shim/codesign-router/peer/ndjson.mjs";
import { connectUnix } from "./codesign-shim/codesign-router/peer/transports/unix.mjs";
import { versionCommand } from "./codesign-shim/codesign-router/units/lifecycle.mjs";
import { compareVersions } from "./codesign-shim/codesign-router/install/version.mjs";
import { CHANNELS, InstallError, activate, assertAcceptable, currentVersion, fetchManifest, installRelease, readUpdateState, recordAccepted, writeUpdateState } from "./codesign-shim/codesign-router/install/install.mjs";
import { checkDue, checkWhenDue, createUpdater } from "./codesign-shim/codesign-router/install/updater.mjs";
import { PROTOCOL_RANGE } from "./codesign-shim/codesign-router/protocol/version.mjs";
import { Peer } from "./codesign-shim/codesign-router/peer/peer.mjs";
import { routerChannel, runAdapter } from "./codesign-shim/codesign-mcp/adapter/main.mjs";
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, closeSync, createReadStream, existsSync, fstatSync, mkdirSync, openSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

//#region src/runtime/shim/main.ts
const PROGRESS_EVERY_MS = 1e4;
const INSTALL_HINT = "CoDesign is installing its engine for the first time. Call this tool again in a minute.";
/** How often a call waiting for the install hears progress; `IMGLY_CODESIGN_PROGRESS_MS` moves it only in a build that is not a release. */
function progressEveryMs(env = process.env, releaseBuild = true) {
	return (releaseBuild ? void 0 : Number(env.IMGLY_CODESIGN_PROGRESS_MS)) || PROGRESS_EVERY_MS;
}
/** A core's `cdsn`: bin/cdsn, or on Windows bin\cdsn.cmd. */
const cdsnFile = () => process.platform === "win32" ? "cdsn.cmd" : "cdsn";
/** `cdsn` of this install: a dev build (IMGLY_CODESIGN_CLI), the core beside this file, else `current`. */
function cliCommand(paths, env = process.env) {
	if (env.IMGLY_CODESIGN_CLI) return [process.execPath, env.IMGLY_CODESIGN_CLI];
	const here = dirname(fileURLToPath(import.meta.url));
	const core = (dir) => {
		if (!existsSync(join(dir, "bin", cdsnFile()))) return void 0;
		if (process.platform !== "win32") return [join(dir, "bin", "cdsn")];
		const { command, args } = versionCommand(dir);
		return [command, ...args];
	};
	const beside = join(here, "..");
	const current = currentVersion(paths);
	return (existsSync(join(beside, "manifest.json")) ? core(beside) : void 0) ?? (current !== void 0 ? core(paths.version(current)) : void 0);
}
async function ensureDaemon(paths, command, timeoutMs = 3e4) {
	if (await socketAnswers(paths.daemonSock)) return;
	const [bin, ...args] = command;
	const started = spawnSync(bin, [
		...args,
		"server",
		"start",
		"--detach"
	], {
		env: {
			...process.env,
			IMGLY_CODESIGN_HOME: paths.home
		},
		encoding: "utf8",
		timeout: timeoutMs
	});
	if (!await socketAnswers(paths.daemonSock)) throw new Error(`the CoDesign daemon did not start: ${started.stderr || started.error?.message || started.status}`);
}
function readSnapshot() {
	const here = dirname(fileURLToPath(import.meta.url));
	for (const file of [join(here, "snapshot.json"), join(here, "..", "snapshot.json")]) try {
		return JSON.parse(readFileSync(file, "utf8"));
	} catch {}
}
/** Before the install: the lists from the snapshot; a call waits for the install, then everything goes through the router. */
function snapshotChannel(snapshot, client, opts) {
	let live;
	let connecting;
	const progress = /* @__PURE__ */ new Set();
	const toolsChanged = /* @__PURE__ */ new Set();
	const designChanged = /* @__PURE__ */ new Set();
	/** Calls waiting for the install, by call id: each one's cancel. */
	const waiting = /* @__PURE__ */ new Map();
	const ready = () => connecting ??= (async () => {
		await opts.install();
		const opened = await opts.connect();
		live = opened.link;
		opened.link.onProgress((p) => {
			for (const listener of progress) listener(p);
		});
		opened.link.onDesignChanged((p) => {
			for (const listener of designChanged) listener(p);
		});
		opened.link.onToolsChanged(() => {
			for (const listener of toolsChanged) listener();
		});
		for (const listener of toolsChanged) listener();
		return opened.link;
	})().catch((err) => {
		connecting = void 0;
		throw err;
	});
	const failed = (err) => ({
		content: [{
			type: "text",
			text: `CoDesign could not install: ${err instanceof Error ? err.message : String(err)}`
		}],
		isError: true
	});
	/** A call that waits for the install hears progress, then runs; a cancel ends the wait. */
	const waitAndCall = async (params) => {
		if (params.progress !== true) {
			ready().catch(() => void 0);
			return {
				content: [{
					type: "text",
					text: INSTALL_HINT
				}],
				isError: true
			};
		}
		let tick = 0;
		const ticker = setInterval(() => {
			for (const listener of progress) listener({
				call: params.call,
				progress: ++tick,
				message: "Installing the CoDesign engine"
			});
		}, opts.progressMs);
		const cancelled = new Promise((resolve) => waiting.set(params.call, () => resolve("cancelled")));
		try {
			const link = await Promise.race([ready(), cancelled]);
			if (link === "cancelled") return {
				content: [],
				isError: true
			};
			return await link.request("tools.call", params);
		} catch (err) {
			return failed(err);
		} finally {
			waiting.delete(params.call);
			clearInterval(ticker);
		}
	};
	ready().catch(() => void 0);
	return {
		link: {
			request: (async (method, params) => {
				if (live !== void 0) return live.request(method, params);
				switch (method) {
					case "tools.list": return { tools: snapshot.toolsFor[client.name ?? ""] ?? snapshot.tools };
					case "instructions": return { text: snapshot.instructions };
					case "skills.list": return { skills: snapshot.skills };
					case "prompts.list": return { prompts: snapshot.prompts };
					case "tools.cancel":
						waiting.get(String(params.call))?.();
						return {};
					case "tools.call": return waitAndCall(params);
					default: return (await ready()).request(method, params);
				}
			}),
			onProgress(listener) {
				progress.add(listener);
				return () => progress.delete(listener);
			},
			onToolsChanged: (listener) => void toolsChanged.add(listener),
			onDesignChanged: (listener) => void designChanged.add(listener),
			close: () => live?.close()
		},
		instructions: snapshot.instructions,
		version: snapshot.runtime
	};
}
async function runMcp(env = process.env) {
	const paths = runtimePaths(runtimeHome(env));
	const snapshot = readSnapshot();
	const progressMs = progressEveryMs(env);
	const installed = () => cliCommand(paths, env) !== void 0;
	let installing;
	/** The install runs in a detached installer, so it outlives this shim; install.lock keeps it to one download. */
	const install = () => {
		if (installed()) return Promise.resolve();
		installing ??= (async () => {
			try {
				const logged = statSync(paths.installLog, { throwIfNoEntry: false });
				const child = spawnInstaller(paths, env);
				const ended = await new Promise((resolve) => {
					child.once("error", (err) => resolve(`the installer did not start: ${err.message}`));
					child.once("exit", (code, signal) => resolve(`the installer ended with ${signal ?? `exit code ${code}`}`));
				});
				if (installed()) return;
				throw new Error(lastInstallFailure(paths, logged?.size ?? 0) ?? ended);
			} finally {
				installing = void 0;
			}
		})();
		return installing;
	};
	const viaRouter = (client) => routerChannel({
		env,
		socket: paths.daemonSock,
		startRouter: async () => {
			const command = cliCommand(paths, env);
			if (command === void 0) throw new Error("not installed");
			await ensureDaemon(paths, command);
		}
	})(client);
	await runAdapter(async (client) => {
		if (installed()) return viaRouter(client);
		if (snapshot === void 0) {
			await install().catch((err) => {
				throw new Error(`could not install: ${err instanceof Error ? err.message : String(err)}`);
			});
			return viaRouter(client);
		}
		return snapshotChannel(snapshot, client, {
			install,
			connect: () => viaRouter(client),
			progressMs
		});
	});
}
/**
* Install the runtime of the configured channel unless `bin/cdsn` runs, which install.sh and the launcher check
* too; a `current` left without that link is linked again. With `core`, from what install.sh left: the
* signed manifest it fetched (`<core>.json`), the core tarball it checked against it (`<core>.tar.gz`) and unpacked.
*/
async function ensureInstalled(paths, env = process.env, log = (line) => logInstall(paths, line), core) {
	if (existsSync(join(paths.bin, cdsnFile()))) return void 0;
	const installed = currentVersion(paths);
	if (installed !== void 0 && existsSync(join(paths.version(installed), "bin", cdsnFile()))) {
		activate(paths, installed);
		return;
	}
	const state = readUpdateState(paths);
	const requested = env.IMGLY_CODESIGN_CHANNEL;
	const channel = requested !== void 0 && CHANNELS.includes(requested) ? requested : state.channel;
	log(`installing the ${channel} channel`);
	const manifest = await fetchManifest(channel, {
		env,
		...core !== void 0 && { fetch: async () => new Response(readFileSync(`${core}.json`)) }
	});
	assertAcceptable(paths, manifest);
	const version = await installRelease({
		home: paths.home,
		manifest,
		onProgress: log,
		...core !== void 0 && adoptCore(manifest, core)
	});
	recordAccepted(paths, manifest);
	writeUpdateState(paths, {
		...readUpdateState(paths),
		channel,
		lastCheck: Date.now()
	});
	return version;
}
/**
* Install the runtime an app bundles: `dir` holds `latest-<channel>.json` as published and each artifact by its url's
* basename. A seed is no network answer, so it skips the replay floor; `current` moves only to a newer version on the
* channel the home follows, or into a home that has none.
*/
async function ensureSeed(paths, opts) {
	const { dir, channel, env = process.env, log = () => void 0 } = opts;
	if (!existsSync(paths.updateJson)) writeUpdateState(paths, { channel });
	const manifest = await fetchManifest(channel, {
		env,
		fetch: async () => new Response(readFileSync(join(dir, `latest-${channel}.json`)))
	});
	const installed = currentVersion(paths);
	const activated = installed === void 0 || compareVersions(installed, manifest.runtime) < 0 && readUpdateState(paths).channel === channel;
	log(`installing CoDesign ${manifest.runtime} from the seed`);
	const version = await installRelease({
		home: paths.home,
		manifest,
		activate: activated,
		onProgress: log,
		fetch: async (input) => {
			const name = basename(new URL(String(input)).pathname);
			const file = join(dir, name);
			if (!existsSync(file)) throw new InstallError("download", `the seed has no ${name}`);
			return new Response(Readable.toWeb(createReadStream(file)));
		}
	});
	if (activated && await socketAnswers(paths.daemonSock)) await askDaemon(paths, "handoff").catch((err) => log(`handoff failed: ${err instanceof Error ? err.message : String(err)}`));
	return {
		version,
		activated
	};
}
const SEED_CHANNELS = ["stable", "next"];
/** Install the core install.sh unpacked: its platform, and its tarball served from disk, checked again by the install. */
function adoptCore(manifest, core) {
	const { platform } = JSON.parse(readFileSync(join(core, "manifest.json"), "utf8"));
	const url = manifest.cores[platform]?.url;
	return {
		platform,
		fetch: async (input, init) => String(input) === url ? new Response(Readable.toWeb(createReadStream(`${core}.tar.gz`))) : globalThis.fetch(input, init)
	};
}
function logInstall(paths, line) {
	mkdirSync(paths.logs, {
		recursive: true,
		mode: 448
	});
	appendFileSync(paths.installLog, `${(/* @__PURE__ */ new Date()).toISOString()} ${line}\n`);
}
/** The last `install failed:` reason the log gained after byte `from`. */
function lastInstallFailure(paths, from) {
	let added;
	try {
		added = readFileSync(paths.installLog).subarray(from).toString("utf8");
	} catch {
		return;
	}
	return added.split("\n").map((line) => /install failed: (.*)$/.exec(line)?.[1]).filter((reason) => reason !== void 0).at(-1);
}
/** `bootstrap ensure` (or `check`) in a detached process that writes to logs/install.log. */
function spawnInstaller(paths, env, verb = "ensure") {
	mkdirSync(paths.logs, {
		recursive: true,
		mode: 448
	});
	const log = openSync(paths.installLog, "a");
	try {
		const child = spawn(process.execPath, [
			fileURLToPath(import.meta.url),
			"bootstrap",
			verb
		], {
			detached: true,
			stdio: [
				"ignore",
				log,
				log
			],
			env
		});
		child.unref();
		return child;
	} finally {
		closeSync(log);
	}
}
async function runBootstrap(args, env = process.env) {
	const paths = runtimePaths(runtimeHome(env));
	if (args[0] === "check") {
		await runCheck(paths, env);
		return;
	}
	if (args[0] !== "ensure") throw new Error("usage: codesign-shim.mjs bootstrap ensure [--core <dir> | --seed <dir> --channel <stable|next>] | check");
	const seedAt = args.indexOf("--seed");
	if (seedAt !== -1) {
		const channelAt = args.indexOf("--channel");
		await runSeed(paths, env, args[seedAt + 1], channelAt === -1 ? void 0 : args[channelAt + 1]);
		return;
	}
	const at = args.indexOf("--core");
	const core = at === -1 ? void 0 : args[at + 1];
	const toLog = sameFile(process.stderr.fd, paths.installLog);
	const say = (line) => {
		logInstall(paths, line);
		if (!toLog) process.stderr.write(`${line}\n`);
	};
	let version;
	try {
		version = await ensureInstalled(paths, env, say, core);
	} catch (err) {
		logInstall(paths, `install failed: ${err instanceof Error ? err.message : String(err)}`);
		if (!toLog) throw err;
		process.exitCode = 1;
		return;
	}
	if (version === void 0 && core === void 0 && checkDue(paths)) spawnInstaller(paths, env, "check");
	if (version !== void 0 && await socketAnswers(paths.daemonSock)) await askDaemon(paths, "handoff").catch((err) => logInstall(paths, `handoff failed: ${err instanceof Error ? err.message : String(err)}`));
	say(version === void 0 ? "CoDesign is installed" : `installed CoDesign ${version}`);
}
/** `bootstrap ensure --seed`: `seed <version>` on stdout, or `install failed: <reason>` in the log and on stderr and exit 1. */
async function runSeed(paths, env, dir, channel) {
	try {
		const seedChannel = SEED_CHANNELS.find((c) => c === channel);
		if (dir === void 0 || seedChannel === void 0) throw new Error("usage: codesign-shim.mjs bootstrap ensure --seed <dir> --channel <stable|next>");
		const { version } = await ensureSeed(paths, {
			dir,
			channel: seedChannel,
			env,
			log: (line) => logInstall(paths, line)
		});
		process.stdout.write(`seed ${version}\n`);
	} catch (err) {
		const line = `install failed: ${err instanceof Error ? err.message : String(err)}`;
		logInstall(paths, line);
		process.stderr.write(`${line}\n`);
		process.exitCode = 1;
	}
}
/** Update when a check is due; a daemon that serves does it itself, so it hands off to the new version. */
async function runCheck(paths, env) {
	try {
		await checkWhenDue(paths, async () => {
			logInstall(paths, "checking for updates");
			const result = await socketAnswers(paths.daemonSock) ? await askDaemon(paths, "update.apply") : await createUpdater(paths.home, { env }).apply();
			logInstall(paths, `update check: ${JSON.stringify(result)}`);
		});
	} catch (err) {
		logInstall(paths, `update check failed: ${err instanceof Error ? err.message : String(err)}`);
		process.exitCode = 1;
	}
}
async function askDaemon(paths, method) {
	const peer = new Peer(await connectUnix(paths.daemonSock), {
		role: "client",
		remote: "router"
	});
	try {
		await peer.request("hello", {
			role: "client",
			range: PROTOCOL_RANGE,
			client: { kind: "cli" },
			pid: process.pid
		});
		return await peer.request(method, {});
	} finally {
		peer.close();
	}
}
function sameFile(fd, path) {
	const open = fstatSync(fd);
	const named = statSync(path, { throwIfNoEntry: false });
	return named !== void 0 && open.dev === named.dev && open.ino === named.ino;
}
/** What to tell a host that starts the shim on a Node older than 18 (Node 14 and older cannot even parse it). */
function nodeTooOld(version) {
	if (Number(version.split(".")[0]) >= 18) return void 0;
	return `CoDesign needs Node 18 or newer, this is Node ${version}. Install Node from https://nodejs.org, or see https://codesign.co/install`;
}
if (process.argv[1] !== void 0 && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])) {
	const [command, ...rest] = process.argv.slice(2);
	const tooOld = nodeTooOld(process.versions.node);
	if (tooOld !== void 0) {
		process.stderr.write(`${tooOld}\n`);
		process.exit(1);
	}
	(command === "mcp" ? runMcp() : command === "bootstrap" ? runBootstrap(rest) : Promise.reject(/* @__PURE__ */ new Error("usage: codesign-shim.mjs mcp | bootstrap ensure [--core <dir> | --seed <dir> --channel <stable|next>] | bootstrap check"))).catch((err) => {
		process.stderr.write(`codesign: ${err instanceof Error ? err.message : String(err)}\n`);
		process.exit(1);
	});
}

//#endregion
export { cliCommand, ensureDaemon, ensureInstalled, ensureSeed, nodeTooOld, progressEveryMs, runBootstrap, runMcp };