> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Create a Collage](./create-composition/collage.md)

---

Create collages in a headless Node.js environment by loading layout templates and transferring image content between scenes.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-collage-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-collage-server-js)

In server-side workflows, collages are created by loading a layout scene file that defines the visual structure, then transferring content from an existing scene into those positions. This approach enables batch processing of images into various collage formats.

```typescript file=@cesdk_web_examples/guides-create-composition-collage-server-js/server-js.ts reference-only
import CreativeEngine, { DesignBlockId } from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Create a Collage (Server/Node.js)
 *
 * This example demonstrates how to create collages programmatically:
 * 1. Creating a scene with images
 * 2. Loading a layout scene file
 * 3. Transferring content from the original scene to the layout
 * 4. Exporting the final collage
 */

// Sort blocks by visual position (top-to-bottom, left-to-right)
// This ensures consistent content mapping between layouts
function visuallySortBlocks(
  engine: CreativeEngine,
  blocks: DesignBlockId[]
): DesignBlockId[] {
  return blocks
    .map((block) => ({
      block,
      x: Math.round(engine.block.getPositionX(block)),
      y: Math.round(engine.block.getPositionY(block))
    }))
    .sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    })
    .map((item) => item.block);
}

// Recursively collect all descendant blocks
function getChildrenTree(
  engine: CreativeEngine,
  blockId: DesignBlockId
): DesignBlockId[] {
  const children = engine.block.getChildren(blockId);
  const result: DesignBlockId[] = [];
  for (const child of children) {
    result.push(child);
    result.push(...getChildrenTree(engine, child));
  }
  return result;
}

async function run() {
  let engine: CreativeEngine | undefined;

  try {
    const config = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');

    // Create a scene with images to arrange in a collage
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions for the collage
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1080);

    // Add sample images to the page
    const imageUrls = [
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(
        imageFill,
        'fill/image/imageFileURI',
        imageUrls[i]
      );
      engine.block.setFill(graphic, imageFill);

      // Position images in a simple grid (will be rearranged by layout)
      engine.block.setPositionX(graphic, (i % 2) * 540);
      engine.block.setPositionY(graphic, Math.floor(i / 2) * 540);
      engine.block.setWidth(graphic, 540);
      engine.block.setHeight(graphic, 540);

      engine.block.appendChild(page, graphic);
    }

    console.log(`✓ Scene created with ${imageUrls.length} images`);

    // Load a layout template that defines the collage structure
    // The layout contains positioned placeholder blocks
    const layoutUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_collage_1.scene';

    const layoutSceneString = await fetch(layoutUrl).then((res) => res.text());
    const layoutBlocks = await engine.block.loadFromString(layoutSceneString);
    const layoutPage = layoutBlocks[0];

    console.log('✓ Layout template loaded');

    // Collect image blocks from both pages
    const sourceBlocks = getChildrenTree(engine, page);
    const sourceImages = sourceBlocks.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedSourceImages = visuallySortBlocks(engine, sourceImages);

    const layoutChildren = getChildrenTree(engine, layoutPage);
    const layoutImages = layoutChildren.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedLayoutImages = visuallySortBlocks(engine, layoutImages);

    console.log(
      `✓ Found ${sortedSourceImages.length} source images, ${sortedLayoutImages.length} layout slots`
    );

    // Transfer image content from source to layout positions
    const transferCount = Math.min(
      sortedSourceImages.length,
      sortedLayoutImages.length
    );

    for (let i = 0; i < transferCount; i++) {
      const sourceBlock = sortedSourceImages[i];
      const targetBlock = sortedLayoutImages[i];

      // Get the source image fill
      const sourceFill = engine.block.getFill(sourceBlock);
      const targetFill = engine.block.getFill(targetBlock);

      // Transfer the image URI
      const imageUri = engine.block.getString(
        sourceFill,
        'fill/image/imageFileURI'
      );
      engine.block.setString(targetFill, 'fill/image/imageFileURI', imageUri);

      // Transfer source sets if present
      try {
        const sourceSet = engine.block.getSourceSet(
          sourceFill,
          'fill/image/sourceSet'
        );
        if (sourceSet.length > 0) {
          engine.block.setSourceSet(
            targetFill,
            'fill/image/sourceSet',
            sourceSet
          );
        }
      } catch {
        // Source set not available, skip
      }

      // Reset crop to fill the new frame dimensions
      engine.block.resetCrop(targetBlock);

      // Transfer placeholder behavior if supported
      if (engine.block.supportsPlaceholderBehavior(sourceBlock)) {
        engine.block.setPlaceholderBehaviorEnabled(
          targetBlock,
          engine.block.isPlaceholderBehaviorEnabled(sourceBlock)
        );
      }
    }

    console.log(`✓ Transferred ${transferCount} images to layout`);

    // Transfer text content (if both scenes have text blocks)
    const sourceTexts = sourceBlocks.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );
    const layoutTexts = layoutChildren.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );

    const sortedSourceTexts = visuallySortBlocks(engine, sourceTexts);
    const sortedLayoutTexts = visuallySortBlocks(engine, layoutTexts);

    const textTransferCount = Math.min(
      sortedSourceTexts.length,
      sortedLayoutTexts.length
    );

    for (let i = 0; i < textTransferCount; i++) {
      const sourceText = sortedSourceTexts[i];
      const targetText = sortedLayoutTexts[i];

      // Transfer text content
      const text = engine.block.getString(sourceText, 'text/text');
      engine.block.setString(targetText, 'text/text', text);

      // Transfer font
      const fontUri = engine.block.getString(sourceText, 'text/fontFileUri');
      const typeface = engine.block.getTypeface(sourceText);
      engine.block.setFont(targetText, fontUri, typeface);

      // Transfer text color
      const textColor = engine.block.getColor(sourceText, 'fill/solid/color');
      engine.block.setColor(targetText, 'fill/solid/color', textColor);
    }

    if (textTransferCount > 0) {
      console.log(`✓ Transferred ${textTransferCount} text blocks`);
    }

    // Export the final collage
    // Use the layout page dimensions for the export
    const layoutWidth = engine.block.getWidth(layoutPage);
    const layoutHeight = engine.block.getHeight(layoutPage);

    const blob = await engine.block.export(layoutPage, {
      mimeType: 'image/png',
      targetWidth: layoutWidth,
      targetHeight: layoutHeight
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('collage-output.png', buffer);
    console.log(
      `✓ Exported collage to collage-output.png (${layoutWidth}x${layoutHeight})`
    );

    // Clean up temporary blocks
    engine.block.destroy(page);
    console.log('✓ Cleanup completed');

    console.log('\n✓ Collage created successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Always dispose the engine
    engine?.dispose();
    console.log('\n✓ Engine disposed');
  }
}

// Run the example
run();
```

