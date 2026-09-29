> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [URI Resolver](./open-the-editor/uri-resolver.md)

---

Learn how to intercept and transform asset URIs in headless Node.js environments for automation and batch processing.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-open-the-editor-uri-resolver-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-open-the-editor-uri-resolver-server-js)

When CE.SDK loads an asset in Node.js, it resolves the URI to an absolute path before fetching. You can intercept this process to add authentication tokens or transform URIs for your automation workflows.

```typescript file=@cesdk_web_examples/guides-open-the-editor-uri-resolver-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: URI Resolver
 *
 * Demonstrates URI resolution in headless mode:
 * - Understanding default URI resolution behavior
 * - Setting custom URI resolvers
 * - Adding JWT authentication tokens
 * - Removing custom resolvers
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Set page background to light gray
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    r: 0.96,
    g: 0.96,
    b: 0.96,
    a: 1.0
  });

  // ========================================
  // Section 1: Understanding Default URI Resolution
  // ========================================

  // Test resolution without loading assets
  const relativeURI = '/images/photo.jpg';
  const resolvedURI = await engine.editor.getAbsoluteURI(relativeURI);
  console.log('Default resolution:');
  console.log(`  Input:  ${relativeURI}`);
  console.log(`  Output: ${resolvedURI}`);

  // ========================================
  // Section 2: Setting a Custom URI Resolver
  // ========================================

  // Set a custom resolver that transforms specific file types
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // Transform JPG files to a watermarked version
    if (uri.endsWith('.jpg')) {
      console.log(`Custom resolver: Transforming ${uri}`);
      return 'https://img.ly/static/ubq_samples/sample_1.jpg';
    }
    // Use default resolver for all other URIs
    return defaultURIResolver(uri);
  });

  // ========================================
  // Section 2: Adding Authentication with JWT Tokens
  // ========================================

  // Pre-generate token BEFORE setting the resolver (must be synchronous)
  const authToken = 'demo-jwt-token-123';

  // Set resolver that adds authentication to specific endpoints
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // Only add auth token to URIs pointing to your stable link endpoint
    if (uri.includes('your-server/image-stable-links/')) {
      const authenticatedURI = `${uri}?auth=${authToken}`;
      console.log(`\nAuth resolver: Adding token to ${uri}`);
      console.log(`  Result: ${authenticatedURI}`);
      return authenticatedURI;
    }
    // Use default resolver for all other URIs
    return defaultURIResolver(uri);
  });

  // Test authentication with a protected URI
  const protectedURI = 'https://your-server/image-stable-links/abc123';
  await engine.editor.getAbsoluteURI(protectedURI);

  // ========================================
  // Section 3: Removing a Custom Resolver
  // ========================================

  // Pass null to remove the custom resolver and restore default behavior
  engine.editor.setURIResolver(null);
  console.log('\n✓ Removed custom resolver - back to default behavior');

  console.log('\n✓ URI Resolver guide completed successfully!');

  // Create output directory
  mkdirSync('output', { recursive: true });

  // Optional: Add some images to demonstrate the resolver works with actual assets
  // Set a simple resolver for the demo
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // For this demo, ensure all images resolve to valid URLs
    if (uri.includes('sample')) {
      return uri;
    }
    return defaultURIResolver(uri);
  });

  // Add images to show resolver works
  const imageSize = { width: 200, height: 150 };
  const image1 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: imageSize }
  );
  engine.block.setPositionX(image1, 100);
  engine.block.setPositionY(image1, 225);
  engine.block.appendChild(page, image1);

  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync('output/uri-resolver-result.png', buffer);
  console.log('\n📄 Exported result to: output/uri-resolver-result.png');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
```

## Default URI Resolution

By default, CE.SDK resolves URIs relative to the `basePath` setting. Absolute URIs (with http://, https://, data:) pass through unchanged, while relative paths get prepended with `basePath`.

Use `getAbsoluteURI()` to test how URIs resolve without loading assets:

```typescript highlight=highlight-test-resolution
// Test resolution without loading assets
const relativeURI = '/images/photo.jpg';
const resolvedURI = await engine.editor.getAbsoluteURI(relativeURI);
console.log('Default resolution:');
console.log(`  Input:  ${relativeURI}`);
console.log(`  Output: ${resolvedURI}`);
```

## Custom URI Resolver

Set a custom resolver to intercept and transform URIs. The resolver receives the URI and a `defaultURIResolver` function for fallback behavior:

```typescript highlight=highlight-set-resolver
// Set a custom resolver that transforms specific file types
engine.editor.setURIResolver((uri, defaultURIResolver) => {
  // Transform JPG files to a watermarked version
  if (uri.endsWith('.jpg')) {
    console.log(`Custom resolver: Transforming ${uri}`);
    return 'https://img.ly/static/ubq_samples/sample_1.jpg';
  }
  // Use default resolver for all other URIs
  return defaultURIResolver(uri);
});
```

**Important:** `setURIResolver` must be synchronous. Use `setURIResolverAsync` for async resolution and token fetching.

## Adding Authentication

A common use case is adding authentication tokens to asset URIs. Generate the token before setting the resolver, then append it as a query parameter:

```typescript highlight=highlight-auth-resolver
  // Pre-generate token BEFORE setting the resolver (must be synchronous)
  const authToken = 'demo-jwt-token-123';

  // Set resolver that adds authentication to specific endpoints
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // Only add auth token to URIs pointing to your stable link endpoint
    if (uri.includes('your-server/image-stable-links/')) {
      const authenticatedURI = `${uri}?auth=${authToken}`;
      console.log(`\nAuth resolver: Adding token to ${uri}`);
      console.log(`  Result: ${authenticatedURI}`);
      return authenticatedURI;
    }
    // Use default resolver for all other URIs
    return defaultURIResolver(uri);
  });

  // Test authentication with a protected URI
  const protectedURI = 'https://your-server/image-stable-links/abc123';
  await engine.editor.getAbsoluteURI(protectedURI);
```

Your server validates the token and redirects to the actual asset (e.g., pre-signed S3 URL). CE.SDK follows redirects automatically.

## Removing a Resolver

Pass `null` (or `undefined`) to remove the custom resolver and restore default behavior. `setURIResolver` and `setURIResolverAsync` share one resolver slot, so either call clears whichever one is active:

```typescript highlight=highlight-remove-resolver
// Pass null to remove the custom resolver and restore default behavior
engine.editor.setURIResolver(null);
console.log('\n✓ Removed custom resolver - back to default behavior');
```

## Key Constraints

- **Sync vs async**: `setURIResolver` must be synchronous; use `setURIResolverAsync` for async resolution.
- **Must return absolute URIs**: Include scheme (http://, https://, data:)
- **One resolver at a time**: New calls overwrite previous resolvers
- **Delegate unmatched URIs**: Pass to `defaultURIResolver()` for unchanged paths

## Next Steps

- [Configuration](./configuration.md) — CE.SDK initialization and baseURL settings
- [Load Assets from Remote](./import-media/from-remote-source.md) — Load assets from remote URLs and servers



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support