---
title: "Node.js Image Editor SDK"
description: "The CreativeEditor SDK provides a robust and user-friendly solution for photo and image editing."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/edit-image/overview-5249ea/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Create and Edit Images](https://img.ly/docs/cesdk/archive/v1.84/node/edit-image-c64912/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/edit-image/overview-5249ea/)

---

The CreativeEditor SDK (CE.SDK) offers powerful image editing capabilities designed for seamless integration into your application. You can give your users full control through an intuitive user interface or implement fully automated workflows via the SDK’s programmatic API.

Image editing with CE.SDK runs fully in-process on your server, ensuring fast performance, data privacy, and offline compatibility. Whether you're building a photo editor, design tool, or automation workflow, CE.SDK provides everything you need—plus the flexibility to integrate AI tools for tasks like adding or removing objects, swapping backgrounds, or creating variants.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Core Capabilities

CE.SDK includes a wide range of image editing features accessible both through the UI and programmatically. Key capabilities include:

- **Transformations**: Crop, rotate, resize, scale, and flip images.
- **Adjustments and effects**: Apply filters, control brightness and contrast, add vignettes, pixelization, and more.
- **Background removal**: Automatically remove backgrounds from images using plugin integrations.
- **Color tools**: Replace colors, apply gradients, adjust palettes, and convert to black and white.
- **Vectorization**: Convert raster images into vector format (SVG).
- **Programmatic editing**: Make all edits via API—ideal for automation and bulk processing.

All operations are optimized for in-app performance and align with real-time editing needs.

## Supported Input Formats

The SDK supports a broad range of image input types:

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

## Output and export options

Export edited images in the following formats:

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

You can define export resolution, compression level, and file metadata. CE.SDK also supports exporting with transparent backgrounds, underlayers, or color masks.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
