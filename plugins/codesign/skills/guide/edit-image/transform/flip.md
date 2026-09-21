> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Flip](./edit-image/transform/flip.md)

---

Flip images horizontally and vertically in CE.SDK for headless server-side processing. Mirror images for orientation correction, reflection effects, and batch operations.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-transform-flip-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-transform-flip-server-js)

Flipping mirrors content along horizontal or vertical axes. Use flip operations for orientation correction, creating reflection effects, and adapting layouts.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-flip-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function flipImagesExample() {
  let engine: CreativeEngine | null = null;

  try {
    // Initialize headless engine for programmatic creation
    engine = await CreativeEngine.init({
      baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
      // license: process.env.CESDK_LICENSE,
    });

    // Create a new scene programmatically
    const scene = engine.scene.create();

    // Create and set up the page
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);
    engine.block.appendChild(scene, page);

    // Demo 1: Original image (no flip)
    const originalImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, originalImage);
    engine.block.setPositionX(originalImage, 50);
    engine.block.setPositionY(originalImage, 50);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Original');
    engine.block.setFloat(text1, 'text/fontSize', 24);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 150);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 210);
    engine.block.appendChild(page, text1);

    // Demo 2: Horizontal flip
    const horizontalFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, horizontalFlipImage);
    engine.block.setPositionX(horizontalFlipImage, 225);
    engine.block.setPositionY(horizontalFlipImage, 50);

    // Flip the block horizontally (mirrors left to right)
    engine.block.setFlipHorizontal(horizontalFlipImage, true);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Horizontal');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 150);
    engine.block.setPositionX(text2, 225);
    engine.block.setPositionY(text2, 210);
    engine.block.appendChild(page, text2);

    // Demo 3: Vertical flip
    const verticalFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, verticalFlipImage);
    engine.block.setPositionX(verticalFlipImage, 400);
    engine.block.setPositionY(verticalFlipImage, 50);

    // Flip the block vertically (mirrors top to bottom)
    engine.block.setFlipVertical(verticalFlipImage, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Vertical');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 400);
    engine.block.setPositionY(text3, 210);
    engine.block.appendChild(page, text3);

    // Demo 4: Both flips combined
    const bothFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, bothFlipImage);
    engine.block.setPositionX(bothFlipImage, 575);
    engine.block.setPositionY(bothFlipImage, 50);

    // Combine horizontal and vertical flips
    engine.block.setFlipHorizontal(bothFlipImage, true);
    engine.block.setFlipVertical(bothFlipImage, true);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', 'Both');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 150);
    engine.block.setPositionX(text4, 575);
    engine.block.setPositionY(text4, 210);
    engine.block.appendChild(page, text4);

    // Demo 5: Crop flip (flips content within the crop frame)
    const cropFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, cropFlipImage);
    engine.block.setPositionX(cropFlipImage, 225);
    engine.block.setPositionY(cropFlipImage, 280);

    // Flip the content within the crop frame (not the block itself)
    engine.block.flipCropHorizontal(cropFlipImage);

    const text5 = engine.block.create('text');
    engine.block.setString(text5, 'text/text', 'Crop Flip');
    engine.block.setFloat(text5, 'text/fontSize', 24);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text5, 150);
    engine.block.setPositionX(text5, 225);
    engine.block.setPositionY(text5, 440);
    engine.block.appendChild(page, text5);

    // Get current flip state
    const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipImage);
    const isFlippedV = engine.block.getFlipVertical(verticalFlipImage);
    console.log(`Horizontal flip state: ${isFlippedH}`);
    console.log(`Vertical flip state: ${isFlippedV}`);

    // Toggle flip by reading current state and setting opposite
    const currentFlip = engine.block.getFlipHorizontal(originalImage);
    engine.block.setFlipHorizontal(originalImage, !currentFlip);
    // Toggle back for demo purposes
    engine.block.setFlipHorizontal(originalImage, currentFlip);

    // Export the result as PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('flip-images-output.png', buffer);
    console.log('Successfully exported flip-images-output.png');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine to free resources
    if (engine) {
      engine.dispose();
    }
  }
}

// Run the example
flipImagesExample();
```

This guide covers flipping images horizontally and vertically, understanding the difference between block flip and crop flip, querying flip state, and applying flips to multiple blocks.

## Initialize Headless Engine

Create a headless engine instance for programmatic manipulation:

```typescript highlight=highlight-setup
// Initialize headless engine for programmatic creation
engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});
```

## Create Scene

Create a scene and page to hold the images:

```typescript highlight=highlight-create-scene
    // Create a new scene programmatically
    const scene = engine.scene.create();

    // Create and set up the page
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);
    engine.block.appendChild(scene, page);
