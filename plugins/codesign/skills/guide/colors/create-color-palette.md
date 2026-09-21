> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Create a Color Palette](./colors/create-color-palette.md)

---

Build custom color palettes programmatically using CE.SDK's asset system with
support for sRGB, CMYK, and Spot colors in server-side Node.js applications.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-colors-create-color-palette-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-colors-create-color-palette-server-js)

Color libraries in CE.SDK are implemented as local asset sources containing individual colors as assets. Each library has a unique source ID and can include sRGB colors for screen display, CMYK colors for print workflows, and Spot colors for specialized printing applications. You can create, populate, query, and manage these libraries programmatically using the engine's asset API.

```typescript file=@cesdk_web_examples/guides-colors-create-color-palette-server-js/server-js.ts reference-only
import CreativeEngine, {
  AssetDefinition,
  AssetRGBColor,
  AssetCMYKColor,
  AssetSpotColor
} from '@cesdk/node';
import * as fs from 'fs';

async function main() {
  let engine;
  try {
    engine = await CreativeEngine.init({
      baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
      // license: 'YOUR_CESDK_LICENSE_KEY'
    });
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Define color assets for each color space type
    const colors: AssetDefinition[] = [
      {
        id: 'brand-blue',
        label: { en: 'Brand Blue' },
        tags: { en: ['brand', 'blue', 'primary'] },
        payload: {
          color: {
            colorSpace: 'sRGB',
            r: 0.2,
            g: 0.4,
            b: 0.8
          } as AssetRGBColor
        }
      },
      {
        id: 'brand-coral',
        label: { en: 'Brand Coral' },
        tags: { en: ['brand', 'coral', 'secondary'] },
        payload: {
          color: {
            colorSpace: 'sRGB',
            r: 0.95,
            g: 0.45,
            b: 0.4
          } as AssetRGBColor
        }
      },
      {
        id: 'print-magenta',
        label: { en: 'Print Magenta' },
        tags: { en: ['print', 'magenta', 'cmyk'] },
        payload: {
          color: {
            colorSpace: 'CMYK',
            c: 0,
            m: 0.9,
            y: 0.2,
            k: 0
          } as AssetCMYKColor
        }
      },
      {
        id: 'metallic-gold',
        label: { en: 'Metallic Gold' },
        tags: { en: ['spot', 'metallic', 'gold'] },
        payload: {
          color: {
            colorSpace: 'SpotColor',
            name: 'Metallic Gold Ink',
            externalReference: 'Custom Inks',
            representation: {
              colorSpace: 'sRGB',
              r: 0.85,
              g: 0.65,
              b: 0.13
            }
          } as AssetSpotColor
        }
      }
    ];

    // Create a local asset source for the color library
    engine.asset.addLocalSource('my-brand-colors');

    // Add all color assets to the source
    for (const color of colors) {
      engine.asset.addAssetToSource('my-brand-colors', color);
    }

    // Query colors from the library
    const queryResult = await engine.asset.findAssets('my-brand-colors', {
      page: 0,
      perPage: 100
    });
    console.log('Colors in library:', queryResult.assets.length);
    for (const asset of queryResult.assets) {
      console.log(`  - ${asset.id}: ${asset.label ?? 'No label'}`);
    }

    // Remove a color from the library
    engine.asset.removeAssetFromSource('my-brand-colors', 'brand-coral');
    console.log('Removed brand-coral from library');

    // Verify removal
    const updatedResult = await engine.asset.findAssets('my-brand-colors', {
      page: 0,
      perPage: 100
    });
    console.log('Colors after removal:', updatedResult.assets.length);

    // Create a graphic block and apply a color from the palette
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 300);
    engine.block.setPositionY(block, 225);
    engine.block.appendChild(page, block);

    // Apply Brand Blue from our palette
    const fill = engine.block.getFill(block);
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Export the scene
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('output.png', buffer);
    console.log('Exported scene to output.png');
  } finally {
    if (engine) {
      engine.dispose();
    }
  }
}

main().catch(console.error);
```

