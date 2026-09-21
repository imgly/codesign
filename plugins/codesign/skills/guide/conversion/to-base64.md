> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Conversion](./conversion.md) > [To Base64](./conversion/to-base64.md)

---

Convert CE.SDK exports to Base64-encoded strings for storing in databases, transmitting via APIs, or embedding in HTML templates.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-conversion-to-base64-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-conversion-to-base64-server-js)

Base64 encoding transforms binary image data into ASCII text, enabling you to store images in text-only databases, transmit them through JSON APIs, or embed them in HTML email templates.

```typescript file=@cesdk_web_examples/guides-conversion-to-base64-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

const OUTPUT_DIR = './output';

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
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
  let done = showProgress('Loading scene...');
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  done();

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  console.log('\n┌───────────────────────────────────┐');
  console.log('│   Convert to Base64               │');
  console.log('├───────────────────────────────────┤');
  console.log('│   Scene loaded successfully.      │');
  console.log('│   Ready to export as PNG Base64.  │');
  console.log('└───────────────────────────────────┘\n');

  const confirm = await prompt('Export to Base64? (y/n): ');
  if (confirm !== 'y' && confirm !== 'yes') {
    console.log('\nExport cancelled.\n');
    process.exit(0);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  done = showProgress('Exporting to Base64...');

  const blob = await engine.block.export(page, {
    mimeType: 'image/png'
  });

  done();

  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = buffer.toString('base64');
  const dataUri = `data:${blob.type};base64,${base64}`;

  writeFileSync(`${OUTPUT_DIR}/export.png`, buffer);
  writeFileSync(`${OUTPUT_DIR}/base64.txt`, dataUri);

  console.log(`\n✓ Saved: ${OUTPUT_DIR}/export.png`);
  console.log(`✓ Saved: ${OUTPUT_DIR}/base64.txt`);
  console.log(`  Binary: ${(blob.size / 1024).toFixed(1)} KB`);
  console.log(
    `  Base64: ${(dataUri.length / 1024).toFixed(1)} KB (~33% overhead)\n`
  );
} finally {
  engine.dispose();
}
```

## Export a Block to Base64

Use `engine.block.export()` to export a design block as a Blob, then convert it to a Base64 string.

```typescript
const page = engine.block.findByType('page')[0];
const blob = await engine.block.export(page, {
  mimeType: 'image/png'
});
```

The export returns a Blob containing the rendered image. You then convert this Blob to a Base64 string using Node.js Buffer APIs.

## Convert Blob to Base64

Convert the exported Blob into a Base64 data URI using Node.js `Buffer` API.

```typescript highlight=highlight-convert-base64
const buffer = Buffer.from(await blob.arrayBuffer());
const base64 = buffer.toString('base64');
const dataUri = `data:${blob.type};base64,${base64}`;
```

The `toString('base64')` method encodes the buffer contents. Prepending the MIME type prefix (`data:image/png;base64,...`) creates a complete data URI ready for storage or transmission.

## Save to File System

Write both the binary image and Base64 text to the output directory.

```typescript highlight=highlight-save-file
writeFileSync(`${OUTPUT_DIR}/export.png`, buffer);
writeFileSync(`${OUTPUT_DIR}/base64.txt`, dataUri);
```

Saving both formats lets you compare file sizes and verify the Base64 encoding. The binary file is useful for visual inspection.

## When to Use Base64

Base64 encoding works well for:

- Storing images in text-only databases like Redis or document stores
- Transmitting images through JSON APIs that don't support binary data
- Embedding images in HTML email templates
- Caching image data as strings in configuration files

> **Note:** Base64 increases file size by approximately 33%. For images larger than 100KB, consider binary storage or direct URL references instead.

## Troubleshooting

**Base64 string too long** — Use JPEG or WebP formats with lower quality settings. Reduce dimensions with `targetWidth` and `targetHeight` export options.

**Memory issues with large images** — Process images sequentially rather than in parallel. For very large exports, consider streaming approaches.

**Corrupted output** — Ensure the Buffer is created from the complete ArrayBuffer before encoding. Verify the Blob is fully loaded before conversion.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.export(block, options)` | Export a block to a Blob with format options (`mimeType`, `jpegQuality`, `webpQuality`, `targetWidth`, `targetHeight`) |
| `engine.block.findByType(type)` | Find all blocks of a specific type |
| `engine.scene.load(url)` | Load a scene from a remote URL |
| `Buffer.from(arrayBuffer)` | Create a Buffer from ArrayBuffer (Node.js) |
| `buffer.toString('base64')` | Encode Buffer as Base64 string (Node.js) |

## Next Steps

- [Export Options](./export-save-publish/export/overview.md) — Explore all available export formats and configuration
- [Export to PDF](./export-save-publish/export/to-pdf.md) — Generate PDFs for print and document workflows
- [Partial Export](./export-save-publish/export/partial-export.md) — Export specific regions or individual elements
- [Size Limits](./export-save-publish/export/size-limits.md) — Handle large exports and memory constraints



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support