import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x2) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { BREAKPOINT } from '../../../_shared/constant';
// 初始状态
export var initMatches = Object.keys(BREAKPOINT).reduce(function (res, cur) {
  return _objectSpread(_objectSpread({}, res), {}, _defineProperty({}, cur, false));
}, {});

var MediaObserver = /*#__PURE__*/function () {
  // 记录所有的 QueryList 对象
  // 方便找到相应的速记值
  // 内部扩展的触发函数
  // 当前匹配值
  function MediaObserver(handler) {
    _classCallCheck(this, MediaObserver);

    _defineProperty(this, "listeners", []);

    _defineProperty(this, "breakpointMap", new Map());

    _defineProperty(this, "queryHandler", void 0);

    _defineProperty(this, "currentMatches", _objectSpread({}, initMatches));

    this.queryHandler = this.extendHandler(handler);

    for (var _i = 0, _Object$entries = Object.entries(BREAKPOINT); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          breakpoint = _Object$entries$_i[0],
          _Object$entries$_i$ = _Object$entries$_i[1],
          size = _Object$entries$_i$.size,
          mode = _Object$entries$_i$.mode;

      var query = "(".concat(mode, "-width: ").concat(size, "px)");
      this.breakpointMap.set(query, breakpoint);
      var queryList = window.matchMedia(query);
      queryList.addEventListener('change', this.queryHandler);
      this.currentMatches[breakpoint] = queryList.matches;
      this.listeners.push(queryList);
    }

    handler(_objectSpread({}, this.currentMatches)); // 触发更新
  } // 扩展事件函数


  _createClass(MediaObserver, [{
    key: "extendHandler",
    value: function extendHandler(handler) {
      var _this = this;

      // 闭包 只在 currentMatches 变化时调用 handler 函数
      return function (e) {
        console.log(e);

        var breakpoint = _this.breakpointMap.get(e.media);

        if (breakpoint && _this.currentMatches[breakpoint] !== e.matches) {
          _this.currentMatches[breakpoint] = e.matches; // 更新值

          handler(_objectSpread({}, _this.currentMatches)); // 改变引用
        }
      };
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      var _iterator = _createForOfIteratorHelper(this.listeners),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var listener = _step.value;
          listener.removeEventListener('change', this.queryHandler);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.listeners = [];
    }
  }]);

  return MediaObserver;
}();
/**
 *   const queryList = window.matchMedia(responsiveMap.md)
    const handler = (e: MediaQueryListEvent) => console.log(e.matches)
    queryList.addEventListener('change', handler)
    console.log(queryList.matches)
    return () => queryList.removeEventListener('change', handler)
 */


export { MediaObserver as default };