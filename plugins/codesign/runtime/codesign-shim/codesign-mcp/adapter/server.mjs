import { CallToolRequestSchema, CompleteRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListToolsRequestSchema } from "../../@modelcontextprotocol/sdk/dist/esm/types.mjs";
import { Server } from "../../@modelcontextprotocol/sdk/dist/esm/server/index.mjs";
import { mcpErrors } from "./errors.mjs";
import { registerSkillResources } from "./skill-resources.mjs";

//#region src/adapter/server.ts
const iconDataURI = (fill) => `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="136.9 126.25 319.8 319.8"><path fill-rule="evenodd" fill="${fill}" d="M273.824 243.446C150.64 217.881 173.005 376.091 256.619 347.488C302.867 331.667 313.013 232.85 389.566 253.419C466.119 273.988 475.242 411 328.186 359.548C270.345 339.31 260.54 379.045 192.29 376.091C131.159 373.445 126.68 253.42 240.426 209.847C362.589 163.049 307.599 250.455 273.824 243.446ZM373.096 268.165C344.111 275.007 334.619 346.988 366.619 356.152C430.792 374.531 424.204 256.1 373.096 268.165Z"/></svg>`).toString("base64")}`;
const mcpTool = (t) => ({
	name: t.name,
	...t.title !== void 0 ? { title: t.title } : {},
	...t.description !== "" ? { description: t.description } : {},
	inputSchema: t.inputSchema,
	...t.annotations !== void 0 ? { annotations: t.annotations } : {}
});
const mcpContent = (part) => part.type === "resource" ? {
	type: "resource",
	resource: {
		uri: part.uri,
		...part.mimeType !== void 0 ? { mimeType: part.mimeType } : {},
		text: part.text ?? ""
	}
} : part;
function createMcpAdapter(opts) {
	const { link } = opts;
	const version = opts.buildId ? `${opts.version}+${opts.buildId}` : opts.version;
	const server = new Server({
		name: "codesign",
		version,
		websiteUrl: "https://codesign.co",
		icons: [{
			src: iconDataURI("#000"),
			mimeType: "image/svg+xml",
			sizes: ["any"],
			theme: "light"
		}, {
			src: iconDataURI("#fff"),
			mimeType: "image/svg+xml",
			sizes: ["any"],
			theme: "dark"
		}]
	}, {
		capabilities: {
			tools: {},
			prompts: {},
			completions: {},
			resources: {},
			extensions: { "io.modelcontextprotocol/skills": {} }
		},
		instructions: opts.instructions
	});
	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: (await link.request("tools.list", {})).tools.map(mcpTool) }));
	let calls = 0;
	server.setRequestHandler(CallToolRequestSchema, async (req, extra) => {
		const call = String(++calls);
		const progressToken = req.params._meta?.progressToken;
		const stopProgress = progressToken === void 0 ? void 0 : link.onProgress(({ call: of, ...update }) => {
			if (of !== call) return;
			extra.sendNotification({
				method: "notifications/progress",
				params: {
					progressToken,
					...update
				}
			}).catch(() => {});
		});
		const cancel = () => void link.request("tools.cancel", { call }).catch(() => void 0);
		extra.signal.addEventListener("abort", cancel, { once: true });
		try {
			const result = await mcpErrors(link.request("tools.call", {
				call,
				name: req.params.name,
				arguments: req.params.arguments ?? {},
				...progressToken !== void 0 ? { progress: true } : {},
				...req.params._meta !== void 0 ? { meta: req.params._meta } : {}
			}));
			if (!Array.isArray(result.content)) return {
				isError: true,
				content: [{
					type: "text",
					text: `${req.params.name} failed: the client answered without content.`
				}]
			};
			return {
				...result,
				content: result.content.map(mcpContent)
			};
		} finally {
			extra.signal.removeEventListener("abort", cancel);
			stopProgress?.();
		}
	});
	registerSkillResources(server, link);
	server.setRequestHandler(ListPromptsRequestSchema, async () => link.request("prompts.list", {}));
	server.setRequestHandler(GetPromptRequestSchema, async (req) => {
		const got = await mcpErrors(link.request("prompts.get", {
			name: req.params.name,
			...req.params.arguments !== void 0 ? { arguments: req.params.arguments } : {}
		}));
		return {
			...got,
			messages: got.messages.map((m) => ({
				...m,
				content: mcpContent(m.content)
			}))
		};
	});
	server.setRequestHandler(CompleteRequestSchema, async (req) => {
		const { ref, argument } = req.params;
		if (ref.type !== "ref/prompt") return { completion: {
			values: [],
			total: 0,
			hasMore: false
		} };
		return { completion: await link.request("prompts.complete", {
			prompt: ref.name,
			argument,
			...req.params.context?.arguments !== void 0 ? { context: req.params.context.arguments } : {}
		}) };
	});
	return server;
}

//#endregion
export { createMcpAdapter };