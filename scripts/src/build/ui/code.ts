import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import path from 'path'
import glob from 'fast-glob'
import constants from '../../utils/constants'

export default async function buildCode() {
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
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        extensions: constants.jsExtensions,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: ['> 0.5%', 'last 2 versions', 'not dead'],
            },
          ],
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
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
