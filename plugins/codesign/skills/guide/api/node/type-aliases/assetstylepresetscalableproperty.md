> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetScalableProperty = 
  | "stroke/width"
  | "dropShadow/offset/x"
  | "dropShadow/offset/y"
  | "dropShadow/blurRadius/x"
  | "dropShadow/blurRadius/y"
  | "backgroundColor/cornerRadius";
```

A length property a style preset may scale with the block's font size (see [AssetStylePreset.scaleWithFontSize](./api/node/interfaces/assetstylepreset.md)). Restricted to the decoration lengths for which scaling is
meaningful — stroke width, drop-shadow offset/blur and the caption background corner radius — not
arbitrary numeric properties like `rotation` or `opacity`.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support