import { resolve } from 'path'
import { remove } from 'fs-extra'
import { spawn } from 'child_process'
import { CompileProps } from '../command/compile'
import KPI_CONST from '../shared/constant'

export default function compileScript(mode: 'cjs' | 'esm', options: CompileProps) {
  const { entry, force } = options

  const { CJS_DIR_NAME, ESM_DIR_NAME, FILE_EXTENSIONS } = KPI_CONST
  const { TEST_DIR_NAME, PROPS_FILE_NAME, DOCS_DIR_NAME } = KPI_CONST
  // 删除之前编译目录
  const output = mode === 'cjs' ? CJS_DIR_NAME : ESM_DIR_NAME
  force && remove(resolve(KPI_CONST.APP_DIR, output))

  const args: string[] = [
    require.resolve('@babel/cli/bin/babel'),
    entry,
    '--extensions',
    FILE_EXTENSIONS.join(','),
    '--out-dir',
    output,
    '--ignore',
    [
      './**/*.d.ts',
      `./**/${DOCS_DIR_NAME}/*`,
      `./**/${TEST_DIR_NAME}/*`,
      `./**/${PROPS_FILE_NAME}`,
    ].join(','),
    '--config-file',
    require.resolve(`../config/babel/babel.${mode}`),
  ]
  // 使用 babel 编译
  const child = spawn('node', args)
  child.stderr.pipe(process.stderr)

  return new Promise<void>((res, rej) => {
    child.on('exit', (code) => {
      code ? rej() : res()
    })
  })
}
