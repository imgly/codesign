> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Add a Background](./create-composition/add-background.md)

---

Add backgrounds to designs using fills for pages and shapes, and the background color property for text blocks.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-add-background-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-add-background-server-js)

CE.SDK provides two distinct approaches for adding backgrounds to design elements. Understanding when to use each approach ensures your designs render correctly and efficiently.

```typescript file=@cesdk_web_examples/guides-create-composition-add-background-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add a Background
 *
 * Demonstrates:
 * - Applying gradient fills to pages
 * - Adding background colors to text blocks
 * - Applying image fills to shapes
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];
  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);

  // Check if the page supports fill, then apply a pastel gradient
  if (engine.block.supportsFill(page)) {
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.85, g: 0.75, b: 0.95, a: 1.0 }, stop: 0 },
      { color: { r: 0.7, g: 0.9, b: 0.95, a: 1.0 }, stop: 1 },
    ]);
    engine.block.setFill(page, gradientFill);
  }

  // Create header text (dark, no background)
  const headerText = engine.block.create('text');
  engine.block.setString(headerText, 'text/text', 'Learn cesdk');
  engine.block.setFloat(headerText, 'text/fontSize', 12);
  engine.block.setWidth(headerText, 350);
  engine.block.setHeightMode(headerText, 'Auto');
  engine.block.setPositionX(headerText, 50);
  engine.block.setPositionY(headerText, 230);
  engine.block.setColor(headerText, 'fill/solid/color', {
    r: 0.15,
    g: 0.15,
    b: 0.2,
    a: 1.0,
  });
  engine.block.appendChild(page, headerText);

  // Create "Backgrounds" text with white background
  const featuredText = engine.block.create('text');
  engine.block.setString(featuredText, 'text/text', 'Backgrounds');
  engine.block.setFloat(featuredText, 'text/fontSize', 8);
  engine.block.setWidth(featuredText, 280);
  engine.block.setHeightMode(featuredText, 'Auto');
  // Offset X by paddingLeft (16) so background aligns with header at X=50
  engine.block.setPositionX(featuredText, 66);
  engine.block.setPositionY(featuredText, 310);
  engine.block.setColor(featuredText, 'fill/solid/color', {
    r: 0.2,
    g: 0.2,
    b: 0.25,
    a: 1.0,
  });
  engine.block.appendChild(page, featuredText);

  // Add white background color to the featured text block
  if (engine.block.supportsBackgroundColor(featuredText)) {
    engine.block.setBackgroundColorEnabled(featuredText, true);
    engine.block.setColor(featuredText, 'backgroundColor/color', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0,
    });
    engine.block.setFloat(featuredText, 'backgroundColor/paddingLeft', 16);
    engine.block.setFloat(featuredText, 'backgroundColor/paddingRight', 16);
    engine.block.setFloat(featuredText, 'backgroundColor/paddingTop', 10);
    engine.block.setFloat(featuredText, 'backgroundColor/paddingBottom', 10);
    engine.block.setFloat(featuredText, 'backgroundColor/cornerRadius', 8);
  }

  // Create an image block on the right side
  const imageBlock = engine.block.create('graphic');
  const imageShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, imageShape);
  engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusTL', 16);
  engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusTR', 16);
  engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusBL', 16);
  engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusBR', 16);
  engine.block.setWidth(imageBlock, 340);
  engine.block.setHeight(imageBlock, 400);
  engine.block.setPositionX(imageBlock, 420);
  engine.block.setPositionY(imageBlock, 100);

  // Check if the block supports fill, then apply an image fill
  if (engine.block.supportsFill(imageBlock)) {
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
  }
  engine.block.appendChild(page, imageBlock);

  // Create IMG.LY logo (bottom left)
  const logoBlock = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logoBlock, logoShape);
  engine.block.setWidth(logoBlock, 100);
  engine.block.setHeight(logoBlock, 40);
  engine.block.setPositionX(logoBlock, 50);
  engine.block.setPositionY(logoBlock, 530);
  if (engine.block.supportsFill(logoBlock)) {
    const logoFill = engine.block.createFill('image');
    engine.block.setString(
      logoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(logoBlock, logoFill);
  }
  engine.block.appendChild(page, logoBlock);

  // Pages and graphic blocks support fills; text blocks do not
  const pageSupportsFill = engine.block.supportsFill(page);
  const imageSupportsFill = engine.block.supportsFill(imageBlock);

  // eslint-disable-next-line no-console
  console.log('Page supports fill:', pageSupportsFill);
  // eslint-disable-next-line no-console
  console.log('Image supports fill:', imageSupportsFill);

  // Only text blocks support background colors
  const textSupportsBackground =
    engine.block.supportsBackgroundColor(featuredText);

  // eslint-disable-next-line no-console
  console.log('Text supports backgroundColor:', textSupportsBackground);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/add-background-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/add-background-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## Setup

Initialize the CE.SDK engine in headless mode and create a scene with a page.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Fills

Fills are visual content applied to pages and graphic blocks. Supported fill types include solid colors, linear gradients, radial gradients, and images.

### Check Fill Support

Before applying a fill, verify the block supports it with `supportsFill()`. Pages and graphic blocks typically support fills, while text blocks handle their content differently.

```typescript highlight=highlight-check-fill-support
  // Pages and graphic blocks support fills; text blocks do not
  const pageSupportsFill = engine.block.supportsFill(page);
  const imageSupportsFill = engine.block.supportsFill(imageBlock);

  // eslint-disable-next-line no-console
  console.log('Page supports fill:', pageSupportsFill);
  // eslint-disable-next-line no-console
  console.log('Image supports fill:', imageSupportsFill);
