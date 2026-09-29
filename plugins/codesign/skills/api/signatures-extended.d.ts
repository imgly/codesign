// Editor-UI machinery moved out of signatures.d.ts: selection,
// highlighting, hover, zoom/camera, undo-redo history, scopes,
// edit-mode/cursor state, asset-source plumbing. Same engine, same
// classes — these members are for interactive editors, not design
// generation. Search this file for the member you need.
// ---- AssetAPI (editor-UI members) ----
    registerApplyMiddleware(middleware: (sourceId: string, assetResult: AssetResult, apply: AssetAPI['apply'], context: ApplyAssetOptions) => Promise<DesignBlockId | undefined>): VoidFunction;
    registerApplyToBlockMiddleware(middleware: (sourceId: string, assetResult: AssetResult, block: DesignBlockId, applyToBlock: AssetAPI['applyToBlock']) => Promise<void>): VoidFunction;
    getGroups(id: string): Promise<string[]>;
    getCredits(sourceId: string): {
        name: string;
        url: string | undefined;
    } | undefined;
    getLicense(sourceId: string): {
        name: string;
        url: string | undefined;
    } | undefined;
    assetSourceContentsChanged(sourceID: string): void;
// ---- BlockAPI (editor-UI members) ----
    export(handle: DesignBlockId, options?: ExportOptions): Promise<Blob>;
    exportWithColorMask(handle: DesignBlockId, maskColorR: number, maskColorG: number, maskColorB: number, options?: ExportOptions): Promise<Blob[]>;
    exportVideo(handle: DesignBlockId, options?: VideoExportOptions): Promise<Blob>;
    exportAudio(handle: DesignBlockId, options?: AudioExportOptions): Promise<Blob>;
    loadFromString(content: string): Promise<DesignBlockId[]>;
    loadFromArchiveURL(url: string): Promise<DesignBlockId[]>;
    loadFromURL(url: string): Promise<DesignBlockId[]>;
    saveToString(blocks: DesignBlockId[], allowedResourceSchemes?: string[], onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>): Promise<string>;
    saveToArchive(blocks: DesignBlockId[]): Promise<Blob>;
    create(type: DesignBlockType): DesignBlockId;
    createFill(type: FillType): DesignBlockId;
    getAudioTrackCountFromVideo(videoFillBlock: DesignBlockId): number;
    createAudioFromVideo(videoFillBlock: DesignBlockId, trackIndex: number, options?: AudioFromVideoOptions): DesignBlockId;
    createAudiosFromVideo(videoFillBlock: DesignBlockId, options?: AudioFromVideoOptions): DesignBlockId[];
    getAudioInfoFromVideo(videoFillBlock: DesignBlockId): AudioTrackInfo[];
    createCaptionsFromURI(uri: string): Promise<DesignBlockId[]>;
    getType(id: DesignBlockId): ObjectTypeLonghand;
    getKind(id: DesignBlockId): string;
    setKind(id: DesignBlockId, kind: string): void;
    select(id: DesignBlockId): void;
    setSelected(id: DesignBlockId, selected: boolean): void;
    isSelected(id: DesignBlockId): boolean;
    findAllSelected(): DesignBlockId[];
    isGroupable(ids: DesignBlockId[]): boolean;
    group(ids: DesignBlockId[]): DesignBlockId;
    ungroup(id: DesignBlockId): void;
    setName(id: DesignBlockId, name: string): void;
    getName(id: DesignBlockId): string;
    getUUID(id: DesignBlockId): string;
    findByName(name: string): DesignBlockId[];
    findByType(type: ObjectType): DesignBlockId[];
    createShape(type: ShapeType): DesignBlockId;
    /** @deprecated Use supportsShape instead. */
    hasShape(id: DesignBlockId): boolean;
    supportsShape(id: DesignBlockId): boolean;
    getShape(id: DesignBlockId): DesignBlockId;
    setShape(id: DesignBlockId, shape: DesignBlockId): void;
    isVisible(id: DesignBlockId): boolean;
    setVisible(id: DesignBlockId, visible: boolean): void;
    isClipped(id: DesignBlockId): boolean;
    setClipped(id: DesignBlockId, clipped: boolean): void;
    isTransformLocked(id: DesignBlockId): boolean;
    setTransformLocked(id: DesignBlockId, locked: boolean): void;
    getPositionX(id: DesignBlockId): number;
    getPositionXMode(id: DesignBlockId): PositionXMode;
    getPositionY(id: DesignBlockId): number;
    getPositionYMode(id: DesignBlockId): PositionYMode;
    setPositionX(id: DesignBlockId, value: number): void;
    setPositionXMode(id: DesignBlockId, mode: PositionXMode): void;
    setPositionY(id: DesignBlockId, value: number): void;
    setPositionYMode(id: DesignBlockId, mode: PositionYMode): void;
    setAlwaysOnTop(id: DesignBlockId, enabled: boolean): void;
    setAlwaysOnBottom(id: DesignBlockId, enabled: boolean): void;
    isAlwaysOnTop(id: DesignBlockId): boolean;
    isAlwaysOnBottom(id: DesignBlockId): boolean;
    bringToFront(id: DesignBlockId): void;
    sendToBack(id: DesignBlockId): void;
    bringForward(id: DesignBlockId): void;
    sendBackward(id: DesignBlockId): void;
    getRotation(id: DesignBlockId): number;
    setRotation(id: DesignBlockId, radians: number): void;
    getFlipHorizontal(id: DesignBlockId): boolean;
    getFlipVertical(id: DesignBlockId): boolean;
    setFlipHorizontal(id: DesignBlockId, flip: boolean): void;
    setFlipVertical(id: DesignBlockId, flip: boolean): void;
    /** @deprecated Use supportsContentFillMode instead. */
    hasContentFillMode(id: DesignBlockId): boolean;
    supportsContentFillMode(id: DesignBlockId): boolean;
    getWidth(id: DesignBlockId): number;
    getWidthMode(id: DesignBlockId): WidthMode;
    getHeight(id: DesignBlockId): number;
    getHeightMode(id: DesignBlockId): HeightMode;
    setSize(id: DesignBlockId, width: number, height: number, options?: {
        maintainCrop?: boolean;
        sizeMode?: SizeMode;
    }): void;
    setPosition(id: DesignBlockId, x: number, y: number, options?: {
        positionMode?: PositionMode;
    }): void;
    setWidth(id: DesignBlockId, value: number, maintainCrop?: boolean): void;
    setWidthMode(id: DesignBlockId, mode: WidthMode): void;
    setHeight(id: DesignBlockId, value: number, maintainCrop?: boolean): void;
    setHeightMode(id: DesignBlockId, mode: HeightMode): void;
    getFrameX(id: DesignBlockId): number;
    getFrameY(id: DesignBlockId): number;
    getFrameWidth(id: DesignBlockId): number;
    getFrameHeight(id: DesignBlockId): number;
    setContentFillMode(id: DesignBlockId, mode: ContentFillMode): void;
    getContentFillMode(id: DesignBlockId): ContentFillMode;
    setContentFillHorizontalAlignment(id: DesignBlockId, alignment: HorizontalContentFillAlignment): void;
    getContentFillHorizontalAlignment(id: DesignBlockId): HorizontalContentFillAlignment;
    setContentFillVerticalAlignment(id: DesignBlockId, alignment: VerticalContentFillAlignment): void;
    getContentFillVerticalAlignment(id: DesignBlockId): VerticalContentFillAlignment;
    duplicate(id: DesignBlockId, attachToParent?: boolean): DesignBlockId;
    destroy(id: DesignBlockId): void;
    getParent(id: DesignBlockId): DesignBlockId | null;
    getChildren(id: DesignBlockId): DesignBlockId[];
    insertChild(parent: DesignBlockId, child: DesignBlockId, index: number): void;
    appendChild(parent: DesignBlockId, child: DesignBlockId): void;
    getGlobalBoundingBoxX(id: DesignBlockId): number;
    getGlobalBoundingBoxY(id: DesignBlockId): number;
    getGlobalBoundingBoxWidth(id: DesignBlockId): number;
    getGlobalBoundingBoxHeight(id: DesignBlockId): number;
    alignHorizontally(ids: DesignBlockId[], horizontalBlockAlignment: TextHorizontalAlignment): void;
    alignVertically(ids: DesignBlockId[], verticalBlockAlignment: TextVerticalAlignment): void;
    isAlignable(ids: DesignBlockId[]): boolean;
    distributeHorizontally(ids: DesignBlockId[]): void;
    distributeVertically(ids: DesignBlockId[]): void;
    isDistributable(ids: DesignBlockId[]): boolean;
    fillParent(id: DesignBlockId): void;
    resizeContentAware(ids: DesignBlockId[], width: number, height: number): void;
    scale(id: DesignBlockId, scale: number, anchorX?: number, anchorY?: number): void;
    setBool(id: DesignBlockId, property: BoolPropertyName, value: boolean): void;
    getBool(id: DesignBlockId, property: BoolPropertyName): boolean;
    setInt(id: DesignBlockId, property: IntPropertyName, value: number): void;
    getInt(id: DesignBlockId, property: IntPropertyName): number;
    setFloat(id: DesignBlockId, property: FloatPropertyName, value: number): void;
    getFloat(id: DesignBlockId, property: FloatPropertyName): number;
    setDouble(id: DesignBlockId, property: DoublePropertyName, value: number): void;
    getDouble(id: DesignBlockId, property: DoublePropertyName): number;
    setString(id: DesignBlockId, property: StringPropertyName, value: string): void;
    getString(id: DesignBlockId, property: StringPropertyName): string;
    setColor(id: DesignBlockId, property: ColorPropertyName, value: Color): void;
    getColor(id: DesignBlockId, property: ColorPropertyName): Color;
    /** @deprecated Use setColor() instead. */
    setColorRGBA(id: DesignBlockId, property: string, r: number, g: number, b: number, a?: number): void;
    /** @deprecated Use getColor() instead. */
    getColorRGBA(id: DesignBlockId, property: string): RGBA;
    /** @deprecated Use setColor() instead. */
    setColorSpot(id: DesignBlockId, property: string, name: string, tint?: number): void;
    setGradientColorStops(id: DesignBlockId, property: string, colors: GradientColorStop[]): void;
    getGradientColorStops(id: DesignBlockId, property: string): GradientColorStop[];
    setSourceSet(id: DesignBlockId, property: SourceSetPropertyName, sourceSet: Source[]): void;
    addImageFileURIToSourceSet(id: DesignBlockId, property: SourceSetPropertyName, uri: string): Promise<void>;
    setEnum<T extends keyof BlockEnumType>(id: DesignBlockId, property: T, value: BlockEnumType[T]): void;
    setEnum(id: DesignBlockId, property: string, value: string): void;
    getEnum<T extends keyof BlockEnumType>(id: DesignBlockId, property: T): BlockEnumType[T];
    getEnum(id: DesignBlockId, property: string): string;
    /** @deprecated Use supportsCrop() instead. */
    hasCrop(id: DesignBlockId): boolean;
    supportsCrop(id: DesignBlockId): boolean;
    setCropScaleX(id: DesignBlockId, scaleX: number): void;
    setCropScaleY(id: DesignBlockId, scaleY: number): void;
    setCropRotation(id: DesignBlockId, rotation: number): void;
    setCropScaleRatio(id: DesignBlockId, scaleRatio: number): void;
    setCropTranslationX(id: DesignBlockId, translationX: number): void;
    setCropTranslationY(id: DesignBlockId, translationY: number): void;
    resetCrop(id: DesignBlockId): void;
    getCropScaleX(id: DesignBlockId): number;
    getCropScaleY(id: DesignBlockId): number;
    getCropRotation(id: DesignBlockId): number;
    getCropScaleRatio(id: DesignBlockId): number;
    getCropTranslationX(id: DesignBlockId): number;
    getCropTranslationY(id: DesignBlockId): number;
    adjustCropToFillFrame(id: DesignBlockId, minScaleRatio: number): number;
    flipCropHorizontal(id: DesignBlockId): void;
    flipCropVertical(id: DesignBlockId): void;
    setCropAspectRatioLocked(id: DesignBlockId, locked: boolean): void;
    /** @deprecated Use supportsOpacity() instead. */
    hasOpacity(id: DesignBlockId): boolean;
    supportsOpacity(id: DesignBlockId): boolean;
    setOpacity(id: DesignBlockId, opacity: number): void;
    getOpacity(id: DesignBlockId): number;
    /** @deprecated Use supportsBlendMode() instead. */
    hasBlendMode(id: DesignBlockId): boolean;
    supportsBlendMode(id: DesignBlockId): boolean;
    setBlendMode(id: DesignBlockId, blendMode: BlendMode): void;
    getBlendMode(id: DesignBlockId): BlendMode;
    /** @deprecated Query the fill's type using getFill() and getType() instead. */
    hasFillColor(id: DesignBlockId): boolean;
    isIncludedInExport(id: DesignBlockId): boolean;
    setIncludedInExport(id: DesignBlockId, enabled: boolean): void;
    /** @deprecated Use setFillSolidColor() instead. */
    setFillColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void;
    /** @deprecated Use getFillSolidColor() instead. */
    getFillColorRGBA(id: DesignBlockId): RGBA;
    /** @deprecated Use setFillEnabled() instead. */
    setFillColorEnabled(id: DesignBlockId, enabled: boolean): void;
    /** @deprecated Use isFillEnabled() instead. */
    isFillColorEnabled(id: DesignBlockId): boolean;
    createEffect(type: EffectType): DesignBlockId;
    /** @deprecated Use supportsEffects instead. */
    hasEffects(id: DesignBlockId): boolean;
    supportsEffects(id: DesignBlockId): boolean;
    getEffects(id: DesignBlockId): DesignBlockId[];
    insertEffect(id: DesignBlockId, effectId: DesignBlockId, index: number): void;
    appendEffect(id: DesignBlockId, effectId: DesignBlockId): void;
    removeEffect(id: DesignBlockId, index: number): void;
    /** @deprecated Calls to this function can be removed. All effects can be enabled and disabled. */
    hasEffectEnabled(effectId: DesignBlockId): boolean;
    setEffectEnabled(effectId: DesignBlockId, enabled: boolean): void;
    createBlur(type: BlurType): DesignBlockId;
    /** @deprecated Use supportsBlur instead. */
    hasBlur(id: DesignBlockId): boolean;
    supportsBlur(id: DesignBlockId): boolean;
    setBlur(id: DesignBlockId, blurId: DesignBlockId): void;
    getBlur(id: DesignBlockId): DesignBlockId;
    setBlurEnabled(id: DesignBlockId, enabled: boolean): void;
    isBlurEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use supportsBackgroundColor() instead. */
    hasBackgroundColor(id: DesignBlockId): boolean;
    supportsBackgroundColor(id: DesignBlockId): boolean;
    /** @deprecated Use `Use setColor() with the key path 'backgroundColor/color' instead.`. */
    setBackgroundColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void;
    /** @deprecated Use `Use getColor() with the key path 'backgroundColor/color' instead.`. */
    getBackgroundColorRGBA(id: DesignBlockId): RGBA;
    setBackgroundColorEnabled(id: DesignBlockId, enabled: boolean): void;
    isBackgroundColorEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use supportsStroke() instead. */
    hasStroke(id: DesignBlockId): boolean;
    supportsStroke(id: DesignBlockId): boolean;
    setStrokeEnabled(id: DesignBlockId, enabled: boolean): void;
    isStrokeEnabled(id: DesignBlockId): boolean;
    setStrokeOverprint(id: DesignBlockId, overprint: boolean): void;
    getStrokeOverprint(id: DesignBlockId): boolean;
    /** @deprecated Use setStrokeColor() instead. */
    setStrokeColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void;
    setStrokeColor(id: DesignBlockId, color: Color): void;
    /** @deprecated Use getStrokeColor() instead. */
    getStrokeColorRGBA(id: DesignBlockId): RGBA;
    getStrokeColor(id: DesignBlockId): Color;
    setStrokeWidth(id: DesignBlockId, width: number): void;
    getStrokeWidth(id: DesignBlockId): number;
    setStrokeStyle(id: DesignBlockId, style: StrokeStyle): void;
    getStrokeStyle(id: DesignBlockId): StrokeStyle;
    setStrokePosition(id: DesignBlockId, position: StrokePosition): void;
    getStrokePosition(id: DesignBlockId): StrokePosition;
    setStrokeCornerGeometry(id: DesignBlockId, cornerGeometry: StrokeCornerGeometry): void;
    getStrokeCornerGeometry(id: DesignBlockId): StrokeCornerGeometry;
    /** @deprecated Use `setStrokeStartCap` and `setStrokeEndCap` to set each end independently. */
    setStrokeCap(id: DesignBlockId, cap: StrokeCap): void;
    /** @deprecated Use `getStrokeStartCap` and `getStrokeEndCap` instead. */
    getStrokeCap(id: DesignBlockId): StrokeCap;
    setStrokeStartCap(id: DesignBlockId, cap: StrokeCap): void;
    getStrokeStartCap(id: DesignBlockId): StrokeCap;
    setStrokeEndCap(id: DesignBlockId, cap: StrokeCap): void;
    getStrokeEndCap(id: DesignBlockId): StrokeCap;
    setStrokeDashStartCap(id: DesignBlockId, cap: StrokeCap): void;
    getStrokeDashStartCap(id: DesignBlockId): StrokeCap;
    setStrokeDashEndCap(id: DesignBlockId, cap: StrokeCap): void;
    getStrokeDashEndCap(id: DesignBlockId): StrokeCap;
    setStrokeDashArray(id: DesignBlockId, dashArray: number[]): void;
    getStrokeDashArray(id: DesignBlockId): number[];
    setStrokeDashOffset(id: DesignBlockId, dashOffset: number): void;
    getStrokeDashOffset(id: DesignBlockId): number;
    /** @deprecated Use supportsDropShadow() instead. */
    hasDropShadow(id: DesignBlockId): boolean;
    supportsDropShadow(id: DesignBlockId): boolean;
    setDropShadowEnabled(id: DesignBlockId, enabled: boolean): void;
    isDropShadowEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use setDropShadowColor() instead. */
    setDropShadowColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void;
    setDropShadowColor(id: DesignBlockId, color: Color): void;
    /** @deprecated Use getDropShadowColor instead. */
    getDropShadowColorRGBA(id: DesignBlockId): RGBA;
    getDropShadowColor(id: DesignBlockId): Color;
    setDropShadowOffsetX(id: DesignBlockId, offsetX: number): void;
    getDropShadowOffsetX(id: DesignBlockId): number;
    setDropShadowOffsetY(id: DesignBlockId, offsetY: number): void;
    getDropShadowOffsetY(id: DesignBlockId): number;
    setDropShadowBlurRadiusX(id: DesignBlockId, blurRadiusX: number): void;
    getDropShadowBlurRadiusX(id: DesignBlockId): number;
    setDropShadowBlurRadiusY(id: DesignBlockId, blurRadiusY: number): void;
    getDropShadowBlurRadiusY(id: DesignBlockId): number;
    setDropShadowClip(id: DesignBlockId, clip: boolean): void;
    getDropShadowClip(id: DesignBlockId): boolean;
    replaceText(id: DesignBlockId, text: string, from?: number, to?: number): void;
    setTextColor(id: DesignBlockId, color: Color, from?: number, to?: number): void;
    setTextFontWeight(id: DesignBlockId, fontWeight: FontWeight, from?: number, to?: number): void;
    setTextFontSize(id: DesignBlockId, fontSize: number, options?: TextFontSizeOptions): void;
    setTextFontStyle(id: DesignBlockId, fontStyle: FontStyle, from?: number, to?: number): void;
    getTextCases(id: DesignBlockId, from?: number, to?: number): TextCase[];
    setTextCase(id: DesignBlockId, textCase: TextCase, from?: number, to?: number): void;
    setTextDecoration(id: DesignBlockId, config: TextDecorationConfig, from?: number, to?: number): void;
    setTextKerning(id: DesignBlockId, kerning: number, from?: number, to?: number): void;
    getTextKernings(id: DesignBlockId, from?: number, to?: number): number[];
    toggleTextDecorationUnderline(id: DesignBlockId, from?: number, to?: number): void;
    toggleTextDecorationStrikethrough(id: DesignBlockId, from?: number, to?: number): void;
    toggleTextDecorationOverline(id: DesignBlockId, from?: number, to?: number): void;
    getTextHorizontalAlignment(id: DesignBlockId, paragraphIndex?: number): TextHorizontalAlignment | undefined;
    setTextHorizontalAlignment(id: DesignBlockId, alignment: TextHorizontalAlignment | undefined, paragraphIndex?: number): void;
    getTextListStyle(id: DesignBlockId, paragraphIndex: number): ListStyle;
    setTextListStyle(id: DesignBlockId, listStyle: ListStyle, paragraphIndex?: number, listLevel?: number): void;
    getTextListLevel(id: DesignBlockId, paragraphIndex: number): number;
    setTextListLevel(id: DesignBlockId, listLevel: number, paragraphIndex?: number): void;
    getTextParagraphIndices(id: DesignBlockId, from?: number, to?: number): number[];
    setTextLineHeight(id: DesignBlockId, lineHeight: number | null, paragraphIndex?: number): void;
    getTextLineHeight(id: DesignBlockId, paragraphIndex: number): number;
    toggleBoldFont(id: DesignBlockId, from?: number, to?: number): void;
    toggleItalicFont(id: DesignBlockId, from?: number, to?: number): void;
    setFont(id: DesignBlockId, fontFileUri: string, typeface: Typeface): void;
    setTypeface(id: DesignBlockId, typeface: Typeface, from?: number, to?: number): void;
    getTextRuns(id: DesignBlockId, from?: number, to?: number): TextRunInfo[];
    getTextVisibleLineCount(id: DesignBlockId): number;
    setTextOnPath(id: DesignBlockId, svgPath: string | null): void;
    getTextOnPath(id: DesignBlockId): string | null;
    setTextOnPathOffset(id: DesignBlockId, offset: number): void;
    getTextOnPathOffset(id: DesignBlockId): number;
    setTextOnPathFlipped(id: DesignBlockId, flipped: boolean): void;
    getTextOnPathFlipped(id: DesignBlockId): boolean;
    /** @deprecated Use supportsFill instead. */
    hasFill(id: DesignBlockId): boolean;
    supportsFill(id: DesignBlockId): boolean;
    isFillEnabled(id: DesignBlockId): boolean;
    setFillEnabled(id: DesignBlockId, enabled: boolean): void;
    getFillOverprint(id: DesignBlockId): boolean;
    setFillOverprint(id: DesignBlockId, overprint: boolean): void;
    getFill(id: DesignBlockId): DesignBlockId;
    setFill(id: DesignBlockId, fill: DesignBlockId): void;
    setFillSolidColor(id: DesignBlockId, r: number, g: number, b: number, a?: number): void;
    getFillSolidColor(id: DesignBlockId): RGBA;
    setPlaceholderEnabled(id: DesignBlockId, enabled: boolean): void;
    isPlaceholderEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use supportsPlaceholderBehavior instead. */
    hasPlaceholderBehavior(id: DesignBlockId): boolean;
    supportsPlaceholderBehavior(id: DesignBlockId): boolean;
    setPlaceholderBehaviorEnabled(id: DesignBlockId, enabled: boolean): void;
    isPlaceholderBehaviorEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use supportsPlaceholderControls instead. */
    hasPlaceholderControls(id: DesignBlockId): boolean;
    supportsPlaceholderControls(id: DesignBlockId): boolean;
    hasMetadata(id: DesignBlockId, key: string): boolean;
    setScopeEnabled(id: DesignBlockId, key: Scope, enabled: boolean): void;
    isScopeEnabled(id: DesignBlockId, key: Scope): boolean;
    isAllowedByScope(id: DesignBlockId, key: Scope): boolean;
    /** @deprecated Use supportsDuration instead. */
    hasDuration(id: DesignBlockId): boolean;
    supportsDuration(id: DesignBlockId): boolean;
    setDuration(id: DesignBlockId, duration: number): void;
    getDuration(id: DesignBlockId): number;
    supportsPageDurationSource(page: DesignBlockId, id: DesignBlockId): boolean;
    /** @deprecated Use supportsTimeOffset instead. */
    hasTimeOffset(id: DesignBlockId): boolean;
    supportsTimeOffset(id: DesignBlockId): boolean;
    setTimeOffset(id: DesignBlockId, offset: number): void;
    getTimeOffset(id: DesignBlockId): number;
    /** @deprecated Use supportsTrim instead. */
    hasTrim(id: DesignBlockId): boolean;
    supportsTrim(id: DesignBlockId): boolean;
    setTrimOffset(id: DesignBlockId, offset: number): void;
    getTrimOffset(id: DesignBlockId): number;
    setTrimLength(id: DesignBlockId, length: number): void;
    getTrimLength(id: DesignBlockId): number;
    setPlaying(id: DesignBlockId, enabled: boolean): void;
    isPlaying(id: DesignBlockId): boolean;
    /** @deprecated Use supportsPlaybackTime instead. */
    hasPlaybackTime(id: DesignBlockId): boolean;
    supportsPlaybackTime(id: DesignBlockId): boolean;
    setPlaybackTime(id: DesignBlockId, time: number): void;
    getPlaybackTime(id: DesignBlockId): number;
    setSoloPlaybackEnabled(id: DesignBlockId, enabled: boolean): void;
    isSoloPlaybackEnabled(id: DesignBlockId): boolean;
    /** @deprecated Use supportsPlaybackControl instead */
    hasPlaybackControl(id: DesignBlockId): boolean;
    supportsPlaybackControl(id: DesignBlockId): boolean;
    setLooping(id: DesignBlockId, looping: boolean): void;
    isLooping(id: DesignBlockId): boolean;
    setMuted(id: DesignBlockId, muted: boolean): void;
    isMuted(id: DesignBlockId): boolean;
    setVolume(id: DesignBlockId, volume: number): void;
    getVolume(id: DesignBlockId): number;
    setPlaybackSpeed(id: DesignBlockId, speed: number): void;
    getPlaybackSpeed(id: DesignBlockId): number;
    createAnimation(type: AnimationType): DesignBlockId;
    supportsAnimation(id: DesignBlockId): boolean;
    setInAnimation(id: DesignBlockId, animation: DesignBlockId): void;
    setLoopAnimation(id: DesignBlockId, animation: DesignBlockId): void;
    setOutAnimation(id: DesignBlockId, animation: DesignBlockId): void;
    getInAnimation(id: DesignBlockId): DesignBlockId;
    getLoopAnimation(id: DesignBlockId): DesignBlockId;
    getOutAnimation(id: DesignBlockId): DesignBlockId;
    supportsTransition(id: DesignBlockId): boolean;
    forceLoadResources(ids: DesignBlockId[]): Promise<void>;
