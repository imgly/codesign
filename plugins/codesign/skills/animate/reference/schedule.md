# Scheduler and applier

`schedule.mjs` turns a layer inventory into a timed plan; `apply.js` applies the
plan in ONE `edit`. Write the module to disk and run it with node; never work
out timings by hand.

## Inventory — one read-only edit

Run this block as the whole code of an `edit` with `render: false`. It returns, per page in order,
the page `id`, size and fill kind, every group (`id`, `name`, enclosing `group`) and every leaf
layer: `id`, `type`, `name`, global `bbox`, `fill` kind, the enclosing `group`, and for text blocks
only `text`, `words` and `fontSize` (design px). Text properties exist only on text blocks: reading
them on an image or shape throws.

<!-- prettier-ignore -->
```js
// inventory.js — the whole body of ONE read-only edit (render: false)
const d = engine.design;
const box = (g) => ({ x: Math.round(g.x), y: Math.round(g.y), w: Math.round(g.width), h: Math.round(g.height) });
const fillOf = async (id) => ((await d.getCapabilities(id)).includes('fill') ? ((await d.getProps(id, ['fill'])).fill?.type ?? null) : null);
const pages = [];
for (const page of engine.scene.getPages()) {
  const { width, height } = await d.getProps(page, ['width', 'height']);
  const out = { id: page, width, height, fill: await fillOf(page), groups: [], layers: [] };
  const walk = async (id, group) => {
    const { type, name, globalBoundingBox } = await d.getProps(id, ['type', 'name', 'globalBoundingBox']);
    if (type === 'group') {
      out.groups.push({ id, name, group });
      for (const c of await d.getChildren(id)) await walk(c, id);
      return;
    }
    const layer = { id, type, name, bbox: box(globalBoundingBox), fill: await fillOf(id), group };
    if (type === 'text') {
      const { text } = await d.getProps(id, ['text.string', 'text.fontSize']);
      Object.assign(layer, { text: text.string, words: text.string.split(/\s+/).filter(Boolean).length, fontSize: Math.round(parseFloat(text.fontSize)) });
    }
    out.layers.push(layer);
  };
  for (const c of await d.getChildren(page)) await walk(c, null);
  pages.push(out);
}
return { type: 'text', text: JSON.stringify({ pages }) };
```

Turn it into `input.json`: one entry in `pages` per chosen page, a key and role per layer, every
group's key in that page's `containers`, and every id — each page as `"s<n>"`, each layer and each
group — under `ids`.

## Input

`input.json` is the layer inventory plus the resolved intake. `key` is the tag the agent writes on
each block (`codesign/motion-beat`); `ids` maps keys to this session's block ids. On the first
apply `ids` must also map every page id to its page (`"s1": <page id>`): `apply.js` builds the
video on the first planned page and copies a page's fill when it has no background layer. Re-applies
need no `ids`: blocks are tagged by then. `containers` lists every group: each must span the page,
or its children vanish when the group's 5 s default ends. A Frankfurt poster, calm would be:

```json
{
  "canvas": { "width": 1920, "height": 1080 },
  "intake": {
    "style": "calm",
    "length": 10,
    "ending": "hold",
    "hero": "s1/title"
  },
  "pages": [
    {
      "id": "s1",
      "containers": ["s1/g-art", "s1/g-type"],
      "layers": [
        {
          "key": "s1/bg",
          "role": "background",
          "bbox": { "x": 0, "y": 0, "w": 1920, "h": 1080 }
        },
        {
          "key": "s1/bridge",
          "role": "image",
          "bbox": { "x": 455, "y": 418, "w": 703, "h": 391 }
        },
        {
          "key": "s1/overline",
          "role": "body",
          "words": 5,
          "fontSize": 5,
          "bbox": { "x": 96, "y": 96, "w": 319, "h": 17 }
        },
        {
          "key": "s1/title",
          "role": "headline",
          "words": 1,
          "fontSize": 56,
          "bbox": { "x": 96, "y": 126, "w": 335, "h": 56 }
        },
        {
          "key": "s1/rule",
          "role": "decoration",
          "bbox": { "x": 96, "y": 198, "w": 45, "h": 2 }
        }
      ]
    }
  ],
  "ids": {
    "s1": 3,
    "s1/bg": 12,
    "s1/bridge": 14,
    "s1/overline": 21,
    "s1/title": 22,
    "s1/rule": 23,
    "s1/g-art": 30,
    "s1/g-type": 31
  }
}
```

