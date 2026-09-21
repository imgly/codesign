> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Specifies the configuration for the Creative Editor SDK.

The `Configuration` interface provides a set of properties that control the behavior
and settings of the editor. These options include settings for the base URL, license,
user ID, core settings, logger, feature flags, presets, force WebGL1, audio output,
and role.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `baseURL` | `string` | - |
|  `license?` | `string` | - |
|  `userId?` | `string` | - |
|  `core` | `object` | - |
| `core.baseURL` | `string` | - |
|  `logger` | [`Logger`](./api/node/interfaces/logger.md) | - |
|  `featureFlags?` | `object` | - |
|  ~~`presets`~~ | `object` | **Deprecated** This config key is not used anymore and will be removed. |
| `presets.typefaces?` | `object` | **Deprecated** The configuration option `presets.typefaces` does not exist anymore. Custom typefaces should be defined as asset sources using the `cesdk.engine.asset.addSource` or `cesdk.engine.asset.addLocalSource` instead. |
|  `forceWebGL1?` | `boolean` | By default the engine tries to create a webgl2 context. If this fails it falls back to trying to create a webgl1 context. If this configuration option is set to true, it will no longer try to create a webgl2 context and always create a webgl1 context. |
|  `audioOutput?` | `"none"` | `"auto"` | Whether the engine should automatically choose an audio output device or should not output audio at all. If not configured the fallback value is 'auto'. |
|  `role?` | [`RoleString`](./api/node/type-aliases/rolestring.md) | - |


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support