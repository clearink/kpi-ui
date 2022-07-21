import BaseSchema from '.'
import { MayBe, NonUndefined } from './schema'
import StringSchema from './string'
export type ObjectShape = Record<string, BaseSchema>

export type OptionalSchema<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_IN'] ? K : never
}[keyof T]

export type RequiredSchema<T extends ObjectShape> = Exclude<keyof T, OptionalSchema<T>>

export type OutPut<T extends ObjectShape> = {
  [P in OptionalSchema<T>]?: T[P] extends ObjectSchema ? OutPut<T[P]['shape']> : T[P]['_OUT']
} & {
  [P in RequiredSchema<T>]: T[P] extends ObjectSchema ? OutPut<T[P]['shape']> : T[P]['_OUT']
}

export default interface ObjectSchema<T extends MayBe<ObjectShape> = ObjectShape>
  extends BaseSchema<T> {
  readonly shape: T
  readonly _IN: T
  readonly _OUT: any
  required(): ObjectSchema<NonUndefined<T>>
  optional(): ObjectSchema<T | undefined>
  nullable(): ObjectSchema<T | null>
  nullish(): ObjectSchema<T | undefined | null>
}

type O = ObjectSchema<{
  // a: StringSchema<string>
  // b: StringSchema<string | undefined>
  // c: StringSchema<string>
  d: StringSchema<string>
  e: ObjectSchema<
    | {
        a: StringSchema<string>
        b: StringSchema<string | undefined>
        c: StringSchema<string>
        d?: StringSchema<string>
      }
    | undefined
  >
}>
type OO = OutPut<O['_IN']>
