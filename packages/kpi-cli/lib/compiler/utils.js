"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileDir = compileDir;
exports.compileScript = compileScript;
exports.compileStyle = compileStyle;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _core = require("@babel/core");

var _fsExtra = require("fs-extra");

var _path = require("path");

var _babel = _interopRequireDefault(require("../config/babel.config"));

var _constant = require("../shared/constant");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var APP_DIR = _constant.KPI_CONST.APP_DIR,
    STYLE_EXTENSIONS = _constant.KPI_CONST.STYLE_EXTENSIONS,
    RESOLVE_EXTENSIONS = _constant.KPI_CONST.RESOLVE_EXTENSIONS;
var DOCS_DIR_NAME = _constant.GEN_CONST.DOCS_DIR_NAME,
    TEST_DIR_NAME = _constant.GEN_CONST.TEST_DIR_NAME,
    PROPS_FILE_NAME = _constant.GEN_CONST.PROPS_FILE_NAME; // 编译文件夹

function compileDir(_x, _x2, _x3) {
  return _compileDir.apply(this, arguments);
} // 编译文件


function _compileDir() {
  _compileDir = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(entryDir, outDir, options) {
    var dirs, _iterator, _step, name, filePath, fileStat, extension, outputPath;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _fsExtra.readdir)(entryDir);

          case 2:
            dirs = _context.sent;
            _iterator = _createForOfIteratorHelper(dirs);
            _context.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 16;
              break;
            }

            name = _step.value;
            filePath = (0, _path.resolve)(entryDir, name);
            _context.next = 11;
            return (0, _fsExtra.stat)(filePath);

          case 11:
            fileStat = _context.sent;
            extension = (0, _path.extname)(filePath);

            if (fileStat.isDirectory() && ![DOCS_DIR_NAME, TEST_DIR_NAME].includes(name)) {
              compileDir(filePath, (0, _path.resolve)(outDir, name), options);
            } else if (STYLE_EXTENSIONS.includes(extension)) {
              compileStyle(filePath, options);
            } else if (RESOLVE_EXTENSIONS.includes(extension) && name !== PROPS_FILE_NAME) {
              outputPath = (0, _path.resolve)(outDir, name.replace(/\.tsx?$/g, '.js'));
              compileScript(filePath, outputPath, options);
            }

          case 14:
            _context.next = 6;
            break;

          case 16:
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](4);

            _iterator.e(_context.t0);

          case 21:
            _context.prev = 21;

            _iterator.f();

            return _context.finish(21);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 18, 21, 24]]);
  }));
  return _compileDir.apply(this, arguments);
}

function compileScript(_x4, _x5, _x6) {
  return _compileScript.apply(this, arguments);
} // 编译样式文件


function _compileScript() {
  _compileScript = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(filePath, outputPath, options) {
    var mode, entry, output, source, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mode = options.mode, entry = options.entry, output = options.output;
            _context2.next = 3;
            return (0, _fsExtra.readFileSync)(filePath, 'utf-8');

          case 3:
            source = _context2.sent;
            _context2.next = 6;
            return (0, _core.transformAsync)(source, _objectSpread({
              ast: false,
              filename: filePath
            }, (0, _babel["default"])(mode)));

          case 6:
            result = _context2.sent;
            _context2.next = 9;
            return (0, _fsExtra.ensureFile)(outputPath);

          case 9:
            _context2.next = 11;
            return (0, _fsExtra.writeFile)(outputPath, result === null || result === void 0 ? void 0 : result.code, {
              encoding: 'utf-8'
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _compileScript.apply(this, arguments);
}

function compileStyle(_x7, _x8) {
  return _compileStyle.apply(this, arguments);
}

function _compileStyle() {
  _compileStyle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(filePath, options) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _compileStyle.apply(this, arguments);
}