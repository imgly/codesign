> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Add Text](./text/add.md)

---

Create and configure text blocks in CE.SDK with custom fonts, rich text styling, and dynamic sizing options.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-add-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-add-server-js)

Text blocks are fundamental design elements for displaying titles, captions, labels, and body text. CE.SDK provides a range-based styling system that allows different formatting within a single text block, enabling rich text with multiple colors, font weights, and styles.

```typescript file=@cesdk_web_examples/guides-text-add-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Text
 *
 * Demonstrates text block creation and configuration:
 * - Creating text blocks
 * - Setting text content
 * - Configuring auto-sizing
 * - Applying fonts and typefaces
 * - Range-based styling with colors and font weights
 * - Text case transformations
 * - Text alignment and spacing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  const pageWidth = 800;
  const pageHeight = 900;
  engine.scene.create('VerticalStack', {
    page: { size: { width: pageWidth, height: pageHeight } }
  });
  const page = engine.block.findByType('page')[0];

  // Document layout settings
  const margin = 40;
  const fontSize = 14;
  const lineSpacing = 100;

  // Create a title text block
  const titleBlock = engine.block.create('text');
  engine.block.appendChild(page, titleBlock);

  // Set the text content using replaceText
  engine.block.replaceText(titleBlock, 'Welcome to CE.SDK');

  // Configure auto-sizing so the block adjusts to content
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');

  // Position at top of document
  engine.block.setPositionX(titleBlock, margin);
  engine.block.setPositionY(titleBlock, margin);

  // Apply a custom font to the title
  // Font URIs point to hosted font files (TTF, OTF, WOFF, WOFF2)
  const fontUri =
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Bold.ttf';
  const typeface = {
    name: 'Caveat',
    fonts: [
      {
        uri: fontUri,
        subFamily: 'Bold',
        weight: 'bold' as const,
        style: 'normal' as const
      }
    ]
  };
  engine.block.setFont(titleBlock, fontUri, typeface);

  // Set font size (80pt for visibility)
  engine.block.setTextFontSize(titleBlock, fontSize);

  // Create a text block with rich text styling (multiple colors and weights)
  const richTextBlock = engine.block.create('text');
  engine.block.appendChild(page, richTextBlock);
  engine.block.replaceText(richTextBlock, 'Rich text with colors and styles');

  // Position below title
  engine.block.setPositionX(richTextBlock, margin);
  engine.block.setPositionY(richTextBlock, margin + lineSpacing);
  engine.block.setWidthMode(richTextBlock, 'Auto');
  engine.block.setHeightMode(richTextBlock, 'Auto');
  engine.block.setTextFontSize(richTextBlock, fontSize);

  // Apply different colors to specific ranges
  // "Rich" (0-4) in blue
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.2, g: 0.4, b: 0.8, a: 1.0 },
    0,
    4
  );

  // "text" (5-9) in green
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.2, g: 0.7, b: 0.3, a: 1.0 },
    5,
    9
  );

  // "colors" (15-21) in orange
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.9, g: 0.5, b: 0.1, a: 1.0 },
    15,
    21
  );

  // "styles" (26-32) in purple
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.6, g: 0.2, b: 0.8, a: 1.0 },
    26,
    32
  );

  // Create a text block demonstrating auto-sizing with fixed width
  const autoSizeBlock = engine.block.create('text');
  engine.block.appendChild(page, autoSizeBlock);
  engine.block.replaceText(autoSizeBlock, 'Auto-sizing text block');

  // Position below rich text
  engine.block.setPositionX(autoSizeBlock, margin);
  engine.block.setPositionY(autoSizeBlock, margin + lineSpacing * 2);

  // Set fixed width but auto height - text wraps and height adjusts
  engine.block.setWidth(autoSizeBlock, pageWidth - margin * 2);
  engine.block.setWidthMode(autoSizeBlock, 'Absolute');
  engine.block.setHeightMode(autoSizeBlock, 'Auto');
  engine.block.setTextFontSize(autoSizeBlock, fontSize);

  // Create a text block demonstrating text case transformations
  const caseBlock = engine.block.create('text');
  engine.block.appendChild(page, caseBlock);
  engine.block.replaceText(caseBlock, 'uppercase text');

  // Position below auto-size block
  engine.block.setPositionX(caseBlock, margin);
  engine.block.setPositionY(caseBlock, margin + lineSpacing * 3);
  engine.block.setWidthMode(caseBlock, 'Auto');
  engine.block.setHeightMode(caseBlock, 'Auto');
  engine.block.setTextFontSize(caseBlock, fontSize);

  // Transform the entire text to uppercase without changing the source
  engine.block.setTextCase(caseBlock, 'Uppercase');

  // Create a text block demonstrating bold/italic toggle
  const toggleBlock = engine.block.create('text');
  engine.block.appendChild(page, toggleBlock);
  engine.block.replaceText(toggleBlock, 'Toggle Bold and Italic');

  // Position below case block
  engine.block.setPositionX(toggleBlock, margin);
  engine.block.setPositionY(toggleBlock, margin + lineSpacing * 4);
  engine.block.setWidthMode(toggleBlock, 'Auto');
  engine.block.setHeightMode(toggleBlock, 'Auto');
  engine.block.setTextFontSize(toggleBlock, fontSize);

  // Set a font that supports bold/italic variants
  const robotoTypeface = {
    name: 'Roboto',
    fonts: [
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
        subFamily: 'Regular',
        weight: 'normal' as const,
        style: 'normal' as const
      },
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf',
        subFamily: 'Bold',
        weight: 'bold' as const,
        style: 'normal' as const
      },
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Italic.ttf',
        subFamily: 'Italic',
        weight: 'normal' as const,
        style: 'italic' as const
      }
    ]
  };
  engine.block.setFont(
    toggleBlock,
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
    robotoTypeface
  );

  // Toggle bold for "Bold" (7-11)
  engine.block.toggleBoldFont(toggleBlock, 7, 11);

  // Toggle italic for "Italic" (16-22)
  engine.block.toggleItalicFont(toggleBlock, 16, 22);

  // Create a text block to demonstrate text modification
  const modifyBlock = engine.block.create('text');
  engine.block.appendChild(page, modifyBlock);
  engine.block.replaceText(modifyBlock, 'Hello World');

  // Position below toggle block
  engine.block.setPositionX(modifyBlock, margin);
  engine.block.setPositionY(modifyBlock, margin + lineSpacing * 5);
  engine.block.setWidthMode(modifyBlock, 'Auto');
  engine.block.setHeightMode(modifyBlock, 'Auto');
  engine.block.setTextFontSize(modifyBlock, fontSize);

  // Replace "World" with "CE.SDK" (range 6-11)
  engine.block.replaceText(modifyBlock, 'CE.SDK', 6, 11);
  // Result: "Hello CE.SDK"

  // Create a centered text block with custom spacing
  const alignedBlock = engine.block.create('text');
  engine.block.appendChild(page, alignedBlock);
  engine.block.replaceText(alignedBlock, 'Centered Text\nWith Line Spacing');

  // Position at bottom of document
  engine.block.setPositionX(alignedBlock, margin);
  engine.block.setPositionY(alignedBlock, margin + lineSpacing * 6);

  // Set explicit dimensions for centered alignment
  engine.block.setWidth(alignedBlock, pageWidth - margin * 2);
  engine.block.setWidthMode(alignedBlock, 'Absolute');
  engine.block.setHeightMode(alignedBlock, 'Auto');
  engine.block.setTextFontSize(alignedBlock, fontSize);

  // Set horizontal alignment to center
  engine.block.setEnum(alignedBlock, 'text/horizontalAlignment', 'Center');

  // Adjust line height (1.5 = 150% of font size)
  engine.block.setFloat(alignedBlock, 'text/lineHeight', 1.5);

  // Adjust letter spacing (0.05 = 5% of font size)
  engine.block.setFloat(alignedBlock, 'text/letterSpacing', 0.05);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/add-text.png', buffer);
  console.log('Exported to output/add-text.png');
} finally {
  engine.dispose();
}
```

