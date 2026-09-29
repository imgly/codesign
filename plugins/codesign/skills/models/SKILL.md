---
name: models
description: >-
  Use when picking a model for `asset_generate` (image, video, speech, music, sound effects,
  transcription), writing its prompt or `params`, or reading its result; when a
  generation is rejected ("could not be processed", "flagged by a content checker", "Upstream
  service error"), returns the wrong content, or loses its transparency; or before chaining
  generation models (layer decomposition, background removal, upscaling).
---

# models

How to prompt the models `asset_generate` offers, and what their results look like. The live
catalog is `asset_generate()` with no arguments — model ids come from there, never from memory.
Per-family guidance lives in one file each: `<file>`.

## Finding a model

- `asset_generate()` — the curated catalog. Every entry carries its `capability`: `text2image`,
  `image2image`, `text2video`, `image2video`, `text2speech`, `speech2text`, `text2text`, … .
- `asset_generate({ capability: 'text2audio', source: 'all' })` — adds the provider models
  (`@falai/…` ids, about 1,500 in all; `source: 'all'` needs a `capability`). Music and sound
  effects live only here.
- `asset_generate({ model, schema: true })` — the model's input schema: which fields it takes,
  their enums, defaults and limits. Read it before the first call to an unfamiliar model.

## What a call can carry

- `prompt` — the text the model works from. Catalog models take it; provider models may name
  their text field differently (the sound-effects model wants `text`) — then pass it in `params`
  and leave `prompt` out.
- `params` — every other model input, verbatim, under the schema's field names: `voice`,
  `duration`, `lyrics_prompt`, `duration_seconds`, … . Provider (`@falai/…`) models take the
  provider's own value formats (`"8s"`, not `8`, where the schema says so). Any `workspace://` URI
  inside `params` is uploaded first, so `{ audio_url: 'workspace://assets/….mp3' }` works.
- `format` (an aspect ratio such as `"16:9"`) and `image_uris` (`workspace://` inputs for
  image-to-image) — the catalog image models' fields.

## What comes back

- **A file** — `{ uri, httpUrl, mimeType, kind, bytes, duration?, cost? }`. `kind` is `image`,
  `audio` or `video`; `duration` (seconds) is there when the file header states it. Put the `uri`
  in a design (image/video fill, audio block) — placing audio or video needs an engine with video
  support (`diagnostics` says whether this server has one).
- **Data** — `{ output: [...] }`, verbatim: a speech2text `transcript` (`text`, `words[]` with
  `start`/`end` seconds and `speaker`), a text model's reply.
- `cost.credits` — what the call cost (1 credit = $0.001); `provisional: true` on provider models
  means it is the up-front hold, settled to the real price shortly after.

## Families with verified guidance

| family                       | model ids                                                                                                                         | file                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Seedream layer decomposer    | `bytedance/seedream-5-pro-layerize`                                                                                               | `bytedance-seedream.md` |
| Background removal           | `bria/rmbg-2.0`                                                                                                                   | `bria-rmbg.md`          |
| Upscalers                    | `bytedance/seedvr2-upscale`, `recraft/crisp-upscale`                                                                              | `upscalers.md`          |
| Speech, music, SFX, captions | `elevenlabs/eleven-v3-tts`, `elevenlabs/scribe-v2`, `@falai/fal-ai/minimax-music/v2`, `@falai/fal-ai/elevenlabs/sound-effects/v2` | `audio.md`              |
| Video                        | `google/veo-3.1-fast`, `kling/v3-pro` (+ `-i2v`)                                                                                  | `video.md`              |

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
