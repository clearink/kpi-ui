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
    // TODO: 在 分析模式下打开
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
      minimize: true,
      runtimeChunk: true,
      minimizer: [
        new TerserPlugin({
          parallel: 4,
          terserOptions: {
            parse: { ecma: 2017 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            format: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          parallel: 4,
        }),
      ],
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
    },

    plugins: [
      new HtmlWebpackPlugin({
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
