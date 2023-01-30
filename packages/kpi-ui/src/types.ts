export type AnyFunction<R extends unknown = any> = (...args: any[]) => R
export type AnyObject = Record<string, any>

export type LiteralUnion<T extends U, U> = T | (U & {})

export type NonUndefined<T> = T extends undefined ? never : T
export type MayBe<T> = T | null | undefined

export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type Full<T> = T extends {} ? { [K in keyof T]: T[K] } : T
export type Equal<T, U> = T extends U ? (U extends T ? true : false) : false

// TODO: 移到kpi-ui去
// config-provider
export type SizeType = 'small' | 'middle' | 'large' | undefined
export type DisabledType = true | false | undefined

export type Size = SizeType | number
