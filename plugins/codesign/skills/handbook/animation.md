# Handbook — animation: entrance, exit and loop animations

Any block in a design with a timeline (`video.md`) can move.

Every block takes up to three animations: `in` (entrance, from the block's
start), `out` (exit, ending at its end) and `loop` (the whole time it is
visible). They combine; the engine keeps `in` and `out` from overlapping.

```js
await engine.design.setProps(headline, {
  animations: {
    in: { type: 'slide', duration: 0.6, easing: 'EaseOutQuint', slide: { direction: Math.PI, fade: true } },
    out: { type: 'fade', duration: 0.4, easing: 'EaseIn' },
    loop: { type: 'sway_loop', duration: 1.5, sway_loop: { intensity: 0.3 } }
  }
});
await engine.design.setProps(headline, { animations: { loop: null } }); // remove one
```

Options sit under a key named after the type. `duration` is seconds (a loop's
cycle length); `easing` is one of `Linear`, `EaseIn`/`Out`/`InOut`, and the
`Quart`, `Quint`, `Back`, `Spring` variants (`EaseOutBack`, …).

| use          | type               | options (`<type>: { … }`)                                                    |
| ------------ | ------------------ | ---------------------------------------------------------------------------- |
| in / out     | `fade` `pop`       | —                                                                            |
| in / out     | `slide`            | `direction` (radians: 0 right, π/2 down, π left, 3π/2 up), `fade`            |
| in / out     | `pan`              | `direction` (radians), `distance`, `fade`                                    |
| in / out     | `zoom`             | `fade`                                                                       |
| in / out     | `crop_zoom`        | `scale`, `fade`                                                              |
| in / out     | `blur`             | `intensity`, `fade`                                                          |
| in / out     | `grow`             | `direction` (`Horizontal` `Vertical` `All` `TopLeft` … `BottomRight`), `scaleFactor` |
| in / out     | `wipe` `baseline`  | `direction` (`Up` `Right` `Down` `Left`)                                     |
| in / out     | `spin`             | `direction` (`Clockwise` `CounterClockwise`), `intensity`, `fade`            |
| in / out     | `ken_burns`        | `direction`, `zoomIntensity`, `travelDistanceRatio`, `fade` — images/video; sets the fill to Cover |
| text in/out  | `typewriter_text`  | `writingStyle` (`Character` `Word`)                                          |
| text in/out  | `block_swipe_text` | `direction`, `blockColor`, `useTextColor`                                    |
| text in/out  | `spread_text`      | `intensity`, `fade`                                                          |
| text in/out  | `merge_text`       | `direction` (`Left` `Right`), `intensity`                                    |
| loop         | `fade_loop` `squeeze_loop` `scale_loop` | —                                                       |
| loop         | `breathing_loop` `pulsating_loop` `blur_loop` `sway_loop` | `intensity`                           |
| loop         | `spin_loop`        | `direction` (`Clockwise` `CounterClockwise`)                                 |
| loop         | `jump_loop`        | `direction`, `intensity`                                                     |

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
