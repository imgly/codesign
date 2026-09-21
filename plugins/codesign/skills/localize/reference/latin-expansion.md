# Expansion-prone Latin (German, French, Spanish…)

Family file for the `localize` skill: conventions, leading bands, and quotation marks for
diacritic-carrying Latin languages with significant text expansion. Every leading value here is a
**visual** multiplier — apply the handbook §6.1.3 content-area conversion (divide by the font's
content area, via `lineHeight: { visual }` — the facade converts) before setting `text/lineHeight`.

## Conventions

- Expect **+20–35% length** vs English (German worst). Primary risk is **overflow** — verify
  against `language-rules.md` §4.
- **German:** capitalize nouns; use real **ä ö ü ß**, never `ae/oe/ss`.
- Verify the font covers every diacritic in the copy — no tofu, no clipped accents (handbook
  §6.1.7). The handbook §6.7 Latin font table applies; coverage rarely fails for these languages,
  but check É Œ ẞ in `preview`.

## Leading (the capital-diacritic rules)

- **Localized all-caps — add leading for capital diacritics.** The tight all-caps range (0.9–1.0,
  handbook §6.1.3) assumes **unmarked Latin capitals**, which sit entirely inside the cap-height
  band. Capitals carrying **diacritics** — German **Ä Ö Ü** (and **ẞ**), French
  **É È Ê Ë À Â Ç Œ**, Spanish **Ñ**, Nordic **Å Ø**, Polish/Czech — extend **above cap-height**
  (accents) and sometimes **below the baseline** (cedilla, ogonek). At 0.9–1.0 those marks clip
  the block's top edge (single line) or collide with the descenders/baseline of the line above
  (multi-line). So when all-caps copy contains marked capitals, **loosen by ~+0.15 for web &
  print** instead of 0.9–1.0. (Stacked diacritics — Vietnamese — go further: see
  `vietnamese.md`.) This applies even to one-line labels (top-clip risk) and even when the
  language is only _possible_ (a localized template whose string may later become German/French).
  Judge by the **visual gap**: the highest accent must clear the top of its box and the line above
  with margin — no touching, no clipping. Keep it **uniform per language** — don't mix 0.95 and
  1.05 across same-band all-caps lines in one localized layout.
- **A marked _capital_ in a mixed-case headline needs leading too — the trigger is a mark
  breaching the cap-height/ascender band at tight leading, not "all-caps" and not "the language
  has umlauts."** Marked capitals (Ä Ö Ü ẞ · É È À Ç Œ · Ñ · Å Ø) breach the band in mixed-case,
  not only all-caps — and they are routine in mixed-case German, which capitalizes every noun
  (**Öl, Äpfel, Größe, Über**), and in any title-case headline (**É**cole, **Ö**sterreich). So a
  mixed-case **display / headline** carrying a marked capital takes the all-caps treatment scaled
  down: nudge tight display leading (**≤1.2**) up by **+0.2** (a 1.1–1.2 headline → **1.3–1.4**)
  and verify the accent clears the line above and the block top (handbook §6.1.7). Body leading
  (≥1.4) already has the room — no change.
- **Single _lowercase_ European marks (ä ö ü é à ñ) do _not_ breach the band** — they sit inside
  the ascender space standard leading already reserves. So an all-lowercase-mark line may keep the
  tight value **only in the untranslated source, or when the string is provably fixed**; for a
  _localized_ variant, prefer the defensive default below over betting the copy never gains a
  marked capital.
- **Localization is variable — loosen localized display _by default_, don't wait for a marked
  capital to appear.** A localized headline's characters change per locale and over time, and any
  diacritic-using Latin language will eventually put a marked capital into a display line. **Give
  every _localized_ mixed-case display / headline in a diacritic-using language the loosened value
  by default** — **if its display leading is ≤1.2, nudge it up by +0.2** (an English-source
  1.1–1.2 headline → **1.3–1.4**) — regardless of whether _this_ string currently shows a mark.
  Leading already **>1.2** is loose enough — don't bump it further. The tight "no change"
  allowance is therefore **source-language / fixed-string only**, not something to lean on across
  a localized set. Body (≥1.4) already clears marks, so this targets display/headline; keep it
  **uniform per language** (all same-band localized headlines share the value).
- **The +0.2 is a gap target, not a blind arithmetic bump — verify it in the render, then stop.**
  The nudge exists to buy the accent room; it is **not** a licence to loosen a headline that
  already looks right. After applying it, look at the rendered gap: the goal is the §6.1.6 display
  band (a snug ~0.15–0.25× cap-height gap that _clears_ the highest accent), **not** the airy
  1.35× look. If the headline is single-line, or its script never breaches the band, or the +0.2
  visibly opens a slack inter-line void ("line-height is too much"), **back it off** to the
  smallest value that still clears the mark. The failure this rule most often _causes_ is an
  over-loose German/French headline — treat that as the same defect as a too-tight one, judged by
  the **rendered gap**, never by whether the arithmetic was applied. (This is also why the value is
  a **visual target** fed through the content-area conversion, not an engine number: see the snap
  routine's `setLeading` in `SKILL.md`.)

## Quotation marks

| Locale            | Primary quotes | Notes                      |
| ----------------- | -------------- | -------------------------- |
| EN / ES(Latin-Am) | “ ” ‘ ’        |                            |
| DE                | „ “ ‚ ‘        | opens low                  |
| FR                | « »            | non-breaking spaces inside |

## Cross-references

- `language-rules.md` — preserve-vs-localize, translation quality, layout integrity, the pass checklist.
- handbook §6.1.3 — base Latin leading bands + the content-area conversion every value here goes through.
- `font-loading.md` — only needed if the design's face lacks a diacritic (rare for this family).
