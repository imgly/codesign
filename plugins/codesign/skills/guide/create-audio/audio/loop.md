> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Control audio looping behavior programmatically using CE.SDK's headless engine
for server-side audio processing and automated content workflows.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-audio-loop-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-audio-loop-server-js)

<NodejsVideoExportNotice {...props} />

Audio looping allows media to play continuously by restarting from the beginning when it reaches the end. When you set a block's duration longer than the audio length and enable looping, CE.SDK automatically repeats the audio to fill the entire duration. Server-side looping configuration is useful for batch processing, automated content generation, and preparing audio compositions for later export.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-loop-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Loop Audio
 *
 * Demonstrates audio looping in CE.SDK:
 * - Enabling looping with setLooping
 * - Querying looping state with isLooping
 * - Disabling looping for one-time playback
 * - Combining looping with trim settings
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

  // Set page duration for timeline content
  engine.block.setDuration(page, 30);

  // Use a sample audio file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Load the audio resource to access metadata
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total audio duration
  const audioDuration = engine.block.getDouble(
    audioBlock,
    'audio/totalDuration'
  );
  console.log(`Audio duration: ${audioDuration.toFixed(2)} seconds`);

  // Enable looping for seamless repeating playback
  const loopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, loopingAudio);
  engine.block.setTimeOffset(loopingAudio, 0);
  engine.block.setLooping(loopingAudio, true);
  engine.block.setDuration(loopingAudio, 15);

  console.log('Looping audio: enabled, duration 15 seconds');

  // Check if audio block is set to loop
  const isLooping = engine.block.isLooping(loopingAudio);
  console.log(`Is looping: ${isLooping}`);

  // Create non-looping audio for one-time playback
  const nonLoopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, nonLoopingAudio);
  engine.block.setTimeOffset(nonLoopingAudio, 16);
  engine.block.setLooping(nonLoopingAudio, false);
  engine.block.setDuration(nonLoopingAudio, 12);

  console.log('Non-looping audio: plays once and stops');

  // Combine looping with trim settings for short repeating segments
  const trimmedLoopAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, trimmedLoopAudio);
  engine.block.setTimeOffset(trimmedLoopAudio, 29);

  // Trim to a 2-second segment starting at 1 second
  engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
  engine.block.setTrimLength(trimmedLoopAudio, 2.0);

  // Enable looping and set duration longer than trim length
  engine.block.setLooping(trimmedLoopAudio, true);
  engine.block.setDuration(trimmedLoopAudio, 8.0);

  console.log('Trimmed loop: 2s segment loops 4 times to fill 8s duration');

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  // Display summary
  console.log('\n--- Audio Looping Summary ---');
  console.log(
    `Looping audio block: looping=${engine.block.isLooping(loopingAudio)}`
  );
  console.log(
    `Non-looping audio block: looping=${engine.block.isLooping(nonLoopingAudio)}`
  );
  console.log(
    `Trimmed looping audio block: looping=${engine.block.isLooping(trimmedLoopAudio)}`
  );

  // Save the scene as a .scene file for later use or rendering
  console.log('\nSaving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/audio-looping.imgly', sceneString);
  console.log('Exported to output/audio-looping.imgly');

  console.log('\nAudio looping example complete');
} finally {
  engine.dispose();
}
```

This guide covers how to enable and disable audio looping, control looping behavior with duration settings, and loop trimmed audio segments using the headless Node.js engine.

## Setting Up the Engine

First, we initialize the CE.SDK engine in headless mode for server-side processing.

```typescript highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

The headless engine provides full API access to audio looping operations without browser dependencies.

## Understanding Audio Looping

When looping is enabled on an audio block, CE.SDK repeats the audio content from the beginning each time it reaches the end. This continues until the block's duration is filled. For example, a 5-second audio clip with looping enabled and a 15-second duration plays three complete times.

The loop transitions are seamless—CE.SDK jumps immediately from the end back to the beginning without gaps or clicks. The audio content itself determines how smooth the loop sounds. Audio files designed for looping (with matching start and end points) create perfectly seamless loops.

## Creating Audio Blocks

### Adding Audio Content

Audio blocks use file URIs to reference audio sources. We create the block and set the audio source.

```typescript highlight-create-audio-block
// Create an audio block and load the audio file
const audioBlock = engine.block.create('audio');
engine.block.setString(audioBlock, 'audio/fileURI', audioUri);
```

The `audio/fileURI` property points to the audio file. CE.SDK supports common audio formats including MP3, M4A, WAV, and AAC.

## Enabling Audio Looping

### Loading Audio Resources

Before working with audio properties like duration or trim, we load the audio resource to ensure metadata is available.

```typescript highlight-load-audio-resource
  // Load the audio resource to access metadata
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total audio duration
  const audioDuration = engine.block.getDouble(
    audioBlock,
    'audio/totalDuration'
  );
  console.log(`Audio duration: ${audioDuration.toFixed(2)} seconds`);
```

Loading the resource provides access to the total audio duration, which helps calculate how many times the audio will loop given a specific block duration.

### Setting Looping State

We enable looping by calling `engine.block.setLooping()` with `true`. When combined with a block duration longer than the audio length, the audio repeats to fill the full duration.

