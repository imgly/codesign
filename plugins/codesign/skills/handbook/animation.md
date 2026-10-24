# Handbook — animation: entrance, exit and loop animations

Any block in a design with a timeline (`video.md`) can move.

Every block takes up to three animations: `in` (entrance, from the block's
start), `out` (exit, ending at its end) and `loop` (the whole time it is
visible). They combine; the engine keeps `in` and `out` from overlapping.

```js
await engine.design.setProps(headline, {
  animations: {
    in: {
      type: 'slide',
      duration: 0.6,
      easing: 'EaseOutQuint',
      slide: { direction: Math.PI, fade: true }
    },
    out: { type: 'fade', duration: 0.4, easing: 'EaseIn' },
    loop: { type: 'sway_loop', duration: 1.5, sway_loop: { intensity: 0.3 } }
  }
});
await engine.design.setProps(headline, { animations: { loop: null } }); // remove one
```

Options sit under a key named after the type. `duration` is seconds (a loop's
cycle length); `easing` is one of `Linear`, `EaseIn`/`Out`/`InOut`, and the
`Quart`, `Quint`, `Back`, `Spring` variants (`EaseOutBack`, …).

| use         | type                                                      | options (`<type>: { … }`)                                                                          |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| in / out    | `fade` `pop`                                              | —                                                                                                  |
| in / out    | `slide`                                                   | `direction` (radians: 0 right, π/2 down, π left, 3π/2 up), `fade`                                  |
| in / out    | `pan`                                                     | `direction` (radians), `distance`, `fade`                                                          |
| in / out    | `zoom`                                                    | `fade`                                                                                             |
| in / out    | `crop_zoom`                                               | `scale`, `fade`                                                                                    |
| in / out    | `blur`                                                    | `intensity`, `fade`                                                                                |
| in / out    | `grow`                                                    | `direction` (`Horizontal` `Vertical` `All` `TopLeft` … `BottomRight`), `scaleFactor`               |
| in / out    | `wipe` `baseline`                                         | `direction` (`Up` `Right` `Down` `Left`)                                                           |
| in / out    | `spin`                                                    | `direction` (`Clockwise` `CounterClockwise`), `intensity`, `fade`                                  |
| in / out    | `ken_burns`                                               | `direction`, `zoomIntensity`, `travelDistanceRatio`, `fade` — images/video; sets the fill to Cover |
| text in/out | `typewriter_text`                                         | `writingStyle` (`Character` `Word`)                                                                |
| text in/out | `block_swipe_text`                                        | `direction`, `blockColor`, `useTextColor`                                                          |
| text in/out | `spread_text`                                             | `intensity`, `fade`                                                                                |
| text in/out | `merge_text`                                              | `direction` (`Left` `Right`), `intensity`                                                          |
| loop        | `fade_loop` `squeeze_loop` `scale_loop`                   | —                                                                                                  |
| loop        | `breathing_loop` `pulsating_loop` `blur_loop` `sway_loop` | `intensity`                                                                                        |
| loop        | `spin_loop`                                               | `direction` (`Clockwise` `CounterClockwise`)                                                       |
| loop        | `jump_loop`                                               | `direction`, `intensity`                                                                           |

- **Text animates per unit.** On a text block any in/out animation takes
  `writingStyle` (`'Line'` `'Word'` `'Character'` `'Block'`) and `overlap`
  (0–1, how much consecutive units overlap) at the top level of the spec:
  `in: { type: 'fade', duration: 1.2, writingStyle: 'Word', overlap: 0.3 }`
  is a word-by-word reveal over 1.2 s.
- **Loops take no easing.** An animation is clipped to its block's window: a
  1 s `in` on a 0.6 s clip never finishes.
- **Verify with `preview` at `time`** inside the animation (start + half its
  duration); a still that shows the block at rest there means it is not
  attached or not where you think.

## Keyframes: custom motion

Presets cover entrances, exits and loops. For any other move (a logo gliding
along an arc, a colour sweep, a wipe that reveals a photo) key the leaves
yourself. Keys sit on the block, or inside the spec of the attachment that
owns the leaf:

