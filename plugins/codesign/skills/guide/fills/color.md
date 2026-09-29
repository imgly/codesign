> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Solid Color](./fills/color.md)

---

Apply uniform solid colors to shapes, text, and design blocks using CE.SDK's
comprehensive color fill system with support for multiple color spaces.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-fills-color-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-fills-color-server-js)

Color fills are one of the fundamental fill types in CE.SDK, allowing you to paint design blocks with solid, uniform colors. Unlike gradient fills that transition between colors or image fills that display photo content, color fills apply a single color across the entire block. The color fill system supports multiple color spaces including RGB for screen display, CMYK for print workflows, and Spot Colors for brand consistency.

```typescript file=@cesdk_web_examples/guides-fills-color-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Check if block supports fills
    const canHaveFill = engine.block.supportsFill(page);
    if (!canHaveFill) {
      throw new Error('Block does not support fills');
    }

    // Create a color fill
    const colorFill = engine.block.createFill('color');

    // Create a graphic block with a shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 50);
    engine.block.setPositionY(block, 50);
    engine.block.appendChild(page, block);

    // Apply the fill to the block
    engine.block.setFill(block, colorFill);

    // Set the fill color using RGB values
    engine.block.setColor(colorFill, 'fill/color/value', {
      r: 1.0, // Red (0.0 to 1.0)
      g: 0.0, // Green
      b: 0.0, // Blue
      a: 1.0 // Alpha (opacity)
    });

    // Get the current fill from a block
    const currentFill = engine.block.getFill(block);
    const fillType = engine.block.getType(currentFill);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'

    // Get the current color value
    const currentColor = engine.block.getColor(colorFill, 'fill/color/value');
    console.log('Current color:', currentColor);

    // Create a block with CMYK color for print workflows
    const cmykBlock = engine.block.create('graphic');
    engine.block.setShape(cmykBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(cmykBlock, 150);
    engine.block.setHeight(cmykBlock, 150);
    engine.block.setPositionX(cmykBlock, 300);
    engine.block.setPositionY(cmykBlock, 50);
    engine.block.appendChild(page, cmykBlock);

    const cmykFill = engine.block.createFill('color');
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0, // Cyan (0.0 to 1.0)
      m: 1.0, // Magenta
      y: 0.0, // Yellow
      k: 0.0, // Key/Black
      tint: 1.0 // Tint value (0.0 to 1.0)
    });

    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);

    // Then apply to fill
    const spotBlock = engine.block.create('graphic');
    engine.block.setShape(spotBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(spotBlock, 150);
    engine.block.setHeight(spotBlock, 150);
    engine.block.setPositionX(spotBlock, 500);
    engine.block.setPositionY(spotBlock, 50);
    engine.block.appendChild(page, spotBlock);

    const spotFill = engine.block.createFill('color');
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });

    // Toggle fill visibility
    const toggleBlock = engine.block.create('graphic');
    engine.block.setShape(toggleBlock, engine.block.createShape('rect'));
    engine.block.setWidth(toggleBlock, 150);
    engine.block.setHeight(toggleBlock, 100);
    engine.block.setPositionX(toggleBlock, 50);
    engine.block.setPositionY(toggleBlock, 250);
    engine.block.appendChild(page, toggleBlock);

    const toggleFill = engine.block.createFill('color');
    engine.block.setFill(toggleBlock, toggleFill);
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    console.log('Fill enabled:', isEnabled); // true

    // Disable the fill (block becomes transparent)
    engine.block.setFillEnabled(toggleBlock, false);

    // Re-enable
    engine.block.setFillEnabled(toggleBlock, true);

    // Share a single fill instance between multiple blocks
    const block1 = engine.block.create('graphic');
    engine.block.setShape(block1, engine.block.createShape('rect'));
    engine.block.setWidth(block1, 100);
    engine.block.setHeight(block1, 100);
    engine.block.setPositionX(block1, 250);
    engine.block.setPositionY(block1, 250);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    engine.block.setShape(block2, engine.block.createShape('rect'));
    engine.block.setWidth(block2, 100);
    engine.block.setHeight(block2, 100);
    engine.block.setPositionX(block2, 370);
    engine.block.setPositionY(block2, 250);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);

    // Now changing the fill affects both blocks
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.0,
      g: 0.5,
      b: 0.5,
      a: 1.0
    });

    // Convert colors between different color spaces
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    console.log('Converted CMYK color:', cmykColor);

    // Define and apply brand colors as spot colors
    engine.editor.setSpotColorRGB('PrimaryBrand', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorRGB('SecondaryBrand', 0.9, 0.5, 0.1);

    const brandBlock = engine.block.create('graphic');
    engine.block.setShape(brandBlock, engine.block.createShape('rect'));
    engine.block.setWidth(brandBlock, 150);
    engine.block.setHeight(brandBlock, 100);
    engine.block.setPositionX(brandBlock, 500);
    engine.block.setPositionY(brandBlock, 250);
    engine.block.appendChild(page, brandBlock);

    const brandFill = engine.block.createFill('color');
    engine.block.setFill(brandBlock, brandFill);

    // Apply brand color
    const brandColor = {
      name: 'PrimaryBrand',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(brandFill, 'fill/color/value', brandColor);

    // Create semi-transparent overlay
    const transparentBlock = engine.block.create('graphic');
    engine.block.setShape(transparentBlock, engine.block.createShape('rect'));
    engine.block.setWidth(transparentBlock, 150);
    engine.block.setHeight(transparentBlock, 100);
    engine.block.setPositionX(transparentBlock, 50);
    engine.block.setPositionY(transparentBlock, 400);
    engine.block.appendChild(page, transparentBlock);

    const transparentFill = engine.block.createFill('color');
    engine.block.setFill(transparentBlock, transparentFill);
    engine.block.setColor(transparentFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.2,
      a: 0.5 // 50% opacity
    });

    // Use CMYK color space for print production
    const printBlock = engine.block.create('graphic');
    engine.block.setShape(printBlock, engine.block.createShape('rect'));
    engine.block.setWidth(printBlock, 150);
    engine.block.setHeight(printBlock, 100);
    engine.block.setPositionX(printBlock, 250);
    engine.block.setPositionY(printBlock, 400);
    engine.block.appendChild(page, printBlock);

    const printFill = engine.block.createFill('color');
    engine.block.setFill(printBlock, printFill);

    const printColor = {
      c: 0.0,
      m: 0.85,
      y: 1.0,
      k: 0.0,
      tint: 1.0
    };
    engine.block.setColor(printFill, 'fill/color/value', printColor);

    // Export the result
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output');
    }

    writeFileSync('./output/solid-color-fills.png', buffer);
    console.log('Exported to ./output/solid-color-fills.png');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide demonstrates how to create, apply, and modify color fills programmatically, work with different color spaces, and manage fill properties for various design elements.

## Understanding Color Fills

### What is a Color Fill?

A color fill is a fill object identified by the type `'//ly.img.ubq/fill/color'` (or its shorthand `'color'`) that paints a design block with a single, uniform color. Color fills are part of the broader fill system in CE.SDK and contain a `fill/color/value` property that defines the actual color using various color space formats.

Color fills differ from other fill types available in CE.SDK:

- **Color fills**: Solid, uniform color across the entire block
- **Gradient fills**: Color transitions (linear, radial, conical)
- **Image fills**: Photo or raster content
- **Video fills**: Animated video content

### Supported Color Spaces

CE.SDK's color fill system supports multiple color spaces to accommodate different design and production workflows:

- **RGB/sRGB**: Red, Green, Blue with alpha channel (standard for screen display)
- **CMYK**: Cyan, Magenta, Yellow, Key (black) with tint (for print production)
- **Spot Colors**: Named colors with RGB/CMYK approximations (for brand consistency)

Each color space serves specific use cases—use RGB for digital designs, CMYK for print-ready content, and Spot Colors to maintain brand standards across projects.

## Checking Color Fill Support

### Verifying Block Compatibility

Before applying color fills to a block, verify that the block type supports fills. Not all block types can have fills—for example, scene blocks typically don't support fills.

```typescript highlight=highlight-check-fill-support
// Check if block supports fills
const canHaveFill = engine.block.supportsFill(page);
if (!canHaveFill) {
  throw new Error('Block does not support fills');
}
```

Graphic blocks, shapes, and text blocks typically support fills. Always check `supportsFill()` before accessing fill APIs to avoid runtime errors and ensure smooth operation.

## Creating Color Fills

### Creating a New Color Fill

Create a new color fill instance using the `createFill()` method with the type `'color'` or the full type name `'//ly.img.ubq/fill/color'`.

```typescript highlight=highlight-create-fill
// Create a color fill
const colorFill = engine.block.createFill('color');
```

The `createFill()` method returns a numeric fill ID. The fill exists independently until you attach it to a block using `setFill()`. If you create a fill but don't attach it to a block, you must destroy it manually to prevent memory leaks.

## Applying Color Fills

### Setting a Fill on a Block

Once you've created a color fill, attach it to a block using `setFill()`:

```typescript highlight=highlight-apply-fill
    // Create a graphic block with a shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 50);
    engine.block.setPositionY(block, 50);
    engine.block.appendChild(page, block);

    // Apply the fill to the block
    engine.block.setFill(block, colorFill);
