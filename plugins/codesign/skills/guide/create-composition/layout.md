> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Design a Layout](./create-composition/layout.md)

---

Create automatic stack layouts in CE.SDK that arrange pages vertically or horizontally with consistent spacing. Build structured compositions like collages, catalogs, or carousels without manually positioning each element.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-layout-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-layout-server-js)

CE.SDK provides stack layouts that automatically arrange pages with consistent spacing. Vertical stacks arrange pages top-to-bottom, horizontal stacks arrange left-to-right. This eliminates manual positioning for compositions like photo collages, product catalogs, social media carousels, and magazine layouts.

```typescript file=@cesdk_web_examples/guides-create-composition-layout-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Design a Layout
 *
 * Demonstrates:
 * - Creating vertical stack layouts (top-to-bottom arrangement)
 * - Creating horizontal stack layouts (left-to-right arrangement)
 * - Adding blocks to stacks for automatic positioning
 * - Configuring spacing between stacked blocks
 * - Reordering blocks within stacks
 * - Switching between stack and free layouts
 * - Building a practical photo collage example
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // ===== VERTICAL STACK LAYOUT =====
  console.log('--- Vertical Stack Layout ---');

  // Create a scene with vertical stack layout
  // Pages and blocks will arrange top-to-bottom automatically
  const verticalScene = engine.scene.create('VerticalStack');
  console.log('Created VerticalStack scene:', verticalScene);

  // Get the stack container to add pages
  const [stack] = engine.block.findByType('stack');

  // Create first page
  const page1 = engine.block.create('page');
  engine.block.setWidth(page1, 400);
  engine.block.setHeight(page1, 300);
  engine.block.appendChild(stack, page1);

  // Create second page - appears below page1
  const page2 = engine.block.create('page');
  engine.block.setWidth(page2, 400);
  engine.block.setHeight(page2, 300);
  engine.block.appendChild(stack, page2);

  // Configure spacing between stacked pages (in screen space pixels)
  engine.block.setFloat(stack, 'stack/spacing', 20);
  engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

  const spacing = engine.block.getFloat(stack, 'stack/spacing');
  console.log(`Stack spacing: ${spacing}px`);

  // ===== HORIZONTAL STACK LAYOUT =====
  console.log('\n--- Horizontal Stack Layout ---');

  // Switch to horizontal stack layout
  // Pages will now arrange left-to-right
  engine.scene.setLayout('HorizontalStack');
  console.log('Changed to HorizontalStack layout');

  // Verify the layout change
  const currentLayout = engine.scene.getLayout();
  console.log('Current layout:', currentLayout);

  // Pages are automatically rearranged horizontally
  // Useful for carousels, timelines, or horizontal galleries

  // ===== ADD BLOCKS TO PAGES =====
  console.log('\n--- Adding Blocks to Pages ---');

  // Add graphic blocks to each page
  // Blocks must have a shape and fill to be visible

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image block to page 1
  const block1 = await engine.block.addImage(imageUri, {
    size: { width: 350, height: 250 }
  });
  engine.block.setPositionX(block1, 25);
  engine.block.setPositionY(block1, 25);
  engine.block.appendChild(page1, block1);
  console.log('Added image block to page 1');

  // Add a colored rectangle to page 2
  const block2 = engine.block.create('graphic');
  const shape2 = engine.block.createShape('rect');
  engine.block.setShape(block2, shape2);
  engine.block.setWidth(block2, 350);
  engine.block.setHeight(block2, 250);
  engine.block.setPositionX(block2, 25);
  engine.block.setPositionY(block2, 25);
  const fill2 = engine.block.createFill('color');
  engine.block.setColor(fill2, 'fill/color/value', {
    r: 0.3,
    g: 0.6,
    b: 0.9,
    a: 1.0
  });
  engine.block.setFill(block2, fill2);
  engine.block.appendChild(page2, block2);
  console.log('Added colored block to page 2');

  // ===== ADD NEW PAGE TO EXISTING STACK =====
  console.log('\n--- Adding Page to Existing Stack ---');

  // Add a new page to the existing stack layout
  // The page automatically appears at the end of the stack
  const page3 = engine.block.create('page');
  engine.block.setWidth(page3, 400);
  engine.block.setHeight(page3, 300);
  engine.block.appendChild(stack, page3);
  console.log('Added page 3 to stack');

  // Add content to page 3
  const block3 = engine.block.create('graphic');
  const shape3 = engine.block.createShape('rect');
  engine.block.setShape(block3, shape3);
  engine.block.setWidth(block3, 350);
  engine.block.setHeight(block3, 250);
  engine.block.setPositionX(block3, 25);
  engine.block.setPositionY(block3, 25);
  const fill3 = engine.block.createFill('color');
  engine.block.setColor(fill3, 'fill/color/value', {
    r: 0.9,
    g: 0.5,
    b: 0.3,
    a: 1.0
  });
  engine.block.setFill(block3, fill3);
  engine.block.appendChild(page3, block3);

  // Count pages in stack
  const pages = engine.block.getChildren(stack);
  console.log(`Stack now has ${pages.length} pages`);

  // ===== REORDER PAGES IN STACK =====
  console.log('\n--- Reordering Pages ---');

  // Reorder pages using insertChild
  // Move page3 to the first position (index 0)
  engine.block.insertChild(stack, page3, 0);
  console.log('Moved page 3 to first position');

  // Verify the new order by listing children
  const reorderedPages = engine.block.getChildren(stack);
  console.log('Page order after reordering:', reorderedPages);

  // ===== CHANGE STACK SPACING =====
  console.log('\n--- Changing Stack Spacing ---');

  // Update spacing between stacked pages
  engine.block.setFloat(stack, 'stack/spacing', 40);
  const newSpacing = engine.block.getFloat(stack, 'stack/spacing');
  console.log(`Updated stack spacing to: ${newSpacing}px`);

  // Spacing updates immediately - pages reposition automatically

  // ===== SWITCH TO FREE LAYOUT =====
  console.log('\n--- Switching to Free Layout ---');

  // Check current layout type
  const layoutBefore = engine.scene.getLayout();
  console.log('Current layout:', layoutBefore);

  // Convert to free layout for manual positioning
  engine.scene.setLayout('Free');
  console.log('Switched to Free layout');

  // In free layout, pages keep their positions but stop auto-arranging
  // Now you can position pages manually
  const [firstPage] = engine.block.findByType('page');
  engine.block.setPositionX(firstPage, 50);
  engine.block.setPositionY(firstPage, 50);
  console.log('Manually positioned first page');

  // Verify layout change
  const layoutAfter = engine.scene.getLayout();
  console.log('Layout after switch:', layoutAfter);

  // ===== PHOTO COLLAGE EXAMPLE =====
  console.log('\n--- Photo Collage Example ---');

  // Create a new vertical stack scene for a photo collage
  engine.scene.create('VerticalStack', {
    page: { size: { width: 600, height: 200 } }
  });

  // Get the new stack
  const [collageStack] = engine.block.findByType('stack');

  // Set tight spacing for collage effect
  engine.block.setFloat(collageStack, 'stack/spacing', 10);
  engine.block.setBool(collageStack, 'stack/spacingInScreenspace', true);

  // Get the first page created with the scene
  const [collagePage1] = engine.block.findByType('page');

  // Create additional pages for the collage
  const collagePage2 = engine.block.create('page');
  engine.block.setWidth(collagePage2, 600);
  engine.block.setHeight(collagePage2, 200);
  engine.block.appendChild(collageStack, collagePage2);

  const collagePage3 = engine.block.create('page');
  engine.block.setWidth(collagePage3, 600);
  engine.block.setHeight(collagePage3, 200);
  engine.block.appendChild(collageStack, collagePage3);

  // Add images to each collage page
  const imageUrls = [
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    'https://img.ly/static/ubq_samples/sample_3.jpg'
  ];

  const collagePages = [collagePage1, collagePage2, collagePage3];

  for (let i = 0; i < collagePages.length; i++) {
    const photoBlock = await engine.block.addImage(imageUrls[i], {
      size: { width: 580, height: 180 }
    });
    engine.block.setPositionX(photoBlock, 10);
    engine.block.setPositionY(photoBlock, 10);
    engine.block.appendChild(collagePages[i], photoBlock);
  }

  console.log('Created photo collage with 3 images');

  // Export the collage result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(collagePage1, {
    mimeType: 'image/png'
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/layout-collage.png`, buffer);

  console.log('\nExported collage to output/layout-collage.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to create vertical and horizontal stack layouts, add pages to stacks, configure spacing, reorder pages, and switch between automatic and manual positioning modes.

## Setting Up the Engine

We initialize the headless CE.SDK engine for server-side layout operations.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Create a Vertical Stack Layout

Vertical stack layouts arrange pages from top to bottom. When you add pages to the stack, they automatically position below each other with the configured spacing.

```typescript highlight=highlight-vertical-stack
  // Create a scene with vertical stack layout
  // Pages and blocks will arrange top-to-bottom automatically
  const verticalScene = engine.scene.create('VerticalStack');
  console.log('Created VerticalStack scene:', verticalScene);

  // Get the stack container to add pages
  const [stack] = engine.block.findByType('stack');

  // Create first page
  const page1 = engine.block.create('page');
  engine.block.setWidth(page1, 400);
  engine.block.setHeight(page1, 300);
  engine.block.appendChild(stack, page1);

  // Create second page - appears below page1
  const page2 = engine.block.create('page');
  engine.block.setWidth(page2, 400);
  engine.block.setHeight(page2, 300);
  engine.block.appendChild(stack, page2);

  // Configure spacing between stacked pages (in screen space pixels)
  engine.block.setFloat(stack, 'stack/spacing', 20);
  engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

  const spacing = engine.block.getFloat(stack, 'stack/spacing');
  console.log(`Stack spacing: ${spacing}px`);
```

Pages added with `appendChild` appear at the bottom of the stack. The `stack/spacing` property controls the gap between pages, and `stack/spacingInScreenspace` determines whether spacing is in screen pixels or design units.

The distinction applies to the canvas preview only. Exports always interpret the spacing in design units, whatever the property is set to.

Switching the property never converts the number. A spacing of `40` stays `40` and is reinterpreted in the other space, which changes how far apart the pages appear.

## Create a Horizontal Stack Layout

Horizontal stack layouts arrange pages from left to right. Switch between layout types using `engine.scene.setLayout()`.

```typescript highlight=highlight-horizontal-stack
  // Switch to horizontal stack layout
  // Pages will now arrange left-to-right
  engine.scene.setLayout('HorizontalStack');
  console.log('Changed to HorizontalStack layout');

  // Verify the layout change
  const currentLayout = engine.scene.getLayout();
  console.log('Current layout:', currentLayout);

  // Pages are automatically rearranged horizontally
  // Useful for carousels, timelines, or horizontal galleries
```

Horizontal layouts are useful for carousels, timelines, or horizontal galleries. The same spacing configuration applies—pages automatically reposition when you change the layout type.

## Add Blocks to Pages

Once you have pages in your stack, add graphic blocks to display content. Each block needs a shape and fill to be visible.

```typescript highlight=highlight-add-blocks
  // Add graphic blocks to each page
  // Blocks must have a shape and fill to be visible

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image block to page 1
  const block1 = await engine.block.addImage(imageUri, {
    size: { width: 350, height: 250 }
  });
  engine.block.setPositionX(block1, 25);
  engine.block.setPositionY(block1, 25);
  engine.block.appendChild(page1, block1);
  console.log('Added image block to page 1');

  // Add a colored rectangle to page 2
  const block2 = engine.block.create('graphic');
  const shape2 = engine.block.createShape('rect');
  engine.block.setShape(block2, shape2);
  engine.block.setWidth(block2, 350);
  engine.block.setHeight(block2, 250);
  engine.block.setPositionX(block2, 25);
  engine.block.setPositionY(block2, 25);
  const fill2 = engine.block.createFill('color');
  engine.block.setColor(fill2, 'fill/color/value', {
    r: 0.3,
    g: 0.6,
    b: 0.9,
    a: 1.0
  });
  engine.block.setFill(block2, fill2);
  engine.block.appendChild(page2, block2);
  console.log('Added colored block to page 2');
```

Position blocks within their parent page using `setPositionX()` and `setPositionY()`. The block's position is relative to the page's top-left corner.

## Add Pages to an Existing Stack

After creating a composition, you can add more pages to the stack. New pages automatically appear at the end.

```typescript highlight=highlight-add-page
  // Add a new page to the existing stack layout
  // The page automatically appears at the end of the stack
  const page3 = engine.block.create('page');
  engine.block.setWidth(page3, 400);
  engine.block.setHeight(page3, 300);
  engine.block.appendChild(stack, page3);
  console.log('Added page 3 to stack');

  // Add content to page 3
  const block3 = engine.block.create('graphic');
  const shape3 = engine.block.createShape('rect');
  engine.block.setShape(block3, shape3);
  engine.block.setWidth(block3, 350);
  engine.block.setHeight(block3, 250);
  engine.block.setPositionX(block3, 25);
  engine.block.setPositionY(block3, 25);
  const fill3 = engine.block.createFill('color');
  engine.block.setColor(fill3, 'fill/color/value', {
    r: 0.9,
    g: 0.5,
    b: 0.3,
    a: 1.0
  });
  engine.block.setFill(block3, fill3);
  engine.block.appendChild(page3, block3);

  // Count pages in stack
  const pages = engine.block.getChildren(stack);
  console.log(`Stack now has ${pages.length} pages`);
```

Use `getChildren()` to see all pages in the stack. The insertion order determines the visual order in the layout.

## Reorder Pages in the Stack

Change the position of pages using `insertChild()`. This lets you move pages to any position in the stack.

```typescript highlight=highlight-reorder
  // Reorder pages using insertChild
  // Move page3 to the first position (index 0)
  engine.block.insertChild(stack, page3, 0);
  console.log('Moved page 3 to first position');

  // Verify the new order by listing children
  const reorderedPages = engine.block.getChildren(stack);
  console.log('Page order after reordering:', reorderedPages);
```

The second parameter specifies the target index. Index 0 places the page first, and higher indices move it further down (or right in horizontal layouts).

## Change Stack Spacing

Adjust the spacing between pages at any time. Changes apply immediately and pages reposition automatically.

```typescript highlight=highlight-spacing
  // Update spacing between stacked pages
  engine.block.setFloat(stack, 'stack/spacing', 40);
  const newSpacing = engine.block.getFloat(stack, 'stack/spacing');
  console.log(`Updated stack spacing to: ${newSpacing}px`);

  // Spacing updates immediately - pages reposition automatically
```

Use `getFloat()` to read the current spacing value. Larger spacing creates more separation between pages; zero spacing creates a seamless grid.

## Switch to Free Layout

Stack layouts automatically position pages. For manual control, switch to Free layout.

```typescript highlight=highlight-free-layout
  // Check current layout type
  const layoutBefore = engine.scene.getLayout();
  console.log('Current layout:', layoutBefore);

  // Convert to free layout for manual positioning
  engine.scene.setLayout('Free');
  console.log('Switched to Free layout');

  // In free layout, pages keep their positions but stop auto-arranging
  // Now you can position pages manually
  const [firstPage] = engine.block.findByType('page');
  engine.block.setPositionX(firstPage, 50);
  engine.block.setPositionY(firstPage, 50);
  console.log('Manually positioned first page');

  // Verify layout change
  const layoutAfter = engine.scene.getLayout();
  console.log('Layout after switch:', layoutAfter);
```

In Free layout, pages keep their current positions but stop auto-arranging. You can then use `setPositionX()` and `setPositionY()` to position pages manually.

## Build a Photo Collage

This practical example creates a vertical photo collage with three images and tight spacing.

```typescript highlight=highlight-collage
  // Create a new vertical stack scene for a photo collage
  engine.scene.create('VerticalStack', {
    page: { size: { width: 600, height: 200 } }
  });

  // Get the new stack
  const [collageStack] = engine.block.findByType('stack');

  // Set tight spacing for collage effect
  engine.block.setFloat(collageStack, 'stack/spacing', 10);
  engine.block.setBool(collageStack, 'stack/spacingInScreenspace', true);

  // Get the first page created with the scene
  const [collagePage1] = engine.block.findByType('page');

  // Create additional pages for the collage
  const collagePage2 = engine.block.create('page');
  engine.block.setWidth(collagePage2, 600);
  engine.block.setHeight(collagePage2, 200);
  engine.block.appendChild(collageStack, collagePage2);

  const collagePage3 = engine.block.create('page');
  engine.block.setWidth(collagePage3, 600);
  engine.block.setHeight(collagePage3, 200);
  engine.block.appendChild(collageStack, collagePage3);

  // Add images to each collage page
  const imageUrls = [
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    'https://img.ly/static/ubq_samples/sample_3.jpg'
  ];

  const collagePages = [collagePage1, collagePage2, collagePage3];

  for (let i = 0; i < collagePages.length; i++) {
    const photoBlock = await engine.block.addImage(imageUrls[i], {
      size: { width: 580, height: 180 }
    });
    engine.block.setPositionX(photoBlock, 10);
    engine.block.setPositionY(photoBlock, 10);
    engine.block.appendChild(collagePages[i], photoBlock);
  }

  console.log('Created photo collage with 3 images');
```

The collage uses a vertical stack with 10px spacing. Each page contains an image that fills most of the page area, creating a cohesive photo strip effect.

## Exporting the Result

After building the layout, export pages as images to verify the composition.

```typescript highlight=highlight-export
  // Export the collage result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(collagePage1, {
    mimeType: 'image/png'
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/layout-collage.png`, buffer);

  console.log('\nExported collage to output/layout-collage.png');
