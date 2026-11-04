import { dirname, join, resolve } from "node:path";
import { hostname } from "node:os";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";

//#region ../codesign-router/dist/lock.js
const RETRY_MS = 100;
const MAX_TIMER_MS = 2 ** 31 - 1;
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
/** A lock not provably on this host is gone once its heartbeat stopped this long (W4). */
const UNSEEN_HOLDER_MS = 18e5;
/** Who in this process last took each lock file (by absolute path, as `waiting`). */
const holders = /* @__PURE__ */ new Map();
/**
* This process's waiters for each lock file (by absolute path), one at a time: two that both judged a dead holder's
* lock abandoned would each remove it, the second the lock the first had just taken, and both would hold it (R37).
* Waiters in other processes can still race so, on a lock a crash left: a known limit.
*/
const waiting = /* @__PURE__ */ new Map();
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
/** Whether a holder's note puts it on this host: a JSON note naming another host does not; any other note does. */
function onThisHost(note) {
	const host = parseNote(note)?.host;
	return host === void 0 || host === hostname();
}
async function withFileLock(lockFile, fn, options = {}) {
	const release = await acquireFileLock(lockFile, options);
	try {
		return await fn();
	} finally {
		await release();
	}
}
/** Takes the lock and answers how to let it go: only a lock that still names this taker is removed, so twice is once. */
async function acquireFileLock(lockFile, { maxWaitMs = MAX_WAIT_MS, name = "auth", staleAfterMs = Infinity, note, refuse, pid = process.pid, home, create = true }) {
	const start = Date.now();
	const key = resolve(lockFile);
	const ahead = waiting.get(key);
	const before = ahead ?? Promise.resolve();
	let done;
	const turn = before.then(() => new Promise((r) => done = r));
	waiting.set(key, turn);
	const ended = () => void before.then(() => {
		done();
		if (waiting.get(key) === turn) waiting.delete(key);
	});
	let timedOut = false;
	if (ahead !== void 0) {
		let timer;
		timedOut = maxWaitMs <= 0 || await Promise.race([ahead.then(() => false), new Promise((r) => {
			if (maxWaitMs <= MAX_TIMER_MS) timer = setTimeout(() => r(true), maxWaitMs);
		})]);
		clearTimeout(timer);
	}
	if (timedOut) {
		ended();
		throw new Error(`${name} lock timeout: ${lockFile}`);
	}
	try {
		return await takeFileLock(lockFile, Math.max(0, maxWaitMs - (Date.now() - start)), {
			name,
			staleAfterMs,
			note,
			refuse,
			pid,
			home,
			create
		});
	} finally {
		ended();
	}
}
/** acquireFileLock in its turn: this process's waiters before it for `lockFile` have taken it or given up. */
async function takeFileLock(lockFile, maxWaitMs, { name, staleAfterMs, note, refuse, pid, home, create }) {
	if (create) await mkdir(dirname(lockFile), { recursive: true });
	const deadline = Date.now() + maxWaitMs;
	const myPid = note === void 0 ? String(pid) : `${pid}\n${note}`;
	let lastReadError;
	const ours = Symbol(lockFile);
	const readLock = async () => {
		try {
			const content = (await readFile(lockFile, "utf8")).trim();
			lastReadError = void 0;
			return content;
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
	const timeout = () => {
		const detail = lastReadError !== void 0 ? ` (last lock read error: ${lastReadError instanceof Error ? lastReadError.message : String(lastReadError)})` : "";
		return /* @__PURE__ */ new Error(`${name} lock timeout: ${lockFile}${detail}`);
	};
	let slept = false;
	for (;;) {
		if (slept && Date.now() > deadline) throw timeout();
		try {
			await writeFile(lockFile, myPid, { flag: "wx" });
		} catch (err) {
			const code = err.code;
			if (code === "ENOENT" && !create) throw new Error(`${dirname(lockFile)} is not there: it was moved or removed, so its lock cannot be taken.`);
			if (code !== "EEXIST") throw err;
			const holderContent = await readLock();
			const [holderPid, ...holderNote] = (holderContent ?? "").split("\n");
			const holder = holderContent !== null && PID.test(holderPid) ? Number(holderPid) : NaN;
			const theirNote = holderNote.join("\n") || void 0;
			const here = onThisHost(theirNote) || home !== void 0 && parseNote(theirNote)?.home === home && pidAlive(holder);
			const abandoned = async () => here ? !pidAlive(holder) || await lockAgeMs() > staleAfterMs : await lockAgeMs() > UNSEEN_HOLDER_MS;
			if (holder > 0 && await abandoned()) {
				const recheck = await readLock();
				if (recheck !== null && recheck === holderContent && await abandoned()) await rm(lockFile, { force: true });
				continue;
			}
			if (holderContent !== null && !(holder > 0) && await lockAgeMs() > NO_PID_GRACE_MS) {
				if (await readLock() === holderContent && await lockAgeMs() > NO_PID_GRACE_MS) await rm(lockFile, { force: true });
				continue;
			}
			if (holder > 0) {
				const refused = refuse?.(holderNote.length > 0 ? holderNote.join("\n") : void 0);
				if (refused !== void 0) throw refused;
			}
			if (Date.now() >= deadline) throw timeout();
			await new Promise((r) => setTimeout(r, RETRY_MS));
			slept = true;
			continue;
		}
		holders.set(resolve(lockFile), ours);
		if (await readLock() !== myPid) continue;
		break;
	}
	return async () => {
		if (await readLock() === myPid && holders.get(resolve(lockFile)) === ours) {
			holders.delete(resolve(lockFile));
			await rm(lockFile, { force: true });
		}
	};
}
function parseNote(note) {
	if (note === void 0 || !note.startsWith("{")) return void 0;
	try {
		const value = JSON.parse(note);
		if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
		const { host, home, runtime, format, since, role } = value;
		return {
			...typeof host === "string" ? { host } : {},
			...typeof home === "string" ? { home } : {},
			...typeof runtime === "string" ? { runtime } : {},
			...typeof format === "number" ? { format } : {},
			...typeof since === "number" ? { since } : {},
			...role === "router" || role === "unit" ? { role } : {}
		};
	} catch {
		return;
	}
}

//#endregion
export { withFileLock };