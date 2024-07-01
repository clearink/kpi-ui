import postcss from 'postcss'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sass from 'sass'
import { constants } from '../../utils/helpers'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import fse from 'fs-extra'
import { glob } from 'fast-glob'
import path from 'path'
import { rollup } from 'rollup'

export default async function build() {
  // const entries: Record<string, string> = {}
  // const root = constants.resolveCwd('src')
  // glob.sync(['**/style/index.ts{,x}', '**/style/index.scss'], { cwd: root }).forEach((file) => {
  //   const name = constants.removeExtname(file)
  //   entries[name] = path.resolve(root, file)
  // })
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
