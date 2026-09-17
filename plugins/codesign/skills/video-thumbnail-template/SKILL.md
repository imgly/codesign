---
name: video-thumbnail-template
description: Build a CSV-driven video thumbnail template from a channel URL, a reference image or a brief
argument-hint: <channel-url | image | brief> [output-folder]
disable-model-invocation: true
---

Build a video thumbnail template from $ARGUMENTS.

First load the `video-thumbnail-template` skill from the CoDesign MCP server — `skill({ name: 'video-thumbnail-template' })` — and follow it exactly. The first argument is the source: a channel URL, one or more reference images, or a brief in quotes. The optional second is the output folder.
