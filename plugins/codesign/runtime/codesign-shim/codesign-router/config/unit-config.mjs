import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

//#region ../codesign-router/dist/config/unit-config.js
const ON = /* @__PURE__ */ new Set([
	"on",
	"true",
	"1"
]);
const OFF = /* @__PURE__ */ new Set([
	"off",
	"false",
	"0"
]);
function onOff(raw) {
	const v = raw?.trim().toLowerCase();
	if (!v) return void 0;
	if (ON.has(v)) return true;
	if (OFF.has(v)) return false;
}
function doNotTrack(env) {
	const v = env.DO_NOT_TRACK?.trim().toLowerCase() ?? "";
	return v !== "" && v !== "0" && v !== "false";
}
/** IMGLY_GATEWAY_API_KEY_FILE's contents when it is set (none when it cannot be read: the edge says why), else IMGLY_GATEWAY_API_KEY. */
function gatewayKey(env) {
	const file = env.IMGLY_GATEWAY_API_KEY_FILE?.trim();
	if (!file) return env.IMGLY_GATEWAY_API_KEY?.trim() || void 0;
	try {
		return readFileSync(file, "utf8").trim() || void 0;
	} catch {
		return;
	}
}
/** The client's environment as a ClientConfig; the edges (adapter, CLI, app) call it once. Only what is set. */
function clientConfigFromEnv(env = process.env, releaseBuild = true, cwd = process.cwd()) {
	const config = {};
	const licence = releaseBuild ? void 0 : env.CESDK_LICENSE?.trim() || env.IMGLY_CESDK_LICENSE?.trim();
	if (licence) config.licence = licence;
	if (onOff(env.IMGLY_DISABLE_VIEWER) === true) config.viewer = { enabled: false };
	const usage = doNotTrack(env) || onOff(env.IMGLY_PLUGIN_TELEMETRY) === false ? false : onOff(env.IMGLY_TELEMETRY);
	const errors = usage === false || onOff(env.IMGLY_PLUGIN_ERROR_REPORTING) === false ? false : onOff(env.IMGLY_ERROR_REPORTING);
	if (usage !== void 0 || errors !== void 0) config.telemetry = {
		...usage !== void 0 && { usage },
		...errors !== void 0 && { errors }
	};
	const prefer = env.IMGLY_CESDK_ENGINE?.trim();
	if (prefer === "native" || prefer === "wasm") config.engine = { prefer };
	const gateway = env.IMGLY_GATEWAY_BASE_URL?.trim();
	const apiKey = gatewayKey(env);
	if (gateway || apiKey) config.gateway = {
		...gateway && { baseURL: gateway },
		...apiKey && { apiKey }
	};
	const workspacePath = workspacePathFromEnv(env, cwd);
	if (workspacePath !== void 0) config.workspacePath = workspacePath;
	return config;
}
/** The workspace folder CODESIGN_WORKSPACE names, trimmed; none when it is unset or blank. */
function workspacePathFromEnv(env, cwd) {
	const workspace = env.CODESIGN_WORKSPACE?.trim();
	return workspace ? resolve(cwd, workspace) : void 0;
}

//#endregion
export { clientConfigFromEnv, workspacePathFromEnv };