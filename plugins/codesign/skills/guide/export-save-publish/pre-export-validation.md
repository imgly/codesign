> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Pre-Export Validation](./export-save-publish/pre-export-validation.md)

---

Validate your design before export by detecting elements outside the page,
protruding content, obscured text, and other issues that could affect the
final output quality in headless environments.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-export-pre-export-validation-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-pre-export-validation-server-js)

Pre-export validation catches layout and quality issues before export, preventing problems like cropped content, hidden text, and elements missing from the final output. Production-quality designs require elements to be properly positioned within the page boundaries.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-pre-export-validation-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

config();

type ValidationSeverity = 'error' | 'warning';

interface ValidationIssue {
  type:
    | 'outside_page'
    | 'protruding'
    | 'text_obscured'
    | 'unfilled_placeholder';
  severity: ValidationSeverity;
  blockId: number;
  blockName: string;
  message: string;
}

interface ValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  license: process.env.CESDK_LICENSE
});

try {
  // Create a scene with test elements that demonstrate validation issues
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });

  const page = engine.block.findByType('page')[0];
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const centerY = pageHeight / 2;

  // Row layout: Main validation examples (horizontally aligned)
  const row1Y = centerY - 50;
  const elementWidth = 150;
  const elementHeight = 100;
  const spacing = 20;

  // Calculate positions for 4 elements in a row
  const totalRowWidth = elementWidth * 4 + spacing * 3;
  const startX = (pageWidth - totalRowWidth) / 2;

  // Create an image that's outside the page (will trigger error)
  // Positioned to the left of the page - completely outside
  const outsideImage = engine.block.create('graphic');
  engine.block.setName(outsideImage, 'Outside Image');
  engine.block.setShape(outsideImage, engine.block.createShape('rect'));
  const outsideFill = engine.block.createFill('image');
  engine.block.setString(
    outsideFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(outsideImage, outsideFill);
  engine.block.setWidth(outsideImage, elementWidth);
  engine.block.setHeight(outsideImage, elementHeight);
  engine.block.setPositionX(outsideImage, -elementWidth - 10); // Left of the page
  engine.block.setPositionY(outsideImage, row1Y);
  engine.block.appendChild(page, outsideImage);

  // Create a properly placed image for reference (first in row)
  const validImage = engine.block.create('graphic');
  engine.block.setName(validImage, 'Valid Image');
  engine.block.setShape(validImage, engine.block.createShape('rect'));
  const validFill = engine.block.createFill('image');
  engine.block.setString(
    validFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_3.jpg'
  );
  engine.block.setFill(validImage, validFill);
  engine.block.setWidth(validImage, elementWidth);
  engine.block.setHeight(validImage, elementHeight);
  engine.block.setPositionX(validImage, startX);
  engine.block.setPositionY(validImage, row1Y);
  engine.block.appendChild(page, validImage);

  // Create unfilled placeholder (second in row - triggers error)
  const placeholder = engine.block.create('graphic');
  engine.block.setName(placeholder, 'Unfilled Placeholder');
  engine.block.setShape(placeholder, engine.block.createShape('rect'));
  const placeholderFill = engine.block.createFill('image');
  engine.block.setFill(placeholder, placeholderFill);
  engine.block.setWidth(placeholder, elementWidth);
  engine.block.setHeight(placeholder, elementHeight);
  engine.block.setPositionX(placeholder, startX + elementWidth + spacing);
  engine.block.setPositionY(placeholder, row1Y);
  engine.block.appendChild(page, placeholder);
  engine.block.setScopeEnabled(placeholder, 'fill/change', true);
  engine.block.setPlaceholderBehaviorEnabled(placeholderFill, true);
  engine.block.setPlaceholderEnabled(placeholder, true);

  // Create text that will be partially obscured (third in row)
  const obscuredText = engine.block.create('text');
  engine.block.setName(obscuredText, 'Obscured Text');
  engine.block.setPositionX(
    obscuredText,
    startX + (elementWidth + spacing) * 2
  );
  engine.block.setPositionY(obscuredText, row1Y);
  engine.block.setWidth(obscuredText, elementWidth);
  engine.block.setHeight(obscuredText, elementHeight);
  engine.block.replaceText(obscuredText, 'Hidden');
  engine.block.setFloat(obscuredText, 'text/fontSize', 48);
  engine.block.appendChild(page, obscuredText);

  // Create a shape that overlaps the text (added after text = on top)
  const overlappingShape = engine.block.create('graphic');
  engine.block.setName(overlappingShape, 'Overlapping Shape');
  engine.block.setShape(overlappingShape, engine.block.createShape('rect'));
  const shapeFill = engine.block.createFill('color');
  engine.block.setColor(shapeFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 0.8
  });
  engine.block.setFill(overlappingShape, shapeFill);
  engine.block.setWidth(overlappingShape, elementWidth);
  engine.block.setHeight(overlappingShape, elementHeight);
  engine.block.setPositionX(
    overlappingShape,
    startX + (elementWidth + spacing) * 2
  );
  engine.block.setPositionY(overlappingShape, row1Y);
  engine.block.appendChild(page, overlappingShape);

  // Create an image that protrudes from the page (fourth in row - will trigger warning)
  // Extends past right page boundary
  const protrudingImage = engine.block.create('graphic');
  engine.block.setName(protrudingImage, 'Protruding Image');
  engine.block.setShape(protrudingImage, engine.block.createShape('rect'));
  const protrudingFill = engine.block.createFill('image');
  engine.block.setString(
    protrudingFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_2.jpg'
  );
  engine.block.setFill(protrudingImage, protrudingFill);
  engine.block.setWidth(protrudingImage, elementWidth);
  engine.block.setHeight(protrudingImage, elementHeight);
  engine.block.setPositionX(protrudingImage, pageWidth - elementWidth / 2); // Extends past right
  engine.block.setPositionY(protrudingImage, row1Y);
  engine.block.appendChild(page, protrudingImage);

  // Validate design before export
  const result = validateDesign(engine);

  console.log('=== Pre-Export Validation ===');

  // Log all issues for debugging
  if (result.errors.length > 0) {
    console.error(`Found ${result.errors.length} error(s):`);
    result.errors.forEach((err) =>
      console.error(`  - ${err.blockName}: ${err.message}`)
    );
  }

  if (result.warnings.length > 0) {
    console.warn(`Found ${result.warnings.length} warning(s):`);
    result.warnings.forEach((warn) =>
      console.warn(`  - ${warn.blockName}: ${warn.message}`)
    );
  }

  // Block export for errors
  if (result.errors.length > 0) {
    console.error('\nExport blocked: Fix errors before exporting');
    process.exit(1);
  }

  // Allow export with warnings
  if (result.warnings.length > 0) {
    console.log('\nProceeding with export despite warnings...');
  } else {
    console.log('\nValidation passed - no issues found');
  }

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/validated-design.png`, buffer);
  console.log('Export successful: output/validated-design.png');
} finally {
  engine.dispose();
}

function getBoundingBox(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): [number, number, number, number] {
  const x = engine.block.getGlobalBoundingBoxX(blockId);
  const y = engine.block.getGlobalBoundingBoxY(blockId);
  const width = engine.block.getGlobalBoundingBoxWidth(blockId);
  const height = engine.block.getGlobalBoundingBoxHeight(blockId);
  return [x, y, x + width, y + height];
}

function calculateOverlap(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  const [ax1, ay1, ax2, ay2] = box1;
  const [bx1, by1, bx2, by2] = box2;

  const overlapWidth = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
  const overlapHeight = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
  const overlapArea = overlapWidth * overlapHeight;

  const box1Area = (ax2 - ax1) * (ay2 - ay1);
  if (box1Area === 0) return 0;

  return overlapArea / box1Area;
}

function getBlockName(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): string {
  const name = engine.block.getName(blockId);
  if (name) return name;
  const kind = engine.block.getKind(blockId);
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function getRelevantBlocks(
  engine: InstanceType<typeof CreativeEngine>
): number[] {
  return [
    ...engine.block.findByType('text'),
    ...engine.block.findByType('graphic')
  ];
}

function findOutsideBlocks(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const pageBounds = getBoundingBox(engine, page);

  for (const blockId of getRelevantBlocks(engine)) {
    if (!engine.block.isValid(blockId)) continue;

    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    if (overlap === 0) {
      // Element is completely outside the page
      issues.push({
        type: 'outside_page',
        severity: 'error',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Element is completely outside the visible page area'
      });
    }
  }

  return issues;
}

function findProtrudingBlocks(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const pageBounds = getBoundingBox(engine, page);

  for (const blockId of getRelevantBlocks(engine)) {
    if (!engine.block.isValid(blockId)) continue;

    // Compare element bounds against page bounds
    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    // Protruding: partially inside (overlap > 0) but not fully inside (overlap < 1)
    if (overlap > 0 && overlap < 0.99) {
      issues.push({
        type: 'protruding',
        severity: 'warning',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Element extends beyond page boundaries'
      });
    }
  }

  return issues;
}

function findObscuredText(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const children = engine.block.getChildren(page);
  const textBlocks = engine.block.findByType('text');

  for (const textId of textBlocks) {
    if (!engine.block.isValid(textId)) continue;

    const textIndex = children.indexOf(textId);
    if (textIndex === -1) continue;

    // Elements later in children array are rendered on top
    const blocksAbove = children.slice(textIndex + 1);

    for (const aboveId of blocksAbove) {
      // Skip text blocks - they don't typically obscure other text
      if (engine.block.getType(aboveId) === '//ly.img.ubq/text') continue;

      const overlap = calculateOverlap(
        getBoundingBox(engine, textId),
        getBoundingBox(engine, aboveId)
      );

      if (overlap > 0) {
        // Text is obscured by element above it
        issues.push({
          type: 'text_obscured',
          severity: 'warning',
          blockId: textId,
          blockName: getBlockName(engine, textId),
          message: 'Text may be partially hidden by overlapping elements'
        });
        break;
      }
    }
  }

  return issues;
}

function findUnfilledPlaceholders(
  engine: InstanceType<typeof CreativeEngine>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const placeholders = engine.block.findAllPlaceholders();

  for (const blockId of placeholders) {
    if (!engine.block.isValid(blockId)) continue;

    if (!isPlaceholderFilled(engine, blockId)) {
      issues.push({
        type: 'unfilled_placeholder',
        severity: 'error',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Placeholder has not been filled with content'
      });
    }
  }

  return issues;
}

function isPlaceholderFilled(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): boolean {
  const fillId = engine.block.getFill(blockId);
  if (!fillId || !engine.block.isValid(fillId)) return false;

  const fillType = engine.block.getType(fillId);

  // Check image fill - empty URI means unfilled placeholder
  if (fillType === '//ly.img.ubq/fill/image') {
    const imageUri = engine.block.getString(fillId, 'fill/image/imageFileURI');
    return imageUri !== '' && imageUri !== undefined;
  }

  // Other fill types are considered filled
  return true;
}

function validateDesign(
  engine: InstanceType<typeof CreativeEngine>
): ValidationResult {
  const page = engine.block.findByType('page')[0];

  const outsideIssues = findOutsideBlocks(engine, page);
  const protrudingIssues = findProtrudingBlocks(engine, page);
  const obscuredIssues = findObscuredText(engine, page);
  const placeholderIssues = findUnfilledPlaceholders(engine);

  const allIssues = [
    ...outsideIssues,
    ...protrudingIssues,
    ...obscuredIssues,
    ...placeholderIssues
  ];

  return {
    errors: allIssues.filter((i) => i.severity === 'error'),
    warnings: allIssues.filter((i) => i.severity === 'warning')
  };
}
```

