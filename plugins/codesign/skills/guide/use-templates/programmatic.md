> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Programmatic](./use-templates/programmatic.md)

---

Automate template workflows with CE.SDK's engine APIs for batch processing, personalization, and headless design generation.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-use-templates-programmatic-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-use-templates-programmatic-server-js)

Templates are scenes with predefined structures that support dynamic content through variables. This guide shows you how to work with templates programmatically using CE.SDK's engine APIs—without requiring user interface interactions.

```typescript file=@cesdk_web_examples/guides-use-templates-programmatic-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Use Templates Programmatically (Server/Node.js)
 *
 * This example demonstrates headless template workflows:
 * 1. Creating templates from scratch with text variables
 * 2. Setting up text variables for dynamic content
 * 3. Batch processing: populating templates with data
 * 4. Exporting multiple personalized outputs
 */

async function run() {
  let engine;

  try {
    const config = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');

    // Create a greeting card template from scratch
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Set up text variables FIRST so they're available when text is created
    engine.variable.setString('recipientName', 'Template');
    engine.variable.setString('customMessage', 'This is a template example');

    // Add title text block with variable placeholder
    const titleBlock = engine.block.create('text');
    engine.block.setName(titleBlock, 'title');
    engine.block.appendChild(page, titleBlock);
    engine.block.setPositionX(titleBlock, 50);
    engine.block.setPositionY(titleBlock, 50);
    engine.block.setWidth(titleBlock, 700);
    engine.block.setHeight(titleBlock, 80);

    // Set text with variable syntax
    engine.block.replaceText(titleBlock, 'Hello, {{recipientName}}!');
    engine.block.setTextColor(titleBlock, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Configure font size and weight
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setBool(titleBlock, 'text/bold', true);

    // Add message text block with variable
    const messageBlock = engine.block.create('text');
    engine.block.setName(messageBlock, 'message');
    engine.block.appendChild(page, messageBlock);
    engine.block.setPositionX(messageBlock, 50);
    engine.block.setPositionY(messageBlock, 140);
    engine.block.setWidth(messageBlock, 700);
    engine.block.setHeight(messageBlock, 120);

    engine.block.replaceText(messageBlock, '{{customMessage}}');
    engine.block.setTextColor(messageBlock, {
      r: 0.3,
      g: 0.3,
      b: 0.3,
      a: 1.0
    });

    engine.block.setFloat(messageBlock, 'text/fontSize', 28);

    console.log('✓ Template structure created');

    // Variables have already been set earlier in the template creation
    // List all variables
    const allVariables = engine.variable.findAll();
    console.log('✓ Variables initialized:', allVariables);

    // Save the template for reuse
    const templateString = await engine.scene.saveToString();
    writeFileSync('template.imgly', templateString);
    console.log('✓ Template saved to template.imgly');

    // Demonstrate batch processing: populate template with multiple data records
    const recipients = [
      {
        name: 'Alice',
        message: 'Congratulations on your promotion!'
      },
      {
        name: 'Bob',
        message: 'Happy Birthday! Have a wonderful day!'
      },
      {
        name: 'Charlie',
        message: 'Thank you for your amazing work!'
      }
    ];

    console.log('\n✓ Starting batch processing...');

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      // Populate template with recipient data
      engine.variable.setString('recipientName', recipient.name);
      engine.variable.setString('customMessage', recipient.message);

      // Export the personalized card
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 800,
        targetHeight: 600
      });

      const filename = `greeting-card-${recipient.name.toLowerCase()}.png`;
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(filename, buffer);
      console.log(`  ✓ Exported ${filename}`);
    }

    console.log('\n✓ Batch processing complete!');
    console.log(`✓ Generated ${recipients.length} personalized cards`);

    console.log('\n✓ All operations completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Always dispose the engine
    engine?.dispose();
    console.log('\n✓ Engine disposed');
  }
}

// Run the example
run();
```

