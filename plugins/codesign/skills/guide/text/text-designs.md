> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Designs](./text/text-designs.md)

---

Create and customize text designs (text components) programmatically in a headless server environment for batch processing and automation.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-text-designs-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-text-designs-server-js)

Text designs (also known as text components) are pre-designed text layouts stored as serialized blocks in the asset library. This guide shows how to create custom text components using the headless engine for server-side generation and batch processing.

```typescript file=@cesdk_web_examples/guides-text-text-designs-server-js/server-js.ts reference-only
/**
 * CE.SDK Server Guide: Text Designs
 *
 * Demonstrates how to create and register custom text designs (text components):
 * - Create styled text blocks programmatically
 * - Save components as archives with block.saveToArchive()
 * - Generate thumbnails with block.export()
 * - Create content.json structure for custom asset sources
 *
 * The saveToArchive() method creates a zip archive containing the blocks.blocks file
 * and all referenced resources (fonts, images). Extract this archive and serve the
 * files. Use block.loadFromURL() pointing to the blocks.blocks file to load components.
 */

import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page to hold our text components
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create a styled text block that will become our custom component
    const textComponent = engine.block.create('text');
    engine.block.appendChild(page, textComponent);

    // Set text content and styling
    engine.block.replaceText(textComponent, 'Custom Title');
    engine.block.setFloat(textComponent, 'text/fontSize', 72);

    // Set text color to a brand color
    engine.block.setTextColor(textComponent, {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Configure dimensions - use fixed frame with clipping
    engine.block.setWidthMode(textComponent, 'Absolute');
    engine.block.setHeightMode(textComponent, 'Absolute');
    engine.block.setWidth(textComponent, 400);
    engine.block.setHeight(textComponent, 100);
    engine.block.setBool(textComponent, 'clipped', true);

    // Position the component on the page
    engine.block.setPositionX(textComponent, 50);
    engine.block.setPositionY(textComponent, 50);

    // Define a custom typeface
    // With saveToArchive(), fonts are automatically bundled in the archive
    // You can use any font - CDN URLs, bundle:// URIs, or custom fonts
    const caveatTypeface = {
      name: 'Caveat',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf',
          subFamily: 'Regular'
        },
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };

    // Set the font - saveToArchive() will include the font files in the archive
    engine.block.setFont(
      textComponent,
      caveatTypeface.fonts[0].uri,
      caveatTypeface
    );

    // Configure constraints for flexible resizing
    // Enable automatic font sizing within constraints
    engine.block.setBool(textComponent, 'text/automaticFontSizeEnabled', true);
    engine.block.setFloat(textComponent, 'text/minAutomaticFontSize', 24);
    engine.block.setFloat(textComponent, 'text/maxAutomaticFontSize', 120);

    // Save the component to a blocks archive file
    // saveToArchive() returns a Blob containing a zip with blocks.blocks and resources
    const archiveBlob = await engine.block.saveToArchive([textComponent]);
    console.log('Archive size:', archiveBlob.size, 'bytes');

    // Generate a thumbnail for the text component
    // Thumbnails should be 400x320px for the asset library
    const thumbnailBlob = await engine.block.export(textComponent, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 320
    });
    console.log('Thumbnail size:', thumbnailBlob.size, 'bytes');

    // Create the content.json structure for the custom components
    // The uri points to the blocks.blocks file within the extracted archive directory
    const contentJson = {
      version: '3.0.0',
      id: 'my.custom.textComponents',
      assets: [
        {
          id: '//my.custom.textComponents/customTitle',
          label: {
            en: 'Custom Title'
          },
          meta: {
            // URI points to blocks.blocks within the extracted archive directory
            // The {{base_url}} placeholder is replaced with your configured base URL
            uri: '{{base_url}}/my.custom.textComponents/data/customTitle/blocks.blocks',
            thumbUri:
              '{{base_url}}/my.custom.textComponents/thumbnails/customTitle.png',
            mimeType: 'application/ubq-blocks-string'
          }
        },
        {
          id: '//my.custom.textComponents/promo',
          label: {
            en: 'Promo'
          },
          meta: {
            uri: '{{base_url}}/my.custom.textComponents/data/promo/blocks.blocks',
            thumbUri:
              '{{base_url}}/my.custom.textComponents/thumbnails/promo.png',
            mimeType: 'application/ubq-blocks-string'
          }
        }
      ],
      blocks: []
    };
    console.log('Content.json structure:');
    console.log(JSON.stringify(contentJson, null, 2));

    // Save the archive, thumbnail, and content.json to files
    // Create output directory structure
    const outputDir = './output';
    const dataDir = `${outputDir}/data`;
    const thumbnailsDir = `${outputDir}/thumbnails`;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(thumbnailsDir)) {
      mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Save the archive as a zip file
    // Extract this archive to get the blocks.blocks file and any resources (fonts, images)
    // After extraction, the directory structure should be:
    //   data/customTitle/blocks.blocks
    //   data/customTitle/fonts/... (if any custom fonts)
    //   data/customTitle/images/... (if any images)
    const archivePath = `${dataDir}/customTitle.zip`;
    const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
    writeFileSync(archivePath, archiveBuffer);
    console.log(`Saved archive to: ${archivePath}`);
    console.log(
      'Extract this archive to create the data/customTitle/ directory'
    );

    // Save the thumbnail
    const thumbnailPath = `${thumbnailsDir}/customTitle.png`;
    const thumbnailBuffer = Buffer.from(await thumbnailBlob.arrayBuffer());
    writeFileSync(thumbnailPath, thumbnailBuffer);
    console.log(`Saved thumbnail to: ${thumbnailPath}`);

    // Save the content.json
    const contentJsonPath = `${outputDir}/content.json`;
    writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
    console.log(`Saved content.json to: ${contentJsonPath}`);

    // In production, host the files and register the asset source from a URL:
    //
    // await engine.asset.addLocalAssetSourceFromJSON(
    //   new URL('https://your-server.com/my.custom.textComponents/content.json')
    // );
    //
    // The SDK will then use block.loadFromURL() to load components from
    // the URIs specified in content.json (e.g., data/customTitle/blocks.blocks)
    console.log('\nTo use these components in production:');
    console.log('1. Extract the archives:');
    console.log('   unzip data/customTitle.zip -d data/customTitle/');
    console.log('   unzip data/promo.zip -d data/promo/');
    console.log('2. Host the output directory on your server');
    console.log(
      '3. Register with: engine.asset.addLocalAssetSourceFromJSON(new URL(contentJsonUrl))'
    );

    // Create a second example component with different styling
    const promoComponent = engine.block.create('text');
    engine.block.appendChild(page, promoComponent);

    engine.block.replaceText(promoComponent, 'SALE');
    engine.block.setFloat(promoComponent, 'text/fontSize', 96);

    // Use a bold red color for the promo text
    engine.block.setTextColor(promoComponent, {
      r: 0.9,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Set a bold font for the promo component
    const robotoTypeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };
    engine.block.setFont(
      promoComponent,
      robotoTypeface.fonts[0].uri,
      robotoTypeface
    );

    engine.block.setWidthMode(promoComponent, 'Absolute');
    engine.block.setHeightMode(promoComponent, 'Absolute');
    engine.block.setWidth(promoComponent, 300);
    engine.block.setHeight(promoComponent, 120);
    engine.block.setBool(promoComponent, 'clipped', true);

    engine.block.setPositionX(promoComponent, 50);
    engine.block.setPositionY(promoComponent, 200);

    // Save the promo component as an archive
    const promoArchiveBlob = await engine.block.saveToArchive([promoComponent]);
    const promoArchiveBuffer = Buffer.from(
      await promoArchiveBlob.arrayBuffer()
    );
    writeFileSync(`${dataDir}/promo.zip`, promoArchiveBuffer);
    console.log(`Saved promo archive to: ${dataDir}/promo.zip`);

    // Export promo thumbnail
    const promoThumbnail = await engine.block.export(promoComponent, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 320
    });
    const promoThumbnailBuffer = Buffer.from(
      await promoThumbnail.arrayBuffer()
    );
    writeFileSync(`${thumbnailsDir}/promo.png`, promoThumbnailBuffer);
    console.log(`Saved promo thumbnail to: ${thumbnailsDir}/promo.png`);

    console.log('\nFont combinations created successfully!');
    console.log('Output files are in:', outputDir);
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers creating styled text components, serializing them for storage, generating thumbnails, and saving files for deployment.

## Setting Up the Engine

We initialize the headless engine for server-side text component generation. The engine runs without a UI, making it ideal for batch processing.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE,
});
```

