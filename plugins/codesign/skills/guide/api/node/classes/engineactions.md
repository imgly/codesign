> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Named, overridable actions for one engine. Actions are either JS
closures you register or engine defaults (e.g. undo/redo), and
either kind can override the other by reusing the id.

JS-registered actions run directly in JS, so on the web you get full fidelity: [get](./api/node/classes/engineactions.md) hands back the raw function and [run](./api/node/classes/engineactions.md) passes args/results by
reference (non-serializable payloads like File/Blob work). The engine also keeps
a JSON trampoline per action so defaults run natively and host actions stay
reachable across the FFI — that path is JSON-only and async. Engine defaults you
have not overridden are reachable only via [run](./api/node/classes/engineactions.md); [get](./api/node/classes/engineactions.md) returns undefined.

## Remarks

Main-thread only. [get](./api/node/classes/engineactions.md) is web-only; use run/has/list cross-platform.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>EngineActions</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### register()

    <br /><p>Register an action, replacing any existing one with the same id.</p>
  </summary>

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `never` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `K` | The action id (e.g. `undo`). Reusing an engine default's id overrides it. |
  | `fn` | [`EngineActionsRegistry`](./api/node/interfaces/engineactionsregistry.md)\[`K`] *extends* (...`args`) => `any` ? `any`\[`any`] : [`EngineCustomActionFunction`](./api/node/type-aliases/enginecustomactionfunction.md) | The action body (sync or async). On the web it runs directly with any JS values. Across the FFI args/results are JSON, so only serializable payloads work there. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  register(id, fn): void;
  ```

  Register an action, replacing any existing one with the same id.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The action id (e.g. `undo`). Reusing an engine default's id overrides it. |
  | `fn` | [`EngineCustomActionFunction`](./api/node/type-aliases/enginecustomactionfunction.md) | The action body (sync or async). On the web it runs directly with any JS values. Across the FFI args/results are JSON, so only serializable payloads work there. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  register(id: K, fn: EngineActionsRegistry[K] extends (args: any[]) => any ? any[any] : EngineCustomActionFunction): void
  ```

  ```typescript
  register(id: string, fn: EngineCustomActionFunction): void
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Get the raw registered function for an id so you can call it synchronously.</p>
  </summary>

  Returns the exact function you registered. Returns `undefined` for unknown ids
  and engine-default native actions (which have no JS function) — use [run](./api/node/classes/engineactions.md)
  for those.

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `never` |

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `K` |

  ##### Returns

  [`EngineActionsRegistry`](./api/node/interfaces/engineactionsregistry.md)\[`K`]

  ##### Remarks

  Web-only.

  #### Call Signature

  ```ts
  get(id): EngineCustomActionFunction;
  ```

  Get the raw registered function for an id so you can call it synchronously.

  Returns the exact function you registered. Returns `undefined` for unknown ids
  and engine-default native actions (which have no JS function) — use [run](./api/node/classes/engineactions.md)
  for those.

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  ##### Returns

  [`EngineCustomActionFunction`](./api/node/type-aliases/enginecustomactionfunction.md)

  ##### Remarks

  Web-only.

  #### Signatures

  ```typescript
  get(id: K): EngineActionsRegistry[K]
  ```

  ```typescript
  get(id: string): EngineCustomActionFunction
  ```

  ***
</details>

<details>
  <summary>
    ### run()

    <br /><p>Run an action by id and return its result as a Promise.</p>
  </summary>

  JS-registered actions are called directly (args/result by reference). Engine
  defaults go across the FFI (JSON args/result).

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `never` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `K` | The action id. |
  | ...`args` | [`EngineActionsRegistry`](./api/node/interfaces/engineactionsregistry.md)\[`K`] *extends* (...`args`) => `any` ? `A` : `unknown`\[] | Arguments forwarded to the action. |

  ##### Returns

  `Promise`\<[`EngineActionsRegistry`](./api/node/interfaces/engineactionsregistry.md)\[`K`] *extends* (...`args`) => `R` ? `Awaited`\<`R`> : `unknown`>

  The action's result, or a rejection if the id is unknown or it threw.

  #### Call Signature

  ```ts
  run<R>(id, ...args): Promise<R>;
  ```

  Run an action by id and return its result as a Promise.

  JS-registered actions are called directly (args/result by reference). Engine
  defaults go across the FFI (JSON args/result).

  ##### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `R` | `unknown` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The action id. |
  | ...`args` | `unknown`\[] | Arguments forwarded to the action. |

  ##### Returns

  `Promise`\<`R`>

  The action's result, or a rejection if the id is unknown or it threw.

  #### Signatures

  ```typescript
  run(id: K, args: EngineActionsRegistry[K] extends (args: A) => any ? A : unknown[]): Promise<EngineActionsRegistry[K] extends (args: any[]) => R ? Awaited<R> : unknown>
  ```

  ```typescript
  run(id: string, args: unknown[]): Promise<R>
  ```

  ***
</details>

<details>
  <summary>
    ### has()

    <br /><p>Whether an action with this id is registered (host or engine default).</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  has(id: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### unregister()

    <br /><p>Remove a host action, or revert an overridden engine default to its built-in.</p>
  </summary>

  If you override an engine default (such as `select` or `undo`), unregistering the id restores
  the default rather than leaving it unhandled. A custom id you registered yourself is removed
  entirely. Returns `false` only when the id is unknown.

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  unregister(id: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>List registered actions, optionally filtered by a <code>\*</code> glob matcher on the id.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options?` | \{ `matcher?`: `string`; } |
  | `options.matcher?` | `string` |

  #### Returns

  [`EngineActionInfo`](./api/node/interfaces/engineactioninfo.md)\[]

  #### Signature

  ```typescript
  list(options?: object): EngineActionInfo[]
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support