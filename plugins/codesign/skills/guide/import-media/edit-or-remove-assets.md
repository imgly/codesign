> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Edit or Remove Assets](./import-media/edit-or-remove-assets.md)

---

Manage assets in local asset sources programmatically on the server by updating metadata, removing individual assets, or deleting entire sources.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-edit-or-remove-assets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-edit-or-remove-assets-server-js)

Assets in local sources can be modified or removed programmatically in server-side workflows. CE.SDK provides methods to query, update, and remove assets, as well as entire asset sources. This guide demonstrates how to manage assets in headless mode for batch processing, cleanup tasks, and automated workflows.

```typescript file=@cesdk_web_examples/guides-import-media-edit-or-remove-assets-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit or Remove Assets
 *
 * Demonstrates how to manage assets in local asset sources:
 * - Adding assets to local sources
 * - Finding and querying assets
 * - Updating asset metadata
 * - Removing individual assets
 * - Removing entire asset sources
 * - Handling asset source events
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // ===== Section 1: Create a Local Asset Source =====
  // Create a local asset source to manage images
  engine.asset.addLocalSource('server-uploads');

  // Add sample assets to the source
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Sample Image 1' },
    tags: { en: ['sample', 'image'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-2',
    label: { en: 'Sample Image 2' },
    tags: { en: ['sample', 'photo'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-3',
    label: { en: 'Sample Image 3' },
    tags: { en: ['sample', 'landscape'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created local source with 3 assets');

  // ===== Section 2: Find Assets in a Source =====
  // Query assets from the source to find specific assets
  const result = await engine.asset.findAssets('server-uploads', {
    query: 'sample',
    page: 0,
    perPage: 100
  });

  console.log('Found assets:', result.assets.length);
  for (const asset of result.assets) {
    console.log(`  - ${asset.id}: ${asset.label}`);
  }

  // ===== Section 3: Update Asset Metadata =====
  // To update an asset's metadata, remove it and add an updated version
  engine.asset.removeAssetFromSource('server-uploads', 'asset-1');

  // Add the updated version with new metadata
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Updated Sample Image' }, // New label
    tags: { en: ['sample', 'image', 'updated'] }, // New tags
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Updated asset-1 metadata');

  // ===== Section 4: Remove an Asset from a Source =====
  // Remove a single asset from the source
  // The asset is permanently deleted from the source
  engine.asset.removeAssetFromSource('server-uploads', 'asset-2');
  console.log('✓ Removed asset-2 from server-uploads');

  // Verify the asset was removed
  const afterRemove = await engine.asset.findAssets('server-uploads', {
    page: 0,
    perPage: 100
  });
  console.log('Remaining assets:', afterRemove.assets.length);

  // ===== Section 5: Notify UI of Changes =====
  // After modifying assets, notify any connected UI components
  // In server context, this ensures any connected clients are updated
  engine.asset.assetSourceContentsChanged('server-uploads');
  console.log('✓ Notified UI of source changes');

  // ===== Section 6: Create a Temporary Source =====
  // Create a temporary source that will be removed
  engine.asset.addLocalSource('temp-source');

  engine.asset.addAssetToSource('temp-source', {
    id: 'temp-asset',
    label: { en: 'Temporary Asset' },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created temporary source with 1 asset');

  // ===== Section 7: Remove an Entire Asset Source =====
  // Remove a complete asset source and all its assets
  engine.asset.removeSource('temp-source');
  console.log('✓ Removed temp-source and all its assets');

  // ===== Section 8: Listen to Asset Source Events =====
  // Subscribe to lifecycle events for asset sources
  const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
    console.log(`Event: Source added - ${sourceId}`);
  });

  const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
    console.log(`Event: Source removed - ${sourceId}`);
  });

  const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
    console.log(`Event: Source updated - ${sourceId}`);
  });

  // Demonstrate events
  engine.asset.addLocalSource('event-demo');
  engine.asset.assetSourceContentsChanged('event-demo');
  engine.asset.removeSource('event-demo');

  // Clean up subscriptions
  unsubscribeAdded();
  unsubscribeRemoved();
  unsubscribeUpdated();

  // ===== Add an Image to the Scene =====
  // Use an asset from the remaining source to create a block
  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 400);
  engine.block.setHeight(imageBlock, 300);
  engine.block.setPositionX(imageBlock, 200);
  engine.block.setPositionY(imageBlock, 150);
  engine.block.appendChild(page, imageBlock);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/edit-or-remove-assets-result.png`, buffer);

  console.log('✓ Exported result to output/edit-or-remove-assets-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## Setup

Initialize the headless CE.SDK engine for server-side processing. The engine runs without a UI, making it suitable for automated asset management.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Creating a Local Asset Source

Create a local source and populate it with assets. Use `engine.asset.addLocalSource()` to create the source, then `engine.asset.addAssetToSource()` to add assets.

```typescript highlight=highlight-create-source
  // Create a local asset source to manage images
  engine.asset.addLocalSource('server-uploads');

  // Add sample assets to the source
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Sample Image 1' },
    tags: { en: ['sample', 'image'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-2',
    label: { en: 'Sample Image 2' },
    tags: { en: ['sample', 'photo'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-3',
    label: { en: 'Sample Image 3' },
    tags: { en: ['sample', 'landscape'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created local source with 3 assets');
```

Each asset has a unique `id` for identification, a `label` and `tags` for searchability, and `meta` properties containing the asset `uri` and `blockType`.

## Finding Assets in a Source

Query assets from a source using `engine.asset.findAssets()`. This method supports search queries and pagination for handling large asset collections.

```typescript highlight=highlight-find-assets
  // Query assets from the source to find specific assets
  const result = await engine.asset.findAssets('server-uploads', {
    query: 'sample',
    page: 0,
    perPage: 100
  });

  console.log('Found assets:', result.assets.length);
  for (const asset of result.assets) {
    console.log(`  - ${asset.id}: ${asset.label}`);
  }
```

The `findAssets()` method returns an object with the `assets` array, `total` count, and pagination information. Use this to locate specific assets before modification or removal.

## Updating Asset Metadata

To update an asset's metadata, remove the existing asset and add a new version with the same ID. CE.SDK does not provide a direct update method.

```typescript highlight=highlight-update-metadata
  // To update an asset's metadata, remove it and add an updated version
  engine.asset.removeAssetFromSource('server-uploads', 'asset-1');

  // Add the updated version with new metadata
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Updated Sample Image' }, // New label
    tags: { en: ['sample', 'image', 'updated'] }, // New tags
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Updated asset-1 metadata');
```

This pattern preserves the asset ID while updating labels, tags, URIs, or other metadata. Any references to the asset ID remain valid after the update.

## Removing an Asset from a Source

Remove individual assets using `engine.asset.removeAssetFromSource()`. The asset is permanently deleted from the source.

```typescript highlight=highlight-remove-asset
  // Remove a single asset from the source
  // The asset is permanently deleted from the source
  engine.asset.removeAssetFromSource('server-uploads', 'asset-2');
  console.log('✓ Removed asset-2 from server-uploads');

  // Verify the asset was removed
  const afterRemove = await engine.asset.findAssets('server-uploads', {
    page: 0,
    perPage: 100
  });
  console.log('Remaining assets:', afterRemove.assets.length);
```

In server-side workflows, verify the removal by querying the source again. This is useful for automated cleanup or user-initiated deletions.

## Signaling Source Changes

After modifying assets, you can call `engine.asset.assetSourceContentsChanged()` to signal that the source contents have changed. This is primarily useful when synchronizing state with connected browser clients. For standalone batch processing, this call is optional.

```typescript highlight=highlight-notify-ui
// After modifying assets, notify any connected UI components
// In server context, this ensures any connected clients are updated
engine.asset.assetSourceContentsChanged('server-uploads');
console.log('✓ Notified UI of source changes');
```

## Creating Temporary Sources

Create sources for temporary or session-specific assets that can be removed when no longer needed.

```typescript highlight=highlight-create-temp-source
  // Create a temporary source that will be removed
  engine.asset.addLocalSource('temp-source');

  engine.asset.addAssetToSource('temp-source', {
    id: 'temp-asset',
    label: { en: 'Temporary Asset' },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created temporary source with 1 asset');
```

## Removing an Entire Asset Source

Remove a complete source and all its assets using `engine.asset.removeSource()`. This is useful for cleanup after processing or when a batch operation completes.

```typescript highlight=highlight-remove-source
// Remove a complete asset source and all its assets
engine.asset.removeSource('temp-source');
console.log('✓ Removed temp-source and all its assets');
```

## Listening to Asset Source Events

Subscribe to lifecycle events to track source changes. This is useful for logging, analytics, or triggering downstream processes.

```typescript highlight=highlight-events
  // Subscribe to lifecycle events for asset sources
  const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
    console.log(`Event: Source added - ${sourceId}`);
  });

  const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
    console.log(`Event: Source removed - ${sourceId}`);
  });

  const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
    console.log(`Event: Source updated - ${sourceId}`);
  });

  // Demonstrate events
  engine.asset.addLocalSource('event-demo');
  engine.asset.assetSourceContentsChanged('event-demo');
  engine.asset.removeSource('event-demo');

  // Clean up subscriptions
  unsubscribeAdded();
  unsubscribeRemoved();
  unsubscribeUpdated();
```

Each subscription returns an unsubscribe function. Call it when monitoring is no longer needed.

## Exporting Results

After processing, export the scene to verify your changes or produce output files.

```typescript highlight=highlight-export
  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/edit-or-remove-assets-result.png`, buffer);

  console.log('✓ Exported result to output/edit-or-remove-assets-result.png');