Always dispose of the engine when finished to free system resources.

## Creating a Scene

We create a scene with a page to hold our text components. The page dimensions define the canvas where we build components.

```typescript highlight=highlight-create-scene
// Create a scene with a page to hold our text components
const scene = engine.scene.create();
const page = engine.block.create('page');
engine.block.appendChild(scene, page);
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 600);
```

The page provides a container for positioning and styling text components.

## Creating a Text Component

We create a text block and configure its styling, dimensions, and position. The component uses fixed frame dimensions with clipping enabled to ensure consistent display. We set an explicit font using external CDN URLs with the `setFont()` API.

```typescript highlight=highlight-create-text-component
    // Create a styled text block that will become our custom component
    const textComponent = engine.block.create('text');
    engine.block.appendChild(page, textComponent);

    // Set text content and styling
    engine.block.replaceText(textComponent, 'Custom Title');
    engine.block.setFloat(textComponent, 'text/fontSize', 72);

    // Set text color to a brand color
    engine.block.setTextColor(textComponent, {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Configure dimensions - use fixed frame with clipping
    engine.block.setWidthMode(textComponent, 'Absolute');
    engine.block.setHeightMode(textComponent, 'Absolute');
    engine.block.setWidth(textComponent, 400);
    engine.block.setHeight(textComponent, 100);
    engine.block.setBool(textComponent, 'clipped', true);

    // Position the component on the page
    engine.block.setPositionX(textComponent, 50);
    engine.block.setPositionY(textComponent, 50);

    // Define a custom typeface
    // With saveToArchive(), fonts are automatically bundled in the archive
    // You can use any font - CDN URLs, bundle:// URIs, or custom fonts
    const caveatTypeface = {
      name: 'Caveat',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf',
          subFamily: 'Regular'
        },
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };

    // Set the font - saveToArchive() will include the font files in the archive
    engine.block.setFont(
      textComponent,
      caveatTypeface.fonts[0].uri,
      caveatTypeface
    );
```

