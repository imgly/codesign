> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Adjust Spacing](./text/adjust-spacing.md)

---

Control letter spacing, line height, and paragraph spacing in text blocks using the Block API.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-adjust-spacing-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-adjust-spacing-server-js)

CE.SDK provides three text spacing properties: `text/letterSpacing`, `text/lineHeight`, and `text/paragraphSpacing`. All are float properties controlled via `engine.block.setFloat()` and `engine.block.getFloat()`.

```typescript file=@cesdk_web_examples/guides-text-adjust-spacing-server-js/server-js.ts reference-only
import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Adjust Text Spacing
 *
 * Demonstrates programmatic text spacing capabilities:
 * - Letter spacing (tracking)
 * - Line height (leading)
 * - Paragraph spacing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create("VerticalStack", {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType("page")[0];

  // Text block 1: Letter Spacing Demo
  const textLetterSpacing = engine.block.create("text");
  engine.block.appendChild(page, textLetterSpacing);
  engine.block.setPositionX(textLetterSpacing, 50);
  engine.block.setPositionY(textLetterSpacing, 30);
  engine.block.setWidth(textLetterSpacing, 700);
  engine.block.setHeightMode(textLetterSpacing, "Auto");
  engine.block.replaceText(textLetterSpacing, "CREATIVE STUDIO");
  engine.block.setTextFontSize(textLetterSpacing, 48);

  // Set letter spacing - controls space between characters
  // Positive values increase spacing, negative values tighten characters
  engine.block.setFloat(textLetterSpacing, "text/letterSpacing", 0.1);

  // Read current letter spacing value
  const letterSpacing = engine.block.getFloat(
    textLetterSpacing,
    "text/letterSpacing",
  );
  console.log("Letter spacing:", letterSpacing);

  // Text block 2: Line Height Demo
  const textLineHeight = engine.block.create("text");
  engine.block.appendChild(page, textLineHeight);
  engine.block.setPositionX(textLineHeight, 50);
  engine.block.setPositionY(textLineHeight, 150);
  engine.block.setWidth(textLineHeight, 700);
  engine.block.setHeightMode(textLineHeight, "Auto");
  engine.block.replaceText(
    textLineHeight,
    "Design your ideas\nBring them to life",
  );
  engine.block.setTextFontSize(textLineHeight, 48);

  // Set line height - controls vertical distance between lines
  // Values are multipliers of font size (1.5 = 150% of font size)
  engine.block.setFloat(textLineHeight, "text/lineHeight", 1.8);

  // Read current line height value
  const lineHeight = engine.block.getFloat(textLineHeight, "text/lineHeight");
  console.log("Line height:", lineHeight);

  // Text block 3: Paragraph Spacing Demo
  const textParagraphSpacing = engine.block.create("text");
  engine.block.appendChild(page, textParagraphSpacing);
  engine.block.setPositionX(textParagraphSpacing, 50);
  engine.block.setPositionY(textParagraphSpacing, 350);
  engine.block.setWidth(textParagraphSpacing, 700);
  engine.block.setHeightMode(textParagraphSpacing, "Auto");
  engine.block.replaceText(textParagraphSpacing, "Start Creating\nJoin Today");
  engine.block.setTextFontSize(textParagraphSpacing, 48);

  // Set paragraph spacing - adds space after paragraph breaks
  engine.block.setFloat(textParagraphSpacing, "text/paragraphSpacing", 4);

  // Read current paragraph spacing value
  const paragraphSpacing = engine.block.getFloat(
    textParagraphSpacing,
    "text/paragraphSpacing",
  );
  console.log("Paragraph spacing:", paragraphSpacing);

  // Zoom to show all text blocks
  engine.scene.zoomToBlock(page, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-spacing.png", buffer);
  console.log("Exported text with spacing to output/text-spacing.png");
} finally {
  engine.dispose();
}
```

This guide covers how to adjust letter spacing between characters, line height between lines, and paragraph spacing between paragraphs.

## Letter Spacing

We control the horizontal space between characters using `engine.block.setFloat()` with the `text/letterSpacing` property. Positive values increase spacing, negative values tighten characters.

