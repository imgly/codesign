> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Plugin Architecture](./concepts/plugin-architecture.md)

---

Understand which parts of CE.SDK's plugin system apply in headless
server-side setups and how to run an engine plugin without any editor UI.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-plugin-architecture-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-plugin-architecture-server-js)

A plugin is a self-contained unit that packages engine behavior—asset sources, settings, callbacks—and attaches to an existing engine. CE.SDK for Web distinguishes two plugin layers: engine plugins, which only need the engine, and editor plugins, which extend the editor UI. Only the first layer applies on the server, where no editor exists.

```typescript file=@cesdk_web_examples/guides-concepts-plugin-architecture-server-js/server-js.ts reference-only
import CreativeEngine, { EnginePlugin, EnginePluginContext } from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Plugin Architecture Guide
 *
 * Demonstrates that engine plugins run headless:
 * - Defining an EnginePlugin
 * - Applying it to the headless engine
 * - Using the capability it added without any editor UI
 */

// The same engine plugin shape as in the browser: only the engine
// is available in its context, so it runs anywhere the engine runs.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}

async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // @cesdk/node has no addPlugin() method — apply the plugin by
    // invoking its initialize with the engine context
    new BrandAssetsPlugin().initialize({ engine });

    // The asset source registered by the plugin is available immediately
    const result = await engine.asset.findAssets('brand-assets', {
      page: 0,
      perPage: 10
    });
    console.log(`brand-assets provides ${result.total} asset(s)`);

  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Example failed:', error);
  process.exit(1);
});
```

This guide covers the engine plugin contract, how to apply an engine plugin in Node.js, and why editor plugins don't run headless.

## Engine Plugins Run Headless

An engine plugin implements `EnginePlugin` (`name`, `version`, `initialize(context)`). Its context contains only the `engine`, so the same plugin class runs in the browser, in headless browser setups, and in Node.js. This one registers an asset source:

```typescript highlight-engine-plugin
// The same engine plugin shape as in the browser: only the engine
// is available in its context, so it runs anywhere the engine runs.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}
```

### Applying the Plugin

In the browser, both `engine.addPlugin()` and `cesdk.addPlugin()` exist. `@cesdk/node` has no `addPlugin()` method, so we apply the plugin by invoking its `initialize` with the engine context:

```typescript highlight-register-engine-plugin
// @cesdk/node has no addPlugin() method — apply the plugin by
// invoking its initialize with the engine context
new BrandAssetsPlugin().initialize({ engine });
```

### Using What the Plugin Added

The asset source registered by the plugin is available like any other:

```typescript highlight-verify-source
// The asset source registered by the plugin is available immediately
const result = await engine.asset.findAssets('brand-assets', {
  page: 0,
  perPage: 10
});
console.log(`brand-assets provides ${result.total} asset(s)`);
```

### Cleaning Up

As in every server-side example, dispose the engine when you're done:

```typescript highlight-cleanup
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## Editor Plugins Need the Editor

The second plugin layer—editor plugins implementing `EditorPlugin`—receives a `cesdk` instance in its context and extends the editor UI: dock entries, panels, translations. Since no editor exists on the server, these plugins can't run here. Most official `@imgly/plugin-*` packages are editor plugins; check each plugin's docs page for whether it supports headless use.

If a plugin mixes engine work with UI work, split the engine part into its own `EnginePlugin` so it stays usable in server-side pipelines.

## Troubleshooting

- **A plugin fails in Node.js with a missing `cesdk`**: The plugin is an editor plugin and depends on the editor UI context. Use an engine plugin, or run it only where the editor exists.
- **`engine.addPlugin` is not a function**: `@cesdk/node` doesn't provide `addPlugin()`. Invoke the plugin's `initialize({ engine })` directly.
- **A format conversion package is "not working as a plugin"**: Importers and exporters are standalone packages, not plugins. Use the package's own API.

## Next Steps

- [Headless Mode](./concepts/headless-mode.md) - Running the engine without UI
- [Architecture](./concepts/architecture.md) - How the CreativeEngine is structured
- [Print-Ready PDF](./plugins/print-ready-pdf.md) - An official plugin with server-side docs



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support