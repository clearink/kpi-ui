import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { glob } from 'fast-glob'
import path from 'path'
import { type OutputOptions, rollup, type RollupOptions } from 'rollup'

import { constants, formatExternals, getPkgJson, removeExtname } from '../../utils/helpers'

interface BuildCodeOptions {
  external: RollupOptions['external']
  input: string | Record<string, string>
  outputOptions: OutputOptions[]
  minify?: boolean
}

async function buildCode(options: BuildCodeOptions) {
  const { input, external, outputOptions } = options

  const bundle = await rollup({
    input,
    external,
    treeshake: typeof input === 'string',
    logLevel: 'silent',
    plugins: [
      resolve({ extensions: constants.jsExtensions }),
      commonjs(),
      babel(constants.babelOptions),
      alias({ entries: constants.alias }),
      typeof input === 'string' &&
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ].filter(Boolean),
  })

  return Promise.all(outputOptions.map((config) => bundle.write(config)))
}

export default async function build() {
  const root = constants.resolveCwd('src')

  const entries = glob
    .sync('**/*.ts{,x}', {
      ignore: ['**/__tests__', '**/_demo', '**/_design'],
      cwd: root,
    })
    .reduce<Record<string, string>>((result, file) => {
      result[removeExtname(file)] = path.resolve(root, file)

      return result
    }, {})

  const pkgJson = await getPkgJson()

  const externals = formatExternals(pkgJson)

  externals.push(/\.(css|scss|sass)$/)

  await Promise.all([
    buildCode({
      input: path.resolve(root, 'index.ts'),
      external: externals,
      outputOptions: [
        {
          dir: constants.umd,
          format: 'umd',
          name: pkgJson.name,
          entryFileNames: '[name].js',
          sourcemap: true,
        },
        {
          dir: constants.umd,
          format: 'umd',
          name: pkgJson.name,
          entryFileNames: '[name].min.js',
          plugins: [terser()],
          sourcemap: true,
        },
      ],
    }),
    buildCode({
      input: entries,
      external: externals,
      outputOptions: [
        {
          dir: constants.esm,
          format: 'esm',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          sourcemap: true,
        },
        {
          dir: constants.cjs,
          format: 'cjs',
          preserveModules: true,
          exports: 'named',
          sourcemap: true,
        },
      ],
    }),
  ])
}
