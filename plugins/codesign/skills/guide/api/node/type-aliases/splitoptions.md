> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type SplitOptions = object;
```

Options for configuring block split operations.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `attachToParent?` | `boolean` | `true` | Whether or not the new block will be attached to the same parent as the original. |
|  `createParentTrackIfNeeded?` | `boolean` | `false` | Whether to create a parent track if needed and add both blocks to it. Only used when attachToParent is true. |
|  `selectNewBlock?` | `boolean` | `true` | Whether to select the newly created block after splitting. |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support