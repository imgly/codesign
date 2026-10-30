import { _isoDateTime } from "../core/api.mjs";
import { ZodISODate, ZodISODateTime, ZodISODuration, ZodISOTime } from "./schemas.mjs";

//#region ../../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/iso.js
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}

//#endregion
export { datetime };