import webpack, { Configuration } from 'webpack'
import WebPackBarPlugin from 'webpackbar'

import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'

import { ConstantType } from '../../shared/constant'

import InterpolateHtmlPlugin from '../../plugins/interpolate_html_plugin'
import { getEnvConstant, getStyleLoader } from '../../shared/utils'
// TODO: 使用 dotenv 获取自定义变量
const envConstant = getEnvConstant()

export default function common(mode: 'development' | 'production', constant: ConstantType) {
  const isDev = mode === 'development'

  const useTailwind = constant.USE_TAILWIND()
  const useTypeScript = constant.USE_TYPESCRIPT()
  return {
    target: ['browserslist'],
    entry: constant.ENTRY_FILE(),
    // 不展示性能提示
    performance: false,
    output: {
      path: constant.OUTPUT_PATH,
      assetModuleFilename: 'media/[name].[hash][ext]',
      publicPath: constant.PUBLIC_PATH,
    },
    infrastructureLogging: {
      level: 'none',
    },
    resolve: {
      modules: ['node_modules', constant.NODE_MODULES],
      extensions: constant.RESOLVE_EXTENSIONS(),
      alias: {
        // TODO: 支持外部扩展
        '@': constant.SRC_DIR,
      },
      // TODO: 添加额外的解析插件
      // plugins: [],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          // loader: require.resolve('esbuild-loader'),
          // options: {
          //   loader: 'tsx',
          //   target: 'es2015',
          //   tsconfigRaw: require(constant.TS_CONFIG),
          // },
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  [
                    require.resolve('@babel/preset-react'),
                    {
                      runtime: constant.JSX_RUNTIME(),
                    },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  require.resolve('@babel/plugin-transform-runtime'),
                  isDev && require.resolve('react-refresh/babel'),
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: !isDev,
              },
            },
            require.resolve('thread-loader'),
          ],
        },
        {
          test: /\.(bmp|svg|jpg|jpeg|gif|png)$/i,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
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
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          exclude: /\.module\.css$/,
          use: getStyleLoader({
            mode,
            useTailwind,
            module: false,
            sass: false,
          }),
        },
        {
          test: /\.module\.css$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: getStyleLoader({
            mode,
            useTailwind,
            module: true,
            sass: false,
          }),
        },
        {
          test: /\.s(c|a)ss$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          exclude: /\.module\.s(c|a)ss$/,
          use: getStyleLoader({
            mode,
            useTailwind,
            module: false,
            sass: true,
          }),
        },
        {
          test: /\.module\.s(c|a)ss$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: getStyleLoader({
            mode,
            useTailwind,
            module: true,
            sass: true,
          }),
        },
      ],
    },
    plugins: [
      new WebPackBarPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: constant.TEMPLATE_HTML_FILE(),
        minify: constant.HTML_PLUGIN_MINIFY(isDev),
      }),
      // TODO
      new InterpolateHtmlPlugin(getEnvConstant().env),
      // new WebpackManifestPlugin({
      //   fileName: 'asset-manifest.json',
      //   publicPath: KPI_CONST.PUBLIC_PATH,
      //   // generate //待优化
      // }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // // 单独一个进程检查
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: isDev,
        }),
      new ESLintPlugin({
        fix: true /* 自动帮助修复 */,
        context: constant.SRC_DIR,
        extensions: constant.RESOLVE_EXTENSIONS(),
        eslintPath: require.resolve('eslint'),
        failOnError: !isDev,
        cache: true,
        cacheLocation: constant.ESLINT_CACHE_DIR,
        exclude: 'node_modules',
        threads: true,
        // formatter: require.resolve('react-dev-utils/eslintFormatter'),
        // ESLint class options
        cwd: constant.APP_DIR,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('../../../.eslintrc.js')],
          rules: constant.JSX_ESLINT_RULE()
        },
      }),
      // TODO 插入全局变量
      new webpack.DefinePlugin(envConstant.str),
    ],
  } as Configuration
}
