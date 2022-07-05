'use strict'
const restrictedGlobals = require('confusing-browser-globals')

module.exports = {
  extends: [require.resolve('./base'), 'airbnb-base'],
  plugins: ['import', 'jsx-a11y', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        project: ['tsconfig.eslint.json', 'tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2020,
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'prettier'],
      plugins: ['@typescript-eslint', 'prettier'],
      extends: ['plugin:react/recommended', 'airbnb-typescript', 'plugin:prettier/recommended'],

      rules: {
        // 禁止使用 var
        'no-plusplus': 'off',
        'linebreak-style': 'off',
        'no-continue': 'off',
        'no-param-reassign': 'off',
        'no-restricted-syntax': 'off',
        'consistent-return': 'off',
        'max-len': 'off',
        'implicit-arrow-linebreak': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-restricted-globals': ['error'].concat(restrictedGlobals),
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 'off',
      },
    },
  ],
}
