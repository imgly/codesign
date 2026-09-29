---
name: judge
description: >-
  Use to quality-gate a design before reporting it done — the mandatory step 5 of the
  handbook Loop; when the user asks for a design review, score, audit, or QA; or when a
  design needs remediation after a failed review. The axes, the gate, the scorecard
  format, and the remediation loop are defined in this skill's body — read it before
  scoring; do not judge from memory of this description.
---

# judge — the build → judge → remediate loop

You are the design's QA judge. Judging is scored against what you SEE in `preview` renders of the **latest revision** of the current design — never against the code that produced it, and never from memory. If you are unsure which revision is current, re-ground via `list()` / `history({ revision })` first (handbook §1).

## The 8 axes

Score each axis 0–10 against the render. `baseline` is the execution floor; the other seven map to handbook §6 sections:

| Axis             | What it scores                                                                                                                                                                                                              | Rubric                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **baseline**     | Nothing broken: no overflow, no blank/placeholder text, no tofu (□), no clipped ascenders/descenders, nothing off-canvas, no unintended overlap                                                                             | §6.1.7, §6.4                 |
| **hierarchy**    | One dominant element; unambiguous reading order; ≈3 (≤4) levels; rank carried by size > weight > color > spacing > position; structure expressed as a grouped block hierarchy (nested where nested)                         | §6.3                         |
| **typography**   | Families/weights, scale bands, leading (incl. the content-area conversion and diacritic/non-Latin rules), measure, rag, tracking, micro-typography, lists & paragraph structure, inline style ranges                        | §6.1 (checklist §6.1.11)     |
| **color**        | Palette ≤ 3 + neutrals; exactly one consistent accent; contrast on the actual background                                                                                                                                    | §6.2                         |
| **composition**  | Margins 8–12% of the shortest dimension; shared grid; spacing ladder; balanced whitespace — no dead void; nothing off-canvas                                                                                                | §6.4                         |
| **craft**        | Chips/pills/badges built per the chip system; intentional crops; clean decoration; consistent component geometry                                                                                                            | §6.5 (checklist §6.5.2)      |
| **copy**         | The words say something only this business/occasion could say: no nothing-tagline, transformation claim, uncheckable superlative, upbeat closer or abstract-noun padding; trade idiom and specifics left intact             | §6.8 (copy-writing-rules.md) |
| **localization** | Localized variants only: correct per-language typography, no drift from the source layout, RTL mirrored, script-correct fonts; **source-parity** (appearance/weight/element/decoration match the source render — see below) | §6.6 + the `localize` skill  |

**Some axes cannot be judged from a single PNG.** Nine checks below are **instrumented** — they read a measured value, the scene graph, or a second render, not an eyeball — because the naked render either hides the defect or can't reveal the cause. Five of them (chip construction, curved type, list construction, inline emphasis, paragraph structure) catch **construction** defects that render pixel-identically to the correct build: scoring the image alone passes them every time.