This guide covers how to create text blocks, apply fonts and typefaces, style text ranges with colors and weights, configure auto-sizing, and apply text transformations.

## Create Text Blocks

We create a text block using `engine.block.create('text')` and add it to the page hierarchy. The `replaceText()` method sets the initial content.

```typescript highlight-create-text
  // Create a title text block
  const titleBlock = engine.block.create('text');
  engine.block.appendChild(page, titleBlock);

  // Set the text content using replaceText
  engine.block.replaceText(titleBlock, 'Welcome to CE.SDK');

  // Configure auto-sizing so the block adjusts to content
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');

  // Position at top of document
  engine.block.setPositionX(titleBlock, margin);
  engine.block.setPositionY(titleBlock, margin);
```

Text blocks default to auto-sizing, where both width and height adjust to fit the content. We position the block using `setPositionX()` and `setPositionY()`.

## Apply Fonts and Typefaces

We set fonts for text blocks using `setFont()`, which requires a font file URI and a typeface configuration object. The typeface describes the font family and available variants.

```typescript highlight-set-font
  // Apply a custom font to the title
  // Font URIs point to hosted font files (TTF, OTF, WOFF, WOFF2)
  const fontUri =
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Bold.ttf';
  const typeface = {
    name: 'Caveat',
    fonts: [
      {
        uri: fontUri,
        subFamily: 'Bold',
        weight: 'bold' as const,
        style: 'normal' as const
      }
    ]
  };
  engine.block.setFont(titleBlock, fontUri, typeface);

  // Set font size (80pt for visibility)
  engine.block.setTextFontSize(titleBlock, fontSize);
```

