const glob = require('glob')
const path = require('path')
const { defineConfig } = require('rollup')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')

const pkg = require('./package.json')

const sourceFiles = glob
  .sync('./src/**/*.ts{,x}', {
    ignore: ['./src/**/*(types|interface|props).ts{,x}', './src/**/style/*'],
  })
  .reduce((result, file) => {
    let target = path.relative('src', file)
    target = target.slice(0, target.length - path.extname(target).length)

    result[target] = file

    return result
  }, {})

const external = [
  /node_modules/,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const extensions = ['.js', '.jsx', '.ts', '.tsx']

module.exports = defineConfig([
  {
    input: sourceFiles,
    external,
    plugins: [
      resolve({ extensions }),

      typescript({
        tsconfig: 'tsconfig.json',
        check: false,
        tsconfigOverride: {
          compilerOptions: {
            noEmit: false,
            declaration: true,
            emitDeclarationOnly: true,
          },
        },
      }),

      babel({
        babelHelpers: 'runtime',
        extensions,
        comments: false,
        configFile: false,
        // browserslistConfigFile,
        presets: [
          '@babel/preset-env',
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-runtime'],
        assumptions: {
          pureGetters: true,
          ignoreToPrimitiveHint: true,
          setComputedProperties: true,
          objectRestNoSymbols: true,
          constantReexports: true,
          ignoreFunctionLength: true,
          setSpreadProperties: true,
          constantSuper: true,
          setClassMethods: true,
          skipForOfIteratorClosing: true,
          superIsCallableConstructor: true,
        },
      }),

      commonjs(),
    ],
    output: [
      {
        format: 'esm',
        dir: 'esm',
      },
      {
        format: 'cjs',
        dir: 'lib',
      },
    ],
  },
])
