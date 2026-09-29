> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Resize](./edit-video/transform/resize.md)

---

The **CreativeEditor SDK (CE.SDK)** provides programmatic video resizing for server-side workflows. This guide covers resizing videos in headless mode, from absolute pixel dimensions to percentage-based responsive layouts.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-video-transform-resize-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-video-transform-resize-server-js)

```typescript file=@cesdk_web_examples/guides-edit-video-transform-resize-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Resize Videos
 *
 * Demonstrates video resizing in headless mode:
 * - Absolute sizing with pixel dimensions
 * - Percentage-based sizing for responsive layouts
 * - Getting current dimensions
 * - Locking transforms to prevent resizing
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

  // Demo 1: Resizable Video - Absolute sizing with pixel dimensions
  console.log('Loading video 1/3 (Resizable)...');
  const resizableVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, resizableVideo);
  engine.block.setWidth(resizableVideo, 200);
  engine.block.setHeight(resizableVideo, 150);
  engine.block.setPositionX(resizableVideo, 50);
  engine.block.setPositionY(resizableVideo, 100);
  console.log('✓ Video 1/3 loaded');

  // Add label for resizable video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Resizable');
  engine.block.setFloat(text1, 'text/fontSize', 32);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 260);
  engine.block.appendChild(page, text1);

  // Demo 2: Percentage Sizing - Responsive layout
  console.log('Loading video 2/3 (Percentage)...');
  const percentVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, percentVideo);

  // Set size mode to percentage (0.0 to 1.0)
  engine.block.setWidthMode(percentVideo, 'Percent');
  engine.block.setHeightMode(percentVideo, 'Percent');
  // Set to 25% width, 30% height of parent
  engine.block.setWidth(percentVideo, 0.25);
  engine.block.setHeight(percentVideo, 0.3);

  engine.block.setPositionX(percentVideo, 300);
  engine.block.setPositionY(percentVideo, 100);
  console.log('✓ Video 2/3 loaded');

  // Add label for percentage video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Percentage');
  engine.block.setFloat(text2, 'text/fontSize', 32);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 260);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Video - Cannot be resized
  console.log('Loading video 3/3 (Locked)...');
  const lockedVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 100);

  // Lock the transform to prevent resizing
  engine.block.setTransformLocked(lockedVideo, true);
  console.log('✓ Video 3/3 loaded');

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Locked');
  engine.block.setFloat(text3, 'text/fontSize', 32);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 260);
  engine.block.appendChild(page, text3);

  // Get current dimensions
  const currentWidth = engine.block.getWidth(resizableVideo);
  const currentHeight = engine.block.getHeight(resizableVideo);
  console.log('Current dimensions:', currentWidth, 'x', currentHeight);

  // Check size mode
  const widthMode = engine.block.getWidthMode(percentVideo);
  const heightMode = engine.block.getHeightMode(percentVideo);
  console.log('Size modes:', widthMode, heightMode);

  // Save the scene to preserve the resized videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file (standard CE.SDK scene format)
  writeFileSync('output/resize-videos-scene.imgly', sceneString);
  console.log('✓ Saved to output/resize-videos-scene.imgly');

  // Log final dimensions to verify
  console.log('\nVideo dimensions:');
  console.log(
    `  Resizable video: ${engine.block.getWidth(resizableVideo)}x${engine.block.getHeight(resizableVideo)} [Mode: Absolute]`
  );
  console.log(
    `  Percent video: ${engine.block.getWidth(percentVideo)}x${engine.block.getHeight(percentVideo)} [Mode: Percent]`
  );
  console.log(
    `  Locked video: ${engine.block.getWidth(lockedVideo)}x${engine.block.getHeight(lockedVideo)} [Transform locked]`
  );

  console.log('\n✓ Video resizing guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

<NodejsVideoExportNotice {...props} />

## What You'll Learn

- Initialize a **headless engine** for server-side processing.
- Resize clips using **absolute pixel dimensions**.
- Resize using **percentage values** for responsive layouts.
- **Lock transforms** to prevent resizing.
- **Save scenes** for later rendering.

### When to Use

Resize videos programmatically to:

- Fit **template areas** in automated workflows.
- Create videos for multiple **aspect ratios** from a single source.
- Build **batch processing** pipelines.
- Generate videos for different **social media formats**.
- Combine with trimming or cropping in headless workflows.

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

## Resize a Video Block with JavaScript

Use the CreativeEngine BlockAPI to edit a video's size. Two methods exist: choose the one that best suits your project.

### Set Absolute Sizing

Set the video's absolute size with `setWidth` and `setHeight`. First, create the video block with `addVideo`, then set explicit pixel dimensions:

```typescript highlight-resizable-video
const resizableVideo = await engine.block.addVideo(videoUri, 200, 150);
engine.block.appendChild(page, resizableVideo);
engine.block.setWidth(resizableVideo, 200);
engine.block.setHeight(resizableVideo, 150);
engine.block.setPositionX(resizableVideo, 50);
engine.block.setPositionY(resizableVideo, 100);
```

### Set Relative Sizing

Set the video's size relative to its parent (for example, to the page):

1. Set the size mode with `setWidthMode` and `setHeightMode`.
2. Define the mode as `'Percent'`.
3. Set the size in normalized values, with `1` being full-width.

```typescript highlight-percentage-sizing
// Set size mode to percentage (0.0 to 1.0)
engine.block.setWidthMode(percentVideo, 'Percent');
engine.block.setHeightMode(percentVideo, 'Percent');
// Set to 25% width, 30% height of parent
engine.block.setWidth(percentVideo, 0.25);
engine.block.setHeight(percentVideo, 0.3);
```

The preceding code:

- Sets the clip to 25% width of its parent.
- Makes the clip 30% as tall.
- Stays responsive to the parent's size changes.

This method allows for the clip to follow the parent's size changes while maintaining proportional dimensions.

### Get Current Dimensions

Read current size values using `getWidth` and `getHeight`. Values are returned in the current size mode (absolute pixels or percentage 0.0-1.0):

```typescript highlight-get-dimensions
// Get current dimensions
const currentWidth = engine.block.getWidth(resizableVideo);
const currentHeight = engine.block.getHeight(resizableVideo);
```

### Check Size Mode

Query the current size mode using `getWidthMode` and `getHeightMode`:

```typescript highlight-get-size-mode
// Check size mode
const widthMode = engine.block.getWidthMode(percentVideo);
const heightMode = engine.block.getHeightMode(percentVideo);
```

## Lock or Constrain Resizing

Lock all transforms entirely to prevent resizing, repositioning, and rotation:

```typescript highlight-locked-video
// Lock the transform to prevent resizing
engine.block.setTransformLocked(lockedVideo, true);
```

This deactivates all transform actions, resize included.

## Save Scene

Save the scene to a file. The scene can later be loaded again for further editing, or rendered to an MP4 video — the native `@cesdk/node-native` package exports video directly via `engine.block.exportVideo()`, while the WASM-based `@cesdk/node` package requires the CE.SDK Renderer for video export:

```typescript highlight-export
  // Save the scene to preserve the resized videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file (standard CE.SDK scene format)
  writeFileSync('output/resize-videos-scene.imgly', sceneString);
  console.log('✓ Saved to output/resize-videos-scene.imgly');

  // Log final dimensions to verify
  console.log('\nVideo dimensions:');
  console.log(
    `  Resizable video: ${engine.block.getWidth(resizableVideo)}x${engine.block.getHeight(resizableVideo)} [Mode: Absolute]`
  );
  console.log(
    `  Percent video: ${engine.block.getWidth(percentVideo)}x${engine.block.getHeight(percentVideo)} [Mode: Percent]`
  );
  console.log(
    `  Locked video: ${engine.block.getWidth(lockedVideo)}x${engine.block.getHeight(lockedVideo)} [Transform locked]`
  );
