# Sound — music, beat map, effects, voice

Reference for the `launch-video` skill: score the video before building it, then cut to the music.
Generation runs through `asset_generate` and needs a signed-in account; how to find a model, read its
input schema and pass its inputs is in the `models` skill. Placing audio in the design is the video
recipe (`../handbook/video.md`).

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

Write this script to `<out>/build/beats.mjs` and run it on the track (it needs `ffmpeg` on the
PATH): `node <out>/build/beats.mjs music.mp3 > <out>/build/beats.json`.

```js
// node beats.mjs <audio> > beats.json — beat grid, onsets and accents from any audio ffmpeg reads.
import { execFileSync } from 'node:child_process';
const SR = 22050,
  HOP = 512;
const pcm = execFileSync(
  'ffmpeg',
  [
    '-v',
    'error',
    '-i',
    process.argv[2],
    '-ac',
    '1',
    '-ar',
    String(SR),
    '-f',
    'f32le',
    '-'
  ],
  { maxBuffer: 1 << 30 }
);
const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
const fps = SR / HOP,
  n = Math.floor(x.length / HOP);
const energy = new Float64Array(n);
for (let i = 0; i < n; i++) {
  let s = 0;
  for (let j = i * HOP; j < (i + 1) * HOP; j++) s += x[j] * x[j];
  energy[i] = Math.log1p((1000 * s) / HOP);
}
const flux = energy.map((e, i) => (i ? Math.max(0, e - energy[i - 1]) : 0));
const W = Math.round(fps / 2); // adaptive threshold: local mean over ±0.5 s
const onsets = [];
for (let i = 1; i < n - 1; i++) {
  let m = 0;
  for (let k = Math.max(0, i - W); k < Math.min(n, i + W); k++) m += flux[k];
  m /= Math.min(n, i + W) - Math.max(0, i - W);
  if (
    flux[i] > 1.5 * m &&
    flux[i] > 0.05 &&
    flux[i] >= flux[i - 1] &&
    flux[i] > flux[i + 1]
  )
    onsets.push({
      t: +(i / fps).toFixed(3),
      strength: Math.max(...energy.slice(i, i + 4))
    });
}
if (onsets.length < 4) {
  console.log(
    JSON.stringify({
      duration: +(x.length / SR).toFixed(3),
      bpm: null,
      beats: [],
      accents: [],
      onsets
    })
  );
  process.exit(0);
}
const ac = (l) => {
  let s = 0;
  for (let i = l; i < n; i++) s += flux[i] * flux[i - l];
  return s;
};
let lag = 0; // tempo: autocorrelation of the flux over 70–180 BPM, peak refined to sub-frame
for (
  let l = Math.round((fps * 60) / 180);
  l <= Math.round((fps * 60) / 70);
  l++
)
  if (!lag || ac(l) > ac(lag)) lag = l;
const [a, b, c] = [ac(lag - 1), ac(lag), ac(lag + 1)];
const period = (lag + (a - c) / (2 * (a - 2 * b + c) || 1)) / fps;
let sx = 0,
  sy = 0; // grid phase: strength-weighted circular mean of onset times modulo the period
for (const o of onsets) {
  const th = (2 * Math.PI * o.t) / period;
  sx += o.strength * Math.cos(th);
  sy += o.strength * Math.sin(th);
}
const phase =
  ((((Math.atan2(sy, sx) / (2 * Math.PI)) * period) % period) + period) %
  period;
const duration = x.length / SR,
  beats = [];
for (let t = phase; t < duration; t += period) beats.push(+t.toFixed(3));
const max = Math.max(...onsets.map((o) => o.strength));
for (const o of onsets) o.strength = +(o.strength / max).toFixed(2);
const accents = onsets.filter((o) => o.strength >= 0.8).map((o) => o.t);
console.log(
  JSON.stringify({
    duration: +duration.toFixed(3),
    bpm: +(60 / period).toFixed(1),
    beats,
    accents,
    onsets
  })
);
```

`beats.json` holds `bpm`, `beats` (the grid, seconds), `accents` (the loudest hits) and `onsets`
(every hit, `strength` 0–1). Checked against a click track: tempo within 1 %, beats within one
23 ms analysis frame, every downbeat reported as an accent.

- Compare `bpm` with the tempo you asked for. Half or double means the grid locked onto every other
  beat — halve or double it. `bpm: null` means no rhythm was found (an ambient pad): cut on your
  own grid at the requested BPM.
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
   says how long the line runs — fit the beat to it, not the other way around.
2. **Word timings** — a speech-to-text model on that file returns every word with `start`/`end`
   seconds. Group words into caption lines of 2–4 words by those timings; each line is a text clip
   on a captions track at its first word's `start`.
3. **Mix** — duck the music under the voice (`volume` 0.3–0.5 while it speaks).

## Mix-down

Music spans the page with `fadeOut: { duration: 1 }` so the video never ends on a cut-off note;
nothing new starts in the last second. Listen to the export, not the parts — check that every
effect sits on its cut.
