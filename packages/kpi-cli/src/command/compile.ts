import { spawn } from 'child_process'
import { resolve } from 'path'
import { remove } from 'fs-extra'
import ora from 'ora'
import { KPI_CONST, GEN_CONST } from '../shared/constant'
import logger from '../shared/logger'

const { TEST_DIR_NAME, PROPS_FILE_NAME, DOCS_DIR_NAME } = GEN_CONST
// compiler kpi-ui
interface CompileProps {
  mode: 'cjs' | 'esm' | 'umd'
  entry: string
  output: string
  force: boolean
  watch: boolean
}
export default async function compile(options: CompileProps) {
  const { entry, output, watch, mode, force } = options
  process.env.NODE_ENV = 'production'
  process.env.COMPILE_MODE = mode
  // 删除之前编译目录
  force && remove(resolve(KPI_CONST.APP_DIR, output))
  if (['cjs', 'esm'].includes(mode)) {
    // 使用 babel 编译
    const text = logger.info(`正在以模式 ${mode} 编译\n`, false)
    let spinner: ora.Ora | null = null

    if (watch) logger.info(text)
    else spinner = ora(text).start()

    const args: any[] = [
      require.resolve('@babel/cli/bin/babel'),
      entry,
      '--extensions',
      KPI_CONST.RESOLVE_EXTENSIONS.join(','),
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
      require.resolve('../config/babel.config'),
      watch && '--watch',
    ].filter(Boolean)
    const child = spawn('node', args, { shell: false })
    child.stdout.on('data', (chunk: Buffer) => logger.success(`${chunk}`))
    child.stdout.on('error', (chunk) => logger.error(`${chunk.message}`))
    child.stdout.on('close', () => {
      const text = logger.success(`以模式 ${mode} 编译成功`, false)
      spinner?.succeed(text)
    })
    // 使用 sass 编译样式文件
  } else if (mode === 'umd') {
    // 使用 webpack 编译
  } else {
    logger.error(`compile mode must be one of ['cjs', 'umd', 'esm']`)
  }
}

function compileUmd() {}
