import StringSchema from './schema/string'
import BooleanSchema from './schema/boolean'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import ArraySchema from './schema/array'
import AnySchema from './schema/any'
import UnionSchema from './schema/union'
import IntersectionSchema from './schema/intersection'
import EnumSchema from './schema/enums'

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

export { any, string, boolean, number, object, array, union, or, intersection, and, enums as enum }

const a = ['a', 'b', 'c'] as const
const o = object({
  // a: string().min(1),
  // aa: string().min(1).required(),
  // aaa: boolean(),
  b: object(),
  c: array(),
  gg: enums(['a', 'b', 'b']),
  // d: array(object({ a: number() })),
  // // dd: array(number()),
  // ee: and([object({ a: number() }), object({ b: number().required() })]).required(),
  // ff: or([number(), string()]).required(),
})
type OOO = typeof o._Out
