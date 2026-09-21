> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AsyncURIResolver = (URI, defaultURIResolver) => Promise<string> | string;
```

An async-compatible URI resolver function.

May return a plain string for synchronous resolution, or a `Promise<string>`
for asynchronous resolution. The engine preserves synchronous behaviour when
a plain string is returned (important for call-sites that expect immediate
resolution).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `URI` | `string` |
| `defaultURIResolver` | (`URI`) => `string` |

## Returns

`Promise`\<`string`> | `string`


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support