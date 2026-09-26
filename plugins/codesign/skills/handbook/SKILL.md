---
name: handbook
description: |
  The CoDesign design loop, tool contract, workspace cheatsheet, typeface
  schema, common operations cheatsheet, and the full design-quality rubric.
  **Read this skill before any edit call** — it contains the 5-step Loop
  (decide parent → read API → exec → preview → judge), the tool roster and
  cross-tool rules, the workspace revision model (list / history / rename),
  rewind-recovery procedure, the typeface shape text.font declarations need,
  and §6: the design-rules index — the full enforceable rubric (typography,
  hierarchy, composition, craft) ships as this skill's design-rules.md, the
  runtime-quirk reference as its quirks.md, and the input-resolution contract
  every skill follows as its intake.md, all read on demand.

  Triggered for any task using this server's `edit` or `preview` tools.
---

## 1. Loop

You MUST follow these steps in order for ANY canvas change:

1. **Decide where you're editing from — based on what the user asked for, not what's in the workspace.** Either:
   - **New design requested** (the default in a fresh conversation) → pass `parent: null` and supply a `title` (the design name). The workspace persists across all past conversations — designs in it are not yours to continue unless the user points at them. For a new design, run the `create` skill's intake first to assemble the brief — and when two or more of the five design-defining parameters (topic, audience, visual direction, brand, format) are neither stated nor safely inferable, that intake **asks** before this edit rather than defaulting them.
   - **Continuing this conversation's design** → use the `revision` id from your last `edit` response as `parent`.
   - **User explicitly asked to resume earlier work** ("keep working on yesterday's flyer") → call `list` to see designs newest-first, then `history({ revision })` on the design they meant; pass the leaf as `parent`. Never do this unprompted.

2. **Read the API docs** for every engine method you plan to use. `../api/SKILL.md` for signatures, `../guide/SKILL.md` for prose and recipes. NEVER guess parameters. **Read ALL remaining references in ONE message**, in parallel: the `api` and `judge` skills and `design-rules.md` (+ `quirks.md`/`fonts.md` if needed, the `models` skill before any `asset_generate`).
3. **Register the brief's acceptance checklist** (first edit only). Extract the machine-checkable claims from the brief and record them: `checklist({ revision, items })` — `{ kind: 'output', path }` for every file the brief orders delivered, `{ kind: 'copy', text }` for every string of approved copy that must land verbatim (translations, offers, legal lines), `{ kind: 'note', text }` for constraints only you can check. Every `export` verifies the list and reports unmet items — treat one like a failing test. Skip this step only when the brief fixes no outputs or copy.
4. **Run `edit({ parent, code, note? })`** — execute the JS body. The response's first text part is JSON `{ revision, parent }` — save `revision`; it's your `parent` for the next edit.
5. **Visually verify.** A mutating `edit`'s result already shows the changed page — read that render. Call `preview({ blockIds, revision })` only for full-size judging or multi-page looks; never re-preview a rendered revision. Never tell the user something "looks good" without seeing it yourself.

6. **Judge & remediate before reporting done.** When the design is a candidate for "done", run the `judge` loop: score the 8 axes against your actual `preview` renders, dry-run the §6.1.11 + §6.5.2 checklists (design-rules.md), remediate any applicable axis below 8 via further `edit`s, re-preview, re-judge. On pass, record `scorecard({ revision, verdict: 'pass' })`; later content `edit`s re-arm this step. Never report an unjudged design as done.

Steps 1, 2, 5, and 6 are NOT optional. Step 4's `note` is encouraged: a one-liner describing what you accomplished, so you can re-ground later.

**Resolve your inputs before step 3, whichever skill you are in.** Derive what the request already answers, ask **once** for what is genuinely missing, echo what you resolved, never invent a value that belongs to the user — a brand colour, a licensed font, a locale's wording. Ask through your environment's own question UI when it has one; a design's visual direction and brand are never silently defaulted on a first build. The contract is this skill's `intake.md` (`intake.md`); `create`, `brand`, `resize` and `localize` each carry the parameter table it applies to. `judge` alone asks nothing — it is the gate on every build.

### Speak the user's language

**Reply in whatever language the user writes to you in.** From their first message, and in everything they read: prose, questions, option labels and subtext, the resolved-input echo, preview remarks, error explanations, the close. Switch if they switch. Not a translation step at the end — the language you work in.

**Two languages, not one.** The language you _speak_ and the language the design _contains_ are different axes, and conflating them is the failure mode here:

- **Conversation language** — always mirrors the user. No exceptions.
- **Design copy** — follows the brief. When the user has stated or implied a language for the content, that wins outright: someone writing to you in German may well want an English poster, and an English speaker may ask for an Arabic edition. Only when nothing implies otherwise does design copy **default** to the conversation's language — and when it does, say so in the echo ("Textsprache: Deutsch"), so a wrong guess costs one word to correct.
- Changing an existing design's content language is never a side effect of the conversation — that is the `localize` skill, on request.

**Never translate these**, in any language, because they are values rather than copy: skill and tool names (`judge`, `asset_generate`); typed argument values; format ids and sizes (`ig-story`, `A4`, `1080×1350`); colour values; URLs, handles and channel names (`#showcase`); and revision ids. Translate a chip's **label**, never its **value** — a translated value breaks the call it feeds.

**These documents stay English.** Every skill, handbook section and reference file is agent-facing instruction, not user-facing copy. Read them in English; speak to the user in theirs. The copy grammar in `../create/choice-copy.md` — system-POV headers, verb-led titles, no pronouns in titles, lists parallel within themselves — applies in whatever language you are writing.

