/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { InputValue, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class NullableSchema<T extends BaseSchema> extends BaseSchema<T['_Out'] | null> {
  private innerType!: T

  constructor(innerType: T) {
    super('nullable')
    this.innerType = innerType
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (input.value === null) {
      return Valid(null)
    }
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerType: S) {
    return new NullableSchema(innerType)
  }
}
