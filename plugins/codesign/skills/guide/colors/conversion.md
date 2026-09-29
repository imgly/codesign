> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Color Conversion](./colors/conversion.md)

---

Convert colors between sRGB, CMYK, and spot color spaces programmatically in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-colors-conversion-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-colors-conversion-server-js)

CE.SDK supports three color spaces: sRGB, CMYK, and SpotColor. When building color interfaces or preparing designs for export, you may need to convert colors between these spaces. The engine handles the mathematical conversion automatically through the `convertColorToColorSpace()` API.

```typescript file=@cesdk_web_examples/guides-colors-conversion-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

// Type guard helpers for identifying color types
function isRGBAColor(
  color: any
): color is { r: number; g: number; b: number; a: number } {
  return 'r' in color && 'g' in color && 'b' in color && 'a' in color;
}

function isCMYKColor(
  color: any
): color is { c: number; m: number; y: number; k: number; tint: number } {
  return 'c' in color && 'm' in color && 'y' in color && 'k' in color;
}

function isSpotColor(
  color: any
): color is { name: string; tint: number; externalReference: string } {
  return 'name' in color && 'tint' in color && 'externalReference' in color;
}

async function main() {
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

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate block sizes for three columns
    const margin = 40;
    const spacing = 30;
    const availableWidth = pageWidth - 2 * margin - 2 * spacing;
    const blockWidth = availableWidth / 3;
    const blockHeight = pageHeight - 2 * margin;

    // Define a spot color with RGB approximation for screen preview
    engine.editor.setSpotColorRGB('Brand Red', 0.95, 0.25, 0.21);

    // Create three blocks with different color spaces

    // Block 1: sRGB color (for screen display)
    const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      srgbBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(srgbFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(srgbBlock, srgbFill);
    engine.block.setWidth(srgbBlock, blockWidth);
    engine.block.setHeight(srgbBlock, blockHeight);
    engine.block.appendChild(page, srgbBlock);

    // Block 2: CMYK color (for print workflows)
    const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      cmykBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0,
      m: 0.8,
      y: 0.95,
      k: 0.0,
      tint: 1.0
    });
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setWidth(cmykBlock, blockWidth);
    engine.block.setHeight(cmykBlock, blockHeight);
    engine.block.appendChild(page, cmykBlock);

    // Block 3: Spot color (for specialized printing)
    const spotBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      spotBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'Brand Red',
      tint: 1.0,
      externalReference: ''
    });
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setWidth(spotBlock, blockWidth);
    engine.block.setHeight(spotBlock, blockHeight);
    engine.block.appendChild(page, spotBlock);

    // Position all color blocks
    engine.block.setPositionX(srgbBlock, margin);
    engine.block.setPositionY(srgbBlock, margin);

    engine.block.setPositionX(cmykBlock, margin + blockWidth + spacing);
    engine.block.setPositionY(cmykBlock, margin);

    engine.block.setPositionX(spotBlock, margin + 2 * (blockWidth + spacing));
    engine.block.setPositionY(spotBlock, margin);

    // Convert colors to sRGB for screen display
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    // Convert CMYK to sRGB
    const cmykToRgba = engine.editor.convertColorToColorSpace(
      cmykColor,
      'sRGB'
    );
    console.log('CMYK converted to sRGB:', cmykToRgba);

    // Convert Spot color to sRGB (uses defined RGB approximation)
    const spotToRgba = engine.editor.convertColorToColorSpace(
      spotColor,
      'sRGB'
    );
    console.log('Spot color converted to sRGB:', spotToRgba);

    // Convert colors to CMYK for print workflows
    const srgbToCmyk = engine.editor.convertColorToColorSpace(
      srgbColor,
      'CMYK'
    );
    console.log('sRGB converted to CMYK:', srgbToCmyk);

    // Convert Spot color to CMYK for print output
    // First define CMYK approximation for the spot color
    engine.editor.setSpotColorCMYK('Brand Red', 0.0, 0.85, 0.9, 0.05);
    const spotToCmyk = engine.editor.convertColorToColorSpace(
      spotColor,
      'CMYK'
    );
    console.log('Spot color converted to CMYK:', spotToCmyk);

    // Use type guards to identify color space before conversion
    if (isRGBAColor(srgbColor)) {
      console.log(
        'sRGB color components:',
        `R: ${srgbColor.r}, G: ${srgbColor.g}, B: ${srgbColor.b}, A: ${srgbColor.a}`
      );
    }

    if (isCMYKColor(cmykColor)) {
      console.log(
        'CMYK color components:',
        `C: ${cmykColor.c}, M: ${cmykColor.m}, Y: ${cmykColor.y}, K: ${cmykColor.k}, Tint: ${cmykColor.tint}`
      );
    }

    if (isSpotColor(spotColor)) {
      console.log('Spot color name:', spotColor.name, 'Tint:', spotColor.tint);
    }

    // Export the scene to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/color-conversion.png`, buffer);
    console.log('Exported to output/color-conversion.png');

    console.log('Color Conversion example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to convert colors between sRGB and CMYK, handle spot color conversions, identify color types with type guards, and understand how tint and alpha values are preserved during conversion.

## Initialize the Engine

Set up the headless Creative Engine for server-side color operations.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});
```

## Supported Color Spaces

CE.SDK supports conversion between three color spaces:

| Color Space | Format | Use Case |
|-------------|--------|----------|
| **sRGB** | `RGBAColor` with `r`, `g`, `b`, `a` (0.0-1.0) | Screen display, web output |
| **CMYK** | `CMYKColor` with `c`, `m`, `y`, `k`, `tint` (0.0-1.0) | Print workflows |
| **SpotColor** | `SpotColor` with `name`, `tint`, `externalReference` | Specialized printing |

## Setting Up Colors

Before converting colors, you need colors in different spaces. This example creates blocks with sRGB, CMYK, and spot colors.

First, define a spot color with its RGB approximation for screen preview:

```typescript highlight=highlight-define-spot-color
// Define a spot color with RGB approximation for screen preview
engine.editor.setSpotColorRGB('Brand Red', 0.95, 0.25, 0.21);
```

Create an sRGB color block for screen display:

```typescript highlight=highlight-srgb-color
// Block 1: sRGB color (for screen display)
const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  srgbBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
engine.block.setColor(srgbFill, 'fill/color/value', {
  r: 0.2,
  g: 0.4,
  b: 0.9,
  a: 1.0
});
engine.block.setFill(srgbBlock, srgbFill);
engine.block.setWidth(srgbBlock, blockWidth);
engine.block.setHeight(srgbBlock, blockHeight);
engine.block.appendChild(page, srgbBlock);
```

Create a CMYK color block for print workflows:

```typescript highlight=highlight-cmyk-color
// Block 2: CMYK color (for print workflows)
const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  cmykBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
engine.block.setColor(cmykFill, 'fill/color/value', {
  c: 0.0,
  m: 0.8,
  y: 0.95,
  k: 0.0,
  tint: 1.0
});
engine.block.setFill(cmykBlock, cmykFill);
engine.block.setWidth(cmykBlock, blockWidth);
engine.block.setHeight(cmykBlock, blockHeight);
engine.block.appendChild(page, cmykBlock);
```

Create a spot color block for specialized printing:

```typescript highlight=highlight-spot-color
// Block 3: Spot color (for specialized printing)
const spotBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  spotBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
engine.block.setColor(spotFill, 'fill/color/value', {
  name: 'Brand Red',
  tint: 1.0,
  externalReference: ''
});
engine.block.setFill(spotBlock, spotFill);
engine.block.setWidth(spotBlock, blockWidth);
engine.block.setHeight(spotBlock, blockHeight);
engine.block.appendChild(page, spotBlock);
```

## Converting to sRGB

Use `engine.editor.convertColorToColorSpace(color, 'sRGB')` to convert any color to sRGB format. This is useful for displaying color values on screen or when you need RGB components for CSS or other web-based color operations.

```typescript highlight=highlight-convert-to-srgb
    // Convert colors to sRGB for screen display
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    // Convert CMYK to sRGB
    const cmykToRgba = engine.editor.convertColorToColorSpace(
      cmykColor,
      'sRGB'
    );
    console.log('CMYK converted to sRGB:', cmykToRgba);

    // Convert Spot color to sRGB (uses defined RGB approximation)
    const spotToRgba = engine.editor.convertColorToColorSpace(
      spotColor,
      'sRGB'
    );
    console.log('Spot color converted to sRGB:', spotToRgba);
