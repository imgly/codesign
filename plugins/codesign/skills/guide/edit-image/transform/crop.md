> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Crop](./edit-image/transform/crop.md)

---

Frame subjects, remove unwanted elements, and prepare images for specific
formats using CE.SDK's comprehensive crop system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-transform-crop-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-transform-crop-server-js)

Image cropping selects a region inside an image and discards everything outside that frame. Unlike resizing which changes overall dimensions, cropping lets you focus on specific areas of interest. CE.SDK provides a crop system that works through scale, translation, and rotation to define the visible region of content within a block frame.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-crop-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Crop Images
 *
 * Demonstrates cropping images programmatically:
 * - Checking crop support
 * - Cropping to fixed dimensions
 * - Content fill modes (Crop, Cover, Contain)
 * - Scaling and positioning content
 * - Cropping to aspect ratio
 * - Rotating and flipping content
 * - Locking aspect ratio
 * - Exporting cropped images
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image block using the convenience addImage API
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 200 }
  });
  engine.block.appendChild(page, imageBlock);
  engine.block.setPositionX(imageBlock, 50);
  engine.block.setPositionY(imageBlock, 50);

  // Verify the block supports crop operations before applying them
  const supportsCrop = engine.block.supportsCrop(imageBlock);
  console.log('Block supports crop:', supportsCrop); // true

  // Content fill modes control how images fit within their frame
  // Check if the block supports content fill modes
  const supportsFillMode = engine.block.supportsContentFillMode(imageBlock);
  console.log('Supports content fill mode:', supportsFillMode);

  // Get the current content fill mode
  const currentMode = engine.block.getContentFillMode(imageBlock);
  console.log('Current fill mode:', currentMode);

  // Set content fill mode - options are 'Crop', 'Cover', 'Contain'
  // 'Cover' automatically scales and positions to fill the entire frame
  engine.block.setContentFillMode(imageBlock, 'Cover');

  // Alignment only applies in 'Cover' and 'Contain' fill modes — it controls
  // which part of the content stays visible (Cover) or where the letterboxed
  // content sits (Contain). It is ignored in 'Crop' mode.
  // Pin the content to the top-left corner instead of the default center
  engine.block.setContentFillHorizontalAlignment(imageBlock, 'Left');
  engine.block.setContentFillVerticalAlignment(imageBlock, 'Top');

  // Read the current alignment values
  const horizontalAlignment =
    engine.block.getContentFillHorizontalAlignment(imageBlock);
  const verticalAlignment =
    engine.block.getContentFillVerticalAlignment(imageBlock);
  console.log('Content fill alignment:', {
    horizontalAlignment,
    verticalAlignment
  });

  // Create another image block to demonstrate crop scaling
  const scaleBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, scaleBlock);
  engine.block.setPositionX(scaleBlock, 400);
  engine.block.setPositionY(scaleBlock, 50);

  // Set content fill mode to 'Crop' for manual control
  engine.block.setContentFillMode(scaleBlock, 'Crop');

  // Scale the content within the crop frame
  // Values > 1 zoom in, values < 1 zoom out
  engine.block.setCropScaleX(scaleBlock, 1.5);
  engine.block.setCropScaleY(scaleBlock, 1.5);

  // Or use uniform scaling from center
  engine.block.setCropScaleRatio(scaleBlock, 1.2);

  // Get the current scale values
  const scaleX = engine.block.getCropScaleX(scaleBlock);
  const scaleY = engine.block.getCropScaleY(scaleBlock);
  const scaleRatio = engine.block.getCropScaleRatio(scaleBlock);
  console.log('Crop scale:', { scaleX, scaleY, scaleRatio });

  // Pan the content within the crop frame using translation
  // Values are in percentage of the crop frame dimensions
  engine.block.setCropTranslationX(scaleBlock, 0.1); // Move 10% right
  engine.block.setCropTranslationY(scaleBlock, -0.1); // Move 10% up

  // Get the current translation values
  const translationX = engine.block.getCropTranslationX(scaleBlock);
  const translationY = engine.block.getCropTranslationY(scaleBlock);
  console.log('Crop translation:', { translationX, translationY });

  // Ensure content covers the entire frame without gaps
  // The minScaleRatio parameter sets the minimum scale allowed
  const adjustedRatio = engine.block.adjustCropToFillFrame(scaleBlock, 1.0);
  console.log('Adjusted scale ratio:', adjustedRatio);

  // Create an image block to demonstrate crop rotation
  const rotateBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, rotateBlock);
  engine.block.setPositionX(rotateBlock, 50);
  engine.block.setPositionY(rotateBlock, 300);
  engine.block.setContentFillMode(rotateBlock, 'Crop');

  // Rotate the content within the crop frame (in radians)
  // Math.PI / 4 = 45 degrees
  engine.block.setCropRotation(rotateBlock, Math.PI / 4);

  // Get the current rotation
  const rotation = engine.block.getCropRotation(rotateBlock);
  console.log('Crop rotation (radians):', rotation);

  // Ensure content still fills the frame after rotation
  engine.block.adjustCropToFillFrame(rotateBlock, 1.0);

  // Create an image block to demonstrate flipping
  const flipBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, flipBlock);
  engine.block.setPositionX(flipBlock, 300);
  engine.block.setPositionY(flipBlock, 300);
  engine.block.setContentFillMode(flipBlock, 'Crop');

  // Flip the content horizontally
  engine.block.flipCropHorizontal(flipBlock);

  // Or flip vertically
  // engine.block.flipCropVertical(flipBlock);

  // Create an image block to demonstrate aspect ratio locking
  const lockBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, lockBlock);
  engine.block.setPositionX(lockBlock, 550);
  engine.block.setPositionY(lockBlock, 300);
  engine.block.setContentFillMode(lockBlock, 'Crop');

  // Lock the crop aspect ratio - when locked, crop handles maintain
  // the current aspect ratio during resize operations
  engine.block.setCropAspectRatioLocked(lockBlock, true);

  // Check if aspect ratio is locked
  const isLocked = engine.block.isCropAspectRatioLocked(lockBlock);
  console.log('Aspect ratio locked:', isLocked);

  // Reset crop to default state (sets content fill mode to 'Cover')
  engine.block.resetCrop(lockBlock);

  // Export the result as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync('crop-images-output.png', buffer);
  console.log('Successfully exported crop-images-output.png');
} catch (error) {
  console.error('Error:', error);
  throw error;
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to crop images programmatically using the block API, including content fill modes, scaling, positioning, rotation, and aspect ratio locking.

## Programmatic Cropping

### Initialize CE.SDK

For applications that need to crop images programmatically—whether for automation, batch processing, or dynamic user experiences—we start by setting up CE.SDK with the proper configuration.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

This initializes the CE.SDK engine in headless mode, giving you full API access to the crop system without UI dependencies.

### Create a Scene with an Image

Before cropping, we need a scene with an image block. The example creates a page with specific dimensions and adds an image using the convenience `addImage()` API.

```typescript highlight-create-scene
  // Create a design scene with specific page dimensions
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image block using the convenience addImage API
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 200 }
  });
  engine.block.appendChild(page, imageBlock);
  engine.block.setPositionX(imageBlock, 50);
  engine.block.setPositionY(imageBlock, 50);
```

### Check Crop Support

Before applying crop operations to a block, verify it supports cropping. Not all block types can be cropped—for example, scene blocks do not support crop operations.

```typescript highlight-supportsCrop
// Verify the block supports crop operations before applying them
const supportsCrop = engine.block.supportsCrop(imageBlock);
console.log('Block supports crop:', supportsCrop); // true
```

Crop support is available for:

- **Graphic blocks** with image fills
- **Graphic blocks** with video fills
- **Shape blocks** with fills

Always verify support before applying crop operations to avoid errors.

### Content Fill Modes

CE.SDK provides three content fill modes that control how images fit within their frame. These modes determine whether you have manual control or automatic behavior.

```typescript highlight-contentFillMode
  // Content fill modes control how images fit within their frame
  // Check if the block supports content fill modes
  const supportsFillMode = engine.block.supportsContentFillMode(imageBlock);
  console.log('Supports content fill mode:', supportsFillMode);

  // Get the current content fill mode
  const currentMode = engine.block.getContentFillMode(imageBlock);
  console.log('Current fill mode:', currentMode);

  // Set content fill mode - options are 'Crop', 'Cover', 'Contain'
  // 'Cover' automatically scales and positions to fill the entire frame
  engine.block.setContentFillMode(imageBlock, 'Cover');
```

The available fill modes are:

- **Crop** - Manual control over the exact crop region using scale and translation
- **Cover** - Automatically scales and positions content to cover the entire frame (no gaps)
- **Contain** - Automatically scales and positions content to fit within the frame (may show gaps)

Use `Crop` mode when you need precise control over which part of the image is visible. Use `Cover` for automatic framing that fills the entire space.

### Align Content Fill

In `Cover` and `Contain` modes, content is centered inside the block by default. Use the alignment APIs to pin content to a specific edge instead — for example, to keep the top-left of an image visible regardless of the image's aspect ratio.

```typescript highlight-content-fill-alignment
  // Alignment only applies in 'Cover' and 'Contain' fill modes — it controls
  // which part of the content stays visible (Cover) or where the letterboxed
  // content sits (Contain). It is ignored in 'Crop' mode.
  // Pin the content to the top-left corner instead of the default center
  engine.block.setContentFillHorizontalAlignment(imageBlock, 'Left');
  engine.block.setContentFillVerticalAlignment(imageBlock, 'Top');

  // Read the current alignment values
  const horizontalAlignment =
    engine.block.getContentFillHorizontalAlignment(imageBlock);
  const verticalAlignment =
    engine.block.getContentFillVerticalAlignment(imageBlock);
  console.log('Content fill alignment:', {
    horizontalAlignment,
    verticalAlignment
  });
```

The horizontal options are `'Left'`, `'Center'` (default), and `'Right'`. The vertical options are `'Top'`, `'Center'` (default), and `'Bottom'`. In `Cover` mode the alignment controls which part of the oversized content stays visible; in `Contain` mode it controls where the letterboxed content sits. The alignment is ignored in `Crop` mode, where translation is set explicitly.

### Scale Content

When using `Crop` fill mode, you can scale the content within the crop frame to zoom in or out. Values greater than 1 zoom in, while values less than 1 zoom out.

```typescript highlight-cropScale
  // Create another image block to demonstrate crop scaling
  const scaleBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, scaleBlock);
  engine.block.setPositionX(scaleBlock, 400);
  engine.block.setPositionY(scaleBlock, 50);

  // Set content fill mode to 'Crop' for manual control
  engine.block.setContentFillMode(scaleBlock, 'Crop');

  // Scale the content within the crop frame
  // Values > 1 zoom in, values < 1 zoom out
  engine.block.setCropScaleX(scaleBlock, 1.5);
  engine.block.setCropScaleY(scaleBlock, 1.5);

  // Or use uniform scaling from center
  engine.block.setCropScaleRatio(scaleBlock, 1.2);

  // Get the current scale values
  const scaleX = engine.block.getCropScaleX(scaleBlock);
  const scaleY = engine.block.getCropScaleY(scaleBlock);
  const scaleRatio = engine.block.getCropScaleRatio(scaleBlock);
  console.log('Crop scale:', { scaleX, scaleY, scaleRatio });
```

CE.SDK provides two scaling approaches:

- **Non-uniform scaling** - `setCropScaleX()` and `setCropScaleY()` for independent horizontal and vertical scaling
- **Uniform scaling** - `setCropScaleRatio()` for proportional scaling from the center of the crop frame

Uniform scaling maintains the image's aspect ratio, while non-uniform scaling can stretch or compress the image.

### Position Content

Pan the content within the crop frame using translation. Translation values represent the offset as a percentage of the crop frame dimensions.

```typescript highlight-cropTranslation
  // Pan the content within the crop frame using translation
  // Values are in percentage of the crop frame dimensions
  engine.block.setCropTranslationX(scaleBlock, 0.1); // Move 10% right
  engine.block.setCropTranslationY(scaleBlock, -0.1); // Move 10% up

  // Get the current translation values
  const translationX = engine.block.getCropTranslationX(scaleBlock);
  const translationY = engine.block.getCropTranslationY(scaleBlock);
  console.log('Crop translation:', { translationX, translationY });
```

Translation values:

- Positive X values move content to the right
- Negative X values move content to the left
- Positive Y values move content down
- Negative Y values move content up

After adjusting scale and translation, use `adjustCropToFillFrame()` to ensure content covers the entire frame without gaps.

```typescript highlight-adjustCropToFillFrame
// Ensure content covers the entire frame without gaps
// The minScaleRatio parameter sets the minimum scale allowed
const adjustedRatio = engine.block.adjustCropToFillFrame(scaleBlock, 1.0);
console.log('Adjusted scale ratio:', adjustedRatio);
```

The `minScaleRatio` parameter sets the minimum scale allowed—the method returns the actual scale ratio applied.

### Rotate Content

Rotate the content within the crop frame using radians. This rotates the image independently of the block's overall rotation.

```typescript highlight-cropRotation
  // Create an image block to demonstrate crop rotation
  const rotateBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, rotateBlock);
  engine.block.setPositionX(rotateBlock, 50);
  engine.block.setPositionY(rotateBlock, 300);
  engine.block.setContentFillMode(rotateBlock, 'Crop');

  // Rotate the content within the crop frame (in radians)
  // Math.PI / 4 = 45 degrees
  engine.block.setCropRotation(rotateBlock, Math.PI / 4);

  // Get the current rotation
  const rotation = engine.block.getCropRotation(rotateBlock);
  console.log('Crop rotation (radians):', rotation);

  // Ensure content still fills the frame after rotation
  engine.block.adjustCropToFillFrame(rotateBlock, 1.0);
```

After rotating content, call `adjustCropToFillFrame()` to ensure the rotated content still covers the entire frame.

The difference between crop rotation and block rotation:

- **Crop rotation** - Rotates the content inside the frame while the frame stays fixed
- **Block rotation** - Rotates the entire block including its frame

### Flip Content

Flip the content horizontally or vertically to create mirror effects.

```typescript highlight-flipCrop
  // Create an image block to demonstrate flipping
  const flipBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, flipBlock);
  engine.block.setPositionX(flipBlock, 300);
  engine.block.setPositionY(flipBlock, 300);
  engine.block.setContentFillMode(flipBlock, 'Crop');

  // Flip the content horizontally
  engine.block.flipCropHorizontal(flipBlock);

  // Or flip vertically
  // engine.block.flipCropVertical(flipBlock);
```

Flipping affects only the content within the frame, not the frame itself.

### Lock Aspect Ratio

When building interactive crop interfaces, you can lock the aspect ratio to maintain proportions during resize operations.

```typescript highlight-lockAspectRatio
  // Create an image block to demonstrate aspect ratio locking
  const lockBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 200 }
  });
  engine.block.appendChild(page, lockBlock);
  engine.block.setPositionX(lockBlock, 550);
  engine.block.setPositionY(lockBlock, 300);
  engine.block.setContentFillMode(lockBlock, 'Crop');

  // Lock the crop aspect ratio - when locked, crop handles maintain
  // the current aspect ratio during resize operations
  engine.block.setCropAspectRatioLocked(lockBlock, true);

  // Check if aspect ratio is locked
  const isLocked = engine.block.isCropAspectRatioLocked(lockBlock);
  console.log('Aspect ratio locked:', isLocked);
```

When locked, crop handles maintain the current aspect ratio. This is useful for:

- Preparing images for specific formats (social media, print)
- Maintaining consistent proportions across multiple images
- Preventing accidental distortion during editing

### Reset Crop

To restore default crop settings, use `resetCrop()`. This sets the content fill mode to `Cover` and adjusts crop values so the content covers the block.

```typescript highlight-resetCrop
// Reset crop to default state (sets content fill mode to 'Cover')
engine.block.resetCrop(lockBlock);
```

## Coordinate System

Crop transforms use normalized values:

| Property | Value Type | Description |
|----------|------------|-------------|
| Scale | Float (0.0+) | 1.0 is original size, 2.0 is double, 0.5 is half |
| Translation | Float (-1.0 to 1.0) | Percentage of frame dimensions |
| Rotation | Float (radians) | Math.PI = 180°, Math.PI/2 = 90° |

All crop values are independent of canvas zoom level.

## Combining Crop with Other Transforms

You can combine crop operations with other block transforms like position, rotation, and scale. Crop transforms affect the content within the block, while block transforms affect the block itself on the canvas:

```typescript
// Crop the content (scales/pans the image within its frame)
engine.block.setCropScaleRatio(imageBlock, 1.5);
engine.block.setCropRotation(imageBlock, Math.PI / 12);

// Transform the block itself (moves/rotates the entire block on canvas)
engine.block.setRotation(imageBlock, Math.PI / 6);
engine.block.setWidth(imageBlock, 400);
```

## Export Results

After applying crop transformations, export the processed content to a file.

```typescript highlight-export
// Export the result as PNG
const blob = await engine.block.export(page, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('crop-images-output.png', buffer);
console.log('Successfully exported crop-images-output.png');
```

Always dispose of the engine instance when processing is complete to free resources.

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

| Issue | Cause / Fix |
|-------|-------------|
| Crop functions throw error | Verify block supports crop with `supportsCrop()` |
| Black bars after scaling | Call `adjustCropToFillFrame()` or increase scale ratio |
| Content not filling frame | Check content fill mode - use 'Cover' for automatic fill |
| Unexpected crop behavior | Ensure content fill mode is set to 'Crop' for manual control |

## API Reference

| Method | Description |
|--------|-------------|
| `block.supportsCrop(id)` | Check if a block supports cropping |
| `block.setCropScaleX(id, scaleX)` | Set horizontal crop scale |
| `block.setCropScaleY(id, scaleY)` | Set vertical crop scale |
| `block.setCropScaleRatio(id, ratio)` | Set uniform crop scale from center |
| `block.setCropRotation(id, rotation)` | Set crop rotation in radians |
| `block.setCropTranslationX(id, x)` | Set horizontal crop translation |
| `block.setCropTranslationY(id, y)` | Set vertical crop translation |
| `block.adjustCropToFillFrame(id, minRatio)` | Adjust crop to fill frame |
| `block.flipCropHorizontal(id)` | Flip content horizontally |
| `block.flipCropVertical(id)` | Flip content vertically |
| `block.isCropAspectRatioLocked(id)` | Check if aspect ratio is locked |
| `block.setCropAspectRatioLocked(id, locked)` | Lock/unlock aspect ratio |
| `block.resetCrop(id)` | Reset crop to default state |
| `block.supportsContentFillMode(id)` | Check if block supports fill modes |
| `block.setContentFillMode(id, mode)` | Set content fill mode |
| `block.getContentFillMode(id)` | Get current content fill mode |
| `block.setContentFillHorizontalAlignment(id, alignment)` | Align fill horizontally (Left, Center, Right) in Cover/Contain modes |
| `block.getContentFillHorizontalAlignment(id)` | Get horizontal fill alignment |
| `block.setContentFillVerticalAlignment(id, alignment)` | Align fill vertically (Top, Center, Bottom) in Cover/Contain modes |
| `block.getContentFillVerticalAlignment(id)` | Get vertical fill alignment |
| `block.getCropScaleX(id)` | Get horizontal crop scale |
| `block.getCropScaleY(id)` | Get vertical crop scale |
| `block.getCropScaleRatio(id)` | Get uniform crop scale ratio |
| `block.getCropRotation(id)` | Get crop rotation in radians |
| `block.getCropTranslationX(id)` | Get horizontal crop translation |
| `block.getCropTranslationY(id)` | Get vertical crop translation |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support