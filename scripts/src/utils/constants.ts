import path from 'path'
import fse from 'fs-extra'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}

export default new Constant()
  .add(() => ({
    cwd: fse.realpathSync(process.cwd()),
    extensions: {
      js: ['.js', '.jsx', '.ts', '.tsx'],
      css: ['.scss', '.sass', '.css'],
    },
  }))
  .add((instance) => ({
    _resolve: path.resolve.bind(instance.cwd),
  }))
  .add((instance) => ({
    pkg: fse.readJSONSync(instance._resolve('./package.json')) || {},
  }))
  .add((instance) => ({
    project: instance._resolve('.'),
    version: instance.pkg.version,
    external: [
      /node_modules/,
      ...Object.keys({
        ...instance.pkg.dependencies,
        ...instance.pkg.peerDependencies,
      }),
    ].filter(Boolean),
  }))

  .add((instance) => ({
    // input
    src: instance._resolve('src'),
  }))
  .add((instance) => ({
    // output
    esm: instance._resolve('./esm'),
    lib: instance._resolve('./lib'),
    dist: instance._resolve('./dist'),
  }))
