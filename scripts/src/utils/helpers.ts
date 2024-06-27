import glob from 'fast-glob'
import fse from 'fs-extra'
import path from 'path'

export async function validatePkgName(root: string, name: string) {
  const fullPath = path.resolve(root, './package.json')

  const stat = await fse.lstat(fullPath)

  if (stat.isFile()) {
    const pkg = await fse.readJson(fullPath, { encoding: 'utf-8' })
    if (pkg.name === name) return
  }

  throw new Error(`not found ${name} package`)
}

export async function getPackageDependencies(filepath: string) {
  const pkg = await fse.readJson(filepath)

  return Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  })
}

export async function clean(dist: string) {
  await fse.remove(dist)
}
