> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Styling](./text/styling.md)

---

Style text blocks programmatically with colors, backgrounds, typefaces, and formatting.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-styling-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-styling-server-js)

CE.SDK provides comprehensive text styling capabilities through the Block API. We can control text appearance through colors, backgrounds, typefaces, font weights, and case transformations, with the ability to apply different styling to specific character ranges within a single text block.

```typescript file=@cesdk_web_examples/guides-text-styling-server-js/server-js.ts reference-only
import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Styling
 *
 * Demonstrates programmatic text styling capabilities:
 * - Editing text content
 * - Applying colors to character ranges
 * - Adding styled backgrounds
 * - Text case transformations
 * - Managing typefaces and fonts
 * - Toggling font weights and styles
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

  // Create a text block to demonstrate styling
  const text = engine.block.create("text");
  engine.block.appendChild(page, text);
  engine.block.setPositionX(text, 100);
  engine.block.setPositionY(text, 100);
  engine.block.setWidthMode(text, "Auto");
  engine.block.setHeightMode(text, "Auto");

  // Edit text content using replaceText()
  engine.block.replaceText(text, "Hello World");

  // Add a "!" at the end by inserting at position 11
  engine.block.replaceText(text, "!", 11);

  // Replace "World" with "CE.SDK"
  engine.block.replaceText(text, "CE.SDK", 6, 11);

  // Remove "Hello " (first 6 characters)
  engine.block.removeText(text, 0, 6);

  // Apply colors to the entire text
  engine.block.setTextColor(text, { r: 1.0, g: 0.65, b: 0.0, a: 1.0 }); // Orange

  // Apply different color to a specific range (characters 0-2)
  engine.block.setTextColor(text, { r: 0.2, g: 0.6, b: 1.0, a: 1.0 }, 0, 2); // Blue

  // Enable and configure text background
  engine.block.setBool(text, "backgroundColor/enabled", true);

  // Set background color
  engine.block.setColor(text, "backgroundColor/color", {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0,
  }); // Light gray

  // Configure padding on all sides
  engine.block.setFloat(text, "backgroundColor/paddingLeft", 10);
  engine.block.setFloat(text, "backgroundColor/paddingRight", 10);
  engine.block.setFloat(text, "backgroundColor/paddingTop", 8);
  engine.block.setFloat(text, "backgroundColor/paddingBottom", 8);

  // Add rounded corners
  engine.block.setFloat(text, "backgroundColor/cornerRadius", 8);

  // Background inherits text block animations when writing style is 'Block'
  const animation = engine.block.createAnimation("slide");
  engine.block.setEnum(animation, "textAnimationWritingStyle", "Block");
  engine.block.setInAnimation(text, animation);

  // Apply text case transformation (doesn't modify the string value)
  engine.block.setTextCase(text, "Uppercase");

  // Define a typeface with multiple font variants
  const typeface = {
    name: "Roboto",
    fonts: [
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf",
        subFamily: "Regular",
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf",
        subFamily: "Bold",
        weight: "bold" as const,
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf",
        subFamily: "Italic",
        style: "italic" as const,
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf",
        subFamily: "Bold Italic",
        weight: "bold" as const,
        style: "italic" as const,
      },
    ],
  };

  // Change font and reset formatting
  engine.block.setFont(text, typeface.fonts[0].uri, typeface);

  engine.block.setTextFontSize(text, 320);

  // Toggle bold font weight
  if (engine.block.canToggleBoldFont(text)) {
    engine.block.toggleBoldFont(text);
  }

  // Toggle italic font style on a specific range
  if (engine.block.canToggleItalicFont(text, 0, 2)) {
    engine.block.toggleItalicFont(text, 0, 2);
  }

  // Zoom to show the text block
  engine.scene.zoomToBlock(text, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-styling.png", buffer);
  console.log("✅ Exported styled text to output/text-styling.png");
} finally {
  engine.dispose();
}
```

This guide covers editing text content, applying colors and backgrounds, managing typefaces, and controlling text case and font styles.

## Editing Text Content

We modify text using `engine.block.replaceText()` and `engine.block.removeText()`. Text ranges are specified using UTF-16 indices \[from, to). When we omit indices, operations apply to the entire string.

```typescript highlight-edit-text
  // Edit text content using replaceText()
  engine.block.replaceText(text, "Hello World");

  // Add a "!" at the end by inserting at position 11
  engine.block.replaceText(text, "!", 11);

  // Replace "World" with "CE.SDK"
  engine.block.replaceText(text, "CE.SDK", 6, 11);

  // Remove "Hello " (first 6 characters)
  engine.block.removeText(text, 0, 6);
```

The `replaceText()` method can replace the entire text, insert at a specific position, or replace a character range. The `removeText()` method removes characters from specified indices.

## Text Colors

We apply different colors to character ranges using `engine.block.setTextColor()` with RGBA or spot colors. The `engine.block.getTextColors()` method returns an ordered list of unique colors in the text.

```typescript highlight-text-colors
  // Apply colors to the entire text
  engine.block.setTextColor(text, { r: 1.0, g: 0.65, b: 0.0, a: 1.0 }); // Orange

  // Apply different color to a specific range (characters 0-2)
  engine.block.setTextColor(text, { r: 0.2, g: 0.6, b: 1.0, a: 1.0 }, 0, 2); // Blue
```

