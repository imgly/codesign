import { ProtocolError } from "../ndjson.mjs";
import { streamTransport } from "../transport.mjs";
import { existsSync, lstatSync, mkdirSync } from "node:fs";
import { basename, dirname } from "node:path";
import { connect } from "node:net";

//#region ../codesign-router/dist/peer/transports/unix.js
function socketTransport(socket) {
	return streamTransport(socket, socket);
}
/** Make `dir` (mode 0700) if it is missing, and refuse one that is a link, another user's, or open to others. */
function privateSocketDir(dir) {
	try {
		mkdirSync(dir, { mode: 448 });
	} catch (err) {
		if (err.code !== "EEXIST") throw err;
	}
	const stat = lstatSync(dir);
	if (!stat.isDirectory() || stat.uid !== process.getuid?.() || (stat.mode & 63) !== 0) throw new ProtocolError("unsafe_socket_dir", `${dir} is not a private directory of this user: remove it, or use a shorter IMGLY_CODESIGN_HOME`);
}
/** A long home's sockets are in /tmp/cdsn-<hash> (paths.ts socketDir). */
function isSocketDir(dir) {
	return dirname(dir) === "/tmp" && /^cdsn-[0-9a-f]{12}$/.test(basename(dir));
}
/** That directory anyone could have made first. */
function guardSocketDir(path) {
	if (isSocketDir(dirname(path))) privateSocketDir(dirname(path));
}
function connectUnix(path) {
	return new Promise((resolve, reject) => {
		guardSocketDir(path);
		const socket = connect(path);
		socket.once("connect", () => {
			socket.off("error", reject);
			resolve(socketTransport(socket));
		});
		socket.once("error", reject);
	});
}

//#endregion
export { connectUnix, privateSocketDir, socketTransport };