CE.SDK supports TTF, OTF, WOFF, and WOFF2 font formats. The typeface object includes a `name`, and a `fonts` array describing each variant with its URI, weight, style, and sub-family.

## Style Text Ranges

We apply rich text formatting to specific character ranges using range-based APIs. Each method accepts start and end indices to target specific portions of the text.

```typescript highlight-rich-text-styling
  // Create a text block with rich text styling (multiple colors and weights)
  const richTextBlock = engine.block.create('text');
  engine.block.appendChild(page, richTextBlock);
  engine.block.replaceText(richTextBlock, 'Rich text with colors and styles');

  // Position below title
  engine.block.setPositionX(richTextBlock, margin);
  engine.block.setPositionY(richTextBlock, margin + lineSpacing);
  engine.block.setWidthMode(richTextBlock, 'Auto');
  engine.block.setHeightMode(richTextBlock, 'Auto');
  engine.block.setTextFontSize(richTextBlock, fontSize);

  // Apply different colors to specific ranges
  // "Rich" (0-4) in blue
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.2, g: 0.4, b: 0.8, a: 1.0 },
    0,
    4
  );

  // "text" (5-9) in green
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.2, g: 0.7, b: 0.3, a: 1.0 },
    5,
    9
  );

  // "colors" (15-21) in orange
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.9, g: 0.5, b: 0.1, a: 1.0 },
    15,
    21
  );

  // "styles" (26-32) in purple
  engine.block.setTextColor(
    richTextBlock,
    { r: 0.6, g: 0.2, b: 0.8, a: 1.0 },
    26,
    32
  );
```

The range indices use UTF-16 code unit positions. We can apply:

- **Colors** with `setTextColor(block, color, from, to)`
- **Font weights** with `setTextFontWeight(block, weight, from, to)`
- **Font styles** with `setTextFontStyle(block, style, from, to)`
- **Font sizes** with `setTextFontSize(block, size, from, to)`

## Configure Auto-Sizing

We control how text blocks resize using width and height modes. Setting `setHeightMode(block, 'Auto')` allows the block height to adjust based on content, while a fixed width causes text to wrap.

```typescript highlight-auto-sizing
  // Create a text block demonstrating auto-sizing with fixed width
  const autoSizeBlock = engine.block.create('text');
  engine.block.appendChild(page, autoSizeBlock);
  engine.block.replaceText(autoSizeBlock, 'Auto-sizing text block');

  // Position below rich text
  engine.block.setPositionX(autoSizeBlock, margin);
  engine.block.setPositionY(autoSizeBlock, margin + lineSpacing * 2);

  // Set fixed width but auto height - text wraps and height adjusts
  engine.block.setWidth(autoSizeBlock, pageWidth - margin * 2);
  engine.block.setWidthMode(autoSizeBlock, 'Absolute');
  engine.block.setHeightMode(autoSizeBlock, 'Auto');
  engine.block.setTextFontSize(autoSizeBlock, fontSize);
```

