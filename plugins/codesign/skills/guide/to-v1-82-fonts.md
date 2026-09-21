> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Upgrading](./upgrade.md) > [To v1.82 (Fonts)](./to-v1-82-fonts.md)

---

Starting with v1.82, the typefaces bundled with CE.SDK ship as WOFF2 instead
of TTF and OTF. You get the same typefaces under the same names, in a bundle
about a third of the size. Most integrations need no changes at all, but a
scene that stores a font path pointing into the asset bundle you serve today
needs a one-time migration.

## What Changed

The `ly.img.typeface` asset source moved from TTF and OTF to WOFF2. Nothing else about it changed:

| | Before v1.82 | From v1.82 |
| --- | --- | --- |
| Typefaces offered | 50 | 50 |
| Fonts in the asset source | 274 | 274 |
| Font files on disk | 314 | 307 |
| Total size | 49 MB | 16 MB |
| File extension | `.ttf`, `.otf` | `.woff2` |
| Directory layout | unchanged | unchanged |

No typeface was added, removed, or renamed. Only the file extension differs, so
`ly.img.typeface/fonts/Archivo/static/Archivo/Archivo-Black.ttf` became
`ly.img.typeface/fonts/Archivo/static/Archivo/Archivo-Black.woff2`. The seven files that
disappeared were duplicates that no asset definition referenced.

The engine decodes WOFF2 on every platform it supports, so rendering, text layout, and metrics are
identical. The fallback fonts and the emoji font still ship as TTF.

> **Note:** **Mobile is not affected.** The iOS, Android, Flutter, and React Native SDKs still ship the
> previous asset version in v1.82. This guide applies to Web and Node.js.

## Does This Affect You?

Only scenes are affected, and only when the font path stored inside them resolves to a file that
no longer exists. Look at how your scenes reference fonts:

| Stored font URI | What happens |
| --- | --- |
| `https://cdn.img.ly/packages/imgly/cesdk-js/1.68.0/assets/…/Roboto-Light.ttf` | Keeps working. A published version keeps serving the files it shipped with. |
| `/ly.img.typeface/…/Archivo-Black.ttf`, resolved against your `baseURL` | Breaks once that base serves v1.82 assets. |
| `https://your-cdn.example.com/cesdk-assets/…/Archivo-Black.ttf`, where you replaced the bundle in place | Breaks. |
| `/extensions/ly.img.cesdk.fonts/…/Archivo-Black.ttf` from an older CE.SDK version | Keeps working. The engine repairs it for you, see below. |
| A font you host yourself, unrelated to `ly.img.typeface` | Untouched. |

The IMG.LY CDN serves each published version from its own path, so a scene that names a version
explicitly is safe:

```bash
# Versions before 1.82 serve .ttf
curl -I https://cdn.img.ly/packages/imgly/cesdk-js/1.81.0/assets/ly.img.typeface/fonts/Roboto/Roboto-Light.ttf   # 200

# 1.82 serves .woff2 instead
curl -I https://cdn.img.ly/packages/imgly/cesdk-js/1.82.0/assets/ly.img.typeface/fonts/Roboto/Roboto-Light.woff2 # 200
```

The CDN is for development. In production you serve the assets yourself, so read the paths above as
proof that a published file stays reachable, not as a configuration to copy. See
[Serve Assets](./serve-assets.md).

If you never set `baseURL`, you are on the default, which points at the exact version of CE.SDK you
load. The engine stores that resolved, version-pinned URL in the scene when a font is applied, so
scenes your editor wrote before the upgrade keep pointing at the assets of the version that wrote
them. There is nothing to do.

### Scenes That Repair Themselves

Scenes written before the `ly.img.typeface` asset source existed store a legacy font identifier
next to the file path, for example `//ly.img.cesdk.fonts/archivo_black`. The engine resolves those
identifiers against the registered typefaces when it loads the scene, and from v1.82 it ignores the
file extension while doing so. Such a scene picks up the WOFF2 file on its own, with no code on
your side.

Newer scenes store only the file path, so there is nothing for the engine to resolve them against.
Those are the ones you migrate.

## Find the Affected Scenes

Load a scene and print every font it references. Run this against a build that serves the v1.82
assets — any URI that still ends in `.ttf` or `.otf` and points into your own asset base needs
migrating.

