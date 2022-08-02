import StringSchema from './schema/string'
import BooleanSchema from './schema/boolean'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import ArraySchema from './schema/array'
import AnySchema from './schema/any'
import UnionSchema from './schema/union'
import IntersectionSchema from './schema/intersection'
import EnumSchema from './schema/enums'
import DateSchema from './schema/date'

// types
export * from './types'

// schemas

const string = StringSchema.create
const boolean = BooleanSchema.create
const number = NumberSchema.create
const object = ObjectSchema.create
const any = AnySchema.create
const array = ArraySchema.create
const union = UnionSchema.create
const or = UnionSchema.create
const intersection = IntersectionSchema.create
const and = IntersectionSchema.create
const enums = EnumSchema.create
const data = DateSchema.create

export {
  any,
  string,
  boolean,
  number,
  object,
  array,
  union,
  or,
  intersection,
  and,
  enums as enum,
  data,
}

const a = ['a', 'b', 'c'] as const
const o = object({
  // a: string().min(1),
  // aa: string().min(1).optional(),
  // aaa: boolean(),
  // b: object({
  //   a: string(),
  // }),
  // c: array(number()),
  // gg: enums(['a', 'b', 'b']),
  d: array(object({ a: number() })),
  dd: array(number()),
  ee: and([object({ a: number() }), object({ b: number() })]),
  ff: or([number(), string()]).optional(),
})
type OOO = typeof o._Out
