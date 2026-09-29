> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Redaction](./edit-video/redaction.md)

---

Redact sensitive video content using blur, pixelization, or solid overlays for privacy protection.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-redaction-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-redaction-server-js)

CE.SDK applies effects to blocks themselves, not as overlays affecting content beneath. This means redaction involves applying effects directly to the block for complete obscuration. Four techniques cover most privacy scenarios: full-block blur, radial blur, pixelization, and solid overlays.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-create-video-redaction-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { mkdir, writeFile } from 'fs/promises';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Video Redaction
 *
 * Demonstrates video redaction techniques in CE.SDK:
 * - Full-block blur for complete video obscuration
 * - Radial blur for circular redaction patterns
 * - Pixelization for mosaic-style censoring
 * - Solid overlays for complete blocking
 * - Time-based redactions
 */

// Video URL for demonstrating redaction scenarios
const VIDEO_URL =
  'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

// Duration for each video segment (in seconds)
const SEGMENT_DURATION = 5.0;

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with a page
  const pageWidth = 1920;
  const pageHeight = 1080;
  const scene = engine.scene.create('DepthStack');

  // Create a page
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page to 16:9 landscape (1920x1080 is standard HD video resolution)
  engine.block.setWidth(page, pageWidth);
  engine.block.setHeight(page, pageHeight);

  // Set page duration to accommodate all videos (5 segments x 5 seconds)
  engine.block.setDuration(page, 5 * SEGMENT_DURATION);

  // Create a track to hold the video clips
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Create video blocks for each redaction technique demonstration
  console.log('Loading video blocks...');

  console.log('  Loading video 1/5 (radial blur)...');
  const radialVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 0 }
    }
  );
  engine.block.appendChild(track, radialVideo);

  console.log('  Loading video 2/5 (full-block blur)...');
  const fullBlurVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, fullBlurVideo);

  console.log('  Loading video 3/5 (pixelization)...');
  const pixelVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 2 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, pixelVideo);

  console.log('  Loading video 4/5 (solid overlay)...');
  const overlayVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 3 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, overlayVideo);

  console.log('  Loading video 5/5 (time-based blur)...');
  const timedVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 4 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, timedVideo);

  console.log('All videos loaded.');

  // Resize all track children to fill the page dimensions
  engine.block.fillParent(track);

  // Full-Block Blur: Apply blur to entire video
  // Use this when the entire video content needs obscuring
  console.log('Applying redaction effects...');

  // Check if the block supports blur
  const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
  console.log('Video supports blur:', supportsBlur);

  // Create and apply uniform blur to entire video
  const uniformBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.7);
  engine.block.setBlur(fullBlurVideo, uniformBlur);
  engine.block.setBlurEnabled(fullBlurVideo, true);

  // Pixelization: Apply mosaic effect for clearly intentional censoring

  // Check if the block supports effects
  if (engine.block.supportsEffects(pixelVideo)) {
    // Create and apply pixelize effect
    const pixelizeEffect = engine.block.createEffect('pixelize');
    engine.block.setInt(
      pixelizeEffect,
      'effect/pixelize/horizontalPixelSize',
      24
    );
    engine.block.setInt(
      pixelizeEffect,
      'effect/pixelize/verticalPixelSize',
      24
    );
    engine.block.appendEffect(pixelVideo, pixelizeEffect);
    engine.block.setEffectEnabled(pixelizeEffect, true);
  }

  // Solid Overlay: Create opaque shape for complete blocking
  // Best for highly sensitive information like documents or credentials

  // Create a solid rectangle overlay
  const overlay = engine.block.create('//ly.img.ubq/graphic');
  const rectShape = engine.block.createShape('//ly.img.ubq/shape/rect');
  engine.block.setShape(overlay, rectShape);

  // Create solid black fill
  const solidFill = engine.block.createFill('//ly.img.ubq/fill/color');
  engine.block.setColor(solidFill, 'fill/color/value', {
    r: 0.1,
    g: 0.1,
    b: 0.1,
    a: 1.0
  });
  engine.block.setFill(overlay, solidFill);

  // Position and size the overlay
  engine.block.setWidth(overlay, pageWidth * 0.4);
  engine.block.setHeight(overlay, pageHeight * 0.3);
  engine.block.setPositionX(overlay, pageWidth * 0.55);
  engine.block.setPositionY(overlay, pageHeight * 0.65);
  engine.block.setTimeOffset(overlay, 3 * SEGMENT_DURATION);
  engine.block.setDuration(overlay, SEGMENT_DURATION);
  engine.block.appendChild(page, overlay);

  // Time-Based Redaction: Redaction appears only during specific time range

  // Apply blur to the video
  const timedBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
  engine.block.setBlur(timedVideo, timedBlur);
  engine.block.setBlurEnabled(timedVideo, true);

  // The video is already timed to appear at a specific offset
  // You can adjust timeOffset and duration to control when redaction is visible
  engine.block.setTimeOffset(timedVideo, 4 * SEGMENT_DURATION);
  engine.block.setDuration(timedVideo, SEGMENT_DURATION);

  // Radial Blur: Use radial blur for face-like regions

  // Apply radial blur for circular redaction effect
  const radialBlur = engine.block.createBlur('radial');
  engine.block.setFloat(radialBlur, 'blur/radial/blurRadius', 50);
  engine.block.setFloat(radialBlur, 'blur/radial/radius', 25);
  engine.block.setFloat(radialBlur, 'blur/radial/gradientRadius', 35);
  engine.block.setFloat(radialBlur, 'blur/radial/x', 0.5);
  engine.block.setFloat(radialBlur, 'blur/radial/y', 0.45);
  engine.block.setBlur(radialVideo, radialBlur);
  engine.block.setBlurEnabled(radialVideo, true);

  // Save the scene to a file for later use or export
  await mkdir('output', { recursive: true });
  const sceneData = await engine.scene.saveToString();
  await writeFile('output/redacted-video.imgly', sceneData);
  console.log('Scene saved to output/redacted-video.imgly');

  console.log('');
  console.log('Video redaction guide complete.');
  console.log('Created scene with 5 redaction techniques:');
  console.log('  1. Radial blur (0-5s)');
  console.log('  2. Full-block blur (5-10s)');
  console.log('  3. Pixelization (10-15s)');
  console.log('  4. Solid overlay (15-20s)');
  console.log('  5. Time-based blur (20-25s)');
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
```

This guide covers how to apply redaction programmatically using blur, pixelization, solid overlays, and time-based controls.

## Prerequisites and Setup

We start by initializing CE.SDK in headless mode for server-side video processing.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The engine runs without a UI, making it suitable for automated workflows, batch processing, or backend services.

## Creating the Scene

We create a scene and page for the video composition.

```typescript highlight=highlight-create-scene
  // Create a scene with a page
  const pageWidth = 1920;
  const pageHeight = 1080;
  const scene = engine.scene.create('DepthStack');

  // Create a page
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page to 16:9 landscape (1920x1080 is standard HD video resolution)
  engine.block.setWidth(page, pageWidth);
  engine.block.setHeight(page, pageHeight);

  // Set page duration to accommodate all videos (5 segments x 5 seconds)
  engine.block.setDuration(page, 5 * SEGMENT_DURATION);
