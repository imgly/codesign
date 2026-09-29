> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Trim](./edit-video/trim.md)

---

Control video playback timing by trimming clips to specific start points and
durations using CE.SDK's programmatic trim API in headless mode.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-trim-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-trim-server-js)

<NodejsVideoExportNotice {...props} />

Understanding the difference between **fill-level trimming** and **block-level timing** is key. Fill-level trimming (`setTrimOffset`, `setTrimLength`) controls which portion of the source media plays, while block-level timing (`setTimeOffset`, `setDuration`) controls when and how long the block appears in the composition. These two systems work together to give you complete control over video playback.

```typescript file=@cesdk_web_examples/guides-create-video-trim-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Trim Video and Audio
 *
 * Demonstrates trimming video clips in headless mode:
 * - Loading video resources with forceLoadAVResource
 * - Basic video trimming with setTrimOffset/setTrimLength
 * - Getting current trim values
 * - Getting source media duration
 * - Coordinating trim with block duration
 * - Trimming with looping enabled
 * - Checking trim support
 * - Frame-accurate trimming
 * - Batch trimming multiple videos
 * - Saving the scene for later use
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
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  engine.block.appendChild(scene, page);

  // Set page duration to accommodate all demonstrations
  engine.block.setDuration(page, 30);

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Block size for layout
  const blockSize = { width: 320, height: 180 };

  // Create a video block to demonstrate trim support checking
  const sampleVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the video fill - trim operations are applied to the fill, not the block
  const videoFill = engine.block.getFill(sampleVideo);

  // Check if the fill supports trim operations
  const supportsTrim = engine.block.supportsTrim(videoFill);
  console.log('Video fill supports trim:', supportsTrim); // true for video fills

  // Load the video resource before accessing trim properties
  // This ensures metadata (duration, frame rate, etc.) is available
  await engine.block.forceLoadAVResource(videoFill);

  // Get the total duration of the source video
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log('Total video duration:', totalDuration, 'seconds');

  // Create a video block for basic trim demonstration
  const basicTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the fill to apply trim operations
  const basicTrimFill = engine.block.getFill(basicTrimVideo);

  // Load resource before trimming
  await engine.block.forceLoadAVResource(basicTrimFill);

  // Trim video to start at 2 seconds and play for 5 seconds
  engine.block.setTrimOffset(basicTrimFill, 2.0);
  engine.block.setTrimLength(basicTrimFill, 5.0);

  console.log('Basic trim applied: offset 2s, length 5s');

  // Get current trim values to verify or modify
  const currentOffset = engine.block.getTrimOffset(basicTrimFill);
  const currentLength = engine.block.getTrimLength(basicTrimFill);
  console.log(
    `Current trim values - Offset: ${currentOffset}s, Length: ${currentLength}s`
  );

  // Get the total duration of source media to validate trim values
  const sourceDuration = engine.block.getAVResourceTotalDuration(basicTrimFill);
  console.log('Source media duration:', sourceDuration, 'seconds');

  // Validate trim doesn't exceed source length
  const maxTrimLength = sourceDuration - currentOffset;
  console.log('Maximum trim length from current offset:', maxTrimLength, 's');

  // Create a video block demonstrating trim + duration coordination
  const durationTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const durationTrimFill = engine.block.getFill(durationTrimVideo);
  await engine.block.forceLoadAVResource(durationTrimFill);

  // Set trim: play portion from 3s to 8s (5 seconds of content)
  engine.block.setTrimOffset(durationTrimFill, 3.0);
  engine.block.setTrimLength(durationTrimFill, 5.0);

  // Set block duration: how long this block appears in the timeline
  // When duration equals trim length, the entire trimmed portion plays once
  engine.block.setDuration(durationTrimVideo, 5.0);

  console.log('Trim+Duration: Block will play trimmed 5s exactly once');

  // Create a video block with trim + looping
  const loopingTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const loopingTrimFill = engine.block.getFill(loopingTrimVideo);
  await engine.block.forceLoadAVResource(loopingTrimFill);

  // Trim to a short 3-second segment
  engine.block.setTrimOffset(loopingTrimFill, 1.0);
  engine.block.setTrimLength(loopingTrimFill, 3.0);

  // Enable looping so the 3-second segment repeats
  engine.block.setLooping(loopingTrimFill, true);

  // Verify looping is enabled
  const isLooping = engine.block.isLooping(loopingTrimFill);
  console.log('Looping enabled:', isLooping);

  // Set duration longer than trim length - the trim will loop to fill it
  engine.block.setDuration(loopingTrimVideo, 9.0);

  console.log('Looping trim: 3s segment will loop 3 times to fill 9s duration');

  // Create a video block for frame-accurate trimming
  const frameAccurateTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const frameFill = engine.block.getFill(frameAccurateTrimVideo);
  await engine.block.forceLoadAVResource(frameFill);

  // For frame-accurate trimming, assume a common frame rate (e.g., 30fps)
  // In production, you may know the frame rate from your video metadata
  const frameRate = 30;

  // Calculate trim offset based on specific frame number
  // Example: Start at frame 60 for a 30fps video = 2.0 seconds
  const startFrame = 60;
  const trimOffsetSeconds = startFrame / frameRate;

  // Trim for exactly 150 frames = 5.0 seconds at 30fps
  const trimFrames = 150;
  const trimLengthSeconds = trimFrames / frameRate;

  engine.block.setTrimOffset(frameFill, trimOffsetSeconds);
  engine.block.setTrimLength(frameFill, trimLengthSeconds);

  console.log(
    `Frame-accurate trim - Frame rate: ${frameRate}fps, Start: ${startFrame}, Duration: ${trimFrames} frames`
  );

  // Batch process multiple video clips with consistent trimming
  const batchVideoUris = [
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4'
  ];

  const batchVideos = [];
  for (const uri of batchVideoUris) {
    const batchVideo = await engine.block.addVideo(
      uri,
      blockSize.width,
      blockSize.height
    );
    batchVideos.push(batchVideo);

    // Get the fill for trim operations
    const batchFill = engine.block.getFill(batchVideo);

    // Load resource before trimming
    await engine.block.forceLoadAVResource(batchFill);

    // Apply consistent trim: first 4 seconds of each video
    engine.block.setTrimOffset(batchFill, 0.0);
    engine.block.setTrimLength(batchFill, 4.0);

    // Set consistent duration
    engine.block.setDuration(batchVideo, 4.0);
  }

  console.log(
    `Batch trim: Applied consistent 4s trim to ${batchVideos.length} videos`
  );

  // ===== Position all blocks in grid layout =====
  const spacing = 20;
  const margin = 40;
  const cols = 3;

  const getPosition = (index: number) => ({
    x: margin + (index % cols) * (blockSize.width + spacing),
    y: margin + Math.floor(index / cols) * (blockSize.height + spacing)
  });

  const blocks = [
    sampleVideo,
    basicTrimVideo,
    durationTrimVideo,
    loopingTrimVideo,
    frameAccurateTrimVideo,
    ...batchVideos
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Save the scene as a .scene file for later use or rendering
  // This preserves all trim settings and can be loaded in any CE.SDK environment
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/trimmed-video.imgly', sceneString);
  console.log('Exported to output/trimmed-video.imgly');

  console.log('');
  console.log('Video trim guide completed successfully.');
  console.log('Scene saved with:');
  console.log('  - 8 video blocks with various trim configurations');
  console.log('  - Basic trim, duration coordination, looping, and batch trim');
  console.log('  - Ready for rendering with CE.SDK Renderer');
} finally {
  engine.dispose();
}
```

