> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Undo and History](./concepts/undo-and-history.md)

---

Implement undo/redo functionality and manage multiple history stacks to track editing operations.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-undo-and-history-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-undo-and-history-server-js)

CE.SDK automatically tracks editing operations, enabling you to undo and redo changes programmatically. The engine creates undo steps for most operations automatically. You can also create multiple independent history stacks to isolate different editing contexts, such as separate histories for different processing pipelines.

```typescript file=@cesdk_web_examples/guides-concepts-undo-and-history-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Subscribe to history updates.
  const unsubscribe = engine.editor.onHistoryUpdatedWithKind((kind) => {
    if (kind === 'Activated') {
      console.log('Active history switched, scene unchanged.');
      return;
    }
    const canUndo = engine.editor.canUndo();
    const canRedo = engine.editor.canRedo();
    console.log('History updated:', { canUndo, canRedo });
  });

  // Create a triangle shape and add an undo step to record it in history
  const block = engine.block.create('graphic');
  engine.block.setPositionX(block, 140);
  engine.block.setPositionY(block, 95);
  engine.block.setWidth(block, 265);
  engine.block.setHeight(block, 265);
  const triangleShape = engine.block.createShape('polygon');
  engine.block.setInt(triangleShape, 'shape/polygon/sides', 3);
  engine.block.setShape(block, triangleShape);
  const triangleFill = engine.block.createFill('color');
  engine.block.setColor(triangleFill, 'fill/color/value', {
    r: 0.2,
    g: 0.5,
    b: 0.9,
    a: 1
  });
  engine.block.setFill(block, triangleFill);
  engine.block.appendChild(page, block);
  // Commit the block creation to history so it can be undone
  engine.editor.addUndoStep();

  // Log current state - canUndo should now be true
  console.log('Block created. canUndo:', engine.editor.canUndo());

  // Undo the block creation
  if (engine.editor.canUndo()) {
    engine.editor.undo();
    console.log(
      'After undo - canUndo:',
      engine.editor.canUndo(),
      'canRedo:',
      engine.editor.canRedo()
    );
  }

  // Redo to restore the block
  if (engine.editor.canRedo()) {
    engine.editor.redo();
    console.log(
      'After redo - canUndo:',
      engine.editor.canUndo(),
      'canRedo:',
      engine.editor.canRedo()
    );
  }

  // Create a second history stack for isolated operations
  const secondaryHistory = engine.editor.createHistory();
  const primaryHistory = engine.editor.getActiveHistory();
  console.log(
    'Created secondary history. Primary:',
    primaryHistory,
    'Secondary:',
    secondaryHistory
  );

  // Switch to the secondary history
  engine.editor.setActiveHistory(secondaryHistory);
  console.log(
    'Switched to secondary history. Active:',
    engine.editor.getActiveHistory()
  );

  // Operations in secondary history are isolated from the primary history
  const secondBlock = engine.block.create('graphic');
  engine.block.setPositionX(secondBlock, 440);
  engine.block.setPositionY(secondBlock, 95);
  engine.block.setWidth(secondBlock, 220);
  engine.block.setHeight(secondBlock, 220);
  const circleShape = engine.block.createShape('ellipse');
  engine.block.setShape(secondBlock, circleShape);
  const circleFill = engine.block.createFill('color');
  engine.block.setColor(circleFill, 'fill/color/value', {
    r: 0.9,
    g: 0.3,
    b: 0.3,
    a: 1
  });
  engine.block.setFill(secondBlock, circleFill);
  engine.block.appendChild(page, secondBlock);
  // Commit changes to the secondary history
  engine.editor.addUndoStep();
  console.log(
    'Block added in secondary history. canUndo:',
    engine.editor.canUndo()
  );

  // Switch back to primary history
  engine.editor.setActiveHistory(primaryHistory);
  console.log(
    'Switched back to primary history. canUndo:',
    engine.editor.canUndo()
  );

  // Clean up the secondary history when no longer needed
  engine.editor.destroyHistory(secondaryHistory);
  console.log('Secondary history destroyed');

  // Manually add an undo step after custom operations
  engine.block.setPositionX(block, 190);
  engine.editor.addUndoStep();
  console.log('Manual undo step added. canUndo:', engine.editor.canUndo());

  // Remove the most recent undo step if needed
  if (engine.editor.canUndo()) {
    engine.editor.removeUndoStep();
    console.log('Most recent undo step removed');
  }
  // Reset block position to its original location
  engine.block.setPositionX(block, 140);

  // Clean up subscription
  unsubscribe();

  console.log('Undo and history demo completed successfully');
} finally {
  // Always dispose of the engine when done
  engine.dispose();
}
```

