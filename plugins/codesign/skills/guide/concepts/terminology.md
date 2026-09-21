> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Terminology](./concepts/terminology.md)

---

A reference guide to the core terms and concepts used throughout CE.SDK documentation.

CE.SDK uses consistent terminology across all platforms. Understanding what we call things helps you navigate the API, read documentation efficiently, and communicate effectively with other developers working on CE.SDK integration.

## Core Architecture

### Engine

All operations—creating scenes, manipulating blocks, rendering, and exporting—go through the *Engine*. Initialize it once and use it throughout your application's lifecycle.

### Scene

The root container for all design content. A *Scene* contains *Pages*, which contain *Blocks*. Only one *Scene* can be active per *Engine* instance. You can create a *Scene* programmatically or load one from a file.

*Scenes* support both static designs (social posts, print materials, graphics) and time-based content (duration, playback time, animation).

See [Scenes](./concepts/scenes.md) for details.

### Page

*Pages* are containers within a *Scene* that hold content *Blocks* (see below) and define working area dimensions.

For static designs, pages are individual artboards. For video editing, pages are time-based compositions where *Blocks* are arranged across time. See [Pages](./concepts/pages.md) for details.

### Block

The fundamental building unit in CE.SDK. Everything visible in a design is a *Block*—images, text, shapes, graphics, audio, video—and even *Pages* themselves. *Blocks* form a parent-child hierarchy.

Each *Block* has two identifiers:

- **DesignBlockId**: A numeric handle (integer) used in API calls
- **UUID**: A stable string identifier that persists across save and load operations

See [Blocks](./concepts/blocks.md) for details.

## Block Anatomy

Modify a *Block's* appearance and behavior by attaching *Fills*, *Shapes*, and *Effects*. Most of these modifiers must be created separately and then attached to a *Block*.

### Fill

*Fills* cover the surface of a *Block's* shape:

- **Color Fill**: Solid color
- **Gradient Fill**: Linear, radial, or conical gradients
- **Image Fill**: Image content
- **Video Fill**: Video content

See the [Color Fills](./fills/color.md), [Gradient Fills](./fills/gradient.md), [Image Fills](./fills/image.md), and [Video Fills](./fills/video.md) guides.

### Shape

*Shapes* define a *Block's* outline and dimensions, determining the silhouette and how the *Fill* is clipped. *Shape* types include:

- **Rect**: Rectangles and squares
- **Ellipse**: Circles and ovals
- **Polygon**: Multi-sided shapes
- **Star**: Star shapes with configurable points
- **Line**: Straight lines
- **Vector Path**: Custom vector shapes

Like *Fills*, *Shapes* are created separately and attached to *Blocks*. See [Shapes](./shapes.md) for details.

### Effect

*Effects* are non-destructive visual modifications applied to a *Block*. Multiple *Effects* can be stacked. *Effect* categories include:

- **Adjustments**: Brightness, contrast, saturation, and other image corrections
- **Filters**: LUT-based color grading, duotone
- **Stylization**: Pixelize, posterize, half-tone, dot pattern, linocut, outliner
- **Distortion**: Liquid, mirror, shifter, cross-cut, extrude blur
- **Focus**: Tilt-shift, vignette
- **Color**: Recolor, green screen (chroma key)
- **Other**: Glow, TV glitch

The order determines how multiple effects attached to a single block interact. See [Filters and Effects](./filters-and-effects.md) for details.

### Blur

A modifier that reduces sharpness. *Blur* types include:

- **Uniform Blur**: Even blur across the entire block
- **Radial Blur**: Circular blur from a center point
- **Mirrored Blur**: Blur with reflection

> **Note:** **Blur has a dedicated API because it composites differently than other effects.** While most effects like brightness or saturation operate only on a block's own pixels, blur needs to sample pixels from the surrounding area to calculate the blurred result. This means blur interacts with the scene's layering and transparency in ways other effects don't—when you blur a partially transparent block, the engine must handle how that blur blends with whatever content sits behind it.

See [Blur](./filters-and-effects/blur.md) for details.

### Drop Shadow

A built-in block property (not an *Effect*) that renders a shadow beneath blocks. *Drop Shadow* has dedicated API methods for enabling, color, offset, and blur radius.

> **Warning:** Unlike effects, drop shadow is configured directly on the block rather than created and attached separately.

## Block Handling

These terms describe how *Blocks* are categorized and identified.

### Type

The built-in *Type* defines a *Block's* core behavior and available properties. *Type* is immutable—you choose it when creating the *Block*.

- `//ly.img.ubq/graphic` — Visual block for images, shapes, and graphics
- `//ly.img.ubq/text` — Text content
- `//ly.img.ubq/audio` — Audio content
- `//ly.img.ubq/page` — Page container
- `//ly.img.ubq/scene` — Root scene container
- `//ly.img.ubq/track` — Video timeline track
- `//ly.img.ubq/stack` — Stack container for layering
- `//ly.img.ubq/group` — Group container for organizing blocks
- `//ly.img.ubq/camera` — Camera for scene viewing
- `//ly.img.ubq/cutout` — Cutout/mask block
- `//ly.img.ubq/caption` — Caption/subtitle block
- `//ly.img.ubq/captionTrack` — Track for captions

The *Type* determines which properties and capabilities a *Block* has.

### Kind

A custom string label you assign to categorize *Blocks* for your application. Unlike *Type*, *Kind* is mutable and application-defined. Changing the *Kind* has no effect on appearance or behavior at the engine level. You can query and search for *Blocks* by *Kind*. Common uses:

- Categorizing template elements ("logo", "headline", "background")
- Filtering blocks for custom UI
- Automation workflows that process blocks by purpose

### Property

