import { InstallError, currentPlatform, currentVersion, fetchManifest, onCollect, readUpdateState, unpackArtifact, withInstallLock } from "./install.mjs";
import { AGENTS, agentPins, npmInstallArgs, packVersion, patchStagedPack, stagedPackProblem } from "./agent-sources.mjs";
import { execFile } from "node:child_process";
import { accessSync, constants, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

//#region ../codesign-router/dist/install/agent-packs.js
const PACK_RECORD = ".pack.json";
function agentPackDir(paths, pack, platform) {
	return join(paths.agents.packs, `${pack}-${platform}`);
}
function readPackRecord(dir) {
	try {
		return JSON.parse(readFileSync(join(dir, PACK_RECORD), "utf8"));
	} catch {
		return;
	}
}
function coreManifest(paths, version) {
	try {
		return JSON.parse(readFileSync(join(paths.version(version), "manifest.json"), "utf8"));
	} catch {
		return;
	}
}
/** The pack `version`'s core pins for agent `name`, `claude-0.93.0`; in a non-release build without that core, the checkout's pin. */
function pinnedAgentPack(paths, name, version = currentVersion(paths), releaseBuild = true) {
	const manifest = version === void 0 ? void 0 : coreManifest(paths, version);
	if (manifest !== void 0) return manifest.agents?.[name];
	return releaseBuild ? void 0 : agentPins()[name];
}
function isArtifact(a) {
	return typeof a.url === "string" && typeof a.sha256 === "string" && /^[0-9a-f]{64}$/.test(a.sha256) && typeof a.size === "number" && Number.isSafeInteger(a.size) && a.size > 0;
}
/** Install the pack the core pins for agent `name`, once; returns its directory. */
async function installAgentPack(paths, name, onProgress, opts = {}) {
	const platform = opts.platform ?? currentPlatform();
	const version = opts.version ?? currentVersion(paths);
	const releaseBuild = opts.releaseBuild ?? true;
	const pin = pinnedAgentPack(paths, name, version, releaseBuild);
	if (pin === void 0) throw new InstallError("manifest", `CoDesign ${version ?? "(not installed)"} pins no ${name} agent`);
	const dir = agentPackDir(paths, pin, platform);
	if (readPackRecord(dir) !== void 0) return dir;
	if (!releaseBuild && (version === void 0 || coreManifest(paths, version) === void 0)) {
		const source = AGENTS.find((a) => a.name === name);
		if (source !== void 0) return installFromNpm(paths, source, platform, dir, onProgress, opts.npm);
	}
	const channel = readUpdateState(paths).channel;
	const manifest = opts.manifest ?? await fetchManifest(channel, opts.fetch ? { fetch: opts.fetch } : {});
	const artifact = manifest.agentPacks?.find((p) => `${p.name}-${p.version}` === pin && p.platform === platform);
	if (artifact === void 0) throw new InstallError("manifest", `the ${manifest.channel} release has no agent pack ${pin} for ${platform}; run cdsn update`);
	if (!isArtifact(artifact)) throw new InstallError("manifest", `the release's agent pack ${pin} is malformed`);
	return withInstallLock(paths, async () => {
		if (readPackRecord(dir) !== void 0) return dir;
		mkdirSync(paths.agents.packs, {
			recursive: true,
			mode: 448
		});
		onProgress(`downloading the ${name} agent ${artifact.version} (${(artifact.size / 1e6).toFixed(0)} MB)`);
		const staged = await unpackArtifact(artifact, paths.agents.packs, onProgress, opts.fetch);
		rmSync(dir, {
			recursive: true,
			force: true
		});
		renameSync(staged, dir);
		const record = {
			name: artifact.name,
			version: artifact.version,
			platform,
			sha256: artifact.sha256,
			size: artifact.size
		};
		writeFileSync(join(dir, PACK_RECORD), JSON.stringify(record));
		onProgress(`the ${name} agent ${artifact.version} is installed`);
		return dir;
	});
}
/** The command that runs npm: this Node with the npm-cli.js beside it, else beside the npm on PATH (a link to it, or
*  a wrapper like mise's), else that npm itself by its name there (a shim); Windows runs no npm.cmd without a shell. */
function findNpm(execPath = process.execPath, path = process.env.PATH ?? "", platform = process.platform) {
	const windows = platform === "win32";
	const beside = (bin) => {
		const cli = windows ? join(bin, "node_modules", "npm", "bin", "npm-cli.js") : join(bin, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js");
		return existsSync(cli) ? [execPath, cli] : void 0;
	};
	const found = beside(dirname(execPath));
	if (found !== void 0) return found;
	for (const dir of path.split(windows ? ";" : ":").filter(Boolean)) {
		if (windows) {
			if (existsSync(join(dir, "npm.cmd")) && beside(dir)) return beside(dir);
			if (existsSync(join(dir, "npm.exe"))) return [join(dir, "npm.exe")];
			continue;
		}
		const npm = join(dir, "npm");
		if (!isFile(npm)) continue;
		const real = realpathSync(npm);
		if (real.endsWith("npm-cli.js")) return [execPath, real];
		const cli = beside(dirname(real));
		if (cli !== void 0) return cli;
		if (isFile(npm, constants.X_OK)) return [npm];
	}
}
function isFile(path, mode = constants.F_OK) {
	try {
		accessSync(path, mode);
		return statSync(path).isFile();
	} catch {
		return false;
	}
}
/** A non-release build's pack: the pinned adapter and its CLI from npm, as pack-runtime.mjs builds a release's. */
function installFromNpm(paths, source, platform, dir, onProgress, npm = findNpm()) {
	return withInstallLock(paths, async () => {
		if (readPackRecord(dir) !== void 0) return dir;
		if (npm === void 0) throw new InstallError("download", `no npm to install the ${source.name} agent with: none beside ${process.execPath} or on PATH. Install Node.js, or wait for a CoDesign release.`);
		mkdirSync(paths.agents.packs, {
			recursive: true,
			mode: 448
		});
		const stage = join(paths.agents.packs, `.staging-${process.pid}-${Math.random().toString(36).slice(2, 8)}`);
		mkdirSync(stage);
		try {
			onProgress(`installing the ${source.name} agent ${packVersion(source)} from npm (a development build)`);
			writeFileSync(join(stage, "package.json"), "{\"private\":true}");
			await new Promise((resolve, reject) => execFile(npm[0], [...npm.slice(1), ...npmInstallArgs(source, platform)], {
				cwd: stage,
				maxBuffer: 16777216
			}, (err, _stdout, stderr) => err ? reject(new InstallError("download", `npm could not install the ${source.name} agent: ${stderr.trim() || err.message}`)) : resolve()));
			const problem = stagedPackProblem(source, platform, stage);
			if (problem !== void 0) throw new InstallError("manifest", problem);
			try {
				patchStagedPack(source, stage);
			} catch (err) {
				throw new InstallError("manifest", err.message);
			}
			rmSync(join(stage, "package.json"));
			rmSync(dir, {
				recursive: true,
				force: true
			});
			renameSync(stage, dir);
		} finally {
			rmSync(stage, {
				recursive: true,
				force: true
			});
		}
		const record = {
			name: source.name,
			version: packVersion(source),
			platform,
			source: "npm"
		};
		writeFileSync(join(dir, PACK_RECORD), JSON.stringify(record));
		onProgress(`the ${source.name} agent ${packVersion(source)} is installed`);
		return dir;
	});
}
/** The agents whose pack an update to `version` installs: those with an older pack installed, not the new pin. */
function agentPacksToUpdate(paths, version, platform = currentPlatform()) {
	const pins = coreManifest(paths, version)?.agents ?? {};
	let installed;
	try {
		installed = readdirSync(paths.agents.packs).filter((d) => d.endsWith(`-${platform}`) && readPackRecord(join(paths.agents.packs, d)) !== void 0);
	} catch {
		installed = [];
	}
	return Object.entries(pins).filter(([name, pin]) => !installed.includes(`${pin}-${platform}`) && installed.some((d) => d.startsWith(`${name}-`))).map(([name]) => name);
}
/** Delete the packs neither `inUse` nor a remaining core names, and orphaned staging; under install.lock. */
function collectAgentPacks(paths, inUse) {
	if (!existsSync(paths.agents.packs)) return [];
	const needed = /* @__PURE__ */ new Set();
	for (const v of readdirSync(paths.versions)) {
		const m = coreManifest(paths, v);
		if (m === void 0) continue;
		for (const pin of Object.values(m.agents ?? {})) needed.add(`${pin}-${m.platform}`);
	}
	const removed = [];
	for (const pack of readdirSync(paths.agents.packs)) {
		if (needed.has(pack) || inUse.has(pack)) continue;
		rmSync(join(paths.agents.packs, pack), {
			recursive: true,
			force: true
		});
		removed.push(`agents/packs/${pack}`);
	}
	return removed;
}
onCollect(collectAgentPacks);

//#endregion
export { PACK_RECORD, agentPackDir, agentPacksToUpdate, collectAgentPacks, findNpm, installAgentPack, pinnedAgentPack, readPackRecord };