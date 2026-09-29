> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Apply Custom LUT Filter](./filters-and-effects/create-custom-lut-filter.md)

---

Apply custom LUT (Look-Up Table) filters to achieve brand-consistent color grading in server-side applications using CE.SDK's headless Creative Engine.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-create-custom-lut-filter-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-create-custom-lut-filter-server-js)

LUT filters remap colors through a predefined transformation table, enabling cinematic color grading and consistent brand aesthetics. This guide shows how to apply your own LUT files directly to design elements using the effect API in server-side Node.js applications.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-create-custom-lut-filter-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Custom LUT Filter
 *
 * Demonstrates applying custom LUT filters directly using the effect API:
 * - Creating a lut_filter effect
 * - Configuring the LUT file URI and tile dimensions
 * - Setting filter intensity
 * - Toggling the effect on and off
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

    // Add an image block to apply the LUT filter
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 150,
      y: 100,
      size: { width: 500, height: 400 }
    });
    engine.block.appendChild(page, imageBlock);

    // Create a LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);

    // Set filter intensity (0.0 = no effect, 1.0 = full effect)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);

    // Toggle the effect off and back on
    engine.block.setEffectEnabled(lutEffect, false);
    const isEnabled = engine.block.isEffectEnabled(lutEffect);
    console.log('Effect enabled:', isEnabled); // false

    engine.block.setEffectEnabled(lutEffect, true);

    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Supports effects:', supportsEffects); // true

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/custom-lut-filter.png`, buffer);

    console.log('Exported result to output/custom-lut-filter.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

## Understanding LUT Image Format

CE.SDK uses a tiled PNG format where a 3D color cube is laid out as a 2D grid. Each tile represents a slice of the color cube along the blue axis.

The LUT image requires two configuration values:

- **`horizontalTileCount`** - Number of tiles across the image width
- **`verticalTileCount`** - Number of tiles down the image height

CE.SDK supports these tile configurations:

- 5×5 tiles with 128px cube size
- 8×8 tiles with 512px cube size

Standard `.cube` files must be converted to this tiled PNG format using image processing tools.

## Creating LUT PNG Images

### Obtaining LUT Files

LUT files are available from multiple sources:

- **Color grading software** - Adobe Photoshop, DaVinci Resolve, and Affinity Photo can export 3D LUT files in `.cube` format
- **Online LUT libraries** - Many free and commercial LUT packs are available for download
- **LUT generators** - Tools that create custom color transformations from reference images

### Converting .cube to Tiled PNG

CE.SDK requires LUTs in a specific tiled PNG format where each tile represents a slice of the 3D color cube along the blue axis. To convert a standard `.cube` file:

1. **Parse the .cube file** - Read the 3D color lookup table data
2. **Arrange slices as tiles** - Each blue channel value becomes a separate tile containing the red-green color plane
3. **Export as PNG** - Save the grid as a PNG image

CE.SDK's built-in LUTs follow a naming convention: `imgly_lut_{name}_{h}_{v}_{cubeSize}.png` where `h` and `v` are tile counts and `cubeSize` indicates the LUT precision.

### Using Python for Conversion

You can write a Python script using PIL/Pillow and NumPy to convert `.cube` files:

```python
# Pseudocode for .cube to tiled PNG conversion
# 1. Parse the .cube file to extract the 3D LUT data
# 2. Reshape data into (blue_slices, height, width, 3) array
# 3. Arrange slices in a grid matching tile configuration
# 4. Save as PNG with Image.fromarray()
```

### Using CE.SDK's Built-in LUTs

You can reference CE.SDK's built-in LUT assets as format-verified examples. The filter extension at `ly.img.filter/LUTs` contains pre-generated tiled PNGs you can inspect to confirm tile counts, cube size, and overall layout when authoring or converting your own LUTs.

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

## Add an Image Block

Add an image block to apply the LUT filter. The `addImage()` convenience API simplifies image block creation.

```typescript highlight=highlight-add-image
// Add an image block to apply the LUT filter
const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
const imageBlock = await engine.block.addImage(imageUri, {
  x: 150,
  y: 100,
  size: { width: 500, height: 400 }
});
engine.block.appendChild(page, imageBlock);
```

## Create the LUT Effect

Create a `lut_filter` effect instance using the effect API.

```typescript highlight=highlight-create-effect
// Create a LUT filter effect
const lutEffect = engine.block.createEffect(
  '//ly.img.ubq/effect/lut_filter'
);
```

This creates an effect that can be configured and applied to image blocks.

## Configure LUT Properties

Set the LUT file URL and tile dimensions to match your LUT image.

```typescript highlight=highlight-configure-lut
    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);
