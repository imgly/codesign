> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Duotone](./filters-and-effects/duotone.md)

---

Apply duotone effects to images in server-side workflows for batch processing and automated image enhancement.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-duotone-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-duotone-server-js)

Duotone is a color effect that maps image brightness to two colors: a dark color for shadows and a light color for highlights. The result is a striking two-tone image where all original colors are replaced by gradations between your chosen pair. CE.SDK's duotone system works identically in server environments, making it ideal for batch processing, automated pipelines, and headless image generation.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-duotone-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { hexToRgba } from './utils';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Duotone
 *
 * Demonstrates applying duotone effects to images in server-side workflows:
 * - Querying duotone presets from the asset library
 * - Applying duotone with preset colors
 * - Creating custom duotone color combinations
 * - Managing and removing effects
 */
async function main(): Promise<void> {
  // Initialize CE.SDK engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load the filter asset source to access duotone presets
    const defaultAssetsUrl = engine.getBaseURL();
    let hasAssetSources = false;
    try {
      await engine.asset.addLocalAssetSourceFromJSONURI(
        `${defaultAssetsUrl}ly.img.filter/content.json`
      );
      hasAssetSources = true;
    } catch {
      console.warn('Filter asset source not available, skipping presets');
    }

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Use a sample image URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create image block for preset demonstration
    const presetImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, presetImageBlock);
    engine.block.setPositionX(presetImageBlock, 25);
    engine.block.setPositionY(presetImageBlock, 25);

    // Verify a block supports effects before applying them
    const canApplyEffects = engine.block.supportsEffects(presetImageBlock);
    if (!canApplyEffects) {
      console.warn('Block does not support effects');
      return;
    }

    // Query duotone presets from the asset library
    const duotoneResults = hasAssetSources
      ? await engine.asset.findAssets('ly.img.filter', {
          page: 0,
          perPage: 10
        })
      : { assets: [] };
    const duotonePresets = duotoneResults.assets;

    // Apply a preset to the first image (or use fallback colors)
    // Create a new duotone effect block
    const duotoneEffect = engine.block.createEffect('duotone_filter');

    // Configure effect with preset colors (convert hex to RGBA)
    if (duotonePresets.length > 0) {
      const preset = duotonePresets[0];
      if (preset.meta?.darkColor) {
        engine.block.setColor(
          duotoneEffect,
          'effect/duotone_filter/darkColor',
          hexToRgba(preset.meta.darkColor as string)
        );
      }
      if (preset.meta?.lightColor) {
        engine.block.setColor(
          duotoneEffect,
          'effect/duotone_filter/lightColor',
          hexToRgba(preset.meta.lightColor as string)
        );
      }
    } else {
      // Fallback: Desert preset colors (#5c3a15, #f0d8b8)
      engine.block.setColor(
        duotoneEffect,
        'effect/duotone_filter/darkColor',
        hexToRgba('#5c3a15')
      );
      engine.block.setColor(
        duotoneEffect,
        'effect/duotone_filter/lightColor',
        hexToRgba('#f0d8b8')
      );
    }
    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.9
    );

    // Attach the configured effect to the image block
    engine.block.appendEffect(presetImageBlock, duotoneEffect);

    // Create image block for custom duotone demonstration
    const customImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, customImageBlock);
    engine.block.setPositionX(customImageBlock, 425);
    engine.block.setPositionY(customImageBlock, 25);

    // Create duotone with custom brand colors
    const customDuotone = engine.block.createEffect('duotone_filter');

    // Dark color: deep navy blue (shadows)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.1,
      g: 0.15,
      b: 0.3,
      a: 1.0
    });

    // Light color: warm cream (highlights)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/lightColor', {
      r: 0.95,
      g: 0.9,
      b: 0.8,
      a: 1.0
    });

    // Control effect strength (0.0 = original, 1.0 = full duotone)
    engine.block.setFloat(
      customDuotone,
      'effect/duotone_filter/intensity',
      0.85
    );

    engine.block.appendEffect(customImageBlock, customDuotone);

    // Create image block for combined effects demonstration
    const combinedImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, combinedImageBlock);
    engine.block.setPositionX(combinedImageBlock, 225);
    engine.block.setPositionY(combinedImageBlock, 325);

    // Combine duotone with other effects
    // First, add adjustments for brightness and contrast
    const adjustments = engine.block.createEffect('adjustments');
    engine.block.setFloat(adjustments, 'effect/adjustments/brightness', 0.1);
    engine.block.setFloat(adjustments, 'effect/adjustments/contrast', 0.15);
    engine.block.appendEffect(combinedImageBlock, adjustments);

    // Then add duotone on top
    const combinedDuotone = engine.block.createEffect('duotone_filter');
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.2,
      g: 0.1,
      b: 0.3,
      a: 1.0 // Deep purple
    });
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/lightColor', {
      r: 1.0,
      g: 0.85,
      b: 0.7,
      a: 1.0 // Warm peach
    });
    engine.block.setFloat(
      combinedDuotone,
      'effect/duotone_filter/intensity',
      0.75
    );
    engine.block.appendEffect(combinedImageBlock, combinedDuotone);

    // Get all effects currently applied to a block
    const appliedEffects = engine.block.getEffects(presetImageBlock);

    console.log(`Block has ${appliedEffects.length} effect(s) applied`);

    // Disable an effect without removing it
    if (appliedEffects.length > 0) {
      engine.block.setEffectEnabled(appliedEffects[0], false);

      // Check if an effect is currently enabled
      const isEnabled = engine.block.isEffectEnabled(appliedEffects[0]);
      console.log(`Effect enabled: ${isEnabled}`);

      // Re-enable the effect
      engine.block.setEffectEnabled(appliedEffects[0], true);
    }

    // Remove an effect at a specific index from a block
    const effectsOnCustom = engine.block.getEffects(customImageBlock);
    if (effectsOnCustom.length > 0) {
      engine.block.removeEffect(customImageBlock, 0);
    }

    // Destroy removed effect blocks to free memory
    if (effectsOnCustom.length > 0) {
      engine.block.destroy(effectsOnCustom[0]);
    }

    // Re-apply custom duotone after demonstration
    const newCustomDuotone = engine.block.createEffect('duotone_filter');
    engine.block.setColor(newCustomDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.1,
      g: 0.15,
      b: 0.3,
      a: 1.0
    });
    engine.block.setColor(
      newCustomDuotone,
      'effect/duotone_filter/lightColor',
      {
        r: 0.95,
        g: 0.9,
        b: 0.8,
        a: 1.0
      }
    );
    engine.block.setFloat(
      newCustomDuotone,
      'effect/duotone_filter/intensity',
      0.85
    );
    engine.block.appendEffect(customImageBlock, newCustomDuotone);

    // Export the page to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `${outputDir}/duotone-result.png`;
    writeFileSync(outputPath, buffer);
    console.log(`Exported duotone result to: ${outputPath}`);
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