```js
await engine.design.setProps(logo, {
  playback: { duration: 6 }, // FIRST: keys run over the block's own duration
  transform: { anchor: { x: 60, y: 60 } }, // pivot, design units from the frame's top-left
  keyframes: {
    position: [
      {
        at: 0,
        value: { x: '-200px', y: '400px' },
        easing: 'EaseOutQuint',
        spatialOut: { x: 150, y: -250 }
      }, // motion-path curve, relative to the key
      { at: 1.2, value: { x: '120px', y: '380px' } }
    ],
    rotation: [
      {
        at: 0,
        value: -0.3,
        easing: {
          type: 'Bezier',
          out: { x: 0.2, y: 0.8 },
          in: { x: 0.2, y: 1 }
        }
      },
      { at: 1.2, value: 0 }
    ],
    opacity: [
      { at: 0, value: 0 },
      { at: '15%', value: 1 }
    ]
  }
});
await engine.design.setProps(card, {
  fill: {
    type: 'color',
    keyframes: {
      'color.value': [
        { at: 0, value: BRAND_A },
        { at: 3, value: BRAND_B, easing: 'Hold' }
      ]
    }
  }
});
await engine.design.setProps(photo, {
  effects: [
    {
      type: 'linear_wipe',
      keyframes: {
        'linear_wipe.completion': [
          { at: 0, value: 1 },
          { at: 1, value: 0, easing: 'EaseInOut' }
        ]
      }
    }
  ]
});
```

- **`at` is seconds from the block's start** (`1.2`, `'1.2s'`) or a share of
  its duration (`'25%'`). A new block lasts 5 s whatever its page does, so a
  key at 8 s is refused until you set `playback.duration` on the block;
  setting it in the same write is enough. A later duration change stretches
  the keys with it. An attachment's keys run over its block's duration.
- **Keys** name the leaf as the props do: `opacity`, `rotation`,
  `position` (`{ x, y }`, or `position.x` alone), `width`, `transform.scale.x`,
  `stroke.color`, `dropShadow.offset.y`, `blend.mode` (an enum, held until
  the next key), `text.string` (swaps the text). In a spec, drop the slot:
  `color.value` in a fill, `rect.cornerRadiusTL` in a shape,
  `linear_wipe.completion` in an effect, `stops` in a gradient fill
  (`[{ color, stop }]`, the same count of stops on every key). List entries
  carry their own: `masks[i]` (`feather`, `expansion`), `shape.modifiers[i]`
  (`trim.end`), `shape.subshapes[i]` (`width`, `rotation`) and
  `text.animators[i]` (`selectorOffset`). A leaf that
  cannot be keyed is refused, naming those that can. Audio cannot be keyed.
- **Values** take what the static leaf takes; lengths take `'px'`/`'mm'`/`'pt'`
  but never `'%'`, also when the position mode is Percent.
- **`easing`** is the curve to the NEXT key: a preset (`'EaseOutBack'`, …),
  `'Hold'` (jump at the next key), or `{ type: 'Bezier', out, in }` as in CSS
  `cubic-bezier(out.x, out.y, in.x, in.y)`. Default `'Linear'`.
- **`{ mode: 'Relative', keys }`** adds the keys to the static value (numbers
  and `{ x, y }` only): a wobble that follows wherever the block is placed.
- **A static write does not override a track.** `opacity: 1` on a block with
  an opacity track changes nothing you can see: remove the track
  (`keyframes: { opacity: null }`; `keyframes: null` removes all).
- **A rotation track turns around the frame centre** until the block has a
  `transform.anchor`; with one (even `{ x: 0, y: 0 }`) it turns around the
  anchor. Static `rotation` always turns about the centre. `transform.scale`
  pivots on the anchor too.
- **Replacing an attachment drops its keys**: a fill spec of the same `type`
  keeps them, another type starts empty. `effects` is replaced whole, so
  give every effect its `keyframes` again (`getProps` returns them in each
  spec, ready to write back).
