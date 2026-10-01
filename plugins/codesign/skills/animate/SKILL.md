---
name: animate
description: >-
  Use when an existing CoDesign design should move — "animate this", "make it move", "turn this
  post/poster/carousel into a video", "motion version", "make a loop of this". Turns a still single-
  or multi-page design into one animated page and an mp4 without redesigning it, steered by one
  intake round and plain-language follow-ups ("slower", "logo last", "no bounce"). Not for videos
  from a repo or website (launch-video) or for new designs (create).
---

# animate

Give a finished still design motion. The layout never changes: every animation starts from the
design and settles on it, so the settled frame IS the still. Builds on, without restating, the
handbook loop, `../handbook/video.md`, `../handbook/intake.md` and the `judge` gate.
Needs the native engine for `mp4`; if export refuses because the server runs on WASM, stop and
report the reason.

## 1 — Read the design

Work from the design's latest revision (`changes` first if the user may have edited it in the
browser). Run `reference/schedule.md`'s `inventory.js` block as one read-only
`edit` with `render: false`: per page its id, every group, and every leaf with id, type, name,
global bounding box, fill kind, enclosing group, and words and font size for text blocks. Never
write your own inventory: reading text properties on an image throws. `preview` the pages.

Give each layer a key (`s<page>/<short-name>`) and a role:

| role           | what                                                                |
| -------------- | ------------------------------------------------------------------- |
| `background`   | bottom-most full-bleed layer (image, colour, gradient)              |
| `overlay`      | any other full-bleed layer: a scrim or gradient over the background |
| `image`        | pictures, illustration layers, product shots                        |
| `headline`     | large display text                                                  |
| `body`         | small text: overlines, captions, sublines, footers                  |
| `decoration`   | rules, pills, icons, shapes                                         |
| `logo` · `cta` | brand mark · call to action                                         |

Record `words` and `fontSize` for text. List every group under its page's `containers` — a group
left out hides its children after 5 s — and put every id (each page as `s<n>`, each layer, each
group) under `ids`. For multi-page designs also a `sig` for chrome that repeats on every page —
`<type>|<text or fill>|<x,y,w,h rounded to 1 px>` — so it is kept once.

## 2 — Intake (one round)

Ask only what the prompt leaves open, in your host's question UI, each with `Decide automatically`:

| parameter               | chips                                                   | default                              |
| ----------------------- | ------------------------------------------------------- | ------------------------------------ |
| style                   | calm · energetic · playful · cinematic                  | from the design's tone               |
| length                  | short ~6 s · medium ~10 s · long ~15 s · fit to content | fit to content                       |
| ending                  | hold the final frame · loop · outro                     | hold                                 |
| hero                    | the 2–3 strongest candidates by name                    | largest headline, else largest image |
| pages (multi-page only) | all in order · pick pages                               | all in order                         |

A loop is seamless only on a single page: a multi-page loop ends on the last page's background and
cuts back to the first page, so say that when offering it there. Pages left out of a pick are
dropped from the animated revision; the still keeps them.

Echo the resolved inputs in one to three lines, marking what was inferred or defaulted, then build.

## 3 — Schedule

Make a fresh directory with `mktemp -d` — never a fixed path such as `/tmp/anim`, which a parallel
session may share — and keep this run's files there. Write
`reference/schedule.md`'s `schedule.mjs` block into it, write the inventory as
`input.json` in the shape documented there (with this session's block ids under `ids`), and run
`node schedule.mjs input.json > plan.json`. Never set timings by hand — the script owns ordering,
the settle rule (every entrance done by 60 % of its scene), reading time, endings, multi-page scene
windows and which options each animation type accepts. If the plan says `stretched: true`, tell the
user the video is longer than asked and why.

## 4 — Build — ONE edit

Parent: the still's latest revision for the first apply (it stays as the parent — the still is never lost). Code:
`const PLAN = <plan.json>;` followed by the `apply.js` block. Do not fix anything else in that
edit. The server may list pre-existing lint findings on the source design (line height, tracking):
they are the still's, not yours — never change text or layout properties while animating; mention
them at delivery.

## 5 — Verify

- Compute each scene's settle point from `plan.apply`: the latest `timeOffset + in.duration` over
  the scene's entries — every `key` starting `s<n>/`, including the background and shared chrome,
  which have no `parent` — plus the scene's content group `timeOffset` for entries with a `parent`
  (none on a single page). Do not use a fixed fraction of the length: loop and outro exits can
  start earlier.
- `preview` the page with `time` at each settle point: each must look exactly like the still (page
  by page for multi-page).
- Run the judge loop on those frames and record the scorecard.
- `export({ format: 'mp4', revision, blockId: page })`, then pull frames with ffmpeg: the middle of
  every transition, and the last frame. With ending `hold`, compare the last frame with a still
  `png` export of the source revision — they must match up to compression. With `loop` or `outro`
  the last frame is only the background (everything has exited): compare the settle-point frame
  instead.

## 6 — Deliver

The mp4, a poster (`png` of the settled frame — park the playhead with
`setProps(page, { playback: { time } })`), and the `.imgly`. Offer the follow-ups: "slower",
"<element> last", "no bounce", "more energy", "loop it", "add music" (the `models` skill).

## Iterate

Read the page's `codesign/motion` metadata (`{ v, input }`) in a read-only edit, write it to
`plan-in.json` in this run's `mktemp -d` directory (a new one, with `schedule.mjs` written again,
in a new session), and run `node schedule.mjs plan-in.json '<change>'`:

| user says                      | change                                                   |
| ------------------------------ | -------------------------------------------------------- |
| slower / faster                | `{"kind":"slower"}` / `{"kind":"faster"}`                |
| X first / X last               | `{"kind":"first","key":"s1/logo"}` / `{"kind":"last",…}` |
| no bounce                      | `{"kind":"noBounce"}`                                    |
| more energy / calmer           | `{"kind":"energy"}` / `{"kind":"calmer"}`                |
| don't animate X                | `{"kind":"static","key":"…"}`                            |
| loop it / hold the end / outro | `{"kind":"ending","to":"loop"}` …                        |

Apply the result with the same `apply.js` edit, with the latest animated revision as `parent` (the
still has no motion-beat tags yet) — it finds blocks by their `codesign/motion-beat`
tag, so no ids are needed, and re-applying replaces animations and transitions instead of stacking
them. Block ids are session-scoped: a saved plan never carries them, so never paste ids stored in
an earlier session. Then verify again. A request outside the table: edit that beat's entry in the
plan JSON, re-run `schedule.mjs` on it, apply.

References: `reference/styles.md` (what each style does and why),
`reference/multipage.md` (how pages become scenes).
