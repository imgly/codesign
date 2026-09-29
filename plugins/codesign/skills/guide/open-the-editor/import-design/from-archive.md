> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md) > [From Archive](./open-the-editor/import-design/from-archive.md)

---

Load archived CE.SDK scenes in headless Node.js environments. Archives bundle design structure with all fonts, images, and assets in a single portable file.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-import-design-from-archive-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-import-design-from-archive-server-js)

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-from-archive-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Import Design from Archive
 *
 * Demonstrates different methods to import archive files in headless mode:
 * - Loading archives from URLs (remote storage)
 * - Loading archives from the filesystem using file:// URLs
 * - Understanding archive portability
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create output directory for results
  mkdirSync('output', { recursive: true });

  // ========================================
  // Demonstration: Create Demo Archive
  // ========================================

  // First, create a demo archive to work with for the examples below
  // In production, you would load existing archives from storage

  // Start by creating a scene from an image (no preexisting scene needed)
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  await engine.scene.createFromImage(imageUrl);

  // Save this scene as an archive
  const demoArchiveBlob = await engine.scene.saveToArchive();

  // Save the archive to filesystem for demonstration
  // Use the `.imgly` extension when persisting saved files
  const archiveBuffer = Buffer.from(await demoArchiveBlob.arrayBuffer());
  const archivePath = path.resolve('output/demo-archive.imgly');
  writeFileSync(archivePath, archiveBuffer);

  console.log('✓ Created demo archive: output/demo-archive.imgly');

  // ========================================
  // Demonstration 1: Load Archive from Filesystem
  // ========================================

  // In Node.js environments, load archives from the filesystem using file:// URLs
  // This is common for batch processing or server-side workflows

  // Convert filesystem path to file:// URL
  const archiveFileUrl = `file://${archivePath}`;

  // Load the archive using the file URL
  await engine.scene.load(archiveFileUrl);

  console.log('✓ Archive loaded from filesystem successfully');

  // ========================================
  // Demonstration 2: Load Archive from Remote URL
  // ========================================

  // When you have an archive hosted on a remote server, CDN, or cloud storage,
  // load it directly using its URL

  const loadArchiveFromUrl = async (url: string): Promise<void> => {
    try {
      await engine.scene.load(url);
      console.log('✓ Archive loaded from URL successfully');
    } catch (error) {
      console.error('Failed to load archive from URL:', error);
      throw error;
    }
  };

  // Demonstrate loading from the local file URL we created earlier
  await loadArchiveFromUrl(archiveFileUrl);

  // ========================================
  // Demonstration 3: Verify Archive Contents
  // ========================================

  // After loading an archive, verify the scene and its contents

  // Find all blocks in the loaded scene
  const pages = engine.block.findByType('page');
  const graphics = engine.block.findByType('graphic');
  const texts = engine.block.findByType('text');

  console.log('\nArchive contents:');
  console.log(`  Pages: ${pages.length}`);
  console.log(`  Graphics: ${graphics.length}`);
  console.log(`  Text blocks: ${texts.length}`);

  // All assets are bundled, so no external URLs are needed
  // This makes archives ideal for portability

  // ========================================
  // Demonstration 4: Modify and Re-export
  // ========================================

  // Modify the loaded scene and export it
  const page = pages[0];
  if (page) {
    // Example: Adjust properties of text blocks
    texts.forEach((textBlock) => {
      // Make all text slightly larger
      const currentSize = engine.block.getFloat(textBlock, 'text/fontSize');
      engine.block.setFloat(textBlock, 'text/fontSize', currentSize * 1.1);
    });

    // Export the modified scene
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 800,
      targetHeight: 600
    });
    const exportBuffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/modified-archive-result.png', exportBuffer);

    console.log(
      '✓ Modified scene exported to: output/modified-archive-result.png'
    );
  }

  // ========================================
  // Demonstration 5: Create New Archive
  // ========================================

  // Save the modified scene as a new archive
  const newArchiveBlob = await engine.scene.saveToArchive();
  const newArchiveBuffer = Buffer.from(await newArchiveBlob.arrayBuffer());
  writeFileSync('output/modified-archive.imgly', newArchiveBuffer);

  console.log('✓ New archive saved to: output/modified-archive.imgly');

  // Archives are perfect for:
  // - Sharing designs between systems
  // - Offline editing workflows
  // - Backup and versioning
  // - Ensuring all assets are available

  console.log('\n✓ Import from Archive guide completed successfully!');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

Archives solve the portability problem inherent in scene files. While scene files reference assets by URL, archives package everything together in a single `.imgly` file (the `.zip` extension also works). If asset URLs become unavailable, scene files fail to load properly. Archives avoid this issue by bundling all fonts, images, videos, and other resources directly within the archive, making them self-contained and reliable across different environments.

This guide covers how to load archived scenes from URLs, work with local files, and process archive content in Node.js workflows.

## Understanding CE.SDK Archives

