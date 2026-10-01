# Multi-page designs

`apply.js` builds all of this; this page is for reading a result and for edits the scheduler does
not cover.

The chosen pages are combined onto one video page (the first chosen page) in a new revision; pages
left out of a pick are dropped from it. The multi-page still stays as the parent revision.

- **Order and length:** from intake. Each scene gets
  `max(entrance window + readability hold, total ÷ pages)`, and the echo reports the total.
- **Shared blocks:** blocks that are identical on every page (same type, same text or fill,
  bounding box within 1 px) are kept once. That copy spans `[0, L]`, gets one entrance in scene 1,
  and is **moved to the top of the z-order**. The duplicates are destroyed.
- **Background track:** each scene's bottom-most full-bleed layer becomes a leaf clip on
  `bg-track` (at z-index 0, auto-arrange off). Clip `i` has `timeOffset = startᵢ` and
  `duration = LEN + T`, except the last clip, which has `LEN`.
- **Overlay track:** any other full-bleed layer (a gradient or scrim) goes on `overlay-track`,
  directly above the background track, with the same timings and transitions. It must not be in the
  content group: there, the incoming scene's overlay darkens the outgoing text during the cut. An
  overlay whose neighbouring scene has none exits (or enters) with the transition's own motion
  instead of cutting.
- **Transitions:** the style's type on both tracks, set in a second pass after all clips exist.
- **Content group per scene:** the remaining children go into `s<n>/content`.
  - Scene 1 runs `[0, LEN + T]`; each later scene `n` runs `[startₙ + T, startₙ + LEN (+T)]`, so
    incoming content builds after the transition.
  - Child offsets are **relative** to the group.
  - Every scene except the last gets an out-animation matching the transition, using the
    transition's own easing (`push` Left → `slide` direction `π`, EaseInOutQuint; `cross-fade` →
    `fade`).
- **Size:** if pages differ in size, ask once, defaulting to the first page's size. No silent
  reflow.

## Block names

`bg-track`, `overlay-track`, and per scene `s<n>/content`. Existing backgrounds and overlays keep
their own names; find them by their `codesign/motion-beat` tag. Only a background `apply.js` has to
create (a page fill) is named `s<n>/bg`.
