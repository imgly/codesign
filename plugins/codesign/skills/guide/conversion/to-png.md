> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Export designs to PNG format with lossless quality and optional transparency support.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-conversion-to-png-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-conversion-to-png-server-js)

PNG is a lossless image format that preserves image quality and supports transparency. It's ideal for designs requiring pixel-perfect fidelity, logos, graphics with transparent backgrounds, and any content where quality cannot be compromised.

```typescript file=@cesdk_web_examples/guides-conversion-to-png-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Convert to PNG
 *
 * This example demonstrates:
 * - Exporting programmatically with the engine API
 * - All available PNG export options
 * - Saving exported files to disk
 */

// Interactive menu to select which exports to run
async function selectExports(): Promise<string[]> {
  const options = [
    { key: '1', name: 'basic', label: 'Basic PNG export' },
    { key: '2', name: 'compressed', label: 'Compressed PNG (level 9)' },
    { key: '3', name: 'dimensions', label: 'HD PNG (1920x1080)' }
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log(
      '\nSelect exports to run (comma-separated, or press Enter for all):'
    );
    options.forEach((opt) => console.log(`  ${opt.key}. ${opt.label}`));

    rl.question('\nYour choice: ', (answer) => {
      rl.close();

      if (!answer.trim()) {
        // Default: run all exports
        resolve(options.map((opt) => opt.name));
        return;
      }

      const selected = answer
        .split(',')
        .map((s) => s.trim())
        .map((key) => options.find((opt) => opt.key === key)?.name)
        .filter((name): name is string => name !== undefined);

      resolve(selected.length > 0 ? selected : options.map((opt) => opt.name));
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

  // Get the first page
  const page = engine.block.findByType('page')[0];
  if (page == null) {
    throw new Error('No page found');
  }

  // Select which exports to run
  const selectedExports = await selectExports();
  const blobs: { name: string; blob: Blob }[] = [];

  if (selectedExports.includes('basic')) {
    console.log('Exporting design.png...');
    // Export a block to PNG
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    blobs.push({ name: 'design.png', blob });
  }

  if (selectedExports.includes('compressed')) {
    console.log('Exporting design-compressed.png...');
    // Export with compression level (0-9)
    // Higher values produce smaller files but take longer
    // Quality is not affected since PNG is lossless
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9 // Maximum compression
    });

    blobs.push({ name: 'design-compressed.png', blob });
  }

  if (selectedExports.includes('dimensions')) {
    console.log('Exporting design-hd.png...');
    // Export with target dimensions
    // The block scales to fill the target while maintaining aspect ratio
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    blobs.push({ name: 'design-hd.png', blob });
  }

  // Save exported blobs to disk
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const { name, blob } of blobs) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${name}`, buffer);
    console.log(`✓ Exported ${name} (${(blob.size / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n✓ Exported ${blobs.length} PNG file(s) to ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to export designs to PNG and configure export options.

## Export to PNG

Use `engine.block.export()` to export a design block to PNG. The method returns a Blob containing the image data.

```typescript highlight=highlight-export-programmatic
// Export a block to PNG
const blob = await engine.block.export(page, {
  mimeType: 'image/png'
});
```

## Compression Level

Control the file size versus export speed tradeoff using `pngCompressionLevel`. Valid values are 0-9, where higher values produce smaller files but take longer to export. Since PNG is lossless, image quality remains unchanged.

```typescript highlight=highlight-options-compression
// Export with compression level (0-9)
// Higher values produce smaller files but take longer
// Quality is not affected since PNG is lossless
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 9 // Maximum compression
});
```

The default compression level is 5, providing a good balance between file size and export speed.

## Target Dimensions

Resize the output by setting `targetWidth` and `targetHeight`. The block scales to fill the target dimensions while maintaining its aspect ratio.

```typescript highlight=highlight-options-dimensions
// Export with target dimensions
// The block scales to fill the target while maintaining aspect ratio
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1920,
  targetHeight: 1080
});
```

## Save to Disk

Convert the exported Blob to a Buffer and write it to the file system.

```typescript highlight=highlight-save-to-disk
  // Save exported blobs to disk
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const { name, blob } of blobs) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${name}`, buffer);
    console.log(`✓ Exported ${name} (${(blob.size / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n✓ Exported ${blobs.length} PNG file(s) to ${outputDir}/`);
```

## Cleanup

Always dispose the engine when finished to free resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## API Reference

| API | Description |
| --- | --- |
| `engine.block.export(block, options)` | Exports a block to a Blob with the specified options |
| `engine.scene.getPages()` | Returns an array of all page block IDs |
| `engine.dispose()` | Disposes the engine and frees resources |

## Next Steps

- [Conversion Overview](./conversion/overview.md) - Learn about other export formats
- [Export Overview](./export-save-publish/export/overview.md) - Understand the full export workflow
- [To PDF](./export-save-publish/export/to-pdf.md) - Export designs to PDF format



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support