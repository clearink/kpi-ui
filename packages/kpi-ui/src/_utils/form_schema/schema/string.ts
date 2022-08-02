/* eslint-disable class-methods-use-this */
import BaseSchema from './base'
import { Message } from '../types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'

export default class StringSchema extends BaseSchema<string> {
  static create() {
    return new StringSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
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
    return this.test((value) => /email/.test(value), message)
  }

  // TODO
  uuid(email: string, message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
  }
}
