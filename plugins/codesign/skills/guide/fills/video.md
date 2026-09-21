> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Video](./fills/video.md)

---

Video fills let you fill shapes and graphics with video content. Unlike video blocks which represent standalone video elements, video fills apply video as a visual property to existing blocks — similar to how you might fill a shape with an image or color.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-fills-video-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-fills-video-server-js)

## Context: Video Fills vs Video Blocks

**Video fills** apply video as a fill property to graphic blocks. This is useful when you want to use video as a texture within shapes, mask video to specific areas, or create video-filled design elements. Video fills attach to graphic blocks via the fill API.

**Video blocks** are standalone elements that represent video content directly on the canvas. They're created with `engine.block.create('video')` and represent complete video clips.

## Reference Example

The following code demonstrates the complete video fills API. Below, each section is explained in detail.

```typescript file=@cesdk_web_examples/guides-fills-video-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Check if block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);

    engine.block.destroy(testBlock);

    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // ===== Section 1: Create Video Fill =====
    // Create a graphic block with a video fill
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, 200);
    engine.block.setHeight(basicBlock, 150);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, videoFill);
    engine.block.appendChild(page, basicBlock);

    // Get and verify the current fill
    const fillId = engine.block.getFill(basicBlock);
    const fillType = engine.block.getType(fillId);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'

    // ===== Section 2: Content Fill Modes =====
    // Cover mode: Fill entire block, may crop video
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, 200);
    engine.block.setHeight(coverBlock, 150);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);
    engine.block.appendChild(page, coverBlock);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    console.log('Cover block fill mode:', coverMode); // 'Cover'

    // Contain mode: Fit entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, 200);
    engine.block.setHeight(containBlock, 150);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);
    engine.block.appendChild(page, containBlock);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Get current fill mode
    const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
    console.log('Current fill mode:', currentMode);

    // ===== Section 3: Force Load Video Resource =====
    // Force load video resource to access metadata
    const metadataBlock = engine.block.create('graphic');
    engine.block.setShape(metadataBlock, engine.block.createShape('rect'));
    engine.block.setWidth(metadataBlock, 200);
    engine.block.setHeight(metadataBlock, 150);

    const metadataVideoFill = engine.block.createFill('video');
    engine.block.setString(metadataVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(metadataBlock, metadataVideoFill);
    engine.block.appendChild(page, metadataBlock);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(metadataVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      metadataVideoFill,
      'fill/video/totalDuration'
    );
    console.log('Video total duration:', totalDuration, 'seconds');

    // ===== Section 4: Video as Shape Fill =====
    // Fill a shape with video content
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, 200);
    engine.block.setHeight(ellipseBlock, 150);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);
    engine.block.appendChild(page, ellipseBlock);

    // ===== Section 5: Opacity =====
    // Control opacity for transparency effects
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, 200);
    engine.block.setHeight(opacityBlock, 150);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);
    engine.block.appendChild(page, opacityBlock);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);

    // ===== Section 6: Shared Video Fill =====
    // Share one video fill between multiple blocks for memory efficiency
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, 200);
    engine.block.setHeight(sharedBlock1, 150);
    engine.block.setFill(sharedBlock1, sharedFill);
    engine.block.appendChild(page, sharedBlock1);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, 160);
    engine.block.setHeight(sharedBlock2, 120);
    engine.block.setFill(sharedBlock2, sharedFill);
    engine.block.appendChild(page, sharedBlock2);

    console.log('Shared fill - Two blocks using the same video fill instance');

    // ===== Position all blocks in grid layout =====
    const blocks = [
      basicBlock, // Position 0
      coverBlock, // Position 1
      containBlock, // Position 2
      metadataBlock, // Position 3
      ellipseBlock, // Position 4
      opacityBlock, // Position 5
      sharedBlock1, // Position 6
      sharedBlock2 // Position 7
    ];

    // Position blocks in a grid layout
    const cols = 4;
    const spacing = 10;
    const margin = 50;
    const blockWidth = 200;
    const blockHeight = 150;

    blocks.forEach((block, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      engine.block.setPositionX(block, margin + col * (blockWidth + spacing));
      engine.block.setPositionY(block, margin + row * (blockHeight + spacing));
    });

    console.log('Video fills demonstration complete.');
    console.log('Created', blocks.length, 'blocks with video fills.');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

## Understanding Video Fills

Video fills work in any scene. Create a scene and add a page to get started.

```typescript highlight=highlight-create-scene
// Create a scene with a page
const scene = engine.scene.create('DepthStack');
const page = engine.block.create('page');
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 600);
engine.block.appendChild(scene, page);
```

Before working with fills, verify that the block supports fills.

```typescript highlight=highlight-check-fill-support
    // Check if block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);

    engine.block.destroy(testBlock);
