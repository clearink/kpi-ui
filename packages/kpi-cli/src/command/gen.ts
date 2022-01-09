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
import './style.scss'
import { ${uiName}Props } from './${GEN_CONST.PROPS_DIR_NAME}'

function ${uiName}(props: ${uiName}Props) {
  return <div className="${name}">${name}</div>
}
export default ${uiName}
  `
  const propsTemplate = `\
export interface ${uiName}Props{

}
  `
  const uiDir = resolve(GEN_CONST.SRC_DIR, name)
  const testsDir = resolve(uiDir, GEN_CONST.TEST_DIR_NAME)
  const docsDir = resolve(uiDir, GEN_CONST.DOCS_DIR_NAME)

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
      outputFile(resolve(docsDir, 'zh-CN.md'), ''), // 生成 button.tsx
      outputFile(resolve(uiDir, name), tsxTemplate), // 生成 button.tsx
      outputFile(resolve(uiDir, GEN_CONST.STYLE_FILE_NAME), ''), // 生成 style
      outputFile(resolve(uiDir, GEN_CONST.PROPS_FILE_NAME), propsTemplate), // props.ts
    ])
    spinner.succeed(logger.success(`创建 ${name} 成功`, false))
  } catch (error) {
    spinner.fail(logger.error(`创建失败`, false))
  }
}
