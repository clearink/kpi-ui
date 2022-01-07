export default function babelConfig(mode: 'esm' | 'cjs' | 'umd') {
  const isEsm = mode === 'esm'
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
  }
}
