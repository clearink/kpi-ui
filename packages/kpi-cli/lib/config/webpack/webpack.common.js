"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = common;

var _constant = require("../../shared/constant");

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackbar = _interopRequireDefault(require("webpackbar"));

var _forkTsCheckerWebpackPlugin = _interopRequireDefault(require("fork-ts-checker-webpack-plugin"));

var _interpolate_html_plugin = _interopRequireDefault(require("../../plugins/interpolate_html_plugin"));

var _utils = require("../../shared/utils");

// TODO: 使用 dotenv 获取自定义变量
var envConstant = (0, _utils.getEnvConstant)();

function common(mode) {
  var isDev = mode === 'development';
  var isProd = mode === 'production';

  var useTailwind = _constant.DEV_CONST.USE_TAILWIND();

  var useTypeScript = _constant.DEV_CONST.USE_TYPESCRIPT();

  return {
    target: ['browserslist'],
    entry: _constant.DEV_CONST.FIND_ENTRY_FILE(),
    context: _constant.DEV_CONST.APP_DIR,
    output: {
      path: _constant.DEV_CONST.OUTPUT_PATH,
      assetModuleFilename: 'media/[name].[hash][ext]',
      publicPath: _constant.DEV_CONST.PUBLIC_PATH
    },
    cache: {
      type: 'filesystem',
      // 使用文件缓存
      //待优化
      version: _constant.DEV_CONST.CACHE_VERSION,
      cacheDirectory: _constant.DEV_CONST.WEBPACK_CACHE_DIR,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsConfig: _constant.DEV_CONST.FIND_TSCONFIG()
      }
    },
    infrastructureLogging: {
      level: 'none'
    },
    resolve: {
      modules: ['node_modules', _constant.DEV_CONST.NODE_MODULES],
      extensions: _constant.DEV_CONST.RESOLVE_EXTENSIONS,
      alias: {
        '@': _constant.DEV_CONST.SRC_DIR
      }
    },
    module: {
      strictExportPresence: true,
      rules: [{
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: _constant.DEV_CONST.SRC_DIR,
        use: [{
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
            plugins: [[require.resolve('@babel/plugin-transform-runtime'), {
              regenerator: true
            }], isDev && require.resolve('react-refresh/babel')].filter(Boolean),
            cacheDirectory: true,
            cacheCompression: false,
            compact: isProd
          }
        }, require.resolve('thread-loader')]
      }, {
        test: /\.(bmp|svg|jpg|jpeg|gif|png)$/i,
        include: _constant.DEV_CONST.SRC_DIR,
        type: 'asset/resource'
        /**
         * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
         * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
         * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
         * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。
         * 之前通过使用 url-loader，并且配置资源体积限制实现
         */

      }, {
        // TODO: 字体是否需要呢？
        test: /\.(woff2?|eot|ttf|otf)$/i,
        include: _constant.DEV_CONST.SRC_DIR,
        type: 'asset/resource'
      }, {
        test: /\.css$/,
        include: _constant.DEV_CONST.SRC_DIR,
        exclude: /\.module\.css$/,
        use: (0, _utils.getStyleLoader)({
          mode: mode,
          useTailwind: useTailwind,
          module: false,
          sass: false
        })
      }, {
        test: /\.module\.css$/,
        include: _constant.DEV_CONST.SRC_DIR,
        use: (0, _utils.getStyleLoader)({
          mode: mode,
          useTailwind: useTailwind,
          module: true,
          sass: false
        })
      }, {
        test: /\.s(c|a)ss$/,
        include: _constant.DEV_CONST.SRC_DIR,
        exclude: /\.module\.s(c|a)ss$/,
        use: (0, _utils.getStyleLoader)({
          mode: mode,
          useTailwind: useTailwind,
          module: false,
          sass: true
        })
      }, {
        test: /\.module\.s(c|a)ss$/,
        include: _constant.DEV_CONST.SRC_DIR,
        use: (0, _utils.getStyleLoader)({
          mode: mode,
          useTailwind: useTailwind,
          module: true,
          sass: true
        })
      }]
    },
    plugins: [new _webpackbar["default"](), new _interpolate_html_plugin["default"]((0, _utils.getEnvConstant)().env), // new WebpackManifestPlugin({
    //   fileName: 'asset-manifest.json',
    //   publicPath: DEV_CONST.PUBLIC_PATH,
    //   // generate //待优化
    // }),
    new _webpack["default"].IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }), // // 单独一个进程检查
    useTypeScript && new _forkTsCheckerWebpackPlugin["default"]({
      async: isDev
    }), // // 待优化
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
    new _webpack["default"].DefinePlugin(envConstant.str)].filter(Boolean)
  };
}