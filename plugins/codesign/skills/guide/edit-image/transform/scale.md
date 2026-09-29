> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Scale](./edit-image/transform/scale.md)

---

Use the CE.SDK headless Server Mode to resize and scale design blocks without rendering a client editor. This guide shows how to scale image elements with Node.js so you can prepare assets, generate variants, or enforce layout rules in automated jobs.

## Requirements

- **Node.js 22** or newer
- A CE.SDK server package: `npm install @cesdk/node@$UBQ_VERSION$` (WASM) or `npm install @cesdk/node-native@$UBQ_VERSION$` (native) — the engine API is identical

## What You’ll Learn

- Scale an image block uniformly or along a single axis.
- Scale blocks together while keeping their relative layout.
- Lock scaling and transformations in templates.

## When to Use

Server-side scaling helps when you need to:

- **Emphasize or de-emphasize** elements.
- **Fit** images to available space without cropping.
- Enable **dynamic layouts** or automated resizing.
- Create **zoom** effects programmatically.

## How Scaling Works

Scaling uses the `scale(block, scale:number, anchorX, anchorY)` function, with the following **parameters**:

| Parameter | Description | Values |
| --- | --- | --- |
| `block` | Handle (ID) of the block to scale. | `string`|
| `scale` | Scale factor to apply. | **1.0** keeps the original size.<br> **>1.0** enlarges the block.</br>**\< 1.0** shrinks it. |
| `anchorX` <br>`anchorY`</br>| Relative width position  <br>Relative height position</br> | **Top** = 0  <br>**Center** = 0.5</br> **Bottom** = 1 <br>**Defaults** =`0`</br> |

A value of `2.0`, for example, makes the block twice as large.

