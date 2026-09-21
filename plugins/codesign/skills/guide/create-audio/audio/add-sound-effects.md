> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Generate sound effects programmatically using buffers with arbitrary audio data. Create notification chimes, alert tones, and melodies without external files in headless server environments.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-add-sound-effects-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-add-sound-effects-server-js)

<NodejsVideoExportNotice {...props} />

CE.SDK's headless engine lets you create audio from code using buffers. This approach generates sound effects dynamically without external files—useful for notification tones, procedural audio, or any scenario where you need to synthesize audio programmatically on the server.

```typescript file=@cesdk_web_examples/guides-create-audio-add-sound-effects-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config();

/**
 * Creates a WAV file buffer from audio parameters and a sample generator function.
 *
 * @param sampleRate - Sample rate in Hz (e.g., 48000)
 * @param durationSeconds - Duration of the audio in seconds
 * @param generator - Function that generates sample values (-1.0 to 1.0) for each time point
 * @returns Uint8Array containing a stereo WAV file
 */
function createWavBuffer(
  sampleRate: number,
  durationSeconds: number,
  generator: (time: number) => number
): Uint8Array {
  const bitsPerSample = 16;
  const channels = 2; // Stereo output
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const dataSize = numSamples * channels * (bitsPerSample / 8);

  // Create WAV file buffer (44-byte header + audio data)
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataSize, true); // File size - 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, channels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  view.setUint16(32, channels * (bitsPerSample / 8), true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample

  // data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true); // Data size

  // Generate audio samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    // Generate mono sample and duplicate to both channels
    const value = generator(time);
    const sample = Math.max(-32768, Math.min(32767, Math.round(value * 32767)));
    view.setInt16(offset, sample, true); // Left channel
    view.setInt16(offset + 2, sample, true); // Right channel
    offset += 4;
  }

  return new Uint8Array(wavBuffer);
}

/**
 * Calculates an ADSR (Attack-Decay-Sustain-Release) envelope value for a note.
 * The envelope shapes the volume over time, creating natural-sounding tones.
 *
 * @param time - Current time in seconds
 * @param noteStart - When the note starts (seconds)
 * @param noteDuration - Total note duration including release (seconds)
 * @param attack - Time to reach peak volume (seconds)
 * @param decay - Time to fall from peak to sustain level (seconds)
 * @param sustain - Held volume level (0.0 to 1.0)
 * @param release - Time to fade to silence (seconds)
 * @returns Envelope amplitude (0.0 to 1.0)
 */
function adsr(
  time: number,
  noteStart: number,
  noteDuration: number,
  attack: number,
  decay: number,
  sustain: number,
  release: number
): number {
  const t = time - noteStart;
  if (t < 0) return 0;

  const noteEnd = noteDuration - release;

  if (t < attack) {
    // Attack phase: ramp up from 0 to 1
    return t / attack;
  } else if (t < attack + decay) {
    // Decay phase: ramp down from 1 to sustain level
    return 1 - ((t - attack) / decay) * (1 - sustain);
  } else if (t < noteEnd) {
    // Sustain phase: hold at sustain level
    return sustain;
  } else if (t < noteDuration) {
    // Release phase: ramp down from sustain to 0
    return sustain * (1 - (t - noteEnd) / release);
  }
  return 0;
}

// Musical note frequencies (Hz) for the 4th and 5th octaves
const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5
};

// Sound effect 1: Ascending "success" fanfare (2 seconds)
// Creates a triumphant feeling with overlapping notes building to a chord
const SUCCESS_CHIME = {
  notes: [
    // Quick ascending arpeggio
    { freq: NOTE_FREQUENCIES.C4, start: 0.0, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.E4, start: 0.1, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G4, start: 0.2, duration: 0.5 },
    // Sustained major chord
    { freq: NOTE_FREQUENCIES.C5, start: 0.35, duration: 1.65 },
    { freq: NOTE_FREQUENCIES.E5, start: 0.4, duration: 1.6 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.45, duration: 1.55 }
  ],
  totalDuration: 2.0
};

// Sound effect 2: Gentle notification melody (2 seconds)
// A musical phrase that resolves pleasantly
const NOTIFICATION_MELODY = {
  notes: [
    { freq: NOTE_FREQUENCIES.E5, start: 0.0, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.25, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.6, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.85, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.E5, start: 1.15, duration: 0.85 }
  ],
  totalDuration: 2.0
};

// Sound effect 3: Alert/warning tone (2 seconds)
// Descending pattern that grabs attention
const ALERT_TONE = {
  notes: [
    // Attention-grabbing high notes
    { freq: NOTE_FREQUENCIES.A5, start: 0.0, duration: 0.25 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.3, duration: 0.25 },
    // Descending resolution
    { freq: NOTE_FREQUENCIES.F5, start: 0.6, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.D5, start: 0.9, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A4, start: 1.3, duration: 0.7 }
  ],
  totalDuration: 2.0
};

/**
 * CE.SDK Server Guide: Add Sound Effects
 *
 * This example demonstrates:
 * - Creating audio buffers with arbitrary data
 * - Generating sound effects programmatically (chimes, melodies, alerts)
 * - Using WAV format for in-memory audio
 * - Positioning sound effects on the timeline
 * - Exporting the scene for rendering
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

  // Calculate total duration: 3 effects x 2s + 2 gaps x 0.5s = 7s
  const effectDuration = 2.0;
  const gapDuration = 0.5;
  const totalDuration = 3 * effectDuration + 2 * gapDuration; // 7 seconds

  // Set page duration to match total effects length
  engine.block.setDuration(page, totalDuration);

  const sampleRate = 48000;

  // Create the "success chime" sound effect
  const chimeBuffer = engine.editor.createBuffer();

  // Generate the chime using our helper function
  const chimeWav = createWavBuffer(
    sampleRate,
    SUCCESS_CHIME.totalDuration,
    (time) => {
      let sample = 0;

      // Mix all notes together
      for (const note of SUCCESS_CHIME.notes) {
        // Calculate envelope for this note
        const envelope = adsr(
          time,
          note.start,
          note.duration,
          0.02, // Soft attack (20ms)
          0.08, // Gentle decay (80ms)
          0.7, // Sustain at 70%
          0.25 // Smooth release (250ms)
        );

        if (envelope > 0) {
          // Generate sine wave with slight harmonics for richness
          const fundamental = Math.sin(2 * Math.PI * note.freq * time);
          const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.25;
          const harmonic3 = Math.sin(6 * Math.PI * note.freq * time) * 0.1;

          sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.3;
        }
      }

      return sample;
    }
  );

  // Write WAV data to the buffer
  engine.editor.setBufferData(chimeBuffer, 0, chimeWav);

  // Create audio block for the chime (starts at 0s)
  const chimeBlock = engine.block.create('audio');
  engine.block.appendChild(page, chimeBlock);
  engine.block.setString(chimeBlock, 'audio/fileURI', chimeBuffer);
  engine.block.setTimeOffset(chimeBlock, 0);
  engine.block.setDuration(chimeBlock, SUCCESS_CHIME.totalDuration);
  engine.block.setVolume(chimeBlock, 0.8);

  console.log('Created success chime at 0s');

  // Create the "notification melody" sound effect
  const melodyBuffer = engine.editor.createBuffer();

  const melodyWav = createWavBuffer(
    sampleRate,
    NOTIFICATION_MELODY.totalDuration,
    (time) => {
      let sample = 0;

      for (const note of NOTIFICATION_MELODY.notes) {
        const envelope = adsr(
          time,
          note.start,
          note.duration,
          0.01, // Soft attack (10ms)
          0.06, // Gentle decay (60ms)
          0.6, // Sustain at 60%
          0.2 // Smooth release (200ms)
        );

        if (envelope > 0) {
          // Pure sine wave with light 2nd harmonic for gentle tone
          const fundamental = Math.sin(2 * Math.PI * note.freq * time);
          const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.15;

          sample += (fundamental + harmonic2) * envelope * 0.4;
        }
      }

      return sample;
    }
  );

  engine.editor.setBufferData(melodyBuffer, 0, melodyWav);

  // Starts at 2.5s (after 2s effect + 0.5s gap)
  const melodyBlock = engine.block.create('audio');
  engine.block.appendChild(page, melodyBlock);
  engine.block.setString(melodyBlock, 'audio/fileURI', melodyBuffer);
  engine.block.setTimeOffset(melodyBlock, effectDuration + gapDuration); // 2.5s
  engine.block.setDuration(melodyBlock, NOTIFICATION_MELODY.totalDuration);
  engine.block.setVolume(melodyBlock, 0.8);

  console.log('Created notification melody at 2.5s');

  // Create the "alert" sound effect
  const alertBuffer = engine.editor.createBuffer();

  const alertWav = createWavBuffer(
    sampleRate,
    ALERT_TONE.totalDuration,
    (time) => {
      let sample = 0;

      for (const note of ALERT_TONE.notes) {
        const envelope = adsr(
          time,
          note.start,
          note.duration,
          0.005, // Sharp attack (5ms)
          0.05, // Quick decay (50ms)
          0.5, // Sustain at 50%
          0.15 // Medium release (150ms)
        );

        if (envelope > 0) {
          // Slightly brighter tone for alert
          const fundamental = Math.sin(2 * Math.PI * note.freq * time);
          const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.2;
          const harmonic3 = Math.sin(6 * Math.PI * note.freq * time) * 0.15;

          sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.35;
        }
      }

      return sample;
    }
  );

  engine.editor.setBufferData(alertBuffer, 0, alertWav);

  // Starts at 5s (after 2 effects + 2 gaps)
  const alertBlock = engine.block.create('audio');
  engine.block.appendChild(page, alertBlock);
  engine.block.setString(alertBlock, 'audio/fileURI', alertBuffer);
  engine.block.setTimeOffset(alertBlock, 2 * (effectDuration + gapDuration)); // 5s
  engine.block.setDuration(alertBlock, ALERT_TONE.totalDuration);
  engine.block.setVolume(alertBlock, 0.75);

  console.log('Created alert tone at 5s');

  // Export the scene as an archive containing all audio data
  // saveToArchive() packages the scene with all embedded resources (including buffers)

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene archive with all audio buffers embedded
  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/sound-effects.imgly', archiveBuffer);

  console.log('');
  console.log('Exported scene archive to output/sound-effects.imgly');
  console.log('Scene contains:');
  console.log('  - Scene structure with audio timeline');
  console.log('  - 3 embedded sound effect audio files');

  console.log('');
  console.log('Sound effects guide completed successfully.');
  console.log(
    `Timeline: Success (0s), Melody (2.5s), Alert (5s) - each 2s, total ${totalDuration}s`
  );
  console.log('');
  console.log('Audio blocks created with:');
  console.log('  - 3 programmatically generated sound effects');
  console.log('  - Each effect with unique tonal character');
  console.log('  - Scene exported with embedded audio for later use');
} finally {
  engine.dispose();
}
```

