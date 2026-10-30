import { runtimePaths } from "../paths.mjs";
import { withFileLock } from "../lock.mjs";
import { InstallError, assertAcceptable, collect, currentVersion, fetchManifest, installRelease, readUpdateState, recordAccepted, writeUpdateState } from "./install.mjs";
import { versionsInUse } from "../units/leases.mjs";
import { agentPacksToUpdate, installAgentPack } from "./agent-packs.mjs";
import { join } from "node:path";

//#region ../codesign-router/dist/install/updater.js
/** How old update.json's `lastCheck` may get before a check is due. */
const CHECK_EVERY_MS = 216e5;
/** One check or install at a time per home: the router's scheduled ones and `cdsn update`. */
const CHECK_LOCK = "update-check.lock";
/** A check is due when the last one is older than `everyMs`, unless a package manager manages the install. */
function checkDue(paths, everyMs = CHECK_EVERY_MS, now = Date.now()) {
	const { managed, lastCheck } = readUpdateState(paths);
	return managed !== true && (lastCheck ?? 0) + everyMs <= now;
}
/** Run `run` if a check is due and no other process checks now; true when it ran. */
async function checkWhenDue(paths, run, everyMs = CHECK_EVERY_MS) {
	try {
		return await withFileLock(join(paths.home, CHECK_LOCK), async () => {
			if (!checkDue(paths, everyMs)) return false;
			await run();
			return true;
		}, {
			maxWaitMs: 0,
			name: "update check"
		});
	} catch (err) {
		if (err instanceof Error && err.message.startsWith("update check lock")) return false;
		throw err;
	}
}
function createUpdater(home, opts = {}) {
	const paths = runtimePaths(home);
	const env = opts.env ?? process.env;
	let found;
	const check = async () => {
		const state = readUpdateState(paths);
		const current = currentVersion(paths) ?? "none";
		if (state.managed === true) return {
			current,
			reason: "managed by a package manager: update it there"
		};
		const { lastCheckError: _, ...rest } = state;
		try {
			found = await fetchManifest(state.channel, {
				env,
				...opts.fetch ? { fetch: opts.fetch } : {}
			});
			assertAcceptable(paths, found);
		} catch (err) {
			const failed = {
				...rest,
				lastCheck: Date.now(),
				lastCheckError: err instanceof Error ? err.message : String(err)
			};
			writeUpdateState(paths, failed);
			throw err;
		}
		writeUpdateState(paths, {
			...rest,
			lastCheck: Date.now()
		});
		return {
			current,
			latest: found.runtime,
			...found.runtime === current ? { reason: "up to date" } : {}
		};
	};
	return {
		channel: () => readUpdateState(paths).channel,
		managed: () => readUpdateState(paths).managed === true,
		current: () => currentVersion(paths) ?? "none",
		check,
		async apply() {
			const checked = await check();
			if (found === void 0 || checked.reason !== void 0) return checked;
			if (readUpdateState(paths).managed === true) throw new InstallError("managed", "this install is managed by a package manager");
			const progress = opts.onProgress ?? (() => void 0);
			const installed = await installRelease({
				home,
				manifest: found,
				onProgress: progress,
				...opts.fetch ? { fetch: opts.fetch } : {}
			});
			recordAccepted(paths, found);
			for (const agent of agentPacksToUpdate(paths, installed)) try {
				await installAgentPack(paths, agent, progress, {
					manifest: found,
					version: installed,
					...opts.fetch ? { fetch: opts.fetch } : {}
				});
			} catch (err) {
				progress(`the ${agent} agent was not updated: ${err instanceof Error ? err.message : String(err)}`);
			}
			return {
				current: installed,
				latest: installed,
				removed: collect(paths, versionsInUse(home))
			};
		},
		async setChannel(channel) {
			const state = readUpdateState(paths);
			if (state.channel === channel) return;
			writeUpdateState(paths, {
				...state,
				channel,
				downgrade: channel
			});
		},
		schedule(run, everyMs = CHECK_EVERY_MS) {
			let timer;
			let stopped = false;
			const arm = (first) => {
				if (stopped) return;
				const left = (readUpdateState(paths).lastCheck ?? 0) + everyMs - Date.now();
				timer = setTimeout(() => {
					checkWhenDue(paths, run, everyMs).catch(() => false).finally(() => arm(false));
				}, left > 0 ? Math.min(left, everyMs) : first ? 0 : everyMs);
				timer.unref();
			};
			arm(true);
			return () => {
				stopped = true;
				clearTimeout(timer);
			};
		},
		collect() {
			if (currentVersion(paths) !== void 0) collect(paths, versionsInUse(home));
		}
	};
}

//#endregion
export { CHECK_EVERY_MS, CHECK_LOCK, checkDue, checkWhenDue, createUpdater };