This guide covers how to trim videos programmatically using the Engine API in a headless Node.js environment.

## Understanding Trim Concepts

### Fill-Level Trimming

When we trim a video, we're adjusting properties of the video's fill, not the block itself. The fill represents the media source—the actual video file. Fill-level trimming determines which portion of that source media will play.

`setTrimOffset` specifies where playback starts within the source media. A trim offset of `2.0` skips the first two seconds of the video file.

`setTrimLength` defines how much of the source media plays from the trim offset point. A trim length of 5.0 will play 5 seconds of the source. Combined with a trim offset of 2.0, the video plays from 2 seconds to 7 seconds of the original file.

This trimming is completely non-destructive—the source video file remains unchanged. You can adjust trim values at any time to show different portions of the same media.

> **Note:** Audio blocks use the same trim API (`setTrimOffset`, `setTrimLength`) as video
> blocks. The concepts are identical, though this guide focuses on video.

### Block-Level Timing

Block-level timing is separate from trimming and controls when and how long a block exists in the composition. `setTimeOffset` determines when the block becomes active in the composition (useful for track-based layouts). `setDuration` controls how long the block appears in the composition.

The *trim* controls what plays from the source media, while the *duration* controls how long that playback appears in the composition. If the duration exceeds the trim length and if looping is disabled, the trimmed portion will play once and then hold the last frame for the remaining duration.

