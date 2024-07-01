module.exports = {
  root: true,
  extends: ['../.eslintrc.js'],
  ignorePatterns: ['.eslintrc.js', 'rollup.config.mjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