This guide covers working with buffers to create audio data and position it in the composition in a headless Node.js environment.

## Setting Up the Engine

Initialize CE.SDK's headless engine for server-side audio generation:

```typescript highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

The headless engine provides full API access for buffer creation and audio synthesis without browser dependencies.

## Working with Buffers

CE.SDK provides a buffer API for creating and managing arbitrary binary data in memory. Use buffers when you need to generate content programmatically rather than loading from files.

### Creating a Buffer

Create a buffer with `engine.editor.createBuffer()`, which returns a URI you can use to reference the buffer:

```typescript highlight-buffer-create
// Create the "success chime" sound effect
const chimeBuffer = engine.editor.createBuffer();
```

### Writing Data

Write data to a buffer using `engine.editor.setBufferData()`. The offset parameter specifies where to start writing:

```typescript highlight-buffer-write
// Write WAV data to the buffer
engine.editor.setBufferData(chimeBuffer, 0, chimeWav);
```

### Reading Data

Read data back from a buffer:

```typescript
const length = engine.editor.getBufferLength(buffer);
const data = engine.editor.getBufferData(buffer, 0, length);
```

### Adding an Audio Track

Create an audio block and assign the buffer URI to its `audio/fileURI` property. Append it to the page to add it to the composition:

```typescript highlight-audio-track
// Create audio block for the chime (starts at 0s)
const chimeBlock = engine.block.create('audio');
engine.block.appendChild(page, chimeBlock);
engine.block.setString(chimeBlock, 'audio/fileURI', chimeBuffer);
```

### Cleanup

Destroy buffers when no longer needed (buffers are also cleaned up automatically with the scene):

```typescript
engine.editor.destroyBuffer(buffer);
```

## Generating Audio Data

To use buffers for audio, you need valid audio data. The WAV format is straightforward to generate: a 44-byte header followed by raw PCM samples.

```typescript highlight-wav-body
  const bitsPerSample = 16;
  const channels = 2; // Stereo output
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const dataSize = numSamples * channels * (bitsPerSample / 8);

  // Create WAV file buffer (44-byte header + audio data)
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataSize, true); // File size - 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, channels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  view.setUint16(32, channels * (bitsPerSample / 8), true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample

  // data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true); // Data size

  // Generate audio samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    // Generate mono sample and duplicate to both channels
    const value = generator(time);
    const sample = Math.max(-32768, Math.min(32767, Math.round(value * 32767)));
    view.setInt16(offset, sample, true); // Left channel
    view.setInt16(offset + 2, sample, true); // Right channel
    offset += 4;
  }

  return new Uint8Array(wavBuffer);
