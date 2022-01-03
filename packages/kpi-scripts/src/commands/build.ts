import webpack from 'webpack'
import logger from '../shared/logger'
import prod from '../config/webpack.prod'

export default async function build() {
  process.env.NODE_ENV = 'production'
  const compiler = webpack(prod(), (err, stats) => {
    if (err || stats?.hasErrors()) {
      logger.error(err?.message ?? stats?.toString())
    }
  })
  // console.log(dev(options))

  // compiler.watch({}, (a: any) => {
  //   console.log(a)
  // })
}
