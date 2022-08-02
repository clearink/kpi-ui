/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import BaseSchema from './base'
import { InputValue, toRawType, Valid, ValidateReturnType } from '../utils'

export default class NullableSchema<T extends BaseSchema> extends BaseSchema<T['_Out'] | null> {
  constructor(private readonly innerType: T) {
    super()
  }

  private isType(input: InputValue) {
    return toRawType(input.value) === 'null'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (this.isType(input)) return Valid(input.value)
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerSchema: S) {
    return new NullableSchema(innerSchema)
  }
}
