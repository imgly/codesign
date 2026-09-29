> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Editing Workflow](./concepts/editing-workflow.md)

---

CE.SDK controls editing access through roles and scopes, enabling template workflows where designers create locked layouts and end-users customize only permitted elements.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)

CE.SDK uses a two-tier permission system: **roles** define user types with preset permissions, while **scopes** control specific capabilities. This enables workflows where templates can be prepared by designers and safely customized by end-users.

```typescript file=@cesdk_web_examples/guides-concepts-editing-workflow-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    engine.scene.create('VerticalStack');
    const page = engine.block.findByType('page')[0];

    // Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
    const role = engine.editor.getRole();
    console.log('Current role:', role); // 'Creator'

    // Global scopes: 'Allow', 'Deny', or 'Defer' (to block-level)
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

    // Create a block and lock it
    const block = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      block,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 100);
    engine.block.appendChild(page, block);

    // Lock the block - Adopters cannot select, move, or delete it
    engine.block.setScopeEnabled(block, 'editor/select', false);
    engine.block.setScopeEnabled(block, 'layer/move', false);
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);

    // Check resolved permissions (role + global + block scopes)
    const canMoveAsCreator = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Creator can move:', canMoveAsCreator); // true

    engine.editor.setRole('Adopter');
    const canMoveAsAdopter = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Adopter can move:', canMoveAsAdopter); // false
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers:

- The four user roles and their purposes
- How scopes control editing capabilities
- The permission resolution hierarchy
- Common template workflow patterns

## Roles

Roles define user types with different default permissions:

| Role | Purpose | Default Access |
|------|---------|----------------|
| **Creator** | Designers building templates | Full access to all operations |
| **Adopter** | End-users customizing templates | Limited by block-level scopes |
| **Viewer** | Preview-only users | Read-only access |
| **Presenter** | Slideshow/video presenters | Read-only with playback controls |

Creators set the block-level scopes that constrain what Adopters can do. This separation enables brand consistency while allowing personalization.

```typescript highlight-roles
// Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
const role = engine.editor.getRole();
console.log('Current role:', role); // 'Creator'
```

## Scopes

Scopes define specific capabilities organized into categories:

- **Text**: Editing content and character formatting
- **Fill/Stroke**: Changing colors and shapes
- **Layer**: Moving, resizing, rotating, cropping
- **Appearance**: Filters, effects, shadows, animations
- **Lifecycle**: Deleting and duplicating elements
- **Editor**: Adding new elements and selecting

## Global vs Block-Level Scopes

**Global scopes** apply editor-wide and determine whether block-level settings are checked:

- `'Allow'` — Always permit the operation
- `'Deny'` — Always block the operation
- `'Defer'` — Check block-level scope settings

**Block-level scopes** control permissions on individual blocks. These settings only take effect when the corresponding global scope is set to `'Defer'`.

```typescript highlight-global-scopes
// Global scopes: 'Allow', 'Deny', or 'Defer' (to block-level)
engine.editor.setGlobalScope('editor/select', 'Defer');
engine.editor.setGlobalScope('layer/move', 'Defer');
engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
```

To lock a specific block, disable its scopes:

```typescript highlight-block-scopes
// Lock the block - Adopters cannot select, move, or delete it
engine.block.setScopeEnabled(block, 'editor/select', false);
engine.block.setScopeEnabled(block, 'layer/move', false);
engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
```

## Permission Resolution

Permissions resolve in this order:

1. **Role defaults** — Each role has preset global scope values
2. **Global scope** — If `'Allow'` or `'Deny'`, this is the final answer
3. **Block-level scope** — If global is `'Defer'`, check the block's settings

Use `isAllowedByScope()` to check the final computed permission for any block and scope combination:

```typescript highlight-check-permissions
    // Check resolved permissions (role + global + block scopes)
    const canMoveAsCreator = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Creator can move:', canMoveAsCreator); // true

    engine.editor.setRole('Adopter');
    const canMoveAsAdopter = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Adopter can move:', canMoveAsAdopter); // false
```

## Template Workflow Pattern

A typical template workflow:

1. **Designer (Creator)** creates the template layout
2. **Designer** locks brand elements using block scopes
3. **Designer** keeps personalization fields editable
4. **End-user (Adopter)** opens the template
5. **End-user** edits only permitted elements
6. **End-user** exports the personalized result

This pattern ensures brand consistency while enabling personalization.

## Implementation Guides

For detailed implementation, see these guides:

[Lock Design Elements](./create-templates/lock.md) — Step-by-step instructions for locking specific elements in templates

[Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md) — Configure which properties users can modify



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support