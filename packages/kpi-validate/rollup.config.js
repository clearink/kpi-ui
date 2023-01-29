import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import terser from '@rollup/plugin-terser'
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import pkg from './package.json'

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
})

const input = 'src/index.ts'

const plugins = (declaration = false) => {
  return [
    resolve(),
    commonjs(),
    getBabelInputPlugin({
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration,
          removeComments: true,
        },
      },
    }),
  ]
}

const esm = defineConfig({
  input,
  external,
  plugins: plugins(true),
  output: {
    dir: 'esm',
    format: 'esm',
    exports: 'named',
    preserveModules: true,
    plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
  },
})

const cjs = defineConfig({
  input,
  external,
  plugins: plugins(true),
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'named',
    preserveModules: true,
    plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
  },
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

export default [esm, cjs, types]
