> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Actions](./actions.md)

---

The Actions API provides a centralized way to manage and customize actions when running CE.SDK headlessly on Node.js.

> **Note:** The Actions API is available after engine initialization through
> `engine.actions`. The `@cesdk/node` package exposes the same actions API as
> the browser engine. There is no prebuilt editor in a headless environment, so
> the host UI actions of the browser editor (`saveScene`, `exportDesign`,
> `uploadFile`, and the rest) are not registered.

```typescript file=@cesdk_web_examples/guides-actions-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';

config();

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page and a selected block so selection-based
    // actions have a target
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 100);
    engine.block.setPositionY(block, 100);
    engine.block.appendChild(page, block);
    engine.block.setSelected(block, true);

    // Engine defaults act on the current selection
    const moved = await engine.actions.run('nudge', { dx: 10, dy: 0 });
    console.log('Selection moved:', moved); // true

    await engine.actions.run('selection.duplicate');
    console.log('Blocks on page:', engine.block.getChildren(page).length);

    // Explicitly targeted actions take their targets as arguments
    await engine.actions.run('select', { ids: [block] });
    console.log('Selected blocks:', engine.block.findAllSelected()); // [block]

    // Register a custom action under your own id
    engine.actions.register('myCompany.audit', (event: string) => {
      const selected = engine.block.findAllSelected();
      return { event, selectedBlocks: selected.length };
    });

    const audit = await engine.actions.run('myCompany.audit', 'export');
    console.log('Audit result:', audit); // { event: 'export', selectedBlocks: 1 }

    // Override an engine default: hide instead of destroy
    engine.actions.register('selection.delete', () => {
      const selected = engine.block.findAllSelected();
      selected.forEach((id) => engine.block.setVisible(id, false));
      return selected.length;
    });

    const hidden = await engine.actions.run('selection.delete');
    console.log('Hidden blocks:', hidden); // 1

    // Unregistering an overridden engine default restores the built-in behavior
    engine.actions.unregister('selection.delete');

    // Discover registered actions, optionally filtered by a glob matcher
    const all = engine.actions.list();
    console.log('Registered actions:', all.length);

    const selectionActions = engine.actions.list({ matcher: 'selection.*' });
    selectionActions.forEach(({ id, enabled }) => {
      console.log(`${id} (enabled: ${enabled})`);
    });

    // Test for an action by id
    console.log('Has nudge:', engine.actions.has('nudge')); // true

    // get() returns the raw function for actions you registered ...
    const auditFn = engine.actions.get('myCompany.audit');
    if (auditFn != null) {
      console.log('Sync call:', auditFn('archive'));
    }

    // ... and undefined for engine-default native actions - use run() for those
    console.log('Get nudge:', engine.actions.get('nudge')); // undefined

    // Remove a custom action entirely
    engine.actions.unregister('myCompany.audit');
    console.log('Has audit:', engine.actions.has('myCompany.audit')); // false

    // Export the scene as an image to verify the result
    await mkdir('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    await writeFile('output/actions.png', Buffer.from(await blob.arrayBuffer()));
    console.log('Exported preview: output/actions.png');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

## The Action Registry

An action is a named function stored under a string id, such as `history.undo`, `text.toggleBold`, or `zoom`. You run actions by id, override what a built-in id does, add your own, or list what is available.

Registries are isolated per engine: actions registered on one `CreativeEngine` instance are not visible to another.

### Running an Action

Call `run(id, ...args)` to execute an action. It returns a `Promise` that resolves to the action's result — most engine defaults resolve to `true` or `false` (changed or no-change), a few to `null`.

```ts
// Undo the last change.
await engine.actions.run('history.undo');

// Nudge the current selection 10px to the right.
await engine.actions.run('nudge', { dx: 10, dy: 0 });

