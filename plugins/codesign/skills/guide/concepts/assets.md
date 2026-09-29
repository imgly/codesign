> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Assets](./concepts/assets.md)

---

Understand the asset system—how external media and resources like images, stickers, or videos are handled in CE.SDK.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-assets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-assets-server-js)

Images, videos, audio, fonts, stickers, and templates—every premade resource you can add to a design is what we call an *Asset*. The editor gets access to these Assets through *Asset Sources*. When you apply an Asset, CE.SDK creates or modifies a Block to display that content.

```typescript file=@cesdk_web_examples/guides-concepts-assets-server-js/server-js.ts reference-only
import CreativeEngine, {
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Assets Concepts Guide
 *
 * Demonstrates the core concepts of the asset system:
 * - What assets are and how they differ from blocks
 * - Creating and registering asset sources
 * - Querying and applying assets
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // An asset is a content definition with metadata
    // It describes content that can be added to designs
    const stickerAsset: AssetResult = {
      id: 'sticker-smile',
      label: 'Smile Sticker',
      tags: ['emoji', 'happy'],
      groups: ['stickers'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        width: 62,
        height: 58,
        mimeType: 'image/svg+xml'
      }
    };

    // Asset sources provide assets to the editor
    // Each source has an id and a findAssets() method
    const customSource: AssetSource = {
      id: 'my-assets',

      async findAssets(query: AssetQueryData): Promise<AssetsQueryResult> {
        // Return paginated results matching the query
        return {
          assets: [stickerAsset],
          total: 1,
          currentPage: query.page,
          nextPage: undefined,
          // Return distributions for the requested facet paths
          facets: query.facets?.length
            ? {
                tags: [
                  { value: 'emoji', count: 1 },
                  { value: 'happy', count: 1 }
                ]
              }
            : undefined
        };
      }
    };

    engine.asset.addSource(customSource);

    // Query assets from a source
    const results = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 10
    });
    console.log('Found assets:', results.total);

    // Narrow a query with structured predicates. The top-level array is
    // an implicit AND of its entries.
    const happyStickers = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 10,
      filter: [
        // Either tag matches (combinators nest arbitrarily).
        {
          or: [
            { property: 'tags', equals: 'happy' },
            { property: 'tags', equals: 'celebratory' }
          ]
        },
        // Exclude archived items.
        { not: { property: 'meta.kind', equals: 'archived' } }
      ]
    });
    console.log('Filtered stickers:', happyStickers.total);

    // Request value distributions ("facets") alongside a page of assets—
    // exactly what a filter dropdown needs.
    const faceted = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 24,
      facets: ['tags']
    });
    console.log('Tag distribution:', faceted.facets?.tags);

    // Enumerate values without fetching assets (perPage: 0).
    const { facets } = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 0,
      facets: ['tags']
    });
    console.log('Available tags:', facets?.tags);

    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      if (blockId) {
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        // SVG is 62x58, scale to fit nicely
        const stickerWidth = 62;
        const stickerHeight = 58;
        engine.block.setWidth(blockId, stickerWidth);
        engine.block.setHeight(blockId, stickerHeight);
        engine.block.setPositionX(blockId, (pageWidth - stickerWidth) / 2);
        engine.block.setPositionY(blockId, (pageHeight - stickerHeight) / 2);
      }
    }

    // Local sources support dynamic add/remove operations
    engine.asset.addLocalSource('uploads', ['image/svg+xml', 'image/png']);

    engine.asset.addAssetToSource('uploads', {
      id: 'uploaded-1',
      label: { en: 'Heart Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });

    // Subscribe to asset source lifecycle events
    const unsubscribe = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log('Source updated:', sourceId);
    });

    // Notify that source contents changed
    engine.asset.assetSourceContentsChanged('uploads');

    unsubscribe();

    console.log('Assets guide completed successfully.');
    console.log('Created custom asset source and applied sticker asset.');
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers the core concepts of the Asset system: what assets are, how to create asset sources, and how to query and apply assets programmatically.

## Assets vs Blocks

**Assets** are content definitions with metadata (URIs, dimensions, labels) that exist outside the scene. **Blocks** are the visual elements in the scene tree that display content.

When you apply an asset, CE.SDK creates a block configured according to the asset's properties. Multiple blocks can reference the same asset, and assets can exist without being used in any block.

## The Asset Data Model

An asset describes content that can be added to designs. Each asset has an `id` and optional properties:

```typescript highlight-asset-definition
// An asset is a content definition with metadata
// It describes content that can be added to designs
const stickerAsset: AssetResult = {
  id: 'sticker-smile',
  label: 'Smile Sticker',
  tags: ['emoji', 'happy'],
  groups: ['stickers'],
  meta: {
    uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
    thumbUri:
      'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
    blockType: '//ly.img.ubq/graphic',
    fillType: '//ly.img.ubq/fill/image',
    width: 62,
    height: 58,
    mimeType: 'image/svg+xml'
  }
};
```

Key properties include:

- **`id`** — Unique identifier for the asset
- **`label`** — Display name (can be localized)
- **`tags`** — Searchable keywords
- **`groups`** — Categories for filtering
- **`meta`** — Content-specific data including `uri`, `thumbUri`, `blockType`, `fillType`, `width`, `height`, and `mimeType`

> **Note:** See the [Content JSON Schema](./import-media/content-json-schema.md) guide for the complete property reference.

## Asset Sources

Asset sources provide assets to the editor. Each source has an `id` and implements a `findAssets()` method that returns paginated results.

```typescript highlight-asset-source
    // Asset sources provide assets to the editor
    // Each source has an id and a findAssets() method
    const customSource: AssetSource = {
      id: 'my-assets',

      async findAssets(query: AssetQueryData): Promise<AssetsQueryResult> {
        // Return paginated results matching the query
        return {
          assets: [stickerAsset],
          total: 1,
          currentPage: query.page,
          nextPage: undefined,
          // Return distributions for the requested facet paths
          facets: query.facets?.length
            ? {
                tags: [
                  { value: 'emoji', count: 1 },
                  { value: 'happy', count: 1 }
                ]
              }
            : undefined
        };
      }
    };

    engine.asset.addSource(customSource);
