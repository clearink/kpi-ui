import { RollupOptions, OutputOptions, rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import { constants } from '../../utils/helpers'
import { glob } from 'fast-glob'
import path from 'path'

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
    treeshake: typeof input === 'string' ? true : false,
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
  const entries: Record<string, string> = {}

  const root = constants.resolveCwd('src')
  glob
    .sync('**/*.ts{,x}', {
      ignore: ['**/__tests__', '**/_demo', '**/_design'],
      cwd: root,
    })
    .forEach((file) => {
      const name = constants.removeExtname(file)

      entries[name] = path.resolve(root, file)
    })

  const pkgJson = await constants.getPkgJson()

  const externals = constants.normalizeExternals(pkgJson)

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
