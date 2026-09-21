> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The CreativeEngine is the core processing unit of CE.SDK and handles state management, rendering, input handling, and much more.
It provides APIs to directly interact with assets, blocks, scenes, and variables. These APIs can be used in a headless environment
to build and manipulate designs programmatically, or in a browser to create interactive applications.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>CreativeEngine</code></p>
  </summary>
</details>

## Engine Management

<details>
  <summary>
    ### update()

    <br /><p>Update the engine's internal state and render to the canvas, if a scene exists.</p>
  </summary>

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  update(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### dispose()

    <br /><p>Dispose the engine and clean up all resources.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  dispose(): void
  ```

  ***
</details>

<details>
  <summary>
    ### init()

    <br /><p>Initialize a CreativeEngine with an optional configuration.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `config?` | `Partial`\<[`Configuration`](./api/node/interfaces/configuration.md)> | Optional configuration object for engine initialization. |

  #### Returns

  `Promise`\<`CreativeEngine`>

  A promise that resolves to an engine instance.

  #### Signature

  ```typescript
  init(config?: Partial<Configuration>): Promise<CreativeEngine>
  ```

  ***
</details>

<details>
  <summary>
    ### getBaseURL()

    <br /><p>Returns the configured base URL for the engine's assets.</p>
  </summary>

  #### Returns

  `string`

  The absolute base URL configured for this engine instance.

  #### Example

  ```typescript
  const engine = await CreativeEngine.init({
    baseURL: 'https://my-cdn.example.com/assets/'
  });

  console.log(engine.getBaseURL()); // 'https://my-cdn.example.com/assets/'
  ```

  #### Signature

  ```typescript
  getBaseURL(): string
  ```
</details>

## Asset Sources

<details>
  <summary>
    ### ~~addDefaultAssetSources()~~

    <br /><p>Register a set of asset sources containing default assets.</p>
  </summary>

  Available default asset sources:

  - `'ly.img.sticker'` - Various stickers
  - `'ly.img.vectorpath'` - Shapes and arrows
  - `'ly.img.filter.lut'` - LUT effects of various kinds
  - `'ly.img.filter.duotone'` - Color effects of various kinds

  These assets are parsed at \{\{base\_url}}/\<id>/content.json, where
  `base_url` defaults to the engine's configured baseURL. For `@cesdk/node`
  that is the local package (`file://<pkg>/assets/`), which does not bundle
  these sources, so pass a `baseURL` to load them.
  Each source is created via `addLocalSource` and populated with the parsed assets. To modify the available
  assets, you may either exclude certain IDs via `excludeAssetSourceIds` or alter the sources after creation.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: [`DefaultAssetSourceId`](./api/node/type-aliases/defaultassetsourceid.md)\[]; } | Configuration options for loading default asset sources. |
  | `options.baseURL?` | `string` | The source of the asset definitions, must be absolute. Defaults to the engine's configured baseURL. |
  | `options.excludeAssetSourceIds?` | [`DefaultAssetSourceId`](./api/node/type-aliases/defaultassetsourceid.md)\[] | A list of IDs, that will be ignored during load. |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when all asset sources are loaded.

  #### Deprecated

  This method uses legacy v4 asset source IDs and will be removed in a future version.
  Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().

  ***
</details>

<details>
  <summary>
    ### ~~addDemoAssetSources()~~

    <br /><p>Register a set of demo asset sources containing example assets.</p>
  </summary>

  **Note**: These are demonstration assets not meant for production use.

  Available demo asset sources:

  - `'ly.img.image'` - Sample images
  - `'ly.img.image.upload'` - Demo source to upload image assets
  - `'ly.img.audio'` - Sample audios
  - `'ly.img.audio.upload'` - Demo source to upload audio assets
  - `'ly.img.video'` - Sample videos
  - `'ly.img.video.upload'` - Demo source to upload video assets

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: [`DemoAssetSourceId`](./api/node/type-aliases/demoassetsourceid.md)\[]; `sceneMode?`: `"Design"` | `"Video"`; `withUploadAssetSources?`: `boolean`; } | Configuration options for loading demo asset sources. |
  | `options.baseURL?` | `string` | The source of the demo asset definitions, must be absolute. Defaults to the engine's configured baseURL. |
  | `options.excludeAssetSourceIds?` | [`DemoAssetSourceId`](./api/node/type-aliases/demoassetsourceid.md)\[] | A list of IDs, that will be ignored during load |
  | `options.sceneMode?` | `"Design"` | `"Video"` | If 'Video' video specific demo asset sources will be loaded as well (default 'Design') |
  | `options.withUploadAssetSources?` | `boolean` | If 'true' asset sources for uploads are added (default false) |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when all demo asset sources are loaded.

  #### Deprecated

  This method uses legacy v3 demo asset source IDs and will be removed in a future version.
  Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().
</details>

## Other

<details>
  <summary>
    ### version

    <br /><p>The version of the CE.SDK Node package.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### asset
  </summary>

  ```ts
  asset: AssetAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### block
  </summary>

  ```ts
  block: BlockAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### editor
  </summary>

  ```ts
  editor: EditorAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### event
  </summary>

  ```ts
  event: EventAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### scene
  </summary>

  ```ts
  scene: SceneAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### variable
  </summary>

  ```ts
  variable: VariableAPI;
  ```

  ***
</details>

<details>
  <summary>
    ### actions

    <br /><p>Register, run, and discover named, overridable actions. On headless Node the registry
    starts with only the engine-default <code>ly.img.\*</code> actions (no host UI), but the API is
    identical to the browser engine.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### version
  </summary>

  ```ts
  version: string;
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support