import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import logger from '../shared/logger'
import dev from '../config/webpack.dev'
export default async function start(options: { open: boolean; port: number }) {
  process.env.NODE_ENV = 'development'
  const config = dev()

  let compiler: webpack.Compiler | null = null
  try {
    compiler = webpack(config)
  } catch (error: any) {
    logger.error(error?.message)
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    console.clear()
  })

  const server = new WebpackDevServer(
    {
      ...config.devServer,
      ...options,
    },
    compiler
  )

  try {
    await server.start()
    logger.success(`Successfully started server on http://localhost:${options.port}`)
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
