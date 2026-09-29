> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Supported Animation Types](./animation/types.md)

---

Apply entrance, exit, and loop animations to design blocks programmatically using the available animation types in CE.SDK for Node.js.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-animation-types-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-animation-types-server-js)

CE.SDK organizes animations into three categories: entrance (In), exit (Out), and loop. Each category determines when the animation plays during the block's lifecycle. This guide demonstrates how to apply different animation types and configure their properties in server-side applications.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-animation-types-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.setDuration(page, 10);

    // Set white background
    if (!engine.block.supportsFill(page) || !engine.block.getFill(page)) {
      const fill = engine.block.createFill('color');
      engine.block.setFill(page, fill);
    }
    const pageFill = engine.block.getFill(page)!;
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const margin = 40;
    const spacing = 20;
    const cols = 3;
    const rows = 2;
    const blockWidth = (pageWidth - 2 * margin - (cols - 1) * spacing) / cols;
    const blockHeight = (pageHeight - 2 * margin - (rows - 1) * spacing) / rows;

    // Helper to create an image block
    const createImageBlock = (index: number, imageUrl: string) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, blockWidth);
      engine.block.setHeight(graphic, blockHeight);

      const col = index % cols;
      const row = Math.floor(index / cols);
      engine.block.setPositionX(graphic, margin + col * (blockWidth + spacing));
      engine.block.setPositionY(
        graphic,
        margin + row * (blockHeight + spacing)
      );
      engine.block.appendChild(page, graphic);
      return graphic;
    };

    // Sample images for demonstration
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      'https://img.ly/static/ubq_samples/sample_6.jpg'
    ];

    // Block 1: Slide entrance animation with direction
    const block1 = createImageBlock(0, imageUrls[0]);

    // Create a slide animation that enters from the left
    const slideAnimation = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block1, slideAnimation);
    engine.block.setDuration(slideAnimation, 1.0);
    // Direction in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top
    engine.block.setFloat(slideAnimation, 'animation/slide/direction', Math.PI);
    engine.block.setEnum(slideAnimation, 'animationEasing', 'EaseOut');

    // Block 2: Fade animation with easing
    const block2 = createImageBlock(1, imageUrls[1]);

    // Create a fade entrance animation
    const fadeAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeAnimation);
    engine.block.setDuration(fadeAnimation, 1.0);
    engine.block.setEnum(fadeAnimation, 'animationEasing', 'EaseInOut');

    // Block 3: Zoom animation
    const block3 = createImageBlock(2, imageUrls[2]);

    // Create a zoom animation with fade effect
    const zoomAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomAnimation);
    engine.block.setDuration(zoomAnimation, 1.0);
    engine.block.setBool(zoomAnimation, 'animation/zoom/fade', true);

    // Block 4: Exit animation
    const block4 = createImageBlock(3, imageUrls[3]);

    // Create entrance and exit animations
    const wipeIn = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block4, wipeIn);
    engine.block.setDuration(wipeIn, 1.0);
    engine.block.setEnum(wipeIn, 'animation/wipe/direction', 'Right');

    // Exit animation plays before block disappears
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block4, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');

    // Block 5: Loop animation
    const block5 = createImageBlock(4, imageUrls[4]);

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block5, breathingLoop);
    engine.block.setDuration(breathingLoop, 2.0);
    // Intensity: 0 = 1.25x max scale, 1 = 2.5x max scale
    engine.block.setFloat(
      breathingLoop,
      'animation/breathing_loop/intensity',
      0.3
    );

    // Block 6: Combined animations
    const block6 = createImageBlock(5, imageUrls[5]);

    // Apply entrance, exit, and loop animations together
    const spinIn = engine.block.createAnimation('spin');
    engine.block.setInAnimation(block6, spinIn);
    engine.block.setDuration(spinIn, 1.0);
    engine.block.setEnum(spinIn, 'animation/spin/direction', 'Clockwise');
    engine.block.setFloat(spinIn, 'animation/spin/intensity', 0.5);

    const blurOut = engine.block.createAnimation('blur');
    engine.block.setOutAnimation(block6, blurOut);
    engine.block.setDuration(blurOut, 1.0);

    const swayLoop = engine.block.createAnimation('sway_loop');
    engine.block.setLoopAnimation(block6, swayLoop);
    engine.block.setDuration(swayLoop, 1.5);

    // Discover available properties for any animation
    const properties = engine.block.findAllProperties(slideAnimation);
    console.log('Slide animation properties:', properties);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Export the scene to a .scene file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save as scene file - preserves all animation data
    const sceneData = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/animation-types.imgly`, sceneData);
    console.log('Exported to output/animation-types.imgly');

    console.log('Animation Types example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

The example creates a scene with multiple blocks, each demonstrating different animation types. The scene is exported to a `.scene` file that preserves all animation data for later playback or rendering.

## Setting Up the Scene

We start by initializing CE.SDK and creating a scene.

```typescript highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});
```

We create a scene using `engine.scene.create()`, then create a page and append it to the scene. This sets up the time-based environment required for animations.

```typescript highlight-create-scene
// Create a scene with a page
const scene = engine.scene.create('DepthStack');
const page = engine.block.create('page');
engine.block.appendChild(scene, page);
engine.block.setWidth(page, 1920);
engine.block.setHeight(page, 1080);
engine.block.setDuration(page, 10);
```

## Entrance Animations

Entrance animations define how a block appears. We use `engine.block.createAnimation()` with the animation type and attach it using `engine.block.setInAnimation()`.

### Slide Animation

The slide animation moves a block in from a specified direction. The `direction` property uses radians where 0 is right, π/2 is bottom, π is left, and 3π/2 is top.

```typescript highlight-entrance-slide
// Create a slide animation that enters from the left
const slideAnimation = engine.block.createAnimation('slide');
engine.block.setInAnimation(block1, slideAnimation);
engine.block.setDuration(slideAnimation, 1.0);
// Direction in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top
engine.block.setFloat(slideAnimation, 'animation/slide/direction', Math.PI);
engine.block.setEnum(slideAnimation, 'animationEasing', 'EaseOut');
```

### Fade Animation

The fade animation transitions opacity from invisible to fully visible. Easing controls the animation curve.

```typescript highlight-entrance-fade
// Create a fade entrance animation
const fadeAnimation = engine.block.createAnimation('fade');
engine.block.setInAnimation(block2, fadeAnimation);
engine.block.setDuration(fadeAnimation, 1.0);
engine.block.setEnum(fadeAnimation, 'animationEasing', 'EaseInOut');
```

### Zoom Animation

The zoom animation scales the block from a smaller size to its final dimensions. The `fade` property adds an opacity transition during scaling.

```typescript highlight-entrance-zoom
// Create a zoom animation with fade effect
const zoomAnimation = engine.block.createAnimation('zoom');
engine.block.setInAnimation(block3, zoomAnimation);
engine.block.setDuration(zoomAnimation, 1.0);
engine.block.setBool(zoomAnimation, 'animation/zoom/fade', true);
```

Other entrance animation types include:

- `blur` — Transitions from blurred to clear
- `wipe` — Reveals with a directional wipe
- `pop` — Bouncy scale effect
- `spin` — Rotates the block into view
- `grow` — Scales up from a point

## Exit Animations

Exit animations define how a block leaves the screen. We use `engine.block.setOutAnimation()` to attach them. CE.SDK prevents overlap between entrance and exit durations automatically.

```typescript highlight-exit-animation
    // Create entrance and exit animations
    const wipeIn = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block4, wipeIn);
    engine.block.setDuration(wipeIn, 1.0);
    engine.block.setEnum(wipeIn, 'animation/wipe/direction', 'Right');

    // Exit animation plays before block disappears
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block4, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');
```

In this example, a wipe entrance transitions to a fade exit. Mirror entrance effects for visual consistency, or use contrasting effects for emphasis.

## Loop Animations

Loop animations run continuously while the block is visible. They can combine with entrance and exit animations. We use `engine.block.setLoopAnimation()` to attach them.

```typescript highlight-loop-animation
// Create a breathing loop animation
const breathingLoop = engine.block.createAnimation('breathing_loop');
engine.block.setLoopAnimation(block5, breathingLoop);
engine.block.setDuration(breathingLoop, 2.0);
// Intensity: 0 = 1.25x max scale, 1 = 2.5x max scale
engine.block.setFloat(
  breathingLoop,
  'animation/breathing_loop/intensity',
  0.3
);
```

The duration controls each cycle length. Loop animation types include:

- `breathing_loop` — Slow scale pulse
- `pulsating_loop` — Rhythmic scale
- `spin_loop` — Continuous rotation
- `fade_loop` — Opacity cycling
- `sway_loop` — Rotational oscillation
- `jump_loop` — Jumping motion
- `blur_loop` — Blur cycling
- `squeeze_loop` — Squeezing effect

## Combined Animations

A single block can have entrance, exit, and loop animations running together. The loop animation runs throughout the block's visibility while entrance and exit animations play at the appropriate times.

```typescript highlight-combined-animations
    // Apply entrance, exit, and loop animations together
    const spinIn = engine.block.createAnimation('spin');
    engine.block.setInAnimation(block6, spinIn);
    engine.block.setDuration(spinIn, 1.0);
    engine.block.setEnum(spinIn, 'animation/spin/direction', 'Clockwise');
    engine.block.setFloat(spinIn, 'animation/spin/intensity', 0.5);

    const blurOut = engine.block.createAnimation('blur');
    engine.block.setOutAnimation(block6, blurOut);
    engine.block.setDuration(blurOut, 1.0);

    const swayLoop = engine.block.createAnimation('sway_loop');
    engine.block.setLoopAnimation(block6, swayLoop);
    engine.block.setDuration(swayLoop, 1.5);
