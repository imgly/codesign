> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Supported Filters and Effects](./filters-and-effects/support.md)

---

Discover all available filters and effects in CE.SDK and learn how to check
if a block supports them.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-support-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-support-server-js)

CE.SDK provides 22 built-in effect types for visual transformations including color adjustments, blur effects, artistic filters, and distortion effects. This reference guide shows how to check effect support and add effects programmatically, followed by detailed property tables for each effect type.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-support-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Supported Filters and Effects Reference
 *
 * Demonstrates how to check effect support and add effects to blocks:
 * - Checking if a block supports effects
 * - Creating and appending effects
 * - Configuring effect properties
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];

    // Define font for text
    const fontUri =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf';
    const typeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: fontUri,
          subFamily: 'Bold',
          weight: 'bold' as const,
          style: 'normal' as const
        }
      ]
    };

    // Create a beautiful gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.02, g: 0.02, b: 0.08, a: 1.0 }, stop: 0 }, // Near black
      { color: { r: 0.04, g: 0.06, b: 0.18, a: 1.0 }, stop: 0.4 }, // Dark navy
      { color: { r: 0.08, g: 0.12, b: 0.28, a: 1.0 }, stop: 0.7 }, // Deep blue
      { color: { r: 0.1, g: 0.15, b: 0.35, a: 1.0 }, stop: 1 } // Dark blue
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create title text: "Supported Filters and Effects" at 80pt (centered)
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Supported Filters and Effects');
    engine.block.setFont(titleText, fontUri, typeface);
    engine.block.setTextFontSize(titleText, 11);
    engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleText, 780);
    engine.block.setWidthMode(titleText, 'Absolute');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, 10);
    engine.block.setPositionY(titleText, 160);

    // Create subtext: "img.ly" at 64pt (closer to title)
    const subtitleText = engine.block.create('text');
    engine.block.appendChild(page, subtitleText);
    engine.block.replaceText(subtitleText, 'img.ly');
    engine.block.setFont(subtitleText, fontUri, typeface);
    engine.block.setTextFontSize(subtitleText, 8);
    engine.block.setTextColor(subtitleText, {
      r: 0.75,
      g: 0.82,
      b: 1.0,
      a: 0.85
    });
    engine.block.setEnum(subtitleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleText, 780);
    engine.block.setWidthMode(subtitleText, 'Absolute');
    engine.block.setHeightMode(subtitleText, 'Auto');
    engine.block.setPositionX(subtitleText, 10);
    engine.block.setPositionY(subtitleText, 210);

    // Check if a block supports effects before applying them
    // Not all block types support effects - verify first to avoid errors

    // Add an image to demonstrate effects (centered below text)
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 300, height: 210 }
    });
    engine.block.appendChild(page, imageBlock);

    // Center the image below the subtext
    engine.block.setPositionX(imageBlock, (800 - 300) / 2); // 250
    engine.block.setPositionY(imageBlock, 310);

    // Image blocks support effects
    const imageSupportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Image supports effects:', imageSupportsEffects); // true

    // Create an effect using the effect type identifier
    // CE.SDK provides 22 built-in effect types (see property tables below)
    const duotoneEffect = engine.block.createEffect('duotone_filter');

    // Append the effect to the image's effect stack
    engine.block.appendEffect(imageBlock, duotoneEffect);

    // Configure effect properties using the property path format:
    // effect/{effect-type}/{property-name}
    // Set duotone colors to match the dark blue gradient background
    engine.block.setColor(duotoneEffect, 'effect/duotone_filter/darkColor', {
      r: 0.02,
      g: 0.04,
      b: 0.12,
      a: 1.0
    }); // Near black blue
    engine.block.setColor(duotoneEffect, 'effect/duotone_filter/lightColor', {
      r: 0.5,
      g: 0.7,
      b: 1.0,
      a: 1.0
    }); // Light blue
    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.8
    );

    // Retrieve all effects applied to a block
    const appliedEffects = engine.block.getEffects(imageBlock);
    console.log('Number of applied effects:', appliedEffects.length);

    // Log each effect's type
    appliedEffects.forEach((effect, index) => {
      const effectType = engine.block.getType(effect);
      console.log(`Effect ${index}: ${effectType}`);
    });

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/effect-support-demo.png`, buffer);

    console.log('Exported result to output/effect-support-demo.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers checking effect support on blocks, adding effects programmatically, and the complete list of available effect types with their properties. For detailed tutorials on configuring and combining multiple effects, see the [Apply Filters and Effects](./filters-and-effects/apply.md) guide.

## Check Effect Support

Before applying effects to a block, verify whether it supports them using `supportsEffects()`. Not all block types can have effects applied.

```typescript highlight-check-effect-support
    // Check if a block supports effects before applying them
    // Not all block types support effects - verify first to avoid errors

    // Add an image to demonstrate effects (centered below text)
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 300, height: 210 }
    });
    engine.block.appendChild(page, imageBlock);

    // Center the image below the subtext
    engine.block.setPositionX(imageBlock, (800 - 300) / 2); // 250
    engine.block.setPositionY(imageBlock, 310);

    // Image blocks support effects
    const imageSupportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Image supports effects:', imageSupportsEffects); // true