```

## Creating a Video Fill

Create a video fill and apply it to a graphic block:

```typescript highlight=highlight-create-video-fill
    // Create a graphic block with a video fill
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, 200);
    engine.block.setHeight(basicBlock, 150);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, videoFill);
    engine.block.appendChild(page, basicBlock);
```

Retrieve the fill from a block and verify its type:

```typescript highlight=highlight-get-current-fill
// Get and verify the current fill
const fillId = engine.block.getFill(basicBlock);
const fillType = engine.block.getType(fillId);
console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'
```

## Content Fill Modes

Content fill modes control how video content is positioned within the block bounds.

### Cover Mode

Cover mode scales the video to completely fill the block area. Parts of the video may be cropped if the aspect ratios differ.

```typescript highlight=highlight-fill-mode-cover
    // Cover mode: Fill entire block, may crop video
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, 200);
    engine.block.setHeight(coverBlock, 150);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);
    engine.block.appendChild(page, coverBlock);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    console.log('Cover block fill mode:', coverMode); // 'Cover'
```

### Contain Mode

Contain mode scales the video to fit entirely within the block bounds. The complete video is visible, but empty space may appear if aspect ratios differ.

```typescript highlight=highlight-fill-mode-contain
    // Contain mode: Fit entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, 200);
    engine.block.setHeight(containBlock, 150);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);
    engine.block.appendChild(page, containBlock);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');
```

### Getting the Current Mode

```typescript highlight=highlight-get-fill-mode
// Get current fill mode
const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
console.log('Current fill mode:', currentMode);
```

The available modes are:

- `'Crop'` — Default mode, uses crop scale to position content
- `'Cover'` — Fill entire area, may crop content
- `'Contain'` — Show all content, may leave empty space

## Loading Video Resources

Video metadata like duration is only available after the resource loads. Use `forceLoadAVResource()` to ensure the video is loaded before accessing metadata.

```typescript highlight=highlight-force-load-resource
    // Force load video resource to access metadata
    const metadataBlock = engine.block.create('graphic');
    engine.block.setShape(metadataBlock, engine.block.createShape('rect'));
    engine.block.setWidth(metadataBlock, 200);
    engine.block.setHeight(metadataBlock, 150);

    const metadataVideoFill = engine.block.createFill('video');
    engine.block.setString(metadataVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(metadataBlock, metadataVideoFill);
    engine.block.appendChild(page, metadataBlock);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(metadataVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      metadataVideoFill,
      'fill/video/totalDuration'
    );
    console.log('Video total duration:', totalDuration, 'seconds');
```

## Common Use Cases

### Video in Shapes

Fill any shape with video content:

```typescript highlight=highlight-video-shape-fill
    // Fill a shape with video content
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, 200);
    engine.block.setHeight(ellipseBlock, 150);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);
    engine.block.appendChild(page, ellipseBlock);
```

### Opacity Control

Adjust block opacity for transparency effects:

```typescript highlight=highlight-opacity
    // Control opacity for transparency effects
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, 200);
    engine.block.setHeight(opacityBlock, 150);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);
    engine.block.appendChild(page, opacityBlock);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);
```

## Additional Techniques

### Shared Video Fills

Multiple blocks can share the same fill instance, which improves memory efficiency when displaying the same video in multiple locations.

```typescript highlight=highlight-shared-fill
    // Share one video fill between multiple blocks for memory efficiency
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, 200);
    engine.block.setHeight(sharedBlock1, 150);
    engine.block.setFill(sharedBlock1, sharedFill);
    engine.block.appendChild(page, sharedBlock1);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, 160);
    engine.block.setHeight(sharedBlock2, 120);
    engine.block.setFill(sharedBlock2, sharedFill);
    engine.block.appendChild(page, sharedBlock2);

    console.log('Shared fill - Two blocks using the same video fill instance');
```

## Cleanup

Always dispose of the engine when finished to release resources.

```typescript highlight=highlight-cleanup
} finally {
  engine.dispose();
}
```

## Troubleshooting

### Video Fill Not Displaying

If video fills don't appear:

1. Ensure the video URI is accessible and valid
2. Check that the block has a shape assigned before setting the fill
3. Confirm the block has been appended to the page

### Metadata Not Available

If `fill/video/totalDuration` returns unexpected values:

1. Call `engine.block.forceLoadAVResource()` before accessing metadata
2. Await the promise to ensure loading completes
3. Verify the video file exists and is accessible

## API Reference

| Property                   | Type     | Description                            |
| -------------------------- | -------- | -------------------------------------- |
| `fill/video/fileURI`       | `string` | URI of the video file                  |
| `fill/video/totalDuration` | `double` | Total duration of the video in seconds |
| `contentFill/mode`         | `enum`   | Fill mode: 'Crop', 'Cover', 'Contain'  |
| `opacity`                  | `float`  | Block opacity from 0.0 to 1.0          |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support