This guide covers how to define colors in different color spaces, create and configure color libraries, query colors from libraries, and remove colors when needed.

## Initialize the Engine

We start by initializing the headless Creative Engine with a scene and page for demonstrating our color library workflow.

```typescript highlight=highlight-setup
engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: 'YOUR_CESDK_LICENSE_KEY'
});
// Create a scene with a page
const scene = engine.scene.create();
const page = engine.block.create('page');
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 600);
engine.block.appendChild(scene, page);
```

## Defining Color Assets

Colors are added to libraries as `AssetDefinition` objects. Each color asset has an `id`, optional `label` and `tags` for organization, and a `payload.color` property containing the color data. The color type determines which color space is used.

### sRGB Colors

sRGB colors use the `AssetRGBColor` type with `colorSpace: 'sRGB'` and `r`, `g`, `b` components as floats from 0.0 to 1.0. Use sRGB colors for screen-based designs and web content.

```typescript highlight=highlight-definitions
// Define color assets for each color space type
const colors: AssetDefinition[] = [
  {
    id: 'brand-blue',
    label: { en: 'Brand Blue' },
    tags: { en: ['brand', 'blue', 'primary'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 0.2,
        g: 0.4,
        b: 0.8
      } as AssetRGBColor
    }
  },
  {
    id: 'brand-coral',
    label: { en: 'Brand Coral' },
    tags: { en: ['brand', 'coral', 'secondary'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 0.95,
        g: 0.45,
        b: 0.4
      } as AssetRGBColor
    }
  },
  {
    id: 'print-magenta',
    label: { en: 'Print Magenta' },
    tags: { en: ['print', 'magenta', 'cmyk'] },
    payload: {
      color: {
        colorSpace: 'CMYK',
        c: 0,
        m: 0.9,
        y: 0.2,
        k: 0
      } as AssetCMYKColor
    }
  },
  {
    id: 'metallic-gold',
    label: { en: 'Metallic Gold' },
    tags: { en: ['spot', 'metallic', 'gold'] },
    payload: {
      color: {
        colorSpace: 'SpotColor',
        name: 'Metallic Gold Ink',
        externalReference: 'Custom Inks',
        representation: {
          colorSpace: 'sRGB',
          r: 0.85,
          g: 0.65,
          b: 0.13
        }
      } as AssetSpotColor
    }
  }
];
```

The example defines four colors demonstrating different color spaces. The first two colors—"Brand Blue" and "Brand Coral"—use sRGB for screen display.

### CMYK Colors

CMYK colors use the `AssetCMYKColor` type with `colorSpace: 'CMYK'` and `c`, `m`, `y`, `k` components as floats from 0.0 to 1.0. Use CMYK colors for print workflows where color accuracy in printing is critical.

The "Print Magenta" color in the example demonstrates the CMYK color space with cyan at 0, magenta at 0.9, yellow at 0.2, and black at 0.

### Spot Colors

Spot colors use the `AssetSpotColor` type with `colorSpace: 'SpotColor'`, a `name` that identifies the spot color, an `externalReference` indicating the color book or ink system, and a `representation` using sRGB or CMYK for screen preview.

The "Metallic Gold" color demonstrates the spot color format, using a custom ink reference with an sRGB representation for on-screen preview.

## Creating a Color Library

We create a local asset source using `engine.asset.addLocalSource()` with a unique source ID. Then we add each color asset using `engine.asset.addAssetToSource()`.

```typescript highlight=highlight-add-library
    // Create a local asset source for the color library
    engine.asset.addLocalSource('my-brand-colors');

    // Add all color assets to the source
    for (const color of colors) {
      engine.asset.addAssetToSource('my-brand-colors', color);
    }
```

The source ID `'my-brand-colors'` identifies this library throughout the application. You can create multiple libraries with different source IDs to organize colors by purpose—for example, separate libraries for brand colors, print colors, and seasonal palettes.

