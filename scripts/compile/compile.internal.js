const chokidar = require('chokidar')
const { resolveApp, removeCompileDist } = require('./utils')
const compileCode = require('./utils/compile.code')
const compileType = require('./utils/compile.type')

const packagePath = resolveApp('.')

const watch = process.argv.slice(2).some((argv) => /^-{1,2}w(atch)?/g.test(argv))

!watch && removeCompileDist(packagePath, 'esm', 'lib')

const codeWatcher = chokidar.watch('./src/**/*.ts{,x}', {
  cwd: packagePath,
  ignoreInitial: false,
  ignored: ['./src/**/*(types|props|interface).ts', './src/style/*'],
})

compileCode(watch, packagePath, codeWatcher)

compileType(packagePath, watch)
