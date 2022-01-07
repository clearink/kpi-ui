import compileLib, { CompileOptions } from '../compiler/compile.lib'
import logger from '../shared/logger'

// compiler kpi-ui

export default async function compile(options: CompileOptions) {
  process.env.NODE_ENV = 'production'
  const { mode, entry, output } = options
  switch (mode) {
    case 'cjs':
      return compileLib(options)
    case 'umd':
      return compileUmd()
    default:
      logger.error(`compile mode must be one of ['cjs', 'umd', 'esm']`)
      return
  }
}

function compileUmd() {}
