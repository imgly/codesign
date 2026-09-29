# Asset Handling

Patterns for working with images, URIs, and fills in CE.SDK.

## Image Format: Use PNG or WebP, Not SVG

CE.SDK uses a **Skia-based rendering engine** with limited SVG support. Complex SVGs (gradients, filters, advanced paths) may render incorrectly or as blank.

**Recommended formats:**

- **PNG** — Best compatibility, supports alpha transparency
- **WebP** — Smaller file size, good browser support
- **JPEG** — For photos without transparency

**Converting SVGs to PNG:**

```javascript
import sharp from 'sharp';

await sharp('input.svg')
  .resize(800, 940)
  .png({ compressionLevel: 6 })
  .toFile('output.png');

// Verify alpha channel is preserved
const meta = await sharp('output.png').metadata();
console.log(meta.hasAlpha); // true
console.log(meta.channels); // 4
```

---

## URI Resolution

CE.SDK resolves **relative URIs** against `config.baseURL`, which defaults to the IMG.LY CDN:

```
config.baseURL = 'https://cdn.img.ly/packages/imgly/cesdk-js/<version>/assets'
```

A URI like `/mockups/tshirt.png` becomes `https://cdn.img.ly/.../mockups/tshirt.png` — not `https://yourapp.com/mockups/tshirt.png`.

### Resolving Local Assets

For assets served from your app's `public/` directory, prepend the app origin:

```typescript
function resolveLocalUri(uri: string): string {
  if (uri.startsWith('/')) {
    return `${window.location.origin}${uri}`;
  }
  return uri;
}

// Usage
const absoluteUri = resolveLocalUri('/mockups/tshirt_white_front.png');
// → 'http://localhost:5173/mockups/tshirt_white_front.png'
```

Apply this helper **before** passing URIs to any CE.SDK image API.

---

## Source Sets vs. Single URI

CE.SDK supports two ways to set an image on a fill block:

### `setSourceSet` (Preferred)

Provides image dimensions alongside the URI, enabling better layout and cropping:

```typescript
const fill = engine.block.getFill(block);
engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
  { uri: 'https://example.com/mockup.png', width: 800, height: 940 }
]);
```

The `Source` type from `@cesdk/engine`:

```typescript
interface Source {
  uri: string;
  width: number;
  height: number;
}
```

### `setString` (Simple but Limited)

Sets only the URI — the engine must load the image to determine dimensions:

```typescript
engine.block.setString(
  fill,
  'fill/image/imageFileURI',
  'https://example.com/mockup.png'
);
```

Use `setSourceSet` when you know the image dimensions (which you usually do for mockups and templates).

---

## Fill Types

CE.SDK supports several fill types:

| Fill Type | Created With                       | Use Case                                  |
| --------- | ---------------------------------- | ----------------------------------------- |
| `'image'` | `engine.block.createFill('image')` | Product mockups, user photos, backgrounds |
| `'color'` | `engine.block.createFill('color')` | Solid color backgrounds, placeholders     |
| `'video'` | `engine.block.createFill('video')` | Video backgrounds                         |

### Setting Fills

```typescript
// Image fill
const imageFill = engine.block.createFill('image');
engine.block.setFill(block, imageFill);
engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', sources);

// Color fill (e.g. transparent page background)
const colorFill = engine.block.getFill(page); // pages have a default fill
engine.block.setColor(colorFill, 'fill/color/value', {
  r: 0,
  g: 0,
  b: 0,
  a: 0
});
```

---

## Color Variant Pattern

For products with multiple color variants (t-shirt colors, case colors, etc.), use a `{{color}}` placeholder in the URI template:

```typescript
// Product configuration
const mockupUri = '/mockups/tshirt_{{color}}_front.png';

// At runtime, replace with the selected color
const resolvedUri = resolveLocalUri(
  mockupUri.replace('{{color}}', selectedColor.id)
);
// → 'http://localhost:5173/mockups/tshirt_black_front.png'
```

### File Naming Convention

```
/public/mockups/
  tshirt_white_front.png
  tshirt_white_back.png
  tshirt_black_front.png
  tshirt_black_back.png
  tshirt_red_front.png
  tshirt_red_back.png
  ...
```

Pattern: `{product}_{colorId}_{areaId}.png`

### Pre-creating All Variants

For smooth color switching, pre-create a mockup block for every area × color combination and toggle visibility rather than swapping image URIs:

```typescript
for (const area of product.areas) {
  for (const color of product.colors) {
    const block = createMockupBlock(engine, scene);
    engine.block.setName(block, `Mockup-${area.id}-${color.id}`);
    configureMockupBlock(engine, block, area, color);
    engine.block.setVisible(block, false); // hidden until selected
  }
}
```

This avoids image loading delays when switching colors.
