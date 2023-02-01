const { ensureFileSync, realpathSync, writeFileSync } = require('fs-extra')
const { resolve, relative } = require('path')
const { transformFileAsync } = require('@babel/core')
const glob = require('glob')

/**
 * 该脚本的作用为
 * 1. 生成 esm
 * 2. 生成 lib
 * 3. 生成 types
 *  */
const cwd = realpathSync(process.cwd())
const resolveApp = (...relativePath) => resolve(cwd, ...relativePath)

const esm = {
  comments: false,
  configFile: false,
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}
const cjs = {
  comments: false,
  configFile: false,
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}

const list = glob.sync('./src/**/*.ts{,x}', {
  ignore: ['./src/**/*(types|props|interface).ts', './src/**/*props.ts'],
})

const esms = list.map((file) => transformFileAsync(resolveApp(file), esm))
const cjss = list.map((file) => transformFileAsync(resolveApp(file), cjs))

Promise.all(esms).then((outputs) => {
  outputs.map((output, i) => {
    const file = resolveApp('esm', relative('src', list[i])).replace(/\.tsx?$/g, '.js')
    ensureFileSync(file)
    writeFileSync(file, output.code, { encoding: 'utf-8' })
  })
})
Promise.all(cjss).then((outputs) => {
  outputs.map((output, i) => {
    const file = resolveApp('lib', relative('src', list[i])).replace(/\.tsx?$/g, '.js')
    ensureFileSync(file)
    writeFileSync(file, output?.code, { encoding: 'utf-8' })
  })
})
