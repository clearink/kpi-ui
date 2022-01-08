import { ConfigAPI } from '@babel/core'
import { GEN_CONST } from '../shared/constant'
const { TEST_DIR_NAME, PROPS_FILE_NAME } = GEN_CONST
export default function babelConfig(api: ConfigAPI) {
  const mode = process.env.COMPILE_MODE
  const isEsm = mode === 'esm'
  api.cache.using(() => mode)
  return {
    presets: [
      [require.resolve('@babel/preset-env'), isEsm && { modules: false }].filter(Boolean),
      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-class-properties'),
      [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
    ],
    // ignore: ['./**/*.d.ts', `./**/${TEST_DIR_NAME}/*`, `./**/${PROPS_FILE_NAME}`],
    // ignore: ['**/*.d.ts'],
  }
}
