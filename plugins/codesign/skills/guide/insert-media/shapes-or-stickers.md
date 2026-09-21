> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Insert Media Assets](./insert-media.md) > [Insert Shapes or Stickers](./insert-media/shapes-or-stickers.md)

---

Add vector shapes and stickers to designs in headless Node.js environments
using CE.SDK's block API. Shapes require fills to be visible and offer
type-specific properties like corner radius and star points.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-insert-media-shapes-or-stickers-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-insert-media-shapes-or-stickers-server-js)

Shapes are vector graphics created with `engine.block.createShape()` and attached to graphic blocks. CE.SDK supports six shape types: **rect**, **ellipse**, **star**, **polygon**, **line**, and **vector\_path**. Stickers are pre-made graphic assets loaded via URLs. Both require fills or strokes to be visible.

```typescript file=@cesdk_web_examples/guides-insert-media-shapes-or-stickers-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

// Prompt user to confirm export
async function confirmExport(): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nExport design to PNG? [Y/n]: ', (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * CE.SDK Server Guide: Insert Shapes or Stickers
 *
 * Demonstrates inserting various shapes and stickers into designs:
 * - Checking shape support on blocks
 * - Creating different shape types (rect, ellipse, star, polygon, line, vector_path)
 * - Configuring shape-specific properties
 * - Applying fills to make shapes visible
 * - Adding stickers using convenience API and manual construction
 */
async function main() {
  console.log('\n⏳ Initializing CE.SDK engine...');

  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and shapes...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }

    // Check if a block supports shapes before attaching one
    const testBlock = engine.block.create('graphic');
    const supportsShape = engine.block.supportsShape(testBlock);
    console.log('Graphic block supports shapes:', supportsShape); // true

    // Text blocks do not support shapes
    const textBlock = engine.block.create('text');
    const textSupportsShape = engine.block.supportsShape(textBlock);
    console.log('Text block supports shapes:', textSupportsShape); // false
    engine.block.destroy(textBlock);
    engine.block.destroy(testBlock);

    // Create a rectangle with a solid color fill
    const rectBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rectBlock, rectShape);

    // Apply a solid color fill to make the shape visible
    const rectFill = engine.block.createFill('color');
    engine.block.setColor(rectFill, 'fill/color/value', {
      r: 0.2,
      g: 0.5,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(rectBlock, rectFill);

    engine.block.setWidth(rectBlock, 100);
    engine.block.setHeight(rectBlock, 100);
    engine.block.setPositionX(rectBlock, 50);
    engine.block.setPositionY(rectBlock, 50);
    engine.block.appendChild(page, rectBlock);

    // Create a rounded rectangle with corner radius
    const roundedRectBlock = engine.block.create('graphic');
    const roundedRectShape = engine.block.createShape('rect');
    engine.block.setShape(roundedRectBlock, roundedRectShape);

    // Set corner radius for rounded corners
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTR', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBR', 20);

    const roundedRectFill = engine.block.createFill('color');
    engine.block.setColor(roundedRectFill, 'fill/color/value', {
      r: 0.9,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(roundedRectBlock, roundedRectFill);

    engine.block.setWidth(roundedRectBlock, 100);
    engine.block.setHeight(roundedRectBlock, 100);
    engine.block.setPositionX(roundedRectBlock, 180);
    engine.block.setPositionY(roundedRectBlock, 50);
    engine.block.appendChild(page, roundedRectBlock);

    // Create an ellipse (circle when width equals height)
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);

    const ellipseFill = engine.block.createFill('color');
    engine.block.setColor(ellipseFill, 'fill/color/value', {
      r: 0.3,
      g: 0.8,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(ellipseBlock, ellipseFill);

    engine.block.setWidth(ellipseBlock, 100);
    engine.block.setHeight(ellipseBlock, 100);
    engine.block.setPositionX(ellipseBlock, 310);
    engine.block.setPositionY(ellipseBlock, 50);
    engine.block.appendChild(page, ellipseBlock);

    // Create a star with custom points and inner diameter
    const starBlock = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(starBlock, starShape);

    // Configure star properties
    engine.block.setInt(starShape, 'shape/star/points', 5);
    engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.4);

    const starFill = engine.block.createFill('color');
    engine.block.setColor(starFill, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(starBlock, starFill);

    engine.block.setWidth(starBlock, 100);
    engine.block.setHeight(starBlock, 100);
    engine.block.setPositionX(starBlock, 440);
    engine.block.setPositionY(starBlock, 50);
    engine.block.appendChild(page, starBlock);

    // Create a polygon (hexagon with 6 sides)
    const polygonBlock = engine.block.create('graphic');
    const polygonShape = engine.block.createShape('polygon');
    engine.block.setShape(polygonBlock, polygonShape);

    // Set number of sides for the polygon
    engine.block.setInt(polygonShape, 'shape/polygon/sides', 6);

    const polygonFill = engine.block.createFill('color');
    engine.block.setColor(polygonFill, 'fill/color/value', {
      r: 0.6,
      g: 0.2,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(polygonBlock, polygonFill);

    engine.block.setWidth(polygonBlock, 100);
    engine.block.setHeight(polygonBlock, 100);
    engine.block.setPositionX(polygonBlock, 570);
    engine.block.setPositionY(polygonBlock, 50);
    engine.block.appendChild(page, polygonBlock);

    // Create a line shape
    const lineBlock = engine.block.create('graphic');
    const lineShape = engine.block.createShape('line');
    engine.block.setShape(lineBlock, lineShape);

    // Lines typically use strokes instead of fills
    engine.block.setStrokeEnabled(lineBlock, true);
    engine.block.setStrokeWidth(lineBlock, 6);
    engine.block.setStrokeColor(lineBlock, {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setWidth(lineBlock, 100);
    engine.block.setHeight(lineBlock, 100);
    engine.block.setPositionX(lineBlock, 50);
    engine.block.setPositionY(lineBlock, 200);
    engine.block.appendChild(page, lineBlock);

    // Create a custom triangle using vector path
    const vectorPathBlock = engine.block.create('graphic');
    const vectorPathShape = engine.block.createShape('vector_path');
    engine.block.setShape(vectorPathBlock, vectorPathShape);

    // Define a triangle using SVG path syntax (coordinates scale with block size)
    const trianglePath = 'M 50,0 L 100,100 L 0,100 Z';
    engine.block.setString(
      vectorPathShape,
      'shape/vector_path/path',
      trianglePath
    );

    const vectorPathFill = engine.block.createFill('color');
    engine.block.setColor(vectorPathFill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });
    engine.block.setFill(vectorPathBlock, vectorPathFill);

    engine.block.setWidth(vectorPathBlock, 100);
    engine.block.setHeight(vectorPathBlock, 100);
    engine.block.setPositionX(vectorPathBlock, 180);
    engine.block.setPositionY(vectorPathBlock, 200);
    engine.block.appendChild(page, vectorPathBlock);

    // Discover available properties for a shape
    const shapeProperties = engine.block.findAllProperties(starShape);
    console.log('Star shape properties:', shapeProperties);

    // Add a sticker using the convenience API
    const stickerUrl =
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg';
    const stickerBlock = await engine.block.addImage(stickerUrl, {
      size: { width: 100, height: 100 }
    });
    engine.block.setKind(stickerBlock, 'sticker');
    engine.block.setPositionX(stickerBlock, 310);
    engine.block.setPositionY(stickerBlock, 200);
    engine.block.appendChild(page, stickerBlock);

    // Add a sticker using manual construction for more control
    const manualStickerBlock = engine.block.create('graphic');
    const manualStickerShape = engine.block.createShape('rect');
    engine.block.setShape(manualStickerBlock, manualStickerShape);

    // Create image fill with the sticker URI
    const stickerFill = engine.block.createFill('image');
    engine.block.setString(
      stickerFill,
      'fill/image/imageFileURI',
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg'
    );
    engine.block.setFill(manualStickerBlock, stickerFill);

    // Set content fill mode to preserve aspect ratio
    if (engine.block.supportsContentFillMode(manualStickerBlock)) {
      engine.block.setContentFillMode(manualStickerBlock, 'Contain');
    }

    // Set kind to 'sticker' for proper categorization
    engine.block.setKind(manualStickerBlock, 'sticker');

    engine.block.setWidth(manualStickerBlock, 100);
    engine.block.setHeight(manualStickerBlock, 100);
    engine.block.setPositionX(manualStickerBlock, 440);
    engine.block.setPositionY(manualStickerBlock, 200);
    engine.block.appendChild(page, manualStickerBlock);

    // Export the result to a file after user confirmation
    const shouldExport = await confirmExport();
    if (shouldExport) {
      console.log('\n⏳ Exporting design...');
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      const outputPath = `${outputDir}/shapes-and-stickers.png`;
      writeFileSync(outputPath, buffer);

      console.log(`\n✅ Exported result to ${outputPath}`);
    } else {
      console.log('\n⏭️ Export skipped.');
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
    console.log('🧹 Engine disposed');
  }
}

main().catch(console.error);
```

