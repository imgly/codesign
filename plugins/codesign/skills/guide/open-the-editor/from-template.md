> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From Template](./open-the-editor/from-template.md)

---

Load pre-designed templates to give users a professional starting point instead of a blank canvas.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-from-template-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-from-template-server-js)

Templates provide consistent layouts and styling that users can customize for their needs. CE.SDK supports loading templates from remote URLs, local strings, and applying template content to existing scenes while preserving page dimensions.

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-template-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.load(templateUrl);

    console.log('Template loaded successfully.');

    // Load scene from string (file read)
    const sceneFilePath = join(__dirname, 'assets', 'business-card.scene');
    const sceneString = readFileSync(sceneFilePath, 'utf-8');
    await engine.scene.load(sceneString);

    console.log('Scene loaded from string.');

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
    }

    const shouldExport = await promptUser(
      'Export the template to PNG? (y/n): '
    );
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
        writeFileSync(`${outputDir}/template-result.png`, buffer);
        console.log('Exported template to output/template-result.png');
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

This guide covers how to load templates from URLs and strings, modify content, and export the result.

## Load a Template from URL

The most common approach is loading templates from a remote URL. The engine replaces any existing scene with the loaded template.

```typescript highlight-load-from-url
const templateUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
await engine.scene.load(templateUrl);
```

The template URL should point to a valid `.scene` file hosted on a server.

## Load a Template from String

When templates are stored in a database or file system, use `engine.scene.load()`. This accepts the scene data as a string.

```typescript highlight-load-from-string
await engine.scene.load(sceneString);
```

This approach is useful for loading templates from your backend storage, restoring saved user designs, or working with templates stored in databases.

## Modify Template Content

After loading a template, customize the content using block APIs. Find elements and modify them as needed.

```typescript highlight-modify-content
const textBlocks = engine.block.findByType('text');
if (textBlocks.length > 0) {
  engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
}
```

Common modifications include:

- **Updating text content**: `engine.block.replaceText(blockId, 'New text')`
- **Swapping images**: `engine.block.setString(fill, 'fill/image/imageFileURI', newUrl)`
- **Adjusting colors**: `engine.block.setColor(blockId, 'fill/solid/color', newColor)`

## Export with User Confirmation

For interactive CLI applications, prompt the user before exporting the result.

```typescript highlight-prompt-helper
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
```

Then use the prompt to confirm export:

```typescript highlight-export-with-prompt
    const shouldExport = await promptUser(
      'Export the template to PNG? (y/n): '
    );
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
        writeFileSync(`${outputDir}/template-result.png`, buffer);
        console.log('Exported template to output/template-result.png');
      }
    } else {
      console.log('Export skipped.');
    }
```

## Troubleshooting

### Template Fails to Load

- Verify the template URL is accessible and returns a valid scene file
- Ensure the template format is compatible with your CE.SDK version
- Check network connectivity from your server

### Assets Not Displaying After Load

- Template scene files store asset references as URLs; ensure those URLs remain accessible
- Use archives (`.zip`) for self-contained templates with bundled assets
- Configure a URI resolver if assets are hosted on different servers

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.load()` | Load a scene from a remote URL or a serialized string |
| `engine.scene.applyTemplateFromURL()` | Apply template to existing scene from URL |
| `engine.scene.applyTemplateFromString()` | Apply template to existing scene from string |
| `engine.block.findByType()` | Find blocks by type |
| `engine.block.replaceText()` | Replace text content in a text block |
| `engine.block.export()` | Export a block to image or PDF |

## Next Steps

- [Load a Scene](./open-the-editor/load-scene.md) - Load saved scenes from various sources
- [Save a Design](./export-save-publish/save.md) - Save your customized template
- [Import a Design](./open-the-editor/import-design.md) - Import designs from archives or other formats



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support