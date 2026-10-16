---
title: "Export to PSD"
description: "Export CE.SDK designs as layered PSD files with one document per page for continued editing in Adobe Photoshop."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export/to-psd-bc27e9/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Export Media Assets](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export-82f968/) > [To PSD](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export/to-psd-bc27e9/)

---

Export your design as one layered PSD file per page for continued editing in
Adobe Photoshop.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [Download examples](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0/examples/guides-export-save-publish-export-to-psd-server-js/source.zip)

The independently released `@imgly/psd-exporter` package runs in Node.js and returns one PSD per scene page. It uses native Node dependencies, so run it in a server process with `@cesdk/node`. The downloadable Node.js recipe writes files locally.

The [shared browser example](#broken-link-5c1a8f) offers both IDML and PSD downloads. Edit the design, then select **Export → PSD (Photoshop)**. The browser sends the current scene and its resources as an archive to a Node.js export endpoint, which returns a ZIP with one PSD per page. IDML is generated directly in the browser. Export notifications identify content that needs review; check the PSD files in Photoshop.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-psd-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';

import { exportPsd } from '@imgly/psd-exporter';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
    false,
    true
  );
  const outputDir = new URL('./output/', import.meta.url);
  await mkdir(outputDir, { recursive: true });

  const pages = engine.scene.getPages();
  for (const [index, page] of pages.entries()) {
    const preview = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    await writeFile(
      new URL(`page-${index + 1}-source.png`, outputDir),
      new Uint8Array(await preview.arrayBuffer())
    );
  }

  console.log('Exporting PSD files...');
  const { psds, logger } = await exportPsd(engine);

  const outputs = [];
  for (const [index, { pageName, psd }] of psds.entries()) {
    const filename = `page-${index + 1}.psd`;
    await writeFile(new URL(filename, outputDir), psd);
    outputs.push({ pageName, filename });
    console.log(`Saved ${filename} (${pageName})`);
  }

  const messages = logger.getMessages();
  await writeFile(
    new URL('export-report.json', outputDir),
    JSON.stringify({ outputs, messages }, null, 2)
  );
  for (const message of messages) {
    console.warn(`${message.type}: ${message.code} — ${message.message}`);
  }

  console.log(`Export files: ${outputDir.pathname}`);
  console.log('The source PNGs show CE.SDK rendering, not PSD rendering.');
} finally {
  engine.dispose();
}
```

This guide covers page exports, source previews, diagnostic reports, and engine cleanup. Run the example on Node.js 22 or later using its `dev` script.

## Import the Exporter and Initialize the Engine

Install `@imgly/psd-exporter` alongside `@cesdk/node` and import its public export function. The exporter has its own release schedule and version number.

```typescript highlight=highlight-import
import { exportPsd } from '@imgly/psd-exporter';
```

Load optional environment variables and initialize the engine. To use a license, supply `CESDK_LICENSE` in your environment and uncomment the license setting.

```typescript highlight=highlight-setup
config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Load the Design

Load the scene and wait for its resources before export. The example creates an `output/` directory beside its source file.

```typescript highlight=highlight-load-scene
await engine.scene.load(
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
  false,
  true
);
const outputDir = new URL('./output/', import.meta.url);
await mkdir(outputDir, { recursive: true });
```

Replace the sample scene URL with a scene accessible to your server.

## Save Source Previews

Export a PNG for each source page. These images show the CE.SDK appearance and give the recipient a reference for review. They are not renders of the exported PSDs and do not verify how Photoshop displays them.

```typescript highlight=highlight-source-previews
const pages = engine.scene.getPages();
for (const [index, page] of pages.entries()) {
  const preview = await engine.block.export(page, {
    mimeType: 'image/png'
  });
  await writeFile(
    new URL(`page-${index + 1}-source.png`, outputDir),
    new Uint8Array(await preview.arrayBuffer())
  );
}
```

## Export Every Page