This guide covers how to perform undo and redo operations programmatically, subscribe to history changes, manually manage undo steps, and work with multiple history stacks.

## Setup

We start by initializing the CE.SDK engine and creating a design scene. The engine automatically creates a history stack when initialized.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];
```

## Automatic Undo Step Creation

Most editing operations automatically create undo steps. When we add a shape to the scene, the engine records this operation in the history stack.

```typescript highlight=highlight-create-block
// Create a triangle shape and add an undo step to record it in history
const block = engine.block.create('graphic');
engine.block.setPositionX(block, 140);
engine.block.setPositionY(block, 95);
engine.block.setWidth(block, 265);
engine.block.setHeight(block, 265);
const triangleShape = engine.block.createShape('polygon');
engine.block.setInt(triangleShape, 'shape/polygon/sides', 3);
engine.block.setShape(block, triangleShape);
const triangleFill = engine.block.createFill('color');
engine.block.setColor(triangleFill, 'fill/color/value', {
  r: 0.2,
  g: 0.5,
  b: 0.9,
  a: 1
});
engine.block.setFill(block, triangleFill);
engine.block.appendChild(page, block);
// Commit the block creation to history so it can be undone
engine.editor.addUndoStep();
```

After creating the shape, `canUndo()` returns `true` since the operation has been recorded as an undoable step.

## Performing Undo and Redo Operations

We use `engine.editor.undo()` and `engine.editor.redo()` to programmatically revert or restore changes. Before calling these methods, check availability with `engine.editor.canUndo()` and `engine.editor.canRedo()` to prevent errors.

```typescript highlight=highlight-undo
// Undo the block creation
if (engine.editor.canUndo()) {
  engine.editor.undo();
  console.log(
    'After undo - canUndo:',
    engine.editor.canUndo(),
    'canRedo:',
    engine.editor.canRedo()
  );
}
```

The undo operation reverts the most recent change. After undoing, `canRedo()` returns `true` since there's now a step available to restore.

```typescript highlight=highlight-redo
// Redo to restore the block
if (engine.editor.canRedo()) {
  engine.editor.redo();
  console.log(
    'After redo - canUndo:',
    engine.editor.canUndo(),
    'canRedo:',
    engine.editor.canRedo()
  );
}
```

The redo operation restores the most recently undone change. After redoing, `canRedo()` returns `false` (unless there are more undo steps to restore).

## Subscribing to History Changes

We use `engine.editor.onHistoryUpdatedWithKind()` to receive notifications when the history state changes. The callback receives a `HistoryUpdate` argument that distinguishes the kind of change:

- `'Updated'` — the active history's snapshots changed because of an edit, an `addUndoStep` call, or an `undo`/`redo`. The scene reflects the new state.
- `'Activated'` — a different history buffer was made active via `setActiveHistory()`. The undo/redo stack visible to the user changed, but no new snapshot was created and no undo or redo was applied.

This separation lets dirty-state or auto-save logic ignore pure activation events when switching between isolated processing pipelines.

```typescript highlight=highlight-subscribe-history
// Subscribe to history updates.
const unsubscribe = engine.editor.onHistoryUpdatedWithKind((kind) => {
  if (kind === 'Activated') {
    console.log('Active history switched, scene unchanged.');
    return;
  }
  const canUndo = engine.editor.canUndo();
  const canRedo = engine.editor.canRedo();
  console.log('History updated:', { canUndo, canRedo });
});
```

The subscription returns an unsubscribe function. Call it when you no longer need notifications.

## Managing Undo Steps Manually

Most editing operations automatically create undo steps. However, some custom operations may require manual checkpoint creation using `engine.editor.addUndoStep()`. This is useful when you make multiple related changes that should be undone as a single unit.

```typescript highlight=highlight-manual-undo-step
  // Manually add an undo step after custom operations
  engine.block.setPositionX(block, 190);
  engine.editor.addUndoStep();
  console.log('Manual undo step added. canUndo:', engine.editor.canUndo());

  // Remove the most recent undo step if needed
  if (engine.editor.canUndo()) {
    engine.editor.removeUndoStep();
    console.log('Most recent undo step removed');
  }
  // Reset block position to its original location
  engine.block.setPositionX(block, 140);
