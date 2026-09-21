> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Blocks](./concepts/blocks.md)

---

Work with blocks—the fundamental building units for all visual elements in
CE.SDK designs.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-blocks-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-blocks-server-js)

Every visual element in CE.SDK—images, text, shapes, and audio—is represented as a block. Blocks are organized in a tree structure within scenes and pages, where parent-child relationships determine rendering order and visibility. Each block has properties you can read and modify, a `Type` that defines its core behavior, and an optional `Kind` for custom categorization.

```typescript file=@cesdk_web_examples/guides-concepts-blocks-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Blocks Guide
 *
 * Demonstrates working with blocks in CE.SDK:
 * - Block types (graphic, text, audio, page, cutout)
 * - Block hierarchy (parent-child relationships)
 * - Block lifecycle (create, duplicate, destroy)
 * - Block properties and reflection
 * - Selection and visibility
 * - Block state management
 * - Serialization (save/load)
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a new scene and page
    const scene = engine.scene.create();

    // Create and add a page block - pages contain all design elements
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Query the block type - returns the full type path
    const pageType = engine.block.getType(page);
    console.log('Page block type:', pageType); // '//ly.img.ubq/page'

    // Type is immutable, determined at creation
    // Kind is a custom label you can set and change
    engine.block.setKind(page, 'main-canvas');
    const pageKind = engine.block.getKind(page);
    console.log('Page kind:', pageKind); // 'main-canvas'

    // Find blocks by kind
    const mainCanvasBlocks = engine.block.findByKind('main-canvas');
    console.log('Blocks with kind "main-canvas":', mainCanvasBlocks.length);

    // Create a graphic block for an image
    const graphic = engine.block.create('graphic');

    // Duplicate creates a copy with a new UUID
    const graphicCopy = engine.block.duplicate(graphic);

    // Destroy removes a block - the duplicate is no longer needed
    engine.block.destroy(graphicCopy);

    // Check if a block ID is still valid after operations
    const isOriginalValid = engine.block.isValid(graphic);
    const isCopyValid = engine.block.isValid(graphicCopy);
    console.log('Original valid:', isOriginalValid); // true
    console.log('Copy valid after destroy:', isCopyValid); // false

    // Create a rect shape to define the graphic's bounds
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    // Position and size the graphic
    engine.block.setPositionX(graphic, 200);
    engine.block.setPositionY(graphic, 100);
    engine.block.setWidth(graphic, 400);
    engine.block.setHeight(graphic, 300);

    // Create an image fill and attach it to the graphic
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);

    // Set content fill mode so the image fills the block bounds
    engine.block.setEnum(graphic, 'contentFill/mode', 'Cover');

    // Blocks form a tree: scene > page > elements
    // Append the graphic to the page to make it visible
    engine.block.appendChild(page, graphic);

    // Query parent-child relationships
    const graphicParent = engine.block.getParent(graphic);
    console.log('Graphic parent is page:', graphicParent === page); // true

    const pageChildren = engine.block.getChildren(page);
    console.log('Page has children:', pageChildren.length);

    // Create a text block with content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position the text block
    engine.block.setPositionX(textBlock, 200);
    engine.block.setPositionY(textBlock, 450);
    engine.block.setWidth(textBlock, 400);
    engine.block.setHeight(textBlock, 80);

    // Set text content
    engine.block.setString(
      textBlock,
      'text/text',
      'Blocks are the building units of CE.SDK designs'
    );

    // Set font size to 72pt
    engine.block.setFloat(textBlock, 'text/fontSize', 72);

    // Center-align the text
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');

    // Check the text block type
    const textType = engine.block.getType(textBlock);
    console.log('Text block type:', textType); // '//ly.img.ubq/text'

    // Use reflection to discover available properties
    const graphicProperties = engine.block.findAllProperties(graphic);
    console.log('Graphic block has', graphicProperties.length, 'properties');

    // Get property type information
    const opacityType = engine.block.getPropertyType('opacity');
    console.log('Opacity property type:', opacityType); // 'Float'

    // Check if properties are readable/writable
    const isOpacityReadable = engine.block.isPropertyReadable('opacity');
    const isOpacityWritable = engine.block.isPropertyWritable('opacity');
    console.log(
      'Opacity readable:',
      isOpacityReadable,
      'writable:',
      isOpacityWritable
    );

    // Use type-specific getters and setters
    // Float properties
    engine.block.setFloat(graphic, 'opacity', 0.9);
    const opacity = engine.block.getFloat(graphic, 'opacity');
    console.log('Graphic opacity:', opacity);

    // Bool properties
    engine.block.setBool(page, 'page/marginEnabled', false);
    const marginEnabled = engine.block.getBool(page, 'page/marginEnabled');
    console.log('Page margin enabled:', marginEnabled);

    // Enum properties - get allowed values first
    const blendModes = engine.block.getEnumValues('blend/mode');
    console.log(
      'Available blend modes:',
      blendModes.slice(0, 3).join(', '),
      '...'
    );

    engine.block.setEnum(graphic, 'blend/mode', 'Multiply');
    const blendMode = engine.block.getEnum(graphic, 'blend/mode');
    console.log('Graphic blend mode:', blendMode);

    // Each block has a stable UUID across save/load cycles
    const graphicUUID = engine.block.getUUID(graphic);
    console.log('Graphic UUID:', graphicUUID);

    // Block names are mutable labels for organization
    engine.block.setName(graphic, 'Hero Image');
    engine.block.setName(textBlock, 'Caption');

    const graphicName = engine.block.getName(graphic);
    console.log('Graphic name:', graphicName); // 'Hero Image'

    // Select a block programmatically
    engine.block.select(graphic); // Selects graphic, deselects others

    // Check selection state
    const isGraphicSelected = engine.block.isSelected(graphic);
    console.log('Graphic is selected:', isGraphicSelected); // true

    // Add to selection without deselecting others
    engine.block.setSelected(textBlock, true);

    // Get all selected blocks
    const selectedBlocks = engine.block.findAllSelected();
    console.log('Selected blocks count:', selectedBlocks.length); // 2

    // Control block visibility
    engine.block.setVisible(graphic, true);
    const isVisible = engine.block.isVisible(graphic);
    console.log('Graphic is visible:', isVisible);

    // Control export inclusion
    engine.block.setIncludedInExport(graphic, true);
    const inExport = engine.block.isIncludedInExport(graphic);
    console.log('Graphic included in export:', inExport);

    // Control clipping behavior
    engine.block.setClipped(graphic, false);
    const isClipped = engine.block.isClipped(graphic);
    console.log('Graphic is clipped:', isClipped);

    // Query block state - indicates loading status
    const graphicState = engine.block.getState(graphic);
    console.log('Graphic state:', graphicState.type); // 'Ready', 'Pending', or 'Error'

    // Save blocks to a string for persistence
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const savedString = await engine.block.saveToString(
      [graphic, textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );
    console.log('Blocks saved to string, length:', savedString.length);

    // Alternatively, blocks can also be saved with their assets to an archive
    // const savedBlocksArchive = await engine.block.saveToArchive([
    //   graphic,
    //   textBlock
    // ]);

    // Load blocks from string (creates new blocks, not attached to scene)
    const loadedBlocks = await engine.block.loadFromString(savedString);
    console.log('Loaded blocks from string:', loadedBlocks.length);

    // Alternatively, blocks can also be loaded from an archive
    // const loadedBlocks = await engine.block.loadFromArchiveURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1_blocks.zip'
    // );
    // console.log('Loaded blocks from archive URL:', loadedBlocks.length);

    // Alternatively, blocks can be loaded from an extracted zip file created with block.saveToArchive
    // const loadedBlocks = await engine.block.loadFromURL(
    //   'https://cdn.img.ly/assets/v6/ly.img.text.components/box/blocks.blocks'
    // );
    // console.log('Loaded blocks from URL:', loadedBlocks.length);

    // Loaded blocks must be parented to appear in the scene
    // For demo purposes, we won't add them to avoid duplicates
    for (const block of loadedBlocks) {
      engine.block.destroy(block);
    }

    console.log('Blocks guide completed successfully.');
    console.log('Created graphic block with image fill and text block.');
    console.log(
      'Demonstrated: types, hierarchy, properties, selection, state, and serialization.'
    );
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers block types and their uses, how to create and manage blocks programmatically, how to work with block properties using the reflection system, and how to handle selection, visibility, and state changes.

## Block Types

CE.SDK provides several block types, each designed for specific content:

- **graphic** (`//ly.img.ubq/graphic`): Visual blocks for images, shapes, and graphics
- **text** (`//ly.img.ubq/text`): Text content with typography controls
- **audio** (`//ly.img.ubq/audio`): Audio content for video scenes
- **page** (`//ly.img.ubq/page`): Container blocks representing canvases or artboards
- **cutout** (`//ly.img.ubq/cutout`): Blocks for masking operations

