> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Create Animations](./animation/create.md) > [Text Animations](./animation/create/text.md)

---

Create engaging text animations that reveal content line by line, word by word, or character by character with granular control over timing and overlap.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-animation-create-text-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-animation-create-text-server-js)

Text animations in CE.SDK allow you to animate text blocks with granular control over how the text appears. Unlike standard block animations, text animations support writing styles that determine whether animation applies to the entire text, line by line, word by word, or character by character.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-animation-create-text-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFile, mkdir } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Text Animations
 *
 * Demonstrates text-specific animation features in CE.SDK:
 * - Creating and applying animations to text blocks
 * - Text animation writing styles (line, word, character)
 * - Segment overlap configuration
 * - Combining with easing and duration properties
 */

async function main() {
  // Initialize CE.SDK engine in headless mode
  const engine = await CreativeEngine.init({
    baseURL: process.env.IMGLY_LOCAL_ASSETS_URL
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // Set page duration to accommodate all animations
    engine.block.setDuration(page, 10);

    // Create a text block with a baseline animation
    const text1 = engine.block.create('text');
    engine.block.setWidth(text1, 600);
    engine.block.setHeight(text1, 200);
    engine.block.appendChild(page, text1);
    engine.block.setPositionX(text1, 100);
    engine.block.setPositionY(text1, 100);
    engine.block.replaceText(text1, 'Creating\nText\nAnimations');
    engine.block.setFloat(text1, 'text/fontSize', 48);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text1, 'text/verticalAlignment', 'Center');

    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);

    console.log('Created baseline animation attached to text block');

    // Writing Style: Line-by-line animation
    const text2 = engine.block.create('text');
    engine.block.setWidth(text2, 600);
    engine.block.setHeight(text2, 200);
    engine.block.appendChild(page, text2);
    engine.block.setPositionX(text2, 700);
    engine.block.setPositionY(text2, 100);
    engine.block.replaceText(text2, 'Line by line\nanimation\nfor text');
    engine.block.setFloat(text2, 'text/fontSize', 42);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text2, 'text/verticalAlignment', 'Center');

    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');

    console.log('Created line-by-line animation');

    // Writing Style: Word-by-word animation
    const text3 = engine.block.create('text');
    engine.block.setWidth(text3, 600);
    engine.block.setHeight(text3, 200);
    engine.block.appendChild(page, text3);
    engine.block.setPositionX(text3, 1300);
    engine.block.setPositionY(text3, 100);
    engine.block.replaceText(text3, 'Animate word by word for emphasis');
    engine.block.setFloat(text3, 'text/fontSize', 42);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text3, 'text/verticalAlignment', 'Center');

    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');

    console.log('Created word-by-word animation');

    // Writing Style: Character-by-character animation
    const text4 = engine.block.create('text');
    engine.block.setWidth(text4, 600);
    engine.block.setHeight(text4, 200);
    engine.block.appendChild(page, text4);
    engine.block.setPositionX(text4, 100);
    engine.block.setPositionY(text4, 400);
    engine.block.replaceText(
      text4,
      'Character by character for typewriter effect'
    );
    engine.block.setFloat(text4, 'text/fontSize', 38);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text4, 'text/verticalAlignment', 'Center');

    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');

    console.log('Created character-by-character animation');

    // Segment Overlap: Sequential animation (overlap = 0)
    const text5 = engine.block.create('text');
    engine.block.setWidth(text5, 600);
    engine.block.setHeight(text5, 200);
    engine.block.appendChild(page, text5);
    engine.block.setPositionX(text5, 700);
    engine.block.setPositionY(text5, 400);
    engine.block.replaceText(text5, 'Sequential animation with zero overlap');
    engine.block.setFloat(text5, 'text/fontSize', 40);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text5, 'text/verticalAlignment', 'Center');

    const animation5 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text5, animation5);
    engine.block.setDuration(animation5, 2.0);
    engine.block.setEnum(animation5, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0 for sequential animation
    engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
    engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');

    console.log('Created sequential animation (overlap = 0)');

    // Segment Overlap: Cascading animation (overlap = 0.4)
    const text6 = engine.block.create('text');
    engine.block.setWidth(text6, 600);
    engine.block.setHeight(text6, 200);
    engine.block.appendChild(page, text6);
    engine.block.setPositionX(text6, 1300);
    engine.block.setPositionY(text6, 400);
    engine.block.replaceText(text6, 'Cascading animation with partial overlap');
    engine.block.setFloat(text6, 'text/fontSize', 40);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text6, 'text/verticalAlignment', 'Center');

    const animation6 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text6, animation6);
    engine.block.setDuration(animation6, 1.5);
    engine.block.setEnum(animation6, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0.4 for cascading effect
    engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
    engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');

    console.log('Created cascading animation (overlap = 0.4)');

    // Query available writing style and easing options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    console.log('Available writing style options:', writingStyleOptions);

    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Ensure output directory exists
    await mkdir('output', { recursive: true });

    // Export first frame as PNG to verify the scene setup
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile('output/text-animations.png', buffer);

    console.log('');
    console.log('Text Animations guide complete.');
    console.log('Scene created with:');
    console.log('  - 6 text blocks with different animation configurations');
    console.log('  - Writing styles: default, Line, Word, Character');
    console.log('  - Overlap values: 0.0 (sequential), 0.4 (cascading)');
    console.log('  - Exported preview: output/text-animations.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers text-specific animation properties like writing styles and segment overlap, enabling dynamic and engaging text presentations in your designs.

## Text Animation Fundamentals

We create animations by first creating an animation instance, then attaching it to a text block. The animation block defines how the text will animate, while the text block contains the content and styling.

```typescript highlight-create-animation
    // Create a text block with a baseline animation
    const text1 = engine.block.create('text');
    engine.block.setWidth(text1, 600);
    engine.block.setHeight(text1, 200);
    engine.block.appendChild(page, text1);
    engine.block.setPositionX(text1, 100);
    engine.block.setPositionY(text1, 100);
    engine.block.replaceText(text1, 'Creating\nText\nAnimations');
    engine.block.setFloat(text1, 'text/fontSize', 48);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text1, 'text/verticalAlignment', 'Center');

    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);

    console.log('Created baseline animation attached to text block');
```

Animations are created separately using `engine.block.createAnimation()` with an animation type like 'baseline', 'fade', or 'pan'. We then attach the animation to the text block's entrance using `engine.block.setInAnimation()`. The animation duration is set with `engine.block.setDuration()`.

## Writing Style Control

Text animations support different granularity levels through the `textAnimationWritingStyle` property. This controls whether the animation applies to the entire text at once, or breaks it into segments (lines, words, or characters). We can query available options using `engine.block.getEnumValues('textAnimationWritingStyle')`.

### Line-by-Line Animation

The `Line` writing style animates text one line at a time from top to bottom. Each line appears sequentially, creating a structured reveal effect.

```typescript highlight-writing-style-line
    // Writing Style: Line-by-line animation
    const text2 = engine.block.create('text');
    engine.block.setWidth(text2, 600);
    engine.block.setHeight(text2, 200);
    engine.block.appendChild(page, text2);
    engine.block.setPositionX(text2, 700);
    engine.block.setPositionY(text2, 100);
    engine.block.replaceText(text2, 'Line by line\nanimation\nfor text');
    engine.block.setFloat(text2, 'text/fontSize', 42);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text2, 'text/verticalAlignment', 'Center');

    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');

    console.log('Created line-by-line animation');
```

We use `engine.block.setEnum()` to set the writing style to `'Line'`. This is ideal for revealing multi-line text in a clear, organized manner.

### Word-by-Word Animation

The `Word` writing style animates text one word at a time in reading order. This creates emphasis and draws attention to individual words.

```typescript highlight-writing-style-word
    // Writing Style: Word-by-word animation
    const text3 = engine.block.create('text');
    engine.block.setWidth(text3, 600);
    engine.block.setHeight(text3, 200);
    engine.block.appendChild(page, text3);
    engine.block.setPositionX(text3, 1300);
    engine.block.setPositionY(text3, 100);
    engine.block.replaceText(text3, 'Animate word by word for emphasis');
    engine.block.setFloat(text3, 'text/fontSize', 42);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text3, 'text/verticalAlignment', 'Center');

    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');

    console.log('Created word-by-word animation');
```

Setting the writing style to `'Word'` is perfect for creating dynamic, engaging text reveals that emphasize key phrases.

### Character-by-Character Animation

The `Character` writing style animates text one character at a time, creating a classic typewriter effect. This is the most granular animation option.

```typescript highlight-writing-style-character
    // Writing Style: Character-by-character animation
    const text4 = engine.block.create('text');
    engine.block.setWidth(text4, 600);
    engine.block.setHeight(text4, 200);
    engine.block.appendChild(page, text4);
    engine.block.setPositionX(text4, 100);
    engine.block.setPositionY(text4, 400);
    engine.block.replaceText(
      text4,
      'Character by character for typewriter effect'
    );
    engine.block.setFloat(text4, 'text/fontSize', 38);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text4, 'text/verticalAlignment', 'Center');

    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');

    console.log('Created character-by-character animation');
```

The `'Character'` writing style is ideal for typewriter effects and when you want maximum control over the animation timing.

## Segment Overlap Configuration

The `textAnimationOverlap` property controls timing between animation segments. A value of 0 means segments animate sequentially, while values between 0 and 1 create cascading effects where segments overlap partially. We use `engine.block.setFloat()` to set the overlap value.

### Sequential Animation (Overlap = 0)

When overlap is set to 0, each segment completes before the next begins, creating a clear, structured reveal effect.

```typescript highlight-overlap-sequential
    // Segment Overlap: Sequential animation (overlap = 0)
    const text5 = engine.block.create('text');
    engine.block.setWidth(text5, 600);
    engine.block.setHeight(text5, 200);
    engine.block.appendChild(page, text5);
    engine.block.setPositionX(text5, 700);
    engine.block.setPositionY(text5, 400);
    engine.block.replaceText(text5, 'Sequential animation with zero overlap');
    engine.block.setFloat(text5, 'text/fontSize', 40);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text5, 'text/verticalAlignment', 'Center');

    const animation5 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text5, animation5);
    engine.block.setDuration(animation5, 2.0);
    engine.block.setEnum(animation5, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0 for sequential animation
    engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
    engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');

    console.log('Created sequential animation (overlap = 0)');
```

Sequential animation ensures each text segment fully appears before the next one starts, making it perfect for emphasis and readability.

### Cascading Animation (Overlap = 0.4)

When overlap is set to a value between 0 and 1, segments animate in a cascading pattern, creating a smooth, flowing effect as they blend together.

```typescript highlight-overlap-cascading
    // Segment Overlap: Cascading animation (overlap = 0.4)
    const text6 = engine.block.create('text');
    engine.block.setWidth(text6, 600);
    engine.block.setHeight(text6, 200);
    engine.block.appendChild(page, text6);
    engine.block.setPositionX(text6, 1300);
    engine.block.setPositionY(text6, 400);
    engine.block.replaceText(text6, 'Cascading animation with partial overlap');
    engine.block.setFloat(text6, 'text/fontSize', 40);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text6, 'text/verticalAlignment', 'Center');

    const animation6 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text6, animation6);
    engine.block.setDuration(animation6, 1.5);
    engine.block.setEnum(animation6, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0.4 for cascading effect
    engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
    engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');

    console.log('Created cascading animation (overlap = 0.4)');
```

Cascading animation with partial overlap creates dynamic, fluid text reveals that feel natural and engaging.

## Combining with Animation Properties

Text animations can be enhanced with standard animation properties like duration and easing. Duration controls the overall timing of the animation, while easing controls the acceleration curve.

```typescript highlight-duration-easing
    // Query available writing style and easing options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    console.log('Available writing style options:', writingStyleOptions);

    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);
```

We use `engine.block.setEnum()` to set the easing function ('EaseIn', 'EaseOut', 'EaseInOut', 'Linear'). We can query available easing options using `engine.block.getEnumValues('animationEasing')`. Combining writing style, overlap, duration, and easing gives us complete control over how text animates.

## API Reference

| Method                                            | Description                                        |
| ------------------------------------------------- | -------------------------------------------------- |
| `createAnimation(type)`                           | Create a new animation instance                    |
| `setInAnimation(block, animation)`                | Apply animation to block entrance                  |
| `setLoopAnimation(block, animation)`              | Apply looping animation to block                   |
| `setOutAnimation(block, animation)`               | Apply animation to block exit                      |
| `getInAnimation(block)`                           | Get the entrance animation of a block              |
| `getLoopAnimation(block)`                         | Get the looping animation of a block               |
| `getOutAnimation(block)`                          | Get the exit animation of a block                  |
| `setDuration(animation, seconds)`                 | Set animation duration in seconds                  |
| `getDuration(animation)`                          | Get animation duration                             |
| `setEnum(animation, property, value)`             | Set enum property (writing style, easing)          |
| `getEnum(animation, property)`                    | Get enum property value                            |
| `setFloat(animation, property, value)`            | Set float property (overlap value)                 |
| `getFloat(animation, property)`                   | Get float property value                           |
| `getEnumValues(property)`                         | Get available enum options for a property          |
| `supportsAnimation(block)`                        | Check if block supports animations                 |
| `replaceText(block, text)`                        | Set text content of a text block                   |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support