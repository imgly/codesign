# The demo brief

The canned brief behind the `generate` job's demo — build it through the normal
handbook Loop, exactly as if the user had asked for it.

**This build needs image generation, so it needs an account.** The hero visual is
generated with `asset_generate`, which requires a free IMG.LY sign-in. Do **not**
start building and discover this halfway: check for `asset_generate` in your tool
list **before** you begin, and if it isn't there, propose the free sign-in first (call
`login`, then continue once they're back). If they'd rather not sign in, don't build a
degraded version and don't leave an empty slot — load the finished design instead
(`import({ source: { demo: "cybernews" } })`), say plainly that the build step needs an
account for the image but the design itself doesn't, and carry on with the flow. Beat 4
then has nothing left to ask.

The same design ships finished as `import({ source: { demo: "cybernews" } })` — use that
for the import / resize / rebrand / localize / judge demos instead of rebuilding it.

---

## Secure Grid — cybersecurity growth report, Instagram post

A data-editorial social post in a modern brutalist register: one massive statistic
anchoring a dark, grainy canvas, with floating translucent cubes overlapping the
headline for depth.

**Format** — 1080 × 1350 px, single page. Instagram portrait (this is a **4:5** ratio —
not 4:3, whatever the source brief called it). Strict **80 px** safe-zone margin on all
sides.

**Palette** — Deep Charcoal `#121212` (background) · Acid Lime `#D1FF00` (the single
accent) · Optical White `#FFFFFF` (ink). Acid Lime is the **only** vibrant colour on
the canvas and appears on exactly two things: the `24%` metric and the `$140 Billion`
amount. Anything else in lime breaks the anchor.

**Typography** — Inter only, weights 400/500/700/800. All sizes are absolute pixels.
No emoji anywhere; use Unicode glyphs (`›`, `█`) where a symbol is wanted.

**Layout, back to front**

1. **Background** — solid `#121212` with heavy digital noise / analog film grain. Matte,
   non-reflective. The grain is the surface, not a texture image pasted on top.
2. **Hero visual** — three to four abstract 3D translucent glass cubes with glowing
   neon-green internal cores, at varied angles, floating asymmetrically from the
   top-left toward the centre-right. Glassmorphism: real refraction, soft glowing
   edges. The cubes fill the frame and **partially overlap the headline** — that
   overlap is what creates depth, so don't tuck them into a corner and don't crop them.
   Generate this with `asset_generate` (see the account note above).
3. **Top-left brand** — `█ GRID`, 32 px.
4. **Top-right brand** — `CYBERARCHIVE®`, 28 px, white.
5. **Context label (mid-left)** — a pill-shaped **outline** chip reading `FinTech Sector ›`.
   Build it as a text block with a native text background (§6.5.1) — never a rectangle
   behind floating text.
6. **Headline** — `Cloud Vulnerability / Projected to Drop by`, 80 px, bold, white.
7. **Billboard metric** — `24%` at **240 px**, bold, Acid Lime. This is the visual
   anchor; everything else defers to it.
8. **Financial sub-text** — `Saving Companies Over $140 Billion Annually` at 38 px, with
   `$140 Billion` in Acid Lime inside a Unicode oval outline.
9. **Bottom-left metadata** — `INNOVATIVE / SECURITY LABS`, 22 px, stacked on two lines.
10. **Bottom-right date** — `© 2026`, 22 px.

**Deliverables** — a `preview` of the page at 1080 × 1350, and, if the user wants a
file, an export. Run the `judge` gate before calling it done, as with any design.
