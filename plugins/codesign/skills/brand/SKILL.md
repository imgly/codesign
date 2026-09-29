---
name: brand
description: >-
  Use when applying a brand kit / brand style to an existing CoDesign / CE.SDK design — a
  rules-governed restyle (recolor + refont + logo + treatment by role), not a free-form style
  change; when a restyled design reads off-brand (free-chosen colors, wrong accent, a second
  colour used as structure, a coloured button the brand forbids, a headline set in a weight the
  brand bans, a flat bordered card, or the wrong / recoloured / redrawn logo); when loading a
  brand's fonts, wordmark SVG, or signature device into a scene; or when turning an external brand
  (a guidelines PDF, a website / URL, a Figma file, or a raw asset dump) into a reusable brand kit.
---

# brand

Point this skill at the current design and a brand kit, and it re-skins the design to that brand
under the brand's **strict rules**. It operates on the **latest revision of the current design**
(re-ground via `list()` / `history()` if unsure — handbook §1); the restyle lands as a new
revision, forked from the source. Single home for the brand workflow: the **role → token map**,
the **restyle routine**, the **graded conformance pass**, and the brand **no-goes**.

It builds on things it does _not_ restate: handbook §6.1–§6.5 (the general typography / colour /
hierarchy / composition / craft thresholds), the handbook's engine mechanics (the `text.font`
declaration, fill specs, auto-reshape, `loadResources`, the content-area line-height
conversion §6.1.3), and its two siblings. The brand kit's own `tokens.json` supplies the
**values**; this skill supplies the **procedure**.

**Scoring:** a restyle is judged with the `judge` skill — every applicable axis ≥ 8, no averaging,
N/A = 10. The brand kit's `avoid` list + `do-dont/` gallery are an **additional** gate on top of
the axes: a single hard `avoid` violation (a second colour used as structure, a banned button, a
redrawn logo, a free-chosen colour) fails the restyle even if the axes would pass — include an
"avoid-list" row in the judge scorecard.

## Reference files (load on demand)

This `SKILL.md` is the always-needed spine: inputs, core principle, role map, workflow, restyle
routine, conformance pass, the **brand conformance checklist**, no-goes. Two situational bodies live
beside it:

- **`reference/brandkit-spec.md`** — the canonical brand-kit **schema** (what `tokens.json` must
  contain, required-core vs optional sections, how the skill degrades when a section is absent).
  Read it when validating a kit or unsure what a token means.
- **`reference/authoring.md`** — the **intake** mode: turning an _external_ brand (a guidelines PDF,
  a website/URL, a Figma file, or a raw asset dump) into a canonical `<kit>/` before
  applying — extraction per source form, the not-invent discipline, the avoid-list hard-stop, the
  font-subset trap. Read it whenever the kit isn't already a valid canonical folder.
- **`reference/asset-loading.md`** — the **asset mechanics** (resolving brand fonts to a fetchable
  URI incl. the local-TTF → `workspace://` bridge, the hex → 0-1 RGBA conversion, placing the
  wordmark SVG, recolouring monochrome icons, building the **kicker pill** on a text background,
  block-**opacity** vs colour-alpha, `text.color` vs colour-fill, the whole-block colour that
  flattens per-run colour). Unlike
  its two siblings this one is NOT situational — every restyle touches fonts, colours, or the
  logo, so it is required reading before the restyle routine; it lives beside the spine only to
  keep this entry document lean.

## localize / resize vs brand — the three surgeries

The three sibling skills each change exactly one layer and hold the rest fixed:

- **localize** — changes the **words** (+ the script's font); **snaps geometry** back to
  the reference. Any geometry move is drift.
- **resize** — changes the **canvas**; **re-derives geometry** for the new aspect. Copy
  and style are held.
- **brand** — changes the **style layer** (colour, type, logo, treatment) **by role**;
  **holds copy and composition**. Geometry moves only in the graded conformance pass, and only
  where a brand _rule_ requires it — never a free re-layout.

Never confuse them: don't re-word or re-flow inside a brand pass (that's localize / resize), and
if a brand genuinely needs a different _layout_ (not just a different skin), that is a **resize**,
not a brand restyle — cross-ref and stop, don't silently re-compose.

## Inputs — what to restyle, into which brand, in which scheme

Resolve these by the intake contract — derive, ask once, echo, invent nothing:
`../handbook/intake.md`. **R** = required, no default; **A** = ask if
underived; **D** = defaultable.

