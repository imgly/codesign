> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Add background music and audio tracks to video projects programmatically using
CE.SDK's headless engine for server-side audio processing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-add-music-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-add-music-server-js)

<NodejsVideoExportNotice {...props} />

Audio blocks are standalone time-based blocks that play alongside video content, independent of video fills. In headless server environments, you can create audio blocks, configure time-based position and volume, and manage multiple audio tracks programmatically using the Engine API.

```typescript file=@cesdk_web_examples/guides-create-audio-add-music-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Add Music
 *
 * Demonstrates adding background music to video projects:
 * - Creating audio blocks programmatically
 * - Setting audio source URIs
 * - Configuring timeline position and duration
 * - Setting volume levels
 * - Managing multiple audio blocks
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

  // Set page duration for timeline (30 seconds)
  engine.block.setDuration(page, 30);

  // Create an audio block for background music
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Append audio to the page (makes it part of the timeline)
  engine.block.appendChild(page, audioBlock);

  // Wait for audio to load to get duration
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total duration of the audio file
  const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log('Audio total duration:', totalDuration.toFixed(2), 'seconds');

  // Set when the audio starts on the timeline (0 = beginning)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (use full duration or page duration)
  const playbackDuration = Math.min(totalDuration, 30);
  engine.block.setDuration(audioBlock, playbackDuration);

  // Set the audio volume (0.0 = mute, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Get current volume
  const currentVolume = engine.block.getVolume(audioBlock);
  console.log('Audio volume:', `${(currentVolume * 100).toFixed(0)}%`);

  // Add a second audio track with different settings
  const secondAudioBlock = engine.block.create('audio');
  const secondAudioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
  engine.block.setString(secondAudioBlock, 'audio/fileURI', secondAudioUri);
  engine.block.appendChild(page, secondAudioBlock);

  // Load and configure the second audio
  await engine.block.forceLoadAVResource(secondAudioBlock);
  const secondDuration =
    engine.block.getAVResourceTotalDuration(secondAudioBlock);

  // Start second audio after the first one ends, at lower volume
  engine.block.setTimeOffset(secondAudioBlock, playbackDuration);
  engine.block.setDuration(secondAudioBlock, Math.min(secondDuration, 15));
  engine.block.setVolume(secondAudioBlock, 0.5);

  // Find all audio blocks in the scene
  const allAudioBlocks = engine.block.findByType('audio');
  console.log('\nTotal audio blocks:', allAudioBlocks.length);

  // Get information about each audio block
  allAudioBlocks.forEach((block, index) => {
    const uri = engine.block.getString(block, 'audio/fileURI');
    const timeOffset = engine.block.getTimeOffset(block);
    const duration = engine.block.getDuration(block);
    const volume = engine.block.getVolume(block);

    console.log(`\nAudio block ${index + 1}:`);
    console.log(`  File: ${uri.split('/').pop()}`);
    console.log(`  Time offset: ${timeOffset.toFixed(2)}s`);
    console.log(`  Duration: ${duration.toFixed(2)}s`);
    console.log(`  Volume: ${(volume * 100).toFixed(0)}%`);
  });

  // Demonstrate removing an audio block
  if (allAudioBlocks.length > 1) {
    const blockToRemove = allAudioBlocks[1];

    // Destroy the block to remove it and free resources
    engine.block.destroy(blockToRemove);

    console.log('\nRemoved second audio block');
    console.log(
      'Remaining audio blocks:',
      engine.block.findByType('audio').length
    );
  }

  // Export the scene to a file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save the scene as a .scene file for later use or rendering
  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/scene-with-audio.imgly`, sceneString);

  console.log('\nScene saved to output/scene-with-audio.imgly');
  console.log(
    'The scene contains audio configuration that can be rendered using the CE.SDK Renderer.'
  );

  console.log('\nAdd Music guide complete!');
} finally {
  engine.dispose();
}
```

This guide covers how to create and configure audio blocks programmatically using the Block API, manage multiple audio tracks, and export scene configurations for rendering.

## Setting Up the Engine

Initialize the CE.SDK engine in headless mode for server-side audio processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

The headless engine provides full API access to audio functionality without browser dependencies, making it ideal for batch processing, automated workflows, and server-side content generation.

## Creating a Scene

Create a scene with a page to hold audio content. Set the page dimensions and duration to define the composition length.

```typescript highlight=highlight-create-scene
  // Create a scene with a page for audio content
  engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Set page duration for timeline (30 seconds)
  engine.block.setDuration(page, 30);
