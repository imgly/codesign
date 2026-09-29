> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Control Audio and Video](./create-video/control.md)

---

Query metadata, seek to specific positions, and check block visibility programmatically using CE.SDK's playback control APIs in headless mode.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-control-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-control-server-js)

<NodejsVideoExportNotice {...props} />

CE.SDK provides playback control for audio and video through the Block API. In headless mode, playback time, seeking, and visibility checks are controlled programmatically. Resources must be loaded before accessing metadata like duration and dimensions.

```typescript file=@cesdk_web_examples/guides-create-video-control-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Control Audio and Video
 *
 * Demonstrates audio and video control in headless mode:
 * - Force loading video resources with forceLoadAVResource
 * - Querying video metadata (dimensions, duration)
 * - Setting and getting playback time for timeline positioning
 * - Checking visibility at current playback time
 * - Checking playback control support
 * - Saving the scene for later rendering
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

  // Set page duration to accommodate our video content
  engine.block.setDuration(page, 15);

  // Create a track for video blocks
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Sample video URL
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a video block and add it to the track
  const videoBlock = engine.block.create('graphic');
  engine.block.setShape(videoBlock, engine.block.createShape('rect'));
  engine.block.setWidth(videoBlock, 1920);
  engine.block.setHeight(videoBlock, 1080);

  // Create and configure video fill
  const videoFill = engine.block.createFill('video');
  engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
  engine.block.setFill(videoBlock, videoFill);

  // Add to track and set duration
  engine.block.appendChild(track, videoBlock);
  engine.block.setDuration(videoBlock, 10);

  // Force load the video resource to access metadata
  // This is required before accessing duration, dimensions, or other properties
  console.log('Loading video resource...');
  await engine.block.forceLoadAVResource(videoFill);
  console.log('Video resource loaded successfully');

  // Query video dimensions from the loaded resource
  const videoWidth = engine.block.getVideoWidth(videoFill);
  const videoHeight = engine.block.getVideoHeight(videoFill);
  console.log(`Video dimensions: ${videoWidth}x${videoHeight} pixels`);

  // Get the total duration of the source media
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log(`Source media duration: ${totalDuration} seconds`);

  // Check if a block supports playback control
  // Pages and scenes support playback control for timeline-based playback
  const pageSupportsPlayback = engine.block.supportsPlaybackControl(page);
  console.log(`Page supports playback control: ${pageSupportsPlayback}`);

  // Video fills support playback for individual block preview
  const fillSupportsPlayback = engine.block.supportsPlaybackControl(videoFill);
  console.log(`Video fill supports playback control: ${fillSupportsPlayback}`);

  // Check if the page is currently playing
  // In headless mode, this will be false as there is no active playback
  const isPlaying = engine.block.isPlaying(page);
  console.log(`Is playing: ${isPlaying}`);

  // Check if the page supports playback time operations
  if (engine.block.supportsPlaybackTime(page)) {
    // Set the playback time to position the timeline
    // This is useful for rendering frames at specific times
    engine.block.setPlaybackTime(page, 3.0);
    console.log('Playback time set to 3.0 seconds');

    // Get the current playback time
    const currentTime = engine.block.getPlaybackTime(page);
    console.log(`Current playback time: ${currentTime} seconds`);
  }

  // Check if the video block is visible at the current playback time
  // This is useful when working with multiple blocks that have different time offsets
  const isVisible = engine.block.isVisibleAtCurrentPlaybackTime(videoBlock);
  console.log(`Video block visible at current time: ${isVisible}`);

  // Time offset controls when a block becomes active in the timeline
  // Duration controls how long the block appears
  const blockDuration = engine.block.getDuration(videoBlock);
  const blockTimeOffset = engine.block.getTimeOffset(videoBlock);
  console.log(`Video block duration: ${blockDuration} seconds`);
  console.log(`Video block time offset: ${blockTimeOffset} seconds`);

  // Modify time offset to start the block at 1 second
  engine.block.setTimeOffset(videoBlock, 1.0);
  console.log(
    `Updated time offset to: ${engine.block.getTimeOffset(videoBlock)} seconds`
  );

  // Trim controls which portion of the source media plays
  // Check if the video fill supports trimming
  if (engine.block.supportsTrim(videoFill)) {
    // Set trim offset to start playback 2 seconds into the source video
    engine.block.setTrimOffset(videoFill, 2.0);

    // Set trim length to play 5 seconds of the source video
    engine.block.setTrimLength(videoFill, 5.0);

    const trimOffset = engine.block.getTrimOffset(videoFill);
    const trimLength = engine.block.getTrimLength(videoFill);
    console.log(
      `Trim offset: ${trimOffset} seconds (starts at this point in source)`
    );
    console.log(
      `Trim length: ${trimLength} seconds (plays this much of source)`
    );
  }

  // Demonstrate visibility with multiple blocks at different time offsets
  // Create a second video block that starts later in the timeline
  const videoBlock2 = engine.block.create('graphic');
  engine.block.setShape(videoBlock2, engine.block.createShape('rect'));
  engine.block.setWidth(videoBlock2, 960);
  engine.block.setHeight(videoBlock2, 540);

  const videoFill2 = engine.block.createFill('video');
  engine.block.setString(videoFill2, 'fill/video/fileURI', videoUri);
  engine.block.setFill(videoBlock2, videoFill2);

  engine.block.appendChild(track, videoBlock2);
  engine.block.setTimeOffset(videoBlock2, 5.0); // Starts at 5 seconds
  engine.block.setDuration(videoBlock2, 8);

  // Load resources for the second video
  console.log('Loading second video resource...');
  await engine.block.forceLoadAVResource(videoFill2);
  console.log('Second video resource loaded');

  // At playback time 3.0s: first video visible, second not yet
  engine.block.setPlaybackTime(page, 3.0);
  console.log(
    `At 3.0s - Video 1 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}`
  );
  console.log(
    `At 3.0s - Video 2 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock2)}`
  );

  // At playback time 7.0s: both videos visible (if first extends to this time)
  engine.block.setPlaybackTime(page, 7.0);
  console.log(
    `At 7.0s - Video 1 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}`
  );
  console.log(
    `At 7.0s - Video 2 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock2)}`
  );

  // Add an audio block to demonstrate audio resource handling
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);
  engine.block.appendChild(page, audioBlock);
  engine.block.setDuration(audioBlock, 5);
  engine.block.setTimeOffset(audioBlock, 2.0);

  // Force load the audio resource
  console.log('Loading audio resource...');
  await engine.block.forceLoadAVResource(audioBlock);
  const audioDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log(`Audio resource loaded - duration: ${audioDuration} seconds`);

  // Check audio visibility at different times
  engine.block.setPlaybackTime(page, 1.0);
  console.log(
    `At 1.0s - Audio visible: ${engine.block.isVisibleAtCurrentPlaybackTime(audioBlock)}`
  );
  engine.block.setPlaybackTime(page, 3.0);
  console.log(
    `At 3.0s - Audio visible: ${engine.block.isVisibleAtCurrentPlaybackTime(audioBlock)}`
  );

  // Save the scene for later rendering with CE.SDK Renderer
  // Video export is not supported in Node.js - use CE.SDK Renderer instead
  console.log('');
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/video-control.imgly', sceneString);
  console.log('Exported to output/video-control.imgly');

  console.log('');
  console.log('Audio and video control guide completed successfully.');
  console.log('Scene saved with:');
  console.log('  - 2 video blocks with different time offsets');
  console.log('  - 1 audio block');
  console.log('  - Ready for rendering with CE.SDK Renderer');
} finally {
  engine.dispose();
}
```

