---
title: "Improve Performance"
description: "Optimize CE.SDK server integration with code splitting, memory monitoring, export timeouts, and lifecycle best practices for Node.js."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/performance-3c12eb/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Improve Performance](https://img.ly/docs/cesdk/archive/v1.84/node/performance-3c12eb/)

---

Optimize CE.SDK integration for faster startup, efficient memory usage, and
reliable performance in Node.js server environments.

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.84.0.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.84.0/guides-performance-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v1.84.0/guides-performance-server-js)

The `@cesdk/node` (WASM) and `@cesdk/node-native` (native) packages provide full CreativeEngine functionality for server-side processing. Optimizing how you load, use, and dispose of the engine improves throughput and resource efficiency in production environments.

```typescript file=@cesdk_web_examples/guides-performance-server-js/server-js.ts reference-only
/**
 * CE.SDK Server Guide: Improve Performance
 *
 * Demonstrates caching and limiting concurrent connections for the
 * engine's network requests:
 * - Installing an undici dispatcher with a per-origin connection limit
 * - Caching downloaded assets on disk with a SQLite cache store
 * - Counting the requests that reach the network with diagnostics_channel
 */
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import diagnostics_channel from 'node:diagnostics_channel';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Agent, cacheStores, interceptors, setGlobalDispatcher } from 'undici';

const ASSET_ORIGIN = 'https://img.ly';

setGlobalDispatcher(
  new Agent({ connections: 2, allowH2: false }).compose(
    interceptors.cache({
      store: new cacheStores.SqliteCacheStore({
        location: join(tmpdir(), 'cesdk-fetch-cache.db')
      }),
      cacheByDefault: 24 * 60 * 60 * 1000,
      origins: [ASSET_ORIGIN]
    })
  )
);

config();

const IMAGE_URLS = [1, 2, 3, 4, 5, 6].map(
  (index) => `${ASSET_ORIGIN}/static/ubq_samples/sample_${index}.jpg`
);

const stats = { sent: 0, active: 0, maxActive: 0 };
const onTheWire = new WeakSet<object>();

diagnostics_channel.subscribe('undici:client:sendHeaders', (message) => {
  const { request } = message as { request: { origin: string } };
  if (request.origin !== ASSET_ORIGIN) return;
  onTheWire.add(request);
  stats.sent += 1;
  stats.active += 1;
  stats.maxActive = Math.max(stats.maxActive, stats.active);
});

const onFinished = (message: unknown) => {
  const { request } = message as { request: object };
  if (!onTheWire.delete(request)) return;
  stats.active -= 1;
};
diagnostics_channel.subscribe('undici:request:trailers', onFinished);
diagnostics_channel.subscribe('undici:request:error', onFinished);

async function renderDesign(label: string): Promise<void> {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    const sentBefore = stats.sent;
    stats.maxActive = 0;

    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 900);
    engine.block.setHeight(page, 600);

    IMAGE_URLS.forEach((url, index) => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      const fill = engine.block.createFill('image');
      engine.block.setString(fill, 'fill/image/imageFileURI', url);
      engine.block.setFill(block, fill);
      engine.block.setPositionX(block, (index % 3) * 300);
      engine.block.setPositionY(block, Math.floor(index / 3) * 300);
      engine.block.setWidth(block, 300);
      engine.block.setHeight(block, 300);
      engine.block.appendChild(page, block);
    });

    await engine.block.export(page);

    console.log(
      `${label}: ${stats.sent - sentBefore} requests sent for ` +
        `${IMAGE_URLS.length} images, at most ${stats.maxActive} at a time`
    );
  } finally {
    engine.dispose();
  }
}

await renderDesign('First render');
await renderDesign('Second render');
```

This guide covers code splitting for serverless environments, caching and limiting the engine's network requests, memory monitoring for long-running processes, export timeout configuration, and proper lifecycle management patterns. The example project demonstrates the caching section.

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

## Caching and Limiting Concurrent Connections

`@cesdk/node` downloads scenes, images, and fonts with the `fetch` function built into Node.js. It also downloads its engine files that way when `baseURL` points to a URL. Every new engine instance downloads its assets again, and a scene with many images starts its downloads at the same time. A storage backend with a rate limit can reject these bursts.