```

Effect support is available for:

- **Graphic blocks** with image or video fills
- **Shape blocks** with fills
- **Text blocks** (with limited effect types)
- **Page blocks** (particularly when they have background fills)

## Add an Effect

Create an effect using `createEffect()` with the effect type identifier, then attach it to a block with `appendEffect()`.

```typescript highlight-add-effect
    // Create an effect using the effect type identifier
    // CE.SDK provides 22 built-in effect types (see property tables below)
    const duotoneEffect = engine.block.createEffect('duotone_filter');

    // Append the effect to the image's effect stack
    engine.block.appendEffect(imageBlock, duotoneEffect);
```

## Configure Effect Properties

Configure effect parameters using setter methods. Property paths follow the format `effect/{effect-type}/{property-name}`.

```typescript highlight-configure-effect
// Configure effect properties using the property path format:
// effect/{effect-type}/{property-name}
// Set duotone colors to match the dark blue gradient background
engine.block.setColor(duotoneEffect, 'effect/duotone_filter/darkColor', {
  r: 0.02,
  g: 0.04,
  b: 0.12,
  a: 1.0
}); // Near black blue
engine.block.setColor(duotoneEffect, 'effect/duotone_filter/lightColor', {
  r: 0.5,
  g: 0.7,
  b: 1.0,
  a: 1.0
}); // Light blue
engine.block.setFloat(
  duotoneEffect,
  'effect/duotone_filter/intensity',
  0.8
);
```

CE.SDK provides typed setter methods for different parameter types:

- **`setFloat()`** - For intensity, amount, and decimal values
- **`setInt()`** - For discrete values like pixel sizes
- **`setString()`** - For file URIs (LUT files)
- **`setBool()`** - For enabling or disabling features
- **`setColor()`** - For color values (RGBA format)

## Retrieve Applied Effects

Use `getEffects()` to retrieve all effects applied to a block.

```typescript highlight-get-effects
    // Retrieve all effects applied to a block
    const appliedEffects = engine.block.getEffects(imageBlock);
    console.log('Number of applied effects:', appliedEffects.length);

    // Log each effect's type
    appliedEffects.forEach((effect, index) => {
      const effectType = engine.block.getType(effect);
      console.log(`Effect ${index}: ${effectType}`);
    });
```

## Effects

The following tables document all available effect types and their configurable properties.

## Adjustments Type

An effect block for basic image adjustments.

This section describes the properties available for the **Adjustments Type** (`//ly.img.ubq/effect/adjustments`) block type.

| Property                         | Type    | Default | Description                          |
| -------------------------------- | ------- | ------- | ------------------------------------ |
| `effect/adjustments/blacks`      | `Float` | `0`     | Adjustment of only the blacks.       |
| `effect/adjustments/brightness`  | `Float` | `0`     | Adjustment of the brightness.        |
| `effect/adjustments/clarity`     | `Float` | `0`     | Adjustment of the detail.            |
| `effect/adjustments/contrast`    | `Float` | `0`     | Adjustment of the contrast.          |
| `effect/adjustments/exposure`    | `Float` | `0`     | Adjustment of the exposure.          |
| `effect/adjustments/gamma`       | `Float` | `0`     | Gamma correction, non-linear.        |
| `effect/adjustments/highlights`  | `Float` | `0`     | Adjustment of only the highlights.   |
| `effect/adjustments/saturation`  | `Float` | `0`     | Adjustment of the saturation.        |
| `effect/adjustments/shadows`     | `Float` | `0`     | Adjustment of only the shadows.      |
| `effect/adjustments/sharpness`   | `Float` | `0`     | Adjustment of the sharpness.         |
| `effect/adjustments/temperature` | `Float` | `0`     | Adjustment of the color temperature. |
| `effect/adjustments/whites`      | `Float` | `0`     | Adjustment of only the whites.       |
| `effect/enabled`                 | `Bool`  | `true`  | Whether the effect is enabled.       |

