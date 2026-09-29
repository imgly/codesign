> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Print Ready PDFs](./plugins/print-ready-pdf.md)

---

In this guide, you'll learn how to use the Print Ready PDF plugin with CE.SDK
Engine in Node.js to automate print-ready PDF generation. This is ideal for
batch processing, server-side PDF generation, CI/CD pipelines, and automated
workflows that require PDF/X compliant output. By default the plugin produces
PDF/X-4 (live transparency, vector text preserved); PDF/X-3 is available as
an opt-in fallback.

## What You'll Build

A server-side PDF conversion workflow that:

- Initializes CE.SDK Engine in headless mode
- Loads design scenes from files or APIs
- Exports PDFs using CE.SDK's engine
- Converts to PDF/X-4 (default) or PDF/X-3 with CMYK profiles
- Saves print-ready files to the filesystem
- Supports batch processing multiple files

## Prerequisites

- CE.SDK license with Design Editor features - [Get a free trial](https://img.ly/forms/free-trial)
- Node.js 22+ installed (required by `@cesdk/node`)
- Basic knowledge of Node.js and async/await

## Step 1: Install Dependencies

Add CE.SDK Engine and the Print Ready PDF plugin to your Node.js project:

```bash
npm install @cesdk/node@$UBQ_VERSION$ @imgly/plugin-print-ready-pdfs-web@1.0.0
```

Using the native Node.js package? Install `@cesdk/node-native@$UBQ_VERSION$` instead of `@cesdk/node` — the engine API is identical.

**Package details:**

- `@cesdk/node`: CE.SDK Node.js package for server-side rendering (requires Node.js >=22)
- `@imgly/plugin-print-ready-pdfs-web`: Print-ready PDF conversion (works in Node.js despite the name)

The plugin works in Node.js because its PDF processing runs on WebAssembly, which Node.js supports. It works with both `@cesdk/node` and the native `@cesdk/node-native` engine package.

**Try it yourself:**

1. Run `npm install` in your project directory
2. Verify packages appear in `package.json`
3. Check `node_modules` contains both packages

## Step 2: Initialize CE.SDK Engine in Headless Mode

Set up CE.SDK Engine for server-side processing:

```typescript
import CreativeEngine from '@cesdk/node';

const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`,
};

const engine = await CreativeEngine.init(config);
console.log('Engine initialized:', engine.isInitialized());
```

**CE.SDK concepts explained:**

- **`CreativeEngine.init()`**: Initializes the engine in headless mode (no browser required)
- **`license`**: Activates CE.SDK features including PDF export
- **`baseURL`**: Points to the engine assets. Optional for both Node.js packages, which bundle their engine assets; set it when self-hosting assets at your own location
- **Headless mode**: Runs without UI for automated workflows

**Verify initialization:**

1. Run your Node.js script: `node script.js`
2. Check console shows "Engine initialized: true"
3. No license errors should appear

## Step 3: Load and Export Scenes as PDF

Load design scenes and export them as PDFs:

```typescript
import { readFileSync } from 'fs';

// Load scene from file
const sceneString = readFileSync('design.scene', 'utf-8');
await engine.scene.load(sceneString);

// Get scene ID
const sceneId = engine.scene.get();

// Export as PDF
const pdfBlob = await engine.block.export(sceneId, 'application/pdf');

console.log('PDF exported:', pdfBlob.size, 'bytes');
```

**CE.SDK export methods in detail:**

- **`engine.scene.load()`**: Loads a saved CE.SDK scene from JSON string
- **`engine.scene.get()`**: Returns the ID of the currently loaded scene
- **`engine.block.export()`**: Exports a block (the entire scene) as a specified format

The `.scene` file format is CE.SDK's native scene format. You can create these from CE.SDK Editor or generate them programmatically.

**Alternative: Load from URL or API:**

```typescript
// Fetch scene from API
await engine.scene.load('https://api.example.com/scenes/123');
```

**Test your implementation:**

- Run script with a valid `.scene` file
- Check console shows PDF size > 0
- No export errors should appear

## Step 4: Convert to Print-Ready Format

Use the plugin to convert CE.SDK's PDF to PDF/X:

```typescript
import { convertToPDFX } from '@imgly/plugin-print-ready-pdfs-web';

// PDF/X-4 by default — live transparency, vector text preserved.
// Pass `outputStandard: 'PDF/X-3'` if your pipeline requires the older standard.
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputProfile: 'fogra39',
  title: 'Automated Print Export',
});

