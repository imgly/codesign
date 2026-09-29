# Common Pitfalls

Non-obvious failure modes when building with CE.SDK and their solutions.

## `alwaysOnBottom` Is Unreliable for Page Children

**Problem:** Setting `alwaysOnBottom: true` on a graphic block that is a child of a page does not reliably keep it behind other page children. The block may render on top of user content.

**Solution:** For background images (like product mockups), attach the graphic block to the **scene** — not to the page. Use `engine.block.insertChild(sceneBlock, block, 0)` to place it behind all pages.

See: `mockup-editor-architecture.md` (in the rules directory)

---

## SVGs Don't Render Reliably

**Problem:** CE.SDK uses a Skia-based rendering engine that has limited SVG support. SVGs with `<linearGradient>`, `<radialGradient>`, complex `<path>` elements, or certain filters may render as blank or broken.

**Solution:** Convert SVGs to PNG (or WebP) before using them in CE.SDK. Use a library like `sharp`:

```javascript
import sharp from 'sharp';
await sharp('mockup.svg').resize(800, 940).png().toFile('mockup.png');
```

Ensure PNGs preserve alpha transparency (`hasAlpha: true`).

---

## Relative URIs Resolve Against the CDN, Not Your App

**Problem:** CE.SDK resolves relative URIs against `config.baseURL` (typically `https://cdn.img.ly/packages/imgly/cesdk-js/...`). A URI like `/mockups/tshirt.png` will resolve to the CDN, not your app's origin.

**Solution:** Convert local asset paths to absolute URLs:

```typescript
function resolveLocalUri(uri: string): string {
  if (uri.startsWith('/')) {
    return `${window.location.origin}${uri}`;
  }
  return uri;
}
```

Apply this before passing URIs to `setSourceSet` or `setString('fill/image/imageFileURI', ...)`.

---

## Scene Creation Can Reset Feature Flags

**Problem:** Scene creation may reset editor settings like `singlePageMode` or `page/dimOutOfPageAreas`. Settings applied in the config's `featureFlags` may not survive scene creation.

**Solution:** Use the action-based scene creation, or manual `engine.scene.create()` for full control:

```typescript
// Approach A: Action-based scene creation (recommended)
// Scenes are unified by default — design and video capabilities both work.
await cesdk.actions.run('scene.create', {
  page: {
    sourceId: 'ly.img.page.presets',
    assetId: 'ly.img.page.presets.print.iso.a6.landscape'
  }
});

// With custom dimensions
await cesdk.actions.run('scene.create', {
  page: { width: 1080, height: 1920, unit: 'Pixel' }
});

// Approach B: Manual scene creation (preferred for mockup editors)
engine.scene.create();
engine.editor.setSettingBool('page/dimOutOfPageAreas', false);
```

---

## Asset Sources Must Be Added as Plugins

**Problem:** Asset sources are not available by default. Each asset source must be explicitly added as a plugin.

**Solution:** Import and add individual asset source plugins from `@cesdk/cesdk-js/plugins`:

```typescript
import {
  ImageColorsAssetSource,
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Default asset source plugins
await cesdk.addPlugin(new BlurAssetSource());
await cesdk.addPlugin(new ImageColorsAssetSource());
await cesdk.addPlugin(new ColorPaletteAssetSource());
await cesdk.addPlugin(new CropPresetsAssetSource());
await cesdk.addPlugin(new EffectsAssetSource());
await cesdk.addPlugin(new FiltersAssetSource());
await cesdk.addPlugin(new PagePresetsAssetSource());
await cesdk.addPlugin(new StickerAssetSource());
await cesdk.addPlugin(new TextAssetSource());
await cesdk.addPlugin(new TextComponentAssetSource());
await cesdk.addPlugin(new TypefaceAssetSource());
await cesdk.addPlugin(new VectorShapeAssetSource());

// Demo and upload sources
await cesdk.addPlugin(
  new UploadAssetSources({ include: ['ly.img.image.upload'] })
);
await cesdk.addPlugin(
  new DemoAssetSources({
    include: ['ly.img.image.*', 'ly.img.templates.social.*']
  })
);
```

Asset source IDs:

| Plugin Class                | Asset Source ID          |
| --------------------------- | ------------------------ |
| `BlurAssetSource`           | `ly.img.blur`            |
| `CaptionPresetsAssetSource` | `ly.img.caption.presets` |
| `ColorPaletteAssetSource`   | `ly.img.color.palette`   |
| `CropPresetsAssetSource`    | `ly.img.crop.presets`    |
| `EffectsAssetSource`        | `ly.img.effect`          |
| `FiltersAssetSource`        | `ly.img.filter`          |
| `PagePresetsAssetSource`    | `ly.img.page.presets`    |
| `StickerAssetSource`        | `ly.img.sticker`         |
| `TextAssetSource`           | `ly.img.text`            |
| `TextComponentAssetSource`  | `ly.img.text.components` |
| `TypefaceAssetSource`       | `ly.img.typeface`        |
| `VectorShapeAssetSource`    | `ly.img.vector.shape`    |

