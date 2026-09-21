> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Control audio playback speed programmatically using CE.SDK's headless engine
for server-side audio processing, from quarter-speed (0.25x) to triple-speed
(3.0x).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-audio-adjust-speed-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-audio-adjust-speed-server-js)

<NodejsVideoExportNotice {...props} />

Playback speed adjustment changes how fast or slow audio plays without changing its pitch (though pitch shifting may occur depending on the audio processing implementation). A speed multiplier of 1.0 represents normal speed, values below 1.0 slow down playback, and values above 1.0 speed it up. This technique is commonly used for podcast speed controls, time-compressed narration, slow-motion audio effects, and accessibility features.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-adjust-speed-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFile, mkdir } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Adjust Audio Playback Speed
 *
 * Demonstrates audio playback speed adjustment in CE.SDK:
 * - Loading audio files
 * - Adjusting playback speed with setPlaybackSpeed
 * - Three speed presets: slow-motion (0.5x), normal (1.0x), and maximum (3.0x)
 * - Understanding how speed affects duration
 */

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Create a scene with a page for audio content
  engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Use a sample audio file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);

  // Slow Motion Audio (0.5x - half speed, doubles duration)
  const slowAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, slowAudioBlock);
  engine.block.setTimeOffset(slowAudioBlock, 0);
  engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);

  // Normal Speed Audio (1.0x - original playback rate)
  const normalAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, normalAudioBlock);
  engine.block.setTimeOffset(normalAudioBlock, 5);
  engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);

  // Query current speed to verify the change
  const currentSpeed = engine.block.getPlaybackSpeed(normalAudioBlock);
  console.log(`Normal speed block set to: ${currentSpeed}x`);

  // Maximum Speed Audio (3.0x - triple speed, reduces duration to 1/3)
  const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, maxSpeedAudioBlock);
  engine.block.setTimeOffset(maxSpeedAudioBlock, 10);
  engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);

  // Log duration changes to demonstrate speed-duration relationship
  const slowDuration = engine.block.getDuration(slowAudioBlock);
  const normalDuration = engine.block.getDuration(normalAudioBlock);
  const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

  console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
  console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
  console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  // Export the scene to a .scene file
  const sceneContent = await engine.scene.saveToString();
  await mkdir('output', { recursive: true });
  await writeFile('output/audio-speed-adjustment.imgly', sceneContent);
  console.log('Scene exported to output/audio-speed-adjustment.imgly');

  console.log('Audio playback speed adjustment example complete');
} finally {
  engine.dispose();
}
```

This guide covers how to adjust audio playback speed programmatically using the Engine API, understand speed constraints, and manage how speed changes affect block duration.

## Understanding Speed Concepts

CE.SDK supports playback speeds from **0.25x** (quarter speed) to **3.0x** (triple speed), with **1.0x** as the default normal speed. Values below 1.0 slow down playback, values above 1.0 speed it up.

**Speed and Duration**: Adjusting speed automatically changes the block's duration following an inverse relationship: `perceived_duration = original_duration / speed_multiplier`. A 10-second clip at 2.0x speed plays in 5 seconds; at 0.5x speed it takes 20 seconds. This automatic adjustment maintains synchronization when coordinating audio with other elements.

**Common use cases**: Podcast playback controls (1.5x-2.0x), accessibility features (0.75x for easier comprehension), time-compressed narration, dramatic slow-motion effects (0.25x-0.5x), transcription work, and music tempo adjustments.

## Setting Up the Engine

For headless audio processing, initialize CE.SDK's Node.js engine. This provides full API access without browser dependencies, ideal for server-side automation and batch processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Setting Up Audio for Speed Adjustment

### Loading Audio Files

We create an audio block and load an audio file by setting its `fileURI` property.

```typescript highlight=highlight-create-audio
  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);
```

Unlike video or image blocks which use fills, audio blocks store the file URI directly on the block itself using the `audio/fileURI` property. The `forceLoadAVResource` call ensures CE.SDK has downloaded the audio file and loaded its metadata, which is essential for accurate duration information and playback speed control.

## Adjusting Playback Speed

### Setting Normal Speed

By default, audio plays at normal speed (1.0x). We can explicitly set this to ensure consistent baseline behavior.

```typescript highlight=highlight-set-normal-speed
  // Normal Speed Audio (1.0x - original playback rate)
  const normalAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, normalAudioBlock);
  engine.block.setTimeOffset(normalAudioBlock, 5);
  engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);

  // Query current speed to verify the change
  const currentSpeed = engine.block.getPlaybackSpeed(normalAudioBlock);
  console.log(`Normal speed block set to: ${currentSpeed}x`);