Available sizing modes include:

- **'Auto'** - Dimension adjusts to fit content
- **'Absolute'** - Dimension uses the explicit pixel value
- **'Percent'** - Dimension uses a percentage of the parent

## Apply Text Case Transformations

We transform text appearance without changing the underlying content using `setTextCase()`. This applies visual transformations while preserving the original text.

```typescript highlight-text-case
  // Create a text block demonstrating text case transformations
  const caseBlock = engine.block.create('text');
  engine.block.appendChild(page, caseBlock);
  engine.block.replaceText(caseBlock, 'uppercase text');

  // Position below auto-size block
  engine.block.setPositionX(caseBlock, margin);
  engine.block.setPositionY(caseBlock, margin + lineSpacing * 3);
  engine.block.setWidthMode(caseBlock, 'Auto');
  engine.block.setHeightMode(caseBlock, 'Auto');
  engine.block.setTextFontSize(caseBlock, fontSize);

  // Transform the entire text to uppercase without changing the source
  engine.block.setTextCase(caseBlock, 'Uppercase');
```

Available text cases include 'Normal', 'Uppercase', 'Lowercase', and 'Titlecase'.

## Set Text Alignment and Spacing

We configure text layout properties using `setEnum()` for alignment and `setFloat()` for spacing values.

```typescript highlight-text-alignment
  // Create a centered text block with custom spacing
  const alignedBlock = engine.block.create('text');
  engine.block.appendChild(page, alignedBlock);
  engine.block.replaceText(alignedBlock, 'Centered Text\nWith Line Spacing');

  // Position at bottom of document
  engine.block.setPositionX(alignedBlock, margin);
  engine.block.setPositionY(alignedBlock, margin + lineSpacing * 6);

  // Set explicit dimensions for centered alignment
  engine.block.setWidth(alignedBlock, pageWidth - margin * 2);
  engine.block.setWidthMode(alignedBlock, 'Absolute');
  engine.block.setHeightMode(alignedBlock, 'Auto');
  engine.block.setTextFontSize(alignedBlock, fontSize);

  // Set horizontal alignment to center
  engine.block.setEnum(alignedBlock, 'text/horizontalAlignment', 'Center');

  // Adjust line height (1.5 = 150% of font size)
  engine.block.setFloat(alignedBlock, 'text/lineHeight', 1.5);

  // Adjust letter spacing (0.05 = 5% of font size)
  engine.block.setFloat(alignedBlock, 'text/letterSpacing', 0.05);
```

Horizontal alignment options include 'Left', 'Center', 'Right', and 'Auto'. Line height is a multiplier of the font size (1.5 = 150%), and letter spacing is a proportion of the font size.

## Toggle Bold and Italic

We use convenience methods to toggle bold and italic formatting. These methods switch between the normal and formatted states.

```typescript highlight-toggle-bold-italic
  // Create a text block demonstrating bold/italic toggle
  const toggleBlock = engine.block.create('text');
  engine.block.appendChild(page, toggleBlock);
  engine.block.replaceText(toggleBlock, 'Toggle Bold and Italic');

  // Position below case block
  engine.block.setPositionX(toggleBlock, margin);
  engine.block.setPositionY(toggleBlock, margin + lineSpacing * 4);
  engine.block.setWidthMode(toggleBlock, 'Auto');
  engine.block.setHeightMode(toggleBlock, 'Auto');
  engine.block.setTextFontSize(toggleBlock, fontSize);

  // Set a font that supports bold/italic variants
  const robotoTypeface = {
    name: 'Roboto',
    fonts: [
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
        subFamily: 'Regular',
        weight: 'normal' as const,
        style: 'normal' as const
      },
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf',
        subFamily: 'Bold',
        weight: 'bold' as const,
        style: 'normal' as const
      },
      {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Italic.ttf',
        subFamily: 'Italic',
        weight: 'normal' as const,
        style: 'italic' as const
      }
    ]
  };
  engine.block.setFont(
    toggleBlock,
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
    robotoTypeface
  );

  // Toggle bold for "Bold" (7-11)
  engine.block.toggleBoldFont(toggleBlock, 7, 11);

  // Toggle italic for "Italic" (16-22)
  engine.block.toggleItalicFont(toggleBlock, 16, 22);
```

