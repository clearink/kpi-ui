import { resolve } from 'path'
import { realpathSync } from 'fs-extra'

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}
export const CWD = realpathSync(process.cwd()) // 当前运行环境
// gen command constant
export const GEN_CONST = (() => {
  const constant = {
    SRC_DIR: resolveApp('src'), // 文件入口
    KPI_CONFIG: resolveApp('kpi.config.js'),
    TEST_DIR_NAME: '__tests__',
    DOCS_DIR_NAME: 'docs',
    COMPONENT_FILE_NAME: '{name}.tsx',
    INDEX_FILE_NAME: 'index.tsx',
    STYLE_FILE_NAME: 'style.scss',
    PROPS_FILE_NAME: (extension: boolean) => `props${extension ? '.ts' : ''}`,
  }
  return constant
})()