This guide covers how to load layout templates, implement visual sorting to map content between layouts, transfer images and text while preserving properties, and export the final collage.

## How Server-Side Collages Work

Server-side collage creation follows this workflow:

1. **Create a scene with images** — Load or create blocks containing your source images
2. **Load a layout template** — Fetch a scene file that defines the collage structure
3. **Sort blocks visually** — Order blocks by position for consistent mapping
4. **Transfer content** — Copy image URIs and text from source to layout positions
5. **Export the result** — Generate the final collage image

The layout template defines where images appear in the final output. By sorting blocks visually (top-to-bottom, left-to-right), content maps predictably between different layouts.

## Initialize the Engine

Start by initializing the headless engine.

```typescript highlight=highlight-setup
    const config = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');
```

## Create a Scene with Images

Create a scene containing the images you want to arrange in the collage. In production, you might load these from a database or API.

```typescript highlight=highlight-create-scene
    // Create a scene with images to arrange in a collage
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions for the collage
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1080);

    // Add sample images to the page
    const imageUrls = [
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(
        imageFill,
        'fill/image/imageFileURI',
        imageUrls[i]
      );
      engine.block.setFill(graphic, imageFill);

      // Position images in a simple grid (will be rearranged by layout)
      engine.block.setPositionX(graphic, (i % 2) * 540);
      engine.block.setPositionY(graphic, Math.floor(i / 2) * 540);
      engine.block.setWidth(graphic, 540);
      engine.block.setHeight(graphic, 540);

      engine.block.appendChild(page, graphic);
    }

    console.log(`✓ Scene created with ${imageUrls.length} images`);
```

## Load a Layout Template

Load a layout scene file that defines the collage structure. Layout templates contain positioned image blocks that serve as placeholders.

```typescript highlight=highlight-load-layout
    // Load a layout template that defines the collage structure
    // The layout contains positioned placeholder blocks
    const layoutUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_collage_1.scene';

    const layoutSceneString = await fetch(layoutUrl).then((res) => res.text());
    const layoutBlocks = await engine.block.loadFromString(layoutSceneString);
    const layoutPage = layoutBlocks[0];

    console.log('✓ Layout template loaded');
```

