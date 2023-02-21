const { resolve } = require('path')
const { transformFileAsync } = require('@babel/core')
const { removeFile, getOutputPath, replaceExtname, safeWriteFile } = require('./index')

const browserslistConfigFile = resolve(__dirname, '../../../.browserslistrc')
/**
 * @param {boolean} useEsm
 * @returns object
 */
function getBabelConfig(useEsm) {
  return {
    comments: false,
    configFile: false,
    browserslistConfigFile,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: useEsm ? false : undefined,
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-transform-runtime'],
    assumptions: {
      constantReexports: true,
      ignoreFunctionLength: true,
      setSpreadProperties: true,
      constantSuper: true,
      setClassMethods: true,
      skipForOfIteratorClosing: true,
      superIsCallableConstructor: true,
    },
  }
}

/** 使用babel 编译 ts 文件 */
function compileCode(config, packagePath, dir, path) {
  const sourcePath = resolve(packagePath, path)

  transformFileAsync(sourcePath, config).then((output) => {
    let outputPath = getOutputPath(packagePath, dir, 'src', path)
    outputPath = replaceExtname(outputPath, '.js')

    safeWriteFile(outputPath, output.code)
  })
}

const compileCodeToEsm = compileCode.bind(null, getBabelConfig(true))
const compileCodeToCjs = compileCode.bind(null, getBabelConfig(false))

module.exports = function (watch, packagePath, watcher) {
  watcher.on('add', compileCodeToEsm.bind(null, packagePath, 'esm'))
  watcher.on('change', compileCodeToEsm.bind(null, packagePath, 'esm'))
  watcher.on('unlink', removeFile.bind(null, packagePath, 'esm'))

  if (!watch) {
    watcher.on('ready', () => watcher.close())
    watcher.on('add', compileCodeToCjs.bind(null, packagePath, 'lib'))
    watcher.on('change', compileCodeToCjs.bind(null, packagePath, 'lib'))
    watcher.on('unlink', removeFile.bind(null, packagePath, 'lib'))
  }
}
