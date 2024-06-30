import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import { glob } from 'fast-glob'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}

export const constants = new Constant()
  .add(() => ({
    root: path.resolve(__dirname, '../../'),
    cwd: fse.realpathSync(process.cwd()),
  }))
  .add((instance) => ({
    resolveCwd: path.resolve.bind(null, instance.cwd),
    resolveRoot: path.resolve.bind(null, instance.root),
  }))
  .add((instance) => ({
    resolveEsm: instance.resolveCwd.bind(null, 'esm'),
    resolveCjs: instance.resolveCwd.bind(null, 'lib'),
    resolveUmd: instance.resolveCwd.bind(null, 'dist'),

    resolveComps: instance.resolveRoot.bind(null, 'packages', 'components'),
    resolveUtils: instance.resolveRoot.bind(null, 'packages', 'utils'),
    resolveUi: instance.resolveRoot.bind(null, 'packages', 'kpi-ui'),
    resolveTypes: instance.resolveRoot.bind(null, 'packages', 'types'),
    resolveIcons: instance.resolveRoot.bind(null, 'packages', 'icons'),
    resolveValidator: instance.resolveRoot.bind(null, 'packages', 'validator'),
  }))
  .add((instance) => ({
    esm: instance.resolveEsm('.'),
    cjs: instance.resolveCjs('.'),
    umd: instance.resolveUmd('.'),
    comps: instance.resolveComps('.'),
    utils: instance.resolveUtils('.'),
    ui: instance.resolveUi('.'),
    icons: instance.resolveIcons('.'),
    types: instance.resolveTypes('.'),
    validator: instance.resolveValidator('.'),
  }))
  .add(() => ({
    browserslist: ['> 0.5%', 'last 2 versions', 'not dead'],
    jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    cssExtensions: ['.scss', '.sass', '.css'],
  }))
  .add((instance) => ({
    alias: [
      { find: '@', replacement: instance.resolveComps('src') },
      { find: '_shared', replacement: instance.resolveComps('src/_shared') },
    ],
    babelOptions: {
      babelHelpers: 'runtime' as const,
      babelrc: false,
      extensions: instance.jsExtensions,
      presets: [
        ['@babel/preset-env', { targets: instance.browserslist }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  }))
  .add((instance) => ({
    clean: (...files: string[]) => {
      return Promise.all(files.map((file) => fse.remove(file)))
    },
    safeWriteFile: async (filepath: string, data: string) => {
      await fse.ensureFile(filepath)
      return fse.writeFile(filepath, data, { encoding: 'utf-8' })
    },
    getPkgJson: () => fse.readJson(instance.resolveCwd('./package.json')),
    normalizeExternals: (pkgJson: Record<string, any>) => {
      return ([/node_modules/] as any[])
        .concat(Object.keys(pkgJson.dependencies), Object.keys(pkgJson.peerDependencies))
        .filter(Boolean)
    },
    removeExtname: (file: string) => file.slice(0, -path.extname(file).length),
  }))

export const logger = {
  info: (text: string) => {
    console.log(chalk.hex('#3498db')(text))
  },
  success: (text: string) => {
    console.log(chalk.hex('#2ecc71')(text))
  },
  warning: (text: string) => {
    console.log(chalk.hex('#f39c12')(text))
  },
  error: (text: string) => {
    console.log(chalk.hex('#e74c3c')(text))
  },
}
