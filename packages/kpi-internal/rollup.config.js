import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import terser from '@rollup/plugin-terser'
import eslint from '@rollup/plugin-eslint'
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default defineConfig({
  input: 'src/index.ts',
  external: Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
    'react/jsx-runtime': true,
  }),
  plugins: [
    resolve(),
    commonjs(),
    eslint({ throwOnError: true }),
    getBabelInputPlugin({
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          removeComments: true,
        },
      },
    }),
  ],
  output: [
    {
      dir: 'esm',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
    },
    {
      dir: 'lib',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
    },
  ],
})
