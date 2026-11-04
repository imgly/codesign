import { getLiteralValue, getObjectShape, safeParse } from "./zod-compat.mjs";

//#region ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.32.1_@cfworker+json-schema@4.1.1_zod@4.6.7/node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
function getMethodLiteral(schema) {
	const methodSchema = getObjectShape(schema)?.method;
	if (!methodSchema) throw new Error("Schema is missing a method literal");
	const value = getLiteralValue(methodSchema);
	if (typeof value !== "string") throw new Error("Schema method literal must be a string");
	return value;
}
function parseWithCompat(schema, data) {
	const result = safeParse(schema, data);
	if (!result.success) throw result.error;
	return result.data;
}

//#endregion
export { getMethodLiteral, parseWithCompat };