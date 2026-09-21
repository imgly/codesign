> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Apply Blur](./filters-and-effects/blur.md)

---

Apply blur effects to design elements using CE.SDK's dedicated blur system for
creating depth, focus, and atmospheric effects.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-blur-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-blur-server-js)

Unlike general effects that stack on elements, blur is a dedicated feature with its own API methods. Each block supports exactly one blur at a time, though the same blur instance can be shared across multiple blocks. CE.SDK provides four blur types: **uniform** for consistent softening, **linear** and **mirrored** for gradient-based effects along axes, and **radial** for circular focal points.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-blur-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Blur Effects
 *
 * Demonstrates applying blur effects to design elements:
 * - Checking blur support
 * - Creating and applying blur effects
 * - Configuring blur parameters for different types
 * - Enabling/disabling blur
 * - Sharing blur across blocks
 * - Exporting results
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create an image block to check blur support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if the block supports blur - graphic blocks with shapes support blur
  const supportsBlur = engine.block.supportsBlur(sampleBlock);
  console.log('Block supports blur:', supportsBlur);

  // Create a radial blur effect
  const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');

  // Configure radial blur parameters
  engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
  engine.block.setFloat(blur, 'blur/radial/radius', 100);
  engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
  engine.block.setFloat(blur, 'blur/radial/x', 0.5);
  engine.block.setFloat(blur, 'blur/radial/y', 0.5);

  // Apply the blur to the image block
  engine.block.setBlur(sampleBlock, blur);
  engine.block.setBlurEnabled(sampleBlock, true);

  // Access the applied blur and its properties
  const appliedBlur = engine.block.getBlur(sampleBlock);
  const isEnabled = engine.block.isBlurEnabled(sampleBlock);
  const blurType = engine.block.getType(appliedBlur);
  console.log('Blur type:', blurType, 'Enabled:', isEnabled);

  // Disable blur temporarily
  engine.block.setBlurEnabled(sampleBlock, false);
  console.log('Blur disabled:', !engine.block.isBlurEnabled(sampleBlock));

  // Re-enable for final export
  engine.block.setBlurEnabled(sampleBlock, true);

  // Create additional blocks to demonstrate different blur types
  // Create a uniform blur for even softening
  const uniformBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, uniformBlock);
  engine.block.setPositionX(uniformBlock, 350);

  const uniformBlur = engine.block.createBlur('//ly.img.ubq/blur/uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.6);
  engine.block.setBlur(uniformBlock, uniformBlur);
  engine.block.setBlurEnabled(uniformBlock, true);

  // Create a linear blur for gradient effect
  const linearBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, linearBlock);
  engine.block.setPositionY(linearBlock, 275);

  const linearBlur = engine.block.createBlur('//ly.img.ubq/blur/linear');
  engine.block.setFloat(linearBlur, 'blur/linear/blurRadius', 35);
  engine.block.setFloat(linearBlur, 'blur/linear/x1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/y1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/x2', 1);
  engine.block.setFloat(linearBlur, 'blur/linear/y2', 1);
  engine.block.setBlur(linearBlock, linearBlur);
  engine.block.setBlurEnabled(linearBlock, true);

  // Create a mirrored blur for tilt-shift effect
  const mirroredBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, mirroredBlock);
  engine.block.setPositionX(mirroredBlock, 350);
  engine.block.setPositionY(mirroredBlock, 275);

  const mirroredBlur = engine.block.createBlur('//ly.img.ubq/blur/mirrored');
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/blurRadius', 30);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/gradientSize', 50);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/size', 75);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x1', 0);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y1', 0.3);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x2', 1);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y2', 0.7);
  engine.block.setBlur(mirroredBlock, mirroredBlur);
  engine.block.setBlurEnabled(mirroredBlock, true);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/blur-effects.png', buffer);
  console.log('Exported to output/blur-effects.png');
} finally {
  engine.dispose();
}
```

This guide covers how to apply blur effects programmatically using the block API.

## Programmatic Blur Application

### Initialize CE.SDK

For applications that need to apply blur programmatically—whether for automation, batch processing, or dynamic content generation—we start by setting up CE.SDK with the proper configuration.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

This initializes the CE.SDK engine in headless mode, giving you full API access to the blur system without UI dependencies.

### Check Blur Support

Before applying blur to a block, verify it supports blur effects. Graphic blocks with shapes and pages support blur.

```typescript highlight-check-blur-support
  // Create an image block to check blur support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if the block supports blur - graphic blocks with shapes support blur
  const supportsBlur = engine.block.supportsBlur(sampleBlock);
  console.log('Block supports blur:', supportsBlur);
```

Always check support before creating and applying blur to avoid errors.

### Create and Apply Blur

Create a blur instance using `createBlur()` with a blur type, then attach it to a block using `setBlur()`. Enable the blur with `setBlurEnabled()`.

```typescript highlight-create-blur
// Create a radial blur effect
const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');
```

CE.SDK provides four blur types:

- **`//ly.img.ubq/blur/uniform`** - Even softening across the entire element
- **`//ly.img.ubq/blur/linear`** - Gradient blur along a line defined by two control points
- **`//ly.img.ubq/blur/mirrored`** - Band of focus with blur on both sides (tilt-shift style)
- **`//ly.img.ubq/blur/radial`** - Circular blur pattern from a center point

