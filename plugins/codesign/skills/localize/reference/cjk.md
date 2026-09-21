# CJK (Japanese, Chinese, Korean)

Family file for the `localize` skill: conventions, leading bands, and quotation marks for CJK
scripts. The general sections below are written from Japanese practice and hold for CJK broadly;
**Korean diverges on spacing, punctuation and fonts — read "Korean (ko-KR)" before setting Hangul.**
Every leading value here is a **visual** multiplier — apply the handbook §6.1.3 content-area
conversion (write `lineHeight: { visual }` — the facade converts) before setting
`text/lineHeight`.

## Conventions

- **Real kanji**, idiomatic; no romaji dumps.
- **No all-caps, no italics** — CJK has neither; never fake them. Foreign names may stay Latin
  or, optionally, be written in katakana.
- **Font swap only on CJK blocks.** Foreign names/brands/URLs/numbers kept in Latin **retain their
  source typeface** — declare the CJK face (`text.font`) only on blocks that carry CJK text; don't re-font a
  Latin-only block (a name, wordmark, chips, dates) into the CJK serif.
- **Full-width punctuation:** 、 。 「 」 『 』 （ ）. Do not reuse Latin `, . " ()`.
- Respect **kinsoku** — a line shouldn't _start_ with 、 or 。. The engine usually handles this —
  verify in `preview`.

## Leading & tracking

Full-width glyphs fill the em and pack dense — set leading explicitly, looser than Latin:

- **Body 1.6–1.75**
- **Display / headline 1.25–1.35**
- **No tracking** — `text/letterSpacing = 0` (handbook §6.1.6); CJK is never letter-spaced.

## Korean (ko-KR)

Korean is **not** Japanese with different glyphs. Four differences change the output:

- **Korean has inter-word spacing** (띄어쓰기) and breaks lines at spaces like Latin does. Do not
  carry Japanese habits over: no ideographic space (U+3000) as a field separator, and kinsoku is
  not the mechanism here.
- **Punctuation is Latin-width** — `, . ? !` with ordinary spacing, not 、 。. Primary quotes are
  **“ ”** (secondary ‘ ’); 「 」 belong to literary or vertical setting, not marketing copy.
- **Leading sits between Latin and Japanese** — body **1.5–1.7**, display **1.2–1.3**. Hangul
  syllables are full-width and pack densely, but word spaces open the line up.
- **Contraction is mild.** Character count badly overstates it: against English, expect roughly
  **−20% to −30%** of rendered width for a headline, and a short CTA may not shrink at all. Do not
  re-scale or re-flow a layout to "fill" space that was never freed.

Everything else in this file applies: no all-caps (Hangul has no case), no italics, no tracking,
and the font swap goes on Hangul blocks only.

**Fonts — Gothic (고딕) is the Korean sans, Myeongjo (명조) the serif:**

- Geometric / grotesque sans Latin → **Gothic A1** (nine static weights) or **Nanum Gothic**.
- Editorial serif Latin → **Nanum Myeongjo** or **Gowun Batang**.
- A heavy display lockup → **Black Han Sans** / **Do Hyeon** (single weight each).

⚠ **A Japanese face has no Hangul.** `Noto Sans JP` on Korean copy is a page of tofu, and "it is a
CJK font" is not a coverage claim — the scripts do not share faces. Note also that **Noto Sans KR
and Noto Serif KR are variable-only** on jsDelivr, so they give you no bold; see `font-loading.md`.

## Quotation marks

| Locale   | Primary quotes | Notes                                                   |
| -------- | -------------- | ------------------------------------------------------- |
| JA / CJK | 「 」 『 』    | full-width corner brackets                              |
| KO       | “ ” ‘ ’        | Latin-style quotes; 「 」 only in literary/vertical set |

## Fonts

A CJK-covering face is mandatory, **matched to the Latin face's character** (`language-rules.md`
§6) — **Mincho is the CJK serif, Gothic is the CJK sans**:

- **Editorial / high-contrast serif** Latin → **Shippori Mincho / Noto Serif JP** (Mincho).
- **Geometric / grotesque sans** Latin → **Noto Sans JP / Zen Kaku Gothic New** (Gothic). Setting a
  sans design in Mincho is the common inverted mismatch — check the Latin character both ways.
- **Handwritten / casual** accent → **Yomogi / RocknRoll One**.
- No italic/cursive in CJK — carry emphasis with **weight + size**, not a separate style.

Loading mechanics + jsDelivr paths are in `font-loading.md`. Latin faces have zero CJK coverage — a
wrong font is instant tofu; `preview` every edition.

For **bold** CJK headings load a **static Bold CJK file**
(`ofl/shipporimincho/ShipporiMincho-Bold.ttf`) — a single Regular file (or a variable face's
default instance) renders **Regular only** (the bold trap, `font-loading.md`). If no static Bold
is available, carry the heading's weight with **size/color** instead of a faux-bold.

## Cross-references

- `language-rules.md` — preserve-vs-localize, translation quality, layout integrity, the pass
  checklist.
- handbook §6.1.3 — the content-area conversion; §6.1.6 — the no-tracking rule.
- `judge` — the `localization` axis scores kanji quality, punctuation, and tofu.
