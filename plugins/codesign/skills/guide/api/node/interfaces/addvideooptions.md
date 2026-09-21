> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for adding videos to the scene.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `sizeMode?` | [`SizeMode`](./api/node/type-aliases/sizemode.md) | How the video should be sized and positioned |
|  `positionMode?` | [`PositionMode`](./api/node/type-aliases/positionmode.md) | How the position should be interpreted |
|  `x?` | `number` | X position in scene design units |
|  `y?` | `number` | Y position in scene design units |
|  `cornerRadius?` | `number` | Corner radius for rounded corners in scene design units |
|  `timeline?` | `object` | Timeline configuration |
| `timeline.timeOffset?` | `number` | Start time offset in seconds |
| `timeline.duration?` | `number` | Duration in seconds |
|  `shadow?` | [`DropShadowOptions`](./api/node/type-aliases/dropshadowoptions.md) | Drop shadow configuration |
|  `animation?` | [`AnimationOptions`](./api/node/type-aliases/animationoptions.md) | Animation configuration |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support