> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Flip](./edit-video/transform/flip.md)

---

Run **CE.SDK** in **Node.js server mode** to mirror video blocks programmatically—no client editor required. Flip clips before exporting the final video, enforcing template rules, or running automation jobs that prepare footage for downstream pipelines.

> **Note:** CE.SDK for Node.js runs **headless**. The native `@cesdk/node-native` package exports H.264/MP4 directly on the server via `engine.block.exportVideo()`. With the WASM-based `@cesdk/node` package, use the separate CE.SDK Renderer to encode the video.

## Requirements

- A CE.SDK server package: `npm install @cesdk/node@$UBQ_VERSION$` (WASM) or `npm install @cesdk/node-native@$UBQ_VERSION$` (native) — the engine API is identical
- **Node.js 22** or newer
- A CE.SDK license key. Set `baseURL` when serving the CE.SDK asset bundle from your own location (both Node.js packages bundle their engine assets, so `baseURL` is optional)

## What You’ll Learn

- Flip video blocks **horizontally or vertically** server-side.
- Mirror multiple clips together during automation jobs.
- **Reset** or toggle flip states while persisting scene changes.

## When to Use

Server-side flipping helps when you need to:

- Prepare mirrored variants of clips for A/B testing or template variations.
- Align **eyelines** between front and rear camera footage before export.
- Keep branded elements facing inward on split-screen layouts that ship from templates.

## Load and Flip Video Blocks

Every video clip sits inside a **graphic** block with a video fill. After initializing the engine and loading a scene, identify the blocks you want to flip:

```js
import CreativeEngine from '@cesdk/node';

const engine = await CreativeEngine.init({
  license: process.env.LICENSE_KEY,
  baseURL: process.env.CESDK_BASE_URL
});

await engine.scene.load(
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_video_landscape_1.scene'
);

const graphics = engine.block.findByType('graphic');
const videoBlocks = graphics.filter(
  (id) => engine.block.getEnum(id, 'fill/type') === 'video'
);

if (videoBlocks.length === 0) {
  throw new Error('No video blocks found in the scene.');
}

// Apply flips, then persist the scene before disposing of the engine.
```

Once you have the block IDs, use the flip helpers to mirror each clip as needed. Persist the modified scene with `engine.scene.saveToString()` or `engine.scene.saveToArchive()` before disposing of the engine.

## How Flipping Works

The CreativeEditor represents each video clip as a `graphic` block with:

- Size
- Transforms
- Grouping
- A fill set to a *video* asset

Use the BlockAPI boolean helpers—identical to the image flip workflow—to mirror or restore clips.

### Flip Horizontally or Vertically

Call the flip helper with the block ID and a boolean:

```js
engine.block.setFlipHorizontal(videoBlock, true); // Mirror left/right
engine.block.setFlipVertical(videoBlock, true);   // Mirror top/bottom
```

The flip applies immediately in memory. Save the scene — or export it — after you finish updates so the change is preserved for the next editing or rendering step.

<Picture src={flipVideo} style={{ width: '85%' }} alt="Video flipped horizontally" formats={['webp']} />

### Query the Flip Status

Check the current flip flags before toggling or resetting:

```js
const flippedH = engine.block.getFlipHorizontal(videoBlock);
const flippedV = engine.block.getFlipVertical(videoBlock);
```

Both helpers return a boolean that reflects the block’s current orientation.

> **Note:** Flipping only affects the **visual track**. Audio (either embedded or separate) isn’t reversed, so **lip-sync and sound design stay intact**.

### Flip Clips Together

Avoid repeating the same flip call for every block by grouping the clips first:

```js
const groupId = await engine.block.group([clipId1, clipId2, clipId3]);
engine.block.setFlipVertical(groupId, true);
```

<Picture src={flipGroup} style={{ width: '85%' }} alt="Grouped video flipped horizontally" formats={['webp']} />

When you flip the group:

- The flip mirrors every child at once.
- Each clip keeps the same **spacing and order** inside the group hierarchy.
- Future flips on individual clips stack on top of the group-level flip, so track the group transform before applying more flips.

## Restore or Manage Flip States

The CE.SDK provides ways to reset or toggle a flip. You can either:

- **Reset:** when you want to restore a clip to its original orientation.
- **Code a toggle:** when you need a quick way to switch the current flip state on and off.

### Reset a Flip

To reset a clip to its default orientation:

```js
engine.block.setFlipHorizontal(videoBlock, false);
```

### Switch Flip On or Off

Calling the same flip twice:

- **Doesn’t** revert to the original orientation.
- Issues two flips in the same direction.
- Leaves the clip mirrored.

To “toggle” the flip in your code:

```js
const isFlipped = engine.block.getFlipHorizontal(videoBlock);
engine.block.setFlipHorizontal(videoBlock, !isFlipped);
```

In the preceding code, two actions are possible depending on the value stored in `isFlipped`:

- `true`: `!isFlipped` sets the horizontal flip to `false`.
- `false`: `!isFlipped` sets the horizontal flip to `true`.

Use this pattern to:

- Script command-line toggles
- Expose a REST endpoint that flips clips on demand.

## Lock or Constrain Flipping

CE.SDK provides a way to prevent editors from flipping a video. This can be useful to:

- Avoid accidentally mirroring text.
- Protect UI mock-ups or frames that must stay in a fixed position.
- Keep templates brand-locked.

To deactivate flipping, use `setScopeEnabled` with:

- The `"layer/flip"` key
- The boolean set to `false`

```js
engine.block.setScopeEnabled(videoBlock, 'layer/flip', false);
```

## Troubleshooting

| Issue | Solution |
| --- | --- |
| ❌ Flip disappears when opening the scene in the browser editor | ✅ Save the scene (`engine.scene.saveToString()` or archive) after flipping and load that exported scene in the client. |
| ❌ Flip seems ignored | ✅ Check whether the parent group is already flipped; group and block flips stack. |
| ❌ Users can still flip in UI | ✅ Turn off the `"layer/flip"` scope or lock transforms in the template. |
| ❌ Automation fails on certain clips | ✅ Ensure each block’s fill type is `video` before calling the flip helpers. |

## Next Steps

Now that you understand how to flip with the CE.SDK, take time to dive into other related features:

- [Create a template](./create-templates.md) to enforce design rules.
- [Get an overview](./overview.md) of the CE.SDK's video editing features.

## API Reference Summary

| BlockAPI  `engine.block.<>` | Purpose |
| --- | --- |
| `setFlipHorizontal(blockId, boolean)` | Mirror a block left/right or restore the default orientation. |
| `setFlipVertical(blockId, boolean)` | Mirror a block top/bottom or restore the default orientation. |
| `getFlipHorizontal(blockId)` | Check whether the block is currently flipped horizontally. |
| `getFlipVertical(blockId)` | Check whether the block is currently flipped vertically. |
| `group(blockIds[])` | Group blocks so you can flip them together. |
| `setScopeEnabled(blockId, "layer/flip", boolean)` | Activate or deactivate flip controls to lock orientation. |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support