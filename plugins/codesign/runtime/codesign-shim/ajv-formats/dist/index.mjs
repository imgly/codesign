import { __commonJSMin } from "../../_virtual/rolldown/runtime.mjs";
import { require_codegen } from "../../ajv/dist/compile/codegen/index.mjs";
import { require_formats } from "./formats.mjs";
import { require_limit } from "./limit.mjs";

//#region ../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const formats_1 = require_formats();
	const limit_1 = require_limit();
	const codegen_1 = require_codegen();
	const fullName = new codegen_1.Name("fullFormats");
	const fastName = new codegen_1.Name("fastFormats");
	const formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) (0, limit_1.default)(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));

//#endregion
export default require_dist();

export { require_dist };