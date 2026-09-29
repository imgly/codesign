# Brand-kit schema — the canonical ruleset shape

Reference for the `brand` skill. This defines the **one shape every brand maps into** so the skill
(and any design-generation agent) can apply any brand the same way. A brand kit is a
`<kit>/` folder; `tokens.json` is its machine-readable law, `BRAND.md` the prose
companion, and the subfolders hold real assets.

## The core idea — brand-agnostic keys, brand-named values

The **keys** of `tokens.json` are fixed and brand-neutral (`semanticColors`, `typography`, `logo`,
`colorSchemes`, `elements`, `device`, `safeArea`, …). The **values** are the brand's own — its ramp
names, hexes, font families, logo files, and rules. Mapping a new brand = filling the same keys with
that brand's values. A brand names its own ramps (`brand`, `mintyparadise`) and devices
(`gradientCloud`); the skill reads them by their **role**, not their name, via `semanticColors` /
`colorSchemes` / `typography.roles`. So two brands with utterly different palettes are applied by
the identical procedure.

## `<kit>/` layout

```
<kit>/
├── tokens.json     ← machine-readable law (parse FIRST)
├── BRAND.md        ← prose usage rules + do/don't (human companion)
├── fonts/          ← the brand TTFs (+ a README on variable→static instancing)
├── icons/ …        ← monochrome icon set (+ recoloured variants) and logos/
├── images/         ← logo lockups, visuals, the signature device asset
├── videos/         ← reference footage (optional)
└── do-dont/        ← rendered DO/DON'T target pairs (spacing/scale/logo/schemes/margins)
```

## `tokens.json` — sections

### Required core (the skill refuses to guess these; a kit missing them is incomplete)

| Section                          | Carries                                                                                                   | Used for                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `colorPrimitives`                | named ramps, each step with `hex` (+ `rgb`/`oklch`/`pantone`/`cmyk`)                                      | the source of every colour; variation moves along a ramp |
| `semanticColors.light` / `.dark` | role → colour map (`background`, `foreground`, `primary`, `accent`, `muted`, `border`, …)                 | the role → token map when no explicit scheme fits        |
| `typography.display` / `.body`   | family, role, weights, **`headlineWeight`**, font `files`, `fallback`                                     | which font each text role gets; the banned-weight rule   |
| `logo`                           | the exact wordmark files, `variantsByBackground`, `dotColor`, `aspect`, `clearSpace`, `minWidth`, `avoid` | placing the correct, untampered logo                     |
| `avoid`                          | a flat `string[]` of hard don'ts (the off-brand tells)                                                    | the non-negotiable conformance gate                      |

**`headlineWeight` may be a scalar or a rule.** Marketing brands have one heading weight (`headlineWeight: 500`). Size-responsive **product design systems** (Carbon, Material) vary heading weight by size — express that with an optional `typography.display.weightRule` (a per-size map or prose) and set `headlineWeight` to the dominant/large-display weight. The role-map rule is "never exceed the brand's weight **at that size**", not a single number.

**Two completeness levels.** A kit is **scaffold-complete** when every required-core _field_ is real (sourced, not guessed) — even if a `logo`/`device` binary is a flagged placeholder (a trademark-locked or not-yet-fetched asset recorded in `$meta.gaps`). It is **apply-complete** when those assets also exist and the fonts resolve. Ingestion (`reference/authoring.md`) targets scaffold-complete; apply needs apply-complete, and must handle a gaps-flagged missing/locked logo (skip it or use a flagged placeholder — never invent or redraw the mark).

**Drafted-but-unconfirmed `avoid`.** The `avoid` list is confirm-before-write (`reference/authoring.md`): until the user confirms it, **keep `avoid` absent** (preserve the flat-`string[]` shape for validators) and hold the draft in **`$meta.avoidDraft`** plus a `$meta.gaps` entry. On confirmation, move the lines into the flat `avoid` array.

### Optional richness (used when present; the skill degrades gracefully when absent)

