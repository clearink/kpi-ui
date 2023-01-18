import webpack, { type Configuration } from 'webpack'
import WebPackBarPlugin from 'webpackbar'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'

import { getEnv, getStyleLoader } from '../../utils'

import type { ConstantType } from '../../constant'
// TODO: 使用 dotenv 获取自定义变量
const envConstant = getEnv()

export default function common(mode: 'development' | 'production', constant: ConstantType) {
  const isDev = mode === 'development'

  return {
    target: ['browserslist'],
    context: constant.APP_DIR,
    entry: constant.ENTRY_FILE(isDev),
    // 不展示性能提示
    performance: false,
    output: {
      path: constant.OUTPUT_PATH,
    },
    infrastructureLogging: {
      level: 'warn',
    },
    resolve: {
      modules: ['node_modules', constant.NODE_MODULES],
      extensions: constant.RESOLVE_EXTENSIONS(),
      alias: constant.RESOLVE_ALIAS(),
    },
    module: {
      parser: {
        javascript: {
          exportsPresence: 'error',
        },
      },
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: constant.BABEL_LOADER_OPTIONS(isDev),
            },
            require.resolve('thread-loader'),
          ],
        },
        {
          test: /\.(svg)(\?.*)?$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(bmp|svg|jpe?g|gif|png|webp|avif)$/i,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          type: 'asset',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
          /**
           * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
           * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
           * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
           * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。
           * 之前通过使用 url-loader，并且配置资源体积限制实现
           */
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          type: 'asset',
          generator: {
            filename: 'media/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.css$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          exclude: /\.module\.css$/,
          use: getStyleLoader({
            mode,
            module: false,
            sass: false,
          }),
        },
        {
          test: /\.module\.css$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: getStyleLoader({
            mode,
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
            module: false,
            sass: true,
          }),
        },
        {
          test: /\.module\.s(c|a)ss$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: getStyleLoader({
            mode,
            module: true,
            sass: true,
          }),
        },
        isDev && {
          test: /\.md$/,
          include: [constant.SRC_DIR, constant.PREVIEW_SRC_DIR],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: constant.BABEL_LOADER_OPTIONS(isDev),
            },
            require.resolve(constant.MD_LOADER),
            require.resolve('thread-loader'),
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      new WebPackBarPlugin(),
      // TODO
      // new WebpackManifestPlugin({
      //   fileName: 'asset-manifest.json',
      //   publicPath: KPI_CONST.PUBLIC_PATH,
      //   // generate //待优化
      // }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // 单独一个进程检查
      constant.USE_TYPESCRIPT() && new ForkTsCheckerWebpackPlugin(),
      new ESLintWebpackPlugin({
        context: constant.SRC_DIR,
        extensions: constant.RESOLVE_EXTENSIONS(),
        eslintPath: require.resolve('eslint'),
        cache: true,
        cacheLocation: constant.ESLINT_CACHE,
        // ESLint class options
        cwd: constant.APP_DIR,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          rules: constant.JSX_ESLINT_RULE(),
        },
      }),
      // TODO 插入全局变量
      new webpack.DefinePlugin({
        ...envConstant.str,
        // 'process.env': {
        //   NODE_ENV: `"${mode}"`,
        //   BASE_URL: '"/"',
        // },
      }),
    ].filter(Boolean),
  } as Configuration
}
