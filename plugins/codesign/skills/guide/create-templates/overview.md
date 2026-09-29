> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Overview](./create-templates/overview.md)

---

In CE.SDK, a *template* is a reusable, structured design that defines editable areas and constraints for end users. Templates can be based on static visuals or video compositions and are used to guide content creation, enable mass personalization, and enforce design consistency.

Unlike a regular editable design, a template introduces structure through placeholders and constraints, allowing you to define which elements users can change and how. Templates support static output formats (like PNG, PDF) — and MP4 video with the native `@cesdk/node-native` package — and can be created or applied using the API.

Templates are a core part of enabling design automation, personalization, and streamlined workflows in any app that includes creative functionality.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](./get-started/overview.md)

These imported designs can then be adapted into editable, structured templates inside CE.SDK.

## Dynamic Content in Templates

Templates support dynamic content to enable data-driven generation of assets. CE.SDK provides several mechanisms:

- **Text Variables**: Bind text elements to dynamic values (e.g., user names, product SKUs).
- **Image Placeholders**: Reserve space for images to be inserted later.

This makes it easy to generate hundreds or thousands of personalized variations from a single design.

## Working with Templates Programmatically

You can manage templates using the API:

- **Programmatic Access**: Use the SDK’s APIs to create, apply, or modify templates as part of an automated workflow.
- **Asset Library Integration**: Templates can appear in the asset library, allowing users to browse and pick templates visually.
  - The Asset Library's appearance and behavior can be fully customized to fit your app’s needs.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support