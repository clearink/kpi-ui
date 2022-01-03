"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../shared/constant");
var webpack_1 = __importDefault(require("webpack"));
var webpackbar_1 = __importDefault(require("webpackbar"));
var get_env_constant_1 = __importDefault(require("../shared/get_env_constant"));
var interpolate_html_plugin_1 = __importDefault(require("../shared/interpolate_html_plugin"));
// TODO: 使用 dotenv 获取自定义变量
var envConstant = (0, get_env_constant_1.default)();
function common(mode) {
    var isDev = mode === 'development';
    var isProd = mode === 'production';
    return {
        target: ['browserslist'],
        entry: constant_1.DEV_CONST.FIND_ENTRY_FILE(),
        output: {
            path: constant_1.DEV_CONST.OUTPUT_PATH,
            assetModuleFilename: 'media/[name].[hash][ext]',
            publicPath: constant_1.DEV_CONST.PUBLIC_PATH,
        },
        cache: {
            type: 'filesystem',
            //待优化
            version: constant_1.DEV_CONST.CACHE_VERSION,
            cacheDirectory: constant_1.DEV_CONST.WEBPACK_CACHE_DIR,
            store: 'pack',
            buildDependencies: {
                defaultWebpack: ['webpack/lib/'],
                config: [__filename],
                tsConfig: constant_1.DEV_CONST.FIND_CACHE_TSCONFIG(),
            },
        },
        infrastructureLogging: {
            level: 'none',
        },
        optimization: {
        // minimizer: [
        //   new TerserPlugin({
        //     terserOptions: {
        //       parse: { ecma: 2017 },
        //       compress: {
        //         ecma: 5,
        //         warnings: false,
        //         comparisons: false,
        //         inline: 2,
        //       },
        //       mangle: {
        //         safari10: true,
        //       },
        //       format: {
        //         ecma: 5,
        //         comments: false,
        //         ascii_only: true,
        //       },
        //     },
        //   }),
        //   new CssMinimizerPlugin(),
        // ],
        },
        resolve: {
            modules: ['node_modules', constant_1.DEV_CONST.NODE_MODULES],
            extensions: constant_1.DEV_CONST.RESOLVE_EXTENSIONS,
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [
                            require.resolve('@babel/preset-env'),
                            require.resolve('@babel/preset-react'),
                            require.resolve('@babel/preset-typescript'),
                        ],
                        plugins: [
                            [
                                require.resolve('@babel/plugin-transform-runtime'),
                                {
                                    regenerator: true,
                                },
                            ],
                            isDev && require.resolve('react-refresh/babel'),
                        ].filter(Boolean),
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: isProd,
                    },
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        // {
                        //   loader: require.resolve('css-loader'),
                        //   options: {
                        //     importLoaders: 1,
                        //   },
                        // },
                        // {
                        //   loader: require.resolve('postcss-loader'),
                        //   options: {
                        //     postcssOptions: {
                        //       ident: 'postcss',
                        //     },
                        //   },
                        // },
                    ],
                },
            ],
        },
        plugins: [
            new webpackbar_1.default({ profile: true }),
            new interpolate_html_plugin_1.default((0, get_env_constant_1.default)().env),
            // new WebpackManifestPlugin({
            //   fileName: 'asset-manifest.json',
            //   publicPath: DEV_CONST.PUBLIC_PATH,
            //   // generate //待优化
            // }),
            new webpack_1.default.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
            // // 单独一个进程检查
            // new ForkTsCheckerWebpackPlugin({
            //   async: isDev,
            // }),
            // // 待优化
            // new ESLintPlugin({
            //   extensions: DEV_CONST.RESOLVE_EXTENSIONS as never,
            //   // eslintPath: require.resolve('eslint')
            // }),
            // 插入全局变量
            new webpack_1.default.DefinePlugin(envConstant.str),
        ].filter(Boolean),
    };
}
exports.default = common;
