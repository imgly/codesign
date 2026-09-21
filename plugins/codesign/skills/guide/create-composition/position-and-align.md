> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Position and Align](./create-composition/position-and-align.md)

---

Position, align, and distribute design elements precisely using CE.SDK's
layout APIs in headless server environments.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-position-and-align-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-position-and-align-server-js)

CE.SDK positions blocks relative to their parent container with the origin at the top left. You can set positions using absolute values (design units) or as percentages of the parent's dimensions. For multi-element layouts, alignment and distribution APIs arrange blocks precisely without manual calculations.

```typescript file=@cesdk_web_examples/guides-create-composition-position-and-align-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Positioning and Alignment
 *
 * Demonstrates positioning, aligning, and distributing design elements:
 * - Setting block positions with absolute and percentage modes
 * - Aligning multiple blocks horizontally and vertically
 * - Aligning a single block within its parent
 * - Distributing blocks with even spacing
 * - Exporting results
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

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: 150, height: 100 };

  // Create an image block and position it using absolute coordinates
  const block1 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block1);

  // Set position using absolute coordinates (in design units)
  engine.block.setPositionX(block1, 50);
  engine.block.setPositionY(block1, 50);

  // Query the current position
  const x1 = engine.block.getPositionX(block1);
  const y1 = engine.block.getPositionY(block1);
  console.log(`Block 1 absolute position: (${x1}, ${y1})`);

  // Create another block and position it using percentage mode
  const block2 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block2);

  // Set position mode to Percent and use percentage values
  engine.block.setPositionXMode(block2, 'Percent');
  engine.block.setPositionYMode(block2, 'Percent');
  engine.block.setPositionX(block2, 0.5); // 50% from left
  engine.block.setPositionY(block2, 0.1); // 10% from top

  // Query the position mode
  const xMode = engine.block.getPositionXMode(block2);
  const yMode = engine.block.getPositionYMode(block2);
  console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);

  // Create a third block and use the convenience method
  const block3 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block3);

  // Set both X and Y at once with a specific position mode
  engine.block.setPosition(block3, 0.75, 0.1, { positionMode: 'Percent' });
  console.log(
    'Block 3 set to 75% horizontal, 10% vertical using setPosition()'
  );

  // ===== ALIGNMENT DEMONSTRATION =====
  console.log('\n--- Alignment Demo ---');

  // Create multiple blocks for alignment demonstration
  const alignBlocks: number[] = [];
  const alignPositions = [
    { x: 100, y: 200 },
    { x: 250, y: 250 },
    { x: 180, y: 300 },
    { x: 350, y: 275 }
  ];

  for (const pos of alignPositions) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 100, height: 80 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
    alignBlocks.push(block);
  }

  // Check if blocks can be aligned
  const canAlign = engine.block.isAlignable(alignBlocks);
  console.log('Can align blocks:', canAlign);

  if (canAlign) {
    // Align blocks horizontally to the left edge of their bounding box
    engine.block.alignHorizontally(alignBlocks, 'Left');
    console.log('Blocks aligned to left edge');
  }

  // Create a single block to demonstrate aligning within parent
  const singleBlock = await engine.block.addImage(imageUri, {
    size: { width: 120, height: 80 }
  });
  engine.block.appendChild(page, singleBlock);

  // Position initially off-center
  engine.block.setPositionX(singleBlock, 500);
  engine.block.setPositionY(singleBlock, 450);

  // Align single block to center of parent (page)
  if (engine.block.isAlignable([singleBlock])) {
    engine.block.alignHorizontally([singleBlock], 'Center');
    engine.block.alignVertically([singleBlock], 'Bottom');
    console.log('Single block centered horizontally and aligned to bottom');
  }

  // ===== DISTRIBUTION DEMONSTRATION =====
  console.log('\n--- Distribution Demo ---');

  // Create blocks for distribution demonstration
  const distributeBlocks: number[] = [];
  const xPositions = [480, 530, 650, 750];

  for (let i = 0; i < xPositions.length; i++) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 60, height: 50 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, xPositions[i]);
    engine.block.setPositionY(block, 200); // Same Y for horizontal distribution
    distributeBlocks.push(block);
  }

  // Check if blocks can be distributed
  const canDistribute = engine.block.isDistributable(distributeBlocks);
  console.log('Can distribute blocks:', canDistribute);

  if (canDistribute) {
    // Distribute blocks horizontally with even spacing
    engine.block.distributeHorizontally(distributeBlocks);
    console.log('Blocks distributed horizontally with even spacing');
  }

  // Create another set of blocks for vertical distribution
  const verticalBlocks: number[] = [];
  const yPositions = [280, 350, 420, 520];

  for (let i = 0; i < yPositions.length; i++) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 60, height: 50 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, 700);
    engine.block.setPositionY(block, yPositions[i]);
    verticalBlocks.push(block);
  }

  if (engine.block.isDistributable(verticalBlocks)) {
    engine.block.distributeVertically(verticalBlocks);
    console.log('Vertical blocks distributed with even spacing');
  }

  // ===== SUMMARY =====
  console.log('\n--- Summary ---');
  const allGraphics = engine.block.findByType('graphic');
  console.log(`Total blocks created: ${allGraphics.length}`);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/position-and-align.png', buffer);
  console.log('\nExported to output/position-and-align.png');
} finally {
  engine.dispose();
}
```

