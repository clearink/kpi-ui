import { rollup } from 'rollup'
import postcss from 'postcss'
import sass from 'sass'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import consola from 'consola'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import fse from 'fs-extra'
import path from 'path'

export default async function buildCss() {
  consola.start('starting build css files...')

  const processor = postcss([
    autoprefixer({
      overrideBrowserslist: ['> 0.5%', 'last 2 versions', 'not dead'],
    }),
    cssnano({ preset: 'default' }),
  ])
  glob
    .sync('./src/**/style/index.{css,sass,scss}', {
      cwd: constants.components,
    })
    .forEach(async (file) => {
      const filepath = constants.resolveComps(file)

      sass
        .compileAsync(filepath, { style: 'expanded' })
        .then(({ css }) => processor.process(css, { from: filepath }))
        .then((res) => {
          const entry = path.relative('src', file).slice(0, -path.extname(file).length)

          {
            const output = path.resolve(constants.esm, `${entry}.css`)

            fse.ensureFileSync(output)
            fse.writeFileSync(output, res.content, { encoding: 'utf-8' })
          }

          {
            const output = path.resolve(constants.cjs, `${entry}.css`)

            fse.ensureFileSync(output)
            fse.writeFileSync(output, res.content, { encoding: 'utf-8' })
          }
        })

      // console.log({ from: filepath, to: constants.resolveCwd(`./esm/${file}.css`) })
    })
  // .reduce<Record<string, string>>((result, file) => {

  //   result[entry] = constants.resolveComps(file)

  //   return result
  // }, {})
}