This guide covers creating shapes and stickers programmatically using the block API in a headless server environment.

## Programmatic Shape Creation

### Initialize CE.SDK

Set up CE.SDK in headless mode using `@cesdk/node` or `@cesdk/node-native`. Create a scene with a page to hold your shapes.

```typescript highlight-setup
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and shapes...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }
```

### Check Shape Support

Before attaching a shape to a block, verify it supports shapes using `supportsShape()`. Graphic blocks support shapes while text blocks do not.

```typescript highlight-check-shape-support
    // Check if a block supports shapes before attaching one
    const testBlock = engine.block.create('graphic');
    const supportsShape = engine.block.supportsShape(testBlock);
    console.log('Graphic block supports shapes:', supportsShape); // true

    // Text blocks do not support shapes
    const textBlock = engine.block.create('text');
    const textSupportsShape = engine.block.supportsShape(textBlock);
    console.log('Text block supports shapes:', textSupportsShape); // false
    engine.block.destroy(textBlock);
    engine.block.destroy(testBlock);
```

### Create Rectangle

Create rectangles with `createShape('rect')` and attach them to a graphic block with `setShape()`. Apply a fill to make the shape visible.

```typescript highlight-create-rectangle
    // Create a rectangle with a solid color fill
    const rectBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rectBlock, rectShape);

    // Apply a solid color fill to make the shape visible
    const rectFill = engine.block.createFill('color');
    engine.block.setColor(rectFill, 'fill/color/value', {
      r: 0.2,
      g: 0.5,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(rectBlock, rectFill);

    engine.block.setWidth(rectBlock, 100);
    engine.block.setHeight(rectBlock, 100);
    engine.block.setPositionX(rectBlock, 50);
    engine.block.setPositionY(rectBlock, 50);
    engine.block.appendChild(page, rectBlock);
```

