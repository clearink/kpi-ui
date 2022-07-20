import StringSchema from './schema/string'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'

export default {
  string: StringSchema.create,
  number: NumberSchema.create,
  object: ObjectSchema.create,
}