```

We create a scene with `scene.create()`, then explicitly create a page and append it to the scene. The page dimensions set the video resolution, and the page duration determines how long the composition plays.

## Creating Video Blocks

We create a track to hold video clips, then add video blocks for each redaction technique.

```typescript highlight=highlight-create-videos
  // Create a track to hold the video clips
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Create video blocks for each redaction technique demonstration
  console.log('Loading video blocks...');

  console.log('  Loading video 1/5 (radial blur)...');
  const radialVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 0 }
    }
  );
  engine.block.appendChild(track, radialVideo);

  console.log('  Loading video 2/5 (full-block blur)...');
  const fullBlurVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, fullBlurVideo);

  console.log('  Loading video 3/5 (pixelization)...');
  const pixelVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 2 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, pixelVideo);

  console.log('  Loading video 4/5 (solid overlay)...');
  const overlayVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 3 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, overlayVideo);

  console.log('  Loading video 5/5 (time-based blur)...');
  const timedVideo = await engine.block.addVideo(
    VIDEO_URL,
    pageWidth,
    pageHeight,
    {
      timeline: { duration: SEGMENT_DURATION, timeOffset: 4 * SEGMENT_DURATION }
    }
  );
  engine.block.appendChild(track, timedVideo);

  console.log('All videos loaded.');

  // Resize all track children to fill the page dimensions
  engine.block.fillParent(track);
