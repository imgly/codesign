> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Retrieve Mimetype](./import-media/retrieve-mimetype.md)

---

Detect the MIME type of resources loaded in the engine and relocate them to external URLs using `engine.editor.getMimeType()` and `engine.editor.relocateResource()`.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-retrieve-mimetype-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-retrieve-mimetype-server-js)

When loading scene archives in CE.SDK, embedded media resources are stored with internal `buffer://` URIs rather than their original URLs. These resources include both images and fonts used in the scene. To process these resources correctly—for instance when uploading to a CDN or exporting a clean scene file—you need to determine their MIME type and relocate them to external URLs.

```typescript file=@cesdk_web_examples/guides-import-media-retrieve-mimetype-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Retrieve MIME Type
 *
 * This example demonstrates:
 * - Loading a scene archive with embedded resources
 * - Finding transient resources (buffer:// URIs) including images and fonts
 * - Retrieving the MIME type of buffer resources
 * - Relocating resources to external URLs for a clean scene export
 */

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Load an archive that contains embedded resources (images and fonts)
  const archiveUrl =
    'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
  await engine.scene.load(archiveUrl);

  // Find all transient resources (embedded media with buffer:// URIs)
  // This includes both images and fonts embedded in the archive
  const transientResources = engine.editor.findAllTransientResources();
  console.log(`Found ${transientResources.length} transient resources`);

  if (transientResources.length === 0) {
    console.log('No transient resources found in the loaded archive');
  } else {
    // Get MIME types for all resources to see what's included
    const resourcesByType: Record<string, number> = {};
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
    }
    console.log('Resources by type:', resourcesByType);

    // Filter to find only image resources
    const imageResources = [];
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      if (mimeType.startsWith('image/')) {
        imageResources.push({ ...resource, mimeType });
      }
    }
    console.log(`Found ${imageResources.length} image resources`);

    // Create output directory for extracted files
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Extension map for determining file extensions
    const extensionMap: Record<string, string> = {
      // Image types
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      // Font types
      'font/ttf': '.ttf',
      'font/otf': '.otf',
      'font/woff': '.woff',
      'font/woff2': '.woff2'
    };

    // Extract and save all resources, simulating upload to storage
    const uploadedUrls: Map<string, string> = new Map();
    let fileIndex = 0;

    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const bufferLength = engine.editor.getBufferLength(bufferUri);
      const bufferData = engine.editor.getBufferData(
        bufferUri,
        0,
        bufferLength
      );

      // Determine file extension and save
      const extension = extensionMap[mimeType] || '.bin';
      const filename = `resource-${fileIndex}${extension}`;
      const outputPath = `${outputDir}/${filename}`;

      writeFileSync(outputPath, Buffer.from(bufferData));
      console.log(`Saved: ${filename} (${mimeType}, ${bufferLength} bytes)`);

      // In production, you would upload to your storage/CDN here
      // and get back a public URL. We simulate with a local file URL.
      const simulatedCdnUrl = `https://your-cdn.com/assets/${filename}`;
      uploadedUrls.set(bufferUri, simulatedCdnUrl);
      fileIndex++;
    }

    // Relocate all buffer:// URIs to their new external URLs
    // This updates the scene to reference the uploaded files instead
    for (const [bufferUri, newUrl] of uploadedUrls) {
      engine.editor.relocateResource(bufferUri, newUrl);
    }
    console.log(`Relocated ${uploadedUrls.size} resources to external URLs`);

    // Verify relocation: transient resources should now be empty
    const remainingResources = engine.editor.findAllTransientResources();
    console.log(`Remaining transient resources: ${remainingResources.length}`);

    // Export the scene - it now references external URLs instead of buffer:// URIs
    const sceneString = await engine.scene.saveToString();
    const sceneOutputPath = `${outputDir}/scene-relocated.imgly`;
    writeFileSync(sceneOutputPath, sceneString);
    console.log(`Saved relocated scene to: ${sceneOutputPath}`);
  }

  console.log('\nRetrieve MIME Type example completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers loading a scene archive, finding transient resources, retrieving MIME types, saving resources to storage, and relocating them to external URLs for a clean scene export.

## Setup

Initialize the CE.SDK engine for server-side resource processing:

```typescript highlight=highlight-setup
// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Loading a Scene Archive

Scene archives package a complete scene along with its embedded assets. When loaded, images, fonts, and other media are stored in memory and referenced via buffer URIs.

```typescript highlight=highlight-load-archive
// Load an archive that contains embedded resources (images and fonts)
const archiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
await engine.scene.load(archiveUrl);
```

After loading an archive, you can find all embedded resources using the `findAllTransientResources()` method.

## Finding Transient Resources

Transient resources are embedded media files stored in memory with `buffer://` URIs. Use `findAllTransientResources()` to get a list of all such resources in the current scene. This includes both images and fonts.

```typescript highlight=highlight-find-transient-resources
// Find all transient resources (embedded media with buffer:// URIs)
// This includes both images and fonts embedded in the archive
const transientResources = engine.editor.findAllTransientResources();
console.log(`Found ${transientResources.length} transient resources`);
```

Each resource object contains a `URL` property with the buffer URI and a `size` property indicating the resource size in bytes.

## Retrieving the MIME Type

Use `getMimeType()` to detect the format of each embedded resource. This is useful for categorizing resources or determining how to process them.

```typescript highlight=highlight-get-mimetype
// Get MIME types for all resources to see what's included
const resourcesByType: Record<string, number> = {};
for (const resource of transientResources) {
  const mimeType = await engine.editor.getMimeType(resource.URL);
  resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
}
console.log('Resources by type:', resourcesByType);
```

The method returns standard MIME type strings:

**Image types:**

- `image/jpeg` for JPEG images
- `image/png` for PNG images
- `image/webp` for WebP images
- `image/gif` for GIF images

**Font types:**

- `font/ttf` for TrueType fonts
- `font/otf` for OpenType fonts
- `font/woff` for WOFF fonts
- `font/woff2` for WOFF2 fonts

## Filtering Resources by Type

Since transient resources include both images and fonts, you may want to filter them by MIME type prefix to process only specific resource types.

```typescript highlight=highlight-filter-images
// Filter to find only image resources
const imageResources = [];
for (const resource of transientResources) {
  const mimeType = await engine.editor.getMimeType(resource.URL);
  if (mimeType.startsWith('image/')) {
    imageResources.push({ ...resource, mimeType });
  }
}
console.log(`Found ${imageResources.length} image resources`);
```

This pattern allows you to separate image processing from font processing, or to handle each resource type differently.

## Extracting and Uploading Resources

Extract buffer data for each resource, save or upload it to your storage service, and track the mapping from buffer URIs to new external URLs.

```typescript highlight=highlight-get-buffer-data
    // Extension map for determining file extensions
    const extensionMap: Record<string, string> = {
      // Image types
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      // Font types
      'font/ttf': '.ttf',
      'font/otf': '.otf',
      'font/woff': '.woff',
      'font/woff2': '.woff2'
    };

    // Extract and save all resources, simulating upload to storage
    const uploadedUrls: Map<string, string> = new Map();
    let fileIndex = 0;

    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const bufferLength = engine.editor.getBufferLength(bufferUri);
      const bufferData = engine.editor.getBufferData(
        bufferUri,
        0,
        bufferLength
      );

      // Determine file extension and save
      const extension = extensionMap[mimeType] || '.bin';
      const filename = `resource-${fileIndex}${extension}`;
      const outputPath = `${outputDir}/${filename}`;

      writeFileSync(outputPath, Buffer.from(bufferData));
      console.log(`Saved: ${filename} (${mimeType}, ${bufferLength} bytes)`);

      // In production, you would upload to your storage/CDN here
      // and get back a public URL. We simulate with a local file URL.
      const simulatedCdnUrl = `https://your-cdn.com/assets/${filename}`;
      uploadedUrls.set(bufferUri, simulatedCdnUrl);
      fileIndex++;
    }
