> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Error Catalog](./concepts/error-catalog.md)

---



Every recoverable engine failure is a structured error with a stable `code` (for example `SCENE.NOT_VALID`), an English developer-facing message and hint, typed arguments, and an optional documentation link. Match on the `code` rather than the message string — the code is stable across releases. For how to read these on each binding, see the [structured-errors migration guide](#broken-link-e7f3a1).

This page lists all catalog errors grouped by category including links to documentation pages. The `code` is what you branch on. The `message` and `hint` are the English strings the engine renders (developer-facing — surface localized copy in your UI layer).

## ASSET

Asset sources, asset library, asset references.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `ASSET.CANNOT_APPLY_COLOR_NO_TARGET` | Could not apply color asset to block \{block}. Block has nothing to apply color to. | The block has no fill, stroke, or text color to receive the asset. Set the relevant property type first. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_CMYK_MISSING_FIELDS` | \`payload.color\` with \`CMYK\` color space must have fields \`c\`, \`m\`, \`y\`, \`k\`. | CMYK colors require numeric \`c\`, \`m\`, \`y\`, \`k\` components. Add them to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_MISSING` | Asset does not contain a color. | Color asset operations require a \`color\` payload. Verify the asset is a color asset. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_MISSING_COLOR_SPACE` | \`payload.color\` must have a \`colorSpace\` field. | Add \`colorSpace\` (sRGB, CMYK, or SpotColor) to the asset payload. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_SPACE_UNKNOWN` | Unknown color space: \{colorSpace} | Color space '\{colorSpace}' is not supported. Valid values are sRGB, CMYK, and SpotColor. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_SPOT_MISSING_FIELDS` | \`payload.color\` with \`SpotColor\` color space must have fields \`name\`, \`externalReference\`, \`representation\`. | Spot colors require all three fields; \`representation\` must itself be a sub-color in sRGB or CMYK. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_SPOT_REPRESENTATION_INVALID` | A \`payload.color\` with colorSpace \`SpotColor\` must use a \`RGB\` or \`CMYK\` color for its \`representation\` field. | Spot color representation must be a primitive sRGB or CMYK value. Nested SpotColor is not allowed. | [Assets](./concepts/assets.md) |
| `ASSET.COLOR_SRGB_MISSING_FIELDS` | \`payload.color\` with \`sRGB\` color space must have fields \`r\`, \`g\`, and \`b\`. | sRGB colors require numeric \`r\`, \`g\`, \`b\` components. Add them to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.DOCUMENT_SOURCE_NO_ADD` | A document asset source does not allow adding assets. | Document asset sources are read-only views into the active scene. Add assets to a local asset source instead. | [Assets](./concepts/assets.md) |
| `ASSET.DOCUMENT_SOURCE_NO_REMOVE` | A document asset source does not allow removing assets. | Document asset sources are read-only. Remove the underlying scene blocks instead. | [Assets](./concepts/assets.md) |
| `ASSET.FACET_PATH_NOT_FACETABLE` | Asset property '\{property}' is not facetable. Use 'tags', 'groups', or 'meta.\<key>'. | Facets enumerate bounded value sets; 'label' and 'id' are unbounded. Request 'tags', 'groups', or 'meta.\<key>' instead. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_COMBINATOR_EMPTY` | Asset filter '\{combinator}' must have at least one child. | Add at least one filter expression to the '\{combinator}' array. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_COMBINATOR_NOT_ARRAY` | Asset filter '\{combinator}' must be an array. | Provide an array of filter expressions for '\{combinator}'. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_META_KEY_MISSING` | Asset property filter 'meta' path must include a key (e.g. 'meta.languages'). | Append the meta key after 'meta.' — for example 'meta.languages'. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_MULTIPLE_DISCRIMINATORS` | Asset filter has multiple discriminators; specify exactly one of 'property', 'and', 'or', 'not'. | Keep only one of 'property', 'and', 'or', 'not' on the expression. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_NOT_CHILD_NOT_OBJECT` | Asset filter '\{combinator}' must be an object. | Provide a single filter-expression object as the value of '\{combinator}'. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_NOT_OBJECT` | Asset filter must be an object. | Wrap each filter expression in an object with one of 'property', 'and', 'or', 'not'. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_NO_DISCRIMINATOR` | Asset filter must have exactly one of 'property', 'and', 'or', 'not'. | Set one discriminator key on the filter expression. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_OPERAND_MISSING` | Asset property filter must have exactly one of 'contains' or 'equals'. | Set either 'contains' or 'equals' on the property filter, not both and not neither. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_OPERAND_NOT_STRING` | Asset property filter '\{operand}' must be a string. | Provide a string value for '\{operand}' on the property filter. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_PROPERTY_EMPTY` | Asset property filter 'property' must not be empty. | Set 'property' to 'label', 'id', 'tags', 'groups', or 'meta.\<key>'. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_PROPERTY_NOT_STRING` | Asset property filter must have a string 'property'. | Provide 'property' as a string identifying the asset field to match. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_PROPERTY_UNKNOWN` | Unknown asset property '\{property}'. Use 'label', 'id', 'tags', 'groups', or 'meta.\<key>'. | Replace '\{property}' with one of the supported property roots. | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_ROOT_NOT_ARRAY` | Asset filter must be an array of filter expressions. | Pass the top-level filter as a JSON array of filter expressions (or null/empty for no filter). | [Assets](./concepts/assets.md) |
| `ASSET.FILTER_UNRECOGNIZED_DISCRIMINATOR` | Asset filter has no recognized discriminator. | Use one of 'property', 'and', 'or', 'not' on the filter expression. | [Assets](./concepts/assets.md) |
| `ASSET.FIND_FN_REQUIRED` | findAssetsFn is required. | Pass a non-null findAssetsFn callback when registering a custom asset source. | [Assets](./concepts/assets.md) |
| `ASSET.FONT_MISSING_NAME` | Missing required field 'name' in font. | Each font entry needs a \`name\`. Add it to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.FONT_MISSING_URL` | Missing required field 'url' in font. | Each font entry needs a \`url\` pointing at the font file. Add it to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.ID_ALREADY_EXISTS` | Asset with id \{id} already exists in asset source. | Each asset id must be unique within a source. Remove the existing asset, or use a different id. | [Assets](./concepts/assets.md) |
| `ASSET.JSON_INVALID_IN_URI` | Invalid JSON content in URI: \{uri} | The JSON at '\{uri}' could not be parsed. Validate the payload or check the URL response body. | [Assets](./concepts/assets.md) |
| `ASSET.JSON_MALFORMED_LOCAL` | Invalid JSON content for local asset source. Expected 'id' and 'assets' fields. | The JSON payload must include top-level 'id' and 'assets' fields. See the local-asset-source schema for the full shape. | [Assets](./concepts/assets.md) |
| `ASSET.META_NON_STRING_ENTRY` | Unexpectedly found non-string entry in asset's meta. | Asset meta is a flat string map. Numeric or object values are not supported — stringify them before inserting. | [Assets](./concepts/assets.md) |
| `ASSET.NO_SELECTION` | No elements selected. | This asset application requires a selected block. Verify a selection exists with api.block.findAllSelected() before applying. | [Assets](./concepts/assets.md) |
| `ASSET.RESOURCE_DATA_NOT_AVAILABLE` | Resource data not available: \{uri} | The resource at '\{uri}' is registered but has no data buffer. Confirm the source provides bytes (not just metadata). | [Assets](./concepts/assets.md) |
| `ASSET.RESOURCE_DATA_UNAVAILABLE` | Resource data is not available. | The resource has no attached data provider. Ensure the resource has been fetched and is ready before requesting its data. | [Assets](./concepts/assets.md) |
| `ASSET.RESOURCE_NOT_FOUND_AT_URI` | Resource not found: \{uri} | No resource registered at '\{uri}'. Confirm the asset source serves the URI and that loading completed. | [Assets](./concepts/assets.md) |
| `ASSET.RESOURCE_NOT_READY` | Resource is not ready. | The resource is still loading or in an error state. Wait for the Ready state, or handle the error via the resource's loading state. | [Assets](./concepts/assets.md) |
| `ASSET.RESOURCE_NOT_READY_AT_URI` | Resource not ready: \{uri} | The resource at '\{uri}' is still loading. Subscribe to resource events or retry after the resource is Ready. | [Assets](./concepts/assets.md) |
| `ASSET.SORT_KEY_MISSING` | Sort key not found in asset source. | The asset source does not provide the requested sort key. Use a sort key the source declares, or omit the sort parameter. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_ADD_DENIED` | Assets cannot be added to this asset source: \{sourceId}. | The source '\{sourceId}' rejected addAssets(). It may be backed by an immutable provider. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_ALREADY_EXISTS` | AssetSource with id \{sourceId} already exists. | Asset source ids must be unique. Remove the existing source via removeAssetSource() or pick a different id. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_CANNOT_ADD_ASSETS` | AssetSource with id \{sourceId} cannot add assets. | The source '\{sourceId}' is read-only. Modify the underlying data store or pick a writable source. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_CANNOT_REMOVE_ASSETS` | AssetSource with id \{sourceId} cannot remove assets. | The source '\{sourceId}' is read-only. Modify the underlying data store or pick a writable source. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_DOES_NOT_SUPPORT_APPLY_PROPERTIES` | Asset source \{source} does not support applying properties. | The source '\{source}' does not implement applyProperties(). Use a source that supports it, or apply properties through a different surface. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_NOT_EXISTS` | AssetSource with id \{sourceId} does not exist. | No asset source registered under '\{sourceId}'. Use api.asset.addLocalAssetSource() or addAssetSource() to register one first. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_NOT_REMOVABLE` | AssetSource with id \{sourceId} may not be removed. | Built-in asset sources cannot be unregistered. Override their behavior by adding a higher-priority custom source instead. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_NO_PROPERTY_MOD` | This asset source does not support property modification. | The active asset source does not support property modification. Register a writable source via api.asset.addLocalAssetSource(), or modify the underlying assets directly. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_REMOVE_DENIED` | Assets cannot be removed from this asset source: \{sourceId}. | The source '\{sourceId}' rejected removeAssets(). It may be backed by an immutable provider. | [Assets](./concepts/assets.md) |
| `ASSET.SOURCE_UNKNOWN` | The asset source \{sourceId} is unknown. | No asset source registered under '\{sourceId}'. Add it before requesting its content. | [Assets](./concepts/assets.md) |
| `ASSET.STYLE_PRESET_INVALID_PAYLOAD` | Style preset payload is not a valid JSON object. | The asset's payload.stylePreset must be a JSON object. Check the asset definition's stylePreset field. | [Assets](./concepts/assets.md) |
| `ASSET.STYLE_PRESET_MISSING_BLOCK_TYPE` | A style preset requires a blockType to create a new block. | When applying a style preset without a target block, set meta.blockType so the engine knows which block type to create. | [Assets](./concepts/assets.md) |
| `ASSET.STYLE_PRESET_NOT_APPLICABLE` | Style preset is not applicable to a block of type '\{blockType}'. | The style preset declares the block types it supports. Apply it to a supported block type, or widen the preset's blockType. | [Assets](./concepts/assets.md) |
| `ASSET.TARGET_BLOCK_NOT_VALID` | Block is not valid. | The selected block is no longer valid. Re-resolve it via api.block.findAllSelected() and confirm with api.block.isValid(block) before applying an asset. | [Assets](./concepts/assets.md) |
| `ASSET.TRANSFORM_PRESET_FIXED_ASPECT_MISSING_FIELDS` | \`payload.transformPreset\` of type \`fixedAspectRatio\` must have fields \`width\`, and \`height\`. | FixedAspectRatio presets need \`width\` and \`height\` to determine the ratio. | [Assets](./concepts/assets.md) |
| `ASSET.TRANSFORM_PRESET_FIXED_SIZE_MISSING_FIELDS` | \`payload.transformPreset\` of type \`fixedAspectRatio\` must have fields \`width\`, \`height\`, and \`designUnit\`. | FixedSize presets need numeric \`width\`, \`height\`, and a \`designUnit\` (e.g. 'Pixel', 'Inch'). | [Assets](./concepts/assets.md) |
| `ASSET.TRANSFORM_PRESET_MISSING_TYPE` | \`payload.transformPreset\` must have a \`type\` field. | Add a \`type\` to the transformPreset payload (e.g. 'FixedSize', 'FixedAspectRatio', 'ContentAspectRatio'). | [Assets](./concepts/assets.md) |
| `ASSET.TRANSFORM_PRESET_TYPE_UNKNOWN` | Unknown transformPreset type: \{type} | TransformPreset type '\{type}' is not recognized. Valid values: 'FixedSize', 'FixedAspectRatio', 'ContentAspectRatio'. | [Assets](./concepts/assets.md) |
| `ASSET.TYPEFACE_MISSING_FAMILY` | Missing required field 'family' in typeface. | Typefaces declare a \`family\` grouping their fonts. Add it to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.TYPEFACE_MISSING_WEIGHT` | Missing required field 'weight' in typeface. | Typefaces declare a \`weight\`. Add it to the payload. | [Assets](./concepts/assets.md) |
| `ASSET.UNSUPPORTED_MIME_TYPE` | Unsupported mime type for loadWithoutService: \{mimeType} | The bypass loader cannot handle '\{mimeType}'. Route through the regular resource service or extend the loader. | [Assets](./concepts/assets.md) |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | Cannot create a block from an asset with the MIME type \{mimeType}. | MIME type '\{mimeType}' has no block factory. Convert the asset to a supported type (image/*, video/*, audio/\*) or register a custom factory. | [Assets](./concepts/assets.md) |
| `ASSET.URI_INVALID_BARE` | Invalid URI \{uri}. | The asset URI is malformed. Use a valid absolute URL or a registered scheme like 'buffer://'. | [Assets](./concepts/assets.md) |
| `ASSET.URI_META_MISSING` | 'uri' not found in asset 'meta'. Can't replace. | The asset's meta block must include a 'uri' field for replace() to work. Add it before invoking. | [Assets](./concepts/assets.md) |

## AUDIO

Audio playback and routing.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `AUDIO.DATA_SOURCE_INIT_FAILED` | Mini Audio data source initialization failed. | miniaudio could not allocate the data source. Out-of-memory or invalid decoder state is the likely cause. |  |
| `AUDIO.DATA_SOURCE_NODE_INIT_FAILED` | Data source node initialization failed (\{resultCode}). | miniaudio could not attach the data source as a node with error \{resultCode}. The graph configuration may be invalid. |  |
| `AUDIO.DATA_SOURCE_NO_DURATION` | Audio data source has no known duration. | miniaudio could not determine the source length. Streaming or seekless sources may not report a duration; decode the source fully or supply one with a known length. |  |
| `AUDIO.DECODER_FORMAT_FAILED` | Failed to get decoder data format. | The decoder reported an indeterminate sample format. The file header may be truncated or malformed. |  |
| `AUDIO.DECODER_INIT_FAILED` | Mini Audio decoder initialization failed (\{resultCode}). | miniaudio rejected the audio source with error \{resultCode}. The file may be corrupted or use an unsupported codec. |  |
| `AUDIO.DEVICE_INIT_FAILED` | Initializing audio device failed. | The platform's audio device could not be opened. Verify the device exists and is not in use by another process. |  |
| `AUDIO.DEVICE_RESUME_FAILED` | Failed to resume the audio device. | The audio device was suspended and could not be resumed. On web, trigger playback from within a user-gesture handler (e.g. a click) so the browser unlocks the audio context before calling play. |  |
| `AUDIO.DEVICE_START_FAILED` | Audio device start failed. | The audio device opened but did not start playback. Check device state and platform permissions. |  |
| `AUDIO.DEVICE_STOP_FAILED` | Audio device stop failed. | The audio device could not be stopped cleanly. Subsequent restart may be required. |  |
| `AUDIO.INVALID_SOUND_HANDLE` | Invalid sound handle. | The sound handle does not refer to a live audio source. It may have been stopped or never created. |  |
| `AUDIO.NODE_ATTACH_OUTPUT_BUS_FAILED` | Attaching output bus failed (\{resultCode}). | miniaudio could not attach the node's output bus with error \{resultCode}. The graph layout may be invalid. |  |
| `AUDIO.NODE_GRAPH_INIT_FAILED` | Audio node graph init failed. | The miniaudio node graph could not be created. Check available system resources and the audio backend installation. |  |
| `AUDIO.NODE_SET_STATE_FAILED` | Setting node state failed (\{resultCode}). | miniaudio rejected the node state transition with error \{resultCode}. |  |
| `AUDIO.NODE_STATE_CHANGE_FAILED` | Failed to change sound node state to \{targetState}. | miniaudio did not converge on the requested node state '\{targetState}'. The node may have been destroyed concurrently. |  |
| `AUDIO.PCM_READ_FAILED` | Failed to read PCM frames from node graph (\{resultCode}). | miniaudio returned error \{resultCode} while reading PCM. The graph may be in an invalid state; re-create it. |  |
| `AUDIO.RESAMPLER_INIT_FAILED` | Mini Audio resampler initialization failed. | miniaudio could not construct a resampler for the source rate. The source sample rate may be unsupported. |  |
| `AUDIO.UNSUPPORTED_CODEC` | Unsupported audio codec. | miniaudio cannot decode this audio format. Re-encode the source as WAV, FLAC, or one of the documented supported codecs. | [File Format Support](./import-media/file-format-support.md) |

## BINDING

Errors raised at the binding bridge layer (WASM/JNI/ObjC++/N-API parameter validation, host-callback invariants, asset-source platform plumbing).

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `BINDING.ASSET_PLATFORM_SOURCE_UNAVAILABLE` | Platform source object is unavailable. | The platform-side asset source backing this engine handle was garbage collected. Keep a reference while the engine may call into it. |  |
| `BINDING.ASSET_SOURCE_ADD_UNSUPPORTED` | Assets cannot be added to this asset source. | Implement \`addAsset\` on the asset source if you need this operation to succeed. |  |
| `BINDING.ASSET_SOURCE_APPLY_PROPERTIES_UNSUPPORTED` | Asset properties cannot be applied by this asset source. | Implement \`applyAssetProperties\` on the asset source if you need this operation to succeed. |  |
| `BINDING.ASSET_SOURCE_FETCH_UNSUPPORTED` | Assets cannot be fetched from this asset source. | Implement \`fetchAsset\` on the asset source if you need this operation to succeed. |  |
| `BINDING.ASSET_SOURCE_REMOVE_UNSUPPORTED` | Assets cannot be removed from this asset source. | Implement \`removeAsset\` on the asset source if you need this operation to succeed. |  |
| `BINDING.FACETS_QUERY_ENTRY_NOT_STRING` | Each entry in 'facets' must be a property path string | Every \`facets\` entry must be a string property path such as \`'groups'\`, \`'tags'\`, or \`'meta.\<key>'\`. |  |
| `BINDING.FACETS_QUERY_NOT_ARRAY` | Field 'facets' must be an array of property path strings | Pass \`facets\` as a JavaScript array of property path strings such as \`'groups'\`, \`'tags'\`, or \`'meta.\<key>'\`. |  |
| `BINDING.FACETS_RESULT_NOT_OBJECT` | Field 'facets' in find assets result is not an object keyed by facet path | Return \`facets\` from a custom source's \`findAssets\` as an object keyed by the requested property paths. |  |
| `BINDING.FACET_COUNT_NOT_NUMBER` | Field 'count' in facet '\{facet}' of find assets result is not a number | Omit \`count\` or set it to a number; it is optional per bucket. |  |
| `BINDING.FACET_ENTRY_NOT_OBJECT` | An entry of facet '\{facet}' in find assets result is not a value/count object | Each facet bucket must be an object with a string \`value\` and an optional numeric \`count\`. |  |
| `BINDING.FACET_NOT_ARRAY` | Facet '\{facet}' in find assets result is not an array of value/count entries | Each \`facets\[path]\` must be an array of value/count buckets. |  |
| `BINDING.FACET_VALUE_MISSING` | Missing required string field 'value' in facet '\{facet}' of find assets result | Every facet bucket must carry a string \`value\`. |  |
| `BINDING.HOST_CALLBACK_THREW` | \{operation} callback threw: \{message} | The platform-side \`\{operation}\` callback raised an error. Inspect \`args.message\` for the original host-language exception text and ensure the callback handles its input correctly. |  |
| `BINDING.JSON_NOT_REPRESENTABLE` | Value cannot be represented as JSON. | Pass only JSON-serializable values (no functions, no cycles, no \`BigInt\`). |  |
| `BINDING.JSON_PARSE_FAILED` | Failed to parse JSON from JS value. | Pass a value the bridge can stringify with \`JSON.stringify\` without throwing. |  |
| `BINDING.NODE_NOT_INITIALIZED` | Not initialized | Call \`CreativeEngine.init(...)\` before invoking other engine methods. |  |
| `BINDING.NO_TEXT_BLOCK_BEING_EDITED` | No text block is currently being edited. | Enter text editing mode via \`block.setTextEditMode(...)\` before invoking text-editing APIs. |  |
| `BINDING.URI_RESOLVER_INVALID_RESULT` | URI resolver returned an invalid result. | Return a non-null string URL (or throw) from the URI resolver callback. |  |
| `BINDING.URI_RESOLVER_PROMISE_REJECTED` | URI resolver promise rejected. | Resolve the returned promise with a string URL, or reject with a descriptive error message. |  |
| `BINDING.URI_RESOLVER_UNAVAILABLE` | Async URI resolver is unavailable. | Configure an async URI resolver on the editor before triggering this call. |  |
| `BINDING.WASM_ASSET_FILTER_JSON_PARSE_FAILED` | Failed to parse asset filter JSON from JS. | Pass an object the JS engine can serialize to JSON (no functions, no cycles, no \`BigInt\`). |  |
| `BINDING.WASM_ASSET_GROUPS_NOT_ARRAY` | Field 'groups' is not an array | Pass \`groups\` as a JavaScript array of group id strings. |  |
| `BINDING.WASM_ASSET_MISSING_ID` | Missing required field 'id' in asset | Each asset definition must carry an \`id\` string. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_DEFAULT_VALUE` | Missing required field 'defaultValue' in asset property | Set the property's \`defaultValue\` field to a value matching its declared \`type\` (same shape as \`value\`). |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_MAX` | Missing required field 'max' in asset property | Provide a numeric \`max\` on a numeric asset property. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_MIN` | Missing required field 'min' in asset property | Provide a numeric \`min\` on a numeric asset property. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_OPTIONS` | Missing required field 'options' in asset property | Provide an \`options\` array on an \`enum\`-type asset property. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_STEP` | Missing required field 'step' in asset property | Provide a numeric \`step\` on a numeric asset property. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_TYPE` | Missing required field 'type' in asset property | Set the property's \`type\` to a supported value: \`String\`, \`Boolean\`, \`Color\`, \`Enum\`, \`Int\`, \`Float\`, or \`Double\`. |  |
| `BINDING.WASM_ASSET_PROPERTY_MISSING_VALUE` | Missing required field 'value' in asset property | Set the property's \`value\` field to a value matching its declared \`type\` (e.g. a number for \`Int\`/\`Float\`/\`Double\`, a string for \`String\`/\`Enum\`). |  |
| `BINDING.WASM_ASSET_PROPERTY_UNKNOWN_TYPE` | Unknown property type: \{type} | '\{type}' is not a valid asset property type. Use one of \`String\`, \`Boolean\`, \`Color\`, \`Enum\`, \`Int\`, \`Float\`, or \`Double\`. |  |
| `BINDING.WASM_ASSET_RESULT_MISSING_ID` | Missing required field 'id' in asset result | Each asset result must carry an \`id\` string. |  |
| `BINDING.WASM_ASSET_RESULT_MISSING_SOURCE_ID` | Missing required field 'context.sourceId' in asset result | Set \`context.sourceId\` on each asset result to the asset source id that produced it. |  |
| `BINDING.WASM_BLOCK_STATE_MISSING_ERROR` | Missing required field 'error' in block state | Pass an \`error\` field on a block state with \`type: 'Error'\`. |  |
| `BINDING.WASM_BLOCK_STATE_MISSING_PROGRESS` | Missing required field 'progress' in block state | Pass a numeric \`progress\` field on a block state with \`type: 'Pending'\`. |  |
| `BINDING.WASM_BLOCK_STATE_MISSING_TYPE` | Missing required field 'type' in block state | Pass a \`type\` field of \`'Ready'\`, \`'Pending'\`, or \`'Error'\` on the block state object. |  |
| `BINDING.WASM_BLOCK_STATE_UNHANDLED` | Unhandled state error. | Internal bridge error — file a bug if you encounter this with a reproducible block state. |  |
| `BINDING.WASM_BLOCK_STATE_UNKNOWN_ERROR` | Unknown block state error: \{error} | Use one of the documented \`BlockStateError\` enum values. |  |
| `BINDING.WASM_BLOCK_STATE_UNKNOWN_TYPE` | Unknown block state type: \{type} | Use one of \`'Ready'\`, \`'Pending'\`, \`'Error'\`. |  |
| `BINDING.WASM_COLOR_MISSING_COLOR_SPACE` | Missing colorSpace field in the color object. | Provide a \`colorSpace\` value of \`'sRGB'\`, \`'CMYK'\`, or \`'SpotColor'\` when constructing a color from JavaScript. |  |
| `BINDING.WASM_COLOR_MISSING_COMPONENTS` | Missing components field in the color object. | Provide a \`components\` array of channel values matching the color space (3 for sRGB, 4 for CMYK). |  |
| `BINDING.WASM_COLOR_MISSING_EXTERNAL_REFERENCE` | Missing externalReference field in the color object. | Set \`externalReference\` (empty string is allowed) when constructing a color from JavaScript. |  |
| `BINDING.WASM_COLOR_MISSING_SPOT_NAME` | Missing spotColorName field in the color object. | Set \`spotColorName\` to a non-empty string when constructing a SpotColor. |  |
| `BINDING.WASM_COLOR_MISSING_TINT` | Missing tint field in the color object. | Set \`tint\` to a number between 0 and 1 when constructing a color from JavaScript. |  |
| `BINDING.WASM_COLOR_PARSE_FAILED` | Could not parse color. | Pass a color object with \`colorSpace\` and the matching channel fields, not a raw value. |  |
| `BINDING.WASM_COMMAND_ARG_MAP_FAILED` | Couldn't map value for argument $\{index} while executing command \`\{command}\` > \{message} | Argument types must match the command's declared signature; see the inner message for the failing field. |  |
| `BINDING.WASM_COMMAND_SINGLE_ARG_MISMATCH` | Received single argument for command \{command}. Expected \{expected}. | Pass exactly the number of arguments the command expects, as an array. |  |
| `BINDING.WASM_FIND_RESULT_MISSING_ASSETS` | Missing required field 'assets' in find assets result | Return an \`assets\` array (may be empty) from the asset source \`findAssets\` callback. |  |
| `BINDING.WASM_FIND_RESULT_MISSING_CURRENT_PAGE` | Missing required field 'currentPage' in find assets result | Return a \`currentPage\` integer from the asset source \`findAssets\` callback. |  |
| `BINDING.WASM_FIND_RESULT_MISSING_TOTAL` | Missing required field 'total' in find assets result | Return a \`total\` integer from the asset source \`findAssets\` callback. |  |
| `BINDING.WASM_FONT_MISSING_SUBFAMILY` | Missing required field 'subFamily' in font | Provide a \`subFamily\` string on each font entry. |  |
| `BINDING.WASM_FONT_MISSING_URI` | Missing required field 'uri' in font | Provide a \`uri\` string on each font entry. |  |
| `BINDING.WASM_GRADIENT_STOP_MISSING_STOP_VALUE` | Gradient color stop must have a stop value | Each gradient color stop needs a \`stop\` number between 0 and 1. |  |
| `BINDING.WASM_MEM_ALLOC_FAILED_BUFFER` | Failed to allocate memory for buffer \{bufferUri} | Reduce the buffer size or grow the WASM memory cap before allocating. |  |
| `BINDING.WASM_MEM_ALLOC_FAILED_HANDLE` | Failed to allocate memory for handle \{handle} | Reduce concurrent in-flight engine handles or grow the WASM memory cap. |  |
| `BINDING.WASM_PAYLOAD_COLOR_CMYK_MISSING_FIELDS` | \`payload.color\` with \`CMYK\` color space must have fields \`c\`, \`m\`, \`y\`, \`k\`. | Provide \`c\`, \`m\`, \`y\`, \`k\` numeric fields on \`payload.color\` when \`colorSpace\` is \`'CMYK'\`. |  |
| `BINDING.WASM_PAYLOAD_COLOR_MISSING_COLOR_SPACE` | \`payload.color\` must have \`colorSpace\` field. | Set \`payload.color.colorSpace\` to \`'sRGB'\`, \`'CMYK'\`, or \`'SpotColor'\`. |  |
| `BINDING.WASM_PAYLOAD_COLOR_SPOT_MISSING_FIELDS` | \`payload.color\` with \`SpotColor\` color space must have fields \`name\`, \`externalReference\`, \`representation\`. | Provide \`name\`, \`externalReference\`, and \`representation\` on a \`SpotColor\` payload color. |  |
| `BINDING.WASM_PAYLOAD_COLOR_SPOT_REPRESENTATION_INVALID` | A \`payload.color\` with colorSpace \`SpotColor\` must use a \`RGB\` or \`CMYK\` color for its \`representation\`. | Set \`representation.colorSpace\` to \`'sRGB'\` or \`'CMYK'\` on the SpotColor payload. |  |
| `BINDING.WASM_PAYLOAD_COLOR_SRGB_MISSING_FIELDS` | \`payload.color\` with \`sRGB\` color space must have fields \`r\`, \`g\`, and \`b\`. | Provide \`r\`, \`g\`, \`b\` numeric fields on \`payload.color\` when \`colorSpace\` is \`'sRGB'\`. |  |
| `BINDING.WASM_PROPERTIES_NOT_ARRAY` | 'properties' is not an array. | Pass \`properties\` as a JavaScript array of \`AssetProperty\` objects. |  |
| `BINDING.WASM_SOURCE_SET_NOT_ARRAY` | 'sourceSet' is not an array. | Pass \`sourceSet\` as a JavaScript array of source objects. |  |
| `BINDING.WASM_TRANSFORM_PRESET_FIXED_ASPECT_MISSING_FIELDS` | 'payload.transformPreset' of type 'FixedAspectRatio' must have fields 'width', and 'height'. | Provide numeric \`width\` and \`height\` fields on a \`'FixedAspectRatio'\` transformPreset. |  |
| `BINDING.WASM_TRANSFORM_PRESET_FIXED_SIZE_MISSING_FIELDS` | 'payload.transformPreset' of type 'FixedSize' must have fields 'width', 'height', and 'designUnit'. | Provide numeric \`width\`, \`height\`, and a \`designUnit\` string on a \`'FixedSize'\` transformPreset. |  |
| `BINDING.WASM_TRANSFORM_PRESET_MISSING_TYPE` | Missing required field 'type' in asset transformPreset | Set \`transformPreset.type\` to one of \`'FreeAspectRatio'\`, \`'FixedAspectRatio'\`, \`'ContentAspectRatio'\`, \`'FixedSize'\`. |  |
| `BINDING.WASM_TRANSFORM_PRESET_UNKNOWN_TYPE` | Unknown transformPreset type: \{type} | Use one of \`'FreeAspectRatio'\`, \`'FixedAspectRatio'\`, \`'ContentAspectRatio'\`, \`'FixedSize'\`. |  |
| `BINDING.WASM_TYPEFACE_MISSING_FONTS` | Missing required field 'fonts' in typeface | Provide a non-empty \`fonts\` array on the typeface object. |  |
| `BINDING.WASM_TYPEFACE_MISSING_NAME` | Missing required field 'name' in typeface | Provide a \`name\` string on the typeface object. |  |
| `BINDING.WASM_UNKNOWN_AUDIO_OUTPUT_TYPE` | Unknown audio output type: \{audioOutput} | Pass one of the documented audio-output type strings. |  |
| `BINDING.WASM_UNKNOWN_COLOR_SPACE` | Unknown color space: \{colorSpace} | Pass one of \`'sRGB'\`, \`'CMYK'\`, \`'SpotColor'\`. |  |
| `BINDING.WASM_UNKNOWN_CUTOUT_OPERATION` | Unknown CutoutOperation \{op} | Pass one of the documented \`CutoutOperation\` enum values. |  |
| `BINDING.WASM_UNKNOWN_CUTOUT_TYPE` | Unknown CutoutType \{type} | Pass one of the documented \`CutoutType\` enum values. |  |
| `BINDING.WASM_UNKNOWN_HORIZONTAL_ALIGNMENT` | Unknown horizontal alignment \{alignment}, use Left, Right, or Center | Pass \`'Left'\`, \`'Right'\`, or \`'Center'\`. |  |
| `BINDING.WASM_UNKNOWN_SCOPE_STATE` | Unknown GlobalScopeState \{value} | Pass one of the documented \`GlobalScopeState\` enum values. |  |
| `BINDING.WASM_UNKNOWN_VERTICAL_ALIGNMENT` | Unknown vertical alignment \{alignment}, use Top, Bottom, or Center | Pass \`'Top'\`, \`'Bottom'\`, or \`'Center'\`. |  |

## BLOCK

Design-block lifecycle, properties, hierarchy, animation.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `BLOCK.ALWAYS_ON_BOTTOM_UNSUPPORTED` | The block does not have an always-on-bottom property. | Only specific block types (e.g. scene, page) carry always-on-bottom. Check api.block.getType(block) is a supported container before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ALWAYS_ON_TOP_UNSUPPORTED` | The block does not have an always-on-top property. | Only specific block types (e.g. scene, page) carry always-on-top. Check api.block.getType(block) is a supported container before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_ASSET_MALFORMED_MODE_KEY` | Malformed asset. The mode should be stored in meta under the "mode" key. | Move the animation mode into asset.meta.mode. The current asset shape is rejected by the loader. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_ASSET_MALFORMED_TYPE_KEY` | Malformed asset. The animation type or "none" should be stored in meta under the "type" key. | Move the animation type into asset.meta.type. The value must be the type identifier or the literal string 'none'. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_ASSET_MISSING_MODE` | The asset does not contain a mode property. | Animation assets must declare a 'mode' field in their meta. Add the field to the asset definition. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_ASSET_MISSING_TYPE` | The asset does not contain a type property. | Animation assets must declare a 'type' field in their meta. Add the field to the asset definition. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NOT_A_PAN_ANIMATION` | The selected animation is not a pan animation. | This API only applies to pan-type animations. Switch to a pan animation first or use the generic property setter. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NOT_A_SLIDE_ANIMATION` | The selected animation is not a slide animation. | This API only applies to slide-type animations. Switch to a slide animation first or use the generic property setter. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NOT_IN_TYPE` | The animation \{blockId} cannot be used as an "in" animation. | The animation block is not tagged as an in/out animation. Create an in/out animation via createAnimation with a compatible type. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NOT_LOOP_TYPE` | The animation \{blockId} cannot be used as a "loop" animation. | The animation block is not tagged as a loop animation. Create a loop animation via createAnimation with a compatible type. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NOT_OUT_TYPE` | The animation \{blockId} cannot be used as an "out" animation. | The animation block is not tagged as an in/out animation. Create an in/out animation via createAnimation with a compatible type. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_ANIMATIONS_ON_BLOCK` | The block does not have any animations. | No animation has been applied to this block. Add an animation asset before querying or modifying it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_ANIMATION_TO_EDIT` | The selected block does not have an animation to be edited. | Apply an animation asset to the block before invoking edit APIs. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_EASING_PROPERTY` | The selected animation has no easing property. | The current animation type does not expose an easing setting. Verify the animation type supports easing before setting it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_EASING_PROPERTY_ON_BLOCK` | The target block does not have an animationEasing property. | The current animation type doesn't expose easing. Pick a type that does, or skip the property. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_OVERLAP_PROPERTY` | The target block does not have an textAnimationOverlap property. | textAnimationOverlap only exists on text-animation types. Confirm the animation type first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_TEXT_WRITING_STYLE` | The selected animation has no text writing style property. | Text writing style is only available on text-animation types. Confirm the active animation supports it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_NO_WRITING_STYLE_PROPERTY` | The target block does not have an textAnimationWritingStyle property. | textAnimationWritingStyle only exists on text-animation types. Confirm the animation type first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_TEXT_ONLY` | The animation \{blockId} can only be added to text blocks. | Text animations only apply to text blocks. Either pick a non-text animation or attach this animation to a text block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_TYPE_NOT_REGISTERED` | Unknown animation type: \{type} | Animation type '\{type}' is not registered. Use createAnimation with a built-in type or register a custom animation first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_EASING` | Unknown easing value: \{value} | Easing '\{value}' is not recognized. Use one of the predefined easing names. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_ENUM` | Unknown enum value: \{value} | The enum value '\{value}' is not a member of the targeted animation property. Inspect the property's valid set via the schema. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_MODE` | Unknown animation mode: \{mode} | Animation mode '\{mode}' is not one of 'In', 'Loop', or 'Out'. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_MODE_IN_ASSET` | The asset contains an unknown mode. | The asset's 'mode' value is not recognized. Valid modes are 'In', 'Loop', and 'Out'. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_PROPERTY_TYPE` | Unknown property type. | The animation property type is not handled by the editor. This likely indicates a stale or unsupported asset definition. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNKNOWN_TYPE` | Unknown animation type. | The animation type identifier is not registered. Confirm the asset 'type' matches a built-in or registered custom animation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ANIMATION_UNSUPPORTED` | The block does not support being animated. | Only blocks with animation capability accept animation assets. Call api.block.supportsAnimation(block) before applying an animation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ASSET_SOURCE_SORT_KEY_MISSING` | Sort key not found in asset source. | The asset source does not provide the requested sort key. Use a sort key the source declares. | [Blocks](./concepts/blocks.md) |
| `BLOCK.AUDIO_TRACK_INDEX_OUT_OF_BOUNDS` | Audio track index \{index} is out of bounds. Valid range: 0-\{max}. | Pass an audio-track index in \[0, \{max}]. Use getAudioTrackCountFromVideo() to inspect the count. | [Blocks](./concepts/blocks.md) |
| `BLOCK.AUTO_TO_FREE_LAYOUT_UNSUPPORTED` | Switching from an automatic to free layout isn't supported yet. | Once a page or stack is in automatic layout, free-layout switching requires reconstructing the children. Re-create the layout instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BACKGROUND_COLOR_UNSUPPORTED` | The block doesn't have a background color. | Only pages and a handful of container blocks expose a background color. Call api.block.supportsBackgroundColor(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BLEND_MODE_UNSUPPORTED` | The block doesn't have a blend mode. | Only renderable design blocks expose blendMode. Call api.block.supportsBlendMode(block) before setting it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BLOCKS_NOT_COMBINABLE` | Blocks cannot be combined. | Boolean combine requires two or more shape-bearing blocks. Verify the selection contains compatible shapes. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BLUR_UNKNOWN_TYPE` | Unknown blur type: \{type} | Blur type '\{type}' is not registered. Use one of the built-in blur types (uniform, linear, radial, mirrored). | [Blocks](./concepts/blocks.md) |
| `BLOCK.BLUR_UNSUPPORTED` | Target block doesn't support blur. | Only renderable design blocks carry blur. Verify with supportsBlur(block) before applying. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BUFFER_LENGTH_OUT_OF_RANGE` | Length \{length} at offset \{offset} is out of range \[0, \{max}]. | Ensure offset + length \<= \{max}. Either reduce the length or grow the buffer first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BUFFER_NOT_FOUND` | Buffer not found: \{uri} | No buffer is registered at URI '\{uri}'. Call createBuffer or write to the URI before reading. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BUFFER_OFFSET_OUT_OF_RANGE` | Offset \{offset} is out of range \[0, \{max}]. | Pass an offset in \[0, \{max}]. Use the buffer's current size to validate before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.BUFFER_URI_INVALID` | Invalid buffer URI: \{uri} | Buffer URIs must use the 'buffer://' scheme. Re-create the buffer to obtain a valid URI. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CAMERA_DESTRUCTION_NOT_ALLOWED` | Destruction of camera is not allowed. | Cameras are managed by the scene. Destroy the scene, not the camera, to remove camera state. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CAMERA_TRANSFORM_LOCK` | Camera's transform cannot be locked. | Cameras are not lockable. Use scene-level interaction settings to restrict camera movement. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CAPTIONS_DISABLED` | Creation of captions is not allowed. Please enable the video captions feature. | Enable settings.features.videoCaptionsEnabled before creating a caption block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CAPTION_TRACKS_DISABLED` | Creation of caption tracks is not allowed. Please enable the video captions feature. | Enable settings.features.videoCaptionsEnabled before creating a caption track block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CHILDREN_INDEX_OUT_OF_BOUNDS` | Index \{index} is out of bounds for \{count} children. | Pass an index in \[0, \{count}]. Use getChildren(block).size() to inspect the current count. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COLOR_COMPONENT_OUT_OF_RANGE` | \{component} color component out of range \[0, 1]: \{value}. | Clamp '\{component}' to the \[0, 1] range. NaN is also rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COLOR_NOT_IN_COLOR_SPACE` | The color is not in the '\{colorSpace}' color space. | Read the color via the accessor for its actual color space, or convert it first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COLOR_SPACE_CONVERSION_NOT_SUPPORTED` | Cannot convert to that color space. | Color-space conversion to SpotColor is not defined — convert to sRGB or CMYK instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COLOR_TINT_OUT_OF_RANGE` | Tint out of range \[0, 1]: \{value}. | Clamp the tint to the \[0, 1] range. NaN is also rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COMBINE_TEXT_FONT_LOADING` | Block \{id} is a text block whose fonts have not finished loading. Call forceLoadResources on it before combine. | Wait for the text block's fonts to load (api.block.forceLoadResources) before invoking boolean combine. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COMPONENT_NOT_REGISTERED` | \{component} is not a registered type. | Reflection has no registration for component '\{component}'. Confirm the property string is correct. | [Blocks](./concepts/blocks.md) |
| `BLOCK.COMPONENT_NO_PROPERTY` | \{component} doesn't have property \{property}. | Component '\{component}' has no field named '\{property}'. Inspect findAllProperties(block) for valid keys. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_ASPECT_IMAGE_NO_DIMENSIONS` | ContentAspectRatio: image fill has no usable intrinsic dimensions yet; the image is not decoded and the sourceSet is empty. | Set 'fill/image/sourceSet' with explicit width and height, or wait for the image to decode before applying the preset. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_ASPECT_NOT_IMAGE_OR_VIDEO` | ContentAspectRatio: fill is neither an image nor a video; only those carry intrinsic dimensions. | Replace the fill with an image or video fill. Color and gradient fills have no intrinsic dimensions. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_ASPECT_NO_FILL` | ContentAspectRatio: block has no fill; only image and video fills carry intrinsic dimensions. | Add an image or video fill to the block before querying its content aspect ratio. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_ASPECT_VIDEO_NO_DIMENSIONS` | ContentAspectRatio: video fill has no usable intrinsic dimensions yet; wait for the first frame to decode or set the sourceSet with explicit width and height. | Wait for the first frame to decode, or set 'fill/video/sourceSet' with explicit width and height before applying the preset. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_FILL_ALIGNMENT_UNSUPPORTED` | The block doesn't support content fill alignment. | Only blocks with a sized image/video fill support contentFillAlignment. Resolve the fill with api.block.getFill(block) and confirm api.block.getType(fill) is an image or video fill first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CONTENT_FILL_MODE_UNSUPPORTED` | The block doesn't have a content fill mode. | Only blocks with image/video fills expose a content fill mode. Call api.block.supportsContentFillMode(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CREATION_NOT_ALLOWED` | Creation of \{type} is not allowed. | Type '\{type}' is not user-creatable. It is created implicitly by other engine operations. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CUTOUT_NO_BLOCK_SELECTED` | No block selected can be given a cutout. | Cutouts apply to selected graphic blocks. Select at least one cutout-capable block first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.CUTOUT_PATH_REQUIRED` | 'vectorPath' is required for Cutout. | Pass a non-empty 'vectorPath' string when creating a Cutout block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.DIFFERENCE_NO_EFFECT` | Difference has no visible effect. | The subtracted shape does not intersect the base. Reposition or resize so they overlap. | [Blocks](./concepts/blocks.md) |
| `BLOCK.DROP_SHADOWS_UNSUPPORTED` | The block doesn't support drop shadows. | Only renderable design blocks carry shadow properties. Call api.block.supportsDropShadow(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.EFFECTS_UNSUPPORTED` | Target block doesn't support effects. | Only renderable design blocks carry an effects stack. Verify with supportsEffects(block) before mutating it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.EFFECT_INDEX_OUT_OF_BOUNDS` | Index \{index} out of bounds (\{count}). | Pass an index in \[0, \{count}]. Use getEffects(block).size() to inspect the current count. | [Blocks](./concepts/blocks.md) |
| `BLOCK.EFFECT_NOT_AN_EFFECT` | Only effects can be enabled and disabled. Use setVisible instead if you are trying to change the visibility of a design block. | Pass an effect block, or use setVisible(block, ...) to toggle a design block's visibility. | [Blocks](./concepts/blocks.md) |
| `BLOCK.EFFECT_UNKNOWN_TYPE` | Unknown effect type: \{type} | Effect type '\{type}' is not registered. Use a built-in effect type or register a custom one before creating. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ELEMENTS_NOT_ALIGNABLE` | Elements cannot be aligned. | Alignment requires two or more selectable design blocks under a common parent that supports free layout. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ELEMENTS_NOT_DISTRIBUTABLE` | Elements cannot be distributed. | Distribution requires three or more selectable design blocks under a common parent that supports free layout. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ELEMENTS_NOT_GROUPABLE` | Elements cannot be grouped. | Grouping requires two or more design blocks under the same parent. Verify the selection before calling group(). | [Blocks](./concepts/blocks.md) |
| `BLOCK.ENTITY_NOT_LAID_OUT` | Entity \{block} has not been laid out yet. | Call api.scene.update() (or wait for the next frame) so layout has run, then retry. | [Blocks](./concepts/blocks.md) |
| `BLOCK.ENUM_VALUE_INVALID` | Invalid enum value \{value} for property \{property}. | Use one of the values returned by api.block.getEnumValues('\{property}'). | [Blocks](./concepts/blocks.md) |
| `BLOCK.EXPORTABLE_UNSUPPORTED` | The block doesn't have exportable option. | Only specific block types track the 'exportable' flag. Check api.block.getType(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_GET_SOLID_COLOR_WRONG_TYPE` | Tried to get solid color fill value on a block that has no such fill color. | The block's fill is not a solid color. Inspect the fill type via getType(getFill(block)) first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_MISSING` | Target block has no Fill. | Attach a fill via setFill(block, fill) or use supportsFill(block) to confirm support. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_NOT_VALID` | Specified fill is not a valid fill. | Create the fill via api.block.createFill(...) and pass that id. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_NO_SOLID_COLOR` | Fill has no solid color. | The fill block is not a SolidColor. Inspect getType(getFill(block)) and use the matching accessor. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_NO_SOLID_COLOR_FILL` | Block has no solid color fill. | Attach a solid-color fill via setFill(block, createFill('color')) before reading the color. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_SET_SOLID_COLOR_WRONG_TYPE` | Tried to set Fill Color on a block with different fill type. | Switch the block's fill to a solid-color fill, or use the matching API for the current fill type. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_TEXT_SOLID_COLOR_ONLY` | Text blocks only support solid color fills. | Use createFill('color') for text blocks. Image, video, and gradient fills are not supported on text. | [Blocks](./concepts/blocks.md) |
| `BLOCK.FILL_UNSUPPORTED` | The block doesn't have a fill. | Only renderable design blocks expose a fill. Confirm the block type before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.GRADIENT_COLOR_STOPS_DUPLICATE` | Gradient color stops need to have unique values between 0 and 1. Found duplicate value \{value}. | Remove the duplicate stop at \{value} so each stop's position is unique. | [Blocks](./concepts/blocks.md) |
| `BLOCK.GRADIENT_COLOR_STOPS_NOT_SORTED` | Gradient color stops must be sorted in ascending order. | Sort the stops by position ascending before passing the array. | [Blocks](./concepts/blocks.md) |
| `BLOCK.GRADIENT_COLOR_STOPS_OUT_OF_RANGE` | Gradient color stops must be between 0 and 1. | Clamp each stop's position into \[0, 1] before passing the array to api.block.setGradientColorStops; positions outside the range are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.GRADIENT_COLOR_UNSUPPORTED` | The block does not have a gradient color property. | Only gradient-fill blocks expose gradient color stops. Resolve the fill with api.block.getFill(block) and confirm api.block.getType(fill) is a gradient fill first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.GROUP_ABSOLUTE_ONLY` | Block is a group and can only have Absolute position mode. | Groups always use absolute layout. Don't set a relative position mode on a group block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.HEIGHT_INVALID_FOR_SCALING` | Current height is invalid for scaling. | The block's current height is zero or non-finite. Set a valid height before scaling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.HISTORY_HANDLE_INVALID_AT` | \{handle} is not a valid history handle. | The history handle is unknown or has been released. Re-obtain it via createHistory() before calling. | [Undo And History](./concepts/undo-and-history.md) |
| `BLOCK.ID_INVALID` | The block with ID \{block} is not valid. It may have been deleted, e.g., when a new scene was loaded. | Re-resolve the block id after scene changes. Use isValid(block) to guard before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.IMAGE_FILL_UNSUPPORTED` | The block does not have an image fill property. | Only blocks with an image fill expose this property. Resolve the fill with api.block.getFill(block) and confirm api.block.getType(fill) is an image fill before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.IMAGE_LOAD_FAILED` | Failed to load image. | The image source could not be decoded or fetched. Verify the URI is reachable, the MIME type is one the engine supports, and the bytes are a valid image. | [Blocks](./concepts/blocks.md) |
| `BLOCK.KEY_NOT_FOUND` | Key \{key} on block \{block} not found. | Property '\{key}' is not defined on block \{block}. Use findAllProperties(block) to enumerate valid keys. | [Blocks](./concepts/blocks.md) |
| `BLOCK.MISSING_REQUESTED_COMPONENT` | The block doesn't have the requested properties. | The requested component is not attached to this block. Use the matching api.block.supports\*(block) query (or check api.block.getType(block)) to confirm the feature before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NAME_UNSUPPORTED` | The block does not have a name. | Only renderable design blocks carry a name. Check api.block.getType(block) is a design block before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_ATTACHED_TO_SCENE` | Block \{block} is not attached to a scene. | Append the block under the active scene (or one of its descendants) before calling this API. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_A_CUTOUT_BLOCK` | The block \{id} is not a Cutout block. | This API requires a cutout block. Use createCutout or filter by '//ly.img.ubq/cutout' first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_A_DESIGN_BLOCK` | Block is not a design block. | This API requires a design block (page, graphic, text, audio, video, etc.). Fills, shapes, and animations are not design blocks. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_A_TEXT_BLOCK` | Entity \{block} is not a text block. | Pass a text block id. Use getType(block) to confirm the block type before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_A_TEXT_BLOCK_SIMPLE` | block is not a text block. | Pass a text block. Use getType(block) to confirm the block type before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_A_VIDEO_FILL_BLOCK` | The provided block must be a video fill block or a block with a video fill. | Pass a video fill block directly, or a design block whose fill is a video. Use getFill(block) to resolve. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_KNOWN_BLOCK_TYPE` | \{type} is not a known block type. | Block type '\{type}' is not registered. Use findAllTypes() to enumerate supported types. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT` | Block hasn't been laid out yet. | Call api.scene.update() (or wait for the next frame) so layout has run, then retry. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_AABB` | Could not get AABB. Block hasn't been laid out yet. | Layout has not run for this block. Trigger a layout pass or wait one frame before querying the AABB. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_BEFORE_ADJUST_CROP` | Block has not been laid out yet. Call update() before adjustCropToFillFrame(). | adjustCropToFillFrame() requires a laid-out frame. Run api.scene.update() first, then retry. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_FLIP_H` | Could not flip horizontally. Block hasn't been laid out yet. | Layout has not run for this block. Trigger a layout pass or wait one frame before flipping. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_FLIP_V` | Could not flip vertically. Block hasn't been laid out yet. | Layout has not run for this block. Trigger a layout pass or wait one frame before flipping. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_FOR_SCENE` | The block \{id} has not been layouted and may therefore not be part of the scene. | Confirm block \{id} is attached and the scene has been updated. Trigger an explicit update if the block was just added. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_ROTATION` | Could not set rotation. Block hasn't been laid out yet. | Layout has not run for this block. Trigger a layout pass or wait one frame before setting rotation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_LAID_OUT_SCALE` | Could not scale. Block hasn't been laid out yet. | Layout has not run for this block. Trigger a layout pass or wait one frame before scaling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NOT_VALID` | Block is not valid. | The block id no longer references a live block. It may have been destroyed; re-resolve the id before calling this API. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_AUDIO_TRACKS_FOUND` | No audio tracks found in the video. | The video container reports zero audio tracks. Use a source that includes audio or skip this operation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_AUDIO_TRACKS_IN_VIDEO` | The video does not contain any audio tracks. | The decoded video has no audio streams. Confirm the source file actually contains audio. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_BLOCK_SELECTED` | No block is selected. | This API requires a selected block. Use api.block.findAllSelected() to confirm a selection before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_KIND` | Block does not have a kind. | Only design blocks expose a 'kind' property. Check api.block.getType(block) to confirm it is a design block (not a fill/shape/animation) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_PARENT` | Block doesn't have a parent. | The block is detached (e.g. the scene root). Attach it to a parent or guard with hasParent(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_POSITION` | Block has no defined position. | Position requires a Position component. Auto-layout containers or unattached blocks may not expose one. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_SHAPE_PROPERTY` | Target block has no shape property. | Only blocks with a shape component (graphic, vector) expose a shape property. Call api.block.supportsShape(block) before accessing the shape. | [Blocks](./concepts/blocks.md) |
| `BLOCK.NO_SIZE` | Block has no defined size. | Size requires a Size component. Confirm the block is a sized type (page, graphic, text) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.OPACITY_UNSUPPORTED` | The block doesn't have an opacity. | Only renderable design blocks expose opacity. Call api.block.supportsOpacity(block) before setting it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.OPERATION_PRECONDITION_FAILED` | \{reason} | The structural precondition check returned a free-text reason — see \`reason\` for the specific blocker (e.g. mixed parents, incompatible block types, missing layout). | [Blocks](./concepts/blocks.md) |
| `BLOCK.OP_NEEDS_TWO_BLOCKS` | Not enough blocks to perform operation. Must be at least two. | Select at least two blocks before invoking this operation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PARENT_NOT_LAID_OUT` | Parent block hasn't been laid out yet. | Layout has not run for the parent. Trigger an update or wait one frame before reading relative geometry. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PENDING_PROGRESS_INVALID` | Pending progress must be between 0 and 1. | Clamp the progress value to \[0, 1] before passing it to setPendingProgress. | [Blocks](./concepts/blocks.md) |
| `BLOCK.POSITION_LOCKED` | Block's position is locked and can't be modified. | Call setPositionLocked(block, false) before changing the position. | [Blocks](./concepts/blocks.md) |
| `BLOCK.POSITION_PARENT_CONTROLLED` | Block's position is controlled by the parent block and can't be modified. | The block's parent uses an automatic layout. Detach the block, switch the parent to free layout, or modify the parent instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_ENUM_CAST_FAILED` | \{property} cannot be cast to an enum value | The property value does not convert to an unsigned 32-bit integer. The property may not actually be an enum type, or its reflected representation is misconfigured. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_ENUM_MEMBER_CAST_FAILED` | \{member} cannot be cast to an enum value | An enum member's value does not convert to an unsigned 32-bit integer. The reflected enum is misconfigured. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_FONT_FILE_URI_DIRECT_UNSUPPORTED` | Setting the "text/fontFileUri" property directly is unsupported. Use the setFont API instead. | Call setFont(block, fontFileUri, typefaceName) so the typeface, weight and style stay consistent. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_GETTER_MISMATCH` | Incorrect function used, expected get\{kind}. | The property's type is '\{kind}'. Call the matching get\{kind}(...) accessor instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_INVALID_ENUM_VALUE` | \{property} holds an invalid enum value. | The property's integer value does not match any registered enum member. The block's stored state may be corrupt. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_INVALID_ENUM_VALUE_CHOICES` | Invalid enum value, expected one of: \[\{choices}] | Pass one of the listed enum identifiers. The catalog \`choices\` arg carries the comma-separated quoted list the setter would have accepted. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_AN_ENUMERATION` | Property's type is not an enumeration. | Querying the allowed enum choices is only valid for enum-typed properties. Check the property's \`PropertyType\` first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_ENUM` | \{property} is not an enum property. | \`getPropertyAllowedValues(...)\` / enum accessors only apply to enum-typed properties. Check the property type first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_FOUND` | Property not found: "\{property}". | Inspect api.block.findAllProperties(block) for the set of properties this block exposes. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_FOUND_WITH_HINT` | \{prefix}Valid properties, as listed by \`findAllProperties(id)\`, are: \{properties}. | Pick one of the listed properties or call findAllProperties(block) to inspect the live set. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_READABLE` | Property is not readable. | This property is write-only on the requested block type. Use the matching setter instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_NOT_WRITEABLE` | Property is not writeable. | This property is read-only on the requested block type. Inspect the value with the matching getter instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.PROPERTY_SETTER_MISMATCH` | Incorrect function used, expected set\{kind}. | The property's type is '\{kind}'. Call the matching set\{kind}(...) accessor instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.RESULT_EMPTY_SHAPE` | Result is an empty shape. | The boolean operation produced no visible geometry. Adjust the inputs so they overlap appropriately. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SCENE_CREATE_DIFFERENT` | To create a scene, use \`createScene\` instead. | Scenes have a dedicated lifecycle. Call api.scene.create() rather than block.create('//ly.img.ubq/scene'). | [Scenes](./concepts/scenes.md) |
| `BLOCK.SCOPES_UNSUPPORTED` | Block \{block} does not support scopes. | Scope APIs require a block type that carries access control. Most renderable design blocks do; pages and tracks typically do not. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SCOPE_INVALID` | Invalid scope: \{scope} | The scope name '\{scope}' is not recognized. Use one of the documented scope keys (e.g. 'design/style', 'editor/select'). | [Blocks](./concepts/blocks.md) |
| `BLOCK.SCOPE_MIXED_VALUES` | Not all underlying scopes of \{scope} have the same value. | The compound scope '\{scope}' aggregates multiple keys that currently disagree. Set them individually or accept the indeterminate state. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SCOPE_PERMISSION_DENIED` | \{message} | Unlock the scope '\{scope}' via setScopeEnabled(block, '\{scope}', true) before invoking this API. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SELECTION_DISABLED` | Selection disabled for block. | The block's selectability has been disabled via setSelectable(block, false). Re-enable to select it programmatically. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SHADOW_X_BLUR_INVALID` | The x-blur radius must be a finite number greater than or equal to 0. | Pass a non-negative finite x-blur. NaN and negative values are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SHADOW_X_OFFSET_INVALID` | The x-offset must be a finite number. | Pass a finite x-offset. NaN and ±infinity are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SHADOW_Y_BLUR_INVALID` | The y-blur radius must be a finite number greater than or equal to 0. | Pass a non-negative finite y-blur. NaN and negative values are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SHADOW_Y_OFFSET_INVALID` | The y-offset must be a finite number. | Pass a finite y-offset. NaN and ±infinity are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SHAPE_NOT_VALID` | Specified shape is not a valid shape. | The provided block id does not reference a shape sub-block. Use createShape or pick a registered shape type. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SOME_ELEMENTS_NOT_LOADED` | Some elements are not completely loaded. | Wait for the scene's resources to finish loading. Subscribe to resource events or poll api.scene.loadingState. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SOURCE_SET_EMPTY` | The source set is empty. | Populate the source set via addSource(...) before invoking source-set APIs. | [Blocks](./concepts/blocks.md) |
| `BLOCK.STROKES_UNSUPPORTED` | The block doesn't support strokes. | Only renderable design blocks carry stroke properties. Verify with supportsStroke(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.STROKE_DASH_ARRAY_INVALID` | Stroke dash array values must be finite numbers. | Replace any NaN/infinity entries in the dash array with finite numbers. | [Blocks](./concepts/blocks.md) |
| `BLOCK.STROKE_DASH_OFFSET_INVALID` | Stroke dash offset must be a finite number. | Pass a finite numeric dash offset. NaN and ±infinity are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.STROKE_MISSING` | Target block has no Stroke. | Enable the stroke via setStrokeEnabled(block, true) before mutating stroke properties. | [Blocks](./concepts/blocks.md) |
| `BLOCK.STROKE_WIDTH_INVALID` | The stroke width must be a finite number greater than or equal to 0. | Pass a non-negative finite width. NaN and negative values are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.SVG_PATH_PARSE_FAILED` | The SVG path could not be parsed. | Pass a valid SVG path string (e.g. "M10 10 L20 20 Z"). Validate with an SVG path parser if unsure. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TARGET_NOT_AN_ANIMATION` | The target block is not an animation. | Pass an animation block id. Use getType(block) to confirm before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TARGET_NOT_A_VIDEO_FILL` | The target block is not a video fill. | Pass a video fill block. Use getFill(block) on a design block to resolve it. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_CANNOT_TOGGLE_BOLD` | The block cannot be toggled between bold and normal font weights. | The current typeface does not expose both regular and bold weights. Pick a typeface that does. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_CANNOT_TOGGLE_ITALIC` | The block cannot be toggled between italic and normal font styles. | The current typeface does not expose both normal and italic styles. Pick a typeface that does. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_INVALID_FONT_SIZE` | The font size must be a positive finite number. | Pass a positive finite font size. NaN, zero, and negative values are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_INVALID_KERNING` | Kerning must be a finite number. | Pass a finite kerning value. NaN and ±infinity are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_INVALID_LINE_INDEX` | Invalid line index: \{lineIndex}. | Pass a line index in \[0, lineCount(block) - 1]. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_INVALID_RANGE_FOR_LINE` | Invalid text range for line index: \{lineIndex}. | Wait for layout to settle (api.scene.update()) before requesting text ranges for a line. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_LINE_BOUNDS_FAILED` | Failed to calculate line bounds for line index: \{lineIndex}. | Ensure the block has been laid out (api.scene.update()) before requesting line bounds. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_LINE_HEIGHT_INVALID` | lineHeight must be greater than zero. | Pass a positive lineHeight. Zero and negative values are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_LIST_LEVEL_NEGATIVE` | The list level must be non-negative. | Pass a list level in \[0, 4]. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_LIST_LEVEL_TOO_LARGE` | The list level must be less than 5. | Pass a list level in \[0, 4]. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_NO_BLOCK_BEING_EDITED` | No text block is currently being edited. | Enter text editing mode (e.g. via setEditMode('Text')) before calling cursor/composition APIs. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_NO_TYPEFACE` | block has no typeface. | Assign a typeface to the block via setFont() before invoking this API. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_NO_TYPEFACE_AND_DEFAULT_NOT_REGISTERED` | block has no typeface set and the default font is not registered as a typeface. | Either set a typeface explicitly via setFont() or register the default font as a typeface. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_ON_PATH_INVALID_SVG_PATH` | svgPath is not a valid SVG path string. | Pass a non-empty, parseable SVG path (e.g. 'M 0,0 L 100,0'). Validate the string before calling setTextOnPath. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_ON_PATH_MULTIPLE_SUBPATHS` | svgPath must contain exactly one subpath (no multiple 'M' commands). | Text on path follows a single contour. Split the path or pass only one subpath (a single leading 'M'). | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_ON_PATH_NO_MEASURABLE_CONTOUR` | svgPath contains no measurable contour. | The path has zero length (e.g. a single 'M' with no draw commands). Provide a path with a real, measurable contour. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_PARAGRAPH_INDEX_NEGATIVE` | paragraphIndex must be non-negative. | Use a paragraph index >= 0. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_PARAGRAPH_INDEX_OUT_OF_RANGE` | paragraphIndex is out of range. | Pass a paragraph index in \[0, paragraphCount(block) - 1]. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_RANGE_FROM_OUT_OF_RANGE` | The \`from\` index is out of range. | Clamp 'from' to a non-negative index within the block's character count. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_RANGE_INVALID_ORDER` | Invalid range: from (\{from}) cannot be greater than to (\{to}). | Swap or adjust the bounds so 'from' \<= 'to'. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_RANGE_NEGATIVE` | Invalid range: from (\{from}) and to (\{to}) must be -1 or non-negative. | Use -1 to signal 'end of text' or pass a non-negative index for either bound. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_RANGE_TO_OUT_OF_RANGE` | The \`to\` index is out of range. | Clamp 'to' to an index within the block's character count. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_TYPEFACE_UPDATE_FAILED` | Failed to update text typeface: \{reason} | Inspect \`reason\` for the underlying text-shaping failure (typically font fallback, glyph coverage, or asset registry issues). | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_UNKNOWN_TYPEFACE` | block has an unknown typeface: '\{typeface}'. | Register the typeface '\{typeface}' with the engine, or pick one that has already been registered. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_UNSUPPORTED_FONT_STYLE` | The block does not support the given style. Failed to find a font with the specified style. | Pick a style that the current typeface supports. Inspect getTextFontStyles(block) for the available set. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TEXT_UNSUPPORTED_FONT_WEIGHT` | The block does not support the given weight. Failed to find a font with the specified weight. | Pick a weight that the current typeface supports. Inspect getTextFontWeights(block) for the available set. | [Blocks](./concepts/blocks.md) |
| `BLOCK.THRESHOLD_NOT_FINITE` | The threshold values must be a finite number. | NaN and infinity are not accepted as threshold inputs. Pass finite floating-point values. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSFORM_LOCKED_FILL_PARENT` | Block's transform is locked and can't fill its parent. | Call setTransformLocked(block, false) before invoking fillParent. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSFORM_LOCKED_FLIP` | Block's transform is locked and can't be flipped. | Call setTransformLocked(block, false) before flipping. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSFORM_LOCKED_RESIZE` | Block's transform is locked and can't be resized. | Call setTransformLocked(block, false) before resizing, or pick a different block. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSFORM_LOCKED_ROTATE` | Block's transform is locked and can't be rotated. | Call setTransformLocked(block, false) before rotating. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSFORM_LOCKED_SCALE` | Block's transform is locked and can't be scaled. | Call setTransformLocked(block, false) before scaling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSITION_BLOCK_INVALID` | Block \{blockId} is not a valid transition. | The block passed to setTransition does not exist or has no block type. Create the transition via createTransition first. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSITION_BLOCK_NOT_A_TRANSITION` | Block \{blockId} is not a transition. | The block passed to setTransition is not a transition block. Create one via createTransition and pass that instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TRANSITION_TYPE_NOT_REGISTERED` | Unknown transition type: \{type} | Transition type '\{type}' is not registered. Use createTransition with one of the built-in transition types. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_ARRANGED` | Object of type \{type} cannot be arranged. | Arrange operations (bringToFront, etc.) apply only to design blocks within a container. Type \{type} doesn't qualify. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_CLIPPED` | Object of type \{type} cannot be clipped. | Type \{type} has no clipping support. Wrap it in a group or page and apply clipping there. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_FLIPPED` | Object of type \{type} cannot be flipped. | Type \{type} has no flip capability. Apply the flip to its parent or wrap in a group. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_LOCKED` | Object of type \{type} cannot be locked. | Type \{type} has no lock capability. Locking only applies to design blocks. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_PLACEHOLDER` | Object of type \{type} cannot be a placeholder. | Placeholders only apply to design blocks with content (graphic, text). Type \{type} cannot host placeholder behavior. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_BE_SELECTED` | Object of type \{type} cannot be selected. | Type \{type} is not user-selectable. Use a different selection target. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_CANNOT_HAVE_ROTATION` | Object of type \{type} cannot have a rotation. | Type \{type} does not support rotation. Wrap it in a group or rotate its parent instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NOT_A_CHILD` | Cannot add block of type \{type} as a child of another block. | Blocks of type \{type} are render blocks and must be attached via their dedicated property (e.g. fill, shape) rather than as a generic child. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_ADDING_CHILDREN` | Cannot add children to a block of type \{type}. | Blocks of type \{type} are not containers. Use a page, group, or track block to compose children. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_CHILDREN` | Object of type \{type} cannot have children. | Blocks of type \{type} are leaves in the scene tree. Use a container type (page, group, track) to hold children. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_FRAME` | Object of type \{type} does not have a frame. | Only design blocks with computed layout expose a frame. Cameras, scenes, fills, and shapes do not. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_GROUPS` | Object of type \{type} does not support groups. | Type \{type} cannot be grouped. Only design blocks under a common parent can be grouped. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_HIGHLIGHTING` | Object of type \{type} does not support highlighting. | Highlighting only applies to design blocks. Type \{type} cannot be highlighted. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_PARENT` | Object of type \{type} cannot have a parent. | Blocks of type \{type} are render blocks (fills, shapes, blurs, effects). They live alongside design blocks rather than under them. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_PLACEHOLDER_BEHAVIOR` | Object of type \{type} does not support placeholder behavior. | Type \{type} cannot be configured with placeholder hints or controls. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_PLACEHOLDER_CONTROLS` | Object of type \{type} does not have placeholder controls. | Type \{type} has no placeholder-related properties. Choose a design block that supports placeholders (graphic, text). | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_POSITION` | Object of type \{type} cannot have a position. | Blocks of type \{type} have no position property. Render blocks and scenes are positioned implicitly. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_ROTATION` | Object of type \{type} does not have a rotation. | Rotation requires a Rotation component, which is not present on type \{type}. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_SIZE` | Object of type \{type} cannot have a size. | Blocks of type \{type} have no size property. Cameras, scenes, fills, and shapes are sized implicitly via other blocks. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_NO_VISIBILITY_STATE` | Object of type \{type} does not have any visibility state. | Type \{type} is always visible (cameras, scenes). Use show/hide on a design block instead. | [Blocks](./concepts/blocks.md) |
| `BLOCK.TYPE_PERMANENTLY_NON_SELECTABLE` | Object of type \{type} is permanently non-selectable. | Type \{type} is engine-managed and cannot be made selectable. | [Blocks](./concepts/blocks.md) |
| `BLOCK.UNION_NO_EFFECT` | Union has no visible effect. | The shapes already overlap or are identical. Pick distinct shapes to see a union result. | [Blocks](./concepts/blocks.md) |
| `BLOCK.UNKNOWN` | Block \{block} is unknown. | The block id no longer references a live design block. Re-resolve the id, or guard with isValid(block) before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.UNKNOWN_BLOCK_TYPE` | Unknown block type: \{type} | Block type '\{type}' is not registered. Use a built-in type or register a custom type before calling create(). | [Blocks](./concepts/blocks.md) |
| `BLOCK.UNKNOWN_FILL_TYPE` | Unknown fill type: \{type} | Fill type '\{type}' is not registered. Supported types: color, gradient/linear, gradient/radial, gradient/conical, image, video, pixelStream. | [Blocks](./concepts/blocks.md) |
| `BLOCK.UNKNOWN_SHAPE_TYPE` | Unknown shape type: \{type} | Shape type '\{type}' is not registered. Use a built-in shape type or register a custom one before creation. | [Blocks](./concepts/blocks.md) |
| `BLOCK.UUID_UNSUPPORTED` | The block does not have a UUID. | Only renderable design blocks carry a UUID. Check api.block.getType(block) is a design block before calling. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VALUES_NOT_FINITE_THREE` | The values \{first}, \{second}, and \{third} must be finite numbers. | All three values must be finite. Replace any NaN or infinity with a concrete number. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VALUES_NOT_FINITE_TWO` | The values \{first} and \{second} must be a finite number. | Both values must be finite. Replace any NaN or infinity with a concrete number. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VALUE_NOT_FINITE` | The value \{value} must be a finite number. | Pass a finite numeric value. NaN and ±infinity are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VALUE_NOT_FINITE_IN_UNIT_RANGE` | The value \{value} must be a finite number in the range \[0, 1]. | Clamp the value to \[0, 1] before passing it in. NaN and infinities are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VALUE_NOT_NUMBER` | The value \{value} must be a number. | Pass a numeric value. Strings, NaN, and infinities are rejected. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VARIABLE_NOT_FOUND` | Variable with name "\{name}" not found. | Variable '\{name}' has not been declared. Call setVariable(name, value) once before reading. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VIDEO_FILL_NO_URI` | The video fill block does not have a valid file URI. | Set a non-empty fileURI on the video fill via setURI() before invoking this API. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VIDEO_LOAD_FAILED` | Failed to load video. | The video source could not be decoded or fetched. Verify the URI is reachable, the container/codec is supported, and the bytes are a valid video. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VIDEO_RESOURCE_NOT_LOADED` | The video resource has not been loaded yet. | Wait for the video resource to reach Ready, or call forceLoadAVResource(block, callback) before retrying. | [Blocks](./concepts/blocks.md) |
| `BLOCK.VIDEO_RESOURCE_NOT_LOADED_FOR_OPERATION` | The video resource has not been loaded yet. Please ensure the video is loaded before \{operation}. | Await the resource-loaded signal (e.g. the \`'audio'\`/\`'video'\` block-state transition to \`Ready\`) before invoking \`\{operation}\`. | [Blocks](./concepts/blocks.md) |
| `BLOCK.WIDTH_INVALID_FOR_SCALING` | Current width is invalid for scaling. | The block's current width is zero or non-finite. Set a valid width before scaling. | [Blocks](./concepts/blocks.md) |

## CODEC

Audio/video codec capability and decoding.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `CODEC.ANDROID_AUDIO_ENCODER_CREATE_FAILED` | Cannot create audio encoder: media\_status = \{mediaStatus} | Android MediaCodec returned media\_status=\{mediaStatus}. Consult the AMediaCodec status codes. |  |
| `CODEC.ANDROID_JNI_ERROR` | \{reason} | The Android MediaCodec/JNI layer reported: \{reason} |  |
| `CODEC.APPLE_OSSTATUS_FAILURE` | \{operation} failed (\{status}) | The Apple media-framework call '\{operation}' returned a non-success status: \{status}. The codec, container, or hardware session could not be configured. |  |
| `CODEC.AUDIO_DECODER_CREATE_FAILED` | Could not create audio decoder: \{reason} | The platform's audio decoder rejected the configuration. Reason: \{reason} |  |
| `CODEC.AUDIO_DECODER_FATAL` | Encountered fatal audio decoder error: \{reason} | The audio decoder produced an unrecoverable error during playback. Reason: \{reason} |  |
| `CODEC.AUDIO_DECODER_METADATA_INVALID` | Invalid audio metadata. | The audio metadata required to construct the decoder is missing or invalid. |  |
| `CODEC.AUDIO_DECODER_NO_CHUNKS` | Audio has no chunks. | The audio resource has no decoded chunks available. Ensure the source has audible data. |  |
| `CODEC.AUDIO_DECODER_NO_FRAMES` | Audio has no frames. | The audio resource has no decoded frames. The source may be empty or unparseable. |  |
| `CODEC.AUDIO_DECODER_ZERO_FRAMES_PER_CHUNK` | Frames per chunk is zero. | Audio chunking metadata is invalid; cannot decode. Re-encode the source. |  |
| `CODEC.AUDIO_DECODER_ZERO_FRAMES_PER_PACKET` | Frames per packet is zero. | Audio packetization metadata is invalid; cannot construct the decoder. Re-encode the source. |  |
| `CODEC.AUDIO_DECODE_UNSUPPORTED` | Audio decoding is not supported on this platform. | This build does not include an audio decoder. Rebuild with the relevant codec backend, or run on a supported platform. |  |
| `CODEC.AUDIO_ENCODER_CONFIG_INVALID` | Invalid audio encoder configuration: \{channels} channels at \{sampleRate} Hz | Audio channels and sample rate must be positive. Got channels=\{channels}, sampleRate=\{sampleRate}. |  |
| `CODEC.AUDIO_ENCODER_CREATE_FAILED` | Could not create audio encoder: \{reason} | The platform's audio encoder rejected the configuration. Reason: \{reason} |  |
| `CODEC.AUDIO_ENCODE_UNSUPPORTED` | Audio encoding is not supported on this platform. | This build does not include an audio encoder. Rebuild with the relevant codec backend, or run on a supported platform. |  |
| `CODEC.AUDIO_TRACK_NOT_FOUND` | Couldn't find audio track in AVContainer. | The container has no audio track. Use a media file with an audio stream. |  |
| `CODEC.BACKEND_TEXTURE_INCOMPLETE` | Backend texture is incomplete. | The Skia backend texture is missing state required for codec read-back. |  |
| `CODEC.EMPTY_AUDIO_CODEC_STRING` | Empty audio codec string. | The container did not declare an audio codec. Re-encode the file with explicit codec metadata. |  |
| `CODEC.EMPTY_VIDEO_CODEC_STRING` | Empty video codec string. | The container did not declare a video codec. Re-encode the file with explicit codec metadata. |  |
| `CODEC.ENCODER_STATE_NOT_FOUND` | Could not find encoder state. | The encoder state was released. Construct a fresh encoder before calling this API. |  |
| `CODEC.GSTREAMER_CREATE_ELEMENT_FAILED` | Could not create GStreamer element \{name} of type \{factory} | GStreamer factory '\{factory}' is not installed. Install the corresponding gst plugin or pick a different element. |  |
| `CODEC.GSTREAMER_CREATE_SINK_CAPS_FAILED` | Could not create sink caps. | GStreamer rejected the sink caps. The target codec or format may not be supported. |  |
| `CODEC.GSTREAMER_CREATE_SOURCE_CAPS_FAILED` | Could not create source caps. | GStreamer rejected the source caps. The codec or media format may not be supported. |  |
| `CODEC.GSTREAMER_LINK_AUDIO_ENCODER_FAILED` | Could not link audio encoder pipeline elements. | GStreamer could not connect the audio encoder branch. Verify supported caps. |  |
| `CODEC.GSTREAMER_LINK_AUDIO_FAILED` | Could not link audio pipeline elements. | GStreamer could not connect audio elements. Caps negotiation failed. |  |
| `CODEC.GSTREAMER_LINK_VIDEO_ENCODER_FAILED` | Could not link video encoder pipeline elements. | GStreamer could not connect the video encoder branch. Verify supported caps. |  |
| `CODEC.GSTREAMER_LINK_VIDEO_FAILED` | Could not link video pipeline elements. | GStreamer could not connect video elements. Caps negotiation failed. |  |
| `CODEC.GSTREAMER_PIPELINE_CREATE_FAILED` | Could not create a new GStreamer pipeline. | gst\_pipeline\_new() failed. The GStreamer runtime may be in a bad state. |  |
| `CODEC.GSTREAMER_PIPELINE_ERROR` | \{reason} | GStreamer pipeline reported: \{reason} |  |
| `CODEC.GSTREAMER_UNEXPECTED_MESSAGE` | Unexpected message error type. | The GStreamer bus reported an unexpected message kind. This may indicate a pipeline state mismatch. |  |
| `CODEC.METAL_TEXTURE_FROM_IOSURFACE_FAILED` | Failed to create Metal texture from IOSurface. | Metal rejected the IOSurface-backed texture descriptor. The pixel format or surface dimensions may be unsupported. |  |
| `CODEC.NO_CONTEXT` | No context. | The compute context is not initialized. |  |
| `CODEC.NO_GPU_CONTEXT` | No GPU context. | The compute context lacks GPU support required for this codec. |  |
| `CODEC.OFFSCREEN_CANVAS_CREATE_FAILED` | Could not create offscreen canvas. | Offscreen canvas allocation failed. Out-of-memory or unsupported size is the likely cause. |  |
| `CODEC.OFFSCREEN_CONTEXT_UNAVAILABLE` | Cannot get offscreen context for encoding. | The compute context is not an offscreen (Metal) context. Video encoding requires an offscreen GPU context. |  |
| `CODEC.PIXEL_BUFFER_NO_IOSURFACE` | CVPixelBuffer has no IOSurface backing. | The pooled pixel buffer is not IOSurface-backed, so it cannot be wrapped as a Metal texture. The pool was created without the IOSurface property. |  |
| `CODEC.PIXEL_BUFFER_POOL_CREATE_FAILED` | Failed to create CVPixelBufferPool. | CoreVideo could not allocate a pixel buffer pool for the encoder. Out-of-memory or an unsupported pixel format is the likely cause. |  |
| `CODEC.PRESENTATION_TIMESTAMPS_NOT_UNIQUE` | Presentation timestamps are not unique. | The video track has duplicate presentation timestamps, which prevents building a frame index. Re-mux the source with monotonically increasing PTS. |  |
| `CODEC.RECORDING_CONTEXT_UNAVAILABLE` | Could not obtain a recording context. | The Skia display canvas has no GPU recording context. The compute context may not be initialized for hardware video decoding. |  |
| `CODEC.UNKNOWN_AUDIO_DECODER_HANDLE` | Unknown audio decoder handle. | The audio decoder handle is not registered. It may have been destroyed already. |  |
| `CODEC.UNKNOWN_CODEC_STRING` | Unknown codec string \{codec} | The codec identifier '\{codec}' is not recognized by this build. Pass a supported codec string (e.g. an H.264 video or AAC audio identifier) when configuring the export. See the supported codecs list for valid identifiers. | [File Format Support](./import-media/file-format-support.md) |
| `CODEC.UNKNOWN_VIDEO_DECODER_HANDLE` | Unknown video decoder handle \{handle} | The decoder handle is not registered. It may have been destroyed already. |  |
| `CODEC.UNKNOWN_VIDEO_DECODER_HANDLE_NO_ARG` | Unknown video decoder handle. | The decoder handle is not registered. It may have been destroyed already. |  |
| `CODEC.UNREACHABLE_FOR_CODEC` | Unreachable code reached for codec \{codec} | Internal switch did not handle codec '\{codec}'. This is an engine bug — please file a ticket. |  |
| `CODEC.UNSUPPORTED_CODEC_STRING` | Unsupported codec string \{codec} | Codec '\{codec}' is recognized but not supported in the current configuration. Choose a widely supported codec such as H.264 for video or AAC for audio. See the supported codecs list for the full set. | [File Format Support](./import-media/file-format-support.md) |
| `CODEC.UNSUPPORTED_H265_CODEC_STRING` | Unsupported H265 codec string \{codec} | The H.265 profile encoded in '\{codec}' is not supported by GStreamer in this build. See the supported codecs list for alternatives. | [File Format Support](./import-media/file-format-support.md) |
| `CODEC.VIDEO_BITRATE_INVALID` | Video bitrate must be equal or greater than 0. | Pass a non-negative \`bitrate\` value to the video encoder configuration. |  |
| `CODEC.VIDEO_DECODER_CREATE_FAILED` | Could not create video decoder: \{reason} | The platform's video decoder rejected the configuration. Reason: \{reason} |  |
| `CODEC.VIDEO_DECODER_FATAL` | Encountered fatal video decoder error: \{reason} | The decoder produced an unrecoverable error during playback. Reason: \{reason} |  |
| `CODEC.VIDEO_DECODER_UNRESPONSIVE` | Video decoder has been unresponsive for more than 10 seconds. | Possible decoder deadlock or hardware stall. Reset the decoder or fall back to a software path. |  |
| `CODEC.VIDEO_DECODE_UNSUPPORTED` | Video decoding is not supported on this platform. | This build does not include a video decoder. Rebuild with the relevant codec backend, or run on a supported platform. |  |
| `CODEC.VIDEO_ENCODER_BUSY` | Already encoding another video. | Wait for the current video encoding session to finish before starting another. |  |
| `CODEC.VIDEO_ENCODER_CREATE_FAILED` | Could not create video encoder: \{reason} | The platform's video encoder rejected the configuration. Reason: \{reason} |  |
| `CODEC.VIDEO_ENCODER_INVALID_RESOLUTION` | Invalid resolution for video encoder: \{width} x \{height} | Resolution must be > 0 in both dimensions. Got \{width}x\{height}. |  |
| `CODEC.VIDEO_ENCODE_UNSUPPORTED` | Video encoding is not supported on this platform. | This build does not include a video encoder. Rebuild with the relevant codec backend, or run on a supported platform. |  |
| `CODEC.VIDEO_SESSION_CREATE_FAILED` | VTCompressionSessionCreate failed. | VideoToolbox could not create a compression session for the requested codec and resolution. The codec may be unsupported on this hardware. |  |
| `CODEC.VIDEO_TRACK_NOT_FOUND` | Couldn't find video track in AVContainer. | The container has no video track. Use a media file with a video stream. |  |
| `CODEC.WEBCODECS_INVALID_FORMAT` | Invalid codec string format for WebCodecs: \{codec} | WebCodecs requires a fully-qualified codec id. '\{codec}' is not in the expected format. |  |
| `CODEC.WEBCODECS_NOT_AVAILABLE_NODE` | WebCodecs API is not available in Node.js. | Run in a browser environment, or use a different codec backend on Node. |  |
| `CODEC.WEBCODECS_NOT_SUPPORTED` | WebCodecs API is not supported. | The current browser does not expose the WebCodecs API. Upgrade to a supported version. |  |

## COMPUTE

Compute contexts (Metal, GL, CPU) and capability negotiation.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `COMPUTE.COLOR_SPACE_BIT_DEPTH_UNSUPPORTED` | The current device does not support the required pixel bit depth for the requested color space. | Wide-gamut color spaces require 10+ bpp surfaces. Use sRGB on devices that don't expose deep-color buffers. |  |
| `COMPUTE.COLOR_SPACE_DISPLAY_UNSUPPORTED` | The current device does not support displaying the requested color space. | The device's display pipeline cannot render this color space. Fall back to sRGB or query supported spaces first. |  |
| `COMPUTE.COLOR_SPACE_UNSUPPORTED_BY_ENGINE` | The engine does not support the requested color space on this platform. | Pick a supported color space (sRGB / Display P3) for this build, or rebuild the engine with the appropriate Skia configuration. |  |
| `COMPUTE.CONTEXT_CREATE_FN_NOT_FOUND` | Context creation function not found for type \{type}. | \`createContext()\` was called with a context type the build was not compiled with. Rebuild with the appropriate \`HAS\_UBQ\_\*\_CONTEXT\` macro defined, or pass a supported type. |  |
| `COMPUTE.DATA_PROVIDER_EMPTY` | \{kind} data provider is empty. | No bytes have been registered for this resource yet. Ensure the data was provided before reading. |  |
| `COMPUTE.DATA_PROVIDER_NOT_CONTIGUOUS` | Data provider does not expose contiguous data. | The active data provider serves data in chunks. Use the streaming API instead of asking for a contiguous buffer. |  |
| `COMPUTE.DATA_PROVIDER_NOT_FULLY_AVAILABLE` | \{kind} data provider is not fully available. | The provider is still streaming. Wait for the resource state to transition to Ready before requesting the full buffer. |  |
| `COMPUTE.DATA_PROVIDER_TOO_LARGE` | \{kind} data provider too large for contiguous data. | The resource exceeds the contiguous-buffer threshold. Read in chunks via the streaming API instead. |  |
| `COMPUTE.EGL_CREATE_CONTEXT_FAILED` | EGL create context error. | \`eglCreateContext\` returned \`EGL\_NO\_CONTEXT\`. The requested GL version / attributes are not supported by the driver. |  |
| `COMPUTE.EGL_CREATE_SURFACE_FAILED` | EGL create surface error. | \`eglCreateWindowSurface\` / \`eglCreatePbufferSurface\` returned \`EGL\_NO\_SURFACE\`. The native window or pbuffer attributes are incompatible with the chosen EGL config. |  |
| `COMPUTE.EGL_INVALID_CONTEXT_TYPE` | Invalid context type passed to the creation function. | The EGL context factory received an unexpected type tag. Confirm the caller selects one of the supported context types. |  |
| `COMPUTE.EGL_NO_CONFIGS_MATCH` | No EGL configs match the requested attribute list. | The requested EGL config attributes (color depth, surface type, GL profile) are not satisfiable on this device. Relax the attribute list or fall back to a CPU context. |  |
| `COMPUTE.EGL_NO_DISPLAY` | EGL display unavailable. | \`eglGetDisplay\` returned \`EGL\_NO\_DISPLAY\`. The platform does not expose a usable EGL display — fall back to a CPU context. |  |
| `COMPUTE.EGL_OPERATION_FAILED` | EGL \{operation} error: \{reason} | The EGL driver reported a failure during \`\{operation}\`. Inspect \`reason\` for the underlying EGL error string and ensure the platform's EGL stack is initialized correctly. |  |
| `COMPUTE.EMSCRIPTEN_MAKE_CONTEXT_CURRENT_FAILED` | Could not make the WebGL context current. | \`emscripten\_webgl\_make\_context\_current\` failed. The browser may have lost the context or the canvas was detached from the DOM. |  |
| `COMPUTE.GR_DIRECT_CONTEXT_CREATE_FAILED` | Creating a Skia GrDirectContext failed. | Skia could not initialize a direct GPU context from the current EGL/GL surface. Inspect Skia logs for the underlying cause; falling back to a CPU context is the safe option. |  |
| `COMPUTE.HTTP_DATA_NO_BUFFER` | HTTP data provider has no buffer. | The HTTP data provider has not yet allocated its receive buffer. Wait for the first chunk before reading. |  |
| `COMPUTE.MP3_PARSE_TRACK_DATA_FAILED` | Failed to parse MP3 file: could not load track data. | The MP3 parser could not extract track frames. The file may be truncated or have an unsupported container variant. |  |
| `COMPUTE.MP3_PARSE_TRACK_METADATA_INVALID` | Failed to parse MP3 file: invalid track metadata (channels, sample rate, or frames). | The MP3 header lists impossible values for channels / sample rate / frames. Re-encode the file. |  |
| `COMPUTE.MP4_DURATION_ZERO` | MP4 duration is zero. | The container reports zero duration. The file may be truncated or be a fragmented MP4 missing the duration box. |  |
| `COMPUTE.MP4_TIMESCALE_ZERO` | MP4 timescale is zero. | The container reports zero timescale. The header is malformed; regenerate the file. |  |
| `COMPUTE.OPFS_READ_FAILED` | Failed to read OPFS data. | The Origin Private File System rejected the read. The file may have been removed or the browser revoked access. |  |
| `COMPUTE.SKIA_GL_INTERFACE_INVALID` | Skia OpenGL interface failed validation. | The GL function pointers Skia loaded for this context do not satisfy its requirements. Verify the GL driver advertises the extensions Skia depends on. |  |
| `COMPUTE.VIDEO_UNSUPPORTED_AUDIO_TRACKS` | Video has \{count} unsupported audio track\{plural}. | Tracks with unsupported codecs were removed. Re-encode with AAC or another supported codec to retain audio. |  |

## EDITOR

Editor state, history, selection, commands.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `EDITOR.AUDIO_BUFFER_INVALID_SIZE` | Invalid audio buffer: size \{bufferSize} is not a multiple of frame size \{frameSize}. | Audio buffer length must be aligned to the frame size. Trim the buffer to a multiple of \{frameSize} bytes before submitting. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_BUFFER_INVALID_URI` | Invalid buffer URI: \{uri} | The audio buffer URI '\{uri}' does not resolve to a registered buffer. Confirm the buffer was created and the URI matches. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_BUFFER_NO_DATA` | No buffer data available. | The audio buffer block has no data registered for its file URI. Ensure data is written to the buffer before requesting chunks. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_DECODER_CREATE_FAILED` | Could not create audio decoder: \{reason} | The platform's audio decoder rejected the input. Confirm the codec is supported on this platform. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_DECODE_FAILED` | Fatal audio decoding error: \{reason} | The audio decoder produced an unrecoverable error during playback. The source may be corrupted or use an unsupported format. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_FETCH_FAILED` | Failed to fetch audio. | The audio resource could not be retrieved. Check the URI, asset-source registrations, and network connectivity. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_INVALID_RANGE` | Invalid range requested: start = \{start}, end = \{end}. | Audio chunk ranges must satisfy 0 \<= start \< end. Adjust the request bounds and retry. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_NOT_LOADED` | The audio has not been loaded yet. | Call forceLoadAVResource(block, callback) or wait for the resource state to reach Ready before querying audio metadata. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AUDIO_UNSUPPORTED_FORMAT` | Unsupported audio format with channels: \{channels}, bits: \{bits}, sample format: \{sampleFormat}. | The engine cannot resample this combination on the current platform. Re-encode the audio to a supported profile. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AV_BLOCK_INVALID_WITH_HINT` | The block with ID \{id} is not valid. It may have been deleted, e.g., when a new scene was loaded. | Re-resolve the block id (\{id}) before calling AV APIs. Async callbacks frequently outlive their target block. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AV_DURATION_UNDEFINED` | The AV container duration is undefined. | The decoder could not determine the resource's total duration. The container may be malformed or use an unsupported codec. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AV_OPERATION_AUDIO_OR_VIDEO_FILL` | This operation is only supported for audio blocks and video fills. | Pass an audio block, or resolve the video fill of the block via getFill(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AV_OPERATION_BLOCK_TYPE_UNSUPPORTED` | This operation is only supported for video fills and audio blocks. | Resolve the video fill of the block via getFill(block), or pass an audio block directly. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.AV_OPERATION_VIDEO_ONLY` | This operation is only supported for video fills. | Only blocks whose fill is a video fill expose video-specific metadata. Audio blocks don't apply here. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NOT_ATTACHED_TO_PAGE` | The target block is not attached to the page. | Add the block as a child of the page before setting it as the page's duration source. | [Pages](./concepts/pages.md) |
| `EDITOR.BLOCK_NOT_A_PAGE` | The given page block is not a page. | The first argument must be a page block. Use api.block.findByType('//ly.img.ubq/page') to obtain one. | [Pages](./concepts/pages.md) |
| `EDITOR.BLOCK_NO_DURATION` | The target block has no duration. | The block has no Duration component. Confirm the block type supports durations, or check via supportsDuration(block) first. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NO_DURATION_AS_PAGE_SOURCE` | The target block doesn't support duration and therefore cannot be duration source. | Pick a block that has a Duration component (e.g. video fill, audio, or track) to drive the page's duration. | [Pages](./concepts/pages.md) |
| `EDITOR.BLOCK_NO_DURATION_SUPPORT` | The target block doesn't support durations. | Duration applies only to time-aware blocks (pages, tracks, video/audio fills). Use supportsDuration(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NO_PLAYBACK_CONTROL_SUPPORT` | The target block doesn't support playback control. | Playback control (looping, muted, speed, volume) applies only to AV-source blocks. Use supportsPlaybackControl(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NO_PLAYBACK_SUPPORT` | The target block doesn't support playback. | Playback time applies only to blocks with a PlaybackTime component (scenes, pages, video/audio). Use supportsPlaybackTime(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NO_TIME_OFFSET_SUPPORT` | The target block doesn't support time offsets. | Time offsets apply only to time-aware children of a track. Use supportsTimeOffset(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.BLOCK_NO_TRIM_SUPPORT` | The target block doesn't support trimming. | Trimming applies only to video fills, audio blocks, and similar AV-source blocks. Use supportsTrim(block) before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_CLAMP_ACROSS_SCENES` | Cannot clamp camera to elements of different scenes. | All blocks passed to camera clamping must belong to the same scene. Group by scene before calling. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_CLAMP_BLOCKS_WITHOUT_SCENE` | Cannot clamp camera to blocks without a scene. | Attach the blocks to a scene before enabling camera clamping. Floating blocks are not eligible. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_CLAMP_EMPTY_BLOCKS` | Cannot clamp camera to an empty block list. | Provide at least one block (or the scene itself) to clamp against. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_CLAMP_NO_PAGES` | No pages found in the scene. | Camera clamping with page-carousel features requires at least one page block. Add a page before enabling clamping. | [Pages](./concepts/pages.md) |
| `EDITOR.CAMERA_CLAMP_PAGE_NOT_LAYOUTED` | The page has not been layouted. | Layout has not run yet for this page. Trigger an engine update or wait one frame before enabling camera clamping. | [Pages](./concepts/pages.md) |
| `EDITOR.CAMERA_ENTITY_INVALID` | Camera entity is invalid. | Could not resolve a valid camera for the provided scene or camera id. Confirm the scene has a main camera and the id references it. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_NOT_VALID` | Camera is not valid. | The active scene has no camera entity. Create the scene through the normal \`scene.create\*()\` path so the camera is set up automatically. | [Scenes](./concepts/scenes.md) |
| `EDITOR.CAMERA_POSITION_CLAMP_NOT_ENABLED` | This block does not have camera position clamping enabled. | Enable camera position clamping for this block first, or check whether it is enabled before disabling it. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_ZOOM_CLAMP_LIMITS_INVALID` | To enable camera zoom clamping, at least one of minZoomLimit or maxZoomLimit must be positive. | Set at least one of minZoomLimit or maxZoomLimit to a positive value. Use a negative value on the other side to leave it unbounded. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_ZOOM_CLAMP_LIMITS_ORDER` | The minZoomLimit has to be smaller or equal to maxZoomLimit. | Swap or adjust the values so minZoomLimit \<= maxZoomLimit. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_ZOOM_CLAMP_NOT_ENABLED` | This block does not have camera zoom clamping enabled. | Enable camera zoom clamping for this block first, or check whether it is enabled before disabling it. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CAMERA_ZOOM_LIMITS_NOT_FINITE` | The zoom limits must be finite numbers. | Both minZoomLimit and maxZoomLimit must be finite. Use a negative value to indicate no limit on that side. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.COMMAND_ARG_TYPE_MISMATCH` | Argument at index \{index} for command '\{command}' doesn't match expected type '\{expectedType}'. Got '\{actualType}' instead. | Convert the argument to '\{expectedType}' or pass a different value matching the command signature. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.COMMAND_NOT_REGISTERED` | \{command} is not a registered command. | Command '\{command}' was not found in the registry. Confirm the name is correct and that the responsible module is loaded. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.COMMAND_RETURN_TYPE_MISMATCH` | Returned value for command '\{command}' did not match expected type (got '\{actualType}', expected '\{expectedType}'). Did the responsible system never execute? | The system handling '\{command}' returned a value of the wrong type. Verify the handler is registered and producing '\{expectedType}'. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.COMMAND_UNIMPLEMENTED` | Unimplemented. | The command type has no implementation of this method. Subclasses must override determineType() and any other defaults they rely on. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.COMMAND_WRONG_ARG_COUNT` | Received \{received} arguments for command \{command}, but expected \{expected}. | Command '\{command}' takes \{expected} arguments. Adjust the call to match the documented signature. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CROP_ELEMENT_NOT_CROPPABLE` | This element can't be cropped. | Crop operations require a block with a cropped fill (image or video). Verify api.block.supportsCrop(id) before calling \{operation}. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.CROP_NO_SELECTED_ELEMENT` | Select an element to crop. | Select a block before invoking \{operation}. Use api.block.findAllSelected() to verify a selection exists. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.FONT_DATA_LOAD_FAILED` | Font resource ready but failed to load font data: \{uri}. | The font resource finished loading but the data could not be parsed. The payload may be empty or use an unsupported font format. | [Custom Fonts](#broken-link-9565b3) |
| `EDITOR.FONT_LOAD_FAILED` | Failed to load font '\{uri}': \{reason}. | The font resource at '\{uri}' could not be loaded (\{reason}). Verify the URI is reachable and the asset is registered. | [Custom Fonts](#broken-link-9565b3) |
| `EDITOR.FONT_METRICS_EXTRACT_FAILED` | Failed to extract font metrics from: \{uri}. | The font file at '\{uri}' could not be parsed for metrics. Confirm the file is a valid TTF/OTF and not corrupted. | [Custom Fonts](#broken-link-9565b3) |
| `EDITOR.FONT_URI_EMPTY` | Font file URI cannot be empty. | Pass a non-empty URI pointing to a font file registered with the engine. See addLocalAssetSourceFromJSON or registerFont docs for setup. | [Custom Fonts](#broken-link-9565b3) |
| `EDITOR.HISTORY_HANDLE_INVALID` | Could not obtain a valid history handle. | The editor has no active history buffer. Confirm a scene is loaded and the engine has fully initialized before invoking history APIs. | [Undo And History](./concepts/undo-and-history.md) |
| `EDITOR.MEMORY_QUERY_UNAVAILABLE` | Could not obtain \{kind} memory for the current platform. | The platform does not expose \{kind}-memory statistics, or the query failed. Treat memory metrics as best-effort on this platform. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.MOVEMENT_CONSTRAINT_NEGATIVE` | setMovementConstraint value must be non-negative; call removeMovementConstraint to clear a constraint. | Pass a non-negative distance, or call removeMovementConstraint(targets) instead of using a negative sentinel. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.NEGATIVE_DURATION` | Negative durations are not supported. | Pass a non-negative duration. Use 0 for an empty interval or std::numeric\_limits\<double>::infinity() for unbounded. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.NO_SCENE_AVAILABLE` | No scene available. | The editor has no active scene. Load or create one before invoking this API. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.NO_UNDO_STEP_AVAILABLE` | No undo step available to remove. | The undo stack is empty. Verify the editor has performed at least one undoable action before calling removeUndoStep(). | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.PADDING_NOT_FINITE` | The padding values must be finite numbers. | All four padding components must be finite. Replace any NaN or infinity with a concrete number (zero is fine). | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.PAGES_NOT_RESIZED` | Pages could not be resized. | Resize failed for one or more pages. Confirm each page is unlocked (api.block.isTransformLocked / isAllowedByScope) and that the requested width and height are finite and positive. | [Pages](./concepts/pages.md) |
| `EDITOR.PAGE_CONTENT_ASPECT_RATIO_INVALID` | ContentAspectRatio preset cannot be used to create a new page; it only applies to blocks with intrinsic content dimensions. | Pages have no intrinsic content size. Use a FreeAspectRatio, FixedAspectRatio, or FixedSize preset instead. |  |
| `EDITOR.PAGE_RESIZE_DISABLED` | Page resizing interaction is disabled in UBQ settings. | Enable page resizing via settings (e.g. 'features/page/resize') before invoking the resize interaction. | [Pages](./concepts/pages.md) |
| `EDITOR.PAGE_RESIZE_FIXED_ASPECT_ONLY` | Page resizing interaction is restricted to fixed aspect ratio in UBQ settings. | Allow free-aspect resizing in settings, or constrain the interaction to the configured fixed aspect ratio. | [Pages](./concepts/pages.md) |
| `EDITOR.PLAYBACK_SPEED_OUT_OF_RANGE` | Invalid playback speed \{speed}. Must be between 0.25 and 3.0. | For non-video blocks playback speed must be in \[0.25, 3.0]. Video fills support a wider range. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.PLAYBACK_SPEED_TOO_LOW` | Invalid playback speed \{speed}. Must be at least 0.25. | Pass a playback speed of at least 0.25. Speeds below this are not supported. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.RESOURCE_LOAD_FAILED` | Failed to load resource \{uri}. | The resource at '\{uri}' could not be loaded. Check that the URI is reachable, CORS allows access, and the format is supported. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.RESOURCE_URI_EMPTY` | The resource has an empty URI. | Set a non-empty file URI on the video fill or audio block before requesting a load. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.ROLE_NOT_FOUND` | Role \{role} not found. | '\{role}' is not a known editor role. Valid roles are defined by the EditorRole enum (e.g. Adopter, Creator). | [Settings](./settings.md) |
| `EDITOR.SAFE_AREA_INSETS_NEGATIVE` | Safe area inset values must be non-negative. | Each inset describes a non-negative distance from the viewport edge. Use 0 to disable an inset rather than a negative value. |  |
| `EDITOR.SAFE_AREA_INSETS_NOT_FINITE` | Safe area inset values must be finite numbers. | All four inset components must be finite. Replace any NaN or infinity with a concrete number (zero is fine). |  |
| `EDITOR.SCENE_CONTENT_EMPTY` | Received empty scene content. | The scene-serialization command was called with an empty payload. Pass the serialized scene string returned by \`scene.saveToString(...)\`. | [Scenes](./concepts/scenes.md) |
| `EDITOR.SCENE_DECOMPRESS_FAILED` | Failed to decompress scene data. | The compressed scene payload could not be decoded. The file may be truncated or produced by an incompatible compressor. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.SCENE_ENTITY_INVALID` | Scene entity is invalid. | Could not resolve a valid scene for the provided id. Confirm the id is a scene or a camera attached to a scene. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.SCENE_INPUT_INVALID` | Received scene input is not a valid serialization. | The payload does not parse as a CE.SDK scene document. Confirm it was produced by api.scene.saveToString() or saveToArchive(). | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.SCENE_MISSING_REQUIRED_KEY` | Invalid scene file: "\{key}" key not found. | The serialized scene is missing the required top-level "\{key}" field. The file may be truncated or produced by an incompatible writer. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.SCENE_REQUIRES_URL_LOAD` | Scene is part of an archive and must be loaded via URL. | Use api.scene.loadFromURL() or loadFromArchive() rather than loadFromString() for archive-bound scenes. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.SCENE_SIZE_UNAVAILABLE` | Could not get scene size. Scene may not have a layout yet. | Wait for the first layout pass to complete (e.g. after the next \`api.update()\`) before reading scene dimensions. |  |
| `EDITOR.SETTING_ENUM_VALUE_NOT_FOUND` | Enum value \{value} not found. | '\{value}' is not a member of the target enum. Call getSettingEnumOptions() to list valid values. | [Settings](./settings.md) |
| `EDITOR.SETTING_NOT_ENUM` | Setting \{keypath} is not an enum. | Use the type-specific getter/setter (Bool/Int/Float/String/Color) instead of the Enum variant for non-enum settings. | [Settings](./settings.md) |
| `EDITOR.SETTING_NOT_FOUND` | Setting \{keypath} not found. | No setting registered at '\{keypath}'. Use findAllSettings() to discover valid key paths. | [Settings](./settings.md) |
| `EDITOR.SETTING_TYPE_UNSUPPORTED` | Unsupported setting type for \{keypath}. | The setting at '\{keypath}' has a type the public API does not expose. Use getSettingType() to discover the supported categories. | [Settings](./settings.md) |
| `EDITOR.SPLIT_BLOCK_FAILED` | Could not split block of type "\{blockType}": \{reason} | Splitting a block failed at an intermediate step (\{reason}). Confirm the block via api.block.isValid(block) and api.block.supportsDuration(block), and that the split time lies inside the block's time range (api.block.getTimeOffset(block) to getTimeOffset + getDuration). | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.THUMBNAIL_SAMPLES_INVALID` | Can't generate thumbnail sequence with samplesPerChunk \<= 0. | Pass a positive samplesPerChunk so each chunk contains a non-empty waveform sample window. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.TOUCH_ROTATE_TOO_MANY_POINTS` | Touch rotate event has more than two touch points. | The rotate gesture is only defined for two-finger input. Cancel the gesture when a third pointer joins. |  |
| `EDITOR.TRIM_OFFSET_UNDEFINED` | The trim offset is undefined. | The AV resource duration or playback speed yields a non-finite trim offset. Confirm the resource is loaded and playback speed is positive. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.UNIT_CONVERSION_FAILED` | Failed to convert to given design unit. | The requested unit conversion is not supported in this context. Confirm the scene has a configured DPI and design unit. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.UNSUPPORTED_SERIALIZATION_FORMAT` | Unsupported serialization format. | The scene declares a serialization format this engine version cannot read. Re-save the scene with the current engine, or upgrade the engine. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.VALUE_NOT_FINITE` | The value \{value} must be a finite number. | NaN and infinity are not accepted. Pass a finite floating-point value. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.VECTOR_INVALID_MIRROR_MODE` | Invalid mirror mode \{mode}. Expected 0 (None), 1 (AngleAndLength), or 2 (AngleOnly). | Pass 0, 1, or 2 — values map to the VectorHandleMirrorMode enum (None, AngleAndLength, AngleOnly). | [Vector Edit](#broken-link-f3a7b2) |
| `EDITOR.VECTOR_NODE_NOT_DELETABLE` | Cannot delete node: contour must have at least 3 nodes. | A vector contour cannot be reduced below 3 nodes. Delete the entire contour or merge it with another path instead. | [Vector Edit](#broken-link-f3a7b2) |
| `EDITOR.VECTOR_NO_CONTROL_POINT_SELECTED` | No vector control point is selected. | Vector control-point operations require an active selection. Select a control point first before invoking this API. | [Vector Edit](#broken-link-f3a7b2) |
| `EDITOR.VECTOR_NO_NODE_SELECTED` | No vector node is selected. | Vector node operations require an active selection. Select a node first via the vector editor UI or programmatically before invoking this API. | [Vector Edit](#broken-link-f3a7b2) |
| `EDITOR.VECTOR_NO_PATH_EDITING` | No vector path is being edited. | Enter vector edit mode on a vector block before invoking this API. Vector path mutations require an active edited path. | [Vector Edit](#broken-link-f3a7b2) |
| `EDITOR.VIDEO_DECODER_CREATE_FAILED` | Could not create video decoder: \{reason} | The platform's video decoder rejected the input. Confirm the codec is supported on this platform — see CE.SDK capability docs. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.VIDEO_DECODE_FAILED` | Fatal video decoding error: \{reason} | The decoder produced an unrecoverable error during playback. The source may be corrupted or use an unsupported codec profile. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.VIDEO_FETCH_FAILED` | Failed to fetch video. | The video resource could not be retrieved. Check the URI, asset-source registrations, and network connectivity. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.VIDEO_NOT_LOADED` | The video has not been loaded yet. | Call forceLoadAVResource(block, callback) or wait for the resource state to reach Ready before querying video metadata. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.ZOOM_AUTO_FIT_NOT_ENABLED` | This block does not have zoom auto-fit enabled. | Call enableZoomAutoFit(block) before disabling, or check isZoomAutoFitEnabled(block) first. | [Editing Workflow](./concepts/editing-workflow.md) |
| `EDITOR.ZOOM_BLOCK_NOT_LAYOUTED` | Could not zoom to block. Block hasn't been layouted yet. | Wait for the first layout pass to complete (e.g. after the next \`api.update()\`) before zooming to the block. |  |
| `EDITOR.ZOOM_NO_CAMERA` | No valid camera exists, can't zoom to block. | Ensure the scene has been initialized with a camera before invoking zoom-to-block. |  |

## ENCODE

Image and video encoding/export.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `ENCODE.AUDIO_BLOCK_DIRECT_EXTRACTION_UNSUPPORTED` | Unable to extract MP4 audio directly from audio block. The audio file may not be in a compatible format or may not be loaded. | Re-encode the audio block as MP4-compatible AAC before attempting direct extraction, or load the block first. |  |
| `ENCODE.AUDIO_BLOCK_INVALID` | Invalid audio block entity. | The id does not reference a live audio block. Re-resolve it before exporting and verify with api.block.isValid(block). |  |
| `ENCODE.AUDIO_BUFFER_EMPTY` | Audio buffer is empty. | The audio block has zero bytes of audio data. Provide a valid, non-empty audio source for the block before exporting. |  |
| `ENCODE.AUDIO_BUFFER_NOT_FOUND` | Audio buffer not found. | The audio block's buffer is not registered. Ensure audio data was provided before export. |  |
| `ENCODE.AUDIO_CHANNEL_COUNT_INVALID` | Number of audio channels must be \{expected}. | Audio export requires \{expected} channels. Convert mono/multichannel sources first. |  |
| `ENCODE.AUDIO_CHUNK_READ_FAILED` | Failed to read audio chunk data from data provider. | The data provider returned no bytes for an audio chunk. The source may be truncated. |  |
| `ENCODE.AUDIO_CONTEXT_NOT_AVAILABLE_DURING_EXPORT` | Audio context not available during export. | The audio context was destroyed mid-export. Keep it alive until the export callback fires. |  |
| `ENCODE.AUDIO_CONTEXT_PARAMS_INVALID` | Invalid audio context parameters. | Pass a supported sample rate and channel count in the audio export options before exporting. |  |
| `ENCODE.AUDIO_CONTEXT_UNAVAILABLE` | No audio context available for export. | Audio context is not initialized. Create one with the active compute context before exporting. |  |
| `ENCODE.AUDIO_DURATION_INVALID` | Duration must be a positive finite number. | Audio export duration must be > 0 and finite. Check the source has a well-defined duration. |  |
| `ENCODE.AUDIO_EXPORT_OPTIONS_NOT_OBJECT` | Audio export options must be a valid JSON object. | Pass the audio export options as a JSON object string, e.g. \{"sampleRate": 48000}. |  |
| `ENCODE.AUDIO_EXPORT_OPTIONS_PARSE_FAILED` | Failed to parse audio export options: \{reason} | The audio export options string is not valid JSON (\{reason}). Fix the JSON syntax and retry. |  |
| `ENCODE.AUDIO_FRAME_CALC_INVALID` | Invalid audio frame calculations. | Computed frame counts are nonsensical (zero or negative). Verify duration, sample rate, and processing rate. |  |
| `ENCODE.AUDIO_FRAME_SIZE_CALC_INVALID` | Invalid audio frame size calculations. | Frame-size math produced zero or negative values. Verify channel count and bit depth. |  |
| `ENCODE.AUDIO_INVALID_SAMPLE_RATE_FOR_TIMESTAMP` | Invalid sample rate for timestamp conversion. | Source audio sample rate is zero or negative. Verify it before computing timestamps. |  |
| `ENCODE.AUDIO_MIME_TYPE_INVALID` | Mime type must be "audio/wav" or "audio/mp4". | Pass audio/wav or audio/mp4 as the target mime type for audio export. |  |
| `ENCODE.AUDIO_MP4_NO_DATA_MUXED` | No audio data was muxed into MP4 container. | The muxer received no PCM frames. Check the source produced audio packets before finalization. |  |
| `ENCODE.AUDIO_MUXER_DESTROYED` | Muxer was destroyed before finalization. | The MP4 muxer was released early. Keep the encode service alive until the result callback fires. |  |
| `ENCODE.AUDIO_NO_CHUNKS_IN_RANGE` | No audio chunks found in the specified time range. | The selected time range has no audio data. Adjust start/end times or verify the audio source covers the requested span. |  |
| `ENCODE.AUDIO_NO_DATA_CAPTURED` | No audio data captured during export. | The export pipeline produced no audio samples. Verify the source has audible content within the requested range. |  |
| `ENCODE.AUDIO_NO_PCM_COLLECTED` | No PCM data was collected. | The decoder returned zero PCM samples. The audio source may be empty or fully silent. |  |
| `ENCODE.AUDIO_PROCESSING_RATE_INVALID` | Audio processing rate must be a positive finite number. | Pass a positive, finite audio sample rate in the audio export options before exporting. |  |
| `ENCODE.AUDIO_SAMPLE_RATE_INVALID` | Sample rate must be \{expected}. | Audio export requires sample rate \{expected}. Resample the source before exporting. |  |
| `ENCODE.AUDIO_SERVICE_UNAVAILABLE` | No audio service available for export. | The engine was built without audio support. Enable it in the build config and rebuild. |  |
| `ENCODE.AUDIO_SINGLE_TRACK_INDEX_NONZERO` | Single-track audio container only supports trackIndex=0, got \{index} | For single-track containers, pass trackIndex=0. |  |
| `ENCODE.AUDIO_START_TIME_OUT_OF_BOUNDS` | Start time \{start} is out of bounds. Valid range: 0-\{max} | Audio start time \{start} must be within \[0, \{max}]. |  |
| `ENCODE.AUDIO_TIME_RANGE_INVALID` | Invalid time range: start=\{start}, end=\{end} | Audio time range must satisfy 0 \<= start \< end. Got start=\{start}, end=\{end}. |  |
| `ENCODE.AUDIO_TIME_RANGE_INVALID_AFTER_TRIM` | Invalid time range after applying trim settings and options. | After applying trim/clip parameters the selected range is empty. Adjust start/end times. |  |
| `ENCODE.AUDIO_TRACK_INDEX_OUT_OF_BOUNDS` | Audio track index \{index} is out of bounds. Valid range: 0-\{max} | Pass an audio track index within \[0, \{max}]. |  |
| `ENCODE.AUDIO_UNSUPPORTED_EXPORT_FORMAT` | Unsupported audio export format. | Use audio/wav or audio/mp4 as the export target. |  |
| `ENCODE.BLOCK_MUST_BE_PAGE` | The block to export must be a page. | Video export targets a single page block. Pass a page or call api.scene.getPages() to obtain one. Scenes with multiple pages must be exported one page at a time. |  |
| `ENCODE.BLOCK_SIZE_ZERO` | Block to export has size 0. | Set a positive width and height on the block, or pick a different block, before exporting. |  |
| `ENCODE.CANCELLED_BY_BLOCK_ERROR` | The export was cancelled due to block \{block} having an error: \{reason} | Block \{block} entered an error state during export (\{reason}). Resolve the block's underlying issue and retry. |  |
| `ENCODE.COLOR_MASK_DATA_FAILED` | Color masking data could not be generated. | The renderer failed to produce the color-mask buffer. Retry, or simplify the scene if it has very high resolution. |  |
| `ENCODE.COLOR_MASK_DISABLED` | Color masking is not enabled. | Enable color masking via the export options before requesting mask data. |  |
| `ENCODE.CONTEXT_AUDIO_CREATE_FAILED` | Could not create audio context. | Audio context creation failed. Ensure the platform exposes an AudioContext and is not in a frozen tab. |  |
| `ENCODE.CONTEXT_RENDER_CREATE_FAILED` | Could not create render context. | GPU context creation failed. Confirm the host supports the required backend (WebGL2/Metal) and retry. |  |
| `ENCODE.DIRECT_EXTRACTION_UNSUPPORTED` | Direct extraction not supported for this block/mime type combination. | The requested block kind cannot be extracted directly to this mime type. Use a transcoding path instead. |  |
| `ENCODE.ENTITY_INVALID` | Entity is invalid. | The block id no longer references a live block. Re-resolve before exporting. |  |
| `ENCODE.ENTITY_NOT_PART_OF_PAGE` | Entity is not part of a valid page. | Audio export requires the block to be inside a page. Add the block to a page before exporting. |  |
| `ENCODE.EXPORT_CANCELLED` | The export was cancelled by the receiver. | The chunk callback or the progress callback returned false. No further data will be delivered. Start a new export if the result is still needed. |  |
| `ENCODE.EXPORT_FAILED` | Export failed. | A non-specific export error was produced. Check earlier log lines for the root cause and retry. |  |
| `ENCODE.EXPORT_OPTIONS_NOT_OBJECT` | Export options must be a valid JSON object. | Pass the export options as a JSON object string, e.g. \{"pngCompressionLevel": 6}. |  |
| `ENCODE.EXPORT_OPTIONS_PARSE_FAILED` | Failed to parse export options: \{reason} | The export options string is not valid JSON (\{reason}). Fix the JSON syntax and retry. |  |
| `ENCODE.GPU_LOST_GENERIC` | GPU context was lost during export rendering. Try exporting at a lower resolution. | Reduce the export resolution or split the scene, then retry. Restart the engine if the GPU context fails to recover. |  |
| `ENCODE.GPU_LOST_PDF` | GPU context was lost during PDF export rendering. The scene may contain elements that exceed the device's capabilities. | Lower the export DPI or split the scene into multiple pages, then retry. |  |
| `ENCODE.GPU_LOST_SVG` | GPU context was lost during SVG export rendering. Try reducing the size of large images. | Re-encode large source images to a lower resolution before exporting, or restart the engine to recover the GPU context. |  |
| `ENCODE.GROUP_INVALID` | Invalid group entity. | The group id does not reference a live group. Re-resolve it before exporting and verify with api.block.isValid(group). |  |
| `ENCODE.GROUP_NOT_IN_PAGE_HIERARCHY` | Group entity not found in page hierarchy. | The group is not a descendant of the page passed to the encode call. |  |
| `ENCODE.GROUP_NOT_PART_OF_PAGE` | Group is not part of a valid page. | Groups must live under a page. Reparent the group or pick a page descendant. |  |
| `ENCODE.GROUP_NO_CHILDREN` | Group has no child blocks. | Audio export requires at least one block in the group. |  |
| `ENCODE.IMAGE_JPEG_FAILED` | Failed to encode JPEG. | The JPEG encoder rejected the input. |  |
| `ENCODE.IMAGE_JPEG_OOM` | Failed to encode JPEG. Memory allocation failed. | Not enough memory for the JPEG buffer. |  |
| `ENCODE.IMAGE_PNG_FAILED` | Failed to encode PNG. | The PNG encoder rejected the input. The image dimensions or pixel format may be unsupported. |  |
| `ENCODE.IMAGE_PNG_OOM` | Failed to encode PNG. Memory allocation failed. | Not enough memory for the PNG buffer. Reduce dimensions or free memory. |  |
| `ENCODE.IMAGE_READ_PIXELS_FAILED` | Failed to read pixels. | The source image could not be read into a CPU buffer. The compute context may be missing GPU read-back support. |  |
| `ENCODE.IMAGE_TGA_OOM` | Failed to encode TGA. Memory allocation failed. | Not enough memory for the TGA buffer. Reduce dimensions or free memory. |  |
| `ENCODE.IMAGE_TGA_REQUIRES_RGBA32` | TGA encoding only supports 32-bit RGBA pixel data. | Convert the image to 32-bit RGBA before encoding to TGA. |  |
| `ENCODE.IMAGE_UNKNOWN_MIME` | Unknown MIME type for image encoding: \{mimeType} | Mime type '\{mimeType}' is not supported. Use one of image/png, image/jpeg, image/webp, image/tga. |  |
| `ENCODE.IMAGE_WEBP_FAILED` | Failed to encode WebP. | The WebP encoder rejected the input. |  |
| `ENCODE.IMAGE_WEBP_OOM` | Failed to encode WebP. Memory allocation failed. | Not enough memory for the WebP buffer. |  |
| `ENCODE.INSUFFICIENT_RESOURCES` | Not enough resources available on device. Try exporting at a lower resolution. | Reduce the requested export resolution or simplify the scene to fit available memory. |  |
| `ENCODE.MASK_BUFFER_FAILED` | Could not acquire mask buffer. Please try again. | The renderer transiently failed to allocate a mask buffer. Retry the export after a short delay. |  |
| `ENCODE.MASK_COLOR_OUT_OF_RANGE` | Mask color values must be between 0 and 1. | Clamp each mask color component (r/g/b/a) to \[0, 1] before passing to the export options. |  |
| `ENCODE.MIME_TYPE_INVALID` | Invalid mime-type '\{mimeType}', expected '\{a}', '\{b}' or '\{c}'. | Use one of '\{a}', '\{b}', or '\{c}'. Update the asset's mime type at registration time. |  |
| `ENCODE.NOT_ALL_RESOURCES_LOADED` | Not all resources were loaded. | Some scene resources are still pending. Subscribe to resource events or poll until all assets reach Ready, then retry. |  |
| `ENCODE.OFFSCREEN_CANVAS_CREATE_FAILED` | Could not create offscreen canvas. | Offscreen canvas allocation failed. Confirm the host environment supports the required GPU surface. |  |
| `ENCODE.OUTPUT_SIZE_EXCEEDS_MAX` | The output size of \{width}x\{height} px for the export exceeds the maximum supported size \{maxSize} of the device. | Reduce the export resolution so its larger dimension is at most \{maxSize} px. |  |
| `ENCODE.OUTPUT_SIZE_INSUFFICIENT_RESOURCES` | Could not export at \{width}x\{height}. Not enough resources available on device. Try exporting at a lower resolution. | Reduce the export resolution from \{width}x\{height} or simplify the scene, then retry. |  |
| `ENCODE.PAGE_NO_CHILDREN` | Page has no children. | Audio export requires at least one child block on the page. |  |
| `ENCODE.PDF_CREATE_FAILED` | Failed to create a PDF document. | The PDF writer rejected the document. Check available memory and retry with a smaller scene if needed. |  |
| `ENCODE.PDF_CREATE_FAILED_RESOURCES` | Failed to create PDF document. Not enough resources available on device. Try exporting at a lower resolution. | Reduce the page size or DPI and retry. Very large scenes can exceed device memory limits. |  |
| `ENCODE.PDF_RENDER_SIZE_EXCEEDS_MAX` | The effective rendering size of \{width}x\{height} px (at \{dpi} DPI) for the PDF export exceeds the maximum supported texture size \{maxSize} of the device. Try reducing the scene DPI or the size of the exported block. | Reduce the scene DPI or the export size so the rendered dimensions stay at or below \{maxSize} px. |  |
| `ENCODE.PDF_STAGING_WRITE_FAILED` | Failed to write the PDF export to temporary storage. | The document could not be staged on disk, so the export was stopped instead of returning a truncated file. Free up storage space and retry. |  |
| `ENCODE.PIXEL_BUFFER_UNEXPECTED_SIZE` | Unexpected pixel buffer size for color analysis. | The pixel buffer dimensions don't match the expected analysis layout. Re-read the buffer or verify the source surface. |  |
| `ENCODE.PIXEL_STREAM_NO_DATA` | Failed to encode pixel stream: no data was produced. | Inspect the pixel stream pipeline. The exporter produced an empty result for the requested options. |  |
| `ENCODE.RELATIVE_URLS_NOT_SUPPORTED` | Relative URLs are not supported. | Resolve all relative URLs to absolute ones before invoking the operation. |  |
| `ENCODE.RESOURCE_DATA_EMPTY` | Empty resource data: \{uri} | The resource at '\{uri}' loaded but returned empty bytes. Re-source the file. |  |
| `ENCODE.RESOURCE_LOAD_FAILED_WITH_REASON` | Failed to load resource '\{uri}': \{reason} | The resource at '\{uri}' failed to load (\{reason}). Confirm reachability and supported format. |  |
| `ENCODE.RESULT_BUFFER_FAILED` | Could not acquire result buffer. Please try again. | The renderer transiently failed to allocate a result buffer. Retry the export after a short delay. |  |
| `ENCODE.STREAM_EXPORT_MIME_TYPE_INVALID` | Streamed export only supports "application/pdf". | Pass application/pdf as the mime type or use exportToBuffer for other formats. |  |
| `ENCODE.STREAM_EXPORT_MISSING_RECEIVER` | Streamed export was started without a data receiver. | Pass a chunk callback to the streamed export. There is nothing to deliver the data to. |  |
| `ENCODE.SVG_CANVAS_CREATE_FAILED` | Failed to create SVG canvas. | The SVG canvas could not be allocated. Check available memory and retry. |  |
| `ENCODE.SVG_COLOR_MASK_UNSUPPORTED` | Color masking is not supported for SVG export. | SVG output cannot carry a color mask. Disable color masking or export as PNG/PDF instead. |  |
| `ENCODE.SVG_MEMORY_ALLOC_FAILED` | Could not allocate memory for SVG export. | Reduce the scene complexity or available pixel count, then retry the SVG export. |  |
| `ENCODE.SVG_NO_DATA` | SVG export produced no data. | The renderer produced an empty SVG. Confirm the page has visible content and try again. |  |
| `ENCODE.TARGET_NOT_IN_PAGE_HIERARCHY` | Target entity not found in page hierarchy. The entity may not be part of this page. | Verify the target block is a descendant of the page passed to the encode call. |  |
| `ENCODE.TRACK_INVALID` | Invalid track entity. | The track id does not reference a live track. Re-resolve it before exporting and verify with api.block.isValid(track). |  |
| `ENCODE.TRACK_NOT_IN_PAGE_HIERARCHY` | Track entity not found in page hierarchy. | The track is not a descendant of the page passed to the encode call. |  |
| `ENCODE.TRACK_NOT_PART_OF_PAGE` | Track is not part of a valid page. | Tracks must live under a page. Reparent the track or pick a page descendant. |  |
| `ENCODE.TRACK_NO_CHILDREN` | Track has no child blocks. | Audio export requires at least one block on the track. |  |
| `ENCODE.VIDEO_BLOCK_HAS_ERROR` | The export was cancelled due to block \{block} having an error: \{reason} | Block \{block} reported an error during export: \{reason}. Fix the block before retrying. |  |
| `ENCODE.VIDEO_CONCURRENT_ENCODING` | The VideoEncodeService is currently encoding. Concurrent encoding is not supported. | Wait for the current video export to finish before starting another. |  |
| `ENCODE.VIDEO_EXPORT_OPTIONS_NOT_OBJECT` | Video export options must be a valid JSON object. | Pass the video export options as a JSON object string, e.g. \{"videoBitrate": 8000000}. |  |
| `ENCODE.VIDEO_EXPORT_OPTIONS_PARSE_FAILED` | Failed to parse video export options: \{reason} | The video export options string is not valid JSON (\{reason}). Fix the JSON syntax and retry. |  |
| `ENCODE.VIDEO_FILL_AUDIO_REQUIRES_MP4` | Video fill audio extraction is only supported for audio/mp4 format. | Pass audio/mp4 as the target mime type when extracting audio from a video fill. |  |
| `ENCODE.VIDEO_FILL_INVALID` | Invalid video fill entity. | The video fill id does not reference a live fill. Re-resolve it with api.block.getFill(block) and confirm api.block.isValid(fill) before exporting. |  |
| `ENCODE.VIDEO_FILL_NO_URI` | The video fill block does not have a valid file URI. | Assign a valid fileURI to the video fill before requesting audio extraction. |  |
| `ENCODE.VIDEO_FRAME_FAILED` | Failed to encode video frame: \{reason} | The video encoder rejected a frame (\{reason}). Confirm codec compatibility and available memory, then retry. |  |
| `ENCODE.VIDEO_HAS_NO_AUDIO_TRACKS` | The video does not contain any audio tracks. | Use a video that has at least one audio track for audio extraction. |  |
| `ENCODE.VIDEO_MIME_NOT_MP4` | Mime type is not "video/mp4". | Video export currently only supports video/mp4 as the target mime type. |  |
| `ENCODE.VIDEO_NO_AUDIO_DURATION` | Video has no audio duration. | The video's audio track reports zero duration. The file may be malformed. |  |
| `ENCODE.VIDEO_PCM_READ_FAILED` | Could not read PCM frames. | The audio pipeline returned no PCM frames during video export. Audio context may have died. |  |
| `ENCODE.VIDEO_RESOURCE_LOAD_FAILED` | Failed to load video resource. Please ensure the video file is accessible and valid. | The video fill's URI could not be loaded. Check accessibility and format. |  |

## EVENT

Engine event subscription and dispatch.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `EVENT.SUBSCRIPTION_NOT_FOUND` | Event subscription does not exist. | The subscription id does not refer to an active subscription. It may have been unsubscribed already or never created. | [Events](./concepts/events.md) |

## FETCH

HTTP fetch and remote resource loading.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `FETCH.JSON_FETCH_FAILED` | Could not fetch JSON: \{uri} | The JSON resource at '\{uri}' could not be fetched. Check reachability, CORS, and the response status. |  |
| `FETCH.JSON_URI_EMPTY` | Could not fetch JSON: URI cannot be empty. | Pass a non-empty URI to the JSON fetch call. |  |
| `FETCH.RESOURCE_DATA_EMPTY` | Empty resource data: \{uri} | The resource at '\{uri}' loaded but returned no bytes. Re-source the file or confirm the URL serves content. |  |
| `FETCH.RESOURCE_FAILED` | Error fetching resource: \{url} | The HTTP fetch to '\{url}' failed. Inspect network status, response code, and CORS configuration. |  |
| `FETCH.URI_INVALID` | Invalid URI: \{uri} | The URI '\{uri}' is malformed or uses an unsupported scheme. Provide a fully qualified URL or a registered scheme. |  |
| `FETCH.URL_PARSE_FAILED` | Failed to parse URL: \{url} | The string '\{url}' is not a valid URL. Provide a fully qualified URL including the scheme. |  |

## LICENSE

License unlock, API-key handling, entitlement checks.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `LICENSE.ALREADY_UNLOCKED` | License is already unlocked. | The license has already been unlocked successfully. Skip the redundant unlock call. |  |
| `LICENSE.API_SERVICE_UNAVAILABLE` | API service is unavailable. Please contact support. | The license API endpoint did not respond. Check network connectivity; if the problem persists, contact support. |  |
| `LICENSE.AV_CONCURRENCY_LIMIT_REACHED` | Codec license concurrency limit reached: \{activeCount} of \{concurrencyLimit} licensed instances are already in use. | Wait for another engine instance to finish its video or audio work and retry, or raise the concurrency limit of your license. |  |
| `LICENSE.AV_SESSION_ACQUISITION_FAILED` | Could not reserve a video codec license from the license server. | Check network connectivity to the IMG.LY license service and retry the operation. |  |
| `LICENSE.AV_SESSION_REQUIRES_API_KEY` | Video codec licensing requires unlocking the engine with an API key. | Initialize the engine with the API key from your dashboard instead of an offline license file. |  |
| `LICENSE.CANNOT_DEACTIVATE_OFFLINE` | Cannot deactivate offline license. | Offline licenses cannot be deactivated remotely. Switch to an online license if dynamic activation is required. |  |
| `LICENSE.DEACTIVATION_TIMEOUT` | Deactivation timed out. | The license server did not acknowledge the deactivation in time. Retry, or contact support if the issue persists. |  |
| `LICENSE.ENGINE_VERSION_INVALID` | The License Key (API Key) you are using requires a newer version of the IMG.LY SDK. Please update to the latest version. | Upgrade the CE.SDK engine to a version compatible with this license. |  |
| `LICENSE.EXPIRED` | Thanks for using IMG.LY for creative editing. Please note that your license file or commercial use is expired. | Renew your subscription at https://img.ly/pricing to continue commercial use. |  |
| `LICENSE.IDENTIFIER_MISMATCH` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid for this app identifier. Current app identifier "\{current}" differs from license app identifiers: \[\{allowed}] | Your license is tied to specific app identifiers. Adjust the application bundle id to one of '\{allowed}' or update the license. |  |
| `LICENSE.INVALID` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid. | Verify the License Key matches your IMG.LY subscription. If issues persist, contact support@img.ly. |  |
| `LICENSE.INVALID_API_KEY` | Invalid API key. | The API key did not authenticate. Verify it matches the subscription registered in your IMG.LY dashboard. |  |
| `LICENSE.INVALID_FORMAT` | Invalid license format. Please contact support. | The license string could not be parsed. Verify it was copied in full and contact support if the issue persists. |  |
| `LICENSE.MISSING` | The license is missing. | Call api.unlockWithLicense() or unlockWithAPIKey() before invoking engine APIs that require entitlements. |  |
| `LICENSE.MISSING_FLUENDO_FLAG` | License does not support Fluendo codecs. | Add the 'fluendo' capability flag to your license, or do not request a session that requires it. |  |
| `LICENSE.MIXED_UNLOCK_METHODS` | unlockWithLicense shouldn't be called after unlockWithAPIKey. | Choose one unlock method per engine instance. Re-create the engine to switch between license-file and API-key authentication. |  |
| `LICENSE.NO_ACTIVE_TO_DEACTIVATE` | No active license to deactivate. | The deactivation request targets a license that is not currently active. Unlock a license first. |  |
| `LICENSE.NO_USER_ID` | License does not have a user ID. | User-specific entitlements require a license that carries a user id. Re-issue the license with a user id assigned. |  |
| `LICENSE.PLATFORM_MISMATCH` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid for this platform. Current platform: "\{current}" differs from license platforms: \[\{allowed}] | Your license restricts the platforms this engine may run on. Update the license to include '\{current}' or run on one of: \{allowed}. |  |
| `LICENSE.PRODUCT_MISMATCH` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid for this product. Current build product: "\{current}" differs from license product: "\{required}" | Your license is tied to a specific product. Use a build for '\{required}' or obtain a license for '\{current}'. |  |
| `LICENSE.REQUEST_IN_PROGRESS` | License request already in progress. | A license fetch is in flight. Wait for it to finish before calling unlock again. |  |
| `LICENSE.SERVER_ERROR` | License server reported an error: \{reason} | Server response: \{reason}. If the message is unexpected, contact IMG.LY support. |  |
| `LICENSE.STILL_FETCHING` | License is still being fetched. | The license fetch has not completed. Await the unlock promise/callback before invoking entitlement-gated APIs. |  |
| `LICENSE.TARGET_MISMATCH` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid for this build target. Current build target triplet: "\{target}" | Your license restricts which build targets may run. Update the license to include '\{target}' or run on a permitted target. |  |
| `LICENSE.UNSUPPORTED_SESSION_TYPE` | Unsupported session type. | The requested session kind is not recognized. Pass a documented session type identifier. |  |
| `LICENSE.VERSION_INVALID` | The License Key (API Key) you are using to access the IMG.LY SDK is invalid for this version. | The license does not cover the running engine version. Update the license tier or downgrade the engine. |  |

## MEDIA

Media containers and demuxing.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `MEDIA.BLOCK_NOT_AUDIO_OR_VIDEO_FILL` | Entity is not an audio block nor a video fill. | Audio waveform/thumbnail APIs require an audio block or a block with a video fill. |  |
| `MEDIA.BLOCK_NOT_A_PAGE` | Block is not a page. | Page-grid thumbnail APIs require a page block. Pass a block where api.block.getType(id) == '//ly.img.ubq/page'. |  |
| `MEDIA.BLOCK_NOT_PAGE_OR_CHILD` | Block must be a page or a child of a page. | The block must live under a page in the scene tree. Reparent it or pick a page descendant. |  |
| `MEDIA.BLOCK_NOT_VALID` | Block is not valid. | The block id no longer references a live block. Re-resolve the id before requesting media. |  |
| `MEDIA.BLOCK_NOT_VIDEO_FILL` | Block is not a video fill. | This operation requires a block whose fill is a video. Verify api.block.getKind(id) returns 'video' before calling. |  |
| `MEDIA.BLOCK_SIZE_ZERO` | Block size is zero. | Cannot generate a thumbnail for a zero-sized block. Set the block's width and height first. |  |
| `MEDIA.CANVAS_SURFACE_GET_FAILED` | Could not get canvas surface. | The canvas does not expose its underlying surface. This indicates an internal renderer state issue. |  |
| `MEDIA.CHANNEL_COUNT_INVALID` | The number of channels must be 1 or 2. | Mono (1) and stereo (2) are the only supported channel counts. |  |
| `MEDIA.FRAME_COUNT_INVALID` | The number of frames must be greater than 0. | Pass a positive \`frameCount\`. |  |
| `MEDIA.GRID_DIMENSIONS_INVALID` | Rows and columns must be greater than 0. | Pass positive \`rows\` and \`columns\` for grid-thumbnail generation. |  |
| `MEDIA.IMAGE_ENCODE_FAILED` | Image encoding failed. | The encoder rejected the source image. This is usually an unsupported pixel format or zero-sized input. |  |
| `MEDIA.NEGATIVE_TIME_RANGE` | A negative time range is not allowed. | Ensure end > start (both in seconds, non-negative). |  |
| `MEDIA.OFFSCREEN_CANVAS_GET_FAILED` | Could not get offscreen canvas. | Skia surface has no canvas attached. The compute context may not have been initialized. |  |
| `MEDIA.OFFSCREEN_SURFACE_CREATE_FAILED` | Could not create offscreen surface. | Skia could not allocate the offscreen rendering surface. Out-of-memory or unsupported pixel format is the likely cause. |  |
| `MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK` | This operation is not supported for the given block. | The selected block type does not implement this media operation. Check api.block.getType(id) and call this API only on the block types it supports. |  |
| `MEDIA.SAMPLES_PER_CHUNK_INVALID` | The number of samples per chunk must be greater than 0. | Pass a positive \`samplesPerChunk\`. |  |
| `MEDIA.SAMPLE_COUNT_INVALID` | The number of samples must be greater than 0. | Pass a positive \`sampleCount\`. |  |
| `MEDIA.SNAPSHOT_FAILED` | Could not snapshot rendered thumbnail. | Skia could not produce an image snapshot from the rendered surface. The surface may not be readable on this backend. |  |
| `MEDIA.THUMBNAIL_ALLOC_FAILED` | Failed to allocate memory for thumbnail data. | The thumbnail size exceeds available memory. Reduce dimensions or free memory. |  |
| `MEDIA.THUMBNAIL_HEIGHT_INVALID` | The height of the thumbnail must be greater than 0. | Pass a positive \`height\` (pixels). |  |
| `MEDIA.THUMBNAIL_UPSCALE_FAILED` | Could not upscale thumbnail to requested size. | Upscaling failed mid-render. The destination size may be larger than the maximum surface size on this platform. |  |
| `MEDIA.UPSCALE_SURFACE_CREATE_FAILED` | Could not create upscale surface. | Skia could not allocate the destination surface for upscaling. Out-of-memory or unsupported config is the likely cause. |  |
| `MEDIA.VIDEO_FETCH_FAILED` | Failed to fetch video. | The video resource could not be retrieved. Check the URI, asset-source registrations, and network connectivity. |  |

## SCENE

Scene-level operations (load, save, archive, structural validation).

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `SCENE.ARCHIVAL_REQUEST_FAILED` | Archival request failed: \{reason} | An async archival operation (save/load) was completed in error state. The underlying reason is: \{reason} | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_ADD_RESOURCE_FAILED` | Could not add the resource '\{resource}' to the archive. Adding data failed. | The engine could not fetch or write the bytes for \{resource}. Verify the resource is reachable and not larger than the archive can hold. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_CHUNK_READ_FAILED` | Failed to read chunk data from data provider. | The data provider returned no bytes for an available range. The underlying source may have disconnected or returned a partial response. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_CORRUPTED_EMPTY_RESOURCE` | Corrupted archive. Some elements in the scene are referencing empty data, e.g., '\{resource}'. | The archive is internally inconsistent. Regenerate it from the original scene and verify the source has no missing assets. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_CREATE_FAILED` | Could not create archive. | Final archive assembly failed for an unspecified reason. Inspect prior log lines for the underlying failure. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_DATA_PROVIDER_RANGE_UNAVAILABLE` | Data provider range is not available. | The requested byte range cannot be served by the underlying provider. Check the resource size and the requested offset/length. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_DATA_UNAVAILABLE_FOR_URL` | Archive data is not available for URL '\{url}'. | The archive references \{url} but the data could not be retrieved. Check the URL and the asset source it resolves through. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_FETCH_FAILED` | Failed to fetch archive from URL '\{url}': \{reason} | Network or asset-source failure. Verify the URL is reachable and the host serves the archive bytes. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_INVALID` | Not a valid archive. | The supplied bytes are not a recognizable CE.SDK archive. Was the file produced by saveToArchive()? | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_LOAD_AS_BLOCKS_NOT_SCENE` | Archive contains a blocks file. This archive has to be loaded as blocks and not as a scene. | Call loadFromArchiveAsBlocks() instead of loadFromArchive() for this file. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_LOAD_AS_SCENE_NOT_BLOCKS` | Archive contains a scene file. This archive has to be loaded as a scene and not as blocks. | Call loadFromArchive() instead of loadFromArchiveAsBlocks() for this file. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_MISSING_FILE` | Archive is missing a \{kind} file. | The archive is malformed: it does not contain the expected \{kind}.\* entry at its root. The file may be truncated or corrupted. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_NO_CURRENT_RESOURCE` | No current resource. | The data provider has not selected a resource. Call seekResource() (or the equivalent) before reading. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_NO_RESOURCE_BEGUN` | No resource begun or entry not open. | Call beginResource() before writing chunks or ending the resource. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_OFFSET_EXCEEDS_RESOURCE_SIZE` | Requested offset exceeds resource size. | Clamp the requested offset to be less than the resource's reported size before reading. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_RESOURCES_TOO_LARGE` | Resources too large. Not enough memory to create archive. | Allocation for the in-memory archive failed. Reduce scene size, free memory, or use a platform with more available RAM. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_RESOURCE_ALREADY_BEGUN` | Resource already begun. | A streaming resource is already in progress. Call endResource() before beginning another. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_RESOURCE_DATA_INVALID` | Resource data is invalid. | The bytes returned by the data provider failed validation. The archive may be corrupted. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_RESOURCE_DATA_UNAVAILABLE` | Resource data is not available. | The data provider has no bytes for the current resource. The underlying source may have been moved or deleted. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_STREAMED_WRITE_FAILED` | Failed to write streamed data to archive: \{reason} | Streaming a resource into the archive failed mid-flight. The underlying writer reported: \{reason} | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_WRITER_ALREADY_INITIALIZED` | Archive already initialized. | The ArchiveBufferWriter is already in an initialized state. Construct a new writer or release the current one before re-initializing. | [Scenes](./concepts/scenes.md) |
| `SCENE.ARCHIVE_WRITER_NOT_INITIALIZED` | Archive not initialized. | Call initialize() on the ArchiveBufferWriter before invoking entry or directory operations. | [Scenes](./concepts/scenes.md) |
| `SCENE.BLOCKS_INPUT_INVALID` | Received blocks input is not a valid serialization. | The payload does not parse as a CE.SDK blocks document. Confirm it was produced by api.block.saveToString() or saveToArchive(). | [Scenes](./concepts/scenes.md) |
| `SCENE.BLOCK_AT_INDEX_INVALID` | Block at index \{index} is invalid. Can't save list. | One of the blocks in the list was destroyed. Filter or re-resolve the ids before saving. | [Scenes](./concepts/scenes.md) |
| `SCENE.COMPRESSION_SERVICE_UNAVAILABLE` | Compression service not available for detected format. | The archive is compressed with a codec this build does not support. Ensure the engine was built with the matching compression backend. | [Scenes](./concepts/scenes.md) |
| `SCENE.CONTENT_EMPTY` | Received empty \{kind} content. | The serialized \{kind} payload is empty. Verify the source produced non-empty content before passing it to the engine. | [Scenes](./concepts/scenes.md) |
| `SCENE.DECOMPRESS_FAILED` | Failed to decompress scene data: \{reason} | The compressed payload could not be decoded. The archive may be truncated or produced by an incompatible writer. | [Scenes](./concepts/scenes.md) |
| `SCENE.DISALLOWED_SCHEMES` | Scene contains disallowed schemes in resource URLs: \{schemes} | The scene references resources via blocked URL schemes (\{schemes}). Update the policy or rewrite the scene's resource URLs. | [Scenes](./concepts/scenes.md) |
| `SCENE.ENTITY_INVALID` | Invalid scene entity. | The provided design-block id no longer references a valid entity. It may have been destroyed by an earlier call; re-resolve the id before use. | [Scenes](./concepts/scenes.md) |
| `SCENE.ENTITY_NOT_A_SCENE` | Entity is not a scene. | Pass a scene block id. Use api.scene.get() or api.block.findByType('//ly.img.ubq/scene') to obtain one. | [Scenes](./concepts/scenes.md) |
| `SCENE.LOAD_FROM_URI_FAILED` | Could not load \{kind} from \{uri}. | Check that the URI is reachable and serves a valid \{kind} payload. Common causes: 404, CORS, or wrong file type. | [Scenes](./concepts/scenes.md) |
| `SCENE.MEDIA_URI_NOT_FOUND` | Could not load \{kind} from \{uri}. | The \{kind} resource at \{uri} could not be resolved. Check the URI, network connectivity, and asset-source registrations. | [Scenes](./concepts/scenes.md) |
| `SCENE.MEDIA_URI_PARSE_FAILED` | Could not load \{kind}: \{reason} | The \{kind} URI failed to parse. Confirm it is a well-formed absolute URI (http(s)://, file://, or a data URL). | [Scenes](./concepts/scenes.md) |
| `SCENE.MUST_EXIST` | A scene must already exist. | Create or load a scene before invoking this API. Use api.scene.create() or loadFromString(). | [Scenes](./concepts/scenes.md) |
| `SCENE.MUST_EXIST_FOR_TEMPLATE` | A scene must already exist for a template to be applied to it. | Load a scene first, then apply the template. Templates only modify existing scenes. | [Scenes](./concepts/scenes.md) |
| `SCENE.NOT_IMPLEMENTED` | Not implemented. | This data-provider method has no implementation on the active subclass. The caller must select a different provider or operation. | [Scenes](./concepts/scenes.md) |
| `SCENE.NOT_SCENE_TYPE` | Not a scene. | The root deserialized entity is not a scene. The file may have been produced by saveAsBlocks() — load it with loadBlocks() instead. | [Scenes](./concepts/scenes.md) |
| `SCENE.NOT_VALID` | No valid scene. | Create or load a scene before calling APIs that operate on the active scene. | [Scenes](./concepts/scenes.md) |
| `SCENE.NO_MODE` | Scene has no mode set. | Use api.scene.setMode(scene, mode) before requesting mode-dependent behavior. | [Scenes](./concepts/scenes.md) |
| `SCENE.NO_PAGES_FOR_AUDIO_EXPORT` | Scene has no pages to export audio from. | Add at least one page to the scene before exporting audio. | [Scenes](./concepts/scenes.md) |
| `SCENE.NO_PAGE_FOUND` | No page found. | Add at least one page to the scene or check the current viewport's page resolution. | [Pages](./concepts/pages.md) |
| `SCENE.NO_SCENE_FOUND` | No scene found. | The serialized payload deserialized successfully but contains no scene root. Was the file saved as 'blocks' instead of 'scene'? | [Scenes](./concepts/scenes.md) |
| `SCENE.TEMP_FILE_CREATE_FAILED` | Failed to create temporary file. | The engine could not create a scratch file for archival. Check available disk space and the platform's temporary-directory permissions. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_CHUNK_WRITE_FAILED` | Failed to write chunk to ZIP entry: \{zipErrorCode} | libzip rejected writing a chunk to the current streaming entry with error code \{zipErrorCode}. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_CREATE_FAILED` | Failed to create ZIP archive. | The ZIP container could not be opened for writing. This is usually a file-system or memory issue. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_DIRECTORY_ENTRY_CLOSE_FAILED` | Failed to close ZIP directory entry: \{zipErrorCode} | libzip rejected closing a directory entry with error code \{zipErrorCode}. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_DIRECTORY_ENTRY_OPEN_FAILED` | Failed to open ZIP directory entry: \{zipErrorCode} | libzip rejected opening a directory entry with error code \{zipErrorCode}. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_ENTRY_CLOSE_FAILED` | Failed to close ZIP entry: \{zipErrorCode} | libzip rejected closing the current entry with error code \{zipErrorCode}. The entry data may be truncated. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_ENTRY_OPEN_FAILED` | Failed to open ZIP entry: \{zipErrorCode} | libzip rejected opening a new entry with error code \{zipErrorCode}. The archive state may be inconsistent. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_ENTRY_WRITE_FAILED` | Failed to write ZIP entry: \{zipErrorCode} | libzip rejected writing bytes to the current entry with error code \{zipErrorCode}. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_STREAMING_ENTRY_CLOSE_FAILED` | Failed to close ZIP entry for streaming resource: \{zipErrorCode} | libzip rejected closing a streaming entry with error code \{zipErrorCode}. The streamed bytes may be truncated. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_STREAMING_ENTRY_OPEN_FAILED` | Failed to open ZIP entry for streaming resource: \{zipErrorCode} | libzip rejected opening a streaming entry with error code \{zipErrorCode}. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_WRITER_CLOSE_FAILED` | Failed to close ZIP writer: \{zipErrorCode} | libzip reported error \{zipErrorCode} on close. The output bytes may be truncated; treat the archive as invalid. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_WRITER_CREATE_FAILED` | Failed to create ZIP writer. | The libzip writer could not be allocated. Out-of-memory or platform-resource exhaustion is the likely cause. | [Scenes](./concepts/scenes.md) |
| `SCENE.ZIP_WRITER_OPEN_FAILED` | Failed to open ZIP writer: \{zipErrorCode} | libzip rejected the writer initialization with error code \{zipErrorCode}. Inspect libzip's documentation for the meaning. | [Scenes](./concepts/scenes.md) |

## UTILS

Generic utility failures not specific to another category.

| Code | Message | Hint | Docs |
| --- | --- | --- | --- |
| `UTILS.APNG_DATA_TOO_SMALL` | APNG data is empty or too small. | The APNG buffer is too short to contain a valid PNG signature. The source may be truncated. |  |
| `UTILS.APNG_FCTL_BEFORE_ACTL` | APNG has fcTL before acTL. | fcTL chunks must follow acTL. Reorder or regenerate the APNG. |  |
| `UTILS.APNG_FDAT_WITHOUT_FCTL` | APNG has fdAT with no preceding fcTL. | Each fdAT chunk must follow an fcTL declaring its frame. The animation stream is broken. |  |
| `UTILS.APNG_FDAT_WITHOUT_SEQ` | APNG has an fdAT chunk without a sequence number. | fdAT chunks must include a 4-byte sequence number. The chunk is malformed. |  |
| `UTILS.APNG_FRAME_INDEX_OUT_OF_RANGE` | APNG frame index out of range. | The requested frame index is past the last frame. Clamp it to \[0, frameCount). |  |
| `UTILS.APNG_FRAME_NO_PIXEL_DATA` | APNG has an animation frame with no pixel data. | Each animation frame must have at least one IDAT/fdAT chunk. |  |
| `UTILS.APNG_FRAME_OUT_OF_CANVAS` | APNG frame rectangle extends beyond the canvas. | fcTL coordinates must fit inside the canvas declared by IHDR. The file is malformed. |  |
| `UTILS.APNG_FRAME_ZERO_DIMENSIONS` | APNG has an animation frame with zero dimensions. | Each fcTL must declare positive width and height. The frame is invalid. |  |
| `UTILS.APNG_IDAT_BEFORE_IHDR` | APNG has IDAT before IHDR. | IDAT chunks must follow IHDR. The file violates PNG chunk ordering. |  |
| `UTILS.APNG_INVALID_ACTL` | APNG has invalid or misplaced acTL chunk. | The acTL chunk must precede IDAT and appear exactly once. The animation chunk is malformed. |  |
| `UTILS.APNG_INVALID_FCTL` | APNG has an invalid fcTL chunk. | An animation control chunk failed validation. The file may be partially corrupted. |  |
| `UTILS.APNG_INVALID_IHDR` | APNG has invalid or duplicated IHDR chunk. | PNG must contain exactly one IHDR chunk at the start. The file is malformed. |  |
| `UTILS.APNG_INVALID_SIGNATURE` | APNG data does not start with a valid PNG signature. | The first 8 bytes must be the PNG magic number. The source is not a PNG/APNG file. |  |
| `UTILS.APNG_MISSING_ACTL` | Not an APNG: acTL chunk is missing. | This is a static PNG, not an APNG. Use it with a single-frame decode path or supply an animated file. |  |
| `UTILS.APNG_MISSING_IHDR` | APNG source has no valid IHDR chunk. | Every PNG starts with IHDR. The file is empty or corrupted. |  |
| `UTILS.APNG_NO_FRAMES` | APNG declares no animation frames. | The acTL reports zero frames. Regenerate the APNG with at least one fcTL/fdAT. |  |
| `UTILS.APNG_ZERO_CANVAS` | APNG has zero canvas dimensions. | Canvas width and height must be > 0. The IHDR is corrupt. |  |
| `UTILS.CAPTION_DATA_UNAVAILABLE` | Caption data not available. | The caption resource has no bytes registered. Ensure data is loaded before requesting captions. |  |
| `UTILS.CAPTION_PARSE_EMPTY` | Failed to parse captions, no captions found. | The caption file parsed but contained no entries. Verify the source format. |  |
| `UTILS.CAPTION_UNSUPPORTED_MIME` | Unsupported caption mime type: \{mimeType} | Caption format '\{mimeType}' is not recognized. Convert to a supported format (e.g. text/vtt, application/x-subrip). |  |
| `UTILS.CAPTION_UTF16_INVALID_SIZE` | Failed to parse captions, unexpected file size for UTF-16BE encoded text. | UTF-16BE text must have an even byte count. The file is truncated. |  |
| `UTILS.COMPRESSION_EMPTY_DATA` | Cannot decompress empty data. | The input buffer is empty. Pass at least one byte of compressed data. |  |
| `UTILS.COMPRESSION_FORMAT_NONE_FOR_COMPRESS` | Cannot compress data with format None: no compression requested. | Pass a non-None compression format if compression is intended. |  |
| `UTILS.COMPRESSION_FORMAT_NONE_FOR_DECOMPRESS` | Cannot decompress data with format None: data is not compressed. | The detected format is None — the data is not compressed and does not need decompression. |  |
| `UTILS.COMPRESSION_FORMAT_UNSUPPORTED` | Unsupported compression format: \{format} | Compression format \{format} is not handled by this build. |  |
| `UTILS.COMPRESSION_NO_MAGIC_BYTES` | Unable to detect compression format: data does not have valid compression magic bytes. | The first bytes do not match any supported compression format. The data may not be compressed. |  |
| `UTILS.COMPRESSION_ZSTD_INVALID_FRAME` | Invalid zstd frame. | The zstd decoder rejected the frame header. The data may be truncated. |  |
| `UTILS.ENGINE_UNKNOWN_COMPONENT_TYPE` | Component \{component} is not a known reflected type. | Component '\{component}' is not registered with the reflection system. |  |
| `UTILS.ENUM_VALUE_INVALID` | Invalid enum value, expected one of: \{validValues} | The supplied string is not a member of the target enum. Pass one of: \{validValues}. |  |
| `UTILS.FILE_ALLOC_FAILED` | Could not allocate an output buffer of size \{size} to load \{path} | Out-of-memory loading '\{path}' (\{size} bytes). Free memory or stream the file in chunks. |  |
| `UTILS.FILE_MAP_FAILED` | Could not map file \{path} into memory: \{reason} | mmap() rejected '\{path}': \{reason}. Out-of-memory or virtual-memory limits may be the cause. |  |
| `UTILS.FILE_OPEN_FAILED` | Could not open file \{path}: \{reason} | The file '\{path}' could not be opened. Reason: \{reason} |  |
| `UTILS.FILE_READ_FAILED` | Could not read complete file \{path}: \{reason} | Reading '\{path}' returned an error or hit EOF prematurely. Reason: \{reason} |  |
| `UTILS.FILE_SIZE_FAILED` | Could not determine file size for \{path}: \{reason} | stat() failed on '\{path}': \{reason}. The file may have been removed or is unreadable. |  |
| `UTILS.FILE_TOO_LARGE` | File \{path} has size \{size} larger than the maximum supported \{max} | Loading is capped at \{max} bytes. Use streaming APIs for files larger than this. |  |
| `UTILS.GIF_PARSE_FAILED` | Failed to parse GIF file: \{reason} | The GIF source could not be decoded. Underlying reason: \{reason} |  |
| `UTILS.METAANY_EXPECTED_ARRAY` | Expected array, but got \{actual} | JS value must be an array. Got '\{actual}' instead. |  |
| `UTILS.METAANY_ITEM_MAP_FAILED` | Couldn't map item at index \{index} > \{reason} | Array element \{index} failed conversion. Reason: \{reason} |  |
| `UTILS.METAANY_MEMBER_MAP_FAILED` | Couldn't map value for member \`\{member}\` > \{reason} | Member '\{member}' failed conversion. Reason: \{reason} |  |
| `UTILS.METAANY_MISSING_PROPERTY` | Expected object of type '\{type}' to have property '\{property}'. | The JS object is missing required property '\{property}'. Add it before passing across the boundary. |  |
| `UTILS.METAANY_NON_STRING_TO_STRING` | Can't map non-string em::val to string. | The JavaScript value is not a string. Convert it to a string in JS before crossing the boundary. |  |
| `UTILS.METAANY_RESULT_TYPE_NOT_REFLECTED` | Type of Result value for \{details} is not reflected. | The Result type returned from '\{details}' is not reflection-registered. |  |
| `UTILS.METAANY_SET_FAILED` | Could not set value for \{member} on object of type \{type} | The reflected setter for '\{member}' on '\{type}' rejected the value. |  |
| `UTILS.METAANY_TYPE_NEEDS_REFLECTION` | Type \{type} must have reflection info. | Register type '\{type}' with the reflection system before crossing the JS↔C++ boundary. |  |
| `UTILS.METAANY_UNDEFINED` | Can't map \`undefined\` to \`\{type}\` | JavaScript \`undefined\` cannot be converted to '\{type}'. Pass a defined value of the expected type. |  |
| `UTILS.METAANY_UNHANDLED_INTEGRAL` | Unhandled integral type: \{type} | The integral type '\{type}' has no MetaAny ↔ em::val mapping. |  |
| `UTILS.METAANY_UNHANDLED_SEQUENCE` | Unhandled sequence container type: \{type} | Sequence container '\{type}' has no MetaAny ↔ em::val mapping. |  |
| `UTILS.METAANY_UNHANDLED_TYPE_KIND` | Unhandled type kind. \{type} | Type kind for '\{type}' is not recognized by the conversion layer. |  |
| `UTILS.META_TYPE_FUNCTION_UNKNOWN` | Function must be known. | The requested reflected function is not registered on this MetaType. |  |
| `UTILS.META_TYPE_INVALID` | Not a valid type, no name available. | The MetaType handle does not refer to a registered reflection type. |  |
| `UTILS.META_TYPE_INVOKE_FAILED` | Could not invoke \{name}. | The reflected function '\{name}' could not be invoked. Argument types or arity may not match. |  |
| `UTILS.MKV_EBML_PARSE_FAILED` | Failed to parse EBML header. | The EBML header is malformed. The file may not be a Matroska container. |  |
| `UTILS.MKV_INVALID_DATA` | Invalid MKV data. | The MKV demuxer rejected the source bytes. The file may be truncated or use an unsupported variant. |  |
| `UTILS.MKV_NO_TRACKS` | No tracks found. | The MKV file declares no tracks. Verify it contains video/audio streams. |  |
| `UTILS.MKV_SEGMENT_CREATE_FAILED` | Failed to create segment. | libwebm could not allocate a segment. Out-of-memory or unsupported MKV variant. |  |
| `UTILS.MKV_SEGMENT_LOAD_FAILED` | Failed to load segment. | The MKV segment payload is unreadable. The file may be truncated mid-segment. |  |
| `UTILS.MP4_AUDIO_CODEC_UNSUPPORTED` | Unsupported audio codec '\{fourcc}' (OTI=\{oti}). | MP4 audio must use the AAC (mp4a), MP3, or AMR (samr/sawb) codec. Re-encode the audio to AAC. |  |
| `UTILS.MP4_AUDIO_TRACK_INDEX_OUT_OF_BOUNDS` | Audio track index \{index} is out of bounds. Valid range: 0-\{max} | Pass an audio track index within \[0, \{max}]. |  |
| `UTILS.MP4_OPEN_FAILED` | Failed to open MP4 file. | The MP4 demuxer could not open the source. The file may be missing or unreadable. |  |
| `UTILS.MP4_VIDEO_CODEC_UNSUPPORTED` | Unsupported video codec '\{fourcc}' (OTI=\{oti}). | MP4 video must use the H.264 (avc1) or H.265 (hvc1) codec. Re-encode the video to H.264 or H.265, or use a WebM file for AV1, VP8, or VP9. |  |
| `UTILS.PIXEL_BUFFER_BACKEND_TEXTURE_INCOMPLETE` | Backend texture is incomplete. | The Skia backend texture handle does not carry enough state for read-back. |  |
| `UTILS.PIXEL_BUFFER_GL_TEXTURE_INFO_FAILED` | Failed to retrieve OpenGL texture info. | The backend texture did not expose its GL info. The compute context may not be a GL context. |  |
| `UTILS.PIXEL_BUFFER_INVALID_IMAGE` | Invalid RasterImage or SkImage. | The image handle is null or not a recognized Skia/raster image. |  |
| `UTILS.PIXEL_BUFFER_NOT_STREAM_FILL` | This operation is only supported for pixel stream fills. | Use a block with a pixel-stream fill type. Standard fills are not supported by this conversion API. |  |
| `UTILS.PIXEL_BUFFER_NO_BACKEND_TEXTURE` | No valid backend texture. | The Skia image is not backed by a GPU texture. The current compute context may not support direct read-back. |  |
| `UTILS.PIXEL_BUFFER_NO_CANVAS` | No canvas. | The Skia surface has no canvas attached. The compute context may not be initialized. |  |
| `UTILS.PIXEL_BUFFER_NO_GPU_CONTEXT` | No GPU context. | The compute context lacks a GPU backend. Pixel-buffer conversion requires GPU access. |  |
| `UTILS.PIXEL_BUFFER_UNSUPPORTED_FORMAT` | Unsupported pixel format. | The native pixel buffer is not 32-bit BGRA. Convert the source to kCVPixelFormatType\_32BGRA before updating the pixel-stream fill. |  |
| `UTILS.REFLECTION_BLOCK_NOT_VALID` | The block with ID \{block} is not valid. It may have been deleted, e.g., when a new scene was loaded. | Resolve the block id before invoking reflection APIs. Block ids become invalid after scene reloads or block destruction. |  |
| `UTILS.REFLECTION_COMPONENT_NOT_REFLECTED` | '\{component}' is not a reflected type (tried to get '\{memberPath}' member). | Register the component with the reflection system or pass an already-registered type name. |  |
| `UTILS.REFLECTION_COMPONENT_NOT_SET` | Component \{component} is not set on entity \{entity}. | Verify the entity has been assigned the component before reading. Use the entity's component-list API to inspect. |  |
| `UTILS.REFLECTION_ENTITY_MISSING_COMPONENT` | Entity ID \{entity}\{optionalType} doesn't have component "\{component}". | The block does not carry this component. Use a block type that supports it or attach the component first. |  |
| `UTILS.REFLECTION_KEY_NOT_FOUND` | Could not find member "\{key}" | The key '\{key}' does not exist on the current type. Inspect available members and adjust. |  |
| `UTILS.REFLECTION_KEY_PATH_EMPTY` | Key path must be at least 1 element but is empty. | Provide a non-empty key path (e.g. "transform/x"). |  |
| `UTILS.REFLECTION_KEY_PATH_MEMBER_MISSING` | Member "\{member}" for type "\{type}" not found for given key path "\{keyPath}". Valid members for key path "\{prefix}*" are: \{members}. | Adjust '\{keyPath}' to reference one of the listed members. |  |
| `UTILS.REFLECTION_MEMBER_NOT_ACCESSIBLE_BY_REF` | Could not get member "\{member}". Must access by reference, if not modifying the most nested member. Reflected members for key path "\{prefix}*" are: \{members}. | Intermediate segments of a key path require by-reference access. Mark '\{member}' as a by-reference member or address its tail directly. |  |
| `UTILS.REFLECTION_MEMBER_NOT_FOUND` | Member \{member} not found on current type. | The member '\{member}' is not a reflected field on this type. Check the type's reflected members. |  |
| `UTILS.REFLECTION_MEMBER_TYPE_NOT_REFLECTED` | Type of member named "\{member}" on "\{type}" is not reflected. Reflected members for key path "\{prefix}*" are: \{members}. | Reflection cannot descend into '\{member}' because its type is not registered. Reflect the type or stop the key path at '\{member}'. |  |
| `UTILS.REFLECTION_NO_MEMBERS_FOR_PREFIX` | "\{member}" has no reflected members. | The intermediate type at '\{member}' has no fields to descend into. Adjust the key path. |  |
| `UTILS.REFLECTION_SET_MEMBER_FAILED` | Could not set member "\{member}" of type "\{type}". | The reflected setter for '\{member}' returned false. Verify the value type matches the member. |  |
| `UTILS.REFLECTION_SET_WILDCARD_TYPE_MISMATCH` | Type mismatch between "\{lhs}" and "\{rhs}": "\{lhsType}" vs. "\{rhsType}". | Wildcard set requires all members to share a type. |  |
| `UTILS.REFLECTION_TYPE_NOT_REFLECTED` | \{component} is not a reflected type. | Register the type with the reflection system before accessing it dynamically. |  |
| `UTILS.REFLECTION_TYPE_NO_MEMBERS` | Type "\{type}" has no reflected members. | The wildcard key path requires a type with reflected fields. Use a concrete member name or pick a different type. |  |
| `UTILS.REFLECTION_UNSUPPORTED_TYPE` | Unsupported type. | The reflected type is not handled by this operation. Pass a supported type. |  |
| `UTILS.REFLECTION_WILDCARD_NOT_TAIL` | Wildcard only supported at tail end of path. | Move the wildcard '*' to the last segment of the key path. |  |
| `UTILS.REFLECTION_WILDCARD_SET_PARTIAL` | Could not set all members of type "\{type}". | At least one reflected member of '\{type}' rejected the assignment. Member-level setters may have failed silently. |  |
| `UTILS.REFLECTION_WILDCARD_TYPE_MISMATCH` | Type mismatch between "\{lhs}" and "\{rhs}". | Wildcard get requires all matched members to share a type. Members '\{lhs}' and '\{rhs}' differ. |  |
| `UTILS.REFLECTION_WILDCARD_VALUE_MISMATCH` | Value mismatch between "\{lhs}" and "\{rhs}". | Wildcard get returns a single representative value; members '\{lhs}' and '\{rhs}' currently disagree. |  |
| `UTILS.SETTING_NO_ARGS` | Received no arguments. Can't determine type. | The setting's type is inferred from the value you pass, so the call cannot accept zero arguments. Pass the setting value explicitly (bool, int, float, color, or string). |  |
| `UTILS.STD_EXPECTED_STRING_ERROR` | \{message} | Adapter path between \`std::expected\<T, std::string>\` and \`Result\<T>\`. The source returned a free-text \`std::string\` error — surfacing it through the catalog so consumers still see the original wording. Convert the producer to return a catalog id when possible. |  |
| `UTILS.STORAGE_KEY_NOT_FOUND` | Key not found. | The requested storage key has no value. Write it before reading, or guard the read by checking for existence first. |  |
| `UTILS.TRACKING_NOT_ENABLED` | Tracking is not enabled. | Enable tracking on the engine before invoking tracking APIs. |  |
| `UTILS.URI_NON_ASCII` | Failed to parse URI: \{uri}. Contains non-ASCII byte 0x\{byte} at position \{position}. URIs must only contain ASCII characters, please percent-encode special characters. | Percent-encode special characters in '\{uri}' before parsing. Non-ASCII byte 0x\{byte} found at position \{position}. |  |
| `UTILS.URI_PARSE_FAILED` | Failed to parse URI: \{uri} | The URI '\{uri}' is malformed. Confirm scheme, host, and path. |  |
| `UTILS.WAV_DATA_BEFORE_FMT` | Invalid WAV file: data chunk found before fmt chunk. | WAV chunk order requires fmt before data. Re-encode the file. |  |
| `UTILS.WAV_FMT_CHUNK_TOO_SMALL` | WAV fmt chunk too small: expected at least \{expected} bytes, got \{actual}. | The fmt chunk does not carry the minimum WAV header fields. |  |
| `UTILS.WAV_INVALID_BITS_PER_SAMPLE` | Invalid WAV bits\_per\_sample: \{bitsPerSample} | WAV bits\_per\_sample must be one of 8/16/24/32. Got \{bitsPerSample}. |  |
| `UTILS.WAV_MISSING_FMT_OR_DATA` | Invalid WAV file: missing fmt or data chunk. | Both fmt and data chunks are required. The file is missing one or both. |  |
| `UTILS.WAV_NOT_WAVE` | Not a WAV file: RIFF format is not WAVE. | The RIFF container is not a WAVE file. The source is a different RIFF type or not RIFF at all. |  |
| `UTILS.WAV_TRUNCATED_FMT_CHUNK` | WAV file truncated: not enough data for fmt chunk. | The fmt chunk is cut off. The file is incomplete. |  |
| `UTILS.WAV_TRUNCATED_RIFF_HEADER` | WAV file truncated: not enough data for RIFF header. | The file is shorter than the 12-byte RIFF header. The source is incomplete. |  |
| `UTILS.WAV_TRUNCATED_UNKNOWN_CHUNK` | WAV file truncated: not enough data to skip unknown chunk. | Parsing tried to skip an unknown chunk but ran past the buffer end. The file is incomplete. |  |
| `UTILS.WAV_UNSUPPORTED_AUDIO_FORMAT` | Unsupported WAV audio format: \{audioFormat} | WAV audio format code \{audioFormat} is not handled. Re-encode as PCM (1) or IEEE float (3). |  |
| `UTILS.WAV_ZERO_CHANNELS` | Invalid WAV file: num\_channels is 0. | WAV must declare at least one channel. |  |
| `UTILS.WAV_ZERO_SAMPLE_RATE` | Invalid WAV file: sample\_rate is 0. | WAV must declare a positive sample rate. |  |
| `UTILS.WAV_ZERO_SIZE_CHUNK` | Invalid WAV file: zero-size chunk encountered. | A chunk reports zero size, which would cause infinite parsing. The file is malformed. |  |
| `UTILS.ZSTD_COMPRESS_FAILED` | Zstd compression failed: \{reason} | The zstd library reported a compression failure. \`reason\` is the value returned by \`ZSTD\_getErrorName(...)\`. |  |
| `UTILS.ZSTD_DECOMPRESS_FAILED` | Zstd decompression failed: \{reason} | The zstd library reported a decompression failure. \`reason\` is the value returned by \`ZSTD\_getErrorName(...)\`. The input may be truncated or not zstd-encoded. |  |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support