import { rollup } from 'rollup'
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

// plugin resolve @kpi-ui/utils

function some() {
  return {
    name: 'kpi-utils-resolve',
  }
}

// const entries = glob.sync('./src/**/*.ts{,x}', {
//   ignore: ['**/style/*'],
// })

// remove esm
rollup({
  input: glob.sync('./src/**/*.ts{,x}', {
    ignore: ['**/style/*'],
  }),
  external,
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      extensions,
      presets: [
        ['@babel/preset-env', { targets: ['> 0.5%', 'last 2 versions', 'not dead'] }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '_shared', replacement: path.resolve(__dirname, './src/_shared') },
      ],
    }),
    some(),
  ],
}).then((bundle) => {
  bundle.write({
    dir: 'esm',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
  })
})

// export default defineConfig({
//   // input: glob.sync('./src/**/*.ts{,x}', {
//   //   ignore: ['**/style/*'],
//   // }),
//   input: ['./src/ttt/index.ts'],
//   external,
//   plugins: [
//     resolve({ extensions }),
//     alias({
//       entries: [
//         { find: '@', replacement: path.resolve(__dirname, './src') },
//         { find: '_components', replacement: path.resolve(__dirname, './src/_shared/components') },
//         { find: '_constants', replacement: path.resolve(__dirname, './src/_shared/constants') },
//         { find: '_contexts', replacement: path.resolve(__dirname, './src/_shared/contexts') },
//         { find: '_hooks', replacement: path.resolve(__dirname, './src/_shared/hooks') },
//         { find: '_utils', replacement: path.resolve(__dirname, './src/_shared/utils') },
//       ],
//     }),
//     // terser(),
//     // visualizer({
//     //   filename: './dist/stats.html',
//     //   gzipSize: true,
//     //   sourcemap: true,
//     // }),
//     babel({
//       babelHelpers: 'runtime',
//       babelrc: false,
//       extensions,
//       presets: [
//         '@babel/preset-env',
//         ['@babel/preset-react', { runtime: 'automatic' }],
//         '@babel/preset-typescript',
//       ],
//       plugins: ['@babel/plugin-transform-runtime'],
//     }),
//     commonjs(),
//   ],
//   output: [
//     {
//       dir: 'esm',
//       format: 'esm',
//       preserveModules: true,
//       preserveModulesRoot: 'src',
//     },
//     // {
//     //   dir: 'lib',
//     //   format: 'cjs',
//     //   preserveModules: true,
//     //   preserveModulesRoot: 'src',
//     // },
//   ],
// })
