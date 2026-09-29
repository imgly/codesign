> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Import Templates](./create-templates/import.md) > [From Scene File](./create-templates/import/from-scene-file.md)

---

CE.SDK lets you load complete design templates from scene files programmatically in a headless environment for automation, batch processing, and server-side template management.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-import-from-scene-file-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-import-from-scene-file-server-js)

Scene files are portable design templates that preserve the entire design structure including blocks, assets, styles, and layout. In a headless environment, we can load and process these templates programmatically.

```typescript file=@cesdk_web_examples/guides-create-templates-import-from-scene-file-server-js/server-js.ts reference-only
/**
 * CE.SDK Node.js Example: Import Templates from Scene Files
 *
 * This example demonstrates:
 * - Loading scenes from scene file URLs
 * - Loading scenes from archive URLs
 * - Applying templates while preserving page dimensions
 * - Understanding the difference between loading and applying templates
 * - Working with scene files programmatically in a headless environment
 */

import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const configuration = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  userId: 'guides-user'
};

async function main() {
  // Initialize the headless creative engine
  const engine = await CreativeEngine.init(configuration);

  try {
    // ===== Example: Load Scene from Archive URL =====
    // This is the recommended approach for loading complete templates
    // with all their assets embedded in a ZIP file

    // Load a complete template from an archive file
    // This loads both the scene structure and all embedded assets
    await engine.scene.load(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );

    // Get information about the loaded scene
    const scene = engine.scene.get();
    console.log(scene);
    if (scene == null) {
      throw new Error('Failed to get scene after loading');
    }

    console.log('Scene loaded successfully:', scene);

    // Get all pages in the scene
    const pages = engine.scene.getPages();
    console.log(`Scene has ${pages.length} page(s)`);

    // Get design unit (Pixel, Millimeter, Inch)
    const designUnit = engine.scene.getDesignUnit();
    console.log('Design unit:', designUnit);

    // Export the scene to a PNG file
    const blob = await engine.block.export(scene, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('output-from-archive.png', buffer);
    console.log('Exported scene to output-from-archive.png');

    // Alternative: Load scene from URL (plain scene file)
    // This loads only the scene structure - assets must be accessible via URLs
    // Uncomment to try:
    // await engine.scene.load(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    // );
    //
    // // Export the loaded scene
    // const sceneFromUrl = engine.scene.get();
    // if (sceneFromUrl) {
    //   const blob2 = await engine.block.export(sceneFromUrl, 'image/png');
    //   const buffer2 = Buffer.from(await blob2.arrayBuffer());
    //   writeFileSync('output-from-url.png', buffer2);
    //   console.log('Exported scene to output-from-url.png');
    // }

    // Alternative: Apply template while preserving current page dimensions
    // This is useful when you want to load template content into an existing scene
    // with specific dimensions
    // Uncomment to try:
    // // First create a scene with specific dimensions
    // engine.scene.create();
    // const page = engine.block.findByType('page')[0];
    // engine.block.setWidth(page, 1920);
    // engine.block.setHeight(page, 1080);
    //
    // // Now apply template - content will be adjusted to fit
    // await engine.scene.applyTemplateFromURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    // );
    //
    // // Export the scene with applied template
    // const appliedScene = engine.scene.get();
    // if (appliedScene) {
    //   const blob3 = await engine.block.export(appliedScene, 'image/png');
    //   const buffer3 = Buffer.from(await blob3.arrayBuffer());
    //   writeFileSync('output-applied-template.png', buffer3);
    //   console.log('Exported scene to output-applied-template.png');
    // }

    console.log('Example completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine when done
    engine.dispose();
  }
}

// Run the example
main().catch((error) => {
  console.error('Failed to run example:', error);
  process.exit(1);
});
```

This guide covers loading scenes from archives, loading from URLs, applying templates while preserving dimensions, and exporting the results.

## Scene File Formats

CE.SDK supports two kinds of scene files for importing templates. Both use the `.imgly` extension and load through the same `engine.scene.load()` call, which detects the kind automatically from the file content; `.scene` and `.zip` files also load.

### Scene Format

Scene files are JSON-based representations of design structures. They reference external assets via URLs, making them lightweight and suitable for database storage. However, the referenced assets must remain accessible at their URLs.

**When to use:**

- Templates stored in databases
- Templates with hosted assets
- Lightweight transmission

### Archive Format

Archive files are self-contained packages that bundle the scene structure with all referenced assets in a zip-compressed file. This makes them portable and suitable for offline use.

**When to use:**

- Template distribution
- Offline-capable templates
- Complete portability
- **Recommended for most use cases**

## Load Scene from Archive

The most common way to load templates is from archive URLs. This method loads both the scene structure and all embedded assets:

```typescript highlight-load-from-archive
// Load a complete template from an archive file
// This loads both the scene structure and all embedded assets
await engine.scene.load(
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
);
```

When you load from an archive:

