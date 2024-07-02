import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { glob } from 'fast-glob'
import path from 'path'
import { rollup } from 'rollup'

import { constants, formatExternals, getPkgJson, removeExtname } from '../../utils/helpers'

export default async function build() {
  const root = constants.resolveCwd('src')

  const entries = glob
    .sync('**/*.ts{,x}', { ignore: constants.ignoreFiles, cwd: root })
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
      input: entries,
      external: externals,
      treeshake: false,
      logLevel: 'silent',
      plugins,
    }).then(async (bundle) => {
      return Promise.all([
        bundle.write({
          dir: constants.esm,
          format: 'esm',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          sourcemap: true,
        }),
        bundle.write({
          dir: constants.cjs,
          format: 'cjs',
          preserveModules: true,
          exports: 'named',
          sourcemap: true,
        }),
      ])
    }),
    rollup({
      input: path.resolve(root, 'index.ts'),
      external: externals,
      logLevel: 'silent',
      plugins: plugins.concat(replace(constants.replaces)),
    }).then(async (bundle) => {
      return Promise.all([
        bundle.write({
          dir: constants.umd,
          format: 'umd',
          name: pkgJson.name,
          entryFileNames: '[name].js',
          sourcemap: true,
        }),
        bundle.write({
          dir: constants.umd,
          format: 'umd',
          name: pkgJson.name,
          entryFileNames: '[name].min.js',
          plugins: [terser()],
          sourcemap: true,
        }),
      ])
    }),
  ])
}
