/* eslint-disable no-return-assign */
import { Operator, All, Bracket } from './utils/_token'
import { TokenItem } from './interface'
import validatePatten from './utils/validate_patten'

/* 解析 input 生成 tokens */
function tokenizer($input: string) {
  const letters = validatePatten($input)

  return letters.reduce((result, item, index) => {
    const { used, value } = item

    if (used) return result
    item.used = true

    if (Operator.includes(value)) {
      return result.concat({ type: 'Operator', value })
    }
    if (Bracket.includes(value)) {
      return result.concat({ type: 'Bracket', value })
    }
    // 截取 attr
    const next = letters.slice(index)
    const start = next.findIndex((token) => All.includes(token.value))

    const attrs = start !== -1 ? next.slice(0, start) : next
    attrs.forEach((attr) => (attr.used = true)) // 设置为 true
    const attr = attrs.map((token) => token.value).join('')

    return result.concat({ type: 'Attr', value: attr })
  }, [] as TokenItem[])
}
export default tokenizer
