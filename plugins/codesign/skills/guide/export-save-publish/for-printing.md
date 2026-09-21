> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [For Printing](./export-save-publish/for-printing.md)

---

Export print-ready PDFs from CE.SDK with options for high compatibility mode,
underlayers for special media like fabric or glass, and configurable output
resolution.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-for-printing-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-for-printing-server-js)

CE.SDK exports designs as PDFs, but professional print workflows require specific configurations beyond standard export. This guide covers PDF export options for print, including high compatibility mode for complex designs, underlayers for printing on special media, and output resolution settings.

```typescript file=@cesdk_web_examples/guides-export-save-publish-for-printing-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';

/**
 * CE.SDK Server Example: Export for Printing
 *
 * This example demonstrates:
 * - Exporting designs as print-ready PDFs
 * - Configuring high compatibility mode for complex designs
 * - Generating underlayers for special media (DTF, fabric, glass)
 * - Setting scene DPI for print resolution
 */
async function main(): Promise<void> {
  // Initialize the Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
    license: process.env.CESDK_LICENSE ?? ''
  });

  try {
    // Load a template scene - this will be our print design
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the scene and page
    const scene = engine.scene.get();
    if (!scene) {
      throw new Error('No scene found');
    }
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Set print resolution (DPI) on the scene
    // 300 DPI is standard for high-quality print output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Enable high compatibility mode for consistent rendering across PDF viewers
    // This rasterizes complex elements like gradients with transparency at the scene's DPI
    const highCompatPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true
    });

    // Convert blob to buffer and write to file system
    const highCompatBuffer = Buffer.from(await highCompatPdf.arrayBuffer());
    writeFileSync('print-high-compatibility.pdf', highCompatBuffer);
    console.log(
      `High compatibility PDF exported (${(highCompatBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Disable high compatibility for faster exports when targeting modern PDF viewers
    // Complex elements remain as vectors but may render differently across viewers
    const standardPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: false
    });

    const standardBuffer = Buffer.from(await standardPdf.arrayBuffer());
    writeFileSync('print-standard.pdf', standardBuffer);
    console.log(
      `Standard PDF exported (${(standardBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Define the underlayer spot color before export
    // This creates a named spot color that will be used for the underlayer ink
    // The RGB values (0.8, 0.8, 0.8) provide a preview representation
    engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

    // Export with underlayer enabled for DTF or special media printing
    // The underlayer generates a shape behind design elements filled with the spot color
    const underlayerPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      // Negative offset shrinks the underlayer inward to prevent visible edges
      underlayerOffset: -2.0
    });

    const underlayerBuffer = Buffer.from(await underlayerPdf.arrayBuffer());
    writeFileSync('print-with-underlayer.pdf', underlayerBuffer);
    console.log(
      `PDF with underlayer exported (${(underlayerBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Export with specific dimensions for print output
    // targetWidth and targetHeight control the exported PDF dimensions in pixels
    const targetSizePdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      targetWidth: 2480, // A4 at 300 DPI (210mm)
      targetHeight: 3508 // A4 at 300 DPI (297mm)
    });

    const targetSizeBuffer = Buffer.from(await targetSizePdf.arrayBuffer());
    writeFileSync('print-a4-300dpi.pdf', targetSizeBuffer);
    console.log(
      `A4 PDF exported (${(targetSizeBuffer.length / 1024).toFixed(1)} KB)`
    );

    console.log('\nAll PDFs exported successfully!');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

## Default PDF Color Behavior

CE.SDK exports PDFs in RGB color space. CMYK or spot colors defined in your design convert to RGB during standard export. For CMYK output with ICC profiles, use the **Print Ready PDF plugin**.

The base `engine.block.export()` method provides print compatibility options, but full CMYK workflow requires the plugin.

## Setting Up for Print Export

Before exporting, configure your scene with appropriate print settings. Set the scene's DPI to control print resolution—300 DPI is standard for high-quality print output.

```typescript highlight=highlight-setup
    // Load a template scene - this will be our print design
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the scene and page
    const scene = engine.scene.get();
    if (!scene) {
      throw new Error('No scene found');
    }
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Set print resolution (DPI) on the scene
    // 300 DPI is standard for high-quality print output
    engine.block.setFloat(scene, 'scene/dpi', 300);
```

## PDF Export Options for Print

Export a page as PDF using `engine.block.export()` with `mimeType: 'application/pdf'`.

### High Compatibility Mode

The `exportPdfWithHighCompatibility` option rasterizes complex elements like gradients with transparency at the scene's DPI. Enable this when:

- Designs use gradients with transparency
- Effects or blend modes render inconsistently across PDF viewers
- Maximum compatibility across print RIPs matters more than vector precision

```typescript highlight=highlight-export-high-compatibility
// Enable high compatibility mode for consistent rendering across PDF viewers
// This rasterizes complex elements like gradients with transparency at the scene's DPI
const highCompatPdf = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true
});
```

Disabling high compatibility produces faster exports with smaller file sizes but may cause rendering inconsistencies in some PDF viewers.

### Standard PDF Export

When targeting modern PDF viewers where file size and export speed matter more than universal compatibility:

```typescript highlight=highlight-export-standard-pdf
// Disable high compatibility for faster exports when targeting modern PDF viewers
// Complex elements remain as vectors but may render differently across viewers
const standardPdf = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: false
});
```

In this mode CE.SDK embeds unmodified JPEG images with their original data instead of rasterizing them, which strongly reduces export time and file size for photo-heavy documents such as photo books.

Print jobs usually keep the default `pdfImageQuality` of `1.0`, which encodes the images that still have to be rasterized losslessly. Lower the value only when a smaller file matters more than print fidelity.

## Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on:

- Transparent or non-white substrates
- DTF (Direct-to-Film) transfers
- Fabric, glass, or dark materials

### Define the Underlayer Spot Color

Before exporting with an underlayer, define the spot color that represents the underlayer ink. Use `engine.editor.setSpotColorRGB()` to create a named spot color with RGB preview values.

```typescript highlight=highlight-define-spot-color
// Define the underlayer spot color before export
// This creates a named spot color that will be used for the underlayer ink
// The RGB values (0.8, 0.8, 0.8) provide a preview representation
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
```

### Export with Underlayer

Enable `exportPdfWithUnderlayer` and specify the `underlayerSpotColorName` to generate an underlayer from design contours. The underlayer offset controls the size adjustment—negative values shrink the underlayer inward to prevent visible edges from print misalignment.

```typescript highlight=highlight-export-with-underlayer
// Export with underlayer enabled for DTF or special media printing
// The underlayer generates a shape behind design elements filled with the spot color
const underlayerPdf = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  // Negative offset shrinks the underlayer inward to prevent visible edges
  underlayerOffset: -2.0
});
```

### Underlayer Offset

The `underlayerOffset` option adjusts the underlayer size in design units. Negative values shrink the underlayer inward, which prevents visible white edges when the print layers don't align perfectly. Start with values like `-1.0` to `-3.0` and adjust based on your print equipment's alignment accuracy.

## Export with Target Size

Control the exported PDF dimensions using `targetWidth` and `targetHeight`. These values are in pixels and work together with the scene's DPI setting to determine physical print size.

```typescript highlight=highlight-export-target-size
// Export with specific dimensions for print output
// targetWidth and targetHeight control the exported PDF dimensions in pixels
const targetSizePdf = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  targetWidth: 2480, // A4 at 300 DPI (210mm)
  targetHeight: 3508 // A4 at 300 DPI (297mm)
});
```

## Save to File System

Convert the exported blob to a buffer and write it to disk using Node.js file system APIs.

```typescript highlight=highlight-save-file
// Convert blob to buffer and write to file system
const highCompatBuffer = Buffer.from(await highCompatPdf.arrayBuffer());
writeFileSync('print-high-compatibility.pdf', highCompatBuffer);
console.log(
  `High compatibility PDF exported (${(highCompatBuffer.length / 1024).toFixed(1)} KB)`
);
```

## CMYK PDFs with ICC Profiles

For CMYK color space and ICC profile embedding, use the **Print Ready PDF plugin**. This plugin post-processes exports to convert RGB to CMYK with embedded ICC profiles.

See the [Print Ready PDF Plugin](./plugins/print-ready-pdf.md) for setup and usage.

## Troubleshooting

### PDF Not Opening Correctly in Print Software

Enable `exportPdfWithHighCompatibility: true` to rasterize complex elements that may not render correctly in prepress software.

### Underlayer Not Visible in PDF Viewer

Standard PDF viewers may not display spot colors. Use professional print software like Adobe Acrobat Pro or prepress tools to verify the underlayer separation.

### Colors Look Different After Printing

Standard export uses RGB. Use the Print Ready PDF plugin with appropriate ICC profiles for accurate CMYK reproduction.

### White Edges on Special Media

Increase the negative `underlayerOffset` value to shrink the underlayer further from design edges. Try values like `-2.0` or `-3.0` depending on your equipment's alignment tolerance.

## API Reference

| Method/Option | Purpose |
|---------------|---------|
| `engine.block.export(block, options)` | Export block to PDF |
| `mimeType: 'application/pdf'` | Specify PDF output format |
| `targetWidth` | Target width for exported PDF in pixels |
| `targetHeight` | Target height for exported PDF in pixels |
| `exportPdfWithHighCompatibility` | Rasterize bitmap images and gradients at scene DPI (default: `true`) |
| `pdfImageQuality` | Encoding quality for rasterized images; values below `1.0` use lossy JPEG (default: `1.0`) |
| `exportPdfWithUnderlayer` | Generate underlayer from contours (default: `false`) |
| `underlayerSpotColorName` | Spot color name for underlayer ink |
| `underlayerOffset` | Size adjustment in design units (negative shrinks) |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define spot color for underlayer |
| `engine.block.setFloat(scene, 'scene/dpi', value)` | Set scene DPI for print resolution |
| `writeFileSync(path, buffer)` | Write buffer to file system (Node.js) |

## Next Steps

- [Print Ready PDF Plugin](./plugins/print-ready-pdf.md) - CMYK PDFs with ICC profiles
- [CMYK Colors](./colors/for-print/cmyk.md) - Configure CMYK colors
- [Spot Colors](./colors/for-print/spot.md) - Define and use spot colors
- [Export to PDF](./export-save-publish/export/to-pdf.md) - General PDF export options



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support