> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Split](./edit-video/split.md)

---

Split video and audio clips at specific time points using CE.SDK's programmatic split API to create independent segments in server-side environments.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-split-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-split-server-js)

Clip splitting divides one block into two at a specified time. The original block ends at the split point; a new block starts there. Both blocks reference the same source media with independent timing. This differs from trimming, which adjusts a single block's playback range without creating new blocks.

```typescript file=@cesdk_web_examples/guides-create-video-split-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config(); // Load .env file

async function splitVideoExample() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page and track for video editing
    engine.scene.create('DepthStack', {
      page: { size: { width: 1920, height: 1080 } }
    });
    const page = engine.block.findByType('page')[0]!;
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    // Use a sample video URL
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a video block to demonstrate basic splitting
    const videoBlock = engine.block.create('graphic');
    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setWidth(videoBlock, 1920);
    engine.block.setHeight(videoBlock, 1080);
    engine.block.appendChild(track, videoBlock);

    // Load video resource to access duration
    await engine.block.forceLoadAVResource(videoFill);

    // Set block duration for the timeline
    engine.block.setDuration(videoBlock, 10.0);

    // Split the video block at 5 seconds
    // Returns the ID of the newly created block (second segment)
    const newBlock = engine.block.split(videoBlock, 5.0);

    console.log(`Basic split - Original: ${videoBlock}, New: ${newBlock}`);

    // Create another video block to demonstrate split options
    const optionsBlock = engine.block.create('graphic');
    const optionsFill = engine.block.createFill('video');
    engine.block.setString(optionsFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(optionsBlock, optionsFill);
    engine.block.setWidth(optionsBlock, 1920);
    engine.block.setHeight(optionsBlock, 1080);
    engine.block.appendChild(track, optionsBlock);

    await engine.block.forceLoadAVResource(optionsFill);
    engine.block.setDuration(optionsBlock, 10.0);

    // Split with custom options
    const optionsNewBlock = engine.block.split(optionsBlock, 4.0, {
      attachToParent: true, // Attach to same parent (default: true)
      createParentTrackIfNeeded: false, // Don't create track (default: false)
      selectNewBlock: false // Don't select new block (default: true)
    });

    console.log(`Split with options - New block: ${optionsNewBlock}`);

    // Examine trim properties after split
    const originalFill = engine.block.getFill(videoBlock);
    const newBlockFill = engine.block.getFill(newBlock);

    const originalTrimOffset = engine.block.getTrimOffset(originalFill);
    const originalTrimLength = engine.block.getTrimLength(originalFill);
    const newTrimOffset = engine.block.getTrimOffset(newBlockFill);
    const newTrimLength = engine.block.getTrimLength(newBlockFill);

    console.log('Split results:');
    console.log(
      `  Original: offset=${originalTrimOffset}s, length=${originalTrimLength}s`
    );
    console.log(
      `  New block: offset=${newTrimOffset}s, length=${newTrimLength}s`
    );

    // Demonstrate split-and-delete workflow for removing middle section
    const deleteBlock = engine.block.create('graphic');
    const deleteFill = engine.block.createFill('video');
    engine.block.setString(deleteFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(deleteBlock, deleteFill);
    engine.block.setWidth(deleteBlock, 1920);
    engine.block.setHeight(deleteBlock, 1080);
    engine.block.appendChild(track, deleteBlock);

    await engine.block.forceLoadAVResource(deleteFill);
    engine.block.setDuration(deleteBlock, 10.0);

    // Split at start of section to remove (2s)
    const middleBlock = engine.block.split(deleteBlock, 2.0);

    // Split at end of section to remove (3s into middle = 5s total)
    const endBlock = engine.block.split(middleBlock, 3.0);

    // Delete the middle segment
    engine.block.destroy(middleBlock);

    console.log(
      `Split and delete - Removed middle, kept: ${deleteBlock}, ${endBlock}`
    );

    // Validate split time before splitting
    const validateBlock = engine.block.create('graphic');
    const validateFill = engine.block.createFill('video');
    engine.block.setString(validateFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(validateBlock, validateFill);
    engine.block.setWidth(validateBlock, 1920);
    engine.block.setHeight(validateBlock, 1080);
    engine.block.appendChild(track, validateBlock);

    await engine.block.forceLoadAVResource(validateFill);
    engine.block.setDuration(validateBlock, 8.0);

    const blockDuration = engine.block.getDuration(validateBlock);
    const splitTime = 4.0;

    // Validate split time is within bounds (must be > 0 and < duration)
    if (splitTime > 0 && splitTime < blockDuration) {
      const validatedNewBlock = engine.block.split(validateBlock, splitTime);
      console.log(
        `Validated split at ${splitTime}s, new block: ${validatedNewBlock}`
      );
    } else {
      console.log('Split time out of range');
    }

    // Export the scene archive to demonstrate the result
    const archiveBlob = await engine.scene.saveToArchive();
    const buffer = Buffer.from(await archiveBlob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output', { recursive: true });
    }

    writeFileSync('./output/split-video.imgly', buffer);
    console.log('Scene exported to ./output/split-video.imgly');

  } finally {
    engine.dispose();
  }
}

splitVideoExample().catch(console.error);
```

