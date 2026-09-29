> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Insert Media Assets](./insert-media.md) > [Insert Images](./insert-media/images.md)

---

Insert images into your designs programmatically using CE.SDK's image APIs in a headless Node.js environment.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-insert-media-images-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-insert-media-images-server-js)

Images in CE.SDK are graphic blocks with image fills attached. The engine supports multiple image formats including PNG, JPEG, WebP, GIF, and SVG. You can insert images using either the convenience API for quick setup or manual construction for fine-grained control over the image block components.

```typescript file=@cesdk_web_examples/guides-insert-media-images-server-js/server-js.ts reference-only
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
 * CE.SDK Server Guide: Insert Images
 *
 * Demonstrates inserting images into designs:
 * - Using the convenience API (addImage)
 * - Manual construction with graphic blocks and image fills
 * - Configuring image sizing, positioning, and content fill mode
 * - Applying corner radius for rounded images
 */
async function main() {
  console.log('\n⏳ Initializing CE.SDK engine...');

  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and adding images...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }

    // Sample image URL for demonstrations
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image using the convenience API
    // This automatically creates a graphic block with rect shape and image fill
    const imageBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 50
    });
    engine.block.appendChild(page, imageBlock);
    console.log('✓ Added image using convenience API');

    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');

    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }

    // Apply corner radius to create rounded corners on an image
    const roundedBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 250,
      cornerRadius: 20
    });
    engine.block.appendChild(page, roundedBlock);
    console.log('✓ Added image with rounded corners');

    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');

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
      const outputPath = `${outputDir}/images.png`;
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

This guide covers how to add images using the convenience API, manually construct image blocks, configure content fill modes, apply corner radius, and work with multiple images.

## Initialize CE.SDK

We start by initializing the headless CE.SDK engine and creating a scene with a page to hold our images.

```typescript highlight=highlight-setup
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and adding images...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }
```

## Using the Convenience API

The `addImage()` method provides a quick way to insert images. It automatically creates a graphic block with a rect shape and image fill. You can configure size, position, corner radius, and other properties through the options parameter.

```typescript highlight=highlight-convenience-api
// Add an image using the convenience API
// This automatically creates a graphic block with rect shape and image fill
const imageBlock = await engine.block.addImage(imageUrl, {
  size: { width: 200, height: 150 },
  x: 50,
  y: 50
});
engine.block.appendChild(page, imageBlock);
console.log('✓ Added image using convenience API');
```

## Manual Image Construction

For control over individual components, we can manually construct a graphic block with a rect shape and image fill. This approach lets you configure each component separately.

We create a graphic block with `create('graphic')`, attach a rectangular shape with `createShape('rect')`, and create an image fill with `createFill('image')`. The image source is set using `setString()` with the `fill/image/imageFileURI` property.

```typescript highlight=highlight-manual-construction
    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');
```

## Set Content Fill Mode

The content fill mode controls how images scale within their bounds. Use `setContentFillMode()` to choose between different scaling behaviors:

- **Contain**: Preserves aspect ratio and fits the image within the bounds
- **Cover**: Preserves aspect ratio and fills the bounds completely
- **Crop**: Allows custom crop area

Check `supportsContentFillMode()` before setting to ensure the block supports this feature.

```typescript highlight=highlight-content-fill-mode
    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }
```

## Apply Corner Radius

Add rounded corners to image blocks using the `cornerRadius` option in the convenience API. This creates a visually softer appearance for your images.

```typescript highlight=highlight-corner-radius
// Apply corner radius to create rounded corners on an image
const roundedBlock = await engine.block.addImage(imageUrl, {
  size: { width: 200, height: 150 },
  x: 50,
  y: 250,
  cornerRadius: 20
});
engine.block.appendChild(page, roundedBlock);
console.log('✓ Added image with rounded corners');
```

## Working with Multiple Images

Insert multiple images by iterating over an array of image URLs. Each image gets its own graphic block with calculated positioning to arrange them on the page.

```typescript highlight=highlight-multiple-images
    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');
```

## Export and Cleanup

After adding images, we export the design to a PNG file and dispose of the engine to free resources.

```typescript highlight=highlight-export
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
      const outputPath = `${outputDir}/images.png`;
      writeFileSync(outputPath, buffer);

      console.log(`\n✅ Exported result to ${outputPath}`);
    } else {
      console.log('\n⏭️ Export skipped.');
    }
```

Always dispose of the engine when done to prevent memory leaks.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
console.log('🧹 Engine disposed');
```

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.addImage(url, options?)` | Convenience API to create an image block with automatic setup |
| `engine.block.create('graphic')` | Create a graphic block container for images |
| `engine.block.createShape('rect')` | Create a rectangular shape for the image |
| `engine.block.setShape(block, shape)` | Attach shape to graphic block |
| `engine.block.createFill('image')` | Create an image fill |
| `engine.block.setFill(block, fill)` | Apply fill to block |
| `engine.block.setString(fill, property, value)` | Set image source URI via `fill/image/imageFileURI` |
| `engine.block.setWidth(block, width)` | Set block width |
| `engine.block.setHeight(block, height)` | Set block height |
| `engine.block.setPositionX(block, x)` | Set horizontal position |
| `engine.block.setPositionY(block, y)` | Set vertical position |
| `engine.block.supportsContentFillMode(block)` | Check if block supports content fill mode |
| `engine.block.setContentFillMode(block, mode)` | Set content fill mode (`Contain`, `Cover`, `Crop`) |
| `engine.block.appendChild(parent, child)` | Add block to parent |
| `engine.block.export(block, options)` | Export block to image blob |
| `engine.scene.create(layout, options?)` | Create a new scene |
| `engine.block.findByType(type)` | Find blocks by type |
| `engine.dispose()` | Dispose engine and free resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support