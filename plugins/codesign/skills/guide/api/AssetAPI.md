# AssetAPI

## Asset Application

### registerApplyMiddleware()

Register middleware that intercepts asset application to scenes.
The middleware function receives the source ID, asset result, the original apply function,
and a context object containing options about how the asset should be applied.
It can perform custom logic before, after, or instead of the default asset application.

```typescript
registerApplyMiddleware(middleware: (sourceId: string, assetResult: AssetResult, apply: AssetAPI['apply'], context: ApplyAssetOptions) => Promise<DesignBlockId | undefined>): VoidFunction
```

**Parameters:**
- `middleware` - The middleware function that is called before applying the asset.

**Returns:** A function that can be used to remove the middleware.

### registerApplyToBlockMiddleware()

Register middleware that intercepts asset application to specific blocks.
The middleware function receives the source ID, asset result, target block, and the original apply function.
It can perform custom logic before, after, or instead of the default block asset application.

```typescript
registerApplyToBlockMiddleware(middleware: (sourceId: string, assetResult: AssetResult, block: DesignBlockId, applyToBlock: AssetAPI['applyToBlock']) => Promise<void>): VoidFunction
```

**Parameters:**
- `middleware` - The middleware function that is called before applying the asset.

**Returns:** A function that can be used to remove the middleware.

### apply()

Apply an asset to the active scene.
Creates a new block configured according to the asset's properties and adds it to the scene.
The behavior can be customized by providing an `applyAsset` function when registering the asset source,
or by passing context options to guide middleware behavior.

```typescript
apply(sourceId: string, assetResult: AssetResult, options?: ApplyAssetOptions): Promise<DesignBlockId | undefined>
```

**Parameters:**
- `sourceId` - The ID of the asset source.
- `assetResult` - A single asset result from a `findAssets` query.
- `options` - Optional configuration for asset application.

**Returns:** Promise resolving to the created block ID, or undefined if no block was created.

### applyToBlock()

Apply an asset to a specific block.
Modifies the target block's properties according to the asset's configuration.
The behavior can be customized by providing an `applyAssetToBlock` function when registering the asset source.
```javascript
await engine.asset.applyToBlock('asset-source-id', assetResult.assets[0]);
```

```typescript
applyToBlock(sourceId: string, assetResult: AssetResult, block: DesignBlockId): Promise<void>
```

**Parameters:**
- `sourceId` - The ID of the asset source.
- `assetResult` - A single asset result from a `findAssets` query.
- `block` - The block to apply the asset to.

### applyProperty()

Apply a specific asset property to the currently selected element.
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

```typescript
applyProperty(sourceId: string, assetResult: AssetResult, property: AssetProperty): Promise<void>
```

**Parameters:**
- `sourceId` - The ID of the asset source.
- `assetResult` - A single asset result from a `findAssets` query.
- `property` - The specific asset property to apply.

### defaultApplyAsset()

Apply an asset using the engine's default implementation.
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

```typescript
defaultApplyAsset(assetResult: AssetResult): Promise<DesignBlockId | undefined>
```

**Parameters:**
- `assetResult` - A single asset result from a `findAssets` query.

**Returns:** Promise resolving to the created block ID, or undefined if no block was created.

### defaultApplyAssetToBlock()

Apply an asset to a block using the engine's default implementation.
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

```typescript
defaultApplyAssetToBlock(assetResult: AssetResult, block: DesignBlockId): Promise<void>
```

**Parameters:**
- `assetResult` - A single asset result from a `findAssets` query.
- `block` - The block to apply the asset to.

## Asset Source Management

### addSource()

Add a custom asset source with unique ID.
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

```typescript
addSource(source: AssetSource): void
```

**Parameters:**
- `source` - The asset source configuration.

### addLocalSource()

Add a local asset source.
Local asset sources allow dynamic asset management through the add/remove methods.
You can specify supported MIME types to restrict what assets can be added.
```javascript
engine.asset.addLocalSource('local-source');
```

```typescript
addLocalSource(id: string, supportedMimeTypes?: string[], applyAsset?: (asset: CompleteAssetResult) => Promise<DesignBlockId | undefined>, applyAssetToBlock?: (asset: CompleteAssetResult, block: DesignBlockId) => Promise<void>): void
```