This guide covers how to split clips programmatically for server-side automation and batch processing workflows.

## Setting Up the Scene

Before splitting clips, create a scene with the necessary track structure.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});
```

```typescript highlight=highlight-create-video-scene
// Create a scene with a page and track for video editing
engine.scene.create('DepthStack', {
  page: { size: { width: 1920, height: 1080 } }
});
const page = engine.block.findByType('page')[0]!;
const track = engine.block.create('track');
engine.block.appendChild(page, track);
```

The scene uses `Video` mode to enable time-based operations. We create a track to contain the video clips that will be split.

## Basic Splitting at a Specific Time

Split a block by providing the block ID and the split time in seconds. The time parameter is relative to the block's own time range.

```typescript highlight=highlight-basic-split
    // Create a video block to demonstrate basic splitting
    const videoBlock = engine.block.create('graphic');
    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setWidth(videoBlock, 1920);
    engine.block.setHeight(videoBlock, 1080);
    engine.block.appendChild(track, videoBlock);

    // Load video resource to access duration
    await engine.block.forceLoadAVResource(videoFill);

    // Set block duration for the timeline
    engine.block.setDuration(videoBlock, 10.0);

    // Split the video block at 5 seconds
    // Returns the ID of the newly created block (second segment)
    const newBlock = engine.block.split(videoBlock, 5.0);

    console.log(`Basic split - Original: ${videoBlock}, New: ${newBlock}`);
