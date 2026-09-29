> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetProperties = { [K in BoolPropertyName as string extends K ? never : K]?: boolean } & { [K in IntPropertyName as string extends K ? never : K]?: number } & { [K in FloatPropertyName as string extends K ? never : K]?: number } & { [K in DoublePropertyName as string extends K ? never : K]?: number } & { [K in StringPropertyName as string extends K ? never : K]?: string } & { [K in EnumPropertyName as string extends K ? never : K]?: string } & { [K in ColorPropertyName as string extends K ? never : K]?: RGBColor | RGBAColor } & object & object;
```

The look of an [AssetStylePreset](./api/node/interfaces/assetstylepreset.md): a map of property paths to values. Known paths are
value-checked and autocomplete (e.g. `stroke/enabled` must be a boolean, `stroke/width` a number,
`fill/solid/color` a color); any other property path is still accepted with the broader [AssetStylePresetPropertyValue](./api/node/type-aliases/assetstylepresetpropertyvalue.md). Keys without a `/` are namespaced to the block (`text/` or
`caption/`); keys with a `/` are used verbatim.

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `text/path?` | `string` | `null` | The text-on-path baseline (see `setTextOnPath`): a single-subpath SVG path string in the block's local coordinate space wraps the block's text on the path and resizes the block to the path's bounding box; an explicit `null` clears the path and restores normal layout. This is a virtual preset property — the baseline path is not a reflected block property, so the engine routes it through `setTextOnPath`, inheriting its validation. Pair it with `text/pathOffset` and `text/pathFlipped` (plain reflected properties) to fully define the path state. Which curve is applied is identified by the path value itself — compare `getTextOnPath` against an entry's `text/path`. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support