**Parameters:**
- `id` - Unique identifier for the asset source.
- `supportedMimeTypes` - The mime types of assets that are allowed to be added to this local source.
- `applyAsset` - An optional callback that can be used to override the default behavior of applying a given asset result to the active scene.
- `applyAssetToBlock` - An optional callback that can be used to override the default behavior of applying an asset result to a given block.

### addLocalAssetSourceFromJSONString()

Creates a new local asset source from a JSON string containing asset definitions.
The JSON structure should contain a `version` field, an `id` field specifying the asset source identifier,
and an `assets` array with asset definitions. Each asset should have an `id`, localized `label` object,
and a `meta` object containing asset-specific properties like `uri`, `thumbUri`, `blockType`, etc.
Optionally, you can provide a `basePath` for resolving relative URLs and additional options including a
`matcher` array to filter which assets are loaded based on their IDs. The matcher patterns support wildcard
matching using `*`. If multiple patterns are provided, an asset is included if it matches ANY of the patterns.

```typescript
addLocalAssetSourceFromJSONString(contentJSON: string, basePath?: string, options?: {
        matcher?: string[];
    }): Promise<string>
```

**Parameters:**
- `contentJSON` - The JSON string containing the asset definitions.
- `basePath` - An optional base path with which \{\{base_url\}\} strings in the assets should be replaced. If no value is provided, settings.basePath is used.
- `options` - Optional configuration:
  - `matcher`: Array of patterns to filter assets by ID. Supports `*` wildcard. An asset is included if it matches ANY pattern.