```

Videos are added to a track which organizes them for sequential playback. Each video is positioned at a different time offset to demonstrate each redaction technique. The `fillParent` call ensures all clips fill the page dimensions.

## Understanding Redaction in CE.SDK

### How Effects Work

Effects in CE.SDK modify the block's appearance directly rather than creating transparent overlays that affect content beneath. When you blur a video block, the entire block becomes blurred—not just a region on top of the video.

### Choosing a Redaction Technique

Select your technique based on privacy requirements and visual impact:

- **Full-block blur**: Complete obscuration for backgrounds or placeholder content
- **Radial blur**: Circular blur patterns ideal for face-like regions
- **Pixelization**: Clearly intentional censoring that's faster to render than heavy blur
- **Solid overlays**: Complete blocking for highly sensitive information like documents or credentials

## Programmatic Redaction

### Full-Block Blur

When the entire video needs obscuring, apply blur directly to the original block without duplication. This approach works well for background content or privacy placeholders.

```typescript highlight-full-block-blur
  // Check if the block supports blur
  const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
  console.log('Video supports blur:', supportsBlur);

  // Create and apply uniform blur to entire video
  const uniformBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.7);
  engine.block.setBlur(fullBlurVideo, uniformBlur);
  engine.block.setBlurEnabled(fullBlurVideo, true);
```

We first check that the block supports blur with `supportsBlur()`. Then we create a uniform blur, configure its intensity, attach it to the video block with `setBlur()`, and enable it with `setBlurEnabled()`. The intensity value ranges from 0.0 to 1.0, where higher values create stronger blur.

### Pixelization

Pixelization creates a mosaic effect that's clearly intentional and renders faster than heavy blur. We use the effect system rather than the blur system for pixelization.

```typescript highlight-pixelization
// Check if the block supports effects
if (engine.block.supportsEffects(pixelVideo)) {
  // Create and apply pixelize effect
  const pixelizeEffect = engine.block.createEffect('pixelize');
  engine.block.setInt(
    pixelizeEffect,
    'effect/pixelize/horizontalPixelSize',
    24
  );
  engine.block.setInt(
    pixelizeEffect,
    'effect/pixelize/verticalPixelSize',
    24
  );
  engine.block.appendEffect(pixelVideo, pixelizeEffect);
  engine.block.setEffectEnabled(pixelizeEffect, true);
}
```

We check `supportsEffects()` before creating the pixelize effect. The horizontal and vertical pixel sizes control the mosaic block dimensions—larger values create stronger obscuration.

### Solid Overlays

For complete blocking without any visual hint of the underlying content, create an opaque shape overlay.

```typescript highlight-solid-overlay
  // Create a solid rectangle overlay
  const overlay = engine.block.create('//ly.img.ubq/graphic');
  const rectShape = engine.block.createShape('//ly.img.ubq/shape/rect');
  engine.block.setShape(overlay, rectShape);

  // Create solid black fill
  const solidFill = engine.block.createFill('//ly.img.ubq/fill/color');
  engine.block.setColor(solidFill, 'fill/color/value', {
    r: 0.1,
    g: 0.1,
    b: 0.1,
    a: 1.0
  });
  engine.block.setFill(overlay, solidFill);

  // Position and size the overlay
  engine.block.setWidth(overlay, pageWidth * 0.4);
  engine.block.setHeight(overlay, pageHeight * 0.3);
  engine.block.setPositionX(overlay, pageWidth * 0.55);
  engine.block.setPositionY(overlay, pageHeight * 0.65);
  engine.block.setTimeOffset(overlay, 3 * SEGMENT_DURATION);
  engine.block.setDuration(overlay, SEGMENT_DURATION);
  engine.block.appendChild(page, overlay);
```

We create a graphic block with a rectangle shape and solid color fill. The overlay uses absolute page coordinates for positioning. Set the alpha to 1.0 for complete opacity.

### Time-Based Redaction

Redactions can appear only during specific portions of the video. We use `setTimeOffset()` and `setDuration()` to control when the redaction is visible.

```typescript highlight-time-based-redaction
  // Apply blur to the video
  const timedBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
  engine.block.setBlur(timedVideo, timedBlur);
  engine.block.setBlurEnabled(timedVideo, true);

  // The video is already timed to appear at a specific offset
  // You can adjust timeOffset and duration to control when redaction is visible
  engine.block.setTimeOffset(timedVideo, 4 * SEGMENT_DURATION);
  engine.block.setDuration(timedVideo, SEGMENT_DURATION);
