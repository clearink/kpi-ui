"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = require("webpack-merge");
var webpack_common_1 = __importDefault(require("./webpack.common"));
var constant_1 = require("../shared/constant");
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
// 生产环境
function prod() {
    return (0, webpack_merge_1.merge)((0, webpack_common_1.default)('production'), {
        mode: 'production',
        bail: true,
        // TODO: 在 分析模式下打开
        performance: false,
        output: {
            clean: true,
            pathinfo: false,
            filename: 'js/[name].[contenthash:8].js',
            chunkFilename: 'js/[name].[contenthash:8].chunk.js',
        },
        optimization: {
            minimize: true,
            runtimeChunk: true,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    parallel: 4,
                    terserOptions: {
                        parse: { ecma: 2017 },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        format: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
                new css_minimizer_webpack_plugin_1.default({
                    parallel: 4,
                }),
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        priority: -10,
                    },
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        plugins: [
            new html_webpack_plugin_1.default({
                inject: true,
                template: constant_1.DEV_CONST.PUBLIC_HTML_FILE,
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
                    minifyURLs: true,
                },
            }),
            new mini_css_extract_plugin_1.default({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),
        ],
    });
}
exports.default = prod;