```

This code builds a stereo WAV file by writing the RIFF header, format chunk, and data chunk, then iterating through time to generate samples from a generator function that returns values between -1.0 and 1.0.

## Creating Sound Effect Generators

### ADSR Envelope

Shape notes with ADSR envelopes (attack, decay, sustain, release) to avoid clicks and create natural-sounding tones:

```typescript highlight-envelope-helper
/**
 * Calculates an ADSR (Attack-Decay-Sustain-Release) envelope value for a note.
 * The envelope shapes the volume over time, creating natural-sounding tones.
 *
 * @param time - Current time in seconds
 * @param noteStart - When the note starts (seconds)
 * @param noteDuration - Total note duration including release (seconds)
 * @param attack - Time to reach peak volume (seconds)
 * @param decay - Time to fall from peak to sustain level (seconds)
 * @param sustain - Held volume level (0.0 to 1.0)
 * @param release - Time to fade to silence (seconds)
 * @returns Envelope amplitude (0.0 to 1.0)
 */
function adsr(
  time: number,
  noteStart: number,
  noteDuration: number,
  attack: number,
  decay: number,
  sustain: number,
  release: number
): number {
  const t = time - noteStart;
  if (t < 0) return 0;

  const noteEnd = noteDuration - release;

  if (t < attack) {
    // Attack phase: ramp up from 0 to 1
    return t / attack;
  } else if (t < attack + decay) {
    // Decay phase: ramp down from 1 to sustain level
    return 1 - ((t - attack) / decay) * (1 - sustain);
  } else if (t < noteEnd) {
    // Sustain phase: hold at sustain level
    return sustain;
  } else if (t < noteDuration) {
    // Release phase: ramp down from sustain to 0
    return sustain * (1 - (t - noteEnd) / release);
  }
  return 0;
}
```

The envelope function shapes volume over time—quickly ramping up during attack, gradually falling during decay, holding steady during sustain, and fading out during release.

### Sound Effect Definitions

Define sound effects as note sequences with frequencies, start times, and durations:

```typescript highlight-sound-definitions
// Musical note frequencies (Hz) for the 4th and 5th octaves
const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5
};

