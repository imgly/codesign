> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [For Print](./colors/for-print.md) > [Spot Colors](./colors/for-print/spot.md)

---

Define and manage spot colors programmatically for professional print workflows with exact color matching through premixed inks.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-colors-for-print-spot-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-colors-for-print-spot-server-js)

Spot colors are named colors reproduced using premixed inks in print production, providing exact color matching that CMYK process colors cannot guarantee. CE.SDK maintains a registry of spot color definitions at the editor level, where each spot color has a name and screen approximations (RGB and/or CMYK) for display purposes. The actual premixed ink is used during printing based on the color name.

```typescript file=@cesdk_web_examples/guides-colors-for-print-spot-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import type { SpotColor } from '@cesdk/node';

// Type guard to check if a color is a SpotColor
// Color can be RGBAColor, CMYKColor, or SpotColor
const isSpotColor = (color: unknown): color is SpotColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'name' in color &&
    'tint' in color &&
    'externalReference' in color
  );
};

import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Spot Colors
 *
 * This example demonstrates:
 * - Defining spot colors with RGB and CMYK approximations
 * - Applying spot colors to fills, strokes, and shadows
 * - Using tints for lighter color variations
 * - Querying and updating spot color definitions
 * - Removing spot colors and handling the magenta fallback
 * - Assigning spot colors to cutout types
 * - Exporting designs with spot colors for print
 */

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});

try {
  // Create a scene with a page
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // Set page background to light gray for visibility
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  // Helper function to create a graphic block with a color fill
  const createColorBlock = (
    x: number,
    y: number,
    width: number,
    height: number,
    shape: 'rect' | 'ellipse' = 'rect'
  ): { block: number; fill: number } => {
    const block = engine.block.create('graphic');
    const blockShape = engine.block.createShape(shape);
    engine.block.setShape(block, blockShape);
    engine.block.setWidth(block, width);
    engine.block.setHeight(block, height);
    engine.block.setPositionX(block, x);
    engine.block.setPositionY(block, y);
    engine.block.appendChild(page, block);

    const colorFill = engine.block.createFill('color');
    engine.block.setFill(block, colorFill);

    return { block, fill: colorFill };
  };

  // Define a spot color with RGB approximation
  // RGB values range from 0.0 to 1.0
  engine.editor.setSpotColorRGB('Brand-Primary', 0.8, 0.1, 0.2);

  // Add CMYK approximation for the same spot color
  // This provides print-accurate preview in addition to screen display
  engine.editor.setSpotColorCMYK('Brand-Primary', 0.05, 0.95, 0.85, 0.0);

  // Define another spot color with both approximations
  engine.editor.setSpotColorRGB('Brand-Accent', 0.2, 0.4, 0.8);
  engine.editor.setSpotColorCMYK('Brand-Accent', 0.75, 0.5, 0.0, 0.0);

  // Apply spot colors to fills using SpotColor objects
  // The tint property (0.0 to 1.0) controls color intensity
  // The externalReference field stores metadata like color system origin
  const brandPrimary: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };

  // Create a block and apply the Brand-Primary spot color
  const { fill: primaryFill } = createColorBlock(50, 50, 150, 150);
  engine.block.setColor(primaryFill, 'fill/color/value', brandPrimary);

  // Apply Brand-Accent to another block
  const brandAccent: SpotColor = {
    name: 'Brand-Accent',
    tint: 1.0,
    externalReference: ''
  };
  const { fill: accentFill } = createColorBlock(220, 50, 150, 150);
  engine.block.setColor(accentFill, 'fill/color/value', brandAccent);

  // Use tints for lighter variations without defining new spot colors
  // Tint of 0.5 gives 50% color intensity
  const brandPrimaryHalfTint: SpotColor = {
    name: 'Brand-Primary',
    tint: 0.5,
    externalReference: ''
  };
  const { fill: tintedFill } = createColorBlock(390, 50, 150, 150, 'ellipse');
  engine.block.setColor(tintedFill, 'fill/color/value', brandPrimaryHalfTint);

  // Create a gradient of tints
  const brandAccentLightTint: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.3,
    externalReference: ''
  };
  const { fill: lightTintFill } = createColorBlock(560, 50, 150, 150);
  engine.block.setColor(
    lightTintFill,
    'fill/color/value',
    brandAccentLightTint
  );

  // Apply spot colors to strokes and shadows
  const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
    50,
    220,
    150,
    150
  );
  // Set fill to white
  engine.block.setColor(strokeBlockFill, 'fill/color/value', {
    r: 1.0,
    g: 1.0,
    b: 1.0,
    a: 1.0
  });

  // Enable stroke and apply spot color
  engine.block.setStrokeEnabled(strokeBlock, true);
  engine.block.setStrokeWidth(strokeBlock, 8);
  const strokeColor: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(strokeBlock, 'stroke/color', strokeColor);

  // Apply spot color to drop shadow
  const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
    220,
    220,
    150,
    150
  );
  engine.block.setColor(shadowBlockFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  engine.block.setDropShadowEnabled(shadowBlock, true);
  engine.block.setDropShadowOffsetX(shadowBlock, 10);
  engine.block.setDropShadowOffsetY(shadowBlock, 10);
  engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
  engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
  const shadowColor: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.8,
    externalReference: ''
  };
  engine.block.setColor(shadowBlock, 'dropShadow/color', shadowColor);

  // Query all defined spot colors
  const spotColors = engine.editor.findAllSpotColors();
  console.log('Defined spot colors:', spotColors);

  // Query RGB approximation for a spot color
  const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
  console.log('Brand-Primary RGB approximation:', rgbaApprox);

  // Query CMYK approximation for a spot color
  const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
  console.log('Brand-Primary CMYK approximation:', cmykApprox);

  // Read back the color from a block and check if it's a spot color
  const retrievedColor = engine.block.getColor(primaryFill, 'fill/color/value');
  if (isSpotColor(retrievedColor)) {
    console.log(
      `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
    );
  }

  // Update an existing spot color's approximation
  // This changes how the color appears on screen without affecting the color name
  engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
  console.log('Updated Brand-Accent RGB approximation');

  // Show the updated color in a new block
  const { fill: updatedFill } = createColorBlock(390, 220, 150, 150);
  const updatedAccent: SpotColor = {
    name: 'Brand-Accent',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(updatedFill, 'fill/color/value', updatedAccent);

  // Define a temporary spot color
  engine.editor.setSpotColorRGB('Temporary-Color', 0.5, 0.8, 0.3);

  // Create a block using the temporary color
  const { fill: tempFill } = createColorBlock(560, 220, 150, 150);
  const tempColor: SpotColor = {
    name: 'Temporary-Color',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(tempFill, 'fill/color/value', tempColor);

  // Remove the spot color definition
  // Blocks using this color will display magenta (default fallback)
  engine.editor.removeSpotColor('Temporary-Color');

  console.log('Removed Temporary-Color - block now shows magenta fallback');

  // Verify the color is no longer defined
  const remainingSpotColors = engine.editor.findAllSpotColors();
  console.log('Remaining spot colors:', remainingSpotColors);

  // Assign spot colors to cutout types for die-cutting operations
  // First define a spot color for the die line
  engine.editor.setSpotColorRGB('DieLine', 1.0, 0.0, 1.0);
  engine.editor.setSpotColorCMYK('DieLine', 0.0, 1.0, 0.0, 0.0);

  // Associate the spot color with a cutout type
  // CutoutType can be 'Solid' or 'Dashed'
  engine.editor.setSpotColorForCutoutType('Solid', 'DieLine');

  // Query the assigned spot color
  const cutoutSpotColor = engine.editor.getSpotColorForCutoutType('Solid');
  console.log('Cutout type Solid uses spot color:', cutoutSpotColor);

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export as PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.png`, pngBuffer);
  console.log(`\nPNG exported: ${outputDir}/spot-colors.png`);

  // Export as PDF for print (preserves spot colors)
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.pdf`, pdfBuffer);
  console.log(`PDF exported: ${outputDir}/spot-colors.pdf`);

  console.log('\nSpot Colors example completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to define spot colors with RGB and CMYK approximations, apply them to design elements with varying tints, query and update definitions, assign spot colors to cutout types for die-cutting operations, and export designs with spot colors for print production.

## Setup

Initialize the CE.SDK engine for server-side spot color management:

```typescript highlight-setup
// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
});
```

## Understanding Spot Colors

A spot color in CE.SDK consists of:

- **Name**: A unique identifier for the spot color (e.g., "Brand-Red-185", "Brand-Primary")
- **Tint**: A value from 0.0 to 1.0 controlling color intensity
- **External Reference**: Optional metadata linking to external color systems

Screen approximations (RGB and CMYK values) are stored separately and define how the spot color appears on screen during design. The actual printed color comes from the premixed ink specified by the spot color name.

## Defining Spot Colors

### RGB Approximation

Define how a spot color should appear on screen using RGB values:

```typescript highlight-define-spot-rgb
// Define a spot color with RGB approximation
// RGB values range from 0.0 to 1.0
engine.editor.setSpotColorRGB('Brand-Primary', 0.8, 0.1, 0.2);
```

RGB values range from 0.0 to 1.0. This approximation is used for screen display in applications that work in RGB color space.

### CMYK Approximation

Add a CMYK approximation for print preview accuracy:

```typescript highlight-define-spot-cmyk
  // Add CMYK approximation for the same spot color
  // This provides print-accurate preview in addition to screen display
  engine.editor.setSpotColorCMYK('Brand-Primary', 0.05, 0.95, 0.85, 0.0);

  // Define another spot color with both approximations
  engine.editor.setSpotColorRGB('Brand-Accent', 0.2, 0.4, 0.8);
  engine.editor.setSpotColorCMYK('Brand-Accent', 0.75, 0.5, 0.0, 0.0);
```

CMYK values also range from 0.0 to 1.0. Having both RGB and CMYK approximations ensures accurate preview in both screen-based and print-oriented workflows.

## Applying Spot Colors

### To Fills

Apply spot colors to block fills using the `SpotColor` type:

```typescript highlight-apply-spot-fill
  // Apply spot colors to fills using SpotColor objects
  // The tint property (0.0 to 1.0) controls color intensity
  // The externalReference field stores metadata like color system origin
  const brandPrimary: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };

  // Create a block and apply the Brand-Primary spot color
  const { fill: primaryFill } = createColorBlock(50, 50, 150, 150);
  engine.block.setColor(primaryFill, 'fill/color/value', brandPrimary);
```

The `SpotColor` object contains:

- `name`: References a defined spot color
- `tint`: Controls intensity (1.0 = full strength)
- `externalReference`: Optional metadata for color system integration

### Using Tints

Create lighter variations without defining new spot colors:

```typescript highlight-tint
  // Use tints for lighter variations without defining new spot colors
  // Tint of 0.5 gives 50% color intensity
  const brandPrimaryHalfTint: SpotColor = {
    name: 'Brand-Primary',
    tint: 0.5,
    externalReference: ''
  };
  const { fill: tintedFill } = createColorBlock(390, 50, 150, 150, 'ellipse');
  engine.block.setColor(tintedFill, 'fill/color/value', brandPrimaryHalfTint);

  // Create a gradient of tints
  const brandAccentLightTint: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.3,
    externalReference: ''
  };
  const { fill: lightTintFill } = createColorBlock(560, 50, 150, 150);
  engine.block.setColor(
    lightTintFill,
    'fill/color/value',
    brandAccentLightTint
  );
```

Tints are particularly useful for creating consistent color hierarchies in designs while maintaining a single spot color definition for print production.

### To Strokes and Shadows

Spot colors work with all color properties:

```typescript highlight-stroke-shadow
  // Apply spot colors to strokes and shadows
  const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
    50,
    220,
    150,
    150
  );
  // Set fill to white
  engine.block.setColor(strokeBlockFill, 'fill/color/value', {
    r: 1.0,
    g: 1.0,
    b: 1.0,
    a: 1.0
  });

  // Enable stroke and apply spot color
  engine.block.setStrokeEnabled(strokeBlock, true);
  engine.block.setStrokeWidth(strokeBlock, 8);
  const strokeColor: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(strokeBlock, 'stroke/color', strokeColor);

  // Apply spot color to drop shadow
  const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
    220,
    220,
    150,
    150
  );
  engine.block.setColor(shadowBlockFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  engine.block.setDropShadowEnabled(shadowBlock, true);
  engine.block.setDropShadowOffsetX(shadowBlock, 10);
  engine.block.setDropShadowOffsetY(shadowBlock, 10);
  engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
  engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
  const shadowColor: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.8,
    externalReference: ''
  };
  engine.block.setColor(shadowBlock, 'dropShadow/color', shadowColor);
```

## Querying Spot Colors

### List All Spot Colors

Retrieve all defined spot colors in the current editor session:

```typescript highlight-query-spot
  // Query all defined spot colors
  const spotColors = engine.editor.findAllSpotColors();
  console.log('Defined spot colors:', spotColors);

  // Query RGB approximation for a spot color
  const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
  console.log('Brand-Primary RGB approximation:', rgbaApprox);

  // Query CMYK approximation for a spot color
  const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
  console.log('Brand-Primary CMYK approximation:', cmykApprox);

  // Read back the color from a block and check if it's a spot color
  const retrievedColor = engine.block.getColor(primaryFill, 'fill/color/value');
  if (isSpotColor(retrievedColor)) {
    console.log(
      `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
    );
  }
