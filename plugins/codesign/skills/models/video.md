# Video

Catalog models: `google/veo-3.1-fast`, `google/veo-3.1-lite`, `kling/v3-pro`,
`bytedance/seedance-2.5`, `minimax/h3-max` (+ `-turbo`); each has an image-to-video twin with an
`-i2v` suffix that takes its start frame through `image_uris`.

Not yet run through this server — read the model's `schema: true` for its `duration`,
`resolution` and aspect fields before the first call, and expect a generation to take minutes and
cost far more than an image. Check the `cost` of the first result before generating several.

The result is an MP4 (`kind: 'video'`, with `duration` from its header). Placing it needs an
engine with video support — `diagnostics` says whether this server has one.
