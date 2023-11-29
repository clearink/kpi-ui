export type AnyFunction<R = any> = (...args: any[]) => R
export type AnyObject = Record<string, any>
export type MayBe<T> = T | null | undefined
export type Nothing = Omit<object, keyof any>
export type LiteralUnion<T, U> = T | (U & Nothing)
