import * as Schema from './schema'

// types
export type Infer<T extends Schema.BaseSchema> = T['_Out']

// Schema
export const string = Schema.StringSchema.create
export const number = Schema.NumberSchema.create
export const boolean = Schema.BooleanSchema.create
export const object = Schema.ObjectSchema.create
export const any = Schema.AnySchema.create
export const array = Schema.ArraySchema.create
export const enums = Schema.EnumSchema.create
export const date = Schema.DateSchema.create
export const optional = Schema.OptionalSchema.create
export const nullable = Schema.NullableSchema.create
export const refine = Schema.EffectSchema.refinement
export const { transform, preprocess } = Schema.EffectSchema