This guide covers creating templates from scratch, configuring text variables, populating templates with data, implementing batch processing workflows, and exporting personalized designs.

## Initialize CE.SDK

We start by initializing CE.SDK and creating a design scene. This provides the foundation for programmatic template operations.

```typescript highlight=highlight-setup
    const config = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');
```

We create a page with specific dimensions and set a light gray background. This serves as the canvas for our template structure.

## Creating Templates from Scratch

We build templates programmatically by creating and arranging blocks with `engine.block.create()` and `engine.block.appendChild()`.

```typescript highlight=highlight-create-template
    // Create a greeting card template from scratch
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Set up text variables FIRST so they're available when text is created
    engine.variable.setString('recipientName', 'Template');
    engine.variable.setString('customMessage', 'This is a template example');

    // Add title text block with variable placeholder
    const titleBlock = engine.block.create('text');
    engine.block.setName(titleBlock, 'title');
    engine.block.appendChild(page, titleBlock);
    engine.block.setPositionX(titleBlock, 50);
    engine.block.setPositionY(titleBlock, 50);
    engine.block.setWidth(titleBlock, 700);
    engine.block.setHeight(titleBlock, 80);

    // Set text with variable syntax
    engine.block.replaceText(titleBlock, 'Hello, {{recipientName}}!');
    engine.block.setTextColor(titleBlock, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Configure font size and weight
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setBool(titleBlock, 'text/bold', true);

    // Add message text block with variable
    const messageBlock = engine.block.create('text');
    engine.block.setName(messageBlock, 'message');
    engine.block.appendChild(page, messageBlock);
    engine.block.setPositionX(messageBlock, 50);
    engine.block.setPositionY(messageBlock, 140);
    engine.block.setWidth(messageBlock, 700);
    engine.block.setHeight(messageBlock, 120);

    engine.block.replaceText(messageBlock, '{{customMessage}}');
    engine.block.setTextColor(messageBlock, {
      r: 0.3,
      g: 0.3,
      b: 0.3,
      a: 1.0
    });

    engine.block.setFloat(messageBlock, 'text/fontSize', 28);

    console.log('✓ Template structure created');
```

We create a greeting card template with two text blocks. The title block contains `{{recipientName}}` and the message block contains `{{customMessage}}`—these double-brace syntax markers define where variables will be replaced. We position each block precisely and configure text properties like font size and color.

## Text Variables for Dynamic Content

Variables enable text replacement throughout templates. We set variable values with `engine.variable.setString()`, which automatically updates any text containing `{{variableName}}` syntax.

```typescript highlight=highlight-manage-variables
// Variables have already been set earlier in the template creation
// List all variables
const allVariables = engine.variable.findAll();
console.log('✓ Variables initialized:', allVariables);
```

We initialize variables for `recipientName` and `customMessage`. The `engine.variable.getString()` method retrieves current values, and `engine.variable.findAll()` lists all variables in the scene. Variables persist with the scene and automatically update text content whenever changed.

## Saving Templates for Reuse

Templates can be serialized for storage and reuse. We use `engine.scene.saveToString()` to create portable template files.

```typescript highlight=highlight-save-template
// Save the template for reuse
const templateString = await engine.scene.saveToString();
writeFileSync('template.imgly', templateString);
console.log('✓ Template saved to template.imgly');
```

The `saveToString()` method returns a base64-encoded string containing the complete scene. This string can be stored in databases or file systems for later use in batch processing workflows.

## Batch Processing with Templates

We demonstrate batch processing by populating the template with multiple data records and exporting personalized outputs.