### Create Rounded Rectangle

Rectangles support corner radius properties for rounded corners. Set each corner individually using `shape/rect/cornerRadiusTL`, `cornerRadiusTR`, `cornerRadiusBL`, and `cornerRadiusBR`.

```typescript highlight-create-rounded-rectangle
    // Create a rounded rectangle with corner radius
    const roundedRectBlock = engine.block.create('graphic');
    const roundedRectShape = engine.block.createShape('rect');
    engine.block.setShape(roundedRectBlock, roundedRectShape);

    // Set corner radius for rounded corners
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTR', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBR', 20);

    const roundedRectFill = engine.block.createFill('color');
    engine.block.setColor(roundedRectFill, 'fill/color/value', {
      r: 0.9,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(roundedRectBlock, roundedRectFill);

    engine.block.setWidth(roundedRectBlock, 100);
    engine.block.setHeight(roundedRectBlock, 100);
    engine.block.setPositionX(roundedRectBlock, 180);
    engine.block.setPositionY(roundedRectBlock, 50);
    engine.block.appendChild(page, roundedRectBlock);
```

### Create Ellipse

Create circles and ovals with `createShape('ellipse')`. The block's aspect ratio determines whether it appears as a circle (equal width and height) or an oval.

```typescript highlight-create-ellipse
    // Create an ellipse (circle when width equals height)
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);

    const ellipseFill = engine.block.createFill('color');
    engine.block.setColor(ellipseFill, 'fill/color/value', {
      r: 0.3,
      g: 0.8,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(ellipseBlock, ellipseFill);

    engine.block.setWidth(ellipseBlock, 100);
    engine.block.setHeight(ellipseBlock, 100);
    engine.block.setPositionX(ellipseBlock, 310);
    engine.block.setPositionY(ellipseBlock, 50);
    engine.block.appendChild(page, ellipseBlock);
```

