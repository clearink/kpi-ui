/* eslint-disable class-methods-use-this */
import { ValidateInput } from '../schema'
import { Valid } from '../shared'
import BaseSchema from './base'

export default class AnySchema extends BaseSchema {
  static create() {
    return new AnySchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  public isType() {
    return true
  }

  // TODO: ValidateInput 还要优化一下
  public _validate(input: ValidateInput) {
    return Valid(input.value)
  }
}
