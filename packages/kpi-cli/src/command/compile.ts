import { readdir, readFileSync, statSync } from 'fs-extra'
import { resolve } from 'path'
import { transformAsync } from '@babel/core'
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
    files.forEach(async (file) => {
      const filePath = resolve(DEV_CONST.SRC_DIR, file)
      if (statSync(filePath).isFile()) return
      const path = resolve(filePath, 'index.tsx')
      const source = readFileSync(path, 'utf-8')
      const result = await transformAsync(source, {
        filename: 'index.tsx',
        presets: [
          require.resolve('@babel/preset-env'),
          require.resolve('@babel/preset-react'),
          require.resolve('@babel/preset-typescript'),
        ],
        plugins: [
          [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
          require.resolve('@babel/plugin-proposal-class-properties'),
        ],
      })
      console.log(result?.code)
    })
  })
}
function compileUmd() {}
function compileEsm() {}
