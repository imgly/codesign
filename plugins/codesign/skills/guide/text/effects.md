> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Effects](./text/effects.md)

---

Apply visual effects to text blocks programmatically including drop shadows and stroke outlines.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-effects-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-effects-server-js)

CE.SDK provides visual effect capabilities for text blocks through the Block API. We can apply drop shadows for depth and stroke outlines for text borders.

```typescript file=@cesdk_web_examples/guides-text-effects-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Effects
 *
 * Demonstrates applying visual effects to text blocks:
 * - Drop shadows for depth
 * - Outline effect for text borders
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 500 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a text block with drop shadow
  const shadowText = engine.block.create('text');
  engine.block.replaceText(shadowText, 'Drop Shadow');
  engine.block.setTextFontSize(shadowText, 90);
  engine.block.setWidthMode(shadowText, 'Auto');
  engine.block.setHeightMode(shadowText, 'Auto');
  engine.block.setPositionX(shadowText, 50);
  engine.block.setPositionY(shadowText, 50);
  engine.block.appendChild(page, shadowText);

  // Enable and configure drop shadow
  engine.block.setDropShadowEnabled(shadowText, true);
  engine.block.setDropShadowColor(shadowText, {
    r: 0,
    g: 0,
    b: 0,
    a: 0.6
  });
  engine.block.setDropShadowOffsetX(shadowText, 5);
  engine.block.setDropShadowOffsetY(shadowText, 5);
  engine.block.setDropShadowBlurRadiusX(shadowText, 10);
  engine.block.setDropShadowBlurRadiusY(shadowText, 10);

  // Create a text block with stroke outline
  const outlineText = engine.block.create('text');
  engine.block.replaceText(outlineText, 'Outline');
  engine.block.setTextFontSize(outlineText, 90);
  engine.block.setWidthMode(outlineText, 'Auto');
  engine.block.setHeightMode(outlineText, 'Auto');
  engine.block.setPositionX(outlineText, 50);
  engine.block.setPositionY(outlineText, 180);
  engine.block.appendChild(page, outlineText);

  // Enable and configure stroke
  engine.block.setStrokeEnabled(outlineText, true);
  engine.block.setStrokeWidth(outlineText, 2);
  engine.block.setStrokeColor(outlineText, {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1.0
  });
  engine.block.setStrokeStyle(outlineText, 'Solid');
  engine.block.setStrokePosition(outlineText, 'Center');

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/text-effects.png', buffer);
  console.log('✅ Exported text effects to output/text-effects.png');
} finally {
  engine.dispose();
}
```

This guide covers adding drop shadows and stroke outlines to text blocks programmatically.

## Drop Shadows

We add depth to text with drop shadows using dedicated shadow APIs. We enable with `setDropShadowEnabled()` and configure color, offset, and blur properties.

```typescript highlight-drop-shadow
  // Create a text block with drop shadow
  const shadowText = engine.block.create('text');
  engine.block.replaceText(shadowText, 'Drop Shadow');
  engine.block.setTextFontSize(shadowText, 90);
  engine.block.setWidthMode(shadowText, 'Auto');
  engine.block.setHeightMode(shadowText, 'Auto');
  engine.block.setPositionX(shadowText, 50);
  engine.block.setPositionY(shadowText, 50);
  engine.block.appendChild(page, shadowText);

  // Enable and configure drop shadow
  engine.block.setDropShadowEnabled(shadowText, true);
  engine.block.setDropShadowColor(shadowText, {
    r: 0,
    g: 0,
    b: 0,
    a: 0.6
  });
  engine.block.setDropShadowOffsetX(shadowText, 5);
  engine.block.setDropShadowOffsetY(shadowText, 5);
  engine.block.setDropShadowBlurRadiusX(shadowText, 10);
  engine.block.setDropShadowBlurRadiusY(shadowText, 10);
```

The drop shadow API provides control over color, position, and blur. The offset values position the shadow relative to the text, while the blur radius controls shadow softness. Horizontal and vertical blur can be configured independently for asymmetric effects.

## Stroke Outlines

We add a colored border around text using stroke APIs. We enable stroke with `setStrokeEnabled()`, then configure width, color, style, and position.

```typescript highlight-stroke
  // Create a text block with stroke outline
  const outlineText = engine.block.create('text');
  engine.block.replaceText(outlineText, 'Outline');
  engine.block.setTextFontSize(outlineText, 90);
  engine.block.setWidthMode(outlineText, 'Auto');
  engine.block.setHeightMode(outlineText, 'Auto');
  engine.block.setPositionX(outlineText, 50);
  engine.block.setPositionY(outlineText, 180);
  engine.block.appendChild(page, outlineText);

  // Enable and configure stroke
  engine.block.setStrokeEnabled(outlineText, true);
  engine.block.setStrokeWidth(outlineText, 2);
  engine.block.setStrokeColor(outlineText, {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1.0
  });
  engine.block.setStrokeStyle(outlineText, 'Solid');
  engine.block.setStrokePosition(outlineText, 'Center');
```

The stroke width is specified in pixels. Text blocks support `'Center'`, `'Inner'`, and `'Outer'` stroke positioning via `setStrokePosition()`. Stroke styles include `'Solid'`, `'Dashed'`, `'Dotted'`, and other line patterns.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.supportsDropShadow()` | Check if block supports drop shadows |
| `engine.block.setDropShadowEnabled()` | Enable or disable drop shadow |
| `engine.block.setDropShadowColor()` | Set shadow color |
| `engine.block.setDropShadowOffsetX()` | Set horizontal shadow offset |
| `engine.block.setDropShadowOffsetY()` | Set vertical shadow offset |
| `engine.block.setDropShadowBlurRadiusX()` | Set horizontal blur radius |
| `engine.block.setDropShadowBlurRadiusY()` | Set vertical blur radius |
| `engine.block.setStrokeEnabled()` | Enable or disable stroke |
| `engine.block.setStrokeWidth()` | Set stroke width in pixels |
| `engine.block.setStrokeColor()` | Set stroke color |
| `engine.block.setStrokeStyle()` | Set stroke style (Solid, Dashed, etc.) |

## Troubleshooting

**Drop shadow not visible**: Ensure `setDropShadowEnabled()` is called after configuring properties. Verify `supportsDropShadow()` returns true for the block.

**Stroke not visible**: Ensure `setStrokeEnabled()` is called with `true` and stroke width is greater than 0.

**Stroke too thick or thin**: Adjust the value passed to `setStrokeWidth()` to control outline thickness.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support