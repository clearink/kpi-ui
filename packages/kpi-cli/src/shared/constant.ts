import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'

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

// dev command constant
export const DEV_CONST = (() => {
  const constant = {
    APP_DIR: resolveApp('.'),
    SRC_DIR: resolveApp('src'),
    PUBLIC_DIR: resolveApp('public'),
    OUTPUT_PATH: resolveApp('dist'),
    RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
    PUBLIC_PATH: '/', //待优化
    WEBPACK_CACHE_DIR: resolveApp('node_modules/.cache'),
    TS_CONFIG: resolve(CWD, 'tsconfig.json'),
    JS_CONFIG: resolve(CWD, 'jsconfig.json'),
    NODE_MODULES: resolveApp('node_modules'), // 待优化
  }
  return Object.assign(constant, {
    CACHE_VERSION: require('../../package.json').version, //待优化
    PUBLIC_HTML_FILE: resolve(constant.PUBLIC_DIR, 'index.html'),
    PUBLIC_FILES: `${constant.PUBLIC_DIR}/*`,
    ESLINT_CACHE_DIR: resolve(constant.WEBPACK_CACHE_DIR, '.eslint'),
    FIND_ENTRY_FILE: () => {
      const extension =
        constant.RESOLVE_EXTENSIONS.find((ext) =>
          existsSync(resolve(constant.SRC_DIR, `index${ext}`))
        ) ?? '.js'
      return resolve(constant.SRC_DIR, `index${extension}`)
    },
    FIND_TSCONFIG: () => {
      const list = [constant.TS_CONFIG, constant.JS_CONFIG]
      return list.filter((f) => pathExistsSync(f))
    },
    USE_TAILWIND: () => pathExistsSync(resolveApp('tailwind.config.js')),
    USE_TYPESCRIPT: () => pathExistsSync(constant.TS_CONFIG),
  })
})()
