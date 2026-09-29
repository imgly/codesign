> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Size Limits](./export-save-publish/export/size-limits.md)

---

Configure size limits to balance quality and performance in headless Node.js workflows.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

CE.SDK processes images and videos in server environments using CPU and GPU resources, which means size limits depend on your server's hardware capabilities and available memory. Understanding and configuring these limits helps you build automation workflows that deliver high-quality results while maintaining efficient resource usage in batch processing, serverless functions, and containerized deployments.

```typescript file=@cesdk_web_examples/guides-export-save-publish-size-limits-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Size Limits
 *
 * Demonstrates how to configure and work with image size limits:
 * - Reading current maxImageSize setting
 * - Configuring maxImageSize for different scenarios
 * - Observing settings changes
 * - Understanding export size constraints
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Read the current maxImageSize setting
  const currentMaxImageSize = engine.editor.getSetting('maxImageSize');
  // eslint-disable-next-line no-console
  console.log(`Current maxImageSize: ${currentMaxImageSize}px`);
  // Default is 4096 pixels - safe baseline for universal compatibility

  // Subscribe to settings changes to react to configuration updates
  const unsubscribe = engine.editor.onSettingsChanged(() => {
    const newMaxImageSize = engine.editor.getSetting('maxImageSize');
    // eslint-disable-next-line no-console
    console.log(`maxImageSize changed to: ${newMaxImageSize}px`);
  });

  // Configure maxImageSize for low memory environments
  // This must be set BEFORE loading images to ensure they're downscaled
  engine.editor.setSetting('maxImageSize', 2048);
  // eslint-disable-next-line no-console
  console.log(
    `Updated maxImageSize: ${engine.editor.getSetting('maxImageSize')}px`
  );

  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  // Use sample image for demonstration
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image to the page for demonstration
  // Note: In Node.js, size parameter is required (no DOM Image API)
  // The size parameter controls display dimensions, while maxImageSize controls texture loading
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 800, height: 600 },
  });
  engine.block.appendChild(page, imageBlock);

  // Position image to fill the page
  engine.block.setPositionX(imageBlock, 0);
  engine.block.setPositionY(imageBlock, 0);

  // Validate export dimensions before processing
  // Check if dimensions are safe for the server's memory and timeout constraints
  const exportWidth = engine.block.getWidth(page);
  const exportHeight = engine.block.getHeight(page);
  const maxSafeSize = 8192; // Configure based on server capabilities

  // eslint-disable-next-line no-console
  console.log(`Export dimensions: ${exportWidth}×${exportHeight}`);

  if (exportWidth > maxSafeSize || exportHeight > maxSafeSize) {
    // eslint-disable-next-line no-console
    console.warn(
      `⚠ Export dimensions (${exportWidth}×${exportHeight}) exceed safe limits (${maxSafeSize}×${maxSafeSize})`
    );
    // eslint-disable-next-line no-console
    console.warn(
      'Consider reducing dimensions or using a higher-memory server'
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('✓ Export dimensions are within safe limits');
  }

  // Export the result to PNG
  // Note: Export size is not limited by maxImageSize setting
  // Export may fail if output exceeds server memory or rendering limits
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/size-limits-result.png`, buffer);

    // eslint-disable-next-line no-console
    console.log('✓ Exported result to output/size-limits-result.png');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('Export failed:', errorMessage);

    // Check if error is size-related
    if (
      errorMessage.includes('memory') ||
      errorMessage.includes('size') ||
      errorMessage.includes('texture')
    ) {
      // eslint-disable-next-line no-console
      console.error('Size-related export failure detected');
      // eslint-disable-next-line no-console
      console.error(
        'Remediation: Reduce maxImageSize, decrease export dimensions, or use compression'
      );

      // Implement automatic retry with reduced settings
      engine.editor.setSetting('maxImageSize', 2048);
      // eslint-disable-next-line no-console
      console.log('Retrying export with reduced maxImageSize: 2048px');

      // Retry export with lower quality
      const retryBlob = await engine.block.export(page, {
        mimeType: 'image/png',
      });
      const retryBuffer = Buffer.from(await retryBlob.arrayBuffer());
      writeFileSync(`${outputDir}/size-limits-result-reduced.png`, retryBuffer);

      // eslint-disable-next-line no-console
      console.log(
        '✓ Exported reduced quality result to output/size-limits-result-reduced.png'
      );
    } else {
      throw error; // Re-throw if not size-related
    }
  }

  // Display final configuration summary
  // eslint-disable-next-line no-console
  console.log('\n=== Size Limits Configuration Summary ===');
  // eslint-disable-next-line no-console
  console.log(
    `Current maxImageSize: ${engine.editor.getSetting('maxImageSize')}px`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Page dimensions: ${engine.block.getWidth(page)}×${engine.block.getHeight(page)}`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Image dimensions: ${engine.block.getWidth(imageBlock)}×${engine.block.getHeight(imageBlock)}`
  );

  // Unsubscribe from settings changes
  unsubscribe();
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to configure the `maxImageSize` setting for headless workflows, understand server-side constraints, and implement robust error handling for size-related scenarios in production deployments.

## Understanding Size Limits

