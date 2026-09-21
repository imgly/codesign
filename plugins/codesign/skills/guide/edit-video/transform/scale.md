> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Scale](./edit-video/transform/scale.md)

---

Scale videos proportionally from different anchor points, stretch along a single axis, or group elements to scale together using the headless CE.SDK engine.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-transform-scale-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-transform-scale-server-js)

## What You'll Learn

- Scale videos through **JavaScript**.
- Scale **proportionally** or non-uniformly.
- **Group** elements to scale them together.
- Apply or lock scaling **constraints** in templates.

## When to Use

Use scaling to:

- **Emphasize** or de-emphasize a clip in a composition.
- **Fit** footage to a free-form layout without cropping.
- Drive zoom gestures or **responsive** designs.

## How Scaling Works

Scaling uses the `scale(block, scale, anchorX, anchorY)` function, with the following **parameters**:

| Parameter           | Description                                      | Values                                                                                         |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `block`             | Handle (ID) of the block to scale.               | `number`                                                                                       |
| `scale`             | Scale factor to apply.                           | **1.0** keeps the original size. **>1.0** enlarges the block. **\< 1.0** shrinks it.            |
| `anchorX` `anchorY` | Origin point of scale along the width and height | **Top/Left** = 0, **Center** = 0.5, **Bottom/Right** = 1. **Defaults** = `0`                   |

For example:

- A value of `1.0` sets the original block's size.
- A value of `2.0` makes the block twice as large.

```typescript file=@cesdk_web_examples/guides-create-video-transform-scale-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Scale Videos
 *
 * Demonstrates video scaling in headless mode:
 * - Uniform scaling with different anchor points
 * - Non-uniform scaling (width/height independently)
 * - Locking transforms to prevent scaling
 * - Saving scenes for later rendering
 *
 * Note: Full video export (MP4) requires the CE.SDK Renderer.
 * In headless Node.js mode, we save the scene for later use.
 */

console.log('🚀 Starting CE.SDK Scale Videos Guide...');
console.log('⏳ Initializing engine...');

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

console.log('✓ Engine initialized');

try {
  // Create a scene with a page
  console.log('⏳ Creating scene...');
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 500);
  engine.block.appendChild(scene, page);
  console.log('✓ Scene created');

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Centered 2x2 grid layout for 800x500 canvas
  // Videos: 120x90, scaled to 180x135
  const leftColumnX = 200;
  const rightColumnX = 420;
  const topRowY = 50;
  const bottomRowY = 265;

  // For center-scaled video, compensate for position shift
  // Center scaling shifts top-left by (-30, -22.5) for 1.5x scale on 120x90
  const centerScaleOffsetX = 30;
  const centerScaleOffsetY = 22.5;

  // Demo 1: Uniform scaling from default top-left anchor
  console.log('⏳ Adding uniform scaled video...');
  const uniformVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, uniformVideo);
  engine.block.setPositionX(uniformVideo, leftColumnX);
  engine.block.setPositionY(uniformVideo, topRowY);

  // Scale the video to 150% from the default top-left anchor
  engine.block.scale(uniformVideo, 1.5);
  console.log('✓ Uniform scaled video added (150% from top-left)');

  // Add label for uniform scaled video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Uniform Scale (150%)');
  engine.block.setFloat(text1, 'text/fontSize', 16);
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, leftColumnX);
  engine.block.setPositionY(text1, topRowY + 145);
  engine.block.appendChild(page, text1);

  // Demo 2: Scaling from center anchor
  console.log('⏳ Adding center-scaled video...');
  const centerVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, centerVideo);
  // Position compensates for center scaling shift so final position aligns with grid
  engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
  engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

  // Scale from center anchor (0.5, 0.5)
  engine.block.scale(centerVideo, 1.5, 0.5, 0.5);
  console.log('✓ Center-scaled video added (150% from center)');

  // Add label for center scaled video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Center Scale (150%)');
  engine.block.setFloat(text2, 'text/fontSize', 16);
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, rightColumnX);
  engine.block.setPositionY(text2, topRowY + 145);
  engine.block.appendChild(page, text2);

  // Demo 3: Non-uniform scaling (width only)
  console.log('⏳ Adding width-stretched video...');
  const stretchVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, stretchVideo);
  engine.block.setPositionX(stretchVideo, leftColumnX);
  engine.block.setPositionY(stretchVideo, bottomRowY);

  // Stretch only the width by 1.5x
  engine.block.setWidthMode(stretchVideo, 'Absolute');
  const currentWidth = engine.block.getWidth(stretchVideo);
  engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);
  console.log('✓ Width-stretched video added (150% width only)');

  // Add label for stretched video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Width Stretch (150%)');
  engine.block.setFloat(text3, 'text/fontSize', 16);
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, leftColumnX);
  engine.block.setPositionY(text3, bottomRowY + 145);
  engine.block.appendChild(page, text3);

  // Demo 4: Locked scaling
  console.log('⏳ Adding transform-locked video...');
  const lockedVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, rightColumnX);
  engine.block.setPositionY(lockedVideo, bottomRowY);

  // Lock all transforms to prevent scaling
  engine.block.setTransformLocked(lockedVideo, true);
  console.log('✓ Transform-locked video added');

  // Add label for locked video
  const text4 = engine.block.create('text');
  engine.block.setString(text4, 'text/text', 'Transform Locked');
  engine.block.setFloat(text4, 'text/fontSize', 16);
  engine.block.setWidth(text4, 200);
  engine.block.setPositionX(text4, rightColumnX);
  engine.block.setPositionY(text4, bottomRowY + 145);
  engine.block.appendChild(page, text4);

  // Save the scene to preserve the scaled videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('⏳ Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file
  writeFileSync('output/scale-videos.imgly', sceneString);
  console.log('✓ Scene saved to output/scale-videos.imgly');

  // Log scale information to verify
  console.log('\n📊 Video scaling results:');
  console.log(
    `  Uniform video: ${engine.block.getWidth(uniformVideo).toFixed(1)}x${engine.block.getHeight(uniformVideo).toFixed(1)}`
  );
  console.log(
    `  Center video: ${engine.block.getWidth(centerVideo).toFixed(1)}x${engine.block.getHeight(centerVideo).toFixed(1)}`
  );
  console.log(
    `  Stretched video: ${engine.block.getWidth(stretchVideo).toFixed(1)}x${engine.block.getHeight(stretchVideo).toFixed(1)}`
  );
  console.log(`  Locked video: Transform locked = true`);

  console.log('\n✅ Scale videos guide completed successfully!');
} finally {
  // Always dispose the engine to free resources
  console.log('⏳ Disposing engine...');
  engine.dispose();
  console.log('✓ Engine disposed');
}
```

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
console.log('⏳ Creating scene...');
const scene = engine.scene.create('DepthStack');
const page = engine.block.create('page');
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 500);
engine.block.appendChild(scene, page);
```

## Scale a Video Uniformly

To change the clip size without distorting its proportions, use uniform scaling. Uniform scaling multiplies both width and height by the **same factor** to keep the frame's aspect ratio intact.

Scaling a video uniformly allows you to:

- Enlarge or shrink footage without altering the content.
- Maintain per-pixel sharpness.
- Align with layout constraints.

CE.SDK lets you use the same high-level API on all graphic blocks, videos included. To scale any block, use `engine.block.scale()`:

```typescript highlight-uniform-scale
  const uniformVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, uniformVideo);
  engine.block.setPositionX(uniformVideo, leftColumnX);
  engine.block.setPositionY(uniformVideo, topRowY);

  // Scale the video to 150% from the default top-left anchor
  engine.block.scale(uniformVideo, 1.5);
