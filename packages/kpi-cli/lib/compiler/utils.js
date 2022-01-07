"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileDir = compileDir;
exports.compileFile = compileFile;

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

// 编译文件夹
function compileDir(_x) {
  return _compileDir.apply(this, arguments);
} // 编译文件


function _compileDir() {
  _compileDir = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dirPath) {
    var dirs, _iterator, _step, dir;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _fsExtra.readdir)(dirPath);

          case 2:
            dirs = _context.sent;
            _iterator = _createForOfIteratorHelper(dirs);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                dir = _step.value;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _compileDir.apply(this, arguments);
}

function compileFile() {
  return _compileFile.apply(this, arguments);
}

function _compileFile() {
  _compileFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _options, mode, entry, output, babelOptions, dirPath, dirs, _iterator2, _step2, dir, filePath, fileStat, entryFile, source, result, outputPath;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _options = options, mode = _options.mode, entry = _options.entry, output = _options.output;
            babelOptions = (0, _babel["default"])(mode);
            dirPath = (0, _path.resolve)(_constant.DEV_CONST.APP_DIR, entry);
            _context2.next = 5;
            return (0, _fsExtra.readdir)(dirPath);

          case 5:
            dirs = _context2.sent;
            _iterator2 = _createForOfIteratorHelper(dirs);
            _context2.prev = 7;

            _iterator2.s();

          case 9:
            if ((_step2 = _iterator2.n()).done) {
              _context2.next = 31;
              break;
            }

            dir = _step2.value;
            filePath = (0, _path.resolve)(dirPath, dir);
            fileStat = (0, _fsExtra.statSync)(filePath);

            if (!fileStat.isFile()) {
              _context2.next = 16;
              break;
            }

            _context2.next = 29;
            break;

          case 16:
            if (!fileStat.isDirectory()) {
              _context2.next = 29;
              break;
            }

            // compileDir();
            entryFile = (0, _path.resolve)(filePath, 'index.tsx');
            _context2.next = 20;
            return (0, _fsExtra.readFileSync)(entryFile, 'utf-8');

          case 20:
            source = _context2.sent;
            _context2.next = 23;
            return (0, _core.transformAsync)(source, _objectSpread({
              ast: false,
              filename: entryFile
            }, (0, _babel["default"])(mode)));

          case 23:
            result = _context2.sent;
            outputPath = (0, _path.resolve)(_constant.DEV_CONST.APP_DIR, output, dir, 'index.js');
            _context2.next = 27;
            return (0, _fsExtra.ensureFile)(outputPath);

          case 27:
            _context2.next = 29;
            return (0, _fsExtra.writeFile)(outputPath, result === null || result === void 0 ? void 0 : result.code, {
              encoding: 'utf-8'
            });

          case 29:
            _context2.next = 9;
            break;

          case 31:
            _context2.next = 36;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t0 = _context2["catch"](7);

            _iterator2.e(_context2.t0);

          case 36:
            _context2.prev = 36;

            _iterator2.f();

            return _context2.finish(36);

          case 39:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 33, 36, 39]]);
  }));
  return _compileFile.apply(this, arguments);
}