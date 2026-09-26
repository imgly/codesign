# Handbook — video: any design can become a video

Scenes are not "static" or "video" at creation time — add time-based content
to the scene you already have, then `export({ format: "mp4" })` renders the
authored timeline. Do NOT rebuild a scene with `scene.createVideo()` just to
animate it (`createVideo` and `scene.setMode('Video')` exist as conveniences;
you rarely need either).

```js
// Page duration = length of the exported video.
await engine.design.setProps(page, { playback: { duration: 10 } }); // seconds

// Tracks hold timed children; blocks get offsets + durations.
const track = await engine.design.create({ type: 'track' }, { parent: page });
// Tracks auto-arrange children back-to-back (silently). Turn it off before
// custom offsets, or timeOffset gets overwritten.
engine.block.setBool(track, 'track/automaticallyManageBlockOffsets', false); // engine.block: no track/* props path
const block = await engine.design.create(
  { type: 'graphic' },
  { parent: track }
);
await engine.design.setProps(block, {
  playback: { timeOffset: 1.0, duration: 5.0 } // enters at t=1s, visible 5s
});

// Video fill — use the workspace:// URI from `asset_add`.
await engine.design.setProps(block, {
  fill: { type: 'video', video: { fileURI: 'workspace://assets/<sha>.mp4' } }
});
// Trim writes need the video's metadata — load first, else they throw
// "The video has not been loaded yet." Trim lives on the FILL.
const fillId = engine.block.getFill(block);
await engine.block.forceLoadAVResource(fillId); // engine.block: AV metadata load has no facade verb
await engine.design.setProps(fillId, {
  playback: { trimOffset: 2.0, trimLength: 5.0 } // start 2s in, play 5s
});

// Audio block — plays during the page's timeline.
await engine.design.create(
  {
    type: 'audio',
    props: { audio: { fileURI: 'workspace://assets/<sha>.mp3' } }
  },
  { parent: page }
);
```

- Export: `export({ format: "mp4", revision, blockId: page })`.
  Duration/resolution come from the page — there are no export knobs.
- Needs the native engine (the default). If the server fell back to WASM,
  video/audio tools refuse with the reason; `diagnostics` shows
  `status.config.videoAvailable`.
- Motion beyond timing — enter/exit/loop animations on any block, animated
  text, captions — is in the guide: `../guide/animation/create.md`,
  `../guide/animation/types.md`, `../guide/edit-video/add-captions.md`.
- `preview` renders a STILL frame of a video scene, not motion — pass `time`
  (seconds) to seek: verify a few salient moments (start, a transition, the
  end). Each video preview returns `{time, duration}` JSON next to the image.
  Export for the real thing.
- Resource loading during export is handled server-side — you do NOT need a
  `loadResources` barrier before `export` (unlike the handbook's font barrier).
  The one load you DO need is `forceLoadAVResource(fill)` before reading or
  trimming a video fill (see the recipe above).
- **Multi-clip tracks (sequences, crossfades): disable auto-arrange first.**
  `track/automaticallyManageBlockOffsets` defaults to `true` and silently
  overwrites every child's `setTimeOffset` with an auto-computed back-to-back
  value — no error. It looks fine with one clip (offset 0 either way), which
  is why it hides until you need two clips to overlap. Before setting any
  child offsets: `engine.block.setBool(track, 'track/automaticallyManageBlockOffsets', false)`.
