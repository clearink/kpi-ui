const webpack = require('webpack')
const path = require('path')
const WebPackBarPlugin = require('webpackbar')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  target: ['browserslist'],
  entry: path.resolve(__dirname, './src/index.tsx'),
  performance: false,
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  infrastructureLogging: {
    level: 'warn',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.mjs'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, './src'),
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                [
                  require.resolve('@babel/preset-react'),
                  {
                    runtime: 'automatic',
                  },
                ],
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: [
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('react-refresh/babel'),
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          require.resolve('thread-loader'),
        ],
      },
    ],
  },
  plugins: [
    new WebPackBarPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintWebpackPlugin({
      context: 'src',
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.mjs'],
      eslintPath: require.resolve('eslint'),
      cache: true,
      cacheLocation: path.resolve(__dirname, 'node_modules/.cache/.eslintcache'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"development"`,
      },
    }),
  ],
}
