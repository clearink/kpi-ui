"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = require("webpack-merge");
var webpack_common_1 = __importDefault(require("./webpack.common"));
var constant_1 = require("../shared/constant");
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
// TODO: 使用 dotenv 获取自定义变量
// 开发环境
function dev() {
    return (0, webpack_merge_1.merge)((0, webpack_common_1.default)('development'), {
        mode: 'development',
        devtool: 'cheap-module-source-map',
        output: {
            filename: 'js/bundle.js',
            chunkFilename: 'js/[name].chunk.js',
        },
        // TODO: 待完善
        stats: 'errors-only',
        optimization: {
            minimize: false,
        },
        plugins: [
            // 生成html，自动引入所有bundle
            new html_webpack_plugin_1.default({
                inject: true,
                template: constant_1.DEV_CONST.PUBLIC_HTML_FILE,
            }),
            new react_refresh_webpack_plugin_1.default({
                exclude: [/node_modules/],
                overlay: false,
            }),
        ],
        devServer: {
            static: {
                directory: constant_1.DEV_CONST.PUBLIC_DIR,
                publicPath: [constant_1.DEV_CONST.PUBLIC_PATH],
            },
            hot: true,
            compress: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
        },
    });
}
exports.default = dev;
