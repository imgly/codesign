> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>EditorAPI</code></p>
  </summary>
</details>

## Role & Scope Management

<details>
  <summary>
    ### setRole()

    <br /><p>Set the user role and apply role-dependent defaults.</p>
  </summary>

  Automatically configures scopes and settings based on the specified role.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `role` | [`RoleString`](./api/node/type-aliases/rolestring.md) | The role to assign to the user. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setRole(role: RoleString): void
  ```

  ***
</details>

<details>
  <summary>
    ### getRole()

    <br /><p>Get the current user role.</p>
  </summary>

  #### Returns

  [`RoleString`](./api/node/type-aliases/rolestring.md)

  The current role of the user.

  #### Signature

  ```typescript
  getRole(): RoleString
  ```

  ***
</details>

<details>
  <summary>
    ### findAllScopes()

    <br /><p>Get all available global scope names.</p>
  </summary>

  #### Returns

  [`Scope`](./api/node/type-aliases/scope.md)\[]

  The names of all available global scopes.

  #### Signature

  ```typescript
  findAllScopes(): Scope[]
  ```

  ***
</details>

<details>
  <summary>
    ### setGlobalScope()

    <br /><p>Set a global scope permission level.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | [`Scope`](./api/node/type-aliases/scope.md) | The scope to configure. |
  | `value` | `"Allow"` | `"Deny"` | `"Defer"` | `Allow` always allows, `Deny` always denies, `Defer` defers to block-level. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setGlobalScope(key: Scope, value: "Allow" | "Deny" | "Defer"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalScope()

    <br /><p>Get a global scope's permission level.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | [`Scope`](./api/node/type-aliases/scope.md) | The scope to query. |

  #### Returns

  `"Allow"` | `"Deny"` | `"Defer"`

  `Allow`, `Deny`, or `Defer` indicating the scope's permission level.

  #### Signature

  ```typescript
  getGlobalScope(key: Scope): "Allow" | "Deny" | "Defer"
  ```
</details>

## Event Subscriptions

<details>
  <summary>
    ### onStateChanged

    <br /><p>Subscribe to editor state changes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | Function called when the editor state changes. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### ~~onHistoryUpdated~~

    <br /><p>Subscribe to undo/redo history changes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | Function called when the undo/redo history changes. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  #### Deprecated

  Use [onHistoryUpdatedWithKind](./api/node/classes/editorapi.md) instead, which additionally reports a [HistoryUpdate](./api/node/type-aliases/historyupdate.md)
  describing the kind of update.

  ***
</details>

<details>
  <summary>
    ### onHistoryUpdatedWithKind

    <br /><p>Subscribe to undo/redo history changes.</p>
  </summary>

  The callback receives a [HistoryUpdate](./api/node/type-aliases/historyupdate.md) describing what kind of update happened so consumers can
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

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`kind`) => `void` | Function called when the undo/redo history changes. The argument describes the kind of update. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onSettingsChanged

    <br /><p>Subscribe to editor settings changes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | Function called when editor settings change. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onRoleChanged

    <br /><p>Subscribe to editor role changes.</p>
  </summary>

  Allows reacting to role changes and updating engine settings accordingly.
  The callback is triggered immediately after role changes and default settings are applied.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`role`) => `void` | Function called when the user role changes. |

  #### Returns

  A method to unsubscribe from the event.

  () => `void`
</details>

## Edit Mode Management

<details>
  <summary>
    ### setEditMode()

    <br /><p>Set the editor's current edit mode.</p>
  </summary>

  Edit modes represent different tools or interaction states within the editor. Common ones, are "Crop" while the crop tool is shown or "Text" when inline-editing text.

  ```javascript
  engine.editor.setEditMode('Crop');
  // With a base mode
  engine.editor.setEditMode('CustomMode', 'Crop');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `mode` | [`EditMode`](./api/node/type-aliases/editmode.md) | "Transform", "Crop", "Text", "Playback", "Trim", "Vector" or a custom value. |
  | `baseMode?` | `string` | Optional base mode from which the custom mode will inherit the settings. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setEditMode(mode: EditMode, baseMode?: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getEditMode()

    <br /><p>Get the editor's current edit mode.</p>
  </summary>

  Edit modes represent different tools or interaction states within the editor. Common ones, are "Crop" while the crop tool is shown or "Text" when inline-editing text.

  #### Returns

  [`EditMode`](./api/node/type-aliases/editmode.md)

  "Transform", "Crop", "Text", "Playback", "Trim", "Vector" or a custom value.

  #### Signature

  ```typescript
  getEditMode(): EditMode
  ```

  ***
</details>

<details>
  <summary>
    ### getCursorType()

    <br /><p>Get the cursor type that should be displayed.</p>
  </summary>

  #### Returns

  | `"Text"`
  | `"Arrow"`
  | `"Move"`
  | `"MoveNotPermitted"`
  | `"Resize"`
  | `"Rotate"`
  | `"Cell"`

  The cursor type.

  #### Signature

  ```typescript
  getCursorType(): "Text" | "Arrow" | "Move" | "MoveNotPermitted" | "Resize" | "Rotate" | "Cell"
  ```

  ***
</details>

<details>
  <summary>
    ### getCursorRotation()

    <br /><p>Get the cursor rotation angle.</p>
  </summary>

  #### Returns

  `number`

  The angle in radians.

  #### Signature

  ```typescript
  getCursorRotation(): number
  ```

  ***
</details>

<details>
  <summary>
    ### getTextCursorPositionInScreenSpaceX()

    <br /><p>Get the text cursor's x position in screen space.</p>
  </summary>

  #### Returns

  `number`

  The text cursor's x position in screen space.

  #### Signature

  ```typescript
  getTextCursorPositionInScreenSpaceX(): number
  ```

  ***
</details>

<details>
  <summary>
    ### getTextCursorPositionInScreenSpaceY()

    <br /><p>Get the text cursor's y position in screen space.</p>
  </summary>

  #### Returns

  `number`

  The text cursor's y position in screen space.

  #### Signature

  ```typescript
  getTextCursorPositionInScreenSpaceY(): number
  ```
</details>

## History Management

<details>
  <summary>
    ### createHistory()

    <br /><p>Create a new undo/redo history stack.</p>
  </summary>

  Multiple histories can exist, but only one can be active at a time.

  ```javascript
  const newHistory = engine.editor.createHistory();
  ```

  #### Returns

  `number`

  The handle of the created history.

  #### Signature

  ```typescript
  createHistory(): number
  ```

  ***
</details>

<details>
  <summary>
    ### destroyHistory()

    <br /><p>Destroy a history stack and free its resources.</p>
  </summary>

  ```javascript
  engine.editor.destroyHistory(oldHistory);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `history` | `number` | The history handle to destroy. |

  #### Returns

  `void`

  #### Throws

  Error if the handle doesn't refer to a valid history.

  #### Signature

  ```typescript
  destroyHistory(history: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setActiveHistory()

    <br /><p>Set a history as the active undo/redo stack.</p>
  </summary>

  All other histories lose their active state. Undo/redo operations only apply to the active history.

  ```javascript
  engine.editor.setActiveHistory(newHistory);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `history` | `number` | The history handle to make active. |

  #### Returns

  `void`

  #### Throws

  Error if the handle doesn't refer to a valid history.

  #### Signature

  ```typescript
  setActiveHistory(history: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getActiveHistory()

    <br /><p>Get the currently active history handle.</p>
  </summary>

  Creates a new history if none exists.

  ```javascript
  const oldHistory = engine.editor.getActiveHistory();
  ```

  #### Returns

  `number`

  The handle of the active history.

  #### Signature

  ```typescript
  getActiveHistory(): number
  ```

  ***
</details>

<details>
  <summary>
    ### addUndoStep()

    <br /><p>Add a new history state to the undo stack.</p>
  </summary>

  Only adds a state if undoable changes were made since the last undo step.

  ```javascript
    engine.editor.addUndoStep();
  ```

  #### Returns

  `void`

  #### Signature

  ```typescript
  addUndoStep(): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeUndoStep()

    <br /><p>Remove the last history state from the undo stack.</p>
  </summary>

  Removes the most recent undo step if available.

  ```javascript
    engine.editor.removeUndoStep();
  ```

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeUndoStep(): void
  ```

  ***
</details>

<details>
  <summary>
    ### undo()

    <br /><p>Undo one step in the active history if an undo step is available.</p>
  </summary>

  ```javascript
  engine.editor.undo();
  ```

  #### Returns

  `void`

  #### Signature

  ```typescript
  undo(): void
  ```

  ***
</details>

<details>
  <summary>
    ### redo()

    <br /><p>Redo one step in the active history if a redo step is available.</p>
  </summary>

  ```javascript
  engine.editor.redo();
  ```

  #### Returns

  `void`

  #### Signature

  ```typescript
  redo(): void
  ```

  ***
</details>

<details>
  <summary>
    ### canUndo()

    <br /><p>Check if an undo step is available.</p>
  </summary>

  ```javascript
  if (engine.editor.canUndo()) {
    engine.editor.undo();
  }
  ```

  #### Returns

  `boolean`

  True if an undo step is available.

  #### Signature

  ```typescript
  canUndo(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### canRedo()

    <br /><p>Check if a redo step is available.</p>
  </summary>

  ```javascript
  if (engine.editor.canRedo()) {
    engine.editor.redo();
  }
  ```

  #### Returns

  `boolean`

  True if a redo step is available.

  #### Signature

  ```typescript
  canRedo(): boolean
  ```
</details>

## Color Management

<details>
  <summary>
    ### findAllSpotColors()

    <br /><p>Get all spot color names currently defined.</p>
  </summary>

  #### Returns

  `string`\[]

  The names of all defined spot colors.

  #### Signature

  ```typescript
  findAllSpotColors(): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### getSpotColorRGBA()

    <br /><p>Queries the RGB representation set for a spot color.</p>
  </summary>

  If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta).
  The alpha value is always 1.0.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name of a spot color. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  A result holding a float array of the four color components.

  #### Signature

  ```typescript
  getSpotColorRGBA(name: string): RGBA
  ```

  ***
</details>

<details>
  <summary>
    ### getSpotColorCMYK()

    <br /><p>Queries the CMYK representation set for a spot color.</p>
  </summary>

  If the value of the queried spot color has not been set yet, returns the default CMYK representation (of magenta).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name of a spot color. |

  #### Returns

  [`CMYK`](./api/node/type-aliases/cmyk.md)

  A result holding a float array of the four color components.

  #### Signature

  ```typescript
  getSpotColorCMYK(name: string): CMYK
  ```

  ***
</details>

<details>
  <summary>
    ### setSpotColorRGB()

    <br /><p>Sets the RGB representation of a spot color.</p>
  </summary>

  Use this function to both create a new spot color or update an existing spot color.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name of a spot color. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSpotColorRGB(name: string, r: number, g: number, b: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setSpotColorCMYK()

    <br /><p>Sets the CMYK representation of a spot color.</p>
  </summary>

  Use this function to both create a new spot color or update an existing spot color.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name of a spot color. |
  | `c` | `number` | The cyan color component in the range of 0 to 1. |
  | `m` | `number` | The magenta color component in the range of 0 to 1. |
  | `y` | `number` | The yellow color component in the range of 0 to 1. |
  | `k` | `number` | The key color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSpotColorCMYK(name: string, c: number, m: number, y: number, k: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeSpotColor()

    <br /><p>Removes a spot color from the list of set spot colors.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name of a spot color. |

  #### Returns

  `void`

  An empty result on success, an error otherwise.

  #### Signature

  ```typescript
  removeSpotColor(name: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### setSpotColorForCutoutType()

    <br /><p>Set the spot color assign to a cutout type.</p>
  </summary>

  All cutout blocks of the given type will be immediately assigned that spot color.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | `"Dashed"` | `"Solid"` | The cutout type. |
  | `color` | `string` | The spot color name to assign. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSpotColorForCutoutType(type: "Dashed" | "Solid", color: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSpotColorForCutoutType()

    <br /><p>Get the name of the spot color assigned to a cutout type.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | `"Dashed"` | `"Solid"` | The cutout type. |

  #### Returns

  `string`

  The color spot name.

  #### Signature

  ```typescript
  getSpotColorForCutoutType(type: "Dashed" | "Solid"): string
  ```

  ***
</details>

<details>
  <summary>
    ### convertColorToColorSpace()

    <br /><p>Converts a color to the given color space.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `color` | [`Color`](./api/node/type-aliases/color.md) | The color to convert. |
  | `colorSpace` | `"sRGB"` | The color space to convert to. |

  ##### Returns

  [`RGBAColor`](./api/node/interfaces/rgbacolor.md)

  The converted color.

  #### Call Signature

  ```ts
  convertColorToColorSpace(color, colorSpace): CMYKColor;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `color` | [`Color`](./api/node/type-aliases/color.md) |
  | `colorSpace` | `"CMYK"` |

  ##### Returns

  [`CMYKColor`](./api/node/interfaces/cmykcolor.md)

  #### Call Signature

  ```ts
  convertColorToColorSpace(color, colorSpace): never;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `color` | [`Color`](./api/node/type-aliases/color.md) |
  | `colorSpace` | [`ColorSpace`](./api/node/type-aliases/colorspace.md) |

  ##### Returns

  `never`

  #### Signatures

  ```typescript
  convertColorToColorSpace(color: Color, colorSpace: "sRGB"): RGBAColor
  ```

  ```typescript
  convertColorToColorSpace(color: Color, colorSpace: "CMYK"): CMYKColor
  ```

  ```typescript
  convertColorToColorSpace(color: Color, colorSpace: ColorSpace): never
  ```
</details>

## Resource Management

<details>
  <summary>
    ### createBuffer()

    <br /><p>Create a resizable buffer for arbitrary data.</p>
  </summary>

  ```javascript
  const buffer = engine.editor.createBuffer();

  // Reference the buffer resource from the audio block
  engine.block.setString(audioBlock, 'audio/fileURI', buffer);
  ```

  #### Returns

  `string`

  A URI to identify the created buffer.

  #### Signature

  ```typescript
  createBuffer(): string
  ```

  ***
</details>

<details>
  <summary>
    ### destroyBuffer()

    <br /><p>Destroy a buffer and free its resources.</p>
  </summary>

  ```javascript
  engine.editor.destroyBuffer(buffer);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the buffer to destroy. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  destroyBuffer(uri: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### setBufferData()

    <br /><p>Set the data of a buffer at a given offset.</p>
  </summary>

  ```javascript
  // Generate 10 seconds of stereo 48 kHz audio data
  const samples = new Float32Array(10 * 2 * 48000);
  for (let i = 0; i < samples.length; i += 2) {
    samples[i] = samples[i + 1] = Math.sin((440 * i * Math.PI) / 48000);
  }
  // Assign the audio data to the buffer
  engine.editor.setBufferData(buffer, 0, new Uint8Array(samples.buffer));
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the buffer to update. |
  | `offset` | `number` | The offset in bytes at which to start writing. |
  | `data` | `Uint8Array` | The data to write. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBufferData(uri: string, offset: number, data: Uint8Array): void
  ```

  ***
</details>

<details>
  <summary>
    ### getBufferData()

    <br /><p>Get the data of a buffer at a given offset.</p>
  </summary>

  ```javascript
  engine.editor.findAllTransientResources().forEach((resource) => {
    const bufferURI = resource.URL;
    const length = engine.editor.getBufferLength(buffer);
    const data = engine.editor.getBufferData(buffer, 0, length);
    const blob = new Blob([data]);
  })
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the buffer to query. |
  | `offset` | `number` | The offset in bytes at which to start reading. |
  | `length` | `number` | The number of bytes to read. |

  #### Returns

  `Uint8Array`

  The data at the given offset.

  #### Signature

  ```typescript
  getBufferData(uri: string, offset: number, length: number): Uint8Array
  ```

  ***
</details>

<details>
  <summary>
    ### setBufferLength()

    <br /><p>Set the length of a buffer.</p>
  </summary>

  ```javascript
  // Reduce the buffer to half its length
  const currentLength = engine.editor.getBufferLength(buffer);
  engine.editor.setBufferLength(buffer, currentLength / 2);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the buffer to update. |
  | `length` | `number` | The new length of the buffer in bytes. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBufferLength(uri: string, length: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getBufferLength()

    <br /><p>Get the length of a buffer.</p>
  </summary>

  ```javascript
  const length = engine.editor.getBufferLength(buffer);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the buffer to query. |

  #### Returns

  `number`

  The length of the buffer in bytes.

  #### Signature

  ```typescript
  getBufferLength(uri: string): number
  ```

  ***
</details>

<details>
  <summary>
    ### getMimeType()

    <br /><p>Get the MIME type of a resource.</p>
  </summary>

  Downloads the resource if not already cached.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI of the resource. |

  #### Returns

  `Promise`\<`string`>

  Promise resolving to the resource's MIME type.

  #### Throws

  Error if the resource cannot be downloaded or MIME type determined.

  #### Signature

  ```typescript
  getMimeType(uri: string): Promise<string>
  ```

  ***
</details>

<details>
  <summary>
    ### getFontMetrics()

    <br /><p>Gets the font metrics for a given font file URI.</p>
  </summary>

  If the font is not yet loaded, it will be fetched asynchronously.
  The returned metrics are in the font's design units coordinate space.

  ```javascript
  const metrics = await engine.editor.getFontMetrics('/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf');
  console.log(metrics.ascender, metrics.descender, metrics.unitsPerEm);
  console.log(metrics.lineGap);
  console.log(metrics.capHeight, metrics.xHeight);
  console.log(metrics.underlineOffset, metrics.underlineSize, metrics.strikeoutOffset, metrics.strikeoutSize);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `fontFileUri` | `string` | The URI of the font file to get metrics from. |

  #### Returns

  `Promise`\<[`FontMetrics`](./api/node/interfaces/fontmetrics.md)>

  A promise resolving to the font metrics.

  #### Signature

  ```typescript
  getFontMetrics(fontFileUri: string): Promise<FontMetrics>
  ```

  ***
</details>

<details>
  <summary>
    ### findAllTransientResources()

    <br /><p>Get all transient resources that would be lost during export.</p>
  </summary>

  Useful for identifying resources that need relocation (e.g., to a CDN) before export,
  as these resources are not included in the exported scene.

  #### Returns

  [`TransientResource`](./api/node/interfaces/transientresource.md)\[]

  The URLs and sizes of transient resources.

  #### Signature

  ```typescript
  findAllTransientResources(): TransientResource[]
  ```

  ***
</details>

<details>
  <summary>
    ### findAllMediaURIs()

    <br /><p>Get all media URIs referenced by blocks in the scene.</p>
  </summary>

  Returns URIs from image fills, video fills, and audio blocks, including their source sets.
  Only returns valid media URIs (http://, https://, file://), excluding transient resources
  like buffer URIs. Useful for determining which media files are referenced by a scene
  (e.g., for cleanup operations, CDN management, or file system tracking).

  #### Returns

  `string`\[]

  The URLs of all media resources referenced in the scene, deduplicated.

  #### Signature

  ```typescript
  findAllMediaURIs(): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### getResourceData()

    <br /><p>Provides the data of a resource at the given URL.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URL of the resource. |
  | `chunkSize` | `number` | The size of the chunks in which the resource data is provided. |
  | `onData` | (`result`) => `boolean` | The callback function that is called with the resource data or an error if an error occurred. The callback will be called as long as there is data left to provide and the callback returns `true`. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  getResourceData(uri: string, chunkSize: number, onData: (result: Uint8Array) => boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### relocateResource()

    <br /><p>Changes the URL associated with a resource.</p>
  </summary>

  This function can be used change the URL of a resource that has been relocated (e.g., to a CDN).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `currentUrl` | `string` | The current URL of the resource. |
  | `relocatedUrl` | `string` | The new URL of the resource. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  relocateResource(currentUrl: string, relocatedUrl: string): void
  ```
</details>

## Editor Settings

<details>
  <summary>
    ### setSetting()

    <br /><p>Set a setting value using the unified API.
    The value type is automatically validated based on the key.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* keyof [`Settings`](./api/node/interfaces/settings.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`OptionalPrefix`](./api/node/type-aliases/optionalprefix.md)\<`K`> | The setting key from Settings |
  | `value` | [`SettingValueType`](./api/node/type-aliases/settingvaluetype.md)\<`K`> | The value to set (type-safe based on key) |

  #### Returns

  `void`

  #### Throws

  Error if the keypath is invalid or value type doesn't match

  #### Example

  ```typescript
  // Boolean setting
  engine.editor.setSetting('doubleClickToCropEnabled', false);

  // Color setting
  engine.editor.setSetting('highlightColor', { r: 1, g: 0, b: 1, a: 1 });

  // Enum setting
  engine.editor.setSetting('doubleClickSelectionMode', 'Direct');
  ```

  #### Signature

  ```typescript
  setSetting(keypath: OptionalPrefix<K>, value: SettingValueType<K>): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSetting()

    <br /><p>Get a setting value using the unified API.
    The return type is automatically inferred from the key.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* keyof [`Settings`](./api/node/interfaces/settings.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`OptionalPrefix`](./api/node/type-aliases/optionalprefix.md)\<`K`> | The setting key from Settings |

  #### Returns

  [`SettingValueType`](./api/node/type-aliases/settingvaluetype.md)\<`K`>

  The value of the setting (type-safe based on key)

  #### Throws

  Error if the keypath is invalid

  #### Example

  ```typescript
  // Boolean setting
  const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');

  // Color setting
  const highlight = engine.editor.getSetting('highlightColor');

  // Enum setting
  const selectionMode = engine.editor.getSetting('doubleClickSelectionMode');
  ```

  #### Signature

  ```typescript
  getSetting(keypath: OptionalPrefix<K>): SettingValueType<K>
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingBool()

    <br /><p>Set a boolean setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingBoolPropertyName`](./api/node/type-aliases/settingboolpropertyname.md) | The settings keypath, e.g. `doubleClickToCropEnabled`. |
  | `value` | `boolean` | The boolean value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  setSettingBool(keypath, value): void;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |
  | `value` | `boolean` |

  ##### Returns

  `void`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Signatures

  ```typescript
  setSettingBool(keypath: SettingBoolPropertyName, value: boolean): void
  ```

  ```typescript
  setSettingBool(keypath: `ubq://${string & {}}`, value: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingBool()

    <br /><p>Get a boolean setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingBoolPropertyName`](./api/node/type-aliases/settingboolpropertyname.md) | The settings keypath, e.g. `doubleClickToCropEnabled`. |

  ##### Returns

  `boolean`

  The boolean value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  getSettingBool(keypath): boolean;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |

  ##### Returns

  `boolean`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  getSettingBool(keypath): boolean;
  ```

  Get a boolean setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingBoolPropertyName`](./api/node/type-aliases/settingboolpropertyname.md) | The settings keypath, e.g. `doubleClickToCropEnabled`. |

  ##### Returns

  `boolean`

  The boolean value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  getSettingBool(keypath: SettingBoolPropertyName): boolean
  ```

  ```typescript
  getSettingBool(keypath: `ubq://${string & {}}`): boolean
  ```

  ```typescript
  getSettingBool(keypath: SettingBoolPropertyName): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingInt()

    <br /><p>Set an integer setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingIntPropertyName`](./api/node/type-aliases/settingintpropertyname.md) | The settings keypath. |
  | `value` | `number` | The integer value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  setSettingInt(keypath, value): void;
  ```

  Set an integer setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingIntPropertyName`](./api/node/type-aliases/settingintpropertyname.md) | The settings keypath. |
  | `value` | `number` | The integer value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  setSettingInt(keypath: SettingIntPropertyName, value: number): void
  ```

  ```typescript
  setSettingInt(keypath: SettingIntPropertyName, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingInt()

    <br /><p>Get an integer setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingIntPropertyName`](./api/node/type-aliases/settingintpropertyname.md) | The settings keypath. |

  ##### Returns

  `number`

  The integer value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  getSettingInt(keypath): number;
  ```

  Get an integer setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingIntPropertyName`](./api/node/type-aliases/settingintpropertyname.md) | The settings keypath. |

  ##### Returns

  `number`

  The integer value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  getSettingInt(keypath: SettingIntPropertyName): number
  ```

  ```typescript
  getSettingInt(keypath: SettingIntPropertyName): number
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingFloat()

    <br /><p>Set a float setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingFloatPropertyName`](./api/node/type-aliases/settingfloatpropertyname.md) | The settings keypath, e.g. `positionSnappingThreshold`. |
  | `value` | `number` | The float value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  setSettingFloat(keypath, value): void;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |
  | `value` | `number` |

  ##### Returns

  `void`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  setSettingFloat(keypath, value): void;
  ```

  Set a float setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingFloatPropertyName`](./api/node/type-aliases/settingfloatpropertyname.md) | The settings keypath, e.g. `positionSnappingThreshold`. |
  | `value` | `number` | The float value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  setSettingFloat(keypath: SettingFloatPropertyName, value: number): void
  ```

  ```typescript
  setSettingFloat(keypath: `ubq://${string & {}}`, value: number): void
  ```

  ```typescript
  setSettingFloat(keypath: SettingFloatPropertyName, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingFloat()

    <br /><p>Get a float setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingFloatPropertyName`](./api/node/type-aliases/settingfloatpropertyname.md) | The settings keypath, e.g. `positionSnappingThreshold`. |

  ##### Returns

  `number`

  The float value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  getSettingFloat(keypath): number;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |

  ##### Returns

  `number`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  getSettingFloat(keypath): number;
  ```

  Get a float setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingFloatPropertyName`](./api/node/type-aliases/settingfloatpropertyname.md) | The settings keypath, e.g. `positionSnappingThreshold`. |

  ##### Returns

  `number`

  The float value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  getSettingFloat(keypath: SettingFloatPropertyName): number
  ```

  ```typescript
  getSettingFloat(keypath: `ubq://${string & {}}`): number
  ```

  ```typescript
  getSettingFloat(keypath: SettingFloatPropertyName): number
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingString()

    <br /><p>Set a string setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingStringPropertyName`](./api/node/type-aliases/settingstringpropertyname.md) | The settings keypath, e.g. `license`. |
  | `value` | `string` | The string value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  setSettingString(keypath, value): void;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |
  | `value` | `string` |

  ##### Returns

  `void`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  setSettingString(keypath, value): void;
  ```

  Set a string setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingStringPropertyName`](./api/node/type-aliases/settingstringpropertyname.md) | The settings keypath, e.g. `license`. |
  | `value` | `string` | The string value to set. |

  ##### Returns

  `void`

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  setSettingString(keypath: SettingStringPropertyName, value: string): void
  ```

  ```typescript
  setSettingString(keypath: `ubq://${string & {}}`, value: string): void
  ```

  ```typescript
  setSettingString(keypath: SettingStringPropertyName, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingString()

    <br /><p>Get a string setting value.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingStringPropertyName`](./api/node/type-aliases/settingstringpropertyname.md) | The settings keypath, e.g. `license`. |

  ##### Returns

  `string`

  The string value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Call Signature

  ```ts
  getSettingString(keypath): string;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |

  ##### Returns

  `string`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  getSettingString(keypath): string;
  ```

  Get a string setting value.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingStringPropertyName`](./api/node/type-aliases/settingstringpropertyname.md) | The settings keypath, e.g. `license`. |

  ##### Returns

  `string`

  The string value of the setting.

  ##### Throws

  Error if the keypath is invalid.

  #### Signatures

  ```typescript
  getSettingString(keypath: SettingStringPropertyName): string
  ```

  ```typescript
  getSettingString(keypath: `ubq://${string & {}}`): string
  ```

  ```typescript
  getSettingString(keypath: SettingStringPropertyName): string
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingColor()

    <br /><p>Set a color setting.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |
  | `value` | [`Color`](./api/node/type-aliases/color.md) | The The value to set. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  setSettingColor(keypath, value): void;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |
  | `value` | [`Color`](./api/node/type-aliases/color.md) |

  ##### Returns

  `void`

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  setSettingColor(keypath, value): void;
  ```

  Set a color setting.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |
  | `value` | [`Color`](./api/node/type-aliases/color.md) | The The value to set. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  setSettingColor(keypath: SettingColorPropertyName, value: Color): void
  ```

  ```typescript
  setSettingColor(keypath: `ubq://${string & {}}`, value: Color): void
  ```

  ```typescript
  setSettingColor(keypath: SettingColorPropertyName, value: Color): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingColor()

    <br /><p>Get a color setting.</p>
  </summary>

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |

  ##### Returns

  [`Color`](./api/node/type-aliases/color.md)

  ##### Throws

  An error, if the keypath is invalid.

  #### Call Signature

  ```ts
  getSettingColor(keypath): Color;
  ```

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keypath` | `` `ubq://${string & {}}` `` |

  ##### Returns

  [`Color`](./api/node/type-aliases/color.md)

  ##### Deprecated

  Support for `ubq://` prefixed keypaths will be removed in a future release.

  #### Call Signature

  ```ts
  getSettingColor(keypath): Color;
  ```

  Get a color setting.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |

  ##### Returns

  [`Color`](./api/node/type-aliases/color.md)

  ##### Throws

  An error, if the keypath is invalid.

  #### Signatures

  ```typescript
  getSettingColor(keypath: SettingColorPropertyName): Color
  ```

  ```typescript
  getSettingColor(keypath: `ubq://${string & {}}`): Color
  ```

  ```typescript
  getSettingColor(keypath: SettingColorPropertyName): Color
  ```

  ***
</details>

<details>
  <summary>
    ### setSettingEnum()

    <br /><p>Set an enum setting.</p>
  </summary>

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* keyof [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md) |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `T` | The settings keypath, e.g. `doubleClickSelectionMode`. |
  | `value` | [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md)\[`T`] | The enum value as string. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  setSettingEnum(keypath, value): void;
  ```

  Set an enum setting.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `string` | The settings keypath, e.g. `doubleClickSelectionMode`. |
  | `value` | `string` | The enum value as string. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  setSettingEnum(keypath: T, value: SettingEnumType[T]): void
  ```

  ```typescript
  setSettingEnum(keypath: string, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingEnum()

    <br /><p>Get an enum setting.</p>
  </summary>

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* keyof [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md) |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `T` | The settings keypath, e.g. `doubleClickSelectionMode`. |

  ##### Returns

  [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md)\[`T`]

  The value as string.

  #### Call Signature

  ```ts
  getSettingEnum(keypath): string;
  ```

  Get an enum setting.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `string` | The settings keypath, e.g. `doubleClickSelectionMode`. |

  ##### Returns

  `string`

  The value as string.

  #### Signatures

  ```typescript
  getSettingEnum(keypath: T): SettingEnumType[T]
  ```

  ```typescript
  getSettingEnum(keypath: string): string
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingEnumOptions()

    <br /><p>Get the possible enum options for a given enum setting.</p>
  </summary>

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* keyof [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md) |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `T` | The settings keypath, e.g. `doubleClickSelectionMode`. |

  ##### Returns

  [`SettingEnumType`](./api/node/type-aliases/settingenumtype.md)\[`T`]\[]

  The possible enum options as strings.

  #### Call Signature

  ```ts
  getSettingEnumOptions(keypath): string[];
  ```

  Get the possible enum options for a given enum setting.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `string` | The settings keypath, e.g. `doubleClickSelectionMode`. |

  ##### Returns

  `string`\[]

  The possible enum options as strings.

  #### Signatures

  ```typescript
  getSettingEnumOptions(keypath: T): SettingEnumType[T][]
  ```

  ```typescript
  getSettingEnumOptions(keypath: string): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### findAllSettings()

    <br /><p>Returns a list of all the settings available.</p>
  </summary>

  #### Returns

  `string`\[]

  A list of settings keypaths.

  #### Signature

  ```typescript
  findAllSettings(): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### getSettingType()

    <br /><p>Returns the type of a setting.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | `string` | The settings keypath, e.g. `doubleClickSelectionMode`. |

  #### Returns

  [`SettingType`](./api/node/type-aliases/settingtype.md)

  The setting type.

  #### Signature

  ```typescript
  getSettingType(keypath: string): SettingType
  ```

  ***
</details>

<details>
  <summary>
    ### setURIResolver()

    <br /><p>Sets a custom URI resolver.</p>
  </summary>

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

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `resolver?` | [`SyncURIResolver`](./api/node/type-aliases/syncuriresolver.md) | Custom resolution function. The resolution function should not reference variables outside of its scope. It receives the default URI resolver as its second argument |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setURIResolver(resolver?: SyncURIResolver): void
  ```

  ***
</details>

<details>
  <summary>
    ### setURIResolverAsync()

    <br /><p>Sets a custom async URI resolver.</p>
  </summary>

  This function can be called more than once. Subsequent calls will overwrite previous calls.
  To remove a previously set resolver, pass `null` or `undefined`.
  `setURIResolver` and `setURIResolverAsync` share one resolver slot, so a
  call to either one replaces the resolver set by the other.
  The given function must return an absolute path with a scheme. The input is allowed to be invalid URI, e.g., due
  to placeholders.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `resolver?` | [`AsyncURIResolver`](./api/node/type-aliases/asyncuriresolver.md) | Custom async resolution function. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setURIResolverAsync(resolver?: AsyncURIResolver): void
  ```

  ***
</details>

<details>
  <summary>
    ### defaultURIResolver()

    <br /><p>This is the default implementation for the URI resolver.</p>
  </summary>

  It resolves the given path relative to the `basePath` setting.

  ```javascript
  engine.editor.defaultURIResolver(uri);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `relativePath` | `string` | The relative path that should be resolved. |

  #### Returns

  `string`

  The resolved absolute URI.

  #### Signature

  ```typescript
  defaultURIResolver(relativePath: string): string
  ```

  ***
</details>

<details>
  <summary>
    ### getAbsoluteURI()

    <br /><p>Resolves the given path asynchronously.</p>
  </summary>

  If a custom resolver has been set with `setURIResolverAsync` (or `setURIResolver`), it invokes it with the given
  path. Else, it resolves it as relative to the `basePath` setting.
  This performs NO validation of whether a file exists at the specified location.

  **Breaking change:** This method now returns a `Promise<string>` instead
  of a plain `string`. Callers must `await` the result.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `relativePath` | `string` | A relative path string |

  #### Returns

  `Promise`\<`string`>

  Promise resolving to the resolved absolute uri or rejecting if an invalid path was given.

  #### Signature

  ```typescript
  getAbsoluteURI(relativePath: string): Promise<string>
  ```
</details>

## System Information

<details>
  <summary>
    ### getAvailableMemory()

    <br /><p>Get the currently available memory.</p>
  </summary>

  #### Returns

  `number`

  The available memory in bytes.

  #### Signature

  ```typescript
  getAvailableMemory(): number
  ```

  ***
</details>

<details>
  <summary>
    ### getUsedMemory()

    <br /><p>Get the engine's current memory usage.</p>
  </summary>

  #### Returns

  `number`

  The current memory usage in bytes.

  #### Signature

  ```typescript
  getUsedMemory(): number
  ```

  ***
</details>

<details>
  <summary>
    ### getMaxExportSize()

    <br /><p>Get the maximum export size limit for the current device.</p>
  </summary>

  Exports are only possible when both width and height are below this limit.
  Note that exports may still fail due to other constraints like memory.

  #### Returns

  `number`

  The upper export size limit in pixels, or maximum 32-bit integer if unlimited.

  #### Signature

  ```typescript
  getMaxExportSize(): number
  ```
</details>

## Experimental

<details>
  <summary>
    ### unstable\_isInteractionHappening()
  </summary>

  Check if a user interaction is currently happening.

  Detects active interactions like resize edits with drag handles or touch gestures.

  #### Returns

  `boolean`

  True if an interaction is happening.
  This API is experimental and may change or be removed in future versions.
</details>

## Other

<details>
  <summary>
    ### isCapabilitySupported()

    <br /><p>Whether the current platform supports a capability, measured once with behavioral
    probes during engine initialization.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `capability` | [`EngineCapability`](./api/node/type-aliases/enginecapability.md) | The capability to query. |

  #### Returns

  `boolean`

  Whether the capability is supported.

  #### Throws

  For unknown capability names.

  #### Signature

  ```typescript
  isCapabilitySupported(capability: EngineCapability): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### checkCapabilities()

    <br /><p>Runs the platform's capability detection; awaited during engine initialization.</p>
  </summary>

  #### Returns

  `Promise`\<`void`>

  Resolves once every capability has been measured.

  #### Signature

  ```typescript
  checkCapabilities(): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setSettingColorRGBA()~~

    <br /><p>Set a color setting.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | | `` `ubq://${string & {}}` `` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setSettingColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~getSettingColorRGBA()~~

    <br /><p>Get a color setting.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keypath` | | `` `ubq://${string & {}}` `` | [`SettingColorPropertyName`](./api/node/type-aliases/settingcolorpropertyname.md) | The settings keypath, e.g. `highlightColor`. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  A tuple of channels red, green, blue and alpha in the range of 0 to 1.

  #### Deprecated

  Use getSettingColor() instead.

  ***
</details>

<details>
  <summary>
    ### isHighlightingEnabled()

    <br /><p>Checks wether the block has selection and hover highlighting enabled or disabled.</p>
  </summary>

  ```javascript
  const highlightingIsEnabled = engine.editor.isHighlightingEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if highlighting is enabled, false otherwise.

  #### Signature

  ```typescript
  isHighlightingEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setHighlightingEnabled()

    <br /><p>Enable or disable selection and hover highlighting for a block.</p>
  </summary>

  ```javascript
  engine.editor.setHighlightingEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `enabled` | `boolean` | Whether or not the block should show highlighting when selected or hovered. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setHighlightingEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isSelectionEnabled()

    <br /><p>Checks whether the block can currently be selected.</p>
  </summary>

  ```javascript
  const selectionIsEnabled = engine.editor.isSelectionEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if selection is enabled, false otherwise.

  #### Signature

  ```typescript
  isSelectionEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setSelectionEnabled()

    <br /><p>Enable or disable selection for a block.</p>
  </summary>

  ```javascript
  engine.editor.setSelectionEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `enabled` | `boolean` | Whether the block should be selectable. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSelectionEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### setMovementConstraint()

    <br /><p>Set one or more rules that limit how far blocks can be positioned outside their
    parent page during user interactions (drag, resize, touch gestures, crop).
    Programmatic API calls are not affected.</p>
  </summary>

  `overshoot` is a non-negative fraction of the moved block's own size: `0`
  pins blocks fully inside the page, `0.3` allows 30% to extend past the page
  bounds. Each rule's scope is determined by its keys:

  - `{ overshoot }` — scene-wide default for every page in the scene.
  - `{ overshoot, block }` — applies to a specific block. Pages are blocks, so
    setting this on a page acts as the default for blocks inside that page.
  - `{ overshoot, blockType }` — applies to every block of the given type
    (e.g. `"text"` or `"//ly.img.ubq/text"`).

  Use `removeMovementConstraint` to clear a rule.

  When multiple rules match a block, the most specific one wins:
  block \\> parent page \\> blockType \\> scene-wide.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `rules` | `MovementConstraintRule` | `MovementConstraintRule`\[] | A single rule or an array of rules to apply. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setMovementConstraint(rules: MovementConstraintRule | MovementConstraintRule[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### getMovementConstraint()

    <br /><p>Get the effective movement constraint for a block, picking the most specific
    matching rule: block > parent page > blockType > scene-wide.</p>
  </summary>

  The returned `overshoot` is a fraction of the block's own size.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `object`

  `{ overshoot }` with the effective value, or `null` if unconstrained.

  | Name | Type |
  | ------ | ------ |
  | `overshoot` | `number` |

  #### Signature

  ```typescript
  getMovementConstraint(id: number): object
  ```

  ***
</details>

<details>
  <summary>
    ### removeMovementConstraint()

    <br /><p>Remove previously set movement constraints.</p>
  </summary>

  - No argument: removes the scene-wide default.
  - `{ block }` / `{ blockType }` (or an array): removes the matching scope(s).

  Removing a scope falls through to the next tier on subsequent resolution.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `scopes?` | `MovementConstraintScope` | `MovementConstraintScope`\[] | Scope or array of scopes to remove. Omit to remove the scene-wide default. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeMovementConstraint(scopes?: MovementConstraintScope | MovementConstraintScope[]): void
  ```
</details>

## Vector Edit

<details>
  <summary>
    ### hasSelectedVectorNode()

    <br /><p>Check whether a vector anchor node is currently selected in vector edit mode.</p>
  </summary>

  #### Returns

  `boolean`

  True if a vector anchor node is selected.

  #### Signature

  ```typescript
  hasSelectedVectorNode(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### addVectorNode()

    <br /><p>Add a new vertex by splitting the segment after the currently selected vector node.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  addVectorNode(): void
  ```

  ***
</details>

<details>
  <summary>
    ### deleteVectorNode()

    <br /><p>Delete the currently selected vector node from the path.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  deleteVectorNode(): void
  ```

  ***
</details>

<details>
  <summary>
    ### hasSelectedVectorControlPoint()

    <br /><p>Check whether a vector control point handle is currently selected.</p>
  </summary>

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  hasSelectedVectorControlPoint(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### deleteSelectedVectorControlPoints()

    <br /><p>Delete (reset) the currently selected vector control point handles.
    Removes the bezier handle from the node, converting that side to a straight line.
    If the node has two handles, only the selected one is removed.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  deleteSelectedVectorControlPoints(): void
  ```

  ***
</details>

<details>
  <summary>
    ### toggleSelectedVectorNodeSmooth()

    <br /><p>Toggle the currently selected vector node between smooth (bezier handles)
    and corner (no handles).</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleSelectedVectorNodeSmooth(): void
  ```

  ***
</details>

<details>
  <summary>
    ### setVectorEditBendMode()

    <br /><p>Enable or disable bend mode for vector editing.</p>
  </summary>

  When bend mode is active, clicking an anchor node automatically toggles
  it between smooth (bezier handles) and corner (no handles).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `active` | `boolean` | true to enable bend mode, false to return to normal move mode. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setVectorEditBendMode(active: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getVectorEditBendMode()

    <br /><p>Check whether vector edit bend mode is currently active.</p>
  </summary>

  #### Returns

  `boolean`

  true if bend mode is active.

  #### Signature

  ```typescript
  getVectorEditBendMode(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setVectorEditAddMode()

    <br /><p>Enable or disable add mode for vector editing.</p>
  </summary>

  When add mode is active, clicking on a path segment inserts a new anchor
  point at the click position. Mutually exclusive with bend and delete modes.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `active` | `boolean` | true to enable add mode, false to return to normal move mode. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setVectorEditAddMode(active: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getVectorEditAddMode()

    <br /><p>Check whether vector edit add mode is currently active.</p>
  </summary>

  #### Returns

  `boolean`

  true if add mode is active.

  #### Signature

  ```typescript
  getVectorEditAddMode(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setVectorEditDeleteMode()

    <br /><p>Enable or disable delete mode for vector editing.</p>
  </summary>

  When delete mode is active, clicking an anchor node instantly deletes it
  from the path. Mutually exclusive with bend and add modes.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `active` | `boolean` | true to enable delete mode, false to return to normal move mode. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setVectorEditDeleteMode(active: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getVectorEditDeleteMode()

    <br /><p>Check whether vector edit delete mode is currently active.</p>
  </summary>

  #### Returns

  `boolean`

  true if delete mode is active.

  #### Signature

  ```typescript
  getVectorEditDeleteMode(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setSelectedVectorNodeMirrorMode()

    <br /><p>Set the bezier handle mirror mode for the currently selected vector node.</p>
  </summary>

  Mirror modes control how the opposite handle behaves when one handle is dragged:

  - 0 (None): handles move independently
  - 1 (AngleAndLength): the opposite handle mirrors both angle and length
  - 2 (AngleOnly): the opposite handle mirrors the angle but keeps its own length

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `mode` | `number` | The mirror mode (0, 1, or 2). |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSelectedVectorNodeMirrorMode(mode: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSelectedVectorNodeMirrorMode()

    <br /><p>Get the bezier handle mirror mode of the currently selected vector node.</p>
  </summary>

  #### Returns

  `number`

  The mirror mode as a number (0 = None, 1 = AngleAndLength, 2 = AngleOnly).

  #### Throws

  Error if no node is selected or no vector path is being edited.

  #### Signature

  ```typescript
  getSelectedVectorNodeMirrorMode(): number
  ```
</details>

## Viewport

<details>
  <summary>
    ### setSafeAreaInsets()

    <br /><p>Set global safe area insets for UI overlays.</p>
  </summary>

  Safe area insets define UI-safe regions by specifying padding from screen edges.
  These insets are automatically applied to all camera operations (zoom, pan, clamping)
  to ensure important content remains visible when UI elements overlap the viewport edges.
  Set to zero to disable (default state).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `insets` | \{ `left?`: `number`; `top?`: `number`; `right?`: `number`; `bottom?`: `number`; } | The inset values in CSS pixels (device-independent) |
  | `insets.left?` | `number` | - |
  | `insets.top?` | `number` | - |
  | `insets.right?` | `number` | - |
  | `insets.bottom?` | `number` | - |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSafeAreaInsets(insets: object): void
  ```

  ***
</details>

<details>
  <summary>
    ### getSafeAreaInsets()

    <br /><p>Get the current global safe area insets configuration.</p>
  </summary>

  #### Returns

  `object`

  The current inset values in CSS pixels (device-independent)

  | Name | Type |
  | ------ | ------ |
  | `left` | `number` |
  | `top` | `number` |
  | `right` | `number` |
  | `bottom` | `number` |

  #### Signature

  ```typescript
  getSafeAreaInsets(): object
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support