---
title: "Agent Plugin"
description: "Install the CE.SDK plugin to give Claude Code and other coding agents documentation, skills, and code generation in one command."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/get-started/cesdk-plugin-coding-agents-c0d3ag/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Build with AI](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/build-with-ai-k7m9p2/) > [Agent Plugin](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/cesdk-plugin-coding-agents-c0d3ag/)

---

The CE.SDK plugin is the one-command way to give your AI coding agent documentation skills and guided workflows for CreativeEditor SDK on Web, Swift, Android, Flutter, and React Native. Claude Code additionally receives an autonomous project scaffolder.

> **Note:** Looking to add AI **generation features** — image, video, audio, or text —
> into the editor for your own users? That's a different journey: see&#x20;
> [AI Features](#broken-link-5aa356).

## What's in the Plugin

A plugin is the distribution unit that bundles several agent capabilities behind one install. Depending on the agent, a plugin can package any combination of:

- **Skills** — procedural knowledge and reference your agent loads on demand to work accurately
- **Slash commands** — actions you invoke directly, like `/imgly-sdk:build`
- **Subagents** — specialized agents with their own tools and persona for a focused task
- **MCP servers** — live connections to external tools and data
- **Hooks** — handlers that run at lifecycle points, such as before or after a tool call

The CE.SDK plugin packages three skills. Each one detects the platform and framework from your project and reads the matching references. Claude Code additionally receives an autonomous builder agent:

| Capability                      | What it gives your agent                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Docs skill**                  | The CE.SDK guides on img.ly and the bundled API reference for every Web framework, Swift, Android, Flutter, and React Native (`/imgly-sdk:docs`) |
| **Build skill**                 | Guided code generation and project setup from public starter kits (`/imgly-sdk:build`)                                                           |
| **Explain skill**               | Concept and architecture walkthroughs (`/imgly-sdk:explain`)                                                                                     |
| **Builder agent (Claude Code)** | Autonomous scaffolding that detects your framework and implements a working CE.SDK project end to end                                            |

For details on the references, see [Agent Skills](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/agent-skills-f7g8h9/). For real-time documentation search, connect the [MCP Server](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/mcp-server-fde71c/).

## Install

The plugin used to be called `cesdk`. In Claude Code, an existing `cesdk@imgly`
install keeps updating, and its skills now show as `/imgly-sdk:docs`,
`/imgly-sdk:explain`, and `/imgly-sdk:build`. Codex can't update a plugin under
its old name, so replace it there: run `codex plugin remove cesdk@imgly`, then
`codex plugin add imgly-sdk@imgly`.

### Claude Code

Add the marketplace once, then install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install imgly-sdk@imgly
```

### OpenAI Codex

Add the same marketplace, then install the plugin:

```bash
codex plugin marketplace add imgly/agent-skills
codex plugin add imgly-sdk@imgly
```

### Vercel Skills CLI (Codex, Cursor, and more)

Claude Code and Codex can install the CE.SDK plugin through their respective marketplaces. For a skills-only installation—or for agents without a plugin marketplace—install the portable skills across **OpenAI Codex**, Cursor, GitHub Copilot, Windsurf, and 70+ more with the [Vercel Skills CLI](https://github.com/vercel-labs/skills). Pick your agent with `-a`:

```bash
# OpenAI Codex
npx skills add imgly/agent-skills -a codex

# Claude Code
npx skills add imgly/agent-skills -a claude-code

# Other agents — e.g. Cursor, GitHub Copilot, Windsurf
npx skills add imgly/agent-skills -a cursor

# List the skills first
npx skills add imgly/agent-skills --list
```

The CLI installs the skills only — not the Claude-specific builder agent — into a project-local directory (Codex resolves them from `.agents/skills/`); pass `-g` to install globally instead.

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
git clone https://github.com/imgly/agent-skills.git

# Codex and other agents that read the portable Agent Skills directory
cp -r agent-skills/plugins/cesdk/skills/docs .agents/skills/docs

# Claude Code
cp -r agent-skills/plugins/cesdk/skills/docs .claude/skills/docs
```

## Verify

Once installed, ask your agent to use one of the bundled skills to confirm the plugin is active:

```text
Use the CE.SDK build skill to create a photo editor with filters.
Use the CE.SDK docs skill to look up configuration for React.
Use the CE.SDK explain skill to describe the block hierarchy.
```

Claude Code users can also invoke the same workflows with slash commands:

```text
/imgly-sdk:build create a photo editor with filters
/imgly-sdk:docs React configuration
/imgly-sdk:explain how the block hierarchy works
```

## Next Steps

- Connect the [MCP Server](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/mcp-server-fde71c/) for always-current documentation search.
- Browse the individual [Agent Skills](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/agent-skills-f7g8h9/).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
