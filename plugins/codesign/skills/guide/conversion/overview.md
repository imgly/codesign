---
title: "Overview"
description: "Convert designs into different formats such as PDF, PNG, MP4, and more using CE.SDK tools."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/conversion/overview-44dc58/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Conversion](https://img.ly/docs/cesdk/archive/v1.84/node/conversion-c3fbb3/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/conversion/overview-44dc58/)

---

CreativeEditor SDK (CE.SDK) allows you to export designs into a variety of formats, making it easy to prepare assets for web publishing, printing, storage, and other workflows.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Supported Input and Output Formats

CE.SDK accepts a range of input formats when working with designs, including:

| Category      | Supported Formats                                                                       |
| ------------- | --------------------------------------------------------------------------------------- |
| **Images**    | `.png`, `.apng`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp`                       |
| **Video**     | `.mp4` (H.264/AVC, H.265/HEVC), `.mov` (H.264/AVC, H.265/HEVC), `.webm` (VP8, VP9, AV1 — not supported by the native `@cesdk/node-native` package) |
| **Audio**     | `.wav`, `.mp3`, `.m4a`, `.mp4` (AAC or MP3), `.mov` (AAC or MP3)                        |
| **Animation** | `.json` (Lottie)                                                                        |

Animated images (`.gif` and `.apng`) import as a static first frame in design
scenes and as a looping video fill in video scenes.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs
> programmatically.

When it comes to exporting or converting designs, the SDK supports the following output formats:

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

Each format serves different use cases, giving you the flexibility to adapt designs for your application’s needs.

## Customization Options

When exporting designs, CE.SDK offers several customization options to meet specific output requirements:

- **Resolution and DPI Settings:**\
  Adjust the resolution for raster exports like PNG to optimize for screen or print.

- **Output Dimensions:**\
  Define custom width and height settings for the exported file, independent of the original design size.

- **File Quality:**\
  For formats that support compression (such as PNG or PDF), you can control the quality level to balance file size and visual fidelity.

- **Background Transparency:**\
  Choose whether to preserve transparent backgrounds or export with a solid background color.

- **Page Selection:**\
  When exporting multi-page documents (e.g., PDFs), you can select specific pages or export all pages at once.

These options help ensure that your exported content is optimized for its intended platform, whether it's a website, a mobile app, or a print-ready document.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
