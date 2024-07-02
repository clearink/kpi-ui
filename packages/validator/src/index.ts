import type BaseSchema from './schema/base'

import AnySchema from './schema/any'
import ArraySchema from './schema/array'
import { EffectSchema, UnionSchema } from './schema/base'
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
export const { preprocess, refinement, transform } = EffectSchema
export { default as hasRequired } from './utils/required'

export default {
  any,
  array,
  boolean,
  date,
  enums,
  number,
  object,
  preprocess,
  refine,
  string,
  transform,
  union,
}
