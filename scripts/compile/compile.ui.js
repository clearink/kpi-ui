const chokidar = require('chokidar')
const { resolveApp } = require('./utils')
const compileCode = require('./utils/compile.code')
const compileStyle = require('./utils/compile.style')

const packagePath = resolveApp('.')
const watch = process.argv.slice(2).some((argv) => /^-{1,2}w(atch)?/g.test(argv))

const codeWatcher = chokidar.watch('./src/**/*.ts{,x}', {
  cwd: packagePath,
  ignoreInitial: false,
  ignored: ['./src/**/*(types|props|interface).ts', './src/style/*'],
})

compileCode(watch, packagePath, codeWatcher)

const styleWatcher = chokidar.watch(['./src/**/index.s[ac]ss'], {
  cwd: packagePath,
  ignoreInitial: false,
  ignored: ['./src/style/!(index.s[ac]ss)'],
})

compileStyle(watch, packagePath, styleWatcher)
