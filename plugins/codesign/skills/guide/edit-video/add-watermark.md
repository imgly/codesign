> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Add Watermark](./edit-video/add-watermark.md)

---

Add text and image watermarks to video content for copyright protection, branding, and content attribution using CE.SDK's time-aware block system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-add-watermark-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-add-watermark-server-js)

Video watermarks in CE.SDK are design blocks positioned over video content. **Text watermarks** display copyright notices, URLs, or branding text, while **image watermarks** show logos or graphics. Both watermark types need their time-based properties configured to remain visible throughout video playback. The key difference from static image watermarking is setting the watermark's `duration` to match the video duration.

```typescript file=@cesdk_web_examples/guides-create-video-add-watermark-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Watermark to Video
 *
 * Demonstrates adding text and image watermarks to videos:
 * - Creating text watermarks with styling and drop shadows
 * - Creating image watermarks from logos
 * - Positioning watermarks on the canvas
 * - Setting watermark duration to match video timeline
 * - Configuring opacity and blend modes
 * - Saving the watermarked scene for rendering
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene and load a sample video
  const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
  await engine.scene.createFromVideo(videoUrl);

  // Get the page and its properties
  const page = engine.scene.getCurrentPage()!;
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Get the video duration from the page (set automatically from video)
  const videoDuration = engine.block.getDuration(page);
  console.log('Video duration:', videoDuration, 'seconds');
  console.log('Page dimensions:', pageWidth, 'x', pageHeight);

  // ===== TEXT WATERMARK =====

  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Use Auto sizing so the text block grows to fit its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');

  // Set the watermark text content
  engine.block.replaceText(textWatermark, 'All rights reserved 2025');

  // Position in bottom-left corner with padding
  const textPadding = 20;
  engine.block.setPositionX(textWatermark, textPadding);
  engine.block.setPositionY(textWatermark, pageHeight - textPadding - 20);

  // Style the text watermark
  engine.block.setFloat(textWatermark, 'text/fontSize', 14);
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 }); // White text

  // Set text alignment
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Set opacity for subtle appearance
  engine.block.setOpacity(textWatermark, 0.7);

  // Add drop shadow for visibility across different backgrounds
  engine.block.setDropShadowEnabled(textWatermark, true);
  engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.8 });
  engine.block.setDropShadowOffsetX(textWatermark, 2);
  engine.block.setDropShadowOffsetY(textWatermark, 2);
  engine.block.setDropShadowBlurRadiusX(textWatermark, 4);
  engine.block.setDropShadowBlurRadiusY(textWatermark, 4);

  // Set the text watermark duration to match the video
  engine.block.setDuration(textWatermark, videoDuration);
  engine.block.setTimeOffset(textWatermark, 0);

  // Add the text watermark to the page
  engine.block.appendChild(page, textWatermark);

  console.log('Text watermark created and added to timeline');

  // ===== IMAGE WATERMARK (LOGO) =====

  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rectangular shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with the logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain so the logo fits within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');

  // Size and position the logo in the top-right corner
  const logoSize = 80;
  const logoPadding = 20;
  engine.block.setWidth(logoWatermark, logoSize);
  engine.block.setHeight(logoWatermark, logoSize);
  engine.block.setPositionX(logoWatermark, pageWidth - logoSize - logoPadding);
  engine.block.setPositionY(logoWatermark, logoPadding);

  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.6);

  // Set blend mode for better integration with video content
  engine.block.setBlendMode(logoWatermark, 'Normal');

  // Set the logo watermark duration to match the video
  engine.block.setDuration(logoWatermark, videoDuration);
  engine.block.setTimeOffset(logoWatermark, 0);

  // Add the logo watermark to the page
  engine.block.appendChild(page, logoWatermark);

  console.log('Logo watermark created and added to timeline');

  // Save the watermarked scene
  // Video export is not supported in Node.js, so we save the scene as JSON
  // The saved scene can be rendered using CE.SDK Renderer
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/watermarked-video.imgly`, sceneString);

  console.log('');
  console.log(
    'Watermarked video scene saved to output/watermarked-video.imgly'
  );
  console.log('');
  console.log('Scene contains:');
  console.log('  - Text watermark: "All rights reserved 2025" (bottom-left)');
  console.log('  - Logo watermark: IMG.LY logo (top-right)');
  console.log('  - Both watermarks span the full video duration');
  console.log('');
  console.log('To render the video, use CE.SDK Renderer:');
  console.log('  https://img.ly/docs/cesdk/renderer/');
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
```

This guide covers how to create text and image watermarks programmatically, position them on the canvas, style them for visibility, and configure their duration to span the entire video.

<NodejsVideoExportNotice {...props} />

## Initializing the Engine

We initialize the CE.SDK engine in headless mode for server-side processing. The engine runs without a UI, making it suitable for automated watermarking workflows.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The engine initializes with default settings. In production, you would add your license key to remove trial watermarks from exports.

## Creating the Scene

We create a scene from a video URL. This automatically sets up the page dimensions and time-based properties based on the video.

```typescript highlight-create-video-scene
// Create a video scene and load a sample video
const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
await engine.scene.createFromVideo(videoUrl);
```

The `createFromVideo` method loads the video, creates a scene, and sets the page dimensions to match the video's aspect ratio. The video becomes a fill block in the composition with its duration already set.

## Getting Page and Video Information

Before positioning watermarks, we retrieve the page dimensions and video duration for reference.

```typescript highlight-get-page-info
  // Get the page and its properties
  const page = engine.scene.getCurrentPage()!;
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Get the video duration from the page (set automatically from video)
  const videoDuration = engine.block.getDuration(page);
  console.log('Video duration:', videoDuration, 'seconds');
  console.log('Page dimensions:', pageWidth, 'x', pageHeight);
