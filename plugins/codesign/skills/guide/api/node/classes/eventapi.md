> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Subscribe to block lifecycle events in the design engine.

The EventAPI enables real-time monitoring of block changes through event subscriptions.
Events are bundled and delivered efficiently at the end of each engine update cycle.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>EventAPI</code></p>
  </summary>
</details>

## Event Subscriptions

Subscribe to block lifecycle events with filtering and callback management.

<details>
  <summary>
    ### subscribe

    <br /><p>Subscribe to block lifecycle events.</p>
  </summary>

  Events are bundled and delivered at the end of each engine update cycle for efficient processing.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blocks` | `number`\[] | List of blocks to filter events by. If empty, events for all blocks are sent. |
  | `callback` | (`events`) => `void` | Function called with bundled events. |

  #### Returns

  A method to unsubscribe from the events.

  () => `void`
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support