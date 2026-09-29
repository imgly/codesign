> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Build with AI](./get-started/build-with-ai.md) > [LLMs.txt](./llms-txt.md)

---

> **Note:** You can also connect your AI assistant directly to our documentation using our&#x20;
> [MCP Server](./get-started/mcp-server.md). This enables real-time search and
> retrieval without downloading large files.

Our documentation is now available in LLMs.txt format, optimized for AI reasoning engines. To better support platform-specific development, we've created separate documentation files for each platform.

For  developers, this means you can now access documentation tailored to your specific platform, whether it's iOS, Android, Web, or any other supported platform. This approach allows for a more focused and efficient use of AI tools in your development workflow.

[Download](https://img.ly/docs/cesdk/getFullUrl\(`/$\{props.platform.slug}/llms-full.txt`\))

These documentation files are substantial in size, with token counts exceeding the context windows of many AI models. This guide explains how to download and effectively use these platform-specific documentation files with AI tools to accelerate your development process.

## What are LLMs.txt files?

LLMs.txt is an emerging standard for making documentation AI-friendly. Unlike traditional documentation formats, LLMs.txt:

- Presents content in a clean, markdown-based format
- Eliminates extraneous HTML, CSS, and JavaScript
- Optimizes content for AI context windows
- Provides a comprehensive view of documentation in a single file

By using our platform-specific LLMs.txt files, you'll ensure that AI tools have the most relevant and complete context for helping with your development tasks.

## Markdown Content Negotiation

Our documentation pages also serve clean markdown directly when requested with the `Accept: text/markdown` HTTP header. AI agents and tools that support content negotiation can fetch any documentation page and receive a markdown response instead of HTML — no separate download required.

```bash
curl -H "Accept: text/markdown" https://img.ly/docs/cesdk/react/get-started/overview/
```

This means AI tools like web-browsing agents can access individual pages in a format optimized for their context windows without needing the full LLMs.txt bundle.

## Handling Large Documentation Files

Due to the size of our documentation files (upward of 500 000 tokens) most AI tools will face context window limitations. Standard models typically have context windows ranging from 8,000 to 200,000 tokens, making it challenging to process our complete documentation in a single session.

### Using Large Documentation Files

To work with our complete documentation files, use an AI model with a large context window. Many current models support 200,000+ tokens, and some support over 1 million tokens. Check your model's context window limits when loading the full documentation file.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support