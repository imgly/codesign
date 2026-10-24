# Handbook — templates: variables, bindings, placeholders, locking

A template is a design someone else fills in: the copy that changes is a
**text variable**, the photo that changes is a **placeholder**, and
everything else is **locked** so the person filling it in cannot break the
layout. All three are saved with the design and honoured by the browser
editor that opens it.

## Text variables

A variable is a `{{key}}` token inside a text block's string. The engine
replaces it with the variable's value at render time; the token stays in
the text, so the next value replaces it again.

```js
const title = await engine.design.create(
  {
    type: 'text',
    name: 'title',
    props: { text: { string: '{{title}}', fontSize: '96px' } }
  },
  { parent: page }
);
await engine.design.create(
  {
    type: 'text',
    name: 'when',
    props: { text: { string: '{{date}} · {{time}}', fontSize: '36px' } } // several tokens, plain text around them
  },
  { parent: page }
);

// Variables are scene-wide: they live on the scene block.
const [scene] = await engine.design.findByType('scene');
await engine.design.setProps(scene, {
  variables: { title: 'Sunrise Flow', date: 'Sat 14 June', time: '6:30 am' }
});
```

- **Sample values are part of the deliverable.** A token with no value
  renders literally as `{{title}}`; set every variable before you
  `preview` or export, and size each text block for its longest plausible
  value (Auto height, a width the layout can take).
- `variables` is a patch: a write creates or updates the keys it names and
  leaves the others; `{ key: null }` deletes one.
  `getProps(scene, ['variables'])` reads every key and value.
- A block is bound when its `text.string` holds a `{{key}}` token — check
  every slot is bound, and every token it holds has a value.
- Keys are plain identifiers (`title`, `eventDate`); the token is exactly
  `{{key}}`, no spaces. Styling (font, size, colour, ranges) applies to the
  rendered value as to any text.

## Typed variables and bindings: themes in one write

A colour, number, image or font can be a variable too. A block leaf
**bound** to it follows it: one write to the variable changes every bound
leaf in the design — a brand swap, a hero image per campaign, a heading
face per script.

```js
const [scene] = await engine.design.findByType('scene');
await engine.design.setProps(scene, {
  variables: {
    brand: { color: { r: 0.9, g: 0.1, b: 0.2, a: 1 } },
    heading: { font: { family: 'Inter' } }, // the family; each text keeps its weight
    hero: { image: uri },
    headSize: { number: 72 }, // engine units, see below
    city: 'Berlin' // a string stays a text variable: {{city}} in text
  }
});
await engine.design.setProps(cta, { bindings: { 'fill.color': 'brand', 'stroke.color': 'brand' } });
await engine.design.setProps(title, {
  bindings: { 'text.color': 'brand', 'text.font': 'heading', 'text.fontSize': 'headSize' }
});
await engine.design.setProps(photo, { bindings: { 'fill.image': 'hero' } });

// Re-theme: one write, every bound leaf follows.
await engine.design.setProps(scene, { variables: { brand: { color: OTHER } } });
```

- **Pairs.** colour → colour leaves (`fill.color` on a colour fill,
  `text.color`, `stroke.color`, `dropShadow.color`, …); number → number
  leaves (`width`, `opacity`, `text.fontSize`, …); image → `fill.image`,
  `fill.video`; font → `text.font`, `caption.font`. A text variable is not
  bound: it is a `{{key}}` token. A wrong pair is refused with
  `DESIGN.VARIABLE_TYPE`, which lists the leaves that variable type binds
  to on that block.
- **A number is engine-native.** Bound to a length it is in the scene's
  design unit; bound to `text.fontSize` it is in `scene.fontSizeUnit`
  (points unless the scene says `'Pixel'`: 72 pt is 300 px at 300 dpi).
  A value a bound leaf refuses (an opacity of 5) is refused, and the
  variable keeps its old value.
- **A bound leaf refuses direct writes** (`DESIGN.PROPERTY_BOUND`, nothing
  applied) — on a text, a bound `text.color` or `text.fontSize` also locks
  the ranges' `color`/`size`. Change the variable, or unbind first:
  `bindings: { 'text.color': null }` (the leaf keeps its value). Writing the
  value it already has is a no-op, so `getProps` output still writes back.
- `getProps(id, ['bindings'])` lists a block's bound leaves; a block without
  any reads no `bindings` key. `getProps(scene, ['variables'])` reads every
  variable in its own shape (a font as `{ font: { typeface } }`).
- `{ name: { rename: 'newName' } }` renames a variable: its `{{tokens}}` and
  bindings follow. `{ name: null }` deletes it and unbinds its leaves (they
  keep their last value). A variable keeps its type: to change it, delete
  it first, then write the new value in a second `setProps`.
- A fill spec of another `type` replaces the fill, and the fill's bindings
  go with it; rebind after.

