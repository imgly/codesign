> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Emojis](./text/emojis.md)

---

Configure emoji rendering in CE.SDK text blocks using a dedicated emoji font for consistent cross-platform display.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-emojis-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-emojis-server-js)

Emojis are Unicode characters representing pictographic symbols. They can be single code points (😀), multi-character sequences (flags like 🇩🇪), ZWJ-joined combinations (👨‍👩‍👧), or skin tone variants (👋🏽). CE.SDK renders text using an internal rendering system that requires an explicit emoji font. It uses Noto Color Emoji by default for consistent output across all environments.

```typescript file=@cesdk_web_examples/guides-text-emojis-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Emojis
 *
 * Demonstrates emoji rendering configuration:
 * - Understanding the default emoji font (Noto Color Emoji)
 * - Getting and setting the emoji font URI
 * - Creating text blocks with emojis
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

  // CE.SDK uses Noto Color Emoji by default for consistent cross-platform rendering
  // Get the current emoji font URI
  const defaultEmojiFontUri = engine.editor.getSetting(
    'defaultEmojiFontFileUri'
  );
  console.log('Default emoji font URI:', defaultEmojiFontUri);

  // You can set a custom emoji font if needed
  // engine.editor.setSetting(
  //   'defaultEmojiFontFileUri',
  //   'https://your-cdn.com/fonts/CustomEmoji.ttf'
  // );

  // For this guide, we use the default Noto Color Emoji font
  // which is already configured in CE.SDK

  // Create a text block with emoji content
  const textBlock = engine.block.create('text');
  engine.block.appendChild(page, textBlock);

  // Set text content with emojis
  engine.block.replaceText(textBlock, 'Hello World! 🎉🚀✨');

  // Configure text appearance
  engine.block.setTextFontSize(textBlock, 64);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');

  // Position the text block
  engine.block.setPositionX(textBlock, 50);
  engine.block.setPositionY(textBlock, 100);

  // Create additional text blocks demonstrating various emoji types

  // Single emoji characters
  const singleEmojis = engine.block.create('text');
  engine.block.appendChild(page, singleEmojis);
  engine.block.replaceText(singleEmojis, 'Single emojis: 😀 👍 ❤️ ⭐');
  engine.block.setTextFontSize(singleEmojis, 36);
  engine.block.setWidthMode(singleEmojis, 'Auto');
  engine.block.setHeightMode(singleEmojis, 'Auto');
  engine.block.setPositionX(singleEmojis, 50);
  engine.block.setPositionY(singleEmojis, 200);

  // Flag emojis (multi-character sequences)
  const flagEmojis = engine.block.create('text');
  engine.block.appendChild(page, flagEmojis);
  engine.block.replaceText(flagEmojis, 'Flags: 🇩🇪 🇺🇸 🇯🇵 🇬🇧');
  engine.block.setTextFontSize(flagEmojis, 36);
  engine.block.setWidthMode(flagEmojis, 'Auto');
  engine.block.setHeightMode(flagEmojis, 'Auto');
  engine.block.setPositionX(flagEmojis, 50);
  engine.block.setPositionY(flagEmojis, 270);

  // ZWJ (Zero Width Joiner) sequences
  const familyEmojis = engine.block.create('text');
  engine.block.appendChild(page, familyEmojis);
  engine.block.replaceText(familyEmojis, 'Families: 👨‍👩‍👧 👨‍👩‍👦‍👦 👩‍👦');
  engine.block.setTextFontSize(familyEmojis, 36);
  engine.block.setWidthMode(familyEmojis, 'Auto');
  engine.block.setHeightMode(familyEmojis, 'Auto');
  engine.block.setPositionX(familyEmojis, 50);
  engine.block.setPositionY(familyEmojis, 340);

  // Skin tone variants
  const skinToneEmojis = engine.block.create('text');
  engine.block.appendChild(page, skinToneEmojis);
  engine.block.replaceText(skinToneEmojis, 'Skin tones: 👋 👋🏻 👋🏽 👋🏿');
  engine.block.setTextFontSize(skinToneEmojis, 36);
  engine.block.setWidthMode(skinToneEmojis, 'Auto');
  engine.block.setHeightMode(skinToneEmojis, 'Auto');
  engine.block.setPositionX(skinToneEmojis, 50);
  engine.block.setPositionY(skinToneEmojis, 410);

  // Zoom to show all content
  engine.scene.zoomToBlock(page, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/text-emojis.png', buffer);
  console.log('✅ Exported text with emojis to output/text-emojis.png');
} finally {
  engine.dispose();
}
```

This guide covers understanding the default emoji font, configuring a custom emoji font, and adding text with emojis programmatically.

## Default Emoji Font

CE.SDK's Node.js packages bundle Noto Color Emoji (~9.9 MB, PNG-based) inside their npm packages and use it by default — no download from the IMG.LY CDN is needed. This ensures identical emoji rendering across all platforms—documents generated on different servers produce the same visual output. No configuration is needed; emoji rendering works out of the box.

We retrieve the current emoji font URI using `engine.editor.getSetting()`:

```typescript highlight-default-emoji-font
// CE.SDK uses Noto Color Emoji by default for consistent cross-platform rendering
// Get the current emoji font URI
const defaultEmojiFontUri = engine.editor.getSetting(
  'defaultEmojiFontFileUri'
);
console.log('Default emoji font URI:', defaultEmojiFontUri);
```

## Configuring the Emoji Font

We can change the emoji font using `engine.editor.setSetting()`. The URI can point to any accessible URL, CDN, or local file containing an emoji font.

```typescript highlight-configure-emoji-font
  // You can set a custom emoji font if needed
  // engine.editor.setSetting(
  //   'defaultEmojiFontFileUri',
  //   'https://your-cdn.com/fonts/CustomEmoji.ttf'
  // );

  // For this guide, we use the default Noto Color Emoji font
  // which is already configured in CE.SDK
```

## Adding Emojis to Text Blocks

We create text blocks and add emoji content using `engine.block.replaceText()`. Emojis are inserted directly as Unicode characters:

```typescript highlight-create-text-with-emojis
  // Create a text block with emoji content
  const textBlock = engine.block.create('text');
  engine.block.appendChild(page, textBlock);

  // Set text content with emojis
  engine.block.replaceText(textBlock, 'Hello World! 🎉🚀✨');

  // Configure text appearance
  engine.block.setTextFontSize(textBlock, 64);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');

  // Position the text block
  engine.block.setPositionX(textBlock, 50);
  engine.block.setPositionY(textBlock, 100);
```

CE.SDK handles all emoji types automatically—single characters, flag sequences, ZWJ combinations, and skin tone variants:

```typescript highlight-emoji-examples
  // Create additional text blocks demonstrating various emoji types

  // Single emoji characters
  const singleEmojis = engine.block.create('text');
  engine.block.appendChild(page, singleEmojis);
  engine.block.replaceText(singleEmojis, 'Single emojis: 😀 👍 ❤️ ⭐');
  engine.block.setTextFontSize(singleEmojis, 36);
  engine.block.setWidthMode(singleEmojis, 'Auto');
  engine.block.setHeightMode(singleEmojis, 'Auto');
  engine.block.setPositionX(singleEmojis, 50);
  engine.block.setPositionY(singleEmojis, 200);

  // Flag emojis (multi-character sequences)
  const flagEmojis = engine.block.create('text');
  engine.block.appendChild(page, flagEmojis);
  engine.block.replaceText(flagEmojis, 'Flags: 🇩🇪 🇺🇸 🇯🇵 🇬🇧');
  engine.block.setTextFontSize(flagEmojis, 36);
  engine.block.setWidthMode(flagEmojis, 'Auto');
  engine.block.setHeightMode(flagEmojis, 'Auto');
  engine.block.setPositionX(flagEmojis, 50);
  engine.block.setPositionY(flagEmojis, 270);

  // ZWJ (Zero Width Joiner) sequences
  const familyEmojis = engine.block.create('text');
  engine.block.appendChild(page, familyEmojis);
  engine.block.replaceText(familyEmojis, 'Families: 👨‍👩‍👧 👨‍👩‍👦‍👦 👩‍👦');
  engine.block.setTextFontSize(familyEmojis, 36);
  engine.block.setWidthMode(familyEmojis, 'Auto');
  engine.block.setHeightMode(familyEmojis, 'Auto');
  engine.block.setPositionX(familyEmojis, 50);
  engine.block.setPositionY(familyEmojis, 340);

  // Skin tone variants
  const skinToneEmojis = engine.block.create('text');
  engine.block.appendChild(page, skinToneEmojis);
  engine.block.replaceText(skinToneEmojis, 'Skin tones: 👋 👋🏻 👋🏽 👋🏿');
  engine.block.setTextFontSize(skinToneEmojis, 36);
  engine.block.setWidthMode(skinToneEmojis, 'Auto');
  engine.block.setHeightMode(skinToneEmojis, 'Auto');
  engine.block.setPositionX(skinToneEmojis, 50);
  engine.block.setPositionY(skinToneEmojis, 410);
```

## The `forceSystemEmojis` Setting

CE.SDK has a `forceSystemEmojis` setting (default: `true`). In server environments, this setting has no practical effect because the engine always uses `defaultEmojiFontFileUri` for emoji characters. The setting exists for cross-platform compatibility but doesn't change emoji rendering behavior.

## Troubleshooting

**Emojis look different than expected**: CE.SDK uses Noto Color Emoji by default. To use a different emoji style, change `defaultEmojiFontFileUri` to another emoji font.

**Missing emojis**: The emoji font may not support all Unicode emoji characters. Ensure your custom emoji font has comprehensive Unicode coverage.

**Font size**: The default Noto Color Emoji font is ~9.9 MB and ships inside the npm package, so no download occurs at runtime. If you configure a custom remote emoji font, consider caching it locally.

**Export without emojis**: If you configured a custom emoji font URI, verify it is accessible from your server environment — network restrictions may block external font downloads.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.editor.getSetting('defaultEmojiFontFileUri')` | Get the current emoji font URI |
| `engine.editor.setSetting('defaultEmojiFontFileUri', uri)` | Set a custom emoji font URI |
| `engine.block.create('text')` | Create a text block |
| `engine.block.replaceText(id, text)` | Set text content including emojis |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support