| Section                                           | Carries                                                                                                                                | If absent                                                                                                                                             |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colorSchemes`                                    | `approved` `(name,background,text,accent)` triples + `denied` combos + `proportion` (e.g. 70/20/10)                                    | fall back to composing a scheme from `semanticColors` roles; skip the denied-combo check                                                              |
| ‑ (note)                                          | a **product design system** (Carbon, Material) ships _themes_ (light/dark), not marketing `(bg,text,accent)` triples with a proportion | map each theme to an approved scheme from its `semanticColors`; it legitimately has **no** `proportion`/`denied` — omit and flag, don't infer a ratio |
| `backgroundSelection`                             | the procedure for choosing a canvas background                                                                                         | default to the neutral scheme                                                                                                                         |
| `typography.roles` / `.pairing` / `.scale`        | per-role sizes, the headline↔lead ratio, the type scale                                                                                | keep source sizes; apply only family + weight                                                                                                         |
| `elements`                                        | `button`, `kicker`, `divider` specs                                                                                                    | leave those blocks styled by role colour only                                                                                                         |
| `shape` / `elevation`                             | corner radii, soft-shadow specs, hairline border                                                                                       | leave card treatment as-is                                                                                                                            |
| `device`                                          | the signature reusable graphic(s) + placement grammar                                                                                  | don't add a device                                                                                                                                    |
| `safeArea` / `layout` / `spacing` / `composition` | margins, per-aspect defaults, rhythm, scale-contrast rules                                                                             | rely on handbook §6.3/§6.4 defaults                                                                                                                   |
| `imagery`                                         | art-direction attributes + grade                                                                                                       | don't re-grade media                                                                                                                                  |
| `motion`                                          | signature easing, ratios                                                                                                               | video/animation only                                                                                                                                  |
| `voice`                                           | tone principles, headline formulas, avoid-words                                                                                        | **not applied by a restyle** — copy is preserved (that's a content pass, not a brand skin)                                                            |
| `sizeThresholds`                                  | drop-vs-shrink rules for small canvases                                                                                                | keep elements at source size                                                                                                                          |
| `$meta` / `doDontGallery`                         | provenance + pointers to `do-dont/`                                                                                                    | informational                                                                                                                                         |

## Reading a scheme the right way

`colorSchemes.approved[]` encodes colour as **fixed-role triples** — `(background, text, accent)`,
order load-bearing. The skill **picks one** approved scheme per piece; it never free-chooses a
triple and never uses a `denied` combination. `accent` is the single most-important moment (one per
piece), not a second structural colour. `proportion` (e.g. neutrals ~70% / text ~20% / accent ~10%)
is the conformance target — if a restyle reads "colourful", there is too much accent.

## Authoring a new brand into the shape

> To ingest an **external** source (a guidelines PDF, a website/URL, a Figma file, or a raw asset
> dump) into this shape, follow `reference/authoring.md` — it covers extraction per source form and
> the not-invent discipline. The checklist below is the field-fill order it targets.

1. Fill `colorPrimitives` with the brand's ramps (hex minimum; add oklch/pantone/cmyk if known).
2. Map `semanticColors` roles to ramp steps (light, and dark if the brand has a dark theme).
3. Set `typography.display` + `.body` with the real families, `headlineWeight`, and the TTF `files`.
4. List the exact `logo` files + `variantsByBackground` + the dot/clear-space/min-width rules.
5. Write the `avoid` list — the brand's specific off-brand tells (what a mis-generated piece does
   that this brand never does). This is the highest-leverage section; be concrete.
6. Add optional sections as the brand warrants (a signature `device`, `elements`, `colorSchemes`).
7. Drop the real assets in the subfolders; render a `do-dont/` pair for each recurring defect.
8. Validate: **scaffold-complete** = every required-core _field_ is real and `$meta.gaps` records
   every omission (a flagged placeholder asset is fine). **apply-complete** additionally needs the
   `logo`/`device` assets present and the fonts resolvable (`reference/asset-loading.md`).

Model every field on the shapes above.
