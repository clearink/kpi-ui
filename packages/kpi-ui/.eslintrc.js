module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  extends: ['kpi-ui'],
  rules: {
    'no-underscore-dangle': 'off',
  },
  ignorePatterns: ['node_modules', 'lib', 'esm', 'types'],
}
