import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import path from 'path'
import glob from 'fast-glob'
import constants from '../../utils/constants'

export default async function buildJs() {
  const entries = glob
    .sync('./src/**/*.ts{,x}', {
      ignore: ['**/style/*'],
      cwd: constants._resolve('../kpi-components'),
    })
    .reduce<Record<string, string>>((result, file) => {
      const name = path.relative('src', file).slice(0, -path.extname(file).length)

      result[name] = constants._resolve('../kpi-components', file)

      return result
    }, {})

  glob
    .sync('./src/**/*.ts{,x}', {
      cwd: constants._resolve('../kpi-utils'),
    })
    .forEach((file) => {
      const name = path.relative('src', file).slice(0, -path.extname(file).length)

      entries[`_workspace/utils/${name}`] = constants._resolve('../kpi-utils', file)
    })

  const bundle = await rollup({
    input: entries,
    external: constants.external,
    treeshake: false,
    plugins: [
      resolve({ extensions: constants.extensions.js }),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        extensions: constants.extensions.js,
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
          { find: '@', replacement: constants._resolve('../kpi-components/src') },
          { find: '_shared', replacement: constants._resolve('../kpi-components/src/_shared') },
        ],
      }),
    ],
  })

  await Promise.all([
    bundle.write({
      dir: constants.esm,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: constants._resolve('./src'),
    }),
    bundle.write({
      dir: constants.lib,
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: constants._resolve('./src'),
      exports: 'named',
    }),
  ])
}
