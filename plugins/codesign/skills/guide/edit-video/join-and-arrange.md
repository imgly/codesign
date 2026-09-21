> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Join and Arrange](./edit-video/join-and-arrange.md)

---

Combine multiple video clips into sequences and organize them in the composition using CE.SDK's track system and programmatic APIs.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-join-and-arrange-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-join-and-arrange-server-js)

Video compositions in CE.SDK use a hierarchy: **Scene → Page → Track → Clip**. Tracks organize clips for sequential playback—when you add clips to a track, they play one after another. You can control precise timing using time offsets and create layered compositions by adding multiple tracks to a page.

In CE.SDK's block-based architecture, a **clip is a graphic block with a video fill**. This means video clips share the same APIs and capabilities as other blocks—you can position, rotate, scale, and apply effects to video just like images or shapes. The `addVideo()` helper creates this structure automatically and loads the video metadata.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-create-video-join-and-arrange-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Join and Arrange Video Clips
 *
 * Demonstrates combining multiple video clips into sequences:
 * - Creating video scenes and tracks
 * - Adding clips to tracks for sequential playback
 * - Reordering clips within a track
 * - Controlling clip timing with time offsets
 * - Creating multi-track compositions
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
  engine.block.appendChild(scene, page);

  // Set page to 16:9 landscape (1920x1080 is standard HD video resolution)
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);

  // Set page duration to accommodate all clips (15 seconds total)
  engine.block.setDuration(page, 15);

  // Sample video URL for the demonstration
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

  // Create video clips using the addVideo helper method
  // Each clip is sized to fill the canvas (1920x1080 is standard video resolution)
  const clipA = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 0 }
  });

  const clipB = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 5 }
  });

  const clipC = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 10 }
  });

  // Create a track and add it to the page
  // Tracks organize clips for sequential playback on the timeline
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Add clips to the track
  engine.block.appendChild(track, clipA);
  engine.block.appendChild(track, clipB);
  engine.block.appendChild(track, clipC);

  // Resize all track children to fill the page dimensions
  engine.block.fillParent(track);

  // Query track children to verify order
  const trackClips = engine.block.getChildren(track);
  console.log('Track clip count:', trackClips.length, 'clips');

  // Set durations for each clip
  engine.block.setDuration(clipA, 5);
  engine.block.setDuration(clipB, 5);
  engine.block.setDuration(clipC, 5);

  // Set time offsets to position clips sequentially on the timeline
  engine.block.setTimeOffset(clipA, 0);
  engine.block.setTimeOffset(clipB, 5);
  engine.block.setTimeOffset(clipC, 10);

  console.log('Track offsets set: Clip A: 0s, Clip B: 5s, Clip C: 10s');

  // Reorder clips: move Clip C to the beginning (index 0)
  // This demonstrates using insertChild for precise positioning
  engine.block.insertChild(track, clipC, 0);

  // After reordering, update time offsets to reflect the new sequence
  engine.block.setTimeOffset(clipC, 0);
  engine.block.setTimeOffset(clipA, 5);
  engine.block.setTimeOffset(clipB, 10);

  console.log('After reorder - updated offsets: C=0s, A=5s, B=10s');

  // Get all clips in the track to verify arrangement
  const finalClips = engine.block.getChildren(track);
  console.log('Final track arrangement:');
  finalClips.forEach((clipId, index) => {
    const offset = engine.block.getTimeOffset(clipId);
    const duration = engine.block.getDuration(clipId);
    console.log(
      `  Clip ${index + 1}: offset=${offset}s, duration=${duration}s`
    );
  });

  // Create a second track for layered compositions
  // Track order determines z-index: last track renders on top
  const overlayTrack = engine.block.create('track');
  engine.block.appendChild(page, overlayTrack);

  // Create an overlay clip for picture-in-picture effect (1/4 size)
  const overlayClip = await engine.block.addVideo(
    videoUrl,
    1920 / 4,
    1080 / 4,
    {
      timeline: { duration: 5, timeOffset: 2 }
    }
  );
  engine.block.appendChild(overlayTrack, overlayClip);

  // Position overlay in bottom-right corner with padding
  engine.block.setPositionX(overlayClip, 1920 - 1920 / 4 - 40);
  engine.block.setPositionY(overlayClip, 1080 - 1080 / 4 - 40);

  console.log('Multi-track composition created with overlay starting at 2s');

  console.log('');
  console.log('Join and Arrange guide complete.');
  console.log('Video scene created with:');
  console.log('  - Main track: 3 clips (C, A, B) playing sequentially');
  console.log('  - Overlay track: 1 clip for picture-in-picture effect');
  console.log('  - Total duration: 15 seconds');
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
```

This guide covers how to programmatically create scenes, add and arrange clips in tracks, control clip timing, and create multi-track compositions.

## Prerequisites and Setup

We start by initializing CE.SDK in headless mode for server-side video composition.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The engine runs without a UI, making it suitable for automated workflows, batch processing, or backend services.

## Creating the Scene

We create a scene and set up a page for the video composition.

```typescript highlight=highlight-create-scene
  // Create a scene with a page
  const scene = engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page to 16:9 landscape (1920x1080 is standard HD video resolution)
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);

  // Set page duration to accommodate all clips (15 seconds total)
  engine.block.setDuration(page, 15);
