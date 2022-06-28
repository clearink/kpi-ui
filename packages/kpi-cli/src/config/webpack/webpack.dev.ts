import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import common from './webpack.common'
import KPI_CONST from '../../shared/constant'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

// TODO: 使用 dotenv 获取自定义变量
// 开发环境

export default function dev(preview: boolean) {
  const constant = KPI_CONST(preview)
  return merge(common('development', constant), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      filename: 'js/bundle.js',
      chunkFilename: 'js/[name].chunk.js',
    },
    cache: true, // dev 下使用内存缓存
    // TODO: 待完善
    stats: 'errors-only',
    plugins: [
      // 生成html，自动引入所有bundle
      new HtmlWebpackPlugin({
        inject: true,
        scriptLoading: 'defer',
        template: constant.TEMPLATE_HTML_FILE(),
      }),
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/],
        overlay: false,
      }),
    ],
    devServer: {
      static: {
        directory: constant.PUBLIC_DIR,
        publicPath: [constant.PUBLIC_PATH],
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
  } as Configuration)
}
