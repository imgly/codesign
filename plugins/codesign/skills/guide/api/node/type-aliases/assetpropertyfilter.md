> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetPropertyFilter = object & 
  | {
  contains: string;
  equals?: never;
}
  | {
  equals: string;
  contains?: never;
};
```

A single property predicate. Exactly one of `contains` (case-insensitive
substring) or `equals` (case-insensitive equality) must be set — the
type forbids passing both or neither. On a string-array property
(`tags`, `groups`), the operator matches if any element matches.
`meta.<key>` values are flat strings, compared whole.

If a meta value was originally serialized as a number or boolean,
stringify it the same way before comparing.

## Type Declaration

| Name | Type |
| ------ | ------ |
| `property` | [`AssetPropertyPath`](./api/node/type-aliases/assetpropertypath.md) |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support