```

## Configuring Animation Properties

Each animation type has specific configurable properties. We use `engine.block.findAllProperties()` to discover available properties and `engine.block.getEnumValues()` to query options for enum properties.

```typescript highlight-discover-properties
    // Discover available properties for any animation
    const properties = engine.block.findAllProperties(slideAnimation);
    console.log('Slide animation properties:', properties);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);
```

Common configurable properties include:

- **Direction**: Controls entry/exit direction in radians or enum values
- **Easing**: Animation curve (`Linear`, `EaseIn`, `EaseOut`, `EaseInOut`)
- **Intensity**: Strength of the effect (varies by animation type)
- **Fade**: Whether to include opacity transition

## Exporting the Scene

After creating animations, we export the scene to a `.scene` file. This format preserves all animation data. It can be loaded in a browser environment for playback, or rendered to an MP4 video on the server with the native `@cesdk/node-native` package.

```typescript highlight-export
    // Export the scene to a .scene file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save as scene file - preserves all animation data
    const sceneData = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/animation-types.imgly`, sceneData);
    console.log('Exported to output/animation-types.imgly');
```

The `.scene` format stores the complete scene state including:

- All blocks and their properties
- Animation configurations
- Time-based settings
- Asset references

When the scene is played back or rendered, these animations run exactly as configured.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.create()` | Create a scene for animations |
| `engine.block.createAnimation(type)` | Create animation by type string |
| `engine.block.setInAnimation(block, anim)` | Attach entrance animation |
| `engine.block.setOutAnimation(block, anim)` | Attach exit animation |
| `engine.block.setLoopAnimation(block, anim)` | Attach loop animation |
| `engine.block.setDuration(anim, seconds)` | Set animation duration |
| `engine.block.setFloat(anim, property, value)` | Set numeric property |
| `engine.block.setEnum(anim, property, value)` | Set enum property |
| `engine.block.setBool(anim, property, value)` | Set boolean property |
| `engine.block.findAllProperties(anim)` | Discover configurable properties |
| `engine.block.getEnumValues(property)` | Get available enum values |
| `engine.scene.saveToString()` | Export scene to string format |

## Next Steps

- **Base Animations** — Create and attach animations to blocks
- **Text Animations** — Animate text with writing styles
- **Animation Overview** — Animation concepts and capabilities



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support