> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Programmatic Creation](./create-composition/programmatic.md)

---

Build compositions entirely through code using CE.SDK's APIs for automation, batch processing, and headless rendering.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-programmatic-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-programmatic-server-js)

CE.SDK provides a complete API for building designs through code. In headless environments, you can create scenes, add blocks like text, images, and shapes, and position them programmatically. This enables server-side rendering, batch processing, and automated content generation without a browser.

```typescript file=@cesdk_web_examples/guides-create-composition-programmatic-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

/**
 * CE.SDK Server Guide: Programmatic Creation
 *
 * Demonstrates building compositions entirely through code:
 * - Creating scenes and pages with social media dimensions
 * - Setting page background colors
 * - Adding text blocks with mixed styling (bold, italic, colors)
 * - Adding line shapes as dividers
 * - Adding images
 * - Positioning and sizing blocks
 * - Exporting the composition
 */

// Roboto typeface with all variants for mixed styling
const ROBOTO_TYPEFACE = {
  name: 'Roboto',
  fonts: [
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf',
      subFamily: 'Regular',
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
      subFamily: 'Bold',
      weight: 'bold' as const,
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf',
      subFamily: 'Italic',
      style: 'italic' as const,
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf',
      subFamily: 'Bold Italic',
      weight: 'bold' as const,
      style: 'italic' as const,
    },
  ],
};

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  license: process.env.CESDK_LICENSE,
});

try {
  // Create a new scene with social media dimensions (1080x1080)
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1080, height: 1080 } },
  });

  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);

  const pages = engine.block.findByType('page');
  const page = pages[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Set page background to light lavender color
  const backgroundFill = engine.block.createFill('color');
  engine.block.setColor(backgroundFill, 'fill/color/value', {
    r: 0.94,
    g: 0.93,
    b: 0.98,
    a: 1.0,
  });
  engine.block.setFill(page, backgroundFill);

  // Add main headline text with bold Roboto font
  const headline = engine.block.create('text');
  engine.block.replaceText(
    headline,
    'Integrate\nCreative Editing\ninto your App'
  );
  engine.block.setFont(headline, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
  engine.block.setFloat(headline, 'text/lineHeight', 0.78);

  // Make headline bold
  if (engine.block.canToggleBoldFont(headline)) {
    engine.block.toggleBoldFont(headline);
  }
  engine.block.setTextColor(headline, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

  // Set fixed container size and enable automatic font sizing
  engine.block.setWidthMode(headline, 'Absolute');
  engine.block.setHeightMode(headline, 'Absolute');
  engine.block.setWidth(headline, 960);
  engine.block.setHeight(headline, 300);
  engine.block.setBool(headline, 'text/automaticFontSizeEnabled', true);

  engine.block.setPositionX(headline, 60);
  engine.block.setPositionY(headline, 80);
  engine.block.appendChild(page, headline);

  // Add tagline with mixed styling using range-based APIs
  // "in hours," (purple italic) + "not months." (black bold)
  const tagline = engine.block.create('text');
  const taglineText = 'in hours,\nnot months.';
  engine.block.replaceText(tagline, taglineText);

  // Set up Roboto typeface with all variants for mixed styling
  engine.block.setFont(tagline, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
  engine.block.setFloat(tagline, 'text/lineHeight', 0.78);

  // Style "in hours," - purple and italic (characters 0-9)
  engine.block.setTextColor(tagline, { r: 0.2, g: 0.2, b: 0.8, a: 1.0 }, 0, 9);
  if (engine.block.canToggleItalicFont(tagline, 0, 9)) {
    engine.block.toggleItalicFont(tagline, 0, 9);
  }

  // Style "not months." - black and bold (characters 10-21)
  engine.block.setTextColor(
    tagline,
    { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
    10,
    21
  );
  if (engine.block.canToggleBoldFont(tagline, 10, 21)) {
    engine.block.toggleBoldFont(tagline, 10, 21);
  }

  // Set fixed container size and enable automatic font sizing
  engine.block.setWidthMode(tagline, 'Absolute');
  engine.block.setHeightMode(tagline, 'Absolute');
  engine.block.setWidth(tagline, 960);
  engine.block.setHeight(tagline, 220);
  engine.block.setBool(tagline, 'text/automaticFontSizeEnabled', true);
  engine.block.setPositionX(tagline, 60);
  engine.block.setPositionY(tagline, 551);
  engine.block.appendChild(page, tagline);

  // Add CTA text "Start a Free Trial" with bold font
  const ctaTitle = engine.block.create('text');
  engine.block.replaceText(ctaTitle, 'Start a Free Trial');
  engine.block.setFont(ctaTitle, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
  engine.block.setFloat(ctaTitle, 'text/fontSize', 12);
  engine.block.setFloat(ctaTitle, 'text/lineHeight', 1.0);

  if (engine.block.canToggleBoldFont(ctaTitle)) {
    engine.block.toggleBoldFont(ctaTitle);
  }
  engine.block.setTextColor(ctaTitle, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

  engine.block.setWidthMode(ctaTitle, 'Absolute');
  engine.block.setHeightMode(ctaTitle, 'Auto');
  engine.block.setWidth(ctaTitle, 664.6);
  engine.block.setPositionX(ctaTitle, 64);
  engine.block.setPositionY(ctaTitle, 952);
  engine.block.appendChild(page, ctaTitle);

  // Add website URL with regular font
  const ctaUrl = engine.block.create('text');
  engine.block.replaceText(ctaUrl, 'www.img.ly');
  engine.block.setFont(ctaUrl, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
  engine.block.setFloat(ctaUrl, 'text/fontSize', 10);
  engine.block.setFloat(ctaUrl, 'text/lineHeight', 1.0);
  engine.block.setTextColor(ctaUrl, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

  engine.block.setWidthMode(ctaUrl, 'Absolute');
  engine.block.setHeightMode(ctaUrl, 'Auto');
  engine.block.setWidth(ctaUrl, 664.6);
  engine.block.setPositionX(ctaUrl, 64);
  engine.block.setPositionY(ctaUrl, 1006);
  engine.block.appendChild(page, ctaUrl);

  // Add horizontal divider line
  const dividerLine = engine.block.create('graphic');
  const lineShape = engine.block.createShape('line');
  engine.block.setShape(dividerLine, lineShape);

  const lineFill = engine.block.createFill('color');
  engine.block.setColor(lineFill, 'fill/color/value', {
    r: 0.0,
    g: 0.0,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setFill(dividerLine, lineFill);

  engine.block.setWidth(dividerLine, 418);
  engine.block.setHeight(dividerLine, 11.3);
  engine.block.setPositionX(dividerLine, 64);
  engine.block.setPositionY(dividerLine, 460);
  engine.block.appendChild(page, dividerLine);

  // Add IMG.LY logo image
  const logo = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logo, logoShape);

  const logoFill = engine.block.createFill('image');
  engine.block.setString(
    logoFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  engine.block.setFill(logo, logoFill);

  engine.block.setContentFillMode(logo, 'Contain');
  engine.block.setWidth(logo, 200);
  engine.block.setHeight(logo, 65);
  engine.block.setPositionX(logo, 820);
  engine.block.setPositionY(logo, 960);
  engine.block.appendChild(page, logo);

  // Export the composition to PNG
  const blob = await engine.block.export(page, {
    mimeType: 'image/png',
    targetWidth: 1080,
    targetHeight: 1080,
  });

  // Ensure output directory exists
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write the exported file
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = `${outputDir}/composition.png`;
  writeFileSync(outputPath, buffer);
  console.log(`Export complete: ${outputPath}`);
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('Engine disposed');
}
```

