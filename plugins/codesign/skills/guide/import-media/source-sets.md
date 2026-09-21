> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Source Sets](./import-media/source-sets.md)

---

Configure source sets for images and videos so CE.SDK automatically selects the optimal resolution for editing previews and exports.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-import-media-source-sets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-import-media-source-sets-server-js)

Source sets allow you to provide multiple versions of the same asset at different resolutions. CE.SDK automatically selects the most appropriate source based on the current drawing size in screen pixels. This improves performance by loading smaller images for mobile previews while ensuring high-quality assets are used for final exports.

```typescript file=@cesdk_web_examples/guides-import-media-source-sets-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // ===== Section 1: Setting a Source Set on an Image Fill =====
    // Create a graphic block with an image fill
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));

    // Create an image fill and configure source set with multiple resolutions
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      // Placeholder images display their dimensions
      { uri: 'https://placehold.co/256x256/png', width: 256, height: 256 },
      { uri: 'https://placehold.co/512x512/png', width: 512, height: 512 },
      { uri: 'https://placehold.co/1024x1024/png', width: 1024, height: 1024 }
    ]);
    engine.block.setFill(imageBlock, imageFill);

    // Position and size the block
    engine.block.setWidth(imageBlock, 300);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 50);
    engine.block.appendChild(page, imageBlock);

    // ===== Section 2: Querying and Modifying Source Sets =====
    // Query the existing source set
    const sourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Current source set:', sourceSet);

    // Add a new high-resolution source dynamically
    // The dimensions are determined automatically from the image
    await engine.block.addImageFileURIToSourceSet(
      imageFill,
      'fill/image/sourceSet',
      'https://placehold.co/2048x2048/png'
    );

    // Verify the source was added
    const updatedSourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Updated source set with 2048px source:', updatedSourceSet);

    // ===== Section 3: Using Source Sets in Asset Definitions =====
    // Define an asset with a source set in its payload
    const assetDefinition = {
      id: 'multi-resolution-image',
      label: { en: 'Multi-Resolution Image' },
      meta: {
        kind: 'image',
        fillType: '//ly.img.ubq/fill/image'
      },
      payload: {
        sourceSet: [
          {
            uri: 'https://placehold.co/256x256/4a90d9/white/png?text=256',
            width: 256,
            height: 256
          },
          {
            uri: 'https://placehold.co/512x512/4a90d9/white/png?text=512',
            width: 512,
            height: 512
          },
          {
            uri: 'https://placehold.co/1024x1024/4a90d9/white/png?text=1024',
            width: 1024,
            height: 1024
          }
        ]
      }
    };

    // Register the asset with a local source
    await engine.asset.addLocalSource('my-images');
    engine.asset.addAssetToSource('my-images', assetDefinition);

    // Find the asset from the source for applying
    const findResult = await engine.asset.findAssets('my-images', {
      page: 0,
      perPage: 1
    });
    const assetResult = findResult.assets[0];

    // Apply the asset - the source set is automatically configured
    const assetBlock = await engine.asset.defaultApplyAsset(assetResult);
    if (assetBlock === undefined) {
      throw new Error('Failed to apply asset');
    }

    // Verify the source set was applied to the block's fill
    const assetFill = engine.block.getFill(assetBlock);
    const assetSourceSet = engine.block.getSourceSet(
      assetFill,
      'fill/image/sourceSet'
    );
    console.log('Asset source set applied:', assetSourceSet);

    // Position the asset block
    engine.block.setWidth(assetBlock, 300);
    engine.block.setHeight(assetBlock, 300);
    engine.block.setPositionX(assetBlock, 400);
    engine.block.setPositionY(assetBlock, 50);

    // ===== Section 4: Video Source Sets =====
    // Create a graphic block with a video fill
    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));

    // Create a video fill and configure source set
    const videoFill = engine.block.createFill('video');
    engine.block.setSourceSet(videoFill, 'fill/video/sourceSet', [
      {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
        width: 1920,
        height: 1080
      }
    ]);
    engine.block.setFill(videoBlock, videoFill);

    // Add a higher resolution source dynamically
    await engine.block.addVideoFileURIToSourceSet(
      videoFill,
      'fill/video/sourceSet',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
    );

    // Position and size the video block
    engine.block.setWidth(videoBlock, 400);
    engine.block.setHeight(videoBlock, 225);
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 400);
    engine.block.appendChild(page, videoBlock);

    // ===== Section 5: Video Preview Quality Settings =====
    // Force low-quality video preview during editing for better performance
    // Export will still use the highest quality source available
    engine.editor.setSettingBool('features/forceLowQualityVideoPreview', true);

    // Export the page to verify the result
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output');
    }

    writeFileSync('./output/source-sets-result.png', buffer);
    console.log('Exported to ./output/source-sets-result.png');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to configure source sets programmatically, define them in asset definitions, and optimize video preview performance.

## How Source Set Selection Works

When rendering content, the engine calculates the current drawing size in pixels. If a source set exists, the engine selects the source with the closest size exceeding the drawing size. If no source set is defined, the full resolution image is downscaled to a maximum 4096px edge length (configurable via the `maxImageSize` setting).

Source sets are also evaluated during export, ensuring the best matching asset is used for the target export resolution.

## Setting a Source Set on an Image Fill

We configure source sets for image fills using `engine.block.setSourceSet()`. Each source entry requires a `uri`, `width`, and `height`. The engine uses these dimensions to select the appropriate source.

> **Caution:** CE.SDK provides two ways to set image content: the `fill/image/imageFileURI` property for a single image, or source sets for multiple resolutions. Use one or the other—setting both on the same fill leads to undefined behavior.

```typescript highlight=highlight-set-source-set
    // Create a graphic block with an image fill
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));

    // Create an image fill and configure source set with multiple resolutions
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      // Placeholder images display their dimensions
      { uri: 'https://placehold.co/256x256/png', width: 256, height: 256 },
      { uri: 'https://placehold.co/512x512/png', width: 512, height: 512 },
      { uri: 'https://placehold.co/1024x1024/png', width: 1024, height: 1024 }
    ]);
    engine.block.setFill(imageBlock, imageFill);

    // Position and size the block
    engine.block.setWidth(imageBlock, 300);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 50);
    engine.block.appendChild(page, imageBlock);
