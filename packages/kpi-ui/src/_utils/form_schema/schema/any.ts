/* eslint-disable class-methods-use-this */
import { InputValue, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class AnySchema extends BaseSchema<any> {
  static create() {
    return new AnySchema()
  }

  private isType() {
    return true
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    return Valid(input.value)
  }
}