This guide covers how to load media resources, seek to specific positions, check visibility at playback time, and access video resource metadata.

## Setup

We start by initializing the engine in headless mode and creating a scene with a page and track.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The video block is created with specified dimensions and duration, then added to the track.

```typescript highlight=highlight-add-video
  // Create a video block and add it to the track
  const videoBlock = engine.block.create('graphic');
  engine.block.setShape(videoBlock, engine.block.createShape('rect'));
  engine.block.setWidth(videoBlock, 1920);
  engine.block.setHeight(videoBlock, 1080);

  // Create and configure video fill
  const videoFill = engine.block.createFill('video');
  engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
  engine.block.setFill(videoBlock, videoFill);

  // Add to track and set duration
  engine.block.appendChild(track, videoBlock);
  engine.block.setDuration(videoBlock, 10);
```

## Force Loading Resources

Media resource metadata is unavailable until the resource is loaded. We call `engine.block.forceLoadAVResource()` on the video fill to ensure dimensions and duration are accessible.

```typescript highlight=highlight-force-load
// Force load the video resource to access metadata
// This is required before accessing duration, dimensions, or other properties
console.log('Loading video resource...');
await engine.block.forceLoadAVResource(videoFill);
console.log('Video resource loaded successfully');
```

Without loading the resource first, accessing properties like duration or dimensions throws an error.

## Getting Video Metadata

Once the resource is loaded, we can query the video dimensions and total duration.

```typescript highlight=highlight-get-dimensions
  // Query video dimensions from the loaded resource
  const videoWidth = engine.block.getVideoWidth(videoFill);
  const videoHeight = engine.block.getVideoHeight(videoFill);
  console.log(`Video dimensions: ${videoWidth}x${videoHeight} pixels`);

  // Get the total duration of the source media
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log(`Source media duration: ${totalDuration} seconds`);
```

The `engine.block.getVideoWidth()` and `engine.block.getVideoHeight()` methods return the original video dimensions in pixels. The `engine.block.getAVResourceTotalDuration()` method returns the full duration of the source media in seconds.

