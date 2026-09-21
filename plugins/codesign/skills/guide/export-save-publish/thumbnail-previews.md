> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Thumbnail Previews](./export-save-publish/thumbnail-previews.md)

---

Stream an audio waveform from a clip on the server with
`generateAudioThumbnailSequence()`, then accumulate the chunks into a single
array you can store or draw.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-thumbnail-previews-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-thumbnail-previews-server-js)

`engine.block.generateAudioThumbnailSequence()` produces a waveform for an audio block or a video fill. Instead of returning everything at once, it delivers the samples in chunks through a callback as the engine reads the media, so a long clip does not block your program.

```typescript file=@cesdk_web_examples/guides-export-save-publish-thumbnail-previews-server-js/server-js.ts reference-only
import CreativeEngine, { type DesignBlockId } from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Thumbnail Previews
 *
 * Demonstrates the streaming audio waveform API on @cesdk/node:
 * - Accumulating chunks from generateAudioThumbnailSequence into one envelope
 * - Reading an interleaved stereo envelope
 * - Cancelling an in-flight request with the returned closure
 */

const OUTPUT_DIR = './output';
const AUDIO_URI =
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
const CLIP_DURATION = 8;

// Draw the envelope as ASCII art, mirrored around a centerline. The values are
// already normalized to [0, 1], so no scaling or peak-finding is needed.
function renderWaveform(
  envelope: Float32Array,
  columns: number,
  rows: number
): string {
  const half = Math.floor(rows / 2);
  const samplesPerColumn = envelope.length / columns;
  const buckets: number[] = [];

  for (let column = 0; column < columns; column++) {
    const start = Math.floor(column * samplesPerColumn);
    const end = Math.min(
      Math.ceil((column + 1) * samplesPerColumn),
      envelope.length
    );
    let sum = 0;
    for (let i = start; i < end; i++) sum += envelope[i];
    buckets.push(end > start ? sum / (end - start) : 0);
  }

  const lines: string[] = [];
  for (let row = -half; row <= half; row++) {
    const line = buckets
      .map((value) => (Math.abs(row) <= Math.round(value * half) ? '#' : ' '))
      .join('');
    lines.push(line.trimEnd());
  }
  return lines.join('\n');
}

console.log('Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  engine.block.setDuration(page, CLIP_DURATION);
  engine.block.appendChild(scene, page);

  const audioBlock = engine.block.create('audio');
  engine.block.appendChild(page, audioBlock);
  engine.block.setString(audioBlock, 'audio/fileURI', AUDIO_URI);

  // Both paths wait for the resource, but loading it up front avoids a first
  // request that returns before the audio is ready.
  await engine.block.forceLoadAVResource(audioBlock);
  engine.block.setDuration(audioBlock, CLIP_DURATION);

  console.log('Generating waveform...');

  const collectWaveform = (
    block: DesignBlockId,
    samplesPerChunk: number,
    timeBegin: number,
    timeEnd: number,
    numberOfSamples: number,
    numberOfChannels: number
  ): Promise<Float32Array> => {
    const chunkCount = Math.ceil(numberOfSamples / samplesPerChunk);
    const envelope = new Float32Array(numberOfSamples * numberOfChannels);
    const arrived = new Set<number>();

    return new Promise((resolve, reject) => {
      engine.block.generateAudioThumbnailSequence(
        block,
        samplesPerChunk,
        timeBegin,
        timeEnd,
        numberOfSamples,
        numberOfChannels,
        (chunkIndex, result) => {
          // An error ends the sequence; no further chunks follow.
          if (result instanceof Error) {
            reject(result);
            return;
          }
          // The samples are a view into engine memory. Copy them out
          // synchronously, and key the offset off the reported index rather
          // than the arrival order.
          envelope.set(result, chunkIndex * samplesPerChunk * numberOfChannels);
          arrived.add(chunkIndex);
          // There is no completion callback, so count the chunks instead.
          if (arrived.size === chunkCount) resolve(envelope);
        }
      );
    });
  };

  const monoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    1
  );

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  writeFileSync(
    `${OUTPUT_DIR}/waveform.txt`,
    `${renderWaveform(monoEnvelope, 96, 15)}\n`
  );
  console.log(`Wrote ${OUTPUT_DIR}/waveform.txt`);

  const peak = monoEnvelope.reduce((max, value) => Math.max(max, value), 0);
  const mean =
    monoEnvelope.reduce((sum, value) => sum + value, 0) / monoEnvelope.length;
  console.log(
    `Mono envelope: ${monoEnvelope.length} values, peak ${peak.toFixed(3)}, mean ${mean.toFixed(3)}`
  );

  // numberOfSamples counts samples per channel, so a stereo request returns
  // twice as many floats, interleaved left-then-right.
  const stereoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    2
  );

  let leftPeak = 0;
  let rightPeak = 0;
  for (let i = 0; i < stereoEnvelope.length; i += 2) {
    leftPeak = Math.max(leftPeak, stereoEnvelope[i]);
    rightPeak = Math.max(rightPeak, stereoEnvelope[i + 1]);
  }

  console.log(
    `Stereo peaks: left ${leftPeak.toFixed(3)}, right ${rightPeak.toFixed(3)}`
  );

  let deliveredChunks = 0;

  const cancel = engine.block.generateAudioThumbnailSequence(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    4096,
    1,
    (_chunkIndex, result) => {
      if (!(result instanceof Error)) deliveredChunks += 1;
    }
  );

  // Cancelling takes effect on the next engine tick and delivers nothing of its
  // own: no final chunk, no error. Calling it again is a safe no-op.
  cancel();
  cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Chunks delivered by the cancelled request: ${deliveredChunks}`);
} finally {
  engine.dispose();
}
```

This guide covers requesting a waveform, accumulating chunks into one array, reading interleaved stereo data, and cancelling a request that is still running.

> **Note:** `generateVideoThumbnailSequence()` is not available on `@cesdk/node`. It builds
> each frame as an `ImageData`, a global that Node does not provide, so calling
> it throws a `ReferenceError`. Use the browser version of this guide for the
> video filmstrip and page storyboard workflows.

For a static preview image produced through the export pipeline, see [Create Thumbnail](./export-save-publish/create-thumbnail.md).

## Initialize the Engine

Start the headless engine. `@cesdk/node` runs its own update loop, so the callbacks below fire on their own once the engine has work to do. There is nothing to pump manually.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Request a Waveform

The method accepts an audio block or a video fill. Passing anything else, such as a page or a graphic, delivers a single `Error` to the callback right away, before the call returns.

Two parameters control the detail. `numberOfSamples` is how many values you want **per channel**, and `samplesPerChunk` is how many of them arrive in each callback. You receive `numberOfSamples / samplesPerChunk` chunks, rounded up, and the last one can be shorter than the rest.

```typescript highlight=highlight-tpnode-waveform
  const collectWaveform = (
    block: DesignBlockId,
    samplesPerChunk: number,
    timeBegin: number,
    timeEnd: number,
    numberOfSamples: number,
    numberOfChannels: number
  ): Promise<Float32Array> => {
    const chunkCount = Math.ceil(numberOfSamples / samplesPerChunk);
    const envelope = new Float32Array(numberOfSamples * numberOfChannels);
    const arrived = new Set<number>();

    return new Promise((resolve, reject) => {
      engine.block.generateAudioThumbnailSequence(
        block,
        samplesPerChunk,
        timeBegin,
        timeEnd,
        numberOfSamples,
        numberOfChannels,
        (chunkIndex, result) => {
          // An error ends the sequence; no further chunks follow.
          if (result instanceof Error) {
            reject(result);
            return;
          }
          // The samples are a view into engine memory. Copy them out
          // synchronously, and key the offset off the reported index rather
          // than the arrival order.
          envelope.set(result, chunkIndex * samplesPerChunk * numberOfChannels);
          arrived.add(chunkIndex);
          // There is no completion callback, so count the chunks instead.
          if (arrived.size === chunkCount) resolve(envelope);
        }
      );
    });
  };

  const monoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    1
  );