**Returns:** The ID of the newly created asset source (as specified in the JSON's `id` field).

### addLocalAssetSourceFromJSONURI()

Creates a new local asset source from a JSON URI.
Loads and parses a JSON file from the specified URI to create an asset source. The JSON structure
should contain a `version` field, an `id` field specifying the asset source identifier, and an
`assets` array with asset definitions. The created asset source will have the ID specified in the
JSON's `id` field, and all assets defined in the JSON will be added to the source.
Note: The parent directory of the content.json URI will be used as the base path for resolving
relative URLs in the asset definitions (e.g., `{{base_url}}` placeholders).

```typescript
addLocalAssetSourceFromJSONURI(contentURI: string, options?: {
        matcher?: string[];
    }): Promise<string>
```

**Parameters:**
- `contentURI` - The URI for the JSON file to load and parse.
- `options` - Optional configuration:
  - `matcher`: Array of patterns to filter assets by ID. Supports `*` wildcard. An asset is included if it matches ANY pattern.

**Returns:** The ID of the newly created asset source (as specified in the JSON's `id` field).

### removeSource()

Remove a registered asset source.
This permanently removes the asset source and all its associated assets.
Any ongoing operations with this source will be cancelled.
```javascript
engine.asset.removeSource('asset-source-id');
```

```typescript
removeSource(id: string): void
```

**Parameters:**
- `id` - The ID of the asset source to remove.

### findAllSources()

Get all registered asset source IDs.
```javascript
engine.asset.findAllSources();
```

```typescript
findAllSources(): string[]
```

**Returns:** A list with the IDs of all registered asset sources.

## Asset Discovery

### findAssets()

Search for assets in a specific source with advanced filtering.
Supports pagination, text search, tag filtering, grouping, and sorting options.
Results include asset metadata, thumbnails, and application context.
```javascript
const result = await engine.asset.findAssets('asset-source-id', {
  page: 0,
  perPage: 100
});
const asset = result.assets[0];
```

```typescript
findAssets(sourceId: string, query: AssetQueryData): Promise<AssetsQueryResult<CompleteAssetResult>>
```

**Parameters:**
- `sourceId` - The ID of the asset source.
- `query` - Query options to filter and sort the search results.

**Returns:** Promise resolving to paginated search results.

### fetchAsset()

Fetch a specific asset by ID from an asset source.
```javascript
const asset = await engine.asset.fetchAsset('asset-source-id', 'asset-id', {
  locale: 'en-US'
});
```

```typescript
fetchAsset(sourceId: string, assetId: string, params?: Pick<AssetQueryData, 'locale'>): Promise<CompleteAssetResult | null>
```

**Parameters:**
- `sourceId` - The ID of the asset source to search in.
- `assetId` - The ID of the asset to fetch.
- `params` - Query parameters including locale (optional).

**Returns:** Promise resolving to the complete asset result, or undefined if not found.

## Asset Information

### getGroups()

Get available asset groups from a source.
Groups provide categorization for assets within a source, enabling filtered discovery.
```javascript
const groups = engine.asset.getGroups(customSource.id);
```

```typescript
getGroups(id: string): Promise<string[]>
```

**Parameters:**
- `id` - The ID of the asset source.

**Returns:** Promise resolving to list of available group names.

### getSupportedMimeTypes()

Get supported MIME types for an asset source.
Returns the file types that can be added to this source. An empty result means all MIME types are supported.
```javascript
const mimeTypes = engine.asset.getSupportedMimeTypes('asset-source-id');
```

```typescript
getSupportedMimeTypes(sourceId: string): string[]
```

**Parameters:**
- `sourceId` - The ID of the asset source.

**Returns:** Array of supported MIME type strings.

### getCredits()

Get attribution credits for an asset source.
```javascript
const credits = engine.asset.getCredits('asset-source-id');
```

```typescript
getCredits(sourceId: string): {
        name: string;
        url: string | undefined;
    } | undefined
```

**Parameters:**
- `sourceId` - The ID of the asset source.

**Returns:** The asset source's credits info consisting of a name and an optional URL.

### getLicense()

Get license information for an asset source.
```javascript
const license = engine.asset.getLicense('asset-source-id');
```

```typescript
getLicense(sourceId: string): {
        name: string;
        url: string | undefined;
    } | undefined
```

**Parameters:**
- `sourceId` - The ID of the asset source.

**Returns:** The asset source's license info consisting of a name and an optional URL.

### canManageAssets()

Check if an asset source supports asset management.
Returns true if the source allows adding and removing assets dynamically, via 'Add File' and 'Delete' button on the UI.
This is typically true for local asset sources and false for remote sources.
```javascript
engine.asset.canManageAssets('asset-source-id');
```

```typescript
canManageAssets(sourceId: string): boolean
```

**Parameters:**
- `sourceId` - The ID of the asset source to check.

**Returns:** True if the source supports asset management operations.

## Asset Lifecycle

### addAssetToSource()

Add an asset to a local asset source.
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

```typescript
addAssetToSource(sourceId: string, asset: AssetDefinition): void
```

**Parameters:**
- `sourceId` - The local asset source ID that the asset should be added to.
- `asset` - The asset definition to add to the source.

### removeAssetFromSource()

Remove an asset from a local asset source.
Only works with local asset sources that support asset management.
The asset will be permanently deleted from the source.
```javascript
engine.asset.removeAssetFromSource('local-source', 'asset-id');
```

```typescript
removeAssetFromSource(sourceId: string, assetId: string): void
```

**Parameters:**
- `sourceId` - The id of the local asset source that currently contains the asset.
- `assetId` - The id of the asset to be removed.

### assetSourceContentsChanged()

Notify the engine that an asset source's contents have changed.
This triggers refresh of any UI components that display assets from this source
and notifies subscribers to the asset source update events.
```javascript
engine.asset.assetSourceContentsChanged('asset-source-id');
```

```typescript
assetSourceContentsChanged(sourceID: string): void
```

**Parameters:**
- `sourceID` - The asset source whose contents changed.

## Event Subscriptions

Subscribe to asset source changes and lifecycle events.

### onAssetSourceAdded()

Subscribe to asset source addition events.
```javascript
engine.asset.onAssetSourceAdded((sourceID) => {
  console.log(`Added source: ${sourceID}`);
});
```

```typescript
onAssetSourceAdded(callback: (sourceID: string) => void): (() => void)
```

**Parameters:**
- `callback` - The function called whenever an asset source is added.

**Returns:** A method to unsubscribe from the event.

### onAssetSourceRemoved()

Subscribe to asset source removal events.
```javascript
engine.asset.onAssetSourceRemoved((sourceID) => {
  console.log(`Removed source: ${sourceID}`);
});
```

```typescript
onAssetSourceRemoved(callback: (sourceID: string) => void): (() => void)
```

**Parameters:**
- `callback` - The function called whenever an asset source is removed.

**Returns:** A method to unsubscribe from the event.

### onAssetSourceUpdated()

Subscribe to asset source content change events.
```javascript
engine.asset.onAssetSourceUpdated((sourceID) => {
  console.log(`Updated source: ${sourceID}`);
});
```

```typescript
onAssetSourceUpdated(callback: (sourceID: string) => void): (() => void)
```

**Parameters:**
- `callback` - The function called whenever an asset source's contents are updated.

**Returns:** A method to unsubscribe from the event.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).