const { resolveApp, getCodeFiles, compileCodeToEsm, compileCodeToCjs } = require('./utils')

const packagePath = resolveApp('.')
const codeFileList = getCodeFiles(packagePath)

compileCodeToEsm(codeFileList, packagePath)
compileCodeToCjs(codeFileList, packagePath)
