> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for applying an asset to the scene.

## Indexable

```ts
[key: string]: unknown
```

Additional custom context options.
Allows passing arbitrary data to middleware for custom placement logic.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `clipType?` | `"clip"` | `"overlay"` | How the asset should be placed in the scene. - 'clip': Background clip placed on background track - 'overlay': Foreground overlay placed at playhead |
|  `placement?` | [`AssetPlacement`](./api/node/interfaces/assetplacement.md) | Where the created block is placed. An asset source that was registered with its own `applyAsset` implementation ignores it. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support