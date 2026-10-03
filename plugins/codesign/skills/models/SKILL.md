---
name: models
description: >-
  Use when picking a model for `asset_generate` (image, video, speech, music, sound effects,
  transcription), writing its prompt or `params`, or reading its result; when a
  generation is rejected ("could not be processed", "flagged by a content checker", "Upstream
  service error"), returns the wrong content, or loses its transparency; or before chaining
  generation models (layer decomposition, background removal, upscaling).
requires: asset_generate
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
  provider's own value formats (`"8s"`, not `8`, where the schema says so). A `uri` inside
  `params` that you got back from `import` or an earlier `asset_generate` is uploaded first, so
  `{ audio_url: '<that uri>' }` works.
- `format` (an aspect ratio such as `"16:9"`) and `image_uris` (server-returned `uri` inputs for
  image-to-image) — the catalog image models' fields.

There is no negative prompt, seed, strength or style parameter on the catalog image models —
anything else they should know goes into the prompt text.

## What comes back

- **A file** — the engine's asset shape, `{ id, meta: { uri, mimeType, kind, duration?, width?,
  height? } }`, plus `cost`. `meta.kind` is `image`, `audio` or `video`; `meta.duration`
  (seconds) is there when the file header states it. Put the `uri` in a design (image/video
  fill, audio block)
  — audio and video play on this server's timeline (`../handbook/video.md`).
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

- **Look at every result — by placing it.** `asset_generate` returns the asset and no picture: the
  JSON tells you a file exists, not what was drawn. Put it in the design and read the render `edit`
  gives back. That also shows it at the size and crop it will actually have, which is what you are
  judging.
- **Verify transparency when it matters.** A cut-out that lost its alpha paints an opaque rectangle
  over whatever is behind it. Place it over something and look, or sample the alpha channel of the
  file — a glance at the asset on its own will not show you.
- **A failed generation is not a verdict on the image.** The text in parentheses after "The
  generation failed" comes from the model provider, and the same call can fail once and succeed
  the next time. What the calling skill says about retries applies.
