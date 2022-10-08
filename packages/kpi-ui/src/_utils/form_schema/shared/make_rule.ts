import SchemaContext from '../context'
import type { Context, Message, RuleReturn } from '../interface'

import formatMessage from './format_message'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
// 透传 context 去收集全部的错误信息
export const Invalid = <T>(value: T, message: Message, context?: Context, params?: any) => {
  const ctx = SchemaContext.ensure(context)
  const $message = formatMessage(message, ctx)(params)
  return { status: 'invalid', value, message: $message } as const
}

// 生成校验函数
export function makeCustomRule<T = any>(
  handler: (value: T, context?: Context) => boolean | Promise<boolean>,
  message: Message,
  params?: any
) {
  return async (value: T, context?: Context): Promise<RuleReturn<T>> => {
    const res = await handler(value, context)
    if (res) return Valid(value)
    // TODO: 重新设计 Invalid
    return Invalid(value, message, context, params)
  }
}

export function makeRule<T = any>(rule: (value: T) => boolean, message: Message, params?: any) {
  return (value: T, context?: Context): RuleReturn<T> => {
    if (rule(value)) return Valid(value)
    return Invalid(value, message, context, params)
  }
}
