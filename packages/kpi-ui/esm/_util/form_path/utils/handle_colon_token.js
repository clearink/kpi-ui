import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { isPlainObject } from '../../validate_type';
import { fixLastAndValidateToken } from './_helps';
import { Colon } from './_token';

function handleColonToken(matrix, type) {
  var result = [];

  for (var _i = 0, _Object$entries = Object.entries(matrix); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        index = _Object$entries$_i[0],
        tokens = _Object$entries$_i[1];

    var item = [];

    var _iterator = _createForOfIteratorHelper(tokens),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        if (token === Colon || !item.length) item.push([]);
        if (!isPlainObject(token)) continue; // 每一层仅允许有一个 ':' 数组时仅允许一个

        var maxLength = type === 'array' ? 1 : 2;
        if (item.length > maxLength) throw new Error("'".concat(Colon, "' \u4F4D\u7F6E\u9519\u8BEF"));
        var last = item[item.length - 1];

        if ('attrs' in token && token.attrs.length) {
          var attrs = handleColonToken(token.attrs, token.type);
          last.push(_objectSpread(_objectSpread({}, token), {}, {
            attrs: attrs
          }));
        } else if ('attr' in token) last.push(token);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (item.length === 0) item.push([], []);else if (item.length === 1) item.push(item[0].slice());
    if (type === 'array') item[0] = [index]; // 修正最后一项

    var left = fixLastAndValidateToken(item[0]);
    var right = fixLastAndValidateToken(item[1]);
    result.push({
      left: left,
      right: right
    });
  }

  return result;
}

export default handleColonToken;