## Cross Cut Type

An effect that distorts the image with horizontal slices.

This section describes the properties available for the **Cross Cut Type** (`//ly.img.ubq/effect/cross_cut`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/cross_cut/offset` | `Float` | `0.07`  | Horizontal offset per slice.   |
| `effect/cross_cut/slices` | `Float` | `5`     | Number of horizontal slices.   |
| `effect/cross_cut/speedV` | `Float` | `0.5`   | Vertical slice position.       |
| `effect/cross_cut/time`   | `Float` | `1`     | Randomness input.              |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |

## Dot Pattern Type

An effect that displays the image using a dot matrix.

This section describes the properties available for the **Dot Pattern Type** (`//ly.img.ubq/effect/dot_pattern`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/dot_pattern/blur` | `Float` | `0.3`   | Global blur.                   |
| `effect/dot_pattern/dots` | `Float` | `30`    | Number of dots.                |
| `effect/dot_pattern/size` | `Float` | `0.5`   | Size of an individual dot.     |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |

## Duotone Filter Type

An effect that applies a two-tone color mapping.

This section describes the properties available for the **Duotone Filter Type** (`//ly.img.ubq/effect/duotone_filter`) block type.

| Property                           | Type    | Default                     | Description                                                                       |
| ---------------------------------- | ------- | --------------------------- | --------------------------------------------------------------------------------- |
| `effect/duotone_filter/darkColor`  | `Color` | `{"r":0,"g":0,"b":0,"a":0}` | The darker of the two colors. Negative filter intensities emphasize this color.   |
| `effect/duotone_filter/intensity`  | `Float` | `0`                         | The mixing weight of the two colors in the range \[-1, 1].                         |
| `effect/duotone_filter/lightColor` | `Color` | `{"r":0,"g":0,"b":0,"a":0}` | The brighter of the two colors. Positive filter intensities emphasize this color. |
| `effect/enabled`                   | `Bool`  | `true`                      | Whether the effect is enabled.                                                    |

## Extrude Blur Type

An effect that applies a radial extrude blur.

This section describes the properties available for the **Extrude Blur Type** (`//ly.img.ubq/effect/extrude_blur`) block type.

| Property                     | Type    | Default | Description                    |
| ---------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`             | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/extrude_blur/amount` | `Float` | `0.2`   | Blur intensity.                |

## Glow Type

An effect that applies an artificial glow.

This section describes the properties available for the **Glow Type** (`//ly.img.ubq/effect/glow`) block type.

| Property               | Type    | Default | Description                    |
| ---------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/glow/amount`   | `Float` | `0.5`   | Glow brightness.               |
| `effect/glow/darkness` | `Float` | `0.3`   | Glow darkness.                 |
| `effect/glow/size`     | `Float` | `4`     | Intensity of the glow.         |

## Green Screen Type

An effect that replaces a specific color with transparency.

This section describes the properties available for the **Green Screen Type** (`//ly.img.ubq/effect/green_screen`) block type.

| Property                         | Type    | Default                     | Description                                                                                          |
| -------------------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `effect/enabled`                 | `Bool`  | `true`                      | Whether the effect is enabled.                                                                       |
| `effect/green_screen/colorMatch` | `Float` | `0.4`                       | Threshold between the source color and the from color.                                               |
| `effect/green_screen/fromColor`  | `Color` | `{"r":0,"g":1,"b":0,"a":1}` | The color to be replaced.                                                                            |
| `effect/green_screen/smoothness` | `Float` | `0.08`                      | Controls the rate at which the color transition increases when the similarity threshold is exceeded. |
| `effect/green_screen/spill`      | `Float` | `0`                         | Controls the desaturation of the source color to reduce color spill.                                 |

## Half Tone Type

An effect that overlays a halftone pattern.

This section describes the properties available for the **Half Tone Type** (`//ly.img.ubq/effect/half_tone`) block type.

| Property                 | Type    | Default | Description                    |
| ------------------------ | ------- | ------- | ------------------------------ |
| `effect/enabled`         | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/half_tone/angle` | `Float` | `0`     | Angle of pattern.              |
| `effect/half_tone/scale` | `Float` | `0.5`   | Scale of pattern.              |

## Linocut Type

An effect that overlays a linocut pattern.

This section describes the properties available for the **Linocut Type** (`//ly.img.ubq/effect/linocut`) block type.

| Property               | Type    | Default | Description                    |
| ---------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/linocut/scale` | `Float` | `0.5`   | Scale of pattern.              |

## Liquid Type

An effect that applies a liquefy distortion.

This section describes the properties available for the **Liquid Type** (`//ly.img.ubq/effect/liquid`) block type.

| Property               | Type    | Default | Description                     |
| ---------------------- | ------- | ------- | ------------------------------- |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled.  |
| `effect/liquid/amount` | `Float` | `0.06`  | Severity of the applied effect. |
| `effect/liquid/scale`  | `Float` | `0.62`  | Global scale.                   |
| `effect/liquid/time`   | `Float` | `0.5`   | Continuous randomness input.    |

## Lut Filter Type

An effect that applies a color lookup table (LUT).

This section describes the properties available for the **Lut Filter Type** (`//ly.img.ubq/effect/lut_filter`) block type.

| Property                                | Type     | Default | Description                                                |
| --------------------------------------- | -------- | ------- | ---------------------------------------------------------- |
| `effect/enabled`                        | `Bool`   | `true`  | Whether the effect is enabled.                             |
| `effect/lut_filter/horizontalTileCount` | `Int`    | `5`     | The horizontal number of tiles contained in the LUT image. |
| `effect/lut_filter/intensity`           | `Float`  | `1`     | A value in the range of \[0, 1]. Defaults to 1.0.           |
| `effect/lut_filter/lutFileURI`          | `String` | `""`    | The URI to a LUT PNG file.                                 |
| `effect/lut_filter/verticalTileCount`   | `Int`    | `5`     | The vertical number of tiles contained in the LUT image.   |

## Mirror Type

An effect that mirrors the image along a central axis.

This section describes the properties available for the **Mirror Type** (`//ly.img.ubq/effect/mirror`) block type.

| Property             | Type   | Default | Description                    |
| -------------------- | ------ | ------- | ------------------------------ |
| `effect/enabled`     | `Bool` | `true`  | Whether the effect is enabled. |
| `effect/mirror/side` | `Int`  | `1`     | Axis to mirror along.          |

## Outliner Type

An effect that highlights the outlines in an image.

This section describes the properties available for the **Outliner Type** (`//ly.img.ubq/effect/outliner`) block type.

| Property                      | Type    | Default | Description                                  |
| ----------------------------- | ------- | ------- | -------------------------------------------- |
| `effect/enabled`              | `Bool`  | `true`  | Whether the effect is enabled.               |
| `effect/outliner/amount`      | `Float` | `0.5`   | Intensity of edge highlighting.              |
| `effect/outliner/passthrough` | `Float` | `0.5`   | Visibility of input image in non-edge areas. |

## Pixelize Type

An effect that pixelizes the image.

This section describes the properties available for the **Pixelize Type** (`//ly.img.ubq/effect/pixelize`) block type.

| Property                              | Type   | Default | Description                         |
| ------------------------------------- | ------ | ------- | ----------------------------------- |
| `effect/enabled`                      | `Bool` | `true`  | Whether the effect is enabled.      |
| `effect/pixelize/horizontalPixelSize` | `Int`  | `20`    | The number of pixels on the x-axis. |
| `effect/pixelize/verticalPixelSize`   | `Int`  | `20`    | The number of pixels on the y-axis. |

## Posterize Type

An effect that reduces the number of colors in the image.

This section describes the properties available for the **Posterize Type** (`//ly.img.ubq/effect/posterize`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/posterize/levels` | `Float` | `3`     | Number of color levels.        |

## Radial Pixel Type

An effect that reduces the image into radial pixel rows.

This section describes the properties available for the **Radial Pixel Type** (`//ly.img.ubq/effect/radial_pixel`) block type.

| Property                       | Type    | Default | Description                                                   |
| ------------------------------ | ------- | ------- | ------------------------------------------------------------- |
| `effect/enabled`               | `Bool`  | `true`  | Whether the effect is enabled.                                |
| `effect/radial_pixel/radius`   | `Float` | `0.1`   | Radius of an individual row of pixels, relative to the image. |
| `effect/radial_pixel/segments` | `Float` | `0.01`  | Proportional size of a pixel in each row.                     |

## Recolor Type

An effect that replaces one color with another.

This section describes the properties available for the **Recolor Type** (`//ly.img.ubq/effect/recolor`) block type.

| Property                         | Type    | Default                     | Description                                                                                          |
| -------------------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `effect/enabled`                 | `Bool`  | `true`                      | Whether the effect is enabled.                                                                       |
| `effect/recolor/brightnessMatch` | `Float` | `1`                         | Affects the weight of brightness when calculating color similarity.                                  |
| `effect/recolor/colorMatch`      | `Float` | `0.4`                       | Threshold between the source color and the from color.                                               |
| `effect/recolor/fromColor`       | `Color` | `{"r":1,"g":1,"b":1,"a":1}` | The color to be replaced.                                                                            |
| `effect/recolor/smoothness`      | `Float` | `0.08`                      | Controls the rate at which the color transition increases when the similarity threshold is exceeded. |
| `effect/recolor/toColor`         | `Color` | `{"r":0,"g":0,"b":1,"a":1}` | The color to replace with.                                                                           |

## Sharpie Type

Cartoon-like effect.

This section describes the properties available for the **Sharpie Type** (`//ly.img.ubq/effect/sharpie`) block type.

| Property         | Type   | Default | Description                    |
| ---------------- | ------ | ------- | ------------------------------ |
| `effect/enabled` | `Bool` | `true`  | Whether the effect is enabled. |

## Shifter Type

An effect that shifts individual color channels.

This section describes the properties available for the **Shifter Type** (`//ly.img.ubq/effect/shifter`) block type.

| Property                | Type    | Default | Description                    |
| ----------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`        | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/shifter/amount` | `Float` | `0.05`  | Intensity of the shift.        |
| `effect/shifter/angle`  | `Float` | `0.3`   | Shift direction.               |

## Tilt Shift Type

An effect that applies a tilt-shift blur.

This section describes the properties available for the **Tilt Shift Type** (`//ly.img.ubq/effect/tilt_shift`) block type.

| Property                     | Type    | Default | Description                    |
| ---------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`             | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/tilt_shift/amount`   | `Float` | `0.016` | Blur intensity.                |
| `effect/tilt_shift/position` | `Float` | `0.4`   | Horizontal position in image.  |

## Tv Glitch Type

An effect that mimics TV banding and distortion.

This section describes the properties available for the **Tv Glitch Type** (`//ly.img.ubq/effect/tv_glitch`) block type.

| Property                       | Type    | Default | Description                        |
| ------------------------------ | ------- | ------- | ---------------------------------- |
| `effect/enabled`               | `Bool`  | `true`  | Whether the effect is enabled.     |
| `effect/tv_glitch/distortion`  | `Float` | `3`     | Rough horizontal distortion.       |
| `effect/tv_glitch/distortion2` | `Float` | `1`     | Fine horizontal distortion.        |
| `effect/tv_glitch/rollSpeed`   | `Float` | `1`     | Vertical offset.                   |
| `effect/tv_glitch/speed`       | `Float` | `2`     | Number of changes per time change. |

## Vignette Type

An effect that adds a vignette (darkened corners).

This section describes the properties available for the **Vignette Type** (`//ly.img.ubq/effect/vignette`) block type.

| Property                   | Type    | Default | Description                    |
| -------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`           | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/vignette/darkness` | `Float` | `1`     | Brightness of vignette.        |
| `effect/vignette/offset`   | `Float` | `1`     | Radial offset.                 |

## Next Steps

- [Apply Filters and Effects](./filters-and-effects/apply.md) - Learn how to configure, combine, and manage multiple effects



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support