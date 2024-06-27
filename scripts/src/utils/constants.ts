import path from 'path'
import fse from 'fs-extra'
import { fileURLToPath } from 'url'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}

export default new Constant()
  .add(() => ({
    root: path.resolve(__dirname, '../../'),
    cwd: fse.realpathSync(process.cwd()),
  }))
  .add((instance) => ({
    resolveCwd: path.resolve.bind(null, instance.cwd),
    resolveRoot: path.resolve.bind(null, instance.root),
  }))
  .add((instance) => ({
    esm: instance.resolveCwd('./esm'),
    cjs: instance.resolveCwd('./lib'),
    umd: instance.resolveCwd('./dist'),
    components: instance.resolveRoot('packages', 'kpi-components'),
    utils: instance.resolveRoot('packages', 'kpi-utils'),
    icons: instance.resolveRoot('packages', 'kpi-icons'),
    types: instance.resolveRoot('packages', 'kpi-types'),
    validator: instance.resolveRoot('packages', 'kpi-validator'),
  }))
  .add((instance) => ({
    resolveComps: path.resolve.bind(null, instance.components),
    resolveUtils: path.resolve.bind(null, instance.utils),
  }))
  .add(() => ({
    jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    cssExtensions: ['.scss', '.sass', '.css'],
  }))
  .add((instance) => ({
    getExternal: async () => {
      const pkg = await fse.readJson(instance.resolveCwd('./package.json'))

      return ([/node_modules/] as any[])
        .concat(Object.keys(pkg.dependencies), Object.keys(pkg.peerDependencies))
        .filter(Boolean)
    },
    clean: (...files: string[]) => Promise.all(files.map((file) => fse.remove(file))),
  }))
