> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Apply Filter or Effect](./filters-and-effects/apply.md)

---

Apply professional color grading, blur effects, and artistic treatments to
design elements using CE.SDK's visual effects system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-apply-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-apply-server-js)

While CE.SDK uses a unified effect API for both filters and effects, they serve different purposes. **Filters** typically apply color transformations like LUT filters and duotone, while **effects** apply visual modifications such as blur, pixelize, vignette, and image adjustments. You can combine multiple effects on a single element, creating complex visual treatments by stacking them in a customizable order.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-apply-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Apply Filters and Effects
 *
 * Demonstrates applying various filters and effects to image blocks:
 * - Checking effect support
 * - Applying basic effects (blur)
 * - Configuring effect parameters (adjustments)
 * - Applying LUT filters
 * - Applying duotone filters
 * - Combining multiple effects
 * - Managing effect stacks
 * - Batch processing
 * - Exporting results
 */

/**
 * Convert hex color string to RGBA values (0-1 range)
 */
function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0
      }
    : { r: 0, g: 0, b: 0, a: 1.0 };
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Block size for grid layout (will be positioned at the end)
  const blockSize = { width: 200, height: 150 };

  // Create an image block to check effect support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if a block supports effects - graphic blocks with image fills support effects
  const supportsEffects = engine.block.supportsEffects(sampleBlock);
  console.log('Block supports effects:', supportsEffects); // true

  // Page blocks support effects when they have fills applied
  const pageSupportsEffects = engine.block.supportsEffects(page);
  console.log('Page supports effects:', pageSupportsEffects);

  // Create a separate image block for blur demonstration
  const blurImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, blurImageBlock);

  // Create and apply a blur effect
  const blurEffect = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(blurImageBlock, blurEffect);

  // Adjust blur intensity (0.0 to 1.0)
  engine.block.setFloat(blurEffect, 'effect/extrude_blur/amount', 0.5);

  // Create a separate image block for adjustments demonstration
  const adjustmentsImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, adjustmentsImageBlock);

  // Create adjustments effect for brightness and contrast
  const adjustmentsEffect = engine.block.createEffect('adjustments');
  engine.block.appendEffect(adjustmentsImageBlock, adjustmentsEffect);

  // Set brightness, contrast, and saturation
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(adjustmentsEffect, 'effect/adjustments/contrast', 0.15);
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/saturation',
    0.1
  );

  // Find all available properties for this effect
  const adjustmentProperties =
    engine.block.findAllProperties(adjustmentsEffect);
  console.log('Available adjustment properties:', adjustmentProperties);

  // Demonstrate LUT filters by applying 2 different presets (Grid positions 3-4)
  // LUT configurations with different color grading styles
  const lutConfigs = [
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    },
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    }
  ];

  const lutImageBlocks = [];
  for (const lutConfig of lutConfigs) {
    const lutImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, lutImageBlock);
    lutImageBlocks.push(lutImageBlock);

    // Create LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Configure LUT with preset filter settings
    engine.block.setString(
      lutEffect,
      'effect/lut_filter/lutFileURI',
      lutConfig.uri
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/horizontalTileCount',
      lutConfig.horizontalTileCount
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/verticalTileCount',
      lutConfig.verticalTileCount
    );
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(lutImageBlock, lutEffect);
  }

  // Demonstrate Duotone filters by applying 2 different color combinations (Grid positions 5-6)
  // Duotone configurations with different color schemes
  const duotoneConfigs = [
    { darkColor: '#0b3d5b', lightColor: '#f8bc60' }, // Blue/Orange
    { darkColor: '#2d1e3e', lightColor: '#e8d5b7' } // Purple/Cream
  ];

  const duotoneImageBlocks = [];
  for (const duotoneConfig of duotoneConfigs) {
    const duotoneImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, duotoneImageBlock);
    duotoneImageBlocks.push(duotoneImageBlock);

    // Create duotone filter effect
    const duotoneEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/duotone_filter'
    );

    // Configure duotone colors using hex to RGBA conversion
    const darkColor = hexToRgba(duotoneConfig.darkColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/darkColor',
      darkColor
    );

    const lightColor = hexToRgba(duotoneConfig.lightColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/lightColor',
      lightColor
    );

    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.8
    );
    engine.block.appendEffect(duotoneImageBlock, duotoneEffect);
  }

  // Create an image block to demonstrate combining multiple effects (Grid position 7)
  const combinedImageBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 150 }
  });
  engine.block.appendChild(page, combinedImageBlock);

  // Apply effects in order - the stack will contain:
  // 1. adjustments (brightness/contrast) - applied first
  // 2. blur - applied second
  // 3. duotone (color tinting) - applied third
  // 4. pixelize - applied last

  const combinedAdjustments = engine.block.createEffect('adjustments');
  engine.block.appendEffect(combinedImageBlock, combinedAdjustments);
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/contrast',
    0.15
  );

  const combinedBlur = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(combinedImageBlock, combinedBlur);
  engine.block.setFloat(combinedBlur, 'effect/extrude_blur/amount', 0.3);

  const combinedDuotone = engine.block.createEffect('duotone_filter');
  engine.block.appendEffect(combinedImageBlock, combinedDuotone);
  engine.block.setColor(combinedDuotone, 'duotone_filter/darkColor', {
    r: 0.1,
    g: 0.2,
    b: 0.4,
    a: 1.0
  });
  engine.block.setColor(combinedDuotone, 'duotone_filter/lightColor', {
    r: 0.9,
    g: 0.8,
    b: 0.6,
    a: 1.0
  });
  engine.block.setFloat(combinedDuotone, 'duotone_filter/intensity', 0.6);

  const pixelizeEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(combinedImageBlock, pixelizeEffect);
  engine.block.setInt(pixelizeEffect, 'pixelize/horizontalPixelSize', 8);
  engine.block.setInt(pixelizeEffect, 'pixelize/verticalPixelSize', 8);

  // Get all effects applied to the combined block
  const effects = engine.block.getEffects(combinedImageBlock);
  console.log('Applied effects:', effects);

  // Access properties of specific effects
  effects.forEach((effect, index) => {
    const effectType = engine.block.getType(effect);
    const isEnabled = engine.block.isEffectEnabled(effect);
    console.log(`Effect ${index}: ${effectType}, enabled: ${isEnabled}`);
  });

  // Check if effect is enabled and toggle
  const isBlurEnabled = engine.block.isEffectEnabled(combinedBlur);
  console.log('Blur effect is enabled:', isBlurEnabled);

  // Temporarily disable the blur effect
  engine.block.setEffectEnabled(combinedBlur, false);
  console.log(
    'Blur effect disabled:',
    !engine.block.isEffectEnabled(combinedBlur)
  );

  // Re-enable for final export
  engine.block.setEffectEnabled(combinedBlur, true);

  // Create a temporary block to demonstrate effect removal (Grid position 8)
  const tempBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, tempBlock);

  const tempEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(tempBlock, tempEffect);
  engine.block.setInt(tempEffect, 'pixelize/horizontalPixelSize', 12);

  // Remove the effect from the block
  const tempEffects = engine.block.getEffects(tempBlock);
  const effectIndex = tempEffects.indexOf(tempEffect);
  if (effectIndex !== -1) {
    engine.block.removeEffect(tempBlock, effectIndex);
  }

  // Destroy the removed effect to free memory
  engine.block.destroy(tempEffect);
  console.log('Effect removed and destroyed');

  // ===== Position all blocks in grid layout =====
  // Calculate grid positions for 9 blocks (3x3 grid)
  const spacing = 20;
  const margin = 40;
  const cols = 3;
  const totalGridWidth = cols * blockSize.width + (cols - 1) * spacing;
  const startX = (800 - totalGridWidth) / 2;
  const startY = margin;

  const getPosition = (index: number) => ({
    x: startX + (index % cols) * (blockSize.width + spacing),
    y: startY + Math.floor(index / cols) * (blockSize.height + spacing)
  });

  const blocks = [
    sampleBlock, // Position 0
    blurImageBlock, // Position 1
    adjustmentsImageBlock, // Position 2
    ...lutImageBlocks, // Positions 3-4
    ...duotoneImageBlocks, // Positions 5-6
    combinedImageBlock, // Position 7
    tempBlock // Position 8
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Apply same effects to multiple blocks (batch processing)
  const allGraphics = engine.block.findByType('graphic');

  allGraphics.forEach((graphic) => {
    if (engine.block.supportsEffects(graphic)) {
      // Only apply to blocks that don't already have effects
      const existingEffects = engine.block.getEffects(graphic);
      if (existingEffects.length === 0) {
        const effect = engine.block.createEffect('adjustments');
        engine.block.appendEffect(graphic, effect);
        engine.block.setFloat(effect, 'effect/adjustments/brightness', 0.1);
      }
    }
  });
  console.log('Batch processing complete');

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/filters-and-effects.png', buffer);
  console.log('Exported to output/filters-and-effects.png');
} finally {
  engine.dispose();
}
```

This guide covers how to apply and manage effects programmatically using the block API.

## Programmatic Effect Application

### Initialize CE.SDK

For applications that need to apply effects programmatically—whether for automation, batch processing, or dynamic user experiences—we start by setting up CE.SDK with the proper configuration.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

This initializes the CE.SDK engine in headless mode, giving you full API access to the effects system without UI dependencies.

### Check Effect Support

Before applying effects to a block, we check whether it supports them. Not all block types can have effects applied—for example, scene blocks do not support effects.

```typescript highlight-supportsEffects
  // Create an image block to check effect support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if a block supports effects - graphic blocks with image fills support effects
  const supportsEffects = engine.block.supportsEffects(sampleBlock);
  console.log('Block supports effects:', supportsEffects); // true

  // Page blocks support effects when they have fills applied
  const pageSupportsEffects = engine.block.supportsEffects(page);
  console.log('Page supports effects:', pageSupportsEffects);