This guide covers how to set block positions using different modes, align blocks horizontally and vertically, and distribute blocks with even spacing in a headless Node.js environment.

## Setup

Initialize the CE.SDK engine in headless mode for server-side processing.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Coordinate System

CE.SDK uses a coordinate system where the origin (0, 0) is at the top-left corner of the parent container. The X axis extends to the right and the Y axis extends downward. All positions are relative to the block's parent.

## Setting Block Positions

### Absolute Positioning

We can position blocks using absolute coordinates in design units. This is useful when you need precise control over element placement.

```typescript highlight-absolute-position
  // Create an image block and position it using absolute coordinates
  const block1 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block1);

  // Set position using absolute coordinates (in design units)
  engine.block.setPositionX(block1, 50);
  engine.block.setPositionY(block1, 50);

  // Query the current position
  const x1 = engine.block.getPositionX(block1);
  const y1 = engine.block.getPositionY(block1);
  console.log(`Block 1 absolute position: (${x1}, ${y1})`);
```

The `engine.block.setPositionX()` and `engine.block.setPositionY()` methods set the block's position relative to its parent. Use `engine.block.getPositionX()` and `engine.block.getPositionY()` to query the current position.

### Percentage-Based Positioning

Positions can also be set as percentages of the parent's dimensions. This approach is useful for responsive layouts that adapt to different container sizes.

```typescript highlight-percent-position
  // Create another block and position it using percentage mode
  const block2 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block2);

  // Set position mode to Percent and use percentage values
  engine.block.setPositionXMode(block2, 'Percent');
  engine.block.setPositionYMode(block2, 'Percent');
  engine.block.setPositionX(block2, 0.5); // 50% from left
  engine.block.setPositionY(block2, 0.1); // 10% from top

  // Query the position mode
  const xMode = engine.block.getPositionXMode(block2);
  const yMode = engine.block.getPositionYMode(block2);
  console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);
```

Position modes are set using `engine.block.setPositionXMode()` and `engine.block.setPositionYMode()`. When set to `'Percent'`, position values represent a fraction of the parent's size (0.5 = 50%). Query the current mode with `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`.

### Using the Convenience Method

CE.SDK provides a convenience method that sets both coordinates at once, optionally with a position mode.

```typescript highlight-setPosition-convenience
  // Create a third block and use the convenience method
  const block3 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block3);

  // Set both X and Y at once with a specific position mode
  engine.block.setPosition(block3, 0.75, 0.1, { positionMode: 'Percent' });
  console.log(
    'Block 3 set to 75% horizontal, 10% vertical using setPosition()'
  );
```

The `engine.block.setPosition()` method accepts X and Y values along with an optional `positionMode` parameter. This simplifies code when setting both coordinates simultaneously.

## Aligning Blocks

### Aligning Multiple Blocks

Multiple blocks can be aligned within their combined bounding box. This is useful for creating visually organized layouts.

```typescript highlight-check-alignable
// Check if blocks can be aligned
const canAlign = engine.block.isAlignable(alignBlocks);
console.log('Can align blocks:', canAlign);
```

Before aligning, we check if the blocks can be aligned using `engine.block.isAlignable()`. This method returns `true` if the blocks support alignment operations.

```typescript highlight-align-horizontal
// Align blocks horizontally to the left edge of their bounding box
engine.block.alignHorizontally(alignBlocks, 'Left');
console.log('Blocks aligned to left edge');
```

The `engine.block.alignHorizontally()` method accepts an array of block IDs and an alignment value: `'Left'`, `'Right'`, or `'Center'`. Similarly, `engine.block.alignVertically()` accepts `'Top'`, `'Bottom'`, or `'Center'`.

### Aligning a Single Block to Parent

When you pass a single block to the alignment methods, it aligns within its parent container rather than a group bounding box.

