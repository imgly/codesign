> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Auto-Resize](./automation/auto-resize.md)

---

Configure blocks to dynamically adjust their dimensions using three sizing modes: Absolute for fixed values, Percent for parent-relative sizing, and Auto for content-driven expansion.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-automation-auto-resize-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-automation-auto-resize-server-js)

CE.SDK provides three sizing modes for controlling block dimensions. Absolute mode uses fixed pixel values. Percent mode sizes blocks relative to their parent container. Auto mode automatically expands blocks to fit their content. You can set width and height modes independently, allowing flexible combinations like fixed width with auto height for text that wraps.

```typescript file=@cesdk_web_examples/guides-automation-auto-resize-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Auto-Resize
 *
 * Demonstrates block sizing modes and responsive layout patterns:
 * - Setting width and height modes (Absolute, Percent, Auto)
 * - Reading computed frame dimensions after layout
 * - Centering text blocks based on computed dimensions
 * - Creating responsive layouts with percentage-based sizing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create a scene with a page
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a text block with Auto sizing mode
  // Auto mode makes the block expand to fit its content
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Auto-Resize Demo');
  engine.block.setTextFontSize(titleBlock, 64);

  // Set width and height modes to Auto
  // The block will automatically size to fit the text content
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);

  // Read computed frame dimensions after layout
  // getFrameWidth/getFrameHeight return the actual rendered size
  const titleWidth = engine.block.getFrameWidth(titleBlock);
  const titleHeight = engine.block.getFrameHeight(titleBlock);

  // eslint-disable-next-line no-console
  console.log(
    `Title dimensions: ${titleWidth.toFixed(0)}x${titleHeight.toFixed(0)} pixels`
  );

  // Calculate centered position using frame dimensions
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const centerX = (pageWidth - titleWidth) / 2;
  const centerY = (pageHeight - titleHeight) / 2 - 100; // Offset up for layout

  // Position the title at center
  engine.block.setPositionX(titleBlock, centerX);
  engine.block.setPositionY(titleBlock, centerY);

  // Create a block using Percent mode for responsive sizing
  // Percent mode sizes the block relative to its parent
  const backgroundBlock = engine.block.create('graphic');
  engine.block.setShape(backgroundBlock, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 0.3
  });
  engine.block.setFill(backgroundBlock, fill);

  // Set to Percent mode - values are normalized (0-1)
  engine.block.setWidthMode(backgroundBlock, 'Percent');
  engine.block.setHeightMode(backgroundBlock, 'Percent');
  engine.block.setWidth(backgroundBlock, 0.8); // 80% of parent width
  engine.block.setHeight(backgroundBlock, 0.3); // 30% of parent height

  // Center the background block
  engine.block.setPositionX(backgroundBlock, pageWidth * 0.1); // 10% margin
  engine.block.setPositionY(backgroundBlock, pageHeight * 0.6);
  engine.block.appendChild(page, backgroundBlock);

  // Create a subtitle with Auto mode
  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(
    subtitleBlock,
    'Text automatically sizes to fit content'
  );
  engine.block.setTextFontSize(subtitleBlock, 32);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);

  // Read computed dimensions and center
  const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  const subtitleCenterX = (pageWidth - subtitleWidth) / 2;
  engine.block.setPositionX(subtitleBlock, subtitleCenterX);
  engine.block.setPositionY(subtitleBlock, pageHeight * 0.7);

  // Verify sizing modes
  const titleWidthMode = engine.block.getWidthMode(titleBlock);
  const titleHeightMode = engine.block.getHeightMode(titleBlock);
  const bgWidthMode = engine.block.getWidthMode(backgroundBlock);
  const bgHeightMode = engine.block.getHeightMode(backgroundBlock);

  // eslint-disable-next-line no-console
  console.log(
    `Title modes: width=${titleWidthMode}, height=${titleHeightMode}`
  );
  // eslint-disable-next-line no-console
  console.log(`Background modes: width=${bgWidthMode}, height=${bgHeightMode}`);

  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/auto-resize-demo.png`, buffer);

  // eslint-disable-next-line no-console
  console.log(`\n✓ Exported auto-resize-demo.png to ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers how to set and query sizing modes, read computed frame dimensions after layout, center blocks using frame dimensions, and create responsive layouts with percentage-based sizing.

## Setup

Initialize the CE.SDK engine for server-side automation:

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

## Create a Scene

Create a scene with a page to work with:

```typescript highlight-create-scene
// Create a scene with a page
engine.scene.create('VerticalStack', {
  page: { size: { width: 800, height: 600 } }
});
const page = engine.block.findByType('page')[0];
```

## Size Modes

CE.SDK supports three sizing modes for block dimensions:

- **Absolute**: Fixed dimensions in design units. The default mode where `setWidth()` and `setHeight()` set exact pixel values.
- **Percent**: Dimensions relative to parent container. A value of 80 makes the block 80% of its parent's size.
- **Auto**: Content-driven sizing. The block expands or contracts to fit its content, primarily useful for text blocks.

## Setting Size Modes

Use `setWidthMode()` and `setHeightMode()` to configure how a block calculates its dimensions. Width and height modes can be set independently.

### Auto Mode for Text

Auto mode makes text blocks expand to fit their content:

```typescript highlight-auto-mode
  // Create a text block with Auto sizing mode
  // Auto mode makes the block expand to fit its content
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Auto-Resize Demo');
  engine.block.setTextFontSize(titleBlock, 64);

  // Set width and height modes to Auto
  // The block will automatically size to fit the text content
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);
```

With Auto mode, the block's dimensions are calculated automatically based on the content. This is useful when the text content varies and you want the block to always fit exactly.

### Percent Mode for Responsive Layouts

Percent mode sizes blocks relative to their parent:

```typescript highlight-percent-mode
  // Create a block using Percent mode for responsive sizing
  // Percent mode sizes the block relative to its parent
  const backgroundBlock = engine.block.create('graphic');
  engine.block.setShape(backgroundBlock, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 0.3
  });
  engine.block.setFill(backgroundBlock, fill);

  // Set to Percent mode - values are normalized (0-1)
  engine.block.setWidthMode(backgroundBlock, 'Percent');
  engine.block.setHeightMode(backgroundBlock, 'Percent');
  engine.block.setWidth(backgroundBlock, 0.8); // 80% of parent width
  engine.block.setHeight(backgroundBlock, 0.3); // 30% of parent height

  // Center the background block
  engine.block.setPositionX(backgroundBlock, pageWidth * 0.1); // 10% margin
  engine.block.setPositionY(backgroundBlock, pageHeight * 0.6);
  engine.block.appendChild(page, backgroundBlock);
