> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Language Support](./text/language-support.md)

---

Support right-to-left text, complex scripts, and multilingual typography programmatically in headless Node.js environments.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-language-support-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-text-language-support-server-js)

CE.SDK provides comprehensive multilingual text support through the Block API. We can create text blocks in any language and the engine automatically handles complex text rendering including right-to-left scripts, ligatures, diacritical marks, and bidirectional text. This enables programmatic generation of designs for global audiences without UI complexity.

```typescript file=@cesdk_web_examples/guides-text-language-support-server-js/server-js.ts reference-only
import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text and Language Support
 */

// Typeface definitions
const ROBOTO_BOLD = {
  name: "Roboto",
  fonts: [
    {
      uri: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf",
      subFamily: "Bold",
      weight: "bold" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_NASKH_ARABIC = {
  name: "Noto Naskh Arabic",
  fonts: [
    {
      uri: new URL("./assets/NotoNaskhArabic-Regular.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_SANS_KR = {
  name: "Noto Sans KR",
  fonts: [
    {
      uri: new URL("./assets/NotoSansKR-VariableFont_wght.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};

// Layout configuration
const LAYOUT = {
  PAGE: { width: 800, height: 1200 },
  TEXT: { x: 50, width: 700, defaultHeight: 140, fontSize: 20 },
  SPACING: { gap: 16, startY: 50 },
};

// Typeface interface
interface Typeface {
  name: string;
  fonts: Array<{
    uri: string;
    subFamily: string;
    weight: "normal" | "bold";
    style: "normal" | "italic";
  }>;
}

// Helper function to create text blocks
function createTextBlock(
  engine: CreativeEngine,
  page: number,
  text: string,
  typeface: Typeface,
  yPosition: number,
  height: number = LAYOUT.TEXT.defaultHeight,
  alignment: "Left" | "Center" | "Right" = "Left",
): void {
  const textBlock = engine.block.create("text");
  engine.block.setString(textBlock, "text/text", text);
  engine.block.appendChild(page, textBlock);
  engine.block.setPositionX(textBlock, LAYOUT.TEXT.x);
  engine.block.setPositionY(textBlock, yPosition);
  engine.block.setWidth(textBlock, LAYOUT.TEXT.width);
  engine.block.setHeight(textBlock, height);
  engine.block.setFloat(textBlock, "text/fontSize", LAYOUT.TEXT.fontSize);
  engine.block.setTypeface(textBlock, typeface);
  if (alignment !== "Left") {
    engine.block.setEnum(textBlock, "text/horizontalAlignment", alignment);
  }
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

// Create a design scene with specific page dimensions
engine.scene.create("VerticalStack", {
  page: { size: { width: LAYOUT.PAGE.width, height: LAYOUT.PAGE.height } },
});
const page = engine.block.findByType("page")[0];

try {
  // Create four text elements demonstrating multilingual font support
  const textElements = [
    { text: "RTL Arabic", typeface: ROBOTO_BOLD, height: 140 },
    {
      text: "هذا مثال.",
      typeface: NOTO_NASKH_ARABIC,
      height: 160,
      alignment: "Right" as const,
    },
    { text: "Korean", typeface: ROBOTO_BOLD, height: 140 },
    { text: "이는 한 예입니다.", typeface: NOTO_SANS_KR, height: 140 },
  ];

  let currentY = LAYOUT.SPACING.startY;
  for (const element of textElements) {
    createTextBlock(
      engine,
      page,
      element.text,
      element.typeface,
      currentY,
      element.height,
      element.alignment,
    );
    currentY += element.height + LAYOUT.SPACING.gap;
  }

  // Zoom to show all content
  engine.scene.zoomToBlock(page, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-language-support.png", buffer);
  console.log(
    "✅ Exported multilingual text to output/text-language-support.png",
  );
} finally {
  engine.dispose();
}
```

This guide covers headless rendering of RTL text, font configuration for different scripts, complex script support, and variable bindings for multilingual content.

## Initialize Headless Engine

We initialize CE.SDK in headless mode for server-side text processing. The engine provides the same text rendering capabilities as the browser version, optimized for programmatic usage and export.

```typescript highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL,
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

// Create a design scene with specific page dimensions
engine.scene.create("VerticalStack", {
  page: { size: { width: LAYOUT.PAGE.width, height: LAYOUT.PAGE.height } },
});
const page = engine.block.findByType("page")[0];
```

The headless engine creates scenes programmatically and exports designs to PNG, PDF, or other formats without browser dependencies.

