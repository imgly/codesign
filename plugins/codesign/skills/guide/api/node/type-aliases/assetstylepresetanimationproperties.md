> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetAnimationProperties = { [K in Extract<BoolPropertyName, `animation/${string}`>]?: boolean } & { [K in Extract<EnumPropertyName, `animation/${string}`>]?: string } & { [K in Extract<FloatPropertyName, `animation/${string}`>]?: number } & { [K in Extract<ColorPropertyName, `animation/${string}`>]?: RGBColor | RGBAColor } & object & object;
```

The parameters of an [AssetStylePresetAnimation](./api/node/interfaces/assetstylepresetanimation.md): a map of the animation's property paths to
values. The animation's `animation/*` properties (e.g. `animation/slide/fade`,
`animation/grow/scaleFactor`) are value-checked and autocomplete, as are the animation controls
(`playback/duration`, `animationEasing`, `textWritingStyle`, `textWritingOverlap`); any other
property path is still accepted. These are animation paths, distinct from the block-property paths
in [AssetStylePresetProperties](./api/node/type-aliases/assetstylepresetproperties.md).

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `playback/duration?` | `number` | Animation controls applied outside the `animation/*` properties. |
| `animationEasing?` | `string` | - |
| `textWritingStyle?` | `string` | - |
| `textWritingOverlap?` | `number` | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support