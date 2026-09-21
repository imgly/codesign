> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DefaultAssetSourceId = 
  | "ly.img.sticker"
  | "ly.img.vectorpath"
  | "ly.img.colors.defaultPalette"
  | "ly.img.filter.lut"
  | "ly.img.filter.duotone"
  | "ly.img.effect"
  | "ly.img.blur"
  | "ly.img.typeface"
  | "ly.img.page.presets"
  | "ly.img.page.presets.video"
  | "ly.img.crop.presets"
  | "ly.img.text"
  | "ly.img.captionPresets";
```

Represents the default asset source IDs used in the editor.

## Deprecated

This function uses legacy v4 asset source IDs. Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI() directly.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support