```

Effect support is available for:

- **Graphic blocks** with image fills
- **Graphic blocks** with video fills (with performance considerations)
- **Shape blocks** with fills
- **Text blocks** (with limited effect types)
- **Page blocks** (particularly when they have fills applied, such as background fills)

Always verify support before creating and applying effects to avoid errors.

### Apply Basic Effects

Once we've confirmed a block supports effects, we can create and apply effects using the effect API. Here we create a separate image block using the convenience `addImage()` API and apply a blur effect to it.

> **Tip:** The example code uses the `engine.block.addImage()` convenience API throughout
> this guide. This built-in helper simplifies image block creation compared to
> manually constructing graphic blocks with image fills, and provides additional
> configuration options like positioning, sizing, corner radius, shadows, and
> time-based properties.

```typescript highlight-createEffect
  // Create a separate image block for blur demonstration
  const blurImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, blurImageBlock);

  // Create and apply a blur effect
  const blurEffect = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(blurImageBlock, blurEffect);

  // Adjust blur intensity (0.0 to 1.0)
  engine.block.setFloat(blurEffect, 'effect/extrude_blur/amount', 0.5);
```

CE.SDK provides several built-in effect types:

- `extrude_blur` - Gaussian blur with configurable intensity
- `adjustments` - Brightness, contrast, saturation, exposure
- `pixelize` - Pixelation effect
- `vignette` - Darkened corners
- `half_tone` - Halftone pattern
- `lut_filter` - Color grading with LUT files
- `duotone` - Two-color tinting

> **Note:** `extrude_blur` is the only blur available as an effect. CE.SDK also provides
> additional blur types in a separate blur category.

Each effect type has its own set of configurable properties that control its visual appearance.

### Configure Effect Parameters

After creating an effect, we can customize its appearance by setting properties. Each effect exposes different parameters depending on its type and capabilities.

```typescript highlight-modifyProperties
  // Create a separate image block for adjustments demonstration
  const adjustmentsImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, adjustmentsImageBlock);

  // Create adjustments effect for brightness and contrast
  const adjustmentsEffect = engine.block.createEffect('adjustments');
  engine.block.appendEffect(adjustmentsImageBlock, adjustmentsEffect);

  // Set brightness, contrast, and saturation
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(adjustmentsEffect, 'effect/adjustments/contrast', 0.15);
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/saturation',
    0.1
  );
