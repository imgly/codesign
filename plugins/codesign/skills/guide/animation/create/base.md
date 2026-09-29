> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Create Animations](./animation/create.md) > [Base Animations](./animation/create/base.md)

---

Add motion to design blocks with entrance, exit, and loop animations using CE.SDK's animation system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-animation-create-base-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-animation-create-base-server-js)

Base animations in CE.SDK add motion to design blocks through entrance (In), exit (Out), and loop animations. Animations are created as separate objects and attached to blocks, enabling reusable configurations across multiple elements.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-animation-create-base-server-js/server-js.ts reference-only
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
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // Helper to create an image block
    const createImageBlock = (
      x: number,
      y: number,
      width: number,
      height: number,
      imageUrl: string
    ) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, width);
      engine.block.setHeight(graphic, height);
      engine.block.setPositionX(graphic, x);
      engine.block.setPositionY(graphic, y);
      engine.block.appendChild(page, graphic);
      return graphic;
    };

    // Layout configuration
    const margin = 100;
    const spacing = 50;
    const blockWidth = 500;
    const blockHeight = 350;

    // Sample images
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      'https://img.ly/static/ubq_samples/sample_6.jpg'
    ];

    // Block 1: Check animation support and create entrance animation
    const block1 = createImageBlock(
      margin,
      margin,
      blockWidth,
      blockHeight,
      imageUrls[0]
    );

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(block1)) {
      // Create an entrance animation
      const slideAnimation = engine.block.createAnimation('slide');
      engine.block.setInAnimation(block1, slideAnimation);
      engine.block.setDuration(slideAnimation, 1.0);
    }

    // Block 2: Entrance animation with easing configuration
    const block2 = createImageBlock(
      margin + blockWidth + spacing,
      margin,
      blockWidth,
      blockHeight,
      imageUrls[1]
    );

    // Create a fade entrance animation with easing
    const fadeInAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeInAnimation);
    engine.block.setDuration(fadeInAnimation, 1.0);
    engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');

    // Block 3: Exit animation
    const block3 = createImageBlock(
      margin + 2 * (blockWidth + spacing),
      margin,
      blockWidth,
      blockHeight,
      imageUrls[2]
    );

    // Create both entrance and exit animations
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');

    // Block 4: Loop animation
    const block4 = createImageBlock(
      margin,
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[3]
    );

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block4, breathingLoop);
    engine.block.setDuration(breathingLoop, 1.0);

    // Block 5: Animation properties and slide direction
    const block5 = createImageBlock(
      margin + blockWidth + spacing,
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[4]
    );

    // Create slide animation and configure direction
    const slideFromTop = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block5, slideFromTop);
    engine.block.setDuration(slideFromTop, 1.0);

    // Set slide direction (radians describe the motion direction the block
    // travels along; the block enters from the opposite side):
    //   0=slides right (enters from left), PI/2=slides down (enters from top),
    //   PI=slides left (enters from right), 3*PI/2=slides up (enters from bottom)
    engine.block.setFloat(
      slideFromTop,
      'animation/slide/direction',
      Math.PI / 2
    );
    engine.block.setEnum(slideFromTop, 'animationEasing', 'EaseInOut');

    // Discover all available properties for this animation
    const properties = engine.block.findAllProperties(slideFromTop);
    console.log('Slide animation properties:', properties);

    // Block 6: Get animations and replace them
    const block6 = createImageBlock(
      margin + 2 * (blockWidth + spacing),
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[5]
    );

    // Set initial animations
    const initialIn = engine.block.createAnimation('pan');
    engine.block.setInAnimation(block6, initialIn);
    engine.block.setDuration(initialIn, 1.0);

    const spinLoop = engine.block.createAnimation('spin_loop');
    engine.block.setLoopAnimation(block6, spinLoop);
    engine.block.setDuration(spinLoop, 1.0);

    // Get current animations
    const currentIn = engine.block.getInAnimation(block6);
    const currentLoop = engine.block.getLoopAnimation(block6);
    const currentOut = engine.block.getOutAnimation(block6);

    console.log(
      'Animation IDs - In:',
      currentIn,
      'Loop:',
      currentLoop,
      'Out:',
      currentOut
    );

    // Replace in animation (destroy old one first to avoid memory leaks)
    if (currentIn !== 0) {
      engine.block.destroy(currentIn);
    }
    const newInAnimation = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block6, newInAnimation);
    engine.block.setDuration(newInAnimation, 1.0);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Save the scene with all animations to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const sceneString = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/base-animations.imgly`, sceneString);
    console.log('Saved scene to output/base-animations.imgly');

    console.log('Base Animations example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers creating animations, attaching them to blocks, configuring properties like duration and easing, and managing animation lifecycle.

## Initialize the Engine

Set up the headless Creative Engine for server-side animation operations.

```typescript highlight=highlight-setup
const engine = await CreativeEngine.init({
  baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
  // license: process.env.CESDK_LICENSE
});
```

## Animation Fundamentals

Before applying animations to a block, we verify it supports them using `supportsAnimation()`. Once confirmed, we create an animation instance and attach it to the block.

```typescript highlight=highlight-supports-animation
// Check if block supports animations before applying
if (engine.block.supportsAnimation(block1)) {
  // Create an entrance animation
  const slideAnimation = engine.block.createAnimation('slide');
  engine.block.setInAnimation(block1, slideAnimation);
  engine.block.setDuration(slideAnimation, 1.0);
}
```

We use `createAnimation()` with an animation type like `'slide'`, `'fade'`, or `'zoom'`. The animation is then attached using `setInAnimation()` for entrance animations. Duration is set with `setDuration()` in seconds.

CE.SDK provides several animation types:

- **Entrance animations**: `slide`, `fade`, `blur`, `grow`, `zoom`, `pop`, `wipe`, `pan`, `baseline`, `spin`
- **Loop animations**: `spin_loop`, `fade_loop`, `blur_loop`, `pulsating_loop`, `breathing_loop`, `jump_loop`, `squeeze_loop`, `sway_loop`

## Entrance Animations

Entrance animations (In animations) define how a block appears on screen. We create the animation, attach it with `setInAnimation()`, and configure its properties.

```typescript highlight=highlight-entrance-animation
// Create a fade entrance animation with easing
const fadeInAnimation = engine.block.createAnimation('fade');
engine.block.setInAnimation(block2, fadeInAnimation);
engine.block.setDuration(fadeInAnimation, 1.0);
engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');
```

We use `setEnum()` to configure the easing function. Available easing options include `'Linear'`, `'EaseIn'`, `'EaseOut'`, and `'EaseInOut'`. The `'EaseOut'` easing starts fast and slows down toward the end, creating a natural deceleration effect.

## Exit Animations

Exit animations (Out animations) define how a block leaves the screen. We use `setOutAnimation()` to attach them.

```typescript highlight=highlight-exit-animation
    // Create both entrance and exit animations
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');
```

When using both entrance and exit animations, CE.SDK automatically manages their timing to prevent overlap. Changing the duration of an In animation may adjust the Out animation's duration to maintain valid timing.

## Loop Animations

Loop animations run continuously while the block is visible. We use `setLoopAnimation()` to attach them.

```typescript highlight=highlight-loop-animation
// Create a breathing loop animation
const breathingLoop = engine.block.createAnimation('breathing_loop');
engine.block.setLoopAnimation(block4, breathingLoop);
engine.block.setDuration(breathingLoop, 1.0);
```

The duration for loop animations defines the length of each cycle. A 1-second breathing loop will complete one full pulse every second.

## Animation Properties

Each animation type has specific configurable properties. We use `findAllProperties()` to discover available properties for an animation.

```typescript highlight=highlight-animation-properties
    // Create slide animation and configure direction
    const slideFromTop = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block5, slideFromTop);
    engine.block.setDuration(slideFromTop, 1.0);

    // Set slide direction (radians describe the motion direction the block
    // travels along; the block enters from the opposite side):
    //   0=slides right (enters from left), PI/2=slides down (enters from top),
    //   PI=slides left (enters from right), 3*PI/2=slides up (enters from bottom)
    engine.block.setFloat(
      slideFromTop,
      'animation/slide/direction',
      Math.PI / 2
    );
    engine.block.setEnum(slideFromTop, 'animationEasing', 'EaseInOut');

    // Discover all available properties for this animation
    const properties = engine.block.findAllProperties(slideFromTop);
    console.log('Slide animation properties:', properties);
