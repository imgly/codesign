---
name: api
description: |
  Authoritative TypeScript signatures for `engine.design`, the only API edit
  code uses. Use this skill whenever you need the exact signature, prop path,
  or return type — especially before calling a member you haven't used yet.
  Generated from the `.d.ts` of the same `@cesdk/node` package the engine
  runs, it is THE source of truth; prose docs can drift.

  This skill's entry document carries the WHOLE edit-code API surface inline
  — the engine.design facade, the props trees, the attachment unions and the
  capability matrix: all edit code needs, in one read.

  The sub-file "signatures.d.ts" adds the upstream CE.SDK core as reference
  only (edit code never calls it), every vocabulary type flattened to its
  literal union.
---

## Start here: `engine.design` (inside `edit` code)

Edit code uses `engine.design` only — the edit gate refuses every other
engine namespace (block, scene, variable, editor, asset, event) and names the
equivalent. One nested-props dialect, one call per block:

```js
const [scene] = await engine.design.findByType('scene');
const page = await engine.design.create(
  { type: 'page', props: { width: 1080, height: 1920 } },
  { parent: scene } // a page goes into the scene's stack
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
  create, appendChild and property writes into one call and rolls back on
  failure. Returns the root block id.
- A spec node carries exactly `type`, `name`, `props` and `children` (nested,
  same shape). Everything else IS props — including the font: naming a
  family (`text: { font: { family, weight } }`) makes `create` — and
  `setProps` — look the family up in this deployment's typeface sources and
  pick that weight's file. Every member returns a Promise: `await` it
  (the edit gate rejects un-awaited calls).
  `text: { string, ranges }` (style ranges replayed reshape-safe), inline
  `fill: { type, ... }` / `shape` / `blur` / `effects: [...]` / `animations`
  specs all sit under `props`. `create` awaits the subtree's font/image loads,
  so measuring right after it is safe.
- `name` on any node is written onto the block itself:
  `const [chip] = await engine.design.findByName('chip')` resolves it in this edit
  and in every later one. Name every block you may touch again.
- No `describe`: identity IS props — `getProps(id)` for everything valued,
  `getProps(id, ['type'])` for what a block is, `getCapabilities(idOrType)`
  for what it supports.
- Text is all props too: `setProps(id, { text: { string, font, weight,
case, ranges, path, decoration } })` (a range also takes
  `scriptStyle: 'Superscript' | 'Subscript'`) — leaves apply in a safe order and
  a string-only write auto-preserves style ranges. Read back via
  `getProps(id, ['text.ranges'])` / `['text.paragraphs']`.
- Length props take unit strings: `width: '210mm'`, `fontSize: '32pt'`,
  `'50%'` (sets Percent mode too) — converted against the scene's units at
  write time. Plain numbers stay engine-native, EXCEPT font sizes
  (`text.fontSize`, a range's `size`): a bare number would render ~4.2× too
  large, so a unit is required.
- `setProps` validates **every** leaf before touching the scene: a bad leaf
  throws listing all bad paths with suggestions, and nothing is applied.
- `getProps(id, ['opacity', 'stroke'])` reads leaves or whole subtrees; an
  unknown selector throws — it never answers a typo with `undefined`.
- Attachment state is a discriminated union: assign `{ type, ...props }` to
  `fill`/`shape`/`blur`/`effects`/`animations`/`transition`. The type picks
  the arm and the arm names every prop it carries. A type MATCHING what is
  attached edits it in place; a different type replaces it; `null` detaches
  (except `effects`, replaced wholesale — `[]` clears). Reads answer in the
  same shape, so `getProps` output feeds straight back in; attachment ids
  never circulate. Tree/layout verbs
  live on `engine.design` (group, appendChild, align); saving and exporting
  are the `export` tool.
- Where each prop is taught (types below, recipes and units there):
  `keyframes` (on a block and in every spec: `at` in seconds of the block),
  `transform`, `transformParent` and `text.animators` (kinetic type) →
  `../handbook/animation.md`; `baselineShift` → design-rules §6.1.9;
  `shape.modifiers`, compound `subshapes` and `stroke.fill` (angles in
  **degrees**) → `../handbook/shapes.md`; `masks` and `matte`
  (`source` is a name or uuid) → `../handbook/print.md`; `variables`
  and `bindings` → `../handbook/templates.md`; scene `markers` →
  `../handbook/video.md`.
- Document state is on the scene block (`variables`, `spotColors`,
  `markers`, `scene.*`); a new document is `create({ type: 'scene', children })`.
- Video, animation, audio: `playback`, `animations`, `audio` and `track`
  props; recipe and traps in `../handbook/video.md`.
- Scalar wrappers (`setOpacity`, …), `is*`/`supports*` predicates and
  editor-UI methods are in `signatures-extended.d.ts`, for reference only.

## Reference: `signatures.d.ts`

`signatures.d.ts`: the upstream CE.SDK surface `engine.design`
wraps (~2000 lines) — read it to understand a prop or enum, never to call
it. Types are flattened to their values. Class start lines:

| Class        | Start line |
| ------------ | ---------- |
| AssetAPI     | 817        |
| **BlockAPI** | **1128**   |
| EditorAPI    | 1353       |
| EventAPI     | 1499       |
| **SceneAPI** | **1627**   |
| VariableAPI  | 1856       |

## What is NOT in this file

- **Parameter semantics** — units, value ranges, defaults for optional
  parameters. Where a signature says only `r: number`, color components are
  in the range 0–1, never 0–255. For anything else a bare `number`/`string`
  leaves open, check the handbook's topic page before guessing.
- Recipes by topic → the handbook: `../handbook/print.md` (CMYK,
  spot colours, bleed, PDF/X), `../handbook/templates.md` (variables,
  bindings, placeholders, locking), `../handbook/video.md` and
  `../handbook/animation.md` (timeline, captions, animations).


---

# The edit-code API surface (docs/api/signatures.d.ts)

Everything edit code uses, inline below. The upstream CE.SDK core it wraps is the rest of that file — `signatures.d.ts` — reference only.

```typescript
// ============================================================================
// codesign extension: engine.design — the ONLY API `edit` code uses.
// engine.block/scene/variable/editor/asset/event are refused by the edit
// gate, which names the engine.design equivalent; the upstream classes after
// this section are reference only. One nested-props dialect replaces the
// typed accessors (setFloat/getBool/…), the per-property wrappers
// (setOpacity, setStrokeWidth, setPositionX, …) and the is*-state reads.
// Scene-wide state (variables, spotColors, scene.*) lives on the scene block.
//
// Attachment state (fill/shape/blur/effects/animations/transition) is the
// typed unions below — assign { type, ...props } specs via setProps.
//
// Units (lengths, paddings, stroke.width, shadows, margins): see the api
// skill; '50%' also sets '<leaf>Mode' to 'Percent'. letterSpacing is a FACTOR, never a length. lineHeight: write { visual: n }
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
// Tracks by leaf; at = seconds of the (host) block or '25%'; null removes: handbook#animation.md.
type Keyframes = { [leaf: string]: { at: number | string; value: unknown; easing?: string | object }[] | null };
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
     *  the name lands on the block and findByName resolves it later.
     *  A NEW document: create({ type: 'scene', props: { scene: { mode?:
     *  'Video', layout?, designUnit? }, variables?, spotColors? }, children:
     *  [pages] }) replaces the current scene; a page whose parent is the
     *  scene goes into its stack. */
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
    /** Editor settings, same dialect; SettingsProps is in signatures.d.ts. */
    setSettings(props: SettingsProps): Promise<void>;
    getSettings(select?: string[]): Promise<SettingsProps>;
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
    // Attachment values are the unions below (replaced blocks are destroyed):
    //   await setProps(id, { fill: { type: 'color', color: { value } } })
    //   await setProps(id, { fill: { enabled: false } })          // no type ⇒ host leaves
    //   Gradient fills round-trip stops; image fills round-trip sourceSet —
    //   getProps(id, ['fill']) → tweak → setProps is lossless.
    //   await setProps(id, { shape: { type: 'rect' } }) · { blur: { type: 'uniform' } }
    //   await setProps(id, { effects: [{ type: 'displacement_map', source: 'map' /* BlockRef */ }] })
    //   await setProps(id, { animations: { in: { type: 'slide', … } } })  // null detaches
    // TEXT is all props too, applied in canonical order (font → string →
    // styles → ranges) whatever the key order:
    //   await setProps(id, { text: { string, font: { typeface }, weight, case,
    //     listStyle, path, pathOffset, pathFlipped,
    //     ranges: [{ from, to, color?, weight?, style?, size?, case?, scriptStyle?,
    //       decoration?, kerning? }] } })
    // A string write WITHOUT other text styling auto-preserves existing
    // ranges; with styling, ranges reset (pass ranges to keep or ranges: []
    // to wipe); font/size/lineHeight writes auto-reshape. Read the per-run
    // truth via getProps(id, ['text.ranges']); paragraphs (read-only) carry
    // listStyle + listLevel.
    // CAPTIONS: page→captionTrack→caption, caption.* as text.*; style+layout TRACK-WIDE
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
     *  Rotated: x/y = pivot corner (the unrotated origin).
     *  textLines: visible line count; ink: { from, to } adds glyph ink boxes. Text only. */
    measure(id: BlockRef, opts?: { ink?: { from?: number; to?: number } }): Promise<{ x: number; y: number; width: number; height: number; textLines?: number; ink?: Array<{ x: number; y: number; width: number; height: number; baselineY: number }> }>;
    /** Await pending font/image loads for these subtrees (create does this itself). */
    loadResources(ids: BlockRef[]): Promise<void>;
    isGroupable(ids: BlockRef[]): Promise<boolean>;
    // Tree verbs, so edit code never needs a second dialect:
    appendChild(parent: BlockRef, child: BlockRef): Promise<void>;
    /** Re-slot an EXISTING block at a z-index (create takes { index } itself). */
    insertChild(parent: BlockRef, child: BlockRef, index: number): Promise<void>;
    getParent(id: BlockRef): Promise<DesignBlockId | null>;
    getChildren(id: BlockRef): Promise<DesignBlockId[]>;
    /** 'page' answers in document order. */
    findByType(type: DesignBlockType): Promise<DesignBlockId[]>;
    /** Blocks carrying this name. create writes a spec node's name onto the
     *  block, so this is how a LATER edit re-finds what an earlier made. */
    findByName(name: string): Promise<DesignBlockId[]>;
    group(ids: BlockRef[]): Promise<DesignBlockId>;
    ungroup(id: BlockRef): Promise<void>;
    duplicate(id: BlockRef): Promise<DesignBlockId>;
    destroy(id: BlockRef): Promise<void>;
    // Media and CoDesign services — what CE.SDK does not answer itself:
    /** A font and its metrics, by family (create's lookup) or uri; warms the
     *  cache text.lineHeight: { visual } reads. */
    font(spec: { family?: string; uri?: string; weight?: FontWeight; style?: FontStyle }): Promise<{ typeface?: Typeface; uri: string; contentArea: number; metrics: { ascender: number; descender: number; lineGap: number; unitsPerEm: number; capHeight: number; xHeight: number; underlineOffset: number; underlineSize: number } }>;
    /** Words of an asset_generate transcript (its transcriptUri) starting in [from, to) source seconds. */
    readTranscript(uri: string, range?: { from?: number; to?: number }): Promise<{ words: Array<{ text: string; start: number; end: number }> }>;
    /** An audio block's beats in PAGE seconds; bpm picks half/double tempo;
     *  bpm/fit null = no steady beat (cut on accents/onsets). */
    readBeats(id: BlockRef, opts?: { bpm?: number }): Promise<{ start: number; duration: number; bpm: number | null; requestedBpm: number | null; fit: { onsets: number; onGrid: number; meanErrMs: number } | null; beats: number[]; accents: number[]; onsets: Array<{ t: number; strength: number }> }>;
}
interface BuildSpec {
    type: DesignBlockType;
    /** Written onto the block; findByName(name) resolves it, in this edit
     *  and in every later one. */
    name?: string;
    /** Everything the block IS, attachments and the text subtree included;
     *  text.font: { family, weight } is looked up (create and setProps). */
    props?: BlockProps;
    children?: BuildSpec[];
}
// Capability matrix (measured against the engine; type-determined —
// no need to call supports* for blocks you created):
// capability        audio        caption      captionTrack cutout       graphic      group        page         text         track
// animation         ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓
// backgroundColor   ·            ✓            ·            ·            ·            ·            ·            ✓            ·
// blendMode         ·            ✓            ·            ·            ✓            ✓            ✓            ✓            ·
// blur              ·            ·            ·            ·            ✓            ✓            ✓            ·            ·
// contentFillMode   ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓            ✓
// crop              ·            ·            ·            ·            ✓            ·            ·            ·            ·
// dropShadow        ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·
// duration          ✓            ✓            ✓            ·            ✓            ✓            ✓            ✓            ✓
// effects           ·            ·            ·            ·            ✓            ·            ✓            ·            ·
// fill              ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·
// masks             ·            ✓            ·            ·            ✓            ✓            ·            ✓            ·
// opacity           ·            ✓            ·            ·            ✓            ✓            ·            ✓            ·
// placeholderBehavior·            ✓            ·            ·            ·            ·            ·            ✓            ·
// placeholderControls·            ·            ·            ✓            ✓            ·            ✓            ·            ·
// playbackControl   ✓            ·            ·            ·            ·            ·            ✓            ·            ·
// playbackTime      ✓            ·            ·            ·            ·            ·            ✓            ·            ·
// shape             ·            ·            ·            ·            ✓            ·            ·            ·            ·
// stroke            ·            ✓            ·            ·            ✓            ·            ✓            ✓            ·
// textAnimators     ·            ✓            ·            ·            ·            ·            ·            ✓            ·
// timeOffset        ✓            ✓            ✓            ·            ✓            ✓            ·            ✓            ✓
// trim              ✓            ·            ·            ·            ·            ·            ·            ·            ·

