/* eslint-disable no-underscore-dangle */
import { InputValue, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class OptionalSchema<T extends BaseSchema> extends BaseSchema<
  T['_Out'] | undefined
> {
  private innerType!: T

  constructor(innerType: T) {
    super('optional')
    this.innerType = innerType
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    // const valueType = getValueType(input.value)
    if (input.value === 'undefined') {
      return Valid(undefined)
    }
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerType: S) {
    return new OptionalSchema(innerType)
  }
}