Call `exportPsd()` with the loaded engine. The returned `psds` array contains `{ pageName, psd }` entries in scene page order, where `psd` is a `Uint8Array`.

```typescript highlight=highlight-export-psd
console.log('Exporting PSD files...');
const { psds, logger } = await exportPsd(engine);
```

Save each entry using an indexed filename. This keeps pages distinct when their names repeat or contain characters that cannot be used in a filename. The original page names are retained in the export report.

```typescript highlight=highlight-write-files
const outputs = [];
for (const [index, { pageName, psd }] of psds.entries()) {
  const filename = `page-${index + 1}.psd`;
  await writeFile(new URL(filename, outputDir), psd);
  outputs.push({ pageName, filename });
  console.log(`Saved ${filename} (${pageName})`);
}
```

The files are named `page-1.psd`, `page-2.psd`, and so on. A PSD contains one canvas, so a multi-page design produces multiple files.

## Review Diagnostics

Save the messages with the output file mapping and print them to the console. Each message includes a severity, code, and description of a conversion or unsupported feature.

```typescript highlight=highlight-diagnostics
const messages = logger.getMessages();
await writeFile(
  new URL('export-report.json', outputDir),
  JSON.stringify({ outputs, messages }, null, 2)
);
for (const message of messages) {
  console.warn(`${message.type}: ${message.code} — ${message.message}`);
}
```

Open the generated PSD files in Photoshop and review their appearance, layers, text, and fonts before handoff.

## Dispose the Engine

Release the engine in a `finally` block so cleanup also runs if loading, rendering, or writing a file fails.

```typescript highlight=highlight-cleanup
engine.dispose();
```

## Editability and Runtime Compatibility

Supported layers and text remain editable. Features that PSD cannot reproduce as editable content, including some effects and warped text, may use raster fallback. Review the diagnostic report to identify those conversions. Fonts needed by editable text must be available in the receiving application. Difficult native text can also have a hidden approximate copy in an **Editable text copies** folder. The visible pixels and editable copy do not synchronize. Imported warped or sheared native text with a supported cached appearance also gets a hidden approximate text copy. The copy uses ordinary text geometry and retains its separate identity through default import/export. Separate effects absent from the cached pixels remain unsupported.

The exporter accepts CE.SDK engine versions from 1.83.0. That minimum describes API compatibility. Text layout, fonts, and raster fallback rendering also depend on the installed CE.SDK runtime. Updating the JavaScript exporter does not update the engine or supply fixes from a later SDK release. Rendering can differ between CE.SDK and Photoshop.

## Troubleshooting

**The exporter cannot load in a browser** — Run this package in Node.js. Its native dependencies require a server runtime. The shared browser example calls a Node.js endpoint; when integrating it into your own application, deploy a server endpoint and configure the example's `VITE_PSD_EXPORT_URL`. The downloadable Node.js recipe demonstrates the export API without an HTTP server.

**A font or image cannot be loaded** — Check that the server can access its URL or local file and has the fonts needed by the source design.

**Text or an effect is no longer editable** — Review `export-report.json` for raster fallback messages. Use a supported editable style when the recipient needs to change that content.

**A source PNG looks correct but the PSD differs** — The PNG renders the source scene. Inspect the PSD in Photoshop with the required fonts to verify its exported appearance.

## API Reference

| Method / Result                                        | Description                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| `CreativeEngine.init(config)`                          | Initialize the Node engine                                        |
| `engine.scene.load(source, false, true)`               | Load a scene and wait for its resources                           |
| `engine.scene.getPages()`                              | Get pages in document order                                       |
| `engine.block.export(page, { mimeType: 'image/png' })` | Render a source page preview                                      |
| `exportPsd(engine)`                                    | Return one `{ pageName, psd }` entry per page plus a logger       |
| `logger.getMessages()`                                 | Read messages with `type`, `code`, `message`, and optional `meta` |
| `engine.dispose()`                                     | Release engine resources                                          |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
