import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const pkg = createRequire(import.meta.url)('./package.json')

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const external = [
  /node_modules/,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default defineConfig({
  input: ['src/index.ts'],
  external,
  plugins: [
    // {
    //   resolveId(source, importer) {
    //     console.log(source, importer)
    //   },
    // },
    resolve({ extensions }),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '_components', replacement: path.resolve(__dirname, './src/_shared/components') },
        { find: '_constants', replacement: path.resolve(__dirname, './src/_shared/constants') },
        { find: '_contexts', replacement: path.resolve(__dirname, './src/_shared/contexts') },
        { find: '_hooks', replacement: path.resolve(__dirname, './src/_shared/hooks') },
        { find: '_utils', replacement: path.resolve(__dirname, './src/_shared/utils') },
      ],
    }),
    // terser(),
    // visualizer({
    //   filename: './dist/stats.html',
    //   gzipSize: true,
    //   sourcemap: true,
    // }),
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      extensions,
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    commonjs(),
  ],
  output: [
    {
      dir: 'esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    // {
    //   dir: 'lib',
    //   format: 'cjs',
    //   preserveModules: true,
    //   preserveModulesRoot: 'src',
    // },
  ],
})
