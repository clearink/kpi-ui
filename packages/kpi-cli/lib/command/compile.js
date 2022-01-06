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

var _core = require("@babel/core");

var _constant = require("../shared/constant");

var _logger = _interopRequireDefault(require("../shared/logger"));

// compiler kpi-ui
function compile(_x) {
  return _compile.apply(this, arguments);
} // entry 然后不断的编译 ?


function _compile() {
  _compile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
    var mode;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mode = _ref.mode;
            process.env.NODE_ENV = 'production';
            console.log('compile', mode);
            _context2.t0 = mode;
            _context2.next = _context2.t0 === 'cjs' ? 6 : _context2.t0 === 'umd' ? 7 : _context2.t0 === 'esm' ? 8 : 9;
            break;

          case 6:
            return _context2.abrupt("return", compileCjs());

          case 7:
            return _context2.abrupt("return", compileUmd());

          case 8:
            return _context2.abrupt("return", compileEsm());

          case 9:
            _logger["default"].error("compile mode must be one of ['cjs', 'umd', 'esm']");

            return _context2.abrupt("return");

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _compile.apply(this, arguments);
}

function compileCjs() {
  (0, _fsExtra.readdir)(_constant.DEV_CONST.SRC_DIR, function (err, files) {
    if (err) return _logger["default"].error(err.message);
    files.forEach( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
        var filePath, path, source, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                filePath = (0, _path.resolve)(_constant.DEV_CONST.SRC_DIR, file);

                if (!(0, _fsExtra.statSync)(filePath).isFile()) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                path = (0, _path.resolve)(filePath, 'index.tsx');
                source = (0, _fsExtra.readFileSync)(path, 'utf-8');
                _context.next = 7;
                return (0, _core.transformAsync)(source, {
                  filename: 'index.tsx',
                  presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
                  plugins: [[require.resolve('@babel/plugin-transform-runtime'), {
                    regenerator: true
                  }], require.resolve('@babel/plugin-proposal-class-properties')]
                });

              case 7:
                result = _context.sent;
                console.log(result === null || result === void 0 ? void 0 : result.code);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
}

function compileUmd() {}

function compileEsm() {}