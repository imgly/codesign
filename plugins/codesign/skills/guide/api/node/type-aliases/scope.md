> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type Scope = 
  | "text/edit"
  | "text/character"
  | "fill/change"
  | "fill/changeType"
  | "stroke/change"
  | "shape/change"
  | "layer/move"
  | "layer/resize"
  | "layer/rotate"
  | "layer/flip"
  | "layer/crop"
  | "layer/opacity"
  | "layer/blendMode"
  | "layer/visibility"
  | "layer/clipping"
  | "appearance/adjustments"
  | "appearance/filter"
  | "appearance/effect"
  | "appearance/blur"
  | "appearance/shadow"
  | "appearance/animation"
  | "lifecycle/destroy"
  | "lifecycle/duplicate"
  | "editor/add"
  | "editor/select";
```

Represents the various scopes that define the capabilities and permissions
within the Creative Editor SDK. Each scope corresponds to a specific
functionality or action that can be performed within the editor.

The `Scope` type is used to control access to different features and operations,
allowing for fine-grained control over what actions are permitted.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support