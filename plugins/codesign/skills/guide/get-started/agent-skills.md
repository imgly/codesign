> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Build with AI](./get-started/build-with-ai.md) > [Agent Skills](./get-started/agent-skills.md)

---

The CE.SDK Agent Skills plugins give AI coding assistants bundled documentation,
guided code generation, and project scaffolding for building applications with
CreativeEditor SDK across 10 Web frameworks, Swift on Apple platforms, and
Kotlin with Jetpack Compose on Android.

## What Are Agent Skills?

[Agent Skills](https://agentskills.io) are portable knowledge packs that plug into AI coding assistants. By installing the CE.SDK skills, you get:

- **Offline documentation**: All guides, API references, and best practices bundled locally — no external API calls
- **Guided code generation**: Build and explain skills that walk through CE.SDK implementation step by step
- **Autonomous scaffolding**: The shared build skill creates and verifies complete CE.SDK projects from scratch

## Available Skills

| Skill            | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `docs-react`     | Look up CE.SDK React reference guides and documentation                   |
| `docs-vue`       | Look up CE.SDK Vue.js reference guides and documentation                  |
| `docs-svelte`    | Look up CE.SDK Svelte reference guides and documentation                  |
| `docs-sveltekit` | Look up CE.SDK SvelteKit reference guides and documentation               |
| `docs-angular`   | Look up CE.SDK Angular reference guides and documentation                 |
| `docs-nextjs`    | Look up CE.SDK Next.js reference guides and documentation                 |
| `docs-nuxtjs`    | Look up CE.SDK Nuxt.js reference guides and documentation                 |
| `docs-electron`  | Look up CE.SDK Electron reference guides and documentation                |
| `docs-js`        | Look up CE.SDK Vanilla JavaScript reference guides and documentation      |
| `docs-node`      | Look up CE.SDK Node.js reference guides and documentation                 |
| `build`          | Implement features and autonomously scaffold complete CE.SDK Web projects |
| `explain`        | Explain how CE.SDK Web features work — concepts, architecture, workflows  |

Claude Code additionally receives a thin optional `builder` agent adapter that
delegates to the same shared `build` skill. Codex uses the build skill directly.

The separate `cesdk-swift` plugin contains three Swift-focused skills:

| Skill     | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| `docs`    | Look up first-party Swift guides and module-qualified API digests            |
| `explain` | Explain CE.SDK Swift concepts and Apple-platform architecture                |
| `build`   | Implement Swift features and scaffold iOS projects from bundled starter kits |

`IMGLYEngine` is available on iOS, macOS, and Mac Catalyst. The prebuilt editor,
camera, UI modules, and bundled starter kits are iOS-only. When available, the
Swift skills prefer live Xcode symbols for the installed SDK and use bundled API
digests as a portable fallback.

The separate `cesdk-android` plugin contains three Android-focused skills:

| Skill     | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `docs`    | Look up Android guides and Kotlin API digests                             |
| `explain` | Explain CE.SDK Android, Jetpack Compose, and engine concepts              |
| `build`   | Implement Kotlin features and scaffold projects from Android starter kits |

The Android API reference is distilled from first-party Dokka Markdown into
compact per-type digests. The bundled guides cover threading, Compose state,
and engine lifecycle behavior.

## Setup Instructions

### Claude Code Plugin

Add the marketplace and install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install cesdk@imgly

# Install the Swift plugin
claude plugin install cesdk-swift@imgly

# Install the Android plugin
claude plugin install cesdk-android@imgly
```

### Codex Plugin

Add the same marketplace and install the plugin in Codex:

```bash
# Add the marketplace (one-time setup)
codex plugin marketplace add imgly/agent-skills

# Install the Web, Swift, or Android plugin
codex plugin add cesdk@imgly
codex plugin add cesdk-swift@imgly
codex plugin add cesdk-android@imgly
```

### Vercel Skills CLI

Install using the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

```bash
# Install all skills for Claude Code
npx skills add imgly/agent-skills -a claude-code

# Install a specific skill only
npx skills add imgly/agent-skills --skill docs-react -a claude-code

# List available skills first
npx skills add imgly/agent-skills --list
```

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
# Clone the repo
git clone https://github.com/imgly/agent-skills.git

# Copy a specific skill into your agent's skills directory
cp -r agent-skills/plugins/cesdk/skills/docs-react <skills-directory>/cesdk-docs-react

# Or copy the native documentation skills
cp -r agent-skills/plugins/cesdk-swift/skills/docs <skills-directory>/cesdk-swift-docs
cp -r agent-skills/plugins/cesdk-android/skills/docs <skills-directory>/cesdk-android-docs
```

## Keeping Skills Current

Every generated skill records its CE.SDK version, generation date, and plugin
identifier. When a bundle is over six weeks old, or when you ask about updates,
the assistant can compare it with the matching stable, prerelease, or nightly
IMG.LY channel. This check is read-only.

Before changing anything, the assistant must identify whether the active skill
came from Claude Code, Codex, the Skills CLI, a Git checkout, or a manual copy.
It reports unknown or ambiguous installations instead of guessing and requests
explicit approval for the exact update command and target.

## Prerelease and Nightly Versions

By default every install method above tracks the **latest stable** CE.SDK release. If you build against a prerelease or nightly engine build (for example `@cesdk/node-native` on the `next` or `dev` npm dist-tag), you can install the matching skills from a dedicated release channel. The channels mirror the npm dist-tag names:

| Channel    | Branch            | Matches engine dist-tag | Contents                                              |
| ---------- | ----------------- | ----------------------- | ----------------------------------------------------- |
| Stable     | `main` / `latest` | `latest`                | Latest stable release (default)                       |
| Prerelease | `next`            | `next`                  | Latest release candidate (e.g. `1.77.0-rc.4`)         |
| Nightly    | `dev`             | `dev`                   | Latest nightly build (e.g. `1.78.0-nightly.20260630`) |

Every published version is also available under an exact `v<version>` Git tag.
Use the channel-specific instructions below to track a moving channel or pin one
published build.

> **Note:** The `v<version>` tag for a given nightly only exists if that nightly actually published skills — when a night's generated content is identical to the previous publish, no new tag is created for that date.

### Claude Code Plugin

Pin the marketplace to a channel branch or a version tag with the `@<ref>` suffix:

```bash
# Prerelease (release candidate) channel — latest rc
claude plugin marketplace add imgly/agent-skills@next
claude plugin install cesdk@imgly

# Nightly channel — latest nightly
claude plugin marketplace add imgly/agent-skills@dev
claude plugin install cesdk@imgly

# A specific published version
claude plugin marketplace add imgly/agent-skills@v1.78.0-nightly.20260630
claude plugin install cesdk@imgly
```

### Codex Plugin

Add the matching marketplace ref:

```bash
# Prerelease channel
codex plugin marketplace add imgly/agent-skills@next
codex plugin add cesdk@imgly

# Nightly channel
codex plugin marketplace add imgly/agent-skills@dev
codex plugin add cesdk@imgly

# A specific published version
codex plugin marketplace add imgly/agent-skills@v1.78.0-nightly.20260630
codex plugin add cesdk@imgly
```

### Vercel Skills CLI

Specify a channel branch or version tag with the `#<ref>` fragment (or an equivalent `/tree/<ref>` URL):

```bash
# Nightly channel — latest nightly
npx skills add imgly/agent-skills#dev -a claude-code

# A specific published version
npx skills add imgly/agent-skills#v1.78.0-nightly.20260630 -a claude-code

# A single skill from a pinned version (`@` selects the skill)
npx skills add imgly/agent-skills#v1.78.0-nightly.20260630@docs-node -a claude-code
```

### Manual Copy

Clone a specific channel branch or an exact version tag:

```bash
# Nightly channel — latest nightly
git clone -b dev https://github.com/imgly/agent-skills.git

# A specific published version
git clone -b v1.78.0-nightly.20260630 https://github.com/imgly/agent-skills.git
```

## Usage

Ask naturally and let your assistant select the right skill. For explicit
selection, type `/` in Claude Code or `$` in Codex, then select the matching
skill from the installed CE.SDK plugin.

### Look up documentation

```text
Use the docs-react skill to look up CE.SDK configuration.
Use the docs-vue skill for getting started.
Use the docs-nextjs skill to explain server-side rendering.
```

### Build a feature

```text
Use the build skill to add text overlays to images.
Use the build skill to create a photo editor with filters.
```

### Explain a concept

```text
Use the explain skill to describe how the block hierarchy works.
Use the explain skill to describe the export pipeline and output formats.
```

### Use Swift skills

```text
Use the cesdk-swift docs skill to look up IMGLYEngine asset sources.
Use the cesdk-swift build skill to create an iOS photo editor.
Use the cesdk-swift explain skill to describe custom editor UI on macOS.
```

### Use Android skills

```text
Use the cesdk-android docs skill to look up BlockApi.create.
Use the cesdk-android build skill to create a Compose photo editor.
Use the cesdk-android explain skill to describe the EditorConfiguration.remember lifecycle.
```

## How It Works

Each documentation skill bundles the complete CE.SDK guides and API references for its framework in a compressed index. Skills read directly from these local files — no external services or MCP servers are required.

The build skills include starter kit templates for common use cases like design
editors, video editors, and photo editors. They select the matching Web, Swift,
or Android project structure and generate code accordingly.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support