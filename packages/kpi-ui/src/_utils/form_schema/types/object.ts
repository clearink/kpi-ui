import { AnyObject, FullType, MayBe, NonUndefined, Schema } from "./schema";

export type ObjectShape = Record<string, Schema>

export type OptionalSchema<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_In'] ? K : never
}[keyof T]

export type RequiredSchema<T extends ObjectShape> = Exclude<keyof T, OptionalSchema<T>>

export type FilterSchema<T extends ObjectShape> = FullType<{
  [K in keyof T]: T[K] extends Schema ? T[K] : never
}>
// group
export type GroupPartial<T extends ObjectShape> = {
  [P in OptionalSchema<T>]?: NonUndefined<T[P]['_Out']>
} & {
  [P in RequiredSchema<T>]: NonUndefined<T[P]['_Out']>
}

export type MakePartial<T extends MayBe<ObjectShape>> = T extends AnyObject
  ? FullType<GroupPartial<T>>
  : T
