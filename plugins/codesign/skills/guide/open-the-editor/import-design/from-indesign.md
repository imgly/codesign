> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md) > [From InDesign](./open-the-editor/import-design/from-indesign.md)

---

Import Adobe InDesign (IDML) files into CE.SDK using Node.js, converting them into scene archives for distribution or further processing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-import-design-from-indesign-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-import-design-from-indesign-server-js)

The `@imgly/idml-importer` package converts InDesign IDML files into CE.SDK scene format, preserving design structure for distribution or further processing. This guide focuses on batch converting IDML template files at build-time using Node.js—ideal for migrating existing template libraries or integrating with CI/CD pipelines. For enabling end-user uploads in the browser, see the [browser guide](./open-the-editor/import-design/from-indesign.md).

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-from-indesign-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/idml-importer';
import {
  IDMLParser,
  addGfontsAssetLibrary,
  createPdfEmbeddedImporter
} from '@imgly/idml-importer';
import { PDFParser } from '@imgly/pdf-importer';
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();

// Optional: Create a custom font resolver for advanced font mapping
// Use this when you need to map InDesign fonts to specific alternatives,
// use enterprise fonts, or implement custom fallback logic
const customFontResolver: TypefaceResolver = async (fontParams, engine) => {
  const { family, style, weight } = fontParams;

  // Define font mappings from InDesign fonts to available alternatives
  const fontMappings: Record<string, string> = {
    Arial: 'Open Sans',
    Helvetica: 'Inter',
    'Helvetica Neue': 'Inter',
    'Times New Roman': 'Lora',
    Georgia: 'Merriweather'
  };

  // Use mapped font or original family name
  const targetFamily = fontMappings[family] || family;

  // Search for the font in available typefaces
  const result = await engine.asset.findAssets('ly.img.typeface', {
    query: targetFamily,
    page: 0,
    perPage: 10
  });

  if (result.assets.length === 0) {
    console.warn(`Font "${family}" not found, using default fallback`);
    return null; // Let the parser use its default fallback
  }

  // Get the typeface from the asset payload
  const asset = result.assets[0];
  const typeface = asset.payload?.typeface;
  if (!typeface) return null;

  // Find the best matching font variant (weight and style)
  const matchingFont =
    typeface.fonts.find(
      (f: { weight?: string; style?: string }) =>
        f.weight === weight && f.style === style
    ) ||
    typeface.fonts.find((f: { weight?: string }) => f.weight === weight) ||
    typeface.fonts[0];

  return { typeface, font: matchingFont };
};

/**
 * Convert a single IDML file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertIdml(
  engine: InstanceType<typeof CreativeEngine>,
  idmlPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  pageCount: number;
}> {
  // Read the IDML file
  const idmlBuffer = await fs.readFile(idmlPath);

  // Parse the IDML file using JSDOM for XML parsing.
  // Server-side import requires JSDOM since DOMParser is browser-only.
  // The addGfontsAssetLibrary() call enables automatic font matching.
  // Register the PDF embedded-importer adapter explicitly so any
  // <PDF>/.ai content inside the IDML imports as editable CE.SDK blocks
  // via @imgly/pdf-importer (rather than a placeholder image).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = await IDMLParser.fromFile(
    engine as any,
    idmlBuffer.buffer,
    (content: string) =>
      new JSDOM(content, {
        contentType: 'text/xml',
        storageQuota: 10000000,
        url: 'http://localhost'
      }).window.document,
    {
      fontResolver: customFontResolver,
      embeddedImporters: [createPdfEmbeddedImporter(PDFParser)]
    }
  );
  await parser.parse();

  // Verify pages were imported successfully
  const pages = engine.scene.getPages();
  if (pages.length === 0) {
    throw new Error(`No pages imported from IDML file: ${idmlPath}`);
  }
  console.log(`  Imported ${pages.length} page(s)`);

  // Generate output filename from input filename
  const inputName = basename(idmlPath, '.idml');
  const archivePath = join(outputDir, `${inputName}.imgly`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
  // To use saveToString(), relocate transient resources to permanent URLs first:

  // Mock upload function - replace with your actual backend upload logic
  const uploadToBackend = async (data: Uint8Array): Promise<string> => {
    // In production, upload the data to your CDN/storage and return the permanent URL
    // For this example, we write to a temp file and return a file:// URL
    const hash = data.reduce((acc, byte) => (acc + byte) % 1000000, 0);
    const tempPath = join(outputDir, `asset-${hash}.png`);
    await fs.writeFile(tempPath, data);
    return `file://${tempPath}`;
  };

  const transientResources = engine.editor.findAllTransientResources();
  for (const resource of transientResources) {
    const { URL: bufferUri, size } = resource;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data);
    engine.editor.relocateResource(bufferUri, permanentUrl);
  }

  // Now save as scene string - all URLs are permanent
  const sceneString = await engine.scene.saveToString();
  const sceneStringPath = join(outputDir, `${inputName}.imgly`);
  await fs.writeFile(sceneStringPath, sceneString);

  return { archivePath, sceneStringPath, pageCount: pages.length };
}

/**
 * Batch convert multiple IDML files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertIdmls(
  idmlPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${idmlPaths.length} IDML files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await addGfontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each IDML file
    for (const idmlPath of idmlPaths) {
      const fileName = basename(idmlPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath } = await convertIdml(
          engine,
          idmlPath,
          outputDir
        );

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${idmlPaths.length}`);
    console.log(`  Failed: ${failCount}/${idmlPaths.length}`);
  } finally {
    // Always dispose engine to free resources
    engine.dispose();
  }
}

/**
 * Validate conversion results by loading the archive and checking scene structure
 */