```

## Cleanup

Always dispose the engine to free resources when done:

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Notes on Resizing with CE.SDK

| Topic | What you want to do | What happens |
| --- | --- | --- |
| **Block duration** | Resize the block's on-canvas frame. | No need to retime; duration and trims stay untouched. |
| **Content fill** | Switch the block to `.contain` or `.cover`. | Update it with `setContentFillMode`. |
| **Batch processing** | Resize multiple videos programmatically. | Use loops and save each scene to separate files. |

## API Reference

| Method | Description |
| --- | --- |
| `CreativeEngine.init()` | Initializes the headless engine for programmatic creation |
| `engine.scene.create()` | Creates a new scene |
| `engine.block.findByType()` | Finds blocks by type |
| `engine.block.addVideo()` | Create and size video in one operation |
| `engine.block.setWidth()` | Set block width value |
| `engine.block.setHeight()` | Set block height value |
| `engine.block.getWidth()` | Get current width value |
| `engine.block.getHeight()` | Get current height value |
| `engine.block.setWidthMode()` | Set width mode (Absolute or Percent) |
| `engine.block.setHeightMode()` | Set height mode (Absolute or Percent) |
| `engine.block.getWidthMode()` | Get current width mode |
| `engine.block.getHeightMode()` | Get current height mode |
| `engine.block.setTransformLocked()` | Lock all transforms including resize |
| `engine.scene.saveToString()` | Save scene to string for later use |
| `engine.dispose()` | Dispose engine and free resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support