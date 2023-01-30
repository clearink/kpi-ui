import path from 'path'
import KPI_CONST from '../constant'

export default function shouldParseMarkdown(
  url: string,
  options: { demoDir: string; docDir: string }
) {
  const { SRC_DIR } = KPI_CONST

  if (!url.startsWith(SRC_DIR)) return false

  const paths = url.replace(SRC_DIR, '').split(path.sep).filter(Boolean)

  if (paths.length !== 3) return false

  return paths[1] === options.docDir && paths[2].startsWith('index')
}
