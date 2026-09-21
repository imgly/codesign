> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A single color extracted from the rendered appearance of a block.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `r` | `number` | Red component in sRGB, normalized to the range \[0, 1]. |
|  `g` | `number` | Green component in sRGB, normalized to the range \[0, 1]. |
|  `b` | `number` | Blue component in sRGB, normalized to the range \[0, 1]. |
|  `weight` | `number` | Share of analyzed pixels represented by this color, in the range \[0, 1]. Higher values indicate a more prominent color. The sum of weights returned by a single `BlockAPI.getDominantColors` call is `1.0`. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support