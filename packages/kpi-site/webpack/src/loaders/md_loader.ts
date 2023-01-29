import matter from 'gray-matter'
import { generateImportCode, formatDemoCode, formatMatters } from '../utils'

import type { LoaderContext } from 'webpack'

export default function (this: LoaderContext<any>, source: string) {
  const { data: meta, content } = matter(source)

  if (!meta.document) return `export default ${JSON.stringify(source)}`

  const matters = formatMatters(this, meta.demos)

  const [codes, imports] = formatDemoCode(matters)

  // const design = readFileSync(designFile)
  // const api = readFileSync(apiFile)

  return `
    ${generateImportCode(imports)}
    ${codes.join('\n')}
    export default {
      components: [${matters.map((_, i) => `Demo${i}`)}],
      matters: ${JSON.stringify(matters)},
      content: ${JSON.stringify(content)},
      meta: ${JSON.stringify(meta)},
      design: '',
      api: '',
    }
  `
}