```

When converting CMYK or spot colors to sRGB, the engine returns an `RGBAColor` object with `r`, `g`, `b`, `a` properties. The tint value from CMYK or spot colors becomes the alpha value in the returned sRGB color.

## Converting to CMYK

Use `engine.editor.convertColorToColorSpace(color, 'CMYK')` to convert any color to CMYK format. This is essential for print workflows where you need to ensure colors are in the correct space before export.

```typescript highlight=highlight-convert-to-cmyk
    // Convert colors to CMYK for print workflows
    const srgbToCmyk = engine.editor.convertColorToColorSpace(
      srgbColor,
      'CMYK'
    );
    console.log('sRGB converted to CMYK:', srgbToCmyk);

    // Convert Spot color to CMYK for print output
    // First define CMYK approximation for the spot color
    engine.editor.setSpotColorCMYK('Brand Red', 0.0, 0.85, 0.9, 0.05);
    const spotToCmyk = engine.editor.convertColorToColorSpace(
      spotColor,
      'CMYK'
    );
    console.log('Spot color converted to CMYK:', spotToCmyk);
```

When converting sRGB colors to CMYK, the alpha value becomes the tint value in the returned CMYK color. For spot colors, define a CMYK approximation with `setSpotColorCMYK()` before converting.

> **Note:** Color space conversions may not be perfectly reversible. Some sRGB colors cannot be exactly represented in CMYK due to different color gamuts.

## Identifying Color Types

Before converting a color, you may need to identify its current color space. CE.SDK provides type guard functions to check the color type.

```typescript highlight=highlight-type-guards
    // Use type guards to identify color space before conversion
    if (isRGBAColor(srgbColor)) {
      console.log(
        'sRGB color components:',
        `R: ${srgbColor.r}, G: ${srgbColor.g}, B: ${srgbColor.b}, A: ${srgbColor.a}`
      );
    }

    if (isCMYKColor(cmykColor)) {
      console.log(
        'CMYK color components:',
        `C: ${cmykColor.c}, M: ${cmykColor.m}, Y: ${cmykColor.y}, K: ${cmykColor.k}, Tint: ${cmykColor.tint}`
      );
    }

    if (isSpotColor(spotColor)) {
      console.log('Spot color name:', spotColor.name, 'Tint:', spotColor.tint);
    }
