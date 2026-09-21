> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Lock Design](./create-composition/lock-design.md)

---

Protect design elements from unwanted modifications using CE.SDK's scope-based permission system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-composition-lock-design-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-composition-lock-design-server-js)

CE.SDK uses a two-layer scope system to control editing permissions. Global scopes set defaults for the entire scene, while block-level scopes override when the global setting is `Defer`. This enables flexible permission models from fully locked to selectively editable designs.

```typescript file=@cesdk_web_examples/guides-create-composition-lock-design-server-js/server-js.ts reference-only
import CreativeEngine, { type Scope } from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config(); // Load .env file

async function lockDesignExample() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create scene with page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0]!;

    // Create sample content to demonstrate different locking techniques
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Column 1: Fully Locked
    const caption1 = engine.block.create('text');
    engine.block.setString(caption1, 'text/text', 'Fully Locked');
    engine.block.setFloat(caption1, 'text/fontSize', 32);
    engine.block.setWidth(caption1, 220);
    engine.block.setHeight(caption1, 50);
    engine.block.setPositionX(caption1, 30);
    engine.block.setPositionY(caption1, 30);
    engine.block.appendChild(page, caption1);

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 30,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, imageBlock);

    // Column 2: Text Editing Only
    const caption2 = engine.block.create('text');
    engine.block.setString(caption2, 'text/text', 'Text Editing');
    engine.block.setFloat(caption2, 'text/fontSize', 32);
    engine.block.setWidth(caption2, 220);
    engine.block.setHeight(caption2, 50);
    engine.block.setPositionX(caption2, 290);
    engine.block.setPositionY(caption2, 30);
    engine.block.appendChild(page, caption2);

    const textBlock = engine.block.create('text');
    engine.block.setString(textBlock, 'text/text', 'Edit Me');
    engine.block.setFloat(textBlock, 'text/fontSize', 72);
    engine.block.setWidth(textBlock, 220);
    engine.block.setHeight(textBlock, 165);
    engine.block.setPositionX(textBlock, 290);
    engine.block.setPositionY(textBlock, 100);
    engine.block.appendChild(page, textBlock);

    // Column 3: Image Replace Only
    const caption3 = engine.block.create('text');
    engine.block.setString(caption3, 'text/text', 'Image Replace');
    engine.block.setFloat(caption3, 'text/fontSize', 32);
    engine.block.setWidth(caption3, 220);
    engine.block.setHeight(caption3, 50);
    engine.block.setPositionX(caption3, 550);
    engine.block.setPositionY(caption3, 30);
    engine.block.appendChild(page, caption3);

    const placeholderBlock = await engine.block.addImage(imageUri, {
      x: 550,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, placeholderBlock);

    // Lock the entire design by setting all scopes to Deny
    const scopes = engine.editor.findAllScopes();
    for (const scope of scopes) {
      engine.editor.setGlobalScope(scope, 'Deny');
    }

    // Enable selection for specific blocks
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'editor/select', true);
    engine.block.setScopeEnabled(placeholderBlock, 'editor/select', true);

    // Enable text editing on the text block
    engine.editor.setGlobalScope('text/edit', 'Defer');
    engine.editor.setGlobalScope('text/character', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'text/edit', true);
    engine.block.setScopeEnabled(textBlock, 'text/character', true);

    // Enable image replacement on the placeholder block
    engine.editor.setGlobalScope('fill/change', 'Defer');
    engine.block.setScopeEnabled(placeholderBlock, 'fill/change', true);

    // Check if operations are permitted on blocks
    const canEditText = engine.block.isAllowedByScope(textBlock, 'text/edit');
    const canMoveImage = engine.block.isAllowedByScope(
      imageBlock,
      'layer/move'
    );
    const canReplacePlaceholder = engine.block.isAllowedByScope(
      placeholderBlock,
      'fill/change'
    );

    console.log('Permission status:');
    console.log('- Can edit text:', canEditText); // true
    console.log('- Can move locked image:', canMoveImage); // false
    console.log('- Can replace placeholder:', canReplacePlaceholder); // true

    // Discover all available scopes
    const allScopes: Scope[] = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);

    // Check global scope settings
    const textEditGlobal = engine.editor.getGlobalScope('text/edit');
    const layerMoveGlobal = engine.editor.getGlobalScope('layer/move');
    console.log('Global text/edit:', textEditGlobal); // 'Defer'
    console.log('Global layer/move:', layerMoveGlobal); // 'Deny'

    // Check block-level scope settings
    const textEditEnabled = engine.block.isScopeEnabled(textBlock, 'text/edit');
    console.log('Text block text/edit enabled:', textEditEnabled); // true

    // Export the scene to demonstrate the design
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output', { recursive: true });
    }

    writeFileSync('./output/locked-design.png', buffer);
    console.log('Design exported to ./output/locked-design.png');

  } finally {
    engine.dispose();
  }
}

lockDesignExample().catch(console.error);
```

This guide covers how to lock entire designs, selectively enable specific editing capabilities, and check permissions programmatically in a server environment.

## Understanding the Scope Permission Model

Scopes control what operations can be performed on design elements. CE.SDK combines global scope settings with block-level settings to determine the final permission.

| Global Scope | Block Scope | Result    |
| ------------ | ----------- | --------- |
| `Allow`      | any         | Permitted |
| `Deny`       | any         | Blocked   |
| `Defer`      | enabled     | Permitted |
| `Defer`      | disabled    | Blocked   |

Global scopes have three possible values:

- **`Allow`**: The operation is always permitted, regardless of block-level settings
- **`Deny`**: The operation is always blocked, regardless of block-level settings
- **`Defer`**: The permission depends on the block-level scope setting

