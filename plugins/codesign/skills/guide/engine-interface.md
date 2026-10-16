---
title: "Engine Interface"
description: "Understand CE.SDK's architecture and learn when to use direct Engine access for automation workflows"
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/engine-interface-6fb7cf/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Engine](https://img.ly/docs/cesdk/archive/v1.84/node/engine-interface-6fb7cf/)

---

Access CE.SDK's cross-platform C++ engine programmatically for server-side automation, batch processing, and high-resolution exports in Node.js.

The `@cesdk/node` (WASM) and `@cesdk/node-native` (native) packages provide the same Engine API for Node.js. The API is identical to `@cesdk/engine` in the browser, so you can share code between client and server.

## Engine API Namespaces

The Engine organizes its functionality into six namespaces:

- **engine.block**: Create, modify, and export design elements (shapes, text, images, videos)
- **engine.scene**: Load, save, and manage scenes and pages
- **engine.asset**: Register and query asset sources (images, templates, fonts)
- **engine.editor**: Configure editor settings, manage edit modes, handle undo/redo
- **engine.variable**: Define and update template variables for data merge
- **engine.event**: Subscribe to engine events (selection changes, state updates)

## Basic Usage

```javascript
const { CreativeEngine } = require('@cesdk/node');

const engine = await CreativeEngine.init({
  license: process.env.CESDK_LICENSE,
});

try {
  await engine.scene.load('https://example.com/template.imgly');
  const page = engine.scene.getPages()[0];
  const blob = await engine.block.export(page, 'image/png', {
    targetWidth: 3840,
    targetHeight: 2160,
    dpi: 300,
  });
  // Save blob to file or storage
} finally {
  engine.dispose();
}
```

## Server-Side Benefits

**Resources**: Access more CPU, memory, and storage than client devices for print-quality exports.

**Secure Assets**: Process private templates and assets without exposing them to clients.

**Background Operations**: Handle long-running tasks without blocking users.

## Hybrid Workflows

Users design on the client with instant feedback. Send the scene to your server for high-resolution export:

```javascript
// Client: Save scene and send to server
const sceneData = await cesdk.engine.scene.saveToString();

// Server: Load and export at high resolution
const engine = await CreativeEngine.init({ license: process.env.CESDK_LICENSE });
try {
  await engine.scene.load(sceneData);
  const blob = await engine.block.export(engine.scene.getPages()[0], 'image/png', {
    targetWidth: 3840,
    targetHeight: 2160,
    dpi: 300,
  });
} finally {
  engine.dispose();
}
```

## Troubleshooting

**Engine not initialized**: Ensure `CreativeEngine.init()` completes before calling other methods.

**Memory issues**: Dispose Engine instances after each use with `engine.dispose()`.

**License errors**: Verify `CESDK_LICENSE` environment variable is set correctly.

## Next Steps

- [Automation Overview](https://img.ly/docs/cesdk/archive/v1.84/node/automation/overview-34d971/) for workflow examples
- [Data Merge](https://img.ly/docs/cesdk/archive/v1.84/node/automation/data-merge-ae087c/) for template personalization



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
