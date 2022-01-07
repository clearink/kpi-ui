import compileFile, { CompileProps } from '../compiler'
import logger from '../shared/logger'

// compiler kpi-ui

export default async function compile(options: CompileProps) {
  process.env.NODE_ENV = 'production'
  switch (options.mode) {
    case 'cjs':
    case 'esm':
      return compileFile(options)
    case 'umd':
      return compileUmd()
    default:
      logger.error(`compile mode must be one of ['cjs', 'umd', 'esm']`)
      return
  }
}

function compileUmd() {}
