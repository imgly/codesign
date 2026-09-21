> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Load a Scene](./open-the-editor/load-scene.md)

---

Load previously saved scenes to resume editing or modify existing designs.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-load-scene-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-load-scene-server-js)

Scene files contain layout, properties, and asset references but not the assets themselves. When loading a scene, ensure referenced asset URLs remain accessible. For self-contained packages with bundled assets, use archives instead.

```typescript file=@cesdk_web_examples/guides-open-the-editor-load-scene-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

async function promptUser(question: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.load(sceneUrl);

    console.log('Scene loaded successfully from URL.');

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.setDropShadowEnabled(textBlocks[0], true);
      console.log('Drop shadow added to text block.');
    }

    const shouldExport = await promptUser('Export the scene to PNG? (y/n): ');
    if (shouldExport) {
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const pages = engine.block.findByType('page');
      if (pages.length > 0) {
        const blob = await engine.block.export(pages[0], {
          mimeType: 'image/png'
        });
        const buffer = Buffer.from(await blob.arrayBuffer());
        writeFileSync(`${outputDir}/scene-result.png`, buffer);
        console.log('Exported scene to output/scene-result.png');
      }
    } else {
      console.log('Export skipped.');
    }
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to load scenes from URLs, strings, and blobs, and how to modify loaded scenes.

## Load a Scene from URL

The most common approach is loading scenes from a remote URL. The engine replaces any existing scene with the loaded one.

```typescript highlight-load-from-url
const sceneUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
await engine.scene.load(sceneUrl);
```

The URL should point to a valid scene file reachable from your server. Scene files use the `.imgly` extension; `.scene` and `.zip` files also load. `engine.scene.load()` detects the file kind automatically from its content, so the same call opens plain scenes and archives alike. This method is ideal for loading scenes from a CDN or your backend API.

## Load a Scene from String

When scenes are stored in a database or retrieved from local storage, use `engine.scene.load()`. This accepts the scene data as a string, typically from a previous `engine.scene.saveToString()` call.

```typescript
const sceneContent = await fetchFromDatabase();
await engine.scene.load(sceneContent);
```

This approach is useful for restoring saved user designs, loading scenes from your backend API, or working with scenes stored in databases.

## Load a Scene from Blob

For file uploads or blob storage, convert the blob to a string first, then load with `engine.scene.load()`. Use the blob's `text()` method to extract the scene content.

```typescript
import { readFile } from 'fs/promises';

const sceneBlob = new Blob([await readFile('./my-design.imgly')]);
const sceneContent = await sceneBlob.text();
await engine.scene.load(sceneContent);
```

## Modify a Loaded Scene

After loading, the scene is immediately editable. Use `engine.block.findByType()` or `engine.block.findByKind()` to locate elements, then modify them with block APIs.

```typescript highlight-modify-scene
const textBlocks = engine.block.findByType('text');
if (textBlocks.length > 0) {
  engine.block.setDropShadowEnabled(textBlocks[0], true);
  console.log('Drop shadow added to text block.');
}
```

Common modifications include updating text content, swapping images, and adjusting visual properties like drop shadows.

## Scene Files vs Archives

Plain scene files are lightweight and store only references to assets. If asset URLs become unavailable, the scene won't display correctly. For self-contained packages with bundled assets, use archives. Both kinds share the `.imgly` extension (`.scene` and `.zip` files also load), and the same `engine.scene.load()` call opens either kind — the format is detected automatically from the content. See the [Import from Archive](./open-the-editor/import-design/from-archive.md) guide for details.

## Troubleshooting

### Scene Fails to Load

- Verify the URL is accessible and returns a valid scene file
- Check the scene URL is reachable from your server
- Ensure the scene format is compatible with your CE.SDK version

### Assets Not Displaying After Load

- Scene files store asset references as URLs; ensure those URLs remain accessible
- Use archives for self-contained scenes with bundled assets
- Configure a URI resolver if assets are hosted on different servers

### String Content Is Invalid

- Ensure the string is the exact output from `engine.scene.saveToString()`
- Verify the string wasn't modified or truncated during storage

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.load()` | Load a scene or archive from a URL or string |
| `engine.scene.saveToString()` | Save scene to string for storage |
| `engine.block.findByType()` | Find blocks by type |
| `engine.block.findByKind()` | Find blocks by kind |
| `engine.block.setDropShadowEnabled()` | Enable or disable drop shadow on a block |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support