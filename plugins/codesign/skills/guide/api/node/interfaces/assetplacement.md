> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Where the block created from an asset is placed.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `parent?` | `number` | The block that the new block is added to. Omit it to use the current page. |
|  `center?` | `object` | The center of the new block, in design units relative to `parent`. Both values must be finite. Omit it to place the block automatically. |
| `center.x` | `number` | - |
| `center.y` | `number` | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support