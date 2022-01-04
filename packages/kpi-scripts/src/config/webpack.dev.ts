import { merge } from 'webpack-merge'
import common from './webpack.common'
import { DEV_CONST } from '../shared/constant'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
// TODO: 使用 dotenv 获取自定义变量
// 开发环境
export default function dev() {
  return merge(common('development'), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      filename: 'js/bundle.js',
      chunkFilename: 'js/[name].chunk.js',
    },
    // TODO: 待完善
    stats: 'errors-only',
    optimization: {
      minimize: false,
    },
    plugins: [
      // 生成html，自动引入所有bundle
      new HtmlWebpackPlugin({
        inject: true,
        template: DEV_CONST.PUBLIC_HTML_FILE,
      }),
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/],
        overlay: false,
      }),
    ],
    devServer: {
      static: {
        directory: DEV_CONST.PUBLIC_DIR,
        publicPath: [DEV_CONST.PUBLIC_PATH],
      },
      hot: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
  })
}
