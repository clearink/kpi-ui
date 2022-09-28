import * as Schema from './schema'

// types
// eslint-disable-next-line @typescript-eslint/naming-convention
export type infer<T extends Schema.BaseSchema> = T['_Out']

// Schema
export const string = Schema.StringSchema.create
export const boolean = Schema.BooleanSchema.create
export const number = Schema.NumberSchema.create
export const object = Schema.ObjectSchema.create
export const any = Schema.AnySchema.create
export const array = Schema.ArraySchema.create
export const enums = Schema.EnumSchema.create
export const date = Schema.DateSchema.create
