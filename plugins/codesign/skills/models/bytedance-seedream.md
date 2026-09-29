# ByteDance Seedream — layer decomposition

`bytedance/seedream-5-pro-layerize` (image-to-image) splits one image into a background and
independently placeable cut-outs. The other Seedream ids in the catalog (text-to-image and edit)
have no verified guidance yet.

## Prompt

Send `split image into layers` — exactly this. Do not describe the image or the layers you want.
The tool requires a prompt; the model decomposes on its own.

Why (tests, September 2026): on one ad image, prompts over 1,000 characters failed 7 of 7, and
prompts of 14–420 characters succeeded 3 of 5. Describing the wanted layers did not improve the
split — `split image into layers` and a deliberately unrelated prompt returned the same nine
layers, bounding boxes within 1 px (only their order differed). A 1,541-character prompt did succeed on a different image, and a short one sometimes
fails, so the minimal prompt is the better bet, not a guarantee.

## Input

Pass the original file through `asset_add` unchanged. Re-encoded copies (RGB JPEG and RGB PNG) of
the test ad were rejected by the content checker 4 of 4, while the original RGBA PNG went through.

## Result

- `assets[0]` — the residual background: source size, RGB, extracted elements inpainted away. Its
  `layers` entry has no name and no bounding box. It can still show part of an element that also
  came back as its own layer — compare before using it.
- `assets[1…]` — RGBA cut-outs, one per `metadata` `layers` entry in the same order; `z_index`
  equals the index, back to front. The order is not stable between calls (the same layers came back
  stacked differently), so decide the stacking yourself.
- `bounding_box.absolute` is `[x0, y0, x1, y1]` in source pixels; `normalized` is the same box in
  per-mille (0–999).
- **Cut-outs come back rescaled**, by a different factor per layer (seen 1.08× to 4.3×, aspect
  kept). Size each layer to its bounding box — never to the asset's pixel size.
- A call takes 50–150 s.

## Errors seen

- `The model rejected the input: image_url: The provided image could not be processed for layer decomposition. Try a different image.`
- `The model rejected the input: image: The content could not be processed because it contained material flagged by a content checker.`
- `Upstream service error`

All three appeared for inputs that succeeded on another call, so none of them proves the image
is unusable.
