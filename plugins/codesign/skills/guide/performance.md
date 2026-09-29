> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Improve Performance](./performance.md)

---

Optimize CE.SDK integration for faster startup, efficient memory usage, and
reliable performance in Node.js server environments.

The `@cesdk/node` (WASM) and `@cesdk/node-native` (native) packages provide full CreativeEngine functionality for server-side processing. Optimizing how you load, use, and dispose of the engine improves throughput and resource efficiency in production environments.

This guide covers code splitting for serverless environments, memory monitoring for long-running processes, export timeout configuration, and proper lifecycle management patterns.

## Code Splitting

Use dynamic imports to load the engine only when needed. This reduces cold start time in serverless environments where the engine may not be used for every request.

```ts
async function loadCreativeEngine(): Promise<typeof CreativeEngine> {
  console.log('Lazy loading CreativeEngine...');
  const startTime = Date.now();

  // Dynamic import - engine module is loaded only when this function is called
  const { default: CreativeEngine } = await import('@cesdk/node');

  const loadTime = Date.now() - startTime;
  console.log(`CreativeEngine loaded in ${loadTime}ms`);

  return CreativeEngine;
}
```

This pattern defers engine loading until `loadCreativeEngine()` is called. In serverless functions, requests that don't require image processing skip the engine load entirely.

## Memory Management

Monitor memory usage in long-running server processes using the editor's memory APIs. This helps detect memory accumulation across requests and triggers cleanup actions.

### Monitoring Memory Usage

Use `engine.editor.getUsedMemory()` to check current memory consumption and `engine.editor.getAvailableMemory()` to check remaining capacity.

```ts
function logMemoryStats(engine: CreativeEngine, label: string): void {
  const usedMemory = engine.editor.getUsedMemory();
  const availableMemory = engine.editor.getAvailableMemory();

  // Convert to Number for arithmetic (memory APIs may return BigInt)
  const usedNum = Number(usedMemory);
  const availableNum = Number(availableMemory);
  const totalMemory = usedNum + availableNum;
  const usagePercentage = ((usedNum / totalMemory) * 100).toFixed(2);

  console.log(`Memory Stats [${label}]:`);
  console.log(`  Used: ${formatBytes(usedMemory)}`);
  console.log(`  Available: ${formatBytes(availableMemory)}`);
  console.log(`  Usage: ${usagePercentage}%`);
}

function formatBytes(bytes: number | bigint): string {
  const numBytes = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (numBytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

Track these values across requests to:

- Detect memory accumulation that indicates leaks
- Trigger engine disposal and recreation when approaching limits
- Log memory metrics for production monitoring

### Calculating Usage Percentage

Calculate memory usage as a percentage to implement automatic cleanup thresholds. Memory APIs may return BigInt values, so convert to Number for arithmetic operations.

```ts
const usedMemory = engine.editor.getUsedMemory();
const availableMemory = engine.editor.getAvailableMemory();

// Convert to Number for arithmetic (memory APIs may return BigInt)
const usedNum = Number(usedMemory);
const availableNum = Number(availableMemory);
const totalMemory = usedNum + availableNum;
const usagePercentage = (usedNum / totalMemory) * 100;

if (usagePercentage > 80) {
  console.warn('High memory usage detected, consider disposing engine');
}
```

### Managing Memory in Request Handlers

For HTTP servers or queue workers, reset state between requests to prevent memory accumulation:

- Clear the scene before processing each request
- Avoid storing references to blocks across requests
- Consider disposing and recreating the engine after a threshold of requests

## Export Optimization

Configure export behavior for reliable processing of large designs or complex scenes.

### Export Timeouts

Configure inactivity timeouts to prevent hanging exports. Use `engine.unstable_setExportInactivityTimeout()` for image exports and `engine.unstable_setVideoExportInactivityTimeout()` for video exports.

```ts
// Configure export timeouts for reliability
engine.unstable_setExportInactivityTimeout(30_000);
engine.unstable_setVideoExportInactivityTimeout(60_000);
console.log('Export timeouts configured (30s image, 60s video)');
```

The default timeout is 10 seconds. Increase this value for:

- High-resolution exports (4K+)
- Complex scenes with many elements
- Video exports with multiple tracks
- Servers with limited CPU resources

### Export Size Limits

Check export capabilities before processing large designs using `engine.editor.getMaxExportSize()`.

```ts
const maxExportSize = engine.editor.getMaxExportSize();
console.log('Max export size:', maxExportSize, 'pixels');

// Validate design dimensions before export
const pageWidth = engine.block.getWidth(page);
const pageHeight = engine.block.getHeight(page);

if (pageWidth > maxExportSize || pageHeight > maxExportSize) {
  throw new Error('Design exceeds maximum export size');
}
```

Validate design dimensions against this limit before starting export to fail fast on oversized designs.

## Engine Lifecycle

Follow proper patterns for initializing and disposing the engine to prevent memory leaks and ensure consistent behavior across requests.

### Initialization

Initialize the engine with minimal configuration for server environments. The engine doesn't need UI-related settings.

```ts
import CreativeEngine from '@cesdk/node';