```

We use `engine.editor.removeUndoStep()` to remove the most recent undo step. Always check `canUndo()` before calling this method to ensure an undo step is available. This can be useful when you need to discard changes without affecting the redo stack.

## Working with Multiple History Stacks

CE.SDK supports multiple independent history stacks for isolated editing contexts. This is useful when you need separate undo/redo histories for different parts of your application, such as different processing pipelines or batch operations.

### Creating and Switching History Stacks

We create a new history stack using `engine.editor.createHistory()`. Use `engine.editor.setActiveHistory()` to switch between stacks. Only the active history responds to undo/redo operations.

```typescript highlight=highlight-multiple-histories
  // Create a second history stack for isolated operations
  const secondaryHistory = engine.editor.createHistory();
  const primaryHistory = engine.editor.getActiveHistory();
  console.log(
    'Created secondary history. Primary:',
    primaryHistory,
    'Secondary:',
    secondaryHistory
  );

  // Switch to the secondary history
  engine.editor.setActiveHistory(secondaryHistory);
  console.log(
    'Switched to secondary history. Active:',
    engine.editor.getActiveHistory()
  );

  // Operations in secondary history are isolated from the primary history
  const secondBlock = engine.block.create('graphic');
  engine.block.setPositionX(secondBlock, 440);
  engine.block.setPositionY(secondBlock, 95);
  engine.block.setWidth(secondBlock, 220);
  engine.block.setHeight(secondBlock, 220);
  const circleShape = engine.block.createShape('ellipse');
  engine.block.setShape(secondBlock, circleShape);
  const circleFill = engine.block.createFill('color');
  engine.block.setColor(circleFill, 'fill/color/value', {
    r: 0.9,
    g: 0.3,
    b: 0.3,
    a: 1
  });
  engine.block.setFill(secondBlock, circleFill);
  engine.block.appendChild(page, secondBlock);
  // Commit changes to the secondary history
  engine.editor.addUndoStep();
  console.log(
    'Block added in secondary history. canUndo:',
    engine.editor.canUndo()
  );

  // Switch back to primary history
  engine.editor.setActiveHistory(primaryHistory);
  console.log(
    'Switched back to primary history. canUndo:',
    engine.editor.canUndo()
  );
```

Operations performed while a history is active only affect that history. When you switch back to the primary history, its undo/redo state remains unchanged by operations performed in the secondary history.

### Cleaning Up History Stacks

We destroy unused history stacks with `engine.editor.destroyHistory()` to free resources. Always clean up secondary histories when they're no longer needed.

```typescript highlight=highlight-destroy-history
// Clean up the secondary history when no longer needed
engine.editor.destroyHistory(secondaryHistory);
console.log('Secondary history destroyed');
```

## Troubleshooting

Common issues when working with undo/redo functionality:

- **Undo step not recorded**: Ensure changes occur after the history subscription is active. The engine only tracks operations that happen while the history is being monitored.
- **Redo not available**: Performing any new action after undo clears the redo stack. This is standard behavior to prevent branching history states.
- **Wrong history active**: Always verify the correct history is set with `getActiveHistory()` before performing undo/redo operations when using multiple stacks.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support