```

The `split()` method returns the ID of the newly created block. The original block becomes the first segment (before the split point), and the returned block is the second segment (after the split point).

## Configuring Split Options

The `SplitOptions` object controls split behavior with three optional properties:

- **`attachToParent`** (default: `true`): Whether to attach the new block to the same parent as the original
- **`createParentTrackIfNeeded`** (default: `false`): Creates a parent track if needed and adds both blocks to it
- **`selectNewBlock`** (default: `true`): Whether to select the newly created block after splitting

```typescript highlight=highlight-split-options
    // Create another video block to demonstrate split options
    const optionsBlock = engine.block.create('graphic');
    const optionsFill = engine.block.createFill('video');
    engine.block.setString(optionsFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(optionsBlock, optionsFill);
    engine.block.setWidth(optionsBlock, 1920);
    engine.block.setHeight(optionsBlock, 1080);
    engine.block.appendChild(track, optionsBlock);

    await engine.block.forceLoadAVResource(optionsFill);
    engine.block.setDuration(optionsBlock, 10.0);

    // Split with custom options
    const optionsNewBlock = engine.block.split(optionsBlock, 4.0, {
      attachToParent: true, // Attach to same parent (default: true)
      createParentTrackIfNeeded: false, // Don't create track (default: false)
      selectNewBlock: false // Don't select new block (default: true)
    });

    console.log(`Split with options - New block: ${optionsNewBlock}`);
```

Use `selectNewBlock: false` when splitting multiple clips programmatically to avoid changing selection state between operations.

## Understanding Split Results

After a split operation, both the original and new blocks have updated trim properties.

```typescript highlight=highlight-split-results
    // Examine trim properties after split
    const originalFill = engine.block.getFill(videoBlock);
    const newBlockFill = engine.block.getFill(newBlock);

    const originalTrimOffset = engine.block.getTrimOffset(originalFill);
    const originalTrimLength = engine.block.getTrimLength(originalFill);
    const newTrimOffset = engine.block.getTrimOffset(newBlockFill);
    const newTrimLength = engine.block.getTrimLength(newBlockFill);

    console.log('Split results:');
    console.log(
      `  Original: offset=${originalTrimOffset}s, length=${originalTrimLength}s`
    );
    console.log(
      `  New block: offset=${newTrimOffset}s, length=${newTrimLength}s`
    );
```

The original block keeps its trim offset unchanged, but its trim length is reduced to the split point. The new block has its trim offset advanced by the split time and trim length set to cover the remaining duration. Both blocks reference the same source media—splitting is non-destructive.

## Split and Delete Workflow

Remove a middle section from a clip by splitting at both boundaries and deleting the middle segment.

```typescript highlight=highlight-split-and-delete
    // Demonstrate split-and-delete workflow for removing middle section
    const deleteBlock = engine.block.create('graphic');
    const deleteFill = engine.block.createFill('video');
    engine.block.setString(deleteFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(deleteBlock, deleteFill);
    engine.block.setWidth(deleteBlock, 1920);
    engine.block.setHeight(deleteBlock, 1080);
    engine.block.appendChild(track, deleteBlock);

    await engine.block.forceLoadAVResource(deleteFill);
    engine.block.setDuration(deleteBlock, 10.0);

    // Split at start of section to remove (2s)
    const middleBlock = engine.block.split(deleteBlock, 2.0);

    // Split at end of section to remove (3s into middle = 5s total)
    const endBlock = engine.block.split(middleBlock, 3.0);

    // Delete the middle segment
    engine.block.destroy(middleBlock);

    console.log(
      `Split and delete - Removed middle, kept: ${deleteBlock}, ${endBlock}`
    );
```

This workflow is useful for batch processing where you need to remove unwanted sections programmatically.

## Validating Split Time

Always validate that the split time is within valid bounds before calling `split()`. The split time must be greater than 0 and less than the block's duration.

```typescript highlight=highlight-validate-split
    // Validate split time before splitting
    const validateBlock = engine.block.create('graphic');
    const validateFill = engine.block.createFill('video');
    engine.block.setString(validateFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(validateBlock, validateFill);
    engine.block.setWidth(validateBlock, 1920);
    engine.block.setHeight(validateBlock, 1080);
    engine.block.appendChild(track, validateBlock);

    await engine.block.forceLoadAVResource(validateFill);
    engine.block.setDuration(validateBlock, 8.0);

    const blockDuration = engine.block.getDuration(validateBlock);
    const splitTime = 4.0;

    // Validate split time is within bounds (must be > 0 and < duration)
    if (splitTime > 0 && splitTime < blockDuration) {
      const validatedNewBlock = engine.block.split(validateBlock, splitTime);
      console.log(
        `Validated split at ${splitTime}s, new block: ${validatedNewBlock}`
      );
    } else {
      console.log('Split time out of range');
    }
```

Attempting to split at an invalid time will fail or produce unexpected results.

## Cleanup

Always dispose the engine when finished to release resources.

```typescript highlight=highlight-cleanup
} finally {
  engine.dispose();
}
```

## API Reference

| Method                        | Description                                    | Parameters                                         | Returns          |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------- |
| `split(id, atTime, options?)` | Split a block at the specified time            | `id: DesignBlockId, atTime: number, options?: SplitOptions` | `DesignBlockId` |
| `getTimeOffset(id)`           | Get time offset relative to parent             | `id: DesignBlockId`                                | `number`         |
| `getDuration(id)`             | Get playback duration                          | `id: DesignBlockId`                                | `number`         |
| `getTrimOffset(id)`           | Get trim offset of media content               | `id: DesignBlockId`                                | `number`         |
| `getTrimLength(id)`           | Get trim length of media content               | `id: DesignBlockId`                                | `number`         |
| `forceLoadAVResource(id)`     | Force load media resource metadata             | `id: DesignBlockId`                                | `Promise<void>`  |
| `destroy(id)`                 | Destroy a block                                | `id: DesignBlockId`                                | `void`           |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support