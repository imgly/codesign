> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md) > [From Photoshop](./open-the-editor/import-design/from-photoshop.md)

---

Convert Adobe Photoshop (PSD) files to CE.SDK scene archives at build-time using Node.js. This approach is ideal for migrating existing template libraries or integrating PSD conversion into CI/CD pipelines.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-import-design-from-photoshop-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-import-design-from-photoshop-server-js)

The `@imgly/psd-importer` package converts Photoshop files into CE.SDK scene format on the server, allowing you to distribute pre-converted templates without client-side processing. This guide covers batch conversion of PSD template files to CE.SDK scene archives that can be shipped with your product. For enabling end-users to upload PSD files directly in the browser, see the [browser guide](./open-the-editor/import-design/from-photoshop.md).

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-from-photoshop-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/psd-importer';
import {
  PSDParser,
  createPNGJSEncodeBufferToPNG,
  addGfontsAssetLibrary
} from '@imgly/psd-importer';
import { PNG } from 'pngjs';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();

// Optional: Create a custom font resolver for advanced font mapping
// Use this when you need to map Photoshop fonts to specific alternatives,
// use enterprise fonts, or implement custom fallback logic
const customFontResolver: TypefaceResolver = async (fontParams, engine) => {
  const { family, style, weight } = fontParams;

  // Define font mappings from Photoshop fonts to available alternatives
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
 * Convert a single PSD file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertPsd(
  engine: InstanceType<typeof CreativeEngine>,
  psdPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  warnings: string[];
  errors: string[];
}> {
  // Read the PSD file
  const psdBuffer = await fs.readFile(psdPath);

  // Create parser with Node.js PNG encoder
  // The addGfontsAssetLibrary() call enables automatic font matching
  // For custom font mapping, pass fontResolver in options (see customFontResolver example)
  // Note: Cast engine to any because psd-importer types expect browser engine
  const parser = await PSDParser.fromFile(
    engine as any,
    psdBuffer.buffer,
    createPNGJSEncodeBufferToPNG(PNG),
    // Pass fontResolver for advanced font mapping
    { fontResolver: customFontResolver }
  );

  // Parse the PSD file
  const result = await parser.parse();

  // Extract warnings and errors from logger
  const messages = result.logger.getMessages();
  const warnings = messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);
  const errors = messages
    .filter((m) => m.type === 'error')
    .map((m) => m.message);

  if (errors.length > 0) {
    console.error(`  Errors: ${errors.length}`);
  }
  if (warnings.length > 0) {
    console.warn(`  Warnings: ${warnings.length}`);
  }

  // Generate output filename from input filename
  const inputName = basename(psdPath, '.psd');
  const archivePath = join(outputDir, `${inputName}.imgly`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, PSD images use transient buffer:// URLs that only work with saveToArchive()
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

  return { archivePath, sceneStringPath, warnings, errors };
}

/**
 * Batch convert multiple PSD files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertPsds(
  psdPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${psdPaths.length} PSD files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // Note: Cast engine to any because psd-importer types expect browser engine
    await addGfontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each PSD file
    for (const psdPath of psdPaths) {
      const fileName = basename(psdPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath, warnings, errors } =
          await convertPsd(engine, psdPath, outputDir);

        // Log results
        if (errors.length > 0) {
          console.log(`  Errors: ${errors.length}`);
          errors.forEach((e) => console.log(`    - ${e}`));
        }
        if (warnings.length > 0) {
          console.log(`  Warnings: ${warnings.length}`);
          warnings.forEach((w) => console.log(`    - ${w}`));
        }

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${psdPaths.length}`);
    console.log(`  Failed: ${failCount}/${psdPaths.length}`);
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
 * Find all PSD files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all PSD files in directory
  const files = await fs.readdir(inputDir);
  const psdFiles = files
    .filter((f) => f.toLowerCase().endsWith('.psd'))
    .map((f) => join(inputDir, f));

  if (psdFiles.length === 0) {
    console.log(`No PSD files found in ${inputDir}`);
    return;
  }

  await batchConvertPsds(psdFiles, outputDir);
}

/**
 * Main entry point - demonstrates batch PSD conversion workflow
 */
async function main(): Promise<void> {
  console.log('PSD to CE.SDK Batch Converter');
  console.log('=============================\n');

  // Example: Convert a single PSD file
  // In production, you would provide actual PSD files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGfontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual PSD conversion
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
    console.log('\nTo convert actual PSD files:');
    console.log('1. Place PSD files in an input directory');
    console.log('2. Call: await processDirectory("./input", "./output")');
  } finally {
    engine.dispose();
  }
}

