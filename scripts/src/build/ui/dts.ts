import { rollup } from 'rollup'
import path from 'path'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import consola from 'consola'
import { run } from '../../utils/helpers'
import ts from 'typescript'
import { ScriptTarget } from 'typescript'

export default async function buildDts() {
  consola.start('starting build dts files...')

  const options: ts.CompilerOptions = {
    project: constants.components,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: constants.esm,
    target: ScriptTarget.ES2015,
  }
  const host = ts.createCompilerHost(options)

  const files = await glob
    .sync('./src/**/*.ts{,x}', {
      ignore: ['**/style/*'],
      cwd: constants.components,
    })
    .map((file) => constants.resolveComps(file))

  const program = ts.createProgram(files, options, host)

  program.emit()
  // const entries: Record<string, string> = {}

  // glob
  //   .sync('./src/**/*.ts{,x}', {
  //     ignore: ['**/style/*'],
  //     cwd: constants.components,
  //   })
  //   .forEach((file) => {
  //     const entry = path.relative('src', file).slice(0, -path.extname(file).length)

  //     entries[entry] = constants.resolveComps(file)
  //   })
}
