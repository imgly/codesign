---
title: "Overview"
description: "Learn how to create, import, and manage reusable templates to streamline design creation in CE.SDK."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/create-templates/overview-4ebe30/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/archive/v1.84/node/guides-8d8b00/) > [Create and Use Templates](https://img.ly/docs/cesdk/archive/v1.84/node/create-templates-3aef79/) > [Overview](https://img.ly/docs/cesdk/archive/v1.84/node/create-templates/overview-4ebe30/)

---

In CE.SDK, a *template* is a reusable, structured design that defines editable areas and constraints for end users. Templates can be based on static visuals or video compositions and are used to guide content creation, enable mass personalization, and enforce design consistency.

Unlike a regular editable design, a template introduces structure through placeholders and constraints, allowing you to define which elements users can change and how. Templates support static output formats (like PNG, PDF) — and MP4 video with the native `@cesdk/node-native` package — and can be created or applied using the API.

Templates are a core part of enabling design automation, personalization, and streamlined workflows in any app that includes creative functionality.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](https://img.ly/docs/cesdk/archive/v1.84/node/get-started/overview-e18f40/)

## Why Use Templates?

Templates are a powerful tool for:

- Maintaining **brand consistency** across all user-generated designs.
- **Scaling** asset creation for campaigns, catalogs, or print products.
- Providing a **guided experience** where users adapt content without starting from scratch.

They are ideal for use cases like:

- Personalized marketing campaigns
- Dynamic social media ads
- Product catalogs and e-commerce visuals
- Custom print materials and photo books

## Ways to Create Templates

You can create templates from scratch or by importing an existing template.

**From Scratch:** Start a new project and design a scene with the intent of turning it into a template. You can define variables, placeholders, and constraints directly in the editor.

**Import Existing Designs:** If you already have assets created in other tools, you can import them as templates.

| Format   | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `.idml`  | InDesign (via `@imgly/idml-importer`)                           |
| `.psd`   | Photoshop (via `@imgly/psd-importer`)                           |
| `.pdf`   | PDF (via `@imgly/pdf-importer`)                                 |
| `.pptx`  | PowerPoint (via `@imgly/pptx-importer`)                         |
| `.imgly` | CE.SDK Native (scene or archive, detected automatically)        |
| `.scene` | CE.SDK Native (scene extension)       |
| `.zip`   | CE.SDK Native (archive extension)     |

Non-native design files are converted into editable CE.SDK scenes by dedicated
importer packages rather than uploaded as media assets.

> **Note:** The `.idml`, `.psd`, `.pdf` and `.pptx` importers ship as separate packages
> that you install in addition to CE.SDK. These importer packages run only in
> the browser and in Node.js. They are not available on any other platform,
> including Android, iOS, Flutter and React Native.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs to generate
> scenes programmatically.

These imported designs can then be adapted into editable, structured templates inside CE.SDK.

## Dynamic Content in Templates

Templates support dynamic content to enable data-driven generation of assets. CE.SDK provides several mechanisms:

- **Text Variables**: Bind text elements to dynamic values (e.g., user names, product SKUs).
- **Image Placeholders**: Reserve space for images to be inserted later.

This makes it easy to generate hundreds or thousands of personalized variations from a single design.

## Controlling Template Editing

Templates in CE.SDK offer powerful tools for controlling the editing experience:

- **Editing Constraints**: Lock specific properties such as position, style, or content of elements.
- **Locked Templates**: Prevent any edits outside allowed fields to protect design integrity.
- **Fully Editable Templates**: Allow unrestricted editing for power users or advanced workflows.
- **Form-Based Editing**: Build a custom editing interface for users to fill in variables and placeholders via input forms (a ready-made UI is not currently provided, but can be built using our APIs).

These options let you strike a balance between creative freedom and design control.

## Working with Templates Programmatically

You can manage templates using the API:

- **Programmatic Access**: Use the SDK’s APIs to create, apply, or modify templates as part of an automated workflow.
- **Asset Library Integration**: Templates can appear in the asset library, allowing users to browse and pick templates visually.
  - The Asset Library's appearance and behavior can be fully customized to fit your app’s needs.

## Managing Templates

Templates are saved and reused just like any other CE.SDK asset:

- **Save Templates** to a *Template Library*.
- **Edit or Remove** existing templates from your asset library.
- Templates are saved as Scene (`.scene`) or Archive (`.zip`) files and can be loaded across all platforms supported by CE.SDK (Web, Mobile, Server, Desktop)

## Default and Premium Templates

- **Default Templates**: CE.SDK may include a small number of starter templates depending on your configuration.
- **Premium Templates**: IMG.LY offers a growing collection of professionally designed templates available for licensing.
- Templates can be imported, customized, and used directly within your app.

Check your license or speak with our team for details on accessing premium templates.

## Templates as Assets

Templates are treated as **assets** in CE.SDK. That means:

- They can be included in local or remote asset libraries.
- They can be shared, versioned, and indexed using the same systems as images or videos.
- You can apply your own metadata, tags, and search capabilities to them.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
