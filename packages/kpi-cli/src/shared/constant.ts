import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'
import { Constant } from './_utils'

export const CWD = realpathSync(process.cwd()) // 当前运行环境

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}

// kpi config constant
const KPI_CONST = new Constant()
  .add(() => ({
    // common
    FILE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
    STYLE_EXTENSIONS: ['.scss', '.sass', '.css'],
    NODE_MODULES: resolveApp('node_modules'), // 待优化
    APP_DIR: resolveApp('.'),
    SRC_DIR: resolveApp('src'),
    OUTPUT_PATH: resolveApp('dist'),
    TS_CONFIG: resolveApp('tsconfig.json'),
    KPI_CONFIG: resolveApp('kpi.config.js'),

    // gen
    TEST_DIR_NAME: '__tests__',
    DOCS_DIR_NAME: 'docs',
    PROPS_DIR_NAME: 'props',
    STYLE_DIR_NAME: 'style',
    STYLE_FILE_NAME: 'index.scss',
    GEN_ENTRY_FILE: 'index.tsx',
    COMPONENT_FILE_NAME: '{name}.tsx',

    // build
    CJS_DIR_NAME: 'lib',
    ESM_DIR_NAME: 'esm',
    TYPE_DIR_NAME: 'types',

    // preview
    PREVIEW_DIR: resolveApp('_kpi'),
    PREVIEW_TEMPLATE_DIR: resolve(__dirname, '../../site'),
  }))
  .add((_) => ({
    ESLINT_CACHE: resolve(_.NODE_MODULES, '.cache/.eslintcache'),
    PROPS_FILE_NAME: `${_.PROPS_DIR_NAME}.ts`, // gen
  }))
  .add((_) => ({
    // preview  constant
    PREVIEW_SRC_DIR: resolve(_.PREVIEW_DIR, 'src'),
    PREVIEW_PUBLIC_DIR: resolve(_.PREVIEW_DIR, 'public'),
  }))
  .add((_) => ({
    // html 模板文件
    TEMPLATE_HTML_FILE: resolve(_.PREVIEW_PUBLIC_DIR, 'index.html'),
    ENTRY_FILE: (preview: boolean) => {
      const dir = preview ? _.PREVIEW_SRC_DIR : _.SRC_DIR
      const extension = _.FILE_EXTENSIONS.find((ext) => {
        return existsSync(resolve(dir, `index${ext}`))
      })
      return resolve(dir, `index${extension ?? '.js'}`)
    },
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
  .add((_) => ({
    JSX_RUNTIME: () => {
      return _.HAS_JSX_RUNTIME() ? 'automatic' : 'classic'
    },
    JSX_ESLINT_RULE: () => {
      if (_.HAS_JSX_RUNTIME()) return undefined
      return { 'react/react-in-jsx-scope': 'error' } as const
    },
    RESOLVE_EXTENSIONS: () => {
      const useTs = _.USE_TYPESCRIPT()
      return _.FILE_EXTENSIONS.filter((ext) => {
        return useTs || !ext.includes('ts')
      })
    },
  }))

export type ConstantType = typeof KPI_CONST

export default KPI_CONST
