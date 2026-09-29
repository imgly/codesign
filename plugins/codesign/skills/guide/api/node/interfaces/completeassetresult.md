> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Asset results that are returned from the engine.

They contain additional information about the context of the asset.

## Extends

- [`AssetResult`](./api/node/interfaces/assetresult.md)

## Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `id` | `string` | The unique id of this asset. | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`id`](./api/node/interfaces/assetresult.md) |
|  `groups?` | [`AssetGroups`](./api/node/type-aliases/assetgroups.md) | Groups of the asset. | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`groups`](./api/node/interfaces/assetresult.md) |
|  `meta?` | [`AssetMetaData`](./api/node/type-aliases/assetmetadata.md) | Asset-specific and custom meta information | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`meta`](./api/node/interfaces/assetresult.md) |
|  `payload?` | [`AssetPayload`](./api/node/interfaces/assetpayload.md) | Structured asset-specific data | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`payload`](./api/node/interfaces/assetresult.md) |
|  `locale?` | `string` | The locale of the label and tags | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`locale`](./api/node/interfaces/assetresult.md) |
|  `label?` | `string` | The label of the result. Used for description and tooltips. | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`label`](./api/node/interfaces/assetresult.md) |
|  `tags?` | `string`\[] | The tags of this asset. Used for filtering and free-text searching. | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`tags`](./api/node/interfaces/assetresult.md) |
|  `credits?` | `object` | Credits for the artist of the asset | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`credits`](./api/node/interfaces/assetresult.md) |
| `credits.name` | `string` | - | - | - |
| `credits.url?` | `string` | - | - | - |
|  `license?` | `object` | License for this asset. Overwrites the source license if present | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`license`](./api/node/interfaces/assetresult.md) |
| `license.name` | `string` | - | - | - |
| `license.url?` | `string` | - | - | - |
|  `utm?` | `object` | UTM parameters for the links inside the credits | - | [`AssetResult`](./api/node/interfaces/assetresult.md).[`utm`](./api/node/interfaces/assetresult.md) |
| `utm.source?` | `string` | - | - | - |
| `utm.medium?` | `string` | - | - | - |
|  `context` | `object` | Context how an asset was added or shall be used in the future. This is added to all assets coming from the engine. | - | - |
| `context.sourceId` | `string` | - | - | - |
|  `active` | `boolean` | This is optional in `AssetResult` but always present here | [`AssetResult`](./api/node/interfaces/assetresult.md).[`active`](./api/node/interfaces/assetresult.md) | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support