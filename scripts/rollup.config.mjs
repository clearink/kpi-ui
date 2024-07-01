import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { createRequire } from 'module'

const pkg = createRequire(import.meta.url)('./package.json')

const external = [
  /node_modules/,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default defineConfig({
  input: ['./src/index.ts', './src/utils/helpers'],
  external,
  plugins: [
    resolve({ extensions }),
    babel({
      babelrc: false,
      comments:false,
      babelHelpers: 'bundled',
      extensions,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: ['> 0.5%', 'last 2 versions', 'not dead'],
          },
        ],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
        '@babel/preset-typescript',
      ],
    }),
    commonjs(),
  ],
  output: [
    {
      dir: 'lib',
      format: 'cjs',
    },
  ],
})
