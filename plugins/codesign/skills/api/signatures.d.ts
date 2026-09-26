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
        backgroundCornerRadius?: number;
        backgroundPadding?: {
            bottom?: number;
            left?: number;
            right?: number;
            top?: number;
        };
        clipLinesOutsideOfFrame?: boolean;
        externalReference?: string;
        fontFileUri?: string;
        fontSize?: number;
        hasClippedLines?: boolean;
        horizontalAlignment?: 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
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
    exclusionArea?: {
        constrains?: boolean;
        punchOut?: boolean;
    };
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
        safetyEnabled?: boolean;
        safetyInset?: {
            bottom?: number;
            left?: number;
            right?: number;
            top?: number;
        };
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
        colorConversionMode?: 'Managed' | 'Legacy';
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
        backgroundCornerRadius?: number;
        backgroundPadding?: {
            bottom?: number;
            left?: number;
            right?: number;
            top?: number;
        };
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
  | {
      type: 'stripe';
      stripe?: {
          angle?: number;
          color?: Color;
          gap?: number;
          width?: number;
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
    dragToSwapFills?: {
        enabled?: boolean;
        longPressDurationMs?: number;
    };
    errorStateColor?: Color;
    fallbackCMYKProfileUri?: string;
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
        exclusionAreaFillColor?: Color;
        exclusionAreaFrameColor?: Color;
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
        safetyFillColor?: Color;
        safetyFrameColor?: Color;
        safetyRevealDuringTransform?: boolean;
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
type DesignBlockType = 'scene' | 'stack' | 'camera' | 'page' | 'graphic' | 'audio' | 'text' | 'group' | 'cutout' | 'track' | 'caption' | 'captionTrack' | 'exclusionArea'; // each also valid as '//ly.img.ubq/<name>'
type FontStyle = 'normal' | 'italic';
type FontWeight = 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'heavy';
type ListStyle = 'None' | 'Unordered' | 'Ordered';
type Scope = 'text/edit' | 'text/character' | 'fill/change' | 'fill/changeType' | 'stroke/change' | 'shape/change' | 'layer/move' | 'layer/resize' | 'layer/rotate' | 'layer/flip' | 'layer/crop' | 'layer/opacity' | 'layer/blendMode' | 'layer/visibility' | 'layer/clipping' | 'appearance/adjustments' | 'appearance/filter' | 'appearance/effect' | 'appearance/blur' | 'appearance/shadow' | 'appearance/animation' | 'lifecycle/destroy' | 'lifecycle/duplicate' | 'editor/add' | 'editor/select';
type TextCase = 'Normal' | 'Uppercase' | 'Lowercase' | 'Titlecase';
type TextDecorationLine = 'None' | 'Underline' | 'Strikethrough' | 'Overline';
type TextDecorationStyle = 'Solid' | 'Double' | 'Dotted' | 'Dashed' | 'Wavy';

// ============================================================================
// Upstream CE.SDK surface (flattened) follows. For scalar block/settings
// state, prefer engine.design above; use engine.block.* for structure
// (create/appendChild via engine.design.create, group, text ranges,
// fills/effects attachment, export) and everything BlockProps lacks.
// ============================================================================
// Scalar get/set wrappers (setOpacity, setStrokeWidth, setPositionX, …),
// is*/supports*/has* predicates, and editor-UI machinery are in
// signatures-extended.d.ts — prefer engine.design.setProps/getProps/
// getCapabilities and the capability matrix above; search the sibling
// file signatures-extended.d.ts when you need the old names.

// CE.SDK CreativeEngine — flattened API signatures. GENERATED by
// scripts/lib/api-signatures.ts from the @cesdk/node index.d.ts; do not
// edit. JSDoc is stripped, deprecated overloads with a surviving
// namesake are dropped, and type aliases are flattened to their literal
// unions so every string vocabulary is one lookup. Conceptual docs live
// in the `guide` skill; this file is the exact call surface.
type AddImageOptions = {
    sizeMode?: SizeMode;
    positionMode?: PositionMode;
    x?: number;
    y?: number;
    cornerRadius?: number;
    size?: number | {
        width: number;
        height: number;
    };
    timeline?: {
        timeOffset?: number;
        duration?: number;
    };
    shadow?: DropShadowOptions;
    animation?: AnimationOptions;
};
interface AddVideoOptions {
    sizeMode?: SizeMode;
    positionMode?: PositionMode;
    x?: number;
    y?: number;
    cornerRadius?: number;
    timeline?: {
        timeOffset?: number;
        duration?: number;
    };
    shadow?: DropShadowOptions;
    animation?: AnimationOptions;
}
type AnimationEasing = 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
type AnimationEntry = {
    type: AnimationType;
    duration: number;
    easing?: AnimationEasing;
};
type AnimationOptions = {
    in?: AnimationEntry;
    loop?: AnimationEntry;
    out?: AnimationEntry;
};
type AnimationType = 'slide' | 'pan' | 'fade' | 'blur' | 'grow' | 'zoom' | 'pop' | 'wipe' | 'baseline' | 'crop_zoom' | 'spin' | 'spin_loop' | 'fade_loop' | 'blur_loop' | 'pulsating_loop' | 'breathing_loop' | 'jump_loop' | 'squeeze_loop' | 'sway_loop' | 'scale_loop' | 'typewriter_text' | 'block_swipe_text' | 'spread_text' | 'merge_text' | 'ken_burns'; // each also valid as '//ly.img.ubq/animation/<name>'
type AnimationTypeLonghand = `//ly.img.ubq/animation/${AnimationTypeShorthand}`;
type AnimationTypeShorthand = 'slide' | 'pan' | 'fade' | 'blur' | 'grow' | 'zoom' | 'pop' | 'wipe' | 'baseline' | 'crop_zoom' | 'spin' | 'spin_loop' | 'fade_loop' | 'blur_loop' | 'pulsating_loop' | 'breathing_loop' | 'jump_loop' | 'squeeze_loop' | 'sway_loop' | 'scale_loop' | 'typewriter_text' | 'block_swipe_text' | 'spread_text' | 'merge_text' | 'ken_burns';
interface ApplyAssetOptions {
    clipType?: 'clip' | 'overlay';
    placement?: AssetPlacement;
    [key: string]: unknown;
}
interface Asset {
    id: string;
    groups?: AssetGroups;
    meta?: AssetMetaData;
    payload?: AssetPayload;
}
class AssetAPI {
    #private;
    addSource(source: AssetSource): void;
    addLocalSource(id: string, supportedMimeTypes?: string[], applyAsset?: (asset: CompleteAssetResult) => Promise<DesignBlockId | undefined>, applyAssetToBlock?: (asset: CompleteAssetResult, block: DesignBlockId) => Promise<void>): void;
    addLocalAssetSourceFromJSONString(contentJSON: string, basePath?: string, options?: {
        matcher?: string[];
    }): Promise<string>;
    addLocalAssetSourceFromJSONURI(contentURI: string, options?: {
        matcher?: string[];
    }): Promise<string>;
    removeSource(id: string): void;
    findAllSources(): string[];
    findAssets(sourceId: string, query: AssetQueryData): Promise<AssetsQueryResult<CompleteAssetResult>>;
    fetchAsset(sourceId: string, assetId: string, params?: Pick<AssetQueryData, 'locale'>): Promise<CompleteAssetResult | null>;
    getSupportedMimeTypes(sourceId: string): string[];
    /** @deprecated The flag this reads is deprecated. To control whether an upload button is rendered, use the `canAdd` option on an asset library entry instead. */
    canManageAssets(sourceId: string): boolean;
    addAssetToSource(sourceId: string, asset: AssetDefinition): void;
    removeAssetFromSource(sourceId: string, assetId: string): void;
    apply(sourceId: string, assetResult: AssetResult, options?: ApplyAssetOptions): Promise<DesignBlockId | undefined>;
    applyToBlock(sourceId: string, assetResult: AssetResult, block: DesignBlockId): Promise<void>;
    applyProperty(sourceId: string, assetResult: AssetResult, property: AssetProperty): Promise<void>;
    defaultApplyAsset(assetResult: AssetResult, options?: DefaultApplyAssetOptions): Promise<DesignBlockId | undefined>;
    defaultApplyAssetToBlock(assetResult: AssetResult, block: DesignBlockId): Promise<void>;
    onAssetSourceAdded: (callback: (sourceID: string) => void) => (() => void);
    onAssetSourceRemoved: (callback: (sourceID: string) => void) => (() => void);
    onAssetSourceUpdated: (callback: (sourceID: string) => void) => (() => void);
}
interface AssetBooleanProperty {
    property: string;
    type: 'Boolean';
    value: boolean;
    defaultValue: boolean;
}
interface AssetCMYKColor {
    colorSpace: 'CMYK';
    c: number;
    m: number;
    y: number;
    k: number;
}
type AssetColor = AssetRGBColor | AssetCMYKColor | AssetSpotColor;
interface AssetColorProperty {
    property: string;
    type: 'Color';
    value: Color;
    defaultValue: Color;
}
interface AssetContentAspectRatio {
    type: 'ContentAspectRatio';
}
interface AssetDefinition extends Asset {
    label?: Record<Locale, string>;
    tags?: Record<Locale, string[]>;
}
interface AssetEnumProperty {
    property: string;
    type: 'Enum';
    value: string;
    defaultValue: string;
    options: string[];
}
type AssetFacetPath = 'tags' | 'groups' | `meta.${string}`;
interface AssetFacetValue {
    value: string;
    count?: number;
}
type AssetFilter = AssetPropertyFilter | {
    and: AssetFilter[];
    or?: never;
    not?: never;
    property?: never;
} | {
    or: AssetFilter[];
    and?: never;
    not?: never;
    property?: never;
} | {
    not: AssetFilter;
    and?: never;
    or?: never;
    property?: never;
};
interface AssetFixedAspectRatio {
    type: 'FixedAspectRatio';
    width: number;
    height: number;
}
interface AssetFixedSize {
    type: 'FixedSize';
    width: number;
    height: number;
    designUnit: DesignUnit;
}
interface AssetFreeAspectRatio {
    type: 'FreeAspectRatio';
}
type AssetGroups = string[];
type AssetMetaData = {
    mimeType?: string;
    blockType?: string;
    fillType?: string;
    shapeType?: string;
    kind?: string;
    uri?: string;
    thumbUri?: string;
    previewUri?: string;
    sourceSet?: Source[];
    filename?: string;
    vectorPath?: string;
    width?: number;
    height?: number;
    duration?: string;
    effectType?: string;
    blurType?: string;
    looping?: boolean;
} & Record<string, unknown>;
interface AssetNumberProperty {
    property: string;
    type: 'Int' | 'Float' | 'Double';
    value: number;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
}
interface AssetPayload {
    color?: AssetColor;
    sourceSet?: Source[];
    typeface?: Typeface;
    transformPreset?: AssetTransformPreset;
    properties?: AssetProperty[];
    stylePreset?: AssetStylePreset;
}
interface AssetPlacement {
    parent?: DesignBlockId;
    center?: {
        x: number;
        y: number;
    };
}
type AssetProperty = AssetBooleanProperty | AssetColorProperty | AssetEnumProperty | AssetNumberProperty | AssetStringProperty;
type AssetPropertyFilter = {
    property: AssetPropertyPath;
} & ({
    contains: string;
    equals?: never;
} | {
    equals: string;
    contains?: never;
});
type AssetPropertyPath = 'label' | 'tags' | 'id' | 'groups' | `meta.${string}`;
interface AssetQueryData {
    query?: string;
    page: number;
    tags?: string | string[];
    groups?: AssetGroups;
    excludeGroups?: AssetGroups;
    locale?: Locale;
    perPage: number;
    sortingOrder?: SortingOrder;
    sortKey?: string;
    sortActiveFirst?: boolean;
    filter?: AssetFilter[];
    facets?: AssetFacetPath[];
}
interface AssetResult extends Asset {
    locale?: Locale;
    label?: string;
    tags?: string[];
    active?: boolean;
    credits?: {
        name: string;
        url?: string;
    };
    license?: {
        name: string;
        url?: string;
    };
    utm?: {
        source?: string;
        medium?: string;
    };
}
interface AssetRGBColor {
    colorSpace: 'sRGB';
    r: number;
    g: number;
    b: number;
}
interface AssetSource {
    id: string;
    findAssets(queryData: AssetQueryData): Promise<AssetsQueryResult | undefined>;
    fetchAsset?: (id: string, params?: Pick<AssetQueryData, 'locale'>) => Promise<AssetResult | null>;
    getGroups?: () => Promise<string[]>;
    credits?: {
        name: string;
        url?: string;
    };
    license?: {
        name: string;
        url?: string;
    };
    /** @deprecated Will be removed in v1.11. Use `canAdd` and `canRemove` in the asset library configuration */
    canManageAssets?: boolean;
    applyAsset?: (asset: CompleteAssetResult) => Promise<DesignBlockId | undefined>;
    applyAssetToBlock?: (asset: CompleteAssetResult, block: DesignBlockId) => Promise<void>;
    applyAssetProperty?: (asset: CompleteAssetResult, property: AssetProperty) => Promise<void>;
    addAsset?(asset: AssetDefinition): void;
    removeAsset?(assetId: string): void;
    getSupportedMimeTypes?(): string[] | undefined;
}
interface AssetSpotColor {
    colorSpace: 'SpotColor';
    name: string;
    externalReference: string;
    representation: AssetRGBColor | AssetCMYKColor;
}
interface AssetsQueryResult<T extends AssetResult = AssetResult> {
    assets: T[];
    currentPage: number;
    nextPage?: number;
    total: number;
    facets?: {
        [path: string]: AssetFacetValue[];
    };
}
interface AssetStringProperty {
    property: string;
    type: 'String';
    value: string;
    defaultValue: string;
}
interface AssetStylePreset {
    blockType?: '//ly.img.ubq/text' | '//ly.img.ubq/caption';
    mode?: 'replace' | 'merge';
    typeface?: {
        family: string;
        weight?: FontWeight;
        style?: FontStyle;
    };
    fontSize?: {
        scale: number;
        resizeExistingOnApply?: boolean;
    };
    scaleWithFontSize?: Array<{
        property: AssetStylePresetScalableProperty;
        ratio: number;
    }>;
    properties?: AssetStylePresetProperties;
    inAnimation?: AssetStylePresetAnimation;
    outAnimation?: AssetStylePresetAnimation;
    loopAnimation?: AssetStylePresetAnimation;
}
interface AssetStylePresetAnimation {
    type: AnimationTypeLonghand;
    properties?: AssetStylePresetAnimationProperties;
}
type AssetStylePresetAnimationProperties = {
    [K in Extract<BoolPropertyName, `animation/${string}`>]?: boolean;
} & {
    [K in Extract<EnumPropertyName, `animation/${string}`>]?: string;
} & {
    [K in Extract<FloatPropertyName, `animation/${string}`>]?: number;
} & {
    [K in Extract<ColorPropertyName, `animation/${string}`>]?: RGBColor | RGBAColor;
} & {
    'playback/duration'?: number;
    animationEasing?: string;
    textWritingStyle?: string;
    textWritingOverlap?: number;
} & {
    [path: string]: AssetStylePresetPropertyValue;
};
type AssetStylePresetProperties = {
    [K in BoolPropertyName as string extends K ? never : K]?: boolean;
} & {
    [K in IntPropertyName as string extends K ? never : K]?: number;
} & {
    [K in FloatPropertyName as string extends K ? never : K]?: number;
} & {
    [K in DoublePropertyName as string extends K ? never : K]?: number;
} & {
    [K in StringPropertyName as string extends K ? never : K]?: string;
} & {
    [K in EnumPropertyName as string extends K ? never : K]?: string;
} & {
    [K in ColorPropertyName as string extends K ? never : K]?: RGBColor | RGBAColor;
} & {
    'text/path'?: string | null;
} & {
    [path: string]: AssetStylePresetPropertyValue;
};
type AssetStylePresetPropertyValue = boolean | number | string | RGBColor | RGBAColor | null;
type AssetStylePresetScalableProperty = 'stroke/width' | 'dropShadow/offset/x' | 'dropShadow/offset/y' | 'dropShadow/blurRadius/x' | 'dropShadow/blurRadius/y' | 'backgroundColor/cornerRadius';
type AssetTransformPreset = AssetFixedAspectRatio | AssetFreeAspectRatio | AssetContentAspectRatio | AssetFixedSize;
type AsyncURIResolver = (URI: string, defaultURIResolver: (URI: string) => string) => Promise<string> | string;
class BlockAPI {
    #private;
    getDominantColors(handle: DesignBlockId, options?: DominantColorsOptions): Promise<DominantColor[]>;
    onSelectionChanged: (callback: () => void) => (() => void);
    onClicked: (callback: (id: DesignBlockId) => void) => (() => void);
    enterGroup(id: DesignBlockId): void;
    exitGroup(id: DesignBlockId): void;
    isCombinable(ids: DesignBlockId[]): boolean;
    combine(ids: DesignBlockId[], op: BooleanOperation): DesignBlockId;
    findByKind(kind: string): DesignBlockId[];
    findAll(): DesignBlockId[];
    findAllPlaceholders(): DesignBlockId[];
    findAllUnused(): DesignBlockId[];
    findAllInExclusionAreas(): DesignBlockId[];
    isLineOrigin(id: DesignBlockId): boolean;
    isValid(id: DesignBlockId): boolean;
    referencesAnyVariables(id: DesignBlockId): boolean;
    getScreenSpaceBoundingBoxXYWH(ids: DesignBlockId[]): XYWH;
    findAllProperties(id: DesignBlockId): string[];
    isPropertyReadable(property: string): boolean;
    isPropertyWritable(property: string): boolean;
    getPropertyType(property: string): PropertyType;
    getEnumValues<T = string>(enumProperty: string): T[];
    /** @deprecated Use getColor() instead. */
    getColorSpotName(id: DesignBlockId, property: string): string;
    /** @deprecated Use getColor() instead. */
    getColorSpotTint(id: DesignBlockId, property: string): number;
    getSourceSet(id: DesignBlockId, property: SourceSetPropertyName): Source[];
    addVideoFileURIToSourceSet(id: DesignBlockId, property: SourceSetPropertyName, uri: string): Promise<void>;
    isCropAspectRatioLocked(id: DesignBlockId): boolean;
    canRevertToOriginalRatio(id: DesignBlockId): boolean;
    isEffectEnabled(effectId: DesignBlockId): boolean;
    createCutoutFromBlocks(ids: DesignBlockId[], vectorizeDistanceThreshold?: number, simplifyDistanceThreshold?: number, useExistingShapeInformation?: boolean): DesignBlockId;
    createCutoutFromPath(path: string): DesignBlockId;
    createCutoutFromOperation(ids: DesignBlockId[], op: CutoutOperation): DesignBlockId;
    removeText(id: DesignBlockId, from?: number, to?: number): void;
    getTextColors(id: DesignBlockId, from?: number, to?: number): Array<Color>;
    setTextBackgroundColor(id: DesignBlockId, color: Color, from?: number, to?: number): void;
    getTextBackgroundColors(id: DesignBlockId, from?: number, to?: number): Array<Color>;
    getTextFontWeights(id: DesignBlockId, from?: number, to?: number): FontWeight[];
    getTextFontSizes(id: DesignBlockId, options?: TextFontSizeOptions): number[];
    getTextFontStyles(id: DesignBlockId, from?: number, to?: number): FontStyle[];
    getTextDecorations(id: DesignBlockId, from?: number, to?: number): TextDecorationConfig[];
    canToggleBoldFont(id: DesignBlockId, from?: number, to?: number): boolean;
    canToggleItalicFont(id: DesignBlockId, from?: number, to?: number): boolean;
    getTypeface(id: DesignBlockId): Typeface;
    getTypefaces(id: DesignBlockId, from?: number, to?: number): Typeface[];
    getTextCursorRange(): Range_2;
    setTextCursorRange(range: Range_2): void;
    getTextVisibleLineGlobalBoundingBoxXYWH(id: DesignBlockId, lineIndex: number): XYWH;
    getTextVisibleLineContent(id: DesignBlockId, lineIndex: number): string;
    getTextCharacterInkBoxes(id: DesignBlockId, from?: number, to?: number): CharacterInkBox[];
    getTextEffectiveHorizontalAlignment(id: DesignBlockId): 'Left' | 'Right' | 'Center' | 'Justify';
    setPlaceholderControlsOverlayEnabled(id: DesignBlockId, enabled: boolean): void;
    isPlaceholderControlsOverlayEnabled(id: DesignBlockId): boolean;
    setPlaceholderControlsButtonEnabled(id: DesignBlockId, enabled: boolean): void;
    isPlaceholderControlsButtonEnabled(id: DesignBlockId): boolean;
    setMetadata(id: DesignBlockId, key: string, value: string): void;
    getMetadata(id: DesignBlockId, key: string): string;
    findAllMetadata(id: DesignBlockId): string[];
    removeMetadata(id: DesignBlockId, key: string): void;
    setPageDurationSource(page: DesignBlockId, id: DesignBlockId): void;
    isPageDurationSource(id: DesignBlockId): boolean;
    removePageDurationSource(id: DesignBlockId): void;
    split(id: DesignBlockId, atTime: number, options?: SplitOptions): DesignBlockId;
    /** @deprecated Use `getDuration` and pass a page block. */
    getTotalSceneDuration(scene: DesignBlockId): number;
    isVisibleAtCurrentPlaybackTime(id: DesignBlockId): boolean;
    isForceMuted(id: DesignBlockId): boolean;
    setAudioFadeIn(id: DesignBlockId, duration: number, easing?: AnimationEasing): void;
    setAudioFadeOut(id: DesignBlockId, duration: number, easing?: AnimationEasing): void;
    forceLoadAVResource(id: DesignBlockId): Promise<void>;
    unstable_isAVResourceLoaded(id: DesignBlockId): boolean;
    getAVResourceTotalDuration(id: DesignBlockId): number;
    getVideoWidth(id: DesignBlockId): number;
    getVideoHeight(id: DesignBlockId): number;
    generateVideoThumbnailSequence(id: DesignBlockId, thumbnailHeight: number, timeBegin: number, timeEnd: number, numberOfFrames: number, onFrame: (frameIndex: number, result: ImageData | Error) => void): () => void;
    generateAudioThumbnailSequence(id: DesignBlockId, samplesPerChunk: number, timeBegin: number, timeEnd: number, numberOfSamples: number, numberOfChannels: number, onChunk: (chunkIndex: number, result: Float32Array | Error) => void): () => void;
    /** @deprecated Use `generateVideoThumbnailSequence` instead. */
    getVideoFillThumbnail(id: DesignBlockId, thumbnailHeight: number): Promise<Blob>;
    /** @deprecated Use `generateVideoThumbnailSequence` instead. */
    getVideoFillThumbnailAtlas(id: DesignBlockId, numberOfColumns: number, numberOfRows: number, thumbnailHeight: number): Promise<Blob>;
    /** @deprecated Use `generateVideoThumbnailSequence` instead. */
    getPageThumbnailAtlas(id: DesignBlockId, numberOfColumns: number, numberOfRows: number, thumbnailHeight: number): Promise<Blob>;
    createTransition(type: TransitionType): DesignBlockId;
    setTransition(id: DesignBlockId, transition: DesignBlockId): void;
    removeTransition(id: DesignBlockId): void;
    getTransition(id: DesignBlockId): DesignBlockId;
    setNativePixelBuffer(id: number, buffer: HTMLCanvasElement | HTMLVideoElement): void;
    getState(id: DesignBlockId): BlockState;
    setState(id: DesignBlockId, state: BlockState): void;
    onStateChanged: (ids: DesignBlockId[], callback: (ids: DesignBlockId[]) => void) => (() => void);
    addImage(url: string, options?: AddImageOptions): Promise<DesignBlockId>;
    addVideo(url: string, width: number, height: number, options?: AddVideoOptions): Promise<DesignBlockId>;
    applyAnimation(block: DesignBlockId, animation?: AnimationOptions): void;
    applyDropShadow(block: DesignBlockId, options?: DropShadowOptions): void;
    generateThumbnailAtTimeOffset(height: number, time: number): Promise<Blob>;
    getBackgroundTrack(): DesignBlockId | null;
    moveToBackgroundTrack(block: DesignBlockId): void;
}
interface BlockEvent {
    block: DesignBlockId;
    type: 'Created' | 'Updated' | 'Destroyed';
}
type BlockState = BlockStateError | BlockStatePending | BlockStateReady;
interface BlockStateError {
    type: 'Error';
    error: 'AudioDecoding' | 'ImageDecoding' | 'FileFetch' | 'Unknown' | 'VideoDecoding';
}
interface BlockStatePending {
    type: 'Pending';
    progress: number;
}
interface BlockStateReady {
    type: 'Ready';
}
type BooleanOperation = 'Difference' | 'Intersection' | 'Union' | 'XOR';
type BoolPropertyName = 'alwaysOnBottom' | 'alwaysOnTop' | 'clipped' | 'flip/horizontal' | 'flip/vertical' | 'highlightEnabled' | 'includedInExport' | 'placeholder/enabled' | 'playback/playing' | 'playback/soloPlaybackEnabled' | 'scene/aspectRatioLock' | 'scene/extendedPanningArea' | 'selected' | 'selectionEnabled' | 'transformLocked' | 'visible' | 'blur/enabled' | 'dropShadow/clip' | 'dropShadow/enabled' | 'fill/enabled' | 'fill/overprint' | 'page/guides/gridEnabled' | 'page/guides/gridSnapEnabled' | 'page/marginEnabled' | 'page/safetyEnabled' | 'placeholderControls/showButton' | 'placeholderControls/showOverlay' | 'playback/looping' | 'playback/muted' | 'stroke/enabled' | 'stroke/overprint' | 'backgroundColor/enabled' | 'placeholderBehavior/enabled' | 'text/automaticFontSizeEnabled' | 'text/clipLinesOutsideOfFrame' | 'text/hasClippedLines' | 'text/pathFlipped' | 'text/useContextualAlternates' | 'text/useContextualLigatures' | 'text/useDiscretionaryLigatures' | 'text/useKerning' | 'text/useLigatures' | 'exclusionArea/constrains' | 'exclusionArea/punchOut' | 'track/automaticallyManageBlockOffsets' | 'caption/automaticFontSizeEnabled' | 'caption/clipLinesOutsideOfFrame' | 'caption/hasClippedLines' | 'caption/pathFlipped' | 'caption/useContextualAlternates' | 'caption/useContextualLigatures' | 'caption/useDiscretionaryLigatures' | 'caption/useKerning' | 'caption/useLigatures' | 'captionTrack/automaticallyManageBlockOffsets' | 'animation/slide/fade' | 'animation/pan/fade' | 'animation/blur/fade' | 'animation/zoom/fade' | 'animation/crop_zoom/fade' | 'animation/spin/fade' | 'animation/block_swipe_text/useTextColor' | 'animation/spread_text/fade' | 'animation/ken_burns/fade' | 'effect/enabled' | (string & {});
type CameraClampingOvershootMode = 'Center' | 'Reverse';
interface CharacterInkBox {
    x: number;
    y: number;
    width: number;
    height: number;
    baselineY: number;
}
type CMYK = [
    c: number,
    m: number,
    y: number,
    k: number
];
interface CMYKProfileInfo {
    contentHash: string;
}
type ColorPickerColorMode = 'RGB' | 'CMYK' | 'Any';
type ColorPropertyName = 'dropShadow/color' | 'fill/solid/color' | 'page/guides/gridColor' | 'stroke/color' | 'backgroundColor/color' | 'animation/block_swipe_text/blockColor' | 'effect/duotone_filter/darkColor' | 'effect/duotone_filter/lightColor' | 'effect/green_screen/fromColor' | 'effect/recolor/fromColor' | 'effect/recolor/toColor' | 'fill/color/value' | 'fill/stripe/color' | (string & {});
enum ColorRenderingIntent {
    Perceptual = 0,
    RelativeColorimetric = 1,
    Saturation = 2,
    AbsoluteColorimetric = 3
}
type ColorSpace = 'sRGB' | 'CMYK' | 'SpotColor';
interface CompleteAssetResult extends AssetResult {
    context: {
        sourceId: string;
    };
    active: boolean;
}
interface Configuration {
    baseURL: string;
    license?: string;
    userId?: string;
    core: {
        baseURL: string;
    };
    logger: Logger;
    featureFlags?: {
        [flag: string]: boolean | string;
    };
    /** @deprecated This config key is not used anymore and will be removed. */
    presets: {
        typefaces?: {
            [id: string]: TypefaceDefinition;
        };
    };
    forceWebGL1?: boolean;
    audioOutput?: 'auto' | 'none';
    role?: RoleString;
}
type ControlGizmoMoveHandleVisibility = 'auto' | 'always' | 'never';
type ControlGizmoResizeHandlesVisibility = 'auto' | 'always' | 'never';
type ControlGizmoRotateHandlesVisibility = 'auto' | 'always' | 'never';
type ControlGizmoScaleHandlesVisibility = 'auto' | 'always' | 'never';
type CreateSceneOptions = {
    page?: {
        size: number | {
            width: number;
            height: number;
        };
        color?: Color;
    };
    designUnit?: DesignUnit;
    fontSizeUnit?: FontSizeUnit;
};
class CreativeEngine {
    #private;
    static readonly version: string;
    asset: AssetAPI;
    block: BlockAPI;
    editor: EditorAPI;
    event: EventAPI;
    scene: SceneAPI;
    variable: VariableAPI;
    actions: EngineActions;
    version: string;
    update(): boolean;
    dispose(): void;
    static init(config?: Partial<Configuration>): Promise<CreativeEngine>;
    /** @deprecated This method uses legacy v4 asset source IDs and will be removed in a future version. Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI(). */
    addDefaultAssetSources({ baseURL, excludeAssetSourceIds }?: {
        baseURL?: string;
        excludeAssetSourceIds?: DefaultAssetSourceId[];
    }): Promise<void>;
    /** @deprecated This method uses legacy v3 demo asset source IDs and will be removed in a future version. Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI(). */
    addDemoAssetSources({ baseURL, excludeAssetSourceIds, sceneMode, withUploadAssetSources }?: {
        baseURL?: string;
        excludeAssetSourceIds?: DemoAssetSourceId[];
        sceneMode?: SceneMode;
        withUploadAssetSources?: boolean;
    }): Promise<void>;
    getBaseURL(): string;
}
type CutoutOperation = 'Difference' | 'Intersection' | 'Union' | 'XOR';
type CutoutType = 'Solid' | 'Dashed';
interface DefaultApplyAssetOptions {
    placement?: AssetPlacement;
}
/** @deprecated This function uses legacy v4 asset source IDs. Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI() directly. */
type DefaultAssetSourceId = 'ly.img.sticker' | 'ly.img.vectorpath' | 'ly.img.colors.defaultPalette' | 'ly.img.filter.lut' | 'ly.img.filter.duotone' | 'ly.img.effect' | 'ly.img.blur' | 'ly.img.typeface' | 'ly.img.page.presets' | 'ly.img.page.presets.video' | 'ly.img.crop.presets' | 'ly.img.text' | 'ly.img.captionPresets';
/** @deprecated This function uses legacy v3 demo asset source IDs. Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI() directly. */
type DemoAssetSourceId = 'ly.img.template' | 'ly.img.image.upload' | 'ly.img.video.upload' | 'ly.img.audio.upload' | 'ly.img.image' | 'ly.img.video' | 'ly.img.video.template' | 'ly.img.audio' | 'ly.img.textComponents';
type DesignBlockTypeLonghand = `//ly.img.ubq/${DesignBlockTypeShorthand}`;
type DesignBlockTypeShorthand = 'scene' | 'stack' | 'camera' | 'page' | 'graphic' | 'audio' | 'text' | 'group' | 'cutout' | 'track' | 'caption' | 'captionTrack' | 'exclusionArea';
interface DominantColor {
    r: number;
    g: number;
    b: number;
    weight: number;
}
interface DominantColorsOptions {
    count?: number;
    ignoreWhite?: boolean;
}
type DoubleClickSelectionMode = 'Direct' | 'Hierarchical';
type DoublePropertyName = 'playback/time' | 'playback/duration' | 'playback/timeOffset' | 'audio/totalDuration' | 'playback/fadeIn/duration' | 'playback/fadeOut/duration' | 'playback/trimLength' | 'playback/trimOffset' | 'fill/video/totalDuration' | (string & {});
type DropShadowOptions = {
    color?: Color;
    offset?: {
        x?: number;
        y?: number;
    };
    blur?: {
        x?: number;
        y?: number;
    };
};
class EditorAPI {
    #private;
    isCapabilitySupported(capability: EngineCapability): boolean;
    checkCapabilities(): Promise<void>;
    onStateChanged: (callback: () => void) => (() => void);
    unstable_isInteractionHappening(): boolean;
    addVectorNode(): void;
    deleteVectorNode(): void;
    deleteSelectedVectorControlPoints(): void;
    toggleSelectedVectorNodeSmooth(): void;
    setVectorEditBendMode(active: boolean): void;
    getVectorEditBendMode(): boolean;
    setVectorEditAddMode(active: boolean): void;
    getVectorEditAddMode(): boolean;
    setVectorEditDeleteMode(active: boolean): void;
    getVectorEditDeleteMode(): boolean;
    setSelectedVectorNodeMirrorMode(mode: number): void;
    getSelectedVectorNodeMirrorMode(): number;
    getTextCursorPositionInScreenSpaceX(): number;
    getTextCursorPositionInScreenSpaceY(): number;
    removeUndoStep(): void;
    /** @deprecated Use {@link onHistoryUpdatedWithKind}instead, which additionally reports a {@link HistoryUpdate}* describing the kind of update. * * */
    onHistoryUpdated: (callback: () => void) => (() => void);
    onHistoryUpdatedWithKind: (callback: (kind: HistoryUpdate) => void) => (() => void);
    onSettingsChanged: (callback: () => void) => (() => void);
    onRoleChanged: (callback: (role: RoleString) => void) => (() => void);
    setSetting<K extends SettingKey>(keypath: OptionalPrefix<K>, value: SettingValueType<K>): void;
    getSetting<K extends SettingKey>(keypath: OptionalPrefix<K>): SettingValueType<K>;
    setSettingBool(keypath: SettingsBool, value: boolean): void;
    getSettingBool(keypath: SettingsBool): boolean;
    getSettingBool(keypath: SettingBoolPropertyName): boolean;
    setSettingInt(keypath: SettingsInt, value: number): void;
    setSettingInt(keypath: SettingIntPropertyName, value: number): void;
    getSettingInt(keypath: SettingsInt): number;
    getSettingInt(keypath: SettingIntPropertyName): number;
    setSettingFloat(keypath: SettingsFloat, value: number): void;
    setSettingFloat(keypath: SettingFloatPropertyName, value: number): void;
    getSettingFloat(keypath: SettingsFloat): number;
    getSettingFloat(keypath: SettingFloatPropertyName): number;
    setSettingString(keypath: SettingsString, value: string): void;
    setSettingString(keypath: SettingStringPropertyName, value: string): void;
    getSettingString(keypath: SettingsString): string;
    getSettingString(keypath: SettingStringPropertyName): string;
    setSettingColor(keypath: SettingsColor, value: Color): void;
    setSettingColor(keypath: SettingColorPropertyName, value: Color): void;
    getSettingColor(keypath: SettingsColor): Color;
    getSettingColor(keypath: SettingColorPropertyName): Color;
    /** @deprecated Use setSettingColor() instead. */
    setSettingColorRGBA(keypath: SettingsColorRGBA | `ubq://${SettingsColorRGBA}`, r: number, g: number, b: number, a?: number): void;
    /** @deprecated Use getSettingColor() instead. */
    getSettingColorRGBA(keypath: SettingsColorRGBA | `ubq://${SettingsColorRGBA}`): RGBA;
    setSettingEnum<T extends keyof SettingEnumType>(keypath: T, value: SettingEnumType[T]): void;
    setSettingEnum(keypath: string, value: string): void;
    getSettingEnum<T extends keyof SettingEnumType>(keypath: T): SettingEnumType[T];
    getSettingEnum(keypath: string): string;
    getSettingEnumOptions<T extends keyof SettingEnumType>(keypath: T): SettingEnumType[T][];
    getSettingEnumOptions(keypath: string): string[];
    setRole(role: RoleString): void;
    getRole(): RoleString;
    findAllSettings(): string[];
    getSettingType(keypath: string): SettingType;
    getAvailableMemory(): number;
    getUsedMemory(): number;
    getMaxExportSize(): number;
    setURIResolver(resolver?: SyncURIResolver | null): void;
    setURIResolverAsync(resolver?: AsyncURIResolver | null): void;
    defaultURIResolver(relativePath: string): string;
    getAbsoluteURI(relativePath: string): Promise<string>;
    findAllSpotColors(): string[];
    getSpotColorRGBA(name: string): RGBA;
    getSpotColorCMYK(name: string): CMYK;
    setSpotColorRGB(name: string, r: number, g: number, b: number): void;
    setSpotColorCMYK(name: string, c: number, m: number, y: number, k: number): void;
    removeSpotColor(name: string): void;
    setSpotColorForCutoutType(type: CutoutType, color: string): void;
    getSpotColorForCutoutType(type: CutoutType): string;
    convertColorToColorSpace(color: Color, colorSpace: 'sRGB'): RGBAColor;
    convertColorToColorSpace(color: Color, colorSpace: 'CMYK'): CMYKColor;
    convertColorToColorSpace(color: Color, colorSpace: ColorSpace): never;
    loadCMYKProfile(): Promise<void>;
    createBuffer(): string;
    destroyBuffer(uri: string): void;
    setBufferData(uri: string, offset: number, data: Uint8Array): void;
    getBufferData(uri: string, offset: number, length: number): Uint8Array;
    setBufferLength(uri: string, length: number): void;
    getBufferLength(uri: string): number;
    getMimeType(uri: string): Promise<string>;
    getFontMetrics(fontFileUri: string): Promise<FontMetrics>;
    findAllTransientResources(): TransientResource[];
    findAllMediaURIs(): string[];
    getResourceData(uri: string, chunkSize: number, onData: (result: Uint8Array) => boolean): void;
    relocateResource(currentUrl: string, relocatedUrl: string): void;
    setSafeAreaInsets(insets: {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
    }): void;
    getSafeAreaInsets(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    setMovementConstraint(rules: MovementConstraintRule | MovementConstraintRule[]): void;
    removeMovementConstraint(scopes?: MovementConstraintScope | MovementConstraintScope[]): void;
}
type EngineActionId = keyof EngineActionsRegistry & string;
interface EngineActionInfo {
    id: string;
    enabled: boolean;
    argSchema: string | null;
}
class EngineActions {
    #private;
    register<K extends EngineActionId>(id: K, fn: EngineActionsRegistry[K] extends (...args: any[]) => any ? EngineActionsRegistry[K] : EngineCustomActionFunction): void;
    register(id: string, fn: EngineCustomActionFunction): void;
    get<K extends EngineActionId>(id: K): EngineActionsRegistry[K] | undefined;
    get(id: string): EngineCustomActionFunction | undefined;
    run<K extends EngineActionId>(id: K, ...args: EngineActionsRegistry[K] extends (...args: infer A) => any ? A : unknown[]): Promise<EngineActionsRegistry[K] extends (...args: any[]) => infer R ? Awaited<R> : unknown>;
    run<R = unknown>(id: string, ...args: unknown[]): Promise<R>;
    has(id: string): boolean;
    unregister(id: string): boolean;
    list(options?: {
        matcher?: string;
    }): EngineActionInfo[];
}
interface EngineActionsRegistry {
}
type EngineCapability = 'aacEncode' | 'opusEncode' | 'h264Encode' | 'hevcEncode' | 'vp9Encode' | 'av1Encode' | 'h264Decode' | 'hevcDecode' | 'vp9Decode' | 'av1Decode' | 'tempFileStorage' | 'concurrentFileRead';
type EngineCustomActionFunction = (...args: any[]) => unknown;
type EnumPropertyName = 'blend/mode' | 'contentFill/horizontalAlignment' | 'contentFill/mode' | 'contentFill/verticalAlignment' | 'height/mode' | 'position/x/mode' | 'position/y/mode' | 'scene/colorConversionMode' | 'scene/designUnit' | 'scene/fontSizeUnit' | 'scene/layout' | 'scene/mode' | 'width/mode' | 'page/guides/source' | 'stroke/cap' | 'stroke/cornerGeometry' | 'stroke/dashEndCap' | 'stroke/dashStartCap' | 'stroke/endCap' | 'stroke/position' | 'stroke/startCap' | 'stroke/style' | 'playback/fadeIn/easing' | 'playback/fadeOut/easing' | 'text/horizontalAlignment' | 'text/verticalAlignment' | 'cutout/type' | 'caption/horizontalAlignment' | 'caption/verticalAlignment' | 'animationEasing' | 'textAnimationWritingStyle' | 'animation/grow/direction' | 'animation/wipe/direction' | 'animation/baseline/direction' | 'animation/spin/direction' | 'animation/spin_loop/direction' | 'animation/jump_loop/direction' | 'animation/typewriter_text/writingStyle' | 'animation/block_swipe_text/direction' | 'animation/merge_text/direction' | 'animation/ken_burns/direction' | 'fill/pixelStream/orientation' | 'shape/vector_path/fillRule' | (string & {});
class EventAPI {
    #private;
    subscribe: (blocks: DesignBlockId[], callback: (events: BlockEvent[]) => void) => (() => void);
}
type FloatPropertyName = 'globalBoundingBox/height' | 'globalBoundingBox/width' | 'globalBoundingBox/x' | 'globalBoundingBox/y' | 'height' | 'lastFrame/height' | 'lastFrame/width' | 'lastFrame/x' | 'lastFrame/y' | 'movement/constraint' | 'position/x' | 'position/y' | 'rotation' | 'scene/dpi' | 'scene/pageDimensions/height' | 'scene/pageDimensions/width' | 'scene/pixelScaleFactor' | 'width' | 'camera/pixelRatio' | 'camera/resolution/height' | 'camera/resolution/width' | 'camera/zoomLevel' | 'dropShadow/blurRadius/x' | 'dropShadow/blurRadius/y' | 'dropShadow/offset/x' | 'dropShadow/offset/y' | 'page/guides/gridSpacingX' | 'page/guides/gridSpacingY' | 'page/margin/bottom' | 'page/margin/left' | 'page/margin/right' | 'page/margin/top' | 'page/marginScale' | 'page/safetyInset/bottom' | 'page/safetyInset/left' | 'page/safetyInset/right' | 'page/safetyInset/top' | 'playback/speed' | 'playback/volume' | 'stroke/dashOffset' | 'stroke/width' | 'opacity' | 'backgroundColor/cornerRadius' | 'backgroundColor/paddingBottom' | 'backgroundColor/paddingLeft' | 'backgroundColor/paddingRight' | 'backgroundColor/paddingTop' | 'text/backgroundCornerRadius' | 'text/backgroundPadding/bottom' | 'text/backgroundPadding/left' | 'text/backgroundPadding/right' | 'text/backgroundPadding/top' | 'text/fontSize' | 'text/letterSpacing' | 'text/lineHeight' | 'text/maxAutomaticFontSize' | 'text/minAutomaticFontSize' | 'text/paragraphSpacing' | 'text/pathOffset' | 'cutout/offset' | 'cutout/smoothing' | 'caption/backgroundCornerRadius' | 'caption/backgroundPadding/bottom' | 'caption/backgroundPadding/left' | 'caption/backgroundPadding/right' | 'caption/backgroundPadding/top' | 'caption/fontSize' | 'caption/letterSpacing' | 'caption/lineHeight' | 'caption/maxAutomaticFontSize' | 'caption/minAutomaticFontSize' | 'caption/paragraphSpacing' | 'caption/pathOffset' | 'animation/slide/direction' | 'textAnimationOverlap' | 'animation/pan/direction' | 'animation/pan/distance' | 'animation/blur/intensity' | 'animation/grow/scaleFactor' | 'animation/crop_zoom/scale' | 'animation/spin/intensity' | 'animation/blur_loop/intensity' | 'animation/pulsating_loop/intensity' | 'animation/breathing_loop/intensity' | 'animation/jump_loop/intensity' | 'animation/sway_loop/intensity' | 'animation/spread_text/intensity' | 'animation/merge_text/intensity' | 'animation/ken_burns/travelDistanceRatio' | 'animation/ken_burns/zoomIntensity' | 'blur/uniform/intensity' | 'blur/linear/blurRadius' | 'blur/linear/x1' | 'blur/linear/x2' | 'blur/linear/y1' | 'blur/linear/y2' | 'blur/mirrored/blurRadius' | 'blur/mirrored/gradientSize' | 'blur/mirrored/size' | 'blur/mirrored/x1' | 'blur/mirrored/x2' | 'blur/mirrored/y1' | 'blur/mirrored/y2' | 'blur/radial/blurRadius' | 'blur/radial/gradientRadius' | 'blur/radial/radius' | 'blur/radial/x' | 'blur/radial/y' | 'effect/adjustments/blacks' | 'effect/adjustments/brightness' | 'effect/adjustments/clarity' | 'effect/adjustments/contrast' | 'effect/adjustments/exposure' | 'effect/adjustments/gamma' | 'effect/adjustments/highlights' | 'effect/adjustments/saturation' | 'effect/adjustments/shadows' | 'effect/adjustments/sharpness' | 'effect/adjustments/temperature' | 'effect/adjustments/whites' | 'effect/cross_cut/offset' | 'effect/cross_cut/slices' | 'effect/cross_cut/speedV' | 'effect/cross_cut/time' | 'effect/dot_pattern/blur' | 'effect/dot_pattern/dots' | 'effect/dot_pattern/size' | 'effect/duotone_filter/intensity' | 'effect/extrude_blur/amount' | 'effect/glow/amount' | 'effect/glow/darkness' | 'effect/glow/size' | 'effect/green_screen/colorMatch' | 'effect/green_screen/smoothness' | 'effect/green_screen/spill' | 'effect/half_tone/angle' | 'effect/half_tone/scale' | 'effect/linocut/scale' | 'effect/liquid/amount' | 'effect/liquid/scale' | 'effect/liquid/time' | 'effect/lut_filter/intensity' | 'effect/outliner/amount' | 'effect/outliner/passthrough' | 'effect/posterize/levels' | 'effect/radial_pixel/radius' | 'effect/radial_pixel/segments' | 'effect/recolor/brightnessMatch' | 'effect/recolor/colorMatch' | 'effect/recolor/smoothness' | 'effect/shifter/amount' | 'effect/shifter/angle' | 'effect/tilt_shift/amount' | 'effect/tilt_shift/position' | 'effect/tv_glitch/distortion' | 'effect/tv_glitch/distortion2' | 'effect/tv_glitch/rollSpeed' | 'effect/tv_glitch/speed' | 'effect/vignette/darkness' | 'effect/vignette/offset' | 'fill/gradient/linear/endPointX' | 'fill/gradient/linear/endPointY' | 'fill/gradient/linear/startPointX' | 'fill/gradient/linear/startPointY' | 'fill/gradient/radial/centerPointX' | 'fill/gradient/radial/centerPointY' | 'fill/gradient/radial/radius' | 'fill/gradient/conical/centerPointX' | 'fill/gradient/conical/centerPointY' | 'fill/stripe/angle' | 'fill/stripe/gap' | 'fill/stripe/width' | 'shape/rect/cornerRadiusBL' | 'shape/rect/cornerRadiusBR' | 'shape/rect/cornerRadiusTL' | 'shape/rect/cornerRadiusTR' | 'shape/polygon/cornerRadius' | 'shape/star/cornerRadius' | 'shape/star/innerDiameter' | 'shape/vector_path/cornerRadius' | 'shape/vector_path/height' | 'shape/vector_path/width' | (string & {});
interface FontMetrics {
    ascender: number;
    descender: number;
    unitsPerEm: number;
    lineGap: number;
    capHeight: number;
    xHeight: number;
    underlineOffset: number;
    underlineSize: number;
    strikeoutOffset: number;
    strikeoutSize: number;
}
type TextFontSizeUnit = DesignUnit | 'Point';
type HistoryUpdate = 'Updated' | 'Activated';
type IntPropertyName = 'effect/lut_filter/horizontalTileCount' | 'effect/lut_filter/verticalTileCount' | 'effect/mirror/side' | 'effect/pixelize/horizontalPixelSize' | 'effect/pixelize/verticalPixelSize' | 'shape/polygon/sides' | 'shape/star/points' | (string & {});
type Locale = string;
interface Logger {
    (message: string, level?: LogLevel): void;
}
type LogLevel = 'Info' | 'Warning' | 'Error';
/** @deprecated Specifying log levels via `LogLevel.Info` has been deprecated. Please use the desired LogLevel string directly. */
const LogLevel: {
    readonly Info: "Info";
    readonly Warning: "Warning";
    readonly Error: "Error";
};
/** @deprecated Use the `MimeType` string literal types instead. */
const MimeType_2: {
    readonly Png: "image/png";
    readonly Jpeg: "image/jpeg";
    readonly WebP: "image/webp";
    readonly Tga: "image/x-tga";
    readonly Svg: "image/svg+xml";
    readonly Wav: "audio/wav";
    readonly Mp4Audio: "audio/mp4";
    readonly Mp4: "video/mp4";
    readonly QuickTime: "video/quicktime";
    readonly Binary: "application/octet-stream";
    readonly Pdf: "application/pdf";
    readonly Zip: "application/zip";
};
type MimeType_2 = (typeof MimeType_2)[keyof typeof MimeType_2];
type MovementConstraintRule = {
    overshoot: number;
} | {
    overshoot: number;
    block: DesignBlockId;
} | {
    overshoot: number;
    blockType: string;
};
type MovementConstraintScope = {
    block: DesignBlockId;
} | {
    blockType: string;
};
type OptionalPrefix<T extends string> = `ubq://${T}` | T;
type PositionMode = 'Absolute' | 'Percent' | 'Auto' | 'Absolute' | 'Percent' | 'Auto';
type PropertyType = 'Bool' | 'Int' | 'Float' | 'String' | 'Color' | 'Enum' | 'Struct' | 'Double' | 'SourceSet';
interface Range_2 {
    from: number;
    to: number;
}
type RGBA = [
    r: number,
    g: number,
    b: number,
    a: number
];
interface RGBColor {
    r: number;
    g: number;
    b: number;
}
type RoleString = 'Creator' | 'Adopter' | 'Viewer' | 'Presenter';
class SceneAPI {
    #private;
    setCMYKProfile(uri: string): Promise<void>;
    setCMYKProfileFromData(data: Uint8Array): void;
    getCMYKProfileInfo(): CMYKProfileInfo | null;
    removeCMYKProfile(): void;
    getColorRenderingIntent(): ColorRenderingIntent;
    setColorRenderingIntent(intent: ColorRenderingIntent): void;
    isBlackPointCompensationEnabled(): boolean;
    setBlackPointCompensationEnabled(enabled: boolean): void;
    load(source: string | URL, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>;
    /** @deprecated Scene mode no longer affects engine behavior. Use `create()` followed by `setMode('Video')` instead. ```javascript const scene = engine.scene.createVideo(); ``` */
    createVideo(options?: CreateSceneOptions): DesignBlockId;
    createFromImage(url: string, dpi?: number, pixelScaleFactor?: number, sceneLayout?: SceneLayout, spacing?: number, spacingInScreenSpace?: boolean): Promise<DesignBlockId>;
    createFromVideo(url: string): Promise<DesignBlockId>;
    get(): DesignBlockId | null;
    applyTemplateFromString(content: string): Promise<void>;
    applyTemplateFromURL(url: string): Promise<void>;
    /** @deprecated Scene mode no longer affects engine behavior. All features work regardless of mode. ```javascript const mode = scene.getMode(); ``` */
    getMode(): SceneMode | null;
    /** @deprecated Scene mode no longer affects engine behavior. All features work regardless of mode. ```javascript engine.scene.setMode('Video'); ``` */
    setMode(mode: SceneMode): void;
    setDesignUnit(designUnit: DesignUnit): void;
    getDesignUnit(): DesignUnit;
    setFontSizeUnit(fontSizeUnit: FontSizeUnit): void;
    getFontSizeUnit(): FontSizeUnit;
    getLayout(): SceneLayout;
    setLayout(layout: SceneLayout): void;
    getPages(): DesignBlockId[];
    getCurrentPage(): DesignBlockId | null;
    findNearestToViewPortCenterByType(type: DesignBlockType): DesignBlockId[];
    findNearestToViewPortCenterByKind(kind: string): DesignBlockId[];
    unstable_enableCameraPositionClamping(ids: DesignBlockId[], paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number, scaledPaddingLeft?: number, scaledPaddingTop?: number, scaledPaddingRight?: number, scaledPaddingBottom?: number): void;
    unstable_disableCameraPositionClamping(blockOrScene?: number | null): void;
    unstable_isCameraPositionClampingEnabled(blockOrScene?: number | null): boolean;
    onZoomLevelChanged: (callback: () => void) => (() => void);
    onActiveChanged: (callback: () => void) => (() => void);
}
type DesignUnit = 'Pixel' | 'Millimeter' | 'Inch';
type FontSizeUnit = 'Pixel' | 'Point';
type SceneLayout = 'Free' | 'VerticalStack' | 'HorizontalStack' | 'DepthStack';
type SceneMode = 'Design' | 'Video';
type SettingBoolPropertyName = 'doubleClickToCropEnabled' | 'showBuildVersion' | 'placeholderControls/showButton' | 'placeholderControls/showOverlay' | 'blockAnimations/enabled' | 'playback/showAllBlocks' | 'grid/enabled' | 'grid/snapEnabled' | 'archival/bundleOnlyUsedFontVariants' | 'touch/dragStartCanSelect' | 'touch/singlePointPanning' | 'mouse/enableZoom' | 'mouse/enableScroll' | 'dragToSwapFills/enabled' | 'controlGizmo/showCropHandles' | 'controlGizmo/showMoveHandles' | 'controlGizmo/dynamicMoveHandleVisibility' | 'controlGizmo/showResizeHandles' | 'controlGizmo/showScaleHandles' | 'controlGizmo/showRotateHandles' | 'controlGizmo/showCropScaleHandles' | 'page/title/show' | 'page/title/showPageTitleTemplate' | 'page/title/appendPageName' | 'page/title/showOnSinglePage' | 'page/title/canEdit' | 'page/safetyRevealDuringTransform' | 'page/dimOutOfPageAreas' | 'page/allowCropInteraction' | 'page/allowResizeInteraction' | 'page/restrictResizeInteractionToFixedAspectRatio' | 'page/allowRotateInteraction' | 'page/allowMoveInteraction' | 'page/marqueeSelectOnBodyDrag' | 'page/restrictPageSelectionToBorderAndTitle' | 'page/moveChildrenWhenCroppingFill' | 'page/selectWhenNoBlocksSelected' | 'page/highlightWhenCropping' | 'page/allowShapeChange' | 'page/highlightDropTarget' | 'page/reparentBlocksToSceneWhenOutOfPage' | 'page/flipDimensionsOn90DegreeCropRotation' | 'clampThumbnailTextureSizes' | 'useSystemFontFallback' | 'forceSystemEmojis' | (string & {});
type SettingColorPropertyName = 'clearColor' | 'handleFillColor' | 'highlightColor' | 'pageHighlightColor' | 'placeholderHighlightColor' | 'snappingGuideColor' | 'rotationSnappingGuideColor' | 'cropOverlayColor' | 'textVariableHighlightColor' | 'borderOutlineColor' | 'progressColor' | 'errorStateColor' | 'grid/color' | 'page/title/color' | 'page/marginFillColor' | 'page/marginFrameColor' | 'page/safetyFillColor' | 'page/safetyFrameColor' | 'page/exclusionAreaFillColor' | 'page/exclusionAreaFrameColor' | 'page/innerBorderColor' | 'page/outerBorderColor' | 'colorMaskingSettings/maskColor' | (string & {});
type SettingEnumType = {
    'touch/pinchAction': TouchPinchAction;
    'touch/rotateAction': TouchRotateAction;
    'camera/clamping/overshootMode': CameraClampingOvershootMode;
    'controlGizmo/moveHandleVisibility': ControlGizmoMoveHandleVisibility;
    'controlGizmo/resizeHandlesVisibility': ControlGizmoResizeHandlesVisibility;
    'controlGizmo/scaleHandlesVisibility': ControlGizmoScaleHandlesVisibility;
    'controlGizmo/rotateHandlesVisibility': ControlGizmoRotateHandlesVisibility;
    doubleClickSelectionMode: DoubleClickSelectionMode;
    'colorPicker/colorMode': ColorPickerColorMode;
    'timeline/trackVisibility': TimelineTrackVisibility;
};
type SettingFloatPropertyName = 'positionSnappingThreshold' | 'rotationSnappingThreshold' | 'grid/spacingX' | 'grid/spacingY' | 'dragToSwapFills/longPressDurationMs' | 'controlGizmo/blockScaleDownLimit' | 'listIndentPerLevel' | (string & {});
type SettingIntPropertyName = 'maxImageSize' | 'maxPreviewResolution' | (string & {});
type SettingKey = keyof Settings;
interface Settings {
    'controlGizmo/showCropHandles': boolean;
    'controlGizmo/showCropScaleHandles': boolean;
    /** @deprecated Use `controlGizmo/moveHandleVisibility`. `false` hides the move handle. */
    'controlGizmo/showMoveHandles': boolean;
    /** @deprecated Use `controlGizmo/moveHandleVisibility`. `false` shows the move handle at any block size. */
    'controlGizmo/dynamicMoveHandleVisibility': boolean;
    /** @deprecated Use `controlGizmo/resizeHandlesVisibility`. `false` hides the edge (resize) handles. */
    'controlGizmo/showResizeHandles': boolean;
    /** @deprecated Use `controlGizmo/rotateHandlesVisibility`. `false` hides the rotation handle. */
    'controlGizmo/showRotateHandles': boolean;
    /** @deprecated Use `controlGizmo/scaleHandlesVisibility`. `false` hides the corner (scale) handles. */
    'controlGizmo/showScaleHandles': boolean;
    doubleClickToCropEnabled: boolean;
    'dragToSwapFills/enabled': boolean;
    'features/singlePageModeEnabled': boolean;
    'features/fileSystemUsageEnabled': boolean;
    'features/pageCarouselEnabled': boolean;
    'features/transformEditsRetainCoverMode': boolean;
    'features/clampTextBlockWidthToPageDimensionsDuringEditing': boolean;
    'features/equalDistanceSnappingEnabled': boolean;
    'mouse/enableScroll': boolean;
    'mouse/enableZoom': boolean;
    'page/allowCropInteraction': boolean;
    'page/allowMoveInteraction': boolean;
    'page/marqueeSelectOnBodyDrag': boolean;
    'page/restrictPageSelectionToBorderAndTitle': boolean;
    'page/allowResizeInteraction': boolean;
    'page/allowRotateInteraction': boolean;
    'page/allowShapeChange': boolean;
    'page/dimOutOfPageAreas': boolean;
    'page/restrictResizeInteractionToFixedAspectRatio': boolean;
    'page/moveChildrenWhenCroppingFill': boolean;
    'page/title/appendPageName': boolean;
    'page/title/canEdit': boolean;
    'page/title/show': boolean;
    'page/title/showOnSinglePage': boolean;
    'page/title/showPageTitleTemplate': boolean;
    'page/safetyRevealDuringTransform': boolean;
    'placeholderControls/showButton': boolean;
    'placeholderControls/showOverlay': boolean;
    'blockAnimations/enabled': boolean;
    'playback/showAllBlocks': boolean;
    'grid/enabled': boolean;
    'grid/snapEnabled': boolean;
    showBuildVersion: boolean;
    'touch/dragStartCanSelect': boolean;
    'touch/singlePointPanning': boolean;
    useSystemFontFallback: boolean;
    forceSystemEmojis: boolean;
    'page/selectWhenNoBlocksSelected': boolean;
    'page/highlightWhenCropping': boolean;
    'page/highlightDropTarget': boolean;
    'page/reparentBlocksToSceneWhenOutOfPage': boolean;
    clampThumbnailTextureSizes: boolean;
    'dock/hideLabels': boolean;
    basePath: string;
    defaultEmojiFontFileUri: string;
    defaultFontFileUri: string;
    license: string;
    'page/title/fontFileUri': string;
    'page/title/separator': string;
    fallbackFontUri: string;
    fallbackCMYKProfileUri: string;
    'upload/supportedMimeTypes': string;
    'web/fetchCredentials': 'omit' | 'same-origin' | 'include';
    'controlGizmo/blockScaleDownLimit': number;
    listIndentPerLevel: number;
    positionSnappingThreshold: number;
    rotationSnappingThreshold: number;
    'grid/spacingX': number;
    'grid/spacingY': number;
    'dragToSwapFills/longPressDurationMs': number;
    maxImageSize: number;
    maxPreviewResolution: number;
    borderOutlineColor: Color;
    clearColor: Color;
    'colorMaskingSettings/maskColor': Color;
    cropOverlayColor: Color;
    errorStateColor: Color;
    highlightColor: Color;
    'page/exclusionAreaFillColor': Color;
    'page/exclusionAreaFrameColor': Color;
    'page/innerBorderColor': Color;
    'page/marginFillColor': Color;
    'page/marginFrameColor': Color;
    'page/outerBorderColor': Color;
    'page/safetyFillColor': Color;
    'page/safetyFrameColor': Color;
    'page/title/color': Color;
    pageHighlightColor: Color;
    placeholderHighlightColor: Color;
    progressColor: Color;
    rotationSnappingGuideColor: Color;
    ruleOfThirdsLineColor: Color;
    snappingGuideColor: Color;
    textVariableHighlightColor: Color;
    handleFillColor: Color;
    'grid/color': Color;
    'controlGizmo/moveHandleVisibility': 'auto' | 'always' | 'never';
    'controlGizmo/resizeHandlesVisibility': 'auto' | 'always' | 'never';
    'controlGizmo/scaleHandlesVisibility': 'auto' | 'always' | 'never';
    'controlGizmo/rotateHandlesVisibility': 'auto' | 'always' | 'never';
    doubleClickSelectionMode: 'Direct' | 'Hierarchical';
    'touch/pinchAction': 'None' | 'Zoom' | 'Scale' | 'Auto' | 'Dynamic';
    'touch/rotateAction': 'None' | 'Rotate';
    'camera/clamping/overshootMode': 'Center' | 'Reverse';
    'dock/iconSize': 'normal' | 'large';
    'colorPicker/colorMode': 'RGB' | 'CMYK' | 'Any';
    'timeline/trackVisibility': 'all' | 'active';
    'timeline/transitionControlVisibility': 'hover' | 'always';
    'features/automaticSourceSetsEnabled': boolean;
}
type SettingsBool = SettingBoolPropertyName;
type SettingsColor = SettingColorPropertyName;
/** @deprecated Use SettingsColor instead. */
type SettingsColorRGBA = SettingsColor;
type SettingsFloat = SettingFloatPropertyName;
type SettingsInt = SettingIntPropertyName;
type SettingsString = SettingStringPropertyName;
type SettingStringPropertyName = 'basePath' | 'defaultEmojiFontFileUri' | 'defaultFontFileUri' | 'upload/supportedMimeTypes' | 'license' | 'web/fetchCredentials' | 'page/title/separator' | 'page/title/fontFileUri' | 'fallbackFontUri' | 'fallbackCMYKProfileUri' | (string & {});
type SettingType = 'Bool' | 'Int' | 'Float' | 'String' | 'Color' | 'Enum';
type SettingValueType<K extends SettingKey> = Settings[K];
type SizeMode = 'Absolute' | 'Percent' | 'Auto' | 'Absolute' | 'Percent' | 'Auto';
type SortingOrder = 'None' | 'Ascending' | 'Descending';
type SourceSetPropertyName = 'fill/image/sourceSet' | (string & {});
type SplitOptions = {
    attachToParent?: boolean;
    createParentTrackIfNeeded?: boolean;
    selectNewBlock?: boolean;
};
type StringPropertyName = 'name' | 'scene/pageFormatId' | 'type' | 'uuid' | 'page/titleTemplate' | 'audio/fileURI' | 'text/externalReference' | 'text/fontFileUri' | 'text/pathExternalRef' | 'text/text' | 'text/typeface' | 'cutout/path' | 'caption/externalReference' | 'caption/fontFileUri' | 'caption/pathExternalRef' | 'caption/text' | 'caption/typeface' | 'effect/lut_filter/filterId' | 'effect/lut_filter/lutFileURI' | 'fill/image/externalReference' | 'fill/image/imageFileURI' | 'fill/image/previewFileURI' | 'fill/video/fileURI' | 'shape/vector_path/path' | (string & {});
type SyncURIResolver = (URI: string, defaultURIResolver: (URI: string) => string) => string;
interface TextFontSizeOptions {
    unit?: TextFontSizeUnit;
    from?: number;
    to?: number;
}
type TimelineTrackVisibility = 'all' | 'active';
type TouchPinchAction = 'None' | 'Zoom' | 'Scale' | 'Auto' | 'Dynamic';
type TouchRotateAction = 'None' | 'Rotate';
interface TransientResource {
    URL: string;
    size: number;
}
type TransitionType = 'none' | 'cross-fade' | 'cross-blur' | 'cross-spin' | 'cross-zoom' | 'cross-warp' | 'push' | 'slide' | 'stack' | 'splice' | 'diagonal-splice' | 'fade' | 'fade-to-white' | 'fade-to-black' | 'color-wipe' | 'line-wipe' | 'wipe' | 'clock-wipe' | 'chop' | 'gradient-fade' | 'two-stripes'; // each also valid as '//ly.img.ubq/transition/<name>'
type TransitionTypeLonghand = `//ly.img.ubq/transition/${TransitionTypeShorthand}`;
type TransitionTypeShorthand = 'none' | 'cross-fade' | 'cross-blur' | 'cross-spin' | 'cross-zoom' | 'cross-warp' | 'push' | 'slide' | 'stack' | 'splice' | 'diagonal-splice' | 'fade' | 'fade-to-white' | 'fade-to-black' | 'color-wipe' | 'line-wipe' | 'wipe' | 'clock-wipe' | 'chop' | 'gradient-fade' | 'two-stripes';
/** @deprecated This type definition is not used anymore and will be removed. Defines the structure of a typeface definition, including metadata, family name, and font details. - 'meta': Optional metadata for the typeface, including default status, library, and categories. - 'family': The name of the typeface family. - 'fonts': An array of font definitions, each containing a font URL, weight, and style. */
type TypefaceDefinition = {
    meta?: {
        default?: boolean;
        library?: string;
        categories?: string[];
    };
    family: string;
    fonts: {
        fontURL: string;
        weight: FontWeight;
        style: FontStyle;
    }[];
};
class VariableAPI {
    #private;
    findAll(): string[];
    remove(key: string): void;
}
type XYWH = [
    x: number,
    y: number,
    w: number,
    h: number
];
