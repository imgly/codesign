import { __commonJSMin } from "../_virtual/rolldown/runtime.mjs";
import { require_utils } from "./lib/utils.mjs";
import { require_schemes } from "./lib/schemes.mjs";

//#region ../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	const { SCHEMES, getSchemeHandler } = require_schemes();
	const VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
	const MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
	const MALFORMED_HOST_ERROR = "URI host is malformed.";
	const FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
	/**
	* RFC 3986 section 3.1 does not allow percent-encoding in a scheme, so the
	* scheme is validated as-is and never decoded. Decoding would let inert input
	* such as `%6Aavascript:` become a live `javascript:` scheme.
	*
	* @param {string} scheme
	* @returns {string}
	*/
	function validateScheme(scheme) {
		const stringScheme = String(scheme);
		if (!VALID_SCHEME.test(stringScheme)) throw new TypeError(MALFORMED_SCHEME_ERROR);
		return stringScheme;
	}
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed, malformedPercentEncoding: baseMalformedPercentEncoding, malformedSchemeSpecific: baseMalformedSchemeSpecific, malformedHost: baseMalformedHost, malformedScheme: baseMalformedScheme } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed, malformedPercentEncoding: relativeMalformedPercentEncoding, malformedSchemeSpecific: relativeMalformedSchemeSpecific, malformedHost: relativeMalformedHost, malformedScheme: relativeMalformedScheme } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
		const resolvedHost = resolved.host;
		const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
		if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) throw new Error(MALFORMED_HOST_ERROR);
		canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
		const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !/\P{ASCII}/u.test(resolvedHost);
		if (resolved.error && !encodedASCIIHost) throw new Error(resolved.error);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
						if (baseHasAuthority && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		if (component.scheme) component.scheme = validateScheme(component.scheme);
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
		const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
		const pathNoScheme = !options.skipEscape && schemelessReference;
		if (component.path !== void 0) {
			if (!options.skipEscape) component.path = serializePathEncoding(component.path, pathNoScheme);
			else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) {
			component.scheme = validateScheme(component.scheme);
			uriTokens.push(component.scheme, ":");
		}
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
			if (schemelessReference) s = serializePathEncoding(s, true);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", encodeQuery(component.query));
		if (component.fragment !== void 0) uriTokens.push("#", encodeFragment(component.fragment));
		return uriTokens.join("");
	}
	const URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	const AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	const AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* Checks percent syntax without decoding the represented octets. RFC 3986
	* percent-encoding is byte-oriented, so sequences such as `%FF` are valid even
	* though they are not independently valid UTF-8.
	*
	* @param {string|undefined} component
	* @returns {boolean}
	*/
	function hasMalformedPercentEncoding(component) {
		if (component === void 0) return false;
		let percent = component.indexOf("%");
		while (percent !== -1) {
			if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) return true;
			percent = component.indexOf("%", percent + 3);
		}
		return false;
	}
	/**
	* Whether the host is a bracketed IP literal (RFC 3986 `IP-literal`).
	* An unterminated `[` is not a literal, so it must still be validated as a
	* reg-name instead of being waved through as an IP.
	*
	* @param {string} host
	* @returns {boolean}
	*/
	function isIPLiteral(host) {
		return host[0] === "[" && host[host.length - 1] === "]";
	}
	/**
	* @param {RegExpMatchArray} matches
	* @returns {boolean}
	*/
	function hasMalformedComponentPercentEncoding(matches) {
		const host = matches[4];
		return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
	}
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean, unicodeSupport?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean} whether host conversion failed
	*/
	function canonicalizeHost(parsed, options, schemeHandler, isIP) {
		if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
			parsed.error = parsed.error || MALFORMED_HOST_ERROR;
			return true;
		}
		if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
			let url;
			try {
				url = new URL("http://" + parsed.host);
			} catch (e) {
				parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				return true;
			}
			if (!isHostOnlyURL(url)) {
				parsed.error = parsed.error || MALFORMED_HOST_ERROR;
				return true;
			}
			parsed.host = url.hostname;
		}
		return false;
	}
	/**
	* Whether a domain host contains an ASCII character that RFC 3986 does not
	* allow in a reg-name (unreserved, sub-delims, or pct-encoded). Such a host is
	* rejected instead of being handed to the WHATWG URL parser, which would treat
	* "@" as a userinfo delimiter (silently dropping the data before it) and strip
	* TAB, LF, and CR. Non-ASCII characters remain allowed for IDNs.
	*
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean}
	*/
	function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
		return Boolean(parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host));
	}
	/**
	* @param {URL} url
	* @returns {boolean}
	*/
	function isHostOnlyURL(url) {
		return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let malformedPercentEncoding = false;
		let malformedSchemeSpecific = false;
		let malformedHost = false;
		let malformedIPLiteral = false;
		let malformedScheme = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (parsed.scheme !== void 0) {
				if (VALID_SCHEME.test(parsed.scheme)) parsed.scheme = parsed.scheme.toLowerCase();
				else {
					parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
					malformedScheme = true;
				}
			}
			malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
			if (malformedPercentEncoding) parsed.error = parsed.error || "URI contains malformed percent-encoding.";
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const bracketedIPLiteral = isIPLiteral(parsed.host);
					const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
					const ipv6result = normalizeIPv6(parsed.host);
					isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
					malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
					parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
					if (malformedIPLiteral) {
						parsed.error = parsed.error || MALFORMED_HOST_ERROR;
						malformedAuthorityOrPort = true;
					}
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!malformedIPLiteral) malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
			if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
				let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
				if (!isIP) host = normalizePercentEncoding(host.toLowerCase());
				parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.query) parsed.query = normalizeQueryFragmentEncoding(parsed.query);
				if (parsed.fragment) parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
			}
			if (schemeHandler && schemeHandler.parse) {
				schemeHandler.parse(parsed, options);
				if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) malformedSchemeSpecific = true;
			}
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri !== "string" && typeof uri !== "object") return;
		let value;
		try {
			value = typeof uri === "string" ? uri : serialize(uri, opts);
		} catch {
			return;
		}
		const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
		return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
	}
	const fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));

//#endregion
export default require_fast_uri();

export { require_fast_uri };