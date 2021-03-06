import { NodePath, TokenItem } from './interface'
import { fixLastToken, isArrayToken, isDestToken, isBracketMatch } from './utils/_helps'
import normalizeDestToken from './utils/normalize_dest_token'
import { Dot } from './utils/_token'

/** 解析 tokens 生成 paths */
function parser(tokens: TokenItem[]) {
  const brackets: string[] = []
  const result: NodePath[] = []
  for (let i = 0; i < tokens.length; i += 1) {
    const { type, value, used } = tokens[i]
    if (used === true) continue
    tokens[i].used = true

    // 数据解构优先级最高
    if (isDestToken(tokens, i)) result.push(normalizeDestToken(tokens, i))
    // 其次为数组
    else if (isArrayToken(tokens, i)) fixLastToken(result, true)
    // 直接存储 attr
    else if (type === 'Attr') result.push({ type: 'object', attr: value })
    else if (type === 'Operator' && value !== Dot) {
      throw new Error(`'${value}' 位置错误`)
    }
    // 检测括号是否匹配
    const bracket = brackets[brackets.length - 1]
    if (isBracketMatch(bracket, value)) brackets.pop()
    else if (type === 'Bracket') brackets.push(value)
  }
  if (brackets.length) throw new Error('括号不匹配')
  return fixLastToken(result) // 修正最后一项
}
export default parser
