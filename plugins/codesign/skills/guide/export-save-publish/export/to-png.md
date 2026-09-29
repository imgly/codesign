> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To PNG](./export-save-publish/export/to-png.md) > [Conversion](./conversion.md) > [To PNG](./export-save-publish/export/to-png.md)

---

Export your designs as PNG images with full transparency support and configurable compression.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-to-png-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-png-server-js)

PNG (Portable Network Graphics) provides lossless compression with full alpha channel support. It's ideal for web graphics, UI elements, and content requiring crisp edges or transparency.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-png-server-js/server-js.ts reference-only
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

// Display export options menu
console.log('=== PNG Export Options ===\n');
console.log('1. Default PNG (balanced compression)');
console.log('2. Maximum compression (smaller file)');
console.log('3. HD export (1920x1080)');
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
  if (!page) throw new Error('No page found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design.png`, buffer);
    console.log(
      `✓ Default PNG: ${outputDir}/design.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-compressed.png`, buffer);
    console.log(
      `✓ Compressed PNG: ${outputDir}/design-compressed.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-hd.png`, buffer);
    console.log(
      `✓ HD PNG: ${outputDir}/design-hd.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
```

This guide covers exporting designs to PNG, configuring compression, controlling output dimensions, and saving exports to the file system.

## Export to PNG

Call `engine.block.export()` with `mimeType: 'image/png'` to export any block as a PNG image. The method returns a Blob containing the image data.

```typescript highlight=highlight-export-png
const blob = await engine.block.export(page, {
  mimeType: 'image/png'
});
```

Pass the page ID from `engine.block.findByType('page')[0]` or any block ID to export specific elements.

## Export Options

PNG export supports several configuration options for compression, dimensions, and text rendering.

### Compression Level

The `pngCompressionLevel` option (0-9) controls file size vs. encoding speed. Higher values produce smaller files but take longer to encode. PNG compression is lossless, so quality remains unchanged.

```typescript highlight=highlight-compression
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 9
});
```

- **0**: No compression, fastest encoding
- **5**: Balanced (default)
- **9**: Maximum compression, slowest encoding

### Target Dimensions

Use `targetWidth` and `targetHeight` together to export at specific dimensions. The block renders large enough to fill the target size while maintaining aspect ratio.

```typescript highlight=highlight-target-size
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1920,
  targetHeight: 1080
});
```

If the target aspect ratio differs from the block's aspect ratio, the output extends beyond the target on one axis to preserve proportions.

### All PNG Export Options

- **`mimeType`** (`'image/png'`): Output format. Defaults to `'image/png'`.
- **`pngCompressionLevel`** (`number`): Compression level from 0-9. Higher values produce smaller files but take longer. Quality is unaffected. Defaults to `5`.
- **`targetWidth`** (`number`): Target output width in pixels. Must be used with `targetHeight`.
- **`targetHeight`** (`number`): Target output height in pixels. Must be used with `targetWidth`.
- **`allowTextOverhang`** (`boolean`): When `true`, text blocks with glyphs that extend beyond their frame (e.g., decorative fonts with swashes) export with full glyph bounds visible. Defaults to `false`.
- **`abortSignal`** (`AbortSignal`): Signal to cancel the export operation.

## Save to File System

After exporting, convert the Blob to a Buffer and write to the file system. Create the output directory if it doesn't exist.

```typescript
const blob = await engine.block.export(page, {
  mimeType: 'image/png'
});

const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output/design.png', buffer);
```

This pattern works for all export formats. Adjust the filename extension to match the exported format.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block as PNG with format and quality options |
| `engine.block.findByType('page')` | Find all pages in the current scene |
| `engine.dispose()` | Clean up engine resources when done |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export Size Limits](./export-save-publish/export/size-limits.md) - Check device limits before exporting large designs
- [Export with Color Mask](./export-save-publish/export/with-color-mask.md) - Remove specific colors and generate alpha masks
- [Partial Export](./export-save-publish/export/partial-export.md) - Export specific blocks or regions



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support