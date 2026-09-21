> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Rotate](./edit-image/transform/rotate.md)

---

Rotate images programmatically in headless server-side processing for orientation correction, batch operations, and automated workflows.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-transform-rotate-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-transform-rotate-server-js)

Rotation uses radians where `Math.PI / 2` equals 90°, `Math.PI` equals 180°, and negative values rotate clockwise. Server-side rotation is useful for normalizing uploads, generating asset variations, and enforcing template rules.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-rotate-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function rotateImagesExample() {
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

    // Demo 1: Original image (no rotation)
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

    // Demo 2: Rotate 45 degrees
    const rotated45Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated45Image);
    engine.block.setPositionX(rotated45Image, 225);
    engine.block.setPositionY(rotated45Image, 50);

    // Rotate the block by 45 degrees (π/4 radians)
    engine.block.setRotation(rotated45Image, Math.PI / 4);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', '45°');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 150);
    engine.block.setPositionX(text2, 225);
    engine.block.setPositionY(text2, 210);
    engine.block.appendChild(page, text2);

    // Demo 3: Rotate 90 degrees
    const rotated90Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated90Image);
    engine.block.setPositionX(rotated90Image, 400);
    engine.block.setPositionY(rotated90Image, 50);

    // Rotate the block by 90 degrees (π/2 radians)
    engine.block.setRotation(rotated90Image, Math.PI / 2);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', '90°');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 400);
    engine.block.setPositionY(text3, 210);
    engine.block.appendChild(page, text3);

    // Demo 4: Rotate 180 degrees
    const rotated180Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated180Image);
    engine.block.setPositionX(rotated180Image, 575);
    engine.block.setPositionY(rotated180Image, 50);

    // Rotate the block by 180 degrees (π radians)
    engine.block.setRotation(rotated180Image, Math.PI);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', '180°');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 150);
    engine.block.setPositionX(text4, 575);
    engine.block.setPositionY(text4, 210);
    engine.block.appendChild(page, text4);

    // Demo 5: Grouped rotation
    const groupedImage1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage1);
    engine.block.setPositionX(groupedImage1, 150);
    engine.block.setPositionY(groupedImage1, 300);

    const groupedImage2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage2);
    engine.block.setPositionX(groupedImage2, 260);
    engine.block.setPositionY(groupedImage2, 300);

    // Group blocks and rotate them together
    const groupId = engine.block.group([groupedImage1, groupedImage2]);
    engine.block.setRotation(groupId, Math.PI / 8);

    const text5 = engine.block.create('text');
    engine.block.setString(text5, 'text/text', 'Grouped');
    engine.block.setFloat(text5, 'text/fontSize', 24);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text5, 200);
    engine.block.setPositionX(text5, 150);
    engine.block.setPositionY(text5, 440);
    engine.block.appendChild(page, text5);

    // Get current rotation value
    const currentRotation = engine.block.getRotation(rotated45Image);
    console.log('Current rotation (radians):', currentRotation);
    console.log(
      'Current rotation (degrees):',
      (currentRotation * 180) / Math.PI
    );

    // Reset rotation to original orientation
    engine.block.setRotation(originalImage, 0);

    // Helpers for degree/radian conversion
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Example: rotate by 30 degrees using helper
    const targetRadians = toRadians(30);
    console.log('30 degrees in radians:', targetRadians);
    console.log('Converted back to degrees:', toDegrees(targetRadians));

    // Export the result as PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('rotate-images-output.png', buffer);
    console.log('Successfully exported rotate-images-output.png');
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
rotateImagesExample();
```

This guide covers rotating images by specific angles, reading rotation values, converting between degrees and radians, rotating grouped elements together, and resetting rotation to the original orientation.

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

## Rotate an Image

Rotate blocks using `engine.block.setRotation()` with angle values in radians. Use `Math.PI` for 180° or divide for smaller increments:

```typescript highlight=highlight-rotate-45
// Rotate the block by 45 degrees (π/4 radians)
engine.block.setRotation(rotated45Image, Math.PI / 4);
```

## Rotate by 90 Degrees

Rotate a block by 90 degrees using `Math.PI / 2`:

```typescript highlight=highlight-rotate-90
// Rotate the block by 90 degrees (π/2 radians)
engine.block.setRotation(rotated90Image, Math.PI / 2);
```

## Rotate by 180 Degrees

Flip a block upside down by rotating 180 degrees using `Math.PI`:

```typescript highlight=highlight-rotate-180
// Rotate the block by 180 degrees (π radians)
engine.block.setRotation(rotated180Image, Math.PI);
```

## Get Current Rotation

Read the current rotation value using `engine.block.getRotation()`. The returned value is in radians:

```typescript highlight=highlight-get-rotation
// Get current rotation value
const currentRotation = engine.block.getRotation(rotated45Image);
console.log('Current rotation (radians):', currentRotation);
console.log(
  'Current rotation (degrees):',
  (currentRotation * 180) / Math.PI
);
```

## Reset Rotation

Reset a block to its original orientation by setting rotation to 0:

```typescript highlight=highlight-reset-rotation
// Reset rotation to original orientation
engine.block.setRotation(originalImage, 0);
```

## Convert Between Degrees and Radians

Create helper functions to convert between degrees and radians for more intuitive angle values:

```typescript highlight=highlight-convert-radians
    // Helpers for degree/radian conversion
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Example: rotate by 30 degrees using helper
    const targetRadians = toRadians(30);
    console.log('30 degrees in radians:', targetRadians);
    console.log('Converted back to degrees:', toDegrees(targetRadians));
```

## Rotate Groups Together

Group multiple blocks and rotate them as a unit to maintain their relative positions:

```typescript highlight=highlight-rotate-group
// Group blocks and rotate them together
const groupId = engine.block.group([groupedImage1, groupedImage2]);
engine.block.setRotation(groupId, Math.PI / 8);
```

## Export Result

Export the scene as a PNG file:

```typescript highlight=highlight-export
// Export the result as PNG
const blob = await engine.block.export(page, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('rotate-images-output.png', buffer);
console.log('Successfully exported rotate-images-output.png');
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

### Rotation Has No Effect

Ensure the block exists and is appended to a page before calling `setRotation()`. Verify the block ID is valid.

### Image Fails to Load

Verify the URI is reachable from your server or switch to a file URI inside the asset bundle.

### Engine Keeps Running

Call `engine.dispose()` in a finally block to ensure resources are freed even if errors occur.

## API Reference

| Method                       | Description                                |
| ---------------------------- | ------------------------------------------ |
| `CreativeEngine.init()`      | Initialize the headless engine             |
| `engine.scene.create()`      | Create a new scene                         |
| `engine.block.create()`      | Create a block of specified type           |
| `engine.block.addImage()`    | Add an image block                         |
| `engine.block.setRotation()` | Set rotation angle in radians              |
| `engine.block.getRotation()` | Get current rotation angle in radians      |
| `engine.block.group()`       | Group blocks for collective transforms     |
| `engine.block.export()`      | Export block as image                      |
| `engine.dispose()`           | Dispose engine and free resources          |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support