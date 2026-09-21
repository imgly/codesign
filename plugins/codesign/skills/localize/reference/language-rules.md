# Localization rules (per-language quality)

Reference for the `localize` skill. Consult the row(s) for the **target locale(s)** you're
building. Change the copy only; the design stays. These are the criteria behind the
`localization` axis of the `judge` gate.

## 1. Preserve vs. localize

- **Localize** — only the copy, plus the script-driven consequences it _forces_: the font that
  covers the new glyphs (see `reference/font-loading.md`), and the per-locale type settings that
  font/script demands (§3).
- **Font swap is per block, scoped to the script.** The new face goes **only on blocks whose copy
  is in the target script.** A block kept in the source script (the "keep byte-identical" items
  below) **retains its source typeface** — never re-font the whole scene. Applying the script face
  to a Latin-only block (a name, wordmark, chips, dates) is a `localization` defect **even when its
  text is correctly preserved**.
- **Match the font's CHARACTER, not just its coverage (§6).** "A font that covers the glyphs" is
  necessary but not sufficient: the replacement face must carry the same _typographic voice_ as the
  Latin face it replaces — **serif ↔ serif, sans ↔ sans, script ↔ expressive** (see §6 for the
  cross-script table). A high-contrast editorial serif design set into a flat Arabic Kufi or a CJK
  Gothic renders with zero tofu but loses the design — a `localization` **and** `typography` defect.
- **Preserve** — layout, grid, margins, palette, the single accent color, composition, and the
  type scale/bands. Touch size or wrap-width **only** to re-fit after a length change (§4), never
  to restyle. (This is enforced structurally by the snap-to-reference routine in `SKILL.md`.)
- **Do not translate — keep byte-identical across all locales:** brand/product/company names &
  wordmarks; **personal names** (quote authors, bylines, credits); **@handles**/hashtags; **URLs**,
  domains, emails; trademarks (®™©) & legal-entity names; model numbers/SKUs/version strings;
  scientific names, formulas, math; currency/unit **ISO codes** (USD, EUR, kg — code stays, its
  _format/placement_ localizes, §2); programming identifiers, file/API names; emoji.
- **Names default to their source form.** Transliterating a name into a different-script locale is
  an **optional, deliberate choice, never required**; a Latin name inside RTL must still read
  correctly via bidi.
- **But these still localize:** place names with an established **exonym** (München ↔ Munich),
  works with an **official translated title**, and the **format** of numbers/dates/currency/units
  (§2). When unsure whether a proper noun has a target form, keep the source form.

## 2. Translation quality

- **Natural, not literal** — translate meaning and register, not words; preserve rhetorical
  structure (parallelism, antithesis, rhythm).
- **Complete and monolingual** — no leftover source words, mixed-language fragments, or
  machine-glitch artefacts.
- **Register-matched** — Arabic → **MSA** (not dialect); Japanese → **real kanji + idiomatic**, not
  romaji/calque; match the source's tone.
- **Localize numerals/dates/currency/units** per locale (Arabic uses **Western numerals**;
  separators, date order, currency placement follow locale).

## 3. Per-language conventions

Per-script-family conventions, numeric leading bands, and quotation marks live in **one file per
script family** beside this one. Read the file(s) for your target locale(s):

| File                 | Languages                               | Headline risks                                         |
| -------------------- | --------------------------------------- | ------------------------------------------------------ |
| `latin-expansion.md` | German, French, Spanish…                | +20–35% expansion; capital-diacritic leading           |
| `arabic.md`          | Arabic (RTL)                            | mirroring; never letter-space; bidi                    |
| `cjk.md`             | Japanese, Chinese, Korean               | tofu; full-width punctuation; no caps/italics/tracking |
| `vietnamese.md`      | Vietnamese, stacked-diacritic Latin     | hard no-tofu gate; stacked-mark leading                |
| `cyrillic.md`        | Russian, Ukrainian, Serbian, Bulgarian… | font coverage (static bold); modest expansion          |

## 4. Layout integrity after translation

