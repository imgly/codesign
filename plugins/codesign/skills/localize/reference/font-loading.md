# Font loading (CoDesign / CE.SDK)

Reference for the `localize` skill. Read this when the target locale needs a non-Latin or
non-handbook face (Cyrillic / CJK / Arabic / Vietnamese), or when a language swap produced tofu,
a Latin-looking sans where a script font should be, or a "Bold" that renders Regular.

Mechanics for getting a non-Latin / non-handbook face to actually render. The CoDesign
`handbook` §6 is the general Latin-font baseline (single-URI font declaration,
static-vs-variable, blank-glyph diagnosis); this file is what §6 lacks for extended scripts.

## The one rule

`await engine.design.setProps(id, { text: { font: { typeface, uri } } })` takes **one `uri`**, and it
must resolve to a **single, complete, static-or-variable TTF that already contains every glyph
in the copy**.

- **Source: jsDelivr's mirror of google/fonts.** Direct, fetchable, unversioned-stable:
  `https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/<family-dir>/<FontFile>.ttf`
- Pass the URL **directly** as the declaration's `uri`. Do not fetch bytes and inline them (see failures below).

## Variable vs static — the bold trap

- A full jsDelivr variable TTF **renders**, but CE.SDK draws **only its default instance**
  (usually Regular). **You cannot get a non-default weight (e.g. Bold) from a variable TTF.** For a
  bold display face you need a **static Bold file**, not the variable one.
- URL-encode axis brackets when you do use a variable file for its default weight:
  `PlayfairDisplay[wght].ttf` → `PlayfairDisplay%5Bwght%5D.ttf`.

## Verified picks

**Pick by the Latin face's _character_, not just coverage** (`language-rules.md` §6): serif↔serif,
sans↔sans, script↔expressive. The table gives a pick for each character in each script.

| Latin character → target script                     | Family (role)                                             | jsDelivr path                                                                                                   |
| --------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Arabic — serif** (match editorial serif)          | Amiri (Naskh serif)                                       | `ofl/amiri/Amiri-Regular.ttf` (+ `Amiri-Bold.ttf`)                                                              |
| **Arabic — sans** (match geometric/grotesque)       | IBM Plex Sans Arabic / Cairo / Tajawal                    | `ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf` (Bold too); `ofl/cairo/…`; `ofl/tajawal/Tajawal-Bold.ttf` |
| **Arabic — script/expressive** (match handwriting)  | Aref Ruqaa (Ruqʿah) / Lalezar (rounded display)           | `ofl/arefruqaa/ArefRuqaa-Regular.ttf` (+ `-Bold`); `ofl/lalezar/Lalezar-Regular.ttf`                            |
| **Japanese — serif** (match editorial serif)        | Shippori Mincho / Noto Serif JP (Mincho)                  | `ofl/shipporimincho/ShipporiMincho-Regular.ttf` (+ `-Bold`)                                                     |
| **Japanese — sans** (match geometric/grotesque)     | Noto Sans JP / Zen Kaku Gothic New (Gothic)               | `ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf` (static Bold: `ofl/zenkakugothicnew/ZenKakuGothicNew-Bold.ttf`)       |
| **Japanese — script/casual** (match handwriting)    | Yomogi / RocknRoll One                                    | `ofl/yomogi/Yomogi-Regular.ttf`; `ofl/rocknrollone/RocknRollOne-Regular.ttf`                                    |
| **Korean — serif** (match editorial serif)          | Nanum Myeongjo / Gowun Batang (Myeongjo/명조)             | `ofl/nanummyeongjo/NanumMyeongjo-Regular.ttf` (+ `-Bold`, `-ExtraBold`); `ofl/gowunbatang/GowunBatang-Bold.ttf` |
| **Korean — sans** (match geometric/grotesque)       | Gothic A1 / Nanum Gothic / IBM Plex Sans KR (Gothic/고딕) | `ofl/gothica1/GothicA1-Bold.ttf` (9 statics, Thin→Black); `ofl/nanumgothic/NanumGothic-Regular.ttf` (+ `-Bold`) |
| **Korean — display** (a heavy title lockup)         | Black Han Sans / Do Hyeon                                 | `ofl/blackhansans/BlackHanSans-Regular.ttf`; `ofl/dohyeon/DoHyeon-Regular.ttf` (single weight each)             |
| Latin + Vietnamese stacked diacritics, **one file** | Playfair Display (Didone serif)                           | `ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf`                                                             |
| **Cyrillic (+ Latin), static Bold + Regular**       | **Fira Sans (geometric sans)**                            | `ofl/firasans/FiraSans-Bold.ttf` / `ofl/firasans/FiraSans-Regular.ttf`                                          |
| Plain Latin (English/German/…)                      | the handbook's pre-validated static URIs                  | — (no fetch needed)                                                                                             |

