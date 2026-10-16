---
title: "Overview"
description: "Understand how insertion works, how inserted media behave within scenes, and how to control them via UI or code."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/insert-media/overview-491658/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Insert Media Assets](https://img.ly/docs/cesdk/archive/v1.84/node/insert-media-a217f5/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/insert-media/overview-491658/)

---

In CE.SDK, *inserting media into a scene* means placing visual or audio elements directly onto the canvas—images, videos, audio clips, shapes, or stickers—so they become part of the design. This differs from *importing assets*, which simply makes media available in the asset library.

This guide helps you understand how insertion works, how inserted media behave within scenes, and how to control them via code. By the end, you'll know how media are represented, modified, saved, and exported.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Inserting Media vs. Importing Assets

Before you can insert media into a scene, it must first be available to CE.SDK—this is where *importing* comes in. Imported assets are added to the **Asset Library** (from local uploads, remote sources, etc.), where they become available for use.

*Inserting* means placing those assets into the actual scene—either as the fill of a design block (like an image inside a rectangle), or as a standalone visual/audio layer. This process creates scene elements that users can see, move, style, and manipulate.

## How Media Is Handled in Scenes

Internally, inserted media are structured as part of the scene graph. Most are represented as fills or as design blocks:

- **Images and Videos** are typically inserted as *fills* for graphic blocks or as independent blocks for visual layering.
- **Audio** is inserted as a time-based media block, often invisible but active in the composition.
- **Shapes and Stickers** are treated as standalone graphic blocks, with shape or vector fills.

Each inserted item is assigned an ID and properties such as position, size, and rotation, and can be queried or modified programmatically.

## Inserting Media

### Insert Programmatically

Developers can insert media directly via the SDK. Whether you're building a dynamic editor or triggering insertions via user input, CE.SDK exposes APIs for:

- Creating a new design block and applying a media fill (e.g., image, video).
- Controlling properties like position, size, rotation, opacity, and z-index.
- Embedding logic to sync insertions with UI actions or backend data.

## Referencing Existing Assets

Once an asset is imported, you can reference it multiple times without re-importing. Reuse is based on:

- **URI** (useful for remote assets)

When reusing an asset, you can apply different visual properties—each inserted instance can have its own size, position, rotation, or visual effects.

## Media Lifecycle Within a Scene

Inserted media are part of the live scene graph and follow CE.SDK’s scene lifecycle:

- **Saving a Scene**: Inserted media references (or embedded content) are included in the saved `.scene` or `.archive`.
- **Reloading a Scene**: CE.SDK reconstructs the scene graph and fetches any required media URIs or binary data.
- **Exporting**: Media may be embedded directly (e.g., for self-contained exports) or referenced externally (e.g., smaller file sizes, shared assets).

Keep in mind that media integrity on reload/export depends on how the asset was inserted—linked URIs must remain available, whereas embedded assets are bundled.

## Embedding vs. Linking Media

CE.SDK supports two strategies for handling inserted media:

| Mode                         | Description                                    | Use Case                              |
| ---------------------------- | ---------------------------------------------- | ------------------------------------- |
| **Referenced** (Scene Files) | Scene references the media via URI.            | Smaller file sizes, shared asset use. |
| **Embedded** (Archives)      | Media is stored directly in the saved archive. | Offline editing, portable scenes.     |

**Embedded** media increase file size but ensure portability. **Referenced** media reduce storage needs but require external hosting. You can control this behavior when saving or exporting a scene.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
