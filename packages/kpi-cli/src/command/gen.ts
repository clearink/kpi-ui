import { ensureDir, outputFile, pathExistsSync, removeSync } from 'fs-extra'
import ora from 'ora'
import { resolve } from 'path'
import logger from '../shared/logger'
import { camelCase } from '../shared/utils'
import KPI_CONST from '../shared/constant'

export default async function create(name: string, config: { force: boolean }) {
  const uiName = camelCase(name, true)
  const GEN_CONST = KPI_CONST('development')
  const tsxTemplate = `\
import { ${uiName}Props } from './${GEN_CONST.PROPS_DIR_NAME}'

function ${uiName}(props: ${uiName}Props) {
  return <div className="${name}">${name}</div>
}
export default ${uiName}
  `
  const styleTemplate = `\
// 优化打包性能引入除了 preset 的内容
@import '../../style/core/index.scss'; // 引入 BEM
@import '../../style/themes/index.scss'; // 引入 变量
  `
  const styleEntryTemplate = `\
// 实现按需引入

// 样式配置
import '../../style/index.scss'
import './index.scss'

  `
  const propsTemplate = `\
export interface ${uiName}Props{

}
  `
  const uiDir = resolve(GEN_CONST.SRC_DIR, name)
  const testsDir = resolve(uiDir, GEN_CONST.TEST_DIR_NAME)
  const docsDir = resolve(uiDir, GEN_CONST.DOCS_DIR_NAME)
  const styleDir = resolve(uiDir, GEN_CONST.STYLE_DIR_NAME)

  config.force && removeSync(uiDir)

  if (pathExistsSync(uiDir)) {
    logger.error(`component directory is existed`)
    return
  }
  const spinner = ora(`正在生成${uiName} ...`).start()

  try {
    const name = GEN_CONST.COMPONENT_FILE_NAME.replace(/\{name\}/g, uiName)
    await Promise.all([
      ensureDir(testsDir),
      outputFile(resolve(docsDir, 'zh-CN.md'), ''),
      outputFile(resolve(uiDir, GEN_CONST.ENTRY_FILE), tsxTemplate), // 生成 index.tsx
      outputFile(resolve(uiDir, GEN_CONST.PROPS_FILE_NAME), propsTemplate), // props.ts

      outputFile(resolve(styleDir, GEN_CONST.STYLE_FILE_NAME), styleTemplate), // 生成 style
      outputFile(resolve(styleDir, GEN_CONST.ENTRY_FILE), styleEntryTemplate), // 生成 style
    ])
    spinner.succeed(logger.success(`创建 ${name} 成功`, false))
  } catch (error) {
    spinner.fail(logger.error(`创建失败`, false))
  }
}
