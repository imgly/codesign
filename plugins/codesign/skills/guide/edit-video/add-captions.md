> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Add Captions](./edit-video/add-captions.md)

---

Add synchronized captions to video projects using CE.SDK's caption system in headless mode, with support for importing subtitle files, styling programmatically, and saving scenes with captions.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-add-captions-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-add-captions-server-js)

Captions in CE.SDK follow a hierarchy: **Page → CaptionTrack → Caption blocks**. Each caption has text, timing (time offset and duration), and styling properties. Captions appear and disappear based on their timing, synchronized with video playback.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-create-video-add-captions-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Captions
 *
 * Demonstrates adding synchronized captions to video projects:
 * - Importing captions from SRT/VTT files
 * - Creating captions programmatically
 * - Styling captions with typography and background
 * - Saving scenes with captions for later rendering
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
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);

  // Set page duration to accommodate video content
  engine.block.setDuration(page, 10);

  // Add a video clip as the base content
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  const videoClip = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 10, timeOffset: 0 }
  });
  engine.block.appendChild(track, videoClip);
  engine.block.fillParent(track);

  // Import captions from SRT file
  // createCaptionsFromURI parses SRT/VTT and creates caption blocks with timing
  const captionSrtUrl = 'https://img.ly/static/examples/captions.srt';
  const captionBlocks = await engine.block.createCaptionsFromURI(captionSrtUrl);

  console.log(`Imported ${captionBlocks.length} captions from SRT file`);

  // Create a caption track and add captions to it
  // Caption tracks organize captions in the timeline
  const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');
  engine.block.appendChild(page, captionTrack);

  // Add each caption block to the track
  for (const captionId of captionBlocks) {
    engine.block.appendChild(captionTrack, captionId);
  }

  console.log(`Caption track created with ${captionBlocks.length} captions`);

  // Read caption properties (text, timing)
  if (captionBlocks.length > 0) {
    const firstCaption = captionBlocks[0];

    const text = engine.block.getString(firstCaption, 'caption/text');
    const offset = engine.block.getTimeOffset(firstCaption);
    const duration = engine.block.getDuration(firstCaption);

    console.log(`First caption: "${text}"`);
    console.log(`  Time: ${offset}s - ${offset + duration}s`);
  }

  // Style all captions with consistent formatting
  for (const captionId of captionBlocks) {
    // Set font size
    engine.block.setFloat(captionId, 'caption/fontSize', 48);

    // Center alignment
    engine.block.setEnum(captionId, 'caption/horizontalAlignment', 'Center');
    engine.block.setEnum(captionId, 'caption/verticalAlignment', 'Bottom');

    // Enable background for readability
    engine.block.setBool(captionId, 'backgroundColor/enabled', true);
    engine.block.setColor(captionId, 'backgroundColor/color', {
      r: 0,
      g: 0,
      b: 0,
      a: 0.7
    });
  }

  console.log('Applied styling to all captions');

  // Position captions at the bottom of the video frame
  // Caption position and size sync across all captions, so we only set it once
  if (captionBlocks.length > 0) {
    const firstCaption = captionBlocks[0];

    // Use percentage-based positioning for responsive layout
    engine.block.setPositionXMode(firstCaption, 'Percent');
    engine.block.setPositionYMode(firstCaption, 'Percent');
    engine.block.setWidthMode(firstCaption, 'Percent');
    engine.block.setHeightMode(firstCaption, 'Percent');

    // Position at bottom center with padding
    engine.block.setPositionX(firstCaption, 0.05); // 5% from left
    engine.block.setPositionY(firstCaption, 0.8); // 80% from top (near bottom)
    engine.block.setWidth(firstCaption, 0.9); // 90% width
    engine.block.setHeight(firstCaption, 0.15); // 15% height

    console.log('Positioned captions at bottom of frame');
  }

  // Create a caption programmatically (in addition to imported ones)
  const manualCaption = engine.block.create('//ly.img.ubq/caption');
  engine.block.appendChild(captionTrack, manualCaption);

  // Set caption text
  engine.block.setString(manualCaption, 'caption/text', 'Manual caption added');

  // Set timing - appears at 8 seconds for 2 seconds
  engine.block.setTimeOffset(manualCaption, 8);
  engine.block.setDuration(manualCaption, 2);

  // Apply same styling
  engine.block.setFloat(manualCaption, 'caption/fontSize', 48);
  engine.block.setEnum(manualCaption, 'caption/horizontalAlignment', 'Center');
  engine.block.setEnum(manualCaption, 'caption/verticalAlignment', 'Bottom');
  engine.block.setBool(manualCaption, 'backgroundColor/enabled', true);
  engine.block.setColor(manualCaption, 'backgroundColor/color', {
    r: 0,
    g: 0,
    b: 0,
    a: 0.7
  });

  console.log('Created manual caption at 8s');

  // Add entry animation to captions
  for (const captionId of captionBlocks) {
    const fadeIn = engine.block.createAnimation('fade');
    engine.block.setDuration(fadeIn, 0.2);
    engine.block.setInAnimation(captionId, fadeIn);
  }

  console.log('Added fade-in animations to captions');

  // Save scene to file for later rendering
  // The scene preserves all caption data, styling, and animations
  const sceneString = await engine.scene.saveToString();

  // Save to output directory
  const outputDir = join(process.cwd(), 'output');
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'video-with-captions.imgly');
  await writeFile(outputPath, sceneString);

  console.log(`Scene saved: ${outputPath}`);

  console.log('');
  console.log('Add Captions guide complete.');
  console.log('Scene created with:');
  console.log(`  - ${captionBlocks.length} imported captions`);
  console.log('  - 1 manually created caption');
  console.log('  - Consistent styling across all captions');
  console.log('  - Fade-in animations');
  console.log('');
  console.log(
    'Use CE.SDK Renderer to export this scene as a video with burned-in captions.'
  );
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
```

This guide covers how to import captions from SRT/VTT files, style them using custom properties, create captions programmatically, and save scenes with captions in a headless Node.js environment.

## Understanding Caption Structure

### Caption Hierarchy

CE.SDK organizes captions in a parent-child hierarchy. The page contains one or more caption tracks, and each caption track contains individual caption blocks. This structure allows for multiple caption tracks (for different languages or purposes) while keeping captions organized.

When you import captions from a subtitle file, CE.SDK automatically creates the caption track and populates it with caption blocks. Each caption block stores its text content, start time, duration, and styling properties.

### Caption Timing

Each caption has two timing properties: **time offset** (when the caption appears) and **duration** (how long it stays visible). These values are in seconds and synchronize with the video playback. A caption with a time offset of 2.0 and duration of 3.0 appears at the 2-second mark and disappears at the 5-second mark.

## Initialize CE.SDK

For headless video processing with captions, we initialize CE.SDK's Node.js engine. This provides full API access without browser dependencies, ideal for server-side automation and batch processing.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The headless engine gives you complete control over caption operations, perfect for automated workflows, background processing, and server-side video preparation.

## Creating the Scene

Create a scene with page configuration. The `page` option creates a page with the specified dimensions.

```typescript highlight-create-scene
  // Create a scene with a page
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);

  // Set page duration to accommodate video content
  engine.block.setDuration(page, 10);