```typescript highlight-align-single-block
  // Create a single block to demonstrate aligning within parent
  const singleBlock = await engine.block.addImage(imageUri, {
    size: { width: 120, height: 80 }
  });
  engine.block.appendChild(page, singleBlock);

  // Position initially off-center
  engine.block.setPositionX(singleBlock, 500);
  engine.block.setPositionY(singleBlock, 450);

  // Align single block to center of parent (page)
  if (engine.block.isAlignable([singleBlock])) {
    engine.block.alignHorizontally([singleBlock], 'Center');
    engine.block.alignVertically([singleBlock], 'Bottom');
    console.log('Single block centered horizontally and aligned to bottom');
  }
```

This approach is useful for centering elements on a page or positioning them at specific edges of the container.

## Distributing Blocks

Distribution spaces blocks evenly within their bounding box. This is ideal for creating consistent spacing in grid layouts or navigation elements.

```typescript highlight-check-distributable
// Check if blocks can be distributed
const canDistribute = engine.block.isDistributable(distributeBlocks);
console.log('Can distribute blocks:', canDistribute);
```

The `engine.block.isDistributable()` method verifies that the blocks can be distributed.

```typescript highlight-distribute-horizontal
// Distribute blocks horizontally with even spacing
engine.block.distributeHorizontally(distributeBlocks);
console.log('Blocks distributed horizontally with even spacing');
```

The `engine.block.distributeHorizontally()` method arranges blocks so the horizontal space between them is equal. The first and last blocks remain in place while the middle blocks are repositioned.

```typescript highlight-distribute-vertical
  // Create another set of blocks for vertical distribution
  const verticalBlocks: number[] = [];
  const yPositions = [280, 350, 420, 520];

  for (let i = 0; i < yPositions.length; i++) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 60, height: 50 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, 700);
    engine.block.setPositionY(block, yPositions[i]);
    verticalBlocks.push(block);
  }

  if (engine.block.isDistributable(verticalBlocks)) {
    engine.block.distributeVertically(verticalBlocks);
    console.log('Vertical blocks distributed with even spacing');
  }
```

Similarly, `engine.block.distributeVertically()` distributes blocks with equal vertical spacing.

## Exporting Results

After positioning and aligning your blocks, export the result to a file.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/position-and-align.png', buffer);
  console.log('\nExported to output/position-and-align.png');
```

## Troubleshooting

### Position Not Updating

If a block's position doesn't change after calling the setter methods:

- Verify the block's transform is not locked with `engine.block.isTransformLocked()`
- Check that the block has the `'layer/move'` scope enabled
- Ensure you're using the correct position mode for your values

### Alignment Not Working

If `engine.block.alignHorizontally()` or `engine.block.alignVertically()` has no effect:

- Confirm `engine.block.isAlignable()` returns `true` for the blocks
- Verify all block IDs in the array are valid
- Check that blocks have the `'layer/move'` scope enabled

### Blocks Cannot Be Distributed

If `engine.block.distributeHorizontally()` or `engine.block.distributeVertically()` doesn't work:

- Verify `engine.block.isDistributable()` returns `true`
- Ensure you have at least three blocks in the array
- Check that all blocks share the same parent

## API Reference

| Method                                              | Description                                    |
| --------------------------------------------------- | ---------------------------------------------- |
| `engine.block.getPositionX(id)`                     | Get block's X position                         |
| `engine.block.getPositionY(id)`                     | Get block's Y position                         |
| `engine.block.setPositionX(id, value)`              | Set block's X position                         |
| `engine.block.setPositionY(id, value)`              | Set block's Y position                         |
| `engine.block.getPositionXMode(id)`                 | Get X position mode (Absolute/Percent)         |
| `engine.block.getPositionYMode(id)`                 | Get Y position mode (Absolute/Percent)         |
| `engine.block.setPositionXMode(id, mode)`           | Set X position mode                            |
| `engine.block.setPositionYMode(id, mode)`           | Set Y position mode                            |
| `engine.block.setPosition(id, x, y, options)`       | Set both coordinates with optional mode        |
| `engine.block.isAlignable(ids)`                     | Check if blocks can be aligned                 |
| `engine.block.alignHorizontally(ids, alignment)`    | Align blocks horizontally (Left/Right/Center)  |
| `engine.block.alignVertically(ids, alignment)`      | Align blocks vertically (Top/Bottom/Center)    |
| `engine.block.isDistributable(ids)`                 | Check if blocks can be distributed             |
| `engine.block.distributeHorizontally(ids)`          | Distribute blocks horizontally with even spacing |
| `engine.block.distributeVertically(ids)`            | Distribute blocks vertically with even spacing |

## Next Steps

Now that you understand positioning and alignment, explore related layout features:

- [Layer Management](./create-composition/layer-management.md) - Control the stacking order of elements
- [Grouping](./create-composition/group-and-ungroup.md) - Group related elements together
- [Multi-Page Layouts](./create-composition/multi-page.md) - Create multi-page designs with multiple pages in a single scene



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support