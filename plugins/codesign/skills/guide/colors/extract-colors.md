> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Extract Dominant Colors](./colors/extract-colors.md)

---

Pull the most prominent colors out of a block on the server. The CE.SDK Node.js packages return the same palette as the browser, which makes it a good fit for batch color analysis, tagging, and metadata pipelines.

`engine.block.getDominantColors()` analyzes the rendered appearance of a block and returns its most prominent colors, sorted from most to least dominant. It runs headlessly, so no browser is required — the WASM-based `@cesdk/node` package renders on the CPU, while `@cesdk/node-native` uses the GPU when available.

## Extracting Dominant Colors

Initialize the engine, load or build a scene, then analyze a block.

```typescript
import CreativeEngine from '@cesdk/node';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
});

await engine.scene.load('https://example.com/scene.scene');

const [block] = engine.block.findByType('graphic');
const colors = await engine.block.getDominantColors(block);

for (const { r, g, b, weight } of colors) {
  console.log(`rgb(${r}, ${g}, ${b}) covers ${Math.round(weight * 100)}%`);
}

engine.dispose();
```

The call is asynchronous because the engine first resolves the block's final layout. If the block still has assets loading — for example an image fill whose source has not finished downloading — the call waits for them to settle instead of returning an empty result.

## Understanding the Result

Each entry is a `DominantColor` describing one extracted color:

| Property | Type     | Description                                                      |
| -------- | -------- | ---------------------------------------------------------------- |
| `r`      | `number` | Red component in sRGB, normalized to `0`–`1`.                    |
| `g`      | `number` | Green component in sRGB, normalized to `0`–`1`.                  |
| `b`      | `number` | Blue component in sRGB, normalized to `0`–`1`.                   |
| `weight` | `number` | Share of analyzed pixels this color represents, from `0` to `1`. |

Colors are sorted by `weight` in descending order, so `colors[0]` is always the most dominant. The weights of a single call sum to `1`, which lets you treat them as percentages of the block's visible surface.

To store the colors as hex strings — for example in a database or an image-tagging service — convert each one:

```typescript
const toHex = (value: number) =>
  Math.round(value * 255)
    .toString(16)
    .padStart(2, '0');

const hexColors = colors.map(({ r, g, b }) => `#${toHex(r)}${toHex(g)}${toHex(b)}`);
```

## Configuring the Analysis

The optional second argument controls how many colors you get back and whether near-white pixels are considered.

```typescript
const colors = await engine.block.getDominantColors(block, {
  count: 3,
  ignoreWhite: true,
});
```

| Option        | Type      | Default | Description                                                                                                                            |
| ------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `count`       | `number`  | `5`     | Number of colors to extract. The palette may contain fewer entries for images with little variation, and is empty when `count` is `0`. |
| `ignoreWhite` | `boolean` | `false` | When `true`, near-white pixels are skipped. Useful for product shots on white backgrounds so the background does not dominate.          |

## What the Colors Reflect

The analysis runs on the block's rendered output, not its source file. That means:

- **Crops, adjustments, and effects are included.** If you crop an image, lower its saturation, or apply a filter, the returned palette reflects the result, not the original asset.
- **Transparent pixels are skipped.** Fully or mostly transparent areas are excluded, so a logo on a transparent background returns the logo's colors rather than blending in the empty space.
- **The block must be visible.** It has to be attached to a scene and render visible content. Analyzing a detached or fully transparent block returns no colors.

## Analyzing an Image File

A common server task is extracting colors straight from an uploaded image. Build a minimal scene around an image fill, then analyze the graphic block:

```typescript
const scene = engine.scene.create();
const page = engine.block.create('page');
engine.block.appendChild(scene, page);

const graphic = engine.block.create('graphic');
engine.block.setShape(graphic, engine.block.createShape('rect'));
const fill = engine.block.createFill('image');
engine.block.setString(fill, 'fill/image/imageFileURI', 'https://example.com/photo.jpg');
engine.block.setFill(graphic, fill);
engine.block.appendChild(page, graphic);

const colors = await engine.block.getDominantColors(graphic, { count: 5, ignoreWhite: true });
```

## Troubleshooting

### The call never resolves

`getDominantColors()` waits for pending assets to finish loading. Make sure the block's resources are reachable — a broken image URI keeps the asset in a pending state. Confirm the URI resolves from your server environment.

### The result is empty

- Check that `count` is greater than `0`.
- Confirm the block is attached to a scene and renders visible content.
- A fully transparent block, or one whose only color is filtered out by `ignoreWhite`, returns no colors.

### The colors look different from the source image

This is expected. The palette is taken from the rendered block, so any crop, color adjustment, filter, or opacity applied to the block changes the result.

## API Reference

| Method                                            | Description                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `engine.block.getDominantColors(block, options)` | Returns a promise resolving to the block's dominant colors, sorted by weight. |

| Type                    | Properties              | Description                                  |
| ----------------------- | ----------------------- | -------------------------------------------- |
| `DominantColor`         | `r`, `g`, `b`, `weight` | A single extracted color and its prominence. |
| `DominantColorsOptions` | `count`, `ignoreWhite`  | Options controlling the analysis.            |

## Next Steps

- [Color Basics](./colors/basics.md) — Review the three color spaces CE.SDK supports and when to use each
- [Apply Colors](./colors/apply.md) — Apply colors to design elements programmatically



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support