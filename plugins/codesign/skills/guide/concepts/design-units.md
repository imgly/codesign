> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Design Units](./concepts/design-units.md)

---

Control measurement systems for precise physical dimensions—create print-ready
documents with millimeter or inch units and configurable DPI for export quality.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-design-units-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-design-units-server-js)

Design units determine the coordinate system for all layout values in CE.SDK—positions, sizes, and margins. The engine supports three unit types: **Pixel** for screen-based designs, **Millimeter** for metric print dimensions, and **Inch** for imperial print formats.

```typescript file=@cesdk_web_examples/guides-concepts-design-units-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Design Units Guide
 *
 * Demonstrates working with design units in CE.SDK:
 * - Understanding unit types (Pixel, Millimeter, Inch)
 * - Getting and setting the design unit
 * - Configuring DPI for print output
 * - Setting up print-ready dimensions
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a new scene
    const scene = engine.scene.create();

    // Get the current design unit
    const currentUnit = engine.scene.getDesignUnit();
    console.log('Current design unit:', currentUnit); // 'Pixel' by default

    // Set design unit to Millimeter for print workflow
    engine.scene.setDesignUnit('Millimeter');

    // Verify the change
    const newUnit = engine.scene.getDesignUnit();
    console.log('Design unit changed to:', newUnit); // 'Millimeter'

    // Set DPI to 300 for print-quality exports
    // Higher DPI produces higher resolution output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Verify the DPI setting
    const dpi = engine.block.getFloat(scene, 'scene/dpi');
    console.log('DPI set to:', dpi); // 300

    // Create a page and set A4 dimensions (210 x 297 mm)
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page to A4 size in millimeters
    engine.block.setWidth(page, 210);
    engine.block.setHeight(page, 297);

    // Verify dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);

    // Create a text block with millimeter dimensions
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position text at 20mm from left, 30mm from top
    engine.block.setPositionX(textBlock, 20);
    engine.block.setPositionY(textBlock, 30);

    // Set text block size to 170mm x 50mm
    engine.block.setWidth(textBlock, 170);
    engine.block.setHeight(textBlock, 50);

    // Add content to the text block
    engine.block.setString(
      textBlock,
      'text/text',
      'This A4 document uses millimeter units with 300 DPI for print-ready output.'
    );

    // Demonstrate unit comparison
    // At 300 DPI: 1 inch = 300 pixels, 1 mm = ~11.81 pixels
    console.log('Unit comparison at 300 DPI:');
    console.log(
      '- A4 width (210mm) will export as',
      210 * (300 / 25.4),
      'pixels'
    );
    console.log(
      '- A4 height (297mm) will export as',
      297 * (300 / 25.4),
      'pixels'
    );

    console.log(
      'Design units guide completed. Scene configured for A4 print output.'
    );
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to get and set design units, configure DPI for export quality, and set up scenes for specific physical dimensions like A4 paper.

## Understanding Design Units

### Supported Unit Types

CE.SDK supports three design unit types, each suited for different output scenarios:

- **Pixel** — Default unit, ideal for screen-based designs, web graphics, and video content. One unit equals one pixel in the design coordinate space.
- **Millimeter** — For print designs targeting metric dimensions (A4, A5, business cards). One unit equals one millimeter at the scene's DPI setting.
- **Inch** — For print designs targeting imperial dimensions (letter, legal, US business cards). One unit equals one inch at the scene's DPI setting.

### Design Unit and DPI Relationship

DPI (dots per inch) determines how physical units convert to pixels during export. At 300 DPI, a 1-inch block exports as 300 pixels wide. Higher DPI values produce higher-resolution exports suitable for professional printing.

For pixel-based scenes, DPI primarily affects font size conversions since font sizes are always specified in points.

## Getting the Current Design Unit

Use `engine.scene.getDesignUnit()` to retrieve the current scene's design unit. This returns one of three values: `'Pixel'`, `'Millimeter'`, or `'Inch'`.

```typescript highlight-get-design-unit
    // Create a new scene
    const scene = engine.scene.create();

    // Get the current design unit
    const currentUnit = engine.scene.getDesignUnit();
    console.log('Current design unit:', currentUnit); // 'Pixel' by default
