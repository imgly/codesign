> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Edit Shapes](./stickers-and-shapes/create-edit/edit-shapes.md)

---

This guide shows how to programmatically edit shapes using the Block API, covering geometry modifications, fill changes, stroke configuration, transforms, and boolean combinations.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-edit-shapes-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-stickers-and-shapes-edit-shapes-server-js)

The `graphic` block in CE.SDK allows you to modify and replace its shape. CE.SDK supports many different types of shapes, such as rectangles, lines, ellipses, polygons, stars, and custom vector paths.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-edit-shapes-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit Shapes
 *
 * Demonstrates editing shapes programmatically in Node.js:
 * - Accessing and checking shape support
 * - Creating and setting shapes
 * - Replacing shapes with proper cleanup
 * - Querying shape properties
 * - Modifying shape-specific properties
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a graphic block to work with
  const graphic = engine.block.create('graphic');
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(graphic, imageFill);
  engine.block.setWidth(graphic, 200);
  engine.block.setHeight(graphic, 200);
  engine.block.setPositionX(graphic, 100);
  engine.block.setPositionY(graphic, 100);
  engine.block.appendChild(page, graphic);

  // Check if a block supports shapes
  engine.block.supportsShape(graphic); // Returns true
  const text = engine.block.create('text');
  engine.block.supportsShape(text); // Returns false

  // Create a rectangular shape
  const rectShape = engine.block.createShape('rect');

  // Apply the shape to the graphic block
  engine.block.setShape(graphic, rectShape);

  // Retrieve the current shape and its type
  const shape = engine.block.getShape(graphic);
  const shapeType = engine.block.getType(shape);
  console.log(`Current shape type: ${shapeType}`);

  // Replace the shape with a star shape
  const starShape = engine.block.createShape('star');
  // Destroy the old shape before replacing to prevent memory leaks
  engine.block.destroy(engine.block.getShape(graphic));
  engine.block.setShape(graphic, starShape);
  /* The following line would also destroy the currently attached starShape */
  // engine.block.destroy(graphic);

  // Query all properties of the star shape
  const allShapeProperties = engine.block.findAllProperties(starShape);
  // Returns properties like "shape/star/innerDiameter" and "shape/star/points"
  console.log(`Found ${allShapeProperties.length} shape properties`);

  // Modify star-specific properties
  engine.block.setInt(starShape, 'shape/star/points', 5);
  engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.5);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/edit-shapes-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/edit-shapes-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

Similarly to blocks, each shape object has a numeric ID which can be used to query and modify its properties.

## Accessing Shapes

To query whether a block supports shapes, use the `engine.block.supportsShape(id)` API. Currently, only the `graphic` design block supports shape objects.

```typescript highlight-supportsShape
// Check if a block supports shapes
engine.block.supportsShape(graphic); // Returns true
const text = engine.block.create('text');
engine.block.supportsShape(text); // Returns false
```

To query the shape of a design block, first create a shape and set it, then call `engine.block.getShape(id)`. You can pass the returned result into other APIs to query more information about the shape, such as its type via `engine.block.getType(id)`.

```typescript highlight-createShape
// Create a rectangular shape
const rectShape = engine.block.createShape('rect');
```

```typescript highlight-setShape
// Apply the shape to the graphic block
engine.block.setShape(graphic, rectShape);
```

```typescript highlight-getShape
// Retrieve the current shape and its type
const shape = engine.block.getShape(graphic);
const shapeType = engine.block.getType(shape);
console.log(`Current shape type: ${shapeType}`);
```

## Replacing Shapes

When replacing a shape, remember to destroy the previous shape object if you don't intend to use it further. Shape objects that are not attached to a design block will never be automatically destroyed.

```typescript highlight-replaceShape
// Replace the shape with a star shape
const starShape = engine.block.createShape('star');
// Destroy the old shape before replacing to prevent memory leaks
engine.block.destroy(engine.block.getShape(graphic));
engine.block.setShape(graphic, starShape);
/* The following line would also destroy the currently attached starShape */
// engine.block.destroy(graphic);
```

Destroying a design block will also destroy its attached shape block (shown in the commented line).

## Shape Properties

Just like design blocks, shapes with different types have different properties that you can query and modify via the API. Use `engine.block.findAllProperties(id)` to get a list of all properties of a given shape.

```typescript highlight-getProperties
// Query all properties of the star shape
const allShapeProperties = engine.block.findAllProperties(starShape);
// Returns properties like "shape/star/innerDiameter" and "shape/star/points"
console.log(`Found ${allShapeProperties.length} shape properties`);
```

For the star shape in this example, the call returns an array including properties like `"shape/star/innerDiameter"` and `"shape/star/points"`.

Once we know the property keys of a shape, we can use the same APIs as for design blocks to modify those properties. For example, we can use `engine.block.setInt()` to change the number of points of the star to five.

```typescript highlight-modifyProperties
// Modify star-specific properties
engine.block.setInt(starShape, 'shape/star/points', 5);
engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.5);
```

## Troubleshooting

### Shape Not Changing

- Verify the block supports shapes: `engine.block.supportsShape(block)` must return `true`
- Check that the shape was created successfully and has a valid ID
- Ensure the shape is assigned to the block using `engine.block.setShape()`

### Property Modification Not Working

- Confirm you're using the correct property key (use `findAllProperties()` to discover them)
- Verify you're using the right setter method: `setInt()` for integers, `setFloat()` for floats, `setString()` for strings
- Check that the property exists for that shape type (e.g., `shape/star/points` only exists on star shapes)

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.supportsShape(id)` | Validation | Check if block supports shapes |
| `engine.block.createShape(type)` | Creation | Create new shape instance |
| `engine.block.getShape(id)` | Query | Get shape from graphic block |
| `engine.block.getType(id)` | Query | Get type of block or shape |
| `engine.block.setShape(id, shape)` | Modification | Apply shape to graphic block |
| `engine.block.findAllProperties(id)` | Query | List all properties of block or shape |
| `engine.block.setInt(id, prop, val)` | Modification | Set integer property (e.g., star points) |
| `engine.block.setFloat(id, prop, val)` | Modification | Set float property (e.g., corner radius) |
| `engine.block.setString(id, prop, val)` | Modification | Set string property (e.g., vector path data) |
| `engine.block.destroy(id)` | Management | Destroy block or shape |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support