- **Leading (typography):** don't eyeball the gap. Read `getProps(id, ['text.lineHeightVisual'])` (CSS-style multiplier) and check the **rendered** gap against the band (§6.1.3), not the raw `text/lineHeight`. An engine number that "looks set" can still render loose on a tall face. This read-back is **required, not optional, on every headline/display block and on every text block of a localized (non-source-language) variant** — the localized-leading defect is the single most common one and it survives a clean-looking PNG. (Elsewhere, run it on any block whose gap you can't confidently pass by eye.)
- **Grouping (hierarchy):** grouping is **invisible in a PNG**. Read the scene graph — walk `getChildren` from the page — and confirm each logical cluster (eyebrow+headline, label+value, icon+text, chip field+label) is an actual group block, not loose siblings (§6.3). A page that _looks_ ranked but ships flat fails hierarchy, and ungrouped RTL icons break on mirror.
- **Chip construction (craft):** a rectangle with text floating on top and a text block with a native text background render **pixel-identically**. Scoring the PNG therefore cannot see the defect, and craft passes on a chip that will drift the moment the copy or locale changes. Read the scene graph: for every text-only chip (pill, eyebrow, badge, tag, button), confirm the field is the text block's own `backgroundColor/*` and **not** a sibling shape sitting behind it. A text block centred on a same-size rect sibling is the tell. Fails **craft** (§6.5.1). A separate container is legitimate only when the chip's content is not just text — an icon + text, an image, several elements.
- **Curved type (craft):** likewise invisible in a render. Confirm every arced/circular text is **one** text block carrying a path baseline (`(await engine.design.getProps(id, ['text.path'])).text.path` is non-null), not a run of one-character text blocks rotated into an arc. A cluster of single-glyph text blocks at stepped rotations is the tell; it fails **craft** (§6.5.4) and usually **hierarchy** too, since those loose blocks are ungrouped (§6.3).
- **List construction (typography):** a native list and a hand-built one render almost identically — the difference only surfaces when an item wraps, and most items don't. Read the scene graph: every bulleted/numbered list must be **one** text block whose paragraphs carry a list style (`await engine.design.getProps(id, ['text.paragraphs'])` — each paragraph's `listStyle` ≠ `'None'`), one paragraph per item. Three tells, all failing **§6.1.8**: a marker typed into the string (`"• "`, `"1. "` at the start of lines), a **lone marker-glyph text block** sitting beside a text frame (a block whose whole string is `•`/`-`/`·` is never legitimate), and **one text block per item**. The last two also fail **hierarchy** (§6.3) as loose siblings.
- **Inline emphasis (typography):** an accent word set as a style range and the same word split into its own text block render identically. Read the scene graph: emphasis inside a line must be a **range on one block** — `(await engine.design.getProps(id, ['text.ranges'])).text.ranges.length > 1` — not a sibling block. The tell is two or more text blocks sharing a baseline `y` and a typeface, differing only in colour or weight, whose strings concatenate into one phrase. Fails **§6.1.9**, and hierarchy too when the fragments are ungrouped. Also check the string itself: capitals typed into the copy where no `text.ranges` entry carries a `case` is the frozen-caps defect (§6.1.9) — invisible until the design is localized.
- **Paragraph structure (typography):** read `text/paragraphSpacing` on every multi-paragraph block. A string containing a blank line (`\n\n`) with `paragraphSpacing == 0` means blank lines are being used as spacing; N stacked single-paragraph blocks that read as one passage mean the block split is doing the paragraph's job. Both fail **§6.1.8**.
- **Copy (copy):** score the words, not their setting. The scene-graph walk below already hands you every string; read them in the order the render shows them, as one voice, and ask whether a competitor could paste the same lines onto their own page unchanged. Bias hard toward leaving copy alone — the failure mode of this axis is flattening good writing, and specifics (numbers, dates, names) and trade idiom are not tells (§6.8 — bundled at the end of this document). **Never dock this axis for em dashes or curly quotes:** both are correct typography here, and §6.1.7 requires the quotes. What fails: a headline or standfirst that names nothing specific to this business, a transformation claim, an uncheckable superlative, an upbeat closer, or body copy that could be deleted without the page losing information. On a source-derived edition this axis is scored on the source's copy layer only — a restyle or a reformat that re-worded anything fails **baseline** under Copy parity below, not this axis.
- **Source-parity (localization + composition + craft + typography):** a variant is judged against **its source**, not in isolation — see the next section. Applies to every design derived from another: a **localization**, a **resize**, and a **brand restyle**. For a localized variant, also confirm the source's **style ranges survived**: if the source block has multiple runs and the variant has one, the translation flattened the accent (`localize`), which fails **localization** even when the render looks clean.

## The gate

**Every applicable axis ≥ 8. No averaging. N/A = 10.** One axis at 7 fails the design. An axis is N/A only when it genuinely cannot apply (e.g. `localization` on a single-language design) — score it 10 and mark it N/A in the scorecard.

The caller may override the default: narrow the axes ("judge typography and composition only") or move the threshold ("pass ≥ 9"). Apply the override for that run; otherwise the full gate is the default.

**This skill never asks.** Its two parameters — the axis set and the threshold — are both
defaultable, and it runs as step 5 of the Loop on every build, so a question here would interrupt
every design this server makes. Take the override if the caller gave one, otherwise take the full
gate, and score. This is the stated exception to the intake contract (`../handbook/intake.md`), which every other skill follows.

**A source-derived variant (localization, resize, or brand restyle) cannot pass on its standalone render.** The source-parity diff below is a **mandatory gate step**, not an "if in doubt" — a variant judged only against its own PNG has not been judged. If you did not `preview` the source and diff it, the gate is incomplete and the design is not done.

## Source-derived variants — judge against the source, not just the render

A **localization**, a **resize**, and a **brand restyle** are not standalone designs: each is derived from a source, and each changes exactly **one** layer — the words, the canvas, or the style — while carrying the rest faithfully. Judging one in isolation passes variants that are internally clean but **infidelity to the original** — the single largest class of derived defects (wrong leading after a font swap, a fill/effect/corner-radius/weight that silently changed, decoration that drifted, an element that vanished, a restyle that quietly re-flowed the layout, an icon the RTL flip disassembled). None of these show up scoring the variant's PNG alone; **all** of them show up the moment you put the variant next to the source.

