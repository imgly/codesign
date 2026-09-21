> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Create, load, save, and manipulate scenes.

Scenes are the root element of every design hierarchy. Their children, stacks of pages, individual pages or other blocks, define the content of the design.
Scenes can be created from scratch, loaded from a file or URL, or created from an image or video. After manipulation, they can be saved to a string or an archive. This allows further processing in another editor instance, automated processing in scripts or sharing with other users.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>SceneAPI</code></p>
  </summary>
</details>

## Scene Creation

Create new scenes from scratch or from media files.

<details>
  <summary>
    ### create()

    <br /><p>Create a new design scene, along with its own camera.</p>
  </summary>

  ```javascript
  const scene = engine.scene.create(layout);
  // With a specific design unit and auto-paired font-size unit:
  const pxScene = engine.scene.create('Free', { designUnit: 'Pixel' });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sceneLayout?` | `"Free"` | `"VerticalStack"` | `"HorizontalStack"` | `"DepthStack"` | The layout of the scene. |
  | `options?` | [`CreateSceneOptions`](./api/node/type-aliases/createsceneoptions.md) | Optional parameters for the scene. Properties: - `page` - Page options. Properties: - `size` - The size of the page. - `color` - Optional background color of the page. - `designUnit` - The design unit of the new scene. Defaults to `Pixel`. - `fontSizeUnit` - The font-size unit. If omitted, paired with `designUnit` (`Pixel` design unit → `Pixel` font unit, others → `Point`). |

  #### Returns

  `number`

  The scene's handle.

  #### Signature

  ```typescript
  create(sceneLayout?: "Free" | "VerticalStack" | "HorizontalStack" | "DepthStack", options?: CreateSceneOptions): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~createVideo()~~

    <br /><p>Create a new scene in video mode, along with its own camera.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | [`CreateSceneOptions`](./api/node/type-aliases/createsceneoptions.md) | Optional parameters for the scene. Properties: - `page` - Page options. Properties: - `size` - The size of the page. - `color` - Optional background color of the page. |

  #### Returns

  `number`

  The scene's handle.

  #### Deprecated

  Scene mode no longer affects engine behavior. Use `create()` followed by `setMode('Video')` instead.

  ```javascript
  const scene = engine.scene.createVideo();
  ```

  ***
</details>

<details>
  <summary>
    ### createFromImage()

    <br /><p>Loads the given image and creates a scene with a single page showing the image.</p>
  </summary>

  Fetching the image may take an arbitrary amount of time, so the scene isn't immediately available.

  ```javascript
  const scene = await engine.scene.createFromImage('https://img.ly/static/ubq_samples/sample_4.jpg');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The image URL. |
  | `dpi?` | `number` | The scene's DPI. |
  | `pixelScaleFactor?` | `number` | The display's pixel scale factor. |
  | `sceneLayout?` | `"Free"` | `"VerticalStack"` | `"HorizontalStack"` | `"DepthStack"` | - |
  | `spacing?` | `number` | - |
  | `spacingInScreenSpace?` | `boolean` | - |

  #### Returns

  `Promise`\<`number`>

  A promise that resolves with the scene ID on success or rejected with an error otherwise.

  #### Signature

  ```typescript
  createFromImage(url: string, dpi?: number, pixelScaleFactor?: number, sceneLayout?: "Free" | "VerticalStack" | "HorizontalStack" | "DepthStack", spacing?: number, spacingInScreenSpace?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### createFromVideo()

    <br /><p>Loads the given video and creates a scene with a single page showing the video.</p>
  </summary>

  Fetching the video may take an arbitrary amount of time, so the scene isn't immediately
  available.

  ```javascript
  const scene = await engine.scene.createFromVideo('https://img.ly/static/ubq_video_samples/bbb.mp4');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The video URL. |

  #### Returns

  `Promise`\<`number`>

  A promise that resolves with the scene ID on success or rejected with an error otherwise.

  #### Signature

  ```typescript
  createFromVideo(url: string): Promise<number>
  ```
</details>

## Scene Loading

Load scenes from various sources including strings, URLs, and archives.

