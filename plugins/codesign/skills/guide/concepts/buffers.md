> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Buffers](./concepts/buffers.md)

---

Store and manage temporary binary data directly in memory using CE.SDK's buffer API for dynamically generated content.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-buffers-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-buffers-server-js)

Buffers are in-memory containers for binary data referenced via `buffer://` URIs. Unlike external files that require network or file I/O, buffers exist only during the current session and are not serialized when saving scenes. This makes them ideal for procedural audio, real-time image data, or streaming content that doesn't need to persist beyond the current processing session.

```typescript file=@cesdk_web_examples/guides-concepts-buffers-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables from .env file
config();

// Helper function to create a WAV file from audio samples
function createWavFile(
  samples: Float32Array,
  sampleRate: number,
  numChannels: number
): Uint8Array {
  const bytesPerSample = 2; // 16-bit audio
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const fileSize = 44 + dataSize; // WAV header is 44 bytes

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true); // File size minus RIFF header
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write audio samples as 16-bit PCM
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Convert float (-1 to 1) to 16-bit integer
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // Create a buffer and get its URI
    const bufferUri = engine.editor.createBuffer();
    console.log('Buffer URI:', bufferUri);

    // Generate sine wave audio samples
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const frequency = 440; // A4 note
    const numChannels = 2; // Stereo

    // Create Float32Array for audio samples (interleaved stereo)
    const numSamples = sampleRate * duration * numChannels;
    const samples = new Float32Array(numSamples);

    // Generate a 440 Hz sine wave
    for (let i = 0; i < numSamples; i += numChannels) {
      const sampleIndex = i / numChannels;
      const time = sampleIndex / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * time) * 0.5; // 50% amplitude

      // Write to both left and right channels
      samples[i] = value; // Left channel
      samples[i + 1] = value; // Right channel
    }

    // Convert samples to WAV format and write to buffer
    const wavData = createWavFile(samples, sampleRate, numChannels);
    engine.editor.setBufferData(bufferUri, 0, wavData);

    // Verify the buffer length
    const bufferLength = engine.editor.getBufferLength(bufferUri);
    console.log('Buffer length:', bufferLength, 'bytes');

    // Create an audio block
    const audioBlock = engine.block.create('audio');

    // Assign the buffer URI to the audio block
    engine.block.setString(audioBlock, 'audio/fileURI', bufferUri);

    // Set audio duration to match the generated samples
    engine.block.setDuration(audioBlock, duration);

    // Append the audio block to the page
    engine.block.appendChild(page, audioBlock);

    // Demonstrate reading buffer data back
    const readData = engine.editor.getBufferData(bufferUri, 0, 100);
    console.log('First 100 bytes of buffer data:', readData);

    // Demonstrate resizing a buffer with a separate demo buffer
    const demoBuffer = engine.editor.createBuffer();
    engine.editor.setBufferData(
      demoBuffer,
      0,
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    );

    const demoLength = engine.editor.getBufferLength(demoBuffer);
    console.log('Demo buffer length before resize:', demoLength);

    engine.editor.setBufferLength(demoBuffer, demoLength / 2);
    console.log(
      'Demo buffer length after resize:',
      engine.editor.getBufferLength(demoBuffer)
    );

    engine.editor.destroyBuffer(demoBuffer);

    // Find all transient resources (including our buffer)
    const transientResources = engine.editor.findAllTransientResources();
    console.log('Transient resources in scene:');
    for (const resource of transientResources) {
      console.log(`  URL: ${resource.URL}, Size: ${resource.size} bytes`);
    }

    // Demonstrate persisting buffer data to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const bufferData = engine.editor.getBufferData(bufferUri, 0, bufferLength);
    const outputPath = `${outputDir}/generated-audio.wav`;
    writeFileSync(outputPath, Buffer.from(bufferData));
    console.log('Buffer data saved to:', outputPath);

    // Update all references from buffer:// to the file path
    // In production, use a CDN URL instead of a local file path
    const absolutePath = `file://${process.cwd()}/${outputPath}`;
    engine.editor.relocateResource(bufferUri, absolutePath);
    console.log('Buffer relocated to:', absolutePath);

    console.log('Buffers example completed successfully');
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to create and manage buffers, write and read binary data, assign buffers to block properties like audio sources, and handle transient resources when saving scenes.

