> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [Versioning of Assets](./import-media/from-remote-source/asset-versioning.md)

---

Manage how CE.SDK stores and resolves asset URLs in saved designs, ensuring designs remain functional when assets are updated or moved.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-from-remote-source-asset-versioning-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-from-remote-source-asset-versioning-server-js)

CE.SDK references assets via URIs rather than embedding files directly into designs. When you save a design with `engine.scene.saveToString()`, asset URLs are stored as strings. On load, CE.SDK fetches assets from those URLs. This approach keeps saved designs small but means URL changes can break existing designs. This guide explains how CE.SDK stores asset references and strategies for managing asset URLs in server-side applications.

```typescript file=@cesdk_web_examples/guides-import-media-from-remote-source-asset-versioning-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Asset Versioning
 *
 * Demonstrates how CE.SDK handles asset URLs in saved designs:
 * - How assets are stored as URL references
 * - Scene serialization vs archive export
 * - Inspecting and modifying asset URLs
 * - Strategies for versioned asset URLs
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create an image block with a remote URL
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 300);
  engine.block.setHeight(imageBlock, 200);
  engine.block.setPositionX(imageBlock, 50);
  engine.block.setPositionY(imageBlock, 50);
  engine.block.appendChild(page, imageBlock);

  // Get the fill block that contains the image URI
  const fill = engine.block.getFill(imageBlock);

  // Inspect the stored URI - this is exactly what gets saved in the scene
  const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Stored image URI:', storedUri);

  // Save the scene to a string - URLs are preserved as references
  const sceneString = await engine.scene.saveToString();
  console.log('Scene saved to string, length:', sceneString.length);

  // The scene string contains the URL reference, not the image data itself
  // This keeps the saved scene small and loads quickly

  // Alternatively, save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  console.log('Archive created, size:', archiveBlob.size, 'bytes');

  // Archives are self-contained - they include all asset data
  // Use archives when designs need to work offline or across environments

  // Programmatically update an asset URL (e.g., for CDN migration)
  const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
  engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

  // Verify the change
  const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Updated image URI:', updatedUri);

  // Find all graphic blocks to batch update their asset URLs
  const graphicBlocks = engine.block.findByType('graphic');
  console.log('Found graphic blocks:', graphicBlocks.length);

  // Iterate through blocks to inspect or update their fills
  for (const blockId of graphicBlocks) {
    const blockFill = engine.block.getFill(blockId);
    const fillType = engine.block.getType(blockFill);

    if (fillType === '//ly.img.ubq/fill/image') {
      const uri = engine.block.getString(blockFill, 'fill/image/imageFileURI');
      console.log('Image block found with URI:', uri);

      // Example: migrate from old CDN to new CDN
      if (uri.includes('old-cdn.example.com')) {
        const migratedUri = uri.replace(
          'old-cdn.example.com',
          'new-cdn.example.com'
        );
        engine.block.setString(
          blockFill,
          'fill/image/imageFileURI',
          migratedUri
        );
      }
    }
  }

  // Demonstrate versioned URL patterns

  // Path-based versioning: include version in the URL path
  const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
  console.log('Path-versioned URL:', pathVersionedUrl);

  // Hash-based versioning: include content hash in filename
  const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
  console.log('Hash-versioned URL:', hashVersionedUrl);

  // Query parameter versioning: append version as query string
  const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
  console.log('Query-versioned URL:', queryVersionedUrl);

  // Add a second image to make the scene more complete
  const secondImageUri = 'https://img.ly/static/ubq_samples/sample_3.jpg';
  const secondImageBlock = engine.block.create('graphic');
  engine.block.setShape(secondImageBlock, engine.block.createShape('rect'));
  const secondImageFill = engine.block.createFill('image');
  engine.block.setString(
    secondImageFill,
    'fill/image/imageFileURI',
    secondImageUri
  );
  engine.block.setFill(secondImageBlock, secondImageFill);
  engine.block.setWidth(secondImageBlock, 300);
  engine.block.setHeight(secondImageBlock, 200);
  engine.block.setPositionX(secondImageBlock, 400);
  engine.block.setPositionY(secondImageBlock, 50);
  engine.block.appendChild(page, secondImageBlock);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/asset-versioning-result.png`, buffer);

  // Also save the scene string for demonstration
  writeFileSync(`${outputDir}/scene.txt`, sceneString);

  console.log('✓ Exported result to output/asset-versioning-result.png');
  console.log('✓ Saved scene string to output/scene.txt');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to inspect asset URLs stored in designs, the difference between scene serialization and archive export, how to programmatically update asset URLs, and strategies for versioned URL schemes.

