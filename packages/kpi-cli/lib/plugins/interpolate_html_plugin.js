"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

var InterpolateHtmlPlugin = /*#__PURE__*/function () {
  function InterpolateHtmlPlugin(replacements) {
    (0, _classCallCheck2["default"])(this, InterpolateHtmlPlugin);
    this.replacements = replacements;
  }

  (0, _createClass2["default"])(InterpolateHtmlPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.compilation.tap('InterpolateHtmlPlugin', function (compilation) {
        _htmlWebpackPlugin["default"].getHooks(compilation).afterTemplateExecution.tap('InterpolateHtmlPlugin', function (data) {
          Object.entries(_this.replacements).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            data.html = data.html.replace(new RegExp("%".concat(escapeStringRegexp(key), "%"), 'g'), value);
          });
          return data;
        });
      });
    }
  }]);
  return InterpolateHtmlPlugin;
}();

exports["default"] = InterpolateHtmlPlugin;