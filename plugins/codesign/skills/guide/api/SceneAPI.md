# SceneAPI

## Scene Loading

### load()

Load a scene from a scene string or from a URL to a scene or archive file.
The input kind is detected automatically: serialized scene content is loaded directly, while a
URL is fetched and loaded as an archive or as a scene file depending on its content. This loads
`.imgly` files as well as the legacy `.scene` and `.zip` formats. Any existing scene is replaced
by the new one.
```javascript
await creativeEngine.scene.load('https://example.com/my-scene.imgly');
```

```typescript
load(source: string | URL, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>
```

**Parameters:**
- `source` - A scene string previously created by `saveToString`, or the URL of a scene or archive file.
Pass a `URL` instance to load a URL unambiguously; strings are detected by their content.
- `overrideEditorConfig` - Whether to override editor configuration with settings and data from the scene file. Defaults to false.
- `waitForResources` - Whether to wait for all resources to finish loading before resolving. Defaults to false.

**Returns:** A handle to the loaded scene.

### loadFromString()

Load the contents of a scene file.
The string must be the binary contents of a scene file and is directly imported as blocks. Any existing scene is replaced by the new one.
This is useful for loading scenes that were saved with `saveToString` or scenes that were created in another editor instance.
```javascript
const sceneContent = await creativeEngine.scene.saveToString();
creativeEngine.scene.loadFromString(sceneContent);
```

```typescript
loadFromString(sceneContent: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>
```

**Parameters:**
- `sceneContent` - The scene file contents, a base64 string.
- `overrideEditorConfig` - Whether to override editor configuration with settings and data from the scene file. Defaults to false.
- `waitForResources` - Whether to wait for all resources to finish loading before resolving. Defaults to false.

**Returns:** A handle to the loaded scene.

### loadFromURL()

Load a scene from the URL to the scene file.
The scene file will be fetched asynchronously by the engine and loaded into the engine once it is available. Any existing scene is replaced by the new one.
```javascript
const sceneURL = 'https://example.com/my-scene.json';
creativeEngine.scene.loadFromURL(sceneURL);
```

```typescript
loadFromURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>
```

**Parameters:**
- `url` - The URL of the scene file.
- `overrideEditorConfig` - Whether to override editor configuration with settings and data from the scene file. Defaults to false.
- `waitForResources` - Whether to wait for all resources to finish loading before resolving. Defaults to false.

**Returns:** scene A promise that resolves once the scene was loaded or rejects with an error otherwise.

### loadFromArchiveURL()

Load a previously archived scene from the URL to the scene file.
The scene file will be fetched asynchronously by the engine. This requires continuous `render`
calls on this engines instance.

```typescript
loadFromArchiveURL(url: string, overrideEditorConfig?: boolean, waitForResources?: boolean): Promise<DesignBlockId>
```

**Parameters:**
- `url` - The URL of the scene archive file.
- `overrideEditorConfig` - Whether to override editor configuration with settings and data from the scene file. Defaults to false.
- `waitForResources` - Whether to wait for all resources to finish loading before resolving. Defaults to false.

**Returns:** scene A promise that resolves once the scene was loaded or rejects with an error otherwise.

## Scene Saving

### saveToString()

Serializes the current scene into a string. Selection is discarded.
When persisting the result as a file, use the `.imgly` extension.

```typescript
saveToString(options?: {
        allowedResourceSchemes?: string[];
        onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>;
        compression?: {
            format?: CompressionFormat;
            level?: CompressionLevel;
        };
    }): Promise<string>
```

**Parameters:**
- `options` - Save options containing:
  - allowedResourceSchemes: The resource schemes to allow in the saved string. Defaults to ['blob', 'bundle', 'file', 'http', 'https', 'opfs'].
  - onDisallowedResourceScheme: An optional callback that is called for each resource URL that has a scheme absent from
    `resourceSchemesAllowed`. The `url` parameter is the resource URL and the `dataHash` parameter is the hash of the
    resource's data. The callback should return a new URL for the resource, which will be used in the serialized
    scene. The callback is expected to return the original URL if no persistence is needed.
  - compression: Optional compression settings containing:
    - format: Compression format (None or Zstd). Defaults to Zstd.
    - level: Compression level (Fastest, Default, or Best). Defaults to Default.

**Returns:** A promise that resolves with a string on success or an error on failure.

### saveToArchive()

