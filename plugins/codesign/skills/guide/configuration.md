> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Configuration](./configuration.md)

---

Set up CE.SDK engine with license keys, asset base URLs, user IDs, and configuration options for server-side processing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-configuration-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-configuration-server-js)

`CreativeEngine.init()` initializes the CE.SDK engine for headless operations in Node.js environments. The configuration object controls license validation, asset loading, user tracking, and logging behavior.

```typescript file=@cesdk_web_examples/guides-configuration-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * Custom logger that prefixes messages with timestamp and level
 */
function createLogger(prefix: string) {
  return (message: string, level = 'Info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${prefix}] [${level}] ${message}`);
  };
}

// License key removes watermarks from exports
// Get a free trial at https://img.ly/forms/free-trial
const license = process.env.CESDK_LICENSE ?? '';

// Location of core engine assets (WASM, data files)
// For production, host assets yourself instead of using the IMG.LY CDN:
// const baseURL = 'https://your-cdn.com/cesdk-assets/';

// User ID for accurate MAU tracking
const userId = 'server-process-' + process.pid;

/**
 * Configuration for CreativeEngine.init()
 */
const initConfig = {
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  license,
  userId,
  logger: createLogger('CE.SDK')
};

/**
 * Demonstrate runtime settings
 */
function demonstrateRuntimeSettings(engine: CreativeEngine): void {
  console.log('\n=== Runtime Settings ===\n');

  // Configure engine settings using setSetting/getSetting
  engine.editor.setSetting('doubleClickToCropEnabled', false);
  const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
  console.log(`doubleClickToCropEnabled: ${cropEnabled}`);

  engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
  const highlightColor = engine.editor.getSetting('highlightColor');
  console.log(`highlightColor: ${JSON.stringify(highlightColor)}`);
}

/**
 * Export the result to output directory
 */
async function exportResult(
  engine: CreativeEngine,
  page: number
): Promise<string> {
  // Create output directory
  if (!existsSync('output')) {
    mkdirSync('output', { recursive: true });
  }

  // Export as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = 'output/configuration-demo.png';
  writeFileSync(outputPath, buffer);
  console.log(`\nExported to ${outputPath}`);

  return outputPath;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init(initConfig);

try {
  console.log('=== CE.SDK Server Configuration Demo ===\n');

  // Create a scene
  console.log('Creating scene...');
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];
  console.log('Scene created (800x600)\n');

  // Create gradient background (matching browser example)
  const gradientFill = engine.block.createFill('gradient/linear');
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 0.15, g: 0.1, b: 0.35, a: 1.0 }, stop: 0 },
    { color: { r: 0.4, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
    { color: { r: 0.6, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
  ]);
  engine.block.setFill(page, gradientFill);
  console.log('Gradient background applied');

  // Add centered title text
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  const titleText = engine.block.create('text');
  engine.block.replaceText(titleText, 'Configure your Editor');
  engine.block.setFloat(titleText, 'text/fontSize', 12);
  engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
  engine.block.setWidthMode(titleText, 'Auto');
  engine.block.setHeightMode(titleText, 'Auto');
  engine.block.appendChild(page, titleText);

  // Add IMG.LY subtext
  const subtitleText = engine.block.create('text');
  engine.block.replaceText(subtitleText, 'Powered by IMG.LY');
  engine.block.setFloat(subtitleText, 'text/fontSize', 6);
  engine.block.setTextColor(subtitleText, { r: 0.9, g: 0.9, b: 0.9, a: 0.8 });
  engine.block.setWidthMode(subtitleText, 'Auto');
  engine.block.setHeightMode(subtitleText, 'Auto');
  engine.block.appendChild(page, subtitleText);

  // Center both texts
  const titleWidth = engine.block.getFrameWidth(titleText);
  const titleHeight = engine.block.getFrameHeight(titleText);
  const subtitleWidth = engine.block.getFrameWidth(subtitleText);
  const subtitleHeight = engine.block.getFrameHeight(subtitleText);

  const spacing = 12;
  const totalHeight = titleHeight + spacing + subtitleHeight;
  const startY = (pageHeight - totalHeight) / 2;

  engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleText, startY);
  engine.block.setPositionX(subtitleText, (pageWidth - subtitleWidth) / 2);
  engine.block.setPositionY(subtitleText, startY + titleHeight + spacing);
  console.log('Title and subtitle added');

  // Demonstrate runtime settings
  demonstrateRuntimeSettings(engine);

  // Export result
  await exportResult(engine, page);

  console.log('\nDemo complete!');
} finally {
  // Clean up engine resources
  engine.dispose();
  console.log('Engine disposed');
}
```

This guide covers required and optional configuration properties, and runtime APIs for server-side CE.SDK usage.

## Required Configuration

The `license` property is the only required configuration. All other properties have sensible defaults.

| Property | Type | Purpose |
|----------|------|---------|
| `license` | `string` | License key to remove export watermarks |

The license key validates your CE.SDK subscription and removes watermarks from exports. Without a valid license, exports include a watermark. Get a free trial license at [https://img.ly/forms/free-trial](https://img.ly/forms/free-trial).

```javascript
const config = {
  license: process.env.CESDK_LICENSE || ''
};