```

The page duration determines the maximum playback length for the composition. Audio blocks attached to this page participate in the composition.

## Programmatic Audio Creation

### Create Audio Block

We create audio blocks using `engine.block.create('audio')` and set the source file using the `audio/fileURI` property. The audio block must be appended to a page to become part of the composition.

```typescript highlight=highlight-create-audio-block
  // Create an audio block for background music
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Append audio to the page (makes it part of the timeline)
  engine.block.appendChild(page, audioBlock);
```

Audio blocks support common formats including M4A, MP3, and WAV. The source URI can point to any accessible URL.

### Configure Time Position

Audio blocks have time-based properties that control when and how long they play. We use `setTimeOffset()` to set the start time and `setDuration()` to control playback length.

```typescript highlight=highlight-configure-timeline
  // Wait for audio to load to get duration
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total duration of the audio file
  const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log('Audio total duration:', totalDuration.toFixed(2), 'seconds');

  // Set when the audio starts on the timeline (0 = beginning)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (use full duration or page duration)
  const playbackDuration = Math.min(totalDuration, 30);
  engine.block.setDuration(audioBlock, playbackDuration);
```

The `forceLoadAVResource()` method ensures the audio file is loaded before we access its duration. This is important when you need to know the total length of the audio file for timing calculations.

### Configure Volume

Volume is set using `setVolume()` with values from 0.0 (mute) to 1.0 (full volume). This volume level is applied during export and affects the final rendered output.

```typescript highlight=highlight-configure-volume
  // Set the audio volume (0.0 = mute, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Get current volume
  const currentVolume = engine.block.getVolume(audioBlock);
  console.log('Audio volume:', `${(currentVolume * 100).toFixed(0)}%`);
```

## Adding Multiple Audio Tracks

Add multiple audio tracks to create layered soundscapes. Each track can have independent timing, duration, and volume settings.

```typescript highlight=highlight-add-second-audio
  // Add a second audio track with different settings
  const secondAudioBlock = engine.block.create('audio');
  const secondAudioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
  engine.block.setString(secondAudioBlock, 'audio/fileURI', secondAudioUri);
  engine.block.appendChild(page, secondAudioBlock);

  // Load and configure the second audio
  await engine.block.forceLoadAVResource(secondAudioBlock);
  const secondDuration =
    engine.block.getAVResourceTotalDuration(secondAudioBlock);

  // Start second audio after the first one ends, at lower volume
  engine.block.setTimeOffset(secondAudioBlock, playbackDuration);
  engine.block.setDuration(secondAudioBlock, Math.min(secondDuration, 15));
  engine.block.setVolume(secondAudioBlock, 0.5);
```

When working with multiple audio sources, use different volume levels to create a balanced mix. A common approach is to keep primary audio at higher levels and background music at lower levels.

## Managing Audio Blocks

### List Audio Blocks

Use `findByType('audio')` to retrieve all audio blocks in the scene. This is useful for building audio management interfaces or batch operations.

```typescript highlight=highlight-list-audio-blocks
  // Find all audio blocks in the scene
  const allAudioBlocks = engine.block.findByType('audio');
  console.log('\nTotal audio blocks:', allAudioBlocks.length);

  // Get information about each audio block
  allAudioBlocks.forEach((block, index) => {
    const uri = engine.block.getString(block, 'audio/fileURI');
    const timeOffset = engine.block.getTimeOffset(block);
    const duration = engine.block.getDuration(block);
    const volume = engine.block.getVolume(block);

    console.log(`\nAudio block ${index + 1}:`);
    console.log(`  File: ${uri.split('/').pop()}`);
    console.log(`  Time offset: ${timeOffset.toFixed(2)}s`);
    console.log(`  Duration: ${duration.toFixed(2)}s`);
    console.log(`  Volume: ${(volume * 100).toFixed(0)}%`);
  });