## Playback Control

We check if the block supports playback control using `engine.block.supportsPlaybackControl()`. In headless mode, this determines whether the block can be positioned programmatically in the composition. The `engine.block.isPlaying()` method returns whether the block is currently playing, which will be `false` in headless mode since there is no active playback.

```typescript highlight=highlight-playback-control-support
  // Check if a block supports playback control
  // Pages and scenes support playback control for timeline-based playback
  const pageSupportsPlayback = engine.block.supportsPlaybackControl(page);
  console.log(`Page supports playback control: ${pageSupportsPlayback}`);

  // Video fills support playback for individual block preview
  const fillSupportsPlayback = engine.block.supportsPlaybackControl(videoFill);
  console.log(`Video fill supports playback control: ${fillSupportsPlayback}`);

  // Check if the page is currently playing
  // In headless mode, this will be false as there is no active playback
  const isPlaying = engine.block.isPlaying(page);
  console.log(`Is playing: ${isPlaying}`);
```

## Seeking

To set the playback position, we use `engine.block.setPlaybackTime()`. First, check if the block supports playback time with `engine.block.supportsPlaybackTime()`.

```typescript highlight=highlight-playback-time
  // Check if the page supports playback time operations
  if (engine.block.supportsPlaybackTime(page)) {
    // Set the playback time to position the timeline
    // This is useful for rendering frames at specific times
    engine.block.setPlaybackTime(page, 3.0);
    console.log('Playback time set to 3.0 seconds');

    // Get the current playback time
    const currentTime = engine.block.getPlaybackTime(page);
    console.log(`Current playback time: ${currentTime} seconds`);
  }
```

Playback time is specified in seconds. The `engine.block.getPlaybackTime()` method returns the current position.

## Visibility at Current Time

We can check if a block is visible at the current playback position using `engine.block.isVisibleAtCurrentPlaybackTime()`. This is useful when blocks have different time offsets or durations.

```typescript highlight=highlight-visibility
// Check if the video block is visible at the current playback time
// This is useful when working with multiple blocks that have different time offsets
const isVisible = engine.block.isVisibleAtCurrentPlaybackTime(videoBlock);
console.log(`Video block visible at current time: ${isVisible}`);
```

## Time Offset and Duration

Time offset controls when a block becomes active in the composition, while duration controls how long the block appears. Use `engine.block.getTimeOffset()` and `engine.block.getDuration()` to query these values, and their corresponding setters to modify them.

```typescript highlight=highlight-time-offset-duration
  // Time offset controls when a block becomes active in the timeline
  // Duration controls how long the block appears
  const blockDuration = engine.block.getDuration(videoBlock);
  const blockTimeOffset = engine.block.getTimeOffset(videoBlock);
  console.log(`Video block duration: ${blockDuration} seconds`);
  console.log(`Video block time offset: ${blockTimeOffset} seconds`);

  // Modify time offset to start the block at 1 second
  engine.block.setTimeOffset(videoBlock, 1.0);
  console.log(
    `Updated time offset to: ${engine.block.getTimeOffset(videoBlock)} seconds`
  );
```

## Trim

Trim controls which portion of the source media plays. The trim offset specifies where playback starts within the source file, and trim length defines how much of the source to play. Check `engine.block.supportsTrim()` before applying trim operations.

```typescript highlight=highlight-trim
  // Trim controls which portion of the source media plays
  // Check if the video fill supports trimming
  if (engine.block.supportsTrim(videoFill)) {
    // Set trim offset to start playback 2 seconds into the source video
    engine.block.setTrimOffset(videoFill, 2.0);

    // Set trim length to play 5 seconds of the source video
    engine.block.setTrimLength(videoFill, 5.0);

    const trimOffset = engine.block.getTrimOffset(videoFill);
    const trimLength = engine.block.getTrimLength(videoFill);
    console.log(
      `Trim offset: ${trimOffset} seconds (starts at this point in source)`
    );
    console.log(
      `Trim length: ${trimLength} seconds (plays this much of source)`
    );
  }
```

## Troubleshooting

### Properties Unavailable Before Resource Load

**Symptom**: Accessing duration, dimensions, or trim values throws an error.

**Cause**: Media resource not yet loaded.

**Solution**: Always `await engine.block.forceLoadAVResource()` before accessing these properties.

### Block Not Playing

**Symptom**: Calling `setPlaying(true)` has no effect.

**Cause**: Block doesn't support playback control or scene not in playback mode.

**Solution**: Check `supportsPlaybackControl()` returns true; ensure scene playback is active.

### Solo Playback Not Working

**Symptom**: Enabling solo doesn't isolate the block.

**Cause**: Solo applied to wrong block type or block not visible.

**Solution**: Apply solo to video fills or audio blocks, ensure block is at current playback time.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support