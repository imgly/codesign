> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Move](./edit-image/transform/move.md)

---

Position images on the canvas using absolute pixel coordinates or percentage-based positioning for responsive layouts.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-transform-move-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-transform-move-server-js)

Position images on the canvas using coordinates that start at the top-left corner (0, 0). X increases right, Y increases down. Values are relative to the parent block, simplifying nested layouts.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-move-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function moveImagesExample() {
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

    // Demo 1: Movable Image - Can be freely repositioned by user
    const movableImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, movableImage);
    engine.block.setPositionX(movableImage, 50);
    engine.block.setPositionY(movableImage, 150);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Movable');
    engine.block.setFloat(text1, 'text/fontSize', 32);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 360);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Positioning - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, percentImage);

    // Set position mode to percentage (0.0 to 1.0)
    engine.block.setPositionXMode(percentImage, 'Percent');
    engine.block.setPositionYMode(percentImage, 'Percent');

    // Position at 37.5% from left (300px), 30% from top (150px)
    engine.block.setPositionX(percentImage, 0.375);
    engine.block.setPositionY(percentImage, 0.3);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 32);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 360);
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Image - Cannot be moved, rotated, or scaled
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 550);
    engine.block.setPositionY(lockedImage, 150);

    // Lock the transform to prevent user interaction
    engine.block.setBool(lockedImage, 'transformLocked', true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 32);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 360);
    engine.block.appendChild(page, text3);

    // Get current position values
    const currentX = engine.block.getPositionX(movableImage);
    const currentY = engine.block.getPositionY(movableImage);
    console.log('Current position:', currentX, currentY);

    // Move relative to current position
    // const offsetX = engine.block.getPositionX(movableImage);
    // const offsetY = engine.block.getPositionY(movableImage);
    // engine.block.setPositionX(movableImage, offsetX + 50);
    // engine.block.setPositionY(movableImage, offsetY + 50);

    // Save the scene for later use or rendering
    const sceneString = await engine.scene.saveToString();

    // Ensure output directory exists
    if (!existsSync('output')) {
      mkdirSync('output');
    }

    writeFileSync('output/move-images-scene.json', sceneString);
    console.log('Saved to output/move-images-scene.json');
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
moveImagesExample();
```

This guide covers positioning images with absolute or percentage coordinates, configuring position modes, and locking transforms to prevent repositioning.

## Initialize Headless Engine

Create a headless engine instance for programmatic creation and manipulation of designs:

```typescript highlight-setup
// Initialize headless engine for programmatic creation
engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});
```

## Create Scene

Create a new scene and page to hold the positioned images:

```typescript highlight-create-scene
    // Create a new scene programmatically
    const scene = engine.scene.create();

    // Create and set up the page
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);
    engine.block.appendChild(scene, page);
