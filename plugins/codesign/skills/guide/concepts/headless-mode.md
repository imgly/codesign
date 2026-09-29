> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Headless Mode](./concepts/headless-mode.md)

---

CreativeEditor SDK (CE.SDK) **Headless Mode for Node.js** lets your backend render scenes and exports without ever mounting the browser UI.

The `@cesdk/node` package bundles CE.SDK’s features so you can drive the Engine APIs from:

- Queues
- Cron jobs
- Serverless functions
- Etc.

You orchestrate the same actions a user can do from the UI using the CreativeEgine, which powers all CE.SDK features.

## Common Use Cases

- **Automated pipelines:** Generate batches of personalized assets from templates.
- **Server-rendered previews:** Produce thumbnails or proofs before a user ever opens the editor.
- **Custom tooling:** Embed CE.SDK logic inside CLI tools, workers, or queue processors.
- **Compliance and governance:** Enforce template rules during backend render jobs without exposing editing controls.

### When to Use Headless Mode

| Scenario | Headless (Node.js) | UI-Based Editor |
| -------- | :----------------: | :-------------: |
| Cron or queue-driven exports | ✅ | ❌ |
| Rendering without a browser | ✅ | ❌ |
| Letting users tweak the layout | ❌ | ✅ |
| Mixing custom UI with CE.SDK tools | ✅ | Hybrid |

## How Headless Mode Works on Node.js

`@cesdk/node` imports the CreativeEngine runtime for Node.js, allowing you to execute the same Engine API calls. Without needing a DOM, your script can run server-side to:

- Start the engine.
- Edit and export assets.

You are responsible for:

- Handling file Input/Output.
- Monitoring memory.
- Disposing of the engine when the job ends.

### Available Features

- Create/edit scenes, pages, and blocks programmatically.
- Load templates and process scenes programmatically.
- Export compositions (complete edited scenes) in your desired format.

### Requirements to Run CreativeEngine on Node.js

- **Node.js 22+** (or the matching runtime for your serverless provider).
- **@cesdk/node@$UBQ\_VERSION$** installed locally: `npm install @cesdk/node@$UBQ_VERSION$`.
- A valid **CE.SDK license key**.
- A **base asset bundle** reachable from the runtime (CDN or self-hosted path). The CDN URLs shown below work for quick tests.

> **Tip:** For production, download the asset bundle and point `baseURL` to a local path or object storage bucket. This avoids CDN latency and keeps jobs self-contained.

## Quick Start: Initialize the Engine

To try out the CE.SDK headless mode:

1. Open/create a Node.js project.
2. Install the Node.js package:

```bash
npm install @cesdk/node@$UBQ_VERSION$
```

### 1. Create a CE.SDK Helper

Create a reusable script that does the following:

1. Awaits the engine once.
2. Loads the default assets
3. Keeps the promise alive for further calls.

```js title="CesdkHelper.js"
import CreativeEngine from '@cesdk/node';

// CE.SDK config
const defaultConfig = {
  license:
    process.env.LICENSE_KEY ??
    '<YOUR_CESDK_LICENSE_KEY>'
};

// Memorized initialization promise so initialization happens at most once at a time.
let enginePromise;

// Export the CE.SDK initialization to reuse it.
export async function getCreativeEngine(config = defaultConfig) {
  if (!enginePromise) {
    enginePromise = CreativeEngine.init(config).catch((error) => {
      enginePromise = undefined;
      throw error;
    });
  }

  return enginePromise;
}

export async function disposeCreativeEngine() {
  if (!enginePromise) {
    return;
  }

  const engine = await enginePromise;
  enginePromise = undefined;
  engine.dispose();
}

export function getCreativeEngineConfig() {
  return defaultConfig;
}

```

This pattern is ideal for:

- HTTP handlers
- Queue workers

Each invocation:

1. **Awaits** `getEngine()`.
2. **Reuses** the same instance.
3. **Disposes** of the engine when your process shuts down to release native resources.

> **Note:** * Replace `<YOUR_CESDK_LICENSE_KEY` with a **valid license key**.
> * Use `dotenv/config` to store your CE.SDK license key in a `.env` file to **avoid hard-coding** it it your scripts.

### 2. Reuse the Engine in a Script

You can now script actions using CE.SDK. In the following example, the script assembles a greeting card entirely on the server.

In your Node.js project:

1. Create a new script.
2. Import your helper along with the needed feature:

```js title="GreetingCard.js"
import { writeFile } from 'node:fs/promises';
import { disposeCreativeEngine, getCreativeEngine } from './creativeEngineHelper.js';
```

3. Copy-paste the following function:

```js title="GreetingCard.js"
async function buildGreeting() {
  // Wait for the Engine to be ready before executing the function
  const engine = await getCreativeEngine();

  try {
    // Create a scene and append it to the page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create an image block from a sample URL
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setPosition(imageBlock, 100, 100);
    engine.block.setWidth(imageBlock, 300);
    engine.block.setHeight(imageBlock, 300);
    engine.block.appendChild(page, imageBlock);

    // Create a text block
    const textBlock = engine.block.create('text');
    engine.block.setString(textBlock, 'text/text', 'Hello from Headless Mode!');
    engine.block.setPosition(textBlock, 100, 450);
    engine.block.setWidth(textBlock, 600);
    engine.block.appendChild(page, textBlock);
    
    // Set the format on export
    const exportResult = await engine.block.export(page, { mimeType: 'image/png' });
    const arrayBuffer = await exportResult.arrayBuffer();
    
    // Write the file on disk
    await writeFile('greeting-card.png', Buffer.from(arrayBuffer));
    console.log('Export complete: greeting-card.png');
  } catch (error) {
    console.error('Failed to export headless scene', error);
  } finally {
    // Dispose the Engine to free resources
    await disposeCreativeEngine();
  }
}

buildGreeting().catch((error) => {
  console.error('Unexpected failure', error);
  process.exitCode = 1;
});

```

4. Run the script `node ./<path-to-your-file>/GreetingCard.js`.
5. Check that your project contains the `greeting-card.png` file.

**The preceding script:**

- Calls the `CesdkHelper.js` helper to start the engine.
- Builds a scene containing:
  - An image
  - A text block.
- Exports the page to a PNG `Blob`
- Writes the image to the disk.
- Disposes of the engine.

## Go Further

- [Dig into the Node.js SDK reference](./what-is-cesdk.md) for every available Engine call.
- [Start a new Node.js headless project](./get-started/vanilla.md) with a complete project template.
- Need to mix headless logic with UI-driven editing? [Engine interface guides](./engine-interface.md) show hybrid patterns.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support