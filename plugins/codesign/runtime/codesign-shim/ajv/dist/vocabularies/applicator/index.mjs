import { __commonJSMin } from "../../../../_virtual/rolldown/runtime.mjs";
import { require_additionalItems } from "./additionalItems.mjs";
import { require_items } from "./items.mjs";
import { require_prefixItems } from "./prefixItems.mjs";
import { require_items2020 } from "./items2020.mjs";
import { require_contains } from "./contains.mjs";
import { require_dependencies } from "./dependencies.mjs";
import { require_propertyNames } from "./propertyNames.mjs";
import { require_additionalProperties } from "./additionalProperties.mjs";
import { require_properties } from "./properties.mjs";
import { require_patternProperties } from "./patternProperties.mjs";
import { require_not } from "./not.mjs";
import { require_anyOf } from "./anyOf.mjs";
import { require_oneOf } from "./oneOf.mjs";
import { require_allOf } from "./allOf.mjs";
import { require_if } from "./if.mjs";
import { require_thenElse } from "./thenElse.mjs";

//#region ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const additionalItems_1 = require_additionalItems();
	const prefixItems_1 = require_prefixItems();
	const items_1 = require_items();
	const items2020_1 = require_items2020();
	const contains_1 = require_contains();
	const dependencies_1 = require_dependencies();
	const propertyNames_1 = require_propertyNames();
	const additionalProperties_1 = require_additionalProperties();
	const properties_1 = require_properties();
	const patternProperties_1 = require_patternProperties();
	const not_1 = require_not();
	const anyOf_1 = require_anyOf();
	const oneOf_1 = require_oneOf();
	const allOf_1 = require_allOf();
	const if_1 = require_if();
	const thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));

//#endregion
export default require_applicator();

export { require_applicator };