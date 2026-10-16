---
title: "Overview"
description: "Combine and arrange multiple elements to create complex, multi-page, or layered design compositions."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/create-composition/overview-5b19c5/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Create and Edit Compositions](https://img.ly/docs/cesdk/archive/v1.84/node/create-composition-db709c/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/create-composition/overview-5b19c5/)

---

In CreativeEditor SDK (CE.SDK), a *composition* is an arrangement of multiple design elements—such as images, text, shapes, graphics, and effects—combined into a single, cohesive visual layout. Unlike working with isolated elements, compositions allow you to design complex, multi-element visuals that tell a richer story or support more advanced use cases.

All composition processing is handled entirely by the engine in your Node.js process, ensuring fast, secure, and efficient editing without any external service.

You can use compositions to create a wide variety of projects, including social media posts, marketing materials, collages, and multi-page exports like PDFs.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Working with Multiple Pages and Artboards

CE.SDK supports working with multiple artboards or canvases within a single document, enabling you to design multi-page layouts or create several design variations within the same project.

Typical multi-page use cases include:

- Designing multi-page marketing brochures.
- Exporting designs as multi-page PDFs.
- Building multiple versions of a design for different audiences or platforms.

## Exporting Compositions

CE.SDK compositions can be exported in several formats:

| Category    | Supported Formats                                                                    |
| ----------- | ------------------------------------------------------------------------------------ |
| **Images**  | `.png` (with transparency), `.jpeg`, `.webp`, `.tga`                                 |
| **Vector**  | `.svg` (scalable vector graphics with text as paths)                                 |
| **Print**   | `.pdf` (supports underlayer printing and spot colors)                                |
| **Video**   | `.mp4` (H.264 video with AAC audio — requires the native `@cesdk/node-native` package; not available in the WASM-based `@cesdk/node`) |
| **Scene**   | `.imgly` or `.scene` (description of the scene without any assets) |
| **Archive** | `.imgly` or `.zip` (fully self-contained archive that bundles the scene file with all assets) |
| **HTML**    | `.html` (static designs and animated video timelines — requires the separate `@imgly/html-exporter` package) |

> **Note:** Our custom cross-platform C++ based rendering and layout engine ensures
> consistent output quality across devices.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
