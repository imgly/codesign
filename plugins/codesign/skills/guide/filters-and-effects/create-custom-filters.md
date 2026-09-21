> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Create Custom Filters](./filters-and-effects/create-custom-filters.md)

---

Extend CE.SDK with your own LUT filters by creating and registering custom filter asset sources for server-side image processing pipelines.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-filters-and-effects-add-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-filters-and-effects-add-server-js)

CE.SDK provides built-in LUT filters, but many applications need brand-specific color grading or custom filter collections. Custom filter asset sources let you register your own LUT filters for automated batch processing and server-side image workflows. Once registered, custom filters can be queried and applied programmatically.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-add-server-js/server-js.ts reference-only
import CreativeEngine, {
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Custom Filters
 *
 * Demonstrates creating and registering custom LUT filter asset sources:
 * - Creating a filter source with addSource()
 * - Defining filter assets with LUT metadata
 * - Loading filters from JSON configuration
 * - Querying custom filters
 * - Applying filters from custom sources
 * - Exporting the result
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

  // Define custom LUT filter assets with metadata
  const customFilters: AssetResult[] = [
    {
      id: 'vintage-warm',
      label: 'Vintage Warm',
      tags: ['vintage', 'warm', 'retro'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    },
    {
      id: 'cool-cinema',
      label: 'Cool Cinema',
      tags: ['cinema', 'cool', 'film'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    },
    {
      id: 'bw-classic',
      label: 'B&W Classic',
      tags: ['black and white', 'classic', 'monochrome'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    }
  ];

  // Create a custom filter asset source
  const customFilterSource: AssetSource = {
    id: 'my-custom-filters',

    async findAssets(
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult | undefined> {
      // Filter by query if provided
      let filteredAssets = customFilters;
      if (queryData.query) {
        const searchTerm = queryData.query.toLowerCase();
        filteredAssets = customFilters.filter(
          (asset) =>
            asset.label?.toLowerCase().includes(searchTerm) ||
            asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by groups if provided
      if (queryData.groups && queryData.groups.length > 0) {
        filteredAssets = filteredAssets.filter((asset) =>
          asset.tags?.some((tag) => queryData.groups?.includes(tag))
        );
      }

      // Handle pagination
      const currentPage = queryData.page ?? 0;
      const perPage = queryData.perPage ?? 10;
      const startIndex = currentPage * perPage;
      const paginatedAssets = filteredAssets.slice(
        startIndex,
        startIndex + perPage
      );

      return {
        assets: paginatedAssets,
        total: filteredAssets.length,
        currentPage,
        nextPage:
          startIndex + perPage < filteredAssets.length
            ? currentPage + 1
            : undefined
      };
    },

    // Return available filter categories
    async getGroups(): Promise<string[]> {
      return ['vintage', 'cinema', 'black and white'];
    }
  };

  // Register the custom filter source
  engine.asset.addSource(customFilterSource);
  console.log('Registered custom filter source: my-custom-filters');

  // Load filters from a JSON configuration string
  const filterConfigJSON = JSON.stringify({
    version: '2.0.0',
    id: 'my-json-filters',
    assets: [
      {
        id: 'sunset-glow',
        label: { en: 'Sunset Glow' },
        tags: { en: ['warm', 'sunset', 'golden'] },
        groups: ['Warm Tones'],
        meta: {
          uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
          horizontalTileCount: '5',
          verticalTileCount: '5',
          blockType: '//ly.img.ubq/effect/lut_filter'
        }
      },
      {
        id: 'ocean-breeze',
        label: { en: 'Ocean Breeze' },
        tags: { en: ['cool', 'blue', 'ocean'] },
        groups: ['Cool Tones'],
        meta: {
          uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
          horizontalTileCount: '5',
          verticalTileCount: '5',
          blockType: '//ly.img.ubq/effect/lut_filter'
        }
      }
    ]
  });

  // Create asset source from JSON string
  const jsonSourceId =
    await engine.asset.addLocalAssetSourceFromJSONString(filterConfigJSON);
  console.log('Created JSON-based filter source:', jsonSourceId);

  // Query filters from the custom source
  const customFilterResults = await engine.asset.findAssets(
    'my-custom-filters',
    {
      page: 0,
      perPage: 10
    }
  );
  console.log('Found', customFilterResults.total, 'filters in custom source');

  // Query filters from the JSON source
  const jsonFilterResults = await engine.asset.findAssets('my-json-filters', {
    page: 0,
    perPage: 10
  });
  console.log('Found', jsonFilterResults.total, 'filters in JSON source');

  // List all registered asset sources
  const allSources = engine.asset.findAllSources();
  console.log('Registered sources:', allSources);

  // Create an image block
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const imageBlock = await engine.block.addImage(imageUri, {
    x: 50,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock);

  // Get the first filter from our custom source
  const filterAsset = customFilterResults.assets[0];
  if (filterAsset && filterAsset.meta) {
    // Create and configure the LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Set LUT file URI from asset metadata
    engine.block.setString(
      lutEffect,
      'effect/lut_filter/lutFileURI',
      filterAsset.meta.uri as string
    );

    // Configure LUT grid dimensions
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/horizontalTileCount',
      parseInt(filterAsset.meta.horizontalTileCount as string, 10)
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/verticalTileCount',
      parseInt(filterAsset.meta.verticalTileCount as string, 10)
    );

    // Set filter intensity (0.0 to 1.0)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);
    console.log('Applied filter:', filterAsset.label);
  }

  // Create a second image block with a filter from JSON source
  const imageBlock2 = await engine.block.addImage(imageUri, {
    x: 450,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock2);

  // Get a filter from the JSON source
  const jsonFilterAsset = jsonFilterResults.assets[0];
  if (jsonFilterAsset && jsonFilterAsset.meta) {
    const lutEffect2 = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    engine.block.setString(
      lutEffect2,
      'effect/lut_filter/lutFileURI',
      jsonFilterAsset.meta.uri as string
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/horizontalTileCount',
      parseInt(jsonFilterAsset.meta.horizontalTileCount as string, 10)
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/verticalTileCount',
      parseInt(jsonFilterAsset.meta.verticalTileCount as string, 10)
    );
    engine.block.setFloat(lutEffect2, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(imageBlock2, lutEffect2);
    console.log('Applied JSON filter:', jsonFilterAsset.label);
  }

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/custom-filters.png', buffer);
  console.log('Exported to output/custom-filters.png');
} finally {
  engine.dispose();
}
```

This guide covers how to create filter asset sources, define filter metadata, load filters from JSON configuration, query custom sources, and apply filters to images.

## Filter Asset Metadata

LUT filters need these properties in the `meta` object:

- **`uri`** - URL to the LUT image file (PNG format)
- **`thumbUri`** - URL to the thumbnail preview image
- **`horizontalTileCount`** - Number of horizontal tiles in the LUT grid (typically 5 or 8)
- **`verticalTileCount`** - Number of vertical tiles in the LUT grid (typically 5 or 8)
- **`blockType`** - Must be `//ly.img.ubq/effect/lut_filter` for LUT filters

## Adding a Custom Filter

We register a custom filter source using `engine.asset.addSource()` with a `findAssets` callback. This callback returns filter assets matching the query parameters including pagination, search terms, and category filters.

```typescript highlight-create-custom-source
  // Define custom LUT filter assets with metadata
  const customFilters: AssetResult[] = [
    {
      id: 'vintage-warm',
      label: 'Vintage Warm',
      tags: ['vintage', 'warm', 'retro'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    },
    {
      id: 'cool-cinema',
      label: 'Cool Cinema',
      tags: ['cinema', 'cool', 'film'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    },
    {
      id: 'bw-classic',
      label: 'B&W Classic',
      tags: ['black and white', 'classic', 'monochrome'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    }
  ];

  // Create a custom filter asset source
  const customFilterSource: AssetSource = {
    id: 'my-custom-filters',

    async findAssets(
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult | undefined> {
      // Filter by query if provided
      let filteredAssets = customFilters;
      if (queryData.query) {
        const searchTerm = queryData.query.toLowerCase();
        filteredAssets = customFilters.filter(
          (asset) =>
            asset.label?.toLowerCase().includes(searchTerm) ||
            asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by groups if provided
      if (queryData.groups && queryData.groups.length > 0) {
        filteredAssets = filteredAssets.filter((asset) =>
          asset.tags?.some((tag) => queryData.groups?.includes(tag))
        );
      }

      // Handle pagination
      const currentPage = queryData.page ?? 0;
      const perPage = queryData.perPage ?? 10;
      const startIndex = currentPage * perPage;
      const paginatedAssets = filteredAssets.slice(
        startIndex,
        startIndex + perPage
      );

      return {
        assets: paginatedAssets,
        total: filteredAssets.length,
        currentPage,
        nextPage:
          startIndex + perPage < filteredAssets.length
            ? currentPage + 1
            : undefined
      };
    },

    // Return available filter categories
    async getGroups(): Promise<string[]> {
      return ['vintage', 'cinema', 'black and white'];
    }
  };

  // Register the custom filter source
  engine.asset.addSource(customFilterSource);
  console.log('Registered custom filter source: my-custom-filters');
```

The `findAssets` callback receives query parameters including pagination (`page`, `perPage`), search terms (`query`), and category filters (`groups`). We filter and paginate the results accordingly.

### Filter Asset Structure

Each filter asset returned by `findAssets` needs:

- **`id`** - Unique identifier for the filter
- **`label`** - Display name for the filter
- **`tags`** - Keywords for search filtering
- **`meta`** - Object containing LUT configuration (uri, thumbUri, tile counts, blockType)

The optional `getGroups()` method returns available filter categories for organizing filters.

## Loading Filters from JSON Configuration

For larger filter collections, we load definitions from JSON using `engine.asset.addLocalAssetSourceFromJSONString()`. This approach simplifies management of filter libraries.

```typescript highlight-load-from-json-string
  // Load filters from a JSON configuration string
  const filterConfigJSON = JSON.stringify({
    version: '2.0.0',
    id: 'my-json-filters',
    assets: [
      {
        id: 'sunset-glow',
        label: { en: 'Sunset Glow' },
        tags: { en: ['warm', 'sunset', 'golden'] },
        groups: ['Warm Tones'],
        meta: {
          uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
          horizontalTileCount: '5',
          verticalTileCount: '5',
          blockType: '//ly.img.ubq/effect/lut_filter'
        }
      },
      {
        id: 'ocean-breeze',
        label: { en: 'Ocean Breeze' },
        tags: { en: ['cool', 'blue', 'ocean'] },
        groups: ['Cool Tones'],
        meta: {
          uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_bw_5_5_128.png',
          horizontalTileCount: '5',
          verticalTileCount: '5',
          blockType: '//ly.img.ubq/effect/lut_filter'
        }
      }
    ]
  });

  // Create asset source from JSON string
  const jsonSourceId =
    await engine.asset.addLocalAssetSourceFromJSONString(filterConfigJSON);
  console.log('Created JSON-based filter source:', jsonSourceId);
```

### JSON Structure for Filter Assets

The JSON format includes:

- **`version`** - Schema version (use "2.0.0")
- **`id`** - Unique source identifier
- **`assets`** - Array of filter definitions

Each asset in the array contains:

- **`id`** - Unique filter identifier
- **`label`** - Localized label object (e.g., `{ "en": "Filter Name" }`)
- **`tags`** - Localized tags for search
- **`groups`** - Category assignments for organization
- **`meta`** - LUT configuration properties

For filters hosted on a CDN, use `engine.asset.addLocalAssetSourceFromJSONURI()` instead, which resolves relative URLs against the JSON file's parent directory.

## Querying and Applying Filters

We query filters from registered sources using `engine.asset.findAssets()`, then create and configure LUT filter effects from the returned metadata.

```typescript highlight-query-custom-filters
  // Query filters from the custom source
  const customFilterResults = await engine.asset.findAssets(
    'my-custom-filters',
    {
      page: 0,
      perPage: 10
    }
  );
  console.log('Found', customFilterResults.total, 'filters in custom source');

  // Query filters from the JSON source
  const jsonFilterResults = await engine.asset.findAssets('my-json-filters', {
    page: 0,
    perPage: 10
  });
  console.log('Found', jsonFilterResults.total, 'filters in JSON source');

  // List all registered asset sources
  const allSources = engine.asset.findAllSources();
  console.log('Registered sources:', allSources);
```

We create a `lut_filter` effect using `engine.block.createEffect()` and configure it with metadata from the queried filter asset. The effect is then attached to an image block.

```typescript highlight-apply-custom-filter
  // Create an image block
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const imageBlock = await engine.block.addImage(imageUri, {
    x: 50,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock);

  // Get the first filter from our custom source
  const filterAsset = customFilterResults.assets[0];
  if (filterAsset && filterAsset.meta) {
    // Create and configure the LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Set LUT file URI from asset metadata
    engine.block.setString(
      lutEffect,
      'effect/lut_filter/lutFileURI',
      filterAsset.meta.uri as string
    );

    // Configure LUT grid dimensions
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/horizontalTileCount',
      parseInt(filterAsset.meta.horizontalTileCount as string, 10)
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/verticalTileCount',
      parseInt(filterAsset.meta.verticalTileCount as string, 10)
    );

    // Set filter intensity (0.0 to 1.0)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);
    console.log('Applied filter:', filterAsset.label);
  }
```

We can apply filters from any registered source, including JSON-based sources.

```typescript highlight-apply-json-filter
  // Create a second image block with a filter from JSON source
  const imageBlock2 = await engine.block.addImage(imageUri, {
    x: 450,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock2);

  // Get a filter from the JSON source
  const jsonFilterAsset = jsonFilterResults.assets[0];
  if (jsonFilterAsset && jsonFilterAsset.meta) {
    const lutEffect2 = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    engine.block.setString(
      lutEffect2,
      'effect/lut_filter/lutFileURI',
      jsonFilterAsset.meta.uri as string
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/horizontalTileCount',
      parseInt(jsonFilterAsset.meta.horizontalTileCount as string, 10)
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/verticalTileCount',
      parseInt(jsonFilterAsset.meta.verticalTileCount as string, 10)
    );
    engine.block.setFloat(lutEffect2, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(imageBlock2, lutEffect2);
    console.log('Applied JSON filter:', jsonFilterAsset.label);
  }
```

After applying filters, we export the scene to PNG.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/custom-filters.png', buffer);
  console.log('Exported to output/custom-filters.png');
```

## Troubleshooting

### Filters Not Found in Query

- Verify the asset source is registered with `engine.asset.addSource()` or `addLocalAssetSourceFromJSONString()`
- Check that filter metadata includes all required fields (`uri`, `thumbUri`, tile counts)
- Ensure the `blockType` is set to `//ly.img.ubq/effect/lut_filter`
- Confirm the source ID matches when calling `findAssets()`

### LUT Not Rendering Correctly

- Verify tile count values match the actual LUT image grid dimensions
- Check that the LUT image URL is accessible from your server
- Confirm the LUT image uses PNG format

### JSON Source Not Loading

- Verify JSON structure matches the required format with `version`, `id`, and `assets`
- Ensure asset metadata includes required fields
- Check for JSON syntax errors

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addSource(source)` | Register a custom asset source with findAssets callback |
| `engine.asset.addLocalAssetSourceFromJSONString(json, basePath)` | Create asset source from inline JSON configuration |
| `engine.asset.addLocalAssetSourceFromJSONURI(uri)` | Load asset source from remote JSON file |
| `engine.asset.findAssets(sourceId, query)` | Query assets from a registered source |
| `engine.asset.findAllSources()` | Get all registered asset source IDs |
| `engine.asset.removeSource(id)` | Remove a registered asset source |
| `engine.block.createEffect(type)` | Create effect instance (use `//ly.img.ubq/effect/lut_filter` for LUT filters) |
| `engine.block.setString(effect, property, value)` | Set string property (LUT file URI) |
| `engine.block.setInt(effect, property, value)` | Set integer property (tile counts) |
| `engine.block.setFloat(effect, property, value)` | Set float property (intensity) |
| `engine.block.appendEffect(block, effect)` | Add effect to block's effect stack |

## Next Steps

Now that you understand how to create and register custom filter sources, explore related topics:

- [Apply Filters and Effects](./filters-and-effects/apply.md) - Learn to apply filters to design elements and manage effect stacks
- [Create a Custom LUT Filter](./filters-and-effects/create-custom-lut-filter.md) - Understand LUT image format and create your own color grading filters
- [Blur Effects](./filters-and-effects/blur.md) - Add blur effects to images and videos



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support