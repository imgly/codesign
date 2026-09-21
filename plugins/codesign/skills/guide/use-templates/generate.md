> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Generate From Template](./use-templates/generate.md)

---

Generate finished designs from templates by loading, populating variables, and exporting to images, PDFs, or videos programmatically.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-use-templates-generate-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-use-templates-generate-server-js)

Template generation transforms templates into finished designs by populating data and exporting to output formats. Load templates with `engine.scene.load()`, set variables with `engine.variable.setString()`, and export with `engine.block.export()`. This enables batch processing, personalization systems, and automated design production.

```typescript file=@cesdk_web_examples/guides-use-templates-generate-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Generate From Template
 *
 * Demonstrates how to generate finished designs from templates:
 * - Loading templates from URLs
 * - Populating template variables
 * - Finding and updating placeholder content
 * - Exporting to images and PDFs
 * - Batch generation workflows
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {

    // Load a template from URL - this template has visible {{variable}} placeholders
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene'
    );
    console.log('Template loaded from URL');

    // Discover available variables in the template
    const allVariables = engine.variable.findAll();
    console.log('Available variables:', allVariables);

    // Set variable values to replace {{variableName}} placeholders
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');
    console.log('Variables populated');

    // Find all placeholder blocks in the template
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Find specific blocks by name
    const namedBlocks = engine.block.findByName('Image');
    if (namedBlocks.length > 0) {
      console.log('Found image block by name:', namedBlocks[0]);
    }

    // Update image placeholder content
    const imageBlocks = engine.block.findByName('Image');
    if (imageBlocks.length > 0) {
      const imageBlock = imageBlocks[0];
      const fill = engine.block.getFill(imageBlock);
      engine.block.setString(
        fill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_4.jpg'
      );
      console.log('Image placeholder updated');
    }

    // Export the populated template to PNG
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(`${outputDir}/greeting-card.png`, buffer);
      console.log('Exported to output/greeting-card.png');
    }

    // Export to PDF format
    const scene = engine.scene.get();
    if (scene !== null) {
      const pdfBlob = await engine.block.export(scene, {
        mimeType: 'application/pdf'
      });
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
      writeFileSync(`${outputDir}/greeting-card.pdf`, pdfBuffer);
      console.log('Exported to output/greeting-card.pdf');
    }

    // Demonstrate batch generation workflow
    // Save template for reuse
    const templateString = await engine.scene.saveToString();
    console.log('Template saved for batch processing');

    // Process multiple data records
    const dataRecords = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        city: 'Paris',
        address: '10 Rue de Rivoli'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        city: 'London',
        address: '221B Baker Street'
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        city: 'Tokyo',
        address: '1-1 Shibuya'
      }
    ];

    for (let i = 0; i < dataRecords.length; i++) {
      const record = dataRecords[i];

      // Reload template for each record
      await engine.scene.load(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      // Export each personalized version
      const batchPages = engine.block.findByType('page');
      if (batchPages.length > 0) {
        const batchPage = batchPages[0];
        const batchBlob = await engine.block.export(batchPage, {
          mimeType: 'image/png'
        });
        const batchBuffer = Buffer.from(await batchBlob.arrayBuffer());
        writeFileSync(
          `${outputDir}/batch-${record.firstName.toLowerCase()}.png`,
          batchBuffer
        );
        console.log(
          `Exported batch image for: ${record.firstName} ${record.lastName}`
        );
      }
    }

    console.log(`Batch processed ${dataRecords.length} records`);
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to load templates, populate variables, update placeholder content, and export to various formats including batch generation workflows.

## Loading Templates

`engine.scene.load()` accepts a URL to a scene or archive file, or a serialized scene string.

```typescript highlight=highlight-load-template
// Load a template from URL - this template has visible {{variable}} placeholders
await engine.scene.load(
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene'
);
console.log('Template loaded from URL');
```

## Populating Variables

CE.SDK's variable system allows you to set values that replace `{{variableName}}` placeholders throughout the template. Before setting variables, you can discover what variables are available using `engine.variable.findAll()`.

### Discover Available Variables

Find all variables defined in a template to understand what data can be populated.

```typescript highlight=highlight-discover-variables
// Discover available variables in the template
const allVariables = engine.variable.findAll();
console.log('Available variables:', allVariables);
```

### Set Variable Values

Use `engine.variable.setString()` to assign values that automatically replace placeholders in text blocks.

```typescript highlight=highlight-populate-variables
// Set variable values to replace {{variableName}} placeholders
engine.variable.setString('first_name', 'Alice');
engine.variable.setString('last_name', 'Smith');
engine.variable.setString('city', 'Paris');
engine.variable.setString('address', '10 Rue de Rivoli');
console.log('Variables populated');
```

## Updating Placeholder Content

Beyond variables, templates often contain placeholder blocks for images and other content. Find these blocks using `engine.block.findByName()` or `engine.block.findAllPlaceholders()`.

```typescript highlight=highlight-find-placeholders
    // Find all placeholder blocks in the template
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Find specific blocks by name
    const namedBlocks = engine.block.findByName('Image');
    if (namedBlocks.length > 0) {
      console.log('Found image block by name:', namedBlocks[0]);
    }