```

Set the page duration to accommodate your video content. The dimensions define the output video resolution.

## Importing Captions from Subtitle Files

### Using createCaptionsFromURI

The fastest way to add captions is importing from an SRT or VTT subtitle file. CE.SDK parses the file and creates caption blocks with timing already configured.

```typescript highlight-import-captions
  // Import captions from SRT file
  // createCaptionsFromURI parses SRT/VTT and creates caption blocks with timing
  const captionSrtUrl = 'https://img.ly/static/examples/captions.srt';
  const captionBlocks = await engine.block.createCaptionsFromURI(captionSrtUrl);

  console.log(`Imported ${captionBlocks.length} captions from SRT file`);
```

The `createCaptionsFromURI` method downloads the subtitle file, parses the timing and text, and creates a caption track with all captions positioned correctly. It returns an array of caption block IDs for the imported captions.

### Creating the Caption Track

After importing captions, create a caption track to organize them in the composition.

```typescript highlight-create-caption-track
  // Create a caption track and add captions to it
  // Caption tracks organize captions in the timeline
  const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');
  engine.block.appendChild(page, captionTrack);

  // Add each caption block to the track
  for (const captionId of captionBlocks) {
    engine.block.appendChild(captionTrack, captionId);
  }

  console.log(`Caption track created with ${captionBlocks.length} captions`);
