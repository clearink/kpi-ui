import { resolve } from 'path'
import { existsSync, pathExistsSync, realpathSync } from 'fs-extra'
import { Constant } from './_utils'

export const CWD = realpathSync(process.cwd()) // 当前运行环境

export function resolveApp(relativePath: string) {
  return resolve(CWD, relativePath)
}

export type ConstantType = ReturnType<typeof KPI_CONST>

// kpi config constant
export default function KPI_CONST(preview: boolean) {
  return new Constant()
    .add(() => ({
      // other
      FILE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'], // 待优化
      STYLE_EXTENSIONS: ['.scss', '.sass', '.css'],
      NODE_MODULES: resolveApp('node_modules'), // 待优化
      PUBLIC_PATH: '/', //待优化
      APP_DIR: resolveApp('.'),
      SRC_DIR: resolveApp('src'),
      OUTPUT_PATH: resolveApp('dist'),
      PUBLIC_DIR: resolveApp('public'),
      TS_CONFIG: resolveApp('tsconfig.json'),
      JS_CONFIG: resolveApp('jsconfig.json'),
      KPI_CONFIG: resolveApp('kpi.config.js'),

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
      ESLINT_CACHE_DIR: resolve(_.NODE_MODULES, '.cache/eslint'),
      PROPS_FILE_NAME: `${_.PROPS_DIR_NAME}.ts`, // gen
      // preview  constant
      PREVIEW_DIR: resolveApp('.kpi'),
    }))
    .add((_) => ({
      // preview  constant
      PREVIEW_SRC_DIR: resolve(_.PREVIEW_DIR, 'src'),
      PREVIEW_PUBLIC_DIR: resolve(_.PREVIEW_DIR, 'public'),
    }))
    .add((_) => ({
      // html 模板文件
      TEMPLATE_HTML_FILE: () => {
        const dir = preview ? _.PREVIEW_PUBLIC_DIR : _.PUBLIC_DIR
        return resolve(dir, 'index.html')
      },
      ENTRY_FILE: () => {
        const dir = preview ? _.PREVIEW_SRC_DIR : _.SRC_DIR
        const extension = _.FILE_EXTENSIONS.find((ext) => {
          return existsSync(resolve(dir, `index${ext}`))
        })
        return resolve(dir, `index${extension ?? '.js'}`)
      },
      USE_TAILWIND: () => pathExistsSync(resolveApp('tailwind.config.js')),
      USE_TYPESCRIPT: () => pathExistsSync(_.TS_CONFIG),
      JSX_RUNTIME: () => {
        try {
          require.resolve('react/jsx-runtime')
          return 'automatic'
        } catch {
          return 'classic'
        }
      },
    }))
    .add((_) => ({
      RESOLVE_EXTENSIONS: () => {
        const useTs = _.USE_TYPESCRIPT()
        return _.FILE_EXTENSIONS.filter((ext) => {
          return useTs || !ext.includes('ts')
        })
      },
      HTML_PLUGIN_MINIFY: (dev: boolean) => {
        if (dev) return false
        return {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
      },
    }))
}
