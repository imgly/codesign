---
name: models
description: >-
  Use when picking a model for `asset_generate`, writing its prompt, or reading its result; when a
  generation is rejected ("could not be processed", "flagged by a content checker", "Upstream
  service error"), returns the wrong content, or loses its transparency; or before chaining
  generation models (layer decomposition, background removal, upscaling).
---

# models

How to prompt the models `asset_generate` offers, and what their results look like. The live
catalog is `asset_generate()` with no arguments — model ids come from there, never from memory.
Per-family guidance lives in one file each: `<file>`.

## What a call can carry

Only `model`, `prompt` (required, never empty), `format` (an aspect ratio such as `"16:9"`) and
`image_uris` (`workspace://` inputs for image-to-image). There is no negative prompt, seed,
strength or style parameter — anything else a model should know goes into the prompt text.

## Families with verified guidance

| family                    | model ids                                            | file                    |
| ------------------------- | ---------------------------------------------------- | ----------------------- |
| Seedream layer decomposer | `bytedance/seedream-5-pro-layerize`                  | `bytedance-seedream.md` |
| Background removal        | `bria/rmbg-2.0`                                      | `bria-rmbg.md`          |
| Upscalers                 | `bytedance/seedvr2-upscale`, `recraft/crisp-upscale` | `upscalers.md`          |

Every other catalog model has no verified guidance yet: prompt it plainly — subject, setting,
style, and any text it must render in quotes — and look at the result before using it.

## Shared rules

- **Look at every result.** The tool returns a labeled thumbnail per image; the JSON alone does not
  tell you what was drawn.
- **Verify transparency when it matters.** A cut-out that lost its alpha paints an opaque rectangle
  over the design and is easy to miss in a small thumbnail — sample the alpha channel of the file
  before placing it.
- **A failed generation is not a verdict on the image.** The text in parentheses after "The
  generation failed" comes from the model provider, and the same call can fail once and succeed
  the next time. What the calling skill says about retries applies.