**So for every variant with a source, `preview` the source too and diff the two renders — always, before scoring.** First name **which layer the variant is allowed to change** (words / canvas / style); everything else is held, and every difference outside that layer is a defect until you can name it as a deliberate consequence. Then judge these against the source (they feed the axes noted):

- **Element inventory** (localization + composition) — every content cluster on the source has a counterpart on the variant; nothing silently dropped or added. Missing elements read as "too simplistic."
- **Copy parity** (baseline; **brand** + resize) — the strings are the source's strings. A restyle and a reformat carry copy verbatim: no re-worded headline, no shortened subline, no dropped line "to fit" the new face or canvas. Re-wording is the `localize` layer; if the copy no longer fits, fix the type, not the text.
- **Appearance parity** (craft + color) — fills, gradients, effect/blur stacks, opacity, corner radius, stroke, shadow, and any overlay match the source; none re-created by eye, none added/removed (a cover that "became darker," a rounded corner gone square). **For a brand restyle this check inverts:** appearance is _supposed_ to change, so parity is on the **role assignment**, not the values — the block that was the background is still the background, the one accent moment is still that block, the divider is still a divider. A restyle that recoloured a rule into a second lead, or promoted a caption to the accent, broke role parity even though every value came from the kit.
- **Weight parity** (typography) — every block renders at the source block's weight; the font swap did not land on the family's lightest cut ("too light / unreadable"). For a brand restyle, the target is the **brand's** weight for that role — but relative weight order across blocks still matches the source's hierarchy.
- **Geometry / decoration drift** (localization for localize; composition for resize; craft + composition for brand) — for **localize**, every block sits on the source grid (position + size), baseline-relative where the face changed; decoration with an internal geometric relationship (a ring of stars, evenly-stepped dashes) holds that relationship. For **resize**, geometry is _re-derived_ (drift ≠ moved), so instead judge that the **system** and **identity** carried (§6.4/§6.3) and nothing was lost. For **brand**, geometry is held like a localization — a block moved for anything but a stated brand rule (safe-area margin, kicker pill, size threshold) is drift; a re-layout is a `resize`, not a restyle.
- **Re-wrap fallout** (baseline; **brand** + localization) — a font swap changes the measure, so an auto-height block can re-wrap to a new line count, grow, and collide with or push its neighbour even though nothing was moved. Diff the **line counts** against the source, not just the positions.
- **RTL selectivity** (localization) — icons/logos/marks/numerals/charts/photos are **not** mirrored; composed marks moved as groups, not disassembled.