```

CE.SDK provides typed setter methods for different parameter types:

- **`setFloat()`** - For intensity, amount, and radius values (typically 0.0 to 1.0)
- **`setInt()`** - For discrete values like pixel sizes
- **`setString()`** - For file URIs (LUT files, image references)
- **`setBool()`** - For enabling or disabling specific features

Using the correct setter method ensures type safety and proper value validation.

### Apply LUT Filters

LUT (Look-Up Table) filters apply professional color grading by transforming colors through a predefined mapping. These are particularly useful for creating consistent brand aesthetics or applying cinematic color treatments.

```typescript highlight-apply-lut-filter
  // Demonstrate LUT filters by applying 2 different presets (Grid positions 3-4)
  // LUT configurations with different color grading styles
  const lutConfigs = [
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    },
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    }
  ];

  const lutImageBlocks = [];
  for (const lutConfig of lutConfigs) {
    const lutImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, lutImageBlock);
    lutImageBlocks.push(lutImageBlock);

    // Create LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Configure LUT with preset filter settings
    engine.block.setString(
      lutEffect,
      'effect/lut_filter/lutFileURI',
      lutConfig.uri
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/horizontalTileCount',
      lutConfig.horizontalTileCount
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/verticalTileCount',
      lutConfig.verticalTileCount
    );
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(lutImageBlock, lutEffect);
  }
