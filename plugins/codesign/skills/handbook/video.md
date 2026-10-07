# Handbook — video: any design can become a video

Scenes are not "static" or "video" at creation time — add time-based content
to the scene you already have, then `export({ format: "mp4" })` renders the
authored timeline. Do NOT rebuild a scene with `scene.createVideo()` just to
animate it. `preview` seeks (`time`) and `export` renders the timeline in any
scene mode.

```js
// Optional: the timeline plays in any mode; in Video mode every preview
// also reports {time, duration}.
engine.scene.setMode('Video');

// Page duration = length of the video.
await engine.design.setProps(page, { playback: { duration: 10 } }); // seconds

// Timed visuals live on tracks, one track per layer (see "Timeline: one
// track per layer" below) — never directly on the page. Tracks stack in
// creation order: the first is the bottom layer.
const track = await engine.design.create({ type: 'track' }, { parent: page });
// Tracks auto-arrange children back-to-back (silently). Turn it off before
// custom offsets, or timeOffset gets overwritten.
engine.block.setBool(track, 'track/automaticallyManageBlockOffsets', false); // engine.block: no track/* props path
// A graphic needs a shape and a size to show anything, a video fill included.
const block = await engine.design.create(
  {
    type: 'graphic',
    props: { shape: { type: 'rect' }, width: 1920, height: 1080 }
  },
  { parent: track } // the next clip of this layer goes on the same track
);
await engine.design.setProps(block, {
  playback: { timeOffset: 1.0, duration: 5.0 } // enters at t=1s, visible 5s
});

// Video fill — use the `uri` that `asset_add` returned.
await engine.design.setProps(block, {
  fill: { type: 'video', video: { fileURI: '<opaque handle>' } }
});
// Trim writes need the video's metadata — load first, else they throw
// "The video has not been loaded yet." Trim lives on the FILL.
const fillId = engine.block.getFill(block);
await engine.block.forceLoadAVResource(fillId); // engine.block: AV metadata load has no facade verb
await engine.design.setProps(fillId, {
  playback: { trimOffset: 2.0, trimLength: 5.0 } // start 2s in, play 5s
}); // setProps(block, { playback: { trimOffset } }) reaches the fill too

// Animation timing and text styling are spec keys — no raw animation ids.
await engine.design.setProps(block, {
  animations: {
    in: { type: 'slide', duration: 0.8, easing: 'EaseOutBack' },
    loop: { type: 'breathing_loop', duration: 2 } // loops take no easing
  }
});
// Text: writingStyle ('Line' | 'Word' | 'Character' | 'Block') + overlap (0..1)
// animate per unit, e.g. in: { type: 'fade', writingStyle: 'Word', overlap: 0.3 }

// Audio block — plays during the page's timeline; fades are facade props.
await engine.design.create(
  {
    type: 'audio',
    props: {
      audio: { fileURI: '<opaque handle>' },
      playback: {
        timeOffset: 0,
        duration: 10,
        volume: 0.8,
        fadeIn: { duration: 0.5 },
        fadeOut: { duration: 1 }
      }
    }
  },
  { parent: page }
);
```

Several audio blocks can sit on the page at once — a music bed plus a short
sound effect per cut, each placed with its own `playback.timeOffset`.

## Timeline: one track per layer

A track holds a sequence of clips in one timeline row. A block placed
directly on the page gets a row of its own, so a 30 s video built that way
opens in the editor as 50+ rows, one per text and shape. Build the timeline
the way an editor would:

- **One track per layer, created bottom first** — for example backgrounds,
  media, headline, subline, chip. Every beat's element for that layer goes
  on the same track, one after another. Only audio sits on the page itself.
- **Tracks are layers.** A later track draws above an earlier one, for the
  whole video. Clips on one track never share a moment, except for the
  overlap a transition needs (which equals its duration). Two things on
  screen at the same time therefore sit on two tracks.
- **Auto-arrange.** Leave `track/automaticallyManageBlockOffsets` on for a
  gapless back-to-back sequence (the clips play in child order, and
  transitions shorten it as described below). Turn it off for a layer
  with gaps or hand-set offsets, and set each clip's `timeOffset`.
- **A track is a layer, not an element.** Reuse it across beats: beat 2's
  third line and beat 3's third chip can share one track, because they are
  never on screen together. Aim for the number of layers a frame needs
  (typically 3–6), not one track per element.