<details>
  <summary>
    ### load()

    <br /><p>Load a scene from a scene string or from a URL to a scene or archive file.</p>
  </summary>

  The input kind is detected automatically: serialized scene content is loaded directly, while a
  URL is fetched and loaded as an archive or as a scene file depending on its content. This loads
  `.imgly` files as well as the legacy `.scene` and `.zip` formats. Any existing scene is replaced
  by the new one.

  ```javascript
  await creativeEngine.scene.load('https://example.com/my-scene.imgly');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `source` | `string` | `URL` | A scene string previously created by `saveToString`, or the URL of a scene or archive file. Pass a `URL` instance to load a URL unambiguously; strings are detected by their content. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |
  | `waitForResources?` | `boolean` | Whether to wait for all resources to finish loading before resolving. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  A handle to the loaded scene.

  #### Signature

  ```typescript
  load(source: string | URL, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromString()

    <br /><p>Load the contents of a scene file.</p>
  </summary>

  The string must be the binary contents of a scene file and is directly imported as blocks. Any existing scene is replaced by the new one.
  This is useful for loading scenes that were saved with `saveToString` or scenes that were created in another editor instance.

  ```javascript
  const sceneContent = await creativeEngine.scene.saveToString();
  creativeEngine.scene.loadFromString(sceneContent);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sceneContent` | `string` | The scene file contents, a base64 string. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |
  | `waitForResources?` | `boolean` | Whether to wait for all resources to finish loading before resolving. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  A handle to the loaded scene.

  #### Signature

  ```typescript
  loadFromString(sceneContent: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromURL()

    <br /><p>Load a scene from the URL to the scene file.</p>
  </summary>

  The scene file will be fetched asynchronously by the engine and loaded into the engine once it is available. Any existing scene is replaced by the new one.

  ```javascript
  const sceneURL = 'https://example.com/my-scene.json';
  creativeEngine.scene.loadFromURL(sceneURL);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The URL of the scene file. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |
  | `waitForResources?` | `boolean` | Whether to wait for all resources to finish loading before resolving. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  scene A promise that resolves once the scene was loaded or rejects with an error otherwise.

  #### Signature

  ```typescript
  loadFromURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromArchiveURL()

    <br /><p>Load a previously archived scene from the URL to the scene file.</p>
  </summary>

  The scene file will be fetched asynchronously by the engine. This requires continuous `render`
  calls on this engines instance.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The URL of the scene archive file. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |
  | `waitForResources?` | `boolean` | Whether to wait for all resources to finish loading before resolving. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  scene A promise that resolves once the scene was loaded or rejects with an error otherwise.

  #### Signature

  ```typescript
  loadFromArchiveURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<number>
  ```
</details>

## Scene Saving

Save and export scenes to different formats.

<details>
  <summary>
    ### saveToString()

    <br /><p>Serializes the current scene into a string. Selection is discarded.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `allowedResourceSchemes` | `string`\[] | The resource schemes to allow in the saved string. |
  | `onDisallowedResourceScheme?` | (`url`, `dataHash`) => `Promise`\<`string`> | An optional callback that is called for each resource URL that has a scheme absent from `resourceSchemesAllowed`. The `url` parameter is the resource URL and the `dataHash` parameter is the hash of the resource's data. The callback should return a new URL for the resource, which will be used in the serialized scene. The callback is expected to return the original URL if no persistence is needed. |

  ##### Returns

  `Promise`\<`string`>

  A promise that resolves with a string on success or an error on failure.

  ##### Deprecated

  Use saveToString(options) instead for better extensibility and to access compression features.

  #### Call Signature

  ```ts
  saveToString(options?): Promise<string>;
  ```

  Serializes the current scene into a string. Selection is discarded.
  When persisting the result as a file, use the `.imgly` extension.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `allowedResourceSchemes?`: `string`\[]; `onDisallowedResourceScheme?`: (`url`, `dataHash`) => `Promise`\<`string`>; `compression?`: \{ `format?`: [`CompressionFormat`](./api/node/enumerations/compressionformat.md); `level?`: [`CompressionLevel`](./api/node/enumerations/compressionlevel.md); }; } | Save options containing: - allowedResourceSchemes: The resource schemes to allow in the saved string. Defaults to \['blob', 'bundle', 'file', 'http', 'https', 'opfs']. - onDisallowedResourceScheme: An optional callback that is called for each resource URL that has a scheme absent from `resourceSchemesAllowed`. The `url` parameter is the resource URL and the `dataHash` parameter is the hash of the resource's data. The callback should return a new URL for the resource, which will be used in the serialized scene. The callback is expected to return the original URL if no persistence is needed. - compression: Optional compression settings containing: - format: Compression format (None or Zstd). Defaults to Zstd. - level: Compression level (Fastest, Default, or Best). Defaults to Default. |
  | `options.allowedResourceSchemes?` | `string`\[] | - |
  | `options.onDisallowedResourceScheme?` | (`url`, `dataHash`) => `Promise`\<`string`> | - |
  | `options.compression?` | \{ `format?`: [`CompressionFormat`](./api/node/enumerations/compressionformat.md); `level?`: [`CompressionLevel`](./api/node/enumerations/compressionlevel.md); } | - |
  | `options.compression.format?` | [`CompressionFormat`](./api/node/enumerations/compressionformat.md) | - |
  | `options.compression.level?` | [`CompressionLevel`](./api/node/enumerations/compressionlevel.md) | - |

  ##### Returns

  `Promise`\<`string`>

  A promise that resolves with a string on success or an error on failure.

  #### Signatures

  ```typescript
  saveToString(allowedResourceSchemes: string[], onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>): Promise<string>
  ```

  ```typescript
  saveToString(options?: object): Promise<string>
  ```

  ***
</details>

<details>
  <summary>
    ### saveToArchive()

    <br /><p>Saves the current scene and all of its referenced assets into an archive.</p>
  </summary>

  The archive contains all assets, that were accessible when this function was called.
  Blocks in the archived scene reference assets relative from to the location of the scene
  file. These references are resolved when loading such a scene via `load`.
  When persisting the result as a file, use the `.imgly` extension.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | [`SaveToArchiveOptions`](./api/node/interfaces/savetoarchiveoptions.md) | Optional settings: - compression: Compression applied to the scene inside the archive, containing: - format: Compression format (None or Zstd). Defaults to Zstd. - level: Compression level (Fastest, Default, or Best). Defaults to Default. Bundled media is always stored uncompressed, because it already is in compressed formats. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a Blob on success or an error on failure.

  #### Signature

  ```typescript
  saveToArchive(options?: SaveToArchiveOptions): Promise<Blob>
  ```
</details>

## Page Management

Manage pages within scenes and find elements.

<details>
  <summary>
    ### getPages()

    <br /><p>Get the sorted list of pages in the scene.</p>
  </summary>

  ```javascript
  const pages = engine.scene.getPages();
  ```

  #### Returns

  `number`\[]

  The sorted list of pages in the scene.

  #### Signature

  ```typescript
  getPages(): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### getCurrentPage()

    <br /><p>Get the current page, i.e., the page of the first selected element if this page
    is at least 25% visible or, otherwise, the page nearest to the viewport center.</p>
  </summary>

  ```javascript
  const currentPage = engine.scene.getCurrentPage();
  ```

  #### Returns

  `number`

  The current page in the scene or null.

  #### Signature

  ```typescript
  getCurrentPage(): number
  ```

  ***
</details>

<details>
  <summary>
    ### findNearestToViewPortCenterByType()

    <br /><p>Find all blocks with the given type sorted by the distance to viewport center.</p>
  </summary>

  ```javascript
  // Use longhand block type ID to find nearest pages.
  let nearestPageByType = engine.scene.findNearestToViewPortCenterByType('//ly.img.ubq/page')[0];
  // Or use shorthand block type ID.
  nearestPageByType = engine.scene.findNearestToViewPortCenterByType('page')[0];
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`DesignBlockType`](./api/node/type-aliases/designblocktype.md) | The type to search for. |

  #### Returns

  `number`\[]

  A list of block ids sorted by distance to viewport center.

  #### Signature

  ```typescript
  findNearestToViewPortCenterByType(type: DesignBlockType): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findNearestToViewPortCenterByKind()

    <br /><p>Find all blocks with the given kind sorted by the distance to viewport center.</p>
  </summary>

  ```javascript
  let nearestImageByKind = engine.scene.findNearestToViewPortCenterByKind('image')[0];
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `kind` | `string` | The kind to search for. |

  #### Returns

  `number`\[]

  A list of block ids sorted by distance to viewport center.

  #### Signature

  ```typescript
  findNearestToViewPortCenterByKind(kind: string): number[]
  ```
</details>

## Event Subscriptions

Subscribe to scene-related events and changes.

<details>
  <summary>
    ### onZoomLevelChanged

    <br /><p>Subscribe to changes to the zoom level.</p>
  </summary>

  ```javascript
  const unsubscribeZoomLevelChanged = engine.scene.onZoomLevelChanged(() => {
    const zoomLevel = engine.scene.getZoomLevel();
    console.log('Zoom level is now: ', zoomLevel);
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | This function is called at the end of the engine update, if the zoom level has changed. |

  #### Returns

  A method to unsubscribe.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onActiveChanged

    <br /><p>Subscribe to changes to the active scene rendered by the engine.</p>
  </summary>

  ```javascript
  const unsubscribe = engine.scene.onActiveChanged(() => {
    const newActiveScene = engine.scene.get();
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | This function is called at the end of the engine update, if the active scene has changed. |

  #### Returns

  A method to unsubscribe.

  () => `void`
</details>

## Experimental Features

Experimental features that may change or be removed in future versions.

<details>
  <summary>
    ### unstable\_enableCameraPositionClamping()
  </summary>

  Continually ensures the camera position to be within the width and height of the blocks axis-aligned bounding box.
  Disables any previously set camera position clamping in the scene and also takes priority over clamp camera commands.

  ```javascript
  // Keep the scene with padding of 10px within the camera
  engine.scene.unstable_enableCameraPositionClamping([scene], 10.0, 10.0, 10.0, 10.0, 0.0, 0.0, 0.0, 0.0);
  ```

  Without padding, this results in a tight clamp on the block. With padding, the padded part of the
  blocks is ensured to be visible.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks to which the camera position is adjusted to, usually, the scene or a page. |
  | `paddingLeft?` | `number` | Optional padding in screen pixels to the left of the block. |
  | `paddingTop?` | `number` | Optional padding in screen pixels to the top of the block. |
  | `paddingRight?` | `number` | Optional padding in screen pixels to the right of the block. |
  | `paddingBottom?` | `number` | Optional padding in screen pixels to the bottom of the block. |
  | `scaledPaddingLeft?` | `number` | Optional padding in screen pixels to the left of the block that scales with the zoom level until five times the initial value. |
  | `scaledPaddingTop?` | `number` | Optional padding in screen pixels to the top of the block that scales with the zoom level until five times the initial value. |
  | `scaledPaddingRight?` | `number` | Optional padding in screen pixels to the right of the block that scales with the zoom level until five times the initial value. |
  | `scaledPaddingBottom?` | `number` | Optional padding in screen pixels to the bottom of the block that scales with the zoom level until five times the initial value. This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_disableCameraPositionClamping()
  </summary>

  Disables any previously set position clamping for the current scene.

  ```javascript
  engine.scene.unstable_disableCameraPositionClamping();
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene?` | `number` | Optionally, the scene or a block in the scene for which to query the position clamping. This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_isCameraPositionClampingEnabled()
  </summary>

  Queries whether position clamping is enabled.

  ```javascript
  engine.scene.unstable_isCameraPositionClampingEnabled();
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene?` | `number` | Optionally, the scene or a block in the scene for which to query the position clamping. |

  #### Returns

  `boolean`

  True if the given block has position clamping set or the scene contains a block for which position clamping is set, false
  otherwise.
  This API is experimental and may change or be removed in future versions.

  ***
</details>

<details>
  <summary>
    ### unstable\_enableCameraZoomClamping()
  </summary>

  Continually ensures the zoom level of the camera in the active scene to be in the given range.

  ```javascript
  // Allow zooming from 12.5% to 800% relative to the size of a page
  engine.scene.unstable_enableCameraZoomClamping([page], 0.125, 8.0, 0.0, 0.0, 0.0, 0.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks to which the camera zoom limits are adjusted to, usually, the scene or a page. |
  | `minZoomLimit?` | `number` | The minimum zoom level limit when zooming out, unlimited when negative. |
  | `maxZoomLimit?` | `number` | The maximum zoom level limit when zooming in, unlimited when negative. |
  | `paddingLeft?` | `number` | Optional padding in screen pixels to the left of the block. Only applied when the block is not a camera. |
  | `paddingTop?` | `number` | Optional padding in screen pixels to the top of the block. Only applied when the block is not a camera. |
  | `paddingRight?` | `number` | Optional padding in screen pixels to the right of the block. Only applied when the block is not a camera. |
  | `paddingBottom?` | `number` | Optional padding in screen pixels to the bottom of the block. Only applied when the block is not a camera. This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_disableCameraZoomClamping()
  </summary>

  Disables any previously set zoom clamping for the current scene.

  ```javascript
  engine.scene.unstable_disableCameraZoomClamping();
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene?` | `number` | Optionally, the scene or a block for which to query the zoom clamping. This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_isCameraZoomClampingEnabled()
  </summary>

  Queries whether zoom clamping is enabled.

  ```javascript
  engine.scene.unstable_isCameraZoomClampingEnabled();
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene?` | `number` | Optionally, the scene or a block for which to query the zoom clamping. |

  #### Returns

  `boolean`

  True if the given block has zoom clamping set or the scene contains a block for which zoom clamping is set, false otherwise.
  This API is experimental and may change or be removed in future versions.
</details>

## Scene Properties

Get and set scene properties like design units and mode.

<details>
  <summary>
    ### get()

    <br /><p>Return the currently active scene.</p>
  </summary>

  ```javascript
  const scene = engine.scene.get();
  ```

  #### Returns

  `number`

  The scene or null, if none was created yet.

  #### Signature

  ```typescript
  get(): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getMode()~~

    <br /><p>Get the current scene mode.</p>
  </summary>

  #### Returns

  `"Design"` | `"Video"`

  The current mode of the scene, or null if no mode has been set.

  #### Deprecated

  Scene mode no longer affects engine behavior. All features work regardless of mode.

  ```javascript
  const mode = scene.getMode();
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setMode()~~

    <br /><p>Set the mode of the scene.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `mode` | `"Design"` | `"Video"` | The new mode for the scene. |

  #### Returns

  `void`

  #### Deprecated

  Scene mode no longer affects engine behavior. All features work regardless of mode.

  ```javascript
  engine.scene.setMode('Video');
  ```

  ***
</details>

<details>
  <summary>
    ### setDesignUnit()

    <br /><p>Converts all values of the current scene into the given design unit.</p>
  </summary>

  ```javascript
  engine.scene.setDesignUnit('Pixel');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `designUnit` | `"Pixel"` | `"Millimeter"` | `"Inch"` | The new design unit of the scene |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDesignUnit(designUnit: "Pixel" | "Millimeter" | "Inch"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDesignUnit()

    <br /><p>Returns the design unit of the current scene.</p>
  </summary>

  ```javascript
  engine.scene.getDesignUnit();
  ```

  #### Returns

  `"Pixel"` | `"Millimeter"` | `"Inch"`

  The current design unit.

  #### Signature

  ```typescript
  getDesignUnit(): "Pixel" | "Millimeter" | "Inch"
  ```

  ***
</details>

<details>
  <summary>
    ### setFontSizeUnit()

    <br /><p>Sets the unit in which font sizes for <code>setTextFontSize</code> and <code>getTextFontSizes</code> are interpreted.
    The engine continues to store font sizes in points internally; this only affects how values
    are interpreted at the API boundary when callers don't specify a <code>unit</code> in <code>TextFontSizeOptions</code>.</p>
  </summary>

  ```javascript
  engine.scene.setFontSizeUnit('Pixel');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `fontSizeUnit` | `"Pixel"` | `"Point"` | The new font-size unit of the scene. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFontSizeUnit(fontSizeUnit: "Pixel" | "Point"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFontSizeUnit()

    <br /><p>Returns the font-size unit of the current scene.</p>
  </summary>

  ```javascript
  engine.scene.getFontSizeUnit();
  ```

  #### Returns

  `"Pixel"` | `"Point"`

  The current font-size unit.

  #### Signature

  ```typescript
  getFontSizeUnit(): "Pixel" | "Point"
  ```

  ***
</details>

<details>
  <summary>
    ### getLayout()

    <br /><p>Get the layout of the current scene.</p>
  </summary>

  ```javascript
  const layout = engine.scene.getLayout();
  ```

  #### Returns

  `"Free"` | `"VerticalStack"` | `"HorizontalStack"` | `"DepthStack"`

  The current layout of the scene.

  #### Signature

  ```typescript
  getLayout(): "Free" | "VerticalStack" | "HorizontalStack" | "DepthStack"
  ```

  ***
</details>

<details>
  <summary>
    ### setLayout()

    <br /><p>Set the layout of the current scene.
    This will handle all necessary conversions including creating or destroying stack blocks
    and reparenting pages as needed.</p>
  </summary>

  When transitioning from stack layouts (VerticalStack, HorizontalStack, DepthStack) to Free layout,
  the global positions of pages are preserved to maintain their visual appearance in the scene.

  ```javascript
  engine.scene.setLayout('VerticalStack');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `layout` | `"Free"` | `"VerticalStack"` | `"HorizontalStack"` | `"DepthStack"` | The new layout for the scene. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setLayout(layout: "Free" | "VerticalStack" | "HorizontalStack" | "DepthStack"): void
  ```
</details>

## Template Operations

Apply templates to existing scenes.

<details>
  <summary>
    ### applyTemplateFromString()

    <br /><p>Applies the contents of the given template scene to the currently loaded scene.</p>
  </summary>

  This loads the template scene while keeping the design unit and page dimensions
  of the current scene. The content of the pages is automatically adjusted to fit
  the new dimensions.

  ```javascript
  engine.scene.applyTemplateFromString(await engine.scene.saveToString());
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `content` | `string` | The template scene file contents, a base64 string. |

  #### Returns

  `Promise`\<`void`>

  A Promise that resolves once the template was applied or rejects if there was an error.

  #### Signature

  ```typescript
  applyTemplateFromString(content: string): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### applyTemplateFromURL()

    <br /><p>Applies the contents of the given template scene to the currently loaded scene.</p>
  </summary>

  This loads the template scene while keeping the design unit and page dimensions
  of the current scene. The content of the pages is automatically adjusted to fit
  the new dimensions.

  ```javascript
  engine.scene.applyTemplateFromURL('https://cdn.img.ly/assets/demo/v4/ly.img.template/templates/cesdk_postcard_1.scene');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The url to the template scene file. |

  #### Returns

  `Promise`\<`void`>

  A Promise that resolves once the template was applied or rejects if there was an error.

  #### Signature

  ```typescript
  applyTemplateFromURL(url: string): Promise<void>
  ```
</details>

## Camera & Zoom

Control camera position, zoom levels, and auto-fit behavior.

<details>
  <summary>
    ### setZoomLevel()

    <br /><p>Set the zoom level of the scene, e.g., for headless versions.</p>
  </summary>

  This only shows an effect if the zoom level is not handled/overwritten by the UI.
  Setting a zoom level of 2.0f results in one dot in the design to be two pixels on the screen.

  ```javascript
  // Zoom to 100%
  engine.scene.setZoomLevel(1.0);

  // Zoom to 50%
  engine.scene.setZoomLevel(0.5 * engine.scene.getZoomLevel());
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `zoomLevel?` | `number` | The new zoom level. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setZoomLevel(zoomLevel?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getZoomLevel()

    <br /><p>Get the zoom level of the scene or for a camera in the scene in unit <code>dpx/dot</code>. A zoom level of 2.0 results in one pixel in the design to be two pixels
    on the screen.</p>
  </summary>

  ```javascript
  const zoomLevel = engine.scene.getZoomLevel();
  ```

  #### Returns

  `number`

  The zoom level of the block's camera.

  #### Signature

  ```typescript
  getZoomLevel(): number
  ```

  ***
</details>

<details>
  <summary>
    ### zoomToBlock()

    <br /><p>Sets the zoom and focus to show a block, optionally with animation.
    This only shows an effect if the zoom level is not handled/overwritten by the UI.
    Without padding, this results in a tight view on the block.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should be focused on. |
  | `options?` | [`ZoomOptions`](./api/node/type-aliases/zoomoptions.md) | Configuration for padding and animation. |

  ##### Returns

  `Promise`\<`void`>

  A promise that resolves once the zoom was set or rejects with an error otherwise.

  #### Call Signature

  ```ts
  zoomToBlock(
     id, 
     paddingLeft?, 
     paddingTop?, 
     paddingRight?, 
  paddingBottom?): Promise<void>;
  ```

  Sets the zoom and focus to show a block.

  This only shows an effect if the zoom level is not handled/overwritten by the UI.
  Without padding, this results in a tight view on the block.

  ```javascript
  // Bring entire scene in view with padding of 20px in all directions
  engine.scene.zoomToBlock(scene, 20.0, 20.0, 20.0, 20.0);
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should be focused on. |
  | `paddingLeft?` | `number` | Optional padding in screen pixels to the left of the block. |
  | `paddingTop?` | `number` | Optional padding in screen pixels to the top of the block. |
  | `paddingRight?` | `number` | Optional padding in screen pixels to the right of the block. |
  | `paddingBottom?` | `number` | Optional padding in screen pixels to the bottom of the block. |

  ##### Returns

  `Promise`\<`void`>

  A promise that resolves once the zoom was set or rejects with an error otherwise.

  ##### Deprecated

  Use zoomToBlock with options object instead

  #### Signatures

  ```typescript
  zoomToBlock(id: number, options?: ZoomOptions): Promise<void>
  ```

  ```typescript
  zoomToBlock(id: number, paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### enableZoomAutoFit()

    <br /><p>Continually adjusts the zoom level to fit the width or height of a block's axis-aligned bounding box.</p>
  </summary>

  This only shows an effect if the zoom level is not handled/overwritten by the UI.
  Without padding, this results in a tight view on the block.
  No more than one block per scene can have zoom auto-fit enabled.
  Calling `setZoomLevel` or `zoomToBlock` disables the continuous adjustment.

  ```javascript
  // Follow page with padding of 20px horizontally before and after the block
  engine.scene.enableZoomAutoFit(page, 'Horizontal', 20, 20)
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block for which the zoom is adjusted. |
  | `axis` | `"Horizontal"` | `"Vertical"` | The block axis for which the zoom is adjusted. |
  | `paddingBefore?` | `number` | Optional padding in screen pixels before the block. |
  | `paddingAfter?` | `number` | Optional padding in screen pixels after the block. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  enableZoomAutoFit(
     id, 
     axis, 
     paddingLeft?, 
     paddingTop?, 
     paddingRight?, 
     paddingBottom?): void;
  ```

  Continually adjusts the zoom level to fit the width or height of a block's axis-aligned bounding box.

  This only shows an effect if the zoom level is not handled/overwritten by the UI.
  Without padding, this results in a tight view on the block.
  Calling `setZoomLevel` or `zoomToBlock` disables the continuous adjustment.

  ```javascript
  // Follow page with padding of 20px in both directions
  engine.scene.enableZoomAutoFit(page, 'Both', 20.0, 20.0, 20.0, 20.0);
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block for which the zoom is adjusted. |
  | `axis` | `"Both"` | The block axis for which the zoom is adjusted. |
  | `paddingLeft?` | `number` | Optional padding in screen pixels to the left of the block. |
  | `paddingTop?` | `number` | Optional padding in screen pixels to the top of the block. |
  | `paddingRight?` | `number` | Optional padding in screen pixels to the right of the block. |
  | `paddingBottom?` | `number` | Optional padding in screen pixels to the bottom of the block. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  enableZoomAutoFit(id: number, axis: "Horizontal" | "Vertical", paddingBefore?: number, paddingAfter?: number): void
  ```

  ```typescript
  enableZoomAutoFit(id: number, axis: "Both", paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### disableZoomAutoFit()

    <br /><p>Disables any previously set zoom auto-fit.</p>
  </summary>

  ```javascript
  engine.scene.disableZoomAutoFit(scene);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene` | `number` | The scene or a block in the scene for which to disable zoom auto-fit. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  disableZoomAutoFit(blockOrScene: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### isZoomAutoFitEnabled()

    <br /><p>Queries whether zoom auto-fit is enabled for the given block.</p>
  </summary>

  ```javascript
  engine.scene.isZoomAutoFitEnabled(scene);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockOrScene` | `number` | The scene or a block in the scene for which to query the zoom auto-fit. |

  #### Returns

  `boolean`

  True if the given block has auto-fit set or the scene contains a block for which auto-fit is set, false
  otherwise.

  #### Signature

  ```typescript
  isZoomAutoFitEnabled(blockOrScene: number): boolean
  ```
</details>

## Other

<details>
  <summary>
    ### setPlaying()

    <br /><p>Starts or stops playback of the current scene.
    Only works in Video mode, not in Design mode.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `play` | `boolean` | True to start playback, false to stop |

  #### Returns

  `void`

  #### Throws

  Error if no page is available for playback

  #### Signature

  ```typescript
  setPlaying(play: boolean): void
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support