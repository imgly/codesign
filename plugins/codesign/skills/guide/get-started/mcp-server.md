> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Build with AI](./get-started/build-with-ai.md) > [MCP Server](./get-started/mcp-server.md)

---

The CE.SDK MCP server provides a standardized interface that allows any compatible AI assistant to search and access our documentation. This enables AI tools like Claude, Cursor, and VS Code Copilot to provide more accurate, context-aware help when working with CE.SDK.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that enables AI assistants to securely connect to external data sources. By connecting your AI tools to our MCP server, you get:

- **Accurate answers**: AI assistants can search and retrieve the latest CE.SDK documentation
- **Context-aware help**: Get platform-specific guidance for your development environment
- **Up-to-date information**: Always access current documentation without relying on training data

## Available Tools

The MCP server exposes two tools:

| Tool     | Description                                   |
| -------- | --------------------------------------------- |
| `search` | Search documentation by query string          |
| `fetch`  | Retrieve the full content of a document by ID |

## Server Endpoint

| URL                      | Transport       |
| ------------------------ | --------------- |
| `https://mcp.img.ly/mcp` | Streamable HTTP |

No authentication is required.

## Setup Instructions

### Claude Code

Add the MCP server with a single command:

```bash
claude mcp add --transport http imgly_docs https://mcp.img.ly/mcp
```

### Claude Desktop

1. Open Claude Desktop and go to **Settings** (click your profile icon)
2. Navigate to **Connectors** in the sidebar
3. Click **Add custom connector**
4. Enter the URL: `https://mcp.img.ly/mcp`
5. Click **Add** to connect

### Cursor

Add the following to your Cursor MCP configuration. You can use either:

- **Project-specific**: `.cursor/mcp.json` in your project root
- **Global**: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "imgly_docs": {
      "url": "https://mcp.img.ly/mcp"
    }
  }
}
```

### VS Code

Add to your workspace configuration at `.vscode/mcp.json`:

```json
{
  "servers": {
    "imgly_docs": {
      "type": "http",
      "url": "https://mcp.img.ly/mcp"
    }
  }
}
```

### Windsurf

Add the following to your Windsurf MCP configuration at `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "imgly_docs": {
      "serverUrl": "https://mcp.img.ly/mcp"
    }
  }
}
```

### Other Clients

For other MCP-compatible clients, use the endpoint `https://mcp.img.ly/mcp` with HTTP transport. Refer to your client's documentation for the specific configuration format.

## Usage

Once configured, your AI assistant will automatically have access to CE.SDK documentation. You can ask questions like:

- "How do I add a text block in CE.SDK?"
- "Show me how to export a design as PNG"
- "What are the available blend modes?"

The AI will search our documentation and provide answers based on the latest CE.SDK guides and API references.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support