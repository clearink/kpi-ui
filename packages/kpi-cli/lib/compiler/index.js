"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = compileFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = require("fs-extra");

var _path = require("path");

var _constant = require("../shared/constant");

var _logger = _interopRequireDefault(require("../shared/logger"));

var _utils = require("./utils");

// 编译成 cjs/esm
function compileFile(_x) {
  return _compileFile.apply(this, arguments);
}

function _compileFile() {
  _compileFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var entry, output, entryDir, fileStat, outDir;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            entry = options.entry, output = options.output;
            entryDir = (0, _path.resolve)(_constant.KPI_CONST.APP_DIR, entry);
            _context.next = 4;
            return (0, _fsExtra.stat)(entryDir);

          case 4:
            fileStat = _context.sent;

            if (fileStat.isDirectory()) {
              // 删除 output
              outDir = (0, _path.resolve)(_constant.KPI_CONST.APP_DIR, output);
              (0, _fsExtra.removeSync)(outDir);
              (0, _utils.compileDir)(entryDir, outDir, options);
            } else {
              _logger["default"].error('entry must a directory');

              process.exit(1);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _compileFile.apply(this, arguments);
}