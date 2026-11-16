import { runtimeHome, runtimePaths } from "../paths.mjs";
import { ProtocolError, socketAnswers } from "../peer/ndjson.mjs";
import { PROTOCOL_RANGE } from "../protocol/version.mjs";
import { Peer } from "../peer/peer.mjs";
import { compareVersions } from "../install/version.mjs";
import { connectUnix } from "../peer/transports/unix.mjs";
import "../design-schemes.mjs";
import { clientConfigFromEnv } from "../config/unit-config.mjs";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

//#region ../codesign-router/dist/client/index.js
/** Run `server start --detach` and wait for the socket, beside the event loop; a failed start rejects with its stderr. */
async function startServer(socket, command, env, timeoutMs) {
	const [bin, ...args] = command;
	const child = spawn(bin, [
		...args,
		"server",
		"start",
		"--detach"
	], {
		windowsHide: true,
		env,
		stdio: [
			"ignore",
			"ignore",
			"pipe"
		]
	});
	let stderr = "";
	child.stderr?.on("data", (chunk) => stderr += chunk.toString());
	const exited = new Promise((resolve) => {
		child.once("close", (code) => resolve(code ?? "signal"));
		child.once("error", (err) => resolve(err.message));
	});
	const until = Date.now() + timeoutMs;
	let code;
	exited.then((c) => code = c);
	while (!await socketAnswers(socket)) {
		if (code !== void 0 && code !== 0 || Date.now() > until) {
			child.kill();
			throw new Error(`the CoDesign server did not start: ${stderr.trim() || code || `no answer within ${timeoutMs} ms`}`);
		}
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
}

//#endregion
export { startServer };