### Common Use Cases

Trimming enables many video editing workflows:

- **Remove unwanted segments** - Cut intro or outro portions to keep videos concise
- **Extract key moments** - Isolate specific segments from longer source media
- **Sync audio to video** - Trim audio and video independently for perfect alignment
- **Create loops** - Trim to a specific length and enable loop mode for seamless repeating content
- **Uniform compositions** - Batch trim multiple clips to consistent lengths

## Programmatic Video Trimming

### Initialize CE.SDK

For headless video processing, we initialize CE.SDK's Node.js engine. This provides full API access to the trimming system without browser dependencies, making it ideal for server-side automation and batch processing.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The headless engine gives you complete control over video trimming operations, perfect for automated workflows, background processing, and server-side video preparation.

### Loading Video Resources

Before accessing trim properties or setting trim values, we must load the video resource metadata using `forceLoadAVResource`. This step ensures CE.SDK has information about the video's duration and other properties needed for accurate trimming.

```typescript highlight-load-video-resource
  // Load the video resource before accessing trim properties
  // This ensures metadata (duration, frame rate, etc.) is available
  await engine.block.forceLoadAVResource(videoFill);

  // Get the total duration of the source video
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log('Total video duration:', totalDuration, 'seconds');
```

Skipping this step is a common source of errors. Without loading the resource first, trim operations may fail or produce unexpected results. Always await `forceLoadAVResource` before calling any trim methods.

Once loaded, we can access metadata like `totalDuration` from the video fill. This information helps us calculate valid trim ranges and ensures we don't try to trim beyond the available media.

### Checking Trim Support

Before applying trim operations, we verify that a block supports trimming. While video fills typically support trimming, other block types like pages and scenes do not.

```typescript highlight-check-trim-support
  // Create a video block to demonstrate trim support checking
  const sampleVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the video fill - trim operations are applied to the fill, not the block
  const videoFill = engine.block.getFill(sampleVideo);

  // Check if the fill supports trim operations
  const supportsTrim = engine.block.supportsTrim(videoFill);
  console.log('Video fill supports trim:', supportsTrim); // true for video fills
```

Checking support prevents runtime errors and allows you to build robust applications that only apply trim operations to compatible blocks. Graphic blocks with video fills also support trimming, not just top-level video blocks.

### Trimming Video

Once we've confirmed trim support and loaded the resource, we can apply trimming. Here we create a video block and trim it to start 2 seconds into the source media and play for 5 seconds.

```typescript highlight-basic-video-trim
  // Create a video block for basic trim demonstration
  const basicTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the fill to apply trim operations
  const basicTrimFill = engine.block.getFill(basicTrimVideo);

  // Load resource before trimming
  await engine.block.forceLoadAVResource(basicTrimFill);

  // Trim video to start at 2 seconds and play for 5 seconds
  engine.block.setTrimOffset(basicTrimFill, 2.0);
  engine.block.setTrimLength(basicTrimFill, 5.0);

  console.log('Basic trim applied: offset 2s, length 5s');
```

The trim offset of 2.0 skips the first 2 seconds of the video. The trim length of 5.0 means exactly 5 seconds of video will play, starting from that offset point. So this video plays from the 2-second mark to the 7-second mark of the original file.

### Getting Current Trim Values

We can retrieve the current trim settings to verify values, make relative adjustments, or log processing information.

```typescript highlight-get-trim-values
// Get current trim values to verify or modify
const currentOffset = engine.block.getTrimOffset(basicTrimFill);
const currentLength = engine.block.getTrimLength(basicTrimFill);
console.log(
  `Current trim values - Offset: ${currentOffset}s, Length: ${currentLength}s`
);
```

These getter methods return the current trim offset and length in seconds. Use them to validate settings before export or to calculate remaining media duration.

### Getting Source Media Duration

