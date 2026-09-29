> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Apply a Template](./use-templates/apply-template.md)

---

Apply template content to an existing scene while preserving your canvas dimensions and design unit.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-use-templates-apply-template-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-use-templates-apply-template-server-js)

Unlike loading a scene which replaces everything, applying a template merges template content into your current scene. CE.SDK preserves the current page dimensions and design unit while automatically adjusting template content to fit. This approach is ideal for automation pipelines that standardize output sizes across varying template sources, or batch processing workflows that need consistent export dimensions.

```typescript file=@cesdk_web_examples/guides-use-templates-apply-template-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Apply a Template (Server/Node.js)
 *
 * This example demonstrates how to apply template content in a headless workflow:
 * 1. Creating a scene with specific dimensions
 * 2. Applying a template from URL while preserving dimensions
 * 3. Exporting the result with consistent output size
 */

async function run() {
  let engine: CreativeEngine | undefined;

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

    // Create a scene with specific dimensions
    // These dimensions will be preserved when applying templates
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set custom dimensions for fixed output size (e.g., social media post)
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1920);

    console.log('✓ Scene created with dimensions 1080x1920');

    // Apply a template from URL - content adjusts to fit current page dimensions
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    await engine.scene.applyTemplateFromURL(templateUrl);
    console.log('✓ Template applied from URL');

    // Verify that page dimensions are preserved after applying template
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`✓ Page dimensions preserved: ${width}x${height}`);

    // Export the result with consistent dimensions
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('template-output.png', buffer);
    console.log('✓ Exported to template-output.png');

    // Demonstrate applying a different template while keeping dimensions
    const alternativeTemplateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene';

    await engine.scene.applyTemplateFromURL(alternativeTemplateUrl);
    console.log('✓ Switched to alternative template');

    // Verify dimensions remain the same
    const newWidth = engine.block.getWidth(page);
    const newHeight = engine.block.getHeight(page);
    console.log(`✓ Dimensions after switch: ${newWidth}x${newHeight}`);

    // Export the alternative template
    const blob2 = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer2 = Buffer.from(await blob2.arrayBuffer());
    writeFileSync('template-output-alternative.png', buffer2);
    console.log('✓ Exported alternative to template-output-alternative.png');

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

This guide covers how to apply templates from URLs while preserving page dimensions, export results with consistent sizes, and implement template switching in headless workflows.

## When to Use Apply vs Load

Use `applyTemplateFromURL()` or `applyTemplateFromString()` when you want to:

- **Standardize output dimensions**: Generate content with fixed sizes (e.g., social media formats, print sizes)
- **Batch process with templates**: Apply various templates to a pre-configured scene without dimension drift
- **Switch templates**: Iterate through templates while keeping consistent export dimensions

Use `engine.scene.load()` when you need the template's original dimensions.

**Key distinction**: Loading replaces everything; applying preserves dimensions and merges content.

## Initialize the Engine

We start by initializing the headless engine.

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

## Create a Scene with Target Dimensions

We create a scene with specific dimensions. These dimensions will be preserved when we apply templates and determine the final export size.

```typescript highlight=highlight-create-scene
    // Create a scene with specific dimensions
    // These dimensions will be preserved when applying templates
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set custom dimensions for fixed output size (e.g., social media post)
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1920);

    console.log('✓ Scene created with dimensions 1080x1920');
```

## Apply a Template from URL

To apply a template from a URL, call `engine.scene.applyTemplateFromURL()` with the template URL. The template content adjusts automatically to fit the current page dimensions.

```typescript highlight=highlight-apply-from-url
    // Apply a template from URL - content adjusts to fit current page dimensions
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    await engine.scene.applyTemplateFromURL(templateUrl);
    console.log('✓ Template applied from URL');
```

## Verify Preserved Dimensions

After applying the template, the page dimensions remain unchanged. You can verify this by checking the width and height of the page.

```typescript highlight=highlight-verify-dimensions
// Verify that page dimensions are preserved after applying template
const width = engine.block.getWidth(page);
const height = engine.block.getHeight(page);
console.log(`✓ Page dimensions preserved: ${width}x${height}`);
```

## Export with Consistent Dimensions

Export the result with the same dimensions you configured. This ensures all outputs have the same size regardless of the original template dimensions.

```typescript highlight=highlight-export
    // Export the result with consistent dimensions
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('template-output.png', buffer);
    console.log('✓ Exported to template-output.png');
```

## Template Switching

You can apply multiple templates to the same scene. Each application replaces the content while preserving the page setup. This is useful for batch processing workflows where you generate multiple variations.

```typescript highlight=highlight-template-switching
    // Demonstrate applying a different template while keeping dimensions
    const alternativeTemplateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene';

    await engine.scene.applyTemplateFromURL(alternativeTemplateUrl);
    console.log('✓ Switched to alternative template');

    // Verify dimensions remain the same
    const newWidth = engine.block.getWidth(page);
    const newHeight = engine.block.getHeight(page);
    console.log(`✓ Dimensions after switch: ${newWidth}x${newHeight}`);

    // Export the alternative template
    const blob2 = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer2 = Buffer.from(await blob2.arrayBuffer());
    writeFileSync('template-output-alternative.png', buffer2);
    console.log('✓ Exported alternative to template-output-alternative.png');
```

## Apply a Template from String

For templates stored in databases or received from APIs, use `engine.scene.applyTemplateFromString()` with a base64-encoded scene string:

```typescript
// Scene string typically retrieved from storage or API
const templateString = 'UBQ1ewoiZm9ybWF0Ij...';

// Apply template content to current scene
await engine.scene.applyTemplateFromString(templateString);
```

## Troubleshooting

### No Scene Loaded

`applyTemplateFromString()` and `applyTemplateFromURL()` require an existing scene. Create one first with `engine.scene.create()`.

### Template URL Not Accessible

Verify network connectivity and URL validity. In server environments, ensure your infrastructure can access external URLs.

### Content Not Scaling as Expected

Template content scales to fit the current page dimensions. Verify page dimensions are set before applying the template.

## Related Guides

- [Use Templates Programmatically](./use-templates/programmatic.md) — Comprehensive programmatic template workflows
- [Templates Overview](./use-templates/overview.md) — Understanding templates in CE.SDK
- [Headless Mode](./concepts/headless-mode.md) — Server-side template processing



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support