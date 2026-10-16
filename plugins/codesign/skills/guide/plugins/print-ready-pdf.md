---
title: "Export Print-Ready PDF/X Files in Node.js"
description: "Generate PDF/X files from CE.SDK designs in Node.js with ICC profiles, bleed, conformance checks and file output."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/plugins/print-ready-pdf-iroalu/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Plugins](https://img.ly/docs/cesdk/archive/v1.84/node/plugins-693c48/) > [Print Ready PDFs](https://img.ly/docs/cesdk/archive/v1.84/node/plugins/print-ready-pdf-iroalu/)

---

Generate print-ready PDF/X files from a CE.SDK engine in Node.js with
`@imgly/pdfx-exporter`. Configure bleed, choose your printer's ICC profile,
check conformance and save the result to disk.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.84.0.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.84.0/plugins-print-ready-pdf-server-js)

The example creates a postcard with text and CMYK artwork. It writes one PDF/X-4 directly from the engine and a second file converted from a standard PDF.

```typescript file=@cesdk_web_examples/plugins-print-ready-pdf-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { checkPDFX, convertToPDFX, exportPDFX } from '@imgly/pdfx-exporter';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  const scene = engine.scene.create();
  engine.scene.setDesignUnit('Millimeter');
  engine.block.setFloat(scene, 'scene/dpi', 300);
  engine.block.setName(scene, 'Print-ready postcard');

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.block.setWidth(page, 148);
  engine.block.setHeight(page, 105);

  const artwork = engine.block.create('graphic');
  engine.block.setShape(artwork, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    c: 0.8,
    m: 0.3,
    y: 0,
    k: 0.1,
    tint: 1
  });
  engine.block.setFill(artwork, fill);
  engine.block.appendChild(page, artwork);
  engine.block.setPositionX(artwork, -3);
  engine.block.setPositionY(artwork, -3);
  engine.block.setWidth(artwork, 154);
  engine.block.setHeight(artwork, 38);

  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  engine.block.replaceText(text, 'Made for print\nPDF/X-4 with 3 mm bleed');
  engine.block.setTextFontSize(text, 9);
  engine.block.setWidth(text, 124);
  engine.block.setHeightMode(text, 'Auto');
  engine.block.setPositionX(text, 12);
  engine.block.setPositionY(text, 48);

  engine.block.setBool(page, 'page/marginEnabled', true);
  engine.block.setFloat(page, 'page/margin/top', 3);
  engine.block.setFloat(page, 'page/margin/bottom', 3);
  engine.block.setFloat(page, 'page/margin/left', 3);
  engine.block.setFloat(page, 'page/margin/right', 3);

  const printReadyPDF = await exportPDFX(engine, {
    outputStandard: 'PDF/X-4',
    outputProfile: 'fogra39',
    nonPrinterProfile: 'reject',
    title: 'Print-ready postcard'
  });

  const findings = await checkPDFX(printReadyPDF, 'PDF/X-4');
  if (findings.length > 0) {
    console.error(findings);
    throw new Error('The exported PDF has PDF/X conformance findings.');
  }

  const outputDirectory = new URL('./output/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    new URL('postcard-pdfx4.pdf', outputDirectory),
    new Uint8Array(await printReadyPDF.arrayBuffer())
  );

  const existingPDF = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const convertedPDF = await convertToPDFX(existingPDF, {
    outputStandard: 'PDF/X-4',
    outputProfile: 'fogra39',
    nonPrinterProfile: 'reject',
    title: 'Converted postcard'
  });
  const conversionFindings = await checkPDFX(convertedPDF, 'PDF/X-4');
  if (conversionFindings.length > 0) {
    console.error(conversionFindings);
    throw new Error('The converted PDF has PDF/X conformance findings.');
  }
  await writeFile(
    new URL('postcard-converted-pdfx4.pdf', outputDirectory),
    new Uint8Array(await convertedPDF.arrayBuffer())
  );
  console.info('Saved two PDF/X-4 files to output/.');
} finally {
  engine.dispose();
}
```

