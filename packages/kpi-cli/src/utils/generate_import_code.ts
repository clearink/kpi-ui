import generator from '@babel/generator'
import * as t from '@babel/types'

import type { ImportDeclarationData } from './format_demo_code'

export default function generateImportCode(meta: ImportDeclarationData[]) {
  const map = new Map<string, ImportDeclarationData[]>()

  meta.forEach((item) => {
    const cache = map.get(item.lib) || []
    map.set(item.lib, cache.concat(item))
  })

  const result = Array.from(map.values())
    .map((item) => {
      const uniqueMap = new Map<string, ImportDeclarationData>()
      item.forEach((dr) => {
        if (!uniqueMap.has(dr.local)) {
          uniqueMap.set(dr.local, dr)
        }
      })
      return Array.from(uniqueMap.values())
    })
    .map((item) => {
      const specifier = item.map((dr) =>
        t.importSpecifier(t.identifier(dr.imported), t.identifier(dr.local))
      )
      const ast = t.importDeclaration(specifier, t.stringLiteral(item[0].lib))
      return generator(ast).code
    })

  return result.join('\n')
}
