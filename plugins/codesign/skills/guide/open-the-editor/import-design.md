> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md)

---

Import existing designs in headless Node.js environments using CE.SDK, including saved scenes, archives, and source media.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-import-design-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-import-design-server-js)

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Import a Design
 *
 * Demonstrates different methods to import designs in headless mode:
 * - Loading scenes from URLs
 * - Loading scenes from strings
 * - Loading scenes from archives
 * - Creating scenes from images
 * - Creating scenes from videos
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Demonstration 1: Create Scene from Image
  // ========================================
  // Start with creating a scene from an image (no preexisting scene needed)

  // Create a scene based on an existing image
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create a scene sized to the image with the image as content
  await engine.scene.createFromImage(imageUrl);

  // The scene is ready for editing with the image as the base

  console.log('✓ Created scene from image');

  // Export the image-based scene
  const page1 = engine.block.findByType('page')[0];
  if (page1) {
    const imageBlob = await engine.block.export(page1, {
      mimeType: 'image/png'
    });
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    writeFileSync('output/image-import-result.png', imageBuffer);
    console.log('📄 Exported image scene to: output/image-import-result.png');
  }

  // ========================================
  // Demonstration 2: Load Scene from String
  // ========================================
  // Save the current scene to demonstrate loading from string

  const sceneString = await engine.scene.saveToString();

  // Scene content as a string (from saveToString() or storage)
  const savedSceneString = sceneString;

  // Load the scene from string content
  await engine.scene.load(savedSceneString);

  // The scene is restored from the string representation

  console.log('✓ Loaded scene from string');

  // ========================================
  // Demonstration 3: Load from Archive
  // ========================================
  // Create and load an archive

  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/temp-archive.imgly', archiveBuffer);

  // In server environments, load archives using file:// URLs
  // This works the same as loading from HTTP/HTTPS URLs

  // Convert filesystem path to file:// URL
  const archivePath = path.resolve('output/temp-archive.imgly');
  const archiveFileUrl = `file://${archivePath}`;

  // Load the archive using engine.scene.load
  await engine.scene.load(archiveFileUrl);

  // Archives include all assets, making them portable across environments
  // No external asset URLs need to be accessible

  console.log('✓ Loaded scene from archive');

  // ========================================
  // Demonstration 4: Load Scene from URL
  // ========================================

  // URL to a saved CE.SDK scene file
  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

  // Load the scene from remote URL
  await engine.scene.load(sceneUrl);

  // The scene is now loaded and ready for editing
  // All blocks and properties from the saved scene are restored

  console.log('✓ Loaded scene from URL');

  // ========================================
  // Demonstration 5: Modify Loaded Scene
  // ========================================

  // Modify the loaded scene - all blocks are accessible
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Find all graphic blocks in the scene
    const graphics = engine.block.findByType('graphic');

    // Modify properties of the first graphic if it exists
    if (graphics.length > 0) {
      const graphic = graphics[0];

      // Example: Adjust opacity
      engine.block.setOpacity(graphic, 0.8);

      // Example: Adjust position
      const currentX = engine.block.getPositionX(graphic);
      engine.block.setPositionX(graphic, currentX + 10);
    }
  }

  console.log('✓ Modified loaded scene');

  // Export the final result
  const page2 = engine.block.findByType('page')[0];
  if (page2) {
    const finalBlob = await engine.block.export(page2, {
      mimeType: 'image/png',
      targetWidth: 800,
      targetHeight: 600
    });
    const finalBuffer = Buffer.from(await finalBlob.arrayBuffer());
    writeFileSync('output/import-design-result.png', finalBuffer);
    console.log('📄 Exported final result to: output/import-design-result.png');
  }

  // ========================================
  // Demonstration 6: Create Scene from Video
  // ========================================

  // Create a scene configured for video editing
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barreling-a-wave-18069232.mp4';

  // Create a video scene with timeline support
  await engine.scene.createFromVideo(videoUrl);

  // The scene is set up for video editing with timeline controls

  console.log('✓ Created scene from video');

  console.log('\n✓ Import Design guide completed successfully!');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

