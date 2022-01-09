import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}

export const CWD = realpathSync(process.cwd()) // 当前运行环境

// kpi config constant
export default function KPI_CONST(mode: 'development' | 'production') {
  const isDev = mode === 'development'
  const constant = {
    // other
    KPI_CONFIG: resolveApp('kpi.config.js'),
    CACHE_VERSION: require('../../package.json').version, // 待优化

    // common 没有变化的
    APP_DIR: resolveApp('.'),
    RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
    STYLE_EXTENSIONS: ['.scss', '.sass', '.css'],
    WEBPACK_CACHE_DIR: resolveApp('node_modules/.cache'),
    NODE_MODULES: resolveApp('node_modules'), // 待优化
    OUTPUT_PATH: resolveApp('dist'),
    PUBLIC_PATH: '/', //待优化
    SRC_DIR: resolveApp('src'),
    DEV_SRC_DIR: isDev && resolveApp('.kpi/src'),

    // gen
    TEST_DIR_NAME: '__tests__',
    DOCS_DIR_NAME: 'docs',
    PROPS_DIR_NAME: 'props',
    COMPONENT_FILE_NAME: '{name}.tsx',
    STYLE_FILE_NAME: 'style.scss',

    // change

    PUBLIC_DIR: isDev ? resolveApp('.kpi/public') : resolveApp('public'), // dev 和 build 不同

    // build
    CJS_DIR_NAME: 'lib',
    ESM_DIR_NAME: 'esm',
    TYPE_DIR_NAME: 'types',
  }
  const { APP_DIR, SRC_DIR, RESOLVE_EXTENSIONS } = constant

  const TS_CONFIG = isDev
    ? resolve(APP_DIR, '.kpi', 'tsconfig.json')
    : resolve(APP_DIR, 'tsconfig.json')
  const JS_CONFIG = resolve(APP_DIR, 'jsconfig.json')
  return Object.assign(constant, {
    // common
    JS_CONFIG,
    TS_CONFIG,
    PUBLIC_HTML_FILE: resolve(constant.PUBLIC_DIR, 'index.html'),
    ESLINT_CACHE_DIR: resolve(constant.WEBPACK_CACHE_DIR, '.eslint'),

    // gen
    PROPS_FILE_NAME: `${constant.PROPS_DIR_NAME}.ts`,

    FIND_ENTRY_FILE: () => {
      const dir = isDev ? resolveApp('.kpi/src') : SRC_DIR
      const extension =
        RESOLVE_EXTENSIONS.find((ext) => {
          return existsSync(resolve(dir, `index${ext}`))
        }) ?? '.js'
      return resolve(dir, `index${extension}`)
    },
    FIND_TSCONFIG: () => {
      const list = [TS_CONFIG, JS_CONFIG]
      return list.filter((f) => pathExistsSync(f))
    },
    USE_TAILWIND: () => pathExistsSync(resolveApp('tailwind.config.js')),
    USE_TYPESCRIPT: () => pathExistsSync(TS_CONFIG),

    HAS_JSX_RUNTIME: () => {
      try {
        require.resolve('react/jsx-runtime')
        return true
      } catch {
        return false
      }
    },
  })
}
