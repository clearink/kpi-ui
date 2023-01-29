import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import terser from '@rollup/plugin-terser'
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import pkg from './package.json'

const code = defineConfig({
  input: 'src/index.ts',
  external: Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
    'react/jsx-runtime': true,
  }),
  plugins: [
    resolve(),
    commonjs(),
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

const types = defineConfig({
  input: 'esm/index.d.ts',
  plugins: [dts.default()],
  output: {
    format: 'esm',
    file: 'types/index.d.ts',
  },
})

// const dist = defineConfig({
//   input,
//   external,
//   plugins: plugins(false),
//   output: {
//     dir: 'dist',
//     format: 'umd',
//   },
// })

export default [code, types]
