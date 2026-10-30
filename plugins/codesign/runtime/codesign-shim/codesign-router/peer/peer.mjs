import { ProtocolError } from "./ndjson.mjs";
import { ROLE_ONLY } from "../protocol/types.mjs";
import { PROTOCOL_RANGE, UPDATE_COMMAND, negotiate } from "../protocol/version.mjs";

//#region ../codesign-router/dist/peer/peer.js
const DEFAULT_TIMEOUT_MS = 3e4;
/** `null`: no timeout, the call's own deadline applies. */
const METHOD_TIMEOUTS = {
	"tools.call": null,
	"client.call": null,
	"permission.request": null,
	"agent.install": null,
	"draft.save": 3e4
};
/** Above this many unsent bytes a peer stops reading what makes it write more, until the buffer drains. */
const HIGH_WATER_BYTES = 8388608;
/**
* One end of a link. `Answers` is the method map this side answers, `Asks` the one the other side answers; `InEvents`
* and `OutEvents` the events each way.
*/
var Peer = class {
	#remote;
	#version;
	#range;
	#timeoutMs;
	#highWater;
	#forward;
	#next = 1;
	#pending = /* @__PURE__ */ new Map();
	#handlers = /* @__PURE__ */ new Map();
	#listeners = /* @__PURE__ */ new Map();
	#closeListeners = [];
	#closed = false;
	#holds = 0;
	#backlog = [];
	#writableWaiters = [];
	#selfHeld = false;
	constructor(transport, opts) {
		this.transport = transport;
		this.role = opts.role;
		this.#remote = opts.remote;
		this.#range = opts.range ?? PROTOCOL_RANGE;
		this.#timeoutMs = opts.timeoutMs ?? 3e4;
		this.#highWater = opts.highWaterBytes ?? 8388608;
		this.#forward = opts.forward;
		transport.onMessage((line) => {
			if (this.#holds > 0) this.#backlog.push(line);
			else this.#receive(line);
		});
		transport.onDrain(() => this.#drained());
		transport.onClose((reason) => this.#end(reason));
	}
	/** The negotiated version; undefined until `hello` was answered. */
	get version() {
		return this.#version;
	}
	get remote() {
		return this.#remote;
	}
	get closed() {
		return this.#closed;
	}
	get writable() {
		return this.transport.bufferedBytes <= this.#highWater;
	}
	/** Answers `method`. A `hello` handler runs after the version was negotiated, so it can read `version`. */
	handle(method, handler) {
		this.#handlers.set(method, handler);
	}
	on(event, listener) {
		const list = this.#listeners.get(event) ?? [];
		list.push(listener);
		this.#listeners.set(event, list);
	}
	onClose(listener) {
		if (this.#closed) listener();
		else this.#closeListeners.push(listener);
	}
	/** Rejects with kind `timeout` after the method's timeout (`METHOD_TIMEOUTS`, else the peer's); `null` waits. */
	request(method, params, opts = {}) {
		if (this.#closed) return Promise.reject(new ProtocolError("closed", `the connection closed before ${method}`));
		const timeoutMs = opts.timeoutMs !== void 0 ? opts.timeoutMs : method in METHOD_TIMEOUTS ? METHOD_TIMEOUTS[method] : this.#timeoutMs;
		const id = this.#next++;
		return new Promise((resolve, reject) => {
			const timer = timeoutMs === null ? void 0 : setTimeout(() => {
				this.#pending.delete(id);
				reject(new ProtocolError("timeout", `no answer to ${method} within ${timeoutMs} ms`));
			}, timeoutMs);
			this.#pending.set(id, {
				resolve: (v) => {
					clearTimeout(timer);
					if (method === "hello") {
						const error = this.#accept(v.protocol);
						if (error !== void 0) {
							reject(error);
							return;
						}
					}
					resolve(v);
				},
				reject: (e) => {
					clearTimeout(timer);
					reject(e);
				}
			});
			this.#write({
				id,
				method,
				params
			});
		});
	}
	/** False when the outgoing buffer is above the high-water mark: wait for `whenWritable` before the next. */
	notify(event, params) {
		if (this.#closed) return false;
		return this.#write({
			event,
			params
		});
	}
	sendLine(line) {
		if (this.#closed) return false;
		return this.#send(line);
	}
	whenWritable() {
		if (this.writable || this.#closed) return Promise.resolve();
		return new Promise((resolve) => this.#writableWaiters.push(resolve));
	}
	close() {
		this.transport.close();
	}
	#accept(version) {
		if (!Number.isInteger(version) || version < this.#range[0] || version > this.#range[1]) return new ProtocolError("protocol", `the other side chose protocol ${version}, outside ${this.#range[0]}–${this.#range[1]}: run \`${UPDATE_COMMAND}\``);
		this.#version = version;
	}
	#write(message) {
		return this.#send(`${JSON.stringify(message)}\n`);
	}
	#send(line) {
		this.transport.send(line);
		if (this.writable) return true;
		if (!this.#selfHeld) {
			this.#selfHeld = true;
			this.#hold();
		}
		return false;
	}
	#drained() {
		if (!this.writable) return;
		if (this.#selfHeld) {
			this.#selfHeld = false;
			this.#release();
		}
		for (const resolve of this.#writableWaiters.splice(0)) resolve();
	}
	#hold() {
		if (this.#holds++ === 0) this.transport.pause();
	}
	#release() {
		if (--this.#holds > 0) return;
		while (this.#holds === 0 && this.#backlog.length > 0) this.#receive(this.#backlog.shift());
		if (this.#holds === 0) this.transport.resume();
	}
	#receive(line) {
		let m;
		try {
			m = parseLine(line);
		} catch (err) {
			this.#end(err instanceof Error ? err : new Error(String(err)));
			this.transport.close();
			return;
		}
		if ("event" in m) {
			if (this.#version === void 0) return;
			const channel = m.params?.channel;
			const sink = typeof channel === "string" ? this.#forward?.(channel) : void 0;
			if (sink !== void 0) {
				if (!sink.sendLine(`${line}\n`)) {
					this.#hold();
					sink.whenWritable().then(() => this.#release());
				}
				return;
			}
			for (const listener of this.#listeners.get(m.event) ?? []) listener(m.params);
			return;
		}
		if ("method" in m) {
			this.#hold();
			setImmediate(() => this.#release());
			this.#answer(m.id, m.method, m.params);
			return;
		}
		const waiting = this.#pending.get(m.id);
		if (waiting === void 0) return;
		this.#pending.delete(m.id);
		if ("error" in m) waiting.reject(new ProtocolError(m.error.kind, m.error.message));
		else waiting.resolve(m.result);
	}
	async #answer(id, method, params) {
		try {
			this.#admit(method, params);
			const handler = this.#handlers.get(method);
			if (handler === void 0) throw new ProtocolError("unknown_method", `no method ${method}`);
			const result = await handler(params);
			if (!this.#closed) this.#write({
				id,
				result: result ?? {}
			});
		} catch (err) {
			if (this.#closed) return;
			this.#write({
				id,
				error: err instanceof ProtocolError ? {
					kind: err.kind,
					message: err.message
				} : {
					kind: "internal",
					message: err instanceof Error ? err.message : String(err)
				}
			});
		}
	}
	/** The `hello` gate and the role rules; throws the refusal. */
	#admit(method, params) {
		if (method === "hello") {
			const hello = params;
			const range = hello?.range;
			if (!Array.isArray(range) || range.length !== 2 || typeof hello?.role !== "string") throw new ProtocolError("protocol", `hello needs a role and a version range: run \`${UPDATE_COMMAND}\``);
			if (this.#remote !== void 0 && hello.role !== this.#remote) throw new ProtocolError("forbidden", `expected a ${this.#remote}, got a ${hello.role}`);
			const agreed = negotiate(this.#range, range);
			if (!agreed.ok) throw new ProtocolError("protocol", agreed.message);
			this.#version = agreed.version;
			this.#remote = hello.role;
			return;
		}
		if (this.#version === void 0) throw new ProtocolError("protocol", `say hello before ${method}`);
		const only = ROLE_ONLY[method];
		if (only !== void 0 && only !== this.#remote) throw new ProtocolError("forbidden", `${method} is only for a ${only}, not a ${this.#remote ?? "peer"}`);
	}
	#end(reason) {
		if (this.#closed) return;
		this.#closed = true;
		for (const { reject } of this.#pending.values()) reject(new ProtocolError("closed", reason ? `the connection failed: ${reason.message}` : "the connection closed"));
		this.#pending.clear();
		this.#backlog = [];
		for (const resolve of this.#writableWaiters.splice(0)) resolve();
		for (const listener of this.#closeListeners.splice(0)) listener(reason);
	}
};
function parseLine(line) {
	let value;
	try {
		value = JSON.parse(line);
	} catch {
		throw new ProtocolError("protocol", "a line is not JSON");
	}
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new ProtocolError("protocol", "a line is not a JSON object");
	const m = value;
	if (typeof m.event === "string") return m;
	if (typeof m.id === "number" && (typeof m.method === "string" || "result" in m || "error" in m)) return m;
	throw new ProtocolError("protocol", "a line is neither a request, an answer nor an event");
}

//#endregion
export { DEFAULT_TIMEOUT_MS, HIGH_WATER_BYTES, METHOD_TIMEOUTS, Peer };