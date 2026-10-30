import { spawn } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

//#region ../codesign-router/dist/units/lifecycle.js
/** `cdsn` of the version in `dir` on Windows: its Node and its app, as its bin\\cdsn.cmd runs them. */
function versionCommand(dir) {
	return {
		command: join(dir, "node", "node.exe"),
		args: [join(dir, "app", "dist", "runtime", "cli", "main.js")]
	};
}

//#endregion
export { versionCommand };