CE.SDK manages size limits at two stages: **input** (when loading images) and **output** (when exporting). The `maxImageSize` setting controls input resolution, automatically downscaling images that exceed the configured limit (default: 4096×4096px). This prevents memory issues in serverless functions and containerized environments. Export resolution has no artificial limits—the theoretical maximum is 16,384×16,384 pixels, constrained by server GPU/CPU capabilities, available RAM, and deployment environment (serverless memory limits, container quotas, VM allocations). With the WASM-based `@cesdk/node` package, headless environments use software rendering with conservative limits; the native `@cesdk/node-native` package renders on the GPU where available.

## Resolution & Duration Limits

## Configuring maxImageSize

You can read and modify the `maxImageSize` setting using the Settings API to match your server infrastructure and automation requirements.

### Reading the Current Setting

To check what `maxImageSize` value is currently configured:

```typescript highlight-get-max-image-size
// Read the current maxImageSize setting
const currentMaxImageSize = engine.editor.getSetting('maxImageSize');
// eslint-disable-next-line no-console
console.log(`Current maxImageSize: ${currentMaxImageSize}px`);
// Default is 4096 pixels - safe baseline for universal compatibility
```

This returns the maximum size in pixels as an integer value (e.g., `4096` for the default 4096×4096 limit). You might log this value during server startup to verify configuration, use it to make runtime decisions about asset loading strategies, or include it in diagnostics when troubleshooting export failures.

### Setting a New Value

Configure `maxImageSize` to minimize memory usage in serverless and containerized environments:

```typescript highlight-set-max-image-size
// Configure maxImageSize for low memory environments
// This must be set BEFORE loading images to ensure they're downscaled
engine.editor.setSetting('maxImageSize', 2048);
// eslint-disable-next-line no-console
console.log(
  `Updated maxImageSize: ${engine.editor.getSetting('maxImageSize')}px`
);
```

The setting takes effect immediately for newly loaded images. Images already loaded in the scene retain their current resolution until reloaded.

### Observing Settings Changes

Subscribe to setting changes to log configuration updates or trigger automation workflows:

```typescript highlight-observe-settings-changes
// Subscribe to settings changes to react to configuration updates
const unsubscribe = engine.editor.onSettingsChanged(() => {
  const newMaxImageSize = engine.editor.getSetting('maxImageSize');
  // eslint-disable-next-line no-console
  console.log(`maxImageSize changed to: ${newMaxImageSize}px`);
});
```

This callback fires whenever any setting changes through the Settings API. You can use it to log configuration changes for auditing, update internal metrics tracking, or synchronize settings across distributed processing nodes.

## GPU Capability Detection

In server environments, rendering capabilities depend on the available hardware rather than browser-based WebGL. The native `@cesdk/node-native` package automatically selects the best available rendering backend (GPU via Metal or EGL, with CPU fallback), configurable via its `device` option.

When CE.SDK runs headless with the WASM-based `@cesdk/node` package, it uses software rendering with conservative limits that provide universal compatibility. The native `@cesdk/node-native` package leverages hardware acceleration on servers with GPU access for faster processing and larger export dimensions.

You can use this information to:

- Set conservative `maxImageSize` defaults based on your server's hardware specifications
- Configure different limits for serverless functions vs. dedicated GPU servers
- Implement automatic fallback to lower resolutions when memory is constrained
- Calculate safe export dimensions based on available RAM and processing time limits

For production deployments, test your specific server configuration to determine optimal size limits that balance quality with resource constraints.

## Troubleshooting

Common issues and solutions when working with size limits in server environments:

| Issue                                | Cause                                    | Solution                                                                                    |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Images appear blurry in exports      | `maxImageSize` too low                   | Increase `maxImageSize` if server memory supports it (test with monitoring)                 |
| Out of memory errors during processing | `maxImageSize` too high                | Decrease `maxImageSize` to reduce memory footprint, or increase server memory allocation   |
| Export fails silently                | Output exceeds rendering backend limits   | Reduce export dimensions or test server's actual rendering capabilities                     |
| Serverless function timeout          | Export takes too long for large images   | Lower `maxImageSize` to 2048, reduce export dimensions, or use dedicated server             |
| Inconsistent results across nodes    | Different server configurations          | Set conservative `maxImageSize` (4096) or normalize infrastructure                          |
| Batch processing runs out of memory  | Concurrent exports exceed available RAM   | Process sequentially, reduce `maxImageSize`, or increase server memory                      |
| Container OOM killed                 | Export exceeds container memory limit     | Increase container memory quota or reduce `maxImageSize`                                    |

## API Reference

Core methods for managing size limits and export operations:

| Method                          | Description                             |
| ------------------------------- | --------------------------------------- |
| `engine.editor.getSetting()`    | Retrieves the current value of a setting |
| `engine.editor.setSetting()`    | Updates a setting value                 |
| `engine.editor.onSettingsChanged()` | Subscribes to setting change events     |
| `engine.block.export()`         | Exports a block as an image or video    |
| `engine.block.getWidth()`       | Gets the width of a block in pixels     |
| `engine.block.getHeight()`      | Gets the height of a block in pixels    |

## Next Steps

Explore related guides to build complete server automation workflows:

- [Settings Guide](./settings.md) - Complete Settings API reference and configuration options
- [File Format Support](./file-format-support.md) - Supported image and video formats with capabilities
- [Export Overview](./export-save-publish/export/overview.md) - Fundamentals of exporting images and videos from CE.SDK
- [Export to PDF](./export-save-publish/export/to-pdf.md) - PDF export guide with multi-page support and print optimization



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support