```

## Cleanup

Always dispose the engine when processing is complete to free resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Batch Processing Patterns

For processing multiple designs or assets:

1. **Initialize once**: Create the engine once and reuse it for multiple operations
2. **Process in batches**: Group related operations to minimize API calls
3. **Handle errors gracefully**: Wrap operations in try-catch to continue processing after individual failures
4. **Dispose at the end**: Only dispose the engine after all processing is complete

## Best Practices

- **Query before modifying**: Verify assets exist before attempting removal to avoid silent failures
- **Log operations**: Record asset additions, updates, and removals for debugging and audit trails
- **Use unique IDs**: Generate consistent, unique asset IDs for reliable lookups
- **Clean up temporary sources**: Remove sources created for batch operations when finished
- **Handle concurrent access**: In multi-process environments, coordinate asset modifications to prevent conflicts

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Asset not found | ID mismatch or already removed | Query the source first to verify asset exists |
| Operation fails silently | Source is not a local source | Only local sources support `removeAssetFromSource()` |
| Memory issues | Engine not disposed | Always call `engine.dispose()` in a finally block |
| Event handlers not firing | Subscription created after operation | Subscribe before performing operations |

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.asset.findAssets()` | Asset Discovery | Query assets from a source with filtering and pagination |
| `engine.asset.addAssetToSource()` | Asset Lifecycle | Add or update an asset in a local source |
| `engine.asset.removeAssetFromSource()` | Asset Lifecycle | Remove a single asset from a local source |
| `engine.asset.removeSource()` | Source Management | Remove an entire asset source and all its assets |
| `engine.asset.assetSourceContentsChanged()` | UI Notification | Notify connected clients that source contents changed |
| `engine.asset.onAssetSourceAdded()` | Event Subscriptions | Subscribe to source addition events |
| `engine.asset.onAssetSourceRemoved()` | Event Subscriptions | Subscribe to source removal events |
| `engine.asset.onAssetSourceUpdated()` | Event Subscriptions | Subscribe to source content change events |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support