Block-level scopes are binary: enabled or disabled. They only take effect when the global scope is set to `Defer`.

## Locking an Entire Design

To lock all editing operations, iterate through all available scopes and set each to `Deny`. We use `engine.editor.findAllScopes()` to discover all scope names dynamically.

```typescript highlight=highlight-lock-entire-design
// Lock the entire design by setting all scopes to Deny
const scopes = engine.editor.findAllScopes();
for (const scope of scopes) {
  engine.editor.setGlobalScope(scope, 'Deny');
}
```

When all scopes are set to `Deny`, any operations on the design would be blocked. This is useful for creating protected templates that users cannot modify.

## Enabling Selection for Interactive Blocks

Before users can interact with any block through an application, you must enable the `editor/select` scope. Without selection enabled, blocks cannot be accessed programmatically for editing.

```typescript highlight=highlight-enable-selection
// Enable selection for specific blocks
engine.editor.setGlobalScope('editor/select', 'Defer');
engine.block.setScopeEnabled(textBlock, 'editor/select', true);
engine.block.setScopeEnabled(placeholderBlock, 'editor/select', true);
```

Setting the global `editor/select` scope to `Defer` delegates the decision to each block. We then enable selection only on the specific blocks that should be modifiable.

## Selective Locking Patterns

Lock everything first, then selectively enable specific capabilities on chosen blocks. This pattern provides fine-grained control over what can be modified.

### Text-Only Editing

To allow text content editing while protecting everything else, enable the `text/edit` scope. For text styling changes like font, size, and color, also enable `text/character`.

```typescript highlight=highlight-text-editing
// Enable text editing on the text block
engine.editor.setGlobalScope('text/edit', 'Defer');
engine.editor.setGlobalScope('text/character', 'Defer');
engine.block.setScopeEnabled(textBlock, 'text/edit', true);
engine.block.setScopeEnabled(textBlock, 'text/character', true);
```

Only the designated text block can have its content modified while other properties remain locked.

### Image Replacement

To allow image replacement while protecting layout and position, enable the `fill/change` scope on placeholder blocks.

```typescript highlight=highlight-image-replacement
// Enable image replacement on the placeholder block
engine.editor.setGlobalScope('fill/change', 'Defer');
engine.block.setScopeEnabled(placeholderBlock, 'fill/change', true);
```

The image content can be replaced but the block's position, dimensions, and other properties remain locked.

## Checking Permissions

Verify whether operations are permitted using `engine.block.isAllowedByScope()`. This method evaluates both global and block-level settings to return the effective permission state.

```typescript highlight=highlight-check-permissions
    // Check if operations are permitted on blocks
    const canEditText = engine.block.isAllowedByScope(textBlock, 'text/edit');
    const canMoveImage = engine.block.isAllowedByScope(
      imageBlock,
      'layer/move'
    );
    const canReplacePlaceholder = engine.block.isAllowedByScope(
      placeholderBlock,
      'fill/change'
    );

    console.log('Permission status:');
    console.log('- Can edit text:', canEditText); // true
    console.log('- Can move locked image:', canMoveImage); // false
    console.log('- Can replace placeholder:', canReplacePlaceholder); // true
```

The distinction between checking methods is:

- `isAllowedByScope()` returns the **effective permission** after evaluating all scope levels
- `isScopeEnabled()` returns only the **block-level setting**
- `getGlobalScope()` returns only the **global setting**

## Discovering Available Scopes

To work with scopes programmatically, you can discover all available scope names and check their current settings.

```typescript highlight=highlight-get-scopes
    // Discover all available scopes
    const allScopes: Scope[] = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);

    // Check global scope settings
    const textEditGlobal = engine.editor.getGlobalScope('text/edit');
    const layerMoveGlobal = engine.editor.getGlobalScope('layer/move');
    console.log('Global text/edit:', textEditGlobal); // 'Defer'
    console.log('Global layer/move:', layerMoveGlobal); // 'Deny'

    // Check block-level scope settings
    const textEditEnabled = engine.block.isScopeEnabled(textBlock, 'text/edit');
    console.log('Text block text/edit enabled:', textEditEnabled); // true
```

## Cleanup

Always dispose the engine when finished to release resources.

```typescript highlight=highlight-cleanup
} finally {
  engine.dispose();
}
```

## Available Scopes Reference

| Scope                    | Description                             |
| ------------------------ | --------------------------------------- |
| `layer/move`             | Move block position                     |
| `layer/resize`           | Resize block dimensions                 |
| `layer/rotate`           | Rotate block                            |
| `layer/flip`             | Flip block horizontally or vertically   |
| `layer/crop`             | Crop block content                      |
| `layer/opacity`          | Change block opacity                    |
| `layer/blendMode`        | Change blend mode                       |
| `layer/visibility`       | Toggle block visibility                 |
| `layer/clipping`         | Change clipping behavior                |
| `fill/change`            | Change fill content                     |
| `fill/changeType`        | Change fill type                        |
| `stroke/change`          | Change stroke properties                |
| `shape/change`           | Change shape type                       |
| `text/edit`              | Edit text content                       |
| `text/character`         | Change text styling (font, size, color) |
| `appearance/adjustments` | Change color adjustments                |
| `appearance/filter`      | Apply or change filters                 |
| `appearance/effect`      | Apply or change effects                 |
| `appearance/blur`        | Apply or change blur                    |
| `appearance/shadow`      | Apply or change shadows                 |
| `appearance/animation`   | Apply or change animations              |
| `lifecycle/destroy`      | Delete the block                        |
| `lifecycle/duplicate`    | Duplicate the block                     |
| `editor/add`             | Add new blocks                          |
| `editor/select`          | Select blocks                           |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support