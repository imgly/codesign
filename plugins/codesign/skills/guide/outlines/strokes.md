> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Outlines](./outlines.md) > [Using Strokes](./outlines/strokes.md)

---

Add outlines around shapes, text, and graphics to enhance visual definition and create decorative effects.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-outlines-stroke-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-outlines-stroke-server-js)

Strokes add visual outlines that define block boundaries. You can customize their color, width, line style (solid, dashed, dotted), position relative to the block edge, and corner treatment. CE.SDK provides programmatic APIs for complete stroke management in headless workflows.

```typescript file=@cesdk_web_examples/guides-outlines-stroke-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Using Strokes
 *
 * Demonstrates how to add and customize strokes (outlines) programmatically:
 * - Checking stroke support on blocks
 * - Enabling and disabling strokes
 * - Setting stroke color and width
 * - Applying stroke styles (solid, dashed, dotted)
 * - Controlling stroke position relative to block edges
 * - Adjusting stroke corner geometry
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

    // Create a graphic block with a rectangle shape
    const graphic = engine.block.create('graphic');
    engine.block.setShape(graphic, engine.block.createShape('rect'));
    engine.block.setWidth(graphic, 300);
    engine.block.setHeight(graphic, 200);
    engine.block.setPositionX(graphic, 250);
    engine.block.setPositionY(graphic, 200);
    engine.block.appendChild(page, graphic);

    // Set a fill color so the shape is visible
    const fill = engine.block.createFill('color');
    engine.block.setFill(graphic, fill);
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.9,
      g: 0.9,
      b: 0.9,
      a: 1.0
    });

    // Check if the block supports strokes before applying
    const canHaveStroke = engine.block.supportsStroke(graphic);
    console.log('Block supports strokes:', canHaveStroke);

    // Enable stroke on the block
    engine.block.setStrokeEnabled(graphic, true);

    // Verify stroke is enabled
    const strokeEnabled = engine.block.isStrokeEnabled(graphic);
    console.log('Stroke enabled:', strokeEnabled);

    // Set stroke color to blue (RGBA values from 0.0 to 1.0)
    engine.block.setStrokeColor(graphic, { r: 0.2, g: 0.4, b: 0.9, a: 1.0 });

    // Read the current stroke color
    const strokeColor = engine.block.getStrokeColor(graphic);
    console.log('Stroke color:', strokeColor);

    // Set stroke width in design units
    engine.block.setStrokeWidth(graphic, 8);

    // Read the current stroke width
    const strokeWidth = engine.block.getStrokeWidth(graphic);
    console.log('Stroke width:', strokeWidth);

    // Set stroke style to dashed
    // Available styles: 'Solid', 'Dashed', 'DashedRound', 'Dotted',
    // 'LongDashed', 'LongDashedRound'
    engine.block.setStrokeStyle(graphic, 'Dashed');

    // Read the current stroke style
    const strokeStyle = engine.block.getStrokeStyle(graphic);
    console.log('Stroke style:', strokeStyle);

    // Set stroke position relative to block edge
    // Available positions: 'Center', 'Inner', 'Outer'
    engine.block.setStrokePosition(graphic, 'Outer');

    // Read the current stroke position
    const strokePosition = engine.block.getStrokePosition(graphic);
    console.log('Stroke position:', strokePosition);

    // Set stroke corner geometry
    // Available geometries: 'Miter', 'Round', 'Bevel'
    engine.block.setStrokeCornerGeometry(graphic, 'Round');

    // Read the current corner geometry
    const cornerGeometry = engine.block.getStrokeCornerGeometry(graphic);
    console.log('Corner geometry:', cornerGeometry);

    // Create additional shapes to demonstrate different stroke configurations

    // Dotted stroke with inner position
    const graphic2 = engine.block.create('graphic');
    engine.block.setShape(graphic2, engine.block.createShape('rect'));
    engine.block.setWidth(graphic2, 150);
    engine.block.setHeight(graphic2, 100);
    engine.block.setPositionX(graphic2, 50);
    engine.block.setPositionY(graphic2, 50);
    engine.block.appendChild(page, graphic2);

    const fill2 = engine.block.createFill('color');
    engine.block.setFill(graphic2, fill2);
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 1.0,
      g: 0.95,
      b: 0.8,
      a: 1.0
    });

    engine.block.setStrokeEnabled(graphic2, true);
    engine.block.setStrokeColor(graphic2, { r: 0.9, g: 0.5, b: 0.1, a: 1.0 });
    engine.block.setStrokeWidth(graphic2, 4);
    engine.block.setStrokeStyle(graphic2, 'Dotted');
    engine.block.setStrokePosition(graphic2, 'Inner');
    engine.block.setStrokeCornerGeometry(graphic2, 'Miter');

    // Solid stroke with bevel corners
    const graphic3 = engine.block.create('graphic');
    engine.block.setShape(graphic3, engine.block.createShape('rect'));
    engine.block.setWidth(graphic3, 150);
    engine.block.setHeight(graphic3, 100);
    engine.block.setPositionX(graphic3, 600);
    engine.block.setPositionY(graphic3, 50);
    engine.block.appendChild(page, graphic3);

    const fill3 = engine.block.createFill('color');
    engine.block.setFill(graphic3, fill3);
    engine.block.setColor(fill3, 'fill/color/value', {
      r: 0.85,
      g: 0.95,
      b: 0.85,
      a: 1.0
    });

    engine.block.setStrokeEnabled(graphic3, true);
    engine.block.setStrokeColor(graphic3, { r: 0.2, g: 0.6, b: 0.3, a: 1.0 });
    engine.block.setStrokeWidth(graphic3, 6);
    engine.block.setStrokeStyle(graphic3, 'Solid');
    engine.block.setStrokePosition(graphic3, 'Center');
    engine.block.setStrokeCornerGeometry(graphic3, 'Bevel');

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/stroked-shapes.png`, buffer);

    console.log('Exported result to output/stroked-shapes.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to apply and manage strokes programmatically using the block API.

## Checking Stroke Support

Before applying strokes programmatically, verify the block supports them using `supportsStroke()`. Not all block types have stroke capabilities.

```typescript highlight=highlight-check-support
// Check if the block supports strokes before applying
const canHaveStroke = engine.block.supportsStroke(graphic);
console.log('Block supports strokes:', canHaveStroke);
```

## Enabling Strokes

Enable strokes on a block using `setStrokeEnabled()`. You can check the current state with `isStrokeEnabled()`.

```typescript highlight=highlight-enable-stroke
    // Enable stroke on the block
    engine.block.setStrokeEnabled(graphic, true);

    // Verify stroke is enabled
    const strokeEnabled = engine.block.isStrokeEnabled(graphic);
    console.log('Stroke enabled:', strokeEnabled);
```

## Setting Stroke Color

Control stroke color using `setStrokeColor()` with an RGBA color object. Color values range from 0.0 to 1.0. Retrieve the current color with `getStrokeColor()`.

```typescript highlight=highlight-stroke-color
    // Set stroke color to blue (RGBA values from 0.0 to 1.0)
    engine.block.setStrokeColor(graphic, { r: 0.2, g: 0.4, b: 0.9, a: 1.0 });

    // Read the current stroke color
    const strokeColor = engine.block.getStrokeColor(graphic);
    console.log('Stroke color:', strokeColor);
```

## Setting Stroke Width

Set stroke thickness in design units using `setStrokeWidth()`. Larger values create more prominent outlines. Get the current width with `getStrokeWidth()`.

```typescript highlight=highlight-stroke-width
    // Set stroke width in design units
    engine.block.setStrokeWidth(graphic, 8);

    // Read the current stroke width
    const strokeWidth = engine.block.getStrokeWidth(graphic);
    console.log('Stroke width:', strokeWidth);
```

## Stroke Styles

Control the line pattern using `setStrokeStyle()`. Available styles include:

- **Solid** - Continuous line
- **Dashed** - Square-ended dashes with gaps
- **DashedRound** - Round-ended dashes with gaps
- **Dotted** - Circular dots
- **LongDashed** - Longer square-ended dashes
- **LongDashedRound** - Longer round-ended dashes

```typescript highlight=highlight-stroke-style
    // Set stroke style to dashed
    // Available styles: 'Solid', 'Dashed', 'DashedRound', 'Dotted',
    // 'LongDashed', 'LongDashedRound'
    engine.block.setStrokeStyle(graphic, 'Dashed');

    // Read the current stroke style
    const strokeStyle = engine.block.getStrokeStyle(graphic);
    console.log('Stroke style:', strokeStyle);
```

## Stroke Position

Control where the stroke renders relative to the block edge using `setStrokePosition()`:

- **Center** - Stroke centered on the edge (default)
- **Inner** - Stroke rendered inside the block boundary
- **Outer** - Stroke rendered outside the block boundary

Position affects how strokes interact with adjacent elements and overall layout dimensions. Inner strokes stay within the block bounds, while outer strokes extend beyond them.

```typescript highlight=highlight-stroke-position
    // Set stroke position relative to block edge
    // Available positions: 'Center', 'Inner', 'Outer'
    engine.block.setStrokePosition(graphic, 'Outer');

    // Read the current stroke position
    const strokePosition = engine.block.getStrokePosition(graphic);
    console.log('Stroke position:', strokePosition);
```

## Stroke Corner Geometry

Control how stroke corners are rendered using `setStrokeCornerGeometry()`. This is particularly visible on rectangular shapes:

- **Miter** - Sharp pointed corners (default)
- **Round** - Smoothly curved corners
- **Bevel** - Flat cut corners

```typescript highlight=highlight-stroke-corner
    // Set stroke corner geometry
    // Available geometries: 'Miter', 'Round', 'Bevel'
    engine.block.setStrokeCornerGeometry(graphic, 'Round');

    // Read the current corner geometry
    const cornerGeometry = engine.block.getStrokeCornerGeometry(graphic);
    console.log('Corner geometry:', cornerGeometry);
```

## Troubleshooting

If strokes don't appear as expected, check these common issues:

- **Stroke not visible** - Verify stroke is enabled with `isStrokeEnabled()` and width is greater than 0
- **Stroke color appears wrong** - Ensure color values are in the 0.0-1.0 range, not 0-255
- **Stroke affects layout unexpectedly** - Use Inner position to keep strokes within bounds, or Outer if you want strokes to extend beyond the block
- **Block doesn't support strokes** - Use `supportsStroke()` to verify capability before applying stroke properties

## API Reference

| Method                                       | Description                                    |
| -------------------------------------------- | ---------------------------------------------- |
| `block.supportsStroke(block)`                | Check if a block supports strokes              |
| `block.setStrokeEnabled(block, enabled)`     | Enable or disable stroke on a block            |
| `block.isStrokeEnabled(block)`               | Check if stroke is enabled                     |
| `block.setStrokeColor(block, color)`         | Set stroke color (RGBA, values 0.0-1.0)        |
| `block.getStrokeColor(block)`                | Get current stroke color                       |
| `block.setStrokeWidth(block, width)`         | Set stroke thickness in design units           |
| `block.getStrokeWidth(block)`                | Get current stroke width                       |
| `block.setStrokeStyle(block, style)`         | Set line pattern (Solid, Dashed, Dotted, etc.) |
| `block.getStrokeStyle(block)`                | Get current stroke style                       |
| `block.setStrokePosition(block, position)`   | Set stroke position (Center, Inner, Outer)     |
| `block.getStrokePosition(block)`             | Get current stroke position                    |
| `block.setStrokeCornerGeometry(block, type)` | Set corner rendering (Miter, Round, Bevel)     |
| `block.getStrokeCornerGeometry(block)`       | Get current corner geometry                    |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support