> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type CreateSceneOptions = object;
```

Options for creating a video scene.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `page?` | `object` | The page options |
| `page.size` | | `number` | \{ `width`: `number`; `height`: `number`; } | The size of the page |
| `page.color?` | [`Color`](./api/node/type-aliases/color.md) | The background color of the page |
|  `designUnit?` | [`DesignUnit`](./api/node/type-aliases/designunit.md) | The design unit of the new scene. Defaults to `Pixel`. |
|  `fontSizeUnit?` | [`SceneFontSizeUnit`](./api/node/type-aliases/scenefontsizeunit.md) | The unit in which font sizes for `setTextFontSize` and `getTextFontSizes` are interpreted. If omitted, it is paired with `designUnit`: `Pixel` scenes get `Pixel`, all other scenes get `Point`. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support