console.log('Conversion complete:', printReadyPDF.size, 'bytes');
```

**How this integrates with CE.SDK:**

- CE.SDK Engine exports standard RGB PDF
- Plugin converts to CMYK with ICC profiles
- Adds PDF/X-4 (ISO 15930-7) compliance markers by default
- Keeps live transparency on transparent pages

**Color profile selection:**

- **`'fogra39'`**: European offset printing (ISO Coated v2)
- **`'gracol'`**: USA commercial printing (GRACoL 2013)
- **`'srgb'`**: Digital distribution (keeps RGB)
- **`'custom'`**: Use printer-specific ICC profile

**Verify the conversion:**

- Conversion completes in 2-5 seconds
- Output size increased by ~400-500KB (ICC profile)
- No error messages in console

## Step 5: Save to Filesystem

Save the print-ready PDF to disk:

```typescript
import { writeFileSync } from 'fs';

// Convert Blob to Buffer for Node.js filesystem
const buffer = Buffer.from(await printReadyPDF.arrayBuffer());

// Save to file
writeFileSync('output-print-ready.pdf', buffer);

console.log('File saved: output-print-ready.pdf');
```

**Node.js file handling explained:**

- **`Blob.arrayBuffer()`**: Gets raw binary data from Blob
- **`Buffer.from()`**: Converts ArrayBuffer to Node.js Buffer
- **`writeFileSync()`**: Writes Buffer to filesystem synchronously

For production systems, use `writeFile()` (async) instead of `writeFileSync()`.

**Test the complete workflow:**

1. Run your script: `node script.js`
2. Check `output-print-ready.pdf` exists
3. Open PDF in viewer (Adobe Acrobat, Preview, etc.)
4. Verify file properties show PDF/X-3:2003 compliance

## Complete Implementation

Here's a full server-side PDF conversion script:

```typescript
import CreativeEngine from '@cesdk/node';
import { convertToPDFX } from '@imgly/plugin-print-ready-pdfs-web';
import { readFileSync, writeFileSync } from 'fs';

async function convertToPrintReady() {
  // Initialize CE.SDK Engine
  const engine = await CreativeEngine.init({
    license: 'YOUR_CESDK_LICENSE_KEY',
  });

  // Load scene from file
  const sceneString = readFileSync('design.scene', 'utf-8');
  await engine.scene.load(sceneString);

  // Export as PDF
  const sceneId = engine.scene.get();
  const pdfBlob = await engine.block.export(sceneId, 'application/pdf');

  // Convert to print-ready
  const printReadyPDF = await convertToPDFX(pdfBlob, {
    outputProfile: 'fogra39',
    title: 'Automated Print Export',
  });

  // Save to disk
  const buffer = Buffer.from(await printReadyPDF.arrayBuffer());
  writeFileSync('output-print-ready.pdf', buffer);

  console.log('Print-ready PDF created successfully');

  // Don't forget to dispose when done
  engine.dispose();
}

convertToPrintReady().catch(console.error);
```

This implementation provides a complete automated workflow for generating print-ready PDFs from CE.SDK scenes.

## Transparency Handling

The default output is PDF/X-4, which is based on PDF 1.6 and supports live transparency natively. Vector text and gradients on transparent pages are preserved without flattening, so no special handling is required.

```typescript
// Default — PDF/X-4 with live transparency preserved
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputProfile: 'fogra39',
  title: 'Automated Print Export',
});
```

## Fallback: PDF/X-3

If your downstream pipeline does not accept PDF/X-4, opt back into the older PDF/X-3 standard with `outputStandard: 'PDF/X-3'`:

```typescript
// PDF/X-3 fallback (PDF 1.4, no live transparency)
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputStandard: 'PDF/X-3',
  outputProfile: 'fogra39',
  title: 'Automated Print Export (X-3)',
});
```

PDF/X-3:2003 is based on PDF 1.3 which does not support transparency. The plugin flattens transparency by default on this path so the output is strictly compliant.

**What happens during flattening:**

- Pages without transparency → Preserved as vectors (text, shapes remain editable)
- Pages with transparency → Rasterized to bitmaps during conversion
- Mixed content → Only transparent elements are rasterized

### Known Issue: Black Backgrounds During Flattening

During flattening, certain elements may render with black backgrounds instead of their intended appearance:

- Gradients that fade to transparent
- PNG images with alpha channels (e.g., stickers, icons)
- Text with emoji characters
- Overlapping semi-transparent elements

If you hit any of these, switch back to the PDF/X-4 default — X-4 preserves transparency live and avoids the flattening artifacts entirely.

### Workaround: Preserve Transparency on X-3

If you must stay on X-3 but visual fidelity matters more than strict compliance, disable flattening:

```typescript
// X-3 output with live transparency — non-strict
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputStandard: 'PDF/X-3',
  outputProfile: 'fogra39',
  title: 'X-3 with Preserved Transparency',
  flattenTransparency: false,
});
```

| Setting | Visual Fidelity | PDF/X-3 Compliance |
|---------|----------------|-------------------|
| `flattenTransparency: true` (default for X-3) | May have artifacts | Strictly compliant |
| `flattenTransparency: false` | Preserved | May not validate if transparency exists |

The `flattenTransparency` option is ignored when `outputStandard` is `'PDF/X-4'` — X-4 keeps transparency live by definition.

## Advanced: Opting Out of ICC Profile Embedding

If a downstream prepress pipeline (e.g. ZePrA, PitStop) applies its own ICC profile and color normalization, you can keep the RGB→CMYK color conversion from the plugin and skip the embedded OutputIntent so the downstream tool can add its own:

```typescript
// Convert to CMYK without embedding the ICC profile or PDF/X metadata
const cmykPDF = await convertToPDFX(pdfBlob, {
  outputProfile: 'fogra39',
  embedICCProfile: false,
  title: 'CMYK for Downstream Pipeline',
});
```

**What changes when `embedICCProfile` is `false`:**

- The selected `outputProfile` still determines whether the output is device CMYK (for `fogra39`, `gracol`, or a custom CMYK profile) or RGB (for `srgb`).
- The output PDF does not include the ICC profile, the `OutputIntent`, or the PDF/X conformance markers.
- The resulting file is a plain CMYK PDF, not PDF/X compliant. Your downstream prepress tool is responsible for assigning the final ICC profile and applying any color normalization.

Use this when your existing pipeline already enforces ICC profile embedding and color normalization rules you need to preserve.

## Advanced: Batch Processing Multiple Files

Process multiple scenes in a batch:

```typescript
import { readdirSync } from 'fs';

