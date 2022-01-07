import { transformAsync } from '@babel/core'
import { ensureFile, readdir, readFileSync, statSync, writeFile } from 'fs-extra'
import { resolve } from 'path'
import babelConfig from '../config/babel.config'
import { DEV_CONST } from '../shared/constant'

// 编译文件夹
export async function compileDir(dirPath: string,) {
  const dirs = await readdir(dirPath);
  for( const dir of dirs){
    
  }
}

// 编译文件
export async function compileFile() {
  const { mode, entry, output } = options
  const babelOptions = babelConfig(mode)
  const dirPath = resolve(DEV_CONST.APP_DIR, entry)
  const dirs = await readdir(dirPath)
  for (const dir of dirs) {
    const filePath = resolve(dirPath, dir)
    const fileStat = statSync(filePath)
    if (fileStat.isFile()) {
      // index.ts
      // compileFile();
    } else if (fileStat.isDirectory()) {
      // compileDir();
      const entryFile = resolve(filePath, 'index.tsx')
      const source = await readFileSync(entryFile, 'utf-8')
      const result = await transformAsync(source, {
        ast: false,
        filename: entryFile,
        ...babelConfig(mode),
      })
      const outputPath = resolve(DEV_CONST.APP_DIR, output, dir, 'index.js')
      await ensureFile(outputPath)
      await writeFile(outputPath, result?.code, { encoding: 'utf-8' })
    }
  }
}
