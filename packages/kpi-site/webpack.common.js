const webpack = require('webpack')
const path = require('path')
const WebPackBarPlugin = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function getStyleLoader(options) {
  const { module, sass, mode } = options
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  return [
    // dev 环境需要 prod 环境下 直接抽离成 css file
    isDev && require.resolve('style-loader'),
    isProd && require.resolve(MiniCssExtractPlugin.loader),
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: module
          ? {
              localIdentName: '[local]--[hash:base64:5]',
            }
          : undefined,
        importLoaders: sass ? 3 : 2, // 前面还有多少个 loader 需要执行
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [require.resolve('postcss-preset-env')],
        },
      },
    },
    sass && require.resolve('sass-loader'),
    require.resolve('thread-loader'),
  ].filter(Boolean)
}

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
                  [
                    require.resolve('babel-plugin-import'),
                    {
                      libraryName: '@kpi/ui',
                      libraryDirectory: 'esm',
                      style: true,
                    },
                  ],
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false,
                compact: false,
                assumptions: {
                  pureGetters: true,
                  ignoreToPrimitiveHint: true,
                  setComputedProperties: true,
                  objectRestNoSymbols: true,
                  constantReexports: true,
                  ignoreFunctionLength: true,
                  setSpreadProperties: true,
                  constantSuper: true,
                  setClassMethods: true,
                  skipForOfIteratorClosing: true,
                  superIsCallableConstructor: true,
                },
              },
            },
            require.resolve('thread-loader'),
          ],
        },
        {
          test: /\.(svg)(\?.*)?$/,
          include: path.resolve(__dirname, './src'),
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(bmp|svg|jpe?g|gif|png|webp|avif)$/i,
          include: [path.resolve(__dirname, './src'), path.resolve(__dirname, './public')],
          type: 'asset',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
          /**
           * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
           * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
           * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
           * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。
           * 之前通过使用 url-loader，并且配置资源体积限制实现
           */
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          include: [path.resolve(__dirname, './src'), path.resolve(__dirname, './public')],
          type: 'asset',
          generator: {
            filename: 'media/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          include: [path.resolve(__dirname, './src'), path.resolve(__dirname, './public')],
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          sideEffects: true,
          use: getStyleLoader({
            mode,
            module: false,
            sass: false,
          }),
        },
        {
          test: /\.module\.css$/,
          use: getStyleLoader({
            mode,
            module: true,
            sass: false,
          }),
        },
        {
          test: /\.s(c|a)ss$/,
          exclude: /\.module\.s(c|a)ss$/,
          sideEffects: true,
          use: getStyleLoader({
            mode,
            module: false,
            sass: true,
          }),
        },
        {
          test: /\.module\.s(c|a)ss$/,
          include: path.resolve(__dirname, './src'),
          use: getStyleLoader({
            mode,
            module: true,
            sass: true,
          }),
        },
      ],
    },
    plugins: [
      new WebPackBarPlugin(),
      // 插入全局变量
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `"${mode}"`,
        },
      }),
    ],
  }
}
