import { DEV_CONST } from '../shared/constant'
import webpack from 'webpack'
import WebPackBarPlugin from 'webpackbar'

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import getEnvConstant from '../shared/get_env_constant'
import InterpolateHtmlPlugin from '../shared/interpolate_html_plugin'
// TODO: 使用 dotenv 获取自定义变量
const envConstant = getEnvConstant()

export default function common(mode: 'development' | 'production'): Record<string, any> {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  return {
    target: ['browserslist'],
    entry: DEV_CONST.FIND_ENTRY_FILE(),
    output: {
      path: DEV_CONST.OUTPUT_PATH,
      assetModuleFilename: 'media/[name].[hash][ext]',
      publicPath: DEV_CONST.PUBLIC_PATH,
    },
    cache: {
      type: 'filesystem', // 使用文件缓存
      //待优化
      version: DEV_CONST.CACHE_VERSION,
      cacheDirectory: DEV_CONST.WEBPACK_CACHE_DIR,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsConfig: DEV_CONST.FIND_CACHE_TSCONFIG(),
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
      modules: ['node_modules', DEV_CONST.NODE_MODULES],
      extensions: DEV_CONST.RESOLVE_EXTENSIONS,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: DEV_CONST.SRC_DIR,
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
      new WebPackBarPlugin({ profile: true }),
      new InterpolateHtmlPlugin(getEnvConstant().env),
      // new WebpackManifestPlugin({
      //   fileName: 'asset-manifest.json',
      //   publicPath: DEV_CONST.PUBLIC_PATH,
      //   // generate //待优化
      // }),
      new webpack.IgnorePlugin({
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
      new webpack.DefinePlugin(envConstant.str),
    ].filter(Boolean),
  }
}
