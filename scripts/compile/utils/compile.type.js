const { spawnSync, spawn } = require('child_process')
const { resolve } = require('path')

module.exports = function compileType(packagePath, watch) {
  const args = [
    require.resolve('typescript/bin/tsc'),
    '--project',
    resolve(packagePath, './tsconfig.json'),
    '--noEmit',
    'false',
    '--removeComments',
    '--declaration',
    '--emitDeclarationOnly',
    watch && '--watch',
    '--declarationDir',
  ].filter(Boolean)

  if (watch) {
    spawn('node', args.concat(resolve(packagePath, 'esm')))
  } else {
    spawnSync('node', args.concat(resolve(packagePath, 'esm')))
    spawnSync('node', args.concat(resolve(packagePath, 'lib')))
  }
}
