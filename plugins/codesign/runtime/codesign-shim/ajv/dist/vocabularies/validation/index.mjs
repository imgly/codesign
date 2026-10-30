import { __commonJSMin } from "../../../../_virtual/rolldown/runtime.mjs";
import { require_limitNumber } from "./limitNumber.mjs";
import { require_multipleOf } from "./multipleOf.mjs";
import { require_limitLength } from "./limitLength.mjs";
import { require_pattern } from "./pattern.mjs";
import { require_limitProperties } from "./limitProperties.mjs";
import { require_required } from "./required.mjs";
import { require_limitItems } from "./limitItems.mjs";
import { require_uniqueItems } from "./uniqueItems.mjs";
import { require_const } from "./const.mjs";
import { require_enum } from "./enum.mjs";

//#region ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const limitNumber_1 = require_limitNumber();
	const multipleOf_1 = require_multipleOf();
	const limitLength_1 = require_limitLength();
	const pattern_1 = require_pattern();
	const limitProperties_1 = require_limitProperties();
	const required_1 = require_required();
	const limitItems_1 = require_limitItems();
	const uniqueItems_1 = require_uniqueItems();
	const const_1 = require_const();
	const enum_1 = require_enum();
	const validation = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
	exports.default = validation;
}));

//#endregion
export default require_validation();

export { require_validation };