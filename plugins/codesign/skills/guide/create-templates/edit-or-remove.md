> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Edit or Remove Templates](./create-templates/edit-or-remove.md)

---

Modify existing templates and manage template lifecycle in headless Node.js environments using CE.SDK Engine.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-edit-or-remove-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-edit-or-remove-server-js)

Templates evolve as designs change. You might need to update branding, fix content errors, or remove outdated templates from your library. CE.SDK Engine provides APIs for adding, editing, and removing templates from asset sources in server-side automation workflows.

```typescript file=@cesdk_web_examples/guides-create-templates-edit-or-remove-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit or Remove Templates
 *
 * Demonstrates template management workflows in headless Node.js:
 * - Adding templates to local asset sources with thumbnails
 * - Editing template content and updating in asset sources
 * - Removing templates from asset sources
 * - Saving updated templates with new content
 */

// Helper function to prompt user for input
function prompt(question: string): Promise<string> {
  const rl = createInterface({
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

// Helper function to generate SVG thumbnail with text label
function generateThumbnail(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
    <rect width="200" height="150" fill="#f5f5f5"/>
    <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" fill="#333">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a local asset source for managing templates
  engine.asset.addLocalSource('my-templates');

  // Create the template with text blocks
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Original Template');
  engine.block.setFloat(titleBlock, 'text/fontSize', 14);
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);

  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(subtitleBlock, 'Server-side template management');
  engine.block.setFloat(subtitleBlock, 'text/fontSize', 10);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);

  // Position text blocks centered on the page
  const pageWidth = 1200;
  const pageHeight = 600;
  const titleWidth = engine.block.getFrameWidth(titleBlock);
  const titleHeight = engine.block.getFrameHeight(titleBlock);
  engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleBlock, pageHeight / 2 - titleHeight - 20);

  const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
  engine.block.setPositionY(subtitleBlock, pageHeight / 2 + 20);

  // Save template content and add to asset source
  const originalContent = await engine.scene.saveToString();
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-original',
    label: { en: 'Original Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${originalContent}`,
      thumbUri: generateThumbnail('Original Template')
    }
  });

  // eslint-disable-next-line no-console
  console.log('Original template added to asset source');

  // Edit the template content and save as a new version
  engine.block.replaceText(titleBlock, 'Updated Template');
  engine.block.replaceText(subtitleBlock, 'This template was edited and saved');

  const updatedContent = await engine.scene.saveToString();
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${updatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });

  // Re-center after modification
  const newTitleWidth = engine.block.getFrameWidth(titleBlock);
  const newTitleHeight = engine.block.getFrameHeight(titleBlock);
  engine.block.setPositionX(titleBlock, (pageWidth - newTitleWidth) / 2);
  engine.block.setPositionY(titleBlock, pageHeight / 2 - newTitleHeight - 20);

  const newSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(subtitleBlock, (pageWidth - newSubtitleWidth) / 2);

  // eslint-disable-next-line no-console
  console.log('Updated template added to asset source');

  // Add a temporary template to demonstrate removal
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-temporary',
    label: { en: 'Temporary Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${originalContent}`,
      thumbUri: generateThumbnail('Temporary Template')
    }
  });

  // Remove the temporary template from the asset source
  engine.asset.removeAssetFromSource('my-templates', 'template-temporary');

  // eslint-disable-next-line no-console
  console.log('Temporary template removed from asset source');

  // Update an existing template by removing and re-adding with same ID
  engine.block.replaceText(subtitleBlock, 'Updated again with new content');
  const reUpdatedContent = await engine.scene.saveToString();

  engine.asset.removeAssetFromSource('my-templates', 'template-updated');
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });

  // Notify that the asset source contents have changed
  engine.asset.assetSourceContentsChanged('my-templates');

  // Re-center subtitle after final update
  const reUpdatedSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(
    subtitleBlock,
    (pageWidth - reUpdatedSubtitleWidth) / 2
  );

  // eslint-disable-next-line no-console
  console.log('Template updated in asset source');

  // Export templates based on user choice
  // eslint-disable-next-line no-console
  console.log('\n--- Template Export ---');
  // eslint-disable-next-line no-console
  console.log('1. Original Template');
  // eslint-disable-next-line no-console
  console.log('2. Updated Template');
  // eslint-disable-next-line no-console
  console.log('3. Both Templates');

  const choice = await prompt(
    '\nWhich template would you like to export? (1/2/3): '
  );

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Load and export based on user choice
  if (choice === '1' || choice === '3') {
    await engine.scene.load(originalContent);
    const originalBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    const originalBuffer = Buffer.from(await originalBlob.arrayBuffer());
    writeFileSync(`${outputDir}/template-original.png`, originalBuffer);
    // eslint-disable-next-line no-console
    console.log('✓ Exported: output/template-original.png');
  }

  if (choice === '2' || choice === '3') {
    await engine.scene.load(reUpdatedContent);
    const updatedBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    const updatedBuffer = Buffer.from(await updatedBlob.arrayBuffer());
    writeFileSync(`${outputDir}/template-updated.png`, updatedBuffer);
    // eslint-disable-next-line no-console
    console.log('✓ Exported: output/template-updated.png');
  }

  if (choice !== '1' && choice !== '2' && choice !== '3') {
    // eslint-disable-next-line no-console
    console.log('Invalid choice. Exporting both templates by default.');
    await engine.scene.load(originalContent);
    const originalBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    writeFileSync(
      `${outputDir}/template-original.png`,
      Buffer.from(await originalBlob.arrayBuffer())
    );

    await engine.scene.load(reUpdatedContent);
    const updatedBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    writeFileSync(
      `${outputDir}/template-updated.png`,
      Buffer.from(await updatedBlob.arrayBuffer())
    );
    // eslint-disable-next-line no-console
    console.log('✓ Exported both templates to output/');
  }
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to add templates to asset sources, edit template content, remove templates, and save updated versions.