- **Things that enter together are one clip.** A list of lines or a row of
  chips that appears within one beat is a group on one track. Its children
  keep their own `timeOffset`s and in-animations for the stagger, so the
  group needs no track per item. A group takes no transition: transitions
  join two leaf clips (graphic, text, video) that follow each other on one
  track.
- **Name clips by beat and layer** (`b3/bg`, `b3/headline`) so later edits
  find them with `findByName`.

```js
// Three beats, two layers: a background sequence and a headline sequence.
const bgs = await engine.design.create({ type: 'track' }, { parent: page }); // bottom
const words = await engine.design.create({ type: 'track' }, { parent: page }); // above
engine.block.setBool(words, 'track/automaticallyManageBlockOffsets', false); // engine.block: no track/* props path
for (const [i, beat] of beats.entries()) {
  const bg = await engine.design.create(
    {
      type: 'graphic',
      name: `b${i}/bg`,
      props: {
        shape: { type: 'rect' },
        width: W,
        height: H,
        fill: { type: 'color', color: { value: beat.color } }
      }
    },
    { parent: bgs } // auto-arranged: back-to-back in creation order
  );
  await engine.design.setProps(bg, { playback: { duration: beat.length } });
  const line = await engine.design.create(
    {
      type: 'text',
      name: `b${i}/headline`,
      props: { text: { string: beat.line, lineHeight: { visual: 1.1 } } }
    },
    { parent: words }
  );
  await engine.design.setProps(line, {
    playback: { timeOffset: beat.start + 0.2, duration: beat.length - 0.4 }
  });
}
```

The `edit` result reports it when the timeline has more rows than its
timing needs ("N timeline rows (… blocks directly on the page, … tracks); by
their timing the clips fit on M tracks"). Move the blocks onto shared tracks
in stacking order: each keeps its `timeOffset` and `duration`, and the frames
stay the same.

## Sound: music, voiceover, sound effects

Audio is part of the design, not an afterthought: it plays under the page's
timeline and ships inside the mp4 (or alone as `wav`/`m4a`, see Notes). A silent video is a complete deliverable
when the brief chose it — say so, rather than leaving sound out by omission.

- **Sources.** The user's own file → `asset_add` (mp3, wav, m4a, ogg, aac).
  Otherwise `asset_generate`: music and sound effects are provider
  models (`capability: "text2audio", source: "all"`), a voiceover is
  `elevenlabs/eleven-v3-tts`, and `elevenlabs/scribe-v2` transcribes speech
  into a `transcriptUri` plus one timed line per sentence (its description
  says whether it also takes video and long recordings). Prompts and
  parameters per model are in
  `../models/audio.md`, including how to write brand names in a
  voiceover's text so they are said right. Each returns a `uri` and, when the
  file states it, a `duration` — size the page and the clips from it.
- **Timing.** Put a voiceover on the timeline where its sentence belongs and cut
  or animate to its words: inside `edit`,
  `engine.design.readTranscript(transcriptUri, { from, to })` gives each
  word's start and end in seconds of the source (captions and word-timed text
  use the same times).
  Music drives the cuts when there is no voice — the `launch-video` skill has a
  beat-map recipe for that.
- **Levels.** One audio block per sound; `playback.volume` is 0–1. Duck the
  music under a voiceover (0.3–0.5 while it speaks); a sound effect is a short
  block at the cut, 0.5–0.8 under the music. Give the bed a `fadeOut` that ends with the page
  (and a `fadeIn` unless it starts on a hit). A bed shorter than the page
  leaves a silent tail — pick a longer track, or end the page with the music.
- **Beat-tight sync: prefer WAV.** In the exported mp4 an MP3 plays about
  40–100 ms later than the same audio as WAV. Harmless for a bed or a voiceover;
  for cuts timed to single beats, render the MP3 to WAV: while it is the only
  audio on the page, run `export({ format: 'wav', blockId: page })` and set the
  block's `audio.fileURI` to the returned `uri`, with `timeOffset` and
  `trimOffset` 0 — the WAV is the page's mix from 0 s. Time the cuts on that
  WAV — the engine's decode of it is what the mp4 plays.
- **Checking it.** `preview` renders pictures, not sound: the audio is only
  heard in the exported mp4. Export once, after the judge gate passes, then confirm from the export result that
  `audioDuration` is present and about equals `duration` (no `audioDuration` means
  the mp4 has no audio track), and listen to it when your host can play it;
  otherwise tell the user which sounds sit where.

