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

  // build comps css entry
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

    sass
      .compileAsync(path.resolve(root, 'style', 'components.scss'))
      .then(async (res) => {
        await safeWriteFile(constants.resolveUmd(`${pkgJson.name || 'style'}.css`), res.css)
        return processor.process(res.css)
      })
      .then((res) => {
        return safeWriteFile(constants.resolveUmd(`${pkgJson.name || 'style'}.min.css`), res.css)
      })

    // .forEach((file) => {
    //   const filepath = path.resolve(constants.esm, file)
    //   const str = fse.readFileSync(filepath, { encoding: 'utf-8' })
    //   fse.ensureFileSync(constants.resolveUmd('kpi-ui.css'))
    //   fse.appendFileSync(constants.resolveUmd('kpi-ui.css'), str)
    // })
  }

  // const bundle = await rollup({
  //   input: entries,
  //   plugins: [
  //     postcss({
  //       extensions: constants.cssExtensions,
  //       plugins: [autoprefixer(), cssnano({ preset: 'default' })],
  //       sourceMap: true,
  //       extract: true,
  //     }),
  //   ],
  // })
  // await Promise.all([
  //   bundle.write({
  //     dir: constants.esm,
  //     format: 'esm',
  //     entryFileNames: '[name].mjs',
  //     preserveModules: true,
  //     preserveModulesRoot: root,
  //     sourcemap: true,
  //   }),
  // ])
  // await Promise.all([
  //   // copy scss files
  //   ...glob.sync('**/*.{c,sa,sc}ss', { cwd: root }).map((file) => {
  //     const filepath = path.resolve(root, file)
  //     return Promise.all([
  //       fse.copy(filepath, constants.resolveEsm(file)),
  //       fse.copy(filepath, constants.resolveCjs(file)),
  //     ])
  //   }),
  //   //   // compile comps style
  //   //   ...glob.sync('**/style/index.{c,sa,sc}ss', { cwd: source }).map(async (file) => {
  //   //     const filename = constants.removeExtname(file)
  //   //     const filepath = path.resolve(source, file)
  //   //     const res1 = await sass.compileAsync(filepath, { sourceMap: true })
  //   //     if (filepath === rootCssPath) {
  //   //       await constants.safeWriteFile(constants.resolveUmd(`${pkgJson.name}.css`), res1.css)
  //   //     }
  //   //     const res2 = await processor.process(res1.css, { from: filepath })
  //   //     return Promise.all(
  //   //       [
  //   //         constants.safeWriteFile(constants.resolveEsm(`${filename}.css`), res2.css),
  //   //         constants.safeWriteFile(constants.resolveCjs(`${filename}.css`), res2.css),
  //   //         filepath === rootCssPath &&
  //   //           constants.safeWriteFile(constants.resolveUmd(`${pkgJson.name}.min.css`), res2.css),
  //   //       ].filter(Boolean)
  //   //     )
  //   //   }),
  //   //   // generate files
  //   //   ...glob.sync('**/style/index.ts{,x}', { cwd: source }).map(async (file) => {
  //   //     const filename = constants.removeExtname(file)
  //   //     const filepath = path.resolve(source, file)
  //   //     //   const res = await transformFileAsync(filepath, { sourceMaps: true })
  //   //     //   const code = res?.code
  //   //     //   if (!code) return Promise.resolve()
  //   //     //   return Promise.all([
  //   //     //     constants.safeWriteFile(constants.resolveEsm(`${filename}.mjs`), code),
  //   //     //     constants.safeWriteFile(
  //   //     //       constants.resolveEsm(`${filename}.mjs.map`),
  //   //     //       JSON.stringify(res?.map)
  //   //     //     ),
  //   //     //     constants.safeWriteFile(constants.resolveCjs(`${filename}.js`), code),
  //   //     //     constants.safeWriteFile(
  //   //     //       constants.resolveCjs(`${filename}.js.map`),
  //   //     //       JSON.stringify(res?.map)
  //   //     //     ),
  //   //     //     constants.safeWriteFile(constants.resolveEsm(`${path.dirname(file)}/css.mjs`), code),
  //   //     //     constants.safeWriteFile(constants.resolveCjs(`${path.dirname(file)}/css.js`), code),
  //   //     //   ])
  //   //   }),
  // ])
}
