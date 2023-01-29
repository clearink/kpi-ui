import webpack from 'webpack'
import prod from '../config/webpack/webpack.prod'
import logger from '../utils/logger'

// build site
export default async function build() {
  process.env.NODE_ENV = 'production'

  // webpack(prod(), (err, stats) => {
  //   if (err || stats?.hasErrors()) {
  //     logger.error(err?.message ?? stats?.toString())
  //   } else logger.success('编译成功')
  // })
}
