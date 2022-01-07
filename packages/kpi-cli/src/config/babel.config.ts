export default function babelConfig(mode: 'esm' | 'cjs' | 'umd') {
  const isCjs = mode === 'cjs'
  return {
    presets: [
      [require.resolve('@babel/preset-env'), { modules: isCjs ? undefined : false }],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  }
}
