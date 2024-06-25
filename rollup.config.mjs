// import { defineConfig } from 'rollup'
// import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import babel from '@rollup/plugin-babel'
// import alias from '@rollup/plugin-alias'
// import { createRequire } from 'module'
// import glob from 'fast-glob'
// import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

// const pkg = createRequire(import.meta.url)('./package.json')

// const external = [
//   /node_modules/,
//   ...Object.keys(pkg.dependencies || {}),
//   ...Object.keys(pkg.peerDependencies || {}),
// ]

// const extensions = ['.js', '.jsx', '.ts', '.tsx']

// export default defineConfig([
//   {
//     input: glob.sync('./src/utils/**/*.ts{,x}', {}).reduce((result, file) => {
//       let target = path.relative('src/utils', file)
//       target = target.slice(0, target.length - path.extname(target).length)

//       result[target] = file

//       return result
//     }, {}),
//     external,
//     plugins: [
//       alias({
//         entries: [],
//       }),
//       resolve({ extensions }),
//       babel({
//         babelHelpers: 'runtime',
//         babelrc: false,
//         comments: false,
//         extensions,
//         presets: [
//           ['@babel/preset-env', { targets: '>0.2%, not dead' }],
//           ['@babel/preset-react', { runtime: 'automatic' }],
//           '@babel/preset-typescript',
//         ],
//         plugins: ['@babel/plugin-transform-runtime'],
//       }),
//       commonjs(),
//     ],
//     output: [
//       {
//         dir: 'utils/esm',
//         format: 'esm',
//         entryFileNames: '[name].mjs',
//       },
//       {
//         dir: 'utils/lib',
//         format: 'cjs',
//         entryFileNames: '[name].js',
//       },
//     ],
//   },
//   {
//     input: glob.sync('./src/hooks/**/*.ts{,x}', {}).reduce((result, file) => {
//       let target = path.relative('src/hooks', file)
//       target = target.slice(0, target.length - path.extname(target).length)

//       result[target] = file

//       return result
//     }, {}),
//     external,
//     plugins: [
//       alias({
//         entries: [],
//       }),
//       resolve({ extensions }),
//       babel({
//         babelHelpers: 'runtime',
//         babelrc: false,
//         comments: false,
//         extensions,
//         presets: [
//           ['@babel/preset-env', { targets: '>0.2%, not dead' }],
//           ['@babel/preset-react', { runtime: 'automatic' }],
//           '@babel/preset-typescript',
//         ],
//         plugins: ['@babel/plugin-transform-runtime'],
//       }),
//       commonjs(),
//     ],
//     output: [
//       {
//         dir: 'hooks/esm',
//         format: 'esm',
//         entryFileNames: '[name].mjs',
//       },
//       {
//         dir: 'hooks/lib',
//         format: 'cjs',
//         entryFileNames: '[name].js',
//       },
//     ],
//   },
//   {
//     input: glob.sync('./src/types/**/*.ts{,x}', {}).reduce((result, file) => {
//       let target = path.relative('src/types', file)
//       target = target.slice(0, target.length - path.extname(target).length)

//       result[target] = file

//       return result
//     }, {}),
//     external,
//     plugins: [
//       alias({
//         entries: [],
//       }),
//       resolve({ extensions }),
//       babel({
//         babelHelpers: 'runtime',
//         babelrc: false,
//         comments: false,
//         extensions,
//         presets: [
//           ['@babel/preset-env', { targets: '>0.2%, not dead' }],
//           ['@babel/preset-react', { runtime: 'automatic' }],
//           '@babel/preset-typescript',
//         ],
//         plugins: ['@babel/plugin-transform-runtime'],
//       }),
//       commonjs(),
//     ],
//     output: [
//       {
//         dir: 'types/esm',
//         format: 'esm',
//         entryFileNames: '[name].mjs',
//       },
//       {
//         dir: 'types/lib',
//         format: 'cjs',
//         entryFileNames: '[name].js',
//       },
//     ],
//   },
// ])

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__dirname, __filename)