```

The tile counts must match the actual LUT image grid structure. Using incorrect values produces distorted colors.

## Set Filter Intensity

Control the strength of the color transformation with intensity.

```typescript highlight=highlight-set-intensity
// Set filter intensity (0.0 = no effect, 1.0 = full effect)
engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);
```

Values range from 0.0 (no effect) to 1.0 (full effect). Use intermediate values for subtle color grading.

## Apply the Effect

Attach the configured effect to an image block.

```typescript highlight=highlight-apply-effect
// Apply the effect to the image block
engine.block.appendEffect(imageBlock, lutEffect);
```

The effect renders immediately after being applied.

## Toggle the Effect

Enable or disable the effect without removing it.

```typescript highlight=highlight-toggle-effect
    // Toggle the effect off and back on
    engine.block.setEffectEnabled(lutEffect, false);
    const isEnabled = engine.block.isEffectEnabled(lutEffect);
    console.log('Effect enabled:', isEnabled); // false

    engine.block.setEffectEnabled(lutEffect, true);
```

Disabling preserves all effect settings while temporarily removing the visual transformation.

## Manage Effects

Retrieve and inspect effects applied to a block.

```typescript highlight=highlight-manage-effects
    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Supports effects:', supportsEffects); // true
```

Use `getEffects()` to access all effects on a block and `supportsEffects()` to verify compatibility before applying.

## Export and Cleanup

After applying the LUT filter, we export the result to a file and dispose of the engine to free resources.

```typescript highlight=highlight-export
    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/custom-lut-filter.png`, buffer);

    console.log('Exported result to output/custom-lut-filter.png');
```

Always dispose of the engine in a finally block to ensure resources are freed even if an error occurs.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Troubleshooting

### LUT Not Rendering

- Verify the LUT image URL is accessible from your server
- Confirm the image uses PNG format
- Check that tile count values match the actual image grid

### Colors Look Wrong

- Verify tile counts match the LUT image structure
- Ensure the LUT was generated with sRGB color space

### Effect Not Visible in Export

- Verify the effect is enabled with `isEffectEnabled()`
- Ensure the effect was appended to the block, not just created
- Check the block supports effects using `supportsEffects()`

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.createEffect('//ly.img.ubq/effect/lut_filter')` | Create a LUT filter effect instance |
| `engine.block.setString(effect, 'effect/lut_filter/lutFileURI', uri)` | Set the LUT image URL |
| `engine.block.setInt(effect, 'effect/lut_filter/horizontalTileCount', count)` | Set horizontal tile count |
| `engine.block.setInt(effect, 'effect/lut_filter/verticalTileCount', count)` | Set vertical tile count |
| `engine.block.setFloat(effect, 'effect/lut_filter/intensity', value)` | Set filter intensity (0.0-1.0) |
| `engine.block.appendEffect(block, effect)` | Apply effect to a block |
| `engine.block.getEffects(block)` | Get all effects on a block |
| `engine.block.setEffectEnabled(effect, enabled)` | Enable or disable an effect |
| `engine.block.isEffectEnabled(effect)` | Check if effect is enabled |
| `engine.block.removeEffect(block, index)` | Remove effect at index |
| `engine.block.destroy(effect)` | Destroy an effect instance |
| `engine.block.supportsEffects(block)` | Check if block supports effects |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support