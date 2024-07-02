import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { glob } from 'fast-glob'
import path from 'node:path'
import { rollup } from 'rollup'

import { constants, formatExternals, getPkgJson, removeExtname } from '../../utils/helpers'

export default async function build() {
  const root = constants.resolveCwd('src')

  const entries = glob
    .sync('**/*.ts{,x}', { cwd: root, ignore: constants.ignoreFiles })
    .reduce<Record<string, string>>((result, file) => {
      result[removeExtname(file)] = path.resolve(root, file)

      return result
    }, {})

  const pkgJson = await getPkgJson()

  const externals = formatExternals(pkgJson)

  externals.push(/\.(css|scss|sass)$/)

  const plugins = [
    resolve({ extensions: constants.jsExtensions }),
    commonjs(),
    babel(constants.babelOptions),
    alias({ entries: constants.alias }),
  ]

  await Promise.all([
    rollup({
      external: externals,
      input: entries,
      logLevel: 'silent',
      plugins,
      treeshake: false,
    }).then(async (bundle) => {
      return Promise.all([
        bundle.write({
          dir: constants.esm,
          entryFileNames: '[name].mjs',
          format: 'esm',
          preserveModules: true,
          sourcemap: true,
        }),
        bundle.write({
          dir: constants.cjs,
          exports: 'named',
          format: 'cjs',
          preserveModules: true,
          sourcemap: true,
        }),
      ])
    }),
    rollup({
      external: externals,
      input: path.resolve(root, 'index.ts'),
      logLevel: 'silent',
      plugins: plugins.concat(replace(constants.replaces)),
    }).then(async (bundle) => {
      return Promise.all([
        bundle.write({
          dir: constants.umd,
          entryFileNames: '[name].js',
          format: 'umd',
          name: pkgJson.name,
          sourcemap: true,
        }),
        bundle.write({
          dir: constants.umd,
          entryFileNames: '[name].min.js',
          format: 'umd',
          name: pkgJson.name,
          plugins: [terser()],
          sourcemap: true,
        }),
      ])
    }),
  ])
}
