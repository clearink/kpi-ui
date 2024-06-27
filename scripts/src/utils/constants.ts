import path from 'path'
import fse from 'fs-extra'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}

export default new Constant()
  .add(() => ({
    root: path.resolve(__dirname, '..', '..'),
    cwd: fse.realpathSync(process.cwd()),
  }))
  .add(() => ({
    jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    cssExtensions: ['.scss', '.sass', '.css'],
  }))
  .add((instance) => ({
    resolveCwd: path.resolve.bind(null, instance.cwd),
    resolveRoot: path.resolve.bind(null, instance.root),
  }))
  .add((instance) => ({
    componentsDir: instance.resolveRoot('packages', 'kpi-components'),
    utilsDir: instance.resolveRoot('packages', 'kpi-utils'),
    iconsDir: instance.resolveRoot('packages', 'kpi-icons'),
    typesDir: instance.resolveRoot('packages', 'kpi-types'),
    validatorDir: instance.resolveRoot('packages', 'kpi-validator'),
  }))
  .add((instance) => ({
    resolveComponents: path.resolve.bind(null, instance.componentsDir),
    resolveUtils: path.resolve.bind(null, instance.utilsDir),
  }))
  .add((instance) => ({
    // output
    outputEsmDir: instance.resolveCwd('./esm'),
    outputCjsDir: instance.resolveCwd('./lib'),
    outputUmdDir: instance.resolveCwd('./dist'),
  }))
  .add(() => ({
    uiUmdName: 'kpi-ui',
    iconsUmdName: '@kpi-ui/icons',
    validatorUmdName: '@kpi-ui/validator',
  }))