async function batchConvert() {
  const engine = await CreativeEngine.init({
    license: 'YOUR_CESDK_LICENSE_KEY',
  });

  // Find all .scene files
  const sceneFiles = readdirSync('.').filter(f => f.endsWith('.scene'));

  console.log(`Processing ${sceneFiles.length} files...`);

  for (const file of sceneFiles) {
    console.log(`Converting ${file}...`);

    // Load scene
    const sceneString = readFileSync(file, 'utf-8');
    await engine.scene.load(sceneString);

    // Export and convert
    const sceneId = engine.scene.get();
    const pdfBlob = await engine.block.export(sceneId, 'application/pdf');
    const printReadyPDF = await convertToPDFX(pdfBlob, {
      outputProfile: 'fogra39',
      title: file.replace('.scene', ''),
    });

    // Save with print-ready suffix
    const outputName = file.replace('.scene', '-print-ready.pdf');
    const buffer = Buffer.from(await printReadyPDF.arrayBuffer());
    writeFileSync(outputName, buffer);

    console.log(`✓ Saved ${outputName}`);
  }

  console.log('Batch processing complete!');
}

batchConvert().catch(console.error);
```

This processes all `.scene` files in a directory and generates print-ready PDFs for each.

## Troubleshooting

### "Cannot find module" Error

**Problem:** Import errors for CE.SDK or plugin

**Solution:** Verify package installation:

```bash
npm list @cesdk/node @imgly/plugin-print-ready-pdfs-web
```

If missing, reinstall:

```bash
npm install @cesdk/node@$UBQ_VERSION$ @imgly/plugin-print-ready-pdfs-web@1.0.0
```

### Memory Issues with Large Files

**Problem:** Node.js crashes with "out of memory" errors

**Solution:** Increase Node.js memory limit:

```bash
node --max-old-space-size=4096 script.js
```

Or use streaming for large batch operations:

```typescript
// Process files sequentially instead of in parallel
for (const file of sceneFiles) {
  await processFile(file);
  // Allow garbage collection between files
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### AGPL License Concerns

**Problem:** Worried about AGPL compliance for server-side processing

**Solution:** Consult legal counsel if:

- You're modifying the plugin's WASM binaries
- You're offering PDF conversion as a network service
- You're bundling the plugin in closed-source server software

For most use cases (internal automation, CI/CD, batch processing), server-side execution is acceptable. The plugin uses Ghostscript under AGPL-3.0.

## Validating Output

Verify generated PDFs meet print standards:

```typescript
import { execSync } from 'child_process';

// Check PDF version
const version = execSync(
  'pdfinfo output-print-ready.pdf | grep "PDF version"',
).toString();
console.log(version); // Should show PDF 1.3 (PDF/X-3:2003)

// Validate structure
execSync('qpdf --check output-print-ready.pdf');
console.log('PDF structure is valid');
```

Or use Adobe Acrobat Pro:

1. Open PDF → File → Properties → Description
2. Should show "PDF/X-3:2003"
3. Check Advanced tab for OutputIntent with ICC profile



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support