```

Create a caption track with `engine.block.create('//ly.img.ubq/captionTrack')` and append it to the page. Then add each caption block to the track using `appendChild`.

## Reading Caption Properties

Retrieve caption properties for processing, validation, or logging.

```typescript highlight-read-caption-properties
  // Read caption properties (text, timing)
  if (captionBlocks.length > 0) {
    const firstCaption = captionBlocks[0];

    const text = engine.block.getString(firstCaption, 'caption/text');
    const offset = engine.block.getTimeOffset(firstCaption);
    const duration = engine.block.getDuration(firstCaption);

    console.log(`First caption: "${text}"`);
    console.log(`  Time: ${offset}s - ${offset + duration}s`);
  }
```

Use `getString` for text, `getTimeOffset` for start time, and `getDuration` for display length. These values are useful for validation or synchronization workflows.

## Creating Captions Programmatically

### Caption Track Setup

For full control over captions, create them programmatically. First, create a caption track and append it to the page.

```typescript
const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');
engine.block.appendChild(page, captionTrack);
```

### Creating Caption Blocks

Create individual captions with text and timing.

```typescript highlight-create-caption-manually
  // Create a caption programmatically (in addition to imported ones)
  const manualCaption = engine.block.create('//ly.img.ubq/caption');
  engine.block.appendChild(captionTrack, manualCaption);

  // Set caption text
  engine.block.setString(manualCaption, 'caption/text', 'Manual caption added');

  // Set timing - appears at 8 seconds for 2 seconds
  engine.block.setTimeOffset(manualCaption, 8);
  engine.block.setDuration(manualCaption, 2);

  // Apply same styling
  engine.block.setFloat(manualCaption, 'caption/fontSize', 48);
  engine.block.setEnum(manualCaption, 'caption/horizontalAlignment', 'Center');
  engine.block.setEnum(manualCaption, 'caption/verticalAlignment', 'Bottom');
  engine.block.setBool(manualCaption, 'backgroundColor/enabled', true);
  engine.block.setColor(manualCaption, 'backgroundColor/color', {
    r: 0,
    g: 0,
    b: 0,
    a: 0.7
  });

  console.log('Created manual caption at 8s');
```

Set the caption text using `setString` with the `caption/text` property. Position the caption in time using `setTimeOffset` (when it appears) and `setDuration` (how long it shows).

## Styling Captions

### Typography

Control caption appearance with typography properties.

```typescript highlight-style-captions
  // Style all captions with consistent formatting
  for (const captionId of captionBlocks) {
    // Set font size
    engine.block.setFloat(captionId, 'caption/fontSize', 48);

    // Center alignment
    engine.block.setEnum(captionId, 'caption/horizontalAlignment', 'Center');
    engine.block.setEnum(captionId, 'caption/verticalAlignment', 'Bottom');

    // Enable background for readability
    engine.block.setBool(captionId, 'backgroundColor/enabled', true);
    engine.block.setColor(captionId, 'backgroundColor/color', {
      r: 0,
      g: 0,
      b: 0,
      a: 0.7
    });
  }

  console.log('Applied styling to all captions');