We query a block's type using `getType()` and find blocks of a specific type with `findByType()`:

```typescript highlight-block-types
    // Create a new scene and page
    const scene = engine.scene.create();

    // Create and add a page block - pages contain all design elements
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Query the block type - returns the full type path
    const pageType = engine.block.getType(page);
    console.log('Page block type:', pageType); // '//ly.img.ubq/page'
```

Block types are immutable—once created, a block's type cannot change. This distinguishes type from kind.

## Type vs Kind

Type and kind serve different purposes. The **type** is determined at creation and defines core behavior. The **kind** is a custom string label you assign for application-specific categorization.

```typescript highlight-type-vs-kind
    // Type is immutable, determined at creation
    // Kind is a custom label you can set and change
    engine.block.setKind(page, 'main-canvas');
    const pageKind = engine.block.getKind(page);
    console.log('Page kind:', pageKind); // 'main-canvas'

    // Find blocks by kind
    const mainCanvasBlocks = engine.block.findByKind('main-canvas');
    console.log('Blocks with kind "main-canvas":', mainCanvasBlocks.length);
```

Use kind to tag blocks for your application's logic. You can set it with `setKind()`, query it with `getKind()`, and find blocks by kind with `findByKind()`.

## Block Hierarchy

Blocks form a tree structure where scenes contain pages, and pages contain design elements.

