> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Resources](./concepts/resources.md)

---

Manage external media files—images, videos, audio, and fonts—that blocks
reference via URIs in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-resources-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-resources-server-js)

Resources are external media files that blocks reference through URI properties like `fill/image/imageFileURI` or `fill/video/fileURI`. CE.SDK loads resources automatically when needed, but you can preload them for better performance. When working with temporary data like buffers or blobs, you need to persist them before saving. If resource URLs change (such as during CDN migration), you can update the mappings without modifying scene data.

```typescript file=@cesdk_web_examples/guides-concepts-resources-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Resources Guide
 *
 * Demonstrates resource management in CE.SDK:
 * - On-demand resource loading
 * - Preloading resources with forceLoadResources()
 * - Preloading audio/video with forceLoadAVResource()
 * - Finding transient resources
 * - Persisting transient resources during save
 * - Relocating resources when URLs change
 * - Finding all media URIs in a scene
 * - Detecting MIME types
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a new scene and page
    const scene = engine.scene.create();

    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Layout configuration: two blocks with equal margins
    const margin = 30;
    const gap = 20;
    const blockWidth = 300;
    const blockHeight = 200;

    // Set page dimensions to hug the blocks
    const pageWidth = margin + blockWidth + gap + blockWidth + margin;
    const pageHeight = margin + blockHeight + margin;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Create a graphic block with an image fill
    // Resources are loaded on-demand when the engine renders the block
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);
    engine.block.setPositionX(imageBlock, margin);
    engine.block.setPositionY(imageBlock, margin);
    engine.block.setWidth(imageBlock, blockWidth);
    engine.block.setHeight(imageBlock, blockHeight);

    // Create an image fill - the image loads when the block is rendered
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setEnum(imageBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, imageBlock);
    console.log('Created image block - resource loads on-demand when rendered');

    // Preload all resources in the scene before rendering
    // This ensures resources are cached and ready for display
    console.log('Preloading all resources in the scene...');
    await engine.block.forceLoadResources([scene]);
    console.log('All resources preloaded successfully');

    // Preload specific blocks only (useful for optimizing load order)
    await engine.block.forceLoadResources([imageBlock]);
    console.log('Image block resources preloaded');

    // Create a second graphic block for video
    const videoBlock = engine.block.create('graphic');
    const videoShape = engine.block.createShape('rect');
    engine.block.setShape(videoBlock, videoShape);
    engine.block.setPositionX(videoBlock, margin + blockWidth + gap);
    engine.block.setPositionY(videoBlock, margin);
    engine.block.setWidth(videoBlock, blockWidth);
    engine.block.setHeight(videoBlock, blockHeight);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    engine.block.setString(
      videoFill,
      'fill/video/fileURI',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    );
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setEnum(videoBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, videoBlock);

    // Preload video resource to query its properties
    console.log('Preloading video resource...');
    await engine.block.forceLoadAVResource(videoFill);
    console.log('Video resource preloaded');

    // Now we can query video properties
    const videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    const videoWidth = engine.block.getVideoWidth(videoFill);
    const videoHeight = engine.block.getVideoHeight(videoFill);
    console.log(
      `Video properties - Duration: ${videoDuration}s, Size: ${videoWidth}x${videoHeight}`
    );

    // Find all transient resources that need persistence before export
    // Transient resources include buffers and blobs that won't survive serialization
    const transientResources = engine.editor.findAllTransientResources();
    console.log(`Found ${transientResources.length} transient resources`);
    for (const resource of transientResources) {
      console.log(
        `Transient: URL=${resource.URL}, Size=${resource.size} bytes`
      );
    }

    // Get all media URIs referenced in the scene
    // Useful for pre-fetching or validating resource availability
    const mediaURIs = engine.editor.findAllMediaURIs();
    console.log(`Scene contains ${mediaURIs.length} media URIs:`);
    for (const uri of mediaURIs) {
      console.log(`  - ${uri}`);
    }

    // Detect the MIME type of a resource
    // This downloads the resource if not already cached
    const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
    const mimeType = await engine.editor.getMimeType(imageUri);
    console.log(`MIME type of ${imageUri}: ${mimeType}`);

    // Relocate a resource when its URL changes
    // This updates the internal cache mapping without modifying scene data
    const oldUrl = 'https://example.com/old-location/image.jpg';
    const newUrl = 'https://cdn.example.com/new-location/image.jpg';

    // In a real scenario, you would relocate after uploading to a new location:
    // engine.editor.relocateResource(oldUrl, newUrl);
    console.log(`Resource relocation example: ${oldUrl} -> ${newUrl}`);
    console.log('Use relocateResource() after uploading to a CDN');

    // When saving, use onDisallowedResourceScheme to handle transient resources
    // This callback is called for each resource with a disallowed scheme (like buffer: or blob:)
    const sceneString = await engine.block.saveToString(
      [scene],
      ['http', 'https'], // Only allow http and https URLs
      async (url: string) => {
        // In a real app, upload the resource and return the permanent URL
        // const response = await uploadToCDN(url);
        // return response.permanentUrl;

        // For this example, we'll just log the URL
        console.log(`Would upload transient resource: ${url}`);
        // Return the original URL since we're not actually uploading
        return url;
      }
    );
    console.log(`Scene saved to string (${sceneString.length} characters)`);

    // Set playback time to show video content in the scene
    engine.block.setPlaybackTime(page, 2);

    console.log('Resources guide completed successfully.');
    console.log(
      'Demonstrated: on-demand loading, preloading, transient resources, and relocation.'
    );
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers on-demand and preloaded resource loading, identifying and persisting transient resources, relocating resources when URLs change, and discovering all media URIs in a scene.

## On-Demand Loading

The engine fetches resources automatically when rendering blocks or preparing exports. This approach requires no extra code but may delay the initial render while resources download.

```typescript highlight-on-demand-loading
    // Create a new scene and page
    const scene = engine.scene.create();

    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Layout configuration: two blocks with equal margins
    const margin = 30;
    const gap = 20;
    const blockWidth = 300;
    const blockHeight = 200;

    // Set page dimensions to hug the blocks
    const pageWidth = margin + blockWidth + gap + blockWidth + margin;
    const pageHeight = margin + blockHeight + margin;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Create a graphic block with an image fill
    // Resources are loaded on-demand when the engine renders the block
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);
    engine.block.setPositionX(imageBlock, margin);
    engine.block.setPositionY(imageBlock, margin);
    engine.block.setWidth(imageBlock, blockWidth);
    engine.block.setHeight(imageBlock, blockHeight);

    // Create an image fill - the image loads when the block is rendered
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setEnum(imageBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, imageBlock);
    console.log('Created image block - resource loads on-demand when rendered');