> **Note:** Omitting the prefix is also accepted, e.g., `'radial'` instead of
> `'//ly.img.ubq/blur/radial'`.

### Configure Blur Parameters

Each blur type has specific parameters to control its appearance. Configure them using `setFloat()`.

```typescript highlight-configure-blur
// Configure radial blur parameters
engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
engine.block.setFloat(blur, 'blur/radial/radius', 100);
engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
engine.block.setFloat(blur, 'blur/radial/x', 0.5);
engine.block.setFloat(blur, 'blur/radial/y', 0.5);
```

**Radial blur parameters:**

- `blur/radial/blurRadius` - Blur intensity (default: 30)
- `blur/radial/radius` - Size of the non-blurred center area (default: 75)
- `blur/radial/gradientRadius` - Size of the blur transition zone (default: 50)
- `blur/radial/x` - Center point x-value, 0.0 to 1.0 (default: 0.5)
- `blur/radial/y` - Center point y-value, 0.0 to 1.0 (default: 0.5)

**Uniform blur parameters:**

- `blur/uniform/intensity` - Blur strength, 0.0 to 1.0 (default: 0.5)

**Linear blur parameters:**

- `blur/linear/blurRadius` - Blur intensity (default: 30)
- `blur/linear/x1`, `blur/linear/y1` - Control point 1 (default: 0, 0.5)
- `blur/linear/x2`, `blur/linear/y2` - Control point 2 (default: 1, 0.5)

**Mirrored blur parameters:**

- `blur/mirrored/blurRadius` - Blur intensity (default: 30)
- `blur/mirrored/gradientSize` - Hardness of gradient transition (default: 50)
- `blur/mirrored/size` - Size of the blurred area (default: 75)
- `blur/mirrored/x1`, `blur/mirrored/y1` - Control point 1 (default: 0, 0.5)
- `blur/mirrored/x2`, `blur/mirrored/y2` - Control point 2 (default: 1, 0.5)

### Apply Blur to Block

After configuring the blur, apply it to the target block and enable it.

```typescript highlight-apply-blur
// Apply the blur to the image block
engine.block.setBlur(sampleBlock, blur);
engine.block.setBlurEnabled(sampleBlock, true);
```

The blur takes effect immediately once enabled. You can modify parameters at any time.

## Managing Blur

### Access Existing Blur

Retrieve the blur applied to a block using `getBlur()`. You can then read or modify its properties.

```typescript highlight-read-blur
// Access the applied blur and its properties
const appliedBlur = engine.block.getBlur(sampleBlock);
const isEnabled = engine.block.isBlurEnabled(sampleBlock);
const blurType = engine.block.getType(appliedBlur);
console.log('Blur type:', blurType, 'Enabled:', isEnabled);
```

### Enable/Disable Blur

Toggle blur on and off without removing it using `setBlurEnabled()`. This preserves all blur parameters for conditional processing.

```typescript highlight-toggle-blur
  // Disable blur temporarily
  engine.block.setBlurEnabled(sampleBlock, false);
  console.log('Blur disabled:', !engine.block.isBlurEnabled(sampleBlock));

  // Re-enable for final export
  engine.block.setBlurEnabled(sampleBlock, true);
```

When disabled, the blur remains attached to the block but doesn't render until re-enabled.

## Blur Types

### Uniform Blur

Applies consistent softening across the entire element. Best for simple background blur or overall softening.

```typescript highlight-uniform-blur
  // Create a uniform blur for even softening
  const uniformBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, uniformBlock);
  engine.block.setPositionX(uniformBlock, 350);

  const uniformBlur = engine.block.createBlur('//ly.img.ubq/blur/uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.6);
  engine.block.setBlur(uniformBlock, uniformBlur);
  engine.block.setBlurEnabled(uniformBlock, true);
```

### Linear Blur

Creates a gradient blur effect along a line defined by two control points. Useful for directional focus effects.

```typescript highlight-linear-blur
  // Create a linear blur for gradient effect
  const linearBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, linearBlock);
  engine.block.setPositionY(linearBlock, 275);

  const linearBlur = engine.block.createBlur('//ly.img.ubq/blur/linear');
  engine.block.setFloat(linearBlur, 'blur/linear/blurRadius', 35);
  engine.block.setFloat(linearBlur, 'blur/linear/x1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/y1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/x2', 1);
  engine.block.setFloat(linearBlur, 'blur/linear/y2', 1);
  engine.block.setBlur(linearBlock, linearBlur);
  engine.block.setBlurEnabled(linearBlock, true);
```

### Mirrored Blur

Creates a band of focus with blur on both sides, commonly known as a tilt-shift effect. The control points define the focus band orientation.

