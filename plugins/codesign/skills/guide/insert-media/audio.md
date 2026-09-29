> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Insert Media Assets](./insert-media.md) > [Insert Audio](./insert-media/audio.md)

---

Add audio files to video projects using CE.SDK's audio block system for
background music, sound effects, and voiceovers.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-insert-media-audio-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-insert-media-audio-server-js)

Audio blocks are time-based blocks that play sound alongside video content. Unlike video fills that attach to graphic blocks, audio blocks exist independently in the composition with their own duration, position, and volume controls.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-insert-media-audio-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Insert Audio
 *
 * Demonstrates inserting audio files into CE.SDK scenes:
 * - Creating audio blocks
 * - Setting audio source URIs
 * - Configuring timeline position (timeOffset, duration)
 * - Controlling playback (volume, mute, loop)
 * - Finding and managing audio blocks
 */

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});

try {
  // Create a scene with a page
  engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Sample audio file URL
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Add the audio block to the page
  engine.block.appendChild(page, audioBlock);

  // Load the audio resource to access its metadata
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total duration of the audio file
  const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log(`Audio total duration: ${totalDuration.toFixed(2)} seconds`);

  // Set when the audio starts playing on the timeline (in seconds)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (in seconds)
  // Here we use the full audio duration
  engine.block.setDuration(audioBlock, totalDuration);

  // Query current timeline position
  const timeOffset = engine.block.getTimeOffset(audioBlock);
  const duration = engine.block.getDuration(audioBlock);
  console.log(
    `Timeline position: starts at ${timeOffset}s, duration ${duration.toFixed(2)}s`
  );

  // Set audio volume (0.0 = silent, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Query current volume
  const volume = engine.block.getVolume(audioBlock);
  console.log(`Volume: ${(volume * 100).toFixed(0)}%`);

  // Mute audio without changing volume setting
  engine.block.setMuted(audioBlock, true);

  // Check if audio is muted
  const isMuted = engine.block.isMuted(audioBlock);
  console.log(`Audio muted: ${isMuted}`);

  // Unmute the audio
  engine.block.setMuted(audioBlock, false);

  // Enable looping for continuous playback
  engine.block.setLooping(audioBlock, true);

  // Check if looping is enabled
  const isLooping = engine.block.isLooping(audioBlock);
  console.log(`Looping enabled: ${isLooping}`);

  // Find all audio blocks in the scene
  const audioBlocks = engine.block.findByType('audio');
  console.log(`Found ${audioBlocks.length} audio block(s)`);

  // Get the audio source URI from each block
  for (const block of audioBlocks) {
    const sourceUri = engine.block.getString(block, 'audio/fileURI');
    console.log(`Audio source: ${sourceUri}`);
  }

  // Create a second audio block to demonstrate removal
  const tempAudio = engine.block.create('audio');
  engine.block.setString(
    tempAudio,
    'audio/fileURI',
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a'
  );
  engine.block.appendChild(page, tempAudio);

  // Remove the temporary audio block
  engine.block.destroy(tempAudio);
  console.log('Temporary audio block removed');

  // Verify only the original audio block remains
  const remainingBlocks = engine.block.findByType('audio');
  console.log(`Remaining audio blocks: ${remainingBlocks.length}`);

  console.log('Insert audio guide completed successfully');
} finally {
  engine.dispose();
}
```

This guide covers creating audio blocks, configuring time-based properties, controlling playback settings, and managing audio blocks in your scene.

## Creating an Audio Block

We create audio blocks using `engine.block.create('audio')` and set the source file with the `audio/fileURI` property. Audio blocks must be appended to a page to become part of the composition.

```typescript highlight=highlight-create-audio
  // Create an audio block
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Add the audio block to the page
  engine.block.appendChild(page, audioBlock);
```

CE.SDK supports WAV and MP4 audio formats (including `.m4a` files). The source URI can point to any accessible URL.

## Configuring Time Position

Audio blocks have time-based properties that control when and how long they play. We use `setTimeOffset()` for the start position and `setDuration()` for playback length.

```typescript highlight=highlight-configure-timeline
  // Set when the audio starts playing on the timeline (in seconds)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (in seconds)
  // Here we use the full audio duration
  engine.block.setDuration(audioBlock, totalDuration);