This guide demonstrates how to detect elements outside the page, find protruding content, identify obscured text, and integrate validation into the export workflow in headless Node.js environments.

## Getting Element Bounds

To detect spatial issues, we need to get the bounding box of elements in global coordinates. The `getGlobalBoundingBox*` methods return positions that account for all transformations:

```typescript highlight-get-bounding-box
const x = engine.block.getGlobalBoundingBoxX(blockId);
const y = engine.block.getGlobalBoundingBoxY(blockId);
const width = engine.block.getGlobalBoundingBoxWidth(blockId);
const height = engine.block.getGlobalBoundingBoxHeight(blockId);
return [x, y, x + width, y + height];
```

This returns coordinates as `[x1, y1, x2, y2]` representing the top-left and bottom-right corners of the element. The overlap between element and page bounds is calculated as the intersection area divided by the element's total area. An overlap of 0 means completely outside, while 1 (100%) means fully inside.

## Detecting Elements Outside the Page

Elements completely outside the page won't appear in the exported output. We find these by checking for blocks with zero overlap with the page bounds:

```typescript highlight-find-outside-blocks
    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    if (overlap === 0) {
      // Element is completely outside the page
```

These issues are categorized as errors because the content is completely missing from the export.

## Detecting Protruding Elements

Elements that extend beyond the page boundaries will be partially cropped in the export. For each block, compare its bounds against the page bounds and calculate the overlap ratio:

```typescript highlight-find-protruding-blocks
    // Compare element bounds against page bounds
    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    // Protruding: partially inside (overlap > 0) but not fully inside (overlap < 1)
    if (overlap > 0 && overlap < 0.99) {
```

An overlap between 0% and 100% indicates the element is partially inside the page. These issues are warnings because the content is partially visible but may not appear as intended.

## Finding Obscured Text

Text hidden behind other elements may be unreadable in the final export. First, get the stacking order and all text blocks:

```typescript highlight-find-obscured-text
const children = engine.block.getChildren(page);
const textBlocks = engine.block.findByType('text');
```

The `getChildren()` method returns blocks in stacking order - elements later in the array are rendered on top. For each text block, check if any non-text element above it overlaps with its bounds:

```typescript highlight-check-text-obscured
    // Elements later in children array are rendered on top
    const blocksAbove = children.slice(textIndex + 1);

    for (const aboveId of blocksAbove) {
      // Skip text blocks - they don't typically obscure other text
      if (engine.block.getType(aboveId) === '//ly.img.ubq/text') continue;

      const overlap = calculateOverlap(
        getBoundingBox(engine, textId),
        getBoundingBox(engine, aboveId)
      );

      if (overlap > 0) {
        // Text is obscured by element above it
```

We skip text-on-text comparisons since transparent text backgrounds don't typically obscure other text. When overlap is detected, we flag the text as potentially obscured.

