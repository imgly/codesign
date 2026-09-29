> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Multiple Image Generation](./automation/multi-image-generation.md)

---

Generate multiple image variants from a single data record using CE.SDK's headless Node.js API to create format variations for different platforms.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-automation-multi-image-generation-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-automation-multi-image-generation-server-js)

Multi-image generation produces multiple design variants from a single data source. This pattern creates format variations (square, portrait, landscape) from one input to serve multiple channels like Instagram posts, stories, and Facebook posts.

```typescript file=@cesdk_web_examples/guides-automation-multi-image-generation-server-js/server-js.ts reference-only
import CreativeEngine, { isRGBAColor, type RGBAColor } from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Multi-Image Generation
 *
 * Demonstrates generating multiple image variants from a single data record:
 * - Processing multiple templates sequentially (square, portrait, landscape)
 * - Setting text variables from structured data
 * - Replacing images dynamically by block name
 * - Applying brand colors across template elements
 * - Exporting variants to different formats
 */

// Define the data structure for a restaurant review card
// In production, this would come from an API, database, or JSON file
interface RestaurantData {
  name: string;
  price: string;
  reviewCount: number;
  rating: number;
  imageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

// Define template configurations for different formats
// Each template targets a different aspect ratio for various platforms
interface TemplateConfig {
  label: string;
  width: number;
  height: number;
}

// Helper function to convert hex color to RGBA (0-1 range)
function hexToRgba01(hex: string): RGBAColor {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
    a: 1
  };
}

// Helper to check if color is black (r=0, g=0, b=0)
function isBlackColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 0 && c.g === 0 && c.b === 0;
}

// Helper to check if color is white (r=1, g=1, b=1)
function isWhiteColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 1 && c.g === 1 && c.b === 1;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

// Helper function to apply text variables from data
function applyVariables(data: RestaurantData): void {
  const safeName = data.name?.trim() || 'Restaurant';
  const safePrice = data.price?.trim() || '$';
  const safeCount =
    data.reviewCount !== undefined && data.reviewCount !== null
      ? data.reviewCount.toString()
      : '0';

  engine.variable.setString('Name', safeName);
  engine.variable.setString('Price', safePrice);
  engine.variable.setString('Count', safeCount);
}

// Helper function to replace an image by block name
function replaceImageByName(
  blockName: string,
  newUrl: string,
  mode: 'Cover' | 'Contain' = 'Cover'
): void {
  const blocks = engine.block.findByName(blockName);
  if (blocks.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Block "${blockName}" not found`);
    return;
  }

  const imageBlock = blocks[0];
  let fill = engine.block.getFill(imageBlock);

  if (!fill) {
    fill = engine.block.createFill('image');
    engine.block.setFill(imageBlock, fill);
  }

  engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
  engine.block.resetCrop(imageBlock);
  engine.block.setContentFillMode(imageBlock, mode);
}

// Helper function to apply brand colors to template elements
function applyBrandColors(primaryHex: string, secondaryHex: string): void {
  const primary = hexToRgba01(primaryHex);
  const secondary = hexToRgba01(secondaryHex);
  const blocks = engine.block.findAll();

  for (const id of blocks) {
    const type = engine.block.getType(id);

    // Text blocks: swap black/white text colors
    if (type === '//ly.img.ubq/text') {
      const colors = engine.block.getTextColors(id) || [];
      colors.forEach((c, i) => {
        if (isBlackColor(c)) {
          engine.block.setTextColor(id, primary, i, colors.length);
        } else if (isWhiteColor(c)) {
          engine.block.setTextColor(id, secondary, i, colors.length);
        }
      });
      continue;
    }

    // Shapes: swap black/white fills
    if (engine.block.supportsFill(id)) {
      const fill = engine.block.getFill(id);
      if (fill && engine.block.getType(fill) === '//ly.img.ubq/fill/color') {
        const fillColor = engine.block.getColor(fill, 'fill/color/value');
        if (isBlackColor(fillColor)) {
          engine.block.setColor(fill, 'fill/color/value', primary);
        } else if (isWhiteColor(fillColor)) {
          engine.block.setColor(fill, 'fill/color/value', secondary);
        }
      }
    }
  }
}

