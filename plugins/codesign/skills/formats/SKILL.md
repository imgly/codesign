---
name: formats
description: >-
  Canvas-format reference for CoDesign designs — one file per screen/print format (ig-post,
  ig-square, ig-story, widescreen, linkedin-post, x-post, youtube-thumbnail, deck, poster, flyer,
  business-card):
  exact W×H, aspect, medium, platform safe zones, print bleed/dpi. Use when picking or setting up
  a canvas size, checking a platform safe zone, or preparing print dimensions. Re-composing an
  existing design into a format is the `resize` skill; new-design intake is the `create` skill.
---

# formats

The single source of truth for canvas formats. Each format has its own file — read the file(s)
for the format(s) you're targeting: `<id>.md`. The table below already answers
size, aspect, medium and safe zones / print for every format.

## Pick a format

| id                  | size                             | aspect  | medium | safe zones / print               | file                   |
| ------------------- | -------------------------------- | ------- | ------ | -------------------------------- | ---------------------- |
| `ig-post`           | 1080 × 1350 px                   | 4:5     | screen | none (no chrome)                 | `ig-post.md`           |
| `ig-square`         | 1080 × 1080 px                   | 1:1     | screen | none (no chrome)                 | `ig-square.md`         |
| `ig-story`          | 1080 × 1920 px                   | 9:16    | screen | **top ~250 px · bottom ~320 px** | `ig-story.md`          |
| `widescreen`        | 1920 × 1080 px                   | 16:9    | screen | none (no chrome)                 | `widescreen.md`        |
| `linkedin-post`     | 1200 × 627 px                    | ≈1.91:1 | screen | none; feed may crop edges        | `linkedin-post.md`     |
| `x-post`            | 1600 × 900 px                    | 16:9    | screen | none; timeline may crop edges    | `x-post.md`            |
| `youtube-thumbnail` | 1280 × 720 px                    | 16:9    | screen | bottom-right duration badge      | `youtube-thumbnail.md` |
| `deck`              | 1920 × 1080 px per slide         | 16:9    | screen | none                             | `deck.md`              |
| `poster`            | A2 420 × 594 mm / 1080 × 1920 px | —       | both   | print: +3 mm bleed · ≥300 dpi    | `poster.md`            |
| `flyer`             | A5 · A4 · DL                     | —       | print  | +3 mm bleed · ≥300 dpi           | `flyer.md`             |
| `business-card`     | EU 85 × 55 mm · US 3.5 × 2 in    | —       | print  | +3 mm bleed · ≥300 dpi           | `business-card.md`     |

**Custom sizes:** an explicit `W×H` (+ unit: px, mm, in) is always valid. Screen medium uses the
dimensions as-is; print medium adds **3 mm bleed** and targets **≥300 dpi**.

## Shared rules

- **Safe zones (screen):** platform chrome overlays the canvas edges on some placements — keep
  primary content inside the safe band. Per-format numbers live in each format's file;
  content-only formats (post, square, widescreen) have no chrome and use the full frame inside
  the margins.
- **Print basics:** every print format adds **3 mm bleed** on all sides; target **≥300 dpi**;
  keep text out of the bleed and inside the **~8% safe margin** (handbook §6.1.10, §6.4); fonts
  embedded/outlined.
- **Composition is relative to the canvas** — margins, spacing, and type bands all scale with the
  page (handbook §6.4, §6.1.2), so the design rules hold across every format here.
- **Export at native dimensions** — the page's own pixel (or bleed-inclusive print) size.

## Boundaries

- **Re-composing an existing design into another format** — the `resize` skill (workflow,
  re-composition routine, no-goes). This skill only supplies the target's numbers.
- **Choosing a format during new-design intake** — the `create` skill derives it from the brief;
  its class defaults mirror this skill's files.
