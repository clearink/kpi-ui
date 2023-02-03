const webpack = require('webpack')
const path = require('path')
const WebPackBarPlugin = require('webpackbar')

module.exports = function common(mode) {
  const isDev = mode === 'development'
  return {
    mode,
    target: ['browserslist'],
    entry: path.resolve(__dirname, './src/index.tsx'),
    performance: false,

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
                  require.resolve('@babel/preset-typescript'),
                  [
                    require.resolve('@babel/preset-react'),
                    {
                      runtime: 'automatic',
                    },
                  ],
                ],
                plugins: [
                  require.resolve('@babel/plugin-transform-runtime'),
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
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
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `"${mode}"`,
        },
      }),
    ],
  }
}
