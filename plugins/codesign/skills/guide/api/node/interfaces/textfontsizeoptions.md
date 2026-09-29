> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for text font size operations with unit support.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `unit?` | [`FontSizeUnit`](./api/node/type-aliases/fontsizeunit.md) | The unit of the font size. Defaults to the scene's `fontSizeUnit` (configured via `engine.scene.setFontSizeUnit()`), which itself defaults to `'Point'`. |
|  `from?` | `number` | The start index of the UTF-16 range. Defaults to -1 (start of selection/text) |
|  `to?` | `number` | The end index of the UTF-16 range. Defaults to -1 (end of selection/text) |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support