```

The `findAssets()` callback receives query parameters (`page`, `perPage`, `query`, `tags`, `groups`, `filter`, `facets`) and returns a result object with `assets`, `total`, `currentPage`, and `nextPage`, plus a `facets` object when the query requests distributions.

Sources can also implement optional methods like `getGroups()`, `getSupportedMimeTypes()`, and `applyAsset()` for custom behavior.

## Querying Assets

Search and filter assets from registered sources using `findAssets()`:

```typescript highlight-query-assets
// Query assets from a source
const results = await engine.asset.findAssets('my-assets', {
  page: 0,
  perPage: 10
});
console.log('Found assets:', results.total);
```

Results include pagination info. Loop through pages until `nextPage` is undefined to retrieve all matching assets.

### Filtering by property

The optional `filter` parameter narrows a query with structured predicates against the resolved asset. All entries in the top-level array must match (implicit AND). Each entry is either a property predicate (`{ property, contains?, equals? }`) or a logical combinator (`{ and: [...] }`, `{ or: [...] }`, `{ not: ... }`). Combinators nest.

```typescript highlight-filter-assets
// Narrow a query with structured predicates. The top-level array is
// an implicit AND of its entries.
const happyStickers = await engine.asset.findAssets('my-assets', {
  page: 0,
  perPage: 10,
  filter: [
    // Either tag matches (combinators nest arbitrarily).
    {
      or: [
        { property: 'tags', equals: 'happy' },
        { property: 'tags', equals: 'celebratory' }
      ]
    },
    // Exclude archived items.
    { not: { property: 'meta.kind', equals: 'archived' } }
  ]
});
console.log('Filtered stickers:', happyStickers.total);
```

The `property` field is a dot-path against the resolved asset: `label`, `tags`, `id`, `groups`, or `meta.<key>`. Use `equals` for categorical or single-value fields and `contains` for free-text or list-encoded values. Both operators are case-insensitive. On a string array (`tags`, `groups`), the predicate matches if any element matches.

> **\`not\` against a missing key:** A predicate evaluates to `false` on an asset that lacks the targeted field, so `not { property: 'meta.legacy', equals: 'true' }` matches every asset where `meta.legacy !== 'true'` **and** every asset that lacks `meta.legacy` entirely. If you need "field is present and not equal to x," combine with a presence check: `and: [{ property: 'meta.legacy', contains: '' }, { not: { ... } }]`.

> **\`meta\` values are flat strings:** The engine stores every `meta.<key>` value as a flat string. `equals: 'true'` matches the literal string `"true"`; if a meta value was originally serialized as a number or boolean, stringify it the same way before comparing. For multi-valued data, prefer separate `tags` / `groups` elements over comma-separated `meta` values so `equals` can be element-exact.

`filter` and the legacy `tags` / `groups` / `excludeGroups` fields can be combined — they are AND-combined before pagination. Prefer `filter` for anything beyond a plain case-sensitive include/exclude list (substring matches, `meta.<key>`, `or` / `not` combinators); reach for the legacy fields only when you want their case-sensitive exact-match semantics.

Malformed filters reject the returned promise with the engine's parse-error message (for example, `"Unknown asset property '…'"` or `"Asset property filter must have exactly one of 'contains' or 'equals'."`).

### Enumerating values with facets

The optional `facets` parameter requests value distributions for facetable property paths—`tags`, `groups`, or `meta.<key>`—alongside the assets. Each distribution lists which values exist on the matched set (every asset matching the query, before pagination) and how many matched assets carry each value, which is exactly what a filter dropdown needs.

```typescript highlight-facets
    // Request value distributions ("facets") alongside a page of assets—
    // exactly what a filter dropdown needs.
    const faceted = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 24,
      facets: ['tags']
    });
    console.log('Tag distribution:', faceted.facets?.tags);

    // Enumerate values without fetching assets (perPage: 0).
    const { facets } = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 0,
      facets: ['tags']
    });
    console.log('Available tags:', facets?.tags);