```

The page duration determines how long the composition plays. Set it to accommodate all your clips—in this example, 15 seconds for three 5-second clips.

## Creating Video Clips

We create video clips as graphic blocks with video fills. Each clip needs a video fill that references the source media.

```typescript highlight=highlight-create-clips
  // Create video clips using the addVideo helper method
  // Each clip is sized to fill the canvas (1920x1080 is standard video resolution)
  const clipA = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 0 }
  });

  const clipB = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 5 }
  });

  const clipC = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 5, timeOffset: 10 }
  });
```

The `addVideo` helper method creates a graphic block with an attached video fill and automatically loads the video resource metadata. We set width and height to control how the clip appears in the composition. The `timeline` options let us set duration and time offset in one call.

## Creating Tracks

Tracks organize clips for sequential playback. We create a track and attach it to the page.

```typescript highlight=highlight-create-track
// Create a track and add it to the page
// Tracks organize clips for sequential playback on the timeline
const track = engine.block.create('track');
engine.block.appendChild(page, track);
```

A track acts as a container for clips. When you add clips to a track, they play in the order they were added.

## Adding Clips to Track

We add clips to the track using `appendChild`. Clips join the sequence in the order they're added.

```typescript highlight=highlight-add-clips-to-track
  // Add clips to the track
  engine.block.appendChild(track, clipA);
  engine.block.appendChild(track, clipB);
  engine.block.appendChild(track, clipC);

  // Resize all track children to fill the page dimensions
  engine.block.fillParent(track);

  // Query track children to verify order
  const trackClips = engine.block.getChildren(track);
  console.log('Track clip count:', trackClips.length, 'clips');
```

After adding clips, you can query the track's children to verify the order. `getChildren` returns an array of clip IDs in playback order.

## Setting Clip Durations

Each clip needs a duration that determines how long it plays.

```typescript highlight=highlight-set-clip-durations
// Set durations for each clip
engine.block.setDuration(clipA, 5);
engine.block.setDuration(clipB, 5);
engine.block.setDuration(clipC, 5);
```

Duration is measured in seconds. A 5-second duration means the clip plays for 5 seconds.

## Arranging Clips

### Time Offsets

Time offsets control when each clip starts playing. We set offsets to position clips at specific points in the composition.

```typescript highlight=highlight-time-offsets
  // Set time offsets to position clips sequentially on the timeline
  engine.block.setTimeOffset(clipA, 0);
  engine.block.setTimeOffset(clipB, 5);
  engine.block.setTimeOffset(clipC, 10);

  console.log('Track offsets set: Clip A: 0s, Clip B: 5s, Clip C: 10s');
```

Clip A starts at 0 seconds, Clip B at 5 seconds, and Clip C at 10 seconds. Combined with 5-second durations, this creates a continuous 15-second sequence with no gaps.

### Reordering Clips

Use `insertChild` to move clips to specific positions within a track. This moves an existing child to a new index.

```typescript highlight=highlight-reorder-clips
  // Reorder clips: move Clip C to the beginning (index 0)
  // This demonstrates using insertChild for precise positioning
  engine.block.insertChild(track, clipC, 0);

  // After reordering, update time offsets to reflect the new sequence
  engine.block.setTimeOffset(clipC, 0);
  engine.block.setTimeOffset(clipA, 5);
  engine.block.setTimeOffset(clipB, 10);

  console.log('After reorder - updated offsets: C=0s, A=5s, B=10s');