// Set the fill color of the selected blocks.
await engine.actions.run('fill.color', { color: { r: 1, g: 0, b: 0, a: 1 } });
```

Selection verbs act on the current selection (`engine.block.findAllSelected()`); explicitly targeted actions take ids in their arguments. In a headless script there are no pointer events, so select blocks programmatically with `engine.block.setSelected()` before running a selection verb — without a selection it is a no-op and resolves to `false`.

### Registering and Overriding

Call `register(id, fn)` to add a new action or replace an existing one. Re-registering a default id overrides its behavior everywhere that id is used — including the engine's own dispatches.

```ts
// Add your own command.
engine.actions.register('myCompany.report', async (payload) => {
  await sendAnalytics(payload);
  return { ok: true };
});

// Override a built-in: hide instead of destroy.
engine.actions.register('selection.delete', () => {
  engine.block
    .findAllSelected()
    .forEach((id) => engine.block.setVisible(id, false));
});
```

An action you register runs directly in JavaScript, so arguments and results pass by reference — non-serializable values such as `Buffer`s or callbacks work. The engine's own dispatches and calls that reach an engine-default native action go through a JSON boundary, so values that cross it must be JSON-serializable.

### Listing and Inspecting

Call `list(options?)` to discover registered actions. It returns an array of `{ id, enabled, argSchema }` objects. Pass a `matcher` glob to filter by id.

```ts
// Every registered action.
const all = engine.actions.list();

// Just the engine defaults under the `text.` namespace.
const textActions = engine.actions.list({ matcher: 'text.*' });
// => [{ id: 'text.toggleBold', enabled: true, argSchema: '…' }, …]
```

Use `has(id)` to test for an action, `unregister(id)` to remove a custom action or revert an overridden built-in to its default, and `get(id)` to read back a function you registered so you can call it synchronously (it returns `undefined` for engine-default native actions; use `run` for those).

```ts
engine.actions.has('zoom'); // true
const report = engine.actions.get('myCompany.report'); // the raw fn
```

## API Methods

The Actions API provides four methods:

- `register(actionId, handler)` - Register an action function for a specific event
- `get(actionId)` - Retrieve a registered action function
- `run(actionId, ...args)` - Execute a registered action with the provided arguments (throws if not registered)
- `list(matcher)` - Lists registered action IDs, optionally filtered by wildcard pattern

## Getting Started

Register actions after initializing the headless engine:

```javascript
import CreativeEngine from '@cesdk/node';

const engine = await CreativeEngine.init({
  // license: 'YOUR_CESDK_LICENSE_KEY',
});

