import { __commonJSMin } from "../../../../_virtual/rolldown/runtime.mjs";
import { require_items } from "./items.mjs";

//#region ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const items_1 = require_items();
	const def = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
	exports.default = def;
}));

//#endregion
export default require_prefixItems();

export { require_prefixItems };