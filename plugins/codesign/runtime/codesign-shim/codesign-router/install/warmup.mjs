import { execFile } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

//#region ../codesign-router/dist/install/warmup.js
const WARMUP_TIMEOUT_MS = 3e4;
/** Run the core's `node --version` and `bin/cdsn --version` once each, logging a failure to `log`. */
async function warmUp(core, log, { timeoutMs = WARMUP_TIMEOUT_MS } = {}) {
	if (process.platform === "win32") return;
	const node = join(core, "node", "bin", "node");
	if (existsSync(node)) await run(node, "node", log, timeoutMs);
	await run(join(core, "bin", "cdsn"), "cdsn", log, timeoutMs);
}
function run(file, name, log, timeoutMs) {
	return new Promise((resolve) => {
		execFile(file, ["--version"], {
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		}, (err, _stdout, stderr) => {
			if (err !== null) {
				const why = err.killed ? `timed out after ${timeoutMs} ms` : typeof err.code === "number" ? `exited ${err.code}` : err.message;
				const tail = stderr.trim().split("\n").at(-1);
				try {
					mkdirSync(dirname(log), {
						recursive: true,
						mode: 448
					});
					appendFileSync(log, `${(/* @__PURE__ */ new Date()).toISOString()} warm-up: ${name} --version ${why}${tail ? `: ${tail}` : ""}\n`);
				} catch {}
			}
			resolve();
		});
	});
}

//#endregion
export { warmUp };