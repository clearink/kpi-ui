import BaseSchema from '../schema/base'
import ObjectSchema from '../schema/object'
import StringSchema from '../schema/string'

export type TypeChecker<T> = (value: any) => value is NonNullable<T>
export type Rule = (value: any) => boolean | Promise<boolean>
export type Message = string | { message: string }
export type MayBe<T> = T | null | undefined
export type NonUndefined<T> = T extends undefined ? never : T

export type EffectType = 'required' | 'nullable'
export type AnyRecord = Record<string, any>

// TODO: 优化类型
export type ObjectShape = Record<string, BaseSchema<any>>

export type OptionalKey<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_type'] ? never : K
}[keyof T]

export type RequiredKey<T extends ObjectShape> = Exclude<keyof T, OptionalKey<T>>

export type MakePartialKey<T extends ObjectShape> = {
  [K in OptionalKey<T>]: T[K]['_type']
} & { [K in RequiredKey<T>]?: T[K]['_type'] }

export type TypeOf<T extends BaseSchema> = T extends ObjectSchema<any>
  ? MakePartialKey<T['shape']>
  : // TODO: ArraySchema
  T extends BaseSchema<infer O>
  ? O
  : never
export type { TypeOf as infer }
type o = { a: StringSchema }
type C = {
  [K in keyof o]: undefined extends o['a']['_type'] ? true : false
}[keyof o]
type A = OptionalKey<{ a: StringSchema<string> }>