This guide covers how to create a scene structure with social media dimensions, set background colors, add text with mixed styling, line shapes, images, and export the finished composition.

## Initialize the Engine

We start by initializing the CE.SDK engine in headless mode using `@cesdk/node` (or the API-identical `@cesdk/node-native`):

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  license: process.env.CESDK_LICENSE,
});
```

## Create Scene Structure

We create the foundation of our composition with social media dimensions (1080x1080 pixels for Instagram). The `VerticalStack` layout option automatically handles page positioning.

```typescript highlight=highlight-create-scene
  // Create a new scene with social media dimensions (1080x1080)
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1080, height: 1080 } },
  });

  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);
```

We pass configuration options to set the page dimensions, then retrieve the page using `engine.block.findByType('page')`.

## Set Page Background

We set the page background using a color fill. This demonstrates how to create and assign fills to blocks.

```typescript highlight=highlight-add-background
// Set page background to light lavender color
const backgroundFill = engine.block.createFill('color');
engine.block.setColor(backgroundFill, 'fill/color/value', {
  r: 0.94,
  g: 0.93,
  b: 0.98,
  a: 1.0,
});
engine.block.setFill(page, backgroundFill);
```

We create a color fill using `createFill('color')`, set the color via `setColor()` with the `fill/color/value` property, then assign the fill to the page.

## Add Text Blocks

Text blocks allow you to add and style text content. We demonstrate three different approaches to text sizing and styling.

### Create Text and Set Content

Create a text block and set its content with `replaceText()`:

```typescript highlight=highlight-text-create
// Add main headline text with bold Roboto font
const headline = engine.block.create('text');
engine.block.replaceText(
  headline,
  'Integrate\nCreative Editing\ninto your App'
);
engine.block.setFont(headline, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
engine.block.setFloat(headline, 'text/lineHeight', 0.78);
```

### Style Entire Text Block

Apply styling to the entire text block using `toggleBoldFont()` and `setTextColor()`:

```typescript highlight=highlight-text-style-block
// Make headline bold
if (engine.block.canToggleBoldFont(headline)) {
  engine.block.toggleBoldFont(headline);
}
engine.block.setTextColor(headline, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });
```

### Enable Automatic Font Sizing

Configure the text block to automatically scale its font size to fit within fixed dimensions:

```typescript highlight=highlight-text-auto-size
// Set fixed container size and enable automatic font sizing
engine.block.setWidthMode(headline, 'Absolute');
engine.block.setHeightMode(headline, 'Absolute');
engine.block.setWidth(headline, 960);
engine.block.setHeight(headline, 300);
engine.block.setBool(headline, 'text/automaticFontSizeEnabled', true);
```

### Range-based Text Styling

Apply different styles to specific character ranges within a single text block:

```typescript highlight=highlight-text-range-style
  // Style "in hours," - purple and italic (characters 0-9)
  engine.block.setTextColor(tagline, { r: 0.2, g: 0.2, b: 0.8, a: 1.0 }, 0, 9);
  if (engine.block.canToggleItalicFont(tagline, 0, 9)) {
    engine.block.toggleItalicFont(tagline, 0, 9);
  }

  // Style "not months." - black and bold (characters 10-21)
  engine.block.setTextColor(
    tagline,
    { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
    10,
    21
  );
  if (engine.block.canToggleBoldFont(tagline, 10, 21)) {
    engine.block.toggleBoldFont(tagline, 10, 21);
  }
```

The range-based APIs accept start and end character indices:

- `setTextColor(id, color, from, to)` - Apply color to a specific character range
- `toggleBoldFont(id, from, to)` - Toggle bold styling for a range
- `toggleItalicFont(id, from, to)` - Toggle italic styling for a range

### Fixed Font Size

Set an explicit font size instead of using auto-sizing:

```typescript highlight=highlight-text-fixed-size
// Add CTA text "Start a Free Trial" with bold font
const ctaTitle = engine.block.create('text');
engine.block.replaceText(ctaTitle, 'Start a Free Trial');
engine.block.setFont(ctaTitle, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
engine.block.setFloat(ctaTitle, 'text/fontSize', 12);
engine.block.setFloat(ctaTitle, 'text/lineHeight', 1.0);
```

## Add Shapes

We create shapes using graphic blocks. CE.SDK supports `rect`, `line`, `ellipse`, `polygon`, `star`, and `vector_path` shapes.

### Create a Shape Block

Create a graphic block and assign a shape to it:

```typescript highlight=highlight-shape-create
// Add horizontal divider line
const dividerLine = engine.block.create('graphic');
const lineShape = engine.block.createShape('line');
engine.block.setShape(dividerLine, lineShape);
```

### Apply Fill to Shape

Create a color fill and apply it to the shape:

```typescript highlight=highlight-shape-fill
const lineFill = engine.block.createFill('color');
engine.block.setColor(lineFill, 'fill/color/value', {
  r: 0.0,
  g: 0.0,
  b: 0.0,
  a: 1.0,
});
engine.block.setFill(dividerLine, lineFill);
```

## Add Images

We add images using graphic blocks with image fills.

### Create an Image Block

Create a graphic block with a rect shape and an image fill:

```typescript highlight=highlight-image-create
  // Add IMG.LY logo image
  const logo = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logo, logoShape);

  const logoFill = engine.block.createFill('image');
  engine.block.setString(
    logoFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  engine.block.setFill(logo, logoFill);
```

We set the image URL via `setString()` with the `fill/image/imageFileURI` property.

## Position and Size Blocks

All blocks use the same positioning and sizing APIs:

```typescript highlight=highlight-block-position
engine.block.setContentFillMode(logo, 'Contain');
engine.block.setWidth(logo, 200);
engine.block.setHeight(logo, 65);
engine.block.setPositionX(logo, 820);
engine.block.setPositionY(logo, 960);
engine.block.appendChild(page, logo);
```

- `setWidth()` / `setHeight()` - Set block dimensions
- `setPositionX()` / `setPositionY()` - Set block position
- `setContentFillMode()` - Control how content fills the block (`Contain`, `Cover`, `Crop`)
- `appendChild()` - Add the block to the page hierarchy

## Export the Composition

We export the finished composition using the engine API.

### Export Using the Engine API

The `engine.block.export()` method exports a block as a blob:

```typescript highlight=highlight-export-api
// Export the composition to PNG
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1080,
  targetHeight: 1080,
});
```

### Write to File System

In headless environments, convert the blob to a buffer and write it to disk:

```typescript highlight=highlight-export-file
  // Ensure output directory exists
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write the exported file
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = `${outputDir}/composition.png`;
  writeFileSync(outputPath, buffer);
  console.log(`Export complete: ${outputPath}`);
```

## Clean Up Resources

Always dispose the engine when done to release resources:

```typescript highlight=highlight-cleanup
// Always dispose the engine when done
engine.dispose();
console.log('Engine disposed');
```

Using a `try/finally` block ensures the engine is disposed even if an error occurs during processing.

## Troubleshooting

- **Blocks not appearing**: Verify that `appendChild()` attaches blocks to the page. Blocks must be part of the scene hierarchy to render.
- **Text styling not applied**: Verify character indices are correct for range-based APIs. The indices are UTF-16 based.
- **Image stretched**: Use `setContentFillMode(block, 'Contain')` to maintain the image's aspect ratio.
- **Export fails**: Verify that page dimensions are set before export. The export requires valid dimensions.
- **Memory leaks**: Always call `engine.dispose()` when processing is complete, especially in long-running server processes.

## Next Steps

- [Layer Management](./create-composition/layer-management.md) - Control block stacking and organization
- [Positioning and Alignment](./create-composition/position-and-align.md) - Precise block placement
- [Group and Ungroup](./create-composition/group-and-ungroup.md) - Group blocks for unified transforms
- [Blend Modes](./create-composition/blend-modes.md) - Control how blocks interact visually
- [Export](./export-save-publish/export.md) - Export options and formats



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support