## Understanding Duotone

Unlike filters that simply tint or shift colors, duotone completely remaps the tonal range of an image. The effect analyzes each pixel's luminosity and assigns a color based on where it falls between pure black and pure white:

- **Dark tones** (shadows, blacks) adopt the dark color
- **Light tones** (highlights, whites) adopt the light color
- **Midtones** blend between the two colors

This creates images with a consistent color palette regardless of the original colors, making duotone ideal for:

- **Brand consistency** - Apply your brand's color palette across diverse imagery
- **Visual cohesion** - Unify photos from different sources in a design
- **Vintage aesthetics** - Recreate classic print techniques like cyanotype or sepia
- **Bold statements** - Create eye-catching visuals for social media or marketing

The intensity property lets you blend between the original image and the full duotone effect, giving you creative control over how strongly the effect is applied.

## Check Effect Support

Before applying effects programmatically, verify the block supports them. Only graphic blocks with image or video fills can have effects applied:

```typescript highlight=highlight-check-support
// Verify a block supports effects before applying them
const canApplyEffects = engine.block.supportsEffects(presetImageBlock);
if (!canApplyEffects) {
  console.warn('Block does not support effects');
  return;
}
```

Attempting to apply effects to unsupported blocks (like text or shapes without fills) will result in an error.

## Applying Duotone Presets

CE.SDK includes a library of professionally designed duotone presets. Each preset defines a dark/light color pair optimized for visual appeal.

### Query Built-in Presets

Use the Asset API to retrieve available duotone presets from the asset library:

```typescript highlight=highlight-query-presets
// Query duotone presets from the asset library
const duotoneResults = hasAssetSources
  ? await engine.asset.findAssets('ly.img.filter', {
      page: 0,
      perPage: 10
    })
  : { assets: [] };
const duotonePresets = duotoneResults.assets;
```

Preset metadata contains `darkColor` and `lightColor` as hex strings. Convert these to RGBA format (values 0-1) before passing to the effect API.

### Create Effect Block

Create a new duotone effect block that can be configured and attached to an image:

```typescript highlight=highlight-create-effect
// Create a new duotone effect block
const duotoneEffect = engine.block.createEffect('duotone_filter');
```

### Configure Preset Colors

