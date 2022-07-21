import BaseSchema from '.'
import { MayBe, NonUndefined } from './schema'

export default interface StringSchema<T extends MayBe<string>> extends BaseSchema<T> {
  required(): StringSchema<NonUndefined<T>>
  optional(): StringSchema<T | undefined>
  nullable(): StringSchema<T | null>
  nullish(): StringSchema<T | undefined | null>
}