CE.SDK's headless Node.js SDK supports multiple import methods to bring designs into the engine. Load saved **scene files** or self-contained **archives**, create editable scenes from images and videos for server-side processing, batch operations, and automation workflows.

This guide covers how to load saved CE.SDK scenes and create scenes from media files in a Node.js environment.

## Understanding Import Methods

CE.SDK provides several approaches for importing designs in headless mode:

- **Scene files** – Load lightweight JSON files that reference assets by URL
- **Archives** – Load self-contained packages that bundle scenes with all assets ([See dedicated guide](./open-the-editor/import-design/from-archive.md))
- **Media imports** – Create editable designs from source images or videos

## Import from other Design Tools

CE.SDK provides specialized importers that convert files from Photoshop (`.psd`) and InDesign (`.idml`) into editable scenes. These importers preserve layers, text, effects, and design structure.

## Load Saved CE.SDK Scenes

Load previously saved scenes to resume editing work. The unified `engine.scene.load()` call handles all sources: pass a URL or the scene content as a string, and the engine detects the file kind (plain scene or archive) automatically.

### From a URL

Use `engine.scene.load()` with a URL to load scenes from a server or cloud storage. This works well for cloud-based processing where scenes are stored remotely.

```typescript highlight-load-from-url
  // URL to a saved CE.SDK scene file
  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

  // Load the scene from remote URL
  await engine.scene.load(sceneUrl);

  // The scene is now loaded and ready for editing
  // All blocks and properties from the saved scene are restored
```

The engine fetches the scene file asynchronously and replaces the current scene with the loaded content. All asset URLs referenced in the scene must remain accessible for the scene to render correctly.

### From a String

Use `engine.scene.load()` when you have scene content as a string from a database, file system, or a previous `engine.scene.saveToString()` call.

```typescript highlight-load-from-string
  // Scene content as a string (from saveToString() or storage)
  const savedSceneString = sceneString;

  // Load the scene from string content
  await engine.scene.load(savedSceneString);

  // The scene is restored from the string representation
```

This approach works well for scenes stored in databases or when integrating with custom storage systems that return scene data as strings.

### From an Archive

For self-contained packages that bundle the scene with all assets, use archives. The same `engine.scene.load()` call opens them — the kind is detected automatically from the content. See the [Import Design from Archive](./open-the-editor/import-design/from-archive.md) guide for complete details on working with archive files.

## Create Scenes from Media

Create editable scenes directly from images or videos.

### From Images

Use `engine.scene.createFromImage()` to create a design based on an existing image. This creates a scene sized to the image dimensions with the image as the primary content.

```typescript highlight-create-from-image
  // Create a scene based on an existing image
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create a scene sized to the image with the image as content
  await engine.scene.createFromImage(imageUrl);

  // The scene is ready for editing with the image as the base
```

The scene is ready for editing. You can add text, shapes, effects, and other design elements on top of the base image.

### From Videos

Use `engine.scene.createFromVideo()` to create a scene from a video file, automatically setting up dimensions and duration.

```typescript highlight-create-from-video
  // Create a scene configured for video editing
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barreling-a-wave-18069232.mp4';

  // Create a video scene with timeline support
  await engine.scene.createFromVideo(videoUrl);

  // The scene is set up for video editing with timeline controls
```

The scene is set up for video editing with time-based properties and video-specific features.

## Choosing the Right Import Method

Choose your import method based on your source and requirements:

- **Resuming previous work?** Use `engine.scene.load()` with a URL or string for scenes you previously saved with CE.SDK.

- **Need self-contained files?** Use archives that bundle scenes with all assets ([see guide](./open-the-editor/import-design/from-archive.md)).

- **Coming from design tools?** Use the respective importers to convert Photoshop or InDesign files.

- **Starting from media?** Use `engine.scene.createFromImage()` or `engine.scene.createFromVideo()` to build editable scenes from source files.

## Best Practices

Follow these recommendations for reliable and maintainable import workflows:

### Error Handling

Always wrap import operations in try-catch blocks to handle failures gracefully:

