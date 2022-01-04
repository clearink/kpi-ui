"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../shared/constant");
var webpack_1 = __importDefault(require("webpack"));
var webpackbar_1 = __importDefault(require("webpackbar"));
var fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
var get_env_constant_1 = __importDefault(require("../shared/get_env_constant"));
var interpolate_html_plugin_1 = __importDefault(require("../shared/interpolate_html_plugin"));
var get_style_loader_1 = __importDefault(require("../shared/get_style_loader"));
// TODO: 使用 dotenv 获取自定义变量
var envConstant = (0, get_env_constant_1.default)();
function common(mode) {
    var isDev = mode === 'development';
    var isProd = mode === 'production';
    var useTailwind = constant_1.DEV_CONST.USE_TAILWIND();
    var useTypeScript = constant_1.DEV_CONST.USE_TYPESCRIPT();
    return {
        target: ['browserslist'],
        entry: constant_1.DEV_CONST.FIND_ENTRY_FILE(),
        context: constant_1.DEV_CONST.APP_DIR,
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
                tsConfig: constant_1.DEV_CONST.FIND_TSCONFIG(),
            },
        },
        infrastructureLogging: {
            level: 'none',
        },
        resolve: {
            modules: ['node_modules', constant_1.DEV_CONST.NODE_MODULES],
            extensions: constant_1.DEV_CONST.RESOLVE_EXTENSIONS,
            alias: {
                '@': constant_1.DEV_CONST.SRC_DIR,
            },
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    use: [
                        {
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
                        require.resolve('thread-loader'),
                    ],
                },
                {
                    test: /\.(bmp|svg|jpg|jpeg|gif|png)$/i,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    type: 'asset/resource',
                    /**
                     * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
                     * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
                     * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
                     * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。
                     * 之前通过使用 url-loader，并且配置资源体积限制实现
                     */
                },
                {
                    // TODO: 字体是否需要呢？
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    type: 'asset/resource',
                },
                {
                    test: /\.css$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    exclude: /\.module\.css$/,
                    use: (0, get_style_loader_1.default)({
                        mode: mode,
                        useTailwind: useTailwind,
                        module: false,
                        sass: false,
                    }),
                },
                {
                    test: /\.module\.css$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    use: (0, get_style_loader_1.default)({
                        mode: mode,
                        useTailwind: useTailwind,
                        module: true,
                        sass: false,
                    }),
                },
                {
                    test: /\.s(c|a)ss$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    exclude: /\.module\.s(c|a)ss$/,
                    use: (0, get_style_loader_1.default)({
                        mode: mode,
                        useTailwind: useTailwind,
                        module: false,
                        sass: true,
                    }),
                },
                {
                    test: /\.module\.s(c|a)ss$/,
                    include: constant_1.DEV_CONST.SRC_DIR,
                    use: (0, get_style_loader_1.default)({
                        mode: mode,
                        useTailwind: useTailwind,
                        module: true,
                        sass: true,
                    }),
                },
            ],
        },
        plugins: [
            new webpackbar_1.default(),
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
            useTypeScript &&
                new fork_ts_checker_webpack_plugin_1.default({
                    async: isDev,
                }),
            // // 待优化
            // new ESLintPlugin({
            //   cache: true,
            //   context: DEV_CONST.SRC_DIR,
            //   extensions: DEV_CONST.RESOLVE_EXTENSIONS,
            //   eslintPath: require.resolve('eslint'),
            //   cacheLocation: DEV_CONST.ESLINT_CACHE_DIR,
            //   // eslint class options
            //   cwd: DEV_CONST.APP_DIR,
            //   resolvePluginsRelativeTo: __dirname,
            //   // TODO: 待优化
            //   // baseConfig: {},
            // }),
            // 插入全局变量
            new webpack_1.default.DefinePlugin(envConstant.str),
        ].filter(Boolean),
    };
}
exports.default = common;