## Sort Blocks by Visual Position

Visual sorting ensures consistent content mapping regardless of the order blocks were created. Blocks are sorted top-to-bottom, then left-to-right.

```typescript highlight=highlight-visual-sort
// Sort blocks by visual position (top-to-bottom, left-to-right)
// This ensures consistent content mapping between layouts
function visuallySortBlocks(
  engine: CreativeEngine,
  blocks: DesignBlockId[]
): DesignBlockId[] {
  return blocks
    .map((block) => ({
      block,
      x: Math.round(engine.block.getPositionX(block)),
      y: Math.round(engine.block.getPositionY(block))
    }))
    .sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    })
    .map((item) => item.block);
}
```

## Collect Blocks from Both Scenes

Recursively collect all descendant blocks, then filter by type to separate images from other content.

```typescript highlight=highlight-collect-blocks
    // Collect image blocks from both pages
    const sourceBlocks = getChildrenTree(engine, page);
    const sourceImages = sourceBlocks.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedSourceImages = visuallySortBlocks(engine, sourceImages);

    const layoutChildren = getChildrenTree(engine, layoutPage);
    const layoutImages = layoutChildren.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedLayoutImages = visuallySortBlocks(engine, layoutImages);

    console.log(
      `✓ Found ${sortedSourceImages.length} source images, ${sortedLayoutImages.length} layout slots`
    );
```

## Transfer Image Content

Copy image URIs and source sets from source blocks to layout positions. Reset the crop on each target block so images fill their new frames.

```typescript highlight=highlight-transfer-images
    // Transfer image content from source to layout positions
    const transferCount = Math.min(
      sortedSourceImages.length,
      sortedLayoutImages.length
    );

    for (let i = 0; i < transferCount; i++) {
      const sourceBlock = sortedSourceImages[i];
      const targetBlock = sortedLayoutImages[i];

      // Get the source image fill
      const sourceFill = engine.block.getFill(sourceBlock);
      const targetFill = engine.block.getFill(targetBlock);

      // Transfer the image URI
      const imageUri = engine.block.getString(
        sourceFill,
        'fill/image/imageFileURI'
      );
      engine.block.setString(targetFill, 'fill/image/imageFileURI', imageUri);

      // Transfer source sets if present
      try {
        const sourceSet = engine.block.getSourceSet(
          sourceFill,
          'fill/image/sourceSet'
        );
        if (sourceSet.length > 0) {
          engine.block.setSourceSet(
            targetFill,
            'fill/image/sourceSet',
            sourceSet
          );
        }
      } catch {
        // Source set not available, skip
      }

      // Reset crop to fill the new frame dimensions
      engine.block.resetCrop(targetBlock);

      // Transfer placeholder behavior if supported
      if (engine.block.supportsPlaceholderBehavior(sourceBlock)) {
        engine.block.setPlaceholderBehaviorEnabled(
          targetBlock,
          engine.block.isPlaceholderBehaviorEnabled(sourceBlock)
        );
      }
    }

    console.log(`✓ Transferred ${transferCount} images to layout`);
```

**Key methods:**

- `getFill()` and `setString()` — Transfer the image URI between fills
- `getSourceSet()` and `setSourceSet()` — Preserve responsive image variants
- `resetCrop()` — Adjust the image crop to fill the new frame dimensions
- `supportsPlaceholderBehavior()` — Check and transfer placeholder settings

## Transfer Text Content

If both scenes contain text blocks, transfer text content, fonts, and colors in visual order.

```typescript highlight=highlight-transfer-text
    // Transfer text content (if both scenes have text blocks)
    const sourceTexts = sourceBlocks.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );
    const layoutTexts = layoutChildren.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );

    const sortedSourceTexts = visuallySortBlocks(engine, sourceTexts);
    const sortedLayoutTexts = visuallySortBlocks(engine, layoutTexts);

    const textTransferCount = Math.min(
      sortedSourceTexts.length,
      sortedLayoutTexts.length
    );

    for (let i = 0; i < textTransferCount; i++) {
      const sourceText = sortedSourceTexts[i];
      const targetText = sortedLayoutTexts[i];

      // Transfer text content
      const text = engine.block.getString(sourceText, 'text/text');
      engine.block.setString(targetText, 'text/text', text);

      // Transfer font
      const fontUri = engine.block.getString(sourceText, 'text/fontFileUri');
      const typeface = engine.block.getTypeface(sourceText);
      engine.block.setFont(targetText, fontUri, typeface);

      // Transfer text color
      const textColor = engine.block.getColor(sourceText, 'fill/solid/color');
      engine.block.setColor(targetText, 'fill/solid/color', textColor);
    }

    if (textTransferCount > 0) {
      console.log(`✓ Transferred ${textTransferCount} text blocks`);
    }
```