// ---- EditorAPI (editor-UI members) ----
    setEditMode(mode: EditMode, baseMode?: string): void;
    getEditMode(): EditMode;
    hasSelectedVectorNode(): boolean;
    hasSelectedVectorControlPoint(): boolean;
    getCursorType(): 'Arrow' | 'Move' | 'MoveNotPermitted' | 'Resize' | 'Rotate' | 'Text' | 'Cell';
    getCursorRotation(): number;
    createHistory(): HistoryId;
    destroyHistory(history: HistoryId): void;
    setActiveHistory(history: HistoryId): void;
    getActiveHistory(): HistoryId;
    addUndoStep(): void;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    findAllScopes(): Scope[];
    setGlobalScope(key: Scope, value: 'Allow' | 'Deny' | 'Defer'): void;
    getGlobalScope(key: Scope): 'Allow' | 'Deny' | 'Defer';
    isHighlightingEnabled(id: DesignBlockId): boolean;
    setHighlightingEnabled(id: DesignBlockId, enabled: boolean): void;
    isSelectionEnabled(id: DesignBlockId): boolean;
    setSelectionEnabled(id: DesignBlockId, enabled: boolean): void;
    getMovementConstraint(id: DesignBlockId): ResolvedMovementConstraint;
// ---- SceneAPI (editor-UI members) ----
    loadFromString(sceneContent: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>;
    loadFromURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>;
    loadFromArchiveURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>;
    saveToString(options?: {
        allowedResourceSchemes?: string[];
        onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>;
        compression?: {
            format?: CompressionFormat_2;
            level?: CompressionLevel;
        };
    }): Promise<string>;
    saveToArchive(options?: SaveToArchiveOptions): Promise<Blob>;
    create(sceneLayout?: SceneLayout, options?: CreateSceneOptions): DesignBlockId;
    setZoomLevel(zoomLevel?: number): void;
    getZoomLevel(): number;
    zoomToBlock(id: DesignBlockId, options?: ZoomOptions): Promise<void>;
    enableZoomAutoFit(id: DesignBlockId, axis: 'Horizontal' | 'Vertical', paddingBefore?: number, paddingAfter?: number): void;
    enableZoomAutoFit(id: DesignBlockId, axis: 'Both', paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): void;
    disableZoomAutoFit(blockOrScene: DesignBlockId): void;
    isZoomAutoFitEnabled(blockOrScene: DesignBlockId): boolean;
    unstable_enableCameraZoomClamping(ids: DesignBlockId[], minZoomLimit?: number, maxZoomLimit?: number, paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): void;
    unstable_disableCameraZoomClamping(blockOrScene?: number | null): void;
    unstable_isCameraZoomClampingEnabled(blockOrScene?: number | null): boolean;
    setPlaying(play: boolean): void;
// ---- VariableAPI (editor-UI members) ----
    setString(key: string, value: string): void;
    getString(key: string): string;

// ---- types referenced only by extended members ----
interface AssetResultCredits {
    name: string;
    url: string;
}
interface AssetResultLicense {
    name: string;
    url: string;
}
type AudioExportOptions = {
    mimeType?: AudioMimeType;
    onProgress?: (numberOfRenderedFrames: number, numberOfEncodedFrames: number, totalNumberOfFrames: number) => void;
    timeOffset?: number;
    duration?: number;
    sampleRate?: number;
    numberOfChannels?: number;
    skipEncoding?: boolean;
    abortSignal?: AbortSignal;
};
type AudioFromVideoOptions = {
    keepTrimSettings?: boolean;
    muteOriginalVideo?: boolean;
};
interface AudioTrackInfo {
    audioCodec: string;
    channels: number;
    sampleRate: number;
    audioDuration: number;
    numAudioPackets: number;
    numAudioFrames: number;
    trackName: string;
    trackIndex: number;
    language: string;
}
type BlockEnumType = {
    'blend/mode': BlendMode;
    'contentFill/horizontalAlignment': HorizontalContentFillAlignment;
    'contentFill/mode': ContentFillMode;
    'contentFill/verticalAlignment': VerticalContentFillAlignment;
    'height/mode': HeightMode;
    'position/x/mode': PositionXMode;
    'position/y/mode': PositionYMode;
    'scene/colorConversionMode': SceneColorConversionMode;
    'scene/designUnit': DesignUnit;
    'scene/fontSizeUnit': FontSizeUnit;
    'scene/layout': SceneLayout;
    'scene/mode': SceneMode;
    'width/mode': WidthMode;
    'page/guides/source': PageGuidesSource;
    'stroke/cap': StrokeCap;
    'stroke/cornerGeometry': StrokeCornerGeometry;
    'stroke/dashEndCap': StrokeDashEndCap;
    'stroke/dashStartCap': StrokeDashStartCap;
    'stroke/endCap': StrokeEndCap;
    'stroke/position': StrokePosition;
    'stroke/startCap': StrokeStartCap;
    'stroke/style': StrokeStyle;
    'playback/fadeIn/easing': PlaybackFadeInEasing;
    'playback/fadeOut/easing': PlaybackFadeOutEasing;
    'text/horizontalAlignment': TextHorizontalAlignment;
    'text/verticalAlignment': TextVerticalAlignment;
    'cutout/type': CutoutType;
    'caption/horizontalAlignment': CaptionHorizontalAlignment;
    'caption/verticalAlignment': CaptionVerticalAlignment;
    animationEasing: AnimationEasing;
    textAnimationWritingStyle: TextAnimationWritingStyle;
    'animation/grow/direction': AnimationGrowDirection;
    'animation/wipe/direction': AnimationWipeDirection;
    'animation/baseline/direction': AnimationBaselineDirection;
    'animation/spin/direction': AnimationSpinDirection;
    'animation/spin_loop/direction': AnimationSpinLoopDirection;
    'animation/jump_loop/direction': AnimationJumpLoopDirection;
    'animation/typewriter_text/writingStyle': AnimationTypewriterTextWritingStyle;
    'animation/block_swipe_text/direction': AnimationBlockSwipeTextDirection;
    'animation/merge_text/direction': AnimationMergeTextDirection;
    'animation/ken_burns/direction': AnimationKenBurnsDirection;
    'fill/pixelStream/orientation': FillPixelStreamOrientation;
    'shape/vector_path/fillRule': ShapeVectorPathFillRule;
};
type BlurType = 'uniform' | 'linear' | 'mirrored' | 'radial'; // each also valid as '//ly.img.ubq/blur/<name>'
type BlurTypeLonghand = `//ly.img.ubq/blur/${BlurTypeShorthand}`;
interface Buffer_2 {
    handle: string;
    buffer: Uint8Array;
}
type EditMode = 'Transform' | 'Crop' | 'Text' | 'Playback' | 'Trim' | 'Vector' | (string & {});
type EffectType = 'adjustments' | 'cross_cut' | 'dot_pattern' | 'duotone_filter' | 'extrude_blur' | 'glow' | 'green_screen' | 'half_tone' | 'linocut' | 'liquid' | 'lut_filter' | 'mirror' | 'outliner' | 'pixelize' | 'posterize' | 'radial_pixel' | 'recolor' | 'sharpie' | 'shifter' | 'tilt_shift' | 'tv_glitch' | 'vignette'; // each also valid as '//ly.img.ubq/effect/<name>'
type EffectTypeLonghand = `//ly.img.ubq/effect/${EffectTypeShorthand}`;
interface EnginePlugin {
    name: string;
    version: string;
    initialize: (context: EnginePluginContext) => void | Promise<void>;
}
type EnumValues = BlendMode | HorizontalContentFillAlignment | ContentFillMode | VerticalContentFillAlignment | HeightMode | PositionXMode | PositionYMode | SceneColorConversionMode | DesignUnit | FontSizeUnit | SceneLayout | SceneMode | WidthMode | PageGuidesSource | StrokeCap | StrokeCornerGeometry | StrokeDashEndCap | StrokeDashStartCap | StrokeEndCap | StrokePosition | StrokeStartCap | StrokeStyle | PlaybackFadeInEasing | PlaybackFadeOutEasing | TextHorizontalAlignment | TextVerticalAlignment | CutoutType | CaptionHorizontalAlignment | CaptionVerticalAlignment | AnimationEasing | TextAnimationWritingStyle | AnimationGrowDirection | AnimationWipeDirection | AnimationBaselineDirection | AnimationSpinDirection | AnimationSpinLoopDirection | AnimationJumpLoopDirection | AnimationTypewriterTextWritingStyle | AnimationBlockSwipeTextDirection | AnimationMergeTextDirection | AnimationKenBurnsDirection | FillPixelStreamOrientation | ShapeVectorPathFillRule | (string & {});
type ExportOptions = {
    mimeType?: ImageMimeType | Exclude<ApplicationMimeType, 'application/zip'>;
    pngCompressionLevel?: number;
    jpegQuality?: number;
    webpQuality?: number;
    targetWidth?: number;
    targetHeight?: number;
    exportPdfWithHighCompatibility?: boolean;
    exportPdfWithUnderlayer?: boolean;
    underlayerSpotColorName?: string;
    underlayerOffset?: number;
    underlayerRenderRatio?: number;
    underlayerMaxError?: number;
    allowTextOverhang?: boolean;
    exportPdfWithDeviceCMYK?: boolean;
    exportPdfWithCropMarks?: boolean;
    exportPdfWithRegistrationMarks?: boolean;
    printMarkOffset?: number;
    printMarkWidth?: number;
    cropMarkLength?: number;
    pdfImageQuality?: number;
    pdfChunkSize?: number;
    onProgress?: (exportedPages: number, totalPages: number) => void;
    abortSignal?: AbortSignal;
};
type FillType = 'color' | 'gradient/linear' | 'gradient/radial' | 'gradient/conical' | 'image' | 'video' | 'pixelStream' | 'stripe'; // each also valid as '//ly.img.ubq/fill/<name>'
type FillTypeLonghand = `//ly.img.ubq/fill/${FillTypeShorthand}`;
interface FindAssetsQuery {
    perPage: number;
    page: number;
    query: string;
    tags: string[];
    groups: string[];
    excludeGroups: string[];
    locale: string;
    sortingOrder: SortingOrder;
    sortKey: string;
    sortActiveFirst: boolean;
    filter: AssetFilter[];
    facets: AssetFacetPath[];
}
interface Flip {
    horizontal: boolean;
    vertical: boolean;
}
type GradientstopRGBA = [
    stop: number,
    r: number,
    g: number,
    b: number,
    a: number
];
type HistoryId = number;
type HorizontalBlockAlignment = 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
function isCMYKColor(color: Color): color is CMYKColor;
function isRGBAColor(color: Color): color is RGBAColor;
function isSpotColor(color: Color): color is SpotColor;
type ObjectType = ObjectTypeShorthand | ObjectTypeLonghand;
interface PageDuration {
    pageId: DesignBlockId;
    duration: number;
    start: number;
    end: number;
}
type PaletteColor = HexColorString | RGBColor | RGBAColor | SpotColor;
type ResolvedMovementConstraint = {
    overshoot: number;
} | null;
interface SaveToArchiveOptions {
    compression?: CompressionOptions;
}
interface SaveToStringOptions {
    resourceSchemesAllowed?: string[];
    persistenceCallback?: (url: string, dataHash: string, persistedCallback?: {
        invoke(url: string, persistedUrl: string): void;
    }) => void;
    compression?: CompressionOptions;
}
type SettingEnumPropertyName = 'touch/pinchAction' | 'touch/rotateAction' | 'camera/clamping/overshootMode' | 'controlGizmo/moveHandleVisibility' | 'controlGizmo/resizeHandlesVisibility' | 'controlGizmo/scaleHandlesVisibility' | 'controlGizmo/rotateHandlesVisibility' | 'doubleClickSelectionMode' | 'colorPicker/colorMode' | 'timeline/trackVisibility' | (string & {});
type SettingEnumValues = TouchPinchAction | TouchRotateAction | CameraClampingOvershootMode | ControlGizmoMoveHandleVisibility | ControlGizmoResizeHandlesVisibility | ControlGizmoScaleHandlesVisibility | ControlGizmoRotateHandlesVisibility | DoubleClickSelectionMode | ColorPickerColorMode | TimelineTrackVisibility | (string & {});
type SettingsEnum = SettingEnumType;
type ShapeType = 'rect' | 'line' | 'ellipse' | 'polygon' | 'star' | 'vector_path'; // each also valid as '//ly.img.ubq/shape/<name>'
type ShapeTypeLonghand = `//ly.img.ubq/shape/${ShapeTypeShorthand}`;
interface Size2 {
    width: number;
    height: number;
}
type Subscription = number;
interface TextRunInfo {
    from: number;
    to: number;
    text: string;
    color: Color;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    fontSize: number;
    textCase: TextCase;
    typeface: Typeface;
    resolvedFontFileUri: string;
    textDecoration: TextDecorationConfig;
    kerning: number;
}
interface UBQAudioFromVideoOptions {
    keepTrimSettings: boolean;
    muteOriginalVideo: boolean;
}
interface UBQExportAudioOptions {
    sampleRate: number;
    numberOfChannels: number;
    skipEncoding?: boolean;
}
interface UBQExportOptions {
    jpegQuality: number;
    webpQuality: number;
    pngCompressionLevel: number;
    useTargetSize: boolean;
    targetWidth: number;
    targetHeight: number;
    exportPdfWithHighCompatibility: boolean;
    exportPdfWithUnderlayer: boolean;
    underlayerSpotColorName: string;
    underlayerOffset: number;
    underlayerRenderRatio: number;
    underlayerMaxError: number;
    allowTextOverhang: boolean;
    exportPdfWithDeviceCMYK: boolean;
    exportPdfWithCropMarks: boolean;
    exportPdfWithRegistrationMarks: boolean;
    printMarkOffset: number;
    cropMarkLength: number;
    printMarkWidth: number;
    pdfImageQuality: number;
    pdfChunkSize: number;
}
interface UBQExportVideoOptions {
    h264Profile: number;
    h264Level: number;
    framerate: number;
    videoBitrate: number;
    audioBitrate: number;
    useTargetSize: boolean;
    targetWidth: number;
    targetHeight: number;
    allowTextOverhang: boolean;
}
interface UBQSplitOptions {
    attachToParent: boolean;
    createParentTrackIfNeeded: boolean;
    selectNewBlock: boolean;
}
interface Vec2 {
    x: number;
    y: number;
}
interface Vec3 {
    x: number;
    y: number;
    z: number;
}
type VerticalBlockAlignment = 'Top' | 'Bottom' | 'Center';
type VideoExportOptions = {
    mimeType?: VideoMimeType;
    onProgress?: (numberOfRenderedFrames: number, numberOfEncodedFrames: number, totalNumberOfFrames: number) => void;
    h264Profile?: number;
    h264Level?: number;
    videoBitrate?: number | VideoBitrateMode;
    audioBitrate?: number;
    timeOffset?: number;
    duration?: number;
    framerate?: number;
    targetWidth?: number;
    targetHeight?: number;
    allowTextOverhang?: boolean;
    abortSignal?: AbortSignal;
};
type ZoomAutoFitAxis = 'Horizontal' | 'Vertical' | 'Both';
type ZoomOptions = {
    padding?: number | {
        x?: number;
        y?: number;
    } | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    animate?: boolean | {
        duration?: number;
        easing?: AnimationEasing;
        interruptible?: boolean;
    };
};

// ---- types referenced only by extended members ----
type AnimationBaselineDirection = 'Up' | 'Right' | 'Down' | 'Left';
type AnimationBlockSwipeTextDirection = 'Up' | 'Right' | 'Down' | 'Left';
type AnimationGrowDirection = 'Horizontal' | 'Vertical' | 'All' | 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
type AnimationJumpLoopDirection = 'Up' | 'Right' | 'Down' | 'Left';
type AnimationKenBurnsDirection = 'Up' | 'Right' | 'Down' | 'Left';
type AnimationMergeTextDirection = 'Right' | 'Left';
type AnimationSpinDirection = 'Clockwise' | 'CounterClockwise';
type AnimationSpinLoopDirection = 'Clockwise' | 'CounterClockwise';
type AnimationTypewriterTextWritingStyle = 'Character' | 'Word';
type AnimationWipeDirection = 'Up' | 'Right' | 'Down' | 'Left';
type ApplicationMimeType = Extract<MimeType_2, 'application/octet-stream' | 'application/pdf' | 'application/zip'>;
type AudioMimeType = Extract<MimeType_2, 'audio/wav' | 'audio/mp4'>;
type BlendMode = 'PassThrough' | 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'LinearBurn' | 'DarkenColor' | 'Lighten' | 'Screen' | 'ColorDodge' | 'LinearDodge' | 'LightenColor' | 'Overlay' | 'SoftLight' | 'HardLight' | 'VividLight' | 'LinearLight' | 'PinLight' | 'HardMix' | 'Difference' | 'Exclusion' | 'Subtract' | 'Divide' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';
type CaptionHorizontalAlignment = 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
type CaptionVerticalAlignment = 'Top' | 'Bottom' | 'Center';
interface CompressionOptions {
    format?: CompressionFormat_2;
    level?: CompressionLevel;
}
type ContentFillMode = 'Crop' | 'Cover' | 'Contain';
type EnginePluginContext = {
    engine: CreativeEngine;
};
type FillPixelStreamOrientation = 'Up' | 'Down' | 'Left' | 'Right' | 'UpMirrored' | 'DownMirrored' | 'LeftMirrored' | 'RightMirrored';
type HeightMode = 'Absolute' | 'Percent' | 'Auto';
type HexColorString = string;
type HorizontalContentFillAlignment = 'Left' | 'Center' | 'Right';
type ImageMimeType = Extract<MimeType_2, 'image/png' | 'image/jpeg' | 'image/webp' | 'image/x-tga' | 'image/svg+xml'>;
type ObjectTypeLonghand = DesignBlockTypeLonghand | ShapeTypeLonghand | FillTypeLonghand | EffectTypeLonghand | BlurTypeLonghand | AnimationTypeLonghand | TransitionTypeLonghand;
type ObjectTypeShorthand = DesignBlockTypeShorthand | `shape/${ShapeTypeShorthand}` | `fill/${FillTypeShorthand}` | `effect/${EffectTypeShorthand}` | `blur/${BlurTypeShorthand}` | `animation/${AnimationTypeShorthand}` | `transition/${TransitionTypeShorthand}`;
type PageGuidesSource = 'Document' | 'Custom';
type PlaybackFadeInEasing = 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
type PlaybackFadeOutEasing = 'Linear' | 'EaseIn' | 'EaseOut' | 'EaseInOut' | 'EaseInQuart' | 'EaseOutQuart' | 'EaseInOutQuart' | 'EaseInQuint' | 'EaseOutQuint' | 'EaseInOutQuint' | 'EaseInBack' | 'EaseOutBack' | 'EaseInOutBack' | 'EaseInSpring' | 'EaseOutSpring' | 'EaseInOutSpring';
type PositionXMode = 'Absolute' | 'Percent' | 'Auto';
type PositionYMode = 'Absolute' | 'Percent' | 'Auto';
type SceneColorConversionMode = 'Managed' | 'Legacy';
type ShapeVectorPathFillRule = 'EvenOdd' | 'NonZero';
type StrokeCap = 'Butt' | 'Round' | 'Square';
type StrokeCornerGeometry = 'Bevel' | 'Miter' | 'Round';
type StrokeDashEndCap = 'Butt' | 'Round' | 'Square';
type StrokeDashStartCap = 'Butt' | 'Round' | 'Square';
type StrokeEndCap = 'Butt' | 'Round' | 'Square';
type StrokePosition = 'Center' | 'Inner' | 'Outer';
type StrokeStartCap = 'Butt' | 'Round' | 'Square';
type StrokeStyle = 'Dashed' | 'DashedRound' | 'Dotted' | 'LongDashed' | 'LongDashedRound' | 'Solid';
type TextAnimationWritingStyle = 'Block' | 'Line' | 'Character' | 'Word';
type TextHorizontalAlignment = 'Left' | 'Right' | 'Center' | 'Justify' | 'Auto';
type TextVerticalAlignment = 'Top' | 'Bottom' | 'Center';
type VerticalContentFillAlignment = 'Top' | 'Center' | 'Bottom';
type VideoBitrateMode = 'System' | 'Auto';
type VideoMimeType = Extract<MimeType_2, 'video/mp4'>;
type WidthMode = 'Absolute' | 'Percent' | 'Auto';

// ---- types referenced only by extended members ----
type BlurTypeShorthand = 'uniform' | 'linear' | 'mirrored' | 'radial';
enum CompressionFormat_2 {
    None = 0,
    Zstd = 1
}
enum CompressionLevel {
    Fastest = 0,
    Default = 1,
    Best = 2
}
type EffectTypeShorthand = 'adjustments' | 'cross_cut' | 'dot_pattern' | 'duotone_filter' | 'extrude_blur' | 'glow' | 'green_screen' | 'half_tone' | 'linocut' | 'liquid' | 'lut_filter' | 'mirror' | 'outliner' | 'pixelize' | 'posterize' | 'radial_pixel' | 'recolor' | 'sharpie' | 'shifter' | 'tilt_shift' | 'tv_glitch' | 'vignette';
type FillTypeShorthand = 'color' | 'gradient/linear' | 'gradient/radial' | 'gradient/conical' | 'image' | 'video' | 'pixelStream' | 'stripe';
type ShapeTypeShorthand = 'rect' | 'line' | 'ellipse' | 'polygon' | 'star' | 'vector_path';
