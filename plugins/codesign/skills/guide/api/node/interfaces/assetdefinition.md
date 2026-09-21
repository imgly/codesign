> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Definition of an asset used if an asset is added to an asset source.

## Extends

- [`Asset`](./api/node/interfaces/asset.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | `string` | The unique id of this asset. | [`Asset`](./api/node/interfaces/asset.md).[`id`](./api/node/interfaces/asset.md) |
|  `groups?` | [`AssetGroups`](./api/node/type-aliases/assetgroups.md) | Groups of the asset. | [`Asset`](./api/node/interfaces/asset.md).[`groups`](./api/node/interfaces/asset.md) |
|  `meta?` | [`AssetMetaData`](./api/node/type-aliases/assetmetadata.md) | Asset-specific and custom meta information | [`Asset`](./api/node/interfaces/asset.md).[`meta`](./api/node/interfaces/asset.md) |
|  `payload?` | [`AssetPayload`](./api/node/interfaces/assetpayload.md) | Structured asset-specific data | [`Asset`](./api/node/interfaces/asset.md).[`payload`](./api/node/interfaces/asset.md) |
|  `label?` | `Record`\<[`Locale`](./api/node/type-aliases/locale.md), `string`> | Label used to display in aria-label and as a tooltip. Will be also searched in a query and should be localized | - |
|  `tags?` | `Record`\<[`Locale`](./api/node/type-aliases/locale.md), `string`\[]> | Tags for this asset. Can be used for filtering, but is also useful for free-text search. Since the label is searched as well as used for tooltips you do not want to overdo it, but still add things which are searched. Thus, it should be localized similar to the `label`. | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support