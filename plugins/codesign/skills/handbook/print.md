# Handbook — print: CMYK, spot colours, bleed, PDF/X

A design for a printer: page at trim size, bleed, colours the press can
reproduce (CMYK, spot inks), and a PDF the print shop accepts.

**Only for a print job.** Use this page when the brief names a printer, bleed,
CMYK, spot inks or PDF/X. A PDF for reading, sharing or a template sample is
not one: keep the page at the asked size with `marginEnabled: false` and export
plain `pdf`, so the file is exactly that size.

**An image of a bled page includes the bleed.** A page with bleed carries it
into every export, a PNG included, and into a whole-page `preview`; a zoomed
`preview` (one block, or a `region`) shows the trim area. For a trim-size
PNG/JPEG next to the print PDF, set `page: { marginEnabled: false }`, export
the image, then turn the bleed back on before saving. Sizes and the
safe margin per format are in the `formats` skill; the type rules for print
are in `design-rules.md` §6.1.10.

## Set up the page

```js
const [scene] = await engine.design.findByType('scene');
await engine.design.setProps(scene, { scene: { dpi: 300 } }); // raster effects and flattening resolve at this dpi
const page = await engine.design.create(
  {
    type: 'page',
    name: 'flyer',
    props: {
      width: '148mm', // the TRIM size, never trim + bleed
      height: '210mm',
      page: {
        marginEnabled: true, // the bleed: lies OUTSIDE the page
        margin: { top: '3mm', right: '3mm', bottom: '3mm', left: '3mm' }
      }
    }
  },
  { parent: scene }
);
```

- **Bleed = `page.margin` with `page.marginEnabled: true`.** 3 mm unless the
  printer states another value. Anything that touches a trim edge runs to the
  bleed's outer edge: a full background sits at `position: { x: '-3mm', y:
'-3mm' }` and is 6 mm wider and taller than the page. A page's own fill
  already covers the bleed.
- **Safety inset** — the inward band text must stay out of — is
  `page.safetyEnabled: true` + `page.safetyInset: { top, right, bottom, left }`
  (each defaults to 0). Authoring state only: nothing it draws is exported.
- **Exclusion area** (an envelope window, a spine, a glue flap): a block of
  type `exclusionArea` appended to the page, with shape and transform like a
  graphic. It is left out of every export; `exclusionArea: { punchOut: true }`
  cuts it out of the export instead (a transparent hole, which a press reads as
  no ink).
- **Units.** Lengths take unit strings (`'148mm'`, `'3mm'`, `'0.125in'`) and
  font sizes take `'pt'` (`text: { fontSize: '10pt' }`); `getProps` answers in
  the scene's design unit. `scene.designUnit` (`'Millimeter'`) only changes
  how bare numbers read; unit strings are safer.
- **Multi-page print** (a folded leaflet, a booklet): one `page` per side, all
  the same size, each with the same bleed. Pages render in order; each becomes
  one page of the PDF.

## CMYK colours

Every `Color` slot (fill, `text.color`, stroke, drop shadow, gradient stops,
`backgroundColor`) takes one of three shapes:

```js
const rgb  = { r: 0.1, g: 0.1, b: 0.1, a: 1 };            // sRGB, 0–1
const cmyk = { c: 0, m: 0.95, y: 0.85, k: 0, tint: 1 };   // CMYK, 0–1; tint scales the whole colour
const spot = { name: 'PANTONE 186 C', tint: 1, externalReference: '' }; // a named ink, below

await engine.design.setProps(bg, { fill: { type: 'color', color: { value: cmyk } } });
await engine.design.setProps(headline, { text: { color: { c: 0, m: 0, y: 0, k: 1, tint: 1 } } });
await engine.design.setProps(rule, { stroke: { enabled: true, width: '0.5mm', color: cmyk } });
```

- **Write print colours as CMYK from the start.** A CMYK value is kept as is
  in the PDF; an RGB value is converted by the export's profile, and a press
  reads a converted grey or black as four inks.
- **Body text black = `{ c: 0, m: 0, y: 0, k: 1, tint: 1 }`** (100 % K), never
  RGB black, which converts to a rich four-colour black that misregisters on
  small type.
- **Tint** is a 0–1 multiplier on the whole colour (`tint: 0.5` = 50 %
  screen): lighter variants without a second colour definition.
- **An RGB brand colour:** use the CMYK values the brand book gives; when it
  gives none, ask for them. An RGB value left in is converted by the export's
  profile, and a `pdfx` export warns about it (below).
- `fill.overprint` / `stroke.overprint` (boolean) print a fill or stroke
  over the inks below instead of knocking them out — only when the printer
  asks for it (small black type, a varnish or die-line layer).

## Spot colours

A spot colour is a named, premixed ink (`PANTONE 186 C`, a brand ink, a white
underprint, a die line). It prints as its own separation; the RGB and CMYK
values you give it are only how it previews.

```js
// Define it once on the scene: the name is the ink; both approximations are previews.
const [scene] = await engine.design.findByType('scene');
await engine.design.setProps(scene, {
  spotColors: {
    'PANTONE 186 C': { rgb: { r: 0.784, g: 0.063, b: 0.18 }, cmyk: { c: 0, m: 1, y: 0.81, k: 0.04 } }
  }
});

