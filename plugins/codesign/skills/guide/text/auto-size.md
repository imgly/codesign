> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Auto-Size](./text/auto-size.md)

---

Configure text blocks to automatically adapt their dimensions or font size for dynamic content.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-auto-size-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-auto-size-server-js)

CE.SDK provides two approaches for handling dynamic text content. **Auto size modes** let text blocks resize to fit their content, while **automatic font sizing** scales the font to fit within fixed boundaries. These techniques ensure text displays correctly regardless of content length, which is essential for templates and automation workflows.

```typescript file=@cesdk_web_examples/guides-text-auto-size-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Auto-Size
 *
 * Demonstrates text auto-sizing capabilities:
 * - Auto width and height modes for content-fitting text
 * - Fixed dimensions with automatic font sizing
 * - Font size constraints (min/max)
 * - Detecting clipped text
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create text with Auto width and height - grows to fit content
  const autoText = engine.block.create('text');
  engine.block.appendChild(page, autoText);
  engine.block.setWidthMode(autoText, 'Auto');
  engine.block.setHeightMode(autoText, 'Auto');
  engine.block.replaceText(autoText, 'Auto-sized text');
  engine.block.setFloat(autoText, 'text/fontSize', 48);
  engine.block.setPositionX(autoText, 50);
  engine.block.setPositionY(autoText, 50);

  // Create text with fixed width and auto height - wraps and grows vertically
  const wrappedText = engine.block.create('text');
  engine.block.appendChild(page, wrappedText);
  engine.block.setWidthMode(wrappedText, 'Absolute');
  engine.block.setWidth(wrappedText, 250);
  engine.block.setHeightMode(wrappedText, 'Auto');
  engine.block.replaceText(
    wrappedText,
    'This text has a fixed width but auto height, so it wraps to multiple lines'
  );
  engine.block.setFloat(wrappedText, 'text/fontSize', 48);
  engine.block.setPositionX(wrappedText, 50);
  engine.block.setPositionY(wrappedText, 150);

  // Create text with automatic font sizing - scales to fit fixed dimensions
  const scaledText = engine.block.create('text');
  engine.block.appendChild(page, scaledText);
  engine.block.setWidthMode(scaledText, 'Absolute');
  engine.block.setHeightMode(scaledText, 'Absolute');
  engine.block.setWidth(scaledText, 300);
  engine.block.setHeight(scaledText, 80);
  engine.block.setBool(scaledText, 'text/automaticFontSizeEnabled', true);
  engine.block.replaceText(scaledText, 'Auto-scaled font');
  engine.block.setPositionX(scaledText, 50);
  engine.block.setPositionY(scaledText, 350);

  // Add background to visualize the text frame
  engine.block.setBool(scaledText, 'backgroundColor/enabled', true);
  engine.block.setColor(scaledText, 'backgroundColor/color', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  // Create text with font size constraints
  const constrainedText = engine.block.create('text');
  engine.block.appendChild(page, constrainedText);
  engine.block.setWidthMode(constrainedText, 'Absolute');
  engine.block.setHeightMode(constrainedText, 'Absolute');
  engine.block.setWidth(constrainedText, 300);
  engine.block.setHeight(constrainedText, 80);
  engine.block.setBool(constrainedText, 'text/automaticFontSizeEnabled', true);

  // Set min and max font size constraints
  engine.block.setFloat(constrainedText, 'text/minAutomaticFontSize', 12);
  engine.block.setFloat(constrainedText, 'text/maxAutomaticFontSize', 48);

  engine.block.replaceText(
    constrainedText,
    'Font size constrained between 12-48pt'
  );
  engine.block.setPositionX(constrainedText, 50);
  engine.block.setPositionY(constrainedText, 460);

  // Add background to visualize the text frame
  engine.block.setBool(constrainedText, 'backgroundColor/enabled', true);
  engine.block.setColor(constrainedText, 'backgroundColor/color', {
    r: 0.9,
    g: 0.95,
    b: 1.0,
    a: 1.0
  });

  // Query the size modes and automatic font size state
  const widthMode = engine.block.getWidthMode(autoText);
  const heightMode = engine.block.getHeightMode(autoText);
  const isAutoFontSize = engine.block.getBool(
    scaledText,
    'text/automaticFontSizeEnabled'
  );

  console.log('Auto text width mode:', widthMode);
  console.log('Auto text height mode:', heightMode);
  console.log('Scaled text has automatic font sizing:', isAutoFontSize);

  // Check for clipped lines (text exceeding frame bounds)
  const hasClippedLines = engine.block.getBool(
    scaledText,
    'text/hasClippedLines'
  );
  console.log('Scaled text has clipped lines:', hasClippedLines);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/text-auto-size.png', buffer);
  console.log('✅ Exported text auto-size demo to output/text-auto-size.png');
} finally {
  engine.dispose();
}
```

