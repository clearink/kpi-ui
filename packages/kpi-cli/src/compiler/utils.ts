import { transformAsync } from '@babel/core'
import { ensureFile, readdir, readFileSync, stat, statSync, writeFile } from 'fs-extra'
import { resolve, extname } from 'path'
import babelConfig from '../config/babel.config'
import { KPI_CONST, GEN_CONST } from '../shared/constant'
import { CompileProps } from '.'

const { APP_DIR, STYLE_EXTENSIONS, RESOLVE_EXTENSIONS } = KPI_CONST
const { DOCS_DIR_NAME, TEST_DIR_NAME, PROPS_FILE_NAME } = GEN_CONST

// 编译文件夹
export async function compileDir(entryDir: string, outDir: string, options: CompileProps) {
  const dirs = await readdir(entryDir)
  for (const name of dirs) {
    const filePath = resolve(entryDir, name)
    const fileStat = await stat(filePath)
    const extension = extname(filePath)
    if (fileStat.isDirectory() && ![DOCS_DIR_NAME, TEST_DIR_NAME].includes(name)) {
      compileDir(filePath, resolve(outDir, name), options)
    } else if (STYLE_EXTENSIONS.includes(extension)) {
      compileStyle(filePath, options)
    } else if (RESOLVE_EXTENSIONS.includes(extension) && name !== PROPS_FILE_NAME) {
      const outputPath = resolve(outDir, name.replace(/\.tsx?$/g, '.js'))
      compileScript(filePath, outputPath, options)
    }
  }
}

// 编译文件
export async function compileScript(filePath: string, outputPath: string, options: CompileProps) {
  const { mode, entry, output } = options
  const source = await readFileSync(filePath, 'utf-8')
  const result = await transformAsync(source, {
    ast: false,
    filename: filePath,
    ...babelConfig(mode),
  })

  await ensureFile(outputPath)
  await writeFile(outputPath, result?.code, { encoding: 'utf-8' })
}

// 编译样式文件
export async function compileStyle(filePath: string, options: CompileProps) {}