const pms186 = { name: 'PANTONE 186 C', tint: 1, externalReference: '' };
await engine.design.setProps(logoMark, { fill: { type: 'color', color: { value: pms186 } } });
await engine.design.setProps(accentWord, { text: { color: pms186 } });
await engine.design.setProps(underline, {
  stroke: { enabled: true, width: '1mm', color: { ...pms186, tint: 0.4 } } // a 40 % screen of the same ink
});
```

- **Define before use.** A `SpotColor` whose name has no definition renders
  **magenta** — the engine's fallback, also what you get after removing a
  definition (`spotColors: { [name]: null }`) still in use. A magenta
  block in a `preview` means a misspelt or missing spot name.
- **The name is the contract with the printer.** Spell it exactly as the
  swatch book does (`PANTONE 186 C`, with spaces); the PDF's separation carries
  that name.
- **Both approximations.** `rgb` drives the screen preview; `cmyk` the CMYK
  preview and any CMYK fallback. Set both with the swatch's published values.
- Read back: `getProps(scene, ['spotColors'])` answers every ink in the same
  shape. Writing a name again updates every block using it.
- **Die lines and cutouts:** `spotColors: { DieLine: { rgb, cmyk, cutout: 'Solid' } }`
  (or `'Dashed'`) names the ink a `cutout` block prints with.
- A spot colour works in every `Color` slot, gradients included, and keeps
  its separation through both `pdf` and `pdfx` exports.

## Masks and mattes in PDF and SVG

`masks: [{ shape, mode?, feather?, expansion?, inverted?, opacity?, keyframes? }]`
cuts a block (graphic, text, group) to shapes, combined in order; each mask's
shape fills the block, so a `vector_path` sized to the block places one
inside it. `feather` and `expansion` take lengths (`'12px'`). `[]` removes
them. `matte: { source, mode? }` shows the block only where its `source` (a
name or uuid on the same page) draws, and the source stops drawing on its
own; `null` unlinks.

Measured on CE.SDK 1.85: what stays vector when the design leaves as a file.

| on the block                          | PDF                                      | SVG                                  |
| ------------------------------------- | ---------------------------------------- | ------------------------------------ |
| `masks` with hard edges (any `mode`, `inverted`) | vector clip                    | vector clip path                     |
| a mask with `feather`                 | rasterised soft mask                     | feather dropped: hard edge           |
| a mask with `opacity` below 1         | vector soft mask                         | opacity dropped: full strength       |
| `matte`, mode `Alpha`                 | vector soft mask                         | ignored: the block exports whole     |
| `matte`, mode `Luma`                  | rasterised soft mask                     | ignored: the block exports whole     |

So for a print or vector deliverable, cut with hard-edged `masks`; keep
feathers and luma mattes for screen, video and PNG. An SVG must not rely on
a matte at all.

## Cutouts and gradient strokes

A die-cut look (notches, punched holes, a ticket stub) is one `compound`
shape, and a gradient outline is `stroke: { fill }`
(`shapes.md`). Both export as vector paths in PDF and SVG,
with no raster mask, so the cut stays sharp at any print size.

## Export for print

- **`export({ format: 'pdf' })`** writes DeviceCMYK: CMYK values stay CMYK,
  spot colours stay separations, and a page with bleed is trim + bleed with
  the trim marked (TrimBox / BleedBox). No PDF/X markers and no output intent.
- **`export({ format: 'pdfx' })`** is what a print shop asks for when it says
  "print-ready" or "PDF/X": the same PDF converted to a PDF/X standard with an
  embedded ICC output profile. Its optional `pdfx` object:

  | key                                           | values                                                                                     |
  | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
  | `outputStandard`                              | `'PDF/X-4'` (default, keeps live transparency) · `'PDF/X-3'` · `'PDF/X-1a'` (always flattens) |
  | `outputProfile`                               | `'fogra39'` (default, Europe) · `'gracol'` (US) · `'srgb'` (never compliant) · `'custom'`  |
  | `profileUri`                                  | the printer's `.icc` for `'custom'`                                                        |
  | `flattenTransparency` / `flattenResolution`   | flatten live transparency; dpi of flattened areas (default 300)                            |
  | `embedICCProfile`                             | default `true`; PDF/X needs it                                                             |
  | `title`, `outputCondition`, `outputConditionIdentifier` | OutputIntent metadata                                                            |

  Use the printer's standard and profile when the brief names them; else
  PDF/X-4 + `fogra39` (Europe) or `gracol` (US).
- **Read the result's `warnings`.** A `pdfx` export reports every rule the
  file breaks, each with its fix (e.g. an RGB colour under a CMYK profile).
  Fix and re-export before calling the file print-ready.
- **Verify what you deliver.** `preview` cannot show separations; the export
  result and its warnings are the evidence. Name the standard, profile,
  bleed and spot inks in your reply.

## Checklist

- [ ] Page = trim size; bleed set on the page; edge-touching art runs into it
- [ ] Text and logos inside the safe margin (~8 % or the printer's figure)
- [ ] Every colour CMYK or a defined spot colour; body text 100 % K
- [ ] Spot names spelt as the swatch book; no magenta in the preview
- [ ] Type ≥ print minimums (design-rules §6.1.2); `scene.dpi` 300
- [ ] Masks hard-edged (no `feather`, no luma `matte`) where the PDF must stay vector
- [ ] `pdfx` export with the printer's standard/profile; no warnings left
