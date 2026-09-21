# CreativeEditor Init Callback Fails Silently

The `init` callback passed to `<CreativeEditor>` swallows thrown errors. If any line in `init` throws, all subsequent lines are skipped with **no console error or warning**. This results in a partially-built scene that appears "broken" with no obvious cause.

## Rule

During development, wrap sections of the `init` callback in `try/catch` with `console.error` logging. For production, wrap the entire `init` body in a `try/catch` to surface failures.

```tsx
import { DesignEditorConfig } from './config/plugin';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

<CreativeEditor
  init={async (cesdk) => {
    try {
      // Add configuration plugin
      await cesdk.addPlugin(new DesignEditorConfig());

      // Add default asset source plugins
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

      // Add demo and upload asset sources
      await cesdk.addPlugin(
        new UploadAssetSources({ include: ['ly.img.image.upload'] })
      );
      await cesdk.addPlugin(
        new DemoAssetSources({
          include: [
            'ly.img.image.*',
            'ly.img.templates.blank.*',
            'ly.img.templates.social.*'
          ]
        })
      );

      // Create scene
      await cesdk.actions.run('scene.create', {
        page: {
          sourceId: 'ly.img.page.presets',
          assetId: 'ly.img.page.presets.print.iso.a6.landscape'
        }
      });

      const engine = cesdk.engine;
      const page = engine.block.findByType('page')[0];

      // ... scene setup ...
    } catch (error) {
      console.error('[CE.SDK init] Failed:', error);
    }
  }}
/>;
```

## Symptoms of Silent Init Failure

- The editor loads but the scene is empty or partially built
- Some blocks are missing that should have been created
- No errors in the browser console
- The issue is intermittent (depends on which line throws)

## Debugging Strategy

Add section markers to isolate which part of `init` is failing:

```ts
init={async (cesdk) => {
  console.log('[init] Starting');
  try {
    await cesdk.addPlugin(new DesignEditorConfig());
    console.log('[init] Config loaded');

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
    console.log('[init] Default assets loaded');

    // Demo and upload sources
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({ include: ['ly.img.image.*'] })
    );
    console.log('[init] Demo assets loaded');

    // Create scene
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });
    console.log('[init] Scene created');

    // ... more setup ...
    console.log('[init] Complete');
  } catch (error) {
    console.error('[init] Failed:', error);
  }
}}
```

If `[init] Complete` never appears but no error is logged, the error is being swallowed by the `<CreativeEditor>` component itself. Adding the `try/catch` makes the error visible.
