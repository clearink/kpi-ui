import webpack from 'webpack'
import WebPackBarPlugin from 'webpackbar'

import KPI_CONST from '../../shared/constant'

import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'

import InterpolateHtmlPlugin from '../../plugins/interpolate_html_plugin'
import { getEnvConstant, getStyleLoader } from '../../shared/utils'
// TODO: 使用 dotenv 获取自定义变量
const envConstant = getEnvConstant()

export default function common(mode: 'development' | 'production'): Record<string, any> {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const constant = KPI_CONST(mode)

  const useTailwind = constant.USE_TAILWIND()
  const useTypeScript = constant.USE_TYPESCRIPT()
  return {
    target: ['browserslist'],
    entry: constant.FIND_ENTRY_FILE(),
    output: {
      path: constant.OUTPUT_PATH,
      assetModuleFilename: 'media/[name].[hash][ext]',
      publicPath: constant.PUBLIC_PATH,
    },
    cache: {
      type: 'filesystem', // 使用文件缓存
      //待优化
      version: constant.CACHE_VERSION,
      store: 'pack',
      buildDependencies: {
        config: [__filename],
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    resolve: {
      modules: ['node_modules', constant.NODE_MODULES],
      extensions: constant.RESOLVE_EXTENSIONS,
      alias: {
        '@': constant.SRC_DIR,
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  [
                    require.resolve('@babel/preset-react'),
                    {
                      runtime: constant.HAS_JSX_RUNTIME() ? 'automatic' : 'classic',
                    },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  require.resolve('@babel/plugin-transform-runtime'),
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false,
                compact: isProd,
              },
            },
            require.resolve('thread-loader'),
          ],
        },
        {
          test: /\.(bmp|svg|jpg|jpeg|gif|png)$/i,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          type: 'asset/resource',
          /**
           * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
           * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
           * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
           * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。
           * 之前通过使用 url-loader，并且配置资源体积限制实现
           */
        },
        {
          // TODO: 字体是否需要呢？
          test: /\.(woff2?|eot|ttf|otf)$/i,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          exclude: /\.module\.css$/,
          use: getStyleLoader({
            mode,
            useTailwind,
            module: false,
            sass: false,
          }),
        },
        {
          test: /\.module\.css$/,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          use: getStyleLoader({
            mode,
            useTailwind,
            module: true,
            sass: false,
          }),
        },
        {
          test: /\.s(c|a)ss$/,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          exclude: /\.module\.s(c|a)ss$/,
          use: getStyleLoader({
            mode,
            useTailwind,
            module: false,
            sass: true,
          }),
        },
        {
          test: /\.module\.s(c|a)ss$/,
          include: [constant.SRC_DIR, constant.DEV_SRC_DIR].filter(Boolean),
          use: getStyleLoader({
            mode,
            useTailwind,
            module: true,
            sass: true,
          }),
        },
      ],
    },
    plugins: [
      new WebPackBarPlugin(),
      new InterpolateHtmlPlugin(getEnvConstant().env),
      // new WebpackManifestPlugin({
      //   fileName: 'asset-manifest.json',
      //   publicPath: KPI_CONST.PUBLIC_PATH,
      //   // generate //待优化
      // }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // // 单独一个进程检查
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: isDev,
        }),
      // // 待优化
      // new ESLintPlugin({
      //   cache: true,
      //   context: KPI_CONST.SRC_DIR,
      //   extensions: KPI_CONST.RESOLVE_EXTENSIONS,
      //   eslintPath: require.resolve('eslint'),
      //   cacheLocation: KPI_CONST.ESLINT_CACHE_DIR,
      //   // eslint class options
      //   cwd: KPI_CONST.APP_DIR,
      //   resolvePluginsRelativeTo: __dirname,
      //   // TODO: 待优化
      //   // baseConfig: {},
      // }),
      // 插入全局变量
      new webpack.DefinePlugin(envConstant.str),
    ].filter(Boolean),
  }
}
