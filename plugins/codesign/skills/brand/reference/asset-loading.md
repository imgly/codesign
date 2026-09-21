# Brand-asset loading (CoDesign / CE.SDK)

Reference for the `brand` skill. Read this before the restyle routine — every restyle needs a
fetchable font URI, a colour conversion, and (usually) the wordmark placed. Mechanics verified
against this server.

## 1. Fonts — resolve every brand font to a fetchable URI

`engine.block.setFont(id, uri, typeface)` takes **one `uri`** that must resolve to a **single,
complete, static-or-variable TTF**, over a **fetchable scheme only** (`https://` or `workspace://`
— `data:` and local `file:` paths are rejected when the scene is saved). The `typeface` is the
3-arg object `{ name, fonts:[{ uri, subFamily, weight, style }] }`; omitting it throws
`Cannot read properties of undefined (reading 'name')`.

Two sources, in order of preference:

**A. On a public CDN (OFL / Google-hosted families — Inter, Roboto, Montserrat, …):** use the
`https://` URI directly, exactly as `../localize/reference/font-loading.md` and the
handbook §6.7 table do (jsDelivr `https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/<dir>/<File>.ttf`,
or the handbook's pre-validated static URIs). No bridge needed. Most brands' **body** font resolves
this way (the IMG.LY kit's Inter does).

**B. Proprietary / not-on-a-CDN (e.g. GT Walsheim):** pass the bundled font file straight to
`asset_add` — it accepts `.ttf`, `.otf`, `.woff` and `.woff2` alongside images, and returns the
`workspace://` URI to use:

```js
// asset_add({ source: { path: '<kit>/fonts/<Font>.ttf' } })
//   -> { uri: 'workspace://assets/<sha>.ttf', kind: 'font', ... }
```

Then `setFont(id, uri, tf('<Brand Display Name>', uri))` — the returned `uri` goes in BOTH places:
`setFont`'s second argument and every `typeface.fonts[].uri`. `workspace://` is a sanctioned,
persistable scheme, so the saved `design.imgly` stays loadable (the bytes are in the store). Never
hand-copy files into the workspace store: `asset_add` content-addresses them for you, and a
hand-placed file with the wrong hash is unreachable. On a hosted CoDesign server (no disk access,
so no `{ path }` arm), host the proprietary font at an `https://` URL instead and use that.

### The variable-bold trap

A variable TTF renders **only its default instance** (usually Regular). You cannot get Bold from a
variable file. If a brand's `typography` role needs a specific weight the variable file can't give,
supply a **static** per-weight TTF (instance it with `fonttools varLib.instancer` — see the kit's
`fonts/README.md`). The IMG.LY kit ships **no Bold GT Walsheim on purpose** (`headlineWeight` = 500
Medium); honour that — never fake a heavier weight.

### setFont gotchas (script-agnostic)

- **Unique `typeface.name` per distinct face.** CE.SDK treats two typefaces with the same `name` as
  identical and skips the reload — a new URI under a reused name **silently no-ops** and the old
  font stays. Give the brand faces distinct names (`"GT Walsheim Pro Medium"`, `"Inter"`).
- **Reshape after any font/size/line-height change** — `setString(id,'text/text', <same text>)` —
  then **re-apply the captured runs**, because reshape wipes every per-character style range
  (colour, weight, style, case, decoration), not colour alone (§2). Capture with `getTextRuns`;
  `getTextColors(id)[0]` is run 0 only, and re-applying it whole-block is what flattens a
  two-colour headline.
- **Await before you measure or capture:** `await engine.block.forceLoadResources([page])`;
  `getFrameWidth(id) > 0` is the "loaded + shaped" signal (`getWidth` is 0 in Auto mode).
- **Always `preview`.** A missing-glyph tofu or a silent sans fallback only shows in the render.

## 2. Colour — hex → CE.SDK 0-1 RGBA

CE.SDK colours are **0-1 floats**, not 0-255 and not hex. Brand kits author hex, so bridge:

```js
const rgba = (hex, a = 1) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a
});
// '#471AFF' -> { r:0.278, g:0.102, b:1, a:1 }
```

Two writes:

- **Text:** `await engine.design.setProps(id, { text: { color: rgba('#2E2E2F') } })` (whole block) or
  `text: { ranges: [{ from, to, color }] }` for a character range (e.g. one accent word).
- **Shape / background fill (graphic block):**

  ```js
  await engine.design.setProps(graphicId, {
    fill: { type: 'color', color: { value: rgba('#FBFBFC') } }
  });
  ```

  Pages have no background-colour property; a "background" is a full-bleed `graphic` with a colour
  fill, appended back-most.

**Border at N% alpha** (kits express e.g. "border = ink @ 16%"): set the fill/stroke colour's `a`
to the fraction (`rgba('#2E2E2F', 0.16)`).

## 3. Logo — place the wordmark SVG

`asset_add` **accepts SVG** (and png/webp/jpg/gif). Bring the exact bundled variant in, then set it as
an image fill on a graphic block sized to the logo's aspect (IMG.LY wordmark = 142×30 ≈ 4.7:1):

```js
// asset_add returns { uri:'workspace://assets/<sha>.svg', ... } — embed uri, never httpUrl
const logo = await engine.design.create(
  {
    type: 'graphic',
    props: {
      width: 220,
      height: 46.5,
      shape: 'rect',
      contentFill: { mode: 'Contain' }, // keep aspect; never stretch a logo
      fill: { type: 'image', uri: LOGO_URI } // create awaits the load
    }
  },
  { parent: page }
);
```

**Pick the variant by the chosen background** (`logo.variantsByBackground`): the ink/dark-letter
variant on light, the white variant on a light photo, the all-white/`-mono` variant on a brand-colour
or dark fill (a variant whose dot is baked to the brand colour disappears on a matching fill). Use
the **exact bundled SVG** — never recolour, redraw, or recreate the wordmark or its dot; to suit a
different background pick a different file.

## 4. Icons — recolour the monochrome set

Brand icons usually ship as monochrome SVG with a single fixed ink hex (the IMG.LY set is
`#2E2E2F`). To put one on brand, one find-and-replace of the ink hex → the target colour recolours
the whole glyph, then `asset_add` the recoloured SVG and place it (§3):

```bash
sed 's/#2E2E2F/#471AFF/g' <kit>/icons/<Icon>.svg > /tmp/<Icon>-brand.svg
```

Watch the kit's exceptions: two-tone marks keep an intentional white knockout (recolour the ink,
leave the white); full-colour logo icons must **not** be flattened. Keep icons monochrome, one ink
per context, on the 24px grid — never gradients/shadows, and don't mix in a third-party icon set.

## 5. Kicker pill (eyebrow → pill badge)

A brand's `elements.kicker` is usually a pill badge, not a bare label. Build it on the **eyebrow text
block itself** via its text background — no separate shape needed:

```js
const rgba = (hex, a = 1) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a
});
// pill must HUG the glyphs → Auto width/height, else the background spans
// the block's old fixed width (a full-width bar, not a pill).
await engine.design.setProps(kickerId, {
  widthMode: 'Auto',
  heightMode: 'Auto',
  backgroundColor: {
    enabled: true,
    color: rgba('#FFFFFF', 0.12), // subtle fill or an outline
    cornerRadius: 999, // full pill
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8
  }
});
```

Text stays normal-case, ~`text-xs`, in the kit's kicker text colour (ink / muted / brand — never an
accent-as-structure colour). For an outline pill, use a transparent fill + the stroke properties;
keep the fill subtle so it reads as a badge, not a button.

## 6. Block opacity ≠ colour alpha

A "faint" or ghost element (an oversized decorative quote, a watermark) is usually **block opacity**,
not a low colour-alpha. `getTextColors`/`getColor` on it can report a fully-opaque colour while it
still renders faint. Capture `(await engine.design.getProps(id, ['opacity'])).opacity` alongside the colour, and re-apply it
(`setOpacity`) after recolouring, or the ghost comes back at full strength and competes with the
headline.

## 7. Order of operations (avoids the common failures)

1. Resolve fonts (CDN URI or workspace bridge) and `asset_add` the logo/icon SVGs **before** the edit.
2. In the edit: recolour fills → `setFont` → **reshape** → **re-apply text colour** → position →
   `await forceLoadResources([page])`.
3. `preview` — verify the real face rendered (not a fallback), colour survived the reshape, contrast
   holds, the logo dot reads, and no tofu.
