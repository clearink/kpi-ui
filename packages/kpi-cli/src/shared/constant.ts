import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'
import { Constant } from './_utils'

export const CWD = realpathSync(process.cwd()) // 当前运行环境

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}

// kpi config constant
export default function KPI_CONST(mode: 'development' | 'production') {
  const isDev = mode === 'development'
  return new Constant()
    .add(() => ({
      // other
      KPI_CONFIG: resolveApp('kpi.config.js'),
      CACHE_VERSION: require('../../package.json').version, // 待优化
      APP_DIR: resolveApp('.'),
      RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
      STYLE_EXTENSIONS: ['.scss', '.sass', '.css'],
      ESLINT_CACHE_DIR: resolveApp('node_modules/.cache/.eslint'),
      JS_CONFIG: resolve('jsconfig.json'),
      NODE_MODULES: resolveApp('node_modules'), // 待优化
      OUTPUT_PATH: resolveApp('dist'),
      PUBLIC_PATH: '/', //待优化
      SRC_DIR: resolveApp('src'),
      DEV_DIR: resolveApp('.kpi'), // dev 模板路径

      // gen
      TEST_DIR_NAME: '__tests__',
      DOCS_DIR_NAME: 'docs',
      PROPS_DIR_NAME: 'props',
      STYLE_DIR_NAME: 'style',
      STYLE_FILE_NAME: 'index.scss',
      ENTRY_FILE: 'index.tsx',
      COMPONENT_FILE_NAME: '{name}.tsx',

      // build
      CJS_DIR_NAME: 'lib',
      ESM_DIR_NAME: 'esm',
      TYPE_DIR_NAME: 'types',
    }))
    .add((_) => ({
      // gen
      PROPS_FILE_NAME: `${_.PROPS_DIR_NAME}.ts`,
      DEV_SRC_DIR: isDev && resolve(_.DEV_DIR, 'src'),
      // dev 和 build 不同
      PUBLIC_DIR: isDev ? resolve(_.DEV_DIR, 'public') : resolveApp('public'),
      TS_CONFIG: isDev ? resolve(_.DEV_DIR, 'tsconfig.json') : resolve(_.APP_DIR, 'tsconfig.json'),
    }))
    .add((_) => ({
      PUBLIC_HTML_FILE: resolve(_.PUBLIC_DIR, 'index.html'),
      FIND_ENTRY_FILE: () => {
        const dir = _.DEV_SRC_DIR || _.SRC_DIR
        const extension = _.RESOLVE_EXTENSIONS.find((ext) => {
          return existsSync(resolve(dir, `index${ext}`))
        })
        return resolve(dir, `index${extension ?? '.js'}`)
      },
      FIND_TSCONFIG: () => {
        const list = [_.TS_CONFIG, _.JS_CONFIG]
        return list.filter((file) => pathExistsSync(file))
      },
      USE_TAILWIND: () => pathExistsSync(resolveApp('tailwind.config.js')),
      USE_TYPESCRIPT: () => pathExistsSync(_.TS_CONFIG),
      HAS_JSX_RUNTIME: () => {
        try {
          require.resolve('react/jsx-runtime')
          return true
        } catch {
          return false
        }
      },
    }))
}