```

LUT filters are ideal for:

- Creating consistent brand aesthetics across all designs
- Applying cinematic or film-style color grading
- Matching reference images or maintaining color continuity
- Building curated filter collections for users

**LUT configuration**: Each LUT file requires specifying the `lutFileURI` pointing to the LUT image, along with `horizontalTileCount` and `verticalTileCount` describing the grid layout of color transformation cubes.

### Apply Duotone Filters

Duotone filters create artistic two-color effects by mapping image tones to two colors (dark and light). This effect is popular for creating stylized visuals, vintage aesthetics, or brand-specific color treatments.

The example applies duotone filters using direct color configuration. The `hexToRgba` utility converts hex color values to RGBA format required by the `setColor` API.

```typescript highlight-apply-duotone-filter
  // Demonstrate Duotone filters by applying 2 different color combinations (Grid positions 5-6)
  // Duotone configurations with different color schemes
  const duotoneConfigs = [
    { darkColor: '#0b3d5b', lightColor: '#f8bc60' }, // Blue/Orange
    { darkColor: '#2d1e3e', lightColor: '#e8d5b7' } // Purple/Cream
  ];

  const duotoneImageBlocks = [];
  for (const duotoneConfig of duotoneConfigs) {
    const duotoneImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, duotoneImageBlock);
    duotoneImageBlocks.push(duotoneImageBlock);

    // Create duotone filter effect
    const duotoneEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/duotone_filter'
    );

    // Configure duotone colors using hex to RGBA conversion
    const darkColor = hexToRgba(duotoneConfig.darkColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/darkColor',
      darkColor
    );

    const lightColor = hexToRgba(duotoneConfig.lightColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/lightColor',
      lightColor
    );

    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.8
    );
    engine.block.appendEffect(duotoneImageBlock, duotoneEffect);
  }
```

Duotone filters work by:

- Mapping darker image tones to the **dark color**
- Mapping lighter image tones to the **light color**
- Blending between the two colors based on pixel brightness
- Adjusting intensity to control the effect strength (0.0 to 1.0)

**Color format**: Duotone colors use RGBA values in the 0.0 to 1.0 range. Convert hex colors using a helper function as shown in the example.

### Combine Multiple Effects

One of the most powerful features of CE.SDK's effect system is the ability to stack multiple effects on a single block. Each effect is applied sequentially, allowing you to build complex visual treatments.

> **Note:** The example code demonstrates each effect type individually on separate image
> blocks before showing them combined. This educational approach helps you
> understand what each effect does before seeing them work together. In your
> production code, you can apply multiple effects directly to the same block
> without this separation.

```typescript highlight-addEffect
  // Create an image block to demonstrate combining multiple effects (Grid position 7)
  const combinedImageBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 150 }
  });
  engine.block.appendChild(page, combinedImageBlock);

  // Apply effects in order - the stack will contain:
  // 1. adjustments (brightness/contrast) - applied first
  // 2. blur - applied second
  // 3. duotone (color tinting) - applied third
  // 4. pixelize - applied last

  const combinedAdjustments = engine.block.createEffect('adjustments');
  engine.block.appendEffect(combinedImageBlock, combinedAdjustments);
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/contrast',
    0.15
  );

  const combinedBlur = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(combinedImageBlock, combinedBlur);
  engine.block.setFloat(combinedBlur, 'effect/extrude_blur/amount', 0.3);

  const combinedDuotone = engine.block.createEffect('duotone_filter');
  engine.block.appendEffect(combinedImageBlock, combinedDuotone);
  engine.block.setColor(combinedDuotone, 'duotone_filter/darkColor', {
    r: 0.1,
    g: 0.2,
    b: 0.4,
    a: 1.0
  });
  engine.block.setColor(combinedDuotone, 'duotone_filter/lightColor', {
    r: 0.9,
    g: 0.8,
    b: 0.6,
    a: 1.0
  });
  engine.block.setFloat(combinedDuotone, 'duotone_filter/intensity', 0.6);

  const pixelizeEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(combinedImageBlock, pixelizeEffect);
  engine.block.setInt(pixelizeEffect, 'pixelize/horizontalPixelSize', 8);
  engine.block.setInt(pixelizeEffect, 'pixelize/verticalPixelSize', 8);
