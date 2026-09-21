> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Rules](./rules.md) > [Enforce Brand Guidelines](./rules/enforce-brand-guidelines.md)

---

Learn how to restrict users to approved brand assets—specific colors, fonts, and images—while preventing unauthorized modifications to brand elements like logos and legal text in server-side processing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-rules-enforce-brand-guidelines-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-rules-enforce-brand-guidelines-server-js)

Brand guidelines enforcement in CE.SDK combines two complementary approaches: restricting which assets can be used (colors, fonts, images) and controlling what editing operations are permitted on brand elements. In server-side contexts, you can create templates with locked brand elements and validate user designs against brand rules before processing.

```typescript file=@cesdk_web_examples/guides-rules-enforce-brand-guidelines-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Enforce Brand Guidelines
 *
 * Demonstrates how to restrict users to approved brand assets and prevent
 * unauthorized modifications to brand elements using asset restrictions
 * and the scopes system in a server-side context.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});

try {
  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 800 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create brand color source with approved colors only
  engine.asset.addLocalSource('brandColors');

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-primary',
    label: { en: 'Brand Blue' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.4, b: 0.8 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-secondary',
    label: { en: 'Brand Orange' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 0.6, b: 0.0 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-dark',
    label: { en: 'Dark Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.2, b: 0.2 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-light',
    label: { en: 'Light Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.9, g: 0.9, b: 0.9 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-white',
    label: { en: 'White' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 1.0, b: 1.0 },
    },
  });

  // Set global scopes to Defer for block-level control
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('layer/resize', 'Defer');
  engine.editor.setGlobalScope('fill/change', 'Defer');
  engine.editor.setGlobalScope('fill/changeType', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');
  engine.editor.setGlobalScope('text/edit', 'Defer');

  // Create a locked logo block that cannot be modified
  const logoBlock = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logoBlock, logoShape);
  engine.block.setWidth(logoBlock, 200);
  engine.block.setHeight(logoBlock, 80);
  engine.block.setPositionX(logoBlock, 40);
  engine.block.setPositionY(logoBlock, 40);

  const logoFill = engine.block.createFill('color');
  engine.block.setColor(logoFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 1.0,
  });
  engine.block.setFill(logoBlock, logoFill);
  engine.block.setName(logoBlock, 'Company Logo');
  engine.block.appendChild(page, logoBlock);

  // Lock all editing capabilities on the logo
  engine.block.setScopeEnabled(logoBlock, 'layer/move', false);
  engine.block.setScopeEnabled(logoBlock, 'layer/resize', false);
  engine.block.setScopeEnabled(logoBlock, 'fill/change', false);
  engine.block.setScopeEnabled(logoBlock, 'fill/changeType', false);
  engine.block.setScopeEnabled(logoBlock, 'lifecycle/destroy', false);
  engine.block.setScopeEnabled(logoBlock, 'lifecycle/duplicate', false);

  // Create locked legal text
  const legalText = engine.block.create('text');
  engine.block.setWidth(legalText, pageWidth - 80);
  engine.block.setHeight(legalText, 30);
  engine.block.setPositionX(legalText, 40);
  engine.block.setPositionY(legalText, pageHeight - 50);
  engine.block.replaceText(
    legalText,
    '\u00A9 2024 Company Name. All rights reserved.'
  );
  engine.block.setFloat(legalText, 'text/fontSize', 36);
  engine.block.setName(legalText, 'Legal Text');
  engine.block.appendChild(page, legalText);

  // Lock the legal text
  engine.block.setScopeEnabled(legalText, 'layer/move', false);
  engine.block.setScopeEnabled(legalText, 'layer/resize', false);
  engine.block.setScopeEnabled(legalText, 'text/edit', false);
  engine.block.setScopeEnabled(legalText, 'lifecycle/destroy', false);

  // Create an editable content area where users can work with brand assets
  const contentBlock = engine.block.create('graphic');
  const contentShape = engine.block.createShape('rect');
  engine.block.setShape(contentBlock, contentShape);
  engine.block.setWidth(contentBlock, 400);
  engine.block.setHeight(contentBlock, 300);
  engine.block.setPositionX(contentBlock, (pageWidth - 400) / 2);
  engine.block.setPositionY(contentBlock, (pageHeight - 300) / 2);

  const contentFill = engine.block.createFill('color');
  engine.block.setColor(contentFill, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setFill(contentBlock, contentFill);
  engine.block.setName(contentBlock, 'Editable Content');
  engine.block.appendChild(page, contentBlock);

  // Enable all editing for the editable content block
  engine.block.setScopeEnabled(contentBlock, 'layer/move', true);
  engine.block.setScopeEnabled(contentBlock, 'layer/resize', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/change', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/changeType', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/destroy', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/duplicate', true);

  // Create editable text
  const editableText = engine.block.create('text');
  engine.block.setWidth(editableText, 300);
  engine.block.setHeight(editableText, 60);
  engine.block.setPositionX(editableText, (pageWidth - 300) / 2);
  engine.block.setPositionY(editableText, 150);
  engine.block.replaceText(editableText, 'Edit This Headline');
  engine.block.setFloat(editableText, 'text/fontSize', 64);
  engine.block.setEnum(editableText, 'text/horizontalAlignment', 'Center');
  engine.block.setName(editableText, 'Editable Headline');
  engine.block.appendChild(page, editableText);

  // Enable text editing
  engine.block.setScopeEnabled(editableText, 'layer/move', true);
  engine.block.setScopeEnabled(editableText, 'layer/resize', true);
  engine.block.setScopeEnabled(editableText, 'text/edit', true);
  engine.block.setScopeEnabled(editableText, 'lifecycle/destroy', true);

  // Validate brand compliance
  const isLogoLocked = !engine.block.isAllowedByScope(logoBlock, 'layer/move');
  const isLegalLocked = !engine.block.isAllowedByScope(legalText, 'text/edit');
  const isContentEditable = engine.block.isAllowedByScope(
    contentBlock,
    'fill/change'
  );

  console.log('\n=== Brand Compliance Validation ===');
  console.log(`Logo is locked: ${isLogoLocked}`);
  console.log(`Legal text is locked: ${isLegalLocked}`);
  console.log(`Content block is editable: ${isContentEditable}`);

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export the result as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/enforce-brand-guidelines-result.png`, buffer);

  console.log(
    '\n\u2713 Exported result to output/enforce-brand-guidelines-result.png'
  );
  console.log('\n=== Enforce Brand Guidelines Demo Complete ===');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

