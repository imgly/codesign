> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Limitations](./create-video/limitations.md)

---

Server-side video processing with CE.SDK operates within hardware and
WebAssembly memory constraints. This guide covers resolution and duration
limits, codec support, memory management, and hardware considerations—helping
you build video workflows that run reliably on your servers.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-limitations-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-limitations-server-js)

<NodejsVideoExportNotice {...props} />

Server-side video processing with CE.SDK operates within the constraints of the server's hardware and WebAssembly runtime. Understanding these limitations helps you build applications that work reliably and make informed decisions about resource allocation.

```typescript file=@cesdk_web_examples/guides-create-video-limitations-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Video Limitations
 *
 * Demonstrates how to query video processing limitations in CE.SDK:
 * - Querying maximum export size
 * - Monitoring memory usage and availability
 * - Understanding resolution and duration constraints
 * - Validating export feasibility before processing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene to query environment capabilities
  engine.scene.create('DepthStack');

  // Query the maximum export dimensions supported by this environment
  const maxExportSize = engine.editor.getMaxExportSize();
  console.log('Maximum export size:', maxExportSize, 'pixels');
  // Server environments may have different limits than browser
  // Typical values: 4096, 8192, or 16384 pixels

  // Query current memory consumption (returns BigInt on Node.js)
  const usedMemory = engine.editor.getUsedMemory();
  const usedMemoryMB = (Number(usedMemory) / (1024 * 1024)).toFixed(2);
  console.log('Memory used:', usedMemoryMB, 'MB');

  // Query available memory for video processing (returns BigInt on Node.js)
  const availableMemory = engine.editor.getAvailableMemory();
  const availableMemoryMB = (Number(availableMemory) / (1024 * 1024)).toFixed(
    2
  );
  console.log('Memory available:', availableMemoryMB, 'MB');
  // Server environments typically have more memory than browser tabs

  // Calculate memory utilization percentage
  const totalMemory = Number(usedMemory) + Number(availableMemory);
  const memoryUtilization = ((Number(usedMemory) / totalMemory) * 100).toFixed(
    1
  );
  console.log('Memory utilization:', memoryUtilization, '%');

  // Check if a specific export size is feasible
  const desiredWidth = 3840; // 4K UHD
  const desiredHeight = 2160;
  const canExport4K =
    desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
  console.log('Can export at 4K UHD (3840x2160):', canExport4K ? 'Yes' : 'No');

  // Before loading large resources, check available memory
  const minRequiredMemory = 500 * 1024 * 1024; // 500 MB minimum
  const hasEnoughMemory = Number(availableMemory) > minRequiredMemory;
  console.log(
    'Has enough memory for large video processing:',
    hasEnoughMemory ? 'Yes' : 'No'
  );

  // Log summary of environment capabilities
  console.log('--- Environment Capabilities Summary ---');
  console.log('Max export dimension:', maxExportSize, 'px');
  console.log('4K UHD support:', canExport4K ? 'Supported' : 'Not supported');
  console.log('Memory available:', availableMemoryMB, 'MB');
  console.log('Memory utilization:', memoryUtilization, '%');

  console.log('\nVideo limitations check completed successfully.');
} finally {
  engine.dispose();
}
```

This guide covers resolution and duration limits, codec support, memory constraints, and how to query these limitations programmatically in server-side video processing workflows.

## Resolution Limits

Video resolution capabilities depend on hardware resources and WebAssembly memory constraints. CE.SDK supports up to 4K UHD for processing and export on capable hardware.

Import resolution is bounded by WebAssembly's memory model. Server environments typically have more memory available than browser tabs, but resolution limits still apply. Higher resolutions require proportionally more memory and processing power.

Query the maximum export size before initiating exports to avoid failures:

```typescript highlight-query-max-export-size
// Query the maximum export dimensions supported by this environment
const maxExportSize = engine.editor.getMaxExportSize();
console.log('Maximum export size:', maxExportSize, 'pixels');
// Server environments may have different limits than browser
// Typical values: 4096, 8192, or 16384 pixels
```

The maximum export size varies by hardware capabilities. Before exporting at high resolutions, verify the target dimensions don't exceed this limit:

```typescript highlight-check-export-feasibility
// Check if a specific export size is feasible
const desiredWidth = 3840; // 4K UHD
const desiredHeight = 2160;
const canExport4K =
  desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
console.log('Can export at 4K UHD (3840x2160):', canExport4K ? 'Yes' : 'No');
```

## Duration Limits

Video duration affects processing time and memory consumption. CE.SDK optimizes for short-form content while supporting longer videos with performance trade-offs.

Stories and reels up to 2 minutes are fully supported with efficient processing. Videos up to 10 minutes work well on modern hardware. Longer videos are technically possible but may increase memory usage and processing time.

For long-form content, consider these approaches:

- Split longer videos into shorter segments for processing
- Use lower resolution for intermediate processing, then export at full quality
- Monitor memory usage to establish acceptable duration limits for your server configuration

## Frame Rate Support

Frame rate affects processing time and output quality. Server environments can handle high frame rates without the real-time playback concerns of browser implementations.

