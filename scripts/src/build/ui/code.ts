import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import path from 'path'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import consola from 'consola'

export default async function buildCode() {
  consola.start('starting build source files...')

  const entries: Record<string, string> = {}

  glob
    .sync('./src/**/*.ts{,x}', {
      ignore: ['**/style/*'],
      cwd: constants.components,
    })
    .forEach((file) => {
      const entry = path.relative('src', file).slice(0, -path.extname(file).length)

      entries[entry] = constants.resolveComps(file)
    })

  glob
    .sync('./src/**/*.ts{,x}', {
      cwd: constants.utils,
    })
    .forEach((file) => {
      const name = path.relative('src', file).slice(0, -path.extname(file).length)

      entries[`_workspace/utils/${name}`] = constants.resolveUtils(file)
    })

  const external = await constants.getExternal()

  const bundle = await rollup({
    input: entries,
    external,
    treeshake: false,
    plugins: [
      resolve({ extensions: constants.jsExtensions }),
      commonjs(),
      babel(constants.babelOptions),
      alias({
        entries: [
          { find: '@', replacement: constants.resolveComps('src') },
          { find: '_shared', replacement: constants.resolveComps('src/_shared') },
        ],
      }),
    ],
  })

  await Promise.all([
    bundle.write({
      dir: constants.esm,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: constants.resolveCwd('src'),
    }),
    bundle.write({
      dir: constants.cjs,
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: constants.resolveCwd('src'),
      exports: 'named',
    }),
  ])
}