```

## Position Coordinates

Coordinates originate at the top-left (0, 0) of the parent container. Use **absolute** mode for fixed pixel values or **percentage** mode (0.0 to 1.0) for responsive layouts that adapt to parent size changes.

## Positioning Images

Position images using `engine.block.setPositionX()` and `engine.block.setPositionY()` with absolute pixel coordinates:

```typescript highlight-movable-image
engine.block.appendChild(page, movableImage);
engine.block.setPositionX(movableImage, 50);
engine.block.setPositionY(movableImage, 150);
```

## Getting Current Position

Read current position values using `engine.block.getPositionX()` and `engine.block.getPositionY()`. Values are returned in the current position mode (absolute pixels or percentage 0.0-1.0):

```typescript highlight-get-position
// Get current position values
const currentX = engine.block.getPositionX(movableImage);
const currentY = engine.block.getPositionY(movableImage);
```

## Configuring Position Modes

Control how position values are interpreted using `engine.block.setPositionXMode()` and `engine.block.setPositionYMode()`. Set to `'Absolute'` for pixels or `'Percent'` for percentage values (0.0 to 1.0). Check the current mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. The Percentage Positioning section below demonstrates setting these modes.

## Percentage Positioning

Position images using percentage values (0.0 to 1.0) for responsive layouts. Set the position mode to `'Percent'`, then use values between 0.0 and 1.0:

```typescript highlight-percentage-positioning
// Set position mode to percentage (0.0 to 1.0)
engine.block.setPositionXMode(percentImage, 'Percent');
engine.block.setPositionYMode(percentImage, 'Percent');
```

Percentage positioning adapts automatically when the parent block dimensions change, maintaining relative positions in responsive designs.

## Relative Positioning

Move images relative to their current position by getting the current coordinates and adding offset values:

```typescript highlight-relative-positioning
// Move relative to current position
// const offsetX = engine.block.getPositionX(movableImage);
// const offsetY = engine.block.getPositionY(movableImage);
// engine.block.setPositionX(movableImage, offsetX + 50);
// engine.block.setPositionY(movableImage, offsetY + 50);
```

## Locking Transforms

Lock transforms to prevent repositioning, rotation, and scaling by setting `transformLocked` to true:

```typescript highlight-locked-image
// Lock the transform to prevent user interaction
engine.block.setBool(lockedImage, 'transformLocked', true);
```

## Save Scene

Save the scene to a file for later use or rendering:

```typescript highlight-export
    // Save the scene for later use or rendering
    const sceneString = await engine.scene.saveToString();

    // Ensure output directory exists
    if (!existsSync('output')) {
      mkdirSync('output');
    }

    writeFileSync('output/move-images-scene.json', sceneString);
    console.log('Saved to output/move-images-scene.json');
```

## Cleanup

Always dispose the engine to free resources when done:

```typescript highlight-cleanup
// Always dispose the engine to free resources
if (engine) {
  engine.dispose();
}
```

## Troubleshooting

### Image Not Moving

Check if transforms are locked using `engine.block.getBool(block, 'transformLocked')`. Ensure the image block exists and values are within parent bounds.

### Unexpected Position Values

Check position mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. Verify if using absolute (pixels) vs percentage (0.0-1.0) values. Review parent block dimensions if using percentage positioning.

### Positioned Outside Visible Area

Verify parent block dimensions and boundaries. Check coordinate system: origin is top-left, not center. Review X/Y values for calculation errors.

### Percentage Positioning Not Responsive

Ensure position mode is set to `'Percent'` using `engine.block.setPositionXMode(block, 'Percent')`. Verify percentage values are between 0.0 and 1.0. Check that parent block dimensions can change.

## API Reference

| Method                         | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `CreativeEngine.init()`        | Initializes the headless engine for programmatic creation |
| `engine.scene.create()`        | Creates a new scene programmatically                      |
| `engine.block.create()`        | Creates a new block of the specified type                 |
| `engine.block.setWidth()`      | Sets the width of a block                                 |
| `engine.block.setHeight()`     | Sets the height of a block                                |
| `engine.block.appendChild()`   | Adds a block as a child of another block                  |
| `engine.block.addImage()`      | Create and position image in one operation                |
| `engine.block.setPositionX()`  | Set X coordinate value                                    |
| `engine.block.setPositionY()`  | Set Y coordinate value                                    |
| `engine.block.getPositionX()`  | Get current X coordinate value                            |
| `engine.block.getPositionY()`  | Get current Y coordinate value                            |
| `engine.block.setPositionXMode()` | Set position mode for X coordinate                     |
| `engine.block.setPositionYMode()` | Set position mode for Y coordinate                     |
| `engine.block.getPositionXMode()` | Get position mode for X coordinate                     |
| `engine.block.getPositionYMode()` | Get position mode for Y coordinate                     |
| `engine.block.setBool()`       | Set transform lock state                                  |
| `engine.block.getBool()`       | Get transform lock state                                  |
| `engine.scene.saveToString()`  | Save scene to string for later use                        |
| `engine.dispose()`             | Dispose engine and free resources                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support