```typescript highlight-enable-looping
  // Enable looping for seamless repeating playback
  const loopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, loopingAudio);
  engine.block.setTimeOffset(loopingAudio, 0);
  engine.block.setLooping(loopingAudio, true);
  engine.block.setDuration(loopingAudio, 15);

  console.log('Looping audio: enabled, duration 15 seconds');
```

In this example, if the audio is 5 seconds long and the block duration is 15 seconds, the audio loops three times (5 seconds × 3 = 15 seconds total).

## Querying and Controlling Looping

### Checking Looping State

We can check whether an audio block has looping enabled at any time.

```typescript highlight-query-looping-state
// Check if audio block is set to loop
const isLooping = engine.block.isLooping(loopingAudio);
console.log(`Is looping: ${isLooping}`);
```

This is useful when managing batch operations with multiple audio tracks, allowing us to query and update looping states dynamically.

### Disabling Looping

To play audio once without repeating, we set looping to `false`.

```typescript highlight-non-looping-audio
  // Create non-looping audio for one-time playback
  const nonLoopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, nonLoopingAudio);
  engine.block.setTimeOffset(nonLoopingAudio, 16);
  engine.block.setLooping(nonLoopingAudio, false);
  engine.block.setDuration(nonLoopingAudio, 12);

  console.log('Non-looping audio: plays once and stops');
```

With looping disabled and a duration longer than the audio length, the audio plays once and then stops, leaving silence for the remaining duration.

## Looping with Trim Settings

### Trimming Looped Audio

We can combine trimming with looping to create short repeating segments from longer audio files.

```typescript highlight-looping-with-trim
  // Combine looping with trim settings for short repeating segments
  const trimmedLoopAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, trimmedLoopAudio);
  engine.block.setTimeOffset(trimmedLoopAudio, 29);

  // Trim to a 2-second segment starting at 1 second
  engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
  engine.block.setTrimLength(trimmedLoopAudio, 2.0);

  // Enable looping and set duration longer than trim length
  engine.block.setLooping(trimmedLoopAudio, true);
  engine.block.setDuration(trimmedLoopAudio, 8.0);

  console.log('Trimmed loop: 2s segment loops 4 times to fill 8s duration');
```

This trims the audio to a 2-second segment (from 1.0s to 3.0s of the source), then loops that segment four times to fill an 8-second duration. This technique is useful for creating rhythmic loops or extracting repeatable portions from longer audio files.

### Choosing Loop Points

For seamless loops, choose trim points where the audio content flows naturally from end to beginning. Audio with consistent rhythm, tone, and volume at trim boundaries creates the smoothest loops. Abrupt changes in content or volume at loop boundaries create noticeable transitions.

## Exporting the Scene

After configuring audio looping, we save the scene for later use or rendering. The scene file preserves all looping settings and can be loaded in any CE.SDK environment.

```typescript highlight-export
  // Save the scene as a .scene file for later use or rendering
  console.log('\nSaving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/audio-looping.imgly', sceneString);
  console.log('Exported to output/audio-looping.imgly');
```

The exported `.scene` file contains all audio blocks with their looping configurations, ready for further editing or for server-side rendering — directly via `engine.block.exportVideo()` with the native `@cesdk/node-native` package, or with the CE.SDK Renderer. Note: with `@cesdk/node-native` on Linux and Windows, export of scenes with standalone audio blocks does not finish yet — see the [video limitations guide](./create-video/limitations.md).

## Troubleshooting

**Audio not looping**: Verify looping is enabled with `engine.block.isLooping()` and that the block duration exceeds the audio length. Looping only takes effect when the duration allows multiple repetitions.

**Audible gaps at loop points**: Choose trim points where the audio naturally transitions from end to beginning. Audio with matching start and end volume levels creates smoother loops.

**Resource not loaded**: Always call `engine.block.forceLoadAVResource()` before accessing duration properties. Without loading the resource first, metadata like total duration won't be available.

## API Reference

| Method                                | Description                        | Parameters                                           | Returns         |
| ------------------------------------- | ---------------------------------- | ---------------------------------------------------- | --------------- |
| `engine.block.create(type)`           | Create an audio block              | `type: 'audio'`                                      | `DesignBlockId` |
| `engine.block.setString(id, property, value)` | Set audio source URI       | `id: DesignBlockId, property: string, value: string` | `void`          |
| `engine.block.setLooping(id, enabled)` | Enable or disable audio looping   | `id: DesignBlockId, enabled: boolean`                | `void`          |
| `engine.block.isLooping(id)`          | Check if audio is set to loop      | `id: DesignBlockId`                                  | `boolean`       |
| `engine.block.setDuration(id, duration)` | Set block playback duration     | `id: DesignBlockId, duration: number`                | `void`          |
| `engine.block.getDuration(id)`        | Get block duration                 | `id: DesignBlockId`                                  | `number`        |
| `engine.block.setTrimOffset(id, offset)` | Set trim start point            | `id: DesignBlockId, offset: number`                  | `void`          |
| `engine.block.setTrimLength(id, length)` | Set trim length                 | `id: DesignBlockId, length: number`                  | `void`          |
| `engine.block.forceLoadAVResource(id)` | Load audio resource with metadata | `id: DesignBlockId`                                  | `Promise<void>` |
| `engine.block.getDouble(id, property)` | Get audio property value          | `id: DesignBlockId, property: string`                | `number`        |
| `engine.scene.saveToString()`          | Export scene as string            | none                                                 | `Promise<string>` |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support