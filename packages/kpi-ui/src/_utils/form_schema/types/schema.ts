export type TypeChecker<T> = (value: any) => value is NonNullable<T>
export type Rule = (value: any) => boolean | Promise<boolean>
export type Message = string | { message: string }
export type MayBe<T> = T | null | undefined
export type NonUndefined<T> = T extends undefined ? never : T
export type EffectType = 'required' | 'nullable'
export type AnyObject = Record<string, any>
export type FullType<T> = T extends {} ? { [K in keyof T]: T[K] } : T

export interface Schema<In = any, Out = any> {
  _In: In
  _Out: Out
}

export type TypeOf<T extends Schema> = T['_Out']
export type { TypeOf as infer }
