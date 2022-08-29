import { isObject } from '../../validate_type'

// 校验结果
export type ValidType<T> = { status: 'valid'; value: T }
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)

export type InValidType = { status: 'invalid' }
export const Invalid = Object.freeze({ status: 'invalid' } as const)

export type DirtyType<T> = { status: 'dirty'; value: T }
export const Dirty = <T>(value: T) => ({ status: 'dirty', value } as const)

export type TestResult<T> =
  | {
      status: 'valid'
      value: T
    }
  | {
      status: 'invalid'
      error: string
    }

// 校验返回值
export type ValidateResult<T> =
  | ValidType<T>
  | InValidType
  | DirtyType<T>
  | Promise<ValidType<T> | InValidType | DirtyType<T>>

export type RuleHandler = (value: any, context?: any) => boolean | Promise<boolean>
export type ValidateRule = <T>(value: T, context?: any) => ValidateResult<T>
export type Message = string | { message: string }

// 生成校验函数
export function makeRule<T extends any>(handler: RuleHandler, message?: Message) {
  const $message = isObject(message) ? message : { message }
  return async (value: T, context?: any): Promise<TestResult<T>> => {
    const res = await handler(value, context)
    if (!res) return { status: Invalid.status, ...$message, value }
    return Valid(value)
  }
}

export function isPromiseLike(value: any): value is PromiseLike<unknown> {
  return !!value && typeof value.then === 'function'
}