- The archive is fetched and extracted
- All assets are registered with CE.SDK
- The scene structure is loaded
- Asset paths are automatically resolved

## Load Scene from URL

You can also load plain scene files directly from URLs. This approach requires that all referenced assets remain accessible at their original URLs:

```typescript highlight-load-from-url
// await engine.scene.load(
//   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
// );
//
// // Export the loaded scene
// const sceneFromUrl = engine.scene.get();
// if (sceneFromUrl) {
//   const blob2 = await engine.block.export(sceneFromUrl, 'image/png');
//   const buffer2 = Buffer.from(await blob2.arrayBuffer());
//   writeFileSync('output-from-url.png', buffer2);
//   console.log('Exported scene to output-from-url.png');
// }
```

**Important:** With this method, if asset URLs become unavailable (404 errors, CORS issues, etc.), those assets won't load and your template may appear incomplete.

## Apply Template vs Load Scene

CE.SDK provides two approaches for working with templates, each serving different purposes:

### Load Scene

When you use `engine.scene.load()`, CE.SDK:

- Replaces the entire current scene
- Adopts the template's page dimensions
- Loads all content as-is

This is appropriate when starting a new project from a template.

### Apply Template

When you use `applyTemplateFromURL()` or `applyTemplateFromString()`, CE.SDK:

- Keeps your current page dimensions
- Adjusts template content to fit
- Preserves your scene structure

This is useful when you want to load template content into an existing scene with specific dimensions:

```typescript highlight-apply-template
// // First create a scene with specific dimensions
// engine.scene.create();
// const page = engine.block.findByType('page')[0];
// engine.block.setWidth(page, 1920);
// engine.block.setHeight(page, 1080);
//
// // Now apply template - content will be adjusted to fit
// await engine.scene.applyTemplateFromURL(
//   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene'
// );
//
// // Export the scene with applied template
// const appliedScene = engine.scene.get();
// if (appliedScene) {
//   const blob3 = await engine.block.export(appliedScene, 'image/png');
//   const buffer3 = Buffer.from(await blob3.arrayBuffer());
//   writeFileSync('output-applied-template.png', buffer3);
//   console.log('Exported scene to output-applied-template.png');
// }
```

## Get Scene Information

After loading a template, we can retrieve information about the scene:

```typescript highlight-get-scene-info
    // Get information about the loaded scene
    const scene = engine.scene.get();
    console.log(scene);
    if (scene == null) {
      throw new Error('Failed to get scene after loading');
    }

    console.log('Scene loaded successfully:', scene);

    // Get all pages in the scene
    const pages = engine.scene.getPages();
    console.log(`Scene has ${pages.length} page(s)`);

    // Get design unit (Pixel, Millimeter, Inch)
    const designUnit = engine.scene.getDesignUnit();
    console.log('Design unit:', designUnit);
```

## Export Scene

We can export the loaded scene to various formats:

```typescript highlight-export-scene
// Export the scene to a PNG file
const blob = await engine.block.export(scene, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync('output-from-archive.png', buffer);
console.log('Exported scene to output-from-archive.png');
```

## Error Handling

When loading templates, several issues can occur:

### Network Errors

Template URLs might be unreachable:

```typescript
try {
  await engine.scene.load(templateUrl);
} catch (error) {
  console.error('Failed to load template:', error);
  // Fall back to default template or handle error
}
```

### Invalid Scene Format

The file might not be a valid scene:

```typescript
try {
  await engine.scene.load(sceneUrl);
} catch (error) {
  if (error.message.includes('parse')) {
    console.error('Invalid scene file format');
  }
}
```

### Missing Assets

For plain scene files, the referenced assets must remain accessible at their URLs. If they are unavailable, the scene loads but assets appear as missing on the canvas. Consider using archives to avoid this issue.

## Performance Considerations

### Loading Time

Archive size directly impacts loading time:

- Small archives (\< 1MB): Nearly instant
- Medium archives (1-5MB): 1-2 seconds
- Large archives (> 5MB): Several seconds

For batch processing, consider parallel processing of independent templates.

## CORS Considerations

When loading templates from external URLs in Node.js, most CORS restrictions don't apply. However, ensure the URLs are accessible from your server environment and check for any firewall or network restrictions.

## API Reference

| Method                                   | Description                                               |
| ---------------------------------------- | --------------------------------------------------------- |
| `engine.scene.load()`                    | Loads a scene or archive from a URL or string             |
| `engine.scene.applyTemplateFromURL()`    | Applies a template while preserving page dimensions      |
| `engine.scene.get()`                     | Returns the current scene block ID                        |
| `engine.scene.getPages()`                | Returns all page IDs in the scene                         |
| `engine.scene.getDesignUnit()`           | Returns the measurement unit                              |
| `engine.block.export()`                  | Exports a block to various formats                        |
| `CreativeEngine.init()`                  | Initializes the headless engine                           |
| `engine.dispose()`                       | Disposes the engine and frees resources                   |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support