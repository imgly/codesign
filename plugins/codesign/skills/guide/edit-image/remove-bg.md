> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Remove Background](./edit-image/remove-bg.md) > [Plugins](./plugins.md) > [Background Removal](./edit-image/remove-bg.md)

---

Remove image backgrounds programmatically on the server for automated processing pipelines and batch operations.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-edit-image-remove-bg-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-edit-image-remove-bg-server-js)

The `@imgly/background-removal-node` package provides AI-powered background removal for Node.js applications. Processing runs entirely on your server using native bindings, eliminating external API dependencies and ensuring data privacy.

```typescript file=@cesdk_web_examples/guides-edit-image-remove-bg-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { removeBackground, type Config } from '@imgly/background-removal-node';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Remove Background with @imgly/background-removal-node
 *
 * Demonstrates configuring and using the background removal library
 * for server-side image processing in Node.js.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create a graphic block with an image that has a background
  const imageBlock = engine.block.create('graphic');

  // Create a rect shape for the image
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, rectShape);

  // Create an image fill with a sample portrait image
  const imageFill = engine.block.createFill('image');
  const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);

  // Apply the fill to the graphic block
  engine.block.setFill(imageBlock, imageFill);

  // Set content fill mode to cover the block
  engine.block.setContentFillMode(imageBlock, 'Cover');

  // Size and position the image block
  const imageWidth = 400;
  const imageHeight = 450;
  engine.block.setWidth(imageBlock, imageWidth);
  engine.block.setHeight(imageBlock, imageHeight);
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  // Add to page
  engine.block.appendChild(page, imageBlock);

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Configure background removal options
  const removalConfig: Config = {
    // Model size: 'small' for speed, 'medium' for balance, 'large' for quality
    model: 'medium',
    // Output format and quality
    output: {
      format: 'image/png',
      quality: 0.9,
    },
    // Progress callback for monitoring
    progress: (key, current, total) => {
      const percentage = Math.round((current / total) * 100);
      console.log(`  ${key}: ${percentage}%`);
    },
  };

  // Export the image block as PNG blob
  console.log('Removing background...');
  const imageBlob = await engine.block.export(imageBlock, {
    mimeType: 'image/png',
  });

  // Remove background using the configured options
  const processedBlob = await removeBackground(imageBlob, removalConfig);
  console.log('✓ Background removed successfully');

  // Convert the processed blob to a data URL and apply it back to the scene
  const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());
  const base64Image = processedBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  // Update the image fill with the processed image
  engine.block.setString(imageFill, 'fill/image/imageFileURI', dataUrl);
  console.log('✓ Applied processed image to scene');

  // Export the final result with transparent background
  const resultBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
  writeFileSync(`${outputDir}/remove-bg-result.png`, resultBuffer);
  console.log('✓ Exported result to output/remove-bg-result.png');

  console.log('\n✓ Processing complete!');
  console.log('  Output directory:', outputDir);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers installing the library, configuring processing options, and integrating with CE.SDK for automated image processing pipelines.

## Installing the Library

Install the background removal library alongside the CE.SDK Node engine:

```bash
npm install @cesdk/node@$UBQ_VERSION$ @imgly/background-removal-node
```

Using the native Node.js package? Install `@cesdk/node-native@$UBQ_VERSION$` instead of `@cesdk/node` — the engine API is identical.

Import the `removeBackground` function and `Config` type:

```typescript highlight-import
import { removeBackground, type Config } from '@imgly/background-removal-node';
```

## Initializing the Engine

Initialize the CE.SDK engine in headless mode for server-side processing:

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The engine runs without a UI, making it suitable for automated workflows and background processing tasks.

## Creating an Image Block

Create a scene with a graphic block containing an image:

```typescript highlight-create-image
  // Create a graphic block with an image that has a background
  const imageBlock = engine.block.create('graphic');

  // Create a rect shape for the image
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, rectShape);

  // Create an image fill with a sample portrait image
  const imageFill = engine.block.createFill('image');
  const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);

  // Apply the fill to the graphic block
  engine.block.setFill(imageBlock, imageFill);

  // Set content fill mode to cover the block
  engine.block.setContentFillMode(imageBlock, 'Cover');

  // Size and position the image block
  const imageWidth = 400;
  const imageHeight = 450;
  engine.block.setWidth(imageBlock, imageWidth);
  engine.block.setHeight(imageBlock, imageHeight);
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  // Add to page
  engine.block.appendChild(page, imageBlock);
