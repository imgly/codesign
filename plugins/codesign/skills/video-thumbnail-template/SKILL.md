---
name: video-thumbnail-template
description: >-
  Use when building a reusable thumbnail template and design guideline for a video channel
  (YouTube and other 16:9 video platforms) — from a channel link whose latest thumbnails set the
  style, from one or more example thumbnails or designs, or from scratch; or when making new
  thumbnails from such a template, one at a time or in a batch.
---

# video-thumbnail-template

Turn a channel's thumbnail style into a design guideline (a brand kit) and a CoDesign template
with named slots, then fill the template for each new video.

Builds on, without restating: the handbook loop, the `brand` skill's kit format, the `layerize`
skill (Seedream decomposition), the `models` skill, the `formats` skill (`youtube-thumbnail.md`)
and the `judge` gate.

## Input

One of three, resolved with the intake contract (`../handbook/intake.md`):

- **Channel link** — its latest 10 thumbnails set the style.
- **Example thumbnails or designs** — one or more images, or design files (`.imgly`, `.psd`, …).
- **Nothing** — start fresh; ask for the visual direction per the intake contract.

The format defaults to `youtube-thumbnail` (1280 × 720). Everything goes into one output folder
(default `./<channel-or-topic>-thumbnails/`): `reference/`, `brand-kit/`, the template and the
thumbnails. A thumbnail style is the channel's brand: never invent it when references exist.

## 1 — Collect references

**Channel link.** Fetch the channel's `/videos` page (e.g. `https://www.youtube.com/@handle/videos`)
with your own web or shell tools. That tab lists regular uploads only, newest first; the ids are in
the page source as `"videoId":"<11 chars>"`. Take the first 10 distinct ids and download each
thumbnail from `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` (fall back to `hqdefault.jpg`) into
`reference/` — public URLs, no API key or login. If the page cannot be read, ask the user for a
few video links or thumbnail images instead.

**Example thumbnails.** Copy the files the user named into `reference/`. A design file also goes
through `import` — its layers show the structure directly.

**Nothing.** No references; go to step 3 with the direction the user chose.

## 2 — Analyse the layouts

Look at every reference yourself. For **each** one, record its layout — positions and sizes as
fractions of the canvas, so they compare across images:

- zones: where the host, the headline and the subject sit, and how much of the canvas each takes
- headline: the words, line count, the role of each line (hook vs punch word), case, relative
  size, colour, stroke, shadow, closest Google Font
- host: side, crop, expression, gaze, outline or glow
- background: image or colour, mood, whether it repeats
- devices: arrows, badges, frames, blur, emoji

Then compare the set: what repeats in most references is the **system**, what appears once is an
option, and what changes from video to video becomes a **slot**. A set that splits into two or
three distinct layouts gets one template per layout — name them and ask which to build if unsure.

## 3 — Design guideline (brand kit)

Write the guideline as a brand kit in the `brand` skill's format — `brand-kit/tokens.json` +
`brand-kit/BRAND.md`. Read `../brand/reference/brandkit-spec.md` for the
shape and `reference/authoring.md` for the rules (screenshots are its source form D). Fill it from
the analysis:

- `colorPrimitives` / `semanticColors` — the colours sampled from the references (say they are
  sampled)
- `typography` — the headline font(s), weights, case and the size ratio between the lines
- `layout` / `composition` — the zones from step 2, as fractions of the canvas
- `safeArea` — the platform's (the duration badge, bottom right, for YouTube)
- `imagery` — host crop and treatment, background mood
- `device` — the recurring devices
- `voice` — headline formulas: words per line, the punch words in use
- `logo` — the channel's mark if the thumbnails carry one; otherwise record it in `$meta.gaps`

Draft the `avoid` list from what the references never do and confirm it with the user, as
`authoring.md` requires.

**Starting fresh**, the guideline comes first too: turn the chosen direction into the same kit,
show the user its key choices (palette, fonts, layout) and confirm them before building.

## 4 — Layers and assets

When a reference supplies a host, subject or background worth reusing, split it with the `layerize`
skill's Stage 1 (Seedream) and follow its rules. Keep the person, subject and residual background
layers; drop the text layers — the headline is rebuilt as live text.

A user's host photo that is not cut out goes through background removal (`models` skill,
`bria-rmbg.md`). A missing background can be generated from the kit's `imagery` mood,
`format: '16:9'`, with "no people, no text, no logos" in the prompt.

## 5 — Build the template

Build from the kit: one page at the format size, the zones from `layout`, back to front. Name the
slots so they can be filled later:

| name       | kind    | notes                                                  |
| ---------- | ------- | ------------------------------------------------------ |
| `bg`       | graphic | full-bleed image fill, `Cover`                         |
| `host`     | graphic | cut-out, `Contain`, anchored to the edge it grows from |
| `subject`  | graphic | optional cut-out, `Contain`                            |
| `line1`    | text    | the hook                                               |
| `line2`    | text    | optional punch word, `text.case: 'Uppercase'`          |
| `headline` | group   | `line1` + `line2`                                      |

Drop `host` when the style has no presenter; decoration from the style gets its own descriptive
name. When a headline line is too long for its column, shrink it until it fits — never let it run
to the edge or into the safe-area corner.

Test the template with a long punch word, a word with a capital diacritic (`ÜBERNIMMT`) and a
thumbnail without the optional slots, then run the `judge` loop with the kit as the brief. The
references are the style: tight headlines or a host bleeding off the canvas are not faults.

Export it with `export({ format: 'imgly', outPath })` into the output folder and report the kit,
the slots and any `$meta.gaps`.

## 6 — New thumbnails

For each thumbnail, `edit` with `parent` = the **template revision** — never chain one
thumbnail onto the previous — fill the slots, hide the empty ones, fit the headline, and export
JPEG (`export({ format: 'jpeg', blockId: <page>, outPath })`; YouTube rejects uploads over 2 MB).
Look at every export and check it against the kit's `avoid` list.

For a batch, agree on a simple table with the user (e.g. a CSV with one row per video: headline
lines and image files) and repeat the above per row. If they want to render outside the agent,
write them a small `@cesdk/node` script that loads the exported `.imgly`, fills the same slots by
name and exports each row; without a CE.SDK licence key it watermarks its output — say so.

## Common mistakes

| Mistake                                 | Fix                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------- |
| Styling from one thumbnail of ten       | analyse every reference; the system is what repeats                    |
| Building before the guideline exists    | write and confirm the kit first — the template is built from it        |
| New image fill comes out zoomed/cropped | `forceLoadResources([slot])`, then `resetCrop`, then re-apply the mode |
| Moving `line1`/`line2` while grouped    | positions are relative to the group — ungroup, position, regroup       |
| Typing capitals into `line2`            | keep the text as typed; the slot's `text.case` sets it                 |
| Sizing Seedream cut-outs by pixel size  | place by `bounding_box.absolute`                                       |
| A person placed with `Cover`            | `Contain`, anchored to the bottom edge                                 |
