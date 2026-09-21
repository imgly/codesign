> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Pages](./concepts/pages.md)

---

Pages define the format of your designs—every graphic block, text element, and media file lives inside a page. This guide covers how pages fit into the scene hierarchy, their properties like margins and title templates, and how to configure page dimensions for different layout modes.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

Pages provide the canvas and frame for your designs. Whether you're building a multi-page document, a social media carousel, or a video composition, understanding how pages work will help you with structuring your content correctly.

```typescript file=@cesdk_web_examples/guides-concepts-pages-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

/**
 * CE.SDK Server Example: Pages Guide
 *
 * Demonstrates working with pages in CE.SDK:
 * - Understanding the scene hierarchy (Scene -> Pages -> Blocks)
 * - Creating and managing multiple pages
 * - Setting page dimensions at the scene level
 * - Configuring page properties (margins, title templates, fills)
 * - Navigating between pages
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with VerticalStack layout for multi-page designs
    engine.scene.create('VerticalStack');

    // Get the stack container to configure spacing
    const [stack] = engine.block.findByType('stack');
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Get the scene to set page dimensions
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    // Set page dimensions at the scene level (all pages share these dimensions)
    engine.block.setFloat(scene, 'scene/pageDimensions/width', 800);
    engine.block.setFloat(scene, 'scene/pageDimensions/height', 600);

    // Create the first page and set its dimensions
    const firstPage = engine.block.create('page');
    engine.block.setWidth(firstPage, 800);
    engine.block.setHeight(firstPage, 600);
    engine.block.appendChild(stack, firstPage);

    // Create the second page with the same dimensions
    const secondPage = engine.block.create('page');
    engine.block.setWidth(secondPage, 800);
    engine.block.setHeight(secondPage, 600);
    engine.block.appendChild(stack, secondPage);

    // Add an image block to the first page
    const imageBlock = engine.block.create('graphic');
    engine.block.appendChild(firstPage, imageBlock);

    // Create a rect shape for the graphic block
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Configure size and position after appending to the page
    engine.block.setWidth(imageBlock, 400);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    // Create and configure the image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    // Add a text block to the second page
    const textBlock = engine.block.create('text');
    engine.block.appendChild(secondPage, textBlock);

    // Configure text properties after appending to the page
    engine.block.replaceText(textBlock, 'Page 2');
    engine.block.setTextFontSize(textBlock, 48);
    engine.block.setTextColor(textBlock, { r: 0.2, g: 0.2, b: 0.2, a: 1.0 });
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Center the text on the page
    const textWidth = engine.block.getFrameWidth(textBlock);
    const textHeight = engine.block.getFrameHeight(textBlock);
    engine.block.setPositionX(textBlock, (800 - textWidth) / 2);
    engine.block.setPositionY(textBlock, (600 - textHeight) / 2);

    // Configure page properties on the first page
    // Enable and set margins for print bleed
    engine.block.setBool(firstPage, 'page/marginEnabled', true);
    engine.block.setFloat(firstPage, 'page/margin/top', 10);
    engine.block.setFloat(firstPage, 'page/margin/bottom', 10);
    engine.block.setFloat(firstPage, 'page/margin/left', 10);
    engine.block.setFloat(firstPage, 'page/margin/right', 10);

    // Set a custom title template for the first page
    engine.block.setString(firstPage, 'page/titleTemplate', 'Cover');

    // Set a custom title template for the second page
    engine.block.setString(secondPage, 'page/titleTemplate', 'Content');

    // Set a background fill on the second page
    const colorFill = engine.block.createFill('color');
    engine.block.setColor(colorFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(secondPage, colorFill);

    // Demonstrate finding pages
    const allPages = engine.scene.getPages();
    console.log('All pages:', allPages);
    console.log('Number of pages:', allPages.length);

    // Alternative: Find pages using block API
    const pagesByType = engine.block.findByType('page');
    console.log('Pages found by type:', pagesByType);

    // Export each page to demonstrate the result
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < allPages.length; i++) {
      const page = allPages[i];
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      const outputPath = `${outputDir}/page-${i + 1}.png`;
      writeFileSync(outputPath, buffer);
      console.log(`Exported: ${outputPath}`);
    }

    console.log('Pages guide completed with a 2-page design.');
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers:

- Understanding the scene hierarchy: Scene → Pages → Blocks
- Creating and managing multiple pages
- Setting page dimensions at the scene level
- Configuring page properties like margins and title templates
- Navigating between pages programmatically

## Pages in the Scene Hierarchy

In CE.SDK, content follows a strict hierarchy: a **scene** contains **pages**, and pages contain **content blocks**. Only blocks attached to a page are rendered on the canvas.

```typescript highlight=highlight-create-scene
    // Create a scene with VerticalStack layout for multi-page designs
    engine.scene.create('VerticalStack');

    // Get the stack container to configure spacing
    const [stack] = engine.block.findByType('stack');
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);
```

When you create a scene with a layout mode like `VerticalStack`, pages are automatically arranged according to that mode. Create pages using `engine.block.create('page')`, set their dimensions with `setWidth()` and `setHeight()`, then attach them to the scene (or its stack container) with `engine.block.appendChild()`.

```typescript highlight=highlight-create-pages
    // Create the first page and set its dimensions
    const firstPage = engine.block.create('page');
    engine.block.setWidth(firstPage, 800);
    engine.block.setHeight(firstPage, 600);
    engine.block.appendChild(stack, firstPage);

    // Create the second page with the same dimensions
    const secondPage = engine.block.create('page');
    engine.block.setWidth(secondPage, 800);
    engine.block.setHeight(secondPage, 600);
    engine.block.appendChild(stack, secondPage);
