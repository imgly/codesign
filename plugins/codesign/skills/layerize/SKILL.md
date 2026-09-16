---
name: layerize
description: Rebuild a flat image (PNG, JPEG, WebP) as an editable, layered CoDesign design
argument-hint: <image> [output.imgly]
disable-model-invocation: true
---

Rebuild $ARGUMENTS as an editable CoDesign design.

First load the `layerize` skill from the CoDesign MCP server — `skill({ name: 'layerize' })` — and follow it exactly. The first argument is the source image; the optional second is the `.imgly` output path.
