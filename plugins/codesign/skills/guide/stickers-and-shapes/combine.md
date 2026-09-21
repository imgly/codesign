> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Combine Shapes](./stickers-and-shapes/combine.md)

---

Combine multiple shapes using boolean operations to create custom compound designs programmatically.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-combine-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-stickers-and-shapes-combine-server-js)

CE.SDK provides four boolean operations for combining shapes: *Union*, *Difference*, *Intersection*, and *XOR*. These operations work with graphic blocks and text blocks, allowing you to build complex designs from simple primitives.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-combine-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Combine Shapes
 *
 * Demonstrates combining shapes using boolean operations in Node.js:
 * - Checking combinability before operations
 * - Union: Merging shapes together
 * - Difference: Creating punch-out effects
 * - Intersection: Extracting overlapping areas
 * - XOR: Creating exclusion patterns
 * - Understanding fill inheritance
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // ===== Demonstration 1: Union Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } }
  });
  let page = engine.block.findByType('page')[0];

  // Create three circles for union demonstration
  const unionCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const unionFill1 = engine.block.createFill('color');
  engine.block.setColor(unionFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.4,
    b: 0.4,
    a: 1.0
  });
  engine.block.setFill(unionCircle1, unionFill1);
  engine.block.setWidth(unionCircle1, 120);
  engine.block.setHeight(unionCircle1, 120);
  engine.block.setPositionX(unionCircle1, 100);
  engine.block.setPositionY(unionCircle1, 80);
  engine.block.appendChild(page, unionCircle1);

  const unionCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const unionFill2 = engine.block.createFill('color');
  engine.block.setColor(unionFill2, 'fill/color/value', {
    r: 0.4,
    g: 1.0,
    b: 0.4,
    a: 1.0
  });
  engine.block.setFill(unionCircle2, unionFill2);
  engine.block.setWidth(unionCircle2, 120);
  engine.block.setHeight(unionCircle2, 120);
  engine.block.setPositionX(unionCircle2, 180);
  engine.block.setPositionY(unionCircle2, 100);
  engine.block.appendChild(page, unionCircle2);

  const unionCircle3 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle3,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const unionFill3 = engine.block.createFill('color');
  engine.block.setColor(unionFill3, 'fill/color/value', {
    r: 0.4,
    g: 0.4,
    b: 1.0,
    a: 1.0
  });
  engine.block.setFill(unionCircle3, unionFill3);
  engine.block.setWidth(unionCircle3, 120);
  engine.block.setHeight(unionCircle3, 120);
  engine.block.setPositionX(unionCircle3, 140);
  engine.block.setPositionY(unionCircle3, 140);
  engine.block.appendChild(page, unionCircle3);

  // Check if blocks can be combined before attempting operations
  const canCombineUnion = engine.block.isCombinable([
    unionCircle1,
    unionCircle2,
    unionCircle3
  ]);

  // Merge three circles using Union operation
  if (canCombineUnion) {
    engine.block.combine([unionCircle1, unionCircle2, unionCircle3], 'Union');
  }

  // Export Union result
  let blob = await engine.block.export(page, { mimeType: 'image/png' });
  let buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-union-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported Union result to output/combine-union-result.png');

  // ===== Demonstration 2: Difference Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } }
  });
  page = engine.block.findByType('page')[0];

  // Create image block for base
  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(
    imageBlock,
    engine.block.createShape('//ly.img.ubq/shape/rect')
  );
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 360);
  engine.block.setHeight(imageBlock, 240);
  engine.block.setPositionX(imageBlock, 20);
  engine.block.setPositionY(imageBlock, 30);
  engine.block.appendChild(page, imageBlock);

  // Create text block for punch-out
  const textBlock = engine.block.create('text');
  engine.block.replaceText(textBlock, 'CUTOUT');
  engine.block.setFloat(textBlock, 'text/fontSize', 120);
  engine.block.setPositionX(textBlock, 60);
  engine.block.setPositionY(textBlock, 90);
  engine.block.appendChild(page, textBlock);

  // Ensure image is at bottom for Difference operation
  engine.block.sendToBack(imageBlock);

  const canCombineDiff = engine.block.isCombinable([imageBlock, textBlock]);

  // Create punch-out text effect using Difference operation
  if (canCombineDiff) {
    engine.block.combine([imageBlock, textBlock], 'Difference');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-difference-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log(
    '✓ Exported Difference result to output/combine-difference-result.png'
  );

  // ===== Demonstration 3: Intersection Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } }
  });
  page = engine.block.findByType('page')[0];

  // Create two overlapping circles for intersection
  const intersectCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    intersectCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const intersectFill1 = engine.block.createFill('color');
  engine.block.setColor(intersectFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.2,
    a: 1.0
  });
  engine.block.setFill(intersectCircle1, intersectFill1);
  engine.block.setWidth(intersectCircle1, 144);
  engine.block.setHeight(intersectCircle1, 144);
  engine.block.setPositionX(intersectCircle1, 128);
  engine.block.setPositionY(intersectCircle1, 90);
  engine.block.appendChild(page, intersectCircle1);

  const intersectCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    intersectCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const intersectFill2 = engine.block.createFill('color');
  engine.block.setColor(intersectFill2, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.2,
    a: 1.0
  });
  engine.block.setFill(intersectCircle2, intersectFill2);
  engine.block.setWidth(intersectCircle2, 144);
  engine.block.setHeight(intersectCircle2, 144);
  engine.block.setPositionX(intersectCircle2, 128);
  engine.block.setPositionY(intersectCircle2, 162);
  engine.block.appendChild(page, intersectCircle2);

  const canCombineIntersect = engine.block.isCombinable([
    intersectCircle1,
    intersectCircle2
  ]);

  // Extract overlapping area using Intersection operation
  if (canCombineIntersect) {
    engine.block.combine([intersectCircle1, intersectCircle2], 'Intersection');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-intersection-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log(
    '✓ Exported Intersection result to output/combine-intersection-result.png'
  );

  // ===== Demonstration 4: XOR Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } }
  });
  page = engine.block.findByType('page')[0];

  // Create two overlapping circles for XOR
  const xorCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    xorCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const xorFill1 = engine.block.createFill('color');
  engine.block.setColor(xorFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.8,
    b: 0.2,
    a: 1.0
  });
  engine.block.setFill(xorCircle1, xorFill1);
  engine.block.setWidth(xorCircle1, 140);
  engine.block.setHeight(xorCircle1, 140);
  engine.block.setPositionX(xorCircle1, 110);
  engine.block.setPositionY(xorCircle1, 80);
  engine.block.appendChild(page, xorCircle1);

  const xorCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    xorCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse')
  );
  const xorFill2 = engine.block.createFill('color');
  engine.block.setColor(xorFill2, 'fill/color/value', {
    r: 0.6,
    g: 0.4,
    b: 1.0,
    a: 1.0
  });
  engine.block.setFill(xorCircle2, xorFill2);
  engine.block.setWidth(xorCircle2, 140);
  engine.block.setHeight(xorCircle2, 140);
  engine.block.setPositionX(xorCircle2, 166);
  engine.block.setPositionY(xorCircle2, 108);
  engine.block.appendChild(page, xorCircle2);

  const canCombineXor = engine.block.isCombinable([xorCircle1, xorCircle2]);

  // Create exclusion shape using XOR operation
  if (canCombineXor) {
    engine.block.combine([xorCircle1, xorCircle2], 'XOR');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-xor-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported XOR result to output/combine-xor-result.png');

  // eslint-disable-next-line no-console
  console.log('\n✓ All boolean operations completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers checking combinability, applying the four boolean operations, understanding fill inheritance, and troubleshooting common combination issues.

## Understanding Boolean Operations

CE.SDK offers four boolean operations for combining blocks into new shapes. Each operation applies geometric transformations to create unique compound designs.

**Union** merges all blocks into a single shape, adding their areas together. **Difference** subtracts overlapping areas from a base block, creating cutouts. **Intersection** keeps only the overlapping regions. **XOR** removes overlaps while preserving non-overlapping parts.

The operations use `engine.block.combine(ids, operation)` where `ids` is an array of blocks and `operation` is one of: `'Union'`, `'Difference'`, `'Intersection'`, or `'XOR'`.

Combining blocks with the `'Union'`, `'Intersection'`, or `'XOR'` operation results in a new block whose fill is that of the top-most block. The operation is applied pair-wise from the top-most block to the bottom-most block.

Combining blocks with the `'Difference'` operation results in a new block whose fill is that of the bottom-most block. The operation is applied pair-wise from the bottom-most block to the top-most block.

The combined blocks will be destroyed if the `'lifecycle/destroy'` scope is enabled.

> **Note:** **Only the following blocks can be combined*** A graphics block
> * A text block

## Checking Combinability

Before combining blocks, verify they can be combined using `engine.block.isCombinable(ids)`. Only graphic blocks and text blocks with the `'lifecycle/duplicate'` scope enabled can be combined.

```typescript highlight-check-combinability
// Check if blocks can be combined before attempting operations
const canCombineUnion = engine.block.isCombinable([
  unionCircle1,
  unionCircle2,
  unionCircle3
]);
```

The check returns `true` if all blocks meet the requirements. Attempting to combine incompatible blocks will fail.

## Combining with Union

Union merges multiple shapes into one compound outline. The result inherits the fill from the top-most block in the z-order.

```typescript highlight-combine-union
// Merge three circles using Union operation
if (canCombineUnion) {
  engine.block.combine([unionCircle1, unionCircle2, unionCircle3], 'Union');
}
```

We create three circles with different colors. Union combines them into a single block with the blue fill (from the top-most circle).

Use Union for merging logos, creating compound icons, and building complex shapes from simple primitives.

## Combining with Difference

Difference subtracts overlapping shapes from a base block, creating cutout effects. The result inherits the fill from the bottom-most block.

```typescript highlight-combine-difference
// Create punch-out text effect using Difference operation
if (canCombineDiff) {
  engine.block.combine([imageBlock, textBlock], 'Difference');
}
```

We position an image as the bottom block and text above it. Difference removes the text shape from the image, creating a punch-out effect where the text was.

Use Difference for text punch-outs, logo cutouts, and mask effects. Ensure the base block is at the bottom using `engine.block.sendToBack()`.

## Combining with Intersection

Intersection keeps only the overlapping areas of all blocks. The result inherits the fill from the bottom-most block.

```typescript highlight-combine-intersection
// Extract overlapping area using Intersection operation
if (canCombineIntersect) {
  engine.block.combine([intersectCircle1, intersectCircle2], 'Intersection');
}
```

We create two overlapping circles. Intersection extracts only the area where they overlap, discarding the rest.

Use Intersection for lens effects, overlapping patterns, and extracting geometric intersections.

## Combining with XOR

XOR (exclusive OR) keeps non-overlapping parts while removing intersections, creating an exclusion or donut effect. The result inherits the fill from the top-most block.

```typescript highlight-combine-xor
// Create exclusion shape using XOR operation
if (canCombineXor) {
  engine.block.combine([xorCircle1, xorCircle2], 'XOR');
}
```

We create two overlapping circles. XOR removes the overlapping area while preserving the non-overlapping parts.

Use XOR for donut shapes, exclusion patterns, and inverted overlaps.

## Understanding Fill Inheritance

Combined blocks inherit properties from a prioritized block based on the operation.

**Union, Intersection, XOR**: The new block inherits the fill from the top-most block. Operations are applied pair-wise from highest to lowest sort order.

**Difference**: The new block inherits the fill from the bottom-most block. Operations are applied pair-wise from lowest to highest sort order.

Original blocks are destroyed after combination if the `'lifecycle/destroy'` scope is enabled. Control which fill is inherited by reordering blocks with `engine.block.bringToFront()` and `engine.block.sendToBack()`.

## Scope Requirements

Combining blocks requires specific scopes:

**`'lifecycle/duplicate'`**: Required on all blocks. Checked by `engine.block.isCombinable()`. If missing, combination fails.

**`'lifecycle/destroy'`**: Required for destroying original blocks. If disabled, original blocks remain after combination.

Check scopes with `engine.block.isScopeEnabled(id, scope)` and enable with `engine.block.setScopeEnabled(id, scope, true)`.

## Troubleshooting

### Combination Fails Silently

Verify blocks are combinable using `engine.block.isCombinable(ids)` before attempting operations. Only graphic blocks and text blocks can be combined. Check that the `'lifecycle/duplicate'` scope is enabled on all blocks.

### Original Blocks Not Destroyed

Ensure the `'lifecycle/destroy'` scope is enabled on input blocks. If disabled, blocks remain after combination. Check with `engine.block.isScopeEnabled(id, 'lifecycle/destroy')`.

### Wrong Fill on Result

For Union/Intersection/XOR, the top-most block's fill is inherited. For Difference, the bottom-most block's fill is inherited. Reorder blocks before combining using `engine.block.bringToFront()` or `engine.block.sendToBack()`.

### Unexpected Shape Result

Boolean operations are applied pair-wise in specific order. Union/Intersection/XOR start with the highest sort order (top-most). Difference starts with the lowest sort order (bottom-most). Control order with z-order methods.

## Full Code

Here's the complete implementation showing all four boolean operations in a headless Node.js environment:

```typescript
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } },
  });
  const page = engine.block.findByType('page')[0];

  // Create three circles for union demonstration
  const circle1 = engine.block.create('graphic');
  engine.block.setShape(circle1, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
  const fill1 = engine.block.createFill('color');
  engine.block.setColor(fill1, 'fill/color/value', { r: 1.0, g: 0.4, b: 0.4, a: 1.0 });
  engine.block.setFill(circle1, fill1);
  engine.block.setWidth(circle1, 120);
  engine.block.setHeight(circle1, 120);
  engine.block.setPositionX(circle1, 100);
  engine.block.setPositionY(circle1, 80);
  engine.block.appendChild(page, circle1);

  const circle2 = engine.block.create('graphic');
  engine.block.setShape(circle2, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
  const fill2 = engine.block.createFill('color');
  engine.block.setColor(fill2, 'fill/color/value', { r: 0.4, g: 1.0, b: 0.4, a: 1.0 });
  engine.block.setFill(circle2, fill2);
  engine.block.setWidth(circle2, 120);
  engine.block.setHeight(circle2, 120);
  engine.block.setPositionX(circle2, 180);
  engine.block.setPositionY(circle2, 100);
  engine.block.appendChild(page, circle2);

  const circle3 = engine.block.create('graphic');
  engine.block.setShape(circle3, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
  const fill3 = engine.block.createFill('color');
  engine.block.setColor(fill3, 'fill/color/value', { r: 0.4, g: 0.4, b: 1.0, a: 1.0 });
  engine.block.setFill(circle3, fill3);
  engine.block.setWidth(circle3, 120);
  engine.block.setHeight(circle3, 120);
  engine.block.setPositionX(circle3, 140);
  engine.block.setPositionY(circle3, 140);
  engine.block.appendChild(page, circle3);

  // Check combinability and perform Union
  if (engine.block.isCombinable([circle1, circle2, circle3])) {
    engine.block.combine([circle1, circle2, circle3], 'Union');
  }

  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-union-result.png`, buffer);

  console.log('✓ Exported Union result to output/combine-union-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.isCombinable(ids)` | Validation | Check if blocks can be combined |
| `engine.block.combine(ids, op)` | Combination | Perform boolean operation on blocks |
| `engine.block.create('graphic')` | Creation | Create graphic block for shapes |
| `engine.block.create('text')` | Creation | Create text block |
| `engine.block.createShape(type)` | Shapes | Create shape (ellipse, rect, etc.) |
| `engine.block.setShape(id, shape)` | Shapes | Apply shape to graphic block |
| `engine.block.createFill(type)` | Fills | Create fill (color, image, etc.) |
| `engine.block.setFill(id, fill)` | Fills | Apply fill to block |
| `engine.block.setPositionX/Y(id, val)` | Transform | Position blocks before combining |
| `engine.block.setWidth/Height(id, val)` | Transform | Size blocks before combining |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add blocks to scene |
| `engine.block.isScopeEnabled(id, scope)` | Scope | Check if scope is enabled |
| `engine.block.setScopeEnabled(id, scope, enabled)` | Scope | Enable/disable scope |
| `engine.block.bringToFront(id)` | Order | Control stacking order |
| `engine.block.sendToBack(id)` | Order | Control stacking order |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support