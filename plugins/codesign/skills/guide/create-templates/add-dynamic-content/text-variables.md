> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Dynamic Content](./create-templates/add-dynamic-content.md) > [Text Variables](./create-templates/add-dynamic-content/text-variables.md)

---

Text variables enable data-driven template personalization in headless Node.js environments. Insert placeholder tokens like `{{firstName}}` into text blocks, then populate them with actual values programmatically. This separates design from content, enabling automated document generation, batch processing, and server-side mass personalization workflows.

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-dynamic-content-text-variables-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-dynamic-content-text-variables-server-js)

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-text-variables-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Variables
 *
 * Demonstrates text variable management in headless Node.js environment:
 * - Discovering variables with findAll()
 * - Creating and updating variables with setString()
 * - Reading variable values with getString()
 * - Binding variables to text blocks with {{variable}} tokens
 * - Detecting variable references with referencesAnyVariables()
 * - Removing variables with remove()
 * - Exporting personalized designs to PNG
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } },
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Discover all existing variables in the scene
  // This is useful when loading templates to see what variables need values
  const existingVariables = engine.variable.findAll();
  // eslint-disable-next-line no-console
  console.log('Existing variables:', existingVariables); // []

  // Create and update text variables
  // If a variable doesn't exist, setString() creates it
  // If it already exists, setString() updates its value
  engine.variable.setString('firstName', 'Alex');
  engine.variable.setString('lastName', 'Smith');
  engine.variable.setString('email', 'alex.smith@example.com');
  engine.variable.setString('company', 'IMG.LY');
  engine.variable.setString('title', 'Creative Developer');

  // Read variable values at runtime
  const firstName = engine.variable.getString('firstName');
  // eslint-disable-next-line no-console
  console.log('First name variable:', firstName); // 'Alex'

  // Create a text block demonstrating variable binding patterns
  const textBlock = engine.block.create('text');

  // Multi-line text combining:
  // - Single variable ({{firstName}})
  // - Multiple variables ({{firstName}} {{lastName}})
  // - Variables in context (Email: {{email}})
  const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

  engine.block.replaceText(textBlock, textContent);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');
  engine.block.setFloat(textBlock, 'text/fontSize', 24);
  engine.block.appendChild(page, textBlock);

  // Center the text block on the page
  const frameX = engine.block.getFrameX(textBlock);
  const frameY = engine.block.getFrameY(textBlock);
  const frameWidth = engine.block.getFrameWidth(textBlock);
  const frameHeight = engine.block.getFrameHeight(textBlock);

  engine.block.setPositionX(textBlock, (pageWidth - frameWidth) / 2 - frameX);
  engine.block.setPositionY(textBlock, (pageHeight - frameHeight) / 2 - frameY);

  // Check if the block contains variable references
  const hasVariables = engine.block.referencesAnyVariables(textBlock);
  // eslint-disable-next-line no-console
  console.log('Text block has variables:', hasVariables); // true

  // Create and then remove a temporary variable to demonstrate removal
  engine.variable.setString('tempVariable', 'Temporary Value');
  // eslint-disable-next-line no-console
  console.log('Variables before removal:', engine.variable.findAll());

  // Remove the temporary variable
  engine.variable.remove('tempVariable');
  // eslint-disable-next-line no-console
  console.log('Variables after removal:', engine.variable.findAll());

  // Final check: List all variables in the scene
  const finalVariables = engine.variable.findAll();
  // eslint-disable-next-line no-console
  console.log('Final variables in scene:', finalVariables);
  // Expected: ['firstName', 'lastName', 'email', 'company', 'title']

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/text-variables-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/text-variables-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to programmatically manage text variables for automated document generation and mass personalization in headless Node.js environments.

## Introduction

Text variables allow you to design templates once and personalize them with different content for each use. In server-side environments, this enables powerful automation workflows where CE.SDK Engine runs headlessly to generate personalized designs at scale.

### Key Use Cases

- **Automated Document Generation** - Certificates, invoices, reports with dynamic data
- **Mass Personalization** - Marketing materials populated from databases or CSV files
- **Server-Side Rendering** - Cloud functions that generate personalized graphics on demand
- **Batch Processing** - Generate thousands of unique designs from a single template

## Discovering Variables

When working with templates that already contain variables, discover what variables exist before populating them with values.

