> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Serve Assets](./serve-assets.md)

---

Configure CE.SDK to load engine assets from your own servers or local
filesystem for server-side deployments.

The `@cesdk/node` package bundles the core WASM engine files, font fallback files, and the emoji font directly. No additional setup is required to initialize the engine, render text with full Unicode and emoji coverage, and use its APIs offline.

`@cesdk/node` is offline-first: the default `baseURL` resolves to the package's own `assets/` directory (`file://<pkg>/assets/`), so the engine boots without reaching the IMG.LY CDN. You only need to configure assets when you register content asset sources (stickers, shapes, typefaces, filters, and so on) or want to serve the bundled core and font assets from your own location.

For rendering-only workflows (loading existing scenes and exporting to PDF, PNG, or video), the engine loads scene-referenced assets directly from their embedded URLs. You only need to configure asset paths if you want to serve those assets from your own server or CDN instead of the copies bundled in the package.

## Understanding Asset Categories

The `imgly-assets.zip` contains directories organized by function:

| Directory   | Contents                                                        | Bundled in npm? | When Needed                  |
| ----------- | --------------------------------------------------------------- | --------------- | ---------------------------- |
| `core/`     | WASM engine files                                               | **Yes**         | Always (bundled)             |
| `i18n/`     | Translations                                                    | **Yes**         | Always (bundled)             |
| `emoji/`    | Emoji assets                                                    | **Yes**         | If rendering emojis          |
| `fonts/`    | System fonts                                                    | **Yes**         | If using system fonts        |
| `ly.img.*/` | Content asset sources (stickers, shapes, typefaces, filters, …) | No              | If registering asset sources |

> **Note:** The `ly.img.*` content sources are usable server-side, but they are not
> bundled in the npm package. To use them, self-host them from the archive and
> register each with the engine API. The `@cesdk/cesdk-js/plugins` asset-source
> plugins are editor-only and are not used with `@cesdk/node`.

## Engine-Level Assets

The engine uses additional assets for font fallback (Unicode character coverage) and emoji rendering. By default, these load from the `assets/` directory bundled inside the `@cesdk/node` package, so they work offline without reaching the IMG.LY CDN. When you set `baseURL` for your engine, font fallback files and the emoji font are loaded from that location instead:

- **Font fallback files** — Used when text contains characters not covered by the selected font. Located at `{baseURL}/fonts/font-{index}.ttf`.
- **Emoji font** — The default emoji font (NotoColorEmoji.ttf). Located at `{baseURL}/emoji/NotoColorEmoji.ttf`.

The `fonts/` and `emoji/` directories ship inside the package and are also included in the `imgly-assets.zip` download. When you self-host and point `baseURL` at your own location, ensure these directories are present there.

## Self-Hosting Assets

### Using Local Filesystem

Use Node.js `pathToFileURL()` to load assets directly from disk:

```javascript
import CreativeEngine from '@cesdk/node';
import path from 'path';
import { pathToFileURL } from 'url';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL:
    pathToFileURL(path.resolve(`./cesdk-assets/${CreativeEngine.version}`))
      .href + '/'
});

// Use the engine for processing
// ...

// Clean up when done
engine.dispose();
```

The `file://` protocol loads assets directly from the filesystem without network overhead.

### Using Your Own CDN

If you prefer serving assets from your own CDN:

```javascript
import CreativeEngine from '@cesdk/node';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL: `https://cdn.yourdomain.com/cesdk/${CreativeEngine.version}/`
});
```

## Register Asset Sources

To use the default content sources (stickers, shapes, typefaces, filters, and so on) server-side, extract the archive, point `baseURL` at it, and register each source you need directly through the engine API. This is the same asset API used in the browser; the `@cesdk/cesdk-js/plugins` asset-source plugins are editor-only and are not used with `@cesdk/node`.

[Download Assets (v$UBQ\_VERSION$)](https://cdn.img.ly/packages/imgly/cesdk-node/$UBQ_VERSION$/imgly-assets.zip)

Or download and extract it from the command line:

```bash
# Download and extract the content assets for your SDK version
curl -O https://cdn.img.ly/packages/imgly/cesdk-node/$UBQ_VERSION$/imgly-assets.zip
mkdir -p cesdk-assets/$UBQ_VERSION$
unzip imgly-assets.zip -d cesdk-assets/$UBQ_VERSION$/
rm imgly-assets.zip
```

`engine.getBaseURL()` returns the configured base, so you can point each source at its `content.json` relative to it:

```javascript
import CreativeEngine from '@cesdk/node';
import path from 'path';
import { pathToFileURL } from 'url';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL:
    pathToFileURL(path.resolve(`./cesdk-assets/${CreativeEngine.version}`))
      .href + '/'
});

const baseURL = engine.getBaseURL();

for (const sourceId of [
  'ly.img.sticker',
  'ly.img.vector.shape',
  'ly.img.typeface',
  'ly.img.filter'
]) {
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}${sourceId}/content.json`
  );
}
```

Point `baseURL` at a `file://` path for local hosting or at your own CDN. For the full list of source IDs and matcher filtering, see the [Default Assets](./import-media/default-assets.md) guide.

## Troubleshooting

### File URL Formatting

When using `file://` URLs:

- Use `path.resolve()` to get absolute paths
- URLs must end with a trailing slash for directories
- Always use `pathToFileURL()` from the `url` module instead of string concatenation

> **Caution:** **License validation requires network access**: The engine validates your
> license key against `api.img.ly` during initialization. Ensure your server
> environment allows outbound HTTPS connections to this endpoint.

## API Reference

| Method/Config                                                       | Purpose                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `CreativeEngine.init(config)`                                       | Initialize engine with configuration                                    |
| `config.baseURL`                                                    | Base path for engine and content assets (defaults to the local package) |
| `engine.getBaseURL()`                                               | Return the configured base URL                                          |
| `engine.asset.addLocalAssetSourceFromJSONURI(contentURI, options?)` | Register a content asset source from its `content.json`                 |
| `CreativeEngine.version`                                            | Get current SDK version string                                          |
| `pathToFileURL(path)`                                               | Convert filesystem path to `file://` URL (Node.js `url` module)         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support