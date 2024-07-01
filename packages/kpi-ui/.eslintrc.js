module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['.eslintrc.js', 'esm', 'lib', 'dist'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