| Parameter     | Kind    | Chips / values                                                            | Default                               |
| ------------- | ------- | ------------------------------------------------------------------------- | ------------------------------------- |
| brand kit     | **R**   | the kits found in the workspace · `Provide a brand source` · Other        | **none — never invented**             |
| colour scheme | A       | the chosen kit's `colorSchemes.approved` · `Decide automatically` · Other | the neutral / `paper` scheme          |
| source design | derived | —                                                                         | latest revision of the current design |

**1. The source** — the latest revision of the current design. A restyle preserves that revision's
geometry and copy; only the style layer changes. If the user means an earlier design, find it via
`list()` / `history()` first.

**2. The brand kit** — a folder the user points you at (`<kit>/`), holding `tokens.json` (+
`BRAND.md`, fonts, logos, icons, imagery, `do-dont/`). Parse `tokens.json` **first**; it is the
machine-readable law. Validate it against `reference/brandkit-spec.md`.

If no kit is named, **ask** — _**Which brand should this use?**_ — offering the kits you can find
in the workspace plus `Provide a brand source`. A brand is the user's own fact: there is no
defaulting to "a sensible brand", and no proceeding on an inferred one.

If what the user gives you is **not** a canonical kit yet — an external source (a guidelines PDF, a
website/URL, a Figma file, or a raw asset dump), or a folder with no valid `tokens.json` —
**scaffold it into the canonical shape first** (extract → map → `tokens.json` + `BRAND.md` + assets
→ validate), per **`reference/authoring.md`**, then apply against the new kit. Ask the user where
the kit folder should live; it is theirs to keep and reuse.

**If the required-core is incomplete, ask for the missing piece — don't stop, and don't guess.**
Never fill a gap in a kit with a value of your own: not a colour, not a typeface, not a logo.
Name what is missing and ask for exactly that, e.g.

> The Acme kit has no display font — `typography.display` is empty, and I won't pick one for your
> brand.
> **Which font should headlines use?** `Provide a font file` · `Name a Google font` ·
> `Use the kit's body font` · Other

**3. The scheme** — one **approved** `colorScheme` from `tokens.colorSchemes.approved`, chosen
deliberately per `backgroundSelection` (default the neutral/`paper` scheme; use the full-bleed
brand-colour scheme only for a deliberate hero). If the kit offers more than one approved scheme
and nothing in the request implies which, ask — _**Which colour scheme?**_ — with the kit's own
approved schemes as chips plus `Decide automatically`. Reading the chips from `tokens.json` is not
invention; free-choosing a `(bg, text, accent)` triple is. **One scheme per piece** — never a
`denied` combination.