// Helper function to visualize rating with colored indicators
function applyRating(rating: number, maxRating: number = 5): void {
  const onColor = hexToRgba01('#FFD700'); // Gold for active
  const offColor = hexToRgba01('#E0E0E0'); // Gray for inactive

  for (let i = 1; i <= maxRating; i++) {
    const blocks = engine.block.findByName(`Rating${i}`);
    if (blocks.length === 0) continue;

    const ratingBlock = blocks[0];
    if (engine.block.supportsFill(ratingBlock)) {
      const fill = engine.block.getFill(ratingBlock);
      if (fill) {
        const color = i <= rating ? onColor : offColor;
        engine.block.setColor(fill, 'fill/color/value', color);
      }
    }
  }
}

try {
  const restaurantData: RestaurantData = {
    name: 'The Golden Fork',
    price: '$$$',
    reviewCount: 127,
    rating: 4,
    imageUrl: 'https://img.ly/static/ubq_samples/sample_4.jpg',
    primaryColor: '#2D5A27',
    secondaryColor: '#F5E6D3'
  };

  const templates: TemplateConfig[] = [
    { label: 'square', width: 1080, height: 1080 }, // Instagram post (1:1)
    { label: 'portrait', width: 1080, height: 1920 }, // Instagram story (9:16)
    { label: 'landscape', width: 1200, height: 630 } // Facebook/X post (1.91:1)
  ];

  // Prepare output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Store results for summary
  const results: { label: string; filename: string }[] = [];

  // Process each template format sequentially
  for (const template of templates) {
    // Create a fresh scene for each template variant
    engine.scene.create('Free', {
      page: { size: { width: template.width, height: template.height } }
    });
    const page = engine.block.findByType('page')[0];

    // Create template content with text variables
    // In production, you would load a pre-designed template instead

    // Create background
    const bgRect = engine.block.create('graphic');
    engine.block.setShape(bgRect, engine.block.createShape('rect'));
    const bgFill = engine.block.createFill('color');
    engine.block.setColor(bgFill, 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.setFill(bgRect, bgFill);
    engine.block.setWidth(bgRect, template.width);
    engine.block.setHeight(bgRect, template.height);
    engine.block.setPositionX(bgRect, 0);
    engine.block.setPositionY(bgRect, 0);
    engine.block.appendChild(page, bgRect);

    // Create hero image block
    const heroBlock = engine.block.create('graphic');
    engine.block.setShape(heroBlock, engine.block.createShape('rect'));
    const heroFill = engine.block.createFill('image');
    engine.block.setString(
      heroFill,
      'fill/image/imageFileURI',
      restaurantData.imageUrl
    );
    engine.block.setFill(heroBlock, heroFill);
    engine.block.setName(heroBlock, 'HeroImage');

    // Adjust hero image size based on format
    const heroHeight = template.height * 0.5;
    engine.block.setWidth(heroBlock, template.width);
    engine.block.setHeight(heroBlock, heroHeight);
    engine.block.setPositionX(heroBlock, 0);
    engine.block.setPositionY(heroBlock, 0);
    engine.block.appendChild(page, heroBlock);

    // Create title text with variable binding
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, '{{Name}}');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setPositionX(titleBlock, 40);
    engine.block.setPositionY(titleBlock, heroHeight + 30);
    engine.block.appendChild(page, titleBlock);

    // Create price and review count text
    const detailsBlock = engine.block.create('text');
    engine.block.replaceText(detailsBlock, '{{Price}} · {{Count}} reviews');
    engine.block.setWidthMode(detailsBlock, 'Auto');
    engine.block.setHeightMode(detailsBlock, 'Auto');
    engine.block.setFloat(detailsBlock, 'text/fontSize', 24);
    engine.block.setPositionX(detailsBlock, 40);
    engine.block.setPositionY(detailsBlock, heroHeight + 100);
    engine.block.appendChild(page, detailsBlock);

    // Create rating stars
    const starSize = 30;
    const starSpacing = 35;
    const starY = heroHeight + 150;
    for (let i = 1; i <= 5; i++) {
      const star = engine.block.create('graphic');
      engine.block.setShape(star, engine.block.createShape('rect'));
      const starFill = engine.block.createFill('color');
      engine.block.setColor(starFill, 'fill/color/value', {
        r: 0.88,
        g: 0.88,
        b: 0.88,
        a: 1
      });
      engine.block.setFill(star, starFill);
      engine.block.setWidth(star, starSize);
      engine.block.setHeight(star, starSize);
      engine.block.setPositionX(star, 40 + (i - 1) * starSpacing);
      engine.block.setPositionY(star, starY);
      engine.block.setName(star, `Rating${i}`);
      engine.block.appendChild(page, star);
    }

    // Apply data to the template
    applyVariables(restaurantData);
    replaceImageByName('HeroImage', restaurantData.imageUrl, 'Cover');
    applyBrandColors(
      restaurantData.primaryColor,
      restaurantData.secondaryColor
    );
    applyRating(restaurantData.rating);

    // Export the populated template
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });

    // Save to file system
    const filename = `restaurant-${template.label}.png`;
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}`, buffer);

    results.push({ label: template.label, filename });
    // eslint-disable-next-line no-console
    console.log(
      `✓ Exported ${filename} (${template.width}x${template.height})`
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n✓ Multi-image generation complete: ${results.length} variants exported to ${outputDir}/`
  );
  // eslint-disable-next-line no-console
  console.log('  Variants:', results.map((r) => r.label).join(', '));
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers defining data structures, configuring templates for different formats, populating templates with variables and images, applying brand colors, and exporting variants.

