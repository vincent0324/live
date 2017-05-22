/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(18);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Detail = function () {
    function Detail() {
        _classCallCheck(this, Detail);

        this.init();
    }

    _createClass(Detail, [{
        key: 'init',
        value: function init() {
            this.bindEvent();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var tabButton = document.getElementById('live-detail-button');
            var tabContent = document.getElementById('live-detail-text');
            var tabButtonIcon = tabButton.getElementsByTagName('i')[0];

            tabButton.addEventListener('click', function () {
                if (tabButton.className === 'live-detail-button') {
                    tabButton.className = 'live-detail-button on';
                    tabContent.className = 'live-detail-text';
                    tabButtonIcon.innerHTML = '&#xe605;';
                } else {
                    tabButton.className = 'live-detail-button';
                    tabContent.className = 'live-detail-text fn-hide';
                    tabButtonIcon.innerHTML = '&#xe606;';
                }
            }, false);
        }
    }]);

    return Detail;
}();

;

exports.default = Detail;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(19);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Update = function () {
    function Update() {
        _classCallCheck(this, Update);

        this.init();
    }

    _createClass(Update, [{
        key: 'init',
        value: function init() {
            this.bindEvent();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            //
        }
    }]);

    return Update;
}();

;

exports.default = Update;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./banner.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./banner.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./bread.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./bread.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./common.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./common.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./detail.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./detail.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./like.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./like.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./tab.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./tab.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(6);

__webpack_require__(4);

__webpack_require__(7);

__webpack_require__(9);

__webpack_require__(8);

__webpack_require__(5);

var _Detail = __webpack_require__(2);

var _Detail2 = _interopRequireDefault(_Detail);

var _Update = __webpack_require__(3);

var _Update2 = _interopRequireDefault(_Update);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var detail = new _Detail2.default();

// import Tab from './js/Tab';
// let tab = new Tab();

// import React from 'react';
// import { render } from 'react-dom';

