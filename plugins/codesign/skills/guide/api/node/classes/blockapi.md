> This is one page of the CE.SDK Node.js `@cesdk/node` API reference. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md) or the [node API Index](./api/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Create, manipulate, and query the building blocks of your design.

This is the primary interface for all block-level operations. Use it to manage the
entire lifecycle of blocks from creation and serialization to destruction. You can precisely
control a block's appearance by modifying its fills, strokes, and effects, or transform
its position, size, and rotation. The API also includes powerful features for managing
complex content like text and video, organizing blocks into groups and hierarchies, and
exporting final designs to various formats.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>BlockAPI</code></p>
  </summary>
</details>

## Block Lifecycle

Manage the complete lifecycle: create, find, duplicate, destroy, and serialize blocks.

<details>
  <summary>
    ### loadFromString()

    <br /><p>Loads blocks from a serialized string.</p>
  </summary>

  The blocks are not attached by default and won't be visible until attached to a page or the scene.
  The UUID of the loaded blocks is replaced with a new one.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `content` | `string` | A string representing the given blocks. |

  #### Returns

  `Promise`\<`number`\[]>

  A promise that resolves with a list of handles representing the found blocks or an error.

  #### Example

  ```typescript
  const serializedBlocks = await engine.block.saveToString([pageBlockId]);
  // Later, load those blocks
  const loadedBlocks = await engine.block.loadFromString(serializedBlocks);
  // Attach the first loaded block to the scene
  engine.block.appendChild(sceneBlockId, loadedBlocks[0]);
  ```

  #### Signature

  ```typescript
  loadFromString(content: string): Promise<number[]>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromArchiveURL()

    <br /><p>Loads blocks from a remote archive URL.</p>
  </summary>

  The URL should be that of a file previously saved with `block.saveToArchive`.
  The blocks are not attached by default and won't be visible until attached to a page or the scene.
  The UUID of the loaded blocks is replaced with a new one.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The URL of the blocks archive file. |

  #### Returns

  `Promise`\<`number`\[]>

  A promise that resolves with a list of handles representing the found blocks or an error.

  #### Example

  ```typescript
  // Load blocks from a remote archive
  const loadedBlocks = await engine.block.loadFromArchiveURL('https://example.com/blocks.zip');
  // Attach the first loaded block to the scene
  engine.block.appendChild(sceneBlockId, loadedBlocks[0]);
  ```

  #### Signature

  ```typescript
  loadFromArchiveURL(url: string): Promise<number[]>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromURL()

    <br /><p>Loads blocks from a URL.</p>
  </summary>

  The URL should point to a blocks file within an unzipped archive directory previously saved with `block.saveToArchive`.
  The blocks are not attached by default and won't be visible until attached to a page or the scene.
  The UUID of the loaded blocks is replaced with a new one.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The URL to the blocks file |

  #### Returns

  `Promise`\<`number`\[]>

  A promise that resolves with a list of block handles

  #### Example

  ```typescript
  // Load blocks from a URL
  const loadedBlocks = await engine.block.loadFromURL('https://example.com/blocks.blocks');
  // Attach the first loaded block to the scene
  engine.block.appendChild(sceneBlockId, loadedBlocks[0]);
  ```

  #### Signature

  ```typescript
  loadFromURL(url: string): Promise<number[]>
  ```

  ***
</details>

<details>
  <summary>
    ### saveToString()

    <br /><p>Saves the given blocks to a serialized string.</p>
  </summary>

  If a page with multiple children is given, the entire hierarchy is saved.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blocks` | `number`\[] | The blocks to save. |
  | `allowedResourceSchemes?` | `string`\[] | The resource schemes to allow in the saved string. Defaults to \['buffer', 'http', 'https']. |
  | `onDisallowedResourceScheme?` | (`url`, `dataHash`) => `Promise`\<`string`> | An optional callback that is called for each resource URL that has a scheme absent from `resourceSchemesAllowed`. The `url` parameter is the resource URL and the `dataHash` parameter is the hash of the resource's data. The callback should return a new URL for the resource, which will be used in the serialized scene. The callback is expected to return the original URL if no persistence is needed. |

  #### Returns

  `Promise`\<`string`>

  A promise that resolves to a string representing the blocks or an error.

  #### Example

  ```typescript
  // Create a page with a text element
  const page = engine.block.create('page');
  const text = engine.block.create('text');
  engine.block.appendChild(page, text);

  // Save the whole page hierarchy to a string
  const serialized = await engine.block.saveToString([page]);
  ```

  #### Signature

  ```typescript
  saveToString(blocks: number[], allowedResourceSchemes?: string[], onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>): Promise<string>
  ```

  ***
</details>

<details>
  <summary>
    ### saveToArchive()

    <br /><p>Saves the given blocks and their assets to a zip archive.</p>
  </summary>

  The archive contains all assets that were accessible when this function was called.
  Blocks in the archived scene reference assets relative to the location of the scene file.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blocks` | `number`\[] | The blocks to save. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a Blob on success or an error on failure.

  #### Signature

  ```typescript
  saveToArchive(blocks: number[]): Promise<Blob>
  ```

  ***
</details>

<details>
  <summary>
    ### create()

    <br /><p>Creates a new block of a given type.</p>
  </summary>

  ```javascript
  // Create a new text block
  const text = engine.block.create('text');
  const page = engine.scene.getCurrentPage();
  engine.block.appendChild(page, text);

  // Create a new image block
  const image = engine.block.create('graphic');
  engine.block.setShape(image, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setFill(image, imageFill);
  engine.block.setString(imageFill, 'fill/image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_1.jpg');
  engine.block.appendChild(page, image);

  // Create a new video block
  const video = engine.block.create('graphic');
  engine.block.setShape(video, engine.block.createShape('rect'));
  const videoFill = engine.block.createFill('video');
  engine.block.setString(videoFill, 'fill/video/fileURI', 'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4');
  engine.block.setFill(video, videoFill);
  engine.block.appendChild(page, video);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`DesignBlockType`](./api/node/type-aliases/designblocktype.md) | The type of the block that shall be created. |

  #### Returns

  `number`

  The created block's handle.

  #### Signature

  ```typescript
  create(type: DesignBlockType): number
  ```

  ***
</details>

<details>
  <summary>
    ### duplicate()

    <br /><p>Duplicates a block and its children.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to duplicate. |
  | `attachToParent?` | `boolean` | Whether the duplicated block should be attached to the original's parent. Defaults to true. |

  #### Returns

  `number`

  The handle of the duplicate.

  #### Signature

  ```typescript
  duplicate(id: number, attachToParent?: boolean): number
  ```

  ***
</details>

<details>
  <summary>
    ### destroy()

    <br /><p>Destroys a block and its children.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to destroy. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  destroy(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### forceLoadResources()

    <br /><p>Forces the loading of resources for a set of blocks and their children.</p>
  </summary>

  This is useful for preloading resources. If a resource failed to load previously, it will be reloaded.

  Pass an empty array to load resources for every block currently known to the engine.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks whose resources should be loaded. Pass an empty array to load resources for every block currently known to the engine. |

  #### Returns

  `Promise`\<`void`>

  A Promise that resolves once all resources have finished loading.

  #### Signature

  ```typescript
  forceLoadResources(ids: number[]): Promise<void>
  ```
</details>

## Block Exploration

Find blocks by properties like name, type, or kind.

<details>
  <summary>
    ### findByName()

    <br /><p>Finds all blocks with a given name.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `name` | `string` | The name to search for. |

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  findByName(name: string): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findByType()

    <br /><p>Finds all blocks with a given type.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`ObjectType`](./api/node/type-aliases/objecttype.md) | The type to search for. |

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  findByType(type: ObjectType): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findByKind()

    <br /><p>Finds all blocks with a given kind.</p>
  </summary>

  ```javascript
  const allTitles = engine.block.findByKind('title');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `kind` | `string` | The kind to search for. |

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  findByKind(kind: string): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findAll()

    <br /><p>Finds all blocks known to the engine.</p>
  </summary>

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  findAll(): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findAllPlaceholders()

    <br /><p>Finds all placeholder blocks in the current scene.</p>
  </summary>

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  findAllPlaceholders(): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### findAllUnused()

    <br /><p>Finds all blocks that are not attached to any scene.</p>
  </summary>

  A block is considered unused when it has no path to a scene (no scene
  reference and no ancestor that belongs to a scene) and is not itself a
  scene. Generated blocks and render blocks (fills, effects, shapes, blurs)
  are excluded, matching the behaviour of [BlockAPI.findAll](./api/node/classes/blockapi.md).

  This is useful for cleanup workflows and for filtering the URIs returned
  by [EditorAPI.findAllMediaURIs](./api/node/classes/editorapi.md) before relocating resources.

  #### Returns

  `number`\[]

  A list of block ids that are not attached to any scene.

  #### Signature

  ```typescript
  findAllUnused(): number[]
  ```
</details>

## Block Export

Export blocks to various formats like images, videos, and audio.

<details>
  <summary>
    ### export()

    <br /><p>Exports a design block to a Blob.</p>
  </summary>

  Performs an internal update to resolve the final layout for the blocks.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. |
  | `options?` | [`ExportOptions`](./api/node/type-aliases/exportoptions.md) | The options for exporting the block type, including mime type and export settings. |

  ##### Returns

  `Promise`\<`Blob`>

  A promise that resolves with the exported image or is rejected with an error.

  #### Call Signature

  ```ts
  export(
     handle, 
     mimeType?, 
  options?): Promise<Blob>;
  ```

  Exports a design block to a Blob.

  Performs an internal update to resolve the final layout for the blocks.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. |
  | `mimeType?` | | `"application/octet-stream"` | `"application/pdf"` | [`ImageMimeType`](./api/node/type-aliases/imagemimetype.md) | The mime type of the output file. |
  | `options?` | `Omit`\<[`ExportOptions`](./api/node/type-aliases/exportoptions.md), `"mimeType"`> | The options for exporting the block type |

  ##### Returns

  `Promise`\<`Blob`>

  A promise that resolves with the exported image or is rejected with an error.

  ##### Deprecated

  Use the new `export` signature instead

  ##### Example

  ```typescript
  // Before migration
  const blob = await cesdk.block.export(blockId, MimeType.Png, { pngCompressionLevel: 5 })
  // After migration
  const blob = await cesdk.block.export(blockId, { mimeType: 'image/png', pngCompressionLevel: 5 })
  ```

  #### Signatures

  ```typescript
  export(handle: number, options?: ExportOptions): Promise<Blob>
  ```

  ```typescript
  export(handle: number, mimeType?: "application/octet-stream" | "application/pdf" | ImageMimeType, options?: Omit<ExportOptions, "mimeType">): Promise<Blob>
  ```

  ***
</details>

<details>
  <summary>
    ### exportWithColorMask()

    <br /><p>Exports a design block and a color mask to two separate Blobs.</p>
  </summary>

  Performs an internal update to resolve the final layout for the blocks.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. |
  | `maskColorR` | `number` | The red component of the special color mask color. |
  | `maskColorG` | `number` | The green component of the special color mask color. |
  | `maskColorB` | `number` | The blue component of the special color mask color. |
  | `options?` | [`ExportOptions`](./api/node/type-aliases/exportoptions.md) | The options for exporting the block type |

  ##### Returns

  `Promise`\<`Blob`\[]>

  A promise that resolves with an array of the exported image and mask or is rejected with an error.

  #### Call Signature

  ```ts
  exportWithColorMask(
     handle, 
     mimeType, 
     maskColorR, 
     maskColorG, 
     maskColorB, 
  options?): Promise<Blob[]>;
  ```

  Exports a design block and a color mask to two separate Blobs.

  Performs an internal update to resolve the final layout for the blocks.
  Removes all pixels that exactly match the given RGB color and replaces them with transparency.
  The output includes two files: the masked image and the mask itself.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. |
  | `mimeType` | | `"application/octet-stream"` | `"application/pdf"` | [`ImageMimeType`](./api/node/type-aliases/imagemimetype.md) | The mime type of the output file. |
  | `maskColorR` | `number` | The red component of the special color mask color. |
  | `maskColorG` | `number` | The green component of the special color mask color. |
  | `maskColorB` | `number` | The blue component of the special color mask color. |
  | `options?` | `Omit`\<[`ExportOptions`](./api/node/type-aliases/exportoptions.md), `"mimeType"`> | The options for exporting the block type |

  ##### Returns

  `Promise`\<`Blob`\[]>

  A promise that resolves with an array of the exported image and mask or is rejected with an error.

  ##### Deprecated

  Use the new `exportWithColorMask` signature instead

  ##### Example

  ```typescript
  // Before migration
  const blob = await cesdk.block.exportWithColorMask(
     blockId,
     MimeType.Png,
     0.5,
     0,
     0,
     {
       pngCompressionLevel: 5
     }
  );
  // After migration
  const blob = await cesdk.block.exportWithColorMask(
     blockId,
     0.5,
     0,
     0,
     {
       mimeType: 'image/png',
       pngCompressionLevel: 5
     }
  );
  ```

  #### Signatures

  ```typescript
  exportWithColorMask(handle: number, maskColorR: number, maskColorG: number, maskColorB: number, options?: ExportOptions): Promise<Blob[]>
  ```

  ```typescript
  exportWithColorMask(handle: number, mimeType: "application/octet-stream" | "application/pdf" | ImageMimeType, maskColorR: number, maskColorG: number, maskColorB: number, options?: Omit<ExportOptions, "mimeType">): Promise<Blob[]>
  ```

  ***
</details>

<details>
  <summary>
    ### exportVideo()

    <br /><p>Exports a design block as a video file.</p>
  </summary>

  Note: The export will run across multiple iterations of the update loop. In each iteration a frame is scheduled for encoding.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. Currently, only page blocks are supported. |
  | `options?` | [`VideoExportOptions`](./api/node/type-aliases/videoexportoptions.md) | The options for exporting the video, including mime type, h264 profile, level, bitrate, time offset, duration, framerate, target width and height. |

  ##### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a video blob or is rejected with an error.

  ##### Example

  ```typescript
  const page = engine.block.create('page');
  // Set up a progress tracking function
  const progressTracker = (renderedFrames, encodedFrames, totalFrames) => {
    console.log(`Progress: ${Math.round((encodedFrames / totalFrames) * 100)}%`);
  };
  const videoOptions = { framerate: 30, duration: 5 };
  const videoBlob = await engine.block.exportVideo(page, MimeType.Mp4, progressTracker, videoOptions);
  ```

  #### Call Signature

  ```ts
  exportVideo(
     handle, 
     mimeType?, 
     progressCallback?, 
  options?): Promise<Blob>;
  ```

  Exports a design block as a video file.

  Note: The export will run across multiple iterations of the update loop. In each iteration a frame is scheduled for encoding.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. Currently, only page blocks are supported. |
  | `mimeType?` | `"video/mp4"` | The MIME type of the output video file. |
  | `progressCallback?` | (`numberOfRenderedFrames`, `numberOfEncodedFrames`, `totalNumberOfFrames`) => `void` | A callback which reports on the progress of the export. |
  | `options?` | `Omit`\<[`VideoExportOptions`](./api/node/type-aliases/videoexportoptions.md), `"mimeType"` | `"onProgress"`> | The options for exporting the video, including h264 profile, level, bitrate, time offset, duration, framerate, target width and height. |

  ##### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a video blob or is rejected with an error.

  ##### Deprecated

  Use the new `exportVideo` signature instead

  ##### Example

  ```typescript
  // Before migration
  const blob = await cesdk.block.exportVideo(blockId, 'video/mp4', handleProgress, {
    targetWidth: 1920,
    targetHeight: 1080,
  })
  // After migration
  const blob = await cesdk.block.exportVideo(blockId, {
    mimeType: 'video/mp4',
    progressCallback: handleProgress,
    targetWidth: 1920,
    targetHeight: 1080,
  })
  ```

  #### Signatures

  ```typescript
  exportVideo(handle: number, options?: VideoExportOptions): Promise<Blob>
  ```

  ```typescript
  exportVideo(handle: number, mimeType?: "video/mp4", progressCallback?: (numberOfRenderedFrames: number, numberOfEncodedFrames: number, totalNumberOfFrames: number) => void, options?: Omit<VideoExportOptions, "mimeType" | "onProgress">): Promise<Blob>
  ```

  ***
</details>

<details>
  <summary>
    ### exportAudio()
  </summary>

  Exports a design block as an audio file.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to export. Currently, only audio blocks are supported. |
  | `options?` | [`AudioExportOptions`](./api/node/type-aliases/audioexportoptions.md) | The options for exporting the audio, including mime type, progress callback, and export settings. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with an audio blob or is rejected with an error.
  This API is experimental and may change or be removed in future versions.

  #### Example

  ```typescript
  const audioBlock = engine.block.create('audio');
  // Set up a progress tracking function
  const progressTracker = (renderedFrames, encodedFrames, totalFrames) => {
    console.log(`Audio export progress: ${Math.round((encodedFrames / totalFrames) * 100)}%`);
  };
  const audioOptions = { duration: 10 };
  const audioBlob = await engine.block.exportAudio(audioBlock, MimeType.Wav, progressTracker, audioOptions);
  ```

  #### Signature

  ```typescript
  exportAudio(handle: number, options?: AudioExportOptions): Promise<Blob>
  ```
</details>

## Block Hierarchies

Manage parent-child relationships and the scene graph structure.

<details>
  <summary>
    ### getParent()

    <br /><p>Gets the parent of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The parent's handle or null if the block has no parent.

  #### Signature

  ```typescript
  getParent(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getChildren()

    <br /><p>Gets all direct children of a block.</p>
  </summary>

  Children are sorted in their rendering order: Last child is rendered in front of other children.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`\[]

  A list of block ids.

  #### Signature

  ```typescript
  getChildren(id: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### insertChild()

    <br /><p>Inserts a child block at a specific index.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `parent` | `number` | The block whose children should be updated. |
  | `child` | `number` | The child to insert. Can be an existing child of `parent`. |
  | `index` | `number` | The index to insert or move to. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  insertChild(parent: number, child: number, index: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### appendChild()

    <br /><p>Appends a child block to a parent.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `parent` | `number` | The block whose children should be updated. |
  | `child` | `number` | The child to insert. Can be an existing child of `parent`. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  appendChild(parent: number, child: number): void
  ```
</details>

## Block Layout

Structure designs by positioning, sizing, layering, aligning, and distributing blocks.

<details>
  <summary>
    ### isTransformLocked()

    <br /><p>Gets the transform-locked state of a block.</p>
  </summary>

  If true, the block's transform can't be changed.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if transform locked, false otherwise.

  #### Signature

  ```typescript
  isTransformLocked(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isLineOrigin()

    <br /><p>Checks whether a graphic block originated as a line shape. Survives the
    line's conversion to a vector path during vector-edit; resets only when
    the shape is replaced by a non-line shape via <code>setShape</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block originated as a line shape, false otherwise.

  #### Signature

  ```typescript
  isLineOrigin(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setTransformLocked()

    <br /><p>Sets the transform-locked state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `locked` | `boolean` | Whether the block's transform should be locked. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTransformLocked(id: number, locked: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getPositionX()

    <br /><p>Gets the X position of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The value of the x position.

  #### Signature

  ```typescript
  getPositionX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getPositionXMode()

    <br /><p>Gets the mode for the block's X position.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Absolute"` | `"Percent"` | `"Auto"`

  The current mode for the x position: 'Absolute' or 'Percent'.

  #### Signature

  ```typescript
  getPositionXMode(id: number): "Absolute" | "Percent" | "Auto"
  ```

  ***
</details>

<details>
  <summary>
    ### getPositionY()

    <br /><p>Gets the Y position of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The value of the y position.

  #### Signature

  ```typescript
  getPositionY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getPositionYMode()

    <br /><p>Gets the mode for the block's Y position.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Absolute"` | `"Percent"` | `"Auto"`

  The current mode for the y position: 'Absolute' or 'Percent'.

  #### Signature

  ```typescript
  getPositionYMode(id: number): "Absolute" | "Percent" | "Auto"
  ```

  ***
</details>

<details>
  <summary>
    ### setPositionX()

    <br /><p>Sets the X position of a block.</p>
  </summary>

  The position refers to the block's local space, relative to its parent with the origin at the top left.

  ```javascript
  engine.block.setPositionX(block, 0.25);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `value` | `number` | The value of the x position. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPositionX(id: number, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setPositionXMode()

    <br /><p>Sets the mode for the block's X position.</p>
  </summary>

  ```javascript
  engine.block.setPositionXMode(block, 'Percent');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `mode` | `"Absolute"` | `"Percent"` | `"Auto"` | The x position mode: 'Absolute' or 'Percent'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPositionXMode(id: number, mode: "Absolute" | "Percent" | "Auto"): void
  ```

  ***
</details>

<details>
  <summary>
    ### setPositionY()

    <br /><p>Sets the Y position of a block.</p>
  </summary>

  The position refers to the block's local space, relative to its parent with the origin at the top left.

  ```javascript
  engine.block.setPositionY(block, 0.25);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `value` | `number` | The value of the y position. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPositionY(id: number, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setPositionYMode()

    <br /><p>Sets the mode for the block's Y position.</p>
  </summary>

  ```javascript
  engine.block.setPositionYMode(block, 'Absolute');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `mode` | `"Absolute"` | `"Percent"` | `"Auto"` | The y position mode: 'Absolute' or 'Percent'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPositionYMode(id: number, mode: "Absolute" | "Percent" | "Auto"): void
  ```

  ***
</details>

<details>
  <summary>
    ### setAlwaysOnTop()

    <br /><p>Sets a block to always be rendered on top of its siblings.</p>
  </summary>

  If true, this block's sorting order is automatically adjusted to be higher than all other siblings without this property.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | the block to update. |
  | `enabled` | `boolean` | whether the block shall be always-on-top. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setAlwaysOnTop(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### setAlwaysOnBottom()

    <br /><p>Sets a block to always be rendered below its siblings.</p>
  </summary>

  If true, this block's sorting order is automatically adjusted to be lower than all other siblings without this property.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | the block to update. |
  | `enabled` | `boolean` | whether the block shall always be below its siblings. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setAlwaysOnBottom(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isAlwaysOnTop()

    <br /><p>Checks if a block is set to always be on top.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | the block to query. |

  #### Returns

  `boolean`

  true if the block is set to be always-on-top, false otherwise.

  #### Signature

  ```typescript
  isAlwaysOnTop(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isAlwaysOnBottom()

    <br /><p>Checks if a block is set to always be on the bottom.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | the block to query. |

  #### Returns

  `boolean`

  true if the block is set to be always-on-bottom, false otherwise.

  #### Signature

  ```typescript
  isAlwaysOnBottom(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### bringToFront()

    <br /><p>Brings a block to the front of its siblings.</p>
  </summary>

  Updates the sorting order so that the given block has the highest sorting order.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The id of the block to bring to the front. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  bringToFront(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### sendToBack()

    <br /><p>Sends a block to the back of its siblings.</p>
  </summary>

  Updates the sorting order so that the given block has the lowest sorting order.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The id of the block to send to the back. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  sendToBack(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### bringForward()

    <br /><p>Brings a block one layer forward.</p>
  </summary>

  Updates the sorting order to be higher than its next sibling.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The id of the block to bring forward. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  bringForward(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### sendBackward()

    <br /><p>Sends a block one layer backward.</p>
  </summary>

  Updates the sorting order to be lower than its previous sibling.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The id of the block to send backward. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  sendBackward(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getRotation()

    <br /><p>Gets the rotation of a block in radians.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The block's rotation around its center in radians.

  #### Signature

  ```typescript
  getRotation(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setRotation()

    <br /><p>Sets the rotation of a block in radians.</p>
  </summary>

  Rotation is applied around the block's center.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `radians` | `number` | The new rotation in radians. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setRotation(id: number, radians: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getWidth()

    <br /><p>Gets the width of a block in the current width mode.</p>
  </summary>

  ```javascript
  const width = engine.block.getWidth(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The value of the block's width.

  #### Signature

  ```typescript
  getWidth(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getWidthMode()

    <br /><p>Gets the mode for the block's width.</p>
  </summary>

  ```javascript
  const widthMode = engine.block.getWidthMode(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Absolute"` | `"Percent"` | `"Auto"`

  The current mode for the width: 'Absolute', 'Percent' or 'Auto'.

  #### Signature

  ```typescript
  getWidthMode(id: number): "Absolute" | "Percent" | "Auto"
  ```

  ***
</details>

<details>
  <summary>
    ### getHeight()

    <br /><p>Gets the height of a block in the current height mode.</p>
  </summary>

  ```javascript
  const height = engine.block.getHeight(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The value of the block's height.

  #### Signature

  ```typescript
  getHeight(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getHeightMode()

    <br /><p>Gets the mode for the block's height.</p>
  </summary>

  ```javascript
  const heightMode = engine.block.getHeightMode(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Absolute"` | `"Percent"` | `"Auto"`

  The current mode for the height: 'Absolute', 'Percent' or 'Auto'.

  #### Signature

  ```typescript
  getHeightMode(id: number): "Absolute" | "Percent" | "Auto"
  ```

  ***
</details>

<details>
  <summary>
    ### setWidth()

    <br /><p>Sets the width of a block in the current width mode.</p>
  </summary>

  If the crop is maintained, the crop values will be automatically adjusted.

  ```javascript
  engine.block.setWidth(block, 2.5, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `value` | `number` | The new width of the block. |
  | `maintainCrop?` | `boolean` | Whether or not the crop values, if available, should be automatically adjusted. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setWidth(id: number, value: number, maintainCrop?: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### setWidthMode()

    <br /><p>Sets the mode for the block's width.</p>
  </summary>

  ```javascript
  engine.block.setWidthMode(block, 'Percent');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `mode` | `"Absolute"` | `"Percent"` | `"Auto"` | The width mode: 'Absolute', 'Percent' or 'Auto'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setWidthMode(id: number, mode: "Absolute" | "Percent" | "Auto"): void
  ```

  ***
</details>

<details>
  <summary>
    ### setHeight()

    <br /><p>Sets the height of a block in the current height mode.</p>
  </summary>

  If the crop is maintained, the crop values will be automatically adjusted.

  ```javascript
  engine.block.setHeight(block, 0.5);
  engine.block.setHeight(block, 2.5, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `value` | `number` | The new height of the block. |
  | `maintainCrop?` | `boolean` | Whether or not the crop values, if available, should be automatically adjusted. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setHeight(id: number, value: number, maintainCrop?: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### setHeightMode()

    <br /><p>Sets the mode for the block's height.</p>
  </summary>

  ```javascript
  engine.block.setHeightMode(block, 'Percent');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `mode` | `"Absolute"` | `"Percent"` | `"Auto"` | The height mode: 'Absolute', 'Percent' or 'Auto'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setHeightMode(id: number, mode: "Absolute" | "Percent" | "Auto"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFrameX()

    <br /><p>Gets the final calculated X position of a block's frame.</p>
  </summary>

  The position is only available after an internal update loop.

  ```javascript
  const frameX = engine.block.getFrameX(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The layout position on the x-axis.

  #### Signature

  ```typescript
  getFrameX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getFrameY()

    <br /><p>Gets the final calculated Y position of a block's frame.</p>
  </summary>

  The position is only available after an internal update loop.

  ```javascript
  const frameY = engine.block.getFrameY(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The layout position on the y-axis.

  #### Signature

  ```typescript
  getFrameY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getFrameWidth()

    <br /><p>Gets the final calculated width of a block's frame.</p>
  </summary>

  The width is only available after an internal update loop.

  ```javascript
  const frameWidth = engine.block.getFrameWidth(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The layout width.

  #### Signature

  ```typescript
  getFrameWidth(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getFrameHeight()

    <br /><p>Gets the final calculated height of a block's frame.</p>
  </summary>

  The height is only available after an internal update loop.

  ```javascript
  const frameHeight = engine.block.getFrameHeight(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The layout height.

  #### Signature

  ```typescript
  getFrameHeight(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalBoundingBoxX()

    <br /><p>Gets the X position of the block's global bounding box.</p>
  </summary>

  The position is in the scene's global coordinate space, with the origin at the top left.

  ```javascript
  const globalX = engine.block.getGlobalBoundingBoxX(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose bounding box should be calculated. |

  #### Returns

  `number`

  The x coordinate of the axis-aligned bounding box.

  #### Signature

  ```typescript
  getGlobalBoundingBoxX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalBoundingBoxY()

    <br /><p>Gets the Y position of the block's global bounding box.</p>
  </summary>

  The position is in the scene's global coordinate space, with the origin at the top left.

  ```javascript
  const globalY = engine.block.getGlobalBoundingBoxY(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose bounding box should be calculated. |

  #### Returns

  `number`

  The y coordinate of the axis-aligned bounding box.

  #### Signature

  ```typescript
  getGlobalBoundingBoxY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalBoundingBoxWidth()

    <br /><p>Gets the width of the block's global bounding box.</p>
  </summary>

  The width is in the scene's global coordinate space.

  ```javascript
  const globalWidth = engine.block.getGlobalBoundingBoxWidth(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose bounding box should be calculated. |

  #### Returns

  `number`

  The width of the axis-aligned bounding box.

  #### Signature

  ```typescript
  getGlobalBoundingBoxWidth(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalBoundingBoxHeight()

    <br /><p>Gets the height of the block's global bounding box.</p>
  </summary>

  The height is in the scene's global coordinate space.

  ```javascript
  const globalHeight = engine.block.getGlobalBoundingBoxHeight(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose bounding box should be calculated. |

  #### Returns

  `number`

  The height of the axis-aligned bounding box.

  #### Signature

  ```typescript
  getGlobalBoundingBoxHeight(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getScreenSpaceBoundingBoxXYWH()

    <br /><p>Gets the screen-space bounding box for a set of blocks.</p>
  </summary>

  ```javascript
  const boundingBox = engine.block.getScreenSpaceBoundingBoxXYWH([block]);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The block to query. |

  #### Returns

  [`XYWH`](./api/node/type-aliases/xywh.md)

  The position and size of the bounding box.

  #### Signature

  ```typescript
  getScreenSpaceBoundingBoxXYWH(ids: number[]): XYWH
  ```

  ***
</details>

<details>
  <summary>
    ### alignHorizontally()

    <br /><p>Aligns blocks horizontally.</p>
  </summary>

  Aligns multiple blocks within their bounding box or a single block to its parent.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A non-empty array of block ids. |
  | `horizontalBlockAlignment` | `"Auto"` | `"Right"` | `"Left"` | `"Center"` | How they should be aligned: 'Left', 'Right', or 'Center'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  alignHorizontally(ids: number[], horizontalBlockAlignment: "Auto" | "Right" | "Left" | "Center"): void
  ```

  ***
</details>

<details>
  <summary>
    ### alignVertically()

    <br /><p>Aligns blocks vertically.</p>
  </summary>

  Aligns multiple blocks within their bounding box or a single block to its parent.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A non-empty array of block ids. |
  | `verticalBlockAlignment` | `"Center"` | `"Top"` | `"Bottom"` | How they should be aligned: 'Top', 'Bottom', or 'Center'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  alignVertically(ids: number[], verticalBlockAlignment: "Center" | "Top" | "Bottom"): void
  ```

  ***
</details>

<details>
  <summary>
    ### distributeHorizontally()

    <br /><p>Distributes blocks horizontally with even spacing.</p>
  </summary>

  Distributes multiple blocks horizontally within their bounding box.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A non-empty array of block ids. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  distributeHorizontally(ids: number[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### distributeVertically()

    <br /><p>Distributes blocks vertically with even spacing.</p>
  </summary>

  Distributes multiple blocks vertically within their bounding box.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A non-empty array of block ids. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  distributeVertically(ids: number[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### fillParent()

    <br /><p>Resizes and positions a block to fill its parent.</p>
  </summary>

  The crop values of the block are reset if it can be cropped.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should fill its parent. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  fillParent(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### resizeContentAware()

    <br /><p>Resizes blocks while adjusting content to fit.</p>
  </summary>

  The content of the blocks is automatically adjusted to fit the new dimensions.
  Full-page blocks are resized to remain as full-page afterwards, while the blocks that are not full-page get resized as a group to the same scale factor and centered.

  ```javascript
  const pages = engine.scene.getPages();
  engine.block.resizeContentAware(pages, width: 100.0, 100.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks to resize. |
  | `width` | `number` | The new width of the blocks. |
  | `height` | `number` | The new height of the blocks. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  resizeContentAware(ids: number[], width: number, height: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### scale()

    <br /><p>Scales a block and its children proportionally.</p>
  </summary>

  This updates the position, size and style properties (e.g. stroke width) of
  the block and its children around the specified anchor point.

  ```javascript
  // Scale a block to double its size, anchored at the center.
  engine.block.scale(block, 2.0, 0.5, 0.5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should be scaled. |
  | `scale` | `number` | The scale factor to be applied to the current properties of the block. |
  | `anchorX?` | `number` | The relative position along the width of the block around which the scaling should occur (0=left, 0.5=center, 1=right). Defaults to 0. |
  | `anchorY?` | `number` | The relative position along the height of the block around which the scaling should occur (0=top, 0.5=center, 1=bottom). Defaults to 0. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  scale(id: number, scale: number, anchorX?: number, anchorY?: number): void
  ```
</details>

## Block Selection & Visibility

Manage a block's selection state and visibility on the canvas.

<details>
  <summary>
    ### select()

    <br /><p>Selects a block, deselecting all others.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to be selected. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  select(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setSelected()

    <br /><p>Sets the selection state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |
  | `selected` | `boolean` | Whether or not the block should be selected. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSelected(id: number, selected: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isSelected()

    <br /><p>Gets the selection state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block is selected, false otherwise.

  #### Signature

  ```typescript
  isSelected(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### findAllSelected()

    <br /><p>Finds all currently selected blocks.</p>
  </summary>

  #### Returns

  `number`\[]

  An array of block ids.

  #### Signature

  ```typescript
  findAllSelected(): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### isVisible()

    <br /><p>Gets the visibility state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if visible, false otherwise.

  #### Signature

  ```typescript
  isVisible(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setVisible()

    <br /><p>Sets the visibility state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `visible` | `boolean` | Whether the block shall be visible. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setVisible(id: number, visible: boolean): void
  ```
</details>

## Block Appearance

Control general appearance, including opacity, blend modes, flipping, and other visual properties.

<details>
  <summary>
    ### isClipped()

    <br /><p>Gets the clipped state of a block.</p>
  </summary>

  If true, the block should clip its contents to its frame.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if clipped, false otherwise.

  #### Signature

  ```typescript
  isClipped(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setClipped()

    <br /><p>Sets the clipped state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `clipped` | `boolean` | Whether the block should clips its contents to its frame. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setClipped(id: number, clipped: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFlipHorizontal()

    <br /><p>Gets the horizontal flip state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  A boolean indicating whether the block is flipped horizontally.

  #### Signature

  ```typescript
  getFlipHorizontal(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### getFlipVertical()

    <br /><p>Gets the vertical flip state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  A boolean indicating whether the block is flipped vertically.

  #### Signature

  ```typescript
  getFlipVertical(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setFlipHorizontal()

    <br /><p>Sets the horizontal flip state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `flip` | `boolean` | If the flip should be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFlipHorizontal(id: number, flip: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### setFlipVertical()

    <br /><p>Sets the vertical flip state of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `flip` | `boolean` | If the flip should be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFlipVertical(id: number, flip: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasOpacity()~~

    <br /><p>Checks if a block has an opacity property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has an opacity.

  #### Deprecated

  Use supportsOpacity() instead.

  ***
</details>

<details>
  <summary>
    ### supportsOpacity()

    <br /><p>Checks if a block supports opacity.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports opacity.

  #### Signature

  ```typescript
  supportsOpacity(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setOpacity()

    <br /><p>Sets the opacity of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose opacity should be set. |
  | `opacity` | `number` | The opacity to be set. The valid range is 0 to 1. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setOpacity(id: number, opacity: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getOpacity()

    <br /><p>Gets the opacity of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose opacity should be queried. |

  #### Returns

  `number`

  The opacity value.

  #### Signature

  ```typescript
  getOpacity(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasBlendMode()~~

    <br /><p>Checks if a block has a blend mode property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a blend mode.

  #### Deprecated

  Use supportsBlendMode() instead.

  ***
</details>

<details>
  <summary>
    ### supportsBlendMode()

    <br /><p>Checks if a block supports blend modes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports blend modes.

  #### Signature

  ```typescript
  supportsBlendMode(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setBlendMode()

    <br /><p>Sets the blend mode of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose blend mode should be set. |
  | `blendMode` | | `"Color"` | `"PassThrough"` | `"Normal"` | `"Darken"` | `"Multiply"` | `"ColorBurn"` | `"LinearBurn"` | `"DarkenColor"` | `"Lighten"` | `"Screen"` | `"ColorDodge"` | `"LinearDodge"` | `"LightenColor"` | `"Overlay"` | `"SoftLight"` | `"HardLight"` | `"VividLight"` | `"LinearLight"` | `"PinLight"` | `"HardMix"` | `"Difference"` | `"Exclusion"` | `"Subtract"` | `"Divide"` | `"Hue"` | `"Saturation"` | `"Luminosity"` | The blend mode to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBlendMode(id: number, blendMode: "Color" | "PassThrough" | "Normal" | "Darken" | "Multiply" | "ColorBurn" | "LinearBurn" | "DarkenColor" | "Lighten" | "Screen" | "ColorDodge" | "LinearDodge" | "LightenColor" | "Overlay" | "SoftLight" | "HardLight" | "VividLight" | "LinearLight" | "PinLight" | "HardMix" | "Difference" | "Exclusion" | "Subtract" | "Divide" | "Hue" | "Saturation" | "Luminosity"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getBlendMode()

    <br /><p>Gets the blend mode of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose blend mode should be queried. |

  #### Returns

  | `"Color"`
  | `"PassThrough"`
  | `"Normal"`
  | `"Darken"`
  | `"Multiply"`
  | `"ColorBurn"`
  | `"LinearBurn"`
  | `"DarkenColor"`
  | `"Lighten"`
  | `"Screen"`
  | `"ColorDodge"`
  | `"LinearDodge"`
  | `"LightenColor"`
  | `"Overlay"`
  | `"SoftLight"`
  | `"HardLight"`
  | `"VividLight"`
  | `"LinearLight"`
  | `"PinLight"`
  | `"HardMix"`
  | `"Difference"`
  | `"Exclusion"`
  | `"Subtract"`
  | `"Divide"`
  | `"Hue"`
  | `"Saturation"`
  | `"Luminosity"`

  The blend mode.

  #### Signature

  ```typescript
  getBlendMode(id: number): "Color" | "PassThrough" | "Normal" | "Darken" | "Multiply" | "ColorBurn" | "LinearBurn" | "DarkenColor" | "Lighten" | "Screen" | "ColorDodge" | "LinearDodge" | "LightenColor" | "Overlay" | "SoftLight" | "HardLight" | "VividLight" | "LinearLight" | "PinLight" | "HardMix" | "Difference" | "Exclusion" | "Subtract" | "Divide" | "Hue" | "Saturation" | "Luminosity"
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasBackgroundColor()~~

    <br /><p>Checks if a block has background color properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has background color properties.

  #### Deprecated

  Use supportsBackgroundColor() instead.

  ***
</details>

<details>
  <summary>
    ### supportsBackgroundColor()

    <br /><p>Checks if a block supports a background color.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports a background color.

  #### Signature

  ```typescript
  supportsBackgroundColor(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setBackgroundColorRGBA()~~

    <br /><p>Sets the background color of a block using RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose background color should be set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use `Use setColor() with the key path 'backgroundColor/color' instead.`.

  ***
</details>

<details>
  <summary>
    ### ~~getBackgroundColorRGBA()~~

    <br /><p>Gets the background color of a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose background color should be queried. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  The background color.

  #### Deprecated

  Use `Use getColor() with the key path 'backgroundColor/color' instead.`.

  ***
</details>

<details>
  <summary>
    ### setBackgroundColorEnabled()

    <br /><p>Enables or disables the background of a block.</p>
  </summary>

  ```javascript
  engine.block.setBackgroundColorEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose background should be enabled or disabled. |
  | `enabled` | `boolean` | If true, the background will be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBackgroundColorEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isBackgroundColorEnabled()

    <br /><p>Checks if the background of a block is enabled.</p>
  </summary>

  ```javascript
  const backgroundColorIsEnabled = engine.block.isBackgroundColorEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose background state should be queried. |

  #### Returns

  `boolean`

  True, if background is enabled.

  #### Signature

  ```typescript
  isBackgroundColorEnabled(id: number): boolean
  ```
</details>

## Block Fills

Create, configure, and manage block fills, including solid colors, gradients, and images.

<details>
  <summary>
    ### createFill()

    <br /><p>Creates a new fill block.</p>
  </summary>

  ```javascript
  const solidColoFill = engine.block.createFill('color');
  // Longhand fill types are also supported
  const imageFill = engine.block.createFill('//ly.img.ubq/fill/image');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`FillType`](./api/node/type-aliases/filltype.md) | The type of the fill object that shall be created. |

  #### Returns

  `number`

  The created fill's handle.

  #### Signature

  ```typescript
  createFill(type: FillType): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasContentFillMode()~~

    <br /><p>Checks if a block supports content fill modes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a content fill mode.

  #### Deprecated

  Use supportsContentFillMode instead.

  ***
</details>

<details>
  <summary>
    ### supportsContentFillMode()

    <br /><p>Checks if a block supports content fill modes.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a content fill mode.

  #### Signature

  ```typescript
  supportsContentFillMode(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setContentFillMode()

    <br /><p>Sets the content fill mode of a block.</p>
  </summary>

  ```javascript
  engine.block.setContentFillMode(image, 'Cover');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `mode` | `"Crop"` | `"Cover"` | `"Contain"` | The content fill mode: 'Crop', 'Cover' or 'Contain'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setContentFillMode(id: number, mode: "Crop" | "Cover" | "Contain"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getContentFillMode()

    <br /><p>Gets the content fill mode of a block.</p>
  </summary>

  ```javascript
  engine.block.getContentFillMode(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Crop"` | `"Cover"` | `"Contain"`

  The current mode: 'Crop', 'Cover' or 'Contain'.

  #### Signature

  ```typescript
  getContentFillMode(id: number): "Crop" | "Cover" | "Contain"
  ```

  ***
</details>

<details>
  <summary>
    ### setContentFillHorizontalAlignment()

    <br /><p>Sets the horizontal alignment of the content fill within a block.</p>
  </summary>

  Only affects 'Contain' and 'Cover' fill modes; has no visible effect in 'Crop' mode,
  where the user positions the content explicitly.

  ```javascript
  engine.block.setContentFillHorizontalAlignment(image, 'Left');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `alignment` | `"Right"` | `"Left"` | `"Center"` | The horizontal alignment: 'Left', 'Center' or 'Right'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setContentFillHorizontalAlignment(id: number, alignment: "Right" | "Left" | "Center"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getContentFillHorizontalAlignment()

    <br /><p>Gets the horizontal alignment of the content fill within a block.</p>
  </summary>

  ```javascript
  engine.block.getContentFillHorizontalAlignment(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Right"` | `"Left"` | `"Center"`

  The current alignment: 'Left', 'Center' or 'Right'.

  #### Signature

  ```typescript
  getContentFillHorizontalAlignment(id: number): "Right" | "Left" | "Center"
  ```

  ***
</details>

<details>
  <summary>
    ### setContentFillVerticalAlignment()

    <br /><p>Sets the vertical alignment of the content fill within a block.</p>
  </summary>

  Only affects 'Contain' and 'Cover' fill modes; has no visible effect in 'Crop' mode,
  where the user positions the content explicitly.

  ```javascript
  engine.block.setContentFillVerticalAlignment(image, 'Top');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `alignment` | `"Center"` | `"Top"` | `"Bottom"` | The vertical alignment: 'Top', 'Center' or 'Bottom'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setContentFillVerticalAlignment(id: number, alignment: "Center" | "Top" | "Bottom"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getContentFillVerticalAlignment()

    <br /><p>Gets the vertical alignment of the content fill within a block.</p>
  </summary>

  ```javascript
  engine.block.getContentFillVerticalAlignment(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `"Center"` | `"Top"` | `"Bottom"`

  The current alignment: 'Top', 'Center' or 'Bottom'.

  #### Signature

  ```typescript
  getContentFillVerticalAlignment(id: number): "Center" | "Top" | "Bottom"
  ```

  ***
</details>

<details>
  <summary>
    ### setGradientColorStops()

    <br /><p>Sets the color stops for a gradient property.</p>
  </summary>

  ```javascript
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
    { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
  ]);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | `string` | The name of the property to set, e.g. 'fill/gradient/colors'. |
  | `colors` | [`GradientColorStop`](./api/node/interfaces/gradientcolorstop.md)\[] | An array of gradient color stops. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setGradientColorStops(id: number, property: string, colors: GradientColorStop[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### getGradientColorStops()

    <br /><p>Gets the color stops from a gradient property.</p>
  </summary>

  ```
  engine.block.getGradientColorStops(gradientFill, 'fill/gradient/colors');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `string` | The name of the property to query. |

  #### Returns

  [`GradientColorStop`](./api/node/interfaces/gradientcolorstop.md)\[]

  The gradient colors.

  #### Signature

  ```typescript
  getGradientColorStops(id: number, property: string): GradientColorStop[]
  ```

  ***
</details>

<details>
  <summary>
    ### getSourceSet()

    <br /><p>Gets the source set from a block property.</p>
  </summary>

  ```javascript
  const sourceSet = engine.block.getSourceSet(imageFill, 'fill/image/sourceSet');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should be queried. |
  | `property` | [`SourceSetPropertyName`](./api/node/type-aliases/sourcesetpropertyname.md) | The name of the property to query, e.g. 'fill/image/sourceSet'. |

  #### Returns

  [`Source`](./api/node/interfaces/source.md)\[]

  The block's source set.

  #### Signature

  ```typescript
  getSourceSet(id: number, property: SourceSetPropertyName): Source[]
  ```

  ***
</details>

<details>
  <summary>
    ### setSourceSet()

    <br /><p>Sets the source set for a block property.</p>
  </summary>

  The crop and content fill mode of the associated block will be reset to default values.

  ```javascript
  engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [{
    uri: 'https://example.com/sample.jpg',
    width: 800,
    height: 600
  }]);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`SourceSetPropertyName`](./api/node/type-aliases/sourcesetpropertyname.md) | The name of the property to set. |
  | `sourceSet` | [`Source`](./api/node/interfaces/source.md)\[] | The block's new source set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSourceSet(id: number, property: SourceSetPropertyName, sourceSet: Source[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### addImageFileURIToSourceSet()

    <br /><p>Adds an image file URI to a source set property.</p>
  </summary>

  If an image with the same width already exists in the source set, it will be replaced.

  ```javascript
  await engine.block.addImageFileURIToSourceSet(imageFill, 'fill/image/sourceSet', 'https://example.com/sample.jpg');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `property` | [`SourceSetPropertyName`](./api/node/type-aliases/sourcesetpropertyname.md) | The name of the property to modify. |
  | `uri` | `string` | The source to add to the source set. |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when the operation is complete.

  #### Signature

  ```typescript
  addImageFileURIToSourceSet(id: number, property: SourceSetPropertyName, uri: string): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### addVideoFileURIToSourceSet()

    <br /><p>Adds a video file URI to a source set property.</p>
  </summary>

  If a video with the same width already exists in the source set, it will be replaced.

  ```javascript
  await engine.block.addVideoFileURIToSourceSet(videoFill, 'fill/video/sourceSet', 'https://example.com/sample.mp4');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `property` | [`SourceSetPropertyName`](./api/node/type-aliases/sourcesetpropertyname.md) | The name of the property to modify. |
  | `uri` | `string` | The source to add to the source set. |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when the operation is complete.

  #### Signature

  ```typescript
  addVideoFileURIToSourceSet(id: number, property: SourceSetPropertyName, uri: string): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasFillColor()~~

    <br /><p>Checks if a block has fill color properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has fill color properties.

  #### Deprecated

  Query the fill's type using getFill() and getType() instead.

  ***
</details>

<details>
  <summary>
    ### ~~setFillColorRGBA()~~

    <br /><p>Sets the fill color of a block using RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill color should be set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setFillSolidColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~getFillColorRGBA()~~

    <br /><p>Gets the fill color of a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill color should be queried. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  The fill color.

  #### Deprecated

  Use getFillSolidColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~setFillColorEnabled()~~

    <br /><p>Enables or disables the fill of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill should be enabled or disabled. |
  | `enabled` | `boolean` | If true, the fill will be enabled. |

  #### Returns

  `void`

  #### Deprecated

  Use setFillEnabled() instead.

  ***
</details>

<details>
  <summary>
    ### ~~isFillColorEnabled()~~

    <br /><p>Checks if the fill of a block is enabled.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill state should be queried. |

  #### Returns

  `boolean`

  True, if fill is enabled.

  #### Deprecated

  Use isFillEnabled() instead.

  ***
</details>

<details>
  <summary>
    ### ~~hasFill()~~

    <br /><p>Checks if a block has fill properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has fill properties.

  #### Deprecated

  Use supportsFill instead.

  ***
</details>

<details>
  <summary>
    ### supportsFill()

    <br /><p>Checks if a block supports a fill.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports a fill.

  #### Signature

  ```typescript
  supportsFill(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isFillEnabled()

    <br /><p>Checks if the fill of a block is enabled.</p>
  </summary>

  ```javascript
  engine.block.isFillEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill state should be queried. |

  #### Returns

  `boolean`

  The fill state.

  #### Signature

  ```typescript
  isFillEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setFillEnabled()

    <br /><p>Enables or disables the fill of a block.</p>
  </summary>

  ```javascript
  engine.block.setFillEnabled(block, false);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill should be enabled or disabled. |
  | `enabled` | `boolean` | If true, the fill will be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFillEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFillOverprint()

    <br /><p>Queries whether the fill of a block is marked as overprint for PDF export.</p>
  </summary>

  ```javascript
  const overprint = engine.block.getFillOverprint(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill overprint flag should be queried. |

  #### Returns

  `boolean`

  The fill overprint flag.

  #### Signature

  ```typescript
  getFillOverprint(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setFillOverprint()

    <br /><p>Marks the fill of a block as overprint for PDF export.</p>
  </summary>

  The flag is only honored by the PDF writer when the fill uses a spot color
  (Separation/DeviceN). For process-color fills it is a silent no-op. On-screen
  rendering ignores the flag.

  ```javascript
  engine.block.setFillOverprint(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill overprint flag should be set. |
  | `overprint` | `boolean` | If true, the fill is marked as overprint in exported PDFs. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFillOverprint(id: number, overprint: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFill()

    <br /><p>Gets the fill block attached to a given block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill block should be returned. |

  #### Returns

  `number`

  The block that currently defines the given block's fill.

  #### Signature

  ```typescript
  getFill(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setFill()

    <br /><p>Sets the fill block for a given block.</p>
  </summary>

  The previous fill block is not destroyed automatically.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill should be changed. |
  | `fill` | `number` | The new fill block. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFill(id: number, fill: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setFillSolidColor()

    <br /><p>Sets the solid fill color of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill color should be set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. Defaults to 1. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFillSolidColor(id: number, r: number, g: number, b: number, a?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFillSolidColor()

    <br /><p>Gets the solid fill color of a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose fill color should be queried. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  The fill color.

  #### Signature

  ```typescript
  getFillSolidColor(id: number): RGBA
  ```
</details>

## Block Shapes

Create and configure shape blocks and geometric forms.

<details>
  <summary>
    ### createShape()

    <br /><p>Creates a new shape block of a given type.</p>
  </summary>

  ```javascript
  const star = engine.block.createShape('star');
  // Longhand shape types are also supported
  const rect = engine.block.createShape('//ly.img.ubq/shape/rect');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`ShapeType`](./api/node/type-aliases/shapetype.md) | The type of the shape object that shall be created. |

  #### Returns

  `number`

  The created shape's handle.

  #### Signature

  ```typescript
  createShape(type: ShapeType): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasShape()~~

    <br /><p>Checks if a block has a shape property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a shape property, an error otherwise.

  #### Deprecated

  Use supportsShape instead.

  ***
</details>

<details>
  <summary>
    ### supportsShape()

    <br /><p>Checks if a block supports having a shape.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a shape property, an error otherwise.

  #### Signature

  ```typescript
  supportsShape(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### getShape()

    <br /><p>Gets the shape block attached to a given block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose shape block should be returned. |

  #### Returns

  `number`

  The block that currently defines the given block's shape.

  #### Signature

  ```typescript
  getShape(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setShape()

    <br /><p>Sets the shape block for a given block.</p>
  </summary>

  Note that the previous shape block is not destroyed automatically.
  The new shape is disconnected from its previously attached block.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose shape should be changed. |
  | `shape` | `number` | The new shape. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setShape(id: number, shape: number): void
  ```
</details>

## Block Text

Create, edit, and style text content.

<details>
  <summary>
    ### replaceText()

    <br /><p>Replaces a range of text in a text block.</p>
  </summary>

  ```javascript
  engine.block.replaceText(text, 'Hello World');
  engine.block.replaceText(text, 'Alex', 6, 11);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block into which to insert the given text. |
  | `text` | `string` | The text which should replace the selected range in the block. |
  | `from?` | `number` | The start index of the UTF-16 range to replace. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range to replace. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  replaceText(id: number, text: string, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeText()

    <br /><p>Removes a range of text from a text block.</p>
  </summary>

  ```javascript
  engine.block.removeText(text, 0, 6);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block from which the selected text should be removed. |
  | `from?` | `number` | The start index of the UTF-16 range to remove. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range to remove. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeText(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setTextColor()

    <br /><p>Sets the color for a range of text.</p>
  </summary>

  ```javascript
  engine.block.setTextColor(text, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }, 1, 4);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose color should be changed. |
  | `color` | [`Color`](./api/node/type-aliases/color.md) | The new color of the selected text range. |
  | `from?` | `number` | The start index of the UTF-16 range to change. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range to change. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextColor(id: number, color: Color, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextColors()

    <br /><p>Gets the unique colors within a range of text.</p>
  </summary>

  ```javascript
  const colorsInRange = engine.block.getTextColors(text, 2, 5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose colors should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`Color`](./api/node/type-aliases/color.md)\[]

  The ordered unique list of colors.

  #### Signature

  ```typescript
  getTextColors(id: number, from?: number, to?: number): Color[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextFontWeight()

    <br /><p>Sets the font weight for a range of text.</p>
  </summary>

  ```javascript
  engine.block.setTextFontWeight(text, 'bold', 0, 5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose weight should be changed. |
  | `fontWeight` | [`FontWeight`](./api/node/type-aliases/fontweight.md) | The new weight of the selected text range. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextFontWeight(id: number, fontWeight: FontWeight, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextFontWeights()

    <br /><p>Gets the unique font weights within a range of text.</p>
  </summary>

  ```javascript
  const fontWeights = engine.block.getTextFontWeights(text, 0, 6);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font weights should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`FontWeight`](./api/node/type-aliases/fontweight.md)\[]

  The ordered unique list of font weights.

  #### Signature

  ```typescript
  getTextFontWeights(id: number, from?: number, to?: number): FontWeight[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextFontSize()

    <br /><p>Sets the font size for a range of text.</p>
  </summary>

  ```javascript
  // With numeric fontSize (in points)
  engine.block.setTextFontSize(text, 12, 0, 5);

  // With font size and options object
  engine.block.setTextFontSize(text, 16, { unit: 'Pixel' });
  engine.block.setTextFontSize(text, 24, { unit: 'Point', from: 0, to: 10 });
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font size should be changed. |
  | `fontSize` | `number` | The new font size value. |
  | `options?` | [`TextFontSizeOptions`](./api/node/interfaces/textfontsizeoptions.md) | An options object with unit, from, and to properties. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  setTextFontSize(
     id, 
     fontSize, 
     from?, 
     to?): void;
  ```

  Sets the font size for a range of text.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font size should be changed. |
  | `fontSize` | `number` | The new font size in points. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  ##### Returns

  `void`

  ##### Deprecated

  Use the new signature with options object instead.

  ##### Example

  ```typescript
  // Before migration
  engine.block.setTextFontSize(text, 18, 0, 5);
  // After migration
  engine.block.setTextFontSize(text, 18, { from: 0, to: 5 });
  ```

  #### Signatures

  ```typescript
  setTextFontSize(id: number, fontSize: number, options?: TextFontSizeOptions): void
  ```

  ```typescript
  setTextFontSize(id: number, fontSize: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextFontSizes()

    <br /><p>Gets the unique font sizes within a range of text.</p>
  </summary>

  ```javascript
  // Get all font sizes
  const fontSizes = engine.block.getTextFontSizes(text);

  // Get font sizes for a range
  const fontSizes = engine.block.getTextFontSizes(text, 0, 10);

  // With options object
  const sizesInPx = engine.block.getTextFontSizes(text, { unit: 'Pixel' });
  const sizesInRange = engine.block.getTextFontSizes(text, { unit: 'Millimeter', from: 5, to: 15 });
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font sizes should be returned. |
  | `options?` | [`TextFontSizeOptions`](./api/node/interfaces/textfontsizeoptions.md) | An options object with unit, from, and to properties. |

  ##### Returns

  `number`\[]

  The ordered unique list of font sizes.

  #### Call Signature

  ```ts
  getTextFontSizes(
     id, 
     from?, 
     to?): number[];
  ```

  Gets the unique font sizes within a range of text.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font sizes should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  ##### Returns

  `number`\[]

  The ordered unique list of font sizes in points.

  ##### Deprecated

  Use the new signature with options object instead.

  ##### Example

  ```typescript
  // Before migration
  const fontSizes = engine.block.getTextFontSizes(text, 0, 10);
  // After migration
  const fontSizes = engine.block.getTextFontSizes(text, { from: 0, to: 10 });
  ```

  #### Signatures

  ```typescript
  getTextFontSizes(id: number, options?: TextFontSizeOptions): number[]
  ```

  ```typescript
  getTextFontSizes(id: number, from?: number, to?: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextFontStyle()

    <br /><p>Sets the font style for a range of text.</p>
  </summary>

  ```javascript
  engine.block.setTextFontStyle(text, 'italic', 0, 5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose style should be changed. |
  | `fontStyle` | [`FontStyle`](./api/node/type-aliases/fontstyle.md) | The new style of the selected text range. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextFontStyle(id: number, fontStyle: FontStyle, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextFontStyles()

    <br /><p>Gets the unique font styles within a range of text.</p>
  </summary>

  ```javascript
  const fontStyles = engine.block.getTextFontStyles(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font styles should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`FontStyle`](./api/node/type-aliases/fontstyle.md)\[]

  The ordered unique list of font styles.

  #### Signature

  ```typescript
  getTextFontStyles(id: number, from?: number, to?: number): FontStyle[]
  ```

  ***
</details>

<details>
  <summary>
    ### getTextCases()

    <br /><p>Gets the unique text cases within a range of text.</p>
  </summary>

  ```javascript
  const textCases = engine.block.getTextCases(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose text cases should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`TextCase`](./api/node/type-aliases/textcase.md)\[]

  The ordered list of text cases.

  #### Signature

  ```typescript
  getTextCases(id: number, from?: number, to?: number): TextCase[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextCase()

    <br /><p>Sets the text case for a range of text.</p>
  </summary>

  ```javascript
  engine.block.setTextCase(text, 'Titlecase');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose text case should be changed. |
  | `textCase` | [`TextCase`](./api/node/type-aliases/textcase.md) | The new text case value. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextCase(id: number, textCase: TextCase, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextDecorations()

    <br /><p>Gets the unique text decoration configurations within a range of text.</p>
  </summary>

  Each element of the returned array is a decoration configuration representing
  a unique combination of lines, style, color, and thickness found in the range.

  ```javascript
  const decorations = engine.block.getTextDecorations(text);
  // e.g., [{ lines: ['None'] }, { lines: ['Underline'], style: 'Dashed' }]
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose text decorations should be returned. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`TextDecorationConfig`](./api/node/interfaces/textdecorationconfig.md)\[]

  The ordered list of unique decoration configurations.

  #### Signature

  ```typescript
  getTextDecorations(id: number, from?: number, to?: number): TextDecorationConfig[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextDecoration()

    <br /><p>Sets the text decoration for a range of text.</p>
  </summary>

  The config specifies which decoration lines, style, underline color, thickness, and offset to apply.
  Use `{ lines: ['None'] }` to remove all decorations.

  ```javascript
  engine.block.setTextDecoration(text, { lines: ['Underline'] });
  engine.block.setTextDecoration(text, { lines: ['Underline', 'Strikethrough'], style: 'Dashed' });
  engine.block.setTextDecoration(text, { lines: ['Overline'], style: 'Wavy', underlineThickness: 2.0 });
  engine.block.setTextDecoration(text, { lines: ['None'] }); // Remove decorations
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose text decoration should be changed. |
  | `config` | [`TextDecorationConfig`](./api/node/interfaces/textdecorationconfig.md) | The decoration configuration to apply. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextDecoration(id: number, config: TextDecorationConfig, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setTextKerning()

    <br /><p>Sets kerning for a grapheme range.</p>
  </summary>

  Applies an additional offset in em units on top of the font's built-in kern.
  `1.0` equals the run's font size, so the offset scales proportionally with text size.

  ```javascript
  engine.block.setTextKerning(text, 0.1); // add 10% of font size as extra spacing
  engine.block.setTextKerning(text, -0.05, 0, 5); // tighten first 5 graphemes
  engine.block.setTextKerning(text, 0); // reset to no extra offset
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `kerning` | `number` | Additional kerning in em units (1.0 = one full em). Use 0 for no extra offset. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextKerning(id: number, kerning: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextKernings()

    <br /><p>Returns the unique kerning values across the grapheme range.</p>
  </summary>

  ```javascript
  const kernings = engine.block.getTextKernings(text); // e.g. [0] or [0.1, 0]
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `number`\[]

  #### Signature

  ```typescript
  getTextKernings(id: number, from?: number, to?: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### toggleTextDecorationUnderline()

    <br /><p>Toggles the underline decoration for a text range.</p>
  </summary>

  If any part of the range does not have underline, the entire range gets underline.
  If the entire range already has underline, it is removed.
  Other decoration lines (strikethrough, overline) on each text run are preserved.

  ```javascript
  engine.block.toggleTextDecorationUnderline(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleTextDecorationUnderline(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### toggleTextDecorationStrikethrough()

    <br /><p>Toggles the strikethrough decoration for a text range.</p>
  </summary>

  If any part of the range does not have strikethrough, the entire range gets strikethrough.
  If the entire range already has strikethrough, it is removed.
  Other decoration lines (underline, overline) on each text run are preserved.

  ```javascript
  engine.block.toggleTextDecorationStrikethrough(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleTextDecorationStrikethrough(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### toggleTextDecorationOverline()

    <br /><p>Toggles the overline decoration for a text range.</p>
  </summary>

  If any part of the range does not have overline, the entire range gets overline.
  If the entire range already has overline, it is removed.
  Other decoration lines (underline, strikethrough) on each text run are preserved.

  ```javascript
  engine.block.toggleTextDecorationOverline(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleTextDecorationOverline(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextHorizontalAlignment()

    <br /><p>Gets the paragraph-level horizontal alignment override for a specific paragraph,
    or the block-level alignment.</p>
  </summary>

  ```javascript
  const alignment = engine.block.getTextHorizontalAlignment(text, 0);
  const blockAlignment = engine.block.getTextHorizontalAlignment(text); // paragraphIndex defaults to -1
  // e.g. 'Left' | 'Center' | 'Right' | 'Auto' | undefined
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `paragraphIndex?` | `number` | The 0-based index of the paragraph to query. Negative values return the block-level `text/horizontalAlignment` setting. |

  #### Returns

  `"Auto"` | `"Right"` | `"Left"` | `"Center"`

  The paragraph override, `undefined` if no override is set,
  or the block-level alignment when `paragraphIndex < 0`.

  #### Signature

  ```typescript
  getTextHorizontalAlignment(id: number, paragraphIndex?: number): "Auto" | "Right" | "Left" | "Center"
  ```

  ***
</details>

<details>
  <summary>
    ### setTextHorizontalAlignment()

    <br /><p>Sets the paragraph-level horizontal alignment override for one or all paragraphs.</p>
  </summary>

  ```javascript
  engine.block.setTextHorizontalAlignment(text, 'Center', 0);
  engine.block.setTextHorizontalAlignment(text, undefined, 0); // clear override
  engine.block.setTextHorizontalAlignment(text, 'Right'); // apply to all
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `alignment` | `"Auto"` | `"Right"` | `"Left"` | `"Center"` | The alignment to apply, or `undefined` to clear the paragraph override. |
  | `paragraphIndex?` | `number` | The 0-based index of the paragraph. Negative values clear all paragraph-level alignment overrides and, when `alignment` is provided, apply that alignment to the whole text block. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextHorizontalAlignment(id: number, alignment: "Auto" | "Right" | "Left" | "Center", paragraphIndex?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextListStyle()

    <br /><p>Gets the list style for a specific paragraph of a text block.</p>
  </summary>

  ```javascript
  const listStyle = engine.block.getTextListStyle(text, 0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose list style should be returned. |
  | `paragraphIndex` | `number` | The 0-based index of the paragraph. |

  #### Returns

  [`ListStyle`](./api/node/type-aliases/liststyle.md)

  The list style of the paragraph.

  #### Signature

  ```typescript
  getTextListStyle(id: number, paragraphIndex: number): ListStyle
  ```

  ***
</details>

<details>
  <summary>
    ### setTextListStyle()

    <br /><p>Sets the list style for a specific paragraph or all paragraphs of a text block.</p>
  </summary>

  ```javascript
  engine.block.setTextListStyle(text, 'Unordered');
  engine.block.setTextListStyle(text, 'Ordered', 0, 2);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose list style should be changed. |
  | `listStyle` | [`ListStyle`](./api/node/type-aliases/liststyle.md) | The list style to apply. |
  | `paragraphIndex?` | `number` | The 0-based index of the paragraph to modify. Negative values apply to all paragraphs. |
  | `listLevel?` | `number` | Optional list nesting level to set atomically with the list style (0 = outermost). When omitted the existing list level of each paragraph is preserved. Has no visual effect when listStyle is 'None'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextListStyle(id: number, listStyle: ListStyle, paragraphIndex?: number, listLevel?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextListLevel()

    <br /><p>Gets the list nesting level for a specific paragraph of a text block.</p>
  </summary>

  ```javascript
  const listLevel = engine.block.getTextListLevel(text, 0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose list level should be returned. |
  | `paragraphIndex` | `number` | The 0-based index of the paragraph. |

  #### Returns

  `number`

  The list nesting level of the paragraph.

  #### Signature

  ```typescript
  getTextListLevel(id: number, paragraphIndex: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setTextListLevel()

    <br /><p>Sets the list nesting level for a specific paragraph or all paragraphs of a text block.</p>
  </summary>

  ```javascript
  engine.block.setTextListLevel(text, 1);
  engine.block.setTextListLevel(text, 2, 0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose list level should be changed. |
  | `listLevel` | `number` | The list nesting level (0 = outermost). |
  | `paragraphIndex?` | `number` | The 0-based index of the paragraph to modify. Negative values apply to all paragraphs. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextListLevel(id: number, listLevel: number, paragraphIndex?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextParagraphIndices()

    <br /><p>Returns the 0-based paragraph indices that overlap the given UTF-16 range.</p>
  </summary>

  The range is half-open (exclusive): `from` is inclusive, `to` is exclusive (one past the last
  code unit of interest). When `from === to` the range is a cursor position and the paragraph
  containing `from` is returned. This convention matches `getTextCursorRange`, so the values
  it returns can be passed directly without adjustment.

  Negative values for either parameter cause all paragraph indices to be returned.

  ```javascript
  const indices = engine.block.getTextParagraphIndices(text);
  const { from, to } = engine.block.getTextCursorRange();
  const indices = engine.block.getTextParagraphIndices(text, from, to);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `from?` | `number` | The inclusive start UTF-16 index. Negative values reference the entire text. |
  | `to?` | `number` | The exclusive end UTF-16 index. Negative values reference the entire text. |

  #### Returns

  `number`\[]

  The paragraph indices overlapping the range.

  #### Signature

  ```typescript
  getTextParagraphIndices(id: number, from?: number, to?: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### setTextLineHeight()

    <br /><p>Sets the line height multiplier for a specific paragraph or all paragraphs of a text block.</p>
  </summary>

  ```javascript
  engine.block.setTextLineHeight(text, 1.5);
  engine.block.setTextLineHeight(text, 1.5, 0);
  engine.block.setTextLineHeight(text, null); // reset all paragraphs to block default
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `lineHeight` | `number` | The line height multiplier, or `null` to reset to the block-level default. |
  | `paragraphIndex?` | `number` | The 0-based index of the paragraph to modify. Negative values apply to all paragraphs. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextLineHeight(id: number, lineHeight: number, paragraphIndex?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextLineHeight()

    <br /><p>Returns the line height multiplier for a specific paragraph of a text block.</p>
  </summary>

  Returns the per-paragraph override if one is set, otherwise returns the block-level `lineHeight`.

  ```javascript
  const lineHeight = engine.block.getTextLineHeight(text, 0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `paragraphIndex` | `number` | The 0-based index of the paragraph. |

  #### Returns

  `number`

  The line height multiplier for the paragraph.

  #### Signature

  ```typescript
  getTextLineHeight(id: number, paragraphIndex: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### canToggleBoldFont()

    <br /><p>Checks if the bold font weight can be toggled for a range of text.</p>
  </summary>

  Returns true if any part of the range is not bold and the bold font is available.

  ```javascript
  const canToggleBold = engine.block.canToggleBoldFont(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to check. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `boolean`

  Whether the font weight can be toggled.

  #### Signature

  ```typescript
  canToggleBoldFont(id: number, from?: number, to?: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### canToggleItalicFont()

    <br /><p>Checks if the italic font style can be toggled for a range of text.</p>
  </summary>

  Returns true if any part of the range is not italic and the italic font is available.

  ```javascript
  const canToggleItalic = engine.block.canToggleItalicFont(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to check. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `boolean`

  Whether the font style can be toggled.

  #### Signature

  ```typescript
  canToggleItalicFont(id: number, from?: number, to?: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### toggleBoldFont()

    <br /><p>Toggles the font weight of a text range between bold and normal.</p>
  </summary>

  If any part of the range is not bold, the entire range becomes bold. If the entire range is already bold, it becomes normal.

  ```javascript
  engine.block.toggleBoldFont(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleBoldFont(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### toggleItalicFont()

    <br /><p>Toggles the font style of a text range between italic and normal.</p>
  </summary>

  If any part of the range is not italic, the entire range becomes italic. If the entire range is already italic, it becomes normal.

  ```javascript
  engine.block.toggleItalicFont(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  toggleItalicFont(id: number, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setFont()

    <br /><p>Sets the font and typeface for an entire text block.</p>
  </summary>

  Existing formatting is reset.

  ```javascript
  engine.block.setFont(text, font.uri, typeface);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font should be changed. |
  | `fontFileUri` | `string` | The URI of the new font file. |
  | `typeface` | [`Typeface`](./api/node/interfaces/typeface.md) | The typeface of the new font. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFont(id: number, fontFileUri: string, typeface: Typeface): void
  ```

  ***
</details>

<details>
  <summary>
    ### setTypeface()

    <br /><p>Sets the typeface for a range of text.</p>
  </summary>

  The current formatting is retained as much as possible.

  ```javascript
  engine.block.setTypeface(text, typeface, 2, 5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose font should be changed. |
  | `typeface` | [`Typeface`](./api/node/interfaces/typeface.md) | The new typeface. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTypeface(id: number, typeface: Typeface, from?: number, to?: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTypeface()

    <br /><p>Gets the base typeface of a text block.</p>
  </summary>

  This does not return the typefaces of individual text runs.

  ```javascript
  const defaultTypeface = engine.block.getTypeface(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose typeface should be queried. |

  #### Returns

  [`Typeface`](./api/node/interfaces/typeface.md)

  the typeface property of the text block.

  #### Signature

  ```typescript
  getTypeface(id: number): Typeface
  ```

  ***
</details>

<details>
  <summary>
    ### getTypefaces()

    <br /><p>Gets the unique typefaces within a range of text.</p>
  </summary>

  ```javascript
  const currentTypefaces = engine.block.getTypefaces(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose typefaces should be queried. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`Typeface`](./api/node/interfaces/typeface.md)\[]

  The unique typefaces in the range.

  #### Signature

  ```typescript
  getTypefaces(id: number, from?: number, to?: number): Typeface[]
  ```

  ***
</details>

<details>
  <summary>
    ### getTextRuns()

    <br /><p>Gets all text runs within a range of text.</p>
  </summary>

  Each run represents a contiguous span of text with uniform formatting.

  ```javascript
  const runs = engine.block.getTextRuns(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `from?` | `number` | The start index of the UTF-16 range. Defaults to the start of the current selection or text. |
  | `to?` | `number` | The end index of the UTF-16 range. Defaults to the end of the current selection or text. |

  #### Returns

  [`TextRunInfo`](./api/node/interfaces/textruninfo.md)\[]

  The ordered list of text runs covering the requested range.

  #### Signature

  ```typescript
  getTextRuns(id: number, from?: number, to?: number): TextRunInfo[]
  ```

  ***
</details>

<details>
  <summary>
    ### getTextCursorRange()

    <br /><p>Gets the current text cursor or selection range.</p>
  </summary>

  Returns the UTF-16 indices of the selected range of the text block that is currently being
  edited. The range is half-open (exclusive): `from` is the index of the first selected code
  unit, `to` is one past the last selected code unit. When `from === to` the cursor is
  positioned between characters with no text selected.

  ```javascript
  const selectedRange = engine.block.getTextCursorRange();
  ```

  #### Returns

  [`Range`](./api/node/interfaces/range.md)

  The selected UTF-16 range or `{ from: -1, to: -1 }` if no text block is being edited.

  #### Signature

  ```typescript
  getTextCursorRange(): Range_2
  ```

  ***
</details>

<details>
  <summary>
    ### setTextCursorRange()

    <br /><p>Sets the text cursor range (selection) within the text block that is currently being edited.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `range` | [`Range`](./api/node/interfaces/range.md) | The UTF-16 range to set as the selection. If `from` equals `to`, the cursor is positioned at that index. If `from` and `to` are set to -1, the whole text is selected. |

  #### Returns

  `void`

  #### Throws

  Error if no text block is currently being edited or if the range is invalid.

  #### Signature

  ```typescript
  setTextCursorRange(range: Range_2): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextVisibleLineCount()

    <br /><p>Gets the number of visible lines in a text block.</p>
  </summary>

  ```javascript
  const lineCount = engine.block.getTextVisibleLineCount(text);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose line count should be returned. |

  #### Returns

  `number`

  The number of lines in the text block.

  #### Signature

  ```typescript
  getTextVisibleLineCount(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getTextVisibleLineGlobalBoundingBoxXYWH()

    <br /><p>Gets the global bounding box of a visible line of text.</p>
  </summary>

  The values are in the scene's global coordinate space.

  ```javascript
  const lineBoundingBox = engine.block.getTextVisibleLineGlobalBoundingBoxXYWH(text, 0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose line bounding box should be returned. |
  | `lineIndex` | `number` | The index of the line whose bounding box should be returned. |

  #### Returns

  [`XYWH`](./api/node/type-aliases/xywh.md)

  The bounding box of the line.

  #### Signature

  ```typescript
  getTextVisibleLineGlobalBoundingBoxXYWH(id: number, lineIndex: number): XYWH
  ```

  ***
</details>

<details>
  <summary>
    ### getTextVisibleLineContent()

    <br /><p>Gets the text content of a visible line.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose line content should be returned. |
  | `lineIndex` | `number` | The index of the line whose content should be returned. |

  #### Returns

  `string`

  The text content of the line.

  #### Signature

  ```typescript
  getTextVisibleLineContent(id: number, lineIndex: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### getTextCharacterInkBoxes()

    <br /><p>Returns the tight ink-paint bounding box for each grapheme in the range.
    One entry per grapheme in \[from, to). Non-printable graphemes get a zero-rect.
    Coordinates are in global scene space.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |
  | `from?` | `number` | Start grapheme index (-1 = start of cursor selection or 0). |
  | `to?` | `number` | End grapheme index (-1 = end of cursor selection or text length). |

  #### Returns

  [`CharacterInkBox`](./api/node/interfaces/characterinkbox.md)\[]

  Array of CharacterInkBox, one per grapheme in range, in text order.

  #### Signature

  ```typescript
  getTextCharacterInkBoxes(id: number, from?: number, to?: number): CharacterInkBox[]
  ```

  ***
</details>

<details>
  <summary>
    ### getTextEffectiveHorizontalAlignment()

    <br /><p>Gets the effective horizontal alignment of a text block.
    If the alignment is set to Auto, this returns the resolved alignment (Left or Right)
    based on the text direction of the first logical run. This never returns 'Auto'.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block whose effective alignment should be returned. |

  #### Returns

  `"Right"` | `"Left"` | `"Center"`

  The effective alignment ('Left', 'Right', or 'Center').

  #### Signature

  ```typescript
  getTextEffectiveHorizontalAlignment(id: number): "Right" | "Left" | "Center"
  ```

  ***
</details>

<details>
  <summary>
    ### setTextOnPath()

    <br /><p>Sets the SVG path that the text baseline follows.
    Pass <code>null</code> to restore normal straight-line text layout.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `svgPath` | `string` | An SVG path string in the block's local coordinate space, or `null` to clear. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextOnPath(id: number, svgPath: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextOnPath()

    <br /><p>Gets the SVG path currently used as the text baseline.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |

  #### Returns

  `string`

  The SVG path string, or `null` if no path is set.

  #### Signature

  ```typescript
  getTextOnPath(id: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### setTextOnPathOffset()

    <br /><p>Sets the start offset along the baseline path as a proportion of the path length.
    Values are clamped to <code>\[-1, 1]</code>; <code>1</code> and <code>-1</code> wrap back to the path start.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `offset` | `number` | The proportional offset. Positive values move the text forward along the path. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextOnPathOffset(id: number, offset: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextOnPathOffset()

    <br /><p>Gets the start offset along the baseline path as a proportion of the path length.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |

  #### Returns

  `number`

  The proportional offset in `[-1, 1]`.

  #### Signature

  ```typescript
  getTextOnPathOffset(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setTextOnPathFlipped()

    <br /><p>Sets whether text is placed on the opposite side of the baseline path.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to modify. |
  | `flipped` | `boolean` | When `true`, text sits on the underside of the curve and reads in the reverse direction. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTextOnPathFlipped(id: number, flipped: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTextOnPathFlipped()

    <br /><p>Gets whether the text-on-path rendering is flipped.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The text block to query. |

  #### Returns

  `boolean`

  `true` when text is on the underside of the curve.

  #### Signature

  ```typescript
  getTextOnPathFlipped(id: number): boolean
  ```
</details>

## Block Video

Manage time-based media like video and audio, including playback, timing, and controls.

<details>
  <summary>
    ### createCaptionsFromURI()

    <br /><p>Creates new caption blocks from an SRT or VTT file URI.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `uri` | `string` | The URI for the captions file to load. Supported file formats are: SRT and VTT. |

  #### Returns

  `Promise`\<`number`\[]>

  A promise that resolves with a list of the created caption blocks.

  #### Signature

  ```typescript
  createCaptionsFromURI(uri: string): Promise<number[]>
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasDuration()~~

    <br /><p>Checks if a block has a duration property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true if the block has a duration property.

  #### Deprecated

  Use supportsDuration instead.

  ***
</details>

<details>
  <summary>
    ### supportsDuration()

    <br /><p>Checks if a block supports a duration property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true if the block supports a duration property.

  #### Signature

  ```typescript
  supportsDuration(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setDuration()

    <br /><p>Sets the playback duration of a block.</p>
  </summary>

  The duration defines how long the block is active in the scene during playback.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose duration should be changed. |
  | `duration` | `number` | The new duration in seconds. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDuration(id: number, duration: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDuration()

    <br /><p>Gets the playback duration of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose duration should be returned. |

  #### Returns

  `number`

  The block's duration in seconds.

  #### Signature

  ```typescript
  getDuration(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setPageDurationSource()

    <br /><p>Sets a block as the page's duration source.</p>
  </summary>

  This causes the page's total duration to be automatically determined by this block.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `page` | `number` | The page block for which it should be enabled. |
  | `id` | `number` | The block that should become the duration source. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPageDurationSource(page: number, id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPageDurationSource()

    <br /><p>Checks if a block is the duration source for its page.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose duration source property should be queried. |

  #### Returns

  `boolean`

  true if the block is a duration source for a page.

  #### Signature

  ```typescript
  isPageDurationSource(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### supportsPageDurationSource()

    <br /><p>Checks if a block can be set as the page's duration source.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `page` | `number` | The page to check against. |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block can be marked as the page's duration source.

  #### Signature

  ```typescript
  supportsPageDurationSource(page: number, id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### removePageDurationSource()

    <br /><p>Removes a block as the page's duration source.</p>
  </summary>

  If a scene or page is given, it is deactivated for all blocks within it.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose duration source property should be removed. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removePageDurationSource(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasTimeOffset()~~

    <br /><p>Checks if a block has a time offset property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has a time offset property.

  #### Deprecated

  Use supportsTimeOffset instead.

  ***
</details>

<details>
  <summary>
    ### supportsTimeOffset()

    <br /><p>Checks if a block supports a time offset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports a time offset.

  #### Signature

  ```typescript
  supportsTimeOffset(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setTimeOffset()

    <br /><p>Sets the time offset of a block relative to its parent.</p>
  </summary>

  The time offset controls when the block first becomes active in the timeline.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose time offset should be changed. |
  | `offset` | `number` | The new time offset in seconds. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTimeOffset(id: number, offset: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTimeOffset()

    <br /><p>Gets the time offset of a block relative to its parent.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose time offset should be queried. |

  #### Returns

  `number`

  The time offset of the block in seconds.

  #### Signature

  ```typescript
  getTimeOffset(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasTrim()~~

    <br /><p>Checks if a block has trim properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has trim properties.

  #### Deprecated

  Use supportsTrim instead.

  ***
</details>

<details>
  <summary>
    ### supportsTrim()

    <br /><p>Checks if a block supports trim properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports trim properties.

  #### Signature

  ```typescript
  supportsTrim(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setTrimOffset()

    <br /><p>Sets the trim offset of a block's media content.</p>
  </summary>

  This sets the time within the media clip where playback should begin.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose trim should be updated. |
  | `offset` | `number` | The new trim offset, measured in timeline seconds (scaled by playback rate). |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTrimOffset(id: number, offset: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTrimOffset()

    <br /><p>Gets the trim offset of a block's media content.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose trim offset should be queried. |

  #### Returns

  `number`

  the trim offset in seconds.

  #### Signature

  ```typescript
  getTrimOffset(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setTrimLength()

    <br /><p>Sets the trim length of a block's media content.</p>
  </summary>

  This is the duration of the media clip that should be used for playback.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The object whose trim length should be updated. |
  | `length` | `number` | The new trim length in seconds. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTrimLength(id: number, length: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTrimLength()

    <br /><p>Gets the trim length of a block's media content.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The object whose trim length should be queried. |

  #### Returns

  `number`

  The trim length of the object in seconds.

  #### Signature

  ```typescript
  getTrimLength(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getTotalSceneDuration()~~

    <br /><p>Gets the total duration of a scene in video mode.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `scene` | `number` | The scene whose duration is being queried. |

  #### Returns

  `number`

  the total scene duration.

  #### Deprecated

  Use `getDuration` and pass a page block.

  ***
</details>

<details>
  <summary>
    ### setPlaying()

    <br /><p>Sets whether a block should play its content during active playback.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block that should be updated. |
  | `enabled` | `boolean` | Whether the block should be playing its contents. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaying(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPlaying()

    <br /><p>Checks if a block is playing its content.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  whether the block is playing during playback.

  #### Signature

  ```typescript
  isPlaying(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasPlaybackTime()~~

    <br /><p>Checks if a block has a playback time property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  whether the block has a playback time property.

  #### Deprecated

  Use supportsPlaybackTime instead.

  ***
</details>

<details>
  <summary>
    ### supportsPlaybackTime()

    <br /><p>Checks if a block supports a playback time property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  whether the block supports a playback time property.

  #### Signature

  ```typescript
  supportsPlaybackTime(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setPlaybackTime()

    <br /><p>Sets the current playback time of a block's content.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose playback time should be updated. |
  | `time` | `number` | The new playback time of the block in seconds. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaybackTime(id: number, time: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getPlaybackTime()

    <br /><p>Gets the current playback time of a block's content.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The playback time of the block in seconds.

  #### Signature

  ```typescript
  getPlaybackTime(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setSoloPlaybackEnabled()

    <br /><p>Enables or disables solo playback for a block.</p>
  </summary>

  When enabled, only this block's content will play while the rest of the scene remains paused.

  ```javascript
  engine.block.setSoloPlaybackEnabled(videoFill, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or fill to update. |
  | `enabled` | `boolean` | Whether solo playback should be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSoloPlaybackEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isSoloPlaybackEnabled()

    <br /><p>Checks if solo playback is enabled for a block.</p>
  </summary>

  ```javascript
  engine.block.isSoloPlaybackEnabled(videoFill);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or fill to query. |

  #### Returns

  `boolean`

  Whether solo playback is enabled for this block.

  #### Signature

  ```typescript
  isSoloPlaybackEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasPlaybackControl()~~

    <br /><p>Checks if a block has playback controls.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block has playback control.

  #### Deprecated

  Use supportsPlaybackControl instead

  ***
</details>

<details>
  <summary>
    ### supportsPlaybackControl()

    <br /><p>Checks if a block supports playback controls.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block supports playback control.

  #### Signature

  ```typescript
  supportsPlaybackControl(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setLooping()

    <br /><p>Sets whether a block's media content should loop.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or video fill to update. |
  | `looping` | `boolean` | Whether the block should loop to the beginning or stop. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setLooping(id: number, looping: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isLooping()

    <br /><p>Checks if a block's media content is set to loop.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block is looping.

  #### Signature

  ```typescript
  isLooping(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setMuted()

    <br /><p>Sets whether the audio of a block is muted.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or video fill to update. |
  | `muted` | `boolean` | Whether the audio should be muted. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setMuted(id: number, muted: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isForceMuted()

    <br /><p>Checks if a block's audio is muted due to engine rules.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block is force muted.

  #### Signature

  ```typescript
  isForceMuted(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isMuted()

    <br /><p>Checks if a block's audio is muted.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block is muted.

  #### Signature

  ```typescript
  isMuted(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setVolume()

    <br /><p>Sets the audio volume of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or video fill to update. |
  | `volume` | `number` | The desired volume, ranging from 0.0 to 1.0. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setVolume(id: number, volume: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getVolume()

    <br /><p>Gets the audio volume of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The volume, ranging from 0.0 to 1.0.

  #### Signature

  ```typescript
  getVolume(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setAudioFadeIn()

    <br /><p>Sets an audio fade-in for a block. The audio ramps up from silence to the
    block's volume over the given duration at the start of the block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The audio block or video fill to update. |
  | `duration` | `number` | The fade-in duration in seconds. A value of 0 disables the fade-in and negative values are clamped to 0. |
  | `easing?` | | `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"` | `"EaseInQuart"` | `"EaseOutQuart"` | `"EaseInOutQuart"` | `"EaseInQuint"` | `"EaseOutQuint"` | `"EaseInOutQuint"` | `"EaseInBack"` | `"EaseOutBack"` | `"EaseInOutBack"` | `"EaseInSpring"` | `"EaseOutSpring"` | `"EaseInOutSpring"` | The easing curve of the fade. Defaults to 'Linear'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setAudioFadeIn(id: number, duration: number, easing?: "Linear" | "EaseIn" | "EaseOut" | "EaseInOut" | "EaseInQuart" | "EaseOutQuart" | "EaseInOutQuart" | "EaseInQuint" | "EaseOutQuint" | "EaseInOutQuint" | "EaseInBack" | "EaseOutBack" | "EaseInOutBack" | "EaseInSpring" | "EaseOutSpring" | "EaseInOutSpring"): void
  ```

  ***
</details>

<details>
  <summary>
    ### setAudioFadeOut()

    <br /><p>Sets an audio fade-out for a block. The audio ramps down from the block's
    volume to silence over the given duration at the end of the block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The audio block or video fill to update. |
  | `duration` | `number` | The fade-out duration in seconds. A value of 0 disables the fade-out and negative values are clamped to 0. |
  | `easing?` | | `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"` | `"EaseInQuart"` | `"EaseOutQuart"` | `"EaseInOutQuart"` | `"EaseInQuint"` | `"EaseOutQuint"` | `"EaseInOutQuint"` | `"EaseInBack"` | `"EaseOutBack"` | `"EaseInOutBack"` | `"EaseInSpring"` | `"EaseOutSpring"` | `"EaseInOutSpring"` | The easing curve of the fade. Defaults to 'Linear'. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setAudioFadeOut(id: number, duration: number, easing?: "Linear" | "EaseIn" | "EaseOut" | "EaseInOut" | "EaseInQuart" | "EaseOutQuart" | "EaseInOutQuart" | "EaseInQuint" | "EaseOutQuint" | "EaseInOutQuint" | "EaseInBack" | "EaseOutBack" | "EaseInOutBack" | "EaseInSpring" | "EaseOutSpring" | "EaseInOutSpring"): void
  ```

  ***
</details>

<details>
  <summary>
    ### setPlaybackSpeed()

    <br /><p>Sets the playback speed multiplier of a block that supports playback control.
    Note: This also adjusts the trim and duration of the block.
    Video fills running faster than 3.0x are force muted until reduced to 3.0x or below.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block or video fill to update. |
  | `speed` | `number` | The desired playback speed multiplier. Valid range is \[0.25, 3.0] for audio blocks and \[0.25, infinity) for video fills. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaybackSpeed(id: number, speed: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getPlaybackSpeed()

    <br /><p>Gets the playback speed multiplier of a block that supports playback control.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The playback speed multiplier.

  #### Signature

  ```typescript
  getPlaybackSpeed(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### forceLoadAVResource()

    <br /><p>Forces the loading of a block's audio/video resource.</p>
  </summary>

  If the resource failed to load previously, it will be reloaded.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill or audio block whose resource should be loaded. |

  #### Returns

  `Promise`\<`void`>

  A Promise that resolves once the resource has finished loading.

  #### Signature

  ```typescript
  forceLoadAVResource(id: number): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### unstable\_isAVResourceLoaded()
  </summary>

  Checks if a block's audio/video resource is loaded.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill or audio block. |

  #### Returns

  `boolean`

  The loading state of the resource.
  This API is experimental and may change or be removed in future versions.

  ***
</details>

<details>
  <summary>
    ### getAVResourceTotalDuration()

    <br /><p>Gets the total duration of a block's audio/video resource.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill or audio block. |

  #### Returns

  `number`

  The video or audio file duration in seconds.

  #### Signature

  ```typescript
  getAVResourceTotalDuration(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getVideoWidth()

    <br /><p>Gets the width of a block's video resource.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill block. |

  #### Returns

  `number`

  The video width in pixels.

  #### Signature

  ```typescript
  getVideoWidth(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getVideoHeight()

    <br /><p>Gets the height of a block's video resource.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill block. |

  #### Returns

  `number`

  The video height in pixels.

  #### Signature

  ```typescript
  getVideoHeight(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### generateVideoThumbnailSequence()

    <br /><p>Generate a sequence of thumbnails for the given video fill or design block.</p>
  </summary>

  Note: Only one request per block runs at a time. A second request for the same block waits
  for the first to finish instead of failing.
  Note: For a video fill, cancelling has no effect once the first frame has been scheduled —
  the remaining frames are still delivered. Cancel before the first frame arrives, or ignore
  results from a request you have abandoned. Design block sequences cancel at any time.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill or design block. |
  | `thumbnailHeight` | `number` | The height of each thumbnail. |
  | `timeBegin` | `number` | The start time in seconds for the thumbnail sequence. |
  | `timeEnd` | `number` | The end time in seconds for the thumbnail sequence. |
  | `numberOfFrames` | `number` | The number of frames to generate. |
  | `onFrame` | (`frameIndex`, `result`) => `void` | A callback that receives the frame index and image data. |

  #### Returns

  A function to cancel the thumbnail generation request.

  () => `void`

  #### Signature

  ```typescript
  generateVideoThumbnailSequence(id: number, thumbnailHeight: number, timeBegin: number, timeEnd: number, numberOfFrames: number, onFrame: (frameIndex: number, result: ImageData | Error) => void): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### generateAudioThumbnailSequence()

    <br /><p>Generate a thumbnail sequence for the given audio block or video fill.</p>
  </summary>

  A thumbnail in this case is a chunk of samples in the range of 0 to 1.
  In case stereo data is requested, the samples are interleaved, starting with the left channel.
  Note: `numberOfSamples` counts samples per channel. The callback fires
  `ceil(numberOfSamples / samplesPerChunk)` times and the last chunk may be shorter.
  Note: The `Float32Array` is a view into engine memory that is only valid for the duration of
  the callback. Copy it before storing it.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The audio block or video fill. |
  | `samplesPerChunk` | `number` | The number of samples per chunk. |
  | `timeBegin` | `number` | The start time in seconds for the thumbnail sequence. |
  | `timeEnd` | `number` | The end time in seconds for the thumbnail sequence. |
  | `numberOfSamples` | `number` | The total number of samples to generate. |
  | `numberOfChannels` | `number` | The number of channels in the output (1 for mono, 2 for stereo). |
  | `onChunk` | (`chunkIndex`, `result`) => `void` | A callback that receives the chunk index and sample data. |

  #### Returns

  A function to cancel the thumbnail generation request.

  () => `void`

  #### Signature

  ```typescript
  generateAudioThumbnailSequence(id: number, samplesPerChunk: number, timeBegin: number, timeEnd: number, numberOfSamples: number, numberOfChannels: number, onChunk: (chunkIndex: number, result: Error | Float32Array<ArrayBufferLike>) => void): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getVideoFillThumbnail()~~

    <br /><p>Generates a thumbnail for a video fill.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill. |
  | `thumbnailHeight` | `number` | The height of a thumbnail. The width will be calculated from the video aspect ratio. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a thumbnail encoded as a JPEG blob.

  #### Deprecated

  Use `generateVideoThumbnailSequence` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getVideoFillThumbnailAtlas()~~

    <br /><p>Generates a thumbnail atlas for a video fill.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The video fill. |
  | `numberOfColumns` | `number` | The number of columns in the atlas. |
  | `numberOfRows` | `number` | The number of rows in the atlas. |
  | `thumbnailHeight` | `number` | The height of a single thumbnail. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a thumbnail atlas encoded as a JPEG blob.

  #### Deprecated

  Use `generateVideoThumbnailSequence` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getPageThumbnailAtlas()~~

    <br /><p>Generates a thumbnail atlas for a page.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The page. |
  | `numberOfColumns` | `number` | The number of columns in the atlas. |
  | `numberOfRows` | `number` | The number of rows in the atlas. |
  | `thumbnailHeight` | `number` | The height of a single thumbnail. |

  #### Returns

  `Promise`\<`Blob`>

  A promise that resolves with a thumbnail atlas encoded as a JPEG blob.

  #### Deprecated

  Use `generateVideoThumbnailSequence` instead.

  ***
</details>

<details>
  <summary>
    ### setNativePixelBuffer()

    <br /><p>Updates a pixel stream fill block with a new pixel buffer.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The pixel stream fill block. |
  | `buffer` | `HTMLCanvasElement` | `HTMLVideoElement` | A canvas or video element to use as the pixel source. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setNativePixelBuffer(id: number, buffer: HTMLCanvasElement | HTMLVideoElement): void
  ```
</details>

## Block Animations

Create and manage animations and timeline-based effects.

<details>
  <summary>
    ### createAnimation()

    <br /><p>Creates a new animation block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`AnimationType`](./api/node/type-aliases/animationtype.md) | The type of animation to create. |

  #### Returns

  `number`

  The handle of the new animation instance.

  #### Signature

  ```typescript
  createAnimation(type: AnimationType): number
  ```

  ***
</details>

<details>
  <summary>
    ### supportsAnimation()

    <br /><p>Checks if a block supports animation.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block supports animation.

  #### Signature

  ```typescript
  supportsAnimation(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setInAnimation()

    <br /><p>Sets the "in" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "in" animation should be set. |
  | `animation` | `number` | The animation to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setInAnimation(id: number, animation: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setLoopAnimation()

    <br /><p>Sets the "loop" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "loop" animation should be set. |
  | `animation` | `number` | The animation to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setLoopAnimation(id: number, animation: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setOutAnimation()

    <br /><p>Sets the "out" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "out" animation should be set. |
  | `animation` | `number` | The animation to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setOutAnimation(id: number, animation: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getInAnimation()

    <br /><p>Gets the "in" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "in" animation should be queried. |

  #### Returns

  `number`

  The "in" animation of the block.

  #### Signature

  ```typescript
  getInAnimation(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getLoopAnimation()

    <br /><p>Gets the "loop" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "loop" animation should be queried. |

  #### Returns

  `number`

  The "loop" animation of the block.

  #### Signature

  ```typescript
  getLoopAnimation(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getOutAnimation()

    <br /><p>Gets the "out" animation of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose "out" animation should be queried. |

  #### Returns

  `number`

  The "out" animation of the block.

  #### Signature

  ```typescript
  getOutAnimation(id: number): number
  ```
</details>

## Block Groups

Create and manage groups of blocks.

<details>
  <summary>
    ### isGroupable()

    <br /><p>Checks if a set of blocks can be grouped.</p>
  </summary>

  A scene block or a block that is already part of a group cannot be grouped.

  ```javascript
  const groupable = engine.block.isGroupable([block1, block2])
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | An array of block ids. |

  #### Returns

  `boolean`

  Whether the blocks can be grouped together.

  #### Signature

  ```typescript
  isGroupable(ids: number[]): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### group()

    <br /><p>Groups multiple blocks into a new group block.</p>
  </summary>

  ```javascript
  if (engine.block.isGroupable([block1, block2])) {
    const group = engine.block.group(block1, block2]);
  }
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A non-empty array of block ids. |

  #### Returns

  `number`

  The block id of the created group.

  #### Signature

  ```typescript
  group(ids: number[]): number
  ```

  ***
</details>

<details>
  <summary>
    ### ungroup()

    <br /><p>Ungroups a group block, releasing its children.</p>
  </summary>

  ```javascript
  engine.block.ungroup(group);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The group id from a previous call to `group`. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  ungroup(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### enterGroup()

    <br /><p>Changes selection to a block within a selected group.</p>
  </summary>

  Nothing happens if the target is not a group.

  ```javascript
  engine.block.enterGroup(group);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The group id from a previous call to `group`. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  enterGroup(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### exitGroup()

    <br /><p>Changes selection from a block to its parent group.</p>
  </summary>

  Nothing happens if the block is not part of a group.

  ```javascript
  engine.block.exitGroup(member1);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | A block id. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  exitGroup(id: number): void
  ```
</details>

## Block State

Query the intrinsic state or identity of a block, such as its name, UUID, or lock status.

<details>
  <summary>
    ### getType()

    <br /><p>Gets the longhand type of a given block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  [`ObjectTypeLonghand`](./api/node/type-aliases/objecttypelonghand.md)

  The block's type.

  #### Signature

  ```typescript
  getType(id: number): ObjectTypeLonghand
  ```

  ***
</details>

<details>
  <summary>
    ### setName()

    <br /><p>Sets the name of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `name` | `string` | The name to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setName(id: number, name: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getName()

    <br /><p>Gets the name of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `string`

  The block's name.

  #### Signature

  ```typescript
  getName(id: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### getUUID()

    <br /><p>Gets the unique universal identifier (UUID) of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `string`

  The block's UUID.

  #### Signature

  ```typescript
  getUUID(id: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### isValid()

    <br /><p>Checks if a block handle is valid.</p>
  </summary>

  A block becomes invalid once it has been destroyed.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block is valid.

  #### Signature

  ```typescript
  isValid(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### referencesAnyVariables()

    <br /><p>Checks if a block references any variables.</p>
  </summary>

  This check does not recurse into children.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to inspect. |

  #### Returns

  `boolean`

  true if the block references variables and false otherwise.

  #### Signature

  ```typescript
  referencesAnyVariables(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isIncludedInExport()

    <br /><p>Checks if a block is included in exports.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block is included on the exported result, false otherwise.

  #### Signature

  ```typescript
  isIncludedInExport(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setIncludedInExport()

    <br /><p>Sets whether a block should be included in exports.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose exportable state should be set. |
  | `enabled` | `boolean` | If true, the block will be included on the exported result. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setIncludedInExport(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isVisibleAtCurrentPlaybackTime()

    <br /><p>Checks if a block is visible at the current scene playback time.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  Whether the block should be visible on the canvas at the current playback time.

  #### Signature

  ```typescript
  isVisibleAtCurrentPlaybackTime(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### getState()

    <br /><p>Gets the current state of a block.</p>
  </summary>

  A block's state is determined by its own state and that of its shape, fill, and effects.

  ```javascript
  const state = engine.block.getState(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  [`BlockState`](./api/node/type-aliases/blockstate.md)

  The block's state: 'Ready', 'Pending', or 'Error'.

  #### Signature

  ```typescript
  getState(id: number): BlockState
  ```

  ***
</details>

<details>
  <summary>
    ### setState()

    <br /><p>Sets the state of a block.</p>
  </summary>

  ```javascript
  engine.block.setState(video, {type: 'Pending', progress: 0.5});
  engine.block.setState(page, {type: 'Ready'});
  engine.block.setState(image, {type: 'Error', error: 'ImageDecoding'});
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose state should be set. |
  | `state` | [`BlockState`](./api/node/type-aliases/blockstate.md) | The new state to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setState(id: number, state: BlockState): void
  ```
</details>

## Block Crop

Crop, scale, translate, and transform block content.

<details>
  <summary>
    ### ~~hasCrop()~~

    <br /><p>Checks if a block has crop properties.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block has crop properties.

  #### Deprecated

  Use supportsCrop() instead.

  ***
</details>

<details>
  <summary>
    ### supportsCrop()

    <br /><p>Checks if a block supports cropping.</p>
  </summary>

  ```javascript
  engine.block.supportsCrop(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  true, if the block supports cropping.

  #### Signature

  ```typescript
  supportsCrop(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setCropScaleX()

    <br /><p>Sets the horizontal crop scale of a block.</p>
  </summary>

  ```javascript
  engine.block.setCropScaleX(image, 2.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `scaleX` | `number` | The scale in x direction. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropScaleX(id: number, scaleX: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setCropScaleY()

    <br /><p>Sets the vertical crop scale of a block.</p>
  </summary>

  ```javascript
  engine.block.setCropScaleY(image, 1.5);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `scaleY` | `number` | The scale in y direction. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropScaleY(id: number, scaleY: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setCropRotation()

    <br /><p>Sets the crop rotation of a block in radians.</p>
  </summary>

  ```javascript
  engine.block.setCropRotation(image, Math.PI);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `rotation` | `number` | The rotation in radians. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropRotation(id: number, rotation: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setCropScaleRatio()

    <br /><p>Sets the uniform crop scale ratio of a block.</p>
  </summary>

  This scales the content up or down from the center of the crop frame.

  ```javascript
  engine.block.setCropScaleRatio(image, 3.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `scaleRatio` | `number` | The crop scale ratio. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropScaleRatio(id: number, scaleRatio: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setCropTranslationX()

    <br /><p>Sets the horizontal crop translation of a block in percentage of the crop frame width.</p>
  </summary>

  ```javascript
  engine.block.setCropTranslationX(image, -1.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `translationX` | `number` | The translation in x direction. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropTranslationX(id: number, translationX: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### setCropTranslationY()

    <br /><p>Sets the vertical crop translation of a block in percentage of the crop frame height.</p>
  </summary>

  ```javascript
  engine.block.setCropTranslationY(image, 1.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be set. |
  | `translationY` | `number` | The translation in y direction. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropTranslationY(id: number, translationY: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### resetCrop()

    <br /><p>Resets the crop of a block to its default state.</p>
  </summary>

  The block's content fill mode is set to 'Cover'.

  ```javascript
  engine.block.resetCrop(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be reset. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  resetCrop(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getCropScaleX()

    <br /><p>Gets the horizontal crop scale of a block.</p>
  </summary>

  ```javascript
  const scaleX = engine.block.getCropScaleX(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose scale should be queried. |

  #### Returns

  `number`

  The scale on the x axis.

  #### Signature

  ```typescript
  getCropScaleX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getCropScaleY()

    <br /><p>Gets the vertical crop scale of a block.</p>
  </summary>

  ```javascript
  const scaleY = engine.block.getCropScaleY(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose scale should be queried. |

  #### Returns

  `number`

  The scale on the y axis.

  #### Signature

  ```typescript
  getCropScaleY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getCropRotation()

    <br /><p>Gets the crop rotation of a block in radians.</p>
  </summary>

  ```javascript
  const cropRotation = engine.block.getCropRotation(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop rotation should be queried. |

  #### Returns

  `number`

  The crop rotation in radians.

  #### Signature

  ```typescript
  getCropRotation(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getCropScaleRatio()

    <br /><p>Gets the uniform crop scale ratio of a block.</p>
  </summary>

  ```javascript
  const cropScaleRatio = engine.block.getCropScaleRatio(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop scale ratio should be queried. |

  #### Returns

  `number`

  The crop scale ratio.

  #### Signature

  ```typescript
  getCropScaleRatio(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getCropTranslationX()

    <br /><p>Gets the horizontal crop translation of a block in percentage of the crop frame width.</p>
  </summary>

  ```javascript
  const cropTranslationX = engine.block.getCropTranslationX(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose translation should be queried. |

  #### Returns

  `number`

  The translation on the x axis.

  #### Signature

  ```typescript
  getCropTranslationX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### getCropTranslationY()

    <br /><p>Gets the vertical crop translation of a block in percentage of the crop frame height.</p>
  </summary>

  ```javascript
  const cropTranslationY = engine.block.getCropTranslationY(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose translation should be queried. |

  #### Returns

  `number`

  The translation on the y axis.

  #### Signature

  ```typescript
  getCropTranslationY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### adjustCropToFillFrame()

    <br /><p>Adjusts the crop position and scale of the given image block to fill its crop frame, while maintaining the position and size of the crop frame.</p>
  </summary>

  ```javascript
  const adjustedScaleRatio = engine.block.adjustCropToFillFrame(image, 1.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be adjusted. |
  | `minScaleRatio` | `number` | The minimal crop scale ratio to use. |

  #### Returns

  `number`

  The adjusted scale ratio.

  #### Signature

  ```typescript
  adjustCropToFillFrame(id: number, minScaleRatio: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### flipCropHorizontal()

    <br /><p>Flips the content horizontally within its crop frame.</p>
  </summary>

  ```javascript
  engine.block.flipCropHorizontal(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be updated. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  flipCropHorizontal(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### flipCropVertical()

    <br /><p>Flips the content vertically within its crop frame.</p>
  </summary>

  ```javascript
  engine.block.flipCropVertical(image);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose crop should be updated. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  flipCropVertical(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### isCropAspectRatioLocked()

    <br /><p>Checks if the crop aspect ratio is locked for a block.</p>
  </summary>

  When locked, crop handles will maintain the current aspect ratio during resize.

  ```javascript
  const isLocked = engine.block.isCropAspectRatioLocked(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if aspect ratio is locked, false otherwise.

  #### Signature

  ```typescript
  isCropAspectRatioLocked(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setCropAspectRatioLocked()

    <br /><p>Sets whether the crop aspect ratio should be locked for a block.</p>
  </summary>

  When enabled, crop handles will maintain the current aspect ratio.
  When disabled, free resizing is allowed.

  ```javascript
  engine.block.setCropAspectRatioLocked(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `locked` | `boolean` | Whether aspect ratio should be locked. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setCropAspectRatioLocked(id: number, locked: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### canRevertToOriginalRatio()

    <br /><p>Checks whether the "Original" crop preset (<code>ContentAspectRatio</code>) can be applied to a block.</p>
  </summary>

  This runs the same preliminary check the apply path performs: it resolves the intrinsic
  content dimensions from the block's image/video fill (an image fill resolves only from its
  `sourceSet`; a video fill resolves from its `sourceSet` or the first decoded frame). Use it
  to gate UI that would otherwise call the preset and fail — e.g. an unreplaced placeholder
  image fill with an empty `sourceSet`.

  ```javascript
  const canRevert = engine.block.canRevertToOriginalRatio(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the preset would resolve, false if it cannot (no/placeholder fill, empty
  sourceSet, video not yet decoded, or unsupported fill type).

  #### Signature

  ```typescript
  canRevertToOriginalRatio(id: number): boolean
  ```
</details>

## Block Events

Subscribe to user actions and state changes related to blocks.

<details>
  <summary>
    ### onSelectionChanged

    <br /><p>Subscribes to changes in the selection.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | () => `void` | This function is called at the end of the engine update if the selection has changed. |

  #### Returns

  A method to unsubscribe.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onClicked

    <br /><p>Subscribes to block click events.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`id`) => `void` | This function is called at the end of the engine update if a block has been clicked. |

  #### Returns

  A method to unsubscribe.

  () => `void`

  ***
</details>

<details>
  <summary>
    ### onStateChanged

    <br /><p>Subscribes to state changes for a set of blocks.</p>
  </summary>

  The state is determined by the block and its associated shape, fill, and effects.

  ```javascript
  const unsubscribe = engine.block.onStateChanged([], (blocks) => {
    blocks.forEach(block => console.log(block));
  });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | A list of block IDs to monitor. If empty, all blocks are monitored. |
  | `callback` | (`ids`) => `void` | The function to call when a state changes. |

  #### Returns

  A function to unsubscribe from the event.

  () => `void`
</details>

## Block Utils

Check block capabilities like alignability or distributability.

<details>
  <summary>
    ### isAlignable()

    <br /><p>Checks if a set of blocks can be aligned.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | An array of block ids. |

  #### Returns

  `boolean`

  Whether the blocks can be aligned.

  #### Signature

  ```typescript
  isAlignable(ids: number[]): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isDistributable()

    <br /><p>Checks if a set of blocks can be distributed.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | An array of block ids. |

  #### Returns

  `boolean`

  Whether the blocks can be distributed.

  #### Signature

  ```typescript
  isDistributable(ids: number[]): boolean
  ```
</details>

## Block Kind

Get and set a block's 'kind' identifier for custom categorization.

<details>
  <summary>
    ### getKind()

    <br /><p>Gets the kind of a given block.</p>
  </summary>

  ```javascript
  const kind = engine.block.getKind(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `string`

  The block's kind.

  #### Signature

  ```typescript
  getKind(id: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### setKind()

    <br /><p>Sets the kind of a given block, a custom string for categorization of blocks.</p>
  </summary>

  ```javascript
  engine.block.setKind(text, 'title');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose kind should be changed. |
  | `kind` | `string` | The new kind. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setKind(id: number, kind: string): void
  ```
</details>

## Block Properties

Get and set any block property by name using low-level, generic accessors.

<details>
  <summary>
    ### findAllProperties()

    <br /><p>Gets all available properties of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose properties should be queried. |

  #### Returns

  `string`\[]

  A list of the property names.

  #### Signature

  ```typescript
  findAllProperties(id: number): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### isPropertyReadable()

    <br /><p>Checks if a property is readable.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `property` | `string` | The name of the property to check. |

  #### Returns

  `boolean`

  Whether the property is readable. Returns false for unknown properties.

  #### Signature

  ```typescript
  isPropertyReadable(property: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isPropertyWritable()

    <br /><p>Checks if a property is writable.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `property` | `string` | The name of the property to check. |

  #### Returns

  `boolean`

  Whether the property is writable. Returns false for unknown properties.

  #### Signature

  ```typescript
  isPropertyWritable(property: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### getPropertyType()

    <br /><p>Gets the type of a property by its name.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `property` | `string` | The name of the property whose type should be queried. |

  #### Returns

  [`PropertyType`](./api/node/type-aliases/propertytype.md)

  The property type.

  #### Signature

  ```typescript
  getPropertyType(property: string): PropertyType
  ```

  ***
</details>

<details>
  <summary>
    ### getEnumValues()

    <br /><p>Gets all possible values of an enum property.</p>
  </summary>

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `T` | `string` |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `enumProperty` | `string` | The name of the property whose enum values should be queried. |

  #### Returns

  `T`\[]

  A list of the enum value names as a string array.

  #### Signature

  ```typescript
  getEnumValues(enumProperty: string): T[]
  ```

  ***
</details>

<details>
  <summary>
    ### setBool()

    <br /><p>Sets a boolean property on a block.</p>
  </summary>

  ```javascript
  engine.block.setBool(scene, 'scene/aspectRatioLock', false);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`BoolPropertyName`](./api/node/type-aliases/boolpropertyname.md) | The name of the property to set. |
  | `value` | `boolean` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBool(id: number, property: BoolPropertyName, value: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getBool()

    <br /><p>Gets a boolean property from a block.</p>
  </summary>

  ```javascript
  engine.block.getBool(scene, 'scene/aspectRatioLock');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`BoolPropertyName`](./api/node/type-aliases/boolpropertyname.md) | The name of the property to query. |

  #### Returns

  `boolean`

  The value of the property.

  #### Signature

  ```typescript
  getBool(id: number, property: BoolPropertyName): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setInt()

    <br /><p>Sets an integer property on a block.</p>
  </summary>

  ```javascript
  engine.block.setInt(starShape, 'shape/star/points', points + 2);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`IntPropertyName`](./api/node/type-aliases/intpropertyname.md) | The name of the property to set. |
  | `value` | `number` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setInt(id: number, property: IntPropertyName, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getInt()

    <br /><p>Gets an integer property from a block.</p>
  </summary>

  ```javascript
  engine.block.setInt(starShape, 'shape/star/points', points + 2);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`IntPropertyName`](./api/node/type-aliases/intpropertyname.md) | The name of the property to query. |

  #### Returns

  `number`

  The value of the property.

  #### Signature

  ```typescript
  getInt(id: number, property: IntPropertyName): number
  ```

  ***
</details>

<details>
  <summary>
    ### setFloat()

    <br /><p>Sets a float property on a block.</p>
  </summary>

  ```javascript
  engine.block.setFloat(text, "text/letterSpacing", 0.2);
  engine.block.setFloat(text, "text/lineHeight", 1.2);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`FloatPropertyName`](./api/node/type-aliases/floatpropertyname.md) | The name of the property to set. |
  | `value` | `number` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setFloat(id: number, property: FloatPropertyName, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getFloat()

    <br /><p>Gets a float property from a block.</p>
  </summary>

  ```javascript
  engine.block.getFloat(starShape, 'shape/star/innerDiameter');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`FloatPropertyName`](./api/node/type-aliases/floatpropertyname.md) | The name of the property to query. |

  #### Returns

  `number`

  The value of the property.

  #### Signature

  ```typescript
  getFloat(id: number, property: FloatPropertyName): number
  ```

  ***
</details>

<details>
  <summary>
    ### setDouble()

    <br /><p>Sets a double-precision float property on a block.</p>
  </summary>

  ```javascript
  engine.block.setDouble(audio, 'playback/duration', 1.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`DoublePropertyName`](./api/node/type-aliases/doublepropertyname.md) | The name of the property to set. |
  | `value` | `number` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDouble(id: number, property: DoublePropertyName, value: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDouble()

    <br /><p>Gets a double-precision float property from a block.</p>
  </summary>

  ```javascript
  engine.block.getDouble(audio, 'playback/duration');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`DoublePropertyName`](./api/node/type-aliases/doublepropertyname.md) | The name of the property to query. |

  #### Returns

  `number`

  The value of the property.

  #### Signature

  ```typescript
  getDouble(id: number, property: DoublePropertyName): number
  ```

  ***
</details>

<details>
  <summary>
    ### setString()

    <br /><p>Sets a string property on a block.</p>
  </summary>

  ```javascript
  engine.block.setString(text, 'text/text', 'Hello World');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', 'https://example.com/sample.jpg');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`StringPropertyName`](./api/node/type-aliases/stringpropertyname.md) | The name of the property to set. |
  | `value` | `string` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setString(id: number, property: StringPropertyName, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getString()

    <br /><p>Gets a string property from a block.</p>
  </summary>

  ```javascript
  engine.block.getString(text, 'text/text');
  engine.block.getString(imageFill, 'fill/image/imageFileURI');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`StringPropertyName`](./api/node/type-aliases/stringpropertyname.md) | The name of the property to query. |

  #### Returns

  `string`

  The value of the property.

  #### Signature

  ```typescript
  getString(id: number, property: StringPropertyName): string
  ```

  ***
</details>

<details>
  <summary>
    ### setColor()

    <br /><p>Sets a color property on a block.</p>
  </summary>

  ```javascript
  // Set the block's fill color to white.
  engine.block.setColor(colorFill, 'fill/color/value', { r: 1, g: 1, b: 1, a: 1 });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | [`ColorPropertyName`](./api/node/type-aliases/colorpropertyname.md) | The name of the property to set. |
  | `value` | [`Color`](./api/node/type-aliases/color.md) | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setColor(id: number, property: ColorPropertyName, value: Color): void
  ```

  ***
</details>

<details>
  <summary>
    ### getColor()

    <br /><p>Gets a color property from a block.</p>
  </summary>

  ```javascript
  engine.block.getColor(colorFill, 'fill/color/value');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | [`ColorPropertyName`](./api/node/type-aliases/colorpropertyname.md) | The name of the property to query. |

  #### Returns

  [`Color`](./api/node/type-aliases/color.md)

  The value of the property.

  #### Signature

  ```typescript
  getColor(id: number, property: ColorPropertyName): Color
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setColorRGBA()~~

    <br /><p>Sets a color property on a block using RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | `string` | The name of the property to set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. Defaults to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~getColorRGBA()~~

    <br /><p>Gets a color property from a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `string` | The name of the property to query. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  A tuple of channels red, green, blue and alpha in the range of 0 to 1.

  #### Deprecated

  Use getColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~setColorSpot()~~

    <br /><p>Sets a spot color property on a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | `string` | The name of the property to set. |
  | `name` | `string` | The name of the spot color. |
  | `tint?` | `number` | The tint factor in the range of 0 to 1. Defaults to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~getColorSpotName()~~

    <br /><p>Gets the spot color name from a color property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `string` | The name of the property to query. |

  #### Returns

  `string`

  The name of the spot color.

  #### Deprecated

  Use getColor() instead.

  ***
</details>

<details>
  <summary>
    ### ~~getColorSpotTint()~~

    <br /><p>Gets the spot color tint from a color property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `string` | The name of the property to query. |

  #### Returns

  `number`

  The tint factor of the spot color.

  #### Deprecated

  Use getColor() instead.

  ***
</details>

<details>
  <summary>
    ### setEnum()

    <br /><p>Sets an enum property on a block.</p>
  </summary>

  ```javascript
  engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
  engine.block.setEnum(text, 'text/verticalAlignment', 'Center');
  ```

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* keyof [`BlockEnumType`](./api/node/type-aliases/blockenumtype.md) |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | `T` | The name of the property to set. |
  | `value` | [`BlockEnumType`](./api/node/type-aliases/blockenumtype.md)\[`T`] | The enum value as a string. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  setEnum(
     id, 
     property, 
     value): void;
  ```

  Sets an enum property on a block.

  ```javascript
  engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
  engine.block.setEnum(text, 'text/verticalAlignment', 'Center');
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be set. |
  | `property` | `string` | The name of the property to set. |
  | `value` | `string` | The enum value as a string. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  setEnum(id: number, property: T, value: BlockEnumType[T]): void
  ```

  ```typescript
  setEnum(id: number, property: string, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getEnum()

    <br /><p>Gets an enum property from a block.</p>
  </summary>

  ```javascript
  engine.block.getEnum(text, 'text/horizontalAlignment');
  engine.block.getEnum(text, 'text/verticalAlignment');
  ```

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* keyof [`BlockEnumType`](./api/node/type-aliases/blockenumtype.md) |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `T` | The name of the property to query. |

  ##### Returns

  [`BlockEnumType`](./api/node/type-aliases/blockenumtype.md)\[`T`]

  The value as a string.

  #### Call Signature

  ```ts
  getEnum(id, property): string;
  ```

  Gets an enum property from a block.

  ```javascript
  engine.block.getEnum(text, 'text/horizontalAlignment');
  engine.block.getEnum(text, 'text/verticalAlignment');
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose property should be queried. |
  | `property` | `string` | The name of the property to query. |

  ##### Returns

  `string`

  The value as a string.

  #### Signatures

  ```typescript
  getEnum(id: number, property: T): BlockEnumType[T]
  ```

  ```typescript
  getEnum(id: number, property: string): string
  ```
</details>

## Block Strokes

Control stroke appearance, including color, width, style, and position.

<details>
  <summary>
    ### ~~hasStroke()~~

    <br /><p>Checks if a block has a stroke property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block has a stroke property.

  #### Deprecated

  Use supportsStroke() instead.

  ***
</details>

<details>
  <summary>
    ### supportsStroke()

    <br /><p>Checks if a block supports a stroke.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block supports a stroke.

  #### Signature

  ```typescript
  supportsStroke(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeEnabled()

    <br /><p>Enables or disables the stroke of a block.</p>
  </summary>

  ```javascript
  engine.block.setStrokeEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke should be enabled or disabled. |
  | `enabled` | `boolean` | If true, the stroke will be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isStrokeEnabled()

    <br /><p>Checks if the stroke of a block is enabled.</p>
  </summary>

  ```javascript
  const strokeIsEnabled = engine.block.isStrokeEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke state should be queried. |

  #### Returns

  `boolean`

  True if the block's stroke is enabled.

  #### Signature

  ```typescript
  isStrokeEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeOverprint()

    <br /><p>Marks the stroke of a block as overprint for PDF export.</p>
  </summary>

  The flag is only honored by the PDF writer when the stroke uses a spot color
  (Separation/DeviceN). For process-color strokes it is a silent no-op. On-screen
  rendering ignores the flag.

  ```javascript
  engine.block.setStrokeOverprint(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke overprint flag should be set. |
  | `overprint` | `boolean` | If true, the stroke is marked as overprint in exported PDFs. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeOverprint(id: number, overprint: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeOverprint()

    <br /><p>Queries whether the stroke of a block is marked as overprint for PDF export.</p>
  </summary>

  ```javascript
  const overprint = engine.block.getStrokeOverprint(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke overprint flag should be queried. |

  #### Returns

  `boolean`

  The stroke overprint flag.

  #### Signature

  ```typescript
  getStrokeOverprint(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setStrokeColorRGBA()~~

    <br /><p>Sets the stroke color of a block using RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke color should be set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setStrokeColor() instead.

  ***
</details>

<details>
  <summary>
    ### setStrokeColor()

    <br /><p>Sets the stroke color of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke color should be set. |
  | `color` | [`Color`](./api/node/type-aliases/color.md) | The color to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeColor(id: number, color: Color): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getStrokeColorRGBA()~~

    <br /><p>Gets the stroke color of a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke color should be queried. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  The stroke color.

  #### Deprecated

  Use getStrokeColor() instead.

  ***
</details>

<details>
  <summary>
    ### getStrokeColor()

    <br /><p>Gets the stroke color of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke color should be queried. |

  #### Returns

  [`Color`](./api/node/type-aliases/color.md)

  The stroke color.

  #### Signature

  ```typescript
  getStrokeColor(id: number): Color
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeWidth()

    <br /><p>Sets the stroke width of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke width should be set. |
  | `width` | `number` | The stroke width to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeWidth(id: number, width: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeWidth()

    <br /><p>Gets the stroke width of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke width should be queried. |

  #### Returns

  `number`

  The stroke's width.

  #### Signature

  ```typescript
  getStrokeWidth(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeStyle()

    <br /><p>Sets the stroke style of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke style should be set. |
  | `style` | | `"Dashed"` | `"DashedRound"` | `"Dotted"` | `"LongDashed"` | `"LongDashedRound"` | `"Solid"` | The stroke style to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeStyle(id: number, style: "Dashed" | "DashedRound" | "Dotted" | "LongDashed" | "LongDashedRound" | "Solid"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeStyle()

    <br /><p>Gets the stroke style of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke style should be queried. |

  #### Returns

  | `"Dashed"`
  | `"DashedRound"`
  | `"Dotted"`
  | `"LongDashed"`
  | `"LongDashedRound"`
  | `"Solid"`

  The stroke's style.

  #### Signature

  ```typescript
  getStrokeStyle(id: number): "Dashed" | "DashedRound" | "Dotted" | "LongDashed" | "LongDashedRound" | "Solid"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokePosition()

    <br /><p>Sets the stroke position of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke position should be set. |
  | `position` | `"Center"` | `"Inner"` | `"Outer"` | The stroke position to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokePosition(id: number, position: "Center" | "Inner" | "Outer"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokePosition()

    <br /><p>Gets the stroke position of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke position should be queried. |

  #### Returns

  `"Center"` | `"Inner"` | `"Outer"`

  The stroke position.

  #### Signature

  ```typescript
  getStrokePosition(id: number): "Center" | "Inner" | "Outer"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeCornerGeometry()

    <br /><p>Sets the stroke corner geometry of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke corner geometry should be set. |
  | `cornerGeometry` | `"Bevel"` | `"Miter"` | `"Round"` | The stroke corner geometry to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeCornerGeometry(id: number, cornerGeometry: "Bevel" | "Miter" | "Round"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeCornerGeometry()

    <br /><p>Gets the stroke corner geometry of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke corner geometry should be queried. |

  #### Returns

  `"Bevel"` | `"Miter"` | `"Round"`

  The stroke corner geometry.

  #### Signature

  ```typescript
  getStrokeCornerGeometry(id: number): "Bevel" | "Miter" | "Round"
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setStrokeCap()~~

    <br /><p>Sets the stroke cap of a block. Writes both the start and end caps to the
    same value.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke cap should be set. |
  | `cap` | `"Round"` | `"Butt"` | `"Square"` | The stroke cap to be set. |

  #### Returns

  `void`

  #### Deprecated

  Use `setStrokeStartCap` and `setStrokeEndCap` to set each end
  independently.

  ***
</details>

<details>
  <summary>
    ### ~~getStrokeCap()~~

    <br /><p>Gets the legacy single stroke cap of a block. Tracks the value last written
    via <code>setStrokeCap</code> or <code>setStrokeStartCap</code>; ignores changes made via
    <code>setStrokeEndCap</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke cap should be queried. |

  #### Returns

  `"Round"` | `"Butt"` | `"Square"`

  The stroke cap.

  #### Deprecated

  Use `getStrokeStartCap` and `getStrokeEndCap` instead.

  ***
</details>

<details>
  <summary>
    ### setStrokeStartCap()

    <br /><p>Sets the cap geometry at the start of an open stroked path. Use this with
    <code>setStrokeEndCap</code> to set distinct caps for each end of a stroke (for
    example a flat start with an arrowhead end). <code>setStrokeCap</code> continues to
    set both ends at once and is preserved for backwards compatibility.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke start cap should be set. |
  | `cap` | `"Round"` | `"Butt"` | `"Square"` | The cap geometry to use at the path start. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeStartCap(id: number, cap: "Round" | "Butt" | "Square"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeStartCap()

    <br /><p>Gets the cap geometry at the start of an open stroked path.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke start cap should be queried. |

  #### Returns

  `"Round"` | `"Butt"` | `"Square"`

  The start cap.

  #### Signature

  ```typescript
  getStrokeStartCap(id: number): "Round" | "Butt" | "Square"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeEndCap()

    <br /><p>Sets the cap geometry at the end of an open stroked path. Use this with
    <code>setStrokeStartCap</code> to set distinct caps for each end of a stroke.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke end cap should be set. |
  | `cap` | `"Round"` | `"Butt"` | `"Square"` | The cap geometry to use at the path end. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeEndCap(id: number, cap: "Round" | "Butt" | "Square"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeEndCap()

    <br /><p>Gets the cap geometry at the end of an open stroked path.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke end cap should be queried. |

  #### Returns

  `"Round"` | `"Butt"` | `"Square"`

  The end cap.

  #### Signature

  ```typescript
  getStrokeEndCap(id: number): "Round" | "Butt" | "Square"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeDashStartCap()

    <br /><p>Sets the cap geometry at the leading edge of each dash piece (excluding the
    line's actual start). Only takes effect when a dash pattern is active.
    Distinct from <code>setStrokeStartCap</code>, which only applies to the start of the
    open path itself.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose dash start cap should be set. |
  | `cap` | `"Round"` | `"Butt"` | `"Square"` | The cap geometry to use at the leading edge of each dash piece. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeDashStartCap(id: number, cap: "Round" | "Butt" | "Square"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeDashStartCap()

    <br /><p>Gets the cap geometry at the leading edge of each dash piece.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose dash start cap should be queried. |

  #### Returns

  `"Round"` | `"Butt"` | `"Square"`

  The dash start cap.

  #### Signature

  ```typescript
  getStrokeDashStartCap(id: number): "Round" | "Butt" | "Square"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeDashEndCap()

    <br /><p>Sets the cap geometry at the trailing edge of each dash piece (excluding the
    line's actual end). Only takes effect when a dash pattern is active. Distinct
    from <code>setStrokeEndCap</code>, which only applies to the end of the open path itself.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose dash end cap should be set. |
  | `cap` | `"Round"` | `"Butt"` | `"Square"` | The cap geometry to use at the trailing edge of each dash piece. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeDashEndCap(id: number, cap: "Round" | "Butt" | "Square"): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeDashEndCap()

    <br /><p>Gets the cap geometry at the trailing edge of each dash piece.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose dash end cap should be queried. |

  #### Returns

  `"Round"` | `"Butt"` | `"Square"`

  The dash end cap.

  #### Signature

  ```typescript
  getStrokeDashEndCap(id: number): "Round" | "Butt" | "Square"
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeDashArray()

    <br /><p>Sets a custom dash pattern for the block's stroke. Semantics match SVG's
    <code>stroke-dasharray</code>: alternating on/off lengths in design-unit space. When the
    pattern is non-empty it overrides the preset implied by <code>StrokeStyle</code>. Pass an
    empty array to fall back to the preset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke dash pattern should be set. |
  | `dashArray` | `number`\[] | Alternating on/off lengths. Odd-length arrays are doubled to an even length, matching SVG behaviour. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeDashArray(id: number, dashArray: number[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeDashArray()

    <br /><p>Gets the custom dash pattern of the block's stroke.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke dash pattern should be queried. |

  #### Returns

  `number`\[]

  The dash pattern, or an empty array if no custom pattern is set.

  #### Signature

  ```typescript
  getStrokeDashArray(id: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### setStrokeDashOffset()

    <br /><p>Sets the dash offset of the block's stroke. Semantics match SVG's
    <code>stroke-dashoffset</code>. Ignored when the custom dash pattern is empty.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke dash offset should be set. |
  | `dashOffset` | `number` | The dash offset in design-unit space. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setStrokeDashOffset(id: number, dashOffset: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getStrokeDashOffset()

    <br /><p>Gets the dash offset of the block's stroke.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose stroke dash offset should be queried. |

  #### Returns

  `number`

  The dash offset.

  #### Signature

  ```typescript
  getStrokeDashOffset(id: number): number
  ```
</details>

## Block Drop Shadow

Configure drop shadow effects, including blur, color, and offset.

<details>
  <summary>
    ### ~~hasDropShadow()~~

    <br /><p>Checks if a block has a drop shadow property.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block has a drop shadow property.

  #### Deprecated

  Use supportsDropShadow() instead.

  ***
</details>

<details>
  <summary>
    ### supportsDropShadow()

    <br /><p>Checks if a block supports a drop shadow.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True if the block supports a drop shadow.

  #### Signature

  ```typescript
  supportsDropShadow(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowEnabled()

    <br /><p>Enables or disables the drop shadow of a block.</p>
  </summary>

  ```javascript
  engine.block.setDropShadowEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow should be enabled or disabled. |
  | `enabled` | `boolean` | If true, the drop shadow will be enabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isDropShadowEnabled()

    <br /><p>Checks if the drop shadow of a block is enabled.</p>
  </summary>

  ```javascript
  const dropShadowIsEnabled = engine.block.isDropShadowEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow state should be queried. |

  #### Returns

  `boolean`

  True if the block's drop shadow is enabled.

  #### Signature

  ```typescript
  isDropShadowEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setDropShadowColorRGBA()~~

    <br /><p>Sets the drop shadow color of a block using RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow color should be set. |
  | `r` | `number` | The red color component in the range of 0 to 1. |
  | `g` | `number` | The green color component in the range of 0 to 1. |
  | `b` | `number` | The blue color component in the range of 0 to 1. |
  | `a?` | `number` | The alpha color component in the range of 0 to 1. |

  #### Returns

  `void`

  #### Deprecated

  Use setDropShadowColor() instead.

  ***
</details>

<details>
  <summary>
    ### setDropShadowColor()

    <br /><p>Sets the drop shadow color of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow color should be set. |
  | `color` | [`Color`](./api/node/type-aliases/color.md) | The color to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowColor(id: number, color: Color): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getDropShadowColorRGBA()~~

    <br /><p>Gets the drop shadow color of a block as RGBA values.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow color should be queried. |

  #### Returns

  [`RGBA`](./api/node/type-aliases/rgba.md)

  The drop shadow color.

  #### Deprecated

  Use getDropShadowColor instead.

  ***
</details>

<details>
  <summary>
    ### getDropShadowColor()

    <br /><p>Gets the drop shadow color of a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow color should be queried. |

  #### Returns

  [`Color`](./api/node/type-aliases/color.md)

  The drop shadow color.

  #### Signature

  ```typescript
  getDropShadowColor(id: number): Color
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowOffsetX()

    <br /><p>Sets the drop shadow's horizontal offset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's X offset should be set. |
  | `offsetX` | `number` | The X offset to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowOffsetX(id: number, offsetX: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDropShadowOffsetX()

    <br /><p>Gets the drop shadow's horizontal offset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's X offset should be queried. |

  #### Returns

  `number`

  The offset.

  #### Signature

  ```typescript
  getDropShadowOffsetX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowOffsetY()

    <br /><p>Sets the drop shadow's vertical offset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's Y offset should be set. |
  | `offsetY` | `number` | The Y offset to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowOffsetY(id: number, offsetY: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDropShadowOffsetY()

    <br /><p>Gets the drop shadow's vertical offset.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's Y offset should be queried. |

  #### Returns

  `number`

  The offset.

  #### Signature

  ```typescript
  getDropShadowOffsetY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowBlurRadiusX()

    <br /><p>Sets the drop shadow's horizontal blur radius.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's blur radius should be set. |
  | `blurRadiusX` | `number` | The blur radius to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowBlurRadiusX(id: number, blurRadiusX: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDropShadowBlurRadiusX()

    <br /><p>Gets the drop shadow's horizontal blur radius.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's blur radius should be queried. |

  #### Returns

  `number`

  The blur radius.

  #### Signature

  ```typescript
  getDropShadowBlurRadiusX(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowBlurRadiusY()

    <br /><p>Sets the drop shadow's vertical blur radius.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's blur radius should be set. |
  | `blurRadiusY` | `number` | The blur radius to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowBlurRadiusY(id: number, blurRadiusY: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDropShadowBlurRadiusY()

    <br /><p>Gets the drop shadow's vertical blur radius.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's blur radius should be queried. |

  #### Returns

  `number`

  The blur radius.

  #### Signature

  ```typescript
  getDropShadowBlurRadiusY(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setDropShadowClip()

    <br /><p>Sets the drop shadow's clipping behavior.</p>
  </summary>

  This only applies to shapes.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's clip should be set. |
  | `clip` | `boolean` | The drop shadow's clip to be set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setDropShadowClip(id: number, clip: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getDropShadowClip()

    <br /><p>Gets the drop shadow's clipping behavior.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose drop shadow's clipping should be queried. |

  #### Returns

  `boolean`

  The drop shadow's clipping state.

  #### Signature

  ```typescript
  getDropShadowClip(id: number): boolean
  ```
</details>

## Block Effects

Create, manage, and apply various visual effects to blocks.

<details>
  <summary>
    ### createEffect()

    <br /><p>Creates a new effect block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`EffectType`](./api/node/type-aliases/effecttype.md) | The type of the effect. |

  #### Returns

  `number`

  The created effect's handle.

  #### Signature

  ```typescript
  createEffect(type: EffectType): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasEffects()~~

    <br /><p>Checks if a block supports effects.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block can render effects, false otherwise.

  #### Deprecated

  Use supportsEffects instead.

  ***
</details>

<details>
  <summary>
    ### supportsEffects()

    <br /><p>Checks if a block supports effects.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block can render effects, false otherwise.

  #### Signature

  ```typescript
  supportsEffects(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### getEffects()

    <br /><p>Gets all effects attached to a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`\[]

  A list of effects or an error, if the block doesn't support effects.

  #### Signature

  ```typescript
  getEffects(id: number): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### insertEffect()

    <br /><p>Inserts an effect into a block's effect list at a given index.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `effectId` | `number` | The effect to insert. |
  | `index` | `number` | The index at which the effect shall be inserted. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  insertEffect(id: number, effectId: number, index: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### appendEffect()

    <br /><p>Appends an effect to a block's effect list.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to append the effect to. |
  | `effectId` | `number` | The effect to append. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  appendEffect(id: number, effectId: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeEffect()

    <br /><p>Removes an effect from a block's effect list at a given index.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to remove the effect from. |
  | `index` | `number` | The index where the effect is stored. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeEffect(id: number, index: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasEffectEnabled()~~

    <br /><p>Checks if an effect block can be enabled or disabled.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `effectId` | `number` | The 'effect' block to query. |

  #### Returns

  `boolean`

  True, if the block supports enabling and disabling, false otherwise.

  #### Deprecated

  Calls to this function can be removed. All effects can be enabled and disabled.

  ***
</details>

<details>
  <summary>
    ### setEffectEnabled()

    <br /><p>Sets the enabled state of an effect block.</p>
  </summary>

  ```javascript
  engine.block.setEffectEnabled(effects[0], false);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `effectId` | `number` | The 'effect' block to update. |
  | `enabled` | `boolean` | The new state. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setEffectEnabled(effectId: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isEffectEnabled()

    <br /><p>Queries if an effect block is enabled.</p>
  </summary>

  ```javascript
  engine.block.isEffectEnabled(effects[0]);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `effectId` | `number` | The 'effect' block to query. |

  #### Returns

  `boolean`

  True, if the effect is enabled. False otherwise.

  #### Signature

  ```typescript
  isEffectEnabled(effectId: number): boolean
  ```
</details>

## Block Blur

Apply and configure blur effects on blocks.

<details>
  <summary>
    ### createBlur()

    <br /><p>Creates a new blur block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`BlurType`](./api/node/type-aliases/blurtype.md) | The type of blur. |

  #### Returns

  `number`

  The handle of the newly created blur.

  #### Signature

  ```typescript
  createBlur(type: BlurType): number
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasBlur()~~

    <br /><p>Checks if a block supports blur.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports blur.

  #### Deprecated

  Use supportsBlur instead.

  ***
</details>

<details>
  <summary>
    ### supportsBlur()

    <br /><p>Checks if a block supports blur.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports blur.

  #### Signature

  ```typescript
  supportsBlur(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setBlur()

    <br /><p>Sets the blur effect for a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `blurId` | `number` | A 'blur' block to apply. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBlur(id: number, blurId: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getBlur()

    <br /><p>Gets the blur block of a given design block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `number`

  The 'blur' block.

  #### Signature

  ```typescript
  getBlur(id: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### setBlurEnabled()

    <br /><p>Enables or disables the blur effect on a block.</p>
  </summary>

  ```javascript
  engine.block.setBlurEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `enabled` | `boolean` | The new enabled value. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setBlurEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isBlurEnabled()

    <br /><p>Checks if blur is enabled for a block.</p>
  </summary>

  ```javascript
  const isBlurEnabled = engine.block.isBlurEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the blur is enabled. False otherwise.

  #### Signature

  ```typescript
  isBlurEnabled(id: number): boolean
  ```
</details>

## Block Placeholder

Manage placeholder functionality, controls, and behavior.

<details>
  <summary>
    ### setPlaceholderEnabled()

    <br /><p>Enables or disables the placeholder function for a block.</p>
  </summary>

  When set to `true`, the given block becomes selectable by users and its placeholder capabilities are enabled in Adopter mode.

  ```javascript
  engine.block.setPlaceholderEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder function should be enabled or disabled. |
  | `enabled` | `boolean` | Whether the function should be enabled or disabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaceholderEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPlaceholderEnabled()

    <br /><p>Checks if the placeholder function for a block is enabled and can be selected by users in Adopter mode.</p>
  </summary>

  ```javascript
  const placeholderIsEnabled = engine.block.isPlaceholderEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder function state should be queried. |

  #### Returns

  `boolean`

  The enabled state of the placeholder function.

  #### Signature

  ```typescript
  isPlaceholderEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasPlaceholderBehavior()~~

    <br /><p>Checks if a block supports placeholder behavior.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports placeholder behavior.

  #### Deprecated

  Use supportsPlaceholderBehavior instead.

  ***
</details>

<details>
  <summary>
    ### supportsPlaceholderBehavior()

    <br /><p>Checks if a block supports placeholder behavior.</p>
  </summary>

  ```javascript
  const placeholderBehaviorSupported = engine.block.supportsPlaceholderBehavior(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports placeholder behavior.

  #### Signature

  ```typescript
  supportsPlaceholderBehavior(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setPlaceholderBehaviorEnabled()

    <br /><p>Enables or disables the placeholder behavior for a block.</p>
  </summary>

  When its fill block is set to `true`, an image block will act as a placeholder, showing a control overlay and a replacement button.

  ```javascript
  engine.block.setPlaceholderBehaviorEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder behavior should be enabled or disabled. |
  | `enabled` | `boolean` | Whether the placeholder behavior should be enabled or disabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaceholderBehaviorEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPlaceholderBehaviorEnabled()

    <br /><p>Checks if the placeholder behavior for a block is enabled.</p>
  </summary>

  ```javascript
  engine.block.setPlaceholderBehaviorEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder behavior state should be queried. |

  #### Returns

  `boolean`

  The enabled state of the placeholder behavior.

  #### Signature

  ```typescript
  isPlaceholderBehaviorEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### ~~hasPlaceholderControls()~~

    <br /><p>Checks if a block supports placeholder controls.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports placeholder controls.

  #### Deprecated

  Use supportsPlaceholderControls instead.

  ***
</details>

<details>
  <summary>
    ### supportsPlaceholderControls()

    <br /><p>Checks if a block supports placeholder controls, e.g. a control overlay and a replacement button.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to query. |

  #### Returns

  `boolean`

  True, if the block supports placeholder controls.

  #### Signature

  ```typescript
  supportsPlaceholderControls(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setPlaceholderControlsOverlayEnabled()

    <br /><p>Enables or disables the placeholder overlay pattern.</p>
  </summary>

  ```javascript
  engine.block.setPlaceholderControlsOverlayEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder overlay should be enabled or disabled. |
  | `enabled` | `boolean` | Whether the placeholder overlay should be shown or not. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaceholderControlsOverlayEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPlaceholderControlsOverlayEnabled()

    <br /><p>Checks if the placeholder overlay pattern is enabled.</p>
  </summary>

  ```javascript
  const overlayEnabled = engine.block.isPlaceholderControlsOverlayEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder overlay visibility state should be queried. |

  #### Returns

  `boolean`

  The visibility state of the block's placeholder overlay pattern.

  #### Signature

  ```typescript
  isPlaceholderControlsOverlayEnabled(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setPlaceholderControlsButtonEnabled()

    <br /><p>Enables or disables the placeholder button.</p>
  </summary>

  ```javascript
  engine.block.setPlaceholderControlsButtonEnabled(block, true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder button should be shown or not. |
  | `enabled` | `boolean` | Whether the placeholder button should be shown or not. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPlaceholderControlsButtonEnabled(id: number, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPlaceholderControlsButtonEnabled()

    <br /><p>Checks if the placeholder button is enabled.</p>
  </summary>

  ```javascript
  const buttonEnabled = engine.block.isPlaceholderControlsButtonEnabled(block);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose placeholder button visibility state should be queried. |

  #### Returns

  `boolean`

  The visibility state of the block's placeholder button.

  #### Signature

  ```typescript
  isPlaceholderControlsButtonEnabled(id: number): boolean
  ```
</details>

## Block Scopes

Manage permissions and capabilities per block.

<details>
  <summary>
    ### setScopeEnabled()

    <br /><p>Enables or disables a scope for a block.</p>
  </summary>

  ```javascript
  // Allow the user to move the image block.
  engine.block.setScopeEnabled(image, 'layer/move', true);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose scope should be enabled or disabled. |
  | `key` | [`Scope`](./api/node/type-aliases/scope.md) | The scope to enable or disable. |
  | `enabled` | `boolean` | Whether the scope should be enabled or disabled. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setScopeEnabled(id: number, key: Scope, enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### isScopeEnabled()

    <br /><p>Checks if a scope is enabled for a block.</p>
  </summary>

  ```javascript
  engine.block.isScopeEnabled(image, 'layer/move');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose scope state should be queried. |
  | `key` | [`Scope`](./api/node/type-aliases/scope.md) | The scope to query. |

  #### Returns

  `boolean`

  The enabled state of the scope for the given block.

  #### Signature

  ```typescript
  isScopeEnabled(id: number, key: Scope): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### isAllowedByScope()

    <br /><p>Checks if an operation is allowed by a block's scopes.</p>
  </summary>

  ```javascript
  // This will return true when the global scope is set to 'Defer'.
  engine.block.isAllowedByScope(image, 'layer/move');
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to check. |
  | `key` | [`Scope`](./api/node/type-aliases/scope.md) | The scope to check. |

  #### Returns

  `boolean`

  Whether the scope is allowed for the given block.

  #### Signature

  ```typescript
  isAllowedByScope(id: number, key: Scope): boolean
  ```
</details>

## Block Boolean Operations

Combine multiple blocks into a single new block using boolean path operations.

<details>
  <summary>
    ### isCombinable()

    <br /><p>Checks if a set of blocks can be combined using a boolean operation.</p>
  </summary>

  Only graphics blocks and text blocks can be combined.
  All blocks must have the "lifecycle/duplicate" scope enabled.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | An array of block ids. |

  #### Returns

  `boolean`

  Whether the blocks can be combined.

  #### Signature

  ```typescript
  isCombinable(ids: number[]): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### combine()

    <br /><p>Performs a boolean operation on a set of blocks.</p>
  </summary>

  All blocks must be combinable. See `isCombinable`.
  The parent, fill and sort order of the new block is that of the prioritized block.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks to combine. They will be destroyed if "lifecycle/destroy" scope is enabled. |
  | `op` | [`BooleanOperation`](./api/node/type-aliases/booleanoperation.md) | The boolean operation to perform. |

  #### Returns

  `number`

  The newly created block or an error.

  #### Signature

  ```typescript
  combine(ids: number[], op: BooleanOperation): number
  ```
</details>

## Block Cutout

Create cutout operations and path-based modifications.

<details>
  <summary>
    ### createCutoutFromBlocks()

    <br /><p>Creates a cutout block from the contours of other blocks.</p>
  </summary>

  The path is derived from either existing vector paths or by vectorizing the block's appearance.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The blocks whose shape will serve as the basis for the cutout's path. |
  | `vectorizeDistanceThreshold?` | `number` | Max deviation from the original contour during vectorization. |
  | `simplifyDistanceThreshold?` | `number` | Max deviation for path simplification. 0 disables simplification. |
  | `useExistingShapeInformation?` | `boolean` | If true, use existing vector paths. |

  #### Returns

  `number`

  The newly created block or an error.

  #### Signature

  ```typescript
  createCutoutFromBlocks(ids: number[], vectorizeDistanceThreshold?: number, simplifyDistanceThreshold?: number, useExistingShapeInformation?: boolean): number
  ```

  ***
</details>

<details>
  <summary>
    ### createCutoutFromPath()

    <br /><p>Creates a cutout block from an SVG path string.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `path` | `string` | An SVG string describing a path. |

  #### Returns

  `number`

  The newly created block or an error.

  #### Signature

  ```typescript
  createCutoutFromPath(path: string): number
  ```

  ***
</details>

<details>
  <summary>
    ### createCutoutFromOperation()

    <br /><p>Creates a new cutout block by performing a boolean operation on existing cutout blocks.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `number`\[] | The cutout blocks with which to perform to the operation. |
  | `op` | [`CutoutOperation`](./api/node/type-aliases/cutoutoperation.md) | The boolean operation to perform. |

  #### Returns

  `number`

  The newly created block or an error.

  #### Signature

  ```typescript
  createCutoutFromOperation(ids: number[], op: CutoutOperation): number
  ```
</details>

## Block

<details>
  <summary>
    ### split()

    <br /><p>Splits a block at the specified time.</p>
  </summary>

  The original block will be trimmed to end at the split time, and the returned duplicate
  will start at the split time and continue to the original end time.

  ```javascript
  const duplicate = engine.block.split(video, 10.0);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to split. |
  | `atTime` | `number` | The time (in seconds) relative to the block's time offset where the split should occur. |
  | `options?` | [`SplitOptions`](./api/node/type-aliases/splitoptions.md) | The options for configuring the split operation. |

  #### Returns

  `number`

  The newly created second half of the split block.

  #### Signature

  ```typescript
  split(id: number, atTime: number, options?: SplitOptions): number
  ```
</details>

## Block Analysis

<details>
  <summary>
    ### getDominantColors()

    <br /><p>Extracts the dominant colors from the rendered appearance of a block.</p>
  </summary>

  Performs an internal update to resolve the final layout for the block. Will not
  complete as long as assets are in a pending state; asset loading progresses during
  engine updates. Crops, color adjustments, and effects applied to the block are
  reflected in the returned palette. Fully or mostly transparent pixels are excluded
  from the analysis.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `handle` | `number` | The design block element to analyze. Must be attached to a scene and render visible content. |
  | `options?` | [`DominantColorsOptions`](./api/node/interfaces/dominantcolorsoptions.md) | See `DominantColorsOptions`. |

  #### Returns

  `Promise`\<[`DominantColor`](./api/node/interfaces/dominantcolor.md)\[]>

  A promise that resolves with the dominant colors sorted by weight, descending.

  #### Signature

  ```typescript
  getDominantColors(handle: number, options?: DominantColorsOptions): Promise<DominantColor[]>
  ```
</details>

## Block Audio

<details>
  <summary>
    ### getAudioTrackCountFromVideo()

    <br /><p>Gets the number of available audio tracks in a video fill block.</p>
  </summary>

  ```javascript
  const trackCount = engine.block.getAudioTrackCountFromVideo(videoBlock);
  console.log(`Video has ${trackCount} audio tracks`);
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `videoFillBlock` | `number` | The video fill block to examine. |

  #### Returns

  `number`

  The number of audio tracks.

  #### Throws

  Will throw an error if the block is not a video fill or has no audio.

  #### Signature

  ```typescript
  getAudioTrackCountFromVideo(videoFillBlock: number): number
  ```

  ***
</details>

<details>
  <summary>
    ### createAudioFromVideo()

    <br /><p>Creates a new audio block by extracting a specific audio track from a video fill block.</p>
  </summary>

  ```javascript
  // Extract the first audio track (usually the main mix) with trim settings
  const audioBlock = engine.block.createAudioFromVideo(videoFillBlock, 0);

  // Extract full audio track without trim settings
  const audioBlock = engine.block.createAudioFromVideo(videoFillBlock, 0, { keepTrimSettings: false });

  // Extract a specific track, keep trim settings, and mute the original video
  const dialogueTrack = engine.block.createAudioFromVideo(videoFillBlock, 1, { keepTrimSettings: true, muteOriginalVideo: true });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `videoFillBlock` | `number` | The video fill block to extract audio from. |
  | `trackIndex` | `number` | The index of the audio track to extract (0-based). |
  | `options?` | [`AudioFromVideoOptions`](./api/node/type-aliases/audiofromvideooptions.md) | Options for the audio extraction operation. |

  #### Returns

  `number`

  The handle of the newly created audio block with extracted audio from the specified track.

  #### Throws

  Will throw an error if the track index is invalid or the block has no audio.

  #### Signature

  ```typescript
  createAudioFromVideo(videoFillBlock: number, trackIndex: number, options?: AudioFromVideoOptions): number
  ```

  ***
</details>

<details>
  <summary>
    ### createAudiosFromVideo()

    <br /><p>Creates multiple audio blocks by extracting all audio tracks from a video fill block.</p>
  </summary>

  ```javascript
  // Extract all audio tracks from a video with trim settings
  const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock);
  console.log(`Created ${audioBlocks.length} audio blocks`);

  // Extract all tracks without trim settings (full audio)
  const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock, { keepTrimSettings: false });

  // Extract all tracks with trim settings and mute the original video
  const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock, { keepTrimSettings: true, muteOriginalVideo: true });
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `videoFillBlock` | `number` | The video fill block to extract audio from. |
  | `options?` | [`AudioFromVideoOptions`](./api/node/type-aliases/audiofromvideooptions.md) | Options for the audio extraction operation. |

  #### Returns

  `number`\[]

  An array of handles for the newly created audio blocks, one per track.

  #### Throws

  Will throw an error if the block has no audio or extraction fails.

  #### Signature

  ```typescript
  createAudiosFromVideo(videoFillBlock: number, options?: AudioFromVideoOptions): number[]
  ```

  ***
</details>

<details>
  <summary>
    ### getAudioInfoFromVideo()

    <br /><p>Gets information about all audio tracks from a video fill block.</p>
  </summary>

  ```javascript
  // Get information about all audio tracks
  const trackInfos = engine.block.getAudioInfoFromVideo(videoFillBlock);
  console.log(`Video has ${trackInfos.length} audio tracks`);

  // Display track information
  trackInfos.forEach((track, index) => {
    console.log(`Track ${index}: ${track.channels} channels, ${track.sampleRate}Hz, ${track.language}`);
  });

  // Use track info to create audio blocks selectively
  const englishTracks = trackInfos.filter(track => track.language === 'eng');
  const audioBlocks = englishTracks.map(track =>
    engine.block.createAudioFromVideo(videoFillBlock, track.trackIndex)
  );
  ```

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `videoFillBlock` | `number` | The video fill block to analyze for audio track information. |

  #### Returns

  [`AudioTrackInfo`](./api/node/interfaces/audiotrackinfo.md)\[]

  An array containing information about each audio track.

  #### Throws

  Will throw an error if the block is not a video fill or has no audio.

  #### Signature

  ```typescript
  getAudioInfoFromVideo(videoFillBlock: number): AudioTrackInfo[]
  ```
</details>

## Block Metadata

<details>
  <summary>
    ### setMetadata()

    <br /><p>Sets a metadata value for a given key on a block.</p>
  </summary>

  If the key does not exist, it will be added.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose metadata will be accessed. |
  | `key` | `string` | The key used to identify the desired piece of metadata. |
  | `value` | `string` | The value to set. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setMetadata(id: number, key: string, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getMetadata()

    <br /><p>Gets a metadata value for a given key from a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose metadata will be accessed. |
  | `key` | `string` | The key used to identify the desired piece of metadata. |

  #### Returns

  `string`

  The value associated with the key.

  #### Signature

  ```typescript
  getMetadata(id: number, key: string): string
  ```

  ***
</details>

<details>
  <summary>
    ### hasMetadata()

    <br /><p>Checks if a block has metadata for a given key.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose metadata will be accessed. |
  | `key` | `string` | The key used to identify the desired piece of metadata. |

  #### Returns

  `boolean`

  Whether the key exists.

  #### Signature

  ```typescript
  hasMetadata(id: number, key: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### findAllMetadata()

    <br /><p>Finds all metadata keys on a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose metadata will be accessed. |

  #### Returns

  `string`\[]

  A list of all metadata keys on this block.

  #### Signature

  ```typescript
  findAllMetadata(id: number): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### removeMetadata()

    <br /><p>Removes metadata for a given key from a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block whose metadata will be accessed. |
  | `key` | `string` | The key used to identify the desired piece of metadata. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeMetadata(id: number, key: string): void
  ```
</details>

## Block Transitions

<details>
  <summary>
    ### createTransition()

    <br /><p>Creates a new transition block.</p>
  </summary>

  The created block is standalone until assigned to a clip with `setTransition`.
  Once assigned, it is owned by that clip: it is destroyed together with the
  clip, and the engine also destroys it automatically when the two clips stop
  being timeline-adjacent on the track (e.g. after a manual gap is introduced).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `type` | [`TransitionType`](./api/node/type-aliases/transitiontype.md) | The type of transition to create. |

  #### Returns

  `number`

  The handle of the new transition instance.

  #### Signature

  ```typescript
  createTransition(type: TransitionType): number
  ```

  ***
</details>

<details>
  <summary>
    ### supportsTransition()

    <br /><p>Checks whether a clip can own an outgoing clip-to-clip transition.</p>
  </summary>

  Only leaf clips inside a video track qualify. Audio, group, caption, and
  cutout blocks — as well as blocks outside a video track — report `false`.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The clip block to check. |

  #### Returns

  `boolean`

  Whether the block can own an outgoing transition.

  #### Signature

  ```typescript
  supportsTransition(id: number): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### setTransition()

    <br /><p>Assigns the outgoing transition of a clip.</p>
  </summary>

  A previously assigned transition block is detached but not destroyed
  automatically. Throws an error if the given transition block is invalid or
  already assigned to another clip. Both the clip and its following clip on
  the track must support transitions, see `supportsTransition`. To clear a
  clip's transition, use `removeTransition` instead.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The outgoing clip that owns the transition relation. |
  | `transition` | `number` | The transition block to assign. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setTransition(id: number, transition: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeTransition()

    <br /><p>Removes the outgoing transition of a clip.</p>
  </summary>

  The removed transition block is detached but not destroyed automatically.
  Removing from a clip without an assigned transition is a no-op.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The outgoing clip whose transition relation should be cleared. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeTransition(id: number): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTransition()

    <br /><p>Gets the outgoing transition assigned to a clip.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The outgoing clip whose transition relation should be queried. |

  #### Returns

  `number`

  The assigned transition block, or an invalid block if unset.

  #### Signature

  ```typescript
  getTransition(id: number): number
  ```
</details>

## Helper

Convenient high-level functions that combine multiple operations into single, easy-to-use methods for common tasks like adding media, applying effects, and positioning blocks.

<details>
  <summary>
    ### setSize()

    <br /><p>Update a block's size.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `width` | `number` | The new width of the block. |
  | `height` | `number` | The new height of the block. |
  | `options?` | \{ `maintainCrop?`: `boolean`; `sizeMode?`: [`SizeMode`](./api/node/type-aliases/sizemode.md); } | Optional parameters for the size. Properties: - `maintainCrop` - Whether or not the crop values, if available, should be automatically adjusted. - `sizeMode` - The size mode: Absolute, Percent or Auto. |
  | `options.maintainCrop?` | `boolean` | - |
  | `options.sizeMode?` | [`SizeMode`](./api/node/type-aliases/sizemode.md) | - |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setSize(id: number, width: number, height: number, options?: object): void
  ```

  ***
</details>

<details>
  <summary>
    ### setPosition()

    <br /><p>Update a block's position.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `number` | The block to update. |
  | `x` | `number` | The new x position of the block. |
  | `y` | `number` | The new y position of the block. |
  | `options?` | \{ `positionMode?`: [`PositionMode`](./api/node/type-aliases/positionmode.md); } | Optional parameters for the position. Properties: - `positionMode` - The position mode: absolute, percent or undefined. |
  | `options.positionMode?` | [`PositionMode`](./api/node/type-aliases/positionmode.md) | - |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPosition(id: number, x: number, y: number, options?: object): void
  ```

  ***
</details>

<details>
  <summary>
    ### addImage()

    <br /><p>Adds an image to the current page. The image will be automatically loaded
    and sized appropriately. In Video mode, timeline and animation options can be applied.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | URL or path to the image file |
  | `options?` | [`AddImageOptions`](./api/node/type-aliases/addimageoptions.md) | Configuration options for the image |

  #### Returns

  `Promise`\<`number`>

  Promise that resolves to the ID of the created image block

  #### Throws

  Error if no current page exists

  #### Signature

  ```typescript
  addImage(url: string, options?: AddImageOptions): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### addVideo()

    <br /><p>Adds a video block to the current scene page. The video will be positioned and sized
    according to the provided parameters. Timeline and animation effects can be applied.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | URL or path to the video file |
  | `width` | `number` | Width of the video in scene design units |
  | `height` | `number` | Height of the video in scene design units |
  | `options?` | [`AddVideoOptions`](./api/node/interfaces/addvideooptions.md) | Configuration options for the video |

  #### Returns

  `Promise`\<`number`>

  Promise that resolves to the ID of the created video block

  #### Throws

  Error if no current page exists

  #### Signature

  ```typescript
  addVideo(url: string, width: number, height: number, options?: AddVideoOptions): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### applyAnimation()

    <br /><p>Applies an animation to a block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `block` | `number` | The ID of the block to apply the animation to |
  | `animation?` | [`AnimationOptions`](./api/node/type-aliases/animationoptions.md) | The animation configuration options |

  #### Returns

  `void`

  #### Signature

  ```typescript
  applyAnimation(block: number, animation?: AnimationOptions): void
  ```

  ***
</details>

<details>
  <summary>
    ### applyDropShadow()

    <br /><p>Applies a drop shadow effect to any block.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `block` | `number` | The ID of the block to apply the shadow to |
  | `options?` | [`DropShadowOptions`](./api/node/type-aliases/dropshadowoptions.md) | Shadow configuration options. If not provided, enables shadow with default settings |

  #### Returns

  `void`

  #### Signature

  ```typescript
  applyDropShadow(block: number, options?: DropShadowOptions): void
  ```

  ***
</details>

<details>
  <summary>
    ### generateThumbnailAtTimeOffset()

    <br /><p>Generates a thumbnail image of the scene at a specific time.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `height` | `number` | Height of the thumbnail in scene design units (maximum 512) |
  | `time` | `number` | Time position in seconds to capture the thumbnail |

  #### Returns

  `Promise`\<`Blob`>

  Promise that resolves to a Blob containing the PNG thumbnail image

  #### Throws

  Error if no page exists or if height exceeds 512 pixels

  #### Signature

  ```typescript
  generateThumbnailAtTimeOffset(height: number, time: number): Promise<Blob>
  ```

  ***
</details>

<details>
  <summary>
    ### getBackgroundTrack()

    <br /><p>Gets the background track of the current scene.
    The background track is the track that determines the page duration.</p>
  </summary>

  #### Returns

  `number`

  The ID of the background track, or null if none exists

  #### Signature

  ```typescript
  getBackgroundTrack(): number
  ```

  ***
</details>

<details>
  <summary>
    ### moveToBackgroundTrack()

    <br /><p>Moves a block to the background track.
    This is useful for organizing content in video scenes where you want
    certain elements to be part of the background layer.
    The background track is the track that determines the page duration.
    If no background track exists, one will be created automatically.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `block` | `number` | The ID of the block to move to the background track |

  #### Returns

  `void`

  #### Signature

  ```typescript
  moveToBackgroundTrack(block: number): void
  ```
</details>


---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[node API Reference](./api/node.md)** - Full node API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support