> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Bun](./get-started/bun.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)
Engine** in a **Node.js environment using Bun** as the package manager and
runtime. By the end of this guide, you’ll have a working Node.js script that
**loads a scene, modifies it, and exports it as an image** using **Bun’s fast
runtime and bundling capabilities**.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Need to **perform image editing and scene manipulation programmatically** in a **Node.js environment** using **Bun**.
- Want to use **CE.SDK’s Node.js package** for automation or backend processing **with a fast, modern runtime**.

## What You’ll Achieve

- Install and configure **CE.SDK Engine** for **Node.js using Bun**.
- Load and manipulate **design scenes** programmatically.
- Export designs as **PNG images** without requiring a UI.

## Prerequisites

Before getting started, ensure you have:

- [**Bun installed**](https://bun.sh/) (Download Bun).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

> **Warning:** Node.js executable isn't capable of processing or exporting video.

## Step 1: Set Up Your Project

Initialize your project with Bun, selecting "Blank" for the template:

```bash
bun init my-cesdk-bun-project
```

Your project structure should look like this:

```
/my-cesdk-bun-project
  ├── node_modules
  ├── .gitignore
  ├── bun.lock
  ├── index.ts
  ├── package.json
  ├── README.md
  └── tsconfig.json
```

## Step 2: Install CE.SDK for Node.js Using Bun

Navigate into your project folder and install the required packages:

```bash
# Install the CE.SDK Node.js package with Bun
bun add @cesdk/node
```

### index.ts (TypeScript with Bun)

Modify your `index.ts` file to initialize CE.SDK Engine and process a scene **using Bun**:

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script fails with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

```tsx
import { writeFile } from 'fs/promises';
import CreativeEngine from '@cesdk/node';

const { MimeType } = CreativeEngine as any;

// Configuration for the engine
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
};

// Initialize CE.SDK Engine
CreativeEngine.init(config).then(async engine => {
  console.log('CE.SDK Engine initialized');

  try {
    // Load a scene from a URL
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene',
    );

    // Find the first page in the scene
    const [page] = engine.block.findByType('page');

    // Export the scene as a PNG image
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
    });
    const arrayBuffer = await blob.arrayBuffer();

    // Save the exported image to the file system
    await writeFile('./example-output.png', Buffer.from(arrayBuffer));

    console.log('Export completed: example-output.png');
  } catch (error) {
    console.error('Error processing scene:', error);
  } finally {
    // Dispose of the engine to free resources
    engine.dispose();
  }
});
```

## Step 3: Run the Script Using Bun

Once everything is set up, run your script using:

```bash
bun run index.ts
```

This processes the scene and generates an image file named **`example-output.png`** in your project directory.

## Step 4: Optimize Your Bun Project

### 1. Using Bun’s Faster File System API

Bun includes a built-in **fs API** that performs better than Node.js. Replace your existing `index.ts` with this:

```tsx
import { write } from 'bun';
import CreativeEngine from '@cesdk/node';

const { MimeType } = CreativeEngine as any;

// Configuration for the engine
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
};

// Initialize CE.SDK Engine
CreativeEngine.init(config).then(async engine => {
  console.log('CE.SDK Engine initialized');

  try {
    // Load a scene from a URL
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene',
    );

    // Find the first page in the scene
    const [page] = engine.block.findByType('page');

    // Export the scene as a PNG image
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const arrayBuffer = await blob.arrayBuffer();

    // Save the exported image to the file system
    await write('./example-output.png', Buffer.from(arrayBuffer));

    console.log('Export completed: example-output.png');
  } catch (error) {
    console.error('Error processing scene:', error);
  } finally {
    // Dispose of the engine to free resources
    engine.dispose();
  }
});
```

### 2. Running the Bun Optimized Script

```bash
bun run index.ts
```

## Troubleshooting & Common Errors

**❌ Error: `fetch is not defined`**

- **Bun natively supports `fetch`**, so this error **should not occur** unless using an outdated version.

**❌ Error: `Invalid license key`**

- Verify that your **license key** is correct and not expired.

**❌ Error: `Cannot find module '@cesdk/node'`**

- Ensure that **@cesdk/node** is installed correctly using `bun add @cesdk/node`.

**❌ Error: `SyntaxError: Unexpected token 'import'`**

- Ensure your script is named **index.ts** for **TypeScript** support in Bun.

## Next Steps

Congratulations! You’ve successfully integrated **CE.SDK Engine in Node.js using Bun**. Next, explore:

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