---
title: "Overview"
description: "Enhance design elements with strokes, shadows, and glow effects to improve contrast and visual appeal."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/outlines/overview-dfeb12/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Outlines](https://img.ly/docs/cesdk/archive/v1.84/node/outlines-b7820c/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/outlines/overview-dfeb12/)

---

In CreativeEditor SDK (CE.SDK), *outlines* refer to visual enhancements added around design elements. They include strokes, shadows, and glows, each serving to emphasize, separate, or stylize content. Outlines help improve visibility, create visual contrast, and enhance the overall aesthetic of a design.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Understanding Outlines

- **Stroke (Outline):** A solid line that directly traces the border of an element. Strokes can vary in thickness, color, and style (such as dashed or dotted lines).
- **Shadow:** A duplicate of the element rendered with an offset and blur effect, creating the illusion of depth.
- **Glow:** A soft, diffused light that radiates outward from the element, typically used to create a luminous or halo effect.

> **Note:** Glow effects are configured through the effects system. For simple halo
> styling, a brightly colored shadow can also create a glow-like result.

Each type of outline offers different visual styles and purposes, allowing you to tailor your design's look and feel.

## Supported Elements

You can apply outlines to a wide range of elements in CE.SDK, including:

- Text elements
- Shapes
- Images
- Stickers

Some asset types or highly customized components may have limitations on which outline effects they support. Always check element capabilities if outline options appear unavailable.

## Programmatic Editing

Developers can also manage outlines programmatically using the CE.SDK API. This includes:

- **Accessing and modifying properties** such as stroke color, stroke width, shadow blur, and shadow offset.
- **Enabling or disabling outlines** for individual design blocks.
- **Removing outlines** programmatically by disabling stroke or shadow effects on a block.

Programmatic control enables dynamic styling and automation for design generation workflows.

## Customizing Outline Properties

Outlines in CE.SDK offer a variety of customizable properties to fit different design needs:

- **Color:** Define stroke or shadow color to match branding or design themes.
- **Thickness (Stroke Width):** Adjust how bold or subtle the stroke appears around the element.
- **Opacity:** Control the transparency of strokes, shadows, or glows for subtle or strong effects.
- **Blur (for Shadows and Glows):** Soften the appearance of shadows or glows by adjusting their blur radius.
- **Offset (for Shadows):** Set how far a shadow is displaced from the element to control the sense of depth.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
