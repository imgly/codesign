> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Concepts](./import-media/concepts.md)

---

Understand the foundational architecture of CE.SDK's asset system and how asset sources organize content across platforms.

Asset sources are CE.SDK's content delivery architecture. Instead of hardcoding asset knowledge into the engine, CE.SDK uses a modular system where any content can be provided through a standardized interface. This decouples what assets are available from how they're discovered and applied.

```
 CROSS-PLATFORM ENGINE (engine.asset API)
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   findAssets()    addSource()    addLocalSource()    apply()            │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                 │
│  │    Custom    │   │    Local     │   │  JSON-Based  │                 │
│  │   Sources    │   │   Sources    │   │   Sources    │                 │
│  ├──────────────┤   ├──────────────┤   ├──────────────┤                 │
│  │ Your API     │   │ User Uploads │   │ Built-in     │                 │
│  │ Database     │   │ Collections  │   │ Asset Packs  │                 │
│  └──────────────┘   └──────────────┘   └──────────────┘                 │
│                                                                         │
│  Identical across Web, iOS, Android, and server environments            │
└─────────────────────────────────────────────────────────────────────────┘
```

This guide covers the foundational concepts of asset sources. For implementation details, see the linked guides at the end.

## Asset Source Fundamentals

An asset source provides content to the engine through a common interface. Every source has a unique identifier (e.g., `ly.img.image`, `ly.img.sticker`) and implements methods for discovering and applying assets.

Sources support:

- **Query-based discovery** with pagination and filtering
- **Optional grouping** (e.g., sticker groups: "emoji", "doodle", "hand")
- **Metadata** including credits, licenses, and format information

Sources are content-agnostic—images, fonts, templates, and custom content all use the same pattern.

## Content Organized as Asset Sources

Asset sources handle virtually all reusable creative content:

| Category   | Examples                                 |
| ---------- | ---------------------------------------- |
| Media      | Images, videos, audio clips              |
| Graphics   | Stickers, shapes, vectors, icons         |
| Typography | Fonts, typefaces, text presets           |
| Colors     | Color palettes, spot colors              |
| Effects    | Blur types, filters, LUT effects         |
| Templates  | Design templates, page presets           |
| Custom     | User uploads, remote APIs, your own data |

Built-in sources include `ly.img.image`, `ly.img.sticker`, `ly.img.template`, `ly.img.typeface`, `ly.img.filter.lut`, `ly.img.blur`, `ly.img.effect`, and more.

## Types of Asset Sources

There are three ways to provide assets to CE.SDK:

### Custom Sources

Implement the source interface to connect any backend—database, API, or custom system. Custom sources provide full control over discovery and application logic. Use custom sources when you need to:

- Connect to your existing content management system
- Implement custom search or filtering logic
- Control how assets are applied to the scene

### Local Sources

Managed by the engine with dynamic add/remove operations. Local sources are suitable for runtime asset management or collections that change during processing. The engine handles storage and retrieval.

### JSON-Based Sources

Pre-defined asset collections loaded from JSON files. All built-in asset packs use this approach. JSON sources are ideal for static content that doesn't change frequently.

## Server Environment Considerations

In server-side rendering scenarios, asset sources operate identically to browser environments at the engine API level. The `engine.asset` API provides the same methods for registering sources, querying assets, and applying them to scenes.

Server environments typically use asset sources for:

- **Batch processing** — Loading templates and applying assets programmatically
- **Dynamic content generation** — Populating designs with content from databases or APIs
- **Automated workflows** — Processing user-uploaded assets through custom sources

Since server environments are headless, there's no UI layer to configure. You work directly with the engine's asset API to register sources, query assets, and apply them to scenes programmatically.

## Cross-Platform Architecture

Asset sources use the `engine.asset` API consistently across all platforms (Web, iOS, Android) and server environments.

All platforms support:

- Custom source registration
- JSON-based asset loading
- Local asset management
- Group-based organization
- Event subscriptions (source added, removed, updated)

Code patterns transfer directly between platforms with only syntax changes.

## Asset Structure

Each asset contains:

- **ID** — Unique identifier within the source
- **Meta** — URI, thumbnail, MIME type, dimensions, block type hints
- **Label** — Localized display name
- **Tags** — Searchable keywords (localized)
- **Groups** — Category membership
- **Context** — Source reference for tracking origin

The engine uses metadata hints (`blockType`, `fillType`, `shapeType`) to determine what block type to create when applying an asset.

## Discovery and Application

Assets are discovered through queries supporting pagination, text search, tag/group filtering, and sorting. When applied, assets either create new blocks or modify existing ones. Sources can customize application behavior or use the engine's default implementation.

## Source Lifecycle Events

The engine emits events when sources change: added, removed, or contents updated. Subscribe to these events to keep processing logic synchronized with available content.

## Troubleshooting

Common conceptual misunderstandings:

- **Expecting sources to filter themselves** — Sources return all matching assets; your code determines what to process.
- **Mixing source types** — Custom sources (your code), local sources (engine-managed), and JSON sources (static files) serve different purposes. Choose based on whether you need dynamic backend connections, runtime asset management, or static asset packs.
- **Not disposing the engine** — In server environments, always call `engine.dispose()` when finished to free resources.

## API Reference

| Method                                | Category          | Purpose                                                           |
| ------------------------------------- | ----------------- | ----------------------------------------------------------------- |
| `engine.asset.addSource()`            | Source Management | Register a custom asset source with discovery and apply callbacks |
| `engine.asset.addLocalSource()`       | Source Management | Create an engine-managed source for dynamic asset add/remove      |
| `engine.asset.findAssets()`           | Discovery         | Query assets with pagination, search, filtering, and sorting      |
| `engine.asset.apply()`                | Application       | Apply an asset to the active scene, creating a configured block   |
| `engine.asset.onAssetSourceAdded()`   | Events            | Subscribe to source registration events                           |
| `engine.asset.onAssetSourceRemoved()` | Events            | Subscribe to source removal events                                |
| `engine.asset.onAssetSourceUpdated()` | Events            | Subscribe to source content change events                         |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support