## Right-to-Left Text Detection

We create text blocks with RTL content and the engine automatically detects text direction based on Unicode character properties. CE.SDK implements the Unicode Bidirectional Algorithm (UAX #9) to handle RTL languages like Arabic, Hebrew, Persian, and Urdu.

```typescript highlight-apply-fonts
  // Create four text elements demonstrating multilingual font support
  const textElements = [
    { text: "RTL Arabic", typeface: ROBOTO_BOLD, height: 140 },
    {
      text: "هذا مثال.",
      typeface: NOTO_NASKH_ARABIC,
      height: 160,
      alignment: "Right" as const,
    },
    { text: "Korean", typeface: ROBOTO_BOLD, height: 140 },
    { text: "이는 한 예입니다.", typeface: NOTO_SANS_KR, height: 140 },
  ];

  let currentY = LAYOUT.SPACING.startY;
  for (const element of textElements) {
    createTextBlock(
      engine,
      page,
      element.text,
      element.typeface,
      currentY,
      element.height,
      element.alignment,
    );
    currentY += element.height + LAYOUT.SPACING.gap;
  }
```

The engine analyzes strong directional characters to determine text flow. Arabic and Hebrew letters establish right-to-left direction automatically. Mixed content with embedded LTR words renders correctly without additional configuration.

## Text Alignment for RTL Scripts

CE.SDK defaults to 'Auto' alignment, which automatically aligns text based on script direction. RTL scripts (Arabic, Hebrew) align right, while LTR scripts align left. This eliminates the need to manually configure alignment for different writing systems.

```typescript highlight-text-alignment
if (alignment !== "Left") {
  engine.block.setEnum(textBlock, "text/horizontalAlignment", alignment);
}
```

The alignment options:

- **'Auto'** (default) - Automatically aligns based on the text's script direction. RTL scripts align right, LTR scripts align left.
- **'Left'** - Always align text to the left
- **'Right'** - Always align text to the right
- **'Center'** - Center-align text (language-neutral)

With 'Auto' alignment, the Arabic text in our example automatically aligns to the right without explicit configuration:

```typescript
{
  text: "هذا مثال.",
  typeface: NOTO_NASKH_ARABIC,
  height: 160,
  // No alignment needed - Auto handles RTL automatically
}
```

You can still override alignment when needed:

```typescript
{
  text: "Centered Title",
  typeface: ROBOTO_BOLD,
  height: 80,
  alignment: "Center" as const  // Override Auto for centering
}
```

To check the effective alignment when 'Auto' is set, use `getTextEffectiveHorizontalAlignment()`:

```typescript
const effectiveAlignment = engine.block.getTextEffectiveHorizontalAlignment(textBlock);
// Returns 'Left' or 'Right' based on text content, never 'Auto'
```

This approach simplifies multilingual templates - the same template works correctly for both LTR and RTL languages without alignment adjustments.

## Font Configuration for Language Support

To support specific languages and scripts, we define typefaces as constants with appropriate Unicode coverage. This example uses a constants-based approach for reusable typeface definitions that can be referenced throughout the code.

```typescript highlight-configure-fonts
// Typeface definitions
const ROBOTO_BOLD = {
  name: "Roboto",
  fonts: [
    {
      uri: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf",
      subFamily: "Bold",
      weight: "bold" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_NASKH_ARABIC = {
  name: "Noto Naskh Arabic",
  fonts: [
    {
      uri: new URL("./assets/NotoNaskhArabic-Regular.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_SANS_KR = {
  name: "Noto Sans KR",
  fonts: [
    {
      uri: new URL("./assets/NotoSansKR-VariableFont_wght.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};
```

The example defines three typefaces as named constants:

- **ROBOTO\_BOLD** - A web font for Latin script labels
- **NOTO\_NASKH\_ARABIC** - Optimized for Arabic script with proper contextual forms
- **NOTO\_SANS\_KR** - Variable font supporting Korean (Hangul) characters

Each typeface includes:

- **name** - The typeface family name
- **fonts** - Array of font objects with URIs and styles
- **uri** - Path to font file (uses `new URL()` with `import.meta.url` for local assets)
- **weight** - Font weight (normal, bold, or numeric values)
- **style** - Font style (normal or italic)

Defining typefaces as constants provides several benefits:

- **Reusability** - Reference the same typeface multiple times without duplication
- **Maintainability** - Update font URIs or properties in one location
- **Type safety** - TypeScript can infer and validate typeface structure
- **Clarity** - Clear semantic names indicate which script each font supports

> **Note:** CE.SDK uses its bundled fallback fonts with Unicode support by default. Custom typefaces
> are useful when you need specific brand fonts or enhanced coverage for
> particular scripts.

## Applying Fonts Programmatically

Instead of manually configuring each text block, this example uses a helper function and data-driven approach to apply fonts efficiently.

### Helper Function

The `createTextBlock()` function encapsulates all text block setup logic, reducing code duplication:

```typescript highlight-helper-function
// Helper function to create text blocks
function createTextBlock(
  engine: CreativeEngine,
  page: number,
  text: string,
  typeface: Typeface,
  yPosition: number,
  height: number = LAYOUT.TEXT.defaultHeight,
  alignment: "Left" | "Center" | "Right" = "Left",
): void {
  const textBlock = engine.block.create("text");
  engine.block.setString(textBlock, "text/text", text);
  engine.block.appendChild(page, textBlock);
  engine.block.setPositionX(textBlock, LAYOUT.TEXT.x);
  engine.block.setPositionY(textBlock, yPosition);
  engine.block.setWidth(textBlock, LAYOUT.TEXT.width);
  engine.block.setHeight(textBlock, height);
  engine.block.setFloat(textBlock, "text/fontSize", LAYOUT.TEXT.fontSize);
  engine.block.setTypeface(textBlock, typeface);
  if (alignment !== "Left") {
    engine.block.setEnum(textBlock, "text/horizontalAlignment", alignment);
  }
}
```

This function handles:

- Creating text blocks
- Setting text content and styling
- Applying typefaces
- Positioning and sizing
- Conditional alignment (only when not 'Left')

### Data-Driven Configuration

Text elements are defined as an array and processed in a loop:

```typescript highlight-apply-fonts
  // Create four text elements demonstrating multilingual font support
  const textElements = [
    { text: "RTL Arabic", typeface: ROBOTO_BOLD, height: 140 },
    {
      text: "هذا مثال.",
      typeface: NOTO_NASKH_ARABIC,
      height: 160,
      alignment: "Right" as const,
    },
    { text: "Korean", typeface: ROBOTO_BOLD, height: 140 },
    { text: "이는 한 예입니다.", typeface: NOTO_SANS_KR, height: 140 },
  ];

  let currentY = LAYOUT.SPACING.startY;
  for (const element of textElements) {
    createTextBlock(
      engine,
      page,
      element.text,
      element.typeface,
      currentY,
      element.height,
      element.alignment,
    );
    currentY += element.height + LAYOUT.SPACING.gap;
  }
```

This approach uses three key patterns:

**1. Helper Function** - The `createTextBlock()` function creates and configures a text block with a single call. As a standalone function (not a class method), it takes the engine instance as the first parameter. Other parameters include text content, typeface, position, height, and optional alignment.

**2. Data-Driven Configuration** - Text elements are defined as an array of objects specifying content, typeface, height, and alignment. This declarative approach makes it easy to see all elements at a glance and modify them as needed.

**3. Loop-Based Creation** - A for loop iterates through the configuration array, automatically calculating Y positions and creating each text block. The `currentY` variable tracks vertical position and updates after each element.

Benefits of this pattern:

- **DRY Principle** - Eliminates repetitive block setup code
- **Easy to Extend** - Add new languages by appending to the configuration array
- **Maintainable** - Change layout spacing or dimensions in one place
- **Educational** - Demonstrates best practices for managing multiple similar elements

The `engine.block.setTypeface()` method applies fonts at the block level. CE.SDK automatically uses the configured fonts to render text with proper glyph coverage for the languages in your content.

## Complex Script Support

CE.SDK automatically handles complex script features without additional configuration. The text engine provides script-aware text shaping that applies:

### Arabic Script Features

The engine automatically applies Arabic-specific rendering:

- **Contextual letter forms** - Letters change shape based on position (initial, medial, final, isolated)
- **Required ligatures** - Mandatory character combinations render as single glyphs
- **Diacritical marks** - Tashkeel marks position correctly above and below letters
- **Kashida** - Text justification through letter elongation

### Other Complex Scripts

The text engine supports additional writing systems:

- **Devanagari** (Hindi, Sanskrit) - Conjunct formations and half-forms
- **Thai** - Vowel and tone mark positioning above and below base characters
- **Japanese** - Kanji, hiragana, and katakana rendering
- **Southeast Asian scripts** - Khmer subscripts, Myanmar ligatures

All complex script features apply automatically based on Unicode properties and font capabilities.

## Variables for Multilingual Content

We use variable bindings to create dynamic multilingual content. Variables enable language switching while maintaining proper text rendering for each script.

Variable benefits:

- **Dynamic language switching** - Update variable values to change content language
- **Consistent formatting** - Text styling and layout remain stable across languages
- **Template reusability** - One template works for multiple language markets

Variables are particularly useful for:

- **Localized materials** - Same design, different language content
- **A/B testing** - Test messaging across languages
- **Regional campaigns** - Deploy region-specific content from a single template

## Mixed-Direction Text

The engine handles mixed-direction text automatically through the Unicode Bidirectional Algorithm. LTR and RTL content coexist correctly within the same text block.

When we create text mixing English (LTR) with Arabic or Hebrew (RTL), the engine:

- **Detects strong directional characters** - Establishes text flow based on Unicode BiDi class
- **Handles neutral characters** - Spaces, punctuation, and numbers display correctly in context
- **Manages embedding** - LTR words embed correctly within RTL paragraphs

The engine resolves bidirectional layout automatically without requiring Unicode directional formatting characters.

## Exporting Multilingual Designs

We export scenes to various formats using `engine.block.export()`. The headless engine supports PNG, JPEG, PDF, and other formats for programmatic image generation — plus MP4 video with the native `@cesdk/node-native` package.

```typescript highlight-export
  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-language-support.png", buffer);
  console.log(
    "✅ Exported multilingual text to output/text-language-support.png",
  );
```

Exported images preserve all multilingual text rendering including RTL layout, complex scripts, and mixed-direction content. This enables automated generation of localized designs for global markets.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.create('text')` | Create text block for multilingual content |
| `engine.block.setString(id, 'text/text', value)` | Set text content in any language |
| `engine.block.getString(id, 'text/text')` | Get text content |
| `engine.block.setEnum(id, 'text/horizontalAlignment', value)` | Set horizontal text alignment (Auto, Left, Right, Center) |
| `engine.block.getEnum(id, 'text/horizontalAlignment')` | Get horizontal text alignment |
| `engine.block.getTextEffectiveHorizontalAlignment(id)` | Get resolved alignment (Auto resolves to Left or Right) |
| `engine.block.setTypeface()` | Apply typeface to text block |
| `engine.block.getTypeface()` | Get current typeface of text block |
| `engine.block.setFloat(id, 'text/fontSize', value)` | Set font size |
| `engine.block.setTextColor()` | Set color for character range |
| `engine.variable.setString()` | Create or update text variable for multilingual content |
| `engine.block.export()` | Export block or scene to various formats |

## Troubleshooting

### Text Displays as Squares or Question Marks

**Issue**: Characters render as replacement glyphs (□ or ?) instead of the intended script.

**Solution**: The font lacks glyphs for the text content. Use fonts with appropriate Unicode coverage:

- Verify font supports required Unicode blocks
- Use Noto fonts family for comprehensive coverage
- Check font file format compatibility (TTF, OTF, WOFF2)
- Ensure font files are accessible with correct URIs

### RTL Text Renders Left-to-Right

**Issue**: Arabic or Hebrew text flows left-to-right instead of right-to-left.

**Solution**: The default 'Auto' alignment should handle this automatically. If issues persist:

- Verify alignment is set to 'Auto' (default) or explicitly 'Right'
- Use `engine.block.getTextEffectiveHorizontalAlignment(block)` to check resolved alignment
- Verify font includes bidirectional layout features
- Test with known RTL-compatible fonts (Noto Sans Arabic, Noto Sans Hebrew)
- Check that text content includes strong RTL directional characters

### Complex Script Features Display Incorrectly

**Issue**: Ligatures or diacritical marks appear disconnected or mispositioned.

**Solution**: Use fonts specifically designed for the target script:

- Verify font includes GSUB/GPOS OpenType tables
- Use script-specific Noto fonts
- Check font includes required OpenType layout features
- Ensure font supports the specific script's shaping requirements

### Variable Substitution Not Working

**Issue**: Variable placeholders like `{{variable}}` display literally instead of substituting values.

**Solution**: Ensure variables are defined before creating text blocks:

- Call `engine.variable.setString()` before setting text content
- Verify variable names match exactly (case-sensitive)
- Check variable placeholders use double curly braces `{{name}}`
- Confirm variables are set in the same engine instance



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support