```

## Troubleshooting

**Pages not arranging automatically**: Verify the scene layout type is `VerticalStack` or `HorizontalStack` using `engine.scene.getLayout()`.

**Spacing not applying**: Check the spacing value with `engine.block.getFloat(stack, 'stack/spacing')`. Ensure you're setting spacing on the stack block, not the scene.

**Pages overlapping**: Ensure pages are direct children of the stack block. Use `engine.block.findByType('stack')` to get the correct parent.

**Can't position pages manually**: Stack layouts override manual positions. Switch to `Free` layout with `engine.scene.setLayout('Free')`.

**Wrong page order**: Child order determines visual position. Use `insertChild(stack, page, index)` to move pages to specific positions.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create(layout, options)` | Create a scene with specified layout type |
| `engine.scene.getLayout()` | Get the current scene layout type |
| `engine.scene.setLayout(layout)` | Change the scene layout type |
| `engine.block.findByType('stack')` | Find the stack container block |
| `engine.block.setFloat(id, 'stack/spacing', value)` | Set spacing between stacked pages |
| `engine.block.getFloat(id, 'stack/spacing')` | Get current spacing value |
| `engine.block.setBool(id, 'stack/spacingInScreenspace', value)` | Set whether spacing is in screen pixels |
| `engine.block.appendChild(parent, child)` | Add page to stack (positions automatically) |
| `engine.block.insertChild(parent, child, index)` | Insert page at specific position in stack |
| `engine.block.getChildren(id)` | Get all child pages of a stack |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support