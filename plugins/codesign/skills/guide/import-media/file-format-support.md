> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [File Format Support](./import-media/file-format-support.md)

---

When building server-side creative applications with CE.SDK in Node.js, understanding which file formats you can import is essential for processing user content at scale. CE.SDK's Node.js packages (`@cesdk/node` and `@cesdk/node-native`) support the same comprehensive range of modern media formats as the browser version, with one exception: WebM import requires the WASM-based `@cesdk/node`.

This guide provides a complete reference of supported file formats for importing media, templates, and fonts into CE.SDK on Node.js.

## Supported Import Formats

CE.SDK for Node.js supports importing the following media types:

| Category        | Supported Formats                                                                       |
| --------------- | --------------------------------------------------------------------------------------- |
| **Images**      | `.png`, `.apng`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp`                       |
| **Video**       | `.mp4` (H.264/AVC, H.265/HEVC), `.mov` (H.264/AVC, H.265/HEVC), `.webm` (VP8, VP9, AV1 — not supported by the native `@cesdk/node-native` package) |
| **Audio**       | `.mp3`, `.m4a`, `.mp4` (AAC or MP3), `.mov` (AAC or MP3)                               |
| **Animation**   | `.json` (Lottie)                                                                        |
| **Templates**   | `.idml` (InDesign), `.psd` (Photoshop), `.scene` (CE.SDK Native)                       |

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs
> programmatically. Contact our support team to learn more about implementing
> custom importers.

## Video and Audio Codecs

While container formats (`.mp4`, `.mov`, `.webm`) define how media is packaged, codecs determine how the content is compressed. CE.SDK for Node.js supports the following codecs:

### Video Codecs

- **H.264 / AVC** (in `.mp4` or `.mov`) – Universally supported with software decoding
- **H.265 / HEVC** (in `.mp4` or `.mov`) – Requires platform-specific support; availability varies by system libraries
- **VP8, VP9, AV1** (in `.webm`) – Modern codecs supported through system media libraries (`@cesdk/node` only — the native `@cesdk/node-native` package cannot import WebM)

### Audio Codecs

- **MP3** (in `.mp3` files or within `.mp4`/`.mov` containers)
- **AAC** (in `.m4a`, `.mp4`, or `.mov` containers)

> **Note:** In Node.js environments, video and audio codec support depends on the system's
> installed media libraries and codecs. Ensure your deployment environment has
> the necessary codecs installed for your target formats.

## Size Limits and Constraints

CE.SDK for Node.js processes media using the system's available resources. Server environments typically have more memory and CPU resources than browsers, but you should still be mindful of limits:

### Image Resolution Limits

| Constraint            | Recommendation / Limit                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input Resolution**  | Maximum input resolution is **4096×4096 pixels** by default. Images from external sources are resized to this size before rendering. You can modify this value using the `maxImageSize` setting.  |
| **Output Resolution** | There is no enforced output resolution limit. The editor theoretically supports output sizes up to **16,384×16,384 pixels**. Practical limits depend on available system memory and CPU resources. |

All image processing in CE.SDK for Node.js is handled server-side. The WASM-based `@cesdk/node` package renders on the CPU (no GPU required); the native `@cesdk/node-native` package renders on the GPU when one is available and falls back to CPU rendering. The default limit of 4096×4096 ensures reasonable processing times and memory usage. Higher resolutions will work but may require more memory and longer processing times.

> **Note:** For server deployments, monitor memory usage when processing high-resolution
> images. Consider implementing request queuing or resource pooling for
> production workloads.

### Video Resolution and Duration Limits

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Resolution** | Up to **4K UHD** is supported for processing, depending on available system resources. Maximum video size is bounded by available system memory; with the WASM-based `@cesdk/node` package it is additionally bounded by the **32-bit address space of WebAssembly (wasm32)**. |
| **Frame Rate** | 30 FPS at 1080p is recommended; 60 FPS works but increases processing time                                                                                                                                           |
| **Duration**   | Stories and reels of up to **2 minutes** process efficiently. Longer videos up to **10 minutes** are supported, with processing time scaling proportionally with duration.                                       |

> **Warning:** Server-side video processing is resource-intensive (the native `@cesdk/node-native` package uses GPU acceleration where available). For production deployments,
> consider implementing job queues, progress tracking, and timeout handling for
> long-running video operations.

## Format-Specific Considerations

### SVG Limitations

CE.SDK uses Skia for SVG parsing and rendering. While most SVG files render correctly, there are some important limitations to be aware of:

#### Text Elements

- SVG text elements are not supported – any text in SVG files will not be rendered.
- Convert text to paths in your vector editor before exporting if text is needed.

#### Styling Limitations

- CSS styles included in SVGs are not supported – use presentation attributes instead.
- RGBA color syntax is not supported – use `fill-opacity` and `stroke-opacity` attributes.
- When exporting SVGs from design tools, choose the "presentation attributes" option.

#### Unsupported SVG Elements

The following SVG elements are not supported:

- Animation elements (`<animate>`)
- Foreign object (`<foreignObject>`)
- Text-related elements (`<altGlyph>`, `<font>`, `<glyph>`)
- Script elements (`<script>`)
- Some filter elements (`<feComponentTransfer>`, `<feConvolveMatrix>`, `<feTile>`, `<feDropShadow>`)
- Inlined SVGs via `<image>` or `<feImage>` elements

> **Note:** When preparing SVG assets for server-side processing, always export with
> "presentation attributes" and convert text to paths for maximum compatibility.

### WebP Support

WebP images are fully supported for import in Node.js environments. CE.SDK handles both lossy and lossless WebP formats, including images with transparency (alpha channel). WebP provides excellent compression with high quality, making it ideal for optimizing storage and bandwidth in server applications.

### Animated Image Considerations (GIF and APNG)

CE.SDK handles animated GIF and APNG files based on scene type:

- **Design scenes**: rendered as a static image showing the first frame.
- **Video scenes**: imported as a looping video fill, with frame timing and duration parsed from the file's metadata.

For complex animated content in server environments, prefer `.mp4`, which offers better compression and broader codec support. If you need to extract every frame from a GIF or APNG, process the file frame-by-frame outside of CE.SDK.

### Template Format Details

CE.SDK supports importing templates from popular design applications:

- **IDML** (InDesign Markup Language) – Import layouts and designs created in Adobe InDesign
- **PSD** (Photoshop Document) – Import layered Photoshop files with preserved layer structure
- **SCENE** – CE.SDK's native scene format, optimized for fast loading and processing

When importing IDML or PSD files in Node.js, CE.SDK preserves layer hierarchy, text formatting, and design structure where possible. Some advanced effects or features specific to the source application may require manual adjustment after import.

## Font Format Support

CE.SDK for Node.js supports modern font formats for typography:

| Format   | Description                       |
| -------- | --------------------------------- |
| `.ttf`   | TrueType Font                     |
| `.otf`   | OpenType Font                     |
| `.woff`  | Web Open Font Format              |
| `.woff2` | Compressed Web Open Font Format 2 |

> **Warning:** Ensure fonts are appropriately licensed before embedding them in your
> server-side application. Many commercial fonts have specific licensing
> requirements for server use and programmatic rendering.

## Best Practices for Node.js

### Format Selection

When building server-side applications, consider these format recommendations:

- **Images**: Use `.webp` for optimal storage efficiency. Use `.png` for lossless images with transparency or `.jpeg` for photographs.
- **Video**: Prefer `.mp4` with H.264 encoding for maximum compatibility across deployment environments.
- **Audio**: Use `.mp3` for universal compatibility or `.m4a` (AAC) for better quality at smaller file sizes.
- **Templates**: Use `.scene` format for CE.SDK-to-CE.SDK workflows to minimize parsing overhead.

### Validation and Error Handling

Always validate file formats before processing on the server:

1. **Check file signatures (magic bytes)** not just extensions – users may upload misnamed files
2. **Validate MIME types** from uploaded content
3. **Set maximum file size limits** to prevent resource exhaustion
4. **Implement timeouts** for processing operations to prevent hanging requests
5. **Log validation failures** for debugging and security monitoring

### Resource Management

For production Node.js deployments, implement proper resource management:

- **Memory limits**: Monitor and limit memory per process (note that `--max-old-space-size` caps only the V8 heap, not the engine's own allocations)
- **Concurrency control**: Limit concurrent processing jobs to prevent resource exhaustion
- **Cleanup**: Always dispose of resources after processing (call `dispose()` on engine instances)
- **Queue systems**: Use job queues (Bull, BullMQ) for long-running video processing tasks
- **Progress tracking**: Implement progress callbacks for long operations
- **Caching**: Cache processed assets when appropriate to reduce redundant processing

### File System Considerations

When working with local files in Node.js:

- Use absolute paths or resolve paths relative to your application root
- Clean up temporary files after processing
- Consider streaming large files instead of loading them entirely into memory
- Handle file permissions correctly for both reading source files and writing exports



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support