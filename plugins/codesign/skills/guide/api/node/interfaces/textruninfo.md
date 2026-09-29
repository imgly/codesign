> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a single contiguous text run with uniform formatting.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `from` | `number` | Start grapheme index (inclusive). |
|  `to` | `number` | End grapheme index (exclusive). |
|  `text` | `string` | The text content of this run. |
|  `color` | [`Color`](./api/node/type-aliases/color.md) | The text color. |
|  `fontWeight` | [`FontWeight`](./api/node/type-aliases/fontweight.md) | The font weight. |
|  `fontStyle` | [`FontStyle`](./api/node/type-aliases/fontstyle.md) | The font style. |
|  `fontSize` | `number` | The font size in points. |
|  `textCase` | [`TextCase`](./api/node/type-aliases/textcase.md) | The text case transformation. |
|  `typeface` | [`Typeface`](./api/node/interfaces/typeface.md) | The typeface used by this run. |
|  `resolvedFontFileUri` | `string` | The resolved font file URI. |
|  `textDecoration` | [`TextDecorationConfig`](./api/node/interfaces/textdecorationconfig.md) | The text decoration configuration of this run. |
|  `kerning` | `number` | Additional kerning offset in em units. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support