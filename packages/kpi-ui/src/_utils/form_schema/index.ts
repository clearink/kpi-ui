import StringSchema from './schema/string'
import BooleanSchema from './schema/boolean'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import ArraySchema from './schema/array'
import AnySchema from './schema/any'
import UnionSchema from './schema/union'
import IntersectionSchema from './schema/intersection'

// types
export * from './types'

// schemas
export const string = StringSchema.create
export const boolean = BooleanSchema.create
export const number = NumberSchema.create
export const object = ObjectSchema.create
export const any = AnySchema.create
export const array = ArraySchema.create
export const union = UnionSchema.create
export const or = UnionSchema.create
export const intersection = IntersectionSchema.create
export const and = IntersectionSchema.create

const o = object({
  a: string().min(1),
  aa: string().min(1).required(),
  aaa: boolean(),
  b: object(),
  c: array(),
  d: array(object({ a: number() })),
  dd: array(number()),
  ee: and([object({ a: number() }), object({ b: number().required() })]).required(),
  ff: or([number(), string()]).required(),
})
type OOO = typeof o._Out
