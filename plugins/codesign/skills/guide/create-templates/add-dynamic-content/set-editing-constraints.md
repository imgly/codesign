> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Dynamic Content](./create-templates/add-dynamic-content.md) > [Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md)

---

Control what users can edit in templates by setting fine-grained permissions on individual blocks or globally across your scene using CE.SDK's Scope system in headless Node.js environments.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

Editing constraints in CE.SDK allow you to lock specific properties of design elements programmatically from your server or Node.js application. The Scope system provides granular control over 20+ editing capabilities including movement, resizing, rotation, fill changes, text editing, and lifecycle operations.

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-set-editing-constraints-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Set Editing Constraints
 *
 * Demonstrates how to use CE.SDK's Scope system to control editing capabilities:
 * - Setting global scopes to respect block-level settings
 * - Disabling move scope to lock position
 * - Disabling lifecycle scopes to prevent deletion
 * - Checking scope states
 * - Saving constrained scenes
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Set page background color
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0,
  });

  // Set global scopes to 'Defer' to respect block-level scope settings
  // Without this, global 'Allow' settings might override block-level restrictions
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('layer/resize', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');

  // Global scope modes:
  // - 'Allow': Always allow (overrides block-level settings)
  // - 'Deny': Always deny (overrides block-level settings)
  // - 'Defer': Use block-level settings (respects setScopeEnabled)

  // Calculate layout for 4 examples (2x2 grid)
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const margin = 40;
  const spacing = 20;
  const blockWidth = (pageWidth - margin * 2 - spacing) / 2;
  const blockHeight = (pageHeight - margin * 2 - spacing) / 2;

  const getPosition = (index: number) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      x: margin + col * (blockWidth + spacing),
      y: margin + row * (blockHeight + spacing),
    };
  };

  // Helper function to create a labeled example block
  const createExampleBlock = (
    labelText: string,
    backgroundColor: { r: number; g: number; b: number },
    applyScopesCallback?: (blockId: number) => void
  ): number => {
    // Create container block
    const block = engine.block.create('graphic');
    const shape = engine.block.createShape('rect');
    engine.block.setShape(block, shape);
    engine.block.setWidth(block, blockWidth);
    engine.block.setHeight(block, blockHeight);

    // Set background color
    const fill = engine.block.createFill('color');
    engine.block.setFill(block, fill);
    engine.block.setColor(fill, 'fill/color/value', {
      ...backgroundColor,
      a: 1.0,
    });

    // Add label text
    const textBlock = engine.block.create('text');
    engine.block.setWidth(textBlock, blockWidth * 0.85);
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setString(textBlock, 'text/text', labelText);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(textBlock, 'text/fontSize', 16);

    // Append text to get dimensions
    engine.block.appendChild(block, textBlock);

    // Center text in container
    const textWidth = engine.block.getWidth(textBlock);
    const textHeight = engine.block.getHeight(textBlock);
    engine.block.setPositionX(textBlock, (blockWidth - textWidth) / 2);
    engine.block.setPositionY(textBlock, (blockHeight - textHeight) / 2);

    // Set text color to white
    const textFill = engine.block.createFill('color');
    engine.block.setFill(textBlock, textFill);
    engine.block.setColor(textFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0,
    });

    // Apply scope configuration to both blocks
    if (applyScopesCallback) {
      applyScopesCallback(block);
      applyScopesCallback(textBlock);
    }

    // Append container to page
    engine.block.appendChild(page, block);

    return block;
  };

  // ===== Example 1: All Scopes Enabled =====
  const enableAllScopes = (block: number) => {
    // Explicitly enable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);

    // Explicitly enable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', true);
    engine.block.setScopeEnabled(block, 'fill/changeType', true);

    // Explicitly enable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', true);
    engine.block.setScopeEnabled(block, 'text/character', true);
  };

  const fullyEditableBlock = createExampleBlock(
    'Fully\neditable',
    {
      r: 0.5,
      g: 0.85,
      b: 0.5,
    },
    enableAllScopes
  );
  // All scopes are explicitly enabled - users have full editing capabilities
  // This is the default behavior, but explicitly enabling shows clear intent

  // ===== Example 2: Lock Position (Disable Move Scope) =====
  const disableMoveScope = (block: number) => {
    // Disable move scope
    engine.block.setScopeEnabled(block, 'layer/move', false);

    // Explicitly enable other transform scopes
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);
  };

  const moveLockedBlock = createExampleBlock(
    'Locked\nposition',
    {
      r: 0.5,
      g: 0.75,
      b: 0.9,
    },
    disableMoveScope
  );
  // Block position is locked - users cannot move or reposition it
  // Other scopes are explicitly enabled: resizing, rotation, flipping, deletion, duplication

  // ===== Example 3: Prevent Deletion (Disable Lifecycle Scopes) =====
  const disableLifecycleScopes = (block: number) => {
    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Explicitly enable transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);
  };

  const lifecycleLockedBlock = createExampleBlock(
    'Cannot\ndelete',
    {
      r: 0.75,
      g: 0.75,
      b: 0.75,
    },
    disableLifecycleScopes
  );
  // Block cannot be deleted or duplicated
  // Other scopes are explicitly enabled: moving, resizing, rotation, flipping

  // ===== Example 4: All Scopes Disabled =====
  const disableAllScopes = (block: number) => {
    // Disable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', false);
    engine.block.setScopeEnabled(block, 'layer/resize', false);
    engine.block.setScopeEnabled(block, 'layer/rotate', false);
    engine.block.setScopeEnabled(block, 'layer/flip', false);
    engine.block.setScopeEnabled(block, 'layer/crop', false);

    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Disable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', false);
    engine.block.setScopeEnabled(block, 'fill/changeType', false);
    engine.block.setScopeEnabled(block, 'stroke/change', false);

    // Disable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', false);
    engine.block.setScopeEnabled(block, 'text/character', false);

    // Disable shape scopes
    engine.block.setScopeEnabled(block, 'shape/change', false);

    // Disable editor scopes
    engine.block.setScopeEnabled(block, 'editor/select', false);

    // Disable appearance scopes
    engine.block.setScopeEnabled(block, 'layer/opacity', false);
    engine.block.setScopeEnabled(block, 'layer/blendMode', false);
    engine.block.setScopeEnabled(block, 'layer/visibility', false);
  };

  const fullyLockedBlock = createExampleBlock(
    'Fully\nlocked',
    {
      r: 0.9,
      g: 0.5,
      b: 0.5,
    },
    disableAllScopes
  );
  // All scopes are disabled - block is completely locked and cannot be edited
  // Useful for watermarks, logos, or legal disclaimers

  // ===== Block-Level Scope Setting Example =====
  // Check if a scope is enabled for a specific block
  const canMove = engine.block.isScopeEnabled(moveLockedBlock, 'layer/move');
  const canDelete = engine.block.isScopeEnabled(
    lifecycleLockedBlock,
    'lifecycle/destroy'
  );
  const canEditFully = engine.block.isScopeEnabled(
    fullyEditableBlock,
    'layer/move'
  );
  const canEditLocked = engine.block.isScopeEnabled(
    fullyLockedBlock,
    'layer/move'
  );

  // eslint-disable-next-line no-console
  console.log('Move-locked block - layer/move enabled:', canMove); // false
  // eslint-disable-next-line no-console
  console.log('Lifecycle-locked block - lifecycle/destroy enabled:', canDelete); // false
  // eslint-disable-next-line no-console
  console.log('Fully editable block - layer/move enabled:', canEditFully); // true
  // eslint-disable-next-line no-console
  console.log('Fully locked block - layer/move enabled:', canEditLocked); // false

  // Position blocks in 2x2 grid
  const blocks = [
    fullyEditableBlock,
    moveLockedBlock,
    lifecycleLockedBlock,
    fullyLockedBlock,
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Save the scene with all scope constraints preserved
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save scene to file
  const sceneData = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/constrained-scene.imgly`, sceneData);

  // eslint-disable-next-line no-console
  console.log('✓ Scene saved to output/constrained-scene.imgly');
  // eslint-disable-next-line no-console
  console.log('  All scope constraints are preserved in the scene file');

  // Export the result to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/editing-constraints-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/editing-constraints-result.png');

  // Log instructions
  // eslint-disable-next-line no-console
  console.log(`
=== Editing Constraints Demo ===

Created 4 examples demonstrating scope constraints (arranged in 2x2 grid):

Top row:
1. "Fully editable" (green): All scopes enabled - complete editing freedom
2. "Locked position" (light blue): Cannot move, but can resize/edit/delete

Bottom row:
3. "Cannot delete" (light grey): Cannot delete/duplicate, but can move/resize/edit
4. "Fully locked" (red): All scopes disabled - completely locked

Note: Global scopes are set to 'Defer' to respect block-level settings.

Files created:
- output/constrained-scene.imgly (scene with constraints)
- output/editing-constraints-result.png (visual result)
  `);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide demonstrates how to apply editing constraints in a headless environment to create templates that can be adopted and used with predefined limitations, ensuring brand consistency and design integrity.

## Understanding Scopes

### What are Scopes?

A scope is a permission key that controls a specific editing capability in CE.SDK. Each scope represents a distinct action users can perform, such as moving blocks (`'layer/move'`), changing fills (`'fill/change'`), or editing text content (`'text/edit'`). By enabling or disabling scopes, you control exactly what users can and cannot do with each design element.

Scopes exist at two levels:

- **Block-level scopes**: Per-block permissions set using `setScopeEnabled()`
- **Global scopes**: Default behavior for all blocks set using `setGlobalScope()`

### Available Scope Categories

CE.SDK provides scopes organized into logical categories:

| Category | Purpose | Example Scopes |
| --- | --- | --- |
| **Text Editing** | Control text content and formatting | `text/edit`, `text/character` |
| **Fill & Stroke** | Manage colors and gradients | `fill/change`, `fill/changeType`, `stroke/change` |
| **Shape** | Modify shape properties | `shape/change` |
| **Layer Transform** | Control position and dimensions | `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`, `layer/crop` |
| **Layer Appearance** | Manage visual properties | `layer/opacity`, `layer/blendMode`, `layer/visibility` |
| **Effects & Filters** | Apply visual effects | `appearance/adjustments`, `appearance/filter`, `appearance/effect`, `appearance/blur`, `appearance/shadow` |
| **Lifecycle** | Control creation and deletion | `lifecycle/destroy`, `lifecycle/duplicate` |
| **Editor** | Manage scene-level actions | `editor/add`, `editor/select` |

## Scope Configuration

### Global Scope Modes

Global scopes set the default behavior for all blocks in the scene. They have three modes:

- **Allow**: Always allow the action, overriding block-level settings
- **Deny**: Always deny the action, overriding block-level settings
- **Defer**: Use block-level settings (default mode)

To ensure block-level scope settings are respected, set relevant global scopes to 'Defer'. Without setting global scopes to 'Defer', default 'Allow' settings might override your block-level restrictions. This is essential when applying fine-grained constraints.

### Scope Resolution Priority

When both global and block-level scopes are set, they resolve in this order:

1. **Global Deny** takes highest priority (action always denied)
2. **Global Allow** takes second priority (action always allowed)
3. **Global Defer** defers to block-level settings (default behavior)

## Setting Block-Level Constraints

### Locking Position

Prevent users from moving or repositioning a block while allowing other edits:

```typescript highlight=highlight-disable-move-scope
  const disableMoveScope = (block: number) => {
    // Disable move scope
    engine.block.setScopeEnabled(block, 'layer/move', false);

    // Explicitly enable other transform scopes
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);
  };

  const moveLockedBlock = createExampleBlock(
    'Locked\nposition',
    {
      r: 0.5,
      g: 0.75,
      b: 0.9,
    },
    disableMoveScope
  );
  // Block position is locked - users cannot move or reposition it
  // Other scopes are explicitly enabled: resizing, rotation, flipping, deletion, duplication