const engine = await CreativeEngine.init(config);
```

## Optional Configuration

These properties customize engine behavior and are all optional.

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `baseURL` | `string` | IMG.LY CDN | Location of core engine assets (WASM, data files) |
| `userId` | `string` | — | User identifier for MAU tracking |
| `logger` | `function` | Console | Custom logging function |
| `role` | `'Creator'` | `'Adopter'` | `'Viewer'` | `'Presenter'` | `'Creator'` | User role for feature access |
| `featureFlags` | `object` | — | Experimental feature toggles |

## Configuration Properties

### License Key

The license key validates your CE.SDK subscription and removes watermarks from exports. Without a valid license, exports include a watermark.

```typescript highlight=highlight-license
// License key removes watermarks from exports
// Get a free trial at https://img.ly/forms/free-trial
const license = process.env.CESDK_LICENSE ?? '';
```

### Asset Base URL

The `baseURL` property specifies the location of core engine assets, including WASM files and data files. By default, these load from the IMG.LY CDN. For production deployments, host these assets yourself by copying the `assets` folder from `node_modules/@cesdk/node/assets` to your server.

The server package does not include asset source plugins. Content assets like stickers and filters are only available in browser builds.

```typescript highlight=highlight-baseURL
// Location of core engine assets (WASM, data files)
// For production, host assets yourself instead of using the IMG.LY CDN:
// const baseURL = 'https://your-cdn.com/cesdk-assets/';
```

### User ID

Provide a unique user identifier for accurate Monthly Active User (MAU) tracking. This helps count users correctly when processing requests from different sources.

```typescript highlight=highlight-userId
// User ID for accurate MAU tracking
const userId = 'server-process-' + process.pid;
```

### Custom Logger

Replace the default console logging with a custom logger function. The logger receives a message string and an optional log level (`'Info'`, `'Warning'`, or `'Error'`).

```typescript highlight=highlight-custom-logger
/**
 * Custom logger that prefixes messages with timestamp and level
 */
function createLogger(prefix: string) {
  return (message: string, level = 'Info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${prefix}] [${level}] ${message}`);
  };
}
```

### Initialization

Pass the configuration object to `CreativeEngine.init()` to start the engine.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init(initConfig);
```

## Runtime Settings

After initialization, configure engine behavior using `engine.editor.setSetting()` and `engine.editor.getSetting()`. Settings control features like double-click crop behavior and highlight colors.

```typescript highlight=highlight-runtime-settings
/**
 * Demonstrate runtime settings
 */
function demonstrateRuntimeSettings(engine: CreativeEngine): void {
  console.log('\n=== Runtime Settings ===\n');

  // Configure engine settings using setSetting/getSetting
  engine.editor.setSetting('doubleClickToCropEnabled', false);
  const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
  console.log(`doubleClickToCropEnabled: ${cropEnabled}`);

  engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
  const highlightColor = engine.editor.getSetting('highlightColor');
  console.log(`highlightColor: ${JSON.stringify(highlightColor)}`);
}
```

## Exporting Results

After processing a scene, export the result to a file. The engine's `block.export()` method returns a Blob that you can convert to a Buffer for file system operations.

```typescript highlight=highlight-export-result
/**
 * Export the result to output directory
 */
async function exportResult(
  engine: CreativeEngine,
  page: number
): Promise<string> {
  // Create output directory
  if (!existsSync('output')) {
    mkdirSync('output', { recursive: true });
  }

  // Export as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = 'output/configuration-demo.png';
  writeFileSync(outputPath, buffer);
  console.log(`\nExported to ${outputPath}`);

  return outputPath;
}
```

## Engine Disposal

Clean up engine resources when done processing by calling `engine.dispose()`. Place this in a finally block to ensure cleanup even if errors occur.

```typescript highlight=highlight-dispose
// Clean up engine resources
engine.dispose();
```

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `CreativeEngine.init()` | Initialization | Initialize headless engine with config |
| `engine.editor.setSetting()` | Runtime | Set engine setting |
| `engine.editor.getSetting()` | Runtime | Get engine setting |
| `engine.block.export()` | Export | Export block to image format |
| `engine.dispose()` | Lifecycle | Clean up engine resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support