## Define the Data Structure

Start by defining the structure for your input data. Type-safe interfaces clarify requirements and prevent runtime errors.

```typescript highlight=highlight-data-structure
// Define the data structure for a restaurant review card
// In production, this would come from an API, database, or JSON file
interface RestaurantData {
  name: string;
  price: string;
  reviewCount: number;
  rating: number;
  imageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}
```

The restaurant review example includes text fields (name, price, review count), image URLs, rating, and brand colors. In production, this data comes from an API, database, or JSON file.

## Configure Template Formats

Define template configurations for each output format. Different aspect ratios serve different platforms and use cases.

```typescript highlight=highlight-template-config
// Define template configurations for different formats
// Each template targets a different aspect ratio for various platforms
interface TemplateConfig {
  label: string;
  width: number;
  height: number;
}
```

Common format targets include:

- **Square (1:1)**: Instagram posts, profile images
- **Portrait (9:16)**: Instagram stories, TikTok, mobile displays
- **Landscape (1.91:1)**: Facebook posts, Twitter/X cards, web banners

## Initialize the Engine

Initialize the headless Creative Engine for server-side processing.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The engine runs without a browser context, making it suitable for batch processing and API integrations.

## Create Helper Functions

Build reusable functions for common template operations to keep the main generation loop clean.

### Text Variable Substitution

Use `engine.variable.setString()` to populate text placeholders. Include null checks for robust data handling.

```typescript highlight=highlight-helper-variables
// Helper function to apply text variables from data
function applyVariables(data: RestaurantData): void {
  const safeName = data.name?.trim() || 'Restaurant';
  const safePrice = data.price?.trim() || '$';
  const safeCount =
    data.reviewCount !== undefined && data.reviewCount !== null
      ? data.reviewCount.toString()
      : '0';

  engine.variable.setString('Name', safeName);
  engine.variable.setString('Price', safePrice);
  engine.variable.setString('Count', safeCount);
}
```

Variables update all text blocks that reference them using the `{{variableName}}` syntax.

### Dynamic Image Replacement

Replace images by finding blocks with semantic names and updating their fill URI.

```typescript highlight=highlight-helper-image
// Helper function to replace an image by block name
function replaceImageByName(
  blockName: string,
  newUrl: string,
  mode: 'Cover' | 'Contain' = 'Cover'
): void {
  const blocks = engine.block.findByName(blockName);
  if (blocks.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Block "${blockName}" not found`);
    return;
  }

  const imageBlock = blocks[0];
  let fill = engine.block.getFill(imageBlock);

  if (!fill) {
    fill = engine.block.createFill('image');
    engine.block.setFill(imageBlock, fill);
  }

  engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
  engine.block.resetCrop(imageBlock);
  engine.block.setContentFillMode(imageBlock, mode);
}
```

Using `findByName()` instead of `findByType()` targets specific blocks without affecting other images in the template.

### Brand Color Theming

Apply consistent brand colors across template elements by replacing standard black/white values with brand primary/secondary colors.

```typescript highlight=highlight-helper-colors
// Helper function to convert hex color to RGBA (0-1 range)
function hexToRgba01(hex: string): RGBAColor {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
    a: 1
  };
}

// Helper to check if color is black (r=0, g=0, b=0)
function isBlackColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 0 && c.g === 0 && c.b === 0;
}