```

We use `engine.block.getWidth()` and `engine.block.getHeight()` to get the page dimensions for positioning calculations. `engine.block.getDuration()` returns the video duration in seconds, which we'll use to ensure watermarks span the entire video.

## Creating a Text Watermark

Text watermarks display copyright notices, branding text, or URLs. We create a text block and position it on the canvas.

```typescript highlight-create-text-watermark
  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Use Auto sizing so the text block grows to fit its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');

  // Set the watermark text content
  engine.block.replaceText(textWatermark, 'All rights reserved 2025');

  // Position in bottom-left corner with padding
  const textPadding = 20;
  engine.block.setPositionX(textWatermark, textPadding);
  engine.block.setPositionY(textWatermark, pageHeight - textPadding - 20);
```

We create a text block with `engine.block.create('text')` and configure it with auto-sizing using `engine.block.setWidthMode()` and `engine.block.setHeightMode()`. This lets the text block grow to fit its content. We set the text content using `engine.block.replaceText()` and position the watermark in the bottom-left corner with padding from the edges.

## Styling Text Watermarks

Style the text for readability across different video backgrounds.

```typescript highlight-style-text-watermark
  // Style the text watermark
  engine.block.setFloat(textWatermark, 'text/fontSize', 14);
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 }); // White text

  // Set text alignment
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Set opacity for subtle appearance
  engine.block.setOpacity(textWatermark, 0.7);
```

We set the font size using `engine.block.setFloat()` with the `'text/fontSize'` property for a subtle watermark appearance. White text color ensures visibility, left alignment positions the text naturally, and 70% opacity creates a semi-transparent appearance that's visible but not distracting.

## Adding Drop Shadow for Visibility

Drop shadows ensure text remains readable over both light and dark video backgrounds.

```typescript highlight-text-drop-shadow
// Add drop shadow for visibility across different backgrounds
engine.block.setDropShadowEnabled(textWatermark, true);
engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.8 });
engine.block.setDropShadowOffsetX(textWatermark, 2);
engine.block.setDropShadowOffsetY(textWatermark, 2);
engine.block.setDropShadowBlurRadiusX(textWatermark, 4);
engine.block.setDropShadowBlurRadiusY(textWatermark, 4);
```

We enable the drop shadow and configure its appearance. The black shadow color with 80% opacity provides contrast. Offset values (2px in each direction) separate the shadow from the text, while blur radius values (4px) create a soft shadow edge.

## Setting Text Watermark Duration

The watermark must persist throughout video playback. We set its duration to match the video duration.

```typescript highlight-text-timeline
  // Set the text watermark duration to match the video
  engine.block.setDuration(textWatermark, videoDuration);
  engine.block.setTimeOffset(textWatermark, 0);

  // Add the text watermark to the page
  engine.block.appendChild(page, textWatermark);
```

`engine.block.setDuration()` controls how long the block appears in the composition. `engine.block.setTimeOffset()` of 0 ensures it starts at the beginning. We then append the watermark to the page, placing it above the video content.

## Creating an Image Watermark

Image watermarks display logos or graphics. We create a graphic block with an image fill.

```typescript highlight-create-image-watermark
  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rectangular shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with the logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain so the logo fits within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');
```

We create a graphic block, assign it a rectangular shape, and fill it with an image. The `fill/image/imageFileURI` property specifies the logo URL. We set the content fill mode to 'Contain' so the logo fits within its bounds without cropping. This pattern—graphic block with shape and fill—is standard for displaying images in CE.SDK.

## Positioning Image Watermarks

Position the logo in a corner that doesn't obstruct video content.

```typescript highlight-position-image-watermark
// Size and position the logo in the top-right corner
const logoSize = 80;
const logoPadding = 20;
engine.block.setWidth(logoWatermark, logoSize);
engine.block.setHeight(logoWatermark, logoSize);
engine.block.setPositionX(logoWatermark, pageWidth - logoSize - logoPadding);
engine.block.setPositionY(logoWatermark, logoPadding);
```

We size the logo at 80x80 pixels—large enough to be recognizable but not dominating. Position values place it in the top-right corner with 20px padding from the edges.

## Configuring Opacity and Blend Mode

Control how the watermark integrates with the video.

```typescript highlight-image-opacity-blend
  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.6);

  // Set blend mode for better integration with video content
  engine.block.setBlendMode(logoWatermark, 'Normal');
