# Bria — background removal

`bria/rmbg-2.0` (image-to-image) returns its input with the background removed, as an RGBA PNG at
the input's size (seen: 1080 × 1080 in, 1080 × 1080 out, 7 s).

## Prompt

The tool requires one; `remove background` works. Whether the wording changes the result is
untested.

## Use it for

- Cutting a subject out of a photo.
- **Restoring transparency after an upscaler** — neither upscaler keeps alpha (see
  `upscalers.md`); re-cutting the upscaled image with this model brought clean alpha back.

It decides on its own what counts as foreground. On a busy composition it may keep more or less
than the subject you mean — look at the result before placing it.
