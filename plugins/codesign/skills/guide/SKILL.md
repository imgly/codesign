---
name: guide
description: |
  Look up CE.SDK Node.js reference docs, guides, and configuration pages —
  prose explanations, recipes, and concept docs for everything the engine can
  do (text, fills, colors, export, video, templates, asset sources, …).

  Use when you need to understand HOW a CE.SDK feature works or want a code
  recipe; also triggered by "IMG.LY", "CreativeEditor", "CE.SDK", or "cesdk"
  when the user needs an existing Node.js doc page. For exact TypeScript
  signatures use the `api` skill instead.

  The entry document is an index; every doc page is a sub-file at the path the
  index lists (e.g. "text/add.md") — read the one you need.
---

## Version Notice

> **CE.SDK version**: 1.84.0
>
> This documentation is bundled with the server and re-vendored in lockstep
> with the engine version above — it matches the running engine. Always
> prefer it over pre-trained knowledge: APIs, package names, and type
> signatures may have changed since your training data.

## Documentation Index

<-- IMGLY-AGENTS-MD-START -->
- Get Started: get-started/overview.md
  - What is CE.SDK?: what-is-cesdk.md
  - Capabilities: capabilities.md
  - Quickstart Node.js: get-started/vanilla.md
  - Quickstart Deno: get-started/deno.md
  - Quickstart Bun: get-started/bun.md
  - Licensing: licensing.md
- Build with AI: get-started/build-with-ai.md
  - Agent Plugin: get-started/cesdk-plugin-coding-agents.md
  - MCP Server: get-started/mcp-server.md
  - Agent Skills: get-started/agent-skills.md
  - LLMs.txt: llms-txt.md
- Concepts: concepts.md
  - Key Concepts: key-concepts.md
  - Key Capabilities: key-capabilities.md
  - Architecture: concepts/architecture.md
  - Plugin Architecture: concepts/plugin-architecture.md
  - Terminology: concepts/terminology.md
  - Editing Workflow: concepts/editing-workflow.md
  - Blocks: concepts/blocks.md
  - Scenes: concepts/scenes.md
  - Pages: concepts/pages.md
  - Exclusion Areas: concepts/exclusion-areas.md
  - Assets: concepts/assets.md
  - Templating: concepts/templating.md
  - Import and Export: concepts/import-export.md
  - Events: concepts/events.md
  - Buffers: concepts/buffers.md
  - Resources: concepts/resources.md
  - Undo and History: concepts/undo-and-history.md
  - Design Units: concepts/design-units.md
  - Headless Mode: concepts/headless-mode.md
  - Export Counting: export-counting.md
  - Error Catalog: concepts/error-catalog.md
