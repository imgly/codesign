> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Design Generation](./automation/design-generation.md)

---

The CE.SDK for **Node.js** provides automated design generation to streamline production by populating templates with data. Use this to create tailored assets at scale for everything from ads to direct mail.

With IMG.LY, you can use templates to define dynamic elements. The generation process then populates these elements with:

- Real-time data
- User inputs

This guide shows you how to use the CE.SDK for programmatic design generation.

[Launch Web Demo](https://img.ly/showcases/cesdk/headless-design/web)

## What’s a Design Template

A **design template** is a pre-configured layout that includes placeholders for dynamic elements such as:

- Text
- Images
- Icons
- Background graphics
- Vector shapes
- Etc

These **placeholders** define where and how specific content appears in the final design.

## Populate a Template

The generation process **replaces** the placeholders with actual data to create a completed output.

### Create or Edit Templates

You can create or edit design templates programmatically in a Node.js app. Learn more in the [Create Templates guide](./create-templates.md).

### Dynamic Content Sources

Populate templates with data from sources such as:

- **JSON files:** Useful for batch operations where data is pre-prepared.
- **External APIs:** Ideal for real-time updates and dynamic integrations.
- **User Input:** Where the user directly provides data through a UI.

For detailed information on using and managing templates, see [Use Templates](./use-templates/overview.md).

### Data Merge Workflow

Below is a diagram illustrating how data is merged into a template to produce a final design:

![Template data merge process diagram showing how variables and assets flow into the final output](https://img.ly/docs/cesdk/./assets/schema.excalidraw.svg)

## Example Workflow

### 1. Prepare the Template

Start by designing a template with text variables. This scene example contains:

- A postcard template
- Placeholders for the recipient’s details

![Example postcard template with highlighted variable placeholders for name and address](https://img.ly/docs/cesdk/./assets/scene-example-backside.png)

### 2. Load the Template into the Editor

Initialize the CE.SDK and load your prepared template. The following example loads the sample scene from the IMG.LY CDN:

```ts example=basic-scene marker=cesdk-init-after
// Load a template from your server or a CDN
const sceneUrl =
  'https://cdn.img.ly/assets/demo/v4/ly.img.template/templates/cesdk_postcard_2.scene';
await engine.scene.load(sceneUrl);
```

### 3. Provide Data to Populate the Template

Populate your template with data from your chosen source:

```ts example=basic-scene marker=cesdk-init-after
// Option 1: Prepare your data as a JavaScript object
const data = {
  textVariables: {
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St.',
    city: 'Anytown',
  },
};
// Option 2: Fetch from an API
// const data = await fetch('https://api.example.com/design-data').then(res => res.json());
engine.variable.setString('first_name', data.textVariables.first_name);
engine.variable.setString('last_name', data.textVariables.last_name);
engine.variable.setString('address', data.textVariables.address);
engine.variable.setString('city', data.textVariables.city);
```

The source in the preceding example is a **JavaScript object**. You could read the same data from JSON to see the same result:

```json title="design-data.json"
{
  "textVariables": {
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St.",
    "city": "Anytown"
  }
}
```

### 4. Export the Final Design

After populating the template, export the final design in your preferred format:

```ts example=basic-scene marker=cesdk-init-after
const output = await engine.block.export(engine.scene.get(), {
  mimeType: 'application/pdf',
});
```

On success, the **output** variable contains the generated design as a PDF Blob.. You can now save it or display it in your frontend.

Here’s what your final output should look like:

![Exported postcard design showing populated name and address fields](https://img.ly/docs/cesdk/./assets/scene-example-backside-export.png)

Need help with exports? Check out the [Export Guide](./export-save-publish/export.md) for detailed instructions and options.

<details>
  <summary>Full code</summary>

  ```ts
  // Load a template from your server or a CDN
  const sceneUrl = 'https://cdn.img.ly/assets/demo/v4/ly.img.template/templates/cesdk_postcard_2.scene';
  await engine.scene.load(sceneUrl);
  // Option 1: Prepare your data as a JavaScript object
  const data = {
    textVariables: {
      first_name: 'John',
      last_name: 'Doe',
      address: '123 Main St.',
      city: 'Anytown',
    },
  };
  // Option 2: Fetch from an API
  // const data = await fetch('https://api.example.com/design-data').then(res => res.json());
  engine.variable.setString('first_name', data.textVariables.first_name);
  engine.variable.setString('last_name', data.textVariables.last_name);
  engine.variable.setString('address', data.textVariables.address);
  engine.variable.setString('city', data.textVariables.city);

  const output = await engine.block.export(engine.scene.get(), {
    mimeType: 'application/pdf',
  });
  // Success: 'output' contains your generated design as a PDF Blob
  ```
</details>

## Troubleshooting

If you have issues during the generation process:

- Verify that all your **variable names** exactly match those in your template.
- Make sure your template is accessible from the **URL** you provided.
- Check the **format** for your data values: for text variables, **strings** are the correct format.
- Look at the **console** for detailed error messages from the CE.SDK API.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support