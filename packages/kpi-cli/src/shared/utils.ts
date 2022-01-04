import { readFileSync } from 'fs'
import { ensureFileSync, outputFileSync } from 'fs-extra'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export function outputFileOnChangeSync(path: string, code: string) {
  ensureFileSync(path)
  const content = readFileSync(path, 'utf-8')
  if (code !== content) outputFileSync(path, code)
}

const upperCase = (str: string) => str.toUpperCase()
export function camelCase(name: string, pascal = false) {
  const normalized = name
    .replace(/(?<=[-_\s])(\w)/g, upperCase) /* 转换成大写 */
    .replace(/[-_\s]/g, '') /* 去除额外的符号 */
  return pascal ? normalized.replace(/^\w/g, upperCase) : normalized
}

// 获取环境变量
export function getEnvConstant() {
  const env = {
    REACT_APP_SITE_NAME: 'KPI_UI_SITE',
  }
  return {
    env,
    str: Object.entries(env).reduce((result, [key, value]) => {
      return { ...result, [key]: JSON.stringify(value) }
    }, {}),
  }
}

interface GetStyleLoaderOptions {
  module: boolean
  sass: boolean
  useTailwind: boolean
  mode: 'development' | 'production'
}
export function getStyleLoader(options: GetStyleLoaderOptions) {
  const { module, sass, useTailwind, mode } = options
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  return [
    // dev 环境需要 prod 环境下 直接抽离成 css file
    isDev && require.resolve('style-loader'),
    isProd && require.resolve(MiniCssExtractPlugin.loader),
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: module,
        importLoaders: sass ? 3 : 2, // 前面还有多少个 loader 需要执行
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            useTailwind && require.resolve('tailwindcss'),
            require.resolve('postcss-preset-env'),
            !useTailwind && require.resolve('postcss-normalize'),
          ].filter(Boolean),
        },
      },
    },
    sass && require.resolve('sass-loader'),
    require.resolve('thread-loader'),
  ].filter(Boolean)
}
