# Handbook §6 — Design rules (the full rubric)

The enforceable design best practices this server's designs are built to and the `judge` skill scores against. Section numbers here are canonical: `§6.x` references across the handbook and the other skills resolve to this file.

### 6.1 Typography

Expands **Axis 3 — Typography** ("≤3 font families, correct pairing, sizes in band, sane line-spacing and leading, no tofu"). Every subsection below must hold for Axis 3 to score ≥ 8.

#### 6.1.1 Font families & pairing

- Use **≤3 font families** per design (≤2 preferred); no more than **4 weights** total. Every extra family/weight dilutes hierarchy and reads as inconsistency.
- Pair by **contrast**, not similarity — e.g. a serif display against a sans body, or one superfamily used across roles. Never pair two families that are almost alike (two humanist sans, two geometric sans).
- Give every family a defined fallback: an **embedded/outlined** font (print) — and verify glyph coverage for every character in the copy (web/canvas). System substitution silently changes metrics and breaks leading and measure.
- **Pass:** ≤3 families, ≤4 weights, pairing is by intentional contrast/superfamily, every family verified to cover the copy (print: embedded/outlined).

#### 6.1.2 Type scale & size bands

- Derive all sizes from **one modular scale** (ratio 1.2–1.618; 1.25 is a safe default). No arbitrary one-off sizes.
- Keep text in clear **bands** — Display/Headline, Subhead, Body, Caption, Fine print — each separated by **≥1 scale step** so the hierarchy is unambiguous (supports Axis 2).
- Minimum legible sizes:
  - **Web** — body ≥ **16px**, caption ≥ **12px**, never below **11px**.
  - **Print** — body **9–12pt**, caption ≥ **7pt**, never below **5pt**.
- **Pass:** every size snaps to one modular scale; body ≥ 16px (web) / ≥ 9pt (print); bands are ≥1 step apart and visually distinct.

**Canvas guidance — sizes as % of page height:**

| Role        | % of page height | Example for 1080 px page |
| ----------- | ---------------- | ------------------------ |
| Headline    | 3 – 5 %          | 32 – 54 px               |
| Body        | 1.5 – 2 %        | 16 – 22 px               |
| Caption     | 1.2 – 1.5 %      | 13 – 16 px               |
| Min legible | —                | 14 px                    |

#### 6.1.3 Line height / leading — the headline rule

Line spacing is the top driver of the "inconsistent typography" complaint. Three principles govern it: **explicitness** (every text block carries a deliberately set line-height — never an inherited default), the **inverse rule** (small text needs more line-height; large display needs less), and **consistency** (identical leading across same-band text within one design).

- **Set line-height explicitly on every text block** — including single-line labels, captions, and all-caps titles, not just multi-line body copy. An unset line-height (the engine/CSS default) is a defect even when the block is one line: it silently tracks the font's default metrics, can't be verified against the bands below, and defeats both the consistency and all-caps rules. A one-line all-caps label still takes the tighter all-caps multiplier (**0.9–1.0**); the value is judged by band + intent, not by whether the text happens to wrap. Same-band single-line blocks (e.g. an attribution and a caption in the same face) share their leading just as body blocks do.

> **Authoring in CoDesign / CE.SDK — write line-heights as `{ visual }`.** Every line-height figure in this section is a _visual_ CSS-style multiplier of the font size. The engine's raw `text/lineHeight` is a different scale (it multiplies the font's per-face content area), so a raw number renders looser than it reads. The facade converts for you — write the band value directly:
>
> ```js
> await engine.design.setProps(block, {
>   text: { lineHeight: { visual: 1.2 } }
> });
> // read back in the same terms:
> await engine.design.getProps(block, ['text.lineHeightVisual']); // → 1.2
> ```
>
> The conversion needs the font's metrics, cached automatically when the font is resolved (`create` with `text.font`, `design.font({ family }or{ uri })`, or `loadResources`); on a cache miss the write throws with that instruction instead of guessing. A `{ visual }` (or font/size) write reshapes and replays every per-character style range for you. If you ever reshape via the raw APIs instead: **⚠ re-setting the string wipes every per-character style range** — capture with `getProps(id, ['text.ranges'])` and replay (§6.1.9). The judge scores the _rendered_ gap (§6.1.6), and reads it back via `text.lineHeightVisual` — same numbers as the bands below.
>
> **⚠ An explicit line-height from the user's brief is a visual target too** — write it as `{ visual }` and judge the rendered gap, never the raw engine number. A prompt asking for all-caps line-height **1.15** is not "too loose for the 0.9–1.0 band" until the _rendered_ gap violates §6.1.6; when the prompt names a line-height, the default is to use it.