Saves the current scene and all of its referenced assets into an archive.
The archive contains all assets, that were accessible when this function was called.
Blocks in the archived scene reference assets relative from to the location of the scene
file. These references are resolved when loading such a scene via `load`.
When persisting the result as a file, use the `.imgly` extension.

```typescript
saveToArchive(options?: SaveToArchiveOptions): Promise<Blob>
```

**Parameters:**
- `options` - Optional settings:
  - compression: Compression applied to the scene inside the archive, containing:
    - format: Compression format (None or Zstd). Defaults to Zstd.
    - level: Compression level (Fastest, Default, or Best). Defaults to Default.
    Bundled media is always stored uncompressed, because it already is in compressed formats.

**Returns:** A promise that resolves with a Blob on success or an error on failure.

## Scene Creation

### create()

Create a new design scene, along with its own camera.
```javascript
const scene = engine.scene.create(layout);
// With a specific design unit and auto-paired font-size unit:
const pxScene = engine.scene.create('Free', { designUnit: 'Pixel' });
```

```typescript
create(sceneLayout?: SceneLayout, options?: CreateSceneOptions): DesignBlockId
```

**Parameters:**
- `sceneLayout` - The layout of the scene.
- `options` - Optional parameters for the scene. Properties:
  - `page` - Page options. Properties:
    - `size` - The size of the page.
    - `color` - Optional background color of the page.
  - `designUnit` - The design unit of the new scene. Defaults to `Pixel`.
  - `fontSizeUnit` - The font-size unit. If omitted, paired with `designUnit`
    (`Pixel` design unit → `Pixel` font unit, others → `Point`).

**Returns:** The scene's handle.

### createVideo() *(deprecated)*

Create a new scene in video mode, along with its own camera.

```typescript
createVideo(options?: CreateSceneOptions): DesignBlockId
```

**Parameters:**
- `options` - Optional parameters for the scene. Properties:
  - `page` - Page options. Properties:
    - `size` - The size of the page.
    - `color` - Optional background color of the page.

**Returns:** The scene's handle.

### createFromImage()

Loads the given image and creates a scene with a single page showing the image.
Fetching the image may take an arbitrary amount of time, so the scene isn't immediately available.
```javascript
const scene = await engine.scene.createFromImage('https://img.ly/static/ubq_samples/sample_4.jpg');
```

```typescript
createFromImage(url: string, dpi?: number, pixelScaleFactor?: number, sceneLayout?: SceneLayout, spacing?: number, spacingInScreenSpace?: boolean): Promise<DesignBlockId>
```

**Parameters:**
- `url` - The image URL.
- `dpi` - The scene's DPI.
- `pixelScaleFactor` - The display's pixel scale factor.

**Returns:** A promise that resolves with the scene ID on success or rejected with an error otherwise.

### createFromVideo()

Loads the given video and creates a scene with a single page showing the video.
Fetching the video may take an arbitrary amount of time, so the scene isn't immediately
available.
```javascript
const scene = await engine.scene.createFromVideo('https://img.ly/static/ubq_video_samples/bbb.mp4');
```

```typescript
createFromVideo(url: string): Promise<DesignBlockId>
```

**Parameters:**
- `url` - The video URL.

**Returns:** A promise that resolves with the scene ID on success or rejected with an error otherwise.

## Scene Properties

### get()

Return the currently active scene.
```javascript
const scene = engine.scene.get();
```

```typescript
get(): DesignBlockId | null
```

**Returns:** The scene or null, if none was created yet.

### getMode() *(deprecated)*

Get the current scene mode.

```typescript
getMode(): SceneMode | null
```

**Returns:** The current mode of the scene, or null if no mode has been set.

### setMode() *(deprecated)*

Set the mode of the scene.

```typescript
setMode(mode: SceneMode): void
```

**Parameters:**
- `mode` - The new mode for the scene.

### setDesignUnit()

Converts all values of the current scene into the given design unit.
```javascript
engine.scene.setDesignUnit('Pixel');
```

```typescript
setDesignUnit(designUnit: DesignUnit): void
```

**Parameters:**
- `designUnit` - The new design unit of the scene

### getDesignUnit()

Returns the design unit of the current scene.
```javascript
engine.scene.getDesignUnit();
```

```typescript
getDesignUnit(): DesignUnit
```

**Returns:** The current design unit.

### setFontSizeUnit()

Sets the unit in which font sizes for `setTextFontSize` and `getTextFontSizes` are interpreted.
The engine continues to store font sizes in points internally; this only affects how values
are interpreted at the API boundary when callers don't specify a `unit` in `TextFontSizeOptions`.
```javascript
engine.scene.setFontSizeUnit('Pixel');
```

