# Sound — music, beat map, effects, voice

Reference for the `launch-video` skill: score the video before building it, then cut to the music.
Generation runs through `asset_generate`; how to find a model, read its input schema and pass its
inputs is in the `models` skill.
Placing audio in the design is the video recipe (`../handbook/video.md`).

## Music

1. Find a music model: `asset_generate({ capability: 'text2audio', source: 'all' })`, then read the
   one you pick with `asset_generate({ model, schema: true })`. Prefer one that takes a length (an
   ElevenLabs music model takes a length and a composition plan).
2. Ask for exactly what the edit needs — instrumental, the genre, **the BPM**, 4/4, **the length in
   seconds**, a hit on the first downbeat and a clean ending on the last one:

   ```js
   await asset_generate({
     model, // from the catalog
     prompt:
       'Instrumental electronic pop, 120 BPM, 4/4, 20 seconds. Punchy drum hit on the first ' +
       'downbeat, driving four-on-the-floor, lift at 12 s, clean button ending at 20 s.',
     params: {} // the length / composition-plan fields the schema names
   });
   ```

3. A refusal such as `model_not_supported` costs nothing — take the next music model. A model that
   picks its own length is fine: the audio block's `playback.duration` cuts it to the page.
4. `asset_add` the user's own file instead when they gave one.

## Beat map

The engine analyses the track itself — no program to install. Put the music on the video page as
its own audio block first (`playback.timeOffset` where it starts), then run this as the tail of
that `edit`, or alone in a read-only `edit` (`render: false`), with the block id and the BPM you
asked for. Save the returned JSON as `<out>/build/beats.json`.

```js
// beats.js — the tail of the edit that placed the music, or ONE read-only edit
const beats = await engine.design.readBeats(music, { bpm: 120 }); // the BPM you asked for
return { type: 'text', text: JSON.stringify(beats) };
```

`beats.json` holds `bpm`, `beats` (the grid), `fit`, `accents` (the loudest hits) and `onsets`
(every hit, `strength` 0–1) — every time in page seconds, from `start` (the block's `timeOffset`)
for `duration`. Checked against a click track (tempo within 1 %, beats within one 23 ms analysis
frame) and a syncopated groove whose loud hits repeat every 1.5 beats (the beat, not the 2:3 alias).

- **Beat-tight sync: analyse and play a WAV.** The engine decodes an MP3 tens of milliseconds late,
  and an mp4 export plays it later still. Render the track to WAV first: while the MP3 is the only
  audio on the page, run `export({ format: 'wav', blockId: page })`, then set the music block's
  `audio.fileURI` to the returned `uri` (with `timeOffset` and `trimOffset` 0 — the WAV is the
  page's mix from 0 s) and run `readBeats` at the end of that `edit`. The analysis then reads exactly what the mp4 plays.
- **Pass the tempo you asked for** as `bpm`. `readBeats` settles related tempos itself — a grid at
  2/3 or 3/4 of the beat carries less of the attack and loses — and uses `bpm` only to choose
  between halving and doubling, which fit equally well. `bpm` may still differ from the request by a
  few tenths — that is the track's real tempo; use it.
- **Check `fit`**: `meanErrMs` is how far the hits on the grid sit from it, `onGrid` of `onsets` how
  many sit on it — a click keeps them all, a busy track with off-beat hits about a third. Above
  ~25 ms the lock is loose: listen before cutting to it. `bpm: null` means no rhythm was found (an
  ambient pad): cut on your own grid at the requested BPM.
- **Snap every planned time to the grid**: each cut, each transition's start, each loop pulse moves
  to the nearest `beats` entry. A bar is four beats — cut on bars for the long holds, on single
  beats for the fast runs.
- **Accents get the big moves**: the smash cut, the full-bleed colour flip, the biggest transition,
  the call to action's entrance.
- Keep the cut on the beat and the transition around it: a transition of length `d` into a cut at
  `t` overlaps the two clips from `t` to `t + d`.

## Sound effects

One whoosh or hit per transition carries the cuts. Generate one or two and reuse them — a
sound-effects model takes its description in `text` and a `duration_seconds` (0.5–1 s for a
whoosh). Place each as its own audio block: a whoosh starting ~0.15 s before its cut so the swell
lands on it, a hit starting exactly on the accent. Volume 0.5–0.8 under the music.

## Voiceover and captions (optional)

Only with `voiceover=on`. Write the script to the beat table's timing (~2.5 words per second), then:

1. **Voice** — a text-to-speech model; the voice is an enum in its schema. Its result's `duration`
   says how long the line runs — fit the beat to it, not the other way around. Spell brand names
   the way they are spoken in the voice's text, never in the captions
   (`../models/audio.md`).
2. **Word timings** — a speech-to-text model on that file returns every word with `start`/`end`
   seconds. Group words into caption lines of 2–4 words by those timings; each line is a text clip
   on a captions track at its first word's `start`.
3. **Mix** — duck the music under the voice (`volume` 0.3–0.5 while it speaks).

## Mix-down

Music spans the page with `fadeOut: { duration: 1 }` so the video never ends on a cut-off note;
nothing new starts in the last second. Listen to the export, not the parts — check that every
effect sits on its cut.
