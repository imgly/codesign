> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

An animation slot of an [AssetStylePreset](./api/node/interfaces/assetstylepreset.md) (`inAnimation`, `outAnimation` or `loopAnimation`).

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `type` | | `"//ly.img.ubq/animation/slide"` | `"//ly.img.ubq/animation/pan"` | `"//ly.img.ubq/animation/fade"` | `"//ly.img.ubq/animation/blur"` | `"//ly.img.ubq/animation/grow"` | `"//ly.img.ubq/animation/zoom"` | `"//ly.img.ubq/animation/pop"` | `"//ly.img.ubq/animation/wipe"` | `"//ly.img.ubq/animation/baseline"` | `"//ly.img.ubq/animation/crop_zoom"` | `"//ly.img.ubq/animation/spin"` | `"//ly.img.ubq/animation/spin_loop"` | `"//ly.img.ubq/animation/fade_loop"` | `"//ly.img.ubq/animation/blur_loop"` | `"//ly.img.ubq/animation/pulsating_loop"` | `"//ly.img.ubq/animation/breathing_loop"` | `"//ly.img.ubq/animation/jump_loop"` | `"//ly.img.ubq/animation/squeeze_loop"` | `"//ly.img.ubq/animation/sway_loop"` | `"//ly.img.ubq/animation/scale_loop"` | `"//ly.img.ubq/animation/typewriter_text"` | `"//ly.img.ubq/animation/block_swipe_text"` | `"//ly.img.ubq/animation/spread_text"` | `"//ly.img.ubq/animation/merge_text"` | `"//ly.img.ubq/animation/ken_burns"` | The animation block type to apply, e.g. `'//ly.img.ubq/animation/slide'`. |
|  `properties?` | [`AssetStylePresetAnimationProperties`](./api/node/type-aliases/assetstylepresetanimationproperties.md) | Configures the animation as a map of its property paths to values. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support