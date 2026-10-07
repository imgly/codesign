---
name: localize
description: >-
  Use when creating or fixing translated / localized variants of an existing CoDesign / CE.SDK
  design (e.g. de/ja/ru/ar editions); when a localized edition's text blocks or
  decorative elements have drifted, re-centered, or resized away from the source layout; when
  translated copy is tofu, overflowing, mis-tracked, or the wrong font after a language swap; or
  when loading a non-Latin script (Cyrillic / CJK / Arabic RTL / Vietnamese) font into a scene.
  Also for animated / video designs: longer holds, re-timed reveals, a new voice-over and captions
  per language.
---

# localize

Point this skill at the current design and the target locales, and it produces or repairs the localized editions. It operates on the **design in the current session**, and each locale is **saved as its own `.imgly` file**. Single home for localizing CoDesign designs: the **operational workflow**, the **font-loading mechanics**, and the **per-language quality rules**. It builds on two things it does _not_ restate: handbook §6.1 (general typographic thresholds — leading, tracking, all-caps, the content-area line-height conversion (`design.font`), smart punctuation, reshape-recolor) and handbook §6.7 (general Latin font mechanics — single-URI `text.font` declarations, static-vs-variable, blank-glyph diagnosis). This skill is the non-Latin / localization extension of both.

**Scoring:** localizing is judged with the `judge` skill — every applicable axis ≥ 8, no averaging, N/A = 10. A single tofu glyph, an overflow after expansion, un-mirrored RTL, or a block that drifted off the source grid fails the edition (the `localization` axis).

## Reference files (load on demand)

This `SKILL.md` holds the always-needed spine: inputs, core principle, workflow, block
classification, and the snap-to-reference routine. Two situational bodies of rules live beside it
and are pulled in only when the task needs them:

- **`reference/font-loading.md`** — getting a non-Latin / non-handbook face to render (jsDelivr
  picks, weights from a variable file, font-declaration gotchas, the silent-sans failure). Read it whenever the
  target locale needs a Cyrillic / CJK / Arabic / Vietnamese font, or copy came out tofu / wrong
  face.
- **`reference/language-rules.md`** — the cross-language spine: preserve-vs-localize, translation
  quality, layout integrity after translation, and the localization pass checklist.
- **`reference/<family>.md`** — per-script-family conventions, numeric leading bands, and
  quotation marks, one file per family: `latin-expansion.md` (de/fr/es…), `arabic.md`, `cjk.md`
  (ja/zh/ko), `vietnamese.md`, `cyrillic.md` (ru…). Read the file(s) for the **target locale(s)**
  you're building, e.g. `reference/arabic.md`.

Several locales of one design, or re-applying a master fix to locales you already built: the
**master → editions** workflow, `../resize/editions.md`.
For an animated or video design, read **Video and animated designs** below as well.

## Inputs — what to localize, and into what

Resolved before any work by the intake contract — derive, ask once, echo, invent nothing:
`../handbook/intake.md`. **R** = required, no default; **A** = ask if
underived; **D** = defaultable.

| Parameter      | Kind    | Chips / values                                                              | Default                           |
| -------------- | ------- | --------------------------------------------------------------------------- | --------------------------------- |
| target locales | **R**   | `German` · `French` · `Spanish` · `Japanese` · `Chinese` · `Arabic` · Other | none                              |
| source locale  | A       | detected from the design's copy · Other                                     | detected, stated in the echo      |
| source design  | derived | —                                                                           | the design in the current session |

**1. The source (reference)** — the design in the current session, in its source language (usually `en`). **Save it first** (`export({ format: 'imgly' })`) and keep the `uri`: its geometry is the grid every target locale snaps to, and every locale starts by re-importing that file. Never localize _from_ a non-reference locale.
If the user means a design saved earlier, its `uri` IS the reference `uri`: `open` it to `preview` and capture it, skip the first save, then `import` a copy of it per locale.

A session holds one design, so the locales are built in sequence and the saved reference is what you return to between them (handbook §1):

```
export({ format: 'imgly' })                   → REFERENCE_URI   (save the source FIRST)
per locale:
  import({ source: { uri: REFERENCE_URI } })  → a copy of the reference is the session
  edit(…)  translate + swap the script font + snap to the reference geometry
  preview()                                   → check it against the reference render
  export({ format: 'imgly' })                 → that locale's own file
```

