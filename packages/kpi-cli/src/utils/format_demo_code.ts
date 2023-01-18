import { parse } from '@babel/parser'
import traverse, { type NodePath } from '@babel/traverse'
import generator from '@babel/generator'
import * as t from '@babel/types'

import type { DemoMatterData } from './collect_matters'

export interface ImportDeclarationData {
  imported: string
  local: string
  lib: string
}
//
export default function formatDemoCode(matters: DemoMatterData[]) {
  const codes: string[] = []
  const imports: ImportDeclarationData[] = []

  for (let i = 0; i < matters.length; i++) {
    const source = matters[i].code.tsx

    if (!source) continue

    const ast = parse(source, {
      sourceType: 'module',
      createParenthesizedExpressions: true,
      plugins: ['jsx', 'typescript'],
    })

    traverse(ast, {
      enter(path) {
        if (path.isIdentifier({ name: 'App' })) {
          path.node.name = `Demo${i}`
        }
      },
      ExportDefaultDeclaration(path) {
        path.remove()
      },
      ImportDeclaration(path) {
        imports.push(...collecImportDeclaration(path))
        path.remove()
      },
      TypeScript(path) {
        path.remove()
      },
    })

    codes.push(generator(ast).code)
  }

  return [codes, imports] as const
}

function collecImportDeclaration(path: NodePath<t.ImportDeclaration>) {
  const result: ImportDeclarationData[] = []
  const lib = path.node.source.value

  path.node.specifiers.forEach((specifier) => {
    if (t.isImportSpecifier(specifier)) {
      const local = specifier.local.name

      if (t.isIdentifier(specifier.imported)) {
        const imported = specifier.imported.name
        result.push({ imported, local, lib })
      }
    }
  })

  return result
}
