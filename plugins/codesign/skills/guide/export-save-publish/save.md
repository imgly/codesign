> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Save](./export-save-publish/save.md)

---

Save and serialize designs in CE.SDK for later retrieval, sharing, or storage using string or archive formats.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

CE.SDK provides two formats for persisting designs. Choose the format based on your storage and portability requirements.

```typescript file=@cesdk_web_examples/guides-export-save-publish-save-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { CompressionFormat, CompressionLevel } from '@cesdk/node';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';
import path from 'path';

config();

/**
 * CE.SDK Server Guide: Save Designs
 *
 * Demonstrates how to save and serialize designs:
 * - Saving scenes to string format for database storage
 * - Saving scenes to archive format with embedded assets
 * - Loading saved content back into the engine
 */

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

console.log('\n=== CE.SDK Save Designs ===\n');
console.log('Select save format:');
console.log('  1. String (for database storage)');
console.log('  2. Archive (self-contained ZIP)');
console.log('  3. Both formats\n');

const choice = await prompt('Enter choice (1/2/3): ');

const saveString =
  choice === '1' || choice === '3' || !['1', '2', '3'].includes(choice);
const saveArchive =
  choice === '2' || choice === '3' || !['1', '2', '3'].includes(choice);

if (!['1', '2', '3'].includes(choice)) {
  console.log('Invalid choice. Defaulting to both formats.\n');
}

console.log('⏳ Initializing Creative Engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});

try {
  console.log('⏳ Loading template scene...');

  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.scene.getCurrentPage();
  if (page == null) {
    throw new Error('No page found in scene');
  }

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('✅ Scene loaded\n');

  if (saveString) {
    console.log('⏳ Saving to string...');
    const sceneString = await engine.scene.saveToString();
    // Persist saved scenes with the `.imgly` extension
    writeFileSync(`${outputDir}/scene.imgly`, sceneString);
    console.log(
      `✅ Scene saved: output/scene.imgly (${(sceneString.length / 1024).toFixed(1)} KB)`
    );

    // Example: Save with compression (requires local build)
    // To run with compression: npm run dev:local
    const compressed = await engine.scene.saveToString({
      compression: {
        format: CompressionFormat.Zstd,
        level: CompressionLevel.Default
      }
    });
    writeFileSync(`${outputDir}/scene-compressed.imgly`, compressed);
    console.log(
      `✅ Compressed scene saved: output/scene-compressed.imgly (${(compressed.length / 1024).toFixed(1)} KB, ${((1 - compressed.length / sceneString.length) * 100).toFixed(1)}% smaller)`
    );
  }

  if (saveArchive) {
    console.log('⏳ Saving to archive...');
    const archiveBlob = await engine.scene.saveToArchive();

    // Compress the scene inside the archive. Bundled media is left as-is,
    // because images, video and fonts already are compressed formats.
    const compressedArchiveBlob = await engine.scene.saveToArchive({
      compression: {
        format: CompressionFormat.Zstd,
        level: CompressionLevel.Default
      }
    });
    writeFileSync(
      `${outputDir}/scene-archive-compressed.imgly`,
      Buffer.from(await compressedArchiveBlob.arrayBuffer())
    );
    // Persist saved archives with the `.imgly` extension
    const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
    writeFileSync(`${outputDir}/scene-archive.imgly`, archiveBuffer);
    console.log(
      `✅ Archive saved: output/scene-archive.imgly (${(archiveBuffer.length / 1024).toFixed(1)} KB)`
    );
  }

  if (saveString) {
    console.log('\n⏳ Loading from saved scene file...');
    const sceneString = readFileSync(`${outputDir}/scene.imgly`, 'utf-8');
    await engine.scene.load(sceneString);
    console.log('✅ Scene loaded from file');
  }

  if (saveArchive) {
    console.log('⏳ Loading from saved archive...');
    const archivePath = path.resolve(`${outputDir}/scene-archive.imgly`);
    const archiveFileUrl = `file://${archivePath}`;
    await engine.scene.load(archiveFileUrl);
    console.log('✅ Scene loaded from archive');
  }

  console.log('\n🎉 Complete! Files saved to:', outputDir);
} finally {
  engine.dispose();
}
```

## Save Format Comparison

| Format | Method | Assets | Best For |
| ------ | ------ | ------ | -------- |
| String | `saveToString()` | Referenced by URL | Database storage, cloud sync |
| Archive | `saveToArchive()` | Embedded in ZIP | Offline use, file sharing |

**String format** produces a lightweight Base64-encoded string where assets remain as URL references. Use this when asset URLs will remain accessible.

**Archive format** creates a self-contained ZIP with all assets embedded. Use this for portable designs that work offline.

Both formats are saved as `.imgly` files — use this extension when persisting them. Either kind loads back through the same `engine.scene.load()` call, which detects the format automatically; `.scene` and `.zip` files also load.

## Save to String

Serialize the current scene to a Base64-encoded string suitable for database storage.

```typescript highlight=highlight-save-to-string
const sceneString = await engine.scene.saveToString();
```

The string contains the complete scene structure but references assets by their original URLs.

## Save to Archive

Create a self-contained ZIP file with the scene and all embedded assets.

```typescript highlight=highlight-save-to-archive
const archiveBlob = await engine.scene.saveToArchive();
```

The archive includes all pages, elements, and asset data in a single portable file.

## Compression Options

Saved scenes are compressed with Zstd by default, which makes them much smaller and
speeds up both saving and loading. Pass a format explicitly to change the level, or to turn
compression off.

```typescript highlight=highlight-save-with-compression
const compressed = await engine.scene.saveToString({
  compression: {
    format: CompressionFormat.Zstd,
    level: CompressionLevel.Default
  }
});
```

An archive can compress its scene the same way. Bundled images, video and fonts are stored as they are, because they already are compressed formats.

```typescript highlight=highlight-save-archive-with-compression
const compressedArchiveBlob = await engine.scene.saveToArchive({
  compression: {
    format: CompressionFormat.Zstd,
    level: CompressionLevel.Default
  }
});
```

**Compression Formats:**

- `CompressionFormat.Zstd` - Zstd compression (default)
- `CompressionFormat.None` - No compression

**Compression Levels:**

- `CompressionLevel.Fastest` - Fastest compression, larger output
- `CompressionLevel.Default` - Balanced speed and size (recommended)
- `CompressionLevel.Best` - Best compression, noticeably slower

A compressed scene string stays a plain string, so you can still store it in a text column or send it as JSON. It carries a `UBQ2` prefix instead of `UBQ1`; `load` accepts both.

## Write to File System

Use Node.js `writeFileSync` to persist saved designs to the file system.

Scene strings can be written directly as text:

```typescript highlight=highlight-write-scene
// Persist saved scenes with the `.imgly` extension
writeFileSync(`${outputDir}/scene.imgly`, sceneString);
```

For archives, convert the Blob to a Buffer before writing:

```typescript highlight=highlight-write-archive
// Persist saved archives with the `.imgly` extension
const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
writeFileSync(`${outputDir}/scene-archive.imgly`, archiveBuffer);
```

## Load Scene from File

Read a previously saved `.imgly` scene file from disk and restore it to the engine.

```typescript highlight=highlight-load-scene
const sceneString = readFileSync(`${outputDir}/scene.imgly`, 'utf-8');
await engine.scene.load(sceneString);
```

Scene files are lightweight but require the original asset URLs to remain accessible.

## Load Archive from File

Read a self-contained `.imgly` archive from disk with all embedded assets.

```typescript highlight=highlight-load-archive
const archivePath = path.resolve(`${outputDir}/scene-archive.imgly`);
const archiveFileUrl = `file://${archivePath}`;
await engine.scene.load(archiveFileUrl);
```

Archives are portable and work offline since all assets are bundled within the file.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.saveToString()` | Serialize scene to Base64 string |
| `engine.scene.saveToArchive()` | Save scene with assets as ZIP blob |
| `engine.scene.load()` | Load scene or archive from URL or string |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Export designs to image, PDF, and video formats
- [Load Scene](./open-the-editor/load-scene.md) - Load scenes from remote URLs and archives
- [Store Custom Metadata](./export-save-publish/store-custom-metadata.md) - Attach metadata like tags or version info to designs
- [Partial Export](./export-save-publish/export/partial-export.md) - Export individual blocks or selections



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support