## Initializing the Engine

We start by initializing the headless Creative Engine for server-side processing. The engine is initialized with an optional license key loaded from environment variables.

```typescript highlight-setup
// Initialize the headless Creative Engine
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});
```

## Setting Up the Scene

We first create a scene and set up a page for our audio composition.

```typescript highlight-create-scene
// Create a scene with a page
const scene = engine.scene.create();
const page = engine.block.create('page');
engine.block.setWidth(page, 1920);
engine.block.setHeight(page, 1080);
engine.block.appendChild(scene, page);
```

## Creating and Managing Buffers

We use `engine.editor.createBuffer()` to allocate a new buffer and receive its URI. This URI follows the `buffer://` scheme and uniquely identifies the buffer within the engine instance.

```typescript highlight-create-buffer
// Create a buffer and get its URI
const bufferUri = engine.editor.createBuffer();
console.log('Buffer URI:', bufferUri);
```

Buffers persist in memory until you explicitly destroy them with `engine.editor.destroyBuffer()` or the engine instance is disposed. For large buffers or long processing sessions, you should destroy buffers when they're no longer needed to free memory.

## Writing Data to Buffers

To populate a buffer with binary data, we use `engine.editor.setBufferData()`. This method takes the buffer URI, an offset in bytes, and a `Uint8Array` containing the data to write.

In this example, we generate a 440 Hz sine wave as stereo PCM audio samples. We create a `Float32Array` for the sample values that will be converted to a valid audio format.

```typescript highlight-generate-samples
    // Generate sine wave audio samples
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const frequency = 440; // A4 note
    const numChannels = 2; // Stereo

    // Create Float32Array for audio samples (interleaved stereo)
    const numSamples = sampleRate * duration * numChannels;
    const samples = new Float32Array(numSamples);

    // Generate a 440 Hz sine wave
    for (let i = 0; i < numSamples; i += numChannels) {
      const sampleIndex = i / numChannels;
      const time = sampleIndex / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * time) * 0.5; // 50% amplitude

      // Write to both left and right channels
      samples[i] = value; // Left channel
      samples[i + 1] = value; // Right channel
    }
```

When using buffers for audio, the data must be in a recognized audio format like WAV. We convert the raw samples to a WAV file by adding the appropriate headers, then write the complete file to the buffer.

```typescript highlight-write-buffer
    // Convert samples to WAV format and write to buffer
    const wavData = createWavFile(samples, sampleRate, numChannels);
    engine.editor.setBufferData(bufferUri, 0, wavData);

    // Verify the buffer length
    const bufferLength = engine.editor.getBufferLength(bufferUri);
    console.log('Buffer length:', bufferLength, 'bytes');
```

## Reading Data from Buffers

To read data back from a buffer, we use `engine.editor.getBufferData()` with the buffer URI, a starting offset, and the number of bytes to read. We first query the buffer length with `engine.editor.getBufferLength()` to determine how much data is available.

```typescript highlight-read-buffer
// Demonstrate reading buffer data back
const readData = engine.editor.getBufferData(bufferUri, 0, 100);
console.log('First 100 bytes of buffer data:', readData);
```

This returns a `Uint8Array` that you can convert back to other typed arrays as needed. Partial reads are supported—you can read any range within the buffer bounds.

## Resizing Buffers

You can change a buffer's size at any time with `engine.editor.setBufferLength()`. Increasing the size allocates additional space, while decreasing it truncates the data. Here we demonstrate resizing with a separate demo buffer to avoid truncating our audio data.

```typescript highlight-resize-buffer
    // Demonstrate resizing a buffer with a separate demo buffer
    const demoBuffer = engine.editor.createBuffer();
    engine.editor.setBufferData(
      demoBuffer,
      0,
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    );

    const demoLength = engine.editor.getBufferLength(demoBuffer);
    console.log('Demo buffer length before resize:', demoLength);

    engine.editor.setBufferLength(demoBuffer, demoLength / 2);
    console.log(
      'Demo buffer length after resize:',
      engine.editor.getBufferLength(demoBuffer)
    );

    engine.editor.destroyBuffer(demoBuffer);
```

