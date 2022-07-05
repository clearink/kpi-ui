module.exports = {
  parser: require.resolve('@babel/eslint-parser'),
  plugins: ['react'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-uses-vars': 'warn',
    'react/jsx-uses-react': 'warn',
  },
}