<details>
  <summary>Test a sample file</summary>

  1. Run `npm install @cesdk/node@$UBQ_VERSION$` (or `npm install @cesdk/node-native@$UBQ_VERSION$` for the native package) at the root of your project.
  2. Add credentials to `.env`:
     ```bash
     LICENSE_KEY="<your_license_key>"
     ```

  ````
  3. Create `scale.js` and paste the following script:

  ```js title="scale.js"
  import 'dotenv/config';
  import fs from 'fs/promises';
  import path from 'path';
  import CreativeEngine from '@cesdk/node';

  async function run() {
    const engine = await CreativeEngine.init({
      license: process.env.LICENSE_KEY
    });

    try {
      const scene = engine.scene.create();
      const page = engine.block.create('page');
      engine.block.appendChild(scene, page);

      const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';
      const graphic = engine.block.create('graphic');
      engine.block.setShape(graphic, engine.block.createShape('rect'));

      const imageFill = engine.block.createFill('image');
      engine.block.setFill(graphic, imageFill);
      await engine.block.addImageFileURIToSourceSet(
        imageFill,
        'fill/image/sourceSet',
        imageUrl
      );
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.appendChild(page, graphic);

      const [source] = engine.block.getSourceSet(
        imageFill,
        'fill/image/sourceSet'
      );
      if (!source) {
        throw new Error(`Image metadata not available for ${imageUrl}`);
      }

      engine.block.setSize(graphic, source.width, source.height, {
        sizeMode: 'Absolute'
      });
      engine.block.resetCrop(graphic);
      engine.block.scale(graphic, 2, 0.5, 0.5);

      const blob = await engine.block.export(graphic, { mimeType: 'image/png' });
      const outputPath = path.resolve('./scaled-image.png');
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, Buffer.from(await blob.arrayBuffer()));
      console.log(`Exported scaled image to ${outputPath}`);
    } finally {
      engine.dispose();
    }
  }

  run().catch((error) => {
    console.error('Scaling demo failed:', error);
  });
  ````

  4. Run `node scale.js`.
  5. Inspect `sample-scaled.png` to confirm that each block doubled its size.
</details>

## Scale an Image Uniformly

Scaling uniformly keeps the image’s **aspect ratio intact** while making it larger or smaller. This allows for applying zoom levels without stretching or squashing the artwork. For example:

```js
engine.block.scale(blockId, 1.5);
```

The preceding code:

- Scales the image to 150% of its original size.
- Doesn’t change the origin anchor point.

As a result, the image expands down and to the right.

### Anchor Point

By default, the anchor point for the image when scaling is **the top left**. The scale function has two optional parameters:

- `x` to move the anchor point along the width.
- `y` to move the anchor point along the height.

They can have values between 0.0 and 1.0. For example:

```js
engine.block.scale(blockId, 1.5, 0.5, 0.5)
```

This function:

1. Scales the image to **150%** of its original size.
2. The origin anchor point is 0.5, 0.5, so the image expands from the **center**.

## Scale Non-Uniformly

To stretch or compress only one axis, thus distorting an image, use the **width** or **height** function. For example, to scale an image horizontally, you can use:

```js
engine.block.setWidthMode(graphic, 'Absolute');
const width = engine.block.getWidth(graphic) * 1.5;
engine.block.setWidth(graphic, width, true );
```

The preceding code:

1. Sets the width position as `'Absolute'` so width changes use a fixed pixel value instead of a relative layout mode.
2. Reads the current width and multiplies it by 1.5 to compute a new width that’s 150% of the original.
3. Writes the new width back to the block while keeping the height in proportion when available.

As a result, it stretches the element horizontally by the calculated factor:

<Picture src={OneAxis15} style={{ width: '85%' }} alt="Panoramic picture by scaling the x axis by 1.5" formats={['webp']} />

Use this to:

- Create panoramic crops.
- Compensate for aspect ratios during automation.

Below are two examples of scaling the original image in the x direction only:

1. Double the width:

```js
const width = engine.block.getWidth(graphic) * 2;
```

<Picture src={OneAxis2} style={{ width: '85%' }} alt="Panoramic picture by scaling the x axis by 2" formats={['webp']} />

2. Scale horizontally by 2.5:

```js
const width = engine.block.getWidth(graphic) * 2.5;
```

<Picture src={OneAxis25} style={{ width: '85%' }} alt="Panoramic picture by scaling the x axis by 2.5" formats={['webp']} />

## Scale elements together

Group blocks to scale them proportionally:

```js
const groupId = engine.block.group([imageId, textId]);
engine.block.scale(groupId, 1.75, 0.75, 0.5)
```

The preceding code scales the entire group to 75%.

> **Note:** Call `engine.block.findAllProperties(groupId)` if you are unsure whether a block exposes width/height.

## Lock Scaling in Templates

Lock scaling when you must preserve a template’s layout. This is useful for:

- Brand assets
- Campaign creatives
- Collaboration workflows
- Fixed dimensions swapping editors

When working with templates, **prevent users from scaling** blocks by turning off the `layer/resize` scope:

```js
// Prevent scaling/resizing of a block
engine.block.setScopeEnabled(imageId, 'layer/resize', false);
```

### Lock All Transformations

Available block transformations are the following:

- Move
- Resize
- Rotate

To **lock** all transformations, use the following function:

```js
// Lock all transforms
engine.block.setTransformLocked(imageId, true);
```

To check if scaling is currently allowed, log the output if `isScopeEnabled`:

```js
// Check if resize is enabled
const canResize = engine.block.isScopeEnabled(imageId, 'layer/resize');
console.log('layer/resize scope enabled?', canResize);
```

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| `Property not found` when scaling | Read width/height first (`findAllProperties`) and update those values instead of transform keys. |
| Elements distort unexpectedly | Keep the height in sync with the width unless you intentionally stretch. |
| Export shows the original size | Confirm that the code appends the block to a page before scaling, and reuse the updated page when exporting. |

## API references in this guide

| API | Usage |
| --- | --- |
| `block.scale` | Performs uniform or anchored scaling on blocks and groups. |
| `block.setWidthMode` | Enables absolute sizing before changing a single axis. |
| `block.getWidth` | Reads the current width before non-uniform scaling. |
| `block.setWidth` | Writes the adjusted width after single-axis scaling. |
| `block.setCropScaleX` | Pairs directional scaling with crop adjustments. |
| `block.group` | Groups blocks so they scale together. |
| `block.findAllProperties` | Discovers available properties before scaling unfamiliar blocks. |
| `block.getFloat` | Retrieves numeric properties when clamping scale values. |
| `block.setFloat` | Writes constrained width/height values after clamping. |
| `block.setScopeEnabled` | Toggles the `layer/resize` scope to lock scaling in templates. |
| `block.setTransformLocked` | Locks all transform scopes when templates must stay fixed. |
| `block.isScopeEnabled` | Checks whether scaling is currently permitted on a block. |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support