```

Three details drive the shape of that helper:

- **There is no completion callback.** Count the chunks that arrive and compare against the expected count. Do not test the chunk index against the last index: on an error the reported index is always `0`, so that test stalls forever, or mistakes the error for completion when there is only one chunk.
- **Chunks are not guaranteed to arrive in order.** Write each chunk at `chunkIndex * samplesPerChunk * numberOfChannels` rather than appending in arrival order.
- **The `Float32Array` is a view into the engine's memory, not a copy.** Read it synchronously inside the callback. Copying with `set()` into a preallocated array does that; holding on to the reference and reading it later does not.

An error ends the whole sequence: no further chunks arrive after one. That is why the helper rejects instead of waiting for the chunks that will never come.

### What the numbers mean

The engine analyzes the audio for you. Every value is a loudness between `0` and `1`, never negative, and already smoothed — so these are numbers you can draw or store straight away, not raw audio data.

Two things follow. Drawing a waveform means mirroring each value around a center line, with no peak-finding or rescaling left to do. And very quiet audio reads as exactly `0`.

Requesting a range that runs past the end of the media is not an error. Those chunks arrive zero-filled.

## Read a Stereo Waveform

`numberOfChannels` must be `1` or `2`. A stereo request keeps `numberOfSamples` as the per-channel count and returns twice as many floats, interleaved starting with the left channel, so each chunk carries `samplesPerChunk * numberOfChannels` values. Step through the result two entries at a time.

```typescript highlight=highlight-tpnode-stereo
  // numberOfSamples counts samples per channel, so a stereo request returns
  // twice as many floats, interleaved left-then-right.
  const stereoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    2
  );

  let leftPeak = 0;
  let rightPeak = 0;
  for (let i = 0; i < stereoEnvelope.length; i += 2) {
    leftPeak = Math.max(leftPeak, stereoEnvelope[i]);
    rightPeak = Math.max(rightPeak, stereoEnvelope[i + 1]);
  }