```

The `forceLoadAVResource()` method loads the audio file so we can access its total duration. Use `getAVResourceTotalDuration()` to get the full length of the source audio for timing calculations.

## Adjusting Volume

We set volume using `setVolume()` with values from 0.0 (silent) to 1.0 (full volume). This affects the final exported output.

```typescript highlight=highlight-adjust-volume
  // Set audio volume (0.0 = silent, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Query current volume
  const volume = engine.block.getVolume(audioBlock);
```

## Muting Audio

To temporarily silence audio without removing it, use `setMuted()`. This preserves all other properties while stopping sound output.

```typescript highlight=highlight-mute-audio
  // Mute audio without changing volume setting
  engine.block.setMuted(audioBlock, true);

  // Check if audio is muted
  const isMuted = engine.block.isMuted(audioBlock);
  console.log(`Audio muted: ${isMuted}`);

  // Unmute the audio
  engine.block.setMuted(audioBlock, false);
```

## Looping Audio

Enable continuous playback with `setLooping()`. When enabled, the audio repeats until the end of the block's duration in the composition.

```typescript highlight=highlight-loop-audio
  // Enable looping for continuous playback
  engine.block.setLooping(audioBlock, true);

  // Check if looping is enabled
  const isLooping = engine.block.isLooping(audioBlock);
  console.log(`Looping enabled: ${isLooping}`);
```

## Finding Audio Blocks

Use `findByType('audio')` to retrieve all audio blocks in the scene. This is useful for batch operations or managing multiple audio tracks.

```typescript highlight=highlight-find-audio
  // Find all audio blocks in the scene
  const audioBlocks = engine.block.findByType('audio');
  console.log(`Found ${audioBlocks.length} audio block(s)`);

  // Get the audio source URI from each block
  for (const block of audioBlocks) {
    const sourceUri = engine.block.getString(block, 'audio/fileURI');
    console.log(`Audio source: ${sourceUri}`);
  }
```

## Removing Audio

To remove an audio block, call `destroy()`. This removes the block from the scene and frees its resources.

```typescript highlight=highlight-remove-audio
  // Create a second audio block to demonstrate removal
  const tempAudio = engine.block.create('audio');
  engine.block.setString(
    tempAudio,
    'audio/fileURI',
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a'
  );
  engine.block.appendChild(page, tempAudio);

  // Remove the temporary audio block
  engine.block.destroy(tempAudio);
  console.log('Temporary audio block removed');

  // Verify only the original audio block remains
  const remainingBlocks = engine.block.findByType('audio');
  console.log(`Remaining audio blocks: ${remainingBlocks.length}`);
```

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.create('audio')` | Create a new audio block |
| `engine.block.setString(block, 'audio/fileURI', uri)` | Set the audio source file |
| `engine.block.appendChild(parent, child)` | Add audio block to page |
| `engine.block.forceLoadAVResource(block)` | Force load the audio file |
| `engine.block.getAVResourceTotalDuration(block)` | Get total audio duration in seconds |
| `engine.block.setTimeOffset(block, seconds)` | Set start position |
| `engine.block.setDuration(block, seconds)` | Set playback duration |
| `engine.block.setVolume(block, volume)` | Set volume (0.0-1.0) |
| `engine.block.getVolume(block)` | Get current volume |
| `engine.block.setMuted(block, muted)` | Mute or unmute audio |
| `engine.block.isMuted(block)` | Check if audio is muted |
| `engine.block.setLooping(block, loop)` | Enable/disable looping |
| `engine.block.isLooping(block)` | Check if looping is enabled |
| `engine.block.findByType('audio')` | Find all audio blocks |
| `engine.block.destroy(block)` | Remove audio block from scene |

## Next Steps

[Insert Media Overview](./insert-media/overview.md) - Learn about adding different media types to your projects

[Split Video](./edit-video/split.md) - Split video clips on the timeline

[Load Scene](./open-the-editor/load-scene.md) - Save and reload your scenes with audio

[Store Custom Metadata](./export-save-publish/store-custom-metadata.md) - Save custom data with your scenes



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support