```typescript highlight-letter-spacing
  // Text block 1: Letter Spacing Demo
  const textLetterSpacing = engine.block.create("text");
  engine.block.appendChild(page, textLetterSpacing);
  engine.block.setPositionX(textLetterSpacing, 50);
  engine.block.setPositionY(textLetterSpacing, 30);
  engine.block.setWidth(textLetterSpacing, 700);
  engine.block.setHeightMode(textLetterSpacing, "Auto");
  engine.block.replaceText(textLetterSpacing, "CREATIVE STUDIO");
  engine.block.setTextFontSize(textLetterSpacing, 48);

  // Set letter spacing - controls space between characters
  // Positive values increase spacing, negative values tighten characters
  engine.block.setFloat(textLetterSpacing, "text/letterSpacing", 0.1);

  // Read current letter spacing value
  const letterSpacing = engine.block.getFloat(
    textLetterSpacing,
    "text/letterSpacing",
  );
  console.log("Letter spacing:", letterSpacing);
```

Letter spacing (also known as tracking) helps adjust text density for improved readability or visual effect.

## Line Height

We control the vertical distance between lines using `engine.block.setFloat()` with the `text/lineHeight` property. Values are multipliers of the font size—for example, 1.5 means 150% of the font size.

```typescript highlight-line-height
  // Text block 2: Line Height Demo
  const textLineHeight = engine.block.create("text");
  engine.block.appendChild(page, textLineHeight);
  engine.block.setPositionX(textLineHeight, 50);
  engine.block.setPositionY(textLineHeight, 150);
  engine.block.setWidth(textLineHeight, 700);
  engine.block.setHeightMode(textLineHeight, "Auto");
  engine.block.replaceText(
    textLineHeight,
    "Design your ideas\nBring them to life",
  );
  engine.block.setTextFontSize(textLineHeight, 48);

  // Set line height - controls vertical distance between lines
  // Values are multipliers of font size (1.5 = 150% of font size)
  engine.block.setFloat(textLineHeight, "text/lineHeight", 1.8);

  // Read current line height value
  const lineHeight = engine.block.getFloat(textLineHeight, "text/lineHeight");
  console.log("Line height:", lineHeight);
```

Line height affects multi-line text. A single line of text won't show visible differences.

## Paragraph Spacing

We add vertical space between paragraphs using `engine.block.setFloat()` with the `text/paragraphSpacing` property. The value is added after each paragraph break (newline characters in the text content).

```typescript highlight-paragraph-spacing
  // Text block 3: Paragraph Spacing Demo
  const textParagraphSpacing = engine.block.create("text");
  engine.block.appendChild(page, textParagraphSpacing);
  engine.block.setPositionX(textParagraphSpacing, 50);
  engine.block.setPositionY(textParagraphSpacing, 350);
  engine.block.setWidth(textParagraphSpacing, 700);
  engine.block.setHeightMode(textParagraphSpacing, "Auto");
  engine.block.replaceText(textParagraphSpacing, "Start Creating\nJoin Today");
  engine.block.setTextFontSize(textParagraphSpacing, 48);

  // Set paragraph spacing - adds space after paragraph breaks
  engine.block.setFloat(textParagraphSpacing, "text/paragraphSpacing", 4);

  // Read current paragraph spacing value
  const paragraphSpacing = engine.block.getFloat(
    textParagraphSpacing,
    "text/paragraphSpacing",
  );
  console.log("Paragraph spacing:", paragraphSpacing);
```

Paragraph spacing only affects text with actual paragraph breaks. Single paragraphs won't show visible differences.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.setFloat()` | Set numeric spacing property values |
| `engine.block.getFloat()` | Get current spacing property values |

### Properties Reference

| Property | Type | Purpose |
|----------|------|---------|
| `text/letterSpacing` | Float | Space between characters (tracking) |
| `text/lineHeight` | Float | Multiplier for vertical line distance |
| `text/paragraphSpacing` | Float | Space added after paragraph breaks |

## Troubleshooting

**Spacing changes not visible**: Ensure the text block contains enough content to show the effect—multiple characters for letter spacing, multiple lines for line height, multiple paragraphs for paragraph spacing.

**Unexpected line height behavior**: Line height is a multiplier of font size, not an absolute value. A value of 1.5 means 150% of the current font size.

**Paragraph spacing not working**: Verify the text content contains actual paragraph breaks (newline characters).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support