import { socketAnswers } from "../peer/ndjson.mjs";
import { lockHeld } from "../lock.mjs";
import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync } from "node:fs";
import { createInterface } from "node:readline";

//#region ../codesign-router/dist/router/handoff.js
/** Past this age server.lock is stale, even mid-handover: a crashed holder's pid may go to another process. */
const HANDOFF_WAIT_MS = 3e5;
/** Whether the router answers once server.lock is free, its holder dead, or held longer than `maxAgeMs`. */
async function answersOnceStarted(paths, maxAgeMs = HANDOFF_WAIT_MS) {
	while (!await socketAnswers(paths.daemonSock)) {
		if (!await lockHeld(paths.daemonLock, maxAgeMs)) return false;
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
	return true;
}

//#endregion
export { answersOnceStarted };