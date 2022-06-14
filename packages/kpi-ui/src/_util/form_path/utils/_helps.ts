import { BracketItem, NodePath, NodeType, RemovedDestToken, TokenItem } from '../interface'
import { Dot, CBL, CBR, SBL, SBR } from './_token'

export const isPlainObject = <T extends object>(obj: any): obj is T => obj !== null && typeof obj === 'object'

export const isString = (obj: any): obj is string => typeof obj === 'string'
export const isArray = Array.isArray

// 是否为数据解构
export function isDestToken(tokens: TokenItem[], index: number) {
  if (tokens.length < 3) return false
  const current = tokens[index].value
  if (current !== Dot) return false
  const bracket = tokens[index + 1].value
  return [SBL, CBL].includes(bracket)
}
// 是否为数组数据
export function isArrayToken(tokens: TokenItem[], index: number) {
  if (tokens.length < 3) return false
  const left = tokens[index].value
  if (left !== SBL) return false
  const current = tokens[index + 1]
  if (current.type !== 'Attr') return false
  const right = tokens[index + 2].value
  if (right !== SBR) return false
  return true
}
// 括号匹配
export function isBracketMatch(left: BracketItem | string, right: string) {
  if (!isPlainObject(left)) {
    if (left === SBL && right === SBR) return true
    if (left === CBL && right === CBR) return true
    return false
  }
  if (!left.value) return false
  if (left.value === SBL && right === SBR) return true
  if (left.value === CBL && right === CBR) return true
  return false
}

// 修正最后一项
export function fixLastToken(tokens: NodePath[] | RemovedDestToken[], fixArray?: boolean) {
  const len = tokens.length
  const last = tokens[len - 1]
  if (!isPlainObject(last)) return tokens as NodePath[]
  if (fixArray) last.type = 'array'
  else if ('attr' in last) tokens[len - 1] = last.attr
  return tokens as NodePath[]
}

// 获取数据解构token
export function findDestToken(tokens: TokenItem[], index: number) {
  const $tokens = tokens.slice(index + 1)
  const first = $tokens[0]
  if (!isPlainObject(first)) throw new Error(`token is not object: ${first}`)
  first.used = true
  const bracket = first.value
  const type = bracket === SBL ? 'array' : 'object'
  return [$tokens, type, bracket] as const
}

export function initValue(type: NodeType, origin: any = undefined) {
  const map = { object: {}, array: [] }
  return origin ?? map[type]
}
