import { versionCommand } from "../units/lifecycle.mjs";
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

//#region ../codesign-router/dist/install/rollback.js
const PROBE_TIMEOUT_MS = 6e4;
/** Run installed `version`'s probe; undefined when it passed, else why it did not. */
function probeVersion(paths, version, timeoutMs = PROBE_TIMEOUT_MS, platform = process.platform) {
	const windows = platform === "win32";
	const { command, args } = windows ? versionCommand(paths.version(version)) : {
		command: join(paths.version(version), "bin", "cdsn"),
		args: []
	};
	return new Promise((resolve) => {
		const child = spawn(command, [
			...args,
			"server",
			"probe"
		], {
			detached: !windows,
			windowsHide: true,
			stdio: [
				"ignore",
				"ignore",
				"pipe"
			],
			env: {
				...process.env,
				IMGLY_CODESIGN_HOME: paths.home,
				IMGLY_CODESIGN_RUNTIME: version
			}
		});
		let stderr = "";
		child.stderr.on("data", (d) => stderr += d.toString());
		const timer = setTimeout(() => {
			killTree(child.pid, platform);
			resolve(`timed out after ${timeoutMs} ms`);
		}, timeoutMs);
		child.once("error", (err) => {
			clearTimeout(timer);
			resolve(err.message);
		});
		child.once("close", (code, signal) => {
			clearTimeout(timer);
			if (code === 0) return resolve(void 0);
			const tail = stderr.trim().split("\n").at(-1);
			resolve(`${code !== null ? `exited ${code}` : `killed by ${signal}`}${tail ? `: ${tail}` : ""}`);
		});
	});
}
/** Kill `pid` and every process under it: a probe that hangs must not leave its router or units behind, and each unit runs detached, in a process group of its own. */
function killTree(pid, platform = process.platform) {
	if (platform === "win32") {
		spawnSync("taskkill", [
			"/pid",
			String(pid),
			"/T",
			"/F"
		], { stdio: "ignore" });
		return;
	}
	const children = /* @__PURE__ */ new Map();
	const ps = spawnSync("ps", [
		"-A",
		"-o",
		"pid=,ppid="
	], { encoding: "utf8" });
	for (const line of (ps.stdout ?? "").split("\n")) {
		const [p, parent] = line.trim().split(/\s+/).map(Number);
		if (p && parent) children.set(parent, [...children.get(parent) ?? [], p]);
	}
	const tree = [pid];
	for (let i = 0; i < tree.length; i++) tree.push(...children.get(tree[i]) ?? []);
	for (const p of tree) for (const target of [-p, p]) try {
		process.kill(target, "SIGKILL");
	} catch {}
}
function logRollback(paths, line) {
	try {
		mkdirSync(dirname(paths.installLog), {
			recursive: true,
			mode: 448
		});
		appendFileSync(paths.installLog, `${(/* @__PURE__ */ new Date()).toISOString()} rollback: ${line}\n`);
	} catch {}
}

//#endregion
export { PROBE_TIMEOUT_MS, killTree, logRollback, probeVersion };