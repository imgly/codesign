> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetMetaData = object & Record<string, unknown>;
```

Generic asset information

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `mimeType?` | `string` | The mime type of this asset or the data behind the asset's uri. |
| `blockType?` | `string` | The type id of the design block that should be created from this asset. |
| `fillType?` | `string` | - |
| `shapeType?` | `string` | - |
| `kind?` | `string` | - |
| `uri?` | `string` | - |
| `thumbUri?` | `string` | - |
| `previewUri?` | `string` | - |
| `sourceSet?` | [`Source`](./api/node/interfaces/source.md)\[] | - |
| `filename?` | `string` | - |
| `vectorPath?` | `string` | - |
| `width?` | `number` | - |
| `height?` | `number` | - |
| `duration?` | `string` | - |
| `effectType?` | `string` | Effect kind hint. Widened to `string` so this metadata stays cross-binding (the narrow `EffectType` union remains the source of truth for `BlockAPI.createEffect`). |
| `blurType?` | `string` | Blur kind hint. Widened to `string` for the same reason as `effectType` — the narrow `BlurType` union still gates `BlockAPI.createBlur`. |
| `looping?` | `boolean` | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support