import chalk from 'chalk'
import fse from 'fs-extra'
import path from 'node:path'

class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, Object.freeze(fn(this)))
  }
}

export const constants = new Constant()
  .add(() => ({
    cwd: fse.realpathSync(process.cwd()),
    root: path.resolve(__dirname, '../../'),
  }))
  .add(instance => ({
    resolveCwd: path.resolve.bind(null, instance.cwd),
    resolveRoot: path.resolve.bind(null, instance.root),
  }))
  .add(instance => ({
    resolveCjs: instance.resolveCwd.bind(null, 'lib'),
    resolveComps: instance.resolveRoot.bind(null, 'packages', 'components'),
    resolveEsm: instance.resolveCwd.bind(null, 'esm'),

    resolveIcons: instance.resolveRoot.bind(null, 'packages', 'icons'),
    resolveTypes: instance.resolveRoot.bind(null, 'packages', 'types'),
    resolveUi: instance.resolveRoot.bind(null, 'packages', 'kpi-ui'),
    resolveUmd: instance.resolveCwd.bind(null, 'dist'),
    resolveUtils: instance.resolveRoot.bind(null, 'packages', 'utils'),
    resolveValidator: instance.resolveRoot.bind(null, 'packages', 'validator'),
  }))
  .add(instance => ({
    cjs: instance.resolveCjs('.'),
    comps: instance.resolveComps('.'),
    esm: instance.resolveEsm('.'),

    icons: instance.resolveIcons('.'),
    types: instance.resolveTypes('.'),
    ui: instance.resolveUi('.'),
    umd: instance.resolveUmd('.'),
    utils: instance.resolveUtils('.'),
    validator: instance.resolveValidator('.'),
  }))
  .add(() => ({
    browserslist: ['> 0.5%', 'last 2 versions', 'not dead'],
    cssExtensions: ['.scss', '.sass', '.css'],
    ignoreFiles: ['**/__tests__', '**/_demo', '**/_design'],
    jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  }))
  .add(instance => ({
    alias: [
      { find: '@', replacement: instance.resolveCwd('src') },
      { find: '@kpi-ui/utils', replacement: instance.resolveCwd('src/_internal/utils') },
      { find: '@kpi-ui/types', replacement: instance.resolveCwd('src/_internal/types') },
      { find: '_shared', replacement: instance.resolveCwd('src/_shared') },
    ],
    babelOptions: {
      babelHelpers: 'runtime' as const,
      babelrc: false,
      extensions: instance.jsExtensions,
      plugins: ['@babel/plugin-transform-runtime'],
      presets: [
        ['@babel/preset-env', { targets: instance.browserslist }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    },
    replaces: {
      'preventAssignment': true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }))

export function clean(...files: string[]) {
  return Promise.all(files.map(file => fse.remove(file)))
}

export async function getPkgJson() {
  return fse.readJson(constants.resolveCwd('./package.json'))
}

export function formatExternals(pkgJson: Record<string, string>) {
  return ([/node_modules/] as (RegExp | string)[])
    .concat(Object.keys(pkgJson.dependencies), Object.keys(pkgJson.peerDependencies))
    .filter(Boolean)
}

export function removeExtname(file: string) {
  return file.slice(0, -path.extname(file).length)
}

export async function safeWriteFile(filepath: string, data: string) {
  await fse.ensureFile(filepath)
  return fse.writeFile(filepath, data, { encoding: 'utf-8' })
}

export function specifierMatches(pattern: RegExp | string, value: string) {
  if (pattern instanceof RegExp) { return pattern.test(value) }

  if (pattern.length > value.length) return false

  return pattern === value || value.startsWith(`${pattern}/`)
}

export const logger = {
  error: (text: string, log = true) => {
    const str = chalk.hex('#e74c3c')(text)
    if (!log) return str
    console.log(str)
  },
  info: (text: string, log = true) => {
    const str = chalk.hex('#3498db')(text)
    if (!log) return str
    console.log(str)
  },
  success: (text: string, log = true) => {
    const str = chalk.hex('#2ecc71')(text)
    if (!log) return str
    console.log(str)
  },
  warning: (text: string, log = true) => {
    const str = chalk.hex('#f39c12')(text)
    if (!log) return str
    console.log(str)
  },
}
