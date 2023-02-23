const chokidar = require('chokidar')
const { resolveApp, removeCompileDist } = require('./utils')
const compileCode = require('./utils/compile.code')
const { compileStyle, copyScssFile } = require('./utils/compile.style')
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

const styleWatcher = chokidar.watch(['./src/**/index.s[ac]ss'], {
  cwd: packagePath,
  ignoreInitial: false,
  ignored: ['./src/style/!(index.s[ac]ss)'],
})

compileStyle(watch, packagePath, styleWatcher)

const scssWatcher = chokidar.watch(['./src/**/*.s[ac]ss'], {
  cwd: packagePath,
  ignoreInitial: false,
})
// 监听复制原始 scss 文件
copyScssFile(watch, packagePath, scssWatcher)

compileType(packagePath, watch)
