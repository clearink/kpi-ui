const {
  resolveApp,
  getCodeFiles,
  getStyleFiles,
  compileCodeToEsm,
  compileCodeToCjs,
  compileStyle,
} = require('./utils')

const packagePath = resolveApp('.')
const codeFileList = getCodeFiles(packagePath)
const styleFileList = getStyleFiles(packagePath)

compileCodeToEsm(codeFileList, packagePath)
compileCodeToCjs(codeFileList, packagePath)
compileStyle(styleFileList, packagePath)