```

## Flip Types

CE.SDK provides two types of flip operations:

- **Block flip**: Mirrors the entire block including its position context. Use `setFlipHorizontal()` and `setFlipVertical()`.
- **Crop flip**: Mirrors only the image content within its crop frame. Use `flipCropHorizontal()` and `flipCropVertical()`.

## Flip Horizontally

Mirror an image along its vertical axis using `engine.block.setFlipHorizontal()`. This swaps the left and right sides:

```typescript highlight=highlight-flip-horizontal
// Flip the block horizontally (mirrors left to right)
engine.block.setFlipHorizontal(horizontalFlipImage, true);
```

## Flip Vertically

Mirror an image along its horizontal axis using `engine.block.setFlipVertical()`. This swaps the top and bottom:

```typescript highlight=highlight-flip-vertical
// Flip the block vertically (mirrors top to bottom)
engine.block.setFlipVertical(verticalFlipImage, true);
```

## Combine Flips

Apply both horizontal and vertical flips to rotate an image 180 degrees:

```typescript highlight=highlight-flip-both
// Combine horizontal and vertical flips
engine.block.setFlipHorizontal(bothFlipImage, true);
engine.block.setFlipVertical(bothFlipImage, true);
```

## Flip Content Within Crop Frame

Flip image content without affecting the block's position using `engine.block.flipCropHorizontal()` and `engine.block.flipCropVertical()`. These methods toggle the flip state each time they are called:

```typescript highlight=highlight-flip-crop
// Flip the content within the crop frame (not the block itself)
engine.block.flipCropHorizontal(cropFlipImage);
```

## Get Current Flip State

Query the current flip state using `engine.block.getFlipHorizontal()` and `engine.block.getFlipVertical()`:

```typescript highlight=highlight-get-flip-state
// Get current flip state
const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipImage);
const isFlippedV = engine.block.getFlipVertical(verticalFlipImage);
console.log(`Horizontal flip state: ${isFlippedH}`);
console.log(`Vertical flip state: ${isFlippedV}`);
```

## Toggle Flip State

Toggle a flip by reading the current state and setting the opposite value:

```typescript highlight=highlight-toggle-flip
// Toggle flip by reading current state and setting opposite
const currentFlip = engine.block.getFlipHorizontal(originalImage);
engine.block.setFlipHorizontal(originalImage, !currentFlip);
// Toggle back for demo purposes
engine.block.setFlipHorizontal(originalImage, currentFlip);
```

## Export Result

Export the scene as a PNG file:

```typescript highlight=highlight-export
// Export the result as PNG
const blob = await engine.block.export(page, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('flip-images-output.png', buffer);
console.log('Successfully exported flip-images-output.png');
```

## Cleanup

Dispose the engine to free resources:

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
if (engine) {
  engine.dispose();
}
```

## Troubleshooting

### Flip Has No Visual Effect

Ensure the block is appended to a page and the scene is loaded before applying flip. Verify the block exists using `engine.block.isValid()`.

### Content Appears in Wrong Position

Check whether you need block flip or crop flip for your use case. Block flip mirrors the entire element, while crop flip mirrors only the content within the frame.

### Engine Keeps Running

Call `engine.dispose()` in a finally block to ensure resources are freed even if errors occur.

## API Reference

| Method                              | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `CreativeEngine.init()`             | Initialize the headless engine                  |
| `engine.scene.create()`             | Create a new scene                              |
| `engine.block.create()`             | Create a block of specified type                |
| `engine.block.addImage()`           | Add an image block                              |
| `engine.block.setFlipHorizontal()`  | Set horizontal flip state                       |
| `engine.block.setFlipVertical()`    | Set vertical flip state                         |
| `engine.block.getFlipHorizontal()`  | Get horizontal flip state                       |
| `engine.block.getFlipVertical()`    | Get vertical flip state                         |
| `engine.block.flipCropHorizontal()` | Flip content horizontally within crop frame     |
| `engine.block.flipCropVertical()`   | Flip content vertically within crop frame       |
| `engine.block.export()`             | Export block as image                           |
| `engine.dispose()`                  | Dispose engine and free resources               |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support