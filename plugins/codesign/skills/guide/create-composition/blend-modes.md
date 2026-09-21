> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Blend Modes](./create-composition/blend-modes.md)

---

Control how design blocks visually blend with underlying layers using CE.SDK's
blend mode system for professional layered compositions.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-blend-modes-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-blend-modes-server-js)

Blend modes control how a block's colors combine with underlying layers, similar to blend modes in Photoshop or other design tools. CE.SDK provides 27 blend modes organized into categories: Normal, Darken, Lighten, Contrast, Inversion, and Component. Each category serves different compositing needs—darken modes make images darker, lighten modes make them brighter, and contrast modes increase midtone contrast.

```typescript file=@cesdk_web_examples/guides-create-composition-blend-modes-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize the Creative Engine in headless mode
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
    license: process.env.CESDK_LICENSE || 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    // Create a new scene with a design page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create a background image block as the base layer
    const backgroundBlock = engine.block.create('graphic');
    engine.block.setWidth(backgroundBlock, 800);
    engine.block.setHeight(backgroundBlock, 600);
    engine.block.setPositionX(backgroundBlock, 0);
    engine.block.setPositionY(backgroundBlock, 0);

    // Set the image fill for the background
    const backgroundFill = engine.block.createFill('image');
    engine.block.setString(
      backgroundFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(backgroundBlock, backgroundFill);
    engine.block.appendChild(page, backgroundBlock);

    // Create a second image block on top for blending
    const overlayBlock = engine.block.create('graphic');
    engine.block.setWidth(overlayBlock, 800);
    engine.block.setHeight(overlayBlock, 600);
    engine.block.setPositionX(overlayBlock, 0);
    engine.block.setPositionY(overlayBlock, 0);

    // Set a different image fill for the overlay
    const overlayFill = engine.block.createFill('image');
    engine.block.setString(
      overlayFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    engine.block.setFill(overlayBlock, overlayFill);
    engine.block.appendChild(page, overlayBlock);

    // Check if the block supports blend modes before applying
    if (engine.block.supportsBlendMode(overlayBlock)) {

      // Apply the Multiply blend mode to the overlay
      engine.block.setBlendMode(overlayBlock, 'Multiply');

      // Retrieve and log the current blend mode
      const currentMode = engine.block.getBlendMode(overlayBlock);
      console.log('Current blend mode:', currentMode);
    }

    // Check if the block supports opacity
    if (engine.block.supportsOpacity(overlayBlock)) {
      // Set the opacity to 70%
      engine.block.setOpacity(overlayBlock, 0.7);
    }

    // Retrieve and log the opacity value
    const opacity = engine.block.getOpacity(overlayBlock);
    console.log('Current opacity:', opacity);

    // Export the blended composition to a PNG file
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('output.png', buffer);
    console.log('Exported blended composition to output.png');
  } finally {
    // Always dispose of the engine when done
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to check blend mode support, apply blend modes programmatically, understand the available blend mode options, and combine blend modes with opacity for fine control over layer compositing.

## Checking Blend Mode Support

Before applying a blend mode, verify that the block supports it using `supportsBlendMode()`. Most graphic blocks support blend modes, but always check to avoid errors.

```typescript highlight-check-support
// Check if the block supports blend modes before applying
if (engine.block.supportsBlendMode(overlayBlock)) {
```

Blend mode support is available for graphic blocks with image or video fills, shape blocks, and text blocks. Page blocks and scene blocks typically do not support blend modes directly.

## Setting and Getting Blend Modes

Apply a blend mode with `setBlendMode()` and retrieve the current mode with `getBlendMode()`. The default blend mode is `'Normal'`, which displays the block without any blending effect.

```typescript highlight-set-blend-mode
// Apply the Multiply blend mode to the overlay
engine.block.setBlendMode(overlayBlock, 'Multiply');
```

After setting a blend mode, you can confirm the change by retrieving the current value:

```typescript highlight-get-blend-mode
// Retrieve and log the current blend mode
const currentMode = engine.block.getBlendMode(overlayBlock);
console.log('Current blend mode:', currentMode);
```

## Available Blend Modes

CE.SDK provides 27 blend modes organized into categories, each producing different visual results:

### Normal Modes

- **`PassThrough`** - Allows children of a group to blend with layers below the group
- **`Normal`** - Default mode with no blending effect

### Darken Modes

These modes darken the result by comparing the base and blend colors:

- **`Darken`** - Selects the darker of the base and blend colors
- **`Multiply`** - Multiplies colors, producing darker results (great for shadows)
- **`ColorBurn`** - Darkens base color by increasing contrast
- **`LinearBurn`** - Darkens base color by decreasing brightness
- **`DarkenColor`** - Selects the darker color based on luminosity

### Lighten Modes

These modes lighten the result by comparing colors:

- **`Lighten`** - Selects the lighter of the base and blend colors
- **`Screen`** - Multiplies the inverse of colors, producing lighter results (great for highlights)
- **`ColorDodge`** - Lightens base color by decreasing contrast
- **`LinearDodge`** - Lightens base color by increasing brightness
- **`LightenColor`** - Selects the lighter color based on luminosity

### Contrast Modes

These modes increase midtone contrast:

- **`Overlay`** - Combines Multiply and Screen based on the base color
- **`SoftLight`** - Similar to Overlay but with a softer effect
- **`HardLight`** - Similar to Overlay but based on the blend color
- **`VividLight`** - Burns or dodges colors based on the blend color
- **`LinearLight`** - Increases or decreases brightness based on blend color
- **`PinLight`** - Replaces colors based on the blend color
- **`HardMix`** - Reduces colors to white, black, or primary colors

### Inversion Modes

These modes create inverted or subtracted effects:

- **`Difference`** - Subtracts the darker from the lighter color
- **`Exclusion`** - Similar to Difference with lower contrast
- **`Subtract`** - Subtracts blend color from base color
- **`Divide`** - Divides base color by blend color

### Component Modes

These modes affect specific color components:

- **`Hue`** - Uses the hue of the blend color with base saturation and luminosity
- **`Saturation`** - Uses the saturation of the blend color
- **`Color`** - Uses the hue and saturation of the blend color
- **`Luminosity`** - Uses the luminosity of the blend color

## Combining Blend Modes with Opacity

For finer control over compositing, combine blend modes with opacity. Opacity reduces overall visibility while the blend mode affects color interaction with underlying layers.

```typescript highlight-set-opacity
// Check if the block supports opacity
if (engine.block.supportsOpacity(overlayBlock)) {
  // Set the opacity to 70%
  engine.block.setOpacity(overlayBlock, 0.7);
}
```

You can retrieve the current opacity value to confirm changes or read existing state:

```typescript highlight-get-opacity
// Retrieve and log the opacity value
const opacity = engine.block.getOpacity(overlayBlock);
console.log('Current opacity:', opacity);
```

## Exporting the Result

After applying blend modes and opacity, export the composed result to a file. The blended composition is rendered and saved as an image.

```typescript highlight-export
// Export the blended composition to a PNG file
const blob = await engine.block.export(page, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
fs.writeFileSync('output.png', buffer);
console.log('Exported blended composition to output.png');
```

## Troubleshooting

### Blend Mode Has No Visible Effect

If a blend mode doesn't produce visible changes:

- Ensure there are underlying layers for the block to blend with. Blend modes only affect compositing with content below.
- Verify the blend mode is applied to the correct block using `getBlendMode()`.
- Check that the block has visible content (fill or image) to blend.

### Cannot Set Blend Mode

If `setBlendMode()` throws an error:

- Check that `supportsBlendMode()` returns `true` for the block.
- Verify the block ID is valid and the block exists in the scene.
- Ensure you're passing a valid blend mode string from the available options.

### Unexpected Blending Results

If the visual result doesn't match expectations:

- Verify the blend mode category matches your intent (darken vs lighten vs contrast).
- Check the stacking order of blocks—blend modes affect content below the block.
- Experiment with different blend modes from the same category to find the best visual match.

## API Reference

| Method                                   | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| `engine.block.supportsBlendMode(id)`     | Check if a block supports blend modes             |
| `engine.block.setBlendMode(id, mode)`    | Set the blend mode for a block                    |
| `engine.block.getBlendMode(id)`          | Get the current blend mode of a block             |
| `engine.block.supportsOpacity(id)`       | Check if a block supports opacity                 |
| `engine.block.setOpacity(id, opacity)`   | Set the opacity for a block (0-1)                 |
| `engine.block.getOpacity(id)`            | Get the current opacity of a block                |
| `engine.block.export(id, mimeType)`      | Export block content to specified format          |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support