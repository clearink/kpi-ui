import { BracketItem, TokenItem } from '../interface'
import handleColonToken from './handle_colon_token'
import handleCommaToken from './handle_comma_token'
import handleDestToken from './handle_dest_token'
import { findDestToken } from './_helps'

function normalizeDestToken($tokens: TokenItem[], index: number) {
  const [tokens, type, bracket] = findDestToken($tokens, index)
  // 初始化
  const brackets: BracketItem[] = [{ dest: true, value: bracket }]

  // 第一步  将 数据解构符号去除，同时给出层级关系
  const noDestPattenTokens = handleDestToken(tokens, brackets)

  if (brackets.length) throw new Error('括号不匹配')
  // 第二步 根据 ',' 将数据解构属性分隔开
  const noDestCommaTokens = handleCommaToken(noDestPattenTokens)
  // 第三步 将 数据解构按照 ':' 分隔开
  const noDestColonTokens = handleColonToken(noDestCommaTokens, type)
  return { type, attrs: noDestColonTokens }
}

export default normalizeDestToken
