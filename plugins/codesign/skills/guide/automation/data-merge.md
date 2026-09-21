> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Data Merge](./automation/data-merge.md)

---

Generate personalized designs at scale using CE.SDK's headless Node.js API to batch process templates with external data.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-automation-data-merge-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-automation-data-merge-server-js)

Data merge generates multiple personalized designs from a single template by replacing variable content with external data. Server-side processing enables batch operations for certificates, badges, team cards, or any design requiring consistent layout with varying content.

```typescript file=@cesdk_web_examples/guides-automation-data-merge-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Data Merge
 *
 * Demonstrates batch processing of personalized designs:
 * - Loading templates with text variables
 * - Setting variable values from data records
 * - Finding and updating placeholder blocks by name
 * - Exporting personalized designs to PNG
 * - Processing multiple records in a batch
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Sample data records for the merge operation
  // In production, this data would come from a CSV, database, or API
  const dataRecords = [
    {
      name: 'Alex Smith',
      title: 'Creative Developer',
      email: 'alex.smith@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_1.jpg'
    },
    {
      name: 'Jordan Lee',
      title: 'Product Designer',
      email: 'jordan.lee@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_2.jpg'
    },
    {
      name: 'Taylor Chen',
      title: 'UX Engineer',
      email: 'taylor.chen@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_3.jpg'
    }
  ];

  // Prepare output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Store exported blobs for batch processing results
  const outputs: { name: string; blob: Blob }[] = [];

  // Process each data record
  for (const record of dataRecords) {
    // Create a fresh scene for each record
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 400 } }
    });
    const page = engine.block.findByType('page')[0];

    // Set text variables from the data record
    engine.variable.setString('name', record.name);
    engine.variable.setString('title', record.title);
    engine.variable.setString('email', record.email);

    // Create the template layout with placeholder blocks

    // Create a profile photo block on the left
    const photoBlock = engine.block.create('graphic');
    engine.block.setShape(photoBlock, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(
      photoFill,
      'fill/image/imageFileURI',
      record.photoUrl
    );
    engine.block.setFill(photoBlock, photoFill);
    engine.block.setWidth(photoBlock, 150);
    engine.block.setHeight(photoBlock, 150);
    engine.block.setPositionX(photoBlock, 50);
    engine.block.setPositionY(photoBlock, 125);
    engine.block.setName(photoBlock, 'profile-photo');
    engine.block.appendChild(page, photoBlock);

    // Create a text block with variable bindings
    const textBlock = engine.block.create('text');
    const textContent = `{{name}}
{{title}}
{{email}}`;
    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 32);
    engine.block.setPositionX(textBlock, 230);
    engine.block.setPositionY(textBlock, 140);
    engine.block.appendChild(page, textBlock);

    // Verify which variables exist in the scene
    const variables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log(`Processing ${record.name}, variables:`, variables);

    // Check if the text block references any variables
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    // eslint-disable-next-line no-console
    console.log(`Text block has variables: ${hasVariables}`);

    // Export the personalized design to PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });

    // Save the result
    const filename = record.name.toLowerCase().replace(/\s+/g, '-');
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}.png`, buffer);

    outputs.push({ name: record.name, blob });
    // eslint-disable-next-line no-console
    console.log(`✓ Exported ${filename}.png`);
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n✓ Batch complete: ${outputs.length} designs exported to ${outputDir}/`
  );
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to prepare data, build templates with variables, and process multiple records in a batch workflow.

## Initialize the Engine

We start by initializing the headless Creative Engine. In production, you would typically pass your license key.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Prepare Data Records

Data typically comes from a CSV file, database query, or API response. Here we define sample records with the fields we want to merge into the template.

```typescript highlight=highlight-sample-data
// Sample data records for the merge operation
// In production, this data would come from a CSV, database, or API
const dataRecords = [
  {
    name: 'Alex Smith',
    title: 'Creative Developer',
    email: 'alex.smith@example.com',
    photoUrl: 'https://img.ly/static/ubq_samples/sample_1.jpg'
  },
  {
    name: 'Jordan Lee',
    title: 'Product Designer',
    email: 'jordan.lee@example.com',
    photoUrl: 'https://img.ly/static/ubq_samples/sample_2.jpg'
  },
  {
    name: 'Taylor Chen',
    title: 'UX Engineer',
    email: 'taylor.chen@example.com',
    photoUrl: 'https://img.ly/static/ubq_samples/sample_3.jpg'
  }
];
```

Each record contains field names that map to template variables and placeholder blocks.

## Batch Processing Loop

We iterate through each data record, creating a fresh scene for each personalized output. This ensures variable values from previous records don't carry over.

```typescript highlight=highlight-batch-loop
// Process each data record
for (const record of dataRecords) {
  // Create a fresh scene for each record
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];
```

For each record, we create a new scene with the appropriate dimensions for our template design.

## Set Variable Values

We use `engine.variable.setString()` to define the value for each variable. When a variable is set, all text blocks referencing that variable update automatically.

```typescript highlight=highlight-set-variables
// Set text variables from the data record
engine.variable.setString('name', record.name);
engine.variable.setString('title', record.title);
engine.variable.setString('email', record.email);
```

Variable values persist within the current scene. Creating a new scene clears previous variable bindings.

## Build the Template

We create the template layout with placeholder blocks. The profile photo block gets a semantic name using `setName()`. Text blocks use variable placeholders with double curly brace syntax: `{{variableName}}`.

```typescript highlight=highlight-create-template
    // Create the template layout with placeholder blocks

    // Create a profile photo block on the left
    const photoBlock = engine.block.create('graphic');
    engine.block.setShape(photoBlock, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(
      photoFill,
      'fill/image/imageFileURI',
      record.photoUrl
    );
    engine.block.setFill(photoBlock, photoFill);
    engine.block.setWidth(photoBlock, 150);
    engine.block.setHeight(photoBlock, 150);
    engine.block.setPositionX(photoBlock, 50);
    engine.block.setPositionY(photoBlock, 125);
    engine.block.setName(photoBlock, 'profile-photo');
    engine.block.appendChild(page, photoBlock);

    // Create a text block with variable bindings
    const textBlock = engine.block.create('text');
    const textContent = `{{name}}
{{title}}
{{email}}`;
    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 32);
    engine.block.setPositionX(textBlock, 230);
    engine.block.setPositionY(textBlock, 140);
    engine.block.appendChild(page, textBlock);
