module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  extends: ['kpi-ui'],
  ignorePatterns: ['node_modules', 'lib', 'esm', 'types'],
}
