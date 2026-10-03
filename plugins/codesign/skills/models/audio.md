# Audio — speech, music, sound effects, captions

Observed on 2026-09-26 (latency is wall-clock for the whole call; credits: 1 = $0.001).

| job                   | model                                       | call                                                                | seen                                       |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ |
| Speech (TTS)          | `elevenlabs/eleven-v3-tts`                  | `prompt`: the words; `params: { voice: 'Aria' }`                    | one sentence → 4.4 s MP3, 8 s, ~20 credits |
| Captions / transcript | `elevenlabs/scribe-v2`                      | `params: { audio_url: '<uri>' }` (a returned `uri`), no prompt      | 4.4 s clip → 4 s, 9.6 credits              |
| Sound effect          | `@falai/fal-ai/elevenlabs/sound-effects/v2` | `params: { text: 'a soft whoosh', duration_seconds: 2 }`, no prompt | 2 s MP3 in 6 s, 6 credits                  |
| Music                 | `@falai/fal-ai/minimax-music/v2`            | `prompt` (style) + `params: { lyrics_prompt: '[Instrumental]' }`    | 21 s MP3 in 40 s, 45 credits               |

## Speech

`voice` is an enum — read it from `schema: true` (21 voices; default `Rachel`). The result's
`meta.duration` is what to size the audio block and the scene to.

## Captions

The result is a summary, not the raw transcript:

```
{ transcriptUri, duration, language?, wordCount,
  lines: ['[00:03.1–00:07.9] First sentence as spoken.', …] }
```

`lines` (one per sentence, very long run-ons cut at ~40 words) is for choosing moments — quotes,
cut points, a highlight reel; past ~60 KB it stops and `linesOmitted` counts the rest. The word
timings live in the `transcriptUri` asset; read them inside `edit` instead of copying them into
code:

```js
const { words } = await engine.design.readTranscript(transcriptUri, {
  from: 62,
  to: 75
});
// words: [{ text, start, end }] — seconds in the SOURCE, start ∈ [from, to)
```

Where `asset_generate`'s description says it takes video and long recordings, pass the video
itself: the audio is extracted and split under the model's 20-minute limit, and the times come
back on the source's clock, within ~15 ms. Otherwise pass mp3, m4a or wav under 19 minutes.
Subtract the clip's trim offset and add its place on the timeline to turn source times into page
times. Group words into caption lines by those timings rather than splitting the text evenly.

## Music

MiniMax Music v2 requires `lyrics_prompt`; `[Instrumental]` gave an instrumental track. It picks
its own length (21 s for a "jingle" prompt) — there is no duration field, so trim the audio block
in the design if the scene is shorter.

**Refused by the gateway today** with `model_not_supported` ("is billed in 'minutes' / 'audios' /
'30 seconds', which the gateway cannot derive from the input"): `@falai/elevenlabs/music/v2.5`,
`@falai/elevenlabs/music/v2`, `@falai/fal-ai/elevenlabs/music`, `@falai/cassetteai/music-generator`,
`@falai/fal-ai/stable-audio-25/text-to-audio`, `@falai/fal-ai/lyria2`. Such a refusal costs
nothing — try the next model.

## Sound effects

`text` (not `prompt`) is required, max 450 characters; `duration_seconds` 0.5–22, or leave it out
and the model picks. `loop: true` makes it loop cleanly.
