# tiktok — TikTok video

- **Size:** 1080 × 1920 px
- **Aspect:** 9:16 (tall)
- **Medium:** screen (video)

## Safe zones

Platform UI overlays the edges — keep primary content, captions and CTAs clear of:

- **Top 240 px** — Following / For You tabs, search.
- **Bottom 660 px** — caption, username, sound ticker.
- **Left and right 120 px** — cropped on some devices.
- **Right column, 300 px wide from 840 px down** — like / comment / share / profile.

These are the figures of TikTok's own in-feed template; a longer caption takes more of the
bottom, so treat them as minimums.

## Notes

- Same canvas as `ig-story` with about the same bottom band, wider sides and a right-hand column
  that starts higher (840 px): an ig-story layout that runs to its side margins is cropped here.
- Burned-in captions sit above the bottom band, left-aligned or centered within the width that
  clears the right column.
