> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Overview](./export-save-publish/export/overview.md)

---

Export your designs to multiple formats including PNG, JPEG, WebP, SVG, PDF and — with the native Node.js package — MP4 video.
CE.SDK handles all export processing entirely on the server side, giving you
fine-grained control over format-specific options like compression, quality,
and target dimensions.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

Whether you're building a content automation workflow, batch processing system, or server-side rendering pipeline, understanding export options helps you deliver the right output for each use case. This guide covers supported formats, their options, and how to export programmatically.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-overview-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export Overview
 *
 * Demonstrates export options and formats:
 * - Exporting to different image formats (PNG, JPEG, WebP)
 * - Configuring format-specific options
 * - Exporting to PDF
 * - Exporting with color masks for print workflows
 * - Checking device export limits
 * - Target size control
 */

// Prompt user to select export format
async function selectFormat(): Promise<string> {
  const formats = [
    { key: '1', label: 'PNG', value: 'png' },
    { key: '2', label: 'JPEG', value: 'jpeg' },
    { key: '3', label: 'WebP', value: 'webp' },
    { key: '4', label: 'PDF', value: 'pdf' },
    { key: '5', label: 'HD PNG (1920x1080)', value: 'hd' },
    { key: '6', label: 'Color Mask (PNG + alpha)', value: 'mask' },
    { key: '7', label: 'All formats', value: 'all' }
  ];

  console.log('\nSelect export format:');
  formats.forEach((f) => console.log(`  ${f.key}) ${f.label}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter choice (1-7): ', (answer) => {
      rl.close();
      const selected = formats.find((f) => f.key === answer.trim());
      if (!selected) {
        console.error(
          `\n✗ Invalid choice: "${answer.trim()}". Please enter 1-7.`
        );
        process.exit(1);
      }
      resolve(selected.value);
    });
  });
}

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
    throw new Error('No page found');
  }
  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Get user's format selection
  const format = await selectFormat();
  console.log('');

  if (format === 'png' || format === 'all') {
    // Export to PNG with compression
    const pngBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
    });
    const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.png`, pngBuffer);
    console.log(`✓ PNG exported (${(pngBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'jpeg' || format === 'all') {
    // Export to JPEG with quality setting
    const jpegBlob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      jpegQuality: 0.9 // 0-1, higher = better quality, larger file
    });
    const jpegBuffer = Buffer.from(await jpegBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.jpg`, jpegBuffer);
    console.log(`✓ JPEG exported (${(jpegBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'webp' || format === 'all') {
    // Export to WebP with lossless quality
    const webpBlob = await engine.block.export(page, {
      mimeType: 'image/webp',
      webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
    });
    const webpBuffer = Buffer.from(await webpBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.webp`, webpBuffer);
    console.log(`✓ WebP exported (${(webpBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'pdf' || format === 'all') {
    // Export to PDF
    const pdfBlob = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
    });
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.pdf`, pdfBuffer);
    console.log(`✓ PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'hd' || format === 'all') {
    // Export with target size
    const hdBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    const hdBuffer = Buffer.from(await hdBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design-hd.png`, hdBuffer);
    console.log(`✓ HD export complete (${(hdBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'mask' || format === 'all') {
    // Export with color mask - RGB values are in 0.0-1.0 range
    // Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
    const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
      page,
      1.0, // maskColorR - red component
      0.0, // maskColorG - green component
      1.0, // maskColorB - blue component (RGB: pure magenta)
      { mimeType: 'image/png' }
    );
    const maskedBuffer = Buffer.from(await maskedImage.arrayBuffer());
    const maskBuffer = Buffer.from(await alphaMask.arrayBuffer());
    writeFileSync(`${outputDir}/design-masked.png`, maskedBuffer);
    writeFileSync(`${outputDir}/design-alpha-mask.png`, maskBuffer);
    console.log(
      `✓ Color mask export: image (${(maskedImage.size / 1024).toFixed(1)} KB) + mask (${(alphaMask.size / 1024).toFixed(1)} KB)`
    );
  }

  // Check device export limits
  const maxExportSize = engine.editor.getMaxExportSize();
  const availableMemory = engine.editor.getAvailableMemory();
  console.log(`\nDevice limits:`);
  console.log(`  Max export size: ${maxExportSize}px`);
  console.log(
    `  Available memory: ${(Number(availableMemory) / 1024 / 1024).toFixed(0)} MB`
  );

  console.log('\n✓ Export completed successfully');
  console.log(`  Output files saved to: ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to export designs in different formats, configure format-specific options, check device limits, and save exports to the file system.

## Supported Export Formats

CE.SDK supports exporting scenes, pages, groups, or individual blocks in these formats:

| Format | MIME Type                  | Transparency   | Best For                                          |
| ------ | -------------------------- | -------------- | ------------------------------------------------- |
| PNG    | `image/png`                | Yes            | Web graphics, UI elements, logos                  |
| JPEG   | `image/jpeg`               | No             | Photographs, web images                           |
| WebP   | `image/webp`               | Yes (lossless) | Web delivery, smaller files                       |
| SVG    | `image/svg+xml`            | Yes            | Scalable graphics, web embedding, post-processing |
| TGA    | `image/x-tga`              | Yes            | Image pipelines that require TGA files            |
| PDF    | `application/pdf`          | Partial        | Print, documents                                  |
| Binary | `application/octet-stream` | Yes            | Raw data processing                               |
| MP4    | `video/mp4`                | No             | Video export (native `@cesdk/node-native` package only, via `exportVideo()`) |

Each format serves different purposes. PNG preserves transparency and works well for graphics with sharp edges or text. JPEG compresses photographs efficiently but drops transparency. WebP provides excellent compression with optional lossless mode. SVG produces scalable vector output ideal for web embedding and post-processing with standard SVG tooling. PDF preserves vector information for print workflows.

For the complete format compatibility matrix, including codecs and size limits, see [File Format Support](./file-format-support.md).

## Export Images

### Export to PNG

PNG export uses lossless compression with a configurable compression level. Higher compression produces smaller files but takes longer to encode. Quality is not affected.

```typescript highlight-export-png
// Export to PNG with compression
const pngBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
});
```

The `pngCompressionLevel` ranges from 0 (no compression, fastest) to 9 (maximum compression, slowest). The default is 5, which balances file size and encoding speed.

### Export to JPEG

JPEG export uses lossy compression controlled by the quality setting. Lower quality produces smaller files but introduces visible artifacts.

```typescript highlight-export-jpeg
// Export to JPEG with quality setting
const jpegBlob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.9 // 0-1, higher = better quality, larger file
});
```

The `jpegQuality` ranges from 0 to 1. Values above 0.9 provide excellent quality for most use cases. The default is 0.9.

> **Caution:** JPEG drops transparency from exports. Transparent areas render with a solid
> background, which may produce unexpected results for designs relying on alpha
> channels.

### Export to WebP

WebP provides better compression than PNG or JPEG for web delivery. A quality of 1.0 enables lossless mode.

```typescript highlight-export-webp
// Export to WebP with lossless quality
const webpBlob = await engine.block.export(page, {
  mimeType: 'image/webp',
  webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
});
```

The `webpQuality` ranges from 0 to 1. At 1.0, WebP uses lossless compression that typically produces smaller files than equivalent PNG exports.

### Export to SVG

SVG export produces scalable vector graphics that can be post-processed with standard SVG tooling or scaled to any resolution without quality loss.

```typescript
const blob = await engine.block.export(page, {
  mimeType: 'image/svg+xml'
});

const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output/design.svg', buffer);
```

Text is exported as vector paths to ensure consistent rendering across environments without requiring the original fonts. Shapes, strokes, and gradients are exported as native SVG elements.

> **Note:** Drop shadows, blur, effects (filters, adjustments), and raster images cannot be represented as native SVG vector elements. These features are rasterized and embedded as PNG images within the SVG. This preserves visual fidelity but increases file size and means those parts of the output are not scalable.

> **Note:** SVG export renders a single page. To export a multi-page scene, export each page individually.

### Image Export Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | - | Output format: `'image/png'`, `'image/jpeg'`, `'image/webp'`, or `'image/svg+xml'` |
| `pngCompressionLevel` | `number` | `5` | PNG compression level (0-9). Higher = smaller file, slower encoding |
| `jpegQuality` | `number` | `0.9` | JPEG quality (0-1). Higher = better quality, larger file |
| `webpQuality` | `number` | `0.8` | WebP quality (0-1). Set to 1.0 for lossless compression |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Export PDF

PDF export preserves vector information and supports print workflows. The high compatibility option rasterizes content for broader viewer support.

```typescript highlight-export-pdf
// Export to PDF
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
});
```

When `exportPdfWithHighCompatibility` is `true` (the default), images and effects are rasterized according to the scene's DPI setting. Set it to `false` for faster exports, though gradients with transparency may not render correctly in some PDF viewers. With high compatibility disabled, CE.SDK embeds unmodified JPEG images with their original data, which keeps photo-heavy exports small. Use `pdfImageQuality` to encode the images that CE.SDK still has to rasterize as lossy JPEG.

The underlayer options are useful for print workflows where you need a solid base layer (often white ink) beneath the design elements. The `underlayerSpotColorName` should match a spot color defined in your print workflow.

### PDF Export Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | - | Must be `'application/pdf'` |
| `exportPdfWithHighCompatibility` | `boolean` | `true` | Rasterize images and effects (like gradients) according to the scene's DPI setting for broader viewer support |
| `pdfImageQuality` | `number` | `1.0` | Encoding quality for images that have to be rasterized; values below `1.0` encode them as lossy JPEG |
| `exportPdfWithUnderlayer` | `boolean` | `false` | Add an underlayer behind existing elements matching the shape of page content |
| `underlayerSpotColorName` | `string` | `''` | Spot color name for the underlayer fill (used with print workflows) |
| `underlayerOffset` | `number` | `0` | Size adjustment for the underlayer shape in design units |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Export with Color Mask

Color mask export removes pixels matching a specific RGB color and generates two output files: the masked image with transparency applied, and an alpha mask showing which pixels were removed.

```typescript highlight-export-color-mask
// Export with color mask - RGB values are in 0.0-1.0 range
// Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
  page,
  1.0, // maskColorR - red component
  0.0, // maskColorG - green component
  1.0, // maskColorB - blue component (RGB: pure magenta)
  { mimeType: 'image/png' }
);
```

The `exportWithColorMask()` method accepts the block to export, three RGB color components (0.0-1.0 range), and optional export options. RGB values use floating-point notation where 1.0 equals 255 in standard color notation.

Common mask colors for print workflows:

- Pure red: `(1.0, 0.0, 0.0)` — Registration marks
- Pure magenta: `(1.0, 0.0, 1.0)` — Distinctive marker color
- Pure cyan: `(0.0, 1.0, 1.0)` — Alternative marker color

The method returns a Promise resolving to an array of two Blobs: the masked image (with matched pixels made transparent) and the alpha mask (black pixels for removed areas, white for retained areas).

> **Note:** Color matching is exact. Only pixels with RGB values precisely matching the
> specified color are removed. Anti-aliased edges or color variations will not
> be affected.

### Color Mask Export Options

The `exportWithColorMask()` method accepts the same options as image export:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | `'image/png'` | Output format: `'image/png'`, `'image/jpeg'`, or `'image/webp'` |
| `pngCompressionLevel` | `number` | `5` | PNG compression level (0-9) |
| `jpegQuality` | `number` | `0.9` | JPEG quality (0-1) |
| `webpQuality` | `number` | `0.8` | WebP quality (0-1) |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Target Size Control

You can export at specific dimensions regardless of the block's actual size. The `targetWidth` and `targetHeight` options render the block large enough to fill the target size while maintaining aspect ratio.

```typescript highlight-export-target-size
// Export with target size
const hdBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1920,
  targetHeight: 1080
});
```

If the target aspect ratio differs from the block's aspect ratio, the output fills the target dimensions completely. The output may extend beyond the target size on one axis to preserve correct proportions.

## Device Export Limits

Before exporting large designs, check the device's export capabilities. Memory constraints may prevent exports that exceed certain dimensions.

```typescript highlight-check-limits
// Check device export limits
const maxExportSize = engine.editor.getMaxExportSize();
const availableMemory = engine.editor.getAvailableMemory();
```

`getMaxExportSize()` returns the maximum width or height in pixels. Both dimensions must stay below this limit. `getAvailableMemory()` returns available memory in bytes, helping you assess whether large exports are feasible.

> **Note:** The max export size is an upper bound. Exports may still fail due to memory
> constraints even when within size limits. For high-resolution exports,
> consider checking available memory first.

## Save to File System

After exporting, convert the Blob to a Buffer and write to the file system.

```typescript
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
});

const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output/design.png', buffer);
```

This approach works for all export formats. Adjust the filename extension to match the exported format.

## API Reference

| Method                               | Description                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `engine.block.export()`              | Export a block with format and quality options                                        |
| `engine.block.exportWithColorMask()` | Export a block with specific RGB color removed, returning masked image and alpha mask |
| `engine.editor.getMaxExportSize()`   | Get maximum export dimension in pixels                                                |
| `engine.editor.getAvailableMemory()` | Get available memory in bytes                                                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support