## Transitions between clips

A transition joins a clip to the NEXT clip on the same track (`push`, `wipe`,
`cross-zoom`, …) and renders in the video. Only leaf clips on a track qualify —
a graphic, text or video block that is a track's child;
`engine.block.supportsTransition(id)` says whether one does. Blocks placed on
the page directly, pages and tracks do not. A layer's sequence of beats is
one track (see "Timeline: one track per layer"), so each layer gets its own
transitions.

```js
const t = engine.block.createTransition('push');
await engine.design.setProps(t, { playback: { duration: 0.3 } }); // default 1.2
engine.block.setEnum(t, 'transition/push/direction', 'Up'); // engine.block: transition options have no facade path
engine.block.setEnum(t, 'animationEasing', 'EaseOutQuint'); // engine.block: no facade path
engine.block.setTransition(clipA, t); // clipA → the clip after it on the track
```

- **Timing.** The transition runs during the overlap of the two clips. With
  auto-arrange on, `setTransition` starts the next clip `duration` before
  the current one ends — the total gets shorter by that much, so size the
  page to Σ clips − Σ transitions or the video ends on an empty tail. With
  auto-arrange off, lengthen each clip by the transition duration yourself
  (`timeOffset` of the next clip = the cut time; this clip's duration runs
  past it by the transition length) — keep that overlap equal to the
  transition's duration, or the transition drifts off the cut.
- **Order.** `setTransition` needs the NEXT clip already on the track — it throws "no adjacent
  following clip" otherwise. Place every clip first, then set transitions in a second pass.
- **Read back in the next edit.** Clip offsets read in the same edit that called `setTransition`
  can be stale; the committed values are right. Verify timings in a following read-only edit.
- **Options.** Every transition has `playback.duration` (facade) and
  `animationEasing` (raw, default `EaseInOutQuint`; the animation easings).
  The `transition/<type>/*` options are raw engine properties — the facade
  rejects them in `setProps` and `getProps`, and a rejected facade call fails
  the whole edit even inside `try/catch`:

  | type                                                                         | options (enum values)                                          |
  | ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
  | `push` `slide` `stack` `wipe`                                                | `direction`: `Left` `Right` `Up` `Down`                        |
  | `splice`                                                                     | `direction`, `bandCount` (int, 3)                              |
  | `color-wipe`                                                                 | `direction`, `color`                                           |
  | `gradient-fade`                                                              | `direction`, `color`                                           |
  | `fade`                                                                       | `color` — fade through a colour                                |
  | `cross-blur`                                                                 | `sigma` (float, 100)                                           |
  | `cross-zoom` `cross-warp`                                                    | `zoom` (float, 0.6)                                            |
  | `cross-spin`                                                                 | `direction`: `Clockwise` `CounterClockwise`; `intensity` (1)   |
  | `chop`                                                                       | `corner`: `TopLeft`…`BottomRight`; `direction` as `cross-spin` |
  | `diagonal-splice`                                                            | `direction`: `RaisedRamp` `LoweredRamp`                        |
  | `two-stripes`                                                                | `direction`: `Horizontal` `Vertical`                           |
  | `cross-fade` `fade-to-black` `fade-to-white` `line-wipe` `clock-wipe` `none` | —                                                              |

  Colours: `engine.block.setColor(t, 'transition/fade/color', { r, g, b, a })`.

- **Replacing** one: `setTransition` with a new block leaves the old one alive
  and detached — `await engine.design.destroy(old)` it.
  `engine.block.removeTransition(clip)` clears a clip's transition.
- **Verify transitions with `preview`.** A still at `time` inside a
  transition renders it as the mp4 does — preview its middle
  (`time` = cut + duration/2). A still that shows one clip whole there means
  the transition is not applied or not where you think: check the clip is a
  track child and the overlap equals the transition's duration.

## Captions

Native captions burn into the mp4 and stay editable in the editor:
page → one `captionTrack` → one `caption` per phrase.

