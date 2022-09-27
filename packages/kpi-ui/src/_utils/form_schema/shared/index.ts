import { isObject } from '../../is'
import { Message, RuleHandler, ValidateResult } from '../interface'

// 校验结果
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)
export const Invalid = Object.freeze({ status: 'invalid' } as const)

// 生成校验函数
export function makeRule<T extends any>(handler: RuleHandler, message?: Message) {
  const $message = isObject(message) ? message : { message }
  return async (value: T, context?: any): Promise<ValidateResult<T>> => {
    const res = await handler(value, context)
    if (!res) return { status: Invalid.status, ...$message }
    return Valid(value)
  }
}
