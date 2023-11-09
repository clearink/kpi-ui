import AnySchema from './schema/any'
import ArraySchema from './schema/array'
import BaseSchema, { EffectSchema, UnionSchema } from './schema/base'
import BooleanSchema from './schema/boolean'
import DateSchema from './schema/date'
import EnumSchema from './schema/enum'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import StringSchema from './schema/string'

// types
export type InferType<T extends BaseSchema> = T['_Out']
export type { BaseSchema }
export type { Options, SchemaIssue } from './interface'

// Schema
export const string = StringSchema.create
export const number = NumberSchema.create
export const boolean = BooleanSchema.create
export const object = ObjectSchema.create
export const any = AnySchema.create
export const array = ArraySchema.create
export const enums = EnumSchema.create
export const date = DateSchema.create
export const union = UnionSchema.create
export const refine = EffectSchema.refinement
export const { refinement, transform, preprocess } = EffectSchema
export { default as hasRequired } from './utils/required'

export default {
  string,
  number,
  boolean,
  object,
  any,
  array,
  enums,
  date,
  union,
  refine,
  transform,
  preprocess,
}