export async function validateArchive(archivePath: string): Promise<{
  valid: boolean;
  pageCount: number;
  blockCount: number;
}> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load the archive
    const archiveBuffer = await fs.readFile(archivePath);
    const archiveBlob = new Blob([archiveBuffer]);
    const archiveUrl = URL.createObjectURL(archiveBlob);

    await engine.scene.load(archiveUrl);

    // Get scene information
    const pages = engine.block.findByType('page');
    const allBlocks = engine.block.findAll();

    return {
      valid: pages.length > 0,
      pageCount: pages.length,
      blockCount: allBlocks.length
    };
  } finally {
    engine.dispose();
  }
}

/**
 * Find all IDML files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all IDML files in directory
  const files = await fs.readdir(inputDir);
  const idmlFiles = files
    .filter((f) => f.toLowerCase().endsWith('.idml'))
    .map((f) => join(inputDir, f));

  if (idmlFiles.length === 0) {
    console.log(`No IDML files found in ${inputDir}`);
    return;
  }

  await batchConvertIdmls(idmlFiles, outputDir);
}

/**
 * Main entry point - demonstrates batch IDML conversion workflow
 */
async function main(): Promise<void> {
  console.log('IDML to CE.SDK Batch Converter');
  console.log('==============================\n');

  // Example: Convert a single IDML file
  // In production, you would provide actual IDML files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGfontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual IDML conversion
    await engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(engine.scene.get()!, page);

    // Save as archive
    await fs.mkdir('./output', { recursive: true });
    const archive = await engine.scene.saveToArchive();
    const archiveBuffer = Buffer.from(await archive.arrayBuffer());
    await fs.writeFile('./output/sample.imgly', archiveBuffer);

    console.log('Sample archive created: ./output/sample.imgly');
    console.log('\nTo convert actual IDML files:');
    console.log('1. Place IDML files in an input directory');
    console.log('2. Call: await processDirectory("./input", "./output")');
  } finally {
    engine.dispose();
  }
}

