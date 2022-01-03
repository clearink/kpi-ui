"use strict";
var webpack = require("webpack");
var ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var merge = require("webpack-merge").merge;
var outputPath = require("./path.config").outputPath;
var common = require("./webpack.common");
var DemoPlugin = require("../plugins/demo_plugin");
// 开发环境
module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        path: outputPath,
        clean: true, // 清除目录
    },
    plugins: [
        // 提取 CSS
        new MiniCssExtractPlugin({
            filename: "[hash].[name].css",
        }),
        new ReactRefreshWebpackPlugin(),
        new DemoPlugin(1, 2, 3),
    ],
    // 开启 source map
    devtool: "eval-cheap-module-source-map",
    devServer: {
        port: 4001,
        hot: true,
        static: {
            directory: outputPath,
        },
    },
});