CE.SDK archives are zip-compressed files created with `engine.scene.saveToArchive()` that contain both the scene structure and all referenced assets. Save them with the `.imgly` extension; the `.zip` extension also works. The scene file uses relative paths to reference bundled assets, eliminating the need for external URLs to remain accessible.

Archives contain a predictable directory structure:

- `scene.json` - Scene structure, layout, and element properties
- `images/` - Image assets referenced in the scene
- `fonts/` - Font files used by text blocks
- `videos/` - Video content referenced in the scene
- `audio/` - Audio tracks and sound effects

The scene file references these assets with relative URIs like `./images/photo-abc123.jpg`, ensuring they're always accessible from within the archive.

## Load Archive from Filesystem

In Node.js environments, you often load archives from the filesystem. This is common for batch processing, server-side workflows, and automation tasks.

```typescript highlight-load-from-filesystem
  // In Node.js environments, load archives from the filesystem using file:// URLs
  // This is common for batch processing or server-side workflows

  // Convert filesystem path to file:// URL
  const archiveFileUrl = `file://${archivePath}`;

  // Load the archive using the file URL
  await engine.scene.load(archiveFileUrl);

  console.log('✓ Archive loaded from filesystem successfully');
```

Convert filesystem paths to `file://` URLs and load using `engine.scene.load()`. The loaded scene replaces the current scene in the engine and becomes immediately available for processing.

> **Note:** **Unified API**: Both Node.js and browser environments use `engine.scene.load(url)` to load archives. In Node.js, convert local file paths to `file://` URLs. In browsers, you can use HTTP/HTTPS URLs or object URLs created from Blobs.

## Load Archive from Remote URL

When you have an archive hosted on a remote server, CDN, or cloud storage, load it directly using its URL. The example shows a reusable function that handles URL loading with proper error handling.

```typescript highlight-load-from-url
  // When you have an archive hosted on a remote server, CDN, or cloud storage,
  // load it directly using its URL

  const loadArchiveFromUrl = async (url: string): Promise<void> => {
    try {
      await engine.scene.load(url);
      console.log('✓ Archive loaded from URL successfully');
    } catch (error) {
      console.error('Failed to load archive from URL:', error);
      throw error;
    }
  };

  // Demonstrate loading from the local file URL we created earlier
  await loadArchiveFromUrl(archiveFileUrl);
```

This pattern is useful for:

- **CDN integration** - Load archives from content delivery networks
- **Cloud storage** - Retrieve archives from S3, GCS, or Azure Blob Storage
- **API responses** - Load archives from backend services
- **Remote processing** - Process archives hosted on external servers

## Verify Archive Contents

After loading an archive, verify the scene and its contents to ensure all expected elements are present.

```typescript highlight-verify-contents
  // After loading an archive, verify the scene and its contents

  // Find all blocks in the loaded scene
  const pages = engine.block.findByType('page');
  const graphics = engine.block.findByType('graphic');
  const texts = engine.block.findByType('text');

  console.log('\nArchive contents:');
  console.log(`  Pages: ${pages.length}`);
  console.log(`  Graphics: ${graphics.length}`);
  console.log(`  Text blocks: ${texts.length}`);

  // All assets are bundled, so no external URLs are needed
  // This makes archives ideal for portability
```

All blocks and assets from the archive are restored and accessible through the standard block API. Use `engine.block.findByType()` to locate specific block types and verify the scene structure.

## Modify and Re-export

Modify loaded archive scenes and export them for further processing or storage.

```typescript highlight-modify-and-export
  // Modify the loaded scene and export it
  const page = pages[0];
  if (page) {
    // Example: Adjust properties of text blocks
    texts.forEach((textBlock) => {
      // Make all text slightly larger
      const currentSize = engine.block.getFloat(textBlock, 'text/fontSize');
      engine.block.setFloat(textBlock, 'text/fontSize', currentSize * 1.1);
    });

    // Export the modified scene
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 800,
      targetHeight: 600
    });
    const exportBuffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/modified-archive-result.png', exportBuffer);

    console.log(
      '✓ Modified scene exported to: output/modified-archive-result.png'
    );
  }
```

The loaded scene is fully editable. Apply transformations, modify properties, add or remove blocks, and export the results in any supported format (PNG, JPEG, PDF, video).

## Create New Archives

Save modified scenes as new archives to preserve all changes and bundled assets.

```typescript highlight-create-archive
  // Save the modified scene as a new archive
  const newArchiveBlob = await engine.scene.saveToArchive();
  const newArchiveBuffer = Buffer.from(await newArchiveBlob.arrayBuffer());
  writeFileSync('output/modified-archive.imgly', newArchiveBuffer);

  console.log('✓ New archive saved to: output/modified-archive.imgly');

  // Archives are perfect for:
  // - Sharing designs between systems
  // - Offline editing workflows
  // - Backup and versioning
  // - Ensuring all assets are available
```

Archives are perfect for:

- **Sharing designs between systems** - Move designs across environments without URL dependencies
- **Offline workflows** - Process designs without network connectivity
- **Backup and versioning** - Store complete design snapshots
- **Ensuring asset availability** - Guarantee all resources are available