// Run the example
main().catch(console.error);
```

This guide covers installation, setting up a conversion script, parsing IDML files, saving scene archives, batch processing multiple files, and understanding the current limitations.

## Installation

Install the `@imgly/idml-importer` package alongside the Node.js SDK. Server-side conversion requires `jsdom` for XML parsing:

```bash
npm install @imgly/idml-importer @cesdk/node@$UBQ_VERSION$ jsdom
npm install --save-dev @types/jsdom
```

Using the native Node.js package? Install `@cesdk/node-native@$UBQ_VERSION$` instead of `@cesdk/node` — the engine API is identical.

The `jsdom` package provides the XML parsing functionality that `DOMParser` provides in browsers.

### Optional: Embedded PDF / Adobe Illustrator support

IDML files exported from InDesign can carry embedded PDF or Adobe Illustrator (`.ai`) content. To import these as editable CE.SDK blocks rather than placeholder images, also install `@imgly/pdf-importer` and register its adapter via the `embeddedImporters` option on `IDMLParser.fromFile`:

```bash
npm install @imgly/pdf-importer
```

The IDML importer does not import `@imgly/pdf-importer` itself — registering the adapter is opt-in, so consumers who don't need embedded-PDF support pay no install cost.

## Supported Elements

The IDML importer preserves the following InDesign elements:

- **Layer structure** - Element grouping and hierarchy
- **Positioning** - X/Y coordinates, rotation, and transparency
- **Text elements** - Font family, bold/italic styles
- **Shapes** - Rectangles, ovals, polygons, lines
- **Fills** - Solid color fills and gradients
- **Strokes** - Color, weight, and alignment
- **Images** - Embedded images only (linked images require embedding before export)

## Setting Up Font Matching

Text elements in IDML files reference fonts that may not be available in CE.SDK. Use `addGfontsAssetLibrary()` from the `@imgly/idml-importer` package to register Google Fonts as a font source before parsing:

```typescript highlight=highlight-setup
import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/idml-importer';
import {
  IDMLParser,
  addGfontsAssetLibrary,
  createPdfEmbeddedImporter
} from '@imgly/idml-importer';
import { PDFParser } from '@imgly/pdf-importer';
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();
```

Call this function on the engine before parsing IDML files. The importer attempts to match fonts from the IDML with available Google Fonts. For fonts not found, the importer uses a fallback font.

## Parsing the IDML File

Use `IDMLParser.fromFile()` with `jsdom` for XML parsing. Unlike the browser's native `DOMParser`, server-side parsing requires explicit JSDOM configuration:

```typescript highlight=highlight-parse-idml
// Parse the IDML file using JSDOM for XML parsing.
// Server-side import requires JSDOM since DOMParser is browser-only.
// The addGfontsAssetLibrary() call enables automatic font matching.
// Register the PDF embedded-importer adapter explicitly so any
// <PDF>/.ai content inside the IDML imports as editable CE.SDK blocks
// via @imgly/pdf-importer (rather than a placeholder image).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parser = await IDMLParser.fromFile(
  engine as any,
  idmlBuffer.buffer,
  (content: string) =>
    new JSDOM(content, {
      contentType: 'text/xml',
      storageQuota: 10000000,
      url: 'http://localhost'
    }).window.document,
  {
    fontResolver: customFontResolver,
    embeddedImporters: [createPdfEmbeddedImporter(PDFParser)]
  }
);
await parser.parse();
```

The JSDOM options ensure proper XML handling:

- `contentType: 'text/xml'` - Parses as XML rather than HTML
- `storageQuota` - Prevents quota errors with larger documents
- `url` - Required by JSDOM for relative resource resolution

## Checking Import Results

Verify the import succeeded by checking the page count. If no pages were imported, the IDML file may have contained only unsupported elements:

```typescript highlight=highlight-check-warnings
// Verify pages were imported successfully
const pages = engine.scene.getPages();
if (pages.length === 0) {
  throw new Error(`No pages imported from IDML file: ${idmlPath}`);
}
console.log(`  Imported ${pages.length} page(s)`);
```

Log any warnings to identify IDML features that didn't convert correctly.

## Converting a Single IDML File

Read an IDML file, parse it using the IDML importer, and save the resulting scene as an archive:

```typescript highlight=highlight-convert-single
/**
 * Convert a single IDML file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertIdml(
  engine: InstanceType<typeof CreativeEngine>,
  idmlPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  pageCount: number;
}> {
  // Read the IDML file
  const idmlBuffer = await fs.readFile(idmlPath);

  // Parse the IDML file using JSDOM for XML parsing.
  // Server-side import requires JSDOM since DOMParser is browser-only.
  // The addGfontsAssetLibrary() call enables automatic font matching.
  // Register the PDF embedded-importer adapter explicitly so any
  // <PDF>/.ai content inside the IDML imports as editable CE.SDK blocks
  // via @imgly/pdf-importer (rather than a placeholder image).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = await IDMLParser.fromFile(
    engine as any,
    idmlBuffer.buffer,
    (content: string) =>
      new JSDOM(content, {
        contentType: 'text/xml',
        storageQuota: 10000000,
        url: 'http://localhost'
      }).window.document,
    {
      fontResolver: customFontResolver,
      embeddedImporters: [createPdfEmbeddedImporter(PDFParser)]
    }
  );
  await parser.parse();

  // Verify pages were imported successfully
  const pages = engine.scene.getPages();
  if (pages.length === 0) {
    throw new Error(`No pages imported from IDML file: ${idmlPath}`);
  }
  console.log(`  Imported ${pages.length} page(s)`);

  // Generate output filename from input filename
  const inputName = basename(idmlPath, '.idml');
  const archivePath = join(outputDir, `${inputName}.imgly`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
  // To use saveToString(), relocate transient resources to permanent URLs first:

  // Mock upload function - replace with your actual backend upload logic
  const uploadToBackend = async (data: Uint8Array): Promise<string> => {
    // In production, upload the data to your CDN/storage and return the permanent URL
    // For this example, we write to a temp file and return a file:// URL
    const hash = data.reduce((acc, byte) => (acc + byte) % 1000000, 0);
    const tempPath = join(outputDir, `asset-${hash}.png`);
    await fs.writeFile(tempPath, data);
    return `file://${tempPath}`;
  };

  const transientResources = engine.editor.findAllTransientResources();
  for (const resource of transientResources) {
    const { URL: bufferUri, size } = resource;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data);
    engine.editor.relocateResource(bufferUri, permanentUrl);
  }

  // Now save as scene string - all URLs are permanent
  const sceneString = await engine.scene.saveToString();
  const sceneStringPath = join(outputDir, `${inputName}.imgly`);
  await fs.writeFile(sceneStringPath, sceneString);

  return { archivePath, sceneStringPath, pageCount: pages.length };
}
```

The `convertIdmlToArchive` function:

1. Reads the IDML buffer
2. Creates a parser instance with JSDOM for XML parsing
3. Parses the IDML, creating a scene in the engine
4. Verifies pages were imported successfully
5. Saves the scene as an `.imgly` archive file

## Saving as Archive

After parsing, save the imported scene as an archive. Archives bundle the scene with all referenced assets, creating a portable file that can be distributed or loaded later:

```typescript highlight=highlight-save-archive
// Save as scene archive
const archive = await engine.scene.saveToArchive();
const archiveBuffer = Buffer.from(await archive.arrayBuffer());
await fs.writeFile(archivePath, archiveBuffer);
```

Write the archive to the filesystem as an `.imgly` file for later use with `load()`.

## Saving Scenes with Stable URLs

By default, the IDML importer creates internal `buffer://` URLs for imported images. These are transient resources that work well when saving to an archive (`engine.scene.saveToArchive()`), which bundles all assets together.

However, if you want to save scenes as JSON strings (`engine.scene.saveToString()`) with stable, permanent URLs (e.g., for storing in a database or referencing CDN-hosted assets), you need to relocate the transient resources first.

### Why Relocate?

- **Scene Archives** (`saveToArchive`): Include all assets in a single ZIP file. Transient `buffer://` URLs work fine.
- **Scene Strings** (`saveToString`): Only contain references to assets. Transient URLs won't work when reloading the scene later. You need permanent URLs (e.g., `https://`).

### How to Relocate Transient Resources

After parsing the IDML file, use CE.SDK's native APIs to find and relocate all transient resources:

```typescript highlight=highlight-stable-urls
  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
  // To use saveToString(), relocate transient resources to permanent URLs first:

  // Mock upload function - replace with your actual backend upload logic
  const uploadToBackend = async (data: Uint8Array): Promise<string> => {
    // In production, upload the data to your CDN/storage and return the permanent URL
    // For this example, we write to a temp file and return a file:// URL
    const hash = data.reduce((acc, byte) => (acc + byte) % 1000000, 0);
    const tempPath = join(outputDir, `asset-${hash}.png`);
    await fs.writeFile(tempPath, data);
    return `file://${tempPath}`;
  };

  const transientResources = engine.editor.findAllTransientResources();
  for (const resource of transientResources) {
    const { URL: bufferUri, size } = resource;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data);
    engine.editor.relocateResource(bufferUri, permanentUrl);
  }

  // Now save as scene string - all URLs are permanent
  const sceneString = await engine.scene.saveToString();
  const sceneStringPath = join(outputDir, `${inputName}.imgly`);
  await fs.writeFile(sceneStringPath, sceneString);
```

The relocation workflow:

1. Find all transient resources using `engine.editor.findAllTransientResources()`
2. Extract binary data for each resource using `engine.editor.getBufferData()`
3. Upload the data to your storage service (S3, GCS, CDN, etc.)
4. Relocate the resource URL using `engine.editor.relocateResource()`
5. Save to string with `engine.scene.saveToString()` - all URLs will now be permanent

### Note on Font URLs

When using the default font resolver with Google Fonts, the resulting scene string will contain Google CDN URLs for fonts. If you need fonts hosted on your own infrastructure, configure a custom font resolver instead of using the default Google Fonts integration.

## Batch Converting Multiple IDML Files

Process multiple IDML files sequentially, continuing even if individual files fail:

```typescript highlight=highlight-batch-convert
/**
 * Batch convert multiple IDML files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertIdmls(
  idmlPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${idmlPaths.length} IDML files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await addGfontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each IDML file
    for (const idmlPath of idmlPaths) {
      const fileName = basename(idmlPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath } = await convertIdml(
          engine,
          idmlPath,
          outputDir
        );

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${idmlPaths.length}`);
    console.log(`  Failed: ${failCount}/${idmlPaths.length}`);
  } finally {
    // Always dispose engine to free resources
    engine.dispose();
  }
}
```

Key aspects of batch conversion:

- **Single engine instance** - Initialize once and reuse for all conversions to improve performance
- **Error isolation** - Each file is processed in a try-catch block so one failure doesn't stop the batch
- **Progress logging** - Track success and failure counts for reporting
- **Resource cleanup** - Always dispose the engine in a finally block

## Processing a Directory

Scan a directory for IDML files and convert all of them:

```typescript highlight=highlight-process-directory
/**
 * Find all IDML files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all IDML files in directory
  const files = await fs.readdir(inputDir);
  const idmlFiles = files
    .filter((f) => f.toLowerCase().endsWith('.idml'))
    .map((f) => join(inputDir, f));

  if (idmlFiles.length === 0) {
    console.log(`No IDML files found in ${inputDir}`);
    return;
  }

  await batchConvertIdmls(idmlFiles, outputDir);
}
```

This function finds all `.idml` files in the input directory and processes them as a batch.

## Validating Conversion Results

Load a converted archive and verify its structure:

```typescript highlight=highlight-validate-results
/**
 * Validate conversion results by loading the archive and checking scene structure
 */
