> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A source of assets

## Methods

### findAssets()

```ts
findAssets(queryData): Promise<AssetsQueryResult<AssetResult>>;
```

Find all asset for the given type and the provided query data.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queryData` | [`AssetQueryData`](./api/node/interfaces/assetquerydata.md) |

#### Returns

`Promise`\<[`AssetsQueryResult`](./api/node/interfaces/assetsqueryresult.md)\<[`AssetResult`](./api/node/interfaces/assetresult.md)>>

***

### addAsset()?

```ts
optional addAsset(asset): void;
```

Adds the given asset to this source. Throws an error if the asset source
does not support adding assets.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `asset` | [`AssetDefinition`](./api/node/interfaces/assetdefinition.md) |

#### Returns

`void`

***

### removeAsset()?

```ts
optional removeAsset(assetId): void;
```

Removes the given asset from this source.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `assetId` | `string` |

#### Returns

`void`

***

### getSupportedMimeTypes()?

```ts
optional getSupportedMimeTypes(): string[];
```

Generates a list of supported mime types for this source.

#### Returns

`string`\[]

a list of the mime types should be supported by this source

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `id` | `string` | The unique id of the API |
|  `fetchAsset?` | (`id`, `params?`) => `Promise`\<[`AssetResult`](./api/node/interfaces/assetresult.md)> | Fetch an asset by id. |
|  `getGroups?` | () => `Promise`\<`string`\[]> | Return every available group |
|  `credits?` | `object` | Credits for the source/api |
| `credits.name` | `string` | - |
| `credits.url?` | `string` | - |
|  `license?` | `object` | General license for all asset from this source |
| `license.name` | `string` | - |
| `license.url?` | `string` | - |
|  ~~`canManageAssets?`~~ | `boolean` | Can the source add and remove assets dynamically? If `false` methods like `addAsset` and `removeAsset` will throw an error. **Deprecated** Will be removed in v1.11. Use `canAdd` and `canRemove` in the asset library configuration |
|  `applyAsset?` | (`asset`) => `Promise`\<`number`> | Apply the given asset result to the active scene. You can override this with custom behavior. |
|  `applyAssetToBlock?` | (`asset`, `block`) => `Promise`\<`void`> | Apply the given asset result to the given block. You can override this with custom behavior. |
|  `applyAssetProperty?` | (`asset`, `property`) => `Promise`\<`void`> | Apply a property of the given asset result to the active scene. You can override this with custom behavior. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support