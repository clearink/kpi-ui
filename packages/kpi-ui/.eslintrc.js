module.exports = {
  root: true,
  parserOptions: {
    project: ['tsconfig.eslint.json', 'tsconfig.json'],
    tsconfigRootDir: __dirname,
    allowImportExportEverywhere: true,
  },
  plugins: ['prettier'],
  extends: ['kpi-ui', 'airbnb-base', 'airbnb-typescript', 'plugin:prettier/recommended'],
  rules: {
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'implicit-arrow-linebreak': 'off',
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
