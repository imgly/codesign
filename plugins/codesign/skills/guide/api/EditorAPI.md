# EditorAPI

## Event Subscriptions

### onStateChanged()

Subscribe to editor state changes.

```typescript
onStateChanged(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - Function called when the editor state changes.

**Returns:** A method to unsubscribe from the event.

### onHistoryUpdated() *(deprecated)*

Subscribe to undo/redo history changes.

```typescript
onHistoryUpdated(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - Function called when the undo/redo history changes.

**Returns:** A method to unsubscribe from the event.

### onHistoryUpdatedWithKind()

Subscribe to undo/redo history changes.
The callback receives a {@link HistoryUpdate} describing what kind of update happened so consumers can
distinguish a real change to the active history's snapshots (e.g. an edit, undo, or redo) from a pure activation
via `setActiveHistory`.
```javascript
const unsubscribe = engine.editor.onHistoryUpdatedWithKind((kind) => {
  if (kind === 'Activated') {
    // The active history was switched; no scene change happened on this event.
    return;
  }
  const canUndo = engine.editor.canUndo();
  const canRedo = engine.editor.canRedo();
  console.log('History updated', { canUndo, canRedo });
});
```

```typescript
onHistoryUpdatedWithKind(callback: (kind: HistoryUpdate) => void): (() => void)
```

**Parameters:**
- `callback` - Function called when the undo/redo history changes. The argument describes the kind of update.

**Returns:** A method to unsubscribe from the event.

### onSettingsChanged()

Subscribe to editor settings changes.

```typescript
onSettingsChanged(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - Function called when editor settings change.

**Returns:** A method to unsubscribe from the event.

### onRoleChanged()

Subscribe to editor role changes.
Allows reacting to role changes and updating engine settings accordingly.
The callback is triggered immediately after role changes and default settings are applied.

```typescript
onRoleChanged(callback: (role: RoleString) => void): (() => void)
```

**Parameters:**
- `callback` - Function called when the user role changes.

**Returns:** A method to unsubscribe from the event.

## Edit Mode Management

### setEditMode()

Set the editor's current edit mode.
Edit modes represent different tools or interaction states within the editor. Common ones, are "Crop" while the crop tool is shown or "Text" when inline-editing text.
```javascript
engine.editor.setEditMode('Crop');
// With a base mode
engine.editor.setEditMode('CustomMode', 'Crop');
```

```typescript
setEditMode(mode: EditMode, baseMode?: string): void
```

**Parameters:**
- `mode` - "Transform", "Crop", "Text", "Playback", "Trim", "Vector" or a custom value.
- `baseMode` - Optional base mode from which the custom mode will inherit the settings.

### getEditMode()

Get the editor's current edit mode.
Edit modes represent different tools or interaction states within the editor. Common ones, are "Crop" while the crop tool is shown or "Text" when inline-editing text.

```typescript
getEditMode(): EditMode
```

**Returns:** "Transform", "Crop", "Text", "Playback", "Trim", "Vector" or a custom value.

### getCursorType()

Get the cursor type that should be displayed.

```typescript
getCursorType(): 'Arrow' | 'Move' | 'MoveNotPermitted' | 'Resize' | 'Rotate' | 'Text' | 'Cell'
```

**Returns:** The cursor type.

### getCursorRotation()

Get the cursor rotation angle.

```typescript
getCursorRotation(): number
```

**Returns:** The angle in radians.

### getTextCursorPositionInScreenSpaceX()

Get the text cursor's x position in screen space.

```typescript
getTextCursorPositionInScreenSpaceX(): number
```

**Returns:** The text cursor's x position in screen space.

### getTextCursorPositionInScreenSpaceY()

Get the text cursor's y position in screen space.

```typescript
getTextCursorPositionInScreenSpaceY(): number
```

**Returns:** The text cursor's y position in screen space.

## Experimental

### unstable_isInteractionHappening()

Check if a user interaction is currently happening.
Detects active interactions like resize edits with drag handles or touch gestures.

```typescript
unstable_isInteractionHappening(): boolean
```

**Returns:** True if an interaction is happening.

## Vector Edit

### hasSelectedVectorNode()

Check whether a vector anchor node is currently selected in vector edit mode.

```typescript
hasSelectedVectorNode(): boolean
```

**Returns:** True if a vector anchor node is selected.

### addVectorNode()

Add a new vertex by splitting the segment after the currently selected vector node.

```typescript
addVectorNode(): void
```

### deleteVectorNode()

Delete the currently selected vector node from the path.

```typescript
deleteVectorNode(): void
```

### hasSelectedVectorControlPoint()

Check whether a vector control point handle is currently selected.

```typescript
hasSelectedVectorControlPoint(): boolean
```

### deleteSelectedVectorControlPoints()

Delete (reset) the currently selected vector control point handles.
Removes the bezier handle from the node, converting that side to a straight line.
If the node has two handles, only the selected one is removed.

```typescript
deleteSelectedVectorControlPoints(): void
```

### toggleSelectedVectorNodeSmooth()

Toggle the currently selected vector node between smooth (bezier handles)
and corner (no handles).

```typescript
toggleSelectedVectorNodeSmooth(): void
```

### setVectorEditBendMode()

Enable or disable bend mode for vector editing.
When bend mode is active, clicking an anchor node automatically toggles
it between smooth (bezier handles) and corner (no handles).

```typescript
setVectorEditBendMode(active: boolean): void
```

**Parameters:**
- `active` - true to enable bend mode, false to return to normal move mode.

### getVectorEditBendMode()

Check whether vector edit bend mode is currently active.

```typescript
getVectorEditBendMode(): boolean
```

**Returns:** true if bend mode is active.

### setVectorEditAddMode()

Enable or disable add mode for vector editing.
When add mode is active, clicking on a path segment inserts a new anchor
point at the click position. Mutually exclusive with bend and delete modes.

```typescript
setVectorEditAddMode(active: boolean): void
```

**Parameters:**
- `active` - true to enable add mode, false to return to normal move mode.

### getVectorEditAddMode()

Check whether vector edit add mode is currently active.

```typescript
getVectorEditAddMode(): boolean
```

**Returns:** true if add mode is active.

### setVectorEditDeleteMode()

Enable or disable delete mode for vector editing.
When delete mode is active, clicking an anchor node instantly deletes it
from the path. Mutually exclusive with bend and add modes.

```typescript
setVectorEditDeleteMode(active: boolean): void
```

**Parameters:**
- `active` - true to enable delete mode, false to return to normal move mode.

### getVectorEditDeleteMode()

Check whether vector edit delete mode is currently active.

```typescript
getVectorEditDeleteMode(): boolean
```

**Returns:** true if delete mode is active.

### setSelectedVectorNodeMirrorMode()

Set the bezier handle mirror mode for the currently selected vector node.
Mirror modes control how the opposite handle behaves when one handle is dragged:
- 0 (None): handles move independently
- 1 (AngleAndLength): the opposite handle mirrors both angle and length
- 2 (AngleOnly): the opposite handle mirrors the angle but keeps its own length

```typescript
setSelectedVectorNodeMirrorMode(mode: number): void
```

**Parameters:**
- `mode` - The mirror mode (0, 1, or 2).

### getSelectedVectorNodeMirrorMode()

Get the bezier handle mirror mode of the currently selected vector node.

```typescript
getSelectedVectorNodeMirrorMode(): number
```

**Returns:** The mirror mode as a number (0 = None, 1 = AngleAndLength, 2 = AngleOnly).

## History Management

### createHistory()

Create a new undo/redo history stack.
Multiple histories can exist, but only one can be active at a time.
```javascript
const newHistory = engine.editor.createHistory();
```

```typescript
createHistory(): HistoryId
```

**Returns:** The handle of the created history.

### destroyHistory()

Destroy a history stack and free its resources.
```javascript
engine.editor.destroyHistory(oldHistory);
```

```typescript
destroyHistory(history: HistoryId): void
```

**Parameters:**
- `history` - The history handle to destroy.

### setActiveHistory()

Set a history as the active undo/redo stack.
All other histories lose their active state. Undo/redo operations only apply to the active history.
```javascript
engine.editor.setActiveHistory(newHistory);
```

```typescript
setActiveHistory(history: HistoryId): void
```

**Parameters:**
- `history` - The history handle to make active.

### getActiveHistory()

Get the currently active history handle.
Creates a new history if none exists.
```javascript
const oldHistory = engine.editor.getActiveHistory();
```

```typescript
getActiveHistory(): HistoryId
```

**Returns:** The handle of the active history.

### addUndoStep()

Add a new history state to the undo stack.
Only adds a state if undoable changes were made since the last undo step.
```javascript
  engine.editor.addUndoStep();
```

```typescript
addUndoStep(): void
```

### removeUndoStep()

Remove the last history state from the undo stack.
Removes the most recent undo step if available.
```javascript
  engine.editor.removeUndoStep();
```

```typescript
removeUndoStep(): void
```

### undo()

Undo one step in the active history if an undo step is available.
```javascript
engine.editor.undo();
```

```typescript
undo(): void
```

### redo()

Redo one step in the active history if a redo step is available.
```javascript
engine.editor.redo();
```

```typescript
redo(): void
```

### canUndo()

Check if an undo step is available.
```javascript
if (engine.editor.canUndo()) {
  engine.editor.undo();
}
```

```typescript
canUndo(): boolean
```

**Returns:** True if an undo step is available.

### canRedo()

Check if a redo step is available.
```javascript
if (engine.editor.canRedo()) {
  engine.editor.redo();
}
```

```typescript
canRedo(): boolean
```

**Returns:** True if a redo step is available.

## Editor Settings

### setSetting<K extends SettingKey>()

Set a setting value using the unified API.
The value type is automatically validated based on the key.

```typescript
setSetting<K extends SettingKey>(keypath: OptionalPrefix<K>, value: SettingValueType<K>): void
```

**Parameters:**
- `keypath` - The setting key from Settings
- `value` - The value to set (type-safe based on key)

### getSetting<K extends SettingKey>()

Get a setting value using the unified API.
The return type is automatically inferred from the key.

```typescript
getSetting<K extends SettingKey>(keypath: OptionalPrefix<K>): SettingValueType<K>
```

**Parameters:**
- `keypath` - The setting key from Settings

**Returns:** The value of the setting (type-safe based on key)

### setSettingBool()

Set a boolean setting value.

```typescript
setSettingBool(keypath: SettingsBool, value: boolean): void
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickToCropEnabled`.
- `value` - The boolean value to set.

### getSettingBool()

Get a boolean setting value.

```typescript
getSettingBool(keypath: SettingsBool): boolean
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickToCropEnabled`.

**Returns:** The boolean value of the setting.

### setSettingInt()

Set an integer setting value.

```typescript
setSettingInt(keypath: SettingsInt, value: number): void
```

**Parameters:**
- `keypath` - The settings keypath.
- `value` - The integer value to set.

### getSettingInt()

Get an integer setting value.

```typescript
getSettingInt(keypath: SettingsInt): number
```

**Parameters:**
- `keypath` - The settings keypath.

**Returns:** The integer value of the setting.

### setSettingFloat()

Set a float setting value.

```typescript
setSettingFloat(keypath: SettingsFloat, value: number): void
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `positionSnappingThreshold`.
- `value` - The float value to set.

### getSettingFloat()

Get a float setting value.

```typescript
getSettingFloat(keypath: SettingsFloat): number
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `positionSnappingThreshold`.

**Returns:** The float value of the setting.

### setSettingString()

Set a string setting value.

```typescript
setSettingString(keypath: SettingsString, value: string): void
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `license`.
- `value` - The string value to set.

### getSettingString()

Get a string setting value.

```typescript
getSettingString(keypath: SettingsString): string
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `license`.

**Returns:** The string value of the setting.

### setSettingColor()

Set a color setting.

```typescript
setSettingColor(keypath: SettingsColor, value: Color): void
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `highlightColor`.
- `value` - The The value to set.

### getSettingColor()

Get a color setting.

```typescript
getSettingColor(keypath: SettingsColor): Color
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `highlightColor`.

### setSettingEnum<T extends keyof SettingEnumType>()

Set an enum setting.

```typescript
setSettingEnum<T extends keyof SettingEnumType>(keypath: T, value: SettingEnumType[T]): void
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickSelectionMode`.
- `value` - The enum value as string.

### getSettingEnum<T extends keyof SettingEnumType>()

Get an enum setting.

```typescript
getSettingEnum<T extends keyof SettingEnumType>(keypath: T): SettingEnumType[T]
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickSelectionMode`.

**Returns:** The value as string.

### getSettingEnumOptions<T extends keyof SettingEnumType>()

Get the possible enum options for a given enum setting.

```typescript
getSettingEnumOptions<T extends keyof SettingEnumType>(keypath: T): SettingEnumType[T][]
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickSelectionMode`.

**Returns:** The possible enum options as strings.

### findAllSettings()

Returns a list of all the settings available.

```typescript
findAllSettings(): string[]
```

**Returns:** A list of settings keypaths.

### getSettingType()

Returns the type of a setting.

```typescript
getSettingType(keypath: string): SettingType
```

**Parameters:**
- `keypath` - The settings keypath, e.g. `doubleClickSelectionMode`.

**Returns:** The setting type.

### setURIResolver()

Sets a custom URI resolver.
This function can be called more than once. Subsequent calls will overwrite previous calls.
To remove a previously set resolver, pass `null` or `undefined`.
`setURIResolver` and `setURIResolverAsync` share one resolver slot, so a
call to either one replaces the resolver set by the other.
The given function must return an absolute path with a scheme and cannot be asynchronous. The input is allowed to be an invalid URI, e.g., due to placeholders.
```javascript
// Replace all .jpg files with the IMG.LY logo
engine.editor.setURIResolver((uri) => {
  if (uri.endsWith('.jpg')) {
    return 'https://img.ly/static/ubq_samples/imgly_logo.jpg';
  }
  // Make use of the default URI resolution behavior.
  return engine.editor.defaultURIResolver(uri);
});
```

```typescript
setURIResolver(resolver?: SyncURIResolver | null): void
```

**Parameters:**
- `resolver` - Custom resolution function. The resolution function
                  should not reference variables outside of its scope.
                  It receives the default URI resolver as its second argument

### setURIResolverAsync()

Sets a custom async URI resolver.
This function can be called more than once. Subsequent calls will overwrite previous calls.
To remove a previously set resolver, pass `null` or `undefined`.
`setURIResolver` and `setURIResolverAsync` share one resolver slot, so a
call to either one replaces the resolver set by the other.
The given function must return an absolute path with a scheme. The input is allowed to be invalid URI, e.g., due
to placeholders.

```typescript
setURIResolverAsync(resolver?: AsyncURIResolver | null): void
```

**Parameters:**
- `resolver` - Custom async resolution function.

### defaultURIResolver()

This is the default implementation for the URI resolver.
It resolves the given path relative to the `basePath` setting.
```javascript
engine.editor.defaultURIResolver(uri);
```

```typescript
defaultURIResolver(relativePath: string): string
```

**Parameters:**
- `relativePath` - The relative path that should be resolved.

**Returns:** The resolved absolute URI.

### getAbsoluteURI()

Resolves the given path asynchronously.
If a custom resolver has been set with `setURIResolverAsync` (or `setURIResolver`), it invokes it with the given
path. Else, it resolves it as relative to the `basePath` setting.
This performs NO validation of whether a file exists at the specified location.
**Breaking change:** This method now returns a `Promise<string>` instead
of a plain `string`. Callers must `await` the result.

```typescript
getAbsoluteURI(relativePath: string): Promise<string>
```

**Parameters:**
- `relativePath` - A relative path string

**Returns:** Promise resolving to the resolved absolute uri or rejecting if an invalid path was given.

## Role & Scope Management

### setRole()

Set the user role and apply role-dependent defaults.
Automatically configures scopes and settings based on the specified role.

```typescript
setRole(role: RoleString): void
```

**Parameters:**
- `role` - The role to assign to the user.

### getRole()

Get the current user role.

```typescript
getRole(): RoleString
```

**Returns:** The current role of the user.

### findAllScopes()

Get all available global scope names.

```typescript
findAllScopes(): Scope[]
```

**Returns:** The names of all available global scopes.

### setGlobalScope()

Set a global scope permission level.

```typescript
setGlobalScope(key: Scope, value: 'Allow' | 'Deny' | 'Defer'): void
```

**Parameters:**
- `key` - The scope to configure.
- `value` - `Allow` always allows, `Deny` always denies, `Defer` defers to block-level.

### getGlobalScope()

Get a global scope's permission level.

```typescript
getGlobalScope(key: Scope): 'Allow' | 'Deny' | 'Defer'
```

**Parameters:**
- `key` - The scope to query.

**Returns:** `Allow`, `Deny`, or `Defer` indicating the scope's permission level.

## System Information

Access memory usage, export limits, and system capabilities.

### getAvailableMemory()

Get the currently available memory.

```typescript
getAvailableMemory(): number
```

**Returns:** The available memory in bytes.

### getUsedMemory()

Get the engine's current memory usage.

```typescript
getUsedMemory(): number
```

**Returns:** The current memory usage in bytes.

### getMaxExportSize()

Get the maximum export size limit for the current device.
Exports are only possible when both width and height are below this limit.
Note that exports may still fail due to other constraints like memory.

```typescript
getMaxExportSize(): number
```

**Returns:** The upper export size limit in pixels, or maximum 32-bit integer if unlimited.

## Color Management

### findAllSpotColors()

Get all spot color names currently defined.

```typescript
findAllSpotColors(): string[]
```

**Returns:** The names of all defined spot colors.

### getSpotColorRGBA()

Queries the RGB representation set for a spot color.
If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta).
The alpha value is always 1.0.

```typescript
getSpotColorRGBA(name: string): RGBA
```

**Parameters:**
- `name` - The name of a spot color.

**Returns:** A result holding a float array of the four color components.

### getSpotColorCMYK()

Queries the CMYK representation set for a spot color.
If the value of the queried spot color has not been set yet, returns the default CMYK representation (of magenta).

```typescript
getSpotColorCMYK(name: string): CMYK
```

**Parameters:**
- `name` - The name of a spot color.

**Returns:** A result holding a float array of the four color components.

### setSpotColorRGB()

Sets the RGB representation of a spot color.
Use this function to both create a new spot color or update an existing spot color.

```typescript
setSpotColorRGB(name: string, r: number, g: number, b: number): void
```

**Parameters:**
- `name` - The name of a spot color.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.

### setSpotColorCMYK()

Sets the CMYK representation of a spot color.
Use this function to both create a new spot color or update an existing spot color.

```typescript
setSpotColorCMYK(name: string, c: number, m: number, y: number, k: number): void
```

**Parameters:**
- `name` - The name of a spot color.
- `c` - The cyan color component in the range of 0 to 1.
- `m` - The magenta color component in the range of 0 to 1.
- `y` - The yellow color component in the range of 0 to 1.
- `k` - The key color component in the range of 0 to 1.

### removeSpotColor()

Removes a spot color from the list of set spot colors.

```typescript
removeSpotColor(name: string): void
```

**Parameters:**
- `name` - The name of a spot color.

**Returns:** An empty result on success, an error otherwise.

### setSpotColorForCutoutType()

Set the spot color assign to a cutout type.
All cutout blocks of the given type will be immediately assigned that spot color.

```typescript
setSpotColorForCutoutType(type: CutoutType, color: string): void
```

**Parameters:**
- `type` - The cutout type.
- `color` - The spot color name to assign.

### getSpotColorForCutoutType()

Get the name of the spot color assigned to a cutout type.

```typescript
getSpotColorForCutoutType(type: CutoutType): string
```

**Parameters:**
- `type` - The cutout type.

**Returns:** The color spot name.

### convertColorToColorSpace()

Converts a color to the given color space.

```typescript
convertColorToColorSpace(color: Color, colorSpace: 'sRGB'): RGBAColor
```

**Parameters:**
- `color` - The color to convert.
- `colorSpace` - The color space to convert to.

**Returns:** The converted color.

## Resource Management

### createBuffer()

Create a resizable buffer for arbitrary data.
```javascript
const buffer = engine.editor.createBuffer();
// Reference the buffer resource from the audio block
engine.block.setString(audioBlock, 'audio/fileURI', buffer);
```

```typescript
createBuffer(): string
```

**Returns:** A URI to identify the created buffer.

### destroyBuffer()

Destroy a buffer and free its resources.
```javascript
engine.editor.destroyBuffer(buffer);
```

```typescript
destroyBuffer(uri: string): void
```

**Parameters:**
- `uri` - The URI of the buffer to destroy.

### setBufferData()

Set the data of a buffer at a given offset.
```javascript
// Generate 10 seconds of stereo 48 kHz audio data
const samples = new Float32Array(10 * 2 * 48000);
for (let i = 0; i < samples.length; i += 2) {
  samples[i] = samples[i + 1] = Math.sin((440 * i * Math.PI) / 48000);
}
// Assign the audio data to the buffer
engine.editor.setBufferData(buffer, 0, new Uint8Array(samples.buffer));
```

```typescript
setBufferData(uri: string, offset: number, data: Uint8Array): void
```

**Parameters:**
- `uri` - The URI of the buffer to update.
- `offset` - The offset in bytes at which to start writing.
- `data` - The data to write.

### getBufferData()

Get the data of a buffer at a given offset.
```javascript
engine.editor.findAllTransientResources().forEach((resource) => {
  const bufferURI = resource.URL;
  const length = engine.editor.getBufferLength(buffer);
  const data = engine.editor.getBufferData(buffer, 0, length);
  const blob = new Blob([data]);
})
```

```typescript
getBufferData(uri: string, offset: number, length: number): Uint8Array
```

**Parameters:**
- `uri` - The URI of the buffer to query.
- `offset` - The offset in bytes at which to start reading.
- `length` - The number of bytes to read.

**Returns:** The data at the given offset.

### setBufferLength()

Set the length of a buffer.
```javascript
// Reduce the buffer to half its length
const currentLength = engine.editor.getBufferLength(buffer);
engine.editor.setBufferLength(buffer, currentLength / 2);
```

```typescript
setBufferLength(uri: string, length: number): void
```

**Parameters:**
- `uri` - The URI of the buffer to update.
- `length` - The new length of the buffer in bytes.

### getBufferLength()

Get the length of a buffer.
```javascript
const length = engine.editor.getBufferLength(buffer);
```

```typescript
getBufferLength(uri: string): number
```

**Parameters:**
- `uri` - The URI of the buffer to query.

**Returns:** The length of the buffer in bytes.

### getMimeType()

Get the MIME type of a resource.
Downloads the resource if not already cached.

```typescript
getMimeType(uri: string): Promise<string>
```

**Parameters:**
- `uri` - The URI of the resource.

**Returns:** Promise resolving to the resource's MIME type.

### getFontMetrics()

Gets the font metrics for a given font file URI.
If the font is not yet loaded, it will be fetched asynchronously.
The returned metrics are in the font's design units coordinate space.
```javascript
const metrics = await engine.editor.getFontMetrics('/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf');
console.log(metrics.ascender, metrics.descender, metrics.unitsPerEm);
console.log(metrics.lineGap);
console.log(metrics.capHeight, metrics.xHeight);
console.log(metrics.underlineOffset, metrics.underlineSize, metrics.strikeoutOffset, metrics.strikeoutSize);
```

```typescript
getFontMetrics(fontFileUri: string): Promise<FontMetrics>
```

**Parameters:**
- `fontFileUri` - The URI of the font file to get metrics from.

**Returns:** A promise resolving to the font metrics.

### findAllTransientResources()

Get all transient resources that would be lost during export.
Useful for identifying resources that need relocation (e.g., to a CDN) before export,
as these resources are not included in the exported scene.

```typescript
findAllTransientResources(): TransientResource[]
```

**Returns:** The URLs and sizes of transient resources.

### findAllMediaURIs()

Get all media URIs referenced by blocks in the scene.
Returns URIs from image fills, video fills, and audio blocks, including their source sets.
Only returns valid media URIs (http://, https://, file://), excluding transient resources
like buffer URIs. Useful for determining which media files are referenced by a scene
(e.g., for cleanup operations, CDN management, or file system tracking).

```typescript
findAllMediaURIs(): string[]
```

**Returns:** The URLs of all media resources referenced in the scene, deduplicated.

### getResourceData()

Provides the data of a resource at the given URL.

```typescript
getResourceData(uri: string, chunkSize: number, onData: (result: Uint8Array) => boolean): void
```

**Parameters:**
- `uri` - The URL of the resource.
- `chunkSize` - The size of the chunks in which the resource data is provided.
- `onData` - The callback function that is called with the resource data or an error if an error occurred.
The callback will be called as long as there is data left to provide and the callback returns `true`.

### relocateResource()

Changes the URL associated with a resource.
This function can be used change the URL of a resource that has been relocated (e.g., to a CDN).

```typescript
relocateResource(currentUrl: string, relocatedUrl: string): void
```

**Parameters:**
- `currentUrl` - The current URL of the resource.
- `relocatedUrl` - The new URL of the resource.

## Viewport

### setSafeAreaInsets()

Set global safe area insets for UI overlays.
Safe area insets define UI-safe regions by specifying padding from screen edges.
These insets are automatically applied to all camera operations (zoom, pan, clamping)
to ensure important content remains visible when UI elements overlap the viewport edges.
Set to zero to disable (default state).

```typescript
setSafeAreaInsets(insets: {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
    }): void
```

**Parameters:**
- `insets` - The inset values in CSS pixels (device-independent)

### getSafeAreaInsets()

Get the current global safe area insets configuration.

```typescript
getSafeAreaInsets(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
```

**Returns:** The current inset values in CSS pixels (device-independent)

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).