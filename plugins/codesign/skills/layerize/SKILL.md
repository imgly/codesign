---
name: layerize
description: >-
  Use when rebuilding a flat raster image — an ad, banner, social post, poster or other
  creative (PNG / JPEG / WebP) — as an editable, layered CoDesign design or `.imgly` file; when
  asked to layerize, decompose, de-flatten or "make editable" an image; or when splitting an
  image into separate layers with live, editable text.
argument-hint: <image> [output.imgly]
---

# layerize

Rebuild a source image as an editable CoDesign design: pixel layers from Seedream's layer decomposition, text rebuilt as real, editable text.

## Inputs

- **Source image** — the file the user points at.
- **Output path** — where the `.imgly` deliverable goes. If the user named none, use the source's path with the extension replaced by `.imgly`.

Keep intermediate files (layer metadata, comparison renders, cut-outs) out of the output location.

## Stage 1 — Layers (Seedream)

Call `asset_generate` — **one successful call per image**:

- `model`: `bytedance/seedream-5-pro-layerize`
- `image_uris`: `[uri]` — the source image, added to the workspace with `asset_add({ source: { path } })`
- `prompt`: exactly what the `models` skill prescribes for this model. Read `../models/bytedance-seedream.md` before the call — it also explains the result (which asset is the background, why cut-outs come back rescaled, how bounding boxes are written).

**Never retry a call that may have generated.** If it times out, find its output with `asset_search({ sourceId: 'ly.img.workspace.images' })` (newest first): the images created together with the source's dimensions or smaller, the full-size one being the background. If it returns an error instead, check the same way first; only when none of its output is in the workspace did it not run — fix the cause the error names and call it again. After the third failure, stop: build nothing, report the errors with their `gw_…` request ids, and ask the user how to proceed. Seedream is not optional: no other model and no local cut-outs replace it.

Save the returned `metadata` (layer names, z order, bounding boxes) as soon as you have it.

Handle Seedream's layers as follows (its output is not trustworthy as-is):

- Place every layer by its bounding box. Cut-outs may come back rescaled. If the bounding boxes are missing, find each layer's scale and position by matching it against the original.
- Drop Seedream's text layers; text is rebuilt in stage 2. Check that the background no longer shows the text. If it still does, inpaint it.
- Inventory: every visible element must be in exactly one layer.
- Drop duplicate layers.
- Cut any element Seedream missed straight from the original (take the alpha from the difference between the original and the composite).
- A part that sits in front of another object (e.g. a hand holding a product) may be its own layer, grouped with the object it belongs to.
- Background: keep the original pixels wherever no element covers them, and color-match the filled-in areas to the original.

## Stage 2 — Text (you do the vision pass yourself)

For each visible text block, record:

- exact string with line breaks
- role (headline / sub / body / cta / legal / price)
- pixel bounding box and alignment
- cap height and line pitch in px
- font characteristics (serif/sans/script, width, weight, italic, caps)
- fill, stroke and shadow colors as hex
- whether it sits on a shape

Rules:

- Ignore text printed on products, packaging, labels, barcodes or logos.
- Keep a visually coherent block as ONE entry: a three-line headline is one block, not three.
- Transcribe literally; write "unknown" instead of guessing.

Set each block as real, editable text:

- closest Google Font (name a fallback too)
- uppercase through the text case property (`text.case: 'Uppercase'`), not typed capitals
- font size derived from the measured cap height
- letter spacing (`text.letterSpacing`, a factor) and line height (`text.lineHeight: { visual }`) fitted to the measured line widths and line pitch
- shadow (`dropShadow`) or stroke tuned to match the original
- a button or chip keeps its shape as a separate layer under the text

**Matching the original beats CoDesign's typography lint:** keep the original's tracking and leading even when the lint warns about them.

## Build

- One page at the source's pixel size.
- Layers from back to front: background, scene groups, logo, text.
- Give every layer a descriptive name (`background`, `left-figure`, `product-can`, `logo-…`, `headline-…`).
- Group each scene's layers together, and group the text blocks.

## Acceptance

Check with a PNG export (`export({ format: 'png' })`) compared against the original. Fix and re-export until every point holds:

- text baselines within ±2 px, line widths within ±2 %
- text shadow visually matches the original
- average absolute pixel difference below 10/255
- no element missing, no element appearing twice
- named layers, grouped per scene

Then run the judge loop against the source (`../judge/SKILL.md`), export with `export({ format: 'imgly', outPath: '<output path>' })`, and report:

- the layer list
- what Seedream got wrong and how it was fixed
- where the intermediate files are
