> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Return type of a `findAssets` query.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`AssetResult`](./api/node/interfaces/assetresult.md) | [`AssetResult`](./api/node/interfaces/assetresult.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `assets` | `T`\[] | The assets in the requested page |
|  `currentPage` | `number` | The current, requested page |
|  `nextPage?` | `number` | The next page to query if it exists |
|  `total` | `number` | How many assets are there in total for the current query regardless of the page |
|  `facets?` | `object` | Distributions for the requested facet paths, keyed by the exact requested path string. Ordered by count descending, ties by value ascending. A missing key signals the source did not compute that facet. Absent entirely when no facets were requested or none were computed. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support