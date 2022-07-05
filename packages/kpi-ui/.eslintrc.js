module.exports = {
  root: true,
  extends: ['kpi-ui'],
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/lib/**', '**/esm/**', '**/types/**'],
};
