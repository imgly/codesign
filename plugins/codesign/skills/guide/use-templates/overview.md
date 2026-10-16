---
title: "Overview"
description: "Learn how to browse, apply, and dynamically populate templates in CE.SDK to streamline design workflows."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/use-templates/overview-ae74e1/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Create and Use Templates](https://img.ly/docs/cesdk/archive/v1.84/node/create-templates-3aef79/) > [Use Templates Overview](https://img.ly/docs/cesdk/archive/v1.84/node/use-templates/overview-ae74e1/)

---

Templates in CreativeEditor SDK (CE.SDK) are pre-designed layouts that serve as starting points for generating static designs, videos, or print-ready outputs. Templates can be used to produce a wide range of media, including images, PDFs, and videos.

Instead of creating a design from scratch, you can use a template to quickly produce content by adapting pre-defined elements like text, images, and layout structures.

Using templates offers significant advantages: faster content creation, consistent visual style, and scalable design workflows across many outputs.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Working with Dynamic Content

CE.SDK templates support dynamic placeholders for content such as text, images, and custom elements. You can replace dynamic content programmatically. External data (e.g., from a database, CSV file, or API) can be merged automatically into placeholders without requiring user interaction.

This flexibility supports both one-off customizations and large-scale content generation scenarios.

## Exploring the Template Library

Templates are stored, organized, and managed through the CE.SDK Template Library. This library acts as a centralized place where templates are categorized and retrieved.

You can work with:

- **Default Templates**: Templates that come bundled with the SDK to help you get started quickly.
- **Custom Templates**: Templates you create based on your specific use case, offering full flexibility over design, dynamic fields, and editing constraints.
- **Premium Templates**: Additional high-quality templates provided by IMG.LY, which can be integrated into your application if licensed.

## Applying Templates to Existing Scenes

It’s possible to apply a template to an existing scene. In these cases:

- The template structure can be merged with the current content.
- Alternatively, the scene can be reset and rebuilt based on the new template, depending on the chosen integration approach.

This enables workflows like refreshing an old design with a new branded layout without starting over.

## Output Formats When Using Templates

When generating outputs from templates, CE.SDK supports:

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

Templates are format-aware, allowing you to design once and export to multiple formats seamlessly. For example, a single marketing template could be used to produce a social media graphic, a printable flyer, and a promotional video, all using the same underlying design.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
