> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Key Concepts](./key-concepts.md)

---

CE.SDK is built on two distinct technical layers that work together seamlessly:

- **User Interface** — Pre-built editors optimized for different use cases
- **Engine Interface** — Core rendering and processing engine

![The different layers CE.SDK is made of, see description below.](https://img.ly/docs/cesdk/layers.png)

This intentional separation gives you powerful advantages:

1. **Cross-platform consistency** – The engine is cross-compiled to native web, iOS, Android, and Node.js, ensuring identical output everywhere
2. **Custom UI** – Build your own UI for simpler tools and workflows
3. **Headless automation** – Run the engine independently for automations and batch processing, both client-side and server-side

## Creative Engine

The Creative Engine powers all core editing operations. It handles rendering, processing, and manipulation across images, layouts, text, video, audio, and vectors.

**What the Engine Does:**

- Maintains the scene file (your structured content)
- Renders the canvas in real-time
- Handles block positioning and resizing
- Applies filters and effects to images
- Manages text editing and typography
- Controls templates with role-based permissions
- Displays smart guides and snap lines

Every engine capability is exposed through a comprehensive API, letting you build custom UIs, workflows, and automations.

## Headless / Engine only

Use the engine without any UI for powerful automation scenarios:

**Client-side automation**
Perfect for in-browser batch operations and dynamic content generation without server dependencies.

**Server-side automation with Node.js**
Use the [Node.JS SDK](./what-is-cesdk.md) for following scenarios:

- **High-resolution processing** – Edit on the client with preview quality, then render server-side with full-resolution assets
- **Bulk generation** – Create a large volume of design variations for variable data printing
- **Non-blocking workflows** – Let users continue designing while exports process in the background

**Server-side export with the CE.SDK Renderer**
When exporting complex graphics and videos, the [CE.SDK Renderer](#broken-link-7f3e9a) can make use of GPU acceleration and video codecs on Linux server environments.

**Plugin development**
When building CE.SDK plugins, you get direct API access to manipulate canvas elements programmatically.

## User Interface Components

CE.SDK includes pre-built UI configurations optimized for different use cases:

- **Photo editing** — Advanced image editing tools and filters
- **Video editing** — Timeline-based video editing and effects
- **Design editing** — Layout and graphic design tools (similar to Canva)
- **2D product design** — Apparel, postcards, and custom product templates

More configurations are coming based on customer needs.

## UI Customization

While UI configurations provide a solid foundation, you maintain control over the user experience:

- Apply **custom color schemes** and branding to match your product
- Add **custom asset libraries** with your own fonts, images, graphics, videos, and audio

The plugin architecture lets you add custom buttons and panels throughout the interface, ensuring the editor feels native to your product.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support