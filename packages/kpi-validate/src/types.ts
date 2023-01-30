export type AnyObject = Record<string, any>
export type NonUndefined<T> = T extends undefined ? never : T
export type MayBe<T> = T | null | undefined
export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type Full<T> = T extends {} ? { [K in keyof T]: T[K] } : T