```

Content blocks must be added as children of a page to render. For graphic blocks, set both a shape and a fill for content to display. Append blocks to the page before configuring their properties.

```typescript highlight=highlight-add-content
    // Add an image block to the first page
    const imageBlock = engine.block.create('graphic');
    engine.block.appendChild(firstPage, imageBlock);

    // Create a rect shape for the graphic block
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Configure size and position after appending to the page
    engine.block.setWidth(imageBlock, 400);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    // Create and configure the image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    // Add a text block to the second page
    const textBlock = engine.block.create('text');
    engine.block.appendChild(secondPage, textBlock);

    // Configure text properties after appending to the page
    engine.block.replaceText(textBlock, 'Page 2');
    engine.block.setTextFontSize(textBlock, 48);
    engine.block.setTextColor(textBlock, { r: 0.2, g: 0.2, b: 0.2, a: 1.0 });
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Center the text on the page
    const textWidth = engine.block.getFrameWidth(textBlock);
    const textHeight = engine.block.getFrameHeight(textBlock);
    engine.block.setPositionX(textBlock, (800 - textWidth) / 2);
    engine.block.setPositionY(textBlock, (600 - textHeight) / 2);
```

## Page Dimensions and Consistency

The CE.SDK engine supports pages with different dimensions. When using stacked layout modes (VerticalStack, HorizontalStack), the Editor UI expects all pages to share the same size. However, with the `Free` layout mode, you can set different dimensions for each page in the UI.

```typescript highlight=highlight-set-dimensions
    // Get the scene to set page dimensions
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    // Set page dimensions at the scene level (all pages share these dimensions)
    engine.block.setFloat(scene, 'scene/pageDimensions/width', 800);
    engine.block.setFloat(scene, 'scene/pageDimensions/height', 600);
```

You can set default page dimensions at the scene level using `engine.block.setFloat()` with `scene/pageDimensions/width` and `scene/pageDimensions/height`. The `scene/aspectRatioLock` property controls whether changing one dimension automatically adjusts the other. Individual pages can also have their dimensions set directly with `setWidth()` and `setHeight()`.

## Finding and Navigating Pages

CE.SDK provides several methods to locate and navigate between pages in your scene.

```typescript highlight=highlight-find-pages
    // Demonstrate finding pages
    const allPages = engine.scene.getPages();
    console.log('All pages:', allPages);
    console.log('Number of pages:', allPages.length);

    // Alternative: Find pages using block API
    const pagesByType = engine.block.findByType('page');
    console.log('Pages found by type:', pagesByType);
