import { merge } from 'webpack-merge'
import common from './webpack.common'
import KPI_CONST from '../../shared/constant'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

// 生产环境
export default function prod() {
  const constant = KPI_CONST(false)
  return merge(common('production', constant), {
    mode: 'production',
    bail: true,
    output: {
      clean: true, // 清除 output 目录
      pathinfo: false,
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    }, //使用文件缓存
    optimization: {
      runtimeChunk: true,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: -10,
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true,
            },
            mangle: {
              safari10: true,
            },
          },
          parallel: true,
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false,
                cssDeclarationSorter: false,
              },
            ],
          },
        }),
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        scriptLoading: 'defer',
        inject: true,
        template: constant.TEMPLATE_HTML_FILE(),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    ],
  })
}