```typescript highlight=highlight-batch-processing
    // Demonstrate batch processing: populate template with multiple data records
    const recipients = [
      {
        name: 'Alice',
        message: 'Congratulations on your promotion!'
      },
      {
        name: 'Bob',
        message: 'Happy Birthday! Have a wonderful day!'
      },
      {
        name: 'Charlie',
        message: 'Thank you for your amazing work!'
      }
    ];

    console.log('\n✓ Starting batch processing...');

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      // Populate template with recipient data
      engine.variable.setString('recipientName', recipient.name);
      engine.variable.setString('customMessage', recipient.message);

      // Export the personalized card
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 800,
        targetHeight: 600
      });

      const filename = `greeting-card-${recipient.name.toLowerCase()}.png`;
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(filename, buffer);
      console.log(`  ✓ Exported ${filename}`);
    }

    console.log('\n✓ Batch processing complete!');
    console.log(`✓ Generated ${recipients.length} personalized cards`);
```

The batch processing pattern loads a template once, then iterates through data records. For each record, we update variables with specific values, then export the result. This efficient approach generates multiple personalized designs from a single template. Each export operation renders the current state to a PNG file saved to disk.

## Data-Driven Workflows

Batch processing combines template creation, data population, and export operations. A common pattern loads a template once, then iterates through data records:

```typescript
const templateString = await engine.scene.saveToString();

for (const record of dataRecords) {
  await engine.scene.load(templateString);
  engine.variable.setString('name', record.name);
  engine.variable.setString('title', record.title);

  const page = engine.block.findByType('page')[0];
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  writeFileSync(`output-${record.id}.png`, Buffer.from(await blob.arrayBuffer()));
}
```

This pattern works for generating personalized certificates, greeting cards, social media graphics, or any scenario requiring multiple customized outputs from a single template.

## Loading Existing Templates

Templates can be loaded from various sources. Use `engine.scene.load()` to fetch remote templates:

```typescript
await engine.scene.load(
  'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
);
```

For templates with embedded assets, `engine.scene.load()` loads the complete package including all resources.

The `engine.scene.applyTemplateFromString()` and `engine.scene.applyTemplateFromURL()` methods merge template content into existing scenes without replacing everything—useful for adding template sections to ongoing designs.

## Populating Template Content

We populate templates by updating variables with new data. When variables are updated, all text blocks containing those variable references automatically display the new values. This approach enables efficient template population without manually finding and updating individual blocks.

## Managing Variables

Variables integrate with text blocks automatically. When you set a variable value, CE.SDK updates all text containing that variable immediately:

```typescript
engine.variable.setString('userName', 'Alice');
// All text with {{userName}} now displays 'Alice'

engine.variable.setString('userName', 'Bob');
// Same text now displays 'Bob'
```

Remove variables with `engine.variable.remove()` when they're no longer needed. This doesn't affect existing text—the variable syntax remains as literal text.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.create()` | Create a new design block |
| `engine.block.appendChild()` | Add a block to the scene hierarchy |
| `engine.block.setPositionX()` | Set block horizontal position |
| `engine.block.setPositionY()` | Set block vertical position |
| `engine.block.setWidth()` | Set block width |
| `engine.block.setHeight()` | Set block height |
| `engine.block.replaceText()` | Set text content (supports variable tokens) |
| `engine.variable.setString()` | Create or update a text variable |
| `engine.variable.getString()` | Read the current value of a variable |
| `engine.variable.findAll()` | Get array of all variable keys in the scene |
| `engine.variable.remove()` | Delete a variable from the scene |
| `engine.scene.saveToString()` | Serialize scene to portable string |
| `engine.scene.load()` | Load a scene from a remote URL or a serialized string |
| `engine.block.export()` | Export block to image blob |

## Troubleshooting

**Template loading failures:** Verify scene strings are properly encoded and URLs are accessible. Use `try-catch` blocks around loading operations to handle network or parsing errors.

**Variables not replacing text:** Variable names in text (within `{{}}`) must exactly match keys passed to `engine.variable.setString()`. Variables are case-sensitive.

**Export issues:** Validate that all required assets are accessible before exporting. Missing images or fonts can cause export failures. Check block hierarchy structure—orphaned blocks (not connected to the page tree) won't appear in exports.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support