```typescript highlight-discover-variables
// Discover all existing variables in the scene
// This is useful when loading templates to see what variables need values
const existingVariables = engine.variable.findAll();
// eslint-disable-next-line no-console
console.log('Existing variables:', existingVariables); // []
```

The `findAll()` method returns an array of all variable keys defined in the scene. This is essential when loading templates to understand what data needs to be provided.

## Creating and Updating Variables

Create or update variables using `setString()`. If the variable doesn't exist, it will be created. If it already exists, its value will be updated.

```typescript highlight-create-update-variables
// Create and update text variables
// If a variable doesn't exist, setString() creates it
// If it already exists, setString() updates its value
engine.variable.setString('firstName', 'Alex');
engine.variable.setString('lastName', 'Smith');
engine.variable.setString('email', 'alex.smith@example.com');
engine.variable.setString('company', 'IMG.LY');
engine.variable.setString('title', 'Creative Developer');
```

> **Note:** Variable keys are case-sensitive. `{{Name}}` and `{{name}}` are different variables. Use consistent naming conventions across your templates.

## Reading Variable Values

Retrieve the current value of a variable at runtime using `getString()`. This is useful for validation or logging current values in automation pipelines.

```typescript highlight-read-variable-value
// Read variable values at runtime
const firstName = engine.variable.getString('firstName');
// eslint-disable-next-line no-console
console.log('First name variable:', firstName); // 'Alex'
```

## Binding Variables to Text Blocks

Insert variable tokens directly into text block content using the `{{variableName}}` syntax. CE.SDK Engine automatically detects and resolves these tokens at render time.

### Single Variable

```typescript highlight-single-variable-binding
  // Create a text block demonstrating variable binding patterns
  const textBlock = engine.block.create('text');

  // Multi-line text combining:
  // - Single variable ({{firstName}})
  // - Multiple variables ({{firstName}} {{lastName}})
  // - Variables in context (Email: {{email}})
  const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

  engine.block.replaceText(textBlock, textContent);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');
  engine.block.setFloat(textBlock, 'text/fontSize', 24);
  engine.block.appendChild(page, textBlock);
```

### Multiple Variables

Combine multiple variables in a single text block for complex text templates:

```typescript highlight-multiple-variable-binding
  // Create a text block demonstrating variable binding patterns
  const textBlock = engine.block.create('text');

  // Multi-line text combining:
  // - Single variable ({{firstName}})
  // - Multiple variables ({{firstName}} {{lastName}})
  // - Variables in context (Email: {{email}})
  const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

  engine.block.replaceText(textBlock, textContent);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');
  engine.block.setFloat(textBlock, 'text/fontSize', 24);
  engine.block.appendChild(page, textBlock);
```

The variables resolve in place, maintaining the surrounding text and formatting. Use this for business cards, certificates, or any template requiring multiple personalization points.

## Detecting Variable References

Check if a block contains variable references using `referencesAnyVariables()`. This returns `true` if the block's text contains any `{{variable}}` tokens.

```typescript highlight-detect-variable-references
// Check if the block contains variable references
const hasVariables = engine.block.referencesAnyVariables(textBlock);
// eslint-disable-next-line no-console
console.log('Text block has variables:', hasVariables); // true
```

This is useful for:

- Identifying which blocks need variable values before export
- Implementing validation logic in automation workflows
- Filtering blocks that require data population

## Removing Variables

Remove unused variables from the scene with `remove()`. This cleans up the variable store when certain variables are no longer needed.

```typescript highlight-remove-variable
  // Create and then remove a temporary variable to demonstrate removal
  engine.variable.setString('tempVariable', 'Temporary Value');
  // eslint-disable-next-line no-console
  console.log('Variables before removal:', engine.variable.findAll());

  // Remove the temporary variable
  engine.variable.remove('tempVariable');
  // eslint-disable-next-line no-console
  console.log('Variables after removal:', engine.variable.findAll());
```

> **Warning:** After removal, text blocks that reference removed variables will display the token literally (e.g., `{{removedVar}}`). Only remove variables after ensuring no blocks reference them.

## API Reference

| Method | Description |
| --- | --- |
| `engine.variable.findAll()` | Get array of all variable keys in the scene |
| `engine.variable.setString()` | Create or update a text variable |
| `engine.variable.getString()` | Read the current value of a variable |
| `engine.variable.remove()` | Delete a variable from the scene |
| `engine.block.referencesAnyVariables()` | Check if a block contains variable tokens |
| `engine.block.replaceText()` | Set text content (supports variable tokens) |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support