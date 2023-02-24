const { resolve, dirname } = require('path')
const processor = require('postcss')(require('autoprefixer'))
const { compileAsync } = require('sass')
const { existsSync, readFileSync } = require('fs-extra')
const { removeFile, getOutputPath, replaceExtname, safeWriteFile, safeCopyFile } = require('.')

function generateImportCssFile(path) {
  const entry = path.replace(/\.css$/g, '.js')

  if (!existsSync(entry)) return

  const raw = readFileSync(entry, { encoding: 'utf-8' })
  const outputPath = resolve(dirname(path), './css.js')
  safeWriteFile(outputPath, raw.replace(/\.s[ac]ss/g, '.css'))
}

function compileStyle(packagePath, dir, path) {
  let outputPath = getOutputPath(packagePath, dir, 'src', path)
  outputPath = replaceExtname(outputPath, '.css')

  const sourcePath = resolve(packagePath, path)

  compileAsync(sourcePath, { style: 'expanded' })
    .then(({ css }) => processor.process(css, { from: sourcePath }))
    .then(({ css }) => safeWriteFile(outputPath, css))
    .then(() => generateImportCssFile(outputPath))
    .catch((error) => console.error(error.message))
}

module.exports = {
  compileStyle: function (watch, packagePath, watcher) {
    watcher.on('add', compileStyle.bind(null, packagePath, 'esm'))
    watcher.on('change', compileStyle.bind(null, packagePath, 'esm'))
    watcher.on('unlink', removeFile.bind(null, packagePath, 'esm'))

    if (!watch) {
      watcher.on('ready', () => watcher.close())
      watcher.on('add', compileStyle.bind(null, packagePath, 'lib'))
      watcher.on('change', compileStyle.bind(null, packagePath, 'lib'))
      watcher.on('unlink', removeFile.bind(null, packagePath, 'lib'))
    }
  },
  copyScssFile: function (watch, packagePath, watcher) {
    const copySource = (dir, path) => {
      const sourcePath = resolve(packagePath, path)
      const targetPath = getOutputPath(packagePath, dir, 'src', path)
      safeCopyFile(sourcePath, targetPath)
    }
    watcher.on('add', copySource.bind(null, 'esm'))
    watcher.on('change', copySource.bind(null, 'esm'))
    watcher.on('unlink', removeFile.bind(null, 'esm'))

    if (!watch) {
      watcher.on('ready', () => watcher.close())
      watcher.on('add', copySource.bind(null, 'lib'))
      watcher.on('change', copySource.bind(null, 'lib'))
      watcher.on('unlink', removeFile.bind(null, 'lib'))
    }
  },
}
