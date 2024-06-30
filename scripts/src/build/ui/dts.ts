import { rollup } from 'rollup'
import path from 'path'
import glob from 'fast-glob'
import { constants } from '../../utils/helpers'
import ts from 'typescript'

export default async function buildDts() {
  const options: ts.CompilerOptions = {
    project: constants.ui,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: constants.esm,
  }
  const host = ts.createCompilerHost(options)

  const root = constants.resolveCwd('src')

  const files = glob
    .sync('**/*.ts{,x}', { cwd: root })
    .filter((file) => file.startsWith('space'))
    .map((file) => path.resolve(root, file))

  console.log(files, options)

  const program = ts.createProgram(files, options, host)

  program.emit()
}
