import { __commonJSMin } from "../../../_virtual/rolldown/runtime.mjs";
import { require_core } from "./core/index.mjs";
import { require_validation } from "./validation/index.mjs";
import { require_applicator } from "./applicator/index.mjs";
import { require_format } from "./format/index.mjs";
import { require_metadata } from "./metadata.mjs";

//#region ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const core_1 = require_core();
	const validation_1 = require_validation();
	const applicator_1 = require_applicator();
	const format_1 = require_format();
	const metadata_1 = require_metadata();
	const draft7Vocabularies = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
	exports.default = draft7Vocabularies;
}));

//#endregion
export default require_draft7();

export { require_draft7 };