`intake` carries `style`, `length` (seconds, omit to fit to content), `ending` (`hold`, `loop` or
`outro`) and `hero` (a layer key). A key in `hero`, `static` or `order` that names no layer, or any
other `ending`, throws. One entry in `pages` per page; multi-page layers also carry `sig`.
The script prints the plan; `plan.apply` is what `apply.js` walks.

<!-- prettier-ignore -->
```js
// schedule.mjs
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const PI = Math.PI;

export const TYPES = {
  slide: { easing: true, opts: ['direction', 'fade'] },
  pan: { easing: true, opts: ['direction', 'distance', 'fade'] },
  fade: { easing: true, opts: [] },
  blur: { easing: true, opts: ['fade', 'intensity'] },
  grow: { easing: true, opts: ['direction', 'scaleFactor'] },
  zoom: { easing: true, opts: ['fade'] },
  pop: { easing: false, opts: [] },
  wipe: { easing: true, opts: ['direction'] },
  baseline: { easing: true, opts: ['direction'] },
  crop_zoom: { easing: true, opts: ['fade', 'scale'] },
  spin: { easing: true, opts: ['direction', 'fade', 'intensity'] },
  ken_burns: { easing: true, opts: ['direction', 'fade', 'travelDistanceRatio', 'zoomIntensity'] },
  typewriter_text: { easing: false, opts: [] },
  block_swipe_text: { easing: false, opts: ['blockColor', 'direction', 'useTextColor'] },
  spread_text: { easing: true, opts: ['fade', 'intensity'] },
  merge_text: { easing: true, opts: ['direction', 'intensity'] },
  breathing_loop: { easing: false, opts: ['intensity'] },
  pulsating_loop: { easing: false, opts: ['intensity'] },
  jump_loop: { easing: false, opts: ['direction', 'intensity'] },
  sway_loop: { easing: false, opts: ['intensity'] },
  spin_loop: { easing: false, opts: ['direction'] },
  fade_loop: { easing: false, opts: [] },
  blur_loop: { easing: false, opts: ['intensity'] },
  squeeze_loop: { easing: false, opts: [] },
  scale_loop: { easing: true, opts: ['direction', 'easingDuration', 'endScale', 'holdDuration', 'startDelay', 'startScale'] }
};
const COMMON = new Set(['type', 'duration', 'writingStyle', 'overlap']);

export function legal(spec) {
  const t = TYPES[spec.type];
  if (!t) throw new Error(`unknown animation type '${spec.type}'`);
  const out = {};
  for (const [k, v] of Object.entries(spec)) {
    if (k === 'easing') {
      if (t.easing) out.easing = v;
    } else if (COMMON.has(k)) out[k] = v;
    else if (k !== spec.type) throw new Error(`'${spec.type}' has no option '${k}'`);
    else {
      for (const o of Object.keys(v)) if (!t.opts.includes(o)) throw new Error(`'${spec.type}' has no option '${o}'`);
      out[k] = { ...v };
    }
  }
  return out;
}

export const STYLES = {
  calm: {
    stagger: 0.25, dur: 1.0, heroDur: 1.2, easing: 'EaseOutQuint',
    image: { type: 'fade' }, text: { type: 'fade', writingStyle: 'Line' },
    hero: { type: 'blur', blur: { fade: true } }, decoration: { type: 'wipe', wipe: { direction: 'Right' } },
    loop: { type: 'breathing_loop' },
    transition: { type: 'cross-fade', duration: 0.8, easing: 'EaseInOutQuint' }
  },
  energetic: {
    stagger: 0.12, dur: 0.4, heroDur: 0.5, easing: 'EaseOutBack',
    image: { type: 'slide' }, text: { type: 'block_swipe_text', writingStyle: 'Line' },
    hero: { type: 'zoom', zoom: { fade: true } }, decoration: { type: 'pop' },
    loop: { type: 'pulsating_loop' },
    transition: { type: 'push', direction: 'Left', duration: 0.4, easing: 'EaseInOutQuint' }
  },
  playful: {
    stagger: 0.15, dur: 0.55, heroDur: 0.7, easing: 'EaseOutSpring',
    image: { type: 'pop' }, text: { type: 'baseline', writingStyle: 'Character', overlap: 0.4 },
    hero: { type: 'spin', spin: { fade: true } }, decoration: { type: 'grow' },
    loop: { type: 'sway_loop' },
    transition: { type: 'stack', direction: 'Up', duration: 0.5, easing: 'EaseInOutQuint' }
  },
  cinematic: {
    stagger: 0.4, dur: 1.3, heroDur: 1.6, easing: 'EaseInOutQuart',
    image: { type: 'blur', blur: { fade: true } }, text: { type: 'spread_text', writingStyle: 'Word' },
    hero: { type: 'grow' }, decoration: { type: 'fade' },
    loop: null,
    transition: { type: 'fade-to-black', duration: 1.0, easing: 'EaseInOutQuart' }
  }
};
export const STYLE_ORDER = ['cinematic', 'calm', 'playful', 'energetic'];
const RANK = { background: 0, image: 1, body: 2, decoration: 3, headline: 4, logo: 5, cta: 6, hero: 7 };
export const TEXT_MIN = (words) => Math.max(0.8, 0.3 * words);
const r3 = (x) => Math.round(x * 1000) / 1000;
const up = (x) => Math.ceil(x * 10 - 1e-9) / 10;

export function slideFrom(bbox, canvas) {
  const edges = [
    [bbox.x, 0],
    [bbox.y, PI / 2],
    [canvas.width - (bbox.x + bbox.w), PI],
    [canvas.height - (bbox.y + bbox.h), (3 * PI) / 2]
  ];
  return edges.reduce((a, c) => (c[0] < a[0] ? c : a))[1];
}

function pickHero(layers) {
  const texts = layers.filter((l) => (l.words ?? 0) > 0 && l.role !== 'body');
  const pool = texts.length ? texts : layers.filter((l) => l.role === 'image');
  const area = (l) => l.bbox.w * l.bbox.h;
  return [...pool].sort((a, b) => (b.fontSize ?? 0) - (a.fontSize ?? 0) || area(b) - area(a))[0]?.key ?? null;
}

function entranceFor(l, S, canvas, o, hero) {
  const d = (hero ? S.heroDur : S.dur) * o.speed;
  let spec;
  if (l.role === 'background')
    spec = { type: 'crop_zoom', duration: Math.min(3, Math.max(1.2, S.dur * 2.5)) * o.speed, easing: 'EaseOutQuint', crop_zoom: { fade: false, scale: 1.12 } };
  else if (hero) spec = { ...S.hero, duration: d, easing: S.easing };
  else if (l.role === 'logo') spec = { type: S.image.type === 'pop' || S.decoration.type === 'pop' ? 'pop' : 'fade', duration: d, easing: S.easing };
  else if (l.role === 'body' || ((l.words ?? 0) > 0 && (l.fontSize ?? 99) < 24)) spec = { type: 'fade', duration: d, easing: 'EaseOutQuint' };
  else if ((l.words ?? 0) > 0) spec = { ...S.text, duration: d, easing: S.easing };
  else if (l.role === 'decoration') spec = { ...S.decoration, duration: d, easing: S.easing };
  else {
    spec = { ...S.image, duration: d, easing: S.easing };
    if (spec.type === 'slide') spec.slide = { direction: slideFrom(l.bbox, canvas), fade: true };
  }
  if (o.noBounce) {
    if (spec.type === 'pop') spec = { type: 'fade', duration: spec.duration, easing: 'EaseOutQuint' };
    if (/Back|Spring/.test(spec.easing ?? '')) spec.easing = 'EaseOutQuint';
  }
  spec.duration = r3(spec.duration);
  return legal(spec);
}

function sceneBeats(layers, S, canvas, o) {
  const animated = layers.filter((l) => l.role !== 'overlay' && !o.static.includes(l.key));
  const heroKey = o.hero && animated.some((l) => l.key === o.hero) ? o.hero : pickHero(animated);
  const rank = (l) =>
    o.order[l.key] === 'first' ? 0.5 : o.order[l.key] === 'last' ? 99 : l.key === heroKey ? 8 : (RANK[l.role] ?? 3);
  const list = [...animated].sort((a, b) => rank(a) - rank(b) || a.bbox.y - b.bbox.y || a.bbox.x - b.bbox.x);
  let t = 0;
  const beats = list.map((l) => {
    const hero = l.key === heroKey;
    const start = l.role === 'background' ? 0 : r3((t += S.stagger * o.speed));
    return { key: l.key, role: hero ? 'hero' : l.role, words: l.words ?? 0, start, in: entranceFor(l, S, canvas, o, hero) };
  });
  return { heroKey, beats };
}

function exitSpan(beats, S, o) {
  if (!beats.length) return 0;
  return (beats.length - 1) * S.stagger * 0.5 * o.speed + Math.max(...beats.map((b) => b.in.duration * 0.6));
}

function fitLength(beats, ending, S, o, delay = 0) {
  const settle = delay + Math.max(0, ...beats.map((b) => b.start + b.in.duration));
  const read = delay + Math.max(0, ...beats.filter((b) => b.words > 0).map((b) => b.start + b.in.duration + TEXT_MIN(b.words)));
  const tail = ending === 'outro' ? 0.2 : ending === 'loop' ? 0.1 : 0;
  const exit = ending === 'hold' ? 0 : exitSpan(beats, S, o) + tail;
  return up(Math.max(settle / 0.6, read + exit));
}

function withEnding(beats, len, ending, S, o, heroKey) {
  const n = beats.length;
  return beats.map((b, i) => {
    const e = { ...b, end: r3(len) };
    if (ending === 'loop' && b.role === 'background') return { ...e, in: undefined };
    if (ending !== 'hold' && b.role !== 'background') {
      const tail = ending === 'outro' ? 0.2 : 0.1;
      e.end = r3(len - tail - (n - 1 - i) * S.stagger * 0.5 * o.speed);
      e.out = legal({ ...b.in, duration: r3(b.in.duration * 0.6) });
    }
    if (ending === 'loop' && b.key === heroKey) e.loop = legal({ ...(S.loop ?? { type: 'breathing_loop' }), duration: 2 });
    return e;
  });
}

const ENDINGS = ['hold', 'loop', 'outro'];

function options(intake, pages) {
  if (intake.ending != null && !ENDINGS.includes(intake.ending)) throw new Error(`unknown ending '${intake.ending}' (hold, loop or outro)`);
  const keys = new Set(pages.flatMap((p) => p.layers.map((l) => l.key)));
  for (const k of [...(intake.hero == null ? [] : [intake.hero]), ...(intake.static ?? []), ...Object.keys(intake.order ?? {})])
    if (!keys.has(k)) throw new Error(`no layer '${k}' on any page`);
  return {
    speed: intake.speed ?? 1,
    noBounce: intake.noBounce === true,
    static: intake.static ?? [],
    order: intake.order ?? {},
    hero: intake.hero ?? null
  };
}

function entryOf(b) {
  return { key: b.key, timeOffset: b.start, duration: r3(b.end - b.start), in: b.in ?? null, out: b.out ?? null, loop: b.loop ?? null };
}

function single(i, S, o) {
  const p = i.pages[0];
  const ending = i.intake.ending ?? 'hold';
  const { heroKey, beats } = sceneBeats(p.layers, S, i.canvas, o);
  const fit = fitLength(beats, ending, S, o);
  const L = i.intake.length ? Math.max(i.intake.length, fit) : fit;
  const timed = withEnding(beats, L, ending, S, o, heroKey).map((b) => ({ ...b, scene: p.id }));
  const animatedKeys = new Set(timed.map((b) => b.key));
  const apply = [
    { page: true, duration: L },
    ...(p.containers ?? []).map((key) => ({ key, timeOffset: 0, duration: L })),
    ...timed.map(entryOf),
    ...p.layers.filter((l) => !animatedKeys.has(l.key)).map((l) => ({ key: l.key, timeOffset: 0, duration: L, in: null, out: null, loop: null }))
  ];
  return { length: L, stretched: !!i.intake.length && fit > i.intake.length, T: 0, scenes: [{ id: p.id, start: 0, length: L }], beats: timed, apply };
}

export function schedule(input) {
  const { ids, ...rest } = input;
  const S = STYLES[rest.intake.style];
  if (!S) throw new Error(`unknown style '${rest.intake.style}'`);
  const o = options(rest.intake, rest.pages);
  const body = rest.pages.length === 1 ? single(rest, S, o) : multi(rest, S, o);
  return { v: 1, input: rest, ...(ids ? { ids } : {}), ...body };
}

const TRAVEL = { Left: PI, Right: 0, Up: (3 * PI) / 2, Down: PI / 2 };
const MOVING = new Set(['push', 'slide', 'stack']);

function exitFor(tr) {
  if (MOVING.has(tr.type))
    return legal({ type: 'slide', duration: tr.duration, easing: tr.easing, slide: { direction: TRAVEL[tr.direction], fade: false } });
  return legal({ type: 'fade', duration: tr.duration, easing: tr.easing });
}

function multi(i, S, o) {
  const ending = i.intake.ending ?? 'hold';
  const N = i.pages.length;
  const tr = { ...S.transition, duration: r3(S.transition.duration * o.speed) };
  const T = tr.duration;
  const isChrome = (l) => !!l.sig && !['background', 'overlay', 'image'].includes(l.role);
  const count = new Map();
  for (const p of i.pages) for (const s of new Set(p.layers.filter(isChrome).map((l) => l.sig))) count.set(s, (count.get(s) ?? 0) + 1);
  const shared = (l) => isChrome(l) && count.get(l.sig) === N;
  const bgIn = (l) => entranceFor(l, S, i.canvas, o, false);

  const scenes = i.pages.map((p, n) => {
    const bg = p.layers.find((l) => l.role === 'background') ?? null;
    const overlay = p.layers.find((l) => l.role === 'overlay') ?? null;
    const content = p.layers.filter((l) => l !== bg && l !== overlay && !shared(l));
    const last = n === N - 1;
    const sb = sceneBeats(content, S, i.canvas, o);
    const delay = n > 0 ? T : 0;
    const bgFit = bg && (n === 0 || !MOVING.has(tr.type)) ? bgIn(bg).duration / 0.6 : 0;
    const fit = Math.max(fitLength(sb.beats, last ? ending : 'hold', S, o, delay), up(bgFit));
    return { p, n, bg, overlay, content, last, ...sb, fit };
  });
  const per = i.intake.length ? i.intake.length / N : 0;
  const LEN = up(Math.max(per, ...scenes.map((s) => s.fit)));
  const L = r3(LEN * N);

  const apply = [{ page: true, duration: L }];
  for (const s of scenes)
    for (const l of s.p.layers.filter(shared))
      apply.push(
        s.n === 0
          ? { key: l.key, timeOffset: 0, duration: L, in: legal({ type: 'fade', duration: 0.3, easing: 'EaseOutQuint' }), out: null, loop: null, front: true }
          : { key: l.key, destroy: true }
      );

  const beats = [];
  for (const s of scenes) {
    const start = r3(s.n * LEN);
    const span = r3(LEN + (s.last ? 0 : T));
    const nextHasOverlay = !s.last && !!scenes[s.n + 1].overlay;
    const moved = s.n > 0 && MOVING.has(tr.type);
    if (s.bg)
      apply.push({ key: s.bg.key, track: 'bg', timeOffset: start, duration: span, in: moved ? null : bgIn(s.bg), out: null, loop: null, transition: s.last ? null : { ...tr } });
    else
      apply.push({ key: `${s.p.id}/bg`, create: 'page-fill', source: s.p.id, track: 'bg', timeOffset: start, duration: span, in: null, out: null, loop: null, transition: s.last ? null : { ...tr } });
    if (s.overlay) {
      const enters = s.n > 0 && !scenes[s.n - 1].overlay;
      const leaves = !s.last && !nextHasOverlay;
      apply.push({ key: s.overlay.key, track: 'overlay', timeOffset: start, duration: span, in: enters ? exitFor(tr) : null, out: leaves ? exitFor(tr) : null, loop: null, transition: nextHasOverlay ? { ...tr } : null });
    }

    if (!s.content.length) continue;
    const gStart = r3(s.n === 0 ? 0 : start + T);
    const gDur = r3(start + span - gStart);
    const g = `${s.p.id}/content`;
    apply.push({ group: g, members: s.content.map((l) => l.key), timeOffset: gStart, duration: gDur, in: null, loop: null, out: s.last ? null : exitFor(tr) });
    const timed = withEnding(s.beats, gDur, s.last ? ending : 'hold', S, o, s.heroKey);
    const keys = new Set(timed.map((b) => b.key));
    for (const b of timed) {
      beats.push({ ...b, scene: s.p.id });
      apply.push({ ...entryOf(b), parent: g });
    }
    for (const l of s.content.filter((l) => !keys.has(l.key)))
      apply.push({ key: l.key, parent: g, timeOffset: 0, duration: gDur, in: null, out: null, loop: null });
  }
  return {
    length: L,
    stretched: !!i.intake.length && LEN * N > i.intake.length + 1e-9,
    T,
    scenes: scenes.map((s) => ({ id: s.p.id, start: r3(s.n * LEN), length: LEN })),
    beats,
    apply
  };
}

export function transform(plan, change) {
  const input = structuredClone(plan.input);
  const x = input.intake;
  switch (change.kind) {
    case 'slower': x.speed = (x.speed ?? 1) * 1.3; break;
    case 'faster': x.speed = (x.speed ?? 1) / 1.3; break;
    case 'first':
    case 'last': x.order = { ...(x.order ?? {}), [change.key]: change.kind }; break;
    case 'noBounce': x.noBounce = true; break;
    case 'energy':
    case 'calmer': {
      const k = STYLE_ORDER.indexOf(x.style) + (change.kind === 'energy' ? 1 : -1);
      x.style = STYLE_ORDER[Math.min(STYLE_ORDER.length - 1, Math.max(0, k))];
      break;
    }
    case 'static': x.static = [...(x.static ?? []), change.key]; break;
    case 'ending': x.ending = change.to; break;
    default: throw new Error(`unknown change '${change.kind}'`);
  }
  return schedule({ ...input, ...(plan.ids ? { ids: plan.ids } : {}) });
}

if (process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])) {
  const doc = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const out = process.argv[3] ? transform(doc, JSON.parse(process.argv[3])) : schedule(doc);
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}
```