**2. The locales** — the target languages, e.g. `de ja ru ar`. If omitted, **ask** —
_**Which languages do you need?**_ — with the chips above; there is no defaulting to a language the
user didn't name. Then echo the resolved set ("1 design × 3 locales, source `en` (detected)") before
building.

**Never invent copy.** A translation is the user's own content: if a block's meaning is ambiguous,
or a term is a name/product you cannot safely render in the target script, ask rather than guess —
see the keep-byte-identical list in `reference/language-rules.md` §1.

**Per locale, then:** run the Workflow below (re-import the reference, or load an existing localized file and snap it). Give each locale's `edit` a `note` naming the locale, `preview` it, and **save it** — an unsaved locale is one the user never receives. Report every locale's `uri` at the end.

## Core principle — localize, then snap back to the reference

Localizing is **surgical**: change the words + the font the new script forces, and **nothing
else**. Then **snap every block back to the reference variant's geometry** so the localized
edition is positionally identical to the source.

- The **reference** is the source-locale variant (usually `en`) **of the same size**. Each size
  has its own reference grid.
- **Never re-center or re-size a block per variant "to fit better."** That independent re-fitting
  is exactly what makes a localized set drift — the eyebrow creeps up, the quote grows, the rule
  and footer slide down, and the editions stop matching. If there is room for the translated text
  at the reference position/size, keep the reference position/size.
- Deviate from the reference **only** when the translated text genuinely overflows (expansion
  languages) — then shrink _that block's_ font within its band; do not move its neighbours.
