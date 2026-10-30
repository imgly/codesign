//#region ../codesign-router/dist/install/version.js
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z.-]+)?$/;
function isVersion(text) {
	return VERSION.test(text);
}
/** Negative when `a` precedes `b`, positive when it follows, 0 when they are equal (build metadata ignored). */
function compareVersions(a, b) {
	const [x, y] = [parse(a), parse(b)];
	for (let i = 0; i < 3; i++) {
		const order = compareNumeric(x.core[i], y.core[i]);
		if (order !== 0) return order;
	}
	if (x.pre.length === 0 || y.pre.length === 0) return y.pre.length - x.pre.length;
	for (let i = 0; i < Math.min(x.pre.length, y.pre.length); i++) {
		const order = compareIdentifier(x.pre[i], y.pre[i]);
		if (order !== 0) return order;
	}
	return x.pre.length - y.pre.length;
}
function parse(text) {
	const match = VERSION.exec(text);
	if (match === null) throw new Error(`${text} is not a version`);
	return {
		core: [
			match[1],
			match[2],
			match[3]
		],
		pre: match[4]?.split(".") ?? []
	};
}
function compareIdentifier(a, b) {
	const [numA, numB] = [/^\d+$/.test(a), /^\d+$/.test(b)];
	if (numA && numB) return compareNumeric(a, b);
	if (numA !== numB) return numA ? -1 : 1;
	return a < b ? -1 : a > b ? 1 : 0;
}
/** Digit strings of any length, compared by value. */
function compareNumeric(x, y) {
	const [a, b] = [x.replace(/^0+(?=\d)/, ""), y.replace(/^0+(?=\d)/, "")];
	if (a.length !== b.length) return a.length - b.length;
	return a < b ? -1 : a > b ? 1 : 0;
}

//#endregion
export { compareVersions, isVersion };