## apply.js — one edit

Prepend `const PLAN = <plan.json contents>;`. Run it as one `edit`: the first apply from the still's revision, every re-apply with a transformed plan from the latest animated revision (the still has no `codesign/motion-beat` tags, and a stored plan carries no ids).

<!-- prettier-ignore -->
```js
// apply.js — the body of ONE edit; first line of that edit: const PLAN = <schedule.mjs output>;
const b = engine.block, d = engine.design;
const TAG = 'codesign/motion-beat';
engine.scene.setMode('Video');
const tagged = new Map();
for (const id of b.findAll()) if (b.hasMetadata(id, TAG)) tagged.set(b.getMetadata(id, TAG), id);
const found = (key) => { const id = tagged.get(key) ?? PLAN.ids?.[key]; return id !== undefined && b.isValid(id) ? id : undefined; };
const idOf = (key) => { const id = found(key); if (id === undefined) throw new Error(`no block for '${key}': tag it or pass its id in PLAN.ids`); return id; };
const tag = (key, id) => { b.setMetadata(id, TAG, key); tagged.set(key, id); }; // engine.block: metadata has no facade path
const motion = engine.scene.getPages().find((p) => b.hasMetadata(p, 'codesign/motion'));
const planned = motion !== undefined ? [motion] : PLAN.input.pages.map((p) => idOf(p.id));
const [page, ...rest] = planned;
for (const p of engine.scene.getPages()) if (!planned.includes(p)) await d.destroy(p);

await d.setProps(page, { playback: { duration: PLAN.length } });
for (const a of PLAN.apply) if (a.destroy && found(a.key) !== undefined) await d.destroy(idOf(a.key));

const tracks = {};
const trackFor = async (name) => {
  if (tracks[name] !== undefined) return tracks[name];
  let t = (await d.findByName(`${name}-track`))[0];
  if (t === undefined) {
    t = await d.create({ type: 'track', name: `${name}-track` }, { parent: page });
    b.insertChild(page, t, name === 'bg' ? 0 : 1); // engine.block: z-order insert has no facade verb
    b.setBool(t, 'track/automaticallyManageBlockOffsets', false); // engine.block: no track/* props path
  }
  return (tracks[name] = t);
};
for (const a of PLAN.apply.filter((x) => x.track)) {
  if (a.create === 'page-fill' && found(a.key) === undefined) {
    const id = await d.create({ type: 'graphic', name: a.key, props: { shape: { type: 'rect' }, width: b.getWidth(page), height: b.getHeight(page) } }, { parent: page });
    b.setFill(id, b.duplicate(b.getFill(idOf(a.source)))); // engine.block: copying a page fill has no facade verb
    tag(a.key, id);
  }
  const id = idOf(a.key);
  const t = await trackFor(a.track);
  if (b.getParent(id) !== t) b.appendChild(t, id); // engine.block: reparent into the track
}

const groups = {};
for (const a of PLAN.apply.filter((x) => x.group)) {
  let g = (await d.findByName(a.group))[0];
  if (g === undefined) {
    const ids = a.members.map(idOf);
    for (const id of ids) if (b.getParent(id) !== page) b.appendChild(page, id); // engine.block: move onto the video page
    g = await d.group(ids);
    await d.setProps(g, { name: a.group });
  }
  groups[a.group] = g;
}

for (const a of PLAN.apply) {
  if (a.destroy || a.page) continue;
  const id = a.group ? groups[a.group] : idOf(a.key);
  if (a.key) tag(a.key, id);
  await d.setProps(id, { playback: { timeOffset: a.timeOffset, duration: a.duration } });
  if ('in' in a || 'out' in a || 'loop' in a) await d.setProps(id, { animations: { in: a.in ?? null, loop: a.loop ?? null, out: a.out ?? null } });
}

for (const a of PLAN.apply.filter((x) => x.track)) {
  const id = idOf(a.key);
  const old = b.getTransition(id);
  if (b.isValid(old)) {
    b.removeTransition(id); // engine.block: no facade path
    if (b.isValid(old)) await d.destroy(old);
  }
  if (!a.transition) continue;
  const t = b.createTransition(a.transition.type); // engine.block: transitions have no facade verb
  await d.setProps(t, { playback: { duration: a.transition.duration } });
  if (a.transition.direction) b.setEnum(t, `transition/${a.transition.type}/direction`, a.transition.direction); // engine.block: transition options have no facade path
  b.setEnum(t, 'animationEasing', a.transition.easing); // engine.block: no facade path
  b.setTransition(id, t); // engine.block: no facade path
}

for (const a of PLAN.apply) if (a.front) b.appendChild(page, idOf(a.key)); // engine.block: z-order to front
let left = 0;
for (const p of rest) {
  if (b.getChildren(p).length === 0) await d.destroy(p);
  else left++;
}
b.setMetadata(page, 'codesign/motion', JSON.stringify({ v: PLAN.v, input: PLAN.input })); // engine.block: metadata has no facade path
return { type: 'text', text: `animated ${PLAN.length}s · ${PLAN.apply.length} entries · ${left} source page(s) still hold unplanned blocks` };
```
