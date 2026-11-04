import { InstallError } from "./install.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, linkSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, symlinkSync } from "node:fs";
import { dirname, join, relative } from "node:path";

//#region ../codesign-router/dist/install/engine-packs.js
/** The package each kind of engine pack holds under its `node_modules/`. */
const ENGINE_PACKAGES = {
	native: "@cesdk/node-native",
	wasm: "@cesdk/node"
};
const systemLoader = () => ({
	platform: process.platform,
	arch: process.arch,
	env: process.env,
	ldconfig: () => {
		for (const bin of [
			"ldconfig",
			"/sbin/ldconfig",
			"/usr/sbin/ldconfig"
		]) try {
			return execFileSync(bin, ["-p"], {
				encoding: "utf8",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
		} catch {}
	},
	systemDirectories
});
/** The flag `ldconfig -p` gives this architecture's libraries, beside other ones' (`libc6` alone is i386). */
const LDCONFIG_ARCH = {
	x64: "x86-64",
	arm64: "AArch64"
};
/** The libraries `ldconfig -p` lists for `arch`. */
function cachedLibraries(output, arch) {
	const flag = LDCONFIG_ARCH[arch];
	const names = /* @__PURE__ */ new Set();
	for (const line of output.split("\n")) {
		const m = /^\s+(\S+) \(([^)]*)\)/.exec(line);
		if (m && (flag === void 0 || m[2].includes(flag))) names.add(m[1]);
	}
	return names;
}
/** The directories `/etc/ld.so.conf` and `/etc/ld.so.conf.d/*.conf` name. */
function confDirectories() {
	const read = (file) => {
		try {
			return readFileSync(file, "utf8").split("\n");
		} catch {
			return [];
		}
	};
	let included = [];
	try {
		included = readdirSync("/etc/ld.so.conf.d").filter((f) => f.endsWith(".conf")).map((f) => join("/etc/ld.so.conf.d", f));
	} catch {}
	return ["/etc/ld.so.conf", ...included].flatMap(read).map((line) => line.replace(/#.*/, "").trim()).filter((line) => line.startsWith("/"));
}
/** ld.so.conf's directories and the standard and multiarch ones. */
function systemDirectories() {
	const multiarch = ["x86_64-linux-gnu", "aarch64-linux-gnu"];
	return [
		...confDirectories(),
		...["/lib", "/usr/lib"].flatMap((d) => [
			d,
			`${d}64`,
			...multiarch.map((m) => join(d, m))
		]),
		"/usr/local/lib"
	];
}
/** Whether this machine can load a native engine pack: on Linux, every library in its `needs` must resolve. */
function canLoadNative(pack, loader = systemLoader()) {
	const needs = pack.needs ?? [];
	if (loader.platform !== "linux" || needs.length === 0) return { ok: true };
	const output = loader.ldconfig();
	const cached = output === void 0 ? /* @__PURE__ */ new Set() : cachedLibraries(output, loader.arch);
	const dirs = [...(loader.env.LD_LIBRARY_PATH ?? "").split(":").filter(Boolean), ...loader.systemDirectories()];
	const missing = needs.find((lib) => !cached.has(lib) && !dirs.some((d) => existsSync(join(d, lib))));
	return missing === void 0 ? { ok: true } : {
		ok: false,
		missing
	};
}
/** Native for the platform where it loads; WASM on linux-arm64, when asked for, or when native cannot load. */
function chooseEnginePacks(opts) {
	const { manifest, enginePack, platform, prefer = "auto" } = opts;
	const assets = `assets-${enginePack}`;
	if (manifest.assetPacks?.[assets] === void 0) throw new InstallError("manifest", `the release names no assets pack ${assets}`);
	const nativeName = `${enginePack}-${platform}`;
	const native = manifest.enginePacks[nativeName];
	let missing;
	if (prefer !== "wasm" && native !== void 0) {
		const probe = (opts.canLoadNative ?? canLoadNative)(native);
		if (probe.ok) return {
			kind: "native",
			engine: nativeName,
			assets
		};
		missing = probe.missing;
	}
	if (prefer === "native") throw new InstallError("platform", native === void 0 ? `the release has no native engine for ${platform}` : `the native engine cannot load here: ${missing ?? "unknown"} is missing`);
	const wasm = `${enginePack}-wasm`;
	if (manifest.enginePacks[wasm] === void 0) throw new InstallError("manifest", `the release names no engine pack ${wasm}`);
	return {
		kind: "wasm",
		engine: wasm,
		assets,
		...missing !== void 0 ? { missing } : {}
	};
}
/** Link every entry of the assets pack into the engine's own `assets/`, where the engine looks for its fonts and emoji. */
function linkSharedAssets(stagedPack, finalPack, kind, assetsDir) {
	const own = (pack) => join(pack, "node_modules", ENGINE_PACKAGES[kind], "assets");
	mkdirSync(own(stagedPack), { recursive: true });
	for (const name of readdirSync(assetsDir)) {
		const link = join(own(stagedPack), name);
		rmSync(link, {
			recursive: true,
			force: true
		});
		linkEntry(join(assetsDir, name), link, relative(own(finalPack), join(assetsDir, name)));
	}
}
/**
* Link `path` to `target`: a relative symlink, or on Windows hard links, file by file. There only an administrator
* makes symlinks, and a process under RedirectionGuard cannot follow a user's junction.
*/
function linkEntry(target, path, relativeTarget, platform = process.platform) {
	if (platform !== "win32") symlinkSync(relativeTarget, path);
	else if (statSync(target).isDirectory()) {
		mkdirSync(path);
		for (const name of readdirSync(target)) linkEntry(join(target, name), join(path, name), "", platform);
	} else linkSync(target, path);
}

//#endregion
export { ENGINE_PACKAGES, canLoadNative, chooseEnginePacks, linkEntry, linkSharedAssets };