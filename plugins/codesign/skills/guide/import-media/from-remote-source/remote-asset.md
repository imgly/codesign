> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [Import Remote Asset](./import-media/from-remote-source/remote-asset.md)

---

Load asset definitions from remote JSON files hosted on CDNs or servers into CE.SDK's asset library.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-from-remote-source-remote-asset-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-from-remote-source-remote-asset-server-js)

Remote asset loading enables you to host asset definitions on a CDN or server and load them dynamically into CE.SDK. This approach separates asset management from your application code, allowing you to update available assets without deploying new app versions. CE.SDK provides `engine.asset.addLocalAssetSourceFromJSONURI()` for loading from URLs and `engine.asset.addLocalAssetSourceFromJSONString()` for loading from JSON content you already have.

```typescript file=@cesdk_web_examples/guides-import-media-from-remote-source-remote-asset-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables from .env file
config();

async function main() {
  // Initialize the headless Creative Engine for server-side processing
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load remote assets from a JSON manifest URL
    // The parent directory of the JSON file is used as the base path for relative URLs
    const audioSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/content.json'
    );
    console.log('Loaded audio assets from:', audioSourceId);

    // Load image assets from another remote JSON manifest
    const imageSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/content.json'
    );
    console.log('Loaded image assets from:', imageSourceId);

    // Load assets from a JSON string when content is already available
    const customAssetJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my.custom.assets',
      assets: [
        {
          id: 'sample_image_1',
          label: { en: 'Sample Image 1' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        },
        {
          id: 'sample_image_2',
          label: { en: 'Sample Image 2' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const customSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(customAssetJSON);
    console.log('Created custom asset source:', customSourceId);

    // When loading from string, you can specify a custom base path
    // for resolving {{base_url}} placeholders in the manifest
    const assetsWithBasePath = JSON.stringify({
      version: '2.0.0',
      id: 'my.cdn.assets',
      assets: [
        {
          id: 'cdn_image',
          label: { en: 'CDN Image' },
          meta: {
            uri: '{{base_url}}/sample_1.jpg',
            thumbUri: '{{base_url}}/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const cdnSourceId = await engine.asset.addLocalAssetSourceFromJSONString(
      assetsWithBasePath,
      'https://img.ly/static/ubq_samples/'
    );
    console.log('Created CDN asset source with custom base path:', cdnSourceId);

    // Verify loaded assets by querying the asset source
    const audioAssets = await engine.asset.findAssets(audioSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${audioAssets.total} audio assets`);

    const customAssets = await engine.asset.findAssets(customSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${customAssets.total} custom assets`);

    // Create a scene and apply an asset
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Apply an asset from the loaded source to the scene
    const imageAssets = await engine.asset.findAssets(imageSourceId, {
      page: 0,
      perPage: 10
    });
    if (imageAssets.assets.length > 0) {
      const asset = imageAssets.assets[0];
      await engine.asset.apply(imageSourceId, asset);
      console.log('Applied asset:', asset.id);
    }

    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    console.log('All registered asset sources:', allSources);

    // Remove an asset source when no longer needed
    engine.asset.removeSource(cdnSourceId);
    console.log('Removed asset source:', cdnSourceId);

    // Export the scene to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `${outputDir}/remote-asset-result.png`;
    writeFileSync(outputPath, buffer);
    console.log(`Exported scene to: ${outputPath}`);

    console.log('\nRemote asset loading completed successfully!');
  } finally {
    // Always dispose of the engine to release resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to load remote asset manifests, customize base URLs for relative paths, and verify loaded assets.

## Setup

We start by initializing the headless Creative Engine for server-side processing.

```typescript highlight=highlight-setup
// Initialize the headless Creative Engine for server-side processing
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});
```

## JSON Manifest Structure

The JSON manifest defines assets with a version, source ID, and assets array. Each asset includes an ID, localized labels, and metadata containing URIs and block types.

```json
{
  "version": "2.0.0",
  "id": "my.custom.assets",
  "assets": [
    {
      "id": "sample_image",
      "label": { "en": "Sample Image" },
      "meta": {
        "uri": "{{base_url}}/images/sample.jpg",
        "thumbUri": "{{base_url}}/thumbnails/sample.jpg",
        "blockType": "//ly.img.ubq/graphic",
        "mimeType": "image/jpeg"
      }
    }
  ]
}
```

The `version` field specifies the manifest format version. The `id` field becomes the asset source identifier. Each asset in the `assets` array includes metadata for the full-size image URI, thumbnail URI, block type, and MIME type. The `{{base_url}}` placeholder gets resolved based on the JSON file location or a custom base path you provide.

## Loading Assets from a Remote URL

Call `engine.asset.addLocalAssetSourceFromJSONURI()` with the JSON URL. The method returns the source ID from the manifest's `id` field. CE.SDK uses the parent directory as the base path for resolving `{{base_url}}` placeholders.

```typescript highlight=highlight-load-from-uri
// Load remote assets from a JSON manifest URL
// The parent directory of the JSON file is used as the base path for relative URLs
const audioSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/content.json'
);
console.log('Loaded audio assets from:', audioSourceId);
```

## Loading Assets from a JSON String

Call `engine.asset.addLocalAssetSourceFromJSONString()` when you have the JSON content available, for example from an API response or embedded configuration.

```typescript highlight=highlight-load-from-string
    // Load assets from a JSON string when content is already available
    const customAssetJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my.custom.assets',
      assets: [
        {
          id: 'sample_image_1',
          label: { en: 'Sample Image 1' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        },
        {
          id: 'sample_image_2',
          label: { en: 'Sample Image 2' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const customSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(customAssetJSON);
    console.log('Created custom asset source:', customSourceId);
```

## Customizing the Base Path

When loading from a string, pass an optional base path as the second parameter to resolve `{{base_url}}` placeholders in the manifest.

```typescript highlight=highlight-load-with-base-path
    // When loading from string, you can specify a custom base path
    // for resolving {{base_url}} placeholders in the manifest
    const assetsWithBasePath = JSON.stringify({
      version: '2.0.0',
      id: 'my.cdn.assets',
      assets: [
        {
          id: 'cdn_image',
          label: { en: 'CDN Image' },
          meta: {
            uri: '{{base_url}}/sample_1.jpg',
            thumbUri: '{{base_url}}/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const cdnSourceId = await engine.asset.addLocalAssetSourceFromJSONString(
      assetsWithBasePath,
      'https://img.ly/static/ubq_samples/'
    );
    console.log('Created CDN asset source with custom base path:', cdnSourceId);
```

## Verifying Loaded Assets

Call `engine.asset.findAssets()` with the source ID to query loaded assets. This confirms the manifest was parsed correctly and assets are available.

```typescript highlight=highlight-verify-assets
    // Verify loaded assets by querying the asset source
    const audioAssets = await engine.asset.findAssets(audioSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${audioAssets.total} audio assets`);

    const customAssets = await engine.asset.findAssets(customSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${customAssets.total} custom assets`);
```

## Applying Remote Assets

Use `engine.asset.apply()` to add an asset from a loaded source to the scene. The engine downloads the actual media files when needed.

```typescript highlight=highlight-apply-asset
// Apply an asset from the loaded source to the scene
const imageAssets = await engine.asset.findAssets(imageSourceId, {
  page: 0,
  perPage: 10
});
if (imageAssets.assets.length > 0) {
  const asset = imageAssets.assets[0];
  await engine.asset.apply(imageSourceId, asset);
  console.log('Applied asset:', asset.id);
}
```

## Listing Asset Sources

Call `engine.asset.findAllSources()` to list all registered asset sources.

```typescript highlight=highlight-list-sources
// List all registered asset sources
const allSources = engine.asset.findAllSources();
console.log('All registered asset sources:', allSources);
```

## Removing Asset Sources

Call `engine.asset.removeSource()` to remove a loaded asset source when it's no longer needed. This cleans up the source and its assets from memory.

```typescript highlight=highlight-remove-source
// Remove an asset source when no longer needed
engine.asset.removeSource(cdnSourceId);
console.log('Removed asset source:', cdnSourceId);
```

## Exporting the Result

Export the scene to a file after applying assets.

```typescript highlight=highlight-export
    // Export the scene to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `${outputDir}/remote-asset-result.png`;
    writeFileSync(outputPath, buffer);
    console.log(`Exported scene to: ${outputPath}`);
```

## Cleanup

Always dispose of the engine to release resources when done.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to release resources
engine.dispose();
```

## Error Handling

Wrap calls in try-catch blocks to handle network errors, invalid JSON, or missing files. Both methods throw errors on failure.

Common issues include:

- **Network failures**: Check connectivity and URL accessibility
- **Invalid JSON**: Verify manifest structure matches the expected format
- **Unreachable asset URLs**: Verify the asset host is reachable from your server environment
- **404 errors**: Check URL accessibility and ensure the JSON file exists

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.asset.addLocalAssetSourceFromJSONURI()` | Load asset definitions from a remote JSON URL |
| `engine.asset.addLocalAssetSourceFromJSONString()` | Load asset definitions from a JSON string |
| `engine.asset.findAssets()` | Query assets from a loaded source |
| `engine.asset.apply()` | Apply an asset to the scene |
| `engine.asset.removeSource()` | Remove an asset source |
| `engine.asset.findAllSources()` | List all registered asset sources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support