```

Setting speed to 1.0 ensures the audio plays at its original recorded rate. This is useful after experimenting with different speeds and wanting to return to normal, or when initializing audio blocks programmatically to ensure consistent starting states.

## Common Speed Presets

### Slow Motion Audio (0.5x)

Slowing audio to half speed creates a slow-motion effect that's useful for careful listening or transcription.

```typescript highlight=highlight-set-slow-motion
// Slow Motion Audio (0.5x - half speed, doubles duration)
const slowAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, slowAudioBlock);
engine.block.setTimeOffset(slowAudioBlock, 0);
engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);
```

At 0.5x speed, a 10-second audio clip will take 20 seconds to play. This slower pace makes it easier to catch details, transcribe speech accurately, or create dramatic slow-motion audio effects in creative projects.

### Maximum Speed (3.0x)

The maximum supported speed is 3.0x, three times normal playback rate.

```typescript highlight=highlight-set-maximum-speed
// Maximum Speed Audio (3.0x - triple speed, reduces duration to 1/3)
const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, maxSpeedAudioBlock);
engine.block.setTimeOffset(maxSpeedAudioBlock, 10);
engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);
```

At maximum speed, audio plays very quickly—a 10-second clip finishes in just 3.33 seconds. This extreme speed is useful for rapidly skimming through content to find specific moments, though comprehension becomes challenging at this rate.

## Speed and Block Duration

### Understanding Duration Changes

When we change playback speed, CE.SDK automatically adjusts the block's duration to reflect the new playback time.

```typescript highlight=highlight-speed-and-duration
  // Log duration changes to demonstrate speed-duration relationship
  const slowDuration = engine.block.getDuration(slowAudioBlock);
  const normalDuration = engine.block.getDuration(normalAudioBlock);
  const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

  console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
  console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
  console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);
```

The original duration represents how long the audio takes to play at normal speed. When we double the speed to 2.0x, the duration is automatically halved. The audio content is the same, but it plays through in half the time, so the block duration shrinks accordingly.

This automatic adjustment keeps your composition synchronized. If you have multiple audio tracks or need to coordinate audio with video, the block durations will accurately reflect the new playback duration after speed changes.

## Exporting Results

After adjusting audio speeds, export the scene to preserve your work. The `engine.scene.saveToString()` method serializes the entire scene, including all audio blocks with their speed settings.

```typescript highlight=highlight-export
// Export the scene to a .scene file
const sceneContent = await engine.scene.saveToString();
await mkdir('output', { recursive: true });
await writeFile('output/audio-speed-adjustment.imgly', sceneContent);
console.log('Scene exported to output/audio-speed-adjustment.imgly');
```

The exported `.scene` file can be loaded later for further editing or used as a template for batch processing workflows.

## API Reference

| Method                                        | Description                                                                                                    | Parameters                                           | Returns           |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------- |
| `engine.block.create(type)`                   | Creates a new design block of the specified type                                                               | `type: DesignBlockType`                              | `DesignBlockId`   |
| `engine.block.setString(id, property, value)` | Sets a string property on a block                                                                              | `id: DesignBlockId, property: string, value: string` | `void`            |
| `engine.block.forceLoadAVResource(id)`        | Forces loading of audio/video resource metadata                                                                | `id: DesignBlockId`                                  | `Promise<void>`   |
| `engine.block.setPlaybackSpeed(id, speed)`    | Sets the playback speed multiplier. Valid range is \[0.25, 3.0] for audio blocks. Also adjusts trim and duration | `id: DesignBlockId, speed: number`                   | `void`            |
| `engine.block.getPlaybackSpeed(id)`           | Gets the current playback speed multiplier                                                                     | `id: DesignBlockId`                                  | `number`          |
| `engine.block.getDuration(id)`                | Gets the playback duration of a block in seconds                                                               | `id: DesignBlockId`                                  | `number`          |
| `engine.scene.saveToString()`                 | Serializes the current scene into a string                                                                     | `allowedResourceSchemes?: string[]`                  | `Promise<string>` |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support