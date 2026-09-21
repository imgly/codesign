---
name: api
description: |
  Authoritative TypeScript signatures for the CE.SDK CreativeEngine. Use this
  skill whenever you need the exact signature, parameter types, or return type
  of an `engine.*` method — especially before calling a method you haven't
  used yet. Generated from the `.d.ts` of the same `@cesdk/node` package the
  engine runs, it is THE source of truth; prose docs (the `guide` skill) can
  drift.

  This skill's entry document carries the WHOLE edit-code API surface inline
  — the engine.design facade, the props trees, the attachment unions and the
  capability matrix: all edit code needs, in one read.

  The sub-file "signatures.d.ts" is the same surface plus the upstream CE.SDK
  core — JSDoc-free, every string-vocabulary type (property names, block
  types, enum values) flattened to its literal union; the entry document
  explains how to look a member up in it.

  Triggered when you need to verify an `engine.block.*` or `engine.scene.*`
  signature, look up a parameter type, or confirm an enum/string-property name.
---

## Start here: `engine.design` (inside `edit` code)

For reading and writing block state, prefer the codesign facade over the raw
accessors — one nested-props dialect, one call per block:

```js
const page = await engine.design.create(
  { type: 'page', props: { width: 1080, height: 1920 } },
  { parent: stack }
);
const chip = await engine.design.create(
  {
    type: 'text',
    name: 'chip',
    props: {
      backgroundColor: {
        enabled: true,
        color: ACCENT,
        paddingLeft: 24,
        cornerRadius: 999
      }
    }
  },
  { parent: page }
);
await engine.design.setProps(title, {
  opacity: 0.9,
  stroke: { enabled: true, width: 2 }
});
const { width } = await engine.design.getProps(page, ['width']);
```

- `create(spec, { parent?, index? })` (await it!) is THE constructor — one
  block or a whole subtree, the same spec shape at every level. It folds
  create + appendChild + property writes into one call and rolls back on
  failure (never an orphan). Returns the root block id.
- A spec node carries exactly `type`, `name`, `props` and `children` (nested,
  same shape). Everything else IS props — including the font: naming a
  family (`text: { font: { family, weight } }`) makes `create` — and
  `setProps` — do the Google-Fonts lookup and pick that weight's file. Every
  `engine.design` member returns a Promise: always `await` it (the edit gate
  rejects un-awaited calls).
  `text: { string, ranges }` (style ranges
  replayed reshape-safe), inline `fill: { type, ... }` / `shape` / `blur` /
  `effects: [...]` / `animations` specs all sit under `props`. `create`
  awaits the subtree's font/image loads before returning, so measurements
  after it are trustworthy.
- `name` on any node is written onto the block itself:
  `const [chip] = await engine.design.findByName('chip')` resolves it in this edit
  and in every later one. Name every block you may touch again.
- No `describe`: identity IS props — `getProps(id)` for everything valued,
  `getProps(id, ['type'])` for what a block is, `getCapabilities(idOrType)`
  for what it supports. Attachments (fill/shape/blur/effects/animations)
  round-trip as `{ type, ...props }` specs through setProps/getProps —
  attachment ids never circulate.
- Text is all props too: `setProps(id, { text: { string, font, weight,
case, ranges, path, decoration } })` — leaves apply in a safe order and
  a string-only write auto-preserves style ranges. Read back via
  `getProps(id, ['text.ranges'])` / `['text.paragraphs']`.