const config = {
  license: process.env.CESDK_LICENSE || '',
  logger: (level: string, ...args: unknown[]) => {
    if (level === 'error' || level === 'warn') {
      console.log(`[${level}]`, ...args);
    }
  }
};

const engine = await CreativeEngine.init(config);
```

Consider logging levels carefully in production to avoid excessive log output.

### Engine Reuse Patterns

For server environments, choose between per-request engines or a shared engine based on your workload:

**Per-Request Pattern** (recommended for serverless):

```ts
async function handleRequest(designData: Buffer): Promise<Buffer> {
  const CreativeEngine = await loadCreativeEngine();
  const engine = await CreativeEngine.init(config);

  try {
    const result = await processDesign(engine, designData);
    return result;
  } finally {
    engine.dispose();
  }
}
```

**Shared Engine Pattern** (for long-running servers):

```ts
let engine: CreativeEngine | null = null;

async function getEngine(): Promise<CreativeEngine> {
  if (!engine) {
    const CreativeEngine = await loadCreativeEngine();
    engine = await CreativeEngine.init(config);
  }
  return engine;
}

async function handleRequest(designData: Buffer): Promise<Buffer> {
  const eng = await getEngine();

  // Clear previous state
  const scenes = eng.scene.findAll();
  scenes.forEach((scene) => eng.block.destroy(scene));

  return processDesign(eng, designData);
}
```

### Disposal

Always dispose the engine when processing completes to free native resources. In serverless environments, dispose before the function returns:

```ts
async function processDesign(engine: CreativeEngine): Promise<void> {
  try {
    // Process the design
    await doWork(engine);
  } finally {
    // Always dispose to free resources
    engine.dispose();
    console.log('Engine disposed');
  }
}
```

For shared engines in long-running processes, dispose on process shutdown:

```ts
process.on('SIGTERM', async () => {
  if (engine) {
    engine.dispose();
  }
  process.exit(0);
});
```

## Serverless Considerations

> **Note:** This section applies to the WASM-based `@cesdk/node` package. The native
> `@cesdk/node-native` package does not support AWS Lambda or other serverless
> runtimes with an older glibc (it needs glibc 2.39 or later) — run it on a
> regular server or container instead. Its main performance knob is the
> `device` (`'auto' | 'gpu' | 'cpu'`) configuration option.

Serverless environments have specific constraints that affect CE.SDK performance:

### Cold Start Optimization

- Use code splitting to defer engine loading
- Pre-warm functions that process designs frequently
- Consider provisioned concurrency for latency-sensitive workloads

### Memory Limits

- Monitor memory usage against function limits
- Configure function memory to accommodate engine requirements (minimum 512MB recommended)
- Dispose engine promptly to avoid memory accumulation

### Execution Time

- Set appropriate function timeouts for export operations
- Configure export inactivity timeouts below function timeout
- Stream large exports instead of buffering in memory

## Troubleshooting

### High Memory Usage

Monitor memory with `getUsedMemory()` and `getAvailableMemory()`. If memory accumulates across requests:

- Ensure `dispose()` is called after each request in per-request patterns
- Clear scenes between requests in shared engine patterns
- Consider periodic engine recreation in long-running processes

### Slow Cold Starts

Implement code splitting to defer engine loading. For latency-sensitive workloads:

- Use provisioned concurrency in serverless environments
- Implement keep-alive requests to prevent function cold starts
- Pre-load the engine during process initialization

### Export Timeouts

Increase timeout using `unstable_setExportInactivityTimeout()` for images or `unstable_setVideoExportInactivityTimeout()` for videos. For persistent issues:

- Reduce export resolution
- Simplify scene complexity
- Increase server CPU resources

### Memory Leaks

If memory grows unbounded:

- Verify `dispose()` is called in all code paths, including error handlers
- Check for stored references to engine blocks
- Implement periodic engine recreation as a safety measure

## API Reference

| Method                                              | Description                            |
| --------------------------------------------------- | -------------------------------------- |
| `CreativeEngine.init()`                             | Initialize a new engine instance       |
| `engine.dispose()`                                  | Clean up engine resources              |
| `engine.editor.getUsedMemory()`                     | Get current memory usage in bytes      |
| `engine.editor.getAvailableMemory()`                | Get available memory in bytes          |
| `engine.editor.getMaxExportSize()`                  | Get maximum export dimension in pixels |
| `engine.unstable_setExportInactivityTimeout()`      | Configure image export timeout         |
| `engine.unstable_setVideoExportInactivityTimeout()` | Configure video export timeout         |

## Next Steps

- [Architecture](./concepts/architecture.md) - Understand CE.SDK structure and components
- [Headless Mode](./concepts/headless-mode.md) - Run the engine without UI for automation
- [Export Overview](./export-save-publish/export/overview.md) - Learn about export formats and options



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support