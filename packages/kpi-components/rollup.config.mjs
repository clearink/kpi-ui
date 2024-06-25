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
import glob from 'fast-glob'

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
  // input: glob.sync('./src/**/*.ts{,x}', {
  //   ignore: ['**/style/*'],
  // }),
  input: ['./src/ttt/index.ts'],
  external,
  plugins: [
    resolve({ extensions }),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '_shared', replacement: path.resolve(__dirname, './src/_shared') },
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