Apply the preset's color values to the effect using `setColor()` for colors and `setFloat()` for intensity:

```typescript highlight=highlight-apply-preset
// Configure effect with preset colors (convert hex to RGBA)
if (duotonePresets.length > 0) {
  const preset = duotonePresets[0];
  if (preset.meta?.darkColor) {
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/darkColor',
      hexToRgba(preset.meta.darkColor as string)
    );
  }
  if (preset.meta?.lightColor) {
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/lightColor',
      hexToRgba(preset.meta.lightColor as string)
    );
  }
} else {
  // Fallback: Desert preset colors (#5c3a15, #f0d8b8)
  engine.block.setColor(
    duotoneEffect,
    'effect/duotone_filter/darkColor',
    hexToRgba('#5c3a15')
  );
  engine.block.setColor(
    duotoneEffect,
    'effect/duotone_filter/lightColor',
    hexToRgba('#f0d8b8')
  );
}
engine.block.setFloat(
  duotoneEffect,
  'effect/duotone_filter/intensity',
  0.9
);
```

### Append Effect to Block

Attach the fully configured effect to an image block:

```typescript highlight=highlight-append-effect
// Attach the configured effect to the image block
engine.block.appendEffect(presetImageBlock, duotoneEffect);
```

## Creating Custom Colors

For brand-specific treatments or unique creative effects, define your own color combinations using `engine.block.setColor()`:

```typescript highlight=highlight-custom-colors
    // Create duotone with custom brand colors
    const customDuotone = engine.block.createEffect('duotone_filter');

    // Dark color: deep navy blue (shadows)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.1,
      g: 0.15,
      b: 0.3,
      a: 1.0
    });

    // Light color: warm cream (highlights)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/lightColor', {
      r: 0.95,
      g: 0.9,
      b: 0.8,
      a: 1.0
    });

    // Control effect strength (0.0 = original, 1.0 = full duotone)
    engine.block.setFloat(
      customDuotone,
      'effect/duotone_filter/intensity',
      0.85
    );

    engine.block.appendEffect(customImageBlock, customDuotone);
```

### Choosing Effective Color Pairs

The relationship between your dark and light colors determines the final aesthetic:

| Color Relationship | Visual Effect | Example Use Case |
| --- | --- | --- |
| **High contrast** | Bold, graphic look | Social media, posters |
| **Low contrast** | Subtle, sophisticated | Editorial, luxury brands |
| **Warm to cool** | Dynamic temperature shift | Lifestyle, fashion |
| **Monochromatic** | Tinted photography style | Vintage, noir aesthetic |

**Classic combinations to try:**

- **Cyanotype**: Deep blue (`#1a365d`) to light cyan (`#e0f7fa`)
- **Sepia**: Dark brown (`#3e2723`) to cream (`#fff8e1`)
- **Neon**: Deep purple (`#1a1a2e`) to hot pink (`#ff1493`)
- **Corporate**: Navy (`#0d47a1`) to silver (`#eceff1`)

> **Tip:** Start with colors from your brand palette. Use your primary brand color as the light color for highlights, paired with a darker complementary shade for shadows.

## Combining with Other Effects

Duotone can be stacked with other effects like brightness adjustments, contrast, or blur. Effects are applied in stack order, so the sequence affects the final result:

```typescript highlight=highlight-combine-effects
    // Combine duotone with other effects
    // First, add adjustments for brightness and contrast
    const adjustments = engine.block.createEffect('adjustments');
    engine.block.setFloat(adjustments, 'effect/adjustments/brightness', 0.1);
    engine.block.setFloat(adjustments, 'effect/adjustments/contrast', 0.15);
    engine.block.appendEffect(combinedImageBlock, adjustments);

    // Then add duotone on top
    const combinedDuotone = engine.block.createEffect('duotone_filter');
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.2,
      g: 0.1,
      b: 0.3,
      a: 1.0 // Deep purple
    });
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/lightColor', {
      r: 1.0,
      g: 0.85,
      b: 0.7,
      a: 1.0 // Warm peach
    });
    engine.block.setFloat(
      combinedDuotone,
      'effect/duotone_filter/intensity',
      0.75
    );
    engine.block.appendEffect(combinedImageBlock, combinedDuotone);
```

**Effect order matters**: In this example, brightness and contrast are applied first, then duotone maps the adjusted tones. Reversing the order would apply duotone first, then adjust the duotone colors' brightness—producing a different result.

Common combinations:

- **Adjustments → Duotone**: Optimize image contrast before applying duotone for better tonal separation
- **Duotone → Vignette**: Add depth with darkened edges after the color treatment
- **Blur → Duotone**: Create dreamy, soft-focus duotone backgrounds