```

The block position is locked—users cannot move or reposition it. Other scopes remain enabled, allowing resizing, editing, and deletion. This pattern maintains layout integrity while allowing content updates.

### Preventing Deletion

Protect blocks from being deleted or duplicated:

```typescript highlight=highlight-disable-lifecycle-scopes
  const disableLifecycleScopes = (block: number) => {
    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Explicitly enable transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);
  };

  const lifecycleLockedBlock = createExampleBlock(
    'Cannot\ndelete',
    {
      r: 0.75,
      g: 0.75,
      b: 0.75,
    },
    disableLifecycleScopes
  );
  // Block cannot be deleted or duplicated
  // Other scopes are explicitly enabled: moving, resizing, rotation, flipping
```

Users cannot delete or duplicate the block but can still move, resize, and edit it. Use this for essential template elements that must remain present.

### Enabling All Scopes

Allow complete editing freedom by explicitly enabling all scopes:

```typescript highlight=highlight-enable-all-scopes
  const enableAllScopes = (block: number) => {
    // Explicitly enable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);

    // Explicitly enable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', true);
    engine.block.setScopeEnabled(block, 'fill/changeType', true);

    // Explicitly enable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', true);
    engine.block.setScopeEnabled(block, 'text/character', true);
  };

  const fullyEditableBlock = createExampleBlock(
    'Fully\neditable',
    {
      r: 0.5,
      g: 0.85,
      b: 0.5,
    },
    enableAllScopes
  );
  // All scopes are explicitly enabled - users have full editing capabilities
  // This is the default behavior, but explicitly enabling shows clear intent