- Length props take unit strings: `width: '210mm'`, `fontSize: '32pt'`,
  `'50%'` (sets Percent mode too) — converted against the scene's units at
  write time. Plain numbers stay engine-native, EXCEPT font sizes
  (`text.fontSize`, a range's `size`) where the unit is required: a bare
  number is engine-native points and would render ~4.2× too large, so it is
  rejected.
- `setProps` validates **every** leaf before touching the scene: a bad leaf
  throws listing all bad paths with suggestions, and nothing is applied.
- `getProps(id, ['opacity', 'stroke'])` reads leaves or whole subtrees; an
  unknown selector throws — it never answers a typo with `undefined`.
- The full `BlockProps` / `SettingsProps` trees are at the TOP of
  `signatures.d.ts` (search `interface BlockProps`).
- Attachment state is a discriminated union: assign `{ type, ...props }` to
  `fill`/`shape`/`blur`/`effects`/`animations`. The type picks the arm and
  the arm names every prop it carries. A type MATCHING what is attached
  edits it in place; a different type replaces it; `null` detaches (except
  `effects`, replaced wholesale — `[]` clears). Reads answer in the same
  shape, so `getProps` output feeds straight back in. Tree/layout verbs live on `engine.design` (group, appendChild, align); only export-style I/O stays on `engine.block.*`.
- Scalar wrappers (`setOpacity`, `setStrokeWidth`, …), `is*`/`supports*`
  predicates and editor-UI methods moved to the sub-file
  `signatures-extended.d.ts` — search there if you need an old name; prefer
  the facade + the capability matrix.

## Single file: `signatures.d.ts`

The whole CE.SDK call surface is in `signatures.d.ts` (~2000 lines) —
signatures only, no doc comments, with every alias flattened, so a hit is
usually the whole answer:

1. Find the member (e.g. `setProps`) in `signatures.d.ts` —
   search the file if your host can search skill files, otherwise read it
   once and look the member up.
2. Read about 20 lines of context around the match when the matched line is
   not enough.

What the flattening means for you:

- A vocabulary type is its values: `type DesignBlockType = 'scene' | 'page' |
'graphic' | …` — no `Shorthand`/`(typeof …)[number]` chains to chase. Where
  a `// each also valid as '…<name>…'` comment follows a union, the prefixed
  longhand spelling of every member is accepted too.
- Property-name unions (`FloatPropertyName`, `ColorPropertyName`, …) list
  every legal string for `setFloat`/`setColor`/`getString`-style accessors.
  If a string is not in the union, the engine does not accept it — never
  invent property paths.
- A `/** @deprecated … */` one-liner names the replacement; prefer it.
  Deprecated overloads of a surviving method are omitted entirely — the
  listed signature is the current one.

Look members up by name, not by remembered line numbers: a name survives
CE.SDK updates, a line number does not.

## Browsing a whole class

A name lookup can't answer "what can `engine.scene` do?" — for that, read the
contiguous run that starts at the class declaration. At ~2000 lines total,
whole-class reads are cheap (`BlockAPI` is the largest):

| Class        | Start line |
| ------------ | ---------- |
| AssetAPI     | 1163       |
| **BlockAPI** | **1452**   |
| EditorAPI    | 1685       |
| EventAPI     | 1816       |
| **SceneAPI** | **1896**   |
| VariableAPI  | 2099       |

(If a start line looks off — e.g. the run doesn't begin with the class — find
the declaration by name instead: `class BlockAPI`.)

## What is NOT in this file

- **Parameter semantics** — units, value ranges, defaults for optional
  parameters. Where a signature says only `r: number`, color components are
  in the range 0–1, never 0–255. For anything else a bare `number`/`string`
  leaves open, check the `guide` skill's topic page before guessing.
- Conceptual prose ("how does XYZ work") → use the `guide` skill instead.
- General topic guides (text, fills, export, rules) → use the `guide` skill
  instead.


---

# The edit-code API surface (docs/api/signatures.d.ts)

⚠ The video/audio/caption/track members below exist in the engine but the VIDEO FEATURE IS DISABLED on this server: no mp4/audio export, no video fills, no timeline work. Treat them as reference-only.

Everything edit code writes through, inline below. The upstream CE.SDK core is the rest of that file — `signatures.d.ts` — when you need a member this section lacks.

```typescript
// ============================================================================
// codesign extension: engine.design — write ALL mutations through this API.
// engine.block.* is the legacy/extended surface: use it only for reads the
// facade lacks (getTextRuns and other diagnostics). Available inside `edit` code alongside the engine.block.* API it
// delegates to. One nested-props dialect replaces the typed accessors
// (setFloat/getBool/…), the per-property wrappers (setOpacity,
// setStrokeWidth, setPositionX, …) and the is*-state reads.
//
// Contract: setProps/create validate EVERY leaf before touching the scene —
// a bad leaf throws (listing every bad path with suggestions) and nothing is
// applied. getProps throws on an unknown selector; it never returns
// undefined for a typo. create rolls back on failure (never an orphan).
// Attachment state (fill/shape/blur/effects/animations) is the typed
// unions below — assign { type, ...props } specs via setProps; the raw
// engine.block accessors are never needed for it.
//
// Units: length leaves (width/height/position, paddings, stroke.width,
// dropShadow offsets/radii, page margins) and fontSize accept CSS-style
// unit STRINGS — '210mm', '32pt', '340px', '1.2in' — converted against the
// scene's current designUnit/fontSizeUnit/dpi at write time, so the value
// means what you said regardless of ambient unit state. '50%' on
// width/height/position also sets the '<leaf>Mode' to 'Percent' (an
// absolute unit pins it to 'Absolute'). A plain number stays engine-native —
// EXCEPT on a font size (text.fontSize, a range's size), where the unit is
// REQUIRED and a bare number is rejected: engine-native font size is POINTS,
// so 64 would render ~267px at 300 dpi. Write '64px' (screen) or '24pt'.
// letterSpacing is a FACTOR, never a length. lineHeight: write { visual: n }
// (CSS-style x fontSize — the facade converts per font); a bare number is the
// ENGINE scale (x the font's contentArea) and renders looser than it reads.
// Text glyph color is per-character: fill.solid.color on a text block is
// REJECTED — write setProps(id, { text: { color } }) instead.
// ============================================================================
// Branded attachment ids — nominal guidance (runtime dispatch enforces the
// category): a FillId/EffectId/... is where the matching attachment props
// tree applies, never BlockProps.
// Durable identity: every id parameter also accepts the block's UUID string
// (read it via getProps(id, ['uuid']) or a tree read) — the identity that
// persists in the scene file and crosses edits/revisions. An unknown uuid
// throws "not in this revision"; a stale numeric handle can't be caught.
type BlockRef = DesignBlockId | string /* uuid */;
// One node of the document read as a tree; feed a (subset of a) node tree
// back to setProps to patch every node by uuid.
interface PropsNode { uuid: string; name?: string; type: string; props: BlockProps; children: PropsNode[] }
type FillId = DesignBlockId & { readonly __kind?: 'fill' };
type EffectId = DesignBlockId & { readonly __kind?: 'effect' };
type BlurId = DesignBlockId & { readonly __kind?: 'blur' };
type ShapeId = DesignBlockId & { readonly __kind?: 'shape' };
type AnimationId = DesignBlockId & { readonly __kind?: 'animation' };
interface DesignApi {
    /** EVERY member returns a Promise — always: await engine.design.x(...)
     *  (a floating rejection fails the edit at commit). */
    /** THE constructor: one block or a whole subtree, same spec shape at
     *  every level. Looks up any font: { family, weight }, applies props,
     *  attaches to the parent, and awaits the subtree's font/image loads
     *  before returning, so measure() is truthful immediately. Rolls the
     *  WHOLE subtree back on failure. Name the nodes you will touch again:
     *  the name lands on the block and findByName resolves it later. */
    create(spec: BuildSpec, opts?: { parent?: BlockRef; index?: number }): Promise<DesignBlockId>;
    /** Partial deep-merge write. Brand-dispatched: pass a FILL/EFFECT/BLUR/
     *  SHAPE/ANIMATION block id and the matching attachment props tree
     *  (effect/*, fill/*, … paths as nested keys) applies instead.
     *  Given a PropsNode TREE (a node with uuid+props or children) it
     *  patches every node by uuid — read the tree, transform it in JS,
     *  write it back. Patch-only: an absent block/prop is untouched, never
     *  deleted; uuids resolve for the whole tree before anything applies. */
    setProps(id: BlockRef, props: BlockProps | PropsNode): Promise<void>;
    /** Read leaves or whole subtrees — getProps(id, ['opacity', 'stroke']) —
     *  or omit select for EVERY applicable prop of this block, valued.
     *  { children: true, props?: [...] } reads the whole SUBTREE as one
     *  uuid-keyed PropsNode tree — filter it with plain JS (a selector a
     *  block kind lacks is skipped for that block). The snapshot never
     *  enters your reply unless you print it. */
    getProps(id: BlockRef, select?: string[] | { children: true; props?: string[] }): Promise<BlockProps>;
    /** Editor settings, same dialect. */
    setSettings(props: SettingsProps): Promise<void>;
    getSettings(select?: string[]): Promise<SettingsProps>;
    /** Resolve a font AND its metrics in one call — by family (the same
     *  Google-Fonts lookup create runs) or by uri (brand fonts). Also warms
     *  the metrics cache behind text.lineHeight: { visual } — after create
     *  with text.font, font(), or loadResources, visual line-heights need
     *  no fetch. No other metrics call is needed. */
    font(spec: { family?: string; uri?: string; weight?: FontWeight; style?: FontStyle }): Promise<{ typeface?: Typeface; uri: string; contentArea: number; metrics: { ascender: number; descender: number; lineGap: number; unitsPerEm: number; capHeight: number; xHeight: number } }>;
    // text.path is raw-or-spec like every attachment: a raw SVG string, or
    // { shape: 'circle', diameter, align?: 'top' | 'bottom' | 0..1 } — the
    // spec authors the circle, measures the flat glyph run, centers the
    // offset and sets the D×D frame (align: 'bottom' = upright underside).
    // No describe: identity IS props. getProps(id, ['type']) names the block,
    // getCapabilities answers what it supports, and fill/shape/blur/effects/
    // animations round-trip as { type, ...props } specs through
    // setProps/getProps — attachment ids never circulate.
    /** Editing scopes (what the browser-editor user may change). */
    getScopes(id: BlockRef): Promise<Record<Scope, boolean>>;
    setScopes(id: BlockRef, scopes: Partial<Record<Scope, boolean>>): Promise<void>;
    getCapabilities(idOrType: BlockRef | DesignBlockType): Promise<readonly string[]>;
    // Attachment values are the discriminated unions below — the type picks
    // the arm, the arm names every prop that type carries. A type MATCHING
    // what is attached edits it in place; a different type replaces it
    // (replaced attachment blocks are destroyed, no leaks); null detaches:
    //   await setProps(id, { fill: { type: 'color', color: { value } } })
    //   await setProps(id, { fill: { enabled: false } })          // no type ⇒ host leaves
    //   Gradient fills round-trip stops; image fills round-trip sourceSet —
    //   getProps(id, ['fill']) → tweak → setProps is lossless.
    //   await setProps(id, { shape: { type: 'rect' } }) · { blur: { type: 'uniform' } }
    //   await setProps(id, { effects: [{ type: 'duotone_filter', duotone_filter: {…} }] })
    //   await setProps(id, { animations: { in: { type: 'slide', … } } })  // null detaches
    // TEXT is all props too, applied in canonical order (font → string →
    // styles → ranges) whatever the key order:
    //   await setProps(id, { text: { string, font: { typeface }, weight, case,
    //     listStyle, path, pathOffset, pathFlipped,
    //     ranges: [{ from, to, color?, weight?, style?, size?, case?,
    //       decoration?, kerning? }] } })
    // A string write WITHOUT other text styling auto-preserves existing
    // ranges; with styling, ranges reset (pass ranges to keep or ranges: []
    // to wipe); font/size/lineHeight writes auto-reshape. Read the per-run
    // truth via getProps(id, ['text.ranges']); paragraphs (read-only) carry
    // listStyle + listLevel.
    adjustCropToFillFrame(id: BlockRef, minScaleRatio: number): Promise<number>;
    // Multi-block layout verbs:
    /** Axis-keyed ('Center' is never ambiguous); one call may do both axes. */
    align(ids: BlockRef[], alignment: { horizontal?: 'Left' | 'Center' | 'Right'; vertical?: 'Top' | 'Center' | 'Bottom' }): Promise<void>;
    distribute(ids: BlockRef[], axis: 'horizontal' | 'vertical'): Promise<void>;
    isAlignable(ids: BlockRef[]): Promise<boolean>;
    isDistributable(ids: BlockRef[]): Promise<boolean>;
    bringToFront(id: BlockRef): Promise<void>;
    sendToBack(id: BlockRef): Promise<void>;
    bringForward(id: BlockRef): Promise<void>;
    sendBackward(id: BlockRef): Promise<void>;
    scale(id: BlockRef, factor: number, opts?: { anchorX?: number; anchorY?: number }): Promise<void>;
    resizeContentAware(ids: BlockRef[], size: { width: number; height: number }): Promise<void>;
    /** Measured layout frame (post-layout px) — the numbers you position by.
     *  textLines: visible line count, text blocks only. */
    measure(id: BlockRef): Promise<{ x: number; y: number; width: number; height: number; textLines?: number }>;
    /** Await pending font/image loads for these subtrees (create does this itself). */
    loadResources(ids: BlockRef[]): Promise<void>;
    isGroupable(ids: BlockRef[]): Promise<boolean>;
    // Tree verbs, so edit code never needs a second dialect:
    appendChild(parent: BlockRef, child: BlockRef): Promise<void>;
    /** Re-slot an EXISTING block at a z-index (create takes { index } itself). */
    insertChild(parent: BlockRef, child: BlockRef, index: number): Promise<void>;
    getParent(id: BlockRef): Promise<DesignBlockId | null>;
    getChildren(id: BlockRef): Promise<DesignBlockId[]>;
    findByType(type: DesignBlockType): Promise<DesignBlockId[]>;
    /** Blocks carrying this name. create writes a spec node's name onto the
     *  block, so this is how a LATER edit re-finds what an earlier made. */
    findByName(name: string): Promise<DesignBlockId[]>;
    group(ids: BlockRef[]): Promise<DesignBlockId>;
    ungroup(id: BlockRef): Promise<void>;
    duplicate(id: BlockRef): Promise<DesignBlockId>;
    destroy(id: BlockRef): Promise<void>;
}
interface BuildSpec {
    type: DesignBlockType;
    /** Written onto the block; findByName(name) resolves it, in this edit
     *  and in every later one. */
    name?: string;
    /** Everything the block IS — attachments included: fill/shape/blur as a
     *  { type, ... } spec or the type string, effects as a spec list,
     *  animations per slot, the whole text subtree. A font may be named by
     *  FAMILY here (text.font: { family, weight }): create — and setProps —
     *  resolve the lookup and apply it before any text styling. */
    props?: BlockProps;
    children?: BuildSpec[];
}
// Capability matrix (measured against the engine; type-determined —
// no need to call supports* for blocks you created):
// capability        audio        caption      captionTrack cutout       graphic      group        page         text         track        
// animation         ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            
// backgroundColor   ·            ✓            ·            ·            ·            ·            ·            ✓            ·            
// blendMode         ·            ✓            ·            ·            ✓            ✓            ✓            ✓            ·            
// blur              ·            ·            ·            ·            ✓            ·            ✓            ·            ·            
// contentFillMode   ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            
// crop              ·            ·            ·            ·            ✓            ·            ·            ·            ·            
// dropShadow        ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·            
// duration          ✓            ✓            ✓            ·            ✓            ✓            ✓            ✓            ✓            
// effects           ·            ·            ·            ·            ✓            ·            ✓            ·            ·            
// fill              ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·            
// opacity           ·            ✓            ·            ·            ✓            ✓            ·            ✓            ·            
// placeholderBehavior·            ✓            ·            ·            ·            ·            ·            ✓            ·            
// placeholderControls·            ·            ·            ✓            ✓            ·            ✓            ·            ·            
// playbackControl   ✓            ·            ·            ·            ·            ·            ✓            ·            ·            
// playbackTime      ✓            ·            ·            ·            ·            ·            ✓            ·            ·            
// shape             ·            ·            ·            ·            ✓            ·            ·            ·            ·            
// stroke            ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·            
// timeOffset        ✓            ✓            ✓            ·            ✓            ✓            ·            ✓            ✓            
// trim              ✓            ·            ·            ·            ·            ·            ·            ·            ·            

interface BlockProps {
    alwaysOnBottom?: boolean;
    alwaysOnTop?: boolean;
    animationEasing?: 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
    animations?: {
        in?: Animation | null;
        loop?: Animation | null;
        out?: Animation | null;
    };
    audio?: {
        fileURI?: string;
        totalDuration?: number;
    };
    backgroundColor?: {
        color?: Color;
        cornerRadius?: number;
        enabled?: boolean;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
    };
    blend?: {
        mode?: 'PassThrough' | 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'LinearBurn' | 'DarkenColor' | 'Lighten' | 'Screen' | 'ColorDodge' | 'LinearDodge' | 'LightenColor' | 'Overlay' | 'SoftLight' | 'HardLight' | 'VividLight' | 'LinearLight' | 'PinLight' | 'HardMix' | 'Difference' | 'Exclusion' | 'Subtract' | 'Divide' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';
    };
    blur?: Blur | null;
    camera?: {
        pixelRatio?: number;
        resolution?: {
            height?: number;
            width?: number;
        };
        zoomLevel?: number;
    };
    caption?: {
        automaticFontSizeEnabled?: boolean;
        clipLinesOutsideOfFrame?: boolean;
        externalReference?: string;
        fontFileUri?: string;
        fontSize?: number;
        hasClippedLines?: boolean;
        horizontalAlignment?: 'Left' | 'Right' | 'Center' | 'Auto';
        letterSpacing?: number;
        lineHeight?: number;
        maxAutomaticFontSize?: number;
        minAutomaticFontSize?: number;
        paragraphSpacing?: number;
        pathExternalRef?: string;
        pathFlipped?: boolean;
        pathOffset?: number;
        text?: string;
        typeface?: string;
        useContextualAlternates?: boolean;
        useContextualLigatures?: boolean;
        useDiscretionaryLigatures?: boolean;
        useKerning?: boolean;
        useLigatures?: boolean;
        verticalAlignment?: 'Top' | 'Bottom' | 'Center';
    };
    captionTrack?: {
        automaticallyManageBlockOffsets?: boolean;
    };
    clipped?: boolean;
    contentFill?: {
        horizontalAlignment?: 'Left' | 'Center' | 'Right';
        mode?: 'Crop' | 'Cover' | 'Contain';
        verticalAlignment?: 'Top' | 'Center' | 'Bottom';
    };
    crop?: null | {
        aspectRatioLocked?: boolean;
        rotation?: number;
        scaleRatio?: number;
        scaleX?: number;
        scaleY?: number;
        translationX?: number;
        translationY?: number;
    };
    cutout?: {
        offset?: number;
        path?: string;
        smoothing?: number;
        type?: 'Solid' | 'Dashed';
    };
    dropShadow?: {
        blurRadius?: {
            x?: number;
            y?: number;
        };
        clip?: boolean;
        color?: Color;
        enabled?: boolean;
        offset?: {
            x?: number;
            y?: number;
        };
    };
    effects?: Effect[];
    fill?: Fill | null;
    flip?: {
        horizontal?: boolean;
        vertical?: boolean;
    };
    globalBoundingBox?: {
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    };
    height?: number;
    heightMode?: 'Absolute' | 'Percent' | 'Auto';
    highlightEnabled?: boolean;
    includedInExport?: boolean;
    kind?: string;
    lastFrame?: {
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    };
    movement?: {
        constraint?: number;
    };
    name?: string;
    opacity?: number;
    page?: {
        guides?: {
            gridColor?: Color;
            gridEnabled?: boolean;
            gridSnapEnabled?: boolean;
            gridSpacingX?: number;
            gridSpacingY?: number;
            source?: 'Document' | 'Custom';
        };
        margin?: {
            bottom?: number;
            left?: number;
            right?: number;
            top?: number;
        };
        marginEnabled?: boolean;
        marginScale?: number;
        titleTemplate?: string;
    };
    placeholder?: {
        enabled?: boolean;
    };
    placeholderBehavior?: {
        enabled?: boolean;
    };
    placeholderControls?: {
        showButton?: boolean;
        showOverlay?: boolean;
    };
    playback?: {
        duration?: number;
        fadeIn?: {
            duration?: number;
            easing?: 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
        };
        fadeOut?: {
            duration?: number;
            easing?: 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
        };
        looping?: boolean;
        muted?: boolean;
        playing?: boolean;
        soloPlaybackEnabled?: boolean;
        speed?: number;
        time?: number;
        timeOffset?: number;
        trimLength?: number;
        trimOffset?: number;
        volume?: number;
    };
    position?: {
        x?: number;
        xMode?: 'Absolute' | 'Percent' | 'Auto';
        y?: number;
        yMode?: 'Absolute' | 'Percent' | 'Auto';
    };
    rotation?: number;
    scene?: {
        aspectRatioLock?: boolean;
        designUnit?: 'Pixel' | 'Millimeter' | 'Inch';
        dpi?: number;
        extendedPanningArea?: boolean;
        fontSizeUnit?: 'Pixel' | 'Point';
        layout?: 'Free' | 'VerticalStack' | 'HorizontalStack' | 'DepthStack';
        mode?: 'Design' | 'Video';
        pageDimensions?: {
            height?: number;
            width?: number;
        };
        pageFormatId?: string;
        pixelScaleFactor?: number;
    };
    selected?: boolean;
    selectionEnabled?: boolean;
    shape?: Shape | null;
    stack?: {
        spacing?: number;
        spacingInScreenspace?: boolean;
    };
    stroke?: {
        cap?: 'Butt' | 'Round' | 'Square';
        color?: Color;
        cornerGeometry?: 'Bevel' | 'Miter' | 'Round';
        dashArray?: number[];
        dashEndCap?: 'Butt' | 'Round' | 'Square';
        dashOffset?: number;
        dashStartCap?: 'Butt' | 'Round' | 'Square';
        enabled?: boolean;
        endCap?: 'Butt' | 'Round' | 'Square';
        overprint?: boolean;
        position?: 'Center' | 'Inner' | 'Outer';
        startCap?: 'Butt' | 'Round' | 'Square';
        style?: 'Dashed' | 'DashedRound' | 'Dotted' | 'LongDashed' | 'LongDashedRound' | 'Solid';
        width?: number;
    };
    text?: {
        automaticFontSizeEnabled?: boolean;
        case?: string;
        clipLinesOutsideOfFrame?: boolean;
        color?: Color;
        decoration?: TextDecorationConfig;
        externalReference?: string;
        font?: { family: string; weight?: FontWeight; style?: string } /* create only: a lookup */ | { typeface: Typeface; uri?: string };
        fontFileUri?: string;
        fontSize?: string /* WRITE needs a unit: '64px' | '24pt'. READS answer a unit string too ('64px') — parseFloat() before any math, never .toFixed() on it */;
        hasClippedLines?: boolean;
        horizontalAlignment?: 'Left' | 'Right' | 'Center' | 'Auto';
        letterSpacing?: number;
        lineHeight?: number /* engine scale: multiplies the font's contentArea */ | { visual: number } /* CSS-style x fontSize — the facade converts per font */;
        lineHeightVisual?: number /* READ-ONLY, selected reads: lineHeight in CSS terms. Write via lineHeight: { visual } */;
        listStyle?: ListStyle /* whole block; nesting via raw setTextListLevel */;
        maxAutomaticFontSize?: number;
        minAutomaticFontSize?: number;
        paragraphs?: { index: number; from?: number; listStyle?: ListStyle; listLevel?: number; horizontalAlignment?: string; lineHeight?: number }[];
        paragraphSpacing?: number;
        path?: string /* SVG path baseline */ | { shape: 'circle'; diameter: number; align?: 'top' | 'bottom' | number } | null;
        pathExternalRef?: string;
        pathFlipped?: boolean /* true = underside, reversed direction */;
        pathOffset?: number /* proportional start offset along the path */;
        ranges?: { from: number; to: number; color?: Color; weight?: FontWeight; style?: string; size?: string /* px string */; case?: TextCase; typeface?: Typeface; decoration?: TextDecorationConfig; kerning?: number }[];
        style?: string;
        string?: string;
        typeface?: string;
        useContextualAlternates?: boolean;
        useContextualLigatures?: boolean;
        useDiscretionaryLigatures?: boolean;
        useKerning?: boolean;
        useLigatures?: boolean;
        verticalAlignment?: 'Top' | 'Bottom' | 'Center';
        weight?: string;
    };
    textAnimationOverlap?: number;
    textAnimationWritingStyle?: 'Block' | 'Line' | 'Character' | 'Word';
    track?: {
        automaticallyManageBlockOffsets?: boolean;
    };
    transformLocked?: boolean;
    type?: string;
    uuid?: string;
    visible?: boolean;
    width?: number;
    widthMode?: 'Absolute' | 'Percent' | 'Auto';
}
// Attachments. The type field picks the arm, and the arm names every prop
// that type carries — nothing else applies. Assigning one whose type MATCHES
// what is already attached edits it in place; a different type replaces it.
// Each shorthand is also valid as '//ly.img.ubq/<slot>/<name>'.
type Fill = { enabled?: boolean; overprint?: boolean } & (
  | {
      type: 'color';
      color?: {
          value?: Color;
      };
    }
  | {
      type: 'gradient/linear';
      stops?: GradientColorStop[];
      gradient?: {
          linear?: {
              endPointX?: number;
              endPointY?: number;
              startPointX?: number;
              startPointY?: number;
          };
      };
    }
  | {
      type: 'gradient/radial';
      stops?: GradientColorStop[];
      gradient?: {
          radial?: {
              centerPointX?: number;
              centerPointY?: number;
              radius?: number;
          };
      };
    }
  | {
      type: 'gradient/conical';
      stops?: GradientColorStop[];
      gradient?: {
          conical?: {
              centerPointX?: number;
              centerPointY?: number;
          };
      };
    }
  | {
      type: 'image';
      uri?: string /* shorthand for image.imageFileURI */;
      sourceSet?: Source[];
      image?: {
          externalReference?: string;
          imageFileURI?: string;
          previewFileURI?: string;
      };
    }
  | {
      type: 'video';
      uri?: string /* shorthand for video.fileURI */;
      video?: {
          fileURI?: string;
          totalDuration?: number;
      };
    }
  | {
      type: 'pixelStream';
      pixelStream?: {
          orientation?: 'Up' | 'Down' | 'Left' | 'Right' | 'UpMirrored' | 'DownMirrored' | 'LeftMirrored' | 'RightMirrored';
      };
    }
);
type Shape =
  | {
      type: 'rect';
      rect?: {
          cornerRadiusBL?: number;
          cornerRadiusBR?: number;
          cornerRadiusTL?: number;
          cornerRadiusTR?: number;
      };
    }
  | { type: 'line' }
  | { type: 'ellipse' }
  | {
      type: 'polygon';
      polygon?: {
          cornerRadius?: number;
          sides?: number;
      };
    }
  | {
      type: 'star';
      star?: {
          cornerRadius?: number;
          innerDiameter?: number;
          points?: number;
      };
    }
  | {
      type: 'vector_path';
      vector_path?: {
          cornerRadius?: number;
          fillRule?: 'EvenOdd' | 'NonZero';
          height?: number;
          path?: string;
          width?: number;
      };
    };
type Blur = { enabled?: boolean } & (
  | {
      type: 'uniform';
      uniform?: {
          intensity?: number;
      };
    }
  | {
      type: 'linear';
      linear?: {
          blurRadius?: number;
          x1?: number;
          x2?: number;
          y1?: number;
          y2?: number;
      };
    }
  | {
      type: 'mirrored';
      mirrored?: {
          blurRadius?: number;
          gradientSize?: number;
          size?: number;
          x1?: number;
          x2?: number;
          y1?: number;
          y2?: number;
      };
    }
  | {
      type: 'radial';
      radial?: {
          blurRadius?: number;
          gradientRadius?: number;
          radius?: number;
          x?: number;
          y?: number;
      };
    }
);
type Effect = { enabled?: boolean } & (
  | {
      type: 'adjustments';
      adjustments?: {
          blacks?: number;
          brightness?: number;
          clarity?: number;
          contrast?: number;
          exposure?: number;
          gamma?: number;
          highlights?: number;
          saturation?: number;
          shadows?: number;
          sharpness?: number;
          temperature?: number;
          whites?: number;
      };
    }
  | {
      type: 'cross_cut';
      cross_cut?: {
          offset?: number;
          slices?: number;
          speedV?: number;
          time?: number;
      };
    }
  | {
      type: 'dot_pattern';
      dot_pattern?: {
          blur?: number;
          dots?: number;
          size?: number;
      };
    }
  | {
      type: 'duotone_filter';
      duotone_filter?: {
          darkColor?: Color;
          intensity?: number;
          lightColor?: Color;
      };
    }
  | {
      type: 'extrude_blur';
      extrude_blur?: {
          amount?: number;
      };
    }
  | {
      type: 'glow';
      glow?: {
          amount?: number;
          darkness?: number;
          size?: number;
      };
    }
  | {
      type: 'green_screen';
      green_screen?: {
          colorMatch?: number;
          fromColor?: Color;
          smoothness?: number;
          spill?: number;
      };
    }
  | {
      type: 'half_tone';
      half_tone?: {
          angle?: number;
          scale?: number;
      };
    }
  | {
      type: 'linocut';
      linocut?: {
          scale?: number;
      };
    }
  | {
      type: 'liquid';
      liquid?: {
          amount?: number;
          scale?: number;
          time?: number;
      };
    }
  | {
      type: 'lut_filter';
      lut_filter?: {
          filterId?: string;
          horizontalTileCount?: number;
          intensity?: number;
          lutFileURI?: string;
          verticalTileCount?: number;
      };
    }
  | {
      type: 'mirror';
      mirror?: {
          side?: number;
      };
    }
  | {
      type: 'outliner';
      outliner?: {
          amount?: number;
          passthrough?: number;
      };
    }
  | {
      type: 'pixelize';
      pixelize?: {
          horizontalPixelSize?: number;
          verticalPixelSize?: number;
      };
    }
  | {
      type: 'posterize';
      posterize?: {
          levels?: number;
      };
    }
  | {
      type: 'radial_pixel';
      radial_pixel?: {
          radius?: number;
          segments?: number;
      };
    }
  | {
      type: 'recolor';
      recolor?: {
          brightnessMatch?: number;
          colorMatch?: number;
          fromColor?: Color;
          smoothness?: number;
          toColor?: Color;
      };
    }
  | { type: 'sharpie' }
  | {
      type: 'shifter';
      shifter?: {
          amount?: number;
          angle?: number;
      };
    }
  | {
      type: 'tilt_shift';
      tilt_shift?: {
          amount?: number;
          position?: number;
      };
    }
  | {
      type: 'tv_glitch';
      tv_glitch?: {
          distortion?: number;
          distortion2?: number;
          rollSpeed?: number;
          speed?: number;
      };
    }
  | {
      type: 'vignette';
      vignette?: {
          darkness?: number;
          offset?: number;
      };
    }
);
type Animation =
  | {
      type: 'slide';
      slide?: {
          direction?: number;
          fade?: boolean;
      };
    }
  | {
      type: 'pan';
      pan?: {
          direction?: number;
          distance?: number;
          fade?: boolean;
      };
    }
  | { type: 'fade' }
  | {
      type: 'blur';
      blur?: {
          fade?: boolean;
          intensity?: number;
      };
    }
  | {
      type: 'grow';
      grow?: {
          direction?: 'Horizontal' | 'Vertical' | 'All' | 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
          scaleFactor?: number;
      };
    }
  | {
      type: 'zoom';
      zoom?: {
          fade?: boolean;
      };
    }
  | { type: 'pop' }
  | {
      type: 'wipe';
      wipe?: {
          direction?: 'Up' | 'Right' | 'Down' | 'Left';
      };
    }
  | {
      type: 'baseline';
      baseline?: {
          direction?: 'Up' | 'Right' | 'Down' | 'Left';
      };
    }
  | {
      type: 'crop_zoom';
      crop_zoom?: {
          fade?: boolean;
          scale?: number;
      };
    }
  | {
      type: 'spin';
      spin?: {
          direction?: 'Clockwise' | 'CounterClockwise';
          fade?: boolean;
          intensity?: number;
      };
    }
  | {
      type: 'spin_loop';
      spin_loop?: {
          direction?: 'Clockwise' | 'CounterClockwise';
      };
    }
  | { type: 'fade_loop' }
  | {
      type: 'blur_loop';
      blur_loop?: {
          intensity?: number;
      };
    }
  | {
      type: 'pulsating_loop';
      pulsating_loop?: {
          intensity?: number;
      };
    }
  | {
      type: 'breathing_loop';
      breathing_loop?: {
          intensity?: number;
      };
    }
  | {
      type: 'jump_loop';
      jump_loop?: {
          direction?: 'Up' | 'Right' | 'Down' | 'Left';
          intensity?: number;
      };
    }
  | { type: 'squeeze_loop' }
  | {
      type: 'sway_loop';
      sway_loop?: {
          intensity?: number;
      };
    }
  | { type: 'scale_loop' }
  | {
      type: 'typewriter_text';
      typewriter_text?: {
          writingStyle?: 'Character' | 'Word';
      };
    }
  | {
      type: 'block_swipe_text';
      block_swipe_text?: {
          blockColor?: Color;
          direction?: 'Up' | 'Right' | 'Down' | 'Left';
          useTextColor?: boolean;
      };
    }
  | {
      type: 'spread_text';
      spread_text?: {
          fade?: boolean;
          intensity?: number;
      };
    }
  | {
      type: 'merge_text';
      merge_text?: {
          direction?: 'Right' | 'Left';
          intensity?: number;
      };
    }
  | {
      type: 'ken_burns';
      ken_burns?: {
          direction?: 'Up' | 'Right' | 'Down' | 'Left';
          fade?: boolean;
          travelDistanceRatio?: number;
          zoomIntensity?: number;
      };
    };
interface SettingsProps {
    archival?: {
        bundleOnlyUsedFontVariants?: boolean;
    };
    basePath?: string;
    blockAnimations?: {
        enabled?: boolean;
    };
    borderOutlineColor?: Color;
    camera?: {
        clamping?: {
            overshootMode?: 'Center' | 'Reverse';
        };
    };
    clampThumbnailTextureSizes?: boolean;
    clearColor?: Color;
    colorMaskingSettings?: {
        maskColor?: Color;
    };
    colorPicker?: {
        colorMode?: string;
    };
    controlGizmo?: {
        blockScaleDownLimit?: number;
        moveHandleVisibility?: 'auto' | 'always' | 'never';
        resizeHandlesVisibility?: 'auto' | 'always' | 'never';
        rotateHandlesVisibility?: 'auto' | 'always' | 'never';
        scaleHandlesVisibility?: 'auto' | 'always' | 'never';
        showCropHandles?: boolean;
        showCropScaleHandles?: boolean;
    };
    cropOverlayColor?: Color;
    defaultEmojiFontFileUri?: string;
    defaultFontFileUri?: string;
    doubleClickSelectionMode?: 'Direct' | 'Hierarchical';
    doubleClickToCropEnabled?: boolean;
    errorStateColor?: Color;
    fallbackFontUri?: string;
    forceSystemEmojis?: boolean;
    grid?: {
        color?: Color;
        enabled?: boolean;
        snapEnabled?: boolean;
        spacingX?: number;
        spacingY?: number;
    };
    handleFillColor?: Color;
    highlightColor?: Color;
    license?: string;
    listIndentPerLevel?: number;
    maxImageSize?: number;
    maxPreviewResolution?: number;
    mouse?: {
        enableScroll?: boolean;
        enableZoom?: boolean;
    };
    page?: {
        allowCropInteraction?: boolean;
        allowMoveInteraction?: boolean;
        allowResizeInteraction?: boolean;
        allowRotateInteraction?: boolean;
        allowShapeChange?: boolean;
        dimOutOfPageAreas?: boolean;
        flipDimensionsOn90DegreeCropRotation?: boolean;
        highlightDropTarget?: boolean;
        highlightWhenCropping?: boolean;
        innerBorderColor?: Color;
        marginFillColor?: Color;
        marginFrameColor?: Color;
        marqueeSelectOnBodyDrag?: boolean;
        moveChildrenWhenCroppingFill?: boolean;
        outerBorderColor?: Color;
        reparentBlocksToSceneWhenOutOfPage?: boolean;
        restrictPageSelectionToBorderAndTitle?: boolean;
        restrictResizeInteractionToFixedAspectRatio?: boolean;
        selectWhenNoBlocksSelected?: boolean;
        title?: {
            appendPageName?: boolean;
            canEdit?: boolean;
            color?: Color;
            fontFileUri?: string;
            separator?: string;
            show?: boolean;
            showOnSinglePage?: boolean;
            showPageTitleTemplate?: boolean;
        };
    };
    pageHighlightColor?: Color;
    placeholderControls?: {
        showButton?: boolean;
        showOverlay?: boolean;
    };
    placeholderHighlightColor?: Color;
    playback?: {
        showAllBlocks?: boolean;
    };
    positionSnappingThreshold?: number;
    progressColor?: Color;
    rotationSnappingGuideColor?: Color;
    rotationSnappingThreshold?: number;
    showBuildVersion?: boolean;
    snappingGuideColor?: Color;
    textVariableHighlightColor?: Color;
    timeline?: {
        trackVisibility?: string;
    };
    touch?: {
        dragStartCanSelect?: boolean;
        pinchAction?: 'None' | 'Zoom' | 'Scale' | 'Auto' | 'Dynamic';
        rotateAction?: 'None' | 'Rotate';
        singlePointPanning?: boolean;
    };
    upload?: {
        supportedMimeTypes?: string;
    };
    useSystemFontFallback?: boolean;
    web?: {
        fetchCredentials?: string;
    };
}
// ---- vocabulary referenced above (hoisted from the upstream core) ----
interface CMYKColor {
    c: number;
    m: number;
    y: number;
    k: number;
    tint: number;
}
interface Font {
    uri: string;
    subFamily?: string;
    weight?: FontWeight;
    style?: FontStyle;
}
interface GradientColorStop {
    color: Color;
    stop: number;
}
interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
interface Source {
    uri: string;
    width: number;
    height: number;
}
interface SpotColor {
    name: string;
    tint: number;
    externalReference: string;
}
interface TextDecorationConfig {
    lines: TextDecorationLine[];
    style?: TextDecorationStyle;
    underlineColor?: Color;
    underlineThickness?: number;
    underlineOffset?: number;
    skipInk?: boolean;
}
interface Typeface {
    name: string;
    fonts: Font[];
}
type Color = RGBAColor | CMYKColor | SpotColor;
type DesignBlockId = number;
type DesignBlockType = 'scene' | 'stack' | 'camera' | 'page' | 'graphic' | 'audio' | 'text' | 'group' | 'cutout' | 'track' | 'caption' | 'captionTrack'; // each also valid as '//ly.img.ubq/<name>'
type FontStyle = 'normal' | 'italic';
type FontWeight = 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'heavy';
type ListStyle = 'None' | 'Unordered' | 'Ordered';
type Scope = 'text/edit' | 'text/character' | 'fill/change' | 'fill/changeType' | 'stroke/change' | 'shape/change' | 'layer/move' | 'layer/resize' | 'layer/rotate' | 'layer/flip' | 'layer/crop' | 'layer/opacity' | 'layer/blendMode' | 'layer/visibility' | 'layer/clipping' | 'appearance/adjustments' | 'appearance/filter' | 'appearance/effect' | 'appearance/blur' | 'appearance/shadow' | 'appearance/animation' | 'lifecycle/destroy' | 'lifecycle/duplicate' | 'editor/add' | 'editor/select';
type TextCase = 'Normal' | 'Uppercase' | 'Lowercase' | 'Titlecase';
type TextDecorationLine = 'None' | 'Underline' | 'Strikethrough' | 'Overline';
type TextDecorationStyle = 'Solid' | 'Double' | 'Dotted' | 'Dashed' | 'Wavy';
```