```

This example creates a graphic block with a rectangle shape and applies the color fill to it. The block will now render with the fill's color.

### Getting the Current Fill

Retrieve the current fill attached to a block using `getFill()` and inspect its type:

```typescript highlight=highlight-get-fill
// Get the current fill from a block
const currentFill = engine.block.getFill(block);
const fillType = engine.block.getType(currentFill);
console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'
```

## Modifying Color Fill Properties

### Setting RGB Colors

Set the fill color using RGB values with the `setColor()` method. RGB values are normalized floats from 0.0 to 1.0, and the alpha channel controls opacity.

```typescript highlight=highlight-set-rgb
// Set the fill color using RGB values
engine.block.setColor(colorFill, 'fill/color/value', {
  r: 1.0, // Red (0.0 to 1.0)
  g: 0.0, // Green
  b: 0.0, // Blue
  a: 1.0 // Alpha (opacity)
});
```

The alpha channel (a) controls opacity: 1.0 is fully opaque, 0.0 is fully transparent. This allows you to create semi-transparent overlays and layered color effects.

### Setting CMYK Colors

For print workflows, use CMYK color space with the `setColor()` method. CMYK values are also normalized from 0.0 to 1.0, and include a tint value for partial color application.

```typescript highlight=highlight-set-cmyk
    // Create a block with CMYK color for print workflows
    const cmykBlock = engine.block.create('graphic');
    engine.block.setShape(cmykBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(cmykBlock, 150);
    engine.block.setHeight(cmykBlock, 150);
    engine.block.setPositionX(cmykBlock, 300);
    engine.block.setPositionY(cmykBlock, 50);
    engine.block.appendChild(page, cmykBlock);

    const cmykFill = engine.block.createFill('color');
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0, // Cyan (0.0 to 1.0)
      m: 1.0, // Magenta
      y: 0.0, // Yellow
      k: 0.0, // Key/Black
      tint: 1.0 // Tint value (0.0 to 1.0)
    });