Keep in mind that truncating a buffer permanently discards data beyond the new length. Always query the current length first if you need to preserve the original size, or create a copy before resizing.

## Assigning Buffers to Blocks

Buffer URIs work like any other resource URI in CE.SDK. We assign them to block properties using `engine.block.setString()`. For audio blocks, we set the `audio/fileURI` property.

```typescript highlight-create-audio-block
    // Create an audio block
    const audioBlock = engine.block.create('audio');

    // Assign the buffer URI to the audio block
    engine.block.setString(audioBlock, 'audio/fileURI', bufferUri);

    // Set audio duration to match the generated samples
    engine.block.setDuration(audioBlock, duration);

    // Append the audio block to the page
    engine.block.appendChild(page, audioBlock);
```

The same approach works for other resource properties:

- **Audio blocks**: `audio/fileURI`
- **Image fills**: `fill/image/imageFileURI`
- **Video fills**: `fill/video/fileURI`

Any property that accepts a URI can reference a buffer.

## Transient Resources and Scene Serialization

Buffers are transient resources—the URI gets serialized when you save a scene, but the actual binary data does not persist. This means a saved scene will contain references to `buffer://` URIs that won't resolve when the scene is loaded again.

We use `engine.editor.findAllTransientResources()` to discover all transient resources in the current scene, including buffers. Each resource includes its URL and size in bytes.

```typescript highlight-find-transient
// Find all transient resources (including our buffer)
const transientResources = engine.editor.findAllTransientResources();
console.log('Transient resources in scene:');
for (const resource of transientResources) {
  console.log(`  URL: ${resource.URL}, Size: ${resource.size} bytes`);
}
```

> **Note:** **Limitations**Buffers are intended for temporary data only.* Buffer data is not part of scene serialization
> * Changes to buffers can't be undone using the history system

Note that `engine.scene.saveToString()` does NOT include `buffer://` in its default allowed resource schemes, while `engine.block.saveToString()` does include it. You may need to configure the allowed schemes depending on your serialization needs.

## Persisting Buffer Data

To permanently save buffer content, you must extract the data, save it to persistent storage, then update the block references to point to the new URL. This example demonstrates the pattern by saving to a local file and using `relocateResource()` to update references—in production, you would upload to a CDN or cloud storage and use the CDN URL instead.

```typescript highlight-persist-buffer
    // Demonstrate persisting buffer data to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const bufferData = engine.editor.getBufferData(bufferUri, 0, bufferLength);
    const outputPath = `${outputDir}/generated-audio.wav`;
    writeFileSync(outputPath, Buffer.from(bufferData));
    console.log('Buffer data saved to:', outputPath);

    // Update all references from buffer:// to the file path
    // In production, use a CDN URL instead of a local file path
    const absolutePath = `file://${process.cwd()}/${outputPath}`;
    engine.editor.relocateResource(bufferUri, absolutePath);
    console.log('Buffer relocated to:', absolutePath);
```

We read the buffer data, write it to a local file, then use `engine.editor.relocateResource()` to update all references to the old buffer URI throughout the scene. After relocation, you can save the scene and the new persistent URLs will be serialized.

## Troubleshooting

**Buffer data not appearing in exported scene**

Buffers are transient and don't persist with scene saves. Use `findAllTransientResources()` to identify buffers, then relocate them to persistent storage before exporting.

**Memory usage growing unexpectedly**

Call `engine.editor.destroyBuffer()` when buffers are no longer needed. Unlike external resources that can be garbage collected, buffers remain in memory until explicitly destroyed.

**Data corruption when writing**

Ensure the offset plus data length doesn't exceed the intended buffer bounds. Resize the buffer first with `setBufferLength()` if you need more space.

**Buffer URI not recognized by block**

Verify the buffer was created in the same engine instance. Buffer URIs are not portable between different engine instances or sessions.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support