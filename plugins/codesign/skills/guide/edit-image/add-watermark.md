> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Add Watermark](./edit-image/add-watermark.md)

---

Add text and image watermarks to designs programmatically using CE.SDK's block API in a headless Node.js environment.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-add-watermark-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-add-watermark-server-js)

Watermarks protect intellectual property, indicate ownership, add branding, or mark content as drafts. CE.SDK supports two types of watermarks: **text watermarks** created from text blocks for copyright notices and brand names, and **image watermarks** created from graphic blocks with image fills for logos and symbols.

```typescript file=@cesdk_web_examples/guides-edit-image-add-watermark-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Watermark
 *
 * Demonstrates adding text and image watermarks to designs:
 * - Creating text watermarks with custom styling
 * - Creating logo watermarks using graphic blocks
 * - Positioning watermarks side by side at the bottom
 * - Applying drop shadows for visibility
 * - Exporting watermarked designs
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with custom page dimensions
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create a gradient background for the page
  const gradientFill = engine.block.createFill('gradient/linear');

  // Set a modern purple-to-cyan gradient
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 0.39, g: 0.4, b: 0.95, a: 1 }, stop: 0 }, // Indigo
    { color: { r: 0.02, g: 0.71, b: 0.83, a: 1 }, stop: 1 } // Cyan
  ]);

  // Set diagonal gradient direction (top-left to bottom-right)
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

  // Apply gradient to page
  engine.block.setFill(page, gradientFill);

  // Create a centered title text
  const titleText = engine.block.create('text');
  engine.block.setString(titleText, 'text/text', 'Add Watermark');
  engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
  engine.block.appendChild(page, titleText);

  // Style the title
  engine.block.setTextFontSize(titleText, 14);
  engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });
  engine.block.setWidthMode(titleText, 'Auto');
  engine.block.setHeightMode(titleText, 'Auto');

  // Center the title on the page
  const titleWidth = engine.block.getFrameWidth(titleText);
  const titleHeight = engine.block.getFrameHeight(titleText);
  engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleText, (pageHeight - titleHeight) / 2);

  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Set the watermark text content
  engine.block.setString(textWatermark, 'text/text', '© 2024 img.ly');

  // Left-align the text for the watermark
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Add the text block to the page
  engine.block.appendChild(page, textWatermark);

  // Set font size for the watermark
  engine.block.setTextFontSize(textWatermark, 4);

  // Set text color to white for contrast
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 });

  // Set opacity to make it semi-transparent
  engine.block.setOpacity(textWatermark, 0.8);

  // Set width mode to auto so text fits its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');

  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rect shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with a logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );

  // Apply the fill to the graphic block
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain the image within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');

  // Add to page
  engine.block.appendChild(page, logoWatermark);

  // Size the logo watermark
  const logoWidth = 80;
  const logoHeight = 50;
  engine.block.setWidth(logoWatermark, logoWidth);
  engine.block.setHeight(logoWatermark, logoHeight);

  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.8);

  // Position padding from edges
  const padding = 15;

  // Position text watermark at bottom-left
  engine.block.setPositionX(textWatermark, padding);
  engine.block.setPositionY(textWatermark, pageHeight - padding - 20);

  // Position logo watermark at top-right
  engine.block.setPositionX(logoWatermark, pageWidth - padding - logoWidth);
  engine.block.setPositionY(logoWatermark, padding);

  // Add drop shadow to text watermark for better visibility
  engine.block.setDropShadowEnabled(textWatermark, true);
  engine.block.setDropShadowOffsetX(textWatermark, 1);
  engine.block.setDropShadowOffsetY(textWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(textWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(textWatermark, 2);
  engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.5 });

  // Add drop shadow to logo watermark
  engine.block.setDropShadowEnabled(logoWatermark, true);
  engine.block.setDropShadowOffsetX(logoWatermark, 1);
  engine.block.setDropShadowOffsetY(logoWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(logoWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(logoWatermark, 2);
  engine.block.setDropShadowColor(logoWatermark, { r: 0, g: 0, b: 0, a: 0.5 });

  // Export the watermarked design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/watermarked-design.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported watermarked design to output/watermarked-design.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to create text and logo watermarks, position them on a design, style them for visibility, and export the watermarked result.

## Setup and Prerequisites

We start by initializing CE.SDK in headless mode and creating a scene with a custom page size. The page provides the canvas where we'll add our watermarks.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

We use `engine.scene.create('VerticalStack', {...})` to create a scene with custom page dimensions. The page dimensions are retrieved for positioning calculations later.

## Creating Text Watermarks

Text watermarks display copyright notices, URLs, or brand names. We create a text block, set its content, and add it to the page.

```typescript highlight=highlight-create-text-watermark
  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Set the watermark text content
  engine.block.setString(textWatermark, 'text/text', '© 2024 img.ly');

  // Left-align the text for the watermark
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Add the text block to the page
  engine.block.appendChild(page, textWatermark);
```

The `engine.block.create('text')` method creates a new text block. We set the text content using `engine.block.setString()` with the `'text/text'` property.

### Styling the Text

We configure the font size, color, and opacity to make the watermark visible but unobtrusive.

```typescript highlight=highlight-style-text-watermark
  // Set font size for the watermark
  engine.block.setTextFontSize(textWatermark, 4);

  // Set text color to white for contrast
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 });

  // Set opacity to make it semi-transparent
  engine.block.setOpacity(textWatermark, 0.8);

  // Set width mode to auto so text fits its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');