```

For slide animations, the `animation/slide/direction` property is the angle in radians that the block travels along during entrance — the block starts off-screen on the opposite side and slides in:

- `0` — Slides right (enters from the left)
- `Math.PI / 2` — Slides down (enters from the top)
- `Math.PI` — Slides left (enters from the right)
- `3 * Math.PI / 2` — Slides up (enters from the bottom)

## Managing Animation Lifecycle

Animation objects must be properly managed to avoid memory leaks. When replacing an animation, we destroy the old one before setting the new one. We can retrieve current animations using `getInAnimation()`, `getOutAnimation()`, and `getLoopAnimation()`.

```typescript highlight=highlight-manage-animations
    // Set initial animations
    const initialIn = engine.block.createAnimation('pan');
    engine.block.setInAnimation(block6, initialIn);
    engine.block.setDuration(initialIn, 1.0);

    const spinLoop = engine.block.createAnimation('spin_loop');
    engine.block.setLoopAnimation(block6, spinLoop);
    engine.block.setDuration(spinLoop, 1.0);

    // Get current animations
    const currentIn = engine.block.getInAnimation(block6);
    const currentLoop = engine.block.getLoopAnimation(block6);
    const currentOut = engine.block.getOutAnimation(block6);

    console.log(
      'Animation IDs - In:',
      currentIn,
      'Loop:',
      currentLoop,
      'Out:',
      currentOut
    );

    // Replace in animation (destroy old one first to avoid memory leaks)
    if (currentIn !== 0) {
      engine.block.destroy(currentIn);
    }
    const newInAnimation = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block6, newInAnimation);
    engine.block.setDuration(newInAnimation, 1.0);