// Helper to check if color is white (r=1, g=1, b=1)
function isWhiteColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 1 && c.g === 1 && c.b === 1;
}
```

This approach preserves other colors while systematically applying brand theming to text and shapes.

### Rating Visualization

Display ratings visually using conditional coloring of indicator blocks.

```typescript highlight=highlight-helper-rating
// Helper function to visualize rating with colored indicators
function applyRating(rating: number, maxRating: number = 5): void {
  const onColor = hexToRgba01('#FFD700'); // Gold for active
  const offColor = hexToRgba01('#E0E0E0'); // Gray for inactive

  for (let i = 1; i <= maxRating; i++) {
    const blocks = engine.block.findByName(`Rating${i}`);
    if (blocks.length === 0) continue;

    const ratingBlock = blocks[0];
    if (engine.block.supportsFill(ratingBlock)) {
      const fill = engine.block.getFill(ratingBlock);
      if (fill) {
        const color = i <= rating ? onColor : offColor;
        engine.block.setColor(fill, 'fill/color/value', color);
      }
    }
  }
}
```

Rating blocks use a naming convention (`Rating1`, `Rating2`, etc.) to identify and color them based on the rating value.

## Process Templates Sequentially

Iterate through each template format, creating a fresh scene for each variant. Sequential processing keeps memory usage predictable.

```typescript highlight=highlight-generation-loop
// Process each template format sequentially
for (const template of templates) {
  // Create a fresh scene for each template variant
  engine.scene.create('Free', {
    page: { size: { width: template.width, height: template.height } }
  });
  const page = engine.block.findByType('page')[0];
```

Creating a new scene for each template ensures variable values and block states don't carry over between variants.

## Build Template Content

For each format, build the template layout with properly sized and positioned blocks. In production, you would load pre-designed templates instead of creating them programmatically.

```typescript highlight=highlight-create-content
    // Create template content with text variables
    // In production, you would load a pre-designed template instead

    // Create background
    const bgRect = engine.block.create('graphic');
    engine.block.setShape(bgRect, engine.block.createShape('rect'));
    const bgFill = engine.block.createFill('color');
    engine.block.setColor(bgFill, 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.setFill(bgRect, bgFill);
    engine.block.setWidth(bgRect, template.width);
    engine.block.setHeight(bgRect, template.height);
    engine.block.setPositionX(bgRect, 0);
    engine.block.setPositionY(bgRect, 0);
    engine.block.appendChild(page, bgRect);

    // Create hero image block
    const heroBlock = engine.block.create('graphic');
    engine.block.setShape(heroBlock, engine.block.createShape('rect'));
    const heroFill = engine.block.createFill('image');
    engine.block.setString(
      heroFill,
      'fill/image/imageFileURI',
      restaurantData.imageUrl
    );
    engine.block.setFill(heroBlock, heroFill);
    engine.block.setName(heroBlock, 'HeroImage');

    // Adjust hero image size based on format
    const heroHeight = template.height * 0.5;
    engine.block.setWidth(heroBlock, template.width);
    engine.block.setHeight(heroBlock, heroHeight);
    engine.block.setPositionX(heroBlock, 0);
    engine.block.setPositionY(heroBlock, 0);
    engine.block.appendChild(page, heroBlock);

    // Create title text with variable binding
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, '{{Name}}');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setPositionX(titleBlock, 40);
    engine.block.setPositionY(titleBlock, heroHeight + 30);
    engine.block.appendChild(page, titleBlock);

    // Create price and review count text
    const detailsBlock = engine.block.create('text');
    engine.block.replaceText(detailsBlock, '{{Price}} · {{Count}} reviews');
    engine.block.setWidthMode(detailsBlock, 'Auto');
    engine.block.setHeightMode(detailsBlock, 'Auto');
    engine.block.setFloat(detailsBlock, 'text/fontSize', 24);
    engine.block.setPositionX(detailsBlock, 40);
    engine.block.setPositionY(detailsBlock, heroHeight + 100);
    engine.block.appendChild(page, detailsBlock);

    // Create rating stars
    const starSize = 30;
    const starSpacing = 35;
    const starY = heroHeight + 150;
    for (let i = 1; i <= 5; i++) {
      const star = engine.block.create('graphic');
      engine.block.setShape(star, engine.block.createShape('rect'));
      const starFill = engine.block.createFill('color');
      engine.block.setColor(starFill, 'fill/color/value', {
        r: 0.88,
        g: 0.88,
        b: 0.88,
        a: 1
      });
      engine.block.setFill(star, starFill);
      engine.block.setWidth(star, starSize);
      engine.block.setHeight(star, starSize);
      engine.block.setPositionX(star, 40 + (i - 1) * starSpacing);
      engine.block.setPositionY(star, starY);
      engine.block.setName(star, `Rating${i}`);
      engine.block.appendChild(page, star);
    }
```

The template includes:

- Background fill
- Hero image with semantic name for replacement
- Text blocks with variable bindings
- Rating indicator blocks with naming convention

## Populate and Export

After building the template structure, apply the data and export the result.

```typescript highlight=highlight-populate-template
// Apply data to the template
applyVariables(restaurantData);
replaceImageByName('HeroImage', restaurantData.imageUrl, 'Cover');
applyBrandColors(
  restaurantData.primaryColor,
  restaurantData.secondaryColor
);
applyRating(restaurantData.rating);
```

The population step:

1. Sets text variables from the data record
2. Updates the hero image URL
3. Applies brand colors to text and shapes
4. Colors rating indicators based on the rating value

Then export to the file system:

```typescript highlight=highlight-export
    // Export the populated template
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });

    // Save to file system
    const filename = `restaurant-${template.label}.png`;
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}`, buffer);

    results.push({ label: template.label, filename });
    // eslint-disable-next-line no-console
    console.log(
      `✓ Exported ${filename} (${template.width}x${template.height})`
    );
```

