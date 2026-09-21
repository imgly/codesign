# Cyrillic (Russian, Ukrainian, Serbian, Bulgarian…)

Family file for the `localize` skill: conventions and quotation marks for Cyrillic-script
languages.

## Conventions

- **Font coverage is the trap:** most geometric-sans Latin favourites don't ship Cyrillic —
  **Poppins has none**, **Montserrat is variable-only** (no static bold). Use a
  Cyrillic-covering face with a static bold; **Fira Sans** is the default pick (see
  `font-loading.md`).
- Modest expansion (~+10–15% vs English); verify against `language-rules.md` §4, though it rarely
  overflows a box that held English.
- **Casing & italics are Latin-like** — normal upper/lower and italics apply (unlike CJK). Keep
  the reference's tracking; Cyrillic tolerates the same letter-spacing as Latin.
- Latin brand names / `@handles` / URLs stay Latin, correct via bidi.

## Leading

No script-specific bands — the **base Latin bands in handbook §6.1.3 apply** (body 1.4–1.6 web /
1.2–1.45 print, display per its band, all-caps 0.9–1.0). Cyrillic capitals carry no diacritics
that breach the cap-height band.

## Quotation marks

| Locale        | Primary quotes | Notes         |
| ------------- | -------------- | ------------- |
| RU / Cyrillic | « »            | secondary „ “ |

As a _decorative_ glyph, keep the source `“` motif or localize to `«` — consistently across the
set (`language-rules.md` §5).

## Cross-references

- `language-rules.md` — preserve-vs-localize, translation quality, layout integrity, the pass
  checklist.
- `font-loading.md` — the Fira Sans row and the variable-bold trap.
- handbook §6.1.3 — the Latin leading bands this family inherits.
