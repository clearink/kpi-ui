import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import path from 'path'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import { clean, getPackageDependencies, validatePkgName } from '../../utils/helpers'

export default async function buildJs() {
  await Promise.all([
    validatePkgName(constants.componentsDir, '@kpi-ui/components'),
    validatePkgName(constants.utilsDir, '@kpi-ui/utils'),
  ])

  const entries = glob
    .sync('./src/**/*.ts{,x}', { ignore: ['**/style/*'], cwd: constants.componentsDir })
    .reduce<Record<string, string>>((result, file) => {
      const name = path.relative('src', file).slice(0, -path.extname(file).length)

      result[name] = path.resolve(constants.componentsDir, file)

      return result
    }, {})

  glob.sync('./src/**/*.ts{,x}', { cwd: constants.utilsDir }).forEach((file) => {
    const name = path.relative('src', file).slice(0, -path.extname(file).length)

    entries[`_workspace/utils/${name}`] = path.resolve(constants.utilsDir, file)
  })

  await Promise.all([
    // 删除 dist
    clean(constants.outputEsmDir),
    clean(constants.outputCjsDir),
    clean(constants.outputUmdDir),
  ])

  const dependencies = await getPackageDependencies(constants.resolveCwd('package.json'))

  const external: (RegExp | string)[] = dependencies.filter((e) => {
    return e !== '@kpi-ui/utils' && e !== '@kpi-ui/types'
  })

  external.push(/node_modules/)

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
          { find: '@', replacement: constants.resolveComponents('src') },
          { find: '_shared', replacement: constants.resolveComponents('src/_shared') },
        ],
      }),
    ],
  })

  await Promise.all([
    bundle.write({
      dir: constants.outputEsmDir,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: constants.resolveCwd('src'),
    }),
    bundle.write({
      dir: constants.outputCjsDir,
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: constants.resolveCwd('src'),
      exports: 'named',
    }),
  ])
}
