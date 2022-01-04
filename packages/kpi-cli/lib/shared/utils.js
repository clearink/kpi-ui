"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelCase = camelCase;
exports.getEnvConstant = getEnvConstant;
exports.getStyleLoader = getStyleLoader;
exports.outputFileOnChangeSync = outputFileOnChangeSync;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _fs = require("fs");

var _fsExtra = require("fs-extra");

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function outputFileOnChangeSync(path, code) {
  (0, _fsExtra.ensureFileSync)(path);
  var content = (0, _fs.readFileSync)(path, 'utf-8');
  if (code !== content) (0, _fsExtra.outputFileSync)(path, code);
}

var upperCase = function upperCase(str) {
  return str.toUpperCase();
};

function camelCase(name) {
  var pascal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var normalized = name.replace(/(?<=[-_\s])(\w)/g, upperCase)
  /* 转换成大写 */
  .replace(/[-_\s]/g, '');
  /* 去除额外的符号 */

  return pascal ? normalized.replace(/^\w/g, upperCase) : normalized;
} // 获取环境变量


function getEnvConstant() {
  var env = {
    REACT_APP_SITE_NAME: 'KPI_UI_SITE'
  };
  return {
    env: env,
    str: Object.entries(env).reduce(function (result, _ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return _objectSpread(_objectSpread({}, result), {}, (0, _defineProperty2["default"])({}, key, JSON.stringify(value)));
    }, {})
  };
}

function getStyleLoader(options) {
  var module = options.module,
      sass = options.sass,
      useTailwind = options.useTailwind,
      mode = options.mode;
  var isDev = mode === 'development';
  var isProd = mode === 'production';
  return [// dev 环境需要 prod 环境下 直接抽离成 css file
  isDev && require.resolve('style-loader'), isProd && require.resolve(_miniCssExtractPlugin["default"].loader), {
    loader: require.resolve('css-loader'),
    options: {
      modules: module,
      importLoaders: sass ? 3 : 2 // 前面还有多少个 loader 需要执行

    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [useTailwind && require.resolve('tailwindcss'), require.resolve('postcss-preset-env'), !useTailwind && require.resolve('postcss-normalize')].filter(Boolean)
      }
    }
  }, sass && require.resolve('sass-loader'), require.resolve('thread-loader')].filter(Boolean);
}