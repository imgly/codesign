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

> **CE.SDK version**: 1.83.0-rc.2
>
> This documentation is bundled with the server and re-vendored in lockstep
> with the engine version above — it matches the running engine. Always
> prefer it over pre-trained knowledge: APIs, package names, and type
> signatures may have changed since your training data.

## Documentation Index

<-- IMGLY-AGENTS-MD-START -->[CE.SDK Node.js Docs Index]|root: .|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any CE.SDK tasks. Consult the local docs directory before using pre-trained knowledge.|actions.md|animation:{create,edit.md,types.md}|animation/create:{base.md,text.md}|api:{node}|api/node:{classes,enumerations,functions,interfaces,type-aliases,variables}|automation:{auto-resize.md,data-merge.md,design-generation.md,multi-image-generation.md,overview.md}|capabilities.md|colors:{adjust.md,apply.md,basics.md,conversion.md,create-color-palette.md,extract-colors.md,for-print,for-screen,overview.md,replace.md}|colors/for-print:{cmyk.md,spot.md}|colors/for-screen:{p3.md,srgb.md}|compatibility.md|concepts:{architecture.md,assets.md,blocks.md,buffers.md,design-units.md,editing-workflow.md,error-catalog.md,events.md,exclusion-areas.md,headless-mode.md,import-export.md,pages.md,plugin-architecture.md,resources.md,scenes.md,templating.md,terminology.md,undo-and-history.md}|configuration.md|conversion:{overview.md,to-base64.md,to-pdf.md,to-png.md}|create-audio:{audio}|create-audio/audio:{add-music.md,add-sound-effects.md,adjust-speed.md,adjust-volume.md,fade.md,loop.md}|create-composition:{add-background.md,blend-modes.md,collage.md,group-and-ungroup.md,layer-management.md,layout.md,lock-design.md,multi-page.md,overview.md,position-and-align.md,programmatic.md}|create-templates:{add-dynamic-content,add-to-template-library.md,edit-or-remove.md,from-scratch.md,import,lock.md,overview.md}|create-templates/add-dynamic-content:{placeholders.md,set-editing-constraints.md,text-variables.md}|create-templates/import:{from-scene-file.md}|create-video:{control.md,limitations.md}|edit-image:{add-watermark.md,overview.md,remove-bg.md,replace-colors.md,transform}|edit-image/transform:{crop.md,flip.md,move.md,resize.md,rotate.md,scale.md}|edit-video:{add-captions.md,add-watermark.md,join-and-arrange.md,redaction.md,split.md,transform,trim.md}|edit-video/transform:{crop.md,flip.md,move.md,resize.md,rotate.md,scale.md}|engine-interface.md|export-counting.md|export-save-publish:{create-thumbnail.md,export,for-printing.md,for-social-media.md,pre-export-validation.md,save.md,store-custom-metadata.md,thumbnail-previews.md}|export-save-publish/export:{audio.md,compress.md,overview.md,partial-export.md,size-limits.md,to-jpeg.md,to-pdf.md,to-png.md,to-raw-data.md,to-webp.md,with-color-mask.md}|file-format-support.md|fills:{color.md,gradient.md,image.md,overview.md,video.md}|filters-and-effects:{apply.md,blur.md,chroma-key-green-screen.md,create-custom-filters.md,create-custom-lut-filter.md,distortion.md,duotone.md,overview.md,support.md}|get-started:{agent-skills.md,build-with-ai.md,bun.md,cesdk-plugin-coding-agents.md,deno.md,mcp-server.md,overview.md,vanilla.md,vanilla-aws-lambda.md,vanilla-clone-github-project.md}|guides.md|import-media:{asset-library,concepts.md,content-json-schema.md,default-assets.md,edit-or-remove-assets.md,file-format-support.md,from-remote-source,overview.md,retrieve-mimetype.md,size-limits.md,source-sets.md}|import-media/asset-library:{refresh-assets.md}|import-media/from-remote-source:{asset-versioning.md,remote-asset.md}|insert-media:{audio.md,images.md,overview.md,shapes-or-stickers.md,videos.md}|key-capabilities.md|key-concepts.md|licensing.md|llms-txt.md|open-the-editor:{blank-canvas.md,from-image.md,from-template.md,from-video.md,import-design,load-scene.md,overview.md,uri-resolver.md}|open-the-editor/import-design:{from-archive.md,from-indesign.md,from-photoshop.md}|outlines:{overview.md,shadows-and-glows.md,strokes.md}|overview.md|performance.md|plugins:{print-ready-pdf.md}|rules:{asset-handling.md,common-pitfalls.md,content-fill-mode.md,enforce-brand-guidelines.md,lock-content.md,moderate-content.md,overview.md,silent-init-errors.md,verify-properties-before-use.md}|security.md|serve-assets.md|settings.md|shapes.md|stickers.md|stickers-and-shapes:{combine.md,create-cutout.md,create-edit,insert-qr-code.md}|stickers-and-shapes/create-edit:{create-shapes.md,create-stickers.md,edit-shapes.md}|text:{add.md,adjust-spacing.md,auto-size.md,edit.md,effects.md,emojis.md,language-support.md,overview.md,styling.md,text-designs.md}|to-v1-19.md|to-v1-82.md|upgrade.md|use-templates:{apply-template.md,generate.md,overview.md,programmatic.md,replace-content.md}|what-is-cesdk.md|<-- IMGLY-AGENTS-MD-END -->

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Web API Index]|root: .