This guide covers setup, page bleed, engine export, conformance checks, file output and existing PDF conversion.

## Install and Run

Use Node.js 22 or later. The example uses top-level `await` and requires an ES module project. Install the engine, independently versioned exporter and example runner, then set the module type:

```sh
npm install @cesdk/node@1.84.0 @imgly/pdfx-exporter@^0.1.0 dotenv
npm install --save-dev tsx typescript @types/node
npm pkg set type=module
```

Copy the example's `server-js.ts` into your project and run it:

```sh
npx tsx server-js.ts
```

The complete example directory also includes `npm run dev`. Without a license, the engine adds a watermark. Set `CESDK_LICENSE` in your environment or `.env` file, then uncomment the license option to use your own license.

The exporter supports `@cesdk/node` and `@cesdk/node-native`. It reads its WebAssembly module from the installed package on disk. No conversion worker, hosted converter assets or runtime factory is required.

## Initialize the Engine

Load environment variables and initialize the headless engine:

```typescript highlight-setup
config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

The example creates its own scene, with millimeter design units and 300 DPI:

```typescript highlight-scene
  const scene = engine.scene.create();
  engine.scene.setDesignUnit('Millimeter');
  engine.block.setFloat(scene, 'scene/dpi', 300);
  engine.block.setName(scene, 'Print-ready postcard');

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.block.setWidth(page, 148);
  engine.block.setHeight(page, 105);

  const artwork = engine.block.create('graphic');
  engine.block.setShape(artwork, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    c: 0.8,
    m: 0.3,
    y: 0,
    k: 0.1,
    tint: 1
  });
  engine.block.setFill(artwork, fill);
  engine.block.appendChild(page, artwork);
  engine.block.setPositionX(artwork, -3);
  engine.block.setPositionY(artwork, -3);
  engine.block.setWidth(artwork, 154);
  engine.block.setHeight(artwork, 38);

  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  engine.block.replaceText(text, 'Made for print\nPDF/X-4 with 3 mm bleed');
  engine.block.setTextFontSize(text, 9);
  engine.block.setWidth(text, 124);
  engine.block.setHeightMode(text, 'Auto');
  engine.block.setPositionX(text, 12);
  engine.block.setPositionY(text, 48);
