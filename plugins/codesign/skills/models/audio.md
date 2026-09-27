# Audio — speech, music, sound effects, captions

Observed on 2026-09-26 (latency is wall-clock for the whole call; credits: 1 = $0.001).

| job                   | model                                       | call                                                                | seen                                       |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ |
| Speech (TTS)          | `elevenlabs/eleven-v3-tts`                  | `prompt`: the words; `params: { voice: 'Aria' }`                    | one sentence → 4.4 s MP3, 8 s, ~20 credits |
| Captions / transcript | `elevenlabs/scribe-v2`                      | `params: { audio_url: 'workspace://…' }`, no prompt                 | 4.4 s clip → 4 s, 9.6 credits              |
| Sound effect          | `@falai/fal-ai/elevenlabs/sound-effects/v2` | `params: { text: 'a soft whoosh', duration_seconds: 2 }`, no prompt | 2 s MP3 in 6 s, 6 credits                  |
| Music                 | `@falai/fal-ai/minimax-music/v2`            | `prompt` (style) + `params: { lyrics_prompt: '[Instrumental]' }`    | 21 s MP3 in 40 s, 45 credits               |

## Speech

`voice` is an enum — read it from `schema: true` (21 voices; default `Rachel`). The result's
`duration` is what to size the audio block and the scene to.

## Captions

The transcript comes back as data, not a file: `output[0].data.text` is the full text and
`output[0].data.words[]` gives every word's `start`/`end` in seconds (plus `speaker` when
`diarize` is on, the default). Group words into caption lines by those timings rather than
splitting the text evenly.

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
