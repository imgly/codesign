> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Lock the Template](./create-templates/lock.md)

---

Understand why template locking is designed for browser-based workflows, and when you might configure scopes server-side for template preparation.

## Browser-Focused Feature

Template locking uses a two-surface pattern with two separate editor instances: one for designers (the Creator role) who build templates with full access, and another for end users (the Adopter role) who can only modify unlocked elements. This separation requires:

- **User interaction**: Different people editing in different modes
- **Multiple editor instances**: Separate surfaces for creators and adopters
- **Visual feedback**: Users see what they can and cannot edit

Server-side automation processes templates in a single execution context without user interaction. The two-surface pattern does not apply—when processing templates on the server, you work with pre-configured templates where scopes are already set.

## When You Might Use Scopes Server-Side

If you need to **prepare templates** for the two-surface workflow, you can configure scopes programmatically before distributing templates:

- Set `editor/select` and editing scopes on blocks that adopters should modify
- Leave scopes disabled on protected elements like logos and brand assets
- Save the configured template for use in browser-based adopter surfaces

For scope configuration APIs, see [Lock Content](./rules/lock-content.md).

## API Reference

### Role Management

| Method | Description |
|--------|-------------|
| `engine.editor.setRole(role)` | Set the editing role (`'Creator'`, `'Adopter'`, or `'Viewer'`) |
| `engine.editor.getRole()` | Get the current editing role |

### Scope Configuration

| Method | Description |
|--------|-------------|
| `engine.block.setScopeEnabled(block, scope, enabled)` | Enable or disable a scope on a block |
| `engine.block.isScopeEnabled(block, scope)` | Check if a scope is enabled on a block |

### Common Scopes

| Scope | Description |
|-------|-------------|
| `'editor/select'` | Allow selecting the block (required for any interaction) |
| `'fill/change'` | Allow changing the block's fill (images, colors) |
| `'text/edit'` | Allow editing text content |
| `'text/character'` | Allow changing text formatting (font, size, color) |
| `'layer/move'` | Allow moving the block |
| `'layer/resize'` | Allow resizing the block |
| `'layer/rotate'` | Allow rotating the block |
| `'layer/crop'` | Allow cropping the block |
| `'lifecycle/destroy'` | Allow deleting the block |

## See the Browser Guide

For the complete two-surface pattern implementation with interactive role switching, see the [browser guide](./create-templates/lock.md).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support