## Checking Placeholder Content

Placeholders mark areas where users must add content before export. First, find all placeholder blocks in the design:

```typescript highlight-find-placeholders
const placeholders = engine.block.findAllPlaceholders();
```

Then inspect each placeholder's fill to determine if content has been added. Get the fill block and check its type to determine the validation logic:

```typescript highlight-check-placeholder-filled
  const fillId = engine.block.getFill(blockId);
  if (!fillId || !engine.block.isValid(fillId)) return false;

  const fillType = engine.block.getType(fillId);

  // Check image fill - empty URI means unfilled placeholder
  if (fillType === '//ly.img.ubq/fill/image') {
    const imageUri = engine.block.getString(fillId, 'fill/image/imageFileURI');
    return imageUri !== '' && imageUri !== undefined;
  }
```

For image placeholders, check if the `fill/image/imageFileURI` property has a value. An empty or undefined URI indicates the placeholder hasn't been filled. Unfilled placeholders are treated as errors that block export, ensuring users complete all required content before exporting.

## Integrating with Export

In headless environments, run validation before export and handle results programmatically. Errors block the export entirely, while warnings can be logged but allow the export to proceed:

```typescript highlight-export-with-validation
  // Validate design before export
  const result = validateDesign(engine);

  console.log('=== Pre-Export Validation ===');

  // Log all issues for debugging
  if (result.errors.length > 0) {
    console.error(`Found ${result.errors.length} error(s):`);
    result.errors.forEach((err) =>
      console.error(`  - ${err.blockName}: ${err.message}`)
    );
  }

  if (result.warnings.length > 0) {
    console.warn(`Found ${result.warnings.length} warning(s):`);
    result.warnings.forEach((warn) =>
      console.warn(`  - ${warn.blockName}: ${warn.message}`)
    );
  }

  // Block export for errors
  if (result.errors.length > 0) {
    console.error('\nExport blocked: Fix errors before exporting');
    process.exit(1);
  }

  // Allow export with warnings
  if (result.warnings.length > 0) {
    console.log('\nProceeding with export despite warnings...');
  } else {
    console.log('\nValidation passed - no issues found');
  }

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/validated-design.png`, buffer);
  console.log('Export successful: output/validated-design.png');
```

When validation fails, log the issues and exit with an error code so calling systems know the export was blocked.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.getGlobalBoundingBoxX(id)` | Get element's global X position |
| `engine.block.getGlobalBoundingBoxY(id)` | Get element's global Y position |
| `engine.block.getGlobalBoundingBoxWidth(id)` | Get element's global width |
| `engine.block.getGlobalBoundingBoxHeight(id)` | Get element's global height |
| `engine.block.findByType(type)` | Find all blocks of a specific type |
| `engine.block.getChildren(id)` | Get child blocks in stacking order |
| `engine.block.getType(id)` | Get the block's type string |
| `engine.block.getName(id)` | Get the block's display name |
| `engine.block.isValid(id)` | Check if block exists |
| `engine.block.findAllPlaceholders()` | Find all placeholder blocks |
| `engine.block.getFill(id)` | Get the fill block |
| `engine.block.getString(id, property)` | Get a string property value |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support