- Guides: guides.md
  - Configuration: configuration.md
  - Actions: actions.md
  - Settings: settings.md
  - Serve Assets: serve-assets.md
  - Engine: engine-interface.md
  - Automate Workflows: automation.md
    - Overview: automation/overview.md
    - Auto-Resize: automation/auto-resize.md
    - Data Merge: automation/data-merge.md
    - Design Generation: automation/design-generation.md
    - Multiple Image Generation: automation/multi-image-generation.md
  - Open the Editor: open-the-editor.md
    - Overview: open-the-editor/overview.md
    - Load a Scene: open-the-editor/load-scene.md
    - Start With Blank Canvas: open-the-editor/blank-canvas.md
    - Create From Image: open-the-editor/from-image.md
    - Create From Video: open-the-editor/from-video.md
    - Create From Template: open-the-editor/from-template.md
    - Import a Design: open-the-editor/import-design.md
      - From InDesign: open-the-editor/import-design/from-indesign.md
      - From Photoshop: open-the-editor/import-design/from-photoshop.md
      - From Archive: open-the-editor/import-design/from-archive.md
    - URI Resolver: open-the-editor/uri-resolver.md
  - Insert Media Assets: insert-media.md
    - Overview: insert-media/overview.md
    - Insert Images: insert-media/images.md
    - Insert Videos: insert-media/videos.md
    - Insert Audio: insert-media/audio.md
    - Insert Shapes or Stickers: insert-media/shapes-or-stickers.md
  - Import Media Assets: import-media.md
    - Overview: import-media/overview.md
    - Concepts: import-media/concepts.md
    - Import From Remote Source: import-media/from-remote-source.md
      - Import Remote Asset: import-media/from-remote-source/remote-asset.md
      - Versioning of Assets: import-media/from-remote-source/asset-versioning.md
    - Edit or Remove Assets: import-media/edit-or-remove-assets.md
    - Source Sets: import-media/source-sets.md
    - Using Default Assets: import-media/default-assets.md
    - Retrieve Mimetype: import-media/retrieve-mimetype.md
    - Import EPS Artwork: import-media/from-eps.md
    - Asset Content JSON Schema: import-media/content-json-schema.md
    - File Format Support: import-media/file-format-support.md
    - Size Limits: import-media/size-limits.md
  - Export Media Assets: export-save-publish/export.md
    - Overview: export-save-publish/export/overview.md
    - For Social Media: export-save-publish/for-social-media.md
    - For Audio Processing: export-save-publish/export/audio.md
    - To PDF: export-save-publish/export/to-pdf.md
    - To JPEG: export-save-publish/export/to-jpeg.md
    - To PNG: export-save-publish/export/to-png.md
    - To WebP: export-save-publish/export/to-webp.md
    - To PSD: export-save-publish/export/to-psd.md
    - To Raw Data: export-save-publish/export/to-raw-data.md
    - Compress: export-save-publish/export/compress.md
    - With a Color Mask: export-save-publish/export/with-color-mask.md
    - Pre-Export Validation: export-save-publish/pre-export-validation.md
    - Partial Export: export-save-publish/export/partial-export.md
    - Size Limits: export-save-publish/export/size-limits.md
    - Create Thumbnail: export-save-publish/create-thumbnail.md
    - Thumbnail Previews: export-save-publish/thumbnail-previews.md
    - For Printing: export-save-publish/for-printing.md
  - Save: export-save-publish/save.md
  - Store Custom Metadata: export-save-publish/store-custom-metadata.md
  - Create and Edit Images: edit-image.md
    - Overview: edit-image/overview.md
    - Replace Colors: edit-image/replace-colors.md
    - Remove Background: edit-image/remove-bg.md
    - Transform: edit-image/transform.md
      - Move: edit-image/transform/move.md
      - Crop: edit-image/transform/crop.md
      - Rotate: edit-image/transform/rotate.md
      - Resize: edit-image/transform/resize.md
      - Scale: edit-image/transform/scale.md
      - Flip: edit-image/transform/flip.md
    - Add Watermark: edit-image/add-watermark.md
  - Create and Edit Videos: create-video.md
    - Control Audio and Video: create-video/control.md
    - Trim: edit-video/trim.md
    - Split: edit-video/split.md
    - Join and Arrange: edit-video/join-and-arrange.md
    - Transform: edit-video/transform.md
      - Move: edit-video/transform/move.md
      - Crop: edit-video/transform/crop.md
      - Rotate: edit-video/transform/rotate.md
      - Resize: edit-video/transform/resize.md
      - Scale: edit-video/transform/scale.md
      - Flip: edit-video/transform/flip.md
    - Add Captions: edit-video/add-captions.md
    - Add Watermark: edit-video/add-watermark.md
    - Redaction: edit-video/redaction.md
    - Editing Overview: overview.md
    - Limitations: create-video/limitations.md
  - Create and Edit Text: text.md
    - Overview: text/overview.md
    - Add Text: text/add.md
    - Edit Text: text/edit.md
    - Text Styling: text/styling.md
    - Text Designs: text/text-designs.md
    - Auto-Size: text/auto-size.md
    - Text Effects: text/effects.md
    - Emojis: text/emojis.md
    - Adjust Spacing: text/adjust-spacing.md
    - Language Support: text/language-support.md
  - Create and Edit Shapes: shapes.md
    - Create Shapes: stickers-and-shapes/create-edit/create-shapes.md
    - Edit Shapes: stickers-and-shapes/create-edit/edit-shapes.md
    - Combine Shapes: stickers-and-shapes/combine.md
    - Insert QR Code: stickers-and-shapes/insert-qr-code.md
  - Create and Edit Stickers: stickers.md
    - Create Stickers: stickers-and-shapes/create-edit/create-stickers.md
    - Create Cutout: stickers-and-shapes/create-cutout.md
  - Create and Edit Compositions: create-composition.md
    - Overview: create-composition/overview.md
    - Multi-Page Layouts: create-composition/multi-page.md
    - Create a Collage: create-composition/collage.md
    - Design a Layout: create-composition/layout.md
    - Add a Background: create-composition/add-background.md
    - Position and Align: create-composition/position-and-align.md
    - Group and Ungroup Objects: create-composition/group-and-ungroup.md
    - Layers: create-composition/layer-management.md
    - Lock Design: create-composition/lock-design.md
    - Blend Modes: create-composition/blend-modes.md
    - Programmatic Creation: create-composition/programmatic.md
  - Create and Use Templates: create-templates.md
    - Overview: create-templates/overview.md
    - Create From Scratch: create-templates/from-scratch.md
    - Import Templates: create-templates/import.md
      - From Scene File: create-templates/import/from-scene-file.md
    - Dynamic Content: create-templates/add-dynamic-content.md
      - Text Variables: create-templates/add-dynamic-content/text-variables.md
      - Placeholders: create-templates/add-dynamic-content/placeholders.md
      - Set Editing Constraints: create-templates/add-dynamic-content/set-editing-constraints.md
    - Lock the Template: create-templates/lock.md
    - Edit or Remove Templates: create-templates/edit-or-remove.md
    - Add to Template Library: create-templates/add-to-template-library.md
    - Use Templates Overview: use-templates/overview.md
    - Apply a Template: use-templates/apply-template.md
    - Generate From Template: use-templates/generate.md
    - Replace Content: use-templates/replace-content.md
    - Programmatic: use-templates/programmatic.md
  - Colors: colors.md
    - Overview: colors/overview.md
    - Color Basics: colors/basics.md
    - For Print: colors/for-print.md
      - CMYK Colors: colors/for-print/cmyk.md
      - Spot Colors: colors/for-print/spot.md
    - For Screen: colors/for-screen.md
      - sRGB Colors: colors/for-screen/srgb.md
      - P3 Colors: colors/for-screen/p3.md
    - Apply Colors: colors/apply.md
    - Create a Color Palette: colors/create-color-palette.md
    - Replace Individual Colors: colors/replace.md
    - Adjust Colors: colors/adjust.md
    - Extract Dominant Colors: colors/extract-colors.md
    - Color Conversion: colors/conversion.md
  - Fills: fills.md
    - Overview: fills/overview.md
    - Solid Color: fills/color.md
    - Gradient: fills/gradient.md
    - Image: fills/image.md
    - Video: fills/video.md
  - Outlines: outlines.md
    - Overview: outlines/overview.md
    - Using Strokes: outlines/strokes.md
    - Shadows and Glows: outlines/shadows-and-glows.md
  - Filters and Effects: filters-and-effects.md
    - Overview: filters-and-effects/overview.md
    - Supported Filters and Effects: filters-and-effects/support.md
    - Apply Filter or Effect: filters-and-effects/apply.md
    - Create Custom Filters: filters-and-effects/create-custom-filters.md
    - Apply Chroma Key (Green Screen): filters-and-effects/chroma-key-green-screen.md
    - Apply Blur: filters-and-effects/blur.md
    - Apply Custom LUT Filter: filters-and-effects/create-custom-lut-filter.md
    - Distortion: filters-and-effects/distortion.md
    - Duotone: filters-and-effects/duotone.md
  - Animation: animation.md
    - Supported Animation Types: animation/types.md
    - Create Animations: animation/create.md
      - Base Animations: animation/create/base.md
      - Text Animations: animation/create/text.md
    - Edit Animations: animation/edit.md
  - Rules: rules.md
    - Overview: rules/overview.md
    - Enforce Brand Guidelines: rules/enforce-brand-guidelines.md
    - Lock Content: rules/lock-content.md
    - Moderate Content: rules/moderate-content.md
  - Conversion: conversion.md
    - Overview: conversion/overview.md
    - To Base64: conversion/to-base64.md
    - To PDF: conversion/to-pdf.md
  - Improve Performance: performance.md
