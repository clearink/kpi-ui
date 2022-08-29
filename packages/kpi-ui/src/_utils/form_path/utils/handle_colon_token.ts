import { isObject } from '../../validate_type'
import { NodePath, NodeType, RemovedCommaToken } from '../interface'
import { fixLastToken } from './_helps'
import { Colon } from './_token'

function handleColonToken(matrix: RemovedCommaToken[][], type: NodeType) {
  const result: { left: NodePath[]; right: NodePath[] }[] = []
  for (const [index, tokens] of Object.entries(matrix)) {
    const item: NodePath[][] = []
    for (const token of tokens) {
      if (token === Colon || !item.length) item.push([])
      if (!isObject(token)) continue

      // 每一层仅允许有一个 ':' 数组时仅允许一个
      const maxLength = type === 'array' ? 1 : 2
      if (item.length > maxLength) throw new Error(`'${Colon}' 位置错误`)

      const last = item[item.length - 1]

      if ('attrs' in token && token.attrs.length) {
        const attrs = handleColonToken(token.attrs, token.type)
        last.push({ ...token, attrs })
      } else if ('attr' in token) last.push(token)
    }

    if (item.length === 0) item.push([], [])
    else if (item.length === 1) item.push(item[0].slice())
    if (type === 'array') item[0] = [index]

    // 修正最后一项
    const left = fixLastToken(item[0])
    const right = fixLastToken(item[1])
    result.push({ left, right })
  }
  return result
}

export default handleColonToken