```

In production, replace the simulated CDN URL with the actual URL returned by your storage service (e.g., AWS S3, Google Cloud Storage, or your own CDN).

## Relocating Resources

After uploading resources, use `relocateResource()` to update the scene to reference the new external URLs instead of `buffer://` URIs.

```typescript highlight=highlight-relocate-resources
// Relocate all buffer:// URIs to their new external URLs
// This updates the scene to reference the uploaded files instead
for (const [bufferUri, newUrl] of uploadedUrls) {
  engine.editor.relocateResource(bufferUri, newUrl);
}
console.log(`Relocated ${uploadedUrls.size} resources to external URLs`);
```

This step is essential for creating a portable scene file that references your hosted assets.

## Verifying and Exporting

After relocating all resources, verify that no transient resources remain and export the clean scene.

```typescript highlight=highlight-verify-relocation
    // Verify relocation: transient resources should now be empty
    const remainingResources = engine.editor.findAllTransientResources();
    console.log(`Remaining transient resources: ${remainingResources.length}`);

    // Export the scene - it now references external URLs instead of buffer:// URIs
    const sceneString = await engine.scene.saveToString();
    const sceneOutputPath = `${outputDir}/scene-relocated.imgly`;
    writeFileSync(sceneOutputPath, sceneString);
    console.log(`Saved relocated scene to: ${sceneOutputPath}`);
```

The exported scene file now references external URLs instead of embedded binary data, making it smaller and suitable for storage in a database or file system.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.editor.findAllTransientResources()` | Returns an array of transient resources with `URL` and `size` properties. Includes images, fonts, and other embedded media. |
| `engine.editor.getMimeType(uri)` | Returns the MIME type of the resource at the given URI. Downloads the resource if not already cached. |
| `engine.editor.getBufferLength(uri)` | Returns the byte length of the buffer at the given URI. |
| `engine.editor.getBufferData(uri, offset, length)` | Returns raw binary data from the buffer, starting at the specified offset for the given length. |
| `engine.editor.relocateResource(currentUrl, relocatedUrl)` | Updates all references to `currentUrl` in the scene to use `relocatedUrl` instead. |

## Troubleshooting

### MIME Type Returns Empty String

If `getMimeType()` returns an empty string, the resource format could not be determined. This may happen if:

- The buffer URI is invalid or the resource was not properly embedded
- The resource data is corrupted or in an unsupported format

### No Transient Resources Found

If `findAllTransientResources()` returns an empty array:

- Verify the archive was loaded successfully
- Check that the scene contains embedded resources rather than external URL references
- Some templates may use external CDN URLs instead of embedded resources

### Resources Not Relocated

If transient resources remain after calling `relocateResource()`:

- Ensure you're using the exact buffer URI from `findAllTransientResources()`
- Check that you're not skipping any resources in your loop
- Bundle resources (`bundle://ly.img.cesdk/`) are internal and cannot be relocated

## Cleanup

Always dispose the engine when done to free resources:

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support