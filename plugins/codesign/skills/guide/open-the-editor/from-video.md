> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From Video](./open-the-editor/from-video.md)

---

Create an editable scene from a video file using CE.SDK in headless Node.js
environments for server-side video processing workflows.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-from-video-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-from-video-server-js)

Starting from an existing video allows you to create editable scenes on the server. The `engine.scene.createFromVideo()` method fetches the video, creates a scene with matching dimensions, and sets up pixel-based design units. This is useful for server-side video processing pipelines — whether you render the result on the server or prepare scenes for later editing in browser environments.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-video-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create From Video
 *
 * Demonstrates how to create a scene from a video file in headless Node.js
 * environments. This sets up the scene structure with timeline mode enabled.
 *
 * Note: Video frame rendering/export requires browser-level video decoding
 * which is not available in Node.js. Use the browser version for video
 * frame export, or save the scene for later use in a browser environment.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create Scene from Remote Video URL
  // ========================================
  // Load a video directly from a URL
  const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a scene sized to match the video dimensions
  // Timeline mode is automatically enabled
  await engine.scene.createFromVideo(videoUrl);

  // The scene structure is ready with video as content

  console.log('✓ Created scene from video URL');

  // ========================================
  // Working with the Created Scene
  // ========================================
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the video)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);

    // Get the video duration
    const duration = engine.block.getDuration(page);
    console.log(`Video duration: ${duration.toFixed(2)} seconds`);
  }

  // ========================================
  // Find and Modify the Video Block
  // ========================================
  // The video is placed inside a graphic block
  const graphicBlocks = engine.block.findByType('graphic');
  const videoBlock = graphicBlocks[0];

  if (videoBlock) {
    // Modify video block properties
    engine.block.setOpacity(videoBlock, 0.95);
    console.log('✓ Found and modified video block');
  }

  // ========================================
  // Save Scene for Later Use
  // ========================================
  // Save the scene to a string for storage or transfer
  const sceneString = await engine.scene.saveToString();
  writeFileSync('output/video-scene.imgly', sceneString);
  console.log('📄 Saved scene to: output/video-scene.imgly');

  // Or save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/video-scene-archive.imgly', archiveBuffer);
  console.log('📦 Saved archive to: output/video-scene-archive.imgly');

  console.log('\n✓ Create From Video guide completed successfully!');
  console.log(
    '\nNote: Video frame export requires browser-level video decoding.'
  );
  console.log('Use the saved scene in a browser environment for frame export.');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

This guide covers how to create scenes from video files, work with video blocks, and save scenes for later use.

## Initialize the Engine

Start by initializing the CE.SDK engine in headless mode. The Node.js packages (`@cesdk/node` and `@cesdk/node-native`) provide the same API as the browser version but run without a visual interface.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Create Scene from Video URL

Load a video directly from a URL using `createFromVideo()`. The method fetches the video and creates a scene sized to match its dimensions.

```typescript highlight-create-from-url
  // Load a video directly from a URL
  const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a scene sized to match the video dimensions
  // Timeline mode is automatically enabled
  await engine.scene.createFromVideo(videoUrl);

  // The scene structure is ready with video as content
```

The method returns a promise that resolves once the video is loaded and the scene is ready for processing. The scene's page dimensions automatically match the video resolution.

## Work With the Video Block

After creating the scene, access the page to get dimensions and find the video block for modifications.

```typescript highlight-work-with-scene
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the video)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);

    // Get the video duration
    const duration = engine.block.getDuration(page);
    console.log(`Video duration: ${duration.toFixed(2)} seconds`);
  }
```

The video is placed inside a graphic block. Use `engine.block.findByType('graphic')` to locate it.

```typescript highlight-find-video-block
  // The video is placed inside a graphic block
  const graphicBlocks = engine.block.findByType('graphic');
  const videoBlock = graphicBlocks[0];

  if (videoBlock) {
    // Modify video block properties
    engine.block.setOpacity(videoBlock, 0.95);
    console.log('✓ Found and modified video block');
  }
```

You can modify properties like opacity, position, or apply effects using the Block API.

## Save Scene for Later Use

Save the scene to a file for storage, further processing, or transfer to a browser environment. You can save as a plain string or as an archive with embedded assets.

```typescript highlight-save-scene
  // Save the scene to a string for storage or transfer
  const sceneString = await engine.scene.saveToString();
  writeFileSync('output/video-scene.imgly', sceneString);
  console.log('📄 Saved scene to: output/video-scene.imgly');

  // Or save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/video-scene-archive.imgly', archiveBuffer);
  console.log('📦 Saved archive to: output/video-scene-archive.imgly');
```

## Clean Up Resources

Always dispose of the engine when done to free system resources.

```typescript highlight-cleanup
// Always dispose the engine when done
engine.dispose();
```

## Troubleshooting

**Video fails to load**

- Verify the video URL is accessible from your server
- Check network connectivity and firewall rules
- Ensure the format is supported (MP4, WebM)

**Scene dimensions don't match video**

- Dimensions come from video metadata during load
- Check the video file has valid dimension metadata

**Memory issues with large videos**

- Process videos in batches to manage memory usage
- Dispose of the engine between batch operations
- With the WASM-based `@cesdk/node` package, consider extracting specific frames rather than full video processing; the native `@cesdk/node-native` package can render full videos

**Export failures**

- Ensure the output directory exists before writing
- Check filesystem permissions
- Verify sufficient disk space for output files

## API Reference

| Method                           | Purpose                       |
| -------------------------------- | ----------------------------- |
| `CreativeEngine.init()`          | Initialize engine instance    |
| `engine.scene.createFromVideo()` | Create scene from video URL   |
| `engine.scene.saveToString()`    | Save scene to serialized string |
| `engine.scene.saveToArchive()`   | Save scene as archive with assets |
| `engine.block.findByType()`      | Find blocks by type           |
| `engine.block.getWidth()`        | Get block width               |
| `engine.block.getHeight()`       | Get block height              |
| `engine.block.setOpacity()`      | Set block opacity             |
| `engine.block.getDuration()`     | Get video duration            |
| `engine.dispose()`               | Clean up engine resources     |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support