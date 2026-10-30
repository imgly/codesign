import { dirname } from "node:path";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";

//#region ../codesign-router/dist/lock.js
const RETRY_MS = 100;
const MAX_WAIT_MS = 5e3;
/**
* How old a lockfile with no PID must be before it counts as abandoned. A live
* holder writes its PID in the same call that creates the file, so a PID-less
* file older than this is left over from a holder that died in between. Well
* under the default MAX_WAIT_MS (and any longer wait), so a waiter can still
* reap it and acquire in one wait.
*/
const NO_PID_GRACE_MS = 1e3;
const PID = /^\d+$/;
/** Who in this process last took each lock file. */
const holders = /* @__PURE__ */ new Map();
/**
* True if a process with `pid` is alive. `kill(pid, 0)` sends no signal; it
* only probes. ESRCH => no such process (dead). EPERM (exists, owned by
* another user) or any other failure => assume alive — never steal a lock
* we're not certain is abandoned.
*/
function pidAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		return err.code !== "ESRCH";
	}
}
async function withFileLock(lockFile, fn, { maxWaitMs = MAX_WAIT_MS, name = "auth", staleAfterMs = Infinity } = {}) {
	await mkdir(dirname(lockFile), { recursive: true });
	const deadline = Date.now() + maxWaitMs;
	const myPid = String(process.pid);
	let lastReadError;
	const ours = Symbol(lockFile);
	const readLock = async () => {
		try {
			return (await readFile(lockFile, "utf8")).trim();
		} catch (err) {
			lastReadError = err;
			return null;
		}
	};
	const lockAgeMs = async () => {
		try {
			return Date.now() - (await stat(lockFile)).mtimeMs;
		} catch {
			return 0;
		}
	};
	for (;;) {
		if (Date.now() > deadline) {
			const detail = lastReadError !== void 0 ? ` (last lock read error: ${lastReadError instanceof Error ? lastReadError.message : String(lastReadError)})` : "";
			throw new Error(`${name} lock timeout: ${lockFile}${detail}`);
		}
		try {
			await writeFile(lockFile, myPid, { flag: "wx" });
		} catch (err) {
			if (err.code !== "EEXIST") throw err;
			const holderContent = await readLock();
			const holder = holderContent !== null && PID.test(holderContent) ? Number(holderContent) : NaN;
			if (holder > 0 && (!pidAlive(holder) || await lockAgeMs() > staleAfterMs)) {
				const recheck = await readLock();
				if (recheck !== null && recheck === holderContent && (!pidAlive(holder) || await lockAgeMs() > staleAfterMs)) await rm(lockFile, { force: true });
				continue;
			}
			if (holderContent !== null && !(holder > 0) && await lockAgeMs() > NO_PID_GRACE_MS) {
				if (await readLock() === holderContent && await lockAgeMs() > NO_PID_GRACE_MS) await rm(lockFile, { force: true });
				continue;
			}
			await new Promise((r) => setTimeout(r, RETRY_MS));
			continue;
		}
		holders.set(lockFile, ours);
		if (await readLock() !== myPid) continue;
		break;
	}
	try {
		return await fn();
	} finally {
		if (await readLock() === myPid && holders.get(lockFile) === ours) {
			holders.delete(lockFile);
			await rm(lockFile, { force: true });
		}
	}
}

//#endregion
export { withFileLock };