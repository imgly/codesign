> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Conversion](./conversion.md) > [To PDF](./conversion/to-pdf.md)

---

The CE.SDK allows you to convert JPEG, PNG, WebP, BMP and SVG images into PDFs directly in your Node.js process—no external service required. You can perform this conversion programmatically with the engine API.

The CE.SDK supports converting single or multiple images to PDF while allowing transformations such as cropping, rotating, and adding text before exporting. You can also customize PDF output settings, including resolution, compatibility and underlayer.

## Convert to PDF Programmatically

You can use the CE.SDK to load an image, apply basic edits, and export it as a PDF programmatically. The following examples demonstrate how to convert a single image and how to merge multiple images into a single PDF.

### Convert a Single Image to PDF

The example below loads an image, applies transformations, and exports it as a PDF:

```ts example=basic-scene marker=cesdk-init-after
// Prepare an image URL
const imageURL = 'https://example.com/image.jpg';

// Create a new scene by loading the image immediately
await instance.createFromImage(image);

// Find the automatically added graphic block with an image fill
const block = engine.block.findByType('graphic')[0];

// Apply crop with a scale ratio of 2.0
engine.block.setCropScaleRatio(block, 2.0);

// Export as PDF Blob
const page = engine.scene.getCurrentPage();
const blob = await engine.block.export(page, { mimeType: 'application/pdf' });
// You can now save it or display it in your application
```

### Combine Multiple Images into a Single PDF

The example below demonstrates how to merge multiple images into a single PDF document:

```ts example=merge-images marker=cesdk-init-after
// Prepare image URLs
const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.png',
  'https://example.com/image3.webp',
];

// Create an empty scene with a 'VerticalStack' layout
const scene = await engine.scene.create('VerticalStack');
const [stack] = engine.block.findByType('stack');

// Load all images as pages
for (const image of images) {
  // Append the new page to the stack
  const page = engine.block.create('page');
  engine.block.appendChild(stack, page);
  // Set the image as the fill of the page
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', image);
  engine.block.setFill(page, imageFill);
}

// Export all images as a single PDF blob
const blob = await engine.block.export(scene, { mimeType: 'application/pdf' });
// You can now save it or display it in your application
```

## Configuring PDF Output

The SDK provides various options for customizing PDF exports. You can control resolution, compatibility and underlayer.

### Available PDF Output Settings

- **Resolution:** Adjust the DPI (dots per inch) to create print-ready PDFs with the desired level of detail.
- **Page Size:** Define custom dimensions in pixels for the output PDF. If specified, the block will scale to fully cover the target size while maintaining its aspect ratio.
- **Compatibility:** Enable this setting to improve compatibility with various PDF viewers. When enabled, images and effects are rasterized based on the scene's DPI instead of being embedded as vector elements.
- **Underlayer:** Add an underlayer beneath the image content to optimize printing on non-white or specialty media (e.g., fabric, glass). The ink type is defined in `ExportOptions` using a spot color. You can also apply a positive or negative offset, in design units, to adjust the underlayer's scale.

### PDF Performance Optimization

The `exportPdfWithHighCompatibility` flag significantly impacts PDF export performance, especially for high-DPI content:

**When `true` (default - safer but slower):**

- Rasterizes images and gradients at the scene's DPI setting
- Maximum compatibility with all PDF viewers including Safari and macOS Preview
- Slower performance (4-10x slower for high-DPI content)
- Larger file sizes

**When `false` (faster but needs testing):**

- Embeds images and gradients directly as native PDF objects
- Embeds unmodified JPEG images with their original data, so photos are neither decoded nor encoded again
- 6-15x faster export performance for high-DPI content
- Smaller file sizes (typically 30-40% reduction)
- May have rendering issues in Safari/macOS Preview with gradients that use transparency

```javascript
const scene = engine.scene.get();

// For maximum performance (test with your print workflow first)
engine.block.setFloat(scene, 'scene/dpi', 150); // Reduce from default 300
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: false, // Much faster
});
```

**Before using `exportPdfWithHighCompatibility: false` in production:**

- Test generated PDFs with your actual print vendor/equipment
- Verify rendering in Safari and macOS Preview if end-users will view PDFs in those applications
- Check that gradients with transparency render correctly
- Confirm your content renders properly in Adobe Acrobat and Chrome (these typically work fine)

**Safe to use `false` when:**

- PDFs go directly to professional printing (not viewed in Safari/Preview)
- Content is primarily photos and solid colors (minimal gradients with transparency)
- Performance is critical for batch processing workflows

**Keep `true` when:**

- Users view PDFs in Safari or macOS Preview
- Maximum compatibility is required
- Content has complex gradients with transparency
- You cannot test with your print workflow before production

### Customizing PDF Output

You can configure these settings when exporting:

```ts example=basic-scene marker=cesdk-init-after
const scene = engine.scene.get();

// Adjust the DPI to 72
engine.block.setFloat(scene, 'scene/dpi', 72);

// Set spot color to be used as underlayer
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  // Set target width and height in pixels
  targetWidth: 800,
  targetHeight: 600,
  // Increase compatibility with different PDF viewers
  exportPdfWithHighCompatibility: true,
  // Add an underlayer beneath the image content
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  underlayerOffset: -2.0,
});
```



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support