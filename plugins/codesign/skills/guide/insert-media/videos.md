> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Insert Media Assets](./insert-media.md) > [Insert Videos](./insert-media/videos.md)

---

Insert videos into your CE.SDK scenes using either the convenience API or manual block creation with video fills.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-insert-media-videos-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-insert-media-videos-server-js)

<NodejsVideoExportNotice {...props} />

Videos in CE.SDK are graphic blocks with video fills. Two approaches exist: the `addVideo()` convenience method, and manual block creation with video fills.

```typescript file=@cesdk_web_examples/guides-insert-media-videos-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import 'dotenv/config';

// Helper to prompt user for confirmation
function confirmExport(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Export scene to PNG? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const config = {
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
    license: process.env.CESDK_LICENSE
  };

  const engine = await CreativeEngine.init(config);

  // Create a scene
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);

  try {
    // Video URL for demonstration
    const videoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-702788.mp4';

    // Using the convenience API - creates a graphic block with video fill automatically
    // Creates a graphic block with video fill automatically
    const videoBlock = await engine.block.addVideo(videoUrl, 800, 450);

    // Position the video on the canvas
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 50);

    console.log('Added video using convenience API');

    // Manual video construction - for more control over block setup
    // Create a graphic block container
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create a video fill and set the source URI
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', videoUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 400);
    engine.block.setHeight(manualBlock, 225);
    engine.block.setPositionX(manualBlock, 50);
    engine.block.setPositionY(manualBlock, 520);

    // Add the block to the page
    engine.block.appendChild(page, manualBlock);

    console.log('Added video using manual construction');

    // Load video metadata before configuring trim
    // This is required to query the total duration
    await engine.block.forceLoadAVResource(fill);

    // Get the total video duration
    const totalDuration = engine.block.getAVResourceTotalDuration(fill);
    console.log(`Video total duration: ${totalDuration} seconds`);

    // Configure trim settings on the fill (not the block)
    // Start playback 2 seconds into the video
    engine.block.setTrimOffset(fill, 2.0);

    // Play for 5 seconds (or remaining duration if video is shorter)
    const trimLength = Math.min(5.0, totalDuration - 2.0);
    engine.block.setTrimLength(fill, trimLength);

    console.log(`Configured trim: offset=2s, length=${trimLength}s`);

    // Export the scene to PNG
    const shouldExport = await confirmExport();

    if (shouldExport) {
      // Export the page to PNG
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save to output directory
      const outputDir = path.join(process.cwd(), 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'video-thumbnails.png');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Exported to: ${outputPath}`);
    } else {
      console.log('Export skipped');
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
    console.log('Engine disposed');
  }
}

main().catch(console.error);
```

This guide covers how to add videos programmatically and configure video properties like trim offset and length for server-side processing.

## Setup

Initialize CE.SDK and create a scene.

```typescript highlight=highlight-setup
  const config = {
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
    license: process.env.CESDK_LICENSE
  };

  const engine = await CreativeEngine.init(config);

  // Create a scene
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);
```

The `scene.create()` method creates a scene for the video composition.

## Add Videos with addVideo()

The `addVideo()` method creates a graphic block with video fill in a single call. This is the simplest approach.

```typescript highlight=highlight-add-video-convenience
    // Using the convenience API - creates a graphic block with video fill automatically
    // Creates a graphic block with video fill automatically
    const videoBlock = await engine.block.addVideo(videoUrl, 800, 450);

    // Position the video on the canvas
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 50);
```

Pass the video URL, width, and height as parameters. The method returns the block ID for further manipulation like positioning.

## Add Videos with Graphic Blocks

For more control, manually create a graphic block and attach a video fill.

```typescript highlight=highlight-manual-construction
    // Manual video construction - for more control over block setup
    // Create a graphic block container
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create a video fill and set the source URI
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', videoUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 400);
    engine.block.setHeight(manualBlock, 225);
    engine.block.setPositionX(manualBlock, 50);
    engine.block.setPositionY(manualBlock, 520);

    // Add the block to the page
    engine.block.appendChild(page, manualBlock);
