import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import terser from '@rollup/plugin-terser'
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel'

import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default defineConfig({
  input: 'src/index.ts',
  external: Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
    'react/jsx-runtime': true,
  }),
  plugins: [
    resolve({ extensions }),
    commonjs(),
    getBabelInputPlugin({
      extensions,
      presets: ['@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
    }),
  ],
  output: [
    {
      dir: 'esm',
      format: 'esm',
      exports: 'named',
    },
    {
      dir: 'lib',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
    },
  ],
})
