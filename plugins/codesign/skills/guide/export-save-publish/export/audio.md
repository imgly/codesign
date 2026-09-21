> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [For Audio Processing](./export-save-publish/export/audio.md)

---

Export audio from pages, video blocks, audio blocks, and tracks to WAV or MP4 format for external processing, transcription, or analysis in server-side Node.js applications.

The `exportAudio` API allows you to extract audio from any block that contains audio content. This is particularly useful when building server-side workflows that integrate with external audio processing services like speech-to-text transcription, audio enhancement, or music analysis platforms.

Audio can be exported from multiple block types:

- **Page blocks** - Export the complete mixed audio composition
- **Video blocks** - Extract audio tracks from videos
- **Audio blocks** - Export standalone audio content
- **Track blocks** - Export audio from specific tracks

## Export Audio

Export audio from any block using the `exportAudio` API:

```javascript
const page = engine.scene.getCurrentPage();

const audioBuffer = await engine.block.exportAudio(page, {
  mimeType: 'audio/wav',
  sampleRate: 48000,
  numberOfChannels: 2
});

console.log(`Exported ${audioBuffer.byteLength} bytes`);
```

### Export Options

Configure your audio export with these options:

- **`mimeType`** - `'audio/wav'` (uncompressed) or `'audio/mp4'` (compressed AAC)
- **`sampleRate`** - Audio quality in Hz (default: 48000)
- **`numberOfChannels`** - 1 for mono or 2 for stereo
- **`timeOffset`** - Start time in seconds (default: 0)
- **`duration`** - Length to export in seconds (0 = entire duration)
- **`onProgress`** - Callback receiving `(rendered, encoded, total)` for progress tracking

## Find Audio Sources

To find blocks with audio in your scene:

```javascript
// Find audio blocks
const audioBlocks = engine.block.findByType('audio');

// Find video blocks with audio
const videoFills = engine.block.findByType('//ly.img.ubq/fill/video');
const videosWithAudio = videoFills.filter(block => {
  try {
    return engine.block.getAudioInfoFromVideo(block).length > 0;
  } catch {
    return false;
  }
});
```

## Working with Multi-Track Video Audio

Videos can contain multiple audio tracks (e.g., different languages). CE.SDK provides APIs to inspect and extract specific tracks.

### Check audio track count

```javascript
const videoFillId = engine.block.findByType('//ly.img.ubq/fill/video')[0];

const trackCount = engine.block.getAudioTrackCountFromVideo(videoFillId);
console.log(`Video has ${trackCount} audio track(s)`);
```

### Get track information

```javascript
const audioTracks = engine.block.getAudioInfoFromVideo(videoFillId);

audioTracks.forEach((track, index) => {
  console.log(`Track ${index}:`, {
    channels: track.channels,
    sampleRate: track.sampleRate,
    language: track.language || 'unknown',
    label: track.label || `Track ${index}`
  });
});
```

### Extract a specific track

```javascript
// Create audio block from track 0 (first track)
const audioBlockId = engine.block.createAudioFromVideo(videoFillId, 0);

// Export just this track's audio
const trackAudioBuffer = await engine.block.exportAudio(audioBlockId, {
  mimeType: 'audio/wav'
});
```

### Extract all tracks

```javascript
// Create audio blocks for all tracks
const audioBlockIds = engine.block.createAudiosFromVideo(videoFillId);

// Export each track
for (let i = 0; i < audioBlockIds.length; i++) {
  const trackBuffer = await engine.block.exportAudio(audioBlockIds[i]);
  console.log(`Track ${i}: ${trackBuffer.byteLength} bytes`);
}
```

## Complete Workflow: Audio to Captions

A common workflow is to export audio, send it to a transcription service, and use the returned captions in your scene.

### Step 1: Export Audio

```javascript
const page = engine.scene.getCurrentPage();

const audioBuffer = await engine.block.exportAudio(page, {
  mimeType: 'audio/wav',
  sampleRate: 48000,
  numberOfChannels: 2
});
```

### Step 2: Send to Transcription Service

Send the audio to a service that returns SubRip (SRT) format captions:

```javascript
import FormData from 'form-data';
import fetch from 'node-fetch';

async function transcribeAudio(audioBuffer) {
  const formData = new FormData();
  formData.append('audio', Buffer.from(audioBuffer), {
    filename: 'audio.wav',
    contentType: 'audio/wav'
  });
  formData.append('format', 'srt');

  const response = await fetch('https://api.transcription-service.com/transcribe', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      ...formData.getHeaders()
    },
    body: formData
  });

  // Returns SRT format text
  return await response.text();
}

const srtContent = await transcribeAudio(audioBuffer);
```

### Step 3: Import Captions from SRT

Use the built-in API to create caption blocks from the SRT response:

```javascript
import fs from 'fs/promises';
import path from 'path';

// Save SRT to temporary file
const tempPath = path.join(process.cwd(), 'temp-captions.srt');
await fs.writeFile(tempPath, srtContent);

// Import captions from file URI
const uri = `file://${tempPath}`;
const captions = await engine.block.createCaptionsFromURI(uri);

// Clean up temporary file
await fs.unlink(tempPath);

// Add captions to page
const page = engine.scene.getCurrentPage();
const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');

captions.forEach(caption => {
  engine.block.appendChild(captionTrack, caption);
});

engine.block.appendChild(page, captionTrack);

// Center the first caption as a reference point
engine.block.alignHorizontally([captions[0]], 'Center');
engine.block.alignVertically([captions[0]], 'Center');
```

### Other Processing Services

Audio export also supports these workflows:

- **Audio enhancement** - Noise removal, normalization
- **Music analysis** - Tempo, key, beat detection
- **Language detection** - Identify spoken language
- **Speaker diarization** - Identify who spoke when

## Save to file

Save exported audio to the file system:

```javascript
import fs from 'fs/promises';

async function saveAudio(audioBuffer, fileName = 'exported_audio.wav') {
  await fs.writeFile(fileName, Buffer.from(audioBuffer));
  console.log(`Audio saved to: ${fileName}`);
}
```

## Next Steps

Now that you understand audio export, explore related audio and video features:

- [Add Captions](./edit-video/add-captions.md) - Learn how to create and sync caption blocks with audio content
- [Control Audio and Video](./create-video/control.md) - Master time offset, duration, and playback controls for audio blocks
- [Trim Video Clips](./edit-video/trim.md) - Apply the same trim concepts to isolate audio segments



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support