⚠ The old table listed only the **serif** Arabic/CJK picks (Amiri, Shippori Mincho). Grabbing
those for a **sans** design is the exact "serif-into-a-sans-design" mismatch §6 warns against —
match the character first, then pick the row.

- **Cyrillic caveat:** **Poppins has no Cyrillic glyphs**, and **Montserrat is variable-only** on
  jsDelivr (no static bold → no bold display weight, per the trap above). **Fira Sans** ships
  static `FiraSans-Bold.ttf` + `FiraSans-Regular.ttf` with full Cyrillic and reads as a clean
  geometric sans — the default Cyrillic pick.
- CJK files are large — a Japanese page's PDF / archive embeds the whole font (~4.5 MB). Expected.
- **CJK bold needs a static Bold file too.** `ShipporiMincho-Regular.ttf` renders Regular only; for
  a bold Japanese heading load `ofl/shipporimincho/ShipporiMincho-Bold.ttf` (static) — the same
  bold trap as Montserrat/variable faces. No static Bold available → carry the weight with
  size/color, never faux-bold.
- **A Japanese face has no Hangul, and a Korean face has no kana.** They are not interchangeable,
  and "it's a CJK font" is not a coverage claim — `NotoSansJP` on Korean copy renders the whole
  line as tofu. Pick the row for the actual script.
- **Korean caveat:** **Noto Sans KR and Noto Serif KR are variable-only** on jsDelivr
  (`NotoSansKR%5Bwght%5D.ttf`), so they render their default instance and give you no bold — the
  trap above. **Gothic A1** ships nine static weights (Thin→Black) and is the default Korean sans
  pick; **Nanum Myeongjo** is the serif counterpart with static Regular/Bold/ExtraBold.

## What does **not** work (and why)

- **`data:` URIs are rejected** — _"Scene contains disallowed schemes in resource URLs: data"_.
  The scene may only reference fetchable schemes (`https://`, `workspace://`).
- **Google Fonts `&text=` / `/l/font?kit=…` dynamic-subset endpoint is unusable.** It returns
  non-sfnt bytes to a programmatic fetch and content-negotiates on the _fetcher's_ User-Agent — so
  even if your fetch coaxes out a TTF, CE.SDK re-fetches with its own UA, gets woff, and **silently
  falls back to a system sans** (correct glyphs, wrong face — invisible without a visual check).
- **Google `/s/…​.ttf` static slices are per-subset** (`latin` and `vietnamese` are separate
  files). The declaration takes one URI, so you cannot compose Latin + Vietnamese from slices —
  this is why single-subset Latin URIs tofu on extended scripts.

## Font-declaration gotchas (script-agnostic)

- **Force the swap with a unique `typeface.name`.** CE.SDK treats two typefaces with the same
  `name` as identical and skips the reload — a new URI under the same name silently no-ops. Give
  each distinct face a distinct name (e.g. `"Fira Sans Bold RU"`, `"Amiri"`, `"Shippori Mincho"`).
- **Await before you measure or capture:** `await engine.design.loadResources([page])`. A
  non-zero `getFrameHeight` on an Auto-height block is the "loaded + shaped" signal.
- **No manual reshape needed** — font / size / line-height writes via `setProps` re-shape
  automatically with every per-character style range preserved (handbook §6.1.3).
- **Always verify with `preview`.** The silent-sans-fallback failure produces a plausible page in
  the wrong typeface; only a look catches it.

## Coupling to the type rules (all in handbook §6.1)

- **Arabic** — `text/letterSpacing = 0` (tracking severs cursive joins); RTL via auto-bidi; mirror
  a directional decorative quote glyph. See handbook §6.1.5–§6.1.6.
- **Japanese / CJK** — no all-caps, full-width punctuation (、。), optional katakana for names.
- **Vietnamese / capital-diacritic scripts** — extra leading for stacked marks (handbook §6.1.3).
- **All CE.SDK line-heights** — write the visual target as
  `setProps(id, { text: { lineHeight: { visual: target } } })`: the facade
  divides by the font's content area per face (metrics cached when the font is
  resolved or `loadResources` runs; a bare number is the raw engine scale).
  Read back via `getProps(id, ['text.lineHeightVisual'])`. (handbook §6.1.3.)
