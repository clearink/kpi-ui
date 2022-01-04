"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
function getStyleLoader(options) {
    var module = options.module, sass = options.sass, useTailwind = options.useTailwind, mode = options.mode;
    var isDev = mode === 'development';
    var isProd = mode === 'production';
    return [
        // dev 环境需要 prod 环境下 直接抽离成 css file
        isDev && require.resolve('style-loader'),
        isProd && require.resolve(mini_css_extract_plugin_1.default.loader),
        {
            loader: require.resolve('css-loader'),
            options: {
                modules: module,
                importLoaders: sass ? 3 : 2, // 前面还有多少个 loader 需要执行
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    plugins: [
                        useTailwind && require.resolve('tailwindcss'),
                        require.resolve('postcss-preset-env'),
                        !useTailwind && require.resolve('postcss-normalize'),
                    ].filter(Boolean),
                },
            },
        },
        sass && require.resolve('sass-loader'),
        require.resolve('thread-loader'),
    ].filter(Boolean);
}
exports.default = getStyleLoader;
