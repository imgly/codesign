---
name: video-thumbnail-template
description: Build a design guideline and reusable video thumbnail template from a channel link, example thumbnails, or from scratch
argument-hint: '[channel-link | thumbnail | design]'
disable-model-invocation: true
---

Build a video thumbnail template from $ARGUMENTS.

First load the `video-thumbnail-template` skill from the CoDesign MCP server — `skill({ name: 'video-thumbnail-template' })` — and follow it exactly. The argument is the source: a channel link, one or more example thumbnails or design files, or nothing to start fresh.
