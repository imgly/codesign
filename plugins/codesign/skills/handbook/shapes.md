# Handbook — shapes: compound cutouts, modifiers, stroke paint

A graphic's `shape` spec can combine shapes (`compound`), reshape its path
(`modifiers`), and its stroke can be painted with a gradient (`stroke.fill`).
All three stay vector in PDF and SVG exports.

## Compound shapes: cutouts from primitives

A `compound` combines its `subshapes` in order: the first is the base, each
later one combines with the result by `compound.mode`. Use it for notches,
punched holes, rings and cut corners built from rects, ellipses, stars and
polygons; draw any other mark as one `vector_path` (handbook §Custom shapes).

```js
// A print ticket, 160 × 60 mm in a Millimeter scene: a semicircle notch on each short edge.
await engine.design.create(
  {
    type: 'graphic',
    name: 'ticket',
    props: {
      width: 160,
      height: 60,
      fill: { type: 'color', color: { value: INK } },
      shape: {
        type: 'compound',
        compound: { mode: 'Subtract', width: 160, height: 60 },
        subshapes: [
          { type: 'rect', width: 160, height: 60, rect: { cornerRadiusTL: 3, cornerRadiusTR: 3, cornerRadiusBL: 3, cornerRadiusBR: 3 } },
          { type: 'ellipse', width: 12, height: 12, position: { x: -6, y: 24 } },
          { type: 'ellipse', width: 12, height: 12, position: { x: 154, y: 24 } }
        ]
      }
    }
  },
  { parent: page }
);
```

- **Coordinates.** Subshapes sit in the compound's box, `compound: { width,
  height }` (default 100 × 100), which is stretched onto the block's frame. Set
  the box to the block's size and every subshape number is in design units.
  A later block resize stretches the whole compound, like a `vector_path`.
- **Placement** of a subshape: `position` is its top-left corner, `width` and
  `height` its size, `rotation`, `skew` and `skewAxis` are in **degrees**
  (a block's own `rotation` is radians), `scale: { x, y }` is a factor, and
  `anchor: { x, y }` is the point of the subshape (in its own units) that sits
  at `position` and that rotation and scale turn around. Parts outside the
  box draw outside the block's frame; they are not clipped.
- **Modes:** `Add` unions; `Subtract` removes every later subshape from the
  base; `Intersect` keeps the overlap; `Exclude` keeps what only one covers.
  `Merge` only collects the outlines, and `compound.fillRule` decides overlaps
  (`NonZero` fills them, `EvenOdd` makes them holes).
- A `line` cannot be a subshape. Compounds nest (a subshape can be a
  compound), and every subshape takes its own `modifiers`.
- A block's own shape always fills its frame: placement keys (`position`,
  `width`, `rotation`, …) are refused outside `subshapes`.

## Modifiers: repeat, round, offset, zigzag, twist, trim

`modifiers` is a list on any shape spec, applied in order. Each modifier's
options sit under a key named after its type.

```js
await engine.design.setProps(dot, {
  shape: { modifiers: [{ type: 'repeater', repeater: { copies: 5, positionX: 40 } }] }
});
await engine.design.setProps(badge, {
  shape: { type: 'star', star: { points: 12 }, modifiers: [{ type: 'round_corners', round_corners: { radius: 6 } }] }
});
```

| type           | options and units                                                                 |
| -------------- | --------------------------------------------------------------------------------- |
| `trim`         | `start` and `end` as 0–1 of the path's length, plus a wrapping offset in the same unit; `mode` `Simultaneous` (each subpath) or `Individual` (one after another) |
| `repeater`     | `copies` (whole number); per copy: `positionX/Y` step (design units), `rotation` (degrees), `scaleX/Y` (factor), around `anchorX/Y` (design units); its offset shifts by whole copies; `startOpacity`/`endOpacity` 0–1; `composite` `Below`/`Above` |
| `round_corners`| `radius` (design units)                                                           |
| offset         | `amount` (design units, negative shrinks); `join` `Miter`/`Round`/`Bevel`; `miterLimit` |
| `zigzag`       | `size` (amplitude, design units); `ridges` per segment; `pointType` `Corner`/`Smooth` |
| `pucker_bloat` | `amount` −1 (pucker) … 1 (bloat)                                                  |
| `twist`        | `angle` (degrees) around `centerX/Y` (design units from the shape's top-left)     |

Design units are measured from the top-left of the block's frame. A shape spec
of the attached type without `modifiers` keeps them; a `modifiers` list
replaces the whole list; `[]` clears it; another shape type drops them.

**Draw-on line.** A `trim` with keyframes on `end` draws a stroke along its
path — a route on a map, an underline, a signature. Give the block a stroke and
no fill, and see `animation.md` for the keyframe times:

```js
await engine.design.setProps(route, {
  fill: { enabled: false },
  stroke: { enabled: true, width: 6, color: BRAND },
  shape: { modifiers: [{ type: 'trim', trim: { start: 0, end: 0 },
    keyframes: { end: [{ at: 0.3, value: 0 }, { at: 3, value: 1, easing: 'EaseInOut' }] } }] }
});
```

## Stroke paint: `stroke.fill`

`stroke: { fill }` paints the stroke with a `color`, `gradient/linear`,
`gradient/radial`, `gradient/conical` or `stripe` fill spec instead of
`stroke.color`; `fill: null` goes back to the colour. Graphic and page blocks
only (text strokes take `stroke.color`). A stroke colour with alpha 0 still
hides the stroke.

```js
await engine.design.setProps(frame, {
  stroke: { enabled: true, width: 8, fill: { type: 'gradient/linear', stops: [
    { color: BRAND_A, stop: 0 }, { color: BRAND_B, stop: 1 }] } }
});
```

## Print

Compound shapes and modified paths export as vector paths in PDF and SVG, and
a gradient stroke as a PDF shading or an SVG gradient: a cutout made this way
is a real cut in the artwork, with no raster mask. `print.md`.
