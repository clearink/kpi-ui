"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../../shared/constant");
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var webpackbar_1 = __importDefault(require("webpackbar"));
exports.default = {
    resolve: {
        extensions: constant_1.DEV_CONST.RESOLVE_EXTENSIONS,
        alias: {
            '@': constant_1.DEV_CONST.SRC_DIR,
        },
    },
    cache: {
        type: 'filesystem', // 使用文件缓存
    },
    entry: constant_1.DEV_CONST.ENTRY_FILE,
    module: {
        rules: [
            {
                // webpack 5 新增 loader 专门处理静态资源
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: constant_1.DEV_CONST.SRC_DIR,
                type: 'asset/resource',
            },
            {
                // 解析字体
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: constant_1.DEV_CONST.SRC_DIR,
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                include: constant_1.DEV_CONST.SRC_DIR,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['postcss-preset-env']],
                            },
                        },
                    },
                    {
                        loader: 'thread-loader',
                        options: {
                            workerParallelJobs: 2,
                        },
                    },
                ],
            },
            {
                // 解析 css 文件
                test: /\.(scss|sass)$/,
                include: constant_1.DEV_CONST.SRC_DIR,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['postcss-preset-env']],
                            },
                        },
                    },
                    {
                        loader: 'thread-loader',
                        options: {
                            workerParallelJobs: 2,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: constant_1.DEV_CONST.SRC_DIR,
                use: ['babel-loader'],
            },
        ],
    },
    plugins: [
        new webpackbar_1.default({ profile: true }),
        // 生成html，自动引入所有bundle
        new html_webpack_plugin_1.default({
            template: constant_1.DEV_CONST.PUBLIC_HTML_FILE,
        }),
    ],
    output: {
        pathinfo: false,
    },
};
