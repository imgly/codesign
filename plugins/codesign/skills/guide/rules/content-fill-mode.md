# Content Fill Mode Belongs on the Block

The `contentFill/mode` property is set on the **graphic block**, not on the fill object. The correct property path is `'contentFill/mode'`, not `'fill/image/contentFillMode'`.

## Rule

Always set `contentFill/mode` on the block that owns the fill, not on the fill itself.

```ts
// WRONG — this property does not exist on the fill
engine.block.setEnum(fill, 'fill/image/contentFillMode', 'Cover');

// CORRECT — set on the graphic block
engine.block.setEnum(block, 'contentFill/mode', 'Cover');
```

## Common Values

| Value       | Behavior                                               |
| ----------- | ------------------------------------------------------ |
| `'Contain'` | Scale to fit within the block, preserving aspect ratio |
| `'Cover'`   | Scale to fill the block, cropping as needed            |
| `'Crop'`    | Manual crop region                                     |

## Why This Is Confusing

The fill object holds the image source (`fill/image/imageFileURI`), so it seems logical that the fill mode would also live on the fill. However, `contentFill/mode` controls how the block **displays** its content fill — a layout concern that belongs to the block, not the fill data.

When in doubt, use `engine.block.findAllProperties(block)` to check which object owns the property you need.
