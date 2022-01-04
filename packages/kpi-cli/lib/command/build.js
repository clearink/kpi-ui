"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = build;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpack2 = _interopRequireDefault(require("../config/webpack.prod"));

var _logger = _interopRequireDefault(require("../shared/logger"));

// build site
function build() {
  return _build.apply(this, arguments);
}

function _build() {
  _build = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var compiler;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            process.env.NODE_ENV = 'production';
            compiler = (0, _webpack["default"])((0, _webpack2["default"])(), function (err, stats) {
              if (err || stats !== null && stats !== void 0 && stats.hasErrors()) {
                var _err$message;

                _logger["default"].error((_err$message = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message !== void 0 ? _err$message : stats === null || stats === void 0 ? void 0 : stats.toString());
              }
            }); // console.log(dev(options))
            // compiler.watch({}, (a: any) => {
            //   console.log(a)
            // })

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _build.apply(this, arguments);
}