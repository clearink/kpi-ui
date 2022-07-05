'use strict'
const restrictedGlobals = require('confusing-browser-globals')

module.exports = {
  extends: [require.resolve('./base')],
  plugins: ['import', 'jsx-a11y', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: ['airbnb-base', 'airbnb-typescript', 'plugin:prettier/recommended'],
    },
  ],
  rules: {
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false,
      },
    ],
  },
}