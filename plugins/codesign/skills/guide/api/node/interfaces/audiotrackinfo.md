> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Information about a single audio track from a video.
This interface provides comprehensive metadata about audio tracks,
including codec information, technical specifications, and track details.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `audioCodec` | `string` | The codec string |
|  `channels` | `number` | The number of audio channels |
|  `sampleRate` | `number` | The audio sample rate |
|  `audioDuration` | `number` | Duration of the audio track in seconds |
|  `numAudioPackets` | `number` | The number of audio packets (matches the number of encoded chunks) |
|  `numAudioFrames` | `number` | The number of audio frames |
|  `trackName` | `string` | Optional track name/label if available in metadata |
|  `trackIndex` | `number` | Track index in the container |
|  `language` | `string` | Track language code (ISO 639-2T format: "und", "eng", "deu", etc.) |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support