```

### Remove Audio

To remove an audio block, call `destroy()` which removes it from the scene and frees its resources.

```typescript highlight=highlight-remove-audio
  // Demonstrate removing an audio block
  if (allAudioBlocks.length > 1) {
    const blockToRemove = allAudioBlocks[1];

    // Destroy the block to remove it and free resources
    engine.block.destroy(blockToRemove);

    console.log('\nRemoved second audio block');
    console.log(
      'Remaining audio blocks:',
      engine.block.findByType('audio').length
    );
  }
```

Always destroy blocks that are no longer needed to prevent memory leaks, especially when processing multiple audio files in batch workflows.

## Exporting Results

Save the scene configuration for later use or rendering. In headless mode, export the scene as a `.scene` file that can be loaded and rendered later.

```typescript highlight=highlight-export
  // Export the scene to a file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save the scene as a .scene file for later use or rendering
  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/scene-with-audio.imgly`, sceneString);

  console.log('\nScene saved to output/scene-with-audio.imgly');
  console.log(
    'The scene contains audio configuration that can be rendered using the CE.SDK Renderer.'
  );
```

The exported scene contains all audio configuration including source URIs, time positions, durations, and volume levels. To produce the final video with audio on the server, export MP4 directly with the native `@cesdk/node-native` package or use the CE.SDK Renderer. Note: with `@cesdk/node-native` on Linux and Windows, export of scenes with standalone audio blocks does not finish yet — see the [video limitations guide](./create-video/limitations.md).

## Troubleshooting

**Audio Resource Loading Fails**: Verify the audio URI is accessible from the server environment. Check network connectivity and URL validity. Ensure the audio format is supported (M4A, MP3, WAV).

**Duration Returns Zero**: Call `forceLoadAVResource()` before accessing duration. The audio metadata must be loaded first.

**Volume Not Applied**: Ensure volume is set before exporting the scene. Volume settings are stored in the scene and applied during rendering.

**Memory Issues with Multiple Files**: Destroy audio blocks when they are no longer needed. For batch processing, consider processing files in smaller batches.

## API Reference

| Method                                      | Description                    |
| ------------------------------------------- | ------------------------------ |
| `block.create('audio')`                     | Create a new audio block       |
| `block.setString(id, 'audio/fileURI', uri)` | Set the audio source file      |
| `block.appendChild(parent, child)`          | Append audio to page           |
| `block.setTimeOffset(id, seconds)`          | Set when audio starts playing  |
| `block.setDuration(id, seconds)`            | Set audio playback duration    |
| `block.setVolume(id, volume)`               | Set volume (0.0 to 1.0)        |
| `block.getVolume(id)`                       | Get current volume level       |
| `block.getAVResourceTotalDuration(id)`      | Get total audio file duration  |
| `block.forceLoadAVResource(id)`             | Force load audio resource      |
| `block.findByType('audio')`                 | Find all audio blocks in scene |
| `block.destroy(id)`                         | Remove audio block             |
| `scene.saveToString()`                      | Export scene as .scene file    |

## Audio Type

A block for playing audio content.

This section describes the properties available for the **Audio Type** (`//ly.img.ubq/audio`) block type.

