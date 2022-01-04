"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = prod;

var _webpackMerge = require("webpack-merge");

var _webpack = _interopRequireDefault(require("./webpack.common"));

var _constant = require("../shared/constant");

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _cssMinimizerWebpackPlugin = _interopRequireDefault(require("css-minimizer-webpack-plugin"));

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

// 生产环境
function prod() {
  return (0, _webpackMerge.merge)((0, _webpack["default"])('production'), {
    mode: 'production',
    bail: true,
    // TODO: 在 分析模式下打开
    performance: false,
    // 关闭性能提示
    output: {
      clean: true,
      // 清除 output 目录
      pathinfo: false,
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js'
    },
    optimization: {
      minimize: true,
      runtimeChunk: true,
      minimizer: [new _terserWebpackPlugin["default"]({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 2017
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          format: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      }), new _cssMinimizerWebpackPlugin["default"]({
        parallel: 4
      })],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: -10
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [new _htmlWebpackPlugin["default"]({
      inject: true,
      template: _constant.DEV_CONST.PUBLIC_HTML_FILE,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }), new _miniCssExtractPlugin["default"]({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    })]
  });
}