## Managing Duotone Effects

Once effects are applied to a block, you can list, toggle, and remove them programmatically.

### List Applied Effects

Retrieve all effect block IDs currently attached to a block:

```typescript highlight=highlight-list-effects
// Get all effects currently applied to a block
const appliedEffects = engine.block.getEffects(presetImageBlock);
```

### Toggle Effect Visibility

Disable an effect temporarily without removing it from the block:

```typescript highlight=highlight-toggle-effects
    // Disable an effect without removing it
    if (appliedEffects.length > 0) {
      engine.block.setEffectEnabled(appliedEffects[0], false);

      // Check if an effect is currently enabled
      const isEnabled = engine.block.isEffectEnabled(appliedEffects[0]);
      console.log(`Effect enabled: ${isEnabled}`);

      // Re-enable the effect
      engine.block.setEffectEnabled(appliedEffects[0], true);
    }
```

### Remove Effects

Detach an effect from a block by specifying its index in the effect stack:

```typescript highlight=highlight-remove-effect
// Remove an effect at a specific index from a block
const effectsOnCustom = engine.block.getEffects(customImageBlock);
if (effectsOnCustom.length > 0) {
  engine.block.removeEffect(customImageBlock, 0);
}
```

### Clean Up Resources

After removing an effect, destroy it to free memory:

```typescript highlight=highlight-cleanup-effect
// Destroy removed effect blocks to free memory
if (effectsOnCustom.length > 0) {
  engine.block.destroy(effectsOnCustom[0]);
}
```

> **Caution:** When removing effects, always destroy the effect block afterward to prevent memory leaks. Effects are independent blocks that persist until explicitly destroyed.

### Duotone Properties

| Property | Type | Range | Description |
| --- | --- | --- | --- |
| `effect/duotone_filter/darkColor` | Color | RGBA (0-1) | Color applied to shadows and dark tones |
| `effect/duotone_filter/lightColor` | Color | RGBA (0-1) | Color applied to highlights and light tones |
| `effect/duotone_filter/intensity` | Float | 0.0 - 1.0 | Effect strength (0 = original, 1 = full duotone) |

**Intensity guidelines:**

- `0.5 - 0.7`: Subtle tint, original image still recognizable
- `0.8 - 0.9`: Strong duotone effect, ideal for most use cases
- `1.0`: Full duotone, no original colors remain

## Best Practices

### Performance Considerations

- **Batch effect creation**: When applying the same duotone to multiple images, create the effect once and clone it rather than creating new effects for each block
- **Limit effect stacking**: Each additional effect increases render time; keep stacks minimal for real-time editing
- **Clean up unused effects**: Always destroy effect blocks when they're no longer needed to free memory
- **Dispose the engine**: In server environments, always call `engine.dispose()` when done to release all resources
- **Process in batches**: For large image sets, process images in batches rather than loading all at once to manage memory usage

### Common Issues

**Duotone not visible**: Verify the block supports effects with `engine.block.supportsEffects(block)`. Only graphic blocks with image or video fills support effects.

**Colors look wrong**: Ensure RGBA values are in the 0-1 range, not 0-255. For example, use `{ r: 0.5, g: 0.5, b: 0.5, a: 1.0 }` instead of `{ r: 128, g: 128, b: 128, a: 255 }`.

**Effect too subtle or overwhelming**: Adjust the intensity property. Start at 0.85 and tune based on your image content and color choices.

**Muddy midtones**: If midtones look flat, increase contrast between your dark and light colors, or add an adjustments effect before duotone to improve tonal separation.

## API Reference

### Effect Methods

| Method | Description |
| --- | --- |
| `engine.asset.findAssets(sourceId, query)` | Queries assets from an asset source |
| `engine.block.supportsEffects(block)` | Returns `true` if the block can have effects applied |
| `engine.block.createEffect(type)` | Creates a new effect block of the specified type |
| `engine.block.setColor(block, property, color)` | Sets a color property on a block |
| `engine.block.setFloat(block, property, value)` | Sets a float property on a block |
| `engine.block.appendEffect(block, effect)` | Appends an effect to a block's effect stack |
| `engine.block.getEffects(block)` | Returns array of effect block IDs applied to a block |
| `engine.block.setEffectEnabled(effect, enabled)` | Enables or disables an effect |
| `engine.block.isEffectEnabled(effect)` | Returns `true` if the effect is enabled |
| `engine.block.removeEffect(block, index)` | Removes an effect at the given index from a block |
| `engine.block.destroy(block)` | Destroys a block and frees resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support