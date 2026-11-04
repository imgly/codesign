import { connect } from "node:net";

//#region ../codesign-router/dist/peer/ndjson.js
/** A line longer than this ends the connection: a design file inlined as base64 fits, a runaway stream does not. */
const MAX_LINE_BYTES = 268435456;
/** An error a request handler throws to answer with this `kind`; any other error answers `internal`. */
var ProtocolError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "ProtocolError";
	}
};
/** Does something answer on this socket? */
function socketAnswers(path) {
	return new Promise((resolve) => {
		const probe = connect(path);
		probe.once("connect", () => {
			probe.destroy();
			resolve(true);
		});
		probe.once("error", () => resolve(false));
	});
}

//#endregion
export { MAX_LINE_BYTES, ProtocolError, socketAnswers };