- **Web (unitless multipliers):**
  - Body **1.4–1.6** (default **1.5**); long-form reading up to **1.65**.
  - Headlines **1.1–1.25** (default **1.1**); large display **≤1.1** (default **1.1**).
  - **All-caps display / headlines** take a **tighter** multiplier than mixed-case — **0.9–1.0** for multi-line — because caps fill only the cap-height band (~70% of the em) and use no descender space; a value that looks tight for mixed-case leaves a descender-sized void between all-caps lines. Judge by the **visual gap** (target ~0.15–0.25× cap height), not the number.
  - **WCAG:** body line-height ≥ **1.5**; paragraph spacing ≥ **2×** the font size.
- **Print (leading as a unitless multiplier of point size):**
  - Body **1.2–1.45** (default **1.2**). Push toward the low end for dense or large-x-height faces, toward the high end for airy or small type.
  - Headlines **1.0–1.2** (default **1.05**); tight display setting may go slightly negative (**0.95–1.0**).
  - **All-caps titles: 0.9–1.0** (tighter than mixed-case display's 1.0–1.2) — same cap-height reason.
- **Localized / non-Latin copy — the per-script rules live in the `localize` skill.** Per-script leading bands and diacritic rules — the capital-diacritic all-caps loosening, the marked-capital mixed-case nudge, the localized-display default, and the CJK / Arabic-Naskh / Vietnamese bands — live in the `localize` skill's `reference/` family files (`latin-expansion.md`, `arabic.md`, `cjk.md`, `vietnamese.md`, `cyrillic.md`). All values there are **visual multipliers** — apply this section's content-area conversion like every value here (§6.6).
- **Tune leading to measure** — longer measure needs more leading; short measure needs less. Never set leading in isolation from line length (§6.1.4).
- **Consistency** — every body block in one design shares the same leading; every same-band heading shares the same leading.
- **Pass:** **every text block carries an explicit line-height (incl. single-line & all-caps labels)**; body line-height **1.4–1.6** (web) / **1.2–1.45** (print); headline leading tighter than body; **all-caps titles tighter still (0.9–1.0, web & print), no descender-void between lines**; leading uniform across same-band text; **localized / non-Latin leading set per the `localize` skill's family files**; WCAG body ≥ 1.5 (web).

#### 6.1.4 Measure (line length)

- Set body **measure to 45–75 characters** (~66 ideal for a single column; **40–50** per column in multi-column layouts). Too-long lines lose the return sweep; too-short lines fracture rhythm.
- On wide canvases, constrain body width — don't let body text run the full canvas width.
- **Pass:** body measure 45–75 chars (40–50 multi-column); no full-canvas-width body lines.

#### 6.1.5 Alignment, rag, justification

- Default body alignment: **left** (LTR) / **right** (RTL). Avoid centered or justified _running_ text.
- Justify only with **hyphenation on** and rivers controlled (print); **never justify short measure**.
- Keep a **soft rag** — no ladders (repeated hyphens/word-shapes down the edge), no line more than ~50% shorter than its neighbors.
- **Set alignment and a growth anchor explicitly — build to survive a text-length change.** A block that _looks_ centred only because its current string happens to be that width is **not** centred: encode the intent. Give every text block an **explicit horizontal alignment** (`text/horizontalAlignment`), and set its width mode so it **grows from the correct edge** when the string changes length — a label centred under a number stays `Center`; a value aligned to a right margin is right-anchored; a column of labels shares one alignment. This is what makes a design **localizable**: when the German string is 30% longer it must grow symmetrically (or from the anchored edge), not drift right off a left-anchored Auto frame. A source that encodes position instead of intent forces the localizer to re-infer alignment from the render and get it wrong (the "labels drifted right / SEAT not aligned with BLOCK" defect originates **in the source**, not the localization). Applies equally to chips (§6.5.1: the field grows with the label).
- **Pass:** body not centered/justified without cause; RTL layouts mirrored (ties to the RTL axis); rag is soft, no ladders; **every text block carries an explicit alignment and grows from the intended edge on a length change (localization-safe), not an incidental centering that breaks when the copy changes.**

#### 6.1.6 Tracking / letter-spacing & case

- **Don't letter-space lowercase body text.** Tighten large display slightly (**−1% to −3%**).
- **Loosen all-caps and small-caps — always, and to a defined default.** Never leave all-caps at 0 tracking. **Default +10% (0.1em)**; acceptable band **+5% to +25% (0.05–0.25em)**, scaled by size and length — tighter (~+8%) for larger/longer strings, looser (up to +25%) for short airy display labels and wide-set wordmarks. On **web**, never below the WCAG floor of **0.12em** — so a web all-caps label defaults to **0.12em**, not 0.1em. This default applies even to one-line labels and even when the prompt is silent on tracking (per "Defaults fill silence" above).
- Avoid long strings of **all-caps** — reserve caps for short labels; they slow reading in body copy.
- **Setting all-caps titles** — caps have no ascender/descender extension, so set them **optically**: pull line-height below the mixed-case display range (see §6.1.3), space to **cap height** rather than the em box, and prefer real small-caps to shrunk-and-tracked caps where the family offers them. Keep all-caps to a line or two of display — never a paragraph.
- Use **real weights and real italics**, never faux-bold or faux-oblique when the family provides the true cut.
- **Pass:** body untracked; all-caps loosened to the defined default (**+10%; web ≥0.12em**, band +5–25%) and short, **with line-height tightened per §6.1.3 (no inter-line void)**; no faux styling where a real weight/italic exists.

#### 6.1.7 Micro-typography

- Use **smart punctuation**: curly quotes (" " ' '), en dash (–) and em dash (—) correctly, real ellipsis (…). No straight quotes, no `--` for a dash.
- **No double spaces.** Use **non-breaking spaces** to prevent bad breaks (number + unit, "Fig. 4", brand names).
- **No widows or orphans**; no single-word last line; no hyphen on a paragraph's last line.
- **No missing glyphs / tofu (□)** and **no clipped** ascenders/descenders — the direct expansion of Axis 3's "no tofu." Verify the chosen font actually covers every character in the copy (critical for localized text).
- **Pass:** smart punctuation throughout; zero tofu and zero clipping; no widows/orphans in headings or short blocks.

#### 6.1.8 Lists & paragraph structure

**Both rules here are construction rules, and construction is invisible in a PNG** — a hand-built list and a native one render almost identically. They are verified by **reading the scene graph**, like grouping (§6.3), chips (§6.5.1) and curved type (§6.5.4).

- **A multi-line list item hangs — wrapped lines align to the text, not under the marker.** When a bulleted / numbered item wraps, the continuation line must indent to the **text start** (a hanging indent), never fall back under the bullet or number. Text wrapping under its own marker is the most common list defect and reads as broken structure.
- **One text block holds the whole list — one paragraph per item.** Set the marker with the engine's list feature (`text: { listStyle }` whole-block, `text: { paragraphs: [{ index, listStyle, listLevel }] }` per paragraph). There are three hand-built fakes and all three are wrong: **(1)** a marker typed into the string (`"• "`) — no hanging indent; **(2)** a lone marker glyph block beside a left-aligned text frame — the marker is unbound and drifts off its text on any copy, font or locale change; **(3)** one text block per item — there is no list at all, just N loose ungrouped blocks that also fail §6.3. Only the native feature keeps the marker, the gap and the hanging indent bound to the item.
- **Consistent marker, spacing, and alignment** across every item in a list; nested levels step the indent by one unit (`paragraphs[].listLevel`; `listIndentPerLevel` sets the step).
- **Multi-paragraph copy is ONE text block with paragraph spacing** — `text/paragraphSpacing`, plus per-paragraph alignment and leading (`setTextHorizontalAlignment` / `setTextLineHeight` take a paragraph index; pass `-1` when **reading** alignment back, or a block whose alignment was set block-level reads as `undefined` and looks unset). ⚠ `text/paragraphSpacing` is an **em multiple of the font size, not pixels** — **0.4–0.8** is the usable band, and a pixel-shaped value silently runs the copy off the page with no error (measured: `9` on 17px body produced ~150px gaps and a 2362px content bottom on a 1123px page). Not blank lines: an empty line is a full line box, so it scales with the font size instead of the spacing ladder (§6.4) and can't be tuned independently. And not N stacked blocks: those don't reflow together, drift apart on any length change, and arrive ungrouped.
- **Pass:** multi-line items use a hanging indent (wrap aligns to the text, not the marker); every list is the native list feature on a single block, one paragraph per item — no typed markers, no lone marker blocks, no block-per-item; marker style, gap, and indent uniform per list; multi-paragraph copy is one block with real paragraph spacing rather than blank lines or stacked blocks.

#### 6.1.9 Rich text — inline style ranges

Emphasis **inside** a line — an accent-coloured word, a bold lead-in, an inline price, a struck-through old price, a superscript-ish unit — is a **style range on one text block**, never a second text block placed beside the first. Like §6.1.8, this is a construction rule: the two builds render near-identically and are told apart in the block tree.

- **A range is the unit of emphasis.** Character styling is a `text.ranges` entry: `setProps(id, { text: { ranges: [{ from, to, color?, weight?, style?, size?, typeface?, case?, decoration? }] } })`. Read them back with `getProps(id, ['text.ranges'])`.
- **Splitting a headline into blocks to colour one word is the anti-pattern.** Nothing binds the pieces: the gap between them is hand-set, so it re-breaks on any copy, font or locale change; the phrase stops being one string (unsearchable, and the localizer receives fragments instead of a sentence); and it ships as loose siblings that fail grouping (§6.3). The tell in the scene graph is two or more text blocks sharing a baseline and a face, differing only in colour or weight.
- **All-caps is `text: { case: 'Uppercase' }`, not capitals typed into the string.** The property re-cases at render time, so the string stays real words — translatable, searchable, and correct in scripts that have no case at all (where typed capitals are simply wrong and unrecoverable). Applies to whole blocks and ranges alike; tracking still follows §6.1.6.
- **Restraint.** One accent per headline, drawn from the single accent colour (§6.2) — a second colour inside a line reads as a mistake, not emphasis. Don't stack emphasis (bold **and** colour **and** underline on the same span). Never fake a weight or an italic with a range when the family has the real cut (§6.1.6).
- **Underline is not general emphasis** — reserve it for links and annotations, and keep `skipInk` on so descenders stay legible; prefer weight or colour for emphasis in display type. (Skip-ink only _shows_ at a small `underlineOffset`: push the rule far enough below the baseline and it clears the descenders anyway, so the setting is neither visible nor verifiable in the render. Judge it at the default offset.) Strikethrough is for superseded content (an old price), not decoration.
- **Ranges do not survive a raw string write.** Any raw write to `text/text` — including the same-string reshape a font/size/line-height change requires — wipes every range. `setProps` handles this for you: a string-only write captures and replays existing ranges, and font/size/line-height writes reshape with the ranges preserved. A write that mixes `string` with new styling resets ranges — pass the `ranges` you want kept in the same call. `getTextColors(id)[0]` is run 0 only; re-applying it whole-block is itself the flattening bug. Offsets are indices into the string, so they replay verbatim after a **resize** but never after a **translation** (see the `localize` skill).
- **Replay every run, not just the emphasised ones.** The wipe collapses the whole string to **run 0's** formatting, not to a neutral base. If run 0 was a bold lead-in, replaying only the accent span leaves the rest of the paragraph bold — and the spot-check that would catch it is the one nobody runs, because reading the _accent_ range back shows exactly what was asked for; it is the **unemphasised** text that changed. Either replay all captured runs, or reset the base style across `0..length` before re-applying the emphasis.
- **Pass:** every inline emphasis is a range on a single text block — verified in the block tree, not the render; no sibling text blocks that differ only in colour/weight on a shared baseline; all-caps carried as `text.case` rather than typed capitals; at most one accent per headline, using the design's single accent colour; no faux weight/italic; underline reserved for links/annotations; and any variant (resized, re-branded, localized) still carries its ranges.

#### 6.1.10 Print-specific rules

- Work in **points/picas** and set text to a **baseline grid** so leading stays consistent across columns and pages.
- Honor the print minimum sizes (§6.1.2); target **≥300dpi**; **embed or outline** all fonts; keep text out of bleed and inside the safe margin (**~8%**, ties to Composition/Axis 5).
- **Pass:** baseline-grid aligned; fonts embedded/outlined; sizes ≥ print minimums; text inside the safe area, clear of bleed.

#### 6.1.11 Typography pass checklist

Expands **Axis 3 (Typography) — must score ≥ 8.** Each line is a yes/no the judge skill runs against the rendered output, **except the lines marked _scene graph_ — those are read from the block tree, because the defect they catch is invisible in a render.** Any "no" on an applicable line drops Axis 3 below 8.

**Both media**

- [ ] ≤3 font families, ≤4 weights, pairing by contrast/superfamily (§6.1.1)
- [ ] Every family has a defined fallback / is embedded-outlined (§6.1.1)
- [ ] All sizes come from one modular scale; bands ≥1 step apart (§6.1.2)
- [ ] Line-height set explicitly on every text block, incl. single-line & all-caps labels (§6.1.3)
- [ ] Headline leading tighter than body; leading uniform across same-band text (§6.1.3)
- [ ] All-caps titles set by cap-height — line-height tightened, no descender-void between lines (§6.1.3, §6.1.6)
- [ ] Localized / non-Latin text: leading bands + per-language conventions pass the `localize` skill's family files & checklist (§6.1.3 pointer, §6.6)
- [ ] Body measure 45–75 chars (40–50 multi-column) (§6.1.4)
- [ ] Body not centered/justified without cause; rag soft, no ladders (§6.1.5)
- [ ] Every text block has explicit alignment + grows from the intended edge on a length change (localization-safe), not incidental centering (§6.1.5)
- [ ] Multi-line list items hang (wrap aligns to text, not the marker); marker/gap/indent uniform (§6.1.8)
- [ ] _(scene graph)_ Every list is the native list feature on ONE block, one paragraph per item — no typed "• ", no lone marker blocks, no block-per-item (§6.1.8)
- [ ] _(scene graph)_ Multi-paragraph copy is one block with `text/paragraphSpacing` — not blank lines, not stacked blocks (§6.1.8)
- [ ] _(scene graph)_ Inline emphasis is a style range on one block — no sibling blocks differing only in colour/weight on a shared baseline (§6.1.9)
- [ ] _(scene graph)_ All-caps carried as `text.case`, not capitals typed into the string (§6.1.9, §6.1.6)
- [ ] ≤1 accent per headline, from the single accent colour; no stacked emphasis; underline only for links/annotations (§6.1.9)
- [ ] Body untracked; all-caps loosened to default (+10%; web ≥0.12em, band +5–25%) and short; no faux bold/italic (§6.1.6)
- [ ] Smart punctuation; no double spaces; non-breaking spaces where needed (§6.1.7)
- [ ] No widows/orphans; zero tofu; no clipped ascenders/descenders (§6.1.7)

**Web**

- [ ] Body ≥16px, caption ≥12px, never <11px (§6.1.2)
- [ ] Body line-height 1.4–1.6; WCAG body ≥1.5, paragraph spacing ≥2× size (§6.1.3)
- [ ] All-caps display line-height 0.9–1.0 (tighter than mixed-case display) (§6.1.3)

**Print**

- [ ] Body 9–12pt, caption ≥7pt, never <5pt (§6.1.2)
- [ ] Body leading 1.2–1.45; headlines 1.0–1.2; all-caps titles 0.9–1.0 (§6.1.3)
- [ ] Baseline-grid aligned; fonts embedded/outlined; ≥300dpi; text inside ~8% safe margin (§6.1.10)

### 6.2 Color

Expands **Axis 4 — Color** (palette respected, exactly one consistent accent, strong contrast everywhere, esp. text on photos/dark backgrounds).

#### Color hierarchy (text on dark backgrounds)

| Role                        | RGB                |
| --------------------------- | ------------------ |
| Primary text (headline)     | (1.0, 1.0, 1.0)    |
| Accent text (subtitle)      | brand color        |
| Secondary text (tagline)    | (0.75, 0.75, 0.80) |
| Tertiary text (description) | (0.5, 0.5, 0.55)   |

**Pass:** ≤ 3 colors + neutrals; exactly one consistent accent; all text meets contrast on its actual background (fill, photo, or field — not the page).

### 6.3 Hierarchy

Expands **Axis 2 — Hierarchy**: one element dominates, the reading order is unambiguous, and the eye lands where it should first.

- **One primary element.** Exactly one thing is the hero — the largest, heaviest, highest-contrast element on the page. Everything else is visibly subordinate. Two elements competing at the same visual weight is the most common hierarchy failure: neither wins and the eye stalls.
- **Rank with the hierarchy chain — `size > weight > color > spacing > position`.** Establish rank primarily by **size**, then **weight**, then **color/contrast**, then the **space around** an element, and only last by position. Don't lean on position alone — a block isn't dominant just because it sits at the top; size/weight/contrast must carry it.
- **Reading order is deliberate.** The scale steps map to the intended path: hero → supporting → detail. A reader should never hunt for where to start or what comes next. Keep the levels few — ≈3 (primary / secondary / tertiary); more than ~4 competing sizes reads as noise.
- **Group related, separate unrelated (proximity).** Tight spacing binds a set (eyebrow + headline, label + value); wider spacing sets groups apart (§6.4's ladder). Proximity — not boxes or rules — is the first grouping tool.
- **Colour serves rank, not decoration.** The single accent (§6.2) marks the one thing it should pull the eye to; spending it on secondary elements flattens the hierarchy.
- **Express the structure as a block hierarchy.** Proximity is the visual grouping tool; the **block tree** is its structural counterpart. Every logical cluster (eyebrow + headline; label + value; a detail cell; a CTA bar and its text) must be an actual **group block**, and clusters that nest must nest as **groups-of-groups** — no orphan block that belongs to a cluster left as a loose sibling. A page built as one flat list of ungrouped blocks has no expressed hierarchy even when it looks ranked. (Mechanics: handbook §4 "Group blocks & hierarchy".)
- **Pass:** exactly one dominant element; no two elements competing at the same level; reading order unambiguous (hero → supporting → detail); rank carried by size/weight/colour/spacing, not position alone; ≈3 (≤4) distinct levels; related items grouped tighter than unrelated ones; the accent reinforces the primary; **and the reading structure is expressed as grouped block clusters, nested where they nest — a flat page of ungrouped siblings fails.**

### 6.4 Composition & grid

Expands **Axis 5 — Composition**: proper margins, a shared grid, a consistent spacing scale, balanced whitespace, and nothing off-canvas or overlapping. Composition is **relative to the canvas** — every number below scales with the page, so it holds across formats.

- **One margin line / shared grid.** Left-aligned elements share one X; centered elements are **mathematically centered** (`pageX + (pageW − blockW)/2`); right-aligned share one right edge. Pick an alignment per element and hold it — a block that's "almost" on the margin reads as a mistake.
- **Page margins = 8–12% of the _shortest_ page dimension.** Key the outer margin to the shortest side so it stays proportional on any aspect (≈86–130px on a 1080-wide canvas). Content lives inside this frame; nothing crosses it except a deliberate full-bleed background.
- **One spacing scale.** Base unit ≈0.5–1% of page height; use multiples — 1× / 2× / 3× / 4× / 6× — never arbitrary gaps. More space above a heading than below it; tighter within a group than between groups. The spacing ladder (proportion of page height):

  | Relationship                | Spacing |
  | --------------------------- | ------- |
  | Accent / decoration → title | 0.5–1×  |
  | Title → subtitle            | 1–2×    |
  | Subtitle → body             | 2–3×    |
  | Between body paragraphs     | 1.5–2×  |
  | Between content groups      | 4–6×    |

- **Content inside a container is spaced relative to the _container_, not the page.** The margins and ladder above are **page**-relative; a card, panel, circle, or badge sitting on the page is a **sub-canvas** with its own inner frame. Give every container an **inner padding keyed to its _own_ shortest dimension** (≈6–10% of the container's short side — a chart inside a 400px card is inset from the card's edge, not the page's), and apply the spacing ladder **relative to the container** a group lives in. Nested content spaced by page-relative numbers, or by eye, crowds the container edge ("text/chart doesn't respect the card's padding," "elements too close to the edges"). Content must never touch a container's inner edge.
- **Lock up a mark and its wordmark as one unit.** A logo mark + wordmark, an avatar + name, an icon + label is a **lockup**: fixed relative spacing and alignment between the two, grouped, positioned as a unit. Its internal gap is set by the pair (roughly the wordmark's cap-height), not the page ladder — too tight reads as collision ("logo text too close to the mark," "name crossing the avatar"), too loose as two unrelated elements.
- **Balanced whitespace — no lopsided dead void.** Whitespace is intentional and distributed; the content should occupy or balance the whole canvas. A large empty band on one side — a top-clustered layout that letterboxes the bottom of a tall canvas — fails composition even when every element is individually fine. Balance the content group within the frame; don't top-anchor and leave a void.
- **Nothing off-canvas or overlapping.** Every element sits fully within the page (bar intentional edge-bleed decoration); no unintended overlap, no clipping at the edges.
- **Background back-most.** The full-bleed background / photo is the first child (behind everything); structural rules, then accents, then text paint on top — build back-to-front.
- **Pass:** margins 8–12% of the shortest dimension; every element on the shared grid / one alignment; one consistent spacing scale following the ladder; **content inside every container inset by the container's own inner padding (never touching its edge), ladder applied container-relative; mark+wordmark / avatar+name lockups grouped at a fixed intra-pair gap**; whitespace balanced with no lopsided dead void; nothing off-canvas, clipped, or overlapping; background back-most.

#### Background

- Card / poster with theme → use a generated or imported background image; place back-most via `await engine.design.create(…, { parent: page, index: 0 })` (see §4 "Z-order via child order"). If text contrast suffers, add a semi-transparent overlay.
- Card without theme → solid color or subtle gradient.
- Document / form / data → solid color or white.

#### Decorative elements

- Low opacity (15 – 30 %) for background decoration.
- Echo the existing color system — never introduce new colors for decoration alone.
- Less is more — one accent bar > three.
- **Place decoration with an internal geometric relationship parametrically, not by transcribed coordinates.** A ring of stars around a circle, evenly-stepped dashes, dots on an arc, elements mirrored about an axis — anything whose _parts relate to each other_ — is generated from the relationship (`cx + r·cos θ`, a fixed angular/linear step, a reflection), **not** placed as N loose blocks at hand-computed x/y. Absolute-coordinate decoration is what "drifts": any re-composition, re-snap, or localization has to reproduce N independent numbers and gets some wrong, so the _relationship_ visibly breaks (stars land in a straight line instead of on the arc; dashes space unevenly). Build the relationship once; then a resize scales `r` and a localization leaves it untouched. Group the generated set so it moves and mirrors as a unit (§6.3, §6.6).

### 6.5 Craft & finish

Expands **Axis 6 — Craft** (no overflow/overlap/blank text, legible chart labels with correct proportions, intentional crops, clean decorative elements). Most of this axis is still to be written on the §6.1 pattern; the written topics are accent components (§6.5.1) and curved type (§6.5.4).

**Two of this section's rules are construction rules, and construction is invisible in a PNG.** A rect-behind-text chip and a native text background render pixel-identically; so do one curved text block and a row of hand-rotated letters. Both are therefore verified by **reading the scene graph**, exactly as grouping is (§6.3) — see the instrumented checks in the `judge` skill. A render-only pass will score them 10 while they are wrong.

#### 6.5.1 Accent components — pills, badges, buttons, tags

A **chip** — a pill/eyebrow, badge, tag, or button — is a short label sitting on its own filled, rounded field. How it's _built_ is a craft concern: a well-made chip binds the field to the label so they never drift.

- **Build it as a text block with a native text background — not a rectangle behind floating text** — rationale: a separate backing shape forces you to hand-measure the label width and re-center it inside the box, and the two fall out of sync on any copy/font/localization change (label creeps off-center, box mis-fits, re-fit math must be redone per variant). Binding the field to the text keeps them locked and reflows correctly when the label changes. _(CoDesign/CE.SDK: enable `backgroundColor/enabled`, then `backgroundColor/color` + `backgroundColor/padding{Left,Right,Top,Bottom}` + `backgroundColor/cornerRadius` on the text block itself.)_ A separate container block is legitimate **only** for a chip carrying **non-text** content — an icon + text, an image, multiple elements.
- **Radius matches the chip's intent** — key the corner radius to the field's padded height `h`: **pill / capsule = `h/2`** (true stadium ends — eyebrows, status, filter chips); **badge / tag / button (soft rectangle) = ~0.1–0.25×h** (≈6–12px on a standard control); **`0` = a square tag**. Pick capsule _or_ clearly-soft-rect — never an ambiguous near-capsule that reads as a mistake.
- **Padding — horizontal roomier than vertical, symmetric per axis** — left = right, top = bottom (unless deliberately asymmetric); horizontal padding **~1.5–2.5× the vertical**; against the label size, horizontal **~0.8–1.5× the font size**, vertical **~0.4–0.7×**. The label must never touch the field edge. Compensate trailing **letter-spacing** on all-caps labels (§6.1.6) — tracking adds space after the last glyph, so trim right padding a hair to keep the label optically centered.
- **The label is still a label** — it obeys the type rules like any other text: all-caps tracking (§6.1.6), explicit line-height (§6.1.3), and the type-scale minimums (§6.1.2) — a chip never licenses sub-minimum text. Keep it **short (≤3 words)**; a chip is not a text container.
- **Align by the field edge, not the text.** A chip aligns to the margin line, the grid, and to neighbouring elements (a headline edge, another chip) by its **background field's outer edge** — the padded box — never by its glyph run. The two differ by the padding, so aligning on the text leaves the visible chip off the line by exactly that padding. **The padding expands the field outward from the text frame**, and `getFrameHeight` / `getFrameWidth` report the **unpadded** extent (measured: 17px frame inside a 35px padded field) — so landing a chip's field edge on the margin means positioning the frame at `margin + paddingLeft`, and a true capsule is `cornerRadius = (frameHeight + paddingTop + paddingBottom) / 2`, not `frameHeight / 2`. **Measure the field's real edge** — the outer edge of the padded box (the glyph extent ± its padding), not the label's glyph run alone; and beware that engine glyph metrics can misreport (especially for RTL/Arabic), silently drifting the chip off-margin.
- **RTL** — the whole chip mirrors to the opposite margin (§6.6), its field edge on that margin.
- **Color & contrast** — the field uses the design's single accent or a neutral, **never a new color** (§6.2); check the label's contrast **on the fill**, not against the page (§6.2).
- **Consistency across the design** — all chips share one system: one radius family (all capsules _or_ all the same soft-rect radius — don't mix), one padding scale, one label treatment. One-off chip geometry reads as a defect.
- **Pass:** every text-only chip is a text block with a native text background (no separate backing rectangle); radius matches intent (pill = h/2; tag/button ~0.1–0.25×h, no ambiguous near-capsule); padding symmetric per axis, horizontal ~1.5–2.5× vertical, label clear of the field edge with trailing tracking compensated; label follows §6.1.2/§6.1.3/§6.1.6 and stays ≤3 words; the chip is aligned to the margin line / grid / neighbouring elements by its **background field edge** (not its text), measured from the field's real rendered edge, and mirrored to the opposite margin in RTL; single-accent (or neutral) fill with the label contrast-checked on the fill; all chips in the design share one radius/padding/label system.

#### 6.5.2 Craft pass checklist

Expands **Axis 6 (Craft) — must score ≥ 8.** Each line is a yes/no the judge skill runs against the rendered output, **except the two lines marked _scene graph_ — those are read from the block tree, because the defect they catch is invisible in a render.** Any "no" on an applicable line drops Axis 6 below 8. _(Craft is otherwise still being written; this checklist currently covers §6.5.1 — accent components, §6.5.3 — text fitted to a container, and §6.5.4 — curved type. Construction is medium-agnostic, so there is no Web/Print split.)_

**Both media**

- [ ] _(scene graph)_ Text-only chips (pills/badges/buttons/tags) built as a text block with a native text background — no separate rectangle behind floating text (§6.5.1)
- [ ] _(scene graph)_ Curved/circular type is ONE text block on a path — not a run of per-letter text blocks rotated into an arc (§6.5.4)
- [ ] Radius matches intent: pill/capsule = half the padded height; tag/button = small fixed radius (~0.1–0.25×h); no ambiguous near-capsule (§6.5.1)
- [ ] Padding symmetric per axis, horizontal ~1.5–2.5× vertical, label never touching the field edge; trailing all-caps tracking compensated (§6.5.1, §6.1.6)
- [ ] Chip label follows label typography — all-caps tracking (§6.1.6), explicit line-height (§6.1.3), ≥ type-scale minimum (§6.1.2) — and stays ≤3 words (§6.5.1)
- [ ] Chip aligned to margin / grid / neighbouring elements by its background **field edge**, not its text — measured from the field's real rendered edge (§6.5.1, §6.4); whole chip mirrored to the opposite margin in RTL (§6.5.1, §6.6)
- [ ] Single-accent (or neutral) fill, no new color; label contrast checked on the fill, not the page (§6.5.1, §6.2)
- [ ] All chips in the design share one radius family, one padding scale, one label treatment (§6.5.1)
- [ ] Text inside a shape/container fitted within its band to sit fully inside the padded box — no overshoot, no edge-crowding (§6.5.3)
- [ ] Short labels/numbers in a badge/circle/pill optically centered by cap height, not the frame (§6.5.3)
- [ ] Image/photo crops: full coverage (no gap in the frame), uniform scale (no stretch), subject inside the window (§6.5.3, resize crop invariants)

#### 6.5.3 Text fitted to a shape or container

A text block and the shape it visually sits in (a circle, pill, card, panel, badge) are two independent blocks with independent sizes. Nothing binds them unless you bind them — so a size picked by eye, or a copy/locale change, breaks the relationship: the type overshoots the circle, or crowds the frame edge.

- **Fit the type to the container — don't set it by eye.** Shrink the block within its **type-scale band** until its **measured** frame fits inside the container's inner box (§6.4 inner padding), with the minimum inset clear on every side. In CoDesign this is a measure-and-shrink loop (`getFrameWidth`/`getFrameHeight` vs the container's padded box, step the font size down; or auto/fit-to-frame sizing where available) — the same shape as `localize`'s overflow guard, generalized to any text-in-container. Never let the glyph run cross the container edge; a pricing number must sit **fully inside** its circle.
- **Center optically, not geometrically — by cap height, not the em box.** Centering a text block by its **frame** centers the em box, which includes ascender headroom and descender depth the glyphs don't use. For a short all-caps or numeric label — exactly what goes in a badge or circle — the inked area then sits **above** the true center and reads as "hanging low." Center by the **cap-height band**: offset the block down by roughly half the (ascender-gap − descender) so the ink, not the box, is centered (derive the offset from `design.font({ uri }).metrics`; §6.1.6 sets all-caps optically for the same reason). Check the render — optical centering is judged by the visible gap above vs below the glyphs.
- **Pass:** text inside a shape/container is fitted within its band to sit fully inside the container's padded box (no overshoot, no edge-crowding); short labels/numbers in a badge/circle/pill are **optically** centered by cap height (inked area centered, not the frame), verified in the render.

#### 6.5.4 Curved type — text on a path

Circular or arced type — "EST. 2026" around a seal, a badge arc, a ribbon, a rosette, type following a curve — is a **native text feature**, not a layout to assemble by hand. Like §6.5.1, this is a construction rule: the two builds can look nearly identical in a render and are told apart by reading the block tree.

- **One text block on a path — never one block per letter.** Set the baseline on the text block itself and let the engine lay the glyphs along it. Hand-placing a text block per character and rotating each into an arc is the anti-pattern: there is no real baseline, so letter spacing is uneven and optically wrong at the arc's ends; the "text" is no longer text (uneditable, unsearchable, untranslatable); it re-breaks completely on any copy, font, or locale change; and it ships as N loose blocks that also fail hierarchy's grouping rule (§6.3). _(CoDesign/CE.SDK: `setProps(id, { text: { path, pathOffset, pathFlipped } })` — `pathOffset` for the start position along the curve, `pathFlipped` for the underside; `path: null` clears it.)_
- **Single contour (one `M`), and the geometry contract & full recipe: the handbook's “Text on a path” section (already in your context)** — the engine fits the path bbox to the block frame; measure the flat glyph-run width with Auto modes before computing `pathOffset`.

### 6.6 Localization & RTL

Expands the localization axis. The base typographic couplings live above: font coverage and no-tofu (§6.1.7), mirrored alignment (§6.1.5), and the content-area line-height conversion (§6.1.3). Everything language-specific — per-script leading bands and diacritic rules (the `localize` skill's `reference/` family files: `latin-expansion.md`, `arabic.md`, `cjk.md`, `vietnamese.md`, `cyrillic.md`), the snap-to-reference workflow, per-language conventions, RTL mirroring, and non-Latin font loading — lives in the `localize` skill.

- **RTL mirroring is selective and operates on groups — keep a do-not-mirror inventory.** Mirroring flips the **reading order** and directional decoration; it is **not** a blanket flip of every block. **Never mirror:** icons, logos, brand/glyph marks, numerals and number strings, charts, photographs, and any pictogram whose handedness carries meaning. **Mirror on the group, not its parts:** a composed icon, a lockup, or a badge moves as one unit — flip the group's position and leave its internal layout intact (or exempt it). Loose sibling parts flipped per-block disassemble the mark (the "mail icon broke on RTL," "elements moved right / off-center in frames" defect). Content inside a frame is re-anchored with its frame, never flipped independently. Full inventory + mechanics: `../localize/reference/arabic.md`.

### 6.7 Font discovery & pairing (CoDesign)

In this skill's `fonts.md`: `ly.img.gfonts` discovery, weights & italics, brand fonts, context → pairing. The font-declaration recipe itself is in the handbook entry, already in your context.