## Export the Collage

Export the layout page with the transferred content. The output dimensions match the layout template.

```typescript highlight=highlight-export
    // Export the final collage
    // Use the layout page dimensions for the export
    const layoutWidth = engine.block.getWidth(layoutPage);
    const layoutHeight = engine.block.getHeight(layoutPage);

    const blob = await engine.block.export(layoutPage, {
      mimeType: 'image/png',
      targetWidth: layoutWidth,
      targetHeight: layoutHeight
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('collage-output.png', buffer);
    console.log(
      `✓ Exported collage to collage-output.png (${layoutWidth}x${layoutHeight})`
    );
```

## Clean Up

Destroy temporary blocks and dispose of the engine when finished.

```typescript highlight=highlight-cleanup
// Clean up temporary blocks
engine.block.destroy(page);
console.log('✓ Cleanup completed');
```

## Handling Mismatched Slot Counts

When the source has more images than the layout has slots, extra images are ignored. When the layout has more slots, some remain empty or keep their placeholder content.

```typescript
// Transfer only as many images as both sides support
const transferCount = Math.min(
  sortedSourceImages.length,
  sortedLayoutImages.length
);
```

For production use, consider:

- Selecting layouts based on image count
- Filling empty slots with placeholder images
- Prioritizing images by metadata or user selection

## Troubleshooting

### Images Not Appearing in Layout

Verify the layout template contains image blocks with the correct kind. Check that `engine.block.getKind(id)` returns `'image'` for your target blocks.

### Content in Wrong Positions

Visual sorting depends on block coordinates. If blocks have identical Y positions, they sort by X. Ensure layout templates have distinct positions for each slot.

### Source Sets Not Transferring

Not all image fills have source sets. Wrap the transfer in a try-catch to handle blocks without this property.

### Layout Template Not Loading

Check that the layout URL is accessible from your server environment. In production, host layout templates on your own infrastructure or use a CDN.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.scene.create()` | Scene | Create an empty scene |
| `engine.block.create()` | Block | Create blocks of various types |
| `engine.block.createFill()` | Fill | Create fill objects for blocks |
| `engine.block.setFill()` | Fill | Assign a fill to a block |
| `engine.block.getFill()` | Fill | Get the fill assigned to a block |
| `engine.block.loadFromString()` | Import | Load blocks from a scene string |
| `engine.block.getChildren()` | Hierarchy | Get direct children of a block |
| `engine.block.appendChild()` | Hierarchy | Add a child to a block |
| `engine.block.getKind()` | Property | Get the semantic kind of a block |
| `engine.block.getType()` | Property | Get the type of a block |
| `engine.block.getPositionX()` | Layout | Get X position of a block |
| `engine.block.getPositionY()` | Layout | Get Y position of a block |
| `engine.block.getString()` | Property | Get string property value |
| `engine.block.setString()` | Property | Set string property value |
| `engine.block.getSourceSet()` | Fill | Get image source set |
| `engine.block.setSourceSet()` | Fill | Set image source set |
| `engine.block.resetCrop()` | Crop | Reset crop to fill frame |
| `engine.block.supportsPlaceholderBehavior()` | Placeholder | Check placeholder support |
| `engine.block.isPlaceholderBehaviorEnabled()` | Placeholder | Check if placeholder is enabled |
| `engine.block.setPlaceholderBehaviorEnabled()` | Placeholder | Enable/disable placeholder |
| `engine.block.getTypeface()` | Text | Get typeface of a text block |
| `engine.block.setFont()` | Text | Set font for a text block |
| `engine.block.getColor()` | Property | Get color property value |
| `engine.block.setColor()` | Property | Set color property value |
| `engine.block.getWidth()` | Layout | Get width of a block |
| `engine.block.getHeight()` | Layout | Get height of a block |
| `engine.block.export()` | Export | Export a block to an image |
| `engine.block.destroy()` | Lifecycle | Destroy a block |
| `engine.dispose()` | Lifecycle | Clean up engine resources |

## Related Guides

- [Apply Templates](./use-templates/apply-template.md) — Loading complete templates instead of transferring content
- [Headless Mode](./concepts/headless-mode.md) — Server-side processing fundamentals
- [Export Overview](./export-save-publish/export/overview.md) — Export options and formats



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support