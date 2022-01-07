// 编译成 cjs/esm

import { removeSync, stat } from 'fs-extra'
import { resolve } from 'path'
import { KPI_CONST } from '../shared/constant'
import logger from '../shared/logger'
import { compileDir } from './utils'

export interface CompileProps {
  mode: 'cjs' | 'esm' | 'umd'
  entry: string
  output: string
}
export default async function compileFile(options: CompileProps) {
  const { entry, output } = options
  const entryDir = resolve(KPI_CONST.APP_DIR, entry)
  const fileStat = await stat(entryDir)
  if (fileStat.isDirectory()) {
    // 删除 output
    const outDir = resolve(KPI_CONST.APP_DIR, output)
    removeSync(outDir)
    compileDir(entryDir, outDir, options)
  } else {
    logger.error('entry must a directory')
    process.exit(1)
  }
}
