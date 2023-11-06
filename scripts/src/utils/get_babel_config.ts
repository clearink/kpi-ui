import { TransformOptions } from '@babel/core'
export default function getBabelConfig(format: 'es' | 'cjs'): TransformOptions {
  return {
    comments: false,
    configFile: false,
    babelrc: false,
    targets: { browsers: ['>0.3%', 'defaults'] },
    presets: [
      ['@babel/preset-env', { modules: format === 'es' ? false : undefined }],
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
  }
}