```

Use `setFloat` for numeric values like `caption/fontSize`, `caption/letterSpacing`, and `caption/lineHeight`. Set alignment with `setEnum` for `caption/horizontalAlignment` (Left, Center, Right) and `caption/verticalAlignment` (Top, Center, Bottom).

### Background

Enable a background behind caption text for better readability over video content. Use `setBool` to enable `backgroundColor/enabled` and `setColor` to set `backgroundColor/color` with RGBA values. A semi-transparent black background (alpha 0.7) is common for video captions.

### Automatic Font Sizing

CE.SDK can automatically adjust font size to fit caption text within bounds. Enable automatic sizing and set minimum and maximum size limits.

```typescript
engine.block.setBool(captionId, 'caption/automaticFontSizeEnabled', true);
engine.block.setFloat(captionId, 'caption/minAutomaticFontSize', 24);
engine.block.setFloat(captionId, 'caption/maxAutomaticFontSize', 72);
```

This prevents text from overflowing while maintaining readability.

## Caption Animations

### Adding Entry Animations

Make captions more engaging by adding entry animations.

```typescript highlight-add-animation
  // Add entry animation to captions
  for (const captionId of captionBlocks) {
    const fadeIn = engine.block.createAnimation('fade');
    engine.block.setDuration(fadeIn, 0.2);
    engine.block.setInAnimation(captionId, fadeIn);
  }

  console.log('Added fade-in animations to captions');
```

Create an animation using `createAnimation` with types like 'fade', 'slide', or 'scale'. Set the animation duration and apply it with `setInAnimation`.

### Animation Types

CE.SDK supports several animation types for captions:

- **fade** - Opacity transition
- **slide** - Position movement
- **scale** - Size change
- **blur** - Focus effect

Set loop animations with `setLoopAnimation` for continuous effects, or exit animations with `setOutAnimation` for departure transitions.

## Saving the Scene

After adding captions, save the scene to a `.scene` file for later use or rendering.

```typescript highlight-save-scene
  // Save scene to file for later rendering
  // The scene preserves all caption data, styling, and animations
  const sceneString = await engine.scene.saveToString();

  // Save to output directory
  const outputDir = join(process.cwd(), 'output');
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'video-with-captions.imgly');
  await writeFile(outputPath, sceneString);

  console.log(`Scene saved: ${outputPath}`);
```

The scene file preserves all caption data including text, timing, styling, and animations. You can load this scene later for further editing, export it as MP4 directly with the native `@cesdk/node-native` package, or send it to the CE.SDK Renderer for video export.

## Resource Cleanup

Always dispose of the engine when processing is complete to free resources.

```typescript highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

Use a try/finally pattern to ensure cleanup happens even if an error occurs during processing.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Captions not visible | Not in caption track hierarchy | Check `getParent()`: page → captionTrack → caption |
| Wrong timing | Time offset/duration incorrect | Verify `getTimeOffset()` and `getDuration()` |
| Import fails | Unsupported format | Use valid SRT or VTT file |
| Styling not applying | Property path wrong | Use `caption/` prefix for caption properties |

### Captions Not Appearing

If captions don't appear in the exported video, verify the caption hierarchy. Each caption must be a child of a caption track, which must be a child of the page. Use `getParent()` to trace the hierarchy.

Also check that caption timing falls within the page duration. Captions outside the page's time range won't appear in the export.

### Import Errors

If `createCaptionsFromURI` fails, verify the URL is accessible from your server and returns valid SRT or VTT content. Common issues include network restrictions and malformed subtitle files. Test the URL with curl to confirm accessibility.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.create()` | Create a scene |
| `engine.block.createCaptionsFromURI(uri)` | Import captions from SRT/VTT file |
| `engine.block.create('//ly.img.ubq/captionTrack')` | Create caption track container |
| `engine.block.create('//ly.img.ubq/caption')` | Create caption block |
| `engine.block.setString(id, property, value)` | Set caption text |
| `engine.block.setTimeOffset(id, offset)` | Set caption start time |
| `engine.block.setDuration(id, duration)` | Set caption display duration |
| `engine.block.setFloat(id, property, value)` | Set font size, spacing |
| `engine.block.setEnum(id, property, value)` | Set alignment |
| `engine.block.setBool(id, property, value)` | Enable background |
| `engine.block.setColor(id, property, value)` | Set colors |
| `engine.block.createAnimation(type)` | Create animation |
| `engine.block.setInAnimation(id, animation)` | Set entry animation |
| `engine.scene.saveToString()` | Save scene to string |
| `engine.dispose()` | Clean up engine resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support