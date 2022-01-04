import HtmlWebpackPlugin from 'html-webpack-plugin'
import type Webpack from 'webpack'

function escapeStringRegexp(string: string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}
export default class InterpolateHtmlPlugin {
  constructor(private replacements: Record<string, any>) {}

  apply(compiler: Webpack.Compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap(
        'InterpolateHtmlPlugin',
        (data) => {
          Object.entries(this.replacements).forEach(([key, value]) => {
            data.html = data.html.replace(new RegExp(`%${escapeStringRegexp(key)}%`, 'g'), value)
          })
          return data
        }
      )
    })
  }
}
