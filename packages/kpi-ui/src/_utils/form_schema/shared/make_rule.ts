import { Message, RuleHandler, RuleReturn } from '../interface'
import formatMessage from './format_message'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
export const Invalid = <T>(value: T, message: string) =>
  ({ status: 'invalid', value, message } as const)

// 生成校验函数
export function makeRule<T = any>(handler: RuleHandler, message: Message, params?: any) {
  return (value: T, context?: any): RuleReturn<T> => {
    const res = handler(value, context)
    if (res) return Valid(value)
    const $message = formatMessage(message)
    return Invalid(value, $message(params))
  }
}
