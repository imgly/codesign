import { InMemoryTransport } from "../../../@modelcontextprotocol/sdk/dist/esm/inMemory.mjs";
import { SUPPORTED_PROTOCOL_VERSIONS } from "../../../@modelcontextprotocol/sdk/dist/esm/types.mjs";
import { createMcpAdapter } from "../../adapter/server.mjs";

//#region src/runtime/shim/answers.ts
/** The list methods the launcher answers from the file. */
const ANSWERED_LISTS = [
	"tools/list",
	"prompts/list",
	"resources/list",
	"skills/list"
];
/** The snapshot as a channel that only lists. */
function listingLink(snapshot, client) {
	const request = async (method) => {
		switch (method) {
			case "tools.list": return { tools: snapshot.toolsFor[client] ?? snapshot.tools };
			case "skills.list": return { skills: snapshot.skills };
			case "prompts.list": return { prompts: snapshot.prompts };
			default: throw new Error(`the snapshot does not answer ${method}`);
		}
	};
	return {
		request,
		onProgress: () => () => void 0,
		onToolsChanged: () => void 0,
		onDesignChanged: () => void 0,
		close: () => void 0
	};
}
/** Ask a fresh adapter what it answers a host named `client`. */
async function answersFor(snapshot, client) {
	const server = createMcpAdapter({
		link: listingLink(snapshot, client),
		instructions: snapshot.instructions,
		version: snapshot.runtime
	});
	const [host, served] = InMemoryTransport.createLinkedPair();
	const replies = /* @__PURE__ */ new Map();
	host.onmessage = (message) => {
		if ("id" in message && typeof message.id === "number") replies.get(message.id)?.(message);
	};
	await server.connect(served);
	await host.start();
	let id = 0;
	const ask = (method, params = {}) => new Promise((resolve, reject) => {
		const at = ++id;
		replies.set(at, (message) => "result" in message ? resolve(message.result) : reject(/* @__PURE__ */ new Error(`${method}: ${JSON.stringify(message.error)}`)));
		host.send({
			jsonrpc: "2.0",
			id: at,
			method,
			params
		});
	});
	const answers = { initialize: await ask("initialize", {
		protocolVersion: SUPPORTED_PROTOCOL_VERSIONS[0],
		capabilities: {},
		clientInfo: {
			name: client,
			version: "0"
		}
	}) };
	await host.send({
		jsonrpc: "2.0",
		method: "notifications/initialized"
	});
	for (const method of ANSWERED_LISTS) answers[method] = await ask(method);
	await server.close();
	return answers;
}
async function renderAnswers(snapshot) {
	const lists = {};
	let initialize = {};
	for (const client of ["", ...Object.keys(snapshot.toolsFor)]) {
		const { initialize: init, ...rest } = await answersFor(snapshot, client);
		if (client === "") {
			const { protocolVersion: _, ...result } = init;
			initialize = result;
		}
		lists[client] = rest;
	}
	return {
		runtime: snapshot.runtime,
		protocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS],
		initialize,
		lists
	};
}

//#endregion
export { ANSWERED_LISTS, renderAnswers };