CE.SDK supports applying different colors to individual character ranges within a single text block, enabling multi-colored text effects.

## Text Backgrounds

We add rectangular backgrounds using `backgroundColor/*` properties. The background is enabled with `engine.block.setBool()`, customized with `engine.block.setColor()`, and adjusted with `engine.block.setFloat()` for padding and corner radius.

```typescript highlight-text-background
  // Enable and configure text background
  engine.block.setBool(text, "backgroundColor/enabled", true);

  // Set background color
  engine.block.setColor(text, "backgroundColor/color", {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0,
  }); // Light gray

  // Configure padding on all sides
  engine.block.setFloat(text, "backgroundColor/paddingLeft", 10);
  engine.block.setFloat(text, "backgroundColor/paddingRight", 10);
  engine.block.setFloat(text, "backgroundColor/paddingTop", 8);
  engine.block.setFloat(text, "backgroundColor/paddingBottom", 8);

  // Add rounded corners
  engine.block.setFloat(text, "backgroundColor/cornerRadius", 8);
```

Text backgrounds inherit animations assigned to their text block when the animation writing style is set to 'Block'.

```typescript highlight-background-animation
// Background inherits text block animations when writing style is 'Block'
const animation = engine.block.createAnimation("slide");
engine.block.setEnum(animation, "textAnimationWritingStyle", "Block");
engine.block.setInAnimation(text, animation);
```

## Text Case Transformations

We render text in different cases without modifying the underlying string value. The `engine.block.setTextCase()` method accepts Normal, Uppercase, Lowercase, or Titlecase values.

```typescript highlight-text-case
// Apply text case transformation (doesn't modify the string value)
engine.block.setTextCase(text, "Uppercase");
```

Text case transformations are visual modifiers - they change how the text renders without altering the actual string data.

## Typefaces and Fonts

We change fonts by providing a URI and typeface definition. The `engine.block.setFont()` method changes the font and resets existing formatting. The `engine.block.setTypeface()` method changes the typeface while preserving formatting.

```typescript highlight-typeface
  // Define a typeface with multiple font variants
  const typeface = {
    name: "Roboto",
    fonts: [
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf",
        subFamily: "Regular",
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf",
        subFamily: "Bold",
        weight: "bold" as const,
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf",
        subFamily: "Italic",
        style: "italic" as const,
      },
      {
        uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf",
        subFamily: "Bold Italic",
        weight: "bold" as const,
        style: "italic" as const,
      },
    ],
  };

  // Change font and reset formatting
  engine.block.setFont(text, typeface.fonts[0].uri, typeface);

  engine.block.setTextFontSize(text, 320);
```

A typeface definition includes the typeface name and a list of font definitions with URIs, subFamily names, weights, and styles. The `engine.block.getTypeface()` method returns the current typeface definition.

## Font Weights and Styles

We toggle between normal/bold weights and normal/italic styles using `engine.block.toggleBoldFont()` and `engine.block.toggleItalicFont()`. We first check availability with `canToggleBoldFont()` and `canToggleItalicFont()`.

```typescript highlight-font-styles
  // Toggle bold font weight
  if (engine.block.canToggleBoldFont(text)) {
    engine.block.toggleBoldFont(text);
  }

  // Toggle italic font style on a specific range
  if (engine.block.canToggleItalicFont(text, 0, 2)) {
    engine.block.toggleItalicFont(text, 0, 2);
  }
```

The typeface must include fonts matching the requested weight and style combination for toggling to work. We query current weights and styles with `engine.block.getTextFontWeights()` and `engine.block.getTextFontStyles()`.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.replaceText()` | Replace or insert text at specified indices |
| `engine.block.removeText()` | Remove text at specified indices |
| `engine.block.setTextColor()` | Set color for entire text or specific range |
| `engine.block.getTextColors()` | Get ordered list of unique colors in text |
| `engine.block.setBool()` | Enable/disable boolean properties |
| `engine.block.setColor()` | Set color property values |
| `engine.block.getColor()` | Get color property values |
| `engine.block.setFloat()` | Set numeric property values |
| `engine.block.setTextCase()` | Apply text case transformation |
| `engine.block.getTextCases()` | Get ordered list of text cases in range |
| `engine.block.setFont()` | Change font and reset formatting |
| `engine.block.setTypeface()` | Change typeface and preserve formatting |
| `engine.block.getTypeface()` | Get current typeface definition |
| `engine.block.canToggleBoldFont()` | Check if bold toggle is possible |
| `engine.block.toggleBoldFont()` | Toggle between normal and bold weight |
| `engine.block.canToggleItalicFont()` | Check if italic toggle is possible |
| `engine.block.toggleItalicFont()` | Toggle between normal and italic style |
| `engine.block.getTextFontWeights()` | Get ordered list of font weights in range |
| `engine.block.getTextFontStyles()` | Get ordered list of font styles in range |
| `engine.block.export()` | Export block or scene to various formats |

## Troubleshooting

**getTypeface() throws error**: New text blocks don't have explicit typefaces until `setFont()` is called.

**Font toggle not working**: Verify the typeface definition includes fonts for requested weight and style combinations.

**Text background not visible**: Ensure the `backgroundColor/enabled` property is set to true.

**Unexpected text case rendering**: Text case transformations don't modify the underlying string value - they only affect rendering.

**Font formatting lost**: Use `setTypeface()` instead of `setFont()` to preserve existing formatting when changing fonts.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support