try {
  // Register an action
  engine.actions.register('actionType', async (...args) => {
    // Your custom implementation
    return result;
  });

  // Execute a registered action
  await engine.actions.run('actionType', arg1, arg2);

  // Or retrieve an action to call it later
  const action = engine.actions.get('actionType');

  // List all registered actions
  const allActions = engine.actions.list();

  // List actions matching a pattern
  const textActions = engine.actions.list({ matcher: 'text.*' });
} finally {
  // Dispose the engine when your script is done
  engine.dispose();
}
```

## Engine-Default Actions

The engine seeds its registry with the editor's command vocabulary. These run wherever the engine runs, including headless mode via `@cesdk/node`. Run any of them by id or override them. The full set is discoverable at runtime with `list()`:

### History

- `history.undo` - Undo the last change
- `history.redo` - Redo the last undone change

### Lifecycle / selection

- `selection.delete` - Delete the selected blocks
- `selection.duplicate` - Duplicate the selected blocks
- `selection.group` - Group the selected blocks
- `selection.ungroup` - Ungroup the selected group
- `group.enter` - Enter the selected group for editing
- `group.exit` - Exit the current group
- `select` - Select blocks by id (dispatched by the engine on click)
- `selection.all` - Select all blocks on the current page
- `select.byType` - Select all blocks of a given type
- `selection.parentOrDeselect` - Select the parent group, or deselect if none
- `rename` - Rename the selected block
- `lock.toggle` - Toggle the lock state of the selected blocks

### Transform / arrange

- `nudge` - Move the selection by a pixel delta (`{ dx, dy }`)
- `transform` - Apply position/size/rotation to blocks
- `resize` - Resize the selection by a delta or scale
- `scale` - Scale the selection around an anchor
- `rotate` - Rotate the selection by degrees (absolute or relative)
- `flip.horizontal` - Flip the selection horizontally
- `flip.vertical` - Flip the selection vertically
- `align.horizontal` - Align the selection horizontally (left/center/right)
- `align.vertical` - Align the selection vertically (top/center/bottom)
- `distribute.horizontal` - Distribute the selection horizontally
- `distribute.vertical` - Distribute the selection vertically
- `matchSize` - Match the size of the selection to a reference block
- `bringToFront` - Bring the selection to the front
- `bringForward` - Bring the selection forward one step
- `sendBackward` - Send the selection backward one step
- `sendToBack` - Send the selection to the back
- `reorder.moveToIndex` - Move the selection to a specific layer index
- `reparent` - Move the selection under a new parent

### Appearance

- `opacity` - Set the opacity of the selection
- `visibility.toggle` - Toggle visibility of the selection
- `blendMode` - Set the blend mode of the selection
- `fill.color` - Set the solid fill color
- `fill.toggle` - Toggle the fill on or off
- `contentFillMode` - Set the content fill mode (crop/cover/contain)
- `stroke.toggle` - Toggle the stroke on or off
- `stroke.color` - Set the stroke color
- `stroke.width` - Set the stroke width
- `dropShadow.toggle` - Toggle the drop shadow on or off
- `dropShadow.color` - Set the drop shadow color
- `dropShadow.offset` - Set the drop shadow offset
- `dropShadow.blur` - Set the drop shadow blur
- `blur.toggle` - Toggle the block blur on or off
- `blur.set` - Set the block blur type
- `effect.append` - Append an effect to the selection
- `effect.remove` - Remove an effect by index
- `effect.clear` - Remove all effects from the selection

### Crop / edit mode

- `crop.enter` - Enter crop mode (dispatched by the engine on double-click)
- `crop.reset` - Reset the crop to its default
- `crop.fillFrame` - Fill the frame with the cropped content
- `editmode.exit` - Exit the current edit mode
- `text.edit` - Enter text editing (dispatched by the engine on double-click)

### Text

- `text.toggleBold` - Toggle bold on the selected text
- `text.toggleItalic` - Toggle italic on the selected text
- `text.fontSize` - Set the font size
- `text.align` - Set the text alignment (left/center/right)
- `text.case` - Set the text case (normal/upper/lower/title)
- `text.color` - Set the text color
- `text.lineHeight` - Set the line height
- `text.letterSpacing` - Set the letter spacing
- `text.list` - Set the list style (none/unordered/ordered)
- `text.typeface` - Set the typeface

### Pages

- `page.add` - Add a new page
- `page.selectNext` - Scroll to the next page
- `page.selectPrevious` - Scroll to the previous page
- `page.remove` - Remove a page
- `page.duplicate` - Duplicate a page
- `page.size` - Set a page's size
- `page.background.toggle` - Toggle a page's background fill
- `page.title.edit` - Edit a page's title (dispatched by the engine)

### Scene / view

- `scene.layout` - Set the scene layout (free/stacks)
- `scene.size` - Set the scene size
- `zoom` - Set the zoom level/factor around a pivot
- `zoom.toBlock` - Zoom the camera to fit a block
- `zoom.toPage` - Zoom the camera to fit a page
- `zoom.autoFit.toggle` - Toggle auto-fit zoom on an axis
- `pan` - Pan the viewport by a delta

### Video / timeline / playback

- `selection.split` - Split the selected clip at the playhead
- `video.playPause` - Toggle playback of the current page
- `playback.seek` - Seek playback to a time
- `duration` - Set the duration of the selection
- `trim.offset` - Set the trim offset of the selection
- `trim.length` - Set the trim length of the selection
- `playbackSpeed` - Set the playback speed of the selection
- `volume` - Set the volume of the selection
- `mute.toggle` - Toggle mute on the selection
- `loop.toggle` - Toggle looping on the selection
- `timeOffset` - Set the time offset of the selection
- `animation.in` / `animation.in.remove` - Set or remove the in animation
- `animation.out` / `animation.out.remove` - Set or remove the out animation
- `animation.loop` / `animation.loop.remove` - Set or remove the loop animation

### Canvas interaction primitives

These exist for editor hosts that forward pointer input; they are rarely useful in a headless script.

- `drag.begin` - Begin a drag gesture on blocks
- `drag.end` - End a drag gesture on blocks
- `secondaryAction` - The secondary (context) action at a position

## Overriding Engine Defaults Safely

Some actions are dispatched by the engine itself in response to user input — for example `select` (on click), `crop.enter` and `text.edit` (on double-click), and `page.title.edit`. The engine reads the result of these within the same update, so an override of one of them must apply its effect **synchronously**.

```ts
// Synchronous override — runs in the same tick, so the engine sees the result.
engine.actions.register('select', ({ ids }) => {
  applyMySelection(ids);
});
```

> **Caution:** When you override a self-dispatched action (`select`, `crop.enter`,
> `text.edit`, `page.title.edit`), apply the effect synchronously. An override
> that defers its work (for example by `await`-ing before applying it) lands a
> microtask too late for the engine's same-tick read, so the result is ignored
> for that input. Overriding actions you trigger yourself with `run` has no such
> constraint.

## Registering Custom Actions with Custom IDs

Beyond the predefined action types, you can register actions with custom IDs for your own application-specific needs:

```javascript
// Register a custom action
engine.actions.register('myCustomAction', async data => {
  console.log('Custom action triggered with:', data);
  return { success: true, processedData: data };
});