var update = new _Update2.default();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".live-item-banner {\n    width: 16rem;\n    position: relative;\n}\n\n.live-item-banner img {\n    width: 16rem;\n}\n\n.live-item-status {\n    height: 1.2rem;\n    border-radius: 0.6rem;\n    position: absolute;\n    top: 0.7rem;\n    right: 0.7rem;\n    background-color: rgba(0, 0, 0, 0.3);\n    border: 0.05rem solid white;\n    line-height: 1.1rem;\n    overflow: hidden;\n    text-align: center;\n    color: white;\n    font-size: 0.55rem;\n    padding: 0 0.4rem;\n}\n\n.live-item-status i {\n    font-size: 0.5rem;\n    color: #fffc25;\n    display: inline-block;\n    vertical-align: top;\n}\n\n.live-item-status span {\n    display: inline-block;\n    vertical-align: middle;\n    width: 0.3rem;\n    height: 0.3rem;\n    background-color: white;\n    border-radius: 50%;\n    margin-right: 0.3rem;\n}\n\n.banner-cover {\n    display: flex;\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    -webkit-align-items: center;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    background-color: rgba(0, 0, 0, 0.35);\n    font-size: 0.7rem;\n}\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".bread {\n    font-size: 0.55rem;\n    line-height: 1rem;\n    color: #5d5d5d;\n    margin-top: 0.5rem;\n}\n\n.bread .wrap {\n    padding: 0 0.5rem;\n}\n\n.bread a {\n    color: #5d5d5d;\n}\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "html {\n    font-family: sans-serif;\n    text-size-adjust: 100%;\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%;\n}\n\nbody, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, select, p, blockquote, th, td, hr, button, article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    margin: 0;\n    padding: 0\n}\n\nbody {\n    color: #434343;\n    background-color: white;\n    height: 100%;\n    overflow-x: hidden;\n    -webkit-overflow-scrolling: touch;\n}\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary {\n    display: block;\n}\n\naudio, canvas, progress, video {\n    display: inline-block;\n    vertical-align: baseline;\n}\n\naudio:not([controls]) {\n    display: none;\n    height: 0;\n}\n\n[hidden], template {\n    display: none;\n}\n\nsvg:not(:root) {\n    overflow: hidden;\n}\n\na {\n    background: transparent;\n    text-decoration: none;\n    -webkit-tap-highlight-color: transparent;\n}\n\na:active {\n    outline: 0;\n}\n\na:active {\n    color: #006699;\n}\n\nabbr[title] {\n    border-bottom: 1px dotted;\n}\n\nb, strong {\n    font-weight: bold;\n}\n\ndfn {\n    font-style: italic;\n}\n\nmark {\n    background: #ff0;\n    color: #000;\n}\n\nsmall {\n    font-size: 80%;\n}\n\nsub, sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsup {\n    top: -0.5em;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\nimg, fieldset {\n    border: 0;\n}\n\nimg {\n    vertical-align: middle;\n}\n\nhr {\n    box-sizing: content-box;\n    height: 0;\n}\n\npre {\n    overflow: auto;\n    white-space: pre;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n}\n\ncode, kbd, pre, samp {\n    font-family: monospace, monospace;\n    font-size: 1em;\n}\n\nbutton, input, optgroup, select, textarea {\n    color: inherit;\n    font: inherit;\n}\n\nbutton {\n    overflow: visible;\n}\n\nbutton, select {\n    text-transform: none;\n}\n\nbutton, html input[type=\"button\"], input[type=\"reset\"], input[type=\"submit\"] {\n    -webkit-appearance: button;\n    cursor: pointer;\n}\n\nbutton[disabled], html input[disabled] {\n    cursor: default;\n}\n\ninput {\n    line-height: normal;\n    outline: none;\n}\n\ninput[type=\"checkbox\"], input[type=\"radio\"] {\n    box-sizing: border-box;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button, input[type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n}\n\ninput[type=\"text\"], input[type=\"password\"] {\n    -webkit-appearance: none;\n}\n\ninput[type=\"search\"] {\n    -webkit-appearance: textfield;\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button, input[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\nlegend {\n    border: 0;\n}\n\ntextarea {\n    overflow: auto;\n    resize: none;\n}\n\noptgroup {\n    font-weight: bold;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n\nbutton, input, select, textarea {\n    font-family: \"Helvetica Neue\", Helvetica, STHeiTi, Arial, sans-serif;\n}\n\nul, ol {\n    list-style: none outside none;\n}\n\nh1, h2, h3, h4, h5, h6 {\n    font-weight: normal;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n    color: #ccc;\n}\n\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\n    color: #ccc;\n}\n\ninput[type=\"submit\"], input[type=\"reset\"], input[type=\"button\"] {\n    -webkit-appearance: none;\n}\n\n* {\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n.clearfix:before, .clearfix:after {\n    content: \" \";\n    display: table\n}\n\n.clearfix:after {\n    clear: both\n}\n\n.fn-hide {\n    display: none;\n}\n\n.fn-left {\n    float: left;\n}\n\n.fn-right {\n    float: right;\n}\n\n.fn-text-overflow {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.fn-rmb {\n    font-family: arial;\n    font-style: normal;\n}\n\n\n/* font */\n\n@font-face {\n    font-family: 'icon';\n    src: url('http://assets.diandong.com/web/font/common/iconfont.eot');\n    src: url('http://assets.diandong.com/web/font/common/iconfont.eot?#iefix') format('embedded-opentype'), url('http://assets.diandong.com/web/font/common/iconfont.woff') format('woff'), url('http://assets.diandong.com/web/font/common/iconfont.ttf') format('truetype'), url('http://assets.diandong.com/web/font/common/iconfont.svg#uxiconfont') format('svg');\n}\n\n.icon {\n    font-family: \"icon\" !important;\n    font-size: 16px;\n    font-style: normal;\n    -webkit-font-smoothing: antialiased;\n    -webkit-text-stroke-width: 0.2px;\n    -moz-osx-font-smoothing: grayscale;\n}\n\n\n/* font end */\n\n.wrap {\n    width: 16rem;\n    margin: 0 auto;\n}\n\n@font-face {\n    font-family: 'liveicon';\n    src: url('http://assets.diandong.com/mobile/live/build/font/iconfont.eot');\n    src: url('http://assets.diandong.com/mobile/live/build/font/iconfont.eot?#iefix') format('embedded-opentype'), url('http://assets.diandong.com/mobile/live/build/font/iconfont.woff') format('woff'), url('http://assets.diandong.com/mobile/live/build/font/iconfont.ttf') format('truetype'), url('http://assets.diandong.com/mobile/live/build/font/iconfont.svg#iconfont') format('svg');\n}\n\n.liveicon {\n    font-family: \"liveicon\" !important;\n    font-size: 16px;\n    font-style: normal;\n    -webkit-font-smoothing: antialiased;\n    -webkit-text-stroke-width: 0.2px;\n    -moz-osx-font-smoothing: grayscale;\n}\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".live-title {\n    line-height: 1rem;\n    padding: 0 0.5rem;\n    font-size: 0.8rem;\n    margin: 0.7rem 0;\n}\n\n.live-detail {\n    width: 15rem;\n    margin: 0 auto;\n    background-color: #eee;\n    border-radius: 3px;\n    padding: 0.2rem 0.5rem;\n}\n\n.live-detail-button {\n    display: block;\n    height: 1.2rem;\n    line-height: 1.2rem;\n    color: #6c7275;\n    font-size: 0.6rem;\n    width: 3.5rem;\n}\n\n.live-detail-button i {\n    font-size: 0.6rem;\n    padding: 0 0.1rem;\n}\n\n.live-detail-participant {\n    height: 1.2rem;\n    overflow: hidden;\n}\n\n.participant-number {\n    line-height: 1.2rem;\n    text-align: right;\n    font-size: 0.6rem;\n    color: #8f8f8f;\n}\n\n.participant-number span {\n    color: #df2228;\n}\n\n.participant-avatar {\n    height: 1.2rem;\n    padding-left: 0.4rem;\n}\n\n.participant-avatar img {\n    width: 1rem;\n    height: 1rem;\n    border-radius: 50%;\n}\n\n.avatar-item {\n    float: right;\n    width: 1.2rem;\n    height: 1.2rem;\n    border-radius: 50%;\n    background-color: white;\n    padding: 0.1rem;\n    margin-left: -0.4rem;\n}\n\n.live-detail-time {\n    line-height: 1rem;\n    font-size: 0.45rem;\n    color: #a0a0a0;\n}\n\n.live-detail-text {\n    margin-top: 0.4rem;\n    padding-bottom: 0.2rem;\n}\n\n.live-detail-text p {\n    line-height: 0.75rem;\n    font-size: 0.5rem;\n    color: #373737;\n}\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".live-like {\n    position: fixed;\n    width: 2.8rem;\n    height: 2.8rem;\n    text-align: center;\n    line-height: 2.8rem;\n    color: white;\n    background-color: #eee;\n    right: 0.5rem;\n    bottom: 1rem;\n    border-radius: 50%;\n    line-height: 2.4rem;\n}\n\n.live-like.on {\n    background-color: #3595e7;\n}\n\n.live-like i {\n    font-size: 2.4rem;\n}\n\n.live-like span {\n    position: absolute;\n    height: 0.8rem;\n    line-height: 0.8rem;\n    color: white;\n    background-color: #e30a20;\n    border-radius: 0.4rem;\n    top: -0.1rem;\n    right: 0;\n    font-size: 0.45rem;\n    min-width: 0.8rem;\n    padding: 0 0.1rem;\n}\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".live-tab {\n    margin-top: 1rem;\n}\n\n.live-tab-button {\n    padding: 0 0.5rem;\n    font-size: 0;\n    text-align: center;\n}\n\n.live-tab-button a {\n    display: inline-block;\n    width: 7.5rem;\n    height: 1.6rem;\n    box-sizing: content-box;\n    border-bottom: 1px solid #e8e8e8;\n    line-height: 1.6rem;\n    font-size: 0.65rem;\n    color: #9fa6aa;\n}\n\n.live-tab-button i {\n    font-size: 0.65rem;\n}\n\n.live-tab-button a.current {\n    color: #3595e7;\n    border-bottom-color: #3595e7;\n}\n\n.live-stream {\n    width: 15rem;\n    margin: 0 auto;\n    border-left: 2px solid #dbdbdb;\n    padding-left: 0.5rem;\n    margin-top: 1.6rem;\n}\n\n.stream-date {\n    margin-bottom: 1.6rem;\n}\n\n.stream-date header {\n    height: 0.9rem;\n    line-height: 0.9rem;\n}\n\n.stream-date header h5 {\n    float: left;\n    padding: 0 0.3rem;\n    background-color: #eee;\n    font-size: 0.5rem;\n    color: #6c7275;\n}\n\n.stream-item-time {\n    line-height: 1.2rem;\n    font-size: 0.6rem;\n    font-weight: bold;\n    color: #3595e7;\n}\n\n.stream-item-publisher {\n    height: 1.2rem;\n    line-height: 1.2rem;\n    font-size: 0.5rem;\n    color: #939698;\n}\n\n.stream-item-publisher img {\n    width: 1.2rem;\n    height: 1.2rem;\n    border-radius: 50%;\n    border: 3px solid #e7e7e7;\n    display: inline-block;\n    vertical-align: top;\n}\n\n.stream-item-publisher i {\n    color: #3595e7;\n    font-style: normal;\n}\n\n.stream-item-text {\n    line-height: 0.9rem;\n    font-size: 0.6rem;\n    margin-top: 0.1rem;\n}\n\n.stream-item-photo {\n    margin-top: 0.4rem;\n    overflow: hidden;\n    width: 14.5rem;\n}\n\n.stream-item-photo img {\n    margin: 0 0.5rem 0.5rem 0;\n}\n\n.photo-type-1 {\n    width: 15rem;\n}\n\n.photo-type-1 img {\n    width: 14.5rem;\n}\n\n.stream-item-location {\n    line-height: 0.8rem;\n    color: #bababa;\n    font-size: 0.55rem;\n}\n\n.stream-item-location i {\n    font-size: 0.6rem;\n}\n\n.stream-item {\n    margin-bottom: 0.7rem;\n    position: relative;\n}\n\n.stream-item::before {\n    content: \"\";\n    position: absolute;\n    width: 0.3rem;\n    height: 0.3rem;\n    border-radius: 50%;\n    border: 0.1rem solid #3595e7;\n    background-color: white;\n    left: -0.77rem;\n    top: 0.35rem;\n}\n\n.photo-type-2 {\n    width: 15rem;\n}\n\n.photo-type-2 img {\n    float: left;\n    width: 7rem;\n    height: 5.25rem;\n    margin-right: 0.5rem;\n}\n\n.photo-type-3 {\n    width: 15rem;\n}\n\n.photo-type-3 img {\n    float: left;\n    width: 4.5rem;\n    height: 3.375rem;\n    margin: 0 0.5rem 0.5rem 0;\n}\n\n.stream-item-top {\n    width: 2rem;\n    height: 1.7rem;\n    background-image: url(http://i1.dd-img.com/assets/image/1494581560-1ef727ab4e347e8e-80w-68h.png);\n    background-size: cover;\n    background-repeat: no-repeat;\n    position: absolute;\n    top: 1.2rem;\n    right: 0;\n}\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".update-button {\n    height: 1.5rem;\n    line-height: 1.5rem;\n    border: 1px solid #e6e6e6;\n    font-size: 0.55rem;\n    color: #df2228;\n    border-top-left-radius: 0.75rem;\n    border-bottom-left-radius: 0.75rem;\n    padding: 0 0.4rem 0 0.5rem;\n    background-color: rgba(240, 240, 240, 0.9);\n    position: fixed;\n    bottom: 6rem;\n    right: 0;\n    border-right-width: 0;\n}\n\n.update-button i {\n    font-size: 0.6rem;\n}\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./update.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./update.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);