```typescript highlight-block-hierarchy
    // Blocks form a tree: scene > page > elements
    // Append the graphic to the page to make it visible
    engine.block.appendChild(page, graphic);

    // Query parent-child relationships
    const graphicParent = engine.block.getParent(graphic);
    console.log('Graphic parent is page:', graphicParent === page); // true

    const pageChildren = engine.block.getChildren(page);
    console.log('Page has children:', pageChildren.length);
```

Only blocks that are direct or indirect children of a page block are rendered. A scene without any page children won't display content in the editor. Use `appendChild()` to add blocks to parents, `getParent()` to query a block's parent, and `getChildren()` to get a block's children.

## Block Lifecycle

Create new blocks with `create()`, duplicate existing blocks with `duplicate()`, and remove blocks with `destroy()`. After destroying a block, `isValid()` returns `false` for that block ID.

```typescript highlight-block-lifecycle
    // Create a graphic block for an image
    const graphic = engine.block.create('graphic');

    // Duplicate creates a copy with a new UUID
    const graphicCopy = engine.block.duplicate(graphic);

    // Destroy removes a block - the duplicate is no longer needed
    engine.block.destroy(graphicCopy);

    // Check if a block ID is still valid after operations
    const isOriginalValid = engine.block.isValid(graphic);
    const isCopyValid = engine.block.isValid(graphicCopy);
    console.log('Original valid:', isOriginalValid); // true
    console.log('Copy valid after destroy:', isCopyValid); // false
```

When duplicating a block, all children are included, and the duplicate receives a new UUID.

## Working with Fills

Graphic blocks display content through fills. We create a fill, attach it to a block, and configure its source.

```typescript highlight-fill
    // Create a rect shape to define the graphic's bounds
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    // Position and size the graphic
    engine.block.setPositionX(graphic, 200);
    engine.block.setPositionY(graphic, 100);
    engine.block.setWidth(graphic, 400);
    engine.block.setHeight(graphic, 300);

    // Create an image fill and attach it to the graphic
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);

    // Set content fill mode so the image fills the block bounds
    engine.block.setEnum(graphic, 'contentFill/mode', 'Cover');
```

CE.SDK supports several fill types including image, video, color, and gradient fills. See the [Fills guide](./fills/gradient.md) for details on available fill types.

## Creating Text Blocks