```

Key styling options:

- **Font size** - Use sizes between 14-18px for subtle watermarks
- **Text color** - White or black depending on the image background
- **Opacity** - Values between 0.5-0.7 provide a balanced, semi-transparent appearance
- **Size mode** - Set to `'Auto'` so the block automatically fits its text content

### Positioning the Watermarks

We calculate the watermark positions based on the page dimensions and place the logo and text side-by-side at the bottom center of the page.

```typescript highlight=highlight-position-text-watermark
  // Position padding from edges
  const padding = 15;

  // Position text watermark at bottom-left
  engine.block.setPositionX(textWatermark, padding);
  engine.block.setPositionY(textWatermark, pageHeight - padding - 20);

  // Position logo watermark at top-right
  engine.block.setPositionX(logoWatermark, pageWidth - padding - logoWidth);
  engine.block.setPositionY(logoWatermark, padding);
```

We retrieve the rendered frame dimensions using `engine.block.getFrameWidth()` and `engine.block.getFrameHeight()`, calculate the total width of both watermarks with spacing, then center them horizontally. The vertical position places them near the bottom with padding from the edge.

## Creating Logo Watermarks

Logo watermarks use graphic blocks with image fills to display brand symbols or company logos.

```typescript highlight=highlight-create-logo-watermark
  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rect shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with a logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );

  // Apply the fill to the graphic block
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain the image within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');

  // Add to page
  engine.block.appendChild(page, logoWatermark);
```

We create a graphic block, assign a rect shape, then create an image fill with the logo URI. The fill is applied to the graphic block before adding it to the page.

### Sizing the Logo

We set fixed dimensions for the logo and apply opacity to match the text watermark.

```typescript highlight=highlight-size-logo-watermark
  // Size the logo watermark
  const logoWidth = 80;
  const logoHeight = 50;
  engine.block.setWidth(logoWatermark, logoWidth);
  engine.block.setHeight(logoWatermark, logoHeight);

  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.8);
```

A good rule is to size logos to 10-20% of the page width. This keeps them visible without dominating the design.

## Enhancing Visibility with Drop Shadows

Drop shadows improve watermark readability against varied backgrounds by adding contrast.

```typescript highlight=highlight-add-drop-shadow
  // Add drop shadow to text watermark for better visibility
  engine.block.setDropShadowEnabled(textWatermark, true);
  engine.block.setDropShadowOffsetX(textWatermark, 1);
  engine.block.setDropShadowOffsetY(textWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(textWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(textWatermark, 2);
  engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.5 });

  // Add drop shadow to logo watermark
  engine.block.setDropShadowEnabled(logoWatermark, true);
  engine.block.setDropShadowOffsetX(logoWatermark, 1);
  engine.block.setDropShadowOffsetY(logoWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(logoWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(logoWatermark, 2);
  engine.block.setDropShadowColor(logoWatermark, { r: 0, g: 0, b: 0, a: 0.5 });
```

Drop shadow parameters:

- **Offset X/Y** - Distance from the block (2-4 pixels works well)
- **Blur Radius X/Y** - Softness of the shadow (4-8 pixels for subtle effect)
- **Color** - Black with 0.5 alpha provides soft contrast without being harsh

## Exporting Watermarked Images

After adding watermarks, we export the complete page as an image file.

```typescript highlight=highlight-export-watermarked
  // Export the watermarked design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/watermarked-design.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported watermarked design to output/watermarked-design.png');
```

The `engine.block.export()` method returns a blob that can be downloaded or saved to disk. Supported formats include PNG, JPEG, and WebP.

## Cleanup

We must dispose the engine to free system resources when processing is complete.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

Always use a try-finally block to ensure the engine is disposed even if errors occur during processing.

## Troubleshooting

**Watermark not visible**

- Verify the block is within page bounds using position values
- Check opacity is between 0.3-1.0
- Ensure `engine.block.appendChild()` was called to add the block to the page

**Position appears incorrect**

- Recalculate positions using current `pageWidth` and `pageHeight`
- Account for watermark dimensions when calculating corner positions
- Remember that coordinates start from the top-left corner

**Text not legible**

- Increase font size to at least 36px
- Add a drop shadow for contrast against complex backgrounds
- Increase opacity if the watermark is too faint

**Logo quality issues**

- Use a higher resolution source image for the logo
- Avoid scaling the logo beyond its original dimensions

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.create(type)` | Create text or graphic blocks |
| `engine.block.createShape(type)` | Create shapes for graphic blocks |
| `engine.block.createFill(type)` | Create image fills for logos |
| `engine.block.setString(id, property, value)` | Set text content or image URI |
| `engine.block.setTextFontSize(id, size)` | Set text font size |
| `engine.block.setTextColor(id, color)` | Set text color |
| `engine.block.setOpacity(id, opacity)` | Set block transparency |
| `engine.block.setPositionX(id, value)` | Set horizontal position |
| `engine.block.setPositionY(id, value)` | Set vertical position |
| `engine.block.setWidth(id, value)` | Set block width |
| `engine.block.setHeight(id, value)` | Set block height |
| `engine.block.getFrameWidth(id)` | Get rendered frame width |
| `engine.block.getFrameHeight(id)` | Get rendered frame height |
| `engine.block.setDropShadowEnabled(id, enabled)` | Enable drop shadow |
| `engine.block.setDropShadowOffsetX(id, offset)` | Set shadow X offset |
| `engine.block.setDropShadowOffsetY(id, offset)` | Set shadow Y offset |
| `engine.block.setDropShadowBlurRadiusX(id, radius)` | Set shadow blur |
| `engine.block.setDropShadowColor(id, color)` | Set shadow color |
| `engine.block.export(id, options)` | Export block to blob |

## Next Steps

- [Text Styling](./text/styling.md) — Style text blocks with fonts, colors, and effects
- [Export Overview](./export-save-publish/export/overview.md) — Export options and formats for watermarked images
- [Crop Images](./edit-image/transform/crop.md) — Transform images before watermarking



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support