## Placeholders

A placeholder is a block the person filling in the template replaces —
an image slot (`fill/change`) or a text slot (`text/edit`). Two switches,
on different blocks:

```js
const hero = await engine.design.create(
  {
    type: 'graphic',
    name: 'hero',
    props: {
      shape: { type: 'rect' },
      fill: { type: 'image', image: { imageFileURI: sampleUri } }, // a sample photo, replaced later
      width: 1080,
      height: 760,
      placeholder: { enabled: true }, // the BLOCK is a slot
      placeholderControls: { showOverlay: true, showButton: true } // the editor's "replace" overlay + button
    }
  },
  { parent: page }
);
// Graphic: the replace behaviour lives on the FILL — no type: a patch of the attached fill.
await engine.design.setProps(hero, {
  fill: { placeholderBehavior: { enabled: true } }
});

// Text: behaviour and slot are both on the block.
await engine.design.setProps(title, {
  placeholder: { enabled: true },
  placeholderBehavior: { enabled: true }
});
```

- **Graphic → fill, text → block.** `placeholderBehavior` is a text (and
  caption) prop; a graphic's lives on its fill:
  `getProps(hero, ['fill.placeholderBehavior'])` reads it back.
- **A slot needs its scope.** An image placeholder works only while its
  `fill/change` scope is enabled, a text placeholder while `text/edit` is
  (next section); disabling the scope disables the placeholder. Useful
  companions: `fill/changeType`, `layer/crop` (image), `text/character`
  (text formatting).
- **Fill the slot with a real sample** so the preview shows the intended
  crop and contrast; the placeholder is what makes it replaceable.
- `getProps(scene, { children: true, props: ['placeholder'] })` reads the
  whole tree; the nodes with `placeholder.enabled` are the slots — check
  they are exactly the ones the brief asks for.

## Locking: scopes

What a person may change is decided per **scope**, on each block:
`await engine.design.setScopes(id, { 'layer/move': false, … })`, read with
`await engine.design.getScopes(id)`. Block scopes are **saved with the
design** — they are the lock.

The editor that opens the design adds its own editor-wide scopes, which are
not saved. This session allows everything, so a lock changes nothing you
can see here; an editor opened for someone filling in a template defers to
the blocks, and there your block scopes decide.

The scopes (the keys `getScopes(id)` answers):

| group      | scopes                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text       | `text/edit` (content) · `text/character` (font, size, colour)                                                                                              |
| fill/shape | `fill/change` · `fill/changeType` · `stroke/change` · `shape/change`                                                                                       |
| layer      | `layer/move` · `layer/resize` · `layer/rotate` · `layer/flip` · `layer/crop` · `layer/opacity` · `layer/blendMode` · `layer/visibility` · `layer/clipping` |
| appearance | `appearance/adjustments` · `appearance/filter` · `appearance/effect` · `appearance/blur` · `appearance/shadow` · `appearance/animation`                    |
| lifecycle  | `lifecycle/destroy` · `lifecycle/duplicate`                                                                                                                |
| editor     | `editor/add` · `editor/select`                                                                                                                             |

### Recipe: lock the layout, open the slots

```js
const ALL = Object.keys(await engine.design.getScopes(page));
const lockAll = Object.fromEntries(ALL.map((s) => [s, false]));

// 1. The page and every block under it: nothing editable.
const lockTree = async (id) => {
  await engine.design.setScopes(id, lockAll);
  for (const child of await engine.design.getChildren(id))
    await lockTree(child);
};
await lockTree(page);

// 2. Open exactly the slots. editor/select first: an unselectable block cannot be edited at all.
for (const name of ['title', 'when', 'where'])
  for (const id of await engine.design.findByName(name))
    await engine.design.setScopes(id, {
      'editor/select': true,
      'text/edit': true
    });
for (const id of await engine.design.findByName('hero'))
  await engine.design.setScopes(id, {
    'editor/select': true,
    'fill/change': true,
    'layer/crop': true
  });
```

- **`editor/select` gates everything.** A slot without it cannot be
  clicked, so it cannot be edited; a locked block without it cannot even be
  selected (watermarks, logos, legal lines).
- **Variables are values, not slots.** A text block whose string is
  `{{title}}` is filled by setting the variable; give it `text/edit` only if
  the person may also retype it directly.
- Check the lock before saving: `(await engine.design.getScopes(id))[scope]`
  for each slot and each locked block.

## Delivering a template

1. Bind every changing line to a variable and set sample values.
2. Make each replaceable image a placeholder with a sample fill.
3. Lock everything; open only the slots (`editor/select` + their scope).
4. Judge the filled-in design like any other.
5. Save it — `export({ format: 'imgly' })` carries variables, placeholders
and block scopes — and export the preview format the brief asks for.