interface BlockProps {
    alwaysOnBottom?: boolean;
    alwaysOnTop?: boolean;
    animations?: { in?: Animation | null; loop?: Animation | null; out?: Animation | null };
    audio?: { fileURI?: string; totalDuration?: number };
    backgroundColor?: {
        color?: Color;
        cornerRadius?: number;
        enabled?: boolean;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
    };
    bindings?: { [leaf: string]: string | null };
    blend?: {
        mode?: 'PassThrough' | 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'LinearBurn' | 'DarkenColor' | 'Lighten' | 'Screen' | 'ColorDodge' | 'LinearDodge' | 'LightenColor' | 'Overlay' | 'SoftLight' | 'HardLight' | 'VividLight' | 'LinearLight' | 'PinLight' | 'HardMix' | 'Difference' | 'Exclusion' | 'Subtract' | 'Divide' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';
    };
    blur?: Blur | null;
    camera?: {
        pixelRatio?: number;
        resolution?: { height?: number; width?: number };
        zoomLevel?: number;
    };
    caption?: {
        animators?: TextAnimator[] /* in signatures.d.ts; [] clears */;
        automaticFontSizeEnabled?: boolean;
        clipLinesOutsideOfFrame?: boolean;
        color?: Color;
        font?: { family: string; weight?: FontWeight } | { typeface: Typeface; uri?: string };
        fontSize?: string /* '48px' */;
        horizontalAlignment?: 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
        letterSpacing?: number;
        lineHeight?: number | { visual: number };
        maxAutomaticFontSize?: number;
        minAutomaticFontSize?: number;
        paragraphSpacing?: number;
        pathFlipped?: boolean;
        pathOffset?: number;
        style?: string;
        subscriptFontScale?: number;
        subscriptVerticalShift?: number;
        superscriptFontScale?: number;
        superscriptVerticalShift?: number;
        text?: string;
        useContextualAlternates?: boolean;
        useContextualLigatures?: boolean;
        useDiscretionaryLigatures?: boolean;
        useKerning?: boolean;
        useLigatures?: boolean;
        verticalAlignment?: 'Top' | 'Bottom' | 'Center';
        weight?: string;
    };
    captionTrack?: { automaticallyManageBlockOffsets?: boolean };
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
    cutout?: { offset?: number; path?: string; smoothing?: number; type?: 'Solid' | 'Dashed' };
    dropShadow?: {
        blurRadius?: { x?: number; y?: number };
        clip?: boolean;
        color?: Color;
        enabled?: boolean;
        offset?: { x?: number; y?: number };
    };
    effects?: Effect[];
    exclusionArea?: { constrains?: boolean; punchOut?: boolean };
    fill?: Fill | null;
    flip?: { horizontal?: boolean; vertical?: boolean };
    globalBoundingBox?: { height?: number; width?: number; x?: number; y?: number };
    height?: number;
    heightMode?: 'Absolute' | 'Percent' | 'Auto';
    highlightEnabled?: boolean;
    includedInExport?: boolean;
    keyframes?: Keyframes | null;
    kind?: string;
    lastFrame?: { height?: number; width?: number; x?: number; y?: number };
    markers?: { name: string; time: number; duration?: number }[];
    masks?: Mask[];
    matte?: { source: BlockRef; mode?: 'Alpha' | 'AlphaInverted' | 'Luma' | 'LumaInverted' } | null;
    metadata?: { [key: string]: string | null } /* block tags; null deletes */;
    motionBlur?: { enabled?: boolean; samples?: number; shutterAngle?: number; shutterPhase?: number };
    movement?: { constraint?: number };
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
        margin?: { bottom?: number; left?: number; right?: number; top?: number };
        marginEnabled?: boolean;
        marginScale?: number;
        safetyEnabled?: boolean;
        safetyInset?: { bottom?: number; left?: number; right?: number; top?: number };
        titleTemplate?: string;
    };
    placeholder?: { enabled?: boolean };
    placeholderBehavior?: { enabled?: boolean };
    placeholderControls?: { showButton?: boolean; showOverlay?: boolean };
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
        colorConversionMode?: 'Managed' | 'Legacy';
        designUnit?: 'Pixel' | 'Millimeter' | 'Inch';
        dpi?: number;
        extendedPanningArea?: boolean;
        fontSizeUnit?: 'Pixel' | 'Point';
        frameRate?: number;
        layout?: 'Free' | 'VerticalStack' | 'HorizontalStack' | 'DepthStack';
        mode?: 'Design' | 'Video';
        pageDimensions?: { height?: number; width?: number };
        pageFormatId?: string;
        pixelScaleFactor?: number;
    };
    selected?: boolean;
    selectionEnabled?: boolean;
    shape?: Shape | null;
    spotColors?: { [ink: string]: { rgb?: { r: number; g: number; b: number }; cmyk?: { c: number; m: number; y: number; k: number }; cutout?: 'Solid' | 'Dashed' } | null } /* SCENE only: print inks */;
    stack?: { spacing?: number; spacingInScreenspace?: boolean };
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
        fill?: Fill | null /* paints the stroke instead of stroke.color: 'color', 'gradient/linear|radial|conical' or 'stripe'; graphic and page blocks; null = stroke.color again */;
        miterLimit?: number;
        overprint?: boolean;
        position?: 'Center' | 'Inner' | 'Outer';
        startCap?: 'Butt' | 'Round' | 'Square';
        style?: 'Dashed' | 'DashedRound' | 'Dotted' | 'LongDashed' | 'LongDashedRound' | 'Solid';
        width?: number;
    };
    subtitles?: string /* captionTrack, WRITE-only: SRT/VTT uri replaces its captions */;
    text?: {
        animators?: TextAnimator[] /* in signatures.d.ts; [] clears */;
        automaticFontSizeEnabled?: boolean;
        backgroundCornerRadius?: number;
        backgroundPadding?: { bottom?: number; left?: number; right?: number; top?: number };
        baselineShift?: number | string /* + up; per range: ranges[i] */;
        case?: string;
        clipLinesOutsideOfFrame?: boolean;
        color?: Color;
        decoration?: TextDecorationConfig;
        externalReference?: string;
        font?: { family: string; weight?: FontWeight; style?: string } /* create only: a lookup */ | { typeface: Typeface; uri?: string };
        fontFileUri?: string;
        fontSize?: string /* WRITE needs a unit: '64px' | '24pt'. READS answer a unit string too ('64px') — parseFloat() before any math, never .toFixed() on it */;
        hasClippedLines?: boolean;
        horizontalAlignment?: 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
        letterSpacing?: number;
        lineHeight?: number /* engine scale: multiplies the font's contentArea */ | { visual: number } /* CSS-style x fontSize — the facade converts per font */;
        lineHeightVisual?: number /* READ-ONLY, selected reads: lineHeight in CSS terms. Write via lineHeight: { visual } */;
        listStyle?: ListStyle /* whole block; nesting via paragraphs: [{ index, listLevel }] */;
        maxAutomaticFontSize?: number;
        minAutomaticFontSize?: number;
        paragraphs?: { index: number; from?: number; listStyle?: ListStyle; listLevel?: number; horizontalAlignment?: string; lineHeight?: number }[];
        paragraphSpacing?: number;
        path?: string /* SVG path baseline */ | { shape: 'circle'; diameter: number; align?: 'top' | 'bottom' | number } | null;
        pathExternalRef?: string;
        pathFlipped?: boolean /* true = underside, reversed direction */;
        pathOffset?: number /* proportional start offset along the path */;
        ranges?: { from: number; to: number; color?: Color; weight?: FontWeight; style?: string; size?: string /* px string */; case?: TextCase; scriptStyle?: ScriptStyle; baselineShift?: number | string; typeface?: Typeface; decoration?: TextDecorationConfig; kerning?: number }[];
        style?: string;
        subscriptFontScale?: number;
        subscriptVerticalShift?: number;
        superscriptFontScale?: number;
        superscriptVerticalShift?: number;
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
    track?: { automaticallyManageBlockOffsets?: boolean };
    transform?: {
        anchor?: { x?: number; y?: number };
        autoOrient?: boolean;
        hasAnchor?: boolean /* read-only */;
        scale?: { x?: number; y?: number };
        skew?: number;
        skewAxis?: number;
    };
    transformLocked?: boolean;
    transformParent?: BlockRef | null;
    transition?: { type: string /* push, slide, wipe, fade, cross-fade, … — a bad type lists all 20 */; duration?: number; easing?: string; [typeLeaves: string]: unknown } | null /* clip into next clip; leaves nest under the type */;
    type?: string;
    uuid?: string;
    variables?: { [name: string]: string | { color: Color } | { number: number } | { image: string } | { font: { family: string } } | { rename: string } | null };
    visible?: boolean;
    width?: number;
    widthMode?: 'Absolute' | 'Percent' | 'Auto';
}
// Attachments. The type field picks the arm, and the arm names every prop
// that type carries — nothing else applies. Assigning one whose type MATCHES
// what is already attached edits it in place; a different type replaces it.
// Each shorthand is also valid as '//ly.img.ubq/<slot>/<name>'.
type Fill = { enabled?: boolean; overprint?: boolean; keyframes?: Keyframes } & (
  | { type: 'color'; color?: { value?: Color } }
  | {
      type: 'gradient/linear';
      stops?: GradientColorStop[];
      gradient?: {
          linear?: { endPointX?: number; endPointY?: number; startPointX?: number; startPointY?: number };
      };
    }
  | {
      type: 'gradient/radial';
      stops?: GradientColorStop[];
      gradient?: {
          radial?: { centerPointX?: number; centerPointY?: number; focalX?: number; focalY?: number; radius?: number };
      };
    }
  | {
      type: 'gradient/conical';
      stops?: GradientColorStop[];
      gradient?: {
          conical?: { centerPointX?: number; centerPointY?: number };
      };
    }
  | {
      type: 'image';
      uri?: string /* shorthand for image.imageFileURI */;
      sourceSet?: Source[];
      image?: { externalReference?: string; imageFileURI?: string; previewFileURI?: string };
    }
  | {
      type: 'video';
      uri?: string /* shorthand for video.fileURI */;
      playback?: { trimOffset?: number; trimLength?: number; volume?: number };
      video?: { fileURI?: string; totalDuration?: number };
    }
  | { type: 'pixelStream'; pixelStream?: { orientation?: 'Up' | 'Down' | 'Left' | 'Right' | 'UpMirrored' | 'DownMirrored' | 'LeftMirrored' | 'RightMirrored' } }
  | { type: 'stripe'; stripe?: { angle?: number; color?: Color; gap?: number; width?: number } }
);
type Shape = { modifiers?: Modifier[] /* applied in order; [] clears */; keyframes?: Keyframes } & (
  | { type: 'rect'; rect?: { cornerRadiusBL?: number; cornerRadiusBR?: number; cornerRadiusTL?: number; cornerRadiusTR?: number } }
  | { type: 'line' }
  | { type: 'ellipse' }
  | { type: 'polygon'; polygon?: { cornerRadius?: number; sides?: number } }
  | { type: 'star'; star?: { cornerRadius?: number; innerDiameter?: number; innerRadius?: number; innerRoundness?: number; outerRadius?: number; outerRoundness?: number; points?: number; rotation?: number } }
  | { type: 'vector_path'; vector_path?: { cornerRadius?: number; fillRule?: 'EvenOdd' | 'NonZero'; height?: number; path?: string; width?: number } }
  | {
      type: 'compound';
      subshapes?: Subshape[] /* combined in order by compound.mode; [] clears */;
      compound?: {
          fillRule?: 'EvenOdd' | 'NonZero';
          height?: number;
          mode?: 'Merge' | 'Add' | 'Subtract' | 'Intersect' | 'Exclude';
          width?: number;
      };
    }
);
// Subshape and modifier angles are DEGREES; units: handbook#shapes.md.
type Subshape = Shape & { height?: number; rotation?: number; skew?: number; skewAxis?: number; width?: number; anchor?: { x?: number; y?: number }; position?: { x?: number; y?: number }; scale?: { x?: number; y?: number } };
type Modifier = { keyframes?: Keyframes } & (
  | { type: 'trim'; trim?: { end?: number; mode?: 'Simultaneous' | 'Individual'; offset?: number; start?: number } }
  | { type: 'repeater'; repeater?: { anchorX?: number; anchorY?: number; composite?: 'Below' | 'Above'; copies?: number; endOpacity?: number; offset?: number; positionX?: number; positionY?: number; rotation?: number; scaleX?: number; scaleY?: number; startOpacity?: number } }
  | { type: 'round_corners'; round_corners?: { radius?: number } }
  | { type: 'offset'; offset?: { amount?: number; join?: 'Bevel' | 'Miter' | 'Round'; miterLimit?: number } }
  | { type: 'zigzag'; zigzag?: { pointType?: 'Corner' | 'Smooth'; ridges?: number; size?: number } }
  | { type: 'pucker_bloat'; pucker_bloat?: { amount?: number } }
  | { type: 'twist'; twist?: { angle?: number; centerX?: number; centerY?: number } }
);
type Blur = { enabled?: boolean; keyframes?: Keyframes } & (
  | { type: 'uniform'; uniform?: { intensity?: number; mode?: 'Fill' | 'Block' } }
  | { type: 'linear'; linear?: { blurRadius?: number; x1?: number; x2?: number; y1?: number; y2?: number } }
  | { type: 'mirrored'; mirrored?: { blurRadius?: number; gradientSize?: number; size?: number; x1?: number; x2?: number; y1?: number; y2?: number } }
  | { type: 'radial'; radial?: { blurRadius?: number; gradientRadius?: number; radius?: number; x?: number; y?: number } }
);
type Effect = { enabled?: boolean; keyframes?: Keyframes } & (
  | { type: 'adjustments'; adjustments?: { blacks?: number; brightness?: number; clarity?: number; contrast?: number; exposure?: number; gamma?: number; highlights?: number; saturation?: number; shadows?: number; sharpness?: number; temperature?: number; whites?: number } }
  | { type: 'bulge'; bulge?: { centerX?: number; centerY?: number; height?: number; horizontalRadius?: number; verticalRadius?: number } }
  | { type: 'corner_pin'; corner_pin?: { lowerLeftX?: number; lowerLeftY?: number; lowerRightX?: number; lowerRightY?: number; upperLeftX?: number; upperLeftY?: number; upperRightX?: number; upperRightY?: number } }
  | { type: 'cross_cut'; cross_cut?: { offset?: number; slices?: number; speedV?: number; time?: number } }
  | { type: 'displacement_map'; displacement_map?: { horizontalChannel?: 'Red' | 'Green' | 'Blue' | 'Alpha' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'Full' | 'Half' | 'Off'; mapBehavior?: 'Center' | 'Stretch' | 'Tile'; maxHorizontal?: number; maxVertical?: number; verticalChannel?: 'Red' | 'Green' | 'Blue' | 'Alpha' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'Full' | 'Half' | 'Off'; wrapPixels?: boolean } }
  | { type: 'dot_pattern'; dot_pattern?: { blur?: number; dots?: number; size?: number } }
  | { type: 'duotone_filter'; duotone_filter?: { darkColor?: Color; intensity?: number; lightColor?: Color } }
  | { type: 'extrude_blur'; extrude_blur?: { amount?: number } }
  | { type: 'fill'; fill?: { color?: Color; opacity?: number } }
  | { type: 'glow'; glow?: { amount?: number; darkness?: number; size?: number } }
  | { type: 'green_screen'; green_screen?: { colorMatch?: number; fromColor?: Color; smoothness?: number; spill?: number } }
  | { type: 'half_tone'; half_tone?: { angle?: number; scale?: number } }
  | { type: 'invert'; invert?: { channel?: 'RGB' | 'Red' | 'Green' | 'Blue' | 'HLS' | 'Hue' | 'Lightness' | 'Saturation' | 'YIQ' | 'Luma' | 'InPhaseChroma' | 'QuadratureChroma' | 'Alpha' } }
  | { type: 'levels'; levels?: { alphaGamma?: number; alphaInBlack?: number; alphaInWhite?: number; alphaOutBlack?: number; alphaOutWhite?: number; blueGamma?: number; blueInBlack?: number; blueInWhite?: number; blueOutBlack?: number; blueOutWhite?: number; clipToOutBlack?: boolean; clipToOutWhite?: boolean; greenGamma?: number; greenInBlack?: number; greenInWhite?: number; greenOutBlack?: number; greenOutWhite?: number; redGamma?: number; redInBlack?: number; redInWhite?: number; redOutBlack?: number; redOutWhite?: number; rgbGamma?: number; rgbInBlack?: number; rgbInWhite?: number; rgbOutBlack?: number; rgbOutWhite?: number } }
  | { type: 'linear_wipe'; linear_wipe?: { angle?: number; completion?: number; feather?: number } }
  | { type: 'linocut'; linocut?: { scale?: number } }
  | { type: 'liquid'; liquid?: { amount?: number; scale?: number; time?: number } }
  | { type: 'lut_filter'; lut_filter?: { filterId?: string; horizontalTileCount?: number; intensity?: number; lutFileURI?: string; verticalTileCount?: number } }
  | { type: 'mirror'; mirror?: { side?: number } }
  | { type: 'outliner'; outliner?: { amount?: number; passthrough?: number } }
  | { type: 'pixelize'; pixelize?: { horizontalPixelSize?: number; verticalPixelSize?: number } }
  | { type: 'posterize'; posterize?: { levels?: number } }
  | { type: 'radial_pixel'; radial_pixel?: { radius?: number; segments?: number } }
  | { type: 'radial_wipe'; radial_wipe?: { centerX?: number; centerY?: number; completion?: number; direction?: 'Clockwise' | 'Counterclockwise' | 'Both'; feather?: number; startAngle?: number } }
  | { type: 'recolor'; recolor?: { brightnessMatch?: number; colorMatch?: number; fromColor?: Color; smoothness?: number; toColor?: Color } }
  | { type: 'sharpie' }
  | { type: 'shift_channels'; shift_channels?: { takeAlphaFrom?: 'Alpha' | 'Red' | 'Green' | 'Blue' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'FullOn' | 'FullOff'; takeBlueFrom?: 'Alpha' | 'Red' | 'Green' | 'Blue' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'FullOn' | 'FullOff'; takeGreenFrom?: 'Alpha' | 'Red' | 'Green' | 'Blue' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'FullOn' | 'FullOff'; takeRedFrom?: 'Alpha' | 'Red' | 'Green' | 'Blue' | 'Luminance' | 'Hue' | 'Lightness' | 'Saturation' | 'FullOn' | 'FullOff' } }
  | { type: 'shifter'; shifter?: { amount?: number; angle?: number } }
  | { type: 'stroke'; stroke?: { allMasks?: boolean; brushSize?: number; color?: Color; end?: number; hardness?: number; maskIndex?: number; opacity?: number; paintStyle?: 'OnOriginalImage' | 'OnTransparent'; spacing?: number; start?: number } }
  | { type: 'threshold'; threshold?: { level?: number } }
  | { type: 'tilt_shift'; tilt_shift?: { amount?: number; position?: number } }
  | { type: 'tint'; tint?: { amount?: number; mapBlackTo?: Color; mapWhiteTo?: Color } }
  | { type: 'tritone'; tritone?: { amount?: number; highlights?: Color; midtones?: Color; shadows?: Color } }
  | { type: 'tv_glitch'; tv_glitch?: { distortion?: number; distortion2?: number; rollSpeed?: number; speed?: number } }
  | { type: 'venetian_blinds'; venetian_blinds?: { completion?: number; direction?: number; feather?: number; width?: number } }
  | { type: 'vignette'; vignette?: { darkness?: number; offset?: number } }
  | { type: 'wave_warp'; wave_warp?: { direction?: number; height?: number; phase?: number; waveType?: 'Sine' | 'Square' | 'Triangle' | 'Sawtooth'; width?: number } }
);
type Mask = { shape: Shape | Shape['type']; expansion?: number; feather?: number; inverted?: boolean; mode?: 'Add' | 'Subtract' | 'Intersect' | 'Lighten' | 'Darken' | 'Difference' | 'None'; opacity?: number; keyframes?: Keyframes };
type Animation = { duration?: number; easing?: string; writingStyle?: string; overlap?: number } & (
  | { type: 'slide'; slide?: { direction?: number; fade?: boolean } }
  | { type: 'pan'; pan?: { direction?: number; distance?: number; fade?: boolean } }
  | { type: 'fade' }
  | { type: 'blur'; blur?: { fade?: boolean; intensity?: number } }
  | { type: 'grow'; grow?: { direction?: 'Horizontal' | 'Vertical' | 'All' | 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight'; scaleFactor?: number } }
  | { type: 'zoom'; zoom?: { fade?: boolean } }
  | { type: 'pop' }
  | { type: 'wipe'; wipe?: { direction?: 'Up' | 'Right' | 'Down' | 'Left' } }
  | { type: 'baseline'; baseline?: { direction?: 'Up' | 'Right' | 'Down' | 'Left' } }
  | { type: 'crop_zoom'; crop_zoom?: { fade?: boolean; scale?: number } }
  | { type: 'spin'; spin?: { direction?: 'Clockwise' | 'CounterClockwise'; fade?: boolean; intensity?: number } }
  | { type: 'spin_loop'; spin_loop?: { direction?: 'Clockwise' | 'CounterClockwise' } }
  | { type: 'fade_loop' }
  | { type: 'blur_loop'; blur_loop?: { intensity?: number } }
  | { type: 'pulsating_loop'; pulsating_loop?: { intensity?: number } }
  | { type: 'breathing_loop'; breathing_loop?: { intensity?: number } }
  | { type: 'jump_loop'; jump_loop?: { direction?: 'Up' | 'Right' | 'Down' | 'Left'; intensity?: number } }
  | { type: 'squeeze_loop' }
  | { type: 'sway_loop'; sway_loop?: { intensity?: number } }
  | { type: 'scale_loop' }
  | { type: 'typewriter_text'; typewriter_text?: { writingStyle?: 'Character' | 'Word' } }
  | { type: 'block_swipe_text'; block_swipe_text?: { blockColor?: Color; direction?: 'Up' | 'Right' | 'Down' | 'Left'; useTextColor?: boolean } }
  | { type: 'spread_text'; spread_text?: { fade?: boolean; intensity?: number } }
  | { type: 'merge_text'; merge_text?: { direction?: 'Right' | 'Left'; intensity?: number } }
  | { type: 'ken_burns'; ken_burns?: { direction?: 'Up' | 'Right' | 'Down' | 'Left'; fade?: boolean; travelDistanceRatio?: number; zoomIntensity?: number } }
);
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
type DesignBlockType = 'scene' | 'stack' | 'camera' | 'page' | 'graphic' | 'audio' | 'text' | 'group' | 'cutout' | 'track' | 'caption' | 'captionTrack' | 'exclusionArea'; // each also valid as '//ly.img.ubq/<name>'
type FontStyle = 'normal' | 'italic';
type FontWeight = 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'heavy';
type ListStyle = 'None' | 'Unordered' | 'Ordered';
type Scope = 'text/edit' | 'text/character' | 'fill/change' | 'fill/changeType' | 'stroke/change' | 'shape/change' | 'layer/move' | 'layer/resize' | 'layer/rotate' | 'layer/flip' | 'layer/crop' | 'layer/opacity' | 'layer/blendMode' | 'layer/visibility' | 'layer/clipping' | 'appearance/adjustments' | 'appearance/filter' | 'appearance/effect' | 'appearance/blur' | 'appearance/shadow' | 'appearance/animation' | 'lifecycle/destroy' | 'lifecycle/duplicate' | 'editor/add' | 'editor/select';
type ScriptStyle = 'Normal' | 'Superscript' | 'Subscript';
type TextCase = 'Normal' | 'Uppercase' | 'Lowercase' | 'Titlecase';
type TextDecorationLine = 'None' | 'Underline' | 'Strikethrough' | 'Overline';
type TextDecorationStyle = 'Solid' | 'Double' | 'Dotted' | 'Dashed' | 'Wavy';
```
