> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Move](./edit-video/transform/move.md)

---

Position videos on the canvas using absolute pixel coordinates or percentage-based positioning for responsive layouts.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-transform-move-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-transform-move-server-js)

Position videos on the canvas using coordinates that start at the top-left corner (0, 0). X increases right, Y increases down. Values are relative to the parent block, simplifying nested layouts.

```typescript file=@cesdk_web_examples/guides-create-video-transform-move-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Move Videos
 *
 * Demonstrates video positioning in headless mode:
 * - Absolute positioning with pixel coordinates
 * - Percentage-based positioning for responsive layouts
 * - Getting current position values
 * - Locking transforms to prevent repositioning
 * - Saving scenes for later rendering
 *
 * Note: Full video export (MP4) requires the CE.SDK Renderer.
 * In headless Node.js mode, we save the scene for later use.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with a page
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 500);
  engine.block.appendChild(scene, page);

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Block size for layout
  const blockSize = { width: 200, height: 150 };

  // Demo 1: Movable Video - Absolute positioning with pixel coordinates
  const movableVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, movableVideo);
  engine.block.setPositionX(movableVideo, 50);
  engine.block.setPositionY(movableVideo, 100);

  // Add label for movable video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Movable');
  engine.block.setFloat(text1, 'text/fontSize', 32);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 260);
  engine.block.appendChild(page, text1);

  // Demo 2: Percentage Positioning - Responsive layout
  const percentVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, percentVideo);

  // Set position mode to percentage (0.0 to 1.0)
  engine.block.setPositionXMode(percentVideo, 'Percent');
  engine.block.setPositionYMode(percentVideo, 'Percent');

  // Position at 37.5% from left (300px on 800px width), 20% from top (100px on 500px height)
  engine.block.setPositionX(percentVideo, 0.375);
  engine.block.setPositionY(percentVideo, 0.2);

  // Add label for percentage video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Percentage');
  engine.block.setFloat(text2, 'text/fontSize', 32);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 260);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Video - Cannot be moved, rotated, or scaled
  const lockedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 100);

  // Lock the transform to prevent repositioning
  engine.block.setBool(lockedVideo, 'transformLocked', true);

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Locked');
  engine.block.setFloat(text3, 'text/fontSize', 32);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 260);
  engine.block.appendChild(page, text3);

  // Get current position values
  const currentX = engine.block.getPositionX(movableVideo);
  const currentY = engine.block.getPositionY(movableVideo);
  console.log('Current position:', currentX, currentY);

  // Move relative to current position by adding offset values
  const offsetX = engine.block.getPositionX(movableVideo);
  const offsetY = engine.block.getPositionY(movableVideo);
  engine.block.setPositionX(movableVideo, offsetX + 25);
  engine.block.setPositionY(movableVideo, offsetY + 25);

  // Save the scene to preserve the positioned videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to file
  writeFileSync('output/move-videos-scene.json', sceneString);
  console.log('Saved to output/move-videos-scene.json');

  // Log final positions to verify
  console.log('Video positions:');
  console.log(
    `  Movable video: (${engine.block.getPositionX(movableVideo)}, ${engine.block.getPositionY(movableVideo)})`
  );
  console.log(
    `  Percent video: (${engine.block.getPositionX(percentVideo)}, ${engine.block.getPositionY(percentVideo)}) [Mode: Percent]`
  );
  console.log(
    `  Locked video: (${engine.block.getPositionX(lockedVideo)}, ${engine.block.getPositionY(lockedVideo)}) [Transform locked]`
  );

  console.log('Video positioning guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers positioning videos with absolute or percentage coordinates, configuring position modes, and locking transforms to prevent repositioning.

<NodejsVideoExportNotice {...props} />

## Initialize Headless Engine

Create a headless engine instance for programmatic video manipulation:

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Create the Scene

Create a scene with specific page dimensions:

```typescript highlight-create-scene
// Create a scene with a page
const scene = engine.scene.create('DepthStack');
const page = engine.block.create('page');
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 500);
engine.block.appendChild(scene, page);
```

## Position Coordinates

Coordinates originate at the top-left (0, 0) of the parent container. Use **absolute** mode for fixed pixel values or **percentage** mode (0.0 to 1.0) for responsive layouts that adapt to parent size changes.

## Positioning Videos

Position videos using `engine.block.setPositionX()` and `engine.block.setPositionY()` with absolute pixel coordinates:

```typescript highlight-movable-video
engine.block.appendChild(page, movableVideo);
engine.block.setPositionX(movableVideo, 50);
engine.block.setPositionY(movableVideo, 100);
```

## Getting Current Position

Read current position values using `engine.block.getPositionX()` and `engine.block.getPositionY()`. Values are returned in the current position mode (absolute pixels or percentage 0.0-1.0):

```typescript highlight-get-position
// Get current position values
const currentX = engine.block.getPositionX(movableVideo);
const currentY = engine.block.getPositionY(movableVideo);
```

## Configuring Position Modes

Control how position values are interpreted using `engine.block.setPositionXMode()` and `engine.block.setPositionYMode()`. Set to `'Absolute'` for pixels or `'Percent'` for percentage values (0.0 to 1.0). Check the current mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. The Percentage Positioning section below demonstrates setting these modes.

## Percentage Positioning

Position videos using percentage values (0.0 to 1.0) for responsive layouts. Set the position mode to `'Percent'`, then use values between 0.0 and 1.0:

```typescript highlight-percentage-positioning
// Set position mode to percentage (0.0 to 1.0)
engine.block.setPositionXMode(percentVideo, 'Percent');
engine.block.setPositionYMode(percentVideo, 'Percent');
```

Percentage positioning adapts automatically when the parent block dimensions change, maintaining relative positions in responsive designs.

## Relative Positioning

Move videos relative to their current position by getting the current coordinates and adding offset values:

```typescript highlight-relative-positioning
// Move relative to current position by adding offset values
const offsetX = engine.block.getPositionX(movableVideo);
const offsetY = engine.block.getPositionY(movableVideo);
engine.block.setPositionX(movableVideo, offsetX + 25);
engine.block.setPositionY(movableVideo, offsetY + 25);
```

## Locking Transforms

Lock transforms to prevent repositioning, rotation, and scaling by setting `transformLocked` to true:

```typescript highlight-locked-video
// Lock the transform to prevent repositioning
engine.block.setBool(lockedVideo, 'transformLocked', true);
```

## Save Scene

Save the scene to a file. The scene can later be loaded again for further editing, or rendered to an MP4 video — the native `@cesdk/node-native` package exports video directly via `engine.block.exportVideo()`, while the WASM-based `@cesdk/node` package requires the CE.SDK Renderer for video export:

```typescript highlight-export
  // Save the scene to preserve the positioned videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to file
  writeFileSync('output/move-videos-scene.json', sceneString);
  console.log('Saved to output/move-videos-scene.json');

  // Log final positions to verify
  console.log('Video positions:');
  console.log(
    `  Movable video: (${engine.block.getPositionX(movableVideo)}, ${engine.block.getPositionY(movableVideo)})`
  );
  console.log(
    `  Percent video: (${engine.block.getPositionX(percentVideo)}, ${engine.block.getPositionY(percentVideo)}) [Mode: Percent]`
  );
  console.log(
    `  Locked video: (${engine.block.getPositionX(lockedVideo)}, ${engine.block.getPositionY(lockedVideo)}) [Transform locked]`
  );