## Setting Up the Engine

Initialize the headless engine for server-side processing:

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
});
```

## Restricting Colors to Brand Palette

Create a custom color source containing only approved brand colors:

```typescript highlight-create-brand-colors
  // Create brand color source with approved colors only
  engine.asset.addLocalSource('brandColors');

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-primary',
    label: { en: 'Brand Blue' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.4, b: 0.8 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-secondary',
    label: { en: 'Brand Orange' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 0.6, b: 0.0 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-dark',
    label: { en: 'Dark Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.2, b: 0.2 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-light',
    label: { en: 'Light Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.9, g: 0.9, b: 0.9 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-white',
    label: { en: 'White' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 1.0, b: 1.0 },
    },
  });
```

Each color asset specifies an `id`, optional `label` for display, and a `payload` containing the color definition. Colors use the `sRGB` color space with `r`, `g`, `b` values from 0 to 1.

## Setting Global Scopes to Defer

Set global scopes to `'Defer'` to enable block-level control over editing permissions:

```typescript highlight-global-scope-defer
// Set global scopes to Defer for block-level control
engine.editor.setGlobalScope('layer/move', 'Defer');
engine.editor.setGlobalScope('layer/resize', 'Defer');
engine.editor.setGlobalScope('fill/change', 'Defer');
engine.editor.setGlobalScope('fill/changeType', 'Defer');
engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');
engine.editor.setGlobalScope('text/edit', 'Defer');
```

## Creating and Locking Brand Elements

### Creating a Logo Block

Create a brand element that represents the company logo:

```typescript highlight-create-logo
  // Create a locked logo block that cannot be modified
  const logoBlock = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logoBlock, logoShape);
  engine.block.setWidth(logoBlock, 200);
  engine.block.setHeight(logoBlock, 80);
  engine.block.setPositionX(logoBlock, 40);
  engine.block.setPositionY(logoBlock, 40);

  const logoFill = engine.block.createFill('color');
  engine.block.setColor(logoFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 1.0,
  });
  engine.block.setFill(logoBlock, logoFill);
  engine.block.setName(logoBlock, 'Company Logo');
  engine.block.appendChild(page, logoBlock);
```

### Locking the Logo

Disable all relevant scopes to prevent any modifications:

```typescript highlight-lock-logo
// Lock all editing capabilities on the logo
engine.block.setScopeEnabled(logoBlock, 'layer/move', false);
engine.block.setScopeEnabled(logoBlock, 'layer/resize', false);
engine.block.setScopeEnabled(logoBlock, 'fill/change', false);
engine.block.setScopeEnabled(logoBlock, 'fill/changeType', false);
engine.block.setScopeEnabled(logoBlock, 'lifecycle/destroy', false);
engine.block.setScopeEnabled(logoBlock, 'lifecycle/duplicate', false);
```

With these scopes disabled, the logo cannot be moved, resized, recolored, or deleted.

### Locking Legal Text

Create and protect legal text from modification:

```typescript highlight-create-legal-text
  // Create locked legal text
  const legalText = engine.block.create('text');
  engine.block.setWidth(legalText, pageWidth - 80);
  engine.block.setHeight(legalText, 30);
  engine.block.setPositionX(legalText, 40);
  engine.block.setPositionY(legalText, pageHeight - 50);
  engine.block.replaceText(
    legalText,
    '\u00A9 2024 Company Name. All rights reserved.'
  );
  engine.block.setFloat(legalText, 'text/fontSize', 36);
  engine.block.setName(legalText, 'Legal Text');
  engine.block.appendChild(page, legalText);

  // Lock the legal text
  engine.block.setScopeEnabled(legalText, 'layer/move', false);
  engine.block.setScopeEnabled(legalText, 'layer/resize', false);
  engine.block.setScopeEnabled(legalText, 'text/edit', false);
  engine.block.setScopeEnabled(legalText, 'lifecycle/destroy', false);
