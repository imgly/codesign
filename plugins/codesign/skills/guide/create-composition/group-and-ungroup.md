> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Group and Ungroup Objects](./create-composition/group-and-ungroup.md)

---

Group multiple blocks to move, scale, and transform them as a single unit; ungroup to edit them individually.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-grouping-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-grouping-server-js)

Groups let you treat multiple blocks as a cohesive unit. Grouped blocks move, scale, and rotate together while maintaining their relative positions. Groups can contain other groups, enabling hierarchical compositions.

> **Note:** Groups are not currently available when editing videos.

```typescript file=@cesdk_web_examples/guides-create-composition-grouping-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Group and Ungroup Objects
 *
 * Demonstrates:
 * - Creating multiple graphic blocks
 * - Checking if blocks can be grouped
 * - Grouping blocks together
 * - Finding and inspecting groups
 * - Ungrouping blocks
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];
  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);

  // Create a graphic block with a colored rectangle shape
  const block1 = engine.block.create('graphic');
  const shape1 = engine.block.createShape('rect');
  engine.block.setShape(block1, shape1);
  engine.block.setWidth(block1, 120);
  engine.block.setHeight(block1, 120);
  engine.block.setPositionX(block1, 200);
  engine.block.setPositionY(block1, 240);
  const fill1 = engine.block.createFill('color');
  engine.block.setColor(fill1, 'fill/color/value', {
    r: 0.4,
    g: 0.6,
    b: 0.9,
    a: 1.0,
  });
  engine.block.setFill(block1, fill1);
  engine.block.appendChild(page, block1);

  // Create two more blocks for grouping
  const block2 = engine.block.create('graphic');
  const shape2 = engine.block.createShape('rect');
  engine.block.setShape(block2, shape2);
  engine.block.setWidth(block2, 120);
  engine.block.setHeight(block2, 120);
  engine.block.setPositionX(block2, 340);
  engine.block.setPositionY(block2, 240);
  const fill2 = engine.block.createFill('color');
  engine.block.setColor(fill2, 'fill/color/value', {
    r: 0.9,
    g: 0.5,
    b: 0.4,
    a: 1.0,
  });
  engine.block.setFill(block2, fill2);
  engine.block.appendChild(page, block2);

  const block3 = engine.block.create('graphic');
  const shape3 = engine.block.createShape('rect');
  engine.block.setShape(block3, shape3);
  engine.block.setWidth(block3, 120);
  engine.block.setHeight(block3, 120);
  engine.block.setPositionX(block3, 480);
  engine.block.setPositionY(block3, 240);
  const fill3 = engine.block.createFill('color');
  engine.block.setColor(fill3, 'fill/color/value', {
    r: 0.5,
    g: 0.8,
    b: 0.5,
    a: 1.0,
  });
  engine.block.setFill(block3, fill3);
  engine.block.appendChild(page, block3);

  // Check if the blocks can be grouped together
  const canGroup = engine.block.isGroupable([block1, block2, block3]);
  // eslint-disable-next-line no-console
  console.log('Blocks can be grouped:', canGroup);

  // Group the blocks together
  let groupId: number | null = null;
  if (canGroup) {
    groupId = engine.block.group([block1, block2, block3]);
    // eslint-disable-next-line no-console
    console.log('Created group with ID:', groupId);

    // Find all groups in the scene
    const allGroups = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Number of groups in scene:', allGroups.length);

    // Check the type of the group block
    const groupType = engine.block.getType(groupId);
    // eslint-disable-next-line no-console
    console.log('Group block type:', groupType);

    // Get the members of the group
    const members = engine.block.getChildren(groupId);
    // eslint-disable-next-line no-console
    console.log('Group has', members.length, 'members');

    // Ungroup the blocks to make them independent again
    engine.block.ungroup(groupId);
    // eslint-disable-next-line no-console
    console.log('Ungrouped blocks');

    // Verify blocks are no longer in a group
    const groupsAfterUngroup = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Groups after ungrouping:', groupsAfterUngroup.length);

    // Re-group for the final export
    groupId = engine.block.group([block1, block2, block3]);
  }

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/grouping-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/grouping-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to check if blocks can be grouped, create and dissolve groups, find existing groups in a scene, and export the result.

## Understanding Groups

Groups are blocks with type `'group'` that contain child blocks as members. Transformations applied to a group affect all members proportionally—position, scale, and rotation cascade to all children.

Groups can be nested, meaning a group can contain other groups. This enables complex hierarchical structures where multiple logical units can be combined and manipulated together.

> **Note:** **What cannot be grouped*** Scene blocks cannot be grouped
> * Blocks already part of a group cannot be grouped again until ungrouped

## Create the Blocks

Create several graphic blocks that we'll group together. Each block has a different color fill to make them visually distinct.

```typescript highlight=highlight-create-blocks
// Create a graphic block with a colored rectangle shape
const block1 = engine.block.create('graphic');
const shape1 = engine.block.createShape('rect');
engine.block.setShape(block1, shape1);
engine.block.setWidth(block1, 120);
engine.block.setHeight(block1, 120);
engine.block.setPositionX(block1, 200);
engine.block.setPositionY(block1, 240);
const fill1 = engine.block.createFill('color');
engine.block.setColor(fill1, 'fill/color/value', {
  r: 0.4,
  g: 0.6,
  b: 0.9,
  a: 1.0,
});
engine.block.setFill(block1, fill1);
engine.block.appendChild(page, block1);
```

## Check If Blocks Can Be Grouped

Before grouping, verify that the selected blocks can be grouped using `engine.block.isGroupable()`. This method returns `true` if all blocks can be grouped together, or `false` if any block is a scene or already belongs to a group.

```typescript highlight=highlight-check-groupable
// Check if the blocks can be grouped together
const canGroup = engine.block.isGroupable([block1, block2, block3]);
// eslint-disable-next-line no-console
console.log('Blocks can be grouped:', canGroup);
```

## Create a Group

Use `engine.block.group()` to combine multiple blocks into a new group. The method returns the ID of the newly created group block. The group inherits the combined bounding box of its members.

```typescript highlight=highlight-create-group
// Group the blocks together
let groupId: number | null = null;
if (canGroup) {
  groupId = engine.block.group([block1, block2, block3]);
  // eslint-disable-next-line no-console
  console.log('Created group with ID:', groupId);
```

## Find and Inspect Groups

Discover groups in a scene and inspect their contents using `engine.block.findByType()`, `engine.block.getType()`, and `engine.block.getChildren()`.

```typescript highlight=highlight-find-groups
    // Find all groups in the scene
    const allGroups = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Number of groups in scene:', allGroups.length);

    // Check the type of the group block
    const groupType = engine.block.getType(groupId);
    // eslint-disable-next-line no-console
    console.log('Group block type:', groupType);

    // Get the members of the group
    const members = engine.block.getChildren(groupId);
    // eslint-disable-next-line no-console
    console.log('Group has', members.length, 'members');
```

Use `engine.block.findByType('group')` to get all group blocks in the current scene. Use `engine.block.getType()` to check if a specific block is a group (returns `'//ly.img.ubq/group'`). Use `engine.block.getChildren()` to get the member blocks of a group.

## Ungroup Blocks

Use `engine.block.ungroup()` to dissolve a group and release its children back to the parent container. The children maintain their current positions in the scene.

```typescript highlight=highlight-ungroup
    // Ungroup the blocks to make them independent again
    engine.block.ungroup(groupId);
    // eslint-disable-next-line no-console
    console.log('Ungrouped blocks');

    // Verify blocks are no longer in a group
    const groupsAfterUngroup = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Groups after ungrouping:', groupsAfterUngroup.length);
```

## Export the Result

After creating the composition, export the page to a PNG file. The engine supports various export formats including PNG, JPEG, and PDF.

```typescript highlight=highlight-export
  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/grouping-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/grouping-result.png');
```

## Cleanup

Always dispose the engine when finished to free system resources. Using a try/finally block ensures cleanup happens even if errors occur.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Blocks Cannot Be Grouped

If `engine.block.isGroupable()` returns `false`:

- Check if any of the blocks is a scene block (scenes cannot be grouped)
- Check if any block is already part of a group (use `engine.block.getParent()` to verify)
- Ensure all block IDs are valid

### Group Not Visible After Creation

If a newly created group is not visible:

- Check that the member blocks were visible before grouping
- Verify the group's opacity using `engine.block.getOpacity()`

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.isGroupable(ids)` | Check if blocks can be grouped together |
| `engine.block.group(ids)` | Create a group from multiple blocks |
| `engine.block.ungroup(id)` | Dissolve a group and release its children |
| `engine.block.findByType(type)` | Find all blocks of a specific type |
| `engine.block.getType(id)` | Get the type string of a block |
| `engine.block.getParent(id)` | Get the parent block |
| `engine.block.getChildren(id)` | Get child blocks of a container |
| `engine.block.export(block, options)` | Export a block to an image or document |
| `engine.dispose()` | Free engine resources |

## Next Steps

Explore related topics:

- [Layer Management](./create-composition/layer-management.md) - Control z-order and visibility of blocks
- [Position and Align](./create-composition/position-and-align.md) - Arrange blocks precisely on the canvas
- [Lock Design](./create-composition/lock-design.md) - Prevent modifications to specific elements



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support