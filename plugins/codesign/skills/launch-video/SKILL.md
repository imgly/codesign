---
name: launch-video
description: >-
  Use when turning a project — a repo, an app, a product, a website — into a short launch or
  promo video (15–25 s, mp4): "make a launch video", "brag about this", "make a promo for what we
  built", "turn this into a video". Reads the project itself for the story, then builds, animates
  and exports the video with CoDesign.
argument-hint: [tone] [landscape|vertical|square] [music file]
---

# launch-video

Turn the project in front of you into a 15–25 second launch video: find the story in the project,
storyboard it, build it as one animated CoDesign page, verify it frame by frame, and export an
`mp4` plus a poster and share copy.

Builds on, without restating: the handbook loop, the video recipe
(`../handbook/video.md` — timing, tracks, video fills, audio), the intake contract
(`../handbook/intake.md`), the `brand` skill (a project's colours, fonts and logo), the
`formats` skill and the `judge` gate. Inspired by the MIT-licensed `/brag` skill
(github.com/latent-spaces/brag); this one builds on CoDesign instead of HTML.

Video needs the native engine. If `export format=mp4` refuses because the server runs on WASM,
stop and tell the user the reason it gives — do not ship stills instead.

## Input

The project is the current working directory unless the user names another. Options, from flags or
plain language:

| Option     | Values                                                            | Default                   |
| ---------- | ----------------------------------------------------------------- | ------------------------- |
| `tone`     | a preset below, or freeform ("fake Series A launch", "museum")    | inferred from the project |
| `format`   | `landscape` 1920×1080 · `vertical` 1080×1920 · `square` 1080×1080 | `landscape`               |
| `duration` | seconds, 15–25                                                    | fitted to the storyboard  |
| `title`    | the product name to show                                          | from the project          |
| `music`    | a path to an audio file the user owns                             | none — silent             |
| `out`      | output folder                                                     | `./launch-video/`         |

No bundled music: add a track only when the user supplies one (`asset_add`). A silent video is a
complete deliverable. If `out` already holds a previous run, use `out-YYYYMMDD-HHMMSS/` instead of
overwriting.

## 1 — Inspect the project

Read the project, not a pitch about it: `README`, package or app metadata, the landing page or docs
copy, the changelog, and any logo, icon, screenshot or brand file in the repo. Answer, in your own
notes:

1. What is it, in one plain sentence a stranger would repeat?
2. Who is it for?
3. What does it do that is surprising or specific — the one thing to lead with?
4. Two or three highlights, each in the project's **own words** (a real feature, number or claim).
5. What can be **shown**: real UI, output, screenshots, a logo, a key visual?
6. Brand: colours, fonts, logo (use the `brand` skill's lookup when the repo carries a kit).
7. Tone that fits — or the one the user asked for.
8. The closing line: product name plus where to get it (URL, install command, handle).

If 1, 3 or 8 cannot be answered from the project, ask once, per the intake contract.

## 2 — Plan the storyboard

Write `<out>/plan.md`: the angle in one sentence, then a beat table — start, end, what is on screen,
the exact words, the motion. The shape to start from:

```
Hook (2–3 s) → Reveal (2–4 s) → 2–3 highlights (5–12 s) → Outro / call to action (2–4 s)
```

Rules for every beat:

- **The hook is everything.** The first 2 seconds decide whether anyone keeps watching; plan it first.
- **Readable.** A short label stays at least 0.8 s after it settles; a sentence ~0.3 s per word.
  Keep the pace in motion and cuts, never in flashing text.
- **Specific.** It must be about this project; "streamline your workflow" and other generic SaaS
  lines are banned — use the project's own copy.
- **Show the thing.** At least one beat shows real product UI, output or a key visual.
- **Funny only if the project is.** Humour comes from the project, not from trying.

Show the user the angle and the beat table and wait for a go before building, unless they asked you
to just make it.

## 3 — Build

One page is the whole video: size it per `format` and set its `playback.duration` to the storyboard
total. Each beat is a set of blocks timed with `playback: { timeOffset, duration }` on the page (or
on a track, per the video recipe). Name every block by beat (`hook/title`, `h2/screenshot`) so later
edits find them.

Animate entrances, exits and loops. The facade sets an animation's type and options; its duration
and easing are raw engine calls, which the edit gate accepts with the opt-out comment:

```js
await engine.design.setProps(title, {
  animations: {
    in: { type: 'slide', slide: { direction: 4.71 } },
    out: { type: 'fade' }
  }
});
const anim = engine.block.getInAnimation(title); // engine.block: the facade hides animation ids
engine.block.setDuration(anim, 0.6); // engine.block: animation duration has no facade path
engine.block.setEnum(anim, 'animationEasing', 'EaseOut'); // engine.block: no facade path
```

- Types: entrances and exits `slide` `fade` `blur` `grow` `zoom` `pop` `wipe` `pan` `spin` `baseline`
  `crop_zoom`; text `typewriter_text` `block_swipe_text` `spread_text` `merge_text`; loops
  `*_loop`; images `ken_burns`. Reference: `../guide/animation/types.md`.
- Word- or letter-wise text reveals: `engine.block.setEnum(anim, 'textAnimationWritingStyle',
'Word')` plus `textAnimationOverlap` (0–1) — see `../guide/animation/create/text.md`.
- Keep entrances 0.3–0.8 s; a beat's exit must finish before its duration ends.
- Real visuals first: `asset_add` screenshots and the logo; give a still a slow `ken_burns` or
  `pan` so it lives. Stock or generated imagery only fills what the project cannot show.
- Music: `asset_add` the user's file and add an audio block for the whole page; fade it out in
  the last second.

Save the code of every `edit` you run to `<out>/build/NN-<step>.js`, in order — with the plan, that
is what makes the video reproducible.

## 4 — Verify, export, deliver

- `preview` the page with `time` at the middle of every beat and at each transition. Run the judge
  loop on those frames: every line readable at its hold time, nothing clipped at the canvas edge,
  the hierarchy clear at a glance. Fix in place and re-check.
- `export({ format: "mp4", revision, blockId: page })` → `<out>/launch.mp4`.
- Poster: pick the strongest frame from the previews, export it as `png` → `<out>/poster.png`.
- `export({ format: "imgly", revision })` → `<out>/design.imgly`, the editable source.
- Write `<out>/share-copy.txt`: a one-line post, a two-sentence post, and alt text.
- Report: the `mp4` path, its length, and one sentence per beat.

## Tones

Presets set pacing, type personality and transitions; the user's own direction always refines them.

| Tone        | Energy                   | Motion                                                    |
| ----------- | ------------------------ | --------------------------------------------------------- |
| `default`   | playful, clean, postable | `pop`, `slide`, quick cuts                                |
| `polished`  | serious, elegant         | `fade`, slow `slide`, `ken_burns`, long holds             |
| `yc-parody` | deadpan startup energy   | big claims, `typewriter_text`, hard cuts                  |
| `chaotic`   | fast, loud, over the top | `zoom`, `spin`, `jump_loop`, short holds (still readable) |
| `deadpan`   | calm, dry, understated   | `fade` only, centred text, silence                        |
| `cinematic` | trailer-scale drama      | dark palette, `blur` in, slow `grow`, `spread_text`       |
| `app-store` | smooth feature cards     | device-frame screenshots, `slide` cards, clean sans       |
