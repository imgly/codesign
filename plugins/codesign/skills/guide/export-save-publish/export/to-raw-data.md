> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To Raw Data](./export-save-publish/export/to-raw-data.md)

---

Exporting designs to raw pixel data in Node.js gives you direct access to uncompressed
RGBA bytes from CE.SDK, enabling custom server-side image processing, automated content pipelines, and
integration with headless rendering workflows.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-to-raw-data-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-raw-data-server-js)

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-raw-data-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export to Raw Data
 *
 * Demonstrates exporting designs to uncompressed RGBA pixel data for custom
 * image processing in Node.js:
 * - Exporting blocks to raw pixel data
 * - Processing pixels with custom algorithms
 * - Integrating with image processing libraries (Sharp)
 * - Saving processed data to files
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});

try {
  // Create a design scene with a single image
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 800, height: 600 },
  });
  engine.block.appendChild(page, imageBlock);
  engine.block.setPositionX(imageBlock, 0);
  engine.block.setPositionY(imageBlock, 0);

  // Export to raw pixel data
  const width = Math.floor(engine.block.getWidth(imageBlock));
  const height = Math.floor(engine.block.getHeight(imageBlock));

  const blob = await engine.block.export(imageBlock, {
    mimeType: 'application/octet-stream',
    targetWidth: width,
    targetHeight: height,
  });

  // Convert blob to Buffer for Node.js processing
  const arrayBuffer = await blob.arrayBuffer();
  const pixelData = Buffer.from(arrayBuffer);

  // eslint-disable-next-line no-console
  console.log(`✓ Exported ${pixelData.length} bytes (${width}x${height} RGBA)`);

  // Apply grayscale processing to demonstrate pixel manipulation
  const processedData = toGrayscale(pixelData);

  // eslint-disable-next-line no-console
  console.log('✓ Applied grayscale effect');

  // Save processed raw data to file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(`${outputDir}/raw-data.bin`, processedData);

  // eslint-disable-next-line no-console
  console.log(`✓ Saved raw data to ${outputDir}/raw-data.bin`);

  // Integration with Sharp for converting raw data to PNG
  // Note: This requires 'sharp' to be installed: npm install sharp
  //
  // import sharp from 'sharp';
  //
  // await sharp(processedData, {
  //   raw: {
  //     width,
  //     height,
  //     channels: 4 // RGBA
  //   }
  // })
  //   .png({ compressionLevel: 9 })
  //   .toFile(`${outputDir}/processed.png`);
  //
  // console.log('✓ Saved PNG to output/processed.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}

/**
 * Convert image to grayscale by averaging RGB channels
 */
function toGrayscale(pixelData: Buffer): Buffer {
  const result = Buffer.from(pixelData);
  for (let i = 0; i < result.length; i += 4) {
    const avg = Math.round((result[i] + result[i + 1] + result[i + 2]) / 3);
    result[i] = avg; // R
    result[i + 1] = avg; // G
    result[i + 2] = avg; // B
    // Keep alpha unchanged: result[i + 3]
  }
  return result;
}
```

Unlike compressed formats like PNG or JPEG, raw data export from CE.SDK provides the pixel buffer without encoding overhead, making it ideal for headless server applications, batch processing, and scenarios where you need to manipulate individual pixels programmatically.

This guide covers exporting CE.SDK designs to raw data, processing pixels with custom algorithms, and integrating with image processing libraries like Sharp.

## When to Use Raw Data Export

Raw pixel data export provides direct access to uncompressed RGBA bytes from CE.SDK in Node.js, giving you complete control over individual pixels for server-side processing workflows.

Use raw data export when you need pixel-level access to exported designs for custom algorithms, integrations, or batch processing. For standard image storage or transfer, use PNG or JPEG exports instead, as they provide compression and are universally supported.

## Understanding Raw Data Format

When you export with `mimeType: 'application/octet-stream'`, CE.SDK returns a Blob containing uncompressed RGBA pixel data. The format is straightforward:

- **4 bytes per pixel** representing Red, Green, Blue, and Alpha channels
- **Values from 0-255** for each channel (8-bit unsigned integers)
- **Row-major order** with pixels arranged left-to-right, top-to-bottom
- **Total size** equals width × height × 4 bytes

## How to Export Raw Data

To export a block as raw pixel data in Node.js, use the `engine.block.export()` method with `mimeType: 'application/octet-stream'`:

```typescript highlight-export-to-raw-data
  // Export to raw pixel data
  const width = Math.floor(engine.block.getWidth(imageBlock));
  const height = Math.floor(engine.block.getHeight(imageBlock));

  const blob = await engine.block.export(imageBlock, {
    mimeType: 'application/octet-stream',
    targetWidth: width,
    targetHeight: height,
  });

  // Convert blob to Buffer for Node.js processing
  const arrayBuffer = await blob.arrayBuffer();
  const pixelData = Buffer.from(arrayBuffer);

  // eslint-disable-next-line no-console
  console.log(`✓ Exported ${pixelData.length} bytes (${width}x${height} RGBA)`);
```

This returns a Blob containing uncompressed RGBA pixel data that you can process with custom algorithms.

## Download Exported Data

After exporting to raw data and processing the pixels, you can save the result to the file system using Node.js file operations:

```typescript highlight-save-raw-data
  // Save processed raw data to file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(`${outputDir}/raw-data.bin`, processedData);

  // eslint-disable-next-line no-console
  console.log(`✓ Saved raw data to ${outputDir}/raw-data.bin`);
```

For production use, you'll typically convert the raw pixel data to a standard image format using libraries like Sharp for efficient storage and delivery.

## Performance Considerations

Raw data export from CE.SDK involves trade-offs between flexibility and efficiency in server environments:

### Memory Usage

Raw RGBA data requires 4 bytes per pixel. A 1920×1080 CE.SDK export uses approximately 8.3 MB uncompressed, compared to 1-3 MB for PNG. In server environments with limited memory, reduce export resolution using `targetWidth` and `targetHeight` export options:

```typescript
const blob = await engine.block.export(blockId, {
  mimeType: 'application/octet-stream',
  targetWidth: 960,
  targetHeight: 540
});
```

Check the maximum export size before exporting large CE.SDK designs:

```typescript
const maxSize = engine.editor.getMaxExportSize();
console.log(`Maximum export size: ${maxSize} pixels`);
```

### When to Use Raw vs. Compressed for CE.SDK Exports

- **Use raw data** if you need custom post-processing on CE.SDK exports before delivery
- **Use PNG or JPEG** if you're just saving CE.SDK designs to disk
- **Use raw data** for intermediate processing steps in automated pipelines
- **Use compressed formats** for final output or network transfer
- **Consider Sharp** for high-performance transformations instead of manual pixel manipulation

## Cleanup

Always dispose of the engine to free resources when you're done processing.

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

This ensures all resources are properly cleaned up, preventing memory leaks in long-running server applications.

## API Reference

| Method                     | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `CreativeEngine.init()`    | Initializes the headless CE.SDK engine for server-side rendering |
| `engine.block.export()`    | Exports a CE.SDK block with `mimeType: 'application/octet-stream'` for raw RGBA data |
| `engine.block.getWidth()`  | Returns the width of a CE.SDK block in pixels            |
| `engine.block.getHeight()` | Returns the height of a CE.SDK block in pixels           |
| `Blob.arrayBuffer()`       | Converts the blob to an ArrayBuffer for raw data access   |
| `Buffer.from()`            | Creates a Node.js Buffer from an ArrayBuffer              |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support