This guide covers configuring size modes, enabling automatic font sizing, setting font size constraints, and detecting clipped text.

## Text Size Modes

CE.SDK offers three size modes for text block dimensions: 'Absolute', 'Percent', and 'Auto'. We use `engine.block.setWidthMode()` and `engine.block.setHeightMode()` to configure how text blocks handle their dimensions.

### Auto Width and Height

When both dimensions use 'Auto' mode, the text block expands freely to fit its content. This works well for single-line text that grows horizontally.

```typescript highlight=highlight-auto-width-height
// Create text with Auto width and height - grows to fit content
const autoText = engine.block.create('text');
engine.block.appendChild(page, autoText);
engine.block.setWidthMode(autoText, 'Auto');
engine.block.setHeightMode(autoText, 'Auto');
engine.block.replaceText(autoText, 'Auto-sized text');
engine.block.setFloat(autoText, 'text/fontSize', 48);
engine.block.setPositionX(autoText, 50);
engine.block.setPositionY(autoText, 50);
```

We set both width and height modes to 'Auto', and the text block automatically sizes itself based on the content and font size.

### Fixed Width with Auto Height

For wrapped multi-line text, we set a specific width while allowing height to adjust automatically. The text wraps within the defined width and the block grows vertically as needed.

```typescript highlight=highlight-fixed-width-auto-height
// Create text with fixed width and auto height - wraps and grows vertically
const wrappedText = engine.block.create('text');
engine.block.appendChild(page, wrappedText);
engine.block.setWidthMode(wrappedText, 'Absolute');
engine.block.setWidth(wrappedText, 250);
engine.block.setHeightMode(wrappedText, 'Auto');
engine.block.replaceText(
  wrappedText,
  'This text has a fixed width but auto height, so it wraps to multiple lines'
);
engine.block.setFloat(wrappedText, 'text/fontSize', 48);
engine.block.setPositionX(wrappedText, 50);
engine.block.setPositionY(wrappedText, 150);
```

This pattern is useful for template placeholders where the width should remain constant but content length varies.

### Querying Size Modes

We check current modes using `engine.block.getWidthMode()` and `engine.block.getHeightMode()`. These return 'Absolute', 'Percent', or 'Auto'.

```typescript highlight=highlight-query-size-modes
  // Query the size modes and automatic font size state
  const widthMode = engine.block.getWidthMode(autoText);
  const heightMode = engine.block.getHeightMode(autoText);
  const isAutoFontSize = engine.block.getBool(
    scaledText,
    'text/automaticFontSizeEnabled'
  );

  console.log('Auto text width mode:', widthMode);
  console.log('Auto text height mode:', heightMode);
  console.log('Scaled text has automatic font sizing:', isAutoFontSize);
```

## Automatic Font Sizing

For text blocks with fixed dimensions, we enable automatic font sizing to scale the font to fit within the frame. The engine calculates the largest font size that fits the content.