```

The time offset specifies when the redaction appears (in seconds from the start), and the duration controls how long it remains visible. This is useful for redacting faces or information that only appears briefly.

### Radial Blur

For face-like regions, radial blur creates a circular blur pattern that works well with rounded subjects.

```typescript highlight-radial-blur
// Apply radial blur for circular redaction effect
const radialBlur = engine.block.createBlur('radial');
engine.block.setFloat(radialBlur, 'blur/radial/blurRadius', 50);
engine.block.setFloat(radialBlur, 'blur/radial/radius', 25);
engine.block.setFloat(radialBlur, 'blur/radial/gradientRadius', 35);
engine.block.setFloat(radialBlur, 'blur/radial/x', 0.5);
engine.block.setFloat(radialBlur, 'blur/radial/y', 0.45);
engine.block.setBlur(radialVideo, radialBlur);
engine.block.setBlurEnabled(radialVideo, true);
```

Radial blur properties control the blur center (`x`, `y` from 0.0-1.0), the unblurred center area (`radius`), the blur transition zone (`gradientRadius`), and the blur strength (`blurRadius`).

## Saving the Scene

After applying redactions, save the scene for later use or export.

```typescript highlight-save-scene
// Save the scene to a file for later use or export
await mkdir('output', { recursive: true });
const sceneData = await engine.scene.saveToString();
await writeFile('output/redacted-video.imgly', sceneData);
console.log('Scene saved to output/redacted-video.imgly');
```

The scene file contains all blocks, effects, and time-based settings. You can load this scene later to continue editing or export the final video.

## Cleanup

Always dispose of the engine when done to free resources.

```typescript highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Performance Considerations

Different redaction techniques have different performance impacts:

- **Solid overlays**: Minimal impact, can create many without significant overhead
- **Pixelization**: Faster than blur, larger pixel sizes have minimal impact
- **Blur effects**: Higher intensity values increase rendering time

For complex scenes with multiple redactions, consider using solid overlays where blur isn't necessary, or reduce blur intensity to maintain smooth processing.

## Troubleshooting

### Redaction Not Visible

If your redaction doesn't appear, verify that:

- The overlay is a child of the page with `appendChild()`
- Blur is enabled with `setBlurEnabled()` after setting it with `setBlur()`
- Effects are enabled with `setEffectEnabled()` after appending with `appendEffect()`

### Performance Issues

Reduce blur intensity, use pixelization instead of heavy blur, or switch to solid overlays for some redactions.

## Best Practices

- **Preview thoroughly**: Scrub the entire timeline to verify all sensitive content is covered
- **Add safety margins**: Make redaction regions slightly larger than the sensitive area
- **Test at export resolution**: Higher resolutions may need stronger blur settings
- **Archive originals**: Exported redactions are permanent and cannot be reversed
- **Document redactions**: For compliance requirements, maintain records of what was redacted

## API Reference

| Method | Description |
| ------ | ----------- |
| `block.supportsBlur(id)` | Check if block supports blur effects |
| `block.createBlur(type)` | Create blur instance (uniform, radial, linear, mirrored) |
| `block.setBlur(id, blur)` | Apply blur to block |
| `block.setBlurEnabled(id, enabled)` | Enable or disable blur |
| `block.supportsEffects(id)` | Check if block supports effects |
| `block.createEffect(type)` | Create effect instance (pixelize, etc.) |
| `block.appendEffect(id, effect)` | Add effect to block |
| `block.setEffectEnabled(effect, enabled)` | Enable or disable effect |
| `block.setTimeOffset(id, offset)` | Set when block appears |
| `block.setDuration(id, duration)` | Set block duration |
| `block.create(type)` | Create block of specified type |
| `block.createShape(type)` | Create shape for graphic blocks |
| `block.setShape(id, shape)` | Apply shape to graphic block |
| `block.createFill(type)` | Create fill (color, image, video, gradient) |
| `block.setFill(id, fill)` | Apply fill to block |
| `block.setFloat(id, property, value)` | Set float property value |
| `block.setInt(id, property, value)` | Set integer property value |
| `block.setColor(id, property, color)` | Set color property value |
| `scene.saveToString()` | Save scene to string for storage |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support