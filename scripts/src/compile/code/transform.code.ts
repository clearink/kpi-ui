import { transformFile } from '@babel/core'
import { resolve } from 'node:path'
import { safeWriteFile } from '../../utils/file'
import getBabelConfig from '../../utils/get_babel_config'
import { getTargetFilename } from '../../utils/path'
import { CompileCommandOptions } from './interface'

export default function compileCode(cwd: string, options: CompileCommandOptions, file: string) {
  const { format, outDir, entry } = options

  const babelConfig = getBabelConfig(format)

  const source = resolve(cwd, file)

  const target = resolve(cwd, outDir, getTargetFilename(entry, file))

  const start = performance.now()

  transformFile(source, babelConfig, (error, output) => {
    if (error) return console.log(error)

    if (!output || !output.code) return

    const costTime = ~~(performance.now() - start)

    console.log(`compile at: ${source} in ${costTime}ms`)

    safeWriteFile(target, output.code)
  })
}
