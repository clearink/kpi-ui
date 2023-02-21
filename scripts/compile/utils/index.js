const {
  existsSync,
  removeSync,
  realpathSync,
  ensureFileSync,
  writeFileSync,
  copyFileSync,
} = require('fs-extra')
const { resolve, relative, extname } = require('path')

const cwd = realpathSync(process.cwd())
const resolveApp = (...relativePath) => resolve(cwd, ...relativePath)

function getOutputPath(root, target, origin, relativePath) {
  return resolve(root, target, relative(origin, relativePath))
}

function replaceExtname(path, ext) {
  const oldExt = extname(path)
  const reg = new RegExp(`${oldExt}$`, 'g')
  return path.replace(reg, ext)
}

function removeFile(packagePath, dir, path) {
  let sourcePath = getOutputPath(packagePath, dir, 'src', path)
  sourcePath = replaceExtname(sourcePath, '.js')

  if (existsSync(sourcePath)) removeSync(sourcePath)
}

function safeWriteFile(path, data) {
  ensureFileSync(path)
  writeFileSync(path, data, { encoding: 'utf-8' })
}

function safeCopyFile(source, target) {
  ensureFileSync(target)
  copyFileSync(source, target)
}

module.exports = {
  resolveApp,
  removeFile,
  getOutputPath,
  replaceExtname,
  safeWriteFile,
  safeCopyFile,
}
