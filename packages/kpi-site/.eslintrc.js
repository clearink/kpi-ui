module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['webpack.*.js', '.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
