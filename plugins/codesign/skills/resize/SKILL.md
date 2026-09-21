---
name: resize
description: >-
  Use when resizing or reformatting a CoDesign / CE.SDK design to a new size or aspect ratio
  (ig-post ↔ ig-square ↔ ig-story ↔ widescreen, or a custom W×H); when building the size/format
  editions of a design from an existing design or from a brief; or when a reformatted
  edition has a dead void / letterboxed empty band, drifted or broken margins, off-canvas or
  clipped elements, mis-scaled decoration, or a stretched / squished layout.
---

# resize

Point this skill at the current design and one or more target formats, and it produces or repairs the size/format editions by **re-composing** each for its new aspect. It operates on the **latest revision of the current design** (re-ground via `list()` / `history()` if unsure — handbook §1); each produced format is a new revision (a non-destructive fork of the source). Single home for the resize workflow, the re-composition technique, and the reformat **no-goes**.

Builds on two things it does _not_ restate: handbook §6.3 Hierarchy + §6.4 Composition & grid (margins as % of the shortest dimension, the spacing ladder, balanced whitespace / no dead void, nothing off-canvas) and §6.1.2 type-scale bands; and the handbook's engine mechanics (the `text.font` declaration, auto-reshape, `loadResources`). For the _same-aspect, translate-the-strings_ case, use the `localize` skill instead.

**Scoring:** reformatting is judged with the `judge` skill — every applicable axis ≥ 8. A dead void, a stretched element, a broken margin, or anything off-canvas fails **composition**.

## Reference files (load on demand)

This `SKILL.md` holds the always-needed spine: inputs, the localize-vs-resize distinction, core
principle, workflow, the re-composition routine, the no-goes, and the **resize composition
checklist** (end of this file). Per-format data lives in the **`formats` skill** — exact W×H,
aspect, and platform safe zones, one file per format: `../formats/SKILL.md` for the index,
`../formats/<id>.md` for the format(s) you're building.

## Localize vs resize — snap vs re-compose

**Format is the outer distinction: a different format is a different layout; a different language is the same layout with different strings.**

- **localize** — _same_ canvas: change words + the script's font, then **snap every block
  back to the reference geometry**. Any geometry deviation is drift.
- **resize** — _new_ canvas: the geometry **must** change. You **re-derive** the layout
  from the design system on the new canvas. Here "drift" is not "moved from the reference" — it's
  re-composition that **loses the design's identity** or leaves the canvas **unbalanced**.

Never confuse the two: don't snap a resize (that reproduces the source's proportions on the wrong
canvas → a dead void), and don't re-compose a localization (that's how localized sets drift).

## Inputs — what to resize, and into what

Two inputs, resolved before any work by the intake contract — derive, ask once, echo, invent
nothing: `../handbook/intake.md`. **R** = required, no default; **A** =
ask if underived; **D** = defaultable.

| Parameter      | Kind    | Chips / values                                                                                       | Default                               |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- |
| target formats | **R**   | `Instagram post` · `Instagram story` · `LinkedIn` · `Widescreen` · `A4 print` · `Custom W×H` · Other | none                                  |
| source design  | derived | —                                                                                                    | latest revision of the current design |