```

## Cleanup

Always dispose the engine to free resources when done:

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Video Not Moving

Check if transforms are locked using `engine.block.getBool(block, 'transformLocked')`. Ensure the video block exists and values are within parent bounds.

### Unexpected Position Values

Check position mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. Verify if using absolute (pixels) vs percentage (0.0-1.0) values. Review parent block dimensions if using percentage positioning.

### Positioned Outside Visible Area

Verify parent block dimensions and boundaries. Check coordinate system: origin is top-left, not center. Review X/Y values for calculation errors.

### Percentage Positioning Not Responsive

Ensure position mode is set to `'Percent'` using `engine.block.setPositionXMode(block, 'Percent')`. Verify percentage values are between 0.0 and 1.0. Check that parent block dimensions can change.

## API Reference

| Method                            | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `CreativeEngine.init()`           | Initializes the headless engine for programmatic creation |
| `engine.scene.create()`           | Creates a new scene                                       |
| `engine.block.findByType()`       | Finds blocks by type                                      |
| `engine.block.addVideo()`         | Create and position video in one operation                |
| `engine.block.setPositionX()`     | Set X coordinate value                                    |
| `engine.block.setPositionY()`     | Set Y coordinate value                                    |
| `engine.block.getPositionX()`     | Get current X coordinate value                            |
| `engine.block.getPositionY()`     | Get current Y coordinate value                            |
| `engine.block.setPositionXMode()` | Set position mode for X coordinate                        |
| `engine.block.setPositionYMode()` | Set position mode for Y coordinate                        |
| `engine.block.getPositionXMode()` | Get position mode for X coordinate                        |
| `engine.block.getPositionYMode()` | Get position mode for Y coordinate                        |
| `engine.block.setBool()`          | Set transform lock state                                  |
| `engine.block.getBool()`          | Get transform lock state                                  |
| `engine.scene.saveToString()`     | Save scene to string for later use                        |
| `engine.dispose()`                | Dispose engine and free resources                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support