export async function validateArchive(archivePath: string): Promise<{
  valid: boolean;
  pageCount: number;
  blockCount: number;
}> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load the archive
    const archiveBuffer = await fs.readFile(archivePath);
    const archiveBlob = new Blob([archiveBuffer]);
    const archiveUrl = URL.createObjectURL(archiveBlob);

    await engine.scene.load(archiveUrl);

    // Get scene information
    const pages = engine.block.findByType('page');
    const allBlocks = engine.block.findAll();

    return {
      valid: pages.length > 0,
      pageCount: pages.length,
      blockCount: allBlocks.length
    };
  } finally {
    engine.dispose();
  }
}
```

Validation checks:

- The archive can be loaded without errors
- At least one page exists in the scene
- Block count indicates content was imported

## Running the Conversion

The main entry point demonstrates the complete batch conversion workflow:

```typescript highlight=highlight-main
/**
 * Main entry point - demonstrates batch IDML conversion workflow
 */
async function main(): Promise<void> {
  console.log('IDML to CE.SDK Batch Converter');
  console.log('==============================\n');

  // Example: Convert a single IDML file
  // In production, you would provide actual IDML files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGfontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual IDML conversion
    await engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(engine.scene.get()!, page);

    // Save as archive
    await fs.mkdir('./output', { recursive: true });
    const archive = await engine.scene.saveToArchive();
    const archiveBuffer = Buffer.from(await archive.arrayBuffer());
    await fs.writeFile('./output/sample.imgly', archiveBuffer);

    console.log('Sample archive created: ./output/sample.imgly');
    console.log('\nTo convert actual IDML files:');
    console.log('1. Place IDML files in an input directory');
    console.log('2. Call: await processDirectory("./input", "./output")');
  } finally {
    engine.dispose();
  }
}
```

Run the script with `vite-node` or `tsx`:

```bash
npx vite-node server-js.ts
```

For production use, modify the script to accept input/output directories as arguments.

## Saving and Loading Archives

Scene archives (`.imgly` files) contain the complete scene with all embedded assets:

```typescript
// Save scene as archive
const archive = await engine.scene.saveToArchive();
const archiveBuffer = Buffer.from(await archive.arrayBuffer());
await fs.writeFile('output.imgly', archiveBuffer);

