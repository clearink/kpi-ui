import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import logger from '../shared/logger'
import dev from '../config/webpack.dev'
export default async function start(options: { open: boolean; port: number }) {
  process.env.NODE_ENV = 'development'
  const config = dev(options)
  // console.log(config.module.rules[0])
  let compiler = null
  try {
    compiler = webpack(config)
  } catch (error: any) {
    logger.error('编译失败!\n')
    logger.error(error?.message)
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    console.clear()
    logger.info('编译中,请稍后...')
  })
  try {
    // TODO: 待优化
    const server = new WebpackDevServer(
      {
        ...config.devServer,
      },
      compiler
    )
    server.startCallback(() => {
      logger.success(`Successfully started server on http://localhost:${options.port}`)
    })
    const close = () => {
      server.close()
      process.exit()
    }
    ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, close)
    })
    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', close)
    }
  } catch (error: any) {
    console.log(error)
    process.exit(1)
  }
}