```

When you create a block with an image fill, the image doesn't load immediately. The engine fetches it when the block first renders on the canvas.

## Preloading Resources

Load resources before they're needed with `forceLoadResources()`. Pass block IDs to load resources for those blocks and their children. Preloading eliminates render delays and is useful when you want the scene fully ready before displaying it.

```typescript highlight-preload-resources
    // Preload all resources in the scene before rendering
    // This ensures resources are cached and ready for display
    console.log('Preloading all resources in the scene...');
    await engine.block.forceLoadResources([scene]);
    console.log('All resources preloaded successfully');

    // Preload specific blocks only (useful for optimizing load order)
    await engine.block.forceLoadResources([imageBlock]);
    console.log('Image block resources preloaded');
```

Pass the scene to preload all resources in the entire design, or pass specific blocks to load only what you need. Pass an empty array to load every resource currently known to the engine.

## Preloading Audio and Video

Audio and video resources require `forceLoadAVResource()` for full metadata access. The engine needs to download and parse media files before you can query properties like duration or dimensions.

```typescript highlight-preload-av
    // Create a second graphic block for video
    const videoBlock = engine.block.create('graphic');
    const videoShape = engine.block.createShape('rect');
    engine.block.setShape(videoBlock, videoShape);
    engine.block.setPositionX(videoBlock, margin + blockWidth + gap);
    engine.block.setPositionY(videoBlock, margin);
    engine.block.setWidth(videoBlock, blockWidth);
    engine.block.setHeight(videoBlock, blockHeight);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    engine.block.setString(
      videoFill,
      'fill/video/fileURI',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    );
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setEnum(videoBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, videoBlock);

    // Preload video resource to query its properties
    console.log('Preloading video resource...');
    await engine.block.forceLoadAVResource(videoFill);
    console.log('Video resource preloaded');

    // Now we can query video properties
    const videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    const videoWidth = engine.block.getVideoWidth(videoFill);
    const videoHeight = engine.block.getVideoHeight(videoFill);
    console.log(
      `Video properties - Duration: ${videoDuration}s, Size: ${videoWidth}x${videoHeight}`
    );
