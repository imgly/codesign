---
title: "Agent Skills"
description: "Install CE.SDK documentation and code generation skills for AI coding assistants."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/get-started/agent-skills-f7g8h9/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Build with AI](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/build-with-ai-k7m9p2/) > [Agent Skills](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/agent-skills-f7g8h9/)

---

The CE.SDK Agent Skills plugin gives AI coding assistants CE.SDK documentation,
guided code generation, and project scaffolding for building applications with
CreativeEditor SDK across 10 Web frameworks, Swift on Apple platforms, Kotlin
with Jetpack Compose on Android, and the Flutter and React Native wrappers.

## What Are Agent Skills?

[Agent Skills](https://agentskills.io) are portable knowledge packs that plug into AI coding assistants. By installing the CE.SDK skills, you get:

- **Current documentation**: The skills read the CE.SDK guides on img.ly as Markdown, and bundle the API references and agent rules
- **Guided code generation**: Build and explain skills that walk through CE.SDK implementation step by step
- **Autonomous scaffolding**: The build skill creates and verifies complete CE.SDK projects from scratch

## Available Skills

One `imgly-sdk` plugin contains three skills. Each skill detects the platform and
framework from your project and reads the matching references:

| Skill     | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| `docs`    | Look up CE.SDK guides and API reference for your platform and framework           |
| `explain` | Explain how CE.SDK features work — concepts, architecture, workflows              |
| `build`   | Implement features and scaffold complete CE.SDK projects from public starter kits |

Claude Code additionally receives a thin optional `builder` agent adapter that
delegates to the same `build` skill. Codex uses the `build` skill directly.

The references cover:

| Platform     | Frameworks and modules                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Web          | React, Vue.js, Svelte, SvelteKit, Angular, Next.js, Nuxt.js, Electron, Vanilla JS, Node.js                       |
| Swift        | `IMGLYEngine`, `IMGLYCore`, `IMGLYCoreUI`, `IMGLYCamera`, `IMGLYEditor` on iOS, macOS, Mac Catalyst              |
| Android      | Engine, editor, and camera Kotlin APIs with Jetpack Compose                                                      |
| Flutter      | `imgly_editor` and `imgly_camera` (Dart); the native editor on iOS and Android                                   |
| React Native | `@imgly/editor-react-native` and `@imgly/camera-react-native` (TypeScript); the native editor on iOS and Android |

`IMGLYEngine` is available on iOS, macOS, and Mac Catalyst. The prebuilt editor,
camera, UI modules, and starter kits are iOS-only. When available, the
skills prefer live Xcode symbols for the installed SDK and use bundled API
digests as a portable fallback. The Android API reference is distilled from
first-party Dokka Markdown into compact per-type digests.

The Flutter and React Native references hold the wrapper's own Dart or
TypeScript API as per-type digests, runnable examples from the showcases apps,
and a mapping document that says which customizations are written in Swift and
Kotlin. For those, the skills read the bundled Swift and
Android references, so a wrapper project never needs a second install. To
change part of a prebuilt editor, such as its dock, the skills start from the
wrapper's own Swift and Kotlin sources, which the plugin bundles with their
IMG.LY license.

When a project mixes platforms, or the platform is not clear from the files,
the skill asks which platform you mean before it reads any reference.

The plugin bundles each platform's page index, the API digests, and agent rules.
The skills fetch the guides from `https://img.ly/docs/cesdk/` as Markdown, so
they need network access. The links point to the docs of the plugin's CE.SDK
version, and the skills switch to the docs of the version your project uses. For a
new project, the build skill clones a public starter kit repository from
`github.com/imgly` at the branch of the plugin's CE.SDK version.

## Setup Instructions

### Claude Code Plugin

Add the marketplace and install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install imgly-sdk@imgly
```

### Codex Plugin

Add the same marketplace and install the plugin in Codex:

```bash
# Add the marketplace (one-time setup)
codex plugin marketplace add imgly/agent-skills

# Install the plugin
codex plugin add imgly-sdk@imgly
```

### Installs from before the rename

The plugin used to be called `cesdk`. In Claude Code, an existing `cesdk@imgly`
install keeps updating through an alias entry for the same plugin. Its skills
now show as `/imgly-sdk:docs`, `/imgly-sdk:explain`, and `/imgly-sdk:build`.
New installs use `imgly-sdk@imgly`.

Codex cannot update a plugin under its old name, so an existing `cesdk@imgly`
install stays on its last version. Replace it:

```bash
codex plugin remove cesdk@imgly
codex plugin add imgly-sdk@imgly
```

### Vercel Skills CLI

Install using the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

```bash
# Claude Code
npx skills add imgly/agent-skills -a claude-code

# Other agents: change the -a value, e.g. codex or cursor
npx skills add imgly/agent-skills -a codex

# Install a specific skill only
npx skills add imgly/agent-skills --skill docs -a claude-code

# List the skills first
npx skills add imgly/agent-skills --list
```

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
# Clone the repo
git clone https://github.com/imgly/agent-skills.git

# Copy a skill into your agent's skills directory
cp -r agent-skills/plugins/cesdk/skills/docs <skills-directory>/docs
cp -r agent-skills/plugins/cesdk/skills/explain <skills-directory>/explain
cp -r agent-skills/plugins/cesdk/skills/build <skills-directory>/build
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

| Channel    | Branch            | Matches engine dist-tag | Marketplace  | Contents                                              |
| ---------- | ----------------- | ----------------------- | ------------ | ----------------------------------------------------- |
| Stable     | `main` / `latest` | `latest`                | `imgly`      | Latest stable release (default)                       |
| Prerelease | `next`            | `next`                  | `imgly-next` | Latest release candidate (e.g. `1.77.0-rc.4`)         |
| Nightly    | `dev`             | `dev`                   | `imgly-dev`  | Latest nightly build (e.g. `1.78.0-nightly.20260630`) |

Each channel has its own marketplace name, so a prerelease or nightly
marketplace can be added while the stable one stays registered. The plugin is
`imgly-sdk` on every channel, so keep only one channel enabled: two enabled
copies hide each other's skills. For example, to switch from stable to the
prerelease:

```bash
# Claude Code (switch back with: claude plugin enable imgly-sdk@imgly)
claude plugin disable imgly-sdk@imgly
claude plugin marketplace add imgly/agent-skills@next
claude plugin install imgly-sdk@imgly-next

# Codex has no disable command, so remove the stable plugin
codex plugin remove imgly-sdk@imgly
codex plugin marketplace add imgly/agent-skills@next
codex plugin add imgly-sdk@imgly-next
```

A version tag uses the marketplace name of the channel that published it; tags
published before the per-channel names, such as `v1.78.0-nightly.20260630`, use
marketplace `imgly` and plugin `cesdk`.

A prerelease or nightly installed before the per-channel names is registered as
marketplace `imgly`. Adding the stable marketplace then fails, and Codex stops
updating that install. Remove it and add the channel again, for example for
nightly:

```bash
# Claude Code
claude plugin uninstall cesdk@imgly
claude plugin marketplace remove imgly
claude plugin marketplace add imgly/agent-skills@dev
claude plugin install imgly-sdk@imgly-dev

# Codex
codex plugin remove cesdk@imgly
codex plugin marketplace remove imgly
codex plugin marketplace add imgly/agent-skills@dev
codex plugin add imgly-sdk@imgly-dev
```

Every published version is also available under an exact `v<version>` Git tag.
Use the channel-specific instructions below to track a moving channel or pin one
published build.

> **Note:** The `v<version>` tag for a given nightly only exists if that nightly actually published skills — when a night's generated content is identical to the previous publish, no new tag is created for that date.

### Claude Code Plugin

Pin the marketplace to a channel branch or a version tag with the `@<ref>` suffix:

```bash
# Prerelease (release candidate) channel — latest rc
claude plugin marketplace add imgly/agent-skills@next
claude plugin install imgly-sdk@imgly-next

# Nightly channel — latest nightly
claude plugin marketplace add imgly/agent-skills@dev
claude plugin install imgly-sdk@imgly-dev

# A specific published version
claude plugin marketplace add imgly/agent-skills@v1.78.0-nightly.20260630
claude plugin install cesdk@imgly
```

### Codex Plugin

Add the matching marketplace ref:

```bash
# Prerelease channel
codex plugin marketplace add imgly/agent-skills@next
codex plugin add imgly-sdk@imgly-next

# Nightly channel
codex plugin marketplace add imgly/agent-skills@dev
codex plugin add imgly-sdk@imgly-dev

# A specific published version
codex plugin marketplace add imgly/agent-skills@v1.78.0-nightly.20260630
codex plugin add cesdk@imgly
```

### Vercel Skills CLI

Put the channel branch or version tag in the `/tree/<ref>` segment of the repository URL:

```bash
# Nightly channel — latest nightly
npx skills add https://github.com/imgly/agent-skills/tree/dev -a claude-code

# A specific published version
npx skills add https://github.com/imgly/agent-skills/tree/v1.78.0-nightly.20260630 -a claude-code

# A single skill from a pinned version
npx skills add https://github.com/imgly/agent-skills/tree/v1.78.0-nightly.20260630 --skill docs -a claude-code
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
skill from the installed CE.SDK plugin. Name the platform or framework in your
request when the project does not make it obvious.

### Look up documentation

```text
Use the docs skill to look up CE.SDK configuration for React.
Use the docs skill for getting started with Vue.
Use the docs skill to look up IMGLYEngine asset sources.
Use the docs skill to look up BlockApi.create on Android.
```

### Build a feature

```text
Use the build skill to add text overlays to images.
Use the build skill to create a photo editor with filters in Next.js.
Use the build skill to create an iOS photo editor.
Use the build skill to create a Compose photo editor.
```

### Explain a concept

```text
Use the explain skill to describe how the block hierarchy works.
Use the explain skill to describe the export pipeline and output formats.
Use the explain skill to describe custom editor UI on macOS.
Use the explain skill to describe the EditorConfiguration.remember lifecycle.
```

## How It Works

The `docs` skill bundles the complete CE.SDK guides and API references for every
supported Web framework, the Swift modules, and the Android APIs as plain
Markdown under `references/`. Skills read directly from these local files — no
external services or MCP servers are required.

The `build` skill includes starter kit templates for common use cases like
design editors, video editors, and photo editors. It selects the matching Web,
Swift, or Android project structure and generates code accordingly.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