The text block now has custom styling including font size, color, and fixed dimensions. The `clipped` property ensures text that exceeds the frame boundaries is hidden. With `saveToArchive()`, fonts are automatically bundled in the archive, so you can use any font source.

## Configuring Constraints

We configure the text component with automatic font sizing and constraints. This ensures the component adapts gracefully when users resize it while maintaining readability.

```typescript highlight=highlight-configure-constraints
// Configure constraints for flexible resizing
// Enable automatic font sizing within constraints
engine.block.setBool(textComponent, 'text/automaticFontSizeEnabled', true);
engine.block.setFloat(textComponent, 'text/minAutomaticFontSize', 24);
engine.block.setFloat(textComponent, 'text/maxAutomaticFontSize', 120);
```

The automatic font sizing scales text between 24pt and 120pt as the frame is resized.

## Serializing the Component

We serialize the text component using `saveToArchive()`. This creates a zip archive containing the `blocks.blocks` file and all referenced resources (fonts, images). The archive is self-contained and portable.

```typescript highlight=highlight-serialize-component
// Save the component to a blocks archive file
// saveToArchive() returns a Blob containing a zip with blocks.blocks and resources
const archiveBlob = await engine.block.saveToArchive([textComponent]);
console.log('Archive size:', archiveBlob.size, 'bytes');
```

The archive blob can be saved as a `.zip` file. Extract the archive before deployment to create the directory structure needed for hosting.

## Legacy: Using saveToString()

For backward compatibility, you can use `saveToString()` instead of `saveToArchive()`. This approach serializes the block as a string but requires external font URLs to remain accessible.

```typescript
// Legacy approach - requires external font URLs
const serializedComponent = await engine.block.saveToString(
  [textComponent],
  ['bundle', 'buffer', 'http', 'https']  // Allowed resource schemes
);

// Save as .blocks file
writeFileSync(`${outputDir}/customTitle.blocks`, serializedComponent);

// Load with loadFromString() or loadFromURL()
const loadedBlocks = await engine.block.loadFromString(serializedComponent);
```

**Limitations of saveToString():**

- Font URLs must remain accessible at load time
- No automatic resource bundling
- Requires `allowedResourceSchemes` configuration

We recommend `saveToArchive()` for new implementations as it bundles all resources automatically.

## Generating a Thumbnail

We generate a 400x320px thumbnail for the asset library using `block.export()`. Thumbnails help users preview components before inserting them.

