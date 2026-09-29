> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Rotate](./edit-video/transform/rotate.md)

---

Rotate video elements to any angle using radians or degrees, with precise programmatic control in headless Node.js environments.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-transform-rotate-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-transform-rotate-server-js)

Rotation in CE.SDK occurs around the block's center point. All rotation values use radians, where `Math.PI` equals 180 degrees. Positive values rotate counterclockwise, negative values rotate clockwise.

```typescript file=@cesdk_web_examples/guides-create-video-transform-rotate-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Rotate Videos
 *
 * Demonstrates video rotation in headless mode:
 * - Setting rotation angles in radians
 * - Converting between degrees and radians
 * - Getting current rotation values
 * - Locking rotation on specific blocks
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

  // Helper functions for angle conversion
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;

  // Demo 1: Rotated Video - 45 degree rotation
  console.log('Loading video 1 of 3...');
  const rotatedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, rotatedVideo);
  engine.block.setPositionX(rotatedVideo, 50);
  engine.block.setPositionY(rotatedVideo, 100);
  console.log('✓ Video 1 loaded');

  // Rotate the video 45 degrees (convert to radians)
  engine.block.setRotation(rotatedVideo, toRadians(45));

  // Add label for rotated video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', '45° Rotation');
  engine.block.setFloat(text1, 'text/fontSize', 28);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 280);
  engine.block.appendChild(page, text1);

  // Get current rotation value
  const currentRotation = engine.block.getRotation(rotatedVideo);
  console.log('Current rotation:', toDegrees(currentRotation), 'degrees');

  // Demo 2: 90 Degree Rotation
  console.log('Loading video 2 of 3...');
  const rotatedVideo90 = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, rotatedVideo90);
  engine.block.setPositionX(rotatedVideo90, 300);
  engine.block.setPositionY(rotatedVideo90, 100);
  console.log('✓ Video 2 loaded');

  // Rotate 90 degrees using Math.PI / 2
  engine.block.setRotation(rotatedVideo90, Math.PI / 2);

  // Add label for 90 degree rotation
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', '90° Rotation');
  engine.block.setFloat(text2, 'text/fontSize', 28);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 280);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Rotation - Rotation is disabled for this block
  console.log('Loading video 3 of 3...');
  const lockedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 150);
  console.log('✓ Video 3 loaded');

  // Disable rotation for this specific block
  engine.block.setScopeEnabled(lockedVideo, 'layer/rotate', false);

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Rotation Locked');
  engine.block.setFloat(text3, 'text/fontSize', 28);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 320);
  engine.block.appendChild(page, text3);

  // Check if rotation is enabled for a block
  const canRotate = engine.block.isScopeEnabled(lockedVideo, 'layer/rotate');
  console.log('Rotation enabled:', canRotate);

  // Save the scene to preserve the rotated videos
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
  writeFileSync('output/rotate-videos.imgly', sceneString);
  console.log('Saved to output/rotate-videos.imgly');

  // Log final rotation values to verify
  console.log('Video rotations:');
  console.log(
    `  Rotated video (45°): ${toDegrees(engine.block.getRotation(rotatedVideo)).toFixed(1)}°`
  );
  console.log(
    `  Rotated video (90°): ${toDegrees(engine.block.getRotation(rotatedVideo90)).toFixed(1)}°`
  );
  console.log(
    `  Locked video: ${toDegrees(engine.block.getRotation(lockedVideo)).toFixed(1)}° [Rotation locked]`
  );

  console.log('Video rotation guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers rotating videos programmatically, converting between degrees and radians, grouping blocks for collective rotation, and locking rotation permissions.

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

## Converting Degrees and Radians

CE.SDK uses radians for rotation values. Create helper functions to convert between degrees and radians:

```typescript highlight-convert-angles
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;
```

## Rotating Videos

Rotate videos using `engine.block.setRotation()` with the angle in radians. Convert from degrees using the formula `radians = degrees * Math.PI / 180`:

```typescript highlight-rotate-video
// Rotate the video 45 degrees (convert to radians)
engine.block.setRotation(rotatedVideo, toRadians(45));
```

## Getting Current Rotation

Read the current rotation value using `engine.block.getRotation()`. The value is returned in radians. Convert to degrees with `degrees = radians * 180 / Math.PI`:

```typescript highlight-get-rotation
// Get current rotation value
const currentRotation = engine.block.getRotation(rotatedVideo);
console.log('Current rotation:', toDegrees(currentRotation), 'degrees');
```

## Common Rotation Angles

For 90-degree rotations, use `Math.PI / 2`. For 180 degrees, use `Math.PI`. For 270 degrees, use `3 * Math.PI / 2`:

```typescript highlight-rotate-90
// Rotate 90 degrees using Math.PI / 2
engine.block.setRotation(rotatedVideo90, Math.PI / 2);
```

## Locking Rotation

Disable rotation for specific blocks using `engine.block.setScopeEnabled()` with the `'layer/rotate'` scope set to false:

```typescript highlight-lock-rotation
// Disable rotation for this specific block
engine.block.setScopeEnabled(lockedVideo, 'layer/rotate', false);
```

## Checking Rotation Permissions

Check if rotation is enabled for a block using `engine.block.isScopeEnabled()`:

```typescript highlight-check-scope
// Check if rotation is enabled for a block
const canRotate = engine.block.isScopeEnabled(lockedVideo, 'layer/rotate');
console.log('Rotation enabled:', canRotate);
```

## Save Scene

Save the scene to a file. The scene can later be loaded again for further editing, or rendered to an MP4 video — the native `@cesdk/node-native` package exports video directly via `engine.block.exportVideo()`, while the WASM-based `@cesdk/node` package requires the CE.SDK Renderer for video export:

```typescript highlight-export
  // Save the scene to preserve the rotated videos
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
  writeFileSync('output/rotate-videos.imgly', sceneString);
  console.log('Saved to output/rotate-videos.imgly');

  // Log final rotation values to verify
  console.log('Video rotations:');
  console.log(
    `  Rotated video (45°): ${toDegrees(engine.block.getRotation(rotatedVideo)).toFixed(1)}°`
  );
  console.log(
    `  Rotated video (90°): ${toDegrees(engine.block.getRotation(rotatedVideo90)).toFixed(1)}°`
  );
  console.log(
    `  Locked video: ${toDegrees(engine.block.getRotation(lockedVideo)).toFixed(1)}° [Rotation locked]`
  );
```

## Cleanup

Always dispose the engine to free resources when done:

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Rotation Has No Effect

Verify the block exists in the scene and is not a page block. Check if rotation is locked using `engine.block.isScopeEnabled(block, 'layer/rotate')`.

### Unexpected Rotation Direction

Remember that positive values rotate counterclockwise in CE.SDK. To rotate clockwise, use negative radian values.

## API Reference

| Method                             | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| `CreativeEngine.init()`            | Initializes the headless engine for programmatic creation |
| `engine.scene.create()`            | Creates a new scene                                       |
| `engine.block.findByType()`        | Finds blocks by type                                      |
| `engine.block.setRotation()`       | Set block rotation in radians                             |
| `engine.block.getRotation()`       | Get current rotation in radians                           |
| `engine.block.setScopeEnabled()`   | Enable/disable `'layer/rotate'` scope                     |
| `engine.block.isScopeEnabled()`    | Check if rotation is allowed                              |
| `engine.block.setTransformLocked()`| Lock all transforms including rotation                    |
| `engine.scene.saveToString()`      | Save scene to string for later use                        |
| `engine.dispose()`                 | Dispose engine and free resources                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support