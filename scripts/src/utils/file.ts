import { ensureFileSync, existsSync, removeSync, writeFileSync } from 'fs-extra'
import { resolve } from 'node:path'
import { getTargetFilename } from './path'
import { CompileCommandOptions } from '../compile/code'

export function safeRemoveFile(cwd: string, options: CompileCommandOptions, file: string) {
  const { outDir, entry } = options

  const target = resolve(cwd, outDir, getTargetFilename(entry, file))

  if (existsSync(target)) removeSync(target)
}

export function safeWriteFile(path: string, data: string) {
  ensureFileSync(path)
  writeFileSync(path, data, { encoding: 'utf-8' })
}
