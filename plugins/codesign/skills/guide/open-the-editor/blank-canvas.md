> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Start With Blank Canvas](./open-the-editor/blank-canvas.md)

---

Create a new scene from scratch to build designs with complete control over canvas dimensions and initial content.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-blank-canvas-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-blank-canvas-server-js)

Starting from a blank canvas lets you build new designs without pre-existing content. The `engine.scene.create()` method creates an empty scene with its own camera, ready for adding pages and content. This differs from loading templates or images, which start with existing content.

> **Other Ways to Create Scenes:** You can also start with existing content:* [Create From Image](./open-the-editor/from-image.md) — Start with an image as the base
> * [Load a Scene](./open-the-editor/load-scene.md) — Resume editing a previously saved design

```typescript file=@cesdk_web_examples/guides-open-the-editor-blank-canvas-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Start With Blank Canvas
 *
 * Demonstrates how to create an empty scene from scratch
 * in headless Node.js environments.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create an Empty Scene
  // ========================================
  // Create a new empty scene with a page of specific dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });

  console.log('✓ Created empty scene');

  // Find the page that was automatically created
  const pages = engine.block.findByType('page');
  const page = pages[0];

  // ========================================
  // Zoom to Fit the Page
  // ========================================
  // Set the zoom level to fit the page with padding
  // This is useful for previewing the design before export
  await engine.scene.zoomToBlock(page, { padding: 40 });

  console.log('✓ Zoomed to fit page');

  // ========================================
  // Export the Result
  // ========================================
  // Export the scene to an image file
  if (page) {
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/blank-canvas-result.png', buffer);
    console.log('📄 Exported to: output/blank-canvas-result.png');
  }

  console.log('\n✓ Start With Blank Canvas guide completed successfully!');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

This guide covers how to create an empty scene with custom page dimensions and export the result.

## Create an Empty Scene

We call `engine.scene.create()` to create a new design scene. We pass the layout type and options parameter to specify page dimensions. The scene includes a page automatically when we provide size options.

```typescript highlight-create-scene
// Create a new empty scene with a page of specific dimensions
engine.scene.create('VerticalStack', {
  page: { size: { width: 800, height: 600 } }
});
```

The first parameter specifies the scene layout. Use `'Free'` for independent page positioning, `'VerticalStack'` or `'HorizontalStack'` for aligned layouts. The options object configures the initial page with a size in design units.

## Zoom to Fit the Page

Before exporting, we set the zoom level to frame the page content. This step is optional for server-side rendering but useful for previewing the design.

```typescript highlight-zoom
// Set the zoom level to fit the page with padding
// This is useful for previewing the design before export
await engine.scene.zoomToBlock(page, { padding: 40 });
```

The `zoomToBlock()` method adjusts the camera to frame the specified block with optional padding around it.

## Export the Result

After building the design, we export it to a file. Server-side processing typically saves the output to the filesystem.

```typescript highlight-export
// Export the scene to an image file
if (page) {
  const exportBlob = await engine.block.export(page, {
    mimeType: 'image/png'
  });
  const buffer = Buffer.from(await exportBlob.arrayBuffer());
  writeFileSync('output/blank-canvas-result.png', buffer);
  console.log('📄 Exported to: output/blank-canvas-result.png');
}
```

The `engine.block.export()` method renders the block to the specified format and returns a Blob, which we convert to a Buffer and write to disk.

## Cleanup

Always dispose the engine when processing is complete to free resources.

```typescript highlight-cleanup
// Always dispose the engine when done
engine.dispose();
```

## Next Steps

Now that you have created a design from a blank canvas, explore related topics:

- [Save](./export-save-publish/save.md) — Persist your design to a file or backend service
- [Blocks](./concepts/blocks.md) — Learn about scene hierarchy and block relationships
- [Create From Image](./open-the-editor/from-image.md) — Start with an existing image instead of a blank canvas



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support