```

## Querying and Modifying Source Sets

You can retrieve existing source sets with `engine.block.getSourceSet()`. To add sources dynamically, use `engine.block.addImageFileURIToSourceSet()`, which loads the image to determine dimensions automatically.

```typescript highlight=highlight-query-source-set
    // Query the existing source set
    const sourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Current source set:', sourceSet);

    // Add a new high-resolution source dynamically
    // The dimensions are determined automatically from the image
    await engine.block.addImageFileURIToSourceSet(
      imageFill,
      'fill/image/sourceSet',
      'https://placehold.co/2048x2048/png'
    );

    // Verify the source was added
    const updatedSourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Updated source set with 2048px source:', updatedSourceSet);
```

## Using Source Sets in Asset Definitions

When defining assets for the asset library, you can include source sets in the `payload.sourceSet` field. When the asset is applied with `engine.asset.defaultApplyAsset()`, the source set is automatically configured on the resulting block's fill.

```typescript highlight=highlight-asset-source-set
    // Define an asset with a source set in its payload
    const assetDefinition = {
      id: 'multi-resolution-image',
      label: { en: 'Multi-Resolution Image' },
      meta: {
        kind: 'image',
        fillType: '//ly.img.ubq/fill/image'
      },
      payload: {
        sourceSet: [
          {
            uri: 'https://placehold.co/256x256/4a90d9/white/png?text=256',
            width: 256,
            height: 256
          },
          {
            uri: 'https://placehold.co/512x512/4a90d9/white/png?text=512',
            width: 512,
            height: 512
          },
          {
            uri: 'https://placehold.co/1024x1024/4a90d9/white/png?text=1024',
            width: 1024,
            height: 1024
          }
        ]
      }
    };

    // Register the asset with a local source
    await engine.asset.addLocalSource('my-images');
    engine.asset.addAssetToSource('my-images', assetDefinition);

    // Find the asset from the source for applying
    const findResult = await engine.asset.findAssets('my-images', {
      page: 0,
      perPage: 1
    });
    const assetResult = findResult.assets[0];

    // Apply the asset - the source set is automatically configured
    const assetBlock = await engine.asset.defaultApplyAsset(assetResult);
    if (assetBlock === undefined) {
      throw new Error('Failed to apply asset');
    }

    // Verify the source set was applied to the block's fill
    const assetFill = engine.block.getFill(assetBlock);
    const assetSourceSet = engine.block.getSourceSet(
      assetFill,
      'fill/image/sourceSet'
    );
    console.log('Asset source set applied:', assetSourceSet);

    // Position the asset block
    engine.block.setWidth(assetBlock, 300);
    engine.block.setHeight(assetBlock, 300);
    engine.block.setPositionX(assetBlock, 400);
    engine.block.setPositionY(assetBlock, 50);