## Adding Templates

First, create a local asset source to store your templates:

```typescript highlight-create-source
// Create a local asset source for managing templates
engine.asset.addLocalSource('my-templates');
```

Next, create your template content using block APIs:

```typescript highlight-create-template
  // Create the template with text blocks
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Original Template');
  engine.block.setFloat(titleBlock, 'text/fontSize', 14);
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);

  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(subtitleBlock, 'Server-side template management');
  engine.block.setFloat(subtitleBlock, 'text/fontSize', 10);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);
```

Then save the template and add it to the asset source using `addAssetToSource()`. Each template needs a unique ID, a label, and metadata containing the template URI and thumbnail:

```typescript highlight-add-to-source
// Save template content and add to asset source
const originalContent = await engine.scene.saveToString();
engine.asset.addAssetToSource('my-templates', {
  id: 'template-original',
  label: { en: 'Original Template' },
  meta: {
    uri: `data:application/octet-stream;base64,${originalContent}`,
    thumbUri: generateThumbnail('Original Template')
  }
});
```

The `meta.uri` field contains the template content as a data URI. The `meta.thumbUri` provides a thumbnail image for reference.

## Editing Templates

Modify template content using block APIs. You can update text, change images, adjust positions, and reconfigure any block properties.

```typescript highlight-modify-template
  // Edit the template content and save as a new version
  engine.block.replaceText(titleBlock, 'Updated Template');
  engine.block.replaceText(subtitleBlock, 'This template was edited and saved');

  const updatedContent = await engine.scene.saveToString();
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${updatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });
```

After editing, save the modified template as a new asset or update an existing one.

## Removing Templates

Remove templates from asset sources using `removeAssetFromSource()`. This permanently deletes the template entry from the source.

```typescript highlight-remove-template
  // Add a temporary template to demonstrate removal
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-temporary',
    label: { en: 'Temporary Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${originalContent}`,
      thumbUri: generateThumbnail('Temporary Template')
    }
  });

  // Remove the temporary template from the asset source
  engine.asset.removeAssetFromSource('my-templates', 'template-temporary');
```

> **Warning:** Removal is permanent. The template is no longer accessible from the asset source after removal. If you need to restore templates, maintain backups or implement a soft-delete mechanism.

## Saving Updated Templates

To update an existing template, first remove it using `removeAssetFromSource()`, then add the updated version with `addAssetToSource()` using the same asset ID.

```typescript highlight-update-in-source
  // Update an existing template by removing and re-adding with same ID
  engine.block.replaceText(subtitleBlock, 'Updated again with new content');
  const reUpdatedContent = await engine.scene.saveToString();

  engine.asset.removeAssetFromSource('my-templates', 'template-updated');
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });

  // Notify that the asset source contents have changed
  engine.asset.assetSourceContentsChanged('my-templates');
```

After updating templates, call `assetSourceContentsChanged()` to notify that the asset source contents have changed.

## Best Practices

### Versioning Strategies

When managing template updates in server-side automation, consider these approaches:

- **Replace in place**: Use the same asset ID to update templates without changing references. Existing designs using the template won't break.
- **Version suffixes**: Create new entries with version identifiers (e.g., `template-v2`). This preserves old versions while introducing new ones.
- **Archive old versions**: Move deprecated templates to a separate source before removal. This maintains a history without cluttering the main library.

### Batch Operations

When adding, updating, or removing multiple templates, call `assetSourceContentsChanged()` once after all operations complete rather than after each individual change. This minimizes notification overhead in automated workflows.

### Template IDs

Use descriptive, unique IDs that reflect the template's purpose (e.g., `marketing-banner-2024`, `social-post-square`). Consistent naming conventions make templates easier to find and manage programmatically.

### Thumbnails

Generate meaningful thumbnails that accurately represent template content. Even in server-side workflows, thumbnails are useful when templates are later displayed in browser-based asset libraries.

### Memory Considerations

Templates stored as base64 data URIs remain in memory. For server-side batch processing with many templates, consider storing template content externally and using URLs in the `meta.uri` field instead of inline data URIs.

## Cleanup

Always dispose the engine when done to free resources.

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource()` | Create a local asset source |
| `engine.asset.addAssetToSource()` | Add template to asset source |
| `engine.asset.removeAssetFromSource()` | Remove template from asset source |
| `engine.asset.assetSourceContentsChanged()` | Notify of asset source changes |
| `engine.scene.saveToString()` | Save scene as base64 string |
| `engine.scene.load()` | Load scene from base64 string |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support