The `toggleBoldFont()` and `toggleItalicFont()` methods check if the font supports the variant before toggling. Use `canToggleBoldFont()` and `canToggleItalicFont()` to verify availability.

## Modify Text Content

We replace or remove text using range-based operations. The `replaceText()` method substitutes text at specific positions while preserving surrounding formatting.

```typescript highlight-modify-text
  // Create a text block to demonstrate text modification
  const modifyBlock = engine.block.create('text');
  engine.block.appendChild(page, modifyBlock);
  engine.block.replaceText(modifyBlock, 'Hello World');

  // Position below toggle block
  engine.block.setPositionX(modifyBlock, margin);
  engine.block.setPositionY(modifyBlock, margin + lineSpacing * 5);
  engine.block.setWidthMode(modifyBlock, 'Auto');
  engine.block.setHeightMode(modifyBlock, 'Auto');
  engine.block.setTextFontSize(modifyBlock, fontSize);

  // Replace "World" with "CE.SDK" (range 6-11)
  engine.block.replaceText(modifyBlock, 'CE.SDK', 6, 11);
  // Result: "Hello CE.SDK"
```

When range parameters are omitted, `replaceText()` replaces the entire text content. The `removeText()` method deletes text within a specified range.

## Export the Result

We export the scene to an image file using `engine.block.export()`. The server environment allows saving directly to the filesystem.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/add-text.png', buffer);
  console.log('Exported to output/add-text.png');
```

The export supports various formats including PNG, JPEG, and WebP. Server-side rendering enables batch processing and automated workflows.

## Troubleshooting

### Text Not Displaying

- Verify text content is set with `replaceText()` not `setString()` for text property
- Check the block is added to the page hierarchy with `appendChild()`
- Ensure the text block has sufficient width for content to render

### Font Not Loading

- Verify the font URI is accessible and returns a valid font file
- Check that the typeface configuration matches the font file's metadata
- Confirm the font format is supported (TTF, OTF, WOFF, WOFF2)

### Range Styling Not Applying

- Verify range indices are valid UTF-16 code unit positions
- Check that the `from` index is less than the `to` index
- Confirm the font supports the requested weight or style variant

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.create('text')` | Create a new text block |
| `engine.block.replaceText(block, text, from, to)` | Set or replace text content |
| `engine.block.removeText(block, from, to)` | Remove text range |
| `engine.block.setFont(block, uri, typeface)` | Set font for entire block |
| `engine.block.setTextColor(block, color, from, to)` | Set color for range |
| `engine.block.setTextFontWeight(block, weight, from, to)` | Set font weight for range |
| `engine.block.setTextFontStyle(block, style, from, to)` | Set font style for range |
| `engine.block.setTextFontSize(block, size, from, to)` | Set font size for range |
| `engine.block.setTextCase(block, case, from, to)` | Set text case transformation |
| `engine.block.toggleBoldFont(block, from, to)` | Toggle bold weight |
| `engine.block.toggleItalicFont(block, from, to)` | Toggle italic style |
| `engine.block.setHeightMode(block, mode)` | Set height sizing mode |
| `engine.block.setWidthMode(block, mode)` | Set width sizing mode |
| `engine.block.setEnum(block, property, value)` | Set enum property (alignment) |
| `engine.block.setFloat(block, property, value)` | Set float property (spacing) |
| `engine.block.export(block, options)` | Export block to image |

## Next Steps

- [Style Text](./text/styling.md) - Apply fills, strokes, and backgrounds to text
- [Auto-Size Text](./text/auto-size.md) - Configure text blocks to resize dynamically
- [Adjust Text Spacing](./text/adjust-spacing.md) - Fine-tune letter and line spacing
- [Add Emojis](./text/emojis.md) - Display emoji characters with custom fonts
- [Add Text Effects](./text/effects.md) - Apply visual effects to text blocks



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support