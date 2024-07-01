import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import glob from 'fast-glob'
import fse from 'fs-extra'
import path from 'path'
import postcss from 'postcss'
import sass from 'sass'
import tsm from 'ts-morph'

import { constants, getPkgJson, removeExtname, safeWriteFile } from '../../utils/helpers'

export default async function build() {
  const root = constants.resolveCwd('src')

  // copy style source files
  await Promise.all(
    glob
      .sync('**/*.{sc,c,sa}ss', {
        ignore: ['**/__tests__', '**/_demo', '**/_design'],
        cwd: root,
      })
      .map((file) => {
        const filepath = path.resolve(root, file)
        return Promise.all([
          fse.copy(filepath, constants.resolveEsm(file)),
          fse.copy(filepath, constants.resolveCjs(file)),
        ])
      }),
  )

  // build comps css
  await Promise.all(
    glob
      .sync('**/style/index.{sc,c,sa}ss', {
        ignore: ['**/__tests__', '**/_demo', '**/_design'],
        cwd: root,
      })
      .map((file) => {
        const filename = removeExtname(file)

        const sourcePath = path.resolve(root, file)

        return sass.compileAsync(sourcePath).then(async ({ css }) => {
          return Promise.all([
            safeWriteFile(constants.resolveEsm(`${filename}.css`), css),
            safeWriteFile(constants.resolveCjs(`${filename}.css`), css),
          ])
        })
      }),
  )

  // transform babel-plugin-import helpers
  {
    const project = new tsm.Project({
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        allowJs: true,
      },
    })

    glob
      .sync('**/style/index.ts{,x}', {
        ignore: ['**/__tests__', '**/_demo', '**/_design'],
        cwd: root,
      })
      .forEach((file) => {
        const filename = removeExtname(file)

        const filepath = path.resolve(root, file)

        const sourceFile = project.addSourceFileAtPath(filepath)

        sourceFile.getImportDeclarations().forEach((node) => {
          const text = node.getModuleSpecifierValue()

          const filename = removeExtname(text)

          node.setModuleSpecifier(`${filename}.css`)
        })

        const sourceText = sourceFile.getText()

        safeWriteFile(constants.resolveEsm(path.dirname(filename), `css.js`), sourceText)
        safeWriteFile(constants.resolveCjs(path.dirname(filename), `css.js`), sourceText)
      })
  }

  // build all style file
  {
    const processor = postcss([autoprefixer(), cssnano({ preset: 'default' })])

    const pkgJson = await getPkgJson()

    const rootCssPath = path.resolve(root, 'style', 'components.scss')

    sass
      .compileAsync(rootCssPath)
      .then(async (res) => {
        await safeWriteFile(constants.resolveUmd(`${pkgJson.name || 'style'}.css`), res.css)
        return processor.process(res.css, { from: rootCssPath })
      })
      .then((res) => {
        return safeWriteFile(constants.resolveUmd(`${pkgJson.name || 'style'}.min.css`), res.css)
      })
  }
}
