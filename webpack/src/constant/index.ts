import { resolve } from 'path'
import { copy, existsSync, pathExistsSync, realpathSync } from 'fs-extra'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}

const CWD = realpathSync(process.cwd()) // 当前运行环境

function resolveApp(relativePath: string) {
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

    KPI_VERSION: () => {
      const configPath = resolve(__dirname, '../../package.json')
      const vsesion = '0.0.1'
      try {
        return require(configPath).version || vsesion
      } catch (error) {
        return vsesion
      }
    },

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
    PREVIEW_DIR: resolveApp('site'),
    MD_LOADER: resolve(__dirname, '../loaders/md_loader.js'),
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
      const ts = _.USE_TYPESCRIPT()
      return _.FILE_EXTENSIONS.filter((ext) => {
        return ts || !ext.includes('ts')
      })
    },
    SHOULD_COPY_DEFAULT_TEMPLATE: async () => {
      if (existsSync(_.PREVIEW_DIR)) return

      const dir = resolve(__dirname, '../../site')
      await copy(dir, _.PREVIEW_DIR)
    },
  }))
  .add((_) => ({
    RESOLVE_ALIAS: () => ({ '@kpi/ui': _.SRC_DIR }),
    BABEL_LOADER_OPTIONS: (isDev: boolean) => {
      return {
        presets: [
          require.resolve('@babel/preset-env'),
          [
            require.resolve('@babel/preset-react'),
            {
              runtime: _.JSX_RUNTIME(),
            },
          ],
          _.USE_TYPESCRIPT() && require.resolve('@babel/preset-typescript'),
        ].filter(Boolean),
        plugins: [
          require.resolve('@babel/plugin-transform-runtime'),
          require.resolve('@babel/plugin-proposal-class-properties'),
          [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
          isDev && require.resolve('react-refresh/babel'),
        ].filter(Boolean),
        cacheDirectory: true,
        cacheCompression: false,
        compact: !isDev,
      }
    },
  }))

export type ConstantType = typeof KPI_CONST

export default KPI_CONST