- **Swap the script font per block, not per scene.** Apply the new face **only to blocks whose
  copy is actually in the target script.** A block that stays in the source script — a personal
  name, brand/wordmark, `@handle`, URL, email, number, date, or product/tech name (the "keep
  byte-identical" list in `reference/language-rules.md` §1) — **keeps its original typeface.**
  Re-fonting it to the script face is drift even though its text was correctly preserved: a Latin
  name rendered in the Arabic/CJK serif is the classic tell. So a localized edition differs from
  its reference in **only the translated blocks' text + face**; every untranslated block is
  byte-identical (position mirrored for RTL).

## When to use

- Producing new locale editions (de/ja/ru/ar/…) of a finished design, across one or more sizes.
- Fixing a localized set whose blocks drifted / re-centered / resized vs the source.
- Post-translation breakage: tofu, overflow, wrong tracking, Latin-looking sans where a script
  font should be.
- Loading a non-Latin or non-handbook typeface into a scene.

**Not for:** the original design build (that's the handbook + §6); pure copy edits in the
same language. To change
the **size/format** — re-compose a design for a new aspect rather than translate it — use the **resize** skill
(localize snaps geometry; resize re-derives it).

## Reuse an existing localized build vs build fresh

- **A saved file for the locale already exists** (an earlier pass built it — the user has its `uri`):
  **reuse its build** — `open({ uri })` it (`import` would give you a copy); the translated copy,
  script fonts, and RTL are already solved — but still **snap it to the reference geometry**.
  Earlier builds commonly drift; reuse the assets, fix the positions. Your fix goes to that design
  itself.
  Save it when you are done.
- **No existing build:** `import` a copy of the reference file and swap text + font.

Either way the last step is the same: every block lands on the reference grid.

## Workflow

1. **Capture the reference geometry.** With the source-locale design in the session, `preview` it
   (that render is your parity reference for the `judge` gate) and read, per
   block: `x, y, width, widthMode, heightMode, fontSize (Pixel), lineHeight, letterSpacing,
alignment`, plus page `w/h`, the ghost's anchor (left / centered), and the rule position. Do this
   **once**; the captured JSON is what you carry from locale to locale.
2. **Load the target** — `open` the existing localized file to fix, or `import` a copy of the
   reference file for a fresh build.
3. **Classify blocks by role** (see below).
4. **Apply the reference geometry** to each corresponding block; keep the localized **text** and
   the **script font** (for a non-Latin/non-handbook face see `reference/font-loading.md`). Set
   per-locale: `letterSpacing = 0` for CJK & Arabic; RTL ghost mirrored to the right; alignment as
   the reference (centered-symmetric stays centered — see `reference/arabic.md`).
5. **Reconcile ghost count.** Keep the reference's number of decorative glyphs. If the localized
   scene has extra ones (e.g. an Arabic closing-quote bookend the English lacks), **destroy the
   extras**; mirror the kept one for RTL.
6. **Overflow guard.** After setting the reference font size, measure the quote's frame height; if
   it collides with the element below, step the font size down (only that block) until it fits.
   Never move neighbours to make room.
7. **Re-apply rich text after a TRANSLATED string lands.** Font/size/line-height changes via
   `setProps` auto-reshape with every style range preserved — no manual step. A **translated
   string** is different: the write replays ranges at their OLD offsets, which are source-string
   indices. Capture each block with `getProps(id, ['text.ranges'])` first (each range carries its
   `text` substring), re-apply semantically after. ⚠ `getTextColors(id)[0]`
   is **not** a capture — it reads the first run only, so re-applying it flattens a two-color
   headline onto one color and the accent is gone with no error. Paragraph state
   (`getProps(id, ['text.paragraphs'])` — listStyle/listLevel per paragraph) survives a same-string reshape but not
   a **re-write**, so re-apply it whenever the string itself changed. **Ranges are index-based on
   the source string** — a translated string has different offsets, so never replay `from`/`to`
   verbatim; re-locate the styled substring in the target language (§ "Carrying rich text across
   a translation").
8. **`loadResources` → `preview`.** One preview per locale — tofu / RTL / overflow /
   position match are only visible in the render.
   A video design needs several per locale, at different `time`s (below).

Then apply the per-locale quality rules in `reference/language-rules.md` **and the family
file(s) for the target locale(s)** (`reference/latin-expansion.md`, `arabic.md`, `cjk.md`,
`vietnamese.md`, `cyrillic.md`), and dry-run the localization pass checklist against the render
before reporting done.

## Block-role classification

Classify by measurable properties, not hard-coded ids (ids are session-scoped). For a
quote-card family the roles are:

- **ghost** (oversized decorative quote) — largest font size **and** trimmed string length ≤ 2.
  A design may have **more than one** (opening + closing bookend); collect all.
- **footer / handle** — text containing `@`.
- **quote / headline** — the largest remaining text after removing ghosts + footer.
- **eyebrow** vs **attribution** — the two small texts; eyebrow sits **above** the quote,
  attribution **below**.
- **rule / divider** — the graphic (non-text) block.

Roles are design-specific. The general rule: **map each localized block to its reference block by
role, or by index** (every locale is imported from the same reference file, so they keep the same
child order), then restore that reference block's geometry.

## The snap-to-reference routine

A single CoDesign `edit` body. Fill the `EN` reference geometry (from step 1) and the locale
flags, then it classifies, restores geometry, reconciles ghosts, applies per-locale tracking /
RTL mirroring, guards overflow, and re-applies colors across the reshape.

⚠ This routine is a **worked example, not a template**: every number in `EN` below is from one
example quote-card, and the classification heuristics (`fs >= 150`, `s.includes('@')`, …) are
that card's — never reuse either literally. Fill `EN` only from your own reference capture (the
read at the bottom), and rewrite the classification for the actual design's roles.

```js
// --- config: reference geometry (read from the source-locale variant of THIS size) ---
const PW = 1080,
  PH = 1350; // page dims
const EN = {
  // lh = VISUAL leading target (from the target locale's script band, NOT the reference's
  // raw engine number) — setLeading() converts it through each block's target face. For a
  // localized display headline in a diacritic language, this is where the conditional +0.2
  // lives (latin-expansion.md): bump ≤1.2 → ~1.35 only if the rendered gap needs it.
  ghost: { x: 70, y: 55, fs: 300, lh: 1 }, // Auto-sized; keep size+lh, reposition
  eyebrow: { x: 110, y: 395, w: 860, fs: 16, lh: 1, ls: 0.25 },
  quote: { x: 110, y: 529, w: 860, fs: 62, lh: 0.85 }, // ls always 0
  rule: { x: 504, y: 930, w: 72 }, // graphic
  attribution: { x: 110, y: 960, w: 860, fs: 16, lh: 1, ls: 0.25 },
  footer: { x: 110, y: 1225, w: 860, fs: 15, lh: 1, ls: 0.12 }
};
const RTL = false; // true for Arabic
const trackOK = true; // false for CJK/Arabic → force letterSpacing 0 on eyebrow/attr/footer
const ghostAnchor = 'left'; // 'left' (post/square) mirrors to the right for RTL; 'center' (story) stays centered
const belowQuoteY = EN.rule.y; // element the quote must stay above

const page = engine.scene.getPages()[0];
const all = [];
(function walk(id) {
  all.push(id);
  for (const c of engine.block.getChildren(id)) walk(c);
})(page);
const blocks = all.filter((id) => id !== page);
const texts = blocks.filter((id) => engine.block.getType(id).includes('text'));
const graphic = blocks.find((id) =>
  engine.block.getType(id).includes('graphic')
);
await engine.design.loadResources([page]);

const meta = (id) => ({
  id,
  s: engine.block.getString(id, 'text/text'),
  fs: engine.block.getTextFontSizes(id, { unit: 'Pixel' })[0],
  y: engine.block.getPositionY(id)
});
const tm = texts.map(meta);

// classify
const ghosts = tm.filter((t) => t.fs >= 150 && t.s.trim().length <= 2);
let ghost =
  ghosts.find((t) => t.s.includes('“')) ||
  ghosts.slice().sort((a, b) => a.y - b.y)[0];
for (const g of ghosts.filter((t) => t !== ghost)) await engine.design.destroy(g.id); // drop extra bookend glyphs
const footer = tm.find((t) => t.s.includes('@'));
const rest = tm.filter((t) => !ghosts.includes(t) && t !== footer);
const quote = rest.reduce((a, b) => (b.fs > a.fs ? b : a));
const others = rest.filter((t) => t !== quote);
const eyebrow = others.reduce((a, b) => (b.y < a.y ? b : a));
const attribution = others.find((t) => t !== eyebrow);

// capture rich text — each range carries its run's `text` substring, which is
// what semantic re-location needs (offsets are source-string indices).
const runsOf = (id) => {
  try {
    return (await engine.design.getProps(id, ['text.ranges'])).text.ranges;
  } catch (e) {
    return [];
  }
};
const runs = Object.fromEntries(
  [ghost, eyebrow, quote, attribution, footer].map((t) => [t.id, runsOf(t.id)])
);
// Re-apply captured styling as ONE ranges assignment. Run 0 is the base style
// and covers the whole block; any further run is an accent whose SOURCE offsets
// are meaningless once the string is translated, so it is re-located by its
// target-language substring (SPANS below).
// Returns false when the accent could not be placed — flag it, never silently flatten.
const restyle = (id, rs, spans = []) => {
  if (!rs.length) return true;
  const s = (await engine.design.getProps(id, ['text'])).text.text;
  const ranges = [{ ...rs[0], from: 0, to: s.length }]; // base over the whole string
  let ok = true;
  rs.slice(1).forEach((r, i) => {
    const span = spans[i]; // translator-supplied target-language accent text
    const at = span ? s.indexOf(span) : -1;
    if (at < 0) {
      ok = false; // accent lost in translation — report it, don't fake it
      return;
    }
    ranges.push({ ...r, from: at, to: at + span.length });
  });
  await engine.design.setProps(id, { text: { ranges } });
  return ok;
};
// Accent spans IN THE TARGET LANGUAGE, one per non-base run, keyed by block.
// Empty for single-run blocks — which is every block in this quote card.
const SPANS = {};
// setProps auto-reshapes on font/size/lineHeight writes — no manual reshape.
// ⚠ Leading is RE-DERIVED on the TARGET face — never copied raw from the reference.
// `text/lineHeight` multiplies the font's content area (per-face, ~1.15–1.35), so the
// same engine number renders a DIFFERENT visual gap once the script font is swapped —
// the #1 localized-leading defect. So EN.*.lh below is a VISUAL leading target (taken
// from the target locale's script band in the family file — latin/arabic/cjk — NOT the
// reference's raw engine value), converted through THIS block's now-current font via
// design.font({ uri }) → contentArea (handbook §6.1.3).
const setLeading = (id, visual) =>
  // facade converts per font (metrics cached at font resolve / loadResources)
  await engine.design.setProps(id, { text: { lineHeight: { visual } } }); // auto-reshapes, ranges preserved
const applyText = async (t, g, ls) => {
  await engine.design.setProps(t.id, {
    widthMode: 'Absolute',
    width: g.w,
    heightMode: 'Auto',
    text: {
      fontSize: g.fs + 'px',
      letterSpacing: ls,
      horizontalAlignment: 'Center'
    }
  }); // fontSize/letterSpacing writes auto-reshape, ranges preserved
  await setLeading(t.id, g.lh); // visual target → target-face content area (§6.1.3)
};

await engine.design.setProps(ghost.id, { text: { fontSize: EN.ghost.fs + 'px' } });
await setLeading(ghost.id, EN.ghost.lh);
await applyText(eyebrow, EN.eyebrow, trackOK ? EN.eyebrow.ls : 0);
await applyText(attribution, EN.attribution, trackOK ? EN.attribution.ls : 0);
await applyText(footer, EN.footer, trackOK ? EN.footer.ls : 0);
await applyText(quote, EN.quote, 0);
await engine.design.setProps(graphic, { width: EN.rule.w });
for (const t of [ghost, eyebrow, quote, attribution, footer])
  restyle(t.id, runs[t.id], SPANS[t.id]);
await engine.design.loadResources([page]);

// position (ghost measured for mirroring; others straight from EN)
const gw = engine.block.getFrameWidth(ghost.id);
await engine.design.setProps(ghost.id, {
  position: {
    x:
      ghostAnchor === 'center'
        ? (PW - gw) / 2
        : RTL
          ? PW - EN.ghost.x - gw
          : EN.ghost.x,
    y: EN.ghost.y
  }
});
for (const [t, g] of [
  [eyebrow, EN.eyebrow],
  [quote, EN.quote],
  [attribution, EN.attribution],
  [footer, EN.footer]
]) {
  await engine.design.setProps(t.id, { position: { x: g.x, y: g.y } });
}
await engine.design.setProps(graphic, {
  position: { x: EN.rule.x, y: EN.rule.y }
});

// overflow guard — shrink ONLY the quote, never move neighbours
await engine.design.loadResources([page]);
let qfs = EN.quote.fs;
const avail = belowQuoteY - EN.quote.y - 16;
while (engine.block.getFrameHeight(quote.id) > avail && qfs > 44) {
  qfs -= 2;
  // the fontSize write auto-reshapes AND auto-preserves the style ranges.
  await engine.design.setProps(quote.id, { text: { fontSize: qfs + 'px' } });
  await engine.design.loadResources([page]);
}
return { type: 'text', text: JSON.stringify({ page, qfs }, null, 1) };
```

Reference-capture read (run on the source variant to fill `EN`):

```js
const page = engine.scene.getPages()[0];
const out = [];
(function walk(id) {
  const t = engine.block.getType(id),
    isText = t.includes('text');
  const r = {
    t: t.split('/').pop(),
    x: Math.round(engine.block.getPositionX(id)),
    y: Math.round(engine.block.getPositionY(id)),
    w: Math.round(engine.block.getWidth(id)),
    wm: engine.block.getWidthMode(id)
  };
  if (isText) {
    r.s = engine.block.getString(id, 'text/text').slice(0, 14);
    r.fs = Math.round(engine.block.getTextFontSizes(id, { unit: 'Pixel' })[0]);
    r.lh = +engine.block.getFloat(id, 'text/lineHeight').toFixed(2);
    r.ls = +engine.block.getFloat(id, 'text/letterSpacing').toFixed(2);
  }
  if (id !== page) out.push(r);
  for (const c of engine.block.getChildren(id)) walk(c);
})(page);
return {
  type: 'text',
  text: JSON.stringify({
    pw: engine.block.getWidth(page),
    ph: engine.block.getHeight(page),
    b: out
  })
};
```

## Video and animated designs

Applies when the page has a `playback.duration`, timed blocks, `animations`, an `audio` voice-over
or a `captionTrack`. Geometry still snaps to the reference; the **timeline** is re-derived from the
new language's speech and reading time.

- **Reading time sets the hold.** A line must stay on screen ≈**0.3 s per word** after its
  entrance finishes. Expansion languages (German, French, Spanish run 15–35 % longer) need longer
  holds: extend the block's `playback.duration`, shift what follows, and grow the page's
  `playback.duration` — never shorten reading time or speed up speech to fit the source length.
- **Word-by-word reveals scale with the target.** A `typewriter_text` (or any text animation whose
  `textAnimationWritingStyle` is `Word` / `Character`) reveals per word or per character: scale its
  duration by target ÷ source word (or character) count, and check that the reveal ends with the
  0.3 s-per-word hold still ahead of it. The duration is not in the animation spec:
  `engine.block.setDuration(engine.block.getInAnimation(id), s) // engine.block: animation duration`.
- **Re-voice, don't re-use.** Generate the voice-over again from the translated script with a
  `text2speech` model — `asset_generate({ capability: 'text2speech' })` lists them (e.g.
  `elevenlabs/eleven-v3-tts`); keep the master's voice across locales via `params`
  (`asset_generate({ model, schema: true })` names the model's inputs). Swap the file on the
  existing audio block — `setProps(audio, { audio: { fileURI } })` — so its offset and volume stay.
  Respell names in the translated script as they are said in that language, and keep the written
  names in the captions (`../models/audio.md`).
- **Captions come from the new take.** Transcribe it with a `speech2text` model
  (`elevenlabs/scribe-v2`, via `params` — check its inputs with `schema: true`); the result carries
  word-level `start` / `end`.
  Rebuild the captions from those words: a caption per phrase (break at
  sentence ends, and at commas once a phrase has two words), `timeOffset` = the audio block's
  offset + the first word's `start`, held until the next caption. Carry the master captions' frame
  and style onto **every** new caption (it is per caption, not shared) — and their typeface:
  captions have their own font (`caption/typeface`, `caption/fontFileUri`), so the script face goes
  there too, not only on text blocks.
- **Re-snap the timeline to the new speech — one rule.** Every timed block that enters on a spoken
  cue keeps its **lead**: new `timeOffset` = master `timeOffset` − master cue time + target cue
  time. A block that ended where another began still ends there; a block that ran to the end of
  the page still does; page duration = max(master duration, voice-over offset + last word's `end` +
  the master's closing silence).
- **RTL mirrors the motion, not only the layout.** For Arabic / Hebrew, mirror horizontal
  directions: `slide` / `pan` `direction` θ → `π − θ` (`0` ↔ `π`; it is the direction of travel),
  `wipe` `Left` ↔ `Right`, `caption/horizontalAlignment` `Left` ↔ `Right`. The do-not-mirror
  inventory (icons, logos, numerals, photos) holds for motion too.
- **Preview at several `time`s, per locale.** Mid-reveal of each word-by-word line, the end of each
  hold, each caption change and the last second (`preview({ time })`) — a caption out of sync with
  the voice or a line that leaves mid-sentence shows only in time.
  Then export the mp4.

## Carrying rich text across a translation

Styled ranges are stored as character offsets into the block's string. Translate the string and
those offsets point at different words — sometimes at nothing. So a localized variant must carry
rich text **semantically**, not numerically.

- **Capture with `getProps(id, ['text.ranges'])`, never `getTextColors(id)[0]`.** The latter reads run 0 only.
  Re-applying it whole-block is what silently flattens a two-color headline.
- **Run 0 is the base style**; apply it across the whole translated string first.
- **Every further run is an accent**, and you need its **target-language substring** to place it.
  Ask for it as part of the translation: translate `"Save 20% today"` **and** tell me which
  target-language span carries the accent (`"20 %"`, `"٪٢٠"`, …). Locate that span with
  `indexOf`, then re-apply.
- **A span that can't be located is a reportable defect**, not something to paper over. Apply the
  base style, leave the accent off, and say so — a flattened headline that nobody mentions is
  exactly the failure this section exists to prevent.
- **The accent may not survive as a span at all.** Word order moves it, agglutinative targets fuse
  it into a longer word, and some languages have no equivalent fragment. When that happens, prefer
  moving the emphasis to the phrase the target language actually stresses over splitting a word.
- **Paragraph state is separate from runs.** List style/level and per-paragraph alignment/leading
  live on paragraph indices, not character offsets — re-apply them per paragraph after any string
  re-write, and keep the item count matched (a translation that merges two bullets into one
  silently drops a list item).
- **`text.case` is not a translation artefact.** All-caps set through the `case` prop re-cases the
  target string automatically; all-caps typed into the string is frozen English and cannot be
  correctly cased in scripts that have no case at all. Carry the property, not typed capitals.

## Common mistakes / red flags

- **Per-variant re-centering / re-sizing** → drift. If you're re-centering a block because the
  translation is a different length, STOP — snap it to the reference position instead.
- **Line-height copied raw across the font swap** → wrong gap. `text/lineHeight` is content-area
  scaled and per-face; re-derive it on the target face (`setLeading`, §6.1.3), never carry the
  reference's engine number. The single most common localized-leading defect.
- **Whole block landed a few px low (ar/ja "moved down")** → **baseline drift**. A `position.y` write
  snaps the frame **top** (= ascender line), but the script face's ascender/descender differ from
  the Latin source, so identical `y` renders a different baseline. Snap **baseline-relative** when
  the face changes: after positioning + `loadResources`, nudge `y` by the ascent delta
  `(refAscent − targetAscent) × fontSize` (both `ascender/unitsPerEm` via `design.font({ uri }).metrics`), or
  align the block by a shared optical anchor rather than the frame top. Confirm against the source
  render (the `judge` source-parity check).
- **A weight the typeface does not declare** → "Failed to find a font with the specified weight". Declare it: a variable TTF takes one `fonts[]` entry per weight, same `uri` (`reference/font-loading.md`).
- **Weight not carried onto the swapped face (text "too light / unreadable")** → the swap lands on
  the family's lightest cut. Capture the reference block's weight and re-apply it on the target
  face (verify it actually renders — declare the weight, `font-loading.md`); parity is checked
  by the `judge` source-parity render diff.
- **Appearance not carried (fill/gradient/effect/corner-radius/overlay differs from the source)** →
  import the saved reference file so surface styling is inherited; if you rebuilt instead, or a
  reshape/recolor dropped it, re-capture and re-apply. Don't re-create a fill or effect "by eye" —
  read its values off the source.
- **Reshape wiped the accent color / bold / underline** → capture with `getProps(id, ['text.ranges'])` before the
  reshape and re-apply after. If you captured with `getTextColors(id)[0]` you captured run 0 only,
  and re-applying it whole-block is itself the flattening bug.
- **Accent landed on the wrong word after translation** → run offsets were replayed verbatim. They
  are source-string indices; re-locate the accent by its target-language substring instead.
- **Bullets became separate blocks / lost their hanging indent in the variant** → list state is
  per-paragraph and does not survive a string re-write. Re-apply `text: { listStyle }` (and the level via raw `setTextListLevel`)
  per paragraph after translating.
- **Letter-spacing on Arabic** → severs joins. `letterSpacing = 0`.
- **RTL flip disassembled an icon / broke in-frame centering** → mirror operates on **groups, not
  loose blocks**, and **icons/logos/brand marks/numerals/charts/photos must not mirror** at all.
  Group a composed icon and flip the group as a unit (or exempt it); see the do-not-mirror
  inventory in `reference/arabic.md`.
- **Plausible page, wrong font** → silent sans fallback / tofu. Preview every locale.
- **Extra or missing decorative glyph** vs the reference → reconcile the count.
- **Non-native export size** → export the page at its own pixel dimensions.

## Cross-references

- **`reference/font-loading.md`** — non-Latin / non-handbook font mechanics (this skill's font body).
- **`reference/language-rules.md`** — cross-language quality rules + pass checklist.
- **`reference/latin-expansion.md` / `arabic.md` / `cjk.md` / `vietnamese.md` / `cyrillic.md`** — per-script-family conventions, leading bands, quotation marks.
- handbook §6.1 — general typographic thresholds (leading, tracking, all-caps & diacritic leading, the content-area line-height conversion (`design.font`), smart punctuation, reshape-then-recolor); §6.7 — the Latin font baseline; and the handbook's reshape / `loadResources` / dirty-on-throw runtime quirks.
- **`judge`** — the acceptance gate (the `localization` axis scores this skill's output).
- **`resize`** — the sibling skill for changing size/format (re-compose for a new aspect).