## Setup

Initialize the headless CE.SDK engine for server-side processing. The engine runs without a UI, making it suitable for automated workflows.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## How Asset URLs Are Stored

Assets in a scene are blocks with fill properties containing URI strings. When you add an image to a design, CE.SDK creates a fill block that stores the source URL. We use `engine.block.getFill()` to get the fill block and `engine.block.getString()` to inspect the stored URI.

```typescript highlight=highlight-how-urls-stored
  // Create an image block with a remote URL
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 300);
  engine.block.setHeight(imageBlock, 200);
  engine.block.setPositionX(imageBlock, 50);
  engine.block.setPositionY(imageBlock, 50);
  engine.block.appendChild(page, imageBlock);

  // Get the fill block that contains the image URI
  const fill = engine.block.getFill(imageBlock);

  // Inspect the stored URI - this is exactly what gets saved in the scene
  const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Stored image URI:', storedUri);
```

The `fill/image/imageFileURI` property contains exactly what gets written to the saved scene. CE.SDK doesn't transform or normalize these URLs—they're stored and loaded as-is.

## Scene Serialization vs Archive Export

CE.SDK provides two approaches for saving designs, each with different trade-offs for asset handling.

### Saving as a Scene String

The `saveToString()` method serializes the scene structure while keeping asset references as URLs. This produces small files that load quickly, but requires the original assets to remain available at their URLs.

```typescript highlight=highlight-save-scene
  // Save the scene to a string - URLs are preserved as references
  const sceneString = await engine.scene.saveToString();
  console.log('Scene saved to string, length:', sceneString.length);

  // The scene string contains the URL reference, not the image data itself
  // This keeps the saved scene small and loads quickly
```

Use scene strings when:

- Assets are hosted on a stable CDN with reliable URLs
- You want to keep storage costs low
- Designs need to load quickly
- You can guarantee asset availability

### Saving as an Archive

The `saveToArchive()` method bundles the scene with all referenced assets into a ZIP file. This creates a self-contained package that works without network access.

```typescript highlight=highlight-save-archive
  // Alternatively, save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  console.log('Archive created, size:', archiveBlob.size, 'bytes');

  // Archives are self-contained - they include all asset data
  // Use archives when designs need to work offline or across environments
```

Use archives when:

- Designs need to work offline
- You're migrating designs between environments
- You can't guarantee long-term URL availability
- Portability is more important than file size

| Approach | Method | Assets | File Size | Portability |
|----------|--------|--------|-----------|-------------|
| Scene | `saveToString()` | Referenced by URL | Small | Requires URL availability |
| Archive | `saveToArchive()` | Embedded in ZIP | Larger | Self-contained |

## What Happens When URLs Change

When a design is loaded and an asset URL returns a 404 or is otherwise unavailable, the block appears empty or shows an error state. In server-side processing, this may cause export failures or incomplete renders.

CE.SDK doesn't provide automatic fallbacks or retries for failed asset loads. If some assets fail while others succeed, the design loads partially. To prevent broken designs, ensure assets remain available at their original URLs or migrate designs when URLs change.

## Updating Asset URLs Programmatically

When you need to migrate assets to a new location, you can load existing scenes, update the URLs, and save the modified scene. We use `engine.block.setString()` to update the fill property.

```typescript highlight=highlight-update-url
  // Programmatically update an asset URL (e.g., for CDN migration)
  const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
  engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

  // Verify the change
  const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Updated image URI:', updatedUri);
```