```typescript
function sceneFontURIs(engine: CreativeEngine): Set<string> {
  const uris = new Set<string>();
  for (const text of engine.block.findByType('//ly.img.ubq/text')) {
    uris.add(engine.block.getString(text, 'text/fontFileUri'));
    for (const run of engine.block.getTextRuns(text)) {
      if (run.fontFileUri) uris.add(run.fontFileUri);
    }
  }
  return uris;
}

await engine.scene.loadFromString(sceneString);
console.log([...sceneFontURIs(engine)]);
```

Reading the text runs matters. A block whose paragraphs use different fonts stores one URI per run
in addition to the block-level one.

## Choose a Migration

Pick whichever fits how you deploy assets. The first needs no changes to your scenes.

> **Caution:** **Keep `baseURL` on the version of CE.SDK you load.** The engine resolves its `core` directory
> under `baseURL`, so an older `baseURL` also loads that release's WebAssembly and engine
> resources. Do not move `baseURL` back a version to keep the TTF files. Serve those files
> yourself instead, as below.

### Option 1: Keep Serving the Old Files

Add the v1.82 tree to your asset host without deleting the previous one. Old scenes keep finding
their TTF files, and new text picks up WOFF2 from the asset source. This costs disk space and
nothing else. For how to download and serve an asset bundle, see
[Serve Assets](./serve-assets.md).

### Option 2: Rewrite the Scenes

Migrate each scene once and save it back. `editor.relocateResource` changes a resource URL
everywhere it appears in the scene, both the block property and every text run, so the new path is
part of the next `saveToString`.

Drive the rewrite from the typeface asset source rather than from string replacement, so each font
lands on the URI the source actually serves:

```typescript
/** File name of a font URI, without its extension or variable-font fragment. */
const stem = (uri: string) =>
  uri.split('#')[0].split('/').pop()!.replace(/\.[^.]+$/, '');

async function migrateFontURIs(engine: CreativeEngine, assetBaseURL: string) {
  // What the registered typeface source serves right now.
  const { assets } = await engine.asset.findAssets('ly.img.typeface', {
    page: 0,
    perPage: 9999
  });
  const currentURIByStem = new Map<string, string>();
  for (const asset of assets) {
    for (const font of asset.payload?.typeface?.fonts ?? []) {
      currentURIByStem.set(stem(font.uri), font.uri);
    }
  }

  for (const uri of sceneFontURIs(engine)) {
    // Only touch fonts your own base serves. A version-pinned URL stays as it is.
    // Drop the second test if you also host fonts of your own at the site root.
    if (!uri.startsWith(assetBaseURL) && !uri.startsWith('/')) continue;

    const current = currentURIByStem.get(stem(uri));
    if (current && current !== uri) {
      engine.editor.relocateResource(uri, current);
    }
  }
}

await engine.scene.loadFromString(sceneString);
await migrateFontURIs(engine, 'https://your-cdn.example.com/cesdk-assets');
const migrated = await engine.scene.saveToString();
```

> **Caution:** **Do not rewrite `.ttf` to `.woff2` with a string replacement.** A scene often mixes font URIs
> from several sources, and versions before v1.82 serve no WOFF2 at all. Blindly changing the
> extension turns a URI that still resolves into a 404, which shows up as
> `FILE_FETCH_FAILED` on export. Matching against the asset source, and skipping URIs outside
> your own asset base, avoids both.

`relocateResource` keeps a variable-font fragment such as `#wght=700` on the URI it moves, so
variable fonts need no special handling.

### What a Missing Font Looks Like

A text block whose font cannot be fetched does not render its text, and an export fails rather than
producing a page with a hole in it:

```
The export was cancelled due to block 137363478 having an error:
FILE_FETCH_FAILED (/ly.img.typeface/fonts/Archivo/static/Archivo/Archivo-Black.ttf)
```

The URI in that message is the one to migrate.

## PDF Export

A PDF export that uses a WOFF2 font embeds the glyph outlines rather than the font program. WOFF
and variable fonts already behaved this way; from v1.82 the bundled typefaces do too. The rendered
output and text search are unchanged. Because the font program itself is not embedded, a PDF editor
cannot restyle that text with the original font. See [To PDF](./export-save-publish/export/to-pdf.md) for the export
options themselves.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support