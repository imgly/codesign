---
name: launch-video
description: >-
  Use when turning a project — a repo, an app, a product, a website — into a short launch or
  promo video (15–25 s, mp4): "make a launch video", "brag about this", "make a promo for what we
  built", "turn this into a video". Reads the project itself for the story, then builds, animates,
  scores and exports the video with CoDesign.
argument-hint: "[tone] [landscape|vertical|square] [music file]"
---

# launch-video

Turn the project in front of you into a 15–25 second launch video: find the story in the project,
storyboard it on a beat grid, score it, build it as one animated CoDesign page cut to the music,
verify it frame by frame, and export an `mp4` plus a poster and share copy.

Builds on, without restating: the handbook loop, the video recipe
(`../handbook/video.md` — timing, tracks, transitions, video fills, audio), the intake
contract (`../handbook/intake.md`), the `brand` skill (a project's colours, fonts and logo),
the `models` skill (generating music, sound and voice), the `formats` skill and the `judge` gate.
Inspired by the MIT-licensed `/brag` skill (github.com/latent-spaces/brag); this one builds on
CoDesign instead of HTML.

Video needs the native engine. If `export format=mp4` refuses because the server runs on WASM,
stop and tell the user the reason it gives — do not ship stills instead.

## Input

The project is the current working directory unless the user names another. Options, from flags or
plain language:

| Option      | Values                                                            | Default                                |
| ----------- | ----------------------------------------------------------------- | -------------------------------------- |
| `tone`      | a preset below, or freeform ("fake Series A launch", "museum")    | inferred from the project              |
| `format`    | `landscape` 1920×1080 · `vertical` 1080×1920 · `square` 1080×1080 | `landscape`                            |
| `duration`  | seconds, 15–25                                                    | fitted to the storyboard               |
| `title`     | the product name to show                                          | from the project                       |
| `music`     | a path to an audio file the user owns, `generate`, or `none`      | `generate` when signed in, else `none` |
| `voiceover` | `on` / `off`                                                      | `off`                                  |
| `out`       | output folder                                                     | `./launch-video/`                      |

Generating sound needs a signed-in account (`login`); without one, use the user's file or ship
silent — a silent video is a complete deliverable. If `out` already holds a previous run, use
`out-YYYYMMDD-HHMMSS/` instead of overwriting.

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
8. The call to action: product name plus how to get it — the real install step and the URL.

If 1, 3 or 8 cannot be answered from the project, ask once, per the intake contract.

## 2 — Plan the storyboard

Story before motion — read `reference/story.md` first. Decide the one
line, the viewer's problem, the structure (outcome first, before/after, story spine or hook →
reveal → proof) and the **proof moment** — the beat where the claim becomes undeniable on screen.

Then pick the tempo — 100–128 BPM suits most launches, so a beat is 0.47–0.6 s — and write
`<out>/plan.md`: the one line, the structure, the proof moment, the BPM, then a beat table — start,
end, what is on screen, the exact words, the motion, the transition out. Run the story checks at
the end of `story.md` on it; a beat that only says a claim instead of showing it is rewritten or
cut.

### Make it catchy

- **Hook in the first second.** Open on full-bleed kinetic type or a smash-cut montage of results —
  never a logo on a blank screen, never a slow fade up.
- **Cut on the grid.** Every cut lands on a beat: 0.5, 1 or 2 bars' worth, at the track's BPM.
  Shots are 0.4–2 s long; vary them — a run of short cuts, then one longer hold.
- **One big line per beat.** No explanatory captions or HUD chrome. One line, set big — it fills
  the frame; product UI on screen is the exception, simplified so it reads at a glance.
