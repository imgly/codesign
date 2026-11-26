import { ProtocolError } from "../../codesign-router/peer/ndjson.mjs";

//#region src/adapter/design-links.ts
/** The tools whose call may name its design (the unit's `DESIGN_TOOLS`). */
const DESIGN_TOOLS = [
	"edit",
	"preview",
	"export",
	"scorecard",
	"checklist",
	"rename"
];
/** The tools that move the unit they run on to another design. */
const MOVES = ["import", "open"];
/** The design a call names, when its tool takes one. */
const designOf = (name, args) => DESIGN_TOOLS.includes(name) && typeof args.design === "string" ? args.design : void 0;
/** The unit holds another design than the call named: open that design's unit and send the call there. */
const notHeld = (err) => err instanceof ProtocolError && err.kind === "not_live";
/** connect(attach) opens a channel on attach's unit; connect() on a new unit. */
function designLinks(first, connect, onLink) {
	let main = first;
	const designs = /* @__PURE__ */ new Map();
	const entryOf = /* @__PURE__ */ new Map();
	const busy = /* @__PURE__ */ new Map();
	const retired = /* @__PURE__ */ new Set();
	let moving;
	const opened = async (attach) => {
		const link = await connect(attach);
		onLink(link);
		return link;
	};
	const designLink = (design) => {
		const held = designs.get(design);
		if (held !== void 0) return held;
		const link = opened(design);
		link.catch(() => {
			if (designs.get(design) === link) designs.delete(design);
		});
		designs.set(design, link);
		return link;
	};
	const release = (link) => {
		const left = (busy.get(link) ?? 1) - 1;
		if (left > 0) return busy.set(link, left);
		busy.delete(link);
		if (retired.delete(link)) link.close();
	};
	/** Before import/open on main: move main off a unit that a design channel uses. */
	const freeMain = async () => {
		const unit = main.unit();
		if (unit === void 0) return;
		if (!(await Promise.all([...designs.values()].map((l) => l.then((x) => x.unit(), () => void 0)))).includes(unit)) return;
		const old = main;
		main = await opened();
		if (busy.has(old)) retired.add(old);
		else old.close();
	};
	return {
		main: () => ({
			request: (method, params) => main.request(method, params),
			onProgress: (listener) => main.onProgress(listener)
		}),
		async use(name, args) {
			const design = designOf(name, args);
			let link;
			if (design !== void 0) {
				const entry = designLink(design);
				link = await entry;
				entryOf.set(link, entry);
			} else {
				if (MOVES.includes(name)) {
					while (moving !== void 0) await moving;
					moving = freeMain().finally(() => moving = void 0);
					await moving;
				}
				link = main;
			}
			busy.set(link, (busy.get(link) ?? 0) + 1);
			return {
				link,
				done: () => release(link)
			};
		},
		drop(design, refused) {
			const entry = entryOf.get(refused);
			if (entry === void 0) return;
			if (designs.get(design) === entry) designs.delete(design);
			entryOf.delete(refused);
			entry.then((l) => {
				if (busy.has(l)) retired.add(l);
				else l.close();
			});
		},
		close() {
			main.close();
			for (const link of designs.values()) link.then((l) => l.close(), () => void 0);
		}
	};
}

//#endregion
export { designLinks, designOf, notHeld };