```

A return value of `0` indicates no animation is attached. Destroying a design block also destroys all its attached animations, but detached animations must be destroyed manually.

## Easing Functions

We can query available easing options using `getEnumValues()`.

```typescript highlight=highlight-easing-options
// Query available easing options
const easingOptions = engine.block.getEnumValues('animationEasing');
console.log('Available easing options:', easingOptions);
```

Easing functions control animation acceleration:

| Easing      | Description                                     |
| ----------- | ----------------------------------------------- |
| `Linear`    | Constant speed throughout                       |
| `EaseIn`    | Starts slow, accelerates toward the end         |
| `EaseOut`   | Starts fast, decelerates toward the end         |
| `EaseInOut` | Starts slow, speeds up, then slows down again   |

## Save and Cleanup

After applying animations, we save the scene to preserve all animation configurations. The scene file can be loaded later for further editing or rendering. Always dispose of the engine when done to release resources.

```typescript highlight=highlight-export
    // Save the scene with all animations to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const sceneString = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/base-animations.imgly`, sceneString);
    console.log('Saved scene to output/base-animations.imgly');
```

```typescript highlight=highlight-cleanup
engine.dispose();
```

## API Reference

| Method                       | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `createAnimation(type)`      | Create a new animation instance                    |
| `supportsAnimation(block)`   | Check if block supports animations                 |
| `setInAnimation(block, anim)`| Apply entrance animation to block                  |
| `setOutAnimation(block, anim)` | Apply exit animation to block                    |
| `setLoopAnimation(block, anim)` | Apply loop animation to block                   |
| `getInAnimation(block)`      | Get entrance animation (returns 0 if none)         |
| `getOutAnimation(block)`     | Get exit animation (returns 0 if none)             |
| `getLoopAnimation(block)`    | Get loop animation (returns 0 if none)             |
| `setDuration(anim, seconds)` | Set animation duration                             |
| `getDuration(anim)`          | Get animation duration                             |
| `setEnum(anim, prop, value)` | Set enum property (easing, etc.)                   |
| `setFloat(anim, prop, value)`| Set float property (direction, etc.)               |
| `findAllProperties(anim)`    | Get all available properties for animation         |
| `getEnumValues(prop)`        | Get available values for enum property             |
| `destroy(anim)`              | Destroy animation instance                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support