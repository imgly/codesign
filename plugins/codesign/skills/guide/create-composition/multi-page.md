> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Multi-Page Layouts](./create-composition/multi-page.md)

---

Create and manage multi-page designs programmatically using CE.SDK's headless engine for documents like brochures, presentations, and catalogs.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-multi-page-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-multi-page-server-js)

Multi-page layouts allow you to create documents with multiple artboards within a single scene. Each page operates as an independent canvas that can contain different content while sharing the same scene context. CE.SDK provides scene layout modes that automatically arrange pages vertically, horizontally, or in a free-form canvas.

```typescript file=@cesdk_web_examples/guides-create-composition-multi-page-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Multi-Page Layouts
 *
 * Demonstrates programmatic multi-page layout management:
 * - Creating scenes with multiple pages
 * - Adding and configuring pages
 * - Scene layout types (HorizontalStack)
 * - Stack spacing between pages
 * - Exporting multi-page designs
 */

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Create a scene with HorizontalStack layout
  engine.scene.create('HorizontalStack');

  // Get the stack container
  const [stack] = engine.block.findByType('stack');

  // Add spacing between pages (20 pixels in screen space)
  engine.block.setFloat(stack, 'stack/spacing', 20);
  engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

  // Create the first page
  const firstPage = engine.block.create('page');
  engine.block.setWidth(firstPage, 800);
  engine.block.setHeight(firstPage, 600);
  engine.block.appendChild(stack, firstPage);

  // Add content to the first page
  const imageBlock1 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: { width: 300, height: 200 } }
  );
  engine.block.setPositionX(imageBlock1, 250);
  engine.block.setPositionY(imageBlock1, 200);
  engine.block.appendChild(firstPage, imageBlock1);

  // Create a second page with different content
  const secondPage = engine.block.create('page');
  engine.block.setWidth(secondPage, 800);
  engine.block.setHeight(secondPage, 600);
  engine.block.appendChild(stack, secondPage);

  // Add a different image to the second page
  const imageBlock2 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 200 } }
  );
  engine.block.setPositionX(imageBlock2, 250);
  engine.block.setPositionY(imageBlock2, 200);
  engine.block.appendChild(secondPage, imageBlock2);

  // Export each page as a separate image
  mkdirSync('output', { recursive: true });
  const pages = engine.block.findByType('page');

  for (let i = 0; i < pages.length; i++) {
    const blob = await engine.block.export(pages[i], { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`output/page-${i + 1}.png`, buffer);
    console.log(`Exported page ${i + 1}`);
  }

  console.log('Multi-page layout example complete');
} finally {
  engine.dispose();
}
```

This guide covers how to create multi-page scenes, add pages, configure spacing, and export pages as individual images.

## Setting Up the Engine

First, initialize the CE.SDK engine in headless mode for server-side processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Creating Multi-Page Scenes

We can create scenes with multiple pages using the engine API. The scene acts as a container for pages, and each page can hold any number of content blocks.

### Creating a Scene with Pages

We create a new scene using `engine.scene.create()` and specify the layout type. The layout type determines how pages are arranged. After creating the scene, we get the stack container and create pages within it.

```typescript highlight=highlight-create-scene
  // Create a scene with HorizontalStack layout
  engine.scene.create('HorizontalStack');

  // Get the stack container
  const [stack] = engine.block.findByType('stack');

  // Add spacing between pages (20 pixels in screen space)
  engine.block.setFloat(stack, 'stack/spacing', 20);
  engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

  // Create the first page
  const firstPage = engine.block.create('page');
  engine.block.setWidth(firstPage, 800);
  engine.block.setHeight(firstPage, 600);
  engine.block.appendChild(stack, firstPage);
```

The scene is created with a `HorizontalStack` layout, meaning pages are arranged side by side from left to right. We then create a page, set its dimensions, and append it to the stack container.

### Configuring Page Spacing

We can add spacing between pages in a stack layout using the `stack/spacing` property. This creates visual separation between pages.

```typescript highlight=highlight-stack-spacing
// Add spacing between pages (20 pixels in screen space)
engine.block.setFloat(stack, 'stack/spacing', 20);
engine.block.setBool(stack, 'stack/spacingInScreenspace', true);
```

Setting `stack/spacingInScreenspace` to `true` means the spacing value is interpreted as screen pixels, maintaining consistent visual spacing regardless of zoom level.

The distinction applies to the canvas preview only. Exports always interpret the spacing in design units, whatever the property is set to.

Switching the property never converts the number. A spacing of `40` stays `40` and is reinterpreted in the other space, which changes how far apart the pages appear.

### Adding More Pages

To add additional pages, we create new page blocks, set their dimensions, and append them to the stack container.

```typescript highlight=highlight-add-page
  // Create a second page with different content
  const secondPage = engine.block.create('page');
  engine.block.setWidth(secondPage, 800);
  engine.block.setHeight(secondPage, 600);
  engine.block.appendChild(stack, secondPage);

  // Add a different image to the second page
  const imageBlock2 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 200 } }
  );
  engine.block.setPositionX(imageBlock2, 250);
  engine.block.setPositionY(imageBlock2, 200);
  engine.block.appendChild(secondPage, imageBlock2);
```

Each page can contain different content. Here we add different images to each page to demonstrate independent page content.

## Scene Layout Types

CE.SDK supports different layout modes that control how pages are arranged. You specify the layout type when creating the scene with `engine.scene.create()`.

**Free Layout** is the default where pages can be positioned anywhere. This provides complete control over page placement.

**VerticalStack Layout** arranges pages automatically in a vertical stack from top to bottom.

**HorizontalStack Layout** arranges pages side by side from left to right.

## Exporting Pages

We can export each page individually as an image file. This is useful for generating thumbnails, previews, or final output files.

```typescript highlight=highlight-export
  // Export each page as a separate image
  mkdirSync('output', { recursive: true });
  const pages = engine.block.findByType('page');

  for (let i = 0; i < pages.length; i++) {
    const blob = await engine.block.export(pages[i], { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`output/page-${i + 1}.png`, buffer);
    console.log(`Exported page ${i + 1}`);
  }
```

The export loop iterates through all pages and saves each one as a PNG file. You can also export to other formats like JPEG or PDF.

## Troubleshooting

**Page not visible after creation**: Ensure the page is attached to the stack with `appendChild()` and has valid dimensions set with `setWidth()` and `setHeight()`.

**Cannot add content to page**: Verify you're appending blocks to the page block, not the scene directly. Content blocks should be children of pages.

**Pages overlapping**: When using stack layouts, make sure pages are appended to the stack container (found via `findByType('stack')`), not directly to the scene.

**Spacing not visible**: Check that `stack/spacing` is set to a positive value and that you're using a stack layout (HorizontalStack or VerticalStack).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support