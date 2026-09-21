> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To PDF](./export-save-publish/export/to-pdf.md)

---

Export your designs as PDF documents with high compatibility mode and underlayer support for special media printing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-to-pdf-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-pdf-server-js)

PDF provides a universal document format for sharing and printing designs. CE.SDK exports PDF files that preserve vector graphics, support multi-page documents, and include options for print compatibility. You can configure high compatibility mode to ensure consistent rendering across different PDF viewers, and generate underlayers for special media printing like fabric, glass, or DTF transfers.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-pdf-server-js/server-js.ts reference-only
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
console.log('=== PDF Export Options ===\n');
console.log('1. Default PDF');
console.log('2. High Compatibility PDF');
console.log('3. PDF with Underlayer');
console.log('4. A4 @ 300 DPI PDF');
console.log('5. All formats\n');

const choice = (await prompt('Select export option (1-5): ')) || '5';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Get the scene block for PDF export (includes all pages)
  const scene = engine.scene.get();
  if (!scene) throw new Error('No scene found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  // Report per-page progress as the PDF is written. The callback runs once per
  // page; only PDF exports invoke it. On the server this is a natural place to
  // update a job status or log line for long multi-page exports.
  const onProgress = (exportedPages: number, totalPages: number) => {
    console.log(`  Exported ${exportedPages} of ${totalPages} pages`);
  };

  if (choice === '1' || choice === '5') {
    // Export scene as PDF (includes all pages)
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      onProgress
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design.pdf`, buffer);
    console.log(
      `✓ Default PDF: ${outputDir}/design.pdf (${(blob.size / 1024).toFixed(
        1
      )} KB)`
    );
  }

  if (choice === '2' || choice === '5') {
    // Enable high compatibility mode for consistent rendering across PDF viewers
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      onProgress
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-high-compatibility.pdf`, buffer);
    console.log(
      `✓ High Compatibility PDF: ${outputDir}/design-high-compatibility.pdf (${(
        blob.size / 1024
      ).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '5') {
    engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

    // Export with underlayer for special media printing
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      underlayerOffset: -2.0,
      onProgress
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-with-underlayer.pdf`, buffer);
    console.log(
      `✓ PDF with Underlayer: ${outputDir}/design-with-underlayer.pdf (${(
        blob.size / 1024
      ).toFixed(1)} KB)`
    );
  }

  if (choice === '4' || choice === '5') {
    // Export with specific dimensions for print output
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      targetWidth: 2480,
      targetHeight: 3508,
      onProgress
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-a4.pdf`, buffer);
    console.log(
      `✓ A4 PDF: ${outputDir}/design-a4.pdf (${(blob.size / 1024).toFixed(
        1
      )} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
```

This guide covers exporting designs to PDF format, configuring high compatibility mode, controlling the quality of rasterized images, generating underlayers with spot colors, and controlling output dimensions.

## Export to PDF

Call `engine.block.export()` with `mimeType: 'application/pdf'` to export any block as a PDF document. The method returns a Blob containing the PDF data.

```typescript highlight=highlight-export-pdf
// Export scene as PDF (includes all pages)
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  onProgress
});
```

Pass the scene ID from `engine.scene.get()` to export all pages as a multi-page PDF. You can also pass a single page ID from `engine.scene.getCurrentPage()` if you only need to export one page.

## Track Export Progress

Server-side exports of large multi-page documents can run for a while. Pass an `onProgress` callback to report how far the export has advanced, which is a natural hook for a job-status update or a log line.

```typescript highlight=highlight-progress
// Report per-page progress as the PDF is written. The callback runs once per
// page; only PDF exports invoke it. On the server this is a natural place to
// update a job status or log line for long multi-page exports.
const onProgress = (exportedPages: number, totalPages: number) => {
  console.log(`  Exported ${exportedPages} of ${totalPages} pages`);
};
```

The callback fires once after each page is serialized into the document, receiving the number of pages exported so far and the total page count. It is PDF-specific: raster exports like PNG or JPEG never invoke it.

Define it once and pass it to every export, as this example does. There is no reason to leave a server-side export unreported: the callback costs nothing when a document turns out to be a single page, and it is the only way to tell a stalled job from a slow one.

## Cancel a Running Export

Pass an `abortSignal` to stop an export whose result nobody waits for any more, for example when the client of a job has gone away or a deadline has passed. The promise rejects and no file is produced.

```typescript
const controller = new AbortController();
// Stop the export after 30 seconds, or call abort() from your own job handler.
const deadline = setTimeout(() => controller.abort(), 30_000);

