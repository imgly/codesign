> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Stickers](./stickers.md) > [Create Stickers](./stickers-and-shapes/create-edit/create-stickers.md)

---

Create stickers from images for use in your designs, perfect for adding icons, logos, emoji, and detailed multi-color graphics that preserve their original appearance.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-create-stickers-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-stickers-and-shapes-create-stickers-server-js)

Stickers are graphic blocks with image fills that cannot be recolored. They work well for icons, brand logos, emoji, and complex multi-color graphics. Unlike shapes (which use solid or gradient fills and can be recolored), stickers preserve the original colors and details of the source image.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-create-stickers-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Stickers
 *
 * Demonstrates creating stickers programmatically in Node.js:
 * - Creating stickers with createFill (manual construction)
 * - Setting sticker properties
 * - Creating multiple stickers
 * - Preserving aspect ratios
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 450, height: 250 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create graphic block with image fill
  const sticker = engine.block.create('graphic');

  // Set a shape (required for graphic blocks to be visible)
  engine.block.setShape(sticker, engine.block.createShape('rect'));

  // Create and apply image fill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg'
  );
  engine.block.setFill(sticker, imageFill);

  // Set size and position (preserve aspect ratio)
  const naturalWidth = engine.block.getWidth(sticker) || 100;
  const naturalHeight = engine.block.getHeight(sticker) || 100;
  const scale = 80 / Math.max(naturalWidth, naturalHeight);
  engine.block.setWidth(sticker, naturalWidth * scale);
  engine.block.setHeight(sticker, naturalHeight * scale);
  engine.block.setPositionX(sticker, 185);
  engine.block.setPositionY(sticker, 85);

  // Prevent cropping and mark as sticker
  if (engine.block.supportsContentFillMode(sticker)) {
    engine.block.setContentFillMode(sticker, 'Contain');
  }
  engine.block.setKind(sticker, 'Sticker');

  // Add to scene
  engine.block.appendChild(page, sticker);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/create-stickers-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/create-stickers-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers creating stickers from images and setting sticker properties programmatically in a headless Node.js environment.

## Creating Stickers from Images

In Node.js environments, we build stickers using manual construction with the block API. We create a graphic block, set a shape (required for visibility), create an image fill, and apply it to the block. We read the natural dimensions, calculate a scale factor to preserve aspect ratio, and apply the scaled size. Setting the kind to 'Sticker' prevents recoloring and provides appropriate editor controls.

```typescript highlight-basic-sticker
  // Create graphic block with image fill
  const sticker = engine.block.create('graphic');

  // Set a shape (required for graphic blocks to be visible)
  engine.block.setShape(sticker, engine.block.createShape('rect'));

  // Create and apply image fill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg'
  );
  engine.block.setFill(sticker, imageFill);

  // Set size and position (preserve aspect ratio)
  const naturalWidth = engine.block.getWidth(sticker) || 100;
  const naturalHeight = engine.block.getHeight(sticker) || 100;
  const scale = 80 / Math.max(naturalWidth, naturalHeight);
  engine.block.setWidth(sticker, naturalWidth * scale);
  engine.block.setHeight(sticker, naturalHeight * scale);
  engine.block.setPositionX(sticker, 185);
  engine.block.setPositionY(sticker, 85);

  // Prevent cropping and mark as sticker
  if (engine.block.supportsContentFillMode(sticker)) {
    engine.block.setContentFillMode(sticker, 'Contain');
  }
  engine.block.setKind(sticker, 'Sticker');

  // Add to scene
  engine.block.appendChild(page, sticker);
```

We preserve aspect ratio by scaling the natural dimensions proportionally. The 'Contain' fill mode ensures the entire image displays without cropping. Setting a shape is required for graphic blocks to be visible.

## Sticker vs Shape Decision

Choose between stickers and shapes based on your requirements:

| Requirement | Use Stickers | Use Shapes |
| --- | --- | --- |
| Multi-color graphics | ✓ Yes | ✗ No (single fill) |
| Recolorable | ✗ No | ✓ Yes |
| Preserve original artwork | ✓ Yes | ✗ N/A |
| Boolean operations | ✗ No | ✓ Yes |
| Complex paths/gradients | ✓ Yes | ✗ Limited |
| Icons, logos, emoji | ✓ Preferred | - |

## Troubleshooting

### Sticker Not Appearing

Verify the image URL returns a valid image. Check that the sticker is added to the current page. Ensure dimensions are non-zero. Confirm the image format is supported (SVG, PNG, JPG).

### Manually Created Sticker Is Blank

When creating graphic blocks manually, you must set a shape before the fill becomes visible. Call `engine.block.setShape(graphic, engine.block.createShape('rect'))` after creating the block. The `addImage()` convenience API handles this automatically.

### Sticker Appears Blurry

For raster stickers, ensure source image resolution matches or exceeds display size. Use SVG stickers for scalable graphics that remain sharp at any size.

### Sticker Appears Cropped

Stickers may appear cropped if the content fill mode defaults to 'Cover'. Set the mode to 'Contain' to display the full image: `engine.block.setContentFillMode(sticker, 'Contain')`. Always check support first with `supportsContentFillMode()`.

### Sticker Cannot Be Recolored

This is expected behavior—stickers preserve original colors. For recolorable graphics, create shapes with vector paths instead. For simple single-color graphics, consider using a vector path shape.

## API Reference

Quick reference for sticker creation methods in Node.js:

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.create('graphic')` | Creation | Create graphic block manually |
| `engine.block.createShape('rect')` | Shapes | Create shape (required for visibility) |
| `engine.block.setShape(graphic, shape)` | Shapes | Apply shape to graphic block |
| `engine.block.createFill('image')` | Fills | Create image fill |
| `engine.block.setFill(graphic, fill)` | Fills | Apply fill to graphic block |
| `engine.block.setString(fill, prop, uri)` | Fills | Set image URI on fill |
| `engine.block.supportsContentFillMode(id)` | Content | Check if block supports fill mode |
| `engine.block.setContentFillMode(id, mode)` | Content | Set fill mode ('Contain' or 'Cover') |
| `engine.block.setKind(id, 'Sticker')` | Configuration | Mark block as sticker |
| `engine.block.setPositionX/Y(id, val)` | Transform | Set position |
| `engine.block.setWidth/Height(id, val)` | Transform | Set dimensions |
| `engine.block.getWidth/Height(id)` | Transform | Get current dimensions |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add to scene |
| `engine.block.findByType('page')` | Scene | Find page blocks |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support