Text blocks display formatted text content. We create a text block, position it, and set its content.

```typescript highlight-text-block
    // Create a text block with content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position the text block
    engine.block.setPositionX(textBlock, 200);
    engine.block.setPositionY(textBlock, 450);
    engine.block.setWidth(textBlock, 400);
    engine.block.setHeight(textBlock, 80);

    // Set text content
    engine.block.setString(
      textBlock,
      'text/text',
      'Blocks are the building units of CE.SDK designs'
    );

    // Set font size to 72pt
    engine.block.setFloat(textBlock, 'text/fontSize', 72);

    // Center-align the text
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');

    // Check the text block type
    const textType = engine.block.getType(textBlock);
    console.log('Text block type:', textType); // '//ly.img.ubq/text'
```

Text blocks support extensive typography controls covered in the [Text guides](./text.md).

## Block Properties

The reflection system lets you discover and manipulate any block property dynamically. Use `findAllProperties()` to get all available properties for a block—they're prefixed by category like `shape/star/points` or `text/fontSize`.

```typescript highlight-block-properties
    // Use reflection to discover available properties
    const graphicProperties = engine.block.findAllProperties(graphic);
    console.log('Graphic block has', graphicProperties.length, 'properties');

    // Get property type information
    const opacityType = engine.block.getPropertyType('opacity');
    console.log('Opacity property type:', opacityType); // 'Float'

    // Check if properties are readable/writable
    const isOpacityReadable = engine.block.isPropertyReadable('opacity');
    const isOpacityWritable = engine.block.isPropertyWritable('opacity');
    console.log(
      'Opacity readable:',
      isOpacityReadable,
      'writable:',
      isOpacityWritable
    );
```

Query property types with `getPropertyType()`. Returns include `Bool`, `Int`, `Float`, `Double`, `String`, `Color`, `Enum`, or `Struct`. For enum properties, use `getEnumValues()` to get allowed values.

### Property Accessors

Use type-specific getters and setters matching the property type:

```typescript highlight-property-accessors
    // Use type-specific getters and setters
    // Float properties
    engine.block.setFloat(graphic, 'opacity', 0.9);
    const opacity = engine.block.getFloat(graphic, 'opacity');
    console.log('Graphic opacity:', opacity);

    // Bool properties
    engine.block.setBool(page, 'page/marginEnabled', false);
    const marginEnabled = engine.block.getBool(page, 'page/marginEnabled');
    console.log('Page margin enabled:', marginEnabled);

    // Enum properties - get allowed values first
    const blendModes = engine.block.getEnumValues('blend/mode');
    console.log(
      'Available blend modes:',
      blendModes.slice(0, 3).join(', '),
      '...'
    );

    engine.block.setEnum(graphic, 'blend/mode', 'Multiply');
    const blendMode = engine.block.getEnum(graphic, 'blend/mode');
    console.log('Graphic blend mode:', blendMode);
```

Using the wrong accessor type for a property will cause an error. Always check `getPropertyType()` if you're unsure which accessor to use.

## UUID, Names, and Identity

Each block has a UUID that remains stable across save and load operations. Block names are mutable labels for organization.

```typescript highlight-uuid-identity
    // Each block has a stable UUID across save/load cycles
    const graphicUUID = engine.block.getUUID(graphic);
    console.log('Graphic UUID:', graphicUUID);

    // Block names are mutable labels for organization
    engine.block.setName(graphic, 'Hero Image');
    engine.block.setName(textBlock, 'Caption');

    const graphicName = engine.block.getName(graphic);
    console.log('Graphic name:', graphicName); // 'Hero Image'
```

Use `getUUID()` when you need a persistent identifier for a block. Names are useful for user-facing labels and can be changed freely with `setName()`.

## Selection

Control which blocks are selected programmatically. Use `select()` to select a single block (deselecting others) or `setSelected()` to modify selection without affecting other blocks.

```typescript highlight-selection
    // Select a block programmatically
    engine.block.select(graphic); // Selects graphic, deselects others

    // Check selection state
    const isGraphicSelected = engine.block.isSelected(graphic);
    console.log('Graphic is selected:', isGraphicSelected); // true

    // Add to selection without deselecting others
    engine.block.setSelected(textBlock, true);

    // Get all selected blocks
    const selectedBlocks = engine.block.findAllSelected();
    console.log('Selected blocks count:', selectedBlocks.length); // 2
```

