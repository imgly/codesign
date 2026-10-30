import { literal, object, string } from "../../zod/v4/classic/schemas.mjs";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "../../@modelcontextprotocol/sdk/dist/esm/types.mjs";
import { invalidParams, mcpErrors } from "./errors.mjs";

//#region src/adapter/skill-resources.ts
/** Past this many files a skill lists its resources as `dynamic`. */
const MAX_RESOURCES = 512;
const SkillsListRequest = object({
	method: literal("skills/list"),
	params: object({ cursor: string().optional() }).optional()
});
const SkillsGetRequest = object({
	method: literal("skills/get"),
	params: object({ uri: string() })
});
const entriesOf = (skill) => skill.entries ?? [];
const entry = (skill) => ({
	uri: skill.uri,
	frontmatter: skill.frontmatter ?? {
		name: skill.name,
		description: skill.description
	},
	resources: entriesOf(skill).length > MAX_RESOURCES ? "dynamic" : entriesOf(skill).map(({ uri, digest, size }) => ({
		uri,
		digest,
		size
	}))
});
function registerSkillResources(server, link) {
	const skills = async () => (await link.request("skills.list", {})).skills;
	server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: (await skills()).map((s) => ({
		uri: s.uri,
		name: s.name,
		description: s.description,
		mimeType: "text/markdown",
		size: entriesOf(s).find((e) => e.uri === s.uri)?.size ?? 0
	})) }));
	server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
		const { uri } = req.params;
		const read = await mcpErrors(link.request("skills.read", { uri }));
		return { contents: [{
			uri,
			mimeType: read.mimeType,
			text: read.text
		}] };
	});
	server.setRequestHandler(SkillsListRequest, async () => ({
		resultType: "complete",
		skills: (await skills()).filter((s) => entriesOf(s).length <= MAX_RESOURCES).map(entry)
	}));
	server.setRequestHandler(SkillsGetRequest, async (req) => {
		const skill = (await skills()).find((s) => s.uri === req.params.uri);
		if (skill === void 0) throw invalidParams(`Not a skill: ${req.params.uri}`);
		return {
			resultType: "complete",
			skill: entry(skill)
		};
	});
}

//#endregion
export { registerSkillResources };