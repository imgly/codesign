> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Deno](./get-started/deno.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)
Engine** in a **Node.js-compatible environment using Deno**, the secure and
modern runtime for JavaScript and TypeScript. By the end of this guide, you’ll
have a Deno script that **loads a scene, modifies it, and exports it as an
image**—all without a UI.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to **programmatically edit and export scenes** using CE.SDK in **Deno**.
- Prefer a **secure and modern runtime** with built-in TypeScript and native fetch support.
- Need to integrate CE.SDK into **server-side rendering, automation tools, or cloud functions** using Deno.

## What You’ll Achieve

- Install and configure **CE.SDK Engine** in a **Deno project**.
- Load and manipulate **design scenes** programmatically.
- Export scenes to **PNG images** without any UI.

## Prerequisites

Before getting started, ensure you have:

- **Deno installed**.
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).
- **Deno v1.28 or later** to ensure compatibility with npm packages.

> **Note:** Node.js executable isn't capable of processing or exporting video.

## Step 1: Initialize Your Deno Project

Create your project structure:

```bash
deno init my_project
```

Resulting in the following project structure:

```
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

## Step 2: Use CE.SDK Engine via npm Compatibility

In your `main.ts`, use Deno’s npm compatibility to load CE.SDK:

```tsx
// @deno-types="npm:@cesdk/node"
import CreativeEngine from 'npm:@cesdk/node';
import { writeFile } from 'node:fs/promises';

// Fix for TypeScript type resolution in Deno
const { MimeType } = CreativeEngine as any;

// CE.SDK configuration
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Enter your CE.SDK license key
};

try {
  const engine = await CreativeEngine.init(config);
  console.log('CE.SDK Engine initialized (Deno)');

  try {
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene',
    );

    const [page] = engine.block.findByType('page');

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const arrayBuffer = await blob.arrayBuffer();

    await writeFile('./example-output.png', new Uint8Array(arrayBuffer));
    console.log('Export completed: example-output.png');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    engine.dispose();
  }
} catch (initError) {
  console.error('Failed to initialize CE.SDK Engine:', initError);
}
```

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script fails with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

## Step 3: Run the Script

Run the script using Deno’s Node.js/npm compatibility by adding the necessary flags:

```bash
deno run \
  --allow-read \
  --allow-write \
  --allow-net \
  --unstable-ffi \
  main.ts
```

These flags are required to execute `main.ts` for the following reasons:

| Flag             | Required | Why                                                                                                        |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `--allow-read`   | Yes      | Grants permission to read from the file system. Useful if the engine loads local assets or template files. |
| `--allow-write`  | Yes      | Allows CE.SDK to write the exported image file (`example-output.png`) to disk.                             |
| `--allow-net`    | Yes      | Required to fetch remote assets and scenes (e.g., from `cdn.img.ly`).                                      |
| `--unstable-ffi` | Yes      | Enables WebAssembly FFI, which CE.SDK Engine depends on for core rendering and export features.            |

This processes the scene and generates an image file named `example-output.png` in your project directory.

## Troubleshooting & Common Errors

**❌ Error: `Cannot find module '@cesdk/node'`**

- Make sure you’re running with the `-unstable` flag and Deno v1.28 or later.
- Add `deno.json` or `import_map.json` if managing multiple npm dependencies.

**❌ Error: `Invalid license key`**

- Ensure your license key is correct and not expired.

**❌ TypeScript errors for `MimeType`**

- Use `CreativeEngine as any` or assert type manually to bypass missing type declarations.

## Next Steps

You’ve successfully integrated **CE.SDK Engine in Deno**. Now explore:

- [Using source sets](./import-media/source-sets.md)
- [Modifying text variables](./create-templates/add-dynamic-content/text-variables.md)
- [Defining placeholders](./create-templates/add-dynamic-content/placeholders.md)
- [Text styling](./text/styling.md)



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support