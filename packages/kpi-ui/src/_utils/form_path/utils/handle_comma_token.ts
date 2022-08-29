import { isObject } from '../../validate_type'
import { RemovedCommaToken, RemovedDestToken } from '../interface'
import { Comma } from './_token'

// 处理 ','  按照 ',' 将数据分隔开
function handleCommaToken(tokens: RemovedDestToken[]) {
  const result: RemovedCommaToken[][] = [[]]
  for (const token of tokens) {
    const last = result[result.length - 1]
    if (token === Comma) result.push([])
    else if (!isObject(token)) last.push(token)
    else if ('attrs' in token && token.attrs.length) {
      const attrs = handleCommaToken(token.attrs)
      last.push({ ...token, attrs })
    } else last.push(token as RemovedCommaToken)
  }
  return result
}

export default handleCommaToken
