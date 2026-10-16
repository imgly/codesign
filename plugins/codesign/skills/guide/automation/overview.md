---
title: "Overview"
description: "Automate repetitive editing tasks using CE.SDK’s headless APIs to generate assets at scale."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/automation/overview-34d971/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Automate Workflows](https://img.ly/docs/cesdk/archive/v1.84/node/automation-715209/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/automation/overview-34d971/)

---

Workflow automation with CreativeEditor SDK (CE.SDK) enables you to programmatically generate, manipulate, and export creative assets—at scale. Whether you're creating thousands of localized ads, preparing platform-specific variants of a campaign, or populating print-ready templates with dynamic data, CE.SDK provides a flexible foundation for automation.

You can run automation entirely on the client, integrate it with your backend, or build hybrid “human-in-the-loop” workflows where users interact with partially automated scenes before export. The automation engine supports static and video pipelines, making it suitable for a wide range of publishing, e-commerce, and marketing applications. On the server, export MP4 video directly with the native `@cesdk/node-native` package; with the WASM-based `@cesdk/node`, use the separate CE.SDK Renderer.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## What Can Be Automated with CE.SDK

CE.SDK supports a wide variety of automation use cases, including:

- **Design generation at scale**: Create thousands of variants from a single template, such as product cards or regionalized campaigns.
- **Data-driven customization**: Merge external data (e.g., CSV, JSON, APIs) into templates to personalize text, images, or layout.
- **Responsive output creation**: Automatically resize designs and export assets in different aspect ratios or dimensions for various platforms.
- **Pre-export validation**: Detect issues like empty placeholders or low-resolution images before generating final output.
- **Multimodal exporting**: Automate delivery to multiple formats including JPG, PNG, PDF, and MP4.

## Automation Contexts

### Headless / Server-Side Automation

Server-side automation provides complete control over content generation without rendering a UI. This is ideal for background processing, such as creating assets in response to API requests or batch-generating print files for a mail campaign.

### Client-Side vs. Backend-Supported Workflows

Many automation workflows can run fully inside your Node.js process thanks to CE.SDK’s self-contained engine. However, a backend may be required for use cases involving:

- Secure access to private assets
- Large dataset lookups
- Server-side template rendering
- Scheduled or event-based triggers

## Customization Capabilities

CE.SDK gives you deep control over how your automation pipeline behaves:

### Data Sources

Connect to a variety of inputs:

- Local or remote JSON
- CSV files
- REST APIs
- CMS or PIM systems

### Template Customization

- Define dynamic variables and conditional placeholders
- Use reusable templates or generate them on-the-fly
- Lock or constrain specific fields to preserve brand integrity

### Design Rules

Enforce visual and content constraints:

- Brand-compliant colors and fonts
- Overflow handling and text auto-resizing
- Show/hide conditions and fallback logic

### Output Formats

| Category    | Supported Formats                                                                    |
| ----------- | ------------------------------------------------------------------------------------ |
| **Images**  | `.png` (with transparency), `.jpeg`, `.webp`, `.tga`                                 |
| **Vector**  | `.svg` (scalable vector graphics with text as paths)                                 |
| **Print**   | `.pdf` (supports underlayer printing and spot colors)                                |
| **Video**   | `.mp4` (H.264 video with AAC audio — requires the native `@cesdk/node-native` package; not available in the WASM-based `@cesdk/node`) |
| **Scene**   | `.imgly` or `.scene` (description of the scene without any assets) |
| **Archive** | `.imgly` or `.zip` (fully self-contained archive that bundles the scene file with all assets) |
| **HTML**    | `.html` (static designs and animated video timelines — requires the separate `@imgly/html-exporter` package) |

> **Note:** Our custom cross-platform C++ based rendering and layout engine ensures
> consistent output quality across devices.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