```typescript
try {
  await engine.scene.load(sceneUrl);
} catch (error) {
  // Log error and handle gracefully
  console.error('Failed to load scene:', error);
  // Optionally fall back to a default scene
  await engine.scene.create();
}
```

Provide specific error handling based on failure type (network errors, invalid files, missing assets).

## Working with Loaded Scenes

Modify loaded scenes immediately using CE.SDK's editing APIs. All blocks are accessible for modification.

```typescript highlight-modify-loaded-scene
  // Modify the loaded scene - all blocks are accessible
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Find all graphic blocks in the scene
    const graphics = engine.block.findByType('graphic');

    // Modify properties of the first graphic if it exists
    if (graphics.length > 0) {
      const graphic = graphics[0];

      // Example: Adjust opacity
      engine.block.setOpacity(graphic, 0.8);

      // Example: Adjust position
      const currentX = engine.block.getPositionX(graphic);
      engine.block.setPositionX(graphic, currentX + 10);
    }
  }
```

Scene loads can be reverted using `engine.editor.undo()` if you need to return to the previous state.

## Performance Considerations

Consider these factors when importing designs in Node.js environments:

### File Size and Loading Time

- **Scene files** are typically small (10-100KB) and load quickly since they only contain structure and asset references
- **Archives** can be large (1MB-100MB+) depending on bundled assets, requiring more time to download and extract
- **Image/video imports** depend on source media size - a 4K image may take several seconds to process

### Network Performance

When loading from URLs:

- Use CDN-hosted resources for faster downloads and reduced latency
- Consider compression for scene files stored on your servers
- Implement retry logic for network failures
- Cache frequently loaded scenes to avoid redundant network requests

### Memory Management

- Large scenes with many blocks and high-resolution assets consume more memory
- Archives extract their contents into memory during loading
- Video imports may require significant memory for processing
- Consider limiting the number of simultaneous scene loads in batch processing scenarios

### Optimization Strategies

Improve import performance with these approaches:

- **Preload frequently used scenes** during application startup
- **Compress source media** before creating scenes to reduce file sizes
- **Use appropriate formats** - archives for portability, scene files for speed
- **Implement caching** to avoid re-downloading unchanged scenes
- **Process in batches** when handling multiple imports to manage memory usage

## Troubleshooting

**Scene fails to load with asset errors**

When a scene loads but displays missing images or fonts, the asset URLs referenced in the scene are likely inaccessible. Check that:

- All asset URLs are still valid and return the resources
- Asset URLs are reachable from your server environment
- Network connectivity allows reaching the asset servers

**Design tool import fails**

Import failures from Photoshop or InDesign files typically occur when:

- The file format isn't supported (verify `.psd` for Photoshop, `.idml` for InDesign)
- The file is corrupted or incomplete
- The importer service isn't properly configured

**Media file fails to load**

When `createFromImage()` or `createFromVideo()` fails:

- Verify the media URL is accessible and returns the file
- Check that the file format is supported (common formats: JPG, PNG, MP4, WebM)
- Ensure the media resource URL is reachable from your server environment

## API Reference

| Method                                     | Purpose                                     |
| ------------------------------------------ | ------------------------------------------- |
| `engine.scene.load(sceneOrURL)`            | Load scene or archive from URL or string    |
| `engine.scene.createFromImage(url)`        | Create editable scene from image            |
| `engine.scene.createFromVideo(url)`        | Create video editing scene from video       |
| `engine.scene.saveToString()`              | Save scene to string for later loading      |
| `engine.scene.saveToArchive()`             | Save scene with assets as ZIP archive       |



---

## Related Pages

- [From InDesign](./open-the-editor/import-design/from-indesign.md) - Import Adobe InDesign files (IDML format) into CE.SDK, converting them into editable scenes while preserving text, shapes, images, and positioning.
- [From Photoshop](./open-the-editor/import-design/from-photoshop.md) - Import Adobe Photoshop (PSD) files into CE.SDK, converting them into editable scenes while preserving layers, text, shapes, and positioning.
- [Import Design from Archive](./open-the-editor/import-design/from-archive.md) - Load self-contained CE.SDK archive files that bundle scene structure with all referenced assets for portable, reliable design imports in Node.js.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support