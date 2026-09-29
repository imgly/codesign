# CreativeEngine

## Engine Management

### addPlugin()

Add and initialize a plugin to the engine.

```typescript
addPlugin(plugin: EnginePlugin): Promise<void>
```

**Parameters:**
- `plugin` - The plugin to add and initialize.

### setWheelEventTarget()

Install the mousewheel event handler for the CreativeEngine on a different element than the canvas.
This can be useful if you are rendering HTML elements on top of the canvas
and want to scroll the canvas when the mouse is over those elements.

```typescript
setWheelEventTarget(target: HTMLElement): () => void
```

**Parameters:**
- `target` - The HTML element to attach the wheel event handler to.

**Returns:** A function that removes the event handler from the target and adds it back to the canvas.

### element()

Access the canvas element used by the CreativeEngine.

```typescript
get element(): HTMLCreativeEngineCanvasElement | undefined
```

**Returns:** The element value.

### dispose()

Dispose the engine and clean up all resources.

```typescript
dispose(): void
```

### init<C extends Partial<Configuration>>()

Initialize a CreativeEngine with an optional configuration.

```typescript
init<C extends Partial<Configuration>>(config?: C): Promise<CreativeEngine & (C extends {
        readonly canvas: any;
    } ? {
        readonly element: undefined;
    } : {
        readonly element: HTMLCreativeEngineCanvasElement;
    })>
```

**Parameters:**
- `config` - Optional configuration object for engine initialization.

**Returns:** A promise that resolves to an engine instance.

### getBaseURL()

Returns the configured base URL for the engine's assets.

```typescript
getBaseURL(): string
```

**Returns:** The absolute base URL configured for this engine instance.

## Experimental Features

### unstable_setVideoExportInactivityTimeout()

Configure the timeout for video export inactivity detection.
Some browsers exhibit a bug where support for certain video codecs is
offered, but when attempting to decode or encode in these codecs, the
request will simply never return. We detect that situation using a
timeout. To prevent this mechanism from triggering in situations where the
export simply takes long because of a slow device, you can configure the
timeout here.

```typescript
unstable_setVideoExportInactivityTimeout(timeout: number): void
```

**Parameters:**
- `timeout` - Timeout in milliseconds. Defaults to 10 seconds.

### unstable_setExportInactivityTimeout()

Configure the timeout for block-exports in WebWorkers.
If exporting a block hangs because resources take too long to initialize,
the export will be aborted after this many ms.

```typescript
unstable_setExportInactivityTimeout(timeout: number): void
```

**Parameters:**
- `timeout` - Timeout in milliseconds (default: 10 000)

## Asset Sources

### addDefaultAssetSources() *(deprecated)*

Register a set of asset sources containing default assets.
Available default asset sources:
- `'ly.img.sticker'` - Various stickers
- `'ly.img.vectorpath'` - Shapes and arrows
- `'ly.img.filter.lut'` - LUT effects of various kinds
- `'ly.img.filter.duotone'` - Color effects of various kinds
These assets are parsed at `\{\{base_url\}\}/<id>/content.json`, where
`base_url` defaults to the IMG.LY CDN.
Each source is created via `addLocalSource` and populated with the parsed assets. To modify the available
assets, you may either exclude certain IDs via `excludeAssetSourceIds` or alter the sources after creation.

```typescript
addDefaultAssetSources({ baseURL, excludeAssetSourceIds }?: {
        /** The source of the asset definitions, must be absolute. Defaults to IMG.LY CDN. */
        baseURL?: string;
        /** A list of IDs, that will be ignored during load. */
        excludeAssetSourceIds?: DefaultAssetSourceId[];
    }): Promise<void>
```

**Parameters:**
- `options` - Configuration options for loading default asset sources.

**Returns:** A promise that resolves when all asset sources are loaded.

### addDemoAssetSources() *(deprecated)*

Register a set of demo asset sources containing example assets.
**Note**: These are demonstration assets not meant for production use.
Available demo asset sources:
- `'ly.img.image'` - Sample images
- `'ly.img.image.upload'` - Demo source to upload image assets
- `'ly.img.audio'` - Sample audios
- `'ly.img.audio.upload'` - Demo source to upload audio assets
- `'ly.img.video'` - Sample videos
- `'ly.img.video.upload'` - Demo source to upload video assets

```typescript
addDemoAssetSources({ baseURL, excludeAssetSourceIds, sceneMode, withUploadAssetSources }?: {
        /** The source of the demo asset definitions, must be absolute. Defaults to IMG.LY CDN. */
        baseURL?: string;
        /** A list of IDs, that will be ignored during load */
        excludeAssetSourceIds?: DemoAssetSourceId[];
        /** @deprecated Since v1.72. Scene mode no longer affects which asset sources are loaded. */
        sceneMode?: SceneMode;
        /** If 'true' asset sources for uploads are added (default false) */
        withUploadAssetSources?: boolean;
    }): Promise<void>
```

**Parameters:**
- `options` - Configuration options for loading demo asset sources.

**Returns:** A promise that resolves when all demo asset sources are loaded.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).