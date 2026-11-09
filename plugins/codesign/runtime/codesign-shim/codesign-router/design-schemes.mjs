//#region ../codesign-router/dist/design-schemes.js
/** What a design file may reference: never `blob`, `file`, `opfs` or `buffer`, which do not outlive the process or the machine. */
const DESIGN_SCENE_SCHEMES = Object.freeze([
	"workspace",
	"bundle",
	"http",
	"https"
]);

//#endregion
export {  };