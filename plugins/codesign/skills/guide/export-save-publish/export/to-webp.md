> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To WebP](./export-save-publish/export/to-webp.md)

---

Export designs to WebP format for optimized web delivery with smaller file sizes than PNG or JPEG.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-to-webp-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-webp-server-js)

WebP delivers smaller file sizes than PNG and JPEG while preserving image quality and transparency support. This makes it ideal for server-side processing where bandwidth and storage costs matter.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-webp-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

/**
 * CE.SDK Server Guide: Export to WebP
 *
 * Demonstrates:
 * - Interactive format selection
 * - Export with quality options
 * - Loading indicators
 * - Saving to output directory
 */

// Prompt user for input
async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Loading spinner
function showLoading(message: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${message}`);
  }, 80);
  return () => {
    clearInterval(interval);
    process.stdout.write('\r');
  };
}

// Display format options
console.log('\n🖼️  CE.SDK WebP Export\n');
console.log('Select export quality:');
console.log('  1. Lossy (0.8) - Smaller file, good quality');
console.log('  2. High (0.95) - Balanced quality and size');
console.log('  3. Lossless (1.0) - Perfect quality, larger file\n');

const choice = await prompt('Enter choice (1-3): ');

const qualityMap: Record<string, { quality: number; name: string }> = {
  '1': { quality: 0.8, name: 'lossy' },
  '2': { quality: 0.95, name: 'high' },
  '3': { quality: 1.0, name: 'lossless' }
};

const selected = qualityMap[choice] || qualityMap['1'];
console.log(`\nSelected: ${selected.name} (quality: ${selected.quality})\n`);

// Initialize engine with loading indicator
const stopLoading = showLoading('Initializing CE.SDK engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

stopLoading();
console.log('✓ Engine initialized\n');

try {
  const stopSceneLoading = showLoading('Loading template...');
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  stopSceneLoading();
  console.log('✓ Template loaded\n');

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export to WebP with selected quality
  const stopExport = showLoading('Exporting to WebP...');
  const webpBlob = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: selected.quality
  });
  stopExport();

  // Save to output directory
  const buffer = Buffer.from(await webpBlob.arrayBuffer());
  const filename = `design-${selected.name}.webp`;
  writeFileSync(`${outputDir}/${filename}`, buffer);

  console.log(`✓ Exported: ${outputDir}/${filename}`);
  console.log(`  Size: ${(webpBlob.size / 1024).toFixed(1)} KB\n`);

  // Export with target dimensions
  const resizedBlob = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: selected.quality,
    targetWidth: 1200,
    targetHeight: 630
  });

  const resizedBuffer = Buffer.from(await resizedBlob.arrayBuffer());
  writeFileSync(`${outputDir}/design-resized.webp`, resizedBuffer);
  console.log(`✓ Exported: ${outputDir}/design-resized.webp (1200x630)`);
  console.log(`  Size: ${(resizedBlob.size / 1024).toFixed(1)} KB\n`);
} finally {
  engine.dispose();
}
```

This guide covers exporting to WebP, configuring quality settings, and saving files to disk.

## Export to WebP

Call `engine.block.export()` with `mimeType: 'image/webp'` and a `webpQuality` value between 0 and 1.

```typescript highlight=highlight-export-webp
// Export to WebP with selected quality
const stopExport = showLoading('Exporting to WebP...');
const webpBlob = await engine.block.export(page, {
  mimeType: 'image/webp',
  webpQuality: selected.quality
});
stopExport();
```

The `webpQuality` parameter controls compression. A value of 0.8 provides a good balance between file size and visual quality for most use cases.

## Export Options

WebP export supports these options:

| Option | Type | Description |
|--------|------|-------------|
| `mimeType` | `'image/webp'` | Required. Specifies WebP format |
| `webpQuality` | `number` | Quality from 0 to 1. Default 1.0 (lossless) |
| `targetWidth` | `number` | Optional resize width |
| `targetHeight` | `number` | Optional resize height |

Combine `targetWidth` and `targetHeight` to resize the output, useful for generating thumbnails or optimized versions.

```typescript highlight=highlight-export-options
// Export with target dimensions
const resizedBlob = await engine.block.export(page, {
  mimeType: 'image/webp',
  webpQuality: selected.quality,
  targetWidth: 1200,
  targetHeight: 630
});
```

Set `webpQuality` to 1.0 for lossless compression when pixel-perfect output is required.

## Save to File

Convert the exported blob to a buffer and write it to disk.

```typescript highlight=highlight-save-file
// Save to output directory
const buffer = Buffer.from(await webpBlob.arrayBuffer());
const filename = `design-${selected.name}.webp`;
writeFileSync(`${outputDir}/${filename}`, buffer);
```

The export returns a `Blob`. Convert it to an `ArrayBuffer`, then wrap in a `Buffer` for Node.js file system operations.

> **Note:** WebP is widely supported across platforms. For systems without WebP support, consider PNG or JPEG as fallback formats.

## API Reference

| API | Description |
|-----|-------------|
| `engine.block.export()` | Exports a block to an image blob with format and quality options |
| `writeFileSync()` | Node.js API to write buffer data to a file |
| `Buffer.from()` | Converts ArrayBuffer to Node.js Buffer for file operations |

## Next Steps

[Export Overview](./export-save-publish/export/overview.md) - Learn about all supported export formats and their options.

[Export to PDF](./export-save-publish/export/to-pdf.md) - Generate print-ready PDF documents from your designs.

[Size Limits](./export-save-publish/export/size-limits.md) - Understand export size constraints and optimization strategies.

[Partial Export](./export-save-publish/export/partial-export.md) - Export specific blocks or regions instead of the full design.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support