// Run the example
main().catch(console.error);
```

## Installation

Install the `@imgly/psd-importer` package alongside the CE.SDK Node.js engine and the `pngjs` package for PNG encoding:

```bash
npm install @imgly/psd-importer @cesdk/node@$UBQ_VERSION$ pngjs
```

Using the native Node.js package? Install `@cesdk/node-native@$UBQ_VERSION$` instead of `@cesdk/node` — the engine API is identical.

The server environment requires `pngjs` because Node.js doesn't have native browser APIs for PNG encoding. The `createPNGJSEncodeBufferToPNG(PNG)` function provides this capability.

## Convert Your First PSD

Convert a PSD file to a CE.SDK archive with just a few lines of code:

```typescript
import CreativeEngine from '@cesdk/node';
import { PSDParser, createPNGJSEncodeBufferToPNG } from '@imgly/psd-importer';
import { PNG } from 'pngjs';
import { promises as fs } from 'fs';

// Initialize the engine
const engine = await CreativeEngine.init({});

// Read and parse the PSD file
const psdBuffer = await fs.readFile('./design.psd');
const parser = await PSDParser.fromFile(
  engine as any,
  psdBuffer.buffer,
  createPNGJSEncodeBufferToPNG(PNG)
);
await parser.parse();

// Save as a portable archive
const archive = await engine.scene.saveToArchive();
await fs.writeFile('./design.imgly', Buffer.from(await archive.arrayBuffer()));

// Clean up
engine.dispose();
```

This minimal example reads a PSD file, converts it to a CE.SDK scene, and saves it as an archive. The archive can be loaded in any CE.SDK environment (browser or server). The following sections cover font handling, batch processing, and validation.

## Supported Elements

The PSD importer preserves the following Photoshop elements:

- **Layer structure** - Groups and layer hierarchy
- **Positioning** - X/Y coordinates, rotation, and transparency
- **Text elements** - Font family, bold/italic styles (single style per layer)
- **Shapes** - Rectangles, ovals, polygons, lines, and custom shapes
- **Fills** - Solid color fills and strokes (weight, color, alignment)
- **Images** - Raster image layers (without cropping)

## Setting Up the Conversion Environment

Initialize the CE.SDK Node.js engine and configure Google Fonts support before processing PSD files:

```typescript highlight=highlight-setup
import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/psd-importer';
import {
  PSDParser,
  createPNGJSEncodeBufferToPNG,
  addGfontsAssetLibrary
} from '@imgly/psd-importer';
import { PNG } from 'pngjs';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();
```

The `pngjs` package provides the `PNG` constructor needed for `createPNGJSEncodeBufferToPNG()`. We use `dotenv` to load environment variables like the license key.

## Converting a Single PSD File

Read a PSD file, parse it using the PSD importer, and save the resulting scene as an archive:

```typescript highlight=highlight-convert-single
/**
 * Convert a single PSD file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertPsd(
  engine: InstanceType<typeof CreativeEngine>,
  psdPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  warnings: string[];
  errors: string[];
}> {
  // Read the PSD file
  const psdBuffer = await fs.readFile(psdPath);

  // Create parser with Node.js PNG encoder
  // The addGfontsAssetLibrary() call enables automatic font matching
  // For custom font mapping, pass fontResolver in options (see customFontResolver example)
  // Note: Cast engine to any because psd-importer types expect browser engine
  const parser = await PSDParser.fromFile(
    engine as any,
    psdBuffer.buffer,
    createPNGJSEncodeBufferToPNG(PNG),
    // Pass fontResolver for advanced font mapping
    { fontResolver: customFontResolver }
  );

  // Parse the PSD file
  const result = await parser.parse();

  // Extract warnings and errors from logger
  const messages = result.logger.getMessages();
  const warnings = messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);
  const errors = messages
    .filter((m) => m.type === 'error')
    .map((m) => m.message);

  if (errors.length > 0) {
    console.error(`  Errors: ${errors.length}`);
  }
  if (warnings.length > 0) {
    console.warn(`  Warnings: ${warnings.length}`);
  }

  // Generate output filename from input filename
  const inputName = basename(psdPath, '.psd');
  const archivePath = join(outputDir, `${inputName}.imgly`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, PSD images use transient buffer:// URLs that only work with saveToArchive()
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

  return { archivePath, sceneStringPath, warnings, errors };
}
```

The `convertPSDToArchive` function:

1. Reads the PSD file from disk as a buffer
2. Creates a parser instance with the Node.js PNG encoder
3. Parses the PSD, creating a scene in the engine
4. Extracts warnings and errors from the logger
5. Saves the scene as an `.imgly` archive file

## Batch Converting Multiple PSD Files

Process multiple PSD files sequentially, continuing even if individual files fail:

```typescript highlight=highlight-batch-convert
/**
 * Batch convert multiple PSD files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertPsds(
  psdPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${psdPaths.length} PSD files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // Note: Cast engine to any because psd-importer types expect browser engine
    await addGfontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each PSD file
    for (const psdPath of psdPaths) {
      const fileName = basename(psdPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath, warnings, errors } =
          await convertPsd(engine, psdPath, outputDir);

        // Log results
        if (errors.length > 0) {
          console.log(`  Errors: ${errors.length}`);
          errors.forEach((e) => console.log(`    - ${e}`));
        }
        if (warnings.length > 0) {
          console.log(`  Warnings: ${warnings.length}`);
          warnings.forEach((w) => console.log(`    - ${w}`));
        }

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${psdPaths.length}`);
    console.log(`  Failed: ${failCount}/${psdPaths.length}`);
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

Scan a directory for PSD files and convert all of them:

```typescript highlight=highlight-process-directory
/**
 * Find all PSD files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all PSD files in directory
  const files = await fs.readdir(inputDir);
  const psdFiles = files
    .filter((f) => f.toLowerCase().endsWith('.psd'))
    .map((f) => join(inputDir, f));

  if (psdFiles.length === 0) {
    console.log(`No PSD files found in ${inputDir}`);
    return;
  }

  await batchConvertPsds(psdFiles, outputDir);
}
```

This function finds all `.psd` files in the input directory and processes them as a batch.

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
 * Main entry point - demonstrates batch PSD conversion workflow
 */