```

### Update Image Placeholders

Locate image blocks and modify their fill URI using `engine.block.getFill()` and `engine.block.setString()` on the `'fill/image/imageFileURI'` property.

```typescript highlight=highlight-update-image
// Update image placeholder content
const imageBlocks = engine.block.findByName('Image');
if (imageBlocks.length > 0) {
  const imageBlock = imageBlocks[0];
  const fill = engine.block.getFill(imageBlock);
  engine.block.setString(
    fill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  console.log('Image placeholder updated');
}
```

## Exporting to Images

Generate image outputs using `engine.block.export()` with options for format, resolution, and quality. Find the page to export with `engine.block.findByType('page')`.

```typescript highlight=highlight-export-image
    // Export the populated template to PNG
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(`${outputDir}/greeting-card.png`, buffer);
      console.log('Exported to output/greeting-card.png');
    }
```

You can configure export options including `targetWidth` and `targetHeight` for output resolution, `pngCompressionLevel` for PNG files (0-9), and `jpegQuality` for JPEG files (0-1).

## Exporting to PDF

Use `mimeType: 'application/pdf'` to generate PDF documents from design scenes. For multi-page documents, export the scene block rather than individual pages.

```typescript highlight=highlight-export-pdf
// Export to PDF format
const scene = engine.scene.get();
if (scene !== null) {
  const pdfBlob = await engine.block.export(scene, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/greeting-card.pdf`, pdfBuffer);
  console.log('Exported to output/greeting-card.pdf');
}
```

## Batch Generation Workflows

Process multiple data records through a single template. Save the template once with `engine.scene.saveToString()`, then loop through records—reloading the template with `engine.scene.load()`, populating variables, and exporting for each iteration.

```typescript highlight=highlight-batch-generation
    // Demonstrate batch generation workflow
    // Save template for reuse
    const templateString = await engine.scene.saveToString();
    console.log('Template saved for batch processing');

    // Process multiple data records
    const dataRecords = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        city: 'Paris',
        address: '10 Rue de Rivoli'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        city: 'London',
        address: '221B Baker Street'
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        city: 'Tokyo',
        address: '1-1 Shibuya'
      }
    ];

    for (let i = 0; i < dataRecords.length; i++) {
      const record = dataRecords[i];

      // Reload template for each record
      await engine.scene.load(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      // Export each personalized version
      const batchPages = engine.block.findByType('page');
      if (batchPages.length > 0) {
        const batchPage = batchPages[0];
        const batchBlob = await engine.block.export(batchPage, {
          mimeType: 'image/png'
        });
        const batchBuffer = Buffer.from(await batchBlob.arrayBuffer());
        writeFileSync(
          `${outputDir}/batch-${record.firstName.toLowerCase()}.png`,
          batchBuffer
        );
        console.log(
          `Exported batch image for: ${record.firstName} ${record.lastName}`
        );
      }
    }

    console.log(`Batch processed ${dataRecords.length} records`);
```

## Cleanup

Always dispose of the engine when finished to free resources. Use a try-finally block to ensure cleanup happens even if errors occur.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Troubleshooting

### Template Loading Fails

Verify URL accessibility and scene format version compatibility. Wrap loading calls in try-catch blocks to handle network or parsing errors. Ensure the URL returns valid scene data and not HTML or other content.

### Variables Not Updating

Ensure variable names in text blocks (within `{{}}`) exactly match keys passed to `engine.variable.setString()`. Variable names are case-sensitive. Use `engine.variable.findAll()` to discover available variable names.

### Export Returns Empty or Corrupted Output

Confirm all required assets are accessible before exporting. Check that blocks are attached to the page hierarchy—orphaned blocks won't appear in exports. Verify the page has visible content by checking block visibility states.

### Image Placeholders Not Found

Verify the exact name string matches what's set in the template. Names are case-sensitive. Use `engine.block.findAllPlaceholders()` to discover all placeholder blocks in the scene.

## API Reference

| Method | Description |
|--------|-------------|
| `scene.load(sceneOrURL)` | Load a template from a URL (scene or archive, detected automatically) or a serialized string |
| `scene.saveToString()` | Serialize scene for batch processing |
| `variable.setString(name, value)` | Set text variable value |
| `variable.getString(name)` | Retrieve current variable value |
| `variable.findAll()` | List all variable names in scene |
| `block.findByName(name)` | Find blocks by name identifier |
| `block.findByType(type)` | Find blocks by type (e.g., 'page') |
| `block.findAllPlaceholders()` | Discover all placeholder blocks |
| `block.getFill(block)` | Get fill block from graphic block |
| `block.setString(block, property, value)` | Set string properties like image URIs |
| `block.export(block, options)` | Export block to image or PDF blob |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support