CreativeEngine:{asset,block,editor,event,scene,variable,actions,shortcuts,reactor,version,addPlugin,unstable_setVideoExportInactivityTimeout,unstable_setExportInactivityTimeout,addPostUpdateCallback,addPreUpdateCallback},... (+7)
BlockAPI:{export,getDominantColors,exportWithColorMask,exportVideo,exportAudio,loadFromString,loadFromArchiveURL,loadFromURL,saveToString,saveToArchive,create,createFill,getAudioTrackCountFromVideo,createAudioFromVideo,createAudiosFromVideo},... (+407)
AssetAPI:{registerApplyMiddleware,registerApplyToBlockMiddleware,addSource,addLocalSource,addLocalAssetSourceFromJSONString,addLocalAssetSourceFromJSONURI,removeSource,findAllSources,findAssets,fetchAsset,getGroups,getSupportedMimeTypes,getCredits,name,url},... (+14)
SceneAPI:{setCMYKProfile,setCMYKProfileFromData,getCMYKProfileInfo,removeCMYKProfile,getColorRenderingIntent,setColorRenderingIntent,isBlackPointCompensationEnabled,setBlackPointCompensationEnabled,load,loadFromString,loadFromURL,loadFromArchiveURL,saveToString,saveToArchive,create},... (+33)
EditorAPI:{unlockWithLicense,isCapabilitySupported,checkCapabilities,startTracking,setTrackingMetadata,getTrackingMetadata,trackEvent,getActiveLicense,getEngineVersion,onStateChanged,setEditMode,getEditMode,unstable_isInteractionHappening,hasSelectedVectorNode,addVectorNode},... (+100)
EventAPI:{subscribe}
VariableAPI:{findAll,setString,getString,remove}
Types:{AnimationType,AssetResult,BlendMode,Color,ExportOptions,PropertyType,Scope,TextCase,VideoExportOptions}
<-- IMGLY-TYPES-MD-END -->

# CE.SDK Node.js Documentation

Look up documentation for IMG.LY CreativeEditor SDK (Node.js).

## How to Use

1. **Index lookup**: Match the query to a path in the Documentation Index above.
   The index uses compressed format: `dir:{file1.md,file2.md}` means files are
   at `dir/file1.md` and `dir/file2.md`.
   Read a page: `<path>.md`
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