```typescript
setFontSizeUnit(fontSizeUnit: FontSizeUnit): void
```

**Parameters:**
- `fontSizeUnit` - The new font-size unit of the scene.

### getFontSizeUnit()

Returns the font-size unit of the current scene.
```javascript
engine.scene.getFontSizeUnit();
```

```typescript
getFontSizeUnit(): FontSizeUnit
```

**Returns:** The current font-size unit.

### getLayout()

Get the layout of the current scene.
```javascript
const layout = engine.scene.getLayout();
```

```typescript
getLayout(): SceneLayout
```

**Returns:** The current layout of the scene.

### setLayout()

Set the layout of the current scene.
This will handle all necessary conversions including creating or destroying stack blocks
and reparenting pages as needed.
When transitioning from stack layouts (VerticalStack, HorizontalStack, DepthStack) to Free layout,
the global positions of pages are preserved to maintain their visual appearance in the scene.
```javascript
engine.scene.setLayout('VerticalStack');
```

```typescript
setLayout(layout: SceneLayout): void
```

**Parameters:**
- `layout` - The new layout for the scene.

## Template Operations

### applyTemplateFromString()

Applies the contents of the given template scene to the currently loaded scene.
This loads the template scene while keeping the design unit and page dimensions
of the current scene. The content of the pages is automatically adjusted to fit
the new dimensions.
```javascript
engine.scene.applyTemplateFromString(await engine.scene.saveToString());
```

```typescript
applyTemplateFromString(content: string): Promise<void>
```

**Parameters:**
- `content` - The template scene file contents, a base64 string.

**Returns:** A Promise that resolves once the template was applied or rejects if there was an error.

### applyTemplateFromURL()

Applies the contents of the given template scene to the currently loaded scene.
This loads the template scene while keeping the design unit and page dimensions
of the current scene. The content of the pages is automatically adjusted to fit
the new dimensions.
```javascript
engine.scene.applyTemplateFromURL('https://cdn.img.ly/assets/demo/v4/ly.img.template/templates/cesdk_postcard_1.scene');
```

```typescript
applyTemplateFromURL(url: string): Promise<void>
```

**Parameters:**
- `url` - The url to the template scene file.

**Returns:** A Promise that resolves once the template was applied or rejects if there was an error.

## Page Management

### getPages()

Get the sorted list of pages in the scene.
```javascript
const pages = engine.scene.getPages();
```

```typescript
getPages(): DesignBlockId[]
```

**Returns:** The sorted list of pages in the scene.

### getCurrentPage()

Get the current page, i.e., the page of the first selected element if this page
is at least 25% visible or, otherwise, the page nearest to the viewport center.
```javascript
const currentPage = engine.scene.getCurrentPage();
```

```typescript
getCurrentPage(): DesignBlockId | null
```

**Returns:** The current page in the scene or null.

### findNearestToViewPortCenterByType()

Find all blocks with the given type sorted by the distance to viewport center.
```javascript
// Use longhand block type ID to find nearest pages.
let nearestPageByType = engine.scene.findNearestToViewPortCenterByType('//ly.img.ubq/page')[0];
// Or use shorthand block type ID.
nearestPageByType = engine.scene.findNearestToViewPortCenterByType('page')[0];
```

```typescript
findNearestToViewPortCenterByType(type: DesignBlockType): DesignBlockId[]
```

**Parameters:**
- `type` - The type to search for.

**Returns:** A list of block ids sorted by distance to viewport center.

### findNearestToViewPortCenterByKind()

Find all blocks with the given kind sorted by the distance to viewport center.
```javascript
let nearestImageByKind = engine.scene.findNearestToViewPortCenterByKind('image')[0];
```

```typescript
findNearestToViewPortCenterByKind(kind: string): DesignBlockId[]
```

**Parameters:**
- `kind` - The kind to search for.

**Returns:** A list of block ids sorted by distance to viewport center.

## Camera & Zoom

### setZoomLevel()

Set the zoom level of the scene, e.g., for headless versions.
This only shows an effect if the zoom level is not handled/overwritten by the UI.
Setting a zoom level of 2.0f results in one dot in the design to be two pixels on the screen.
```javascript
// Zoom to 100%
engine.scene.setZoomLevel(1.0);
// Zoom to 50%
engine.scene.setZoomLevel(0.5 * engine.scene.getZoomLevel());
```

