> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Ramp audio up at the start of a clip and back down at the end using CE.SDK's headless engine, with a duration in seconds and an optional easing curve.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-audio-fade-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-audio-fade-server-js)

An audio fade ramps a clip between silence and its configured volume over a fixed duration, so audio eases in at the start and tapers off at the end instead of cutting abruptly. Fades apply to standalone audio blocks and to video fills with embedded audio. On the server they are useful for assembling compositions where every clip should open and close cleanly without hand-authored volume automation.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-fade-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Fade Audio In and Out
 *
 * Demonstrates audio fades in CE.SDK:
 * - Fading audio in with setAudioFadeIn
 * - Fading audio out with setAudioFadeOut
 * - Shaping a fade with an easing curve
 * - Fading the embedded audio of a video fill
 * - Reading fade settings back through block properties
 */

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Create a scene with a page to hold the audio and video clips.
  engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.setDuration(page, 18);
  engine.block.appendChild(engine.scene.get()!, page);

  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create an audio block and load the audio file.
  const audioBlock = engine.block.create('audio');
  engine.block.appendChild(page, audioBlock);
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for the resource so the block reports its real metadata.
  await engine.block.forceLoadAVResource(audioBlock);

  engine.block.setTimeOffset(audioBlock, 0);
  engine.block.setDuration(audioBlock, 8);

  // Ramp the audio up from silence over the first 2 seconds of the block.
  engine.block.setAudioFadeIn(audioBlock, 2);

  // Ramp the audio back down to silence over the last 3 seconds of the block.
  engine.block.setAudioFadeOut(audioBlock, 3);

  // Pass an easing curve to shape the ramp. The default is 'Linear'.
  const easedAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, easedAudio);
  engine.block.setTimeOffset(easedAudio, 9);
  engine.block.setDuration(easedAudio, 8);
  engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
  engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');

  // Add a video clip on its own track.
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);
  const videoClip = await engine.block.addVideo(videoUri, 1280, 720, {
    timeline: { duration: 8, timeOffset: 0 }
  });
  engine.block.appendChild(track, videoClip);
  engine.block.fillParent(track);

  // Video audio lives on the video fill, so the fade is set on the fill.
  const videoFill = engine.block.getFill(videoClip);
  await engine.block.forceLoadAVResource(videoFill);

  engine.block.setAudioFadeIn(videoFill, 1.5);
  engine.block.setAudioFadeOut(videoFill, 1.5);

  // Fades are block properties, so they read back through getDouble and getEnum.
  const fadeInDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeIn/duration'
  );
  const fadeInEasing = engine.block.getEnum(
    easedAudio,
    'playback/fadeIn/easing'
  );
  const fadeOutDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeOut/duration'
  );

  console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
  console.log(`Fade out: ${fadeOutDuration}s`);

  // A duration of 0 removes a fade again.
  engine.block.setAudioFadeOut(easedAudio, 0);

  console.log('Audio fade example complete');
} finally {
  engine.dispose();
}
```

This guide covers how to fade audio in and out, shape a fade with an easing curve, fade the audio of a video fill, and read the fade configuration back from a block.

## Setting Up the Engine

First, initialize the CE.SDK engine in headless mode for server-side processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Understanding Audio Fades

A fade produces a gain between **0.0** and **1.0** that is multiplied with the block's volume. A fade-in on a block at 50% volume therefore ramps from silence to 50%, not to full volume. Fades combine with page volume, muting, and clip transitions rather than replacing them.

The fade-in window starts at the beginning of the block and the fade-out window ends at the end of the block, measured against the block's duration on the timeline. Both durations default to `0`, which means no fade.

## Fading Audio In

### Creating the Audio Block

We create an audio block, point it at an audio file, and wait for the resource to load before configuring playback.

```typescript highlight=highlight-create-audio
  // Create an audio block and load the audio file.
  const audioBlock = engine.block.create('audio');
  engine.block.appendChild(page, audioBlock);
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for the resource so the block reports its real metadata.
  await engine.block.forceLoadAVResource(audioBlock);

  engine.block.setTimeOffset(audioBlock, 0);
  engine.block.setDuration(audioBlock, 8);
