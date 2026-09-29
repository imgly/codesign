> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Color Basics](./colors/basics.md)

---

Understand the three color spaces in CE.SDK and when to use each for screen or print workflows.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-colors-basics-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-colors-basics-server-js)

CE.SDK supports three color spaces: **sRGB** for screen display, **CMYK** for print workflows, and **Spot Color** for specialized printing. Each color space serves different output types and has its own object format for the `setColor()` API.

```typescript file=@cesdk_web_examples/guides-colors-basics-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

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
    engine.editor.setSpotColorRGB('MyBrand Red', 0.95, 0.25, 0.21);

    // Create three blocks to demonstrate each color space

    // Block 1: sRGB color (for screen display)
    const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      srgbBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using RGBAColor object (values 0.0-1.0)
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
    // Set fill color using CMYKColor object (values 0.0-1.0, tint controls opacity)
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
    // Set fill color using SpotColor object (references the defined spot color)
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'MyBrand Red',
      tint: 1.0,
      externalReference: ''
    });
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setWidth(spotBlock, blockWidth);
    engine.block.setHeight(spotBlock, blockHeight);
    engine.block.appendChild(page, spotBlock);

    // Add strokes to demonstrate stroke color property
    engine.block.setStrokeEnabled(srgbBlock, true);
    engine.block.setStrokeWidth(srgbBlock, 4);
    engine.block.setColor(srgbBlock, 'stroke/color', {
      r: 0.1,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setStrokeEnabled(cmykBlock, true);
    engine.block.setStrokeWidth(cmykBlock, 4);
    engine.block.setColor(cmykBlock, 'stroke/color', {
      c: 0.0,
      m: 0.5,
      y: 0.6,
      k: 0.2,
      tint: 1.0
    });

    engine.block.setStrokeEnabled(spotBlock, true);
    engine.block.setStrokeWidth(spotBlock, 4);
    engine.block.setColor(spotBlock, 'stroke/color', {
      name: 'MyBrand Red',
      tint: 0.7,
      externalReference: ''
    });

    // Position all color blocks
    engine.block.setPositionX(srgbBlock, margin);
    engine.block.setPositionY(srgbBlock, margin);

    engine.block.setPositionX(cmykBlock, margin + blockWidth + spacing);
    engine.block.setPositionY(cmykBlock, margin);

    engine.block.setPositionX(spotBlock, margin + 2 * (blockWidth + spacing));
    engine.block.setPositionY(spotBlock, margin);

    // Retrieve and log color values to demonstrate getColor()
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    console.log('sRGB Color:', srgbColor);
    console.log('CMYK Color:', cmykColor);
    console.log('Spot Color:', spotColor);

    // Export the scene to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/color-basics.png`, buffer);
    console.log('Exported to output/color-basics.png');

    console.log('Color Basics example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to choose the correct color space, define and apply colors using the unified `setColor()` API, and configure spot colors with screen preview approximations.

## Initialize the Engine

Set up the headless Creative Engine for server-side color operations.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});
```

## Color Spaces Overview

CE.SDK represents colors as objects with different properties depending on the color space. Use `engine.block.setColor()` to apply any color type to supported properties.

**Supported color properties:**

- `'fill/color/value'` - Fill color of a block
- `'stroke/color'` - Stroke/outline color
- `'dropShadow/color'` - Drop shadow color
- `'backgroundColor/color'` - Background color
- `'camera/clearColor'` - Canvas clear color

## sRGB Colors

sRGB is the default color space for screen display. Pass an `RGBAColor` object with `r`, `g`, `b`, `a` components, each in the range 0.0 to 1.0. The `a` (alpha) component controls transparency.

```typescript highlight=highlight-srgb-color
// Block 1: sRGB color (for screen display)
const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  srgbBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
// Set fill color using RGBAColor object (values 0.0-1.0)
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

sRGB colors are ideal for web and digital content where the output is displayed on screens.

## CMYK Colors

CMYK is the color space for print workflows. Pass a `CMYKColor` object with `c`, `m`, `y`, `k` components (0.0 to 1.0) plus a `tint` value that controls opacity.

