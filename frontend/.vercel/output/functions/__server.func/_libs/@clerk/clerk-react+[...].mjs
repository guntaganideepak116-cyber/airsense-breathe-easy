import { i as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useState = React.useState;
	var useEffect = React.useEffect;
	var useLayoutEffect = React.useLayoutEffect;
	var useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
//#endregion
//#region node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_production();
}));
//#endregion
//#region node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	};
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
var ClerkError = class ClerkError extends Error {
	static kind = "ClerkError";
	clerkError = true;
	code;
	longMessage;
	docsUrl;
	cause;
	get name() {
		return this.constructor.name;
	}
	constructor(opts) {
		super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), { cause: opts.cause });
		Object.setPrototypeOf(this, ClerkError.prototype);
		this.code = opts.code;
		this.docsUrl = opts.docsUrl;
		this.longMessage = opts.longMessage;
		this.cause = opts.cause;
	}
	toString() {
		return `[${this.name}]\nMessage:${this.message}`;
	}
	static formatMessage(name, msg, code, docsUrl) {
		const prefix = "Clerk:";
		const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
		msg = msg.replace(regex, "");
		msg = `${prefix} ${msg.trim()}\n\n(code="${code}")\n\n`;
		if (docsUrl) msg += `\n\nDocs: ${docsUrl}`;
		return msg;
	}
};
var DefaultMessages = Object.freeze({
	InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
	InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
	MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
	MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
	MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
/**
* Builds an error thrower.
*
* @internal
*/
function buildErrorThrower({ packageName, customMessages }) {
	let pkg = packageName;
	/**
	* Builds a message from a raw message and replacements.
	*
	* @internal
	*/
	function buildMessage(rawMessage, replacements) {
		if (!replacements) return `${pkg}: ${rawMessage}`;
		let msg = rawMessage;
		const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
		for (const match of matches) {
			const replacement = (replacements[match[1]] || "").toString();
			msg = msg.replace(`{{${match[1]}}}`, replacement);
		}
		return `${pkg}: ${msg}`;
	}
	const messages = {
		...DefaultMessages,
		...customMessages
	};
	return {
		setPackageName({ packageName: packageName$1 }) {
			if (typeof packageName$1 === "string") pkg = packageName$1;
			return this;
		},
		setMessages({ customMessages: customMessages$1 }) {
			Object.assign(messages, customMessages$1 || {});
			return this;
		},
		throwInvalidPublishableKeyError(params) {
			throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
		},
		throwInvalidProxyUrl(params) {
			throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
		},
		throwMissingPublishableKeyError() {
			throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
		},
		throwMissingSecretKeyError() {
			throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
		},
		throwMissingClerkProviderError(params) {
			throw new Error(buildMessage(messages.MissingClerkProvider, params));
		},
		throw(message) {
			throw new Error(buildMessage(message));
		}
	};
}
/**
* Custom error class for representing Clerk runtime errors.
*
* @class ClerkRuntimeError
*
* @example
*   throw new ClerkRuntimeError('An error occurred', { code: 'password_invalid' });
*/
var ClerkRuntimeError = class ClerkRuntimeError extends ClerkError {
	static kind = "ClerkRuntimeError";
	/**
	* @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
	*/
	clerkRuntimeError = true;
	constructor(message, options) {
		super({
			...options,
			message
		});
		Object.setPrototypeOf(this, ClerkRuntimeError.prototype);
	}
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/authorization-CV9xGlIX.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var TYPES_TO_OBJECTS = {
	strict_mfa: {
		afterMinutes: 10,
		level: "multi_factor"
	},
	strict: {
		afterMinutes: 10,
		level: "second_factor"
	},
	moderate: {
		afterMinutes: 60,
		level: "second_factor"
	},
	lax: {
		afterMinutes: 1440,
		level: "second_factor"
	}
};
var ALLOWED_LEVELS = /* @__PURE__ */ new Set([
	"first_factor",
	"second_factor",
	"multi_factor"
]);
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
	"strict_mfa",
	"strict",
	"moderate",
	"lax"
]);
var isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
var isValidLevel = (level) => ALLOWED_LEVELS.has(level);
var isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
var isValidFactorAge = (x) => typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
var prefixWithOrg = (value) => value.replace(/^(org:)*/, "org:");
/**
* Checks if a user has the required organization-level authorization.
* If both role and permission are provided, both must match (AND).
*/
var checkOrgAuthorization = (params, options) => {
	const { orgId, orgRole, orgPermissions } = options;
	const roleAsked = params.role !== void 0;
	const permissionAsked = params.permission !== void 0;
	if (!roleAsked && !permissionAsked) return "skip";
	if (roleAsked && typeof params.role !== "string") return "fail";
	if (permissionAsked && typeof params.permission !== "string") return "fail";
	if (!orgId) return "fail";
	if (roleAsked) {
		if (typeof orgRole !== "string" || !orgRole) return "fail";
		if (prefixWithOrg(orgRole) !== prefixWithOrg(params.role)) return "fail";
	}
	if (permissionAsked) {
		if (!Array.isArray(orgPermissions)) return "fail";
		if (!orgPermissions.includes(prefixWithOrg(params.permission))) return "fail";
	}
	return "pass";
};
var checkForFeatureOrPlan = (claim, featureOrPlan) => {
	const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
	const [scope, _id] = featureOrPlan.split(":");
	const id = _id || scope;
	if (scope === "org") return orgFeatures.includes(id);
	else if (scope === "user") return userFeatures.includes(id);
	else return [...orgFeatures, ...userFeatures].includes(id);
};
/**
* Checks if a user is entitled to the requested feature or plan.
* If both feature and plan are provided, both must match (AND).
*/
var checkBillingAuthorization = (params, options) => {
	const { features, plans } = options;
	const featureAsked = params.feature !== void 0;
	const planAsked = params.plan !== void 0;
	if (!featureAsked && !planAsked) return "skip";
	if (featureAsked && typeof params.feature !== "string") return "fail";
	if (planAsked && typeof params.plan !== "string") return "fail";
	if (featureAsked) {
		if (typeof features !== "string" || !features) return "fail";
		try {
			if (!checkForFeatureOrPlan(features, params.feature)) return "fail";
		} catch {
			return "fail";
		}
	}
	if (planAsked) {
		if (typeof plans !== "string" || !plans) return "fail";
		try {
			if (!checkForFeatureOrPlan(plans, params.plan)) return "fail";
		} catch {
			return "fail";
		}
	}
	return "pass";
};
var splitByScope = (fea) => {
	const features = fea ? fea.split(",").map((f) => f.trim()) : [];
	return {
		org: features.filter((f) => f.split(":")[0].includes("o")).map((f) => f.split(":")[1]),
		user: features.filter((f) => f.split(":")[0].includes("u")).map((f) => f.split(":")[1])
	};
};
var validateReverificationConfig = (config) => {
	if (!config) return false;
	const convertConfigToObject = (config$1) => {
		if (typeof config$1 === "string") return TYPES_TO_OBJECTS[config$1];
		return config$1;
	};
	const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
	const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
	if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
	return false;
};
/**
* Evaluates if the user meets re-verification authentication requirements.
* Handles different verification levels (first factor, second factor, multi-factor).
*/
var checkReverificationAuthorization = (params, { factorVerificationAge }) => {
	if (params.reverification === void 0) return "skip";
	if (!factorVerificationAge) return "fail";
	if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge(factorVerificationAge[0]) || !isValidFactorAge(factorVerificationAge[1])) return "fail";
	const getConfig = validateReverificationConfig(params.reverification);
	if (!getConfig) return "fail";
	const { level, afterMinutes } = getConfig();
	const [factor1Age, factor2Age] = factorVerificationAge;
	if (factor1Age === -1 && factor2Age === -1) return "fail";
	const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
	const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
	switch (level) {
		case "first_factor": return factor1FreshEnough ? "pass" : "fail";
		case "second_factor":
			if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
			if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
			return factor2FreshEnough ? "pass" : "fail";
		case "multi_factor":
			if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
			if (factor1Age === -1) return "fail";
			return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
	}
};
var combine = (results) => results.some((r) => r === "pass") && results.every((r) => r === "pass" || r === "skip");
/**
* Creates a function for comprehensive user authorization checks.
* Combines organization, billing, and reverification checks. The returned function
* authorizes only when every requested dimension passes; any requested dimension
* that cannot be satisfied (including missing or malformed session data) denies
* the request. Fails if `userId` is missing.
*/
var createCheckAuthorization = (options) => {
	return (params) => {
		if (!options.userId) return false;
		return combine([
			checkOrgAuthorization(params, options),
			checkBillingAuthorization(params, options),
			checkReverificationAuthorization(params, options)
		]);
	};
};
/**
* Shared utility function that centralizes auth state resolution logic,
* preventing duplication across different packages.
* @internal
*/
var resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } }) => {
	if (sessionId === void 0 && userId === void 0) return {
		isLoaded: false,
		isSignedIn: void 0,
		sessionId,
		sessionClaims: void 0,
		userId,
		actor: void 0,
		orgId: void 0,
		orgRole: void 0,
		orgSlug: void 0,
		has: void 0,
		signOut,
		getToken
	};
	if (sessionId === null && userId === null) return {
		isLoaded: true,
		isSignedIn: false,
		sessionId,
		userId,
		sessionClaims: null,
		actor: null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has: () => false,
		signOut,
		getToken
	};
	if (treatPendingAsSignedOut && sessionStatus === "pending") return {
		isLoaded: true,
		isSignedIn: false,
		sessionId: null,
		userId: null,
		sessionClaims: null,
		actor: null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has: () => false,
		signOut,
		getToken
	};
	if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
		isLoaded: true,
		isSignedIn: true,
		sessionId,
		sessionClaims,
		userId,
		actor: actor || null,
		orgId,
		orgRole,
		orgSlug: orgSlug || null,
		has,
		signOut,
		getToken
	};
	if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
		isLoaded: true,
		isSignedIn: true,
		sessionId,
		sessionClaims,
		userId,
		actor: actor || null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has,
		signOut,
		getToken
	};
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/constants-ByUssRbE.mjs
var DEV_OR_STAGING_SUFFIXES = [
	".lcl.dev",
	".stg.dev",
	".lclstage.dev",
	".stgstage.dev",
	".dev.lclclerk.com",
	".stg.lclclerk.com",
	".accounts.lclclerk.com",
	"accountsstage.dev",
	"accounts.dev"
];
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/isomorphicAtob-DybBXGFR.mjs
/**
* A function that decodes a string of data which has been encoded using base-64 encoding.
* Uses `atob` if available, otherwise uses `Buffer` from `global`. If neither are available, returns the data as-is.
*/
var isomorphicAtob = (data) => {
	if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
	else if (typeof global !== "undefined" && global.Buffer) return new global.Buffer(data, "base64").toString();
	return data;
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/keys-YNv6yjKk.mjs
/** Prefix used for production publishable keys */
var PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
/** Prefix used for development publishable keys */
var PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
/**
* Validates that a decoded publishable key has the correct format.
* The decoded value should be a frontend API followed by exactly one '$' at the end.
*
* @param decoded - The decoded publishable key string to validate.
* @returns `true` if the decoded key has valid format, `false` otherwise.
*/
function isValidDecodedPublishableKey(decoded) {
	if (!decoded.endsWith("$")) return false;
	const withoutTrailing = decoded.slice(0, -1);
	if (withoutTrailing.includes("$")) return false;
	return withoutTrailing.includes(".");
}
/**
* Parses and validates a publishable key, extracting the frontend API and instance type.
*
* @param key - The publishable key to parse.
* @param options - Configuration options for parsing.
* @param options.fatal
* @param options.domain
* @param options.proxyUrl
* @param options.isSatellite
* @returns Parsed publishable key object with instanceType and frontendApi, or null if invalid.
*
* @throws {Error} When options.fatal is true and key is missing or invalid.
*/
function parsePublishableKey(key, options = {}) {
	key = key || "";
	if (!key || !isPublishableKey(key)) {
		if (options.fatal && !key) throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
		if (options.fatal && !isPublishableKey(key)) throw new Error("Publishable key not valid.");
		return null;
	}
	const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
	let decodedFrontendApi;
	try {
		decodedFrontendApi = isomorphicAtob(key.split("_")[2]);
	} catch {
		if (options.fatal) throw new Error("Publishable key not valid: Failed to decode key.");
		return null;
	}
	if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
		if (options.fatal) throw new Error("Publishable key not valid: Decoded key has invalid format.");
		return null;
	}
	let frontendApi = decodedFrontendApi.slice(0, -1);
	if (options.proxyUrl) frontendApi = options.proxyUrl;
	else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
	return {
		instanceType,
		frontendApi
	};
}
/**
* Checks if the provided key is a valid publishable key.
*
* @param key - The key to be checked. Defaults to an empty string if not provided.
* @returns `true` if 'key' is a valid publishable key, `false` otherwise.
*/
function isPublishableKey(key = "") {
	try {
		if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
		const parts = key.split("_");
		if (parts.length !== 3) return false;
		const encodedPart = parts[2];
		if (!encodedPart) return false;
		return isValidDecodedPublishableKey(isomorphicAtob(encodedPart));
	} catch {
		return false;
	}
}
/**
* Creates a memoized cache for checking if URLs are development or staging environments.
* Uses a Map to cache results for better performance on repeated checks.
*
* @returns An object with an isDevOrStagingUrl method that checks if a URL is dev/staging.
*/
function createDevOrStagingUrlCache() {
	const devOrStagingUrlCache = /* @__PURE__ */ new Map();
	return { isDevOrStagingUrl: (url) => {
		if (!url) return false;
		const hostname = typeof url === "string" ? url : url.hostname;
		let res = devOrStagingUrlCache.get(hostname);
		if (res === void 0) {
			res = DEV_OR_STAGING_SUFFIXES.some((s) => hostname.endsWith(s));
			devOrStagingUrlCache.set(hostname, res);
		}
		return res;
	} };
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/telemetry-wqMDWlvR.mjs
var EVENT_METHOD_CALLED = "METHOD_CALLED";
var EVENT_SAMPLING_RATE$2 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/
function eventMethodCalled(method, payload) {
	return {
		event: EVENT_METHOD_CALLED,
		eventSamplingRate: EVENT_SAMPLING_RATE$2,
		payload: {
			method,
			...payload
		}
	};
}
//#endregion
//#region node_modules/dequal/lite/index.mjs
var import_shim = require_shim();
var has$1 = Object.prototype.hasOwnProperty;
function dequal$1(foo, bar) {
	var ctor, len;
	if (foo === bar) return true;
	if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (ctor === Array) {
			if ((len = foo.length) === bar.length) while (len-- && dequal$1(foo[len], bar[len]));
			return len === -1;
		}
		if (!ctor || typeof foo === "object") {
			len = 0;
			for (ctor in foo) {
				if (has$1.call(foo, ctor) && ++len && !has$1.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal$1(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}
	return foo !== foo && bar !== bar;
}
//#endregion
//#region node_modules/swr/dist/_internal/config-context-client-BoS53ST9.mjs
var SWRGlobalState = /* @__PURE__ */ new WeakMap();
var noop = () => {};
var OBJECT$1 = Object;
var isUndefined$1 = (v) => v === void 0;
var isFunction$1 = (v) => typeof v == "function";
var mergeObjects = (a, b) => ({
	...a,
	...b
});
var isPromiseLike = (x) => isFunction$1(x.then);
var EMPTY_CACHE = {};
var INITIAL_CACHE = {};
var STR_UNDEFINED = "undefined";
var isWindowDefined = typeof window != STR_UNDEFINED;
var isDocumentDefined = typeof document != STR_UNDEFINED;
var isLegacyDeno = isWindowDefined && "Deno" in window;
var hasRequestAnimationFrame = () => isWindowDefined && typeof window["requestAnimationFrame"] != STR_UNDEFINED;
var createCacheHelper = (cache, key) => {
	const state = SWRGlobalState.get(cache);
	return [
		() => !isUndefined$1(key) && cache.get(key) || EMPTY_CACHE,
		(info) => {
			if (!isUndefined$1(key)) {
				const prev = cache.get(key);
				if (!(key in INITIAL_CACHE)) INITIAL_CACHE[key] = prev;
				state[5](key, mergeObjects(prev, info), prev || EMPTY_CACHE);
			}
		},
		state[6],
		() => {
			if (!isUndefined$1(key)) {
				if (key in INITIAL_CACHE) return INITIAL_CACHE[key];
			}
			return !isUndefined$1(key) && cache.get(key) || EMPTY_CACHE;
		}
	];
};
/**
* Due to the bug https://bugs.chromium.org/p/chromium/issues/detail?id=678075,
* it's not reliable to detect if the browser is currently online or offline
* based on `navigator.onLine`.
* As a workaround, we always assume it's online on the first load, and change
* the status upon `online` or `offline` events.
*/ var online = true;
var isOnline = () => online;
var [onWindowEvent, offWindowEvent] = isWindowDefined && window.addEventListener ? [window.addEventListener.bind(window), window.removeEventListener.bind(window)] : [noop, noop];
var isVisible = () => {
	const visibilityState = isDocumentDefined && document.visibilityState;
	return isUndefined$1(visibilityState) || visibilityState !== "hidden";
};
var initFocus = (callback) => {
	if (isDocumentDefined) document.addEventListener("visibilitychange", callback);
	onWindowEvent("focus", callback);
	return () => {
		if (isDocumentDefined) document.removeEventListener("visibilitychange", callback);
		offWindowEvent("focus", callback);
	};
};
var initReconnect = (callback) => {
	const onOnline = () => {
		online = true;
		callback();
	};
	const onOffline = () => {
		online = false;
	};
	onWindowEvent("online", onOnline);
	onWindowEvent("offline", onOffline);
	return () => {
		offWindowEvent("online", onOnline);
		offWindowEvent("offline", onOffline);
	};
};
var preset = {
	isOnline,
	isVisible
};
var defaultConfigOptions = {
	initFocus,
	initReconnect
};
var IS_REACT_LEGACY = !import_react.useId;
var IS_SERVER = !isWindowDefined || isLegacyDeno;
var rAF = (f) => hasRequestAnimationFrame() ? window["requestAnimationFrame"](f) : setTimeout(f, 1);
var useIsomorphicLayoutEffect = IS_SERVER ? import_react.useEffect : import_react.useLayoutEffect;
var navigatorConnection = typeof navigator !== "undefined" && navigator.connection;
var slowConnection = !IS_SERVER && navigatorConnection && (["slow-2g", "2g"].includes(navigatorConnection.effectiveType) || navigatorConnection.saveData);
var table$1 = /* @__PURE__ */ new WeakMap();
var getTypeName$1 = (value) => OBJECT$1.prototype.toString.call(value);
var isObjectTypeName$1 = (typeName, type) => typeName === `[object ${type}]`;
var counter$1 = 0;
var stableHash$1 = (arg) => {
	const type = typeof arg;
	const typeName = getTypeName$1(arg);
	const isDate = isObjectTypeName$1(typeName, "Date");
	const isRegex = isObjectTypeName$1(typeName, "RegExp");
	const isPlainObject = isObjectTypeName$1(typeName, "Object");
	let result;
	let index;
	if (OBJECT$1(arg) === arg && !isDate && !isRegex) {
		result = table$1.get(arg);
		if (result) return result;
		result = ++counter$1 + "~";
		table$1.set(arg, result);
		if (Array.isArray(arg)) {
			result = "@";
			for (index = 0; index < arg.length; index++) result += stableHash$1(arg[index]) + ",";
			table$1.set(arg, result);
		}
		if (isPlainObject) {
			result = "#";
			const keys = OBJECT$1.keys(arg).sort();
			while (!isUndefined$1(index = keys.pop())) if (!isUndefined$1(arg[index])) result += index + ":" + stableHash$1(arg[index]) + ",";
			table$1.set(arg, result);
		}
	} else result = isDate ? arg.toJSON() : type == "symbol" ? arg.toString() : type == "string" ? JSON.stringify(arg) : "" + arg;
	return result;
};
var serialize$1 = (key) => {
	if (isFunction$1(key)) try {
		key = key();
	} catch (err) {
		key = "";
	}
	const args = key;
	key = typeof key == "string" ? key : (Array.isArray(key) ? key.length : key) ? stableHash$1(key) : "";
	return [key, args];
};
var __timestamp = 0;
var getTimestamp = () => ++__timestamp;
async function internalMutate(...args) {
	const [cache, _key, _data, _opts] = args;
	const options = mergeObjects({
		populateCache: true,
		throwOnError: true
	}, typeof _opts === "boolean" ? { revalidate: _opts } : _opts || {});
	let populateCache = options.populateCache;
	const rollbackOnErrorOption = options.rollbackOnError;
	let optimisticData = options.optimisticData;
	const rollbackOnError = (error) => {
		return typeof rollbackOnErrorOption === "function" ? rollbackOnErrorOption(error) : rollbackOnErrorOption !== false;
	};
	const throwOnError = options.throwOnError;
	if (isFunction$1(_key)) {
		const keyFilter = _key;
		const matchedKeys = [];
		const it = cache.keys();
		for (const key of it) if (!/^\$(inf|sub)\$/.test(key) && keyFilter(cache.get(key)._k)) matchedKeys.push(key);
		return Promise.all(matchedKeys.map(mutateByKey));
	}
	return mutateByKey(_key);
	async function mutateByKey(_k) {
		const [key] = serialize$1(_k);
		if (!key) return;
		const [get, set] = createCacheHelper(cache, key);
		const [EVENT_REVALIDATORS, MUTATION, FETCH, PRELOAD] = SWRGlobalState.get(cache);
		const startRevalidate = () => {
			const revalidators = EVENT_REVALIDATORS[key];
			if (isFunction$1(options.revalidate) ? options.revalidate(get().data, _k) : options.revalidate !== false) {
				delete FETCH[key];
				delete PRELOAD[key];
				if (revalidators && revalidators[0]) return revalidators[0](2).then(() => get().data);
			}
			return get().data;
		};
		if (args.length < 3) return startRevalidate();
		let data = _data;
		let error;
		let isError = false;
		const beforeMutationTs = getTimestamp();
		MUTATION[key] = [beforeMutationTs, 0];
		const hasOptimisticData = !isUndefined$1(optimisticData);
		const state = get();
		const displayedData = state.data;
		const currentData = state._c;
		const committedData = isUndefined$1(currentData) ? displayedData : currentData;
		if (hasOptimisticData) {
			optimisticData = isFunction$1(optimisticData) ? optimisticData(committedData, displayedData) : optimisticData;
			set({
				data: optimisticData,
				_c: committedData
			});
		}
		if (isFunction$1(data)) try {
			data = data(committedData);
		} catch (err) {
			error = err;
			isError = true;
		}
		if (data && isPromiseLike(data)) {
			data = await data.catch((err) => {
				error = err;
				isError = true;
			});
			if (beforeMutationTs !== MUTATION[key][0]) {
				if (isError) throw error;
				return data;
			} else if (isError && hasOptimisticData && rollbackOnError(error)) {
				populateCache = true;
				set({
					data: committedData,
					_c: void 0
				});
			}
		}
		if (populateCache) {
			if (!isError) {
				if (isFunction$1(populateCache)) set({
					data: populateCache(data, committedData),
					error: void 0,
					_c: void 0
				});
				else set({
					data,
					error: void 0,
					_c: void 0
				});
			}
		}
		MUTATION[key][1] = getTimestamp();
		Promise.resolve(startRevalidate()).then(() => {
			set({ _c: void 0 });
		});
		if (isError) {
			if (throwOnError) throw error;
			return;
		}
		return data;
	}
}
var revalidateAllKeys = (revalidators, type) => {
	for (const key in revalidators) if (revalidators[key][0]) revalidators[key][0](type);
};
var initCache = (provider, options) => {
	if (!SWRGlobalState.has(provider)) {
		const opts = mergeObjects(defaultConfigOptions, options);
		const EVENT_REVALIDATORS = Object.create(null);
		const mutate = internalMutate.bind(void 0, provider);
		let unmount = noop;
		const subscriptions = Object.create(null);
		const subscribe = (key, callback) => {
			const subs = subscriptions[key] || [];
			subscriptions[key] = subs;
			subs.push(callback);
			return () => subs.splice(subs.indexOf(callback), 1);
		};
		const setter = (key, value, prev) => {
			provider.set(key, value);
			const subs = subscriptions[key];
			if (subs) for (const fn of subs) fn(value, prev);
		};
		const initProvider = () => {
			if (!SWRGlobalState.has(provider)) {
				SWRGlobalState.set(provider, [
					EVENT_REVALIDATORS,
					Object.create(null),
					Object.create(null),
					Object.create(null),
					mutate,
					setter,
					subscribe
				]);
				if (!IS_SERVER) {
					const releaseFocus = opts.initFocus(setTimeout.bind(void 0, revalidateAllKeys.bind(void 0, EVENT_REVALIDATORS, 0)));
					const releaseReconnect = opts.initReconnect(setTimeout.bind(void 0, revalidateAllKeys.bind(void 0, EVENT_REVALIDATORS, 1)));
					unmount = () => {
						releaseFocus && releaseFocus();
						releaseReconnect && releaseReconnect();
						SWRGlobalState.delete(provider);
					};
				}
			}
		};
		initProvider();
		return [
			provider,
			mutate,
			initProvider,
			unmount
		];
	}
	return [provider, SWRGlobalState.get(provider)[4]];
};
var onErrorRetry = (_, __, config, revalidate, opts) => {
	const maxRetryCount = config.errorRetryCount;
	const currentRetryCount = opts.retryCount;
	const timeout = ~~((Math.random() + .5) * (1 << (currentRetryCount < 8 ? currentRetryCount : 8))) * config.errorRetryInterval;
	if (!isUndefined$1(maxRetryCount) && currentRetryCount > maxRetryCount) return;
	setTimeout(revalidate, timeout, opts);
};
var compare = dequal$1;
var [cache, mutate] = initCache(/* @__PURE__ */ new Map());
var defaultConfig = mergeObjects({
	onLoadingSlow: noop,
	onSuccess: noop,
	onError: noop,
	onErrorRetry,
	onDiscarded: noop,
	revalidateOnFocus: true,
	revalidateOnReconnect: true,
	revalidateIfStale: true,
	shouldRetryOnError: true,
	errorRetryInterval: slowConnection ? 1e4 : 5e3,
	focusThrottleInterval: 5e3,
	dedupingInterval: 2e3,
	loadingTimeout: slowConnection ? 5e3 : 3e3,
	compare,
	isPaused: () => false,
	cache,
	mutate,
	fallback: {}
}, preset);
var mergeConfigs = (a, b) => {
	const v = mergeObjects(a, b);
	if (b) {
		const { use: u1, fallback: f1 } = a;
		const { use: u2, fallback: f2 } = b;
		if (u1 && u2) v.use = u1.concat(u2);
		if (f1 && f2) v.fallback = mergeObjects(f1, f2);
	}
	return v;
};
var SWRConfigContext = (0, import_react.createContext)({});
var SWRConfig$1 = (props) => {
	const { value } = props;
	const parentConfig = (0, import_react.useContext)(SWRConfigContext);
	const isFunctionalConfig = isFunction$1(value);
	const config = (0, import_react.useMemo)(() => isFunctionalConfig ? value(parentConfig) : value, [
		isFunctionalConfig,
		parentConfig,
		value
	]);
	const extendedConfig = (0, import_react.useMemo)(() => isFunctionalConfig ? config : mergeConfigs(parentConfig, config), [
		isFunctionalConfig,
		parentConfig,
		config
	]);
	const provider = config && config.provider;
	const cacheContextRef = (0, import_react.useRef)(void 0);
	if (provider && !cacheContextRef.current) cacheContextRef.current = initCache(provider(extendedConfig.cache || cache), config);
	const cacheContext = cacheContextRef.current;
	if (cacheContext) {
		extendedConfig.cache = cacheContext[0];
		extendedConfig.mutate = cacheContext[1];
	}
	useIsomorphicLayoutEffect(() => {
		if (cacheContext) {
			cacheContext[2] && cacheContext[2]();
			return cacheContext[3];
		}
	}, []);
	return (0, import_react.createElement)(SWRConfigContext.Provider, mergeObjects(props, { value: extendedConfig }));
};
//#endregion
//#region node_modules/swr/dist/_internal/constants.mjs
var INFINITE_PREFIX = "$inf$";
//#endregion
//#region node_modules/swr/dist/_internal/index.mjs
var enableDevtools = isWindowDefined && window.__SWR_DEVTOOLS_USE__;
var use$1 = enableDevtools ? window.__SWR_DEVTOOLS_USE__ : [];
var setupDevTools = () => {
	if (enableDevtools) window.__SWR_DEVTOOLS_REACT__ = import_react.default;
};
var normalize = (args) => {
	return isFunction$1(args[1]) ? [
		args[0],
		args[1],
		args[2] || {}
	] : [
		args[0],
		null,
		(args[1] === null ? args[2] : args[1]) || {}
	];
};
var useSWRConfig = () => {
	return mergeObjects(defaultConfig, (0, import_react.useContext)(SWRConfigContext));
};
var middleware = (useSWRNext) => (key_, fetcher_, config) => {
	return useSWRNext(key_, fetcher_ && ((...args) => {
		const [key] = serialize$1(key_);
		const [, , , PRELOAD] = SWRGlobalState.get(cache);
		if (key.startsWith("$inf$")) return fetcher_(...args);
		const req = PRELOAD[key];
		if (isUndefined$1(req)) return fetcher_(...args);
		delete PRELOAD[key];
		return req;
	}), config);
};
var BUILT_IN_MIDDLEWARE = use$1.concat(middleware);
var withArgs = (hook) => {
	return function useSWRArgs(...args) {
		const fallbackConfig = useSWRConfig();
		const [key, fn, _config] = normalize(args);
		const config = mergeConfigs(fallbackConfig, _config);
		let next = hook;
		const { use } = config;
		const middleware = (use || []).concat(BUILT_IN_MIDDLEWARE);
		for (let i = middleware.length; i--;) next = middleware[i](next);
		return next(key, fn || config.fetcher || null, config);
	};
};
var subscribeCallback = (key, callbacks, callback) => {
	const keyedRevalidators = callbacks[key] || (callbacks[key] = []);
	keyedRevalidators.push(callback);
	return () => {
		const index = keyedRevalidators.indexOf(callback);
		if (index >= 0) {
			keyedRevalidators[index] = keyedRevalidators[keyedRevalidators.length - 1];
			keyedRevalidators.pop();
		}
	};
};
var withMiddleware = (useSWR, middleware) => {
	return (...args) => {
		const [key, fn, config] = normalize(args);
		const uses = (config.use || []).concat(middleware);
		return useSWR(key, fn, {
			...config,
			use: uses
		});
	};
};
setupDevTools();
//#endregion
//#region node_modules/swr/dist/index/index.mjs
var use = import_react.use || ((thenable) => {
	switch (thenable.status) {
		case "pending": throw thenable;
		case "fulfilled": return thenable.value;
		case "rejected": throw thenable.reason;
		default:
			thenable.status = "pending";
			thenable.then((v) => {
				thenable.status = "fulfilled";
				thenable.value = v;
			}, (e) => {
				thenable.status = "rejected";
				thenable.reason = e;
			});
			throw thenable;
	}
});
var WITH_DEDUPE = { dedupe: true };
var useSWRHandler = (_key, fetcher, config) => {
	const { cache, compare, suspense, fallbackData, revalidateOnMount, revalidateIfStale, refreshInterval, refreshWhenHidden, refreshWhenOffline, keepPreviousData } = config;
	const [EVENT_REVALIDATORS, MUTATION, FETCH, PRELOAD] = SWRGlobalState.get(cache);
	const [key, fnArg] = serialize$1(_key);
	const initialMountedRef = (0, import_react.useRef)(false);
	const unmountedRef = (0, import_react.useRef)(false);
	const keyRef = (0, import_react.useRef)(key);
	const fetcherRef = (0, import_react.useRef)(fetcher);
	const configRef = (0, import_react.useRef)(config);
	const getConfig = () => configRef.current;
	const isActive = () => getConfig().isVisible() && getConfig().isOnline();
	const [getCache, setCache, subscribeCache, getInitialCache] = createCacheHelper(cache, key);
	const stateDependencies = (0, import_react.useRef)({}).current;
	const fallback = isUndefined$1(fallbackData) ? isUndefined$1(config.fallback) ? void 0 : config.fallback[key] : fallbackData;
	const isEqual = (prev, current) => {
		for (const _ in stateDependencies) {
			const t = _;
			if (t === "data") {
				if (!compare(prev[t], current[t])) {
					if (!isUndefined$1(prev[t])) return false;
					if (!compare(returnedData, current[t])) return false;
				}
			} else if (current[t] !== prev[t]) return false;
		}
		return true;
	};
	const getSnapshot = (0, import_react.useMemo)(() => {
		const shouldStartRequest = (() => {
			if (!key) return false;
			if (!fetcher) return false;
			if (!isUndefined$1(revalidateOnMount)) return revalidateOnMount;
			if (getConfig().isPaused()) return false;
			if (suspense) return false;
			return revalidateIfStale !== false;
		})();
		const getSelectedCache = (state) => {
			const snapshot = mergeObjects(state);
			delete snapshot._k;
			if (!shouldStartRequest) return snapshot;
			return {
				isValidating: true,
				isLoading: true,
				...snapshot
			};
		};
		const cachedData = getCache();
		const initialData = getInitialCache();
		const clientSnapshot = getSelectedCache(cachedData);
		const serverSnapshot = cachedData === initialData ? clientSnapshot : getSelectedCache(initialData);
		let memorizedSnapshot = clientSnapshot;
		return [() => {
			const newSnapshot = getSelectedCache(getCache());
			if (isEqual(newSnapshot, memorizedSnapshot)) {
				memorizedSnapshot.data = newSnapshot.data;
				memorizedSnapshot.isLoading = newSnapshot.isLoading;
				memorizedSnapshot.isValidating = newSnapshot.isValidating;
				memorizedSnapshot.error = newSnapshot.error;
				return memorizedSnapshot;
			} else {
				memorizedSnapshot = newSnapshot;
				return newSnapshot;
			}
		}, () => serverSnapshot];
	}, [cache, key]);
	const cached = (0, import_shim.useSyncExternalStore)((0, import_react.useCallback)((callback) => subscribeCache(key, (current, prev) => {
		if (!isEqual(prev, current)) callback();
	}), [cache, key]), getSnapshot[0], getSnapshot[1]);
	const isInitialMount = !initialMountedRef.current;
	const hasRevalidator = EVENT_REVALIDATORS[key] && EVENT_REVALIDATORS[key].length > 0;
	const cachedData = cached.data;
	const data = isUndefined$1(cachedData) ? fallback && isPromiseLike(fallback) ? use(fallback) : fallback : cachedData;
	const error = cached.error;
	const laggyDataRef = (0, import_react.useRef)(data);
	const returnedData = keepPreviousData ? isUndefined$1(cachedData) ? isUndefined$1(laggyDataRef.current) ? data : laggyDataRef.current : cachedData : data;
	const shouldDoInitialRevalidation = (() => {
		if (hasRevalidator && !isUndefined$1(error)) return false;
		if (isInitialMount && !isUndefined$1(revalidateOnMount)) return revalidateOnMount;
		if (getConfig().isPaused()) return false;
		if (suspense) return isUndefined$1(data) ? false : revalidateIfStale;
		return isUndefined$1(data) || revalidateIfStale;
	})();
	const defaultValidatingState = !!(key && fetcher && isInitialMount && shouldDoInitialRevalidation);
	const isValidating = isUndefined$1(cached.isValidating) ? defaultValidatingState : cached.isValidating;
	const isLoading = isUndefined$1(cached.isLoading) ? defaultValidatingState : cached.isLoading;
	const revalidate = (0, import_react.useCallback)(async (revalidateOpts) => {
		const currentFetcher = fetcherRef.current;
		if (!key || !currentFetcher || unmountedRef.current || getConfig().isPaused()) return false;
		let newData;
		let startAt;
		let loading = true;
		const opts = revalidateOpts || {};
		const shouldStartNewRequest = !FETCH[key] || !opts.dedupe;
		const callbackSafeguard = () => {
			if (IS_REACT_LEGACY) return !unmountedRef.current && key === keyRef.current && initialMountedRef.current;
			return key === keyRef.current;
		};
		const finalState = {
			isValidating: false,
			isLoading: false
		};
		const finishRequestAndUpdateState = () => {
			setCache(finalState);
		};
		const cleanupState = () => {
			const requestInfo = FETCH[key];
			if (requestInfo && requestInfo[1] === startAt) delete FETCH[key];
		};
		const initialState = { isValidating: true };
		if (isUndefined$1(getCache().data)) initialState.isLoading = true;
		try {
			if (shouldStartNewRequest) {
				setCache(initialState);
				if (config.loadingTimeout && isUndefined$1(getCache().data)) setTimeout(() => {
					if (loading && callbackSafeguard()) getConfig().onLoadingSlow(key, config);
				}, config.loadingTimeout);
				FETCH[key] = [currentFetcher(fnArg), getTimestamp()];
			}
			[newData, startAt] = FETCH[key];
			newData = await newData;
			if (shouldStartNewRequest) setTimeout(cleanupState, config.dedupingInterval);
			if (!FETCH[key] || FETCH[key][1] !== startAt) {
				if (shouldStartNewRequest) {
					if (callbackSafeguard()) getConfig().onDiscarded(key);
				}
				return false;
			}
			finalState.error = void 0;
			const mutationInfo = MUTATION[key];
			if (!isUndefined$1(mutationInfo) && (startAt <= mutationInfo[0] || startAt <= mutationInfo[1] || mutationInfo[1] === 0)) {
				finishRequestAndUpdateState();
				if (shouldStartNewRequest) {
					if (callbackSafeguard()) getConfig().onDiscarded(key);
				}
				return false;
			}
			const cacheData = getCache().data;
			finalState.data = compare(cacheData, newData) ? cacheData : newData;
			if (shouldStartNewRequest) {
				if (callbackSafeguard()) getConfig().onSuccess(newData, key, config);
			}
		} catch (err) {
			cleanupState();
			const currentConfig = getConfig();
			const { shouldRetryOnError } = currentConfig;
			if (!currentConfig.isPaused()) {
				finalState.error = err;
				if (shouldStartNewRequest && callbackSafeguard()) {
					currentConfig.onError(err, key, currentConfig);
					if (shouldRetryOnError === true || isFunction$1(shouldRetryOnError) && shouldRetryOnError(err)) {
						if (!getConfig().revalidateOnFocus || !getConfig().revalidateOnReconnect || isActive()) currentConfig.onErrorRetry(err, key, currentConfig, (_opts) => {
							const revalidators = EVENT_REVALIDATORS[key];
							if (revalidators && revalidators[0]) revalidators[0](3, _opts);
						}, {
							retryCount: (opts.retryCount || 0) + 1,
							dedupe: true
						});
					}
				}
			}
		}
		loading = false;
		finishRequestAndUpdateState();
		return true;
	}, [key, cache]);
	const boundMutate = (0, import_react.useCallback)((...args) => {
		return internalMutate(cache, keyRef.current, ...args);
	}, []);
	useIsomorphicLayoutEffect(() => {
		fetcherRef.current = fetcher;
		configRef.current = config;
		if (!isUndefined$1(cachedData)) laggyDataRef.current = cachedData;
	});
	useIsomorphicLayoutEffect(() => {
		if (!key) return;
		const softRevalidate = revalidate.bind(void 0, WITH_DEDUPE);
		let nextFocusRevalidatedAt = 0;
		if (getConfig().revalidateOnFocus) nextFocusRevalidatedAt = Date.now() + getConfig().focusThrottleInterval;
		const onRevalidate = (type, opts = {}) => {
			if (type == 0) {
				const now = Date.now();
				if (getConfig().revalidateOnFocus && now > nextFocusRevalidatedAt && isActive()) {
					nextFocusRevalidatedAt = now + getConfig().focusThrottleInterval;
					softRevalidate();
				}
			} else if (type == 1) {
				if (getConfig().revalidateOnReconnect && isActive()) softRevalidate();
			} else if (type == 2) return revalidate();
			else if (type == 3) return revalidate(opts);
		};
		const unsubEvents = subscribeCallback(key, EVENT_REVALIDATORS, onRevalidate);
		unmountedRef.current = false;
		keyRef.current = key;
		initialMountedRef.current = true;
		setCache({ _k: fnArg });
		if (shouldDoInitialRevalidation) {
			if (!FETCH[key]) {
				if (isUndefined$1(data) || IS_SERVER) softRevalidate();
				else rAF(softRevalidate);
			}
		}
		return () => {
			unmountedRef.current = true;
			unsubEvents();
		};
	}, [key]);
	useIsomorphicLayoutEffect(() => {
		let timer;
		function next() {
			const interval = isFunction$1(refreshInterval) ? refreshInterval(getCache().data) : refreshInterval;
			if (interval && timer !== -1) timer = setTimeout(execute, interval);
		}
		function execute() {
			if (!getCache().error && (refreshWhenHidden || getConfig().isVisible()) && (refreshWhenOffline || getConfig().isOnline())) revalidate(WITH_DEDUPE).then(next);
			else next();
		}
		next();
		return () => {
			if (timer) {
				clearTimeout(timer);
				timer = -1;
			}
		};
	}, [
		refreshInterval,
		refreshWhenHidden,
		refreshWhenOffline,
		key
	]);
	(0, import_react.useDebugValue)(returnedData);
	if (suspense && isUndefined$1(data) && key) {
		if (!IS_REACT_LEGACY && IS_SERVER) throw new Error("Fallback data is required when using Suspense in SSR.");
		fetcherRef.current = fetcher;
		configRef.current = config;
		unmountedRef.current = false;
		const req = PRELOAD[key];
		if (!isUndefined$1(req)) use(boundMutate(req));
		if (isUndefined$1(error)) {
			const promise = revalidate(WITH_DEDUPE);
			if (!isUndefined$1(returnedData)) {
				promise.status = "fulfilled";
				promise.value = true;
			}
			use(promise);
		} else throw error;
	}
	return {
		mutate: boundMutate,
		get data() {
			stateDependencies.data = true;
			return returnedData;
		},
		get error() {
			stateDependencies.error = true;
			return error;
		},
		get isValidating() {
			stateDependencies.isValidating = true;
			return isValidating;
		},
		get isLoading() {
			stateDependencies.isLoading = true;
			return isLoading;
		}
	};
};
var SWRConfig = OBJECT$1.defineProperty(SWRConfig$1, "defaultValue", { value: defaultConfig });
/**
* A hook to fetch data.
*
* @link https://swr.vercel.app
* @example
* ```jsx
* import useSWR from 'swr'
* function Profile() {
*   const { data, error, isLoading } = useSWR('/api/user', fetcher)
*   if (error) return <div>failed to load</div>
*   if (isLoading) return <div>loading...</div>
*   return <div>hello {data.name}!</div>
* }
* ```
*/ var useSWR = withArgs(useSWRHandler);
//#endregion
//#region node_modules/swr/dist/infinite/index.mjs
var UNDEFINED = void 0;
var OBJECT = Object;
var isUndefined = (v) => v === UNDEFINED;
var isFunction = (v) => typeof v == "function";
var table = /* @__PURE__ */ new WeakMap();
var getTypeName = (value) => OBJECT.prototype.toString.call(value);
var isObjectTypeName = (typeName, type) => typeName === `[object ${type}]`;
var counter = 0;
var stableHash = (arg) => {
	const type = typeof arg;
	const typeName = getTypeName(arg);
	const isDate = isObjectTypeName(typeName, "Date");
	const isRegex = isObjectTypeName(typeName, "RegExp");
	const isPlainObject = isObjectTypeName(typeName, "Object");
	let result;
	let index;
	if (OBJECT(arg) === arg && !isDate && !isRegex) {
		result = table.get(arg);
		if (result) return result;
		result = ++counter + "~";
		table.set(arg, result);
		if (Array.isArray(arg)) {
			result = "@";
			for (index = 0; index < arg.length; index++) result += stableHash(arg[index]) + ",";
			table.set(arg, result);
		}
		if (isPlainObject) {
			result = "#";
			const keys = OBJECT.keys(arg).sort();
			while (!isUndefined(index = keys.pop())) if (!isUndefined(arg[index])) result += index + ":" + stableHash(arg[index]) + ",";
			table.set(arg, result);
		}
	} else result = isDate ? arg.toJSON() : type == "symbol" ? arg.toString() : type == "string" ? JSON.stringify(arg) : "" + arg;
	return result;
};
var serialize = (key) => {
	if (isFunction(key)) try {
		key = key();
	} catch (err) {
		key = "";
	}
	const args = key;
	key = typeof key == "string" ? key : (Array.isArray(key) ? key.length : key) ? stableHash(key) : "";
	return [key, args];
};
var getFirstPageKey = (getKey) => {
	return serialize(getKey ? getKey(0, null) : null)[0];
};
var EMPTY_PROMISE = Promise.resolve();
var infinite = (useSWRNext) => (getKey, fn, config) => {
	const didMountRef = (0, import_react.useRef)(false);
	const { cache: cache$1, initialSize = 1, revalidateAll = false, persistSize = false, revalidateFirstPage = true, revalidateOnMount = false, parallel = false } = config;
	const [, , , PRELOAD] = SWRGlobalState.get(cache);
	let infiniteKey;
	try {
		infiniteKey = getFirstPageKey(getKey);
		if (infiniteKey) infiniteKey = INFINITE_PREFIX + infiniteKey;
	} catch (err) {}
	const [get, set, subscribeCache] = createCacheHelper(cache$1, infiniteKey);
	const getSnapshot = (0, import_react.useCallback)(() => {
		return isUndefined$1(get()._l) ? initialSize : get()._l;
	}, [
		cache$1,
		infiniteKey,
		initialSize
	]);
	(0, import_shim.useSyncExternalStore)((0, import_react.useCallback)((callback) => {
		if (infiniteKey) return subscribeCache(infiniteKey, () => {
			callback();
		});
		return () => {};
	}, [cache$1, infiniteKey]), getSnapshot, getSnapshot);
	const resolvePageSize = (0, import_react.useCallback)(() => {
		const cachedPageSize = get()._l;
		return isUndefined$1(cachedPageSize) ? initialSize : cachedPageSize;
	}, [infiniteKey, initialSize]);
	const lastPageSizeRef = (0, import_react.useRef)(resolvePageSize());
	useIsomorphicLayoutEffect(() => {
		if (!didMountRef.current) {
			didMountRef.current = true;
			return;
		}
		if (infiniteKey) set({ _l: persistSize ? lastPageSizeRef.current : resolvePageSize() });
	}, [infiniteKey, cache$1]);
	const shouldRevalidateOnMount = revalidateOnMount && !didMountRef.current;
	const swr = useSWRNext(infiniteKey, async (key) => {
		const forceRevalidateAll = get()._i;
		const shouldRevalidatePage = get()._r;
		set({ _r: void 0 });
		const data = [];
		const pageSize = resolvePageSize();
		const [getCache] = createCacheHelper(cache$1, key);
		const cacheData = getCache().data;
		const revalidators = [];
		let previousPageData = null;
		for (let i = 0; i < pageSize; ++i) {
			const [pageKey, pageArg] = serialize$1(getKey(i, parallel ? null : previousPageData));
			if (!pageKey) break;
			const [getSWRCache, setSWRCache] = createCacheHelper(cache$1, pageKey);
			let pageData = getSWRCache().data;
			const shouldFetchPage = revalidateAll || forceRevalidateAll || isUndefined$1(pageData) || revalidateFirstPage && !i && !isUndefined$1(cacheData) || shouldRevalidateOnMount || cacheData && !isUndefined$1(cacheData[i]) && !config.compare(cacheData[i], pageData);
			if (fn && (typeof shouldRevalidatePage === "function" ? shouldRevalidatePage(pageData, pageArg) : shouldFetchPage)) {
				const revalidate = async () => {
					if (!(pageKey in PRELOAD)) pageData = await fn(pageArg);
					else {
						const req = PRELOAD[pageKey];
						delete PRELOAD[pageKey];
						pageData = await req;
					}
					setSWRCache({
						data: pageData,
						_k: pageArg
					});
					data[i] = pageData;
				};
				if (parallel) revalidators.push(revalidate);
				else await revalidate();
			} else data[i] = pageData;
			if (!parallel) previousPageData = pageData;
		}
		if (parallel) await Promise.all(revalidators.map((r) => r()));
		set({ _i: void 0 });
		return data;
	}, config);
	const mutate = (0, import_react.useCallback)(function(data, opts) {
		const options = typeof opts === "boolean" ? { revalidate: opts } : opts || {};
		const shouldRevalidate = options.revalidate !== false;
		if (!infiniteKey) return EMPTY_PROMISE;
		if (shouldRevalidate) {
			if (!isUndefined$1(data)) set({
				_i: false,
				_r: options.revalidate
			});
			else set({
				_i: true,
				_r: options.revalidate
			});
		}
		return arguments.length ? swr.mutate(data, {
			...options,
			revalidate: shouldRevalidate
		}) : swr.mutate();
	}, [infiniteKey, cache$1]);
	const setSize = (0, import_react.useCallback)((arg) => {
		if (!infiniteKey) return EMPTY_PROMISE;
		const [, changeSize] = createCacheHelper(cache$1, infiniteKey);
		let size;
		if (isFunction$1(arg)) size = arg(resolvePageSize());
		else if (typeof arg == "number") size = arg;
		if (typeof size != "number") return EMPTY_PROMISE;
		changeSize({ _l: size });
		lastPageSizeRef.current = size;
		const data = [];
		const [getInfiniteCache] = createCacheHelper(cache$1, infiniteKey);
		let previousPageData = null;
		for (let i = 0; i < size; ++i) {
			const [pageKey] = serialize$1(getKey(i, previousPageData));
			const [getCache] = createCacheHelper(cache$1, pageKey);
			const pageData = pageKey ? getCache().data : void 0;
			if (isUndefined$1(pageData)) return mutate(getInfiniteCache().data);
			data.push(pageData);
			previousPageData = pageData;
		}
		return mutate(data);
	}, [
		infiniteKey,
		cache$1,
		mutate,
		resolvePageSize
	]);
	return {
		size: resolvePageSize(),
		setSize,
		mutate,
		get data() {
			return swr.data;
		},
		get error() {
			return swr.error;
		},
		get isValidating() {
			return swr.isValidating;
		},
		get isLoading() {
			return swr.isLoading;
		}
	};
};
var useSWRInfinite = withMiddleware(useSWR, infinite);
//#endregion
//#region node_modules/dequal/dist/index.mjs
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
	for (key of iter.keys()) if (dequal(key, tar)) return key;
}
function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;
	if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (ctor === Array) {
			if ((len = foo.length) === bar.length) while (len-- && dequal(foo[len], bar[len]));
			return len === -1;
		}
		if (ctor === Set) {
			if (foo.size !== bar.size) return false;
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === "object") {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}
		if (ctor === Map) {
			if (foo.size !== bar.size) return false;
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === "object") {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) return false;
			}
			return true;
		}
		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len = foo.byteLength) === bar.byteLength) while (len-- && foo.getInt8(len) === bar.getInt8(len));
			return len === -1;
		}
		if (ArrayBuffer.isView(foo)) {
			if ((len = foo.byteLength) === bar.byteLength) while (len-- && foo[len] === bar[len]);
			return len === -1;
		}
		if (!ctor || typeof foo === "object") {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}
	return foo !== foo && bar !== bar;
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/react/index.mjs
/**
* Assert that the context value exists, otherwise throw an error.
*
* @internal
*/
function assertContextExists(contextVal, msgOrCtx) {
	if (!contextVal) throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : /* @__PURE__ */ new Error(`${msgOrCtx.displayName} not found`);
}
/**
* Create and return a Context and two hooks that return the context value.
* The Context type is derived from the type passed in by the user.
*
* The first hook returned guarantees that the context exists so the returned value is always `CtxValue`
* The second hook makes no guarantees, so the returned value can be `CtxValue | undefined`
*
* @internal
*/
var createContextAndHook = (displayName, options) => {
	const { assertCtxFn = assertContextExists } = options || {};
	const Ctx = import_react.createContext(void 0);
	Ctx.displayName = displayName;
	const useCtx = () => {
		const ctx = import_react.useContext(Ctx);
		assertCtxFn(ctx, `${displayName} not found`);
		return ctx.value;
	};
	const useCtxWithoutGuarantee = () => {
		const ctx = import_react.useContext(Ctx);
		return ctx ? ctx.value : {};
	};
	return [
		Ctx,
		useCtx,
		useCtxWithoutGuarantee
	];
};
/**
* @internal
*/
function SWRConfigCompat({ swrConfig, children }) {
	return /* @__PURE__ */ import_react.createElement(SWRConfig, { value: swrConfig }, children);
}
var [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
var [UserContext, useUserContext] = createContextAndHook("UserContext");
var [ClientContext, useClientContext] = createContextAndHook("ClientContext");
var [SessionContext, useSessionContext] = createContextAndHook("SessionContext");
import_react.createContext({});
var [CheckoutContext, useCheckoutContext] = createContextAndHook("CheckoutContext");
var __experimental_CheckoutProvider = ({ children, ...rest }) => {
	return /* @__PURE__ */ import_react.createElement(CheckoutContext.Provider, { value: { value: rest } }, children);
};
var [OrganizationContextInternal, useOrganizationContext] = createContextAndHook("OrganizationContext");
var OrganizationProvider = ({ children, organization, swrConfig }) => {
	return /* @__PURE__ */ import_react.createElement(SWRConfigCompat, { swrConfig }, /* @__PURE__ */ import_react.createElement(OrganizationContextInternal.Provider, { value: { value: { organization } } }, children));
};
/**
* @internal
*/
function useAssertWrappedByClerkProvider$1(displayNameOrFn) {
	if (!import_react.useContext(ClerkInstanceContext)) {
		if (typeof displayNameOrFn === "function") {
			displayNameOrFn();
			return;
		}
		throw new Error(`${displayNameOrFn} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim());
	}
}
var STABLE_KEYS = {
	USER_MEMBERSHIPS_KEY: "userMemberships",
	USER_INVITATIONS_KEY: "userInvitations",
	USER_SUGGESTIONS_KEY: "userSuggestions",
	DOMAINS_KEY: "domains",
	MEMBERSHIP_REQUESTS_KEY: "membershipRequests",
	MEMBERSHIPS_KEY: "memberships",
	INVITATIONS_KEY: "invitations",
	PLANS_KEY: "billing-plans",
	SUBSCRIPTION_KEY: "billing-subscription",
	PAYMENT_METHODS_KEY: "billing-payment-methods",
	PAYMENT_ATTEMPTS_KEY: "billing-payment-attempts",
	STATEMENTS_KEY: "billing-statements",
	API_KEYS_KEY: "apiKeys",
	ORGANIZATION_CREATION_DEFAULTS_KEY: "organizationCreationDefaults"
};
/**
* @internal
*/
function createCacheKeys(params) {
	return {
		queryKey: [
			params.stablePrefix,
			params.authenticated,
			params.tracked,
			params.untracked
		],
		invalidationKey: [
			params.stablePrefix,
			params.authenticated,
			params.tracked
		],
		stableKey: params.stablePrefix,
		authenticated: params.authenticated
	};
}
/**
* @internal
*/
function toSWRQuery(keys) {
	const { queryKey } = keys;
	return {
		type: queryKey[0],
		...queryKey[2],
		...queryKey[3].args
	};
}
/**
* A hook that safely merges user-provided pagination options with default values.
* It caches initial pagination values (page and size) until component unmount to prevent unwanted rerenders.
*
* @internal
*
* @example
* ```typescript
* // Example 1: With user-provided options
* const userOptions = { initialPage: 2, pageSize: 20, infinite: true };
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(userOptions, defaults);
* // Returns { initialPage: 2, pageSize: 20, infinite: true }
*
* // Example 2: With boolean true (use defaults)
* const params = true;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
*
* // Example 3: With undefined options (fallback to defaults)
* const params = undefined;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
* ```
*/
var useWithSafeValues = (params, defaultValues) => {
	const shouldUseDefaults = typeof params === "boolean" && params;
	const initialPageRef = (0, import_react.useRef)(shouldUseDefaults ? defaultValues.initialPage : params?.initialPage ?? defaultValues.initialPage);
	const pageSizeRef = (0, import_react.useRef)(shouldUseDefaults ? defaultValues.pageSize : params?.pageSize ?? defaultValues.pageSize);
	const newObj = {};
	for (const key of Object.keys(defaultValues)) newObj[key] = shouldUseDefaults ? defaultValues[key] : params?.[key] ?? defaultValues[key];
	return {
		...newObj,
		initialPage: initialPageRef.current,
		pageSize: pageSizeRef.current
	};
};
/**
* Returns an object containing only the keys from the first object that are not present in the second object.
* Useful for extracting unique parameters that should be passed to a request while excluding common cache keys.
*
* @internal
*
* @example
* ```typescript
* // Example 1: Basic usage
* const obj1 = { name: 'John', age: 30, city: 'NY' };
* const obj2 = { name: 'John', age: 30 };
* getDifferentKeys(obj1, obj2); // Returns { city: 'NY' }
*
* // Example 2: With cache keys
* const requestParams = { page: 1, limit: 10, userId: '123' };
* const cacheKeys = { userId: '123' };
* getDifferentKeys(requestParams, cacheKeys); // Returns { page: 1, limit: 10 }
* ```
*/
function getDifferentKeys(obj1, obj2) {
	const keysSet = new Set(Object.keys(obj2));
	const differentKeysObject = {};
	for (const key1 of Object.keys(obj1)) if (!keysSet.has(key1)) differentKeysObject[key1] = obj1[key1];
	return differentKeysObject;
}
/**
* A hook that retains the previous value of a primitive type.
* It uses a ref to prevent causing unnecessary re-renders.
*
* @internal
*
* @example
* ```
* Render 1: value = 'A' → returns null
* Render 2: value = 'B' → returns 'A'
* Render 3: value = 'B' → returns 'A'
* Render 4: value = 'B' → returns 'A'
* Render 5: value = 'C' → returns 'B'
* ```
*/
function usePreviousValue(value) {
	const currentRef = (0, import_react.useRef)(value);
	const previousRef = (0, import_react.useRef)(null);
	if (currentRef.current !== value) {
		previousRef.current = currentRef.current;
		currentRef.current = value;
	}
	return previousRef.current;
}
var cachingSWROptions = {
	dedupingInterval: 6e4,
	focusThrottleInterval: 12e4
};
var cachingSWRInfiniteOptions = {
	...cachingSWROptions,
	revalidateFirstPage: false
};
/**
* A flexible pagination hook that supports both traditional pagination and infinite loading.
* It provides a unified API for handling paginated data fetching, with built-in caching through SWR.
* The hook can operate in two modes:
* - Traditional pagination: Fetches one page at a time with page navigation
* - Infinite loading: Accumulates data as more pages are loaded.
*
* Features:
* - Cache management with SWR
* - Loading and error states
* - Page navigation helpers
* - Data revalidation and updates
* - Support for keeping previous data while loading.
*
* @internal
*/
var usePagesOrInfinite = (params) => {
	const { fetcher, config, keys } = params;
	const [paginatedPage, setPaginatedPage] = (0, import_react.useState)(config.initialPage ?? 1);
	const initialPageRef = (0, import_react.useRef)(config.initialPage ?? 1);
	const pageSizeRef = (0, import_react.useRef)(config.pageSize ?? 10);
	const enabled = config.enabled ?? true;
	const cacheMode = config.__experimental_mode === "cache";
	const triggerInfinite = config.infinite ?? false;
	const keepPreviousData = config.keepPreviousData ?? false;
	const isSignedIn = config.isSignedIn;
	const pagesCacheKey = {
		...toSWRQuery(keys),
		initialPage: paginatedPage,
		pageSize: pageSizeRef.current
	};
	const previousIsSignedIn = usePreviousValue(isSignedIn);
	const shouldFetch = !triggerInfinite && enabled && (!cacheMode ? !!fetcher : true);
	const { data: swrData, isValidating: swrIsValidating, isLoading: swrIsLoading, error: swrError, mutate: swrMutate } = useSWR(typeof isSignedIn === "boolean" ? previousIsSignedIn === true && isSignedIn === false ? pagesCacheKey : isSignedIn ? shouldFetch ? pagesCacheKey : null : null : shouldFetch ? pagesCacheKey : null, !cacheMode && !!fetcher ? (cacheKeyParams) => {
		if (isSignedIn === false || shouldFetch === false) return null;
		return fetcher(getDifferentKeys(cacheKeyParams, {
			type: keys.queryKey[0],
			...keys.queryKey[2]
		}));
	} : null, {
		keepPreviousData,
		...cachingSWROptions
	});
	const { data: swrInfiniteData, isLoading: swrInfiniteIsLoading, isValidating: swrInfiniteIsValidating, error: swrInfiniteError, size, setSize, mutate: swrInfiniteMutate } = useSWRInfinite((pageIndex) => {
		if (!triggerInfinite || !enabled || isSignedIn === false) return null;
		return {
			...toSWRQuery(keys),
			initialPage: initialPageRef.current + pageIndex,
			pageSize: pageSizeRef.current
		};
	}, (cacheKeyParams) => {
		const requestParams = getDifferentKeys(cacheKeyParams, {
			type: keys.queryKey[0],
			...keys.queryKey[2]
		});
		return fetcher?.(requestParams);
	}, cachingSWRInfiniteOptions);
	const page = (0, import_react.useMemo)(() => {
		if (triggerInfinite) return size;
		return paginatedPage;
	}, [
		triggerInfinite,
		size,
		paginatedPage
	]);
	const fetchPage = (0, import_react.useCallback)((numberOrgFn) => {
		if (triggerInfinite) {
			setSize(numberOrgFn);
			return;
		}
		return setPaginatedPage(numberOrgFn);
	}, [setSize, triggerInfinite]);
	const data = (0, import_react.useMemo)(() => {
		if (triggerInfinite) return swrInfiniteData?.map((a) => a?.data).flat() ?? [];
		return swrData?.data ?? [];
	}, [
		triggerInfinite,
		swrData,
		swrInfiniteData
	]);
	const count = (0, import_react.useMemo)(() => {
		if (triggerInfinite) return swrInfiniteData?.[swrInfiniteData?.length - 1]?.total_count || 0;
		return swrData?.total_count ?? 0;
	}, [
		triggerInfinite,
		swrData,
		swrInfiniteData
	]);
	const isLoading = triggerInfinite ? swrInfiniteIsLoading : swrIsLoading;
	const isFetching = triggerInfinite ? swrInfiniteIsValidating : swrIsValidating;
	const error = (triggerInfinite ? swrInfiniteError : swrError) ?? null;
	const isError = !!error;
	const fetchNext = (0, import_react.useCallback)(() => {
		fetchPage((n) => Math.max(0, n + 1));
	}, [fetchPage]);
	const fetchPrevious = (0, import_react.useCallback)(() => {
		fetchPage((n) => Math.max(0, n - 1));
	}, [fetchPage]);
	const offsetCount = (initialPageRef.current - 1) * pageSizeRef.current;
	return {
		data,
		count,
		error,
		isLoading,
		isFetching,
		isError,
		page,
		pageCount: Math.ceil((count - offsetCount) / pageSizeRef.current),
		fetchPage,
		fetchNext,
		fetchPrevious,
		hasNextPage: count - offsetCount * pageSizeRef.current > page * pageSizeRef.current,
		hasPreviousPage: (page - 1) * pageSizeRef.current > offsetCount * pageSizeRef.current,
		revalidate: triggerInfinite ? () => swrInfiniteMutate() : () => swrMutate(),
		setData: triggerInfinite ? (value) => swrInfiniteMutate(value, { revalidate: false }) : (value) => swrMutate(value, { revalidate: false })
	};
};
/**
* > [!WARNING]
* > This hook should only be used for advanced use cases, such as building a completely custom OAuth flow or as an escape hatch to access to the `Clerk` object.
*
* The `useClerk()` hook provides access to the [`Clerk`](https://clerk.com/docs/reference/javascript/clerk) object, allowing you to build alternatives to any Clerk Component.
*
* @function
*
* @returns The `useClerk()` hook returns the `Clerk` object, which includes all the methods and properties listed in the [`Clerk` reference](https://clerk.com/docs/reference/javascript/clerk).
*
* @example
*
* The following example uses the `useClerk()` hook to access the `clerk` object. The `clerk` object is used to call the [`openSignIn()`](https://clerk.com/docs/reference/javascript/clerk#sign-in) method to open the sign-in modal.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useClerk } from '@clerk/clerk-react'
*
* export default function Home() {
*   const clerk = useClerk()
*
*   return <button onClick={() => clerk.openSignIn({})}>Sign in</button>
* }
* ```
*
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-clerk.md#nextjs-01}
*
* </Tab>
* </Tabs>
*/
var useClerk = () => {
	useAssertWrappedByClerkProvider$1("useClerk");
	return useClerkInstanceContext();
};
typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
/**
* @internal
*/
var isDeeplyEqual = dequal;
/**
* @internal
*/
function useBillingHookEnabled(params) {
	const clerk = useClerkInstanceContext();
	const enabledFromParam = params?.enabled ?? true;
	const environment = clerk.__unstable__environment;
	const user = useUserContext();
	const { organization } = useOrganizationContext();
	const isOrganization = params?.for === "organization";
	const billingEnabled = isOrganization ? environment?.commerceSettings.billing.organization.enabled : environment?.commerceSettings.billing.user.enabled;
	const requireUserAndOrganizationWhenAuthenticated = params?.authenticated ?? true ? (isOrganization ? Boolean(organization?.id) : true) && Boolean(user?.id) : true;
	return billingEnabled && enabledFromParam && clerk.loaded && requireUserAndOrganizationWhenAuthenticated;
}
/**
* A hook factory that creates paginated data fetching hooks for commerce-related resources.
* It provides a standardized way to create hooks that can fetch either user or Organization resources
* with built-in pagination support.
*
* The generated hooks handle:
* - Clerk authentication context
* - Resource-specific data fetching
* - Pagination (both traditional and infinite scroll)
* - Telemetry tracking
* - Type safety for the specific resource.
*
* @internal
*/
function createBillingPaginatedHook({ hookName: hookName$4, resourceType, useFetcher, options }) {
	return function useBillingHook(params) {
		const { for: _for, enabled: externalEnabled, ...paginationParams } = params || {};
		const safeFor = _for || "user";
		useAssertWrappedByClerkProvider$1(hookName$4);
		const fetchFn = useFetcher(safeFor);
		const safeValues = useWithSafeValues(paginationParams, {
			initialPage: 1,
			pageSize: 10,
			keepPreviousData: false,
			infinite: false,
			__experimental_mode: void 0
		});
		const clerk = useClerkInstanceContext();
		const user = useUserContext();
		const { organization } = useOrganizationContext();
		clerk.telemetry?.record(eventMethodCalled(hookName$4));
		const isForOrganization = safeFor === "organization";
		const billingEnabled = useBillingHookEnabled({
			for: safeFor,
			enabled: externalEnabled,
			authenticated: !options?.unauthenticated
		});
		const hookParams = typeof paginationParams === "undefined" ? void 0 : {
			initialPage: safeValues.initialPage,
			pageSize: safeValues.pageSize,
			...options?.unauthenticated ? {} : isForOrganization ? { orgId: organization?.id } : {}
		};
		const isEnabled = !!hookParams && clerk.loaded && !!billingEnabled;
		return usePagesOrInfinite({
			fetcher: fetchFn,
			config: {
				keepPreviousData: safeValues.keepPreviousData,
				infinite: safeValues.infinite,
				enabled: isEnabled,
				...options?.unauthenticated ? {} : { isSignedIn: user !== null },
				__experimental_mode: safeValues.__experimental_mode,
				initialPage: safeValues.initialPage,
				pageSize: safeValues.pageSize
			},
			keys: createCacheKeys({
				stablePrefix: resourceType,
				authenticated: !options?.unauthenticated,
				tracked: options?.unauthenticated ? { for: safeFor } : {
					userId: user?.id,
					...isForOrganization ? { ["_orgId"]: organization?.id } : {}
				},
				untracked: { args: hookParams }
			})
		});
	};
}
createBillingPaginatedHook({
	hookName: "useStatements",
	resourceType: STABLE_KEYS.STATEMENTS_KEY,
	useFetcher: () => {
		const clerk = useClerkInstanceContext();
		if (clerk.loaded) return clerk.billing.getStatements;
	}
});
createBillingPaginatedHook({
	hookName: "usePaymentAttempts",
	resourceType: STABLE_KEYS.PAYMENT_ATTEMPTS_KEY,
	useFetcher: () => {
		const clerk = useClerkInstanceContext();
		if (clerk.loaded) return clerk.billing.getPaymentAttempts;
	}
});
createBillingPaginatedHook({
	hookName: "usePaymentMethods",
	resourceType: STABLE_KEYS.PAYMENT_METHODS_KEY,
	useFetcher: (resource) => {
		const { organization } = useOrganizationContext();
		const user = useUserContext();
		if (resource === "organization") return organization?.getPaymentMethods;
		return user?.getPaymentMethods;
	}
});
createBillingPaginatedHook({
	hookName: "usePlans",
	resourceType: STABLE_KEYS.PLANS_KEY,
	useFetcher: (_for) => {
		const clerk = useClerkInstanceContext();
		if (!clerk.loaded) return;
		return (params) => clerk.billing.getPlans({
			...params,
			for: _for
		});
	},
	options: { unauthenticated: true }
});
var usePrevious = (value) => {
	const ref = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};
var useAttachEvent = (element, event, cb) => {
	const cbDefined = !!cb;
	const cbRef = (0, import_react.useRef)(cb);
	(0, import_react.useEffect)(() => {
		cbRef.current = cb;
	}, [cb]);
	(0, import_react.useEffect)(() => {
		if (!cbDefined || !element) return () => {};
		const decoratedCb = (...args) => {
			if (cbRef.current) cbRef.current(...args);
		};
		element.on(event, decoratedCb);
		return () => {
			element.off(event, decoratedCb);
		};
	}, [
		cbDefined,
		event,
		element,
		cbRef
	]);
};
var ElementsContext = import_react.createContext(null);
ElementsContext.displayName = "ElementsContext";
var parseElementsContext = (ctx, useCase) => {
	if (!ctx) throw new Error(`Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`);
	return ctx;
};
var isUnknownObject = (raw) => {
	return raw !== null && typeof raw === "object";
};
var extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys) => {
	if (!isUnknownObject(options)) return null;
	return Object.keys(options).reduce((newOptions, key) => {
		const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
		if (immutableKeys.includes(key)) {
			if (isUpdated) console.warn(`Unsupported prop change: options.${key} is not a mutable property.`);
			return newOptions;
		}
		if (!isUpdated) return newOptions;
		return {
			...newOptions || {},
			[key]: options[key]
		};
	}, null);
};
var PLAIN_OBJECT_STR = "[object Object]";
var isEqual = (left, right) => {
	if (!isUnknownObject(left) || !isUnknownObject(right)) return left === right;
	const leftArray = Array.isArray(left);
	if (leftArray !== Array.isArray(right)) return false;
	const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
	if (leftPlainObject !== (Object.prototype.toString.call(right) === PLAIN_OBJECT_STR)) return false;
	if (!leftPlainObject && !leftArray) return left === right;
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	const keySet = {};
	for (let i = 0; i < leftKeys.length; i += 1) keySet[leftKeys[i]] = true;
	for (let i = 0; i < rightKeys.length; i += 1) keySet[rightKeys[i]] = true;
	const allKeys = Object.keys(keySet);
	if (allKeys.length !== leftKeys.length) return false;
	const l = left;
	const r = right;
	const pred = (key) => {
		return isEqual(l[key], r[key]);
	};
	return allKeys.every(pred);
};
var useElementsOrCheckoutSdkContextWithUseCase = (useCaseString) => {
	return parseElementsContext(import_react.useContext(ElementsContext), useCaseString);
};
var capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var createElementComponent = (type, isServer) => {
	const displayName = `${capitalized(type)}Element`;
	const ClientElement = ({ id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange }) => {
		const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
		const elements = "elements" in ctx ? ctx.elements : null;
		const [element, setElement] = import_react.useState(null);
		const elementRef = import_react.useRef(null);
		const domNode = import_react.useRef(null);
		const [isReady, setReady] = (0, import_react.useState)(false);
		useAttachEvent(element, "blur", onBlur);
		useAttachEvent(element, "focus", onFocus);
		useAttachEvent(element, "escape", onEscape);
		useAttachEvent(element, "click", onClick);
		useAttachEvent(element, "loaderror", onLoadError);
		useAttachEvent(element, "loaderstart", onLoaderStart);
		useAttachEvent(element, "networkschange", onNetworksChange);
		useAttachEvent(element, "confirm", onConfirm);
		useAttachEvent(element, "cancel", onCancel);
		useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
		useAttachEvent(element, "shippingratechange", onShippingRateChange);
		useAttachEvent(element, "change", onChange);
		let readyCallback;
		if (onReady) readyCallback = () => {
			setReady(true);
			onReady(element);
		};
		useAttachEvent(element, "ready", readyCallback);
		import_react.useLayoutEffect(() => {
			if (elementRef.current === null && domNode.current !== null && elements) {
				let newElement = null;
				if (elements) newElement = elements.create(type, options);
				elementRef.current = newElement;
				setElement(newElement);
				if (newElement) newElement.mount(domNode.current);
			}
		}, [elements, options]);
		const prevOptions = usePrevious(options);
		import_react.useEffect(() => {
			if (!elementRef.current) return;
			const updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
			if (updates && "update" in elementRef.current) elementRef.current.update(updates);
		}, [options, prevOptions]);
		import_react.useLayoutEffect(() => {
			return () => {
				if (elementRef.current && typeof elementRef.current.destroy === "function") try {
					elementRef.current.destroy();
					elementRef.current = null;
				} catch {}
			};
		}, []);
		return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, !isReady && fallback, /* @__PURE__ */ import_react.createElement("div", {
			id,
			style: {
				height: isReady ? "unset" : "0px",
				visibility: isReady ? "visible" : "hidden"
			},
			className,
			ref: domNode
		}));
	};
	const ServerElement = (props) => {
		useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
		const { id, className } = props;
		return /* @__PURE__ */ import_react.createElement("div", {
			id,
			className
		});
	};
	const Element = isServer ? ServerElement : ClientElement;
	Element.displayName = displayName;
	Element.__elementType = type;
	return Element;
};
createElementComponent("payment", typeof window === "undefined");
var [PaymentElementContext, usePaymentElementContext] = createContextAndHook("PaymentElementContext");
var [StripeUtilsContext, useStripeUtilsContext] = createContextAndHook("StripeUtilsContext");
//#endregion
//#region node_modules/@clerk/clerk-react/dist/chunk-3EQWAEPK.mjs
var errorThrower$1 = buildErrorThrower({ packageName: "@clerk/clerk-react" });
function setErrorThrowerOptions(options) {
	errorThrower$1.setMessages(options).setPackageName(options);
}
var [AuthContext, useAuthContext] = createContextAndHook("AuthContext");
var IsomorphicClerkContext = ClerkInstanceContext;
var useIsomorphicClerkContext = useClerkInstanceContext;
var multipleClerkProvidersError = "You've added multiple <ClerkProvider> components in your React component tree. Wrap your components in a single <ClerkProvider>.";
var multipleChildrenInButtonComponent = (name) => `You've passed multiple children components to <${name}/>. You can only pass a single child component or text.`;
var invalidStateError = "Invalid state. Feel free to submit a bug or reach out to support here: https://clerk.com/support";
var unsupportedNonBrowserDomainOrProxyUrlFunction = "Unsupported usage of isSatellite, domain or proxyUrl. The usage of isSatellite, domain or proxyUrl as function is not supported in non-browser environments.";
var userProfilePageRenderedError = "<UserProfile.Page /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.";
var userProfileLinkRenderedError = "<UserProfile.Link /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.";
var organizationProfilePageRenderedError = "<OrganizationProfile.Page /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.";
var organizationProfileLinkRenderedError = "<OrganizationProfile.Link /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.";
var customPagesIgnoredComponent = (componentName) => `<${componentName} /> can only accept <${componentName}.Page /> and <${componentName}.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`;
var customPageWrongProps = (componentName) => `Missing props. <${componentName}.Page /> component requires the following props: url, label, labelIcon, alongside with children to be rendered inside the page.`;
var customLinkWrongProps = (componentName) => `Missing props. <${componentName}.Link /> component requires the following props: url, label and labelIcon.`;
var userButtonIgnoredComponent = `<UserButton /> can only accept <UserButton.UserProfilePage />, <UserButton.UserProfileLink /> and <UserButton.MenuItems /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`;
var customMenuItemsIgnoredComponent = "<UserButton.MenuItems /> component can only accept <UserButton.Action /> and <UserButton.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.";
var userButtonMenuItemsRenderedError = "<UserButton.MenuItems /> component needs to be a direct child of `<UserButton />`.";
var userButtonMenuActionRenderedError = "<UserButton.Action /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuLinkRenderedError = "<UserButton.Link /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuItemLinkWrongProps = "Missing props. <UserButton.Link /> component requires the following props: href, label and labelIcon.";
var userButtonMenuItemsActionWrongsProps = "Missing props. <UserButton.Action /> component requires the following props: label.";
var useAssertWrappedByClerkProvider = (source) => {
	useAssertWrappedByClerkProvider$1(() => {
		errorThrower$1.throwMissingClerkProviderError({ source });
	});
};
var clerkLoaded = (isomorphicClerk) => {
	return new Promise((resolve) => {
		const handler = (status) => {
			if (["ready", "degraded"].includes(status)) {
				resolve();
				isomorphicClerk.off("status", handler);
			}
		};
		isomorphicClerk.on("status", handler, { notify: true });
	});
};
var createGetToken = (isomorphicClerk) => {
	return async (options) => {
		await clerkLoaded(isomorphicClerk);
		if (!isomorphicClerk.session) return null;
		return isomorphicClerk.session.getToken(options);
	};
};
var createSignOut = (isomorphicClerk) => {
	return async (...args) => {
		await clerkLoaded(isomorphicClerk);
		return isomorphicClerk.signOut(...args);
	};
};
var useAuth = (initialAuthStateOrOptions = {}) => {
	var _a;
	useAssertWrappedByClerkProvider("useAuth");
	const { treatPendingAsSignedOut, ...rest } = initialAuthStateOrOptions != null ? initialAuthStateOrOptions : {};
	const initialAuthState = rest;
	let authContext = useAuthContext();
	if (authContext.sessionId === void 0 && authContext.userId === void 0) authContext = initialAuthState != null ? initialAuthState : {};
	const isomorphicClerk = useIsomorphicClerkContext();
	const getToken = (0, import_react.useCallback)(createGetToken(isomorphicClerk), [isomorphicClerk]);
	const signOut = (0, import_react.useCallback)(createSignOut(isomorphicClerk), [isomorphicClerk]);
	(_a = isomorphicClerk.telemetry) == null || _a.record(eventMethodCalled("useAuth", { treatPendingAsSignedOut }));
	return useDerivedAuth({
		...authContext,
		getToken,
		signOut
	}, { treatPendingAsSignedOut });
};
function useDerivedAuth(authObject, { treatPendingAsSignedOut = true } = {}) {
	const { userId, orgId, orgRole, has, signOut, getToken, orgPermissions, factorVerificationAge, sessionClaims } = authObject != null ? authObject : {};
	const derivedHas = (0, import_react.useCallback)((params) => {
		if (has) return has(params);
		return createCheckAuthorization({
			userId,
			orgId,
			orgRole,
			orgPermissions,
			factorVerificationAge,
			features: (sessionClaims == null ? void 0 : sessionClaims.fea) || "",
			plans: (sessionClaims == null ? void 0 : sessionClaims.pla) || ""
		})(params);
	}, [
		has,
		userId,
		orgId,
		orgRole,
		orgPermissions,
		factorVerificationAge,
		sessionClaims
	]);
	const payload = resolveAuthState({
		authObject: {
			...authObject,
			getToken,
			signOut,
			has: derivedHas
		},
		options: { treatPendingAsSignedOut }
	});
	if (!payload) return errorThrower$1.throw(invalidStateError);
	return payload;
}
var withClerk = (Component, displayNameOrOptions) => {
	const displayName = (typeof displayNameOrOptions === "string" ? displayNameOrOptions : displayNameOrOptions == null ? void 0 : displayNameOrOptions.component) || Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const options = typeof displayNameOrOptions === "string" ? void 0 : displayNameOrOptions;
	const HOC = (props) => {
		useAssertWrappedByClerkProvider(displayName || "withClerk");
		const clerk = useIsomorphicClerkContext();
		if (!clerk.loaded && !(options == null ? void 0 : options.renderWhileLoading)) return null;
		return /* @__PURE__ */ import_react.createElement(Component, {
			...props,
			component: displayName,
			clerk
		});
	};
	HOC.displayName = `withClerk(${displayName})`;
	return HOC;
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/runtimeEnvironment-BB2sO-19.mjs
var isDevelopmentEnvironment = () => {
	try {
		return false;
	} catch {}
	return false;
};
var isTestEnvironment = () => {
	try {
		return false;
	} catch {}
	return false;
};
var isProductionEnvironment = () => {
	try {
		return true;
	} catch {}
	return false;
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/deprecated-BqlFbLHj.mjs
/**
* Mark class method / function as deprecated.
*
* A console WARNING will be displayed when class method / function is invoked.
*
* Examples
* 1. Deprecate class method
* class Example {
*   getSomething = (arg1, arg2) => {
*       deprecated('Example.getSomething', 'Use `getSomethingElse` instead.');
*       return `getSomethingValue:${arg1 || '-'}:${arg2 || '-'}`;
*   };
* }
*
* 2. Deprecate function
* const getSomething = () => {
*   deprecated('getSomething', 'Use `getSomethingElse` instead.');
*   return 'getSomethingValue';
* };
*/
var displayedWarnings = /* @__PURE__ */ new Set();
var deprecated = (fnName, warning, key) => {
	const hideWarning = isTestEnvironment() || isProductionEnvironment();
	const messageId = key ?? fnName;
	if (displayedWarnings.has(messageId) || hideWarning) return;
	displayedWarnings.add(messageId);
	console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.\n${warning}`);
};
withClerk(({ clerk, ...props }) => {
	const { client, session } = clerk;
	const hasSignedInSessions = client.signedInSessions ? client.signedInSessions.length > 0 : client.activeSessions && client.activeSessions.length > 0;
	import_react.useEffect(() => {
		if (session === null && hasSignedInSessions) clerk.redirectToAfterSignOut();
		else clerk.redirectToSignIn(props);
	}, []);
	return null;
}, "RedirectToSignIn");
withClerk(({ clerk, ...props }) => {
	import_react.useEffect(() => {
		clerk.redirectToSignUp(props);
	}, []);
	return null;
}, "RedirectToSignUp");
withClerk(({ clerk, ...props }) => {
	import_react.useEffect(() => {
		clerk.redirectToTasks(props);
	}, []);
	return null;
}, "RedirectToTasks");
withClerk(({ clerk }) => {
	import_react.useEffect(() => {
		deprecated("RedirectToUserProfile", "Use the `redirectToUserProfile()` method instead.");
		clerk.redirectToUserProfile();
	}, []);
	return null;
}, "RedirectToUserProfile");
withClerk(({ clerk }) => {
	import_react.useEffect(() => {
		deprecated("RedirectToOrganizationProfile", "Use the `redirectToOrganizationProfile()` method instead.");
		clerk.redirectToOrganizationProfile();
	}, []);
	return null;
}, "RedirectToOrganizationProfile");
withClerk(({ clerk }) => {
	import_react.useEffect(() => {
		deprecated("RedirectToCreateOrganization", "Use the `redirectToCreateOrganization()` method instead.");
		clerk.redirectToCreateOrganization();
	}, []);
	return null;
}, "RedirectToCreateOrganization");
withClerk(({ clerk, ...handleRedirectCallbackParams }) => {
	import_react.useEffect(() => {
		clerk.handleRedirectCallback(handleRedirectCallbackParams);
	}, []);
	return null;
}, "AuthenticateWithRedirectCallback");
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/handleValueOrFn-CcwnRX-K.mjs
function handleValueOrFn(value, url, defaultValue) {
	if (typeof value === "function") return value(url);
	if (typeof value !== "undefined") return value;
	if (typeof defaultValue !== "undefined") return defaultValue;
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/utils-seY-ehg-.mjs
var logErrorInDevMode = (message) => {
	if (isDevelopmentEnvironment()) console.error(`Clerk: ${message}`);
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/object-Be3MMNTQ.mjs
var without = (obj, ...props) => {
	const copy = { ...obj };
	for (const prop of props) delete copy[prop];
	return copy;
};
//#endregion
//#region node_modules/@clerk/clerk-react/dist/chunk-THNCS7QR.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var assertSingleChild = (children) => (name) => {
	try {
		return import_react.Children.only(children);
	} catch {
		return errorThrower$1.throw(multipleChildrenInButtonComponent(name));
	}
};
var normalizeWithDefaultValue = (children, defaultText) => {
	if (!children) children = defaultText;
	if (typeof children === "string") children = /* @__PURE__ */ import_react.createElement("button", null, children);
	return children;
};
var safeExecute = (cb) => (...args) => {
	if (cb && typeof cb === "function") return cb(...args);
};
function isConstructor(f) {
	return typeof f === "function";
}
var counts = /* @__PURE__ */ new Map();
function useMaxAllowedInstancesGuard(name, error, maxCount = 1) {
	import_react.useEffect(() => {
		const count = counts.get(name) || 0;
		if (count == maxCount) return errorThrower$1.throw(error);
		counts.set(name, count + 1);
		return () => {
			counts.set(name, (counts.get(name) || 1) - 1);
		};
	}, []);
}
function withMaxAllowedInstancesGuard(WrappedComponent, name, error) {
	const displayName = WrappedComponent.displayName || WrappedComponent.name || name || "Component";
	const Hoc = (props) => {
		useMaxAllowedInstancesGuard(name, error);
		return /* @__PURE__ */ import_react.createElement(WrappedComponent, { ...props });
	};
	Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
	return Hoc;
}
var useCustomElementPortal = (elements) => {
	const [nodeMap, setNodeMap] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	return elements.map((el) => ({
		id: el.id,
		mount: (node) => setNodeMap((prev) => new Map(prev).set(String(el.id), node)),
		unmount: () => setNodeMap((prev) => {
			const newMap = new Map(prev);
			newMap.set(String(el.id), null);
			return newMap;
		}),
		portal: () => {
			const node = nodeMap.get(String(el.id));
			return node ? (0, import_react_dom.createPortal)(el.component, node) : null;
		}
	}));
};
var isThatComponent = (v, component) => {
	return !!v && import_react.isValidElement(v) && (v == null ? void 0 : v.type) === component;
};
var useUserProfileCustomPages = (children, options) => {
	return useCustomPages({
		children,
		reorderItemsLabels: [
			"account",
			"security",
			"billing",
			"apiKeys"
		],
		LinkComponent: UserProfileLink,
		PageComponent: UserProfilePage,
		MenuItemsComponent: MenuItems,
		componentName: "UserProfile"
	}, options);
};
var useOrganizationProfileCustomPages = (children, options) => {
	return useCustomPages({
		children,
		reorderItemsLabels: [
			"general",
			"members",
			"billing",
			"apiKeys"
		],
		LinkComponent: OrganizationProfileLink,
		PageComponent: OrganizationProfilePage,
		componentName: "OrganizationProfile"
	}, options);
};
var useSanitizedChildren = (children) => {
	const sanitizedChildren = [];
	const excludedComponents = [
		OrganizationProfileLink,
		OrganizationProfilePage,
		MenuItems,
		UserProfilePage,
		UserProfileLink
	];
	import_react.Children.forEach(children, (child) => {
		if (!excludedComponents.some((component) => isThatComponent(child, component))) sanitizedChildren.push(child);
	});
	return sanitizedChildren;
};
var useCustomPages = (params, options) => {
	const { children, LinkComponent, PageComponent, MenuItemsComponent, reorderItemsLabels, componentName } = params;
	const { allowForAnyChildren = false } = options || {};
	const validChildren = [];
	import_react.Children.forEach(children, (child) => {
		if (!isThatComponent(child, PageComponent) && !isThatComponent(child, LinkComponent) && !isThatComponent(child, MenuItemsComponent)) {
			if (child && !allowForAnyChildren) logErrorInDevMode(customPagesIgnoredComponent(componentName));
			return;
		}
		const { props } = child;
		const { children: children2, label, url, labelIcon } = props;
		if (isThatComponent(child, PageComponent)) {
			if (isReorderItem(props, reorderItemsLabels)) validChildren.push({ label });
			else if (isCustomPage(props)) validChildren.push({
				label,
				labelIcon,
				children: children2,
				url
			});
			else {
				logErrorInDevMode(customPageWrongProps(componentName));
				return;
			}
		}
		if (isThatComponent(child, LinkComponent)) {
			if (isExternalLink(props)) validChildren.push({
				label,
				labelIcon,
				url
			});
			else {
				logErrorInDevMode(customLinkWrongProps(componentName));
				return;
			}
		}
	});
	const customPageContents = [];
	const customPageLabelIcons = [];
	const customLinkLabelIcons = [];
	validChildren.forEach((cp, index) => {
		if (isCustomPage(cp)) {
			customPageContents.push({
				component: cp.children,
				id: index
			});
			customPageLabelIcons.push({
				component: cp.labelIcon,
				id: index
			});
			return;
		}
		if (isExternalLink(cp)) customLinkLabelIcons.push({
			component: cp.labelIcon,
			id: index
		});
	});
	const customPageContentsPortals = useCustomElementPortal(customPageContents);
	const customPageLabelIconsPortals = useCustomElementPortal(customPageLabelIcons);
	const customLinkLabelIconsPortals = useCustomElementPortal(customLinkLabelIcons);
	const customPages = [];
	const customPagesPortals = [];
	validChildren.forEach((cp, index) => {
		if (isReorderItem(cp, reorderItemsLabels)) {
			customPages.push({ label: cp.label });
			return;
		}
		if (isCustomPage(cp)) {
			const { portal: contentPortal, mount, unmount } = customPageContentsPortals.find((p) => p.id === index);
			const { portal: labelPortal, mount: mountIcon, unmount: unmountIcon } = customPageLabelIconsPortals.find((p) => p.id === index);
			customPages.push({
				label: cp.label,
				url: cp.url,
				mount,
				unmount,
				mountIcon,
				unmountIcon
			});
			customPagesPortals.push(contentPortal);
			customPagesPortals.push(labelPortal);
			return;
		}
		if (isExternalLink(cp)) {
			const { portal: labelPortal, mount: mountIcon, unmount: unmountIcon } = customLinkLabelIconsPortals.find((p) => p.id === index);
			customPages.push({
				label: cp.label,
				url: cp.url,
				mountIcon,
				unmountIcon
			});
			customPagesPortals.push(labelPortal);
			return;
		}
	});
	return {
		customPages,
		customPagesPortals
	};
};
var isReorderItem = (childProps, validItems) => {
	const { children, label, url, labelIcon } = childProps;
	return !children && !url && !labelIcon && validItems.some((v) => v === label);
};
var isCustomPage = (childProps) => {
	const { children, label, url, labelIcon } = childProps;
	return !!children && !!url && !!labelIcon && !!label;
};
var isExternalLink = (childProps) => {
	const { children, label, url, labelIcon } = childProps;
	return !children && !!url && !!labelIcon && !!label;
};
var useUserButtonCustomMenuItems = (children, options) => {
	var _a;
	return useCustomMenuItems({
		children,
		reorderItemsLabels: ["manageAccount", "signOut"],
		MenuItemsComponent: MenuItems,
		MenuActionComponent: MenuAction,
		MenuLinkComponent: MenuLink,
		UserProfileLinkComponent: UserProfileLink,
		UserProfilePageComponent: UserProfilePage,
		allowForAnyChildren: (_a = options == null ? void 0 : options.allowForAnyChildren) != null ? _a : false
	});
};
var useCustomMenuItems = ({ children, MenuItemsComponent, MenuActionComponent, MenuLinkComponent, UserProfileLinkComponent, UserProfilePageComponent, reorderItemsLabels, allowForAnyChildren = false }) => {
	const validChildren = [];
	const customMenuItems = [];
	const customMenuItemsPortals = [];
	import_react.Children.forEach(children, (child) => {
		if (!isThatComponent(child, MenuItemsComponent) && !isThatComponent(child, UserProfileLinkComponent) && !isThatComponent(child, UserProfilePageComponent)) {
			if (child && !allowForAnyChildren) logErrorInDevMode(userButtonIgnoredComponent);
			return;
		}
		if (isThatComponent(child, UserProfileLinkComponent) || isThatComponent(child, UserProfilePageComponent)) return;
		const { props } = child;
		import_react.Children.forEach(props.children, (child2) => {
			if (!isThatComponent(child2, MenuActionComponent) && !isThatComponent(child2, MenuLinkComponent)) {
				if (child2) logErrorInDevMode(customMenuItemsIgnoredComponent);
				return;
			}
			const { props: props2 } = child2;
			const { label, labelIcon, href, onClick, open } = props2;
			if (isThatComponent(child2, MenuActionComponent)) {
				if (isReorderItem2(props2, reorderItemsLabels)) validChildren.push({ label });
				else if (isCustomMenuItem(props2)) {
					const baseItem = {
						label,
						labelIcon
					};
					if (onClick !== void 0) validChildren.push({
						...baseItem,
						onClick
					});
					else if (open !== void 0) validChildren.push({
						...baseItem,
						open: open.startsWith("/") ? open : `/${open}`
					});
					else {
						logErrorInDevMode("Custom menu item must have either onClick or open property");
						return;
					}
				} else {
					logErrorInDevMode(userButtonMenuItemsActionWrongsProps);
					return;
				}
			}
			if (isThatComponent(child2, MenuLinkComponent)) {
				if (isExternalLink2(props2)) validChildren.push({
					label,
					labelIcon,
					href
				});
				else {
					logErrorInDevMode(userButtonMenuItemLinkWrongProps);
					return;
				}
			}
		});
	});
	const customMenuItemLabelIcons = [];
	const customLinkLabelIcons = [];
	validChildren.forEach((mi, index) => {
		if (isCustomMenuItem(mi)) customMenuItemLabelIcons.push({
			component: mi.labelIcon,
			id: index
		});
		if (isExternalLink2(mi)) customLinkLabelIcons.push({
			component: mi.labelIcon,
			id: index
		});
	});
	const customMenuItemLabelIconsPortals = useCustomElementPortal(customMenuItemLabelIcons);
	const customLinkLabelIconsPortals = useCustomElementPortal(customLinkLabelIcons);
	validChildren.forEach((mi, index) => {
		if (isReorderItem2(mi, reorderItemsLabels)) customMenuItems.push({ label: mi.label });
		if (isCustomMenuItem(mi)) {
			const { portal: iconPortal, mount: mountIcon, unmount: unmountIcon } = customMenuItemLabelIconsPortals.find((p) => p.id === index);
			const menuItem = {
				label: mi.label,
				mountIcon,
				unmountIcon
			};
			if ("onClick" in mi) menuItem.onClick = mi.onClick;
			else if ("open" in mi) menuItem.open = mi.open;
			customMenuItems.push(menuItem);
			customMenuItemsPortals.push(iconPortal);
		}
		if (isExternalLink2(mi)) {
			const { portal: iconPortal, mount: mountIcon, unmount: unmountIcon } = customLinkLabelIconsPortals.find((p) => p.id === index);
			customMenuItems.push({
				label: mi.label,
				href: mi.href,
				mountIcon,
				unmountIcon
			});
			customMenuItemsPortals.push(iconPortal);
		}
	});
	return {
		customMenuItems,
		customMenuItemsPortals
	};
};
var isReorderItem2 = (childProps, validItems) => {
	const { children, label, onClick, labelIcon } = childProps;
	return !children && !onClick && !labelIcon && validItems.some((v) => v === label);
};
var isCustomMenuItem = (childProps) => {
	const { label, labelIcon, onClick, open } = childProps;
	return !!labelIcon && !!label && (typeof onClick === "function" || typeof open === "string");
};
var isExternalLink2 = (childProps) => {
	const { label, href, labelIcon } = childProps;
	return !!href && !!labelIcon && !!label;
};
var createAwaitableMutationObserver = (globalOptions) => {
	const isReady = globalOptions == null ? void 0 : globalOptions.isReady;
	return (options) => new Promise((resolve, reject) => {
		const { root = document == null ? void 0 : document.body, selector, timeout = 0 } = options;
		if (!root) {
			reject(/* @__PURE__ */ new Error("No root element provided"));
			return;
		}
		let elementToWatch = root;
		if (selector) elementToWatch = root == null ? void 0 : root.querySelector(selector);
		if (isReady(elementToWatch, selector)) {
			resolve();
			return;
		}
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (!elementToWatch && selector) elementToWatch = root == null ? void 0 : root.querySelector(selector);
				if (globalOptions.childList && mutation.type === "childList" || globalOptions.attributes && mutation.type === "attributes") {
					if (isReady(elementToWatch, selector)) {
						observer.disconnect();
						resolve();
						return;
					}
				}
			}
		});
		observer.observe(root, globalOptions);
		if (timeout > 0) setTimeout(() => {
			observer.disconnect();
			reject(/* @__PURE__ */ new Error(`Timeout waiting for ${selector}`));
		}, timeout);
	});
};
var waitForElementChildren = createAwaitableMutationObserver({
	childList: true,
	subtree: true,
	isReady: (el, selector) => {
		var _a;
		return !!(el == null ? void 0 : el.childElementCount) && ((_a = el == null ? void 0 : el.matches) == null ? void 0 : _a.call(el, selector)) && el.childElementCount > 0;
	}
});
function useWaitForComponentMount(component, options) {
	const watcherRef = (0, import_react.useRef)();
	const [status, setStatus] = (0, import_react.useState)("rendering");
	(0, import_react.useEffect)(() => {
		if (!component) throw new Error("Clerk: no component name provided, unable to detect mount.");
		if (typeof window !== "undefined" && !watcherRef.current) {
			const defaultSelector = `[data-clerk-component="${component}"]`;
			const selector = options == null ? void 0 : options.selector;
			watcherRef.current = waitForElementChildren({ selector: selector ? defaultSelector + selector : defaultSelector }).then(() => {
				setStatus("rendered");
			}).catch(() => {
				setStatus("error");
			});
		}
	}, [component, options == null ? void 0 : options.selector]);
	return status;
}
var isMountProps = (props) => {
	return "mount" in props;
};
var isOpenProps = (props) => {
	return "open" in props;
};
var stripMenuItemIconHandlers = (menuItems) => {
	return menuItems == null ? void 0 : menuItems.map(({ mountIcon, unmountIcon, ...rest }) => rest);
};
var ClerkHostRenderer = class extends import_react.PureComponent {
	constructor() {
		super(...arguments);
		this.rootRef = import_react.createRef();
	}
	componentDidUpdate(_prevProps) {
		var _a, _b, _c, _d;
		if (!isMountProps(_prevProps) || !isMountProps(this.props)) return;
		const prevProps = without(_prevProps.props, "customPages", "customMenuItems", "children");
		const newProps = without(this.props.props, "customPages", "customMenuItems", "children");
		const customPagesChanged = ((_a = prevProps.customPages) == null ? void 0 : _a.length) !== ((_b = newProps.customPages) == null ? void 0 : _b.length);
		const customMenuItemsChanged = ((_c = prevProps.customMenuItems) == null ? void 0 : _c.length) !== ((_d = newProps.customMenuItems) == null ? void 0 : _d.length);
		const prevMenuItemsWithoutHandlers = stripMenuItemIconHandlers(_prevProps.props.customMenuItems);
		const newMenuItemsWithoutHandlers = stripMenuItemIconHandlers(this.props.props.customMenuItems);
		if (!isDeeplyEqual(prevProps, newProps) || !isDeeplyEqual(prevMenuItemsWithoutHandlers, newMenuItemsWithoutHandlers) || customPagesChanged || customMenuItemsChanged) {
			if (this.rootRef.current) this.props.updateProps({
				node: this.rootRef.current,
				props: this.props.props
			});
		}
	}
	componentDidMount() {
		if (this.rootRef.current) {
			if (isMountProps(this.props)) this.props.mount(this.rootRef.current, this.props.props);
			if (isOpenProps(this.props)) this.props.open(this.props.props);
		}
	}
	componentWillUnmount() {
		if (this.rootRef.current) {
			if (isMountProps(this.props)) this.props.unmount(this.rootRef.current);
			if (isOpenProps(this.props)) this.props.close();
		}
	}
	render() {
		const { hideRootHtmlElement = false } = this.props;
		const rootAttributes = {
			ref: this.rootRef,
			...this.props.rootProps,
			...this.props.component && { "data-clerk-component": this.props.component }
		};
		return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, !hideRootHtmlElement && /* @__PURE__ */ import_react.createElement("div", { ...rootAttributes }), this.props.children);
	}
};
var CustomPortalsRenderer = (props) => {
	var _a, _b;
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, (_a = props == null ? void 0 : props.customPagesPortals) == null ? void 0 : _a.map((portal, index) => (0, import_react.createElement)(portal, { key: index })), (_b = props == null ? void 0 : props.customMenuItemsPortals) == null ? void 0 : _b.map((portal, index) => (0, import_react.createElement)(portal, { key: index })));
};
var SignIn = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountSignIn,
		unmount: clerk.unmountSignIn,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "SignIn",
	renderWhileLoading: true
});
var SignUp = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountSignUp,
		unmount: clerk.unmountSignUp,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "SignUp",
	renderWhileLoading: true
});
function UserProfilePage({ children }) {
	logErrorInDevMode(userProfilePageRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
function UserProfileLink({ children }) {
	logErrorInDevMode(userProfileLinkRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
var _UserProfile = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	const { customPages, customPagesPortals } = useUserProfileCustomPages(props.children);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountUserProfile,
		unmount: clerk.unmountUserProfile,
		updateProps: clerk.__unstable__updateProps,
		props: {
			...props,
			customPages
		},
		rootProps: rendererRootProps
	}, /* @__PURE__ */ import_react.createElement(CustomPortalsRenderer, { customPagesPortals })));
}, {
	component: "UserProfile",
	renderWhileLoading: true
});
Object.assign(_UserProfile, {
	Page: UserProfilePage,
	Link: UserProfileLink
});
var UserButtonContext = (0, import_react.createContext)({
	mount: () => {},
	unmount: () => {},
	updateProps: () => {}
});
var _UserButton = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	const { customPages, customPagesPortals } = useUserProfileCustomPages(props.children, { allowForAnyChildren: !!props.__experimental_asProvider });
	const userProfileProps = {
		...props.userProfileProps,
		customPages
	};
	const { customMenuItems, customMenuItemsPortals } = useUserButtonCustomMenuItems(props.children, { allowForAnyChildren: !!props.__experimental_asProvider });
	const sanitizedChildren = useSanitizedChildren(props.children);
	const passableProps = {
		mount: clerk.mountUserButton,
		unmount: clerk.unmountUserButton,
		updateProps: clerk.__unstable__updateProps,
		props: {
			...props,
			userProfileProps,
			customMenuItems
		}
	};
	const portalProps = {
		customPagesPortals,
		customMenuItemsPortals
	};
	return /* @__PURE__ */ import_react.createElement(UserButtonContext.Provider, { value: passableProps }, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		...passableProps,
		hideRootHtmlElement: !!props.__experimental_asProvider,
		rootProps: rendererRootProps
	}, props.__experimental_asProvider ? sanitizedChildren : null, /* @__PURE__ */ import_react.createElement(CustomPortalsRenderer, { ...portalProps })));
}, {
	component: "UserButton",
	renderWhileLoading: true
});
function MenuItems({ children }) {
	logErrorInDevMode(userButtonMenuItemsRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
function MenuAction({ children }) {
	logErrorInDevMode(userButtonMenuActionRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
function MenuLink({ children }) {
	logErrorInDevMode(userButtonMenuLinkRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
function UserButtonOutlet(outletProps) {
	const providerProps = (0, import_react.useContext)(UserButtonContext);
	const portalProps = {
		...providerProps,
		props: {
			...providerProps.props,
			...outletProps
		}
	};
	return /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, { ...portalProps });
}
Object.assign(_UserButton, {
	UserProfilePage,
	UserProfileLink,
	MenuItems,
	Action: MenuAction,
	Link: MenuLink,
	__experimental_Outlet: UserButtonOutlet
});
function OrganizationProfilePage({ children }) {
	logErrorInDevMode(organizationProfilePageRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
function OrganizationProfileLink({ children }) {
	logErrorInDevMode(organizationProfileLinkRenderedError);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children);
}
var _OrganizationProfile = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	const { customPages, customPagesPortals } = useOrganizationProfileCustomPages(props.children);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountOrganizationProfile,
		unmount: clerk.unmountOrganizationProfile,
		updateProps: clerk.__unstable__updateProps,
		props: {
			...props,
			customPages
		},
		rootProps: rendererRootProps
	}, /* @__PURE__ */ import_react.createElement(CustomPortalsRenderer, { customPagesPortals })));
}, {
	component: "OrganizationProfile",
	renderWhileLoading: true
});
Object.assign(_OrganizationProfile, {
	Page: OrganizationProfilePage,
	Link: OrganizationProfileLink
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountCreateOrganization,
		unmount: clerk.unmountCreateOrganization,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "CreateOrganization",
	renderWhileLoading: true
});
var OrganizationSwitcherContext = (0, import_react.createContext)({
	mount: () => {},
	unmount: () => {},
	updateProps: () => {}
});
var _OrganizationSwitcher = withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	const { customPages, customPagesPortals } = useOrganizationProfileCustomPages(props.children, { allowForAnyChildren: !!props.__experimental_asProvider });
	const organizationProfileProps = {
		...props.organizationProfileProps,
		customPages
	};
	const sanitizedChildren = useSanitizedChildren(props.children);
	const passableProps = {
		mount: clerk.mountOrganizationSwitcher,
		unmount: clerk.unmountOrganizationSwitcher,
		updateProps: clerk.__unstable__updateProps,
		props: {
			...props,
			organizationProfileProps
		},
		rootProps: rendererRootProps,
		component
	};
	clerk.__experimental_prefetchOrganizationSwitcher();
	return /* @__PURE__ */ import_react.createElement(OrganizationSwitcherContext.Provider, { value: passableProps }, /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		...passableProps,
		hideRootHtmlElement: !!props.__experimental_asProvider
	}, props.__experimental_asProvider ? sanitizedChildren : null, /* @__PURE__ */ import_react.createElement(CustomPortalsRenderer, { customPagesPortals }))));
}, {
	component: "OrganizationSwitcher",
	renderWhileLoading: true
});
function OrganizationSwitcherOutlet(outletProps) {
	const providerProps = (0, import_react.useContext)(OrganizationSwitcherContext);
	const portalProps = {
		...providerProps,
		props: {
			...providerProps.props,
			...outletProps
		}
	};
	return /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, { ...portalProps });
}
Object.assign(_OrganizationSwitcher, {
	OrganizationProfilePage,
	OrganizationProfileLink,
	__experimental_Outlet: OrganizationSwitcherOutlet
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountOrganizationList,
		unmount: clerk.unmountOrganizationList,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "OrganizationList",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		open: clerk.openGoogleOneTap,
		close: clerk.closeGoogleOneTap,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "GoogleOneTap",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountWaitlist,
		unmount: clerk.unmountWaitlist,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "Waitlist",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component, { selector: "[data-component-status=\"ready\"]" }) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountPricingTable,
		unmount: clerk.unmountPricingTable,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "PricingTable",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountAPIKeys,
		unmount: clerk.unmountAPIKeys,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "ApiKeys",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountUserAvatar,
		unmount: clerk.unmountUserAvatar,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "UserAvatar",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountTaskChooseOrganization,
		unmount: clerk.unmountTaskChooseOrganization,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "TaskChooseOrganization",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountTaskResetPassword,
		unmount: clerk.unmountTaskResetPassword,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "TaskResetPassword",
	renderWhileLoading: true
});
withClerk(({ clerk, component, fallback, ...props }) => {
	const shouldShowFallback = useWaitForComponentMount(component) === "rendering" || !clerk.loaded;
	const rendererRootProps = { ...shouldShowFallback && fallback && { style: { display: "none" } } };
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react.createElement(ClerkHostRenderer, {
		component,
		mount: clerk.mountTaskSetupMFA,
		unmount: clerk.unmountTaskSetupMFA,
		updateProps: clerk.__unstable__updateProps,
		props,
		rootProps: rendererRootProps
	}));
}, {
	component: "TaskSetupMFA",
	renderWhileLoading: true
});
//#endregion
//#region node_modules/@clerk/clerk-react/dist/chunk-OANWQR3B.mjs
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/retry-DAlTROH9.mjs
var defaultOptions = {
	initialDelay: 125,
	maxDelayBetweenRetries: 0,
	factor: 2,
	shouldRetry: (_, iteration) => iteration < 5,
	retryImmediately: false,
	jitter: true
};
var RETRY_IMMEDIATELY_DELAY = 100;
var sleep = async (ms) => new Promise((s) => setTimeout(s, ms));
var applyJitter = (delay, jitter) => {
	return jitter ? delay * (1 + Math.random()) : delay;
};
var createExponentialDelayAsyncFn = (opts) => {
	let timesCalled = 0;
	const calculateDelayInMs = () => {
		const constant = opts.initialDelay;
		const base = opts.factor;
		let delay = constant * Math.pow(base, timesCalled);
		delay = applyJitter(delay, opts.jitter);
		return Math.min(opts.maxDelayBetweenRetries || delay, delay);
	};
	return async () => {
		await sleep(calculateDelayInMs());
		timesCalled++;
	};
};
/**
* Retries a callback until it succeeds or the shouldRetry function returns false.
* See {@link RetryOptions} for the available options.
*/
var retry = async (callback, options = {}) => {
	let iterations = 0;
	const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
		...defaultOptions,
		...options
	};
	const delay = createExponentialDelayAsyncFn({
		initialDelay,
		maxDelayBetweenRetries,
		factor,
		jitter
	});
	while (true) try {
		return await callback();
	} catch (e) {
		iterations++;
		if (!shouldRetry(e, iterations)) throw e;
		if (onBeforeRetry) await onBeforeRetry(iterations);
		if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
		else await delay();
	}
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/loadScript-t1vaIfy5.mjs
var NO_DOCUMENT_ERROR = "loadScript cannot be called when document does not exist";
var NO_SRC_ERROR = "loadScript cannot be called without a src";
async function loadScript(src = "", opts) {
	const { async, defer, beforeLoad, crossOrigin, nonce } = opts || {};
	const load = () => {
		return new Promise((resolve, reject) => {
			if (!src) reject(/* @__PURE__ */ new Error(NO_SRC_ERROR));
			if (!document || !document.body) reject(/* @__PURE__ */ new Error(NO_DOCUMENT_ERROR));
			const script = document.createElement("script");
			if (crossOrigin) script.setAttribute("crossorigin", crossOrigin);
			script.async = async || false;
			script.defer = defer || false;
			script.addEventListener("load", () => {
				script.remove();
				resolve(script);
			});
			script.addEventListener("error", (event) => {
				script.remove();
				reject(event.error ?? /* @__PURE__ */ new Error(`failed to load script: ${src}`));
			});
			script.src = src;
			script.nonce = nonce;
			beforeLoad?.(script);
			document.body.appendChild(script);
		});
	};
	return retry(load, { shouldRetry: (_, iterations) => iterations <= 5 });
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/proxy-Bq8EHApG.mjs
function isValidProxyUrl(key) {
	if (!key) return true;
	return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
	return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
	return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
	if (!url) return "";
	return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/url-Cdy8w8vK.mjs
function addClerkPrefix(str) {
	if (!str) return "";
	let regex;
	if (str.match(/^(clerk\.)+\w*$/)) regex = /(clerk\.)*(?=clerk\.)/;
	else if (str.match(/\.clerk.accounts/)) return str;
	else regex = /^(clerk\.)*/gi;
	return `clerk.${str.replace(regex, "")}`;
}
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/versionSelector-iGKqJXKU.mjs
/**
* This version selector is a bit complicated, so here is the flow:
* 1. Use the clerkJSVersion prop on the provider
* 2. Use the exact `@clerk/clerk-js` version if it is a `@snapshot` prerelease
* 3. Use the prerelease tag of `@clerk/clerk-js` or the packageVersion provided
* 4. Fallback to the major version of `@clerk/clerk-js` or the packageVersion provided
* @param clerkJSVersion - The optional clerkJSVersion prop on the provider
* @param packageVersion - The version of `@clerk/clerk-js` that will be used if an explicit version is not provided
* @returns The npm tag, version or major version to use
*/
var versionSelector = (clerkJSVersion, packageVersion = "5.127.1") => {
	if (clerkJSVersion) return clerkJSVersion;
	const prereleaseTag = getPrereleaseTag(packageVersion);
	if (prereleaseTag) {
		if (prereleaseTag === "snapshot") return "5.127.1";
		return prereleaseTag;
	}
	return getMajorVersion(packageVersion);
};
var getPrereleaseTag = (packageVersion) => packageVersion.trim().replace(/^v/, "").match(/-(.+?)(\.|$)/)?.[1];
var getMajorVersion = (packageVersion) => packageVersion.trim().replace(/^v/, "").split(".")[0];
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/loadClerkJsScript-CcnvepP5.mjs
var ERROR_CODE = "failed_to_load_clerk_js";
var ERROR_CODE_TIMEOUT = "failed_to_load_clerk_js_timeout";
var FAILED_TO_LOAD_ERROR = "Failed to load Clerk";
var { isDevOrStagingUrl } = createDevOrStagingUrlCache();
var errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
/**
* Sets the package name for error messages during ClerkJS script loading.
*
* @param packageName - The name of the package to use in error messages (e.g., '@clerk/clerk-react').
* @example
* ```typescript
* setClerkJsLoadingErrorPackageName('@clerk/clerk-react');
* ```
*/
function setClerkJsLoadingErrorPackageName(packageName) {
	errorThrower.setPackageName({ packageName });
}
/**
* Validates that window.Clerk exists and is properly initialized.
* This ensures we don't have false positives where the script loads but Clerk is malformed.
*
* @returns `true` if window.Clerk exists and has the expected structure with a load method.
*/
function isClerkProperlyLoaded() {
	if (typeof window === "undefined" || !window.Clerk) return false;
	const clerk = window.Clerk;
	return typeof clerk === "object" && typeof clerk.load === "function";
}
/**
* Checks if an existing script has a request error using Performance API.
*
* @param scriptUrl - The URL of the script to check.
* @returns True if the script has failed to load due to a network/HTTP error.
*/
function hasScriptRequestError(scriptUrl) {
	if (typeof window === "undefined" || !window.performance) return false;
	const entries = performance.getEntriesByName(scriptUrl, "resource");
	if (entries.length === 0) return false;
	const scriptEntry = entries[entries.length - 1];
	if (scriptEntry.transferSize === 0 && scriptEntry.decodedBodySize === 0) {
		if (scriptEntry.responseEnd === 0) return true;
		if (scriptEntry.responseEnd > 0 && scriptEntry.responseStart > 0) return true;
		if ("responseStatus" in scriptEntry) {
			if (scriptEntry.responseStatus >= 400) return true;
			if (scriptEntry.responseStatus === 0) return true;
		}
	}
	return false;
}
/**
* Waits for Clerk to be properly loaded with a timeout mechanism.
* Uses polling to check if Clerk becomes available within the specified timeout.
*
* @param timeoutMs - Maximum time to wait in milliseconds.
* @param existingScript - The existing script element to wait for. Optional, for existing scripts.
* @returns Promise that resolves with null if Clerk loads successfully, or rejects with an error if timeout is reached.
*/
function waitForClerkWithTimeout(timeoutMs, existingScript) {
	return new Promise((resolve, reject) => {
		let resolved = false;
		const cleanup = (timeoutId$1, pollInterval$1) => {
			clearTimeout(timeoutId$1);
			clearInterval(pollInterval$1);
		};
		existingScript?.addEventListener("error", () => {
			cleanup(timeoutId, pollInterval);
			reject(new ClerkRuntimeError(FAILED_TO_LOAD_ERROR, { code: ERROR_CODE }));
		});
		const checkAndResolve = () => {
			if (resolved) return;
			if (isClerkProperlyLoaded()) {
				resolved = true;
				cleanup(timeoutId, pollInterval);
				resolve(null);
			}
		};
		const handleTimeout = () => {
			if (resolved) return;
			resolved = true;
			cleanup(timeoutId, pollInterval);
			if (!isClerkProperlyLoaded()) reject(new ClerkRuntimeError(FAILED_TO_LOAD_ERROR, { code: ERROR_CODE_TIMEOUT }));
			else resolve(null);
		};
		const timeoutId = setTimeout(handleTimeout, timeoutMs);
		checkAndResolve();
		const pollInterval = setInterval(() => {
			if (resolved) {
				clearInterval(pollInterval);
				return;
			}
			checkAndResolve();
		}, 100);
	});
}
/**
* Hotloads the Clerk JS script with robust failure detection and retry logic.
*
* For existing scripts:
* - If no request error detected: waits for timeout, then retries with loadScript if timeout expires
* - If request error detected: immediately retries with loadScript.
*
* For new scripts: uses loadScript which has built-in retry logic via the retry utility.
*
* @param opts - The options used to build the Clerk JS script URL and load the script.
*               Must include a `publishableKey` if no existing script is found.
* @returns Promise that resolves with null if Clerk loads successfully, or rejects with an error.
*
* @example
* ```typescript
* try {
*   await loadClerkJsScript({ publishableKey: 'pk_test_...' });
*   console.log('Clerk loaded successfully');
* } catch (error) {
*   console.error('Failed to load Clerk:', error.message);
* }
* ```
*/
var loadClerkJsScript = async (opts) => {
	const timeout = opts?.scriptLoadTimeout ?? 15e3;
	if (isClerkProperlyLoaded()) return null;
	if (!opts?.publishableKey) {
		errorThrower.throwMissingPublishableKeyError();
		return null;
	}
	const scriptUrl = clerkJsScriptUrl(opts);
	const existingScript = document.querySelector("script[data-clerk-js-script]");
	if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
	else try {
		await waitForClerkWithTimeout(timeout, existingScript);
		return null;
	} catch {
		existingScript.remove();
	}
	const loadPromise = waitForClerkWithTimeout(timeout);
	loadScript(scriptUrl, {
		async: true,
		crossOrigin: "anonymous",
		nonce: opts.nonce,
		beforeLoad: applyClerkJsScriptAttributes(opts)
	}).catch((error) => {
		throw new ClerkRuntimeError(FAILED_TO_LOAD_ERROR + (error.message ? `, ${error.message}` : ""), {
			code: ERROR_CODE,
			cause: error
		});
	});
	return loadPromise;
};
/**
* Generates a Clerk JS script URL based on the provided options.
*
* @param opts - The options to use when building the Clerk JS script URL.
* @returns The complete URL to the Clerk JS script.
*
* @example
* ```typescript
* const url = clerkJsScriptUrl({ publishableKey: 'pk_test_...' });
* // Returns: "https://example.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
* ```
*/
var clerkJsScriptUrl = (opts) => {
	const { clerkJSUrl, clerkJSVariant, clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
	if (clerkJSUrl) return clerkJSUrl;
	let scriptHost = "";
	if (!!proxyUrl && isValidProxyUrl(proxyUrl)) scriptHost = proxyUrlToAbsoluteURL(proxyUrl).replace(/http(s)?:\/\//, "");
	else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || "")) scriptHost = addClerkPrefix(domain);
	else scriptHost = parsePublishableKey(publishableKey)?.frontendApi || "";
	const variant = clerkJSVariant ? `${clerkJSVariant.replace(/\.+$/, "")}.` : "";
	const version = versionSelector(clerkJSVersion);
	return `https://${scriptHost}/npm/@clerk/clerk-js@${version}/dist/clerk.${variant}browser.js`;
};
/**
* Builds an object of Clerk JS script attributes based on the provided options.
*
* @param options - The options containing the values for script attributes.
* @returns An object containing data attributes to be applied to the script element.
*/
var buildClerkJsScriptAttributes = (options) => {
	const obj = {};
	if (options.publishableKey) obj["data-clerk-publishable-key"] = options.publishableKey;
	if (options.proxyUrl) obj["data-clerk-proxy-url"] = options.proxyUrl;
	if (options.domain) obj["data-clerk-domain"] = options.domain;
	if (options.nonce) obj.nonce = options.nonce;
	return obj;
};
/**
* Returns a function that applies Clerk JS script attributes to a script element.
*
* @param options - The options containing the values for script attributes.
* @returns A function that accepts a script element and applies the attributes to it.
*/
var applyClerkJsScriptAttributes = (options) => (script) => {
	const attributes = buildClerkJsScriptAttributes(options);
	for (const attribute in attributes) script.setAttribute(attribute, attributes[attribute]);
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/deriveState-ChDqlleE.mjs
/**
* Derives authentication state based on the current rendering context (SSR or client-side).
*/
var deriveState = (clerkOperational, state, initialState) => {
	if (!clerkOperational && initialState) return deriveFromSsrInitialState(initialState);
	return deriveFromClientSideState(state);
};
var deriveFromSsrInitialState = (initialState) => {
	const userId = initialState.userId;
	const user = initialState.user;
	const sessionId = initialState.sessionId;
	const sessionStatus = initialState.sessionStatus;
	const sessionClaims = initialState.sessionClaims;
	return {
		userId,
		user,
		sessionId,
		session: initialState.session,
		sessionStatus,
		sessionClaims,
		organization: initialState.organization,
		orgId: initialState.orgId,
		orgRole: initialState.orgRole,
		orgPermissions: initialState.orgPermissions,
		orgSlug: initialState.orgSlug,
		actor: initialState.actor,
		factorVerificationAge: initialState.factorVerificationAge
	};
};
var deriveFromClientSideState = (state) => {
	const userId = state.user ? state.user.id : state.user;
	const user = state.user;
	const sessionId = state.session ? state.session.id : state.session;
	const session = state.session;
	const sessionStatus = state.session?.status;
	const sessionClaims = state.session ? state.session.lastActiveToken?.jwt?.claims : null;
	const factorVerificationAge = state.session ? state.session.factorVerificationAge : null;
	const actor = session?.actor;
	const organization = state.organization;
	const orgId = state.organization ? state.organization.id : state.organization;
	const orgSlug = organization?.slug;
	const membership = organization ? user?.organizationMemberships?.find((om) => om.organization.id === orgId) : organization;
	const orgPermissions = membership ? membership.permissions : membership;
	return {
		userId,
		user,
		sessionId,
		session,
		sessionStatus,
		sessionClaims,
		organization,
		orgId,
		orgRole: membership ? membership.role : membership,
		orgSlug,
		orgPermissions,
		actor,
		factorVerificationAge
	};
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/browser-D5e8obql.mjs
/**
* Checks if the window object is defined. You can also use this to check if something is happening on the client side.
* @returns {boolean}
*/
function inBrowser() {
	return typeof window !== "undefined";
}
new RegExp([
	"bot",
	"spider",
	"crawl",
	"APIs-Google",
	"AdsBot",
	"Googlebot",
	"mediapartners",
	"Google Favicon",
	"FeedFetcher",
	"Google-Read-Aloud",
	"DuplexWeb-Google",
	"googleweblight",
	"bing",
	"yandex",
	"baidu",
	"duckduck",
	"yahoo",
	"ecosia",
	"ia_archiver",
	"facebook",
	"instagram",
	"pinterest",
	"reddit",
	"slack",
	"twitter",
	"whatsapp",
	"youtube",
	"semrush"
].join("|"), "i");
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/eventBus-UpdW-1JB.mjs
/**
* @internal
*/
var _on = (eventToHandlersMap, latestPayloadMap, event, handler, opts) => {
	const { notify } = opts || {};
	let handlers = eventToHandlersMap.get(event);
	if (!handlers) {
		handlers = [];
		eventToHandlersMap.set(event, handlers);
	}
	handlers.push(handler);
	if (notify && latestPayloadMap.has(event)) handler(latestPayloadMap.get(event));
};
/**
* @internal
*/
var _dispatch = (eventToHandlersMap, event, payload) => (eventToHandlersMap.get(event) || []).map((h) => h(payload));
/**
* @internal
*/
var _off = (eventToHandlersMap, event, handler) => {
	const handlers = eventToHandlersMap.get(event);
	if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
	else eventToHandlersMap.set(event, []);
};
/**
* A ES6/2015 compatible 300 byte event bus
*
* Creates a strongly-typed event bus that enables publish/subscribe communication between components.
*
* @template Events - A record type that maps event names to their payload types
* @returns An EventBus instance with the following methods:
* - `on`: Subscribe to an event
* - `onPreDispatch`: Subscribe to an event, triggered before regular subscribers
* - `emit`: Publish an event with payload
* - `off`: Unsubscribe from an event
* - `offPreDispatch`: Unsubscribe from a pre-dispatch event
*
* @example
* // Define event types
* const eventBus = createEventBus<{
*   'user-login': { userId: string; timestamp: number };
*   'data-updated': { records: any[] };
*   'error': Error;
* }>();
*
* // Subscribe to events
* eventBus.on('user-login', ({ userId, timestamp }) => {
*   console.log(`User ${userId} logged in at ${timestamp}`);
* });
*
* // Subscribe with immediate notification if event was already dispatched
* eventBus.on('user-login', (payload) => {
*   // This will be called immediately if 'user-login' was previously dispatched
* }, { notify: true });
*
* // Publish an event
* eventBus.emit('user-login', { userId: 'abc123', timestamp: Date.now() });
*
* // Unsubscribe from event
* const handler = (payload) => console.log(payload);
* eventBus.on('error', handler);
* // Later...
* eventBus.off('error', handler);
*
* // Unsubscribe all handlers for an event
* eventBus.off('data-updated');
*/
var createEventBus = () => {
	const eventToHandlersMap = /* @__PURE__ */ new Map();
	const latestPayloadMap = /* @__PURE__ */ new Map();
	const eventToPredispatchHandlersMap = /* @__PURE__ */ new Map();
	const emit = (event, payload) => {
		latestPayloadMap.set(event, payload);
		_dispatch(eventToPredispatchHandlersMap, event, payload);
		_dispatch(eventToHandlersMap, event, payload);
	};
	return {
		on: (...args) => _on(eventToHandlersMap, latestPayloadMap, ...args),
		prioritizedOn: (...args) => _on(eventToPredispatchHandlersMap, latestPayloadMap, ...args),
		emit,
		off: (...args) => _off(eventToHandlersMap, ...args),
		prioritizedOff: (...args) => _off(eventToPredispatchHandlersMap, ...args),
		internal: { retrieveListeners: (event) => eventToHandlersMap.get(event) || [] }
	};
};
//#endregion
//#region node_modules/@clerk/shared/dist/runtime/clerkEventBus.mjs
var clerkEvents = { Status: "status" };
var createClerkEventBus = () => {
	return createEventBus();
};
//#endregion
//#region node_modules/@clerk/clerk-react/dist/index.mjs
if (typeof window !== "undefined" && !window.global) window.global = typeof global === "undefined" ? window : global;
withClerk(({ clerk, children, ...props }) => {
	const { appearance, signUpFallbackRedirectUrl, forceRedirectUrl, fallbackRedirectUrl, signUpForceRedirectUrl, mode, initialValues, withSignUp, oauthFlow, ...rest } = props;
	children = normalizeWithDefaultValue(children, "Sign in");
	const child = assertSingleChild(children)("SignInButton");
	const clickHandler = () => {
		const opts = {
			forceRedirectUrl,
			fallbackRedirectUrl,
			signUpFallbackRedirectUrl,
			signUpForceRedirectUrl,
			initialValues,
			withSignUp,
			oauthFlow
		};
		if (mode === "modal") return clerk.openSignIn({
			...opts,
			appearance
		});
		return clerk.redirectToSignIn({
			...opts,
			signInFallbackRedirectUrl: fallbackRedirectUrl,
			signInForceRedirectUrl: forceRedirectUrl
		});
	};
	const wrappedChildClickHandler = async (e) => {
		if (child && typeof child === "object" && "props" in child) await safeExecute(child.props.onClick)(e);
		return clickHandler();
	};
	const childProps = {
		...rest,
		onClick: wrappedChildClickHandler
	};
	return import_react.cloneElement(child, childProps);
}, {
	component: "SignInButton",
	renderWhileLoading: true
});
withClerk(({ clerk, children, ...props }) => {
	const { redirectUrl, ...rest } = props;
	children = normalizeWithDefaultValue(children, "Sign in with Metamask");
	const child = assertSingleChild(children)("SignInWithMetamaskButton");
	const clickHandler = async () => {
		async function authenticate() {
			await clerk.authenticateWithMetamask({ redirectUrl: redirectUrl || void 0 });
		}
		authenticate();
	};
	const wrappedChildClickHandler = async (e) => {
		await safeExecute(child.props.onClick)(e);
		return clickHandler();
	};
	const childProps = {
		...rest,
		onClick: wrappedChildClickHandler
	};
	return import_react.cloneElement(child, childProps);
}, {
	component: "SignInWithMetamask",
	renderWhileLoading: true
});
withClerk(({ clerk, children, ...props }) => {
	const { redirectUrl = "/", signOutOptions, ...rest } = props;
	children = normalizeWithDefaultValue(children, "Sign out");
	const child = assertSingleChild(children)("SignOutButton");
	const clickHandler = () => clerk.signOut({
		redirectUrl,
		...signOutOptions
	});
	const wrappedChildClickHandler = async (e) => {
		await safeExecute(child.props.onClick)(e);
		return clickHandler();
	};
	const childProps = {
		...rest,
		onClick: wrappedChildClickHandler
	};
	return import_react.cloneElement(child, childProps);
}, {
	component: "SignOutButton",
	renderWhileLoading: true
});
withClerk(({ clerk, children, ...props }) => {
	const { appearance, unsafeMetadata, fallbackRedirectUrl, forceRedirectUrl, signInFallbackRedirectUrl, signInForceRedirectUrl, mode, initialValues, oauthFlow, ...rest } = props;
	children = normalizeWithDefaultValue(children, "Sign up");
	const child = assertSingleChild(children)("SignUpButton");
	const clickHandler = () => {
		const opts = {
			fallbackRedirectUrl,
			forceRedirectUrl,
			signInFallbackRedirectUrl,
			signInForceRedirectUrl,
			initialValues,
			oauthFlow
		};
		if (mode === "modal") return clerk.openSignUp({
			...opts,
			appearance,
			unsafeMetadata
		});
		return clerk.redirectToSignUp({
			...opts,
			signUpFallbackRedirectUrl: fallbackRedirectUrl,
			signUpForceRedirectUrl: forceRedirectUrl
		});
	};
	const wrappedChildClickHandler = async (e) => {
		if (child && typeof child === "object" && "props" in child) await safeExecute(child.props.onClick)(e);
		return clickHandler();
	};
	const childProps = {
		...rest,
		onClick: wrappedChildClickHandler
	};
	return import_react.cloneElement(child, childProps);
}, {
	component: "SignUpButton",
	renderWhileLoading: true
});
var defaultSignInErrors = () => ({
	fields: {
		identifier: null,
		password: null,
		code: null
	},
	raw: null,
	global: null
});
var defaultSignUpErrors = () => ({
	fields: {
		firstName: null,
		lastName: null,
		emailAddress: null,
		phoneNumber: null,
		password: null,
		username: null,
		code: null,
		captcha: null,
		legalAccepted: null
	},
	raw: null,
	global: null
});
var StateProxy = class {
	constructor(isomorphicClerk) {
		this.isomorphicClerk = isomorphicClerk;
		this.signInSignalProxy = this.buildSignInProxy();
		this.signUpSignalProxy = this.buildSignUpProxy();
	}
	signInSignal() {
		return this.signInSignalProxy;
	}
	signUpSignal() {
		return this.signUpSignalProxy;
	}
	buildSignInProxy() {
		const gateProperty = this.gateProperty.bind(this);
		const target = () => this.client.signIn.__internal_future;
		return {
			errors: defaultSignInErrors(),
			fetchStatus: "idle",
			signIn: {
				status: "needs_identifier",
				availableStrategies: [],
				isTransferable: false,
				get id() {
					return gateProperty(target, "id", void 0);
				},
				get supportedFirstFactors() {
					return gateProperty(target, "supportedFirstFactors", []);
				},
				get supportedSecondFactors() {
					return gateProperty(target, "supportedSecondFactors", []);
				},
				get secondFactorVerification() {
					return gateProperty(target, "secondFactorVerification", {
						status: null,
						error: null,
						expireAt: null,
						externalVerificationRedirectURL: null,
						nonce: null,
						attempts: null,
						message: null,
						strategy: null,
						verifiedAtClient: null,
						verifiedFromTheSameClient: () => false,
						__internal_toSnapshot: () => {
							throw new Error("__internal_toSnapshot called before Clerk is loaded");
						},
						pathRoot: "",
						reload: () => {
							throw new Error("__internal_toSnapshot called before Clerk is loaded");
						}
					});
				},
				get identifier() {
					return gateProperty(target, "identifier", null);
				},
				get createdSessionId() {
					return gateProperty(target, "createdSessionId", null);
				},
				get userData() {
					return gateProperty(target, "userData", {});
				},
				get firstFactorVerification() {
					return gateProperty(target, "firstFactorVerification", {
						status: null,
						error: null,
						expireAt: null,
						externalVerificationRedirectURL: null,
						nonce: null,
						attempts: null,
						message: null,
						strategy: null,
						verifiedAtClient: null,
						verifiedFromTheSameClient: () => false,
						__internal_toSnapshot: () => {
							throw new Error("__internal_toSnapshot called before Clerk is loaded");
						},
						pathRoot: "",
						reload: () => {
							throw new Error("__internal_toSnapshot called before Clerk is loaded");
						}
					});
				},
				create: this.gateMethod(target, "create"),
				password: this.gateMethod(target, "password"),
				sso: this.gateMethod(target, "sso"),
				finalize: this.gateMethod(target, "finalize"),
				emailCode: this.wrapMethods(() => target().emailCode, ["sendCode", "verifyCode"]),
				emailLink: this.wrapStruct(() => target().emailLink, ["sendLink", "waitForVerification"], ["verification"], { verification: null }),
				resetPasswordEmailCode: this.wrapMethods(() => target().resetPasswordEmailCode, [
					"sendCode",
					"verifyCode",
					"submitPassword"
				]),
				phoneCode: this.wrapMethods(() => target().phoneCode, ["sendCode", "verifyCode"]),
				mfa: this.wrapMethods(() => target().mfa, [
					"sendPhoneCode",
					"verifyPhoneCode",
					"verifyTOTP",
					"verifyBackupCode"
				]),
				ticket: this.gateMethod(target, "ticket"),
				passkey: this.gateMethod(target, "passkey"),
				web3: this.gateMethod(target, "web3")
			}
		};
	}
	buildSignUpProxy() {
		const gateProperty = this.gateProperty.bind(this);
		const gateMethod = this.gateMethod.bind(this);
		const wrapMethods = this.wrapMethods.bind(this);
		const target = () => this.client.signUp.__internal_future;
		return {
			errors: defaultSignUpErrors(),
			fetchStatus: "idle",
			signUp: {
				get id() {
					return gateProperty(target, "id", void 0);
				},
				get requiredFields() {
					return gateProperty(target, "requiredFields", []);
				},
				get optionalFields() {
					return gateProperty(target, "optionalFields", []);
				},
				get missingFields() {
					return gateProperty(target, "missingFields", []);
				},
				get username() {
					return gateProperty(target, "username", null);
				},
				get firstName() {
					return gateProperty(target, "firstName", null);
				},
				get lastName() {
					return gateProperty(target, "lastName", null);
				},
				get emailAddress() {
					return gateProperty(target, "emailAddress", null);
				},
				get phoneNumber() {
					return gateProperty(target, "phoneNumber", null);
				},
				get web3Wallet() {
					return gateProperty(target, "web3Wallet", null);
				},
				get hasPassword() {
					return gateProperty(target, "hasPassword", false);
				},
				get unsafeMetadata() {
					return gateProperty(target, "unsafeMetadata", {});
				},
				get createdSessionId() {
					return gateProperty(target, "createdSessionId", null);
				},
				get createdUserId() {
					return gateProperty(target, "createdUserId", null);
				},
				get abandonAt() {
					return gateProperty(target, "abandonAt", null);
				},
				get legalAcceptedAt() {
					return gateProperty(target, "legalAcceptedAt", null);
				},
				get locale() {
					return gateProperty(target, "locale", null);
				},
				get status() {
					return gateProperty(target, "status", "missing_requirements");
				},
				get unverifiedFields() {
					return gateProperty(target, "unverifiedFields", []);
				},
				get isTransferable() {
					return gateProperty(target, "isTransferable", false);
				},
				create: gateMethod(target, "create"),
				update: gateMethod(target, "update"),
				sso: gateMethod(target, "sso"),
				password: gateMethod(target, "password"),
				ticket: gateMethod(target, "ticket"),
				web3: gateMethod(target, "web3"),
				finalize: gateMethod(target, "finalize"),
				verifications: wrapMethods(() => target().verifications, [
					"sendEmailCode",
					"verifyEmailCode",
					"sendPhoneCode",
					"verifyPhoneCode"
				])
			}
		};
	}
	__internal_effect(_) {
		throw new Error("__internal_effect called before Clerk is loaded");
	}
	__internal_computed(_) {
		throw new Error("__internal_computed called before Clerk is loaded");
	}
	get client() {
		const c = this.isomorphicClerk.client;
		if (!c) throw new Error("Clerk client not ready");
		return c;
	}
	gateProperty(getTarget, key, defaultValue) {
		return (() => {
			if (!inBrowser() || !this.isomorphicClerk.loaded) return defaultValue;
			return getTarget()[key];
		})();
	}
	gateMethod(getTarget, key) {
		return (async (...args) => {
			if (!inBrowser()) return errorThrower$1.throw(`Attempted to call a method (${key}) that is not supported on the server.`);
			if (!this.isomorphicClerk.loaded) await new Promise((resolve) => this.isomorphicClerk.addOnLoaded(resolve));
			const t = getTarget();
			return t[key].apply(t, args);
		});
	}
	wrapMethods(getTarget, keys) {
		return Object.fromEntries(keys.map((k) => [k, this.gateMethod(getTarget, k)]));
	}
	wrapStruct(getTarget, methods, getters, fallbacks) {
		const out = {};
		for (const m of methods) out[m] = this.gateMethod(getTarget, m);
		for (const g of getters) Object.defineProperty(out, g, {
			get: () => this.gateProperty(getTarget, g, fallbacks[g]),
			enumerable: true
		});
		return out;
	}
};
if (typeof globalThis.__BUILD_DISABLE_RHC__ === "undefined") globalThis.__BUILD_DISABLE_RHC__ = false;
var SDK_METADATA = {
	name: "@clerk/clerk-react",
	version: "5.61.9",
	environment: "production"
};
var _status;
var _domain;
var _proxyUrl;
var _publishableKey;
var _eventBus;
var _stateProxy;
var _instance;
var _IsomorphicClerk_instances;
var waitForClerkJS_fn;
var _IsomorphicClerk = class _IsomorphicClerk {
	constructor(options) {
		__privateAdd(this, _IsomorphicClerk_instances);
		this.clerkjs = null;
		this.preopenOneTap = null;
		this.preopenUserVerification = null;
		this.preopenEnableOrganizationsPrompt = null;
		this.preopenSignIn = null;
		this.preopenCheckout = null;
		this.preopenPlanDetails = null;
		this.preopenSubscriptionDetails = null;
		this.preopenSignUp = null;
		this.preopenUserProfile = null;
		this.preopenOrganizationProfile = null;
		this.preopenCreateOrganization = null;
		this.preOpenWaitlist = null;
		this.premountSignInNodes = /* @__PURE__ */ new Map();
		this.premountSignUpNodes = /* @__PURE__ */ new Map();
		this.premountUserAvatarNodes = /* @__PURE__ */ new Map();
		this.premountUserProfileNodes = /* @__PURE__ */ new Map();
		this.premountUserButtonNodes = /* @__PURE__ */ new Map();
		this.premountOrganizationProfileNodes = /* @__PURE__ */ new Map();
		this.premountCreateOrganizationNodes = /* @__PURE__ */ new Map();
		this.premountOrganizationSwitcherNodes = /* @__PURE__ */ new Map();
		this.premountOrganizationListNodes = /* @__PURE__ */ new Map();
		this.premountMethodCalls = /* @__PURE__ */ new Map();
		this.premountWaitlistNodes = /* @__PURE__ */ new Map();
		this.premountPricingTableNodes = /* @__PURE__ */ new Map();
		this.premountAPIKeysNodes = /* @__PURE__ */ new Map();
		this.premountOAuthConsentNodes = /* @__PURE__ */ new Map();
		this.premountTaskChooseOrganizationNodes = /* @__PURE__ */ new Map();
		this.premountTaskResetPasswordNodes = /* @__PURE__ */ new Map();
		this.premountTaskSetupMFANodes = /* @__PURE__ */ new Map();
		this.premountAddListenerCalls = /* @__PURE__ */ new Map();
		this.loadedListeners = [];
		__privateAdd(this, _status, "loading");
		__privateAdd(this, _domain);
		__privateAdd(this, _proxyUrl);
		__privateAdd(this, _publishableKey);
		__privateAdd(this, _eventBus, createClerkEventBus());
		__privateAdd(this, _stateProxy);
		this.buildSignInUrl = (opts) => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildSignInUrl(opts)) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildSignInUrl", callback);
		};
		this.buildSignUpUrl = (opts) => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildSignUpUrl(opts)) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildSignUpUrl", callback);
		};
		this.buildAfterSignInUrl = (...args) => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignInUrl(...args)) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildAfterSignInUrl", callback);
		};
		this.buildAfterSignUpUrl = (...args) => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignUpUrl(...args)) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildAfterSignUpUrl", callback);
		};
		this.buildAfterSignOutUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignOutUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildAfterSignOutUrl", callback);
		};
		this.buildNewSubscriptionRedirectUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildNewSubscriptionRedirectUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildNewSubscriptionRedirectUrl", callback);
		};
		this.buildAfterMultiSessionSingleSignOutUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterMultiSessionSingleSignOutUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildAfterMultiSessionSingleSignOutUrl", callback);
		};
		this.buildUserProfileUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildUserProfileUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildUserProfileUrl", callback);
		};
		this.buildCreateOrganizationUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildCreateOrganizationUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildCreateOrganizationUrl", callback);
		};
		this.buildOrganizationProfileUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildOrganizationProfileUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildOrganizationProfileUrl", callback);
		};
		this.buildWaitlistUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildWaitlistUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildWaitlistUrl", callback);
		};
		this.buildTasksUrl = () => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildTasksUrl()) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildTasksUrl", callback);
		};
		this.buildUrlWithAuth = (to) => {
			const callback = () => {
				var _a;
				return ((_a = this.clerkjs) == null ? void 0 : _a.buildUrlWithAuth(to)) || "";
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("buildUrlWithAuth", callback);
		};
		this.handleUnauthenticated = async () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.handleUnauthenticated();
			};
			if (this.clerkjs && this.loaded) callback();
			else this.premountMethodCalls.set("handleUnauthenticated", callback);
		};
		this.on = (...args) => {
			var _a;
			if ((_a = this.clerkjs) == null ? void 0 : _a.on) return this.clerkjs.on(...args);
			else __privateGet(this, _eventBus).on(...args);
		};
		this.off = (...args) => {
			var _a;
			if ((_a = this.clerkjs) == null ? void 0 : _a.off) return this.clerkjs.off(...args);
			else __privateGet(this, _eventBus).off(...args);
		};
		/**
		* @deprecated Please use `addStatusListener`. This api will be removed in the next major.
		*/
		this.addOnLoaded = (cb) => {
			this.loadedListeners.push(cb);
			if (this.loaded) this.emitLoaded();
		};
		/**
		* @deprecated Please use `__internal_setStatus`. This api will be removed in the next major.
		*/
		this.emitLoaded = () => {
			this.loadedListeners.forEach((cb) => cb());
			this.loadedListeners = [];
		};
		this.beforeLoad = (clerkjs) => {
			if (!clerkjs) throw new Error("Failed to hydrate latest Clerk JS");
		};
		this.hydrateClerkJS = (clerkjs) => {
			var _a, _b;
			if (!clerkjs) throw new Error("Failed to hydrate latest Clerk JS");
			this.clerkjs = clerkjs;
			this.premountMethodCalls.forEach((cb) => cb());
			this.premountAddListenerCalls.forEach((listenerHandlers, listener) => {
				listenerHandlers.nativeUnsubscribe = clerkjs.addListener(listener);
			});
			(_a = __privateGet(this, _eventBus).internal.retrieveListeners("status")) == null || _a.forEach((listener) => {
				this.on("status", listener, { notify: true });
			});
			(_b = __privateGet(this, _eventBus).internal.retrieveListeners("queryClientStatus")) == null || _b.forEach((listener) => {
				this.on("queryClientStatus", listener, { notify: true });
			});
			if (this.preopenSignIn !== null) clerkjs.openSignIn(this.preopenSignIn);
			if (this.preopenCheckout !== null) clerkjs.__internal_openCheckout(this.preopenCheckout);
			if (this.preopenPlanDetails !== null) clerkjs.__internal_openPlanDetails(this.preopenPlanDetails);
			if (this.preopenSubscriptionDetails !== null) clerkjs.__internal_openSubscriptionDetails(this.preopenSubscriptionDetails);
			if (this.preopenSignUp !== null) clerkjs.openSignUp(this.preopenSignUp);
			if (this.preopenUserProfile !== null) clerkjs.openUserProfile(this.preopenUserProfile);
			if (this.preopenUserVerification !== null) clerkjs.__internal_openReverification(this.preopenUserVerification);
			if (this.preopenOneTap !== null) clerkjs.openGoogleOneTap(this.preopenOneTap);
			if (this.preopenOrganizationProfile !== null) clerkjs.openOrganizationProfile(this.preopenOrganizationProfile);
			if (this.preopenCreateOrganization !== null) clerkjs.openCreateOrganization(this.preopenCreateOrganization);
			if (this.preOpenWaitlist !== null) clerkjs.openWaitlist(this.preOpenWaitlist);
			if (this.preopenEnableOrganizationsPrompt) clerkjs.__internal_openEnableOrganizationsPrompt(this.preopenEnableOrganizationsPrompt);
			this.premountSignInNodes.forEach((props, node) => {
				clerkjs.mountSignIn(node, props);
			});
			this.premountSignUpNodes.forEach((props, node) => {
				clerkjs.mountSignUp(node, props);
			});
			this.premountUserProfileNodes.forEach((props, node) => {
				clerkjs.mountUserProfile(node, props);
			});
			this.premountUserAvatarNodes.forEach((props, node) => {
				clerkjs.mountUserAvatar(node, props);
			});
			this.premountUserButtonNodes.forEach((props, node) => {
				clerkjs.mountUserButton(node, props);
			});
			this.premountOrganizationListNodes.forEach((props, node) => {
				clerkjs.mountOrganizationList(node, props);
			});
			this.premountWaitlistNodes.forEach((props, node) => {
				clerkjs.mountWaitlist(node, props);
			});
			this.premountPricingTableNodes.forEach((props, node) => {
				clerkjs.mountPricingTable(node, props);
			});
			this.premountAPIKeysNodes.forEach((props, node) => {
				clerkjs.mountAPIKeys(node, props);
			});
			this.premountOAuthConsentNodes.forEach((props, node) => {
				clerkjs.__internal_mountOAuthConsent(node, props);
			});
			this.premountTaskChooseOrganizationNodes.forEach((props, node) => {
				clerkjs.mountTaskChooseOrganization(node, props);
			});
			this.premountTaskResetPasswordNodes.forEach((props, node) => {
				clerkjs.mountTaskResetPassword(node, props);
			});
			this.premountTaskSetupMFANodes.forEach((props, node) => {
				clerkjs.mountTaskSetupMFA(node, props);
			});
			if (typeof this.clerkjs.status === "undefined") __privateGet(this, _eventBus).emit(clerkEvents.Status, "ready");
			this.emitLoaded();
			return this.clerkjs;
		};
		this.__experimental_checkout = (...args) => {
			var _a;
			return (_a = this.clerkjs) == null ? void 0 : _a.__experimental_checkout(...args);
		};
		this.__unstable__updateProps = async (props) => {
			const clerkjs = await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this);
			if (clerkjs && "__unstable__updateProps" in clerkjs) return clerkjs.__unstable__updateProps(props);
		};
		/**
		* `setActive` can be used to set the active session and/or organization.
		*/
		this.setActive = (params) => {
			if (this.clerkjs) return this.clerkjs.setActive(params);
			else return Promise.reject();
		};
		this.openSignIn = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openSignIn(props);
			else this.preopenSignIn = props;
		};
		this.closeSignIn = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeSignIn();
			else this.preopenSignIn = null;
		};
		this.__internal_openCheckout = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_openCheckout(props);
			else this.preopenCheckout = props;
		};
		this.__internal_closeCheckout = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_closeCheckout();
			else this.preopenCheckout = null;
		};
		this.__internal_openPlanDetails = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_openPlanDetails(props);
			else this.preopenPlanDetails = props;
		};
		this.__internal_closePlanDetails = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_closePlanDetails();
			else this.preopenPlanDetails = null;
		};
		this.__internal_openSubscriptionDetails = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_openSubscriptionDetails(props);
			else this.preopenSubscriptionDetails = props != null ? props : null;
		};
		this.__internal_closeSubscriptionDetails = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_closeSubscriptionDetails();
			else this.preopenSubscriptionDetails = null;
		};
		this.__internal_openReverification = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_openReverification(props);
			else this.preopenUserVerification = props;
		};
		this.__internal_closeReverification = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_closeReverification();
			else this.preopenUserVerification = null;
		};
		this.__internal_openEnableOrganizationsPrompt = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_openEnableOrganizationsPrompt(props);
			else this.preopenEnableOrganizationsPrompt = props;
		};
		this.__internal_closeEnableOrganizationsPrompt = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_closeEnableOrganizationsPrompt();
			else this.preopenEnableOrganizationsPrompt = null;
		};
		this.openGoogleOneTap = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openGoogleOneTap(props);
			else this.preopenOneTap = props;
		};
		this.closeGoogleOneTap = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeGoogleOneTap();
			else this.preopenOneTap = null;
		};
		this.openUserProfile = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openUserProfile(props);
			else this.preopenUserProfile = props;
		};
		this.closeUserProfile = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeUserProfile();
			else this.preopenUserProfile = null;
		};
		this.openOrganizationProfile = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openOrganizationProfile(props);
			else this.preopenOrganizationProfile = props;
		};
		this.closeOrganizationProfile = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeOrganizationProfile();
			else this.preopenOrganizationProfile = null;
		};
		this.openCreateOrganization = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openCreateOrganization(props);
			else this.preopenCreateOrganization = props;
		};
		this.closeCreateOrganization = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeCreateOrganization();
			else this.preopenCreateOrganization = null;
		};
		this.openWaitlist = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openWaitlist(props);
			else this.preOpenWaitlist = props;
		};
		this.closeWaitlist = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeWaitlist();
			else this.preOpenWaitlist = null;
		};
		this.openSignUp = (props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.openSignUp(props);
			else this.preopenSignUp = props;
		};
		this.closeSignUp = () => {
			if (this.clerkjs && this.loaded) this.clerkjs.closeSignUp();
			else this.preopenSignUp = null;
		};
		this.mountSignIn = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountSignIn(node, props);
			else this.premountSignInNodes.set(node, props);
		};
		this.unmountSignIn = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountSignIn(node);
			else this.premountSignInNodes.delete(node);
		};
		this.mountSignUp = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountSignUp(node, props);
			else this.premountSignUpNodes.set(node, props);
		};
		this.unmountSignUp = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountSignUp(node);
			else this.premountSignUpNodes.delete(node);
		};
		this.mountUserAvatar = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountUserAvatar(node, props);
			else this.premountUserAvatarNodes.set(node, props);
		};
		this.unmountUserAvatar = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountUserAvatar(node);
			else this.premountUserAvatarNodes.delete(node);
		};
		this.mountUserProfile = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountUserProfile(node, props);
			else this.premountUserProfileNodes.set(node, props);
		};
		this.unmountUserProfile = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountUserProfile(node);
			else this.premountUserProfileNodes.delete(node);
		};
		this.mountOrganizationProfile = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountOrganizationProfile(node, props);
			else this.premountOrganizationProfileNodes.set(node, props);
		};
		this.unmountOrganizationProfile = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountOrganizationProfile(node);
			else this.premountOrganizationProfileNodes.delete(node);
		};
		this.mountCreateOrganization = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountCreateOrganization(node, props);
			else this.premountCreateOrganizationNodes.set(node, props);
		};
		this.unmountCreateOrganization = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountCreateOrganization(node);
			else this.premountCreateOrganizationNodes.delete(node);
		};
		this.mountOrganizationSwitcher = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountOrganizationSwitcher(node, props);
			else this.premountOrganizationSwitcherNodes.set(node, props);
		};
		this.unmountOrganizationSwitcher = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountOrganizationSwitcher(node);
			else this.premountOrganizationSwitcherNodes.delete(node);
		};
		this.__experimental_prefetchOrganizationSwitcher = () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.__experimental_prefetchOrganizationSwitcher();
			};
			if (this.clerkjs && this.loaded) callback();
			else this.premountMethodCalls.set("__experimental_prefetchOrganizationSwitcher", callback);
		};
		this.mountOrganizationList = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountOrganizationList(node, props);
			else this.premountOrganizationListNodes.set(node, props);
		};
		this.unmountOrganizationList = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountOrganizationList(node);
			else this.premountOrganizationListNodes.delete(node);
		};
		this.mountUserButton = (node, userButtonProps) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountUserButton(node, userButtonProps);
			else this.premountUserButtonNodes.set(node, userButtonProps);
		};
		this.unmountUserButton = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountUserButton(node);
			else this.premountUserButtonNodes.delete(node);
		};
		this.mountWaitlist = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountWaitlist(node, props);
			else this.premountWaitlistNodes.set(node, props);
		};
		this.unmountWaitlist = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountWaitlist(node);
			else this.premountWaitlistNodes.delete(node);
		};
		this.mountPricingTable = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountPricingTable(node, props);
			else this.premountPricingTableNodes.set(node, props);
		};
		this.unmountPricingTable = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountPricingTable(node);
			else this.premountPricingTableNodes.delete(node);
		};
		this.mountAPIKeys = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountAPIKeys(node, props);
			else this.premountAPIKeysNodes.set(node, props);
		};
		this.unmountAPIKeys = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountAPIKeys(node);
			else this.premountAPIKeysNodes.delete(node);
		};
		this.__internal_mountOAuthConsent = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_mountOAuthConsent(node, props);
			else this.premountOAuthConsentNodes.set(node, props);
		};
		this.__internal_unmountOAuthConsent = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.__internal_unmountOAuthConsent(node);
			else this.premountOAuthConsentNodes.delete(node);
		};
		this.mountTaskChooseOrganization = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountTaskChooseOrganization(node, props);
			else this.premountTaskChooseOrganizationNodes.set(node, props);
		};
		this.unmountTaskChooseOrganization = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountTaskChooseOrganization(node);
			else this.premountTaskChooseOrganizationNodes.delete(node);
		};
		this.mountTaskResetPassword = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountTaskResetPassword(node, props);
			else this.premountTaskResetPasswordNodes.set(node, props);
		};
		this.unmountTaskResetPassword = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountTaskResetPassword(node);
			else this.premountTaskResetPasswordNodes.delete(node);
		};
		this.mountTaskSetupMFA = (node, props) => {
			if (this.clerkjs && this.loaded) this.clerkjs.mountTaskSetupMFA(node, props);
			else this.premountTaskSetupMFANodes.set(node, props);
		};
		this.unmountTaskSetupMFA = (node) => {
			if (this.clerkjs && this.loaded) this.clerkjs.unmountTaskSetupMFA(node);
			else this.premountTaskSetupMFANodes.delete(node);
		};
		this.addListener = (listener) => {
			if (this.clerkjs) return this.clerkjs.addListener(listener);
			else {
				const unsubscribe = () => {
					var _a;
					const listenerHandlers = this.premountAddListenerCalls.get(listener);
					if (listenerHandlers) {
						(_a = listenerHandlers.nativeUnsubscribe) == null || _a.call(listenerHandlers);
						this.premountAddListenerCalls.delete(listener);
					}
				};
				this.premountAddListenerCalls.set(listener, {
					unsubscribe,
					nativeUnsubscribe: void 0
				});
				return unsubscribe;
			}
		};
		this.navigate = (to) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.navigate(to);
			};
			if (this.clerkjs && this.loaded) callback();
			else this.premountMethodCalls.set("navigate", callback);
		};
		this.redirectWithAuth = async (...args) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectWithAuth(...args);
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectWithAuth", callback);
				return;
			}
		};
		this.redirectToSignIn = async (opts) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToSignIn(opts);
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToSignIn", callback);
				return;
			}
		};
		this.redirectToSignUp = async (opts) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToSignUp(opts);
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToSignUp", callback);
				return;
			}
		};
		this.redirectToUserProfile = async () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToUserProfile();
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToUserProfile", callback);
				return;
			}
		};
		this.redirectToAfterSignUp = () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignUp();
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("redirectToAfterSignUp", callback);
		};
		this.redirectToAfterSignIn = () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignIn();
			};
			if (this.clerkjs && this.loaded) callback();
			else this.premountMethodCalls.set("redirectToAfterSignIn", callback);
		};
		this.redirectToAfterSignOut = () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignOut();
			};
			if (this.clerkjs && this.loaded) callback();
			else this.premountMethodCalls.set("redirectToAfterSignOut", callback);
		};
		this.redirectToOrganizationProfile = async () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToOrganizationProfile();
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToOrganizationProfile", callback);
				return;
			}
		};
		this.redirectToCreateOrganization = async () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToCreateOrganization();
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToCreateOrganization", callback);
				return;
			}
		};
		this.redirectToWaitlist = async () => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToWaitlist();
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToWaitlist", callback);
				return;
			}
		};
		this.redirectToTasks = async (opts) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.redirectToTasks(opts);
			};
			if (this.clerkjs && this.loaded) return callback();
			else {
				this.premountMethodCalls.set("redirectToTasks", callback);
				return;
			}
		};
		this.handleRedirectCallback = async (params) => {
			var _a;
			const callback = () => {
				var _a2;
				return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleRedirectCallback(params);
			};
			if (this.clerkjs && this.loaded) (_a = callback()) == null || _a.catch(() => {});
			else this.premountMethodCalls.set("handleRedirectCallback", callback);
		};
		this.handleGoogleOneTapCallback = async (signInOrUp, params) => {
			var _a;
			const callback = () => {
				var _a2;
				return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleGoogleOneTapCallback(signInOrUp, params);
			};
			if (this.clerkjs && this.loaded) (_a = callback()) == null || _a.catch(() => {});
			else this.premountMethodCalls.set("handleGoogleOneTapCallback", callback);
		};
		this.handleEmailLinkVerification = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.handleEmailLinkVerification(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("handleEmailLinkVerification", callback);
		};
		this.authenticateWithMetamask = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithMetamask(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithMetamask", callback);
		};
		this.authenticateWithCoinbaseWallet = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithCoinbaseWallet(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithCoinbaseWallet", callback);
		};
		this.authenticateWithBase = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithBase(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithBase", callback);
		};
		this.authenticateWithOKXWallet = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithOKXWallet(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithOKXWallet", callback);
		};
		this.authenticateWithSolana = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithSolana(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithSolana", callback);
		};
		this.authenticateWithWeb3 = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithWeb3(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("authenticateWithWeb3", callback);
		};
		this.authenticateWithGoogleOneTap = async (params) => {
			return (await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this)).authenticateWithGoogleOneTap(params);
		};
		this.__internal_loadStripeJs = async () => {
			return (await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this)).__internal_loadStripeJs();
		};
		this.createOrganization = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.createOrganization(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("createOrganization", callback);
		};
		this.getOrganization = async (organizationId) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.getOrganization(organizationId);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("getOrganization", callback);
		};
		this.joinWaitlist = async (params) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.joinWaitlist(params);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("joinWaitlist", callback);
		};
		this.signOut = async (...args) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.signOut(...args);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("signOut", callback);
		};
		this.__internal_attemptToEnableEnvironmentSetting = (options) => {
			const callback = () => {
				var _a;
				return (_a = this.clerkjs) == null ? void 0 : _a.__internal_attemptToEnableEnvironmentSetting(options);
			};
			if (this.clerkjs && this.loaded) return callback();
			else this.premountMethodCalls.set("__internal_attemptToEnableEnvironmentSetting", callback);
		};
		const { Clerk = null, publishableKey } = options || {};
		__privateSet(this, _publishableKey, publishableKey);
		__privateSet(this, _proxyUrl, options == null ? void 0 : options.proxyUrl);
		__privateSet(this, _domain, options == null ? void 0 : options.domain);
		this.options = options;
		this.Clerk = Clerk;
		this.mode = inBrowser() ? "browser" : "server";
		__privateSet(this, _stateProxy, new StateProxy(this));
		if (!this.options.sdkMetadata) this.options.sdkMetadata = SDK_METADATA;
		__privateGet(this, _eventBus).emit(clerkEvents.Status, "loading");
		__privateGet(this, _eventBus).prioritizedOn(clerkEvents.Status, (status) => __privateSet(this, _status, status));
		if (__privateGet(this, _publishableKey)) this.loadClerkJS();
	}
	get publishableKey() {
		return __privateGet(this, _publishableKey);
	}
	get loaded() {
		var _a;
		return ((_a = this.clerkjs) == null ? void 0 : _a.loaded) || false;
	}
	get status() {
		var _a;
		if (!this.clerkjs) return __privateGet(this, _status);
		return ((_a = this.clerkjs) == null ? void 0 : _a.status) || (this.clerkjs.loaded ? "ready" : "loading");
	}
	static getOrCreateInstance(options) {
		if (!inBrowser() || !__privateGet(this, _instance) || options.Clerk && __privateGet(this, _instance).Clerk !== options.Clerk || __privateGet(this, _instance).publishableKey !== options.publishableKey) __privateSet(this, _instance, new _IsomorphicClerk(options));
		return __privateGet(this, _instance);
	}
	static clearInstance() {
		__privateSet(this, _instance, null);
	}
	get domain() {
		if (typeof window !== "undefined" && window.location) return handleValueOrFn(__privateGet(this, _domain), new URL(window.location.href), "");
		if (typeof __privateGet(this, _domain) === "function") return errorThrower$1.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
		return __privateGet(this, _domain) || "";
	}
	get proxyUrl() {
		if (typeof window !== "undefined" && window.location) return handleValueOrFn(__privateGet(this, _proxyUrl), new URL(window.location.href), "");
		if (typeof __privateGet(this, _proxyUrl) === "function") return errorThrower$1.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
		return __privateGet(this, _proxyUrl) || "";
	}
	/**
	* Accesses private options from the `Clerk` instance and defaults to
	* `IsomorphicClerk` options when in SSR context.
	*  @internal
	*/
	__internal_getOption(key) {
		var _a, _b;
		return ((_a = this.clerkjs) == null ? void 0 : _a.__internal_getOption) ? (_b = this.clerkjs) == null ? void 0 : _b.__internal_getOption(key) : this.options[key];
	}
	get sdkMetadata() {
		var _a;
		return ((_a = this.clerkjs) == null ? void 0 : _a.sdkMetadata) || this.options.sdkMetadata || void 0;
	}
	get instanceType() {
		var _a;
		return (_a = this.clerkjs) == null ? void 0 : _a.instanceType;
	}
	get frontendApi() {
		var _a;
		return ((_a = this.clerkjs) == null ? void 0 : _a.frontendApi) || "";
	}
	get isStandardBrowser() {
		var _a;
		return ((_a = this.clerkjs) == null ? void 0 : _a.isStandardBrowser) || this.options.standardBrowser || false;
	}
	get __internal_queryClient() {
		var _a;
		return (_a = this.clerkjs) == null ? void 0 : _a.__internal_queryClient;
	}
	get isSatellite() {
		if (typeof window !== "undefined" && window.location) return handleValueOrFn(this.options.isSatellite, new URL(window.location.href), false);
		if (typeof this.options.isSatellite === "function") return errorThrower$1.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
		return false;
	}
	async loadClerkJS() {
		var _a;
		if (this.mode !== "browser" || this.loaded) return;
		if (typeof window !== "undefined") {
			window.__clerk_publishable_key = __privateGet(this, _publishableKey);
			window.__clerk_proxy_url = this.proxyUrl;
			window.__clerk_domain = this.domain;
		}
		try {
			if (this.Clerk) {
				let c;
				if (isConstructor(this.Clerk)) {
					c = new this.Clerk(__privateGet(this, _publishableKey), {
						proxyUrl: this.proxyUrl,
						domain: this.domain
					});
					this.beforeLoad(c);
					await c.load(this.options);
				} else {
					c = this.Clerk;
					if (!c.loaded) {
						this.beforeLoad(c);
						await c.load(this.options);
					}
				}
				global.Clerk = c;
			} else if (!__BUILD_DISABLE_RHC__) {
				if (!global.Clerk) await loadClerkJsScript({
					...this.options,
					publishableKey: __privateGet(this, _publishableKey),
					proxyUrl: this.proxyUrl,
					domain: this.domain,
					nonce: this.options.nonce
				});
				if (!global.Clerk) throw new Error("Failed to download latest ClerkJS. Contact support@clerk.com.");
				this.beforeLoad(global.Clerk);
				await global.Clerk.load(this.options);
			}
			if ((_a = global.Clerk) == null ? void 0 : _a.loaded) return this.hydrateClerkJS(global.Clerk);
			return;
		} catch (err) {
			const error = err;
			__privateGet(this, _eventBus).emit(clerkEvents.Status, "error");
			console.error(error.stack || error.message || error);
			return;
		}
	}
	get version() {
		var _a;
		return (_a = this.clerkjs) == null ? void 0 : _a.version;
	}
	get client() {
		if (this.clerkjs) return this.clerkjs.client;
		else return;
	}
	get session() {
		if (this.clerkjs) return this.clerkjs.session;
		else return;
	}
	get user() {
		if (this.clerkjs) return this.clerkjs.user;
		else return;
	}
	get organization() {
		if (this.clerkjs) return this.clerkjs.organization;
		else return;
	}
	get telemetry() {
		if (this.clerkjs) return this.clerkjs.telemetry;
		else return;
	}
	get __unstable__environment() {
		if (this.clerkjs) return this.clerkjs.__unstable__environment;
		else return;
	}
	get isSignedIn() {
		if (this.clerkjs) return this.clerkjs.isSignedIn;
		else return false;
	}
	get billing() {
		var _a;
		return (_a = this.clerkjs) == null ? void 0 : _a.billing;
	}
	get __internal_state() {
		return this.loaded && this.clerkjs ? this.clerkjs.__internal_state : __privateGet(this, _stateProxy);
	}
	get apiKeys() {
		var _a;
		return (_a = this.clerkjs) == null ? void 0 : _a.apiKeys;
	}
	__unstable__setEnvironment(...args) {
		if (this.clerkjs && "__unstable__setEnvironment" in this.clerkjs) this.clerkjs.__unstable__setEnvironment(args);
		else return;
	}
};
_status = /* @__PURE__ */ new WeakMap();
_domain = /* @__PURE__ */ new WeakMap();
_proxyUrl = /* @__PURE__ */ new WeakMap();
_publishableKey = /* @__PURE__ */ new WeakMap();
_eventBus = /* @__PURE__ */ new WeakMap();
_stateProxy = /* @__PURE__ */ new WeakMap();
_instance = /* @__PURE__ */ new WeakMap();
_IsomorphicClerk_instances = /* @__PURE__ */ new WeakSet();
waitForClerkJS_fn = function() {
	return new Promise((resolve) => {
		this.addOnLoaded(() => resolve(this.clerkjs));
	});
};
__privateAdd(_IsomorphicClerk, _instance);
var IsomorphicClerk = _IsomorphicClerk;
function ClerkContextProvider(props) {
	const { isomorphicClerkOptions, initialState, children } = props;
	const { isomorphicClerk: clerk, clerkStatus } = useLoadedIsomorphicClerk(isomorphicClerkOptions);
	const [state, setState] = import_react.useState({
		client: clerk.client,
		session: clerk.session,
		user: clerk.user,
		organization: clerk.organization
	});
	import_react.useEffect(() => {
		return clerk.addListener((e) => setState({ ...e }));
	}, []);
	const derivedState = deriveState(clerk.loaded, state, initialState);
	const clerkCtx = import_react.useMemo(() => ({ value: clerk }), [clerkStatus]);
	const clientCtx = import_react.useMemo(() => ({ value: state.client }), [state.client]);
	const { sessionId, sessionStatus, sessionClaims, session, userId, user, orgId, actor, organization, orgRole, orgSlug, orgPermissions, factorVerificationAge } = derivedState;
	const authCtx = import_react.useMemo(() => {
		return { value: {
			sessionId,
			sessionStatus,
			sessionClaims,
			userId,
			actor,
			orgId,
			orgRole,
			orgSlug,
			orgPermissions,
			factorVerificationAge
		} };
	}, [
		sessionId,
		sessionStatus,
		userId,
		actor,
		orgId,
		orgRole,
		orgSlug,
		factorVerificationAge,
		sessionClaims == null ? void 0 : sessionClaims.__raw
	]);
	const sessionCtx = import_react.useMemo(() => ({ value: session }), [sessionId, session]);
	const userCtx = import_react.useMemo(() => ({ value: user }), [userId, user]);
	const organizationCtx = import_react.useMemo(() => {
		return { value: { organization } };
	}, [orgId, organization]);
	return /* @__PURE__ */ import_react.createElement(IsomorphicClerkContext.Provider, { value: clerkCtx }, /* @__PURE__ */ import_react.createElement(ClientContext.Provider, { value: clientCtx }, /* @__PURE__ */ import_react.createElement(SessionContext.Provider, { value: sessionCtx }, /* @__PURE__ */ import_react.createElement(OrganizationProvider, { ...organizationCtx.value }, /* @__PURE__ */ import_react.createElement(AuthContext.Provider, { value: authCtx }, /* @__PURE__ */ import_react.createElement(UserContext.Provider, { value: userCtx }, /* @__PURE__ */ import_react.createElement(__experimental_CheckoutProvider, { value: void 0 }, children)))))));
}
var useLoadedIsomorphicClerk = (options) => {
	const isomorphicClerkRef = import_react.useRef(IsomorphicClerk.getOrCreateInstance(options));
	const [clerkStatus, setClerkStatus] = import_react.useState(isomorphicClerkRef.current.status);
	import_react.useEffect(() => {
		isomorphicClerkRef.current.__unstable__updateProps({ appearance: options.appearance });
	}, [options.appearance]);
	import_react.useEffect(() => {
		isomorphicClerkRef.current.__unstable__updateProps({ options });
	}, [options.localization]);
	import_react.useEffect(() => {
		isomorphicClerkRef.current.on("status", setClerkStatus);
		return () => {
			if (isomorphicClerkRef.current) isomorphicClerkRef.current.off("status", setClerkStatus);
			IsomorphicClerk.clearInstance();
		};
	}, []);
	return {
		isomorphicClerk: isomorphicClerkRef.current,
		clerkStatus
	};
};
function ClerkProviderBase(props) {
	const { initialState, children, __internal_bypassMissingPublishableKey, ...restIsomorphicClerkOptions } = props;
	const { publishableKey = "", Clerk: userInitialisedClerk } = restIsomorphicClerkOptions;
	if (!userInitialisedClerk && !__internal_bypassMissingPublishableKey) {
		if (!publishableKey) errorThrower$1.throwMissingPublishableKeyError();
		else if (publishableKey && !isPublishableKey(publishableKey)) errorThrower$1.throwInvalidPublishableKeyError({ key: publishableKey });
	}
	return /* @__PURE__ */ import_react.createElement(ClerkContextProvider, {
		initialState,
		isomorphicClerkOptions: restIsomorphicClerkOptions
	}, children);
}
var ClerkProvider = withMaxAllowedInstancesGuard(ClerkProviderBase, "ClerkProvider", multipleClerkProvidersError);
ClerkProvider.displayName = "ClerkProvider";
setErrorThrowerOptions({ packageName: "@clerk/clerk-react" });
setClerkJsLoadingErrorPackageName("@clerk/clerk-react");
//#endregion
export { useClerk as a, require_react as c, useAuth as i, SignIn as n, require_react_dom as o, SignUp as r, require_shim as s, ClerkProvider as t };