30 FPS at 1080p is broadly supported and provides efficient processing. 60 FPS and high-resolution combinations require more processing time but are well-supported in server environments.

Variable frame rate sources may have timing precision limitations. For best results with variable frame rate content, consider transcoding to constant frame rate before processing.

## Supported Codecs

CE.SDK supports widely-adopted video and audio codecs. Server-side codec support depends on the platform's installed codecs and libraries.

### Video Codecs

H.264/AVC in `.mp4` containers has universal support and is the most reliable codec choice for broad compatibility.

H.265/HEVC in `.mp4` containers has platform-dependent support. Availability varies by operating system and installed codec libraries.

### Audio Codecs

MP3 works in `.mp3` files or within `.mp4` containers, with universal support.

AAC in `.m4a`, `.mp4`, or `.mov` containers is widely supported, though some platforms may require additional codec libraries for encoding.

## Server-Side Video Export

For full video export capabilities in server environments, CE.SDK provides the CE.SDK Renderer. The headless Node.js SDK can query limitations and perform scene manipulation, but complete video rendering and encoding requires the renderer.

The CE.SDK Renderer runs as a separate process that handles video encoding and export. It supports the same codec options and provides consistent output across server deployments.

For more information about the renderer and its capabilities, see the [CE.SDK Renderer Overview](#broken-link-7f3e9a).

## Hardware Considerations

Server capabilities directly affect video processing performance. CE.SDK scales with available hardware resources.

### Recommended Server Specifications

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| Memory | 4 GB | 8+ GB for 4K content |
| CPU | 2 cores | 4+ cores for faster processing |
| Storage | SSD recommended | Fast I/O for video file handling |

### GPU Considerations

GPU acceleration can improve encoding and decoding performance. For server deployments:

- Dedicated GPUs provide the best performance for high-resolution content
- GPU memory limits affect maximum texture size and export dimensions
- Cloud GPU instances vary in capability; test your target configuration

## Memory Constraints

Server-side video processing operates within Node.js and WebAssembly memory limits. Use the memory APIs to monitor consumption and make informed decisions about resource allocation.

Query current memory usage to understand consumption:

```typescript highlight-query-memory-usage
// Query current memory consumption (returns BigInt on Node.js)
const usedMemory = engine.editor.getUsedMemory();
const usedMemoryMB = (Number(usedMemory) / (1024 * 1024)).toFixed(2);
console.log('Memory used:', usedMemoryMB, 'MB');
```

Check how much memory remains available:

```typescript highlight-query-available-memory
// Query available memory for video processing (returns BigInt on Node.js)
const availableMemory = engine.editor.getAvailableMemory();
const availableMemoryMB = (Number(availableMemory) / (1024 * 1024)).toFixed(
  2
);
console.log('Memory available:', availableMemoryMB, 'MB');
// Server environments typically have more memory than browser tabs
```

Calculate memory utilization to monitor resource usage:

```typescript highlight-calculate-memory-percentage
// Calculate memory utilization percentage
const totalMemory = Number(usedMemory) + Number(availableMemory);
const memoryUtilization = ((Number(usedMemory) / totalMemory) * 100).toFixed(
  1
);
console.log('Memory utilization:', memoryUtilization, '%');
```

Before processing large resources, verify sufficient memory is available:

```typescript highlight-check-memory-before-operation
// Before loading large resources, check available memory
const minRequiredMemory = 500 * 1024 * 1024; // 500 MB minimum
const hasEnoughMemory = Number(availableMemory) > minRequiredMemory;
console.log(
  'Has enough memory for large video processing:',
  hasEnoughMemory ? 'Yes' : 'No'
);
```

Server environments typically have more memory than browser tabs, but multiple concurrent operations increase usage proportionally. Consider implementing queue-based processing for high-throughput scenarios.

## Export Size Limitations

Export dimensions are bounded by hardware texture size limits. Always query `getMaxExportSize()` before initiating exports.

The maximum export size varies by hardware capabilities. Common limits include:

- **4096 pixels**: Basic configurations
- **8192 pixels**: Most modern server hardware
- **16384 pixels**: High-end GPU configurations

Consider target platform requirements when planning export dimensions. Most video content is consumed at 1080p or 4K, so extreme resolutions rarely provide practical value.

## Troubleshooting

Common issues in server-side video processing:

| Issue | Cause | Solution |
| ----- | ----- | -------- |
| Export fails | Memory limits exceeded | Reduce resolution or split into segments |
| Codec not supported | Missing system codecs | Install required codec libraries |
| Slow processing | Insufficient hardware resources | Upgrade server specs or optimize content |
| Export size rejected | Exceeds texture limits | Query `getMaxExportSize()` and reduce dimensions |
| High memory usage | Large files or many concurrent operations | Implement queue-based processing |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.editor.getMaxExportSize()` | Query the maximum export dimensions supported by the environment |
| `engine.editor.getAvailableMemory()` | Get available memory in bytes for video processing |
| `engine.editor.getUsedMemory()` | Get current memory usage in bytes |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support