```typescript
setZoomLevel(zoomLevel?: number): void
```

**Parameters:**
- `zoomLevel` - The new zoom level.

### getZoomLevel()

Get the zoom level of the scene or for a camera in the scene in unit `dpx/dot`. A zoom level of 2.0 results in one pixel in the design to be two pixels
on the screen.
```javascript
const zoomLevel = engine.scene.getZoomLevel();
```

```typescript
getZoomLevel(): number
```

**Returns:** The zoom level of the block's camera.

### zoomToBlock() *(deprecated)*

Sets the zoom and focus to show a block.
This only shows an effect if the zoom level is not handled/overwritten by the UI.
Without padding, this results in a tight view on the block.
```javascript
// Bring entire scene in view with padding of 20px in all directions
engine.scene.zoomToBlock(scene, 20.0, 20.0, 20.0, 20.0);
```

```typescript
zoomToBlock(id: DesignBlockId, paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): Promise<void>
```

**Parameters:**
- `id` - The block that should be focused on.
- `paddingLeft` - Optional padding in screen pixels to the left of the block.
- `paddingTop` - Optional padding in screen pixels to the top of the block.
- `paddingRight` - Optional padding in screen pixels to the right of the block.
- `paddingBottom` - Optional padding in screen pixels to the bottom of the block.

**Returns:** A promise that resolves once the zoom was set or rejects with an error otherwise.

### enableZoomAutoFit()

Continually adjusts the zoom level to fit the width or height of a block's axis-aligned bounding box.
This only shows an effect if the zoom level is not handled/overwritten by the UI.
Without padding, this results in a tight view on the block.
Calling `setZoomLevel` or `zoomToBlock` disables the continuous adjustment.
```javascript
// Follow page with padding of 20px in both directions
engine.scene.enableZoomAutoFit(page, 'Both', 20.0, 20.0, 20.0, 20.0);
```

```typescript
enableZoomAutoFit(id: DesignBlockId, axis: 'Both', paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): void
```

**Parameters:**
- `id` - The block for which the zoom is adjusted.
- `axis` - The block axis for which the zoom is adjusted.
- `paddingLeft` - Optional padding in screen pixels to the left of the block.
- `paddingTop` - Optional padding in screen pixels to the top of the block.
- `paddingRight` - Optional padding in screen pixels to the right of the block.
- `paddingBottom` - Optional padding in screen pixels to the bottom of the block.

### disableZoomAutoFit()

Disables any previously set zoom auto-fit.
```javascript
engine.scene.disableZoomAutoFit(scene);
```

```typescript
disableZoomAutoFit(blockOrScene: DesignBlockId): void
```

**Parameters:**
- `blockOrScene` - The scene or a block in the scene for which to disable zoom auto-fit.

### isZoomAutoFitEnabled()

Queries whether zoom auto-fit is enabled for the given block.
```javascript
engine.scene.isZoomAutoFitEnabled(scene);
```

```typescript
isZoomAutoFitEnabled(blockOrScene: DesignBlockId): boolean
```

**Parameters:**
- `blockOrScene` - The scene or a block in the scene for which to query the zoom auto-fit.

**Returns:** True if the given block has auto-fit set or the scene contains a block for which auto-fit is set, false
otherwise.

## Experimental Features

Experimental features that may change or be removed in future versions.

### unstable_enableCameraPositionClamping()

Continually ensures the camera position to be within the width and height of the blocks axis-aligned bounding box.
Disables any previously set camera position clamping in the scene and also takes priority over clamp camera commands.
```javascript
// Keep the scene with padding of 10px within the camera
engine.scene.unstable_enableCameraPositionClamping([scene], 10.0, 10.0, 10.0, 10.0, 0.0, 0.0, 0.0, 0.0);
```
Without padding, this results in a tight clamp on the block. With padding, the padded part of the
blocks is ensured to be visible.

```typescript
unstable_enableCameraPositionClamping(ids: DesignBlockId[], paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number, scaledPaddingLeft?: number, scaledPaddingTop?: number, scaledPaddingRight?: number, scaledPaddingBottom?: number): void
```