```

### Reading Back Colors

When reading colors from blocks, `engine.block.getColor()` can return an `RGBAColor`, `CMYKColor`, or `SpotColor`. Use a type guard to check if the color is a spot color:

```typescript
const isSpotColor = (color: unknown): color is SpotColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'name' in color &&
    'tint' in color &&
    'externalReference' in color
  );
};

const color = engine.block.getColor(fill, 'fill/color/value');
if (isSpotColor(color)) {
  console.log(`Spot color: ${color.name} at ${color.tint * 100}% tint`);
}
```

## Updating Spot Colors

Modify a spot color's screen approximation. All blocks using this spot color will automatically display the updated appearance:

```typescript highlight-update-spot
  // Update an existing spot color's approximation
  // This changes how the color appears on screen without affecting the color name
  engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
  console.log('Updated Brand-Accent RGB approximation');

  // Show the updated color in a new block
  const { fill: updatedFill } = createColorBlock(390, 220, 150, 150);
  const updatedAccent: SpotColor = {
    name: 'Brand-Accent',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(updatedFill, 'fill/color/value', updatedAccent);
```

This updates only the screen preview. The actual printed output depends on the physical premixed ink identified by the spot color name.

## Removing Spot Colors

Remove a spot color definition when it's no longer needed:

```typescript highlight-remove-spot
  // Define a temporary spot color
  engine.editor.setSpotColorRGB('Temporary-Color', 0.5, 0.8, 0.3);

  // Create a block using the temporary color
  const { fill: tempFill } = createColorBlock(560, 220, 150, 150);
  const tempColor: SpotColor = {
    name: 'Temporary-Color',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(tempFill, 'fill/color/value', tempColor);

  // Remove the spot color definition
  // Blocks using this color will display magenta (default fallback)
  engine.editor.removeSpotColor('Temporary-Color');

  console.log('Removed Temporary-Color - block now shows magenta fallback');

  // Verify the color is no longer defined
  const remainingSpotColors = engine.editor.findAllSpotColors();
  console.log('Remaining spot colors:', remainingSpotColors);
```

Blocks that reference a removed spot color will display in magenta (the default fallback color) to indicate the missing definition.

## Spot Colors for Cutouts

Assign spot colors to cutout types for die-cutting operations in packaging and label production:

```typescript highlight-cutout
  // Assign spot colors to cutout types for die-cutting operations
  // First define a spot color for the die line
  engine.editor.setSpotColorRGB('DieLine', 1.0, 0.0, 1.0);
  engine.editor.setSpotColorCMYK('DieLine', 0.0, 1.0, 0.0, 0.0);

  // Associate the spot color with a cutout type
  // CutoutType can be 'Solid' or 'Dashed'
  engine.editor.setSpotColorForCutoutType('Solid', 'DieLine');

  // Query the assigned spot color
  const cutoutSpotColor = engine.editor.getSpotColorForCutoutType('Solid');
  console.log('Cutout type Solid uses spot color:', cutoutSpotColor);
```

Available cutout types are `'Solid'` and `'Dashed'`, representing different die-line styles used in print finishing.

## Exporting with Spot Colors

Export designs while preserving spot color information:

```typescript highlight-export
  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export as PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.png`, pngBuffer);
  console.log(`\nPNG exported: ${outputDir}/spot-colors.png`);

  // Export as PDF for print (preserves spot colors)
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.pdf`, pdfBuffer);
  console.log(`PDF exported: ${outputDir}/spot-colors.pdf`);
```

When exporting to PDF, spot colors are embedded as named separations that RIP software can extract for plate generation. PNG exports use the RGB approximation for raster output.

## Best Practices

**Define early** - Register spot colors at initialization before applying them to blocks. Undefined colors display as magenta, which can confuse users.

**Use descriptive names** - Match your print vendor's reference (e.g., "Brand-Red-485") to ensure correct ink matching in production.

**Provide both approximations** - RGB for screen display, CMYK for print-accurate previews. This gives designers the best experience across different workflows.

**Use tints sparingly** - Prefer tints (0.0-1.0) for lighter variations rather than defining separate spot colors for each shade. This keeps your spot color list manageable.

**Validate before export** - Query `findAllSpotColors()` to verify all expected spot colors are defined before exporting for print.

## Troubleshooting

### Spot Color Displays as Magenta

The spot color hasn't been defined. Call `setSpotColorRGB()` or `setSpotColorCMYK()` with the color name before applying it to blocks.

### Color Approximation Looks Wrong

Update the approximation values using `setSpotColorRGB()` or `setSpotColorCMYK()`. Remember that RGB values are for screen display while CMYK values are for print preview.

### Spot Color Not in Output

Verify the spot color name matches exactly (names are case-sensitive). Check that the block is using a SpotColor object, not an RGB or CMYK color value.

### Can't Remove Spot Color

Ensure you're using the exact name string. Note that removing a spot color doesn't update existing blocks—they'll show magenta until redefined or replaced with a different color.

## API Reference

| Method                                            | Description                                      |
| ------------------------------------------------- | ------------------------------------------------ |
| `engine.editor.setSpotColorRGB(name, r, g, b)`    | Define/update spot color with RGB approximation  |
| `engine.editor.setSpotColorCMYK(name, c, m, y, k)` | Define/update spot color with CMYK approximation |
| `engine.editor.findAllSpotColors()`               | Get array of all defined spot color names        |
| `engine.editor.getSpotColorRGBA(name)`            | Query RGB approximation for a spot color         |
| `engine.editor.getSpotColorCMYK(name)`            | Query CMYK approximation for a spot color        |
| `engine.editor.removeSpotColor(name)`             | Remove a spot color from the registry            |
| `engine.editor.setSpotColorForCutoutType(type, color)` | Assign spot color to a cutout type          |
| `engine.editor.getSpotColorForCutoutType(type)`   | Get spot color assigned to a cutout type         |
| `engine.block.setColor(block, property, color)`   | Apply color (including SpotColor) to a property  |
| `engine.block.getColor(block, property)`          | Read color from a block property                 |

## Next Steps

- [Export for Printing](./export-save-publish/for-printing.md) - Export designs with spot colors for professional print production
- [Apply Colors](./colors/apply.md) - Apply colors to fills, strokes, and shadows
- [CMYK Colors](./colors/for-print/cmyk.md) - Work with CMYK process colors

## Cleanup

Always dispose the engine when done to free resources:

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support