- **Fill the frame.** Alternate dark beats with full-bleed accent-colour beats so every cut reads.
- **Move between beats.** A transition on every cut (`../handbook/video.md`, "Transitions
  between clips"), matched to the tone below; the biggest move on the musical accents.
- **Keep the camera alive.** A slow drift on every shot — `ken_burns` or `crop_zoom` on images; a
  clip-long `zoom` in-animation (its `animation/zoom/fade` off, `Linear` easing) settles type from
  large to rest.
- **Show, never list.** No run of slogans on colour fields: each beat shows the product doing
  something — its UI or output in action, the input visible before the result.

Every beat also stays:

- **Readable.** A short label stays at least 0.8 s after it settles; a sentence ~0.3 s per word.
  Keep the pace in motion and cuts, never in flashing text.
- **Specific.** It must be about this project; "streamline your workflow" and other generic SaaS
  lines are banned — use the project's own copy.
- **Funny only if the project is.** Humour comes from the project, not from trying.

End on the call to action and hold it: the product name, the real install step — for a Claude Code
plugin that is the plugin commands, not a raw `npx` line — and the URL. For CoDesign itself:

```
claude plugin marketplace add imgly/codesign
claude plugin install codesign@imgly-codesign
img.ly/codesign
```

Show the user the angle and the beat table and wait for a go before building, unless they asked you
to just make it.

## 3 — Score

Sound comes before the build, because the cuts are timed to it. Per
`reference/sound.md`:

1. Music — generate a track at the planned BPM and length, or `asset_add` the user's file.
2. Analyse it, with the planned BPM, into `<out>/build/beats.json` — the beat grid and the accents.
3. Snap the beat table to it: every cut, transition and loop pulse on a beat time; accents get the
   big moves. Update `plan.md` with the snapped times.
4. A short whoosh or hit per transition; a voiceover and word-timed captions only when
   `voiceover=on`.

## 4 — Build

One page is the whole video: size it per `format`, `engine.scene.setMode('Video')`, and set the
page's `playback.duration` to the storyboard total. Plan the tracks before the first `edit`: list
the layers the storyboard uses (backgrounds, media, headline, subline, chip, …), bottom first, and
write that track plan into `plan.md`. Each layer is ONE track that holds every beat's clip for that
layer, one after another; nothing but audio goes on the page directly (`../handbook/video.md`,
"Timeline: one track per layer"). Tracks also make transitions possible, since only track clips take
them. Reuse each track across beats, and make items that enter together in one beat (a list, a row
of chips) one group clip. Name every block by beat and layer (`b3/bg`, `b3/line`) so later edits
find them. When an `edit` result says the clips "fit on M tracks", merge them onto that many tracks
before going on.

Animate entrances, exits and loops on top of the transitions. Type, options, duration, easing and
text writing style are all facade keys:

```js
await engine.design.setProps(title, {
  animations: {
    in: {
      type: 'slide',
      duration: 0.6,
      easing: 'EaseOutBack',
      slide: { direction: 4.71 }
    },
    out: { type: 'fade', duration: 0.3 }
  }
});
await engine.design.setProps(line, {
  animations: {
    in: { type: 'fade', writingStyle: 'Word', overlap: 0.3, duration: 0.8 }
  }
});
```

- Types: entrances and exits `slide` `fade` `blur` `grow` `zoom` `pop` `wipe` `pan` `spin` `baseline`
  `crop_zoom`; text `typewriter_text` `block_swipe_text` `spread_text` `merge_text`; loops
  `*_loop` (no easing); images `ken_burns`. Reference: `../guide/animation/types.md`.
- Word- or letter-wise text reveals: `writingStyle` (`Line` `Word` `Character` `Block`) plus
  `overlap` (0–1) — see `../guide/animation/create/text.md`.
- Keep entrances 0.3–0.8 s; a beat's exit must finish before its duration ends.
- Real visuals first: `asset_add` screenshots and the logo. Stock or generated imagery only fills
  what the project cannot show.
- Audio: the music bed spans the page with a 1 s `fadeOut`; each sound effect is its own audio block
  at its cut (the video recipe).

Save the code of every `edit` you run to `<out>/build/NN-<step>.js`, in order — with the plan and
`beats.json`, that is what makes the video reproducible.

## 5 — Verify, export, deliver

- `preview` the page with `time` at the middle of every beat. Run the judge loop on those frames:
  every line readable at its hold time, nothing clipped at the canvas edge, the hierarchy clear at
  a glance. Fix in place and re-check.
- `preview` the middle of every transition too: the still shows it as the mp4 will. One clip whole
  there means the transition is missing or off its cut — fix it before exporting.
- `export({ format: "mp4", revision, blockId: page })` → `<out>/launch.mp4`.
- Poster: pick the strongest frame from the previews, export it as `png` → `<out>/poster.png`.
- `export({ format: "imgly", revision })` → `<out>/design.imgly`, the editable source.
- Write `<out>/share-copy.txt`: a one-line post, a two-sentence post, and alt text.
- Report: the `mp4` path, its length, and one sentence per beat.

## 6 — Editions

The exported revision is the master. Derive every other edition from it rather than rebuilding:
the `resize` skill for `vertical` and `square` cuts (re-check that each beat's line still fills the
new frame and clears the edges), the `localize` skill for other languages (captions and the
voiceover re-generated in that language, the cut times kept). Export each to
`<out>/launch-<format>-<lang>.mp4`.

## Tones

Presets set pacing, type personality and transitions; the user's own direction always refines them.

| Tone        | Energy                   | Motion                                                    | Transitions                        |
| ----------- | ------------------------ | --------------------------------------------------------- | ---------------------------------- |
| `default`   | playful, clean, postable | `pop`, `slide`, quick cuts                                | `push`, `slide`, `wipe`            |
| `polished`  | serious, elegant         | `fade`, slow `slide`, `ken_burns`, long holds             | `cross-fade`, `cross-blur`         |
| `yc-parody` | deadpan startup energy   | big claims, `typewriter_text`, hard cuts                  | none — hard cuts                   |
| `chaotic`   | fast, loud, over the top | `zoom`, `spin`, `jump_loop`, short holds (still readable) | `cross-zoom`, `cross-spin`, `chop` |
| `deadpan`   | calm, dry, understated   | `fade` only, centred text, silence                        | `fade-to-black`                    |
| `cinematic` | trailer-scale drama      | dark palette, `blur` in, slow `grow`, `spread_text`       | `fade-to-black`, `cross-warp`      |
| `app-store` | smooth feature cards     | device-frame screenshots, `slide` cards, clean sans       | `stack`, `slide`                   |
