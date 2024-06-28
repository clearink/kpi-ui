import postcss from 'postcss'
import sass from 'sass'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import consola from 'consola'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import path from 'path'

export default async function buildCss() {
  consola.start('starting build css files...')

  const processor = postcss([
    autoprefixer({ overrideBrowserslist: constants.browserslist }),
    cssnano({ preset: 'default' }),
  ])

  glob
    .async('./src/**/style/index.{c,sa,sc}ss', {
      cwd: constants.components,
    })
    .then((files) =>
      files.forEach((file) => {
        sass
          .compileAsync(constants.resolveComps(file))
          .then(({ css }) => processor.process(css))
          .then(({ css }) => {
            const entry = path.relative('src', file).slice(0, -path.extname(file).length)
            constants.safeWriteFile(constants.resolveEsm(`${entry}.css`), css, {
              encoding: 'utf-8',
            })
            constants.safeWriteFile(constants.resolveCjs(`${entry}.css`), css, {
              encoding: 'utf-8',
            })
          })
      })
    )
  glob
    .async('./src/style/css.{c,sa,sc}ss', {
      cwd: constants.components,
    })
    .then((files) =>
      files.forEach((file) => {
        sass
          .compileAsync(constants.resolveComps(file))
          .then((res) => {
            constants.safeWriteFile(constants.resolveUmd(`style.css`), res.css, {
              encoding: 'utf-8',
            })
            return res
          })
          .then(({ css }) => processor.process(css))
          .then(({ css }) => {
            const entry = path.relative('src', file).slice(0, -path.extname(file).length)
            constants.safeWriteFile(constants.resolveEsm(`${entry}.css`), css, {
              encoding: 'utf-8',
            })
            constants.safeWriteFile(constants.resolveCjs(`${entry}.css`), css, {
              encoding: 'utf-8',
            })
            constants.safeWriteFile(constants.resolveUmd(`style.min.css`), css, {
              encoding: 'utf-8',
            })
          })
      })
    )
}
