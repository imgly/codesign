> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Asset Content JSON Schema](./import-media/content-json-schema.md)

---

Reference documentation for the JSON schema structure used to define asset source content in CE.SDK.

Asset content JSON files define the structure and metadata for assets that CE.SDK loads into asset sources. This schema supports images, videos, audio, fonts, templates, colors, shapes, and effects.

## Manifest Structure

Every `content.json` file requires three top-level fields:

```json
{
  "version": "2.0.0",
  "id": "my.custom.source",
  "assets": []
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | `string` | Yes | Schema version |
| `id` | `string` | Yes | Unique identifier for the asset source |
| `assets` | `AssetDefinition[]` | Yes | Array of asset definitions |

## Asset Definition

Each asset in the `assets` array follows this structure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier within the source |
| `label` | `Record<Locale, string>` | No | Localized display names for UI and tooltips |
| `tags` | `Record<Locale, string[]>` | No | Localized keywords for search and filtering |
| `groups` | `string[]` | No | Categories for grouping assets in the UI |
| `meta` | `AssetMetaData` | No | Content-specific metadata |
| `payload` | `AssetPayload` | No | Structured data for specialized assets |

### Localization

Labels and tags use locale codes as keys (e.g., `"en"`, `"de"`, `"fr"`). CE.SDK selects the appropriate translation based on the user's locale.

```json
{
  "id": "mountain-photo",
  "label": {
    "en": "Mountain Landscape",
    "de": "Berglandschaft"
  },
  "tags": {
    "en": ["nature", "mountain"],
    "de": ["natur", "berg"]
  },
  "groups": ["landscapes", "nature"]
}
```

## Asset Metadata

The `meta` object contains content-specific information for loading and applying assets.

### Content Properties

Define URIs and file information for loading the asset content. The `uri` property points to the main asset file, while `thumbUri` and `previewUri` provide optimized versions for UI display.

```json
{
  "meta": {
    "uri": "{{base_url}}/images/photo.jpg",
    "thumbUri": "{{base_url}}/thumbnails/photo-thumb.jpg",
    "previewUri": "{{base_url}}/previews/photo-preview.jpg",
    "filename": "photo.jpg",
    "mimeType": "image/jpeg"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `uri` | `string` | Primary content URI. Supports `{{base_url}}` placeholder |
| `thumbUri` | `string` | Thumbnail image URI for previews |
| `previewUri` | `string` | Higher-quality preview URI |
| `filename` | `string` | Original filename |
| `mimeType` | `string` | MIME type (e.g., `"image/jpeg"`, `"video/mp4"`) |

### Dimension Properties

Specify the pixel dimensions of the asset. CE.SDK uses these values for layout calculations and aspect ratio preservation when inserting assets into a design.

```json
{
  "meta": {
    "width": 1920,
    "height": 1280
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Content width in pixels |
| `height` | `number` | Content height in pixels |

### Block Creation Properties

Control what design block CE.SDK creates when the asset is applied. These properties determine how the asset integrates into the design structure.

```json
{
  "meta": {
    "blockType": "//ly.img.ubq/graphic",
    "fillType": "//ly.img.ubq/fill/image",
    "shapeType": "//ly.img.ubq/shape/rect",
    "kind": "image"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `blockType` | `string` | Design block type to create |
| `fillType` | `string` | Fill type for the block |
| `shapeType` | `string` | Shape type for stickers/shapes |
| `kind` | `string` | Asset category hint (e.g., `"image"`, `"video"`, `"template"`) |

**Block Type Values:**

| Value | Use Case |
|-------|----------|
| `//ly.img.ubq/graphic` | Images, stickers, graphics |
| `//ly.img.ubq/text` | Text blocks |
| `//ly.img.ubq/audio` | Audio clips |
| `//ly.img.ubq/page` | Templates, pages |
| `//ly.img.ubq/group` | Grouped elements |
| `//ly.img.ubq/cutout` | Cutout shapes |

**Fill Type Values:**

| Value | Use Case |
|-------|----------|
| `//ly.img.ubq/fill/image` | Image fills |
| `//ly.img.ubq/fill/video` | Video fills |
| `//ly.img.ubq/fill/color` | Solid color fills |
| `//ly.img.ubq/fill/gradient/linear` | Linear gradients |
| `//ly.img.ubq/fill/gradient/radial` | Radial gradients |
| `//ly.img.ubq/fill/gradient/conical` | Conical gradients |

**Shape Type Values:**

| Value | Use Case |
|-------|----------|
| `//ly.img.ubq/shape/rect` | Rectangles |
| `//ly.img.ubq/shape/ellipse` | Circles, ovals |
| `//ly.img.ubq/shape/polygon` | Polygons |
| `//ly.img.ubq/shape/star` | Star shapes |
| `//ly.img.ubq/shape/line` | Lines |
| `//ly.img.ubq/shape/vector_path` | Custom vector paths |

### Media Properties

Configure playback behavior for time-based media like video and audio. Use `duration` to specify length and `looping` to enable repeat playback for background music or ambient video.

```json
{
  "meta": {
    "duration": "30",
    "looping": true,
    "vectorPath": "M10 10 L90 90"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `duration` | `string` | Duration in seconds as a string (e.g., `"30"`, `"120"`) |
| `looping` | `boolean` | Whether media should loop continuously. Use for background music or ambient video |
| `vectorPath` | `string` | SVG path data for vector shapes |

### Effect Properties

Define visual effects that can be applied to design blocks. Effects include filters, blurs, and color adjustments.

```json
{
  "meta": {
    "effectType": "//ly.img.ubq/effect/lut_filter",
    "blurType": "//ly.img.ubq/blur/uniform"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `effectType` | `string` | Effect type (e.g., `"//ly.img.ubq/effect/lut_filter"`, `"//ly.img.ubq/effect/duotone_filter"`) |
| `blurType` | `string` | Blur type: `"//ly.img.ubq/blur/uniform"`, `"//ly.img.ubq/blur/linear"`, `"//ly.img.ubq/blur/mirrored"`, `"//ly.img.ubq/blur/radial"` |

### Responsive Sources

The `sourceSet` property defines multiple resolutions for responsive loading. This enables CE.SDK to load an appropriately sized image based on the display context, reducing bandwidth for thumbnails while providing full resolution when needed.

```json
{
  "meta": {
    "sourceSet": [
      { "uri": "{{base_url}}/small.jpg", "width": 640, "height": 480 },
      { "uri": "{{base_url}}/medium.jpg", "width": 1280, "height": 960 },
      { "uri": "{{base_url}}/large.jpg", "width": 1920, "height": 1440 }
    ]
  }
}
```

When a user browses assets in the library panel, CE.SDK loads the smallest appropriate resolution. When the asset is added to the canvas and zoomed in, higher resolutions are loaded on demand. This pattern significantly improves initial load times for asset libraries with many items.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `uri` | `string` | Yes | Source URI |
| `width` | `number` | Yes | Source width in pixels |
| `height` | `number` | Yes | Source height in pixels |

## Asset Payload

The `payload` object contains structured data for specialized asset types like colors, fonts, and presets.

| Property | Type | Description |
|----------|------|-------------|
| `color` | `AssetColor` | Color definition |
| `typeface` | `Typeface` | Font family definition |
| `transformPreset` | `AssetTransformPreset` | Page size or aspect ratio preset |
| `sourceSet` | `Source[]` | Responsive sources (same as meta.sourceSet) |

### Color Payload

Colors support three color spaces: sRGB, CMYK, and Spot Color. Use sRGB for screen-based designs, CMYK for print workflows, and Spot Color for brand-specific colors that require exact color matching.

**sRGB Color:**

```json
{
  "payload": {
    "color": {
      "colorSpace": "sRGB",
      "r": 0.2,
      "g": 0.4,
      "b": 0.8
    }
  }
}
```

sRGB is the standard color space for web and digital displays. Component values range from 0 to 1, where `{ r: 1, g: 0, b: 0 }` represents pure red.

| Property | Type | Range | Description |
|----------|------|-------|-------------|
| `colorSpace` | `"sRGB"` | — | Color space identifier |
| `r` | `number` | 0–1 | Red component |
| `g` | `number` | 0–1 | Green component |
| `b` | `number` | 0–1 | Blue component |

**CMYK Color:**

```json
{
  "payload": {
    "color": {
      "colorSpace": "CMYK",
      "c": 0.75,
      "m": 0.25,
      "y": 0.0,
      "k": 0.1
    }
  }
}
```

CMYK is used for print production. Component values represent ink percentages from 0 to 1, where higher values mean more ink coverage.

| Property | Type | Range | Description |
|----------|------|-------|-------------|
| `colorSpace` | `"CMYK"` | — | Color space identifier |
| `c` | `number` | 0–1 | Cyan component |
| `m` | `number` | 0–1 | Magenta component |
| `y` | `number` | 0–1 | Yellow component |
| `k` | `number` | 0–1 | Black (key) component |

**Spot Color:**

```json
{
  "payload": {
    "color": {
      "colorSpace": "SpotColor",
      "name": "Brand-Blue-286",
      "externalReference": "spot://brand-blue-286",
      "representation": {
        "colorSpace": "sRGB",
        "r": 0.0,
        "g": 0.22,
        "b": 0.62
      }
    }
  }
}
```

Spot colors reference named colors from a named-color system (for example, your in-house brand palette or a print vendor's spot-color library). The `representation` provides a screen preview while the actual color is defined by the external reference for accurate print reproduction.

| Property | Type | Description |
|----------|------|-------------|
| `colorSpace` | `"SpotColor"` | Color space identifier |
| `name` | `string` | Spot color name |
| `externalReference` | `string` | External reference URI |
| `representation` | `AssetRGBColor \| AssetCMYKColor` | Screen/print representation |

### Typeface Payload

Defines a font family with multiple font files for different weights and styles. This enables CE.SDK to load the correct font file when text formatting changes.

```json
{
  "payload": {
    "typeface": {
      "name": "Roboto",
      "fonts": [
        {
          "uri": "{{base_url}}/Roboto-Regular.ttf",
          "subFamily": "Regular",
          "weight": "normal",
          "style": "normal"
        },
        {
          "uri": "{{base_url}}/Roboto-Bold.ttf",
          "subFamily": "Bold",
          "weight": "bold",
          "style": "normal"
        },
        {
          "uri": "{{base_url}}/Roboto-Italic.ttf",
          "subFamily": "Italic",
          "weight": "normal",
          "style": "italic"
        }
      ]
    }
  }
}
```

Each font entry in the `fonts` array represents a single font file. When a user applies bold formatting, CE.SDK automatically selects the font entry with `weight: "bold"`. Include all weight and style combinations you want to support.

**Typeface Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Typeface family name |
| `fonts` | `Font[]` | Yes | Array of font definitions |

**Font Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `uri` | `string` | Yes | Font file URI (.ttf, .otf, .woff, .woff2) |
| `subFamily` | `string` | Yes | Font subfamily name (e.g., "Regular", "Bold Italic") |
| `weight` | `FontWeight` | No | Font weight |
| `style` | `FontStyle` | No | Font style |

**Font Weight Values:** `"thin"`, `"extraLight"`, `"light"`, `"normal"`, `"medium"`, `"semiBold"`, `"bold"`, `"extraBold"`, `"heavy"`

**Font Style Values:** `"normal"`, `"italic"`

### Transform Preset Payload

Defines page size or aspect ratio presets for templates, canvases, and crop tools. Use these to provide users with common format options like social media dimensions or print sizes.

**Fixed Size:**

```json
{
  "payload": {
    "transformPreset": {
      "type": "FixedSize",
      "width": 1080,
      "height": 1920,
      "designUnit": "Pixel"
    }
  }
}
```

Fixed size presets lock both width and height to specific values. Use `designUnit` to specify whether dimensions are in pixels (for digital), millimeters, or inches (for print).

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"FixedSize"` | Preset type |
| `width` | `number` | Width value |
| `height` | `number` | Height value |
| `designUnit` | `string` | Unit: `"Pixel"`, `"Millimeter"`, or `"Inch"` |

**Fixed Aspect Ratio:**

```json
{
  "payload": {
    "transformPreset": {
      "type": "FixedAspectRatio",
      "width": 16,
      "height": 9
    }
  }
}
```

Fixed aspect ratio presets maintain proportions while allowing flexible sizing. The width and height values represent the ratio components, not pixel dimensions.

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"FixedAspectRatio"` | Preset type |
| `width` | `number` | Aspect ratio width component |
| `height` | `number` | Aspect ratio height component |

**Free Aspect Ratio:**

```json
{
  "payload": {
    "transformPreset": {
      "type": "FreeAspectRatio"
    }
  }
}
```

Free aspect ratio presets allow unrestricted resizing without maintaining proportions.

**Content Aspect Ratio:**

```json
{
  "payload": {
    "transformPreset": {
      "type": "ContentAspectRatio"
    }
  }
}
```

Content aspect ratio presets snap the block's frame to the intrinsic aspect ratio of its content, resolved from the fill's `sourceSet` when the preset is applied. Use this to revert a cropped image or video block to its natural proportions. Applying this preset to a block without resolvable content dimensions (e.g. a text block, empty placeholder, or page) returns an error.

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"ContentAspectRatio"` | Preset type |

## Base URL Placeholder

The `{{base_url}}` placeholder enables portable asset definitions. CE.SDK replaces this placeholder with the actual base path when loading:

- **From URL:** The parent directory of the JSON file becomes the base URL
- **From string:** You provide the base URL explicitly when loading

```json
{
  "meta": {
    "uri": "{{base_url}}/images/photo.jpg",
    "thumbUri": "{{base_url}}/thumbnails/photo.jpg"
  }
}
```

## Asset Type Examples

### Image Asset

Standard image assets are the most common type, used for photos, illustrations, and background images. They require a `blockType` of graphic with an image fill.

```json
{
  "id": "photo-001",
  "label": { "en": "Mountain Landscape" },
  "tags": { "en": ["nature", "mountain"] },
  "meta": {
    "uri": "{{base_url}}/mountain.jpg",
    "thumbUri": "{{base_url}}/mountain-thumb.jpg",
    "mimeType": "image/jpeg",
    "blockType": "//ly.img.ubq/graphic",
    "fillType": "//ly.img.ubq/fill/image",
    "width": 1920,
    "height": 1280
  }
}
```

### Video Asset

Video assets include duration information and use a video fill type. Set `looping` to `true` for videos that should repeat continuously.

```json
{
  "id": "video-001",
  "label": { "en": "Intro Animation" },
  "meta": {
    "uri": "{{base_url}}/intro.mp4",
    "thumbUri": "{{base_url}}/intro-thumb.jpg",
    "mimeType": "video/mp4",
    "blockType": "//ly.img.ubq/graphic",
    "fillType": "//ly.img.ubq/fill/video",
    "width": 1920,
    "height": 1080,
    "duration": "5",
    "looping": false
  }
}
```

### Audio Asset

Audio assets use the audio block type and don't require visual dimensions. Set `looping` to `true` for background music that should repeat continuously throughout the design.

```json
{
  "id": "audio-001",
  "label": { "en": "Background Music" },
  "meta": {
    "uri": "{{base_url}}/music.mp3",
    "mimeType": "audio/mpeg",
    "blockType": "//ly.img.ubq/audio",
    "duration": "120",
    "looping": true
  }
}
```

### Sticker Asset

Stickers are vector graphics that maintain quality at any size. They use the `vector_path` shape type and typically reference SVG files.

```json
{
  "id": "sticker-001",
  "label": { "en": "Star Badge" },
  "meta": {
    "uri": "{{base_url}}/star.svg",
    "thumbUri": "{{base_url}}/star-thumb.png",
    "mimeType": "image/svg+xml",
    "blockType": "//ly.img.ubq/graphic",
    "shapeType": "//ly.img.ubq/shape/vector_path",
    "width": 200,
    "height": 200
  }
}
```

### Template Asset

Templates are complete design scenes that can be loaded as starting points. Use `kind: "template"` to identify them in the UI.

```json
{
  "id": "template-001",
  "label": { "en": "Social Media Story" },
  "meta": {
    "uri": "{{base_url}}/story-template.scene",
    "thumbUri": "{{base_url}}/story-thumb.jpg",
    "kind": "template",
    "width": 1080,
    "height": 1920
  }
}
```

### Crop Preset Asset

Crop presets define aspect ratios for the crop tool. Use `transformPreset` in the payload to specify the ratio without fixed pixel dimensions.

```json
{
  "id": "crop-square",
  "label": { "en": "Square" },
  "groups": ["social"],
  "payload": {
    "transformPreset": {
      "type": "FixedAspectRatio",
      "width": 1,
      "height": 1
    }
  }
}
```

### Page Format Preset Asset

Page format presets define canvas sizes for new designs. Use `FixedSize` to specify exact dimensions in pixels, millimeters, or inches.

```json
{
  "id": "format-instagram-story",
  "label": { "en": "Instagram Story" },
  "groups": ["social"],
  "meta": {
    "thumbUri": "{{base_url}}/instagram-story-thumb.jpg"
  },
  "payload": {
    "transformPreset": {
      "type": "FixedSize",
      "width": 1080,
      "height": 1920,
      "designUnit": "Pixel"
    }
  }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Assets not appearing | Verify `version`, `id`, and `assets` fields exist at the top level |
| Invalid asset | Ensure each asset has a unique `id` |
| Missing thumbnails | Check `thumbUri` points to accessible image URLs |
| Base URL not resolving | Use exact `{{base_url}}` syntax (double curly braces) |
| Unreachable asset URLs | Verify the asset host is reachable from your server |
| Wrong block created | Verify `meta.blockType` matches the intended design block |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support