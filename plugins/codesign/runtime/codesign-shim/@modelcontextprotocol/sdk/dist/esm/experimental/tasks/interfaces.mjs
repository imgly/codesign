//#region ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.32.1_@cfworker+json-schema@4.1.1_zod@4.6.7/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
/**
* Experimental task interfaces for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*/
/**
* Checks if a task status represents a terminal state.
* Terminal states are those where the task has finished and will not change.
*
* @param status - The task status to check
* @returns True if the status is terminal (completed, failed, or cancelled)
* @experimental
*/
function isTerminal(status) {
	return status === "completed" || status === "failed" || status === "cancelled";
}

//#endregion
export { isTerminal };