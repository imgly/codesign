import { ProtocolError } from "../../codesign-router/peer/ndjson.mjs";
import { ErrorCode, McpError } from "../../@modelcontextprotocol/sdk/dist/esm/types.mjs";

//#region src/adapter/errors.ts
const invalidParams = (message) => new McpError(ErrorCode.InvalidParams, message);
async function mcpErrors(answer) {
	try {
		return await answer;
	} catch (err) {
		if (err instanceof ProtocolError && err.kind === "invalid_params") throw invalidParams(err.message);
		throw err;
	}
}

//#endregion
export { invalidParams, mcpErrors };