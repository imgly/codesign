> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Compress](./export-save-publish/export/compress.md)

---

Reduce file sizes when exporting images by configuring compression and quality settings for PNG, JPEG, and WebP formats.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-compress-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-compress-server-js)

Image compression reduces file sizes while maintaining acceptable visual quality. CE.SDK supports format-specific compression controls: lossless compression for PNG, lossy quality settings for JPEG, and both modes for WebP.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-compress-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

config();

function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Display export options menu
console.log('=== Compression Export Options ===\n');
console.log('1. PNG with compression levels');
console.log('2. JPEG with quality settings');
console.log('3. WebP with quality settings');
console.log('4. All formats\n');

const choice = (await prompt('Select export option (1-4): ')) || '4';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (page == null) throw new Error('No page found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '4') {
    const pngBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9
    });
    const buffer = Buffer.from(await pngBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.png`, buffer);
    console.log(
      `✓ PNG (level 9): ${outputDir}/compressed.png (${(pngBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '4') {
    const jpegBlob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      jpegQuality: 0.8
    });
    const buffer = Buffer.from(await jpegBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.jpg`, buffer);
    console.log(
      `✓ JPEG (quality 0.8): ${outputDir}/compressed.jpg (${(jpegBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '4') {
    const webpBlob = await engine.block.export(page, {
      mimeType: 'image/webp',
      webpQuality: 0.8
    });
    const buffer = Buffer.from(await webpBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.webp`, buffer);
    console.log(
      `✓ WebP (quality 0.8): ${outputDir}/compressed.webp (${(webpBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4') {
    const scaledBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1200,
      targetHeight: 630
    });
    const buffer = Buffer.from(await scaledBlob.arrayBuffer());
    writeFileSync(`${outputDir}/scaled.png`, buffer);
    console.log(
      `✓ Scaled (1200x630): ${outputDir}/scaled.png (${(scaledBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
```

This guide covers exporting with compression settings, configuring quality levels, and controlling output dimensions.

## Export with Compression

Call `engine.block.export()` with format-specific compression options. Each format uses different parameters to control file size and quality.

### PNG Compression

PNG uses lossless compression controlled by `pngCompressionLevel` (0-9). Higher values produce smaller files but take longer to encode. Quality remains identical at all levels.

```typescript highlight=highlight-png-compression
const pngBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 9
});
```

Use level 5-6 for balanced results, or level 9 when file size is critical and encoding time is acceptable.

### JPEG Quality

JPEG uses lossy compression controlled by `jpegQuality` (0-1). Lower values produce smaller files with more visible artifacts.

```typescript highlight=highlight-jpeg-quality
const jpegBlob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.8
});
```

Quality 0.8 provides a good balance for web delivery. Use 0.9+ for archival or print workflows.

### WebP Quality

WebP supports both lossless and lossy modes via `webpQuality` (0-1). At 1.0, WebP uses lossless encoding. Values below 1.0 enable lossy compression.

```typescript highlight=highlight-webp-quality
const webpBlob = await engine.block.export(page, {
  mimeType: 'image/webp',
  webpQuality: 0.8
});
```

WebP typically produces 20-30% smaller files than JPEG at equivalent quality, with optional transparency support.

## Export Options

All image exports support these compression-related options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `pngCompressionLevel` | `number` | `5` | PNG compression level 0-9. Higher values produce smaller files but take longer. Quality is unaffected. |
| `jpegQuality` | `number` | `0.9` | JPEG quality from >0 to 1. Higher values preserve more detail. |
| `webpQuality` | `number` | `1.0` | WebP quality from >0 to 1. Value of 1.0 enables lossless mode. |
| `pdfImageQuality` | `number` | `1.0` | Quality from >0 to 1 for images that have to be rasterized during PDF export. Value of 1.0 keeps lossless encoding, lower values use lossy JPEG. |
| `targetWidth` | `number` | — | Target output width in pixels. Must be used with `targetHeight`. |
| `targetHeight` | `number` | — | Target output height in pixels. Must be used with `targetWidth`. |
| `abortSignal` | `AbortSignal` | — | Signal to cancel the export operation. |

### Target Dimensions

Use `targetWidth` and `targetHeight` together to export at specific dimensions. The block renders large enough to fill the target size while maintaining aspect ratio.

```typescript highlight=highlight-target-size
const scaledBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1200,
  targetHeight: 630
});
```

Combining dimension scaling with compression produces smaller files suitable for specific platforms like social media thumbnails.

## Save to File System

After exporting, convert the Blob to a Buffer and write to the file system.

```typescript
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 9
});

const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output/compressed.png', buffer);
```

Create the output directory if it doesn't exist before writing files.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block with compression and format options |
| `engine.block.findByType('page')` | Find all pages in the current scene |
| `engine.scene.load(url)` | Load a scene from a remote URL |
| `engine.dispose()` | Clean up engine resources when done |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export to PNG](./export-save-publish/export/to-png.md) - Full PNG export options and transparency handling
- [Export to JPEG](./export-save-publish/export/to-jpeg.md) - JPEG-specific options for photographs
- [Export to WebP](./export-save-publish/export/to-webp.md) - WebP format with lossless and lossy modes



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support