// Execute the custom action using run
const result = await engine.actions.run('myCustomAction', { someData: 'value' });

// Or retrieve it for conditional execution
const customAction = engine.actions.get('myCustomAction');
if (customAction) {
  const result = await customAction({ someData: 'value' });
}
```

## Discovering Registered Actions

Use `list()` to get all registered action IDs or find actions matching a pattern:

```javascript
// Get all registered action IDs
const registeredActions = engine.actions.list();
console.log('Available actions:', registeredActions);

// Find actions matching a pattern
const selectionActions = engine.actions.list({ matcher: 'selection.*' });
console.log('Selection actions:', selectionActions);
```

## Differences from the Browser

The actions API itself is identical across `@cesdk/node`, `@cesdk/engine`, and the prebuilt editor's `cesdk.actions` — they all write to the same kind of registry. What differs on Node.js is which ids are pre-registered:

- **Host UI actions are absent.** The prebuilt browser editor registers convenience actions such as `saveScene`, `shareScene`, `importScene`, `exportScene`, `exportDesign`, `uploadFile`, `asset.delete`, `scene.create`, and the `video.*.checkSupport` and `timeline.*` actions. On Node.js these ids do not exist — use the engine APIs directly (for example `engine.scene.saveToString()` or `engine.block.export()`), or register your own implementations under the same ids.
- **Editor keyboard adapters are absent.** Ids the browser editor layers on top of the engine defaults — `copy`, `cut`, `paste`, `zoom.toFit`, `group.enterOrExit`, `selection.nudgeUp`/`Down`/`Left`/`Right` (and their `…Extended` variants), `text.toggleUnderline`, `text.toggleStrikethrough`, `vectorPath.deleteNodeOrPoint` - are not registered. The underlying engine defaults (`nudge`, `group.enter`, `group.exit`, `zoom.toBlock`, and so on) cover the same operations.
- **No dialogs or downloads.** Engine defaults never open UI, so everything in the registry runs headlessly. Anything you register yourself should also avoid DOM APIs.

Prefer `list()` over hardcoding assumptions when your code needs to know whether an id is available in the current environment.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support