## Archive Contents and Structure

Archives use standard ZIP compression with a specific internal structure that makes them self-contained. The scene file references assets using relative paths instead of absolute URLs.

This self-contained structure provides several benefits:

- **No external dependencies** - All assets are bundled, so external URLs don't need to remain accessible
- **Portable across environments** - Archives work identically whether loaded in development, staging, or production
- **Offline support** - Archives can be loaded without network connectivity
- **Version control friendly** - Entire designs can be versioned as single files
- **Simplified sharing** - Send one file instead of coordinating multiple asset URLs

The relative URI pattern (`./images/photo-123.jpg`) ensures assets are resolved from within the archive regardless of where the archive is hosted or stored.

## Archives vs Scene Files

CE.SDK provides two save formats that handle assets differently. Both are saved with the `.imgly` extension and open through the same `engine.scene.load()` call, which detects the kind automatically from the file content; the `.scene` and `.zip` extensions also work.

**Scene Files** are lightweight JSON-based files that store design structure, layout, and properties. When you save a scene, it stores the design structure, all block properties, and URL references to images, fonts, and other resources. Assets are referenced by their original URLs.

Use scene files when:

- Assets remain accessible at their original URLs
- You want minimal file sizes for faster transfers
- Assets are managed separately (CDN, asset management system)
- You're working in a stable environment with reliable asset URLs

**Archives** bundle the scene file with all referenced assets into a single zip-compressed package. When you create an archive, CE.SDK packages the scene structure along with all images, fonts, videos, and other resources. Assets in archived scenes use relative paths (like `./images/photo-123.jpg`) instead of external URLs, making them portable across different environments.

Use archives when:

- You need to share designs across systems without URL dependencies
- Assets might become unavailable at their original locations
- You're moving designs between environments (development → production)
- You need offline support or long-term storage
- Portability and self-containment are priorities

> **Note:** **Key Trade-off**: Scene files are lightweight but depend on external asset URLs. Archives are larger but self-contained and portable. Choose based on your reliability and portability requirements.

For more details on creating archives, see the [Save a Scene](./export-save-publish/save.md) guide.

## Asset Availability and Portability

Archives solve the fundamental asset availability problem that affects scene files. When you load a scene file, all referenced assets must remain accessible at their original URLs. If an image was located at `https://example.com/image.jpg` when the scene was saved, it must still be accessible there when loaded later.

This creates several challenges:

- **URL changes** - Moving assets to different servers or CDNs breaks scene file references
- **Access control** - Changing authentication or permissions makes assets unavailable
- **Resource deletion** - Removing assets from storage breaks scene loading
- **Cross-environment issues** - Development URLs don't work in production and vice versa

Archives eliminate these issues by bundling all assets within the archive itself. The scene uses relative paths (`./images/photo.jpg`) that always resolve to the bundled assets, regardless of where the archive is stored or loaded.

## Performance Considerations

### File Size and Transfer

Archives bundle all assets, making them significantly larger than scene files:

- **Scene files**: 10-100KB (structure only, no assets)
- **Archives**: 1MB-100MB+ (depends on bundled assets)

Large archives require more time to:

- Read from disk or download from storage
- Extract and decompress
- Load into memory

### Memory Usage

Archives extract their contents into memory during loading. Large archives with high-resolution images or videos consume significant memory. Consider:

- Processing archives sequentially in batch workflows to manage memory
- Limiting concurrent archive loads
- Monitoring memory usage during processing

### Storage and Backup

Archives are ideal for long-term storage and backup:

- Single-file archives are easier to manage than multi-file scene + assets
- Archives can be versioned as complete snapshots
- Compressed ZIP format reduces storage costs compared to uncompressed assets

## Troubleshooting

**Archive fails to load**

When archive loading fails, common causes include:

- **Corrupted ZIP file** - Verify the archive is a valid ZIP file
- **Incompatible format** - Ensure the archive was created by CE.SDK, not manually assembled
- **Missing scene file** - Archives must contain a valid scene.json file
- **Unsupported assets** - Some asset formats might not be supported

**Archive loads but assets are missing**

If the scene loads but displays missing assets:

- Verify all asset files are present in the archive ZIP
- Check that asset paths in scene.json match bundled file locations
- Ensure the archive structure follows CE.SDK conventions

**Memory errors during loading**

When loading very large archives causes memory errors:

- Reduce archive size by compressing or downscaling bundled assets
- Increase available memory for the Node.js process
- Process archives sequentially rather than concurrently

## API Reference

| Method                                   | Purpose                                        |
| ---------------------------------------- | ---------------------------------------------- |
| `engine.scene.load(url)`                 | Load scene or archive from URL (file://, http://, https://, or object URL) or string |
| `engine.scene.saveToArchive()`           | Create archive with scene and bundled assets   |
| `engine.block.findByType(type)`          | Find blocks in loaded scene                    |
| `engine.block.export(block, options)`    | Export blocks from loaded archive              |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support