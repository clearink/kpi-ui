export type TypeChecker<T> = (value: any) => value is NonNullable<T>
export type Rule = (value: any) => boolean | Promise<boolean>
export type Message = string | { message: string }
export type MayBe<T> = T | null | undefined
export type NonUndefined<T> = T extends undefined ? never : T

export type EffectType = 'required' | 'nullable' 
