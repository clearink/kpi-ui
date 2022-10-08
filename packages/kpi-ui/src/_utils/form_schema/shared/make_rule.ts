import type SchemaContext from '../context'
import type { Message, RuleReturn } from '../interface'

import formatMessage from './format_message'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
export const Invalid = <T>(value: T, message: string, context?: SchemaContext) => {
  if (context) {
    const $message = formatMessage(message, context)()
    return { status: 'invalid', value, message: $message } as const
  }
  return { status: 'invalid', value, message } as const
}

// 生成校验函数
export function makeRule<T = any>(
  handler: (value: T, context?: SchemaContext) => boolean | Promise<boolean>,
  message: Message,
  params?: any
) {
  return async (value: T, context?: SchemaContext): Promise<RuleReturn<T>> => {
    const res = await handler(value, context)
    if (res) return Valid(value)
    // TODO: 重新设计 Invalid
    return Invalid(value, formatMessage(message, context)(params))
  }
}