```

### Apply a Gradient Fill

Create a fill with `createFill()` specifying the type, configure its properties, then apply it with `setFill()`. The example below creates a linear gradient with two color stops.

```typescript highlight=highlight-page-fill
// Check if the page supports fill, then apply a pastel gradient
if (engine.block.supportsFill(page)) {
  const gradientFill = engine.block.createFill('gradient/linear');
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 0.85, g: 0.75, b: 0.95, a: 1.0 }, stop: 0 },
    { color: { r: 0.7, g: 0.9, b: 0.95, a: 1.0 }, stop: 1 },
  ]);
  engine.block.setFill(page, gradientFill);
}
```

The gradient transitions from a pastel purple at the start to a light cyan at the end.

### Apply an Image Fill

Image fills display images within the block's shape bounds. Create an image fill, set its URI, and apply it to a graphic block.

```typescript highlight=highlight-shape-fill
// Check if the block supports fill, then apply an image fill
if (engine.block.supportsFill(imageBlock)) {
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);
}
```

The shape's corner radius creates rounded corners on the image. Image fills automatically scale to cover the shape area.

## Background Color

Background color is a dedicated property available specifically on text blocks. Unlike fills, background colors include configurable padding and corner radius, creating highlighted text effects without additional graphic blocks.

### Check Background Color Support

Use `supportsBackgroundColor()` to verify a block supports this feature. Currently, only text blocks support background colors.

```typescript highlight=highlight-check-background-color-support
  // Only text blocks support background colors
  const textSupportsBackground =
    engine.block.supportsBackgroundColor(featuredText);

  // eslint-disable-next-line no-console
  console.log('Text supports backgroundColor:', textSupportsBackground);
```

### Apply Background Color

Enable the background color with `setBackgroundColorEnabled()`, then configure its appearance using property paths for color, padding, and corner radius.

```typescript highlight=highlight-background-color
// Add white background color to the featured text block
if (engine.block.supportsBackgroundColor(featuredText)) {
  engine.block.setBackgroundColorEnabled(featuredText, true);
  engine.block.setColor(featuredText, 'backgroundColor/color', {
    r: 1.0,
    g: 1.0,
    b: 1.0,
    a: 1.0,
  });
  engine.block.setFloat(featuredText, 'backgroundColor/paddingLeft', 16);
  engine.block.setFloat(featuredText, 'backgroundColor/paddingRight', 16);
  engine.block.setFloat(featuredText, 'backgroundColor/paddingTop', 10);
  engine.block.setFloat(featuredText, 'backgroundColor/paddingBottom', 10);
  engine.block.setFloat(featuredText, 'backgroundColor/cornerRadius', 8);
}
```

The padding properties (`backgroundColor/paddingLeft`, `backgroundColor/paddingRight`, `backgroundColor/paddingTop`, `backgroundColor/paddingBottom`) control the space between the text and the background edge. The `backgroundColor/cornerRadius` property rounds the corners.

## Export the Result

After creating the composition, export the page to a PNG file. The engine supports various export formats including PNG, JPEG, and PDF.

```typescript highlight=highlight-export
  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/add-background-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/add-background-result.png');
```

## Cleanup

Always dispose the engine when finished to free system resources. Using a try/finally block ensures cleanup happens even if errors occur.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Fill Not Visible

If a fill doesn't appear:

- Ensure all color components (r, g, b) are between 0 and 1
- Check that the alpha component is greater than 0
- Verify the block supports fills with `supportsFill()`

### Background Color Not Appearing

If a background color doesn't appear:

- Confirm the block supports it with `supportsBackgroundColor()`
- Verify `setBackgroundColorEnabled(block, true)` was called
- Check that the color's alpha value is greater than 0

### Image Not Loading

If an image fill doesn't display:

- Verify the image URI is accessible
- Check server logs for network errors
- Ensure the image format is supported (PNG, JPEG, WebP)

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsFill(block)` | Check if a block supports fills |
| `engine.block.createFill(type)` | Create a fill (color, gradient/linear, gradient/radial, image) |
| `engine.block.setFill(block, fill)` | Apply a fill to a block |
| `engine.block.getFill(block)` | Get the fill applied to a block |
| `engine.block.setGradientColorStops(fill, property, stops)` | Set gradient color stops |
| `engine.block.supportsBackgroundColor(block)` | Check if a block supports background color |
| `engine.block.setBackgroundColorEnabled(block, enabled)` | Enable or disable background color |
| `engine.block.isBackgroundColorEnabled(block)` | Check if background color is enabled |
| `engine.block.setColor(block, property, color)` | Set color properties |
| `engine.block.setFloat(block, property, value)` | Set float properties (padding, radius) |
| `engine.block.export(block, options)` | Export a block to an image or document |
| `engine.dispose()` | Free engine resources |

## Next Steps

Explore related topics:

- [Apply Colors](./colors/apply.md) - Work with RGB, CMYK, and spot colors
- [Fills Overview](./fills/overview.md) - Learn about all fill types in depth



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support