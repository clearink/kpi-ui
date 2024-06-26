import chokidar from 'chokidar'
import glob from 'fast-glob'
import { realpathSync, statSync } from 'fs-extra'
import { resolve } from 'node:path'
import ts, { CompilerOptions } from 'typescript'
import { safeRemoveFile } from '../../utils/file'
import { CompileCommandOptions } from './interface'

export default function compileType(options: CompileCommandOptions) {
  const { entry, outDir, watch } = options

  const cwd = realpathSync(process.cwd())

  const isDir = statSync(resolve(cwd, entry)).isDirectory()

  const match = isDir ? `${entry}/**/*.ts{,x}` : entry

  const entries = glob.sync(match).map((file) => resolve(cwd, file))

  const program = ts.createProgram({
    rootNames: entries,
    options: {
      noEmit: false,
      declaration: true,
      declarationDir: outDir,
      emitDeclarationOnly: true,
    },
  })
  program.emit()
}