```

The result's `facets` object is keyed by the exact requested path strings. Each distribution is ordered by `count` descending (ties by `value` ascending). A missing key means the source did not compute that facet; a key holding an empty array means the facet was computed and no values exist. With `perPage: 0`, `nextPage` is still set whenever `total > 0`—facet-only callers ignore it.

Bucket values are raw: returned exactly as stored on the asset, with case-sensitive distinctness (`tags` resolve to the query's `locale` first). Since filter predicates are case-insensitive, any returned value round-trips into an `equals` predicate that matches at least the assets counted for that bucket. On a multi-valued property, each array element counts toward its own bucket, so counts can sum to more than `total`.

`label` and `id` are not facetable—their value sets are unbounded—so requesting them rejects the promise with `"Asset property '…' is not facetable. Use 'tags', 'groups', or 'meta.<key>'."`.

> **Facets from custom sources:** A custom source's `findAssets` callback receives the requested `facets` as path strings on its query data and may return distributions for any subset of them on its result—a missing key signals that facet was not computed, and `count` may be omitted where counting is expensive. The request maps directly onto a backend's native faceting—a faceted-search index, an aggregation query, or a SQL `GROUP BY`. A source may compute distributions over its full catalog instead of the matched set; consumers should tolerate this.

## Applying Assets

Use `apply()` to create a new block from an asset:

```typescript highlight-apply-asset
    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      if (blockId) {
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        // SVG is 62x58, scale to fit nicely
        const stickerWidth = 62;
        const stickerHeight = 58;
        engine.block.setWidth(blockId, stickerWidth);
        engine.block.setHeight(blockId, stickerHeight);
        engine.block.setPositionX(blockId, (pageWidth - stickerWidth) / 2);
        engine.block.setPositionY(blockId, (pageHeight - stickerHeight) / 2);
      }
    }
```

The method returns the new block ID, which you can use to position and configure the block.

## Local Asset Sources

Local sources store assets in memory and support dynamic add/remove operations. Use these for user uploads or runtime-generated content:

```typescript highlight-local-source
    // Local sources support dynamic add/remove operations
    engine.asset.addLocalSource('uploads', ['image/svg+xml', 'image/png']);

    engine.asset.addAssetToSource('uploads', {
      id: 'uploaded-1',
      label: { en: 'Heart Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
```

## Source Events

Subscribe to asset source lifecycle events for reactive UIs:

```typescript highlight-source-events
    // Subscribe to asset source lifecycle events
    const unsubscribe = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log('Source updated:', sourceId);
    });

    // Notify that source contents changed
    engine.asset.assetSourceContentsChanged('uploads');

    unsubscribe();
```

Call `assetSourceContentsChanged()` after modifying a source to notify subscribers.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support