```

## Configure Page Bleed

Set the four margins in the scene's design unit and enable them. The example uses 3 mm on every side:

```typescript highlight-bleed
engine.block.setBool(page, 'page/marginEnabled', true);
engine.block.setFloat(page, 'page/margin/top', 3);
engine.block.setFloat(page, 'page/margin/bottom', 3);
engine.block.setFloat(page, 'page/margin/left', 3);
engine.block.setFloat(page, 'page/margin/right', 3);
```

Artwork must extend into the bleed area. `exportPDFX` uses the margins to write MediaBox and BleedBox around the page plus bleed, with TrimBox around the trimmed page. Non-page blocks have no scene-derived bleed.

## Export from the Engine

Use `exportPDFX` for a running engine. It exports all scene pages by default and returns one PDF Blob:

```typescript highlight-export
const printReadyPDF = await exportPDFX(engine, {
  outputStandard: 'PDF/X-4',
  outputProfile: 'fogra39',
  nonPrinterProfile: 'reject',
  title: 'Print-ready postcard'
});
```

Pass `blocks: [pageId, otherPageId]` to select pages and their order. Other exportable blocks become individual output pages. For CMYK profiles, the exporter enables DeviceCMYK engine export; high compatibility export is enabled by default. Override engine options with `exportOptions` when required.

## Check Conformance

Check the returned Blob against the same standard used for export. The example stops before saving when the checker reports findings:

```typescript highlight-check
const findings = await checkPDFX(printReadyPDF, 'PDF/X-4');
if (findings.length > 0) {
  console.error(findings);
  throw new Error('The exported PDF has PDF/X conformance findings.');
}
```

Each finding contains `rule`, `message` and `object`, a PDF object reference or `null`. An empty array means no violations were found by the checker. Apply any additional preflight checks your printer requires.

## Save the PDF

Convert the Blob to bytes and write it to the output directory:

```typescript highlight-save
const outputDirectory = new URL('./output/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await writeFile(
  new URL('postcard-pdfx4.pdf', outputDirectory),
  new Uint8Array(await printReadyPDF.arrayBuffer())
);
```

## Convert an Existing PDF

Use `convertToPDFX` when your pipeline already has a PDF Blob. The example generates a standard PDF to demonstrate this separate path:

```typescript highlight-convert
const existingPDF = await engine.block.export(page, {
  mimeType: 'application/pdf'
});
const convertedPDF = await convertToPDFX(existingPDF, {
  outputStandard: 'PDF/X-4',
  outputProfile: 'fogra39',
  nonPrinterProfile: 'reject',
  title: 'Converted postcard'
});
```

For a PDF on disk, create the Blob with `new Blob([new Uint8Array(await readFile(path))], { type: 'application/pdf' })`. Import `readFile` from `node:fs/promises`. An array of input Blobs returns an array of converted Blobs in the same order. Conversion does not derive bleed from the engine's page margins.

## Select Standards and Profiles

Use `outputStandard: 'PDF/X-4'` for live transparency, `'PDF/X-3'` for transparency flattened by default or `'PDF/X-1a'` for CMYK and spot-color output with transparency always flattened. `flattenResolution` defaults to 300 DPI. Disabling flattening for PDF/X-3 can leave a noncompliant file.

Use the required `outputProfile` to select `fogra39`, `gracol` or a custom printer profile. sRGB is a display profile and never produces compliant PDF/X output. Set `nonPrinterProfile: 'reject'` to reject non-printer profiles; the default `'keep'` produces a file that `checkPDFX` flags. PDF/X-1a rejects sRGB in either mode.

Load a printer-supplied ICC file for a custom printing condition:

```typescript
import { readFile } from 'node:fs/promises';
import { exportPDFX } from '@imgly/pdfx-exporter';

const customProfile = new Blob([
  new Uint8Array(await readFile('./profiles/printer.icc'))
]);
const printReadyPDF = await exportPDFX(engine, {
  outputStandard: 'PDF/X-4',
  outputProfile: 'custom',
  customProfile,
  nonPrinterProfile: 'reject',
  outputConditionIdentifier: 'PrinterCondition',
  outputCondition: 'Printing condition supplied by the printer'
});
```

Compliant output requires an ICC printer profile with device class `prtr`. PDF/X-1a requires a CMYK printer profile. Keep `embedICCProfile` enabled for PDF/X; setting it to `false` leaves the file without the embedded output intent required for PDF/X. Use that option only for downstream prepress processing.

## Bleed and Printer's Mark Limits

The exporter uses a temporary enlarged page for bleed and removes it after export, including on failure. Direct children use their current frames; a page's own background fill stretches across the bleed. Pixel rounding can change trim dimensions by up to 0.5 points at 300 DPI.

Crop and registration marks require CE.SDK 1.83 or later. They can be passed through `exportOptions` for pages without bleed. Combining marks and bleed throws an error because the marks enlarge the MediaBox. Use a CMYK printer profile with registration marks.

See [Export for Printing](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/for-printing-bca896/) for the engine's print settings and [Export to PDF](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export/to-pdf-95e04b/) for its export options.

## Dispose the Engine

Keep engine disposal in a `finally` block so resources are released after both successful and failed exports:

```typescript highlight-cleanup
engine.dispose();
```

When migrating an existing converter integration, replace the old package import. Version 0.1.0 does not accept `runtime`, `signal`, `timeoutMs`, `maxOutputBytes` or custom converter command arguments. An `exportOptions.abortSignal` controls engine export only.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