### Create Star

Create stars with `createShape('star')`. Configure the number of points with `shape/star/points` and control the inner diameter with `shape/star/innerDiameter` (0.0 to 1.0).

```typescript highlight-create-star
    // Create a star with custom points and inner diameter
    const starBlock = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(starBlock, starShape);

    // Configure star properties
    engine.block.setInt(starShape, 'shape/star/points', 5);
    engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.4);

    const starFill = engine.block.createFill('color');
    engine.block.setColor(starFill, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(starBlock, starFill);

    engine.block.setWidth(starBlock, 100);
    engine.block.setHeight(starBlock, 100);
    engine.block.setPositionX(starBlock, 440);
    engine.block.setPositionY(starBlock, 50);
    engine.block.appendChild(page, starBlock);
```

### Create Polygon

Create regular polygons with `createShape('polygon')`. Set the number of sides with `shape/polygon/sides` to create triangles (3), pentagons (5), hexagons (6), and more.

```typescript highlight-create-polygon
    // Create a polygon (hexagon with 6 sides)
    const polygonBlock = engine.block.create('graphic');
    const polygonShape = engine.block.createShape('polygon');
    engine.block.setShape(polygonBlock, polygonShape);

    // Set number of sides for the polygon
    engine.block.setInt(polygonShape, 'shape/polygon/sides', 6);

    const polygonFill = engine.block.createFill('color');
    engine.block.setColor(polygonFill, 'fill/color/value', {
      r: 0.6,
      g: 0.2,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(polygonBlock, polygonFill);

    engine.block.setWidth(polygonBlock, 100);
    engine.block.setHeight(polygonBlock, 100);
    engine.block.setPositionX(polygonBlock, 570);
    engine.block.setPositionY(polygonBlock, 50);
    engine.block.appendChild(page, polygonBlock);
```

### Create Line

Create lines with `createShape('line')`. Lines are typically styled with strokes rather than fills using `setStrokeEnabled()` and `setStrokeWidth()`.

```typescript highlight-create-line
    // Create a line shape
    const lineBlock = engine.block.create('graphic');
    const lineShape = engine.block.createShape('line');
    engine.block.setShape(lineBlock, lineShape);

    // Lines typically use strokes instead of fills
    engine.block.setStrokeEnabled(lineBlock, true);
    engine.block.setStrokeWidth(lineBlock, 6);
    engine.block.setStrokeColor(lineBlock, {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setWidth(lineBlock, 100);
    engine.block.setHeight(lineBlock, 100);
    engine.block.setPositionX(lineBlock, 50);
    engine.block.setPositionY(lineBlock, 200);
    engine.block.appendChild(page, lineBlock);
```

### Create Vector Path

Create custom shapes with `createShape('vector_path')`. Define the path using SVG path syntax with `shape/vector_path/path`. The path coordinates scale proportionally with the block dimensions.

