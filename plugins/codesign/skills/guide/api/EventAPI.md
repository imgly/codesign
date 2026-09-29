# EventAPI

## Event Subscriptions

Subscribe to block lifecycle events with filtering and callback management.

### subscribe()

Subscribe to block lifecycle events.
Events are bundled and delivered at the end of each engine update cycle for efficient processing.

```typescript
subscribe(blocks: DesignBlockId[], callback: (events: BlockEvent[]) => void): (() => void)
```

**Parameters:**
- `blocks` - List of blocks to filter events by. If empty, events for all blocks are sent.
- `callback` - Function called with bundled events.

**Returns:** A method to unsubscribe from the events.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).