```

The preceding code:

- Scales the video to 150% of its original size.
- Doesn't change the origin anchor point.

As a result, the video expands down and to the right.

### Anchor Point

The anchor point is the point around which a layer scales. All changes happen around the anchor's point position. By default, any block's anchor point is **the top left**.

To **change the anchor point**, the scale function has two optional parameters:

- `anchorX` to move the anchor point along the width.
- `anchorY` to move the anchor point along the height.

Both can have values between 0.0 and 1.0. For example, to scale from the center:

```typescript highlight-center-scale
  const centerVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, centerVideo);
  // Position compensates for center scaling shift so final position aligns with grid
  engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
  engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

  // Scale from center anchor (0.5, 0.5)
  engine.block.scale(centerVideo, 1.5, 0.5, 0.5);
```

This function:

1. Scales the video to **150%** of its original size.
2. Sets the origin anchor point at the center with `0.5, 0.5`.

This way, the video expands from the center equally in all directions.

## Scale Videos Non-Uniformly

You might need to stretch a video only horizontally or vertically. To stretch or compress only one axis, thus distorting a video, use the **width** or **height** functions.

```typescript highlight-nonuniform-scale
  const stretchVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, stretchVideo);
  engine.block.setPositionX(stretchVideo, leftColumnX);
  engine.block.setPositionY(stretchVideo, bottomRowY);

  // Stretch only the width by 1.5x
  engine.block.setWidthMode(stretchVideo, 'Absolute');
  const currentWidth = engine.block.getWidth(stretchVideo);
  engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);