```

## Cancel Generation

`generateAudioThumbnailSequence()` returns a function that cancels the request. Call it when the result is no longer needed.

```typescript highlight=highlight-tpnode-cancel
  const cancel = engine.block.generateAudioThumbnailSequence(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    4096,
    1,
    (_chunkIndex, result) => {
      if (!(result instanceof Error)) deliveredChunks += 1;
    }
  );

  // Cancelling takes effect on the next engine tick and delivers nothing of its
  // own: no final chunk, no error. Calling it again is a safe no-op.
  cancel();
  cancel();
```

A cancel takes effect a moment later, so one or two chunks can still arrive. Nothing arrives to tell you the cancel happened: there is no final chunk and no error, so a promise that waits for a cancelled request never resolves. Cancelling twice, cancelling after the request finished, or cancelling a request that already failed are all safe.

Cancel before you request a second waveform for the same block. A block handles one request at a time, and a second request waits instead of failing.

## Performance and Limits

- Requests run one after another, so several waveforms started at once complete in turn rather than in parallel.
- A WAV file, or a `buffer://` URI, produces its waveform almost immediately. A multi-minute MP3 or AAC track takes noticeably longer.
- Calling `forceLoadAVResource()` first is optional. Both methods wait for the media on their own, but loading it up front downloads the audio before you ask for a waveform, so the first request does not spend that time waiting.
- Callbacks run inside the engine's update loop. Mutating the scene from inside a callback re-enters the engine, so defer that work until after the sequence completes.
- `samplesPerChunk`, `numberOfSamples`, and `numberOfChannels` are validated as integers and throw if they are not. `samplesPerChunk` must also be greater than zero, and `numberOfChannels` must be `1` or `2`.

## Troubleshooting

| Symptom | Cause |
| ------- | ----- |
| The sequence never completes | You are testing `chunkIndex` against the last index. The index is `0` on error, so count arrivals instead. |
| The waveform is flat | The time range is past the end of the audio, or the audio is very quiet. |
| The samples change after the callback returns | The `Float32Array` is a view into engine memory. Copy it inside the callback. |
| A second request appears to hang | An earlier request for the same block is still running. Cancel it first. |
| The callback fires once with an `Error` before the call returns | The block is neither an audio block nor a video fill, or a parameter failed validation. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.generateAudioThumbnailSequence(id, samplesPerChunk, timeBegin, timeEnd, numberOfSamples, numberOfChannels, onChunk)` | Stream a waveform for an audio block or video fill; returns a function that cancels the request |
| `engine.block.forceLoadAVResource(id)` | Load the audio or video resource of a block before requesting a waveform |
| `engine.dispose()` | Clean up engine resources when done |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support