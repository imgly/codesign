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
asked for in its first line. Save the returned JSON as `<out>/build/beats.json`.

```js
// beats.js — the tail of the edit that placed the music, or ONE read-only edit; first line: const MUSIC = <audio block id>, BPM = <requested BPM or null>;
const SR = 22050,
  HOP = 512,
  FPS = SR / HOP;
await engine.block.forceLoadAVResource(MUSIC);
const { playback: pb } = await engine.design.getProps(MUSIC, ['playback']);
const speed = pb.speed || 1,
  from = pb.trimOffset,
  to = Math.min(
    from + pb.duration * speed,
    engine.block.getAVResourceTotalDuration(MUSIC)
  );
const n = Math.max(0, Math.floor((to - from) * FPS)),
  duration = n / FPS;
// The engine's decode at SR, one value per sample: |x| on a 50 dB scale (0 = −50 dBFS, 1 = full scale).
const power = new Float64Array(n);
await new Promise((resolve, reject) => {
  let left = Math.ceil(n / 64);
  if (!left) return resolve();
  engine.block.generateAudioThumbnailSequence(
    MUSIC,
    64 * HOP,
    from,
    from + duration,
    n * HOP,
    1,
    (c, r) => {
      if (r instanceof Error) return reject(r);
      for (let k = 0; k < r.length; k++)
        if (r[k] > 0)
          power[c * 64 + Math.floor(k / HOP)] += 10 ** (5 * (r[k] - 1));
      if (!--left) resolve();
    }
  );
});
const energy = power.map((p) => Math.log1p((1000 * p) / HOP));
const flux = energy.map((e, i) => (i ? Math.max(0, e - energy[i - 1]) : 0));
const W = Math.round(FPS / 2); // adaptive threshold: local mean over ±0.5 s
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
      t: i / FPS,
      attack: flux[i],
      strength: Math.max(...energy.slice(i, i + 4))
    });
}
const sum = (a, f) => a.reduce((s, v) => s + f(v), 0);
const attack = sum(onsets, (o) => o.attack),
  nEff = attack ** 2 / sum(onsets, (o) => o.attack ** 2);
// The onsets within `tol` of the grid `phase + k·period`, each with its beat index k and its error.
const near = (period, phase, tol = Math.min(0.05, period / 8)) =>
  onsets
    .map((o) => ({ o, k: Math.round((o.t - phase) / period) }))
    .map((p) => ({ ...p, err: p.o.t - phase - p.k * period }))
    .filter((p) => Math.abs(p.err) < tol);
// How well a grid explains the attacks: share of attack energy on it, above what chance would put there.
const measure = (period, phase) => {
  const tol = Math.min(0.05, period / 8),
    chance = (2 * tol) / period,
    pts = near(period, phase);
  return {
    period,
    phase: phase - period * Math.floor(phase / period),
    score: sum(pts, (p) => p.o.attack) / attack - chance,
    noise: Math.sqrt((chance * (1 - chance)) / nEff),
    onGrid: pts.length,
    meanErrMs: +(
      (1000 * sum(pts, (p) => Math.abs(p.err))) / pts.length || 0
    ).toFixed(1)
  };
};
// Refine a tempo guess: seed the phase from the attacks, then weighted least squares on the onsets near the grid.
const fit = (period) => {
  let sx = 0,
    sy = 0;
  for (const o of onsets) {
    sx += o.attack * Math.cos((2 * Math.PI * o.t) / period);
    sy += o.attack * Math.sin((2 * Math.PI * o.t) / period);
  }
  let phase = (Math.atan2(sy, sx) / (2 * Math.PI)) * period;
  for (let it = 0; it < 10; it++) {
    const tol = Math.min(0.05, period / 8),
      pts = near(period, phase, tol);
    for (const p of pts)
      p.w = p.o.attack * Math.exp(-(((2 * p.err) / tol) ** 2));
    const w = sum(pts, (p) => p.w),
      mk = sum(pts, (p) => p.w * p.k) / w,
      mt = sum(pts, (p) => p.w * p.o.t) / w,
      vk = sum(pts, (p) => p.w * (p.k - mk) ** 2);
    if (pts.length < 4 || !vk) return null;
    period = sum(pts, (p) => p.w * (p.k - mk) * (p.o.t - mt)) / vk;
    phase = mt - period * mk;
  }
  return measure(period, phase);
};
const ac = (l) => {
  let s = 0;
  for (let i = l; i < n; i++) s += flux[i] * flux[i - l];
  return s;
};
let lag = 0; // tempo guess: autocorrelation peak of the flux over 70–180 BPM
for (
  let l = Math.round((FPS * 60) / 180);
  l <= Math.round((FPS * 60) / 70);
  l++
)
  if (!lag || ac(l) > ac(lag)) lag = l;
// The peak can lock onto a related tempo (2/3, 3/4 …) — keep the alias whose grid carries the most
// attack. Halving or doubling the grid fits by construction, so the requested BPM decides that.
let best = null;
for (const r of [1, 2, 1 / 2, 3 / 2, 2 / 3, 4 / 3, 3 / 4]) {
  const f =
    onsets.length >= 8 &&
    lag / FPS / r >= 0.25 &&
    lag / FPS / r <= 1.5 &&
    fit(lag / FPS / r);
  if (f && (!best || f.score > best.score)) best = f;
}
let grid = best && best.score > 3 * best.noise ? best : null;
if (grid && BPM) {
  const { period: p, phase: ph } = grid,
    half = [measure(2 * p, ph), measure(2 * p, ph + p)].sort(
      (a, b) => b.score - a.score
    )[0];
  const off = (g) => Math.abs(Math.log((60 * speed) / g.period / BPM));
  grid = [grid, half, measure(p / 2, ph)].sort((a, b) => off(a) - off(b))[0];
}
// Analysis time is source seconds from the trim point; report page time.
const page = (t) => +(pb.timeOffset + t / speed).toFixed(3);
const beats = [];
for (let t = grid?.phase; grid && t < duration; t += grid.period)
  beats.push(page(t));
const max = Math.max(...onsets.map((o) => o.strength));
const hits = onsets.map((o) => ({
  t: page(o.t),
  strength: +(o.strength / max).toFixed(2)
}));
return {
  type: 'text',
  text: JSON.stringify({
    start: page(0),
    duration: +(duration / speed).toFixed(3),
    bpm: grid && +((60 * speed) / grid.period).toFixed(2),
    requestedBpm: BPM,
    fit: grid && {
      onsets: onsets.length,
      onGrid: grid.onGrid,
      meanErrMs: grid.meanErrMs
    },
    beats,
    accents: hits.filter((o) => o.strength >= 0.8).map((o) => o.t),
    onsets: hits
  })
};
```

`beats.json` holds `bpm`, `beats` (the grid), `fit`, `accents` (the loudest hits) and `onsets`
(every hit, `strength` 0–1) — every time in page seconds, from `start` (the block's `timeOffset`)
for `duration`. Checked against a click track (tempo within 1 %, beats within one 23 ms analysis
frame) and a syncopated groove whose loud hits repeat every 1.5 beats (the beat, not the 2:3 alias).

- **Beat-tight sync: analyse and play a WAV.** The engine decodes an MP3 tens of milliseconds late,
  and an mp4 export plays it later still. Render the track to WAV first: while the MP3 is the only
  audio on the page, run `export({ format: 'wav', blockId: page })`, then set the music block's
  `audio.fileURI` to the returned `uri` (with `timeOffset` and `trimOffset` 0 — the WAV is the
  page's mix from 0 s) and run the beat map at the end of that `edit`. The analysis then reads exactly what the mp4 plays.
- **Pass the tempo you asked for** as `BPM`. The recipe settles related tempos itself — a grid at
  2/3 or 3/4 of the beat carries less of the attack and loses — and uses `BPM` only to choose
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
