/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-cycle */
import BaseSchema from './base'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'

export default class OptionalSchema<T extends BaseSchema> extends BaseSchema<
  T['_Out'] | undefined
> {
  constructor(private readonly innerType: T) {
    super()
  }

  private isType(input: InputValue) {
    return toRawType(input.value) === 'undefined'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (this.isType(input)) return Valid(input.value)
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerSchema: S) {
    return new OptionalSchema(innerSchema)
  }
}
