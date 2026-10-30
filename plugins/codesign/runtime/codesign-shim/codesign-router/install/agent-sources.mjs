import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

//#region ../codesign-router/dist/install/agent-sources.js
const CODEX_TRIPLES = {
	"linux-x64": "x86_64-unknown-linux-musl",
	"linux-arm64": "aarch64-unknown-linux-musl",
	"darwin-x64": "x86_64-apple-darwin",
	"darwin-arm64": "aarch64-apple-darwin",
	"win32-x64": "x86_64-pc-windows-msvc",
	"win32-arm64": "aarch64-pc-windows-msvc"
};
const AGENTS = [{
	name: "claude",
	adapter: "@agentclientprotocol/claude-agent-acp",
	version: "0.93.0",
	sdk: "@anthropic-ai/claude-agent-sdk",
	sdkVersion: "0.3.300",
	cli: (platform) => ({
		pkg: `@anthropic-ai/claude-agent-sdk-${platform}`,
		bin: platform.startsWith("win32") ? "claude.exe" : "claude"
	})
}, {
	name: "codex",
	adapter: "@agentclientprotocol/codex-acp",
	version: "2.2.2",
	sdk: "@openai/codex",
	sdkVersion: "0.160.1",
	pinSdk: true,
	patch: {
		file: "codex-acp-2.2.2.patch",
		pack: "2.2.2-q2"
	},
	cli: (platform) => ({
		pkg: `@openai/codex-${platform}`,
		bin: join("vendor", CODEX_TRIPLES[platform] ?? platform, "bin", platform.startsWith("win32") ? "codex.exe" : "codex")
	})
}];
/** The version of `agent`'s pack: the adapter's, or the patched one's. */
function packVersion(agent) {
	return agent.patch?.pack ?? agent.version;
}
/** What a core's manifest.json names under `agents`: agent → its pack, `claude-0.93.0`. */
function agentPins() {
	return Object.fromEntries(AGENTS.map((a) => [a.name, `${a.name}-${packVersion(a)}`]));
}
/** `npm` arguments that install `agent`'s pack for `platform` into the current directory. */
function npmInstallArgs(agent, platform) {
	const [os, cpu] = platform.split("-");
	return [
		"install",
		"--omit=dev",
		"--no-audit",
		"--no-fund",
		"--ignore-scripts",
		"--no-package-lock",
		`--os=${os}`,
		`--cpu=${cpu}`,
		`${agent.adapter}@${agent.version}`,
		...agent.pinSdk ? [`${agent.sdk}@${agent.sdkVersion}`] : []
	];
}
/** Why the pack npm installed into `stage` is not `agent`'s for `platform`, or undefined when it is. */
function stagedPackProblem(agent, platform, stage) {
	const file = join(stage, "node_modules", agent.sdk, "package.json");
	const sdk = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).version : void 0;
	if (sdk !== agent.sdkVersion) return `${agent.adapter}@${agent.version} brought ${agent.sdk} ${sdk ?? "nothing"}, expected ${agent.sdkVersion}`;
	const cli = agent.cli(platform);
	if (!existsSync(join(stage, "node_modules", cli.pkg, cli.bin))) return `npm installed no ${cli.pkg}/${cli.bin} for ${platform}`;
}
/** `source` with each hunk of the unified `diff` applied where its old lines occur; a hunk that fits nowhere or twice throws. */
function applyDiff(source, diff) {
	const file = /^\+\+\+ (?:b\/)?(.+)$/m.exec(diff)?.[1] ?? "the file";
	return diff.split(/^@@ .*\n/m).slice(1).reduce((text, hunk, i) => {
		const lines = hunk.split("\n");
		const side = (keep) => lines.filter((l) => l.startsWith(" ") || l.startsWith(keep)).map((l) => l.slice(1)).join("\n");
		const parts = text.split(side("-"));
		if (parts.length !== 2) throw new Error(`hunk ${i + 1} of the patch fits ${file} ${parts.length === 1 ? "nowhere" : "more than once"}`);
		return parts.join(side("+"));
	}, source);
}
/** Apply `agent`'s patch to its adapter in the pack npm installed into `stage`. */
function patchStagedPack(agent, stage) {
	if (agent.patch === void 0) return;
	const name = agent.patch.file;
	const diff = readFileSync(new URL(`../../agent-patches/${name}`, import.meta.url), "utf8");
	for (const section of diff.split(/^(?=--- )/m).filter((s) => s.trim())) {
		const path = /^\+\+\+ (?:b\/)?(.+)$/m.exec(section)?.[1];
		if (path === void 0) throw new Error(`${name} names no file`);
		const file = join(stage, "node_modules", agent.adapter, path);
		try {
			writeFileSync(file, applyDiff(readFileSync(file, "utf8"), section));
		} catch (err) {
			throw new Error(`${name} does not apply to ${agent.adapter}@${agent.version}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
}

//#endregion
export { AGENTS, agentPins, applyDiff, npmInstallArgs, packVersion, patchStagedPack, stagedPackProblem };