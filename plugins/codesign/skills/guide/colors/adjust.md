> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Adjust Colors](./colors/adjust.md)

---

Fine-tune images programmatically using CE.SDK's color adjustments system to control brightness, contrast, saturation, and other visual properties in server-side applications.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-colors-adjust-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-colors-adjust-server-js)

Color adjustments allow you to modify the visual appearance of images and graphics by changing properties like brightness, contrast, saturation, and color temperature. CE.SDK implements color adjustments as an "adjustments" effect type that you can apply to compatible blocks.

```typescript file=@cesdk_web_examples/guides-colors-adjust-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Adjust Colors
 *
 * Demonstrates how to adjust color properties of images programmatically:
 * - Creating adjustments effects
 * - Setting brightness, contrast, saturation, and other properties
 * - Enabling/disabling adjustments
 * - Reading adjustment values
 * - Applying different adjustment styles
 * - Exporting the result
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];

    // Sample image URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Check if a block supports effects before applying adjustments
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 400, height: 300 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Block supports effects:', supportsEffects);

    // Create an adjustments effect
    const adjustmentsEffect = engine.block.createEffect('adjustments');

    // Attach the adjustments effect to the image block
    engine.block.appendEffect(imageBlock, adjustmentsEffect);

    // Set brightness - positive values lighten, negative values darken
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness',
      0.4
    );

    // Set contrast - increases or decreases tonal range
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/contrast',
      0.35
    );

    // Set saturation - increases or decreases color intensity
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/saturation',
      0.5
    );

    // Set temperature - positive for warmer, negative for cooler tones
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/temperature',
      0.25
    );

    // Read current adjustment values
    const brightness = engine.block.getFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness'
    );
    console.log('Current brightness:', brightness);

    // Discover all available adjustment properties
    const allProperties = engine.block.findAllProperties(adjustmentsEffect);
    console.log('Available adjustment properties:', allProperties);

    // Disable adjustments temporarily (effect remains attached)
    engine.block.setEffectEnabled(adjustmentsEffect, false);
    console.log(
      'Adjustments enabled:',
      engine.block.isEffectEnabled(adjustmentsEffect)
    );

    // Re-enable adjustments
    engine.block.setEffectEnabled(adjustmentsEffect, true);

    // Create a second image to demonstrate a different adjustment style
    const secondImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, secondImageBlock);
    engine.block.setPositionX(secondImageBlock, 50);
    engine.block.setPositionY(secondImageBlock, 50);

    // Apply a contrasting style: darker, high contrast, desaturated (moody look)
    const combinedAdjustments = engine.block.createEffect('adjustments');
    engine.block.appendEffect(secondImageBlock, combinedAdjustments);
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/brightness',
      -0.15
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/contrast',
      0.4
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/saturation',
      -0.3
    );

    // List all effects on the block
    const effects = engine.block.getEffects(secondImageBlock);
    console.log('Effects on second image:', effects.length);

    // Demonstrate removing an effect
    const tempBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, tempBlock);
    engine.block.setPositionX(tempBlock, 550);
    engine.block.setPositionY(tempBlock, 50);

    const tempEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, tempEffect);
    engine.block.setFloat(tempEffect, 'effect/adjustments/brightness', 0.5);

    // Remove the effect by index
    const tempEffects = engine.block.getEffects(tempBlock);
    const effectIndex = tempEffects.indexOf(tempEffect);
    if (effectIndex !== -1) {
      engine.block.removeEffect(tempBlock, effectIndex);
    }

    // Destroy the removed effect to free memory
    engine.block.destroy(tempEffect);

    // Add refinement adjustments to demonstrate subtle enhancement properties
    const refinementEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, refinementEffect);

    // Sharpness - enhances edge definition
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/sharpness',
      0.4
    );

    // Clarity - increases mid-tone contrast for more detail
    engine.block.setFloat(refinementEffect, 'effect/adjustments/clarity', 0.35);

    // Highlights - adjusts bright areas
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/highlights',
      -0.2
    );

    // Shadows - adjusts dark areas
    engine.block.setFloat(refinementEffect, 'effect/adjustments/shadows', 0.3);

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/adjusted-colors.png`, buffer);

    console.log('Exported result to output/adjusted-colors.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to apply color adjustments programmatically using the block API in server-side Node.js applications.

## Initialize the Engine

We start by initializing the headless Creative Engine with a scene and page for our image processing workflow.

```typescript highlight=highlight-setup
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
```

## Check Block Compatibility

Before applying adjustments, we verify the block supports effects. Not all block types support adjustments—for example, page blocks don't support effects directly, but image and graphic blocks do.

```typescript highlight=highlight-check-support
    // Check if a block supports effects before applying adjustments
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 400, height: 300 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Block supports effects:', supportsEffects);
```

## Create and Apply Adjustments Effect

Once we've confirmed a block supports effects, we create an adjustments effect and attach it to the block using `appendEffect()`.

```typescript highlight=highlight-create-adjustments
    // Create an adjustments effect
    const adjustmentsEffect = engine.block.createEffect('adjustments');

    // Attach the adjustments effect to the image block
    engine.block.appendEffect(imageBlock, adjustmentsEffect);
```

Each block can have one adjustments effect in its effect stack. The adjustments effect provides access to all color adjustment properties through a single effect instance.

## Modify Adjustment Properties

We set individual adjustment values using `setFloat()` with the effect block ID and property path. Each property uses the `effect/adjustments/` prefix followed by the property name.

```typescript highlight=highlight-set-properties
    // Set brightness - positive values lighten, negative values darken
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness',
      0.4
    );

    // Set contrast - increases or decreases tonal range
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/contrast',
      0.35
    );

    // Set saturation - increases or decreases color intensity
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/saturation',
      0.5
    );

    // Set temperature - positive for warmer, negative for cooler tones
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/temperature',
      0.25
    );
```

CE.SDK provides the following adjustment properties:

| Property | Description |
|----------|-------------|
| `brightness` | Overall lightness—positive values lighten, negative values darken |
| `contrast` | Tonal range—increases or decreases the difference between light and dark |
| `saturation` | Color intensity—positive values increase vibrancy, negative values desaturate |
| `exposure` | Exposure compensation—simulates camera exposure adjustments |
| `gamma` | Gamma curve—adjusts midtone brightness |
| `highlights` | Bright area intensity—controls the lightest parts of the image |
| `shadows` | Dark area intensity—controls the darkest parts of the image |
| `whites` | White point—adjusts the brightest pixels |
| `blacks` | Black point—adjusts the darkest pixels |
| `temperature` | Warm/cool color cast—positive for warmer, negative for cooler tones |
| `sharpness` | Edge sharpness—enhances or softens edges |
| `clarity` | Midtone contrast—increases local contrast for more definition |

All properties accept float values. Experiment with different values to achieve the desired visual result.

## Read Adjustment Values

We can read current adjustment values using `getFloat()` with the same property paths. Use `findAllProperties()` to discover all available properties on an adjustments effect.

```typescript highlight=highlight-read-values
    // Read current adjustment values
    const brightness = engine.block.getFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness'
    );
    console.log('Current brightness:', brightness);

    // Discover all available adjustment properties
    const allProperties = engine.block.findAllProperties(adjustmentsEffect);
    console.log('Available adjustment properties:', allProperties);
```

This is useful for building batch processing pipelines or logging adjustment configurations.

## Enable and Disable Adjustments

CE.SDK allows you to temporarily toggle adjustments on and off without removing them from the block. This is useful for before/after comparisons or conditional processing.

```typescript highlight=highlight-enable-disable
    // Disable adjustments temporarily (effect remains attached)
    engine.block.setEffectEnabled(adjustmentsEffect, false);
    console.log(
      'Adjustments enabled:',
      engine.block.isEffectEnabled(adjustmentsEffect)
    );

    // Re-enable adjustments
    engine.block.setEffectEnabled(adjustmentsEffect, true);
```

When you disable an adjustments effect, it remains attached to the block but won't be rendered until you enable it again. This preserves all adjustment values while giving you control over when adjustments are applied.

## Applying Different Adjustment Styles

You can apply different adjustment combinations to create distinct visual styles. This example demonstrates a contrasting moody look using negative brightness, high contrast, and desaturation.

```typescript highlight=highlight-combine-effects
    // Create a second image to demonstrate a different adjustment style
    const secondImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, secondImageBlock);
    engine.block.setPositionX(secondImageBlock, 50);
    engine.block.setPositionY(secondImageBlock, 50);

    // Apply a contrasting style: darker, high contrast, desaturated (moody look)
    const combinedAdjustments = engine.block.createEffect('adjustments');
    engine.block.appendEffect(secondImageBlock, combinedAdjustments);
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/brightness',
      -0.15
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/contrast',
      0.4
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/saturation',
      -0.3
    );

    // List all effects on the block
    const effects = engine.block.getEffects(secondImageBlock);
    console.log('Effects on second image:', effects.length);
```

By combining different adjustment properties, you can create warm and vibrant looks, cool and desaturated styles, or high-contrast dramatic effects.

## Refinement Adjustments

Beyond basic color corrections, CE.SDK provides refinement adjustments for fine-tuning image detail and tonal balance.

```typescript highlight=highlight-refinement-adjustments
    // Add refinement adjustments to demonstrate subtle enhancement properties
    const refinementEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, refinementEffect);

    // Sharpness - enhances edge definition
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/sharpness',
      0.4
    );

    // Clarity - increases mid-tone contrast for more detail
    engine.block.setFloat(refinementEffect, 'effect/adjustments/clarity', 0.35);

    // Highlights - adjusts bright areas
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/highlights',
      -0.2
    );

    // Shadows - adjusts dark areas
    engine.block.setFloat(refinementEffect, 'effect/adjustments/shadows', 0.3);
```

Refinement properties include:

- **Sharpness** - Enhances edge definition for crisper details
- **Clarity** - Increases mid-tone contrast for more depth and definition
- **Highlights** - Controls the intensity of bright areas
- **Shadows** - Controls the intensity of dark areas

These adjustments are particularly useful for batch processing workflows where consistent enhancement is needed.

## Remove Adjustments

When you no longer need adjustments, you can remove them from the effect stack and free resources. Always destroy effects that are no longer in use to prevent memory leaks.

```typescript highlight=highlight-remove-adjustments
    // Demonstrate removing an effect
    const tempBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, tempBlock);
    engine.block.setPositionX(tempBlock, 550);
    engine.block.setPositionY(tempBlock, 50);

    const tempEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, tempEffect);
    engine.block.setFloat(tempEffect, 'effect/adjustments/brightness', 0.5);

    // Remove the effect by index
    const tempEffects = engine.block.getEffects(tempBlock);
    const effectIndex = tempEffects.indexOf(tempEffect);
    if (effectIndex !== -1) {
      engine.block.removeEffect(tempBlock, effectIndex);
    }

    // Destroy the removed effect to free memory
    engine.block.destroy(tempEffect);
```

The `removeEffect()` method takes an index position. After removal, destroy the effect instance to ensure proper cleanup.

## Export and Cleanup

After applying adjustments, we export the result to a file and dispose of the engine to free resources.

```typescript highlight=highlight-export
    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/adjusted-colors.png`, buffer);

    console.log('Exported result to output/adjusted-colors.png');
