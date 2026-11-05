//#region ../codesign-router/dist/config/harness.js
const HARNESS_TOKEN = /^[A-Za-z0-9][\w.:+-]{0,63}$/;
const EFFORT = /^[a-z]{1,12}$/;
/** `v` when it is a harness token (or matches `re`), else undefined. */
function harnessToken(v, re = HARNESS_TOKEN) {
	return typeof v === "string" && re.test(v) && !v.includes("..") ? v : void 0;
}
/** `v` when it is a reasoning effort (`low`, `high` …), else undefined. */
const effortToken = (v) => harnessToken(v, EFFORT);
function defined(key, value) {
	return value === void 0 ? {} : { [key]: value };
}
/** The fields a client may send for its channel, each checked as the env reader checks it; anything else is dropped. */
function harnessFields(raw) {
	const o = raw !== null && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
	const bool = (v) => typeof v === "boolean" ? v : void 0;
	return {
		...defined("effort", effortToken(o.effort)),
		...defined("entrypoint", harnessToken(o.entrypoint)),
		...defined("aiAgent", harnessToken(o.aiAgent)),
		...defined("attended", bool(o.attended)),
		...o.geminiCli === true ? { geminiCli: true } : {},
		...o.opencode === true ? { opencode: true } : {},
		...defined("ci", bool(o.ci)),
		...defined("termProgram", harnessToken(o.termProgram))
	};
}
/** The harness of the process whose environment this is: what a client sends on `channel.open`. */
function harnessFromEnv(env) {
	const attended = env.CLAUDE_CODE_SESSION_ATTENDED;
	return harnessFields({
		effort: env.CLAUDE_EFFORT,
		entrypoint: env.CLAUDE_CODE_ENTRYPOINT,
		aiAgent: env.AI_AGENT,
		attended: attended === "1" ? true : attended === "0" ? false : void 0,
		geminiCli: env.GEMINI_CLI === "1",
		opencode: env.OPENCODE === "1",
		ci: env.CI !== void 0 ? env.CI !== "0" && env.CI.toLowerCase() !== "false" : void 0,
		termProgram: env.TERM_PROGRAM
	});
}

//#endregion
export { effortToken, harnessFields, harnessFromEnv, harnessToken };