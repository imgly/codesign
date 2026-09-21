# BlockAPI

## Block Export

Export blocks to various formats like images, videos, and audio.

### export()

Exports a design block to a Blob.
Performs an internal update to resolve the final layout for the blocks.

```typescript
export(handle: DesignBlockId, options?: ExportOptions): Promise<Blob>
```

**Parameters:**
- `handle` - The design block element to export.
- `options` - The options for exporting the block type, including mime type and export settings.

**Returns:** A promise that resolves with the exported image or is rejected with an error.

### exportWithColorMask()

Exports a design block and a color mask to two separate Blobs.
Performs an internal update to resolve the final layout for the blocks.

```typescript
exportWithColorMask(handle: DesignBlockId, maskColorR: number, maskColorG: number, maskColorB: number, options?: ExportOptions): Promise<Blob[]>
```

**Parameters:**
- `handle` - The design block element to export.
- `maskColorR` - The red component of the special color mask color.
- `maskColorG` - The green component of the special color mask color.
- `maskColorB` - The blue component of the special color mask color.
- `options` - The options for exporting the block type

**Returns:** A promise that resolves with an array of the exported image and mask or is rejected with an error.

### exportVideo()

Exports a design block as a video file.
Note: The export will run across multiple iterations of the update loop. In each iteration a frame is scheduled for encoding.

```typescript
exportVideo(handle: DesignBlockId, options?: VideoExportOptions): Promise<Blob>
```

**Parameters:**
- `handle` - The design block element to export. Currently, only page blocks are supported.
- `options` - The options for exporting the video, including mime type, h264 profile, level, bitrate, time offset, duration, framerate, target width and height.

**Returns:** A promise that resolves with a video blob or is rejected with an error.

### exportAudio()

Exports a design block as an audio file.

```typescript
exportAudio(handle: DesignBlockId, options?: AudioExportOptions): Promise<Blob>
```

**Parameters:**
- `handle` - The design block element to export. Currently, only audio blocks are supported.
- `options` - The options for exporting the audio, including mime type, progress callback, and export settings.

**Returns:** A promise that resolves with an audio blob or is rejected with an error.

## Block Analysis

### getDominantColors()

Extracts the dominant colors from the rendered appearance of a block.
Performs an internal update to resolve the final layout for the block. Will not
complete as long as assets are in a pending state; asset loading progresses during
engine updates. Crops, color adjustments, and effects applied to the block are
reflected in the returned palette. Fully or mostly transparent pixels are excluded
from the analysis.

```typescript
getDominantColors(handle: DesignBlockId, options?: DominantColorsOptions): Promise<DominantColor[]>
```

**Parameters:**
- `handle` - The design block element to analyze. Must be attached to a scene
and render visible content.
- `options` - See `DominantColorsOptions`.

**Returns:** A promise that resolves with the dominant colors sorted by weight, descending.

## Block Lifecycle

Manage the complete lifecycle: create, find, duplicate, destroy, and serialize blocks.

### loadFromString()

Loads blocks from a serialized string.
The blocks are not attached by default and won't be visible until attached to a page or the scene.
The UUID of the loaded blocks is replaced with a new one.

```typescript
loadFromString(content: string): Promise<DesignBlockId[]>
```

**Parameters:**
- `content` - A string representing the given blocks.

**Returns:** A promise that resolves with a list of handles representing the found blocks or an error.

### loadFromArchiveURL()

Loads blocks from a remote archive URL.
The URL should be that of a file previously saved with `block.saveToArchive`.
The blocks are not attached by default and won't be visible until attached to a page or the scene.
The UUID of the loaded blocks is replaced with a new one.

```typescript
loadFromArchiveURL(url: string): Promise<DesignBlockId[]>
```

**Parameters:**
- `url` - The URL of the blocks archive file.

**Returns:** A promise that resolves with a list of handles representing the found blocks or an error.

### loadFromURL()

Loads blocks from a URL.
The URL should point to a blocks file within an unzipped archive directory previously saved with `block.saveToArchive`.
The blocks are not attached by default and won't be visible until attached to a page or the scene.
The UUID of the loaded blocks is replaced with a new one.

```typescript
loadFromURL(url: string): Promise<DesignBlockId[]>
```

**Parameters:**
- `url` - The URL to the blocks file

**Returns:** A promise that resolves with a list of block handles

### saveToString()

Saves the given blocks to a serialized string.
If a page with multiple children is given, the entire hierarchy is saved.

```typescript
saveToString(blocks: DesignBlockId[], allowedResourceSchemes?: string[], onDisallowedResourceScheme?: (url: string, dataHash: string) => Promise<string>): Promise<string>
```

**Parameters:**
- `blocks` - The blocks to save.
- `allowedResourceSchemes` - The resource schemes to allow in the saved string. Defaults to ['buffer', 'http', 'https'].
- `onDisallowedResourceScheme` - An optional callback that is called for each resource URL that has a scheme absent from
`resourceSchemesAllowed`. The `url` parameter is the resource URL and the `dataHash` parameter is the hash of the
resource's data. The callback should return a new URL for the resource, which will be used in the serialized
scene. The callback is expected to return the original URL if no persistence is needed.

**Returns:** A promise that resolves to a string representing the blocks or an error.

### saveToArchive()

Saves the given blocks and their assets to a zip archive.
The archive contains all assets that were accessible when this function was called.
Blocks in the archived scene reference assets relative to the location of the scene file.

```typescript
saveToArchive(blocks: DesignBlockId[]): Promise<Blob>
```

**Parameters:**
- `blocks` - The blocks to save.

**Returns:** A promise that resolves with a Blob on success or an error on failure.

### create()

Creates a new block of a given type.
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

```typescript
create(type: DesignBlockType): DesignBlockId
```

**Parameters:**
- `type` - The type of the block that shall be created.

**Returns:** The created block's handle.

### duplicate()

Duplicates a block and its children.

```typescript
duplicate(id: DesignBlockId, attachToParent?: boolean): DesignBlockId
```

**Parameters:**
- `id` - The block to duplicate.
- `attachToParent` - Whether the duplicated block should be attached to the original's parent. Defaults to true.

**Returns:** The handle of the duplicate.

### destroy()

Destroys a block and its children.