```

**Effect ordering matters**: Effects are applied from the bottom of the stack to the top. In this example:

1. First, we adjust brightness and contrast
2. Then, we apply blur
3. Then, we apply color grading with duotone
4. Finally, we add stylization with pixelization

Experiment with different orderings to achieve the desired visual result—changing the order can significantly impact the final appearance.

## Managing Applied Effects

### List and Access Effects

We can retrieve all effects applied to a block and inspect their properties. This is useful for building effect management logic or debugging effect configurations.

```typescript highlight-getEffects
  // Get all effects applied to the combined block
  const effects = engine.block.getEffects(combinedImageBlock);
  console.log('Applied effects:', effects);

  // Access properties of specific effects
  effects.forEach((effect, index) => {
    const effectType = engine.block.getType(effect);
    const isEnabled = engine.block.isEffectEnabled(effect);
    console.log(`Effect ${index}: ${effectType}, enabled: ${isEnabled}`);
  });
```

This allows you to iterate through all applied effects, read their properties, and make modifications as needed.

### Enable/Disable Effects

CE.SDK allows you to temporarily toggle effects on and off without removing them from the block. This is particularly useful for before/after comparisons or conditional rendering in processing pipelines.

```typescript highlight-disableEffect
  // Check if effect is enabled and toggle
  const isBlurEnabled = engine.block.isEffectEnabled(combinedBlur);
  console.log('Blur effect is enabled:', isBlurEnabled);

  // Temporarily disable the blur effect
  engine.block.setEffectEnabled(combinedBlur, false);
  console.log(
    'Blur effect disabled:',
    !engine.block.isEffectEnabled(combinedBlur)
  );

  // Re-enable for final export
  engine.block.setEffectEnabled(combinedBlur, true);
```

When you disable an effect, it remains attached to the block but won't be rendered until you enable it again. This preserves all effect parameters while giving you full control over when the effect is applied.

You can use this feature to create comparison outputs, implement conditional processing, or optimize rendering based on output requirements.

### Remove Effects

When you no longer need an effect, you can remove it from the effect stack and free its resources. Always destroy effects that are no longer in use to prevent memory leaks.

```typescript highlight-destroyEffect
  // Create a temporary block to demonstrate effect removal (Grid position 8)
  const tempBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, tempBlock);

  const tempEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(tempBlock, tempEffect);
  engine.block.setInt(tempEffect, 'pixelize/horizontalPixelSize', 12);

  // Remove the effect from the block
  const tempEffects = engine.block.getEffects(tempBlock);
  const effectIndex = tempEffects.indexOf(tempEffect);
  if (effectIndex !== -1) {
    engine.block.removeEffect(tempBlock, effectIndex);
  }

  // Destroy the removed effect to free memory
  engine.block.destroy(tempEffect);
  console.log('Effect removed and destroyed');
```

The `removeEffect()` method takes an index position, so you can remove effects selectively from any position in the stack. After removal, destroy the effect instance to ensure proper cleanup.

## Additional Techniques

### Batch Processing

For applications that need to apply the same effects to multiple elements, we can iterate through a collection of blocks and apply effects efficiently.

```typescript highlight-batch-processing
  // Apply same effects to multiple blocks (batch processing)
  const allGraphics = engine.block.findByType('graphic');

  allGraphics.forEach((graphic) => {
    if (engine.block.supportsEffects(graphic)) {
      // Only apply to blocks that don't already have effects
      const existingEffects = engine.block.getEffects(graphic);
      if (existingEffects.length === 0) {
        const effect = engine.block.createEffect('adjustments');
        engine.block.appendEffect(graphic, effect);
        engine.block.setFloat(effect, 'effect/adjustments/brightness', 0.1);
      }
    }
  });
  console.log('Batch processing complete');
```

When batch processing, check effect support before creating effects to avoid unnecessary work. You can also reuse effect instances when applying the same configuration to multiple blocks, though be careful to destroy them properly when done.

### Custom Effect Combinations

Creating reusable effect presets allows you to maintain consistent styling across your application and speed up common effect applications. Here's a pattern for building reusable effect configurations:

```typescript
// Create a reusable preset function
async function applyVintagePreset(engine: CreativeEngine, imageBlock: number) {
  // Apply LUT filter
  const lutEffect = engine.block.createEffect('lut_filter');
  engine.block.setString(
    lutEffect,
    'lut_filter/lutFileURI',
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
  );
  engine.block.appendEffect(imageBlock, lutEffect);

  // Add vignette
  const vignetteEffect = engine.block.createEffect('vignette');
  engine.block.setFloat(vignetteEffect, 'vignette/intensity', 0.5);
  engine.block.appendEffect(imageBlock, vignetteEffect);

  return { lutEffect, vignetteEffect };
}