```typescript highlight=highlight-generate-thumbnail
// Generate a thumbnail for the text component
// Thumbnails should be 400x320px for the asset library
const thumbnailBlob = await engine.block.export(textComponent, {
  mimeType: 'image/png',
  targetWidth: 400,
  targetHeight: 320
});
console.log('Thumbnail size:', thumbnailBlob.size, 'bytes');
```

The thumbnail blob can be converted to a buffer and saved as a PNG file.

## Creating the Content.json Structure

We create the content.json structure that defines the asset source. This file lists all components with their metadata, including paths to the serialized blocks and thumbnails.

```typescript highlight=highlight-create-content-json
// Create the content.json structure for the custom components
// The uri points to the blocks.blocks file within the extracted archive directory
const contentJson = {
  version: '3.0.0',
  id: 'my.custom.textComponents',
  assets: [
    {
      id: '//my.custom.textComponents/customTitle',
      label: {
        en: 'Custom Title'
      },
      meta: {
        // URI points to blocks.blocks within the extracted archive directory
        // The {{base_url}} placeholder is replaced with your configured base URL
        uri: '{{base_url}}/my.custom.textComponents/data/customTitle/blocks.blocks',
        thumbUri:
          '{{base_url}}/my.custom.textComponents/thumbnails/customTitle.png',
        mimeType: 'application/ubq-blocks-string'
      }
    },
    {
      id: '//my.custom.textComponents/promo',
      label: {
        en: 'Promo'
      },
      meta: {
        uri: '{{base_url}}/my.custom.textComponents/data/promo/blocks.blocks',
        thumbUri:
          '{{base_url}}/my.custom.textComponents/thumbnails/promo.png',
        mimeType: 'application/ubq-blocks-string'
      }
    }
  ],
  blocks: []
};
console.log('Content.json structure:');
console.log(JSON.stringify(contentJson, null, 2));
```

In production, the `uri` and `thumbUri` fields point to your hosted files. The `mimeType` must be `"application/ubq-blocks-string"` for text components.

## Saving Files

We save the archive, thumbnail, and content.json to the filesystem. The archive is saved as a `.zip` file that must be extracted before deployment.

```typescript highlight=highlight-save-files
    // Save the archive, thumbnail, and content.json to files
    // Create output directory structure
    const outputDir = './output';
    const dataDir = `${outputDir}/data`;
    const thumbnailsDir = `${outputDir}/thumbnails`;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(thumbnailsDir)) {
      mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Save the archive as a zip file
    // Extract this archive to get the blocks.blocks file and any resources (fonts, images)
    // After extraction, the directory structure should be:
    //   data/customTitle/blocks.blocks
    //   data/customTitle/fonts/... (if any custom fonts)
    //   data/customTitle/images/... (if any images)
    const archivePath = `${dataDir}/customTitle.zip`;
    const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
    writeFileSync(archivePath, archiveBuffer);
    console.log(`Saved archive to: ${archivePath}`);
    console.log(
      'Extract this archive to create the data/customTitle/ directory'
    );

    // Save the thumbnail
    const thumbnailPath = `${thumbnailsDir}/customTitle.png`;
    const thumbnailBuffer = Buffer.from(await thumbnailBlob.arrayBuffer());
    writeFileSync(thumbnailPath, thumbnailBuffer);
    console.log(`Saved thumbnail to: ${thumbnailPath}`);

    // Save the content.json
    const contentJsonPath = `${outputDir}/content.json`;
    writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
    console.log(`Saved content.json to: ${contentJsonPath}`);
```

The output directory contains all files needed to host your custom text components. Extract each `.zip` archive to create the expected directory structure with `blocks.blocks` and any bundled resources.

## Registering the Asset Source

In production, host the extracted files and register the asset source from a URL using `addLocalAssetSourceFromJSON()`. The SDK will use `loadFromURL()` to load components from the URIs specified in content.json.

```typescript highlight=highlight-register-asset-source
// In production, host the files and register the asset source from a URL:
//
// await engine.asset.addLocalAssetSourceFromJSON(
//   new URL('https://your-server.com/my.custom.textComponents/content.json')
// );
//
// The SDK will then use block.loadFromURL() to load components from
// the URIs specified in content.json (e.g., data/customTitle/blocks.blocks)
console.log('\nTo use these components in production:');
console.log('1. Extract the archives:');
console.log('   unzip data/customTitle.zip -d data/customTitle/');
console.log('   unzip data/promo.zip -d data/promo/');
console.log('2. Host the output directory on your server');
console.log(
  '3. Register with: engine.asset.addLocalAssetSourceFromJSON(new URL(contentJsonUrl))'
);
```

