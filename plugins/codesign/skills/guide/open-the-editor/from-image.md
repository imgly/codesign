> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From Image](./open-the-editor/from-image.md)

---

Create an editable scene from an image file using CE.SDK in headless Node.js
environments for server-side image processing workflows.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-from-image-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-from-image-server-js)

Starting from an existing image allows you to process and transform images on the server. The `engine.scene.createFromImage()` method fetches the image, creates a scene with matching dimensions, and sets up pixel-based design units. This is useful for batch processing, automated image transformations, and server-side rendering pipelines.

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-image-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create From Image
 *
 * Demonstrates how to create an editable scene from an image file
 * in headless Node.js environments.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create Scene from Remote Image URL
  // ========================================
  // The most common approach: load an image directly from a URL
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_4.jpg';

  // Create a scene sized to match the image dimensions
  await engine.scene.createFromImage(imageUrl);

  // The scene is now ready for editing with the image as content

  console.log('✓ Created scene from image URL');

  // ========================================
  // Working with the Created Scene
  // ========================================
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the image)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);
  }

  // ========================================
  // Export the Result
  // ========================================
  // Export the scene to an image file
  if (page) {
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/from-image-result.png', buffer);
    console.log('📄 Exported to: output/from-image-result.png');
  }

  console.log('\n✓ Create From Image guide completed successfully!');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

## Initialize the Engine

Start by initializing the CE.SDK engine in headless mode. The Node.js packages (`@cesdk/node` and `@cesdk/node-native`) provide the same API as the browser version but run without a visual interface.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Create Scene from Remote URL

The most common approach is loading an image directly from a URL. Pass the URL to `createFromImage()` to fetch the image and create a scene sized to match its dimensions.

```typescript highlight-create-from-url
  // The most common approach: load an image directly from a URL
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_4.jpg';

  // Create a scene sized to match the image dimensions
  await engine.scene.createFromImage(imageUrl);

  // The scene is now ready for editing with the image as content
```

The method returns a promise that resolves once the image is loaded and the scene is ready for processing. The scene's page dimensions automatically match the image.

## Configure Scene Parameters

The `createFromImage()` method accepts optional parameters for DPI, pixel scale factor, and scene layout.

```typescript
const scene = await engine.scene.createFromImage(
  imageUrl,
  300, // dpi - defaults to 300
  1, // pixelScaleFactor - defaults to 1
  'Free', // sceneLayout - defaults to 'Free'
);
```

- **DPI**: Affects the relationship between pixel and physical dimensions (defaults to 300)
- **Pixel Scale Factor**: Accounts for high-DPI displays (defaults to 1)
- **Scene Layout**: Controls page arrangement - 'Free', 'HorizontalStack', 'VerticalStack', or 'DepthStack' (defaults to 'Free')

## Create Scene from Blob (Server-side)

In server environments, you can fetch an image and create a blob URL for processing.

```typescript
const response = await fetch(imageUrl);
const blob = await response.blob();
const objectURL = URL.createObjectURL(blob);
const scene = await engine.scene.createFromImage(objectURL);
```

This pattern is useful when you need to process images fetched from external sources or read from the filesystem.

## Working with the Created Scene

After creating the scene, use `engine.block.findByType('page')` to access the page. The scene contains a single page with the image as its content.

```typescript highlight-work-with-scene
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the image)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);
  }
```

## Export the Result

After processing, export the scene to an image file using `engine.block.export()`.

```typescript highlight-export
// Export the scene to an image file
if (page) {
  const exportBlob = await engine.block.export(page, {
    mimeType: 'image/png'
  });
  const buffer = Buffer.from(await exportBlob.arrayBuffer());
  writeFileSync('output/from-image-result.png', buffer);
  console.log('📄 Exported to: output/from-image-result.png');
}
```

## Clean Up Resources

Always dispose of the engine when done to free system resources.

```typescript highlight-cleanup
// Always dispose the engine when done
engine.dispose();
```

## Troubleshooting

**Image fails to load**

- Verify the image URL is accessible from your server
- Check network connectivity and firewall rules
- Ensure the image format is supported (JPG, PNG, WebP, GIF)

**Memory issues with large images**

- Process images in batches to manage memory usage
- Dispose of the engine between batch operations
- Consider resizing images before processing if output doesn't require full resolution

**Export failures**

- Ensure the output directory exists before writing
- Check filesystem permissions
- Verify sufficient disk space for output files

## API Reference

| Method                         | Description                     |
| ------------------------------ | ------------------------------- |
| `CreativeEngine.init`          | Initialize engine instance      |
| `engine.scene.createFromImage` | Create scene from image URL     |
| `engine.block.findByType`      | Find blocks by type in scene    |
| `engine.block.getWidth`        | Get block width                 |
| `engine.block.getHeight`       | Get block height                |
| `engine.block.export`          | Export block to image           |
| `engine.dispose`               | Clean up engine resources       |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support