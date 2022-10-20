import type { Context, Message, RuleReturn } from '../interface'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
// TODO: 传入 context 检测是否有 abortEarly 如果有直接 返回 Promise.reject 即可实现
// TODO 还是不能直接在 validate 函数里面直接添加， 在这里添加比较好
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
    return Invalid(context)(message, params)
  }
}
