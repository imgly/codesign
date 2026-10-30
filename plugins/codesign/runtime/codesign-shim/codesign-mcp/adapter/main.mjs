import { clientConfigFromEnv } from "../../codesign-router/config/unit-config.mjs";
import { connectRemote } from "./remote.mjs";
import { createMcpAdapter } from "./server.mjs";
import { createInterface } from "node:readline";

//#region src/adapter/main.ts
/** The notification every attached client gets after a call that may have changed the design. */
const SESSION_CHANGED = "notifications/codesign/session_changed";
/** The channel through the router: what `cdsn mcp` serves. */
function routerChannel(opts) {
	return async (client) => {
		const link = await connectRemote({
			socket: opts.socket,
			startRouter: opts.startRouter,
			client,
			config: clientConfigFromEnv(opts.env),
			...opts.conversation !== void 0 ? { conversation: opts.conversation } : {},
			...opts.chatClientKind !== void 0 ? { chatClientKind: opts.chatClientKind } : {}
		});
		const { text } = await link.request("instructions", {});
		return {
			link,
			instructions: text,
			version: link.runtime()
		};
	};
}
/** MCP over stdin/stdout, one JSON message per line. */
var LineTransport = class {
	async start() {}
	async send(message) {
		process.stdout.write(`${JSON.stringify(message)}\n`);
	}
	async close() {
		this.onclose?.();
	}
};
const identityOf = (message) => {
	const info = "method" in message && message.method === "initialize" ? message.params?.clientInfo : void 0;
	return {
		kind: "mcp",
		...info?.name !== void 0 ? { name: info.name } : {},
		...info?.version !== void 0 ? { version: info.version } : {}
	};
};
/** Serves the host on stdin/stdout; messages that arrive before the channel is open wait for it. */
async function runAdapter(open) {
	const transport = new LineTransport();
	const queued = [];
	let first;
	const firstMessage = new Promise((resolve) => first = resolve);
	let server;
	let closeLink = () => void 0;
	const lines = createInterface({ input: process.stdin });
	lines.on("line", (line) => {
		if (line.trim() === "") return;
		let message;
		try {
			message = JSON.parse(line);
		} catch {
			process.stdout.write(`${JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32700,
					message: "Parse error"
				}
			})}\n`);
			return;
		}
		if (first !== void 0) {
			first(message);
			first = void 0;
		}
		if (server === void 0) queued.push(message);
		else transport.onmessage?.(message);
	});
	lines.on("close", () => {
		closeLink();
		process.exit(0);
	});
	const hello = await firstMessage;
	try {
		const { link, instructions, version } = await open(identityOf(hello));
		closeLink = () => link.close();
		const adapter = createMcpAdapter({
			link,
			instructions,
			version
		});
		link.onToolsChanged(() => void adapter.sendToolListChanged());
		link.onDesignChanged((p) => void adapter.notification({
			method: SESSION_CHANGED,
			params: {
				...p.by.tool !== void 0 ? { tool: p.by.tool } : {},
				design: p.uri
			}
		}));
		await adapter.connect(transport);
		server = adapter;
	} catch (err) {
		const message = `CoDesign could not start: ${err instanceof Error ? err.message : String(err)}`;
		for (const m of queued) if ("method" in m && "id" in m) await transport.send({
			jsonrpc: "2.0",
			id: m.id,
			error: {
				code: -32603,
				message
			}
		});
		process.stderr.write(`codesign: ${message}\n`);
		process.exit(1);
	}
	for (const message of queued.splice(0)) transport.onmessage?.(message);
}

//#endregion
export { SESSION_CHANGED, routerChannel, runAdapter };