| Property                          | Type     | Default    | Description                                                                                                                                                                                                                                                                                                                          |
| --------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `audio/fileURI`                   | `String` | `""`       | A URI referencing an audio file.                                                                                                                                                                                                                                                                                                     |
| `audio/totalDuration`             | `Double` | `"-"`      | The total duration of the audio file., *(read-only)*                                                                                                                                                                                                                                                                                 |
| `contentFill/horizontalAlignment` | `Enum`   | `"Center"` | The horizontal alignment of the content fill inside the block. Only affects `Contain` and `Cover` fill modes; has no visible effect in `Crop` mode., Possible values: `"Left"`, `"Center"`, `"Right"`                                                                                                                                |
| `contentFill/mode`                | `Enum`   | `"Cover"`  | Defines how content should be resized to fit its container., Possible values: `"Crop"`, `"Cover"`, `"Contain"`                                                                                                                                                                                                                       |
| `contentFill/verticalAlignment`   | `Enum`   | `"Center"` | The vertical alignment of the content fill inside the block. Only affects `Contain` and `Cover` fill modes; has no visible effect in `Crop` mode., Possible values: `"Top"`, `"Center"`, `"Bottom"`                                                                                                                                  |
| `playback/duration`               | `Double` | `null`     | The duration in seconds for which this block should be visible.                                                                                                                                                                                                                                                                      |
| `playback/fadeIn/duration`        | `Double` | `0`        | Audio fade-in duration in seconds at the start of the block. 0 disables the fade-in.                                                                                                                                                                                                                                                 |
| `playback/fadeIn/easing`          | `Enum`   | `"Linear"` | Easing curve of the audio fade-in., Possible values: `"Linear"`, `"EaseIn"`, `"EaseOut"`, `"EaseInOut"`, `"EaseInQuart"`, `"EaseOutQuart"`, `"EaseInOutQuart"`, `"EaseInQuint"`, `"EaseOutQuint"`, `"EaseInOutQuint"`, `"EaseInBack"`, `"EaseOutBack"`, `"EaseInOutBack"`, `"EaseInSpring"`, `"EaseOutSpring"`, `"EaseInOutSpring"`  |
| `playback/fadeOut/duration`       | `Double` | `0`        | Audio fade-out duration in seconds at the end of the block. 0 disables the fade-out.                                                                                                                                                                                                                                                 |
| `playback/fadeOut/easing`         | `Enum`   | `"Linear"` | Easing curve of the audio fade-out., Possible values: `"Linear"`, `"EaseIn"`, `"EaseOut"`, `"EaseInOut"`, `"EaseInQuart"`, `"EaseOutQuart"`, `"EaseInOutQuart"`, `"EaseInQuint"`, `"EaseOutQuint"`, `"EaseInOutQuint"`, `"EaseInBack"`, `"EaseOutBack"`, `"EaseInOutBack"`, `"EaseInSpring"`, `"EaseOutSpring"`, `"EaseInOutSpring"` |
| `playback/looping`                | `Bool`   | `false`    | Whether the medium should start from the beginning again or should stop.                                                                                                                                                                                                                                                             |
| `playback/muted`                  | `Bool`   | `false`    | Whether the audio is muted.                                                                                                                                                                                                                                                                                                          |
| `playback/playing`                | `Bool`   | `false`    | A tag that can be set on elements for their playback time to be progressed.                                                                                                                                                                                                                                                          |
| `playback/soloPlaybackEnabled`    | `Bool`   | `false`    | A tag for blocks where playback should progress while the scene is paused.                                                                                                                                                                                                                                                           |
| `playback/speed`                  | `Float`  | `1`        | The playback speed multiplier.                                                                                                                                                                                                                                                                                                       |
| `playback/time`                   | `Double` | `0`        | The current playback time of the block contents in seconds.                                                                                                                                                                                                                                                                          |
| `playback/timeOffset`             | `Double` | `0`        | The time in seconds relative to its parent at which this block should first appear.                                                                                                                                                                                                                                                  |
| `playback/trimLength`             | `Double` | `"-"`      | The relative duration of the clip for playback.                                                                                                                                                                                                                                                                                      |
| `playback/trimOffset`             | `Double` | `"-"`      | The time within the clip at which playback should begin, in seconds.                                                                                                                                                                                                                                                                 |
| `playback/volume`                 | `Float`  | `1`        | Audio volume with a range of \[0, 1].                                                                                                                                                                                                                                                                                                 |
| `selected`                        | `Bool`   | `false`    | Indicates if the block is currently selected.                                                                                                                                                                                                                                                                                        |




---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support