```

Audio blocks store the file URI directly on the block through the `audio/fileURI` property. The `forceLoadAVResource` call ensures the file has been downloaded and its metadata is available.

### Setting a Fade-In

`setAudioFadeIn()` takes the block and a duration in seconds.

```typescript highlight=highlight-fade-in
// Ramp the audio up from silence over the first 2 seconds of the block.
engine.block.setAudioFadeIn(audioBlock, 2);
```

The clip now starts silent and reaches its configured volume two seconds in. Negative durations are clamped to `0`, so passing a negative value simply leaves the clip without a fade.

## Fading Audio Out

`setAudioFadeOut()` works the same way, measured backwards from the end of the block.

```typescript highlight=highlight-fade-out
// Ramp the audio back down to silence over the last 3 seconds of the block.
engine.block.setAudioFadeOut(audioBlock, 3);
```

With an eight-second clip and a three-second fade-out, the audio plays at full volume for five seconds and then ramps down to silence.

## Choosing an Easing Curve

Both methods take an optional easing curve as their third argument. The default, `'Linear'`, changes the gain at a constant rate.

```typescript highlight=highlight-eased-fade
// Pass an easing curve to shape the ramp. The default is 'Linear'.
const easedAudio = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, easedAudio);
engine.block.setTimeOffset(easedAudio, 9);
engine.block.setDuration(easedAudio, 8);
engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');
```

`'EaseInOut'` starts and ends the ramp gently, which sounds smoother than a linear fade on music. `'EaseIn'` and `'EaseOut'` bias the ramp towards one end. The full set of curves is the same one used by block animations.

## Fading Video Audio

The audio of a video clip lives on the video fill, not on the graphic block that displays it. Set the fade on the fill, exactly as you would with `setVolume()`.

```typescript highlight=highlight-video-fade
  // Video audio lives on the video fill, so the fade is set on the fill.
  const videoFill = engine.block.getFill(videoClip);
  await engine.block.forceLoadAVResource(videoFill);

  engine.block.setAudioFadeIn(videoFill, 1.5);
  engine.block.setAudioFadeOut(videoFill, 1.5);
```

The fade window still follows the graphic block's position and duration on the timeline, so a video clip trimmed on the timeline keeps its fade-out at the new end.

## Reading and Removing Fades

### Reading the Configuration

Fades are exposed as block properties, which makes them straightforward to inspect in batch pipelines.

```typescript highlight=highlight-read-fade
  // Fades are block properties, so they read back through getDouble and getEnum.
  const fadeInDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeIn/duration'
  );
  const fadeInEasing = engine.block.getEnum(
    easedAudio,
    'playback/fadeIn/easing'
  );
  const fadeOutDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeOut/duration'
  );

  console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
  console.log(`Fade out: ${fadeOutDuration}s`);
```

The four properties are `playback/fadeIn/duration` and `playback/fadeOut/duration` (read with `getDouble()`), and `playback/fadeIn/easing` and `playback/fadeOut/easing` (read with `getEnum()`). The same properties can be written with `setDouble()` and `setEnum()` if that fits your code better than the dedicated methods.

### Removing a Fade

Setting a duration of `0` removes the fade again.

```typescript highlight=highlight-remove-fade
// A duration of 0 removes a fade again.
engine.block.setAudioFadeOut(easedAudio, 0);
```

## Fades, Trimming, and Splitting

Because the windows are anchored to the block's timeline duration, shortening a clip moves the fade-out along with the new end instead of leaving it stranded in the middle of the clip. Trimming which part of the source plays does not move the fades either — they stay at the audible start and end.

Splitting a clip keeps only the outer fades: the first half keeps its fade-in and the second half keeps its fade-out. This prevents the audio from dipping to silence and back at the cut.

## Releasing Engine Resources

Dispose the engine when processing is complete to free native resources.

```typescript highlight=highlight-cleanup
engine.dispose();
```

## Troubleshooting

### Fade Is Not Audible in the Export

Check that the block is not muted with `isMuted()` and that its volume is above `0`. The fade ramps towards the block's volume, so a muted or silent block stays silent.

### Setting a Fade Throws

Fades apply only to audio blocks and video fills. Passing a page, or the graphic block that owns a video fill, throws — set the fade on the fill instead.

### Clip Starts Partly Faded Out

If the fade-out is longer than the clip, its window is clamped to the block and the clip begins mid-ramp. Shorten the fade or lengthen the clip.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support