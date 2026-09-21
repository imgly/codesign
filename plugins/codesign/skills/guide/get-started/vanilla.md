> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Node.js](./get-started/vanilla.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)
Engine** in a **Node.js environment using Vanilla JavaScript (CommonJS or ES
modules)**, enabling you to process images and designs programmatically. By
the end of this guide, you’ll have a working Node.js script that **loads a
scene, modifies it, and exports it as an image**.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Need to perform **image editing and scene manipulation programmatically** in a **Node.js** environment using **plain JavaScript**.
- Want to use **CE.SDK’s Node.js package** for automation or backend processing **without TypeScript or additional frameworks**.
- Prefer **a script-based approach** for **design generation and image exports**.

## What You’ll Achieve

- Install and configure **CE.SDK Engine** for **Node.js**.
- Load and manipulate **design scenes** programmatically using **plain JavaScript**.
- Export designs as **PNG images** without requiring a UI.

> **Note:** Please note that the Node.js executable is not capable of processing or
> exporting video.

## Prerequisites

Before getting started, ensure you have:

- **Node.js v22 or later** installed. ([Download Node.js](https://nodejs.org/)).
- A valid **CE.SDK license key** - Required for engine initialization. [Start a free trial](https://img.ly/forms/free-trial) to get your license key.

## Step 1: Set Up Your Project

Create a new project folder and navigate into it:

```bash
mkdir my-cesdk-node-project
cd my-cesdk-node-project
```

Next, create a new `index.js` file manually or by running:

```bash
touch index.js
```

## Step 2: Install CE.SDK for Node.js

Run the following command to install the required packages:

```bash
npm install @cesdk/node@$UBQ_VERSION$
```

Your project structure should now look like this:

```
/my-cesdk-node-project
  ├── node_modules
  ├── index.js
  └── package.json
```

For your `index.js`, you can either use ES modules or CommonJS. Both versions are shown below.

### index.js (ES Modules)

If your project is using **ES modules**, change the `package.json` file to include:

```json
{
  "type": "module"
}
```

Then, modify **`index.js`** to use ES modules **(import syntax)**:

```js
import fs from 'fs/promises';
import CreativeEngine from '@cesdk/node';

// Configuration for the engine
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
};

try {
  // Initialize CE.SDK Engine
  const engine = await CreativeEngine.init(config);
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
    await fs.writeFile('./example-output.png', Buffer.from(arrayBuffer));

    console.log('Export completed: example-output.png');
  } catch (error) {
    console.error('Error processing scene:', error);
  } finally {
    // Dispose of the engine to free resources
    engine.dispose();
  }
} catch (initError) {
  console.error('Failed to initialize CE.SDK Engine:', initError.message);
  process.exit(1);
}
```

### index.js (CommonJS)

Modify your `index.js` file to initialize CE.SDK Engine and process a scene using CommonJS **(require syntax)**:

```js
const fs = require('fs/promises');
const CreativeEngine = require('@cesdk/node');

const { MimeType } = CreativeEngine;

// Configuration for the engine
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
};

// Initialize CE.SDK Engine
CreativeEngine.init(config)
  .then(async engine => {
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
      await fs.writeFile('./example-output.png', Buffer.from(arrayBuffer));

      console.log('Export completed: example-output.png');
    } catch (error) {
      console.error('Error processing scene:', error);
    } finally {
      // Dispose of the engine to free resources
      engine.dispose();
    }
  })
  .catch(initError => {
    console.error('Failed to initialize CE.SDK Engine:', initError.message);
    process.exit(1);
  });
```

## Step 3: Run the Script

Once everything is set up, run your script using:

```bash
node index.js
```

This code processes the scene and generates an image file named **`example-output.png`** in your project directory.

## Troubleshooting & Common Errors

**❌ Error: `fetch is not defined`**

- If using **Node.js v16 or lower**, this error can occur. We only support Node.js v22 and above.

**❌ Error: `Invalid license key`**

- Verify that your **license key** is correct and not expired.

**❌ Error: `SyntaxError: Cannot use import statement outside a module`**

- If using **ES modules**, ensure `"type": "module"` is set in `package.json`.
- If using **CommonJS**, ensure `require()` is used instead of `import`.

## Development Best Practices

- **Always handle initialization errors** - CE.SDK initialization can fail for various reasons. Common reasons are:

- Invalid license

- Network issues

- **Dispose resources** - Always call `engine.dispose()` in a `finally` block to free memory.

- **Use async/await** - The async/await pattern is generally cleaner than promise chains for CE.SDK operations.

## Next Steps

Congratulations! You’ve successfully integrated **CE.SDK Engine in Node.js** using **plain JavaScript**. Next, explore:

- [Serve assets from your server](./serve-assets.md)
- [Import media](./import-media/concepts.md)
- [Automating creative workflows](./automation/overview.md)
- [Running on AWS Lambda](./get-started/vanilla-aws-lambda.md)



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support