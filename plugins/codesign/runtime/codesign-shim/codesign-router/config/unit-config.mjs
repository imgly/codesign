import { dirname } from "node:path";
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
/** The client's environment as a ClientConfig; the edges (adapter, CLI, app) call it once. Only what is set. */
function clientConfigFromEnv(env = process.env, releaseBuild = true) {
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
	if (gateway) config.gateway = { baseURL: gateway };
	const workspace = env.CODESIGN_WORKSPACE?.trim();
	if (workspace) config.workspacePath = workspace;
	return config;
}

//#endregion
export { clientConfigFromEnv };