Use `getAVResourceTotalDuration()` to determine the total duration of the source media file. This helps validate that trim values don't exceed available media.

```typescript highlight-get-source-duration
  // Get the total duration of source media to validate trim values
  const sourceDuration = engine.block.getAVResourceTotalDuration(basicTrimFill);
  console.log('Source media duration:', sourceDuration, 'seconds');

  // Validate trim doesn't exceed source length
  const maxTrimLength = sourceDuration - currentOffset;
  console.log('Maximum trim length from current offset:', maxTrimLength, 's');
```

Always check the source duration when processing videos of unknown length. This prevents setting trim offsets beyond the video's end and ensures your trim length doesn't exceed available content.

## Additional Trimming Techniques

### Trimming with Block Duration

Trim length and block duration interact to determine playback behavior. When block duration equals trim length, the entire trimmed portion plays exactly once.

```typescript highlight-trim-with-duration
  // Create a video block demonstrating trim + duration coordination
  const durationTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const durationTrimFill = engine.block.getFill(durationTrimVideo);
  await engine.block.forceLoadAVResource(durationTrimFill);

  // Set trim: play portion from 3s to 8s (5 seconds of content)
  engine.block.setTrimOffset(durationTrimFill, 3.0);
  engine.block.setTrimLength(durationTrimFill, 5.0);

  // Set block duration: how long this block appears in the timeline
  // When duration equals trim length, the entire trimmed portion plays once
  engine.block.setDuration(durationTrimVideo, 5.0);

  console.log('Trim+Duration: Block will play trimmed 5s exactly once');
```

If the block duration is less than the trim length, only part of the trimmed segment will play. If duration exceeds trim length without looping enabled, the video plays the trimmed portion once and holds on the last frame for the remaining time.

### Trimming with Looping

Looping allows a trimmed video segment to repeat seamlessly. We enable looping and set a block duration longer than the trim length to create repeating playback.

```typescript highlight-trim-with-looping
  // Create a video block with trim + looping
  const loopingTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const loopingTrimFill = engine.block.getFill(loopingTrimVideo);
  await engine.block.forceLoadAVResource(loopingTrimFill);

  // Trim to a short 3-second segment
  engine.block.setTrimOffset(loopingTrimFill, 1.0);
  engine.block.setTrimLength(loopingTrimFill, 3.0);

  // Enable looping so the 3-second segment repeats
  engine.block.setLooping(loopingTrimFill, true);

  // Verify looping is enabled
  const isLooping = engine.block.isLooping(loopingTrimFill);
  console.log('Looping enabled:', isLooping);

  // Set duration longer than trim length - the trim will loop to fill it
  engine.block.setDuration(loopingTrimVideo, 9.0);

  console.log('Looping trim: 3s segment will loop 3 times to fill 9s duration');
```

The 3-second trimmed segment loops 3 times to fill the 9-second duration. This technique is useful for creating background loops, repeated motion graphics, or extending short clips.

When looping is enabled, CE.SDK automatically restarts playback from the trim offset when it reaches the end of the trim length. Use `isLooping()` to check the current looping state.

### Frame-Accurate Trimming

For precise editing, we can trim to specific frame boundaries rather than arbitrary time values. Using the video's frame rate, we calculate exact frame-based trim points.

```typescript highlight-frame-accurate-trim
  // Create a video block for frame-accurate trimming
  const frameAccurateTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const frameFill = engine.block.getFill(frameAccurateTrimVideo);
  await engine.block.forceLoadAVResource(frameFill);

  // For frame-accurate trimming, assume a common frame rate (e.g., 30fps)
  // In production, you may know the frame rate from your video metadata
  const frameRate = 30;

  // Calculate trim offset based on specific frame number
  // Example: Start at frame 60 for a 30fps video = 2.0 seconds
  const startFrame = 60;
  const trimOffsetSeconds = startFrame / frameRate;

  // Trim for exactly 150 frames = 5.0 seconds at 30fps
  const trimFrames = 150;
  const trimLengthSeconds = trimFrames / frameRate;

  engine.block.setTrimOffset(frameFill, trimOffsetSeconds);
  engine.block.setTrimLength(frameFill, trimLengthSeconds);

  console.log(
    `Frame-accurate trim - Frame rate: ${frameRate}fps, Start: ${startFrame}, Duration: ${trimFrames} frames`
  );
```

