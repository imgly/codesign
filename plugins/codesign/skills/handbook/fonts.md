# Handbook §6.7 — Font discovery & pairing (CoDesign)

#### Discovering fonts — `ly.img.gfonts`

All Google Font families (~2,000, self-hosted on the IMG.LY CDN) are registered as the `ly.img.gfonts` asset source. Never hardcode font URLs and never fetch font CSS or manifests yourself — look the typeface up **inside `edit` code** and pass it straight into a `text.font` declaration:

```js
const FAMILY = 'Playfair Display';
const { assets } = await engine.asset.findAssets('ly.img.gfonts', {
  query: FAMILY,
  page: 0,
  perPage: 20
});
const tf = assets
  .map((a) => a?.payload?.typeface)
  .find((t) => t?.name === FAMILY);
if (!tf)
  throw new Error(
    `font lookup missed: no exact match for "${FAMILY}" among ` +
      assets.map((a) => a?.payload?.typeface?.name).join(', ')
  );
await engine.design.setProps(title, {
  text: {
    string: s,
    font: { typeface: tf }, // declares the typeface (applied first); the file
    weight: 'normal' //         is picked from THIS weight — see below
  }
});
```

- **Select the exact name out of a PAGE of results — never take `assets[0]`.** `query` is fuzzy and ranks by its own score, not by exactness: `query: 'Lora'` returns `Explora`, `Grandiflora One`, `Lora` **in that order**, so `perPage: 1` fetches Explora and the family you asked for is unreachable. Fetching ~20 and picking by `name` is the only reliable lookup. Report the candidates in the throw so the failure teaches.
- **Always pass a `weight` after declaring a font** (via `text: { font: { family, weight } }` in `create`, or `text`'s `weight` in `setProps`). `tf.fonts[0]` is the family's **lightest declared weight**, not its regular one — for Inter and Roboto that is Thin (`wght=100`). See "Weights & italics" below.
- One lookup per family per edit; reuse `tf` for every block using that family.
- Barrier rules are unchanged: batch your font declarations, then `await engine.design.loadResources([page])` before measuring or capturing (`engine.design.create` runs the barrier itself).
- `asset_search({ sourceId: 'ly.img.gfonts', query })` shows what exists — each hit carries `typeface: { name, weights, styles }`. Use it to check availability or browse; apply via the edit-code lookup above.

#### Weights & italics

Most families are variable fonts: `tf.fonts[]` declares one entry per weight step (several pointing at the same file) and the engine interpolates when you select one:

```js
await engine.design.setProps(title, {
  text: {
    string: s,
    font: { typeface: tf }, // declare the full typeface
    weight: 'bold' // the bold cut is picked for you — never fonts[0]
  }
});
```

**`tf.fonts[]` is ordered lightest-first, so a typeface declared without a `weight` renders the family's LIGHTEST weight.** This is the single most common way to ship a broken design, because nothing announces it: no error, no warning, no tofu — just body copy in a hairline weight that reads as a deliberate aesthetic until someone tries to read it.

- Inter and Roboto declare 9 weights each: `fonts[0]` is `thin` (`wght=100`).
- Playfair Display declares no weight below 400, so its `fonts[0]` is `normal` — which is why a recipe demonstrated on Playfair looks fine and the same recipe silently fails on Inter.
- **Set the weight explicitly on every text block**, including body copy: `setProps(id, { text: { weight: 'normal' } })`. Only treat a weight as available if it is present in `tf.fonts[]` (the `weights` list in `asset_search`).

Selecting a weight on a hand-built single-entry typeface changes nothing — declare every weight you plan to use.

#### Local / brand fonts

A font that exists as a file on the user's machine (brand kit, purchased face) must be **imported first**: `asset_add({ source: { path } })` returns a `workspace://` URI — use that as `text.font`'s `uri` and in `typeface.fonts[].uri`. Never reference a local path or `file://` URI in a scene: the server renders it fine (previews look green), but the design breaks on every other machine. This is enforced — an `edit` whose scene references a `file://` URI fails to commit and lists the offending URIs. Google families never need this — they come from `ly.img.gfonts`.

#### Context → pairing

| Context             | Style                         | Pairing                                        |
| ------------------- | ----------------------------- | ---------------------------------------------- |
| Wedding invitation  | Elegant serif + script accent | Playfair Display + Great Vibes + Source Sans 3 |
| Restaurant menu     | Serif heading + sans body     | Cormorant Garamond + Inter                     |
| Tech / startup      | Clean modern sans             | Inter (single family, weight variation)        |
| News / editorial    | Traditional, authoritative    | EB Garamond + Source Sans 3                    |
| Luxury brand        | High-contrast serif           | Cormorant Garamond + Montserrat                |
| Children's brand    | Rounded, playful              | Caveat + Open Sans                             |
| E-commerce          | Readable, trustworthy         | Montserrat + Open Sans                         |
| Portfolio / agency  | Bold, creative                | Playfair Display + Inter                       |
| Academic / research | Classic, formal               | EB Garamond + Source Sans 3                    |

Every family above resolves via the `ly.img.gfonts` lookup. For contexts not listed: apply the contrast principle (serif heading + sans body, or a single family with weight variation). Never use more than 3 families.
