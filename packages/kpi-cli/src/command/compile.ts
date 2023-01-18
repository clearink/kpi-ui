import ora from 'ora'
import logger from '../utils/logger'
import compileScript from '../compiler/compiler.script'
import compileType from '../compiler/compiler.type'
import compileStyle from '../compiler/compiler.style'

// compiler kpi-ui
export interface CompileProps {
  entry: string
  force: boolean
  type: boolean
  style: boolean
  component: boolean
}
export default function compile(options: CompileProps) {
  process.env.NODE_ENV = 'production'
  const spinner = ora(logger.info('开始编译组件库', false)).start()
  Promise.all(
    [
      options.type && compileType(options),
      options.style && compileStyle(options),
    ].filter(Boolean)
  )
    .then(() => {
      spinner.succeed(logger.success('组件库编译成功 ', false))
    })
    .catch(() => {
      spinner.fail(logger.success(`组件库编译失败`, false))
    })
}

function compileUmd() {}
