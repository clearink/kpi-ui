import { copy, existsSync } from 'fs-extra'
import { resolve } from 'path'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import devConfig from '../config/webpack/webpack.dev'
import KPI_CONST from '../shared/constant'
import logger from '../shared/logger'

// preview site
export default async function preview(options: { open: boolean; port: number }) {
  process.env.NODE_ENV = 'development'
  const config = devConfig(true)
  const { APP_DIR } = KPI_CONST(true) // 预览常量配置

  const kpiDir = resolve(APP_DIR, '.kpi')
  if (!existsSync(kpiDir)) {
    await copy(resolve(__dirname, '../../site'), kpiDir)
  }

  try {
    const compiler = webpack(config)

    const devServerConfig = { ...config.devServer, ...options }
    const server = new WebpackDevServer(devServerConfig, compiler)
    await server.start()

    compiler.hooks.invalid.tap('invalid', () => console.clear())
    ;['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        server.close()
        process.exit()
      })
    })
  } catch (error) {
    logger.error(error?.message)
    process.exit(1)
  }
}
