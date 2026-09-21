> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetPropertyValue = 
  | boolean
  | number
  | string
  | RGBColor
  | RGBAColor
  | null;
```

A value a style preset can set on a property: a boolean, number, string (including enum values) or
an RGB(A) color. Colors must be RGB(A) (`{ r, g, b, a? }`); CMYK and spot colors are not supported in
presets. Structs and source sets cannot be set from a preset. A `null` value is ignored for regular
properties; for the virtual `text/path` property it clears the baseline path.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support