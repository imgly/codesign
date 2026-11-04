import { __commonJSMin } from "../../../../_virtual/rolldown/runtime.mjs";
import { require_id } from "./id.mjs";
import { require_ref } from "./ref.mjs";

//#region ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const id_1 = require_id();
	const ref_1 = require_ref();
	const core = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
	exports.default = core;
}));

//#endregion
export default require_core();

export { require_core };