```

Percent values represent the percentage of the parent container. A width of 80 with Percent mode means 80% of the parent's width.

## Reading Frame Dimensions

After layout, use `getFrameWidth()` and `getFrameHeight()` to read the computed dimensions:

```typescript highlight-read-frame-dimensions
  // Read computed frame dimensions after layout
  // getFrameWidth/getFrameHeight return the actual rendered size
  const titleWidth = engine.block.getFrameWidth(titleBlock);
  const titleHeight = engine.block.getFrameHeight(titleBlock);

  // eslint-disable-next-line no-console
  console.log(
    `Title dimensions: ${titleWidth.toFixed(0)}x${titleHeight.toFixed(0)} pixels`
  );
```

Frame dimensions return the actual rendered size regardless of the sizing mode. This is essential when using Auto mode since you need the computed size for positioning calculations.

## Centering Blocks

Combine Auto mode with frame dimensions to center blocks based on their actual size:

```typescript highlight-center-block
  // Calculate centered position using frame dimensions
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const centerX = (pageWidth - titleWidth) / 2;
  const centerY = (pageHeight - titleHeight) / 2 - 100; // Offset up for layout

  // Position the title at center
  engine.block.setPositionX(titleBlock, centerX);
  engine.block.setPositionY(titleBlock, centerY);
```

This pattern reads the computed dimensions after Auto sizing and calculates the centered position.

## Additional Auto-Sized Content

You can create multiple auto-sized blocks and position them relative to each other:

```typescript highlight-subtitle-auto
  // Create a subtitle with Auto mode
  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(
    subtitleBlock,
    'Text automatically sizes to fit content'
  );
  engine.block.setTextFontSize(subtitleBlock, 32);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);

  // Read computed dimensions and center
  const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  const subtitleCenterX = (pageWidth - subtitleWidth) / 2;
  engine.block.setPositionX(subtitleBlock, subtitleCenterX);
  engine.block.setPositionY(subtitleBlock, pageHeight * 0.7);
```

## Verifying Size Modes

Query the current size modes to verify your configuration:

```typescript highlight-check-modes
  // Verify sizing modes
  const titleWidthMode = engine.block.getWidthMode(titleBlock);
  const titleHeightMode = engine.block.getHeightMode(titleBlock);
  const bgWidthMode = engine.block.getWidthMode(backgroundBlock);
  const bgHeightMode = engine.block.getHeightMode(backgroundBlock);

  // eslint-disable-next-line no-console
  console.log(
    `Title modes: width=${titleWidthMode}, height=${titleHeightMode}`
  );
  // eslint-disable-next-line no-console
  console.log(`Background modes: width=${bgWidthMode}, height=${bgHeightMode}`);
```

## Export

Export the result to verify the layout:

```typescript highlight-export
  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/auto-resize-demo.png`, buffer);

  // eslint-disable-next-line no-console
  console.log(`\n✓ Exported auto-resize-demo.png to ${outputDir}/`);
```

## Troubleshooting

**Frame dimensions return 0**: Layout may not have updated yet. Read frame dimensions after all content is set and the block is attached to the scene hierarchy.

**Percent mode not working**: The block must have a parent container. Percent mode calculates size relative to the parent's dimensions.

**Auto mode not resizing**: Auto mode works with content that has intrinsic size, primarily text blocks. Graphics require explicit dimensions.

**Unexpected dimensions**: Check which mode is active using `getWidthMode()` and `getHeightMode()`. The mode affects how width and height values are interpreted.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.getWidth(block)` | Get block width in current mode |
| `engine.block.setWidth(block, value)` | Set block width in current mode |
| `engine.block.getWidthMode(block)` | Get current width mode: Absolute, Percent, or Auto |
| `engine.block.setWidthMode(block, mode)` | Set width mode: Absolute, Percent, or Auto |
| `engine.block.getHeight(block)` | Get block height in current mode |
| `engine.block.setHeight(block, value)` | Set block height in current mode |
| `engine.block.getHeightMode(block)` | Get current height mode: Absolute, Percent, or Auto |
| `engine.block.setHeightMode(block, mode)` | Set height mode: Absolute, Percent, or Auto |
| `engine.block.getFrameWidth(block)` | Get computed width after layout |
| `engine.block.getFrameHeight(block)` | Get computed height after layout |
| `engine.block.setPositionX(block, value)` | Set block X position |
| `engine.block.setPositionY(block, value)` | Set block Y position |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support