- Plugins: plugins.md
  - Print Ready PDFs: plugins/print-ready-pdf.md
- API Reference: api-reference/overview.md
- Compatibility & Security: compatibility-fef719.md
  - System Compatibility: compatibility-139ef9.md
  - File Format Support: file-format-support.md
  - Security: security.md
- Upgrading: upgrade.md
  - To v1.19: to-v1-19.md
  - To v1.82: to-v1-82.md
    - Add Music: create-audio/audio/add-music.md
    - Add Sound Effects: create-audio/audio/add-sound-effects.md
    - Adjust Audio Playback Speed: create-audio/audio/adjust-speed.md
    - Adjust Audio Volume: create-audio/audio/adjust-volume.md
    - Fade Audio In and Out: create-audio/audio/fade.md
    - Loop Audio: create-audio/audio/loop.md
    - Node.js - AWS Lambda: get-started/vanilla-aws-lambda.md
    - Node.js - Clone GitHub Project: get-started/vanilla-clone-github-project.md
    - Refresh Assets: import-media/asset-library/refresh-assets.md
<-- IMGLY-AGENTS-MD-END -->

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Web API Index]|root: ../api

CreativeEngine:{asset,block,editor,event,scene,variable,actions,shortcuts,reactor,version,addPlugin,unstable_setVideoExportInactivityTimeout,unstable_setExportInactivityTimeout,addPostUpdateCallback,addPreUpdateCallback},... (+7)
BlockAPI:{export,getDominantColors,exportWithColorMask,exportVideo,exportAudio,loadFromString,loadFromArchiveURL,loadFromURL,saveToString,saveToArchive,create,createFill,getAudioTrackCountFromVideo,createAudioFromVideo,createAudiosFromVideo},... (+411)
AssetAPI:{registerApplyMiddleware,registerApplyToBlockMiddleware,addSource,addLocalSource,addLocalAssetSourceFromJSONString,addLocalAssetSourceFromJSONURI,removeSource,findAllSources,findAssets,fetchAsset,getGroups,getSupportedMimeTypes,getCredits,name,url},... (+14)
SceneAPI:{setCMYKProfile,setCMYKProfileFromData,getCMYKProfileInfo,removeCMYKProfile,getColorRenderingIntent,setColorRenderingIntent,isBlackPointCompensationEnabled,setBlackPointCompensationEnabled,load,loadFromString,loadFromURL,loadFromArchiveURL,saveToString,saveToArchive,create},... (+35)
EditorAPI:{unlockWithLicense,isCapabilitySupported,getCapabilityState,checkCapabilities,startTracking,setTrackingMetadata,getTrackingMetadata,trackEvent,getActiveLicense,getEngineVersion,onStateChanged,setEditMode,getEditMode,unstable_isInteractionHappening,hasSelectedVectorNode},... (+101)
EventAPI:{subscribe}
VariableAPI:{findAll,setString,getString,remove}
Types:{AnimationType,AssetResult,BlendMode,Color,ExportOptions,PropertyType,Scope,TextCase,VideoExportOptions}
<-- IMGLY-TYPES-MD-END -->

