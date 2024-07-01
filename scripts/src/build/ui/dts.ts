import path from 'path'
import glob from 'fast-glob'
import { constants, findBestAlias } from '../../utils/helpers'
import tsm from 'ts-morph'
import fse from 'fs-extra'
import slash from 'slash'

export default async function buildDts() {
  const project = new tsm.Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: constants.esm,
    },
  })

  const root = constants.resolveCwd('src')

  const pkgJson = await constants.getPkgJson()

  const externals = constants.normalizeExternals(pkgJson)

  const sourceFiles = glob
    .sync('**/*.ts{,x}', { cwd: root })
    .map((file) => project.addSourceFileAtPath(path.resolve(root, file)))

  const resolve = (filepath: string, text: string) => {
    const isExternal = externals.find((e) => {
      return e instanceof RegExp ? e.test(text) : text.startsWith(e)
    })

    if (isExternal) return

    const matched = findBestAlias(text, constants.alias)

    if (!matched) return

    let rel = path.relative(path.dirname(filepath), matched.replacement)

    if (!rel.startsWith('.')) rel = './' + rel

    const re = new RegExp(`^${matched.find}`)

    return slash(text.replace(re, rel))
  }

  sourceFiles.forEach((sourceFile) => {
    const filepath = sourceFile.getFilePath()

    sourceFile.getImportDeclarations().forEach((node) => {
      const text = node.getModuleSpecifierValue()

      const newText = resolve(filepath, text)

      if (newText) node.setModuleSpecifier(newText)
    })
    sourceFile.getExportDeclarations().forEach((node) => {
      const text = node.getModuleSpecifierValue()

      if (!text) return

      const newText = resolve(filepath, text)

      if (newText) node.setModuleSpecifier(newText)
    })
  })

  await project.emit({ emitOnlyDtsFiles: true })

  // copy dts files to lib
  await Promise.all(
    glob.sync('**/*.d.ts', { cwd: constants.esm }).map((file) => {
      const filepath = path.resolve(constants.esm, file)
      return fse.copy(filepath, constants.resolveCjs(file))
    })
  )
}
