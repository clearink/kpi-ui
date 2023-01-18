import matter from 'gray-matter'
import { marked } from 'marked'
import path, { resolve } from 'path'

import type { LoaderContext } from 'webpack'

export interface DemoMatterData {
  order: number
  title: Record<string, string>
  desc: Record<string, string>
  code: { tsx: string; css?: string }
}

// 解析 demo/*.md 文件的 matter 数据
export default function collectMatterList(context: LoaderContext<any>, demos: string[] = []) {
  return demos.map((file) => {
    const url = resolve(path.dirname(context.resourcePath), file)

    // 添加 watch 依赖
    context.addDependency(url)
    const { data, content } = matter.read(url)
    const result = { ...data, desc: {}, code: {} } as DemoMatterData

    const tokens = marked.lexer(content).filter(({ type }) => type !== 'space')

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const next = tokens[i + 1]
      if (token.type === 'heading' && next?.type === 'paragraph') {
        result.desc[token.text] = next.text
      } else if (token.type === 'code') {
        const lang = token.lang === 'css' ? 'css' : 'tsx'
        result.code[lang] = token.text
      }
    }

    return result
  })
}
