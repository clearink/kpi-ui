import chokidar from 'chokidar'
import glob from 'fast-glob'
import { realpathSync, statSync } from 'fs-extra'
import { resolve } from 'node:path'
import { safeRemoveFile } from '../../utils/file'
import transformCode from './transform.code'
import { CompileCommandOptions } from './interface'

export default function compileCode(options: CompileCommandOptions) {
  const { entry, watch } = options

  const cwd = realpathSync(process.cwd())

  const isDir = statSync(resolve(cwd, entry)).isDirectory()

  const match = isDir ? `${entry}/**/*.ts{,x}` : entry

  const callback = transformCode.bind(null, cwd, options)

  if (!watch) return glob.sync(match).forEach(callback)

  const watcher = chokidar.watch(match, { cwd })

  watcher.on('add', callback)
  watcher.on('change', callback)
  watcher.on('unlink', safeRemoveFile.bind(null, cwd, options))
}
