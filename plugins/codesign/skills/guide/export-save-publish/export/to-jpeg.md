> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To JPEG](./export-save-publish/export/to-jpeg.md)

---

Export CE.SDK designs to JPEG format—ideal for photographs, social media, and web content where file size matters more than transparency.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-to-jpeg-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-jpeg-server-js)

JPEG uses lossy compression optimized for photographs and smooth color gradients. Unlike PNG, JPEG does not support transparency—transparent areas render with a solid background.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-jpeg-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

const OUTPUT_DIR = './output';

async function promptChoice(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n┌───────────────────────────────────┐');
  console.log('│   JPEG Export Options             │');
  console.log('├───────────────────────────────────┤');
  console.log('│   1. Standard (quality: 0.9)      │');
  console.log('│   2. High Quality (quality: 1.0)  │');
  console.log('│   3. HD (1920×1080)               │');
  console.log('└───────────────────────────────────┘\n');

  return new Promise((resolve) => {
    rl.question('Select option (1-3): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function showProgress(msg: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write(`${frames[0]} ${msg}`);
  const id = setInterval(() => {
    i = (i + 1) % frames.length;
    process.stdout.write(`\r${frames[i]} ${msg}`);
  }, 80);
  return () => {
    clearInterval(id);
    process.stdout.write(`\r✓ ${msg}\n`);
  };
}

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  const choice = await promptChoice();

  let done = showProgress('Loading scene...');
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  done();

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  done = showProgress('Exporting JPEG...');

  let blob: Blob;
  let filename: string;

  switch (choice) {
    case '2':
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 1.0
      });
      filename = 'high-quality.jpg';
      break;

    case '3':
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        targetWidth: 1920,
        targetHeight: 1080
      });
      filename = 'hd-1920x1080.jpg';
      break;

    default:
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      filename = 'standard.jpg';
  }

  done();

  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${OUTPUT_DIR}/${filename}`, buffer);

  console.log(`\n✓ Saved: ${OUTPUT_DIR}/${filename}`);
  console.log(`  Size: ${(blob.size / 1024).toFixed(1)} KB\n`);
} finally {
  engine.dispose();
}
```

This guide covers exporting to JPEG, configuring quality and dimensions, and saving exports to the file system.

## Export to JPEG

Export a design block to JPEG by calling `engine.block.export()` with `mimeType: 'image/jpeg'`. Convert the blob to a buffer and write to disk.

```typescript highlight=highlight-export-jpeg
blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.9
});
```

The `jpegQuality` parameter accepts values from greater than 0 to 1. Higher values produce better quality at larger file sizes. The default is 0.9.

## Export Options

JPEG export supports these configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mimeType` | `string` | `'image/png'` | Set to `'image/jpeg'` for JPEG |
| `jpegQuality` | `number` | `0.9` | Quality from >0 to 1 |
| `targetWidth` | `number` | — | Output width in pixels |
| `targetHeight` | `number` | — | Output height in pixels |

### Quality Control

Set `jpegQuality` to 1.0 for maximum quality with minimal compression artifacts. This is useful for archival or print preparation.

```typescript highlight=highlight-export-quality
blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 1.0
});
```

For web delivery, values around 0.8 balance quality and file size effectively.

### Target Dimensions

Specify `targetWidth` and `targetHeight` to export at exact dimensions. The output fills the target size while maintaining aspect ratio.

```typescript highlight=highlight-export-size
blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 1920,
  targetHeight: 1080
});
```

## Save to File System

Convert the exported blob to a buffer and write it to disk using Node.js file system APIs.

```typescript highlight=highlight-save-file
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync(`${OUTPUT_DIR}/${filename}`, buffer);
```

## When to Use JPEG

JPEG works well for:

- Photographs and images with gradual color transitions
- Social media posts and web content
- Scenarios where file size matters more than perfect quality

> **Note:** For graphics with sharp edges, text, or transparency, use PNG instead. For modern web delivery with better compression, consider WebP.

## Troubleshooting

**Output looks blurry** — Increase `jpegQuality` toward 1.0, or use PNG for graphics with hard edges.

**File size too large** — Decrease `jpegQuality` to 0.7–0.8, or reduce dimensions with `targetWidth` and `targetHeight`.

**Unexpected background** — JPEG does not support transparency. Use PNG or WebP for transparent content.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.export(block, options)` | Export a block to the specified format |
| `engine.scene.load(url)` | Load a scene from a remote URL |
| `engine.block.findByType(type)` | Find all blocks of a specific type |
| `writeFileSync(path, buffer)` | Write buffer to file system (Node.js) |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) — Compare all available export formats
- [Export to PDF](./export-save-publish/export/to-pdf.md) — Export for print and document workflows
- [Partial Export](./export-save-publish/export/partial-export.md) — Export specific regions or elements
- [Size Limits](./export-save-publish/export/size-limits.md) — Handle large exports and memory constraints



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support