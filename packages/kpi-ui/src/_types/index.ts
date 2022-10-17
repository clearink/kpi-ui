export declare type LiteralUnion<T extends U, U> = T | (U & {})
export declare type ArrowFunction<R extends unknown = any> = (...args: any[]) => R

export declare type NonUndefined<T> = T extends undefined ? never : T
export declare type AnyObject = Record<string, any>
export declare type MayBe<T> = T | null | undefined

export declare type Writable<T> = { -readonly [P in keyof T]: T[P] }
export declare type Full<T> = T extends {} ? { [K in keyof T]: T[K] } : T
export declare type Equal<T, U> = T extends U ? (U extends T ? true : false) : false