For production deployments, write to cloud storage or return blobs for API responses instead of the local file system.

## Cleanup Resources

Always dispose the engine when processing completes. The `finally` block ensures cleanup happens even if errors occur.

```typescript highlight=highlight-cleanup
// Always dispose the engine to free resources
engine.dispose();
```

## Troubleshooting

### Variables Not Updating

If text shows `{{variableName}}` instead of the actual value:

- Variable names are case-sensitive—verify exact match
- Ensure `setString()` is called before export
- Use `engine.variable.findAll()` to check defined variables
- Create a new scene for each variant to clear previous state

### Images Not Appearing

If images fail to load in exported designs:

- Verify image URLs are accessible from the server
- Check CORS headers if loading from external domains
- Ensure the fill type is `image` before setting `fill/image/imageFileURI`
- Call `resetCrop()` after changing the image URI

### Colors Not Applying

If brand colors don't appear correctly:

- The color comparison checks for exact black (0,0,0) and white (1,1,1)
- Use `isRGBAColor()` type guard for safe color property access
- Check block type before applying text vs fill color updates
- Verify fill type is `//ly.img.ubq/fill/color` for shape fills

### Memory Issues

For high-volume processing:

- Process formats sequentially (not in parallel) to limit memory
- Dispose and recreate the engine for very large batches
- Monitor memory usage in production environments
- Consider worker processes for parallel format generation

## API Reference

| Method | Description |
|--------|-------------|
| `engine.variable.setString(name, value)` | Set a text variable's value |
| `engine.variable.findAll()` | List all variable names in the scene |
| `engine.block.findByName(name)` | Find blocks by semantic name |
| `engine.block.findByType(type)` | Find blocks by type |
| `engine.block.setName(block, name)` | Set a block's semantic name |
| `engine.block.getFill(block)` | Get the fill block ID |
| `engine.block.setFill(block, fill)` | Set a block's fill |
| `engine.block.createFill(type)` | Create a new fill of specified type |
| `engine.block.setString(block, property, value)` | Set a string property |
| `engine.block.setColor(block, property, color)` | Set a color property (RGBA, 0-1 range) |
| `engine.block.getColor(block, property)` | Get a color property |
| `engine.block.setTextColor(block, color, start, length)` | Set text color for a range |
| `engine.block.getTextColors(block)` | Get all text colors in a block |
| `engine.block.supportsFill(block)` | Check if block supports fill |
| `engine.block.setContentFillMode(block, mode)` | Set image fill mode (Cover, Contain, Crop) |
| `engine.block.resetCrop(block)` | Reset image crop to default |
| `engine.block.export(block, options)` | Export block to image format |
| `engine.scene.create(layout, options)` | Create a new scene |
| `engine.dispose()` | Dispose engine and free resources |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support