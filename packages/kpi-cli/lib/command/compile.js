"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = compile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _compile2 = _interopRequireDefault(require("../compiler/compile.lib"));

var _logger = _interopRequireDefault(require("../shared/logger"));

// compiler kpi-ui
function compile(_x) {
  return _compile.apply(this, arguments);
}

function _compile() {
  _compile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var mode, entry, output;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            process.env.NODE_ENV = 'production';
            mode = options.mode, entry = options.entry, output = options.output;
            _context.t0 = mode;
            _context.next = _context.t0 === 'cjs' ? 5 : _context.t0 === 'umd' ? 6 : 7;
            break;

          case 5:
            return _context.abrupt("return", (0, _compile2["default"])(options));

          case 6:
            return _context.abrupt("return", compileUmd());

          case 7:
            _logger["default"].error("compile mode must be one of ['cjs', 'umd', 'esm']");

            return _context.abrupt("return");

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _compile.apply(this, arguments);
}

function compileUmd() {}