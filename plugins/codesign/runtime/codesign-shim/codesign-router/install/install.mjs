import { linkedVersion, runtimePaths } from "../paths.mjs";
import { withFileLock } from "../lock.mjs";
import { ENGINE_PACKAGES, chooseEnginePacks, linkEntry, linkSharedAssets } from "./engine-packs.mjs";
import { logRollback, probeVersion } from "./rollback.mjs";
import { compareVersions, isVersion } from "./version.mjs";
import { warmUp } from "./warmup.mjs";
import { spawn } from "node:child_process";
import { chmodSync, closeSync, createWriteStream, existsSync, fstatSync, linkSync, mkdirSync, openSync, readFileSync, readdirSync, readlinkSync, renameSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { Readable, Transform } from "node:stream";
import { createHash, createPublicKey, randomUUID, verify } from "node:crypto";
import { arch, platform } from "node:os";
import { pipeline } from "node:stream/promises";

//#region ../codesign-router/dist/install/install.js
/** IMG.LY's runtime release keys (Ed25519, SPKI PEM); a manifest names its key by `keyIdOf`. Rotation adds the next one. */
const RUNTIME_PUBLIC_KEYS = [`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA4Qzv3qvo38atQuxFLt/5JG7+cLxse4SvH7ja3rco1Xs=
-----END PUBLIC KEY-----
`];
/** A key's id: the first 16 hex chars of sha256 over its SPKI DER. `scripts/pack-runtime.mjs` computes the same. */
function keyIdOf(publicKey) {
	const der = createPublicKey(publicKey).export({
		type: "spki",
		format: "der"
	});
	return createHash("sha256").update(der).digest("hex").slice(0, 16);
}
const CHANNELS = [
	"stable",
	"next",
	"canary"
];
/** Their own file: update.json has writers that read, wait on the network and write back, unlocked. */
const outcomesFile = (paths) => join(paths.home, "install-outcomes.json");
const outcomesLock = (paths) => `${outcomesFile(paths)}.lock`;
function readOutcomes(paths) {
	try {
		const list = JSON.parse(readFileSync(outcomesFile(paths), "utf8"));
		return Array.isArray(list) ? list : [];
	} catch {
		return [];
	}
}
async function noteOutcome(paths, outcome) {
	await withFileLock(outcomesLock(paths), async () => {
		writeAtomic(outcomesFile(paths), JSON.stringify([...readOutcomes(paths), outcome].slice(-20)));
	}, { name: "install-outcomes.json" }).catch(() => void 0);
}
var InstallError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "InstallError";
	}
};
function currentPlatform() {
	return `${platform()}-${arch()}`;
}
/** Where a channel's releases are; `IMGLY_CODESIGN_RELEASES` moves it only in a build that is not a release. */
function releaseBase(channel, env = process.env, releaseBuild = true) {
	return (releaseBuild ? void 0 : env.IMGLY_CODESIGN_RELEASES)?.replace(/\/$/, "") ?? `https://get.codesign.co/runtime/${channel}`;
}
/** Check the signature with the key the manifest names, and that it is a manifest of `channel`. */
function verifyManifest(signed, publicKeys, channel) {
	let manifest;
	try {
		manifest = JSON.parse(signed.manifest);
	} catch {
		throw new InstallError("manifest", "the release manifest is not JSON");
	}
	if (typeof manifest !== "object" || manifest === null || typeof signed.signature !== "string") throw new InstallError("manifest", "the release manifest is malformed");
	const publicKey = publicKeys.find((key) => keyIdOf(key) === manifest.keyId);
	if (publicKey === void 0) throw new InstallError("signature", `the release manifest is signed with key ${String(manifest.keyId)}, which this CoDesign does not know; update the CoDesign plugin`);
	if (!verify(null, Buffer.from(signed.manifest, "utf8"), createPublicKey(publicKey), Buffer.from(signed.signature, "base64"))) throw new InstallError("signature", "the release manifest is not signed by IMG.LY");
	if (typeof manifest.runtime !== "string" || !isVersion(manifest.runtime) || !areArtifacts(manifest.cores) || !areArtifacts(manifest.enginePacks) || manifest.assetPacks !== void 0 && !areArtifacts(manifest.assetPacks) || typeof manifest.issuedAt !== "string" || Number.isNaN(Date.parse(manifest.issuedAt))) throw new InstallError("manifest", "the release manifest is malformed");
	if (manifest.channel !== channel) throw new InstallError("replay", `the release server answered for the ${channel} channel with the ${String(manifest.channel)} channel's manifest; try again later`);
	return manifest;
}
/** Every entry names where to fetch it, its sha256 and its size: the size caps the download. */
function areArtifacts(entries) {
	return typeof entries === "object" && entries !== null && Object.values(entries).every((a) => typeof a?.url === "string" && typeof a.sha256 === "string" && /^[0-9a-f]{64}$/.test(a.sha256) && typeof a.size === "number" && Number.isSafeInteger(a.size) && a.size > 0);
}
/** Refuse a manifest older than the last accepted on its channel, or below `current` unless the user switched to it. */
function assertAcceptable(paths, manifest) {
	const state = readUpdateState(paths);
	if (state.bad?.includes(manifest.runtime)) throw new InstallError("rolled-back", `CoDesign ${manifest.runtime} did not start here and was rolled back; waiting for a newer release`);
	const last = state.accepted?.[manifest.channel];
	if (last !== void 0 && Date.parse(manifest.issuedAt) < Date.parse(last)) throw new InstallError("replay", `the release server offered a ${manifest.channel} manifest issued ${manifest.issuedAt}, older than the one installed (${last}); try again later`);
	const current = currentVersion(paths);
	if (current !== void 0 && isVersion(current) && state.downgrade !== manifest.channel && compareVersions(manifest.runtime, current) < 0) throw new InstallError("downgrade", `the ${manifest.channel} channel offers ${manifest.runtime}, older than the installed ${current}; keeping ${current}`);
}
/** After an install from `manifest`: remember its issue time and consume a channel switch's downgrade allowance. */
function recordAccepted(paths, manifest) {
	const { downgrade, ...state } = readUpdateState(paths);
	writeUpdateState(paths, {
		...state,
		...downgrade !== void 0 && downgrade !== manifest.channel ? { downgrade } : {},
		accepted: {
			...state.accepted,
			[manifest.channel]: manifest.issuedAt
		}
	});
}
async function fetchManifest(channel, opts = {}) {
	const env = opts.env ?? process.env;
	const releaseBuild = opts.releaseBuild ?? true;
	const url = `${releaseBase(channel, env, releaseBuild)}/latest-${channel}.json`;
	const response = await (opts.fetch ?? globalThis.fetch)(url).catch((err) => {
		throw new InstallError("download", `${url}: ${err instanceof Error ? err.message : String(err)}`);
	});
	if (!response.ok) throw new InstallError("download", `${url}: HTTP ${response.status}`);
	return verifyManifest(await response.json().catch(() => ({})), opts.publicKeys ?? (!releaseBuild && env.IMGLY_CODESIGN_PUBLIC_KEY !== void 0 ? [env.IMGLY_CODESIGN_PUBLIC_KEY] : RUNTIME_PUBLIC_KEYS), channel);
}
function readUpdateState(paths) {
	try {
		return JSON.parse(readFileSync(paths.updateJson, "utf8"));
	} catch {
		return { channel: "stable" };
	}
}
function writeUpdateState(paths, state) {
	writeAtomic(paths.updateJson, JSON.stringify(state, null, 2));
}
/** The version `current` points at, if any. */
function currentVersion(paths, platform = process.platform) {
	return linkedVersion(paths.current, platform);
}
/** A home an older CoDesign made keeps its 0755; the install makes one this user owns 0700 like a new home. Best effort: doctor reports a home it could not tighten. */
function tightenHome(home) {
	if (process.platform === "win32") return;
	try {
		const { mode, uid } = statSync(home);
		if ((mode & 63) !== 0 && uid === process.getuid?.()) chmodSync(home, 448);
	} catch {}
}
/** Install the manifest's runtime, its assets pack and one engine pack (each once), then point `current` at it, warm it and probe it. Returns the version. */
async function installRelease(opts) {
	const paths = runtimePaths(opts.home);
	const target = opts.platform ?? currentPlatform();
	const core = opts.manifest.cores[target];
	if (core === void 0) throw new InstallError("platform", `runtime ${opts.manifest.runtime} has no build for ${target}`);
	mkdirSync(paths.versions, {
		recursive: true,
		mode: 448
	});
	mkdirSync(paths.engines, {
		recursive: true,
		mode: 448
	});
	tightenHome(paths.home);
	const progress = opts.onProgress ?? (() => void 0);
	/** Download a pack (`what`, for progress) into `dir` unless it is there; `prepare` sees it staged. Records a new one in `added`. */
	const installPack = async (dir, artifact, what, added, prepare) => {
		if (existsSync(dir)) return;
		progress(`downloading ${what} (${megabytes(artifact)})`);
		const unpacked = await unpackArtifact(artifact, paths.engines, progress, opts.fetch, `unpacking ${what}`);
		try {
			prepare?.(unpacked);
			renameSync(unpacked, dir);
		} catch (err) {
			rmSync(unpacked, {
				recursive: true,
				force: true
			});
			throw err;
		}
		added.push(dir);
	};
	const version = await withInstallLock(paths, async () => {
		const before = currentVersion(paths);
		const noted = opts.activate !== false;
		try {
			const installed = await installLocked();
			if (noted && before !== installed) await noteOutcome(paths, {
				...before !== void 0 ? { from: before } : {},
				to: installed,
				outcome: before === void 0 ? "installed" : "updated",
				at: Date.now()
			});
			return installed;
		} catch (err) {
			const kind = err instanceof InstallError ? err.kind : "other";
			if (noted) await noteOutcome(paths, {
				...before !== void 0 ? { from: before } : {},
				to: opts.manifest.runtime,
				outcome: kind === "rolled-back" ? "rolled-back" : "failed",
				error: kind,
				at: Date.now()
			});
			throw err;
		}
	});
	async function installLocked() {
		const engineBefore = readUpdateState(paths).engine;
		const versionDir = paths.version(opts.manifest.runtime);
		if (!existsSync(join(versionDir, "manifest.json"))) {
			progress(`downloading CoDesign ${opts.manifest.runtime} (${megabytes(core)})`);
			const staged = await unpackArtifact(core, paths.versions, progress, opts.fetch, `unpacking CoDesign ${opts.manifest.runtime}`);
			try {
				const coreManifest = JSON.parse(readFileSync(join(staged, "manifest.json"), "utf8"));
				if (coreManifest.runtime !== opts.manifest.runtime) throw new InstallError("manifest", `the core is ${coreManifest.runtime}, the release ${opts.manifest.runtime}`);
				const choice = chooseEnginePacks({
					manifest: opts.manifest,
					enginePack: coreManifest.enginePack,
					platform: target,
					prefer: opts.prefer ?? preferredEngine()
				});
				const assetsDir = paths.engine(choice.assets);
				const packDir = paths.engine(choice.engine);
				const added = [];
				try {
					await installPack(assetsDir, opts.manifest.assetPacks[choice.assets], `the CE.SDK assets ${choice.assets}`, added);
					await installPack(packDir, opts.manifest.enginePacks[choice.engine], `the CE.SDK engine ${choice.engine}`, added, (staged) => linkSharedAssets(staged, packDir, choice.kind, assetsDir));
				} catch (err) {
					for (const dir of added) rmSync(dir, {
						recursive: true,
						force: true
					});
					throw err;
				}
				linkEnginePack(staged, versionDir, packDir, choice.kind);
				renameSync(staged, versionDir);
				writeUpdateState(paths, {
					...readUpdateState(paths),
					engine: {
						kind: choice.kind,
						...choice.missing !== void 0 ? { missing: choice.missing } : {}
					}
				});
			} catch (err) {
				rmSync(staged, {
					recursive: true,
					force: true
				});
				throw err;
			}
		}
		const version = opts.manifest.runtime;
		if (opts.activate !== false) {
			const before = currentVersion(paths);
			progress(`activating CoDesign ${version}`);
			activate(paths, version);
			await warmUp(paths.version(version), paths.installLog);
			if (before !== version) {
				progress(`checking that CoDesign ${version} starts`);
				await checkActivated(paths, version, before, engineBefore, opts.probeTimeoutMs);
			}
		}
		return version;
	}
	progress(`CoDesign ${version} is installed`);
	return version;
}
function megabytes(artifact) {
	return artifact.size < 1e6 ? `${Math.max(1, Math.round(artifact.size / 1e3))} KB` : `${(artifact.size / 1e6).toFixed(0)} MB`;
}
function preferredEngine() {
	const env = process.env.IMGLY_CESDK_ENGINE;
	return env === "native" || env === "wasm" ? env : "auto";
}
/** The core finds its engine in its own node_modules: relative links into the shared engine pack, one per package. */
function linkEnginePack(staged, versionDir, packDir, kind, platform = process.platform) {
	const scope = dirname(ENGINE_PACKAGES[kind]);
	const packScope = join(packDir, "node_modules", scope);
	const finalScope = join(versionDir, "app", "node_modules", scope);
	mkdirSync(join(staged, "app", "node_modules", scope), { recursive: true });
	for (const name of readdirSync(packScope)) {
		const link = join(staged, "app", "node_modules", scope, name);
		rmSync(link, {
			recursive: true,
			force: true
		});
		const target = join(packScope, name);
		linkEntry(target, link, relative(finalScope, target), platform);
	}
}
/** Roll back to `previous` when the activated `version` fails its probe; with no `previous`, keep it and record why. */
async function checkActivated(paths, version, previous, previousEngine, timeoutMs) {
	const why = await probeVersion(paths, version, timeoutMs);
	if (why === void 0) return;
	const state = readUpdateState(paths);
	const lastRollback = {
		version,
		why,
		at: Date.now()
	};
	if (previous === void 0) {
		writeUpdateState(paths, {
			...state,
			lastRollback: {
				...lastRollback,
				reason: "probe-failed-no-previous"
			}
		});
		logRollback(paths, `CoDesign ${version} did not start (${why}); no version to go back to, keeping it`);
		return;
	}
	pointAt(paths.current, previous);
	writeUpdateState(paths, {
		...state,
		engine: previousEngine,
		bad: [...(state.bad ?? []).filter((v) => v !== version), version],
		lastRollback: {
			...lastRollback,
			previous,
			reason: "rolled-back"
		}
	});
	logRollback(paths, `CoDesign ${version} did not start (${why}); back to ${previous}`);
	throw new InstallError("rolled-back", `CoDesign ${version} did not start (${why}), so ${previous} stays; see ${paths.installLog}`);
}
/** Point a `runtime/` link at `versions/<version>`, atomically; on Windows the link is a file naming the version (linkedVersion). */
function pointAt(link, version, platform = process.platform) {
	if (platform === "win32") {
		writeAtomic(link, version);
		return;
	}
	const staged = `${link}.${process.pid}.new`;
	rmSync(staged, { force: true });
	symlinkSync(join("versions", version), staged);
	renameSync(staged, link);
}
/** The command on PATH on Windows, which has no symlink to follow: the Node and app of the version `current` names. */
const CDSN_CMD = "@echo off\r\nsetlocal\r\nset /p v=<\"%~dp0..\\runtime\\current\"\r\n\"%~dp0..\\runtime\\versions\\%v%\\node\\node.exe\" \"%~dp0..\\runtime\\versions\\%v%\\app\\dist\\runtime\\cli\\main.js\" %*\r\n";
/** Point `current` (and the command on PATH) at an installed version, atomically; `previous` keeps the one it left. */
function activate(paths, version, platform = process.platform) {
	const left = currentVersion(paths, platform);
	if (left !== void 0 && left !== version) pointAt(paths.previous, left, platform);
	pointAt(paths.current, version, platform);
	mkdirSync(paths.bin, { recursive: true });
	if (platform === "win32") {
		const cmd = join(paths.bin, "cdsn.cmd");
		if (!existsSync(cmd) || readFileSync(cmd, "utf8") !== CDSN_CMD) writeAtomic(cmd, CDSN_CMD);
		return;
	}
	const bin = join(paths.bin, "cdsn");
	const target = join("..", "runtime", "current", "bin", "cdsn");
	let linked;
	try {
		linked = readlinkSync(bin);
	} catch {
		linked = void 0;
	}
	if (linked !== target) {
		const tmp = `${bin}.${process.pid}.new`;
		rmSync(tmp, { force: true });
		symlinkSync(target, tmp);
		renameSync(tmp, bin);
	}
}
/** Download, check and unpack into a fresh temporary directory under `parent`; returns it. Nothing is left on failure. */
async function unpackArtifact(artifact, parent, progress, fetchImpl = globalThis.fetch, unpacking) {
	const dir = join(parent, `.staging-${process.pid}-${Math.random().toString(36).slice(2, 8)}`);
	const archive = `${dir}.tar.gz`;
	try {
		const sum = await downloadWithRetry(artifact, archive, progress, fetchImpl);
		if (sum !== artifact.sha256) throw new InstallError("checksum", `${artifact.url}: sha256 ${sum}, expected ${artifact.sha256}`);
		if (unpacking !== void 0) progress(unpacking);
		mkdirSync(dir, { recursive: true });
		await untar(archive, dir);
		return dir;
	} catch (err) {
		rmSync(dir, {
			recursive: true,
			force: true
		});
		throw err;
	} finally {
		rmSync(archive, { force: true });
	}
}
/** A pause before the one retry of a download that failed on the network. */
const RETRY_PAUSE_MS = 1e3;
/** Stream `artifact` into `file`, once more after a network error (never after an HTTP status or a wrong size); returns its sha256. */
async function downloadWithRetry(artifact, file, progress, fetchImpl) {
	const { url } = artifact;
	for (let attempt = 1;; attempt++) try {
		return await download(artifact, file, fetchImpl);
	} catch (err) {
		if (err instanceof InstallError) throw err;
		const reason = err instanceof Error ? err.message : String(err);
		if (attempt > 1) throw new InstallError("download", `${url}: ${reason}`);
		progress(`retrying ${url} after: ${reason}`);
		await new Promise((resolve) => setTimeout(resolve, RETRY_PAUSE_MS));
	}
}
/** Never more than the `size` the signed manifest names reaches `file`. */
async function download({ url, size }, file, fetchImpl) {
	const abort = new AbortController();
	const response = await fetchImpl(url, { signal: abort.signal });
	if (!response.ok || response.body === null) throw new InstallError("download", `${url}: HTTP ${response.status}`);
	const hash = createHash("sha256");
	let received = 0;
	let oversize;
	try {
		await pipeline(Readable.fromWeb(response.body), new Transform({ transform(chunk, _encoding, done) {
			received += chunk.length;
			if (received > size) {
				oversize = new InstallError("download", `${url}: the server sent more than the ${size} bytes the release names`);
				abort.abort();
				return done(oversize);
			}
			hash.update(chunk);
			done(null, chunk);
		} }), createWriteStream(file));
	} catch (err) {
		throw oversize ?? err;
	}
	if (received < size) throw new InstallError("download", `${url}: the server sent ${received} bytes, fewer than the ${size} the release names`);
	return hash.digest("hex");
}
function untar(archive, dir) {
	return new Promise((resolve, reject) => {
		const tar = spawn("tar", [
			"-xzf",
			archive,
			"-C",
			dir
		], { stdio: [
			"ignore",
			"ignore",
			"pipe"
		] });
		let stderr = "";
		tar.stderr.on("data", (d) => stderr += d.toString());
		tar.once("error", (err) => reject(new InstallError("unpack", `tar failed: ${err.message}`)));
		tar.once("close", (status) => {
			if (status === 0) resolve();
			else reject(new InstallError("unpack", `tar failed: ${stderr || status}`));
		});
	});
}
/** How long an installer waits for another one before it gives up. */
const LOCK_WAIT_MS = 36e5;
/** One installer at a time per home; a lock whose process is gone is taken over. */
async function withInstallLock(paths, fn, { waitMs = LOCK_WAIT_MS } = {}) {
	const until = Date.now() + waitMs;
	for (;;) {
		const holder = tryInstallLock(paths);
		if (holder === void 0) break;
		if (Date.now() > until) throw new InstallError("locked", `another install (${holder > 0 ? `pid ${holder}` : "an unknown process"}) holds ${paths.installLock}; delete it if no install runs`);
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	try {
		return await fn();
	} finally {
		rmSync(paths.installLock, { force: true });
	}
}
/** Take install.lock now: undefined once taken, else the holder's pid (0 when it cannot be read). */
function tryInstallLock(paths) {
	const lock = paths.installLock;
	mkdirSync(dirname(lock), {
		recursive: true,
		mode: 448
	});
	for (let attempt = 0; attempt < 3; attempt++) {
		const tmp = `${lock}.${process.pid}.${randomUUID()}`;
		writeFileSync(tmp, String(process.pid));
		try {
			linkSync(tmp, lock);
			return;
		} catch (err) {
			if (err.code !== "EEXIST") throw err;
		} finally {
			rmSync(tmp, { force: true });
		}
		const held = readLock(lock);
		if (held === void 0) continue;
		if (held.pid > 0 && !alive(held.pid)) {
			if (statSync(lock, { throwIfNoEntry: false })?.ino === held.ino) rmSync(lock, { force: true });
			continue;
		}
		return held.pid;
	}
	return readLock(lock)?.pid ?? 0;
}
function readLock(lock) {
	let fd;
	try {
		fd = openSync(lock, "r");
	} catch (err) {
		if (err.code === "ENOENT") return void 0;
		throw err;
	}
	try {
		const pid = Number(readFileSync(fd, "utf8").trim());
		return {
			pid: Number.isInteger(pid) && pid > 0 ? pid : 0,
			ino: fstatSync(fd).ino
		};
	} finally {
		closeSync(fd);
	}
}
/** True while a process with `pid` runs (EPERM: it runs as another user). */
function alive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		return err.code === "EPERM";
	}
}
/** Delete versions that are neither `current`, `previous` nor in `inUse`, and the engine and assets packs neither a kept version nor `inUse` names. */
function collect(paths, inUse) {
	if (!existsSync(paths.versions)) return [];
	if (tryInstallLock(paths) !== void 0) return [];
	try {
		return collectLocked(paths, inUse);
	} finally {
		rmSync(paths.installLock, { force: true });
	}
}
let afterCollect;
/** A collect step run last under the same install.lock (agent packs); it returns what it removed. */
function onCollect(hook) {
	afterCollect = hook;
}
function collectLocked(paths, inUse) {
	const removed = [];
	const current = currentVersion(paths);
	const previous = linkedVersion(paths.previous);
	const kept = [];
	for (const v of readdirSync(paths.versions)) {
		const dir = paths.version(v);
		if (v.startsWith(".staging-")) {
			rmSync(dir, {
				recursive: true,
				force: true
			});
			continue;
		}
		if (v === current || v === previous || inUse.has(v)) {
			try {
				kept.push(JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")));
			} catch {}
			continue;
		}
		rmSync(dir, {
			recursive: true,
			force: true
		});
		removed.push(`versions/${v}`);
	}
	if (existsSync(paths.engines)) {
		const needed = new Set(kept.flatMap((m) => [
			`${m.enginePack}-${m.platform}`,
			`${m.enginePack}-wasm`,
			`assets-${m.enginePack}`
		]));
		for (const pack of readdirSync(paths.engines)) {
			if (needed.has(pack) || inUse.has(pack)) continue;
			rmSync(paths.engine(pack), {
				recursive: true,
				force: true
			});
			removed.push(`engines/${pack}`);
		}
	}
	if (afterCollect !== void 0) removed.push(...afterCollect(paths, inUse));
	return removed;
}
function writeAtomic(file, text) {
	mkdirSync(dirname(file), { recursive: true });
	const tmp = `${file}.${process.pid}.tmp`;
	writeFileSync(tmp, text);
	renameSync(tmp, file);
}

//#endregion
export { CHANNELS, InstallError, RUNTIME_PUBLIC_KEYS, activate, alive, assertAcceptable, collect, currentPlatform, currentVersion, fetchManifest, installRelease, keyIdOf, linkEnginePack, onCollect, readUpdateState, recordAccepted, releaseBase, unpackArtifact, verifyManifest, withInstallLock, writeUpdateState };