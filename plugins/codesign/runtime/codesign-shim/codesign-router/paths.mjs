import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { homedir } from "node:os";

//#region ../codesign-router/dist/paths.js
function runtimeHome(env = process.env) {
	return env.IMGLY_CODESIGN_HOME?.trim() || join(homedir(), ".codesign");
}
/**
* The version `runtime/current` or `runtime/previous` names: a symlink into versions/, or on Windows a file holding
* the version, since a process under RedirectionGuard (sshd's children, some terminals) cannot follow a user's junction.
*/
function linkedVersion(link, platform = process.platform) {
	try {
		if (platform !== "win32") return basename(realpathSync(link));
		const version = readFileSync(link, "utf8").trim();
		return version !== "" && existsSync(join(dirname(link), "versions", version)) ? version : void 0;
	} catch {
		return;
	}
}
/** sun_path, less its NUL: Node truncates a longer socket path, so two of them can name one socket. */
const socketPathMax = (platform) => platform === "darwin" ? 103 : 107;
/** Room after a socket path for the `.<pid>` a staged server.sock takes (router/main.ts). */
const STAGED_SUFFIX = 8;
/** Where a home's sockets go when one is too long for sun_path: a private /tmp/cdsn-<hash>, the same for every caller. */
function socketDir(home) {
	return `/tmp/cdsn-${createHash("sha256").update(home).digest("hex").slice(0, 12)}`;
}
/** A socket at `file` in the home, or `name` in socketDir(home) when `file` would not fit sun_path; on Windows a named
* pipe, which leaves no file there. Decided per socket: a unit's is longer than the home's own server.sock. */
function homeSocket(home, platform, file, name) {
	if (platform === "win32") return `\\\\.\\pipe\\cdsn-${createHash("sha256").update(home).digest("hex").slice(0, 16)}${name === void 0 ? "" : `-${name}`}`;
	if (Buffer.byteLength(file) + STAGED_SUFFIX <= socketPathMax(platform)) return file;
	return `${socketDir(home)}/${name ?? "server"}.sock`;
}
/** A unit's socket name: its id, or `unit-_<hash>` (no id starts with `_`) for an id too long for macOS's sun_path in socketDir. */
function unitSocketName(id) {
	return id.length <= 62 ? `unit-${id}` : `unit-_${createHash("sha256").update(id).digest("hex").slice(0, 16)}`;
}
function runtimePaths(home, platform = process.platform) {
	const sessions = join(home, "units");
	const runtime = join(home, "runtime");
	const agents = join(home, "agents");
	const conversations = join(home, "conversations");
	return {
		home,
		daemonSock: homeSocket(home, platform, join(home, "server.sock")),
		probeSock: (pid) => homeSocket(home, platform, join(home, `probe-${pid}.sock`), `probe-${pid}`),
		daemonJson: join(home, "server.json"),
		daemonLock: join(home, "server.lock"),
		daemonLog: join(home, "logs", "server.log"),
		logs: join(home, "logs"),
		sessions,
		session: (id) => {
			const dir = join(sessions, id);
			return {
				dir,
				sock: homeSocket(home, platform, join(dir, "unit.sock"), unitSocketName(id)),
				executorSock: join(dir, "executor.sock"),
				json: join(dir, "unit.json"),
				log: join(dir, "unit.log"),
				config: join(dir, "config.json")
			};
		},
		runtime,
		versions: join(runtime, "versions"),
		version: (v) => join(runtime, "versions", v),
		current: join(runtime, "current"),
		previous: join(runtime, "previous"),
		leases: join(runtime, "leases"),
		engines: join(home, "engines"),
		engine: (pack) => join(home, "engines", pack),
		engineAssets: (cesdkVersion) => join(home, "engines", `assets-cesdk-${cesdkVersion}`),
		agents: {
			claude: join(agents, "claude"),
			codex: join(agents, "codex"),
			packs: join(agents, "packs")
		},
		conversations,
		conversation: (id) => join(conversations, id),
		updateJson: join(home, "update.json"),
		installLock: join(home, "install.lock"),
		installLog: join(home, "logs", "install.log"),
		bin: join(home, "bin"),
		workspace: join(home, "workspace"),
		workspacesJson: join(home, "workspaces.json"),
		mcpJson: join(home, "mcp.json"),
		credentials: join(home, ".credentials.json"),
		authJson: join(home, "auth.json"),
		redemptions: join(home, "redemptions.json"),
		id: join(home, "id"),
		engineSlots: join(home, "engine-slots"),
		styles: join(home, "styles")
	};
}

//#endregion
export { linkedVersion, runtimeHome, runtimePaths, socketDir };