```

Without preloading, properties like `getAVResourceTotalDuration()` or `getVideoWidth()` may return zero or incomplete values.

## Finding Transient Resources

Transient resources are temporary data stored in buffers or blobs that won't survive scene serialization. Use `findAllTransientResources()` to discover them before saving.

```typescript highlight-find-transient
// Find all transient resources that need persistence before export
// Transient resources include buffers and blobs that won't survive serialization
const transientResources = engine.editor.findAllTransientResources();
console.log(`Found ${transientResources.length} transient resources`);
for (const resource of transientResources) {
  console.log(
    `Transient: URL=${resource.URL}, Size=${resource.size} bytes`
  );
}
```

Each entry includes the resource URL and its size in bytes. Common transient resources include images from clipboard paste operations, camera captures, or programmatically generated content.

## Finding Media URIs

Get all media file URIs referenced in a scene with `findAllMediaURIs()`. This returns a deduplicated list of URIs from image fills, video fills, audio blocks, and other media sources.

```typescript highlight-find-media-uris
// Get all media URIs referenced in the scene
// Useful for pre-fetching or validating resource availability
const mediaURIs = engine.editor.findAllMediaURIs();
console.log(`Scene contains ${mediaURIs.length} media URIs:`);
for (const uri of mediaURIs) {
  console.log(`  - ${uri}`);
}
```

Use this for pre-fetching resources, validating availability, or building a manifest of all assets in a design.

## Finding Unused Blocks

List every block that is not attached to any scene with `findAllUnused()`. A block is considered unused when it has no scene reference and no ancestor that belongs to a scene. Render blocks (fills, effects, shapes, blurs) are excluded.

```typescript
const unusedBlocks = engine.block.findAllUnused();
console.log(`Scene contains ${unusedBlocks.length} unused blocks`);
for (const blockId of unusedBlocks) {
  engine.block.destroy(blockId);
}
```

Pair this with `findAllMediaURIs()` to skip relocating resources for blocks that are no longer reachable, or call `engine.block.destroy()` on each id to free memory before saving.

## Detecting MIME Types

Determine a resource's content type with `getMimeType()`. The engine downloads the resource if it's not already cached.

```typescript highlight-detect-mime-type
// Detect the MIME type of a resource
// This downloads the resource if not already cached
const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
const mimeType = await engine.editor.getMimeType(imageUri);
console.log(`MIME type of ${imageUri}: ${mimeType}`);
```

Common return values include `image/jpeg`, `image/png`, `video/mp4`, and `audio/mpeg`. This is useful when you need to verify resource types or make format-dependent decisions.

## Relocating Resources

Update URL mappings when resources move with `relocateResource()`. This updates all resource references in the scene and clears the internal cache.

```typescript highlight-relocate-resource
    // Relocate a resource when its URL changes
    // This updates the internal cache mapping without modifying scene data
    const oldUrl = 'https://example.com/old-location/image.jpg';
    const newUrl = 'https://cdn.example.com/new-location/image.jpg';

    // In a real scenario, you would relocate after uploading to a new location:
    // engine.editor.relocateResource(oldUrl, newUrl);
    console.log(`Resource relocation example: ${oldUrl} -> ${newUrl}`);
    console.log('Use relocateResource() after uploading to a CDN');
```

Use relocation after uploading resources to a CDN or when migrating assets between storage locations. The engine updates all references in the scene and clears cached data so that the resource is fetched from the new URL.

## Persisting Transient Resources

Handle transient resources during save with the `onDisallowedResourceScheme` callback in `saveToString()`. The callback receives each resource URL with a disallowed scheme (like `buffer:` or `blob:`) and returns the permanent URL after uploading.

```typescript highlight-persist-transient
    // When saving, use onDisallowedResourceScheme to handle transient resources
    // This callback is called for each resource with a disallowed scheme (like buffer: or blob:)
    const sceneString = await engine.block.saveToString(
      [scene],
      ['http', 'https'], // Only allow http and https URLs
      async (url: string) => {
        // In a real app, upload the resource and return the permanent URL
        // const response = await uploadToCDN(url);
        // return response.permanentUrl;

        // For this example, we'll just log the URL
        console.log(`Would upload transient resource: ${url}`);
        // Return the original URL since we're not actually uploading
        return url;
      }
    );
    console.log(`Scene saved to string (${sceneString.length} characters)`);
```

This pattern lets you intercept temporary resources, upload them to permanent storage, and save the scene with stable URLs that will work when reloaded.

## Troubleshooting

**Slow initial render**: Preload resources with `forceLoadResources()` before displaying the scene.

**Export fails with missing resources**: Check `findAllTransientResources()` and persist any temporary resources before export.

**Video duration returns 0**: Ensure the video resource is loaded with `forceLoadAVResource()` before querying properties.

**Resources not found after reload**: Transient resources (buffers, blobs) are not serialized—relocate them to persistent URLs before saving.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support