// Sound effect 1: Ascending "success" fanfare (2 seconds)
// Creates a triumphant feeling with overlapping notes building to a chord
const SUCCESS_CHIME = {
  notes: [
    // Quick ascending arpeggio
    { freq: NOTE_FREQUENCIES.C4, start: 0.0, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.E4, start: 0.1, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G4, start: 0.2, duration: 0.5 },
    // Sustained major chord
    { freq: NOTE_FREQUENCIES.C5, start: 0.35, duration: 1.65 },
    { freq: NOTE_FREQUENCIES.E5, start: 0.4, duration: 1.6 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.45, duration: 1.55 }
  ],
  totalDuration: 2.0
};

// Sound effect 2: Gentle notification melody (2 seconds)
// A musical phrase that resolves pleasantly
const NOTIFICATION_MELODY = {
  notes: [
    { freq: NOTE_FREQUENCIES.E5, start: 0.0, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.25, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.6, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.85, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.E5, start: 1.15, duration: 0.85 }
  ],
  totalDuration: 2.0
};

// Sound effect 3: Alert/warning tone (2 seconds)
// Descending pattern that grabs attention
const ALERT_TONE = {
  notes: [
    // Attention-grabbing high notes
    { freq: NOTE_FREQUENCIES.A5, start: 0.0, duration: 0.25 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.3, duration: 0.25 },
    // Descending resolution
    { freq: NOTE_FREQUENCIES.F5, start: 0.6, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.D5, start: 0.9, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A4, start: 1.3, duration: 0.7 }
  ],
  totalDuration: 2.0
};
```

Each sound effect specifies a series of notes with their musical frequencies, when they start, and how long they play. Overlapping notes create chords and harmonic textures.

## Creating a Sound Effect

Combine the buffer API with the WAV helper to create a complete sound effect. This example generates a notification melody by mixing multiple notes with harmonics:

```typescript highlight-generate-melody
  // Create the "notification melody" sound effect
  const melodyBuffer = engine.editor.createBuffer();

  const melodyWav = createWavBuffer(
    sampleRate,
    NOTIFICATION_MELODY.totalDuration,
    (time) => {
      let sample = 0;

      for (const note of NOTIFICATION_MELODY.notes) {
        const envelope = adsr(
          time,
          note.start,
          note.duration,
          0.01, // Soft attack (10ms)
          0.06, // Gentle decay (60ms)
          0.6, // Sustain at 60%
          0.2 // Smooth release (200ms)
        );

        if (envelope > 0) {
          // Pure sine wave with light 2nd harmonic for gentle tone
          const fundamental = Math.sin(2 * Math.PI * note.freq * time);
          const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.15;

          sample += (fundamental + harmonic2) * envelope * 0.4;
        }
      }

      return sample;
    }
  );

  engine.editor.setBufferData(melodyBuffer, 0, melodyWav);