```

We set 60% opacity for a subtle but visible watermark. The blend mode 'Normal' displays the logo as-is. Other modes like 'Multiply' or 'Screen' create different visual effects depending on the logo and video content.

## Setting Image Watermark Duration

Like text watermarks, image watermarks need duration configuration.

```typescript highlight-image-timeline
  // Set the logo watermark duration to match the video
  engine.block.setDuration(logoWatermark, videoDuration);
  engine.block.setTimeOffset(logoWatermark, 0);

  // Add the logo watermark to the page
  engine.block.appendChild(page, logoWatermark);
```

We set the same duration and time offset as the text watermark so both appear throughout the video. The `engine.block.appendChild()` call adds the logo to the page above existing content.

## Saving the Watermarked Scene

After adding watermarks, we save the scene for later rendering by serializing it to a file. With the native `@cesdk/node-native` package you can also export the video directly via `engine.block.exportVideo()`; with the WASM-based `@cesdk/node` package, use the separate CE.SDK Renderer for video export.

```typescript highlight-save-scene
  // Save the watermarked scene
  // Video export is not supported in Node.js, so we save the scene as JSON
  // The saved scene can be rendered using CE.SDK Renderer
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/watermarked-video.imgly`, sceneString);

  console.log('');
  console.log(
    'Watermarked video scene saved to output/watermarked-video.imgly'
  );
  console.log('');
  console.log('Scene contains:');
  console.log('  - Text watermark: "All rights reserved 2025" (bottom-left)');
  console.log('  - Logo watermark: IMG.LY logo (top-right)');
  console.log('  - Both watermarks span the full video duration');
  console.log('');
  console.log('To render the video, use CE.SDK Renderer:');
  console.log('  https://img.ly/docs/cesdk/renderer/');
```

The `engine.scene.saveToString()` method serializes the entire scene including the video, watermarks, and all configuration. This scene file can be loaded later in a browser environment for export, or processed using the CE.SDK Renderer for server-side video generation.

## Cleanup

Always dispose of the engine when finished to free system resources.

```typescript highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

The `engine.dispose()` method releases all resources held by the engine. In server environments, proper cleanup is essential to prevent memory leaks during batch processing.

## Watermark Positioning Strategies

Choose watermark positions based on your use case:

- **Bottom-right corner**: Most common for copyright notices. Less intrusive but clearly visible.
- **Top-right corner**: Good for logos. Doesn't interfere with typical video framing.
- **Bottom-left corner**: Alternative for text when bottom-right conflicts with video content.
- **Center**: Strong protection but obstructs content. Use for draft or preview watermarks.

Calculate positions dynamically based on page dimensions to handle different video aspect ratios.

## Best Practices

### Visibility

- Use drop shadows on text watermarks for contrast against varying backgrounds
- Set opacity between 50-70% for subtle but visible branding
- Choose appropriate font sizes based on your use case (smaller for subtle branding, larger for prominent notices)
- Test watermarks against different scenes in your video

### Time Management

- Always match watermark duration to video duration
- Set time offset to 0 for watermarks that should appear from the start
- For time-based watermarks, calculate offsets based on video sections

### Batch Processing

- Reuse watermark configuration logic across multiple videos
- Process videos sequentially to manage memory usage
- Always dispose of the engine between sessions or implement proper resource management

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.createFromVideo(url)` | Create a video scene from a URL |
| `engine.scene.getCurrentPage()` | Get the current page block |
| `engine.scene.saveToString()` | Serialize the scene to a string |
| `engine.block.create('text')` | Create a text block for text watermarks |
| `engine.block.create('graphic')` | Create a graphic block for image watermarks |
| `engine.block.setWidthMode(id, mode)` | Set width sizing mode ('Auto', 'Absolute', 'Percent') |
| `engine.block.setHeightMode(id, mode)` | Set height sizing mode ('Auto', 'Absolute', 'Percent') |
| `engine.block.replaceText(id, text)` | Set text content for text blocks |
| `engine.block.setFloat(id, property, value)` | Set numeric properties like font size |
| `engine.block.createShape('rect')` | Create a rectangular shape for graphics |
| `engine.block.createFill('image')` | Create an image fill for logo watermarks |
| `engine.block.setString(id, property, value)` | Set string properties like image URI |
| `engine.block.setContentFillMode(id, mode)` | Set content fill mode ('Crop', 'Cover', 'Contain') |
| `engine.block.setDuration(id, duration)` | Set watermark duration |
| `engine.block.setTimeOffset(id, offset)` | Set watermark start time |
| `engine.block.setOpacity(id, opacity)` | Set watermark transparency (0.0-1.0) |
| `engine.block.setDropShadowEnabled(id, enabled)` | Enable/disable drop shadow |
| `engine.block.setDropShadowColor(id, color)` | Set shadow color |
| `engine.block.setDropShadowOffsetX/Y(id, offset)` | Set shadow position |
| `engine.block.setDropShadowBlurRadiusX/Y(id, radius)` | Set shadow blur |
| `engine.block.setBlendMode(id, mode)` | Set blend mode ('Normal', 'Multiply', etc.) |
| `engine.block.appendChild(parent, child)` | Add watermark to page |
| `engine.dispose()` | Release engine resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support