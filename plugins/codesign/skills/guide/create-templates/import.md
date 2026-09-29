> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Import Templates](./create-templates/import.md)

---

Load design templates into CE.SDK from archive URLs, scene URLs, and serialized strings.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-import-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-import-server-js)

Templates are pre-designed scenes that provide starting points for user projects. CE.SDK supports loading templates from archive URLs with bundled assets, remote scene URLs, or serialized strings stored in files.

```typescript file=@cesdk_web_examples/guides-create-templates-import-server-js/server-js.ts reference-only
/**
 * CE.SDK Node.js Example: Import Templates
 *
 * Demonstrates loading templates from different sources:
 * - Archive URLs (.imgly files with bundled assets; legacy .zip still loads)
 * - Scene URLs (.imgly files; legacy .scene still loads)
 * - Serialized strings (file content)
 */

import CreativeEngine from '@cesdk/node';
import { readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';
import * as readline from 'readline';

// Load environment variables from .env file
config();

// Template sources
const fashionAdArchiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';

const postcardSceneUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

// For loading from a string: read the scene file content
const businessCardSceneString = readFileSync(
  './assets/business-card.scene',
  'utf-8'
);

// Prompt user to select import method
async function selectImportMethod(): Promise<string> {
  const methods = [
    { key: '1', label: 'Import Archive (fashion-ad.zip)', value: 'archive' },
    { key: '2', label: 'Import URL (postcard.scene)', value: 'url' },
    { key: '3', label: 'Import String (business-card.scene)', value: 'string' }
  ];

  console.log('\nSelect import method:');
  methods.forEach((m) => console.log(`  ${m.key}) ${m.label}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter choice (1-3): ', (answer) => {
      rl.close();
      const selected = methods.find((m) => m.key === answer.trim());
      if (!selected) {
        console.error(
          `\n✗ Invalid choice: "${answer.trim()}". Please enter 1-3.`
        );
        process.exit(1);
      }
      resolve(selected.value);
    });
  });
}

const configuration = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  userId: 'guides-user'
};

async function main() {
  // Get user's import method selection
  const method = await selectImportMethod();
  console.log('');

  const engine = await CreativeEngine.init(configuration);

  try {
    let templateName = '';

    if (method === 'archive') {
      // Load template from archive URL (bundled assets)
      await engine.scene.load(fashionAdArchiveUrl);
      templateName = 'fashion-ad';
    }

    if (method === 'url') {
      // Load template from a scene URL
      await engine.scene.load(postcardSceneUrl);
      templateName = 'postcard';
    }

    if (method === 'string') {
      // Load template from serialized string
      await engine.scene.load(businessCardSceneString);
      templateName = 'business-card';
    }

    // Verify the loaded scene
    const scene = engine.scene.get();
    if (scene == null) {
      throw new Error('Failed to load scene');
    }

    const pages = engine.scene.getPages();
    // eslint-disable-next-line no-console
    console.log(`Loaded ${templateName} template with ${pages.length} page(s)`);

    // Export the loaded template to a PNG file
    const blob = await engine.block.export(scene, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `output-${templateName}.png`;
    writeFileSync(outputPath, buffer);
    // eslint-disable-next-line no-console
    console.log(`Exported template to ${outputPath}`);

    // eslint-disable-next-line no-console
    console.log('Example completed successfully!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine when done
    engine.dispose();
  }
}

// Run the example
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to run example:', error);
  process.exit(1);
});
```

This guide covers how to load templates from archives, URLs, and strings, and export the result.

## Load from Archive

Load a template from an archive URL using `engine.scene.load()`. Archives are `.imgly` files (the `.zip` extension also works) that bundle the scene with all its assets, making them portable and self-contained. The engine detects the file kind automatically from its content.

```typescript highlight=highlight-load-from-archive
// Load template from archive URL (bundled assets)
await engine.scene.load(fashionAdArchiveUrl);
```

## Load from URL

Load a template from a remote scene file URL using `engine.scene.load()`. The scene file (`.imgly` or `.scene`) is a JSON-based format that references assets via URLs.

```typescript highlight=highlight-load-from-url
// Load template from a scene URL
await engine.scene.load(postcardSceneUrl);
```

## Load from String

For templates stored in databases or files, load from a serialized string using `engine.scene.load()`.

```typescript highlight=highlight-load-from-string
// Load template from serialized string
await engine.scene.load(businessCardSceneString);
```

This method works with content previously saved using `engine.scene.saveToString()`.

## Working with the Loaded Scene

After loading a template, verify the scene loaded correctly and inspect its contents.

### Verify the Scene

Use `engine.scene.get()` to retrieve the scene block and `engine.scene.getPages()` to inspect its pages.

```typescript highlight=highlight-get-scene
    // Verify the loaded scene
    const scene = engine.scene.get();
    if (scene == null) {
      throw new Error('Failed to load scene');
    }

    const pages = engine.scene.getPages();
```

## Cleanup

Always dispose the engine when finished to release resources.

```typescript highlight=highlight-cleanup
// Always dispose the engine when done
engine.dispose();
```



---

## Related Pages

- [Import Templates from Scene Files](./create-templates/import/from-scene-file.md) - Load and import templates from scene files programmatically using CE.SDK in Node.js for headless automation


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support