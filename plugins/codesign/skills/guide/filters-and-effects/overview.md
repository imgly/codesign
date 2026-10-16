---
title: "Node.js Filters & Effects Library"
description: "Enhance visual elements with filters and effects such as blur, duotone, LUTs, and chroma keying."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/filters-and-effects/overview-299b15/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Filters and Effects](https://img.ly/docs/cesdk/archive/v1.84/node/filters-and-effects-6f88ac/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/filters-and-effects/overview-299b15/)

---

In CreativeEditor SDK (CE.SDK), *filters* and *effects* refer to visual modifications that enhance or transform the appearance of design elements. Filters typically adjust an element’s overall color or tone, while effects add specific visual treatments like blur, sharpness, or distortion.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Understanding Filters vs. Effects

- **Filters** are broad transformations that modify the entire appearance of an element. Common examples include:
  - Color adjustments (e.g., brightness, contrast, sharpness)
  - Lookup Table (LUT) filters for advanced color grading
  - Duotone color schemes

- **Effects** apply targeted visual modifications to an element. Typical examples include:
  - Blurring an area to soften details
  - Distorting shapes for creative transformations

**Key Differences:**

| Aspect   | Filters                             | Effects                         |
| -------- | ----------------------------------- | ------------------------------- |
| Scope    | Alters the entire visual appearance | Applies a specific modification |
| Examples | LUTs, duotone, adjustments          | Blur, chroma key, distortion    |
| Use Case | Color grading, mood setting         | Stylizing or emphasizing parts  |

Understanding the distinction helps you choose the right tool depending on whether you want broad tonal changes or focused visual alterations.

## Supported Filters and Effects

CE.SDK offers a range of built-in filters and effects ready to use out of the box.

**Available Filters:**

- **Adjustment Filters:** Modify brightness, contrast, saturation, sharpness, and more.
- **LUT (Lookup Table) Filters:** Apply professional-grade color transformations.
- **Duotone Filters:** Map the shadows and highlights of an image to two custom colors.

**Available Effects:**

- **Blur:** Soften an area for background separation or artistic focus.
- **Distortion:** Warp the geometry of an element for creative effects.
- **Chroma Key (Green Screen):** Remove a background color, often used for compositing images.

Sharpness is available through the [Adjust Colors](https://img.ly/docs/cesdk/archive/v1.84/node/colors/adjust-590d1e/) workflow rather than as a standalone effect.

**Supported Element Types:**

- Images
- Videos
- Shapes
- Graphic blocks

Before applying a filter or effect programmatically, you can verify support by checking the element type.

## Custom Filters and LUTs

CE.SDK supports creating **custom filters** to meet specific visual requirements.

One powerful method of creating a custom filter is by using a **LUT (Lookup Table)**:

- A LUT is a preset map that transforms input colors to output colors, allowing for sophisticated color grading.
- By importing a custom LUT, you can apply unique color styles across your designs consistently.
- LUTs are especially useful for achieving cinematic tones, brand color consistency, or specific visual moods.

You can create your own LUT files externally and integrate them into CE.SDK, giving you full control over the look and feel of your projects.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