- After swapping the string, re-check: **nothing overflows** its frame or the page, **nothing
  overlaps**, no **dead void** where copy shrank.
- **Re-fit only within the design system:** adjust font size _within its band_, wrap-box width, or
  line breaks — never break the grid, margins, palette, or scale. With the snap-to-reference
  routine, the only permitted re-fit is the quote's overflow shrink.
- **Re-measure & re-center** any block centred by measured width; `loadResources` before
  reading frame dims.
- **Contraction:** if a void opens, keep it only if it reads as intentional whitespace; otherwise
  re-balance within existing margins — don't invent elements to fill space.

## 5. Quotation marks & punctuation per locale

Smart punctuation is mandatory (handbook §6.1.7) — use the **locale's** marks. The per-locale
quotation marks live in the family file for the target locale (§3's table).

A quotation mark used as an **oversized decorative glyph** is itself locale-dependent text — it
**may be localized** to the target mark („ German, « » French/Cyrillic, 「/『 Japanese, » Arabic),
or **kept as the source `“` as a brand motif**. Either passes, but **stay consistent across the
localized set**, and at minimum a **directional** decorative mark must **mirror in RTL**
(`“`→`”`/`»`). If a variant carries **more** decorative glyphs than the reference (e.g. an Arabic
opening+closing bookend where English has one), match the reference count — the routine destroys
the extras.

## 6. Font-character pairing — match the voice across scripts

The single rule that separates a localization that merely _renders_ from one that _carries the
design_. Pick the target-script face by the **character** of the Latin display face it replaces,
not by "an available font." Classify the Latin face (serif / sans / script) from the **rendered**
source — don't trust the copy or metadata, look at the preview — then pair:

| Latin display character                                                                  | → Arabic                                                                     | → CJK (Japanese)                                             |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **High-contrast / editorial serif** (Playfair, Cormorant, DM Serif, EB Garamond, Didone) | **Amiri** or Noto Naskh Arabic (Naskh serif — real stroke modulation)        | **Shippori Mincho / Noto Serif JP** (Mincho = the CJK serif) |
| **Geometric / grotesque sans** (Poppins, Montserrat, Inter, Bebas Neue, Anton)           | **IBM Plex Sans Arabic / Cairo / Tajawal** (matched sans)                    | **Noto Sans JP / Zen Kaku Gothic** (Gothic = the CJK sans)   |
| **Handwritten / cursive script** (Pacifico, Caveat, Great Vibes)                         | **Aref Ruqaa** (Ruqʿah calligraphy) or **Lalezar** (rounded playful display) | **Yomogi / RocknRoll One** (casual/handwritten)              |

- **It runs BOTH directions.** "Serif → flat Kufi" is the common defect, but "sans English → Mincho
  serif JA" is equally wrong. The rule is _match character_, not _prefer serif_. A Naskh face is a
  serif and a poor match for a sans design — don't default to the file's "verified pick" (often a
  serif) without checking the Latin face's character first.
- **CJK has no italic/cursive.** Map Latin serif→Mincho, sans→Gothic; carry heading emphasis with
  weight + size, not a separate style (see `cjk.md`).
- **No exact equivalent → nearest expressive.** Arabic has no true cursive-connected "handwriting"
  face; for a Pacifico/Great-Vibes accent pick the nearest expressive display (Aref Ruqaa, Lalezar)
  rather than collapsing to a flat sans — preserve the _feeling_.
- **Per block.** Apply the matched face only to blocks whose text is in the target script; a design
  that pairs a serif display with a sans body needs both matched (serif→Naskh-serif, body→sans).
  Latin-retained runs keep their source face (§1).

Concrete jsDelivr paths for these picks are in `reference/font-loading.md` (Verified picks).

## 7. Process (see the Workflow + routine in SKILL.md)

Fork the finished base (or reuse an existing localized build), swap strings, apply the script font
and per-locale settings, **snap to the reference geometry** (font/size writes auto-reshape,
ranges preserved; translated strings need semantic range re-location), `loadResources`,
`preview` per locale.

## 8. Localization pass checklist

Any "no" on an applicable line drops that axis below 8.

**Localization**

- [ ] Only copy (+ forced font/type settings) changed; layout/grid/palette/accent/scale preserved
- [ ] Font swap scoped per block — script face only on target-script blocks; fixed/Latin-retained blocks keep their **source typeface** (no global re-font)
- [ ] Script face matches the Latin face's **character** (serif↔serif, sans↔sans, script↔expressive — §6), classified from the rendered source; not just glyph-covering
- [ ] Fixed items (brand/personal names, handles, URLs, trademarks, codes, formulas, ISO codes, emoji) untranslated
- [ ] Names in source form — transliteration optional; exonyms / official titles applied where they exist
- [ ] Copy idiomatic, complete, monolingual; rhetorical structure & register preserved
- [ ] Numerals/dates/units per locale; Arabic = MSA + Western numerals
- [ ] Native diacritics/casing; JP real kanji, no caps/italics, full-width punctuation
- [ ] Locale-correct quotation marks incl. decorative marks (kept or localized, consistent, mirrored in RTL); no straight quotes
- [ ] Zero tofu — every glyph renders in a script-appropriate face, checked in `preview`

**Leading (numeric bands per the family files; visual multipliers — apply the handbook §6.1.3 content-area conversion)**

- [ ] All-caps with capital diacritics loosened ~+0.15 (`latin-expansion.md`) — accents clear, no clip or collision
- [ ] Mixed-case display/headline with a marked CAPITAL (Ä/Ö/Ü/É/Ñ — routine in German nouns & title-case) or stacked marks: display leading ≤1.2 nudged +0.2, accent clears line above & block top (`latin-expansion.md`, `vietnamese.md`)
- [ ] Localized mixed-case display/headline (diacritic language) with leading ≤1.2 nudged +0.2 (→~1.35) by default — regardless of the current string; leading already >1.2 not bumped; uniform per language (`latin-expansion.md`)
- [ ] Tight "no change" applied only to source-language / provably fixed strings (`latin-expansion.md`)
- [ ] Non-Latin leading set by script — CJK body 1.6–1.75 / display 1.25–1.35 (`cjk.md`); Arabic-Naskh body 1.6–1.8 / display 1.3–1.5 (`arabic.md`); Vietnamese body 1.5–1.65 (`vietnamese.md`)
- [ ] Leading **re-derived on the target face**, not copied raw from the reference — every value set via the content-area conversion (`setLeading`/`design.font`), and the **rendered gap** read back against the band (not the engine number); the +0.2 backed off where it opened a slack void (`latin-expansion.md`)

**RTL (Arabic; LTR locales N/A = 10)**

- [ ] Reading order mirrored (right-aligned, or symmetric-centered); directional/decorative elements flow RTL
- [ ] **Do-not-mirror inventory respected** — icons, logos, brand/glyph marks, numerals, charts, photos NOT flipped; mirroring done on **groups** (composed icon / lockup / badge moves as a unit), not loose blocks; in-frame content re-anchored with its frame, not flipped independently (`arabic.md`)
- [ ] Arabic never letter-spaced; decorative quote glyph mirrored
- [ ] Latin brand names/numbers correct via bidi

**Layout (post-translation) — the drift gate**

- [ ] No overflow, no overlap, no unbalanced void at the new string lengths
- [ ] Every block sits on the **reference grid** (position + size), not re-centered/resized per locale; text blocks snapped **baseline-relative** where the face changed (no ar/ja "moved-down" drift)
- [ ] **Font weight** carried onto the swapped face (not the family's lightest cut; variable-bold trap checked) — matches the reference block's weight in the render
- [ ] **Appearance parity** — fills/gradients/effects/corner-radius/overlay match the source (inherited by forking, or re-captured and re-applied — never re-created by eye)
- [ ] Ghost count matches the reference; re-fit stayed within the existing grid/scale/palette
- [ ] Native export dimensions (page pixel size)
