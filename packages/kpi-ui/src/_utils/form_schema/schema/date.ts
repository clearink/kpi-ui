/* eslint-disable class-methods-use-this */
import BaseSchema from './base'
import { Message } from '../types'
import { InputValue, toRawType, ValidateReturnType, Invalid, Valid } from '../utils'

export default class DateSchema extends BaseSchema<Date> {
  static create() {
    return new DateSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    const isDate = toRawType(input.value) === 'date'
    return isDate && !Number.isNaN(input.value?.getTime())
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }
  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  min(len: number, message?: Message) {
    return this.test((value) => value.length >= len, message)
  }

  max(len: number, message?: Message) {
    return this.test((value) => value.length <= len, message)
  }

  length(len: number, message?: Message) {
    return this.test((value) => value.length === len, message)
  }

  // TODO
  email(email: string, message?: Message) {
    return this.test((value) => /some/.test(value), message)
  }

  // TODO
  uuid(email: string, message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
  }
}