A configurable attribute of a *Block*. *Properties* have types (`Bool`, `Int`, `Float`, `String`, `Color`, `Enum`) and paths like `text/fontSize` or `fill/image/imageFileURI`.

Access *Properties* using type-specific getter and setter methods. Each *Block* type exposes different properties, which you can discover programmatically. See [Blocks](./concepts/blocks.md) for details.

## Assets and Resources

### Asset

Think of *Assets* as media items that you can provide to your users: images, videos, audio files, fonts, stickers, or templates—anything that can be added to a design. *Assets* have metadata including:

- **ID**: Unique identifier within an asset source
- **Label**: Display name
- **Meta**: Custom metadata (URI, dimensions, format)
- **Thumbnail URI**: Preview image URL

*Assets* are provided by *Asset Sources* and added through the UI or programmatically.

### Asset Source

A provider of *Assets*. *Asset Sources* can be built-in (like the default sticker library) or custom. *Asset Sources* implement a query interface returning paginated results with search and filtering.

- **Local Asset Source**: Assets defined in JSON, loaded at initialization
- **Remote Asset Source**: Custom implementation fetching from external APIs

Register *Asset Sources* with the *Engine* to make *Assets* available throughout your application.

### Resource

Loaded data from an *Asset* URI. When you reference an image or video URL in a *Block*, the *Engine* fetches and caches the *Resource*. *Resources* include binary data and metadata for rendering. See [Resources](./concepts/resources.md) for details.

### Buffer

A resizable container for arbitrary binary data. *Buffers* are useful for dynamically generated content that doesn't come from a URL, such as synthesized audio or programmatically created images.

Create a *Buffer*, write data to it, and reference it by URI in *Block* properties. *Buffer* data is not serialized with scenes and changes cannot be undone. See [Buffers](./concepts/buffers.md) for details.

## Templating and Automation

These terms describe dynamic content and reusable designs.

### Template

A reusable design with predefined structure and styling. *Templates* typically contain *Placeholders* and *Variables* that users customize while maintaining overall layout and branding.

*Templates* are scenes saved in a format that can be loaded and modified.

### Placeholder

A *Block* marked for content replacement. When a *Block's* placeholder property is enabled, it signals that the *Block* expects user-provided content—an image drop zone or editable text field.

*Placeholders* indicate which parts of a design should be customized versus fixed. See [Placeholders](./create-templates/add-dynamic-content/placeholders.md) for details.

### Variable

A named value referenced in text blocks using `{{variableName}}` syntax. *Variables* enable data-driven design generation by populating templates with dynamic content.

Define *Variables* at the scene level and reference them in text blocks. When a *Variable* value changes, all referencing text blocks update automatically. See [Text Variables](./create-templates/add-dynamic-content/text-variables.md) for details.

## Permissions and Scopes

These terms relate to controlling what operations are allowed.

### Scope

A permission setting controlling whether specific operations are allowed on a *Block*. *Scopes* enable fine-grained control over what users can modify—essential for template workflows where some elements should be editable and others locked.

Common scopes:

- `layer/move` — Allow or prevent moving
- `layer/resize` — Allow or prevent resizing
- `layer/rotate` — Allow or prevent rotation
- `layer/visibility` — Allow or prevent hiding
- `lifecycle/destroy` — Allow or prevent deletion
- `editor/select` — Allow or prevent selection

Enable or disable *Scopes* per *Block* to create controlled editing experiences. See [Lock Design Elements](./create-templates/lock.md) for details.

### Role

A preset collection of *Scope* settings. CE.SDK defines two built-in *Roles*:

- **Creator**: Full access to all operations, for template authors
- **Adopter**: Restricted access for end-users customizing templates

*Roles* provide a convenient way to apply consistent permission sets.

## Layout and Units

These terms relate to positioning and measurement.

### Design Unit

The measurement unit for dimensions in a *Scene*. The choice affects how positions, sizes, and exports are interpreted. Options:

- **Pixel**: Screen pixels, default for digital designs
- **Millimeter**: Metric measurement for print
- **Inch**: Imperial measurement for print

Set the design unit at the scene level—all dimension values are interpreted in that unit. See [Design Units](./concepts/design-units.md) for details.

### DPI (Dots Per Inch)

Resolution setting affecting export quality and unit conversion. Higher DPI produces larger exports with more detail. The default is 300 DPI, suitable for print-quality output.

DPI matters when working with physical units (millimeters, inches) as it determines how measurements translate to pixel dimensions during export.

## Operating Modes

These terms describe how CE.SDK runs.

### Scene Capabilities

Every *Scene* supports the full range of features:

- **Static designs**: Content arranged spatially on pages.
- **Video editing**: Blocks can have duration, time offset, playback time, and animation properties.

See [Scenes](./concepts/scenes.md) for details.

### Headless Mode

Running CE.SDK without the built-in UI. Used for:

- Server-side rendering and export
- Automation pipelines
- Custom UI implementations
- Batch processing

In *Headless Mode*, you work directly with *Engine* APIs without the visual editor. See [Headless Mode](./concepts/headless-mode.md) for setup.

## Events and State

These terms relate to monitoring changes.

### Event / Subscription

A callback mechanism for reacting to changes in the *Engine*. Subscribe to events and receive notifications when state changes. Common events:

- Selection changes
- Block state changes
- History (undo/redo) changes

Subscriptions return an unsubscribe function to call when you no longer need notifications. See [Events](./concepts/events.md) for details.

### Block State

The current status of a *Block* indicating readiness or issues:

- **Ready**: Normal state, no pending operations
- **Pending**: Operation in progress, with optional progress value (0-1)
- **Error**: Operation failed, with error type (`ImageDecoding`, `VideoDecoding`, `FileFetch`, etc.)

*Block State* reflects the combined status of the *Block* and its attached *Fill*, *Shape*, and *Effects*.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support