```typescript highlight-create-vector-path
    // Create a custom triangle using vector path
    const vectorPathBlock = engine.block.create('graphic');
    const vectorPathShape = engine.block.createShape('vector_path');
    engine.block.setShape(vectorPathBlock, vectorPathShape);

    // Define a triangle using SVG path syntax (coordinates scale with block size)
    const trianglePath = 'M 50,0 L 100,100 L 0,100 Z';
    engine.block.setString(
      vectorPathShape,
      'shape/vector_path/path',
      trianglePath
    );

    const vectorPathFill = engine.block.createFill('color');
    engine.block.setColor(vectorPathFill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });
    engine.block.setFill(vectorPathBlock, vectorPathFill);

    engine.block.setWidth(vectorPathBlock, 100);
    engine.block.setHeight(vectorPathBlock, 100);
    engine.block.setPositionX(vectorPathBlock, 180);
    engine.block.setPositionY(vectorPathBlock, 200);
    engine.block.appendChild(page, vectorPathBlock);
```

### Discover Shape Properties

Use `findAllProperties()` to discover available configuration options for any shape type.

```typescript highlight-discover-shape-properties
// Discover available properties for a shape
const shapeProperties = engine.block.findAllProperties(starShape);
console.log('Star shape properties:', shapeProperties);
```

Each shape type has specific properties:

- **Rectangle**: `shape/rect/cornerRadiusTL`, `cornerRadiusTR`, `cornerRadiusBL`, `cornerRadiusBR`
- **Star**: `shape/star/points`, `shape/star/innerDiameter`
- **Polygon**: `shape/polygon/sides`
- **Vector Path**: `shape/vector_path/path`

## Programmatic Sticker Insertion

### Using the Convenience API

The simplest way to add stickers is with `engine.block.addImage()`. This convenience API handles graphic block creation, shape attachment, and fill setup automatically.

```typescript highlight-sticker-convenience-api
// Add a sticker using the convenience API
const stickerUrl =
  'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg';
const stickerBlock = await engine.block.addImage(stickerUrl, {
  size: { width: 100, height: 100 }
});
engine.block.setKind(stickerBlock, 'sticker');
engine.block.setPositionX(stickerBlock, 310);
engine.block.setPositionY(stickerBlock, 200);
engine.block.appendChild(page, stickerBlock);
```

Setting `setKind(block, 'sticker')` categorizes the block correctly, which helps with organization and enables sticker-specific behaviors.

### Manual Sticker Construction

For full control over sticker creation, manually construct a graphic block with a rect shape and image fill.

```typescript highlight-sticker-manual-construction
    // Add a sticker using manual construction for more control
    const manualStickerBlock = engine.block.create('graphic');
    const manualStickerShape = engine.block.createShape('rect');
    engine.block.setShape(manualStickerBlock, manualStickerShape);

    // Create image fill with the sticker URI
    const stickerFill = engine.block.createFill('image');
    engine.block.setString(
      stickerFill,
      'fill/image/imageFileURI',
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg'
    );
    engine.block.setFill(manualStickerBlock, stickerFill);

    // Set content fill mode to preserve aspect ratio
    if (engine.block.supportsContentFillMode(manualStickerBlock)) {
      engine.block.setContentFillMode(manualStickerBlock, 'Contain');
    }

    // Set kind to 'sticker' for proper categorization
    engine.block.setKind(manualStickerBlock, 'sticker');

    engine.block.setWidth(manualStickerBlock, 100);
    engine.block.setHeight(manualStickerBlock, 100);
    engine.block.setPositionX(manualStickerBlock, 440);
    engine.block.setPositionY(manualStickerBlock, 200);
    engine.block.appendChild(page, manualStickerBlock);
```

Using `setContentFillMode(block, 'Contain')` preserves the sticker's aspect ratio within the block bounds. Always check `supportsContentFillMode()` before setting this property.

## Export and Cleanup

### Confirm Export

Prompt users to confirm export before saving. This example uses Node.js readline for interactive input.

```typescript highlight-confirm-export
// Prompt user to confirm export
async function confirmExport(): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nExport design to PNG? [Y/n]: ', (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
    });
  });
}
```

