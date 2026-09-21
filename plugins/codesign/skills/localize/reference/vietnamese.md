# Vietnamese (and other stacked-diacritic Latin scripts)

Family file for the `localize` skill: conventions and leading bands for Vietnamese — Latin base
with **heavy stacked diacritics** (ệ, ữ, ợ, ố…). Every leading value here is a **visual**
multiplier — apply the handbook §6.1.3 content-area conversion (divide by the font's content area
via `lineHeight: { visual }` — the facade converts) before setting `text/lineHeight`.

## Conventions

- The font **must** cover the stacked marks — a **hard no-tofu gate**. Most Latin faces don't;
  check the copy's worst glyphs in `preview` before anything else.
- **Stacked marks breach the ascender band even on _lowercase_** — unlike single European marks
  (ä é ñ), Vietnamese marks stack _above_ the ascender. So a mixed-case Vietnamese display or
  body headline loosens per the bands below — not only its all-caps.

## Leading

- **Body 1.5–1.65**
- **Display 1.25–1.4**
- **All-caps 1.15–1.25** — the capital-diacritic rule (see `latin-expansion.md`) at its loosest;
  stacked marks need the most clearance of any Latin copy.

Judge by the **visual gap**: the highest stacked mark must clear the top of its box and the line
above with margin — no touching, no clipping. Leading already above these bands isn't bumped
further; keep it uniform per language.

## Quotation marks

Vietnamese uses the Latin set: “ ” ‘ ’ (per `language-rules.md` §5's smart-punctuation rule).

## Fonts

**Playfair Display's single static file covers Vietnamese** — the verified pick for display; see
`font-loading.md` for the table and the variable-bold trap before choosing anything else.

## Cross-references

- `latin-expansion.md` — the general capital-diacritic rules this family escalates.
- `language-rules.md` — preserve-vs-localize, layout integrity, the pass checklist.
- handbook §6.1.3 — the content-area conversion; §6.1.7 — no tofu, no clipping.
