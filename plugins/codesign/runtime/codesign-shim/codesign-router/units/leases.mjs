import { linkedVersion, runtimePaths } from "../paths.mjs";
import { alive, currentVersion } from "../install/install.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

//#region ../codesign-router/dist/units/leases.js
/** A start time `ps` reports to the second, so a reused pid is one that started this much later than its lease. */
const START_SLACK_MS = 2e3;
const leasesDir = (paths) => join(paths.runtime, "leases");
/** The leases of live processes; a stale one is removed. */
function liveLeases(paths) {
	const dir = leasesDir(paths);
	let names;
	try {
		names = readdirSync(dir).filter((n) => n.endsWith(".json"));
	} catch {
		return [];
	}
	const out = [];
	for (const name of names) {
		const file = join(dir, name);
		let lease;
		try {
			lease = JSON.parse(readFileSync(file, "utf8"));
		} catch {
			rmSync(file, { force: true });
			continue;
		}
		if (live(lease)) out.push(lease);
		else rmSync(file, { force: true });
	}
	return out;
}
function live(lease) {
	if (!alive(lease.pid)) return false;
	const started = processStart(lease.pid);
	return started === void 0 || started <= lease.startedAt + START_SLACK_MS;
}
function processStart(pid) {
	if (process.platform === "win32") return void 0;
	try {
		const out = execFileSync("ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...process.env,
				LC_ALL: "C"
			}
		});
		const at = Date.parse(out.trim());
		return Number.isNaN(at) ? void 0 : at;
	} catch {
		return;
	}
}
/** The versions and packs `collect` keeps: `current`, `previous`, every live lease's, and live units' from their unit.json. */
function versionsInUse(home) {
	const paths = runtimePaths(home);
	const out = /* @__PURE__ */ new Set();
	const current = currentVersion(paths);
	if (current !== void 0) out.add(current);
	const previous = linkedVersion(paths.previous);
	if (previous !== void 0) out.add(previous);
	for (const lease of liveLeases(paths)) {
		out.add(lease.version);
		for (const pack of lease.packs) out.add(pack);
	}
	for (const version of unitVersions(paths)) out.add(version);
	return out;
}
function unitVersions(paths) {
	let ids;
	try {
		ids = readdirSync(paths.sessions);
	} catch {
		return [];
	}
	const out = [];
	for (const id of ids) try {
		const record = JSON.parse(readFileSync(paths.session(id).json, "utf8"));
		if (alive(record.pid)) out.push(record.runtime);
	} catch {}
	return out;
}

//#endregion
export { liveLeases, versionsInUse };