```

## Setting the Design Unit

Use `engine.scene.setDesignUnit()` to change the measurement system. When you change the design unit, CE.SDK automatically converts existing layout values to maintain visual appearance.

```typescript highlight-set-design-unit
    // Set design unit to Millimeter for print workflow
    engine.scene.setDesignUnit('Millimeter');

    // Verify the change
    const newUnit = engine.scene.getDesignUnit();
    console.log('Design unit changed to:', newUnit); // 'Millimeter'
```

## Configuring DPI

Access DPI through the scene's `scene/dpi` property. For print workflows, 300 DPI is the standard for high-quality output.

```typescript highlight-configure-dpi
    // Set DPI to 300 for print-quality exports
    // Higher DPI produces higher resolution output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Verify the DPI setting
    const dpi = engine.block.getFloat(scene, 'scene/dpi');
    console.log('DPI set to:', dpi); // 300
```

DPI affects different aspects depending on the design unit:

- **Physical units (mm, in)**: DPI determines the pixel resolution of exported files
- **Pixel units**: DPI only affects the conversion of font sizes from points to pixels

## Setting Up Print-Ready Designs

For print workflows, combine `setDesignUnit()` with appropriate DPI and page dimensions. Here's how to set up an A4 document ready for print export:

```typescript highlight-set-page-dimensions
    // Create a page and set A4 dimensions (210 x 297 mm)
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page to A4 size in millimeters
    engine.block.setWidth(page, 210);
    engine.block.setHeight(page, 297);

    // Verify dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);
```

## Font Sizes and Design Units

Font sizes are always specified in points (`pt`), regardless of the scene's design unit. The DPI setting affects how points convert to pixels for rendering.

```typescript highlight-create-text-block
    // Create a text block with millimeter dimensions
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position text at 20mm from left, 30mm from top
    engine.block.setPositionX(textBlock, 20);
    engine.block.setPositionY(textBlock, 30);

    // Set text block size to 170mm x 50mm
    engine.block.setWidth(textBlock, 170);
    engine.block.setHeight(textBlock, 50);

    // Add content to the text block
    engine.block.setString(
      textBlock,
      'text/text',
      'This A4 document uses millimeter units with 300 DPI for print-ready output.'
    );
```

When DPI changes, text blocks automatically adjust their rendered size to maintain visual consistency.

## Understanding Export Resolution

The relationship between design units and export resolution is important for print workflows:

```typescript highlight-compare-units
// Demonstrate unit comparison
// At 300 DPI: 1 inch = 300 pixels, 1 mm = ~11.81 pixels
console.log('Unit comparison at 300 DPI:');
console.log(
  '- A4 width (210mm) will export as',
  210 * (300 / 25.4),
  'pixels'
);
console.log(
  '- A4 height (297mm) will export as',
  297 * (300 / 25.4),
  'pixels'
);
```

At 300 DPI:

- An A4 page (210 × 297 mm) exports as 2480 × 3508 pixels
- A letter page (8.5 × 11 in) exports as 2550 × 3300 pixels

## Troubleshooting

### Exported Dimensions Don't Match Expected Size

Verify that DPI is set correctly for physical units. At 300 DPI, 1 inch becomes 300 pixels. Check that your design unit matches your target output format.

### Text Appears Wrong Size After Unit Change

Font sizes in points auto-adjust based on DPI. If text looks incorrect, verify the DPI setting matches your workflow requirements.

### Blocks Shift Position After Changing Units

CE.SDK preserves visual appearance during unit conversion. If positions seem unexpected, check the original coordinate values—the numeric values change but visual positions should remain stable.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support