```

All scopes are explicitly enabled, providing users with full editing capabilities. While this is the default behavior, explicitly enabling shows clear intent.

### Disabling All Scopes

Create completely locked blocks by disabling all editing capabilities:

```typescript highlight=highlight-disable-all-scopes
  const disableAllScopes = (block: number) => {
    // Disable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', false);
    engine.block.setScopeEnabled(block, 'layer/resize', false);
    engine.block.setScopeEnabled(block, 'layer/rotate', false);
    engine.block.setScopeEnabled(block, 'layer/flip', false);
    engine.block.setScopeEnabled(block, 'layer/crop', false);

    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Disable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', false);
    engine.block.setScopeEnabled(block, 'fill/changeType', false);
    engine.block.setScopeEnabled(block, 'stroke/change', false);

    // Disable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', false);
    engine.block.setScopeEnabled(block, 'text/character', false);

    // Disable shape scopes
    engine.block.setScopeEnabled(block, 'shape/change', false);

    // Disable editor scopes
    engine.block.setScopeEnabled(block, 'editor/select', false);

    // Disable appearance scopes
    engine.block.setScopeEnabled(block, 'layer/opacity', false);
    engine.block.setScopeEnabled(block, 'layer/blendMode', false);
    engine.block.setScopeEnabled(block, 'layer/visibility', false);
  };

  const fullyLockedBlock = createExampleBlock(
    'Fully\nlocked',
    {
      r: 0.9,
      g: 0.5,
      b: 0.5,
    },
    disableAllScopes
  );
  // All scopes are disabled - block is completely locked and cannot be edited
  // Useful for watermarks, logos, or legal disclaimers
