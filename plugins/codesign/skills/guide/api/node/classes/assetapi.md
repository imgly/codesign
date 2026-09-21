> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Manage asset sources and apply assets to scenes.

Asset sources provide assets like images, videos, fonts, and other media that can be applied to design blocks.
This API allows registering custom asset sources, querying available assets, and applying them to scenes or specific blocks.
It supports both local and remote asset sources, with extensible middleware for custom asset handling.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>AssetAPI</code></p>
  </summary>
</details>

## Event Subscriptions

Subscribe to asset source changes and lifecycle events.

<details>
  <summary>
    ### onAssetSourceAdded

    <br /><p>Subscribe to asset source addition events.</p>
  </summary>

  ```javascript
  engine.asset.onAssetSourceAdded((sourceID) => {
    console.log(`Added source: ${sourceID}`);
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`sourceID`) => `void` | The function called whenever an asset source is added. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onAssetSourceRemoved

    <br /><p>Subscribe to asset source removal events.</p>
  </summary>

  ```javascript
  engine.asset.onAssetSourceRemoved((sourceID) => {
    console.log(`Removed source: ${sourceID}`);
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`sourceID`) => `void` | The function called whenever an asset source is removed. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onAssetSourceUpdated

    <br /><p>Subscribe to asset source content change events.</p>
  </summary>

  ```javascript
  engine.asset.onAssetSourceUpdated((sourceID) => {
    console.log(`Updated source: ${sourceID}`);
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`sourceID`) => `void` | The function called whenever an asset source's contents are updated. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`
</details>

## Asset Source Management

Register, remove, and query asset sources for different types of media.

<details>
  <summary>
    ### addSource()

    <br /><p>Add a custom asset source with unique ID.</p>
  </summary>

  The asset source provides methods for finding assets, applying them to scenes or blocks,
  and managing asset lifecycle. All source operations are handled asynchronously.

  ```javascript
  engine.asset.addSource({
    id: 'foobar',
    async findAssets(queryData) {
      return Promise.resolve({
        assets: [
          {
            id: 'logo',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/imgly_logo.jpg',
            }
          }
        ],
        total: 1,
        currentPage: queryData.page,
        nextPage: undefined
      });
    },
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `source` | [`AssetSource`](./api/node/interfaces/assetsource.md) | The asset source configuration. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  addSource(source: AssetSource): void
  ```

  ***
</details>

<details>
  <summary>
    ### addLocalSource()

    <br /><p>Add a local asset source.</p>
  </summary>

  Local asset sources allow dynamic asset management through the add/remove methods.
  You can specify supported MIME types to restrict what assets can be added.

  ```javascript
  engine.asset.addLocalSource('local-source');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | Unique identifier for the asset source. |
  | `supportedMimeTypes?` | `string`\[] | The mime types of assets that are allowed to be added to this local source. |
  | `applyAsset?` | (`asset`) => `Promise`\<`number`> | An optional callback that can be used to override the default behavior of applying a given asset result to the active scene. |
  | `applyAssetToBlock?` | (`asset`, `block`) => `Promise`\<`void`> | An optional callback that can be used to override the default behavior of applying an asset result to a given block. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  addLocalSource(id: string, supportedMimeTypes?: string[], applyAsset?: (asset: CompleteAssetResult) => Promise<number>, applyAssetToBlock?: (asset: CompleteAssetResult, block: number) => Promise<void>): void
  ```

  ***
</details>

<details>
  <summary>
    ### addLocalAssetSourceFromJSONString()

    <br /><p>Creates a new local asset source from a JSON string containing asset definitions.</p>
  </summary>

  The JSON structure should contain a `version` field, an `id` field specifying the asset source identifier,
  and an `assets` array with asset definitions. Each asset should have an `id`, localized `label` object,
  and a `meta` object containing asset-specific properties like `uri`, `thumbUri`, `blockType`, etc.

  Optionally, you can provide a `basePath` for resolving relative URLs and additional options including a
  `matcher` array to filter which assets are loaded based on their IDs. The matcher patterns support wildcard
  matching using `*`. If multiple patterns are provided, an asset is included if it matches ANY of the patterns.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `contentJSON` | `string` | The JSON string containing the asset definitions. |
  | `basePath?` | `string` | An optional base path with which \{\{base\_url}} strings in the assets should be replaced. If no value is provided, settings.basePath is used. |
  | `options?` | \{ `matcher?`: `string`\[]; } | Optional configuration: - `matcher`: Array of patterns to filter assets by ID. Supports `*` wildcard. An asset is included if it matches ANY pattern. |
  | `options.matcher?` | `string`\[] | - |

  #### Returns

  `Promise`\<`string`>

  The ID of the newly created asset source (as specified in the JSON's `id` field).

  #### Example

  ```javascript
  // Load all assets from JSON
  const json = JSON.stringify({
    "version": "2.0.0",
    "id": "my.custom.assets",
    "assets": [
      {
        "id": "sample_asset",
        "label": { "en": "Sample Asset" },
        "meta": {
          "uri": "https://example.com/asset.jpg",
          "thumbUri": "https://example.com/thumb.jpg",
          "blockType": "//ly.img.ubq/image"
        }
      }
    ]
  });
  const sourceId = await engine.asset.addLocalAssetSourceFromJSONString(json);
  console.log('Created asset source:', sourceId); // "my.custom.assets"

  // Load with custom base path
  const sourceId2 = await engine.asset.addLocalAssetSourceFromJSONString(
    json,
    'https://example.com/'
  );

  // Load only assets matching one of the patterns
  const sourceId3 = await engine.asset.addLocalAssetSourceFromJSONString(
    json,
    undefined,
    { matcher: ['sample_*', '*_asset'] }
  );

  // Load with custom base path and matcher
  const sourceId4 = await engine.asset.addLocalAssetSourceFromJSONString(
    json,
    'https://example.com/',
    { matcher: ['portrait_*', 'landscape_*'] }
  );
  ```

  #### Signature

  ```typescript
  addLocalAssetSourceFromJSONString(contentJSON: string, basePath?: string, options?: object): Promise<string>
  ```

  ***
</details>

<details>
  <summary>
    ### addLocalAssetSourceFromJSONURI()

    <br /><p>Creates a new local asset source from a JSON URI.</p>
  </summary>

  Loads and parses a JSON file from the specified URI to create an asset source. The JSON structure
  should contain a `version` field, an `id` field specifying the asset source identifier, and an
  `assets` array with asset definitions. The created asset source will have the ID specified in the
  JSON's `id` field, and all assets defined in the JSON will be added to the source.

  Note: The parent directory of the content.json URI will be used as the base path for resolving
  relative URLs in the asset definitions (e.g., `{{base_url}}` placeholders).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `contentURI` | `string` | The URI for the JSON file to load and parse. |
  | `options?` | \{ `matcher?`: `string`\[]; } | Optional configuration: - `matcher`: Array of patterns to filter assets by ID. Supports `*` wildcard. An asset is included if it matches ANY pattern. |
  | `options.matcher?` | `string`\[] | - |

  #### Returns

  `Promise`\<`string`>

  The ID of the newly created asset source (as specified in the JSON's `id` field).

  #### Example

  ```javascript
  // Load all audio assets from IMG.LY's CDN
  const sourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/content.json'
  );
  console.log('Loaded asset source:', sourceId); // "ly.img.audio"

  // Load only assets matching one of the patterns
  const sourceId2 = await engine.asset.addLocalAssetSourceFromJSONURI(
    'https://cdn.img.ly/assets/demo/v3/ly.img.image/content.json',
    { matcher: ['image-portrait-*', 'image-landscape-*'] }
  );
  ```

  #### Signature

  ```typescript
  addLocalAssetSourceFromJSONURI(contentURI: string, options?: object): Promise<string>
  ```

  ***
</details>

<details>
  <summary>
    ### removeSource()

    <br /><p>Remove a registered asset source.</p>
  </summary>

  This permanently removes the asset source and all its associated assets.
  Any ongoing operations with this source will be cancelled.

  ```javascript
  engine.asset.removeSource('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the asset source to remove. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeSource(id: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### findAllSources()

    <br /><p>Get all registered asset source IDs.</p>
  </summary>

  ```javascript
  engine.asset.findAllSources();
  ```

  #### Returns

  `string`\[]

  A list with the IDs of all registered asset sources.

  #### Signature

  ```typescript
  findAllSources(): string[]
  ```
</details>

## Asset Discovery

Search and filter assets from registered sources with advanced query options.

<details>
  <summary>
    ### findAssets()

    <br /><p>Search for assets in a specific source with advanced filtering.</p>
  </summary>

  Supports pagination, text search, tag filtering, grouping, and sorting options.
  Results include asset metadata, thumbnails, and application context.

  ```javascript
  const result = await engine.asset.findAssets('asset-source-id', {
    page: 0,
    perPage: 100
  });
  const asset = result.assets[0];
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |
  | `query` | [`AssetQueryData`](./api/node/interfaces/assetquerydata.md) | Query options to filter and sort the search results. |

  #### Returns

  `Promise`\<[`AssetsQueryResult`](./api/node/interfaces/assetsqueryresult.md)\<[`CompleteAssetResult`](./api/node/interfaces/completeassetresult.md)>>

  Promise resolving to paginated search results.

  #### Signature

  ```typescript
  findAssets(sourceId: string, query: AssetQueryData): Promise<AssetsQueryResult<CompleteAssetResult>>
  ```

  ***
</details>

<details>
  <summary>
    ### fetchAsset()

    <br /><p>Fetch a specific asset by ID from an asset source.</p>
  </summary>

  ```javascript
  const asset = await engine.asset.fetchAsset('asset-source-id', 'asset-id', {
    locale: 'en-US'
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source to search in. |
  | `assetId` | `string` | The ID of the asset to fetch. |
  | `params?` | `Pick`\<[`AssetQueryData`](./api/node/interfaces/assetquerydata.md), `"locale"`> | Query parameters including locale (optional). |

  #### Returns

  `Promise`\<[`CompleteAssetResult`](./api/node/interfaces/completeassetresult.md)>

  Promise resolving to the complete asset result, or undefined if not found.

  #### Signature

  ```typescript
  fetchAsset(sourceId: string, assetId: string, params?: Pick<AssetQueryData, "locale">): Promise<CompleteAssetResult>
  ```
</details>

## Asset Information

Retrieve metadata, credits, licenses, and supported formats from asset sources.

<details>
  <summary>
    ### getGroups()

    <br /><p>Get available asset groups from a source.</p>
  </summary>

  Groups provide categorization for assets within a source, enabling filtered discovery.

  ```javascript
  const groups = engine.asset.getGroups(customSource.id);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the asset source. |

  #### Returns

  `Promise`\<`string`\[]>

  Promise resolving to list of available group names.

  #### Signature

  ```typescript
  getGroups(id: string): Promise<string[]>
  ```

  ***
</details>

<details>
  <summary>
    ### getSupportedMimeTypes()

    <br /><p>Get supported MIME types for an asset source.</p>
  </summary>

  Returns the file types that can be added to this source. An empty result means all MIME types are supported.

  ```javascript
  const mimeTypes = engine.asset.getSupportedMimeTypes('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |

  #### Returns

  `string`\[]

  Array of supported MIME type strings.

  #### Signature

  ```typescript
  getSupportedMimeTypes(sourceId: string): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### getCredits()

    <br /><p>Get attribution credits for an asset source.</p>
  </summary>

  ```javascript
  const credits = engine.asset.getCredits('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |

  #### Returns

  `object`

  The asset source's credits info consisting of a name and an optional URL.

  | Name | Type |
  | ------ | ------ |
  | `name` | `string` |
  | `url` | `string` |

  #### Signature

  ```typescript
  getCredits(sourceId: string): object
  ```

  ***
</details>

<details>
  <summary>
    ### getLicense()

    <br /><p>Get license information for an asset source.</p>
  </summary>

  ```javascript
  const license = engine.asset.getLicense('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |

  #### Returns

  `object`

  The asset source's license info consisting of a name and an optional URL.

  | Name | Type |
  | ------ | ------ |
  | `name` | `string` |
  | `url` | `string` |

  #### Signature

  ```typescript
  getLicense(sourceId: string): object
  ```

  ***
</details>

<details>
  <summary>
    ### canManageAssets()

    <br /><p>Check if an asset source supports asset management.</p>
  </summary>

  Returns true if the source allows adding and removing assets dynamically, via 'Add File' and 'Delete' button on the UI.
  This is typically true for local asset sources and false for remote sources.

  ```javascript
  engine.asset.canManageAssets('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source to check. |

  #### Returns

  `boolean`

  True if the source supports asset management operations.

  #### Signature

  ```typescript
  canManageAssets(sourceId: string): boolean
  ```
</details>

## Asset Application

Apply assets to scenes, blocks, or specific properties with customizable behavior.

<details>
  <summary>
    ### registerApplyMiddleware()

    <br /><p>Register middleware that intercepts asset application to scenes.</p>
  </summary>

  The middleware function receives the source ID, asset result, the original apply function,
  and a context object containing options about how the asset should be applied.
  It can perform custom logic before, after, or instead of the default asset application.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `middleware` | (`sourceId`, `assetResult`, `apply`, `context`) => `Promise`\<`number`> | The middleware function that is called before applying the asset. |

  #### Returns

  `VoidFunction`

  A function that can be used to remove the middleware.

  #### Example

  ```ts
  engine.asset.registerApplyMiddleware(async (sourceId, assetResult, apply, context) => {
    // Access context to determine placement intent
    console.log('Clip type:', context.clipType); // 'clip', 'overlay', or undefined
    console.log('Custom data:', context.myCustomField); // Access custom fields

    // do something before applying the asset
    // You still have the choice to call apply or skip it
    const blockId = await apply(sourceId, assetResult);
    // do something after applying the asset
    return blockId;
  })
  ```

  #### Signature

  ```typescript
  registerApplyMiddleware(middleware: (sourceId: string, assetResult: AssetResult, apply: (sourceId: string, assetResult: AssetResult, options: ApplyAssetOptions) => Promise<number>, context: ApplyAssetOptions) => Promise<number>): VoidFunction
  ```

  ***
</details>

<details>
  <summary>
    ### registerApplyToBlockMiddleware()

    <br /><p>Register middleware that intercepts asset application to specific blocks.</p>
  </summary>

  The middleware function receives the source ID, asset result, target block, and the original apply function.
  It can perform custom logic before, after, or instead of the default block asset application.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `middleware` | (`sourceId`, `assetResult`, `block`, `applyToBlock`) => `Promise`\<`void`> | The middleware function that is called before applying the asset. |

  #### Returns

  `VoidFunction`

  A function that can be used to remove the middleware.

  #### Example

  ```ts
  engine.asset.registerApplyToBlockMiddleware(async (sourceId, assetResult, block, applyToBlock) => {
    // do something before applying the asset
    // You still have the choice to call applyToBlock or skip it
    await applyToBlock(sourceId, assetResult, block);
    // do something after applying the asset
  })
  ```

  #### Signature

  ```typescript
  registerApplyToBlockMiddleware(middleware: (sourceId: string, assetResult: AssetResult, block: number, applyToBlock: (sourceId: string, assetResult: AssetResult, block: number) => Promise<void>) => Promise<void>): VoidFunction
  ```

  ***
</details>

<details>
  <summary>
    ### apply()

    <br /><p>Apply an asset to the active scene.</p>
  </summary>

  Creates a new block configured according to the asset's properties and adds it to the scene.
  The behavior can be customized by providing an `applyAsset` function when registering the asset source,
  or by passing context options to guide middleware behavior.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |
  | `assetResult` | [`AssetResult`](./api/node/interfaces/assetresult.md) | A single asset result from a `findAssets` query. |
  | `options?` | [`ApplyAssetOptions`](./api/node/interfaces/applyassetoptions.md) | Optional configuration for asset application. |

  #### Returns

  `Promise`\<`number`>

  Promise resolving to the created block ID, or undefined if no block was created.

  #### Examples

  ```javascript
  // Default behavior
  await engine.asset.apply('asset-source-id', assetResult.assets[0]);
  ```

  ```javascript
  // Foreground overlay placement
  await engine.asset.apply('asset-source-id', assetResult.assets[0], {
    clipType: 'overlay'
  });
  ```

  #### Signature

  ```typescript
  apply(sourceId: string, assetResult: AssetResult, options?: ApplyAssetOptions): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### applyToBlock()

    <br /><p>Apply an asset to a specific block.</p>
  </summary>

  Modifies the target block's properties according to the asset's configuration.
  The behavior can be customized by providing an `applyAssetToBlock` function when registering the asset source.

  ```javascript
  await engine.asset.applyToBlock('asset-source-id', assetResult.assets[0]);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |
  | `assetResult` | [`AssetResult`](./api/node/interfaces/assetresult.md) | A single asset result from a `findAssets` query. |
  | `block` | `number` | The block to apply the asset to. |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  applyToBlock(sourceId: string, assetResult: AssetResult, block: number): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### applyProperty()

    <br /><p>Apply a specific asset property to the currently selected element.</p>
  </summary>

  Allows applying individual properties (like colors, fonts, or effects) from an asset
  without creating a new block. The behavior can be customized by providing an `applyAssetProperty` function.

  ```javascript
  const asset = assetResult.assets[0];
  if (asset.payload && asset.payload.properties) {
    for (const property of asset.payload.properties) {
      await engine.asset.applyProperty('asset-source-id', asset, property);
    }
  }
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The ID of the asset source. |
  | `assetResult` | [`AssetResult`](./api/node/interfaces/assetresult.md) | A single asset result from a `findAssets` query. |
  | `property` | [`AssetProperty`](./api/node/type-aliases/assetproperty.md) | The specific asset property to apply. |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  applyProperty(sourceId: string, assetResult: AssetResult, property: AssetProperty): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### defaultApplyAsset()

    <br /><p>Apply an asset using the engine's default implementation.</p>
  </summary>

  The default implementation already handles various different kinds of assets and acts as a good starting point.

  ```javascript
  engine.asset.addSource({
    id: 'foobar',
    async findAssets(queryData) {
      return Promise.resolve({
        assets: [
          {
            id: 'logo',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/imgly_logo.jpg',
            }
          }
        ],
        total: 1,
        currentPage: queryData.page,
        nextPage: undefined
      });
    },
    async applyAsset(assetResult) {
      return engine.asset.defaultApplyAsset(assetResult);
    },
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `assetResult` | [`AssetResult`](./api/node/interfaces/assetresult.md) | A single asset result from a `findAssets` query. |

  #### Returns

  `Promise`\<`number`>

  Promise resolving to the created block ID, or undefined if no block was created.

  #### Signature

  ```typescript
  defaultApplyAsset(assetResult: AssetResult): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### defaultApplyAssetToBlock()

    <br /><p>Apply an asset to a block using the engine's default implementation.</p>
  </summary>

  The default implementation already handles various different kinds of assets and acts as a good starting point.

  ```javascript
  engine.asset.addSource({
    id: 'foobar',
    async findAssets(queryData) {
      return Promise.resolve({
        assets: [
          {
            id: 'logo',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/imgly_logo.jpg',
            }
          }
        ],
        total: 1,
        currentPage: queryData.page,
        nextPage: undefined
      });
    },
    async applyAssetToBlock(assetResult, block) {
      engine.asset.defaultApplyAssetToBlock(assetResult, block);
    },
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `assetResult` | [`AssetResult`](./api/node/interfaces/assetresult.md) | A single asset result from a `findAssets` query. |
  | `block` | `number` | The block to apply the asset to. |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  defaultApplyAssetToBlock(assetResult: AssetResult, block: number): Promise<void>
  ```
</details>

## Asset Lifecycle

Add, remove, and manage assets within local asset sources.

<details>
  <summary>
    ### addAssetToSource()

    <br /><p>Add an asset to a local asset source.</p>
  </summary>

  Only works with local asset sources that support asset management.
  The asset will be validated against the source's supported MIME types.

  ```javascript
  engine.asset.addAssetToSource('local-source', {
    id: 'asset-id',
    label: {
      en: 'My Asset'
    },
    meta: {
      uri: 'https://example.com/asset.jpg',
      mimeType: 'image/jpeg'
    }
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The local asset source ID that the asset should be added to. |
  | `asset` | [`AssetDefinition`](./api/node/interfaces/assetdefinition.md) | The asset definition to add to the source. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  addAssetToSource(sourceId: string, asset: AssetDefinition): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeAssetFromSource()

    <br /><p>Remove an asset from a local asset source.</p>
  </summary>

  Only works with local asset sources that support asset management.
  The asset will be permanently deleted from the source.

  ```javascript
  engine.asset.removeAssetFromSource('local-source', 'asset-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId` | `string` | The id of the local asset source that currently contains the asset. |
  | `assetId` | `string` | The id of the asset to be removed. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeAssetFromSource(sourceId: string, assetId: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### assetSourceContentsChanged()

    <br /><p>Notify the engine that an asset source's contents have changed.</p>
  </summary>

  This triggers refresh of any UI components that display assets from this source
  and notifies subscribers to the asset source update events.

  ```javascript
  engine.asset.assetSourceContentsChanged('asset-source-id');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceID` | `string` | The asset source whose contents changed. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  assetSourceContentsChanged(sourceID: string): void
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support