```typescript
destroy(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block to destroy.

### forceLoadResources()

Forces the loading of resources for a set of blocks and their children.
This is useful for preloading resources. If a resource failed to load previously, it will be reloaded.
Pass an empty array to load resources for every block currently known to the engine.

```typescript
forceLoadResources(ids: DesignBlockId[]): Promise<void>
```

**Parameters:**
- `ids` - The blocks whose resources should be loaded. Pass an empty array to load resources for every
  block currently known to the engine.

**Returns:** A Promise that resolves once all resources have finished loading.

## Block Fills

Create, configure, and manage block fills, including solid colors, gradients, and images.

### createFill()

Creates a new fill block.
```javascript
const solidColoFill = engine.block.createFill('color');
// Longhand fill types are also supported
const imageFill = engine.block.createFill('//ly.img.ubq/fill/image');
```

```typescript
createFill(type: FillType): DesignBlockId
```

**Parameters:**
- `type` - The type of the fill object that shall be created.

**Returns:** The created fill's handle.

### hasContentFillMode() *(deprecated)*

Checks if a block supports content fill modes.

```typescript
hasContentFillMode(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a content fill mode.

### supportsContentFillMode()

Checks if a block supports content fill modes.

```typescript
supportsContentFillMode(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a content fill mode.

### setContentFillMode()

Sets the content fill mode of a block.
```javascript
engine.block.setContentFillMode(image, 'Cover');
```

```typescript
setContentFillMode(id: DesignBlockId, mode: ContentFillMode): void
```

**Parameters:**
- `id` - The block to update.
- `mode` - The content fill mode: 'Crop', 'Cover' or 'Contain'.

### getContentFillMode()

Gets the content fill mode of a block.
```javascript
engine.block.getContentFillMode(image);
```

```typescript
getContentFillMode(id: DesignBlockId): ContentFillMode
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current mode: 'Crop', 'Cover' or 'Contain'.

### setContentFillHorizontalAlignment()

Sets the horizontal alignment of the content fill within a block.
Only affects 'Contain' and 'Cover' fill modes; has no visible effect in 'Crop' mode,
where the user positions the content explicitly.
```javascript
engine.block.setContentFillHorizontalAlignment(image, 'Left');
```

```typescript
setContentFillHorizontalAlignment(id: DesignBlockId, alignment: HorizontalContentFillAlignment): void
```

**Parameters:**
- `id` - The block to update.
- `alignment` - The horizontal alignment: 'Left', 'Center' or 'Right'.

### getContentFillHorizontalAlignment()

Gets the horizontal alignment of the content fill within a block.
```javascript
engine.block.getContentFillHorizontalAlignment(image);
```

```typescript
getContentFillHorizontalAlignment(id: DesignBlockId): HorizontalContentFillAlignment
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current alignment: 'Left', 'Center' or 'Right'.

### setContentFillVerticalAlignment()

Sets the vertical alignment of the content fill within a block.
Only affects 'Contain' and 'Cover' fill modes; has no visible effect in 'Crop' mode,
where the user positions the content explicitly.
```javascript
engine.block.setContentFillVerticalAlignment(image, 'Top');
```

```typescript
setContentFillVerticalAlignment(id: DesignBlockId, alignment: VerticalContentFillAlignment): void
```

**Parameters:**
- `id` - The block to update.
- `alignment` - The vertical alignment: 'Top', 'Center' or 'Bottom'.

### getContentFillVerticalAlignment()

Gets the vertical alignment of the content fill within a block.
```javascript
engine.block.getContentFillVerticalAlignment(image);
```

```typescript
getContentFillVerticalAlignment(id: DesignBlockId): VerticalContentFillAlignment
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current alignment: 'Top', 'Center' or 'Bottom'.

### setGradientColorStops()

Sets the color stops for a gradient property.
```javascript
engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
  { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
  { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
]);
```

```typescript
setGradientColorStops(id: DesignBlockId, property: string, colors: GradientColorStop[]): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set, e.g. 'fill/gradient/colors'.
- `colors` - An array of gradient color stops.

### getGradientColorStops()

Gets the color stops from a gradient property.
```
engine.block.getGradientColorStops(gradientFill, 'fill/gradient/colors');
```

```typescript
getGradientColorStops(id: DesignBlockId, property: string): GradientColorStop[]
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The gradient colors.

### getSourceSet()

Gets the source set from a block property.
```javascript
const sourceSet = engine.block.getSourceSet(imageFill, 'fill/image/sourceSet');
```

```typescript
getSourceSet(id: DesignBlockId, property: SourceSetPropertyName): Source[]
```

**Parameters:**
- `id` - The block that should be queried.
- `property` - The name of the property to query, e.g. 'fill/image/sourceSet'.

**Returns:** The block's source set.

### setSourceSet()

Sets the source set for a block property.
The crop and content fill mode of the associated block will be reset to default values.
```javascript
engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [{
  uri: 'https://example.com/sample.jpg',
  width: 800,
  height: 600
}]);
```

```typescript
setSourceSet(id: DesignBlockId, property: SourceSetPropertyName, sourceSet: Source[]): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `sourceSet` - The block's new source set.

### addImageFileURIToSourceSet()

Adds an image file URI to a source set property.
If an image with the same width already exists in the source set, it will be replaced.
```javascript
await engine.block.addImageFileURIToSourceSet(imageFill, 'fill/image/sourceSet', 'https://example.com/sample.jpg');
```

```typescript
addImageFileURIToSourceSet(id: DesignBlockId, property: SourceSetPropertyName, uri: string): Promise<void>
```

**Parameters:**
- `id` - The block to update.
- `property` - The name of the property to modify.
- `uri` - The source to add to the source set.

**Returns:** A promise that resolves when the operation is complete.

### addVideoFileURIToSourceSet()

Adds a video file URI to a source set property.
If a video with the same width already exists in the source set, it will be replaced.
```javascript
await engine.block.addVideoFileURIToSourceSet(videoFill, 'fill/video/sourceSet', 'https://example.com/sample.mp4');
```

```typescript
addVideoFileURIToSourceSet(id: DesignBlockId, property: SourceSetPropertyName, uri: string): Promise<void>
```

**Parameters:**
- `id` - The block to update.
- `property` - The name of the property to modify.
- `uri` - The source to add to the source set.

**Returns:** A promise that resolves when the operation is complete.

### hasFillColor() *(deprecated)*

Checks if a block has fill color properties.

```typescript
hasFillColor(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has fill color properties.

### setFillColorRGBA() *(deprecated)*

Sets the fill color of a block using RGBA values.

```typescript
setFillColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose fill color should be set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1.

### getFillColorRGBA() *(deprecated)*

Gets the fill color of a block as RGBA values.

```typescript
getFillColorRGBA(id: DesignBlockId): RGBA
```

**Parameters:**
- `id` - The block whose fill color should be queried.

**Returns:** The fill color.

### setFillColorEnabled() *(deprecated)*

Enables or disables the fill of a block.

```typescript
setFillColorEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose fill should be enabled or disabled.
- `enabled` - If true, the fill will be enabled.

### isFillColorEnabled() *(deprecated)*

Checks if the fill of a block is enabled.

```typescript
isFillColorEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose fill state should be queried.

**Returns:** True, if fill is enabled.

### hasFill() *(deprecated)*

Checks if a block has fill properties.

```typescript
hasFill(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has fill properties.

### supportsFill()

Checks if a block supports a fill.

```typescript
supportsFill(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports a fill.

### isFillEnabled()

Checks if the fill of a block is enabled.
```javascript
engine.block.isFillEnabled(block);
```

```typescript
isFillEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose fill state should be queried.

**Returns:** The fill state.

### setFillEnabled()

Enables or disables the fill of a block.
```javascript
engine.block.setFillEnabled(block, false);
```

```typescript
setFillEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose fill should be enabled or disabled.
- `enabled` - If true, the fill will be enabled.

### getFillOverprint()

Queries whether the fill of a block is marked as overprint for PDF export.
```javascript
const overprint = engine.block.getFillOverprint(block);
```

```typescript
getFillOverprint(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose fill overprint flag should be queried.

**Returns:** The fill overprint flag.

### setFillOverprint()

Marks the fill of a block as overprint for PDF export.
The flag is only honored by the PDF writer when the fill uses a spot color
(Separation/DeviceN). For process-color fills it is a silent no-op. On-screen
rendering ignores the flag.
```javascript
engine.block.setFillOverprint(block, true);
```

```typescript
setFillOverprint(id: DesignBlockId, overprint: boolean): void
```

**Parameters:**
- `id` - The block whose fill overprint flag should be set.
- `overprint` - If true, the fill is marked as overprint in exported PDFs.

### getFill()

Gets the fill block attached to a given block.

```typescript
getFill(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block whose fill block should be returned.

**Returns:** The block that currently defines the given block's fill.

### setFill()

Sets the fill block for a given block.
The previous fill block is not destroyed automatically.

```typescript
setFill(id: DesignBlockId, fill: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose fill should be changed.
- `fill` - The new fill block.

### setFillSolidColor()

Sets the solid fill color of a block.

```typescript
setFillSolidColor(id: DesignBlockId, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose fill color should be set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1. Defaults to 1.

### getFillSolidColor()

Gets the solid fill color of a block as RGBA values.

```typescript
getFillSolidColor(id: DesignBlockId): RGBA
```

**Parameters:**
- `id` - The block whose fill color should be queried.

**Returns:** The fill color.

## Block Audio

### getAudioTrackCountFromVideo()

Gets the number of available audio tracks in a video fill block.
```javascript
const trackCount = engine.block.getAudioTrackCountFromVideo(videoBlock);
console.log(`Video has ${trackCount} audio tracks`);
```

```typescript
getAudioTrackCountFromVideo(videoFillBlock: DesignBlockId): number
```

**Parameters:**
- `videoFillBlock` - The video fill block to examine.

**Returns:** The number of audio tracks.

### createAudioFromVideo()

Creates a new audio block by extracting a specific audio track from a video fill block.
```javascript
// Extract the first audio track (usually the main mix) with trim settings
const audioBlock = engine.block.createAudioFromVideo(videoFillBlock, 0);
// Extract full audio track without trim settings
const audioBlock = engine.block.createAudioFromVideo(videoFillBlock, 0, { keepTrimSettings: false });
// Extract a specific track, keep trim settings, and mute the original video
const dialogueTrack = engine.block.createAudioFromVideo(videoFillBlock, 1, { keepTrimSettings: true, muteOriginalVideo: true });
```

```typescript
createAudioFromVideo(videoFillBlock: DesignBlockId, trackIndex: number, options?: AudioFromVideoOptions): DesignBlockId
```

**Parameters:**
- `videoFillBlock` - The video fill block to extract audio from.
- `trackIndex` - The index of the audio track to extract (0-based).
- `options` - Options for the audio extraction operation.

**Returns:** The handle of the newly created audio block with extracted audio from the specified track.

### createAudiosFromVideo()

Creates multiple audio blocks by extracting all audio tracks from a video fill block.
```javascript
// Extract all audio tracks from a video with trim settings
const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock);
console.log(`Created ${audioBlocks.length} audio blocks`);
// Extract all tracks without trim settings (full audio)
const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock, { keepTrimSettings: false });
// Extract all tracks with trim settings and mute the original video
const audioBlocks = engine.block.createAudiosFromVideo(videoFillBlock, { keepTrimSettings: true, muteOriginalVideo: true });
```

```typescript
createAudiosFromVideo(videoFillBlock: DesignBlockId, options?: AudioFromVideoOptions): DesignBlockId[]
```

**Parameters:**
- `videoFillBlock` - The video fill block to extract audio from.
- `options` - Options for the audio extraction operation.

**Returns:** An array of handles for the newly created audio blocks, one per track.

### getAudioInfoFromVideo()

Gets information about all audio tracks from a video fill block.
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

```typescript
getAudioInfoFromVideo(videoFillBlock: DesignBlockId): AudioTrackInfo[]
```

**Parameters:**
- `videoFillBlock` - The video fill block to analyze for audio track information.

**Returns:** An array containing information about each audio track.

## Block Video

Manage time-based media like video and audio, including playback, timing, and controls.

### createCaptionsFromURI()

Creates new caption blocks from an SRT or VTT file URI.

```typescript
createCaptionsFromURI(uri: string): Promise<DesignBlockId[]>
```

**Parameters:**
- `uri` - The URI for the captions file to load. Supported file formats are: SRT and VTT.

**Returns:** A promise that resolves with a list of the created caption blocks.

### hasDuration() *(deprecated)*

Checks if a block has a duration property.

```typescript
hasDuration(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true if the block has a duration property.

### supportsDuration()

Checks if a block supports a duration property.

```typescript
supportsDuration(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true if the block supports a duration property.

### setDuration()

Sets the playback duration of a block.
The duration defines how long the block is active in the scene during playback.

```typescript
setDuration(id: DesignBlockId, duration: number): void
```

**Parameters:**
- `id` - The block whose duration should be changed.
- `duration` - The new duration in seconds.

### getDuration()

Gets the playback duration of a block.

```typescript
getDuration(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose duration should be returned.

**Returns:** The block's duration in seconds.

### setPageDurationSource()

Sets a block as the page's duration source.
This causes the page's total duration to be automatically determined by this block.

```typescript
setPageDurationSource(page: DesignBlockId, id: DesignBlockId): void
```

**Parameters:**
- `page` - The page block for which it should be enabled.
- `id` - The block that should become the duration source.

### isPageDurationSource()

Checks if a block is the duration source for its page.

```typescript
isPageDurationSource(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose duration source property should be queried.

**Returns:** true if the block is a duration source for a page.

### supportsPageDurationSource()

Checks if a block can be set as the page's duration source.

```typescript
supportsPageDurationSource(page: DesignBlockId, id: DesignBlockId): boolean
```

**Parameters:**
- `page` - The page to check against.
- `id` - The block to query.

**Returns:** true, if the block can be marked as the page's duration source.

### removePageDurationSource()

Removes a block as the page's duration source.
If a scene or page is given, it is deactivated for all blocks within it.

```typescript
removePageDurationSource(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose duration source property should be removed.

### hasTimeOffset() *(deprecated)*

Checks if a block has a time offset property.

```typescript
hasTimeOffset(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a time offset property.

### supportsTimeOffset()

Checks if a block supports a time offset.

```typescript
supportsTimeOffset(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports a time offset.

### setTimeOffset()

Sets the time offset of a block relative to its parent.
The time offset controls when the block first becomes active in the timeline.

```typescript
setTimeOffset(id: DesignBlockId, offset: number): void
```

**Parameters:**
- `id` - The block whose time offset should be changed.
- `offset` - The new time offset in seconds.

### getTimeOffset()

Gets the time offset of a block relative to its parent.

```typescript
getTimeOffset(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose time offset should be queried.

**Returns:** The time offset of the block in seconds.

### hasTrim() *(deprecated)*

Checks if a block has trim properties.

```typescript
hasTrim(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has trim properties.

### supportsTrim()

Checks if a block supports trim properties.

```typescript
supportsTrim(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports trim properties.

### setTrimOffset()

Sets the trim offset of a block's media content.
This sets the time within the media clip where playback should begin.

```typescript
setTrimOffset(id: DesignBlockId, offset: number): void
```

**Parameters:**
- `id` - The block whose trim should be updated.
- `offset` - The new trim offset, measured in timeline seconds (scaled by playback rate).

### getTrimOffset()

Gets the trim offset of a block's media content.

```typescript
getTrimOffset(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose trim offset should be queried.

**Returns:** the trim offset in seconds.

### setTrimLength()

Sets the trim length of a block's media content.
This is the duration of the media clip that should be used for playback.

```typescript
setTrimLength(id: DesignBlockId, length: number): void
```

**Parameters:**
- `id` - The object whose trim length should be updated.
- `length` - The new trim length in seconds.

### getTrimLength()

Gets the trim length of a block's media content.

```typescript
getTrimLength(id: DesignBlockId): number
```

**Parameters:**
- `id` - The object whose trim length should be queried.

**Returns:** The trim length of the object in seconds.

### getTotalSceneDuration() *(deprecated)*

Gets the total duration of a scene in video mode.

```typescript
getTotalSceneDuration(scene: DesignBlockId): number
```

**Parameters:**
- `scene` - The scene whose duration is being queried.

**Returns:** the total scene duration.

### setPlaying()

Sets whether a block should play its content during active playback.

```typescript
setPlaying(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block that should be updated.
- `enabled` - Whether the block should be playing its contents.

### isPlaying()

Checks if a block is playing its content.

```typescript
isPlaying(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** whether the block is playing during playback.

### hasPlaybackTime() *(deprecated)*

Checks if a block has a playback time property.

```typescript
hasPlaybackTime(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** whether the block has a playback time property.

### supportsPlaybackTime()

Checks if a block supports a playback time property.

```typescript
supportsPlaybackTime(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** whether the block supports a playback time property.

### setPlaybackTime()

Sets the current playback time of a block's content.

```typescript
setPlaybackTime(id: DesignBlockId, time: number): void
```

**Parameters:**
- `id` - The block whose playback time should be updated.
- `time` - The new playback time of the block in seconds.

### getPlaybackTime()

Gets the current playback time of a block's content.

```typescript
getPlaybackTime(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The playback time of the block in seconds.

### setSoloPlaybackEnabled()

Enables or disables solo playback for a block.
When enabled, only this block's content will play while the rest of the scene remains paused.
```javascript
engine.block.setSoloPlaybackEnabled(videoFill, true);
```

```typescript
setSoloPlaybackEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block or fill to update.
- `enabled` - Whether solo playback should be enabled.

### isSoloPlaybackEnabled()

Checks if solo playback is enabled for a block.
```javascript
engine.block.isSoloPlaybackEnabled(videoFill);
```

```typescript
isSoloPlaybackEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block or fill to query.

**Returns:** Whether solo playback is enabled for this block.

### hasPlaybackControl() *(deprecated)*

Checks if a block has playback controls.

```typescript
hasPlaybackControl(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block has playback control.

### supportsPlaybackControl()

Checks if a block supports playback controls.

```typescript
supportsPlaybackControl(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block supports playback control.

### setLooping()

Sets whether a block's media content should loop.

```typescript
setLooping(id: DesignBlockId, looping: boolean): void
```

**Parameters:**
- `id` - The block or video fill to update.
- `looping` - Whether the block should loop to the beginning or stop.

### isLooping()

Checks if a block's media content is set to loop.

```typescript
isLooping(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block is looping.

### setMuted()

Sets whether the audio of a block is muted.

```typescript
setMuted(id: DesignBlockId, muted: boolean): void
```

**Parameters:**
- `id` - The block or video fill to update.
- `muted` - Whether the audio should be muted.

### isForceMuted()

Checks if a block's audio is muted due to engine rules.

```typescript
isForceMuted(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block is force muted.

### isMuted()

Checks if a block's audio is muted.

```typescript
isMuted(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block is muted.

### setVolume()

Sets the audio volume of a block.

```typescript
setVolume(id: DesignBlockId, volume: number): void
```

**Parameters:**
- `id` - The block or video fill to update.
- `volume` - The desired volume, ranging from 0.0 to 1.0.

### getVolume()

Gets the audio volume of a block.

```typescript
getVolume(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The volume, ranging from 0.0 to 1.0.

### setAudioFadeIn()

Sets an audio fade-in for a block. The audio ramps up from silence to the
block's volume over the given duration at the start of the block.

```typescript
setAudioFadeIn(id: DesignBlockId, duration: number, easing?: AnimationEasing): void
```

**Parameters:**
- `id` - The audio block or video fill to update.
- `duration` - The fade-in duration in seconds. A value of 0 disables the fade-in and negative values are clamped to 0.
- `easing` - The easing curve of the fade. Defaults to 'Linear'.

### setAudioFadeOut()

Sets an audio fade-out for a block. The audio ramps down from the block's
volume to silence over the given duration at the end of the block.

```typescript
setAudioFadeOut(id: DesignBlockId, duration: number, easing?: AnimationEasing): void
```

**Parameters:**
- `id` - The audio block or video fill to update.
- `duration` - The fade-out duration in seconds. A value of 0 disables the fade-out and negative values are clamped to 0.
- `easing` - The easing curve of the fade. Defaults to 'Linear'.

### setPlaybackSpeed()

Sets the playback speed multiplier of a block that supports playback control.
Note: This also adjusts the trim and duration of the block.
Video fills running faster than 3.0x are force muted until reduced to 3.0x or below.

```typescript
setPlaybackSpeed(id: DesignBlockId, speed: number): void
```

**Parameters:**
- `id` - The block or video fill to update.
- `speed` - The desired playback speed multiplier. Valid range is [0.25, 3.0] for audio blocks and
[0.25, infinity) for video fills.

### getPlaybackSpeed()

Gets the playback speed multiplier of a block that supports playback control.

```typescript
getPlaybackSpeed(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The playback speed multiplier.

### forceLoadAVResource()

Forces the loading of a block's audio/video resource.
If the resource failed to load previously, it will be reloaded.

```typescript
forceLoadAVResource(id: DesignBlockId): Promise<void>
```

**Parameters:**
- `id` - The video fill or audio block whose resource should be loaded.

**Returns:** A Promise that resolves once the resource has finished loading.

### unstable_isAVResourceLoaded()

Checks if a block's audio/video resource is loaded.

```typescript
unstable_isAVResourceLoaded(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The video fill or audio block.

**Returns:** The loading state of the resource.

### getAVResourceTotalDuration()

Gets the total duration of a block's audio/video resource.

```typescript
getAVResourceTotalDuration(id: DesignBlockId): number
```

**Parameters:**
- `id` - The video fill or audio block.

**Returns:** The video or audio file duration in seconds.

### getVideoWidth()

Gets the width of a block's video resource.

```typescript
getVideoWidth(id: DesignBlockId): number
```

**Parameters:**
- `id` - The video fill block.

**Returns:** The video width in pixels.

### getVideoHeight()

Gets the height of a block's video resource.

```typescript
getVideoHeight(id: DesignBlockId): number
```

**Parameters:**
- `id` - The video fill block.

**Returns:** The video height in pixels.

### generateVideoThumbnailSequence()

Generate a sequence of thumbnails for the given video fill or design block.
Note: Only one request per block runs at a time. A second request for the same block waits
for the first to finish instead of failing.
Note: For a video fill, cancelling has no effect once the first frame has been scheduled —
the remaining frames are still delivered. Cancel before the first frame arrives, or ignore
results from a request you have abandoned. Design block sequences cancel at any time.

```typescript
generateVideoThumbnailSequence(id: DesignBlockId, thumbnailHeight: number, timeBegin: number, timeEnd: number, numberOfFrames: number, onFrame: (frameIndex: number, result: ImageData | Error) => void): () => void
```

**Parameters:**
- `id` - The video fill or design block.
- `thumbnailHeight` - The height of each thumbnail.
- `timeBegin` - The start time in seconds for the thumbnail sequence.
- `timeEnd` - The end time in seconds for the thumbnail sequence.
- `numberOfFrames` - The number of frames to generate.
- `onFrame` - A callback that receives the frame index and image data.

**Returns:** A function to cancel the thumbnail generation request.

### generateAudioThumbnailSequence()

Generate a thumbnail sequence for the given audio block or video fill.
A thumbnail in this case is a chunk of samples in the range of 0 to 1.
In case stereo data is requested, the samples are interleaved, starting with the left channel.
Note: `numberOfSamples` counts samples per channel. The callback fires
`ceil(numberOfSamples / samplesPerChunk)` times and the last chunk may be shorter.
Note: The `Float32Array` is a view into engine memory that is only valid for the duration of
the callback. Copy it before storing it.

```typescript
generateAudioThumbnailSequence(id: DesignBlockId, samplesPerChunk: number, timeBegin: number, timeEnd: number, numberOfSamples: number, numberOfChannels: number, onChunk: (chunkIndex: number, result: Float32Array | Error) => void): () => void
```

**Parameters:**
- `id` - The audio block or video fill.
- `samplesPerChunk` - The number of samples per chunk.
- `timeBegin` - The start time in seconds for the thumbnail sequence.
- `timeEnd` - The end time in seconds for the thumbnail sequence.
- `numberOfSamples` - The total number of samples to generate.
- `numberOfChannels` - The number of channels in the output (1 for mono, 2 for stereo).
- `onChunk` - A callback that receives the chunk index and sample data.

**Returns:** A function to cancel the thumbnail generation request.

### getVideoFillThumbnail() *(deprecated)*

Generates a thumbnail for a video fill.

```typescript
getVideoFillThumbnail(id: DesignBlockId, thumbnailHeight: number): Promise<Blob>
```

**Parameters:**
- `id` - The video fill.
- `thumbnailHeight` - The height of a thumbnail. The width will be calculated from the video aspect ratio.

**Returns:** A promise that resolves with a thumbnail encoded as a JPEG blob.

### getVideoFillThumbnailAtlas() *(deprecated)*

Generates a thumbnail atlas for a video fill.

```typescript
getVideoFillThumbnailAtlas(id: DesignBlockId, numberOfColumns: number, numberOfRows: number, thumbnailHeight: number): Promise<Blob>
```

**Parameters:**
- `id` - The video fill.
- `numberOfColumns` - The number of columns in the atlas.
- `numberOfRows` - The number of rows in the atlas.
- `thumbnailHeight` - The height of a single thumbnail.

**Returns:** A promise that resolves with a thumbnail atlas encoded as a JPEG blob.

### getPageThumbnailAtlas() *(deprecated)*

Generates a thumbnail atlas for a page.

```typescript
getPageThumbnailAtlas(id: DesignBlockId, numberOfColumns: number, numberOfRows: number, thumbnailHeight: number): Promise<Blob>
```

**Parameters:**
- `id` - The page.
- `numberOfColumns` - The number of columns in the atlas.
- `numberOfRows` - The number of rows in the atlas.
- `thumbnailHeight` - The height of a single thumbnail.

**Returns:** A promise that resolves with a thumbnail atlas encoded as a JPEG blob.

### setNativePixelBuffer()

Updates a pixel stream fill block with a new pixel buffer.

```typescript
setNativePixelBuffer(id: number, buffer: HTMLCanvasElement | HTMLVideoElement): void
```

**Parameters:**
- `id` - The pixel stream fill block.
- `buffer` - A canvas or video element to use as the pixel source.

## Block State

Query the intrinsic state or identity of a block, such as its name, UUID, or lock status.

### getType()

Gets the longhand type of a given block.

```typescript
getType(id: DesignBlockId): ObjectTypeLonghand
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's type.

### setName()

Sets the name of a block.

```typescript
setName(id: DesignBlockId, name: string): void
```

**Parameters:**
- `id` - The block to update.
- `name` - The name to set.

### getName()

Gets the name of a block.

```typescript
getName(id: DesignBlockId): string
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's name.

### getUUID()

Gets the unique universal identifier (UUID) of a block.

```typescript
getUUID(id: DesignBlockId): string
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's UUID.

### isValid()

Checks if a block handle is valid.
A block becomes invalid once it has been destroyed.

```typescript
isValid(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block is valid.

### referencesAnyVariables()

Checks if a block references any variables.
This check does not recurse into children.

```typescript
referencesAnyVariables(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to inspect.

**Returns:** true if the block references variables and false otherwise.

### isIncludedInExport()

Checks if a block is included in exports.

```typescript
isIncludedInExport(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block is included on the exported result, false otherwise.

### setIncludedInExport()

Sets whether a block should be included in exports.

```typescript
setIncludedInExport(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose exportable state should be set.
- `enabled` - If true, the block will be included on the exported result.

### isVisibleAtCurrentPlaybackTime()

Checks if a block is visible at the current scene playback time.

```typescript
isVisibleAtCurrentPlaybackTime(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block should be visible on the canvas at the current playback time.

### getState()

Gets the current state of a block.
A block's state is determined by its own state and that of its shape, fill, and effects.
```javascript
const state = engine.block.getState(block);
```

```typescript
getState(id: DesignBlockId): BlockState
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's state: 'Ready', 'Pending', or 'Error'.

### setState()

Sets the state of a block.
```javascript
engine.block.setState(video, {type: 'Pending', progress: 0.5});
engine.block.setState(page, {type: 'Ready'});
engine.block.setState(image, {type: 'Error', error: 'ImageDecoding'});
```

```typescript
setState(id: DesignBlockId, state: BlockState): void
```

**Parameters:**
- `id` - The block whose state should be set.
- `state` - The new state to set.

## Block Kind

Get and set a block's 'kind' identifier for custom categorization.

### getKind()

Gets the kind of a given block.
```javascript
const kind = engine.block.getKind(block);
```

```typescript
getKind(id: DesignBlockId): string
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's kind.

### setKind()

Sets the kind of a given block, a custom string for categorization of blocks.
```javascript
engine.block.setKind(text, 'title');
```

```typescript
setKind(id: DesignBlockId, kind: string): void
```

**Parameters:**
- `id` - The block whose kind should be changed.
- `kind` - The new kind.

## Block Selection & Visibility

### select()

Selects a block, deselecting all others.

```typescript
select(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block to be selected.

### setSelected()

Sets the selection state of a block.

```typescript
setSelected(id: DesignBlockId, selected: boolean): void
```

**Parameters:**
- `id` - The block to query.
- `selected` - Whether or not the block should be selected.

### isSelected()

Gets the selection state of a block.

```typescript
isSelected(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block is selected, false otherwise.

### findAllSelected()

Finds all currently selected blocks.

```typescript
findAllSelected(): DesignBlockId[]
```

**Returns:** An array of block ids.

### isVisible()

Gets the visibility state of a block.

```typescript
isVisible(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if visible, false otherwise.

### setVisible()

Sets the visibility state of a block.

```typescript
setVisible(id: DesignBlockId, visible: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `visible` - Whether the block shall be visible.

## Block Events

Subscribe to user actions and state changes related to blocks.

### onSelectionChanged()

Subscribes to changes in the selection.

```typescript
onSelectionChanged(callback: () => void): (() => void)
```

**Parameters:**
- `callback` - This function is called at the end of the engine update if the selection has changed.

**Returns:** A method to unsubscribe.

### onClicked()

Subscribes to block click events.

```typescript
onClicked(callback: (id: DesignBlockId) => void): (() => void)
```

**Parameters:**
- `callback` - This function is called at the end of the engine update if a block has been clicked.

**Returns:** A method to unsubscribe.

### onStateChanged()

Subscribes to state changes for a set of blocks.
The state is determined by the block and its associated shape, fill, and effects.
```javascript
const unsubscribe = engine.block.onStateChanged([], (blocks) => {
  blocks.forEach(block => console.log(block));
});
```

```typescript
onStateChanged(ids: DesignBlockId[], callback: (ids: DesignBlockId[]) => void): (() => void)
```

**Parameters:**
- `ids` - A list of block IDs to monitor. If empty, all blocks are monitored.
- `callback` - The function to call when a state changes.

**Returns:** A function to unsubscribe from the event.

## Block Groups

Create and manage groups of blocks.

### isGroupable()

Checks if a set of blocks can be grouped.
A scene block or a block that is already part of a group cannot be grouped.
```javascript
const groupable = engine.block.isGroupable([block1, block2])
```

```typescript
isGroupable(ids: DesignBlockId[]): boolean
```

**Parameters:**
- `ids` - An array of block ids.

**Returns:** Whether the blocks can be grouped together.

### group()

Groups multiple blocks into a new group block.
```javascript
if (engine.block.isGroupable([block1, block2])) {
  const group = engine.block.group(block1, block2]);
}
```

```typescript
group(ids: DesignBlockId[]): DesignBlockId
```

**Parameters:**
- `ids` - A non-empty array of block ids.

**Returns:** The block id of the created group.

### ungroup()

Ungroups a group block, releasing its children.
```javascript
engine.block.ungroup(group);
```

```typescript
ungroup(id: DesignBlockId): void
```

**Parameters:**
- `id` - The group id from a previous call to `group`.

### enterGroup()

Changes selection to a block within a selected group.
Nothing happens if the target is not a group.
```javascript
engine.block.enterGroup(group);
```

```typescript
enterGroup(id: DesignBlockId): void
```

**Parameters:**
- `id` - The group id from a previous call to `group`.

### exitGroup()

Changes selection from a block to its parent group.
Nothing happens if the block is not part of a group.
```javascript
engine.block.exitGroup(member1);
```

```typescript
exitGroup(id: DesignBlockId): void
```

**Parameters:**
- `id` - A block id.

## Block Boolean Operations

Combine multiple blocks into a single new block using boolean path operations.

### isCombinable()

Checks if a set of blocks can be combined using a boolean operation.
Only graphics blocks and text blocks can be combined.
All blocks must have the "lifecycle/duplicate" scope enabled.

```typescript
isCombinable(ids: DesignBlockId[]): boolean
```

**Parameters:**
- `ids` - An array of block ids.

**Returns:** Whether the blocks can be combined.

### combine()

Performs a boolean operation on a set of blocks.
All blocks must be combinable. See `isCombinable`.
The parent, fill and sort order of the new block is that of the prioritized block.

```typescript
combine(ids: DesignBlockId[], op: BooleanOperation): DesignBlockId
```

**Parameters:**
- `ids` - The blocks to combine. They will be destroyed if "lifecycle/destroy" scope is enabled.
- `op` - The boolean operation to perform.

**Returns:** The newly created block or an error.

## Block Exploration

Find blocks by properties like name, type, or kind.

### findByName()

Finds all blocks with a given name.

```typescript
findByName(name: string): DesignBlockId[]
```

**Parameters:**
- `name` - The name to search for.

**Returns:** A list of block ids.

### findByType()

Finds all blocks with a given type.

```typescript
findByType(type: ObjectType): DesignBlockId[]
```

**Parameters:**
- `type` - The type to search for.

**Returns:** A list of block ids.

### findByKind()

Finds all blocks with a given kind.
```javascript
const allTitles = engine.block.findByKind('title');
```

```typescript
findByKind(kind: string): DesignBlockId[]
```

**Parameters:**
- `kind` - The kind to search for.

**Returns:** A list of block ids.

### findAll()

Finds all blocks known to the engine.

```typescript
findAll(): DesignBlockId[]
```

**Returns:** A list of block ids.

### findAllPlaceholders()

Finds all placeholder blocks in the current scene.

```typescript
findAllPlaceholders(): DesignBlockId[]
```

**Returns:** A list of block ids.

### findAllUnused()

Finds all blocks that are not attached to any scene.
A block is considered unused when it has no path to a scene (no scene
reference and no ancestor that belongs to a scene) and is not itself a
scene. Generated blocks and render blocks (fills, effects, shapes, blurs)
are excluded, matching the behaviour of {@link BlockAPI.findAll}.
This is useful for cleanup workflows and for filtering the URIs returned
by {@link EditorAPI.findAllMediaURIs} before relocating resources.

```typescript
findAllUnused(): DesignBlockId[]
```

**Returns:** A list of block ids that are not attached to any scene.

## Block Shapes

Create and configure shape blocks and geometric forms.

### createShape()

Creates a new shape block of a given type.
```javascript
const star = engine.block.createShape('star');
// Longhand shape types are also supported
const rect = engine.block.createShape('//ly.img.ubq/shape/rect');
```

```typescript
createShape(type: ShapeType): DesignBlockId
```

**Parameters:**
- `type` - The type of the shape object that shall be created.

**Returns:** The created shape's handle.

### hasShape() *(deprecated)*

Checks if a block has a shape property.

```typescript
hasShape(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a shape property, an error otherwise.

### supportsShape()

Checks if a block supports having a shape.

```typescript
supportsShape(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a shape property, an error otherwise.

### getShape()

Gets the shape block attached to a given block.

```typescript
getShape(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block whose shape block should be returned.

**Returns:** The block that currently defines the given block's shape.

### setShape()

Sets the shape block for a given block.
Note that the previous shape block is not destroyed automatically.
The new shape is disconnected from its previously attached block.

```typescript
setShape(id: DesignBlockId, shape: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose shape should be changed.
- `shape` - The new shape.

## Block Appearance

Control general appearance, including opacity, blend modes, flipping, and other visual properties.

### isClipped()

Gets the clipped state of a block.
If true, the block should clip its contents to its frame.

```typescript
isClipped(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if clipped, false otherwise.

### setClipped()

Sets the clipped state of a block.

```typescript
setClipped(id: DesignBlockId, clipped: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `clipped` - Whether the block should clips its contents to its frame.

### getFlipHorizontal()

Gets the horizontal flip state of a block.

```typescript
getFlipHorizontal(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** A boolean indicating whether the block is flipped horizontally.

### getFlipVertical()

Gets the vertical flip state of a block.

```typescript
getFlipVertical(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** A boolean indicating whether the block is flipped vertically.

### setFlipHorizontal()

Sets the horizontal flip state of a block.

```typescript
setFlipHorizontal(id: DesignBlockId, flip: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `flip` - If the flip should be enabled.

### setFlipVertical()

Sets the vertical flip state of a block.

```typescript
setFlipVertical(id: DesignBlockId, flip: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `flip` - If the flip should be enabled.

### hasOpacity() *(deprecated)*

Checks if a block has an opacity property.

```typescript
hasOpacity(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has an opacity.

### supportsOpacity()

Checks if a block supports opacity.

```typescript
supportsOpacity(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports opacity.

### setOpacity()

Sets the opacity of a block.

```typescript
setOpacity(id: DesignBlockId, opacity: number): void
```

**Parameters:**
- `id` - The block whose opacity should be set.
- `opacity` - The opacity to be set. The valid range is 0 to 1.

### getOpacity()

Gets the opacity of a block.

```typescript
getOpacity(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose opacity should be queried.

**Returns:** The opacity value.

### hasBlendMode() *(deprecated)*

Checks if a block has a blend mode property.

```typescript
hasBlendMode(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has a blend mode.

### supportsBlendMode()

Checks if a block supports blend modes.

```typescript
supportsBlendMode(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports blend modes.

### setBlendMode()

Sets the blend mode of a block.

```typescript
setBlendMode(id: DesignBlockId, blendMode: BlendMode): void
```

**Parameters:**
- `id` - The block whose blend mode should be set.
- `blendMode` - The blend mode to be set.

### getBlendMode()

Gets the blend mode of a block.

```typescript
getBlendMode(id: DesignBlockId): BlendMode
```

**Parameters:**
- `id` - The block whose blend mode should be queried.

**Returns:** The blend mode.

### hasBackgroundColor() *(deprecated)*

Checks if a block has background color properties.

```typescript
hasBackgroundColor(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has background color properties.

### supportsBackgroundColor()

Checks if a block supports a background color.

```typescript
supportsBackgroundColor(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports a background color.

### setBackgroundColorRGBA() *(deprecated)*

Sets the background color of a block using RGBA values.

```typescript
setBackgroundColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose background color should be set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1.

### getBackgroundColorRGBA() *(deprecated)*

Gets the background color of a block as RGBA values.

```typescript
getBackgroundColorRGBA(id: DesignBlockId): RGBA
```

**Parameters:**
- `id` - The block whose background color should be queried.

**Returns:** The background color.

### setBackgroundColorEnabled()

Enables or disables the background of a block.
```javascript
engine.block.setBackgroundColorEnabled(block, true);
```

```typescript
setBackgroundColorEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose background should be enabled or disabled.
- `enabled` - If true, the background will be enabled.

### isBackgroundColorEnabled()

Checks if the background of a block is enabled.
```javascript
const backgroundColorIsEnabled = engine.block.isBackgroundColorEnabled(block);
```

```typescript
isBackgroundColorEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose background state should be queried.

**Returns:** True, if background is enabled.

## Block Layout

Structure designs by positioning, sizing, layering, aligning, and distributing blocks.

### isTransformLocked()

Gets the transform-locked state of a block.
If true, the block's transform can't be changed.

```typescript
isTransformLocked(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if transform locked, false otherwise.

### isLineOrigin()

Checks whether a graphic block originated as a line shape. Survives the
line's conversion to a vector path during vector-edit; resets only when
the shape is replaced by a non-line shape via `setShape`.

```typescript
isLineOrigin(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block originated as a line shape, false otherwise.

### setTransformLocked()

Sets the transform-locked state of a block.

```typescript
setTransformLocked(id: DesignBlockId, locked: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `locked` - Whether the block's transform should be locked.

### getPositionX()

Gets the X position of a block.

```typescript
getPositionX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The value of the x position.

### getPositionXMode()

Gets the mode for the block's X position.

```typescript
getPositionXMode(id: DesignBlockId): PositionXMode
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current mode for the x position: 'Absolute' or 'Percent'.

### getPositionY()

Gets the Y position of a block.

```typescript
getPositionY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The value of the y position.

### getPositionYMode()

Gets the mode for the block's Y position.

```typescript
getPositionYMode(id: DesignBlockId): PositionYMode
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current mode for the y position: 'Absolute' or 'Percent'.

### setPositionX()

Sets the X position of a block.
The position refers to the block's local space, relative to its parent with the origin at the top left.
```javascript
engine.block.setPositionX(block, 0.25);
```

```typescript
setPositionX(id: DesignBlockId, value: number): void
```

**Parameters:**
- `id` - The block to update.
- `value` - The value of the x position.

### setPositionXMode()

Sets the mode for the block's X position.
```javascript
engine.block.setPositionXMode(block, 'Percent');
```

```typescript
setPositionXMode(id: DesignBlockId, mode: PositionXMode): void
```

**Parameters:**
- `id` - The block to update.
- `mode` - The x position mode: 'Absolute' or 'Percent'.

### setPositionY()

Sets the Y position of a block.
The position refers to the block's local space, relative to its parent with the origin at the top left.
```javascript
engine.block.setPositionY(block, 0.25);
```

```typescript
setPositionY(id: DesignBlockId, value: number): void
```

**Parameters:**
- `id` - The block to update.
- `value` - The value of the y position.

### setPositionYMode()

Sets the mode for the block's Y position.
```javascript
engine.block.setPositionYMode(block, 'Absolute');
```

```typescript
setPositionYMode(id: DesignBlockId, mode: PositionYMode): void
```

**Parameters:**
- `id` - The block to update.
- `mode` - The y position mode: 'Absolute' or 'Percent'.

### setAlwaysOnTop()

Sets a block to always be rendered on top of its siblings.
If true, this block's sorting order is automatically adjusted to be higher than all other siblings without this property.

```typescript
setAlwaysOnTop(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - the block to update.
- `enabled` - whether the block shall be always-on-top.

### setAlwaysOnBottom()

Sets a block to always be rendered below its siblings.
If true, this block's sorting order is automatically adjusted to be lower than all other siblings without this property.

```typescript
setAlwaysOnBottom(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - the block to update.
- `enabled` - whether the block shall always be below its siblings.

### isAlwaysOnTop()

Checks if a block is set to always be on top.

```typescript
isAlwaysOnTop(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - the block to query.

**Returns:** true if the block is set to be always-on-top, false otherwise.

### isAlwaysOnBottom()

Checks if a block is set to always be on the bottom.

```typescript
isAlwaysOnBottom(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - the block to query.

**Returns:** true if the block is set to be always-on-bottom, false otherwise.

### bringToFront()

Brings a block to the front of its siblings.
Updates the sorting order so that the given block has the highest sorting order.

```typescript
bringToFront(id: DesignBlockId): void
```

**Parameters:**
- `id` - The id of the block to bring to the front.

### sendToBack()

Sends a block to the back of its siblings.
Updates the sorting order so that the given block has the lowest sorting order.

```typescript
sendToBack(id: DesignBlockId): void
```

**Parameters:**
- `id` - The id of the block to send to the back.

### bringForward()

Brings a block one layer forward.
Updates the sorting order to be higher than its next sibling.

```typescript
bringForward(id: DesignBlockId): void
```

**Parameters:**
- `id` - The id of the block to bring forward.

### sendBackward()

Sends a block one layer backward.
Updates the sorting order to be lower than its previous sibling.

```typescript
sendBackward(id: DesignBlockId): void
```

**Parameters:**
- `id` - The id of the block to send backward.

### getRotation()

Gets the rotation of a block in radians.

```typescript
getRotation(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The block's rotation around its center in radians.

### setRotation()

Sets the rotation of a block in radians.
Rotation is applied around the block's center.

```typescript
setRotation(id: DesignBlockId, radians: number): void
```

**Parameters:**
- `id` - The block to update.
- `radians` - The new rotation in radians.

### getWidth()

Gets the width of a block in the current width mode.
```javascript
const width = engine.block.getWidth(block);
```

```typescript
getWidth(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The value of the block's width.

### getWidthMode()

Gets the mode for the block's width.
```javascript
const widthMode = engine.block.getWidthMode(block);
```

```typescript
getWidthMode(id: DesignBlockId): WidthMode
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current mode for the width: 'Absolute', 'Percent' or 'Auto'.

### getHeight()

Gets the height of a block in the current height mode.
```javascript
const height = engine.block.getHeight(block);
```

```typescript
getHeight(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The value of the block's height.

### getHeightMode()

Gets the mode for the block's height.
```javascript
const heightMode = engine.block.getHeightMode(block);
```

```typescript
getHeightMode(id: DesignBlockId): HeightMode
```

**Parameters:**
- `id` - The block to query.

**Returns:** The current mode for the height: 'Absolute', 'Percent' or 'Auto'.

### setWidth()

Sets the width of a block in the current width mode.
If the crop is maintained, the crop values will be automatically adjusted.
```javascript
engine.block.setWidth(block, 2.5, true);
```

```typescript
setWidth(id: DesignBlockId, value: number, maintainCrop?: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `value` - The new width of the block.
- `maintainCrop` - Whether or not the crop values, if available, should be automatically adjusted.

### setWidthMode()

Sets the mode for the block's width.
```javascript
engine.block.setWidthMode(block, 'Percent');
```

```typescript
setWidthMode(id: DesignBlockId, mode: WidthMode): void
```

**Parameters:**
- `id` - The block to update.
- `mode` - The width mode: 'Absolute', 'Percent' or 'Auto'.

### setHeight()

Sets the height of a block in the current height mode.
If the crop is maintained, the crop values will be automatically adjusted.
```javascript
engine.block.setHeight(block, 0.5);
engine.block.setHeight(block, 2.5, true);
```

```typescript
setHeight(id: DesignBlockId, value: number, maintainCrop?: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `value` - The new height of the block.
- `maintainCrop` - Whether or not the crop values, if available, should be automatically adjusted.

### setHeightMode()

Sets the mode for the block's height.
```javascript
engine.block.setHeightMode(block, 'Percent');
```

```typescript
setHeightMode(id: DesignBlockId, mode: HeightMode): void
```

**Parameters:**
- `id` - The block to update.
- `mode` - The height mode: 'Absolute', 'Percent' or 'Auto'.

### getFrameX()

Gets the final calculated X position of a block's frame.
The position is only available after an internal update loop.
```javascript
const frameX = engine.block.getFrameX(block);
```

```typescript
getFrameX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The layout position on the x-axis.

### getFrameY()

Gets the final calculated Y position of a block's frame.
The position is only available after an internal update loop.
```javascript
const frameY = engine.block.getFrameY(block);
```

```typescript
getFrameY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The layout position on the y-axis.

### getFrameWidth()

Gets the final calculated width of a block's frame.
The width is only available after an internal update loop.
```javascript
const frameWidth = engine.block.getFrameWidth(block);
```

```typescript
getFrameWidth(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The layout width.

### getFrameHeight()

Gets the final calculated height of a block's frame.
The height is only available after an internal update loop.
```javascript
const frameHeight = engine.block.getFrameHeight(block);
```

```typescript
getFrameHeight(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block to query.

**Returns:** The layout height.

### getGlobalBoundingBoxX()

Gets the X position of the block's global bounding box.
The position is in the scene's global coordinate space, with the origin at the top left.
```javascript
const globalX = engine.block.getGlobalBoundingBoxX(block);
```

```typescript
getGlobalBoundingBoxX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose bounding box should be calculated.

**Returns:** The x coordinate of the axis-aligned bounding box.

### getGlobalBoundingBoxY()

Gets the Y position of the block's global bounding box.
The position is in the scene's global coordinate space, with the origin at the top left.
```javascript
const globalY = engine.block.getGlobalBoundingBoxY(block);
```

```typescript
getGlobalBoundingBoxY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose bounding box should be calculated.

**Returns:** The y coordinate of the axis-aligned bounding box.

### getGlobalBoundingBoxWidth()

Gets the width of the block's global bounding box.
The width is in the scene's global coordinate space.
```javascript
const globalWidth = engine.block.getGlobalBoundingBoxWidth(block);
```

```typescript
getGlobalBoundingBoxWidth(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose bounding box should be calculated.

**Returns:** The width of the axis-aligned bounding box.

### getGlobalBoundingBoxHeight()

Gets the height of the block's global bounding box.
The height is in the scene's global coordinate space.
```javascript
const globalHeight = engine.block.getGlobalBoundingBoxHeight(block);
```

```typescript
getGlobalBoundingBoxHeight(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose bounding box should be calculated.

**Returns:** The height of the axis-aligned bounding box.

### getScreenSpaceBoundingBoxXYWH()

Gets the screen-space bounding box for a set of blocks.
```javascript
const boundingBox = engine.block.getScreenSpaceBoundingBoxXYWH([block]);
```

```typescript
getScreenSpaceBoundingBoxXYWH(ids: DesignBlockId[]): XYWH
```

**Parameters:**
- `ids` - The block to query.

**Returns:** The position and size of the bounding box.

### alignHorizontally()

Aligns blocks horizontally.
Aligns multiple blocks within their bounding box or a single block to its parent.

```typescript
alignHorizontally(ids: DesignBlockId[], horizontalBlockAlignment: TextHorizontalAlignment): void
```

**Parameters:**
- `ids` - A non-empty array of block ids.
- `horizontalBlockAlignment` - How they should be aligned: 'Left', 'Right', or 'Center'.

### alignVertically()

Aligns blocks vertically.
Aligns multiple blocks within their bounding box or a single block to its parent.

```typescript
alignVertically(ids: DesignBlockId[], verticalBlockAlignment: TextVerticalAlignment): void
```

**Parameters:**
- `ids` - A non-empty array of block ids.
- `verticalBlockAlignment` - How they should be aligned: 'Top', 'Bottom', or 'Center'.

### distributeHorizontally()

Distributes blocks horizontally with even spacing.
Distributes multiple blocks horizontally within their bounding box.

```typescript
distributeHorizontally(ids: DesignBlockId[]): void
```

**Parameters:**
- `ids` - A non-empty array of block ids.

### distributeVertically()

Distributes blocks vertically with even spacing.
Distributes multiple blocks vertically within their bounding box.

```typescript
distributeVertically(ids: DesignBlockId[]): void
```

**Parameters:**
- `ids` - A non-empty array of block ids.

### fillParent()

Resizes and positions a block to fill its parent.
The crop values of the block are reset if it can be cropped.

```typescript
fillParent(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block that should fill its parent.

### resizeContentAware()

Resizes blocks while adjusting content to fit.
The content of the blocks is automatically adjusted to fit the new dimensions.
Full-page blocks are resized to remain as full-page afterwards, while the blocks that are not full-page get resized as a group to the same scale factor and centered.
```javascript
const pages = engine.scene.getPages();
engine.block.resizeContentAware(pages, width: 100.0, 100.0);
```

```typescript
resizeContentAware(ids: DesignBlockId[], width: number, height: number): void
```

**Parameters:**
- `ids` - The blocks to resize.
- `width` - The new width of the blocks.
- `height` - The new height of the blocks.

### scale()

Scales a block and its children proportionally.
This updates the position, size and style properties (e.g. stroke width) of
the block and its children around the specified anchor point.
```javascript
// Scale a block to double its size, anchored at the center.
engine.block.scale(block, 2.0, 0.5, 0.5);
```

```typescript
scale(id: DesignBlockId, scale: number, anchorX?: number, anchorY?: number): void
```

**Parameters:**
- `id` - The block that should be scaled.
- `scale` - The scale factor to be applied to the current properties of the block.
- `anchorX` - The relative position along the width of the block around which the scaling should occur (0=left, 0.5=center, 1=right). Defaults to 0.
- `anchorY` - The relative position along the height of the block around which the scaling should occur (0=top, 0.5=center, 1=bottom). Defaults to 0.

## Helper

Convenient high-level functions that combine multiple operations into single, easy-to-use methods for common tasks like adding media, applying effects, and positioning blocks.

### setSize()

Update a block's size.

```typescript
setSize(id: DesignBlockId, width: number, height: number, options?: {
        maintainCrop?: boolean;
        sizeMode?: SizeMode;
    }): void
```

**Parameters:**
- `id` - The block to update.
- `width` - The new width of the block.
- `height` - The new height of the block.
- `options` - Optional parameters for the size. Properties:
  - `maintainCrop` - Whether or not the crop values, if available, should be automatically adjusted.
  - `sizeMode` - The size mode: Absolute, Percent or Auto.

### setPosition()

Update a block's position.

```typescript
setPosition(id: DesignBlockId, x: number, y: number, options?: {
        positionMode?: PositionMode;
    }): void
```

**Parameters:**
- `id` - The block to update.
- `x` - The new x position of the block.
- `y` - The new y position of the block.
- `options` - Optional parameters for the position. Properties:
  - `positionMode` - The position mode: absolute, percent or undefined.

### addImage()

Adds an image to the current page. The image will be automatically loaded
and sized appropriately. In Video mode, timeline and animation options can be applied.

```typescript
addImage(url: string, options?: AddImageOptions): Promise<DesignBlockId>
```

**Parameters:**
- `url` - URL or path to the image file
- `options` - Configuration options for the image

**Returns:** Promise that resolves to the ID of the created image block

### addVideo()

Adds a video block to the current scene page. The video will be positioned and sized
according to the provided parameters. Timeline and animation effects can be applied.

```typescript
addVideo(url: string, width: number, height: number, options?: AddVideoOptions): Promise<DesignBlockId>
```

**Parameters:**
- `url` - URL or path to the video file
- `width` - Width of the video in scene design units
- `height` - Height of the video in scene design units
- `options` - Configuration options for the video

**Returns:** Promise that resolves to the ID of the created video block

### applyAnimation()

Applies an animation to a block.

```typescript
applyAnimation(block: DesignBlockId, animation?: AnimationOptions): void
```

**Parameters:**
- `block` - The ID of the block to apply the animation to
- `animation` - The animation configuration options

### applyDropShadow()

Applies a drop shadow effect to any block.

```typescript
applyDropShadow(block: DesignBlockId, options?: DropShadowOptions): void
```

**Parameters:**
- `block` - The ID of the block to apply the shadow to
- `options` - Shadow configuration options. If not provided, enables shadow with default settings

### generateThumbnailAtTimeOffset()

Generates a thumbnail image of the scene at a specific time.

```typescript
generateThumbnailAtTimeOffset(height: number, time: number): Promise<Blob>
```

**Parameters:**
- `height` - Height of the thumbnail in scene design units (maximum 512)
- `time` - Time position in seconds to capture the thumbnail

**Returns:** Promise that resolves to a Blob containing the PNG thumbnail image

### getBackgroundTrack()

Gets the background track of the current scene.
The background track is the track that determines the page duration.

```typescript
getBackgroundTrack(): DesignBlockId | null
```

**Returns:** The ID of the background track, or null if none exists

### moveToBackgroundTrack()

Moves a block to the background track.
This is useful for organizing content in video scenes where you want
certain elements to be part of the background layer.
The background track is the track that determines the page duration.
If no background track exists, one will be created automatically.

```typescript
moveToBackgroundTrack(block: DesignBlockId): void
```

**Parameters:**
- `block` - The ID of the block to move to the background track

## Block Hierarchies

Manage parent-child relationships and the scene graph structure.

### getParent()

Gets the parent of a block.

```typescript
getParent(id: DesignBlockId): DesignBlockId | null
```

**Parameters:**
- `id` - The block to query.

**Returns:** The parent's handle or null if the block has no parent.

### getChildren()

Gets all direct children of a block.
Children are sorted in their rendering order: Last child is rendered in front of other children.

```typescript
getChildren(id: DesignBlockId): DesignBlockId[]
```

**Parameters:**
- `id` - The block to query.

**Returns:** A list of block ids.

### insertChild()

Inserts a child block at a specific index.

```typescript
insertChild(parent: DesignBlockId, child: DesignBlockId, index: number): void
```

**Parameters:**
- `parent` - The block whose children should be updated.
- `child` - The child to insert. Can be an existing child of `parent`.
- `index` - The index to insert or move to.

### appendChild()

Appends a child block to a parent.

```typescript
appendChild(parent: DesignBlockId, child: DesignBlockId): void
```

**Parameters:**
- `parent` - The block whose children should be updated.
- `child` - The child to insert. Can be an existing child of `parent`.

## Block Utils

Check block capabilities like alignability or distributability.

### isAlignable()

Checks if a set of blocks can be aligned.

```typescript
isAlignable(ids: DesignBlockId[]): boolean
```

**Parameters:**
- `ids` - An array of block ids.

**Returns:** Whether the blocks can be aligned.

### isDistributable()

Checks if a set of blocks can be distributed.

```typescript
isDistributable(ids: DesignBlockId[]): boolean
```

**Parameters:**
- `ids` - An array of block ids.

**Returns:** Whether the blocks can be distributed.

## Block Properties

Get and set any block property by name using low-level, generic accessors.

### findAllProperties()

Gets all available properties of a block.

```typescript
findAllProperties(id: DesignBlockId): string[]
```

**Parameters:**
- `id` - The block whose properties should be queried.

**Returns:** A list of the property names.

### isPropertyReadable()

Checks if a property is readable.

```typescript
isPropertyReadable(property: string): boolean
```

**Parameters:**
- `property` - The name of the property to check.

**Returns:** Whether the property is readable. Returns false for unknown properties.

### isPropertyWritable()

Checks if a property is writable.

```typescript
isPropertyWritable(property: string): boolean
```

**Parameters:**
- `property` - The name of the property to check.

**Returns:** Whether the property is writable. Returns false for unknown properties.

### getPropertyType()

Gets the type of a property by its name.

```typescript
getPropertyType(property: string): PropertyType
```

**Parameters:**
- `property` - The name of the property whose type should be queried.

**Returns:** The property type.

### getEnumValues<T = string>()

Gets all possible values of an enum property.

```typescript
getEnumValues<T = string>(enumProperty: string): T[]
```

**Parameters:**
- `enumProperty` - The name of the property whose enum values should be queried.

**Returns:** A list of the enum value names as a string array.

### setBool()

Sets a boolean property on a block.
```javascript
engine.block.setBool(scene, 'scene/aspectRatioLock', false);
```

```typescript
setBool(id: DesignBlockId, property: BoolPropertyName, value: boolean): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getBool()

Gets a boolean property from a block.
```javascript
engine.block.getBool(scene, 'scene/aspectRatioLock');
```

```typescript
getBool(id: DesignBlockId, property: BoolPropertyName): boolean
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setInt()

Sets an integer property on a block.
```javascript
engine.block.setInt(starShape, 'shape/star/points', points + 2);
```

```typescript
setInt(id: DesignBlockId, property: IntPropertyName, value: number): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getInt()

Gets an integer property from a block.
```javascript
engine.block.setInt(starShape, 'shape/star/points', points + 2);
```

```typescript
getInt(id: DesignBlockId, property: IntPropertyName): number
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setFloat()

Sets a float property on a block.
```javascript
engine.block.setFloat(text, "text/letterSpacing", 0.2);
engine.block.setFloat(text, "text/lineHeight", 1.2);
```

```typescript
setFloat(id: DesignBlockId, property: FloatPropertyName, value: number): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getFloat()

Gets a float property from a block.
```javascript
engine.block.getFloat(starShape, 'shape/star/innerDiameter');
```

```typescript
getFloat(id: DesignBlockId, property: FloatPropertyName): number
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setDouble()

Sets a double-precision float property on a block.
```javascript
engine.block.setDouble(audio, 'playback/duration', 1.0);
```

```typescript
setDouble(id: DesignBlockId, property: DoublePropertyName, value: number): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getDouble()

Gets a double-precision float property from a block.
```javascript
engine.block.getDouble(audio, 'playback/duration');
```

```typescript
getDouble(id: DesignBlockId, property: DoublePropertyName): number
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setString()

Sets a string property on a block.
```javascript
engine.block.setString(text, 'text/text', 'Hello World');
engine.block.setString(imageFill, 'fill/image/imageFileURI', 'https://example.com/sample.jpg');
```

```typescript
setString(id: DesignBlockId, property: StringPropertyName, value: string): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getString()

Gets a string property from a block.
```javascript
engine.block.getString(text, 'text/text');
engine.block.getString(imageFill, 'fill/image/imageFileURI');
```

```typescript
getString(id: DesignBlockId, property: StringPropertyName): string
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setColor()

Sets a color property on a block.
```javascript
// Set the block's fill color to white.
engine.block.setColor(colorFill, 'fill/color/value', { r: 1, g: 1, b: 1, a: 1 });
```

```typescript
setColor(id: DesignBlockId, property: ColorPropertyName, value: Color): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The value to set.

### getColor()

Gets a color property from a block.
```javascript
engine.block.getColor(colorFill, 'fill/color/value');
```

```typescript
getColor(id: DesignBlockId, property: ColorPropertyName): Color
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value of the property.

### setColorRGBA() *(deprecated)*

Sets a color property on a block using RGBA values.

```typescript
setColorRGBA(id: DesignBlockId, property: string, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1. Defaults to 1.

### getColorRGBA() *(deprecated)*

Gets a color property from a block as RGBA values.

```typescript
getColorRGBA(id: DesignBlockId, property: string): RGBA
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** A tuple of channels red, green, blue and alpha in the range of 0 to 1.

### setColorSpot() *(deprecated)*

Sets a spot color property on a block.

```typescript
setColorSpot(id: DesignBlockId, property: string, name: string, tint?: number): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `name` - The name of the spot color.
- `tint` - The tint factor in the range of 0 to 1. Defaults to 1.

### getColorSpotName() *(deprecated)*

Gets the spot color name from a color property.

```typescript
getColorSpotName(id: DesignBlockId, property: string): string
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The name of the spot color.

### getColorSpotTint() *(deprecated)*

Gets the spot color tint from a color property.

```typescript
getColorSpotTint(id: DesignBlockId, property: string): number
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The tint factor of the spot color.

### setEnum<T extends keyof BlockEnumType>()

Sets an enum property on a block.
```javascript
engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
engine.block.setEnum(text, 'text/verticalAlignment', 'Center');
```

```typescript
setEnum<T extends keyof BlockEnumType>(id: DesignBlockId, property: T, value: BlockEnumType[T]): void
```

**Parameters:**
- `id` - The block whose property should be set.
- `property` - The name of the property to set.
- `value` - The enum value as a string.

### getEnum<T extends keyof BlockEnumType>()

Gets an enum property from a block.
```javascript
engine.block.getEnum(text, 'text/horizontalAlignment');
engine.block.getEnum(text, 'text/verticalAlignment');
```

```typescript
getEnum<T extends keyof BlockEnumType>(id: DesignBlockId, property: T): BlockEnumType[T]
```

**Parameters:**
- `id` - The block whose property should be queried.
- `property` - The name of the property to query.

**Returns:** The value as a string.

## Block Crop

Crop, scale, translate, and transform block content.

### hasCrop() *(deprecated)*

Checks if a block has crop properties.

```typescript
hasCrop(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block has crop properties.

### supportsCrop()

Checks if a block supports cropping.
```javascript
engine.block.supportsCrop(image);
```

```typescript
supportsCrop(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** true, if the block supports cropping.

### setCropScaleX()

Sets the horizontal crop scale of a block.
```javascript
engine.block.setCropScaleX(image, 2.0);
```

```typescript
setCropScaleX(id: DesignBlockId, scaleX: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `scaleX` - The scale in x direction.

### setCropScaleY()

Sets the vertical crop scale of a block.
```javascript
engine.block.setCropScaleY(image, 1.5);
```

```typescript
setCropScaleY(id: DesignBlockId, scaleY: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `scaleY` - The scale in y direction.

### setCropRotation()

Sets the crop rotation of a block in radians.
```javascript
engine.block.setCropRotation(image, Math.PI);
```

```typescript
setCropRotation(id: DesignBlockId, rotation: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `rotation` - The rotation in radians.

### setCropScaleRatio()

Sets the uniform crop scale ratio of a block.
This scales the content up or down from the center of the crop frame.
```javascript
engine.block.setCropScaleRatio(image, 3.0);
```

```typescript
setCropScaleRatio(id: DesignBlockId, scaleRatio: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `scaleRatio` - The crop scale ratio.

### setCropTranslationX()

Sets the horizontal crop translation of a block in percentage of the crop frame width.
```javascript
engine.block.setCropTranslationX(image, -1.0);
```

```typescript
setCropTranslationX(id: DesignBlockId, translationX: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `translationX` - The translation in x direction.

### setCropTranslationY()

Sets the vertical crop translation of a block in percentage of the crop frame height.
```javascript
engine.block.setCropTranslationY(image, 1.0);
```

```typescript
setCropTranslationY(id: DesignBlockId, translationY: number): void
```

**Parameters:**
- `id` - The block whose crop should be set.
- `translationY` - The translation in y direction.

### resetCrop()

Resets the crop of a block to its default state.
The block's content fill mode is set to 'Cover'.
```javascript
engine.block.resetCrop(image);
```

```typescript
resetCrop(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose crop should be reset.

### getCropScaleX()

Gets the horizontal crop scale of a block.
```javascript
const scaleX = engine.block.getCropScaleX(image);
```

```typescript
getCropScaleX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose scale should be queried.

**Returns:** The scale on the x axis.

### getCropScaleY()

Gets the vertical crop scale of a block.
```javascript
const scaleY = engine.block.getCropScaleY(image);
```

```typescript
getCropScaleY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose scale should be queried.

**Returns:** The scale on the y axis.

### getCropRotation()

Gets the crop rotation of a block in radians.
```javascript
const cropRotation = engine.block.getCropRotation(image);
```

```typescript
getCropRotation(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose crop rotation should be queried.

**Returns:** The crop rotation in radians.

### getCropScaleRatio()

Gets the uniform crop scale ratio of a block.
```javascript
const cropScaleRatio = engine.block.getCropScaleRatio(image);
```

```typescript
getCropScaleRatio(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose crop scale ratio should be queried.

**Returns:** The crop scale ratio.

### getCropTranslationX()

Gets the horizontal crop translation of a block in percentage of the crop frame width.
```javascript
const cropTranslationX = engine.block.getCropTranslationX(image);
```

```typescript
getCropTranslationX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose translation should be queried.

**Returns:** The translation on the x axis.

### getCropTranslationY()

Gets the vertical crop translation of a block in percentage of the crop frame height.
```javascript
const cropTranslationY = engine.block.getCropTranslationY(image);
```

```typescript
getCropTranslationY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose translation should be queried.

**Returns:** The translation on the y axis.

### adjustCropToFillFrame()

Adjusts the crop position and scale of the given image block to fill its crop frame, while maintaining the position and size of the crop frame.
```javascript
const adjustedScaleRatio = engine.block.adjustCropToFillFrame(image, 1.0);
```

```typescript
adjustCropToFillFrame(id: DesignBlockId, minScaleRatio: number): number
```

**Parameters:**
- `id` - The block whose crop should be adjusted.
- `minScaleRatio` - The minimal crop scale ratio to use.

**Returns:** The adjusted scale ratio.

### flipCropHorizontal()

Flips the content horizontally within its crop frame.
```javascript
engine.block.flipCropHorizontal(image);
```

```typescript
flipCropHorizontal(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose crop should be updated.

### flipCropVertical()

Flips the content vertically within its crop frame.
```javascript
engine.block.flipCropVertical(image);
```

```typescript
flipCropVertical(id: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose crop should be updated.

### isCropAspectRatioLocked()

Checks if the crop aspect ratio is locked for a block.
When locked, crop handles will maintain the current aspect ratio during resize.
```javascript
const isLocked = engine.block.isCropAspectRatioLocked(block);
```

```typescript
isCropAspectRatioLocked(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if aspect ratio is locked, false otherwise.

### setCropAspectRatioLocked()

Sets whether the crop aspect ratio should be locked for a block.
When enabled, crop handles will maintain the current aspect ratio.
When disabled, free resizing is allowed.
```javascript
engine.block.setCropAspectRatioLocked(block, true);
```

```typescript
setCropAspectRatioLocked(id: DesignBlockId, locked: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `locked` - Whether aspect ratio should be locked.

### canRevertToOriginalRatio()

Checks whether the "Original" crop preset (`ContentAspectRatio`) can be applied to a block.
This runs the same preliminary check the apply path performs: it resolves the intrinsic
content dimensions from the block's image/video fill (an image fill resolves only from its
`sourceSet`; a video fill resolves from its `sourceSet` or the first decoded frame). Use it
to gate UI that would otherwise call the preset and fail — e.g. an unreplaced placeholder
image fill with an empty `sourceSet`.
```javascript
const canRevert = engine.block.canRevertToOriginalRatio(block);
```

```typescript
canRevertToOriginalRatio(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the preset would resolve, false if it cannot (no/placeholder fill, empty
sourceSet, video not yet decoded, or unsupported fill type).

## Block Effects

Create, manage, and apply various visual effects to blocks.

### createEffect()

Creates a new effect block.

```typescript
createEffect(type: EffectType): DesignBlockId
```

**Parameters:**
- `type` - The type of the effect.

**Returns:** The created effect's handle.

### hasEffects() *(deprecated)*

Checks if a block supports effects.

```typescript
hasEffects(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block can render effects, false otherwise.

### supportsEffects()

Checks if a block supports effects.

```typescript
supportsEffects(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block can render effects, false otherwise.

### getEffects()

Gets all effects attached to a block.

```typescript
getEffects(id: DesignBlockId): DesignBlockId[]
```

**Parameters:**
- `id` - The block to query.

**Returns:** A list of effects or an error, if the block doesn't support effects.

### insertEffect()

Inserts an effect into a block's effect list at a given index.

```typescript
insertEffect(id: DesignBlockId, effectId: DesignBlockId, index: number): void
```

**Parameters:**
- `id` - The block to update.
- `effectId` - The effect to insert.
- `index` - The index at which the effect shall be inserted.

### appendEffect()

Appends an effect to a block's effect list.

```typescript
appendEffect(id: DesignBlockId, effectId: DesignBlockId): void
```

**Parameters:**
- `id` - The block to append the effect to.
- `effectId` - The effect to append.

### removeEffect()

Removes an effect from a block's effect list at a given index.

```typescript
removeEffect(id: DesignBlockId, index: number): void
```

**Parameters:**
- `id` - The block to remove the effect from.
- `index` - The index where the effect is stored.

### hasEffectEnabled() *(deprecated)*

Checks if an effect block can be enabled or disabled.

```typescript
hasEffectEnabled(effectId: DesignBlockId): boolean
```

**Parameters:**
- `effectId` - The 'effect' block to query.

**Returns:** True, if the block supports enabling and disabling, false otherwise.

### setEffectEnabled()

Sets the enabled state of an effect block.
```javascript
engine.block.setEffectEnabled(effects[0], false);
```

```typescript
setEffectEnabled(effectId: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `effectId` - The 'effect' block to update.
- `enabled` - The new state.

### isEffectEnabled()

Queries if an effect block is enabled.
```javascript
engine.block.isEffectEnabled(effects[0]);
```

```typescript
isEffectEnabled(effectId: DesignBlockId): boolean
```

**Parameters:**
- `effectId` - The 'effect' block to query.

**Returns:** True, if the effect is enabled. False otherwise.

## Block Blur

Apply and configure blur effects on blocks.

### createBlur()

Creates a new blur block.

```typescript
createBlur(type: BlurType): DesignBlockId
```

**Parameters:**
- `type` - The type of blur.

**Returns:** The handle of the newly created blur.

### hasBlur() *(deprecated)*

Checks if a block supports blur.

```typescript
hasBlur(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports blur.

### supportsBlur()

Checks if a block supports blur.

```typescript
supportsBlur(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports blur.

### setBlur()

Sets the blur effect for a block.

```typescript
setBlur(id: DesignBlockId, blurId: DesignBlockId): void
```

**Parameters:**
- `id` - The block to update.
- `blurId` - A 'blur' block to apply.

### getBlur()

Gets the blur block of a given design block.

```typescript
getBlur(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block to query.

**Returns:** The 'blur' block.

### setBlurEnabled()

Enables or disables the blur effect on a block.
```javascript
engine.block.setBlurEnabled(block, true);
```

```typescript
setBlurEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block to update.
- `enabled` - The new enabled value.

### isBlurEnabled()

Checks if blur is enabled for a block.
```javascript
const isBlurEnabled = engine.block.isBlurEnabled(block);
```

```typescript
isBlurEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the blur is enabled. False otherwise.

## Block Strokes

Control stroke appearance, including color, width, style, and position.

### hasStroke() *(deprecated)*

Checks if a block has a stroke property.

```typescript
hasStroke(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block has a stroke property.

### supportsStroke()

Checks if a block supports a stroke.

```typescript
supportsStroke(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block supports a stroke.

### setStrokeEnabled()

Enables or disables the stroke of a block.
```javascript
engine.block.setStrokeEnabled(block, true);
```

```typescript
setStrokeEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose stroke should be enabled or disabled.
- `enabled` - If true, the stroke will be enabled.

### isStrokeEnabled()

Checks if the stroke of a block is enabled.
```javascript
const strokeIsEnabled = engine.block.isStrokeEnabled(block);
```

```typescript
isStrokeEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose stroke state should be queried.

**Returns:** True if the block's stroke is enabled.

### setStrokeOverprint()

Marks the stroke of a block as overprint for PDF export.
The flag is only honored by the PDF writer when the stroke uses a spot color
(Separation/DeviceN). For process-color strokes it is a silent no-op. On-screen
rendering ignores the flag.
```javascript
engine.block.setStrokeOverprint(block, true);
```

```typescript
setStrokeOverprint(id: DesignBlockId, overprint: boolean): void
```

**Parameters:**
- `id` - The block whose stroke overprint flag should be set.
- `overprint` - If true, the stroke is marked as overprint in exported PDFs.

### getStrokeOverprint()

Queries whether the stroke of a block is marked as overprint for PDF export.
```javascript
const overprint = engine.block.getStrokeOverprint(block);
```

```typescript
getStrokeOverprint(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose stroke overprint flag should be queried.

**Returns:** The stroke overprint flag.

### setStrokeColorRGBA() *(deprecated)*

Sets the stroke color of a block using RGBA values.

```typescript
setStrokeColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose stroke color should be set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1.

### setStrokeColor()

Sets the stroke color of a block.

```typescript
setStrokeColor(id: DesignBlockId, color: Color): void
```

**Parameters:**
- `id` - The block whose stroke color should be set.
- `color` - The color to set.

### getStrokeColorRGBA() *(deprecated)*

Gets the stroke color of a block as RGBA values.

```typescript
getStrokeColorRGBA(id: DesignBlockId): RGBA
```

**Parameters:**
- `id` - The block whose stroke color should be queried.

**Returns:** The stroke color.

### getStrokeColor()

Gets the stroke color of a block.

```typescript
getStrokeColor(id: DesignBlockId): Color
```

**Parameters:**
- `id` - The block whose stroke color should be queried.

**Returns:** The stroke color.

### setStrokeWidth()

Sets the stroke width of a block.

```typescript
setStrokeWidth(id: DesignBlockId, width: number): void
```

**Parameters:**
- `id` - The block whose stroke width should be set.
- `width` - The stroke width to be set.

### getStrokeWidth()

Gets the stroke width of a block.

```typescript
getStrokeWidth(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose stroke width should be queried.

**Returns:** The stroke's width.

### setStrokeStyle()

Sets the stroke style of a block.

```typescript
setStrokeStyle(id: DesignBlockId, style: StrokeStyle): void
```

**Parameters:**
- `id` - The block whose stroke style should be set.
- `style` - The stroke style to be set.

### getStrokeStyle()

Gets the stroke style of a block.

```typescript
getStrokeStyle(id: DesignBlockId): StrokeStyle
```

**Parameters:**
- `id` - The block whose stroke style should be queried.

**Returns:** The stroke's style.

### setStrokePosition()

Sets the stroke position of a block.

```typescript
setStrokePosition(id: DesignBlockId, position: StrokePosition): void
```

**Parameters:**
- `id` - The block whose stroke position should be set.
- `position` - The stroke position to be set.

### getStrokePosition()

Gets the stroke position of a block.

```typescript
getStrokePosition(id: DesignBlockId): StrokePosition
```

**Parameters:**
- `id` - The block whose stroke position should be queried.

**Returns:** The stroke position.

### setStrokeCornerGeometry()

Sets the stroke corner geometry of a block.

```typescript
setStrokeCornerGeometry(id: DesignBlockId, cornerGeometry: StrokeCornerGeometry): void
```

**Parameters:**
- `id` - The block whose stroke corner geometry should be set.
- `cornerGeometry` - The stroke corner geometry to be set.

### getStrokeCornerGeometry()

Gets the stroke corner geometry of a block.

```typescript
getStrokeCornerGeometry(id: DesignBlockId): StrokeCornerGeometry
```

**Parameters:**
- `id` - The block whose stroke corner geometry should be queried.

**Returns:** The stroke corner geometry.

### setStrokeCap() *(deprecated)*

Sets the stroke cap of a block. Writes both the start and end caps to the
same value.

```typescript
setStrokeCap(id: DesignBlockId, cap: StrokeCap): void
```

**Parameters:**
- `id` - The block whose stroke cap should be set.
- `cap` - The stroke cap to be set.

### getStrokeCap() *(deprecated)*

Gets the legacy single stroke cap of a block. Tracks the value last written
via `setStrokeCap` or `setStrokeStartCap`; ignores changes made via
`setStrokeEndCap`.

```typescript
getStrokeCap(id: DesignBlockId): StrokeCap
```

**Parameters:**
- `id` - The block whose stroke cap should be queried.

**Returns:** The stroke cap.

### setStrokeStartCap()

Sets the cap geometry at the start of an open stroked path. Use this with
`setStrokeEndCap` to set distinct caps for each end of a stroke (for
example a flat start with an arrowhead end). `setStrokeCap` continues to
set both ends at once and is preserved for backwards compatibility.

```typescript
setStrokeStartCap(id: DesignBlockId, cap: StrokeCap): void
```

**Parameters:**
- `id` - The block whose stroke start cap should be set.
- `cap` - The cap geometry to use at the path start.

### getStrokeStartCap()

Gets the cap geometry at the start of an open stroked path.

```typescript
getStrokeStartCap(id: DesignBlockId): StrokeCap
```

**Parameters:**
- `id` - The block whose stroke start cap should be queried.

**Returns:** The start cap.

### setStrokeEndCap()

Sets the cap geometry at the end of an open stroked path. Use this with
`setStrokeStartCap` to set distinct caps for each end of a stroke.

```typescript
setStrokeEndCap(id: DesignBlockId, cap: StrokeCap): void
```

**Parameters:**
- `id` - The block whose stroke end cap should be set.
- `cap` - The cap geometry to use at the path end.

### getStrokeEndCap()

Gets the cap geometry at the end of an open stroked path.

```typescript
getStrokeEndCap(id: DesignBlockId): StrokeCap
```

**Parameters:**
- `id` - The block whose stroke end cap should be queried.

**Returns:** The end cap.

### setStrokeDashStartCap()

Sets the cap geometry at the leading edge of each dash piece (excluding the
line's actual start). Only takes effect when a dash pattern is active.
Distinct from `setStrokeStartCap`, which only applies to the start of the
open path itself.

```typescript
setStrokeDashStartCap(id: DesignBlockId, cap: StrokeCap): void
```

**Parameters:**
- `id` - The block whose dash start cap should be set.
- `cap` - The cap geometry to use at the leading edge of each dash piece.

### getStrokeDashStartCap()

Gets the cap geometry at the leading edge of each dash piece.

```typescript
getStrokeDashStartCap(id: DesignBlockId): StrokeCap
```

**Parameters:**
- `id` - The block whose dash start cap should be queried.

**Returns:** The dash start cap.

### setStrokeDashEndCap()

Sets the cap geometry at the trailing edge of each dash piece (excluding the
line's actual end). Only takes effect when a dash pattern is active. Distinct
from `setStrokeEndCap`, which only applies to the end of the open path itself.

```typescript
setStrokeDashEndCap(id: DesignBlockId, cap: StrokeCap): void
```

**Parameters:**
- `id` - The block whose dash end cap should be set.
- `cap` - The cap geometry to use at the trailing edge of each dash piece.

### getStrokeDashEndCap()

Gets the cap geometry at the trailing edge of each dash piece.

```typescript
getStrokeDashEndCap(id: DesignBlockId): StrokeCap
```

**Parameters:**
- `id` - The block whose dash end cap should be queried.

**Returns:** The dash end cap.

### setStrokeDashArray()

Sets a custom dash pattern for the block's stroke. Semantics match SVG's
`stroke-dasharray`: alternating on/off lengths in design-unit space. When the
pattern is non-empty it overrides the preset implied by `StrokeStyle`. Pass an
empty array to fall back to the preset.

```typescript
setStrokeDashArray(id: DesignBlockId, dashArray: number[]): void
```

**Parameters:**
- `id` - The block whose stroke dash pattern should be set.
- `dashArray` - Alternating on/off lengths. Odd-length arrays are doubled to
  an even length, matching SVG behaviour.

### getStrokeDashArray()

Gets the custom dash pattern of the block's stroke.

```typescript
getStrokeDashArray(id: DesignBlockId): number[]
```

**Parameters:**
- `id` - The block whose stroke dash pattern should be queried.

**Returns:** The dash pattern, or an empty array if no custom pattern is set.

### setStrokeDashOffset()

Sets the dash offset of the block's stroke. Semantics match SVG's
`stroke-dashoffset`. Ignored when the custom dash pattern is empty.

```typescript
setStrokeDashOffset(id: DesignBlockId, dashOffset: number): void
```

**Parameters:**
- `id` - The block whose stroke dash offset should be set.
- `dashOffset` - The dash offset in design-unit space.

### getStrokeDashOffset()

Gets the dash offset of the block's stroke.

```typescript
getStrokeDashOffset(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose stroke dash offset should be queried.

**Returns:** The dash offset.

## Block Drop Shadow

Configure drop shadow effects, including blur, color, and offset.

### hasDropShadow() *(deprecated)*

Checks if a block has a drop shadow property.

```typescript
hasDropShadow(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block has a drop shadow property.

### supportsDropShadow()

Checks if a block supports a drop shadow.

```typescript
supportsDropShadow(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True if the block supports a drop shadow.

### setDropShadowEnabled()

Enables or disables the drop shadow of a block.
```javascript
engine.block.setDropShadowEnabled(block, true);
```

```typescript
setDropShadowEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose drop shadow should be enabled or disabled.
- `enabled` - If true, the drop shadow will be enabled.

### isDropShadowEnabled()

Checks if the drop shadow of a block is enabled.
```javascript
const dropShadowIsEnabled = engine.block.isDropShadowEnabled(block);
```

```typescript
isDropShadowEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose drop shadow state should be queried.

**Returns:** True if the block's drop shadow is enabled.

### setDropShadowColorRGBA() *(deprecated)*

Sets the drop shadow color of a block using RGBA values.

```typescript
setDropShadowColorRGBA(id: DesignBlockId, r: number, g: number, b: number, a?: number): void
```

**Parameters:**
- `id` - The block whose drop shadow color should be set.
- `r` - The red color component in the range of 0 to 1.
- `g` - The green color component in the range of 0 to 1.
- `b` - The blue color component in the range of 0 to 1.
- `a` - The alpha color component in the range of 0 to 1.

### setDropShadowColor()

Sets the drop shadow color of a block.

```typescript
setDropShadowColor(id: DesignBlockId, color: Color): void
```

**Parameters:**
- `id` - The block whose drop shadow color should be set.
- `color` - The color to set.

### getDropShadowColorRGBA() *(deprecated)*

Gets the drop shadow color of a block as RGBA values.

```typescript
getDropShadowColorRGBA(id: DesignBlockId): RGBA
```

**Parameters:**
- `id` - The block whose drop shadow color should be queried.

**Returns:** The drop shadow color.

### getDropShadowColor()

Gets the drop shadow color of a block.

```typescript
getDropShadowColor(id: DesignBlockId): Color
```

**Parameters:**
- `id` - The block whose drop shadow color should be queried.

**Returns:** The drop shadow color.

### setDropShadowOffsetX()

Sets the drop shadow's horizontal offset.

```typescript
setDropShadowOffsetX(id: DesignBlockId, offsetX: number): void
```

**Parameters:**
- `id` - The block whose drop shadow's X offset should be set.
- `offsetX` - The X offset to be set.

### getDropShadowOffsetX()

Gets the drop shadow's horizontal offset.

```typescript
getDropShadowOffsetX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose drop shadow's X offset should be queried.

**Returns:** The offset.

### setDropShadowOffsetY()

Sets the drop shadow's vertical offset.

```typescript
setDropShadowOffsetY(id: DesignBlockId, offsetY: number): void
```

**Parameters:**
- `id` - The block whose drop shadow's Y offset should be set.
- `offsetY` - The Y offset to be set.

### getDropShadowOffsetY()

Gets the drop shadow's vertical offset.

```typescript
getDropShadowOffsetY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose drop shadow's Y offset should be queried.

**Returns:** The offset.

### setDropShadowBlurRadiusX()

Sets the drop shadow's horizontal blur radius.

```typescript
setDropShadowBlurRadiusX(id: DesignBlockId, blurRadiusX: number): void
```

**Parameters:**
- `id` - The block whose drop shadow's blur radius should be set.
- `blurRadiusX` - The blur radius to be set.

### getDropShadowBlurRadiusX()

Gets the drop shadow's horizontal blur radius.

```typescript
getDropShadowBlurRadiusX(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose drop shadow's blur radius should be queried.

**Returns:** The blur radius.

### setDropShadowBlurRadiusY()

Sets the drop shadow's vertical blur radius.

```typescript
setDropShadowBlurRadiusY(id: DesignBlockId, blurRadiusY: number): void
```

**Parameters:**
- `id` - The block whose drop shadow's blur radius should be set.
- `blurRadiusY` - The blur radius to be set.

### getDropShadowBlurRadiusY()

Gets the drop shadow's vertical blur radius.

```typescript
getDropShadowBlurRadiusY(id: DesignBlockId): number
```

**Parameters:**
- `id` - The block whose drop shadow's blur radius should be queried.

**Returns:** The blur radius.

### setDropShadowClip()

Sets the drop shadow's clipping behavior.
This only applies to shapes.

```typescript
setDropShadowClip(id: DesignBlockId, clip: boolean): void
```

**Parameters:**
- `id` - The block whose drop shadow's clip should be set.
- `clip` - The drop shadow's clip to be set.

### getDropShadowClip()

Gets the drop shadow's clipping behavior.

```typescript
getDropShadowClip(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose drop shadow's clipping should be queried.

**Returns:** The drop shadow's clipping state.

## Block Cutout

Create cutout operations and path-based modifications.

### createCutoutFromBlocks()

Creates a cutout block from the contours of other blocks.
The path is derived from either existing vector paths or by vectorizing the block's appearance.

```typescript
createCutoutFromBlocks(ids: DesignBlockId[], vectorizeDistanceThreshold?: number, simplifyDistanceThreshold?: number, useExistingShapeInformation?: boolean): DesignBlockId
```

**Parameters:**
- `ids` - The blocks whose shape will serve as the basis for the cutout's path.
- `vectorizeDistanceThreshold` - Max deviation from the original contour during vectorization.
- `simplifyDistanceThreshold` - Max deviation for path simplification. 0 disables simplification.
- `useExistingShapeInformation` - If true, use existing vector paths.

**Returns:** The newly created block or an error.

### createCutoutFromPath()

Creates a cutout block from an SVG path string.

```typescript
createCutoutFromPath(path: string): DesignBlockId
```

**Parameters:**
- `path` - An SVG string describing a path.

**Returns:** The newly created block or an error.

### createCutoutFromOperation()

Creates a new cutout block by performing a boolean operation on existing cutout blocks.

```typescript
createCutoutFromOperation(ids: DesignBlockId[], op: CutoutOperation): DesignBlockId
```

**Parameters:**
- `ids` - The cutout blocks with which to perform to the operation.
- `op` - The boolean operation to perform.

**Returns:** The newly created block or an error.

## Block Text

Create, edit, and style text content.

### replaceText()

Replaces a range of text in a text block.
```javascript
engine.block.replaceText(text, 'Hello World');
engine.block.replaceText(text, 'Alex', 6, 11);
```

```typescript
replaceText(id: DesignBlockId, text: string, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block into which to insert the given text.
- `text` - The text which should replace the selected range in the block.
- `from` - The start index of the UTF-16 range to replace. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range to replace. Defaults to the end of the current selection or text.

### removeText()

Removes a range of text from a text block.
```javascript
engine.block.removeText(text, 0, 6);
```

```typescript
removeText(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block from which the selected text should be removed.
- `from` - The start index of the UTF-16 range to remove. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range to remove. Defaults to the end of the current selection or text.

### setTextColor()

Sets the color for a range of text.
```javascript
engine.block.setTextColor(text, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }, 1, 4);
```

```typescript
setTextColor(id: DesignBlockId, color: Color, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose color should be changed.
- `color` - The new color of the selected text range.
- `from` - The start index of the UTF-16 range to change. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range to change. Defaults to the end of the current selection or text.

### getTextColors()

Gets the unique colors within a range of text.
```javascript
const colorsInRange = engine.block.getTextColors(text, 2, 5);
```

```typescript
getTextColors(id: DesignBlockId, from?: number, to?: number): Array<Color>
```

**Parameters:**
- `id` - The text block whose colors should be returned.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered unique list of colors.

### setTextFontWeight()

Sets the font weight for a range of text.
```javascript
engine.block.setTextFontWeight(text, 'bold', 0, 5);
```

```typescript
setTextFontWeight(id: DesignBlockId, fontWeight: FontWeight, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose weight should be changed.
- `fontWeight` - The new weight of the selected text range.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTextFontWeights()

Gets the unique font weights within a range of text.
```javascript
const fontWeights = engine.block.getTextFontWeights(text, 0, 6);
```

```typescript
getTextFontWeights(id: DesignBlockId, from?: number, to?: number): FontWeight[]
```

**Parameters:**
- `id` - The text block whose font weights should be returned.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered unique list of font weights.

### setTextFontSize()

Sets the font size for a range of text.
```javascript
// With numeric fontSize (in points)
engine.block.setTextFontSize(text, 12, 0, 5);
// With font size and options object
engine.block.setTextFontSize(text, 16, { unit: 'Pixel' });
engine.block.setTextFontSize(text, 24, { unit: 'Point', from: 0, to: 10 });
```

```typescript
setTextFontSize(id: DesignBlockId, fontSize: number, options?: TextFontSizeOptions): void
```

**Parameters:**
- `id` - The text block whose font size should be changed.
- `fontSize` - The new font size value.
- `options` - An options object with unit, from, and to properties.

### getTextFontSizes()

Gets the unique font sizes within a range of text.
```javascript
// Get all font sizes
const fontSizes = engine.block.getTextFontSizes(text);
// Get font sizes for a range
const fontSizes = engine.block.getTextFontSizes(text, 0, 10);
// With options object
const sizesInPx = engine.block.getTextFontSizes(text, { unit: 'Pixel' });
const sizesInRange = engine.block.getTextFontSizes(text, { unit: 'Millimeter', from: 5, to: 15 });
```

```typescript
getTextFontSizes(id: DesignBlockId, options?: TextFontSizeOptions): number[]
```

**Parameters:**
- `id` - The text block whose font sizes should be returned.
- `options` - An options object with unit, from, and to properties.

**Returns:** The ordered unique list of font sizes.

### setTextFontStyle()

Sets the font style for a range of text.
```javascript
engine.block.setTextFontStyle(text, 'italic', 0, 5);
```

```typescript
setTextFontStyle(id: DesignBlockId, fontStyle: FontStyle, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose style should be changed.
- `fontStyle` - The new style of the selected text range.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTextFontStyles()

Gets the unique font styles within a range of text.
```javascript
const fontStyles = engine.block.getTextFontStyles(text);
```

```typescript
getTextFontStyles(id: DesignBlockId, from?: number, to?: number): FontStyle[]
```

**Parameters:**
- `id` - The text block whose font styles should be returned.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered unique list of font styles.

### getTextCases()

Gets the unique text cases within a range of text.
```javascript
const textCases = engine.block.getTextCases(text);
```

```typescript
getTextCases(id: DesignBlockId, from?: number, to?: number): TextCase[]
```

**Parameters:**
- `id` - The text block whose text cases should be returned.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered list of text cases.

### setTextCase()

Sets the text case for a range of text.
```javascript
engine.block.setTextCase(text, 'Titlecase');
```

```typescript
setTextCase(id: DesignBlockId, textCase: TextCase, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose text case should be changed.
- `textCase` - The new text case value.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTextDecorations()

Gets the unique text decoration configurations within a range of text.
Each element of the returned array is a decoration configuration representing
a unique combination of lines, style, color, and thickness found in the range.
```javascript
const decorations = engine.block.getTextDecorations(text);
// e.g., [{ lines: ['None'] }, { lines: ['Underline'], style: 'Dashed' }]
```

```typescript
getTextDecorations(id: DesignBlockId, from?: number, to?: number): TextDecorationConfig[]
```

**Parameters:**
- `id` - The text block whose text decorations should be returned.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered list of unique decoration configurations.

### setTextDecoration()

Sets the text decoration for a range of text.
The config specifies which decoration lines, style, underline color, thickness, and offset to apply.
Use `{ lines: ['None'] }` to remove all decorations.
```javascript
engine.block.setTextDecoration(text, { lines: ['Underline'] });
engine.block.setTextDecoration(text, { lines: ['Underline', 'Strikethrough'], style: 'Dashed' });
engine.block.setTextDecoration(text, { lines: ['Overline'], style: 'Wavy', underlineThickness: 2.0 });
engine.block.setTextDecoration(text, { lines: ['None'] }); // Remove decorations
```

```typescript
setTextDecoration(id: DesignBlockId, config: TextDecorationConfig, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose text decoration should be changed.
- `config` - The decoration configuration to apply.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### setTextKerning()

Sets kerning for a grapheme range.
Applies an additional offset in em units on top of the font's built-in kern.
`1.0` equals the run's font size, so the offset scales proportionally with text size.
```javascript
engine.block.setTextKerning(text, 0.1); // add 10% of font size as extra spacing
engine.block.setTextKerning(text, -0.05, 0, 5); // tighten first 5 graphemes
engine.block.setTextKerning(text, 0); // reset to no extra offset
```

```typescript
setTextKerning(id: DesignBlockId, kerning: number, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `kerning` - Additional kerning in em units (1.0 = one full em). Use 0 for no extra offset.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTextKernings()

Returns the unique kerning values across the grapheme range.
```javascript
const kernings = engine.block.getTextKernings(text); // e.g. [0] or [0.1, 0]
```

```typescript
getTextKernings(id: DesignBlockId, from?: number, to?: number): number[]
```

**Parameters:**
- `id` - The text block to query.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### toggleTextDecorationUnderline()

Toggles the underline decoration for a text range.
If any part of the range does not have underline, the entire range gets underline.
If the entire range already has underline, it is removed.
Other decoration lines (strikethrough, overline) on each text run are preserved.
```javascript
engine.block.toggleTextDecorationUnderline(text);
```

```typescript
toggleTextDecorationUnderline(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### toggleTextDecorationStrikethrough()

Toggles the strikethrough decoration for a text range.
If any part of the range does not have strikethrough, the entire range gets strikethrough.
If the entire range already has strikethrough, it is removed.
Other decoration lines (underline, overline) on each text run are preserved.
```javascript
engine.block.toggleTextDecorationStrikethrough(text);
```

```typescript
toggleTextDecorationStrikethrough(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### toggleTextDecorationOverline()

Toggles the overline decoration for a text range.
If any part of the range does not have overline, the entire range gets overline.
If the entire range already has overline, it is removed.
Other decoration lines (underline, strikethrough) on each text run are preserved.
```javascript
engine.block.toggleTextDecorationOverline(text);
```

```typescript
toggleTextDecorationOverline(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTextHorizontalAlignment()

Gets the paragraph-level horizontal alignment override for a specific paragraph,
or the block-level alignment.
```javascript
const alignment = engine.block.getTextHorizontalAlignment(text, 0);
const blockAlignment = engine.block.getTextHorizontalAlignment(text); // paragraphIndex defaults to -1
// e.g. 'Left' | 'Center' | 'Right' | 'Auto' | undefined
```

```typescript
getTextHorizontalAlignment(id: DesignBlockId, paragraphIndex?: number): TextHorizontalAlignment | undefined
```

**Parameters:**
- `id` - The text block to query.
- `paragraphIndex` - The 0-based index of the paragraph to query.
Negative values return the block-level `text/horizontalAlignment` setting.

**Returns:** The paragraph override, `undefined` if no override is set,
or the block-level alignment when `paragraphIndex < 0`.

### setTextHorizontalAlignment()

Sets the paragraph-level horizontal alignment override for one or all paragraphs.
```javascript
engine.block.setTextHorizontalAlignment(text, 'Center', 0);
engine.block.setTextHorizontalAlignment(text, undefined, 0); // clear override
engine.block.setTextHorizontalAlignment(text, 'Right'); // apply to all
```

```typescript
setTextHorizontalAlignment(id: DesignBlockId, alignment: TextHorizontalAlignment | undefined, paragraphIndex?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `alignment` - The alignment to apply, or `undefined` to clear the paragraph override.
- `paragraphIndex` - The 0-based index of the paragraph.
Negative values clear all paragraph-level alignment overrides and, when `alignment` is provided,
apply that alignment to the whole text block.

### getTextListStyle()

Gets the list style for a specific paragraph of a text block.
```javascript
const listStyle = engine.block.getTextListStyle(text, 0);
```

```typescript
getTextListStyle(id: DesignBlockId, paragraphIndex: number): ListStyle
```

**Parameters:**
- `id` - The text block whose list style should be returned.
- `paragraphIndex` - The 0-based index of the paragraph.

**Returns:** The list style of the paragraph.

### setTextListStyle()

Sets the list style for a specific paragraph or all paragraphs of a text block.
```javascript
engine.block.setTextListStyle(text, 'Unordered');
engine.block.setTextListStyle(text, 'Ordered', 0, 2);
```

```typescript
setTextListStyle(id: DesignBlockId, listStyle: ListStyle, paragraphIndex?: number, listLevel?: number): void
```

**Parameters:**
- `id` - The text block whose list style should be changed.
- `listStyle` - The list style to apply.
- `paragraphIndex` - The 0-based index of the paragraph to modify. Negative values apply to all paragraphs.
- `listLevel` - Optional list nesting level to set atomically with the list style (0 = outermost).
                   When omitted the existing list level of each paragraph is preserved.
                   Has no visual effect when listStyle is 'None'.

### getTextListLevel()

Gets the list nesting level for a specific paragraph of a text block.
```javascript
const listLevel = engine.block.getTextListLevel(text, 0);
```

```typescript
getTextListLevel(id: DesignBlockId, paragraphIndex: number): number
```

**Parameters:**
- `id` - The text block whose list level should be returned.
- `paragraphIndex` - The 0-based index of the paragraph.

**Returns:** The list nesting level of the paragraph.

### setTextListLevel()

Sets the list nesting level for a specific paragraph or all paragraphs of a text block.
```javascript
engine.block.setTextListLevel(text, 1);
engine.block.setTextListLevel(text, 2, 0);
```

```typescript
setTextListLevel(id: DesignBlockId, listLevel: number, paragraphIndex?: number): void
```

**Parameters:**
- `id` - The text block whose list level should be changed.
- `listLevel` - The list nesting level (0 = outermost).
- `paragraphIndex` - The 0-based index of the paragraph to modify. Negative values apply to all paragraphs.

### getTextParagraphIndices()

Returns the 0-based paragraph indices that overlap the given UTF-16 range.
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

```typescript
getTextParagraphIndices(id: DesignBlockId, from?: number, to?: number): number[]
```

**Parameters:**
- `id` - The text block to query.
- `from` - The inclusive start UTF-16 index. Negative values reference the entire text.
- `to` - The exclusive end UTF-16 index. Negative values reference the entire text.

**Returns:** The paragraph indices overlapping the range.

### setTextLineHeight()

Sets the line height multiplier for a specific paragraph or all paragraphs of a text block.
```javascript
engine.block.setTextLineHeight(text, 1.5);
engine.block.setTextLineHeight(text, 1.5, 0);
engine.block.setTextLineHeight(text, null); // reset all paragraphs to block default
```

```typescript
setTextLineHeight(id: DesignBlockId, lineHeight: number | null, paragraphIndex?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `lineHeight` - The line height multiplier, or `null` to reset to the block-level default.
- `paragraphIndex` - The 0-based index of the paragraph to modify. Negative values apply to all paragraphs.

### getTextLineHeight()

Returns the line height multiplier for a specific paragraph of a text block.
Returns the per-paragraph override if one is set, otherwise returns the block-level `lineHeight`.
```javascript
const lineHeight = engine.block.getTextLineHeight(text, 0);
```

```typescript
getTextLineHeight(id: DesignBlockId, paragraphIndex: number): number
```

**Parameters:**
- `id` - The text block to query.
- `paragraphIndex` - The 0-based index of the paragraph.

**Returns:** The line height multiplier for the paragraph.

### canToggleBoldFont()

Checks if the bold font weight can be toggled for a range of text.
Returns true if any part of the range is not bold and the bold font is available.
```javascript
const canToggleBold = engine.block.canToggleBoldFont(text);
```

```typescript
canToggleBoldFont(id: DesignBlockId, from?: number, to?: number): boolean
```

**Parameters:**
- `id` - The text block to check.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** Whether the font weight can be toggled.

### canToggleItalicFont()

Checks if the italic font style can be toggled for a range of text.
Returns true if any part of the range is not italic and the italic font is available.
```javascript
const canToggleItalic = engine.block.canToggleItalicFont(text);
```

```typescript
canToggleItalicFont(id: DesignBlockId, from?: number, to?: number): boolean
```

**Parameters:**
- `id` - The text block to check.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** Whether the font style can be toggled.

### toggleBoldFont()

Toggles the font weight of a text range between bold and normal.
If any part of the range is not bold, the entire range becomes bold. If the entire range is already bold, it becomes normal.
```javascript
engine.block.toggleBoldFont(text);
```

```typescript
toggleBoldFont(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### toggleItalicFont()

Toggles the font style of a text range between italic and normal.
If any part of the range is not italic, the entire range becomes italic. If the entire range is already italic, it becomes normal.
```javascript
engine.block.toggleItalicFont(text);
```

```typescript
toggleItalicFont(id: DesignBlockId, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### setFont()

Sets the font and typeface for an entire text block.
Existing formatting is reset.
```javascript
engine.block.setFont(text, font.uri, typeface);
```

```typescript
setFont(id: DesignBlockId, fontFileUri: string, typeface: Typeface): void
```

**Parameters:**
- `id` - The text block whose font should be changed.
- `fontFileUri` - The URI of the new font file.
- `typeface` - The typeface of the new font.

### setTypeface()

Sets the typeface for a range of text.
The current formatting is retained as much as possible.
```javascript
engine.block.setTypeface(text, typeface, 2, 5);
```

```typescript
setTypeface(id: DesignBlockId, typeface: Typeface, from?: number, to?: number): void
```

**Parameters:**
- `id` - The text block whose font should be changed.
- `typeface` - The new typeface.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

### getTypeface()

Gets the base typeface of a text block.
This does not return the typefaces of individual text runs.
```javascript
const defaultTypeface = engine.block.getTypeface(text);
```

```typescript
getTypeface(id: DesignBlockId): Typeface
```

**Parameters:**
- `id` - The text block whose typeface should be queried.

**Returns:** the typeface property of the text block.

### getTypefaces()

Gets the unique typefaces within a range of text.
```javascript
const currentTypefaces = engine.block.getTypefaces(text);
```

```typescript
getTypefaces(id: DesignBlockId, from?: number, to?: number): Typeface[]
```

**Parameters:**
- `id` - The text block whose typefaces should be queried.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The unique typefaces in the range.

### getTextRuns()

Gets all text runs within a range of text.
Each run represents a contiguous span of text with uniform formatting.
```javascript
const runs = engine.block.getTextRuns(text);
```

```typescript
getTextRuns(id: DesignBlockId, from?: number, to?: number): TextRunInfo[]
```

**Parameters:**
- `id` - The text block to query.
- `from` - The start index of the UTF-16 range. Defaults to the start of the current selection or text.
- `to` - The end index of the UTF-16 range. Defaults to the end of the current selection or text.

**Returns:** The ordered list of text runs covering the requested range.

### getTextCursorRange()

Gets the current text cursor or selection range.
Returns the UTF-16 indices of the selected range of the text block that is currently being
edited. The range is half-open (exclusive): `from` is the index of the first selected code
unit, `to` is one past the last selected code unit. When `from === to` the cursor is
positioned between characters with no text selected.
```javascript
const selectedRange = engine.block.getTextCursorRange();
```

```typescript
getTextCursorRange(): Range
```

**Returns:** The selected UTF-16 range or `{ from: -1, to: -1 }` if no text block is being edited.

### setTextCursorRange()

Sets the text cursor range (selection) within the text block that is currently being edited.

```typescript
setTextCursorRange(range: Range): void
```

**Parameters:**
- `range` - The UTF-16 range to set as the selection. If `from` equals `to`, the cursor is positioned at that index. If `from` and `to` are set to -1, the whole text is selected.

### getTextVisibleLineCount()

Gets the number of visible lines in a text block.
```javascript
const lineCount = engine.block.getTextVisibleLineCount(text);
```

```typescript
getTextVisibleLineCount(id: DesignBlockId): number
```

**Parameters:**
- `id` - The text block whose line count should be returned.

**Returns:** The number of lines in the text block.

### getTextVisibleLineGlobalBoundingBoxXYWH()

Gets the global bounding box of a visible line of text.
The values are in the scene's global coordinate space.
```javascript
const lineBoundingBox = engine.block.getTextVisibleLineGlobalBoundingBoxXYWH(text, 0);
```

```typescript
getTextVisibleLineGlobalBoundingBoxXYWH(id: DesignBlockId, lineIndex: number): XYWH
```

**Parameters:**
- `id` - The text block whose line bounding box should be returned.
- `lineIndex` - The index of the line whose bounding box should be returned.

**Returns:** The bounding box of the line.

### getTextVisibleLineContent()

Gets the text content of a visible line.

```typescript
getTextVisibleLineContent(id: DesignBlockId, lineIndex: number): string
```

**Parameters:**
- `id` - The text block whose line content should be returned.
- `lineIndex` - The index of the line whose content should be returned.

**Returns:** The text content of the line.

### getTextCharacterInkBoxes()

Returns the tight ink-paint bounding box for each grapheme in the range.
One entry per grapheme in [from, to). Non-printable graphemes get a zero-rect.
Coordinates are in global scene space.

```typescript
getTextCharacterInkBoxes(id: DesignBlockId, from?: number, to?: number): CharacterInkBox[]
```

**Parameters:**
- `id` - The text block to query.
- `from` - Start grapheme index (-1 = start of cursor selection or 0).
- `to` - End grapheme index (-1 = end of cursor selection or text length).

**Returns:** Array of CharacterInkBox, one per grapheme in range, in text order.

### getTextEffectiveHorizontalAlignment()

Gets the effective horizontal alignment of a text block.
If the alignment is set to Auto, this returns the resolved alignment (Left or Right)
based on the text direction of the first logical run. This never returns 'Auto'.

```typescript
getTextEffectiveHorizontalAlignment(id: DesignBlockId): 'Left' | 'Right' | 'Center'
```

**Parameters:**
- `id` - The text block whose effective alignment should be returned.

**Returns:** The effective alignment ('Left', 'Right', or 'Center').

### setTextOnPath()

Sets the SVG path that the text baseline follows.
Pass `null` to restore normal straight-line text layout.

```typescript
setTextOnPath(id: DesignBlockId, svgPath: string | null): void
```

**Parameters:**
- `id` - The text block to modify.
- `svgPath` - An SVG path string in the block's local coordinate space, or `null` to clear.

### getTextOnPath()

Gets the SVG path currently used as the text baseline.

```typescript
getTextOnPath(id: DesignBlockId): string | null
```

**Parameters:**
- `id` - The text block to query.

**Returns:** The SVG path string, or `null` if no path is set.

### setTextOnPathOffset()

Sets the start offset along the baseline path as a proportion of the path length.
Values are clamped to `[-1, 1]`; `1` and `-1` wrap back to the path start.

```typescript
setTextOnPathOffset(id: DesignBlockId, offset: number): void
```

**Parameters:**
- `id` - The text block to modify.
- `offset` - The proportional offset. Positive values move the text forward along the path.

### getTextOnPathOffset()

Gets the start offset along the baseline path as a proportion of the path length.

```typescript
getTextOnPathOffset(id: DesignBlockId): number
```

**Parameters:**
- `id` - The text block to query.

**Returns:** The proportional offset in `[-1, 1]`.

### setTextOnPathFlipped()

Sets whether text is placed on the opposite side of the baseline path.

```typescript
setTextOnPathFlipped(id: DesignBlockId, flipped: boolean): void
```

**Parameters:**
- `id` - The text block to modify.
- `flipped` - When `true`, text sits on the underside of the curve and reads in the reverse direction.

### getTextOnPathFlipped()

Gets whether the text-on-path rendering is flipped.

```typescript
getTextOnPathFlipped(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The text block to query.

**Returns:** `true` when text is on the underside of the curve.

## Block Placeholder

Manage placeholder functionality, controls, and behavior.

### setPlaceholderEnabled()

Enables or disables the placeholder function for a block.
When set to `true`, the given block becomes selectable by users and its placeholder capabilities are enabled in Adopter mode.
```javascript
engine.block.setPlaceholderEnabled(block, true);
```

```typescript
setPlaceholderEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose placeholder function should be enabled or disabled.
- `enabled` - Whether the function should be enabled or disabled.

### isPlaceholderEnabled()

Checks if the placeholder function for a block is enabled and can be selected by users in Adopter mode.
```javascript
const placeholderIsEnabled = engine.block.isPlaceholderEnabled(block);
```

```typescript
isPlaceholderEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose placeholder function state should be queried.

**Returns:** The enabled state of the placeholder function.

### hasPlaceholderBehavior() *(deprecated)*

Checks if a block supports placeholder behavior.

```typescript
hasPlaceholderBehavior(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports placeholder behavior.

### supportsPlaceholderBehavior()

Checks if a block supports placeholder behavior.
```javascript
const placeholderBehaviorSupported = engine.block.supportsPlaceholderBehavior(block);
```

```typescript
supportsPlaceholderBehavior(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports placeholder behavior.

### setPlaceholderBehaviorEnabled()

Enables or disables the placeholder behavior for a block.
When its fill block is set to `true`, an image block will act as a placeholder, showing a control overlay and a replacement button.
```javascript
engine.block.setPlaceholderBehaviorEnabled(block, true);
```

```typescript
setPlaceholderBehaviorEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose placeholder behavior should be enabled or disabled.
- `enabled` - Whether the placeholder behavior should be enabled or disabled.

### isPlaceholderBehaviorEnabled()

Checks if the placeholder behavior for a block is enabled.
```javascript
engine.block.setPlaceholderBehaviorEnabled(block, true);
```

```typescript
isPlaceholderBehaviorEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose placeholder behavior state should be queried.

**Returns:** The enabled state of the placeholder behavior.

### hasPlaceholderControls() *(deprecated)*

Checks if a block supports placeholder controls.

```typescript
hasPlaceholderControls(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports placeholder controls.

### supportsPlaceholderControls()

Checks if a block supports placeholder controls, e.g. a control overlay and a replacement button.

```typescript
supportsPlaceholderControls(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** True, if the block supports placeholder controls.

### setPlaceholderControlsOverlayEnabled()

Enables or disables the placeholder overlay pattern.
```javascript
engine.block.setPlaceholderControlsOverlayEnabled(block, true);
```

```typescript
setPlaceholderControlsOverlayEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose placeholder overlay should be enabled or disabled.
- `enabled` - Whether the placeholder overlay should be shown or not.

### isPlaceholderControlsOverlayEnabled()

Checks if the placeholder overlay pattern is enabled.
```javascript
const overlayEnabled = engine.block.isPlaceholderControlsOverlayEnabled(block);
```

```typescript
isPlaceholderControlsOverlayEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose placeholder overlay visibility state should be queried.

**Returns:** The visibility state of the block's placeholder overlay pattern.

### setPlaceholderControlsButtonEnabled()

Enables or disables the placeholder button.
```javascript
engine.block.setPlaceholderControlsButtonEnabled(block, true);
```

```typescript
setPlaceholderControlsButtonEnabled(id: DesignBlockId, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose placeholder button should be shown or not.
- `enabled` - Whether the placeholder button should be shown or not.

### isPlaceholderControlsButtonEnabled()

Checks if the placeholder button is enabled.
```javascript
const buttonEnabled = engine.block.isPlaceholderControlsButtonEnabled(block);
```

```typescript
isPlaceholderControlsButtonEnabled(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block whose placeholder button visibility state should be queried.

**Returns:** The visibility state of the block's placeholder button.

## Block Metadata

### setMetadata()

Sets a metadata value for a given key on a block.
If the key does not exist, it will be added.

```typescript
setMetadata(id: DesignBlockId, key: string, value: string): void
```

**Parameters:**
- `id` - The block whose metadata will be accessed.
- `key` - The key used to identify the desired piece of metadata.
- `value` - The value to set.

### getMetadata()

Gets a metadata value for a given key from a block.

```typescript
getMetadata(id: DesignBlockId, key: string): string
```

**Parameters:**
- `id` - The block whose metadata will be accessed.
- `key` - The key used to identify the desired piece of metadata.

**Returns:** The value associated with the key.

### hasMetadata()

Checks if a block has metadata for a given key.

```typescript
hasMetadata(id: DesignBlockId, key: string): boolean
```

**Parameters:**
- `id` - The block whose metadata will be accessed.
- `key` - The key used to identify the desired piece of metadata.

**Returns:** Whether the key exists.

### findAllMetadata()

Finds all metadata keys on a block.

```typescript
findAllMetadata(id: DesignBlockId): string[]
```

**Parameters:**
- `id` - The block whose metadata will be accessed.

**Returns:** A list of all metadata keys on this block.

### removeMetadata()

Removes metadata for a given key from a block.

```typescript
removeMetadata(id: DesignBlockId, key: string): void
```

**Parameters:**
- `id` - The block whose metadata will be accessed.
- `key` - The key used to identify the desired piece of metadata.

## Block Scopes

Manage permissions and capabilities per block.

### setScopeEnabled()

Enables or disables a scope for a block.
```javascript
// Allow the user to move the image block.
engine.block.setScopeEnabled(image, 'layer/move', true);
```

```typescript
setScopeEnabled(id: DesignBlockId, key: Scope, enabled: boolean): void
```

**Parameters:**
- `id` - The block whose scope should be enabled or disabled.
- `key` - The scope to enable or disable.
- `enabled` - Whether the scope should be enabled or disabled.

### isScopeEnabled()

Checks if a scope is enabled for a block.
```javascript
engine.block.isScopeEnabled(image, 'layer/move');
```

```typescript
isScopeEnabled(id: DesignBlockId, key: Scope): boolean
```

**Parameters:**
- `id` - The block whose scope state should be queried.
- `key` - The scope to query.

**Returns:** The enabled state of the scope for the given block.

### isAllowedByScope()

Checks if an operation is allowed by a block's scopes.
```javascript
// This will return true when the global scope is set to 'Defer'.
engine.block.isAllowedByScope(image, 'layer/move');
```

```typescript
isAllowedByScope(id: DesignBlockId, key: Scope): boolean
```

**Parameters:**
- `id` - The block to check.
- `key` - The scope to check.

**Returns:** Whether the scope is allowed for the given block.

## Block

### split()

Splits a block at the specified time.
The original block will be trimmed to end at the split time, and the returned duplicate
will start at the split time and continue to the original end time.
```javascript
const duplicate = engine.block.split(video, 10.0);
```

```typescript
split(id: DesignBlockId, atTime: number, options?: SplitOptions): DesignBlockId
```

**Parameters:**
- `id` - The block to split.
- `atTime` - The time (in seconds) relative to the block's time offset where the split should occur.
- `options` - The options for configuring the split operation.

**Returns:** The newly created second half of the split block.

## Block Animations

Create and manage animations and timeline-based effects.

### createAnimation()

Creates a new animation block.

```typescript
createAnimation(type: AnimationType): DesignBlockId
```

**Parameters:**
- `type` - The type of animation to create.

**Returns:** The handle of the new animation instance.

### supportsAnimation()

Checks if a block supports animation.

```typescript
supportsAnimation(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The block to query.

**Returns:** Whether the block supports animation.

### setInAnimation()

Sets the "in" animation of a block.

```typescript
setInAnimation(id: DesignBlockId, animation: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose "in" animation should be set.
- `animation` - The animation to set.

### setLoopAnimation()

Sets the "loop" animation of a block.

```typescript
setLoopAnimation(id: DesignBlockId, animation: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose "loop" animation should be set.
- `animation` - The animation to set.

### setOutAnimation()

Sets the "out" animation of a block.

```typescript
setOutAnimation(id: DesignBlockId, animation: DesignBlockId): void
```

**Parameters:**
- `id` - The block whose "out" animation should be set.
- `animation` - The animation to set.

### getInAnimation()

Gets the "in" animation of a block.

```typescript
getInAnimation(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block whose "in" animation should be queried.

**Returns:** The "in" animation of the block.

### getLoopAnimation()

Gets the "loop" animation of a block.

```typescript
getLoopAnimation(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block whose "loop" animation should be queried.

**Returns:** The "loop" animation of the block.

### getOutAnimation()

Gets the "out" animation of a block.

```typescript
getOutAnimation(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The block whose "out" animation should be queried.

**Returns:** The "out" animation of the block.

## Block Transitions

### createTransition()

Creates a new transition block.
The created block is standalone until assigned to a clip with `setTransition`.
Once assigned, it is owned by that clip: it is destroyed together with the
clip, and the engine also destroys it automatically when the two clips stop
being timeline-adjacent on the track (e.g. after a manual gap is introduced).

```typescript
createTransition(type: TransitionType): DesignBlockId
```

**Parameters:**
- `type` - The type of transition to create.

**Returns:** The handle of the new transition instance.

### supportsTransition()

Checks whether a clip can own an outgoing clip-to-clip transition.
Only leaf clips inside a video track qualify. Audio, group, caption, and
cutout blocks — as well as blocks outside a video track — report `false`.

```typescript
supportsTransition(id: DesignBlockId): boolean
```

**Parameters:**
- `id` - The clip block to check.

**Returns:** Whether the block can own an outgoing transition.

### setTransition()

Assigns the outgoing transition of a clip.
A previously assigned transition block is detached but not destroyed
automatically. Throws an error if the given transition block is invalid or
already assigned to another clip. Both the clip and its following clip on
the track must support transitions, see `supportsTransition`. To clear a
clip's transition, use `removeTransition` instead.

```typescript
setTransition(id: DesignBlockId, transition: DesignBlockId): void
```

**Parameters:**
- `id` - The outgoing clip that owns the transition relation.
- `transition` - The transition block to assign.

### removeTransition()

Removes the outgoing transition of a clip.
The removed transition block is detached but not destroyed automatically.
Removing from a clip without an assigned transition is a no-op.

```typescript
removeTransition(id: DesignBlockId): void
```

**Parameters:**
- `id` - The outgoing clip whose transition relation should be cleared.

### getTransition()

Gets the outgoing transition assigned to a clip.

```typescript
getTransition(id: DesignBlockId): DesignBlockId
```

**Parameters:**
- `id` - The outgoing clip whose transition relation should be queried.

**Returns:** The assigned transition block, or an invalid block if unset.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).