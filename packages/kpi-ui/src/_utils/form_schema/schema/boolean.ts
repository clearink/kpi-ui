/* eslint-disable class-methods-use-this */
import { MayBe, NonUndefined } from '../types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class BooleanSchema extends BaseSchema<boolean> {
  static create() {
    return new BooleanSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'boolean'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
}
