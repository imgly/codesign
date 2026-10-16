---
title: "Import EPS Artwork"
description: "Import EPS artwork as native groups, replace named placeholders, and export an existing template in browsers and Node.js."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/import-media/from-eps-9fe72b/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/archive/v1.84/node/import-media-4e3703/) > [Import EPS Artwork](https://img.ly/docs/cesdk/archive/v1.84/node/import-media/from-eps-9fe72b/)

---

Load a saved design in Node.js, replace its named artwork placeholder with an
EPS group, and export the completed page without an editor UI.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://cdn.img.ly/demo/cesdk-web-examples/v1.82.2/examples/guides-import-media-from-eps-server-js/source.zip)

We use Node.js 22 or later with `@cesdk/node`. The included `template.scene` and synthetic `artwork.eps` make the complete replacement workflow reproducible.

```typescript file=@cesdk_web_examples/guides-import-media-from-eps-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { EPSImportError, replaceEPS } from '@imgly/eps-importer';
import { createConversionRuntime } from '@imgly/pdf-conversion-utils';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

const runtime = createConversionRuntime();
try {
  const template = await readFile(
    new URL('./public/template.scene', import.meta.url),
    'utf8'
  );
  await engine.scene.loadFromString(template);

  const matches = engine.block.findByName('Artwork');
  if (matches.length !== 1)
    throw new Error('Expected exactly one Artwork placeholder');
  const target = matches[0];
  let ancestor: number | null = target;
  while (
    ancestor !== null &&
    engine.block.getType(ancestor) !== '//ly.img.ubq/page'
  ) {
    ancestor = engine.block.getParent(ancestor);
  }
  if (ancestor === null) throw new Error('Artwork must belong to a page');
  const page = ancestor;

  const bytes = new Uint8Array(
    await readFile(new URL('./public/artwork.eps', import.meta.url))
  );
  const result = await replaceEPS(engine, bytes, {
    target,
    runtime,
    limits: { maxInputBytes: 20 * 1024 * 1024, timeoutMs: 30_000 }
  });

  for (const diagnostic of result.diagnostics) {
    console.info(`[${diagnostic.stage}] ${diagnostic.message}`);
  }
  console.info(
    `Imported native group ${result.group}: ${result.width} × ${result.height}`
  );

  const outputDirectory = new URL('./output/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const pdf = await engine.block.export(page, {
    mimeType: 'application/pdf',
    exportPdfWithDeviceCMYK: true
  });
  await writeFile(
    new URL('eps-artwork.pdf', outputDirectory),
    new Uint8Array(await pdf.arrayBuffer())
  );
  const archive = await engine.scene.saveToArchive();
  await writeFile(
    new URL('eps-artwork.imgly', outputDirectory),
    new Uint8Array(await archive.arrayBuffer())
  );
} catch (error) {
  if (error instanceof EPSImportError)
    console.error(error.code, error.diagnostics);
  throw error;
} finally {
  runtime.dispose();
  engine.dispose();
}
```

The example writes a standard PDF and an editable `.imgly` scene archive to its `output/` directory.

## Install and Run the Example

Install the headless engine, EPS importer, shared conversion runtime, and example runner:

```sh
npm install @cesdk/node@1.82.2 @imgly/eps-importer@0.1.0 @imgly/pdf-conversion-utils@0.1.0 dotenv
npm install --save-dev tsx typescript @types/node
```

CE.SDK 1.82 or later is required. Copy the example's `server-js.ts` and `public/` files to your project. Set the engine's `license` option to `process.env.CESDK_LICENSE` to use your environment's license, then run:

```sh
npx tsx server-js.ts
```

This example uses the WebAssembly-based `@cesdk/node` package. It does not target `@cesdk/node-native`.

## Initialize the Engine and Runtime

We initialize the headless engine. Configure your license in your application's environment and pass it through the engine configuration.

```typescript highlight=highlight-setup
config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

The Node runtime resolves its worker and conversion assets from the installed package. No browser asset hosting is required, and construction does not start conversion. Reuse an owned runtime for sequential jobs instead of creating one per file.

```typescript highlight=highlight-runtime
const runtime = createConversionRuntime();
```

## Load the Saved Template

We read the scene file and load it before importing artwork. Its page contains a header, a footer, and a rectangular placeholder named `Artwork`.

```typescript highlight=highlight-load-template
const template = await readFile(
  new URL('./public/template.scene', import.meta.url),
  'utf8'
);
await engine.scene.loadFromString(template);
```

We require exactly one matching block and capture its ID. This avoids selecting a different target after asynchronous file loading or conversion.

```typescript highlight=highlight-find-placeholder
const matches = engine.block.findByName('Artwork');
if (matches.length !== 1)
  throw new Error('Expected exactly one Artwork placeholder');
const target = matches[0];
let ancestor: number | null = target;
while (
  ancestor !== null &&
  engine.block.getType(ancestor) !== '//ly.img.ubq/page'
) {
  ancestor = engine.block.getParent(ancestor);
}
if (ancestor === null) throw new Error('Artwork must belong to a page');
const page = ancestor;
```

## Replace the Artwork

We read the EPS bytes and call `replaceEPS()` with the captured target and shared runtime. The helper fits the artwork proportionally inside the placeholder and returns one native group.

```typescript highlight=highlight-import-eps
const bytes = new Uint8Array(
  await readFile(new URL('./public/artwork.eps', import.meta.url))
);
const result = await replaceEPS(engine, bytes, {
  target,
  runtime,
  limits: { maxInputBytes: 20 * 1024 * 1024, timeoutMs: 30_000 }
});
```

The helper preserves supported target metadata and scopes. To add artwork without a placeholder, call `placeEPS()` with a parent and frame in the scene's design unit. Source bounds are reported in PostScript points.

## Inspect Diagnostics

Warnings describe conversion or import limitations even when a group was created successfully. Log them alongside the result rather than treating successful conversion as proof of visual or print fidelity.

```typescript highlight=highlight-diagnostics
for (const diagnostic of result.diagnostics) {
  console.info(`[${diagnostic.stage}] ${diagnostic.message}`);
}
console.info(
  `Imported native group ${result.group}: ${result.width} × ${result.height}`
);
```

For cancellable jobs, pass an `AbortController` signal in the options. A cancelled job can retry through the same runtime. Errors expose `EPSImportError.code` and diagnostics for recovery or reporting.

## Export and Save the Design

We export the containing page with DeviceCMYK enabled, then save the scene and its referenced assets with `saveToArchive()`. The archive includes imported image buffers and fonts so the design can be reopened for editing with `loadFromArchiveURL()`. The original layout remains around the imported group.

```typescript highlight=highlight-export
const outputDirectory = new URL('./output/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
const pdf = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithDeviceCMYK: true
});
await writeFile(
  new URL('eps-artwork.pdf', outputDirectory),
  new Uint8Array(await pdf.arrayBuffer())
);
const archive = await engine.scene.saveToArchive();
await writeFile(
  new URL('eps-artwork.imgly', outputDirectory),
  new Uint8Array(await archive.arrayBuffer())
);
```

This is standard PDF output. It does not establish PDF/X compliance or validate arbitrary EPS color fidelity. Use the approved print-ready workflow and inspect representative output before print production.

## Release Resources

We dispose the runtime and engine in `finally`, including when conversion or export fails. If a caller supplies a shared runtime, the caller should dispose it after its last job.

```typescript highlight=highlight-cleanup
runtime.dispose();
engine.dispose();
```

## Supported Artwork and Colors

EPS input must contain an EPSF header and finite bounding box, and produce one PDF page. CE.SDK 1.82 or later is required. This example uses synthetic cyan, K-only black, and white artwork.

Imported vectors become native scene blocks inside one group. Embedded images remain images; the importer does not offer a whole-artwork raster fallback. Missing fonts can be substituted during conversion, so embed or outline fonts when exact typography matters.

Supported process-color and named-spot paths can retain their color information. Gradients and other unsupported vector operations can become sampled RGB; inspect diagnostics and validate the output for your artwork. If a spot name already exists, the scene's existing definition is retained with a warning.

## Troubleshooting

Inspect `EPSImportError.code` and its diagnostics when import fails. Correct malformed headers or bounding boxes before retrying. For missing fonts, supply an EPS with embedded fonts or outlined text.

Replacement accepts a rectangular graphic with a solid fill and no crop, effects, animations, or children. Use a supported placeholder if validation rejects the target. If the scene or target changes during conversion, resolve the target again and retry. A failed replacement leaves the original target intact.

The defaults limit input to 20 MiB, converted PDF output to 100 MiB, conversion time to 30 seconds, dimensions to 14,400 PostScript points, and imported blocks to 10,000. These limits do not bound every parsing cost or peak memory allocation. Apply your own input and concurrency policy for untrusted files.

## Runtime License and Sources

The installed converter includes `COPYING.AGPL-3.0`, `LICENSE.md`, `PROVENANCE.md` and `THIRD_PARTY_NOTICES.md`. Retain these files when packaging the runtime for a server, desktop or on-premises deployment. They identify the AGPL-licensed converter and its matching [Ghostscript build sources](https://github.com/imgly/pdf-utils/releases/tag/source-gs-10.08.0-imgly-1) and [runtime wrapper sources](https://github.com/imgly/pdf-utils/releases/tag/runtime-wrapper-0.1.0-source). Server use does not remove the obligations that apply when you redistribute or modify the converter.

## Next Steps

- [Create a Custom Importer](#broken-link-0f7e16).
- [Import a Scene File](https://img.ly/docs/cesdk/archive/v1.84/node/create-templates/import/from-scene-file-52a01e/).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
