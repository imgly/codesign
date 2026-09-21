> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Defines a request for querying assets

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `query?` | `string` | A query string used for (fuzzy) searching of labels and tags |
|  `page` | `number` | The current page queried for paginated views. |
|  `tags?` | `string` | `string`\[] | Tags are searched with the query parameter, but this search is fuzzy. If one needs to get assets with exactly the tag (from a tag cloud or filter) this query parameter should be used. |
|  `groups?` | [`AssetGroups`](./api/node/type-aliases/assetgroups.md) | Query only these groups |
|  `excludeGroups?` | [`AssetGroups`](./api/node/type-aliases/assetgroups.md) | Filter out assets with this groups |
|  `locale?` | `string` | Choose the locale of the labels and tags for localized search and filtering. For local asset sources, labels and tags are resolved using a fallback chain: requested locale → "en" → first available entry → empty default. |
|  `perPage` | `number` | The number of results queried. How many assets shall be returned regardless of the total number of assets available. Together with `page` this can be used for pagination. |
|  `sortingOrder?` | [`SortingOrder`](./api/node/type-aliases/sortingorder.md) | The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source. |
|  `sortKey?` | `string` | The key that identifies the meta data value to sort by or 'id' to sort by the asset ID. If empty, the assets are sorted by the index. |
|  `sortActiveFirst?` | `boolean` | Sort assets that are marked as active first. |
|  `filter?` | [`AssetFilter`](./api/node/type-aliases/assetfilter.md)\[] | Optional structured filter, AND-combined with the result of `query` / `tags` / `groups` / `excludeGroups`. The top-level array is an implicit AND of its entries. Each entry is either a property predicate (`{ property, contains?, equals? }`) or a logical combinator (`{ and: [...] }`, `{ or: [...] }`, `{ not: ... }`). Combinators nest. **When to use `filter` vs `tags` / `groups` / `excludeGroups`:** The legacy `tags` / `groups` / `excludeGroups` fields remain supported and are equivalent to filter predicates with `equals` and implicit AND. Prefer `filter` for anything beyond a plain include/ exclude list — case-insensitive substrings, `meta.<key>` matches, `or` / `not` combinators — and reach for the legacy fields only when you want their case-sensitive exact-match semantics. Malformed filters reject the returned promise with the engine's parse-error message (e.g. `"Unknown asset property '…'"`). **Example** `filter: [ { property: 'label', contains: 'Roboto' }, { property: 'meta.languages', contains: 'de' }, { not: { property: 'meta.legacy', equals: 'true' } } ]` |
|  `facets?` | [`AssetFacetPath`](./api/node/type-aliases/assetfacetpath.md)\[] | Facet distributions to compute over the matched (pre-pagination) set, e.g. to populate filter dropdowns. Local sources compute facets automatically; custom sources may fulfill any subset of the request. Combine with `perPage: 0` to enumerate values without fetching assets. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support