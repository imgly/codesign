---
title: "Node.js Creative Engine"
description: "Learn what CE.SDK is, how it works, and what you can build with its headless API, and real-time design engine."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/what-is-cesdk-2e7acd/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/) > [What is CE.SDK?](https://img.ly/docs/cesdk/archive/v1.84/node/what-is-cesdk-2e7acd/)

---

### What is CE.SDK?

**CreativeEditor SDK (CE.SDK)** on Node.js is a powerful design engine that brings fully automated image and design editing directly into your Node app. Whether you're enabling AI-powered design workflows, template-based creation, or dynamic content generation, CE.SDK offers the flexibility, performance, and developer control you need — all with minimal integration overhead.

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

Trusted by leading organizations worldwide, CE.SDK powers the creative editors used in best-in-class applications, including those from Shopify, Semrush, HP, Shutterfly, Ticketmaster, and Swiss Post.

## Key Capabilities of the Node.js Creative Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description:
      'Perform operations like cropping, rotating, and resizing design elements.',
    imageId: 'transform',
  },
  {
    title: 'Templating',
    description:
      'Create and apply design templates with placeholders and text variables for dynamic content.',
    imageId: 'templating',
  },
  {
    title: 'Placeholders & Lockable Design',
    description:
      'Constrain templates to guide your users’ design and ensure brand consistency.',
    imageId: 'placeholders',
  },
  {
    title: 'Asset Management',
    description:
      'Import and manage images, shapes, and other assets to build your designs.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Design Collage',
    description:
      'Arrange multiple elements on a single canvas to create complex layouts.',
    imageId: 'video-collage',
  },
  {
    title: 'Text Editing',
    description:
      'Add and style text blocks with various fonts, colors, and effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Background Removal',
    description:
      'This plugin makes it easy to remove the background from images running entirely in the browser.',
    imageId: 'green-screen',
  },
  {
    title: 'Extendible',
    description:
      'Hook into the engine API and editor events to implement custom features.',
    imageId: 'extendible',
  },
  {
    title: 'Headless & Automation',
    description:
      'Programmatically edit designs within your React application using the engine API.',
    imageId: 'headless',
  },
]}
/>

## File Format Support

CE.SDK supports a wide range of file types to ensure maximum flexibility for developers:

### Importing Media

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

### Exporting Media

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

### Importing Templates

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

For detailed information, see the [full file format support list](https://img.ly/docs/cesdk/archive/v1.84/node/file-format-support-3c4b2a/).

## Integrations

CE.SDK supports out-of-the-box integrations with:

- **Getty Images**
- **Unsplash**
- **Pexels**
- **Soundstripe**

Want to connect your own asset sources? Register a custom provider using our API.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