Convert frame numbers to time offsets by dividing by the frame rate. Starting at frame 60 with a 30fps video gives exactly 2.0 seconds. Trimming for 150 frames provides exactly 5.0 seconds of playback.

This technique ensures frame-accurate edits for professional video processing workflows. Keep in mind that codec compression may affect true frame accuracy—test with your target codecs to verify precision.

### Batch Processing Multiple Videos

When working with multiple video clips that need consistent trimming, iterate through collections and apply the same trim settings programmatically.

```typescript highlight-batch-trim-videos
  // Batch process multiple video clips with consistent trimming
  const batchVideoUris = [
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4'
  ];

  const batchVideos = [];
  for (const uri of batchVideoUris) {
    const batchVideo = await engine.block.addVideo(
      uri,
      blockSize.width,
      blockSize.height
    );
    batchVideos.push(batchVideo);

    // Get the fill for trim operations
    const batchFill = engine.block.getFill(batchVideo);

    // Load resource before trimming
    await engine.block.forceLoadAVResource(batchFill);

    // Apply consistent trim: first 4 seconds of each video
    engine.block.setTrimOffset(batchFill, 0.0);
    engine.block.setTrimLength(batchFill, 4.0);

    // Set consistent duration
    engine.block.setDuration(batchVideo, 4.0);
  }

  console.log(
    `Batch trim: Applied consistent 4s trim to ${batchVideos.length} videos`
  );
```

We create multiple video blocks and apply identical trim settings to each one. This ensures consistency across clips—useful for creating video montages, multi-angle compositions, or any scenario where uniform clip lengths are required.

When batch processing, always load each video's resources before trimming. Check total duration to ensure your trim values don't exceed available media.

## Exporting Results

After applying trim settings, export the processed content to a file. In headless mode, we export a PNG snapshot to verify the trim configuration.

```typescript highlight-export
  // Save the scene as a .scene file for later use or rendering
  // This preserves all trim settings and can be loaded in any CE.SDK environment
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/trimmed-video.imgly', sceneString);
  console.log('Exported to output/trimmed-video.imgly');
```

The export operation renders all video blocks at their current trim positions and saves the result to the file system. For full video encoding and export, use `engine.block.exportVideo()` with the native `@cesdk/node-native` package; with the WASM-based `@cesdk/node`, use the separate CE.SDK Renderer. Always dispose of the engine instance when processing is complete to free resources.

## Trim vs Duration Interaction

### How setDuration Affects Playback

The relationship between trim length and block duration determines playback behavior. When block duration equals trim length, the video plays the trimmed portion exactly once. When duration is less than trim length, playback stops before the trimmed portion finishes. When duration exceeds trim length with looping disabled, the video plays once and holds on the last frame.

With looping enabled, exceeding trim length causes the trimmed segment to repeat until the block duration is filled. This creates seamless loops as long as the content loops visually.

### Best Practices

For predictable behavior, always consider both trim and duration together. Set trim values first to define the source media segment you want. Then set duration to control playback length. If you want the entire trimmed segment to play once, match duration to trim length. For looping content, enable looping before setting a longer duration.

When building automated pipelines, always coordinate trim and duration values. This prevents confusion about why a video isn't playing the full trimmed length (duration too short) or why it's holding on the last frame (duration too long without looping).

## Performance Considerations

CE.SDK's headless engine is optimized for server-side processing, but keep these factors in mind:

- **Resource loading**: `forceLoadAVResource` has network and processing overhead. Load resources once, then apply trim operations as needed.
- **Trim adjustments**: Changing trim values is lightweight—CE.SDK updates the playback range without reprocessing the video.
- **Memory usage**: Each loaded video consumes memory. For batch processing many videos, consider processing in smaller batches.
- **Long videos**: Very long source videos (30+ minutes) may have slower seeking to trim offsets.

Test your trim operations with representative workloads to ensure acceptable performance for your use case.

## Troubleshooting

### Trim Not Applied

If setting trim values has no visible effect, the most common cause is forgetting to await `forceLoadAVResource`. The resource must be loaded before trim values take effect. Always load resources first.

Another possibility is confusing time offset with trim offset. `setTimeOffset` controls when the block appears in the composition, while `setTrimOffset` controls where in the source media playback starts.