```typescript highlight-mirrored-blur
  // Create a mirrored blur for tilt-shift effect
  const mirroredBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, mirroredBlock);
  engine.block.setPositionX(mirroredBlock, 350);
  engine.block.setPositionY(mirroredBlock, 275);

  const mirroredBlur = engine.block.createBlur('//ly.img.ubq/blur/mirrored');
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/blurRadius', 30);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/gradientSize', 50);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/size', 75);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x1', 0);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y1', 0.3);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x2', 1);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y2', 0.7);
  engine.block.setBlur(mirroredBlock, mirroredBlur);
  engine.block.setBlurEnabled(mirroredBlock, true);
```

## Export Results

After applying blur effects, export the processed content to a file. CE.SDK supports various export formats including PNG, JPEG, and PDF.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/blur-effects.png', buffer);
  console.log('Exported to output/blur-effects.png');
```

The export operation renders all blur effects and saves the result to the file system. Always dispose of the engine instance when processing is complete to free resources.

## Troubleshooting

### Blur Not Visible

If blur doesn't appear after applying:

- Check the block supports blur with `supportsBlur()`
- Verify blur is enabled with `isBlurEnabled()`
- Ensure the blur instance is valid

### Blur Appears on Wrong Area

For radial, linear, and mirrored blurs:

- Verify control point coordinates are within 0.0 to 1.0 range
- Check that x/y values match your intended focus area

### Blur Too Subtle or Too Strong

- Increase or decrease `blurRadius` or `intensity` values
- For radial blur, adjust `gradientRadius` to control the transition softness

## API Reference

| Method                                  | Description                  |
| --------------------------------------- | ---------------------------- |
| `block.createBlur(type)`                | Create new blur instance     |
| `block.supportsBlur(block)`             | Check if block supports blur |
| `block.setBlur(block, blur)`            | Apply blur to block          |
| `block.getBlur(block)`                  | Get blur from block          |
| `block.setBlurEnabled(block, enabled)`  | Enable or disable blur       |
| `block.isBlurEnabled(block)`            | Check if blur is enabled     |
| `block.setFloat(blur, property, value)` | Set blur float property      |
| `block.getFloat(blur, property)`        | Get blur float property      |
| `block.getType(blur)`                   | Get blur type identifier     |
| `block.destroy(blur)`                   | Destroy unused blur instance |

## Linear Type

A blur effect applied along a linear gradient.

This section describes the properties available for the **Linear Type** (`//ly.img.ubq/blur/linear`) block type.

| Property                 | Type    | Default | Description              |
| ------------------------ | ------- | ------- | ------------------------ |
| `blur/linear/blurRadius` | `Float` | `30`    | Blur intensity.          |
| `blur/linear/x1`         | `Float` | `0`     | Control point 1 x-value. |
| `blur/linear/x2`         | `Float` | `1`     | Control point 2 x-value. |
| `blur/linear/y1`         | `Float` | `0.5`   | Control point 1 y-value. |
| `blur/linear/y2`         | `Float` | `0.5`   | Control point 2 y-value. |

## Mirrored Type

A blur effect applied in a mirrored linear fashion.

This section describes the properties available for the **Mirrored Type** (`//ly.img.ubq/blur/mirrored`) block type.

| Property                     | Type    | Default | Description              |
| ---------------------------- | ------- | ------- | ------------------------ |
| `blur/mirrored/blurRadius`   | `Float` | `30`    | Blur intensity.          |
| `blur/mirrored/gradientSize` | `Float` | `50`    | Hardness of gradients.   |
| `blur/mirrored/size`         | `Float` | `75`    | Size of blurred area.    |
| `blur/mirrored/x1`           | `Float` | `0`     | Control point 1 x-value. |
| `blur/mirrored/x2`           | `Float` | `1`     | Control point 2 x-value. |
| `blur/mirrored/y1`           | `Float` | `0.5`   | Control point 1 y-value. |
| `blur/mirrored/y2`           | `Float` | `0.5`   | Control point 2 y-value. |

## Radial Type

A blur effect applied radially from a center point.

This section describes the properties available for the **Radial Type** (`//ly.img.ubq/blur/radial`) block type.

| Property                     | Type    | Default | Description               |
| ---------------------------- | ------- | ------- | ------------------------- |
| `blur/radial/blurRadius`     | `Float` | `30`    | Blur intensity.           |
| `blur/radial/gradientRadius` | `Float` | `50`    | Size of blurred area.     |
| `blur/radial/radius`         | `Float` | `75`    | Size of non-blurred area. |
| `blur/radial/x`              | `Float` | `0.5`   | Center point x-value.     |
| `blur/radial/y`              | `Float` | `0.5`   | Center point y-value.     |

## Uniform Type

A blur effect with uniform intensity.

This section describes the properties available for the **Uniform Type** (`//ly.img.ubq/blur/uniform`) block type.

| Property                 | Type    | Default | Description         |
| ------------------------ | ------- | ------- | ------------------- |
| `blur/uniform/intensity` | `Float` | `0.5`   | The blur intensity. |




---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support