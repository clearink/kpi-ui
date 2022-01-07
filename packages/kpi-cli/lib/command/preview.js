"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = preview;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpack2 = _interopRequireDefault(require("../config/webpack/webpack.dev"));

var _logger = _interopRequireDefault(require("../shared/logger"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// preview site
function preview(_x) {
  return _preview.apply(this, arguments);
}

function _preview() {
  _preview = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var config, compiler, server, close;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            process.env.NODE_ENV = 'development';
            config = (0, _webpack2["default"])();
            compiler = null;

            try {
              compiler = (0, _webpack["default"])(config);
            } catch (error) {
              _logger["default"].error(error === null || error === void 0 ? void 0 : error.message);

              process.exit(1);
            }

            compiler.hooks.invalid.tap('invalid', function () {
              console.clear();
            });
            server = new _webpackDevServer["default"](_objectSpread(_objectSpread({}, config.devServer), options), compiler);
            _context.prev = 6;
            _context.next = 9;
            return server.start();

          case 9:
            _logger["default"].success("Successfully started server on http://localhost:".concat(options.port));

            close = function close() {
              server.close();
              process.exit();
            };

            ['SIGINT', 'SIGTERM'].forEach(function (sig) {
              process.on(sig, close);
            });

            if (process.env.CI !== 'true') {
              // Gracefully exit when stdin ends
              process.stdin.on('end', close);
            }

            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](6);
            console.log(_context.t0);
            process.exit(1);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 15]]);
  }));
  return _preview.apply(this, arguments);
}