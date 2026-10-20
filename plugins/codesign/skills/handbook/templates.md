# Handbook — templates: text variables, placeholders, locking

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
