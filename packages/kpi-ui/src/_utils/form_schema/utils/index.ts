// 校验结果
export type ValidType<T> = { status: 'valid'; value: T }
export const Valid = <T>(value: T) => ({ status: 'valid', value } as const)

export type InValidType<T> = { status: 'invalid'; value: T }
export const Invalid = <T>(value: T) => ({ status: 'invalid', value } as const)

export type DirtyType<T> = { status: 'dirty'; value: T }
export const Dirty = <T>(value: T) => ({ status: 'dirty', value } as const)

// 输入值
export type InputValue = { value: any; parent: any; path: any[] }

// 校验返回值
export type ValidateReturnType<T> =
  | ValidType<T>
  | InValidType<T>
  | DirtyType<T>
  | Promise<ValidType<T>>
  | Promise<InValidType<T>>
  | Promise<DirtyType<T>>

export function isPromiseLike(value: any): value is PromiseLike<unknown> {
  return !!value && typeof value.then === 'function'
}
