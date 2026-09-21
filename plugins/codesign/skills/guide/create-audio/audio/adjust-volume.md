> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Control audio playback volume programmatically using CE.SDK's headless engine for server-side audio processing, from silent (0.0) to full volume (1.0).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-audio-adjust-volume-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-audio-adjust-volume-server-js)

Volume control adjusts how loud or quiet audio plays during playback. CE.SDK uses a normalized 0.0-1.0 range where 0.0 is completely silent and 1.0 is full volume. This applies to both audio blocks and video fills with embedded audio. Server-side volume control is useful for batch audio processing, automated video production, and generating content with pre-configured volume levels.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-adjust-volume-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Adjust Audio Volume
 *
 * Demonstrates audio volume control in CE.SDK:
 * - Setting volume levels with setVolume
 * - Muting and unmuting with setMuted
 * - Querying volume and mute states
 * - Volume levels for multiple audio sources
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
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);

  // Set volume to 80% (0.8 on a 0.0-1.0 scale)
  const fullVolumeAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, fullVolumeAudio);
  engine.block.setTimeOffset(fullVolumeAudio, 0);
  engine.block.setVolume(fullVolumeAudio, 0.8);

  // Set volume to 30% for background music
  const lowVolumeAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, lowVolumeAudio);
  engine.block.setTimeOffset(lowVolumeAudio, 5);
  engine.block.setVolume(lowVolumeAudio, 0.3);

  // Mute an audio block (preserves volume setting)
  const mutedAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, mutedAudio);
  engine.block.setTimeOffset(mutedAudio, 10);
  engine.block.setVolume(mutedAudio, 1.0);
  engine.block.setMuted(mutedAudio, true);

  // Query current volume and mute states
  const currentVolume = engine.block.getVolume(fullVolumeAudio);
  const isMuted = engine.block.isMuted(mutedAudio);
  const isForceMuted = engine.block.isForceMuted(mutedAudio);

  console.log(`Full volume audio: ${(currentVolume * 100).toFixed(0)}%`);
  console.log(
    `Low volume audio: ${(engine.block.getVolume(lowVolumeAudio) * 100).toFixed(0)}%`
  );
  console.log(
    `Muted audio - isMuted: ${isMuted}, isForceMuted: ${isForceMuted}`
  );

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  console.log('Audio volume adjustment example complete');
} finally {
  engine.dispose();
}
```

This guide covers how to adjust audio volume programmatically using the Engine API, mute and unmute audio, and query volume and mute states.

## Setting Up the Engine

First, initialize the CE.SDK engine in headless mode for server-side processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Understanding Volume Concepts

CE.SDK supports volume levels from **0.0** (silent) to **1.0** (full volume), with **1.0** as the default for new audio blocks. Values in between represent proportional volume levels—0.5 is half volume, 0.25 is quarter volume.

**Volume vs Muting**: Setting volume to 0.0 makes audio silent, but muting with `setMuted()` is preferred when you want to temporarily silence audio without losing the volume setting. Unmuting restores the previous volume level.

**Common use cases**: Batch audio processing, automated video production with pre-set volume levels, normalizing volume across multiple clips, and creating audio mixes programmatically.

## Setting Up Audio for Volume Control

### Loading Audio Files

We create an audio block and load an audio file by setting its `fileURI` property.

```typescript highlight=highlight-create-audio
  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);
```

Unlike video or image blocks which use fills, audio blocks store the file URI directly on the block itself using the `audio/fileURI` property. The `forceLoadAVResource` call ensures CE.SDK has downloaded the audio file and loaded its metadata before we manipulate it.

## Adjusting Volume

### Setting Volume

We can set volume using `setVolume()` with a value between 0.0 and 1.0.

```typescript highlight=highlight-set-volume
// Set volume to 80% (0.8 on a 0.0-1.0 scale)
const fullVolumeAudio = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, fullVolumeAudio);
engine.block.setTimeOffset(fullVolumeAudio, 0);
engine.block.setVolume(fullVolumeAudio, 0.8);
```

Setting volume to 0.8 (80%) is useful when you want prominent audio that isn't at maximum level, leaving headroom for other audio sources or preventing distortion.

### Setting Low Volume for Background Audio

For background music that should be audible but not prominent, use lower volume levels.

```typescript highlight=highlight-set-low-volume
// Set volume to 30% for background music
const lowVolumeAudio = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, lowVolumeAudio);
engine.block.setTimeOffset(lowVolumeAudio, 5);
engine.block.setVolume(lowVolumeAudio, 0.3);
```

At 0.3 (30%) volume, the audio is clearly audible but stays in the background. This is a common level for background music under voiceover or dialogue.

## Muting Audio

### Mute and Unmute

Use `setMuted()` to mute audio without changing its volume setting. This is useful for toggle controls.

```typescript highlight=highlight-mute-audio
// Mute an audio block (preserves volume setting)
const mutedAudio = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, mutedAudio);
engine.block.setTimeOffset(mutedAudio, 10);
engine.block.setVolume(mutedAudio, 1.0);
engine.block.setMuted(mutedAudio, true);
```

When you mute an audio block, the volume setting (1.0 in this case) is preserved. Unmuting later with `setMuted(block, false)` restores playback at the same volume level.

### Querying Volume and Mute States

You can query the current volume and mute states at any time.

```typescript highlight=highlight-query-volume
  // Query current volume and mute states
  const currentVolume = engine.block.getVolume(fullVolumeAudio);
  const isMuted = engine.block.isMuted(mutedAudio);
  const isForceMuted = engine.block.isForceMuted(mutedAudio);

  console.log(`Full volume audio: ${(currentVolume * 100).toFixed(0)}%`);
  console.log(
    `Low volume audio: ${(engine.block.getVolume(lowVolumeAudio) * 100).toFixed(0)}%`
  );
  console.log(
    `Muted audio - isMuted: ${isMuted}, isForceMuted: ${isForceMuted}`
  );
```

Use `getVolume()` to read the current volume level, `isMuted()` to check if the block is muted by the user, and `isForceMuted()` to check if the engine has automatically muted the block due to playback rules.

## Mixing Multiple Audio Sources

### Balancing Tracks

When working with multiple audio sources, use different volume levels to create a balanced mix. A common approach is to keep voiceover or dialogue at higher levels (0.8-1.0) and background music at lower levels (0.3-0.5).

### Common Mixing Patterns

**Voiceover prominent**: Set background music to 0.3 and voiceover to 1.0 for clear narration with musical accompaniment.

**Balanced dialogue and music**: Set both to 0.6-0.7 when both elements are equally important.

**Sound effects as accents**: Set sound effects to 0.5-0.8 depending on how prominent they should be in the mix.

## Troubleshooting

**Volume Changes Not Audible**: Check if the block is muted with `isMuted()` or force muted with `isForceMuted()`. Also verify the audio resource has loaded successfully.

**Force Muted State**: Video fills at playback speeds above 3.0x are automatically force muted by the engine. Reduce the playback speed to restore audio output.

**Volume Not Persisting**: Ensure you're setting volume on the correct block ID. Volume settings are block-specific and don't propagate to duplicates or other instances.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support