async function main(): Promise<void> {
  console.log('PSD to CE.SDK Batch Converter');
  console.log('=============================\n');

  // Example: Convert a single PSD file
  // In production, you would provide actual PSD files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGfontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual PSD conversion
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
    console.log('\nTo convert actual PSD files:');
    console.log('1. Place PSD files in an input directory');
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

## Saving Scenes with Stable URLs

By default, the PSD importer creates internal `buffer://` URLs for imported images. These are transient resources that work well when saving to an archive (`engine.scene.saveToArchive()`), which bundles all assets together.

However, if you want to save scenes as JSON strings (`engine.scene.saveToString()`) with stable, permanent URLs (e.g., for storing in a database or referencing CDN-hosted assets), you need to relocate the transient resources first.

### Why Relocate?

- **Scene Archives** (`saveToArchive`): Include all assets in a single ZIP file. Transient `buffer://` URLs work fine.
- **Scene Strings** (`saveToString`): Only contain references to assets. Transient URLs won't work when reloading the scene later. You need permanent URLs (e.g., `https://`).

### How to Relocate Transient Resources

After parsing the PSD file, use CE.SDK's native APIs to find and relocate all transient resources:

```typescript highlight=highlight-stable-urls
  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, PSD images use transient buffer:// URLs that only work with saveToArchive()
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

## API Reference

The `@imgly/psd-importer` package exports the following key APIs:

| API | Description |
|-----|-------------|
| `PSDParser.fromFile(engine, buffer, encoder, options?)` | Creates a parser instance from a PSD file buffer. Returns a parser with a `parse()` method. |
| `createPNGJSEncodeBufferToPNG(PNG)` | Creates a PNG encoder for Node.js using the `pngjs` library. Pass the `PNG` constructor from `pngjs`. |
| `addGfontsAssetLibrary(engine)` | Registers Google Fonts as a font source for text element matching. Call before parsing. |
| `TypefaceResolver` | Type for custom font resolver functions. Receives font parameters and returns a matching typeface/font pair. |
| `options.fontResolver` | `TypefaceResolver` - Custom function to resolve fonts from the PSD to available typefaces. |
| `result.logger.getMessages()` | Returns an array of import messages with `type` ('warning' or 'error') and `message` properties. |

**Type Casting Note:** The `@imgly/psd-importer` types expect the browser engine. When using `@cesdk/node` or `@cesdk/node-native`, cast the engine: `PSDParser.fromFile(engine as any, ...)`.

## Limitations

The PSD importer has the following limitations:

- **Groups** - Limited support, especially for single-member groups
- **Text** - No multiple font sizes or families within a single text layer; no text justification
- **Images** - Image cropping not supported
- **Fills** - Gradient fills not supported (solid colors only)
- **Blend modes** - Some Photoshop blend modes are not supported (for example PassThrough, Dissolve and Subtract)
- **Advanced text** - Advanced text styling such as kerning, ligatures and baseline shift is not fully supported

These are the highlights only—the [`@imgly/psd-importer`](https://www.npmjs.com/package/@imgly/psd-importer) page on npm maintains the complete, up-to-date list of supported features and limitations.

## Troubleshooting

**Conversion fails silently:** Check the logger messages from `result.logger.getMessages()`. The batch conversion functions log warnings and errors for each file.

**Text appears with wrong font:** Ensure `addGfontsAssetLibrary()` is called before parsing. The importer attempts to match fonts with Google Fonts and uses a fallback for unavailable fonts.

**Memory issues with large files:** Very large files may encounter memory constraints, especially with the WASM-based `@cesdk/node` package and its WebAssembly memory ceiling — the native `@cesdk/node-native` package can use the full process memory. The importer gracefully skips problematic elements. `--max-old-space-size` raises only the V8 heap limit, not the engine's own memory.

**Type errors with engine parameter:** The `@imgly/psd-importer` types expect the browser engine. Cast to `any` when using `@cesdk/node` or `@cesdk/node-native`: `PSDParser.fromFile(engine as any, ...)`.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support