```

Use these methods based on your needs:

- `engine.scene.getPages()` returns all pages in sorted order
- `engine.block.findByType('page')` finds all page blocks in the scene

## Page Properties

Each page has its own properties that control its appearance and behavior. These are set on the page block itself, not on the scene.

### Margins

Page margins define bleed areas useful for print designs. Enable margins and configure each side individually:

```typescript highlight=highlight-page-properties
    // Configure page properties on the first page
    // Enable and set margins for print bleed
    engine.block.setBool(firstPage, 'page/marginEnabled', true);
    engine.block.setFloat(firstPage, 'page/margin/top', 10);
    engine.block.setFloat(firstPage, 'page/margin/bottom', 10);
    engine.block.setFloat(firstPage, 'page/margin/left', 10);
    engine.block.setFloat(firstPage, 'page/margin/right', 10);

    // Set a custom title template for the first page
    engine.block.setString(firstPage, 'page/titleTemplate', 'Cover');

    // Set a custom title template for the second page
    engine.block.setString(secondPage, 'page/titleTemplate', 'Content');
```

Set `page/marginEnabled` to `true` to enable margins, then use `page/margin/top`, `page/margin/bottom`, `page/margin/left`, and `page/margin/right` to configure each side.

### Title Template

The `page/titleTemplate` property defines the display label shown for each page. It supports template variables like `{{ubq.page_index}}` for dynamic numbering.

The default value is `"Page {{ubq.page_index}}"`. You can customize this to show labels like "Slide 1", "Cover", or any custom text.

### Fill and Background

Pages support fills for background colors or images using the standard fill system.

```typescript highlight=highlight-page-background
// Set a background fill on the second page
const colorFill = engine.block.createFill('color');
engine.block.setColor(colorFill, 'fill/color/value', {
  r: 0.95,
  g: 0.95,
  b: 1.0,
  a: 1.0
});
engine.block.setFill(secondPage, colorFill);
```

Create a fill using `engine.block.createFill('color')` or `engine.block.createFill('image')`, configure its properties, then apply it to the page with `engine.block.setFill(page, fill)`.

## Page Layout Modes

The scene's layout mode controls how multiple pages are arranged. Set this using `engine.block.setEnum()` on the scene with the `scene/layout` property:

- **VerticalStack** (default): Pages stack vertically, one below the other
- **HorizontalStack**: Pages arrange horizontally, side by side
- **DepthStack**: Pages overlay each other, typically used for video editing
- **Free**: Pages can be positioned freely without automatic arrangement

## Pages for Static Designs vs. Video Editing

Page behavior varies depending on how the scene is used.

### Static Designs

For static designs, pages act like artboards. Each page is a separate canvas ideal for multi-page documents, social media posts, or print layouts. Pages exist side by side and don't have time-based properties.

### Video Editing

For video editing, pages represent time-based compositions that transition sequentially during playback. Each page has playback properties:

- `playback/duration` controls how long the page appears (in seconds)
- `playback/time` tracks the current playback position

## Cleanup

In server environments, always dispose the engine when finished to free resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Content Not Visible

If content blocks aren't appearing, check these common causes:

- Verify the block is attached to a page with `engine.block.appendChild(page, block)`
- For graphic blocks, ensure both a shape and fill are set
- Append blocks to the page before setting their size and position

### Dimension Inconsistencies

If pages appear at unexpected sizes when using stacked layouts, ensure all pages have consistent dimensions. With `Free` layout mode, pages can have different sizes. Set dimensions on individual pages using `setWidth()` and `setHeight()`.

### Page Not Found

If `engine.scene.getPages()` returns an empty array, ensure a scene is loaded first. In headless mode, you must create both the scene and pages manually before querying them.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support