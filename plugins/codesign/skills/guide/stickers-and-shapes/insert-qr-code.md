> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Insert QR Code](./stickers-and-shapes/insert-qr-code.md) > [Plugins](./plugins.md) > [QR Code](./stickers-and-shapes/insert-qr-code.md)

---

Add scannable QR codes to designs programmatically using image fills.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-insert-qr-code-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-stickers-and-shapes-insert-qr-code-server-js)

QR codes encode URLs that mobile devices can scan, making them useful for marketing materials, business cards, event posters, and product packaging. This guide shows how to generate QR codes as images and add them to CE.SDK designs in a headless Node.js environment.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-insert-qr-code-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { generateQRCodeDataURL } from './qr-utils';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Insert QR Code
 *
 * Demonstrates creating QR codes programmatically in Node.js using image fills.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];

  // Generate QR code as data URL image with custom colors
  const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
    width: 256,
    color: { dark: '#1a5fb4', light: '#ffffff' }
  });

  // Create graphic block with rectangle shape and image fill
  const imageQrBlock = engine.block.create('graphic');
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageQrBlock, rectShape);

  // Create image fill with QR code data URL
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
  engine.block.setFill(imageQrBlock, imageFill);

  // Set dimensions and position for image-based QR code
  const qrSize = 300;
  engine.block.setWidth(imageQrBlock, qrSize);
  engine.block.setHeight(imageQrBlock, qrSize);
  engine.block.setPositionX(imageQrBlock, 50);
  engine.block.setPositionY(imageQrBlock, 50);

  // Add to page
  engine.block.appendChild(page, imageQrBlock);

  // Export the QR code result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/qr-code.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported QR code to output/qr-code.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## Setting Up the Engine

Initialize CE.SDK in headless mode for server-side processing.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The headless engine runs without a UI, suitable for automated QR code generation.

## Generating QR Code Images

Use a QR code library like `qrcode` to generate QR codes as data URLs with custom colors.

```typescript highlight-generate-image
// Generate QR code as data URL image with custom colors
const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
  width: 256,
  color: { dark: '#1a5fb4', light: '#ffffff' }
});
```

The `toDataURL` method creates a base64-encoded image that works directly with CE.SDK's image fill. You can customize the colors at generation time.

## Creating a QR Code Block

Create a graphic block with a rectangle shape and apply the QR code as an image fill.

```typescript highlight-create-image-block
  // Create graphic block with rectangle shape and image fill
  const imageQrBlock = engine.block.create('graphic');
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageQrBlock, rectShape);

  // Create image fill with QR code data URL
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
  engine.block.setFill(imageQrBlock, imageFill);
```

Image fills use a rectangle shape with the QR code as the fill content. This approach is straightforward and supports color customization at generation time.

## Positioning and Sizing

Set the QR code dimensions and position on the page.

```typescript highlight-position-image
  // Set dimensions and position for image-based QR code
  const qrSize = 300;
  engine.block.setWidth(imageQrBlock, qrSize);
  engine.block.setHeight(imageQrBlock, qrSize);
  engine.block.setPositionX(imageQrBlock, 50);
  engine.block.setPositionY(imageQrBlock, 50);

  // Add to page
  engine.block.appendChild(page, imageQrBlock);
```

Maintain a square aspect ratio by setting equal width and height. For reliable scanning, keep QR codes at least 100x100 pixels.

## Exporting the Result

Export the design with the QR code to a file.

```typescript highlight-export
// Export the QR code result
const blob = await engine.block.export(page, { mimeType: 'image/png' });
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync(`${outputDir}/qr-code.png`, buffer);
// eslint-disable-next-line no-console
console.log('✓ Exported QR code to output/qr-code.png');
```

Export to PNG for raster output. The QR code will be embedded in the exported image.

## Cleaning Up

Always dispose the engine when done to free resources.

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

The `dispose` method releases all engine resources. Use a try/finally pattern to ensure cleanup happens even if errors occur.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `CreativeEngine.init(config)` | Setup | Initialize headless engine |
| `engine.scene.create()` | Scene | Create scene with page |
| `engine.block.create('graphic')` | Creation | Create graphic block for QR code |
| `engine.block.createShape('rect')` | Shapes | Create rectangle shape |
| `engine.block.setShape(id, shape)` | Shapes | Apply shape to graphic block |
| `engine.block.createFill('image')` | Fills | Create image fill |
| `engine.block.setString(id, 'fill/image/imageFileURI', uri)` | Fills | Set image data URL |
| `engine.block.setFill(id, fill)` | Fills | Apply fill to block |
| `engine.block.setWidth(id, width)` | Transform | Set QR code width |
| `engine.block.setHeight(id, height)` | Transform | Set QR code height |
| `engine.block.setPositionX(id, x)` | Transform | Set horizontal position |
| `engine.block.setPositionY(id, y)` | Transform | Set vertical position |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add QR code to page |
| `engine.block.export(id, options)` | Export | Export design to image |
| `engine.dispose()` | Cleanup | Release engine resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support