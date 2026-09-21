> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Classes

| Class | Description |
| ------ | ------ |
| [AssetAPI](./api/node/classes/assetapi.md) | Manage asset sources and apply assets to scenes. |
| [BlockAPI](./api/node/classes/blockapi.md) | Create, manipulate, and query the building blocks of your design. |
| [CreativeEngine](./api/node/classes/creativeengine.md) | The CreativeEngine is the core processing unit of CE.SDK and handles state management, rendering, input handling, and much more. It provides APIs to directly interact with assets, blocks, scenes, and variables. These APIs can be used in a headless environment to build and manipulate designs programmatically, or in a browser to create interactive applications. |
| [EditorAPI](./api/node/classes/editorapi.md) | - |
| [EngineActions](./api/node/classes/engineactions.md) | Named, overridable actions for one engine. Actions are either JS closures you register or engine defaults (e.g. undo/redo), and either kind can override the other by reusing the id. |
| [EventAPI](./api/node/classes/eventapi.md) | Subscribe to block lifecycle events in the design engine. |
| [SceneAPI](./api/node/classes/sceneapi.md) | Create, load, save, and manipulate scenes. |
| [VariableAPI](./api/node/classes/variableapi.md) | Manage text variables within design templates. |

## Functions

| Function | Description |
| ------ | ------ |
| [isCMYKColor](./api/node/functions/iscmykcolor.md) | Type guard for [CMYKColor](./api/node/interfaces/cmykcolor.md). |
| [isRGBAColor](./api/node/functions/isrgbacolor.md) | Type guard for [RGBAColor](./api/node/interfaces/rgbacolor.md). |
| [isSpotColor](./api/node/functions/isspotcolor.md) | Type guard for [SpotColor](./api/node/interfaces/spotcolor.md). |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AddImageOptions](./api/node/type-aliases/addimageoptions.md) | Options for adding images to the scene. |
| [AnimationBaselineDirection](./api/node/type-aliases/animationbaselinedirection.md) | - |
| [AnimationBlockSwipeTextDirection](./api/node/type-aliases/animationblockswipetextdirection.md) | - |
| [AnimationEasing](./api/node/type-aliases/animationeasing.md) | - |
| [AnimationEntry](./api/node/type-aliases/animationentry.md) | Configuration options for animations. |
| [AnimationGrowDirection](./api/node/type-aliases/animationgrowdirection.md) | - |
| [AnimationJumpLoopDirection](./api/node/type-aliases/animationjumploopdirection.md) | - |
| [AnimationKenBurnsDirection](./api/node/type-aliases/animationkenburnsdirection.md) | - |
| [AnimationMergeTextDirection](./api/node/type-aliases/animationmergetextdirection.md) | - |
| [AnimationOptions](./api/node/type-aliases/animationoptions.md) | Options for configuring animations (in, loop, out animations). |
| [AnimationSpinDirection](./api/node/type-aliases/animationspindirection.md) | - |
| [AnimationSpinLoopDirection](./api/node/type-aliases/animationspinloopdirection.md) | - |
| [AnimationType](./api/node/type-aliases/animationtype.md) | The block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. Refer to [AnimationTypeShorthand](./api/node/type-aliases/animationtypeshorthand.md) and [AnimationTypeLonghand](./api/node/type-aliases/animationtypelonghand.md) for more details. |
| [AnimationTypeLonghand](./api/node/type-aliases/animationtypelonghand.md) | The longhand block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. |
| [AnimationTypeShorthand](./api/node/type-aliases/animationtypeshorthand.md) | - |
| [AnimationTypewriterTextWritingStyle](./api/node/type-aliases/animationtypewritertextwritingstyle.md) | - |
| [AnimationWipeDirection](./api/node/type-aliases/animationwipedirection.md) | - |
| [ApplicationMimeType](./api/node/type-aliases/applicationmimetype.md) | Represents the application MIME types used in the editor. |
| [AssetColor](./api/node/type-aliases/assetcolor.md) | Asset Color payload |
| [AssetFacetPath](./api/node/type-aliases/assetfacetpath.md) | Property paths that can be faceted — the facetable subset of `AssetPropertyPath`. `label` and `id` are excluded because their cardinality is unbounded. |
| [AssetFilter](./api/node/type-aliases/assetfilter.md) | Filter expression — predicate or logical combinator. Combinators nest arbitrarily. The union is mutually exclusive: an object with both `and` and `or`, or with `property` next to a combinator key, is rejected at the type level. |
| [AssetGroups](./api/node/type-aliases/assetgroups.md) | An asset can be member of multiple groups. Groups have a semantic meaning used to build and group UIs exploring the assets, e.g.sections in the content library, or for things like topics in Unsplash for instance. |
| [AssetMetaData](./api/node/type-aliases/assetmetadata.md) | Generic asset information |
| [AssetProperty](./api/node/type-aliases/assetproperty.md) | Asset property for payload |
| [AssetPropertyFilter](./api/node/type-aliases/assetpropertyfilter.md) | A single property predicate. Exactly one of `contains` (case-insensitive substring) or `equals` (case-insensitive equality) must be set — the type forbids passing both or neither. On a string-array property (`tags`, `groups`), the operator matches if any element matches. `meta.<key>` values are flat strings, compared whole. |
| [AssetPropertyPath](./api/node/type-aliases/assetpropertypath.md) | Dot-path against the resolved asset that a property predicate targets: `label`, `id`, `tags`, `groups`, or `meta.<key>` (one segment). |
| [AssetStylePresetAnimationProperties](./api/node/type-aliases/assetstylepresetanimationproperties.md) | The parameters of an [AssetStylePresetAnimation](./api/node/interfaces/assetstylepresetanimation.md): a map of the animation's property paths to values. The animation's `animation/*` properties (e.g. `animation/slide/fade`, `animation/grow/scaleFactor`) are value-checked and autocomplete, as are the animation controls (`playback/duration`, `animationEasing`, `textWritingStyle`, `textWritingOverlap`); any other property path is still accepted. These are animation paths, distinct from the block-property paths in [AssetStylePresetProperties](./api/node/type-aliases/assetstylepresetproperties.md). |
| [AssetStylePresetProperties](./api/node/type-aliases/assetstylepresetproperties.md) | The look of an [AssetStylePreset](./api/node/interfaces/assetstylepreset.md): a map of property paths to values. Known paths are value-checked and autocomplete (e.g. `stroke/enabled` must be a boolean, `stroke/width` a number, `fill/solid/color` a color); any other property path is still accepted with the broader [AssetStylePresetPropertyValue](./api/node/type-aliases/assetstylepresetpropertyvalue.md). Keys without a `/` are namespaced to the block (`text/` or `caption/`); keys with a `/` are used verbatim. |
| [AssetStylePresetPropertyValue](./api/node/type-aliases/assetstylepresetpropertyvalue.md) | A value a style preset can set on a property: a boolean, number, string (including enum values) or an RGB(A) color. Colors must be RGB(A) (`{ r, g, b, a? }`); CMYK and spot colors are not supported in presets. Structs and source sets cannot be set from a preset. A `null` value is ignored for regular properties; for the virtual `text/path` property it clears the baseline path. |
| [AssetStylePresetScalableProperty](./api/node/type-aliases/assetstylepresetscalableproperty.md) | A length property a style preset may scale with the block's font size (see [AssetStylePreset.scaleWithFontSize](./api/node/interfaces/assetstylepreset.md)). Restricted to the decoration lengths for which scaling is meaningful — stroke width, drop-shadow offset/blur and the caption background corner radius — not arbitrary numeric properties like `rotation` or `opacity`. |
| [AssetTransformPreset](./api/node/type-aliases/assettransformpreset.md) | Transform preset payload |
| [AsyncURIResolver](./api/node/type-aliases/asyncuriresolver.md) | An async-compatible URI resolver function. |
| [AudioExportOptions](./api/node/type-aliases/audioexportoptions.md) | Represents the options for exporting audio. |
| [AudioFromVideoOptions](./api/node/type-aliases/audiofromvideooptions.md) | Options for configuring audio extraction from video operations. |
| [AudioMimeType](./api/node/type-aliases/audiomimetype.md) | Represents the audio MIME types used in the editor. |
| [BlendMode](./api/node/type-aliases/blendmode.md) | - |
| [BlockEnumType](./api/node/type-aliases/blockenumtype.md) | - |
| [BlockState](./api/node/type-aliases/blockstate.md) | Represents the state of a design block. |
| [BlurType](./api/node/type-aliases/blurtype.md) | The block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. Refer to [BlurTypeShorthand](./api/node/type-aliases/blurtypeshorthand.md) and [BlurTypeLonghand](./api/node/type-aliases/blurtypelonghand.md) for more details. |
| [BlurTypeLonghand](./api/node/type-aliases/blurtypelonghand.md) | The longhand block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. |
| [BlurTypeShorthand](./api/node/type-aliases/blurtypeshorthand.md) | - |
| [BooleanOperation](./api/node/type-aliases/booleanoperation.md) | Represents the names of boolean operations. |
| [BoolPropertyName](./api/node/type-aliases/boolpropertyname.md) | - |
| [CameraClampingOvershootMode](./api/node/type-aliases/cameraclampingovershootmode.md) | - |
| [CaptionHorizontalAlignment](./api/node/type-aliases/captionhorizontalalignment.md) | - |
| [CaptionVerticalAlignment](./api/node/type-aliases/captionverticalalignment.md) | - |
| [CMYK](./api/node/type-aliases/cmyk.md) | Represents a color in the CMYK color space. |
| [Color](./api/node/type-aliases/color.md) | Represents all color types supported by the engine. |
| [ColorPickerColorMode](./api/node/type-aliases/colorpickercolormode.md) | - |
| [ColorPropertyName](./api/node/type-aliases/colorpropertyname.md) | - |
| [ColorSpace](./api/node/type-aliases/colorspace.md) | Represents the color space used in the editor. |
| [ContentFillMode](./api/node/type-aliases/contentfillmode.md) | - |
| [ControlGizmoMoveHandleVisibility](./api/node/type-aliases/controlgizmomovehandlevisibility.md) | - |
| [ControlGizmoResizeHandlesVisibility](./api/node/type-aliases/controlgizmoresizehandlesvisibility.md) | - |
| [ControlGizmoRotateHandlesVisibility](./api/node/type-aliases/controlgizmorotatehandlesvisibility.md) | - |
| [ControlGizmoScaleHandlesVisibility](./api/node/type-aliases/controlgizmoscalehandlesvisibility.md) | - |
| [CreateSceneOptions](./api/node/type-aliases/createsceneoptions.md) | Options for creating a video scene. |
| [CutoutOperation](./api/node/type-aliases/cutoutoperation.md) | Represents the type of a cutout. |
| [CutoutType](./api/node/type-aliases/cutouttype.md) | - |
| [~~DefaultAssetSourceId~~](./api/node/type-aliases/defaultassetsourceid.md) | Represents the default asset source IDs used in the editor. |
| [~~DemoAssetSourceId~~](./api/node/type-aliases/demoassetsourceid.md) | Represents the default demo asset source IDs used in the editor. |
| [DesignBlockId](./api/node/type-aliases/designblockid.md) | A numerical identifier for a design block |
| [DesignBlockType](./api/node/type-aliases/designblocktype.md) | The block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. Refer to [DesignBlockTypeShorthand](./api/node/type-aliases/designblocktypeshorthand.md) and [DesignBlockTypeLonghand](./api/node/type-aliases/designblocktypelonghand.md) for more details. |
| [DesignBlockTypeLonghand](./api/node/type-aliases/designblocktypelonghand.md) | The longhand block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. |
| [DesignBlockTypeShorthand](./api/node/type-aliases/designblocktypeshorthand.md) | - |
| [DoubleClickSelectionMode](./api/node/type-aliases/doubleclickselectionmode.md) | - |
| [DoublePropertyName](./api/node/type-aliases/doublepropertyname.md) | - |
| [DropShadowOptions](./api/node/type-aliases/dropshadowoptions.md) | Options for configuring drop shadow effects on blocks. |
| [EditMode](./api/node/type-aliases/editmode.md) | Represents the current edit mode of the editor. |
| [EffectType](./api/node/type-aliases/effecttype.md) | The block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. Refer to [EffectTypeShorthand](./api/node/type-aliases/effecttypeshorthand.md) and [EffectTypeLonghand](./api/node/type-aliases/effecttypelonghand.md) for more details. |
| [EffectTypeLonghand](./api/node/type-aliases/effecttypelonghand.md) | The longhand block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. |
| [EffectTypeShorthand](./api/node/type-aliases/effecttypeshorthand.md) | - |
| [EngineActionId](./api/node/type-aliases/engineactionid.md) | Known action ids from [EngineActionsRegistry](./api/node/interfaces/engineactionsregistry.md). |
| [EngineCapability](./api/node/type-aliases/enginecapability.md) | A platform capability queryable via `EditorAPI.isCapabilitySupported`. |
| [EngineCustomActionFunction](./api/node/type-aliases/enginecustomactionfunction.md) | A generic, untyped action function for custom ids. |
| [EnginePluginContext](./api/node/type-aliases/engineplugincontext.md) | Represents the context for an engine plugin. |
| [EnumPropertyName](./api/node/type-aliases/enumpropertyname.md) | - |
| [EnumValues](./api/node/type-aliases/enumvalues.md) | - |
| [ExportOptions](./api/node/type-aliases/exportoptions.md) | Represents the options for exporting a design block. |
| [FillPixelStreamOrientation](./api/node/type-aliases/fillpixelstreamorientation.md) | - |
| [FillType](./api/node/type-aliases/filltype.md) | The block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. Refer to [FillTypeShorthand](./api/node/type-aliases/filltypeshorthand.md) and [FillTypeLonghand](./api/node/type-aliases/filltypelonghand.md) for more details. |
| [FillTypeLonghand](./api/node/type-aliases/filltypelonghand.md) | The longhand block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. |
| [FillTypeShorthand](./api/node/type-aliases/filltypeshorthand.md) | - |
| [FloatPropertyName](./api/node/type-aliases/floatpropertyname.md) | - |
| [FontSizeUnit](./api/node/type-aliases/fontsizeunit.md) | Extended design unit type that includes Point for font size operations. Maintains consistency with SceneDesignUnit's capitalized naming convention. |
| [FontStyle](./api/node/type-aliases/fontstyle.md) | Allowed font styles. Mirrors the WASM `FontStyle` union. |
| [FontWeight](./api/node/type-aliases/fontweight.md) | Allowed font weights. Mirrors the `@cesdk/engine` (WASM) `FontWeight` union so a single `Font` is interchangeable across bindings. |
| [GradientstopRGBA](./api/node/type-aliases/gradientstoprgba.md) | Represents a gradient stop in the RGBA color space. |
| [HeightMode](./api/node/type-aliases/heightmode.md) | - |
| [HexColorString](./api/node/type-aliases/hexcolorstring.md) | Represents a hexadecimal color value (RGB or RGBA) that starts with a '#'. |
| [HistoryId](./api/node/type-aliases/historyid.md) | A numerical identifier for a history stack |
| [HistoryUpdate](./api/node/type-aliases/historyupdate.md) | Describes the kind of update that triggered an `onHistoryUpdatedWithKind` callback. |
| [HorizontalBlockAlignment](./api/node/type-aliases/horizontalblockalignment.md) | - |
| [HorizontalContentFillAlignment](./api/node/type-aliases/horizontalcontentfillalignment.md) | - |
| [ImageMimeType](./api/node/type-aliases/imagemimetype.md) | Represents the image MIME types used in the editor. |
| [IntPropertyName](./api/node/type-aliases/intpropertyname.md) | - |
| [ListStyle](./api/node/type-aliases/liststyle.md) | Represents the list style of a paragraph. |
| [Locale](./api/node/type-aliases/locale.md) | e.g. `en`, `de`, etc. |
| [LogLevel](./api/node/type-aliases/loglevel.md) | Provides logging functionality for the Creative Editor SDK. |
| [MimeType](./api/node/type-aliases/mimetype.md) | Represents the MIME types used in the editor. |
| [ObjectType](./api/node/type-aliases/objecttype.md) | The block type IDs for all blocks types in the Creative Engine. Those are the types that can be passed to `cesdk.engine.block.findByType(type)` for example. Refer to [ObjectTypeShorthand](./api/node/type-aliases/objecttypeshorthand.md) and [ObjectTypeLonghand](./api/node/type-aliases/objecttypelonghand.md) for more details. |
| [ObjectTypeLonghand](./api/node/type-aliases/objecttypelonghand.md) | The longhand block type IDs for all blocks types in the Creative Engine. Those are the Types returned by the engine when calling `cesdk.engine.block.getType(blockId)` for example. |
| [ObjectTypeShorthand](./api/node/type-aliases/objecttypeshorthand.md) | The shorthand block type IDs for all blocks types in the Creative Engine. Those are the types that can be passed to `cesdk.engine.block.findByType(type)` for example. |
| [OptionalPrefix](./api/node/type-aliases/optionalprefix.md) | - |
| [PageGuidesSource](./api/node/type-aliases/pageguidessource.md) | - |
| [PaletteColor](./api/node/type-aliases/palettecolor.md) | Represents a color definition for the custom color palette. |
| [PlaybackFadeInEasing](./api/node/type-aliases/playbackfadeineasing.md) | - |
| [PlaybackFadeOutEasing](./api/node/type-aliases/playbackfadeouteasing.md) | - |
| [PositionMode](./api/node/type-aliases/positionmode.md) | - |
| [PositionXMode](./api/node/type-aliases/positionxmode.md) | - |
| [PositionYMode](./api/node/type-aliases/positionymode.md) | - |
| [PropertyType](./api/node/type-aliases/propertytype.md) | Represents the various types of properties that can be associated with design blocks. Each type corresponds to a different kind of data that can be used to define the properties of a design block within the system. |
| [RGBA](./api/node/type-aliases/rgba.md) | Represents a color in the RGBA color space. |
| [RoleString](./api/node/type-aliases/rolestring.md) | Represents a role string. |
| [DesignUnit](./api/node/type-aliases/designunit.md) | - |
| [SceneFontSizeUnit](./api/node/type-aliases/scenefontsizeunit.md) | - |
| [SceneLayout](./api/node/type-aliases/scenelayout.md) | - |
| [SceneMode](./api/node/type-aliases/scenemode.md) | - |
| [Scope](./api/node/type-aliases/scope.md) | Represents the various scopes that define the capabilities and permissions within the Creative Editor SDK. Each scope corresponds to a specific functionality or action that can be performed within the editor. |
| [SettingBoolPropertyName](./api/node/type-aliases/settingboolpropertyname.md) | - |
| [SettingColorPropertyName](./api/node/type-aliases/settingcolorpropertyname.md) | - |
| [SettingEnumPropertyName](./api/node/type-aliases/settingenumpropertyname.md) | - |
| [SettingEnumType](./api/node/type-aliases/settingenumtype.md) | - |
| [SettingEnumValues](./api/node/type-aliases/settingenumvalues.md) | - |
| [SettingFloatPropertyName](./api/node/type-aliases/settingfloatpropertyname.md) | - |
| [SettingIntPropertyName](./api/node/type-aliases/settingintpropertyname.md) | - |
| [SettingKey](./api/node/type-aliases/settingkey.md) | Union type of all valid setting keys. |
| [SettingsBool](./api/node/type-aliases/settingsbool.md) | - |
| [SettingsColor](./api/node/type-aliases/settingscolor.md) | Represents the color settings available in the editor. |
| [~~SettingsColorRGBA~~](./api/node/type-aliases/settingscolorrgba.md) | Represents the color settings available in the editor. |
| [SettingsEnum](./api/node/type-aliases/settingsenum.md) | - |
| [SettingsFloat](./api/node/type-aliases/settingsfloat.md) | - |
| [SettingsInt](./api/node/type-aliases/settingsint.md) | - |
| [SettingsString](./api/node/type-aliases/settingsstring.md) | - |
| [SettingStringPropertyName](./api/node/type-aliases/settingstringpropertyname.md) | - |
| [SettingType](./api/node/type-aliases/settingtype.md) | Represents the type of a setting. |
| [SettingValueType](./api/node/type-aliases/settingvaluetype.md) | Gets the value type for a specific setting key. |
| [ShapeType](./api/node/type-aliases/shapetype.md) | The block type IDs for the shape blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. Refer to [ShapeTypeShorthand](./api/node/type-aliases/shapetypeshorthand.md) and [ShapeTypeLonghand](./api/node/type-aliases/shapetypelonghand.md) for more details. |
| [ShapeTypeLonghand](./api/node/type-aliases/shapetypelonghand.md) | The longhand block type IDs for the blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. |
| [ShapeTypeShorthand](./api/node/type-aliases/shapetypeshorthand.md) | - |
| [ShapeVectorPathFillRule](./api/node/type-aliases/shapevectorpathfillrule.md) | - |
| [SizeMode](./api/node/type-aliases/sizemode.md) | - |
| [SortingOrder](./api/node/type-aliases/sortingorder.md) | The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source. |
| [SourceSetPropertyName](./api/node/type-aliases/sourcesetpropertyname.md) | - |
| [SplitOptions](./api/node/type-aliases/splitoptions.md) | Options for configuring block split operations. |
| [StringPropertyName](./api/node/type-aliases/stringpropertyname.md) | - |
| [StrokeCap](./api/node/type-aliases/strokecap.md) | - |
| [StrokeCornerGeometry](./api/node/type-aliases/strokecornergeometry.md) | - |
| [StrokeDashEndCap](./api/node/type-aliases/strokedashendcap.md) | - |
| [StrokeDashStartCap](./api/node/type-aliases/strokedashstartcap.md) | - |
| [StrokeEndCap](./api/node/type-aliases/strokeendcap.md) | - |
| [StrokePosition](./api/node/type-aliases/strokeposition.md) | - |
| [StrokeStartCap](./api/node/type-aliases/strokestartcap.md) | - |
| [StrokeStyle](./api/node/type-aliases/strokestyle.md) | - |
| [SyncURIResolver](./api/node/type-aliases/syncuriresolver.md) | A synchronous URI resolver function. |
| [TextAnimationWritingStyle](./api/node/type-aliases/textanimationwritingstyle.md) | - |
| [TextCase](./api/node/type-aliases/textcase.md) | Represents the text case of a text block. |
| [TextDecorationLine](./api/node/type-aliases/textdecorationline.md) | Represents a line type for text decoration. |
| [TextDecorationStyle](./api/node/type-aliases/textdecorationstyle.md) | Represents the style of a text decoration line. |
| [HorizontalTextAlignment](./api/node/type-aliases/horizontaltextalignment.md) | - |
| [TextVerticalAlignment](./api/node/type-aliases/textverticalalignment.md) | - |
| [TimelineTrackVisibility](./api/node/type-aliases/timelinetrackvisibility.md) | - |
| [TouchPinchAction](./api/node/type-aliases/touchpinchaction.md) | - |
| [TouchRotateAction](./api/node/type-aliases/touchrotateaction.md) | - |
| [TransitionType](./api/node/type-aliases/transitiontype.md) | The block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. Refer to [TransitionTypeShorthand](./api/node/type-aliases/transitiontypeshorthand.md) and [TransitionTypeLonghand](./api/node/type-aliases/transitiontypelonghand.md) for more details. |
| [TransitionTypeLonghand](./api/node/type-aliases/transitiontypelonghand.md) | The longhand block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. |
| [TransitionTypeShorthand](./api/node/type-aliases/transitiontypeshorthand.md) | - |
| [~~TypefaceDefinition~~](./api/node/type-aliases/typefacedefinition.md) | Represents a typeface definition used in the editor. |
| [VerticalBlockAlignment](./api/node/type-aliases/verticalblockalignment.md) | - |
| [VerticalContentFillAlignment](./api/node/type-aliases/verticalcontentfillalignment.md) | - |
| [VideoBitrateMode](./api/node/type-aliases/videobitratemode.md) | Selects how the video bitrate is determined when no explicit bitrate is given. - `'System'`: let the platform encoder choose the bitrate (the default). In the browser this can be a very high, near-lossless rate that may cause large exports to fail with an out-of-memory error. - `'Auto'`: a bounded default derived from the output resolution and framerate, consistent across platforms. |
| [VideoExportOptions](./api/node/type-aliases/videoexportoptions.md) | Represents the options for exporting a video. |
| [VideoMimeType](./api/node/type-aliases/videomimetype.md) | Represents the video MIME types used in the editor. |
| [WidthMode](./api/node/type-aliases/widthmode.md) | - |
| [XYWH](./api/node/type-aliases/xywh.md) | Describes a rectangle on the screen. |
| [ZoomAutoFitAxis](./api/node/type-aliases/zoomautofitaxis.md) | The axis(es) for which to auto-fit. |
| [ZoomOptions](./api/node/type-aliases/zoomoptions.md) | Options for zooming to a block with optional animation. |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [CompressionFormat](./api/node/enumerations/compressionformat.md) | Compression format for scene serialization. |
| [CompressionLevel](./api/node/enumerations/compressionlevel.md) | Compression level for scene serialization. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AddVideoOptions](./api/node/interfaces/addvideooptions.md) | Options for adding videos to the scene. |
| [ApplyAssetOptions](./api/node/interfaces/applyassetoptions.md) | Options for applying an asset to the scene. |
| [Asset](./api/node/interfaces/asset.md) | Generic asset information |
| [AssetBooleanProperty](./api/node/interfaces/assetbooleanproperty.md) | Asset boolean property definition |
| [AssetCMYKColor](./api/node/interfaces/assetcmykcolor.md) | Asset Color payload CMYK representation |
| [AssetColorProperty](./api/node/interfaces/assetcolorproperty.md) | Asset color property definition |
| [AssetContentAspectRatio](./api/node/interfaces/assetcontentaspectratio.md) | Asset transform preset payload that snaps a block's frame to the intrinsic aspect ratio of the block's content (e.g. the underlying image or video). |
| [AssetDefinition](./api/node/interfaces/assetdefinition.md) | Definition of an asset used if an asset is added to an asset source. |
| [AssetEnumProperty](./api/node/interfaces/assetenumproperty.md) | Asset enum property definition |
| [AssetFacetValue](./api/node/interfaces/assetfacetvalue.md) | One bucket of a facet distribution. |
| [AssetFixedAspectRatio](./api/node/interfaces/assetfixedaspectratio.md) | Asset transform preset payload fixed aspect ratio |
| [AssetFixedSize](./api/node/interfaces/assetfixedsize.md) | Asset transform preset payload fixed size |
| [AssetFreeAspectRatio](./api/node/interfaces/assetfreeaspectratio.md) | Asset transform preset payload free aspect ratio |
| [AssetNumberProperty](./api/node/interfaces/assetnumberproperty.md) | Asset number property definition |
| [AssetPayload](./api/node/interfaces/assetpayload.md) | Asset payload |
| [AssetQueryData](./api/node/interfaces/assetquerydata.md) | Defines a request for querying assets |
| [AssetResult](./api/node/interfaces/assetresult.md) | Single asset result of a query from the engine. |
| [AssetRGBColor](./api/node/interfaces/assetrgbcolor.md) | Asset Color payload RGB representation |
| [AssetSource](./api/node/interfaces/assetsource.md) | A source of assets |
| [AssetSpotColor](./api/node/interfaces/assetspotcolor.md) | Asset Color payload SpotColor representation |
| [AssetsQueryResult](./api/node/interfaces/assetsqueryresult.md) | Return type of a `findAssets` query. |
| [AssetStringProperty](./api/node/interfaces/assetstringproperty.md) | Asset string property definition |
| [AssetStylePreset](./api/node/interfaces/assetstylepreset.md) | A declarative style preset the engine applies to text and caption blocks. The engine parses and applies it identically on every platform. Lives in [AssetPayload.stylePreset](./api/node/interfaces/assetpayload.md). |
| [AssetStylePresetAnimation](./api/node/interfaces/assetstylepresetanimation.md) | An animation slot of an [AssetStylePreset](./api/node/interfaces/assetstylepreset.md) (`inAnimation`, `outAnimation` or `loopAnimation`). |
| [AudioTrackInfo](./api/node/interfaces/audiotrackinfo.md) | Information about a single audio track from a video. This interface provides comprehensive metadata about audio tracks, including codec information, technical specifications, and track details. |
| [BlockEvent](./api/node/interfaces/blockevent.md) | Represents an event related to a design block. |
| [BlockStateError](./api/node/interfaces/blockstateerror.md) | Represents an error state for a design block. |
| [BlockStatePending](./api/node/interfaces/blockstatepending.md) | Represents a pending state for a design block. |
| [BlockStateReady](./api/node/interfaces/blockstateready.md) | Represents a ready state for a design block. |
| [Buffer](./api/node/interfaces/buffer.md) | Represents a buffer of data. |
| [CharacterInkBox](./api/node/interfaces/characterinkbox.md) | Tight ink-paint bounding box of a single grapheme, in global scene coordinates. Returned by `block.getTextCharacterInkBoxes`. The baseline Y is reported separately because it does not equal `y + height` (the box is the tight ink rect; the baseline anchors glyph descenders). |
| [CMYKColor](./api/node/interfaces/cmykcolor.md) | Represents a CMYK color value. |
| [CompleteAssetResult](./api/node/interfaces/completeassetresult.md) | Asset results that are returned from the engine. |
| [CompressionOptions](./api/node/interfaces/compressionoptions.md) | Compression settings for a serialized scene. |
| [Configuration](./api/node/interfaces/configuration.md) | Specifies the configuration for the Creative Editor SDK. |
| [DominantColor](./api/node/interfaces/dominantcolor.md) | A single color extracted from the rendered appearance of a block. |
| [DominantColorsOptions](./api/node/interfaces/dominantcolorsoptions.md) | Options for `BlockAPI.getDominantColors`. |
| [EngineActionInfo](./api/node/interfaces/engineactioninfo.md) | Info about a registered action, from [EngineActions.list](./api/node/classes/engineactions.md). |
| [EngineActionsRegistry](./api/node/interfaces/engineactionsregistry.md) | Hook for hosts to add strongly-typed action ids. Augment via `declare module '@cesdk/engine'` to get autocomplete on register/run while still allowing custom string ids. |
| [EnginePlugin](./api/node/interfaces/engineplugin.md) | Represents an engine plugin. |
| [Font](./api/node/interfaces/font.md) | Individual font within a typeface. Field optionality matches `@cesdk/engine` (WASM) — fields not present in the engine response are simply omitted rather than empty strings. |
| [FontMetrics](./api/node/interfaces/fontmetrics.md) | Font metrics extracted from a font file. Values are in the font's design units coordinate space. |
| [GradientColorStop](./api/node/interfaces/gradientcolorstop.md) | Represents a gradient color stop. |
| [Logger](./api/node/interfaces/logger.md) | Represents a logger function. |
| [PageDuration](./api/node/interfaces/pageduration.md) | - |
| [Range](./api/node/interfaces/range.md) | An open range. |
| [RGBAColor](./api/node/interfaces/rgbacolor.md) | Represents an RGBA color value. |
| [RGBColor](./api/node/interfaces/rgbcolor.md) | Represents an RGB color value. |
| [SaveToArchiveOptions](./api/node/interfaces/savetoarchiveoptions.md) | Options for saveSceneToArchive operation. |
| [Settings](./api/node/interfaces/settings.md) | Map of all available settings with their types. This provides type-safe access to all editor settings. |
| [Size2](./api/node/interfaces/size2.md) | - |
| [Source](./api/node/interfaces/source.md) | A single source width an intrinsic width & height. |
| [SpotColor](./api/node/interfaces/spotcolor.md) | Represents a spot color value. |
| [TextDecorationConfig](./api/node/interfaces/textdecorationconfig.md) | Configuration for text decorations on a text run. |
| [TextFontSizeOptions](./api/node/interfaces/textfontsizeoptions.md) | Options for text font size operations with unit support. |
| [TextRunInfo](./api/node/interfaces/textruninfo.md) | Represents a single contiguous text run with uniform formatting. |
| [TransientResource](./api/node/interfaces/transientresource.md) | Represents a transient resource. |
| [Typeface](./api/node/interfaces/typeface.md) | Typeface definition |
| [Vec2](./api/node/interfaces/vec2.md) | - |
| [Vec3](./api/node/interfaces/vec3.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [ANIMATION\_TYPES](./api/node/variables/animation_types.md) | The shorthand block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. |
| [AnimationBaselineDirectionValues](./api/node/variables/animationbaselinedirectionvalues.md) | - |
| [AnimationBlockSwipeTextDirectionValues](./api/node/variables/animationblockswipetextdirectionvalues.md) | - |
| [AnimationEasingValues](./api/node/variables/animationeasingvalues.md) | - |
| [AnimationGrowDirectionValues](./api/node/variables/animationgrowdirectionvalues.md) | - |
| [AnimationJumpLoopDirectionValues](./api/node/variables/animationjumploopdirectionvalues.md) | - |
| [AnimationKenBurnsDirectionValues](./api/node/variables/animationkenburnsdirectionvalues.md) | - |
| [AnimationMergeTextDirectionValues](./api/node/variables/animationmergetextdirectionvalues.md) | - |
| [AnimationSpinDirectionValues](./api/node/variables/animationspindirectionvalues.md) | - |
| [AnimationSpinLoopDirectionValues](./api/node/variables/animationspinloopdirectionvalues.md) | - |
| [AnimationTypewriterTextWritingStyleValues](./api/node/variables/animationtypewritertextwritingstylevalues.md) | - |
| [AnimationWipeDirectionValues](./api/node/variables/animationwipedirectionvalues.md) | - |
| [BlendModeValues](./api/node/variables/blendmodevalues.md) | - |
| [BLUR\_TYPES](./api/node/variables/blur_types.md) | The shorthand block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. |
| [CameraClampingOvershootModeValues](./api/node/variables/cameraclampingovershootmodevalues.md) | - |
| [CaptionHorizontalAlignmentValues](./api/node/variables/captionhorizontalalignmentvalues.md) | - |
| [CaptionVerticalAlignmentValues](./api/node/variables/captionverticalalignmentvalues.md) | - |
| [ColorPickerColorModeValues](./api/node/variables/colorpickercolormodevalues.md) | - |
| [ContentFillModeValues](./api/node/variables/contentfillmodevalues.md) | - |
| [ControlGizmoMoveHandleVisibilityValues](./api/node/variables/controlgizmomovehandlevisibilityvalues.md) | - |
| [ControlGizmoResizeHandlesVisibilityValues](./api/node/variables/controlgizmoresizehandlesvisibilityvalues.md) | - |
| [ControlGizmoRotateHandlesVisibilityValues](./api/node/variables/controlgizmorotatehandlesvisibilityvalues.md) | - |
| [ControlGizmoScaleHandlesVisibilityValues](./api/node/variables/controlgizmoscalehandlesvisibilityvalues.md) | - |
| [CutoutTypeValues](./api/node/variables/cutouttypevalues.md) | - |
| [DESIGN\_BLOCK\_TYPES](./api/node/variables/design_block_types.md) | The shorthand block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. |
| [DoubleClickSelectionModeValues](./api/node/variables/doubleclickselectionmodevalues.md) | - |
| [EFFECT\_TYPES](./api/node/variables/effect_types.md) | The shorthand block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. |
| [FILL\_TYPES](./api/node/variables/fill_types.md) | The shorthand block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. |
| [FillPixelStreamOrientationValues](./api/node/variables/fillpixelstreamorientationvalues.md) | - |
| [HeightModeValues](./api/node/variables/heightmodevalues.md) | - |
| [HorizontalContentFillAlignmentValues](./api/node/variables/horizontalcontentfillalignmentvalues.md) | - |
| [~~LogLevel~~](./api/node/variables/loglevel.md) | Provides a set of predefined log levels for the Creative Editor SDK. |
| [~~MimeType~~](./api/node/variables/mimetype.md) | Represents the MIME types used in the editor. |
| [PageGuidesSourceValues](./api/node/variables/pageguidessourcevalues.md) | - |
| [PlaybackFadeInEasingValues](./api/node/variables/playbackfadeineasingvalues.md) | - |
| [PlaybackFadeOutEasingValues](./api/node/variables/playbackfadeouteasingvalues.md) | - |
| [PositionXModeValues](./api/node/variables/positionxmodevalues.md) | - |
| [PositionYModeValues](./api/node/variables/positionymodevalues.md) | - |
| [SceneDesignUnitValues](./api/node/variables/scenedesignunitvalues.md) | - |
| [SceneFontSizeUnitValues](./api/node/variables/scenefontsizeunitvalues.md) | - |
| [SceneLayoutValues](./api/node/variables/scenelayoutvalues.md) | - |
| [SceneModeValues](./api/node/variables/scenemodevalues.md) | - |
| [SHAPE\_TYPES](./api/node/variables/shape_types.md) | The shorthand block type IDs for the shape blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. |
| [ShapeVectorPathFillRuleValues](./api/node/variables/shapevectorpathfillrulevalues.md) | - |
| [StrokeCapValues](./api/node/variables/strokecapvalues.md) | - |
| [StrokeCornerGeometryValues](./api/node/variables/strokecornergeometryvalues.md) | - |
| [StrokeDashEndCapValues](./api/node/variables/strokedashendcapvalues.md) | - |
| [StrokeDashStartCapValues](./api/node/variables/strokedashstartcapvalues.md) | - |
| [StrokeEndCapValues](./api/node/variables/strokeendcapvalues.md) | - |
| [StrokePositionValues](./api/node/variables/strokepositionvalues.md) | - |
| [StrokeStartCapValues](./api/node/variables/strokestartcapvalues.md) | - |
| [StrokeStyleValues](./api/node/variables/strokestylevalues.md) | - |
| [TextAnimationWritingStyleValues](./api/node/variables/textanimationwritingstylevalues.md) | - |
| [TextHorizontalAlignmentValues](./api/node/variables/texthorizontalalignmentvalues.md) | - |
| [TextVerticalAlignmentValues](./api/node/variables/textverticalalignmentvalues.md) | - |
| [TimelineTrackVisibilityValues](./api/node/variables/timelinetrackvisibilityvalues.md) | - |
| [TouchPinchActionValues](./api/node/variables/touchpinchactionvalues.md) | - |
| [TouchRotateActionValues](./api/node/variables/touchrotateactionvalues.md) | - |
| [TRANSITION\_TYPES](./api/node/variables/transition_types.md) | The shorthand block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. |
| [VerticalContentFillAlignmentValues](./api/node/variables/verticalcontentfillalignmentvalues.md) | - |
| [WidthModeValues](./api/node/variables/widthmodevalues.md) | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support