```

## Creating Editable Content Areas

While brand elements are locked, other areas can remain fully editable:

```typescript highlight-create-editable-content
  // Create an editable content area where users can work with brand assets
  const contentBlock = engine.block.create('graphic');
  const contentShape = engine.block.createShape('rect');
  engine.block.setShape(contentBlock, contentShape);
  engine.block.setWidth(contentBlock, 400);
  engine.block.setHeight(contentBlock, 300);
  engine.block.setPositionX(contentBlock, (pageWidth - 400) / 2);
  engine.block.setPositionY(contentBlock, (pageHeight - 300) / 2);

  const contentFill = engine.block.createFill('color');
  engine.block.setColor(contentFill, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setFill(contentBlock, contentFill);
  engine.block.setName(contentBlock, 'Editable Content');
  engine.block.appendChild(page, contentBlock);

  // Enable all editing for the editable content block
  engine.block.setScopeEnabled(contentBlock, 'layer/move', true);
  engine.block.setScopeEnabled(contentBlock, 'layer/resize', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/change', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/changeType', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/destroy', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/duplicate', true);
```

For text blocks that should be editable:

```typescript highlight-create-editable-text
  // Create editable text
  const editableText = engine.block.create('text');
  engine.block.setWidth(editableText, 300);
  engine.block.setHeight(editableText, 60);
  engine.block.setPositionX(editableText, (pageWidth - 300) / 2);
  engine.block.setPositionY(editableText, 150);
  engine.block.replaceText(editableText, 'Edit This Headline');
  engine.block.setFloat(editableText, 'text/fontSize', 64);
  engine.block.setEnum(editableText, 'text/horizontalAlignment', 'Center');
  engine.block.setName(editableText, 'Editable Headline');
  engine.block.appendChild(page, editableText);

  // Enable text editing
  engine.block.setScopeEnabled(editableText, 'layer/move', true);
  engine.block.setScopeEnabled(editableText, 'layer/resize', true);
  engine.block.setScopeEnabled(editableText, 'text/edit', true);
  engine.block.setScopeEnabled(editableText, 'lifecycle/destroy', true);
```

## Validating Brand Compliance

Check that brand constraints are properly enforced using `engine.block.isAllowedByScope()`:

```typescript highlight-validate-compliance
  // Validate brand compliance
  const isLogoLocked = !engine.block.isAllowedByScope(logoBlock, 'layer/move');
  const isLegalLocked = !engine.block.isAllowedByScope(legalText, 'text/edit');
  const isContentEditable = engine.block.isAllowedByScope(
    contentBlock,
    'fill/change'
  );

  console.log('\n=== Brand Compliance Validation ===');
  console.log(`Logo is locked: ${isLogoLocked}`);
  console.log(`Legal text is locked: ${isLegalLocked}`);
  console.log(`Content block is editable: ${isContentEditable}`);
```

This validation can be performed before processing user designs to ensure brand guidelines are respected.

## Exporting the Result

Export the design with brand guidelines enforced:

```typescript highlight-export
  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export the result as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/enforce-brand-guidelines-result.png`, buffer);
```

## Troubleshooting

- **Colors still editable**: When saving templates, ensure color sources are properly configured
- **Locked elements still movable**: Check that global scopes are set to `'Defer'` before setting block-level restrictions
- **Brand elements deletable**: Confirm `lifecycle/destroy` scope is disabled on the specific blocks
- **Validation failing**: Use `isAllowedByScope()` to debug which scopes are incorrectly configured

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.asset.addLocalSource(id)` | Asset | Create a custom asset source for brand assets |
| `engine.asset.addAssetToSource(sourceId, asset)` | Asset | Add an asset to a local source |
| `engine.editor.setGlobalScope(scope, value)` | Scope | Set editor-wide scope permission to `'Defer'` |
| `engine.block.setScopeEnabled(id, scope, enabled)` | Scope | Enable or disable a scope for a specific block |
| `engine.block.isAllowedByScope(id, scope)` | Scope | Check if an operation is allowed |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support