```

The tint value allows partial application of the color, useful for creating lighter variations without changing the base CMYK values.

### Setting Spot Colors

Spot colors are named colors that must be defined before use. They're ideal for maintaining brand consistency and can have both RGB and CMYK approximations for different output scenarios.

```typescript highlight=highlight-set-spot
    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);

    // Then apply to fill
    const spotBlock = engine.block.create('graphic');
    engine.block.setShape(spotBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(spotBlock, 150);
    engine.block.setHeight(spotBlock, 150);
    engine.block.setPositionX(spotBlock, 500);
    engine.block.setPositionY(spotBlock, 50);
    engine.block.appendChild(page, spotBlock);

    const spotFill = engine.block.createFill('color');
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });
```

First, define the spot color globally using `setSpotColorRGB()` or `setSpotColorCMYK()`, then apply it to your fill using the color name. The tint value controls intensity from 0.0 to 1.0.

### Getting Current Color Value

Retrieve the current color value from a fill using `getColor()`:

```typescript highlight=highlight-get-color
// Get the current color value
const currentColor = engine.block.getColor(colorFill, 'fill/color/value');
console.log('Current color:', currentColor);
```

## Enabling and Disabling Color Fills

### Toggle Fill Visibility

You can temporarily disable a fill without removing it from the block. This preserves all fill properties while making the block transparent:

```typescript highlight=highlight-toggle-fill
    // Toggle fill visibility
    const toggleBlock = engine.block.create('graphic');
    engine.block.setShape(toggleBlock, engine.block.createShape('rect'));
    engine.block.setWidth(toggleBlock, 150);
    engine.block.setHeight(toggleBlock, 100);
    engine.block.setPositionX(toggleBlock, 50);
    engine.block.setPositionY(toggleBlock, 250);
    engine.block.appendChild(page, toggleBlock);

    const toggleFill = engine.block.createFill('color');
    engine.block.setFill(toggleBlock, toggleFill);
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    console.log('Fill enabled:', isEnabled); // true

    // Disable the fill (block becomes transparent)
    engine.block.setFillEnabled(toggleBlock, false);

    // Re-enable
    engine.block.setFillEnabled(toggleBlock, true);