## Querying Colors from a Library

Use `engine.asset.findAssets()` to retrieve colors from a library. This is useful for batch processing workflows, validating library contents, or building custom color selection interfaces.

```typescript highlight=highlight-query-colors
// Query colors from the library
const queryResult = await engine.asset.findAssets('my-brand-colors', {
  page: 0,
  perPage: 100
});
console.log('Colors in library:', queryResult.assets.length);
for (const asset of queryResult.assets) {
  console.log(`  - ${asset.id}: ${asset.label ?? 'No label'}`);
}
```

The query returns an `AssetsQueryResult` containing the matching assets. You can filter by tags, search terms, or pagination parameters to find specific colors.

## Removing Colors from a Library

Remove individual colors from a library using `engine.asset.removeAssetFromSource()` with the source ID and the color's asset ID.

```typescript highlight=highlight-remove-color
// Remove a color from the library
engine.asset.removeAssetFromSource('my-brand-colors', 'brand-coral');
```

This removes the color from the library immediately. Query the library again to verify the removal.

## Applying Colors from the Palette

After creating a color library, you can apply colors to design elements. While the library stores color definitions as assets, you apply them to blocks using the standard color API.

```typescript highlight=highlight-apply-color
    // Create a graphic block and apply a color from the palette
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 300);
    engine.block.setPositionY(block, 225);
    engine.block.appendChild(page, block);

    // Apply Brand Blue from our palette
    const fill = engine.block.getFill(block);
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });
```

The library serves as a centralized source of truth for color values. In production workflows, you would query the library to get the exact color values before applying them to blocks.

## Export and Cleanup

After working with colors, we export the result and dispose of the engine to free resources.

```typescript highlight=highlight-export
  // Export the scene
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync('output.png', buffer);
  console.log('Exported scene to output.png');
} finally {
  if (engine) {
    engine.dispose();
  }
}
```

Always dispose of the engine in a finally block to ensure resources are freed even if an error occurs.

## Troubleshooting

### Colors Not Added to Library

If colors aren't appearing in your library:

- Verify the source ID passed to `addAssetToSource()` matches the ID used in `addLocalSource()`
- Ensure `addLocalSource()` was called before adding colors
- Check that each color asset has a unique `id` property

### Query Returns Empty Results

If `findAssets()` returns no results:

- Verify the source ID matches exactly (case-sensitive)
- Check pagination parameters—`page` starts at 0
- Ensure colors were added successfully before querying

### Spot Color Representation Not Displaying

If a spot color appears incorrectly:

- Verify the `representation` property contains a valid sRGB or CMYK color
- Check that `colorSpace` is set to `'SpotColor'`
- Ensure the representation color values are in the 0.0-1.0 range

### Color Not Removed

If `removeAssetFromSource()` doesn't seem to work:

- Verify the asset ID matches the `id` property of the color exactly
- Check that the source ID is correct
- Query the library after removal to confirm the change

## API Reference

| Method                                                  | Description                            |
| ------------------------------------------------------- | -------------------------------------- |
| `engine.asset.addLocalSource(sourceId)`                 | Create a local asset source for colors |
| `engine.asset.addAssetToSource(sourceId, asset)`        | Add a color asset to a source          |
| `engine.asset.removeAssetFromSource(sourceId, assetId)` | Remove a color asset from a source     |
| `engine.asset.findAssets(sourceId, query)`              | Query colors from a source             |

| Type              | Properties                                                  | Description                               |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------- |
| `AssetRGBColor`   | `colorSpace`, `r`, `g`, `b`                                 | sRGB color for screen display             |
| `AssetCMYKColor`  | `colorSpace`, `c`, `m`, `y`, `k`                            | CMYK color for print workflows            |
| `AssetSpotColor`  | `colorSpace`, `name`, `externalReference`, `representation` | Named spot color for specialized printing |
| `AssetDefinition` | `id`, `label`, `tags`, `payload`                            | Color asset structure with metadata       |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support