For batch updates, iterate through all blocks of a given type and update their fills.

```typescript highlight=highlight-find-blocks
  // Find all graphic blocks to batch update their asset URLs
  const graphicBlocks = engine.block.findByType('graphic');
  console.log('Found graphic blocks:', graphicBlocks.length);

  // Iterate through blocks to inspect or update their fills
  for (const blockId of graphicBlocks) {
    const blockFill = engine.block.getFill(blockId);
    const fillType = engine.block.getType(blockFill);

    if (fillType === '//ly.img.ubq/fill/image') {
      const uri = engine.block.getString(blockFill, 'fill/image/imageFileURI');
      console.log('Image block found with URI:', uri);

      // Example: migrate from old CDN to new CDN
      if (uri.includes('old-cdn.example.com')) {
        const migratedUri = uri.replace(
          'old-cdn.example.com',
          'new-cdn.example.com'
        );
        engine.block.setString(
          blockFill,
          'fill/image/imageFileURI',
          migratedUri
        );
      }
    }
  }
```

This pattern is useful for CDN migrations or restructuring asset directories.

## Strategies for Versioned Asset URLs

Designing your URL scheme to support versioning prevents accidental overwrites and makes migrations easier. We recommend three approaches.

```typescript highlight=highlight-versioned-urls
  // Demonstrate versioned URL patterns

  // Path-based versioning: include version in the URL path
  const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
  console.log('Path-versioned URL:', pathVersionedUrl);

  // Hash-based versioning: include content hash in filename
  const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
  console.log('Hash-versioned URL:', hashVersionedUrl);

  // Query parameter versioning: append version as query string
  const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
  console.log('Query-versioned URL:', queryVersionedUrl);
```

### Path-Based Versioning

Include version in the URL path: `https://cdn.example.com/assets/v2/logo.png`. When you update assets, increment the version directory. Old designs reference old paths while new designs use new paths. Both versions can coexist on the same CDN.

### Hash-Based Filenames

Use content hashes in filenames: `logo-a1b2c3d4.png`. The URL changes whenever content changes, ensuring automatic cache invalidation. Build tools like Webpack and Vite generate these automatically. This pattern works well for content-addressable storage.

### Query Parameter Versioning

Append version as query parameter: `logo.png?v=2`. The base URL stays the same but the version parameter forces cache invalidation. Note that some CDNs ignore query parameters for caching—verify your CDN configuration before relying on this approach.

## Exporting Results

After processing designs, export the result to your desired format. The headless engine supports all export formats including PNG, PDF, and more.

```typescript highlight=highlight-export
  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/asset-versioning-result.png`, buffer);

  // Also save the scene string for demonstration
  writeFileSync(`${outputDir}/scene.txt`, sceneString);

  console.log('✓ Exported result to output/asset-versioning-result.png');
  console.log('✓ Saved scene string to output/scene.txt');
```

## Cleanup

Always dispose the engine when processing is complete to free resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Best Practices

When managing asset URLs in production:

- **Use immutable URLs**: Content-addressed or versioned paths prevent accidental overwrites
- **Keep old assets available**: Don't delete assets that may be referenced by saved designs
- **Use archives for portability**: Export as archive when designs need to work offline or across environments
- **Plan CDN migrations carefully**: Update saved designs before decommissioning old URLs
- **Batch process efficiently**: Load the engine once and process multiple designs before disposing
- **Handle errors gracefully**: Implement retry logic for transient network failures

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Asset not loading | URL changed or deleted | Verify URL accessibility, update scene |
| Design partially loads | Some assets unavailable | Check all asset URLs, consider archive export |
| Archive too large | Many/large embedded assets | Optimize assets before archiving |
| Export fails | Missing or broken assets | Verify all asset URLs before export |
| Memory issues | Engine not disposed | Always call `engine.dispose()` in finally block |

## Next Steps

- [Save Designs](./export-save-publish/save.md) — Save and serialize designs
- [Export Overview](./export-save-publish/export/overview.md) — Export options including archives



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support