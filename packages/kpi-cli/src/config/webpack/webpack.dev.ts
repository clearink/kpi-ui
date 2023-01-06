import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import common from './webpack.common'
import KPI_CONST from '../../shared/constant'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

// TODO: 使用 dotenv 获取自定义变量
// 开发环境

export default function dev(preview: boolean) {
  return merge(common('development', KPI_CONST), {
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
        template: KPI_CONST.TEMPLATE_HTML_FILE,
      }),
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/],
        overlay: false,
      }),
    ],
    devServer: {
      static: {
        directory: KPI_CONST.PREVIEW_PUBLIC_DIR,
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
