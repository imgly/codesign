> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type HistoryUpdate = "Updated" | "Activated";
```

Describes the kind of update that triggered an `onHistoryUpdatedWithKind` callback.

- `Updated`: The active history's snapshots changed: a new snapshot was added (e.g. after an edit), or undo/redo
  was applied. The scene state changed as a direct consequence.
- `Activated`: A different history buffer was activated via `setActiveHistory`. The undo/redo stack visible to the
  user changed, but no new snapshot was created and no undo/redo was applied as part of this event.


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support