The console output shows the steps needed for production deployment: extract archives, host the files, and register the asset source with the hosted content.json URL.

## Creating Additional Components

We create a second component with different styling to demonstrate building a library of text components.

```typescript highlight=highlight-create-second-component
    const promoComponent = engine.block.create('text');
    engine.block.appendChild(page, promoComponent);

    engine.block.replaceText(promoComponent, 'SALE');
    engine.block.setFloat(promoComponent, 'text/fontSize', 96);

    // Use a bold red color for the promo text
    engine.block.setTextColor(promoComponent, {
      r: 0.9,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Set a bold font for the promo component
    const robotoTypeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };
    engine.block.setFont(
      promoComponent,
      robotoTypeface.fonts[0].uri,
      robotoTypeface
    );

    engine.block.setWidthMode(promoComponent, 'Absolute');
    engine.block.setHeightMode(promoComponent, 'Absolute');
    engine.block.setWidth(promoComponent, 300);
    engine.block.setHeight(promoComponent, 120);
    engine.block.setBool(promoComponent, 'clipped', true);

    engine.block.setPositionX(promoComponent, 50);
    engine.block.setPositionY(promoComponent, 200);

    // Save the promo component as an archive
    const promoArchiveBlob = await engine.block.saveToArchive([promoComponent]);
    const promoArchiveBuffer = Buffer.from(
      await promoArchiveBlob.arrayBuffer()
    );
    writeFileSync(`${dataDir}/promo.zip`, promoArchiveBuffer);
    console.log(`Saved promo archive to: ${dataDir}/promo.zip`);

    // Export promo thumbnail
    const promoThumbnail = await engine.block.export(promoComponent, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 320
    });
    const promoThumbnailBuffer = Buffer.from(
      await promoThumbnail.arrayBuffer()
    );
    writeFileSync(`${thumbnailsDir}/promo.png`, promoThumbnailBuffer);
    console.log(`Saved promo thumbnail to: ${thumbnailsDir}/promo.png`);
```

Each component can have unique styling, dimensions, and behavior. Build a library by creating multiple components and adding them to your content.json.

## Cleaning Up

We dispose of the engine to free system resources. Always clean up the engine when finished with processing.

```typescript highlight=highlight-cleanup
// Always dispose of the engine to free resources
engine.dispose();
```

## Troubleshooting

**Archive creation fails**: Ensure the block has valid dimensions and is part of the scene hierarchy before calling `saveToArchive()`.

**Engine initialization fails**: Verify Node.js version compatibility (v22 or later) and ensure `@cesdk/node` (or `@cesdk/node-native`) is properly installed.

**Thumbnail export fails**: Ensure the block has valid dimensions and is part of the scene hierarchy.

**File write errors**: Verify the output directory exists or use `mkdirSync` with `recursive: true`.

**Resources missing after extraction**: Ensure you extract the complete archive including all subdirectories (fonts/, images/).

**Memory issues with batch processing**: Dispose of the engine between batches or use a single engine instance with scene cleanup.

## API Reference

| Method | Purpose |
|--------|---------|
| `CreativeEngine.init()` | Initialize the headless engine |
| `engine.scene.create()` | Create a new scene with options |
| `engine.block.create()` | Create a new block of specified type |
| `engine.block.replaceText()` | Set text content on a text block |
| `engine.block.setFloat()` | Set numeric properties like font size |
| `engine.block.setFont()` | Set font with typeface definition and URI |
| `engine.block.setTextColor()` | Set text color with RGBA values |
| `engine.block.setWidthMode()` | Set width mode: 'Absolute', 'Percent', 'Auto' |
| `engine.block.setHeightMode()` | Set height mode: 'Absolute', 'Percent', 'Auto' |
| `engine.block.setBool()` | Enable/disable boolean properties |
| `engine.block.setColor()` | Set color properties like background |
| `engine.block.saveToArchive()` | Save blocks to zip archive with all resources |
| `engine.block.saveToString()` | Legacy: Save blocks as string (requires external resources) |
| `engine.block.loadFromString()` | Legacy: Load blocks from string |
| `engine.block.export()` | Export block as image blob |
| `engine.asset.addLocalAssetSourceFromJSON()` | Register custom asset source from URL |
| `engine.dispose()` | Clean up engine resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support