### Export to File

Export the design using `engine.block.export()` and save to the output directory.

```typescript highlight-export
    // Export the result to a file after user confirmation
    const shouldExport = await confirmExport();
    if (shouldExport) {
      console.log('\n⏳ Exporting design...');
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      const outputPath = `${outputDir}/shapes-and-stickers.png`;
      writeFileSync(outputPath, buffer);

      console.log(`\n✅ Exported result to ${outputPath}`);
    } else {
      console.log('\n⏭️ Export skipped.');
    }
```

### Cleanup

Always dispose of the engine when done to free resources.

```typescript highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
console.log('🧹 Engine disposed');
```

## Troubleshooting

### Shape Not Visible

If a shape doesn't appear after creation:

- **Verify a fill is applied** - Shapes without fills are invisible. Create a fill with `createFill()` and apply it with `setFill()`
- **Check the block is added to the page** - Use `appendChild(page, block)` to add the block to the scene hierarchy
- **Ensure dimensions are set** - Call `setWidth()` and `setHeight()` to give the shape a size

### Sticker Appears Cropped

If stickers appear cropped or distorted:

- Use `setContentFillMode(block, 'Contain')` to preserve aspect ratio
- Check `supportsContentFillMode()` before setting the mode
- Adjust block dimensions to better match the sticker's native aspect ratio

### Invalid Shape Type

If `createShape()` throws an error:

- Verify the shape type is one of: `rect`, `ellipse`, `star`, `polygon`, `line`, `vector_path`
- Check for typos in the type string (case-sensitive)

## API Reference

| Method                                       | Description                                       |
| -------------------------------------------- | ------------------------------------------------- |
| `block.create('graphic')`                    | Create a graphic block for shapes                 |
| `block.createShape(type)`                    | Create a shape of the specified type              |
| `block.supportsShape(block)`                 | Check if a block supports shapes                  |
| `block.setShape(block, shape)`               | Attach a shape to a graphic block                 |
| `block.getShape(block)`                      | Get the shape attached to a block                 |
| `block.findAllProperties(shape)`             | Discover available shape properties               |
| `block.setInt(shape, property, value)`       | Set integer property (points, sides)              |
| `block.setFloat(shape, property, value)`     | Set float property (corner radius, diameter)      |
| `block.setString(shape, property, value)`    | Set string property (vector path)                 |
| `block.createFill(type)`                     | Create a fill for the shape                       |
| `block.setFill(block, fill)`                 | Apply fill to a block                             |
| `block.setColor(fill, property, color)`      | Set fill color value                              |
| `block.addImage(uri, options?)`              | Convenience API for adding images/stickers        |
| `block.setKind(block, kind)`                 | Set block kind for categorization                 |
| `block.setContentFillMode(block, mode)`      | Set content fill mode ('Contain', 'Cover', etc.)  |
| `block.supportsContentFillMode(block)`       | Check if block supports content fill mode         |
| `block.setPositionX(block, x)`               | Set horizontal position                           |
| `block.setPositionY(block, y)`               | Set vertical position                             |
| `block.setWidth(block, width)`               | Set block width                                   |
| `block.setHeight(block, height)`             | Set block height                                  |
| `block.appendChild(parent, child)`           | Add block to parent                               |
| `block.setStrokeEnabled(block, enabled)`     | Enable or disable stroke                          |
| `block.setStrokeWidth(block, width)`         | Set stroke width                                  |
| `block.setStrokeColor(block, color)`         | Set stroke color                                  |
| `block.export(block, options)`               | Export block to image/PDF blob                    |
| `block.isValid(block)`                       | Check if a block handle is valid                  |
| `engine.dispose()`                           | Dispose engine and free resources                 |

## Next Steps

- [Colors](./colors.md) - Work with colors, fills, and gradients
- [Filters and Effects](./filters-and-effects.md) - Apply visual effects to design elements
- [Position and Align](./create-composition/position-and-align.md) - Position elements precisely on the canvas



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support