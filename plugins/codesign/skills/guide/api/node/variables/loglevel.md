> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
LogLevel: object;
```

Provides a set of predefined log levels for the Creative Editor SDK.

The `LogLevel` object contains constants representing different severity levels
for logging messages. These levels can be used to categorize log messages based
on their importance and urgency.

## Type Declaration

| Name | Type |
| ------ | ------ |
|  `Info` | `"Info"` |
|  `Warning` | `"Warning"` |
|  `Error` | `"Error"` |

## Deprecated

Specifying log levels via `LogLevel.Info` has been deprecated.
Please use the desired LogLevel string directly.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support