Subscribe to selection changes with `onSelectionChanged()` to update your UI when the selection state changes.

## Visibility

Control whether blocks appear on the canvas and are included in exports.

```typescript highlight-visibility
    // Control block visibility
    engine.block.setVisible(graphic, true);
    const isVisible = engine.block.isVisible(graphic);
    console.log('Graphic is visible:', isVisible);

    // Control export inclusion
    engine.block.setIncludedInExport(graphic, true);
    const inExport = engine.block.isIncludedInExport(graphic);
    console.log('Graphic included in export:', inExport);
```

A block with `isVisible()` returning true may still not appear if it hasn't been added to a parent, the parent is hidden, or another block obscures it.

### Clipping

Clipping determines whether a block's content is constrained to its parent's bounds. When `setClipped(block, true)` is set, any portion of the block extending beyond its parent's boundaries is hidden. When clipping is disabled, the block renders fully even if it overflows its parent container.

```typescript highlight-clipping
// Control clipping behavior
engine.block.setClipped(graphic, false);
const isClipped = engine.block.isClipped(graphic);
console.log('Graphic is clipped:', isClipped);
```

## Block State

Blocks track loading progress and error conditions through a state system with three possible states:

- **Ready**: Normal state, no pending operations
- **Pending**: Operation in progress with optional progress value (0-1)
- **Error**: Operation failed (`ImageDecoding`, `VideoDecoding`, `FileFetch`, `AudioDecoding`, `Unknown`)

```typescript highlight-block-state
// Query block state - indicates loading status
const graphicState = engine.block.getState(graphic);
console.log('Graphic state:', graphicState.type); // 'Ready', 'Pending', or 'Error'
```

Subscribe to state changes with `onStateChanged()` to show loading indicators or handle errors in your UI.

## Serialization

Save blocks to strings for persistence and restore them later.

```typescript highlight-serialization
    // Save blocks to a string for persistence
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const savedString = await engine.block.saveToString(
      [graphic, textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );
    console.log('Blocks saved to string, length:', savedString.length);

    // Alternatively, blocks can also be saved with their assets to an archive
    // const savedBlocksArchive = await engine.block.saveToArchive([
    //   graphic,
    //   textBlock
    // ]);

    // Load blocks from string (creates new blocks, not attached to scene)
    const loadedBlocks = await engine.block.loadFromString(savedString);
    console.log('Loaded blocks from string:', loadedBlocks.length);

    // Alternatively, blocks can also be loaded from an archive
    // const loadedBlocks = await engine.block.loadFromArchiveURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1_blocks.zip'
    // );
    // console.log('Loaded blocks from archive URL:', loadedBlocks.length);

    // Alternatively, blocks can be loaded from an extracted zip file created with block.saveToArchive
    // const loadedBlocks = await engine.block.loadFromURL(
    //   'https://cdn.img.ly/assets/v6/ly.img.text.components/box/blocks.blocks'
    // );
    // console.log('Loaded blocks from URL:', loadedBlocks.length);

    // Loaded blocks must be parented to appear in the scene
    // For demo purposes, we won't add them to avoid duplicates
    for (const block of loadedBlocks) {
      engine.block.destroy(block);
    }
```

Use `saveToString()` for lightweight serialization or `saveToArchive()` to include all referenced assets.

Blocks can be loaded with `loadFromString()`, `loadFromArchiveURL()`, or `loadFromURL()`.
For `loadFromArchiveURL()`, the URL should point to the zipped archive file previously saved with `saveToArchive()`,
whereas for `loadFromURL()`, it should point to a blocks file within an unzipped archive directory.

Loaded blocks are not automatically attached to the scene—you must parent them with `appendChild()` to make them visible.

## Troubleshooting

**Block not visible**: Ensure the block is a child of a page that's a child of the scene.

**Property setter fails**: Verify the property type matches the setter method used. Use `getPropertyType()` to check.

**Block ID invalid after destroy**: Use `isValid()` before operations on potentially destroyed blocks.

**State stuck in Pending**: Check network connectivity for remote resources or use state change events to monitor progress.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support