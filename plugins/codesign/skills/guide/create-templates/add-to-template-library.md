> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Add to Template Library](./create-templates/add-to-template-library.md)

---

Create a template library where templates can be stored, managed, and applied programmatically in a headless environment.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-add-to-template-library-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-add-to-template-library-server-js)

Templates in CE.SDK are stored and accessed through the asset system. A template library is a local asset source configured to hold and serve template assets, enabling server-side workflows to manage templates programmatically.

```typescript file=@cesdk_web_examples/guides-create-templates-add-to-template-library-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import * as readline from 'readline';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * CE.SDK Server Guide: Add to Template Library
 *
 * This example demonstrates how to create a template library by:
 * 1. Creating a local asset source for templates
 * 2. Adding templates with metadata (label, thumbnail, URI)
 * 3. Saving scenes as templates
 * 4. Managing templates programmatically
 */

// Helper function to prompt user for input
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Create a local asset source for templates
  engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
    // Apply the selected template to the current scene
    await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
    return undefined;
  });

  // Add a template to the source with metadata
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-postcard',
    label: { en: 'Postcard' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
    }
  });

  // Add more templates
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-business-card',
    label: { en: 'Business Card' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_business_card_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_business_card_1.jpg'
    }
  });

  engine.asset.addAssetToSource('my-templates', {
    id: 'template-social-media',
    label: { en: 'Social Media Post' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_post_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_instagram_post_1.jpg'
    }
  });

  // Load the first template
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Ask user how to save the template
  console.log('\nHow would you like to save the template?');
  console.log('1. String format (lightweight, references remote assets)');
  console.log('2. Archive format (self-contained with bundled assets)');
  console.log('3. Cancel');

  const choice = await prompt('\nEnter your choice (1-3): ');

  if (choice === '1') {
    mkdirSync('output', { recursive: true });
    const templateString = await engine.scene.saveToString();
    writeFileSync('output/saved-scene.imgly', templateString);
    console.log('Template saved to output/saved-scene.imgly');
  } else if (choice === '2') {
    mkdirSync('output', { recursive: true });
    const templateBlob = await engine.scene.saveToArchive();
    const buffer = Buffer.from(await templateBlob.arrayBuffer());
    writeFileSync('output/saved-scene-archive.imgly', buffer);
    console.log('Template saved to output/saved-scene-archive.imgly');
  } else {
    console.log('Save operation cancelled.');
  }

  // List all registered asset sources
  const sources = engine.asset.findAllSources();
  console.log('Registered sources:', sources);

  // Notify that source contents have changed (useful after dynamic updates)
  engine.asset.assetSourceContentsChanged('my-templates');

  // Query templates from the source
  const queryResult = await engine.asset.findAssets('my-templates', {
    page: 0,
    perPage: 10
  });
  console.log('Templates in library:', queryResult.total);

  // Remove a template from the source
  engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
  console.log('Removed template-social-media from library');

  console.log('Template library operations completed successfully');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to save scenes as templates, create a template asset source, add templates with metadata, and manage templates in headless server environments.

## Saving Templates

Scenes can be exported in two formats for use as templates:

- **String format**: Use `engine.scene.saveToString()` to serialize the scene to a base64 string. This lightweight format references remote assets by URL and is ideal for templates where assets are hosted on a CDN.

- **Archive format**: Use `engine.scene.saveToArchive()` to bundle all assets together. This returns a Blob containing a self-contained template, making it portable without external dependencies.

```typescript highlight=highlight-save-template
  // Ask user how to save the template
  console.log('\nHow would you like to save the template?');
  console.log('1. String format (lightweight, references remote assets)');
  console.log('2. Archive format (self-contained with bundled assets)');
  console.log('3. Cancel');

  const choice = await prompt('\nEnter your choice (1-3): ');

  if (choice === '1') {
    mkdirSync('output', { recursive: true });
    const templateString = await engine.scene.saveToString();
    writeFileSync('output/saved-scene.imgly', templateString);
    console.log('Template saved to output/saved-scene.imgly');
  } else if (choice === '2') {
    mkdirSync('output', { recursive: true });
    const templateBlob = await engine.scene.saveToArchive();
    const buffer = Buffer.from(await templateBlob.arrayBuffer());
    writeFileSync('output/saved-scene-archive.imgly', buffer);
    console.log('Template saved to output/saved-scene-archive.imgly');
  } else {
    console.log('Save operation cancelled.');
  }
```

## Creating a Template Asset Source

Register a local asset source using `engine.asset.addLocalSource()` with an ID and `applyAsset` callback.

```typescript highlight=highlight-create-source
// Create a local asset source for templates
engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
  // Apply the selected template to the current scene
  await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
  return undefined;
});
```

The `applyAsset` callback receives the selected asset and determines how to apply it. We use `engine.scene.applyTemplateFromURL()` to load the template from the asset's `meta.uri` property. The template is applied to the current scene, adjusting content to fit the existing page dimensions.

## Adding Templates to the Source

Register templates using `engine.asset.addAssetToSource()` with an asset definition that includes metadata for display and loading.

```typescript highlight=highlight-add-templates
// Add a template to the source with metadata
engine.asset.addAssetToSource('my-templates', {
  id: 'template-postcard',
  label: { en: 'Postcard' },
  meta: {
    uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
    thumbUri:
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
  }
});
```

Each template asset requires:

- `id` - Unique identifier for the template
- `label` - Localized display name shown in the template library
- `meta.uri` - URL to the `.scene` file that will be loaded when the template is applied
- `meta.thumbUri` - URL to a preview image for client-side display

## Managing Templates

After the initial setup, you can manage templates programmatically.

```typescript highlight=highlight-manage-templates
  // List all registered asset sources
  const sources = engine.asset.findAllSources();
  console.log('Registered sources:', sources);

  // Notify that source contents have changed (useful after dynamic updates)
  engine.asset.assetSourceContentsChanged('my-templates');

  // Query templates from the source
  const queryResult = await engine.asset.findAssets('my-templates', {
    page: 0,
    perPage: 10
  });
  console.log('Templates in library:', queryResult.total);

  // Remove a template from the source
  engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
  console.log('Removed template-social-media from library');
```

Use `engine.asset.findAllSources()` to list registered sources. Query templates with `engine.asset.findAssets()` to retrieve template metadata. When you add or remove templates from a source, call `engine.asset.assetSourceContentsChanged()` to notify any connected clients. To remove a template, use `engine.asset.removeAssetFromSource()`.

## Cleanup

Always dispose the engine when finished to free system resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Template fails to load | Incorrect URI in asset meta | Verify the `uri` points to a valid `.scene` file |
| Apply callback not triggered | `applyAsset` not defined in `addLocalSource` | Provide the callback when creating the source |
| Empty query results | Templates not added before querying | Ensure `addAssetToSource` is called before `findAssets` |

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource()` | Register a local asset source with an apply callback |
| `engine.asset.addAssetToSource()` | Add an asset to a registered source |
| `engine.asset.removeAssetFromSource()` | Remove an asset from a source by ID |
| `engine.asset.assetSourceContentsChanged()` | Notify that source contents changed |
| `engine.scene.saveToString()` | Serialize scene to base64 string format |
| `engine.scene.saveToArchive()` | Save scene as self-contained archive blob |
| `engine.scene.applyTemplateFromURL()` | Apply a template to the current scene |
| `engine.dispose()` | Release engine resources when finished |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support