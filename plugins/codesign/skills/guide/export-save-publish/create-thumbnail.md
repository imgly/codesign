> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Create Thumbnail](./export-save-publish/create-thumbnail.md)

---

Generate thumbnail preview images from CE.SDK scenes by exporting with target dimensions for galleries and design management.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-create-thumbnail-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-create-thumbnail-server-js)

Thumbnails provide visual previews of designs without loading the full editor. Use `engine.block.export()` with `targetWidth` and `targetHeight` options to scale content while maintaining aspect ratio. Supported formats include PNG, JPEG, and WebP.

```typescript file=@cesdk_web_examples/guides-export-save-publish-create-thumbnail-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

config();

// Helper function to prompt for user input
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

// Display thumbnail options menu
console.log('=== Thumbnail Generation Options ===\n');
console.log('1. Small thumbnail (150×150 JPEG)');
console.log('2. Medium thumbnail (400×300 JPEG)');
console.log('3. PNG thumbnail (400×300)');
console.log('4. WebP thumbnail (400×300)');
console.log('5. All formats\n');

const choice = (await prompt('Select thumbnail option (1-5): ')) || '5';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Generating thumbnails...\n');

  if (choice === '1' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      targetWidth: 150,
      targetHeight: 150,
      jpegQuality: 0.8
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail-small.jpg`, buffer);
    console.log(
      `✓ Small thumbnail: ${outputDir}/thumbnail-small.jpg (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      targetWidth: 400,
      targetHeight: 300,
      jpegQuality: 0.85
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail-medium.jpg`, buffer);
    console.log(
      `✓ Medium thumbnail: ${outputDir}/thumbnail-medium.jpg (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 300,
      pngCompressionLevel: 6
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail.png`, buffer);
    console.log(
      `✓ PNG thumbnail: ${outputDir}/thumbnail.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/webp',
      targetWidth: 400,
      targetHeight: 300,
      webpQuality: 0.8
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail.webp`, buffer);
    console.log(
      `✓ WebP thumbnail: ${outputDir}/thumbnail.webp (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Thumbnail generation completed');
} finally {
  engine.dispose();
}
```

This guide covers exporting thumbnails at specific dimensions, choosing formats, optimizing quality and file size, and saving thumbnails to the file system.

To generate audio waveforms from a scene's audio, see [Thumbnail Previews](./export-save-publish/thumbnail-previews.md), which covers the streaming preview APIs.

## Export a Thumbnail

Call `engine.block.export()` with target dimensions to create a scaled thumbnail. Both `targetWidth` and `targetHeight` must be set together for scaling to work.

```typescript highlight=highlight-thumbnail-small
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 150,
  targetHeight: 150,
  jpegQuality: 0.8
});
```

The block renders large enough to fill the target size while maintaining aspect ratio. If aspect ratios differ, the output extends beyond the target on one axis.

## Choose Thumbnail Format

Select the format via the `mimeType` option based on your needs:

- **`'image/jpeg'`** — Smaller files, good for photos, no transparency
- **`'image/png'`** — Lossless quality, supports transparency
- **`'image/webp'`** — Best compression, modern browsers only

### JPEG Thumbnails

JPEG works well for photographic content. Control file size with `jpegQuality` (0-1, default 0.9). Values between 0.75-0.85 balance quality and size for thumbnails.

```typescript highlight=highlight-thumbnail-medium
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 400,
  targetHeight: 300,
  jpegQuality: 0.85
});
```

### PNG Thumbnails

PNG provides lossless quality with transparency support. Control encoding speed vs. file size with `pngCompressionLevel` (0-9, default 5).

```typescript highlight=highlight-thumbnail-png
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 400,
  targetHeight: 300,
  pngCompressionLevel: 6
});
```

### WebP Thumbnails

WebP offers the best compression for modern browsers. Control quality with `webpQuality` (0-1, default 1.0 for lossless).

```typescript highlight=highlight-thumbnail-webp
const blob = await engine.block.export(page, {
  mimeType: 'image/webp',
  targetWidth: 400,
  targetHeight: 300,
  webpQuality: 0.8
});
```

## Common Thumbnail Sizes

Standard sizes for different use cases:

| Size | Dimensions | Use Case |
| ---- | ---------- | -------- |
| Small | 150×150 | Grid galleries, file browsers |
| Medium | 400×300 | Preview panels, cards |
| Large | 800×600 | Full previews, detail views |

## Save to File System

After exporting, convert the Blob to a Buffer and write to the file system. Create the output directory if it doesn't exist.

```typescript
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 400,
  targetHeight: 300,
  jpegQuality: 0.8
});

const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output/thumbnail.jpg', buffer);
```

## Optimize Thumbnail Quality

Balance quality with file size using format-specific options:

| Format | Option | Range | Default | Notes |
| ------ | ------ | ----- | ------- | ----- |
| JPEG | `jpegQuality` | 0-1 | 0.9 | Lower = smaller files, visible artifacts |
| PNG | `pngCompressionLevel` | 0-9 | 5 | Higher = smaller files, slower encoding |
| WebP | `webpQuality` | 0-1 | 1.0 | 1.0 = lossless, lower = lossy compression |

For thumbnails, JPEG quality of 0.8 or WebP quality of 0.75-0.85 typically provides good results with small file sizes.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block as image with format and dimension options |
| `engine.block.findByType('page')` | Find all pages in the current scene |
| `engine.dispose()` | Clean up engine resources when done |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support