```

All scopes are disabled, making the block completely locked and uneditable. Useful for watermarks, logos, or legal disclaimers that must remain unchanged.

## Configuring Global Scopes

### Setting Global Scope Modes

Configure global scopes to control default behavior across all blocks:

```typescript highlight=highlight-global-scopes
  // Set global scopes to 'Defer' to respect block-level scope settings
  // Without this, global 'Allow' settings might override block-level restrictions
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('layer/resize', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');

  // Global scope modes:
  // - 'Allow': Always allow (overrides block-level settings)
  // - 'Deny': Always deny (overrides block-level settings)
  // - 'Defer': Use block-level settings (respects setScopeEnabled)
```

Setting global scopes to 'Defer' ensures block-level scope settings are respected. Without this, default 'Allow' settings might override your block-level restrictions.

## Checking Scope State

### Checking Block-Level Scopes

Query the current state of any scope for a block:

```typescript highlight=highlight-block-level-scope-check
  // Check if a scope is enabled for a specific block
  const canMove = engine.block.isScopeEnabled(moveLockedBlock, 'layer/move');
  const canDelete = engine.block.isScopeEnabled(
    lifecycleLockedBlock,
    'lifecycle/destroy'
  );
  const canEditFully = engine.block.isScopeEnabled(
    fullyEditableBlock,
    'layer/move'
  );
  const canEditLocked = engine.block.isScopeEnabled(
    fullyLockedBlock,
    'layer/move'
  );

  // eslint-disable-next-line no-console
  console.log('Move-locked block - layer/move enabled:', canMove); // false
  // eslint-disable-next-line no-console
  console.log('Lifecycle-locked block - lifecycle/destroy enabled:', canDelete); // false
  // eslint-disable-next-line no-console
  console.log('Fully editable block - layer/move enabled:', canEditFully); // true
  // eslint-disable-next-line no-console
  console.log('Fully locked block - layer/move enabled:', canEditLocked); // false
```

Use `isScopeEnabled()` to check the block-level setting. This returns whether the scope is enabled at the block level, but doesn't consider global scope settings.

### Checking Effective Permissions

Check the effective permission considering both block and global settings:

```typescript
// Check if scope is allowed (considers global + block settings)
const moveAllowed = engine.block.isAllowedByScope(block, 'layer/move');
```

`isAllowedByScope()` returns the final permission after resolving block-level and global scope settings. Use this when you need to know if an action is actually permitted.

## Saving Constrained Scenes

Scope constraints are preserved when saving scenes:

```typescript highlight=highlight-save-constrained-scene
  // Save the scene with all scope constraints preserved
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save scene to file
  const sceneData = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/constrained-scene.imgly`, sceneData);

  // eslint-disable-next-line no-console
  console.log('✓ Scene saved to output/constrained-scene.imgly');
  // eslint-disable-next-line no-console
  console.log('  All scope constraints are preserved in the scene file');
```

When this scene is loaded in a browser or client application, all scope constraints will be maintained. This allows you to:

1. Create templates server-side with predefined constraints
2. Save them to your storage/database
3. Load them client-side with constraints already applied
4. Ensure users can only edit allowed properties

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.setScopeEnabled()` | Enable or disable a scope for a specific block |
| `engine.block.isScopeEnabled()` | Check if a scope is enabled at the block level |
| `engine.block.isAllowedByScope()` | Check if a scope is allowed considering both block and global settings |
| `engine.editor.setGlobalScope()` | Set global scope policy (`'Allow'`, `'Deny'`, or `'Defer'`) |
| `engine.editor.findAllScopes()` | List all available scope keys |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support