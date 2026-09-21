# Arabic (RTL)

Family file for the `localize` skill: conventions, leading bands, and quotation marks for Arabic.
Every leading value here is a **visual** multiplier — apply the handbook §6.1.3 content-area
conversion (write `lineHeight: { visual }` — the facade converts) before setting
`text/lineHeight`.

## Conventions

- **MSA** (Modern Standard Arabic), not dialect; **Western numerals**.
- **Mirror the layout, not just the text.** Right-align running text; flow directional &
  decorative elements right-to-left (a leading decorative quote glyph → mirror `“`→`”`/`»`). A
  **centered, symmetric** composition is already mirror-invariant — it **stays centered**; only
  text direction and the ghost's side change (the snap routine mirrors a `ghostAnchor:'left'`
  ghost to the right, leaves a `'center'` ghost centered).
- **Never letter-space Arabic** — joined script; tracking severs the joins. `text/letterSpacing = 0`
  (handbook §6.1.6).
- Keep names/brands/URLs/numbers as-is (Latin runs stay LTR via bidi) **and in their source
  typeface** — declare the Arabic face (`text.font`) **only on Arabic-script blocks**; never re-font a
  Latin-only block (a name, wordmark, chips, dates) to the Arabic serif. Transliteration optional.
- **Mirror by anchoring to an edge, not by measured width.** `getFrameWidth` can **under-measure
  Auto-width Arabic** (joined-script shaping), so mirroring a block via `x = pageW − x −
getFrameWidth(id)` can push it off-page. Give a mirrored Arabic block an **Absolute width,
  right-aligned and anchored to a known right edge** — don't position it by measured width.
- **Mirror the reading order — not every block. Keep a do-not-mirror inventory.** Mirroring is a
  **selective** transform over a **classified** tree, not a blanket flip of every block's `x`.
  Flip: the column/reading order (what was leftmost becomes rightmost), running-text alignment, and
  **directional** decoration (a leading quote glyph, an arrow that points into the text). Do **not**
  mirror, ever: **icons, logos, brand/wordmarks, glyph-built marks, numerals and number strings,
  charts/graphs, photographs**, and any pictogram whose handedness carries meaning (a check, a
  play triangle). Mirroring these is the "icons broke / elements moved to the right / off-center in
  their frames" defect.
- **Mirror on the GROUP, not its parts.** A composed icon (mail = envelope body + flap + lines),
  a lockup (mark + wordmark), or a badge (field + label + icon) must move **as one unit** — mirror
  the group's position, and leave the group's _internal_ layout intact (or exempt the group
  entirely if it's in the do-not-mirror list). If the parts are loose siblings, a per-block flip
  disassembles them — **group first, then decide mirror-or-exempt for the whole group.** Content
  that sits _inside_ a frame (text/icon centered in a shape) is re-anchored with its frame, never
  flipped independently.

## Leading

Tall ascenders + deep descenders demand more vertical room than Latin — set explicitly:

- **Body 1.6–1.8**
- **Display / headline 1.3–1.5**

No all-caps concept applies (Arabic has no case).

## Quotation marks

| Locale | Primary quotes | Notes                          |
| ------ | -------------- | ------------------------------ |
| AR     | « »            | RTL; opening mark on the right |

Secondary: „ “.

## Fonts

Use a script face with full Arabic coverage **matched to the Latin face's character**
(`language-rules.md` §6), not just any Arabic font:

- **Editorial / high-contrast serif** Latin → **Amiri** (Naskh serif — verified).
- **Geometric / grotesque sans** Latin → **IBM Plex Sans Arabic / Cairo / Tajawal** (matched sans).
  Do **not** use Amiri here — a Naskh serif on a sans design is a mismatch.
- **Handwritten / script** accent → **Aref Ruqaa** (Ruqʿah calligraphy) or **Lalezar** (rounded
  playful display), never a flat sans.

Loading mechanics + jsDelivr paths + the variable-bold trap are in `font-loading.md`. A Latin face
silently falling back to a system sans is the classic failure — `preview` every Arabic edition.

## Cross-references

- `language-rules.md` — preserve-vs-localize, translation quality, layout integrity, the RTL rows
  of the pass checklist.
- handbook §6.1.5 — mirrored alignment; §6.1.6 — the no-tracking rule; §6.1.3 — the content-area
  conversion.
- `judge` — the `localization` axis scores mirroring, bidi, and tofu.