---

## White-on-White Invisible Fills

**Problem:** Setting a white product mockup as a page's image fill makes it invisible — white image on white canvas background.

**Solution:** Don't use page image fills for mockups. The correct architecture uses:

1. **Transparent** page fill (`{ r: 0, g: 0, b: 0, a: 0 }`)
2. **Scene-level mockup block** behind the page
3. CE.SDK's gray canvas background provides contrast

See: `mockup-editor-architecture.md` (in the rules directory)

---

## `contentFillMode` Is Block-Level, Not Fill-Level

**Problem:** Trying to set `fill/content/fillMode` or `contentFillMode` on an `ImageFill` block throws:

```
Property not found: "fill/content/fillMode"
Type of member named "contentFillMode" on "ImageFill" is not reflected.
```

**Solution:** Content fill mode is set on the **block**, not the fill:

```typescript
// Wrong — this property does not exist on the fill
engine.block.setString(fill, 'fill/content/fillMode', 'Cover');

// Correct — use the convenience method on the block
engine.block.setContentFillMode(graphicBlock, 'Cover');

// Also correct — use setEnum with the property path
engine.block.setEnum(graphicBlock, 'contentFill/mode', 'Cover');
```

---

## Use `setSourceSet` Instead of `setString` for Images

**Problem:** Using `setString(fill, 'fill/image/imageFileURI', uri)` works but doesn't provide image dimensions to the engine, which can cause layout and cropping issues.

**Solution:** Use `setSourceSet` which includes width and height metadata:

```typescript
// Preferred
engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
  { uri: 'https://example.com/image.png', width: 800, height: 940 }
]);

// Avoid for production use
engine.block.setString(
  fill,
  'fill/image/imageFileURI',
  'https://example.com/image.png'
);
```

The `Source` type from `@cesdk/engine` defines the shape: `{ uri: string; width: number; height: number }`.

---

## `zoomToBlock` Uses an Options Object

**Problem:** `zoomToBlock` requires an options object for padding, not positional arguments.

**Solution:**

```typescript
await engine.scene.zoomToBlock(pageBlock, {
  paddingLeft: 40,
  paddingTop: 40,
  paddingRight: 40,
  paddingBottom: 40
});
```

**Note:** `zoomToBlock` is not for page switching. It only changes the viewport, not the active page. Use `cesdk.unstable_switchPage(pageId)` to switch pages in single-page mode.

---

## Page `editor/select` Scope and Canvas Interactions

**Problem:** When the page itself is selectable, users may accidentally select and move it, breaking the layout.

**Solution:** Disable the select scope on page blocks:

```typescript
engine.block.setScopeEnabled(page, 'editor/select', false);
```

This prevents the page from being selected while still allowing interaction with child elements (text, images, shapes).

---

## Never Rewrite Starter Kit Files From Scratch

**Problem:** Writing `index.html`, `vite.config.ts`, `tsconfig.json`, or `tsconfig.base.json` from scratch leads to missing styles. The starter kit's `index.html` contains critical CSS resets (zero margin/padding, overflow hidden, overscroll-behavior) required for full-bleed editors.

**Solution:** Copy these files directly from the starter kit and adapt only what's necessary (e.g., changing the script `src` for React). Do not rewrite them from scratch when the kit already provides them.

---

## Starter Kits Are TypeScript: Copy First, Then Transpile for JS

**Problem:** All bundled starter kits use TypeScript (`.ts` files, `tsconfig.json`, type annotations). Copying them into a JavaScript project without conversion leads to syntax errors. Manually rewriting or converting files by hand leads to missing CSS resets, broken Vite configs, or incorrect plugin initialization.

**Solution:** Always **copy the starter kit into the user's project first**, then run the bundled transpile script on the **user's project copy**:

```bash
# 1. Install typescript temporarily (needed by the transpile script)
cd /path/to/users/project && npm install --no-save typescript

# 2. Run the transpile script on the user's project copy (NOT on the starter kit source)
node <path-to-skill>/scripts/transpile-to-js.mjs /path/to/users/project
```

The script strips type annotations, renames `.ts` to `.js`, removes `tsconfig.json`/`tsconfig.base.json`, updates `index.html` references, and cleans TypeScript dependencies from `package.json`.

Find the script with Glob: `**/skills/build/scripts/transpile-to-js.mjs`

**Never run the transpile script on the starter kit source directory.** Never manually strip types or rewrite files by hand. Copy first, then transpile the copy.