Node.js sends every `fetch` request through a global dispatcher. With the [`undici`](https://github.com/nodejs/undici) package, you can replace it with one that caches responses and limits the connections per origin. The engine picks up the new dispatcher without any change to your engine code.

> **Note:** The dispatcher handles every `fetch` call in the process, not only the
> engine's. The native `@cesdk/node-native` package downloads most assets with
> its own network stack, so the dispatcher doesn't apply to them.

### Install `undici`

Node.js uses `undici` internally but doesn't expose it as a module, so install the package from npm:

```bash
npm install undici@8
```

Use `undici` 8, which requires Node.js 22.19 or later. On older Node.js versions, use `undici` 7.27 or later. On Node.js 26, the built-in `fetch` ignores a dispatcher set with `undici` 7.26 or earlier, without an error.

### Configure the Dispatcher

Call `setGlobalDispatcher()` once when your server starts, before the engine downloads anything. The dispatcher below allows two connections per origin and keeps the responses of the asset origin in a SQLite file:

```typescript highlight=highlight-dispatcher
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Agent, cacheStores, interceptors, setGlobalDispatcher } from 'undici';

const ASSET_ORIGIN = 'https://img.ly';

setGlobalDispatcher(
  new Agent({ connections: 2, allowH2: false }).compose(
    interceptors.cache({
      store: new cacheStores.SqliteCacheStore({
        location: join(tmpdir(), 'cesdk-fetch-cache.db')
      }),
      cacheByDefault: 24 * 60 * 60 * 1000,
      origins: [ASSET_ORIGIN]
    })
  )
);
```

- `connections` is the highest number of open connections per origin. Further requests wait in a queue until a connection is free.
- `allowH2: false` keeps every connection on HTTP/1.1. Over HTTP/2, one connection carries many requests at the same time, so `connections` no longer limits them. The built-in `fetch` of Node.js 26 uses HTTP/2 when the server supports it.
- `cacheByDefault` is how long, in milliseconds, to keep a response whose headers set no lifetime: no `max-age`, `s-maxage`, `Expires`, or `Last-Modified`. A response with `max-age`, `s-maxage`, or `Expires` follows it instead. A response with only `Last-Modified` is kept for a tenth of the time since that date. `cacheByDefault` also applies to `404` responses, so an asset that was missing on the first request stays missing until the entry expires or you delete the cache.
- `origins` limits the cache to the hosts that serve your assets. Without it, `cacheByDefault` also applies to your server's other `fetch` calls, so an API response without cache headers is reused for 24 hours.
- `SqliteCacheStore` writes the cache to disk, so a restarted process reuses it. In production, set `location` to a persistent directory that only your server can access, and cap the number of entries with `maxCount`, which has no limit by default. It uses the built-in `node:sqlite` module, which requires Node.js 22.13 or later and which some Node.js versions mark as experimental with a warning.

### Other Setups

The connection limit and the cache work independently. To only limit connections, install a plain `Agent`:

```ts
setGlobalDispatcher(new Agent({ connections: 2, allowH2: false }));
```

To only cache, compose the cache interceptor onto an `Agent` without a limit:

```ts
setGlobalDispatcher(
  new Agent().compose(
    interceptors.cache({
      store: new cacheStores.SqliteCacheStore({
        location: join(tmpdir(), 'cesdk-fetch-cache.db')
      }),
      cacheByDefault: 24 * 60 * 60 * 1000,
      origins: [ASSET_ORIGIN]
    })
  )
);
```

If you don't need the cache to survive a restart, use `MemoryCacheStore`. The cache then lives only as long as the process. By default, it skips responses larger than 5 MB and holds at most 100 MB, which you can change with its `maxEntrySize` and `maxSize` options:

```ts
setGlobalDispatcher(
  new Agent({ connections: 2, allowH2: false }).compose(
    interceptors.cache({
      store: new cacheStores.MemoryCacheStore(),
      cacheByDefault: 24 * 60 * 60 * 1000,
      origins: [ASSET_ORIGIN]
    })
  )
);
```

### Verify the Behavior

`undici` reports each request on Node's `diagnostics_channel` module. The example counts the requests to the asset origin that go out over the network, and how many of them are open at the same time:

```typescript highlight=highlight-diagnostics
const stats = { sent: 0, active: 0, maxActive: 0 };
const onTheWire = new WeakSet<object>();

diagnostics_channel.subscribe('undici:client:sendHeaders', (message) => {
  const { request } = message as { request: { origin: string } };
  if (request.origin !== ASSET_ORIGIN) return;
  onTheWire.add(request);
  stats.sent += 1;
  stats.active += 1;
  stats.maxActive = Math.max(stats.maxActive, stats.active);
});

const onFinished = (message: unknown) => {
  const { request } = message as { request: object };
  if (!onTheWire.delete(request)) return;
  stats.active -= 1;
};
diagnostics_channel.subscribe('undici:request:trailers', onFinished);
diagnostics_channel.subscribe('undici:request:error', onFinished);
```

`undici:client:sendHeaders` fires when `undici` sends a request. A response served from the cache sends no request, so it doesn't appear in the count. `undici:request:trailers` and `undici:request:error` fire when a request ends.

The example then renders the same six-image design twice, each time with a new engine, and logs the counts:

```typescript highlight=highlight-render
async function renderDesign(label: string): Promise<void> {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    const sentBefore = stats.sent;
    stats.maxActive = 0;

    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 900);
    engine.block.setHeight(page, 600);

    IMAGE_URLS.forEach((url, index) => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      const fill = engine.block.createFill('image');
      engine.block.setString(fill, 'fill/image/imageFileURI', url);
      engine.block.setFill(block, fill);
      engine.block.setPositionX(block, (index % 3) * 300);
      engine.block.setPositionY(block, Math.floor(index / 3) * 300);
      engine.block.setWidth(block, 300);
      engine.block.setHeight(block, 300);
      engine.block.appendChild(page, block);
    });

    await engine.block.export(page);

    console.log(
      `${label}: ${stats.sent - sentBefore} requests sent for ` +
        `${IMAGE_URLS.length} images, at most ${stats.maxActive} at a time`
    );
  } finally {
    engine.dispose();
  }
}

await renderDesign('First render');
await renderDesign('Second render');
```

The first render sends six requests, at most two at a time. The second render sends none, because the cache answers every request. A new run of the example also sends none, because the cache file persists. This holds as long as the cached responses are fresh: the sample images allow up to one hour. After that, `undici` asks the server whether each image changed, and the count includes these requests even when the server answers that nothing changed.

### Why a Connection Limit of 1 Can Show Many Requests in Flight

If you log requests on `undici:request:create`, a dispatcher with `connections: 1` can still appear to have many requests in flight. Three things cause this:

- **The limit is per origin.** An origin is the combination of scheme, host, and port. Requests to different origins use separate connections, so with `connections: 1` and two origins, up to two requests run at the same time. `undici` has no limit across all origins.
- **`undici:request:create` fires when a request enters the queue.** `undici` sends the request later, when a connection is free. With `connections: 1`, it sends one request at a time over that connection, so the other requests only wait in the queue.
- **HTTP/2 runs many requests over one connection.** Without `allowH2: false`, a server that supports HTTP/2 receives all requests at the same time, even with `connections: 1`.

Count `undici:client:sendHeaders` instead, as the example does, to see how many requests `undici` actually sends.

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

### Assets Download Again Despite the Cache

If the request count from the verification example doesn't drop to zero on the second render, check the responses and the setup:

- The response has `Cache-Control: no-store`, `no-cache`, or `max-age=0`. `undici` requests these from the server every time.
- The response has `Cache-Control: private` or sets a cookie. The cache stores it only when you pass `type: 'private'` to `interceptors.cache()`.
- The cached response is older than the lifetime its headers allow. `undici` then checks with the server before it reuses the response.
- The response is a partial response (status 206). `undici` never caches these.
- The response is larger than the `maxEntrySize` of `MemoryCacheStore`, 5 MB by default.
- The cache uses `MemoryCacheStore` and the process restarted.
- The asset host is missing from the `origins` option.
- The dispatcher comes from `undici` 7.26 or earlier and the server runs Node.js 26.

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

- [Architecture](https://img.ly/docs/cesdk/archive/v1.84/node/concepts/architecture-6ea9b2/) - Understand CE.SDK structure and components
- [Headless Mode](https://img.ly/docs/cesdk/archive/v1.84/node/concepts/headless-mode-24ab98/) - Run the engine without UI for automation
- [Export Overview](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export/overview-9ed3a8/) - Learn about export formats and options



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
