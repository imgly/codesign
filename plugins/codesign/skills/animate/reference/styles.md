# Styles

The numbers live in `schedule.mjs` (`STYLES`); this page explains them. Change both together.

| Style     | Entrances                         | Easing                      | Stagger | Entrance duration | Text                     | Loop                     | Transitions                   |
| --------- | --------------------------------- | --------------------------- | ------- | ----------------- | ------------------------ | ------------------------ | ----------------------------- |
| calm      | `fade`, soft `slide`, `blur`      | EaseOutQuint / EaseOut      | 0.25 s  | 0.8–1.2 s         | `fade`, Line             | `breathing_loop`         | `cross-fade`, `cross-blur`    |
| energetic | `pop`, `zoom`, `slide`, `wipe`    | EaseOutBack / EaseOutQuint  | 0.12 s  | 0.3–0.5 s         | `block_swipe_text`, Line | `pulsating_loop`         | `push`, `slide`, `cross-zoom` |
| playful   | `pop`, `spin`, `grow`, `baseline` | EaseOutBack / EaseOutSpring | 0.15 s  | 0.4–0.7 s         | `baseline`, Character    | `jump_loop`, `sway_loop` | `stack`, `splice`             |
| cinematic | `blur`, slow `grow`, `crop_zoom`  | EaseInOutQuart              | 0.4 s   | 1.0–1.6 s         | `spread_text`, Word      | none                     | `fade-to-black`, `cross-warp` |

An easing applies only to types that accept one: `pop`, `typewriter_text`, `block_swipe_text` and
every `*_loop` except `scale_loop` take none. The scheduler drops it for those.

## Per-role rules

They override the style.

- Backgrounds and full-bleed images: `crop_zoom { scale: 1.1–1.15, fade: false }` over 1.2–3 s,
  EaseOutQuint. `zoom` is too strong (no intensity setting), and a whole-length drift would break
  the settle rule.
- Logo: a simple `fade` or `pop`, never character-by-character.
- Body text under ~24 px: `fade` only.
- `slide` enters from the element's nearest canvas edge, using the angle map below.

## Slide angles

`slide.direction` is the direction of travel in radians:

| enters from | direction |
| ----------- | --------- |
| left        | `0`       |
| top         | `π/2`     |
| right       | `π`       |
| bottom      | `3π/2`    |
