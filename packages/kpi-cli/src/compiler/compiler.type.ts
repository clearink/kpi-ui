// 调用 tsc 编译类型
import { resolve } from 'path'
import { remove } from 'fs-extra'
import { spawn } from 'child_process'
import KPI_CONST from '../shared/constant'
import { CompileProps } from '../command/compile'

export default function compileType(options: CompileProps) {
  const { force } = options
  const { APP_DIR, TYPE_DIR_NAME, TS_CONFIG } = KPI_CONST(false)
  force && remove(resolve(APP_DIR, TYPE_DIR_NAME))

  const args = [
    require.resolve('typescript/bin/tsc'),
    '--project',
    TS_CONFIG,
    '--outDir',
    TYPE_DIR_NAME,
    '--removeComments', // 移除注释
    '--declaration', // 生成 .d.ts 文件
    '--emitDeclarationOnly', // 仅生成 .d.ts 文件
    '--noEmit',
    'false',
  ]

  const child = spawn('node', args)
  child.stderr.pipe(process.stderr)

  return new Promise<void>((res, rej) => {
    child.on('exit', (code) => {
      code ? rej() : res()
    })
  })
}
