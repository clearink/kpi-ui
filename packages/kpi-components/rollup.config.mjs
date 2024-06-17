import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'

const pkg = require('./package.json')

const external = [
  /node_modules/,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default defineConfig({
  input: ['src/index.ts'],
  extensions,
  external,
  plugins: [
    resolve({
      extensions,
      moduleDirectories: ['node_modules'],
    }),
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
      dir: 'es',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      dir: 'lib',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
})
