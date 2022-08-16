export type Rule = (value: any) => boolean | Promise<boolean>
export type Message = string | { message: string }
export type MayBe<T> = T | null | undefined
export type NonUndefined<T> = T extends undefined ? never : T
export type EffectType = 'required' | 'nullable'
export type AnyObject = Record<string, any>

export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type FullType<T> = T extends {} ? { [K in keyof T]: T[K] } : T
