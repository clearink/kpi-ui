import type { Context, Message, RuleReturn } from '../interface'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
// 透传 context 去收集全部的错误信息
export const Invalid = { status: 'invalid' } as const

// 生成校验函数
export function makeRule<T = any>(
  handler: (value: T, context: Context) => boolean | Promise<boolean>,
  message: Message,
  params?: any
) {
  return async (value: T, context: Context): Promise<RuleReturn<T>> => {
    const res = await handler(value, context)
    if (res) return Valid(value)
    context.issue.addIssue(message, context.path, params)
    return Invalid
  }
}