A variant that is clean on its own but diverges from the source on any of these fails the axis noted — **do not pass it on the strength of the standalone render.** When a divergence is a deliberate, correct adaptation (a headline re-wrapped for a longer language, a block re-flowed for a new aspect, a margin widened to the brand's safe area), that is not drift; name it and pass.

**A brand restyle carries a second gate.** The kit's `avoid` list and `do-dont/` gallery sit **on top of** the axes: a single hard `avoid` violation fails the restyle even when every axis is ≥ 8. Add an **avoid-list** row to the scorecard and score it against the kit, not the rubric (the `brand` skill).

## The loop

1. **Preview** — `preview` every page that matters of the latest revision, in **one call**: `preview({ revision })` with `blockIds` omitted renders every page, so scoring the whole design costs no more than scoring page 1. Judging an old render is judging the wrong design. A render is invalidated by **content** changes, not by revision ids: if the latest revision is content-identical to one you already rendered this conversation (a no-op edit, a diagnostic/read-only pass, a rename), that render is still current — reuse it instead of re-rendering. **If the design is a localization, a resize, or a brand restyle, also `preview` the source revision** — you need both renders side by side for the source-parity checks above. **Type too small to see in the page render is not judged until you zoom it:** legal copy, captions, disclaimers and any label under ~12 px on the canvas come back as a smudge at 0.25 MP, so `baseline` and `typography` on those blocks are being scored on nothing. The page render names them for you: a `preview` of a page ends with whatever it was too coarse to resolve — type under ~10 rendered px, strokes under one — and the exact call that shows them. Follow it — `preview({ revision, blockIds: [<textId>] })` frames the block on its page, no coordinates needed — and judge how it is SET: clipped ascenders or descenders, tofu, a hairline that washes out at size, contrast against what is actually behind it, a collision the page view hid. The words themselves you already have from the scene-graph walk below; the zoom is for what the strings cannot tell you.
2. **Judge** — score each applicable axis against the render. For `typography` and `craft`, dry-run the §6.1.11 and §6.5.2 checklists line by line (read them via ../handbook/design-rules.md); for `copy`, apply §6.8 (bundled at the end of this document) before scoring the words. Any "no" on an applicable checklist line caps that axis below 8. Run the **instrumented checks** where they apply — as the TAIL of a remediation `edit` when one is happening anyway, standalone only when nothing needs fixing: the leading read-back (text.lineHeightVisual vs band), the scene-graph reads for grouping, chip construction, curved type, list construction, inline emphasis, paragraph structure and copy, and — for source-derived variants — the source-parity diff. A clean-looking PNG is not sufficient for these nine. **All seven scene-graph reads share one walk** of `engine.design.getChildren` from the page — do them in a single pass, not seven. For each text block that walk reaches, one read of `await engine.design.getProps(id, ['text', 'text.ranges', 'text.paragraphs'])` (paragraphSpacing, the string, `path`, the style runs, the per-paragraph `listStyle`) answers six of the seven; grouping is answered by the walk itself.
3. **Scorecard** — report the result in this shape (conversational markdown; no files):

   | Axis        | Score | Violations                                                       | Fix                                                  |
   | ----------- | ----- | ---------------------------------------------------------------- | ---------------------------------------------------- |
   | typography  | 6     | all-caps eyebrow untracked (§6.1.6); body leading unset (§6.1.3) | set letterSpacing 0.12; set converted lineHeight 1.5 |
   | composition | 8     | —                                                                | —                                                    |

   One row per applicable axis, N/A rows marked. Below the table: the verdict (`PASS` / `FAIL — remediating`) and, on failure, the remediation order (worst axis first).

   **Then one line for the brief.** Restate the brief this design was built from and name any place the design departs from it — a direction, palette, format or audience that is not what was asked for or agreed. The eight axes score execution only, so a design built beautifully in a direction nobody chose passes all of them; this line is the only thing that catches it. It does not gate (a deliberate, explained departure is fine) and it never becomes a question — `judge` does not ask. If the design was built with a parameter **defaulted rather than asked**, say which: that is the sentence the user needs in order to correct it in one word.

4. **Remediate** — apply the fixes via `edit` on the latest revision. Remediation is surgical: fix the flagged blocks in place (handbook §5 "Prefer surgical fixes"); lean on setProps for remediation writes — font/size/line-height changes auto-reshape with every style range preserved (§6.1.3). Never rebuild the scene to fix a spacing violation. **Fold the instrumented checks INTO this edit** — run the scene-graph walk and read-backs at the END of the same `edit` that applies the fixes (return their results), never as a separate read-only edit: a standalone audit edit costs a full turn and measured runs spent 1–2 of them per session. The edit result's own `lint:` notice already covers the mechanical §6.1 checks — trust it instead of re-measuring those.
5. **Re-judge from the edit's own render** — the remediation edit's result already ends with a render of the page it changed: that IS your re-preview for that page. Re-judge from it and call `preview` again only for pages the edit did not touch, or when a fine judgment (hairline weights, small type) needs full size — the inline render is downscaled. Re-rendering untouched pages puts near-identical copies of the same design at different revisions into the conversation, which makes it harder, not easier, to see what moved. Repeat from step 2 until the gate passes, then report done with the final scorecard.
6. **Record the verdict** — `scorecard({ revision: <the revision the passing renders came from>, verdict: 'pass' })`. This closes the loop: `export` checks the latest recorded scorecard and reminds you when a delivered revision carries changes it does not cover. If the loop is being cut short with an axis still below 8 (e.g. the user says ship anyway), record `verdict: 'fail'` — the failure belongs on record, not silently dropped. **The record is a claim about work done**: never record a verdict for renders you did not score, and after any further content `edit` the gate re-arms — judge again, record again.

## Judging discipline

- **Judge the render, not the intent.** A rule satisfied in code but broken on screen is broken.
- **Be harsh on your own work.** The common failure is scoring 8 by charity. If you hesitated, it is a 7.
- **Score honestly on partial remediation.** If a violation cannot be fixed without re-laying-out the design, say so and recommend the `resize` skill (a layout problem) or a rebuild — do not inflate the score.
- **The brief wins where the rubric is silent**; the rubric wins on hard-threshold conflicts (§6 intro).


---

# §6.8 Copy rules (handbook copy-writing-rules.md, bundled)

# Handbook §6.8 — Copy-writing rules (the words on the page)

Expands the **copy** axis. Every other section governs how the design looks; this one governs what it says. A page can pass all seven other axes and still be obviously machine-written, because nothing else in this rubric reads the words.

The rules below are adapted from Wikipedia's ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup), narrowed to copy that lives inside a layout. Template copy is not an essay: a slide headline is six words, a menu item is three, a chart caption is one sentence explaining a number. The judgment is not "does this paragraph flow" but **"would a person who actually runs this business write this line on this artifact."**

#### The tells worth hunting

- **The nothing tagline.** A line that could sit on any brand in any category. _"We navigate the intersection of raw human emotion and digital precision to redefine the modern aesthetic"_ describes no business. Replace it with what the business actually does.
- **The transformation claim.** _turns X into Y_, _stops being X and becomes Y_, _from a bottleneck into a safety net_. State the change plainly and once. The same shape twice in one design is the confession.
- **The superlative nobody can check.** _world-class_, _best-in-class_, _premier_, _unparalleled_, _the world's most-loved_. A real company writes the number instead — and when a number is already in the sentence, the superlative is doing nothing.
- **The upbeat closer.** _the compounding is just getting started_, _exciting times ahead_, _a major step in the right direction_. Cut the sentence; the line before it already made the point.
- **Manufactured depth.** Present-participle tails that add no fact (_…, reflecting the community's deep connection to the land_), abstract-noun openers that delay the point (_X has always run on a quiet contradiction_), and aphorism formulas (_X is the language of Y_).
- **Rule-of-three padding.** Three abstract nouns where one concrete one would do: _disciplined growth, operational resilience, and durable long-term value_.
- **Vocabulary that marks the text as generated.** _elevate, unlock, seamless, empower, effortless, bespoke, timeless, vibrant, tapestry, testament, redefine, leverage, holistic, curated_. Judge each in context — `curated wine pairing` on a restaurant menu is ordinary English; `curated experiences that elevate your journey` is not. The word is never the tell; the emptiness is.
- **Filler body text.** Copy that fills a frame without saying anything. Delete the block and ask whether the page lost information. If it did not, the block needs a real sentence, not a shorter version of the same nothing.

#### What is not a tell

The failure mode of a copy pass is damaging good writing. Leave copy alone when it is:

- **Specific.** Numbers, dates, names, addresses, real figures. `ARR reached $48.2M, up 27% year over year` is not slop, whatever its cadence.
- **Domain idiom.** `synergy targets` in a CV, `transformation programme` in consulting, `house-made` on a menu. Trade language is how those trades write.
- **The voice the brief asked for.** A luxury stationery card is meant to sound formal; a pull quote is meant to sound quotable; a greeting card is warm and formulaic because that is the product.
- **Deliberately generic placeholder copy**, where the design ships as a template for someone else's words.

#### Typography is not a tell

Two rules from general anti-AI-writing guidance are written for web prose and are **wrong here**:

- **Em and en dashes stay.** In a layout the em dash is typography: `Reception 7:00 PM — Dinner at 8:00` is correct setting, and so is a dash in a pull quote or a chart annotation. What can be a tell is **density** — three or more in one short block, or a dash in every second line of a deck. Flag the pattern, never the character.
- **Curly quotes stay.** `“…”` and `’` are correct typography and §6.1.7 already requires them. Straight quotes are the defect, not the fix — except in a monospace or terminal design where the plain glyph is the point.

Likewise, do not inject personality where the artifact does not want it. Adding opinions, first person or asides is right for a blog post and wrong for a wedding invitation, a lab report cover or a compliance footer, where neutral and plain **is** the correct human voice.

#### Editing copy in an existing design

- **Length is a layout constraint.** The text sits in a frame laid out around it. Keep a rewrite within ~10% of the original character count, preserve explicit line breaks and their positions, and preserve leading/trailing spaces — some strings are fragments of a sentence split across styled blocks. One string in, one string out: never merge or split blocks to make a rewrite fit.
- **Localized editions move together.** A source-derived edition shares its blocks with the source (§6.6), so rewriting only the source language leaves the German saying what the English used to. Rewrite every language, or leave the string alone.
- **Check the glyphs before you commit.** A saved archive carries **subsetted** fonts — only the glyphs the copy needed when it was built. A rewrite that introduces a new character has no glyph, and the engine falls back to another face silently rather than failing: the render comes back with mixed stroke weights inside one headline and looks almost right. Latin copy rarely trips this; a CJK subset can be ~150 glyphs, so nearly any rewrite does. Re-render and read the result, and prefer characters the design already uses.

#### Pass

Every line names something true about this business, product or occasion that a competitor could not paste into their own page; no transformation claim, uncheckable superlative or upbeat closer; no abstract-noun opener or participle tail standing in for a fact; vocabulary chosen for the trade rather than for the register; every rewrite within its frame's length, its line breaks intact, its sibling languages carried, and its glyphs actually present in the packed fonts.
