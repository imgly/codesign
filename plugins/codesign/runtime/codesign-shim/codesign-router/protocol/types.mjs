//#region ../codesign-router/dist/protocol/types.js
/** Admin methods are answered only for `client`; `design.claim` / `design.release` only for `unit`. */
const ROLE_ONLY = {
	status: "client",
	"units.list": "client",
	"update.check": "client",
	"update.apply": "client",
	"update.channel": "client",
	handoff: "client",
	shutdown: "client",
	"workspaces.list": "client",
	"design.claim": "unit",
	"design.release": "unit",
	"chat.activate": "client"
};
function sessionEndedNotice(design) {
	return `The design session ended unexpectedly, so the last call may not have completed. This connection now works in a new, empty session: ${design !== void 0 ? `open ${design} again and preview it` : "preview it"} before you continue.`;
}

//#endregion
export { ROLE_ONLY, sessionEndedNotice };