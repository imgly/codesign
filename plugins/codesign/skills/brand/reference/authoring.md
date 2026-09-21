# Authoring a kit — ingesting an external brand into the canonical shape

Reference for the `brand` skill. This is the **intake** step: when the kit the user pointed you at is
**not** already a canonical `<kit>/` folder — it's a brand guidelines PDF, a website /
URL, a Figma file, or a raw asset dump — **scaffold a canonical kit first**, then apply. The output
is a validated `<kit>/` (`tokens.json` + `BRAND.md` + real assets + optional `do-dont/`)
that the rest of the skill can read. The **target shape** and every field's meaning live in
`reference/brandkit-spec.md`; this file is **how you get there** from messy source material.

## When to scaffold vs apply directly

- the kit the user pointed you at is a `<kit>/` with a valid `tokens.json` (required-core complete)
  → apply directly (main workflow).
- the kit the user pointed you at is anything else (a `.pdf`, an `http(s)://` URL, a Figma file/URL,
  a folder/zip of assets, loose prose + screenshots), **or** a `<kit>/` whose `tokens.json` is missing
  or fails the required-core → **scaffold first** (below), announce the new folder, then apply.

## The two disciplines (read before extracting)

1. **Exact over inferred.** Prefer machine-exact sources: CSS custom properties / design-system
   tokens, Figma variables, a stated hex / Pantone / CMYK. Fall back to sampling a swatch or an
   image only when nothing exact exists, and **say so** (a sampled colour is provisional).