```typescript highlight=highlight-cmyk-color
// Block 2: CMYK color (for print workflows)
const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  cmykBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
// Set fill color using CMYKColor object (values 0.0-1.0, tint controls opacity)
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

When rendered on screen, CMYK colors are converted to RGB using standard conversion formulas. The `tint` value (0.0 to 1.0) is rendered as transparency.

> **Note:** During PDF export, CMYK colors are currently converted to RGB using the standard conversion. Tint values are retained in the alpha channel.

## Spot Colors

Spot colors are named colors used for specialized printing. Before using a spot color, you must define it with an RGB or CMYK approximation for screen preview.

### Defining Spot Colors

Use `engine.editor.setSpotColorRGB()` or `engine.editor.setSpotColorCMYK()` to register a spot color with its screen preview approximation.

```typescript highlight=highlight-define-spot-color
// Define a spot color with RGB approximation for screen preview
engine.editor.setSpotColorRGB('MyBrand Red', 0.95, 0.25, 0.21);
```

### Applying Spot Colors

Reference a defined spot color using a `SpotColor` object with the `name`, `tint`, and `externalReference` properties.

```typescript highlight=highlight-spot-color
// Block 3: Spot color (for specialized printing)
const spotBlock = engine.block.create('//ly.img.ubq/graphic');
engine.block.setShape(
  spotBlock,
  engine.block.createShape('//ly.img.ubq/shape/rect')
);
const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
// Set fill color using SpotColor object (references the defined spot color)
engine.block.setColor(spotFill, 'fill/color/value', {
  name: 'MyBrand Red',
  tint: 1.0,
  externalReference: ''
});
engine.block.setFill(spotBlock, spotFill);
engine.block.setWidth(spotBlock, blockWidth);
engine.block.setHeight(spotBlock, blockHeight);
engine.block.appendChild(page, spotBlock);
```

When rendered on screen, the spot color uses its RGB or CMYK approximation. During PDF export, spot colors are saved as a [Separation Color Space](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.6.pdf#G9.1850648) that preserves print information.

> **Note:** If a block references an undefined spot color, CE.SDK displays magenta (RGB: 1, 0, 1) as a fallback.

## Applying Stroke Colors

Strokes support all three color spaces. Enable the stroke, set its width, then apply a color using the `'stroke/color'` property.

```typescript highlight=highlight-stroke-color
    // Add strokes to demonstrate stroke color property
    engine.block.setStrokeEnabled(srgbBlock, true);
    engine.block.setStrokeWidth(srgbBlock, 4);
    engine.block.setColor(srgbBlock, 'stroke/color', {
      r: 0.1,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setStrokeEnabled(cmykBlock, true);
    engine.block.setStrokeWidth(cmykBlock, 4);
    engine.block.setColor(cmykBlock, 'stroke/color', {
      c: 0.0,
      m: 0.5,
      y: 0.6,
      k: 0.2,
      tint: 1.0
    });

    engine.block.setStrokeEnabled(spotBlock, true);
    engine.block.setStrokeWidth(spotBlock, 4);
    engine.block.setColor(spotBlock, 'stroke/color', {
      name: 'MyBrand Red',
      tint: 0.7,
      externalReference: ''
    });
```

## Reading Color Values

Use `engine.block.getColor()` to retrieve the current color value from a property. The returned object's shape indicates the color space (RGBAColor, CMYKColor, or SpotColor).

```typescript highlight=highlight-get-color
    // Retrieve and log color values to demonstrate getColor()
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    console.log('sRGB Color:', srgbColor);
    console.log('CMYK Color:', cmykColor);
    console.log('Spot Color:', spotColor);
```

## Exporting with Colors

After applying colors, export the scene to a file. The export respects the color space settings.

```typescript highlight=highlight-export
    // Export the scene to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/color-basics.png`, buffer);
    console.log('Exported to output/color-basics.png');
```

## Cleanup

Always dispose of the engine when done to release resources.

```typescript highlight=highlight-cleanup
engine.dispose();
```

## Choosing the Right Color Space

| Color Space | Use Case | Output |
|-------------|----------|--------|
| **sRGB** | Web, digital, screen display | PNG, JPEG, WebP |
| **CMYK** | Print workflows (converts to RGB) | PDF (converted) |
| **Spot Color** | Specialized printing, brand colors | PDF (Separation Color Space) |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setColor(id, property, value)` | Set a color property on a block. Pass an `RGBAColor`, `CMYKColor`, or `SpotColor` object. |
| `engine.block.getColor(id, property)` | Get the current color value from a property. Returns an `RGBAColor`, `CMYKColor`, or `SpotColor` object. |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define a spot color with an RGB approximation for screen preview. Components range from 0.0 to 1.0. |
| `engine.editor.setSpotColorCMYK(name, c, m, y, k)` | Define a spot color with a CMYK approximation for screen preview. Components range from 0.0 to 1.0. |

| Type | Properties | Description |
|------|------------|-------------|
| `RGBAColor` | `r`, `g`, `b`, `a` (0.0-1.0) | sRGB color for screen display. Alpha controls transparency. |
| `CMYKColor` | `c`, `m`, `y`, `k`, `tint` (0.0-1.0) | CMYK color for print. Tint controls opacity. |
| `SpotColor` | `name`, `tint`, `externalReference` | Named color for specialized printing. |

## Next Steps

- [Apply Colors](./colors/apply.md) - Apply colors to design elements programmatically
- [CMYK Colors](./colors/for-print/cmyk.md) - Work with CMYK for print workflows
- [Spot Colors](./colors/for-print/spot.md) - Define and manage spot colors for specialized printing



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support