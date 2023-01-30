import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import pkg from './packages/kpi-internal/package.json'

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
    babel({
      extensions,
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
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
