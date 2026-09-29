> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for `BlockAPI.getDominantColors`.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `count?` | `number` | `5` | Number of dominant colors to extract. The returned palette may contain fewer entries for images with very little variation, and is empty when `count` is `0`. |
|  `ignoreWhite?` | `boolean` | `false` | If `true`, near-white pixels are excluded from the analysis. Useful when analyzing images on white backgrounds to avoid the background dominating the result. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support