2. **Never invent — omit and flag.** Where the source is silent on an **optional** section (no dark
   theme, no print CMYK, no stated accent proportion, no signature device), **leave that section
   out** and record it under `$meta.gaps` (a list of "not specified by the source — needs
   confirmation"). Do not fabricate a value to fill the schema. The required-core must be real; an
   optional section absent-and-flagged is correct.

   **Hard-stop on the `avoid` list.** The `avoid` list is the highest-leverage and hardest-to-extract
   section (it's what a mis-generated piece does that this brand never does). Draft it from the
   source's explicit don'ts + the brand's own usage, then **stop and confirm the draft with the
   user** before finalizing the kit. Everything else is infer-and-flag; the `avoid` list is
   confirm-before-write. **Shape while unconfirmed:** keep the real `avoid` key **absent** (it must
   stay a flat `string[]` for validators — don't write a `{_status, draft}` object into it); hold the
   draft in **`$meta.avoidDraft`** (a `string[]`, each line tagged SOURCED vs INFERRED) plus a
   `$meta.gaps` entry "avoid list drafted, needs confirmation". On confirmation, move the lines into
   the flat `avoid` array.

## Extraction by source form

### A. Brand guidelines PDF (the classic brand book)

Read the pages (the `Read` tool renders PDF). Pull, in priority order:

- **Colour** — the palette page(s): named colours with **hex / Pantone / CMYK / RGB**. Build the
  ramps in `colorPrimitives`; map the "primary / text / background / accent" callouts to
  `semanticColors` roles. A colour shown only as an ink swatch with no value → sample + flag.
- **Type** — families, weights, and especially the **heading weight rule** (`headlineWeight`) and any
  "never use weight X for headings" ban. Roles/sizes if a type-scale page exists.
- **Logo** — the variants (mono / reversed / on-photo), **clear space**, **min size**, and the
  "logo don'ts" page → `logo.variantsByBackground` + `logo.avoid`.
- **The do/don't spreads** — the richest source for the `avoid` list and `colorSchemes.denied`.
- Voice / tone pages → `voice`.

### B. Website / URL (best when the site is a design system)

`WebFetch` the site (and its CSS if reachable). **Prefer the design system's published token
package / source repo over the rendered docs site** — the docs pages often truncate under fetch and
brand pages may 403, whereas the token source is exact and complete (e.g. Carbon's colours/themes/type
live in `@carbon/*/src` on GitHub, not the rendered `carbondesignsystem.com`). Pull:

- **Colour** — CSS custom properties (`--color-*`, often authored in **OKLCH** or hex) are exact.
  The IMG.LY reference kit was derived exactly this way (`custom-colors.css` → `colorPrimitives`,
  `starwind.css` `:root`/`.dark` → `semanticColors.light`/`.dark`).
- **Type** — `@font-face` / the fonts config → families + weights; the CSS heading rules →
  `headlineWeight` and the type scale.
- **Logo / assets** — the SVG wordmark(s) and favicons served by the site.
- **Voice** — real page copy → `voice.exemplars` + `voice.principles`; the site's own writing
  guidelines if published.
- Caveat: a site usually ships **Latin-subset WOFF2**, not a full TTF — see Fonts below.

### C. Figma file (via the Figma MCP)

Use the Figma MCP (load the `figma-use` skill first). `get_variable_defs` / `get_design_context`
return **exact** token values:

- Colour/number/string **variables** → `colorPrimitives` + `semanticColors` (Figma modes map to
  light/dark); text styles → `typography.roles`; effect styles → `elevation`; corner radii →
  `shape`. Components named "logo", "button", "badge/kicker" → `logo` / `elements`.
- Exact values, no sampling — the highest-fidelity source when available.

### D. Raw asset folder / zip + loose prose / screenshots (heaviest inference)

Inventory the folder (`ls`/`Read`): fonts (`.ttf`/`.otf`/`.woff2`), logo files, any `colors`/
`swatches`/`tokens` file, imagery. Parse any prose brand notes. Infer roles from filenames + how
assets are used; sample colours from screenshots only as a last resort. This form produces the most
`$meta.gaps` entries — flag generously and confirm.

## Mapping to `tokens.json`

Fill in this order (definitions: `reference/brandkit-spec.md`):

1. **Required-core first** — `colorPrimitives` (hex minimum), `semanticColors` role map,
   `typography.display`/`.body` + `headlineWeight`, `logo`, and the `avoid` list (drafted to
   `$meta.avoidDraft` until confirmed, per the hard-stop above). A required-core _field_ that can't be
   sourced means **stop** (say what's missing) — but a `logo`/`device` _asset_ that can't be fetched
   or is trademark-locked is **not** a blocker: record the real logo _rules_, put the missing asset in
   `$meta.gaps` with a placeholder path, and the kit is still **scaffold-complete** (see
   `brandkit-spec.md` → completeness levels). **`headlineWeight`** is a scalar for a fixed-weight
   brand, or `typography.display.weightRule` + a dominant `headlineWeight` for a size-responsive
   design system — don't lossily flatten a per-size rule into one number without recording the rule.
2. **Optional sections the source supports** — `colorSchemes` (approved triples + denied combos +
   proportion), `elements`, `shape`, `elevation`, `device`, `safeArea`/`layout`/`spacing`/
   `composition`, `imagery`, `motion`, `voice`, `sizeThresholds`. Omit any the source doesn't state
   (→ `$meta.gaps`). **Product design systems** (Carbon, Material) ship _themes_ (light/dark), not
   marketing `(bg,text,accent)` triples: map each theme to an approved scheme from its
   `semanticColors`, and accept that there is **no** `proportion` or `denied` list to find — omit and
   flag, never invent a ratio.
3. **`$meta`** — `name`, `source` (where it came from), `colorNote` (OKLCH-authoritative? sampled?),
   and `gaps` (the flagged omissions).

Then write **`BRAND.md`** as the prose companion (identity, per-section usage rules, do/don't), and
drop the real assets into the subfolders.

## Fonts — the subset trap

A brand's site/PDF often only exposes a **Latin-subset WOFF2** (or an outlined logo), not a full
TTF. `setFont` needs a complete static-or-variable TTF (`reference/asset-loading.md`). So:

- **Prefer the full font from the foundry / Google Fonts** (OFL families resolve to a CDN URI
  directly). Get the real family, not the site's subset.
- **Proprietary display faces** (a foundry-licensed brand font) may not be obtainable as a full TTF
  — bundle whatever the brand supplies, record it under `$meta.gaps` as "display font needs full-TTF
  provisioning", and flag that headlines may fall back until it's provided. Note the licensing (many
  brand fonts are internal-use-only — private-repo bundling, not redistribution).

## do-dont/ (optional)

If the source's don'ts are concrete, render the target DO/DON'T pairs (a small HTML → PNG, in the
brand's real fonts/colours) so future applies can pattern-match. If time-boxed, create the folder
with a `README` listing the intended pairs and leave rendering for later. Never block the kit on it.

## Validate, then apply

Run the new `<kit>/` through `reference/brandkit-spec.md`. **Scaffold-complete** (the
ingestion goal): every required-core _field_ is real, `$meta.gaps` records every omission (flagged
placeholder assets are fine), the `avoid` draft is in `$meta.avoidDraft` awaiting confirmation.
**Apply-complete** (needed before restyling): the `logo`/`device` assets exist and fonts resolve; a
gaps-flagged missing/locked logo means the apply step skips or placeholders it rather than inventing
one. Announce the kit and its gaps, get the `avoid` list confirmed, then continue into the main apply
workflow.
