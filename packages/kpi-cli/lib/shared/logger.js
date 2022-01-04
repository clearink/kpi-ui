"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.colors = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var colors = {
  info: '#3498db',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c'
};
exports.colors = colors;
var _default = {
  info: function info(text) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var str = _chalk["default"].hex(colors.info)(text);

    if (!log) return str;
    console.log(str);
  },
  success: function success(text) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var str = _chalk["default"].hex(colors.success)(text);

    if (!log) return str;
    console.log(str);
  },
  warning: function warning(text) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var str = _chalk["default"].hex(colors.warning)(text);

    if (!log) return str;
    console.log(str);
  },
  error: function error(text) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var str = _chalk["default"].hex(colors.error)(text);

    if (!log) return str;
    console.log(str);
  }
}; // 日志工具

exports["default"] = _default;