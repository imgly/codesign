> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Templating](./concepts/templating.md)

---

Templates transform static designs into dynamic, data-driven content. They combine reusable layouts with variable text and placeholder media, enabling personalization at scale.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-templating-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-templating-server-js)

A template is a regular CE.SDK scene that contains **variable tokens** in text and **placeholder blocks** for media. When you load a template, you can populate the variables with data and swap placeholder content—producing personalized designs without modifying the underlying layout.

```typescript file=@cesdk_web_examples/guides-concepts-templating-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Example: Templating Concepts
 *
 * Demonstrates the core template concepts in CE.SDK:
 * - Loading a template from URL
 * - Discovering and setting variables
 * - Discovering placeholders
 * - Exporting personalized designs
 */
async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Load a postcard template from URL
    // Templates are scenes containing variable tokens and placeholder blocks
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.load(templateUrl);

    // Discover what variables this template expects
    // Variables are named slots that can be populated with data
    const variableNames = engine.variable.findAll();
    console.log('Template variables:', variableNames);

    // Set variable values to personalize the template
    // These values replace {{variableName}} tokens in text blocks
    engine.variable.setString('Name', 'Jane');
    engine.variable.setString('Greeting', 'Wish you were here!');
    console.log('Variables set successfully.');

    // Discover placeholder blocks in the template
    // Placeholders mark content slots for user or automation replacement
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Template placeholders:', placeholders.length);

    // Export the personalized design to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.scene.getPages();
    const blob = await engine.block.export(pages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/templating-personalized.png`, buffer);
    console.log('Exported to output/templating-personalized.png');

    console.log('Templating guide completed successfully.');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide explains the core concepts. For implementation details, see the guides linked in each section.

## What Makes a Template

Any CE.SDK scene can become a template by adding dynamic elements:

| Element | Purpose | Example |
|---------|---------|---------|
| **Variables** | Dynamic text replacement | `Hello, {{firstName}}!` |
| **Placeholders** | Swappable media slots | Profile photo, product image |
| **Editing Constraints** | Protected design elements | Locked logo, fixed layout |

Templates separate **design** (created once by designers) from **content** (populated at runtime with data). This enables workflows like batch generation, form-based customization, and user personalization.

## Loading Templates

Load a template from a URL using `engine.scene.load()`. This replaces the current scene with the template's structure, including any pages, blocks, variables, and placeholders.

```typescript highlight-load-template
// Load a postcard template from URL
// Templates are scenes containing variable tokens and placeholder blocks
const templateUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
await engine.scene.load(templateUrl);
```

Templates are standard CE.SDK scene files. You can load them from your own servers, CDNs, or cloud storage.

## Variables

Variables enable dynamic text without modifying the design structure. Text blocks contain `{{variableName}}` tokens that CE.SDK resolves at render time.

### Discovering Variables

Use `engine.variable.findAll()` to discover what variables a template expects:

```typescript highlight-discover-variables
// Discover what variables this template expects
// Variables are named slots that can be populated with data
const variableNames = engine.variable.findAll();
console.log('Template variables:', variableNames);
```

This returns an array of variable names defined in the template.

### Setting Variable Values

Populate variables with `engine.variable.setString()`:

```typescript highlight-set-variables
// Set variable values to personalize the template
// These values replace {{variableName}} tokens in text blocks
engine.variable.setString('Name', 'Jane');
engine.variable.setString('Greeting', 'Wish you were here!');
console.log('Variables set successfully.');
```

**How variables work:**

- Define variables with `engine.variable.setString('name', 'value')`
- Reference them in text: `Welcome, {{name}}!`
- CE.SDK automatically updates all text blocks using that variable
- Tokens are case-sensitive; unmatched tokens render as literal text

Variables are scene-scoped and persist when you save the template.

[Learn more about text variables →](./create-templates/add-dynamic-content/text-variables.md)

## Placeholders

Placeholders mark blocks as content slots that users or automation can replace. When you enable placeholder behavior on an image block, it becomes a designated swap target.

### Discovering Placeholders

Use `engine.block.findAllPlaceholders()` to discover all placeholder blocks in a loaded template:

```typescript highlight-discover-placeholders
// Discover placeholder blocks in the template
// Placeholders mark content slots for user or automation replacement
const placeholders = engine.block.findAllPlaceholders();
console.log('Template placeholders:', placeholders.length);
```

**How placeholders work:**

- Enable with `engine.block.setPlaceholderEnabled(block, true)`
- Placeholder blocks are marked for content replacement
- You can programmatically replace placeholder content with new images or media

[Learn more about placeholders →](./create-templates/add-dynamic-content/placeholders.md)

## Template Workflows

Templates support several common workflows:

### Batch Generation

Load a template programmatically, iterate through data records, set variables for each record, and export personalized designs. This powers use cases like certificates, badges, and personalized marketing.

### Design Systems

Create template libraries where designers maintain approved layouts and automation populates them with data at scale.

### Content Personalization

Load templates on the server, populate with user-specific data, and deliver personalized content without exposing the template structure.

## Exporting Personalized Designs

After populating variables, export the personalized design:

```typescript highlight-export
    // Export the personalized design to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.scene.getPages();
    const blob = await engine.block.export(pages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/templating-personalized.png`, buffer);
    console.log('Exported to output/templating-personalized.png');
```

Use `engine.block.export()` to render pages to PNG, JPEG, or PDF format — the native `@cesdk/node-native` package can additionally export MP4 video via `engine.block.exportVideo()`. The exported blob can be saved to the file system or uploaded to cloud storage.

## Engine Cleanup

Always dispose of the engine when finished to free resources:

```typescript highlight-cleanup
engine.dispose();
```

Use a `try/finally` block to ensure cleanup happens even if an error occurs during processing.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support