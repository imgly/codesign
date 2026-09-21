> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Node.js](./get-started/vanilla.md)

---

This guide walks you through **cloning and running** a pre-built
**CreativeEditor SDK (CE.SDK)** Node.js integration project from GitHub. It's
the fastest way to get started with CE.SDK in **Node.js** without having to
set everything up from scratch.

## Who Is This Guide For?

This guide is perfect for developers who:

- Want to use **CE.SDK on a server** without needing a custom setup.
- Prefer working with a ready-to-go **Node.js sample project**.
- Are comfortable using **Git** and **Node.js** to manage local development environments.

## What You’ll Achieve

- Clone the **CE.SDK Node.js integration project** from GitHub.
- Install the required dependencies and **run the project locally**.
- **Programmatically load a scene** with **CE.SDK CreativeEngine** and export as **PNG**.

> **Note:** Please note that the Node.js executable is not capable of processing or
> exporting video.

## Prerequisites

Before getting started, ensure you have the following:

- **Git** - Required to clone the project repository. [Download Git](https://git-scm.com/downloads).
- **The latest LTS version of Node.js and npm** - Necessary for installing dependencies and running the script. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

Begin by cloning the CE.SDK examples repository from GitHub:

<Tabs syncKey="code-language">
  <TabItem label="Git">
    `bash git clone https://github.com/imgly/cesdk-web-examples.git `
  </TabItem>

  <TabItem label="GitHub CLI">
    `bash gh repo clone imgly/cesdk-web-examples `
  </TabItem>
</Tabs>

<br />

> **Warning:** **Warning:** The full `cesdk-web-examples` repository has a size of
> approximately 1 GB. Ensure you have a reliable internet connection before
> cloning. Any download interruption may result in a `fatal: early EOF` error,
> and require restarting the clone process.

## Step 2: Install the Dependencies

Navigate to the example directory:

```bash
cd cesdk-web-examples/integrate-with-nodejs
```

Next, install the necessary dependencies using npm:

```bash
npm install
```

This downloads and installs all the required packages listed in the project’s `package.json` file.

## Step 3: Add Your License Key

Open `index.js` and replace the placeholder license key with your valid one.

```js
const config = {
  // Replace with your CE.SDK license key
  // license: 'YOUR_CESDK_LICENSE_KEY',
  // ...
};
```

## Step 4: Run the Project

Run the Node.js script that contains your CreativeEngine logic with:

```bash
node index.js
```

This loads an existing scene and generates an image file named `example-output.png` in your project directory.

## Troubleshooting & Common Issues

**❌ Issue**: `Module not found` or missing packages

- Verify that `npm install` ran without any errors and all dependencies were installed correctly.

**❌ Error**: `Invalid license key`

- Confirm that the license key is correctly entered and valid.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK with Node.js. When you’re ready, dive deeper into the SDK and continue with the next steps:

- [Serve assets from your server](./serve-assets.md)
- [Import media](./import-media/concepts.md)
- [Automate creative workflows](./automation/overview.md)
- [Running on AWS Lambda](./get-started/vanilla-aws-lambda.md)



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support