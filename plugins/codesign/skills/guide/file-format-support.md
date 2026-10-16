---
title: "File Format Support"
description: "See which image, video, audio, font, and template formats CE.SDK supports for import and export."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/file-format-support-3c4b2a/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Compatibility & Security](https://img.ly/docs/cesdk/archive/v1.84/node/compatibility-fef719/) > [File Format Support](https://img.ly/docs/cesdk/archive/v1.84/node/file-format-support-3c4b2a/)

---

CreativeEditor SDK (CE.SDK) supports a wide range of modern file types for importing assets and exporting final content. Whether you're working with images, videos, documents, or fonts, CE.SDK provides an editing environment with excellent media compatibility and performance—optimized for modern hardware.

This guide outlines supported formats and known limitations across media types.

## Importing Media

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

### SVG Limitations

CE.SDK uses Skia for SVG parsing and rendering. While most SVG files render correctly, there are some important limitations to be aware of:

### Text Elements

- SVG text elements are not supported - any text in SVG files will not be rendered.
- Convert text to paths in your vector editor before exporting if text is needed.

### Styling Limitations

- CSS styles included in SVGs are not supported - use presentation attributes instead.
- RGBA color syntax is not supported - use `fill-opacity` and `stroke-opacity` attributes.
- When exporting SVGs from design tools, choose the "presentation attributes" option.

### Unsupported SVG Elements

The following SVG elements are not supported:

- Animation elements (`<animate>`)
- Foreign object (`<foreignObject>`)
- Text-related elements (`<altGlyph>`, `<font>`, `<glyph>`)
- Script elements (`<script>`)
- Some filter elements (`<feComponentTransfer>`, `<feConvolveMatrix>`, `<feTile>`, `<feDropShadow>`)
- Inlined SVGs via `<image>` or `<feImage>` elements

## Exporting Media

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

## Importing Templates

| Format   | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `.idml`  | InDesign (via `@imgly/idml-importer`)                           |
| `.psd`   | Photoshop (via `@imgly/psd-importer`)                           |
| `.pdf`   | PDF (via `@imgly/pdf-importer`)                                 |
| `.pptx`  | PowerPoint (via `@imgly/pptx-importer`)                         |
| `.imgly` | CE.SDK Native (scene or archive, detected automatically)        |
| `.scene` | CE.SDK Native (scene extension)       |
| `.zip`   | CE.SDK Native (archive extension)     |

Non-native design files are converted into editable CE.SDK scenes by dedicated
importer packages rather than uploaded as media assets.

> **Note:** The `.idml`, `.psd`, `.pdf` and `.pptx` importers ship as separate packages
> that you install in addition to CE.SDK. These importer packages run only in
> the browser and in Node.js. They are not available on any other platform,
> including Android, iOS, Flutter and React Native.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs to generate
> scenes programmatically.

See [Import and Export](https://img.ly/docs/cesdk/archive/v1.84/node/concepts/import-export-0ebbd8/) for
how these import and export workflows fit together.

## Font Formats

| Format   | Description                       |
| -------- | --------------------------------- |
| `.ttf`   | TrueType Font                     |
| `.otf`   | OpenType Font                     |
| `.woff`  | Web Open Font Format              |
| `.woff2` | Compressed Web Open Font Format 2 |

> **Note:** Fonts should be appropriately licensed before being embedded in your
> application.

## Size Limits

### Image Resolution Limits

| Constraint            | Recommendation / Limit                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input Resolution**  | Maximum input resolution is **4096×4096 pixels**. Images from external sources (e.g., Unsplash) are resized to this size before rendering on the canvas. You can modify this value using the `maxImageSize` setting.  |
| **Output Resolution** | There is no enforced output resolution limit. Theoretically, the editor supports output sizes up to **16,384×16,384 pixels**. However, practical limits depend on the device's GPU capabilities and available memory. |

All image processing in CE.SDK happens on the device running the engine, so these values depend on the **maximum texture size** supported by its hardware. The default limit of 4096×4096 is a safe baseline that works universally. Higher resolutions (e.g., 8192×8192) may work on certain devices but could fail on others during export if the GPU texture size is exceeded.

> **Note:** To ensure consistent results across devices, it’s best to test higher output
> sizes on your target hardware and set conservative defaults in production.

### Video Resolution Limits

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Resolution** | Up to **4K UHD** is supported for **playback** and **export**, depending on the user's hardware and available GPU resources. For **import**, CE.SDK does not impose artificial limits, but maximum video size is bounded by available memory: WASM-based builds (browser and `@cesdk/node`) are limited by the **32-bit address space of WebAssembly (wasm32)** and, in the browser, the **tab’s memory cap (~2 GB)**, while native builds such as `@cesdk/node-native` can use the full process memory. |
| **Frame Rate** | 30 FPS at 1080p is broadly supported; 60 FPS and high-res exports benefit from hardware acceleration                                                                                                                                                                                                                           |
| **Duration**   | Stories and reels of up to **2 minutes** are fully supported. Longer videos are also supported, but we generally found a maximum duration of **10 minutes** to be a good balance for a smooth editing experience and a pleasant export duration of around one minute on modern hardware.                                       |

> **Note:** Performance scales with the host hardware. For best results with high-resolution
> or high-frame-rate video, modern CPUs/GPUs with hardware acceleration are
> recommended.

## Codecs

### **Video Codecs**

- **H.264 / AVC** (in `.mp4`)
- **H.265 / HEVC** (in `.mp4`, may require platform-specific support)

### **Audio Codecs**

- **MP3** (in `.mp3` or within `.mp4`)
- **AAC** (in `.m4a` or within `.mp4` or `.mov`)

These codecs apply to importing media. For export, CE.SDK produces MP4 with H.264 (H.265 only on supported browser and mobile platforms); the native Node.js package (`@cesdk/node-native`) exports H.264 video with AAC audio.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