**Parameters:**
- `ids` - The blocks to which the camera position is adjusted to, usually, the scene or a page.
- `paddingLeft` - Optional padding in screen pixels to the left of the block.
- `paddingTop` - Optional padding in screen pixels to the top of the block.
- `paddingRight` - Optional padding in screen pixels to the right of the block.
- `paddingBottom` - Optional padding in screen pixels to the bottom of the block.
- `scaledPaddingLeft` - Optional padding in screen pixels to the left of the block that scales with the zoom level until five times the initial value.
- `scaledPaddingTop` - Optional padding in screen pixels to the top of the block that scales with the zoom level until five times the initial value.
- `scaledPaddingRight` - Optional padding in screen pixels to the right of the block that scales with the zoom level until five times the initial value.
- `scaledPaddingBottom` - Optional padding in screen pixels to the bottom of the block that scales with the zoom level until five times the initial value.

### unstable_disableCameraPositionClamping()

Disables any previously set position clamping for the current scene.
```javascript
engine.scene.unstable_disableCameraPositionClamping();
```

```typescript
unstable_disableCameraPositionClamping(blockOrScene?: number | null): void
```

**Parameters:**
- `blockOrScene` - Optionally, the scene or a block in the scene for which to query the position clamping.

### unstable_isCameraPositionClampingEnabled()

Queries whether position clamping is enabled.
```javascript
engine.scene.unstable_isCameraPositionClampingEnabled();
```

```typescript
unstable_isCameraPositionClampingEnabled(blockOrScene?: number | null): boolean
```

**Parameters:**
- `blockOrScene` - Optionally, the scene or a block in the scene for which to query the position clamping.

**Returns:** True if the given block has position clamping set or the scene contains a block for which position clamping is set, false
otherwise.

### unstable_enableCameraZoomClamping()

Continually ensures the zoom level of the camera in the active scene to be in the given range.
```javascript
// Allow zooming from 12.5% to 800% relative to the size of a page
engine.scene.unstable_enableCameraZoomClamping([page], 0.125, 8.0, 0.0, 0.0, 0.0, 0.0);
```

```typescript
unstable_enableCameraZoomClamping(ids: DesignBlockId[], minZoomLimit?: number, maxZoomLimit?: number, paddingLeft?: number, paddingTop?: number, paddingRight?: number, paddingBottom?: number): void
```

**Parameters:**
- `ids` - The blocks to which the camera zoom limits are adjusted to, usually, the scene or a page.
- `minZoomLimit` - The minimum zoom level limit when zooming out, unlimited when negative.
- `maxZoomLimit` - The maximum zoom level limit when zooming in, unlimited when negative.
- `paddingLeft` - Optional padding in screen pixels to the left of the block. Only applied when the block is not a camera.
- `paddingTop` - Optional padding in screen pixels to the top of the block. Only applied when the block is not a camera.
- `paddingRight` - Optional padding in screen pixels to the right of the block. Only applied when the block is not a camera.
- `paddingBottom` - Optional padding in screen pixels to the bottom of the block. Only applied when the block is not a camera.

### unstable_disableCameraZoomClamping()

Disables any previously set zoom clamping for the current scene.
```javascript
engine.scene.unstable_disableCameraZoomClamping();
```

```typescript
unstable_disableCameraZoomClamping(blockOrScene?: number | null): void
```

**Parameters:**
- `blockOrScene` - Optionally, the scene or a block for which to query the zoom clamping.

### unstable_isCameraZoomClampingEnabled()

Queries whether zoom clamping is enabled.
```javascript
engine.scene.unstable_isCameraZoomClampingEnabled();
```

```typescript
unstable_isCameraZoomClampingEnabled(blockOrScene?: number | null): boolean
```

**Parameters:**
- `blockOrScene` - Optionally, the scene or a block for which to query the zoom clamping.

**Returns:** True if the given block has zoom clamping set or the scene contains a block for which zoom clamping is set, false otherwise.

## Event Subscriptions

### onZoomLevelChanged()

Subscribe to changes to the zoom level.
```javascript
const unsubscribeZoomLevelChanged = engine.scene.onZoomLevelChanged(() => {
  const zoomLevel = engine.scene.getZoomLevel();
  console.log('Zoom level is now: ', zoomLevel);
});
```

```typescript
onZoomLevelChanged(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - This function is called at the end of the engine update, if the zoom level has changed.

**Returns:** A method to unsubscribe.

### onActiveChanged()

Subscribe to changes to the active scene rendered by the engine.
```javascript
const unsubscribe = engine.scene.onActiveChanged(() => {
  const newActiveScene = engine.scene.get();
});
```

```typescript
onActiveChanged(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - This function is called at the end of the engine update, if the active scene has changed.

**Returns:** A method to unsubscribe.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).