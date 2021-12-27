import { outputFile, pathExistsSync } from 'fs-extra'
import ora from 'ora'
import { resolve } from 'path'
import getKpiConfig from '../config/kpi.config'
import {
  DOCS_DIR_NAME,
  EXAMPLE_DIR_NAME,
  EXAMPLE_LOCALE_DIR_NAME,
  SRC_DIR,
  STYLE_DIR_NAME,
  TESTS_DIR_NAME,
} from '../shared/constant'
import logger from '../shared/logger'
import { camelCase } from '../shared/utils'

const config = getKpiConfig()

const { prefix } = config
export default async function create(name: string) {

  const uiName = camelCase(name, true)

  const tsxTemplate = `\
import styles from './style.module.scss';

function ${uiName}(props: any){
  return (
    <div className="${prefix}_${name}">
      ${name}
    </div>
  )
export default ${uiName}
}
  `
  const styleTemplate = `\
  .${prefix}_${name}{

  }
  `
  const indexTemplate = `\
  export { default as ${uiName} } from './${uiName}';
  `
  const propsTemplate = `\
export interface ${uiName}Props{
  
}
  `
  const testsTemplate = `\
  
  `

  const uiDir = resolve(SRC_DIR, name)
  const testsDir = resolve(SRC_DIR, TESTS_DIR_NAME)
  const styleDir = resolve(SRC_DIR, STYLE_DIR_NAME)
  const exampleDir = resolve(SRC_DIR, EXAMPLE_DIR_NAME)
  const exampleLocalDir = resolve(SRC_DIR, EXAMPLE_LOCALE_DIR_NAME)
  const docsDir = resolve(SRC_DIR, DOCS_DIR_NAME)

  if (pathExistsSync(uiDir)) {
    logger.error(`component directory is existed`)
    return
  }
  const spinner = ora(`正在生成${uiName} ...`).start()
  try {
    await Promise.all([
      outputFile(resolve(uiDir, `${uiName}.tsx`), tsxTemplate), // 生成 button.tsx
      outputFile(resolve(uiDir, `index.tsx`), indexTemplate), // 生成 index.ts
      outputFile(resolve(styleDir, `style.module.scss`), styleTemplate), // 生成 style
      outputFile(resolve(uiDir, `props.ts`), propsTemplate), // props.ts
    ])
    spinner.succeed(logger.success(`创建 ${name} 成功`, false))
  } catch (error) {
    spinner.fail(logger.error(`创建失败`, false))
  }
}
