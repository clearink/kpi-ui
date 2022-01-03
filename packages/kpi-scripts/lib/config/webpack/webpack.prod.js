"use strict";
var SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
var glob = require("glob");
var PurgeCSSPlugin = require("purgecss-webpack-plugin");
var merge = require("webpack-merge").merge;
var ESBuildMinifyPlugin = require("esbuild-loader").ESBuildMinifyPlugin;
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
var _a = require("./path.config"), outputPath = _a.outputPath, appPath = _a.appPath;
var common = require("./webpack.common");
// 生成环境
module.exports = new SpeedMeasurePlugin().wrap(merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash:8].bundle.js",
        path: outputPath,
        clean: true, // 清除目录
    },
    plugins: [
        // 打包体积分析
        // new BundleAnalyzerPlugin({
        //   analyzerMode: "static", // html 文件方式输出编译分析
        // }),
        // 提取css
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new PurgeCSSPlugin({
            paths: glob.sync("".concat(appPath, "/**/*"), { nodir: true }),
        }),
    ],
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    // name: "chunk-vendors",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    priority: -10,
                    enforce: true,
                },
                common: {
                    // name: "chunk-common",
                    minChunks: 2,
                    priority: -20,
                    chunks: "initial",
                    reuseExistingChunk: true,
                },
            },
        },
        moduleIds: "deterministic",
        minimizer: [
            new ESBuildMinifyPlugin({
                target: "es5",
                css: true,
            }),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
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
            new CssMinimizerPlugin({
                parallel: true,
            }),
        ],
    },
}));