```

Using semantic names and variables makes templates reusable across different data records.

## Verify Variables

Use `engine.variable.findAll()` to discover which variables exist in the scene. Use `engine.block.referencesAnyVariables()` to check if a specific block contains variable references.

```typescript highlight=highlight-check-variables
    // Verify which variables exist in the scene
    const variables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log(`Processing ${record.name}, variables:`, variables);

    // Check if the text block references any variables
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    // eslint-disable-next-line no-console
    console.log(`Text block has variables: ${hasVariables}`);
```

This is useful for validating that data fields match template requirements before processing.

## Export Each Design

After merging data into the template, export the personalized design using `engine.block.export()`. We save each result to the file system with a unique filename.

```typescript highlight=highlight-export
    // Export the personalized design to PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });

    // Save the result
    const filename = record.name.toLowerCase().replace(/\s+/g, '-');
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}.png`, buffer);

    outputs.push({ name: record.name, blob });
    // eslint-disable-next-line no-console
    console.log(`✓ Exported ${filename}.png`);
```

You can export to PNG, JPEG, WebP, or PDF formats. For high-volume processing, consider writing to cloud storage or a CDN.

## Cleanup Resources

Always dispose of the engine when batch processing completes. Using a `finally` block ensures cleanup happens even if an error occurs during processing.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

This frees memory and other resources held by the engine instance.

## Troubleshooting

### Variables Not Rendering

If variable placeholders show instead of values in exported images:

- Verify the variable name matches exactly (case-sensitive)
- Use `engine.variable.findAll()` to check which variables are defined
- Ensure `engine.variable.setString()` was called before export
- Create a new scene for each record to avoid stale variable state

### Export Failures

If exports fail for individual records:

- Wrap the export call in a try-catch to handle errors gracefully
- Log the record data to identify problematic inputs
- Verify image URLs in data records are accessible from the server
- Check that the page block exists after scene creation

### Memory Issues

If processing many records causes memory issues:

- Dispose and recreate the engine periodically for very large batches
- Process records in smaller chunks
- Monitor memory usage during batch operations

## API Reference

| Method | Description |
|--------|-------------|
| `engine.variable.setString(name, value)` | Set a text variable's value |
| `engine.variable.getString(name)` | Get a text variable's value |
| `engine.variable.findAll()` | List all variable names in the scene |
| `engine.variable.remove(name)` | Remove a variable |
| `engine.block.findByName(name)` | Find blocks by their semantic name |
| `engine.block.findByType(type)` | Find blocks by their type |
| `engine.block.setName(block, name)` | Set a block's semantic name |
| `engine.block.replaceText(block, text)` | Replace text content in a text block |
| `engine.block.referencesAnyVariables(block)` | Check if block contains variable references |
| `engine.block.getFill(block)` | Get the fill block of a design block |
| `engine.block.setFill(block, fill)` | Set the fill block of a design block |
| `engine.block.setString(block, property, value)` | Set a string property value |
| `engine.block.export(block, options)` | Export a block to an image format |
| `engine.scene.create(layout, options)` | Create a new scene with specified layout |
| `engine.dispose()` | Dispose the engine and free resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support