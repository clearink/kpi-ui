import StringSchema from './schema/string'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import ArraySchema from './schema/array'
import AnySchema from './schema/any'
import AndSchema from './schema/and'
import OrSchema from './schema/or'

// types
export * from './types'

// schemas
export const string = StringSchema.create
export const number = NumberSchema.create
export const object = ObjectSchema.create
export const any = AnySchema.create
export const array = ArraySchema.create
export const and = AndSchema.create
export const or = OrSchema.create

const o = object({
  a: string().min(1),
  c: array(),
  d: array(object({ a: number() })),
  dd: array(number()),
  ee: and([number(), string()]),
  ff: or([number(), string()]),
})
type A = typeof o._Out
