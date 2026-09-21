> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Overview](./fills/overview.md)

---

Some [design blocks](./concepts/blocks.md) in CE.SDK allow you to modify or replace their fill. The fill is an object that defines the contents within the shape of a block. CreativeEditor SDK supports many different types of fills, such as images, solid colors, gradients and videos.

Similarly to blocks, each fill has a numeric id which can be used to query and [modify its properties](./concepts/blocks.md).

We currently support the following fill types:

- `'//ly.img.ubq/fill/color'`
- `'//ly.img.ubq/fill/gradient/linear'`
- `'//ly.img.ubq/fill/gradient/radial'`
- `'//ly.img.ubq/fill/gradient/conical'`
- `'//ly.img.ubq/fill/image'`
- `'//ly.img.ubq/fill/video'`
- `'//ly.img.ubq/fill/pixelStream'`

Note: short types are also accepted, e.g. 'color' instead of '//ly.img.ubq/fill/color'.

## Accessing Fills

Not all types of design blocks support fills, so you should always first call the `supportsFill(id: number): boolean` API before accessing any of the following APIs.

```javascript
engine.block.supportsFill(scene); // Returns false
engine.block.supportsFill(block); // Returns true
```

In order to receive the fill id of a design block, call the `getFill(id: number): number` API. You can now pass this id into other APIs in order to query more information about the fill, e.g. its type via the `getType(id: number): ObjectType` API.

```javascript
const colorFill = engine.block.getFill(block);
const defaultRectFillType = engine.block.getType(colorFill);
```

## Fill Properties

Just like design blocks, fills with different types have different properties that you can query and modify via the API. Use `findAllProperties(id: number): string[]` in order to get a list of all properties of a given fill.

For the solid color fill in this example, the call would return `["fill/color/value", "type"]`.

Please refer to the [design blocks](./concepts/blocks.md) for a complete list of all available properties for each type of fill.

```javascript
const allFillProperties = engine.block.findAllProperties(colorFill);
```

Once we know the property keys of a fill, we can use the same APIs as for design blocks in order to modify those properties. For example, we can use `setColor(id: number, property: string, value: Color): void` in order to change the color of the fill to red.

Once we do this, our graphic block with rect shape will be filled with solid red.

```javascript
engine.block.setColor(colorFill, 'fill/color/value', {
  r: 1.0,
  g: 0.0,
  b: 0.0,
  a: 1.0
});
```

## Disabling Fills

You can disable and enable a fill using the `setFillEnabled(id: number, enabled: boolean): void` API, for example in cases where the design block should only have a stroke but no fill. Notice that you have to pass the id of the design block and not of the fill to the API.

```javascript
engine.block.setFillEnabled(block, false);
engine.block.setFillEnabled(block, !engine.block.isFillEnabled(block));
```

## Changing Fill Types

All design blocks that support fills allow you to also exchange their current fill for any other type of fill. In order to do this, you need to first create a new fill object using `createFill(type: FillType): number`.

```javascript
const imageFill = engine.block.createFill('image');
engine.block.setString(
  imageFill,
  'fill/image/imageFileURI',
  'https://img.ly/static/ubq_samples/sample_1.jpg'
);
```

In order to assign a fill to a design block, simply call `setFill(id: number, fill: number): void`. Make sure to delete the previous fill of the design block first if you don't need it any more, otherwise we will have leaked it into the scene and won't be able to access it any more, because we don't know its id.

Notice that we don't use the `appendChild` API here, which only works with design blocks and not fills.

When a fill is attached to one design block, it will be automatically destroyed when the block itself gets destroyed.

```javascript
engine.block.destroy(engine.block.getFill(block));
engine.block.setFill(block, imageFill);

/* The following line would also destroy imageFill */
// engine.block.destroy(circle);
```

## Duplicating Fills

If we duplicate a design block with a fill that is only attached to this block, the fill will automatically be duplicated as well. In order to modify the properties of the duplicate fill, we have to query its id from the duplicate block.

```javascript
const duplicateBlock = engine.block.duplicate(block);
engine.block.setPositionX(duplicateBlock, 450);
const autoDuplicateFill = engine.block.getFill(duplicateBlock);
engine.block.setString(
  autoDuplicateFill,
  'fill/image/imageFileURI',
  'https://img.ly/static/ubq_samples/sample_2.jpg'
);

// const manualDuplicateFill = engine.block.duplicate(autoDuplicateFill);
// /* We could now assign this fill to another block. */
// engine.block.destroy(manualDuplicateFill);
```

## Sharing Fills

It is also possible to share a single fill instance between multiple design blocks. In that case, changing the properties of the fill will apply to all of the blocks that it's attached to at once.

Destroying a block with a shared fill will not destroy the fill until there are no other design blocks left that still use that fill.

```javascript
const sharedFillBlock = engine.block.create('graphic');
engine.block.setShape(sharedFillBlock, engine.block.createShape('rect'));
engine.block.setPositionX(sharedFillBlock, 350);
engine.block.setPositionY(sharedFillBlock, 400);
engine.block.setWidth(sharedFillBlock, 100);
engine.block.setHeight(sharedFillBlock, 100);
engine.block.appendChild(page, sharedFillBlock);

engine.block.setFill(sharedFillBlock, engine.block.getFill(block));
```



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support