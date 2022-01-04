"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = compile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = require("fs-extra");

var _path = require("path");

var _constant = require("../shared/constant");

var _logger = _interopRequireDefault(require("../shared/logger"));

// compiler kpi-ui
function compile(_x) {
  return _compile.apply(this, arguments);
} // entry 然后不断的编译 ?


function _compile() {
  _compile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var mode;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mode = _ref.mode;
            process.env.NODE_ENV = 'production';
            console.log('compile', mode);
            _context.t0 = mode;
            _context.next = _context.t0 === 'cjs' ? 6 : _context.t0 === 'umd' ? 7 : _context.t0 === 'esm' ? 8 : 9;
            break;

          case 6:
            return _context.abrupt("return", compileCjs());

          case 7:
            return _context.abrupt("return", compileUmd());

          case 8:
            return _context.abrupt("return", compileEsm());

          case 9:
            _logger["default"].error("compile mode must be one of ['cjs', 'umd', 'esm']");

            return _context.abrupt("return");

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _compile.apply(this, arguments);
}

function compileCjs() {
  (0, _fsExtra.readdir)(_constant.DEV_CONST.SRC_DIR, function (err, files) {
    if (err) return _logger["default"].error(err.message);
    files.map(function (name) {
      return (0, _path.resolve)(_constant.DEV_CONST.SRC_DIR, name);
    }).forEach(function (path) {
      if ((0, _fsExtra.statSync)(path).isFile()) return;
      console.log(path);
    });
  });
}

function compileUmd() {}

function compileEsm() {}