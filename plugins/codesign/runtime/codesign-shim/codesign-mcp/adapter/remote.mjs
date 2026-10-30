import { ProtocolError } from "../../codesign-router/peer/ndjson.mjs";
import { connectUnix } from "../../codesign-router/peer/transports/unix.mjs";
import { sessionEndedNotice } from "../../codesign-router/protocol/types.mjs";
import { PROTOCOL_RANGE } from "../../codesign-router/protocol/version.mjs";
import { Peer } from "../../codesign-router/peer/peer.mjs";
import { randomUUID } from "node:crypto";

//#region src/adapter/remote.ts
/** A new channel may start a unit, which the router waits for up to two minutes. */
const CHANNEL_OPEN_MS = 18e4;
/** How often a call is resent to its unit after the router died under it. */
const RESENDS = 3;
const ROUTER_RESTARTED = "The CoDesign server restarted during this call. Call it again.";
/** Connects and opens the channel, so the first request needs no wait. */
async function connectRemote(opts) {
	let peer;
	let channel;
	/** The unit to rejoin after a handoff. */
	let unit;
	let runtime = "";
	/** Told to the model with the first tool result after its unit died. */
	let notice;
	let connecting;
	/** Calls in flight on each connection: an unexpected end of the unit fails them with the notice. */
	const inFlight = /* @__PURE__ */ new Map();
	const progress = /* @__PURE__ */ new Set();
	const toolsChanged = /* @__PURE__ */ new Set();
	const designChanged = /* @__PURE__ */ new Set();
	const tellToolsChanged = () => {
		for (const listener of toolsChanged) listener();
	};
	const open = (next, rejoin) => next.request("channel.open", {
		kind: "design",
		client: opts.client,
		config: opts.config,
		...opts.conversation !== void 0 ? { conversation: opts.conversation } : {},
		...opts.chatClientKind !== void 0 ? { chatClientKind: opts.chatClientKind } : {},
		...rejoin !== void 0 ? { session: rejoin } : opts.attach !== void 0 ? { attach: opts.attach } : {}
	}, { timeoutMs: CHANNEL_OPEN_MS });
	const connect = async () => {
		await opts.startRouter();
		const next = new Peer(await connectUnix(opts.socket), {
			role: "client",
			remote: "router"
		});
		let opened;
		try {
			await next.request("hello", {
				role: "client",
				range: PROTOCOL_RANGE,
				client: opts.client,
				pid: process.pid
			});
			try {
				opened = await open(next, unit);
			} catch (err) {
				if (unit === void 0) throw err;
				opened = await open(next);
				tellToolsChanged();
			}
		} catch (err) {
			next.close();
			throw err;
		}
		peer = next;
		channel = opened.channel;
		unit = opened.unit;
		runtime = opened.runtime;
		next.on("progress", ({ channel: of, ...p }) => {
			if (of !== channel) return;
			for (const listener of progress) listener(p);
		});
		next.on("design.changed", (p) => {
			for (const listener of designChanged) listener(p);
		});
		next.on("tools.changed", tellToolsChanged);
		next.on("channel.moved", (p) => {
			if (p.channel !== channel) return;
			unit = p.unit;
			runtime = p.runtime;
		});
		next.on("server.handoff", () => {
			if (peer === next) peer = void 0;
			retire(next);
		});
		next.on("channel.closed", (p) => {
			if (p.channel !== channel) return;
			channel = void 0;
			if (p.unexpected !== true) return;
			unit = void 0;
			notice = sessionEndedNotice(p.design);
			for (const fail of inFlight.get(next) ?? []) fail(new Error(notice));
			inFlight.delete(next);
		});
		next.onClose(() => {
			if (peer === next) peer = void 0;
			for (const fail of inFlight.get(next) ?? []) fail(/* @__PURE__ */ new Error(ROUTER_RESTARTED));
			inFlight.delete(next);
		});
	};
	const retired = /* @__PURE__ */ new WeakSet();
	const retire = (old) => {
		retired.add(old);
		if ((inFlight.get(old)?.size ?? 0) === 0) old.close();
	};
	const ready = async () => {
		while (peer === void 0 || peer.closed || channel === void 0) {
			if (peer !== void 0 && !peer.closed && channel === void 0) {
				const opened = await open(peer, unit);
				channel = opened.channel;
				unit = opened.unit;
				runtime = opened.runtime;
				continue;
			}
			connecting ??= connect().finally(() => connecting = void 0);
			await connecting;
		}
		return {
			peer,
			channel,
			unit
		};
	};
	/** A request that fails the moment the connection or the unit under it ends; `on` is told the unit it goes to. */
	const send = async (method, params, on) => {
		const at = await ready();
		on?.(at.unit);
		let fail = () => void 0;
		const ended = new Promise((_, reject) => fail = reject);
		const calls = inFlight.get(at.peer) ?? /* @__PURE__ */ new Set();
		inFlight.set(at.peer, calls);
		calls.add(fail);
		try {
			return await Promise.race([at.peer.request(method, {
				...params,
				channel: at.channel
			}), ended]);
		} finally {
			calls.delete(fail);
			if (retired.has(at.peer) && calls.size === 0) at.peer.close();
		}
	};
	/** A tool call that outlives its router: the unit that ran it answers the resent call from its first run. */
	const callOnce = async (params) => {
		const call = {
			...params,
			once: randomUUID()
		};
		let sentTo;
		const sameUnit = (unit) => {
			if (sentTo !== void 0 && unit !== sentTo) {
				notice = sessionEndedNotice();
				throw new Error(notice);
			}
			sentTo = unit;
		};
		for (let resends = 0;; resends += 1) try {
			return await send("tools.call", call, sameUnit);
		} catch (err) {
			if (!(err instanceof ProtocolError && err.kind === "closed" || err instanceof Error && err.message === "The CoDesign server restarted during this call. Call it again.")) throw err;
			if (resends === RESENDS) throw new Error(ROUTER_RESTARTED);
		}
	};
	await ready();
	return {
		request: (async (method, params) => {
			if (method !== "tools.call") return send(method, params);
			const result = await callOnce(params);
			if (notice === void 0) return result;
			const told = notice;
			notice = void 0;
			return {
				...result,
				content: [{
					type: "text",
					text: told
				}, ...result.content]
			};
		}),
		onProgress(listener) {
			progress.add(listener);
			return () => progress.delete(listener);
		},
		runtime: () => runtime,
		onToolsChanged: (listener) => void toolsChanged.add(listener),
		onDesignChanged: (listener) => void designChanged.add(listener),
		close() {
			peer?.close();
		}
	};
}

//#endregion
export { ROUTER_RESTARTED, connectRemote };