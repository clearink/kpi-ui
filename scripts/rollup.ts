const glob = require('fast-glob')
const { watch } = require('rollup')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')

const pkg = require('./package.json')

const external = [
  /node_modules/,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const entries = glob.sync('./src/**/*.ts{,x}')
const watcher = watch(
  entries.map((file) => {
    return {
      input: file,
      external,
      plugins: [
        resolve({ extensions }),

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
          format: 'es',
          dir: 'es',
        },
      ],
    }
  })
)
watcher.on('change', (id, change) => {
  console.log(id, change)
})
