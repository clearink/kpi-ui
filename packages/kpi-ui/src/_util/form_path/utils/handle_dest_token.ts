// 处理 数据结构 tokens

import { BracketItem, RemovedDestToken, TokenItem } from '../interface'
import { Dot } from './_token'
import { isDestToken, findDestToken, fixLastToken, isArrayToken, isBracketMatch } from './_helps'

// 获取数据解构 tokens
function handleDestToken(tokens: TokenItem[], brackets: BracketItem[]) {
  const result: RemovedDestToken[] = []
  for (let i = 0; i < tokens.length; i++) {
    const { type, value, used } = tokens[i]
    if (used === true) continue
    tokens[i].used = true

    if (isDestToken(tokens, i)) {
      const [$tokens, type$, bracket] = findDestToken(tokens, i)
      brackets.push({ dest: true, value: bracket })
      const attrs = handleDestToken($tokens, brackets)
      result.push({ type: type$, attrs })
    } else if (isArrayToken(tokens, i)) {
      fixLastToken(result, true)
    } else if (type === 'Attr') {
      result.push({ type: 'object', attr: value })
    } else if (type === 'Operator' && value !== Dot) {
      result.push(value)
    }

    const bracket = brackets[brackets.length - 1]
    if (isBracketMatch(bracket, value)) {
      brackets.pop()
      if (bracket.dest) return result // 数据解构括号匹配了, 尽早结束
    } else if (type === 'Bracket') brackets.push({ value })
  }
  return result
}
export default handleDestToken