```

## Configuring Background Removal

The `removeBackground` function accepts a configuration object to customize the processing:

```typescript highlight-configure
// Configure background removal options
const removalConfig: Config = {
  // Model size: 'small' for speed, 'medium' for balance, 'large' for quality
  model: 'medium',
  // Output format and quality
  output: {
    format: 'image/png',
    quality: 0.9,
  },
  // Progress callback for monitoring
  progress: (key, current, total) => {
    const percentage = Math.round((current / total) * 100);
    console.log(`  ${key}: ${percentage}%`);
  },
};
```

### Configuration Options

| Option | Type | Description |
| --- | --- | --- |
| `model` | `'small'` | `'medium'` | `'large'` | Model size for quality/speed trade-off |
| `output.format` | string | Output format: `'image/png'`, `'image/webp'`, `'image/jpeg'` |
| `output.quality` | number | Quality for lossy formats (0-1) |
| `progress` | function | Callback receiving `(key, current, total)` for progress updates |
| `debug` | boolean | Enable debug logging |

Model selection guidelines:

- **`'small'`**: Fastest processing, suitable for thumbnails or previews
- **`'medium'`**: Best balance of quality and speed for most use cases
- **`'large'`**: Maximum edge quality, slower processing

## Removing the Background

Export the image block and process it with the configured options:

```typescript highlight-remove-background
  // Export the image block as PNG blob
  console.log('Removing background...');
  const imageBlob = await engine.block.export(imageBlock, {
    mimeType: 'image/png',
  });

  // Remove background using the configured options
  const processedBlob = await removeBackground(imageBlob, removalConfig);
  console.log('✓ Background removed successfully');
```

The `removeBackground` function accepts various input types:

- **Blob**: Direct blob from CE.SDK export
- **URL string**: Remote image URL
- **File path**: Local file path
- **Buffer**: Node.js Buffer

## Applying the Result

Convert the processed blob to a data URL and apply it back to the scene:

```typescript highlight-apply-result
  // Convert the processed blob to a data URL and apply it back to the scene
  const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());
  const base64Image = processedBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  // Update the image fill with the processed image
  engine.block.setString(imageFill, 'fill/image/imageFileURI', dataUrl);
  console.log('✓ Applied processed image to scene');
```

## Exporting the Final Result

Export the scene with the processed image as a PNG file:

```typescript highlight-export
// Export the final result with transparent background
const resultBlob = await engine.block.export(page, { mimeType: 'image/png' });
const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
writeFileSync(`${outputDir}/remove-bg-result.png`, resultBuffer);
console.log('✓ Exported result to output/remove-bg-result.png');
```

PNG format preserves the alpha channel, maintaining the transparent background.

## Cleanup

Always dispose the engine when processing completes to free resources:

```typescript highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

The `finally` block ensures cleanup happens even if an error occurs during processing.

## Additional Functions

The library provides additional functions for specialized use cases:

```typescript
import {
  removeBackground,
  removeForeground,
  segmentForeground,
  applySegmentationMask
} from '@imgly/background-removal-node';

// Remove foreground instead of background
const foregroundRemoved = await removeForeground(image, config);

// Get just the segmentation mask
const mask = await segmentForeground(image, config);

// Apply a custom mask to an image
const masked = await applySegmentationMask(image, mask, config);
```

## Performance Considerations

Server-side background removal has different performance characteristics than browser processing:

- **First run**: Downloads AI models (~40MB) which are cached for subsequent runs
- **Memory usage**: Processing large images requires significant memory; monitor server resources
- **CPU utilization**: Background removal is CPU-intensive; consider dedicated workers for high-volume processing
- **Batch optimization**: Process images sequentially or with limited concurrency to avoid memory exhaustion

For production deployments, consider:

- Pre-loading models during server startup
- Implementing job queues for batch processing
- Setting memory limits per processing task
- Using horizontal scaling for high-volume workloads

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Model download slow | First run fetches models; subsequent runs use cache |
| Out of memory | Reduce image size or process fewer images concurrently |
| Poor edge quality | Use higher resolution input or 'medium'/'large' model |
| File not found | Verify file paths are absolute or relative to working directory |
| Permission denied | Check file system permissions for output directory |

## Next Steps

- [Chroma Key](./filters-and-effects/chroma-key-green-screen.md) - Alternative background removal using green screen
- [Export Overview](./export-save-publish/export/overview.md) - Export options for images with transparency
- [Replace Colors](./edit-image/replace-colors.md) - Replace specific colors in images



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support