```

Import the type guards from `@cesdk/node` (or `@cesdk/node-native` — both expose the same API):

- `isRGBAColor()` - Returns true if the color is an sRGB color
- `isCMYKColor()` - Returns true if the color is a CMYK color
- `isSpotColor()` - Returns true if the color is a spot color

## Handling Tint and Alpha

The tint and alpha values represent transparency in different color spaces:

| Source | Target | Transformation |
|--------|--------|----------------|
| sRGB (alpha) | CMYK | Alpha becomes tint |
| CMYK (tint) | sRGB | Tint becomes alpha |
| SpotColor (tint) | sRGB | Tint becomes alpha |
| SpotColor (tint) | CMYK | Tint is preserved |

## Exporting with Colors

After applying and converting colors, export the scene to a file.

```typescript highlight=highlight-export
    // Export the scene to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/color-conversion.png`, buffer);
    console.log('Exported to output/color-conversion.png');
```

## Cleanup

Always dispose of the engine when done to release resources.

```typescript highlight=highlight-cleanup
engine.dispose();
```

## Practical Use Cases

### Batch Color Conversion

When processing multiple designs for print, convert all colors to CMYK:

```typescript
const blocks = engine.block.findAll();
for (const blockId of blocks) {
  if (engine.block.hasFill(blockId)) {
    const fillId = engine.block.getFill(blockId);
    const color = engine.block.getColor(fillId, 'fill/color/value');
    const cmykColor = engine.editor.convertColorToColorSpace(color, 'CMYK');
    console.log(`Block ${blockId} CMYK: C${cmykColor.c} M${cmykColor.m} Y${cmykColor.y} K${cmykColor.k}`);
  }
}
```

### Color Analysis

Analyze colors in a design to report their color space distribution:

```typescript
const color = engine.block.getColor(blockId, 'fill/color/value');
if (isRGBAColor(color)) {
  console.log('sRGB color detected');
} else if (isCMYKColor(color)) {
  console.log('CMYK color detected');
} else if (isSpotColor(color)) {
  console.log(`Spot color detected: ${color.name}`);
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Spot color converts to unexpected values | Spot color not defined | Call `setSpotColorRGB()` or `setSpotColorCMYK()` before conversion |
| Colors look different after conversion | Color gamut differences | Some sRGB colors cannot be exactly represented in CMYK |
| Type errors with converted colors | Wrong type assumption | Use type guards (`isRGBAColor`, `isCMYKColor`, `isSpotColor`) before accessing properties |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.editor.convertColorToColorSpace(color, colorSpace)` | Convert a color to the target color space. Returns an `RGBAColor` for 'sRGB' or `CMYKColor` for 'CMYK'. |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define a spot color with an RGB approximation. Components range from 0.0 to 1.0. |
| `engine.editor.setSpotColorCMYK(name, c, m, y, k)` | Define a spot color with a CMYK approximation. Components range from 0.0 to 1.0. |

| Type Guard | Description |
|------------|-------------|
| `isRGBAColor(color)` | Returns true if the color is an `RGBAColor` object |
| `isCMYKColor(color)` | Returns true if the color is a `CMYKColor` object |
| `isSpotColor(color)` | Returns true if the color is a `SpotColor` object |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support