```

Always dispose of the engine in a finally block to ensure resources are freed even if an error occurs.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Troubleshooting

### Adjustments Not Visible

If adjustments don't appear in exported images:

- Verify the block supports effects using `supportsEffects()`
- Check that the effect is enabled with `isEffectEnabled()`
- Ensure the adjustments effect was appended to the block, not just created
- Confirm adjustment values are non-zero

### Unexpected Results

If adjustments produce unexpected visual results:

- Check the effect stack order—adjustments applied before or after other effects may produce different results
- Verify property paths include the `effect/adjustments/` prefix
- Use `findAllProperties()` to verify correct property names

### Property Not Found

If you encounter property not found errors:

- Use `findAllProperties()` to list all available properties
- Ensure property paths use the correct `effect/adjustments/` prefix format

## API Reference

| Method | Description |
|--------|-------------|
| `block.supportsEffects(block)` | Check if a block supports effects |
| `block.createEffect('adjustments')` | Create an adjustments effect |
| `block.appendEffect(block, effect)` | Add effect to the end of the effect stack |
| `block.insertEffect(block, effect, index)` | Insert effect at a specific position |
| `block.getEffects(block)` | Get all effects applied to a block |
| `block.removeEffect(block, index)` | Remove effect at the specified index |
| `block.setEffectEnabled(effect, enabled)` | Enable or disable an effect |
| `block.isEffectEnabled(effect)` | Check if an effect is enabled |
| `block.setFloat(effect, property, value)` | Set a float property value |
| `block.getFloat(effect, property)` | Get a float property value |
| `block.findAllProperties(effect)` | List all properties of an effect |
| `block.destroy(effect)` | Destroy an effect and free resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support