```

The generator function mixes overlapping notes, each with its own start time and duration. Adding harmonics at lower amplitudes creates a warmer tone than a pure sine wave.

## Positioning in Time

Audio blocks exist in the composition and can be positioned precisely. Set when audio starts and how long it plays:

```typescript highlight-timeline-position
engine.block.setTimeOffset(chimeBlock, 0);
engine.block.setDuration(chimeBlock, SUCCESS_CHIME.totalDuration);
```

### Timeline Layout Example

The example spaces three sound effects with 0.5-second gaps:

```
Timeline: |----|----|----|----|----|----|----|
          0s   1s   2s   3s   4s   5s   6s   7s

Success:  |====|
          ^ 0s (2s)

Melody:         |====|
                ^ 2.5s (2s)

Alert:               |====|
                     ^ 5s (2s)
```

Each effect is 2 seconds with 0.5-second gaps between them, for a total duration of 7 seconds.

## Exporting the Scene

Export the scene as an archive containing all audio data. The `saveToArchive()` method packages the scene with all embedded resources, including buffer data:

```typescript highlight-export
  // Export the scene as an archive containing all audio data
  // saveToArchive() packages the scene with all embedded resources (including buffers)

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene archive with all audio buffers embedded
  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/sound-effects.imgly', archiveBuffer);

  console.log('');
  console.log('Exported scene archive to output/sound-effects.imgly');
  console.log('Scene contains:');
  console.log('  - Scene structure with audio timeline');
  console.log('  - 3 embedded sound effect audio files');
```

> **Note:** Buffer URIs are in-memory resources and cannot be serialized with `saveToString()`. Use `saveToArchive()` to export the complete scene with embedded audio buffers.

## Troubleshooting

### No Sound

- **Check WAV format** - Ensure the 44-byte header matches the data size and parameters
- **Verify duration** - Audio blocks need duration greater than 0
- **Check buffer data** - The buffer must contain valid WAV data

### Audio Sounds Wrong

- **Clipping** - Reduce sample values if they exceed -1.0 to 1.0
- **Clicking** - Add attack/release envelope to avoid pops
- **Wrong pitch** - Verify frequency calculations and sample rate (48 kHz)

### Buffer Errors

- **Invalid WAV** - Ensure header size fields match actual data size
- **Format mismatch** - Use 16-bit PCM, stereo, 48 kHz for best compatibility

## API Reference

| Method                            | Description                               | Parameters                            |
| --------------------------------- | ----------------------------------------- | ------------------------------------- |
| `engine.editor.createBuffer()`    | Create a new buffer resource              | None                                  |
| `engine.editor.setBufferData()`   | Write data to a buffer                    | `uri: string, offset: number, data: Uint8Array` |
| `engine.editor.getBufferLength()` | Get the length of buffer data             | `uri: string`                         |
| `engine.editor.getBufferData()`   | Read data from a buffer                   | `uri: string, offset: number, length: number` |
| `engine.editor.destroyBuffer()`   | Clean up buffer resources                 | `uri: string`                         |
| `engine.block.create('audio')`    | Create a new audio block                  | `type: 'audio'`                       |
| `engine.block.setString()`        | Set string properties (e.g., audio/fileURI) | `id: number, key: string, value: string` |
| `engine.block.setTimeOffset()`    | Set when the audio block starts           | `id: number, offset: number`          |
| `engine.block.setDuration()`      | Set the duration of the audio block       | `id: number, duration: number`        |
| `engine.block.setVolume()`        | Set the volume level (0.0 to 1.0)         | `id: number, volume: number`          |
| `engine.block.appendChild()`      | Add block to parent (page)                | `parent: number, child: number`       |
| `engine.scene.saveToArchive()`    | Export scene with embedded resources      | None (returns `Promise<Blob>`)        |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support