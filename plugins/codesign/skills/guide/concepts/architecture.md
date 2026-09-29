> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Architecture](./concepts/architecture.md)

---

Understand how CE.SDK is structured around the CreativeEngine and its six interconnected APIs.

CE.SDK is built around the **CreativeEngine**—a single-threaded core runtime that manages state, rendering, and coordination between six specialized APIs. Understanding how these pieces connect helps you navigate the SDK effectively.

## The CreativeEngine

The *Engine* is the central coordinator. All operations—creating content, manipulating blocks, rendering, and exporting—flow through it. Initialize it once and access everything else through its API namespaces.

The *Engine* manages:

- **One active scene** containing all design content
- **Six API namespaces** for different domains of functionality
- **Event dispatching** for reactive state management
- **Resource loading** and caching
- **Rendering** to a canvas element (browser) or headless rendering and export (server)

## Content Hierarchy

CE.SDK organizes content in a tree: *Scene* → *Pages* → *Blocks*.

- **Scene**: The root container. One scene per engine instance. Supports both static designs and time-based video editing.
- **Pages**: Containers within a scene. Artboards for static designs, time-based compositions for video editing.
- **Blocks**: The atomic units—graphics, text, audio, video. Everything visible is a block.

The **Scene API** manages this hierarchy. The **Block API** manipulates individual blocks within it. See [Scenes](./concepts/scenes.md), [Pages](./concepts/pages.md), and [Blocks](./concepts/blocks.md) for details.

## The Six APIs

The engine exposes six API namespaces. Here's how they interconnect:

### Scene API (`engine.scene`)

Creates and manages the content hierarchy. Works with the *Block API* to populate scenes with content and the *Event API* to notify when structure changes.

### Block API (`engine.block`)

The most-used API. Creates, modifies, and queries blocks. Every visual element flows through here. Blocks reference *Assets* loaded through the *Asset API* and can contain *Variables* managed by the *Variable API*.

### Asset API (`engine.asset`)

Provides content to the *Block API*. Registers asset sources (images, videos, stickers, templates) and handles queries. When you add an image to a block, the *Asset API* resolves it and the *Block API* applies it.

### Variable API (`engine.variable`)

Enables data-driven designs. Define variables at the scene level; reference them in text blocks with `{{variableName}}` syntax. When variable values change, affected blocks update automatically—coordinated through the *Event API*.

### Editor API (`engine.editor`)

Controls application state: edit modes, undo/redo history, user roles, and permissions. The *Editor API* determines what operations the *Block API* can perform based on current role and scope settings.

### Event API (`engine.event`)

The reactive backbone. Subscribe to changes across all other APIs—block modifications, selection changes, history updates. Build UIs that stay synchronized with engine state.

## How They Connect

A typical flow shows the interconnection:

1. **Scene API** creates the content structure
2. **Asset API** provides images, templates, or other content
3. **Block API** creates blocks and applies assets to them
4. **Variable API** injects dynamic data into text blocks
5. **Editor API** controls what users can modify
6. **Event API** notifies your UI of every change

Each API focuses on one domain but works through the others. The *Engine* coordinates these interactions.

## Scene Capabilities

CE.SDK scenes support a range of capabilities:

- **Static designs**: Social posts, print materials, graphics. Blocks positioned spatially.
- **Time-based content**: Duration, playback time, and animation. Blocks arranged across time.

The scene configuration determines which *Block API* properties and *Editor API* capabilities are available. See [Scenes](./concepts/scenes.md) for details.

## Integration Patterns

CE.SDK runs in two contexts:

- **Browser**: The engine renders to a canvas element. Append `engine.element` to your DOM. Use with the built-in UI or build your own.
- **Headless**: Rendering without a visible canvas — the WASM package renders in software, the native package on the GPU where available. Use for server-side exports, automation, and batch operations. See [Headless Mode](./concepts/headless-mode.md).

Both contexts use the same six APIs—only rendering differs.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support