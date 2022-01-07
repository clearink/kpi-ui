"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = dev;

var _webpackMerge = require("webpack-merge");

var _webpack = _interopRequireDefault(require("./webpack.common"));

var _constant = require("../../shared/constant");

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _reactRefreshWebpackPlugin = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

// TODO: 使用 dotenv 获取自定义变量
// 开发环境
function dev() {
  return (0, _webpackMerge.merge)((0, _webpack["default"])('development'), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      filename: 'js/bundle.js',
      chunkFilename: 'js/[name].chunk.js'
    },
    // TODO: 待完善
    stats: 'errors-only',
    optimization: {
      minimize: false
    },
    plugins: [// 生成html，自动引入所有bundle
    new _htmlWebpackPlugin["default"]({
      inject: true,
      template: _constant.DEV_CONST.PUBLIC_HTML_FILE
    }), new _reactRefreshWebpackPlugin["default"]({
      exclude: [/node_modules/],
      overlay: false
    })],
    devServer: {
      "static": {
        directory: _constant.DEV_CONST.PUBLIC_DIR,
        publicPath: [_constant.DEV_CONST.PUBLIC_PATH]
      },
      hot: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    }
  });
}