- **Presets and keys add up.** A fade-in multiplies a keyed opacity, a slide
  starts from the keyed position, a loop moves around it. Keep the preset for
  the entrance and key the move, or key both ends yourself.
- **Motion blur** for fast keyed moves: `motionBlur: { enabled: true }` on
  the block; quality (`samples` 1–64, `shutterAngle` 0–720) is on the scene.
- **`transformParent: '<uuid or name>'`** makes a graphic or text follow
  another's position, rotation and scale (its keys included); `null` unlinks.
- Verify with `preview` at `time` on each key and between keys.
- **Reveals through a shape** are not animation presets: a `linear_wipe`,
  `radial_wipe` or `venetian_blinds` effect (`completion` is the share wiped
  away: 0 shows all, 1 hides all, default 0.5), a soft `masks` entry, or a
  `matte` whose source block moves (`matte: { source: 'reveal-bar' }` — the
  source stops drawing on its own). Their props are in the `api` skill.
- **Draw a line on** (a route, an underline, a signature): a stroke-only
  shape with a `trim` modifier whose `end` is keyframed from 0 to 1
  (`shapes.md`).
## Per-glyph motion: text animators

Presets move whole units (lines, words, characters) through a fixed motion.
`text.animators` (on a caption: `caption.animators`, track-wide) is the
After-Effects-style tool under them: a **range selector** over the glyphs and
what it does to the selected ones — offset, scale, rotation, skew, opacity,
fill and stroke colour, stroke width, tracking, blur.

```js
await engine.design.setProps(title, { text: { animators: [{
  selectorBasedOn: 'Words',           // Characters · CharactersExcludingSpaces · Words · Lines
  positionY: '40px', opacity: 0,      // what the selected words get
  keyframes: { selectorOffset: [{ at: 0, value: 0 }, { at: 1.2, value: 1, easing: 'EaseOutQuart' }] }
}] } });                              // words rise in left to right as the selection slides off them
```

- **Which one.** A plain reveal or exit (fade, slide, typewriter per word,
  with `overlap`) is a preset — shorter, and the `animate` skill schedules it.
  Reach for an animator only for what presets cannot do: a wave through the
  letters, a colour or highlight sweep, per-letter tracking or blur, a random
  order (`selectorRandomize`, `selectorSeed`), a karaoke word highlight. Both
  compose on one block: an `in` preset plays on top of the animators.
- **A static animator only styles; keyframes make it move.** Without keyframes
  the selected glyphs simply sit offset or recoloured. The usual motion is a
  `selectorOffset` track: the selection (start 0, end 1) covers everything at
  offset 0 and nothing at 1 or −1. `selectorShape` (`Square` `RampUp`
  `RampDown` `Triangle` `Round` `Smooth`) fades the effect across the range
  edge, so `RampUp` turns the sweep into a stagger and `Triangle` into a wave.
  Any other leaf can have a track too; times are seconds of the text block.
- **Units.** `selectorStart`/`End`/`Offset` are 0–1 of the text with
  `selectorUnits: 'Percentage'` (default); with `'Index'` they count
  characters, words or lines, end exclusive. Positions, `anchorX/Y`,
  `tracking` (extra advance per glyph), `blurX/Y` and `strokeWidth` are design
  units and take `'12px'`-style strings; `positionY` grows downwards.
  `rotation` is radians, `skew`/`skewAxis` degrees, `selectorAmount` −1–1
  (negative inverts every effect). Scale and rotation pivot on the glyph's
  baseline centre, moved by `anchorX/Y`.
- **Flags.** `opacity`, `fillColor` and `strokeColor` only apply with their
  `opacityEnabled`/`fillColorEnabled`/`strokeColorEnabled` flag; writing the
  value sets it. A stroke also needs the text block's own
  `stroke: { enabled: true }` — `width: 0` there strokes only the selected
  glyphs.
- `animators: [...]` replaces the whole list in order; `[]` removes them.
  Verify with `preview` at a `time` inside each track, like a preset.