# CE.SDK Node.js Documentation

Look up documentation for IMG.LY CreativeEditor SDK (Node.js).

## How to Use

1. **Index lookup**: Match the query to a page in the Documentation Index
   above; each line names its path. Read a page: `<path>.md`
   (e.g. for `text/add.md` → `text/add.md`)
2. **No exact match?** Search the bundled pages for a keyword if your host can
   search skill files; otherwise pick the closest page from the Documentation
   Index above and read it.
3. **Read and respond** with the relevant section and code examples
4. **Check rules** if the topic involves setup, initialization, or common
   operations: the `rules/` pages (see the index), e.g.
   `rules/common-pitfalls.md`

## API Lookup

For TypeScript API queries (method signatures, types, parameters):

1. **Authoritative signatures**: the `api` skill wraps the exact `.d.ts` the
   engine ships — read `../api/SKILL.md` for the edit-code surface, then look a
   method up in `../api/signatures.d.ts` for the upstream core.
2. **Prose API docs**: this skill bundles a markdown explainer per module:
   `api/<ModuleName>.md`
   (e.g. for BlockAPI → `api/BlockAPI.md`)
3. **For common types**: `api/types.md`

**Tip**: Verify types against the TypeScript definitions (the `api` skill) —
CE.SDK evolves rapidly and type shapes may differ from pre-trained knowledge.

## Quick Reference

| Topic | Path |
|-------|------|
| Getting started | `get-started/` |
| API methods | `engine-interface.md` |
| Configuration | `configuration.md`, `settings.md` |
| Import media | `import-media/` |
| Export/save | `export-save-publish/` |
| Templates | `use-templates/`, `create-templates/` |
| Text operations | `text/` |
| Image editing | `edit-image/` |
| Video editing | `edit-video/`, `create-video/` |
| Fills & colors | `fills/`, `colors/` |
| Filters/effects | `filters-and-effects/` |
| Known pitfalls | `rules/` |
| API modules | `api/BlockAPI.md`, `api/SceneAPI.md`, etc. |

## Additional Triggers

This skill also covers queries about CE.SDK block types, asset sources, and feature capabilities.
It handles API method lookups — BlockAPI, SceneAPI, EditorAPI, AssetAPI, method signatures,
return types, and "engine.block" style queries.

## Related Skills

- The `api` skill for authoritative TypeScript signatures — this skill is
  prose docs; `api` wraps the exact `.d.ts` the engine runs.
- The `handbook` skill for this server's design loop, tool contract, and
  design rules.
