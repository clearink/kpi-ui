import { Context, Message, RuleReturn } from '../interface'

import formatMessage from './format_message'

// 校验结果
export const Valid = <T>(value: T) => ({ value } as const)
export const Invalid = <T>(value: T, message: string, context?: Context) => {
  if (context) {
    const msg = formatMessage(message)({}, context)
    return { value, message: msg } as const
  }
  return { value, message } as const
}

// 生成校验函数
export function makeRule<T = any>(
  handler: (value: T, context?: any) => boolean | Promise<boolean>,
  message: Message,
  params?: any
) {
  return async (value: T, context?: Context): Promise<RuleReturn<T>> => {
    const res = await handler(value, context)
    if (res) return Valid(value)
    // 替换 path 传进去
    const $message = formatMessage(message)(params, context)
    // TODO: 重新设计 Invalid
    return Promise.reject(Invalid(value, $message))
  }
}
