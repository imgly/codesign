# Upscalers

Neither upscaler preserves transparency.

| model                       | output          | factor     | alpha                            | also                      |
| --------------------------- | --------------- | ---------- | -------------------------------- | ------------------------- |
| `bytedance/seedvr2-upscale` | JPEG            | 2×         | lost — flat grey behind subject  | restyled a face           |
| `recraft/crisp-upscale`     | WebP (lossless) | 3.3 × – 4× | dropped (`alpha_is_used: false`) | softened paper grain ~40% |

## Upscaling a cut-out

Run `recraft/crisp-upscale`, then `bria/rmbg-2.0` on its result, and verify the alpha before
placing it. In testing this restored clean transparency (a figure came back 46.6 % fully
transparent, corners at alpha 0). Placing an upscaled cut-out directly paints an opaque rectangle
over the design.

## Prompt

The tool requires one. Whether the wording changes an upscaler's result is untested.
