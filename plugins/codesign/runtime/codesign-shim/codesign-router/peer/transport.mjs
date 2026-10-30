import { MAX_LINE_BYTES, ProtocolError } from "./ndjson.mjs";

//#region ../codesign-router/dist/peer/transport.js
/** Splits a byte stream into lines; a chunk may end mid-line or mid-character. */
var LineSplitter = class {
	#pending = [];
	#size = 0;
	constructor(max = MAX_LINE_BYTES) {
		this.max = max;
	}
	push(chunk) {
		const out = [];
		let start = 0;
		for (let at = chunk.indexOf(10); at !== -1; at = chunk.indexOf(10, start)) {
			this.#pending.push(chunk.subarray(start, at));
			const line = Buffer.concat(this.#pending).toString("utf8");
			this.#pending = [];
			this.#size = 0;
			start = at + 1;
			if (line.trim() !== "") out.push(line);
		}
		if (start < chunk.length) {
			this.#size += chunk.length - start;
			if (this.#size > this.max) throw new ProtocolError("protocol", `a line is longer than ${this.max} bytes`);
			this.#pending.push(chunk.subarray(start));
		}
		return out;
	}
};
/** A transport over a byte stream pair: a socket (both ends one object), or stdin and stdout. */
function streamTransport(input, output, end = () => output.end()) {
	const duplex = input === output;
	const splitter = new LineSplitter();
	const messageListeners = [];
	const closeListeners = [];
	let closed = false;
	const finish = (reason) => {
		if (closed) return;
		closed = true;
		for (const listener of closeListeners.splice(0)) listener(reason);
	};
	input.on("data", (chunk) => {
		let lines;
		try {
			lines = splitter.push(chunk);
		} catch (err) {
			finish(err instanceof Error ? err : new Error(String(err)));
			input.destroy();
			if (!duplex) output.destroy();
			return;
		}
		for (const line of lines) for (const listener of messageListeners) listener(line);
	});
	input.on("error", finish);
	input.on("close", () => finish());
	if (!duplex) output.on("error", finish);
	return {
		send(line) {
			if (!closed) output.write(line);
		},
		get bufferedBytes() {
			return output.writableLength;
		},
		onMessage: (listener) => void messageListeners.push(listener),
		onDrain: (listener) => void output.on("drain", listener),
		onClose(listener) {
			if (closed) listener();
			else closeListeners.push(listener);
		},
		pause: () => void input.pause(),
		resume: () => void input.resume(),
		close: end
	};
}

//#endregion
export { streamTransport };