// Load the archive back from a blob URL
const archiveUrl = URL.createObjectURL(new Blob([archiveBuffer]));
await engine.scene.load(archiveUrl);
```

Archives are portable - convert on server, load in browser or another server instance.

## Engine Cleanup

Always dispose of the engine when processing is complete to free system resources:

```typescript highlight=highlight-cleanup
// Always dispose engine to free resources
engine.dispose();
```

Using a `try/finally` block ensures cleanup happens even if an error occurs during processing.

## API Reference

The `@imgly/idml-importer` package exports the following key APIs:

| API | Description |
|-----|-------------|
| `IDMLParser.fromFile(engine, buffer, xmlParser, options?)` | Creates a parser instance from an IDML file buffer. The `xmlParser` function converts XML strings to DOM documents. `options` accepts `fontResolver` and `embeddedImporters`. |
| `parser.parse()` | Parses the IDML file and creates a CE.SDK scene. Returns when parsing is complete. |
| `addGfontsAssetLibrary(engine)` | Registers Google Fonts as a font source for text element matching. Call before parsing. |
| `createPdfEmbeddedImporter(PDFParser)` | Adapter for the `embeddedImporters` array. Imports embedded PDF / `.ai` content as editable CE.SDK blocks via `@imgly/pdf-importer`. Requires the package to be installed; pass its `PDFParser` class as the only argument. |

## Limitations

The IDML importer has the following limitations:

- **Linked images** - Only embedded images are supported. Linked images become placeholders. Embed all images in InDesign before exporting to IDML.
- **Text flow** - Text that flows between multiple text frames is not supported and may appear duplicated.
- **Image fitting** - Images shrunk inside their frames may not render as expected.
- **Embedded PDF / `.ai`** - Imports as editable blocks when `@imgly/pdf-importer` is installed and `createPdfEmbeddedImporter(PDFParser)` is registered in `embeddedImporters`. Without the adapter, embeds fall through to a placeholder image. Non-rectangular frame clipping and per-embed PDF crop attributes are not yet applied.
- **Advanced text** - Complex text formatting beyond bold/italic may not be preserved.

These are the highlights only—the [`@imgly/idml-importer`](https://www.npmjs.com/package/@imgly/idml-importer) page on npm maintains the complete, up-to-date list of supported features and limitations.

## Pre-Import Checklist

Before exporting from InDesign:

1. **Embed all images** - File > Links, select linked images, and choose "Embed Link" from the panel menu
2. **Flatten complex effects** - Some effects may not translate to CE.SDK
3. **Use standard fonts** - Consider using Google Fonts for better compatibility
4. **Export as IDML** - File > Export > InDesign Markup (IDML)

## Troubleshooting

**Import fails silently:** Check the console for error messages. Verify the file is a valid IDML file exported correctly from InDesign.

**Missing images:** Ensure images were embedded in InDesign before exporting. Linked images are replaced with placeholders.

**Text appears with wrong font:** Ensure `addGfontsAssetLibrary()` is called before parsing. If the original font isn't available in Google Fonts, a fallback is used.

**Text is duplicated:** This can happen when text flows between multiple frames. The IDML importer doesn't support linked text frames.

**Embedded PDFs show as placeholders:** Install `@imgly/pdf-importer` and pass `createPdfEmbeddedImporter(PDFParser)` in the `embeddedImporters` option to `IDMLParser.fromFile`. Without the adapter, `<PDF>` and `.ai` embeds fall through to a placeholder image.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support