//#region ../codesign-router/dist/protocol/version.js
const PROTOCOL_RANGE = [2, 2];
/** The command that brings the side that is behind up to date. */
const UPDATE_COMMAND = "cdsn update";
/** The highest version both ranges include, or why there is none. */
function negotiate(ours, theirs) {
	const version = Math.min(ours[1], theirs[1]);
	if (version >= Math.max(ours[0], theirs[0])) return {
		ok: true,
		version
	};
	return {
		ok: false,
		message: `no common protocol version (${ours[0]}–${ours[1]} here, ${theirs[0]}–${theirs[1]} there): run \`${UPDATE_COMMAND}\``
	};
}

//#endregion
export { PROTOCOL_RANGE, UPDATE_COMMAND, negotiate };