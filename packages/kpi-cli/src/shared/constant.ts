import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}

export const CWD = realpathSync(process.cwd()) // 当前运行环境

// gen command constant
export const GEN_CONST = (() => {
  const constant = {
    KPI_CONFIG: resolveApp('kpi.config.js'),
    TEST_DIR_NAME: '__tests__',
    DOCS_DIR_NAME: 'docs',
    PROPS_DIR_NAME: 'props',
    COMPONENT_FILE_NAME: '{name}.tsx',
    STYLE_FILE_NAME: 'style.scss',
  }
  return Object.assign(constant, {
    PROPS_FILE_NAME: `${constant.PROPS_DIR_NAME}.ts`,
  })
})()

// dev command constant
export const KPI_CONST = (() => {
  const constant = {
    APP_DIR: resolveApp('.'),
    SRC_DIR: resolveApp('src'),
    PUBLIC_DIR: resolveApp('public'),
    OUTPUT_PATH: resolveApp('dist'),
    RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
    STYLE_EXTENSIONS: ['.scss', '.sass', '.css'],
    PUBLIC_PATH: '/', //待优化
    WEBPACK_CACHE_DIR: resolveApp('node_modules/.cache'),
    TS_CONFIG: resolve(CWD, 'tsconfig.json'),
    JS_CONFIG: resolve(CWD, 'jsconfig.json'),
    NODE_MODULES: resolveApp('node_modules'), // 待优化
  }
  return Object.assign(constant, {
    CACHE_VERSION: require('../../package.json').version, //待优化
    PUBLIC_HTML_FILE: resolve(constant.PUBLIC_DIR, 'index.html'),
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

    HAS_JSX_RUNTIME: () => {
      try {
        require.resolve('react/jsx-runtime')
        return true
      } catch {
        return false
      }
    },
  })
})()