```

When we insert Clip C at index 0, it becomes the first clip. The order changes from A-B-C to C-A-B. We update time offsets to match the new sequence.

### Querying Track Children

Use `getChildren` to inspect the current clip order and verify arrangements.

```typescript highlight=highlight-get-track-children
// Get all clips in the track to verify arrangement
const finalClips = engine.block.getChildren(track);
console.log('Final track arrangement:');
finalClips.forEach((clipId, index) => {
  const offset = engine.block.getTimeOffset(clipId);
  const duration = engine.block.getDuration(clipId);
  console.log(
    `  Clip ${index + 1}: offset=${offset}s, duration=${duration}s`
  );
});
```

This loop outputs each clip's position, time offset, and duration—useful for debugging or building custom timeline logic.

## Multi-Track Compositions

Create layered compositions by adding multiple tracks to a page. Track order determines rendering order—clips in later tracks appear on top.

```typescript highlight=highlight-multi-track
  // Create a second track for layered compositions
  // Track order determines z-index: last track renders on top
  const overlayTrack = engine.block.create('track');
  engine.block.appendChild(page, overlayTrack);

  // Create an overlay clip for picture-in-picture effect (1/4 size)
  const overlayClip = await engine.block.addVideo(
    videoUrl,
    1920 / 4,
    1080 / 4,
    {
      timeline: { duration: 5, timeOffset: 2 }
    }
  );
  engine.block.appendChild(overlayTrack, overlayClip);

  // Position overlay in bottom-right corner with padding
  engine.block.setPositionX(overlayClip, 1920 - 1920 / 4 - 40);
  engine.block.setPositionY(overlayClip, 1080 - 1080 / 4 - 40);

  console.log('Multi-track composition created with overlay starting at 2s');
```

The overlay track contains a smaller clip positioned in the corner. It starts at 2 seconds and lasts 5 seconds, creating a picture-in-picture effect during that time range.

## Cleanup

Always dispose of the engine when done to free resources.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Troubleshooting

### Clips Not Appearing

If clips don't appear in the composition, verify they're attached to a track that's attached to the page. Use `getParent` and `getChildren` to inspect the hierarchy:

```typescript
const parent = engine.block.getParent(clipId);
const children = engine.block.getChildren(trackId);
```

### Wrong Playback Order

If clips play in unexpected order, check time offsets. Clips play based on their time offset values, not their order in the children array. Set explicit offsets when precise timing matters.

### Video Not Loading

If video content doesn't appear when using `addVideo`, check that the video URL is accessible and the format is supported. The `addVideo` helper automatically loads video metadata.

## API Reference

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `scene.create()` | Create a scene | none | `Promise<DesignBlockId>` |
| `block.addVideo(uri, width, height, options)` | Create video clip with automatic resource loading | `uri: string, width: number, height: number, options?: { timeline: { duration, timeOffset } }` | `Promise<DesignBlockId>` |
| `block.create('track')` | Create a new track | `type: 'track'` | `DesignBlockId` |
| `block.appendChild(parent, child)` | Add child to parent | `parent: DesignBlockId, child: DesignBlockId` | `void` |
| `block.insertChild(parent, child, index)` | Insert child at specific position | `parent: DesignBlockId, child: DesignBlockId, index: number` | `void` |
| `block.getChildren(id)` | Get all children of a block | `id: DesignBlockId` | `DesignBlockId[]` |
| `block.setTimeOffset(id, offset)` | Set when block starts playing | `id: DesignBlockId, offset: number` | `void` |
| `block.getTimeOffset(id)` | Get block's time offset | `id: DesignBlockId` | `number` |
| `block.setDuration(id, duration)` | Set block's duration | `id: DesignBlockId, duration: number` | `void` |
| `block.getDuration(id)` | Get block's duration | `id: DesignBlockId` | `number` |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support