try {
  const blob = await engine.block.export(scene, {
    mimeType: 'application/pdf',
    abortSignal: controller.signal,
    onProgress
  });
  writeFileSync(`${outputDir}/design.pdf`, Buffer.from(await blob.arrayBuffer()));
} catch (error) {
  console.log('Export cancelled', error);
} finally {
  clearTimeout(deadline);
}
```

For a multi-page PDF the engine stops at the next page boundary, so the pages that are still queued are never rendered and the worker is free for the next job. Every other export finishes its current work before the result is dropped, because there is no boundary to stop at.

## Configure High Compatibility Mode

Enable `exportPdfWithHighCompatibility` to rasterize complex elements like gradients with transparency at the scene's DPI. This ensures consistent rendering across all PDF viewers.

```typescript highlight=highlight-high-compatibility
// Enable high compatibility mode for consistent rendering across PDF viewers
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  onProgress
});
```

Use high compatibility mode when:

- Designs contain gradients with transparency
- Effects or blend modes render inconsistently across viewers
- Maximum compatibility matters more than vector precision

High compatibility mode increases file size because complex elements are converted to raster images rather than remaining as vectors.

## Control the Size of Rasterized Images

When `exportPdfWithHighCompatibility` is `false`, CE.SDK embeds the original data of unmodified JPEG images directly into the PDF. This keeps exports of photo-heavy documents such as photo books fast and small, because the photos are not decoded and encoded again.

CE.SDK must rasterize images that it cannot embed directly, for example images with effects or blurs applied, or every bitmap image when high compatibility mode is enabled. By default these images are encoded losslessly. Set `pdfImageQuality` to a value below `1.0` to encode them as lossy JPEG instead, which produces much smaller files.

```typescript
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  pdfImageQuality: 0.85
});
```

Valid values are greater than `0` and at most `1.0`. The default of `1.0` keeps the lossless encoding, in the same way as `webpQuality`. Images that are embedded as their original JPEG data are never encoded again, so this option does not change them.

## Generate Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on transparent or non-white substrates like fabric, glass, or acrylic. The underlayer sits behind your design elements and provides opacity on transparent materials.

### Define the Underlayer Spot Color

Before exporting, define a spot color that represents the underlayer ink. The RGB values provide a preview representation in PDF viewers.

```typescript highlight=highlight-spot-color
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
```

The spot color name (e.g., `'RDG_WHITE'`) must match your print provider's requirements. Common names include `RDG_WHITE` for Roland DG printers and `White` for other systems.

### Export with Underlayer Options

Configure the underlayer spot color name and optional offset. The `underlayerOffset` adjusts the underlayer size in design units—negative values shrink it inward to prevent visible edges from print misalignment (trapping).

```typescript highlight=highlight-underlayer
// Export with underlayer for special media printing
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  underlayerOffset: -2.0,
  onProgress
});
```

The underlayer is generated automatically from the contours of all design elements on the page. Elements with transparency will have proportionally reduced underlayer opacity.

## Export at Target Dimensions

Use `targetWidth` and `targetHeight` to control the exported PDF dimensions in pixels. The block renders large enough to fill the target size while maintaining aspect ratio.

```typescript highlight=highlight-target-size
// Export with specific dimensions for print output
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  targetWidth: 2480,
  targetHeight: 3508,
  onProgress
});
```

For print output, calculate the target dimensions based on your desired DPI:

- A4 at 300 DPI: 2480 × 3508 pixels
- Letter at 300 DPI: 2550 × 3300 pixels

## PDF Export Options

| Option | Description |
| ------ | ----------- |
| `mimeType` | Output format. Must be `'application/pdf'`. |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at scene DPI for consistent rendering. Defaults to `true`. |
| `pdfImageQuality` | Encoding quality for images that CE.SDK has to rasterize. Values below the default of `1.0` encode them as lossy JPEG. |
| `exportPdfWithUnderlayer` | Generate an underlayer from design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is true. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Must be used with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Must be used with `targetWidth`. |
| `onProgress` | Callback invoked once per page during PDF export with `(exportedPages, totalPages)`. Only called for PDF exports. |
| `pdfChunkSize` | Upper bound in bytes for a single chunk the PDF encoder hands to the export. Tunes the memory the export holds while it runs; it does not change the returned document. Defaults to an engine-chosen 512 KiB. Other values are clamped to 4 KiB to 64 MiB. |
| `abortSignal` | Signal that cancels the export. A multi-page PDF export stops at the next page boundary. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block as PDF with format and compatibility options |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define a spot color for underlayer ink |
| `engine.scene.get()` | Get the scene for multi-page PDF export |
| `engine.scene.getCurrentPage()` | Get the current page for single-page export |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export for Printing](./export-save-publish/for-printing.md) - Print workflows with DPI and color management
- [Spot Colors](./colors/for-print/spot.md) - Define and use spot colors in designs
- [Export Size Limits](./export-save-publish/export/size-limits.md) - Check device limits before exporting large designs



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support