// Use the preset
const effects = await applyVintagePreset(engine, myImageBlock);
```

Preset strategies include:

- **Brand filters** - Maintain a consistent look across campaigns
- **Style templates** - Provide quick application of complex multi-effect treatments
- **Processing pipelines** - Apply standardized effects across batch operations

### Export Results

After applying effects, export the processed content to a file. CE.SDK supports various export formats including PNG, JPEG, and PDF.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/filters-and-effects.png', buffer);
  console.log('Exported to output/filters-and-effects.png');
```

The export operation renders all effects and saves the result to the file system. Always dispose of the engine instance when processing is complete to free resources.

## Performance Considerations

CE.SDK's effect system is optimized for performance, but understanding these considerations helps you build efficient processing pipelines:

- **GPU acceleration**: Effects leverage GPU rendering for smooth performance on modern systems
- **Effect complexity**: Blur and LUT filters are computationally expensive compared to simple adjustments
- **Video effects**: Apply effects sparingly to video blocks to maintain smooth processing
- **Batch optimization**: When processing many images, consider reusing engine instances rather than reinitializing

Test your effect combinations with representative workloads early in development to ensure acceptable performance.

## Troubleshooting

### Effect Not Visible

If an effect doesn't appear after applying it, check these common issues:

- Verify the block type supports effects using `supportsEffects()`
- Check that the effect is enabled with `isEffectEnabled()`
- Ensure effect parameters are in valid ranges (e.g., intensity values between 0.0 and 1.0)
- Confirm the effect is in the effect stack with `getEffects()`

### Performance Degradation

If you experience slow processing:

- Reduce the number of effects per element
- Lower blur radius values or use smaller LUT files
- Temporarily disable effects during intermediate operations with `setEffectEnabled()`
- Profile your processing pipeline to identify bottlenecks

### Effects Not Persisting

Effects should save automatically with the scene, but verify:

- You're not destroying effects prematurely before saving
- Save/load operations complete successfully
- Effect URIs (LUT files, images) remain accessible after loading

### Incompatible Block Types

If you can't apply an effect:

- Remember that graphic blocks (with image or video fills), shape blocks, and text blocks support effects
- Page blocks support effects when they have fills applied (such as background fills)
- Scene blocks cannot have effects applied
- Check the block type with `block.getType()` and use `block.supportsEffects()` before attempting to apply effects

## API Reference

| Method                                     | Description                                |
| ------------------------------------------ | ------------------------------------------ |
| `block.supportsEffects(block)`             | Check if a block supports effects          |
| `block.createEffect(type)`                 | Create a new effect instance               |
| `block.appendEffect(block, effect)`        | Add effect to the end of the effect stack  |
| `block.insertEffect(block, effect, index)` | Insert effect at a specific position       |
| `block.removeEffect(block, index)`         | Remove effect at the specified index       |
| `block.getEffects(block)`                  | Get all effects applied to a block         |
| `block.setEffectEnabled(effect, enabled)`  | Enable or disable an effect                |
| `block.isEffectEnabled(effect)`            | Check if an effect is currently enabled    |
| `block.findAllProperties(effect)`          | Get all available properties for an effect |
| `block.setFloat(effect, property, value)`  | Set a floating-point property value        |
| `block.setInt(effect, property, value)`    | Set an integer property value              |
| `block.setString(effect, property, value)` | Set a string property value                |
| `block.setBool(effect, property, value)`   | Set a boolean property value               |
| `block.destroy(effect)`                    | Destroy an unused effect instance          |

## About the Example Code

The example code accompanying this guide follows educational design patterns to help you learn effectively:

- **Individual demonstrations**: Each effect type is demonstrated on its own image block before showing combinations, making it easier to understand what each effect does
- **Convenience API usage**: The code uses `engine.block.addImage()` instead of manual block construction—this is the recommended approach for simplicity and maintainability
- **Spatial layout**: Image blocks are positioned in a grid layout (x/y coordinates) so you can see the results of each effect in the exported output
- **Progressive complexity**: The example starts with simple single effects and gradually builds to complex multi-effect combinations

In your production code, you can apply multiple effects directly to the same block without creating separate demonstration blocks. The example structure is optimized for learning, not production usage.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support