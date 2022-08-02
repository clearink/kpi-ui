/* eslint-disable class-methods-use-this */
import BaseSchema from './base'
import { Message } from '../types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'

export default class NumberSchema extends BaseSchema<number> {
  static create() {
    return new NumberSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType(input: InputValue) {
    if (Number.isNaN(input.value)) {
      return false
    }
    return toRawType(input.value) === 'number'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  min(num: number, message?: Message) {
    return this.test((value: number) => value >= num, message)
  }

  max(num: number, message?: Message) {
    return this.test((value: number) => value <= num, message)
  }

  equal(num: number, message?: Message) {
    return this.test((value: number) => value === num, message)
  }

  positive(message?: Message) {
    return this.test((value: number) => value > 0, message)
  }

  negative(message?: Message) {
    return this.test((value: number) => value < 0, message)
  }

  integer(message?: Message) {
    return this.test((value: number) => Number.isInteger(value), message)
  }
}
