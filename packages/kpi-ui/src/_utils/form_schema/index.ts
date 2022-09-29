import StringSchema from './schema/string'
import BaseSchema from './schema/base'
import BooleanSchema from './schema/boolean'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'
import AnySchema from './schema/any'
import { ArraySchema } from './schema/array'
import { EnumSchema } from './schema/enum'
import DateSchema from './schema/date'

// types
// eslint-disable-next-line @typescript-eslint/naming-convention
export type infer<T extends BaseSchema> = T['_Out']

// Schema
export const string = StringSchema.create
export const boolean = BooleanSchema.create
export const number = NumberSchema.create
export const object = ObjectSchema.create
export const any = AnySchema.create // 是否能够直接使用 BaseSchema 呢 ?
export const array = ArraySchema.create
export const enums = EnumSchema.create
export const date = DateSchema.create
