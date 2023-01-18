import MiniCssExtractPlugin from 'mini-css-extract-plugin'

interface GetStyleLoaderOptions {
  module: boolean
  sass: boolean
  mode: 'development' | 'production'
}
export default function getStyleLoader(options: GetStyleLoaderOptions) {
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
