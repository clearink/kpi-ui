import type { Context, Message, RuleReturn } from '../interface'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)

export const Invalid = (context: Context) => {
  return (message: Message, params?: any) => {
    if (context.abortEarly === true && !context.issue.isEmpty) {
      return Promise.reject(context.issue)
    }
    context.issue.addIssue(message, context.path, params)
    return { status: 'invalid' } as const
  }
}

// 生成校验函数
export function makeRule<T = any>(
  handler: (value: T, context: Context) => boolean | Promise<boolean>,
  message: Message,
  params?: any
) {
  return async (value: T, context: Context): Promise<RuleReturn<T>> => {
    const res = await handler(value, context)
    if (res) return Valid(value)
    return Invalid(context)(message, { value, ...params })
  }
}