```

Create a graphic block, attach a rectangular shape, create a video fill with the source URI, and apply the fill to the block. This pattern mirrors image fills.

## Configure Trim Settings

Control which portion of a video plays by setting the trim offset and length. First load the video resource to access duration metadata.

```typescript highlight=highlight-configure-trim
    // Load video metadata before configuring trim
    // This is required to query the total duration
    await engine.block.forceLoadAVResource(fill);

    // Get the total video duration
    const totalDuration = engine.block.getAVResourceTotalDuration(fill);
    console.log(`Video total duration: ${totalDuration} seconds`);

    // Configure trim settings on the fill (not the block)
    // Start playback 2 seconds into the video
    engine.block.setTrimOffset(fill, 2.0);

    // Play for 5 seconds (or remaining duration if video is shorter)
    const trimLength = Math.min(5.0, totalDuration - 2.0);
    engine.block.setTrimLength(fill, trimLength);
```

The `setTrimOffset()` method specifies where playback starts. A value of 2.0 skips the first two seconds. The `setTrimLength()` method defines how long the clip plays from that offset.

> **Note:** Trim operations are applied to the fill, not the block. Use `getFill()` to get the fill ID first.

## Export and Cleanup

Export the scene to an image file and dispose of the engine to free resources.

```typescript highlight=highlight-export
    // Export the scene to PNG
    const shouldExport = await confirmExport();

    if (shouldExport) {
      // Export the page to PNG
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save to output directory
      const outputDir = path.join(process.cwd(), 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'video-thumbnails.png');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Exported to: ${outputPath}`);
    } else {
      console.log('Export skipped');
    }
```

For server-side processing, export to PNG for video thumbnails or use the video export APIs for full video rendering.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

Always call `dispose()` in a finally block to ensure proper cleanup even when errors occur.

## Supported Video Formats

CE.SDK supports common web video formats:

- **MP4 (H.264 codec)** — widest platform support, recommended for most use cases
- **WebM (VP8/VP9 codec)** — open format with good compression

For maximum compatibility, use MP4 with H.264 encoding.

## Troubleshooting

### Video Not Visible

- Verify the file URI is correct and accessible
- Ensure the video format is supported (MP4, WebM)
- Check that the block is appended to the page with `appendChild()`
- Confirm dimensions are set with `setWidth()` and `setHeight()`

### Trim Not Working

- Ensure you're calling trim methods on the fill, not the block
- Call `forceLoadAVResource()` before setting trim values
- Verify trim offset + trim length doesn't exceed total duration

## API Reference

| Method | Description |
|--------|-------------|
| `block.addVideo(url, width, height)` | Create video block with video fill |
| `block.create('graphic')` | Create graphic block container |
| `block.createShape('rect')` | Create rectangular shape |
| `block.setShape(block, shape)` | Apply shape to block |
| `block.createFill('video')` | Create video fill |
| `block.setString(fill, 'fill/video/fileURI', url)` | Set video source URI |
| `block.setFill(block, fill)` | Apply fill to block |
| `block.getFill(block)` | Get fill block from graphic block |
| `block.forceLoadAVResource(fill)` | Load video metadata |
| `block.getAVResourceTotalDuration(fill)` | Get video duration in seconds |
| `block.setTrimOffset(fill, seconds)` | Set trim start point |
| `block.setTrimLength(fill, seconds)` | Set trim duration |
| `block.export(block, options)` | Export block to image blob |
| `block.exportVideo(block, options)` | Export a block (typically a page) as MP4 video (native `@cesdk/node-native` package) |
| `scene.create()` | Create a scene |
| `scene.getCurrentPage()` | Get current scene page |
| `engine.dispose()` | Dispose engine and free resources |

## Next Steps

- [Learn about video fills](./fills/video.md) for advanced video configuration
- [Apply filters and effects](./filters-and-effects/apply.md) to enhance appearance
- [Export your design](./export-save-publish/export/overview.md) to various formats



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support