```

## Video Source Sets

Source sets work with video fills using the `fill/video/sourceSet` property. The engine selects the appropriate video source based on the current drawing size. Use `engine.block.addVideoFileURIToSourceSet()` to add video sources dynamically.

```typescript highlight=highlight-video-source-set
    // Create a graphic block with a video fill
    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));

    // Create a video fill and configure source set
    const videoFill = engine.block.createFill('video');
    engine.block.setSourceSet(videoFill, 'fill/video/sourceSet', [
      {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
        width: 1920,
        height: 1080
      }
    ]);
    engine.block.setFill(videoBlock, videoFill);

    // Add a higher resolution source dynamically
    await engine.block.addVideoFileURIToSourceSet(
      videoFill,
      'fill/video/sourceSet',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
    );

    // Position and size the video block
    engine.block.setWidth(videoBlock, 400);
    engine.block.setHeight(videoBlock, 225);
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 400);
    engine.block.appendChild(page, videoBlock);
```

## Video Preview Quality Settings

For performance optimization during editing, you can force the engine to use the smallest available source for video previews. Export operations will still use the highest quality source.

```typescript highlight=highlight-video-preview-settings
// Force low-quality video preview during editing for better performance
// Export will still use the highest quality source available
engine.editor.setSettingBool('features/forceLowQualityVideoPreview', true);
```

The `features/forceLowQualityVideoPreview` setting forces previews to use the smallest source during editing. By default, this is disabled, and the engine uses the source closest to the current drawing size.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong resolution selected | Ensure source dimensions accurately reflect actual image/video dimensions |
| Performance issues with large assets | Add smaller resolution sources to your source set for editing preview |
| Export quality issues | Verify that your source set includes a high-resolution source for the target export size |
| Source set not applied from asset | Ensure `payload.sourceSet` is defined with valid `uri`, `width`, and `height` entries |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setSourceSet()` | Set a source set for a block property |
| `engine.block.getSourceSet()` | Get the source set from a block property |
| `engine.block.addImageFileURIToSourceSet()` | Add an image to an existing source set (async) |
| `engine.block.addVideoFileURIToSourceSet()` | Add a video to an existing source set (async) |
| `engine.block.createFill('image')` | Create an image fill |
| `engine.block.createFill('video')` | Create a video fill |
| `engine.block.setFill()` | Apply a fill to a block |
| `engine.block.getFill()` | Get the fill from a block |
| `engine.asset.addLocalSource()` | Create a local asset source |
| `engine.asset.addAssetToSource()` | Add an asset with source set to a source |
| `engine.asset.defaultApplyAsset()` | Apply an asset, configuring its source set |
| `engine.editor.setSettingBool()` | Configure editor settings like video preview quality |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support