```typescript highlight=highlight-automatic-font-sizing
  // Create text with automatic font sizing - scales to fit fixed dimensions
  const scaledText = engine.block.create('text');
  engine.block.appendChild(page, scaledText);
  engine.block.setWidthMode(scaledText, 'Absolute');
  engine.block.setHeightMode(scaledText, 'Absolute');
  engine.block.setWidth(scaledText, 300);
  engine.block.setHeight(scaledText, 80);
  engine.block.setBool(scaledText, 'text/automaticFontSizeEnabled', true);
  engine.block.replaceText(scaledText, 'Auto-scaled font');
  engine.block.setPositionX(scaledText, 50);
  engine.block.setPositionY(scaledText, 350);

  // Add background to visualize the text frame
  engine.block.setBool(scaledText, 'backgroundColor/enabled', true);
  engine.block.setColor(scaledText, 'backgroundColor/color', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });
```

We first set both width and height to 'Absolute' mode with specific dimensions, then enable automatic font sizing with `text/automaticFontSizeEnabled`. The background helps visualize the text frame boundaries.

### Setting Font Size Constraints

We constrain the automatic scaling range using `text/minAutomaticFontSize` and `text/maxAutomaticFontSize` properties. These constraints apply only to the automatic sizing algorithm. This prevents text from becoming too small to read or too large for the design when content length varies.

```typescript highlight=highlight-font-size-constraints
  // Create text with font size constraints
  const constrainedText = engine.block.create('text');
  engine.block.appendChild(page, constrainedText);
  engine.block.setWidthMode(constrainedText, 'Absolute');
  engine.block.setHeightMode(constrainedText, 'Absolute');
  engine.block.setWidth(constrainedText, 300);
  engine.block.setHeight(constrainedText, 80);
  engine.block.setBool(constrainedText, 'text/automaticFontSizeEnabled', true);

  // Set min and max font size constraints
  engine.block.setFloat(constrainedText, 'text/minAutomaticFontSize', 12);
  engine.block.setFloat(constrainedText, 'text/maxAutomaticFontSize', 48);

  engine.block.replaceText(
    constrainedText,
    'Font size constrained between 12-48pt'
  );
  engine.block.setPositionX(constrainedText, 50);
  engine.block.setPositionY(constrainedText, 460);

  // Add background to visualize the text frame
  engine.block.setBool(constrainedText, 'backgroundColor/enabled', true);
  engine.block.setColor(constrainedText, 'backgroundColor/color', {
    r: 0.9,
    g: 0.95,
    b: 1.0,
    a: 1.0
  });
```

With constraints set, the font size automatically scales within the 12-48pt range as content length changes.

## Text Clipping

When text exceeds its frame boundaries without auto-sizing, lines may be clipped. We use `engine.block.getBool()` with `text/hasClippedLines` to detect overflow.

```typescript highlight=highlight-text-clipping
// Check for clipped lines (text exceeding frame bounds)
const hasClippedLines = engine.block.getBool(
  scaledText,
  'text/hasClippedLines'
);
console.log('Scaled text has clipped lines:', hasClippedLines);
```

Detecting clipped text helps identify when automatic font sizing should be enabled or when the frame dimensions need adjustment.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.setWidthMode()` | Set width mode: 'Absolute', 'Percent', 'Auto' |
| `engine.block.getWidthMode()` | Query current width mode |
| `engine.block.setHeightMode()` | Set height mode: 'Absolute', 'Percent', 'Auto' |
| `engine.block.getHeightMode()` | Query current height mode |
| `engine.block.setWidth()` | Set block width value |
| `engine.block.setHeight()` | Set block height value |
| `engine.block.setBool()` | Enable/disable boolean properties |
| `engine.block.getBool()` | Query boolean property values |
| `engine.block.setFloat()` | Set numeric property values |
| `engine.block.getFloat()` | Query numeric property values |

## Troubleshooting

**Text not resizing**: Verify the correct size mode is set. Auto mode requires both `setWidthMode()` and `setHeightMode()` to be called.

**Font size not scaling**: Ensure `text/automaticFontSizeEnabled` is true and the block has fixed (Absolute) dimensions.

**Text too small with automatic sizing**: Set an appropriate `text/minAutomaticFontSize` to ensure readability.

**Text clipped unexpectedly**: Check if the frame has fixed dimensions without automatic font sizing. Consider enabling `text/automaticFontSizeEnabled` or using Auto height mode.

**Auto mode ignored**: Make sure no conflicting explicit size values override the Auto behavior.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support