```js
const track = await engine.design.create(
  { type: 'captionTrack' },
  { parent: page }
);
const ids = [];
for (const p of phrases) // { text, start, end } from transcript word times
  ids.push(
    await engine.design.create(
      {
        type: 'caption',
        props: {
          caption: { text: p.text },
          playback: { timeOffset: p.start, duration: p.end - p.start }
        }
      },
      { parent: track }
    )
  );
// style ONCE — every caption on the track takes it
await engine.design.setProps(ids[0], {
  caption: {
    font: { family: 'Inter', weight: 'bold' },
    fontSize: '56px',
    color: { r: 1, g: 1, b: 1, a: 1 },
    horizontalAlignment: 'Center'
  },
  position: { x: 90, y: 1500 },
  width: 900,
  height: 200
});
```

- **Style and layout are track-wide.** Position, size, font, font size, colour,
  alignment, `backgroundColor` and stroke written on ANY caption apply to every
  caption on its track, and a new caption adopts them. Write them once; text,
  `playback` timing, opacity and animations are per caption.
- **One track per page.** A second track is a second, independent style.
- **Phrases, not words.** Group transcript words into 2–6-word phrases that
  fit the frame; consecutive captions should not overlap in time.
- **Background box = the whole caption frame** plus `backgroundColor` padding,
  not the glyphs: size the frame to the text before enabling it.

## Notes

- **Groups time their children.** A child's `timeOffset` inside a group counts from the group's
  start, and a new group's `duration` defaults to 5 s — give every group a window that covers its
  children (usually `timeOffset: 0, duration: <page duration>`), or everything in it disappears
  after 5 s.
- **Animating an existing still design?** The `animate` skill does it end to end:
  `../animate/SKILL.md`.
- Export: `export({ format: "mp4", blockId: page })`.
  Duration and resolution come from the page; `fps` (default 30) is the one
  export knob. The page's audio blocks are mixed into the mp4.
- Audio only: `export({ format: "wav" | "m4a", blockId: page })`
  renders the page's audio mix (`wav` = 48 kHz stereo float). Page only; for one
  clip alone, export while it is the only audio on the page. Every clip sounds
  over exactly its own window (within a few ms) — same timing as the mp4.
- Needs the native engine (the default). If the server fell back to WASM,
  video/audio tools refuse with the reason; `diagnostics` shows
  `status.config.videoAvailable`.
- Motion beyond timing — enter/exit/loop animations on any block, animated
  text, captions — is in the guide: `../guide/animation/create.md`,
  `../guide/animation/types.md`, `../guide/edit-video/add-captions.md`.
- `preview` renders a STILL frame, not motion — pass `time` (seconds) to seek
  any page with a timeline, whatever the scene mode: verify a few salient
  moments (start, mid-beat, the middle of each transition, the end). Each
  timed preview returns `{time, duration}` JSON next to the image.
  Export for the real thing.
- Poster: a still `export` (png/jpeg/webp) renders the frame at the page's
  playhead — park it with `setProps(page, { playback: { time } })` in an edit.
- Resource loading during export is handled server-side — you do NOT need a
  `loadResources` barrier before `export` (unlike the handbook's font barrier).
  The one load you DO need is `forceLoadAVResource(fill)` before reading or
  trimming a video fill (see the recipe above).
- **Multi-clip tracks with your own offsets: disable auto-arrange first.**
  `track/automaticallyManageBlockOffsets` defaults to `true` and silently
  overwrites every child's offset with an auto-computed back-to-back
  value — no error. It looks fine with one clip (offset 0 either way), which
  is why it hides until you need two clips to overlap. Before setting any
  child offsets: `engine.block.setBool(track, 'track/automaticallyManageBlockOffsets', false)`.
  Under auto-arrange, a `timeOffset` read in the same edit that created the
  clip can come back `-1`; it is computed by the next edit.
- **Never let two see-through groups each hold an undrawn child at the
  same moment.** A group is see-through while its opacity is below 1 —
  set directly, or mid-animation (seen with a `fade` in-animation and a
  `slide` with `fade: true`). A child is undrawn when it's hidden or outside
  its own playback window (e.g. it starts later than its group). When a frame
  has two or more such groups, the engine renders it solid black, and every
  frame after it too — the video goes black to the end, with no error. Stagger
  the groups so their fades don't overlap, make each child's window cover its
  group's fade, or use `fade: false`.
  The engine stays black afterwards: later previews and exports, of any
  design, come back black until the engine is recycled.
  This server recycles it after 5 idle minutes by default, or on a restart.
  So right after an mp4 export, `preview` its last frame: black where the
  design is not means the export went black too.
