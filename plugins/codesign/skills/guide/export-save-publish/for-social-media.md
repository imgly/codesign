> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [For Social Media](./export-save-publish/for-social-media.md)

---

Export designs for social media with the correct dimensions and quality settings.
Configure image exports with exact pixel dimensions optimized for Instagram portrait posts.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-for-social-media-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-for-social-media-server-js)

Instagram portrait posts use a 4:5 aspect ratio at 1080×1350 pixels, providing more vertical screen real estate than square posts. This guide demonstrates how to export images with these dimensions using CE.SDK in Node.js.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-for-social-media-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export for Social Media
 *
 * Demonstrates exporting an image with Instagram portrait dimensions (1080x1350).
 *
 * Note: Video export is not supported in @cesdk/node.
 * For video exports, use the CE.SDK Renderer on Linux.
 */

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Load a template scene from a remote URL
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found in scene');
  }

  // Export with Instagram portrait dimensions (4:5 aspect ratio)
  const blob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.9,
    targetWidth: 1080,
    targetHeight: 1350
  });

  // Create output directory if it doesn't exist
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Convert Blob to Buffer and save to file system
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = `${outputDir}/instagram-portrait.jpg`;
  writeFileSync(filename, buffer);

  console.log(
    `Exported: instagram-portrait.jpg (1080x1350, ${(blob.size / 1024).toFixed(1)} KB)`
  );
  console.log(`File saved to: ${filename}`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers loading a template scene, exporting with specific dimensions and quality settings, and saving the result to the file system.

> **Video Export:** The WASM-based `@cesdk/node` package supports image exports only. For video exports on the server, use the native `@cesdk/node-native` package — it exports MP4 directly via `engine.block.exportVideo()` — or the [CE.SDK Renderer](#broken-link-7f3e9a), a native Linux binary with hardware-accelerated video encoding.

## Loading a Scene

Before exporting, load a template scene with visual content.

```typescript highlight-setup
// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Load a template scene from a remote URL
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found in scene');
  }
```

We initialize the engine, load a template from a remote URL, and locate the page for export.

## Exporting the Image

Export the page using `engine.block.export()`. The `targetWidth` and `targetHeight` options scale the design to exact pixel dimensions for Instagram portrait format.

```typescript highlight-export
// Export with Instagram portrait dimensions (4:5 aspect ratio)
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.9,
  targetWidth: 1080,
  targetHeight: 1350
});
```

The export options control the output:

- **mimeType**: `image/jpeg` for social media (smaller file sizes than PNG)
- **jpegQuality**: 0.9 provides high quality with reasonable file size
- **targetWidth/targetHeight**: 1080×1350 pixels for Instagram portrait (4:5 aspect ratio)

## Saving to File System

After export, convert the Blob to a Buffer and write to the file system.

```typescript highlight-save
  // Create output directory if it doesn't exist
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Convert Blob to Buffer and save to file system
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = `${outputDir}/instagram-portrait.jpg`;
  writeFileSync(filename, buffer);
```

The output directory is created if it doesn't exist. The console output confirms the export with file size, verifying the processing completed successfully.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.export()` | Export block as image (PNG, JPEG, WebP, PDF) |
| `engine.block.findByType()` | Find blocks by type (page, text, image, etc.) |
| `engine.scene.load()` | Load a scene from a remote URL |

### Export Options (Images)

| Option | Type | Description |
|--------|------|-------------|
| `mimeType` | `string` | Output format: `image/jpeg`, `image/png`, `image/webp` |
| `jpegQuality` | `number` | JPEG compression (0.0-1.0), default 0.9 |
| `targetWidth` | `number` | Output width in pixels |
| `targetHeight` | `number` | Output height in pixels |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Complete export options including PNG, WebP, and PDF



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support