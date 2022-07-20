import StringSchema from './schema/string'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'

// types
export * from './types/schema'

// schemas
export const string = StringSchema.create
export const number = NumberSchema.create
export const object = ObjectSchema.create