```

The preceding code:

1. Sets the width mode to `'Absolute'` to edit the video using a fixed pixel value instead of a relative layout mode.
2. Reads the current width.
3. Multiplies it by 1.5 to compute a new width that's 150% of the original.
4. Writes the new width back to the block with `maintainCrop` set to `true`.

Use this to:

- Create panoramic crops.
- Compensate for aspect ratios during automation.

### Respect the Existing Crop

The crop defines which part of the clip stays visible. Stretching the block without preserving its crop might:

- Reveal unwanted areas.
- Cut off the focal point.

The `maintainCrop` parameter (third argument to `setWidth`) keeps the visible region intact and avoids distortion. Consider using `maintainCrop` if a **template** already uses cropping to frame a subject or hide a watermark.

## Scale Clips Together

Grouping blocks is a useful way of scaling them proportionally. Use `engine.block.group()` to combine blocks into a group, then scale the group as a single unit:

```typescript
const groupId = engine.block.group([videoBlockId, textBlockId]);
engine.block.scale(groupId, 1.5, 0.5, 0.5);
```

The preceding code scales the entire group to 150% from the center anchor.

> **Warning:** You can't group `page` with other blocks. Group elements on the **top** of the page, **not** with the page itself.

## Lock Scaling in Templates

To preserve a template's layout, consider locking the scaling option. This is useful for:

- Brand assets
- Campaign creatives
- Collaboration workflows
- Fixed dimensions swapping editors

```typescript highlight-locked-scale
  const lockedVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, rightColumnX);
  engine.block.setPositionY(lockedVideo, bottomRowY);

  // Lock all transforms to prevent scaling
  engine.block.setTransformLocked(lockedVideo, true);
```

### Disable Resize Scope

Disable the `layer/resize` scope when working with templates to **prevent users from scaling** blocks:

```typescript
engine.block.setScopeEnabled(blockId, 'layer/resize', false);
```

### Lock All Transformations

To **lock** all transformations (move, resize, rotate), use `setTransformLocked`:

```typescript
engine.block.setTransformLocked(blockId, true);
```

To check if scaling is currently allowed:

```typescript
const canResize = engine.block.isScopeEnabled(blockId, 'layer/resize');
console.log('layer/resize scope enabled?', canResize);
```

## Save Scene

Save the scene to a file. The scene can later be loaded again for further editing, or rendered to an MP4 video — the native `@cesdk/node-native` package exports video directly via `engine.block.exportVideo()`, while the WASM-based `@cesdk/node` package requires the CE.SDK Renderer for video export:

```typescript highlight-export
  // Save the scene to preserve the scaled videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('⏳ Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file
  writeFileSync('output/scale-videos.imgly', sceneString);
  console.log('✓ Scene saved to output/scale-videos.imgly');

  // Log scale information to verify
  console.log('\n📊 Video scaling results:');
  console.log(
    `  Uniform video: ${engine.block.getWidth(uniformVideo).toFixed(1)}x${engine.block.getHeight(uniformVideo).toFixed(1)}`
  );
  console.log(
    `  Center video: ${engine.block.getWidth(centerVideo).toFixed(1)}x${engine.block.getHeight(centerVideo).toFixed(1)}`
  );
  console.log(
    `  Stretched video: ${engine.block.getWidth(stretchVideo).toFixed(1)}x${engine.block.getHeight(stretchVideo).toFixed(1)}`
  );
  console.log(`  Locked video: Transform locked = true`);
```

## Cleanup

Always dispose the engine to free resources when done:

```typescript highlight-cleanup
// Always dispose the engine to free resources
console.log('⏳ Disposing engine...');
engine.dispose();
console.log('✓ Engine disposed');
```

## Troubleshooting

### Video Not Scaling

Check if transforms are locked using `engine.block.isTransformLocked(block)`. Ensure the block exists and is a valid design block.

### Unexpected Position After Scale

Verify the anchor point coordinates. Default anchor (0, 0) causes expansion to the right and down. Use (0.5, 0.5) for center-based scaling.

### Crop Region Shifting

When using `setWidth` or `setHeight`, pass `true` as the third parameter to maintain the crop region.

## Recap

| Usage              | How To                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Uniform scaling    | `engine.block.scale(blockId, scaleFactor)` + optional anchor                                   |
| Stretching an axis | Set width mode to `'Absolute'`, then use `setWidth()` or `setHeight()`                         |
| Group scaling      | 1. Group with `engine.block.group([blockId_1, blockId_2])` 2. Scale the group                  |
| Constraints        | Adjust scopes or lock transforms to protect templates                                          |

## API Reference

| API                          | Usage                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| `CreativeEngine.init`        | Initializes the headless engine for programmatic creation.         |
| `scene.create`               | Creates a new scene.                                               |
| `block.scale`                | Performs uniform or anchored scaling on blocks and groups.         |
| `block.setWidthMode`         | Enables absolute sizing before changing a single axis.             |
| `block.getWidth`             | Reads the current width before non-uniform scaling.                |
| `block.setWidth`             | Writes the adjusted width after single-axis scaling.               |
| `block.setHeightMode`        | Enables absolute sizing for height changes.                        |
| `block.getHeight`            | Reads the current height before non-uniform scaling.               |
| `block.setHeight`            | Writes the adjusted height after single-axis scaling.              |
| `block.group`                | Group blocks so they scale together.                               |
| `block.setScopeEnabled`      | Toggles the `layer/resize` scope to lock scaling in templates.     |
| `block.setTransformLocked`   | Locks all transform scopes when templates must stay fixed.         |
| `block.isScopeEnabled`       | Checks whether scaling is currently permitted on a block.          |
| `block.isTransformLocked`    | Checks whether all transforms are locked on a block.               |
| `scene.saveToString`         | Saves the scene for later use or rendering.                        |
| `engine.dispose`             | Disposes the engine and frees resources.                           |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support