> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Build with AI](./get-started/build-with-ai.md) > [Agent Plugin](./get-started/cesdk-plugin-coding-agents.md)

---

The CE.SDK plugin is the one-command way to give your AI coding agent bundled documentation skills and guided workflows for CreativeEditor SDK. Claude Code additionally receives an autonomous project scaffolder.

> **Note:** Looking to add AI **generation features** — image, video, audio, or text —
> into the editor for your own users? That's a different journey: see&#x20;
> [AI Features](#broken-link-5aa356).

## What's in the Plugin

A plugin is the distribution unit that bundles several agent capabilities behind one install. Depending on the agent, a plugin can package any combination of:

- **Skills** — procedural knowledge and reference your agent loads on demand to work accurately
- **Slash commands** — actions you invoke directly, like `/cesdk:build`
- **Subagents** — specialized agents with their own tools and persona for a focused task
- **MCP servers** — live connections to external tools and data
- **Hooks** — handlers that run at lifecycle points, such as before or after a tool call

The CE.SDK plugin packages documentation skills and two workflow skills. Claude Code additionally receives an autonomous builder agent:

| Capability                      | What it gives your agent                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Documentation skills**        | The complete CE.SDK guides and API reference for each Web framework, bundled locally — no external calls |
| **Build skill**                 | Guided code generation and project setup (`/cesdk:build`)                                                |
| **Explain skill**               | Concept and architecture walkthroughs (`/cesdk:explain`)                                                 |
| **Builder agent (Claude Code)** | Autonomous scaffolding that detects your framework and implements a working CE.SDK project end to end    |

For the full skill list, see [Agent Skills](./get-started/agent-skills.md). For real-time documentation search, connect the [MCP Server](./get-started/mcp-server.md).

## Install

### Claude Code

Add the marketplace once, then install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install cesdk@imgly
```

### OpenAI Codex

Add the same marketplace, then install the plugin:

```bash
codex plugin marketplace add imgly/agent-skills
codex plugin add cesdk@imgly
```

### Vercel Skills CLI (Codex, Cursor, and more)

Claude Code and Codex can install CE.SDK agent plugins through their respective marketplaces. For a skills-only installation—or for agents without a plugin marketplace—install the portable skills across **OpenAI Codex**, Cursor, GitHub Copilot, Windsurf, and 70+ more with the [Vercel Skills CLI](https://github.com/vercel-labs/skills), picking your agent with `-a`:

```bash
# OpenAI Codex
npx skills add imgly/agent-skills -a codex

# Claude Code
npx skills add imgly/agent-skills -a claude-code

# Other agents — e.g. Cursor, GitHub Copilot, Windsurf
npx skills add imgly/agent-skills -a cursor

# List available skills first
npx skills add imgly/agent-skills --list
```

The CLI installs the skills only — not the Claude-specific builder agent — into a project-local directory (Codex resolves them from `.agents/skills/`); pass `-g` to install globally instead.

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
git clone https://github.com/imgly/agent-skills.git

# Codex and other agents that read the portable Agent Skills directory
cp -r agent-skills/plugins/cesdk/skills/docs-react .agents/skills/cesdk-docs-react

# Claude Code
cp -r agent-skills/plugins/cesdk/skills/docs-react .claude/skills/cesdk-docs-react
```

## Verify

Once installed, ask your agent to use one of the bundled skills to confirm the plugin is active:

```text
Use the CE.SDK build skill to create a photo editor with filters.
Use the CE.SDK React documentation skill to look up configuration.
Use the CE.SDK explain skill to describe the block hierarchy.
```

Claude Code users can also invoke the same workflows with slash commands:

```text
/cesdk:build create a photo editor with filters
/cesdk:docs-react configuration
/cesdk:explain how the block hierarchy works
```

## Next Steps

- Connect the [MCP Server](./get-started/mcp-server.md) for always-current documentation search.
- Browse the individual [Agent Skills](./get-started/agent-skills.md).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support