### Re-grounding after a rewind / restart

If your conversation was rewound (double-ESC in Claude Code), or your process restarted mid-conversation, your in-memory "current revision" is wrong. The engine's state is the truth, but the server can't tell you've been rewound. Recovery:

1. Call `list` — see the workspace's designs and their `latestLeaf` revisions.
2. Call `history({ revision: latestLeaf })` — read the notes to find where the user wanted to be.
3. Pass that revision id as `parent` on your next `edit`. The server reloads the engine to that scene before running your code — your edits land on top of the right state.

Re-grounding recovers the design this conversation was already working on. It is not for starting a new conversation — a fresh session with a new request starts at `parent: null`.

Editing on top of an OLDER revision (not the latest leaf) is fine: it creates a **non-destructive fork**. The previous leaves stay in storage; you can switch back any time by passing one of their ids as `parent`.

## 2. Tools

Each tool's full contract lives on the tool itself — its description in tools/list is authoritative and always in front of you. This section is only the roster plus the rules that span tools.

- `edit({ parent, code, title?, note? })` — THE mutating tool: runs async JS (`engine` in scope, plus `engine.design` — the preferred facade: awaited `create` for a block or subtree, `setProps`/`getProps`, `measure`, `align`/`distribute`; full contract in the api skill) and commits a revision. The response's first text part is JSON `{ revision, parent }` — save `revision`; it is your `parent` for the next edit.
- `preview({ blockIds, revision })` — render blocks to inline PNGs; omit `blockIds` for every page (max 10).
- `export({ format, revision, blockId?, outPath? })` — write a deliverable (`pdf`/`png`/`jpeg`/`webp`/`svg`/`pdfx`/`html`, or `imgly` to stay editable); omit `blockId` for the whole document; returns `{ uri, httpUrl, bytes, format, revision }` (+ `path` with `outPath`). `uri` is the durable handle; `httpUrl` is process-scoped — never persist it. Pass `outPath` (absolute) when your environment cannot fetch localhost URLs. Full contract on the tool itself.
- `export` also accepts `format: "mp4"` — renders the block's authored timeline (recipe: `video.md`); needs the native engine (the default).
- `import({ source, title? })` — ingest a design FILE as a NEW root (was `load`): native `.imgly` (also legacy `.scene` / `.zip`), foreign Photoshop `.psd` / InDesign `.idml` / PowerPoint `.pptx` / PDF (translated in; `warnings` are your touch-up list — preview, then repair with `edit`), or a plain image/SVG (one page sized to it). Continue with `edit({ parent: revision })`.
- `asset_add({ source: { path } })` — bring a local file (image or font) into the workspace for use in a design (was `import`); embed the returned `workspace://` uri in `edit` code — never a fetch/file URL, and never the original local path or a `file://` URI (renders server-side but breaks portability).
- `asset_search({ sourceId?, query?, page?, perPage? })` — discover and search the engine's asset sources; apply results inside `edit` (the exact patterns are in the tool's description). The `ly.img.workspace.images` source also lists images the human uploaded — searchable by their original filename, newest first.
- `list()` / `history({ revision })` / `changes({ revision })` / `inspect({ revision })` / `rename({ revision, title })` — the workspace tools; usage in §3.
- `view({ revision, pin? })` — human-facing viewer URL. Print it once; the viewer keeps it live.

Cross-tool rules:

- **Revision ids are durable, block ids are not.** Everything flows through revisions: `edit` produces one, `preview`/`export` consume one, `history`/`inspect` walk them. Block ids are session-scoped — re-discover blocks in the current engine; never persist or replay literal block ids (see `inspect`'s description).
- **The single mutating tool is `edit`.** `asset_add`, `asset_search`, and `view` never change the scene; placement and application always happen inside `edit` code. (`import` is the exception: it creates a new root to `edit` from.)

## 3. Workspace cheatsheet

The workspace is your durable memory: every revision you commit via `edit` is there, addressable by id, walkable via `history`. It survives a process restart and a Claude rewind.

```
list()                            → [{ rootRevision, title, latestLeaf, updatedAt, headOrigin?, headNote? }, …]
history({ revision: leaf })       → [{ revision, parent, note?, origin?, createdAt }, …]   (root first)
changes({ revision })             → { head, state, design, since?, wouldOrphanEditorWork, guidance }   (what landed AFTER it)
inspect({ revision })             → { revision, parent, note?, origin?, createdAt, title?, code? }
edit({ parent: leaf, code })      → linear edit, no engine reload
edit({ parent: olderRev, code })  → fork; engine reloads to olderRev first
edit({ parent: null, title })     → new design
rename({ revision: any, title })  → updates the root title
```

A revision id is a 12-hex-char string. You never construct it; the server hands it back from `edit`. Treat it as opaque.


### Human edits from the browser editor

The `view` URL is a full editor. When the human clicks **Save**,
their edits land as a normal child revision with `origin: "editor"`, no code,
and a note that starts `Edited in the browser editor. Engine-computed diff vs
parent:` followed by block-level changes.

- **Finding their revision**: `changes({ revision })`, passing the revision you
  hold — normally the one your last `edit` returned. It tells you whether that
  revision is still the design head, lists what was written since it (oldest
  first, each with its `note` and `origin`), and names the revision to build
  on. Do NOT use `history` for this: it walks _ancestors_, so called with your
  own last revision it will never show their newer save — and previewing your
  own last revision renders the pre-edit scene, which looks exactly like
  "nothing changed". In a fresh conversation you hold no revision to pass;
  there `list` is the signal — it reports `headOrigin: "editor"` and the
  `headNote` for a design whose newest revision came from the editor.
- **Call `changes` before your first `edit`** of a design the user may have had
  open in the browser. `edit` REFUSES a parent whose path to the head contains
  one of their editor saves — building from it would orphan their work on a
  sibling branch — and the refusal names the revision to pass instead. Pass
  `fork: true` only when the user explicitly asked you to discard their own
  browser changes and branch from the older revision.
- **That note is authoritative.** It is computed by the engine, not
  free-typed. Do NOT re-derive it with preview loops or read-only `edit`
  dumps — that burns your edit budget and mints junk revisions.
- **Continue from the human revision**: `edit(parent=<their revision>)`. Their
  changes are already in that scene.
- A `Note: this design has newer revision(s)…` line on an `edit`/`preview`/
  `inspect`/`export` result means someone committed after the revision you
  passed. When that someone is you (your own earlier branch), the note is
  advisory and the fork is legal; the human's saves come back as the refusal
  above instead. Unless you are deliberately rewinding, rerun with the newer
  revision.

## 4. Engine recipes

**Dialect rule (enforced): mutations go through `engine.design`** —
`create`/`setProps`/`group`/`appendChild`, plus `measure` and
`getProps` (incl. `['text.ranges']`). `edit` REJECTS code that mutates via
`engine.block.*` (the error lists the equivalents); for a call the facade
genuinely lacks, keep it with a `// engine.block: <reason>` comment. Print
scenes: `await engine.design.setProps(scene, { scene: { designUnit: 'Millimeter', dpi: 300 } })` once.

### Build ONE complete page per `edit`

The unit of work is the **page**: each `edit` emits one complete page — one `engine.design.create` with every block, font and size (it awaits resource loads itself), then positioning. Do **not** split one page's build across calls. Each tool call costs 20–200s of streaming wall time; one ~10000-char call beats three ~3000-char ones.

For a **single-page design** that means the entire scene in one `edit` — scene, page, all blocks:

```js
// 1. Structure + every block of the page — ONE awaited create call
const scene = engine.scene.create('VerticalStack');
const stack = (await engine.design.findByType('stack'))[0];
const page = await engine.design.create(
  {
    type: 'page',
    props: { width: 720, height: 1008 },
    children: [
      {
        type: 'text',
        name: 'title',
        props: {
          text: {
            // A FAMILY name makes create do the Google-Fonts lookup and pick
            // that weight's file — no findAssets/fonts[0] hairline trap.
            font: { family: 'Playfair Display', weight: 'bold' },
            string: 'Alex & Jordan',
            fontSize: '48px'
          },
          widthMode: 'Auto',
          heightMode: 'Auto'
        }
      }
      // ... every other block — all of it in props: ranges via
      // text: { string, ranges: [{ from, to, color }] } (reshape-safe),
      // solid panels via fill: { type: 'color', color: { value } }
    ]
  },
  { parent: stack }
);
// create() awaited the subtree's font/image loads — measurements are live.

// 2. Position with measured frame dims
const [title] = await engine.design.findByName('title');
const { width: w } = await engine.design.measure(title);
await engine.design.setProps(title, {
  position: { x: (720 - w) / 2, y: 250 }
});
// ... position everything ...

return { type: 'text', text: `page=${page} ready` };
```

The edit result already carries a render of the changed page — that IS your capture. **One `edit` per page; `preview` only for full-size judging or multi-page review. Then STOP.**

**Name every block you may touch again — that is how you find it.** `create` returns only the root id; `create` writes each `name` onto its block and `findByName` resolves it here and in every later edit — re-grounding in one line instead of walking the tree matching strings (which breaks on an NBSP, a line break, or shared copy):

```js
const [headline] = await engine.design.findByName('headline'); // [] when nothing matches
await engine.design.setProps(headline, { text: { fontSize: '52px' } });
```

`findText(copy)` / `findAllText(copy)` are in scope too — they fold NBSP/space variants, which a hand-rolled `===` does not.

**Unnamed blocks: address by uuid** — every id member also takes a block's `uuid` string, valid across edits and revisions. `getProps(root, { children: true, props: [...] })` reads the subtree as a uuid-keyed node tree; filter it in JS, and `setProps(root, { children: [{ uuid, props }...] })` patches by identity (absent props untouched).

### Multi-page designs: page by page, page 1 first

Never emit a multi-page design (carousel, slide deck, brochure) in one giant `edit`. Build it **page by page**, one `edit` per page:

1. **Page 1 is the design-language gate.** The first `edit` builds the scene and page 1 only — it establishes fonts, palette, margins, grid. Check its render before touching page 2: a wrong aesthetic choice caught here costs one page, not N.
2. **Pages 2..N each get their own `edit`.** Each call builds one complete page reusing the design language page 1 proved out. Check each page's render right after building it — the bugs on later pages are content-dependent (a headline that overflows, an image that crops badly), so batching pages just delays discovery. Feed findings forward: if body text at 28px overflowed on page 3, use 26px from page 4 on.
3. **Batching is allowed only for near-identical clones** — templated pages differing by a short label or image swap. Even then, a thrown error mid-call loses every page in the batch; when in doubt, one page per call. Multi-block `preview` follows the same rule: batch renders are for review and final capture, never the build.

The objective-bug bar below applies per page: fix an overflow on page 3 with a targeted `edit` to page 3, then re-capture page 3 only.

**Editing an existing multi-page design:** a mechanical change applied uniformly (swap a font everywhere, recolor a brand accent) is one `edit` looping over `engine.scene.getPages()` — that's one logical change, not a batch. Substantial per-page rework (rewriting layouts, restructuring content) goes page by page like a build, with a `preview` per reworked page.

After the capture, fire a 2nd `edit` ONLY if the rendered PNG shows a specific, OBJECTIVE bug (text overflowing the page bounds, blocks visibly overlapping, missing characters, blank glyphs). Aesthetic refinement does NOT warrant another exec — sub-pixel nudges, compositional balance, vertical centering, whitespace distribution ("top-heavy", "feels off-center") are all DISALLOWED, even when the imbalance is large or intentional. If in doubt, STOP — a needless 3rd or 4th call far outweighs any aesthetic gain. A read-only `edit` (returns data, mutates nothing — `getTextFontSizes` etc.) still counts against the limit and forces a follow-up capture. Only fire a read-only exec if you'd otherwise be guessing at a number you can't read off the captured PNG.

**Scope of these stop-rules: the build phase, before a `judge` pass.** They cap self-initiated polish between build and capture, not Loop step 5. Once the `judge` skill has scored the design, remediating a failed axis (including composition or whitespace) is required work, not aesthetic refinement: apply the scorecard's fixes via `edit`, then re-preview and re-judge. The boundary is the scorecard — without one, only objective bugs warrant another `edit`; with one, its fixes do.

### Font sizes are PIXELS, not points

CE.SDK's font size APIs default to **points**, and its scene unit to **Inch** — but this server calls `setDesignUnit('Pixel')` inside `engine.scene.create(...)`, so every scene you create is in pixels. Re-set it only if you bare-call the engine outside `scene.create`. A unit-less font size is still read as points and converted at the scene's 300 dpi, so it lands **~4.2× too large**: `setTextFontSize(block, 32)` measures back as **133 px**, not 32.

With `engine.design` the unit is **required** — `text: { fontSize: '32px' }` (or `'24pt'` for print, same for a range's `size`); a bare number is rejected before anything is applied, because it would silently land as points. Reads answer in **pixels** whatever you wrote (`'32px'`), so a read writes straight back. When you drop to the raw APIs instead, **ALWAYS pass `{ unit: 'Pixel' }`** when reading or writing font sizes:

```js
await engine.design.setProps(block, { text: { fontSize: '32px' } }); // ✓ unit travels with the value
engine.block.getTextFontSizes(block, { unit: 'Pixel' }); // returns px ✓
```

**NEVER:**

```js
engine.block.setFloat(block, 'text/fontSize', 32); // ✗ rejected by the gate — and unit-less means points → 133 px
```

Line-height: write `text: { lineHeight: { visual: n } }` — the CSS multiplier you mean; the facade converts per font (a bare number is the raw engine scale and renders looser; read back: `text.lineHeightVisual`). `setProps(id, { text: { lineHeight } })` then reshapes automatically and preserves style ranges. Full rule and code: §6.1.3 in this skill's design-rules.md.

### Text sizing — Auto + read frame dims

For text blocks, the canonical CE.SDK pattern is **Auto width/height + `getFrameWidth` / `getFrameHeight`** for measured dims. The engine shapes the text and exposes the actual frame extent through these reads — use them for centering, stacking, and overflow checks. Manual `setWidth`/`setHeight` on text is fragile: too small and the engine silently drops the render (no glyphs drawn, no error); too large and your alignment math is off.

```js
const text = await engine.design.create(
  {
    type: 'text',
    props: {
      text: { string: 'Alex & Jordan', fontSize: '64px' },
      widthMode: 'Auto',
      heightMode: 'Auto'
    }
  },
  { parent: page }
);
// font: text: { font: { family, weight } } — create looks the family up;
// setProps takes a resolved text.font: { typeface, uri }.

// IMPORTANT: width/height props read 0 in Auto mode. Measure the frame instead.
const { width: w, height: h } = await engine.design.measure(text);
await engine.design.setProps(text, { position: { x: (pageW - w) / 2, y } });
```

Use absolute `setWidth`/`setHeight` only when you specifically want to constrain a wrap box (e.g. multi-line body copy with a fixed column width). Even then, set `setProps(id, { widthMode: 'Absolute' })` and pick height ≥ `fontSize × 1.6` for body sans, `≥ 1.8` for display serifs (Playfair, Cormorant) and scripts (Great Vibes, Caveat) — ascenders/descenders need the headroom or the engine drops the render.

### Font-load barrier: `loadResources`

```js
await engine.design.loadResources([page]); // recurses into children
// now await engine.design.measure() returns real values for every text block
// (engine.design.create runs this barrier itself before returning)
```

`loadResources(blocks)` returns `Promise<void>` that resolves once all fonts/images/fills bound to those blocks (and descendants) have finished loading. Pass `[page]` to await everything on the page. **No `setTimeout`, no polling.**

This barrier is for **your own measuring** inside `edit` code — positioning by measured frame width needs the fonts loaded first. Capturing is covered server-side: `preview`, `export`, and the commit at the end of every `edit` all force-load the scene's resources before rendering or serializing, so you never need a separate wait-for-fonts edit.

`getFrameWidth(id) > 0` after the await is your "font loaded + shaped successfully" signal. **Never** use `getWidth(id) === 0` as a font-load probe — it returns 0 by design in Auto mode regardless of font state.

### Video: any design can become a video

Scenes are not "static" or "video" at creation time — add time-based content
to the scene you already have, then `export({ format: "mp4" })` renders the
authored timeline. Do NOT rebuild a scene with `scene.createVideo()` just to
animate it (`createVideo` and `scene.setMode('Video')` exist as conveniences;
you rarely need either).

The recipe — page duration, tracks and offsets, video fills and trims, audio,
`export`/`preview` for timelines — is `video.md`; read it
before any timeline work.

### Common operations cheatsheet

The `engine.*` calls used in nearly every `edit`. Verify exact signatures + types in the `api` skill before using anything not listed here.

```js
// Scene + page basics — hierarchy is scene → stack → page (NOT scene → page).
// engine.scene.create("VerticalStack") makes the scene AND a stack container.
// Pages attach to the stack, never directly to the scene root.
// The "VerticalStack" argument is REQUIRED — without it, no stack is created
// and findByType("stack") returns []. (Use "HorizontalStack" for side-by-side.)
const scene = engine.scene.create('VerticalStack');
const stack = (await engine.design.findByType('stack'))[0];
const page = await engine.design.create(
  { type: 'page', props: { width: 1080, height: 1920 } },
  { parent: stack }
); // ← stack, not scene
// The stack arrives with the editor's page gap already set (48 screen-space
// px, matching the CE.SDK editor — the raw engine default of 0 is never what
// you want). Override only for a deliberate look, e.g. an edge-to-edge collage:
// await engine.design.setProps(stack, { stack: { spacing: 0 } });
const pages = engine.scene.getPages(); // DesignBlockId[]
const current = engine.scene.getCurrentPage(); // DesignBlockId | null

// Position & size — nested props, one call for many
await engine.design.setProps(id, { position: { x, y }, width: w, height: h });
// Layout: align(ids, { horizontal: 'Center', vertical: 'Top' }),
// distribute(ids, 'vertical'), bringToFront/sendToBack, scale;
// crop is a props subtree: setProps(id, { crop: { … } }).
const { width, position } = await engine.design.getProps(id, [
  'width',
  'position'
]);

// Page dimensions (for proportional calculations)
const { width: pageW, height: pageH } = await engine.design.getProps(page, [
  'width',
  'height'
]);

// Fills + shapes (graphic blocks)
// NOT for a text-only chip/pill/badge/button/tag — those are a text block with a
// native text background, never a rect behind floating text (see the chip recipe
// below, §6.5.1). Reach for a rect only for real graphics, or a chip whose content
// is NOT just text (icon + text, an image, multiple elements).
// "rect" | "line" | "ellipse" | "polygon" | "star" | "vector_path".
// Anything with a diagonal, a curve or a hole is a vector_path — see the
// custom-shapes recipe below. Do NOT approximate one out of stacked rects.
const panel = await engine.design.create(
  {
    type: 'graphic',
    props: {
      width: 200,
      height: 120,
      position: { x, y },
      shape: 'rect', // or a { type: 'vector_path', … } spec — recipe below
      fill: { type: 'color', color: { value: { r, g, b, a } } }
      // image: fill: { type: 'image', uri: 'workspace://assets/<sha>.png' } — create awaits the load
    }
  },
  { parent: page }
);

// Text — ONE call: content + whole-block color + case + style ranges.
// (leaves apply font -> string -> styling -> ranges regardless of key order;
// a string-only write auto-preserves existing ranges.)
await engine.design.setProps(text, {
  text: {
    string: 'Hello',
    color: { r, g, b, a }, // whole text
    case: 'Uppercase', // property, never typed capitals (§6.1.6)
    ranges: [{ from: 0, to: 5, color: ACCENT, weight: 'bold' }]
  }
});
await engine.design.setProps(text, { text: { fontSize: '32px' } }); // '24pt' for print
engine.block.getTextFontSizes(text, { unit: 'Pixel' }); // read-only diagnostic

// Rich text — STYLE RANGES inside ONE block. Every setter below takes an optional
// (from, to) character range; omit it to style the whole string. An accent word, a
// bold lead-in, an inline price, a struck-through old price: all are RANGES on one
// text block, never a second block placed beside the first. Two blocks look identical
// in a render and are caught by reading the scene graph — they also re-break on every
// copy/font/locale change, because nothing binds them to each other. (§6.1.9)
await engine.design.setProps(text, {
  text: {
    string: s,
    ranges: [
      { from, to, weight: 'bold' }, // 'thin'…'heavy' (9 steps)
      { from, to, style: 'italic' },
      { from, to, typeface: tf }, // a second face inline
      { from, to, size: '48px' },
      { from, to, decoration: { lines: ['Underline'] } } // per-range decoration
    ]
  }
});
await engine.design.setProps(text, {
  text: { decoration: { lines: ['Underline'] } }
}); // whole block
// Decoration is configurable, not just on/off:
//   lines: 'Underline' | 'Strikethrough' | 'Overline' (combinable)
//   style: 'Solid' | 'Double' | 'Dotted' | 'Dashed' | 'Wavy'
//   underlineColor / underlineThickness / underlineOffset / skipInk (keep skipInk on
//   so descenders stay legible).

// ALL-CAPS: set the PROPERTY, don't type capitals into the string. The case prop re-cases
// on render, so the string stays real words — translatable, searchable, and correct in
// scripts that have no case at all. Typed capitals are frozen English. (§6.1.6)
await engine.design.setProps(text, { text: { string: s, case: 'Uppercase' } }); // 'Normal'|'Uppercase'|'Lowercase'|'Titlecase'

// Read styling back — one entry per styled run ({ from, to, color?, weight?,
// style?, size?, case? }). setProps handles the wipe-and-replay dance for you:
// string writes and lineHeight writes auto-preserve these ranges. (§6.1.9)
const {
  text: { ranges: runs }
} = await engine.design.getProps(text, ['text.ranges']);

// PARAGRAPH-level — these take a paragraphIndex (negative = all paragraphs), NOT a
// character range. Multi-paragraph copy is ONE block with paragraph spacing, never N
// blocks stacked by hand and never blank lines used as spacing. (§6.1.8)
// ⚠ paragraphSpacing is an EM MULTIPLE of the font size, NOT pixels. 0.4–0.8 is the
// usable band; a pixel-looking value like 12 means twelve em and silently pushes the
// page metres long with no error (measured: 9 on 17px copy → ~150px gaps).
await engine.design.setProps(text, { text: { paragraphSpacing: 0.6 } }); // EM between paragraphs
// Per-paragraph overrides stay raw:
engine.block.setTextHorizontalAlignment(text, 'Center', 0); // engine.block: per-paragraph override
engine.block.setTextLineHeight(text, 1.2, 0); // engine.block: per-paragraph leading
// Read alignment back with paragraphIndex -1 for the BLOCK-level value; a per-paragraph
// read returns undefined when no paragraph override is set, which looks like "unset".
engine.block.getTextHorizontalAlignment(text, -1);

// Text alignment + spacing — plain props
await engine.design.setProps(text, {
  text: {
    horizontalAlignment: 'Center', // "Left" | "Center" | "Right"
    verticalAlignment: 'Center', // "Top"  | "Center" | "Bottom"
    letterSpacing: 0.05, // ratio of em
    lineHeight: 1.2 // ratio of font size — auto-reshapes, ranges preserved
  }
});

// Chips (pill / eyebrow / badge / tag / button) — a NATIVE text background on the
// text block itself. Use this instead of a rectangle behind floating text: the field
// is bound to the label, so it reflows on any copy/font/locale change instead of
// drifting off-center. A backing rect is correct ONLY when the chip's content is not
// just text. This is a build rule, not a preference — a rect+text chip renders
// identically and is caught by reading the scene graph, not by eye. (§6.5.1)
await engine.design.setProps(text, {
  backgroundColor: {
    enabled: true,
    color: { r, g, b, a },
    cornerRadius: h / 2, // pill = half the padded height
    paddingLeft: 16, // horizontal ~1.5–2.5× vertical
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8
  }
});
// Align the chip by its padded FIELD edge, not its glyph run (§6.5.1). The padding
// expands the field OUTWARD from the text frame, and getFrameHeight reports the UNPADDED
// height — so to land the field edge on the margin, and to get a true capsule:
//   setPositionX(chip, MARGIN + paddingLeft)                     // not MARGIN
//   cornerRadius = (getFrameHeight(chip) + padTop + padBottom)/2 // not frameHeight/2

// Lists — native bullets/numbers WITH a real hanging indent (wraps align to text,
// not the marker). ONE text block holds the WHOLE list, one paragraph per item. All three hand-built fakes are wrong
// and all three render almost identically, so they are caught in the scene graph:
//   1. typing "• " into the string        -> no hanging indent
//   2. a lone "•" text block per item     -> marker drifts off its text on any change
//   3. one text block per list item       -> no list at all, N loose ungrouped blocks
// (§6.1.8)
await engine.design.setProps(text, { text: { listStyle: 'Unordered' } }); // 'None'|'Unordered'|'Ordered', whole block
// per paragraph (index + only what changes) — never a raw setTextListStyle loop:
await engine.design.setProps(text, {
  text: { paragraphs: [{ index: 2, listStyle: 'Ordered', listLevel: 1 }] }
});
// engine.editor.setSettingFloat('listIndentPerLevel', 1.5); // indent width per level, EM

// Text on a path — circular/curved type ("EST. 2026" around a seal, a badge arc).
// ONE text block on a path is the only correct curved type — never one
// rotated block per letter (no baseline, uneven tracking). (§6.5.4)
// Badge rings are a PATH SPEC — measure, path, offset and frame handled;
// the block's frame becomes D×D, position it by bbox like any block:
await engine.design.setProps(t, {
  text: { path: { shape: 'circle', diameter: D } } // align: 'bottom' = underside
});
// (also valid inline in a create() spec's text props)
// For a CUSTOM arc (not a full ring), the raw contract: the engine FITS the
// path bbox to the block frame (authored size is NOT kept) — set the path,
// THEN an absolute frame; pathOffset is a 0..1 fraction of path length from
// the path's own 'M'; pathFlipped mirrors underside AND reverses direction;
// measure the flat glyph-run width with Auto modes BEFORE computing offsets.
// One subpath only (a single 'M'), parseable SVG — else BLOCK.TEXT_ON_PATH_* throws.

// Font declarations REQUIRE a real typeface object (the engine reads
// typeface.name — a bare uri throws). For Google families DON'T build it by
// hand — look it up from ly.img.gfonts (design-rules.md §6.7). Hand-built
// typefaces are for brand fonts imported to workspace:// URIs:
const uri = 'workspace://assets/abc123def456.ttf';
const typeface = {
  name: 'Acme Grotesk',
  fonts: [{ uri, subFamily: 'Regular', weight: 'normal', style: 'normal' }]
};
await engine.design.setProps(text, {
  text: { font: { typeface, uri }, weight: 'normal' } // uri overrides the weight-derived pick
});

// Await all resource loads (fonts, images, fills) for blocks + descendants.
// Use after a batch of font declarations, before measuring or capturing.
await engine.design.loadResources([page]);
```

### Custom shapes — `vector_path`, not a pile of rects

**Any mark with a diagonal, a curve or a hole is one `vector_path` block.** The
primitives cannot express those, so approximating a mark out of rects and
ellipses produces stepped edges where a slope should be, and costs one block per
step: a windowed facade drawn that way came to 79 blocks and still rendered as a
staircase. The same mark as a path is one block with clean geometry.

```js
const graphic = await engine.design.create(
  {
    type: 'graphic',
    props: {
      // width/height in the shape spec are the PATH'S COORDINATE FRAME, not
      // the on-canvas size. Author in a fixed box (100x100 is convenient) and
      // scale with the block's own width/height — one definition, any scale.
      shape: {
        type: 'vector_path',
        vector_path: { path: d, width: 100, height: 100, fillRule: 'NonZero' }
      },
      fill: { type: 'color', color: { value: INK } },
      width: 420, // on-canvas size, independent of the frame
      height: 460
    }
  },
  { parent: page }
);
```

#### Fill rule: `NonZero` + deliberate winding

The shape spec's `fillRule` takes
**`'EvenOdd'` | `'NonZero'`**. For a mark built from several subpaths this is the
whole game:

- **solid parts wound one way** (say clockwise) — they **union** where they overlap
- **holes wound the opposite way** — they **punch through**

**The default is `EvenOdd`, and it is the wrong one for a composite mark — set
`NonZero` explicitly.** `EvenOdd` XORs, so any two solid parts that cross — a
cross-brace over a leg, a spoke over a hub — knock a hole at the intersection,
and no amount of correcting the winding will fix it. Keep `EvenOdd` only for
shapes whose subpaths strictly nest and never overlap.

```js
await engine.design.setProps(g, {
  shape: { type: 'vector_path', vector_path: { fillRule: 'NonZero' } }
});
```

Winding is a property of point order, so enforce it in code rather than by
hand-writing paths in the right direction. Screen coordinates are **y-down**, so
the usual shoelace sign is inverted:

```js
// +y is DOWN, so a negative shoelace sum means clockwise.
const isClockwise = (pts) =>
  pts.reduce((a, [x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    return a + x1 * y2 - x2 * y1;
  }, 0) < 0;

const orient = (pts, cw) =>
  isClockwise(pts) === cw ? pts : [...pts].reverse();

const poly = (pts, cw = true) =>
  'M ' +
  orient(pts, cw)
    .map(([x, y]) => `${x},${y}`)
    .join(' L ') +
  ' Z';

const d = [poly(body), poly(window, false)].join(' '); // solid + hole
```

Two traps worth knowing before you lose an hour to either:

- **A hand-reversed Bézier subpath can silently fail to punch.** Rectangular
  holes work while an arched one built by writing the curve backwards renders
  solid, with no error. Sample curved holes into a polygon and let one
  orientation helper own the winding for every subpath.
- **Prefer four cubic Béziers to an SVG arc** for circles and rounded caps —
  it sidesteps `A` command largeArc/sweep flag handling entirely. Control points
  sit at `k = 0.5522847498 * r`.

#### Holes are real holes

A `vector_path` hole shows whatever is behind the block — page ground, another
graphic, a photograph. That is usually what you want on a flat ground and
usually **not** what you want over a photograph, where it reads as a hard-edged
cut-out rather than a printed mark. Over imagery, emit the solid subpaths only
and drop the holes. Faking a hole with a ground-coloured shape on top is a bug
waiting to happen: it only matches a flat, known ground, and it visibly fails
over a photograph.

### Z-order via child order (no z-index property)

CE.SDK has no z-index. Render order = child order. Later children paint on top of earlier siblings.

```js
await engine.design.appendChild(parent, child); // child becomes LAST = top-most
await engine.design.create(spec, { parent, index: 0 }); // index 0 = back-most
await engine.design.getChildren(parent); // current children, back-to-front
```

**Build pages back-to-front.** Suggested canonical layer stack for a designed page:

1. page background fill — a `fill` spec set on the page block (an attribute, not a child; sits below any children)
2. full-bleed photo / image (first child, index 0)
3. scrim / vignette / gradient overlay
4. structural rules — grid hairlines, dividers, frames
5. accent shapes — pills, badges, accent bars, icons
6. body text
7. headline / display text
8. foreground decoration (corner brackets, stickers)

Append in this order. If you create text before its background pill, the pill will cover the text. Deviate from the canonical order when intent demands — it is a default, not a rule.

**Fix without rebuilding** — to demote an existing sibling underneath another, use `insertChild` with a measured index:

```js
// text block already exists at top of stack; demote a sibling pill behind it
const children = await engine.design.getChildren(page);
const textIdx = children.indexOf(textId); // textId must be a direct child of page (else -1)
await engine.design.insertChild(page, pillId, textIdx); // pillId now sits just behind textId
```

Stack-layout pages (`VerticalStack` / `HorizontalStack`): the stack arranges pages along an axis; the same child-order rule applies WITHIN each page's children.

**Never destroy + recreate to fix ordering.** Use `insertChild`.

### Group blocks & hierarchy — structure every page as a tree

A finished page is a **tree, not a flat list of siblings**. Cluster every set that reads as one unit — inline in `create` (`{ type: 'group', name, children }`) or `await engine.design.group(ids)` after positioning — and **nest groups into parent groups** where the clusters nest. This is not optional polish: the group hierarchy is how z-order, moving, and later `resize` operate on semantic units instead of loose blocks, it encodes the reading structure the `judge` skill scores (§6.3), and it survives an `.imgly` round-trip.

Contract (verify signatures in the `api` skill):

- `await engine.design.isGroupable(ids)` — `false` if any id is a scene block or is **already** inside a group. Always guard with it.
- `await engine.design.group(ids)` — returns the new group's id. The blocks must be **siblings** (same parent). Call it **after** positioning: the group's bounding box is derived from its children's placed frames.
- `group()` inserts the group at the **minimum child index** among its members, so building back-to-front (per the layer stack above) means grouping does **not** disturb z-order.
- Recover with `await engine.design.ungroup(id)`.

```js
const group = (ids) =>
  await engine.design.isGroupable(ids) ? await engine.design.group(ids) : null;

// 1) group each leaf cluster after it is built + positioned
const gHeader = group([topRule, kickerL, kickerR]);
const gHero = group([title1, title2, tagline]);
const gDetail = group([divider1, divider2, ...detailCells]);

// 2) group the groups → a nested super-cluster (group-of-groups)
const gMasthead = group([gHeader, gHero]);
```

Guardrails: group only **direct siblings**; never group across pages; a block already in a group makes `isGroupable` return `false` (ungroup first if you must re-cluster); measure text frames (`engine.design.loadResources` → `engine.design.measure`) and position **before** grouping. Close the build by returning the group manifest in the edit `note` (e.g. `groups: masthead=… detail=… lineup=…`) so the hierarchy is legible when you re-ground.

## 5. Quirks

CE.SDK errors are short and opaque, and several runtime behaviors don't show up in the .d.ts. The full quirk reference — the error-message → cause table, the runtime-symptom → workaround table, and the text-doesn't-render diagnosis order — lives in this skill's `quirks.md`. On ANY cryptic error or non-rendering block, look up a fragment of the error message in it BEFORE bisecting.

### Prefer surgical fixes over wipe-and-rebuild

Each rebuild costs ~10 extra tool calls (re-create scene, re-position every block, re-verify). When something looks wrong, identify the specific block and edit it in place with a targeted `setProps` — position, fontSize, the string, etc. Reach for `engine.scene.create(...)` only when the scene graph is genuinely unrecoverable, which is rare.

## 6. Design rules

Enforceable design best practices with numeric thresholds — what you build to, and what the `judge` skill scores against. Each rule group ends with a **Pass condition**; a failed Pass condition pulls its parent axis below 8, and one axis below 8 fails the design (no averaging — see the `judge` skill for the axes and the gate).

- **Web vs print** — where the two media diverge (line height, minimum sizes) the rules are split **Web** / **Print**; "web" values apply to screen-destined canvases (social posts, banners). An unqualified rule applies to both.
- **N/A = 10** — a rule that cannot apply to a given design scores N/A, i.e. 10.
- **Defaults fill silence** — when the user's brief gives an explicit value for a property, use it; when it is silent, apply this section's defined **default** rather than leaving it unset or letting the engine default stand. Every numeric rule below that names a _default_ (line-height §6.1.3, type scale §6.1.2, measure §6.1.4, all-caps tracking §6.1.6, margins §6.4) is that fallback. A brief value that violates a hard threshold is clamped to the threshold — except line-height, which is judged by the rendered gap after conversion, never by the raw number (§6.1.3).

**The full rubric lives in this skill's `design-rules.md`** — read it BEFORE building, batched in parallel with your `api` and `judge` reads: `design-rules.md`. Section map:

- **§6.1 Typography** (§6.1.1 families/pairing · §6.1.2 type scale & canvas bands · §6.1.3 line-height/leading incl. the content-area conversion · §6.1.4 measure · §6.1.5 alignment/rag · §6.1.6 tracking & case · §6.1.7 micro-typography · §6.1.8 lists & paragraph structure · §6.1.9 rich text / inline style ranges · §6.1.10 print rules · §6.1.11 the typography pass checklist)
- **§6.2 Color** — palette ≤ 3 + neutrals, one accent, contrast on the actual background
- **§6.3 Hierarchy** — one dominant element; rank via size > weight > color > spacing > position
- **§6.4 Composition & grid** — margins 8–12% of the shortest dimension, the spacing ladder, no dead void
- **§6.5 Craft & finish** — §6.5.1 chips/pills/badges as native text backgrounds; §6.5.2 the craft pass checklist
- **§6.6 Localization & RTL** — pointer to the `localize` skill
- **§6.7 Font discovery & pairing** — the `ly.img.gfonts` lookup pattern, variable-font weights, context→pairing table
- **§6.8 Copy** — bundled into the `judge` skill read

---

## Before your first `edit`: read the API

The edit-code API is NOT in this skill. Before your first `edit` (skip this if you already read it this session), load the `api` skill (`../api/SKILL.md`): the whole file in one call, batched in the same ONE message as `design-rules.md` and the `judge` skill. It returns the `engine.design` facade, the props trees, the attachment unions and the capability matrix. Every task skill (`create`, `resize`, `localize`, …) edits through it; guessed method or property names fail.
