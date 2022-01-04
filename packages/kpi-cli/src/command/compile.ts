import { readdir, statSync } from 'fs-extra'
import { resolve } from 'path'
import webpack from 'webpack'
import prod from '../config/webpack.prod'
import { DEV_CONST } from '../shared/constant'
import logger from '../shared/logger'

// compiler kpi-ui
export default async function compile({ mode }: { mode: 'cjs' | 'umd' | 'esm' }) {
  process.env.NODE_ENV = 'production'
  console.log('compile', mode)
  switch (mode) {
    case 'cjs':
      return compileCjs()
    case 'umd':
      return compileUmd()
    case 'esm':
      return compileEsm()
    default:
      logger.error(`compile mode must be one of ['cjs', 'umd', 'esm']`)
      return
  }
}
// entry 然后不断的编译 ?
function compileCjs() {
  readdir(DEV_CONST.SRC_DIR, (err, files) => {
    if (err) return logger.error(err.message)
    files
      .map((name) => resolve(DEV_CONST.SRC_DIR, name))
      .forEach((path) => {
        if (statSync(path).isFile()) return
        console.log(path)
      })
  })
}
function compileUmd() {}
function compileEsm() {}