```

Disabling fills is useful for creating stroke-only designs or for temporarily hiding fills during interactive editing sessions. The fill properties remain intact and can be re-enabled at any time.

## Additional Techniques

### Sharing Color Fills

You can share a single fill instance between multiple blocks. Changes to the shared fill affect all blocks using it:

```typescript highlight=highlight-share-fill
    // Share a single fill instance between multiple blocks
    const block1 = engine.block.create('graphic');
    engine.block.setShape(block1, engine.block.createShape('rect'));
    engine.block.setWidth(block1, 100);
    engine.block.setHeight(block1, 100);
    engine.block.setPositionX(block1, 250);
    engine.block.setPositionY(block1, 250);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    engine.block.setShape(block2, engine.block.createShape('rect'));
    engine.block.setWidth(block2, 100);
    engine.block.setHeight(block2, 100);
    engine.block.setPositionX(block2, 370);
    engine.block.setPositionY(block2, 250);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);

    // Now changing the fill affects both blocks
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.0,
      g: 0.5,
      b: 0.5,
      a: 1.0
    });
```

With shared fills, modifying the fill's color updates all blocks simultaneously. The fill is only destroyed when the last block referencing it is destroyed.

### Color Space Conversion

Convert colors between different color spaces using `convertColorToColorSpace()`:

```typescript highlight=highlight-convert-color
    // Convert colors between different color spaces
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    console.log('Converted CMYK color:', cmykColor);
```

This is useful when you need to ensure color consistency across different output mediums (screen vs. print).

## Common Use Cases

### Brand Color Application

Define and apply brand colors as spot colors to maintain consistency across all design elements:

```typescript highlight=highlight-brand-colors
    // Define and apply brand colors as spot colors
    engine.editor.setSpotColorRGB('PrimaryBrand', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorRGB('SecondaryBrand', 0.9, 0.5, 0.1);

    const brandBlock = engine.block.create('graphic');
    engine.block.setShape(brandBlock, engine.block.createShape('rect'));
    engine.block.setWidth(brandBlock, 150);
    engine.block.setHeight(brandBlock, 100);
    engine.block.setPositionX(brandBlock, 500);
    engine.block.setPositionY(brandBlock, 250);
    engine.block.appendChild(page, brandBlock);

    const brandFill = engine.block.createFill('color');
    engine.block.setFill(brandBlock, brandFill);

    // Apply brand color
    const brandColor = {
      name: 'PrimaryBrand',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(brandFill, 'fill/color/value', brandColor);
```

Using spot colors ensures brand consistency and makes it easy to update all instances of a brand color by modifying the spot color definition.

### Transparency Effects

Create semi-transparent overlays and visual effects by adjusting the alpha channel:

```typescript highlight=highlight-transparency
    // Create semi-transparent overlay
    const transparentBlock = engine.block.create('graphic');
    engine.block.setShape(transparentBlock, engine.block.createShape('rect'));
    engine.block.setWidth(transparentBlock, 150);
    engine.block.setHeight(transparentBlock, 100);
    engine.block.setPositionX(transparentBlock, 50);
    engine.block.setPositionY(transparentBlock, 400);
    engine.block.appendChild(page, transparentBlock);

    const transparentFill = engine.block.createFill('color');
    engine.block.setFill(transparentBlock, transparentFill);
    engine.block.setColor(transparentFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.2,
      a: 0.5 // 50% opacity
    });
```

### Print-Ready Colors

Use CMYK color space for designs destined for print production:

```typescript highlight=highlight-print-colors
    // Use CMYK color space for print production
    const printBlock = engine.block.create('graphic');
    engine.block.setShape(printBlock, engine.block.createShape('rect'));
    engine.block.setWidth(printBlock, 150);
    engine.block.setHeight(printBlock, 100);
    engine.block.setPositionX(printBlock, 250);
    engine.block.setPositionY(printBlock, 400);
    engine.block.appendChild(page, printBlock);

    const printFill = engine.block.createFill('color');
    engine.block.setFill(printBlock, printFill);

    const printColor = {
      c: 0.0,
      m: 0.85,
      y: 1.0,
      k: 0.0,
      tint: 1.0
    };
    engine.block.setColor(printFill, 'fill/color/value', printColor);
```

## Troubleshooting

### Fill Not Visible

If your fill doesn't appear:

- Check if fill is enabled: `engine.block.isFillEnabled(block)`
- Verify alpha channel is not 0: Check the `a` property in RGBA colors
- Ensure block has valid dimensions (width and height > 0)
- Confirm block is in the scene hierarchy

### Color Looks Different Than Expected

If colors don't match expectations:

- Verify you're using the correct color space (RGB vs CMYK)
- Check if spot color is properly defined before use
- Review tint values (should be 0.0-1.0)
- Consider color space conversion for your output medium

### Memory Leaks

To prevent memory leaks:

- Always destroy replaced fills: `engine.block.destroy(oldFill)`
- Don't create fills without attaching them to blocks
- Clean up shared fills when they're no longer needed

### Cannot Apply Color to Block

If you can't apply a color fill:

- Verify block supports fills: `engine.block.supportsFill(block)`
- Check if block has a shape: Some blocks require shapes before fills work
- Ensure fill object is valid and not already destroyed

## API Reference

| Method                                   | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `createFill('color')`                    | Create a new color fill object            |
| `setFill(block, fill)`                   | Assign fill to a block                    |
| `getFill(block)`                         | Get the fill ID from a block              |
| `setColor(fill, property, color)`        | Set color value (RGB, CMYK, or Spot)      |
| `getColor(fill, property)`               | Get current color value                   |
| `setFillEnabled(block, enabled)`         | Enable or disable fill rendering          |
| `isFillEnabled(block)`                   | Check if fill is enabled                  |
| `supportsFill(block)`                    | Check if block supports fills             |
| `findAllProperties(fill)`                | List all properties of the fill           |
| `convertColorToColorSpace(color, space)` | Convert between color spaces              |
| `setSpotColorRGB(name, r, g, b)`         | Define spot color with RGB approximation  |
| `setSpotColorCMYK(name, c, m, y, k)`     | Define spot color with CMYK approximation |

## Next Steps

Now that you understand color fills, explore other fill types and color management features:

- Learn about Gradient Fills for color transitions
- Explore Image Fills for photo content
- Understand Fill Overview for the comprehensive fill system
- Review Apply Colors for color management across properties
- Study Blocks Concept for understanding the block system



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support