Then echo what you resolved in one line ("acme restyle, paper scheme (defaulted), 1 design") and
run the Workflow. The restyled revision gets a `note` naming the brand and scheme (e.g. "acme
restyle, paper scheme").

## Core principle — re-skin by role, then conform to the brand's law

A brand kit is not a palette swap — it is a **role system**. Restyling is two layers:

- **Layer 1 — Restyle (always).** Classify each source block by its **design role**, then set its
  colour + font + treatment from the **brand token for that role** (background → scheme background;
  headline → display family; the one focal moment → accent; eyebrow → kicker style; …). Geometry
  unchanged. This is deterministic once roles are mapped.
- **Layer 2 — Graded conformance.** Enforce the brand's structural law where it does **not** fight
  the source composition: kill every hard `avoid` / `denied` violation (non-negotiable), then apply
  the applicable structural rules (proportion, safe-area margins, kicker-as-pill, card shadow,
  signature device, size thresholds). A rule that would require re-laying-out the piece is
  out-of-scope — flag it (→ resize), don't force it.

The brand's `avoid` list is the floor: **no restyle ships with a hard `avoid` violation**, even if
every axis scores ≥ 8.

## Role → token map

Classify by measurable role (as in the localize skill's block classification), then map:

| Source block role                    | Brand token (from `tokens.json`)                                                                                                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| full-bleed background                | chosen `colorSchemes.approved[].background`                                                                                                                                                                                          |
| headline / display / big number      | `typography.display` family; text = scheme `text` (or `primary-foreground` on a colour field); **respect `headlineWeight`** — never exceed the brand's weight _at that size_ (a `typography.display.weightRule` may vary it by size) |
| subline / lead / body                | `typography.body` family; text = scheme `text` or `muted-foreground`                                                                                                                                                                 |
| the single focal moment (one accent) | scheme `accent` / `semanticColors.primary` — **one per piece**, but the `avoid` list wins (see the trap below): on a full-bleed brand-colour scheme the accent role often has **no valid target** — drop it, the field is the moment |
| eyebrow / kicker                     | `elements.kicker` (pill shape + its text colour) — not a bare coloured label                                                                                                                                                         |
| divider / rule                       | `elements.divider` (hairline) — never a coloured/second-colour stroke                                                                                                                                                                |
| card / panel / tile                  | `shape` corner radius + `elevation` shadow — never a flat bordered box                                                                                                                                                               |
| CTA                                  | `elements.button` **only on interactive/mockup media**; on static media a CTA is text/URL                                                                                                                                            |
| logo / wordmark                      | `logo.variantsByBackground` picked by the chosen background — exact bundled SVG only; if the asset is `$meta.gaps`-flagged (trademark-locked / not fetched), skip or placeholder it, never invent/redraw                             |
| monochrome icon                      | recolour its ink to the role colour (`reference/asset-loading.md`)                                                                                                                                                                   |
| photographic / product media         | keep; grade per `imagery` if the brand specifies; never tint to a banned colour                                                                                                                                                      |

Where the source has no block for an optional brand element (device, kicker), the conformance pass
_may_ add it if it fits; where the brand kit lacks an optional token, skip that rule (graceful
degradation — `reference/brandkit-spec.md`).

**The scheme-accent trap — `avoid` overrides the scheme.** A `colorSchemes.approved` entry may list
an `accent` the `avoid` list forbids in the context you're applying it (e.g. IMG.LY's `indigo-moment`
lists a mint accent, but `avoid` bans mint text on an indigo field). When the scheme's accent and
the `avoid` list conflict, **the `avoid` list wins**: apply **no** accent and let the full-bleed
field be the moment. Do not add a mint (or any denied) accent just because the role map has an
"accent" row — an empty accent role is correct here.

**Non-hero archetypes.** The role map is written for a headline+subline hero, but many designs aren't
one — a quote card is eyebrow / quote-as-display / attribution-caption with no "lead". Map by the
_nearest_ role (quote → `typography.display`; attribution → `typography.body`/caption) and ignore
rows with no matching block; don't invent a subline to satisfy `typography.pairing`.

## Workflow

1. **Load & validate the brand kit.** Parse `tokens.json`; read `avoid` + skim `do-dont/`. Resolve
   every needed font to a fetchable URI and `asset_add` the logo SVG(s) — **`reference/asset-loading.md`**.
2. **Read the source.** The latest revision resolved in Inputs is the reference — its geometry and
   copy are what the restyle preserves.
3. **Capture source roles + style.** Walk the scene; classify blocks by role; read each block's
   current colour / font / geometry (see routine).
4. **Pick one approved scheme** per piece (per `backgroundSelection`); pick the logo variant by the
   chosen background.
5. **Layer 1 — Restyle.** Fork the source; for each block set the brand token for its role — recolour,
   refont (unique `typeface.name`), apply radius/shadow/accent, swap the logo. **Re-map the accent
   runs in the same write** — a font/size change auto-reshapes with ranges preserved, but the
   whole-block role colour flattens per-character colour, so the accent runs go back on as
   `text.ranges` in that same `setProps`. Geometry untouched.
6. **Layer 2 — Graded conformance.** Fix every hard `avoid`/`denied` violation; apply the structural
   rules that fit the source (proportion ~ the brand's ratio, safe-area margins, kicker pill, card
   shadow, device placement, size thresholds). Flag any layout-level need as out-of-scope (→ resize).
7. **Judge against the source** — a restyle is a **source-derived variant**: `preview` the source
   revision too and diff the two renders. Copy, geometry, and composition must be the source's; only
   the style layer moved. Then run the `judge` skill with the brand `avoid`/`do-dont` added to the
   criteria; contrast ≥ 4.5:1 after every recolour. Fix anything < 8 or any hard violation.
8. **`loadResources` → `preview` → export.** Preview every restyle — wrong face, lost colour,
   low contrast, and a banned tell only show in the render.

Dry-run the conformance checklist (below) against each render before reporting done.

## The restyle routine

Layer-1 as a CoDesign `edit`, run on a fork of the source revision. It classifies, maps role →
token, and recolours/refonts with the accent re-map guard. It is a **judgment-driven
first pass** (the role classification and the focal-moment choice need your eye), not a blind
transform. Adapt the classification to the design; fill `SCHEME` and the font URIs from the kit
(resolve fonts per `reference/asset-loading.md`).

**Capture the source's roles + current style** (run on the source page):

```js
const page = engine.scene.getPages()[0];
const out = [];
(function walk(id) {
  const p = await engine.design.getProps(id, [
    'type',
    'width',
    'height',
    'position',
    'opacity'
  ]);
  const r = {
    id,
    type: p.type, // the SHORT name: 'text', 'graphic', 'page'
    x: Math.round(p.position.x),
    y: Math.round(p.position.y),
    w: Math.round(p.width),
    h: Math.round(p.height),
    opacity: p.opacity
  }; // a "faint" block is usually low opacity, NOT low colour-alpha
  if (p.type === 'text') {
    const t = (await engine.design.getProps(id, ['text'])).text;
    r.s = t.string.slice(0, 20);
    r.color = t.color; // run 0 = the base style; per-run truth is text.ranges
    // the read carries its unit ('32px', always pixels) and writes straight back
    r.fs = (await engine.design.getProps(id, ['text.fontSize'])).text.fontSize;
  }
  if (id !== page) out.push(r);
  for (const c of await engine.design.getChildren(id)) walk(c);
})(page);
const pg = await engine.design.getProps(page, ['width', 'height']);
return {
  type: 'text',
  text: JSON.stringify({ pw: pg.width, ph: pg.height, b: out }, null, 1)
};
```

**Apply brand tokens to a fork** (first pass, then conform + preview):

```js
// hex '#RRGGBB' -> CE.SDK 0-1 RGBA. See reference/asset-loading.md.
const rgba = (hex, a = 1) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a
});
const tf = (name, uri) => ({
  name,
  fonts: [{ uri, subFamily: 'Regular', weight: 'normal', style: 'normal' }]
});

// --- from the kit: the chosen approved scheme + resolved font URIs (unique names!) ---
const SCHEME = { background: '#FBFBFC', text: '#2E2E2F', accent: '#471AFF' };
const DISPLAY = {
  uri: 'workspace://assets/<sha>.ttf',
  name: 'GT Walsheim Pro Medium'
}; // headlineWeight only
const BODY = { uri: 'workspace://assets/<sha>.ttf', name: 'Inter' };
// A font swap changes the content area, so re-convert any target line-height from the NEW
// font's metrics — not a fixed factor (handbook §6.1.3). Call after the font write; the
// lineHeight write reshapes on its own, ranges preserved.
const setLineHeight = (id, targetLH) =>
  await engine.design.setProps(id, { text: { lineHeight: { visual: targetLH } } });

const page = engine.scene.getPages()[0];
await engine.design.loadResources([page]);
// classify from the capture (background = full-bleed graphic; headline = largest text;
// lead/body = remaining text; eyebrow = small text above headline; logo/media = image fills).

// text: ONE write — font + size + role colour + the re-mapped accent ranges. The font/size
// write auto-reshapes with ranges preserved, so there is no capture → reshape → replay dance;
// the runs are read only because the whole-block role colour flattens per-character colour.
const setTextRole = (id, font, hex, px, accentHex) => {
  const runs = (await engine.design.getProps(id, ['text.ranges'])).text.ranges; // NOT text.color — that is run 0 only
  await engine.design.setProps(id, {
    text: {
      font: { typeface: tf(font.name, font.uri), uri: font.uri },
      ...(px ? { fontSize: px + 'px' } : {}), // the unit is required
      color: rgba(hex), // role colour = the base style
      // When RE-branding, re-map the accent runs to the new brand's accent — replaying
      // r.color verbatim would keep the OLD brand's colour. The old face's typeface/style
      // are NOT replayed: the new family may not ship them.
      ranges: runs.slice(1).map((r) => ({
        from: r.from,
        to: r.to,
        color: accentHex ? rgba(accentHex) : r.color,
        ...(r.weight ? { weight: r.weight } : {})
      }))
    }
  });
};
// graphic fill (background / accent shape)
const setFillRole = (id, hex) => {
  await engine.design.setProps(id, {
    fill: { type: 'color', color: { value: rgba(hex) } }
  });
};
// e.g.:  setFillRole(bgId, SCHEME.background);
//        setTextRole(headlineId, DISPLAY, SCHEME.text);
//        setTextRole(leadId,     BODY,    SCHEME.text);
//        setTextRole(accentWordId, DISPLAY, SCHEME.accent);   // the ONE accent moment
// logo: asset_add the variant SVG for this background, set as image fill (asset-loading.md).

await engine.design.loadResources([page]);
return {
  type: 'text',
  text: 'restyled — now run the conformance pass and preview'
};
```

## Graded conformance pass (Layer 2)

After the restyle, walk the render against the kit and fix — hard `avoid`/`denied` first
(non-negotiable), then structural rules where they fit the source:

- **Hard `avoid` / `denied`** (always fix): a second/accent colour used as a stroke, underline,
  divider, label, or icon (accent is a fill pop only); the accent colour as a button fill when the
  kit bans it; a headline in a banned weight; a flat bordered card with no shadow; the logo redrawn,
  recoloured, or the wrong background variant; a free-chosen colour or a `denied` scheme; a
  background that matches a placed photo's dominant hue.
- **Proportion** — roughly the kit's neutrals/text/accent ratio (e.g. 70/20/10). If it reads
  "colourful", there's too much accent and too little neutral.
- **Safe-area margins** — content inside the kit's outer margin; logo in its clear zone; nothing
  crowds an edge, the media, or the logo. If it doesn't fit, shrink the headline — never the subline.
- **Elements** — eyebrow → pill kicker; divider → hairline; CTA → text/URL on static media (only a
  real button on interactive/mockup media, in the kit's button style).
- **Wordmark vs preserved copy** — if the source's _copy_ already carries a **foreign brand** in the
  signature slot (a handle/URL for a different brand, kept because copy is preserved), don't overwrite
  it and don't imply the foreign brand is yours. Place the brand wordmark in a **non-competing**
  safe-area corner as the publisher mark, treat the foreign handle as attribution, or omit the
  wordmark — never stack two brands as co-equal marks.
- **Device** (optional) — if the kit has a signature device and the composition has room, place it
  per its placement grammar (one per piece, bleed off one edge, atmosphere behind content).
- **Size thresholds** — drop the wordmark for the symbol / drop the kicker below the kit's minimums
  rather than shrinking them illegibly.

A fix that would require re-laying-out the piece (not just re-skinning) is **out of scope** — record
it and recommend a resize.

## Before reporting done

Run the **brand conformance checklist** below against each render — **with the source render beside
it** — then close with a `judge` run (the `judge` skill; a restyle is a source-derived variant, so
its source-parity diff is a mandatory gate step, and the kit's `avoid` list is an extra scorecard
row on top of the axes). Score honestly — a surviving hard `avoid` violation is a fail, say so.

### Brand conformance checklist

Any "no" on an applicable line drops the axis below 8 (or, for the `avoid` rows, fails the restyle
outright).

**Source parity — what a restyle must NOT change**

- [ ] **Copy verbatim** — every string is the source's string; nothing re-worded, shortened, or
      dropped to fit the new face. (Re-wording is `localize`.)
- [ ] **Geometry held** — every block sits at its source position and size; the only moves are ones a
      named brand rule demanded (safe-area margin, kicker pill, size threshold), and you can name
      which rule for each
- [ ] **Element inventory complete** — every source cluster (text, image, chip, icon, decoration) has a
      counterpart; nothing dropped, nothing invented to satisfy a role row
- [ ] **Role parity** — the block that was the background is still the background, the one accent
      moment is still that block, the divider is still a divider. Values changed; roles didn't
- [ ] **Hierarchy preserved** — the same dominant element, the same reading order; relative weight and
      size order across blocks matches the source (§6.3)
- [ ] **Group hierarchy intact** — the restyle didn't flatten or re-nest the source's groups
- [ ] **No re-wrap fallout** — the font swap didn't change any block's line count into an overflow,
      a collision, or a pushed neighbour (diff line counts against the source, not just positions)

**Brand conformance — what a restyle must change**

- [ ] **Zero hard `avoid` / `denied` violations** — no accent as structure (stroke/underline/divider/
      label/icon), no banned button or headline weight, no flat bordered card, no free-chosen colour,
      no `denied` scheme combination
- [ ] **Logo untampered** — exact bundled SVG, the variant matching the chosen background, scaled
      proportionally; never redrawn, recoloured, or stretched; `$meta.gaps`-flagged assets skipped,
      not invented
- [ ] **One approved scheme**, applied whole; the accent role empty where the `avoid` list forbids it
      on this field (the scheme-accent trap)
- [ ] **Every role mapped to its token** — display family on headlines, body family on body, kicker as
      a pill, divider as a hairline, card radius + elevation; rows with no matching block skipped, not
      forced
- [ ] **Proportion** ≈ the kit's neutrals/text/accent ratio; the piece doesn't read "colourful"
- [ ] **Safe-area margins + logo clear zone** respected; nothing crowds an edge, the media, or the mark
- [ ] **No competing marks** — a foreign brand preserved in the copy is attribution, not a co-equal
      lockup with the kit's wordmark

**Craft / baseline**

- [ ] **Fonts actually swapped** — unique `typeface.name` per URI; a static file where a bold is
      needed (a variable TTF renders its default instance)
- [ ] **Accent colours survived the recolour** — the whole-block role colour flattens per-run
      colour, so every accent run went back on as a `text.ranges` entry in the same write; no block
      left at the engine default
- [ ] **Contrast ≥ 4.5:1** for every text block on its actual background, checked after recolour
- [ ] **Zero tofu** — the brand font covers every glyph in the preserved copy, checked in `preview`
- [ ] Native export dimensions (the page's own pixel size)

## No-goes / red flags

- **Free-chosen colour** — a colour not from an approved scheme / a ramp step. Pick a scheme; move
  along a ramp for variation; never invent a hue.
- **Accent used as structure** — the brand's accent (e.g. a mint/green) as a stroke, tick, underline,
  divider, label, or icon. Accent is a rare fill pop, not a co-lead.
- **Banned button / weight** — a coloured button the kit forbids, a drawn button on static media, or
  a headline in a weight the kit doesn't ship.
- **Logo tampering** — recreating, redrawing, recolouring, or stretching the wordmark, or the wrong
  background variant (dot vanishes on a matching fill). Exact bundled SVG only; scale proportionally.
- **Role colour flattened the accent** — a whole-block `text.color` write collapses every run to
  the role colour. Re-apply the accent runs as `text.ranges` in the same `setProps`.
- **Font not actually swapped** — a new URI under a reused `typeface.name` silently no-ops; or a
  variable TTF renders only its default instance (no bold). Unique names; static file for bold.
- **Tofu** — brand font lacks a glyph in the copy; only `preview` catches it.
- **Contrast fail** — text < 4.5:1 after recolour (esp. on a colour field). Re-pick the role colour.
- **Geometry drift** — moving/re-flowing blocks in a restyle. This is not resize; hold the source
  geometry (conformance moves only what a brand _rule_ demands).
- **Copy drift** — re-wording, shortening, or dropping a line because the brand face runs longer.
  Copy is held; fix the type (size within its band, measure, leading), never the text. Rewriting is
  `localize`'s layer, not this one.
- **Re-wrap fallout** — the swapped face has different advance widths, so an auto-height block can
  re-wrap to a new line count, grow, and collide with or push a neighbour **without any block being
  moved**. Geometry looks held and the layout still broke. Diff line counts against the source after
  the refont, not just positions.
- **Role inversion** — every value came from the kit, but a role moved: a rule recoloured into a
  second lead, a caption promoted to the accent moment, the background and card swapped. Values
  change in a restyle; roles don't.
- **Judged in isolation** — scoring the restyle's own PNG without the source beside it. A restyle is
  a source-derived variant; the source-parity diff is a mandatory gate step (`judge`), not a
  nice-to-have.

## Cross-references

- **`reference/brandkit-spec.md`** — the brand-kit schema contract (required-core vs optional;
  graceful degradation) — the _target shape_.
- **`reference/authoring.md`** — the intake mode: ingesting an external brand (PDF / URL / Figma /
  asset dump) into that shape — _how to reach it_.
- **`reference/asset-loading.md`** — font-URI resolution (CDN + local-TTF → `workspace://` bridge),
  hex → RGBA, logo SVG placement, icon recolour, colour-fill mechanics.
- handbook §6.1–§6.5 — the general typography / colour / hierarchy / composition / craft
  thresholds this skill applies through a brand's values; and the handbook's engine mechanics
  (the `text.font` declaration, fill specs, auto-reshape, `loadResources`, content-area
  line-height conversion §6.1.3, pixel font sizes).
- **`judge`** — the acceptance gate; a restyle is judged as a **source-derived variant** (preview the
  source, diff the two renders), with the brand's `avoid` list added to the criteria as its own
  scorecard row.
- **`localize`** — translate a design (snap geometry); **`resize`** — reformat a design
  (re-derive geometry). Brand is the third surgery (swap the style layer).