**1. The source** — the latest revision of the current design. Every target format is re-composed _from_ that source — **never resize a resize** (don't chain: fork each format from the native source revision). If the user asks to resize an earlier design, find it via `list()` and its latest revision via `history()` first. If the request is a brief (no design exists yet), **build the native base first** at the brief's canvas per handbook §6, preview and sanity-check it, then treat that revision as the source.

**2. The formats** — named formats (`ig-post`, `ig-square`, `ig-story`, `widescreen`, and the
rest of the `formats` skill's index) or a custom `W×H`. Resolve each named format's exact size,
aspect, and safe zones from the **`formats` skill** (`../formats/<id>.md`).

If the format set is not stated, **ask** — _**Which sizes do you need?**_ — with the chips above;
a format set has no sensible default, so never pick one for the user. Then echo the resolved set
("1 design → 3 formats") before building.

## Core principle — re-compose for the aspect, preserve the system

A new format is a **new layout**. Re-lay it out for the new canvas while holding the **design
system** constant:

- **Invariant (carry to every format):** palette + the single accent; type-scale _bands_ (headline
  / body / caption as % of page height, §6.1.2); margin ratio (§6.4: 8–12% of the shortest side);
  spacing scale (§6.4 ladder); hierarchy order (§6.3); the **group hierarchy** (carry the source's
  grouping — re-group each cluster after re-composition, don't ship a flattened tree); the **region
  of interest** of every image/video fill (the subject stays framed — see the ROI section below);
  each decoration's _role_ (a ghost quote stays a ghost quote); the **element inventory** (every
  content cluster on the source has a counterpart on the new canvas — see below); and the
  **appearance** of every block (fill/gradient, effect/blur stack, opacity, corner radius, stroke,
  shadow, and font weight — carried by forking, not re-created by eye).
- **Element inventory — nothing silently dropped.** A reformat re-composes; a tight format tempts
  you to drop elements, and the result reads "way too simplistic / missing elements from the
  original." Before finishing, **count**: every text cluster, image, chip, icon, and decoration on
  the source must have a counterpart on the new canvas. An element may be **omitted only
  deliberately** (it genuinely can't earn its place on a smaller canvas) — never by oversight, and
  the omission is a judgment you can name. Re-composing from an _impression_ of the source instead
  of its actual block list is how elements vanish.
- **Variable (re-derive per canvas):** absolute positions, absolute sizes, wrap width, line count,
  and how the content group is distributed vertically.

Never **stretch or squish** the whole design to force-fit (that distorts type and shapes — resize
by re-flow, not by scaling the canvas contents). Never leave a **lopsided void** (§6.4).

## Workflow

1. **Read the source's design system** (palette, accent, type bands, margin %, spacing rhythm,
   hierarchy) and **capture its layout as fractions** of the source canvas (positions/sizes as % of
   source W/H — see routine).
2. **Fork the source** per target format; **capture the region of interest** of every image/video
   fill first (ROI section below); **set the page** to the new W×H and resize the full-bleed
   background to cover it; then **restore each fill's ROI** so the same region of the image stays
   framed — never let a `Cover` fill silently re-center the subject on the new aspect.
3. **Re-derive from the new canvas:** margins = 8–12% of the new **shortest** dimension; type sizes
   from the new page **height** within their bands (§6.1.2); gaps from the spacing scale (§6.4).
4. **Proportional re-flow to fill, then balance.** Place blocks by their captured fractions × the
   new canvas (this fills a taller/wider canvas instead of letterboxing it), then **center or
   distribute the content group within the platform safe band** — no top-anchored void. (Safe-zone
   bounds and per-format guidance: the `formats` skill, `<id>.md`.)
5. **Scale decoration proportionally** to the canvas (a ghost glyph sized as % of page height grows
   on a taller format, shrinks on a shorter one) — keep its role and framing.
6. **Re-wrap & re-fit:** text re-wraps at the new column width; check **overflow / clipping /
   off-canvas**; adjust size _within its band_ only.
7. **Let the size/font write carry the rich text.** A `text.fontSize` / `text.font` /
   `text.lineHeight` write reshapes on its own and **preserves every per-character style range** —
   color, weight, style, case, decoration (handbook §6.1.3). A resize keeps the **same string**, so
   there is nothing to capture and replay. What still flattens the accent is a **whole-block**
   styling write: `getProps(id, ['text.color']).text.color` reads run 0 only, and writing it back as
   `text: { color }` collapses the whole block to run 0's formatting. Don't re-apply whole-block
   styling in a resize; if you must, pass the runs from `getProps(id, ['text.ranges'])` back as
   `text: { ranges: [...] }` in the same `setProps` — **every** run, not just the accent.
8. **`loadResources` → `preview` each format** (dead void / crop / tofu only show in the
   render). Each format lands as its own revision — give each a `note` naming the format (e.g.
   "ig-story 1080×1920").

## Proportional re-composition routine

The resize analog of localize's snap-to-reference — but a **first pass, not the finish**. It fills
the new canvas proportionally (killing the letterbox void); you then clamp margins/bands/safe-zones
and **judge the balance in `preview`**. Resize is judgment-driven; there is no single deterministic
answer.

**Capture the source as fractions** (run on the source page):

```js
const page = engine.scene.getPages()[0];
const pg = await engine.design.getProps(page, ['width', 'height']);
const PW = pg.width,
  PH = pg.height;
const out = [];
async function walk(id) {
  const p = await engine.design.getProps(id, [
    'type',
    'width',
    'height',
    'position'
  ]);
  const r = {
    type: p.type, // the SHORT name: 'text', 'graphic', 'page'
    fx: p.position.x / PW,
    fy: p.position.y / PH,
    fw: p.width / PW,
    fh: p.height / PH
  };
  if (p.type === 'text') {
    const t = (await engine.design.getProps(id, ['text'])).text;
    r.s = t.string;
    // the size read carries its unit ('32px', always pixels) — parse for math
    r.ffs = parseFloat(t.fontSize) / PH; // fraction of page height
    r.lh = t.lineHeight;
    r.ls = t.letterSpacing;
    r.align = t.horizontalAlignment;
  }
  if (id !== page) out.push(r);
  for (const c of await engine.design.getChildren(id)) await walk(c);
}
await walk(page);
return { type: 'text', text: JSON.stringify({ PW, PH, blocks: out }, null, 1) };
```

**Apply to a forked source at the new size** (first pass, then clamp):

```js
const NW = 1080,
  NH = 1920; // target format
const SAFE_TOP = 250,
  SAFE_BOT = 320; // ig-story/reel UI chrome (authoritative per-format values: formats skill, <id>.md); 0 for post/square/widescreen
const page = engine.scene.getPages()[0];
await engine.design.setProps(page, { width: NW, height: NH });

// full-bleed background → cover the new page (don't reposition it proportionally)
let bg;
for (const id of await engine.design.getChildren(page)) {
  const p = await engine.design.getProps(id, ['type', 'width']);
  if (p.type === 'graphic' && p.width >= NW * 0.9) {
    bg = id;
    break;
  }
}
if (bg !== undefined) {
  const roi = await captureFill(bg); // BEFORE the aspect change — ROI section
  await engine.design.setProps(bg, {
    position: { x: 0, y: 0 },
    width: NW,
    height: NH
  });
  await reapplyFill(bg, roi); // keep the same image region framed on the new aspect
}
// ...and captureFill/reapplyFill around EVERY other image/video-fill block you resize.

// content blocks → position/size by captured fractions (fill), then you clamp + balance below
// for each captured fraction f matched to its block id:
//   await engine.design.setProps(id, { position: { x: f.fx*NW, y: f.fy*NH } }); // fills the taller canvas
//   if (f.fw) await engine.design.setProps(id, { width: f.fw*NW });
//   if (f.ffs) await engine.design.setProps(id, { text: { fontSize: clampToBand(f.ffs*NH) + 'pt' } });
//              // the unit is required; the write auto-reshapes, ranges preserved
//
// THEN, not optional:
//   • margins: ensure left/right within 8–12% of min(NW,NH); re-center centered blocks on NW.
//   • safe band: shift the whole content group so nothing vital sits above SAFE_TOP or below NH-SAFE_BOT.
//   • balance: if proportional spread looks airy/crowded, distribute the group evenly or center it —
//     preview and adjust. Scale decoration with the canvas; keep type within §6.1.2 bands.
return {
  type: 'text',
  text: 'first pass placed — now clamp margins/safe-zone/balance and preview'
};
```

Platform safe zones and per-format notes are in the `formats` skill — read `<id>.md` for each
target format.

## Preserve the region of interest (image / video / pattern fills)

Re-flowing positions is only half the job. A block backed by an **image or video fill** shows a
_window_ onto its source, and that window is recomputed when the block's frame **aspect** changes:
a `Cover` fill re-centers, a `Crop` fill exposes gaps. Left alone, the resize crops the **subject**
out of frame — the face, product, logo, or focal point that made the asset worth using. That is a
composition **and** craft failure, and it only shows in `preview`.

**The ROI is defined by** (all on the block, via the `api` skill): `contentFill.mode`
(`Crop | Cover | Contain`); for the auto modes, `contentFill.horizontalAlignment` +
`contentFill.verticalAlignment` (`Left|Center|Right`, `Top|Center|Bottom`) — this is the focal side
a `Cover` fill keeps; and for `Crop`, `crop.scaleRatio` + `crop.translationX/Y` (translation in
**% of the crop frame**) + `crop.rotation`, which pin an explicit window.

**Capture before the resize, re-apply after** — around every fill-bearing block, not just the
background:

```js
async function captureFill(id) {
  // image/video/pixel fills only
  const caps = await engine.design.getCapabilities(id);
  if (!caps.includes('contentFillMode')) return null;
  const cf = (await engine.design.getProps(id, ['contentFill'])).contentFill;
  const cap = {
    mode: cf.mode,
    hAlign: cf.horizontalAlignment,
    vAlign: cf.verticalAlignment
  };
  if (cap.mode === 'Crop') {
    const c = (await engine.design.getProps(id, ['crop'])).crop;
    cap.crop = {
      sr: c.scaleRatio,
      tx: c.translationX,
      ty: c.translationY,
      rot: c.rotation
    };
  }
  return cap;
}

async function reapplyFill(id, cap) {
  if (!cap) return;
  await engine.design.setProps(id, {
    contentFill: {
      mode: cap.mode,
      horizontalAlignment: cap.hAlign, // ROI focus for Cover/Contain
      verticalAlignment: cap.vAlign
    }
  });
  if (cap.mode === 'Crop' && cap.crop) {
    const c = cap.crop;
    await engine.design.setProps(id, {
      crop: { rotation: c.rot, translationX: c.tx, translationY: c.ty }
    });
    await engine.design.adjustCropToFillFrame(id, c.sr); // refill gaps, keep scale ≥ source
  }
}
```

**Order matters:** `captureFill` **before** you write the block's `width`/`height`, `reapplyFill`
**after**. `setProps(id, { crop: null })` forces the mode back to `Cover`, so never call it in a resize
path. Default to keeping the ROI **centered**; when the brief or the asset's metadata names a focal point, bias
`alignment` (Cover) or `translation` (Crop) toward it. `preview` each format and confirm the subject
is still framed — the render is the only place ROI drift shows.

**Crop invariants — the three properties every fill-in-a-frame must hold** (checked in `preview`;
they fail independently of ROI focus, and a shape frame — circle/rounded card — makes them easy to
miss):

1. **Full coverage, zero gap.** The fill covers its frame completely — no sliver of empty frame at
   any edge (the "gap at the top of the circle" defect). If the aspect change exposed a gap,
   `adjustCropToFillFrame` (Crop) or the Cover mode refills it; never leave the frame partly unfilled.
2. **Uniform scale — no stretch.** The image scales the **same on both axes**; a fill stretched to
   fit a new aspect (`Contain` into a non-matching frame, or a hand-set non-uniform crop) distorts
   the subject. Scale is one ratio, not two.
3. **Subject inside the window.** After 1–2, the focal point is still within the visible crop, not
   pushed out by the refill. This is the ROI check above — do it last, after coverage is guaranteed.

**Re-group after re-composition.** Resize moves and resizes loose blocks; before you finish, restore
the source's **group hierarchy** on the new canvas (handbook §4 "Group blocks & hierarchy") so each
format ships the same grouped, nested structure — not a flattened tree.

## No-goes / red flags

- **Dead void / letterboxing** — the headline failure: content clustered on one side of a
  taller/wider canvas, an empty band elsewhere. Fill or balance the group; respect safe zones.
- **Design drift** — re-composition that loses the design's identity: margins wander, the type
  scale or hierarchy shifts, the accent is misused, or decoration loses its role. Re-compose
  _within_ the system, don't redesign.
- **Stretch / squish** — scaling the canvas contents non-proportionally to force-fit. Never distort
  type or shapes; re-flow instead.
- **Broken margin rhythm** — margins not re-derived from the new shortest dimension, or asymmetric.
- **Off-canvas / clipping / overflow** — elements pushed past the new edges; decoration over-cropped;
  text overflowing the new column.
- **Decoration mis-scale** — a ghost glyph or accent kept at the source's absolute size instead of
  scaling with the canvas.
- **ROI drift** — a resized image/video fill re-centered and cropped the subject out of frame
  (face, product, logo, focal point). Capture and re-apply the fill's region of interest.
- **Missing elements** — the reformat re-composed from an impression and silently dropped source
  content ("too simplistic / elements missing from the original"). Inventory every source cluster
  against the new canvas; omit only deliberately, never by oversight.
- **Appearance drift** — a block's fill/gradient/effect/corner-radius/overlay differs from the
  source, or an overlay was added/removed the source didn't have (a cover that "became darker").
  Appearance is inherited by forking; don't re-create or restyle it by eye.
- **Crop broken** — a fill leaves a gap inside its frame, or was stretched non-uniformly. See the
  three crop invariants (coverage, uniform scale, subject-in-window).
- **Flattened hierarchy** — the resize dropped the source's group blocks and shipped a flat list of
  siblings. Re-group each cluster (nested where nested) on the new canvas.
- **Ignoring platform safe zones** — vital content under story/reel UI chrome.
- **tofu / overflow at new wrap widths** — a new measure can push a glyph the font lacks, or wrap to
  a line count that overflows; only `preview` catches it.

## Before reporting done

Run the **resize composition checklist** below against each format's render, then close with a `judge` run per format (the `judge` skill; composition and hierarchy are the axes reformatting most often breaks). Score honestly — a residual void is a composition fail, say so.

### Resize composition checklist

Any "no" on an applicable line drops the axis below 8.

**Composition (§6.4)**

- [ ] Margins 8–12% of the new shortest dimension; on the shared grid / one alignment
- [ ] Whitespace balanced — **no lopsided dead void / letterbox**; content occupies or balances the canvas
- [ ] Consistent spacing scale (§6.4 ladder); nothing off-canvas, clipped, or overlapping
- [ ] Primary content within the format's safe band (per its `formats` file; story/reel: clear of top ~250px / bottom ~320px)

**Hierarchy (§6.3) & identity**

- [ ] One dominant element preserved; reading order intact; ≈3 levels
- [ ] Palette + single accent, type-scale bands (§6.1.2), and each decoration's role carried over
- [ ] Decoration scaled proportionally to the canvas (not the source's absolute size)
- [ ] Every image/video fill keeps its **region of interest** — subject/focal point still framed, nothing important cropped out or newly empty (checked in `preview`)
- [ ] Source's **group hierarchy** restored on the new canvas (grouped clusters, nested where nested — not a flat list)
- [ ] **Element inventory complete** — every source content cluster (text, image, chip, icon, decoration) has a counterpart on the new canvas; any omission is deliberate and nameable, not an oversight
- [ ] **Appearance parity** — every block's fill/gradient, effect/blur, opacity, corner radius, stroke, shadow, and font weight match the source; no overlay added or removed the source didn't have (checked against the source render)

**Craft / baseline**

- [ ] No stretch/squish; type re-fit within its band, not distorted
- [ ] **Crop invariants** hold on every fill-in-frame — full coverage (no gap), uniform scale (no stretch), subject inside the window (checked in `preview`)
- [ ] Zero tofu / overflow at the new wrap width, checked in `preview`
- [ ] Native export dimensions (the page's own pixel size)

## Cross-references

- **`formats` skill** — per-format W×H, aspect, and platform safe zones (one file per format id).
- handbook §6.3 Hierarchy, §6.4 Composition & grid, §6.1.2 type-scale bands — the general composition criteria this skill operationalizes; §6.1.2's canvas table for type sizing by % of page height; and the handbook's engine mechanics (the `text.font` declaration, auto-reshape, `loadResources`, dirty-on-throw).
- **`judge`** — the acceptance gate every produced format must pass.
- **`localize`** — the sibling for _translating_ a design at the _same_ size (snap, don't re-compose).
