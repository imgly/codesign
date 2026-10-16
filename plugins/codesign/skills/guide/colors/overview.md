---
title: "Overview"
description: "Manage color usage in your designs, from applying brand palettes to handling print and screen formats."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/colors/overview-16a177/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Colors](https://img.ly/docs/cesdk/archive/v1.84/node/colors-a9b79c/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/colors/overview-16a177/)

---

Colors are a fundamental part of design in the CreativeEditor SDK (CE.SDK). Whether you're designing for digital screens or printed materials, consistent color management ensures your creations look the way you intend. CE.SDK offers flexible tools for working with colors through both the user interface and programmatically, making it easy to manage color workflows at any scale.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## For Print and Screen

Designing for screen and designing for print involve different color requirements, and CreativeEditor SDK (CE.SDK) is built to support both.

- **Screen workflows** use RGB-based color spaces like sRGB and Display P3. These spaces are optimized for digital displays, ensuring vibrant, consistent colors across different devices.
- **Print workflows** typically rely on CMYK and Spot Colors. These spaces reflect how physical inks combine on paper and require more precise color control to match print output.

CE.SDK makes it easy to design for both by:

- Supporting inputs in multiple color spaces, including sRGB, CMYK, and Spot Colors.
- Automatically managing color conversions between spaces.
- Providing tooling to ensure that exported files are optimized for either screen (e.g., PNG, WebP) or print (e.g., PDF with Spot Color support).

> **Note:** **Note:** CE.SDK allows you to specify colors using CMYK values, but these are
> always converted to RGB internally. You cannot produce a true CMYK PDF with
> CE.SDK, and we do not support print-specific PDF variants like PDF/X. However,
> Spot Colors are fully supported and properly embedded in exported PDFs.

## Color Management

Color management is the process of controlling how colors are represented across different devices and outputs—such as screens, printers, and files—to ensure that the colors you see during design match the final result.

In CreativeEditor SDK (CE.SDK), color management includes:

- Supporting multiple input color spaces (e.g., sRGB, Display P3 for screens, CMYK, Spot Colors for print).
- Handling accurate conversions between color spaces (e.g., RGB ↔ CMYK, approximating Spot Colors).
- Allowing custom color palettes and color libraries to maintain consistent color choices across a project or brand.
- Providing tools to adjust color properties like brightness, contrast, and temperature.
- Ensuring consistent color appearance across different export formats and output mediums.

Color management ensures that your designs maintain color accuracy and visual integrity whether they are displayed on a screen or printed professionally.

## Color Libraries and Custom Palettes

Color libraries in CE.SDK are collections of predefined colors that appear in the color picker, helping users maintain brand or project consistency. Libraries are implemented as asset sources, where each color is represented as an individual asset.

Each color library is identified by a unique source ID, allowing you to create, configure, and manage custom palettes tailored to your design needs. This setup makes it easy to offer curated color options to end users, improving both usability and design consistency.

## Supported Color Spaces

CreativeEditor SDK supports a wide range of color spaces to meet different design requirements:

- **sRGB:** The standard color space for most digital screens.
- **Display P3:** A wider gamut color space often used on high-end displays (not available on the Web and server platforms).
- **CMYK:** A subtractive color model used primarily for print workflows.
- **Spot Colors:** Special premixed inks for print-specific designs requiring precise color matching.

Each color space serves different use cases, ensuring that your designs remain accurate whether viewed on a screen or produced in print.

## Applying and Modifying Colors

CE.SDK allows you to apply and modify colors both through the UI and programmatically via the API. You can set colors for fills, strokes, outlines, and other properties dynamically, enabling a wide range of creative control. Whether you are adjusting a single design element or programmatically updating entire templates, the SDK provides the flexibility you need.

## Color Adjustments and Properties

CreativeEditor SDK provides a range of color adjustments to fine-tune your designs. Commonly used adjustments include:

- **Brightness:** Adjust the overall lightness or darkness.
- **Contrast:** Adjust the difference between light and dark areas.
- **Saturation:** Increase or decrease the intensity of colors.
- **Exposure:** Modify the overall exposure level.
- **Temperature:** Adjust the color balance between warm and cool tones.
- **Sharpness:** Enhance the crispness and clarity of edges.

In addition to these, CE.SDK supports many more detailed adjustments.

You can also modify specific color-related properties like fill color, stroke color, and opacity. All adjustments and property changes can be applied both through the UI and programmatically.

## Color Conversion

CreativeEditor SDK automatically manages color conversions to help ensure consistent visual output across different mediums. The following conversion behaviors are supported:

- **RGB and CMYK colors** can be converted between each other using a mathematical approximation.
- **Spot colors** can be represented in RGB and CMYK by using a corresponding color approximation.
- **RGB and CMYK colors cannot be converted to spot colors.**

These automatic conversions help ensure that designs maintain visual consistency whether they are viewed on a digital screen or prepared for professional printing.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