### Incorrect Trim Calculation

If trim values seem offset or produce unexpected results, verify you're calculating based on the source media duration, not the block duration. Use `getAVResourceTotalDuration` to understand the available media length.

Also check that trim offset plus trim length doesn't exceed total duration. CE.SDK may clamp values automatically, but validating before setting prevents unexpected behavior.

### Playback Beyond Trim Length

If video plays past the intended trim length, check that block duration doesn't exceed trim length. When duration is longer and looping is disabled, the video will hold on the last frame for the excess duration.

Ensure looping is set correctly for your use case. If you want playback to stop at the trim length, set duration equal to trim length or enable looping.

### Audio/Video Desync

When trimming both audio and video independently, desynchronization can occur if offset and duration values aren't coordinated carefully. Calculate both trim offsets to maintain the original relationship between audio and video timing.

Consider the original sync point between audio and video in the source media. If they were perfectly synced at 0 seconds originally, maintaining the same offset difference preserves that sync.

### Frame-Accurate Trim Issues

If frame-accurate trimming doesn't land on exact frames, remember that floating-point precision can cause tiny discrepancies. Round your calculated values to a reasonable precision (e.g., 3 decimal places).

Also understand codec limitations. Variable frame rate videos don't have perfectly uniform frame timing, so true frame accuracy may not be possible. Use constant frame rate sources for critical frame-accurate applications.

### Export Issues

If export fails or produces unexpected output:

- Verify all video resources loaded successfully before export
- Check that trim values are within valid ranges
- Ensure sufficient disk space for output files
- For large videos, monitor memory usage during export

## Best Practices

### Workflow Recommendations

1. Always `await forceLoadAVResource()` before accessing trim properties
2. Check `supportsTrim()` before applying trim operations
3. Coordinate trim length with block duration for predictable behavior
4. Use TypeScript for type safety with CE.SDK API
5. Validate trim values don't exceed total media duration
6. Dispose of engine instances when processing is complete

### Code Organization

- Separate media loading from trim logic
- Create helper functions for common trim patterns (e.g., `trimToFrames`, `trimToPercentage`)
- Handle errors gracefully with try-catch blocks around `forceLoadAVResource`
- Document complex trim calculations with comments explaining frame math

### Performance Optimization

- Avoid redundant `forceLoadAVResource` calls—load once, trim multiple times
- Process videos in batches to manage memory usage
- Consider parallel processing for independent trim operations
- Test on target environments early to identify performance bottlenecks

## API Reference

| Method                           | Description                        | Parameters                            | Returns         |
| -------------------------------- | ---------------------------------- | ------------------------------------- | --------------- |
| `getFill(id)`                    | Get the fill block for a block     | `id: DesignBlockId`                   | `DesignBlockId` |
| `forceLoadAVResource(id)`        | Force load media resource metadata | `id: DesignBlockId`                   | `Promise<void>` |
| `supportsTrim(id)`               | Check if block supports trimming   | `id: DesignBlockId`                   | `boolean`       |
| `setTrimOffset(id, offset)`      | Set start point of media playback  | `id: DesignBlockId, offset: number`   | `void`          |
| `getTrimOffset(id)`              | Get current trim offset            | `id: DesignBlockId`                   | `number`        |
| `setTrimLength(id, length)`      | Set duration of trimmed media      | `id: DesignBlockId, length: number`   | `void`          |
| `getTrimLength(id)`              | Get current trim length            | `id: DesignBlockId`                   | `number`        |
| `getAVResourceTotalDuration(id)` | Get total duration of source media | `id: DesignBlockId`                   | `number`        |
| `setLooping(id, enabled)`        | Enable/disable media looping       | `id: DesignBlockId, enabled: boolean` | `void`          |
| `isLooping(id)`                  | Check if media looping is enabled  | `id: DesignBlockId`                   | `boolean`       |
| `setDuration(id, duration)`      | Set block playback duration        | `id: DesignBlockId, duration: number` | `void`          |
| `getDuration(id)`                | Get block duration                 | `id: DesignBlockId`                   | `number`        |
| `setTimeOffset(id, offset)`      | Set when block becomes active      | `id: DesignBlockId, offset: number`   | `void`          |
| `getTimeOffset(id)`              | Get block time offset              | `id: DesignBlockId`                   | `number`        |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support