module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['.eslintrc.js', 'rollup.config.mjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'off',
  },
}
