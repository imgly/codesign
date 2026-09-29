> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Partial Export](./export-save-publish/export/partial-export.md)

---

Export individual design elements, grouped blocks, or specific pages from your
scene server-side using CE.SDK's headless Node.js engine for automated workflows,
batch processing, and backend integrations.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-partial-export-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-partial-export-server-js)

Server-side partial export enables fine-grained control over output generation in headless environments. Export individual images, text blocks, shapes, grouped elements, or specific pages programmatically for asset generation pipelines, automated report creation, or serverless functions. This guide demonstrates how to implement partial exports using CE.SDK's Node.js engine (`@cesdk/node`).

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-partial-export-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { calculateGridLayout } from './utils';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Partial Export
 *
 * Demonstrates exporting specific blocks, groups, and pages programmatically:
 * - Exporting individual design blocks
 * - Exporting grouped elements
 * - Exporting specific pages
 * - Export format selection and options
 * - Understanding block hierarchy in exports
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 900 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Calculate responsive grid layout for 6 examples
  const layout = calculateGridLayout(pageWidth, pageHeight, 6);
  const { blockWidth, blockHeight, getPosition } = layout;

  // Sample image URI for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: blockWidth, height: blockHeight };

  // Create first image block
  const imageBlock1 = await engine.block.addImage(imageUri, {
    size: blockSize,
  });
  engine.block.appendChild(page, imageBlock1);

  // Export the block as PNG
  const individualBlob = await engine.block.export(imageBlock1, {
    mimeType: 'image/png',
    pngCompressionLevel: 5,
  });

  // Save individual block export
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const individualBuffer = Buffer.from(await individualBlob.arrayBuffer());
  writeFileSync(`${outputDir}/individual-block.png`, individualBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported individual block to output/individual-block.png');

  // Create second image block with different styling
  const imageBlock2 = await engine.block.addImage(imageUri, {
    size: blockSize,
    cornerRadius: 20,
  });
  engine.block.appendChild(page, imageBlock2);

  // Export as PNG with high compression
  const pngBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/png',
    pngCompressionLevel: 9, // Maximum compression
  });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-png.png`, pngBuffer);

  // Export as JPEG with quality setting
  const jpegBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.95, // High quality
  });
  const jpegBuffer = Buffer.from(await jpegBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-jpeg.jpg`, jpegBuffer);

  // Export as WEBP
  const webpBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/webp',
    webpQuality: 0.9,
  });
  const webpBuffer = Buffer.from(await webpBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-webp.webp`, webpBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported different formats (PNG, JPEG, WEBP)');

  // Create two shapes for grouping demonstration
  const groupShape1 = engine.block.create('//ly.img.ubq/graphic');
  const rect = engine.block.createShape('rect');
  engine.block.setShape(groupShape1, rect);
  engine.block.setWidth(groupShape1, blockWidth * 0.4);
  engine.block.setHeight(groupShape1, blockHeight * 0.4);
  const groupFill1 = engine.block.createFill('color');
  engine.block.setFill(groupShape1, groupFill1);
  engine.block.setColor(groupFill1, 'fill/color/value', {
    r: 0.3,
    g: 0.6,
    b: 0.9,
    a: 1.0,
  });
  engine.block.appendChild(page, groupShape1);

  const groupShape2 = engine.block.create('//ly.img.ubq/graphic');
  const ellipse = engine.block.createShape('ellipse');
  engine.block.setShape(groupShape2, ellipse);
  engine.block.setWidth(groupShape2, blockWidth * 0.4);
  engine.block.setHeight(groupShape2, blockHeight * 0.4);
  const groupFill2 = engine.block.createFill('color');
  engine.block.setFill(groupShape2, groupFill2);
  engine.block.setColor(groupFill2, 'fill/color/value', {
    r: 0.9,
    g: 0.3,
    b: 0.5,
    a: 1.0,
  });
  engine.block.appendChild(page, groupShape2);

  // Group the blocks together
  const exportGroup = engine.block.group([groupShape1, groupShape2]);

  // Export the group (includes all children)
  const groupBlob = await engine.block.export(exportGroup, {
    mimeType: 'image/png',
  });
  const groupBuffer = Buffer.from(await groupBlob.arrayBuffer());
  writeFileSync(`${outputDir}/group-export.png`, groupBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported grouped elements to output/group-export.png');

  // Create shape block for resizing demonstration
  const shapeBlock = engine.block.create('//ly.img.ubq/graphic');
  const shape = engine.block.createShape('star');
  engine.block.setShape(shapeBlock, shape);
  engine.block.setWidth(shapeBlock, blockWidth);
  engine.block.setHeight(shapeBlock, blockHeight);

  // Add a color fill to the shape
  const shapeFill = engine.block.createFill('color');
  engine.block.setFill(shapeBlock, shapeFill);
  engine.block.setColor(shapeFill, 'fill/color/value', {
    r: 1.0,
    g: 0.7,
    b: 0.0,
    a: 1.0,
  });
  engine.block.appendChild(page, shapeBlock);

  // Export with specific target dimensions
  const resizedBlob = await engine.block.export(shapeBlock, {
    mimeType: 'image/png',
    targetWidth: 400,
    targetHeight: 400, // Aspect ratio is preserved
  });
  const resizedBuffer = Buffer.from(await resizedBlob.arrayBuffer());
  writeFileSync(`${outputDir}/resized-export.png`, resizedBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported resized block to output/resized-export.png');

  // Export the entire page
  const pageBlob = await engine.block.export(page, {
    mimeType: 'image/png',
    pngCompressionLevel: 5,
  });
  const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
  writeFileSync(`${outputDir}/page-export.png`, pageBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported current page to output/page-export.png');

  // Export all pages individually (for multi-page documents)
  const pages = engine.scene.getPages();
  for (let i = 0; i < pages.length; i++) {
    const pageBlob = await engine.block.export(pages[i], {
      mimeType: 'image/png',
    });
    const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
    writeFileSync(`${outputDir}/page-${i + 1}.png`, pageBuffer);
  }
  // eslint-disable-next-line no-console
  console.log(`✓ Exported ${pages.length} page(s) individually`);

  // Export as PDF to preserve vector information
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf',
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export.pdf`, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported page as PDF to output/export.pdf');

  // Get maximum export size
  const maxExportSize = engine.editor.getMaxExportSize();
  // eslint-disable-next-line no-console
  console.log('Maximum export size:', maxExportSize, 'pixels');

  // Get available memory
  const availableMemory = engine.editor.getAvailableMemory();
  // eslint-disable-next-line no-console
  console.log('Available memory:', availableMemory, 'bytes');

  // Position all blocks in grid layout for the first page
  const blocks = [
    imageBlock1,
    imageBlock2,
    exportGroup,
    shapeBlock,
    groupShape1,
    groupShape2,
  ];
  blocks.forEach((block, index) => {
    if (index < 4) {
      // Position first 4 blocks (group contains 2)
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    }
  });

  // Position grouped shapes relative to group
  const groupPos = getPosition(2);
  engine.block.setPositionX(exportGroup, groupPos.x);
  engine.block.setPositionY(exportGroup, groupPos.y);
  engine.block.setPositionX(groupShape1, 10);
  engine.block.setPositionY(groupShape1, 10);
  engine.block.setPositionX(groupShape2, 60);
  engine.block.setPositionY(groupShape2, 60);

  // Export the complete scene for reference
  const completeBlob = await engine.block.export(page, {
    mimeType: 'image/png',
  });
  const completeBuffer = Buffer.from(await completeBlob.arrayBuffer());
  writeFileSync(`${outputDir}/partial-export-result.png`, completeBuffer);

  // eslint-disable-next-line no-console
  console.log(
    '\n✓ Exported complete result to output/partial-export-result.png'
  );
  // eslint-disable-next-line no-console
  console.log('✓ Partial export examples completed successfully');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers exporting individual blocks, grouped elements, and pages in Node.js environments, saving outputs to the file system or cloud storage.

## Server-side vs Browser Differences

### Engine Initialization

Server-side uses the `@cesdk/node` package and `CreativeEngine.init()` instead of browser's `@cesdk/cesdk-js` and `CreativeEditorSDK.create()`. The Node.js engine runs headlessly without UI components.

```typescript highlight-initialize-engine
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});
```

## Understanding Block Hierarchy and Export

### How Block Hierarchy Affects Exports

CE.SDK organizes content in a tree structure: Scene → Pages → Groups → Individual Blocks. When you export a block, the export automatically includes all child elements in the hierarchy.

Exporting a page exports every element on that page. Exporting a group exports all blocks within that group. Exporting an individual block (like an image or text) exports only that specific element.

This hierarchical behavior lets you control export scope by choosing which level of the hierarchy to target. Export an image block for a single asset. Export a parent group for a complete layout section.

> **Note:** Only blocks that belong to the scene hierarchy can be exported. Orphaned blocks
> (created but not added to the page) cannot be exported until they're attached
> to the scene tree.

### Export Behavior

The export API applies several transformations to ensure consistent output. If the exported block itself is rotated, it will be exported without that rotation—the content appears upright in the output file. Any margin set on the block is included in the export bounds. Outside strokes are included for most block types.

## Exporting Individual Blocks

### Basic Block Export

Once we have a scene, we can export individual blocks. Find blocks using `findByType()`, then export them with specific format options.

```typescript highlight-export-individual-block
  // Create first image block
  const imageBlock1 = await engine.block.addImage(imageUri, {
    size: blockSize,
  });
  engine.block.appendChild(page, imageBlock1);

  // Export the block as PNG
  const individualBlob = await engine.block.export(imageBlock1, {
    mimeType: 'image/png',
    pngCompressionLevel: 5,
  });

  // Save individual block export
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const individualBuffer = Buffer.from(await individualBlob.arrayBuffer());
  writeFileSync(`${outputDir}/individual-block.png`, individualBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported individual block to output/individual-block.png');
```

The `mimeType` determines the output format. CE.SDK supports PNG, JPEG, WEBP, and PDF. Each format has specific options—PNG uses `pngCompressionLevel` (0-9), JPEG uses `jpegQuality` (0-1), and WEBP uses `webpQuality` (0-1).

PNG supports transparency for UI elements and logos. JPEG suits photographs without transparency needs (replaces transparent areas with solid background). WEBP offers better compression for web delivery. PDF preserves vector data for print workflows. PNG compression (0-9) balances size and encoding speed. JPEG quality (0-1) controls artifacts and file size. WEBP quality (0-1) achieves smallest files with good visual fidelity.

## Exporting with Different Options

### Resizing Exports

Control output dimensions using `targetWidth` and `targetHeight`. The engine maintains the block's aspect ratio while fitting within your specified dimensions. Specify one dimension to auto-calculate the other while preserving aspect ratio. Specify both to fit content within bounds (one dimension may be smaller to maintain proportions). Useful for thumbnails, responsive sizes, or platform constraints.

### Checking Export Constraints

Server environments may have memory limits or maximum texture size constraints. Query these limits before attempting large exports. `getMaxExportSize()` returns maximum dimension in pixels (exceeding causes errors). `getAvailableMemory()` returns available memory in bytes for estimating large export viability. This is critical for memory-constrained deployments, such as serverless functions with the WASM package (AWS Lambda allows 128 MB to 10 GB), to prevent termination. Note that Lambda is not supported by `@cesdk/node-native`.

## Exporting Pages

### Single Page Export

Exporting a page captures all content on that page as a single output. The page dimensions determine the export size.

```typescript highlight-export-current-page
// Export the entire page
const pageBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 5,
});
const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
writeFileSync(`${outputDir}/page-export.png`, pageBuffer);
// eslint-disable-next-line no-console
console.log('✓ Exported current page to output/page-export.png');
```

Page exports include all child elements—graphics, text, shapes, and groups. The page background fill is also included. This is useful for generating preview images of multi-page documents or exporting individual pages from a template.

### Multi-page Document Export

For documents with multiple pages, export each page individually to create separate output files.

```typescript highlight-export-multiple-pages
// Export all pages individually (for multi-page documents)
const pages = engine.scene.getPages();
for (let i = 0; i < pages.length; i++) {
  const pageBlob = await engine.block.export(pages[i], {
    mimeType: 'image/png',
  });
  const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
  writeFileSync(`${outputDir}/page-${i + 1}.png`, pageBuffer);
}
// eslint-disable-next-line no-console
console.log(`✓ Exported ${pages.length} page(s) individually`);
```

The `getPages()` method returns all pages in scene order. Export each page with sequential numbering for easy identification. This pattern works for generating page previews, creating print-ready files for each page, or splitting multi-page documents into individual images.

For print workflows, consider exporting pages as PDF to preserve vector information and text quality. For web previews, PNG or WEBP provides good quality at manageable file sizes.

## PDF Exports

### Vector Format Output

PDF exports preserve vector information, making them ideal for print workflows, scalable graphics, or archival purposes.

```typescript highlight-export-as-pdf
// Export as PDF to preserve vector information
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
});
const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
writeFileSync(`${outputDir}/export.pdf`, pdfBuffer);
// eslint-disable-next-line no-console
console.log('✓ Exported page as PDF to output/export.pdf');
```

PDF preserves vector paths, text selectability, and transparency. Produces smaller files than high-resolution PNG for vector-heavy content. Preferred for professional printing (scalability, text editability). Use PNG or WEBP for fixed-dimension web delivery.

## Practical Use Cases

### Asset Generation Pipeline

Generate social media assets from templates by loading a template, modifying text/images programmatically, and exporting different sizes.

```typescript
const engine = await CreativeEngine.init(config);
await engine.scene.load('https://example.com/template.scene');

// Customize content
const textBlocks = engine.block.findByType('//ly.img.ubq/text');
engine.block.setString(textBlocks[0], 'text/text', 'Custom Headline');

// Export multiple sizes
const page = engine.block.findByType('page')[0];

const instagram = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1080,
  targetHeight: 1080
});

const facebook = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1200,
  targetHeight: 630
});

const twitter = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1200,
  targetHeight: 675
});
```

This workflow is ideal for automated social media content generation, email campaign graphics, or personalized marketing materials.

### Thumbnail Generation

Generate thumbnails for preview grids by exporting pages or blocks with small target dimensions.

```typescript
const pages = engine.scene.getPages();

for (const page of pages) {
  const thumbnail = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: 0.8,
    targetWidth: 300,
    targetHeight: 300
  });

  // Save or upload thumbnail
}
```

Small dimensions and lower quality settings (0.7-0.8) produce small file sizes suitable for fast loading in preview galleries.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.export()` | Export a block with specified format and quality options |
| `engine.block.findByType()` | Find blocks by type identifier |
| `engine.block.group()` | Group multiple blocks into a single logical unit |
| `engine.scene.getPages()` | Get all pages in the current scene |
| `engine.editor.getMaxExportSize()` | Get maximum export dimension in pixels |
| `engine.editor.getAvailableMemory()` | Get available engine memory in bytes |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support