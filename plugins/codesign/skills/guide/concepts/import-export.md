> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Import and Export](./concepts/import-export.md)

---

Understand every way files move in and out of CE.SDK—importing media and design files, loading and saving native scenes, and exporting finished output.

When developers ask whether CE.SDK "supports" a file format, the answer depends on which workflow they mean. Importing an image as content, converting a Photoshop file into an editable design, and rendering a finished PDF are three different operations with different format support. This page maps every way files come in and go out, and links to the guide for each workflow.

![Diagram showing how files move in and out of CE.SDK: media assets, design files converted by importer packages and native design files flow into a scene; saving produces a re-editable scene string or archive, while exporting renders flattened final output](https://img.ly/docs/cesdk/./assets/import-export-flows.svg)

Everything in CE.SDK revolves around the *scene*—the block hierarchy that describes a design. Files coming in either add content to a scene or become a scene; files going out either preserve the scene for later editing or render it into final output. In Node.js, these workflows typically run headlessly: batch pipelines that convert, modify and render designs without a UI.

## Three Ways Files Come In

### Media Assets

Media assets are content placed *inside* a design: images, videos, audio clips and fonts. In headless workflows you add them programmatically through the asset and block APIs.

Media assets don't change the structure of a scene—they fill blocks with content. See the [Import Media](./import-media/overview.md) section, [Asset Concepts](./import-media/concepts.md) for the underlying architecture, and [File Format Support](./import-media/file-format-support.md) for the exact format list.

### Native Design Files

CE.SDK persists designs in its own format, which loads back with full editability. Native files come in two variants:

- **Scene string** (`.scene`) — A serialized description of the block hierarchy. Assets are referenced by URL, not embedded, so the file is lightweight but depends on those URLs staying reachable.
- **Archive** (`.zip`) — A self-contained bundle of the scene file plus every referenced asset. Larger, but portable and usable offline.

The `.imgly` extension is used for both variants; the engine detects the format automatically when loading. Load native files with `engine.scene.load()` or `engine.scene.loadFromArchiveURL()`. See [Load a Scene](./open-the-editor/load-scene.md), [Import a Design](./open-the-editor/import-design.md) and [Import from Archive](./open-the-editor/import-design/from-archive.md).

### Design Files From Other Tools

Files created in other design applications—Photoshop, InDesign, PowerPoint or PDF-producing tools—are not media assets. Instead, dedicated importer packages *convert* them into native CE.SDK scenes, preserving text, images, vector paths, positioning and colors as editable blocks:

| Source format         | Package                 |
| --------------------- | ----------------------- |
| Photoshop (`.psd`)    | `@imgly/psd-importer`   |
| InDesign (`.idml`)    | `@imgly/idml-importer`  |
| PDF (`.pdf`)          | `@imgly/pdf-importer`   |
| PowerPoint (`.pptx`)  | `@imgly/pptx-importer`  |

The importers run in Node.js, which makes them a natural fit for server-side conversion pipelines—for example, converting uploaded files into scenes before handing them to an editor frontend. See [From InDesign](./open-the-editor/import-design/from-indesign.md) and [From Photoshop](./open-the-editor/import-design/from-photoshop.md) for integration guides.

#### Importer Features and Limitations

Each importer translates a subset of its source format, so review converted scenes—especially complex documents—before publishing. Where a feature can't be mapped one-to-one, the importers degrade gracefully. Typical examples:

- Linked, non-embedded images aren't resolved and import as placeholders (IDML, PDF).
- Mixing multiple fonts or font sizes within a single Photoshop text layer isn't supported, and unavailable fonts are substituted depending on the configured font strategy.
- PowerPoint tables, charts, SmartArt, animations and slide masters are skipped.

The npm page of each package maintains the up-to-date list of supported features and limitations: [`@imgly/psd-importer`](https://www.npmjs.com/package/@imgly/psd-importer), [`@imgly/idml-importer`](https://www.npmjs.com/package/@imgly/idml-importer), [`@imgly/pdf-importer`](https://www.npmjs.com/package/@imgly/pdf-importer) and [`@imgly/pptx-importer`](https://www.npmjs.com/package/@imgly/pptx-importer).

For any format without a ready-made importer, you can build your own converter with the scene and block APIs—see [Create From Scratch](./create-templates/from-scratch.md) for building a design programmatically.

## Two Ways Files Go Out

### Saving a Design

Saving preserves the scene for later editing. `engine.scene.saveToString()` produces a scene string with assets referenced by URL; `engine.scene.saveToArchive()` produces a self-contained archive with assets embedded. Both round-trip losslessly—loading a saved file restores the design exactly, with full editability.

A saved file is not viewable output: it only renders inside CE.SDK. To show a preview of a saved design elsewhere, export a thumbnail alongside it. See [Save](./export-save-publish/save.md) and [Create Thumbnail](./export-save-publish/create-thumbnail.md).

### Exporting Final Output

Exporting renders the scene into a finished file for use outside CE.SDK. Export the whole scene, a single page or any individual block with `engine.block.export()`. Output covers images, vector graphics, print-ready PDF, audio, and raw pixel data—[File Format Support](./file-format-support.md) lists the exact formats in Node.js. Each output has a focused guide: [To PNG](./export-save-publish/export/to-png.md), [To JPEG](./export-save-publish/export/to-jpeg.md), [To WebP](./export-save-publish/export/to-webp.md), [To PDF](./export-save-publish/export/to-pdf.md) (including [print-ready output](./export-save-publish/for-printing.md) with underlayers and spot colors), [audio](./export-save-publish/export/audio.md) and [raw RGBA buffers](./export-save-publish/export/to-raw-data.md).

Video export to MP4 isn't available in the Node.js engine—render video in a browser environment instead.

Exports are flattened: text becomes pixels or paths, and the block structure is gone. An exported file can't be turned back into the original editable design. See [Export Options](./export-save-publish/export/overview.md) for configuration, plus [Partial Export](./export-save-publish/export/partial-export.md), [Pre-Export Validation](./export-save-publish/pre-export-validation.md), [Export for Social Media](./export-save-publish/for-social-media.md) and [Size Limits](./export-save-publish/export/size-limits.md).

## Save vs. Export

The most common point of confusion is the difference between saving and exporting:

|                | Save                                     | Export                                        |
| -------------- | ---------------------------------------- | --------------------------------------------- |
| Purpose        | Continue editing later                   | Use the result outside CE.SDK                 |
| Output         | `.scene` string, `.imgly`/`.zip` archive | Rendered files (PNG, PDF, MP4, …)|
| Re-editable    | Yes, losslessly                          | No—content is flattened                       |
| Assets         | Referenced by URL or embedded            | Rendered into the output                      |
| Viewable outside CE.SDK | No                              | Yes                                           |

A typical integration uses both: save the scene to your backend so users can keep editing, and export when they download or publish the result.

## Common Questions

- **Can users upload a PDF or Photoshop file like an image?** Not as a media asset—the media path accepts images, video and audio only. PDF, PSD, IDML and PPTX files go through the importer packages, which convert them into editable scenes.
- **Why isn't my exported PDF editable when I import it back?** Exporting flattens the design. The PDF importer reconstructs an editable scene from any PDF, but it's a conversion, not a lossless round trip. To preserve editability, save the scene alongside the export.
- **What's the difference between `.scene`, `.imgly` and `.zip`?** `.scene` is always a scene string, `.zip` is always an archive, and `.imgly` is the recommended extension for either—the engine detects which one it is when loading.
- **Does a saved scene contain its images?** A scene string references assets by URL, so the design breaks if those URLs go away. An archive embeds all assets and is fully self-contained.

## Format Support Reference

For the authoritative format tables—including codec details, size limits and known limitations—see [File Format Support](./file-format-support.md).

## API Reference

| Method                         | Category | Purpose                                                          |
| ------------------------------ | -------- | ---------------------------------------------------------------- |
| `engine.scene.load()`          | Import   | Load a scene string, with automatic format detection             |
| `engine.scene.loadFromArchiveURL()` | Import | Load a self-contained scene archive from a URL              |
| `engine.scene.saveToString()`  | Save     | Serialize the scene to a string with assets referenced by URL    |
| `engine.scene.saveToArchive()` | Save     | Bundle the scene and all assets into a self-contained archive    |
| `engine.block.export()`        | Export   | Render a block, page or scene to a final output format           |

## Next Steps

- [Import Media](./import-media/overview.md) — Bring images, video, audio and fonts into designs
- [Import a Design](./open-the-editor/import-design.md) — Load saved scenes and archives
- [Import Templates](./create-templates/import.md) — Load templates from URLs, archives and strings
- [Save](./export-save-publish/save.md) — Persist designs for later editing
- [Export Options](./export-save-publish/export/overview.md) — Configure output formats and quality



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support