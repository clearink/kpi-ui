const { ensureFileSync, realpathSync, writeFileSync, copyFileSync } = require('fs-extra')
const { resolve, relative, dirname } = require('path')
const { transformFileAsync } = require('@babel/core')
const { compileAsync } = require('sass')
const glob = require('glob')

const browserslistEnv = resolve(__dirname, '../.browserslistrc')

const cwd = realpathSync(process.cwd())
const resolveApp = (...relativePath) => resolve(cwd, ...relativePath)

function getOutputFilePath(root, target, origin, relativePath) {
  return resolve(root, target, relative(origin, relativePath))
}

function getBabelConfig(useEsm = false) {
  return {
    comments: false,
    configFile: false,
    presets: [
      [
        '@babel/preset-env',
        {
          browserslistEnv,
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

function getCodeFiles(packagePath) {
  return glob.sync('./src/**/*.ts{,x}', {
    cwd: packagePath,
    // 忽略类型声明与样式文件
    ignore: ['./src/**/*(types|props|interface).ts', './src/style/*'],
  })
}

function getStyleFiles(packagePath) {
  // 只获取 index.s[ac]ss 文件
  return glob.sync('./src/**/index.s[ac]ss', {
    cwd: packagePath,
    // 忽略 style 下的其他文件
    ignore: ['./src/**/!(style)/*.s[ac]ss'],
  })
}

function safeOutputFile(filePath, fileData) {
  ensureFileSync(filePath)
  writeFileSync(filePath, fileData, { encoding: 'utf-8' })
}

function safeCopyFile(source, target) {
  ensureFileSync(target)
  copyFileSync(source, target)
}

function copySourceStyle(sourceDir) {
  const sourceList = glob.sync('./**/*.s[ac]ss', { cwd: sourceDir })
  return (targetDir) => {
    sourceList.forEach((file) => {
      const sourceFullPath = resolve(sourceDir, file)
      const targetFullPath = resolve(targetDir, file)
      safeCopyFile(sourceFullPath, targetFullPath)
    })
  }
}

function compileCode(fileList, packagePath, config) {
  const promises = fileList.map((file) => {
    const fullPath = resolve(packagePath, file)
    return transformFileAsync(fullPath, config)
  })
  return Promise.all(promises)
}

function compileCodeToEsm(fileList, packagePath) {
  const getFilePath = getOutputFilePath.bind(null, packagePath, 'esm', 'src')

  compileCode(fileList, packagePath, getBabelConfig(true)).then((outputList) => {
    outputList.forEach((output, i) => {
      const ouputFilePath = getFilePath(fileList[i]).replace(/\.tsx?$/g, '.js')
      safeOutputFile(ouputFilePath, output?.code)
    })
  })
}

function compileCodeToCjs(fileList, packagePath) {
  const getFilePath = getOutputFilePath.bind(null, packagePath, 'lib', 'src')

  compileCode(fileList, packagePath, getBabelConfig(false)).then((outputList) => {
    outputList.forEach((output, i) => {
      const ouputFilePath = getFilePath(fileList[i]).replace(/\.tsx?$/g, '.js')
      safeOutputFile(ouputFilePath, output?.code)
    })
  })
}

function compileStyle(fileList, packagePath) {
  const getEsmFilePath = getOutputFilePath.bind(null, packagePath, 'esm', 'src')
  const getCjsFilePath = getOutputFilePath.bind(null, packagePath, 'lib', 'src')

  const promises = fileList.map((file) => {
    const fullPath = resolve(packagePath, file)
    return compileAsync(fullPath, { style: 'expanded' })
  })

  Promise.all(promises).then((outputList) => {
    outputList.forEach((output, i) => {
      const relativePath = fileList[i]
      const ouputEsmFile = getEsmFilePath(relativePath).replace(/\.s[ac]ss$/g, '.css')
      const ouputCjsFile = getCjsFilePath(relativePath).replace(/\.s[ac]ss$/g, '.css')

      safeOutputFile(ouputEsmFile, output?.css)
      safeOutputFile(ouputCjsFile, output?.css)

      // copy 原始的 .scss 文件
      const originSourceDir = dirname(resolve(packagePath, relativePath))
      const esmSourceDir = dirname(ouputEsmFile)
      const cjsSourceDir = dirname(ouputCjsFile)

      const handlerCopyFile = copySourceStyle(originSourceDir)

      handlerCopyFile(esmSourceDir)
      handlerCopyFile(cjsSourceDir)

      //  复制 outputFilePath 文件为 css.js
      const esmText = `import '../../style/index.css';\nimport './index.css';`
      safeOutputFile(resolve(esmSourceDir, 'css.js'), esmText)

      const cjsText = `require('../../style/index.css');\nrequire('./index.css');`
      safeOutputFile(resolve(cjsSourceDir, 'css.js'), cjsText)
    })
  })
}

module.exports = {
  resolveApp,
  getCodeFiles,
  getStyleFiles,
  compileCodeToEsm,
  compileCodeToCjs,
  compileStyle,
}
