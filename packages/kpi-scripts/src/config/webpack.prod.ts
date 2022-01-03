import { merge } from 'webpack-merge'
import common from './webpack.common'
import { DEV_CONST } from '../shared/constant'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

// 生产环境
export default function prod() {
  return merge(common('production'), {
    mode: 'production',
    bail: true,
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: DEV_CONST.PUBLIC_HTML_FILE,
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
