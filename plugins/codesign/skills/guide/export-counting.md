> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Export Counting](./export-counting.md)

---

Some CE.SDK plans use usage-based pricing that meters exports. This page defines exactly which operations count as an export, when an export is recorded, and which data is collected along with it. For an overview of licensing options, see [Licensing](./licensing.md). For a broader look at data collection and privacy, see [Security](./security.md).

## What Counts as an Export

CE.SDK records one export event per call to an export API. This applies to:

- Exporting a block to an image format such as PNG, JPEG, WebP or TGA
- Exporting to PDF or SVG
- Exporting raw pixel data through the export API
- Exporting with a color mask
- Exporting a video

Each call produces exactly one event, regardless of the content being exported. The engine doesn't distinguish between a "final" export and any other use of the export API. For example, if you call the export API to generate a thumbnail of a design programmatically, that call counts as an export like any other.

## What Doesn't Count

The following operations never record an export event:

- **Live rendering in the editor.** The canvas preview your users see while editing isn't an export.
- **Saving scenes.** Saving a scene to a string or archive—including autosaves and drafts—isn't an export. Only the export APIs count.
- **Built-in thumbnail APIs.** The engine's thumbnail generation APIs, such as video and audio thumbnail sequences and the page thumbnails shown in the editor UI, don't go through the export pipeline and aren't counted.
- **Audio-only exports.** Exporting audio doesn't currently record an export event.

## When an Export Is Counted

The moment an export is recorded differs between still and video exports:

- **Images and PDFs** are counted after the export completes successfully. A failed export—for example due to an invalid block or an encoding error—isn't counted.
- **Videos** are counted when encoding starts. A video export that fails or is canceled during encoding still counts.

An export is counted when the export API call executes—not when a file is downloaded, uploaded or attached to a business event. There is no built-in option to defer counting to a later point such as a checkout. If you want exports to align with a business event, structure your integration so the export API is only called at that point.

## Multi-Page Documents

- **PDF:** Exporting multiple pages in a single call produces one PDF file and one export event. The event includes the number of pages exported and the dimensions of the largest page.
- **Image formats:** Each page requires its own export call, so exporting a multi-page document as images produces one event per page.

## Multiple Formats

Each export call is counted separately. Exporting the same design once as a PDF and once as a PNG produces two export events, one per format.

## Development, Staging and Production

CE.SDK doesn't distinguish between environments. A license key can be used across development, staging and production, and exports are counted the same way in all of them.

## Server-Side Exports and Renderer

The same counting rules apply on every platform. Exports performed with the Node.js SDK or other server-side integrations are counted under the same definition as client-side exports.

The [CE.SDK Renderer](#broken-link-7f3e9a) uses the same export counting and additionally sends periodic heartbeats to track the number of active instances, as described in the [Security](./security.md) documentation.

## What Data Is Collected

An export event contains only technical metadata—never your content. Image export events include the media type, format, resolution and page count. Video export events include the media type, format, resolution, frame rate and duration. Events are associated with the user ID (if provided by your integration), device ID and session ID described in the [Security](./security.md) documentation.

The user ID is transmitted exactly as your integration provides it and is used solely to deduplicate users when counting monthly active users. It doesn't need to be a real identifier: if you want to keep your internal user IDs private, pass a hashed or otherwise opaque value instead—deduplication works just as well, as long as the value is unique and stable per user.

Export events are only sent when tracking is enabled for your license. Enterprise licenses with offline validation can opt out of tracking entirely; [contact our sales team](https://img.ly/forms/contact-sales) to explore these options.

## Export Counts and Billing

Export events are the technical metering primitive. How those counts map to your bill—which tiers apply and how usage is aggregated—is defined by your plan and contract, not by the SDK. If you have questions about how exports are billed under your agreement, [contact our sales team](https://img.ly/forms/contact-sales).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support