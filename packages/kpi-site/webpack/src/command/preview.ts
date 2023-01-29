import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import dev from '../config/webpack/webpack.dev'
import KPI_CONST from '../constant'
import logger from '../utils/logger'

// preview site
export default async function preview(options: { open: boolean; port: number }) {
  process.env.NODE_ENV = 'development'

  const config = dev()

  await KPI_CONST.SHOULD_COPY_DEFAULT_TEMPLATE()

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
  } catch (error: any) {
    logger.error(error?.message)
    process.exit(1)
  }
}
