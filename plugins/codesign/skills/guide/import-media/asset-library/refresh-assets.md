> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Learn how to refresh asset sources when external changes occur outside CE.SDK in a server environment.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-asset-library-refresh-assets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-asset-library-refresh-assets-server-js)

CE.SDK automatically refreshes the asset library for built-in operations like uploads and deletions. However, when assets are modified outside of CE.SDK—through a custom CMS, cloud storage, or third-party upload widget—the asset source won't reflect these changes automatically. Use `engine.asset.assetSourceContentsChanged()` to notify the engine and trigger a refresh.

```typescript file=@cesdk_web_examples/guides-import-media-asset-library-refresh-assets-server-js/server-js.ts reference-only
import CreativeEngine, { AssetsQueryResult } from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Refresh Assets
 *
 * Demonstrates how to refresh asset sources after external changes:
 * - Creating custom asset sources
 * - Simulating external uploads
 * - Triggering asset refresh with assetSourceContentsChanged()
 * - Handling external modifications and deletions
 */

// Simulated external data store (represents Cloudinary, S3, or external CMS)
const externalAssets = [
  {
    id: 'cloud-1',
    url: 'https://img.ly/static/ubq_samples/sample_1.jpg',
    name: 'Mountain Landscape'
  },
  {
    id: 'cloud-2',
    url: 'https://img.ly/static/ubq_samples/sample_2.jpg',
    name: 'Ocean Sunset'
  }
];

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

  // ===== Section 1: Register a Custom Asset Source =====
  // Register a custom asset source that fetches from an external system
  // This source will need manual refresh when external changes occur
  engine.asset.addSource({
    id: 'cloudinary-images',
    async findAssets(queryData): Promise<AssetsQueryResult> {
      // Fetch current assets from external data store
      const filteredAssets = externalAssets.filter(
        (asset) =>
          !queryData.query ||
          asset.name.toLowerCase().includes(queryData.query.toLowerCase())
      );

      return {
        assets: filteredAssets.map((asset) => ({
          id: asset.id,
          label: asset.name,
          meta: {
            uri: asset.url,
            thumbUri: asset.url,
            blockType: '//ly.img.ubq/graphic'
          }
        })),
        total: filteredAssets.length,
        currentPage: queryData.page,
        nextPage: undefined
      };
    }
  });

  console.log('✓ Created custom asset source: cloudinary-images');

  // ===== Section 2: Query Initial Assets =====
  const initialAssets = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Initial assets: ${initialAssets.assets.length}`);
  for (const asset of initialAssets.assets) {
    console.log(`  - ${asset.id}: ${asset.label}`);
  }

  // ===== Section 3: Simulate External Upload =====
  // Simulate an external upload (e.g., from Cloudinary upload widget)
  // In a real application, this would be triggered by webhook or polling
  const newAsset = {
    id: 'cloud-3',
    url: 'https://img.ly/static/ubq_samples/sample_3.jpg',
    name: 'Forest Path'
  };
  externalAssets.push(newAsset);

  // Notify CE.SDK that the source contents have changed
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External upload complete, asset source refreshed');

  // Verify the new asset is available
  const afterUpload = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Assets after upload: ${afterUpload.assets.length}`);

  // ===== Section 4: Simulate External Modification =====
  // Simulate backend modifications (e.g., CMS updates, API changes)
  externalAssets[0] = {
    ...externalAssets[0],
    name: 'Modified: Mountain Landscape'
  };

  // Refresh the asset library to reflect changes
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External modification complete, asset source refreshed');

  // Verify the modification
  const afterModification = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(
    `First asset after modification: ${afterModification.assets[0].label}`
  );

  // ===== Section 5: Simulate External Deletion =====
  // Simulate asset deletion from external system
  const removed = externalAssets.pop();
  console.log(`Removed asset from external store: ${removed?.name}`);

  // Refresh the asset library to reflect the deletion
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External deletion complete, asset source refreshed');

  // Verify the deletion
  const afterDeletion = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Assets after deletion: ${afterDeletion.assets.length}`);

  // ===== Add an Image to the Scene =====
  // Use an asset from the source to create a block
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
  writeFileSync(`${outputDir}/refresh-assets-result.png`, buffer);

  console.log('✓ Exported result to output/refresh-assets-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers when manual refresh is needed, how to trigger refreshes programmatically, and integration patterns for server-side asset management.

## When to Use Asset Refresh

CE.SDK handles asset refresh automatically for built-in operations. Manual refresh is required when external systems modify asset source content.

**Automatic refresh** (no action needed):

- Uploads using built-in sources like `ly.img.upload.*`
- Deletions through default upload handlers
- Modifications made through CE.SDK's asset APIs

**Manual refresh required**:

- External uploads via third-party services (Cloudinary, S3)
- Backend modifications through CMS or API updates
- Sync with external storage (Azure Blob, Google Cloud Storage)
- Real-time collaboration when another process adds assets

## Registering a Custom Asset Source

Before refreshing assets, you need a custom asset source that fetches from your external system. The `findAssets` method queries your external data store each time assets are requested.

```typescript highlight-custom-source
  // Register a custom asset source that fetches from an external system
  // This source will need manual refresh when external changes occur
  engine.asset.addSource({
    id: 'cloudinary-images',
    async findAssets(queryData): Promise<AssetsQueryResult> {
      // Fetch current assets from external data store
      const filteredAssets = externalAssets.filter(
        (asset) =>
          !queryData.query ||
          asset.name.toLowerCase().includes(queryData.query.toLowerCase())
      );

      return {
        assets: filteredAssets.map((asset) => ({
          id: asset.id,
          label: asset.name,
          meta: {
            uri: asset.url,
            thumbUri: asset.url,
            blockType: '//ly.img.ubq/graphic'
          }
        })),
        total: filteredAssets.length,
        currentPage: queryData.page,
        nextPage: undefined
      };
    }
  });

  console.log('✓ Created custom asset source: cloudinary-images');
```

This custom source fetches assets from an external data store (simulating Cloudinary, S3, or a CMS). When the external store changes, subsequent queries won't reflect updates until you call `assetSourceContentsChanged()`.

## Refreshing After External Uploads

When your backend receives new uploads from a third-party service, call `assetSourceContentsChanged()` to notify CE.SDK that the source contents have changed.

```typescript highlight-external-upload
  // Simulate an external upload (e.g., from Cloudinary upload widget)
  // In a real application, this would be triggered by webhook or polling
  const newAsset = {
    id: 'cloud-3',
    url: 'https://img.ly/static/ubq_samples/sample_3.jpg',
    name: 'Forest Path'
  };
  externalAssets.push(newAsset);

  // Notify CE.SDK that the source contents have changed
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External upload complete, asset source refreshed');
```

The key is calling `assetSourceContentsChanged('cloudinary-images')` after the external upload completes. This tells CE.SDK to re-fetch assets on the next query.

## Refreshing After External Modifications

When your backend modifies asset metadata—renaming files, updating tags, or changing thumbnails—call `assetSourceContentsChanged()` to sync the asset source.

```typescript highlight-external-modification
  // Simulate backend modifications (e.g., CMS updates, API changes)
  externalAssets[0] = {
    ...externalAssets[0],
    name: 'Modified: Mountain Landscape'
  };

  // Refresh the asset library to reflect changes
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External modification complete, asset source refreshed');
```

Any modification to assets in your external store requires a refresh. Without calling `assetSourceContentsChanged()`, subsequent queries may return stale data.

## Refreshing After External Deletions

When assets are deleted from your external system, call `assetSourceContentsChanged()` to ensure queries no longer return deleted assets.

```typescript highlight-external-deletion
  // Simulate asset deletion from external system
  const removed = externalAssets.pop();
  console.log(`Removed asset from external store: ${removed?.name}`);

  // Refresh the asset library to reflect the deletion
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External deletion complete, asset source refreshed');
```

The refresh ensures deleted assets no longer appear in query results. If you skip this step, the engine may reference assets that no longer exist.

## Integration Patterns

### Webhook Handler

Handle webhooks from external services to trigger refreshes:

```typescript
app.post('/webhooks/cloudinary', (req, res) => {
  const { notification_type, public_id } = req.body;

  if (notification_type === 'upload' || notification_type === 'delete') {
    engine.asset.assetSourceContentsChanged('cloudinary-images');
  }

  res.status(200).send('OK');
});
```

### Scheduled Sync

For periodic synchronization with external systems:

```typescript
import cron from 'node-cron';

cron.schedule('*/5 * * * *', () => {
  // Refresh every 5 minutes
  engine.asset.assetSourceContentsChanged('external-assets');
});
```

### Event-Driven Updates

Listen for database changes to trigger refreshes:

```typescript
database.on('assets:changed', (sourceId) => {
  engine.asset.assetSourceContentsChanged(sourceId);
});
```

## Troubleshooting

**Assets not updating**:

Verify the source ID passed to `assetSourceContentsChanged()` matches the ID used when registering the source with `addSource()`. Source IDs are case-sensitive.

**Refresh not triggering**:

Ensure you call `assetSourceContentsChanged()` after the external operation completes. If called before the upload finishes, `findAssets()` may return stale data.

**Stale assets in queries**:

Check that your `findAssets` implementation fetches fresh data on each call. Avoid caching responses unless you invalidate the cache when calling `assetSourceContentsChanged()`.

**Memory management**:

Always dispose the engine when done processing to free resources. Use try/finally blocks to ensure cleanup happens even when errors occur.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.asset.assetSourceContentsChanged(sourceID)` | Asset API | Notify engine that asset source contents changed |
| `engine.asset.addSource(source)` | Asset API | Register custom asset source |
| `engine.asset.findAssets(sourceID, query)` | Asset API | Query assets from a source |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support