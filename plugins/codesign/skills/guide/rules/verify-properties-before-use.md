# Verify Properties Before Use

CE.SDK block types do **not** share a uniform property schema. Each block type — graphic, text, animation, fill, shape — has its own set of available properties. Never assume a property exists on a block; always verify first.

## Rule

Before getting or setting any property on a CE.SDK block, call `engine.block.findAllProperties()` and confirm the property exists. Accessing a non-existent property will throw an error.

```ts
const props = engine.block.findAllProperties(block);
if (props.includes('animationEasing')) {
  engine.block.setEnum(block, 'animationEasing', 'EaseInOut');
}
```

## Why This Matters

- `animationEasing` is **not** supported by `pop` or `typewriter_text` animations (and potentially others).
- `textAnimationWritingStyle` only exists on some text animations (e.g., `baseline`). The `typewriter_text` animation uses `animation/typewriter_text/writingStyle` instead.
- Fill blocks, shape blocks, and graphic blocks each expose different property sets.
- New CE.SDK versions may add or remove properties from specific block types.

## Pattern: Safe Property Access

```ts
function safeSetEnum(
  engine: CreativeEngine,
  block: number,
  prop: string,
  value: string
): boolean {
  const props = engine.block.findAllProperties(block);
  if (props.includes(prop)) {
    engine.block.setEnum(block, prop, value);
    return true;
  }
  return false;
}

function safeGetFloat(
  engine: CreativeEngine,
  block: number,
  prop: string
): number | undefined {
  const props = engine.block.findAllProperties(block);
  if (props.includes(prop)) {
    return engine.block.getFloat(block, prop);
  }
  return undefined;
}
```

## Pattern: Animation Configuration

When configuring animations, always check available properties per animation type:

```ts
const inAnim = engine.block.getInAnimation(block);
if (inAnim !== null) {
  const props = engine.block.findAllProperties(inAnim);

  if (props.includes('animationEasing')) {
    engine.block.setEnum(inAnim, 'animationEasing', opts.inEasing);
  }
  if (props.includes('animationDuration')) {
    engine.block.setFloat(inAnim, 'animationDuration', opts.duration);
  }
}
```

## Debugging: Discover Available Properties

Use `findAllProperties()` as the definitive source of truth for what properties a block supports — more reliable than documentation, which may not cover every block type's specifics:

```ts
const props = engine.block.findAllProperties(someBlock);
console.log('Available properties:', props);
```
