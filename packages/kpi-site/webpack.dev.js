const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'js/bundle.js',
    chunkFilename: 'js/[name].chunk.js',
  },
  cache: true,
  stats: 'errors-warnings',
  optimization: {
    minimize: false,
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      inject: true,
      scriptLoading: 'defer',
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new ReactRefreshWebpackPlugin({
      exclude: [/node_modules/],
      overlay: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"development"`,
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, './public'),
    },
    port: 4001,
    hot: true,
    open: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
})
