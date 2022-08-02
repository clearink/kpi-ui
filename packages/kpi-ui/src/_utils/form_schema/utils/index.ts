// 校验结果
export type ValidType<T> = { status: 'valid'; value: T }
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)

export type InValidType = { status: 'invalid' }
export const Invalid = Object.freeze({ status: 'invalid' })

export type DirtyType<T> = { status: 'dirty'; value: T }
export const Dirty = <T>(value: T) => ({ status: 'dirty', value } as const)

// 输入值
export type InputValue<T extends any = any> = { value: T; parent: any; path: any[] }

// 校验返回值
export type ValidateReturnType<T> =
  | ValidType<T>
  | InValidType
  | DirtyType<T>
  | Promise<ValidType<T>>
  | Promise<InValidType>
  | Promise<DirtyType<T>>

export function isPromiseLike(value: any): value is PromiseLike<unknown> {
  return !!value && typeof value.then === 'function'
}

export function toRawType(source: any) {
  return Object.prototype.toString.call(source).slice(8, -1).toLowerCase()
}
